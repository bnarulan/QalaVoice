import { AdminService } from './admin.service';
export declare class AdminController {
    private admin;
    constructor(admin: AdminService);
    getDashboard(): Promise<{
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
