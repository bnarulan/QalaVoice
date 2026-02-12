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
exports.RatingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RatingService = class RatingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async add(userId, score) {
        return this.prisma.rating.create({
            data: { userId, score },
        });
    }
    async getLeaderboard() {
        const ratings = await this.prisma.rating.groupBy({
            by: ['userId'],
            _avg: { score: true },
            _count: { id: true },
        });
        const userIds = ratings.map((r) => r.userId);
        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, fullName: true, iin: true },
        });
        const userMap = new Map(users.map((u) => [u.id, u]));
        const result = ratings.map((r) => {
            const u = userMap.get(r.userId);
            return {
                userId: r.userId,
                avgScore: r._avg.score,
                count: r._count.id,
                displayName: u?.fullName || u?.iin || 'Аноним',
            };
        });
        result.sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0));
        return result;
    }
};
exports.RatingService = RatingService;
exports.RatingService = RatingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RatingService);
//# sourceMappingURL=rating.service.js.map