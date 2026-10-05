import { useState, type ComponentType, type MouseEvent, type PointerEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { SoundFX } from '../../lib/soundEffects.js';
import { cn } from '../../lib/utils.js';

/* Generalizado a partir de `KpiStat` (JoaoReisDiagnosticHub.tsx) — mesmo vocabulário visual
   (barra de destaque no topo, chip de ícone, valor em mono tabular), promovido pra cá porque
   passou a ser reaproveitado fora do diagnóstico SDR. */
const KPI_TONES = {
  brand: {
    bar: 'bg-brand',
    chip: 'bg-brand/10 text-brand border-brand/20',
    value: 'text-brand',
    glow: 'rgba(212,175,55,0.12)',
  },
  ink: {
    bar: 'bg-ink-2/30',
    chip: 'bg-surface-2 text-ink-2 border-line/40',
    value: 'text-ink',
    glow: 'rgba(255,255,255,0.06)',
  },
  ok: {
    bar: 'bg-ok',
    chip: 'bg-ok/15 text-ok-active dark:text-ok border-ok/25',
    value: 'text-ok-active dark:text-ok',
    glow: 'rgba(15,157,100,0.12)',
  },
  gold: {
    bar: 'bg-gold',
    chip: 'bg-gold/15 text-warn-active dark:text-gold border-gold/25',
    value: 'text-warn-active dark:text-gold',
    glow: 'rgba(255,197,0,0.12)',
  },
  critical: {
    bar: 'bg-critical',
    chip: 'bg-critical/10 text-critical border-critical/20',
    value: 'text-critical',
    glow: 'rgba(208,59,59,0.12)',
  },
  iris: {
    bar: 'bg-accent-violet',
    chip: 'bg-accent-violet/15 text-iris-active dark:text-accent-violet border-accent-violet/25',
    value: 'text-iris-active dark:text-accent-violet',
    glow: 'rgba(197,54,120,0.12)',
  },
  cyan: {
    bar: 'bg-accent-cyan',
    chip: 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/25',
    value: 'text-accent-cyan',
    glow: 'rgba(22,119,255,0.12)',
  },
  pulse: {
    bar: 'bg-pulse',
    chip: 'bg-pulse/15 text-pulse border-pulse/25',
    value: 'text-pulse',
    glow: 'rgba(194,37,92,0.12)',
  },
} as const;

export type KpiTone = keyof typeof KPI_TONES;

export interface KpiCardProps {
  icon: ComponentType<{ className?: string }>;
  label?: string;
  title?: string;
  value: string | number;
  caption?: string;
  subtitle?: string;
  tone?: KpiTone;
  variant?: string;
  /** Indicador dinâmico de tendência (ex: +12% ou -3%) */
  trend?: {
    value: string | number;
    isPositive?: boolean;
  };
  /** Ativa holofote especular que segue o cursor em tempo real (2026 Spatial UI) */
  spotlight?: boolean;
  /** Emite som suave ao interagir */
  sound?: boolean;
  /** Torna o card um botão de drill-down (ex.: abrir modal com a lista por trás do número). */
  onSelect?: () => void;
  /** Estado ativo do drill-down — gira o chevron e destaca a borda. */
  active?: boolean;
  className?: string;
}

export function KpiCard({
  icon: Icon,
  label,
  title,
  value,
  caption,
  subtitle,
  tone,
  variant,
  trend,
  spotlight = true,
  sound = true,
  onSelect,
  active = false,
  className,
}: KpiCardProps) {
  const displayLabel = label ?? title ?? '';
  const displaySubtitle = caption ?? subtitle;
  const rawTone = tone ?? variant ?? 'ink';
  const t = KPI_TONES[rawTone as KpiTone] ?? KPI_TONES.ink;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (spotlight) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (sound && onSelect) {
      SoundFX.play('hover');
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (_e: MouseEvent<HTMLButtonElement>) => {
    if (sound) {
      SoundFX.play('click');
    }
    onSelect?.();
  };

  const sharedClassName = cn(
    'group relative w-full overflow-hidden rounded-card border border-line bg-surface-elevated/85 backdrop-blur-xl p-4 text-left shadow-card transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
    onSelect &&
      'cursor-pointer active:scale-[0.98] hover:-translate-y-1 hover:border-brand/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    active && 'border-brand/60 shadow-[0_0_0_2px_color-mix(in_srgb,var(--brand)_28%,transparent)]',
    className,
  );

  const content = (
    <>
      {/* 2026 Specular Highlight Edge */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20"
        aria-hidden="true"
      />
      {spotlight && isHovered && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
          style={{
            background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, ${t.glow}, transparent 70%)`,
          }}
        />
      )}
      <span className={cn('absolute inset-x-0 top-0 h-[3px]', t.bar)} aria-hidden="true" />
      <span className="relative z-10 flex items-center justify-between">
        <span
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_12px_rgba(212,175,55,0.25)]',
            t.chip,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>

        <span className="flex items-center gap-2">
          {active && (
            <span
              className="relative flex h-2 w-2 items-center justify-center"
              aria-hidden="true"
              title="Card ativo"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
          )}
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold',
                trend.isPositive !== false
                  ? 'bg-success/15 text-success border border-success/30'
                  : 'bg-danger/15 text-danger border border-danger/30',
              )}
            >
              <span>{trend.isPositive !== false ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </span>
          )}

          {onSelect && (
            <span
              aria-hidden="true"
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full bg-surface-2 text-ink-2 transition-colors duration-200',
                active && 'bg-brand text-on-brand',
              )}
            >
              <ChevronDown
                className={cn(
                  'h-2.5 w-2.5 transition-transform duration-200',
                  active && 'rotate-180',
                )}
              />
            </span>
          )}
        </span>
      </span>

      <p className={cn('relative z-10 mt-3 font-mono text-2xl font-bold tabular-nums', t.value)}>
        {value}
      </p>
      <p className="relative z-10 mt-1 text-[10px] font-bold uppercase tracking-wide text-ink-2">
        {displayLabel}
      </p>
      {displaySubtitle && (
        <p className="relative z-10 mt-0.5 text-[10px] text-ink-2">{displaySubtitle}</p>
      )}
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-pressed={active}
        className={sharedClassName}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={sharedClassName}
    >
      {content}
    </div>
  );
}
