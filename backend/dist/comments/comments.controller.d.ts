import { CommentsService } from './comments.service';
import { Request } from 'express';
export declare class CommentsController {
    private comments;
    constructor(comments: CommentsService);
    create(body: {
        postId: number;
        content: string;
    }, req: Request & {
        user: {
            userId: number;
        };
    }): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        content: string;
        postId: number;
    }>;
    findByPost(postId: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        content: string;
        postId: number;
    }[]>;
}
