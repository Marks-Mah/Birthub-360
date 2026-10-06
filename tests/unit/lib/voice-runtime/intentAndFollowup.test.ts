import { describe, it, expect } from 'vitest';
import { intentEngine } from '../../../../src/lib/voice-runtime/intelligence/IntentEngine.js';
import { postCallFollowupAutomation } from '../../../../src/lib/voice-runtime/automation/PostCallFollowupAutomation.js';
import type { VoiceSession } from '../../../../src/lib/voice-runtime/types.js';

describe('VoiceRuntime IntentEngine & PostCallFollowupAutomation', () => {
  it('detects intent correctly for scheduling', () => {
    const result = intentEngine.analyzeIntent('sess_123', 'Quero agendar uma reunião amanhã às 14h');
    expect(result.primaryIntent).toBe('Agendamento');
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.entities.dataMencionada).toBe('amanhã');
  });

  it('detects intent correctly for financial inquiries', () => {
    const result = intentEngine.analyzeIntent('sess_123', 'Qual o preço da assinatura mensal e valor da fatura?');
    expect(result.primaryIntent).toBe('Financeiro');
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it('detects intent correctly for support requests', () => {
    const result = intentEngine.analyzeIntent('sess_123', 'Estou com um erro no sistema e não funciona');
    expect(result.primaryIntent).toBe('Suporte');
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it('generates post-call follow-up task and draft message', async () => {
    const mockSession: VoiceSession = {
      sessionId: 'sess_test_1',
      agentId: 'agent_v1',
      tenantId: 'tenant_abc',
      workspaceId: 'ws_default',
      organizationId: 'org_default',
      projectId: 'proj_default',
      callerId: '+5511999999999',
      channel: 'web',
      provider: 'OpenAI',
      status: 'Finished',
      durationMs: 120000,
      latencyMs: 150,
      model: 'gpt-4o',
      language: 'pt-BR',
      region: 'sa-east-1',
      history: [
        { id: '1', role: 'user', content: 'Gostaria de agendar uma demonstração do produto', timestamp: Date.now() - 5000 },
        { id: '2', role: 'assistant', content: 'Claro! Posso agendar para amanhã.', timestamp: Date.now() },
      ],
      events: [],
    };

    const intent = intentEngine.analyzeIntent(mockSession.sessionId, mockSession.history[0].content);
    const followup = await postCallFollowupAutomation.processSession(mockSession, [intent]);

    expect(followup.primaryIntent).toBe('Agendamento');
    expect(followup.taskSuggested.priority).toBe('Alta');
    expect(followup.followupDraft?.channel).toBe('whatsapp');
    expect(followup.followupDraft?.content).toContain('confirmar data e horário');
  });
});
