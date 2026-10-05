import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowDown,
  ChevronDown,
  Database,
  LineChart,
  Moon,
  Play,
  Sun,
  Workflow,
  Brain,
  Bot,
  Phone,
} from 'lucide-react';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { BRAND, LOGIN_URL } from './brand.js';

/* -------------------------------------------------------------------------- */
/* Logo Component (Official Vector Logo)                                       */
/* -------------------------------------------------------------------------- */

function Logo() {
  return (
    <svg className="w-9 h-9" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-g0" x1="127" y1="46" x2="199" y2="87">
          <stop offset="0" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#C53678" />
        </linearGradient>
        <linearGradient id="logo-g1" x1="198" y1="86" x2="198" y2="169">
          <stop offset="0" stopColor="#C53678" />
          <stop offset="1" stopColor="#1677FF" />
        </linearGradient>
        <linearGradient id="logo-g2" x1="199" y1="168" x2="127" y2="210">
          <stop offset="0" stopColor="#1677FF" />
          <stop offset="1" stopColor="#0F9D64" />
        </linearGradient>
        <linearGradient id="logo-g3" x1="128" y1="210" x2="56" y2="168">
          <stop offset="0" stopColor="#0F9D64" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <circle cx="128" cy="128" r="118" fill="none" stroke="#D4AF37" strokeWidth="8" opacity="0.4" strokeDasharray="2 10" />
      <g fill="none" strokeWidth="14">
        <path stroke="url(#logo-g0)" d="M127.14 46.00 A82.0 82.0 0 0 1 199.44 87.75" />
        <path stroke="url(#logo-g1)" d="M198.58 86.26 A82.0 82.0 0 0 1 198.58 169.74" />
        <path stroke="url(#logo-g2)" d="M199.44 168.25 A82.0 82.0 0 0 1 127.14 210.00" />
        <path stroke="url(#logo-g3)" d="M128.86 210.00 A82.0 82.0 0 0 1 56.56 168.25" />
      </g>
      <circle cx="128" cy="128" r="74" fill="#0B132B" />
      <circle cx="128" cy="128" r="62" fill="none" stroke="#D4AF37" strokeWidth="3" />
      <path fill="#F8FAFC" transform="matrix(0.074 0 0 -0.074 104 154)" d="M450.4 707Q574.2 707 627.9 670.8Q681.6 634.6 681.6 573.4Q681.6 520.8 646.8 476.7Q612 432.6 547 404.5Q482 376.4 391 370.8Q511 369.4 573.8 326.1Q636.6 282.8 636.6 218.2Q636.6 165.8 612.2 125.1Q587.8 84.4 543.2 56.4Q498.6 28.4 436 14.2Q373.4 0 297 0Q267.8 0 227.6 1.5Q187.4 3 121 3Q94.8 3 63.8 2.5Q32.8 2 3.7 1.5Q-25.4 1 -45 0L-41 20Q-7 22 12 28Q31 34 42 52Q53 70 62 106L194 602Q201.8 632.8 202.4 651.3Q203 669.8 188.5 678.5Q174 687.2 135 688L140 708Q159.6 707 188.2 706.5Q216.8 706 247.7 705.5Q278.6 705 303 705Q353.2 705 385.7 706Q418.2 707 450.4 707ZM266 359 270 376H339.2Q393.8 376 430.6 407.9Q467.4 439.8 486.2 490.8Q505 541.8 505 596.8Q505 636.6 491.5 662.3Q478 688 438.6 688Q413 688 401 674.1Q389 660.2 378 617L243 106Q238.2 86.4 235.7 67.1Q233.2 47.8 242.2 35.4Q251.2 23 278.8 23Q331.6 23 368.9 53.4Q406.2 83.8 426.6 132.9Q447 182 447 237.2Q447 270.4 437.2 297.9Q427.4 325.4 404.3 342.2Q381.2 359 341.6 359Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Motion tokens (espelhados da plataforma para manter harmonia)              */
/* -------------------------------------------------------------------------- */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
};

function staggerContainer(staggerChildren = 0.08, delayChildren = 0) {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren, delayChildren },
    },
  };
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT_EXPO } },
};

