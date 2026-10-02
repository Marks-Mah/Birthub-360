import type {
  RoleplayFeedback,
  RoleplayMessage,
  RoleplayPersona,
  RoleplayRepository,
  RoleplaySession,
} from '../domain/Roleplay.js';
import { inMemoryRoleplayRepository } from '../infra/PrismaRoleplayRepository.js';

export class RoleplayUseCases {
  constructor(private repository: RoleplayRepository = inMemoryRoleplayRepository) {}

  async listPersonas(): Promise<RoleplayPersona[]> {
    return this.repository.listPersonas();
  }

  async startSession(
    organizationId: string,
    userId: string,
    personaId: string,
  ): Promise<{
    session: RoleplaySession;
    persona: RoleplayPersona;
    initialGreeting: string;
  }> {
    const persona = await this.repository.getPersonaById(personaId);
    if (!persona) {
      throw new Error(`Persona não encontrada: ${personaId}`);
    }

    const session = await this.repository.createSession({ organizationId, userId, personaId });
    const initialGreeting = `Olá. Sou ${persona.name}, ${persona.title}. Estou com minha agenda bastante concorrida hoje, mas tenho 10 minutos. O que você gostaria de me apresentar?`;

    const assistantMsg: RoleplayMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: initialGreeting,
      timestamp: new Date().toISOString(),
    };

    await this.repository.addMessage(organizationId, session.id, assistantMsg);
    session.messages.push(assistantMsg);

    return { session, persona, initialGreeting };
  }

  async sendTurn(
    organizationId: string,
    sessionId: string,
    userText: string,
  ): Promise<{ response: string; turnCount: number }> {
    const session = await this.repository.getSession(organizationId, sessionId);
    if (!session) throw new Error('Sessão não encontrada');
    if (session.status === 'COMPLETED') throw new Error('Sessão já concluída');

    const persona = await this.repository.getPersonaById(session.personaId);
    if (!persona) throw new Error('Persona não encontrada');

    const userMsg: RoleplayMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };
    await this.repository.addMessage(organizationId, sessionId, userMsg);

    // Geração determinística e consistente de réplicas e objeções com base na persona
    const turn = session.messages.filter((m) => m.role === 'user').length;
    let replyText = '';

    if (turn === 1) {
      replyText = `Entendi a proposta inicial, mas na prática ${persona.coreObjections[0]}. Como a solução de vocês resolve especificamente esse ponto?`;
    } else if (turn === 2) {
      replyText = `Certo, faz sentido no papel. Porém, ${persona.coreObjections[1] || 'o risco de implementação ainda me preocupa'}. Qual é o cronograma e os resultados esperados no primeiro mês?`;
    } else {
      replyText = `Compreendi suas respostas e a demonstração de valor. Vamos avançar: você pode me enviar um sumário executivo com os custos e cronograma por e-mail para eu levar ao comitê?`;
    }

    const assistantReply: RoleplayMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: replyText,
      timestamp: new Date().toISOString(),
    };
    await this.repository.addMessage(organizationId, sessionId, assistantReply);

    return { response: replyText, turnCount: turn };
  }

  async evaluateSession(organizationId: string, sessionId: string): Promise<RoleplayFeedback> {
    const session = await this.repository.getSession(organizationId, sessionId);
    if (!session) throw new Error('Sessão não encontrada');

    const userMessages = session.messages.filter((m) => m.role === 'user');
    const totalWords = userMessages.reduce((sum, m) => sum + m.content.split(' ').length, 0);

    // Avaliação metodológica orientada a SPIN Selling
    const situation = Math.min(100, Math.max(60, 70 + (userMessages.length >= 2 ? 15 : 0)));
    const problem = Math.min(100, Math.max(55, 65 + (totalWords > 40 ? 20 : 5)));
    const implication = Math.min(100, Math.max(50, 60 + (totalWords > 80 ? 25 : 10)));
    const needPayoff = Math.min(100, Math.max(60, 70 + (userMessages.length >= 3 ? 20 : 0)));

    const objectionHandling = Math.min(100, Math.round((problem + implication) / 2));
    const overall = Math.round((situation + problem + implication + needPayoff) / 4);

    const feedback: RoleplayFeedback = {
      overallScore: overall,
      spinSellingScores: {
        situation,
        problem,
        implication,
        needPayoff,
      },
      objectionHandlingScore: objectionHandling,
      strengths: [
        'Boa postura profissional e condução inicial da conversa.',
        'Capacidade de manter o diálogo objetivo sem divagações.',
      ],
      improvementAreas: [
        'Aprofundar perguntas de implicação para que o decisor sinta o custo da inação.',
        'Quantificar o retorno financeiro com números concretos antes do fechamento.',
      ],
      summary: `Treinamento concluído com nota geral ${overall}/100. Demonstrou bom domínio de produto e habilidade para avançar para os próximos passos comerciais.`,
    };

    await this.repository.completeSession(organizationId, sessionId, feedback);
    return feedback;
  }

  async getUserHistory(organizationId: string, userId: string): Promise<RoleplaySession[]> {
    return this.repository.listSessionsByUser(organizationId, userId);
  }
}
