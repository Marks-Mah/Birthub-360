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
        className={`relative z-30 flex flex-col h-full border-r bg-[#070A0F] border-white/[0.07] text-[#F8FAFC] transition-[width] duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          mobileOpen
            ? 'fixed inset-y-0 left-0 z-50 h-full w-72 translate-x-0 bg-[#070A0F]'
            : 'hidden lg:flex'
        }`}
        aria-label="Navegação Principal"
      >
        {/* Botão flutuante proeminente de toggle com borda de precisão */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="absolute -right-3.5 top-6 z-50 hidden lg:flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.12] bg-[#0D121A] text-[#94A3B8] shadow-xl transition-all duration-200 hover:scale-110 hover:border-[#22D3EE] hover:text-[#22D3EE] cursor-pointer"
          title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* ── Perfil do Usuário Premium com Microinteração no Hover ────────────── */}
        <div className="shrink-0 p-4 border-b border-white/[0.07]">
          <div className="group flex items-center gap-3.5 p-2 rounded-2xl transition-all duration-200 hover:bg-[#0D121A] cursor-pointer">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#121A24] border border-white/[0.1] text-[#22D3EE] shadow-md group-hover:border-[#22D3EE]/40 transition-colors">
              {currentUser?.image ? (
                <img
                  src={currentUser.image}
                  alt={userName}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-[#22D3EE]" />
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070A0F]" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 leading-tight">
                <span className="block text-[9px] font-extrabold tracking-widest text-[#22D3EE] uppercase font-mono truncate">
                  {userRoleTitle}
                </span>
                <h2 className="text-xs font-bold text-[#F8FAFC] truncate font-display group-hover:text-white transition-colors">
                  {userName}
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* ── Navegação Operating System Level ──────────────────────────────────── */}
        <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              {!isCollapsed && (
                <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8]/70 font-mono">
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
                      {/* Item Principal: Indicador Lateral ┃ + Fundo Elevado + Glow Mínimo */}
                      <button
                        type="button"
                        onClick={(e) => {
                          if (hasSubItems && !isCollapsed) {
                            toggleGroupExpand(group.id, e);
                          } else if (group.primaryTab) {
                            selectTab(group.primaryTab, e);
                          }
                        }}
                        className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-[#121A24] text-[#F8FAFC] border border-white/[0.08] shadow-[0_0_12px_rgba(34,211,238,0.12)]'
                            : 'text-[#94A3B8] hover:bg-[#0D121A] hover:text-[#F8FAFC]'
                        }`}
                      >
                        {/* Indicador lateral elevado ┃ no estado ativo */}
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                        )}

                        <div className="flex items-center gap-3 min-w-0 pl-1">
                          <span
                            data-nav-icon
                            className={`flex h-6 w-6 shrink-0 items-center justify-center transition-colors ${
                              isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
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
                            className={`shrink-0 transition-transform duration-200 ${
                              isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
                            }`}
                          >
                            <ChevronDown
                              size={15}
                              className={`transition-transform duration-200 ${
                                isGroupExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </span>
                        )}
                      </button>

                      {/* ÁRVORE DE HIERARQUIA DE INTELIGÊNCIA COM INDICADOR DE SELEÇÃO ◉ */}
                      {!isCollapsed && hasSubItems && isGroupExpanded && (
                        <div className="relative ml-5 border-l border-white/[0.1] pl-3 py-1.5 my-1 space-y-1">
                          {group.subItems?.map((subItem, idx) => {
                            const isSubActive = subItem.tab === activeTab;
                            const isLast = idx === (group.subItems?.length ?? 0) - 1;

                            return (
                              <button
                                key={subItem.tab}
                                type="button"
                                onClick={(e) => selectTab(subItem.tab, e)}
                                className={`group/sub relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                                  isSubActive
                                    ? 'bg-[#121A24] text-[#22D3EE] font-bold border border-[#22D3EE]/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                                    : 'text-[#94A3B8] hover:bg-[#0D121A] hover:text-[#F8FAFC]'
                                }`}
                              >
                                {/* Ramo conector da árvore */}
                                <span className="absolute -left-3 top-1/2 h-px w-2.5 bg-white/[0.1] group-hover/sub:bg-[#22D3EE]/60" />

                                {/* Indicador ◉ no item selecionado para orientação espacial perfeita */}
                                <span
                                  className={`h-2 w-2 rounded-full transition-all flex items-center justify-center shrink-0 ${
                                    isSubActive
                                      ? 'bg-[#22D3EE] ring-2 ring-[#22D3EE]/40'
                                      : 'bg-[#94A3B8]/40 group-hover/sub:bg-[#F8FAFC]'
                                  }`}
                                />

                                <span className="truncate">{subItem.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Card Popover no Hover (Modo Recolhido / Rail Mode) */}
                      {isCollapsed && hoveredGroupId === group.id && hasSubItems && (
                        <div className="fixed left-20 z-50 min-w-[210px] rounded-2xl border border-white/[0.12] bg-[#0D121A]/98 p-3.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-left-2 duration-200">
                          <p className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-widest text-[#22D3EE] font-mono">
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
                                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                                  sub.tab === activeTab
                                    ? 'bg-[#121A24] text-[#22D3EE] border border-[#22D3EE]/30'
                                    : 'text-[#94A3B8] hover:bg-[#121A24] hover:text-[#F8FAFC]'
                                }`}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
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

        {/* ── Central de Comando (Card de Ação Distinto com Gradiente Exclusivo) ── */}
        <div className="shrink-0 p-3 border-t border-white/[0.07] bg-[#070A0F]">
          {!isCollapsed ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0D121A] p-4 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#22D3EE] animate-pulse" />
                <h4 className="text-xs font-extrabold text-[#F8FAFC] uppercase tracking-wider font-mono">
                  CENTRAL DE COMANDO
                </h4>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Orquestre sua operação de Revenue em tempo real.
              </p>
              <button
                type="button"
                onClick={() => openTab('workspace')}
                className="w-full flex items-center justify-between rounded-xl bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6] p-0.5 text-xs font-extrabold text-slate-950 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-full bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6] py-2 px-3 rounded-[10px] flex items-center justify-between text-slate-950">
                  <div className="flex items-center gap-1.5">
                    <Plus size={15} strokeWidth={3} />
                    <span className="font-extrabold">Orquestrar Pipeline</span>
                  </div>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openTab('workspace')}
              className="flex h-11 w-11 mx-auto items-center justify-center rounded-2xl bg-gradient-to-r from-[#22D3EE] via-[#3B82F6] to-[#8B5CF6] text-slate-950 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
