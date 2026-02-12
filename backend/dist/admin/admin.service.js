"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHotSpots() {
        const posts = await this.prisma.post.findMany({
            where: { lat: { not: null }, lng: { not: null } },
            select: { id: true, address: true, lat: true, lng: true, type: true, createdAt: true },
        });
        const byLocation = new Map();
        for (const p of posts) {
            if (p.lat == null || p.lng == null)
                continue;
            const key = `${p.lat.toFixed(4)}_${p.lng.toFixed(4)}`;
            const existing = byLocation.get(key);
            if (existing) {
                existing.count += 1;
            }
            else {
                byLocation.set(key, {
                    lat: p.lat,
                    lng: p.lng,
                    address: p.address,
                    count: 1,
                    type: p.type,
                });
            }
        }
        const hotSpots = Array.from(byLocation.values()).sort((a, b) => b.count - a.count);
        const executorsTotal = await this.prisma.executor.count();
        const executorsActive = await this.prisma.executor.count({ where: { isActive: true } });
        const executorsBusy = await this.prisma.post.groupBy({
            by: ['executorId'],
            where: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] }, executorId: { not: null } },
        });
        return {
            hotSpots,
            stats: {
                executorsTotal,
                executorsActive,
                executorsBusy: executorsBusy.length,
                executorsFree: executorsActive - executorsBusy.length,
                postsTotal: await this.prisma.post.count(),
                postsSubmitted: await this.prisma.post.count({ where: { status: 'SUBMITTED' } }),
                postsInProgress: await this.prisma.post.count({ where: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] } } }),
                postsDone: await this.prisma.post.count({ where: { status: 'DONE' } }),
            },
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map