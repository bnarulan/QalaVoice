import { PrismaService } from '../prisma/prisma.service';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, content: string, address: string, lat?: number, lng?: number, type?: string, sphere?: string): Promise<{
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
    private findFreeExecutor;
    addPhoto(postId: number, file: Express.Multer.File): Promise<{
        id: number;
        createdAt: Date;
        type: string;
        postId: number;
        url: string;
        size: number | null;
    }>;
    addVideo(postId: number, file: Express.Multer.File): Promise<{
        id: number;
        createdAt: Date;
        type: string;
        postId: number;
        url: string;
        size: number | null;
    }>;
    findAll(page?: number, limit?: number): Promise<{
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
    findOne(id: number): Promise<{
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
    acceptAndSetDeadline(postId: number, userId: number, deadline: Date): Promise<{
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
    updateStatus(postId: number, status: string): Promise<{
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
    private ensureUploadsDir;
}
