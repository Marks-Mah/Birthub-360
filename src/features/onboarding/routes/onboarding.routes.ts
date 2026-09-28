import { Router } from 'express';
import { authenticateToken } from '../../../shared/middlewares/authenticateToken.js';
import { prisma } from '../../../lib/prisma.js';
import { z } from 'zod';
import { requestContext } from '../../../lib/async-context.js';

export const onboardingRoutes = Router();

const setupSchema = z.object({
  companyName: z.string().min(1),
  userRole: z.string().optional(),
  acceptAiTerms: z.boolean().refine((val) => val === true, {
    message: 'Voc deve aceitar os termos de IA para prosseguir',
  }),
});

onboardingRoutes.post('/setup-wizard', authenticateToken, async (req, res, next) => {
  try {
    const tenantId = requestContext.getStore()?.tenantId;
    if (!tenantId) {
      res.status(401).json({ error: 'Nenhum tenant carregado no contexto' });
      return;
    }
    const userId = requestContext.getStore()?.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Usurio no encontrado no contexto' });
      return;
    }

    const parseResult = setupSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Dados invlidos', details: parseResult.error.format() });
      return;
    }
    const data = parseResult.data;

    // Transao para realizar o setup
    await prisma.$transaction(async (tx) => {
      // 1. Atualiza nome da organizao e marca como completo
      await tx.organization.update({
        where: { id: tenantId },
        data: {
          name: data.companyName,
          setupCompleted: true,
        },
      });

      // 2. Cria ou atualiza consentimento de IA
      await tx.organizationAiConsent.upsert({
        where: { organizationId: tenantId },
        update: {
          granted: true,
          grantedAt: new Date(),
          grantedByUserId: userId,
          consentVersion: '1.0',
        },
        create: {
          organizationId: tenantId,
          granted: true,
          grantedAt: new Date(),
          grantedByUserId: userId,
          consentVersion: '1.0',
        },
      });

      // 3. Concesso de mdulos bsicos (CRM)
      const defaultModules = ['crm', 'copiloto', 'intelligence']; // Ajustar se houver outros mdulos obrigatrios
      for (const mod of defaultModules) {
        const exists = await tx.moduleAccessGrant.findFirst({
          where: { organizationId: tenantId, userId, moduleKey: mod },
        });
        if (!exists) {
          await tx.moduleAccessGrant.create({
            data: {
              organizationId: tenantId,
              userId,
              moduleKey: mod,
              grantedByUserId: userId,
            },
          });
        }
      }
    });

    res.json({ success: true, message: 'Setup concludo com sucesso' });
  } catch (error) {
    next(error);
  }
});

onboardingRoutes.get('/status', authenticateToken, async (req, res, next) => {
  try {
    const tenantId = requestContext.getStore()?.tenantId;
    if (!tenantId) {
      res.json({ setupCompleted: false });
      return;
    }
    const org = await prisma.organization.findUnique({
      where: { id: tenantId },
      select: { setupCompleted: true },
    });
    res.json({ setupCompleted: org?.setupCompleted || false });
  } catch (error) {
    next(error);
  }
});

