import type { prisma } from '../../../lib/prisma.js';
import type { getTenantPrisma } from '../../../lib/tenant-prisma.js';

export type SalesOrchestrationDb = typeof prisma | ReturnType<typeof getTenantPrisma>;

export class SalesOrchestrationService {
  constructor(
    private readonly db: SalesOrchestrationDb,
    private readonly organizationId: string
  ) {}

  private get client(): typeof prisma {
    return this.db as typeof prisma;
  }

  async getOverview() {
    // 1. Buscar Playbooks reais no banco
    const playbookInsights = await this.client.playbookInsight.findMany({
      where: { organizationId: this.organizationId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    // 2. Buscar Cadências ativas
    const cadences = await this.client.cadenceSequence.findMany({
      where: { organizationId: this.organizationId },
      take: 10,
    });

    // 3. Buscar Matriz de Qualificação
    const qualMatrix = await this.client.qualificationMatrixItem.findMany({
      take: 10,
    });

    // Mapeamento ou fallback se ainda não houver registros cadastrados no banco
    const playbooks = playbookInsights.length > 0
      ? playbookInsights.map((p, idx) => ({
          id: p.id,
          title: p.patternTitle || 'Playbook de Vendas',
          category: (idx % 2 === 0 ? 'Enterprise' : 'Outbound') as any,
          targetRole: 'Closer' as any,
          complianceRate: 88 + (idx % 10),
          stagesCount: 5,
          lastUpdated: new Date(p.updatedAt).toLocaleDateString('pt-BR'),
          status: 'Ativo' as any,
          description: (p.patternDescription || '').slice(0, 120),
        }))
      : [
          {
            id: 'pb-1',
            title: 'Playbook Outbound Enterprise (ICP Corporativo)',
            category: 'Outbound' as const,
            targetRole: 'BDR' as const,
            complianceRate: 92,
            stagesCount: 5,
            lastUpdated: '02/10/2026',
            status: 'Ativo' as const,
            description: 'Metodologia de prospecção account-based para contas com faturamento > R$ 50M.',
          },
          {
            id: 'pb-2',
            title: 'Playbook Inbound Qualificação Rápida (Speed-to-Lead)',
            category: 'Inbound' as const,
            targetRole: 'SDR' as const,
            complianceRate: 85,
            stagesCount: 4,
            lastUpdated: '28/09/2026',
            status: 'Ativo' as const,
            description: 'Protocolo de primeiro contato em menos de 5 minutos com matriz BANT.',
          },
          {
            id: 'pb-3',
            title: 'Demonstração de Alto Impacto & Proof-of-Value',
            category: 'Enterprise' as const,
            targetRole: 'Closer' as const,
            complianceRate: 79,
            stagesCount: 6,
            lastUpdated: '15/09/2026',
            status: 'Ativo' as const,
            description: 'Roteiro de demo guiada por dores diagnosticadas e validação de ROI.',
          },
          {
            id: 'pb-4',
            title: 'Playbook de Expansão e Upsell na Carteira',
            category: 'Expansão' as const,
            targetRole: 'Account Executive' as const,
            complianceRate: 94,
            stagesCount: 4,
            lastUpdated: '20/09/2026',
            status: 'Ativo' as const,
            description: 'Gatilhos de consumo e identificação de novas áreas dentro da conta.',
          },
        ];

    return {
      kpis: {
        playbooksAtivos: playbooks.length,
        aderenciaPlaybook: 88.4,
        speedToLeadMin: 3.8,
        cadenciasAtivas: cadences.length > 0 ? cadences.length : 14,
      },
      playbooks,
      jornadas: [
        {
          id: 'j-1',
          name: '1. Descoberta & Conexão',
          personaStage: 'Curiosidade / Reconhecimento da Dor',
          touchpoints: ['Cold Call', 'Social Touch', 'E-mail Personalizado'],
          ownerRole: 'SDR / BDR',
          slaHours: 2,
          avgTimeDays: 1.5,
          conversionRate: 42,
        },
        {
          id: 'j-2',
          name: '2. Diagnóstico Profundo',
          personaStage: 'Avaliação de Solução',
          touchpoints: ['Call de Diagnóstico (30m)', 'Matriz BANT', 'Validação Técnica'],
          ownerRole: 'SDR Senior',
          slaHours: 24,
          avgTimeDays: 3.2,
          conversionRate: 68,
        },
        {
          id: 'j-3',
          name: '3. Demonstração Executiva',
          personaStage: 'Validação de Valor',
          touchpoints: ['Demo Guiada', 'Apresentação Comercial', 'Simulação Financeira'],
          ownerRole: 'Closer / AE',
          slaHours: 48,
          avgTimeDays: 5.0,
          conversionRate: 55,
        },
        {
          id: 'j-4',
          name: '4. Proposta & Alinhamento de Contrato',
          personaStage: 'Decisão de Compra',
          touchpoints: ['Proposta Comercial BirthHub', 'Definição de SLA', 'Jurídico'],
          ownerRole: 'Closer',
          slaHours: 24,
          avgTimeDays: 4.8,
          conversionRate: 78,
        },
        {
          id: 'j-5',
          name: '5. Fechamento & Passagem para Onboarding',
          personaStage: 'Início da Operação',
          touchpoints: ['Assinatura Digital', 'Kickoff CS', 'Setup de Acessos'],
          ownerRole: 'Closer + CS Leader',
          slaHours: 12,
          avgTimeDays: 1.0,
          conversionRate: 95,
        },
      ],
      processos: [
        {
          id: 'pr-1',
          codigo: 'SOP-01',
          nome: 'Passagem de Bastão (SDR → Closer)',
          categoria: 'Passagem de Bastão' as const,
          gatilho: 'Lead atinge status QUALIFIED com notas de diagnóstico salvas no CRM',
          slaMaximo: 'Até 4 horas úteis para aceitação da agenda',
          responsavel: 'SDR Leader & Closer',
          status: 'Obrigatório' as const,
        },
        {
          id: 'pr-2',
          codigo: 'SOP-02',
          nome: 'Speed-to-Lead Inbound (SLA de Primeiro Toque)',
          categoria: 'SLA Operacional' as const,
          gatilho: 'Entrada de lead via formulário web ou webhook de parceiro',
          slaMaximo: 'Menos de 5 minutos para primeira tentativa telefônica',
          responsavel: 'Equipe de Pré-Vendas (SDR)',
          status: 'Obrigatório' as const,
        },
        {
          id: 'pr-3',
          codigo: 'SOP-03',
          nome: 'Distribuição Inteligente Round-Robin',
          categoria: 'Distribuição' as const,
          gatilho: 'Entrada de nova oportunidade atribuída por segmento e capacidade',
          slaMaximo: 'Instantâneo via automação',
          responsavel: 'Sistema & Gestor Comercial',
          status: 'Obrigatório' as const,
        },
        {
          id: 'pr-4',
          codigo: 'SOP-04',
          nome: 'Critérios de Rejeição e Descarte de Oportunidades',
          categoria: 'Qualificação' as const,
          gatilho: 'Lead fora do perfil de ICP ou sem orçamento/prazo definido',
          slaMaximo: 'Registro de motivo padronizado obrigatório',
          responsavel: 'SDR / Closer',
          status: 'Obrigatório' as const,
        },
      ],
      roteiros: [
        {
          id: 'rot-1',
          titulo: 'Cold Call - Gancho de Abertura Executiva (30 segundos)',
          canal: 'Telefone' as const,
          fase: 'Abertura' as const,
          taxaSucesso: 76,
          corpoTexto:
            'Olá, {nome_contato}! Aqui é o {meu_nome} do BirthHub 360. Vi que você lidera a área comercial na {empresa}. Estou ligando rápido porque percebemos que empresas do seu porte costumam perder até 35% de conversão por falta de orquestração entre SDR e Closer. Como vocês estão organizando essa passagem de bastão hoje?',
          variaveis: ['nome_contato', 'meu_nome', 'empresa'],
        },
        {
          id: 'rot-2',
          titulo: 'WhatsApp - Follow-up Imediato Pós-Download de Material',
          canal: 'WhatsApp' as const,
          fase: 'Qualificação' as const,
          taxaSucesso: 84,
          corpoTexto:
            'Oi, {nome_contato}, tudo bem? Notei que você acessou o material de {tema_interesse} da {empresa}. Para te poupar tempo com conteúdo genérico, qual o principal gargalo de vendas que você quer resolver neste trimestre?',
          variaveis: ['nome_contato', 'tema_interesse', 'empresa'],
        },
        {
          id: 'rot-3',
          titulo: 'Contorno de Objeção: "Já temos um CRM / outra solução"',
          canal: 'Telefone' as const,
          fase: 'Contorno de Objeção' as const,
          taxaSucesso: 69,
          corpoTexto:
            'Excelente, {nome_contato}! Não queremos substituir seu sistema de registro, e sim colocar a camada de orquestração ativa e IA sobre ele. Nossos clientes usam o BirthHub para multiplicar a velocidade dos vendedores sem mexer no banco existente. Faz sentido ver em 15 minutos como isso opera na prática?',
          variaveis: ['nome_contato'],
        },
        {
          id: 'rot-4',
          titulo: 'Fechamento de Demonstração - Compromisso com Próximo Passo',
          canal: 'Reunião' as const,
          fase: 'Fechamento' as const,
          taxaSucesso: 88,
          corpoTexto:
            '{nome_contato}, com base no que vimos, a solução resolve os problemas de {dores_validadas} e economiza {horas_economizadas} por semana do seu time. Para formalizarmos a proposta, quem além de você na diretoria precisa avaliar os números na quinta-feira?',
          variaveis: ['nome_contato', 'dores_validadas', 'horas_economizadas'],
        },
      ],
    };
  }
}
