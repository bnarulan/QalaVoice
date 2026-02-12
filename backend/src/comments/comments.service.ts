import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(postId: number, userId: number, content: string) {
    const existing = await this.prisma.comment.findFirst({
      where: { postId, userId },
    });
    if (existing) throw new ConflictException('Один пользователь может оставить только один комментарий к посту');
    return this.prisma.comment.create({
      data: { postId, userId, content },
    });
  }

  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
