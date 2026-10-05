/** Subconjunto da identidade (espelha `src/config/brand.ts` da plataforma). */
export const BRAND = {
  name: 'Birth Hub 360°',
  subbrand: 'COMMAND CENTER',
  tagline: 'COMMERCIAL INTELLIGENCE & EXECUTION PLATFORM',
  slogan: 'DADOS QUE CONECTAM. INTELIGÊNCIA QUE DECIDE. RESULTADOS QUE ACONTECEM.',
  description:
    'Conecte CRM, dados, inteligência artificial e automação em um único centro de comando para planejar, monitorar, prever e acelerar suas operações comerciais.',
  credit: 'Desenvolvido pelo Coordenador Comercial Marcelo do Nascimento',
} as const;

/** URL da plataforma; sem a env, cai no caminho relativo (landing servida junto do app). */
export const APP_URL = (import.meta.env.VITE_APP_URL ?? '').replace(/\/$/, '');
export const LOGIN_URL = `${APP_URL}/login`;
