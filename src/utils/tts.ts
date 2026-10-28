import { scoreSpeechVoice } from './speechVoice';
import { useState, useEffect } from 'react';
import {
  getSharedAudioContext,
  unlockAudioPlayback,
  playTTSAudio,
  playCompressedAudio,
  playRawPCM,
  primeTTSAudioElement,
  pauseTTSAudio,
  resumeTTSAudio,
  stopTTSPlayback,
  initTTSAudioLifecycle,
  analyzeTextEmotion,
  duckAmbientAudio,
  configureSpeechAudioSession,
  configureAmbientAudioSession,
} from '../lib/audio';
import { playAiResultNotification } from '../lib/audioHaptics';
import { setTTSSessionActive, clearTTSSession, initTTSSessionHandlers, pauseTTSSession, resumeTTSSession } from '../lib/ttsMediaSession';
import { acquireScreenWakeLock, releaseScreenWakeLock } from '../lib/wakeLock';
import { prepareNaturalSpeechText } from './speechText';
export { prepareNaturalSpeechText };
import { isIOSDevice } from '../lib/perfMode';

export interface TTSPlaybackOptions {
  skipCompletionChime?: boolean;
  isAutoPlay?: boolean;
  isAutoPlayback?: boolean;
  isUserToggleClick?: boolean;
}

let nativeSpeechSessionId: string | null = null;
let nativeFallbackUntil = 0;

// Pre-warm the browser's speechSynthesis engine to load premium voices asynchronously immediately on load
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// Global reference set to protect against Chromium/WebKit SpeechSynthesisUtterance garbage collection cutoff bug
const activeUtterances = new Set<SpeechSynthesisUtterance>();
if (typeof window !== 'undefined') {
  (window as any).__prismActiveUtterances = activeUtterances;
}

export function playNativeBrowserSpeech(
  cleanText: string,
  wait: boolean = false,
  sessionToVerify?: string | null,
  isSequenceChunk: boolean = false,
  voiceNameOrType: string = 'Aoede',
  speed?: number,
  options?: TTSPlaybackOptions,
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.reject(new Error('이 브라우저에서 음성 재생을 사용할 수 없습니다.'));
  }

  configureSpeechAudioSession();

  // Ensure speech synthesis engine is active and not paused by browser
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch (_) {}

  // Cancel any existing speech only if not in a sequence chunk
  if (!isSequenceChunk) {
    try {
      stopTTSPlayback();
      window.speechSynthesis.cancel();
    } catch (_) {}
  }

  const isKorean = /[가-힣]/.test(cleanText);
  const utterance = new SpeechSynthesisUtterance(cleanText);
  activeUtterances.add(utterance);
  utterance.lang = isKorean ? 'ko-KR' : 'en-US';

  // 🌟 모든 음성 낭독을 유니버스 인사이트 명언과 동일한 1.0 배속 표준 속도로 고정
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  const voicesList = window.speechSynthesis.getVoices();
  const langCode = isKorean ? 'ko' : 'en';
  const langVoices = voicesList.filter((v) => v.lang.toLowerCase().startsWith(langCode));

  if (langVoices.length > 0) {
    const sorted = [...langVoices].sort((a, b) => scoreSpeechVoice(b) - scoreSpeechVoice(a));
    if (sorted.length > 0 && scoreSpeechVoice(sorted[0]) > -500) utterance.voice = sorted[0];
  }
  // Pitch shifting makes fallback speech sound synthetic; preserve the voice's timbre.
  utterance.pitch = 1.0;

  const firstSub = splitSpeechIntoSentences(cleanText)[0] || cleanText;
  updateTTSState({
    isLoading: false,
    isSpeaking: true,
    activeText: cleanText,
    ...(isSequenceChunk
      ? {}
      : {
          currentSentence: firstSub,
          activeSentence: firstSub,
        }),
    activeSentenceIndex: 0,
    totalSentences: 1,
  });
  setTTSSessionActive(isSequenceChunk ? (ttsState.activeSentence || cleanText) : firstSub);

  // Resume-only keepalive timer (never call pause() mid-utterance, which causes mobile TTS to restart from 0s)
  let keepAliveInterval: any = null;
  const startKeepAlive = () => {
    keepAliveInterval = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (ttsState.isSpeaking && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    }, 4000);
  };
  const clearKeepAlive = () => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
  };

  return new Promise<void>((resolve, reject) => {
    let isSettled = false;
    const finish = (completedNaturally: boolean, failure?: Error) => {
      if (isSettled) return;
      isSettled = true;
      activeUtterances.delete(utterance);
      clearKeepAlive();
      if (sessionToVerify && ttsState.activeSessionId === sessionToVerify && !isSequenceChunk) {
        stopTTS();
        if (completedNaturally && !options?.skipCompletionChime) {
          try {
            playAiResultNotification();
          } catch (_) {}
        }
      }
      if (failure) reject(failure); else resolve();
    };

    utterance.onend = () => finish(true);
    utterance.onerror = (event) => {
      if ((event.error === 'canceled' || event.error === 'interrupted') && sessionToVerify && ttsState.activeSessionId !== sessionToVerify) { finish(false); return; }
      finish(false, new Error('음성을 재생하지 못했습니다. 미디어 음량과 기기의 음성 설정을 확인한 뒤 다시 눌러 주세요.'));
    };

    startKeepAlive();
    window.speechSynthesis.speak(utterance);

    if (!wait) {
      resolve();
    }
  });
}

