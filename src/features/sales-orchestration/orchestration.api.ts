import { api } from '../../lib/api.js';

export interface PlaybookItem {
  id: string;
  title: string;
  category: 'Inbound' | 'Outbound' | 'Enterprise' | 'Expansão' | 'Parcerias';
  targetRole: 'SDR' | 'BDR' | 'Closer' | 'Account Executive';
  complianceRate: number;
  stagesCount: number;
  lastUpdated: string;
  status: 'Ativo' | 'Em Revisão' | 'Rascunho';
  description: string;
}

export interface JornadaEtapa {
  id: string;
  name: string;
  personaStage: string;
  touchpoints: string[];
  ownerRole: string;
  slaHours: number;
  avgTimeDays: number;
  conversionRate: number;
}

export interface ProcessoVendaItem {
  id: string;
  codigo: string;
  nome: string;
  categoria: 'Passagem de Bastão' | 'Qualificação' | 'SLA Operacional' | 'Distribuição';
  gatilho: string;
  slaMaximo: string;
  responsavel: string;
  status: 'Obrigatório' | 'Recomendado';
}

export interface RoteiroItem {
  id: string;
  titulo: string;
  canal: 'Telefone' | 'WhatsApp' | 'E-mail' | 'Reunião';
  fase: 'Abertura' | 'Qualificação' | 'Pitch' | 'Contorno de Objeção' | 'Fechamento';
  taxaSucesso: number;
  corpoTexto: string;
  variaveis: string[];
}

export interface SalesOrchestrationOverview {
  kpis: {
    playbooksAtivos: number;
    aderenciaPlaybook: number;
    speedToLeadMin: number;
    cadenciasAtivas: number;
  };
  playbooks: PlaybookItem[];
  jornadas: JornadaEtapa[];
  processos: ProcessoVendaItem[];
  roteiros: RoteiroItem[];
}

