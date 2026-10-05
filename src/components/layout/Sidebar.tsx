import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { type CSSProperties, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { hasRequiredRole, MESA_TRATAMENTO_ROLES } from '../../lib/auth/authorization.js';
import { BirthHubLogo } from '../brand/BirthHubLogo.js';
import { SoundFX } from '../../lib/soundEffects.js';
import { NavLaunchTransition, type NavLaunch } from './NavLaunchTransition.js';
import { NAV_ACCENT_VAR, TAB_META, type TabType } from './tabMeta.js';

/** Preferência de menu recolhido. A chave anterior era prefixada com o nome da
 *  marca antiga; a leitura do valor legado existe só para não zerar a
 *  preferência de quem já usava o produto — pode sair numa limpeza futura. */
const SIDEBAR_COLLAPSED_KEY = '@birthhub:sidebar-collapsed';
const LEGACY_SIDEBAR_COLLAPSED_KEY = '@birthhub360:sidebar-collapsed';

interface SidebarProps {
  activeTab: TabType;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavGroupDefinition {
  title: string;
  items: TabType[];
}

function parsePillarHeader(title: string): { number: string; name: string } {
  if (title.startsWith('PILAR ')) {
    const match = title.match(/^PILAR\s+(\d+)\s*[-—]\s*(.+)$/i);
    if (match) {
      return { number: match[1], name: match[2].trim() };
    }
  }
  return { number: '', name: title };
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

  const [collapsedPillars, setCollapsedPillars] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem('@birthhub:collapsed-pillars');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const togglePillar = (pillarTitle: string) => {
    SoundFX.play('focus');
    setCollapsedPillars((prev) => {
      const next = { ...prev, [pillarTitle]: !prev[pillarTitle] };
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem('@birthhub:collapsed-pillars', JSON.stringify(next));
        } catch {}
      }
      return next;
    });
  };

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
  const canManageOperations =
    !!currentUser && hasRequiredRole(currentUser.role, ['ADMIN', 'GESTOR']);
  const canAccessMesaTratamento =
    !!currentUser && hasRequiredRole(currentUser.role, MESA_TRATAMENTO_ROLES);
  // Perfil SDR focado: pedido explícito do usuário — dentro da Central Comercial (CRM), o papel
  // SDR vê um menu enxuto centrado no Plano Diário e nas ferramentas de trabalho do dia
  // (prospecção, qualificação, cadência, treino), não os ~30 itens do menu completo. Aplica-se ao
  // papel como um todo (não a uma conta específica), então vale para qualquer futuro SDR contratado.
  const _isRestrictedSdrProfile = currentUser?.role === 'SDR';

  const reduceMotion = useReducedMotion();
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

  const selectTab = (tab: TabType, event: React.MouseEvent<HTMLButtonElement>) => {
    if (launch) return; // transição em andamento: ignora cliques extras
    if (tab !== activeTab) SoundFX.play('navigate');

    // A animação de abertura (ícone voa ao centro, gira, revela o logo) é pulada quando:
    // - já está no módulo (nada a abrir);
    // - a pessoa pediu movimento reduzido (prefers-reduced-motion);
    // - navegador automatizado (Playwright/Selenium): os testes E2E clicam nesses botões e não
    //   devem esperar ~1s de animação;
    // - Ctrl/Cmd/Shift/Alt pressionado: atalho para quem quer ir direto (uso repetido, SDR).
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

    const meta = TAB_META[tab];
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

  const _administrationItems: TabType[] = [
    'notifications',
    'bitrix',
    ...(canManageOperations ? (['integrations', 'automations'] as TabType[]) : []),
    ...(isAdmin ? (['usage', 'team', 'module-access'] as TabType[]) : []),
    'settings',
  ];

  // Convergência da Navegação: Arquitetura dos 3 Pilares Canônicos
  // (ver .agents/PLAN-V4/03-PRODUCT/04-THREE-PILLARS-NAVIGATION-CONVERGENCE.md)
  // 1. COMMAND CENTER (Cockpit de entrada executiva / diária)
  // 2. PILAR 1: CRM COMERCIAL (Pipeline, Contas, Decisores, Atividades e Propostas)
  // 3. PILAR 2: PROSPECÇÃO INTELIGENTE (Busca ICP, Outbound, Cadências, Telefonia & Dialer)
  // 4. PILAR 3: COPILOTO COMERCIAL IA (IA generativa, inteligência de mercado, RAG, analytics & capacitação)
  // 5. ADMINISTRAÇÃO (Camada segregada de governança e integrações)
  const allPillars = [
    'PILAR 01 — HUB COMERCIAL',
    'PILAR 02 — INTELIGÊNCIA DE MERCADO',
    'PILAR 03 — ORQUESTRAÇÃO DE VENDAS',
    'PILAR 04 — PERFORMANCE COMERCIAL',
    'PILAR 05 — PREVISIBILIDADE COMERCIAL',
    'PILAR 06 — INTELIGÊNCIA ARTIFICIAL',
    'PILAR 07 — AUTOMAÇÃO & CONECTIVIDADE',
    'PILAR 08 — ENGAJAMENTO COMERCIAL',
    'ADMINISTRAÇÃO',
  ];

  const navGroupsByJourney: NavGroupDefinition[] = [
    {
      title: 'PILAR 01 — HUB COMERCIAL',
      items: ['workspace', 'crm', 'crm360', 'propostas', 'companies', 'contacts', 'settings_hub'],
    },
    {
      title: 'PILAR 02 — INTELIGÊNCIA DE MERCADO',
      items: ['prospect', 'market-intelligence', 'settings_market'],
    },
    {
      title: 'PILAR 03 — ORQUESTRAÇÃO DE VENDAS',
      items: [
        'playbooks',
        'cadence',
        'jornadas',
        'processos',
        'roteiros',
        'daily-plan',
        'activities',
        'calendar',
        'qualification_matrix',
        'objections_matrix',
        'roleplay',
        'topic_training',
        'chatbook',
        'editor',
        'settings_sales',
      ],
    },
    {
      title: 'PILAR 04 — PERFORMANCE COMERCIAL',
      items: ['dashboard', 'analytics', 'winloss', 'reports', 'settings_performance'],
    },
    {
      title: 'PILAR 05 — PREVISIBILIDADE COMERCIAL',
      items: ['forecast', 'metas', 'pipeline_ponderado', 'settings_predictability'],
    },
    {
      title: 'PILAR 06 — INTELIGÊNCIA ARTIFICIAL',
      items: [
        ...(canAccessCommercialIntelligence ? (['commercial_intelligence'] as TabType[]) : []),
        ...(canAccessCopilotoIa ? (['copiloto_ia'] as TabType[]) : []),
        'intelligence',
        'knowledge',
        'sdr-diagnostic',
        'settings_ai',
      ],
    },
    {
      title: 'PILAR 07 — AUTOMAÇÃO & CONECTIVIDADE',
      items: [
        ...(canManageOperations ? (['automations', 'integrations'] as TabType[]) : []),
        'bitrix',
        'settings_automation',
      ],
    },
    {
      title: 'PILAR 08 — ENGAJAMENTO COMERCIAL',
      items: [
        'voice-hub',
        'outbound',
        'dialer',
        ...(canAccessMesaTratamento ? (['mesa-tratamento'] as TabType[]) : []),
        'settings_engagement',
      ],
    },
    {
      title: 'ADMINISTRAÇÃO',
      items: ['notifications', 'usage', 'team', 'module-access', 'settings'].filter((item) => {
        if (item === 'notifications' || item === 'settings') return true;
        return isAdmin;
      }) as TabType[],
    },
  ];

  const GROUP_ORDER_BY_ROLE: Partial<Record<string, string[]>> = {
    CLOSER: allPillars,
    GESTOR: allPillars,
    ADMIN: allPillars,
    VISUALIZADOR: allPillars,
    SDR: allPillars,
  };

  const roleOrder = GROUP_ORDER_BY_ROLE[currentUser?.role ?? ''];
  const navGroups = roleOrder
    ? [...navGroupsByJourney].sort(
        (a, b) => roleOrder.indexOf(a.title) - roleOrder.indexOf(b.title),
      )
    : navGroupsByJourney;

  const renderNavItem = (tab: TabType) => {
    const meta = TAB_META[tab];
    if (!meta) return null;
    const Icon = meta.icon;
    const isActive = activeTab === tab;
    // NAV_ACCENT_VAR is still threaded through for NavLaunchTransition
    const accentStyle = { '--nav-accent': NAV_ACCENT_VAR[meta.accent] } as CSSProperties;

    return (
      <button
        key={tab}
        type="button"
        onClick={(event) => selectTab(tab, event)}
        title={meta.label}
        aria-label={meta.label}
        aria-current={isActive ? 'page' : undefined}
        style={accentStyle}
        className={`group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-surface cursor-pointer ${
          isActive
            ? 'bg-brand/12 font-semibold text-brand shadow-xs'
            : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
        } ${isCollapsed ? 'lg:px-0 lg:justify-center' : ''}`}
      >
        {/* Gold indicator bar for active state */}
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute inset-y-1.5 left-0 w-1 rounded-r-md bg-brand shadow-[0_0_8px_rgba(212,175,55,0.4)]"
          />
        )}
        {/* Icon — 16px, crisp */}
        <span
          data-nav-icon
          aria-hidden="true"
          className={`grid h-4 w-4 shrink-0 place-items-center transition-colors ${
            isActive ? 'text-brand' : 'text-slate-400 group-hover:text-slate-200'
          }`}
        >
          <Icon size={16} strokeWidth={1.75} />
        </span>
        {/* Label */}
        <span className={`truncate font-sans ${isCollapsed ? 'lg:hidden' : ''}`}>{meta.label}</span>
      </button>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col bg-surface border-r border-line transition-[width,transform] duration-300 lg:static lg:translate-x-0 ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      aria-label="Navegação principal - Intelligent Business Command Center"
    >
      {/* ── Logo / wordmark area ────────────────────────────────────────────── */}
      <div
        className={`flex h-14 shrink-0 items-center border-b border-line px-4 ${
          isCollapsed ? 'lg:justify-center lg:px-0' : 'justify-between'
        }`}
      >
        {isCollapsed ? (
          /* Collapsed: emblem only, click to expand */
          <button
            type="button"
            onClick={toggleCollapse}
            className="flex items-center justify-center rounded-lg p-1.5 text-slate-400 transition-colors hover:text-slate-100 hover:bg-white/[0.05] cursor-pointer"
            title="Expandir menu lateral"
          >
            <BirthHubLogo variant="mark" className="h-8 w-8" title="Birth Hub 360°" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <BirthHubLogo variant="mark" className="h-8 w-8 shrink-0" title="Birth Hub 360°" />
              <div className="leading-tight min-w-0">
                <h1 className="text-sm font-bold tracking-tight text-white truncate font-display">
                  Birth Hub 360°
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-brand/90 truncate font-sans">
                  Command Center
                </span>
              </div>
            </div>
            {/* Collapse toggle — top right when expanded */}
            <button
              type="button"
              onClick={toggleCollapse}
              className="hidden shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:text-slate-100 hover:bg-white/[0.06] cursor-pointer lg:block"
              title="Recolher menu"
            >
              <PanelLeftClose size={16} strokeWidth={1.75} />
            </button>
          </>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <nav
        aria-label="Navegação principal"
        className="custom-scrollbar flex-1 overflow-y-auto px-2 py-3 space-y-1"
      >
        {navGroups.map((group, groupIndex) => {
          const pillarInfo = parsePillarHeader(group.title);
          const hasActiveItem = group.items.includes(activeTab);
          const isPillarCollapsed = !!collapsedPillars[group.title] && !hasActiveItem;

          return (
            <section key={group.title} className="space-y-0.5" aria-label={group.title}>
              {/* Group label / collapsible header — hidden when collapsed */}
              {!isCollapsed && (
                <div className={`px-1 pb-1 ${groupIndex > 0 ? 'mt-4' : 'mt-0.5'}`}>
                  <button
                    type="button"
                    onClick={() => togglePillar(group.title)}
                    className="group/header flex w-full items-center justify-between px-2 py-1 text-left rounded-md transition-colors hover:bg-white/[0.04] cursor-pointer"
                    aria-expanded={!isPillarCollapsed}
                    title={isPillarCollapsed ? 'Expandir pilar' : 'Recolher pilar'}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {pillarInfo.number ? (
                        <span className="flex h-4 min-w-4 px-1 shrink-0 items-center justify-center rounded text-[10px] font-semibold bg-white/[0.08] text-brand/90 font-mono">
                          {pillarInfo.number}
                        </span>
                      ) : null}
                      <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase truncate group-hover/header:text-slate-200 font-sans">
                        {pillarInfo.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {hasActiveItem && isPillarCollapsed && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-brand"
                          title="Item ativo neste pilar"
                        />
                      )}
                      <ChevronDown
                        size={13}
                        className={`text-slate-500 transition-transform duration-200 group-hover/header:text-slate-300 ${
                          isPillarCollapsed ? '-rotate-90' : 'rotate-0'
                        }`}
                      />
                    </div>
                  </button>
                </div>
              )}

              {/* Divider in collapsed mode */}
              {isCollapsed && groupIndex > 0 && <div className="my-2 mx-2 h-px bg-white/8" />}

              {/* Items: show if sidebar is collapsed (rail mode) OR pillar is not collapsed */}
              {(isCollapsed || !isPillarCollapsed) && (
                <div className="space-y-0.5">{group.items.map(renderNavItem)}</div>
              )}
            </section>
          );
        })}
      </nav>

      {/* ── Bottom section: collapse toggle (expanded) + user area + logout ── */}
      <div className="shrink-0 border-t border-line px-3 py-3 space-y-2 bg-surface/50">
        {/* Expand toggle — only shown when collapsed, centered */}
        {isCollapsed && (
          <div className="hidden justify-center lg:flex mb-1">
            <button
              type="button"
              onClick={toggleCollapse}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-slate-100 hover:bg-white/[0.06] cursor-pointer"
              title="Expandir menu lateral"
            >
              <PanelLeftOpen size={16} strokeWidth={1.75} />
            </button>
          </div>
        )}

        {/* User identity pill */}
        {currentUser && (
          <div
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] ${
              isCollapsed ? 'lg:justify-center lg:px-0 lg:bg-transparent lg:border-transparent' : ''
            }`}
            title={
              isCollapsed
                ? `${currentUser.name} (${currentUser.roleTitle || currentUser.role})`
                : undefined
            }
          >
            {/* Avatar — initials, 28px, brand gold tint */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/20 text-[11px] font-bold text-brand ring-1 ring-brand/30">
              {currentUser.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {/* Name + role — hidden when collapsed */}
            <div className={`min-w-0 flex-1 ${isCollapsed ? 'lg:hidden' : ''}`}>
              <p className="truncate text-xs font-semibold leading-tight text-slate-200 font-sans">
                {currentUser.name}
              </p>
              <p className="truncate text-[10px] font-medium leading-tight text-slate-400 font-sans">
                {currentUser.roleTitle || currentUser.role}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-red-400/80 transition-colors duration-150 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-surface ${
            isCollapsed ? 'lg:justify-center lg:px-0' : ''
          }`}
          title="Encerrar sessão e sair da conta"
          aria-label="Encerrar sessão e sair da conta"
        >
          <LogOut
            size={15}
            strokeWidth={1.75}
            className="shrink-0 transition-transform group-hover:-translate-x-0.5"
          />
          <span className={`font-sans ${isCollapsed ? 'lg:hidden' : ''}`}>Sair da Conta</span>
        </button>
      </div>

      <AnimatePresence>
        {launch && <NavLaunchTransition key={launch.tab} launch={launch} onFinish={finishLaunch} />}
      </AnimatePresence>
    </aside>
  );
}
