import { useEffect, useState } from 'react';
import type {
  LiveCallSession,
  LiveCopilotState,
  LiveTranscriptionEntry,
  ObjectionDetectionResult,
} from './types.js';

export const COPILOT_CALL_START_EVENT = 'copilot:call-start';
export const COPILOT_CALL_END_EVENT = 'copilot:call-end';
export const COPILOT_OBJECTION_EVENT = 'copilot:objection-detected';
export const COPILOT_TRANSCRIPT_EVENT = 'copilot:transcript-chunk';

let globalState: LiveCopilotState = {
  isCallActive: false,
  session: null,
  objections: [],
  latestObjection: null,
  transcripts: [],
  isStreamingAudio: false,
};

const listeners = new Set<(state: LiveCopilotState) => void>();

function notify() {
  listeners.forEach((listener) => listener({ ...globalState }));
}

export const copilotLiveBus = {
  getState(): LiveCopilotState {
    return { ...globalState };
  },

  startCall(sessionData?: Partial<LiveCallSession>): void {
    const session: LiveCallSession = {
      sessionId: sessionData?.sessionId || `call-${Date.now()}`,
      leadId: sessionData?.leadId,
      leadName: sessionData?.leadName || 'Lead Comercial',
      leadCompany: sessionData?.leadCompany || 'Empresa em Prospecção',
      dealValue: sessionData?.dealValue,
      status: 'active',
      startedAt: Date.now(),
    };

    globalState = {
      isCallActive: true,
      session,
      objections: [],
      latestObjection: null,
      transcripts: [],
      isStreamingAudio: true,
    };

    notify();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(COPILOT_CALL_START_EVENT, { detail: session }));
    }
  },

  endCall(): void {
    globalState = {
      ...globalState,
      isCallActive: false,
      isStreamingAudio: false,
      session: globalState.session ? { ...globalState.session, status: 'ended' } : null,
    };

    notify();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(COPILOT_CALL_END_EVENT));
    }
  },

  emitObjection(objection: ObjectionDetectionResult): void {
    const existing = globalState.objections;
    globalState = {
      ...globalState,
      objections: [objection, ...existing].slice(0, 10),
      latestObjection: objection,
    };

    notify();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(COPILOT_OBJECTION_EVENT, { detail: objection }));
    }
  },

  emitTranscript(entry: {
    text: string;
    speaker?: 'lead' | 'agent' | 'user' | 'unknown';
    isFinal?: boolean;
  }): void {
    const item: LiveTranscriptionEntry = {
      id: `chunk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: entry.text,
      speaker: entry.speaker || 'lead',
      timestamp: Date.now(),
      isFinal: entry.isFinal ?? true,
    };

    globalState = {
      ...globalState,
      transcripts: [...globalState.transcripts, item].slice(-25),
      isStreamingAudio: true,
    };

    notify();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(COPILOT_TRANSCRIPT_EVENT, { detail: item }));
    }
  },

  subscribe(listener: (state: LiveCopilotState) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  reset(): void {
    globalState = {
      isCallActive: false,
      session: null,
      objections: [],
      latestObjection: null,
      transcripts: [],
      isStreamingAudio: false,
    };
    notify();
  },
};

/**
 * Hook reativo para componentes React consumirem o estado do Copilot Live.
 */
export function useLiveCopilotSession(): LiveCopilotState & {
  startCall: typeof copilotLiveBus.startCall;
  endCall: typeof copilotLiveBus.endCall;
  emitObjection: typeof copilotLiveBus.emitObjection;
  emitTranscript: typeof copilotLiveBus.emitTranscript;
} {
  const [state, setState] = useState<LiveCopilotState>(() => copilotLiveBus.getState());

  useEffect(() => {
    const unsubscribe = copilotLiveBus.subscribe(setState);
    return () => unsubscribe();
  }, []);

  return {
    ...state,
    startCall: copilotLiveBus.startCall,
    endCall: copilotLiveBus.endCall,
    emitObjection: copilotLiveBus.emitObjection,
    emitTranscript: copilotLiveBus.emitTranscript,
  };
}
