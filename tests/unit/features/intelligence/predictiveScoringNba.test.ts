import { describe, it, expect, vi } from 'vitest';
import { predictiveScoringNbaService } from '../../../../src/features/intelligence/services/PredictiveScoringNbaService.js';
import { isQdrantConfigured } from '../../../../src/lib/qdrant/index.js';

describe('PredictiveScoringNbaService & Qdrant Integration', () => {
  it('checks qdrant configuration status safely', () => {
    const configured = isQdrantConfigured();
    expect(typeof configured).toBe('boolean');
  });

  it('generates Next Best Action via LLM fallback when called with lead params', async () => {
    const nba = await predictiveScoringNbaService.generateNextBestAction({
      leadId: 'lead_test_1',
      organizationId: 'org_test_1',
      leadName: 'Carlos Silva',
      companyName: 'TechCorp Brasil',
      stage: 'Negociação',
      recentNotes: 'Cliente pediu desconto de 15% para fechar ainda esta semana.',
      lastInteractionDaysAgo: 1,
    });

    expect(nba).toHaveProperty('recommendedAction');
    expect(nba).toHaveProperty('actionType');
    expect(nba).toHaveProperty('priority');
    expect(['Alta', 'Média', 'Baixa']).toContain(nba.priority);
  });
});
