/**
 * Testes unitários para SyncIndicator e OfflineBadge (Shell Mobile e Shell Web).
 * Cobre estados Online, Offline, Sincronizando e transição via navigator.onLine.
 * Ver .agents/handoffs/onda-15/09-para-02-shell-mobile-offline.md.
 */
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, act, waitFor } from '@testing-library/react';
import { SyncIndicator, OfflineBadge, dispatchSyncStatus } from '@/components/layout/SyncIndicator.js';

function setNavigatorOnLine(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value,
  });
}

describe('SyncIndicator & OfflineBadge', () => {
  beforeEach(() => {
    setNavigatorOnLine(true);
  });

  afterEach(() => {
    cleanup();
    setNavigatorOnLine(true);
  });

  it('renderiza o estado Online por padrão quando conectado', () => {
    render(<SyncIndicator />);
    expect(screen.getByText(/Online/i)).toBeInTheDocument();
  });

  it('transiciona para o estado Offline ao disparar evento offline', async () => {
    render(<SyncIndicator />);

    act(() => {
      setNavigatorOnLine(false);
      window.dispatchEvent(new Event('offline'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Offline/i)).toBeInTheDocument();
    });
  });

  it('OfflineBadge não renderiza nada quando Online e surge quando Offline', async () => {
    const { container } = render(<OfflineBadge />);
    expect(container.firstChild).toBeNull();

    act(() => {
      setNavigatorOnLine(false);
      window.dispatchEvent(new Event('offline'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Offline/i)).toBeInTheDocument();
    });
  });

  it('transiciona para Sincronizando ao reconectar e finaliza em Online', async () => {
    render(<SyncIndicator />);

    // Simula desconexão
    act(() => {
      setNavigatorOnLine(false);
      window.dispatchEvent(new Event('offline'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Offline/i)).toBeInTheDocument();
    });

    // Simula reconexão
    act(() => {
      setNavigatorOnLine(true);
      window.dispatchEvent(new Event('online'));
    });

    // Deve entrar em Sincronizando
    await waitFor(() => {
      expect(screen.getByText(/Sincronizando/i)).toBeInTheDocument();
    });

    // Aguarda o timer da transição para Online concluir
    await waitFor(
      () => {
        expect(screen.getByText(/Online/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('atualiza reativamente via dispatchSyncStatus', async () => {
    render(<SyncIndicator />);

    act(() => {
      dispatchSyncStatus({ status: 'syncing', pendingCount: 5 });
    });

    await waitFor(() => {
      expect(screen.getByText(/Sincronizando/i)).toBeInTheDocument();
    });
  });
});
