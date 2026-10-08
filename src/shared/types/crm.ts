import type { CompanyStatus, ActivityStatus, ActivityType } from '../../lib/zod.js';
import type {
  LeadFunnel,
  ContactStatus as PrismaContactStatus,
  LeadStatus as PrismaLeadStatus,
  LeadTemperature as PrismaLeadTemperature,
} from '@prisma/client';

export interface LeadQualification {
  segmentoOperacao?: string;
  tipoCarga?: string;
  principaisRotas?: string;
  usaTerceiros?: 'Sim' | 'Não' | '';
  mediaContratacaoTerceiros?: string;
  viagensPorMes?: string;
  frotaPropria?: string;
  frotaAgregados?: string;
  frotaTerceiros?: string;
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
  dorPrincipal?: string;
  detalhamentoDor?: string;
  impactoPercebido?: string;
  solucaoBirthub360?: 'Profile' | 'GR' | 'Connect' | 'Combinação' | '';
  nivelAutoridade?: 'Decisor' | 'Influenciador' | 'Usuário' | '';
  interessePercebido?: 'Baixo' | 'Médio' | 'Alto' | '';
  horizonteDecisao?: 'Imediato' | '30 dias' | '60-90 dias' | 'Indefinido' | '';
  expectativaProximaCall?: string;
  temaProximaReuniao?: string;
}

export interface Company<
  TDate = Date,
  TContactStatus = PrismaContactStatus,
  TLeadStatus = PrismaLeadStatus,
  TLeadTemperature = PrismaLeadTemperature,
> {
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
  customFields?: any;
  organizationId?: string | null;
  createdAt: TDate;
  updatedAt: TDate;

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
  businessHours?: { openNow?: boolean; weekdayDescriptions?: string[] } | null;

  technologies?: string[];
  keywords?: string[];
  logoUrl?: string | null;
  apolloOrgId?: string | null;

  contacts?: Contact<TDate, TContactStatus, TLeadStatus, TLeadTemperature>[];
  leads?: Lead<TDate, TLeadStatus, TLeadTemperature, TContactStatus>[];
}

export interface Contact<
  TDate = Date,
  TStatus = PrismaContactStatus,
  TLeadStatus = PrismaLeadStatus,
  TLeadTemperature = PrismaLeadTemperature,
> {
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
  status: TStatus;
  source?: string | null;
  seniority?: string | null;
  emailStatus?: string | null;
  customFields?: any;
  companyId: string;
  company?: Company<TDate, TStatus, TLeadStatus, TLeadTemperature>;
  aiProcessingConsent?: boolean | null;
  leads?: Lead<TDate, TLeadStatus, TLeadTemperature, TStatus>[];
  organizationId?: string | null;
  createdAt: TDate;
  updatedAt: TDate;
}

export interface Lead<
  TDate = Date,
  TStatus = PrismaLeadStatus,
  TTemperature = PrismaLeadTemperature,
  TContactStatus = PrismaContactStatus,
> {
  id: string;
  status: TStatus;
  funnel?: LeadFunnel | 'Lead' | 'Negocio';
  title?: string | null;
  amount?: number | null;
  currency: string;
  probability?: number | null;
  forecastProbabilityAi?: number | null;
  expectedCloseAt?: TDate | null;
  customFields?: any;
  tags: string[];
  pipelineId?: string | null;
  pipelineStageId?: string | null;
  source?: string | null;
  channel?: string | null;
  temperature?: TTemperature | null;
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

  companyId: string | null;
  company?: Company<TDate, TContactStatus, TStatus, TTemperature>;
  contactId: string | null;
  contact?: Contact<TDate, TContactStatus, TStatus, TTemperature>;

  activities?: Activity<TDate, TStatus, TTemperature, TContactStatus>[];
  timeline?: TimelineEvent<TDate>[];
  internalNotes?: Note<TDate>[];

  createdAt: TDate;
  updatedAt: TDate;
}

export interface Activity<
  TDate = Date,
  TLeadStatus = PrismaLeadStatus,
  TLeadTemperature = PrismaLeadTemperature,
  TContactStatus = PrismaContactStatus,
> {
  id: string;
  type: ActivityType;
  owner: string;
  date: TDate;
  time?: string | null;
  status: ActivityStatus;
  observations?: string | null;
  leadId: string;
  lead?: Lead<TDate, TLeadStatus, TLeadTemperature, TContactStatus>;
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
