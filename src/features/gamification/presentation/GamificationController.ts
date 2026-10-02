import type { NextFunction, Request, Response } from 'express';
import type { AuthRequest } from '../../../shared/middlewares/authenticateToken.js';
import type { LeaderboardPeriod } from '../domain/Gamification.js';
import { GamificationUseCases } from '../application/GamificationUseCases.js';
import { sellerCoachingService } from '../services/seller-coaching.service.js';
import { sellerPerformanceAggregator } from '../services/sellerPerformanceAggregator.service.js';

export class GamificationController {
  constructor(private gamificationUseCases = new GamificationUseCases()) {}

  getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { organizationId } = (req as AuthRequest).user;
      const period = (req.query.period as LeaderboardPeriod) || 'month';
      const result = await this.gamificationUseCases.getLeaderboard(organizationId, period);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as AuthRequest).user;
      const organizationId = user.organizationId;
      const userName = (user as any).name;
      const seller = (req.query.seller as string) || userName || 'Consultor';
      const result = await this.gamificationUseCases.getSellerProfile(organizationId, seller);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getCoaching = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as AuthRequest).user;
      const organizationId = user.organizationId;
      const userName = (user as any).name;
      const seller = (req.query.seller as string) || userName || 'Consultor';

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const metrics = await sellerPerformanceAggregator.compute(organizationId, seller, {
        from: monthStart,
        to: now,
      });

      const coaching = await sellerCoachingService.generateCoaching({
        sellerName: seller,
        callsMade: metrics.callsMade,
        meetingsScheduled: metrics.meetingsScheduled,
        dealsClosed: metrics.dealsClosed,
        conversionRatePercent: metrics.conversionRatePercent,
        avgTicket: metrics.avgTicket,
        topLossReason: metrics.topLossReason,
      });

      res.json({ success: true, data: { metrics, coaching } });
    } catch (error) {
      next(error);
    }
  };
}
