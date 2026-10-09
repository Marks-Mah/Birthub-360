/**
 * Utilitários Open Source de Deduplicação e Similaridade Textual (RapidFuzz / Levenshtein)
 * e Normalização de Telefones e CNPJ (LibPhoneNumber / E.164)
 */

export class TextSimilarityUtil {
  /**
   * Distância Levenshtein pura e rápida para comparação textual sem dependências externas compiladas
   */
  public static levenshtein(a: string, b: string): number {
    const s1 = a.trim().toLowerCase();
    const s2 = b.trim().toLowerCase();

    if (s1 === s2) return 0;
    if (s1.length === 0) return s2.length;
    if (s2.length === 0) return s1.length;

    const row: number[] = [];
    for (let i = 0; i <= s2.length; i++) {
      row[i] = i;
    }

    for (let i = 1; i <= s1.length; i++) {
      let prev = i;
      for (let j = 1; j <= s2.length; j++) {
        const val = s1[i - 1] === s2[j - 1] ? row[j - 1] : Math.min(row[j - 1], prev, row[j]) + 1;
        row[j - 1] = prev;
        prev = val;
      }
      row[s2.length] = prev;
    }

    return row[s2.length];
  }

  /**
   * Retorna um score de similaridade entre 0.0 e 1.0 (1.0 = idêntico)
   */
  public static similarityRatio(a: string, b: string): number {
    const s1 = (a || '').trim().toLowerCase();
    const s2 = (b || '').trim().toLowerCase();
    if (!s1 || !s2) return 0;
    if (s1 === s2) return 1.0;

    const distance = TextSimilarityUtil.levenshtein(s1, s2);
    const maxLen = Math.max(s1.length, s2.length);
    return Math.max(0, 1 - distance / maxLen);
  }

  /**
   * Remove sufixos jurídicos comuns como "LTDA", "S.A.", "ME", "EPP", "EIRELI" para comparação de nomes
   */
  public static sanitizeCompanyName(name: string): string {
    return (name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[.,\-\/]/g, ' ')
      .replace(
        /\b(LTDA|S\.?A\.?|ME|EPP|EIRELI|SOCIEDADE ANONIMA|LIMITADA|SERVICOS|COMERCIO|DO BRASIL|BRASIL)\b/g,
        '',
      )
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Verifica se dois nomes de empresas referem-se à mesma entidade com base em nome limpo ou razão social
   */
  public static isLikelySameCompany(nameA: string, nameB: string, threshold = 0.85): boolean {
    const cleanA = TextSimilarityUtil.sanitizeCompanyName(nameA);
    const cleanB = TextSimilarityUtil.sanitizeCompanyName(nameB);
    if (!cleanA || !cleanB) return false;
    if (cleanA === cleanB) return true;
    if (cleanA.includes(cleanB) || cleanB.includes(cleanA)) return true;
    return TextSimilarityUtil.similarityRatio(cleanA, cleanB) >= threshold;
  }
}

export class PhoneNormalizationUtil {
  /**
   * Normaliza um telefone brasileiro para o formato internacional E.164 (+55...)
   * Trata código de país, DDD de 2 dígitos e números fixos (8 dígitos) e celulares (9 dígitos)
   */
  public static toE164(phone: string): { e164: string; ddd: string; isMobile: boolean } | null {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, '');

    // Caso já venha com 55 na frente:
    let national = digits;
    if (national.startsWith('55') && national.length >= 12) {
      national = national.slice(2);
    }

    if (national.length === 10) {
      // DDD + 8 dígitos (fixo)
      const ddd = national.slice(0, 2);
      return {
        e164: `+55${national}`,
        ddd,
        isMobile: false,
      };
    } else if (national.length === 11) {
      // DDD + 9 dígitos (celular)
      const ddd = national.slice(0, 2);
      const isMobile = national[2] === '9';
      return {
        e164: `+55${national}`,
        ddd,
        isMobile,
      };
    }

    return null;
  }

  /**
   * Formata telefone para exibição amigável: (11) 98765-4321 ou (11) 3456-7890
   */
  public static formatNational(phone: string): string {
    const parsed = PhoneNormalizationUtil.toE164(phone);
    if (!parsed) return phone;
    const digits = parsed.e164.replace('+55', '');
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    if (rest.length === 9) {
      return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
    }
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
}
