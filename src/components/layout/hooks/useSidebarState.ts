import { useReducedMotion } from 'framer-motion';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SoundFX } from '../../../lib/soundEffects.js';
import type { NavLaunch } from '../NavLaunchTransition.js';
import { NAV_ACCENT_VAR, TAB_META, type TabType } from '../tabMeta.js';

export const SIDEBAR_COLLAPSED_KEY = '@birthhub:sidebar-collapsed';
export const LEGACY_SIDEBAR_COLLAPSED_KEY = '@birthhub360:sidebar-collapsed';

export interface UseSidebarStateOptions {
  activeTab: TabType;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function useSidebarState({
  activeTab,
  onCloseMobile,
  collapsed: externalCollapsed,
  onToggleCollapse,
}: UseSidebarStateOptions) {
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      (window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) ??
        window.localStorage.getItem(LEGACY_SIDEBAR_COLLAPSED_KEY)) === 'true'
    );
  });

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const toggleCollapse = useCallback(() => {
    SoundFX.play('focus');
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
        }
        return next;
      });
    }
  }, [onToggleCollapse]);

  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

  // Grupos sanfona com inteligência de expansão da console de operações
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    revenue_tree: true,
  });

  // Auto-expande o grupo se a aba ativa pertencer aos seus sub-itens
  useEffect(() => {
    const revenueTabs: TabType[] = ['crm', 'crm360', 'propostas', 'forecast'];
    if (revenueTabs.includes(activeTab)) {
      setExpandedGroups((prev) => (prev.revenue_tree ? prev : { ...prev, revenue_tree: true }));
    }
  }, [activeTab]);

  const toggleGroupExpand = useCallback((groupId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    SoundFX.play('focus');
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  }, []);

  const [launch, setLaunch] = useState<(NavLaunch & { tab: TabType }) | null>(null);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const openTab = useCallback(
    (tab: TabType) => {
      navigate(`/app/${tab}`);
      onCloseMobile?.();
    },
    [navigate, onCloseMobile],
  );

  const finishLaunch = useCallback(() => {
    if (!launch) return;
    openTab(launch.tab);
    setLaunch(null);
  }, [launch, openTab]);

  const selectTab = useCallback(
    (tab: TabType, event: React.MouseEvent) => {
      if (launch) return;
      if (tab !== activeTab) SoundFX.play('navigate');

      const skip =
        tab === activeTab ||
        reduceMotion ||
        (typeof navigator !== 'undefined' && navigator.webdriver) ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey;

      if (skip) {
        openTab(tab);
        return;
      }

      const meta = TAB_META[tab] ?? TAB_META.dashboard;
      const anchor = event.currentTarget.querySelector('[data-nav-icon]') ?? event.currentTarget;
      const rect = anchor.getBoundingClientRect();
      setLaunch({
        tab,
        label: meta.label,
        Icon: meta.icon,
        accent: NAV_ACCENT_VAR[meta.accent] || 'var(--nav-c-blue)',
        from: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      });
    },
    [activeTab, launch, openTab, reduceMotion],
  );

  return {
    isCollapsed,
    toggleCollapse,
    hoveredGroupId,
    setHoveredGroupId,
    expandedGroups,
    toggleGroupExpand,
    launch,
    openTab,
    finishLaunch,
    selectTab,
  };
}
