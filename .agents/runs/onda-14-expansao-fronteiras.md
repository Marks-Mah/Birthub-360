# Onda 14 - Expansão de Fronteiras

**Status:** EM EXECUÇÃO
**Data:** 2026-10-08
**Coordenador:** Agente 00

## Objetivo
Levantar o Freeze de Escopo (Pós-Sprint 13) e iniciar os 3 grandes épicos estruturais do Birth Hub 360: Invasão CRM, Inteligência em Tempo Real, e Escala/Resiliência.

## Épicos e Agentes Designados

### 1. A Invasão dos Novos CRMs (Agente 06)
- **Escopo:** HubSpot, Pipedrive, RD Station, Monday.com.
- **Plano:** Criar os conectores base em `src/features/integrations/`. Implementar OAuth/API Keys, mapeamento de funil, e endpoints de webhook. Expandir Prisma Schema se necessário (via handoff ao Agente 01).

### 2. Inteligência em Tempo Real (Agente 07)
- **Escopo:** LiveKit, Flowise / OpenWebUI.
- **Plano:** Plugar o Dispatcher de Voz e a Cadência Multicanal (recém-estruturados) a motores de streaming WebRTC (LiveKit) e orquestração visual de prompts (Flowise). O objetivo é negociação autônoma por voz, sem gargalo.

### 3. Escala e Resiliência (Agente 16)
- **Escopo:** Temporal.io, Crawlee.
- **Plano:** Substituir ou estender o BullMQ/Jobs simples por workers hiper-resilientes com Temporal. Usar Crawlee (Playwright/Cheerio) para o Enriquecimento Deep de Mercado na prospecção.
