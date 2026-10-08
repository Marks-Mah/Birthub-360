import { logger } from '../../lib/logger.js';
import { webRTCChannelService } from './webrtc-channel.service.js';
import { flowiseRouterService } from './flowise-router.service.js';
import type { OutboundCallResult, VoiceAgentType } from '../integrations/birth-voice/birthVoice.service.js';

/**
 * Orchestrator stub that connects the existing birthVoice.service to
 * the new real-time intelligence engine (WebRTC + Flowise).
 */
export class AiVoiceOrchestratorService {
  /**
   * Initializes a new AI voice session.
   * This would eventually be called by birthVoice.service.ts or replace its external provider logic.
   */
  async initializeCallSession(
    organizationId: string,
    leadId: string,
    targetNumber: string,
    agentType: VoiceAgentType
  ): Promise<OutboundCallResult> {
    const sessionId = `livekit-sess-${leadId}-${Date.now()}`;
    const callSid = `livekit-call-${leadId}`;

    logger.info({ organizationId, leadId, targetNumber, agentType }, 'Initializing Real-time AI Voice session... (STUB)');

    // 1. Establish WebRTC channel (LiveKit)
    await webRTCChannelService.connectSession(sessionId, targetNumber);

    // 2. Prepare context for LLM routing (Flowise)
    const initialContext = {
      leadId,
      organizationId,
      agentType
    };
    
    // Simulate initial system prompt routing
    await flowiseRouterService.routePrompt(sessionId, 'SYSTEM_INIT', initialContext);

    // Return the result format expected by the current system
    return {
      sessionId,
      callSid,
      status: 'in-progress'
    };
  }

  async endCallSession(sessionId: string): Promise<void> {
    logger.info({ sessionId }, 'Ending Real-time AI Voice session... (STUB)');
    await webRTCChannelService.disconnectSession(sessionId);
  }
}

export const aiVoiceOrchestratorService = new AiVoiceOrchestratorService();
