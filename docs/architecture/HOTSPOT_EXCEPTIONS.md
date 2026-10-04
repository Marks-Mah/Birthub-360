# Exceções de Hotspot Arquitetural (Governança Monorepo)

Este documento registra arquivos que excederam o limite de 1.000 linhas de código e o status formal de remediação.

## Histórico de Baixas e Resoluções (Fase 3 — Concluída)

### 1. `src/features/voice-hub/pages/Landing.tsx`
- **Tamanho Original:** 2.111 linhas
- **Tamanho Atual:** ~40 linhas (-98%)
- **Status:** RESOLVIDO (PR #642)
- **Arquitetura:** Decomposto em 11 submódulos sob `src/features/voice-hub/components/landing/`.

### 2. `src/features/prospecting/outbound/components/LeadCard.tsx`
- **Tamanho Original:** 2.451 linhas
- **Tamanho Atual:** ~110 linhas (-95%)
- **Status:** RESOLVIDO (PR #656)
- **Arquitetura:** Decomposto em 6 submódulos atômicos + hook desacoplado `useLeadCardState.ts`.

### 3. `scripts/agent-import/source-prompts.ts`
- **Tamanho Original:** 2.122 linhas
- **Tamanho Atual:** ~35 linhas (-98%)
- **Status:** RESOLVIDO (PR #657)
- **Arquitetura:** Prompts brutos isolados em `scripts/agent-import/data/prompts.catalog.json` (312 agentes).
