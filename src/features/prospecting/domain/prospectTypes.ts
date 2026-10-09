/**
 * Tipos centrais do domínio de prospecção (`ProspectCriteria`, `ProspectCandidate`,
 * `DecisionMaker`, `DiscoverResult`) e `buildLocationLabel`, movidos para cá na decomposição do
 * antigo `services/prospecting.service.ts` (ARCH-009, correção de 2026-08-28).
 *
 * Vivem em `domain/`, não em `services/prospecting/types.ts`, de propósito: tanto
 * `services/prospecting/*` quanto `services/apollo/*` precisam desses tipos (Apollo é uma fonte de
 * candidatos/decisores, não só um detalhe interno de prospecting), e as duas pastas de serviço já
 * se importam mutuamente (`prospecting/discovery.ts` chama `apollo.service.ts`). Antes desta
 * mudança, `apollo/types.ts`, `apollo/organizationSearch.ts` e `apollo/people.ts` importavam esses
 * tipos de volta de `services/prospecting.service.ts` — um import circular real entre os dois
 * barrels de serviço (confirmado por `npx depcruise`, regra `no-circular`; ver também o comentário
 * em `domain/searchIntent.ts::ProspectCriteriaLike`, que documentava o mesmo ciclo e por isso evita
 * importar `ProspectCriteria` até hoje). Colocar os tipos num módulo de domínio sem dependência de
 * volta para `services/` quebra o ciclo pela raiz, em vez de só reposicioná-lo.
 */

import type { DiscoveryProviderId } from './providerCapabilities.js';

/** Tipos do Requirement Engine (`domain/requirementEngine.ts`) — vivem aqui, não lá, pelo mesmo
 * motivo do resto deste arquivo: `ProspectCandidate.requirementEvaluations` precisa do tipo
 * `RequirementEvaluation`, e `requirementEngine.ts` precisa de `ProspectCandidate`/`SearchIntent`
 * — colocar os tipos no módulo que os dois importam (em vez de um importar do outro) evita um
 * ciclo real entre dois arquivos de `domain/`. */
export type RequirementType = 'HARD_FILTER' | 'SOFT_FILTER' | 'ENRICHMENT';
export type RequirementStatus = 'matched' | 'unmatched' | 'unknown';

export interface RequirementEvaluation {
  criterion: string;
  /** Rótulo pronto para exibição (ex: "Segmento", "Estado", "Cargo do decisor") — evita a UI
   * duplicar o mapeamento `criterion` → texto em português. */
  label: string;
  type: RequirementType;
  expected: string;
  /** null quando nenhum provider confirmou este dado para o candidato específico — nunca
   * preenchido com o valor pedido só para não ficar vazio (isso seria exatamente a fabricação que
   * este tipo existe para impedir). */
  observed: string | null;
  status: RequirementStatus;
  /** De onde veio o valor observado (provider real ou 'none' quando `observed` é null). */
  source: NonNullable<ProspectCandidate['source']> | 'none';
  /** Frase pronta em português explicando o status — para a UI não precisar montar texto a partir
   * de `type`+`status`. */
  reason: string;
}

export interface ProspectCriteria {
  /** Detalhes adicionais do ICP além dos campos estruturados abaixo (texto livre, nuance qualitativa). */
  icp?: string;
  /** Cargos-alvo do decisor (ex: "Diretor de Logística", "CEO") — um por linha, adicionados dinamicamente na UI. */
  decisorCargos?: string[];
  segmento: string;
  localizacao: string;
  quantidade: number;
  /** Estado (UF por extenso ou sigla) */
  estado?: string;
  /** Cidade específica */
  cidade?: string;
  /** Faixa de funcionários no formato Apollo "min,max" ou porte */
  porte?: string;
  faturamentoMin?: number;
  faturamentoMax?: number;
  faturamentoMensalMin?: number;
  faturamentoMensalMax?: number;
  /** Volume mantido como opcional para retrocompatibilidade técnica interna */
  volume?: string;
  palavrasChave?: string;
  nomeEmpresa?: string;
  anoFundacaoMin?: number;
  anoFundacaoMax?: number;
  tecnologias?: string;
  tecnologiasExcluir?: string;
  localizacaoExcluir?: string;
  apenasCapitalAberto?: boolean;
  pagina?: number;
  excludeNames?: string[];