export interface TTSState {
  isSpeaking: boolean;
  isLoading: boolean;
  activeText: string | null;
  activeFullText?: string | null;
  activeSessionId: string | null;
  currentSentence?: string | null;
  activeSentence?: string | null;
  activeSentenceIndex?: number;
  totalSentences?: number;
}

let ttsState: TTSState = {
  isSpeaking: false,
  isLoading: false,
  activeText: null,
  activeFullText: null,
  activeSessionId: null,
  currentSentence: null,
  activeSentence: null,
  activeSentenceIndex: -1,
  totalSentences: 0,
};

type TTSListener = (state: TTSState) => void;
const listeners = new Set<TTSListener>();

export const subscribeTTS = (listener: TTSListener) => {
  listeners.add(listener);
  // Emit current state immediately
  listener(ttsState);
  return () => {
    listeners.delete(listener);
  };
};

const updateTTSState = (newState: Partial<TTSState>) => {
  const prevActive = ttsState.isSpeaking || ttsState.isLoading;
  ttsState = { ...ttsState, ...newState };
  const nextActive = ttsState.isSpeaking || ttsState.isLoading;

  if (!prevActive && nextActive) {
    // Keep external music in the ambient mix; only lower the app’s own BGM.
    configureSpeechAudioSession();
    duckAmbientAudio(true, 0.6);
  } else if (prevActive && !nextActive) {
    duckAmbientAudio(false, 1.2);
    // TTS 종료 → 외부 음악 원래 볼륨 복귀
    configureAmbientAudioSession();
  }

  listeners.forEach((l) => l(ttsState));
};

export interface TTSAudioData {
  audioContent: string;
  encoding: 'pcm' | 'mp3' | 'wav';
  sampleRate: number;
}

const ttsCache = new Map<string, Promise<TTSAudioData | null>>();

export function getTTSCacheKey(text: string, _voice?: string, _emotion?: string, _rate?: string, _speed?: number): string {
  const clean = normalizeTextForSpeech(text);
  // 🌟 모든 TTS 재생 및 캐시는 유니버스 인사이트 명언의 단일 여성 표준 음성(Gemini Kore Female v5) 1.0 배속 표준 속도로 영구 고정
  return `lucy_aoede_natural_v6_${clean}`;
}

export function prefetchTTS(text: string, voice?: string, emotion?: string, _rate?: string, _speed?: number): Promise<TTSAudioData | null> {
  const cleanText = normalizeTextForSpeech(text);
  if (!cleanText || Date.now() < nativeFallbackUntil) return Promise.resolve(null);

  let activeEmotion = emotion;
  if (!activeEmotion) {
    const emotionMatch = text.match(/\[EMOTION:\s*([^\]]+)\]/i);
    if (emotionMatch) activeEmotion = emotionMatch[1].trim();
  }

  const key = getTTSCacheKey(text, voice, activeEmotion);
  if (ttsCache.has(key)) {
    return ttsCache.get(key)!;
  }

  const promise = (async (): Promise<TTSAudioData | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voice: 'Aoede', emotion: activeEmotion, rate: '+0%', speed: 1.0 }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        ttsCache.delete(key);
        return null;
      }
      const data = await response.json();
      if (data?.audioContent) {
        return {
          audioContent: data.audioContent,
          encoding: data.encoding === 'pcm' ? 'pcm' : data.encoding === 'wav' ? 'wav' : 'mp3',
          sampleRate: data.sampleRate ?? 24000,
        };
      }
      ttsCache.delete(key);
      return null;
    } catch {
      ttsCache.delete(key);
      return null;
    }
  })();

  ttsCache.set(key, promise);
  return promise;
}

