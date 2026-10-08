- De: 07 (IA e Automações)
- Para: 12 (Voz e Telefonia)
- Onda: 14
- Status: aberto
- Prioridade: bloqueador

## Problema
O Agente 07 estruturou os serviços de orquestração de voz com IA (`src/features/ai-voice/ai-voice-orchestrator.service.ts`, `flowise-router.service.ts` e `webrtc-channel.service.ts`), com o objetivo de negociação autônoma por voz e streaming WebRTC. Porém, o domínio de telefonia (sessões SIP, 3CX, controle de chamadas ativas, codec RTP, áudio bidirecional telefônico) é propriedade do Agente 12. Sem a ponte entre o canal WebRTC e o gateway de telefonia, comandos de voz gerados pela IA não atingem a linha telefônica real, incorrendo no bloqueador prioritário B-07 ("Comando de voz que afirma executar ação sem executá-la").

## Arquivo(s) envolvido(s)
- `src/features/ai-voice/ai-voice-orchestrator.service.ts`
- `src/features/ai-voice/webrtc-channel.service.ts`
- `src/features/voice/**`
- `src/features/cadence/dialer/**`

## Alteração necessária
O Agente 12 deve:
1. Definir o contrato de handshake para conectar uma chamada ativa (SIP/3CX) à sessão WebRTC / LiveKit gerenciada pelo `AiVoiceOrchestratorService`.
2. Prover o canal de streaming de áudio bidirecional (audio in do microfone do lead -> STT -> LLM; audio out do TTS -> audio stream da chamada telefônica).
3. Implementar controle de interrupção (barge-in): quando o lead fala durante a resposta da IA, a reprodução de áudio da IA deve ser pausada instantaneamente.
4. Sinalizar término de chamada com status de sucesso/falha e disparar persistência de gravação.

## Teste esperado
- Teste de integração de chamada simulada com troca de pacotes de áudio bidirecional.
- Comprovação de que comandos emitidos pelo agente de voz refletem em ações observáveis no sistema (eliminação do risco B-07).

## Contexto adicional
Bloqueador prioritário B-07.
