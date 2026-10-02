import {
  type GamificationRepository,
  type LeaderboardPeriod,
  type LeaderboardRanking,
  type SellerScore,
} from '../domain/Gamification.js';
import { prismaGamificationRepository } from '../infra/PrismaGamificationRepository.js';

export class GamificationUseCases {
  constructor(
    private repository: GamificationRepository = prismaGamificationRepository,
  ) {}

  async getLeaderboard(
    organizationId: string,
    period: LeaderboardPeriod = 'month',
    now = new Date(),
  ): Promise<LeaderboardRanking> {
    let since: Date | undefined;
    if (period === 'month') {
      since = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'week') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      since = new Date(now.setDate(diff));
      since.setHours(0, 0, 0, 0);
    }

    const rankings = await this.repository.getLeaderboard(organizationId, since);
    return { period, rankings };
  }

  async getSellerProfile(
    organizationId: string,
    sellerName: string,
  ): Promise<SellerScore> {
    const profile = await this.repository.getSellerScore(organizationId, sellerName);
    if (!profile) {
      return {
        sellerName,
        totalPoints: 0,
        level: 1,
        levelTitle: 'Consultor Trainee',
        callsCount: 0,
        meetingsCount: 0,
        qualifiedCount: 0,
        dealsClosed: 0,
        wonRevenue: 0,
        badges: [],
        streakDays: 0,
      };
    }
    return profile;
  }
}
