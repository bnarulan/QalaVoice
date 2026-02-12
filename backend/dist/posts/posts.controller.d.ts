import { PostsService } from './posts.service';
import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsController {
    private posts;
    constructor(posts: PostsService);
    create(dto: CreatePostDto, req: Request & {
        user: {
            userId: number;
        };
    }): Promise<{
        executor: {
            user: {
                fullName: string;
            };
        } & {
            id: number;
            createdAt: Date;
            sphere: string;
            isActive: boolean;
            userId: number;
        };
        media: {
            id: number;
            createdAt: Date;
            type: string;
            postId: number;
            url: string;
            size: number | null;
        }[];
        _count: {
            likes: number;
        };
        statusHistory: {
            id: number;
            createdAt: Date;
            status: string;
            postId: number;
        }[];
    } & {
        id: number;
        address: string;
        createdAt: Date;
        userId: number;
        content: string;
        lat: number | null;
        lng: number | null;
        type: string;
        status: string;
        deadline: Date | null;
        executorId: number | null;
    }>;
    uploadPhoto(id: string, file: Express.Multer.File): Promise<{
        id: number;
        createdAt: Date;
        type: string;
        postId: number;
        url: string;
        size: number | null;
    }>;
    uploadVideo(id: string, file: Express.Multer.File): Promise<{
        id: number;
        createdAt: Date;
        type: string;
        postId: number;
        url: string;
        size: number | null;
    }>;
    findAll(page?: string, limit?: string): Promise<{
        posts: {
            priority: number;
            executor: {
                user: {
                    fullName: string;
                };
            } & {
                id: number;
                createdAt: Date;
                sphere: string;
                isActive: boolean;
                userId: number;
            };
            media: {
                id: number;
                createdAt: Date;
                type: string;
                postId: number;
                url: string;
                size: number | null;
            }[];
            comments: {
                id: number;
                createdAt: Date;
                content: string;
            }[];
            _count: {
                likes: number;
            };
            statusHistory: {
                id: number;
                createdAt: Date;
                status: string;
                postId: number;
            }[];
            id: number;
            address: string;
            createdAt: Date;
            userId: number;
            content: string;
            lat: number | null;
            lng: number | null;
            type: string;
            status: string;
            deadline: Date | null;
            executorId: number | null;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        executor: {
            user: {
                fullName: string;
            };
        } & {
            id: number;
            createdAt: Date;
            sphere: string;
            isActive: boolean;
            userId: number;
        };
        media: {
            id: number;
            createdAt: Date;
            type: string;
            postId: number;
            url: string;
            size: number | null;
        }[];
        comments: {
            id: number;
            createdAt: Date;
            content: string;
        }[];
        _count: {
            likes: number;
        };
        statusHistory: {
            id: number;
            createdAt: Date;
            status: string;
            postId: number;
        }[];
    } & {
        id: number;
        address: string;
        createdAt: Date;
        userId: number;
        content: string;
        lat: number | null;
        lng: number | null;
        type: string;
        status: string;
        deadline: Date | null;
        executorId: number | null;
    }>;
    accept(id: string, body: {
        deadline: string;
    }, req: Request & {
        user: {
            userId: number;
        };
    }): Promise<{
        executor: {
            user: {
                fullName: string;
            };
        } & {
            id: number;
            createdAt: Date;
            sphere: string;
            isActive: boolean;
            userId: number;
        };
        media: {
            id: number;
            createdAt: Date;
            type: string;
            postId: number;
            url: string;
            size: number | null;
        }[];
        comments: {
            id: number;
            createdAt: Date;
            content: string;
        }[];
        _count: {
            likes: number;
        };
        statusHistory: {
            id: number;
            createdAt: Date;
            status: string;
            postId: number;
        }[];
    } & {
        id: number;
        address: string;
        createdAt: Date;
        userId: number;
        content: string;
        lat: number | null;
        lng: number | null;
        type: string;
        status: string;
        deadline: Date | null;
        executorId: number | null;
    }>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<{
        executor: {
            user: {
                fullName: string;
            };
        } & {
            id: number;
            createdAt: Date;
            sphere: string;
            isActive: boolean;
            userId: number;
        };
        media: {
            id: number;
            createdAt: Date;
            type: string;
            postId: number;
            url: string;
            size: number | null;
        }[];
        comments: {
            id: number;
            createdAt: Date;
            content: string;
        }[];
        _count: {
            likes: number;
        };
        statusHistory: {
            id: number;
            createdAt: Date;
            status: string;
            postId: number;
        }[];
    } & {
        id: number;
        address: string;
        createdAt: Date;
        userId: number;
        content: string;
        lat: number | null;
        lng: number | null;
        type: string;
        status: string;
        deadline: Date | null;
        executorId: number | null;
    }>;
}
