import { describe, expect, it } from 'vitest';
import { ICPScoringEngine } from '../icpScoring.service.js';
import {
  PhoneNormalizationUtil,
  TextSimilarityUtil,
} from '../../utils/openSourceTextAndPhone.util.js';
import type { ProspectCandidate, ProspectCriteria } from '../../domain/prospectTypes.js';

describe('Motor Turbo — TextSimilarityUtil & PhoneNormalizationUtil', () => {
  it('calcula similaridade de nomes de empresas e sanitiza sufixos empresariais', () => {
    const rawA = 'TRANSPORTADORA RÁPIDO BRASIL LTDA ME';
    const rawB = 'Transportadora Rapido Brasil';

    expect(TextSimilarityUtil.sanitizeCompanyName(rawA)).toContain('RAPIDO');
    expect(TextSimilarityUtil.isLikelySameCompany(rawA, rawB)).toBe(true);
  });

  it('diferencia empresas nitidamente distintas', () => {
    const rawA = 'Hospital São Paulo S.A.';
    const rawB = 'Auto Peças e Mecânica Silva';
    expect(TextSimilarityUtil.isLikelySameCompany(rawA, rawB)).toBe(false);
  });

  it('normaliza telefones brasileiros para o padrão internacional E.164', () => {
    const fixo = PhoneNormalizationUtil.toE164('(11) 3456-7890');
    expect(fixo).not.toBeNull();
    expect(fixo?.e164).toBe('+551134567890');
    expect(fixo?.isMobile).toBe(false);

    const celular = PhoneNormalizationUtil.toE164('11987654321');
    expect(celular).not.toBeNull();
    expect(celular?.e164).toBe('+5511987654321');
    expect(celular?.isMobile).toBe(true);

    const formatado = PhoneNormalizationUtil.formatNational('+5511987654321');
    expect(formatado).toBe('(11) 98765-4321');
  });
});

describe('Motor Turbo — ICPScoringEngine', () => {
  it('calcula score de forma transparente e calibrada sem inventar notas', () => {
    const criteria: ProspectCriteria = {
      segmento: 'Transportadora',
      localizacao: 'São Paulo, SP',
      estado: 'SP',
      cidade: 'São Paulo',
      quantidade: 10,
      cnaePrincipal: '4930202',
      decisorCargos: ['Diretor de Logística', 'CEO'],
    };

    const candidate: ProspectCandidate = {
      tradeName: 'Log Express Logística',
      legalNameGuess: 'Log Express Transportes LTDA',
      cnpjGuess: '12345678000199',
      segment: 'Transportadora Rodoviária',
      size: '51-200',
      location: 'São Paulo, SP',
      fitScoreEstimate: 60,
      suggestedContact: null,
      rationale: 'Encontrada via base de dados',
      website: 'https://logexpress.com.br',
      phone: '(11) 3333-4444',
      emails: ['contato@logexpress.com.br'],
      cnaePrincipal: '4930202',
      decisionMakers: [
        {
          name: 'Carlos Mendes',
          title: 'Diretor de Logística',
          email: 'carlos@logexpress.com.br',
          phone: null,
          linkedinUrl: 'https://linkedin.com/in/carlosmendes',
        },
      ],
    };

    const evaluated = ICPScoringEngine.evaluateCandidate(candidate, criteria);

    expect(evaluated.totalScore).toBeGreaterThanOrEqual(70);
    expect(evaluated.breakdown?.segmento).toBe(20);
    expect(evaluated.breakdown?.cnae).toBe(15);
    expect(evaluated.breakdown?.localizacao).toBe(10);
    expect(evaluated.breakdown?.decisor).toBe(15);
    expect(evaluated.dataQualityScore).toBe(100); // CNPJ, Fone, Email, Site, Decisor
    expect(evaluated.confidenceScore).toBeGreaterThanOrEqual(50);
  });
});
