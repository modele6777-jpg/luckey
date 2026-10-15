import { playTTSInChunks, stopTTS, subscribeTTS, TTSState } from "@/utils/tts";
import { acquireScreenWakeLock, releaseScreenWakeLock } from "@/lib/wakeLock";
import { useState, useEffect } from "react";

export type PoemRecitationVoice = "female" | "male";

export interface PoemItemForSpeech {
  id?: string;
  title: string;
  poet: string;
  excerpt: string;
  whyRecommended?: string;
  country?: string;
  origin?: string;
}

export interface PoemRecitationState {
  isSpeaking: boolean;
  isLoading: boolean;
  activePoemId: string | null;
  activePoemTitle: string | null;
  activePoemPoet: string | null;
  voice: PoemRecitationVoice;
  includeInsight: boolean;
  activeSessionId: string | null;
}

export type PoemRecitationListener = (state: PoemRecitationState) => void;

const STORAGE_KEY_VOICE = "luckey_poem_tts_voice";
const STORAGE_KEY_INSIGHT = "luckey_poem_tts_insight";

export function formatPoemRecitationText(
  poem: PoemItemForSpeech,
  includeInsight: boolean = false
): string {
  const title = poem.title.trim();
  const poet = poem.poet.trim();
  
  // Format verses with natural breath cadence
  const verses = poem.excerpt
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(".\n");

  let script = `${title}.\n시인 ${poet}.\n\n${verses}`;

  if (includeInsight && poem.whyRecommended) {
    script += `\n\n시적 통찰 및 해설.\n${poem.whyRecommended.trim()}`;
  }

  return script;
}

class PoemRecitationService {
  private state: PoemRecitationState = {
    isSpeaking: false,
    isLoading: false,
    activePoemId: null,
    activePoemTitle: null,
    activePoemPoet: null,
    voice: "female",
    includeInsight: false,
    activeSessionId: null,
  };

