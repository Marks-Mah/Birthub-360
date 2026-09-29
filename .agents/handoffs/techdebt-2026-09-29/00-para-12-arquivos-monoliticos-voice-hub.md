- De: 00 (Coordenador)
- Para: 12 (Voz e Telefonia - Birthub Voices)
- Onda: techdebt-2026-09-29
- Status: aberto
- Prioridade: alto

## Problema

Auditoria de tech debt identificou 3 arquivos monolíticos em `src/features/voice-hub/**` que precisam ser decompostos:

1. `pages/Landing.tsx` - 2111 linhas
2. `store/useStudioStore.ts` - 1743 linhas
3. `pages/Overview.tsx` / `pages/Dashboard/Overview.tsx` - 1420 linhas (possível duplicata)

## Arquivo(s) envolvido(s)

- `src/features/voice-hub/pages/Landing.tsx` (2111 linhas)
- `src/features/voice-hub/store/useStudioStore.ts` (1743 linhas)
- `src/features/voice-hub/pages/Overview.tsx` (1420 linhas)
- `src/features/voice-hub/pages/Dashboard/Overview.tsx` (1420 linhas - possível duplicata)

## Alteração necessária

Decompor cada arquivo por responsabilidade, visando ganho claro de coesão, testabilidade e ownership:

**Para `Landing.tsx`:**
- Extrair subcomponentes por seções/abas (header, gravação, biblioteca, etc.)
- Separar hooks customizados
- Criar componentes menores e focados

**Para `useStudioStore.ts`:**
- Decompor por domain concern (estado de gravação, estado de edição, estado de exportação, etc.)
- Considerar usar composição de stores ou atomic state pattern se apropriado
- Manter apenas lógica de estado, não lógica de negócio

**Para `Overview.tsx` / `Dashboard/Overview.tsx`:**
- Investigar se são duplicatas e resolver (remover duplicata ou consolidar)
- Decompor por responsabilidade
- Extrair subcomponentes

## Teste esperado

- `npx tsc --noEmit` passa
- `npm run lint` passa
- `npm run build` passa
- Funcionalidade existente preservada (testes E2E de voz passam)
- Acessibilidade mantida (WCAG AA)
- Performance não degradada (especialmente em mobile/Capacitor)

## Contexto adicional

Audit completo em: `c:\Users\marce\OneDrive\Desktop\BirthHub360-Debt-Audit\BirthHub360-TechDebt-Report-20260929-120403.html`

Classificados como P1 (Architecture) no audit. Recomendação: "Decompor por responsabilidade somente quando houver ganho claro de coesão, testabilidade e ownership."

Propriedade confirmada em `src/features/voice-hub/AGENTS.md` - Agente 12 é dono desta pasta.

Observações:
- Voice Hub é feature crítica do produto
- Roda como aplicativo Android via Capacitor
- Performance e acessibilidade são considerações importantes
