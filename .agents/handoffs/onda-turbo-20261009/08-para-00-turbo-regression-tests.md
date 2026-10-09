De: 08 — QA e Release
Para: 00 — Coordenador
Onda: turbo-20261009
Status: em-andamento
Prioridade: normal
Bloqueador-ref: ambiente de integração/E2E
Sprint destino: onda atual

## Problema

Os testes legados de descoberta esperavam consultas pagas sem consentimento e exposição literal de erros de rede. O novo contrato exige consentimento explícito e erros sanitizados. Atualizados somente os testes afetados, mantendo cotas, deduplicação, persistência e isolamento de tenant.

## Missão / base / branch

Agente 08, autor; auditor independente 24 ainda pendente. Base e32bad52d. Branch agente/08-turbo-tests. Worktree exclusivo C:/Github/birthub-turbo-08. Sem commit/push/merge. Nenhuma alteração de produto pertence a esta entrega: src copiado de 05/07 somente como dependência de execução.

## Suposições

Consultas pagas usam modo equilibrado/completo e autorizarPagos:true; econômico e configuração free impedem Apollo/Google. Testes automatizados identificam fixtures sintéticas e não acionam serviços externos faturáveis. Validação real de banco exige ambiente de teste provisionado pelo Coordenador.

## Plano executado / resultado

1. Reproduzir incompatibilidades legadas: primeira execução 9 falhas/12 passes em 4 arquivos.
2. Atualizar consentimento de fixtures híbridas e assert de erro sanitizado; acrescentar negativos econômico/consentimento negado/free: primeira reexecução 23 passes/1 falha. A falha comprovou chamada Google em configuração free com consentimento; reportada ao 05 e corrigida por ele.
3. Ampliar integração de persistência real: filtros estruturados em SavedSearch, SearchExecution vinculada, falha parcial, custo zero e SQL cru cross-tenant. IMPLEMENTADO; execução bloqueada.
4. Acrescentar E2E com sessão real: ausência de sessão401, filtros inválidos400, recuperação de filtros após reload, sessão de outro tenant sem acesso/run404 e VISUALIZADOR403 para discovery/interpret/providers-test. IMPLEMENTADO; quatro casos descobertos por Playwright; execução bloqueada.
5. Revisão exata pelo 24: PENDENTE, responsabilidade do Coordenador antes de declarar conclusão.

## Arquivos / SHA256

- tests/unit/features/prospecting/services/prospecting.service.query-planning.test.ts — 48748D6150AB14C116E67FCC4494479B8F626D6055441CF535747768B0930051
- tests/unit/features/prospecting/services/prospecting.service.dedupe.test.ts — 026546B5795D2E00FA0BD20D112E98F5D2800E85A28489F20A3C056485E45B63
- tests/unit/features/prospecting/services/prospecting.service.searchExecution.test.ts — 460F7A28D457322CDE35382229D964929C0EFBA1486A9D48B507A251E2BAD14F
- tests/unit/features/prospecting/services/places.service.test.ts — 3851E020EC614406FD6AF47F2F8EA172B40133BFE784EF12E28A89BD47B9102E
- tests/integration/prospecting-search-execution-rls.test.ts — A1AF2E0248F5A1A2D085AE1257F56B18A3DC4A8070FA7F5A5B8E9B8E243FA28C
- tests/e2e/prospecting-turbo-api.spec.ts — 53649027ABE2AE8D6F58CC034E3F0A4C8801FF2AE4CCF552233991A2E8E4C1A5

## Comandos / evidências

Logs temporários locais no worktree, fora da entrega versionada:

- node node_modules/vitest/vitest.mjs run -c vitest.unit.config.ts tests/unit/features/prospecting/services/prospecting.service tests/unit/features/prospecting/services/places.service.test.ts --no-file-parallelism --maxWorkers=1 --reporter=verbose → EXIT0, 29/29 em 5 arquivos, 15.82s. Log turbo-final-focused-test.log. Inclui arquivo prospecting.service.test.ts inalterado.
- npm run lint → EXIT0; 346 warnings e 1 info, sem fixes. Log turbo-lint.log. Avisos não são gate livre de warnings.
- npx tsc --noEmit → processo retornou EXIT0 e log vazio; retorno observado ao consultar/interromper sessão própria sob contenção de recursos. Reexecutar sequencialmente no candidato consolidado para gate final inequívoco.
- npx vitest run -c vitest.unit.config.ts tests/unit/features/prospecting --no-file-parallelism → antes do snapshot final, 192 passes/2 falhas: Google free e erro raw Places. Corrigidos e cobertos pela rodada final29/29. Log turbo-focused-test.log foi posteriormente reutilizado pela rodada ampliada abaixo.
- npx vitest run -c vitest.unit.config.ts tests/unit/features/prospecting src/features/prospecting --no-file-parallelism → EXIT1 sem resumo final nem falha de assert observável; INCONCLUSIVO em contexto de pressão de memória reportada pelo Coordenador. Não classificado como regressão/PASS. Log turbo-focused-test.log.
- npm run build → interrompido durante transformação, EXIT1. NÃO VALIDADO; sem alegação de gate verde. Log turbo-build.log.
- Playwright --list inicial sem ambiente → falha de validação NODE_ENV/DATABASE_URL. dotenv-cli via wrapper PowerShell falhou com NullReference. Mudança de estratégia para node direto, .env.test.example copiado para .env.test ignorado.
- $env:NODE_ENV='test'; node node_modules/dotenv-cli/cli.js -e .env.test -- node node_modules/@playwright/test/cli.js test tests/e2e/prospecting-turbo-api.spec.ts --list → EXIT0, quatro testes descobertos. Warning Redis ECONNREFUSED é infraestrutura local, não execução E2E. Log turbo-e2e-list.log.
- npm run test:integration / npm run test:e2e → NÃO EXECUTADOS neste worktree; Docker disponível informado em outra máquina, sem conexão remota autorizada/provisionada. Não alterar Docker nem fingir persistência validada.

## Teste esperado no candidato consolidado

Executar gates sequencialmente para evitar OOM, usando snapshot final dos proprietários de produto. Integration/E2E somente contra prospectordb_test e sessão de teste, após migrations. Comandos existem em package.json. Nenhuma consulta paga é necessária para estes casos.

## Fora do escopo / handoffs / aprendizado

EXECUCAO-ONDAS.md referenciado pelo prompt08 não existe na base; governança e missão específica do Coordenador aplicadas. Nenhum arquivo de harness ou pipeline alterado. Falha free encaminhada ao05 e corrigida; não há aprovação de fechamento, pois auditor24 pendente. Testes de consentimento devem exercitar configuração do provedor além da flag do usuário; mensagens sanitizadas precisam de assert negativo para segredos sintéticos. Executar gates pesados sequencialmente no host atual.

## Pendências / riscos

Integração e E2E reais BLOQUEADOS pela infraestrutura. Revisão24 PENDENTE. Gate consolidado/build PENDENTE. Não confundir descoberta de quatro testes com execução bem sucedida. Snapshot futuro de produto pode exigir reexecução: os hashes acima identificam somente os seis arquivos de teste entregues.
