import { PrismaService } from '../prisma/prisma.service';
export declare class RatingService {
    private prisma;
    constructor(prisma: PrismaService);
    add(userId: number, score: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        score: number;
    }>;
    getLeaderboard(): Promise<{
        userId: number;
        avgScore: number;
        count: number;
        displayName: string;
    }[]>;
}
