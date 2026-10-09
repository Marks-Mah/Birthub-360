- De: 09 (Mobile)
- Para: 02 (Produto e UX)
- Onda: 15
- Status: aberto
- Prioridade: alto

## Problema
O suporte a operação offline no aplicativo móvel Android (Capacitor) e PWA exige sinalização visual clara sobre o estado de sincronização (Online / Offline / Sincronizando alterações locais pendentes) no shell principal da aplicação.

## Arquivo(s) envolvido(s)
- `src/App.tsx`
- `src/components/layout/`
- `src/features/mobile/**`

## Alteração necessária
O Agente 02 deve:
1. Incluir indicador visual de conectividade no header/shell da aplicação (`OfflineBadge` / `SyncIndicator`).
2. Exibir banner não intrusivo quando a aplicação alternar para o modo offline, informando que ações serão armazenadas localmente e sincronizadas quando a conexão retornar.

## Teste esperado
- Comportamento de transição de status de rede testado via evento `navigator.onLine`.
