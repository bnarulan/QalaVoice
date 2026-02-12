import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getHotSpots() {
    const posts = await this.prisma.post.findMany({
      where: { lat: { not: null }, lng: { not: null } },
      select: { id: true, address: true, lat: true, lng: true, type: true, createdAt: true },
    });

    const byLocation = new Map<string, { lat: number; lng: number; address: string; count: number; type: string }>();

    for (const p of posts) {
      if (p.lat == null || p.lng == null) continue;
      const key = `${p.lat.toFixed(4)}_${p.lng.toFixed(4)}`;
      const existing = byLocation.get(key);
      if (existing) {
        existing.count += 1;
      } else {
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
}
