import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AnimatedBirthHubEmblem } from '../../../components/brand/AnimatedBirthHubEmblem.js';
import { BirthHubLogo } from '../../../components/brand/BirthHubLogo.js';
import { useAuth } from '../../../contexts/AuthContext.js';
import { authClient } from '../../../lib/auth-client.js';
import { EASE_OUT_EXPO, staggerContainer, staggerItem } from '../../../lib/motion.js';
import { SoundFX } from '../../../lib/soundEffects.js';
import { ThemeToggle } from '../../../components/layout/ThemeToggle.js';

export function LandingLoginSplitScreen() {
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

  // Sync date/time
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateLabel = format(now, "dd MMM yyyy", { locale: ptBR }).toUpperCase();
  const timeLabel = format(now, "HH:mm 'BRT'");

  // ─── If already authenticated, redirect ──────────────────────────────────────
  if (currentUser) {
    return <Navigate to="/hub" replace />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

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

  // ─── Simple Loader if checking session ─────────────────────────────────────
  if (isPending) {
    return (
      <>
        <ThemeToggle />
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
          <Loader2 className="animate-spin text-[var(--brand)] w-8 h-8" aria-hidden="true" />
        </div>
      </>
    );
  }

  // ─── Shared input class ────────────────────────────────────────────────────
  const inputCls =
    'w-full h-[44px] rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--surface)] ' +
    'px-4 font-mono text-sm text-[var(--ink)] placeholder-[var(--ink-2)]/50 ' +
    'focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 transition-colors';

  // ─── Unified Layout: Split-screen on desktop, stacked on mobile ───────────────────────────────────────────────────
  return (
    <>
      <ThemeToggle />
      <div className="flex min-h-screen w-full overflow-x-hidden lg:flex-row flex-col">
        {/* ══════════════════════════════════════════════════════════════════════
            LADO ESQUERDO (Desktop) / TOPO (Mobile): Hero compacto com marca
        ══════════════════════════════════════════════════════════════════════ */}
        <div
          className="relative flex flex-col lg:w-1/2 w-full overflow-hidden px-6 py-8 lg:py-12 text-[var(--ink)] bg-[var(--bg)]"
        >
          {/* ── Subtle grid texture overlay ─────────────────────────────── */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                'linear-gradient(var(--line) 1px, transparent 1px), ' +
                'linear-gradient(90deg, var(--line) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />

          {/* ── Logo Header ─────────────────────────────────────────────── */}
          <header className="relative z-20 flex items-center justify-between mb-8 lg:mb-12">
            <div className="flex shrink-0 items-center gap-3">
              <BirthHubLogo variant="horizontal" className="h-8 text-[var(--ink)]" />
            </div>
            {/* Status indicator */}
            <div className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-mono text-[var(--ink-2)]">
              <div className="w-2 h-2 rounded-full bg-[var(--ok)] animate-pulse" />
              Sistema Online
            </div>
          </header>

          {/* ── Compact Hero Content ─────────────────────────────────────── */}
          <div className="relative z-20 flex-1 flex flex-col justify-center max-w-xl lg:max-w-none">
            <motion.div
              initial="hidden"
              animate="show"
              variants={staggerContainer(0.1)}
              className="space-y-4 lg:space-y-6"
            >
              {/* Eyebrow */}
              <motion.p
                variants={staggerItem}
                className="font-mono text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-ink)]"
              >
                Intelligent Business Command Center
              </motion.p>

              {/* Brand name */}
              <motion.h1
                variants={staggerItem}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--ink)] leading-[1.08]"
              >
                Birth Hub <span className="text-[var(--brand-ink)] font-semibold">360º</span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                variants={staggerItem}
                className="font-display text-lg sm:text-xl lg:text-2xl font-medium leading-snug text-[var(--ink)]"
              >
                Dados que Conectam,
                <br />
                Inteligência que decide,
                <br />
                <span className="text-[var(--brand-ink)]">Resultados que acontecem.</span>
              </motion.p>

              {/* Subtitle */}
              <motion.p
                variants={staggerItem}
                className="font-mono text-xs sm:text-sm text-[var(--ink-2)] max-w-md leading-relaxed"
              >
                Conecte CRM, dados, processos e IA em um único Command Center.
              </motion.p>
            </motion.div>
          </div>

          {/* ── Small Emblem (desktop only, compact) ─────────────────────── */}
          <div className="hidden lg:flex items-center justify-center mt-8 z-20">
            <AnimatedBirthHubEmblem
              size={140}
              showCta={false}
              onAction={() => {
                SoundFX.play('confirm');
                navigate('/login');
              }}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            LADO DIREITO (Desktop) / FUNDO (Mobile): Formulário de acesso
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col items-center justify-center relative bg-[var(--bg)] px-6 py-8 lg:py-12 w-full lg:w-1/2">
          {/* Top-right date/status badge (desktop only) */}
          <div className="absolute top-8 right-6 lg:right-10 flex items-center gap-4 whitespace-nowrap text-xs font-semibold text-[var(--ink-2)]">
            <div className="hidden items-center gap-2 md:flex font-mono">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateLabel} | {timeLabel}
            </div>
          </div>

          <div className="w-full max-w-md z-10">
            {/* ── Header (simplified) ─────────────────────────────────────── */}
            <motion.div
              className="text-center mb-6 lg:mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            >
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
                    ? 'text-[var(--brand-ink)]'
                    : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                    }`}
                >
                  E-mail corporativo
                  {activeTab === 'email' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand)]"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sso')}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors relative font-mono ${activeTab === 'sso' ? 'text-[var(--brand-ink)]' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                    }`}
                >
                  SSO Empresarial
                  {activeTab === 'sso' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand)]"
                    />
                  )}
                </button>
              </div>

              <div className="p-6 md:p-8">
                {verificationPending ? (
                  <div className="space-y-5 text-center">
                    <div className="flex items-start gap-2.5 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-3.5 text-left text-sm text-[var(--ink)]">
                      <Mail size={16} className="mt-0.5 shrink-0 text-[var(--brand)]" />
                      <p>
                        Enviamos um link de confirmação para <strong>{email}</strong>. Clique nele
                        para confirmar que este e-mail é seu e ativar sua conta.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={backToSignIn}
                      className="text-sm font-bold text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors hover:underline"
                    >
                      Voltar para o login
                    </button>
                  </div>
                ) : isForgotPassword ? (
                  forgotPasswordSent ? (
                    <div className="space-y-5 text-center">
                      <div className="flex items-start gap-2.5 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-3.5 text-left text-sm text-[var(--ink)]">
                        <Mail size={16} className="mt-0.5 shrink-0 text-[var(--brand)]" />
                        <p>
                          Se <strong>{email}</strong> tiver uma conta, enviamos um link de
                          redefinição. O link expira em 1 hora.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={backToSignIn}
                        className="text-sm font-bold text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors hover:underline"
                      >
                        Voltar para o login
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-5">
                      {error && (
                        <div className="flex items-start gap-2.5 rounded-xl border border-[var(--critical)]/30 bg-[var(--critical)]/5 p-3.5 text-xs text-[var(--critical)]">
                          <AlertCircle size={16} className="mt-0.5 shrink-0" />
                          <p>{error}</p>
                        </div>
                      )}
                      <p className="font-mono text-sm text-[var(--ink-2)]">
                        Informe o e-mail corporativo da sua conta. Se ele existir, enviaremos um link
                        para redefinição de senha.
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
                        className="w-full h-[44px] rounded-[10px] bg-[var(--brand-active)] text-[var(--on-brand)] text-sm font-extrabold uppercase tracking-wide shadow-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
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
                          className="text-sm font-bold text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors hover:underline"
                        >
                          Voltar para o login
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <form onSubmit={handleAuth} className="space-y-5">
                    {error && (
                      <div className="flex items-start gap-2.5 rounded-xl border border-[var(--critical)]/30 bg-[var(--critical)]/5 p-3.5 text-xs text-[var(--critical)]">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    {isSignUp && (
                      <div>
                        <label
                          htmlFor="login-name"
                          className="block font-mono text-xs font-semibold text-[var(--ink-2)] mb-1.5 uppercase tracking-wide"
                        >
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
                        <label
                          htmlFor="login-email"
                          className="block font-mono text-xs font-semibold text-[var(--ink-2)] mb-1.5 uppercase tracking-wide"
                        >
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
                        <label
                          htmlFor="login-password"
                          className="block font-mono text-xs font-semibold text-[var(--ink-2)] mb-1.5 uppercase tracking-wide"
                        >
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
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer font-mono text-xs font-semibold text-[var(--ink-2)]">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-[var(--line)] text-[var(--brand)] focus:ring-[var(--brand)] w-4 h-4 bg-[var(--surface)]"
                          />
                          Manter sessão ativa
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setError('');
                          }}
                          className="font-mono text-xs font-bold text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors sm:text-right pt-2 sm:pt-0"
                        >
                          Esqueci minha senha?
                        </button>
                      </div>
                    )}

                    {/* Primary CTA */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !email || !password}
                      className="w-full h-[44px] rounded-[var(--radius-control)] bg-[var(--brand-active)] text-[var(--on-brand)] text-sm font-extrabold uppercase tracking-wide shadow-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                      className="font-mono text-xs font-bold text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors"
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
                        className="flex items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--line)] py-2.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
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
                        className="flex items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--line)] py-2.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
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
                        className="flex items-center justify-center gap-2 rounded-[var(--radius-control)] border border-[var(--line)] py-2.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-[var(--brand)]" />
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
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand)]" /> Acesso protegido
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[var(--brand)]" /> Autenticação empresarial
                </span>
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[var(--brand)]" /> Controle de permissões
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand)]" /> Conformidade LGPD
                </span>
              </div>
              <div className="mt-6 text-center font-mono text-[9px] uppercase tracking-widest font-bold text-[var(--ink-2)]">
                BIRTH HUB 360&deg; | CENTRO DE COMANDO PARA OPERAÇÕES DE RECEITA
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
