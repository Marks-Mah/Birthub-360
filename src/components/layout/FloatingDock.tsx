import { motion } from 'framer-motion';
import { CalendarClock, KanbanSquare, LayoutDashboard, Menu, Radar } from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { SoundFX } from '../../lib/soundEffects.js';
import { cn } from '../../lib/utils.js';
import type { TabType } from './tabMeta.js';

interface FloatingDockProps {
  activeTab: TabType;
  onOpenFullMenu: () => void;
}

interface DockItem {
  tab?: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  isAction?: boolean;
}

const DOCK_ITEMS: DockItem[] = [
  { tab: 'dashboard', label: 'Painel', icon: LayoutDashboard },
  { tab: 'prospect', label: 'Captar', icon: Radar },
  { tab: 'crm', label: 'CRM', icon: KanbanSquare },
  { tab: 'activities', label: 'Agenda', icon: CalendarClock },
  { label: 'Menu', icon: Menu, isAction: true },
];

export function FloatingDock({ activeTab, onOpenFullMenu }: FloatingDockProps) {
  const navigate = useNavigate();

  const handleSelect = (item: DockItem) => {
    if (item.isAction) {
      SoundFX.play('focus');
      onOpenFullMenu();
    } else if (item.tab) {
      if (item.tab !== activeTab) {
        SoundFX.play('navigate');
      }
      navigate(`/app/${item.tab}`);
    }
  };

  return (
    <nav
      aria-label="Navegação rápida inferior"
      className="fixed bottom-3 inset-x-3 z-30 md:hidden flex justify-center pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-2xl bh-glass bg-surface/90 border border-line shadow-2xl backdrop-blur-xl">
        {DOCK_ITEMS.map((item) => {
          const isActive = !item.isAction && item.tab === activeTab;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.label}
              type="button"
              onClick={() => handleSelect(item)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer',
                isActive
                  ? 'text-on-brand bg-gradient-to-br from-brand to-brand-2 shadow-md shadow-brand/20'
                  : 'text-ink-2 hover:text-ink hover:bg-surface-2',
              )}
            >
              <Icon size={20} className="shrink-0 transition-transform duration-200" />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium truncate max-w-[48px]">
                {item.label}
              </span>
              {isActive && (
                <motion.span
                  layoutId="activeDockIndicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute -bottom-1 h-1 w-3 rounded-full bg-gradient-to-r from-brand to-brand-2 shadow-sm shadow-brand/30"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
