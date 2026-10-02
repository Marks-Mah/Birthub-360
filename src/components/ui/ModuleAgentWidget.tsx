import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Sparkles, X, Send } from 'lucide-react';
import type { TabType } from '../layout/tabMeta.js';
import { SoundFX } from '../../lib/soundEffects.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { hasRequiredRole, MESA_TRATAMENTO_ROLES } from '../../lib/auth/authorization.js';
import { AiReasoningPipeline } from './AiReasoningPipeline.js';
import type { AiReasoningStep } from './AiReasoningPipeline.js';

interface AgentCharacter {
  name: string;
  role: string;
  seed: string;
  command: string;
  color: string;
  monitoringContext: string;
}

const AGENTS_BY_PILLAR: Record<string, AgentCharacter> = {
  'PILAR 01 — HUB COMERCIAL': {
    name: 'Atlas',
    role: 'Guardião do CRM',
    seed: 'Atlas',
    command: 'Ei Atlas',
    color: 'from-amber-400 to-amber-600',
    monitoringContext: 'Monitorando pipeline e negócios ativos',
  },
  'PILAR 02 — INTELIGÊNCIA DE MERCADO': {
    name: 'Nexus',
    role: 'Analista de Dados',
    seed: 'Felix',
    command: 'Ei Nexus',
    color: 'from-blue-400 to-blue-600',
    monitoringContext: 'Analisando dados de mercado e tendências',
  },
  'PILAR 03 — ORQUESTRAÇÃO DE VENDAS': {
    name: 'Aria',
    role: 'Maestrina de Fluxos',
    seed: 'Aria',
    command: 'Ei Aria',
    color: 'from-emerald-400 to-emerald-600',
    monitoringContext: 'Orquestrando cadências e fluxos de vendas',
  },
  'PILAR 04 — PERFORMANCE COMERCIAL': {
    name: 'Vanguard',
    role: 'Estrategista de Metas',
    seed: 'Vanguard',
    command: 'Ei Vanguard',
    color: 'from-rose-400 to-rose-600',
    monitoringContext: 'Avaliando metas e performance da equipe',
  },
  'PILAR 05 — PREVISIBILIDADE COMERCIAL': {
    name: 'Oracle',
    role: 'Visionário de Forecast',
    seed: 'Oracle',
    command: 'Ei Oracle',
    color: 'from-purple-400 to-purple-600',
    monitoringContext: 'Projetando forecast e cenários futuros',
  },
  'PILAR 06 — INTELIGÊNCIA ARTIFICIAL': {
    name: 'Core',
    role: 'Mente Principal',
    seed: 'Buster',
    command: 'Ei Core',
    color: 'from-indigo-400 to-indigo-600',
    monitoringContext: 'Processando modelos e aprendizados da IA',
  },
  'PILAR 07 — AUTOMAÇÃO & CONECTIVIDADE': {
    name: 'Spark',
    role: 'Engenheiro de Integrações',
    seed: 'Sparky',
    command: 'Ei Spark',
    color: 'from-teal-400 to-teal-600',
    monitoringContext: 'Monitorando integrações e conectores ativos',
  },
  'PILAR 08 — ENGAJAMENTO COMERCIAL': {
    name: 'Echo',
    role: 'Especialista em Voz',
    seed: 'Echo',
    command: 'Ei Echo',
    color: 'from-pink-400 to-pink-600',
    monitoringContext: 'Acompanhando engajamento e canais de voz',
  },
  ADMINISTRAÇÃO: {
    name: 'Sudo',
    role: 'Controlador de Sistema',
    seed: 'Sudo',
    command: 'Ei Sudo',
    color: 'from-slate-400 to-slate-600',
    monitoringContext: 'Supervisionando configurações e permissões',
  },
};

interface ModuleAgentWidgetProps {
  activeTab: TabType;
}

const REASONING_STEPS: AiReasoningStep[] = [
  'CONTEXT',
  'ANALYSIS',
  'RECOMMENDATION',
  'APPROVAL',
  'EXECUTION',
];

