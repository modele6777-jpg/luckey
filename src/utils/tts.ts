import { useState, useEffect } from 'react';
import {
  getSharedAudioContext,
  unlockAudioPlayback,
  playTTSAudio,
  getTTSPlaybackProgress,
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
import { trackSpeechHighlight } from '../lib/speechHighlightTiming';
import { isIOSDevice } from '../lib/perfMode';

export interface TTSPlaybackOptions {
  skipCompletionChime?: boolean;
  isAutoPlay?: boolean;
  isAutoPlayback?: boolean;
  isUserToggleClick?: boolean;
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
  const voice = _voice === 'Charon' ? 'Charon' : 'Aoede';
  return `lucy_natural_v7_${voice}_${clean}`;
}

class TTSAudioRequestError extends Error {
  constructor(message: string, public status = 0) { super(message); }
}
let ttsRequestQueue: Promise<unknown> = Promise.resolve();
let ttsRateLimitUntil = 0;
function requestAIAudio(text: string, emotion?: string, voice = 'Aoede'): Promise<TTSAudioData> {
  const key = getTTSCacheKey(text, voice);
  const existing = ttsCache.get(key);
  if (existing) return existing as Promise<TTSAudioData>;
  const pending = ttsRequestQueue.catch(() => {}).then(async () => {
    if (Date.now() < ttsRateLimitUntil) throw new TTSAudioRequestError(`AI 음성 요청이 일시적으로 제한됐습니다. 약 ${Math.ceil((ttsRateLimitUntil - Date.now()) / 1000)}초 뒤 다시 눌러 주세요.`, 429);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 65000);
    try {
      const response = await fetch('/api/ai/tts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: normalizeTextForSpeech(text), voice, emotion }), signal: controller.signal,
      });
      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        if (response.status === 429) {
          if (failure?.code === 'MEDIA_QUOTA_EXHAUSTED') {
            throw new TTSAudioRequestError('AI 음성 제공자의 사용 한도가 소진되었습니다. API 결제·한도 설정 확인이 필요합니다.', 429);
          }
          const header = response.headers.get('Retry-After');
          const supplied = header ? (/^\d+(?:\.\d+)?$/.test(header) ? Number(header) : (Date.parse(header) - Date.now()) / 1000) : Number(failure?.retryAfterSeconds);
          const seconds = Math.max(1, Math.min(86400, Math.ceil(Number.isFinite(supplied) && supplied > 0 ? supplied : 15)));
          ttsRateLimitUntil = Date.now() + seconds * 1000;
          throw new TTSAudioRequestError(`AI 음성 요청이 일시적으로 제한됐습니다. 약 ${seconds}초 뒤 다시 눌러 주세요.`, 429);
        }
        throw new TTSAudioRequestError('AI 음성을 생성하지 못했습니다. 잠시 후 다시 눌러 주세요.', response.status);
      }
      const data = await response.json();
      if (!data?.audioContent) throw new TTSAudioRequestError('AI 음성 응답이 비어 있습니다. 다시 눌러 주세요.', 502);
      return { audioContent: data.audioContent, encoding: data.encoding === 'pcm' ? 'pcm' as const : data.encoding === 'wav' ? 'wav' as const : 'mp3' as const, sampleRate: data.sampleRate ?? 24000 };
    } finally { clearTimeout(timer); }
  });
  ttsRequestQueue = pending.catch(() => {});
  ttsCache.set(key, pending);
  pending.catch(() => { if (ttsCache.get(key) === pending) ttsCache.delete(key); });
  // Bound retained base64 audio in long-lived mobile sessions.
  if (ttsCache.size > 24) ttsCache.delete(ttsCache.keys().next().value!);
  return pending;
}
export function prefetchTTS(text: string, _voice?: string, emotion?: string, _rate?: string, _speed?: number): Promise<TTSAudioData | null> {
  // Generating voices for unopened/idle content consumed the small TTS quota.
  // Playback requests own generation; no speculative provider requests.
  return ttsCache.get(getTTSCacheKey(text, _voice)) || Promise.resolve(null);
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
  // Legacy book, report and insight readers call this entrypoint directly.
  if (!sequenceSessionId && cleanText.length > 260) {
    try {
      return await playTTSInChunks(cleanText, voice, 240, emotion, _speed, options);
    } catch (error) {
      if (wait) throw error;
      window.dispatchEvent(new CustomEvent('prism:tts-error', { detail: { message: error instanceof Error ? error.message : 'AI 음성을 재생하지 못했습니다. 다시 눌러 주세요.' } }));
      return;
    }
  }

  // Conversation readers already own their session; split without creating or
  // stopping that session, and only let the final part finish its parent turn.
  if (sequenceSessionId && cleanText.length > 260) {
    const parts = splitSpeechIntoChunks(cleanText, 240);
    for (let index = 0; index < parts.length; index++) {
      if (ttsState.activeSessionId && ttsState.activeSessionId !== sequenceSessionId) return;
      await playTTS(parts[index], voice, true, emotion, sequenceSessionId,
        isSequenceChunk || index < parts.length - 1, fullTextReference || cleanText,
        _rate, _speed, options);
      if (ttsState.activeSessionId !== sequenceSessionId) return;
    }
    return;
  }

  // Lucy uses Aoede; explicit Charon requests read the user's chat messages.
  const targetVoice = voice === 'Charon' ? 'Charon' : 'Aoede';

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
    // A new standalone guide step owns a fresh token. A stale chunk must never
    // take ownership back from a newer manual playback session.
    if (ttsState.activeSessionId !== mySessionId && !isSequenceChunk) stopTTS();
    if (ttsState.activeSessionId && ttsState.activeSessionId !== mySessionId) return;
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

    updateTTSState({ isLoading: true, isSpeaking: false, activeText: cleanText,
      currentSentence: initialSubSentence, activeSentence: initialSubSentence,
      ...(fullTextReference ? { activeFullText: fullTextReference } : {}) });
    let data: TTSAudioData | undefined;
    for (let attempt = 0; attempt < 2; attempt++) {
      if (ttsState.activeSessionId !== sessionToVerify) return;
      try {
        data = await requestAIAudio(cleanText, activeEmotion, targetVoice);
        break;
      } catch (error) {
        if (attempt || (error instanceof TTSAudioRequestError && error.status < 500)) throw error;
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }

    // CRITICAL ABORT CHECK after JSON parse
    if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) {
      console.log("[TTS] Playback aborted as active session changed mid-parse.");
      return;
    }

    // Decoding and network time are not playback time. Publish highlights only
    // when the audio clock reports a live source, for every entrypoint/reader.
    const speakingSentences = splitSpeechIntoSentences(cleanText);
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
          if ((err as any)?.code === 'TTS_INTERRUPTED') throw err;
          console.warn('[TTS] playTTSAudio failed, applying WebAudio direct buffer fallback:', err);
          updateTTSState({ isLoading: false, isSpeaking: true, currentSentence: speakingSentences[0] || cleanText, activeSentence: speakingSentences[0] || cleanText });
          if (encoding === 'pcm') {
            await playRawPCM(data!.audioContent, data!.sampleRate ?? 24000);
          } else {
            await playCompressedAudio(data!.audioContent, 1.0);
          }
        }
      };

      let announcedPlayback = false;
      const stopHighlightTracking = trackSpeechHighlight(
        speakingSentences,
        getTTSPlaybackProgress,
        () => ttsState.activeSessionId === sessionToVerify,
        (sentence) => {
          updateTTSState({ isLoading: false, isSpeaking: true, currentSentence: sentence, activeSentence: sentence });
          setTTSSessionActive(sentence);
          if (!announcedPlayback && typeof window !== 'undefined') {
            announcedPlayback = true;
            window.dispatchEvent(new Event('prism:tts-recovered'));
          }
        },
      );
      try {
        await playAudio();
        if (typeof window !== 'undefined' && ttsState.activeSessionId === sessionToVerify) window.dispatchEvent(new Event('prism:tts-recovered'));
      } finally {
        stopHighlightTracking();
      }
      if (ttsState.activeSessionId === sessionToVerify && !isSequenceChunk) {
        stopTTS();
        if (!options?.skipCompletionChime) {
          try { playAiResultNotification(); } catch (_) {}
        }
      }
      return;
    }
    throw new Error('No audio content returned');
  } catch (error) {
    if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) return;

    if (!isSequenceChunk) stopTTS();
    console.warn('[TTS] AI audio unavailable; device speech is disabled.', error);
    if (!wait && typeof window !== 'undefined') {
      const message = error instanceof TTSAudioRequestError ? error.message : 'AI 음성을 재생하지 못했습니다. 다시 눌러 주세요.';
      window.dispatchEvent(new CustomEvent('prism:tts-error', { detail: { message } }));
      return;
    }
    throw error instanceof TTSAudioRequestError ? error : new Error('AI 음성을 재생하지 못했습니다. 잠시 후 다시 눌러 주세요.');
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
  const targetMax = Math.max(180, Math.min(1000, maxChunkLength));
  const sentences = splitSpeechIntoSentences(text).flatMap(sentence => {
    const parts: string[] = [];
    let remaining = sentence.trim();
    while (remaining.length > targetMax) {
      const space = remaining.lastIndexOf(' ', targetMax);
      const end = space >= targetMax / 2 ? space : targetMax;
      parts.push(remaining.slice(0, end).trim());
      remaining = remaining.slice(end).trim();
    }
    if (remaining) parts.push(remaining);
    return parts;
  });
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (current && current.length + sentence.length + 1 > targetMax) {
      chunks.push(current);
      current = sentence;
    } else current = current ? `${current} ${sentence}` : sentence;
  }
  if (current) chunks.push(current);
  return chunks;
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
 * - Sentence highlights follow actual decoded audio duration and playback position, including pause/resume.
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
    isSpeaking: false,
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
        isLoading: true,
        isSpeaking: false,
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

      const isLastChunk = i === chunks.length - 1;
      try {
        await playTTS(currentChunkText, voice, true, emotion,
          sequenceSessionId, true, cleanText);
      } catch (chunkErr) {
        console.warn(`[TTS] Sequence chunk ${i + 1}/${chunks.length} playback failed:`, chunkErr);
        throw chunkErr;
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
  userVoice: string = 'Charon',
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

  // 🌟 사용자 발화는 남성 보이스 Charon, 루시 답변은 여성 보이스 Aoede 분리 적용
  const resolvedAiVoice = aiVoice || 'Aoede';
  const resolvedUserVoice = userVoice || 'Charon';

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
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('prism:tts-error', { detail: { message: err instanceof Error ? err.message : '연속 듣기가 중단되었습니다. 다시 눌러 주세요.' } }));
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
 * 🎙️ 질문 ➔ 루시 답변 자동 연속 음성 재생
 * - 질문자의 질문을 차분한 남성 보이스(Charon)로 먼저 낭독
 * - 자연스러운 호흡 텀(360ms) 후
 * - 루시의 답변을 따뜻하고 다정한 여성 보이스(Aoede)로 청크 단위 연속 낭독
 */
export const playQAndATTS = async (
  question: QAndAMessageItem,
  answer: QAndAMessageItem,
  userVoice: string = 'Charon',
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
      const qChunks = splitSpeechIntoChunks(cleanQuestion, 240);

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

      const aChunks = splitSpeechIntoChunks(cleanAnswer, 240);

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
          throw chunkErr;
        }

        if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) break;
        if (!isLastChunk) {
          await new Promise((r) => setTimeout(r, 60));
        }
      }
    }
  } catch (err) {
    console.error("[TTS] playQAndATTS error:", err);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('prism:tts-error', { detail: { message: err instanceof Error ? err.message : '음성이 중단되었습니다. 다시 듣기를 눌러 주세요.' } }));
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

