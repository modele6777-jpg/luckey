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
} from '../lib/audio';
import { setTTSSessionActive, clearTTSSession, initTTSSessionHandlers, pauseTTSSession, resumeTTSSession } from '../lib/ttsMediaSession';
import { acquireScreenWakeLock, releaseScreenWakeLock } from '../lib/wakeLock';
import { prepareNaturalSpeechText } from './speechText';
export { prepareNaturalSpeechText };
import { isIOSDevice } from '../lib/perfMode';

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
  voiceNameOrType: string = 'Kore',
  speed?: number,
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve();
  }

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
    const getVoiceScore = (voiceItem: SpeechSynthesisVoice) => {
      const name = voiceItem.name.toLowerCase();
      const isMaleVoiceName =
        name.includes('injoon') ||
        name.includes('minsu') ||
        name.includes('david') ||
        name.includes('guy') ||
        name.includes('mark') ||
        name.includes('george') ||
        name.includes('male') ||
        name.includes('남성');

      const isFemaleVoiceName =
        name.includes('sunhi') ||
        name.includes('heami') ||
        name.includes('yuna') ||
        name.includes('narae') ||
        name.includes('seoyeon') ||
        name.includes('sohee') ||
        name.includes('jiwon') ||
        name.includes('siri') ||
        name.includes('female') ||
        name.includes('여성') ||
        name.includes('kore') ||
        name.includes('aoede') ||
        name.includes('clara') ||
        name.includes('aria') ||
        name.includes('zira');

      // 🌟 모든 TTS 낭독은 무조건 여성 음성만 나오도록 철저 제한 (남성 음성 원천 차단)
      if (isMaleVoiceName) return -10000;
      if (isFemaleVoiceName) {
        if (name.includes('sunhi') || name.includes('heami') || name.includes('yuna') || name.includes('seoyeon') || name.includes('siri') || name.includes('aria')) return 120;
        return 100;
      }
      return 10;
    };

    const sorted = langVoices.sort((a, b) => getVoiceScore(b) - getVoiceScore(a));
    if (sorted.length > 0 && getVoiceScore(sorted[0]) > -500) {
      utterance.voice = sorted[0];
      const chosenName = sorted[0].name.toLowerCase();
      const isKnownFemale =
        chosenName.includes('sunhi') ||
        chosenName.includes('heami') ||
        chosenName.includes('yuna') ||
        chosenName.includes('narae') ||
        chosenName.includes('seoyeon') ||
        chosenName.includes('siri') ||
        chosenName.includes('female') ||
        chosenName.includes('여성') ||
        chosenName.includes('aria');
      // 🌟 남성 음성 방지: 확실한 여성 음색이 아니거나 시스템 기본 음성(Google 한국의 등)일 경우 피치를 1.28로 조정하여 명확한 여성 톤 보장
      utterance.pitch = isKnownFemale ? 1.05 : 1.28;
    } else {
      utterance.pitch = 1.28;
    }
  } else {
    utterance.pitch = 1.28;
  }

  updateTTSState({
    isLoading: false,
    isSpeaking: true,
    activeText: cleanText,
    currentSentence: cleanText,
    activeSentence: cleanText,
    activeSentenceIndex: 0,
    totalSentences: 1,
  });
  setTTSSessionActive(cleanText);

  // Chrome/iOS keepalive timer
  let keepAliveInterval: any = null;
  const startKeepAlive = () => {
    let elapsed = 0;
    keepAliveInterval = setInterval(() => {
      elapsed += 5000;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else if (elapsed >= 10000 && window.speechSynthesis.speaking) {
          // Chrome 15s pause bug workaround: only cycle pause/resume after prolonged speaking
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 5000);
  };
  const clearKeepAlive = () => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
  };

  return new Promise<void>((resolve) => {
    let isSettled = false;
    const finish = () => {
      if (isSettled) return;
      isSettled = true;
      activeUtterances.delete(utterance);
      clearKeepAlive();
      if (sessionToVerify && ttsState.activeSessionId === sessionToVerify && !isSequenceChunk) {
        stopTTS();
      }
      resolve();
    };

    utterance.onend = finish;
    utterance.onerror = finish;

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
    duckAmbientAudio(true, 0.3);
  } else if (prevActive && !nextActive) {
    duckAmbientAudio(false, 0.5);
  }

  listeners.forEach((l) => l(ttsState));
};

export interface TTSAudioData {
  audioContent: string;
  encoding: 'pcm' | 'mp3';
  sampleRate: number;
}

const ttsCache = new Map<string, Promise<TTSAudioData | null>>();

export function getTTSCacheKey(text: string, _voice?: string, _emotion?: string, _rate?: string, _speed?: number): string {
  const clean = normalizeTextForSpeech(text);
  // 🌟 모든 TTS 재생 및 캐시는 유니버스 인사이트 명언의 단일 여성 표준 음성(Gemini Kore Female v5) 1.0 배속 표준 속도로 영구 고정
  return `universe_kore_female_v5_${clean}`;
}

export function prefetchTTS(text: string, voice?: string, emotion?: string, _rate?: string, _speed?: number): Promise<TTSAudioData | null> {
  const cleanText = normalizeTextForSpeech(text);
  if (!cleanText) return Promise.resolve(null);

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
        body: JSON.stringify({ text: cleanText, voice, emotion: activeEmotion, rate: '+0%', speed: 1.0 }),
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
          encoding: data.encoding === 'pcm' ? 'pcm' : 'mp3',
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
  voice: string = 'Kore',
  wait: boolean = false,
  emotion?: string,
  sequenceSessionId?: string,
  isSequenceChunk: boolean = false,
  fullTextReference?: string,
  _rate?: string,
  _speed?: number,
): Promise<void> => {
  ensureTTSLifecycle();
  const cleanText = normalizeTextForSpeech(text);
  if (!cleanText) return;

  // 🌟 모든 TTS 재생은 엄격하게 여성 음성만 사용
  const targetVoice = 'Kore';

  // If we are calling playTTS standalone (without sequence) and something is already loading/speaking for this exact text, second click stops it
  if (!sequenceSessionId && (ttsState.isSpeaking || ttsState.isLoading) && (ttsState.activeText === cleanText || ttsState.activeFullText === cleanText)) {
    stopTTS();
    return;
  }

  // Determine active session ID
  let mySessionId = sequenceSessionId;
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
      currentSentence: cleanText,
      activeSentence: cleanText,
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
        currentSentence: cleanText,
        activeSentence: cleanText,
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

      if (!response.ok) throw new Error('Failed to generate TTS');
      const rawData = await response.json();
      if (rawData?.audioContent) {
        data = {
          audioContent: rawData.audioContent,
          encoding: rawData.encoding === 'pcm' ? 'pcm' : 'mp3',
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
    updateTTSState({
      isLoading: false,
      isSpeaking: true,
      activeText: cleanText,
      currentSentence: cleanText,
      activeSentence: cleanText,
      ...(fullTextReference ? { activeFullText: fullTextReference } : {}),
    });
    setTTSSessionActive(cleanText);

    if (data?.audioContent) {
      const encoding = data.encoding === 'pcm' ? 'pcm' : 'mp3';
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
          }
        }
      } else {
        if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) return;
        playAudio()
          .then(() => {
            if (sessionToVerify && ttsState.activeSessionId === sessionToVerify && !isSequenceChunk) {
              stopTTS();
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

    if (sequenceSessionId || isSequenceChunk) {
      // 🌟 단일 여성 표준 음성 일관성 유지 원칙:
      // 시퀀스 낭독 도중 목소리가 임의로 바뀌는 현상을 막기 위해 브라우저 음성으로 교차 전환하지 않고,
      // 동일 음성 엔드포인트(/api/ai/tts)로 최대 3회 재시도합니다.
      for (let retryCount = 1; retryCount <= 3; retryCount++) {
        if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) return;
        try {
          await new Promise((r) => setTimeout(r, 200 * retryCount));
          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(() => retryController.abort(), 6000);
          const retryRes = await fetch('/api/ai/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: cleanText, voice: targetVoice, emotion: activeEmotion, rate: '+0%', speed: 1.0 }),
            signal: retryController.signal,
          });
          clearTimeout(retryTimeoutId);
          if (retryRes.ok) {
            const retryData = await retryRes.json();
            if (retryData?.audioContent) {
              if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) return;
              updateTTSState({
                isLoading: false,
                isSpeaking: true,
                activeText: cleanText,
                ...(fullTextReference ? { activeFullText: fullTextReference } : {}),
              });
              setTTSSessionActive(cleanText);
              const encoding = retryData.encoding === 'pcm' ? 'pcm' : 'mp3';
              await playTTSAudio(retryData.audioContent, encoding, retryData.sampleRate ?? 24000, activeEmotion || cleanText, isSequenceChunk, 1.0);
              return;
            }
          }
        } catch (retryErr) {
          console.warn(`[TTS] Sequence chunk same-voice retry ${retryCount} error:`, retryErr);
        }
      }
      // 동일 음성 3회 재시도 실패 시, 이질적인 브라우저 음색으로 교차 전환(Voice Hopping)하지 않고 조용히 청크를 스킵하여 음색 통일성을 엄격히 보호합니다.
      console.warn('[TTS] Sequence chunk failed after 3 same-voice retries, skipping chunk without switching voices');
      return;
    }

    console.warn('[TTS] Single-play API generation failed, falling back to Native Browser Speech...', error);
    return playNativeBrowserSpeech(cleanText, wait, sessionToVerify, isSequenceChunk, targetVoice, 1.0);
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

export function splitSpeechIntoChunks(text: string, _maxChunkLength = 110): string[] {
  return splitSpeechIntoSentences(text);
}

/**
 * Proactively prefetch the first few chunks of a speech text
 */
export function prefetchTTSChunks(
  text: string,
  voice?: string,
  maxChunkLength = 110,
  emotion?: string,
): void {
  try {
    const chunks = splitSpeechIntoChunks(text, maxChunkLength);
    if (chunks.length > 0) {
      prefetchTTS(chunks[0], voice, emotion).catch(() => {});
      if (chunks.length > 1) {
        prefetchTTS(chunks[1], voice, emotion).catch(() => {});
      }
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
 * Splits any long reading (e.g. Tarot 78-cards reading, horoscope, meditation)
 * into optimal, sentence-safe chunks and streams them with active prefetching.
 * This guarantees zero cutoffs, zero network gaps, and rock-solid mobile audio continuity.
 */
export const playTTSInChunks = async (
  text: string,
  voice?: string,
  maxChunkLength = 110,
  emotion?: string,
  _speed?: number,
): Promise<void> => {
  const cleanText = prepareNaturalSpeechText(text);
  if (!cleanText) return;

  // If already speaking or loading this exact sequence, click again toggles/stops playback
  if (
    (ttsState.isSpeaking || ttsState.isLoading) &&
    (ttsState.activeFullText === cleanText || ttsState.activeText === cleanText)
  ) {
    stopTTS();
    return;
  }

  // If previous different audio is still playing or loading, clean it up before starting this new sequence
  if (ttsState.isSpeaking || ttsState.isLoading) {
    stopTTS();
  }

  const chunks = splitSpeechIntoChunks(cleanText, maxChunkLength);
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
  updateTTSState({
    isLoading: true,
    isSpeaking: true,
    activeText: chunks[startChunkIndex] || cleanText.slice(0, 50),
    currentSentence: chunks[startChunkIndex] || null,
    activeSentence: chunks[startChunkIndex] || cleanText.slice(0, 50),
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

    // Pre-fetch the upcoming 2 chunks ahead of playback (locked to 1.0x)
    if (startChunkIndex + 1 < chunks.length) {
      prefetchTTS(chunks[startChunkIndex + 1], voice, emotion).catch(() => {});
    }
    if (startChunkIndex + 2 < chunks.length) {
      prefetchTTS(chunks[startChunkIndex + 2], voice, emotion).catch(() => {});
    }

    for (let i = startChunkIndex; i < chunks.length; i++) {
      if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) {
        break;
      }

      // Update active sentence and index for real-time highlighting
      updateTTSState({
        isLoading: false,
        isSpeaking: true,
        activeText: chunks[i],
        activeSentence: chunks[i],
        activeSentenceIndex: i,
        totalSentences: chunks.length,
        activeFullText: cleanText,
        activeSessionId: sequenceSessionId,
      });

      // 현재 진행 중인 청크 위치 저장 (중간에 알림으로 끊기더라도 다음 재생 시 여기서부터 이어듣기)
      lastTTSProgress = {
        fullText: cleanText,
        chunkIndex: i,
        totalChunks: chunks.length,
        updatedAt: Date.now(),
      };

      // 🌟 현재 낭독 중인 문장 상태 실시간 동기화 (형광펜 하이라이트 트리거)
      updateTTSState({
        isSpeaking: true,
        isLoading: false,
        activeText: chunks[i],
        currentSentence: chunks[i],
        activeFullText: cleanText,
        activeSessionId: sequenceSessionId,
      });

      // Proactively pre-fetch next upcoming 2 chunks in advance (locked to 1.0x)
      if (i + 1 < chunks.length) {
        prefetchTTS(chunks[i + 1], voice, emotion).catch(() => {});
      }
      if (i + 2 < chunks.length) {
        prefetchTTS(chunks[i + 2], voice, emotion).catch(() => {});
      }

      const isLastChunk = i === chunks.length - 1;
      try {
        await playTTS(
          chunks[i],
          voice,
          true,
          emotion,
          sequenceSessionId,
          true, // keep sequence session context intact across all chunks; cleanup is handled in sequence finally block
          cleanText,    // preserve activeFullText for UI synchronization
        );
      } catch (chunkErr) {
        console.warn(`[TTS] Sequence chunk ${i + 1}/${chunks.length} error, maintaining voice consistency:`, chunkErr);
      }

      if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) {
        break;
      }

      // 완독 성공 시 저장된 위치 초기화 (다음 번엔 처음부터 들을 수 있도록)
      if (isLastChunk) {
        lastTTSProgress = null;
      }

      // 🌟 해당 문장 낭독 완료: 다음 문장 넘어가기 전 이전 형광펜 하이라이트 즉각 해제
      if (!isLastChunk) {
        updateTTSState({ currentSentence: null });
        // Micro-pause between chunks (60ms) for natural human speech rhythm
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
    }
  } catch (err) {
    console.error("[TTS] playTTSInChunks sequence error:", err);
  } finally {
    if (ttsState.activeSessionId === sequenceSessionId) {
      isPlayingSequence = false;
      stopTTS();
    }
  }
};

export const playConversation = async (
  messages: { role: string; content: string; id?: string }[],
  aiVoice: string = 'Kore',
  userVoice: string = 'Kore',
  onMessageStart?: (index: number, msg: { role: string; content: string; id?: string }) => void,
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

  // 🌟 모든 대화 참여자의 음성은 여성 보이스(Kore / SunHi)로 일원화
  const resolvedAiVoice = 'Kore';
  const resolvedUserVoice = 'Kore';

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
      await playTTS(m.content, voice, true, undefined, mySessionId, !isLastMsg);
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
  userVoice: string = 'Kore',
  aiVoice: string = 'Kore',
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
          await playTTS(aChunks[i], aiVoice, true, '다정', sequenceSessionId, !isLastChunk, cleanAnswer);
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

