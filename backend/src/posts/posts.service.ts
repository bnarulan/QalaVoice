import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const VIDEO_MAX_SIZE = 50 * 1024 * 1024; // 50MB

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, content: string, address: string, lat?: number, lng?: number, type = 'COMPLAINT', sphere = 'general') {
    const post = await this.prisma.post.create({
      data: { content, address, lat, lng, userId, type, status: 'SUBMITTED' },
      include: { media: true },
    });
    await this.prisma.postStatus.create({
      data: { postId: post.id, status: 'Жалоба отправлена' },
    });
    try {
      const freeExecutor = await this.findFreeExecutor(sphere);
      if (freeExecutor) {
        await this.prisma.post.update({
          where: { id: post.id },
          data: { executorId: freeExecutor.id, status: 'ASSIGNED' },
        });
        await this.prisma.postStatus.create({
          data: { postId: post.id, status: `Принял жалобу и исполняет: ${freeExecutor.user.fullName}` },
        });
      }
    } catch {
      // ignore if no executors
    }
    return this.prisma.post.findUnique({
      where: { id: post.id },
      include: { media: true, executor: { include: { user: { select: { fullName: true } } } }, statusHistory: true, _count: { select: { likes: true } } },
    });
  }

  private async findFreeExecutor(sphere: string) {
    const busy = await this.prisma.post.findMany({
      where: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] }, executorId: { not: null } },
      select: { executorId: true },
    });
    const busyIds = [...new Set(busy.map((p) => p.executorId).filter(Boolean))] as number[];
    return this.prisma.executor.findFirst({
      where: { sphere: sphere || 'general', isActive: true, id: { notIn: busyIds } },
      include: { user: { select: { fullName: true } } },
    });
  }

  async addPhoto(postId: number, file: Express.Multer.File) {
    this.ensureUploadsDir();
    const ext = file.originalname?.split('.').pop() || 'jpg';
    const filename = `${randomUUID()}.${ext}`;
    const path = join(process.cwd(), 'uploads', filename);
    const writeStream = createWriteStream(path);
    writeStream.write(file.buffer);
    writeStream.end();

    return this.prisma.media.create({
      data: { postId, type: 'PHOTO', url: `/uploads/${filename}` },
    });
  }

  async addVideo(postId: number, file: Express.Multer.File) {
    if (file.size > VIDEO_MAX_SIZE) {
      throw new Error('Video size exceeds 50MB limit');
    }
    this.ensureUploadsDir();
    const ext = file.originalname?.split('.').pop() || 'mp4';
    const filename = `${randomUUID()}.${ext}`;
    const path = join(process.cwd(), 'uploads', filename);
    const writeStream = createWriteStream(path);
    writeStream.write(file.buffer);
    writeStream.end();

    return this.prisma.media.create({
      data: { postId, type: 'VIDEO', url: `/uploads/${filename}`, size: file.size },
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          media: true,
          comments: { select: { id: true, content: true, createdAt: true } },
          executor: { include: { user: { select: { fullName: true } } } },
          statusHistory: { orderBy: { createdAt: 'asc' } },
          _count: { select: { likes: true } },
        },
      }),
      this.prisma.post.count(),
    ]);
    const withPriority = posts.map((p) => ({
      ...p,
      priority: (p._count.likes || 0) * 2 + (p.status === 'SUBMITTED' ? 3 : p.status === 'ASSIGNED' ? 2 : 1),
    }));
    withPriority.sort((a, b) => b.priority - a.priority);
    return { posts: withPriority, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        media: true,
        comments: { select: { id: true, content: true, createdAt: true } },
        executor: { include: { user: { select: { fullName: true } } } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
        _count: { select: { likes: true } },
      },
    });
  }

  async acceptAndSetDeadline(postId: number, userId: number, deadline: Date) {
    const executor = await this.prisma.executor.findUnique({ where: { userId }, include: { user: true } });
    if (!executor) throw new Error('Вы не являетесь исполнителем');
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.executorId) throw new Error('Post not found or already assigned');
    await this.prisma.post.update({
      where: { id: postId },
      data: { executorId: executor.id, status: 'ASSIGNED', deadline },
    });
    const exec = executor;
    await this.prisma.postStatus.create({
      data: { postId, status: `Принял жалобу и исполняет: ${exec.user.fullName}. Срок: ${deadline.toLocaleDateString('ru')}` },
    });
    return this.findOne(postId);
  }

  async updateStatus(postId: number, status: string) {
    await this.prisma.post.update({ where: { id: postId }, data: { status } });
    await this.prisma.postStatus.create({ data: { postId, status } });
    return this.findOne(postId);
  }

  private ensureUploadsDir() {
    const dir = join(process.cwd(), 'uploads');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }
}
