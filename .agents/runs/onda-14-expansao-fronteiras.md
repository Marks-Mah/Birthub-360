# Onda 14 - Expansão de Fronteiras

**Status:** EM EXECUÇÃO (MATRIZ PUBLICADA E HANDOFFS MAPEADOS)  
**Data:** 2026-10-08  
**Coordenador:** Agente 00  

## 1. Objetivo
Levantar o Freeze de Escopo (pós-conclusão da estabilização da Sprint 13) e coordenar com governança estrita os 3 grandes épicos estruturais do Birth Hub 360: Invasão CRM, Inteligência em Tempo Real, e Escala/Resiliência.

---

## 2. Matriz Oficial de Propriedade de Arquivos (AGENTS.md §13, §15)

| Agente | Domínio / Especialidade | Escopo Exclusivo de Arquivos |
| :--- | :--- | :--- |
| **00** | Coordenação & Integração | Orquestração global, `.agents/runs/**`, merge gates, aprovação de `server.ts` e `package.json` |
| **01** | Plataforma, Segurança e Dados | `prisma/schema.prisma`, `prisma/migrations/**`, camadas RLS e isolamento multi-tenant |
| **02** | Produto e UX | `src/App.tsx`, navegação principal, `src/components/navigation/Sidebar.tsx`, UI de Integrações |
| **04** | CRM e BI | `src/features/crm/**`, `src/features/commercial-intelligence/**`, pipeline stages e forecasting |
| **05** | Prospecção | `src/features/prospecting/**`, enriquecimento deep de mercado, ingestão de leads |
| **06** | Integrações e Bitrix | `src/features/integrations/**` (HubSpot, Pipedrive, RD Station, Monday, Bitrix) |
| **07** | IA e Automações | `src/features/ai-voice/` (orquestração LLM, Flowise router, prompts e automações) |
| **10** | Infraestrutura e SRE | `docker-compose*.yml`, `Dockerfile`, `k8s/**`, charts, Helm, Temporal Server e infra |
| **12** | Voz e Telefonia | `src/features/voice/**`, sessões SIP/3CX, controle telefônico, áudio bidirecional |
| **15** | Segurança Aplicada | `src/lib/security/**`, envelope encryption, cofres de credenciais, sanitização de logs |
| **16** | Runtime, Workers e Escala | `worker.ts`, `src/features/temporal-workers/**`, filas de alta concorrência e Crawlee engine |
| **18** | Contratos e Docs Vivas | `docs/openapi.yaml`, contratos de APIs e validação de drift de endpoints |
| **21** | Privacidade e LGPD | Inventário de tratamento, consentimento de gravação/áudio, retenção e expurgo de PII |

---

## 3. Matriz de Dependências Cross-Domain e Handoffs Formais (.agents/handoffs/onda-14/)

Para eliminar a dívida de acoplamento tácito e garantir rastreabilidade conforme `AGENTS.md` §6 e §18, todos os pontos de contato entre agentes foram formalizados nos handoffs abaixo:

| ID Handoff | De | Para | Prioridade | Status | Escopo / Objeto da Dependência |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `06-para-01-schema-novos-crms.md` | 06 | 01 | **Bloqueador** | Aberto | Modelagem e migração Prisma para persistência de tokens e conexões dos novos CRMs |
| `06-para-15-criptografia-tokens-crms.md` | 06 | 15 | **Bloqueador** | Aberto | Criptografia em repouso (AES-256-GCM) para tokens OAuth e API Keys dos novos CRMs (B-04) |
| `06-para-04-contrato-entidades-pipeline.md` | 06 | 04 | Alto | Aberto | Normalização de estágios de pipeline (deal stages) para o modelo canônico de Commercial Intelligence |
| `06-para-02-ui-conectores-crm.md` | 06 | 02 | Alto | Aberto | Interface de usuário (cards, modais e status) para conexão de CRMs no painel de Integrações |
| `07-para-12-orquestracao-webrtc-telefonia.md` | 07 | 12 | **Bloqueador** | Aberto | Bridge de áudio bidirecional e eventos entre o LiveKit/WebRTC e sessões de telefonia SIP/3CX (B-07) |
| `07-para-21-consentimento-retencao-audio.md` | 07 | 21 | **Bloqueador** | Aberto | Política de consentimento de gravação de voz humana por IA, sanitização e retenção LGPD (B-13) |
| `07-para-16-runtime-webrtc-streaming.md` | 07 | 16 | Alto | Aberto | Isolamento de processos de streaming WebRTC de baixa latência fora do event loop HTTP |
| `16-para-05-integracao-crawlee-prospeccao.md` | 16 | 05 | Alto | Aberto | Integração do crawler Crawlee no pipeline de enriquecimento deep de mercado da prospecção |
| `16-para-10-infra-temporal-crawlee.md` | 16 | 10 | **Bloqueador** | Aberto | Provisionamento de Temporal Server no Docker/K8s e dependências headless de Chromium no Dockerfile |
| `16-para-01-tenant-context-temporal-activities.md` | 16 | 01 | **Bloqueador** | Aberto | Propagação de isolamento Multi-Tenant / RLS e contexto de organização em Temporal Activities (B-10) |
| `08-para-05-ts-errors-prospecting.md` | 08 | 05 | **Bloqueador** | Aberto | Erros de tipagem TypeScript no crawler de prospecção bloqueando gate global |
| `08-para-07-ts-errors-intelligence.md` | 08 | 07 | **Bloqueador** | Aberto | Erros de tipagem e import de Playwright no módulo de inteligência bloqueando gate global |
| `00-para-18-contratos-openapi-onda14.md` | 00 | 18 | Normal | Aberto | Documentação viva OpenAPI para novos webhooks de CRM, rotas WebRTC e APIs do Temporal |

---

## 4. Ordem de Integração e Desbloqueio (AGENTS.md §19)

1. **Camada de Dados & Segurança (Slot 1):** Agente 01 aplica schema dos CRMs (`06-para-01`) e isolamento Temporal (`16-para-01`). Agente 15 aplica blindagem de tokens (`06-para-15`).
2. **Infraestrutura & Plataforma (Slot 2):** Agente 10 provisiona Temporal e containers (`16-para-10`).
3. **Serviços de Domínio & Integrações (Slot 3):** Agente 06 e Agente 16 consolidam conectores e workers. Agente 12 pluga telefonia (`07-para-12`). Agente 21 valida LGPD (`07-para-21`).
4. **Aplicação Comercial & UX (Slot 4):** Agente 04 normaliza pipelines (`06-para-04`). Agente 05 conecta Crawlee (`16-para-05`). Agente 02 implementa UI (`06-para-02`).
5. **Documentação & Release:** Agente 18 atualiza contratos (`00-para-18`). Agente 08 e Agente 00 rodam os gates de integração.

---

## 5. Critérios de Aceite da Onda 14
- Nenhum handoff com `Prioridade: bloqueador` em estado `aberto` ao final da onda.
- Zero regressão de Tenancy / RLS em chamadas assíncronas do Temporal.
- Zero credencial ou token exposto em logs ou salvo em texto puro.
- Contratos OpenAPI íntegros sem drift (`npm run verify:openapi-drift`).
- Gates locais e de integração verdes antes do release.
