- De: 00 (Coordenador)
- Para: 18 (Contratos, API e Documentação Viva)
- Onda: 15
- Status: aberto
- Prioridade: normal

## Problema
As novas rotas de controle do Enxame Comercial Autônomo, agendamento de Cadências e telemetria de Live Insights do Copiloto precisam ser catalogadas em `docs/openapi.yaml` para manter o contrato de API inviolável e sem drift.

## Arquivo(s) envolvido(s)
- `docs/openapi.yaml`
- `src/features/swarm/**`
- `src/features/cadence/**`
- `src/features/copilot/**`

## Alteração necessária
O Agente 18 deve:
1. Documentar as operações de disparo e status do Swarm Scheduler.
2. Mapear endpoints de gestão de cadências e rotas de consentimento de opt-out.
3. Executar o gate de verificação `npm run verify:openapi-drift`.

## Teste esperado
- `npm run verify:openapi-drift` retornando status verde com zero drift.
