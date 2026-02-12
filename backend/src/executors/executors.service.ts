import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExecutorsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.executor.findMany({
      include: { user: { select: { fullName: true, iin: true } } },
    });
  }

  async findFreeBySphere(sphere: string) {
    const assigned = await this.prisma.post.findMany({
      where: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] }, executorId: { not: null } },
      select: { executorId: true },
    });
    const busyIds = [...new Set(assigned.map((p) => p.executorId).filter(Boolean))];
    return this.prisma.executor.findMany({
      where: { sphere, isActive: true, id: { notIn: busyIds as number[] } },
      include: { user: { select: { fullName: true } } },
    });
  }
}
