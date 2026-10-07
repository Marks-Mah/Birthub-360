import { useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronLeft, Shield, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { hasRequiredRole } from '../../lib/auth/authorization.js';
import { SoundFX } from '../../lib/soundEffects.js';
import { NavLaunchTransition, type NavLaunch } from './NavLaunchTransition.js';
import { NAV_ACCENT_VAR, TAB_META, type TabType } from './tabMeta.js';

const SIDEBAR_COLLAPSED_KEY = '@birthhub:sidebar-collapsed';
const LEGACY_SIDEBAR_COLLAPSED_KEY = '@birthhub360:sidebar-collapsed';

interface SidebarProps {
  activeTab: TabType;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavSubItem {
  tab: TabType;
  label: string;
}

interface NavGroupItem {
  id: string;
  label: string;
  sublabel?: string;
  ariaLabel?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  primaryTab?: TabType;
  subItems?: NavSubItem[];
  accentColor?: string;
}

interface NavSection {
  title: string;
  groups: NavGroupItem[];
}

export function Sidebar({
  activeTab,
  mobileOpen = false,
  onCloseMobile,
  collapsed: externalCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      (window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) ??
        window.localStorage.getItem(LEGACY_SIDEBAR_COLLAPSED_KEY)) === 'true'
    );
  });

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const toggleCollapse = () => {
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
  };

  const { currentUser, isAdmin, canAccessCommercialIntelligence, canAccessCopilotoIa } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

  const canManageOperations =
    !!currentUser && hasRequiredRole(currentUser.role, ['ADMIN', 'GESTOR']);

  // Grupos sanfona com inteligência de expansão da console de operações
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    revenue_tree: true,
  });

  const toggleGroupExpand = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    SoundFX.play('focus');
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const [launch, setLaunch] = useState<(NavLaunch & { tab: TabType }) | null>(null);

  const openTab = (tab: TabType) => {
    navigate(`/app/${tab}`);
    onCloseMobile?.();
  };

  const finishLaunch = () => {
    if (!launch) return;
    openTab(launch.tab);
    setLaunch(null);
  };

  const selectTab = (tab: TabType, event: React.MouseEvent) => {
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
  };

  // Seções organizadas no paradigma Console de Operações do BirthHub 360
  const navSections: NavSection[] = [
    {
      title: 'COMMAND CENTER',
      groups: [
        {
          id: 'dashboard',
          label: 'Visão Geral',
          sublabel: 'Visão executiva e operacional',
          icon: TAB_META.dashboard.icon,
          primaryTab: 'dashboard',
        },
      ],
    },
    {
      title: 'RECEITA',
      groups: [
        {
          id: 'revenue_tree',
          label: 'Pipeline & CRM',
          icon: TAB_META.crm.icon,
          primaryTab: 'crm',
          subItems: [
            { tab: 'crm', label: 'Pipeline' },
            { tab: 'crm360', label: 'Negócios' },
            { tab: 'propostas', label: 'Propostas' },
            { tab: 'forecast', label: 'Forecast' },
          ],
        },
      ],
    },
    {
      title: 'INTELLIGENCE',
      groups: [
        {
          id: 'market-intelligence',
          label: 'Inteligência de Mercado',
          icon: TAB_META['market-intelligence'].icon,
          primaryTab: 'market-intelligence',
        },
        ...(canAccessCommercialIntelligence
          ? [
              {
                id: 'commercial_intelligence',
                label: 'Revenue Intelligence',
                icon: TAB_META.commercial_intelligence.icon,
                primaryTab: 'commercial_intelligence' as TabType,
              },
            ]
          : []),
        {
          id: 'signals-risks',
          label: 'Sinais & Riscos',
          icon: TAB_META.intelligence.icon,
          primaryTab: 'intelligence',
        },
        ...(canAccessCopilotoIa
          ? [
              {
                id: 'copilot',
                label: 'Copilot',
                icon: TAB_META.copiloto_ia.icon,
                primaryTab: 'copiloto_ia' as TabType,
              },
            ]
          : []),
      ],
    },
    {
      title: 'EXECUTION',
      groups: [
        {
          id: 'prospecting',
          label: 'Prospecção',
          icon: TAB_META.prospect.icon,
          primaryTab: 'prospect',
        },
        {
          id: 'cadences',
          label: 'Cadências',
          icon: TAB_META.cadence.icon,
          primaryTab: 'cadence',
        },
        {
          id: 'workflows',
          label: 'Workflows',
          icon: TAB_META.jornadas.icon,
          primaryTab: 'jornadas',
        },
        ...(canManageOperations
          ? [
              {
                id: 'automations',
                label: 'Automações',
                icon: TAB_META.automations.icon,
                primaryTab: 'automations' as TabType,
              },
            ]
          : []),
      ],
    },
    {
      title: 'RELATIONSHIPS',
      groups: [
        {
          id: 'companies',
          label: 'Empresas',
          icon: TAB_META.companies.icon,
          primaryTab: 'companies',
        },
        {
          id: 'contacts',
          label: 'Contatos',
          icon: TAB_META.contacts.icon,
          primaryTab: 'contacts',
        },
        {
          id: 'decisores',
          label: 'Decisores',
          icon: Shield,
          primaryTab: 'contacts',
        },
      ],
    },
    {
      title: 'PERFORMANCE',
      groups: [
        {
          id: 'performance',
          label: 'Performance Comercial',
          ariaLabel: 'Performance Comercial Analytics',
          icon: TAB_META.analytics.icon,
          primaryTab: 'analytics',
        },
        {
          id: 'metas',
          label: 'Metas',
          icon: TAB_META.metas.icon,
          primaryTab: 'metas',
        },
        {
          id: 'gamification',
          label: 'Gamificação',
          icon: TAB_META.roleplay.icon,
          primaryTab: 'roleplay',
        },
      ],
    },
    ...(canManageOperations || isAdmin
      ? [
          {
            title: 'GOVERNANÇA',
            groups: [
              ...(canManageOperations
                ? [
                    {
                      id: 'integrations',
                      label: 'Integrações',
                      icon: TAB_META.integrations.icon,
                      primaryTab: 'integrations' as TabType,
                    },
                  ]
                : []),
              ...(isAdmin
                ? [
                    {
                      id: 'team',
                      label: 'Gestão de Time',
                      icon: TAB_META.team.icon,
                      primaryTab: 'team' as TabType,
                    },
                  ]
                : []),
              {
                id: 'settings',
                label: 'Configurações',
                icon: TAB_META.settings.icon,
                primaryTab: 'settings' as TabType,
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <>
      {launch && <NavLaunchTransition launch={launch} onFinish={finishLaunch} />}

      <aside
        className={`relative z-30 flex flex-col h-full bg-[#0B132B] text-slate-200 select-none ${
          mobileOpen
            ? 'w-full'
            : `border-r border-white/10 transition-[width] duration-200 hidden lg:flex ${
                isCollapsed ? 'w-16' : 'w-64'
              }`
        }`}
        aria-label="Navegação Principal"
      >
        {/* ── Console Header: Brand & Status ────────────────────────── */}
        <div className="shrink-0 px-3.5 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0" title="Engine Operacional Ativo">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </span>
            {!isCollapsed && (
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-xs tracking-tight text-white">
                    BIRTHHUB
                  </span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-brand/20 text-brand border border-brand/30">
                    360°
                  </span>
                </div>
                <p className="text-[10px] font-mono tracking-wider text-slate-400 uppercase truncate mt-0.5">
                  360° Revenue Intelligence
                </p>
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
        <nav className="custom-scrollbar flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 py-1">
                  {section.title}
                </h3>
              )}

              <div className="space-y-0.5">
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
                        className={`group relative flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer border-l-2 ${
                          isActive
                            ? 'bg-brand/15 text-white font-semibold border-brand'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white border-transparent'
                        }`}
                        aria-label={group.ariaLabel || group.label}
                        title={isCollapsed ? group.label : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            data-nav-icon
                            className={`flex h-4 w-4 shrink-0 items-center justify-center transition-colors ${
                              isActive ? 'text-brand' : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          >
                            <Icon size={15} />
                          </span>

                          {!isCollapsed && (
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={`text-[9px] shrink-0 font-mono transition-colors ${
                                  isActive
                                    ? 'text-brand'
                                    : 'text-slate-500 group-hover:text-slate-400'
                                }`}
                                aria-hidden="true"
                              >
                                ◉
                              </span>
                              <span className="truncate">{group.label}</span>
                            </div>
                          )}
                        </div>

                        {!isCollapsed && hasSubItems && (
                          <ChevronDown
                            size={13}
                            className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                              isGroupExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </button>

                      {/* Árvore Hierárquica da Console (Sub-itens com conectores ├ e └) */}
                      {!isCollapsed && hasSubItems && isGroupExpanded && (
                        <div className="ml-3 pl-2.5 border-l border-white/10 space-y-0.5 my-1">
                          {group.subItems?.map((subItem, idx) => {
                            const isLast = idx === (group.subItems?.length ?? 1) - 1;
                            const isSubActive = subItem.tab === activeTab;

                            return (
                              <button
                                key={subItem.tab + subItem.label}
                                type="button"
                                onClick={(e) => selectTab(subItem.tab, e)}
                                className={`group/sub relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer text-left ${
                                  isSubActive
                                    ? 'bg-brand/15 text-white font-semibold text-brand'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                }`}
                              >
                                <span
                                  data-nav-icon
                                  className="font-mono text-slate-500 text-[11px] shrink-0 select-none group-hover/sub:text-slate-300"
                                >
                                  {isLast ? '└' : '├'}
                                </span>

                                <span
                                  className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${
                                    isSubActive
                                      ? 'bg-brand'
                                      : 'bg-slate-600 group-hover/sub:bg-slate-400'
                                  }`}
                                />

                                <span className="truncate">{subItem.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Popover em Modo Rail (Recolhido) */}
                      {isCollapsed && hoveredGroupId === group.id && (
                        <div className="fixed left-16 z-50 min-w-[200px] rounded-lg border border-white/15 bg-[#080D1A]/95 p-3 shadow-2xl backdrop-blur-md">
                          <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-brand">
                            {group.label}
                          </p>
                          {hasSubItems ? (
                            <div className="space-y-1">
                              {group.subItems?.map((sub, idx) => (
                                <button
                                  key={sub.tab + sub.label}
                                  type="button"
                                  onClick={(e) => {
                                    selectTab(sub.tab, e);
                                    setHoveredGroupId(null);
                                  }}
                                  className={`flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs transition-colors ${
                                    sub.tab === activeTab
                                      ? 'bg-brand/20 text-brand font-semibold'
                                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                  }`}
                                >
                                  <span className="font-mono text-slate-500 text-[10px]">
                                    {idx === (group.subItems?.length ?? 1) - 1 ? '└' : '├'}
                                  </span>
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
                                className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
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
        <div className="shrink-0 p-3 border-t border-white/10 bg-[#080D1A]">
          {!isCollapsed ? (
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm font-bold animate-pulse">⚡</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 font-mono">
                    BIRTH INTELLIGENCE
                  </span>
                </div>
                <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              </div>
              <p className="text-xs text-slate-300 font-medium leading-tight">
                7 sinais requerem atenção
              </p>
              <button
                type="button"
                onClick={() => openTab('intelligence')}
                className="group flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer pt-0.5"
              >
                <span>Ver inteligência</span>
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openTab('intelligence')}
              className="relative flex h-10 w-10 mx-auto items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
              title="Birth Intelligence: 7 sinais requerem atenção"
            >
              <span className="text-sm font-bold">⚡</span>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950 font-mono">
                7
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
