/**
 * Motor de Pontuação de Aderência ICP e Qualidade de Dados (0 a 100)
 * - Avalia critérios configuráveis: Segmento, CNAE, Localização, Porte, Decisor, Produtos/Serviços, Sinais
 * - Separa: ICP Score, Data Quality Score, Confidence Score
 * - Totalmente transparente, explicável e sem notas fictícias
 */

import type { ProspectCandidate, ProspectCriteria } from '../domain/prospectTypes.js';

export interface ICPScoreWeights {
  segmento: number; // Padrão: 20
  cnae: number; // Padrão: 15
  localizacao: number; // Padrão: 10
  porte: number; // Padrão: 15
  decisor: number; // Padrão: 15
  produtosServicos: number; // Padrão: 15
  sinais: number; // Padrão: 10
}

export const DEFAULT_ICP_WEIGHTS: ICPScoreWeights = {
  segmento: 20,
  cnae: 15,
  localizacao: 10,
  porte: 15,
  decisor: 15,
  produtosServicos: 15,
  sinais: 10,
};

export class ICPScoringEngine {
  /**
   * Calcula a aderência detalhada de um candidato ao perfil do ICP solicitado
   */
  public static evaluateCandidate(
    candidate: ProspectCandidate,
    criteria: ProspectCriteria,
    customWeights?: Partial<ICPScoreWeights>,
  ): {
    totalScore: number;
    breakdown: ProspectCandidate['icpBreakdown'];
    dataQualityScore: number;
    confidenceScore: number;
  } {
    const weights: ICPScoreWeights = { ...DEFAULT_ICP_WEIGHTS, ...customWeights };

    let segScore = 0;
    let cnaeScore = 0;
    let locScore = 0;
    let porteScore = 0;
    let decisorScore = 0;
    let prodScore = 0;
    let sinaisScore = 0;

    // 1. Segmento (peso: 20)
    if (criteria.segmento) {
      const target = criteria.segmento.toLowerCase();
      const candSeg = (candidate.segment || '').toLowerCase();
      if (candSeg.includes(target) || target.includes(candSeg)) {
        segScore = weights.segmento;
      } else if (
        candidate.cnaeDescricao &&
        candidate.cnaeDescricao.toLowerCase().includes(target)
      ) {
        segScore = weights.segmento * 0.8;
      }
    } else {
      segScore = weights.segmento; // Sem filtro específico de segmento
    }

    // 2. CNAE (peso: 15)
    if (criteria.cnaePrincipal) {
      const cleanTarget = criteria.cnaePrincipal.replace(/\D/g, '');
      const candCnae = (candidate.cnaePrincipal || '').replace(/\D/g, '');
      if (candCnae && candCnae.startsWith(cleanTarget.slice(0, 4))) {
        cnaeScore = weights.cnae;
      }
    } else if (candidate.cnaePrincipal) {
      cnaeScore = weights.cnae; // Possui CNAE oficial identificado
    }

    // 3. Localização (peso: 10)
    if (criteria.estado || criteria.cidade) {
      const candLoc = (candidate.location || '').toLowerCase();
      const targetUf = (criteria.estado || '').toLowerCase();
      const targetCity = (criteria.cidade || '').toLowerCase();

      if (targetCity && candLoc.includes(targetCity)) {
        locScore = weights.localizacao;
      } else if (targetUf && candLoc.includes(targetUf)) {
        locScore = weights.localizacao * 0.8;
      }
    } else {
      locScore = weights.localizacao;
    }

    // 4. Porte empresarial (peso: 15)
    if (candidate.size && candidate.size !== 'Não informado') {
      porteScore = weights.porte;
    } else if (candidate.annualRevenue != null && candidate.annualRevenue > 0) {
      porteScore = weights.porte;
    }

    // 5. Decisor compatível (peso: 15)
    if (candidate.decisionMakers && candidate.decisionMakers.length > 0) {
      const hasTargetRole =
        criteria.decisorCargos && criteria.decisorCargos.length > 0
          ? candidate.decisionMakers.some((dm) =>
              criteria.decisorCargos?.some((c) =>
                (dm.title || '').toLowerCase().includes(c.toLowerCase()),
              ),
            )
          : true;
      decisorScore = hasTargetRole ? weights.decisor : weights.decisor * 0.6;
    }

    // 6. Produtos / Serviços / Palavras-chave (peso: 15)
    if (criteria.palavrasChave || criteria.produtos || criteria.servicos) {
      const keywords =
        `${criteria.palavrasChave || ''} ${criteria.produtos || ''} ${criteria.servicos || ''}`.toLowerCase();
      const candText =
        `${candidate.tradeName} ${candidate.rationale || ''} ${candidate.technologies?.join(' ') || ''}`.toLowerCase();
      const matches = keywords.split(/[\s,]+/).filter((k) => k.length > 3 && candText.includes(k));
      if (matches.length > 0) {
        prodScore = weights.produtosServicos;
      } else {
        prodScore = weights.produtosServicos * 0.3;
      }
    } else {
      prodScore = weights.produtosServicos;
    }

    // 7. Sinais comerciais verificáveis (peso: 10)
    if (candidate.website) sinaisScore += weights.sinais * 0.4;
    if (candidate.phone) sinaisScore += weights.sinais * 0.3;
    if (candidate.icebreakerHook || (candidate.webInsights && candidate.webInsights.length > 0)) {
      sinaisScore += weights.sinais * 0.3;
    }
    sinaisScore = Math.min(weights.sinais, sinaisScore);

    const totalScore = Math.round(
      Math.min(
        100,
        segScore + cnaeScore + locScore + porteScore + decisorScore + prodScore + sinaisScore,
      ),
    );

    // Data Quality Score (completude de campos reais)
    let completeness = 0;
    if (candidate.cnpjGuess) completeness += 25;
    if (candidate.phone) completeness += 20;
    if (candidate.emails && candidate.emails.length > 0) completeness += 20;
    if (candidate.website) completeness += 15;
    if (candidate.decisionMakers && candidate.decisionMakers.length > 0) completeness += 20;

    // Confidence Score (confiabilidade das fontes)
    let confidence = 50;
    if (candidate.source === 'receita_federal') confidence = 95;
    else if (candidate.source === 'apollo' && candidate.cnpjGuess) confidence = 90;
    else if (candidate.source === 'googlePlaces') confidence = 80;

    const breakdown = {
      segmento: Math.round(segScore),
      cnae: Math.round(cnaeScore),
      localizacao: Math.round(locScore),
      porte: Math.round(porteScore),
      decisor: Math.round(decisorScore),
      produtosServicos: Math.round(prodScore),
      sinais: Math.round(sinaisScore),
      total: totalScore,
      explicacao: `Aderência calculada com base em dados observados: segmento (${Math.round(segScore)}/${weights.segmento}), localização (${Math.round(locScore)}/${weights.localizacao}), decisores (${Math.round(decisorScore)}/${weights.decisor}).`,
    };

    return {
      totalScore,
      breakdown,
      dataQualityScore: Math.round(completeness),
      confidenceScore: Math.round(confidence),
    };
  }
}
