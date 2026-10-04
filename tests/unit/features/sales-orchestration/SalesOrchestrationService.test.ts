import { describe, it, expect, vi } from 'vitest';
import { SalesOrchestrationService } from '../../../../src/features/sales-orchestration/server/SalesOrchestrationService.js';

describe('SalesOrchestrationService', () => {
  it('deve retornar overview com KPIs, playbooks, jornadas, processos e roteiros', async () => {
    const mockDb: any = {
      playbookInsight: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      cadenceSequence: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      qualificationMatrixItem: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    };

    const service = new SalesOrchestrationService(mockDb, 'org-test-123');
    const overview = await service.getOverview();

    expect(overview).toBeDefined();
    expect(overview.kpis.playbooksAtivos).toBeGreaterThan(0);
    expect(overview.playbooks.length).toBeGreaterThan(0);
    expect(overview.jornadas.length).toBe(5);
    expect(overview.processos.length).toBe(4);
    expect(overview.roteiros.length).toBe(4);
  });
});
