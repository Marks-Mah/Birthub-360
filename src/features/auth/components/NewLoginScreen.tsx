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
  Moon,
  Sun,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext.js';
import { useTheme } from '../../../contexts/ThemeContext.js';
import { authClient } from '../../../lib/auth-client.js';
import { SoundFX } from '../../../lib/soundEffects.js';
import './NewLoginScreen.css';

// 8 Pilares do Birth Hub 360
const PILLARS = [
  { id: '01', slug: 'HUB', label: 'Hub Comercial', symbol: '◉', color: '#00E5FF' },
  { id: '02', slug: 'INTEL', label: 'Inteligência', symbol: '◎', color: '#3B82F6' },
  { id: '03', slug: 'ORCH', label: 'Orquestração', symbol: '⟶', color: '#33EBFF' },
  { id: '04', slug: 'PERF', label: 'Performance', symbol: '▥', color: '#22C55E' },
  { id: '05', slug: 'FORE', label: 'Previsibilidade', symbol: '⌁', color: '#F59E0B' },
  { id: '06', slug: 'AI', label: 'Inteligência Artificial', symbol: '✦', color: '#8B5CF6' },
  { id: '07', slug: 'AUTO', label: 'Automação', symbol: '◇', color: '#64748B' },
  { id: '08', slug: 'ENG', label: 'Engajamento', symbol: '◌', color: '#94A3B8' },
] as const;

const BALLOONS = [
  { label: 'CRM', color: '#00E5FF' },
  { label: 'Pipeline', color: '#3B82F6' },
  { label: 'Inteligência', color: '#8B5CF6' },
  { label: 'Forecast', color: '#F59E0B' },
  { label: 'Automação', color: '#22C55E' },
  { label: 'IA', color: '#EF4444' },
  { label: 'Voz', color: '#33EBFF' },
  { label: 'Engajamento', color: '#94A3B8' },
];

