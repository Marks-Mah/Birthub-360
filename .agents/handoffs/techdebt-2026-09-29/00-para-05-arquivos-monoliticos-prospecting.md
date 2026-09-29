- De: 00 (Coordenador)
- Para: 05 (Prospecção)
- Onda: techdebt-2026-09-29
- Status: aberto
- Prioridade: alto

## Problema

Auditoria de tech debt identificou 2 arquivos monolíticos em `src/features/prospecting/outbound/**` que violam princípios de arquitetura:

1. `server/routes.ts` - 3614 linhas
2. `components/LeadCard.tsx` - 2451 linhas

## Arquivo(s) envolvido(s)

- `src/features/prospecting/outbound/server/routes.ts` (3614 linhas)
- `src/features/prospecting/outbound/components/LeadCard.tsx` (2451 linhas)

## Alteração necessária

Decompor cada arquivo por responsabilidade, visando ganho claro de coesão, testabilidade e ownership:

**Para `routes.ts`:**
- Separar handlers de rota em módulos por feature/domain (search, enrichment, export, etc.)
- Extrair lógica de negócio para services/domain
- Manter apenas definição de rotas e middleware no arquivo principal

**Para `LeadCard.tsx`:**
- Extrair subcomponentes (seções de contato, ações, evidências, etc.)
- Separar hooks customizados
- Criar componentes menores e focados

## Teste esperado

- `npx tsc --noEmit` passa
- `npm run lint` passa
- Funcionalidade existente preservada (testes E2E relevantes)
- Novos componentes são testáveis em isolamento

## Contexto adicional

Audit completo em: `c:\Users\marce\OneDrive\Desktop\BirthHub360-Debt-Audit\BirthHub360-TechDebt-Report-20260929-120403.html`

Classificados como P1 (Architecture) no audit. Recomendação: "Decompor por responsabilidade somente quando houver ganho claro de coesão, testabilidade e ownership."

Referência: AGENTS.md em `src/features/prospecting/AGENTS.md` define Agente 05 como dono desta pasta.
