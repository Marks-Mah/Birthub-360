# Relatório de Auditoria de Dívida Técnica - BirthHub 360

## Ambiente Detectado

O repositório é uma aplicação fullstack TypeScript, aparentemente usando um monorepo ou estrutura similar com as seguintes tecnologias principais detectadas:

- **Backend:** Node.js (via `tsx` ou compilado para `.cjs`), Express (provavelmente), Prisma ORM com PostgreSQL (incluindo extensão pgvector). O arquivo de entrada é `server.ts`. Há também workers como `worker.ts`, `worker-core.ts`, `worker-crm.ts`, etc.
- **Frontend:** React, construído com Vite, estilizado com TailwindCSS, utilizando PWA (VitePWA) e possivelmente Framer Motion, Lucide React, dnd-kit, ECharts, Tiptap.
- **Package Manager:** `npm`. Apesar da presença de `pnpm-lock.yaml` e `pnpm-workspace.yaml`, e scripts do npm espalhados, o comando principal do pipeline CI (`.github/workflows/ci.yml`) utiliza `npm ci`, indicando que o npm é o package manager efetivamente utilizado para build/deploy, reforçado pelo fato do pnpm-workspace dizer `O npm é o gerenciador oficial do CI`.
- **Node.js:** Versão 22 definida no CI (`.github/workflows/ci.yml`).
- **Testes:** Vitest para testes unitários e de integração (com dependência do docker compose para integrações), Playwright para testes E2E e visuais.
- **Infraestrutura:** Docker e Docker Compose, Helm (k8s), ArgoCD, Oracle Cloud (histórico, movido para Render + Neon).

## Comandos de Validação Oficiais

- **Typecheck:** `npm run typecheck` (Executa `tsc --noEmit`).
- **Lint:** `npm run lint` ou `npm run lint:ci` (Executa Biome, `biome lint src`).
- **Test:** `npm run test` (Executa sequencialmente unit, integration e e2e). O CI executa separadamente `npm run test:unit`, `npm run test:integration` e `npm run test:e2e`.
- **Build:** `npm run build` (Executa `vite build && esbuild server.ts ... && npm run verify:pwa-precache`).
- **E2E:** `npm run test:e2e` (Executa `npx dotenv-cli -e .env.test -- playwright test`). Há também `npm run test:visual`.
- **Prisma Validation:** `npm run verify:migration-drift` (Executa `prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code`).

## Arquitetura Relevante

A arquitetura do projeto segue o padrão **Clean Architecture**, dividida em camadas, com rigorosos controles de limites (Architecture Lint usando Dependency Cruiser via `npm run test:architecture`). A documentação encontra-se no diretório `docs/`, especialmente `docs/architecture/` e `docs/ADR/`. Existe um processo forte e centralizado de verificação em um "Application Gate" configurado no CI (`.github/workflows/ci.yml`).
As features (ou domínios) residem em `src/features/*`. O backend é servido do `server.ts` que monta routers definidos por essas features.
Existem regras estritas detalhadas em `AGENTS.md` e suas duplicatas (ou escopos) específicas de agente que proíbem alterar arquivos de áreas diferentes da atribuída ao agente.

## Riscos Encontrados

1. **Segredos no código/arquivos (Hardcoded):** Presença de `.env.test` em `.gate-backups/` e referências explícitas a API keys/tokens. (Prioridade P1 - Segurança).
2. **Uso de código dinâmico (`eval()` / `new Function()`):** Encontrado em múltiplos componentes (ex: `agente-codigo-local/src/components/TerminalDrawer.tsx`, `scripts/pwa/verify-precache.ts`), abrindo vetores para XSS/RCE.
3. **Migrations Destrutivas:** Diversas migrations identificadas executam operações do tipo `DROP TABLE` e `ALTER TABLE ... DROP COLUMN`, representando risco grave de perda de dados ou quebra em produção se não tratadas.
4. **Arquivos Monolíticos (Hotspots):** Diversos arquivos ultrapassam enormemente o limite razoável de linhas (ex: `live-browser.js` com ~13000 linhas, `audit-data.js` com ~4754, `routes.ts` com ~3614). Tais arquivos introduzem alta carga cognitiva e risco de regressão.

## Dependências entre Tarefas

- **Tarefas de Migrations Destrutivas:** Precisam ser coordenadas com o **Agente 01A** antes de qualquer intervenção, além de depender de testes/validação com backups de produção disponíveis.
- **Arquivos Monolíticos:** Devem ser refatorados (divisão) **após** e **durante** contínuos testes de unidade/integração para garantir que o fracionamento (por ex., quebra de rotas ou componentes UI) não introduza quebras funcionais.
- **Segredos Hardcoded:** A limpeza destas credenciais/segredos (arquivos de ambiente, configs, `.npmrc`) depende de um fallback para os secrets injetados via CI/CD, ou sua adição em gerenciadores de segredo (AWS/GCP/Vercel/Render). Exige coordenação com **Agente 06 (Integrações)** para rotação efetiva.
- **Tarefas de Typecheck e Lint:** O Biome e o Typescript em 'strict mode' impactam todo o código; essas limpezas (Fase 2) devem ocorrer após as alterações arquiteturais primárias para evitar retrabalho de tipos e padrões em arquivos já marcados para exclusão/divisão.

