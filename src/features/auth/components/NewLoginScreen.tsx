import React, { useEffect, useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext.js';
import { useTheme } from '../../../contexts/ThemeContext.js';
import { authClient } from '../../../lib/auth-client.js';
import { SoundFX } from '../../../lib/soundEffects.js';
import './NewLoginScreen.css';

// 8 Pilares do Birth Hub 360 com cores vibrantes e descrições operacionais completas
const PILLARS = [
  {
    id: '01',
    slug: 'HUB',
    label: 'Hub Comercial',
    desc: 'CRM centralizado, gestão de oportunidades e pipeline 360°',
    symbol: '◉',
    color: '#0284C7',
    tag: 'CRM Central',
  },
  {
    id: '02',
    slug: 'INTEL',
    label: 'Inteligência',
    desc: 'Analytics preditivo, enriquecimento e tomada de decisão',
    symbol: '◎',
    color: '#2563EB',
    tag: 'Decisão por Dados',
  },
  {
    id: '03',
    slug: 'ORCH',
    label: 'Orquestração',
    desc: 'Conexão ponta a ponta entre prospecção, vendas e pós-venda',
    symbol: '⟶',
    color: '#0EA5E9',
    tag: 'Fluxos Integrados',
  },
  {
    id: '04',
    slug: 'PERF',
    label: 'Performance',
    desc: 'Metas comerciais, taxas de conversão e velocidade de ciclo',
    symbol: '▥',
    color: '#16A34A',
    tag: 'KPIs & Metas',
  },
  {
    id: '05',
    slug: 'FORE',
    label: 'Previsibilidade',
    desc: 'Forecast probabilístico e projeções de faturamento real',
    symbol: '⌁',
    color: '#D97706',
    tag: 'Forecast Real',
  },
  {
    id: '06',
    slug: 'AI',
    label: 'Inteligência Artificial',
    desc: 'Copiloto comercial, enxame de agentes e automação cognitiva',
    symbol: '✦',
    color: '#7C3AED',
    tag: 'Copiloto & Agentes',
  },
  {
    id: '07',
    slug: 'AUTO',
    label: 'Automação',
    desc: 'Gatilhos em tempo real, réguas de follow-up e sincronização',
    symbol: '◇',
    color: '#EA580C',
    tag: 'Ações Autônomas',
  },
  {
    id: '08',
    slug: 'ENG',
    label: 'Engajamento',
    desc: 'Comunicação multicanal, telefonia integrada e voz ativa',
    symbol: '◌',
    color: '#E11D48',
    tag: 'Voz & Omnichannel',
  },
] as const;

// Pílulas/Tags dos componentes da plataforma
const BALLOONS = [
  { label: 'CRM', color: '#0284C7' },
  { label: 'Pipeline', color: '#2563EB' },
  { label: 'Inteligência', color: '#7C3AED' },
  { label: 'Forecast', color: '#D97706' },
  { label: 'Automação', color: '#16A34A' },
  { label: 'IA Copiloto', color: '#EF4444' },
  { label: 'Voz & Telefonia', color: '#0EA5E9' },
  { label: 'Engajamento', color: '#E11D48' },
];

function BH360LogoMark({ size = 56 }: { size?: number }) {
  const uid = useId().replace(/:/g, '');
  const reduceMotion = useReducedMotion();

  return (
    <svg
      className="logo-glow-light"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Birth Hub 360 — símbolo"
    >
      <defs>
        <linearGradient id={`mark-arc-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="55%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <radialGradient id={`mark-core-${uid}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
      </defs>

      {/* Anel orbital externo rotativo */}
      <motion.circle
        cx="128"
        cy="128"
        r="118"
        fill="none"
        stroke={`url(#mark-arc-${uid})`}
        strokeWidth="10"
        strokeDasharray="6 14"
        animate={!reduceMotion ? { rotate: 360 } : undefined}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '128px 128px' }}
      />
      {/* Núcleo */}
      <circle cx="128" cy="128" r="78" fill={`url(#mark-core-${uid})`} />
      {/* Anel interno cyan */}
      <circle cx="128" cy="128" r="64" fill="none" stroke="#38BDF8" strokeWidth="3" opacity="0.9" />
      {/* Linha equatorial */}
      <line x1="64" y1="128" x2="192" y2="128" stroke="#7DD3FC" strokeWidth="2" opacity="0.6" />
      {/* B Serifado */}
      <path
        fill="#FFFFFF"
        transform="matrix(0.0740 0 0 -0.0740 104.45 154.20)"
        d="M450.4 707Q574.2 707 627.9 670.8Q681.6 634.6 681.6 573.4Q681.6 520.8 646.8 476.7Q612 432.6 547 404.5Q482 376.4 391 370.8Q511 369.4 573.8 326.1Q636.6 282.8 636.6 218.2Q636.6 165.8 612.2 125.1Q587.8 84.4 543.2 56.4Q498.6 28.4 436 14.2Q373.4 0 297 0Q267.8 0 227.6 1.5Q187.4 3 121 3Q94.8 3 63.8 2.5Q32.8 2 3.7 1.5Q-25.4 1 -45 0L-41 20Q-7 22 12 28Q31 34 42 52Q53 70 62 106L194 602Q201.8 632.8 202.4 651.3Q203 669.8 188.5 678.5Q174 687.2 135 688L140 708Q159.6 707 188.2 706.5Q216.8 706 247.7 705.5Q278.6 705 303 705Q353.2 705 385.7 706Q418.2 707 450.4 707ZM266 359 270 376H339.2Q393.8 376 430.6 407.9Q467.4 439.8 486.2 490.8Q505 541.8 505 596.8Q505 636.6 491.5 662.3Q478 688 438.6 688Q413 688 401 674.1Q389 660.2 378 617L243 106Q238.2 86.4 235.7 67.1Q233.2 47.8 242.2 35.4Q251.2 23 278.8 23Q331.6 23 368.9 53.4Q406.2 83.8 426.6 132.9Q447 182 447 237.2Q447 270.4 437.2 297.9Q427.4 325.4 404.3 342.2Q381.2 359 341.6 359Z"
      />
    </svg>
  );
}