  // NOVOS CAMPOS TURBO 360:
  subsegmento?: string;
  nicho?: string;
  produtos?: string;
  servicos?: string;
  descricaoEmpresaIdeal?: string;
  palavrasChaveObrigatorias?: string;
  palavrasChaveOpcionais?: string;
  palavrasChaveExcluir?: string;
  cnaePrincipal?: string;
  cnaesSecundarios?: string[];
  setorEconomico?: string;
  tipoMercado?: string; // B2B, B2C, B2B2C, etc.
  modeloNegocio?: string; // SaaS, Indústria, Distribuição, Varejo, etc.
  cnpj?: string;
  situacaoCadastral?: string;
  naturezaJuridica?: string;
  capitalSocialMin?: number;
  tipoEstabelecimento?: 'matriz' | 'filial' | 'ambos';
  buscaModo?: 'economico' | 'equilibrado' | 'completo';
  aiProviderMode?: 'auto' | 'groq' | 'local';

  // PERSONA DETALHADA:
  personaNome?: string;
  departamento?: string;
  funcao?: string;
  nivelHierarquico?: string;
  senioridade?: string;
  poderDecisao?: string;
  cargosEquivalentes?: string[];
  cargosExcluir?: string[];
  experienciaMinAnos?: number;
  tempoCargoMinMeses?: number;
  tempoEmpresaMinMeses?: number;
  competencias?: string[];
  apenasComEmail?: boolean;
  apenasComTelefone?: boolean;
  apenasComLinkedin?: boolean;
  maxDecisoresPorEmpresa?: number;
}

export interface DecisionMaker {
  name: string;
  title: string | null;
  email: string | null;
  emailSource?: 'apollo' | 'hunter' | 'receita' | 'web';
  emailStatus?: 'verified' | 'unconfirmed' | 'inferred' | 'none';
  phone: string | null;
  phoneType?: 'direct' | 'company' | 'mobile';
  whatsapp?: string | null;
  whatsappVerified?: boolean;
  linkedinUrl: string | null;
  department?: string | null;
  seniority?: string | null;
  functionName?: string | null;
  personaMatchScore?: number | null;
  source?: string;
  lastUpdated?: string;
}

export interface ProspectCandidate {
  tradeName: string;
  legalNameGuess: string | null;
  cnpjGuess: string | null;
  segment: string;
  size: string;
  location: string;
  fitScoreEstimate: number;
  suggestedContact: { name: string; role: string } | null;
  rationale: string;
  source?: DiscoveryProviderId;
  segmentObserved?: boolean;
  requirementEvaluations?: RequirementEvaluation[];
  linkedinUrl?: string | null;
  phone?: string | null;
  website?: string | null;
  foundedYear?: number | null;
  annualRevenue?: number | null;
  technologies?: string[];
  emails?: string[];
  apolloContacts?: DecisionMaker[];
  decisionMakers?: DecisionMaker[];
  icebreakerHook?: string | null;
  webInsights?: Array<{ title: string; url: string; domain: string }>;

  // NOVOS CAMPOS TURBO 360 DE DADOS EMPRESARIAIS:
  cnaePrincipal?: string | null;
  cnaeDescricao?: string | null;
  cnaesSecundarios?: Array<{ codigo: string; descricao: string }>;
  situacaoCadastral?: string | null;
  dataAbertura?: string | null;
  naturezaJuridica?: string | null;
  capitalSocial?: number | null;
  porte?: string | null;
  setor?: string | null;
  enderecoCompleto?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
  } | null;
  whatsappComercial?: string | null;
  whatsappVerified?: boolean;
  icpScore?: number;
  icpBreakdown?: {
    segmento: number;
    cnae: number;
    localizacao: number;
    porte: number;
    decisor: number;
    produtosServicos: number;
    sinais: number;
    total: number;
    explicacao?: string;
  };
  dataQualityScore?: number;
  confidenceScore?: number;
  sourcesProvenance?: Array<{
    field: string;
    source: string;
    observedAt: string;
    verified: boolean;
  }>;
}

export interface DiscoverResult {
  candidates: ProspectCandidate[];
  sources: Array<{ title: string; uri: string }>;
  apolloError?: string;
  providerMode: 'free' | 'hybrid';
  searchId: string;
  stats?: {
    totalEncontrados: number;
    comCnpj: number;
    comTelefone: number;
    comEmail: number;
    comWhatsapp: number;
    decisoresEncontrados: number;
    decisoresComLinkedin: number;
    decisoresComEmail: number;
    decisoresComTelefone: number;
    providersConsultados: string[];
    partialFailures: string[];
  };
}

/** Monta a localização mais precisa disponível: cidade + estado > estado > região ampla do playbook. */
export function buildLocationLabel(criteria: ProspectCriteria): string {
  if (criteria.cidade && criteria.estado) return `${criteria.cidade}, ${criteria.estado}`;
  if (criteria.estado) return criteria.estado;
  return criteria.localizacao;
}
