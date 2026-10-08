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

export type Company = Omit<DomainCompany<string>, 'contacts' | 'leads'> & {
  contacts?: Contact[];
  leads?: Lead[];
};

export type Contact = Omit<DomainContact<string, ContactStatus>, 'company' | 'leads'> & {
  company?: Company;
  leads?: Lead[];
};

export type Lead = Omit<DomainLead<string, LeadStatus, LeadTemperature>, 'company' | 'contact' | 'activities' | 'timeline' | 'internalNotes'> & {
  company?: Company;
  contact?: Contact;
  activities?: Activity[];
  timeline?: TimelineEvent[];
  internalNotes?: Note[];
};

export type Activity = Omit<DomainActivity<string>, 'lead'> & {
  lead?: Lead;
};

export type TimelineEvent = DomainTimelineEvent<string>;
export type Note = DomainNote<string>;
export type Attachment = DomainAttachment<string>;
