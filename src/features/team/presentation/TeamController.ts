/**
 * Team & RBAC Presentation Layer — BirthHub 360
 * Clean Architecture Modular HTTP / Route Controller
 */

import type { Request, Response, NextFunction } from 'express';
import { TeamUseCases } from '../application/TeamUseCases.js';
import { TeamRole } from '../domain/TeamDomain.js';

export class TeamController {
  constructor(private readonly teamUseCases: TeamUseCases) {}

  async getMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = (req as any).user?.organizationId || (req.query.organizationId as string);
      if (!organizationId) {
        res.status(400).json({ error: 'Contexto de organização obrigatório' });
        return;
      }
      const members = await this.teamUseCases.listMembers(organizationId);
      res.json(members);
    } catch (error) {
      next(error);
    }
  }

  async inviteMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = (req as any).user?.organizationId || req.body.organizationId;
      const invitedBy = (req as any).user?.id || 'system';
      const { email, role } = req.body;

      if (!email || !role) {
        res.status(400).json({ error: 'Email e papel (role) são obrigatórios' });
        return;
      }

      const invite = await this.teamUseCases.inviteMember(
        organizationId,
        invitedBy,
        email,
        role as TeamRole
      );
      res.status(201).json(invite);
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = (req as any).user?.organizationId || req.body.organizationId;
      const { memberId } = req.params;
      const { role } = req.body;

      if (!memberId || !role) {
        res.status(400).json({ error: 'ID do membro e novo papel são obrigatórios' });
        return;
      }

      const updated = await this.teamUseCases.updateMemberRole(
        organizationId,
        memberId,
        role as TeamRole
      );
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const organizationId = (req as any).user?.organizationId || (req.query.organizationId as string);
      const { memberId } = req.params;

      if (!memberId) {
        res.status(400).json({ error: 'ID do membro obrigatório' });
        return;
      }

      await this.teamUseCases.removeMember(organizationId, memberId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
