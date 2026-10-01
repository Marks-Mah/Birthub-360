import { useDroppable } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import React from 'react';
import { LEAD_STATUS_EMOJI as STATUS_EMOJI } from '../../../lib/enumMap.js';
import type { Lead, LeadStatus } from '../../../types/index.js';
import { KanbanCard } from './KanbanCard.js';

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
  onCardClick: (lead: Lead) => void;
  onCardEnrich?: (leadId: string) => Promise<void>;
  onConvert?: (leadId: string) => Promise<void>;
  selectedLeadIds?: Set<string>;
  onToggleSelect?: (leadId: string) => void;
  selectionMode?: boolean;
  /** id do usuário -> nome, para KanbanCard exibir o dono (Lead.owner guarda o id, não o nome). */
  ownerNameById?: Record<string, string>;
}

export const KanbanColumn = React.memo(function KanbanColumn({
  status,
  leads,
  onCardClick,
  onCardEnrich,
  onConvert,
  selectedLeadIds,
  onToggleSelect,
  selectionMode,
  ownerNameById,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative flex flex-col bg-surface/80 backdrop-blur-md rounded-2xl min-w-[320px] max-w-[320px] max-h-full shrink-0 border transition-all duration-300 shadow-sm overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#1677FF]/35 before:to-transparent before:z-20 ${
        isOver
          ? 'border-[#1677FF] dark:border-[#1677FF] bg-[#1677FF]/10 shadow-[0_0_25px_rgba(22,119,255,0.18)] scale-[1.01]'
          : 'border-line hover:border-brand/25'
      }`}
    >
      <div className="p-4 border-b border-line bg-surface-2/60 rounded-t-2xl sticky top-0 backdrop-blur-xl z-10 flex flex-col gap-1 shadow-sm">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-sm font-bold text-ink-2 flex items-center gap-1.5 min-w-0">
            <span className="text-xs opacity-60 shrink-0" aria-hidden="true">
              {STATUS_EMOJI[status] || '📌'}
            </span>
            <span className="line-clamp-2 leading-tight text-ink">{status}</span>
          </h3>
          <span className="bg-surface-2 text-ink-2 text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 border border-line flex items-center gap-1.5">
            {leads.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse" />
            )}
            {leads.length}
          </span>
        </div>
        <div className="text-xs text-[#1677FF] font-medium">
          Forecast:{' '}
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
            leads.reduce((acc, lead) => {
              const val = typeof lead.amount === 'number' ? lead.amount : 0;
              const prob = typeof lead.probability === 'number' ? lead.probability : 0;
              const probMultiplier = prob > 1 ? prob / 100 : prob;
              return acc + val * probMultiplier;
            }, 0),
          )}
        </div>
      </div>

      {
        // Achado da auditoria (PR #328, item fora de escopo original): sem virtualização, uma
        // coluna populosa monta todos os `KanbanCard` no DOM de uma vez (até ~1000 leads/funil
        // buscados por `useCrmBoardController`, sem paginação real — ver `groupedLeads` em
        // `CrmBoard.tsx`). Analisado e DELIBERADAMENTE NÃO implementado agora, apesar de
        // `@tanstack/react-virtual` já ser dependência real do projeto e já ter um padrão pronto
        // (`ui/VirtualTable.tsx`, `CompanyList.tsx`): virtualizar esta lista especificamente exige
        // continuar passando TODOS os ids ao `SortableContext` do @dnd-kit (drag-and-drop e
        // reordenação por teclado dependem disso para colisão/foco), só renderizando via
        // windowing os `KanbanCard` VISÍVEIS — um padrão não-trivial de acertar sem quebrar o drag
        // por teclado (`crm-kanban.spec.ts`, já historicamente sensível a timing nesta suíte, ver
        // achado do PR #328 sobre esse mesmo teste) nem o autoscroll ao arrastar perto da borda da
        // janela virtualizada, e que exigiria validação visual/interativa real em navegador para
        // ser considerado concluído (não disponível neste ambiente/sessão). Forçar essa mudança
        // sem essa validação é mais arriscado do que manter o estado atual — ver seção 4 regra
        // #8 e seção 12 item 6 de .claude/CLAUDE.md.
      }
      <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px] custom-scrollbar">
        <SortableContext items={leads.map((lead) => lead.id)} strategy={rectSortingStrategy}>
          {leads.map((lead) => (
            <KanbanCard
              key={lead.id}
              lead={lead}
              onClick={onCardClick}
              onEnrich={onCardEnrich}
              onConvert={onConvert}
              isSelected={selectedLeadIds?.has(lead.id)}
              onToggleSelect={onToggleSelect}
              selectionMode={selectionMode}
              ownerNameById={ownerNameById}
            />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div className="h-full min-h-[110px] border-2 border-dashed border-line/80 hover:border-[#1677FF]/40 bg-surface-2/20 rounded-xl flex flex-col items-center justify-center text-ink-2 text-xs gap-1.5 transition-colors">
            <span className="text-base" aria-hidden="true">
              📥
            </span>
            <span className="font-semibold text-ink-2">Solte cards aqui</span>
          </div>
        )}
      </div>
    </div>
  );
});