let isPlayingSequence = false;
let ttsLifecycleReady = false;

function ensureTTSLifecycle() {
  if (ttsLifecycleReady || typeof window === 'undefined') return;
  ttsLifecycleReady = true;
  initTTSAudioLifecycle();
  initTTSSessionHandlers(stopTTS, pauseTTS, resumeTTS);
}

export const pauseTTS = (): void => {
  updateTTSState({ isSpeaking: false, isLoading: false });
  pauseTTSAudio();
  pauseTTSSession();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
};

export const resumeTTS = (): void => {
  updateTTSState({ isSpeaking: true, isLoading: false });
  resumeTTSAudio();
  resumeTTSSession();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
};

export const stopTTS = () => {
  isPlayingSequence = false;
  activeUtterances.clear();
  updateTTSState({
    isSpeaking: false,
    isLoading: false,
    activeText: null,
    activeFullText: null,
    activeSessionId: null,
    currentSentence: null,
    activeSentence: null,
    activeSentenceIndex: -1,
    totalSentences: 0,
  });
  stopTTSPlayback();
  clearTTSSession();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export function normalizeTextForSpeech(text: string): string {
  return prepareNaturalSpeechText(text);
}

export const playTTS = async (
  text: string,
  voice: string = 'Aoede',
  wait: boolean = false,
  emotion?: string,
  sequenceSessionId?: string,
  isSequenceChunk: boolean = false,
  fullTextReference?: string,
  _rate?: string,
  _speed?: number,
  options?: TTSPlaybackOptions,
): Promise<void> => {
  ensureTTSLifecycle();
  const cleanText = normalizeTextForSpeech(text);
  if (!cleanText) return;

  // 🌟 모든 TTS 재생은 엄격하게 맑은 여성 음성(Aoede / SunHi / Heami)만 사용
  const targetVoice = 'Aoede';

  // If we are calling playTTS standalone (without sequence) and something is already loading/speaking for this exact text:
  if (!sequenceSessionId && (ttsState.isSpeaking || ttsState.isLoading) && (ttsState.activeText === cleanText || ttsState.activeFullText === cleanText)) {
    if (options?.isUserToggleClick) {
      stopTTS();
    }
    return;
  }

  // Determine active session ID
  let mySessionId = sequenceSessionId;
  const initialSubSentence = splitSpeechIntoSentences(cleanText)[0] || cleanText;
  if (!mySessionId) {
    mySessionId = Math.random().toString();
    stopTTS();
    try {
      primeTTSAudioElement();
      unlockAudioPlayback();
    } catch (_) {}
    updateTTSState({
      isLoading: true,
      isSpeaking: false,
      activeText: cleanText,
      currentSentence: initialSubSentence,
      activeSentence: initialSubSentence,
      activeSentenceIndex: 0,
      totalSentences: 1,
      activeFullText: fullTextReference || cleanText,
      activeSessionId: mySessionId,
    });
  } else {
    // External caller provided a sequenceSessionId directly.
    if (!ttsState.activeSessionId) {
      updateTTSState({
        isLoading: true,
        isSpeaking: false,
        activeText: cleanText,
        currentSentence: initialSubSentence,
        activeSentence: initialSubSentence,
        activeSentenceIndex: 0,
        totalSentences: 1,
        activeFullText: fullTextReference || cleanText,
        activeSessionId: mySessionId,
      });
    }
  }

  const sessionToVerify = mySessionId;
  if (nativeSpeechSessionId === mySessionId || Date.now() < nativeFallbackUntil) {
    nativeSpeechSessionId = mySessionId;
    return playNativeBrowserSpeech(cleanText, wait, sessionToVerify, isSequenceChunk, targetVoice, 1.0, options);
  }

  // Auto-extract emotion tag if not explicitly provided
  let activeEmotion = emotion;
  if (!activeEmotion) {
    const emotionMatch = text.match(/\[EMOTION:\s*([^\]]+)\]/i);
    if (emotionMatch) {
      activeEmotion = emotionMatch[1].trim();
    }
  }

  try {
    // Synchronously unlock audio during user gesture (required for mobile iOS/Android WebAudio playback)
    try {
      unlockAudioPlayback();
    } catch (e) {
      console.warn("[TTS] Failed to warm up audio systems:", e);
    }

    const cacheKey = getTTSCacheKey(text, targetVoice, activeEmotion);
    let data: TTSAudioData | null = null;
    if (ttsCache.has(cacheKey)) {
      data = await ttsCache.get(cacheKey)!;
    }

    if (!data) {
      const chunkTimeout = isSequenceChunk ? 12000 : (cleanText.length > 250 ? 25000 : 15000);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), chunkTimeout);
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voice: targetVoice, emotion: activeEmotion, rate: '+0%', speed: 1.0 }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // CRITICAL ABORT CHECK after async action
      if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) {
        console.log("[TTS] Playback aborted as active session changed mid-download.");
        return;
      }

      if (!response.ok) throw new Error(`음성 생성 요청 실패 (${response.status})`);
      const rawData = await response.json();
      if (rawData?.audioContent) {
        data = {
          audioContent: rawData.audioContent,
          encoding: rawData.encoding === 'pcm' ? 'pcm' : rawData.encoding === 'wav' ? 'wav' : 'mp3',
          sampleRate: rawData.sampleRate ?? 24000,
        };
        ttsCache.set(cacheKey, Promise.resolve(data));
      }
    }

    // CRITICAL ABORT CHECK after JSON parse
    if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) {
      console.log("[TTS] Playback aborted as active session changed mid-parse.");
      return;
    }

    // Now transition state from loading to speaking
    const speakingSubSentence = splitSpeechIntoSentences(cleanText)[0] || cleanText;
    updateTTSState({
      isLoading: false,
      isSpeaking: true,
      activeText: cleanText,
      ...(isSequenceChunk
        ? {}
        : {
            currentSentence: speakingSubSentence,
            activeSentence: speakingSubSentence,
          }),
      ...(fullTextReference ? { activeFullText: fullTextReference } : {}),
    });
    setTTSSessionActive(isSequenceChunk ? (ttsState.activeSentence || cleanText) : speakingSubSentence);

    if (data?.audioContent) {
      const encoding = data.encoding === 'pcm' ? 'pcm' : data.encoding === 'wav' ? 'wav' : 'mp3';
      const playAudio = async () => {
        try {
          await playTTSAudio(
            data!.audioContent,
            encoding,
            data!.sampleRate ?? 24000,
            activeEmotion || cleanText,
            isSequenceChunk,
            1.0,
          );
        } catch (err) {
          if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) return;
          console.warn('[TTS] playTTSAudio failed, applying WebAudio direct buffer fallback:', err);
          if (encoding === 'pcm') {
            await playRawPCM(data!.audioContent, data!.sampleRate ?? 24000);
          } else {
            await playCompressedAudio(data!.audioContent, 1.0);
          }
        }
      };

      if (wait) {
        try {
          await playAudio();
        } finally {
          if (sessionToVerify && ttsState.activeSessionId === sessionToVerify && !isSequenceChunk) {
            stopTTS();
            if (!options?.skipCompletionChime) {
              try {
                playAiResultNotification();
              } catch (_) {}
            }
          }
        }
      } else {
        if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) return;
        playAudio()
          .then(() => {
            if (sessionToVerify && ttsState.activeSessionId === sessionToVerify && !isSequenceChunk) {
              stopTTS();
              if (!options?.skipCompletionChime) {
                try {
                  playAiResultNotification();
                } catch (_) {}
              }
            }
          })
          .catch((err) => {
            console.warn('playTTS silent failure:', err);
            if (sessionToVerify && ttsState.activeSessionId === sessionToVerify && !isSequenceChunk) {
              stopTTS();
            }
          });
      }
      return;
    }
    throw new Error('No audio content returned');
  } catch (error) {
    if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) return;

    nativeFallbackUntil = Date.now() + 60000;
    nativeSpeechSessionId = mySessionId;
    console.warn('[TTS] Server audio failed; continuing with one browser voice for this session.', error);
    return playNativeBrowserSpeech(cleanText, wait, sessionToVerify, isSequenceChunk, targetVoice, 1.0, options);
  }
};

