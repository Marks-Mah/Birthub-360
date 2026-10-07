import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus,
  Sparkles,
  User,
  ArrowRight,
  Shield,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { hasRequiredRole, MESA_TRATAMENTO_ROLES } from '../../lib/auth/authorization.js';
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

  const { currentUser, isAdmin, canAccessCommercialIntelligence, canAccessCopilotoIa, logout } =
    useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

  const canManageOperations =
    !!currentUser && hasRequiredRole(currentUser.role, ['ADMIN', 'GESTOR']);

  // Grupos sanfona com inteligência de expansão
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    crm: true,
    intelligence: true,
    orchestration: true,
    governance: true,
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
      accent: NAV_ACCENT_VAR[meta.accent],
      from: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    });
  };

  // Seções organizadas no formato enterprise refinado
  const navSections: NavSection[] = [
    {
      title: 'MAIN',
      groups: [
        {
          id: 'dashboard',
          label: 'Cockpit & Visão Geral',
          icon: TAB_META.dashboard.icon,
          primaryTab: 'dashboard',
          subItems: [
            { tab: 'dashboard', label: 'Command Center' },
            { tab: 'workspace', label: 'Meu Espaço' },
          ],
        },
        {
          id: 'crm',
          label: 'Pipeline & CRM',
          icon: TAB_META.crm.icon,
          primaryTab: 'crm',
          subItems: [
            { tab: 'crm', label: 'Gestão de Pipeline' },
            { tab: 'crm360', label: 'Gestão de Negócios 360' },
            { tab: 'companies', label: 'Empresas' },
            { tab: 'contacts', label: 'Decisores & Contatos' },
            { tab: 'propostas', label: 'Propostas Comerciais' },
          ],
        },
      ],
    },
    {
      title: 'INTELIGÊNCIA',
      groups: [
        {
          id: 'intelligence',
          label: 'Inteligência de Mercado',
          icon: TAB_META['market-intelligence'].icon,
          primaryTab: 'prospect',
          subItems: [
            { tab: 'prospect', label: 'Prospecção ICP' },
            { tab: 'market-intelligence', label: 'Pesquisa de Mercado' },
            ...(canAccessCommercialIntelligence
              ? [{ tab: 'commercial_intelligence' as TabType, label: 'Comercial Inteligente' }]
              : []),
            ...(canAccessCopilotoIa
              ? [{ tab: 'copiloto_ia' as TabType, label: 'Copiloto Comercial IA' }]
              : []),
            { tab: 'intelligence', label: 'Hub de Inteligência' },
          ],
        },
      ],
    },
    {
      title: 'ORQUESTRAÇÃO',
      groups: [
        {
          id: 'orchestration',
          label: 'Orquestração de Vendas',
          icon: TAB_META.playbooks.icon,
          primaryTab: 'playbooks',
          subItems: [
            { tab: 'playbooks', label: 'Playbooks Comerciais' },
            { tab: 'cadence', label: 'Cadências Multicanal' },
            { tab: 'jornadas', label: 'Jornadas Comerciais' },
            { tab: 'processos', label: 'Processos de Vendas' },
            { tab: 'roteiros', label: 'Roteiros de Abordagem' },
            { tab: 'daily-plan', label: 'Plano Diário' },
            { tab: 'activities', label: 'Tarefas & Atividades' },
            { tab: 'calendar', label: 'Calendário Comercial' },
            { tab: 'qualification_matrix', label: 'Matriz de Qualificação' },
            { tab: 'objections_matrix', label: 'Matriz de Objeções' },
            { tab: 'roleplay', label: 'Roleplay IA' },
            { tab: 'topic_training', label: 'Treinamentos' },
          ],
        },
      ],
    },
    {
      title: 'GOVERNANÇA',
      groups: [
        {
          id: 'governance',
          label: 'Administração & Ajustes',
          icon: TAB_META.settings.icon,
          primaryTab: 'settings',
          subItems: [
            { tab: 'reports', label: 'Relatórios Executivos' },
            { tab: 'analytics', label: 'Analytics & KPIs' },
            { tab: 'winloss', label: 'Análise Win/Loss' },
            { tab: 'notifications', label: 'Notificações' },
            { tab: 'bitrix', label: 'Integração Bitrix24' },
            ...(canManageOperations
              ? [
                { tab: 'integrations' as TabType, label: 'Integrações' },
                { tab: 'automations' as TabType, label: 'Automações' },
              ]
              : []),
            ...(isAdmin ? [{ tab: 'team' as TabType, label: 'Gestão de Time' }] : []),
            { tab: 'settings', label: 'Configurações' },
          ],
        },
      ],
    },
  ];

  const userRoleTitle =
    currentUser?.role === 'ADMIN' ? 'ADMINISTRADOR' : currentUser?.role || 'USUÁRIO';
  const userName = currentUser?.name || 'Marcelin Mark';

  return (
    <>
      {launch && <NavLaunchTransition launch={launch} onFinish={finishLaunch} />}

      <aside
        className={`relative z-30 flex flex-col h-full border-r bg-[#0b132b] border-white/10 text-slate-100 transition-[width] duration-300 ${isCollapsed ? 'w-20' : 'w-72'
          } ${mobileOpen
            ? 'fixed inset-y-0 left-0 z-50 h-full w-72 translate-x-0 bg-[#0b132b]'
            : 'hidden lg:flex'
          }`}
        aria-label="Navegação Principal"
        style={{
          background: 'linear-gradient(180deg, #0b132b 0%, #0f172a 100%)',
        }}
      >
        {/* Botão flutuante proeminente de toggle com borda de precisão */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="absolute -right-3.5 top-6 z-50 hidden lg:flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-[#0b132b] text-slate-400 shadow-xl transition-all duration-200 hover:scale-110 hover:border-brand hover:text-brand cursor-pointer"
          title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''
              }`}
          />
        </button>

        {/* ── Perfil do Usuário em Container Arredondado (Vancouver Plus style) ────────────── */}
        <div className="shrink-0 p-4 border-b border-white/10">
          <div className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-[#121A24] to-[#0f172a] border border-white/10 shadow-sm transition-all duration-300 hover:bg-gradient-to-br hover:from-[#182330] hover:to-[#121A24] hover:border-brand/30 hover:shadow-lg cursor-pointer">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/15 border border-brand/30 text-brand shadow-md group-hover:border-brand/50 group-hover:bg-brand/20 transition-all duration-300">
              {currentUser?.image ? (
                <img
                  src={currentUser.image}
                  alt={userName}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-brand" />
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0b132b]" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 leading-tight">
                <span className="block text-[9px] font-extrabold tracking-widest text-brand uppercase font-mono truncate">
                  {userRoleTitle}
                </span>
                <h2 className="text-xs font-bold text-slate-100 truncate font-display group-hover:text-white transition-colors">
                  {userName}
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* ── Navegação com Containers Arredondados Individuais por Item ────────────────── */}
        <nav className="custom-scrollbar flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-3">
              {!isCollapsed && (
                <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">
                  {section.title}
                </h3>
              )}

              <div className="space-y-2.5">
                {section.groups.map((group) => {
                  const Icon = group.icon;
                  const isGroupExpanded = !!expandedGroups[group.id];
                  const hasSubItems = !!group.subItems && group.subItems.length > 0;
                  const isSubItemActive = group.subItems?.some((sub) => sub.tab === activeTab);
                  const isPrimaryActive = group.primaryTab === activeTab;
                  const isActive = isPrimaryActive || isSubItemActive;

                  return (
                    <div
                      key={group.id}
                      className="relative"
                      onMouseEnter={() => isCollapsed && setHoveredGroupId(group.id)}
                      onMouseLeave={() => isCollapsed && setHoveredGroupId(null)}
                    >
                      {/* Container Arredondado Individual Solido do Item Principal */}
                      <button
                        type="button"
                        onClick={(e) => {
                          if (hasSubItems && !isCollapsed) {
                            toggleGroupExpand(group.id, e);
                          } else if (group.primaryTab) {
                            selectTab(group.primaryTab, e);
                          }
                        }}
                        className={`group relative flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition-all duration-300 cursor-pointer border shadow-sm ${isActive
                          ? 'bg-gradient-to-r from-coolors-blue/20 to-coolors-purple/10 text-coolors-blue border-coolors-blue/50 shadow-[0_0_20px_rgba(58,134,255,0.15)] font-extrabold'
                          : 'bg-gradient-to-br from-[#121A24] to-[#0f172a] border-white/10 text-slate-200 hover:bg-gradient-to-br hover:from-[#182330] hover:to-[#121A24] hover:border-coolors-blue/30 hover:text-white hover:shadow-md'
                          }`}
                      >
                        {/* Indicador lateral elevado no container ativo */}
                        {isActive && (
                          <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-coolors-blue shadow-[0_0_8px_var(--coolors-blue)]" />
                        )}

                        <div className="flex items-center gap-3 min-w-0 pl-1">
                          <span
                            data-nav-icon
                            className={`flex h-6 w-6 shrink-0 items-center justify-center transition-colors ${isActive ? 'text-coolors-blue' : 'text-slate-400 group-hover:text-coolors-blue'
                              }`}
                          >
                            <Icon size={18} />
                          </span>

                          {!isCollapsed && (
                            <span className="truncate font-sans font-bold text-xs tracking-tight">
                              {group.label}
                            </span>
                          )}
                        </div>

                        {!isCollapsed && hasSubItems && (
                          <span
                            className={`shrink-0 transition-transform duration-200 ${isActive ? 'text-brand' : 'text-slate-400 group-hover:text-brand'
                              }`}
                          >
                            <ChevronDown
                              size={15}
                              className={`transition-transform duration-200 ${isGroupExpanded ? 'rotate-180' : ''
                                }`}
                            />
                          </span>
                        )}
                      </button>

                      {/* Sub-itens: CADA UM em seu próprio Container Arredondado Individual Sólido */}
                      {!isCollapsed && hasSubItems && isGroupExpanded && (
                        <div className="relative ml-4 border-l-2 border-coolors-blue/30 pl-3 py-1.5 my-2 space-y-2">
                          {group.subItems?.map((subItem) => {
                            const isSubActive = subItem.tab === activeTab;

                            return (
                              <button
                                key={subItem.tab}
                                type="button"
                                onClick={(e) => selectTab(subItem.tab, e)}
                                className={`group/sub relative flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all duration-300 cursor-pointer border shadow-xs ${isSubActive
                                  ? 'bg-gradient-to-r from-coolors-blue/15 to-coolors-purple/5 text-coolors-blue font-extrabold border-coolors-blue/40 shadow-[0_0_18px_rgba(58,134,255,0.12)]'
                                  : 'bg-gradient-to-br from-[#16202C] to-[#121A24] border-white/10 text-slate-200 hover:bg-gradient-to-br hover:from-[#1E2C3D] hover:to-[#16202C] hover:border-coolors-blue/30 hover:text-white hover:shadow-sm'
                                  }`}
                              >
                                {/* Ramo conector da árvore */}
                                <span className="absolute -left-3.5 top-1/2 h-px w-3 bg-coolors-blue/40 group-hover/sub:bg-coolors-blue" />

                                {/* Indicador ◉ no sub-item selecionado */}
                                <span
                                  className={`h-2 w-2 rounded-full transition-all flex items-center justify-center shrink-0 ${isSubActive
                                    ? 'bg-coolors-blue ring-2 ring-coolors-blue/40'
                                    : 'bg-slate-500/40 group-hover/sub:bg-coolors-blue'
                                    }`}
                                />

                                <span className="truncate">{subItem.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Card Popover no Hover (Modo Recolhido / Rail Mode) - Vancouver Plus style */}
                      {isCollapsed && hoveredGroupId === group.id && hasSubItems && (
                        <div className="fixed left-20 z-50 min-w-[210px] rounded-xl border border-white/15 bg-gradient-to-br from-[#0b132b]/98 to-[#0f172a]/98 p-3.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-left-2 duration-300">
                          <p className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-widest text-coolors-blue font-mono">
                            {group.label}
                          </p>
                          <div className="space-y-2">
                            {group.subItems?.map((sub) => (
                              <button
                                key={sub.tab}
                                type="button"
                                onClick={(e) => {
                                  selectTab(sub.tab, e);
                                  setHoveredGroupId(null);
                                }}
                                className={`flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all duration-300 border ${sub.tab === activeTab
                                  ? 'bg-gradient-to-r from-coolors-blue/20 to-coolors-purple/10 text-coolors-blue border-coolors-blue/50'
                                  : 'bg-gradient-to-br from-[#16202C] to-[#121A24] border-white/10 text-slate-200 hover:bg-gradient-to-br hover:from-[#1E2C3D] hover:to-[#16202C] hover:border-coolors-blue/30 hover:text-white'
                                  }`}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-coolors-blue" />
                                <span className="truncate">{sub.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Central de Comando em Container Arredondado (Vancouver Plus style) ────────────────────── */}
        <div className="shrink-0 p-4 border-t border-white/10 bg-[#0b132b]">
          {!isCollapsed ? (
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#121A24] to-[#0f172a] p-4 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand animate-pulse shadow-[0_0_8px_var(--brand)]" />
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
                  CENTRAL DE COMANDO
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Orquestre sua operação de Revenue em tempo real.
              </p>
              <button
                type="button"
                onClick={() => openTab('workspace')}
                className="w-full flex items-center justify-between rounded-lg bg-gradient-to-r from-brand via-sky-400 to-iris p-0.5 text-xs font-extrabold text-slate-950 shadow-lg hover:brightness-110 hover:shadow-xl active:scale-95 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-full bg-gradient-to-r from-brand via-sky-400 to-iris py-2.5 px-3.5 rounded-[10px] flex items-center justify-between text-slate-950 font-extrabold">
                  <div className="flex items-center gap-2">
                    <Plus size={16} strokeWidth={3} />
                    <span>Orquestrar Pipeline</span>
                  </div>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openTab('workspace')}
              className="flex h-11 w-11 mx-auto items-center justify-center rounded-lg bg-gradient-to-r from-brand via-sky-400 to-iris text-slate-950 shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 cursor-pointer"
              title="Orquestrar Pipeline"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