export function NewLoginScreen({ initialScreen = 'intro' }: { initialScreen?: 'intro' | 'login' }) {
  const [activeScreen, setActiveScreen] = useState<'intro' | 'login'>(initialScreen);
  const { currentUser, isPending: isAuthPending } = useAuth();
  const { theme, setThemeMode } = useTheme();
  const navigate = useNavigate();

  // Garante que o ambiente esteja exclusivamente no modo light conforme exigência do usuário
  useEffect(() => {
    if (theme !== 'light') {
      setThemeMode('light');
    }
    document.documentElement.classList.remove('dark');
  }, [theme, setThemeMode]);

  // Relógio e Calendário ao vivo
  const [currentDate, setCurrentDate] = useState(new Date());

  // Form State
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [authMethod, setAuthMethod] = useState<'email' | 'sso'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  // Efeito do Relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Redirecionamento se já autenticado
  useEffect(() => {
    if (currentUser) {
      navigate('/app', { replace: true });
    }
  }, [currentUser, navigate]);

  // Cálculos do relógio analógico
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  const daysArr = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
  const monthsArr = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const dayName = daysArr[currentDate.getDay()];
  const dayNum = String(currentDate.getDate()).padStart(2, '0');
  const monthName = monthsArr[currentDate.getMonth()];
  const yearNum = currentDate.getFullYear();
  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  const handlePillarClick = (id: string) => {
    SoundFX.play('click');
    setSelectedPillar(id === selectedPillar ? null : id);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail corporativo.');
      return;
    }

    if (authMode !== 'forgot' && !password.trim()) {
      setErrorMessage('Por favor, informe sua senha de acesso.');
      return;
    }

    setIsSubmitting(true);
    SoundFX.play('confirm');

    try {
      if (authMode === 'signin') {
        const result = await authClient.signIn.email({
          email: email.trim(),
          password: password.trim(),
          rememberMe,
          callbackURL: '/app',
        });

        if (result.error) {
          setErrorMessage(result.error.message || 'Credenciais inválidas. Tente novamente.');
          setIsSubmitting(false);
          return;
        }

        navigate('/app', { replace: true });
      } else if (authMode === 'signup') {
        const result = await authClient.signUp.email({
          email: email.trim(),
          password: password.trim(),
          name: name.trim() || email.split('@')[0],
          callbackURL: '/app',
        });

        if (result.error) {
          setErrorMessage(result.error.message || 'Erro ao solicitar acesso. Verifique os dados.');
          setIsSubmitting(false);
          return;
        }

        setSuccessMessage('Solicitação de provisionamento enviada com sucesso! Verifique seu e-mail.');
        setIsSubmitting(false);
      } else if (authMode === 'forgot') {
        const result = await authClient.requestPasswordReset({
          email: email.trim(),
          redirectTo: '/reset-password',
        });

        if (result.error) {
          setErrorMessage(result.error.message || 'Não foi possível enviar o link de redefinição.');
          setIsSubmitting(false);
          return;
        }

        setSuccessMessage('Link de redefinição de senha enviado para seu e-mail corporativo.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro inesperado ao processar.');
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'microsoft') => {
    SoundFX.play('click');
    (authClient.signIn as any)?.social({
      provider,
      callbackURL: '/app',
    });
  };

  if (isAuthPending) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0284C7] w-10 h-10" />
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A]">
      {/* ════════════════════════════════════════════════════════════════════
          TELA 1: COMMAND CENTER (INTRO) — MODO LIGHT EXCLUSIVO & CARDS COLORIDOS
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="screen-intro"
        className={`absolute inset-0 w-full h-full flex flex-col z-20 overflow-y-auto px-5 py-6 sm:px-10 lg:px-16 lg:py-10 transition-transform duration-700 ease-in-out ${
          activeScreen === 'intro' ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #EDF2F7 100%)',
        }}
      >
        {/* Grid estrutural em tom suave */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Halos sutis de profundidade em modo claro */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-[550px] h-[550px] z-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse at 70% 80%, rgba(2,132,199,0.09) 0%, transparent 65%)' }}
        />
        <div
          className="pointer-events-none absolute top-0 left-0 w-[450px] h-[450px] z-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse at 20% 10%, rgba(124,58,237,0.07) 0%, transparent 65%)' }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] z-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.05) 0%, transparent 70%)' }}
        />

        {/* Header: Logo BH360 + Marca */}
        <header className="relative z-20 flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3.5 group cursor-pointer">
            <BH360LogoMark size={56} />
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-2xl font-bold text-[#0F172A] leading-none tracking-tight">
                Birth Hub<span className="grad-text-blue ml-1 font-extrabold">360°</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#64748B] font-semibold">
                Command Center
              </span>
            </div>
          </div>

          {/* Quick CTA to Login */}
          <button
            type="button"
            onClick={() => {
              SoundFX.play('click');
              setActiveScreen('login');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#0F172A] font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:border-[#0284C7] hover:text-[#0284C7] cursor-pointer"
          >
            <span>Entrar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </header>

        {/* Status Bar: Live + Calendário + Relógio */}
        <div className="relative z-20 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full py-2">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A]" />
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#16A34A]">LIVE</span>
                <span className="w-px h-3.5 bg-slate-300" aria-hidden="true" />
                <span className="text-xs uppercase tracking-wider text-[#475569] font-semibold">
                  Sistema Operacional Online
                </span>
              </div>
            </div>

            {/* Calendário + Relógio em Estilo Light Nítido */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Calendário Card */}
              <div
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-sm transition-all hover:shadow-md"
              >
                <div className="text-center min-w-[38px]">
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-none">
                    {dayNum}
                  </div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#0284C7] mt-0.5">
                    {monthName}
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-left">
                  <div className="font-mono text-xs font-bold tracking-wider text-[#334155]">
                    {dayName}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-[11px] font-semibold text-[#0284C7] tracking-wider">
                      {yearNum}
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-[#64748B] font-bold">
                      BRT
                    </span>
                  </div>
                </div>
              </div>

              {/* Relógio Analógico + Digital */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 transition-transform duration-300 hover:scale-105">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                  <g stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="50" y1="7" x2="50" y2="13" stroke="#0284C7" strokeWidth="2.5" />
                    <line x1="50" y1="87" x2="50" y2="93" stroke="#0284C7" strokeWidth="2.5" />
                    <line x1="7" y1="50" x2="13" y2="50" stroke="#0284C7" strokeWidth="2.5" />
                    <line x1="87" y1="50" x2="93" y2="50" stroke="#0284C7" strokeWidth="2.5" />
                  </g>
                  {/* Ponteiro hora */}
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="28"
                    stroke="#0284C7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    transform={`rotate(${hourDeg} 50 50)`}
                  />
                  {/* Ponteiro minuto */}
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="18"
                    stroke="#7C3AED"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    transform={`rotate(${minuteDeg} 50 50)`}
                  />
                  {/* Ponteiro segundo */}
                  <line
                    x1="50"
                    y1="56"
                    x2="50"
                    y2="12"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    transform={`rotate(${secondDeg} 50 50)`}
                  />
                  <circle cx="50" cy="50" r="3.5" fill="#0284C7" />
                  <circle cx="50" cy="50" r="1.5" fill="#FFFFFF" />
                </svg>

                {/* Badge Digital */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-white border border-[#CBD5E1] shadow-xs">
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#0284C7] tracking-wider tabular-nums">
                    {timeString}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="status-line-light mt-2" />
        </div>

        {/* Hero Section */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest bg-sky-50 border border-sky-200 text-[#0284C7] shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Sistema Operacional Comercial
          </div>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.2]">
            Dados que <span className="grad-text-blue">Conectam.</span>
          </h1>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.2]">
            Inteligência que <span className="grad-text-purple">Decide.</span>
          </h1>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.2]">
            Resultados que <span className="grad-text-cyan">Acontecem.</span>
          </h1>

          <div className="mt-3 max-w-3xl space-y-1">
            <p className="font-display text-sm sm:text-base md:text-lg font-medium text-[#334155]">
              Conecte CRM, dados, processos e inteligência artificial em um único ecossistema.
            </p>
            <p className="font-sans text-xs sm:text-sm text-[#64748B]">
              Monitore sua operação comercial em tempo real, identifique gargalos e transforme dados em ações executáveis.
            </p>
          </div>

          {/* Seção de Pílulas / Balloons Coloridos */}
          <div className="my-3 w-full max-w-4xl">
            <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center items-center">
              {BALLOONS.map((b) => (
                <div
                  key={b.label}
                  className="balloon-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border shadow-xs cursor-pointer"
                  style={{
                    backgroundColor: `${b.color}10`,
                    borderColor: `${b.color}40`,
                    color: b.color,
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divisor 8 Pilares */}
          <div className="flex items-center gap-4 my-2 w-full max-w-5xl">
            <div className="h-px flex-1 bg-gradient-to-r from-[#0284C7]/40 to-transparent" />
            <span className="font-mono text-xs sm:text-sm text-[#475569] font-bold uppercase tracking-widest whitespace-nowrap">
              8 pilares integrados da plataforma
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-[#7C3AED]/40 to-transparent" />
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              GRID DOS 8 PILARES — CARDS COLORIDOS DESTACADOS
          ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4.5 w-full max-w-6xl mx-auto my-3 text-left">
            {PILLARS.map((p) => {
              const isActive = selectedPillar === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handlePillarClick(p.id)}
                  className={`pillar-card group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl cursor-pointer border transition-all duration-300 ${
                    isActive ? 'pillar-card-active' : ''
                  }`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: isActive ? p.color : `${p.color}55`,
                    borderWidth: isActive ? '2px' : '1.5px',
                    boxShadow: isActive
                      ? `0 0 0 3px ${p.color}25, 0 12px 28px -4px ${p.color}35`
                      : `0 4px 16px -2px rgba(15, 23, 42, 0.05), 0 2px 8px -2px ${p.color}20`,
                  }}
                >
                  {/* Barra de destaque colorida no topo do card */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl transition-all duration-300 group-hover:h-2"
                    style={{
                      background: `linear-gradient(90deg, ${p.color} 0%, ${p.color}88 100%)`,
                    }}
                  />

                  {/* Header do Card: Número + Slug + Símbolo */}
                  <div className="flex items-center justify-between mb-3 pt-1">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${p.color}15`,
                          color: p.color,
                          border: `1px solid ${p.color}35`,
                        }}
                      >
                        {p.id}
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

                  {/* Corpo do Card: Título em destaque + Descrição */}
                  <div className="flex-1 my-1">
                    <h3 className="font-display text-sm sm:text-base font-bold text-[#0F172A] leading-tight mb-1 group-hover:text-black">
                      {p.label}
                    </h3>
                    <p className="font-sans text-xs text-[#64748B] leading-snug">
                      {p.desc}
                    </p>
                  </div>

                  {/* Rodapé do Card: Tag operacional + Indicador ativo */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: p.color }} />
                      <span
                        className="font-mono text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: p.color }}
                      >
                        {p.tag}
                      </span>
                    </div>
                    <span
                      className="font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                      style={{ color: p.color }}
                    >
                      EXPLORAR →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Principal: Acessar Plataforma */}
          <div className="mt-4 text-center relative z-20">
            <button
              id="btn-go-login"
              type="button"
              onClick={() => {
                SoundFX.play('confirm');
                setActiveScreen('login');
              }}
              className="btn-cta-light group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-mono text-base font-bold uppercase tracking-widest cursor-pointer"
            >
              <span>Acessar Plataforma</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Footer Institucional */}
        <div className="relative z-20 pt-4 mt-auto text-center border-t border-slate-200 w-full max-w-6xl mx-auto">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#94A3B8]">
            Birth Hub 360° · Sistema Operacional para Operações Comerciais Inteligentes
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TELA 2: LOGIN — MODO LIGHT EXCLUSIVO & EXPERIÊNCIA ENTERPRISE
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="screen-login"
        className={`absolute inset-0 w-full h-full flex flex-col items-center justify-start transition-transform duration-700 ease-in-out z-30 bg-[#F8FAFC] px-5 py-8 sm:px-10 lg:px-16 overflow-y-auto ${
          activeScreen === 'login' ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #EDF2F7 100%)',
        }}
      >
        {/* Botão Voltar */}
        <button
          id="btn-back"
          type="button"
          onClick={() => {
            SoundFX.play('click');
            setActiveScreen('intro');
          }}
          className="absolute top-6 left-6 sm:top-8 sm:left-10 text-[#475569] hover:text-[#0284C7] transition-colors flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest z-40 group cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Voltar ao Início</span>
        </button>

        {/* Ambient Glows no fundo */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute top-[10%] right-[15%] w-[450px] h-[450px] rounded-full blur-[100px]"
            style={{ background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full blur-[100px]"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)' }}
          />
        </div>

        {/* Barra de Status Superior */}
        <div className="w-full max-w-[480px] flex items-center justify-center mb-6 relative z-10 pt-4 sm:pt-0">
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#334155]">
              Birth Hub · <span className="text-[#0284C7]">v4.2 Enterprise</span>
            </span>
          </div>
        </div>

        {/* Container do Card Central de Login */}
        <div className="w-full max-w-[480px] z-10 mb-8">
          {/* Header do Card */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest mb-3.5 bg-sky-50 border border-sky-200 text-[#0284C7] shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
              Acesso Seguro · Zero Trust Architecture
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2 leading-tight">
              {authMode === 'signup'
                ? 'Criar conta corporativa'
                : authMode === 'forgot'
                ? 'Redefinir Senha'
                : 'Acessar conta'}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#64748B] font-medium max-w-[380px] mx-auto leading-relaxed">
              {authMode === 'signup'
                ? 'Preencha suas informações corporativas para solicitar acesso.'
                : authMode === 'forgot'
                ? 'Informe seu e-mail corporativo para receber o link de recuperação.'
                : 'Central de inteligência comercial, previsibilidade e governança integrada.'}
            </p>
          </div>

          {/* Card Principal em Superfície Branca Impecável */}
          <div className="card-glow-light rounded-2xl p-6 sm:p-8 relative">
            {/* Abas E-mail vs SSO */}
            {authMode === 'signin' && (
              <div className="tab-segmented-container-light grid grid-cols-2 gap-1.5 mb-6" role="tablist">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`tab-segmented-btn-light py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    authMethod === 'email' ? 'active' : ''
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>E-mail Corporativo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('sso')}
                  className={`tab-segmented-btn-light py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    authMethod === 'sso' ? 'active' : ''
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>SSO Empresarial</span>
                </button>
              </div>
            )}

            {/* Alertas de Erro / Sucesso */}
            {errorMessage && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 transition-all">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
                <p className="font-medium font-sans">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 transition-all">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                <p className="font-medium font-sans">{successMessage}</p>
              </div>
            )}

            {/* Formulário de Acesso */}
            <form onSubmit={handleAuthSubmit} className="space-y-4" noValidate>
              {/* Nome (Apenas em Cadastro) */}
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label htmlFor="login-name" className="block font-mono text-xs font-bold text-[#475569] uppercase tracking-wider">
                    Nome Completo
                  </label>
                  <input
                    id="login-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="app-input-pro px-4"
                    placeholder="Ex: Carlos Mendes"
                    autoComplete="name"
                  />
                </div>
              )}

              {/* E-mail Corporativo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-email" className="block font-mono text-xs font-bold text-[#475569] uppercase tracking-wider">
                    {authMethod === 'sso' ? 'E-mail ou Domínio SSO' : 'E-mail Corporativo'}
                  </label>
                  <span className="font-mono text-[10px] text-[#94A3B8]">Domínio empresarial</span>
                </div>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8] group-focus-within:text-[#0284C7] transition-colors duration-200" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="app-input-pro pl-12 pr-4"
                    placeholder={authMethod === 'sso' ? 'usuario@empresa.com.br' : 'diretor@suaempresa.com.br'}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Senha */}
              {authMode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className="block font-mono text-xs font-bold text-[#475569] uppercase tracking-wider">
                      Senha de Acesso
                    </label>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8] group-focus-within:text-[#0284C7] transition-colors duration-200" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="app-input-pro pl-12 pr-12"
                      placeholder="••••••••••••"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0F172A] transition-colors focus:outline-none cursor-pointer"
                      aria-label="Mostrar ou ocultar senha"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Opções: Lembrar de mim & Esqueci senha */}
              {authMode === 'signin' && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-[#64748B] select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7] accent-[#0284C7] cursor-pointer"
                    />
                    <span>Manter conectado</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="font-sans text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              )}

              {/* Botão Principal de Login */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-cta-light w-full h-[52px] rounded-xl font-mono text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    <span>
                      {authMode === 'signup'
                        ? 'Solicitar Provisionamento'
                        : authMode === 'forgot'
                        ? 'Enviar Link de Redefinição'
                        : 'Entrar no Birth Hub'}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-white" />
                  </>
                )}
              </button>
            </form>

            {/* Alternância de Modo (Cadastro / Login / Esqueci) */}
            <div className="mt-5 text-center">
              {authMode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-sans text-xs text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  Não possui credenciais corporativas?{' '}
                  <span className="font-bold text-[#0284C7] hover:underline">Solicitar acesso</span>
                </button>
              )}

              {authMode === 'signup' && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-sans text-xs text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  Já possui credenciais corporativas?{' '}
                  <span className="font-bold text-[#0284C7] hover:underline">Fazer login</span>
                </button>
              )}

              {authMode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-sans text-xs text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  Voltar para{' '}
                  <span className="font-bold text-[#0284C7] hover:underline">Login Corporativo</span>
                </button>
              )}
            </div>

            {/* Provedores SSO */}
            {authMode === 'signin' && (
              <div className="mt-6">
                <div className="relative flex items-center justify-center mb-4">
                  <div className="w-full border-t border-slate-200" />
                  <span className="absolute bg-white px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[#94A3B8]">
                    ou acesse com
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="btn-social-light flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-mono font-bold cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Microsoft */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('microsoft')}
                    className="btn-social-light flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-mono font-bold cursor-pointer"
                  >
                    <svg viewBox="0 0 21 21" className="w-4 h-4 shrink-0">
                      <path fill="#f25022" d="M0 0h10v10H0z" />
                      <path fill="#7fba00" d="M11 0h10v10H11z" />
                      <path fill="#00a4ef" d="M0 11h10v10H0z" />
                      <path fill="#ffb900" d="M11 11h10v10H11z" />
                    </svg>
                    <span>Microsoft</span>
                  </button>

                  {/* SAML SSO */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('sso');
                      SoundFX.play('click');
                    }}
                    className="btn-social-light flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-mono font-bold cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#7C3AED] shrink-0" />
                    <span>SAML SSO</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Badges de Confiança & Segurança Enterprise */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="trust-badge-light flex items-center gap-2 p-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
              <div className="min-w-0">
                <div className="font-mono text-[10px] font-bold text-[#0F172A] truncate">AES-256</div>
                <div className="font-sans text-[9px] text-[#64748B] truncate">Criptografado</div>
              </div>
            </div>
            <div className="trust-badge-light flex items-center gap-2 p-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
              <div className="min-w-0">
                <div className="font-mono text-[10px] font-bold text-[#0F172A] truncate">SSO & MFA</div>
                <div className="font-sans text-[9px] text-[#64748B] truncate">Autenticação</div>
              </div>
            </div>
            <div className="trust-badge-light flex items-center gap-2 p-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED] shrink-0" />
              <div className="min-w-0">
                <div className="font-mono text-[10px] font-bold text-[#0F172A] truncate">LGPD/GDPR</div>
                <div className="font-sans text-[9px] text-[#64748B] truncate">Conformidade</div>
              </div>
            </div>
            <div className="trust-badge-light flex items-center gap-2 p-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
              <div className="min-w-0">
                <div className="font-mono text-[10px] font-bold text-[#0F172A] truncate">99.99%</div>
                <div className="font-sans text-[9px] text-[#64748B] truncate">Uptime SLA</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
