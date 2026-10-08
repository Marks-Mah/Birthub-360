import type { ComponentType } from 'react';
import { SoundFX } from '../../lib/soundEffects.js';
import { cn } from '../../lib/utils.js';

/* Novo primitivo — navegação em cards grandes (ícone + título + subtítulo), usado como troca de
   aba/seção quando cada opção carrega contexto suficiente pra merecer um card em vez de um tab
   de texto simples (ex.: home do portal, hub de relatórios). */
export interface TabCardItem {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}

export function TabNavCards({
  items,
  activeId,
  onSelect,
}: {
  items: TabCardItem[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div role="tablist" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onMouseEnter={() => {
              SoundFX.play('hover');
            }}
            onClick={() => {
              SoundFX.play('navigate');
              onSelect(item.id);
            }}
            className={cn(
              'group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/5 bg-[#1C1D24] p-4 px-5 text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/40 cursor-pointer',
              active
                ? 'border-[#8B7DFF]/60 bg-[#1F202B] shadow-md'
                : 'hover:border-white/10 hover:shadow-md',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 top-0 h-[2px] transition-all duration-300',
                active
                  ? 'bg-gradient-to-r from-[#8B7DFF] to-[#6D5CE6]'
                  : 'bg-transparent group-hover:bg-white/10',
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                active
                  ? 'scale-105 bg-[#8B7DFF] text-[#13151A] border-transparent shadow-sm'
                  : 'bg-[#8B7DFF]/10 text-[#8B7DFF] border-transparent group-hover:bg-[#8B7DFF]/20',
              )}
            >
              <item.icon className="h-[22px] w-[22px]" />
            </span>
            <span className="min-w-0">
              <span className={cn('block text-[15.5px] font-bold tracking-tight transition-colors group-hover:text-white', active ? 'text-white' : 'text-slate-200')}>
                {item.title}
              </span>
              {item.subtitle && (
                <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">
                  {item.subtitle}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
