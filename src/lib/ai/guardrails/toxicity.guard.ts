/**
 * Guardrails para toxicidade
 * Detecta e redige palavras ofensivas em português
 */

const TOXIC_WORDS_PT = [
  // Palavras ofensivas comuns em português
  'idiota',
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

export function detectToxicity(text: string): ToxicityResult {
  const lowerText = text.toLowerCase();
  const matches: string[] = [];

  for (const word of TOXIC_WORDS_PT) {
    if (lowerText.includes(word)) {
      matches.push(word);
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
  const lowerText = text.toLowerCase();
  const matches: string[] = [];
  let redacted = text;

  for (const word of TOXIC_WORDS_PT) {
    if (lowerText.includes(word)) {
      matches.push(word);
      const regex = new RegExp(word, 'gi');
      redacted = redacted.replace(regex, '[REDACTED]');
    }
  }

  return { redacted, matches };
}
