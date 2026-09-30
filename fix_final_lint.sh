#!/bin/bash
git checkout src/lib/voice-hub/features/prospecting/services/voice.service.test.ts
cat << 'INNER_EOF' > src/lib/voice-hub/features/prospecting/services/voice.service.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Birthhub360OutboundPayload } from '../validators/birthhub360.schema.js';

vi.mock('../lib/webhookIdempotency.js', () => ({
  buildBirthhub360OutboundIdempotencyKey: vi
    .fn()
    .mockReturnValue('idempotency:birthhub360-outbound-call:hash:test'),
  claimIdempotencyKey: vi.fn(),
}));

vi.mock('../../../services/settingService.js', () => ({
  getAiConsent: vi.fn(),
}));

import { claimIdempotencyKey } from '../lib/webhookIdempotency.js';
import { getAiConsent } from '../../../services/settingService.js';
import { BlandConfigurationError, VoiceProspectingService } from './voice.service.js';

const mockClaim = vi.mocked(claimIdempotencyKey);
const mockGetAiConsent = vi.mocked(getAiConsent);

const basePayload: Birthhub360OutboundPayload = {
  phone_number: '+5511999998888',
  name: 'Fulano de Tal',
  company: 'Acme Logística',
};

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.clearAllMocks();
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe('VoiceProspectingService.dispatchBirthhub360Outbound', () => {
  it('should throw BlandConfigurationError if BLAND_API_KEY is not defined', async () => {
    delete process.env.BLAND_API_KEY;
    const service = new VoiceProspectingService();
    await expect(service.dispatchBirthhub360Outbound(basePayload)).rejects.toThrow(
      BlandConfigurationError,
    );
  });

  it('should throw Error if AI consent is false', async () => {
    process.env.BLAND_API_KEY = 'bland-test-key';
    mockGetAiConsent.mockResolvedValue(false);

    const service = new VoiceProspectingService();
    await expect(service.dispatchBirthhub360Outbound(basePayload)).rejects.toThrow(
      'Lead não possui consentimento para IA/contato ativo',
    );
  });

  it('should return already_claimed if idempotency key is already used', async () => {
    process.env.BLAND_API_KEY = 'bland-test-key';
    mockGetAiConsent.mockResolvedValue(true);
    mockClaim.mockResolvedValue(false); // Já usado

    const service = new VoiceProspectingService();
    const result = await service.dispatchBirthhub360Outbound(basePayload);
    expect(result).toEqual({ status: 'already_claimed' });
  });

  it('should throw if Bland API fetch fails', async () => {
    process.env.BLAND_API_KEY = 'bland-test-key';
    process.env.BLAND_PATHWAY_ID_B2B_OUTBOUND = 'path-123';
    process.env.BLAND_VOICE_ID = 'voice-123';
    mockGetAiConsent.mockResolvedValue(true);
    mockClaim.mockResolvedValue(true);

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad request' }),
    } as Response);

    const service = new VoiceProspectingService();
    await expect(service.dispatchBirthhub360Outbound(basePayload)).rejects.toThrow(
      'Falha ao despachar call: 400 - {"message":"Bad request"}',
    );

    fetchSpy.mockRestore();
  });

  it('should return dispatched if successful', async () => {
    process.env.BLAND_API_KEY = 'bland-test-key';
    process.env.BLAND_PATHWAY_ID_B2B_OUTBOUND = 'path-123';
    process.env.BLAND_VOICE_ID = 'voice-123';
    process.env.NRO_TLF_PADRAO = '+5511900000000';
    mockGetAiConsent.mockResolvedValue(true);
    mockClaim.mockResolvedValue(true);

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ call_id: 'bland-call-abc' }),
    } as Response);

    const service = new VoiceProspectingService();
    const result = await service.dispatchBirthhub360Outbound(basePayload);

    expect(result).toEqual({
      status: 'dispatched',
      blandCallId: 'bland-call-abc',
    });

    expect(fetchSpy).toHaveBeenCalledWith('https://api.bland.ai/v1/calls', {
      method: 'POST',
      headers: {
        authorization: 'bland-test-key',
        'content-type': 'application/json',
      },
      body: expect.stringContaining('"pathway_id":"path-123"'),
    });

    fetchSpy.mockRestore();
  });
});
INNER_EOF
