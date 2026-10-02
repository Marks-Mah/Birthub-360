import type { PlaybookKey } from '../../../config/playbooks.js';
import type {
  AppendTurnInput,
  AssistantHistoryMessage,
  AssistantHistoryRepository,
} from '../domain/AssistantHistory.js';
import { prismaAssistantHistoryRepository } from '../infrastructure/PrismaAssistantHistoryRepository.js';

export type { AssistantHistoryMessage, AppendTurnInput, AssistantHistoryRepository };

export class AssistantHistoryService {
  constructor(
    private readonly repository: AssistantHistoryRepository = prismaAssistantHistoryRepository,
  ) {}

  async listHistory(
    organizationId: string,
    userId: string,
    brand: PlaybookKey,
  ): Promise<AssistantHistoryMessage[]> {
    return this.repository.listRecentMessages(organizationId, userId, brand);
  }

  async appendTurn(
    organizationId: string,
    userId: string,
    brand: PlaybookKey,
    userMessage: string,
    assistantResponse: string,
  ): Promise<void> {
    return this.repository.appendTurn({
      organizationId,
      userId,
      brand,
      userMessage,
      assistantResponse,
    });
  }
}

export const assistantHistoryService = new AssistantHistoryService();

export async function listAssistantHistory(
  organizationId: string,
  userId: string,
  brand: PlaybookKey,
): Promise<AssistantHistoryMessage[]> {
  return assistantHistoryService.listHistory(organizationId, userId, brand);
}

export async function appendAssistantTurn(
  organizationId: string,
  userId: string,
  brand: PlaybookKey,
  userMessage: string,
  assistantResponse: string,
): Promise<void> {
  return assistantHistoryService.appendTurn(organizationId, userId, brand, userMessage, assistantResponse);
}
