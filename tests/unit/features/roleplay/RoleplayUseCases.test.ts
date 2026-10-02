import { describe, expect, it } from 'vitest';
import { RoleplayUseCases } from '@/features/roleplay/application/RoleplayUseCases';
import { InMemoryRoleplayRepository } from '@/features/roleplay/infra/PrismaRoleplayRepository';

describe('RoleplayUseCases — Simulador Comercial e Avaliação', () => {
  it('lista personas B2B pré-configuradas com cenários e objeções', async () => {
    const repo = new InMemoryRoleplayRepository();
    const useCases = new RoleplayUseCases(repo);

    const personas = await useCases.listPersonas();

    expect(personas.length).toBeGreaterThanOrEqual(3);
    const cfo = personas.find((p) => p.id === 'cfo-cético');
    expect(cfo).toBeDefined();
    expect(cfo?.difficulty).toBe('AVANCADO');
  });

  it('inicia sessão de roleplay com saudação contextualizada da persona', async () => {
    const repo = new InMemoryRoleplayRepository();
    const useCases = new RoleplayUseCases(repo);

    const { session, persona, initialGreeting } = await useCases.startSession('org-1', 'user-1', 'cfo-cético');

    expect(session.id).toBeDefined();
    expect(session.status).toBe('ACTIVE');
    expect(persona.name).toBe('Roberto Valente');
    expect(initialGreeting).toContain('Roberto Valente');
    expect(session.messages).toHaveLength(1);
  });

  it('conduz turnos de conversa e avalia a performance com critérios SPIN Selling', async () => {
    const repo = new InMemoryRoleplayRepository();
    const useCases = new RoleplayUseCases(repo);

    const { session } = await useCases.startSession('org-1', 'user-1', 'cfo-cético');

    const turn1 = await useCases.sendTurn('org-1', session.id, 'Entendo sua preocupação orçamentária, Roberto. Nossa solução traz payback em 4 meses.');
    expect(turn1.turnCount).toBe(1);
    expect(turn1.response).toContain('prática');

    const feedback = await useCases.evaluateSession('org-1', session.id);
    expect(feedback.overallScore).toBeGreaterThanOrEqual(60);
    expect(feedback.spinSellingScores.situation).toBeDefined();
    expect(feedback.objectionHandlingScore).toBeDefined();
    expect(feedback.strengths.length).toBeGreaterThan(0);
  });
});
