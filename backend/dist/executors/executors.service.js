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
exports.ExecutorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExecutorsService = class ExecutorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.executor.findMany({
            include: { user: { select: { fullName: true, iin: true } } },
        });
    }
    async findFreeBySphere(sphere) {
        const assigned = await this.prisma.post.findMany({
            where: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] }, executorId: { not: null } },
            select: { executorId: true },
        });
        const busyIds = [...new Set(assigned.map((p) => p.executorId).filter(Boolean))];
        return this.prisma.executor.findMany({
            where: { sphere, isActive: true, id: { notIn: busyIds } },
            include: { user: { select: { fullName: true } } },
        });
    }
};
exports.ExecutorsService = ExecutorsService;
exports.ExecutorsService = ExecutorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExecutorsService);
//# sourceMappingURL=executors.service.js.map