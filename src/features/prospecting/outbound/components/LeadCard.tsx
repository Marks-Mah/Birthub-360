import type React from 'react';
import type { Lead } from './types.js';
import { useLeadCardState } from './lead-card/useLeadCardState.js';
import { LeadCardHeader } from './lead-card/LeadCardHeader.js';
import { LeadCardDecisorProfile } from './lead-card/LeadCardDecisorProfile.js';
import { LeadCardQuickActions } from './lead-card/LeadCardQuickActions.js';
import { LeadCardPlaybookAdvisor } from './lead-card/LeadCardPlaybookAdvisor.js';
import { LeadCardEnrichmentBadge } from './lead-card/LeadCardEnrichmentBadge.js';
import { LeadCardHistoryPreview } from './lead-card/LeadCardHistoryPreview.js';

interface LeadCardProps {
  lead: Lead;
  onUpdateStatus?: (leadId: string, newStatus: string) => Promise<void>;
  onPromoteToDeal?: (lead: Lead) => Promise<void>;
  className?: string;
}

export function LeadCard({ lead, onUpdateStatus, onPromoteToDeal, className = '' }: LeadCardProps): React.ReactElement {
  const {
    isExpanded,
    toggleExpand,
    activeTab,
    setActiveTab,
    isSaving,
    handleStatusChange,
    handlePromote,
    handleStartCall,
  } = useLeadCardState({ lead, onUpdateStatus, onPromoteToDeal });

  return (
    <article
      className={`rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 p-5 shadow-sm hover:shadow-md transition-all ${className}`}
      aria-label={`Lead: ${lead.companyName} — Decisor: ${lead.contactName || 'Não identificado'}`}
    >
      <LeadCardHeader
        companyName={lead.companyName}
        sector={lead.sector}
        icpScore={lead.icpScore}
        status={lead.status}
        onStatusChange={handleStatusChange}
        isSaving={isSaving}
      />

      <LeadCardDecisorProfile
        name={lead.contactName}
        title={lead.contactTitle}
        email={lead.contactEmail}
        phone={lead.contactPhone}
        linkedinUrl={lead.contactLinkedin}
      />

      <LeadCardQuickActions
        phone={lead.contactPhone}
        email={lead.contactEmail}
        whatsappUrl={lead.whatsappUrl}
        onCall={handleStartCall}
        onPromote={handlePromote}
        isSaving={isSaving}
      />

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <LeadCardEnrichmentBadge source={lead.enrichmentSource} confidence={lead.enrichmentConfidence} />
        <button
          type="button"
          onClick={toggleExpand}
          className="text-xs font-semibold text-brand hover:underline"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Ocultar Inteligência ▲' : 'Ver Recomendações de IA ▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('playbook')}
              className={`px-3 py-1 text-xs rounded-md font-medium ${activeTab === 'playbook' ? 'bg-brand text-midnight font-bold' : 'text-slate-500'}`}
            >
              Playbook IA
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 text-xs rounded-md font-medium ${activeTab === 'history' ? 'bg-brand text-midnight font-bold' : 'text-slate-500'}`}
            >
              Histórico de Toques
            </button>
          </div>

          {activeTab === 'playbook' && <LeadCardPlaybookAdvisor lead={lead} />}
          {activeTab === 'history' && <LeadCardHistoryPreview leadId={lead.id} />}
        </div>
      )}
    </article>
  );
}
