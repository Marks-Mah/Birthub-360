import type { User, IntegrationsConfig } from '../types.js';

// Decide qual webhook do Bitrix24 usar. Por padrão ('auto') segue a marca do
// usuário logado, para acabar com o risco de mandar um lead da Atlas para o
// Bitrix da Total Trac (ou vice-versa) por causa de um seletor manual esquecido
// na posição errada. 'totaltrac'/'birthhub360'/'custom' continuam disponíveis como
// substituição explícita para quem realmente precisa.
export function resolveBitrixWebhook(
  user: User | null | undefined,
  config: IntegrationsConfig | undefined,
): string {
  const target = config?.activeBitrixTarget || 'auto';

  if (target === 'custom') {
    return config?.customBitrixWebhook || '';
  }
  if (target === 'birthhub360') {
    return config?.bitrixAtlasGrWebhook || 'https://birthhub360.bitrix24.com.br/rest/';
  }
  if (target === 'totaltrac') {
    return config?.bitrixBirthhub360Webhook || '';
  }

  // 'auto'
  if (user?.company === 'atlas') {
    return config?.bitrixAtlasGrWebhook || 'https://birthhub360.bitrix24.com.br/rest/';
  }
  return config?.bitrixBirthhub360Webhook || '';
}
