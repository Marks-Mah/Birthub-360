- De: Agente 07
- Para: Agente 00
- Onda: IA-1
- Status: aberto
- Prioridade: alto

## Problema

Ambiente atual (single-session) não suporta 8 worktrees simultâneos para execução paralela de agentes conforme o plano da Onda IA-1.

## Solução

Script de setup criado em `.agents\scripts\setup-multiagent-env.ps1` que cria:
1. Branch de integração: `integracao/onda-ia-1`
2. 8 branches de agentes: `agente/<id>-<slug>`
3. 8 worktrees: `../wt-agente-<id>`

## Como executar

Em ambiente com git multi-session (WSL, Linux, ou PowerShell com suporte):

```powershell
cd C:\Github\Birthub-360
.\.agents\scripts\setup-multiagent-env.ps1
```

Isso criará:
- `../wt-agente-07` (Agente 07 - Guardrails, Zod, Qdrant)
- `../wt-agente-01` (Agente 01 - Schema Prisma)
- `../wt-agente-10` (Agente 10 - Deploy Qdrant/Docker)
- `../wt-agente-15` (Agente 15 - Revisão PII)
- `../wt-agente-02` (Agente 02 - UX conhecimento)
- `../wt-agente-14` (Agente 14 - Test harness)
- `../wt-agente-16` (Agente 16 - Workers/BullMQ)
- `../wt-agente-00` (Agente 00 - Coordenação)

## Matriz de propriedade

Cada worktree terá acesso isolado aos arquivos sob sua propriedade:
- Agente 07: `src/lib/ai/**`
- Agente 01: `prisma/schema.prisma`, `prisma/migrations/**`
- Agente 10: `docker-compose.yml`, `k8s/**`, `infrastructure/**`
- Agente 15: `tests/security/**`
- Agente 02: `src/features/knowledge/**`
- Agente 14: `tests/harness/**`
- Agente 16: `src/lib/queue/**`
- Agente 00: `AGENTS.md`, `.agents/runs/**`, `.agents/handoffs/**`

## Limpeza após onda

```bash
git worktree remove ../wt-agente-07
git worktree remove ../wt-agente-01
git worktree remove ../wt-agente-10
git worktree remove ../wt-agente-15
git worktree remove ../wt-agente-02
git worktree remove ../wt-agente-14
git worktree remove ../wt-agente-16
git worktree remove ../wt-agente-00
```
