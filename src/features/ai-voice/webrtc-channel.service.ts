import { logger } from '../../lib/logger.js';

/**
 * Stub service for WebRTC channels via LiveKit.
 * This service manages real-time audio media streams.
 */
export class WebRTCChannelService {
  /**
   * Initializes a WebRTC connection for a given session.
   */
  async connectSession(sessionId: string, targetNumber: string): Promise<void> {
    logger.info({ sessionId, targetNumber }, 'Connecting WebRTC channel (LiveKit)... (STUB)');
    // TODO: Implement actual LiveKit room creation and token generation
  }

  /**
   * Terminates the WebRTC connection.
   */
  async disconnectSession(sessionId: string): Promise<void> {
    logger.info({ sessionId }, 'Disconnecting WebRTC channel (LiveKit)... (STUB)');
    // TODO: Implement actual LiveKit disconnection
  }
}

export const webRTCChannelService = new WebRTCChannelService();
