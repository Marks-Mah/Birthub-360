- De: 00 (Coordenador)
- Para: 08 (QA e Release) e 10 (Infraestrutura, Observabilidade e SRE)
- Onda: liquidacao-debitos
- Status: aberto
- Prioridade: alto (bloqueador de release/produção)

## Problema

O workflow `.github/workflows/deploy-aws.yml` está configurado para uma estratégia ECS/ECR/S3/CloudFront (AWS OIDC), mas o ambiente de produção canônico documentado opera em EC2 via SSH (`ubuntu@3.143.251.44`, diretório `/home/ubuntu/birthhub-360`, container `birthhub-app`, porta 3024). O workflow AWS é ignorado devido à ausência da secret `AWS_ROLE_TO_ASSUME`, criando divergência entre pipeline documentado e realidade operacional.

Adicionalmente, o HEALTHCHECK da imagem Docker estava fixado na porta 3000 enquanto o runtime real usa PORT=3024, causando conflito potencial de healthcheck.

## Arquivo(s) envolvido(s)

- `.github/workflows/deploy-aws.yml` (propriedade: Agente 08)
- `Dockerfile` (propriedade: Agente 08/10)
- Scripts de deploy EC2 existentes (`deploy-ec2.ps1`, `deploy-ec2.sh`, `deploy-aws.ps1`)
- Documentação de produção (`docs/operations/PRODUCTION_ARCHITECTURE.md`)

## Alterações já aplicadas nesta onda

1. **Docker Hub Rate Limit (Erro 429 no CI):**
   - Adicionado `credentials` com `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` a todos os service containers no workflow `.github/workflows/ci.yml` (postgres, redis, meilisearch) nos jobs `build-and-test` e `visual-baselines`
   - Isso elimina falhas intermitentes de `toomanyrequests` durante pulls anônimos nos runners públicos do GitHub Actions

2. **Ajuste de PORT no Dockerfile:**
   - Alterado `ENV PORT=3000` para `ENV PORT=3024` (linha 51)
   - Alterado `EXPOSE 3000` para `EXPOSE 3024` (linha 107)
   - Alterado HEALTHCHECK de porta fixa 3000 para `${PORT:-3024}` (linha 110)
   - Isso alinha a imagem Docker com o runtime real de produção (porta 3024)

## Decisão necessária: Estratégia de Deploy Unificada

**Opção A - Manter EC2 via SSH (status quo atual):**
- Vantagem: já está operando em produção, documentado, testado
- Desvantagem: workflow `deploy-aws.yml` torna-se obsoleto, pode ser removido ou desativado
- Ação: remover ou arquivar `deploy-aws.yml`, documentar que deploy é via scripts EC2 manuais

**Opção B - Migrar para ECS/ECR/S3/CloudFront (workflow atual):**
- Vantagem: pipeline automatizado via GitHub Actions OIDC, melhor observabilidade nativa AWS
- Desvantagem: requer migração de infraestrutura, configuração de `AWS_ROLE_TO_ASSUME`, teste completo
- Ação: configurar secret `AWS_ROLE_TO_ASSUME`, validar pipeline, migrar produção

**Opção C - Híbrido (EC2 via GitHub Actions):**
- Vantagem: mantém infraestrutura EC2 existente mas com pipeline automatizado
- Desvantagem: requer desenvolvimento de workflow customizado para EC2 (SSH deploy via runner)
- Ação: criar workflow específico para deploy EC2 via SSH, manter workflow ECS desativado

## Teste esperado

- Se opção A: confirmar que workflow `deploy-aws.yml` pode ser removido sem impacto em produção
- Se opção B: executar pipeline completo com `AWS_ROLE_TO_ASSUME` configurado, validar ECR push, ECS deploy, smoke test
- Se opção C: desenvolver e testar workflow EC2 SSH, confirmar deploy idêntico ao manual

## Contexto adicional

O parecer do Agente 24 em `sync-antigravity-2026-10-09-24.md` já apontou esta divergência e recomendou:
1. Confirmar host/conta/região/topologia e versão atual por inspeção segura
2. Exigir imagem/digest observado nas tasks se escolhido ECS
3. Confirmar destino e seleção de arquivos para S3, impedindo backend/sourcemaps privados no bucket público
4. Verificar migrações, acesso de migração, resultado real e readiness antes do tráfego
5. Identificar revisão anterior, backup, restauração e reversibilidade de migrações antes de publicar
6. Validar pós-publicação: versão/digest, migração, readiness, frontend/API no domínio real

Esta decisão deve ser tomada pelo usuário/Coordenador antes de prosseguir com qualquer ação de deploy em produção.
