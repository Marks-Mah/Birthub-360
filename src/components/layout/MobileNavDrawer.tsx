import React from 'react';
import { Sidebar } from './Sidebar.js';
import type { TabType } from './tabMeta.js';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export function MobileNavDrawer({ isOpen, onClose, activeTab }: MobileNavDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Backdrop Semântico e Acessível */}
      <button
        type="button"
        aria-label="Fechar menu de navegação"
        onClick={onClose}
        className="fixed inset-0 bg-overlay/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      />

      {/* Gaveta da Sidebar Mobile */}
      <aside
        aria-label="Navegação móvel"
        className="relative z-50 flex h-full w-72 max-w-[80vw] flex-col bg-surface border-r border-border-subtle shadow-2xl animate-slide-in-left"
      >
        <Sidebar activeTab={activeTab as TabType} onCloseMobile={onClose} mobileOpen={isOpen} />
      </aside>
    </div>
  );
}
