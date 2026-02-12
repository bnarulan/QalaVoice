import { RatingService } from './rating.service';
import { Request } from 'express';
export declare class RatingController {
    private rating;
    constructor(rating: RatingService);
    add(body: {
        score: number;
    }, req: Request & {
        user: {
            userId: number;
        };
    }): Promise<{
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
