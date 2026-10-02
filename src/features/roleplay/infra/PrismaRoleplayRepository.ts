import type {
  RoleplayFeedback,
  RoleplayMessage,
  RoleplayPersona,
  RoleplayRepository,
  RoleplaySession,
} from '../domain/Roleplay.js';

export const B2B_PERSONAS: RoleplayPersona[] = [
  {
    id: 'cfo-cético',
    name: 'Roberto Valente',
    title: 'Diretor Financeiro (CFO)',
    companyType: 'Indústria Metalúrgica (Faturamento R$ 120M/ano)',
    difficulty: 'AVANCADO',
    scenario:
      'A empresa está cortando despesas gerais e revisando todos os contratos de software. Roberto só aprova projetos com payback comprovado em menos de 6 meses.',
    coreObjections: [
      'Já temos um CRM legado que está pago e funciona para o básico.',
      'O custo de migração e treinamento da equipe de vendas é muito alto.',
      'Qual é o ROI líquido garantido e qual a garantia caso não atinja as metas?',
    ],
    personalityTraits: ['Analítico', 'Direto', 'Cético com promessas de IA', 'Focado em números'],
  },
  {
    id: 'diretor-operacoes',
    name: 'Mariana Duarte',
    title: 'Diretora de Operações',
    companyType: 'Distribuidora Logística Nacional',
    difficulty: 'INTERMEDIARIO',
    scenario:
      'A equipe comercial é descentralizada e tem baixa adesão a processos formais. Mariana precisa de visibilidade em tempo real sem sobrecarregar a rotina operacional.',
    coreObjections: [
      'Meus vendedores de campo não vão preencher formulários complexos no celular.',
      'Não temos equipe de TI dedicada para fazer integrações complexas.',
      'Quanto tempo leva para colocar o sistema no ar de verdade?',
    ],
    personalityTraits: ['Pragmática', 'Focada em tempo', 'Preocupada com aderência da equipe'],
  },
  {
    id: 'comprador-pressao',
    name: 'Carlos Mendes',
    title: 'Gerente de Compras / Procurement',
    companyType: 'Rede Varejista Regional',
    difficulty: 'INICIANTE',
    scenario:
      'Carlos recebeu a ordem de pesquisar 3 opções de mercado e fechar com a menor taxa de mensalidade possível para o próximo trimestre.',
    coreObjections: [
      'O concorrente X me fez uma proposta 30% mais barata com as mesmas funções.',
      'Preciso de desconto para pagamento à vista ou cancelamento sem multa.',
    ],
    personalityTraits: ['Negociador', 'Focado em preço', 'Busca concessões rápidas'],
  },
];

// Repositório em memória com isolamento multi-tenant
const sessionsStore = new Map<string, RoleplaySession>();

export class InMemoryRoleplayRepository implements RoleplayRepository {
  async listPersonas(): Promise<RoleplayPersona[]> {
    return B2B_PERSONAS;
  }

  async getPersonaById(id: string): Promise<RoleplayPersona | null> {
    return B2B_PERSONAS.find((p) => p.id === id) ?? null;
  }

  async createSession(data: {
    organizationId: string;
    userId: string;
    personaId: string;
  }): Promise<RoleplaySession> {
    const id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const session: RoleplaySession = {
      id,
      organizationId: data.organizationId,
      userId: data.userId,
      personaId: data.personaId,
      status: 'ACTIVE',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    sessionsStore.set(`${data.organizationId}:${id}`, session);
    return session;
  }

  async getSession(organizationId: string, sessionId: string): Promise<RoleplaySession | null> {
    return sessionsStore.get(`${organizationId}:${sessionId}`) ?? null;
  }

  async addMessage(
    organizationId: string,
    sessionId: string,
    message: RoleplayMessage,
  ): Promise<void> {
    const key = `${organizationId}:${sessionId}`;
    const session = sessionsStore.get(key);
    if (session) {
      session.messages.push(message);
      session.updatedAt = new Date();
    }
  }

  async completeSession(
    organizationId: string,
    sessionId: string,
    feedback: RoleplayFeedback,
  ): Promise<void> {
    const key = `${organizationId}:${sessionId}`;
    const session = sessionsStore.get(key);
    if (session) {
      session.status = 'COMPLETED';
      session.feedback = feedback;
      session.updatedAt = new Date();
    }
  }

  async listSessionsByUser(organizationId: string, userId: string): Promise<RoleplaySession[]> {
    const list: RoleplaySession[] = [];
    for (const [key, session] of sessionsStore.entries()) {
      if (key.startsWith(`${organizationId}:`) && session.userId === userId) {
        list.push(session);
      }
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const inMemoryRoleplayRepository = new InMemoryRoleplayRepository();
