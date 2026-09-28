import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  /** Ações à direita (botões, filtros) — mesmo padrão dos cabeçalhos de Analytics/Atividades. */
  actions?: ReactNode;
  glow?: boolean;
}

/**
 * Cabeçalho padrão de tela com estética 2026: título + subtítulo + ícone com halo sutil,
 * linha de luz especular e suporte a badge de status/categoria.
 */
export function PageHeader({
  title,
  subtitle,
  icon,
  badge,
  actions,
  glow = true,
}: PageHeaderProps) {
  return (
    <header className="relative flex flex-col items-start justify-between gap-4 border-b border-line/75 pb-5 sm:flex-row sm:items-center">
      {/* Linha de luz especular horizontal no rodapé do cabeçalho */}
      {glow && (
        <div className="absolute -bottom-px left-0 h-[1.5px] w-32 bg-gradient-to-r from-brand via-brand/60 to-transparent pointer-events-none" />
      )}

      <div className="flex items-center gap-3.5 min-w-0">
        {icon && (
          <div className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-gradient-to-br from-brand/15 to-surface-elevated text-brand shadow-[0_0_15px_rgba(212,175,55,0.12)] transition-all duration-300 hover:scale-105 hover:border-brand/50">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="truncate font-display text-h2 font-bold tracking-tight text-ink">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ink-2">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto sm:shrink-0 sm:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
}
