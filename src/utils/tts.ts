import { retrySpeechRequest } from './ttsRetry';
import { useState, useEffect } from 'react';
import {
  getSharedAudioContext,
  unlockAudioPlayback,
  playTTSAudio,
  getTTSPlaybackProgress,
  isTTSAudioPlaying,
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
import { preloadCompletionChime } from '../lib/completionChime';
import { setTTSSessionActive, clearTTSSession, initTTSSessionHandlers, pauseTTSSession, resumeTTSSession } from '../lib/ttsMediaSession';
import { acquireScreenWakeLock, releaseScreenWakeLock } from '../lib/wakeLock';
import { prepareNaturalSpeechText } from './speechText';
export { prepareNaturalSpeechText };
import { trackSpeechHighlight } from '../lib/speechHighlightTiming';
import { isIOSDevice } from '../lib/perfMode';
import { registerAudioDeviceChangeListener } from '../lib/audioDeviceChangeMonitor';
import { shouldPlayTTSCompletionChime, type TTSCompletionPolicyOptions } from '../lib/ttsCompletionPolicy';
import { getResumableTTSChunkIndex, type TTSChunkProgress } from '../lib/ttsChunkResume';
import { parseTTSAudioResponse } from './ttsBinaryResponse';

export interface TTSPlaybackOptions extends TTSCompletionPolicyOptions {
  isAutoPlay?: boolean;
  isAutoPlayback?: boolean;
  isUserToggleClick?: boolean;
  /** @internal Keep one Gemini voice model for every chunk in this playback. */
  preferredModel?: string;
}

export interface TTSState {
  isSpeaking: boolean;
  isLoading: boolean;
  isPaused?: boolean;
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
  isPaused: false,
  activeText: null,
  activeFullText: null,
  activeSessionId: null,
  currentSentence: null,
  activeSentence: null,
  activeSentenceIndex: -1,
  totalSentences: 0,
};

export const getCurrentTTSState = (): Readonly<TTSState> => ttsState;

type TTSListener = (state: TTSState) => void;
const listeners = new Set<TTSListener>();

export const subscribeTTS = (listener: TTSListener) => {
  listeners.add(listener);
  // Emit current state immediately
  try { listener(ttsState); } catch (error) { console.warn("[TTS] State listener failed", error); }
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

  listeners.forEach(listener => { try { listener(ttsState); } catch (error) { console.warn("[TTS] State listener failed", error); } });
};

export interface TTSAudioData {
  audioContent: string;
  encoding: 'pcm' | 'mp3' | 'wav';
  sampleRate: number;
  model?: string;
}

export function resolveTTSPlaybackProfile(text: string, voice?: string, emotion?: string): { voice: 'Aoede' | 'Charon'; emotion?: string } {
  const embeddedEmotion = /\[EMOTION:\s*([^\]]+)\]/i.exec(String(text || ''))?.[1]?.trim();
  return {
    voice: voice === 'Charon' ? 'Charon' : 'Aoede',
    emotion: emotion || embeddedEmotion || undefined,
  };
}

const ttsCache = new Map<string, Promise<TTSAudioData | null>>();
interface SpeechLookahead { text: string; voice?: string; emotion?: string; model?: string }
const playbackLookahead = new Map<string, SpeechLookahead>();
function prepareNextSpeech(session: string): void {
  if (ttsState.activeSessionId !== session || ttsState.isPaused) return;
  const next = playbackLookahead.get(session);
  if (!next) return;
  // Match the next actual request even when a legacy reader supplies a long chunk.
  const clean = normalizeTextForSpeech(next.text);
  const first = clean.length > 260 ? splitSpeechIntoChunks(clean, 240)[0] : clean;
  if (first) void requestAIAudio(first, next.emotion, next.voice === 'Charon' ? 'Charon' : 'Aoede', session, next.model).catch(() => {});
}
function setSpeechLookahead(session: string, next?: SpeechLookahead): void {
  if (next) playbackLookahead.set(session, next);
  else playbackLookahead.delete(session);
}