## Arquivos que Não Devem Ser Modificados (por restrição de propriedade)

Segundo o arquivo `AGENTS.md`, a propriedade exclusiva dos arquivos impõe restrições severas sobre **quem** (qual agente) pode alterá-los:
- `prisma/schema.prisma` e Migrações (somente Agente 01 e 01A).
- `src/App.tsx`, navegação principal e Sidebar (somente Agente 02).
- Pipelines de CI (`.github/workflows/**`), `Dockerfile` e `docker-compose.yml` da raiz (somente Agente 08).
- Diretórios `k8s/**`, `argocd/**`, `charts/**`, `infrastructure/**` (somente Agente 10).
- Diretórios `android/**` e `capacitor.config.ts` (somente Agente 09).
- Diretórios `identidade-visual/**` e `documentacao-aplicacao/**` (somente Agente 11).
- `server.ts` e `package.json`/lockfiles requerem aprovação explícita do **Agente 00**.
- `.agents/prompts/**`, `.agents/runs/**`, `.agents/handoffs/**` (regras específicas de leitura/não edição sem humano).

## Migrations Que Exigem Revisão Humana (ou Coordenação)

As seguintes migrations listadas no Tech Debt Plan requerem revisão por conta de comandos de DROP:
- `20260717141021_add_lead_enrichment`
- `20260717183411_sprint3_5_enums_and_cleanup`
- `20260720235926_sync_accumulated_schema_drift`
- `20260721113210_user_passwordhash_optional`
- `20260804203000_bitrix_sync_rule_lead_source`
- `20260805220000_two_funnels_and_bitrix_fields`
- `20260810130000_remove_knowledge_document`
- `20260817134959_onda11_db_cleanup`
- `20260827200000_drop_dead_ai_governance_models`
- `20260828040000_drop_contact_pii_hash_dec01_superseded`
- `20260908020000_multi_cargo_agent_governance_foundation`
- `20260908090000_public_booking_link_create_and_rls`
- `20260909131444_saved_view`
- `20260913000100_notes_cross_entity_and_attachments`
- `20260918151000_remove_legacy_nba_shadow_domain`

## Secrets que Exigem Rotação

- Chaves encontradas soltas ou mockadas como reais em: `docs/security/runbooks/ROTATE_GEMINI_API_KEY.md`, `litellm-config.yaml`, `scripts/create-user-marcelin.ts`, `scripts/test/prepare-integration-env.js`, e em arquivos `.env.test`/`.npmrc` (se confirmadas reais). A rotação exige coordenação de infra/integrações para que novos tokens sejam emitidos.

## Tarefas que Podem Ser Automatizadas

- **Typecheck e Linting básico:** O próprio `npm run lint:fix` e a remoção de `any` fáceis (ou adições de types em signatures simples) podem ser feitas de forma semi-automática e validadas pela CI.
- **Separação de Mocks:** Modificar e documentar arquivos de teste com tokens _dummy_ (ex: `MOCK ONLY - NOT A REAL SECRET`) para que scripts de auditoria de CI parem de flaggá-los.
- **Criação de Templates:** Renomear arquivos `.env.test` que contêm segredos hardcoded para um molde base (`.env.test.example`) retirando os valores.

## Tarefas que Exigem Decisão Humana

- Avaliação de código dinâmico (`eval()`/`new Function()`) dentro dos arquivos de front (`TerminalDrawer.tsx`, `verify-precache.ts`), decidindo sobre sandboxes apropriadas ou a remoção das funcionalidades correspondentes se não vitais para produção.
- Limpeza dos backups e revisão (reescrita) do histórico de Git (`git filter-repo`) para remover secrets permanentemente (isto não deve ser feito pelo agente).
- Planejamento de migrations reversíveis ou que possuam Rollback atrelado em vez de simples comandos `DROP`.
- Refatoração dos hotspots, especificamente do `src/features/prospecting/outbound/server/routes.ts` (3.614 linhas), que exigirá design profundo das lógicas separadas (domínio, infra e presentation).

## Sequência Segura de Execução

1. **Fase 1.1 (Security):**
   - Extrair chaves e tokens perigosos dos arquivos (documentações, mocks, scripts) substituindo por variáveis de ambiente ou dummies documentados. (Automatizável/Baixo Risco de impacto funcional).
   - Não reescrever histórico; delegar isso para os humanos.
2. **Fase 1.2 (Database):**
   - Mapear as migrations com drops. Adicionar comentários ou criar um "Safety Checklist" sem modificar a migration se já estiver em produção (ver Agente 01A).
3. **Fase 1.3 (Architecture - Imediato):**
   - Trabalhar nos hotspots isoladamente, um arquivo gigante de cada vez (ex: deletar o arquivo duplicado `live-browser.js`, iniciar o fracionamento do componente React `LeadCard.tsx`).
   - Após cada fracionamento, rodar a suíte inteira de `npm run test` e `npm run lint:architecture`.
4. **Fase 2 (Type & Quality):**
   - Corrigir falhas pendentes de Typescript/Biome e padronização apenas no código novo e refatorado, posteriormente expandindo aos módulos maduros.
