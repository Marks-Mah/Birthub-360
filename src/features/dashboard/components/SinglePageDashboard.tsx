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
import { useNavigate } from 'react-router-dom';
import { GamificationWidget } from '../../../components/ui/GamificationWidget.js';
import { Skeleton } from '../../../components/ui/Skeleton.js';
import { useAuth } from '../../../contexts/AuthContext.js';
import { useAnalyticsDashboard } from '../../../hooks/useDatabase.js';
import {
  fadeInUp,
  metricReveal,
  metricsContainer,
  staggerContainer,
  staggerItem,
} from '../../../lib/motion.js';

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
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10 min-h-full flex flex-col">
        {/* COMMAND CENTER HEADER */}
        <motion.header
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6 border-b border-line pb-6"
          variants={staggerContainer(0.08, 0)}
          initial="hidden"
          animate="show"
        >
          <motion.div className="space-y-3" variants={staggerItem}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-brand/10 text-brand">
                <Radar className="w-3.5 h-3.5" />
                Command Center
              </span>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ok">
                <span className="h-2 w-2 rounded-full bg-ok motion-safe:animate-pulse" />
                LIVE
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-brand-display)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink">
              {greeting()}, {firstName}.
            </h1>
            <p className="text-sm text-ink-2 max-w-xl leading-relaxed font-[family-name:var(--font-brand-sans)]">
              Sistema de inteligência operando. Os fluxos de dados estão sincronizados e o pipeline
              está pronto para orquestração.
            </p>
          </motion.div>

          <motion.div className="flex items-center gap-3" variants={staggerItem}>
            <motion.button
              type="button"
              onClick={() => {
                navigate('/app/prospect');
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line bg-surface hover:bg-surface-2 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Prospecção</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => {
                navigate('/app/crm');
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand hover:bg-brand/90 text-on-brand text-sm font-bold transition-colors shadow-card hover:shadow-card-hover cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Orquestrar Pipeline</span>
            </motion.button>
          </motion.div>
        </motion.header>

        {/* METRICS CARDS */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          variants={metricsContainer}
          initial="hidden"
          animate="show"
        >
          {/* Pipeline */}
          <motion.div
            variants={metricReveal}
            className="bg-surface p-4 rounded-xl border border-line shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-2 flex items-center gap-2 font-[family-name:var(--font-brand-sans)]">
                <Target className="w-3.5 h-3.5 text-brand" /> Pipeline
              </h3>
            </div>
            <p className="text-2xl font-bold text-ink font-[family-name:var(--font-brand-sans)]">
              {pipelineValue > 0
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    maximumFractionDigits: 0,
                  }).format(pipelineValue)
                : 'R$ 0'}
            </p>
            <p className="text-xs text-ink-2 mt-1 font-[family-name:var(--font-brand-sans)]">
              {totalLeads} oportunidades
            </p>
          </motion.div>

          {/* Win Rate */}
          <motion.div
            variants={metricReveal}
            className="bg-surface p-4 rounded-xl border border-line shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-2 flex items-center gap-2 font-[family-name:var(--font-brand-sans)]">
                <TrendingUp className="w-3.5 h-3.5 text-ok" /> Win Rate
              </h3>
            </div>
            <p className="text-2xl font-bold text-ink font-[family-name:var(--font-brand-sans)]">
              {winRate}%
            </p>
            <p className="text-xs text-ink-2 mt-1 font-[family-name:var(--font-brand-sans)]">
              {closedThisMonth} fechados
            </p>
          </motion.div>

          {/* Velocity */}
          <motion.div
            variants={metricReveal}
            className="bg-surface p-4 rounded-xl border border-line shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-2 flex items-center gap-2 font-[family-name:var(--font-brand-sans)]">
                <Activity className="w-3.5 h-3.5 text-brand" /> Atividades
              </h3>
            </div>
            <p className="text-2xl font-bold text-ink font-[family-name:var(--font-brand-sans)]">
              {pendingActivities}
            </p>
            <p className="text-xs text-ink-2 mt-1 font-[family-name:var(--font-brand-sans)]">
              pendentes
            </p>
          </motion.div>

          {/* Market */}
          <motion.div
            variants={metricReveal}
            className="bg-surface p-4 rounded-xl border border-line shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-2 flex items-center gap-2 font-[family-name:var(--font-brand-sans)]">
                <Search className="w-3.5 h-3.5 text-iris" /> Empresas
              </h3>
            </div>
            <p className="text-2xl font-bold text-ink font-[family-name:var(--font-brand-sans)]">
              {totalCompanies}
            </p>
            <p className="text-xs text-ink-2 mt-1 font-[family-name:var(--font-brand-sans)]">
              contas ativas
            </p>
          </motion.div>
        </motion.div>

        {/* AI LAYER & GAMIFICATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-line/30 flex-1">
          {/* AI Orchestration */}
          <div className="space-y-6">
            <motion.div
              className="flex items-center gap-3 mb-6"
              variants={fadeInUp}
              initial="hidden"
              animate="show"
            >
              <span className="p-2 bg-iris/10 text-iris rounded-lg">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-iris font-[family-name:var(--font-brand-sans)]">
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
                className="flex items-center gap-4 text-sm font-[family-name:var(--font-brand-sans)] border-l-2 border-line pl-4 text-ink-2"
              >
                <span className="w-24 text-[10px] uppercase tracking-widest font-bold text-ink-3">
                  Context
                </span>
                <span>Analisando {totalLeads} leads em andamento...</span>
              </motion.div>
              <motion.div
                variants={staggerItem}
                className="flex items-center gap-4 text-sm font-[family-name:var(--font-brand-sans)] border-l-2 border-line pl-4 text-ink-2"
              >
                <span className="w-24 text-[10px] uppercase tracking-widest font-bold text-ink-3">
                  Analysis
                </span>
                <span>Detectadas {pendingActivities} oportunidades de aceleração.</span>
              </motion.div>
              <motion.div
                variants={staggerItem}
                className="flex items-center gap-4 text-sm font-[family-name:var(--font-brand-sans)] border-l-2 border-brand pl-4 text-ink"
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
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-iris hover:text-ink transition-colors cursor-pointer group font-[family-name:var(--font-brand-sans)]"
            >
              <span>Acessar Copiloto IA</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Gamification */}
          <div className="bg-surface-interactive/30 p-8 rounded-xl border border-line/40">
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
