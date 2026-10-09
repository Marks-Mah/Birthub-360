- De: 07 (IA e Automações)
- Para: 02 (Produto e UX)
- Onda: 15
- Status: aberto
- Prioridade: alto

## Problema
Os insights de contorno de objeções gerados pela IA durante as chamadas telefônicas precisam ser exibidos visualmente na interface de atendimento do closer/SDR sem cobrir elementos críticos da tela do CRM ou causar sobrecarga cognitiva.

## Arquivo(s) envolvido(s)
- `src/App.tsx`
- `src/features/voice/**`
- `src/features/copilot/components/**`

## Alteração necessária
O Agente 02 deve:
1. Desenvolver o componente flutuante `LiveCopilotHUD` acionado durante chamadas ativas.
2. Apresentar sugestões de argumentação com badge de confiança da IA, transcrição em streaming e botão de ação rápida (ex.: "Copiar argumento", "Inserir proposta").
3. Garantir estados de minimização, redimensionamento e acessibilidade (WCAG 2.2 AA).

## Teste esperado
- Validação visual e teste de renderização em diferentes resoluções de tela.
