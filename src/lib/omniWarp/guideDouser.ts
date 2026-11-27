/**
 * 🔊 가이드 도슨트 (Guide Douser) — 스마트 가이드가 고른 곳을 목소리로 다정하게 안내한다.
 *
 * 사용자 지시(2026-11-27): "tts기능을 통해 가이드 도슨트를 만들어서 해당 옵션도 키고 끌수 있게해줘"
 *
 * - 앱이 이미 쓰는 TTS 파이프라인(playTTS / stopTTS)을 그대로 재사용한다.
 * - 낭독 문구는 스마트 가이드가 만든 이유(reason)와 할 일(ctaHint) 그대로다.
 * - 배너를 닫거나, 다른 곳으로 이동하거나, 도슨트 옵션을 끄면 stopGuideDouser()로 멈춘다.
 */
import { useEffect, useState } from 'react';
import { getCurrentTTSState, playTTS, stopTTS, subscribeTTS } from '@/utils/tts';
import { buildSmartGuideSpeech, type SmartGuideResult } from './smartBigBangGuide';

/** 가이드 낭독 목소리 (앱의 가이드 낭독과 같은 목소리) */
export const GUIDE_DOUSER_VOICE = 'Kore';
export const GUIDE_DOUSER_EVENT = 'prism:guide_douser';
/**
 * playTTS는 시작 직전에 상태를 한 번 비우므로(stopTTS → isLoading), 그 순간을 낭독 종료로
 * 오해하지 않도록 잠깐 기다렸다가 정말 멈춘 경우에만 표시를 내린다.
 */
const IDLE_GRACE_MS = 900;

let active = false;
let unsubscribe: (() => void) | null = null;
let idleTimer: ReturnType<typeof setTimeout> | null = null;

function emit(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(GUIDE_DOUSER_EVENT, { detail: { active } }));
}

function clearIdleTimer(): void {
  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
}

function release(): void {
  clearIdleTimer();
  unsubscribe?.();
  unsubscribe = null;
}

function finish(): void {
  if (!active) return;
  active = false;
  release();
  emit();
}

/** 배너에 그대로 보여 주는 문장을 목소리로 읽을 문장으로 바꾼다. */
export const buildGuideDouserSpeech = buildSmartGuideSpeech;

export function isGuideDouserActive(): boolean {
  return active;
}

/** 추천 이동 직후 한 번 읽는다. 읽는 동안 배너에 '읽는 중' 표시가 뜬다. */
export function speakGuideDouser(guide: SmartGuideResult): void {
  const text = buildGuideDouserSpeech(guide);
  if (!text.trim()) return;
  if (!unsubscribe) {
    // 사용자가 앱의 음성 컨트롤에서 직접 멈춘 경우에도 표시를 함께 내린다.
    unsubscribe = subscribeTTS(state => {
      if (!active) return;
      if (state.isSpeaking || state.isLoading) {
        clearIdleTimer();
        return;
      }
      if (idleTimer) return;
      idleTimer = setTimeout(() => {
        idleTimer = null;
        const current = getCurrentTTSState();
        if (active && !current.isSpeaking && !current.isLoading) finish();
      }, IDLE_GRACE_MS);
    });
  }
  active = true;
  emit();
  void playTTS(text, GUIDE_DOUSER_VOICE, false).then(
    () => finish(),
    () => finish(),
  );
}

/** 배너 닫기·화면 이동·옵션 끄기에서 부른다. */
export function stopGuideDouser(): void {
  const wasActive = active;
  active = false;
  release();
  if (wasActive) {
    try {
      stopTTS();
    } catch {
      /* 이미 멈춰 있으면 그대로 둔다 */
    }
  }
  emit();
}

/** 배너가 '읽는 중' 표시와 중지 버튼을 그릴 때 쓰는 구독 훅 */
export function useGuideDouserActive(): boolean {
  const [value, setValue] = useState<boolean>(() => isGuideDouserActive());
  useEffect(() => {
    const sync = (event: Event) => setValue(Boolean((event as CustomEvent<{ active?: boolean }>).detail?.active));
    window.addEventListener(GUIDE_DOUSER_EVENT, sync);
    setValue(isGuideDouserActive());
    return () => window.removeEventListener(GUIDE_DOUSER_EVENT, sync);
  }, []);
  return value;
}