export function ModuleAgentWidget({ activeTab }: ModuleAgentWidgetProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [reasoningStep, setReasoningStep] = useState<AiReasoningStep>('CONTEXT');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { currentUser, isAdmin, canAccessCommercialIntelligence, canAccessCopilotoIa } = useAuth();

  const canManageOperations =
    !!currentUser && hasRequiredRole(currentUser.role, ['ADMIN', 'GESTOR']);
  const canAccessMesaTratamento =
    !!currentUser && hasRequiredRole(currentUser.role, MESA_TRATAMENTO_ROLES);

  // Cycle through reasoning steps every 2s when panel is open
  useEffect(() => {
    if (!isPanelOpen) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setReasoningStep('CONTEXT');
      return;
    }

    intervalRef.current = setInterval(() => {
      setReasoningStep((prev) => {
        const idx = REASONING_STEPS.indexOf(prev);
        return REASONING_STEPS[(idx + 1) % REASONING_STEPS.length];
      });
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPanelOpen]);

  const navGroupsByJourney = [
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

  const activeGroup = navGroupsByJourney.find((g) => (g.items as TabType[]).includes(activeTab));

  if (!activeGroup) return null;
  const agent = AGENTS_BY_PILLAR[activeGroup.title];
  if (!agent) return null;

  const handleAvatarClick = () => {
    SoundFX.play('focus');
    setIsPanelOpen((prev) => !prev);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handleSend = () => {
    if (!question.trim()) return;
    console.log(`[${agent.name}] Pergunta recebida: "${question.trim()}"`);
    setQuestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      {/* Floating Agent Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            key="agent-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: 'rgba(6,13,26,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
            className="w-[300px] rounded-2xl border border-white/10 shadow-2xl p-4 flex flex-col gap-4"
          >
            {/* Header: agent info + close */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${agent.color} shadow-inner flex-shrink-0`}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${agent.seed}&backgroundColor=transparent`}
                    alt={`Avatar do agente ${agent.name}`}
                    className="w-7 h-7 drop-shadow-md"
                  />
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-surface shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold text-white leading-none">
                      {agent.name}
                    </span>
                    <Sparkles className="w-3 h-3 text-brand opacity-80" />
                  </div>
                  <span className="text-[11px] font-medium text-white/40 leading-tight mt-0.5">
                    {agent.role}
                  </span>
                  <span className="text-[10px] text-white/30 leading-tight mt-0.5 italic">
                    {agent.monitoringContext}
                  </span>
                </div>
              </div>

              <button
                onClick={handleClosePanel}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/40 hover:text-white/80"
                aria-label="Fechar painel do agente"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5" />

            {/* Reasoning Pipeline */}
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-3">
                Esteira de raciocínio
              </p>
              <AiReasoningPipeline currentStep={reasoningStep} />
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5" />

            {/* Question input */}
            <div className="flex flex-col gap-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Pergunte algo para ${agent.name}...`}
                rows={3}
                className="w-full resize-none rounded-lg bg-white/5 border border-white/10 text-white/80 placeholder:text-white/25 text-[12px] px-3 py-2 outline-none focus:border-white/20 focus:bg-white/[0.07] transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!question.trim()}
                className="flex items-center justify-center gap-1.5 w-full rounded-lg py-2 text-[12px] font-semibold bg-brand/80 hover:bg-brand disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleAvatarClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center bg-surface-elevated/95 backdrop-blur-xl border border-white/10 p-1.5 pr-4 rounded-full shadow-2xl overflow-hidden group cursor-pointer"
      >
        {/* Fundo brilhante animado quando hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />

        {/* Avatar Miniatura do Agente (Bottts neutral) */}
        <div
          className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${agent.color} shadow-inner`}
        >
          <img
            src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${agent.seed}&backgroundColor=transparent`}
            alt={`Avatar do agente ${agent.name}`}
            className="w-7 h-7 drop-shadow-md"
          />
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-surface shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        </div>

        {/* Informacoes e Comando de Voz */}
        <div className="ml-3 flex flex-col items-start justify-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold text-white leading-none">{agent.name}</span>
            <Sparkles className="w-3 h-3 text-brand opacity-80" />
          </div>

          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="command"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-1 mt-0.5"
              >
                <Mic className="w-3 h-3 text-white/70 animate-pulse" />
                <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wide">
                  Diga "{agent.command}"
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="role"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-0.5"
              >
                <span className="text-[10px] font-medium text-white/40 leading-none">
                  {agent.role}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
}
