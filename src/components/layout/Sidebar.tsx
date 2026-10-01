import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { type CSSProperties, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { hasRequiredRole, MESA_TRATAMENTO_ROLES } from '../../lib/auth/authorization.js';
import { BrandEmblemBadge } from '../brand/BrandEmblemBadge.js';
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
  const canManageOperations =
    !!currentUser && hasRequiredRole(currentUser.role, ['ADMIN', 'GESTOR']);
  const canAccessMesaTratamento =
    !!currentUser && hasRequiredRole(currentUser.role, MESA_TRATAMENTO_ROLES);
  // Perfil SDR focado: pedido explícito do usuário — dentro da Central Comercial (CRM), o papel
  // SDR vê um menu enxuto centrado no Plano Diário e nas ferramentas de trabalho do dia
  // (prospecção, qualificação, cadência, treino), não os ~30 itens do menu completo. Aplica-se ao
  // papel como um todo (não a uma conta específica), então vale para qualquer futuro SDR contratado.
  const isRestrictedSdrProfile = currentUser?.role === 'SDR';

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

  const administrationItems: TabType[] = [
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
      items: ['workspace', 'crm', 'crm360', 'propostas', 'companies', 'contacts'],
    },
    {
      title: 'PILAR 02 — INTELIGÊNCIA DE MERCADO',
      items: ['prospect', 'market-intelligence'],
    },
    {
      title: 'PILAR 03 — ORQUESTRAÇÃO DE VENDAS',
      items: [
        'daily-plan',
        'activities',
        'calendar',
        'cadence',
        'roleplay',
        'qualification_matrix',
        'objections_matrix',
        'topic_training',
        'chatbook',
        'editor',
      ],
    },
    {
      title: 'PILAR 04 — PERFORMANCE COMERCIAL',
      items: ['dashboard', 'analytics', 'winloss', 'reports'],
    },
    {
      title: 'PILAR 06 — INTELIGÊNCIA ARTIFICIAL',
      items: [
        ...(canAccessCommercialIntelligence ? (['commercial_intelligence'] as TabType[]) : []),
        ...(canAccessCopilotoIa ? (['copiloto_ia'] as TabType[]) : []),
        'intelligence',
        'knowledge',
        'sdr-diagnostic',
      ],
    },
    {
      title: 'PILAR 07 — AUTOMAÇÃO & CONECTIVIDADE',
      items: [
        ...(canManageOperations ? (['automations', 'integrations'] as TabType[]) : []),
        'bitrix',
      ],
    },
    {
      title: 'PILAR 08 — ENGAJAMENTO COMERCIAL',
      items: [
        'voice-hub',
        'outbound',
        'dialer',
        ...(canAccessMesaTratamento ? (['mesa-tratamento'] as TabType[]) : []),
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
    // NAV_ACCENT_VAR is still threaded through for NavLaunchTransition; icon colors are
    // simplified to brand-gold (active) / white-45% (inactive) per the new design spec.
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
        className={`group relative flex w-full items-center gap-[10px] rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-midnight cursor-pointer ${
          isActive
            ? 'bg-brand/10 font-semibold text-brand'
            : 'font-medium text-white/45 hover:bg-white/6 hover:text-white/70'
        } ${isCollapsed ? 'lg:px-0 lg:justify-center' : ''}`}
      >
        {/* Gold left-accent bar for active state — absolute, flush left edge of the item */}
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute inset-y-1.5 left-0 w-0.5 rounded-r-sm bg-brand"
          />
        )}
        {/* Icon — 16px, simplified colors: gold when active, white/45 when inactive */}
        <span
          data-nav-icon
          aria-hidden="true"
          className={`grid h-4 w-4 shrink-0 place-items-center ${
            isActive ? 'text-brand' : 'text-white/45 group-hover:text-white/70'
          }`}
        >
          <Icon size={16} strokeWidth={1.75} />
        </span>
        {/* Label — hidden in collapsed mode on desktop */}
        <span
          className={`truncate font-[family-name:var(--font-brand-sans)] ${
            isCollapsed ? 'lg:hidden' : ''
          }`}
        >
          {meta.label}
        </span>
      </button>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col bg-midnight border-r border-white/8 transition-[width,transform] duration-300 lg:static lg:translate-x-0 ${
        isCollapsed ? 'lg:w-16' : 'lg:w-[220px]'
      } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      aria-label="Navegação principal - Intelligent Business Command Center"
    >
      {/* ── Logo / wordmark area ────────────────────────────────────────────── */}
      <div
        className={`flex h-14 shrink-0 items-center border-b border-white/8 px-4 ${
          isCollapsed ? 'lg:justify-center lg:px-0' : 'justify-between'
        }`}
      >
        {isCollapsed ? (
          /* Collapsed: emblem only, click to expand */
          <button
            type="button"
            onClick={toggleCollapse}
            className="flex items-center justify-center rounded-md p-1 text-white/35 transition-colors hover:text-white/65"
            title="Expandir menu lateral"
          >
            <BrandEmblemBadge className="h-8 w-8" title="Birth Hub 360°" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <BrandEmblemBadge className="h-8 w-8 shrink-0" title="Birth Hub 360°" />
              <div className="leading-tight min-w-0">
                <h1 className="text-[13px] font-semibold tracking-tight text-white truncate font-[family-name:var(--font-brand-sans)]">
                  Birth Hub 360°
                </h1>
                <span className="text-[10px] font-normal tracking-wide text-white/40 truncate font-[family-name:var(--font-brand-sans)]">
                  Command Center
                </span>
              </div>
            </div>
            {/* Collapse toggle — top right when expanded */}
            <button
              type="button"
              onClick={toggleCollapse}
              className="hidden shrink-0 rounded-md p-1.5 text-white/35 transition-colors hover:text-white/65 lg:block"
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
        className="custom-scrollbar flex-1 overflow-y-auto px-2 py-3 space-y-0"
      >
        {navGroups.map((group, groupIndex) => (
          <section key={group.title} className="space-y-0.5" aria-label={group.title}>
            {/* Group label — hidden when collapsed */}
            <div
              className={`px-3 pb-1 ${
                groupIndex > 0 ? 'mt-5' : 'mt-1'
              } ${isCollapsed ? 'lg:hidden' : ''}`}
            >
              <p className="text-[10px] font-normal uppercase tracking-[0.08em] text-white/30 font-[family-name:var(--font-brand-sans)]">
                {group.title}
              </p>
            </div>
            {/* Divider visible only in collapsed mode (replaces the group label) */}
            {groupIndex > 0 && (
              <div className={`my-2 mx-2 h-px bg-white/8 ${isCollapsed ? '' : 'lg:hidden'}`} />
            )}
            {group.items.map(renderNavItem)}
          </section>
        ))}
      </nav>

      {/* ── Bottom section: collapse toggle (expanded) + user area + logout ── */}
      <div className="shrink-0 border-t border-white/8 px-2 py-3 space-y-1">
        {/* Expand toggle — only shown when collapsed, centered */}
        {isCollapsed && (
          <div className="hidden justify-center lg:flex mb-2">
            <button
              type="button"
              onClick={toggleCollapse}
              className="rounded-md p-1.5 text-white/35 transition-colors hover:text-white/65"
              title="Expandir menu lateral"
            >
              <PanelLeftOpen size={16} strokeWidth={1.75} />
            </button>
          </div>
        )}

        {/* User identity pill */}
        {currentUser && (
          <div
            className={`flex items-center gap-2.5 px-2 py-2 ${
              isCollapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
            title={
              isCollapsed
                ? `${currentUser.name} (${currentUser.roleTitle || currentUser.role})`
                : undefined
            }
          >
            {/* Avatar — initials, 28px, brand gold tint */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/30 text-[11px] font-semibold text-brand font-[family-name:var(--font-brand-sans)] ring-1 ring-brand/20">
              {currentUser.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {/* Name + role — hidden when collapsed */}
            <div className={`min-w-0 flex-1 ${isCollapsed ? 'lg:hidden' : ''}`}>
              <p className="truncate text-[12px] font-semibold leading-tight text-white/80 font-[family-name:var(--font-brand-sans)]">
                {currentUser.name}
              </p>
              <p className="truncate text-[10px] font-normal leading-tight text-white/40 font-[family-name:var(--font-brand-sans)]">
                {currentUser.roleTitle || currentUser.role}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] font-medium text-red-400/60 transition-colors duration-150 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-midnight ${
            isCollapsed ? 'lg:justify-center lg:px-0' : ''
          }`}
          title="Encerrar sessão e sair da conta"
          aria-label="Encerrar sessão e sair da conta"
        >
          <LogOut
            size={16}
            strokeWidth={1.75}
            className="shrink-0 transition-transform group-hover:-translate-x-0.5"
          />
          <span
            className={`font-[family-name:var(--font-brand-sans)] ${isCollapsed ? 'lg:hidden' : ''}`}
          >
            Sair da Conta
          </span>
        </button>
      </div>

      <AnimatePresence>
        {launch && <NavLaunchTransition key={launch.tab} launch={launch} onFinish={finishLaunch} />}
      </AnimatePresence>
    </aside>
  );
}