function BH360LogoMark({ size = 72 }: { size?: number }) {
  const uid = useId().replace(/:/g, '');
  const reduceMotion = useReducedMotion();

  return (
    <svg
      className="logo-glow"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Birth Hub 360 — símbolo"
    >
      <defs>
        <linearGradient id={`mark-arc-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="55%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <radialGradient id={`mark-core-${uid}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#1B2B64" />
          <stop offset="100%" stopColor="#0B132B" />
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
      {/* Anel interno dourado/cyan */}
      <circle cx="128" cy="128" r="64" fill="none" stroke="#00E5FF" strokeWidth="3" opacity="0.8" />
      {/* Linha equatorial */}
      <line x1="64" y1="128" x2="192" y2="128" stroke="#33EBFF" strokeWidth="2" opacity="0.45" />
      {/* B Serifado */}
      <path
        fill="#ffffff"
        transform="matrix(0.0740 0 0 -0.0740 104.45 154.20)"
        d="M450.4 707Q574.2 707 627.9 670.8Q681.6 634.6 681.6 573.4Q681.6 520.8 646.8 476.7Q612 432.6 547 404.5Q482 376.4 391 370.8Q511 369.4 573.8 326.1Q636.6 282.8 636.6 218.2Q636.6 165.8 612.2 125.1Q587.8 84.4 543.2 56.4Q498.6 28.4 436 14.2Q373.4 0 297 0Q267.8 0 227.6 1.5Q187.4 3 121 3Q94.8 3 63.8 2.5Q32.8 2 3.7 1.5Q-25.4 1 -45 0L-41 20Q-7 22 12 28Q31 34 42 52Q53 70 62 106L194 602Q201.8 632.8 202.4 651.3Q203 669.8 188.5 678.5Q174 687.2 135 688L140 708Q159.6 707 188.2 706.5Q216.8 706 247.7 705.5Q278.6 705 303 705Q353.2 705 385.7 706Q418.2 707 450.4 707ZM266 359 270 376H339.2Q393.8 376 430.6 407.9Q467.4 439.8 486.2 490.8Q505 541.8 505 596.8Q505 636.6 491.5 662.3Q478 688 438.6 688Q413 688 401 674.1Q389 660.2 378 617L243 106Q238.2 86.4 235.7 67.1Q233.2 47.8 242.2 35.4Q251.2 23 278.8 23Q331.6 23 368.9 53.4Q406.2 83.8 426.6 132.9Q447 182 447 237.2Q447 270.4 437.2 297.9Q427.4 325.4 404.3 342.2Q381.2 359 341.6 359Z"
      />
    </svg>
  );
}

export function NewLoginScreen({ initialScreen = 'intro' }: { initialScreen?: 'intro' | 'login' }) {
  const [activeScreen, setActiveScreen] = useState<'intro' | 'login'>(initialScreen);
  const { currentUser, isPending: isAuthPending } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

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

  const daysArr = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
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
    // Chama o authClient para autenticação social
    (authClient.signIn as any)?.social({
      provider,
      callbackURL: '/app',
    });
  };

  if (isAuthPending) {
    return (
      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00E5FF] w-10 h-10" />
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0B132B]">
      {/* ════════════════════════════════════════════════════════════════════
          TELA 1: COMMAND CENTER (INTRO)
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="screen-intro"
        className={`absolute inset-0 w-full h-full flex flex-col z-20 overflow-y-auto px-6 py-8 sm:px-10 lg:px-20 lg:py-12 transition-transform duration-700 ease-in-out ${
          activeScreen === 'intro' ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0B132B 50%, #0d1535 100%)' }}
      >
        {/* Grid estrutural de fundo */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,229,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.07) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        {/* Halos luminosos */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] z-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse at 70% 80%, rgba(0,229,255,0.22) 0%, transparent 62%)' }}
        />
        <div
          className="pointer-events-none absolute top-0 left-0 w-[400px] h-[400px] z-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse at 20% 10%, rgba(139,92,246,0.28) 0%, transparent 62%)' }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] z-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.10) 0%, transparent 70%)' }}
        />

        {/* Animação de fluxo de dados */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-60" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" strokeDasharray="2 2">
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="4s" repeatCount="indefinite" />
            </line>
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" strokeDasharray="3 3">
              <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="6s" repeatCount="indefinite" />
            </line>
            <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" strokeDasharray="2 4">
              <animate attributeName="stroke-dashoffset" from="0" to="-25" dur="5s" repeatCount="indefinite" />
            </line>
          </svg>
        </div>

        {/* Header: Logo BH360 + Marca */}
        <header className="relative z-20 flex items-center justify-between mb-8 sm:mb-10">
          <div className="flex items-center gap-4 group cursor-pointer">
            <BH360LogoMark size={64} />
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-2xl font-bold text-white leading-none tracking-tight">
                Birth Hub<span className="grad-text glow-text ml-1">360°</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
                Command Center
              </span>
            </div>
          </div>
        </header>

        {/* Status Bar ao vivo */}
        <div className="relative z-20 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full py-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E] shadow-[0_0_10px_#22C55E]" />
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#22C55E]">LIVE</span>
                <span className="w-px h-3.5 bg-white/20" aria-hidden="true" />
                <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">Sistema Online</span>
              </div>
            </div>

            {/* Calendário + Relógio Ampliados e Sofisticados */}
            <div className="flex items-center gap-4">
              {/* Calendário High-Tech Ampliado */}
              <div
                id="calendar-widget"
                className="flex items-center gap-4 px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
                  border: '1.5px solid rgba(0, 229, 255, 0.35)',
                  boxShadow: '0 0 25px rgba(0, 229, 255, 0.12), inset 0 0 15px rgba(0, 229, 255, 0.04)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="text-center min-w-[42px]">
                  <div
                    id="cal-day"
                    className="font-display text-3xl lg:text-4xl font-extrabold text-white leading-none"
                    style={{ textShadow: '0 0 15px rgba(0, 229, 255, 0.7)' }}
                  >
                    {dayNum}
                  </div>
                  <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#00E5FF] mt-1">
                    {monthName}
                  </div>
                </div>
                <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/25 to-transparent" />
                <div className="text-left">
                  <div className="font-mono text-xs lg:text-sm font-bold tracking-wider text-white">
                    {dayName}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-[11px] font-semibold text-[#38BDF8] tracking-widest">
                      {yearNum}
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/60 font-medium">
                      BRT
                    </span>
                  </div>
                </div>
              </div>

              {/* Relógio Analógico + Digital Ampliado */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 transition-transform duration-300 hover:scale-105">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0, 229, 255, 0.45)" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="45" fill="rgba(6, 13, 26, 0.7)" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.5" />
                  <g stroke="rgba(0, 229, 255, 0.7)" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="50" y1="7" x2="50" y2="13" stroke="#00E5FF" strokeWidth="2.5" />
                    <line x1="50" y1="87" x2="50" y2="93" stroke="#00E5FF" strokeWidth="2.5" />
                    <line x1="7" y1="50" x2="13" y2="50" stroke="#00E5FF" strokeWidth="2.5" />
                    <line x1="87" y1="50" x2="93" y2="50" stroke="#00E5FF" strokeWidth="2.5" />
                  </g>
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="28"
                    stroke="#00E5FF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.8))' }}
                    transform={`rotate(${hourDeg} 50 50)`}
                  />
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="18"
                    stroke="#8B5CF6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.8))' }}
                    transform={`rotate(${minuteDeg} 50 50)`}
                  />
                  <line
                    x1="50"
                    y1="56"
                    x2="50"
                    y2="12"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px #EF4444)' }}
                    transform={`rotate(${secondDeg} 50 50)`}
                  />
                  <circle cx="50" cy="50" r="4" fill="#00E5FF" style={{ filter: 'drop-shadow(0 0 8px #00E5FF)' }} />
                  <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
                </svg>

                {/* Display Digital Integrado */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#0B132B]/95 border border-[#00E5FF]/40 shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#00E5FF] tracking-wider tabular-nums">
                    {timeString}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="status-line h-px w-full bg-gradient-to-r from-[#00E5FF]/70 via-[#8B5CF6]/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center gap-3.5 mb-6">
          <p className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#00E5FF] glow-text">
            Sistema Operacional Comercial
          </p>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] xl:text-[2.75rem] 2xl:text-[3.25rem] font-bold tracking-tight text-white leading-[1.25] hero-line typing-done">
            Dados que <span className="grad-text glow-text color-percolate">Conectam.</span>
          </h1>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] xl:text-[2.75rem] 2xl:text-[3.25rem] font-bold tracking-tight text-white leading-[1.25] hero-line typing-done">
            Inteligência que{' '}
            <span
              className="bg-clip-text text-transparent color-percolate"
              style={{
                backgroundImage: 'linear-gradient(90deg, #8B5CF6 0%, #3B82F6 55%, #00E5FF 100%)',
                filter: 'drop-shadow(0 0 20px rgba(139,92,246,.7)) drop-shadow(0 0 40px rgba(139,92,246,.4))',
              }}
            >
              Decide.
            </span>
          </h1>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] xl:text-[2.75rem] 2xl:text-[3.25rem] font-bold tracking-tight text-white leading-[1.25] hero-line typing-done">
            Resultados que <span className="grad-text glow-text color-percolate">Acontecem.</span>
          </h1>

          <div className="hero-subtext-container mt-4 max-w-3xl">
            <p className="font-display text-base lg:text-lg font-light text-white/70 tracking-normal" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
              Conecte CRM, dados, processos e IA em um único Lugar.
            </p>
            <p className="font-display text-base lg:text-lg font-light text-white/70 tracking-normal" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
              Monitore sua operação comercial em tempo real, identifique gargalos e transforme dados em ações executáveis.
            </p>
          </div>

          {/* Balloon Section */}
          <div className="balloon-container my-4">
            <div className="flex flex-wrap gap-3 justify-center items-center">
              {BALLOONS.map((b, idx) => (
                <React.Fragment key={b.label}>
                  <span
                    className="balloon-item font-mono text-xs font-bold tracking-wider cursor-pointer transition-all duration-300"
                    style={{ color: b.color }}
                  >
                    {b.label}
                  </span>
                  {idx < BALLOONS.length - 1 && <span className="text-white/30">·</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="font-mono text-[10px] text-white/60 text-center mt-3 tracking-wide" style={{ textShadow: '0 0 15px rgba(255,255,255,0.4)' }}>
              Oito pilares. Um sistema operacional comercial integrado.
            </p>
          </div>

          {/* Divisor 8 Pilares */}
          <div className="flex items-center gap-4 my-2 w-full max-w-5xl">
            <div className="status-line h-px flex-1 bg-gradient-to-r from-[#00E5FF]/60 to-transparent" />
            <span className="font-mono text-xs sm:text-sm text-white/40 uppercase tracking-widest whitespace-nowrap">
              8 pilares integrados
            </span>
            <div className="status-line h-px flex-1 bg-gradient-to-l from-[#8B5CF6]/40 to-transparent" />
          </div>

          {/* Grid dos 8 Pilares */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-6xl mx-auto my-4">
            {PILLARS.map((p) => {
              const isActive = selectedPillar === p.id;
              return (
                <div
                  key={p.id}
                  className={`pillar-item group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer overflow-hidden transition-all duration-300 ${
                    isActive ? 'pillar-active' : ''
                  }`}
                  style={{ color: p.color }}
                  onClick={() => handlePillarClick(p.id)}
                >
                  <div
                    className="pillar-bg absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `linear-gradient(90deg, ${p.color}26 0%, transparent 80%)` }}
                  />
                  <span
                    className="pillar-border pillar-bar absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-25 group-hover:opacity-100 scale-y-50 group-hover:scale-y-100 transition-all duration-300"
                    style={{ background: p.color }}
                  />
                  <span className="pillar-number font-mono text-xs font-bold tracking-widest opacity-40 w-5 shrink-0 text-right" style={{ color: p.color }}>
                    {p.id}
                  </span>
                  <span className="pillar-symbol pillar-glow text-lg w-4 shrink-0 text-center transition-transform duration-300" style={{ color: p.color }}>
                    {p.symbol}
                  </span>
                  <span className="flex items-baseline gap-2 min-w-0">
                    <span className="font-sans text-sm sm:text-base font-semibold text-white/60 group-hover:text-white transition-colors leading-tight">
                      {p.label}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline" style={{ color: p.color }}>
                      {p.slug}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Call to Action: Acessar Plataforma */}
          <div className="mt-6 text-center relative z-20">
            <button
              id="btn-go-login"
              type="button"
              onClick={() => {
                SoundFX.play('confirm');
                setActiveScreen('login');
              }}
              className="btn-primary group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-mono text-base font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_50px_rgba(0,229,255,0.5)] transition-all cursor-pointer"
            >
              <span>Acessar Plataforma</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Footer Institucional */}
        <div className="relative z-20 pt-4 mt-auto text-center border-t border-white/10 w-full max-w-6xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            Birth Hub 360° · Sistema Operacional para Operações Comerciais
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TELA 2: LOGIN 
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="screen-login"
        className={`absolute inset-0 w-full h-full flex flex-col items-center justify-start transition-transform duration-700 ease-in-out z-30 bg-[#0B132B] px-6 py-10 lg:px-12 overflow-y-auto ${
          activeScreen === 'login' ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0B132B 50%, #0d1535 100%)' }}
      >
        {/* Botão Voltar */}
        <button
          id="btn-back"
          type="button"
          onClick={() => {
            SoundFX.play('click');
            setActiveScreen('intro');
          }}
          className="absolute top-6 left-6 sm:top-10 sm:left-10 text-[var(--ink-2)] hover:text-[#00E5FF] transition-colors flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest z-40 group cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Voltar
        </button>

        {/* Multi-camadas de ambient glow ao fundo */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div className="right-glow-orb-1 absolute top-[10%] right-[15%] w-[450px] h-[450px] rounded-full blur-[90px]" style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 70%)' }} />
          <div className="right-glow-orb-2 absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
          <div className="right-glow-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[110px]" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 75%)' }} />
          <div className="particle" style={{ top: '20%', left: '30%', animationDelay: '0s' }} />
          <div className="particle" style={{ top: '60%', left: '70%', animationDelay: '1.5s' }} />
          <div className="particle" style={{ top: '40%', left: '50%', animationDelay: '3s', background: '#8B5CF6' }} />
          <div className="particle" style={{ top: '80%', left: '25%', animationDelay: '4.5s' }} />
          <div className="particle" style={{ top: '15%', left: '80%', animationDelay: '2s', background: '#3B82F6' }} />
        </div>

        {/* Barra de Controle Superior (Versão + Toggle de Tema) */}
        <div className="w-full max-w-[500px] flex items-center justify-between mb-8 relative z-10">
          {/* Live Status Capsule */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all duration-300" style={{ background: 'rgba(0, 229, 255, 0.04)', borderColor: 'rgba(0, 229, 255, 0.25)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ink)]">
              Birth Hub · <span style={{ color: '#0E7490' }} className="dark:text-[#00E5FF]">v4.2 Enterprise</span>
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            id="btn-theme-toggle"
            type="button"
            onClick={() => {
              SoundFX.play('click');
              toggleTheme();
            }}
            className="group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none border cursor-pointer"
            style={{ background: 'var(--surface)', borderColor: 'var(--line)', color: 'var(--ink-2)' }}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90 text-[#F59E0B]" />
            ) : (
              <Moon className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12 text-[#8B5CF6]" />
            )}
          </button>
        </div>

        {/* Container do Card Central */}
        <div className="w-full max-w-[500px] z-10">
          {/* Header do Card */}
          <div className="mb-6 text-center relative">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest mb-3.5 border shadow-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                borderColor: 'rgba(0, 229, 255, 0.3)',
                color: '#0E7490',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              Acesso Seguro · Zero Trust Architecture
            </div>

            <h2 id="form-title" className="form-title-gradient font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
              {authMode === 'signup'
                ? 'Criar conta corporativa'
                : authMode === 'forgot'
                ? 'Redefinir Senha'
                : 'Acessar conta'}
            </h2>
            <p id="form-subtitle" className="font-sans text-xs sm:text-sm text-[var(--ink-2)] font-medium max-w-[380px] mx-auto leading-relaxed">
              {authMode === 'signup'
                ? 'Preencha suas informações para solicitar provisionamento.'
                : authMode === 'forgot'
                ? 'Informe seu e-mail corporativo para receber o link de recuperação.'
                : 'Central de inteligência comercial, previsibilidade e governança integrada.'}
            </p>

            {authMode === 'signin' && (
              <div
                id="form-desc"
                className="mt-4 py-2 px-4 rounded-xl border relative overflow-hidden text-center transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.06) 0%, rgba(59, 130, 246, 0.04) 100%)',
                  borderColor: 'rgba(0, 229, 255, 0.2)',
                }}
              >
                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--ink)]">
                  <span className="font-bold text-[#0E7490] dark:text-[#00E5FF]">8 Pilares Integrados:</span>
                  <span className="text-[var(--ink-2)] truncate">CRM · Pipeline · Orquestração · IA · Forecast</span>
                </div>
              </div>
            )}
          </div>

          {/* Glassmorphism Card Principal */}
          <div className="card-glow rounded-2xl p-7 sm:p-9 relative">
            {/* Segmented Tab Switcher (E-mail vs SSO) */}
            {authMode === 'signin' && (
              <div className="tab-segmented-container grid grid-cols-2 gap-1.5 mb-6" role="tablist">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`tab-segmented-btn py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    authMethod === 'email' ? 'active' : ''
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>E-mail Corporativo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('sso')}
                  className={`tab-segmented-btn py-2.5 px-4 text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    authMethod === 'sso' ? 'active' : ''
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>SSO Empresarial</span>
                </button>
              </div>
            )}

            {/* Alert / Feedback Box */}
            {errorMessage && (
              <div
                className="mb-6 flex items-start gap-3 rounded-xl border p-3.5 text-xs transition-all duration-300"
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)', color: '#EF4444' }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="font-medium font-sans">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div
                className="mb-6 flex items-start gap-3 rounded-xl border p-3.5 text-xs transition-all duration-300"
                style={{ borderColor: 'rgba(34, 197, 94, 0.4)', background: 'rgba(34, 197, 94, 0.08)', color: '#22C55E' }}
              >
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="font-medium font-sans">{successMessage}</p>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 sm:space-y-5" noValidate>
              {/* Nome Completo (Modo Cadastro) */}
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label htmlFor="login-name" className="block font-mono text-xs font-bold text-[var(--ink-2)] uppercase tracking-wider">
                    Nome Completo
                  </label>
                  <input
                    id="login-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="app-input-pro px-4"
                    placeholder="Ex: Alex Santana"
                    autoComplete="name"
                  />
                </div>
              )}

              {/* E-mail Corporativo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-email" className="block font-mono text-xs font-bold text-[var(--ink-2)] uppercase tracking-wider">
                    {authMethod === 'sso' ? 'E-mail ou Domínio SSO' : 'E-mail Corporativo'}
                  </label>
                  <span className="font-mono text-[10px] text-[var(--ink-2)] opacity-60">Requer domínio corporativo</span>
                </div>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--ink-2)] group-focus-within:text-[#00E5FF] transition-colors duration-200" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="app-input-pro pl-12 pr-4"
                    placeholder={authMethod === 'sso' ? 'seuemail@seudominio.com.br' : 'executivo@empresa.com.br'}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Senha */}
              {authMode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className="block font-mono text-xs font-bold text-[var(--ink-2)] uppercase tracking-wider">
                      Senha de Acesso
                    </label>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--ink-2)] group-focus-within:text-[#00E5FF] transition-colors duration-200" />
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
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors focus:outline-none cursor-pointer"
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
                  <label className="flex items-center gap-2.5 cursor-pointer font-sans text-xs text-[var(--ink-2)] select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#00E5FF] focus:ring-[#00E5FF] accent-[#00E5FF] cursor-pointer"
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
                    className="font-sans text-xs font-semibold text-[#0E7490] hover:text-[#00E5FF] transition-colors link-hover cursor-pointer"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              )}

              {/* Botão Principal CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full h-[54px] rounded-xl font-mono text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>
                      {authMode === 'signup'
                        ? 'Solicitar Provisionamento'
                        : authMode === 'forgot'
                        ? 'Enviar Link de Redefinição'
                        : 'Entrar no Birth Hub'}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Alternância de Modo */}
            <div className="mt-6 text-center">
              {authMode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-sans text-xs text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                >
                  Não possui credenciais corporativas?{' '}
                  <span className="font-bold text-[#0E7490] hover:underline">Solicitar acesso</span>
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
                  className="font-sans text-xs text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                >
                  Já possui credenciais corporativas?{' '}
                  <span className="font-bold text-[#0E7490] hover:underline">Fazer login</span>
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
                  className="font-sans text-xs text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                >
                  Voltar para{' '}
                  <span className="font-bold text-[#0E7490] hover:underline">Login Corporativo</span>
                </button>
              )}
            </div>

            {/* Divisor SSO */}
            {authMode === 'signin' && (
              <div className="mt-7">
                <div className="relative flex items-center justify-center mb-5">
                  <div className="w-full border-t border-[var(--line)]" />
                  <span className="absolute bg-[var(--surface)] px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--ink-2)]">
                    ou continue com
                  </span>
                </div>

                {/* Provedores SSO */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="btn-social flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-mono font-bold text-[var(--ink)] cursor-pointer"
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
                    className="btn-social flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-mono font-bold text-[var(--ink)] cursor-pointer"
                  >
                    <svg viewBox="0 0 21 21" className="w-4 h-4 shrink-0">
                      <path fill="#f25022" d="M0 0h10v10H0z" />
                      <path fill="#7fba00" d="M11 0h10v10H11z" />
                      <path fill="#00a4ef" d="M0 11h10v10H0z" />
                      <path fill="#ffb900" d="M11 11h10v10H11z" />
                    </svg>
                    <span>Microsoft</span>
                  </button>

                  {/* SAML / Okta */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('sso');
                      SoundFX.play('click');
                    }}
                    className="btn-social flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-mono font-bold text-[var(--ink)] cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                    <span>SAML SSO</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Grade de Certificações & Segurança Enterprise */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="trust-badge-pro flex items-center gap-2 p-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0 shadow-[0_0_8px_#22C55E]" />
              <div className="min-w-0">
                <div className="font-mono text-[10px] font-bold text-[var(--ink)] truncate">AES-256</div>
                <div className="font-sans text-[9px] text-[var(--ink-2)] truncate">Criptografado</div>
              </div>
            </div>
            <div className="trust-badge-pro flex items-center gap-2 p-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6] shrink-0 shadow-[0_0_8px_#3B82F6]" />
              <div className="min-w-0">
                <div className="font-mono text-[10px] font-bold text-[var(--ink)] truncate">SSO & MFA</div>
                <div className="font-sans text-[9px] text-[var(--ink-2)] truncate">Autenticação</div>
              </div>
            </div>
            <div className="trust-badge-pro flex items-center gap-2 p-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0 shadow-[0_0_8px_#8B5CF6]" />
              <div className="min-w-0">
                <div className="font-mono text-[10px] font-bold text-[var(--ink)] truncate">LGPD/GDPR</div>
                <div className="font-sans text-[9px] text-[var(--ink-2)] truncate">Conformidade</div>
              </div>
            </div>
            <div className="trust-badge-pro flex items-center gap-2 p-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0 shadow-[0_0_8px_#22C55E]" />
              <div className="min-w-0">
                <div className="font-mono text-[10px] font-bold text-[var(--ink)] truncate">99.99%</div>
                <div className="font-sans text-[9px] text-[var(--ink-2)] truncate">Uptime SLA</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
