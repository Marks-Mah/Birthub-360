import { describe, expect, it } from 'vitest';
import type {
  AppendTurnInput,
  AssistantHistoryMessage,
  AssistantHistoryRepository,
} from '../../domain/AssistantHistory';
import { AssistantHistoryService } from '../assistant-history.service';

class FakeAssistantHistoryRepository implements AssistantHistoryRepository {
  public messages: AssistantHistoryMessage[] = [];
  public appendCalls: AppendTurnInput[] = [];

  async listRecentMessages(
    _organizationId: string,
    _userId: string,
    _brand: string,
    limit: number = 50,
  ): Promise<AssistantHistoryMessage[]> {
    return this.messages.slice(0, limit);
  }

  async appendTurn(input: AppendTurnInput): Promise<void> {
    this.appendCalls.push(input);
    this.messages.push(
      { id: `msg-${Date.now()}-1`, role: 'user', text: input.userMessage, createdAt: new Date() },
      { id: `msg-${Date.now()}-2`, role: 'assistant', text: input.assistantResponse, createdAt: new Date() },
    );
  }
}

describe('AssistantHistoryService with Repository', () => {
  const org = 'org-1';
  const user = 'user-1';
  const brand = 'atlas-hub' as never;

  it('lista mensagens do repositório em memória sem tocar banco', async () => {
    const repo = new FakeAssistantHistoryRepository();
    repo.messages = [
      { id: '1', role: 'user', text: 'Olá', createdAt: new Date() },
      { id: '2', role: 'assistant', text: 'Como posso ajudar?', createdAt: new Date() },
    ];
    const service = new AssistantHistoryService(repo);

    const history = await service.listHistory(org, user, brand);
    expect(history).toHaveLength(2);
    expect(history[0].text).toBe('Olá');
    expect(history[1].text).toBe('Como posso ajudar?');
  });

  it('adiciona turno de conversa com mensagem de usuário e resposta', async () => {
    const repo = new FakeAssistantHistoryRepository();
    const service = new AssistantHistoryService(repo);

    await service.appendTurn(org, user, brand, 'Qual a meta do trimestre?', 'A meta é 1M.');

    expect(repo.appendCalls).toHaveLength(1);
    expect(repo.appendCalls[0].userMessage).toBe('Qual a meta do trimestre?');
    expect(repo.appendCalls[0].assistantResponse).toBe('A meta é 1M.');
    expect(repo.messages).toHaveLength(2);
  });
});