  private listeners: Set<PoemRecitationListener> = new Set();
  private currentSessionId: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const savedVoice = localStorage.getItem(STORAGE_KEY_VOICE) as PoemRecitationVoice;
        if (savedVoice === "female" || savedVoice === "male") {
          this.state.voice = savedVoice;
        }
        const savedInsight = localStorage.getItem(STORAGE_KEY_INSIGHT);
        if (savedInsight !== null) {
          this.state.includeInsight = savedInsight === "true";
        }
      } catch {
        // ignore storage errors
      }

      // Synchronize with global TTS state
      subscribeTTS((tts: TTSState) => {
        const active = tts.isSpeaking || tts.isLoading;
        if (!active && (this.state.isSpeaking || this.state.isLoading)) {
          this.currentSessionId = null;
          this.updateState({
            isSpeaking: false,
            isLoading: false,
            activePoemId: null,
            activePoemTitle: null,
            activePoemPoet: null,
            activeSessionId: null,
          });
          releaseScreenWakeLock().catch(() => {});
        } else if (this.currentSessionId && tts.activeSessionId === this.currentSessionId) {
          this.updateState({
            isSpeaking: tts.isSpeaking,
            isLoading: tts.isLoading,
          });
        }
      });
    }
  }

  public getState(): PoemRecitationState {
    return { ...this.state };
  }

  public subscribe(listener: PoemRecitationListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(partial: Partial<PoemRecitationState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((l) => l(this.getState()));
  }

  public setVoice(voice: PoemRecitationVoice) {
    this.updateState({ voice });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_VOICE, voice);
      } catch {}
    }
  }

  public setIncludeInsight(includeInsight: boolean) {
    this.updateState({ includeInsight });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_INSIGHT, String(includeInsight));
      } catch {}
    }
  }

  public isPoemPlaying(titleOrId?: string): boolean {
    if (!titleOrId) return this.state.isSpeaking || this.state.isLoading;
    const isMatch =
      (this.state.activePoemId && this.state.activePoemId === titleOrId) ||
      (this.state.activePoemTitle &&
        this.state.activePoemTitle.toLowerCase() === titleOrId.toLowerCase());
    return Boolean(isMatch && (this.state.isSpeaking || this.state.isLoading));
  }

  public stop() {
    this.currentSessionId = null;
    stopTTS();
    this.updateState({
      isSpeaking: false,
      isLoading: false,
      activePoemId: null,
      activePoemTitle: null,
      activePoemPoet: null,
      activeSessionId: null,
    });
    releaseScreenWakeLock().catch(() => {});
  }

  public async playPoem(
    poem: PoemItemForSpeech,
    options?: {
      voice?: PoemRecitationVoice;
      includeInsight?: boolean;
    }
  ): Promise<void> {
    const targetVoice = options?.voice || this.state.voice;
    const targetInsight =
      options?.includeInsight !== undefined
        ? options.includeInsight
        : this.state.includeInsight;

    // If currently speaking this exact poem, toggle off
    if (
      (this.state.isSpeaking || this.state.isLoading) &&
      (this.state.activePoemTitle === poem.title ||
        (poem.id && this.state.activePoemId === poem.id))
    ) {
      this.stop();
      return;
    }

    // Stop any existing playback first
    this.stop();

    const sessionId = "poem_recitation_" + Math.random().toString(36).substring(2, 9);
    this.currentSessionId = sessionId;

    this.updateState({
      isLoading: true,
      isSpeaking: false,
      activePoemId: poem.id || null,
      activePoemTitle: poem.title,
      activePoemPoet: poem.poet,
      voice: targetVoice,
      includeInsight: targetInsight,
      activeSessionId: sessionId,
    });

    acquireScreenWakeLock().catch(() => {});

    // Prepare speech text
    const textToRecite = formatPoemRecitationText(poem, targetInsight);
    const voiceApiName = "Kore";

    try {
      // Chunked streaming recitation with prefetching for seamless listening
      await playTTSInChunks(textToRecite, voiceApiName, 380, "차분");
    } catch (err) {
      console.warn("[PoemRecitationService] Recitation failed:", err);
    } finally {
      if (this.currentSessionId === sessionId) {
        this.stop();
      }
    }
  }

  public togglePoem(
    poem: PoemItemForSpeech,
    options?: {
      voice?: PoemRecitationVoice;
      includeInsight?: boolean;
    }
  ) {
    if (this.isPoemPlaying(poem.id || poem.title)) {
      this.stop();
    } else {
      this.playPoem(poem, options);
    }
  }
}

export const poemRecitationService = new PoemRecitationService();

/** React hook for poem recitation controls and state */
export function usePoemRecitation() {
  const [state, setState] = useState<PoemRecitationState>(poemRecitationService.getState());

  useEffect(() => {
    return poemRecitationService.subscribe(setState);
  }, []);

  return {
    state,
    isSpeaking: state.isSpeaking,
    isLoading: state.isLoading,
    activePoemId: state.activePoemId,
    activePoemTitle: state.activePoemTitle,
    activePoemPoet: state.activePoemPoet,
    voice: state.voice,
    includeInsight: state.includeInsight,
    isPoemPlaying: (titleOrId?: string) => poemRecitationService.isPoemPlaying(titleOrId),
    playPoem: (poem: PoemItemForSpeech, options?: { voice?: PoemRecitationVoice; includeInsight?: boolean }) =>
      poemRecitationService.playPoem(poem, options),
    togglePoem: (poem: PoemItemForSpeech, options?: { voice?: PoemRecitationVoice; includeInsight?: boolean }) =>
      poemRecitationService.togglePoem(poem, options),
    stop: () => poemRecitationService.stop(),
    setVoice: (voice: PoemRecitationVoice) => poemRecitationService.setVoice(voice),
    setIncludeInsight: (includeInsight: boolean) => poemRecitationService.setIncludeInsight(includeInsight),
  };
}
