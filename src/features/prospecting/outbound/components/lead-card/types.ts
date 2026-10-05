export type LeadStatus =
  | 'NOVO'
  | 'EM_CONTATO'
  | 'QUALIFICADO'
  | 'DESQUALIFICADO'
  | 'REUNIAO_AGENDADA'
  | 'OPORTUNIDADE';

export type EnrichmentSource = 'APOLLO' | 'HUNTER' | 'GOOGLE_MAPS' | 'MANUAL';

export interface LeadTouchHistory {
  id: string;
  channel: 'VOZ' | 'WHATSAPP' | 'EMAIL' | 'NOTA';
  summary: string;
  createdAt: string;
  authorName: string;
}

export interface PlaybookRecommendation {
  openingHook: string;
  keyObjection: string;
  recommendedResponse: string;
  competitorDifferentiator?: string;
}

export interface Lead {
  id: string;
  companyName: string;
  sector?: string;
  icpScore?: number;
  status: LeadStatus;
  contactName?: string;
  contactTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactLinkedin?: string;
  whatsappUrl?: string;
  enrichmentSource?: EnrichmentSource;
  enrichmentConfidence?: 'ALTA' | 'MEDIA' | 'BAIXA';
  playbook?: PlaybookRecommendation;
}
