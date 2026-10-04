# TD-012/DT-013 — Análise de Testes e Quality Gates

## Contexto
Auditoria identificou cobertura insuficiente, poucos testes backend, ausência relevante de testes frontend e necessidade de testes adversariais, especialmente em segurança e IA.

## ✅ Gates Atuais no CI (`.github/workflows/ci.yml`)

### Gates Já Implementados
1. ✅ **Secret scan** - Gitleaks
2. ✅ **Vulnerability audit** - npm run security:audit-waivers
3. ✅ **Lint** - npm run lint:ci
4. ✅ **Prettier check** - npm run format:check
5. ✅ **Type check** - npx tsc --noEmit
6. ✅ **Architecture tests** - npm run test:architecture
7. ✅ **OpenAPI drift verification** - npm run verify:openapi-drift
8. ✅ **Unit tests** - npm run test:unit -- --coverage
9. ✅ **Golden Dataset** - npm run eval:golden (AI)
10. ✅ **Integration tests** - npm run test:integration -- --coverage (auth, RBAC, tenant isolation)
11. ✅ **E2E tests** - npm run test:e2e (Playwright)
12. ✅ **Build** - npm run build
13. ✅ **Smoke test** - health checks (/health/live, /health/ready, /health/version)

### Workflows Separados
- ✅ **Security scan** - `.github/workflows/security-trivy.yml`
- ✅ **Dependency review** - `.github/workflows/dependency-review.yml`
- ✅ **CodeQL** - `.github/workflows/codeql.yml`
- ✅ **SonarQube** - `.github/workflows/sonarqube.yml`
- ✅ **Visual regression** - `.github/workflows/visual-regression.yml`

## 📊 Inventário de Testes

### Testes Unitários (243 arquivos)
```
src/bootstrap/__tests__/healthchecks.unit.test.ts
src/components/ui/__tests__/Dialog.test.ts
src/config/__tests__/module-catalog.test.ts
src/features/automations/**/__tests__/*.test.ts (8 arquivos)
src/features/cadence/**/__tests__/*.test.ts (10 arquivos)
src/features/commercial-intelligence/**/__tests__/*.test.ts (18 arquivos)
src/features/copiloto-ia/**/__tests__/*.test.ts (6 arquivos)
src/features/intelligence/**/__tests__/*.test.ts
src/features/integrations/**/__tests__/*.test.ts
src/features/knowledge/**/__tests__/*.test.ts
src/features/playbook/**/__tests__/*.test.ts
src/features/roleplay/**/__tests__/*.test.ts
src/lib/ai/**/__tests__/*.test.ts
src/lib/**/__tests__/*.test.ts
... e mais
```

### Testes de Integração (88 arquivos)
```
tests/integration/access-request.test.ts
tests/integration/account-lockout.test.ts
tests/integration/ai-guardrails-security.test.ts (PII, toxicidade)
tests/integration/ai-budget.test.ts
tests/integration/rbac-e2e.test.ts
tests/integration/rls-tenant-isolation.test.ts
tests/integration/sec001-bullboard-access.test.ts (RBAC + operador plataforma)
tests/integration/sec006-session-revocation.test.ts
... e mais
```

### Testes E2E (24 arquivos)
```
tests/e2e/accessibility.spec.ts
tests/e2e/auth.spec.ts
tests/e2e/cadence.spec.ts
tests/e2e/commercial-intelligence-journey.spec.ts
tests/e2e/commercial-intelligence-rbac.spec.ts
tests/e2e/crm.spec.ts
tests/e2e/leads-crud.spec.ts
tests/e2e/mobile-sweep.spec.ts
... e mais
```

## 🎯 Fluxos Críticos Mapeados

### Autenticação e Autorização
- ✅ Testes unitários em `src/features/auth/**`
- ✅ Testes de integração (auth, RBAC, tenant isolation)
- ✅ Testes E2E em `tests/e2e/auth.spec.ts`
- ✅ Testes E2E RBAC em `tests/e2e/commercial-intelligence-rbac.spec.ts`
- ✅ Testes específicos: `sec001-bullboard-access.test.ts`, `sec006-session-revocation.test.ts`

### Tenant Isolation
- ✅ Coberto em testes de integração
- ✅ `rls-tenant-isolation.test.ts`
- ✅ `tenant-isolation-db001.test.ts`
- ✅ Vários testes específicos por feature (whatsapp, voice, knowledge, etc.)

### AI Endpoints
- ✅ Golden Dataset (AI judge)
- ✅ Testes unitários em `src/lib/ai/**/__tests__/`
- ✅ Testes de integração: `ai-guardrails-security.test.ts`, `ai-budget.test.ts`, `ai-org-budget.test.ts`
- ⚠️ Faltam testes adversariais específicos para prompt injection/jailbreak

### Quota/Rate Limit
- ✅ Testes em `src/features/cadence/__tests__/rateLimit.test.ts`
- ✅ Testes em `src/features/cadence/__tests__/rateLimitService.test.ts`

### DLP/PII
- ✅ Testes existentes em `tests/integration/ai-guardrails-security.test.ts`
- ✅ Cobre CPF, CNPJ, email, telefone, cartão de crédito
- ✅ Testes de redação de PII
- ⚠️ Faltam testes de bypass (Base64, Unicode) - identificados como lacuna no próprio teste

### Terminal Safety
- ❌ Não identificado testes específicos (não aplicável ao contexto atual)

### Provider AI (Groq, Ollama, OpenRouter)
- ✅ Testes unitários em `src/lib/ai/gateway/__tests__/`
- ✅ Novos testes criados (http-client, circuit-breaker) - TD-009
- ⚠️ Faltam testes de integração com providers reais

