import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Cpu,
  Flame,
  Globe,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from './Badge.js';
import { Button } from './Button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card.js';
import { CyberInput } from './CyberInput.js';
import { GamificationWidget } from './GamificationWidget.js';
import { HolographicCard } from './HolographicCard.js';
import { AnimatedIcon } from './icons/AnimatedIcon.js';
import {
  FlameStreakIcon,
  Gem3DIcon,
  ShieldSecurityIcon,
  Trophy3DIcon,
} from './icons/Isometric3DIcons.js';
import { KpiCard } from './KpiCard.js';
import { NeonButton } from './NeonButton.js';
import { ParticleSystem } from './ParticleSystem.js';
import { TabNavCards } from './TabNavCards.js';
import { ThemeSwitcher, type ThemeStyle } from './ThemeSwitcher.js';
import { Toggle } from './Toggle.js';

export function StyleShowcase() {
  const [currentStyle, setCurrentStyle] = useState<ThemeStyle>('classic');
  const [toggles, setToggles] = useState({ classic: true, neon: true, cyber: true });
  const [activeTabId, setActiveTabId] = useState('pipeline');

  return (
    <div className="min-h-screen bg-bg text-ink p-6 md:p-10 font-sans">
      {/* Partículas de atmosfera */}
      <ParticleSystem count={25} color="mixed" intensity="low" />

      {/* Header Institucional 2026 */}
      <div className="relative z-10 mb-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/35 bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Design System & Tendências 2026
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-brand via-brand-2 to-white bg-clip-text text-transparent">
            Spatial UI, Elementos 3D & Gamificação
          </h1>
          <p className="mt-3 text-ink-2 text-base max-w-3xl leading-relaxed">
            Catálogo completo com botões táteis especulares, ícones SVG 3D isométricos, cards com
            holofote de cursor em tempo real, física de movimento e enxame de gamificação 3D
            interativo.
          </p>
        </motion.div>

        <div className="mt-5">
          <ThemeSwitcher currentStyle={currentStyle} onStyleChange={setCurrentStyle} />
        </div>
      </div>

      {/* SEÇÃO 1: Centro de Gamificação & Elemento 3D Interativo */}
      <section className="relative z-10 mb-12">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
              <Trophy className="h-5 w-5 text-brand" />
              1. Enxame de Gamificação Comercial & Cristal 3D Interativo
            </h2>
            <p className="text-xs text-ink-2">
              Clique no Cristal 3D para obter impulsos de energia (+XP e confetes reais via Canvas).
            </p>
          </div>
        </div>

        <GamificationWidget initialXp={650} level={2} streakDays={3} />
      </section>

      {/* SEÇÃO 2: Botões Modernos 2026 */}
      <section className="relative z-10 mb-12">
        <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-brand" />
          2. Botões com Tendências 2026 (Micro-interações, Brilho Especular & Áudio)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cosmic Gold */}
          <Card variant="bento" padding="sm" spotlight>
            <h4 className="font-bold text-xs uppercase tracking-wider text-brand mb-2">
              Cosmic Gold
            </h4>
            <p className="text-xs text-ink-2 mb-3">
              Gradiente com reflexo de feixe luminoso contínuo no hover e sombra dourada.
            </p>
            <Button
              variant="cosmic"
              size="sm"
              magnetic
              sound="success"
              soundHover
              className="w-full"
            >
              <Sparkles className="h-3.5 w-3.5 text-on-brand" /> Cosmic Action
            </Button>
          </Card>

          {/* Holographic */}
          <Card variant="bento" padding="sm" spotlight>
            <h4 className="font-bold text-xs uppercase tracking-wider text-iris mb-2">
              Holographic
            </h4>
            <p className="text-xs text-ink-2 mb-3">
              Vidro com refração prismática sutil e iluminação translúcida.
            </p>
            <Button
              variant="holographic"
              size="sm"
              magnetic
              sound="confirm"
              soundHover
              className="w-full"
            >
              <Globe className="h-3.5 w-3.5 text-iris" /> Hologram Touch
            </Button>
          </Card>

          {/* Cyber Tech */}
          <Card variant="bento" padding="sm" spotlight>
            <h4 className="font-bold text-xs uppercase tracking-wider text-accent-cyan mb-2">
              Cyber Cyan
            </h4>
            <p className="text-xs text-ink-2 mb-3">
              Tipografia mono com bordas néon e micro-detalhes de alta precisão.
            </p>
            <Button variant="cyber" size="sm" magnetic sound="click" soundHover className="w-full">
              <Cpu className="h-3.5 w-3.5 text-accent-cyan" /> EXECUTE_NODE
            </Button>
          </Card>

          {/* Magnetic Primary */}
          <Card variant="bento" padding="sm" spotlight>
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink mb-2">
              Magnético Tátil
            </h4>
            <p className="text-xs text-ink-2 mb-3">
              Física de atração magnética seguindo o cursor com spring suave.
            </p>
            <Button
              variant="default"
              size="sm"
              magnetic
              sound="navigate"
              soundHover
              className="w-full"
            >
              <Rocket className="h-3.5 w-3.5 text-on-brand" /> Atração Spring
            </Button>
          </Card>
        </div>
      </section>

      {/* SEÇÃO 3: Ícones SVG 3D Isométricos & Micro-animações */}
      <section className="relative z-10 mb-12">
        <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-brand" />
          3. Ícones SVG 3D Isométricos & Sistema AnimatedIcon
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card
            variant="bento"
            padding="sm"
            spotlight
            className="flex flex-col items-center text-center"
          >
            <Trophy3DIcon size={44} animate />
            <h4 className="mt-2 font-bold text-xs text-ink">Troféu 3D</h4>
            <p className="text-[10px] text-ink-2">Reflexo Especular</p>
          </Card>

          <Card
            variant="bento"
            padding="sm"
            spotlight
            className="flex flex-col items-center text-center"
          >
            <Gem3DIcon size={44} animate />
            <h4 className="mt-2 font-bold text-xs text-ink">Gema 3D</h4>
            <p className="text-[10px] text-ink-2">Refração Cósmica</p>
          </Card>

          <Card
            variant="bento"
            padding="sm"
            spotlight
            className="flex flex-col items-center text-center"
          >
            <FlameStreakIcon size={44} animate />
            <h4 className="mt-2 font-bold text-xs text-ink">Chama Streak</h4>
            <p className="text-[10px] text-ink-2">Labareda Multi-camada</p>
          </Card>

          <Card
            variant="bento"
            padding="sm"
            spotlight
            className="flex flex-col items-center text-center"
          >
            <ShieldSecurityIcon size={44} animate />
            <h4 className="mt-2 font-bold text-xs text-ink">Escudo 3D</h4>
            <p className="text-[10px] text-ink-2">Segurança LGPD</p>
          </Card>

          <Card
            variant="bento"
            padding="sm"
            spotlight
            className="flex flex-col items-center text-center"
          >
            <AnimatedIcon
              icon={Sparkles}
              animation="glow"
              glowColor="brand"
              size="lg"
              badge
              interactive
            />
            <h4 className="mt-2 font-bold text-xs text-ink">AnimatedIcon</h4>
            <p className="text-[10px] text-ink-2">Efeito Glow</p>
          </Card>

          <Card
            variant="bento"
            padding="sm"
            spotlight
            className="flex flex-col items-center text-center"
          >
            <AnimatedIcon
              icon={Rocket}
              animation="float"
              glowColor="cyan"
              size="lg"
              badge
              interactive
            />
            <h4 className="mt-2 font-bold text-xs text-ink">AnimatedIcon</h4>
            <p className="text-[10px] text-ink-2">Efeito Float 3D</p>
          </Card>
        </div>
      </section>

      {/* SEÇÃO 4: Cards Espaciais com Spotlight de Cursor em Tempo Real */}
      <section className="relative z-10 mb-12">
        <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-brand" />
          4. Cards 2026 (Spotlight Interativo & Bento Grid)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="bento" spotlight soundHover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Bento Card 2026</CardTitle>
                <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold text-brand">
                  Spotlight Ativo
                </span>
              </div>
              <CardDescription>
                Passe o cursor sobre este card para visualizar o holofote especular acompanhando o
                mouse.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-ink-2">
                Simula iluminação física em tempo real utilizando coordenadas relativas do ponteiro
                sem comprometer a taxa de quadros (60+ FPS).
              </p>
            </CardContent>
          </Card>

          <Card variant="cosmic" spotlight soundHover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cosmic Specular</CardTitle>
                <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[10px] font-bold text-brand">
                  Dourado Cósmico
                </span>
              </div>
              <CardDescription>
                Borda metálica iluminada com acentos da marca e vidro fosco de alta profundidade.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-ink-2">
                Ideal para widgets analíticos, KPIs de alta relevância comercial e destaques de
                liderança.
              </p>
            </CardContent>
          </Card>

          <Card variant="specular" spotlight soundHover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Vidro Especular</CardTitle>
                <span className="rounded-full bg-accent-cyan/15 px-2 py-0.5 text-[10px] font-bold text-accent-cyan">
                  Glassmorphism 2.0
                </span>
              </div>
              <CardDescription>
                Reflexo interno com sombra volumétrica suave e contorno translúcido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-ink-2">
                Aderente a WCAG AA com contraste calculado e suporte imediato a temas escuro e
                claro.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SEÇÃO 5: KPIs, Badges e Navegação Espacial 2026 */}
      <section className="relative z-10 mb-12">
        <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-brand" />
          5. KPIs Inteligentes com Spotlight & Navegação Espacial
        </h2>

        {/* TabNavCards */}
        <div className="mb-6">
          <TabNavCards
            items={[
              {
                id: 'pipeline',
                icon: Activity,
                title: 'Pipeline Ativo',
                subtitle: 'R$ 2.4M sob gestão',
              },
              {
                id: 'ai-agents',
                icon: Cpu,
                title: 'Agentes de IA',
                subtitle: '7 robôs autônomos 24/7',
              },
              { id: 'conversion', icon: Target, title: 'Meta do Mês', subtitle: '88% atingida' },
              {
                id: 'sdr-team',
                icon: Users,
                title: 'Equipe SDR',
                subtitle: '12 operadores ativos',
              },
            ]}
            activeId={activeTabId}
            onSelect={setActiveTabId}
          />
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            icon={Activity}
            label="Leads Qualificados"
            value="1.248"
            caption="Últimos 30 dias com enriquecimento IA"
            tone="brand"
            trend={{ value: '+18.4%', isPositive: true }}
            onSelect={() => {}}
          />
          <KpiCard
            icon={Target}
            label="Reuniões Agendadas"
            value="342"
            caption="Taxa de conversão de 28.5%"
            tone="ok"
            trend={{ value: '+8.2%', isPositive: true }}
            onSelect={() => {}}
          />
          <KpiCard
            icon={Zap}
            label="Pressão Comercial"
            value="94.2"
            caption="Índice de engajamento outbound"
            tone="cyan"
            trend={{ value: '+5.1%', isPositive: true }}
            onSelect={() => {}}
          />
          <KpiCard
            icon={Trophy}
            label="Receita em Pipeline"
            value="R$ 1.85M"
            caption="Previsão de fechamento no ciclo"
            tone="gold"
            trend={{ value: '-2.4%', isPositive: false }}
            onSelect={() => {}}
          />
        </div>

        {/* Badges 2026 com Pulse Dot */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-line bg-surface/60 backdrop-blur-md">
          <span className="text-xs font-bold text-ink-2 mr-2">Status ao Vivo (2026 Badges):</span>
          <Badge variant="cosmic" dot>
            Operação Ativa 24/7
          </Badge>
          <Badge variant="success" dot>
            Banco de Dados Conectado
          </Badge>
          <Badge variant="warning" dot>
            Sincronização Bitrix24
          </Badge>
          <Badge variant="cyan" dot>
            Enxame Autônomo
          </Badge>
          <Badge variant="holographic">Prismatic Sheen</Badge>
        </div>
      </section>

      {/* SEÇÃO 6: Laboratório de Efeitos & Toggles */}
      <section className="relative z-10 mb-12">
        <HolographicCard variant="mixed" intensity="low">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
            <Shield className="text-brand" size={24} />
            Laboratório de Efeitos & Controles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Toggles */}
            <div className="space-y-4">
              <h4 className="font-semibold text-xs text-ink-2 uppercase tracking-wider">
                Toggles Táteis
              </h4>
              <Toggle
                checked={toggles.classic}
                onChange={(v) => setToggles((t) => ({ ...t, classic: v }))}
                label="Modo Clássico"
                variant="classic"
              />
              <Toggle
                checked={toggles.neon}
                onChange={(v) => setToggles((t) => ({ ...t, neon: v }))}
                label="Modo Neon"
                variant="neon"
                glowColor="cyan"
              />
              <Toggle
                checked={toggles.cyber}
                onChange={(v) => setToggles((t) => ({ ...t, cyber: v }))}
                label="Modo Cyber"
                variant="cyber"
                glowColor="purple"
              />
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <h4 className="font-semibold text-xs text-ink-2 uppercase tracking-wider">
                Cyber Inputs
              </h4>
              <CyberInput variant="neon" glowColor="cyan" placeholder="Input Neon..." />
              <CyberInput variant="glass" placeholder="Input Glass..." />
              <CyberInput variant="metallic" placeholder="Input Metálico..." />
            </div>

            {/* Botões Néon */}
            <div className="space-y-4">
              <h4 className="font-semibold text-xs text-ink-2 uppercase tracking-wider">
                Neon Tokyo Buttons
              </h4>
              <div className="flex flex-wrap gap-2">
                <NeonButton variant="cyan" size="sm">
                  Cyan
                </NeonButton>
                <NeonButton variant="purple" size="sm">
                  Purple
                </NeonButton>
                <NeonButton variant="gold" size="sm">
                  Gold
                </NeonButton>
                <NeonButton variant="green" size="sm">
                  Green
                </NeonButton>
              </div>
            </div>
          </div>
        </HolographicCard>
      </section>

      {/* Rodapé CTA */}
      <div className="relative z-10 text-center py-10">
        <h3 className="text-2xl font-bold mb-2">Pronto para a Experiência 2026?</h3>
        <p className="text-ink-2 text-sm mb-6 max-w-lg mx-auto">
          Todos os componentes foram construídos com foco em acessibilidade, suporte a
          prefers-reduced-motion e alto rendimento gráfico.
        </p>
        <Button variant="cosmic" size="lg" magnetic sound="success" shine className="gap-2">
          <span>Explorar Central de Inteligência</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