export function getTTSCacheKey(text: string, _voice?: string, _emotion?: string, _rate?: string, _speed?: number, _preferredModel?: string): string {
  const clean = normalizeTextForSpeech(text);
  const voice = _voice === 'Charon' ? 'Charon' : 'Aoede';
  const emotion = String(_emotion || '').trim().toLowerCase();
  const model = String(_preferredModel || 'auto').trim();
  return `lucy_natural_v10_${voice}_${model}_${emotion}_${clean}`;
}

class TTSAudioRequestError extends Error {
  constructor(message: string, public status = 0, public code = '', public diagnosticId?: string) { super(message); }
}
let ttsRequestQueue: Promise<unknown> = Promise.resolve();
let activeTTSRequest: { controller: AbortController; cancel: () => void; key: string } | null = null;
let ttsRateLimitUntil = 0;
let lastTTSProviderRequestAt = 0;
const TTS_MIN_REQUEST_GAP_MS = 900;
const TTS_RATE_LIMIT_ATTEMPTS = 4;
const TTS_RATE_LIMIT_WAIT_CAP_MS = 20000;

function rateLimitWaitMs(response: Response, failure: { retryAfterSeconds?: number } | null): number {
  const header = response.headers.get('Retry-After');
  const supplied = header
    ? (/^\d+(?:\.\d+)?$/.test(header) ? Number(header) : (Date.parse(header) - Date.now()) / 1000)
    : Number(failure?.retryAfterSeconds);
  const seconds = Math.max(1, Math.min(86400, Math.ceil(Number.isFinite(supplied) && supplied > 0 ? supplied : 3)));
  return Math.min(TTS_RATE_LIMIT_WAIT_CAP_MS, seconds * 1000);
}

async function pauseForTTSSlot(ms: number, session: string | undefined, signal: AbortSignal): Promise<void> {
  const end = Date.now() + Math.max(0, ms);
  while (Date.now() < end) {
    if (signal.aborted || (session && ttsState.activeSessionId !== session)) {
      throw new Error('음성 요청이 취소되었습니다.');
    }
    await new Promise(resolve => setTimeout(resolve, Math.min(200, end - Date.now())));
  }
}

