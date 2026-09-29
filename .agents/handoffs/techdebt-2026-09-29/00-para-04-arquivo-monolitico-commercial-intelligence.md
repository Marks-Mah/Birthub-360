- De: 00 (Coordenador)
- Para: 04 (CRM e BI)
- Onda: techdebt-2026-09-29
- Status: aberto
- Prioridade: alto

## Problema

Auditoria de tech debt identificou arquivo monolítico em `src/features/commercial-intelligence/**`:

- `components/JoaoReisDiagnosticHub.tsx` - 1751 linhas

## Arquivo(s) envolvido(s)

- `src/features/commercial-intelligence/components/JoaoReisDiagnosticHub.tsx` (1751 linhas)

## Alteração necessária

Decompor o arquivo por responsabilidade, visando ganho claro de coesão, testabilidade e ownership:

- Extrair subcomponentes (métricas, charts, tabelas, filtros, etc.)
- Separar hooks customizados de métricas/forecast
- Criar componentes menores e focados
- Manter fórmulas documentadas em `metricsDictionary.ts`

## Teste esperado

- `npx tsc --noEmit` passa
- `npm run lint` passa
- Testes relevantes ao domínio passam (`src/features/commercial-intelligence/__tests__/**`, `tests/integration/rbac-e2e-commercial-intelligence.test.ts`)
- `npm run build` passa
- RBAC preservado (ADMIN/GESTOR)

## Contexto adicional

Audit completo em: `c:\Users\marce\OneDrive\Desktop\BirthHub360-Debt-Audit\BirthHub360-TechDebt-Report-20260929-120403.html`

Classificado como P1 (Architecture) no audit. Recomendação: "Decompor por responsabilidade somente quando houver ganho claro de coesão, testabilidade e ownership."

Referência: AGENTS.md em `src/features/commercial-intelligence/AGENTS.md` define Agente 04 como dono desta pasta.
