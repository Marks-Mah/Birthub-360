import { logger } from '../../../lib/logger.js';
import { prisma } from '../../../lib/prisma.js';
import type { PrismaLeadStatus } from '../../../types/prisma-custom.js';
import type { AbTestingRepository, LogPromptUsageInput } from '../domain/AbTesting.js';

const WON: PrismaLeadStatus = 'Negocios_Ganhos';

export class PrismaAbTestingRepository implements AbTestingRepository {
  async recordPromptUsage(input: LogPromptUsageInput): Promise<void> {
    const { leadId, promptVariant, promptName } = input;
    try {
      await prisma.note.create({
        data: {
          leadId,
          author: 'Atlas Intelligence AI (A/B Testing)',
          content: `Aplicação do teste A/B: Foi utilizada a variante '${promptVariant}' do modelo '${promptName}'.`,
        },
      });
    } catch (err) {
      logger.error('Failed to log prompt usage in lead notes', { leadId, promptVariant, err });
    }
  }

  async findLeadIdsForVariant(variant: 'A' | 'B', promptName: string): Promise<string[]> {
    const notes = await prisma.note.findMany({
      where: { content: { contains: `variante '${variant}' do modelo '${promptName}'` } },
      select: { leadId: true },
    });
    return Array.from(new Set(notes.map((n) => n.leadId).filter(Boolean)));
  }

  async countConvertedLeads(leadIds: string[]): Promise<number> {
    if (leadIds.length === 0) return 0;
    return prisma.lead.count({
      where: { id: { in: leadIds }, status: WON },
    });
  }
}

export const prismaAbTestingRepository = new PrismaAbTestingRepository();