function requestAIAudio(text: string, emotion?: string, voice = 'Aoede', session?: string, preferredModel?: string): Promise<TTSAudioData> {
  const key = getTTSCacheKey(text, voice, emotion, undefined, undefined, preferredModel);
  const existing = ttsCache.get(key);
  if (existing) return existing as Promise<TTSAudioData>;
  const pending = ttsRequestQueue.catch(() => {}).then(async () => {
    if (session && ttsState.activeSessionId !== session) throw new Error('음성 요청이 취소되었습니다.');
    const controller = new AbortController();
    let cancelRequest: () => void = () => {};
    const deadline = new Promise<never>((_, reject) => {
      cancelRequest = () => { controller.abort(); reject(new Error('음성 요청이 취소되었습니다.')); };
    });
    activeTTSRequest = { controller, cancel: cancelRequest, key };
    let timeout: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => { controller.abort(); reject(new TTSAudioRequestError('음성 생성 응답이 지연되고 있습니다. 다시 눌러 주세요.', 504)); }, 90000);
    });
    try {
      return await Promise.race([deadline, timeoutPromise, (async () => {
      // Every live playback waits out a short 429. The provider wait was being
      // dropped on the way to the browser, so listeners were told to tap again
      // after 3 seconds instead of the reading continuing.
      const paced = Boolean(session);
      const attempts = paced ? TTS_RATE_LIMIT_ATTEMPTS : 1;
      for (let attempt = 0; attempt < attempts; attempt++) {
        if (session && ttsState.activeSessionId !== session) throw new Error('음성 요청이 취소되었습니다.');
        const rateWait = paced ? Math.max(0, ttsRateLimitUntil - Date.now()) : 0;
        const gapWait = paced ? Math.max(0, TTS_MIN_REQUEST_GAP_MS - (Date.now() - lastTTSProviderRequestAt)) : 0;
        await pauseForTTSSlot(Math.max(rateWait, gapWait), session, controller.signal);
        lastTTSProviderRequestAt = Date.now();
        const response = await fetch('/api/ai/tts', {
          method: 'POST',
          // 📉 바이너리 오디오를 우선 요청합니다(base64 JSON 대비 Origin 전송량 -25%).
          headers: { 'Content-Type': 'application/json', Accept: 'audio/wav, audio/mpeg' },
          body: JSON.stringify({ text: normalizeTextForSpeech(text), voice, emotion, preferredModel, responseFormat: 'binary' }), signal: controller.signal,
        });
        if (controller.signal.aborted) throw new Error('음성 요청이 취소되었습니다.');
        if (!response.ok) {
          const failure = await response.json().catch(() => null);
          if (controller.signal.aborted) throw new Error('음성 요청이 취소되었습니다.');
          if (response.status === 429) {
            if (['MEDIA_QUOTA_EXHAUSTED', 'TTS_QUOTA_EXHAUSTED'].includes(String(failure?.code || ''))) {
              throw new TTSAudioRequestError('오늘 쓸 수 있는 음성(Gemini) 한도를 모두 썼어요. 한도가 다시 채워지면 들을 수 있어요.', 429, String(failure?.code), failure?.diagnosticId);
            }
            const waitMs = rateLimitWaitMs(response, failure);
            ttsRateLimitUntil = Date.now() + waitMs;
            if (paced && attempt < attempts - 1) continue;
            const waitSec = Math.max(1, Math.ceil(waitMs / 1000));
            throw new TTSAudioRequestError(`음성 요청이 일시적으로 몰려 잠시 지연되었습니다. 약 ${waitSec}초 뒤 다시 눌러 주세요.`, 429, String(failure?.code || 'MEDIA_RATE_LIMIT'), failure?.diagnosticId);
          }
          if (['TTS_PROVIDER_UNAVAILABLE', 'TTS_EDGE_ACCESS_DENIED'].includes(String(failure?.code || ''))) {
            throw new TTSAudioRequestError('서버 음성 제공자의 접근이 거부되었습니다. 잠시 후 다시 시도해 주세요.', response.status, String(failure?.code), failure?.diagnosticId);
          }
          if (['GEMINI_TTS_MODEL_UNAVAILABLE', 'TTS_MODEL_UNAVAILABLE'].includes(String(failure?.code || ''))) {
            throw new TTSAudioRequestError('음성 모델을 사용할 수 없습니다. 서버의 모델 설정과 접근 권한을 확인해 주세요.', response.status, String(failure?.code), failure?.diagnosticId);
          }
          if (['GEMINI_API_KEY_INVALID', 'TTS_INVALID_KEY'].includes(String(failure?.code || ''))) {
            throw new TTSAudioRequestError('음성 제공자의 API 키 인증이 거부되었습니다. 서버의 API 키 설정을 확인해 주세요.', response.status, String(failure?.code), failure?.diagnosticId);
          }
          if (['GEMINI_TTS_ACCESS_DENIED', 'TTS_PERMISSION_DENIED'].includes(String(failure?.code || ''))) {
            throw new TTSAudioRequestError('음성 모델 접근 권한이 거부되었습니다. API 키의 프로젝트·모델 권한을 확인해 주세요.', response.status, String(failure?.code), failure?.diagnosticId);
          }
          if (response.status === 503 && (failure?.code === 'TTS_NOT_CONFIGURED' || /API.*키|키.*설정/.test(String(failure?.error || '')))) {
            throw new TTSAudioRequestError('AI 음성 API 키가 설정되지 않았습니다. 사이트의 API 설정을 확인해 주세요.', 503, 'TTS_NOT_CONFIGURED', failure?.diagnosticId);
          }
          if (failure?.code === 'TTS_CHUNK_FAILED') {
            throw new TTSAudioRequestError('음성의 일부 구간을 생성하지 못했습니다. 다시 시도해 주세요.', response.status, 'TTS_CHUNK_FAILED', failure?.diagnosticId);
          }
          if (failure?.code === 'TTS_TIMEOUT') {
            throw new TTSAudioRequestError('음성 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.', response.status, 'TTS_TIMEOUT', failure?.diagnosticId);
          }
          throw new TTSAudioRequestError(response.status === 401 || response.status === 403 ? 'AI 음성 API 인증·권한을 확인해 주세요.' : 'AI 음성을 생성하지 못했습니다. 잠시 후 다시 눌러 주세요.', response.status, String(failure?.code || ''), failure?.diagnosticId);
        }
        const audio = await parseTTSAudioResponse(response);
        if (!audio?.audioContent) throw new TTSAudioRequestError('AI 음성 응답이 비어 있습니다. 다시 눌러 주세요.', 502);
        return { audioContent: audio.audioContent, encoding: audio.encoding, sampleRate: audio.sampleRate, model: audio.model };
      }
      throw new TTSAudioRequestError('음성 요청이 일시적으로 몰려 잠시 지연되었습니다. 약 3초 뒤 다시 눌러 주세요.', 429, 'MEDIA_RATE_LIMIT');
      })()]);
    } finally {
      clearTimeout(timeout!);
      if (activeTTSRequest?.controller === controller) activeTTSRequest = null;
    }
  });
  ttsRequestQueue = pending.catch(() => {});
  ttsCache.set(key, pending);
  pending.catch(() => { if (ttsCache.get(key) === pending) ttsCache.delete(key); });
  // Bound retained base64 audio in long-lived mobile sessions.
  if (ttsCache.size > 24) ttsCache.delete(ttsCache.keys().next().value!);
  return pending;
}
export function prefetchTTS(text: string, _voice?: string, emotion?: string, _rate?: string, _speed?: number, preferredModel?: string): Promise<TTSAudioData | null> {
  // Generating voices for unopened/idle content consumed the small TTS quota.
  // Playback requests own generation; no speculative provider requests.
  return ttsCache.get(getTTSCacheKey(text, _voice, emotion, _rate, _speed, preferredModel)) || Promise.resolve(null);
}

