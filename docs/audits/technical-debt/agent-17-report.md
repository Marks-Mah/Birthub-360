# Relatório de Dívida Técnica: Agente 17 - Cadência Multicanal e Ciclo de Receita

Este relatório foi gerado automaticamente baseando-se em achados no repositório.

## Achados (Evidências de dívida técnica ou melhorias necessárias)

- **Dívidas no CRM, BI e Cadência:**
  - `src/features/cadence/dialer/infrastructure/db/repositories/PgLeadRepository.ts:// TODO: Refactor native SQL queries to use Prisma ORM directly.`
  - `src/features/cadence/dialer/infrastructure/db/repositories/PgLeadRepository.ts:    // TODO: Use Prisma transaction`
  - `src/features/cadence/dialer/infrastructure/db/repositories/PgCallAttemptRepository.ts:// TODO: Refactor native SQL queries to use Prisma ORM directly.`
  - `src/features/cadence/dialer/infrastructure/db/repositories/PgCampaignRepository.ts:// TODO: Refactor native SQL queries to use Prisma ORM directly.`
  - `src/features/cadence/dialer/infrastructure/db/repositories/PgDncRepository.ts:// TODO: Refactor native SQL queries to use Prisma ORM directly.`

## Plano de Ação sugerido

- Priorizar a resolução dos TODOs/FIXMEs listados.
- Refatorar `any` explícitos para melhorar tipagens de TypeScript.
- Revisar testes com supressões de TypeScript.
