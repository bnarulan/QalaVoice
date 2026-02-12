import { PrismaService } from '../prisma/prisma.service';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(postId: number, userId: number, content: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        content: string;
        postId: number;
    }>;
    findByPost(postId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        content: string;
        postId: number;
    }[]>;
}
