- De: 00 (Coordenador)
- Para: 15 (Segurança Aplicada e Rotação de Segredos)
- Onda: techdebt-2026-09-29
- Status: aberto
- Prioridade: bloqueador

## Problema

Auditoria de tech debt identificou 188 findings de segurança P1. A maioria (180+) são "Segredo hardcoded" no arquivo `.agents/skills/impeccable/scripts/live-browser.js` e sua duplicata em `.claude/skills/impeccable/scripts/live-browser.js`.

## Arquivo(s) envolvido(s)

- Audit completo: `c:\Users\marce\OneDrive\Desktop\BirthHub360-Debt-Audit\BirthHub360-TechDebt-Report-20260929-120403.html`
- Dados: `c:\Users\marce\OneDrive\Desktop\BirthHub360-Debt-Audit\BirthHub360-TechDebt-Data-20260929-120403.json`

## Alteração necessária

1. **Filtrar falsos positivos:** Investigar se os findings em `live-browser.js` são falsos positivos (script de skill externa, não código de produção)
2. **Identificar findings reais:** Filtrar os findings de segurança P1 que afetam código de produção real (não skills/scripts externos)
3. **Classificar por risco:** Para findings reais, classificar por impacto real (exposição de segredo, vulnerabilidade explorável, etc.)
4. **Corrigir ou mitigar:** Para cada finding real de alta prioridade, aplicar correção ou mitigação

## Teste esperado

- `npx tsc --noEmit` passa
- `npm run lint` passa
- Segredos removidos ou movidos para variáveis de ambiente
- Scan de segredos (ex: trivy, gitleaks) limpo em código de produção

## Contexto adicional

Audit completo em: `c:\Users\marce\OneDrive\Desktop\BirthHub360-Debt-Audit\BirthHub360-TechDebt-Report-20260929-120403.html`

Distribuição Security: 313 findings (188 P1, 125 P2). A maioria parece estar em scripts de skills externas.

Referência: AGENTS.md define Agente 15 como responsável por "Segurança Aplicada e Rotação de Segredos".

## Decisão do Coordenador (2026-09-29)

**Falsos positivos identificados:** Os 180+ findings de "segredo hardcoded" em `live-browser.js` são **falsos positivos** (script de skill externa, não código de produção).

**Instrução ao Agente 15:**
- Filtrar findings removendo todos os relacionados a `live-browser.js` (tanto `.agents/` quanto `.claude/`)
- Focar apenas em findings de segurança P1 que afetam código de produção real (`src/**`, `prisma/**`, migrations, etc.)
- Priorizar findings que representam risco real de exposição de segredos em produção
- Ignorar findings em skills/scripts externos por enquanto (não são código de produção crítico)

**Ação executada:** Duplicata de `live-browser.js` removida (manter apenas em `.agents/skills/`)
