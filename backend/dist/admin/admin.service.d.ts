import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getHotSpots(): Promise<{
        hotSpots: {
            lat: number;
            lng: number;
            address: string;
            count: number;
            type: string;
        }[];
        stats: {
            executorsTotal: number;
            executorsActive: number;
            executorsBusy: number;
            executorsFree: number;
            postsTotal: number;
            postsSubmitted: number;
            postsInProgress: number;
            postsDone: number;
        };
    }>;
}
