import { LikesService } from './likes.service';
import { Request } from 'express';
export declare class LikesController {
    private likes;
    constructor(likes: LikesService);
    toggle(body: {
        postId: number;
    }, req: Request & {
        user: {
            userId: number;
        };
    }): Promise<{
        liked: boolean;
    }>;
}
