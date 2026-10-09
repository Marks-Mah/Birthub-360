import { ArrowRight, ChevronDown, ChevronLeft, X } from 'lucide-react';
import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext.js';
import { hasRequiredRole } from '../../lib/auth/authorization.js';
import { useSidebarState } from './hooks/useSidebarState.js';
import { NavLaunchTransition } from './NavLaunchTransition.js';
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
        className={`relative z-30 flex flex-col h-full el-glass-strong text-[color:var(--el-ink)] select-none ${
          mobileOpen
            ? 'w-full'
            : `border-r border-[color:var(--el-line)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hidden lg:flex ${
                isCollapsed ? 'w-20' : 'w-[280px]'
              }`
        }`}
        aria-label="Navegação Principal"
      >
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
          <div className="el-orb el-orb-gold el-drift" style={{ width: 180, height: 180, top: -40, left: -60 }} />
          <div className="el-orb el-orb-pink el-drift" style={{ width: 140, height: 140, bottom: 120, right: -40, animationDelay: '-7s' }} />
        </div>

        {/* ── Console Header: Brand & Status ────────────────────────── */}
        <div className="shrink-0 px-6 py-7 flex items-center justify-between relative">
          <div className="flex items-center gap-3 min-w-0 el-fade-up">
            <div className="relative flex items-center justify-center">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'var(--el-grad-signature)',
                  filter: 'blur(10px)',
                  opacity: 0.5,
                }}
              />
              <span
                className="relative h-7 w-7 rounded-full border border-[color:var(--el-gold)]"
                style={{ background: 'var(--el-grad-gold)' }}
              />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 leading-tight">
                <div className="font-display text-[11px] uppercase tracking-[0.3em] text-[color:var(--el-ink-3)]">
                  BirthHub
                </div>
                <div className="font-display text-xl text-[color:var(--el-ink)] italic -mt-0.5">
                  360<span className="el-gold-text">°</span>
                </div>
              </div>
            )}
          </div>

          {mobileOpen ? (
            <button
              type="button"
              onClick={onCloseMobile}
              className="flex lg:hidden h-8 w-8 items-center justify-center rounded-full border border-[color:var(--el-line-strong)] text-[color:var(--el-ink-2)] hover:text-[color:var(--el-ink)] hover:border-[color:var(--el-gold)] transition-all duration-300 cursor-pointer"
              title="Fechar navegação"
              aria-label="Fechar navegação"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleCollapse}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--el-line-strong)] text-[color:var(--el-ink-2)] hover:text-[color:var(--el-ink)] hover:border-[color:var(--el-gold)] hover:scale-110 transition-all duration-300 cursor-pointer"
              title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
              aria-label={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            >
              <ChevronLeft
                className={`h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>

        {/* Elegant hairline divider */}
        {!isCollapsed && (
          <div className="px-6 mb-2">
            <div
              className="h-px w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, var(--el-line-strong) 20%, var(--el-gold) 50%, var(--el-line-strong) 80%, transparent)',
              }}
            />
          </div>
        )}

        {/* ── Navegação Console de Operações ─────────────────────────── */}
        <nav className="custom-scrollbar flex-1 overflow-y-auto px-4 py-2 space-y-7 el-stagger">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <div className="space-y-1">
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
                        className={`group relative flex w-full items-center justify-between rounded-full px-4 py-2.5 text-[13px] font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer overflow-hidden ${
                          isActive
                            ? 'text-[color:var(--el-ink)] bg-[color:var(--surface)] border border-[color:var(--el-gold)] shadow-[0_8px_24px_-12px_rgba(201,162,76,0.5)]'
                            : 'text-[color:var(--el-ink-2)] border border-transparent hover:text-[color:var(--el-ink)] hover:border-[color:var(--el-line-strong)] hover:bg-[color:var(--surface)]/50 hover:translate-x-1'
                        }`}
                        aria-label={group.ariaLabel || group.label}
                        title={isCollapsed ? group.label : undefined}
                        data-testid={`sidebar-nav-${group.id}`}
                      >
                        {isActive && (
                          <span
                            className="absolute inset-0 opacity-30"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(201,162,76,0.15), rgba(241,91,181,0.08))',
                            }}
                          />
                        )}
                        <div className="flex items-center gap-3.5 min-w-0 relative">
                          <span
                            data-nav-icon
                            className={`flex h-4 w-4 shrink-0 items-center justify-center transition-all duration-500 ${
                              isActive
                                ? 'text-[color:var(--el-gold-deep)] scale-110'
                                : 'text-[color:var(--el-ink-3)] group-hover:text-[color:var(--el-gold)]'
                            }`}
                          >
                            <Icon size={16} />
                          </span>

                          {!isCollapsed && (
                            <span
                              className={`truncate font-display tracking-tight ${isActive ? 'italic' : ''}`}
                              style={{ fontWeight: isActive ? 500 : 400 }}
                            >
                              {group.label}
                            </span>
                          )}
                        </div>

                        {!isCollapsed && hasSubItems && (
                          <ChevronDown
                            size={13}
                            strokeWidth={1.5}
                            className={`shrink-0 relative transition-transform duration-500 ${
                              isActive ? 'text-[color:var(--el-gold)]' : 'text-[color:var(--el-ink-3)]'
                            } ${isGroupExpanded ? 'rotate-180' : ''}`}
                          />
                        )}
                      </button>

                      {/* Árvore Hierárquica */}
                      {!isCollapsed && hasSubItems && isGroupExpanded && (
                        <div className="ml-7 pl-4 border-l border-[color:var(--el-line-strong)] space-y-0.5 mt-1.5 mb-2 el-fade-up">
                          {group.subItems?.map((subItem) => {
                            const isSubActive = subItem.tab === activeTab;

                            return (
                              <button
                                key={subItem.tab + subItem.label}
                                type="button"
                                onClick={(e) => selectTab(subItem.tab, e)}
                                className={`group/sub relative flex w-full items-center gap-3 rounded-full px-3 py-1.5 text-[12px] transition-all duration-300 cursor-pointer text-left ${
                                  isSubActive
                                    ? 'text-[color:var(--el-gold-deep)] font-medium italic'
                                    : 'text-[color:var(--el-ink-3)] hover:text-[color:var(--el-ink)] hover:translate-x-1'
                                }`}
                                data-testid={`sidebar-sub-${subItem.tab}`}
                              >
                                <span
                                  className={`h-1 w-1 rounded-full transition-all duration-300 ${
                                    isSubActive
                                      ? 'bg-[color:var(--el-gold)] scale-150'
                                      : 'bg-[color:var(--el-ink-3)]/40 group-hover/sub:bg-[color:var(--el-pink)]'
                                  }`}
                                />
                                <span className="truncate font-display">{subItem.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Popover em Modo Rail (Recolhido) */}
                      {isCollapsed && hoveredGroupId === group.id && (
                        <div className="fixed left-20 z-50 min-w-[220px] rounded-2xl el-glass-strong p-4 shadow-2xl ml-2 el-scale-in">
                          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] font-display italic text-[color:var(--el-gold-deep)]">
                            {group.label}
                          </p>
                          {hasSubItems ? (
                            <div className="space-y-0.5">
                              {group.subItems?.map((sub) => (
                                <button
                                  key={sub.tab + sub.label}
                                  type="button"
                                  onClick={(e) => {
                                    selectTab(sub.tab, e);
                                    setHoveredGroupId(null);
                                  }}
                                  className={`flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-sm font-display transition-all ${
                                    sub.tab === activeTab
                                      ? 'bg-[color:var(--surface-2)] text-[color:var(--el-ink)] italic'
                                      : 'text-[color:var(--el-ink-2)] hover:text-[color:var(--el-ink)] hover:bg-[color:var(--surface-2)]/50'
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
                                className="flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-sm text-[color:var(--el-ink-2)] hover:text-[color:var(--el-ink)] hover:bg-[color:var(--surface-2)]/50"
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
        <div className="shrink-0 p-4 border-t border-[color:var(--el-line)] bg-transparent relative">
          {!isCollapsed ? (
            <div
              className="relative rounded-2xl p-4 space-y-3 overflow-hidden el-fade-up"
              style={{
                background:
                  'linear-gradient(135deg, rgba(201,162,76,0.08), rgba(241,91,181,0.05))',
                border: '1px solid var(--el-line-strong)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{ background: 'var(--el-grad-signature)', filter: 'blur(40px)' }}
              />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span className="absolute inset-0 rounded-full el-pulse-ring" style={{ background: 'var(--el-gold)' }} />
                    <span className="relative h-2 w-2 rounded-full bg-[color:var(--el-gold)]" />
                  </span>
                  <span className="font-display italic text-xs text-[color:var(--el-ink-2)] tracking-wide">
                    Inteligência
                  </span>
                </div>
              </div>
              <p className="relative font-display text-[13px] text-[color:var(--el-ink)] leading-snug">
                7 sinais aguardam<br />
                <span className="italic text-[color:var(--el-gold-deep)]">sua atenção</span>
              </p>
              <button
                type="button"
                onClick={() => openTab('intelligence')}
                className="group relative flex items-center gap-2 text-xs font-medium text-[color:var(--el-ink)] hover:text-[color:var(--el-gold-deep)] transition-colors cursor-pointer"
                data-testid="sidebar-intelligence-cta"
              >
                <span className="el-underline">Ver análises</span>
                <ArrowRight
                  size={12}
                  strokeWidth={1.5}
                  className="transition-transform duration-500 group-hover:translate-x-1.5"
                />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openTab('intelligence')}
              className="relative flex h-11 w-11 mx-auto items-center justify-center rounded-full border border-[color:var(--el-gold)] bg-[color:var(--surface)] text-[color:var(--el-gold-deep)] hover:scale-110 transition-all duration-500 cursor-pointer"
              title="Birth Intelligence: 7 sinais"
              data-testid="sidebar-intelligence-icon"
            >
              <span className="absolute inset-0 rounded-full el-pulse-ring" />
              <span className="relative text-xs font-display italic">7</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
