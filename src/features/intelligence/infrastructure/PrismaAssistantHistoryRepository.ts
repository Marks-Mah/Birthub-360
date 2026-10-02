import type { PlaybookKey } from '../../../config/playbooks.js';
import { logger } from '../../../lib/logger.js';
import { prisma } from '../../../lib/prisma.js';
import type {
  AppendTurnInput,
  AssistantHistoryMessage,
  AssistantHistoryRepository,
} from '../domain/AssistantHistory.js';

export class PrismaAssistantHistoryRepository implements AssistantHistoryRepository {
  async listRecentMessages(
    organizationId: string,
    userId: string,
    brand: PlaybookKey,
    limit: number = 50,
  ): Promise<AssistantHistoryMessage[]> {
    const rows = await prisma.assistantMessage.findMany({
      where: { organizationId, userId, brand },
      orderBy: { createdAt: 'asc' },
      take: limit,
      select: {
        id: true,
        role: true,
        text: true,
        createdAt: true,
      },
    });

    return rows.map((r) => ({
      id: r.id,
      role: r.role as 'user' | 'assistant',
      text: r.text,
      createdAt: r.createdAt,
    }));
  }

  async appendTurn(input: AppendTurnInput): Promise<void> {
    const { organizationId, userId, brand, userMessage, assistantResponse } = input;
    try {
      await prisma.$transaction([
        prisma.assistantMessage.create({
          data: {
            organizationId,
            userId,
            brand,
            role: 'user',
            text: userMessage,
          },
        }),
        prisma.assistantMessage.create({
          data: {
            organizationId,
            userId,
            brand,
            role: 'assistant',
            text: assistantResponse,
          },
        }),
      ]);
    } catch (err) {
      logger.error('Failed to persist assistant history turn', {
        organizationId,
        userId,
        brand,
        err,
      });
    }
  }
}

export const prismaAssistantHistoryRepository = new PrismaAssistantHistoryRepository();