### Persistência
- ✅ Testes de Prisma repositories
- ✅ Migration drift verification

### Migrations
- ✅ Migration drift verification (DATA-007)
- ⚠️ Não bloqueante (continue-on-error: true)

### APIs Críticas
- ✅ OpenAPI drift verification
- ✅ Testes de integração

### Fluxos E2E Críticos
- ✅ CRM leads
- ✅ Commercial intelligence
- ✅ Cadence
- ✅ Auth/onboarding

## ❌ Gates Faltando (TD-012/DT-013)

### 1. Coverage Threshold Definido
**Status**: ✅ Completo
- `--coverage` é usado em unit e integration tests
- ✅ Thresholds configurados em `vitest.unit.config.ts` (statements: 28%, branches: 25%, functions: 23%, lines: 29%)
- ✅ Thresholds configurados em `vitest.integration.config.ts` (statements: 14%, branches: 11%, functions: 14%, lines: 15%)
- ✅ Thresholds por domínio crítico (components/ui, automations, crm)
- ✅ Falha em coverage bloqueia merge

**Nota**: Thresholds são pisos mínimos (não metas de qualidade) para evitar regressão.

### 2. AI Safety Tests
**Status**: ⚠️ Parcial
- ✅ Golden Dataset existe mas é condicional (requer API key)
- ✅ Testes de PII e toxicidade em `ai-guardrails-security.test.ts`
- ❌ Não há testes de prompt injection
- ❌ Não há testes de jailbreak
- ✅ **Novo**: `tests/security/ai-safety.test.ts` criado (placeholders)

**Ação necessária**:
- Implementar testes reais de prompt injection/jailbreak
- Tornar Golden Dataset obrigatório (mock se não tiver API key)

### 3. Testes Adversariais de Segurança
**Status**: ⚠️ Parcial
- ✅ Testes RBAC E2E existentes (rbac-e2e-*.test.ts)
- ✅ Testes específicos de segurança (sec001, sec006)
- ❌ Não há testes de SQL injection
- ❌ Não há testes de XSS
- ❌ Não há testes de CSRF
- ❌ Não há testes de IDOR (Insecure Direct Object Reference) - alguns testes de tenant isolation cobrem parcialmente
- ✅ **Novo**: `tests/security/adversarial.test.ts` criado (placeholders)

**Ação necessária**:
- Implementar testes reais de segurança adversarial
- Integrar no CI

### 4. Security Scan Integrado
**Status**: ⚠️ Separado
- security-trivy.yml existe mas é workflow separado
- ❌ Não bloqueia merge no CI principal

**Ação necessária**:
- Integrar Trivy scan no CI principal
- Tornar bloqueante

### 5. Dependency Scan Integrado
**Status**: ⚠️ Separado
- dependency-review.yml existe mas é workflow separado
- ❌ Não bloqueia merge no CI principal

**Ação necessária**:
- Integrar dependency review no CI principal
- Tornar bloqueante

## 📋 Matriz Risco → Teste → Gate

| Risco | Teste Existente | Gate CI | Status |
|-------|----------------|---------|--------|
| Timeout não abortável | ✅ http-client.test.ts | ❌ Não integrado | Criar job |
| Retry sem jitter | ✅ retry.test.ts | ❌ Não integrado | Criar job |
| Circuit breaker falhando | ✅ circuit-breaker.test.ts | ❌ Não integrado | Criar job |
| Schema inválido | ✅ parsing.test.ts | ❌ Não integrado | Criar job |
| SQL injection | ⚠️ Placeholder | ❌ | Implementar |
| XSS | ⚠️ Placeholder | ❌ | Implementar |
| IDOR | ✅ Tenant isolation tests | ✅ | OK |
| Prompt injection | ⚠️ Placeholder | ❌ | Implementar |
| PII leak | ✅ ai-guardrails-security.test.ts | ✅ | OK |
| Tenant isolation | ✅ Múltiplos testes | ✅ | OK |
| Auth bypass | ✅ Múltiplos testes | ✅ | OK |
| Rate limit bypass | ✅ rateLimit.test.ts | ✅ | OK |
| RBAC bypass | ✅ rbac-e2e-*.test.ts | ✅ | OK |

## 🎯 Recomendações Prioritárias

### Alta Prioridade
1. **Integrar security scan** no CI principal - Trivy
2. **Integrar dependency review** no CI principal
3. **Implementar testes adversariais reais** - SQL injection, XSS, IDOR
4. **Implementar testes de AI safety** - prompt injection, jailbreak

### Média Prioridade
5. **Criar job de testes de resiliência IA** - executar http-client, circuit-breaker, retry tests
6. **Tornar migration drift bloqueante** - resolver DATA-007 primeiro
7. **Implementar testes de bypass de PII** - Base64, Unicode

### Baixa Prioridade
8. **Testes de terminal safety** - se aplicável
9. **Testes de carga/stress** - separado do CI principal

## 📝 Próximos Passos

1. ✅ Inventário de testes concluído
2. ✅ Análise de gates CI concluída
3. ✅ Criar testes adversariais placeholders (adversarial.test.ts, ai-safety.test.ts)
4. ⏳ Integrar Trivy no CI principal
5. ⏳ Integrar dependency review no CI principal
6. ⏳ Implementar testes adversariais reais
7. ⏳ Documentar matriz de testes críticos
8. ⏳ Validar que cada gate realmente bloqueia (introduzir falha controlada)
