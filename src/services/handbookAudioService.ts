import { playTTS, stopTTS, pauseTTS, resumeTTS, subscribeTTS } from '@/utils/tts';
import { acquireScreenWakeLock, releaseScreenWakeLock } from '@/lib/wakeLock';
import {
  HandbookChannel,
  NarrationSegment,
  buildDetailedChapterSegments,
  buildChannelSegments,
  buildAllChannelsSegments,
} from '@/data/handbookData';

export type HandbookPlaybackMode = 'idle' | 'all' | 'channel' | 'chapter';

export interface HandbookAudioState {
  isPlaying: boolean;
  isPaused: boolean;
  activePlaybackMode: HandbookPlaybackMode;
  activeSegment: NarrationSegment | null;
  segmentProgress: { current: number; total: number };
  playlist: NarrationSegment[];
  currentIndex: number;
}

type HandbookAudioListener = (state: HandbookAudioState) => void;

class HandbookAudioService {
  private state: HandbookAudioState = {
    isPlaying: false,
    isPaused: false,
    activePlaybackMode: 'idle',
    activeSegment: null,
    segmentProgress: { current: 0, total: 0 },
    playlist: [],
    currentIndex: 0,
  };

  private listeners: Set<HandbookAudioListener> = new Set();
  private playbackSessionId: string = '';
  private isProcessingQueue: boolean = false;
  private ttsUnsubscribe: (() => void) | null = null;
  private isTtsSpeakingOrLoading: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.ttsUnsubscribe = subscribeTTS((ttsState) => {
        this.isTtsSpeakingOrLoading = ttsState.isSpeaking || ttsState.isLoading;
      });
    }
  }

  public getState(): HandbookAudioState {
    return { ...this.state };
  }

  public subscribe(listener: HandbookAudioListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error('[HandbookAudioService] listener error:', err);
      }
    });
  }

  public async playSegments(
    segments: NarrationSegment[],
    mode: HandbookPlaybackMode = 'channel',
    startIndex = 0
  ): Promise<void> {
    if (!segments || segments.length === 0) return;

    // Generate unique session ID to invalidate any prior running loop
    const sessionId = `handbook_session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.playbackSessionId = sessionId;

    stopTTS();
    await acquireScreenWakeLock();

    this.state = {
      ...this.state,
      isPlaying: true,
      isPaused: false,
      activePlaybackMode: mode,
      playlist: segments,
      currentIndex: Math.max(0, Math.min(startIndex, segments.length - 1)),
      segmentProgress: {
        current: Math.max(0, Math.min(startIndex, segments.length - 1)) + 1,
        total: segments.length,
      },
      activeSegment: segments[Math.max(0, Math.min(startIndex, segments.length - 1))],
    };
    this.notify();

    this.runPlaybackLoop(sessionId);
  }

  public startGrandAudiobook(): void {
    const allSegments = buildAllChannelsSegments();
    this.playSegments(allSegments, 'all', 0);
  }

  public startChannelAudiobook(channel: HandbookChannel): void {
    const segments = buildChannelSegments(channel);
    this.playSegments(segments, 'channel', 0);
  }

  public startChapterAudiobook(channel: HandbookChannel, chapterIndex: number): void {
    const segments = buildDetailedChapterSegments(channel, chapterIndex, true);
    this.playSegments(segments, 'chapter', 0);
  }

  private async runPlaybackLoop(sessionId: string): Promise<void> {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    try {
      while (
        this.playbackSessionId === sessionId &&
        this.state.isPlaying &&
        this.state.currentIndex < this.state.playlist.length
      ) {
        // If paused, wait in a non-blocking poll
        if (this.state.isPaused) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          continue;
        }

        const seg = this.state.playlist[this.state.currentIndex];
        if (!seg) break;

        this.state.activeSegment = seg;
        this.state.segmentProgress = {
          current: this.state.currentIndex + 1,
          total: this.state.playlist.length,
        };
        this.notify();

        try {
          // Play segment TTS with priority
          await playTTS(seg.text, 'Kore', true);
        } catch (ttsErr) {
          console.warn('[HandbookAudioService] Segment TTS error:', ttsErr);
        }

        // Check if session was stopped/cancelled during speech
        if (this.playbackSessionId !== sessionId || !this.state.isPlaying) {
          break;
        }

        // Brief pleasant pause between segments (550ms)
        await new Promise((resolve) => setTimeout(resolve, 550));

        if (this.playbackSessionId !== sessionId || !this.state.isPlaying) {
          break;
        }

        this.state.currentIndex += 1;
      }

      // Reached the end of the playlist naturally
      if (this.playbackSessionId === sessionId && this.state.isPlaying) {
        this.stop();
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  public pause(): void {
    if (!this.state.isPlaying || this.state.isPaused) return;
    this.state.isPaused = true;
    pauseTTS();
    this.notify();
  }

  public resume(): void {
    if (!this.state.isPlaying || !this.state.isPaused) return;
    this.state.isPaused = false;
    resumeTTS();
    this.notify();
  }

  public togglePlayPause(): void {
    if (!this.state.isPlaying) {
      if (this.state.playlist.length > 0) {
        this.playSegments(this.state.playlist, this.state.activePlaybackMode, this.state.currentIndex);
      }
      return;
    }
    if (this.state.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  public stop(): void {
    this.playbackSessionId = '';
    stopTTS();
    void releaseScreenWakeLock();

    this.state = {
      ...this.state,
      isPlaying: false,
      isPaused: false,
      activePlaybackMode: 'idle',
      activeSegment: null,
      segmentProgress: { current: 0, total: 0 },
    };
    this.notify();
  }

  public skipNext(): void {
    if (!this.state.isPlaying || this.state.playlist.length === 0) return;
    if (this.state.currentIndex + 1 < this.state.playlist.length) {
      const nextIndex = this.state.currentIndex + 1;
      stopTTS();
      this.playSegments(this.state.playlist, this.state.activePlaybackMode, nextIndex);
    } else {
      this.stop();
    }
  }

  public skipPrevious(): void {
    if (!this.state.isPlaying || this.state.playlist.length === 0) return;
    const prevIndex = Math.max(0, this.state.currentIndex - 1);
    stopTTS();
    this.playSegments(this.state.playlist, this.state.activePlaybackMode, prevIndex);
  }
}

export const handbookAudioService = new HandbookAudioService();
