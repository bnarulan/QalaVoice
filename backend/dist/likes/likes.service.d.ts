import { PrismaService } from '../prisma/prisma.service';
export declare class LikesService {
    private prisma;
    constructor(prisma: PrismaService);
    toggle(postId: number, userId: number): Promise<{
        liked: boolean;
    }>;
    count(postId: number): Promise<number>;
}
