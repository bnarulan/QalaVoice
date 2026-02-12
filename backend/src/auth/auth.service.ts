import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EgovService } from '../egov/egov.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private egov: EgovService) {}

  async register(iin: string, fullName: string, password: string, adminUserId: number, role = 'RESIDENT', sphere?: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Только администратор может регистрировать');
    }

    const verified = await this.egov.verifyIin(iin);
    if (!verified.valid) throw new ConflictException('Неверный ИИН');

    const exists = await this.prisma.user.findUnique({ where: { iin } });
    if (exists) throw new ConflictException('ИИН уже зарегистрирован');

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

  async login(iin: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { iin } });
    if (!user) throw new UnauthorizedException('Неверный ИИН или пароль');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Неверный ИИН или пароль');

    return this.sign(user.id, user.iin, user.role);
  }

  private sign(userId: number, iin: string, role: string) {
    const access_token = this.jwt.sign({ sub: userId, iin, role });
    return { access_token };
  }

  async getProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, iin: true, fullName: true, address: true, role: true },
    });
  }
}
