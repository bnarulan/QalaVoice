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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const egov_service_1 = require("../egov/egov.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prisma, jwt, egov) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.egov = egov;
    }
    async register(iin, fullName, password, adminUserId, role = 'RESIDENT', sphere) {
        const admin = await this.prisma.user.findUnique({ where: { id: adminUserId } });
        if (!admin || admin.role !== 'ADMIN') {
            throw new common_1.UnauthorizedException('Только администратор может регистрировать');
        }
        const verified = await this.egov.verifyIin(iin);
        if (!verified.valid)
            throw new common_1.ConflictException('Неверный ИИН');
        const exists = await this.prisma.user.findUnique({ where: { iin } });
        if (exists)
            throw new common_1.ConflictException('ИИН уже зарегистрирован');
        const hash = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: { iin, fullName, password: hash, role },
            select: { id: true, iin: true, fullName: true, role: true, createdAt: true },
        });
        if (role === 'EXECUTOR' && sphere) {
            await this.prisma.executor.create({
                data: { userId: user.id, sphere, isActive: true },
            });
        }
        return this.sign(user.id, user.iin, user.role);
    }
    async login(iin, password) {
        const user = await this.prisma.user.findUnique({ where: { iin } });
        if (!user)
            throw new common_1.UnauthorizedException('Неверный ИИН или пароль');
        const ok = await bcrypt.compare(password, user.password);
        if (!ok)
            throw new common_1.UnauthorizedException('Неверный ИИН или пароль');
        return this.sign(user.id, user.iin, user.role);
    }
    sign(userId, iin, role) {
        const access_token = this.jwt.sign({ sub: userId, iin, role });
        return { access_token };
    }
    async getProfile(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, iin: true, fullName: true, address: true, role: true },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService, egov_service_1.EgovService])
], AuthService);
//# sourceMappingURL=auth.service.js.map