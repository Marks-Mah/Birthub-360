// Re-export domain enum types from the single source of truth (zod.ts)
// This ensures frontend types stay in sync with backend validation schemas.
export type {
  ACTIVITY_STATUS,
  ACTIVITY_TYPE,
  ActivityStatus,
  ActivityType,
  COMPANY_STATUS,
  CONTACT_STATUS,
  CompanyStatus,
  ContactStatus,
  LEAD_STATUS,
  LEAD_TEMPERATURE,
  LeadStatus,
  LeadTemperature,
} from '../lib/zod.js';
// Arrays das etapas de cada funil (não tipos) — usados pelos dois Kanbans para montar as colunas.

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

import type {
  LeadQualification,
  Company as DomainCompany,
  Contact as DomainContact,
  Lead as DomainLead,
  Activity as DomainActivity,
  TimelineEvent as DomainTimelineEvent,
  Note as DomainNote,
  Attachment as DomainAttachment,
} from '../shared/types/crm.js';

import type { ContactStatus, LeadStatus, LeadTemperature } from '../lib/zod.js';

export type { LeadQualification };
export type Company = DomainCompany<string>;
export type Contact = DomainContact<string, ContactStatus>;
export type Lead = DomainLead<string, LeadStatus, LeadTemperature>;
export type Activity = DomainActivity<string>;
export type TimelineEvent = DomainTimelineEvent<string>;
export type Note = DomainNote<string>;
export type Attachment = DomainAttachment<string>;
