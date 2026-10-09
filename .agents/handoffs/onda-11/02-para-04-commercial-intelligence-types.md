- De: 02
- Para: 04
- Onda: 11
- Status: resolvido
- Prioridade: alto

## Resolução
Resolvido em conjunto pelas frentes de Inteligência Comercial (Agente 04) e Plataforma:
1. As interfaces e schemas de `ExecutiveOverview` (adicionados `coverageProtection`, `previousPeriod`, `forecastConfidence`), `PerformanceMetrics` (`funnelHistoricalTrackingSince`) e `PipelineCreation` (`businessDaysElapsed`, `businessDaysTotal`) foram alinhados em `src/features/commercial-intelligence/domain/CommercialIntelligence.ts` e consumidos corretamente em `src/features/commercial-intelligence/application/executiveExport.ts`.
2. Mocks e asserções em `src/features/commercial-intelligence/__tests__/executiveExport.unit.test.ts` foram devidamente atualizados e os testes unitários foram validados.
3. Imports não utilizados (`ESTADO_OPTIONS`, `QUANTIDADE_OPTIONS`) foram limpos em `ProspectingHub.tsx` e `DiscoveryFilterPanel.tsx`. Typecheck `npx tsc --noEmit` validado 100% verde.

## Problema
Erros de TypeScript na feature de `commercial-intelligence`:
1. `ExecutiveOverview` não está batendo com o tipo retornado (falta `coverageProtection`, `previousPeriod`, `forecastConfidence`).
2. `PerformanceMetrics` sentindo falta de `funnelHistoricalTrackingSince`.
3. Propriedades desconhecidas `businessDaysElapsed` e `businessDaysTotal` no `PipelineCreation`.
## Arquivo(s) envolvido(s)
- `src/features/commercial-intelligence/__tests__/executiveExport.unit.test.ts`
- `src/features/commercial-intelligence/application/executiveExport.ts`
## Alteração necessária
Atualizar as tipagens, mocks nos testes, e mapeamento na aplicação para alinhar as interfaces de `ExecutiveOverview`, `PerformanceMetrics` e `PipelineCreation`.
## Teste esperado
O comando `npx tsc --noEmit` deve rodar limpo para os arquivos do domínio de inteligência comercial.
## Contexto adicional
Detectado durante a validação global de TS na Onda 11 pelo Agente 02.
