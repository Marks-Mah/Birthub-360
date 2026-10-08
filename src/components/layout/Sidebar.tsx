import { ArrowRight, ChevronDown, ChevronLeft, X } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext.js';
import { hasRequiredRole } from '../../lib/auth/authorization.js';
import { NavLaunchTransition } from './NavLaunchTransition.js';
import { useSidebarState } from './hooks/useSidebarState.js';
import { getSidebarNavSections } from './sidebarSections.js';
import type { TabType } from './tabMeta.js';

interface SidebarProps {
  activeTab: TabType;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  activeTab,
  mobileOpen = false,
  onCloseMobile,
  collapsed: externalCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const {
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
  } = useSidebarState({
    activeTab,
    onCloseMobile,
    collapsed: externalCollapsed,
    onToggleCollapse,
  });

  const { currentUser, isAdmin, canAccessCommercialIntelligence, canAccessCopilotoIa } = useAuth();

  const canManageOperations =
    !!currentUser && hasRequiredRole(currentUser.role, ['ADMIN', 'GESTOR']);

  const navSections = useMemo(
    () =>
      getSidebarNavSections({
        canAccessCommercialIntelligence,
        canAccessCopilotoIa,
        canManageOperations,
        isAdmin,
      }),
    [canAccessCommercialIntelligence, canAccessCopilotoIa, canManageOperations, isAdmin],
  );

  return (
    <>
      {launch && <NavLaunchTransition launch={launch} onFinish={finishLaunch} />}

      <aside
        className={`relative z-30 flex flex-col h-full bg-[#13151A] text-slate-200 select-none ${
          mobileOpen
            ? 'w-full'
            : `border-r border-white/5 transition-[width] duration-200 hidden lg:flex ${
                isCollapsed ? 'w-20' : 'w-[260px]'
              }`
        }`}
        aria-label="Navegação Principal"
      >
        {/* ── Console Header: Brand & Status ────────────────────────── */}
        <div className="shrink-0 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex gap-1.5" title="Mac OS Controls">
              <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
              <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
              <span className="h-3 w-3 rounded-full bg-[#8B5CF6]" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 leading-tight ml-3">
                <span className="font-display font-bold text-sm tracking-tight text-white">
                  BIRTHHUB<span className="text-brand">360°</span>
                </span>
              </div>
            )}
          </div>

          {mobileOpen ? (
            <button
              type="button"
              onClick={onCloseMobile}
              className="flex lg:hidden h-7 w-7 items-center justify-center rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Fechar navegação"
              aria-label="Fechar navegação"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleCollapse}
              className="hidden lg:flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
              aria-label={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            >
              <ChevronLeft
                className={`h-4 w-4 transition-transform duration-200 ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>

        {/* ── Navegação Console de Operações ─────────────────────────── */}
        <nav className="custom-scrollbar flex-1 overflow-y-auto px-4 py-2 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <div className="space-y-1.5">
                {section.groups.map((group) => {
                  const Icon = group.icon;
                  const isGroupExpanded = !!expandedGroups[group.id];
                  const hasSubItems = !!group.subItems && group.subItems.length > 0;
                  const isSubItemActive = group.subItems?.some((sub) => sub.tab === activeTab);
                  const isPrimaryActive = group.primaryTab === activeTab;
                  const isActive = isPrimaryActive || isSubItemActive;

                  return (
                    <section
                      key={group.id}
                      aria-label={group.label}
                      className="relative"
                      onMouseEnter={() => isCollapsed && setHoveredGroupId(group.id)}
                      onMouseLeave={() => isCollapsed && setHoveredGroupId(null)}
                    >
                      {/* Item Principal */}
                      <button
                        type="button"
                        onClick={(e) => {
                          if (hasSubItems && !isCollapsed) {
                            toggleGroupExpand(group.id, e);
                          } else if (group.primaryTab) {
                            selectTab(group.primaryTab, e);
                          }
                        }}
                        className={`group relative flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-[#8B7DFF] text-[#13151A] shadow-sm'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                        aria-label={group.ariaLabel || group.label}
                        title={isCollapsed ? group.label : undefined}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span
                            data-nav-icon
                            className={`flex h-5 w-5 shrink-0 items-center justify-center transition-colors ${
                              isActive
                                ? 'text-[#13151A]'
                                : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          >
                            <Icon size={18} />
                          </span>

                          {!isCollapsed && <span className="truncate">{group.label}</span>}
                        </div>

                        {!isCollapsed && hasSubItems && (
                          <ChevronDown
                            size={16}
                            className={`shrink-0 transition-transform duration-200 ${
                              isActive ? 'text-[#13151A]/60' : 'text-slate-500'
                            } ${isGroupExpanded ? 'rotate-180' : ''}`}
                          />
                        )}
                      </button>

                      {/* Árvore Hierárquica da Console */}
                      {!isCollapsed && hasSubItems && isGroupExpanded && (
                        <div className="ml-6 pl-4 border-l-2 border-white/5 space-y-1 mt-2 mb-3">
                          {group.subItems?.map((subItem) => {
                            const isSubActive = subItem.tab === activeTab;

                            return (
                              <button
                                key={subItem.tab + subItem.label}
                                type="button"
                                onClick={(e) => selectTab(subItem.tab, e)}
                                className={`group/sub relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors cursor-pointer text-left ${
                                  isSubActive
                                    ? 'bg-white/10 text-white font-medium'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                }`}
                              >
                                <span className="truncate">{subItem.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Popover em Modo Rail (Recolhido) */}
                      {isCollapsed && hoveredGroupId === group.id && (
                        <div className="fixed left-20 z-50 min-w-[200px] rounded-xl border border-white/10 bg-[#13151A]/95 p-3 shadow-2xl backdrop-blur-md ml-2">
                          <p className="mb-2 text-xs font-bold text-white">{group.label}</p>
                          {hasSubItems ? (
                            <div className="space-y-1">
                              {group.subItems?.map((sub) => (
                                <button
                                  key={sub.tab + sub.label}
                                  type="button"
                                  onClick={(e) => {
                                    selectTab(sub.tab, e);
                                    setHoveredGroupId(null);
                                  }}
                                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                                    sub.tab === activeTab
                                      ? 'bg-white/10 text-white font-medium'
                                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                  }`}
                                >
                                  <span className="truncate">{sub.label}</span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            group.primaryTab && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  if (group.primaryTab) {
                                    selectTab(group.primaryTab, e);
                                    setHoveredGroupId(null);
                                  }
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                              >
                                <span>Abrir {group.label}</span>
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Console Footer: Birth Intelligence Widget ──────────────── */}
        <div className="shrink-0 p-4 border-t border-white/5 bg-transparent">
          {!isCollapsed ? (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-base font-bold animate-pulse">⚡</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    INTELIGÊNCIA
                  </span>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                7 sinais requerem atenção
              </p>
              <button
                type="button"
                onClick={() => openTab('intelligence')}
                className="group flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <span>Ver análises</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openTab('intelligence')}
              className="relative flex h-12 w-12 mx-auto items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
              title="Birth Intelligence: 7 sinais requerem atenção"
            >
              <span className="text-base font-bold">⚡</span>
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-slate-950 shadow-md">
                7
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
