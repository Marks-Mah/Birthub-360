import React from 'react';
import { Sidebar } from './Sidebar';
import { AppTopbar } from './AppTopbar';
import { OfflineBanner } from './OfflineBanner';
import { DataFlowLines } from '../ui/DataFlowLines';
import { VoiceCommandWidget } from '../ui/VoiceCommandWidget';
import { useNavigationState } from './hooks/useNavigationState';
import { MobileNavDrawer } from './MobileNavDrawer';
import type { TabType } from './tabMeta';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export function MainLayout({ children, activeTab }: MainLayoutProps) {
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useNavigationState();

  return (
    <div className="relative flex min-h-screen bg-background text-foreground antialiased selection:bg-brand selection:text-on-brand">
      <OfflineBanner />

      {/* Sidebar Desktop Estática */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30 border-r border-border-subtle bg-surface">
        <Sidebar activeTab={activeTab as TabType} />
      </aside>

      {/* Drawer Mobile Desacoplado */}
      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={closeMobileNav}
        activeTab={activeTab as TabType}

      />

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <AppTopbar onOpenMobileNav={toggleMobileNav} activeTab={activeTab as TabType} />

        <main className="relative flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <DataFlowLines />
          {children}
        </main>
      </div>

      <VoiceCommandWidget />
    </div>
  );
}