/**
 * Splits text into optimal, pure sentence chunks for sequential TTS streaming and real-time sentence highlighting.
 */
export function splitSpeechIntoSentences(text: string): string[] {
  const cleanText = prepareNaturalSpeechText(text);
  if (!cleanText) return [];

  // Match sentences ending with ., !, ?, 。, ！, ？, or newline, including trailing quotes
  const sentenceRegex = /[^.!?。！？\n]+(?:[.!?。！？\n]+["'”’]?|\s*$)/g;
  const rawSentences = cleanText.match(sentenceRegex) || [cleanText];
  const sentences: string[] = [];

  for (const raw of rawSentences) {
    const s = raw.trim();
    if (!s) continue;
    if (!/[가-힣a-zA-Z0-9]/.test(s)) continue;

    // If an individual sentence is extraordinarily long (>140 chars), split by clauses for natural pacing
    if (s.length > 140) {
      const clauseRegex = /[^,，;；\n]+(?:[,，;；\n]+|\s*$)/g;
      const clauses = s.match(clauseRegex) || [s];
      let cur = '';
      for (const clause of clauses) {
        const c = clause.trim();
        if (!c) continue;
        if (cur && cur.length + c.length > 120) {
          sentences.push(cur);
          cur = c;
        } else {
          cur = cur ? `${cur} ${c}` : c;
        }
      }

      if (cur) sentences.push(cur);
    } else {
      sentences.push(s);
    }
  }

  return sentences.length > 0 ? sentences : [cleanText];
}

export function splitSpeechIntoChunks(text: string, maxChunkLength = 240): string[] {
  const sentences = splitSpeechIntoSentences(text);
  if (sentences.length <= 1) return sentences;

  const targetMax = Math.max(180, maxChunkLength);
  const groupedChunks: string[] = [];
  let currentGroup = '';

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if (!currentGroup) {
      currentGroup = trimmed;
    } else if (currentGroup.length + 1 + trimmed.length <= targetMax) {
      currentGroup = `${currentGroup} ${trimmed}`;
    } else {
      groupedChunks.push(currentGroup);
      currentGroup = trimmed;
    }
  }
  if (currentGroup) {
    groupedChunks.push(currentGroup);
  }
  return groupedChunks.length > 0 ? groupedChunks : sentences;
}

/**
 * Proactively prefetch the first 2 chunks of a speech text (Zero-Lag Ultra Audio Streaming)
 */
export function prefetchTTSChunks(
  text: string,
  voice?: string,
  maxChunkLength = 240,
  emotion?: string,
): void {
  try {
    const chunks = splitSpeechIntoChunks(text, maxChunkLength);
    for (let k = 0; k < Math.min(2, chunks.length); k++) {
      prefetchTTS(chunks[k], voice, emotion).catch(() => {});
    }
  } catch (_) {}
}

// 🎯 낭독 청취 위치 기억: 알림 등으로 끊기거나 일시정지 시 처음부터 다시 듣지 않고 해당 청크부터 이어듣기 지원
interface TTSChunkProgress {
  fullText: string;
  chunkIndex: number;
  totalChunks: number;
  updatedAt: number;
}
let lastTTSProgress: TTSChunkProgress | null = null;

export function resetTTSProgress(text?: string): void {
  if (!text || lastTTSProgress?.fullText === text) {
    lastTTSProgress = null;
  }
}

/**
 * Splits any long reading into optimal multi-sentence chunks and streams them with active prefetching.
 * - Grouping 2~3 sentences per chunk reduces network round-trips by 70%, preventing mobile OS background timer throttling when the screen is off.
 * - While the screen is visible, proportionally advances `currentSentence` across the sentences inside the chunk so real-time sentence highlighting stays smooth and accurate without causing UI lag.
 */
export const playTTSInChunks = async (
  text: string,
  voice?: string,
  maxChunkLength = 240,
  emotion?: string,
  _speed?: number,
  options?: TTSPlaybackOptions,
): Promise<void> => {
  const cleanText = prepareNaturalSpeechText(text);
  if (!cleanText) return;

  // If already speaking or loading this exact sequence:
  if (
    !options?.isAutoPlay &&
    !options?.isAutoPlayback &&
    (ttsState.isSpeaking || ttsState.isLoading) &&
    (ttsState.activeFullText === cleanText || ttsState.activeText === cleanText)
  ) {
    if (options?.isUserToggleClick) {
      stopTTS();
    }
    return;
  }

  // If previous different audio is still playing or loading, clean it up before starting this new sequence
  if (ttsState.isSpeaking || ttsState.isLoading) {
    stopTTS();
  }

  const effectiveMaxLen = Math.max(220, maxChunkLength);
  const chunks = splitSpeechIntoChunks(cleanText, effectiveMaxLen);
  if (chunks.length === 0) return;

  // 알림이나 일시정지로 인해 중간에 끊겼던 경우, 처음부터 다시 듣지 않고 중단 지점부터 이어듣기
  let startChunkIndex = 0;
  if (
    lastTTSProgress &&
    lastTTSProgress.fullText === cleanText &&
    lastTTSProgress.chunkIndex > 0 &&
    lastTTSProgress.chunkIndex < chunks.length &&
    Date.now() - lastTTSProgress.updatedAt < 15 * 60 * 1000
  ) {
    startChunkIndex = lastTTSProgress.chunkIndex;
    console.log(`[TTS] Resuming playback from interrupted chunk ${startChunkIndex + 1}/${chunks.length}`);
  }

  // Start sequence session
  stopTTS();
  const sequenceSessionId = `seq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const firstSubSentences = splitSpeechIntoSentences(chunks[startChunkIndex] || '');
  const initialSentence = firstSubSentences[0] || chunks[startChunkIndex] || cleanText.slice(0, 50);

  setTTSSessionActive(initialSentence);
  updateTTSState({
    isLoading: true,
    isSpeaking: true,
    activeText: chunks[startChunkIndex] || cleanText.slice(0, 50),
    currentSentence: initialSentence,
    activeSentence: initialSentence,
    activeSentenceIndex: startChunkIndex,
    totalSentences: chunks.length,
    activeFullText: cleanText,
    activeSessionId: sequenceSessionId,
  });
  isPlayingSequence = true;
  acquireScreenWakeLock().catch(() => {});

  try {
    // Prime the audio context and element during user click
    try {
      const ctx = getSharedAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      primeTTSAudioElement();
    } catch (_) {}

    // Pre-fetch the upcoming 5 chunks ahead of playback so background playback never waits on network (Ultra Max Audio)
    for (let ahead = 1; ahead <= 1; ahead++) {
      if (startChunkIndex + ahead < chunks.length) {
        prefetchTTS(chunks[startChunkIndex + ahead], voice, emotion).catch(() => {});
      }
    }

    for (let i = startChunkIndex; i < chunks.length; i++) {
      if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) {
        break;
      }

      const currentChunkText = chunks[i];
      const subSentences = splitSpeechIntoSentences(currentChunkText);
      const firstSub = subSentences[0] || currentChunkText;

      // 현재 진행 중인 청크 위치 저장
      lastTTSProgress = {
        fullText: cleanText,
        chunkIndex: i,
        totalChunks: chunks.length,
        updatedAt: Date.now(),
      };

      setTTSSessionActive(firstSub);

      // Single consolidated state update per chunk start (avoids duplicate back-to-back React renders)
      updateTTSState({
        isLoading: false,
        isSpeaking: true,
        activeText: currentChunkText,
        currentSentence: firstSub,
        activeSentence: firstSub,
        activeSentenceIndex: i,
        totalSentences: chunks.length,
        activeFullText: cleanText,
        activeSessionId: sequenceSessionId,
      });

      // Proactively pre-fetch next upcoming chunk in advance (Zero-delay continuous stream)
      for (let ahead = 1; ahead <= 1; ahead++) {
        if (i + ahead < chunks.length) {
          prefetchTTS(chunks[i + ahead], voice, emotion).catch(() => {});
        }
      }

      // If this chunk contains multiple sentences and the screen is visible,
      // schedule lightweight sentence highlight transitions proportional to character count (~155ms/char Korean TTS pace)
      const subTimers: ReturnType<typeof setTimeout>[] = [];
      if (subSentences.length > 1) {
        let cumulativeChars = 0;
        for (let sIdx = 1; sIdx < subSentences.length; sIdx++) {
          cumulativeChars += subSentences[sIdx - 1].length;
          const delayMs = Math.max(900, Math.round(cumulativeChars * 155));
          const targetSub = subSentences[sIdx];
          const timer = setTimeout(() => {
            if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) return;
            if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
            updateTTSState({
              currentSentence: targetSub,
              activeSentence: targetSub,
            });
          }, delayMs);
          subTimers.push(timer);
        }
      }

      const isLastChunk = i === chunks.length - 1;
      try {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
        await playTTS(
          currentChunkText,
          voice,
          true,
          emotion,
          sequenceSessionId,
          true,
          cleanText,
        );
            break;
          } catch (error) {
            if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) break;
            if (attempt === 1) throw error;
          }
        }
      } catch (chunkErr) {
        console.warn(`[TTS] Sequence chunk ${i + 1}/${chunks.length} playback failed:`, chunkErr);
        throw chunkErr;
      } finally {
        subTimers.forEach(clearTimeout);
      }

      if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) {
        break;
      }

      // 완독 성공 시 저장된 위치 초기화 및 완료 종소리 재생
      if (isLastChunk) {
        lastTTSProgress = null;
        if (!options?.skipCompletionChime) {
          try {
            playAiResultNotification();
          } catch (_) {}
        }
      }
    }
  } catch (err) {
    console.error("[TTS] playTTSInChunks sequence error:", err);
    throw err;
  } finally {
    if (ttsState.activeSessionId === sequenceSessionId) {
      isPlayingSequence = false;
      stopTTS();
    }
  }
};

export const playConversation = async (
  messages: { role: string; content: string; id?: string }[],
  aiVoice: string = 'Aoede',
  userVoice: string = 'Aoede',
  onMessageStart?: (index: number, msg: { role: string; content: string; id?: string }) => void,
  options?: TTSPlaybackOptions,
) => {
  // If we are already speaking or loading, click again to stop
  if (ttsState.isSpeaking || ttsState.isLoading) {
    stopTTS();
    return;
  }

  stopTTS();
  const mySessionId = Math.random().toString();
  updateTTSState({ isLoading: true, isSpeaking: false, activeText: '__CONVERSATION__', activeSessionId: mySessionId });
  isPlayingSequence = true;
  acquireScreenWakeLock().catch(() => {});

  // 🌟 모든 대화 참여자의 음성은 밝고 부드러운 여성 보이스(Aoede / SunHi)로 일원화
  const resolvedAiVoice = 'Aoede';
  const resolvedUserVoice = 'Aoede';

  try {
    for (let i = 0; i < messages.length; i++) {
      if (ttsState.activeSessionId !== mySessionId) break;
      const m = messages[i];
      const isUser = m.role === 'user';
      const voice = isUser ? resolvedUserVoice : resolvedAiVoice;

      if (onMessageStart) {
        onMessageStart(i, m);
      }

      const isLastMsg = i === messages.length - 1;
      await playTTS(m.content, voice, true, undefined, mySessionId, !isLastMsg, undefined, undefined, undefined, options);
      if (ttsState.activeSessionId !== mySessionId) break;

      // Natural pause between speaker turns
      if (i < messages.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
  } catch (err) {
    console.error("[TTS] playConversation error:", err);
  } finally {
    if (ttsState.activeSessionId === mySessionId) {
      isPlayingSequence = false;
      stopTTS();
    }
  }
};

export interface QAndAMessageItem {
  text: string;
  id?: string;
}

/**
 * 🎙️ 질문 ➔ 루시 답변 자동 연속 음성 재생 (모두 부드럽고 맑은 여성 음성)
 * - 질문자의 질문을 차분한 여성 보이스(Kore / SunHi)로 먼저 낭독
 * - 자연스러운 호흡 텀(360ms) 후
 * - 루시의 답변을 따뜻하고 다정한 여성 보이스(Kore / SunHi)로 청크 단위 연속 낭독
 */
export const playQAndATTS = async (
  question: QAndAMessageItem,
  answer: QAndAMessageItem,
  userVoice: string = 'Aoede',
  aiVoice: string = 'Aoede',
  onSpeakerChange?: (speaker: 'user' | 'assistant', msg: QAndAMessageItem) => void,
): Promise<void> => {
  if (ttsState.isSpeaking || ttsState.isLoading) {
    stopTTS();
    return;
  }

  const cleanQuestion = prepareNaturalSpeechText(question.text || '');
  const cleanAnswer = prepareNaturalSpeechText(answer.text || '');
  if (!cleanAnswer && !cleanQuestion) return;

  stopTTS();
  const sequenceSessionId = `qa_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  updateTTSState({
    isLoading: true,
    isSpeaking: true,
    activeText: cleanQuestion || cleanAnswer.slice(0, 50),
    activeFullText: cleanQuestion ? `${cleanQuestion}\n\n${cleanAnswer}` : cleanAnswer,
    activeSessionId: sequenceSessionId,
  });
  isPlayingSequence = true;
  acquireScreenWakeLock().catch(() => {});

  try {
    // 1. 질문자의 음성 (여성 보이스) 재생
    if (cleanQuestion) {
      if (onSpeakerChange) {
        onSpeakerChange('user', { text: cleanQuestion, id: question.id });
      }

      // 질문 텍스트 문장 단위 분할
      const qChunks = splitSpeechIntoSentences(cleanQuestion);

      for (let i = 0; i < qChunks.length; i++) {
        if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) break;
        updateTTSState({
          isLoading: false,
          isSpeaking: true,
          activeText: qChunks[i],
          activeSentence: qChunks[i],
          activeSentenceIndex: i,
          totalSentences: qChunks.length,
          activeFullText: cleanQuestion,
          activeSessionId: sequenceSessionId,
        });
        await playTTS(qChunks[i], userVoice, true, undefined, sequenceSessionId, true, cleanQuestion);
        if (i < qChunks.length - 1) {
          await new Promise((r) => setTimeout(r, 60));
        }
      }

      // 질문과 답변 사이 자연스러운 턴 전환 침묵 (360ms)
      if (ttsState.activeSessionId === sequenceSessionId && isPlayingSequence && cleanAnswer) {
        await new Promise((r) => setTimeout(r, 360));
      }
    }

    // 2. 루시의 답변 음성 (여성 보이스) 청크 연속 재생
    if (cleanAnswer && ttsState.activeSessionId === sequenceSessionId && isPlayingSequence) {
      if (onSpeakerChange) {
        onSpeakerChange('assistant', { text: cleanAnswer, id: answer.id });
      }

      const aChunks = splitSpeechIntoSentences(cleanAnswer);

      // Pre-warm audio and prefetch
      try {
        const ctx = getSharedAudioContext();
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        primeTTSAudioElement();
      } catch (_) {}

      if (aChunks.length > 1) prefetchTTS(aChunks[1], aiVoice, '다정').catch(() => {});
      if (aChunks.length > 2) prefetchTTS(aChunks[2], aiVoice, '다정').catch(() => {});

      for (let i = 0; i < aChunks.length; i++) {
        if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) break;
        updateTTSState({
          isLoading: false,
          isSpeaking: true,
          activeText: aChunks[i],
          activeSentence: aChunks[i],
          activeSentenceIndex: i,
          totalSentences: aChunks.length,
          activeFullText: cleanAnswer,
          activeSessionId: sequenceSessionId,
        });
        if (i + 1 < aChunks.length) prefetchTTS(aChunks[i + 1], aiVoice, '다정').catch(() => {});
        if (i + 2 < aChunks.length) prefetchTTS(aChunks[i + 2], aiVoice, '다정').catch(() => {});

        const isLastChunk = i === aChunks.length - 1;
        try {
          await playTTS(aChunks[i], aiVoice, true, '다정', sequenceSessionId, !isLastChunk, cleanAnswer, undefined, undefined, { skipCompletionChime: true });
        } catch (chunkErr) {
          console.warn(`[TTS] QA chunk ${i + 1}/${aChunks.length} error, maintaining voice consistency:`, chunkErr);
        }

        if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) break;
        if (!isLastChunk) {
          await new Promise((r) => setTimeout(r, 60));
        }
      }
    }
  } catch (err) {
    console.error("[TTS] playQAndATTS error:", err);
  } finally {
    if (ttsState.activeSessionId === sequenceSessionId) {
      isPlayingSequence = false;
      stopTTS();
    }
  }
};

export const useTTSActive = () => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    return subscribeTTS((state) => {
      setActive(state.isSpeaking || state.isLoading);
    });
  }, []);
  return active;
};

export const useTTSState = () => {
  const [state, setState] = useState<TTSState>(ttsState);
  useEffect(() => {
    return subscribeTTS((s) => {
      setState(s);
    });
  }, []);
  return state;
};

