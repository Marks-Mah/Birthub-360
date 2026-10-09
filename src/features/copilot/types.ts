import type {
  ObjectionCategory,
  ObjectionDetectionResult,
  SuggestedRebuttal,
} from '../../shared/services/objectionDetection.service.js';

export type HUDSize = 'compact' | 'standard' | 'expanded';

export interface LiveCallSession {
  sessionId: string;
  leadId?: string;
  leadName: string;
  leadCompany: string;
  dealValue?: string;
  status: 'active' | 'paused' | 'ended';
  startedAt: number;
}

export interface LiveTranscriptionEntry {
  id: string;
  speaker: 'lead' | 'agent' | 'user' | 'unknown';
  text: string;
  timestamp: number;
  isFinal?: boolean;
}

export interface LiveCopilotState {
  isCallActive: boolean;
  session: LiveCallSession | null;
  objections: ObjectionDetectionResult[];
  latestObjection: ObjectionDetectionResult | null;
  transcripts: LiveTranscriptionEntry[];
  isStreamingAudio: boolean;
}

export type { ObjectionCategory, ObjectionDetectionResult, SuggestedRebuttal };
