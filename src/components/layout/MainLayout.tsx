import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { AppTopbar } from './AppTopbar';
import { OfflineBanner } from './OfflineBanner';
import { DataFlowLines } from '../ui/DataFlowLines';
import { VoiceCommandWidget } from '../ui/VoiceCommandWidget';
import { useNavigationState } from './hooks/useNavigationState';
import { MobileNavDrawer } from './MobileNavDrawer';
import type { TabType } from './tabMeta';

interface MainLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

export function MainLayout({ children, activeTab }: MainLayoutProps) {
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useNavigationState();

  return (
    <div className="relative flex h-screen h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-background to-surface-2 text-foreground antialiased selection:bg-brand selection:text-on-brand">
      <OfflineBanner />

      {/* Sidebar Desktop gerencia o proprio fixed e collapse */}
      <Sidebar activeTab={activeTab as TabType} />

      {/* Drawer Mobile Desacoplado */}
      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={closeMobileNav}
        activeTab={activeTab as TabType}
      />

      {/* Conteudo Principal */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <AppTopbar onOpenMobileNav={toggleMobileNav} activeTab={activeTab as TabType} />

        <main className="relative flex-1 overflow-y-auto">
          <DataFlowLines />
          {children}
        </main>
      </div>

      <VoiceCommandWidget />
    </div>
  );
}
