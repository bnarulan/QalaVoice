import { ExecutorsService } from './executors.service';
export declare class ExecutorsController {
    private executors;
    constructor(executors: ExecutorsService);
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
    findFree(sphere: string): Promise<({
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
