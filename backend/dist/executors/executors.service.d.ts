import { PrismaService } from '../prisma/prisma.service';
export declare class ExecutorsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        user: {
            fullName: string;
            iin: string;
        };
    } & {
        id: number;
        createdAt: Date;
        sphere: string;
        isActive: boolean;
        userId: number;
    })[]>;
    findFreeBySphere(sphere: string): Promise<({
        user: {
            fullName: string;
        };
    } & {
        id: number;
        createdAt: Date;
        sphere: string;
        isActive: boolean;
        userId: number;
    })[]>;
}
