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
              'group relative flex items-center gap-3.5 overflow-hidden rounded-card border border-line bg-surface-elevated/85 backdrop-blur-xl p-4 px-5 text-left shadow-card transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg cursor-pointer',
              active
                ? 'border-brand/60 shadow-[0_0_20px_rgba(212,175,55,0.18),inset_0_1px_1px_rgba(255,255,255,0.1)]'
                : 'hover:border-line hover:shadow-card-hover',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 top-0 h-1 transition-all duration-300',
                active
                  ? 'bg-gradient-to-r from-brand via-brand-2 to-white shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                  : 'bg-ink-2/20 group-hover:bg-brand/40',
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] border border-transparent transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                active
                  ? 'scale-105 bg-brand text-on-brand shadow-md border-white/20'
                  : 'bg-brand/[0.08] text-brand group-hover:bg-brand/15',
              )}
            >
              <item.icon className="h-[22px] w-[22px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15.5px] font-black tracking-tight text-ink transition-colors group-hover:text-brand">
                {item.title}
              </span>
              {item.subtitle && (
                <span className="mt-0.5 block text-[11px] leading-snug text-ink-2">
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

