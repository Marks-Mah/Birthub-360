import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  LogOut,
  Plus,
  Sparkles,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { hasRequiredRole, MESA_TRATAMENTO_ROLES } from '../../lib/auth/authorization.js';
import { SoundFX } from '../../lib/soundEffects.js';
import { BirthHubLogo } from '../brand/BirthHubLogo.js';
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
  const canAccessMesaTratamento =
    !!currentUser && hasRequiredRole(currentUser.role, MESA_TRATAMENTO_ROLES);

  // Controle de sanfona por grupo principal
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    crm: true,
    intelligence: true,
    orchestration: true,
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

  // Seções organizadas no estilo da Sidebar do vídeo de referência
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

  const userRoleTitle = currentUser?.role === 'ADMIN' ? 'ADMINISTRADOR' : currentUser?.role || 'USUÁRIO';
  const userName = currentUser?.name || 'Auditor do Sistema';

  return (
    <>

      <NavLaunchTransition launch={launch} onFinished={finishLaunch} />

      <aside
        className={`relative z-30 flex flex-col my-2 ml-2 h-[calc(100vh-1rem)] rounded-[1.75rem] border border-white/10 bg-[#0B132B]/95 text-slate-100 shadow-2xl backdrop-blur-2xl transition-[width] duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'fixed inset-y-0 left-0 z-50 my-0 ml-0 h-full rounded-none w-72 translate-x-0' : 'hidden lg:flex'}`}
        aria-label="Navegação Principal"
      >
        {/* Botão flutuante proeminente de toggle (estilo do vídeo de referência) */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="absolute -right-3.5 top-6 z-50 hidden lg:flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-[#16234D] text-slate-300 shadow-xl transition-all duration-200 hover:scale-110 hover:bg-brand hover:border-brand hover:text-on-brand cursor-pointer"
          title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        {/* ── Perfil do Usuário / Cabeçalho ────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-gradient-to-tr from-brand/20 via-brand/10 to-indigo-500/20 text-brand shadow-md">
              {currentUser?.image ? (
                <img
                  src={currentUser.image}
                  alt={userName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-brand" />
              )}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0B132B]" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 leading-tight">
                <span className="block text-[10px] font-extrabold tracking-widest text-brand uppercase font-mono truncate">
                  {userRoleTitle}
                </span>
                <h2 className="text-xs font-bold text-white truncate font-display">{userName}</h2>
              </div>
            )}
          </div>
        </div>

        {/* ── Navegação com árvore de ramos (estilo do vídeo) ───────────────── */}
        <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              {!isCollapsed && (
                <h3 className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400/80 font-mono">
                  {section.title}
                </h3>
              )}

              <div className="space-y-1">
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
                      {/* Item Principal do Grupo */}
                      <button
                        type="button"
                        onClick={(e) => {
                          if (hasSubItems && !isCollapsed) {
                            toggleGroupExpand(group.id, e);
                          } else if (group.primaryTab) {
                            selectTab(group.primaryTab, e);
                          }
                        }}
                        className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-white/10 text-white shadow-xs border border-white/10'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            data-nav-icon
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              isActive
                                ? 'text-brand'
                                : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          >
                            <Icon size={18} />
                          </span>

                          {!isCollapsed && (
                            <span className="truncate font-sans">{group.label}</span>
                          )}
                        </div>

                        {!isCollapsed && hasSubItems && (
                          <span className="shrink-0 text-slate-400 transition-transform duration-200 group-hover:text-white">
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${
                                isGroupExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </span>
                        )}
                      </button>

                      {/* Sub-itens com ÁRVORE DE RAMOS (Tree lines) quando expandido */}
                      {!isCollapsed && hasSubItems && isGroupExpanded && (
                        <div className="relative ml-5 border-l-2 border-slate-700/60 pl-3 py-1 my-1 space-y-1">
                          {group.subItems?.map((subItem) => {
                            const isSubActive = subItem.tab === activeTab;
                            return (
                              <button
                                key={subItem.tab}
                                type="button"
                                onClick={(e) => selectTab(subItem.tab, e)}
                                className={`group/sub relative flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all duration-200 cursor-pointer ${
                                  isSubActive
                                    ? 'bg-brand/15 text-brand font-bold shadow-xs border border-brand/25'
                                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
                                }`}
                              >
                                {/* Ramo conector horizontal */}
                                <span className="absolute -left-3 top-1/2 h-px w-2.5 bg-slate-700/60 group-hover/sub:bg-brand/60" />
                                <span
                                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                                    isSubActive ? 'bg-brand scale-125' : 'bg-slate-500 group-hover/sub:bg-slate-300'
                                  }`}
                                />
                                <span className="truncate">{subItem.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Card de Popover em Hover no modo Recolhido (estilo do vídeo) */}
                      {isCollapsed && hoveredGroupId === group.id && hasSubItems && (
                        <div className="fixed left-20 z-50 min-w-[200px] rounded-2xl border border-white/15 bg-[#0D193A]/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-left-2 duration-200">
                          <p className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-wider text-brand font-mono">
                            {group.label}
                          </p>
                          <div className="space-y-1">
                            {group.subItems?.map((sub) => (
                              <button
                                key={sub.tab}
                                type="button"
                                onClick={(e) => {
                                  selectTab(sub.tab, e);
                                  setHoveredGroupId(null);
                                }}
                                className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
                                  sub.tab === activeTab
                                    ? 'bg-brand/20 text-brand font-bold'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                                <span>{sub.label}</span>
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

        {/* ── Banners / Card de Ação no Rodapé (estilo do vídeo) ───────────── */}
        <div className="shrink-0 p-3 border-t border-white/10 bg-[#080E21]/60 rounded-b-[1.75rem]">
          {!isCollapsed ? (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-3 shadow-inner space-y-2">
              <div className="flex items-center gap-2">
                <div className="grid h-6 w-6 place-items-center rounded-lg bg-brand/20 text-brand">
                  <Sparkles size={14} />
                </div>
                <p className="text-xs font-bold text-white">Central de Comando</p>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Orquestre pipelines & diagnósticos com IA em tempo real.
              </p>
              <button
                type="button"
                onClick={() => openTab('workspace')}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand to-amber-500 py-2 px-3 text-xs font-bold text-on-brand shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Orquestrar Pipeline</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openTab('workspace')}
              className="flex h-10 w-10 mx-auto items-center justify-center rounded-2xl bg-gradient-to-r from-brand to-amber-500 text-on-brand shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Orquestrar Pipeline"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
