import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../lib/prisma.js';
import type { AuthRequest } from '../../../shared/middlewares/authenticateToken.js';
import { GamificationUseCases } from '../application/GamificationUseCases.js';
import type { LeaderboardPeriod } from '../domain/Gamification.js';
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

  getWeeklyCoaching = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as AuthRequest).user;
      const organizationId = user.organizationId;
      const userId = user.id;

      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });

      if (!dbUser) {
        res.status(404).json({ success: false, error: 'Usuário não encontrado' });
        return;
      }

      const sellerName = dbUser.name ?? 'Consultor';

      const validRoles = [
        'SDR / Hunter',
        'Closer / Executivo de Contas',
        'Account Manager / Farmer',
      ];
      const rawRole = req.body?.role;
      const role = validRoles.includes(rawRole) ? rawRole : undefined;

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const performance = await sellerPerformanceAggregator.compute(organizationId, sellerName, {
        from: monthStart,
        to: now,
      });

      const report = await aiSuite.sellerCoaching.generateCoachingReport({
        sellerName,
        role: role as any,
        callsMade: performance.callsMade,
        meetingsScheduled: performance.meetingsScheduled,
        dealsClosed: performance.dealsClosed,
        conversionRatePercent: performance.conversionRatePercent,
        avgTicket: performance.avgTicket,
        topLossReason: performance.topLossReason,
      });

      res.json({
        success: true,
        data: {
          report,
          performance,
          period: `${monthStart.toISOString().slice(0, 10)} até ${now.toISOString().slice(0, 10)}`,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
