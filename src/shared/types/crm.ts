import type {
  CompanyStatus,
  ContactStatus,
  LeadStatus,
  LeadTemperature,
  ActivityStatus,
  ActivityType,
} from '../../lib/zod.js';
import type { LeadFunnel } from '@prisma/client';

export interface LeadQualification {
  // 4.2.1 Contexto Operacional
  segmentoOperacao?: string;
  tipoCarga?: string;
  principaisRotas?: string;
  usaTerceiros?: 'Sim' | 'Não' | '';
  mediaContratacaoTerceiros?: string;
  viagensPorMes?: string;
  frotaPropria?: string;
  frotaAgregados?: string;
  frotaTerceiros?: string;
  // 4.2.2 Estrutura Atual
  ermTms?: string;
  rastreador?: string;
  seguradora?: string;
  corretora?: string;
  possuiGR?: string;
  fornecedorGRAtual?: string;
  possuiCadastroMotorista?: string;
  consultaCadastroAtual?: string;
  possuiSoftwareLogistico?: string;
  softwareLogisticoAtual?: string;
  // 4.2.3 Dor Mapeada
  dorPrincipal?: string;
  detalhamentoDor?: string;
  impactoPercebido?: string;
  solucaoBirthub360?: 'Profile' | 'GR' | 'Connect' | 'Combinação' | '';
  // 4.2.4 Interesse e Autoridade
  nivelAutoridade?: 'Decisor' | 'Influenciador' | 'Usuário' | '';
  interessePercebido?: 'Baixo' | 'Médio' | 'Alto' | '';
  horizonteDecisao?: 'Imediato' | '30 dias' | '60-90 dias' | 'Indefinido' | '';
  // 4.2.5 Próximo Passo
  expectativaProximaCall?: string;
  temaProximaReuniao?: string;
}

export interface Company<TDate = Date> {
  id: string;
  legalName: string;
  tradeName: string;
  cnpj?: string | null;
  stateRegistration?: string | null;
  segment?: string | null;
  cnae?: string | null;
  size?: string | null;
  employeeCount?: number | null;
  estimatedRevenue?: number | null;
  website?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  phones: string[];
  emails: string[];
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  status: CompanyStatus;
  tags: string[];
  observations?: string | null;
  customFields?: Record<string, unknown> | null;
  organizationId?: string | null;
  createdAt: TDate;
  updatedAt: TDate;

  // Enriquecimento
  situacaoCadastral?: string | null;
  naturezaJuridica?: string | null;
  capitalSocial?: number | null;
  dataAbertura?: TDate | null;
  qsa?: unknown | null;
  enrichmentStatus?: string;
  enrichmentSource?: string | null;
  enrichedAt?: TDate | null;

  googleRating?: number | null;
  googleReviewsCount?: number | null;
  businessHours?: { openNow?: boolean; weekdayDescriptions?: string[] } | unknown | null;

  technologies?: string[];
  keywords?: string[];
  logoUrl?: string | null;
  apolloOrgId?: string | null;

  contacts?: Contact<TDate>[];
  leads?: Lead<TDate>[];
}

export interface Contact<TDate = Date> {
  id: string;
  name: string;
  role?: string | null;
  department?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  linkedin?: string | null;
  birthDate?: TDate | null;
  observations?: string | null;
  status: ContactStatus;
  source?: string | null;
  seniority?: string | null;
  emailStatus?: string | null;
  customFields?: Record<string, unknown> | null;
  companyId: string;
  company?: Company<TDate>;
  aiProcessingConsent?: boolean | null;
  leads?: Lead<TDate>[];
  organizationId?: string | null;
  createdAt: TDate;
  updatedAt: TDate;
}

export interface Lead<TDate = Date> {
  id: string;
  status: LeadStatus;
  funnel?: LeadFunnel | 'Lead' | 'Negocio';
  title?: string | null;
  amount?: number | null;
  currency: string;
  probability?: number | null;
  forecastProbabilityAi?: number | null;
  expectedCloseAt?: TDate | null;
  customFields?: Record<string, unknown> | null;
  tags: string[];
  pipelineId?: string | null;
  pipelineStageId?: string | null;
  source?: string | null;
  channel?: string | null;
  temperature?: LeadTemperature | null;
  score?: number | null;
  owner?: string | null;
  lastInteraction?: TDate | null;
  nextAction?: TDate | null;
  closedAt?: TDate | null;
  organizationId?: string | null;
  pic?: 'PIC1_Expansao' | 'PIC2_Risco' | 'PIC3_Transicao' | string | null;
  qualification?: LeadQualification | Record<string, unknown> | null;

  resumeDate?: TDate | null;
  cadenceStage?: string | null;
  lossReason?: string | null;
  dealPackage?: string | null;
  dealStatus?: string | null;
  relationshipLevel?: string | null;
  commissionPercent?: string | null;
  partnerBroker?: string | null;
  qualificationValidatedByAM?: boolean | null;

  bitrixLeadId?: string | null;
  bitrixDealId?: string | null;
  bitrixStageLabel?: string | null;
  bitrixSyncStatus?: string | null;
  bitrixSyncError?: string | null;
  bitrixSyncedAt?: TDate | null;

  companyId?: string | null;
  company?: Company<TDate>;
  contactId?: string | null;
  contact?: Contact<TDate>;

  activities?: Activity<TDate>[];
  timeline?: TimelineEvent<TDate>[];
  internalNotes?: Note<TDate>[];

  createdAt: TDate;
  updatedAt: TDate;
}

export interface Activity<TDate = Date> {
  id: string;
  type: ActivityType;
  owner: string;
  date: TDate;
  time?: string | null;
  status: ActivityStatus;
  observations?: string | null;
  leadId: string;
  lead?: Lead<TDate>;
  organizationId?: string | null;
  createdAt: TDate;
  updatedAt: TDate;
}

export interface TimelineEvent<TDate = Date> {
  id: string;
  type: string;
  description: string;
  leadId: string;
  createdAt: TDate;
}

export interface Note<TDate = Date> {
  id: string;
  content: string;
  author: string;
  leadId: string | null;
  companyId: string | null;
  contactId: string | null;
  createdAt: TDate;
  updatedAt: TDate;
}

export interface Attachment<TDate = Date> {
  id: string;
  leadId: string | null;
  companyId: string | null;
  contactId: string | null;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  objectKey: string;
  uploadedBy: string | null;
  organizationId: string;
  createdAt: TDate;
}
