import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  ChevronDown,
  Database,
  LineChart,
  Moon,
  Play,
  ShieldCheck,
  Sun,
  Workflow,
  Zap,
} from 'lucide-react';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { BRAND, LOGIN_URL } from './brand.js';

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

function CountUp({
  to,
  suffix = '',
  prefix = '',
  duration = 1.4,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setValue(to);
      return;
    }
    let start = 0;
    const startTimestamp = performance.now();
    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Easing suave (quad out)
      const ease = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(ease * to);
      setValue(current);
      if (progress < 1) {
        start = requestAnimationFrame(step);
      }
    };
    start = requestAnimationFrame(step);
    return () => cancelAnimationFrame(start);
  }, [to, duration, reduceMotion]);

  return (
    <span className="tabular-nums">
      {prefix}
      {value}
      {suffix}
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
  'group relative inline-flex items-center justify-center gap-2 rounded-full bg-brand-active px-6 py-3 font-sans text-sm font-semibold text-on-brand shadow-sm transition-all duration-200 hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

const secondaryCta =
  'group inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 py-3 font-sans text-sm font-medium text-ink transition-all duration-200 hover:border-brand/40 hover:bg-surface-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

/* -------------------------------------------------------------------------- */
/* Mock Cockpit: OrbitHub                                                     */
/* Substitui o mock estático por uma órbita com nós concretos do produto      */
/* -------------------------------------------------------------------------- */

const COCKPIT_NODES = [
  {
    id: 'crm',
    title: 'CRM',
    metric: 'Pipeline ativo',
    detail: 'R$ 1,4M em negociação',
    color: '#1677FF',
    Icon: Database,
    position: 'top-4 left-6',
  },
  {
    id: 'ai',
    title: 'IA Especializada',
    metric: 'Agentes comerciais',
    detail: 'Qualificação em tempo real',
    color: '#7C3AED',
    Icon: Brain,
    position: 'top-4 right-6',
  },
  {
    id: 'forecast',
    title: 'Previsibilidade',
    metric: 'Forecast ponderado',
    detail: '84% de acurácia prevista',
    color: '#D4AF37',
    Icon: LineChart,
    position: 'bottom-4 left-6',
  },
  {
    id: 'pipeline',
    title: 'Orquestração',
    metric: 'Próxima melhor ação',
    detail: '18 tarefas priorizadas hoje',
    color: '#0891B2',
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
      {/* Moldura técnica do cockpit */}
      <div className="relative rounded-2xl border border-line bg-surface/80 p-6 shadow-sm backdrop-blur-sm">
        {/* Barra superior de telemetria */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-xs text-ink-2">COMMAND CENTER · OPERAÇÃO AO VIVO</span>
          </div>
          <span className="font-mono text-xs text-brand">360° ENGINE</span>
        </div>

        {/* Grade 2x2 com os nós funcionais */}
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

        {/* Painel de detalhe do nó ativo */}
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
/* Componentes das seções                                                     */
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
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface font-mono text-sm font-bold text-brand shadow-sm">
            B
          </span>
          <span className="font-sans text-base font-bold tracking-tight text-ink">
            Birth Hub <span className="text-brand">360º</span>
          </span>
        </a>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          <a
            href="#solucao"
            className="font-sans text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            Solução
          </a>
          <a
            href="#pilares"
            className="font-sans text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            Pilares
          </a>
          <a
            href="#cockpit"
            className="font-sans text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            Command Center
          </a>
          <a
            href="#faq"
            className="font-sans text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            FAQ
          </a>
        </nav>

        {/* Ações */}
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
          <a
            href={LOGIN_URL}
            className="hidden font-sans text-sm font-medium text-ink transition-colors hover:text-brand sm:inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            Entrar
          </a>
          <a href={LOGIN_URL} className={primaryCta}>
            <span>Acessar</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const magnetic = useMagnetic(0.2);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Grid técnico sutil no fundo */}
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
            <SectionLabel>Centro de comando da sua operação comercial</SectionLabel>
          </motion.div>
          <motion.h1
            id="hero-title"
            variants={staggerItem}
            className="mt-4 font-display text-5xl font-bold leading-[1.15] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            <RevealLine delay={0.15}>
              Dados que <span className="text-brand-ink dark:text-brand">Conectam.</span>
            </RevealLine>
            <RevealLine delay={0.3}>
              Inteligência que <span className="text-brand-ink dark:text-brand">Decide.</span>
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
              Conecte CRM, dados, processos e IA em um único Lugar.
            </p>
            <p className="font-mono text-sm text-ink-2">
              Monitore sua operação comercial em tempo real, identifique gargalos e transforme dados em ações executáveis.
            </p>
          </motion.div>
          <motion.div variants={staggerItem} className="mt-8 flex flex-wrap items-center gap-3">
            <motion.a
              href={LOGIN_URL}
              ref={magnetic.ref}
              animate={magnetic.disabled ? {} : { x: magnetic.position.x, y: magnetic.position.y }}
              className={primaryCta}
            >
              Explorar o Birth Hub
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

function StatsStrip() {
  return (
    <section className="border-y border-line bg-surface/60 py-10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          <div className="flex flex-col">
            <span className="font-display text-3xl font-bold text-ink sm:text-4xl">
              <CountUp to={20} suffix="+" />
            </span>
            <span className="mt-1 font-sans text-xs text-ink-2">Integrações conectadas</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl font-bold text-ink sm:text-4xl">
              <CountUp to={100} suffix="%" />
            </span>
            <span className="mt-1 font-sans text-xs text-ink-2">Monitoramento operacional</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl font-bold text-brand sm:text-4xl">
              <CountUp to={360} suffix="º" />
            </span>
            <span className="mt-1 font-sans text-xs text-ink-2">Visibilidade da receita</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl font-bold text-ink sm:text-4xl">
              <CountUp to={100} suffix="%" />
            </span>
            <span className="mt-1 font-sans text-xs text-ink-2">Dados governados</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const PILLARS_DATA = [
  {
    num: '01',
    slug: 'HUB',
    title: 'HUB COMERCIAL',
    desc: 'Centralização de contas, pipeline comercial unificado e visão 360° de cada oportunidade em negociação.',
    tag: 'Pipeline Central',
    focus: 'Gestão Unificada de Oportunidades',
    color: '#0284C7',
    symbol: '◉',
  },
  {
    num: '02',
    slug: 'INTEL',
    title: 'INTELIGÊNCIA DE MERCADO',
    desc: 'Enriquecimento analítico de dados B2B, sinais de compra, qualificação precisa e inteligência de decisores.',
    tag: 'Decisão por Dados',
    focus: 'Sinais & Qualificação Preditiva',
    color: '#2563EB',
    symbol: '◎',
  },
  {
    num: '03',
    slug: 'ORCH',
    title: 'ORQUESTRAÇÃO DE VENDAS',
    desc: 'Cadências multicanal coordenadas, regras de transição de bastão e alinhamento operacional de ponta a ponta.',
    tag: 'Fluxos Integrados',
    focus: 'Cadências & Passagem de Bastão',
    color: '#0EA5E9',
    symbol: '⟶',
  },
  {
    num: '04',
    slug: 'PERF',
    title: 'PERFORMANCE COMERCIAL',
    desc: 'Telemetria de conversão, velocidade de avanço no funil, metas operacionais e produtividade da equipe.',
    tag: 'Metas & Velocidade',
    focus: 'Métricas & Conversão em Tempo Real',
    color: '#16A34A',
    symbol: '▥',
  },
  {
    num: '05',
    slug: 'FORE',
    title: 'PREVISIBILIDADE COMERCIAL',
    desc: 'Modelagem estatística de probabilidade, análise de pipeline ponderado e cenários embasados no histórico real.',
    tag: 'Pipeline Ponderado',
    focus: 'Cenários & Probabilidade Real',
    color: '#D97706',
    symbol: '⌁',
  },
  {
    num: '06',
    slug: 'AI',
    title: 'INTELIGÊNCIA ARTIFICIAL',
    desc: 'Copiloto comercial ancorado nos dados da empresa, diagnóstico de entraves e suporte ativo em negociações.',
    tag: 'Copiloto & Modelos',
    focus: 'Agentes & Diagnóstico Contextual',
    color: '#7C3AED',
    symbol: '✦',
  },
  {
    num: '07',
    slug: 'AUTO',
    title: 'AUTOMAÇÃO & CONECTIVIDADE',
    desc: 'Sincronização contínua bidirecional, gatilhos de follow-up em tempo real e integração profunda com Bitrix24.',
    tag: 'Gatilhos & Bitrix24',
    focus: 'Integrações & Ações Instantâneas',
    color: '#EA580C',
    symbol: '◇',
  },
  {
    num: '08',
    slug: 'ENG',
    title: 'ENGAJAMENTO COMERCIAL',
    desc: 'Comunicação integrada, telefonia em nuvem, histórico de interações e rastreabilidade total de contatos.',
    tag: 'Voz & Omnichannel',
    focus: 'Telefonia & Registro de Contato',
    color: '#E11D48',
    symbol: '◌',
  },
] as const;

function Pillars() {
  return (
    <section id="pilares" className="py-20 sm:py-28">
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
                backgroundColor: '#FFFFFF',
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
                  <span
                    className="font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${p.color}12`,
                      color: p.color,
                    }}
                  >
                    {p.slug}
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
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-surface-2 text-ink-2">
                  Foco: {p.focus}
                </div>
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

function CockpitSection() {
  return (
    <section id="cockpit" className="border-t border-line bg-surface/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Visão 360 Graus</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            O centro de controle que seus líderes sempre pediram.
          </h2>
          <p className="mt-3 text-base text-ink-2">
            Métricas em tempo real, gargalos visíveis e ações recomendadas para coordenadores,
            gerentes e diretores de vendas.
          </p>
        </div>

        <div className="mt-12">
          <OrbitHub />
        </div>
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    q: 'Como o Birth Hub 360º se integra ao meu CRM atual?',
    a: 'O Birth Hub pode operar como seu CRM primário ou se conectar via APIs e webhooks a ferramentas legadas, atuando como o motor de inteligência e orquestração.',
  },
  {
    q: 'A IA toma decisões autônomas sem supervisão?',
    a: 'Não. Os agentes operam em níveis de autonomia configuráveis: desde sugestão com aprovação humana obrigatória até execução supervisionada com auditoria completa.',
  },
  {
    q: 'Qual o tempo médio de implementação?',
    a: 'Equipes começam a operar em menos de duas semanas com playbooks pré-configurados e suporte dedicado de onboarding.',
  },
  {
    q: 'Meus dados comerciais ficam protegidos?',
    a: 'Sim. Criptografia em trânsito e em repouso, isolamento por organização (multi-tenant com RLS) e conformidade com padrões de privacidade corporativos.',
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
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <SectionLabel>Dúvidas Frequentes</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Tudo o que você precisa saber para começar.
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

function FinalCta() {
  const magnetic = useMagnetic(0.2);

  return (
    <section className="border-t border-line bg-surface/50 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <SectionLabel>Comece Hoje</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Pronto para transformar sua operação de vendas?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-2">
          Acesse a plataforma e descubra como dados e inteligência podem gerar previsibilidade
          real para a sua receita.
        </p>
        <div className="mt-8 flex justify-center">
          <motion.a
            href={LOGIN_URL}
            ref={magnetic.ref}
            animate={magnetic.disabled ? {} : { x: magnetic.position.x, y: magnetic.position.y }}
            className={primaryCta}
          >
            <span>Acessar o Cockpit</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-surface font-mono text-xs font-bold text-brand shadow-sm">
              B
            </span>
            <span className="font-sans text-sm font-semibold text-ink">
              {BRAND.name}
            </span>
          </div>
          <p className="font-mono text-xs text-ink-2 text-center sm:text-right">
            {BRAND.credit}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/* Componente Principal: App                                                  */
/* -------------------------------------------------------------------------- */

export default function App() {
  // Tema com fallback seguro: se não houver preferência salva, adota 'light'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('birthhub_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
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

  return (
    <div className="min-h-screen bg-bg text-ink font-sans transition-colors duration-300">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content">
        <Hero />
        <StatsStrip />
        <Pillars />
        <CockpitSection />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
