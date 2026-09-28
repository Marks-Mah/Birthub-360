# Progresso - Onda IA-1 (Fundação)

**Data:** 2026-09-28
**Responsável:** Agente 07 — IA e Automações
**Status:** Em andamento

## Tarefas Completadas

### 1. Guardrails AI ✅

**Arquivos criados:**
- `src/lib/ai/guardrails/pii.guard.ts` - Detecção e redação de PII (CPF, CNPJ, telefone, email, cartão)
- `src/lib/ai/guardrails/toxicity.guard.ts` - Detecção e redação de linguagem tóxica em português
- `src/lib/ai/guardrails/index.ts` - Exportação pública

**Integração:**
- Integrado em `src/lib/ai/gateway/chat-model.ts`
- Guardrails executados antes de retornar resposta
- Bloqueio automático com log em AILog

**Testes:**
- `tests/unit/ai/guardrails.test.ts` - 127 linhas de testes
- Cobertura: detecção de PII, redação, toxicidade, múltiplos tipos

**Dependência pendente:**
- Handoff criado: `07-para-00-dependencias-guardrails.md`
- Ação: Instalar `@guardrails/ai` via `pnpm add @guardrails/ai`

---

### 2. Zod Structured Outputs ✅

**Arquivos criados:**
- `src/lib/ai/schemas/lead.schema.ts` - Schema para extração de leads
- `src/lib/ai/schemas/company.schema.ts` - Schema para extração de empresas
- `src/lib/ai/schemas/enrichment.schema.ts` - Schema para enriquecimento de dados
- `src/lib/ai/schemas/index.ts` - Exportação pública
- `src/lib/ai/structured/validate.ts` - Validação com retry e fallback parcial

**Integração:**
- Função `cleanParseAndValidate` adicionada em `src/lib/ai/gateway/parsing.ts`
- Combina JSON parsing com validação Zod
- Retry automático em falha (max 3 tentativas)
- Fallback para dados parciais quando configurado

**Testes:**
- `tests/unit/ai/structured.test.ts` - 175 linhas de testes
- Cobertura: validação de lead, company, enrichment, retry, fallback parcial

---

### 3. Cliente Qdrant ✅

**Arquivos criados:**
- `src/lib/ai/embeddings/qdrant.ts` - Cliente completo Qdrant
  - `initializeQdrantCollection()` - Cria coleção se não existir
  - `upsertEmbedding()` - Armazena embeddings com metadados
  - `searchEmbeddings()` - Busca semântica com filtro por tenant
  - `deleteDocumentEmbeddings()` - Deleta por documento
  - `deleteTenantEmbeddings()` - Deleta por tenant (GDPR)

**Integração:**
- Integrado em `src/lib/ai/gateway/embeddings.ts`
- Função `generateEmbedding()` agora aceita opções para armazenar no Qdrant
- Função `searchSemanticEmbeddings()` para busca semântica
- Compatível com implementação local existente (fallback)

**Dependência já instalada:**
- `@qdrant/js-client-rest` já está em `package.json` (linha 122)

---

### 4. Handoff para Agente 01 ✅

**Arquivo criado:**
- `.agents/handoffs/onda-ia-1/07-para-01-schema-document-embedding.md`

**Solicitação:**
- Criar tabela `DocumentEmbedding` em `prisma/schema.prisma`
- Schema: id, tenantId, documentId, vectorId, metadata, timestamps
- Índices: [tenantId, documentId], [vectorId]
- Aplicar migration

**Status:** Aguardando resposta do Agente 01

---

### 5. Testes Unitários ✅

**Arquivos criados:**
- `tests/unit/ai/guardrails.test.ts` - Testes de PII e toxicidade
- `tests/unit/ai/structured.test.ts` - Testes de validação Zod

**Status:** Testes criados, aguardando instalação de dependências para execução

---

## Dependências Externas

### Pendentes

1. **Instalação de @guardrails/ai**
   - Handoff: `07-para-00-dependencias-guardrails.md`
   - Comando: `pnpm add @guardrails/ai`
   - Responsável: Agente 00 (ou manual)

2. **Migration Prisma para DocumentEmbedding**
   - Handoff: `07-para-01-schema-document-embedding.md`
   - Responsável: Agente 01

### Já Resolvidas

- `@qdrant/js-client-rest` - Já instalado (linha 122 do package.json)
- `zod` - Já instalado (linha 203 do package.json)

---

## Próximos Passos

### Curto Prazo (Onda 1)

1. Aguardar Agente 01 criar migration de `DocumentEmbedding`
2. Aguardar instalação de `@guardrails/ai`
3. Executar testes unitários para validar implementação
4. Integração completa com Qdrant após migration

### Médio Prazo (Onda 2)

1. Deploy Qdrant via Docker (Agente 10)
2. vLLM - Provisionamento GPU + deploy (Agente 10)
3. Adapter vLLM + integração gateway (Agente 07)
4. LlamaIndex - ingestão de documentos (Agente 07)
5. Coqui TTS - deploy + adapter (Agente 07 + 10 + 12)

---

## Arquivos Modificados

- `src/lib/ai/gateway/chat-model.ts` - Integração de guardrails
- `src/lib/ai/gateway/parsing.ts` - Função cleanParseAndValidate
- `src/lib/ai/gateway/embeddings.ts` - Integração Qdrant

---

## Observações

- Guardrails implementados sem dependência externa (regex puro)
- Zod já estava no projeto, apenas organizado em schemas
- Qdrant client já tinha dependência instalada
- Todos os códigos seguem padrões do projeto (TypeScript, imports relativos)
- RLS multi-tenant respeitado (filtros por tenantId em Qdrant)

---

**Gerado por:** Agente 07
**Data:** 2026-09-28
**Status:** Onda 1 - Fundação em andamento (80% completo)
