// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { TestSimulatorModal } from '@/features/voice-hub/components/studio/panels/TestSimulatorModal.js';

describe('Voice Studio demo simulator', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('mounts without a reference error and discloses that its answers are demonstrative', () => {
    const onClose = vi.fn();
    render(<TestSimulatorModal onClose={onClose} />);

    expect(screen.getByText(/Modo Demo \(mock\)/)).toBeTruthy();
    expect(screen.getByText(/não com o LLM\/prompt configurado no Canvas/)).toBeTruthy();
  });
});
