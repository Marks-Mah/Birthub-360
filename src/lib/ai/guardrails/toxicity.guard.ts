/**
 * Guardrails para toxicidade
 * Detecta e redige palavras ofensivas em português
 */

const TOXIC_WORDS_PT = [
  // Palavras ofensivas comuns em português
  'idiota',
  'idiotas',
  'estúpido',
  'burro',
  'retardado',
  'imbecil',
  'otário',
  'besta',
  'inútil',
  'merda',
  'caralho',
  'porra',
  'puta',
  'desgraça',
  'maldito',
  'foda-se',
  'se foder',
  'arrombado',
  'bando de merda',
  'filho da puta',
  'vai pra puta que pariu',
  'vai se foder',
  'cú',
  'boceta',
  'caralho',
  'porra',
  'merda',
];

export interface ToxicityResult {
  toxic: boolean;
  redacted?: string;
  reason?: string;
  matches: string[];
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getWordRegex(word: string): RegExp {
  return new RegExp(`(^|[^\\p{L}\\p{N}_])${escapeRegex(word)}(?=[^\\p{L}\\p{N}_]|$)`, 'gui');
}

export function detectToxicity(text: string): ToxicityResult {
  const matches: string[] = [];

  for (const word of TOXIC_WORDS_PT) {
    const regex = getWordRegex(word);
    if (regex.test(text)) {
      if (!matches.includes(word)) {
        matches.push(word);
      }
    }
  }

  if (matches.length > 0) {
    return {
      toxic: true,
      reason: 'Toxic language detected',
      matches,
    };
  }

  return {
    toxic: false,
    matches: [],
  };
}

export function redactToxicity(text: string): { redacted: string; matches: string[] } {
  const matches: string[] = [];
  let redacted = text;

  for (const word of TOXIC_WORDS_PT) {
    const regex = getWordRegex(word);
    if (regex.test(redacted)) {
      if (!matches.includes(word)) {
        matches.push(word);
      }
      redacted = redacted.replace(regex, '$1[REDACTED]');
    }
  }

  return { redacted, matches };
}
