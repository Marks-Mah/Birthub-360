import { ArrowRight, Bot, Layers, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type {
  Workspace,
  WorkspaceAgentGroup,
  WorkspaceCapabilityStatus,
  WorkspaceKpi,
  WorkspaceModule,
  WorkspaceQuickAction,
} from '../../features/workspace/workspace.api.js';
import { cn } from '../../lib/utils.js';
import { TAB_META, type TabType } from '../layout/tabMeta.js';
import { Badge, type BadgeProps } from '../ui/Badge.js';
import { EmptyState } from '../ui/EmptyState.js';
import { VisualState } from '../ui/VisualState.js';

// Vive fora de src/features/** de propósito: é reaproveitado por duas features (`workspace`, tela
// dedicada em /app/workspace, e `dashboard`, seção da home unificada em /app e /app/dashboard) —
// um import direto feature-a-feature violaria `no-cross-feature-imports`
// (.dependency-cruiser.cjs). Um componente fora de src/features/ pode ser importado por qualquer
// feature (mesma regra que já vale para src/components/ui/**), e pode importar tipos/serviços de
// uma feature específica sem violar a regra (que só restringe o que SAI de dentro de
// src/features/<x>/).

// Rótulo/ícone de cada status de KPI — fonte única desta tela (nunca reinventa o vocabulário de
// `TOOL_BINDINGS.reason`/`CapabilityDecisionReason` do backend, só traduz pra UI). Ver
// `workspace.service.ts` (backend) para a origem de cada status.
const KPI_STATUS_META: Record<
  WorkspaceCapabilityStatus,
  { label: string; badge: NonNullable<BadgeProps['variant']> }
> = {
  AVAILABLE: { label: 'Disponível', badge: 'success' },
  APPROVAL_REQUIRED: { label: 'Requer aprovação', badge: 'warning' },
  REQUEST: { label: 'Sob solicitação', badge: 'info' },
  DISCOVER_ONLY: { label: 'Só descoberta', badge: 'outline' },
  SOURCE_REQUIRED: { label: 'Fonte de dado ausente', badge: 'danger' },
  FUTURE_TOOL: { label: 'Em construção', badge: 'neon' },
  TOOL_UNAVAILABLE: { label: 'Indisponível', badge: 'outline' },
  NOT_GRANTED: { label: 'Não concedido ao cargo', badge: 'outline' },
};

const ACCESS_LEVEL_LABEL: Record<WorkspaceAgentGroup['accessLevel'], string> = {
  EXECUTE: 'Executa diretamente',
  READ: 'Só leitura',
  REQUEST: 'Sob solicitação',
  DISCOVER: 'Só descoberta',
};

function moduleMeta(moduleKey: string): { label: string; icon: typeof Layers } {
  const meta = (TAB_META as Partial<Record<string, { label: string; icon: typeof Layers }>>)[
    moduleKey
  ];
  return meta ?? { label: moduleKey, icon: Layers };
}

/** Conteúdo por cargo (PROMPT 6) — 1 componente genérico, nunca 12 telas duplicadas: o que muda
 *  por cargo é só o payload de `GET /api/workspace/me` (`ROLE_WORKSPACE_DEFINITIONS` + grants
 *  reais no backend), nunca este arquivo. Consumido por `WorkspaceHome.tsx` (tela dedicada
 *  `/app/workspace`) e por `AdaptiveDashboard.tsx` (seção por cargo da home unificada). */
export function WorkspaceReadySection({ workspace }: { workspace: Workspace }) {
  const navigate = useNavigate();
  const goToModule = (moduleKey: string) => navigate(`/app/${moduleKey}` as `/app/${TabType}`);

  const widgets = new Set(workspace.homeWidgets);

  return (
    <div className="w-full max-w-[92rem] space-y-12">
      {/* Header Minimalista */}
      {widgets.has('mission') && workspace.jobRole && (
        <div className="flex flex-col gap-2 pb-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              {workspace.jobRole.department} ● LIVE
            </p>
          </div>
          <h1 className="font-sans text-3xl font-light tracking-tight text-white md:text-4xl">
            {workspace.jobRole.name}
          </h1>
          <p className="mt-1 max-w-2xl text-sm font-light text-white/60">
            {workspace.jobRole.description}
          </p>
        </div>
      )}

      {/* Grid Fluido sem Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Coluna Principal: KPIs e Navegação */}
        <div className="col-span-1 lg:col-span-8 space-y-12">
          {/* KPIs borderless */}
          {widgets.has('kpis') && (
            <section aria-labelledby="workspace-kpis-heading" className="space-y-6">
              <h2
                id="workspace-kpis-heading"
                className="text-[11px] font-bold tracking-widest text-white/40 uppercase"
              >
                Indicadores Chave
              </h2>
              {workspace.kpis.length === 0 ? (
                <EmptyState
                  title="Nenhum indicador"
                  description="Sem capacidades de leitura."
                  icon={<Sparkles className="h-6 w-6 opacity-50" />}
                />
              ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {workspace.kpis.map((kpi) => {
                    const statusMeta = KPI_STATUS_META[kpi.status];
                    return (
                      <div key={kpi.capabilityCode} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <VisualState
                            state={kpi.status === 'AVAILABLE' ? 'LIVE' : 'NO_DATA'}
                            size="sm"
                          />
                          <p className="text-[10px] font-bold uppercase tracking-wide text-white/50">
                            {kpi.domain || 'Métrica'}
                          </p>
                        </div>
                        <p className="text-xl font-light tracking-tight text-white">{kpi.label}</p>
                        {kpi.description && (
                          <p className="mt-2 text-xs font-light text-white/40">{kpi.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Navegação Rápida estilo Terminal */}
          {widgets.has('quickActions') && workspace.quickActions.length > 0 && (
            <section aria-labelledby="workspace-quick-actions-heading" className="space-y-6">
              <h2
                id="workspace-quick-actions-heading"
                className="text-[11px] font-bold tracking-widest text-white/40 uppercase"
              >
                Ações Rápidas
              </h2>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {workspace.quickActions.map((qa) => {
                  const { label, icon: Icon } = moduleMeta(qa.moduleKey);
                  const displayLabel = 'label' in qa ? qa.label : label;
                  return (
                    <button
                      key={qa.moduleKey}
                      type="button"
                      disabled={qa.locked}
                      onClick={() => goToModule(qa.moduleKey)}
                      title={qa.locked ? (qa.lockedReason ?? undefined) : undefined}
                      className={cn(
                        'group flex items-center gap-2 text-sm font-medium transition-colors',
                        !qa.locked
                          ? 'text-white/70 hover:text-white cursor-pointer'
                          : 'text-white/20 cursor-not-allowed',
                      )}
                    >
                      <Icon className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <span>{displayLabel}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Coluna Lateral: Agentes e Módulos */}
        <div className="col-span-1 lg:col-span-4 space-y-12">
          {/* Agentes sem background box */}
          {widgets.has('agentGroups') && (
            <section aria-labelledby="workspace-agents-heading" className="space-y-6">
              <h2
                id="workspace-agents-heading"
                className="text-[11px] font-bold tracking-widest text-white/40 uppercase"
              >
                Copilotos Ativos
              </h2>
              {workspace.agentGroups.length === 0 ? (
                <EmptyState
                  title="Nenhum copiloto"
                  description=""
                  icon={<Bot className="h-6 w-6 opacity-50" />}
                />
              ) : (
                <div className="space-y-6">
                  {workspace.agentGroups.map((group) => (
                    <div key={group.accessLevel} className="flex flex-col gap-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-white/30">
                        {ACCESS_LEVEL_LABEL[group.accessLevel]}
                      </p>
                      <div className="flex flex-col gap-2">
                        {group.agents.map((agent) => (
                          <div key={agent.code} className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-brand/70" />
                            <span className="text-sm text-white/80 font-medium">{agent.name}</span>
                            {agent.requiresApproval && (
                              <span className="ml-auto text-[10px] text-amber-400/80 uppercase tracking-widest">
                                Aprovação
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
