- De: 16 (Runtime, Workers e Escala)
- Para: 10 (Infraestrutura, Observabilidade e SRE)
- Onda: 14
- Status: aberto
- Prioridade: bloqueador

## Problema
A introdução do Temporal.io para orquestração de workflows resilientes (`src/features/temporal-workers/`) e do Crawlee com Playwright/Chromium para extração web (`src/features/prospecting/crawlee/`) requer recursos de infraestrutura que não estão provisionados nos manifestos do projeto. Pelo modelo de governança (`/AGENTS.md` §15), `docker-compose.yml`, `Dockerfile`, `k8s/**` e infraestrutura de servidores são de propriedade exclusiva do Agente 10. Sem o servidor Temporal e sem os binários/dependências de SO do Chromium instalados na imagem de container, os workers quebram em tempo de execução.

## Arquivo(s) envolvido(s)
- `docker-compose.yml`
- `docker-compose.opensource.yml`
- `Dockerfile`
- `k8s/**`
- `.env.example`

## Alteração necessária
O Agente 10 deve:
1. Incluir a suite do Temporal Server (serviços `temporal`, `temporal-admin-tools`, `temporal-ui` ou imagem oficial `temporalio/auto-setup`) no `docker-compose.opensource.yml` e manifestos de produção K8s.
2. Adicionar as variáveis de ambiente necessárias ao `.env.example` (`TEMPORAL_ADDRESS=temporal:7233`, `TEMPORAL_NAMESPACE=default`).
3. Ajustar o `Dockerfile` dos workers para incluir dependências de sistema do headless Chromium (ex.: `npx playwright install-deps` ou pacotes Debian equivalentes `libnss3`, `libatk`, etc.).
4. Configurar healthchecks e limites de recursos (CPU/Memory limits) para os containers de workers do Temporal e Crawlee.

## Teste esperado
- `docker compose -f docker-compose.yml -f docker-compose.opensource.yml up -d` sobe com todos os serviços íntegros (`healthy`).
- Temporal Web UI acessível na porta configurada (ex.: 8080 ou 8233).
- Worker do Temporal conecta no cluster com sucesso e registra as tarefas.

## Contexto adicional
Bloqueador de deploy e infraestrutura para a Onda 14.