let isPlayingSequence = false;
let ttsLifecycleReady = false;

function ensureTTSLifecycle() {
  if (ttsLifecycleReady || typeof window === 'undefined') return;
  ttsLifecycleReady = true;
  initTTSAudioLifecycle();
  initTTSSessionHandlers(stopTTS, pauseTTS, resumeTTS);
  // 🎧 오디오 출력 장치 변경(이어폰 분리/스피커 전환) 시 TTS 자동 정지 안전장치
  registerAudioDeviceChangeListener((reason) => {
    if (ttsState.isSpeaking || isTTSAudioPlaying()) {
      console.warn(`[TTS Safety] Audio output route changed (${reason}). Auto-stopping TTS to protect user privacy.`);
      stopTTS();
    }
  });
}


const retiredTTSSessions = new Set<string>();
function waitForTTSResume(session: string): Promise<boolean> {
  if (ttsState.activeSessionId !== session) return Promise.resolve(false);
  if (!ttsState.isPaused) return Promise.resolve(true);
  return new Promise(resolve => {
    const unsubscribe = subscribeTTS(state => {
      if (state.activeSessionId !== session || !state.isPaused) {
        unsubscribe();
        resolve(state.activeSessionId === session);
      }
    });
  });
}

export const pauseTTS = (): void => {
  if (!ttsState.activeSessionId || ttsState.isPaused) return;
  updateTTSState({ isSpeaking: false, isLoading: false, isPaused: true });
  pauseTTSAudio();
  pauseTTSSession();
};

export const resumeTTS = (): void => {
  if (!ttsState.activeSessionId || !ttsState.isPaused) return;
  resumeTTSAudio();
  const speaking = isTTSAudioPlaying();
  updateTTSState({ isPaused: false, isSpeaking: speaking, isLoading: !speaking });
  resumeTTSSession();
};

