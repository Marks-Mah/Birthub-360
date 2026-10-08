- De: 00 (Coordenador)
- Para: 18 (Contratos, API e Documentação Viva)
- Onda: 14
- Status: aberto
- Prioridade: normal

## Problema
A introdução dos três novos épicos da Onda 14 (conectores de CRMs externos, canais de streaming de voz WebRTC e orquestração assíncrona do Temporal) cria novos endpoints HTTP de webhooks, callbacks e APIs de controle. Sem a devida especificação desses contratos no catálogo vivo da aplicação (`docs/openapi.yaml`), haverá divergência de schema e falha no gate de verificação de drift (`npm run verify:openapi-drift`).

## Arquivo(s) envolvido(s)
- `docs/openapi.yaml`
- `src/features/integrations/**`
- `src/features/ai-voice/**`
- `src/features/temporal-workers/**`

## Alteração necessária
O Agente 18 deve:
1. Auditar as rotas e contratos de payloads criados para:
   - Webhooks de CRM (HubSpot, Pipedrive, RD Station, Monday);
   - Sessões e tokens de conexão WebRTC / LiveKit;
   - Gatilhos e status de workflows do Temporal.
2. Adicionar as definições completas de schema, headers de autenticação e códigos de resposta HTTP ao arquivo `docs/openapi.yaml`.
3. Executar a verificação de conformidade de drift.

## Teste esperado
- Execução de `npm run verify:openapi-drift` retornando status verde sem alertas de rotas não documentadas ou divergências de payload.

## Contexto adicional
Garante conformidade com o princípio de documentação viva e contratos invioláveis da plataforma.
