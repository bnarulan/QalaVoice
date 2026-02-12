"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs_1 = require("fs");
const path_1 = require("path");
const crypto_1 = require("crypto");
const VIDEO_MAX_SIZE = 50 * 1024 * 1024;
let PostsService = class PostsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, content, address, lat, lng, type = 'COMPLAINT', sphere = 'general') {
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
        }
        catch {
        }
        return this.prisma.post.findUnique({
            where: { id: post.id },
            include: { media: true, executor: { include: { user: { select: { fullName: true } } } }, statusHistory: true, _count: { select: { likes: true } } },
        });
    }
    async findFreeExecutor(sphere) {
        const busy = await this.prisma.post.findMany({
            where: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] }, executorId: { not: null } },
            select: { executorId: true },
        });
        const busyIds = [...new Set(busy.map((p) => p.executorId).filter(Boolean))];
        return this.prisma.executor.findFirst({
            where: { sphere: sphere || 'general', isActive: true, id: { notIn: busyIds } },
            include: { user: { select: { fullName: true } } },
        });
    }
    async addPhoto(postId, file) {
        this.ensureUploadsDir();
        const ext = file.originalname?.split('.').pop() || 'jpg';
        const filename = `${(0, crypto_1.randomUUID)()}.${ext}`;
        const path = (0, path_1.join)(process.cwd(), 'uploads', filename);
        const writeStream = (0, fs_1.createWriteStream)(path);
        writeStream.write(file.buffer);
        writeStream.end();
        return this.prisma.media.create({
            data: { postId, type: 'PHOTO', url: `/uploads/${filename}` },
        });
    }
    async addVideo(postId, file) {
        if (file.size > VIDEO_MAX_SIZE) {
            throw new Error('Video size exceeds 50MB limit');
        }
        this.ensureUploadsDir();
        const ext = file.originalname?.split('.').pop() || 'mp4';
        const filename = `${(0, crypto_1.randomUUID)()}.${ext}`;
        const path = (0, path_1.join)(process.cwd(), 'uploads', filename);
        const writeStream = (0, fs_1.createWriteStream)(path);
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
    async findOne(id) {
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
    async acceptAndSetDeadline(postId, userId, deadline) {
        const executor = await this.prisma.executor.findUnique({ where: { userId }, include: { user: true } });
        if (!executor)
            throw new Error('Вы не являетесь исполнителем');
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post || post.executorId)
            throw new Error('Post not found or already assigned');
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
    async updateStatus(postId, status) {
        await this.prisma.post.update({ where: { id: postId }, data: { status } });
        await this.prisma.postStatus.create({ data: { postId, status } });
        return this.findOne(postId);
    }
    ensureUploadsDir() {
        const dir = (0, path_1.join)(process.cwd(), 'uploads');
        if (!(0, fs_1.existsSync)(dir))
            (0, fs_1.mkdirSync)(dir, { recursive: true });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map