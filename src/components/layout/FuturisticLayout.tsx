import { motion } from 'framer-motion';
import { type ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigationBusBridge } from '../../hooks/useNavigationBusBridge.js';
import { scanLineEntry, useGlobalCursorDepth } from '../../lib/motion.js';
import { BugReportButton } from '../ui/BugReportButton.js';
import { CommandPalette } from '../ui/CommandPalette.js';
import { CopilotTrigger } from '../ui/CopilotTrigger.js';
import { Toaster } from '../ui/Toaster.js';
import { VoiceCommandWidget } from '../ui/VoiceCommandWidget.js';
import { AppTopbar } from './AppTopbar.js';
import { FloatingDock } from './FloatingDock.js';
import { FuturisticSidebar } from './FuturisticSidebar.js';
import { OfflineBanner } from './OfflineBanner.js';
import { PageTransition } from './PageTransition.js';
import type { TabType } from './tabMeta.js';

interface FuturisticLayoutProps {
  children: ReactNode;
}

export function FuturisticLayout({ children }: FuturisticLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  useNavigationBusBridge();
  const activeTab = (location.pathname.split('/')[2] as TabType) || 'dashboard';
  const cursor = useGlobalCursorDepth();

  useEffect(() => {
    setMobileNavOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileNavOpen]);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-bg font-sans text-ink transition-colors duration-300">
      {/* Fundo futurista — camadas de profundidade que seguem o cursor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Grid holográfico */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Orbe Gold — camada proximal, segue cursor com parallax forte */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/18 rounded-full blur-[120px] transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${cursor.x * -32}px, ${cursor.y * -24}px)`,
          }}
        />

        {/* Orbe Iris — camada média, parallax suave */}
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-iris/12 rounded-full blur-[110px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${cursor.x * 20}px, ${cursor.y * 16}px)`,
          }}
        />

        {/* Orbe Orbit-Blue — camada distal, mínimo movimento */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-orbit-blue/8 rounded-full blur-[140px] transition-transform duration-[1400ms] ease-out"
          style={{
            transform: `translate(calc(-50% + ${cursor.x * 12}px), calc(-50% + ${cursor.y * 10}px))`,
          }}
        />

        {/* Linha de scan dourada — entra uma única vez na montagem, não repete */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent origin-left"
          variants={scanLineEntry}
          initial="hidden"
          animate="show"
          aria-hidden="true"
        />

        {/* Linha de luz inferior estática */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-iris/20 to-transparent" />
      </div>

      <OfflineBanner />

      <div className="relative z-10 flex flex-1 min-h-0 w-full">
        <FuturisticSidebar
          activeTab={activeTab}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />

        {mobileNavOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-overlay/80 backdrop-blur-md lg:hidden animate-fade-in w-full h-full cursor-default"
            aria-label="Fechar menu de navegação"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setMobileNavOpen(false);
            }}
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <AppTopbar activeTab={activeTab} onOpenMobileNav={() => setMobileNavOpen(true)} />
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative bg-transparent">
            <PageTransition id={activeTab}>{children}</PageTransition>
          </main>
          <FloatingDock activeTab={activeTab} onOpenFullMenu={() => setMobileNavOpen(true)} />
          <Toaster />
          <VoiceCommandWidget />
          <CopilotTrigger />
          <BugReportButton />
          <CommandPalette />
        </div>
      </div>
    </div>
  );
}
