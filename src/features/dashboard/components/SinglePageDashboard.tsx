import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Radar,
  Search,
  Target,
  TrendingUp,
} from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { GamificationWidget } from '../../../components/ui/GamificationWidget.js';
import { Skeleton } from '../../../components/ui/Skeleton.js';
import { useAuth } from '../../../contexts/AuthContext.js';
import { useAnalyticsDashboard } from '../../../hooks/useDatabase.js';
import {
  ctaGlow,
  fadeInUp,
  metricReveal,
  metricsContainer,
  shimmerBeam,
  staggerContainer,
  staggerItem,
  useTilt,
} from '../../../lib/motion.js';
import { SoundFX } from '../../../lib/soundEffects.js';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function SinglePageDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: stats, loading } = useAnalyticsDashboard(6);
  const tiltPipeline = useTilt(5);
  const tiltWinRate = useTilt(5);
  const tiltVelocity = useTilt(5);
  const tiltMarket = useTilt(5);

  const overview = stats?.overview;
  const pipelineValue = overview?.pipelineValue ?? 0;
  const totalLeads = overview?.totalLeads ?? 0;
  const winRate =
    overview?.conversionRate != null ? Number(overview.conversionRate).toFixed(1) : '0.0';
  const firstName = currentUser?.name?.trim().split(/\s+/)[0] || 'Gestor';
  const pendingActivities = overview?.pendingActivities ?? 0;
  const closedThisMonth = overview?.closedThisMonth ?? 0;
  const totalCompanies = overview?.totalCompanies ?? 0;

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-bg p-8 lg:p-12">
        <div className="max-w-[92rem] mx-auto space-y-8 animate-pulse">
          <Skeleton className="h-6 w-32 rounded-full bg-surface-subtle" />
          <Skeleton className="h-12 w-96 rounded-xl bg-surface-subtle" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
            <Skeleton className="h-48 rounded-xl bg-surface-subtle" />
            <Skeleton className="h-48 rounded-xl bg-surface-subtle" />
            <Skeleton className="h-48 rounded-xl bg-surface-subtle" />
            <Skeleton className="h-48 rounded-xl bg-surface-subtle" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-bg text-ink relative">
      {/* Subtle Data Flow Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="w-[120%] h-[1px] bg-gradient-to-r from-transparent via-line to-transparent absolute top-32 opacity-50" />
        <div className="w-[1px] h-[100%] bg-gradient-to-b from-transparent via-line to-transparent absolute left-1/4 opacity-50" />
      </div>

      <div className="max-w-[92rem] mx-auto p-6 sm:p-8 lg:p-12 relative z-10">
        {/* COMMAND CENTER HEADER — entrada orquestrada */}
        <motion.header
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-line/50 pb-8"
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          animate="show"
        >
          <motion.div className="space-y-4" variants={staggerItem}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-surface-interactive text-ink-2">
                <Radar className="w-3.5 h-3.5 text-brand" />
                Revenue Command Center
              </span>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ok">
                <span className="h-2 w-2 rounded-full bg-ok motion-safe:animate-pulse" />
                LIVE
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight">
              {greeting()}, {firstName}.
            </h1>
            <p className="text-sm text-ink-2 max-w-xl leading-relaxed">
              Sistema de inteligência operando. Os fluxos de dados estão sincronizados e o pipeline
              está pronto para orquestração.
            </p>
          </motion.div>

          <motion.div className="flex items-center gap-4" variants={staggerItem}>
            <motion.button
              type="button"
              onMouseEnter={() => SoundFX.play('hover')}
              onClick={() => {
                SoundFX.play('click');
                navigate('/app/prospect');
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-semibold hover:text-brand transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Prospecção</span>
            </motion.button>

            {/* CTA primário com ctaGlow e shimmerBeam */}
            <motion.button
              type="button"
              onMouseEnter={() => SoundFX.play('hover')}
              onClick={() => {
                SoundFX.play('confirm');
                navigate('/app/crm');
              }}
              variants={ctaGlow}
              initial="rest"
              whileHover="glow"
              whileTap={{ scale: 0.96 }}
              className="relative inline-flex items-center gap-2 px-6 py-2.5 bg-ink text-bg text-xs font-bold overflow-hidden cursor-pointer transition-colors hover:bg-brand hover:text-on-brand shadow-lg"
            >
              {/* Shimmer beam no hover */}
              <motion.span
                className="absolute inset-0 pointer-events-none"
                variants={shimmerBeam}
                initial="initial"
                whileHover="hover"
                aria-hidden="true"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.22) 50%, transparent 60%)',
                }}
              />
              <Activity className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Orquestrar Pipeline</span>
            </motion.button>
          </motion.div>
        </motion.header>

        {/* METRICS FLOW — entrada com perspectiva 3D + tilt por bloco */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16"
          variants={metricsContainer}
          initial="hidden"
          animate="show"
        >
          {/* Pipeline */}
          <motion.div
            ref={tiltPipeline.ref as React.RefObject<HTMLDivElement>}
            style={{ ...tiltPipeline.style, transformStyle: 'preserve-3d' as const }}
            onPointerMove={tiltPipeline.onPointerMove as React.PointerEventHandler<HTMLDivElement>}
            onPointerLeave={tiltPipeline.onPointerLeave}
            variants={metricReveal}
            className="space-y-3 cursor-default"
          >
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-2 flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Forecast (Pipeline)
            </h3>
            <p className="text-4xl lg:text-5xl font-mono text-ink tracking-tight font-medium">
              {pipelineValue > 0
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    maximumFractionDigits: 0,
                  }).format(pipelineValue)
                : 'R$ 0'}
            </p>
            <p className="text-xs text-ink-2 font-mono">{totalLeads} oportunidades sob gestão</p>
          </motion.div>

          {/* Win Rate */}
          <motion.div
            ref={tiltWinRate.ref as React.RefObject<HTMLDivElement>}
            style={{ ...tiltWinRate.style, transformStyle: 'preserve-3d' as const }}
            onPointerMove={tiltWinRate.onPointerMove as React.PointerEventHandler<HTMLDivElement>}
            onPointerLeave={tiltWinRate.onPointerLeave}
            variants={metricReveal}
            className="space-y-3 cursor-default"
          >
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-2 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Win Rate
            </h3>
            <p className="text-4xl lg:text-5xl font-mono text-ink tracking-tight font-medium">
              {winRate}%
            </p>
            <p className="text-xs text-ink-2 font-mono">{closedThisMonth} negócios fechados</p>
          </motion.div>

          {/* Velocity */}
          <motion.div
            ref={tiltVelocity.ref as React.RefObject<HTMLDivElement>}
            style={{ ...tiltVelocity.style, transformStyle: 'preserve-3d' as const }}
            onPointerMove={tiltVelocity.onPointerMove as React.PointerEventHandler<HTMLDivElement>}
            onPointerLeave={tiltVelocity.onPointerLeave}
            variants={metricReveal}
            className="space-y-3 cursor-default"
          >
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-2 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Velocity (Atividades)
            </h3>
            <p className="text-4xl lg:text-5xl font-mono text-ink tracking-tight font-medium">
              {pendingActivities}
            </p>
            <p className="text-xs text-ink-2 font-mono">ações pendentes no fluxo</p>
          </motion.div>

          {/* Market */}
          <motion.div
            ref={tiltMarket.ref as React.RefObject<HTMLDivElement>}
            style={{ ...tiltMarket.style, transformStyle: 'preserve-3d' as const }}
            onPointerMove={tiltMarket.onPointerMove as React.PointerEventHandler<HTMLDivElement>}
            onPointerLeave={tiltMarket.onPointerLeave}
            variants={metricReveal}
            className="space-y-3 cursor-default"
          >
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-2 flex items-center gap-2">
              <Search className="w-3.5 h-3.5" /> Market (Empresas)
            </h3>
            <p className="text-4xl lg:text-5xl font-mono text-ink tracking-tight font-medium">
              {totalCompanies}
            </p>
            <p className="text-xs text-ink-2 font-mono">contas ativas na base</p>
          </motion.div>
        </motion.div>

        {/* AI LAYER & GAMIFICATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-line/30">
          {/* AI Orchestration Language — rows com stagger delay */}
          <div className="space-y-6">
            <motion.div
              className="flex items-center gap-3 mb-6"
              variants={fadeInUp}
              initial="hidden"
              animate="show"
            >
              <span className="p-2 bg-iris/10 text-iris">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-iris">
                AI Orchestration
              </span>
            </motion.div>

            <motion.div
              className="flex flex-col gap-4"
              variants={staggerContainer(0.12, 0.25)}
              initial="hidden"
              animate="show"
            >
              <motion.div
                variants={staggerItem}
                className="flex items-center gap-4 text-sm font-mono border-l-2 border-line pl-4 text-ink-2"
              >
                <span className="w-24 text-[10px] uppercase tracking-widest font-bold text-ink-3">
                  Context
                </span>
                <span>Analisando {totalLeads} leads em andamento...</span>
              </motion.div>
              <motion.div
                variants={staggerItem}
                className="flex items-center gap-4 text-sm font-mono border-l-2 border-line pl-4 text-ink-2"
              >
                <span className="w-24 text-[10px] uppercase tracking-widest font-bold text-ink-3">
                  Analysis
                </span>
                <span>Detectadas {pendingActivities} oportunidades de aceleração.</span>
              </motion.div>
              <motion.div
                variants={staggerItem}
                className="flex items-center gap-4 text-sm font-mono border-l-2 border-brand pl-4 text-ink"
              >
                <span className="w-24 text-[10px] uppercase tracking-widest font-bold text-brand">
                  Action Req.
                </span>
                <span>Validar abordagem para fechamento iminente.</span>
              </motion.div>
            </motion.div>

            <button
              type="button"
              onClick={() => navigate('/app/intelligence')}
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-iris hover:text-ink transition-colors cursor-pointer group"
            >
              <span>Acessar Copiloto IA</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Gamification clean integration */}
          <div className="bg-surface-interactive/30 p-8 rounded-none border border-line/50">
            <GamificationWidget
              initialXp={Math.max(350, totalLeads * 50 + closedThisMonth * 200)}
              level={Math.max(1, Math.floor((totalLeads * 50 + closedThisMonth * 200) / 1000) + 1)}
              streakDays={closedThisMonth > 0 ? 5 : 2}
              show3DCore={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