export const orchestrationApi = {
  getOverview: async (): Promise<SalesOrchestrationOverview> => {
    try {
      const res = await api.get<{ success: boolean; data: SalesOrchestrationOverview }>('/api/sales-orchestration/overview');
      if (res?.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('Backend unavailable, using fallback data for sales orchestration');
    }
    return fallbackOverview;
  },
};

const fallbackOverview: SalesOrchestrationOverview = {
  kpis: {
    playbooksAtivos: 6,
    aderenciaPlaybook: 88.4,
    speedToLeadMin: 3.8,
    cadenciasAtivas: 14,
  },
  playbooks: [
    {
      id: 'pb-1',
              title: 'Playbook Outbound Enterprise (ICP Corporativo)',
              category: 'Outbound',
              targetRole: 'BDR',
              complianceRate: 92,
              stagesCount: 5,
              lastUpdated: '02/10/2026',
              status: 'Ativo',
              description: 'Metodologia de prospecção account-based para contas com faturamento > R$ 50M.',
            },
            {
              id: 'pb-2',
              title: 'Playbook Inbound Qualificação Rápida (Speed-to-Lead)',
              category: 'Inbound',
              targetRole: 'SDR',
              complianceRate: 85,
              stagesCount: 4,
              lastUpdated: '28/09/2026',
              status: 'Ativo',
              description: 'Protocolo de primeiro contato em menos de 5 minutos com matriz BANT.',
            },
            {
              id: 'pb-3',
              title: 'Demonstração de Alto Impacto & Proof-of-Value',
              category: 'Enterprise',
              targetRole: 'Closer',
              complianceRate: 79,
              stagesCount: 6,
              lastUpdated: '15/09/2026',
              status: 'Ativo',
              description: 'Roteiro de demo guiada por dores diagnosticadas e validação de ROI.',
            },
            {
              id: 'pb-4',
              title: 'Playbook de Expansão e Upsell na Carteira',
              category: 'Expansão',
              targetRole: 'Account Executive',
              complianceRate: 94,
              stagesCount: 4,
              lastUpdated: '20/09/2026',
              status: 'Ativo',
              description: 'Gatilhos de consumo e identificação de novas áreas dentro da conta.',
            },
          ],
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
              categoria: 'Passagem de Bastão',
              gatilho: 'Lead atinge status QUALIFIED com notas de diagnóstico salvas no CRM',
              slaMaximo: 'Até 4 horas úteis para aceitação da agenda',
              responsavel: 'SDR Leader & Closer',
              status: 'Obrigatório',
            },
            {
              id: 'pr-2',
              codigo: 'SOP-02',
              nome: 'Speed-to-Lead Inbound (SLA de Primeiro Toque)',
              categoria: 'SLA Operacional',
              gatilho: 'Entrada de lead via formulário web ou webhook de parceiro',
              slaMaximo: 'Menos de 5 minutos para primeira tentativa telefônica',
              responsavel: 'Equipe de Pré-Vendas (SDR)',
              status: 'Obrigatório',
            },
            {
              id: 'pr-3',
              codigo: 'SOP-03',
              nome: 'Distribuição Inteligente Round-Robin',
              categoria: 'Distribuição',
              gatilho: 'Entrada de nova oportunidade atribuída por segmento e capacidade',
              slaMaximo: 'Instantâneo via automação',
              responsavel: 'Sistema & Gestor Comercial',
              status: 'Obrigatório',
            },
            {
              id: 'pr-4',
              codigo: 'SOP-04',
              nome: 'Critérios de Rejeição e Descarte de Oportunidades',
              categoria: 'Qualificação',
              gatilho: 'Lead fora do perfil de ICP ou sem orçamento/prazo definido',
              slaMaximo: 'Registro de motivo padronizado obrigatório',
              responsavel: 'SDR / Closer',
              status: 'Obrigatório',
            },
          ],
          roteiros: [
            {
              id: 'rot-1',
              titulo: 'Cold Call - Gancho de Abertura Executiva (30 segundos)',
              canal: 'Telefone',
              fase: 'Abertura',
              taxaSucesso: 76,
              corpoTexto:
                'Olá, {nome_contato}! Aqui é o {meu_nome} do BirthHub 360. Vi que você lidera a área comercial na {empresa}. Estou ligando rápido porque percebemos que empresas do seu porte costumam perder até 35% de conversão por falta de orquestração entre SDR e Closer. Como vocês estão organizando essa passagem de bastão hoje?',
              variaveis: ['nome_contato', 'meu_nome', 'empresa'],
            },
            {
              id: 'rot-2',
              titulo: 'WhatsApp - Follow-up Imediato Pós-Download de Material',
              canal: 'WhatsApp',
              fase: 'Qualificação',
              taxaSucesso: 84,
              corpoTexto:
                'Oi, {nome_contato}, tudo bem? Notei que você acessou o material de {tema_interesse} da {empresa}. Para te poupar tempo com conteúdo genérico, qual o principal gargalo de vendas que você quer resolver neste trimestre?',
              variaveis: ['nome_contato', 'tema_interesse', 'empresa'],
            },
            {
              id: 'rot-3',
              titulo: 'Contorno de Objeção: "Já temos um CRM / outra solução"',
              canal: 'Telefone',
              fase: 'Contorno de Objeção',
              taxaSucesso: 69,
              corpoTexto:
                'Excelente, {nome_contato}! Não queremos substituir seu sistema de registro, e sim colocar a camada de orquestração ativa e IA sobre ele. Nossos clientes usam o BirthHub para multiplicar a velocidade dos vendedores sem mexer no banco existente. Faz sentido ver em 15 minutos como isso opera na prática?',
              variaveis: ['nome_contato'],
            },
            {
              id: 'rot-4',
              titulo: 'Fechamento de Demonstração - Compromisso com Próximo Passo',
              canal: 'Reunião',
              fase: 'Fechamento',
              taxaSucesso: 88,
              corpoTexto:
                '{nome_contato}, com base no que vimos, a solução resolve os problemas de {dores_validadas} e economiza {horas_economizadas} por semana do seu time. Para formalizarmos a proposta, quem além de você na diretoria precisa avaliar os números na quinta-feira?',
              variaveis: ['nome_contato', 'dores_validadas', 'horas_economizadas'],
            },
          ],
        };