/* -------------------------------------------------------------------------- */
/* Micro-interações táteis                                                    */
/* -------------------------------------------------------------------------- */

function useMagnetic(strength = 0.25) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) * strength;
      const y = (e.clientY - centerY) * strength;
      setPosition({ x, y });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, reduceMotion]);

  return { ref, position, disabled: reduceMotion };
}

function RevealLine({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <span>{children}</span>;

  return (
    <span className="inline-block overflow-hidden align-top">
      <motion.span
        className="inline-block"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.65, delay, ease: EASE_OUT_EXPO }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Componentes visuais                                                        */
/* -------------------------------------------------------------------------- */

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

const primaryCta =
  'group relative inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-sans text-sm font-semibold text-on-brand shadow-sm transition-all duration-200 hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

const secondaryCta =
  'group inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-surface px-5 py-3 font-sans text-sm font-medium text-ink transition-all duration-200 hover:border-brand/40 hover:bg-surface-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

/* -------------------------------------------------------------------------- */
/* Mock Cockpit: OrbitHub                                                     */
/* -------------------------------------------------------------------------- */

const COCKPIT_NODES = [
  {
    id: 'crm',
    title: 'CRM',
    metric: 'Pipeline ativo',
    detail: 'Negociações em andamento',
    color: '#1677FF', // Orbit Blue
    Icon: Database,
    position: 'top-4 left-6',
  },
  {
    id: 'ai',
    title: 'IA Especializada',
    metric: 'Copiloto ativo',
    detail: 'Suporte em negociações',
    color: '#C53678', // Iris
    Icon: Brain,
    position: 'top-4 right-6',
  },
  {
    id: 'forecast',
    title: 'Previsibilidade',
    metric: 'Forecast ponderado',
    detail: 'Análise de cenários',
    color: '#D4AF37', // Gold
    Icon: LineChart,
    position: 'bottom-4 left-6',
  },
  {
    id: 'orchestration',
    title: 'Orquestração',
    metric: 'Próxima ação',
    detail: 'Tarefas priorizadas',
    color: '#0F9D64', // OK Green
    Icon: Workflow,
    position: 'bottom-4 right-6',
  },
] as const;

function OrbitHub() {
  const [activeNode, setActiveNode] = useState<string>('crm');
  const reduceMotion = useReducedMotion();

  const selected = COCKPIT_NODES.find((n) => n.id === activeNode) ?? COCKPIT_NODES[0];

  return (
    <div className="relative mx-auto w-full max-w-lg select-none">
      <div className="relative rounded-2xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-xs text-ink-2">COMMAND CENTER · DEMONSTRAÇÃO</span>
          </div>
          <span className="font-mono text-xs text-brand">360° ENGINE</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {COCKPIT_NODES.map((node) => {
            const isActive = node.id === activeNode;
            const Icon = node.Icon;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveNode(node.id)}
                className={`group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${isActive
                    ? 'border-brand/60 bg-surface-2 shadow-sm'
                    : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2/60'
                  }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line"
                    style={{
                      backgroundColor: `${node.color}15`,
                      color: node.color,
                    }}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: isActive ? node.color : 'transparent' }}
                  />
                </div>
                <span className="mt-3 font-sans text-xs font-semibold text-ink">{node.title}</span>
                <span className="font-mono text-[11px] text-ink-2">{node.metric}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-line bg-surface-2/50 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-2">
              Nó ativo · {selected.title}
            </span>
            <span className="font-mono text-[11px] font-semibold text-brand">
              Status normal
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-ink">{selected.detail}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full bg-brand"
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                transition={{ duration: reduceMotion ? 0 : 0.8, ease: EASE_OUT_EXPO }}
              />
            </div>
            <span className="font-mono text-[10px] text-ink-2">78% capacidade</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                      */
/* -------------------------------------------------------------------------- */

function Header({
  theme,
  onToggleTheme,
}: {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-bg/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg">
          <Logo />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-display font-bold text-lg tracking-tight text-ink">Birth Hub</span>
              <span className="font-display font-semibold text-lg text-brand">360°</span>
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-75 -mt-1 text-ink-2">
              {BRAND.subbrand}
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          <a
            href="#solucao"
            className="font-sans text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            Produto
          </a>
          <a
            href="#pilares"
            className="font-sans text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            Pilares
          </a>
          <a
            href="#inteligencia"
            className="font-sans text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            Inteligência
          </a>
          <a
            href="#cockpit"
            className="font-sans text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            Command Center
          </a>
          <a
            href="#governanca"
            className="font-sans text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            Governança
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          <a href={LOGIN_URL} className={primaryCta}>
            <span>Acessar Plataforma</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero Section                                                                */
/* -------------------------------------------------------------------------- */

function Hero() {
  const magnetic = useMagnetic(0.2);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <motion.div
          className="flex flex-col items-start lg:col-span-6"
          initial="hidden"
          animate="show"
          variants={staggerContainer(0.08)}
        >
          <motion.div variants={staggerItem}>
            <SectionLabel>{BRAND.tagline}</SectionLabel>
          </motion.div>
          <motion.h1
            id="hero-title"
            variants={staggerItem}
            className="mt-4 font-display text-5xl font-bold leading-[1.15] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            <RevealLine delay={0.15}>
              Dados que <span className="text-brand">Conectam.</span>
            </RevealLine>
            <RevealLine delay={0.3}>
              Inteligência que <span className="text-brand">Decide.</span>
            </RevealLine>
            <RevealLine delay={0.45}>
              <span className="text-ink">Resultados que Acontecem.</span>
            </RevealLine>
          </motion.h1>
          <motion.div
            variants={staggerItem}
            className="mt-6 max-w-xl space-y-2 text-base leading-relaxed"
          >
            <p className="font-medium text-ink">
              {BRAND.description}
            </p>
          </motion.div>
          <motion.div variants={staggerItem} className="mt-8 flex flex-wrap items-center gap-3">
            <motion.a
              href={LOGIN_URL}
              ref={magnetic.ref}
              animate={magnetic.disabled ? {} : { x: magnetic.position.x, y: magnetic.position.y }}
              className={primaryCta}
            >
              Conhecer a Plataforma
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </motion.a>
            <motion.a
              href="#cockpit"
              className={secondaryCta}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
            >
              <Play className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
              Ver como funciona
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-6"
          initial="hidden"
          animate="show"
          variants={scaleIn}
        >
          <OrbitHub />
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* O Caos Comercial Section                                                   */
/* -------------------------------------------------------------------------- */

function ChaosSection() {
  return (
    <section id="solucao" className="border-t border-line bg-surface/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>O Problema</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Quando cada ferramenta conta uma parte,
            <br />
            a operação perde o contexto.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {['CRM', 'Planilhas', 'BI', 'Comunicação', 'Automação', 'Dados'].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-line bg-surface p-4 text-center"
            >
              <span className="font-mono text-xs font-semibold text-ink-2">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-sm text-ink-2">
            <span className="text-critical">DADOS FRAGMENTADOS</span>
            <ArrowRight className="h-4 w-4" />
            <span className="text-critical">DECISÕES LENTAS</span>
            <ArrowRight className="h-4 w-4" />
            <span className="text-critical">EXECUÇÃO DESCONECTADA</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm text-ink-2">
            <ArrowRight className="h-4 w-4" />
            <span className="text-critical font-semibold">BAIXA PREVISIBILIDADE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* A Resposta Section                                                          */
/* -------------------------------------------------------------------------- */

function SolutionSection() {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>A Resposta</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Um centro de comando para toda a operação comercial.
          </h2>
          <p className="mt-4 text-base text-ink-2">
            CRM + Inteligência + Execução + IA + Automação + Performance + Previsibilidade
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="rounded-2xl border-2 border-brand bg-surface/50 p-8 text-center">
            <h3 className="font-display text-2xl font-bold text-brand">{BRAND.name}</h3>
            <p className="mt-2 font-mono text-sm text-ink-2">{BRAND.subbrand}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 8 Pilares Section                                                           */
/* -------------------------------------------------------------------------- */

const PILLARS_DATA = [
  {
    num: '01',
    title: 'HUB COMERCIAL',
    desc: 'Centralização de contas, pipeline comercial unificado e visão 360° de cada oportunidade em negociação.',
    tag: 'Pipeline Central',
    color: '#1677FF', // Orbit Blue
    symbol: '◉',
  },
  {
    num: '02',
    title: 'INTELIGÊNCIA DE MERCADO',
    desc: 'Enriquecimento analítico de dados B2B, sinais de compra, qualificação precisa e inteligência de decisores.',
    tag: 'Decisão por Dados',
    color: '#0F9D64', // OK Green
    symbol: '◎',
  },
  {
    num: '03',
    title: 'ORQUESTRAÇÃO DE VENDAS',
    desc: 'Cadências multicanal coordenadas, regras de transição de bastão e alinhamento operacional de ponta a ponta.',
    tag: 'Fluxos Integrados',
    color: '#D4AF37', // Gold
    symbol: '⟶',
  },
  {
    num: '04',
    title: 'PERFORMANCE COMERCIAL',
    desc: 'Telemetria de conversão, velocidade de avanço no funil, metas operacionais e produtividade da equipe.',
    tag: 'Metas & Velocidade',
    color: '#C53678', // Iris
    symbol: '▥',
  },
  {
    num: '05',
    title: 'PREVISIBILIDADE COMERCIAL',
    desc: 'Modelagem estatística de probabilidade, análise de pipeline ponderado e cenários embasados no histórico real.',
    tag: 'Pipeline Ponderado',
    color: '#8C6D1F', // Gold Deep
    symbol: '⌁',
  },
  {
    num: '06',
    title: 'INTELIGÊNCIA ARTIFICIAL',
    desc: 'Copiloto comercial ancorado nos dados da empresa, diagnóstico de entraves e suporte ativo em negociações.',
    tag: 'Copiloto & Modelos',
    color: '#7C3AED', // Purple
    symbol: '✦',
  },
  {
    num: '07',
    title: 'AUTOMAÇÃO & CONECTIVIDADE',
    desc: 'Sincronização contínua bidirecional, gatilhos de follow-up em tempo real e integração profunda com sistemas.',
    tag: 'Gatilhos & Integrações',
    color: '#FFC500', // Warning
    symbol: '◇',
  },
  {
    num: '08',
    title: 'ENGAJAMENTO COMERCIAL',
    desc: 'Comunicação integrada, telefonia em nuvem, histórico de interações e rastreabilidade total de contatos.',
    tag: 'Voz & Omnichannel',
    color: '#D03B3B', // Critical
    symbol: '◌',
  },
] as const;

function Pillars() {
  return (
    <section id="pilares" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>Os 8 Pilares Oficiais</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Uma plataforma. Oito pilares operacionais integrados.
          </h2>
          <p className="mt-3 text-base text-ink-2">
            Cada pilar resolve uma dimensão estratégica da operação comercial, operando de forma independente ou em perfeita sinergia sistêmica.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS_DATA.map((p) => (
            <div
              key={p.num}
              className="group relative flex flex-col justify-between rounded-xl border p-6 transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: `${p.color}50`,
                borderWidth: '1.5px',
                boxShadow: `0 4px 16px -2px rgba(15, 23, 42, 0.05), 0 2px 8px -2px ${p.color}20`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl transition-all duration-300 group-hover:h-2"
                style={{
                  background: `linear-gradient(90deg, ${p.color} 0%, ${p.color}88 100%)`,
                }}
              />

              <div className="flex items-center justify-between mb-3 pt-1">
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${p.color}15`,
                      color: p.color,
                      border: `1px solid ${p.color}35`,
                    }}
                  >
                    {p.num}
                  </span>
                </div>

                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-base transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${p.color}18`,
                    color: p.color,
                    border: `1px solid ${p.color}40`,
                  }}
                >
                  {p.symbol}
                </div>
              </div>

              <div className="flex-1 my-1">
                <h3 className="font-display text-sm sm:text-base font-bold text-ink leading-tight mb-1 group-hover:text-black">
                  {p.title}
                </h3>
                <p className="font-sans text-xs text-ink-2 leading-snug mb-3">
                  {p.desc}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-line flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: p.color }} />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: p.color }}>
                    {p.tag}
                  </span>
                </div>
                <span className="font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold" style={{ color: p.color }}>
                  CONECTADO →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Interconnection Section                                                    */
/* -------------------------------------------------------------------------- */

function InterconnectionSection() {
  const steps = [
    'DADOS',
    'INTELIGÊNCIA',
    'ESTRATÉGIA',
    'EXECUÇÃO',
    'PERFORMANCE',
    'PREVISIBILIDADE',
    'IA & AUTOMAÇÃO',
    'RESULTADOS',
  ];

  return (
    <section className="border-t border-line bg-surface/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Como os Pilares se Conectam</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Os pilares não funcionam isoladamente.
            <br />
            Eles formam um sistema.
          </h2>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-32 text-right font-mono text-xs font-semibold text-ink-2">
                {step}
              </div>
              <ArrowRight className="h-4 w-4 text-brand" />
              {index === steps.length - 1 && (
                <div className="w-32 font-mono text-xs font-bold text-brand">
                  {step}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Inteligência Artificial Section                                            */
/* -------------------------------------------------------------------------- */

function AISection() {
  return (
    <section id="inteligencia" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Inteligência Artificial</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Inteligência Artificial que entende o contexto comercial.
          </h2>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 font-mono text-sm text-ink-2">
            <span>DADOS</span>
            <span className="text-brand">+</span>
            <span>CONTEXTO</span>
            <span className="text-brand">+</span>
            <span>MEMÓRIA</span>
            <span className="text-brand">+</span>
            <span>REGRAS</span>
            <span className="text-brand">+</span>
            <span>AGENTES</span>
            <span className="text-brand">+</span>
            <span>EXECUÇÃO</span>
          </div>
          <ArrowRight className="h-6 w-6 text-brand" />
          <div className="rounded-lg border-2 border-brand bg-surface/50 px-6 py-3">
            <span className="font-display text-lg font-bold text-brand">INTELIGÊNCIA OPERACIONAL</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {['Copiloto', 'Agentes', 'Recomendações', 'RAG', 'Playbooks', 'Insights'].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-line bg-surface p-4 text-center"
            >
              <span className="font-mono text-xs font-semibold text-ink-2">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Automação Section                                                          */
/* -------------------------------------------------------------------------- */

function AutomationSection() {
  return (
    <section className="border-t border-line bg-surface/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Automação & Conectividade</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Eventos que disparam ações automaticamente.
          </h2>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 font-mono text-sm text-ink-2">
            <span>EVENTO</span>
            <ArrowRight className="h-4 w-4" />
            <span>REGRA</span>
            <ArrowRight className="h-4 w-4" />
            <span>WORKFLOW</span>
            <ArrowRight className="h-4 w-4" />
            <span>AÇÃO</span>
            <ArrowRight className="h-4 w-4" />
            <span>RESULTADO</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {['Workflows', 'Webhooks', 'APIs', 'Integrações', 'Sincronização', 'Cadências'].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-line bg-surface p-4 text-center"
            >
              <span className="font-mono text-xs font-semibold text-ink-2">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Performance Section                                                         */
/* -------------------------------------------------------------------------- */

function PerformanceSection() {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Performance Comercial</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Métricas que transformam dados em decisões.
          </h2>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 font-mono text-sm text-ink-2">
            <span>DADOS</span>
            <ArrowRight className="h-4 w-4" />
            <span>ANÁLISE</span>
            <ArrowRight className="h-4 w-4" />
            <span>DECISÃO</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {['Pipeline', 'Conversão', 'KPIs', 'Performance', 'Canais', 'Equipe'].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-line bg-surface p-4 text-center"
            >
              <span className="font-mono text-xs font-semibold text-ink-2">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Previsibilidade Section                                                   */
/* -------------------------------------------------------------------------- */

function PrevisibilidadeSection() {
  return (
    <section className="border-t border-line bg-surface/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Previsibilidade Comercial</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Previsão baseada em dados, não em opinião.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {['Pipeline', 'Forecast', 'Cenários', 'Metas', 'Commit'].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-line bg-surface p-4 text-center"
            >
              <span className="font-mono text-xs font-semibold text-ink-2">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Ecossistema Section                                                        */
/* -------------------------------------------------------------------------- */

function EcosystemSection() {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Ecossistema</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Conectado ao seu stack tecnológico.
          </h2>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-3">
            {['CRM', 'ERP', 'APIs', 'Webhooks', 'Comunicação', 'Dados', 'IA', 'Automação'].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-line bg-surface px-4 py-2"
              >
                <span className="font-mono text-xs font-semibold text-ink-2">{item}</span>
              </div>
            ))}
          </div>
          <ArrowDown className="h-6 w-6 text-brand" />
          <div className="rounded-2xl border-2 border-brand bg-surface/50 px-8 py-4 text-center">
            <h3 className="font-display text-xl font-bold text-brand">{BRAND.name}</h3>
          </div>
          <ArrowDown className="h-6 w-6 text-brand" />
          <div className="flex flex-wrap justify-center gap-3">
            {['INTELIGÊNCIA', 'EXECUÇÃO', 'PERFORMANCE'].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-line bg-surface px-4 py-2"
              >
                <span className="font-mono text-xs font-semibold text-ink-2">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Command Center Section                                                     */
/* -------------------------------------------------------------------------- */

function CommandCenterSection() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'voicehub' | 'copilot'>('pipeline');

  return (
    <section id="cockpit" className="border-t border-line bg-surface/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Command Center</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Seu centro de comando comercial.
          </h2>
          <p className="mt-3 text-base text-ink-2">
            Tudo o que sua equipe precisa para decidir, agir e acompanhar a operação em um único lugar.
          </p>
        </div>

        <div className="mt-12">
          <div className="flex justify-center gap-2 mb-8">
            {[
              { id: 'pipeline' as const, label: 'Pipeline & Funil' },
              { id: 'voicehub' as const, label: 'VoiceHub' },
              { id: 'copilot' as const, label: 'Copiloto IA' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${activeTab === tab.id
                    ? 'bg-brand text-on-brand'
                    : 'bg-surface text-ink-2 hover:bg-surface-2'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-line bg-surface/80 p-6 backdrop-blur-sm">
            {activeTab === 'pipeline' && (
              <div className="text-center py-12">
                <Database className="mx-auto h-12 w-12 text-brand mb-4" />
                <h3 className="font-display text-xl font-bold text-ink">Pipeline & Funil</h3>
                <p className="mt-2 text-sm text-ink-2">Kanban, pipeline, estágios, indicadores e alertas.</p>
              </div>
            )}
            {activeTab === 'voicehub' && (
              <div className="text-center py-12">
                <Phone className="mx-auto h-12 w-12 text-brand mb-4" />
                <h3 className="font-display text-xl font-bold text-ink">VoiceHub</h3>
                <p className="mt-2 text-sm text-ink-2">Chamada, transcrição, sinalização e recomendação.</p>
              </div>
            )}
            {activeTab === 'copilot' && (
              <div className="text-center py-12">
                <Bot className="mx-auto h-12 w-12 text-brand mb-4" />
                <h3 className="font-display text-xl font-bold text-ink">Copiloto IA</h3>
                <p className="mt-2 text-sm text-ink-2">Perguntas, respostas, playbook e insights.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Governança Section                                                         */
/* -------------------------------------------------------------------------- */

function GovernanceSection() {
  return (
    <section id="governanca" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Governança</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Segurança, controle e observabilidade.
          </h2>
          <p className="mt-3 text-base text-ink-2">
            Governança transversal que protege seus dados e garante conformidade.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-7">
          {['LGPD', 'RBAC', 'RLS', 'Auditoria', 'Observabilidade', 'Segurança', 'Isolamento'].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-line bg-surface p-4 text-center"
            >
              <span className="font-mono text-xs font-semibold text-ink-2">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ Section                                                                */
/* -------------------------------------------------------------------------- */

const FAQ_ITEMS = [
  {
    q: 'Como o Birth Hub 360° se integra ao meu CRM?',
    a: 'O Birth Hub pode operar como seu CRM primário ou se conectar via APIs e webhooks a ferramentas legadas, atuando como o motor de inteligência e orquestração.',
  },
  {
    q: 'Como funciona a inteligência artificial?',
    a: 'Os agentes operam em níveis de autonomia configuráveis: desde sugestão com aprovação humana obrigatória até execução supervisionada com auditoria completa.',
  },
  {
    q: 'O que pode ser automatizado?',
    a: 'Workflows, cadências, gatilhos de follow-up, sincronização de dados e ações baseadas em eventos comerciais podem ser automatizados.',
  },
  {
    q: 'Como os dados são protegidos?',
    a: 'Criptografia em trânsito e em repouso, isolamento por organização (multi-tenant com RLS) e conformidade com padrões de privacidade corporativos.',
  },
  {
    q: 'O que é o Command Center?',
    a: 'É o cockpit executivo onde líderes visualizam pipeline, performance, forecast e ações recomendadas em tempo real.',
  },
  {
    q: 'Como os módulos trabalham juntos?',
    a: 'Os 8 pilares operam de forma integrada: dados alimentam inteligência, que alimenta estratégia, que alimenta execução, que alimenta performance e previsibilidade.',
  },
] as const;

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-b border-line py-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left font-sans text-base font-semibold text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
        aria-expanded={open}
        aria-controls={`faq-${id}`}
      >
        <span>{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-2 transition-transform duration-200 ${open ? 'rotate-180' : ''
            }`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={`faq-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-sm leading-relaxed text-ink-2">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Faq() {
  return (
    <section className="border-t border-line bg-surface/30 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Dúvidas Frequentes
          </h2>
        </div>
        <div className="mt-10">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Final CTA Section                                                          */
/* -------------------------------------------------------------------------- */

function FinalCta() {
  const magnetic = useMagnetic(0.2);

  return (
    <section className="border-t border-line bg-surface/50 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <SectionLabel>Comece Hoje</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Transforme sua operação comercial
          <br />
          em um sistema conectado.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-2">
          Conecte dados, inteligência e execução em um único centro de comando.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <motion.a
            href={LOGIN_URL}
            ref={magnetic.ref}
            animate={magnetic.disabled ? {} : { x: magnetic.position.x, y: magnetic.position.y }}
            className={primaryCta}
          >
            <span>Acessar Plataforma</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </motion.a>
          <motion.a
            href="#cockpit"
            className={secondaryCta}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            <Play className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
            Agendar Demonstração
          </motion.a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-line bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h4 className="font-display text-sm font-bold text-ink mb-4">PLATAFORMA</h4>
            <ul className="space-y-2">
              <li><a href="#pilares" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">Hub Comercial</a></li>
              <li><a href="#pilares" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">Inteligência</a></li>
              <li><a href="#pilares" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">Orquestração</a></li>
              <li><a href="#pilares" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">Performance</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-ink mb-4">RECURSOS</h4>
            <ul className="space-y-2">
              <li><a href="#cockpit" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">Command Center</a></li>
              <li><a href="#cockpit" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">VoiceHub</a></li>
              <li><a href="#inteligencia" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">Copiloto</a></li>
              <li><a href="#solucao" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">Automação</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-ink mb-4">GOVERNANÇA</h4>
            <ul className="space-y-2">
              <li><a href="#governanca" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">Segurança</a></li>
              <li><a href="#governanca" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">LGPD</a></li>
              <li><a href="#governanca" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">Privacidade</a></li>
              <li><a href="#governanca" className="font-mono text-xs text-ink-2 hover:text-brand transition-colors">Termos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-ink mb-4">{BRAND.name}</h4>
            <p className="font-mono text-xs text-ink-2">{BRAND.tagline}</p>
          </div>
        </div>
        <div className="mt-12 border-t border-line pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7">
                <Logo />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-display font-bold text-sm tracking-tight text-ink">Birth Hub</span>
                  <span className="font-display font-semibold text-sm text-brand">360°</span>
                </div>
              </div>
            </div>
            <p className="font-mono text-xs text-ink-2 text-center sm:text-right">
              {BRAND.credit}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/* Componente Principal: App                                                  */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem('birthhub_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('birthhub_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const indicator = document.getElementById('scroll-indicator');
      if (indicator) {
        indicator.style.width = scrolled + '%';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink font-sans transition-colors duration-300">
      <div id="scroll-indicator" />
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content">
        <Hero />
        <ChaosSection />
        <SolutionSection />
        <Pillars />
        <InterconnectionSection />
        <AISection />
        <AutomationSection />
        <PerformanceSection />
        <PrevisibilidadeSection />
        <EcosystemSection />
        <CommandCenterSection />
        <GovernanceSection />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
