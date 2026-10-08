- De: 07 (IA e Automações)
- Para: 21 (Privacidade e LGPD)
- Onda: 14
- Status: aberto
- Prioridade: bloqueador

## Problema
O módulo de IA em tempo real (`src/features/ai-voice/`) realiza captura contínua de áudio, transcrição (STT) e processamento semântico por LLMs. Áudio de voz humana constitui dado biométrico e pessoal sob a LGPD (Lei 13.709/2018). Processar, transmitir a servidores externos (Flowise / OpenAI / LiveKit) ou armazenar áudios sem base legal explicitada, sem consentimento registrado e sem política formal de retenção e exclusão viola o bloqueador prioritário B-13 ("Tratamento de dados pessoais sem base legal, retenção ou exclusão") e a regra global §27.

## Arquivo(s) envolvido(s)
- `src/features/ai-voice/ai-voice-orchestrator.service.ts`
- `src/features/voice/**`
- `src/features/privacy/**`
- `src/services/lgpdService.ts`

## Alteração necessária
O Agente 21 deve:
1. Definir a base legal (Consentimento expresso ou Execução de contrato / Legítimo interesse com salvaguardas) para chamadas e streaming de voz.
2. Formular o aviso sonoro obrigatório no início da chamada comunicando a interação com inteligência artificial e a gravação ("Esta ligação é realizada com auxílio de inteligência artificial e poderá ser gravada para fins de atendimento...").
3. Especificar a tabela de retenção de dados para:
   - Áudio bruto da gravação (ex.: expurgo em 30 ou 90 dias);
   - Transcrição textual da chamada (sanitização de PII antes de indexação vetorial/RAG);
   - Logs de telemetria da IA.
4. Conectar o pipeline aos fluxos de atendimento aos Direitos do Titular (Art. 18 LGPD: acesso, revogação e exclusão permanente).

## Teste esperado
- Teste verificando que chamadas não iniciam o envio de áudio ao LLM antes da confirmação do consentimento/aviso.
- Teste de job de purga/expurgo de áudios antigos cumprindo a janela de retenção especificada.

## Contexto adicional
Bloqueador prioritário B-13 e conformidade regulatória mandatória.
