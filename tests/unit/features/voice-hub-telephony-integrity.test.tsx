// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Telephony from '@/features/voice-hub/pages/Telephony.js';
import DashboardTelephony from '@/features/voice-hub/pages/Dashboard/Telephony.js';

describe.each([
  ['Voice Hub', Telephony],
  ['Dashboard', DashboardTelephony],
] as const)('%s telephony data integrity', (_label, Page) => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('never presents invented DID prices, active numbers or provider connections as tenant data', () => {
    render(<Page />);

    expect(screen.getByText(/Nenhuma disponibilidade ou tarifa foi consultada/)).toBeInTheDocument();
    expect(screen.getByText(/Inventário de números ainda não integrado/)).toBeInTheDocument();
    expect(screen.getByText(/Esta tela não consulta nem altera essas políticas/)).toBeInTheDocument();
    expect(screen.getByText(/Nenhuma conexão será criada aqui/)).toBeInTheDocument();

    expect(screen.queryByText('R$ 15,00/mês')).not.toBeInTheDocument();
    expect(screen.queryByText('+55 11 4004-9999')).not.toBeInTheDocument();
    expect(screen.queryByText('+55 11 99999-0000')).not.toBeInTheDocument();
    expect(screen.queryByText('Ativo')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Buscar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Configurar Tronco' })).not.toBeInTheDocument();
  });

  it('keeps music generation available and shows provider failures without fabricating audio', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: 'Consentimento necessário' }),
    } as Response);

    render(<Page />);
    fireEvent.click(screen.getByRole('button', { name: /Gerar Música \(30s\)/ }));

    expect(await screen.findByText('Consentimento necessário')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/generate-music',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(screen.queryByRole('audio')).not.toBeInTheDocument();
  });
});
