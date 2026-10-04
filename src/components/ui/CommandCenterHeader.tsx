import * as React from 'react';
import type { VisualStateType } from './VisualState.js';
import { VisualState } from './VisualState.js';
import { cn } from '../../lib/utils.js';

interface CommandCenterHeaderProps {
  /** Module name displayed in large white sans text. */
  title: string;
  /** Optional description text or node. */
  description?: React.ReactNode;
  /** Optional icon component or node. */
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  /** Pillar identifier shown in monospace uppercase blue (e.g. "01 · HUB"). */
  pillar?: string;
  /** Operational state badge shown next to the title. */
  state?: VisualStateType;
  /** Slot for action buttons rendered on the right side. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Reusable header for internal product screens.
 * Renders a module title, optional pillar tag, a VisualState badge, and a right-side actions slot.
 * Below the flex row, a decorative gradient line marks the bottom border.
 */
export function CommandCenterHeader({
  title,
  description,
  icon,
  pillar,
  state,
  actions,
  className,
}: CommandCenterHeaderProps) {
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return <span className="text-brand shrink-0">{icon}</span>;
    }
    const IconComp = icon as React.ComponentType<{ className?: string }>;
    return <IconComp className="w-5 h-5 text-brand shrink-0" />;
  };

  return (
    <header
      className={cn(
        'relative flex items-center justify-between px-6 py-4',
        // Subtle bottom border — gradient line is drawn via ::after pseudo (see below)
        'border-b border-white/[0.08]',
        className,
      )}
    >
      {/* Left: pillar + title + state */}
      <div className="flex flex-col gap-0.5 min-w-0">
        {pillar && (
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#1677FF]">
            {pillar}
          </span>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          {renderIcon()}
          <h1 className="font-display text-2xl font-semibold leading-tight text-white truncate">
            {title}
          </h1>
          {state && <VisualState state={state} size="sm" />}
        </div>
        {description && <p className="text-xs text-ink-2 mt-0.5">{description}</p>}
      </div>

      {/* Right: action slot */}
      {actions && <div className="ml-4 flex shrink-0 items-center gap-2">{actions}</div>}

      {/* Decorative gradient line below the border */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-px',
          'bg-gradient-to-r from-[#1677FF]/20 via-[#7C3AED]/10 to-transparent',
        )}
      />
    </header>
  );
}