export const stopTTS = () => {
  playbackLookahead.clear();
  if (ttsState.activeSessionId) {
    retiredTTSSessions.add(ttsState.activeSessionId);
    if (retiredTTSSessions.size > 256) retiredTTSSessions.delete(retiredTTSSessions.values().next().value!);
  }
  const request = activeTTSRequest;
  activeTTSRequest = null;
  if (request) {
    ttsCache.delete(request.key);
    request.cancel();
    ttsRequestQueue = Promise.resolve();
  }
  isPlayingSequence = false;
  updateTTSState({
    isSpeaking: false,
    isLoading: false,
    isPaused: false,
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
  const playbackProfile = resolveTTSPlaybackProfile(text, voice, emotion);
  const cleanText = normalizeTextForSpeech(text);
  if (!cleanText || (sequenceSessionId && retiredTTSSessions.has(sequenceSessionId))) return;
  // Legacy book, report and insight readers call this entrypoint directly.
  if (!sequenceSessionId && cleanText.length > 260) {
    try {
      return await playTTSInChunks(cleanText, playbackProfile.voice, 240, playbackProfile.emotion, _speed, options);
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
    const parentNext = playbackLookahead.get(sequenceSessionId);
    for (let index = 0; index < parts.length; index++) {
      if (ttsState.activeSessionId && ttsState.activeSessionId !== sequenceSessionId) return;
      setSpeechLookahead(sequenceSessionId, index + 1 < parts.length
        ? { text: parts[index + 1], voice: playbackProfile.voice, emotion: playbackProfile.emotion, model: options?.preferredModel } : parentNext);
      await playTTS(parts[index], playbackProfile.voice, true, playbackProfile.emotion, sequenceSessionId,
        isSequenceChunk || index < parts.length - 1, fullTextReference || cleanText,
        _rate, _speed, options);
      if (ttsState.activeSessionId !== sequenceSessionId) return;
    }
    return;
  }

  // Lucy uses Aoede; explicit Charon requests read the user's chat messages.
  const targetVoice = playbackProfile.voice;

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

  const activeEmotion = playbackProfile.emotion;

  try {
    // Synchronously unlock audio during user gesture (required for mobile iOS/Android WebAudio playback)
    try {
      unlockAudioPlayback();
      preloadCompletionChime(getSharedAudioContext());
    } catch (e) {
      console.warn("[TTS] Failed to warm up audio systems:", e);
    }

    updateTTSState({ isLoading: !ttsState.isPaused, isSpeaking: false, activeText: cleanText,
      currentSentence: initialSubSentence, activeSentence: initialSubSentence,
      ...(fullTextReference ? { activeFullText: fullTextReference } : {}) });
    const data = await retrySpeechRequest(
      () => requestAIAudio(cleanText, activeEmotion, targetVoice, sessionToVerify, options?.preferredModel),
      {
        isActive: () => ttsState.activeSessionId === sessionToVerify,
        waitUntilResumed: () => waitForTTSResume(sessionToVerify!),
      },
    );
    if (data.model) {
      if (options) options.preferredModel = data.model;
      const next = playbackLookahead.get(sessionToVerify);
      if (next) next.model = data.model;
    }

    // CRITICAL ABORT CHECK after JSON parse
    if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) {
      console.log("[TTS] Playback aborted as active session changed mid-parse.");
      return;
    }

    if (!await waitForTTSResume(sessionToVerify!)) return;

    // Decoding and network time are not playback time. Publish highlights only
    // when the audio clock reports a live source, for every entrypoint/reader.
    const speakingSentences = splitSpeechIntoSentences(cleanText);
    if (data?.audioContent) {
      const encoding = data.encoding === 'pcm' ? 'pcm' : data.encoding === 'wav' ? 'wav' : 'mp3';
      // One playback engine owns pause, recovery, cancellation and timing.
      // Replaying through the legacy PCM path bypassed all four safeguards.
      const playAudio = async () => {
        try {
          await playTTSAudio(data!.audioContent, encoding,
            data!.sampleRate ?? 24000, activeEmotion || cleanText, isSequenceChunk, 1.0, () => prepareNextSpeech(sessionToVerify!));
        } catch (error) {
          if (!['TTS_CONTEXT_STALLED', 'TTS_DECODE_TIMEOUT', 'TTS_INTERRUPTED'].includes((error as any)?.code)) {
            ttsCache.delete(getTTSCacheKey(cleanText, targetVoice, activeEmotion, _rate, _speed, options?.preferredModel));
          }
          throw error;
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
            prepareNextSpeech(sessionToVerify!);
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
        if (shouldPlayTTSCompletionChime(options)) {
          try { playAiResultNotification(); } catch (_) {}
        }
      }
      return;
    }
    throw new Error('No audio content returned');
  } catch (error) {
    if (sessionToVerify && ttsState.activeSessionId !== sessionToVerify) return;

    stopTTS();
    console.warn('[TTS] AI audio unavailable; device speech is disabled.', error);
    const failure = error instanceof Error ? error : new Error('AI 음성을 재생하지 못했습니다. 다시 눌러 주세요.');
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('prism:tts-error', { detail: { message: failure.message } }));
    if (wait) throw failure;
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

const LEAD_CHUNK_TARGET = 70;
const LEAD_CHUNK_MAX = 90;

/** Split a long first chunk into a short lead sentence and its remainder. */
function splitLeadChunk(first: string): [string, string] | null {
  if (first.length <= LEAD_CHUNK_MAX) return null;
  let lead = splitSpeechIntoSentences(first)[0] || first;
  if (lead.length > LEAD_CHUNK_MAX) {
    const window = lead.slice(0, LEAD_CHUNK_MAX);
    const comma = Math.max(window.lastIndexOf(','), window.lastIndexOf('，'));
    const space = window.lastIndexOf(' ', LEAD_CHUNK_TARGET + 10);
    const cut = comma >= 30 ? comma + 1 : space >= 30 ? space : LEAD_CHUNK_TARGET;
    lead = lead.slice(0, cut).trim();
  }
  const rest = first.slice(first.indexOf(lead) + lead.length).trim();
  return rest ? [lead, rest] : null;
}

/**
 * The exact chunks playTTSInChunks speaks (~180 characters, one Gemini request each:
 * its rate limit is small, so the Gemini request count must not grow).
 * With `fastLead`, a long first chunk is split into a short lead sentence that is
 * synthesized by the fast Edge voice (separate quota) and its remainder (Gemini), so
 * the voice starts quickly while the Gemini request count stays the same.
 */
export function planTTSChunks(text: string, maxChunkLength = 240, options: { fastLead?: boolean } = {}): string[] {
  const cleanText = prepareNaturalSpeechText(text);
  if (!cleanText) return [];
  const chunks = splitSpeechIntoChunks(cleanText, Math.max(80, Math.min(120, maxChunkLength)));
  if (!options.fastLead || chunks.length === 0) return chunks;
  const split = splitLeadChunk(chunks[0]);
  return split ? [...split, ...chunks.slice(1)] : chunks;
}

/* ── ⚡ 빠른 첫 문장 (Edge Neural) ── */
const EDGE_LEAD_TIMEOUT_MS = 2500;
const EDGE_LEAD_COOLDOWN_MS = 10 * 60 * 1000;
let edgeLeadUnavailableUntil = 0;

/**
 * Off: Microsoft answers 403 to Edge requests from the Render server (checked on the
 * deployed app, v1.8.106), and each failed try costs one extra Gemini request for the
 * fallback. Flip this on only if Edge starts answering from the server again.
 */
const EDGE_LEAD_ENABLED = false;

export function isEdgeLeadAvailable(now = Date.now()): boolean {
  return EDGE_LEAD_ENABLED && now >= edgeLeadUnavailableUntil;
}

/**
 * Put the lead sentence's audio in the cache from the fast Edge voice. Playback then
 * finds it there. If Edge fails or is slow, the same cache slot falls back to the
 * regular Gemini request, and Edge is skipped for a while.
 */
function primeEdgeLead(text: string, voice: string | undefined, emotion: string | undefined, session: string): void {
  const resolvedVoice = voice === 'Charon' ? 'Charon' : 'Aoede';
  const key = getTTSCacheKey(text, resolvedVoice, emotion);
  if (ttsCache.has(key)) return;
  const controller = new AbortController();
  const edge = (async (): Promise<TTSAudioData> => {
    const timer = setTimeout(() => controller.abort(), EDGE_LEAD_TIMEOUT_MS);
    try {
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ text: normalizeTextForSpeech(text), voice: resolvedVoice, provider: 'edge' }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`edge ${response.status}`);
      const audio = await parseTTSAudioResponse(response);
      if (!audio?.audioContent) throw new Error('edge empty');
      return { audioContent: audio.audioContent, encoding: audio.encoding, sampleRate: audio.sampleRate };
    } finally {
      clearTimeout(timer);
    }
  })();
  const withFallback = edge.catch(() => {
    edgeLeadUnavailableUntil = Date.now() + EDGE_LEAD_COOLDOWN_MS;
    if (ttsCache.get(key) === withFallback) ttsCache.delete(key);
    return requestAIAudio(text, emotion, resolvedVoice, session);
  });
  // Callers await this promise themselves; mark it handled so a failed reading never
  // surfaces as an unhandled rejection after the reader has already stopped.
  withFallback.catch(() => {});
  ttsCache.set(key, withFallback);
}

/**
 * Proactively prefetch the first 2 chunks of a speech text, using the same chunk plan
 * as playback so the cached audio is actually reused.
 */
export function prefetchTTSChunks(
  text: string,
  voice?: string,
  maxChunkLength = 240,
  emotion?: string,
): void {
  try {
    const chunks = planTTSChunks(text, maxChunkLength);
    for (let k = 0; k < Math.min(2, chunks.length); k++) {
      prefetchTTS(chunks[k], voice, emotion).catch(() => {});
    }
  } catch (_) {}
}

// 🎯 낭독 청취 위치 기억: 알림 등으로 끊기거나 일시정지 시 처음부터 다시 듣지 않고 해당 청크부터 이어듣기 지원
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
  const playbackProfile = resolveTTSPlaybackProfile(text, voice, emotion);
  const sequenceOptions: TTSPlaybackOptions = { ...options };
  const cleanText = prepareNaturalSpeechText(text);
  if (!cleanText) return;
  if ((options?.isAutoPlay || options?.isAutoPlayback) && ttsState.activeSessionId) return;

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

  const fastLead = isEdgeLeadAvailable();
  const chunks = planTTSChunks(cleanText, maxChunkLength, { fastLead });
  if (chunks.length === 0) return;

  // 중간 청크 오류 후에는 완료된 청크를 건너뛰고 사용자가 누른 재생에서 이어 듣습니다.
  const startChunkIndex = getResumableTTSChunkIndex(lastTTSProgress, {
    fullText: cleanText,
    voice: playbackProfile.voice,
    chunks,
  });
  if (startChunkIndex > 0) {
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

  // ⚡ 첫 문장은 빠른 Edge 음성으로 바로 시작한다. 다음 조각(Gemini)은 첫 문장이 재생되기 시작할 때
  // 기존 미리 듣기(lookahead)가 요청하므로 Gemini 요청 수는 그대로다.
  if (fastLead && startChunkIndex === 0 && chunks.length > 1 && chunks[0] !== splitSpeechIntoChunks(cleanText, 120)[0]) {
    primeEdgeLead(chunks[0], playbackProfile.voice, playbackProfile.emotion, sequenceSessionId);
  }

  try {
    // Prime the audio context and element during user click
    try {
      const ctx = getSharedAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      preloadCompletionChime(ctx);
      primeTTSAudioElement();
    } catch (_) {}

    for (let i = startChunkIndex; i < chunks.length; i++) {
      if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) {
        break;
      }

      if (!await waitForTTSResume(sequenceSessionId)) break;
      const currentChunkText = chunks[i];
      const subSentences = splitSpeechIntoSentences(currentChunkText);
      const firstSub = subSentences[0] || currentChunkText;

      // 현재 진행 중인 청크 위치 저장
      lastTTSProgress = {
        fullText: cleanText,
        chunkIndex: i,
        totalChunks: chunks.length,
        chunks,
        voice: playbackProfile.voice,
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

      setSpeechLookahead(sequenceSessionId, i + 1 < chunks.length
        ? { text: chunks[i + 1], voice: playbackProfile.voice, emotion: playbackProfile.emotion, model: sequenceOptions.preferredModel } : undefined);
      if (i + 1 < chunks.length) void prefetchTTS(chunks[i + 1], playbackProfile.voice, playbackProfile.emotion, undefined, undefined, sequenceOptions.preferredModel).catch(() => {});
      if (i + 2 < chunks.length) void prefetchTTS(chunks[i + 2], playbackProfile.voice, playbackProfile.emotion, undefined, undefined, sequenceOptions.preferredModel).catch(() => {});

      const isLastChunk = i === chunks.length - 1;
      try {
        await playTTS(currentChunkText, playbackProfile.voice, true, playbackProfile.emotion,
          sequenceSessionId, true, cleanText, undefined, undefined, sequenceOptions);
      } catch (chunkErr) {
        console.warn(`[TTS] Sequence chunk ${i + 1}/${chunks.length} playback failed:`, chunkErr);
        throw chunkErr;
      }

      if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) {
        break;
      }

      // 완독 성공 시 위치를 초기화하고 마지막 청크 뒤에만 옅은 완료 띵동 재생
      if (isLastChunk) {
        lastTTSProgress = null;
        if (shouldPlayTTSCompletionChime(options)) {
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
  const mySessionId = `conversation_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  updateTTSState({ isLoading: true, isSpeaking: false, activeText: '__CONVERSATION__', activeSessionId: mySessionId });
  isPlayingSequence = true;
  acquireScreenWakeLock().catch(() => {});

  // 🌟 사용자 발화는 남성 보이스 Charon, 루시 답변은 여성 보이스 Aoede 분리 적용
  const resolvedAiVoice = aiVoice || 'Aoede';
  const resolvedUserVoice = userVoice || 'Charon';

  try {
    for (let i = 0; i < messages.length; i++) {
      if (ttsState.activeSessionId !== mySessionId) break;
      // 일시정지 중에는 다음 발화로 넘어가지 않고 기다렸다가 이어 읽는다.
      if (!await waitForTTSResume(mySessionId)) break;
      const m = messages[i];
      const isUser = m.role === 'user';
      const voice = isUser ? resolvedUserVoice : resolvedAiVoice;

      if (onMessageStart) {
        onMessageStart(i, m);
      }

      const isLastMsg = i === messages.length - 1;
      const nextMessage = messages[i + 1];
      setSpeechLookahead(mySessionId, nextMessage ? {
        text: nextMessage.content,
        voice: nextMessage.role === 'user' ? resolvedUserVoice : resolvedAiVoice,
      } : undefined);
      await playTTS(m.content, voice, true, undefined, mySessionId, !isLastMsg, undefined, undefined, undefined, { ...options, skipCompletionChime: true });
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
        if (!await waitForTTSResume(sequenceSessionId)) break;
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
        setSpeechLookahead(sequenceSessionId, i + 1 < qChunks.length
          ? { text: qChunks[i + 1], voice: userVoice }
          : cleanAnswer ? { text: splitSpeechIntoChunks(cleanAnswer, 240)[0], voice: aiVoice, emotion: '다정' } : undefined);
        await playTTS(qChunks[i], userVoice, true, undefined, sequenceSessionId, true, cleanQuestion);
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


      for (let i = 0; i < aChunks.length; i++) {
        if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) break;
        if (!await waitForTTSResume(sequenceSessionId)) break;
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
        setSpeechLookahead(sequenceSessionId, i + 1 < aChunks.length
          ? { text: aChunks[i + 1], voice: aiVoice, emotion: '다정' } : undefined);

        const isLastChunk = i === aChunks.length - 1;
        try {
          await playTTS(aChunks[i], aiVoice, true, '다정', sequenceSessionId, !isLastChunk, cleanAnswer, undefined, undefined, { skipCompletionChime: true });
        } catch (chunkErr) {
          throw chunkErr;
        }

        if (ttsState.activeSessionId !== sequenceSessionId || !isPlayingSequence) break;
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
      setActive(state.isSpeaking || state.isLoading || Boolean(state.isPaused));
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
