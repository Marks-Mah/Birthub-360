import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { animate, motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Database,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Play,
  Eye,
  EyeOff,
  DatabaseZap,
  Target,
  Rocket,
  BrainCircuit,
  ArrowDown,
  ChevronDown,
} from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AnimatedBirthHubEmblem } from '../../../components/brand/AnimatedBirthHubEmblem.js';
import { BirthHubLogo } from '../../../components/brand/BirthHubLogo.js';
import { useAuth } from '../../../contexts/AuthContext.js';
import { authClient } from '../../../lib/auth-client.js';
import { EASE_OUT_EXPO, staggerContainer, staggerItem } from '../../../lib/motion.js';
import { SoundFX } from '../../../lib/soundEffects.js';

/** Linha do slogan: sobe de dentro de uma máscara (overflow-hidden) — entrada em cascata linha a linha. */
function RevealLine({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Número que conta de 0 até o valor final uma única vez (comunica a grandeza do indicador). Com
 *  movimento reduzido mostra o valor final direto. */
function CountUp({ to, suffix = '', delay = 0 }: { to: number; suffix?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : 0);
  useEffect(() => {
    if (reduceMotion) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.4,
      delay,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, delay, reduceMotion]);
  return (
    <span className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

const HERO_STATS = [
  { Icon: DatabaseZap, to: 50, suffix: '+', lines: ['Sistemas', 'Integrados'] },
  { Icon: BrainCircuit, to: 24, suffix: '/7', lines: ['Operação', 'Contínua'] },
  { Icon: Rocket, to: 100, suffix: '%', lines: ['Governança', 'de Dados'] },
  { Icon: Target, to: 360, suffix: '°', lines: ['Visão Da', 'Operação'] },
];

/**
 * Orbital SVG decorativo — 3 anéis concêntricos + 4 nós cardinais + núcleo "B".
 * Puramente SVG inline, sem imagens externas. Animação via CSS @keyframes injetado.
 */
export function CommandOrb({ size = 240 }: { size?: number }) {
  const reduceMotion = useReducedMotion();
  const r1 = size * 0.48; // outer ring radius
  const r2 = size * 0.32; // inner ring radius
  const center = size / 2;
  const nodeSize = 8;
  const nodes = [
    { x: center, y: center - r1, label: 'DADOS', color: '#1677ff' },
    { x: center + r1, y: center, label: 'INTELIGÊNCIA', color: '#c53678' },
    { x: center, y: center + r1, label: 'DECISÃO', color: '#d4af37' },
    { x: center - r1, y: center, label: 'EXECUÇÃO', color: '#0f9d64' },
  ];
  return (
    <>
      {/* Inject spin keyframe once per page — safe to repeat, browser deduplicates */}
      {!reduceMotion && (
        <style>{`
          @keyframes bh-orb-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      )}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        className="opacity-70"
      >
        {/* Outer ring — clockwise slow */}
        <circle
          cx={center}
          cy={center}
          r={r1}
          fill="none"
          stroke="rgba(212,175,55,0.18)"
          strokeWidth="1"
          strokeDasharray="4 8"
          style={
            reduceMotion
              ? {}
              : {
                transformOrigin: `${center}px ${center}px`,
                animation: 'bh-orb-spin 60s linear infinite',
              }
          }
        />
        {/* Inner ring — counter-clockwise */}
        <circle
          cx={center}
          cy={center}
          r={r2}
          fill="none"
          stroke="rgba(212,175,55,0.25)"
          strokeWidth="1"
          style={
            reduceMotion
              ? {}
              : {
                transformOrigin: `${center}px ${center}px`,
                animation: 'bh-orb-spin 40s linear infinite reverse',
              }
          }
        />
        {/* Center nucleus */}
        <circle cx={center} cy={center} r={28} fill="#0b132b" stroke="#d4af37" strokeWidth="1.5" />
        <text
          x={center}
          y={center + 7}
          textAnchor="middle"
          fill="#d4af37"
          fontSize="20"
          fontFamily="Sora, Cabin, sans-serif"
          fontWeight="700"
        >
          B
        </text>
        {/* Cardinal nodes */}
        {nodes.map((node) => (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r={nodeSize} fill={node.color} opacity="0.9" />
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeSize + 4}
              fill="none"
              stroke={node.color}
              strokeWidth="1"
              opacity="0.35"
            />
          </g>
        ))}
      </svg>
    </>
  );
}

/**
 * Duas telas em sequência (pedido do usuário): `view="welcome"` é a PRIMEIRA — apresentação da marca em
 * tela cheia, com o CTA para a segunda; `view="access"` é a SEGUNDA — só a tela de acesso (login /
 * cadastro). Antes as duas dividiam a tela ao meio e se atropelavam em larguras médias.
 */
export function LandingLoginSplitScreen({ view = 'access' }: { view?: 'welcome' | 'access' }) {
  const navigate = useNavigate();
  const { currentUser, isPending } = useAuth();

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);

  // Tabs for login panel
  const [activeTab, setActiveTab] = useState<'email' | 'sso'>('email');

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weekday = format(now, 'EEEE', { locale: ptBR });
  const dateLabel = `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${format(now, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
  const timeLabel = format(now, 'HH:mm');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Temporariamente desabilitado para permitir cadastro administrativo
    // if (!isAuthorizedLoginEmail(email)) {
    //   setError(
    //     'Acesso restrito. Utilize um e-mail corporativo autorizado do ecossistema Birth Hub 360°.',
    //   );
    //   setIsSubmitting(false);
    //   return;
    // }

    const result = isSignUp
      ? await authClient.signUp.email({
        email,
        password,
        name: name || email.split('@')[0],
        callbackURL: '/app',
      })
      : await authClient.signIn.email({ email, password, rememberMe, callbackURL: '/app' });

    if (result.error) {
      setError(result.error.message || 'Não foi possível autenticar. Verifique suas credenciais.');
      setIsSubmitting(false);
      return;
    }

    if (isSignUp && !result.data?.token) {
      setVerificationPending(true);
      setIsSubmitting(false);
      return;
    }
    window.location.href = '/hub';
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Temporariamente desabilitado para permitir cadastro administrativo
    // if (!isAuthorizedLoginEmail(email)) {
    //   setError('Acesso restrito. Utilize um e-mail corporativo autorizado.');
    //   setIsSubmitting(false);
    //   return;
    // }

    const result = await authClient.requestPasswordReset({ email, redirectTo: '/reset-password' });
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message || 'Não foi possível enviar o e-mail de redefinição.');
      return;
    }
    setForgotPasswordSent(true);
  };

  const backToSignIn = () => {
    setIsForgotPassword(false);
    setForgotPasswordSent(false);
    setVerificationPending(false);
    setError('');
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-brand w-8 h-8" aria-hidden="true" />
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/app" replace />;
  }

  // ─── Shared input class ────────────────────────────────────────────────────
  const inputCls =
    'w-full h-[44px] rounded-[10px] border border-[var(--line)] bg-[var(--surface)] ' +
    'px-4 font-mono text-sm text-[var(--ink)] placeholder-[var(--ink-2)]/50 ' +
    'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-colors';

  // ─── Split-screen Layout ───────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════════════
          TELA 1 — Boas-vindas: hero institucional (view="welcome")
          Full-width on welcome view; hidden on access view
      ══════════════════════════════════════════════════════════════════════ */}
      {view === 'welcome' && (
        <div
          className="relative flex w-full flex-col overflow-hidden px-6 pb-10 pt-6 sm:px-10 text-[#0B132B]"
          style={{
            background: 'linear-gradient(145deg, #FAF9F6 0%, #FFFFFF 50%, #F5F3EF 100%)',
          }}
        >
          {/* ── Subtle grid texture overlay ─────────────────────────────── */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                'linear-gradient(rgba(11,19,43,0.035) 1px, transparent 1px), ' +
                'linear-gradient(90deg, rgba(11,19,43,0.035) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />

          {/* ── Luminous Ambient Glows ──────────────────────────────────── */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            <div className="absolute top-[-8%] left-[-8%] w-[50%] h-[50%] rounded-full bg-[#D4AF37]/8 blur-[130px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1677FF]/6 blur-[130px]" />
          </div>

          {/* ── Navbar ─────────────────────────────────────────────────── */}
          <header className="relative z-20 flex items-center justify-between mb-12 sm:mb-16">
            <div className="flex shrink-0 items-center gap-3">
              <BirthHubLogo variant="horizontal" className="h-8 text-[#0B132B]" />
            </div>
            <nav className="hidden xl:flex items-center gap-3">
              {[
                { label: 'Soluções', color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
                { label: 'Recursos', color: '#C69B52', bg: 'rgba(198,155,82,0.1)' },
                { label: 'Segmentos', color: '#0B132B', bg: 'rgba(11,19,43,0.1)' },
                { label: 'Preços', color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
                { label: 'Conteúdo', color: '#C69B52', bg: 'rgba(198,155,82,0.1)' },
              ].map((item, i) => (
                <motion.button
                  key={item.label}
                  type="button"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                  whileHover={{ scale: 1.08, backgroundColor: item.bg }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-5 py-2.5 rounded-full border-2 text-sm font-bold tracking-wide text-[#0B132B] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                  style={{ borderColor: item.color }}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-4 whitespace-nowrap">
              <button
                type="button"
                className="flex items-center gap-1 text-xs font-semibold text-[#0B132B]/70"
              >
                <span className="w-4 h-4 rounded-full overflow-hidden inline-flex items-center justify-center bg-green-700 text-[8px] text-white">
                  BR
                </span>
                PT-BR
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              <motion.button
                type="button"
                onClick={() => {
                  SoundFX.play('click');
                  navigate('/login');
                }}
                whileHover={{ scale: 1.08, boxShadow: '0 8px 30px rgba(212,175,55,0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full border-2 border-[#D4AF37] bg-[#D4AF37] px-6 py-2.5 text-sm font-bold tracking-wide text-[#0B132B] shadow-lg hover:bg-[#dfba41] hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                Acessar Hub &rarr;
              </motion.button>
            </div>
          </header>

          {/* ── Hero Content ────────────────────────────────────────────── */}
          <div className="relative z-20 flex-1 flex flex-col justify-center max-w-xl">
            <motion.div
              initial="hidden"
              animate="show"
              variants={staggerContainer(0.1)}
              className="space-y-6"
            >
              {/* Eyebrow */}
              <motion.p
                variants={staggerItem}
                className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]"
              >
                Intelligent Business Command Center
              </motion.p>

              {/* Brand name — Natural, Prestigious, Authentic */}
              <motion.h1
                variants={staggerItem}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0B132B] leading-[1.08]"
              >
                Birth Hub <span className="text-[#D4AF37] font-semibold">360º</span>
              </motion.h1>

              {/* Tagline */}
              <motion.div
                variants={staggerItem}
                className="font-display text-2xl sm:text-3xl font-medium leading-snug"
              >
                <RevealLine delay={0.35}>
                  <span className="text-[#0B132B]">Dados que Conectam,</span>
                </RevealLine>
                <RevealLine delay={0.5}>
                  <span className="text-[#D4AF37]">Inteligência que decide,</span>
                </RevealLine>
                <RevealLine delay={0.65}>
                  <span className="text-[#C69B52]">Resultados que acontecem.</span>
                </RevealLine>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                variants={staggerItem}
                className="font-mono text-sm text-[#475569] max-w-md leading-relaxed"
              >
                O sistema operacional inteligente para operações de receita.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    SoundFX.play('confirm');
                    navigate('/login');
                  }}
                  className="group relative flex items-center gap-2.5 rounded-full bg-[#D4AF37] px-7 py-3.5 text-sm font-bold text-[#0B132B] shadow-[0_4px_22px_rgba(212,175,55,0.45)] transition-all duration-300 hover:bg-[#dfba41] hover:shadow-[0_8px_30px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Explorar o Birth Hub</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    SoundFX.play('click');
                    navigate('/login');
                  }}
                  className="flex items-center gap-3 text-sm font-semibold text-[#0B132B]/80 hover:text-brand transition-colors cursor-pointer"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0B132B]/15 bg-white shadow-xs">
                    <Play className="h-4 w-4 ml-0.5 text-[#0B132B]" />
                  </span>
                  Ver em 2 minutos
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* ── Mobile Animated Logo Centerpiece ──────────────────────── */}
          <div className="lg:hidden flex flex-col items-center justify-center my-8 z-20">
            <AnimatedBirthHubEmblem
              size={170}
              ctaText="Acessar Command Center →"
              onAction={() => {
                SoundFX.play('confirm');
                navigate('/login');
              }}
            />
          </div>

          {/* ── Stats Row ───────────────────────────────────────────────── */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer(0.09)}
            className="relative z-20 mt-12 grid max-w-xl grid-cols-2 gap-x-4 gap-y-6 border-t-2 border-[#D4AF37]/20 pt-8 sm:grid-cols-4"
          >
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.lines.join(' ')}
                variants={staggerItem}
                whileHover={{ scale: 1.05 }}
                className="transition-transform duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-2"
                >
                  <stat.Icon className="h-5 w-5 text-[#D4AF37]" />
                </motion.div>
                {/* Number — display font, gold */}
                <div className="font-display text-[32px] font-bold text-[#D4AF37] leading-none mb-1">
                  <CountUp to={stat.to} suffix={stat.suffix} delay={0.5 + i * 0.09} />
                </div>
                {/* Label — IBM Plex Mono, navy/60 */}
                <div className="font-mono text-[11px] font-bold text-[#0B132B] uppercase tracking-wider leading-tight">
                  {stat.lines[0]}
                  <br />
                  {stat.lines[1]}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Scroll indicator ────────────────────────────────────────── */}
          <div className="relative z-20 mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#0B132B]/40">
            <ArrowDown className="h-4 w-4 rounded-full border border-current p-0.5" />
            Role para explorar
          </div>

          {/* ── Interactive Orbital Centerpiece with Logo Animation & Call to Action ── */}
          <div
            className="absolute right-0 top-[85%] hidden h-[900px] w-[900px] -translate-y-1/2 lg:block z-20 pointer-events-auto"
            style={{ transform: 'translateY(-50%) translateX(-5%)' }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Outer decorative dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 rounded-full border-2 border-[#D4AF37]/30 border-dashed"
                style={{ willChange: 'transform' }}
              />
              {/* Inner ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[150px] rounded-full border-2 border-[#D4AF37]/40"
                style={{ willChange: 'transform' }}
              />
              {/* Middle ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[80px] rounded-full border border-[#D4AF37]/20"
                style={{ willChange: 'transform' }}
              />

              {/* Core interactive emblem with independent sunburst rotation & action CTA */}
              <div className="relative z-30 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <AnimatedBirthHubEmblem
                    size={360}
                    showCta={false}
                    onAction={() => {
                      SoundFX.play('confirm');
                      navigate('/login');
                    }}
                  />
                </motion.div>
                {/* CTA separado abaixo do logo */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  onClick={() => {
                    SoundFX.play('confirm');
                    navigate('/login');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#D4AF37] text-[#0B132B] text-sm font-bold font-mono tracking-wide shadow-[0_8px_24px_rgba(212,175,55,0.45)] border-2 border-[#D4AF37] hover:bg-[#dfba41] hover:shadow-[0_8px_30px_rgba(212,175,55,0.6)] transition-all duration-300 cursor-pointer"
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0B132B] opacity-80" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0B132B]" />
                  </span>
                  Acessar Command Center →
                </motion.button>
              </div>

              {/* Cardinal satellites */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute top-20 flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="w-16 h-16 rounded-full bg-[#0B132B] shadow-xl border-2 border-[#D4AF37] flex items-center justify-center mb-2"
                >
                  <DatabaseZap className="h-7 w-7 text-[#D4AF37]" />
                </motion.div>
                <span className="font-mono text-[12px] font-bold uppercase tracking-widest text-[#0B132B]">Dados</span>
                <span className="font-mono text-[10px] text-[#475569]">Integração 360°</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute bottom-32 flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="w-16 h-16 rounded-full bg-[#0B132B] shadow-xl border-2 border-[#C69B52] flex items-center justify-center mb-2"
                >
                  <Target className="h-7 w-7 text-[#C69B52]" />
                </motion.div>
                <span className="font-mono text-[12px] font-bold uppercase tracking-widest text-[#0B132B]">Decisão</span>
                <span className="font-mono text-[10px] text-[#475569]">Inteligência ativa</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute left-20 flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="w-16 h-16 rounded-full bg-[#0B132B] shadow-xl border-2 border-[#D4AF37] flex items-center justify-center mb-2"
                >
                  <Rocket className="h-7 w-7 text-[#D4AF37]" />
                </motion.div>
                <span className="font-mono text-[12px] font-bold uppercase tracking-widest text-[#0B132B]">Execução</span>
                <span className="font-mono text-[10px] text-[#475569]">Resultados reais</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute right-20 flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="w-16 h-16 rounded-full bg-[#0B132B] shadow-xl border-2 border-[#C69B52] flex items-center justify-center mb-2"
                >
                  <BrainCircuit className="h-7 w-7 text-[#C69B52]" />
                </motion.div>
                <span className="font-mono text-[12px] font-bold uppercase tracking-widest text-[#0B132B]">Inteligência</span>
                <span className="font-mono text-[10px] text-[#475569]">Operação 24/7</span>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TELA 2 — Acesso: formulário de login/cadastro (view="access")
      ══════════════════════════════════════════════════════════════════════ */}
      {view === 'access' && (
        <div className="flex-1 flex flex-col items-center justify-center relative bg-[var(--bg)] px-6 py-10 w-full">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate('/welcome')}
            className="absolute left-6 top-8 z-20 flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--ink-2)] transition-colors hover:text-brand sm:left-10"
          >
            &larr; Voltar
          </button>

          {/* Top-right date/status badge */}
          <div className="absolute top-8 right-10 flex items-center gap-4 whitespace-nowrap text-xs font-semibold text-[var(--ink-2)]">
            <div className="hidden items-center gap-2 md:flex font-mono">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateLabel} | {timeLabel}
            </div>
            <div className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-mono">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Sistema Operacional Online
            </div>
          </div>

          <div className="w-full max-w-md z-10">
            {/* ── Header ─────────────────────────────────────────────── */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            >
              {/* Logo mark */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-md mb-5">
                <BirthHubLogo variant="symbol" className="w-9 h-9" />
              </div>

              <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)] mb-1">
                Acesse sua conta
              </h2>
              <p className="font-mono text-[13px] text-[var(--ink-2)]">
                Central de Inteligência Comercial
              </p>
            </motion.div>

            {/* ── Form Card ───────────────────────────────────────────── */}
            <motion.div
              className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] shadow-lg shadow-black/5 p-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASE_OUT_EXPO }}
            >
              {/* Tabs */}
              <div className="flex border-b border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setActiveTab('email')}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors relative font-mono ${activeTab === 'email'
                    ? 'text-brand'
                    : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                    }`}
                >
                  E-mail corporativo
                  {activeTab === 'email' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sso')}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors relative font-mono ${activeTab === 'sso'
                    ? 'text-brand'
                    : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                    }`}
                >
                  SSO Empresarial
                  {activeTab === 'sso' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                    />
                  )}
                </button>
              </div>

              <div className="p-6 md:p-8">
                {verificationPending ? (
                  <div className="space-y-5 text-center">
                    <div className="flex items-start gap-2.5 rounded-xl border border-brand/30 bg-brand/5 p-3.5 text-left text-sm text-[var(--ink)]">
                      <Mail size={16} className="mt-0.5 shrink-0 text-brand" />
                      <p>
                        Enviamos um link de confirmação para <strong>{email}</strong>. Clique nele
                        para confirmar que este e-mail é seu e ativar sua conta.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={backToSignIn}
                      className="text-sm font-bold text-[var(--ink-2)] hover:text-brand transition-colors hover:underline"
                    >
                      Voltar para o login
                    </button>
                  </div>
                ) : isForgotPassword ? (
                  forgotPasswordSent ? (
                    <div className="space-y-5 text-center">
                      <div className="flex items-start gap-2.5 rounded-xl border border-brand/30 bg-brand/5 p-3.5 text-left text-sm text-[var(--ink)]">
                        <Mail size={16} className="mt-0.5 shrink-0 text-brand" />
                        <p>
                          Se <strong>{email}</strong> tiver uma conta, enviamos um link de
                          redefinição. O link expira em 1 hora.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={backToSignIn}
                        className="text-sm font-bold text-[var(--ink-2)] hover:text-brand transition-colors hover:underline"
                      >
                        Voltar para o login
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-5">
                      {error && (
                        <div className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                          <AlertCircle size={16} className="mt-0.5 shrink-0" />
                          <p>{error}</p>
                        </div>
                      )}
                      <p className="font-mono text-sm text-[var(--ink-2)]">
                        Informe o e-mail corporativo da sua conta. Se ele existir, enviaremos um
                        link para redefinição de senha.
                      </p>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-2)]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`${inputCls} pl-11`}
                          aria-label="E-mail"
                          placeholder="executivo@birthhub360.com.br"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="w-full h-[44px] rounded-[10px] bg-brand-active text-on-brand text-sm font-extrabold uppercase tracking-wide shadow-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin mx-auto h-5 w-5" />
                        ) : (
                          'Enviar link de redefinição'
                        )}
                      </button>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={backToSignIn}
                          className="text-sm font-bold text-[var(--ink-2)] hover:text-brand transition-colors hover:underline"
                        >
                          Voltar para o login
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <form onSubmit={handleAuth} className="space-y-5">
                    {error && (
                      <div className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    {isSignUp && (
                      <div>
                        <label htmlFor="login-name" className="block font-mono text-xs font-semibold text-[var(--ink-2)] mb-1.5 uppercase tracking-wide">
                          Nome completo
                        </label>
                        <input
                          id="login-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputCls}
                          aria-label="Nome completo"
                          placeholder="Seu Nome Completo"
                          required={isSignUp}
                        />
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Email field */}
                      <div>
                        <label htmlFor="login-email" className="block font-mono text-xs font-semibold text-[var(--ink-2)] mb-1.5 uppercase tracking-wide">
                          E-mail
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-2)]" />
                          <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`${inputCls} pl-11`}
                            aria-label="Credencial Institucional"
                            placeholder={
                              activeTab === 'sso'
                                ? 'seuemail@seudominio.com.br'
                                : 'executivo@birthhub360.com.br'
                            }
                            required
                          />
                        </div>
                      </div>

                      {/* Password field */}
                      <div>
                        <label htmlFor="login-password" className="block font-mono text-xs font-semibold text-[var(--ink-2)] mb-1.5 uppercase tracking-wide">
                          Senha
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-2)]" />
                          <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`${inputCls} pl-11 pr-11`}
                            aria-label="Senha"
                            placeholder="••••••••••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            aria-pressed={showPassword}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {!isSignUp && (
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer font-mono text-xs font-semibold text-[var(--ink-2)]">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-[var(--line)] text-brand focus:ring-brand w-4 h-4 bg-[var(--surface)]"
                          />
                          Manter sessão ativa
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setError('');
                          }}
                          className="font-mono text-xs font-bold text-[var(--ink-2)] hover:text-brand transition-colors"
                        >
                          Esqueci minha senha?
                        </button>
                      </div>
                    )}

                    {/* Primary CTA */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !email || !password}
                      className="w-full h-[44px] rounded-[10px] bg-brand-active text-on-brand text-sm font-extrabold uppercase tracking-wide shadow-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : isSignUp ? (
                        'Criar conta'
                      ) : (
                        <>ENTRAR NO BIRTH HUB &rarr;</>
                      )}
                    </button>
                  </form>
                )}

                {/* Toggle Login/Signup */}
                {!isForgotPassword && !verificationPending && (
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                        setName('');
                      }}
                      className="font-mono text-xs font-bold text-[var(--ink-2)] hover:text-brand transition-colors"
                    >
                      {isSignUp ? 'Já tem conta? Fazer login' : 'Não tem conta? Criar conta'}
                    </button>
                  </div>
                )}

                {/* SSO / Social integrations */}
                {!isSignUp && !isForgotPassword && !verificationPending && (
                  <div className="mt-8">
                    <div className="relative flex items-center justify-center mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--line)]" />
                      </div>
                      <span className="relative bg-[var(--surface)] px-3 font-mono text-[10px] uppercase tracking-widest font-bold text-[var(--ink-2)]">
                        ou continue com
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] py-2.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Google
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] py-2.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
                      >
                        <svg viewBox="0 0 21 21" className="w-4 h-4">
                          <path fill="#f25022" d="M0 0h10v10H0z" />
                          <path fill="#7fba00" d="M11 0h10v10H11z" />
                          <path fill="#00a4ef" d="M0 11h10v10H0z" />
                          <path fill="#ffb900" d="M11 11h10v10H11z" />
                        </svg>
                        Microsoft
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] py-2.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-brand" />
                        SSO
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── Trust Badges ─────────────────────────────────────────── */}
            <div className="mt-8">
              <div className="flex flex-wrap justify-center gap-4 font-mono text-[10px] font-bold text-[var(--ink-2)]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand" /> Acesso protegido
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand" /> Autenticação empresarial
                </span>
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-brand" /> Controle de permissões
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand" /> Conformidade LGPD
                </span>
              </div>
              <div className="mt-6 text-center font-mono text-[9px] uppercase tracking-widest font-bold text-[var(--ink-2)]">
                BIRTH HUB 360&deg; | CENTRO DE COMANDO PARA OPERAÇÕES DE RECEITA
                <div className="mt-1">v1.0.0</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
