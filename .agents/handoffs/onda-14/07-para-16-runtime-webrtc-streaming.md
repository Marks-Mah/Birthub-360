- De: 07 (IA e Automações)
- Para: 16 (Runtime, Workers e Escala)
- Onda: 14
- Status: aberto
- Prioridade: alto

## Problema
O processamento de áudio em tempo real e WebRTC (`src/features/ai-voice/webrtc-channel.service.ts`) exige concorrência de streaming com latência sub-segundo (< 300ms) por chamada. Se rodar acoplado no mesmo processo do servidor principal da aplicação HTTP (`server.ts`), há risco de saturação do event loop por buffering intensivo, transcodificação e streaming simultâneo de múltiplos canais de áudio.

## Arquivo(s) envolvido(s)
- `src/features/ai-voice/webrtc-channel.service.ts`
- `worker.ts`
- `src/lib/queue/**`
- `server.ts`

## Alteração necessária
O Agente 16 deve:
1. Isolar os canais de streaming de áudio e conexões LiveKit/WebRTC em workers dedicados ou processos filhos desacoplados da API REST principal.
2. Estabelecer controle de backpressure para tráfego de pacotes de áudio, impedindo vazamentos de memória (OOM).
3. Avaliar thread pool ou WebSockets dedicados para gerenciar conexões em tempo real.

## Teste esperado
- Teste de estresse com múltiplas conexões concorrentes simuladas sem degradação do tempo de resposta da API HTTP principal (`server.ts`).
- Monitoramento de uso de heap e CPU estável sob concorrência.

## Contexto adicional
Alinha o módulo de voz com a governança de escalabilidade do Agente 16.
