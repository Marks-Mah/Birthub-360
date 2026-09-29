- De: 00 (Coordenador)
- Para: 17 (Cadência Multicanal e Ciclo de Receita)
- Onda: techdebt-2026-09-29
- Status: aberto
- Prioridade: alto

## Problema

Auditoria de tech debt identificou arquivo monolítico em `src/features/cadence/**`:

- `components/CadenceHub.tsx` - 1668 linhas

## Arquivo(s) envolvido(s)

- `src/features/cadence/components/CadenceHub.tsx` (1668 linhas)

## Alteração necessária

Decompor o arquivo por responsabilidade, visando ganho claro de coesão, testabilidade e ownership:

- Extrair subcomponentes (cadência visual, timeline, configuração, etc.)
- Separar hooks customizados relacionados a cadência
- Criar componentes menores e focados
- Seguir arquitetura definida em `AGENTS.md` (domain/application/infra)

## Teste esperado

- `npx tsc --noEmit` passa
- `npm run lint` passa
- `npm run test:unit -- src/features/cadence` passa
- `npm run build` passa
- Funcionalidade existente preservada

## Contexto adicional

Audit completo em: `c:\Users\marce\OneDrive\Desktop\BirthHub360-Debt-Audit\BirthHub360-TechDebt-Report-20260929-120403.html`

Classificado como P1 (Architecture) no audit. Recomendação: "Decompor por responsabilidade somente quando houver ganho claro de coesão, testabilidade e ownership."

Referência: AGENTS.md em `src/features/cadence/AGENTS.md` define Agente 17 como dono desta pasta.
