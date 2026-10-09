import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Building,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Globe,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import type { FitScoreResult } from '../../services/enrichment.service.js';
import type { ProspectCandidate } from '../../services/prospecting.service.js';
import { SoundFX } from '../../../../lib/soundEffects.js';
import { CandidateCard } from './CandidateCard.js';

interface PromoteResult {
  lead: { id: string };
  fit?: FitScoreResult;
  enrichment?: {
    company: { googleRating?: number; googleReviewsCount?: number; observations?: string };
    apolloContacts?: Array<{
      name: string;
      title: string | null;
      email: string | null;
      phone?: string | null;
      linkedin_url?: string | null;
    }>;
  };
}

export function DiscoveryResultsPanel({
  candidates,
  filteredCandidates,
  isSearching,
  loadingStepIdx,
  loadingSteps,
  resultFilter,
  setResultFilter,
  apolloError,
  isSavingBatch,
  onSaveAll,
  onExport,
  selectedCandidates,
  toggleSelectAll,
  toggleSelect,
  onBulkSave,
  onBulkEnrich,
  promotingKey,
  promoted,
  onPromoteCandidate,
  onDiscoverMore,
  rejectingKey,
  onRejectCandidate,
}: {
  candidates: ProspectCandidate[];
  filteredCandidates: Array<{ c: ProspectCandidate; i: number }>;
  isSearching: boolean;
  loadingStepIdx: number;
  loadingSteps: string[];
  resultFilter: string;
  setResultFilter: (value: string) => void;
  apolloError: string | null;
  isSavingBatch: boolean;
  onSaveAll: () => void;
  onExport: () => void;
  selectedCandidates: Set<number>;
  toggleSelectAll: () => void;
  toggleSelect: (idx: number) => void;
  onBulkSave: () => void;
  onBulkEnrich: () => void;
  promotingKey: string | null;
  promoted: Record<string, PromoteResult>;
  onPromoteCandidate: (candidate: ProspectCandidate, idx: number) => void;
  onDiscoverMore: () => void;
  rejectingKey: string | null;
  onRejectCandidate: (candidate: ProspectCandidate, idx: number) => void;
}) {
  // Métricas agregadas em tempo real dos candidatos
  const comCnpj = candidates.filter((c) => !!c.cnpjGuess).length;
  const comTelefone = candidates.filter((c) => !!c.phone).length;
  const comEmail = candidates.filter((c) => !!c.emails && c.emails.length > 0).length;
  const totalDecisores = candidates.reduce((acc, c) => acc + (c.decisionMakers?.length || 0), 0);
  const decisoresLinkedin = candidates.reduce(
    (acc, c) => acc + (c.decisionMakers?.filter((d) => !!d.linkedinUrl).length || 0),
    0,
  );
  const scoreAlto = candidates.filter((c) => (c.icpScore ?? c.fitScoreEstimate ?? 0) >= 70).length;

  return (
    <div className="xl:col-span-8 flex flex-col h-full space-y-4">
      {/* Barra superior de ações e métricas */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink flex items-center gap-2">
            ✨ Resultados Encontrados
            {candidates.length > 0 && (
              <span className="text-xs bg-brand/10 text-brand-ink dark:text-brand border border-brand/20 px-2.5 py-0.5 rounded-full font-bold">
                {candidates.length} empresas
              </span>
            )}
          </h2>
          <p className="text-xs text-ink-2">
            Dados verificados e enriquecidos com decisores, contatos e score ICP
          </p>
        </div>

        {candidates.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                SoundFX.play('click');
                onSaveAll();
              }}
              disabled={isSavingBatch}
              className="bg-brand text-on-brand px-3.5 py-2 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <UserPlus size={14} /> {isSavingBatch ? 'Salvando...' : 'Salvar Todos no CRM'}
            </button>
            <button
              type="button"
              onClick={() => {
                SoundFX.play('click');
                onExport();
              }}
              className="bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet size={14} /> Exportar Excel
            </button>
          </div>
        )}
      </div>

      {/* Cartões de Indicadores Gerais (Métricas do Motor Turbo) */}
      {candidates.length > 0 && !isSearching && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <div className="p-2.5 rounded-xl border border-line bg-surface flex flex-col">
            <span className="text-[10px] text-ink-2 font-bold uppercase flex items-center gap-1">
              <Building size={11} /> CNPJ Identificado
            </span>
            <span className="text-base font-black text-ink mt-0.5">
              {comCnpj}{' '}
              <span className="text-[10px] text-ink-2 font-normal">/ {candidates.length}</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-line bg-surface flex flex-col">
            <span className="text-[10px] text-ink-2 font-bold uppercase flex items-center gap-1">
              <Phone size={11} /> Com Telefone
            </span>
            <span className="text-base font-black text-ink mt-0.5">
              {comTelefone}{' '}
              <span className="text-[10px] text-ink-2 font-normal">/ {candidates.length}</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-line bg-surface flex flex-col">
            <span className="text-[10px] text-ink-2 font-bold uppercase flex items-center gap-1">
              <Mail size={11} /> Com E-mail
            </span>
            <span className="text-base font-black text-ink mt-0.5">
              {comEmail}{' '}
              <span className="text-[10px] text-ink-2 font-normal">/ {candidates.length}</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-line bg-surface flex flex-col">
            <span className="text-[10px] text-ink-2 font-bold uppercase flex items-center gap-1">
              <Users size={11} /> Decisores
            </span>
            <span className="text-base font-black text-ink mt-0.5">{totalDecisores}</span>
          </div>

          <div className="p-2.5 rounded-xl border border-line bg-surface flex flex-col">
            <span className="text-[10px] text-ink-2 font-bold uppercase flex items-center gap-1">
              <UserCheck size={11} /> LinkedIn Decisor
            </span>
            <span className="text-base font-black text-ink mt-0.5">{decisoresLinkedin}</span>
          </div>

          <div className="p-2.5 rounded-xl border border-line bg-surface flex flex-col">
            <span className="text-[10px] text-ink-2 font-bold uppercase flex items-center gap-1">
              <Sparkles size={11} /> Score Alto (≥70)
            </span>
            <span className="text-base font-black text-emerald-500 mt-0.5">{scoreAlto}</span>
          </div>
        </div>
      )}

      {/* Filtro Rápido em Tempo Real */}
      {candidates.length > 0 && !isSearching && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" />
          <input
            type="text"
            placeholder="⚡ Filtrar candidatos por razão social, nome fantasia, cidade ou segmento..."
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface border border-line rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors outline-none"
          />
        </div>
      )}

      {apolloError && !isSearching && (
        <div className="p-3 bg-warning/10 border border-warning/30 rounded-xl text-xs text-warning-active dark:text-warning flex items-start gap-2">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          Aviso do provedor Apollo.io: {apolloError}
        </div>
      )}

      {/* Estado de Carregamento */}
      {isSearching ? (
        <div className="flex-1 bg-surface rounded-2xl border border-line shadow-sm flex flex-col items-center justify-center p-10 min-h-[400px]">
          <div className="w-24 h-24 relative mb-8">
            <div className="absolute inset-0 border-4 border-line rounded-full" />
            <div className="absolute inset-0 border-4 border-brand rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-brand">
              <Globe size={32} className="animate-pulse" />
            </div>
          </div>
          <h3 className="font-black text-xl text-ink mb-4 text-center">
            🌎 Prospecção Turbo em Andamento...
          </h3>
          <div className="space-y-3 w-full max-w-sm">
            {loadingSteps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 text-sm font-medium ${
                  idx === loadingStepIdx
                    ? 'text-brand-ink dark:text-brand'
                    : idx < loadingStepIdx
                      ? 'text-ink-2'
                      : 'text-ink opacity-50'
                }`}
              >
                {idx < loadingStepIdx ? (
                  <CheckCircle2 size={16} />
                ) : idx === loadingStepIdx ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-current" />
                )}
                {step}
              </div>
            ))}
          </div>
        </div>
      ) : candidates.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 flex-1">
          {/* Barra de seleção em massa */}
          <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-line">
            <input
              type="checkbox"
              className="rounded border-line text-brand focus:ring-brand w-4 h-4 cursor-pointer"
              checked={
                selectedCandidates.size > 0 && selectedCandidates.size === filteredCandidates.length
              }
              onChange={toggleSelectAll}
            />
            <span className="text-xs text-ink-2 font-bold">
              {selectedCandidates.size} de {filteredCandidates.length} selecionados
            </span>

            <div className="h-4 w-px bg-line mx-2" />

            <button
              type="button"
              onClick={() => {
                SoundFX.play('click');
                onBulkSave();
              }}
              disabled={selectedCandidates.size === 0 || isSavingBatch}
              className="text-[11px] font-bold bg-surface-2 hover:bg-line text-ink px-3 py-1.5 rounded-lg active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              Salvar Selecionados
            </button>
            <button
              type="button"
              onClick={() => {
                SoundFX.play('confirm');
                onBulkEnrich();
              }}
              disabled={selectedCandidates.size === 0 || isSavingBatch}
              className="text-[11px] font-bold bg-brand text-on-brand px-3 py-1.5 rounded-lg active:scale-95 transition-all disabled:opacity-50 hover:brightness-110 cursor-pointer shadow-sm"
            >
              Enriquecer e Salvar
            </button>
          </div>

          {filteredCandidates.length === 0 && (
            <div className="bg-surface rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-2">
              🔍 Nenhuma empresa corresponde ao filtro &quot;{resultFilter}&quot;.
            </div>
          )}

          {filteredCandidates.map(({ c, i }) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <CandidateCard
                candidate={c}
                onPromote={() => onPromoteCandidate(c, i)}
                isPromoting={promotingKey === `discovery-${i}` || isSavingBatch}
                promoted={!!promoted[`discovery-${i}`]}
                promotedResult={promoted[`discovery-${i}`]}
                isSelected={selectedCandidates.has(i)}
                onToggleSelect={() => toggleSelect(i)}
                onReject={() => onRejectCandidate(c, i)}
                isRejecting={rejectingKey === `discovery-${i}`}
              />
            </motion.div>
          ))}

          <button
            type="button"
            onClick={() => {
              SoundFX.play('click');
              onDiscoverMore();
            }}
            disabled={isSearching}
            className="w-full py-3.5 rounded-xl border border-dashed border-line text-xs font-bold text-ink-2 hover:text-brand hover:border-brand/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSearching ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
            Carregar Próximos Resultados (Paginação Progressiva)
          </button>
        </motion.div>
      ) : (
        <div className="flex-1 bg-surface rounded-2xl border border-dashed border-line flex flex-col items-center justify-center p-10 min-h-[400px]">
          <div className="bg-surface-2 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-ink-2">
            <Search size={32} />
          </div>
          <h3 className="font-black text-xl text-ink mb-2">Pronto para Prospectar</h3>
          <p className="text-xs sm:text-sm text-ink-2 text-center max-w-sm">
            Use o formulário ao lado para buscar empresas por segmento, CNAE, CNPJ ou descreva sua
            busca em linguagem natural com Inteligência Artificial.
          </p>
        </div>
      )}
    </div>
  );
}
