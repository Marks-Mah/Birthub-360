import type { PlaybookKey } from '../../../config/playbooks.js';

export interface AssistantHistoryMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: Date;
}

export interface AppendTurnInput {
  organizationId: string;
  userId: string;
  brand: PlaybookKey;
  userMessage: string;
  assistantResponse: string;
}

export interface AssistantHistoryRepository {
  listRecentMessages(
    organizationId: string,
    userId: string,
    brand: PlaybookKey,
    limit?: number,
  ): Promise<AssistantHistoryMessage[]>;

  appendTurn(input: AppendTurnInput): Promise<void>;
}
