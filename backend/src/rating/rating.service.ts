import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async add(userId: number, score: number) {
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

    const userMap = new Map(users.map((u: { id: number; fullName: string | null; iin: string | null }) => [u.id, u]));

    const result = ratings.map((r) => {
      const u = userMap.get(r.userId) as { fullName?: string | null; iin?: string | null } | undefined;
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
}
