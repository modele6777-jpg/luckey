import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, KeyRound, Copy, Check, RefreshCw, Heart, Eye, PenLine,
  ListChecks, Moon, Timer, Plus, X, BookOpen, Keyboard, Shuffle,
  Volume2, VolumeX, Loader2,
} from 'lucide-react';
import { z } from 'zod';
import { useApp } from '@/contexts/AppContext';
import { invokeLLMStructured } from '@/lib/ai';
import { getTodayDateKey } from '@/lib/sharedStateSync';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { playAiResultNotification } from '@/lib/audioHaptics';
import { sendDailySecretToLucy } from '@/lib/oracleDeepInsight';
import { TTSButton } from '@/components/TTSButton';
import { playTTS, playTTSInChunks, stopTTS, prefetchTTS, useTTSActive, useTTSState, prefetchTTSChunks } from '@/utils/tts';
import { unlockAudioPlayback } from '@/lib/audio';
import { ScriptingTypingPractice } from './ScriptingTypingPractice';
import { safeLocalStorage } from '@/utils/safeStorage';
import { generateDynamicSecretKit, getDailySecretIndex, transmuteWorryOrWish } from './dailySecretCatalog';

const DailySecretSchema = z.object({
  affirmation: z.string().describe('Today’s Secret Affirmation: 사용자의 구체적 소원/고민 내용에 100% 밀착되어, 그 소망이 이미 눈앞에서 완벽히 실현되었음을 선언하는 생생하고 강력한 1인칭 현재완료형 확언 1문장 (기계적인 문구 "나의 소원 ...은 이루어졌으며"를 절대 쓰지 말고, 소원의 핵심 키워드와 극적 성취/해결 상황을 자연스럽고 품격 있게 녹여낼 것)'),
  reflection: z.string().describe('Believe · 믿음으로 새기기: 마음속 의심과 조급함을 지우고 소원이 이미 영적 차원에 존재함을 확신하게 돕는 깊이 있는 통찰 사색 2~3문장 (절대 affirmation과 같은 문장을 반복하지 말고 완전히 다른 사색적인 문장으로 작성)'),
  action: z.string().describe('Receive · 오늘의 작은 실천: 소원이 이미 이루어진 사람처럼 오늘 당장 몸으로 실행할 수 있는 구체적인 일상/신체 행동 1문장 (예: "오늘 하루 가벼운 발걸음으로 산책하며 주변에 미소 짓기", "창문을 열고 시원한 공기를 깊게 들이마시기"). [중복 엄격 금지: 절대 desire(소원 선언)나 feelingAnchor(감정 묘사) 문장을 복사하거나 같게 작성하지 마세요]'),
  desire: z.string().describe('Ask · 오늘의 소원 선언: 우주를 향해 소망을 명확하고 품격 있게 청원하는 선언문 1문장 (예: "우주여, ...의 소망이 가장 지혜롭고 아름다운 방식으로 피어나게 하옵소서"). [중복 엄격 금지: 절대 action(행동)이나 feelingAnchor(느낌) 문장과 같거나 비슷해서는 안 됩니다]'),
  visualizationGuide: z.string().describe('68초 시각화 스튜디오 가이드: 음성 낭독(TTS) 시 실제로 약 1분(60초 전후) 동안 깊은 몰입이 유지되도록 작성된 상세한 4단계 오감 명상 가이드(약 350~450자 분량: 1. 호흡 이완 유도 -> 2. 소원 성취의 생생한 시각/청각/촉각 정경 묘사 -> 3. 가슴 벅찬 안도감과 환희의 감정 절정 -> 4. 심장 중심 주파수 각인)'),
  gratitudeSeeds: z.array(z.string()).describe('감사 자석: 소원 성취 주파수를 높이고 풍요를 여는 서로 다른 구체적 감사 3가지'),
  feelingAnchor: z.string().describe('Feel · 이미 받은 느낌: 소원이 이미 이루어졌을 때 가슴 깊은 곳에서 차오르는 벅찬 기쁨과 안도감을 생생히 환기하는 감정 한 줄 (예: "...할 때 가슴 가득 차오르는 벅찬 안도감과 충만한 환희"). [중복 엄격 금지: 절대 desire(청원문)나 action(신체 행동) 문장을 복사하지 마세요]'),
  mirrorPhrase: z.string().describe('거울 확언: 거울 속 나를 보며 소원 성취의 확신과 자존감을 채우는 거울 확언 1문장'),
  eveningPrompt: z.string().describe('저녁 감사 마무리: 소원이 이루어짐에 감사하며 편안한 수면으로 들어가는 저녁 마무리 1문장'),
  scriptingStarter: z.string().describe('스크립팅 노트: 소원이 완벽히 실현된 현재의 하루를 생생하게 써 내려가는 일기 첫 문장'),
  appliedWish: z.string().optional().describe('이 키트 생성에 적용된 사용자의 소원 원문'),
  updatedAt: z.number().optional().describe('키트 생성 타임스탬프'),
  isReceived: z.boolean().optional().describe('사용자가 직접 키트 받기를 실행하여 개방되었는지 여부'),
});

export type DailySecretData = z.infer<typeof DailySecretSchema>;

function generateTailoredSecretFallback(wishStr: string, name = '여행자', seed: number = 0): DailySecretData {
  return generateDynamicSecretKit(wishStr, name, seed);
}

const STORAGE_KEY = 'orange_daily_secret_v2';
const LEGACY_KEYS = ['orange_daily_secret_v1', 'orange_daily_affirmation_v1'];

const PRACTICE_ITEMS = [
  { id: 'affirmation', label: '시크릿 확언 읽기/듣기' },
  { id: 'visualization', label: '68초 시각화 완료' },
  { id: 'mirror', label: '거울 확언 말하기/듣기' },
  { id: 'feeling', label: '이미 받은 것처럼 기분 느끼기' },
  { id: 'action', label: '오늘의 작은 실천 하기' },
] as const;

type PracticeId = (typeof PRACTICE_ITEMS)[number]['id'];

// Use shared date key helper to ensure all modules use the same YYYY-MM-DD format
function todayKey(): string {
  return getTodayDateKey();
}

function dayStorageKey(suffix: string) {
  return `orange_daily_secret_${suffix}_${todayKey()}`;
}

/** 두 문장이 동일하거나 실질적으로 같은 문장인지(유사도 55% 이상 또는 상호 포함) 정밀 검사 */
function isSubstantiallyDuplicate(s1?: string, s2?: string): boolean {
  if (!s1 || !s2) return false;
  const a = s1.trim().replace(/[\s.,!?~'"`·\-—–[\]()]/g, '');
  const b = s2.trim().replace(/[\s.,!?~'"`·\-—–[\]()]/g, '');
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length >= 7 && b.length >= 7 && (a.includes(b) || b.includes(a))) return true;

  // 2-gram Jaccard 유사도 검사
  const setA = new Set<string>();
  for (let i = 0; i < a.length - 1; i++) setA.add(a.slice(i, i + 2));
  const setB = new Set<string>();
  for (let i = 0; i < b.length - 1; i++) setB.add(b.slice(i, i + 2));
  let intersection = 0;
  setA.forEach((bg) => { if (setB.has(bg)) intersection++; });
  const union = setA.size + setB.size - intersection;
  return union > 0 && (intersection / union) > 0.55;
}

export function ensureFullKit(
  raw: Partial<DailySecretData> | null | undefined,
  wishStr: string = '',
  name: string = '여행자',
  seed: number = 0,
): DailySecretData | null {
  if (!raw) return null;
  // CRITICAL: A secret kit cannot be reconstituted from an empty or progress-only object!
  const rawAffirmation = typeof raw.affirmation === 'string' ? raw.affirmation.trim() : '';
  const rawDesire = typeof raw.desire === 'string' ? raw.desire.trim() : '';
  if (!rawAffirmation && !rawDesire) {
    return null;
  }

  const effectiveWish = raw.appliedWish || wishStr.trim() || undefined;
  const fallback = generateTailoredSecretFallback(effectiveWish || '', name, seed);

  let affirmation = rawAffirmation || fallback.affirmation;
  let reflection = raw.reflection?.trim() || fallback.reflection;

  // 🚨 [필수 템플릿 제거 및 고정 문구 자정] '고요한 파동으로' 또는 구형 고정 문구 원천 차단
  const isBogusAffirmation =
    !affirmation ||
    affirmation.includes('고요한 파동') ||
    affirmation.includes('심신을 정렬') ||
    affirmation.includes('은(는) 이미 우주의 완벽한 섭리 안에서') ||
    affirmation.startsWith('나의 소원 "') ||
    !/[가-힣]/.test(affirmation) ||
    affirmation === '나의 삶은 언제나 나를 가장 완전하고 조화로운 길로 이끌며, 내 안의 모든 저항과 의심이 녹아내려 찬란한 결실과 깊은 평온이 기적처럼 실현되었습니다.' ||
    affirmation.length < 10;

  if (isBogusAffirmation) {
    affirmation = fallback.affirmation;
  }

  // 🚨 [Believe(reflection) 중복 방지]
  if (
    !reflection ||
    reflection.includes('고요한 파동') ||
    reflection.includes('심신을 정렬') ||
    isSubstantiallyDuplicate(reflection, affirmation) ||
    reflection.length < 15 ||
    !/[가-힣]/.test(reflection)
  ) {
    reflection = fallback.reflection;
  }

  // 🚨 [Ask(desire) · Receive(action) · Feel(feelingAnchor) 3대 기둥 사전 중복 감지 및 분리]
  const rawDesireStr = raw.desire?.trim() || '';
  const rawActionStr = raw.action?.trim() || '';
  const rawFeelingStr = raw.feelingAnchor?.trim() || '';

  const areAllThreeIdentical = Boolean(
    rawDesireStr &&
    rawActionStr &&
    rawFeelingStr &&
    isSubstantiallyDuplicate(rawDesireStr, rawActionStr) &&
    isSubstantiallyDuplicate(rawDesireStr, rawFeelingStr)
  );

  // 1. Ask(desire) 소원 선언 검증: affirmation, reflection과 절대 달라야 함
  let desire = (!areAllThreeIdentical ? rawDesireStr : '') || fallback.desire;
  if (
    !desire ||
    desire.includes('고요한 파동') ||
    desire.includes('심신을 정렬') ||
    isSubstantiallyDuplicate(desire, affirmation) ||
    isSubstantiallyDuplicate(desire, reflection) ||
    !/[가-힣]/.test(desire)
  ) {
    desire = fallback.desire;
  }
  if (!desire || desire.length < 5) {
    desire = effectiveWish
      ? `우주여, 나의 간절한 소망 [${effectiveWish}]이(가) 가장 조화롭고 지혜로운 방식으로 온전히 피어나게 하옵소서.`
      : fallback.desire;
  }

  // 2. Receive(action) 중복 및 복사 원천 차단: desire, affirmation, reflection과 절대 달라야 함
  let action = (!areAllThreeIdentical ? rawActionStr : '') || fallback.action;
  if (
    !action ||
    action.includes('고요한 파동') ||
    action.includes('심신을 정렬') ||
    action.length < 8 ||
    !/[가-힣]/.test(action) ||
    isSubstantiallyDuplicate(action, desire) ||
    isSubstantiallyDuplicate(action, affirmation) ||
    isSubstantiallyDuplicate(action, reflection)
  ) {
    if (fallback.action && !isSubstantiallyDuplicate(fallback.action, desire)) {
      action = fallback.action;
    } else {
      action = '오늘 하루 이미 소망을 온전히 이룬 사람처럼 어깨를 펴고 주변에 따뜻하고 다정한 미소 짓기';
    }
  }

  let visualizationGuide = raw.visualizationGuide?.trim() || fallback.visualizationGuide;
  if (!visualizationGuide || visualizationGuide.includes('고요한 파동') || visualizationGuide.includes('심신을 정렬') || visualizationGuide === affirmation || visualizationGuide.length < 180 || !/[가-힣]/.test(visualizationGuide)) {
    visualizationGuide = fallback.visualizationGuide;
  }

  // 3. Feel(feelingAnchor) 중복 및 복사 원천 차단: desire, action, affirmation, reflection과 절대 달라야 함
  let feelingAnchor = (!areAllThreeIdentical ? rawFeelingStr : '') || fallback.feelingAnchor;
  if (
    !feelingAnchor ||
    feelingAnchor.includes('고요한 파동') ||
    feelingAnchor.includes('심신을 정렬') ||
    !/[가-힣]/.test(feelingAnchor) ||
    isSubstantiallyDuplicate(feelingAnchor, desire) ||
    isSubstantiallyDuplicate(feelingAnchor, action) ||
    isSubstantiallyDuplicate(feelingAnchor, affirmation) ||
    isSubstantiallyDuplicate(feelingAnchor, reflection)
  ) {
    if (
      fallback.feelingAnchor &&
      !isSubstantiallyDuplicate(fallback.feelingAnchor, desire) &&
      !isSubstantiallyDuplicate(fallback.feelingAnchor, action)
    ) {
      feelingAnchor = fallback.feelingAnchor;
    } else {
      feelingAnchor = '소망이 마침내 눈앞의 현실이 되었을 때 가슴 깊은 곳에서 차오르는 벅찬 안도감과 충만한 환희';
    }
  }

  // 4. [3대 기둥 상호 고유성 최종 안전망] 어떠한 경우에도 셋 중 둘이 같지 않도록 보장
  if (isSubstantiallyDuplicate(action, desire)) {
    action = '오늘 하루 이미 소망을 온전히 이룬 사람처럼 어깨를 펴고 주변에 따뜻하고 다정한 미소 짓기';
  }
  if (isSubstantiallyDuplicate(feelingAnchor, desire) || isSubstantiallyDuplicate(feelingAnchor, action)) {
    feelingAnchor = '소망이 마침내 눈앞의 현실이 되었을 때 가슴 깊은 곳에서 차오르는 벅찬 안도감과 충만한 환희';
  }
  let mirrorPhrase = raw.mirrorPhrase?.trim() || fallback.mirrorPhrase;
  if (!mirrorPhrase || mirrorPhrase.includes('고요한 파동') || mirrorPhrase.includes('심신을 정렬') || mirrorPhrase === affirmation || !/[가-힣]/.test(mirrorPhrase)) {
    mirrorPhrase = fallback.mirrorPhrase;
  }

  let eveningPrompt = raw.eveningPrompt?.trim() || fallback.eveningPrompt;
  // 🚨 [필수 언어 점검 및 고정 문구 제거]
  if (!eveningPrompt || eveningPrompt.includes('고요한 파동') || eveningPrompt.includes('심신을 정렬') || eveningPrompt === affirmation || eveningPrompt === reflection || eveningPrompt.length < 10 || !/[가-힣]/.test(eveningPrompt)) {
    eveningPrompt = fallback.eveningPrompt;
  }

  let scriptingStarter = raw.scriptingStarter?.trim() || fallback.scriptingStarter;
  if (!scriptingStarter || scriptingStarter.includes('고요한 파동') || scriptingStarter.includes('심신을 정렬') || scriptingStarter === affirmation || !/[가-힣]/.test(scriptingStarter)) {
    scriptingStarter = fallback.scriptingStarter;
  }

  let gratitudeSeeds =
    Array.isArray(raw.gratitudeSeeds) && raw.gratitudeSeeds.length >= 3
      ? [String(raw.gratitudeSeeds[0]), String(raw.gratitudeSeeds[1]), String(raw.gratitudeSeeds[2])]
      : fallback.gratitudeSeeds;

  if (
    gratitudeSeeds.some((s) => !s || s === affirmation || s === reflection || s === action || !/[가-힣]/.test(s)) ||
    gratitudeSeeds[0] === gratitudeSeeds[1] ||
    gratitudeSeeds[1] === gratitudeSeeds[2]
  ) {
    gratitudeSeeds = fallback.gratitudeSeeds;
  }

  return {
    affirmation,
    reflection,
    action,
    desire,
    visualizationGuide,
    gratitudeSeeds,
    feelingAnchor,
    mirrorPhrase,
    eveningPrompt,
    scriptingStarter,
    appliedWish: effectiveWish,
    updatedAt: (raw as any)?.updatedAt || Date.now(),
    isReceived: (raw as any)?.isReceived ?? true,
  };
}

export function loadCachedSecret(wishStr: string = '', name: string = '여행자'): DailySecretData | null {
  try {
    const isReceivedFlag = localStorage.getItem(dayStorageKey('secret_received')) === 'true' ||
      safeLocalStorage.getItem(dayStorageKey('secret_received')) === 'true';

    const validateAndReconstruct = (dataCandidate: any, dateCandidate?: string, updatedAt?: number): DailySecretData | null => {
      if (!dataCandidate || typeof dataCandidate !== 'object') return null;
      if (dateCandidate && dateCandidate !== todayKey()) return null;
      const aff = typeof dataCandidate.affirmation === 'string' ? dataCandidate.affirmation.trim() : '';
      const des = typeof dataCandidate.desire === 'string' ? dataCandidate.desire.trim() : '';
      if (!aff && !des) return null;

      // Must be received by explicit user action or verified received flag
      const isExplicitlyReceived = isReceivedFlag || Boolean(dataCandidate.isReceived) || Boolean(dataCandidate.appliedWish);
      if (!isExplicitlyReceived) {
        return null;
      }

      const reconstructed = ensureFullKit({ ...dataCandidate, updatedAt: updatedAt || dataCandidate.updatedAt }, wishStr, name);
      if (reconstructed) {
        const wasDuplicated =
          Boolean(dataCandidate.action && dataCandidate.desire && dataCandidate.action === dataCandidate.desire) ||
          Boolean(dataCandidate.action && dataCandidate.feelingAnchor && dataCandidate.action === dataCandidate.feelingAnchor) ||
          Boolean(dataCandidate.desire && dataCandidate.feelingAnchor && dataCandidate.desire === dataCandidate.feelingAnchor) ||
          Boolean(dataCandidate.action && dataCandidate.affirmation && dataCandidate.action === dataCandidate.affirmation);
        if (wasDuplicated) {
          const repairedPayload = JSON.stringify({
            date: todayKey(),
            data: reconstructed,
            updatedAt: reconstructed.updatedAt || Date.now(),
            isReceived: true,
          });
          try {
            localStorage.setItem(STORAGE_KEY, repairedPayload);
            localStorage.setItem(`orange_daily_secret_${todayKey()}`, repairedPayload);
            localStorage.setItem('orange_daily_secret_cache', repairedPayload);
            safeLocalStorage.setItem(STORAGE_KEY, repairedPayload);
            safeLocalStorage.setItem(`orange_daily_secret_${todayKey()}`, repairedPayload);
            safeLocalStorage.setItem('orange_daily_secret_cache', repairedPayload);
          } catch (_) {}
        }
        return reconstructed;
      }
      return null;
    };

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date && parsed.date !== todayKey()) {
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
      } else {
        const validated = validateAndReconstruct(parsed.data || parsed, parsed.date, parsed.updatedAt);
        if (validated) return validated;
      }
    }

    const todayDirect = localStorage.getItem(`orange_daily_secret_${todayKey()}`);
    if (todayDirect) {
      const parsed = JSON.parse(todayDirect);
      const validated = validateAndReconstruct(parsed?.data || parsed, parsed?.date || todayKey(), parsed?.updatedAt);
      if (validated) return validated;
    }

    const cacheDirect = localStorage.getItem('orange_daily_secret_cache');
    if (cacheDirect) {
      const parsed = JSON.parse(cacheDirect);
      if (parsed?.date && parsed.date !== todayKey()) {
        try { localStorage.removeItem('orange_daily_secret_cache'); } catch (_) {}
      } else {
        const validated = validateAndReconstruct(parsed?.data || parsed, parsed?.date, parsed?.updatedAt);
        if (validated) return validated;
      }
    }

    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key);
      if (!legacy) continue;
      const parsed = JSON.parse(legacy) as { date: string; data: Partial<DailySecretData> };
      if (parsed.date !== todayKey()) {
        try { localStorage.removeItem(key); } catch (_) {}
        continue;
      }
      if (parsed.data && parsed.data.affirmation && parsed.data.reflection && parsed.data.action) {
        const validated = validateAndReconstruct(parsed.data, parsed.date);
        if (validated) return validated;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function loadWish(): string {
  const appliedWish = localStorage.getItem(dayStorageKey('applied_wish'));
  if (appliedWish) return appliedWish;
  const directWish = localStorage.getItem(dayStorageKey('wish'));
  if (directWish) return directWish;
  const cached = loadCachedSecret();
  return cached?.appliedWish || '';
}

export function loadWishApplied(): boolean {
  try {
    if (localStorage.getItem(dayStorageKey('wish_applied')) === 'true') return true;
    if (Boolean(localStorage.getItem(dayStorageKey('applied_wish')))) return true;
    const cached = loadCachedSecret();
    return Boolean(cached?.appliedWish && cached.appliedWish.trim().length > 0);
  } catch {
    return false;
  }
}

function loadPractice(): Record<PracticeId, boolean> {
  try {
    const raw = localStorage.getItem(dayStorageKey('practice')) || sessionStorage.getItem(dayStorageKey('practice'));
    if (!raw) return {} as Record<PracticeId, boolean>;
    return JSON.parse(raw) as Record<PracticeId, boolean>;
  } catch {
    return {} as Record<PracticeId, boolean>;
  }
}

function savePractice(practiceData: Record<PracticeId, boolean>) {
  try {
    const serialized = JSON.stringify(practiceData);
    localStorage.setItem(dayStorageKey('practice'), serialized);
    sessionStorage.setItem(dayStorageKey('practice'), serialized);
  } catch {}
}

function loadGratitudeChecked(): boolean[] {
  try {
    const raw = localStorage.getItem(dayStorageKey('gratitude_checked'));
    if (!raw) return [false, false, false];
    const parsed = JSON.parse(raw) as boolean[];
    return [parsed[0] ?? false, parsed[1] ?? false, parsed[2] ?? false];
  } catch {
    return [false, false, false];
  }
}

function loadExtraGratitude(): string[] {
  try {
    const raw = localStorage.getItem(dayStorageKey('gratitude_extra'));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function loadScript(): string {
  return localStorage.getItem(dayStorageKey('script')) || '';
}

function playVisualizationAlarm() {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const now = context.currentTime;
    [0, 0.22, 0.44].forEach((offset, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = index === 1 ? 880 : 660;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.16, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.2);
    });
    window.setTimeout(() => void context.close(), 1000);
  } catch {
    // 일부 모바일 브라우저가 알람용 AudioContext 생성을 차단해도 완료 처리는 유지합니다.
  }
}

function VisualizationTimer({ guide, onComplete }: { guide: string; onComplete?: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(68);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [completionNotice, setCompletionNotice] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const onCompleteRef = useRef(onComplete);
  const ttsState = useTTSState();

  // 1. Proactively prefetch the first few chunks of the guide text in advance so audio begins with 0ms latency
  useEffect(() => {
    if (!guide) return;
    prefetchTTSChunks(guide, 'Kore', 110, '치유');
  }, [guide]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 2. Safely play TTS using chunked streaming and user-gesture audio unlocking
  const playVoice = useCallback(async () => {
    if (!guide) return;
    try {
      unlockAudioPlayback();
    } catch (_) {}
    try {
      stopTTS();
      await playTTSInChunks(guide, 'Kore', 110, '치유');
    } catch (err) {
      console.warn('[VisualizationTimer] playTTSInChunks error:', err);
    }
  }, [guide]);

  // 3. Countdown timer effect
  useEffect(() => {
    if (!running) return;

    if (secondsLeft <= 0) {
      setRunning(false);
      setDone(true);
      setCompletionNotice(true);
      stopTTS();
      playVisualizationAlarm();
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, secondsLeft]);

  // Clean up TTS when unmounting
  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, []);

  const start = () => {
    try {
      unlockAudioPlayback();
    } catch (_) {}
    setSecondsLeft(68);
    setDone(false);
    setCompletionNotice(false);
    setRunning(true);
    if (voiceEnabled) {
      playVoice();
    }
  };

  const reset = () => {
    stopTTS();
    setRunning(false);
    setDone(false);
    setCompletionNotice(false);
    setSecondsLeft(68);
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopTTS();
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(true);
      if (running) {
        playVoice();
      }
    }
  };

  const progress = ((68 - secondsLeft) / 68) * 100;
  const isAudioActive = ttsState.isSpeaking || ttsState.isLoading;

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5 space-y-4 shadow-lg shadow-amber-950/20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-amber-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400/80">
            68초 시각화 스튜디오
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* 음성 안내 On/Off 토글 버튼 */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-sans font-medium transition-all cursor-pointer ${
              voiceEnabled
                ? 'bg-amber-500/15 border-amber-500/35 text-amber-200 hover:bg-amber-500/25'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
            }`}
            title={voiceEnabled ? '음성 코칭 끄기' : '음성 코칭 켜기'}
          >
            {voiceEnabled ? (
              <>
                <Volume2 size={13} className="text-amber-400 shrink-0" />
                <span className="hidden sm:inline">음성 코칭 ON</span>
                <span className="sm:hidden">음성 ON</span>
              </>
            ) : (
              <>
                <VolumeX size={13} className="text-white/40 shrink-0" />
                <span className="hidden sm:inline">음성 안내 OFF</span>
                <span className="sm:hidden">음성 OFF</span>
              </>
            )}
          </button>

          <span className="text-[11px] font-mono font-bold text-amber-300/90 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25">
            {running || done ? `${secondsLeft}초` : '68초'}
          </span>
        </div>
      </div>

      <p className="text-sm text-white/85 leading-relaxed break-keep font-sans bg-black/30 p-4 rounded-xl border border-white/5">
        {guide}
      </p>

      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      {completionNotice && (
        <div role="status" aria-live="polite" className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100 shadow-lg shadow-emerald-950/20">
          <Check size={16} className="shrink-0 text-emerald-300" />
          68초 시각화가 완료되었습니다. 따뜻한 알림음과 함께 오늘의 마음을 잘 간직해 보세요.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {!running && !done && (
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={start}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/30 to-orange-500/30 hover:from-amber-500/40 hover:to-orange-500/40 border border-amber-500/40 text-amber-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950/30 active:scale-95 transition-all"
            >
              <Timer size={14} className="text-amber-300 animate-pulse" />
              <span>시각화 시작 {voiceEnabled ? '(음성 가이드)' : ''}</span>
            </button>
            <span className="text-[11px] text-amber-300/70 font-sans hidden sm:inline">
              {voiceEnabled ? '🎧 이어폰 권장 · 오감 몰입 음성 코칭' : '무음 집중 모드'}
            </span>
          </div>
        )}

        {running && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* 음성 상태 안내 배지 */}
            {voiceEnabled && (
              <>
                {ttsState.isLoading && (
                  <span className="px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-sans flex items-center gap-2">
                    <Loader2 size={13} className="animate-spin text-amber-400" />
                    <span>음성 연결 중...</span>
                  </span>
                )}
                {ttsState.isSpeaking && (
                  <span className="px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-200 text-xs font-sans flex items-center gap-2 animate-pulse">
                    <Volume2 size={14} className="text-amber-300 animate-bounce" />
                    <span>오감 몰입 명상 음성 낭독 중...</span>
                  </span>
                )}
                {!isAudioActive && (
                  <button
                    type="button"
                    onClick={playVoice}
                    className="px-3 py-2 rounded-xl border border-amber-500/40 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 text-xs font-sans flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
                  >
                    <Volume2 size={13} className="text-amber-300" />
                    <span>음성 다시 듣기</span>
                  </button>
                )}
              </>
            )}

            {!voiceEnabled && (
              <span className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-white/70 text-xs font-mono flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                눈을 감고 이미 이루어진 장면을 생생히 느껴 보세요...
              </span>
            )}

            <button
              type="button"
              onClick={reset}
              className="px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs cursor-pointer active:scale-95 transition-all"
            >
              중지 / 다시 시작
            </button>
          </div>
        )}

        {done && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <Check size={13} className="text-emerald-400" />
              시각화 완료 · 우주에 강력한 주파수가 전달되었습니다
            </span>
            <button
              type="button"
              onClick={reset}
              className="px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs cursor-pointer active:scale-95 transition-all"
            >
              다시 하기
            </button>
            <button
              type="button"
              onClick={playVoice}
              className="px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 text-xs font-sans flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Volume2 size={13} className="text-amber-300" />
              <span>가이드 다시 듣기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export interface TailoredWishCategory {
  id: string;
  name: string;
  icon: string;
}

export const TAILORED_WISH_CATEGORIES: TailoredWishCategory[] = [
  { id: 'smart', name: '스마트 맞춤', icon: '🌟' },
  { id: 'wealth', name: '풍요·재정', icon: '💰' },
  { id: 'career', name: '성공·커리어', icon: '🎯' },
  { id: 'love', name: '사랑·인연', icon: '💖' },
  { id: 'health', name: '건강·활력', icon: '🌿' },
  { id: 'growth', name: '평온·자존감', icon: '🕊️' },
];

export const TAILORED_WISH_EXAMPLES: Record<string, string[]> = {
  wealth: [
    '올해 목표한 재정적 성과 달성과 뜻밖의 풍요로운 금전 수입 유입',
    '안정적인 자산 증식과 여유롭고 당당한 경제적 자유 성취',
    '진행 중인 사업 및 프로젝트의 폭발적 성장과 끊임없는 우량 고객 유입',
    '원하는 연봉 협상 성공 및 파격적인 성과급 보너스 달성',
    '모든 채무와 빚을 깨끗이 청산하고 통장에 가득 차는 잉여 자산',
    '부동산 및 투자에서 최적의 타이밍에 큰 수익과 안전한 결실',
  ],
  career: [
    '원하던 꿈의 기업 및 직무 최종 합격과 눈부신 커리어 도약',
    '준비 중인 시험 및 국가 전문 자격증 최고 득점 합격',
    '추진 중인 핵심 프로젝트의 독보적인 대성공과 사내외 인정',
    '나만의 독창적인 창작물과 브랜딩이 세상에 널리 사랑받음',
    '창의적인 아이디어가 샘솟고 매 순간 빛나는 업무 효율과 리더십',
    '최고의 동료 및 멘토와 함께 성장하는 이상적인 직장 환경',
  ],
  love: [
    '서로 깊이 신뢰하고 아껴주는 운명적인 평생의 인연과의 만남',
    '소중한 사람과의 오해를 풀고 한층 더 깊어진 사랑과 화해',
    '나를 온전히 지지해주고 존중하는 건강하고 따뜻한 인간관계',
    '가족 모두가 건강하고 화목하게 서로를 보듬는 평화로운 가정',
    '매력과 호감을 끌어당기며 누구에게나 사랑받는 밝은 에너지',
    '결혼과 가정이 우주의 축복 속에서 행복과 안정을 누림',
  ],
  health: [
    '몸과 마음의 피로가 씻은 듯 사라지고 넘치는 활력과 에너지 회복',
    '밤마다 깊고 편안한 숙면을 취하고 아침마다 상쾌하게 기상',
    '불안과 긴장을 내려놓고 온전한 평온과 내면의 깊은 안정 유지',
    '나의 몸을 깊이 사랑하며 가장 건강하고 아름다운 신체 밸런스 회복',
    '오랜 통증과 불편함이 깨끗이 치유되고 가벼워진 심신',
    '면역력이 극대화되어 어떤 계절에도 지치지 않는 강인한 체력',
  ],
  growth: [
    '타인의 시선에서 벗어나 내 삶의 주권을 잡는 단단한 자존감',
    '매 순간 감사와 기쁨으로 가득 찬 충만하고 풍요로운 일상',
    '과거의 후회와 미래의 불안을 내려놓고 지금 여기에 현존함',
    '내 안의 무한한 끌어당김의 법칙을 완전히 신뢰하고 원하는 현실 실현',
    '어떤 시련 앞에서도 긍정적인 확신을 잃지 않는 단단한 내면의 힘',
    '내 안의 잠재력을 100% 꽃피우며 날마다 성장하는 위대한 나',
  ],
};

export function DailySecret() {
  const { sharedState, updateSharedState, openLucyChat, sendUnifiedMessage } = useApp();
  const [data, setData] = useState<DailySecretData | null>(() => loadCachedSecret());
  const justResetRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [wish, setWish] = useState(loadWish);
  const [wishApplied, setWishApplied] = useState(loadWishApplied);
  const [practice, setPractice] = useState<Record<PracticeId, boolean>>(loadPractice);
  const [gratitudeChecked, setGratitudeChecked] = useState(loadGratitudeChecked);
  const [extraGratitude, setExtraGratitude] = useState(loadExtraGratitude);
  const [newGratitude, setNewGratitude] = useState('');
  const [script, setScript] = useState(loadScript);
  const [scriptingTab, setScriptingTab] = useState<'write' | 'typing'>('typing');
  const [redrawSeed, setRedrawSeed] = useState(0);

  const [selectedWishCategory, setSelectedWishCategory] = useState<string>('smart');

  const smartProfileWishes = useMemo(() => {
    const profile = sharedState?.userProfile;
    const rawName = profile?.basic?.nickname || profile?.basic?.name;
    const name = (rawName && rawName !== '여행자') ? rawName : '제제';
    const list: { text: string; tag: string }[] = [];

    if (profile?.fate?.lifeGoal) {
      list.push({
        text: `인생 핵심 목표 "${profile.fate.lifeGoal}"의 기적 같은 완전 성취`,
        tag: '내 목표 연동',
      });
    }
    if (profile?.fate?.currentWorry) {
      list.push({
        text: `현재 고민 "${profile.fate.currentWorry}"의 평화롭고 조화로운 해결과 반전`,
        tag: '고민 해소 연동',
      });
    }
    if (profile?.psych?.mbti) {
      list.push({
        text: `${profile.psych.mbti} 기질의 독창적 강점을 극대화하여 나만의 분야에서 정상에 오름`,
        tag: 'MBTI 맞춤',
      });
    }
    list.push({
      text: `${name}의 삶에 상상 이상의 기적과 우주의 무한한 풍요가 매일 쏟아짐`,
      tag: '행운·기적',
    });
    list.push({
      text: `오늘 하루 온전한 평온과 뜻밖의 기분 좋은 행운의 선물 받기`,
      tag: '오늘의 평온',
    });
    list.push({
      text: `모든 불안을 내려놓고 우주의 무한한 지지와 사랑을 온몸으로 신뢰함`,
      tag: '신뢰·수용',
    });

    return list;
  }, [sharedState?.userProfile]);

  const handleResetWish = useCallback(() => {
    setWish('');
    setWishApplied(false);
    const today = todayKey();
    try {
      localStorage.removeItem(dayStorageKey('applied_wish'));
      localStorage.removeItem(dayStorageKey('wish'));
      localStorage.removeItem(dayStorageKey('wish_applied'));
      safeLocalStorage.removeItem(`orange_daily_secret_applied_wish_${today}`);
      safeLocalStorage.removeItem(`orange_daily_secret_wish_${today}`);
      safeLocalStorage.removeItem(`orange_daily_secret_wish_applied_${today}`);
    } catch (_) {}
  }, []);

  const handleResetToNewSecret = useCallback(() => {
    justResetRef.current = true;
    handleResetWish();
    setData(null);
    const today = todayKey();
    try {
      localStorage.removeItem(dayStorageKey('secret_received'));
      safeLocalStorage.removeItem(dayStorageKey('secret_received'));
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('orange_daily_secret_cache');
      localStorage.removeItem(`orange_daily_secret_${today}`);
      safeLocalStorage.removeItem(STORAGE_KEY);
      safeLocalStorage.removeItem('orange_daily_secret_cache');
      safeLocalStorage.removeItem(`orange_daily_secret_${today}`);
      safeLocalStorage.removeItem('orange_daily_secret_v2');
    } catch (_) {}

    try {
      if (sharedState?.dailySecrets?.[today]) {
        const nextDailySecrets = { ...(sharedState.dailySecrets || {}) };
        delete nextDailySecrets[today];
        void updateSharedState({
          dailySecrets: nextDailySecrets,
          lastOrangeDailySync: Date.now(),
        }, 'ORANGE');
      }
    } catch (_) {}
  }, [handleResetWish, sharedState, updateSharedState]);

  const cleanEveningPrompt = useMemo(() => {
    if (!data?.eveningPrompt || !/[가-힣]/.test(data.eveningPrompt)) {
      const rawNick = sharedState?.userProfile?.basic?.nickname || sharedState?.userProfile?.basic?.name;
      const nick = (rawNick && rawNick !== '여행자') ? rawNick : '제제';
      const fallback = generateTailoredSecretFallback(wish, nick);
      return fallback.eveningPrompt;
    }
    return data.eveningPrompt;
  }, [data?.eveningPrompt, wish, sharedState?.userProfile]);

  const fullDailySecretSpeech = useMemo(() => {
    if (!data) return '';
    const parts = [
      `오늘의 시크릿 확언. ${data.affirmation}`,
      `믿음으로 새기기. ${data.reflection}`,
      `오늘의 작은 실천. ${data.action}`,
    ];
    if (data.desire) parts.push(`오늘의 소원 선언. ${data.desire}`);
    if (data.feelingAnchor) parts.push(`이미 받은 느낌. ${data.feelingAnchor}`);
    if (data.mirrorPhrase) parts.push(`거울 확언. ${data.mirrorPhrase}`);
    if (cleanEveningPrompt) parts.push(`저녁 감사 마무리. ${cleanEveningPrompt}`);
    return parts.join(' ');
  }, [data, cleanEveningPrompt]);

  // Midnight Date rollover detection (auto-reset when clock hits 00:00)
  const [currentDateKey, setCurrentDateKey] = useState(todayKey());

  useEffect(() => {
    const checkDateRollover = () => {
      const nowKey = todayKey();
      if (nowKey !== currentDateKey) {
        console.log('[DailySecret] Midnight transition detected. Resetting to new day:', nowKey);
        setCurrentDateKey(nowKey);
        setData(null);
        setWish('');
        setWishApplied(false);
        setPractice({} as Record<PracticeId, boolean>);
        setGratitudeChecked([false, false, false]);
        setExtraGratitude([]);
        setScript('');
        try {
          localStorage.removeItem(dayStorageKey('secret_received'));
          safeLocalStorage.removeItem(dayStorageKey('secret_received'));
          // Clear today's cached secret kit and cache
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem('orange_daily_secret_cache');
          // Also clear any per-day wish persistence so custom wish resets at midnight
          try { localStorage.removeItem(dayStorageKey('applied_wish')); } catch (_) {}
          try { localStorage.removeItem(dayStorageKey('wish')); } catch (_) {}
          try { localStorage.removeItem(dayStorageKey('wish_applied')); } catch (_) {}
        } catch (_) {}      }
    };

    const interval = setInterval(checkDateRollover, 10000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkDateRollover();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', checkDateRollover);
    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', checkDateRollover);
    };
  }, [currentDateKey]);

  // Hydrate from sharedState when available (PC <-> Mobile sync) with timestamp protection
  useEffect(() => {
    if (justResetRef.current) return;
    const today = todayKey();
    const cloudSecret = sharedState?.dailySecrets?.[today];
    if (cloudSecret && typeof cloudSecret === 'object') {
      const cloudTs = Number((cloudSecret as any)?.updatedAt || (cloudSecret as any)?.timestamp || 0);
      const localTs = Number(data?.updatedAt || 0);

      // Guard: Never overwrite fresher local data with stale cloud snapshot
      if (data && localTs > 0 && cloudTs > 0 && localTs > cloudTs) {
        return;
      }

      const actualSecretData = (cloudSecret as any)?.data || cloudSecret;
      const hasActualSecret = Boolean(
        actualSecretData?.affirmation?.trim() || actualSecretData?.desire?.trim()
      );
      const isReceived = Boolean(
        actualSecretData?.isReceived ||
        actualSecretData?.appliedWish ||
        localStorage.getItem(dayStorageKey('secret_received')) === 'true'
      );
      if (!hasActualSecret || !isReceived) {
        return;
      }

      const rawName = sharedState?.userProfile?.basic?.nickname || sharedState?.userProfile?.basic?.name;
      const name = (rawName && rawName !== '여행자') ? rawName : '제제';
      const full = ensureFullKit(actualSecretData as Partial<DailySecretData>, wish, name);
      if (full) {
        setData(full);
        localStorage.setItem(dayStorageKey('secret_received'), 'true');
        safeLocalStorage.setItem(dayStorageKey('secret_received'), 'true');

        // Cloud snapshot had duplicate fields healed: re-persist to local storage
        if (
          actualSecretData?.action === actualSecretData?.desire ||
          actualSecretData?.action === actualSecretData?.feelingAnchor ||
          actualSecretData?.desire === actualSecretData?.feelingAnchor ||
          isSubstantiallyDuplicate(actualSecretData?.action, actualSecretData?.desire) ||
          isSubstantiallyDuplicate(actualSecretData?.action, actualSecretData?.feelingAnchor) ||
          isSubstantiallyDuplicate(actualSecretData?.desire, actualSecretData?.feelingAnchor)
        ) {
          try {
            const healedPayload = JSON.stringify({
              date: today,
              data: full,
              updatedAt: full.updatedAt || Date.now(),
              isReceived: true,
            });
            localStorage.setItem(STORAGE_KEY, healedPayload);
            localStorage.setItem(`orange_daily_secret_${today}`, healedPayload);
            localStorage.setItem('orange_daily_secret_cache', healedPayload);
            safeLocalStorage.setItem(STORAGE_KEY, healedPayload);
            safeLocalStorage.setItem(`orange_daily_secret_${today}`, healedPayload);
            safeLocalStorage.setItem('orange_daily_secret_cache', healedPayload);
          } catch (_) {}
        }
      }
      if (cloudSecret.appliedWish) {
        setWish(cloudSecret.appliedWish);
        setWishApplied(true);
      }
      if (cloudSecret.practice && typeof cloudSecret.practice === 'object') {
        setPractice((prev) => {
          const local = loadPractice();
          const merged: Record<PracticeId, boolean> = { ...local, ...prev };
          (Object.keys(cloudSecret.practice) as PracticeId[]).forEach((k) => {
            if (cloudSecret.practice[k]) {
              merged[k] = true;
            }
          });
          return merged;
        });
      }
      if (Array.isArray(cloudSecret.gratitudeChecked)) {
        setGratitudeChecked((prev) => {
          const local = loadGratitudeChecked();
          return [
            Boolean(local[0] || prev[0] || cloudSecret.gratitudeChecked[0]),
            Boolean(local[1] || prev[1] || cloudSecret.gratitudeChecked[1]),
            Boolean(local[2] || prev[2] || cloudSecret.gratitudeChecked[2]),
          ];
        });
      }
      if (Array.isArray(cloudSecret.extraGratitude) && cloudSecret.extraGratitude.length > 0) {
        setExtraGratitude((prev) => {
          const local = loadExtraGratitude();
          return Array.from(new Set([...local, ...prev, ...cloudSecret.extraGratitude]));
        });
      }
      if (cloudSecret.script) {
        setScript((prev) => prev || cloudSecret.script);
      }
    }
  }, [sharedState]);

  // 🛡️ 실시간 중복 자동 치유 (Receive, Ask, Feel이 동일하거나 중복된 경우 즉시 정상화 및 저장 동기화)
  useEffect(() => {
    if (!data) return;
    const isDuplicated =
      Boolean(data.action && data.desire && data.action === data.desire) ||
      Boolean(data.action && data.feelingAnchor && data.action === data.feelingAnchor) ||
      Boolean(data.desire && data.feelingAnchor && data.desire === data.feelingAnchor);

    if (isDuplicated) {
      const profile = sharedState?.userProfile;
      const rawName = profile?.basic?.nickname || profile?.basic?.name;
      const name = (rawName && rawName !== '여행자') ? rawName : '제제';
      const healed = ensureFullKit(data, wish, name);
      if (healed) {
        setData(healed);
        const secretPayload = JSON.stringify({
          date: todayKey(),
          data: healed,
          updatedAt: healed.updatedAt || Date.now(),
          isReceived: true,
        });
        try {
          localStorage.setItem(STORAGE_KEY, secretPayload);
          localStorage.setItem(`orange_daily_secret_${todayKey()}`, secretPayload);
          localStorage.setItem('orange_daily_secret_cache', secretPayload);
          safeLocalStorage.setItem(STORAGE_KEY, secretPayload);
          safeLocalStorage.setItem(`orange_daily_secret_${todayKey()}`, secretPayload);
          safeLocalStorage.setItem('orange_daily_secret_cache', secretPayload);
        } catch (_) {}
      }
    }
  }, [data, wish, sharedState?.userProfile]);

  useEffect(() => {
    const cached = loadCachedSecret();
    if (cached) {
      setData(cached);
      // Auto-heal persistence: If stored cache contained duplicate fields across Ask, Receive, Feel, overwrite with healed kit
      try {
        const rawJson = localStorage.getItem(STORAGE_KEY);
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          const rawD = parsed?.data || parsed;
          if (
            rawD &&
            (rawD.action === rawD.desire ||
              rawD.action === rawD.feelingAnchor ||
              rawD.desire === rawD.feelingAnchor ||
              isSubstantiallyDuplicate(rawD.action, rawD.desire) ||
              isSubstantiallyDuplicate(rawD.action, rawD.feelingAnchor) ||
              isSubstantiallyDuplicate(rawD.desire, rawD.feelingAnchor))
          ) {
            const healedPayload = JSON.stringify({
              date: todayKey(),
              data: cached,
              updatedAt: cached.updatedAt || Date.now(),
              isReceived: true,
            });
            localStorage.setItem(STORAGE_KEY, healedPayload);
            localStorage.setItem(`orange_daily_secret_${todayKey()}`, healedPayload);
            localStorage.setItem('orange_daily_secret_cache', healedPayload);
            safeLocalStorage.setItem(STORAGE_KEY, healedPayload);
            safeLocalStorage.setItem(`orange_daily_secret_${todayKey()}`, healedPayload);
            safeLocalStorage.setItem('orange_daily_secret_cache', healedPayload);
          }
        }
      } catch (_) {}
    }
    const loadedWish = loadWish();
    if (loadedWish) setWish(loadedWish);
    const isApplied = loadWishApplied();
    setWishApplied(isApplied);
    setPractice(loadPractice());
    setGratitudeChecked(loadGratitudeChecked());
    setExtraGratitude(loadExtraGratitude());
    setScript(loadScript());

    const handleSyncEvent = () => {
      if (justResetRef.current) return;
      const freshCached = loadCachedSecret();
      if (freshCached) {
        const freshTs = Number((freshCached as any)?.updatedAt || 0);
        const currentTs = Number(data?.updatedAt || 0);
        if (!data || freshTs >= currentTs) {
          setData(freshCached);
          if (freshCached.appliedWish) {
            setWish(freshCached.appliedWish);
            setWishApplied(true);
          }
        }
      }
      const freshPractice = loadPractice();
      if (Object.keys(freshPractice).length > 0) {
        setPractice((prev) => ({ ...freshPractice, ...prev }));
      }
      const freshGratitude = loadGratitudeChecked();
      setGratitudeChecked((prev) => [
        Boolean(prev[0] || freshGratitude[0]),
        Boolean(prev[1] || freshGratitude[1]),
        Boolean(prev[2] || freshGratitude[2]),
      ]);
      const freshExtra = loadExtraGratitude();
      if (freshExtra.length > 0) {
        setExtraGratitude((prev) => Array.from(new Set([...prev, ...freshExtra])));
      }
      const freshScript = loadScript();
      if (freshScript) {
        setScript((prev) => (prev ? prev : freshScript));
      }
    };
    window.addEventListener('prism:feature_updated', handleSyncEvent);
    window.addEventListener('prism:daily_oracle_updated', handleSyncEvent);
    window.addEventListener('prism:orange_secret_updated', handleSyncEvent);
    window.addEventListener('prism:full_state_synced', handleSyncEvent);
    window.addEventListener('storage', handleSyncEvent);
    return () => {
      window.removeEventListener('prism:feature_updated', handleSyncEvent);
      window.removeEventListener('prism:daily_oracle_updated', handleSyncEvent);
      window.removeEventListener('prism:orange_secret_updated', handleSyncEvent);
      window.removeEventListener('prism:full_state_synced', handleSyncEvent);
      window.removeEventListener('storage', handleSyncEvent);
    };
  }, []);

  const syncDailyProgress = useCallback((
    newPractice: Record<PracticeId, boolean>,
    newGratitudeChecked: boolean[],
    newExtraGratitude: string[],
    newScript: string,
  ) => {
    // If the user has NOT received today's secret yet, DO NOT push a dummy dailySecret to cloud
    if (!data) return;
    const today = todayKey();
    try {
      localStorage.setItem(dayStorageKey('practice'), JSON.stringify(newPractice));
      localStorage.setItem(dayStorageKey('gratitude_checked'), JSON.stringify(newGratitudeChecked));
      localStorage.setItem(dayStorageKey('gratitude_extra'), JSON.stringify(newExtraGratitude));
      localStorage.setItem(dayStorageKey('script'), newScript);
    } catch {}

    try {
      void updateSharedState({
        dailySecrets: {
          ...(sharedState?.dailySecrets || {}),
          [today]: {
            ...(sharedState?.dailySecrets?.[today] || data || {}),
            practice: newPractice,
            gratitudeChecked: newGratitudeChecked,
            extraGratitude: newExtraGratitude,
            script: newScript,
            updatedAt: Date.now(),
          },
        },
        lastOrangeDailySync: Date.now(),
      }, 'ORANGE');
    } catch {}
  }, [sharedState, data, updateSharedState]);

  useEffect(() => {
    if (wish) {
      localStorage.setItem(dayStorageKey('wish'), wish);
    }
  }, [wish]);

  useEffect(() => {
    localStorage.setItem(dayStorageKey('practice'), JSON.stringify(practice));
  }, [practice]);

  useEffect(() => {
    localStorage.setItem(dayStorageKey('gratitude_checked'), JSON.stringify(gratitudeChecked));
  }, [gratitudeChecked]);

  useEffect(() => {
    localStorage.setItem(dayStorageKey('gratitude_extra'), JSON.stringify(extraGratitude));
  }, [extraGratitude]);

  useEffect(() => {
    localStorage.setItem(dayStorageKey('script'), script);
  }, [script]);

  // Debounced cloud synchronization when progress is modified
  const syncTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    if (!data) return; // Do not auto-sync progress before a secret is actually received
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = window.setTimeout(() => {
      syncDailyProgress(practice, gratitudeChecked, extraGratitude, script);
    }, 700);
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [data, practice, gratitudeChecked, extraGratitude, script, syncDailyProgress]);

  const practiceCount = useMemo(
    () => PRACTICE_ITEMS.filter((item) => practice[item.id]).length,
    [practice],
  );

  const buildPromptContext = useCallback(() => {
    const userProfileStr = sharedState?.userProfile
      ? JSON.stringify(sharedState.userProfile)
      : '프로필 없음';
    const memory = sharedState?.orangeMemory || sharedState?.globalMemory || '최근 기록 없음';
    const rawName =
      sharedState?.userProfile?.basic?.nickname ||
      sharedState?.userProfile?.basic?.name;
    const name = (rawName && rawName !== '여행자') ? rawName : '제제';
    return { userProfileStr, memory, name };
  }, [sharedState]);

  const receiveSecret = useCallback(async (options?: { force?: boolean; redraw?: boolean; targetWish?: string }) => {
    justResetRef.current = false;

    const activeSeed = options?.redraw ? redrawSeed + 1 : redrawSeed;
    if (options?.redraw) {
      setRedrawSeed(activeSeed);
    }

    const { userProfileStr, memory, name } = buildPromptContext();
    const effectiveWish = (options?.targetWish !== undefined ? options.targetWish : wish).trim();
    const hasWish = Boolean(effectiveWish);

    if (options?.targetWish !== undefined && options.targetWish !== wish) {
      setWish(options.targetWish);
    }

    setLoading(true);
    setIsAiEnhancing(true);

    const now = Date.now();
    // ⚡ 1. 맞춤 시크릿 키트 고밀도 문맥 정제 (Instant & Resilient Kit)
    const instantKit = generateTailoredSecretFallback(effectiveWish, name, activeSeed);
    const initialData: DailySecretData = {
      ...instantKit,
      appliedWish: hasWish ? effectiveWish : undefined,
      updatedAt: now,
      isReceived: true,
    };

    const persistSecret = (secretData: DailySecretData) => {
      setData(secretData);
      localStorage.setItem(dayStorageKey('secret_received'), 'true');
      safeLocalStorage.setItem(dayStorageKey('secret_received'), 'true');

      if (hasWish) {
        localStorage.setItem(dayStorageKey('wish_applied'), 'true');
        localStorage.setItem(dayStorageKey('applied_wish'), effectiveWish);
        localStorage.setItem(dayStorageKey('wish'), effectiveWish);
        safeLocalStorage.setItem(`orange_daily_secret_applied_wish_${todayKey()}`, effectiveWish);
        safeLocalStorage.setItem(`orange_daily_secret_wish_${todayKey()}`, effectiveWish);
        safeLocalStorage.setItem(`orange_daily_secret_wish_applied_${todayKey()}`, 'true');
        setWish(effectiveWish);
        setWishApplied(true);
      } else {
        localStorage.removeItem(dayStorageKey('applied_wish'));
        localStorage.removeItem(dayStorageKey('wish_applied'));
        safeLocalStorage.removeItem(`orange_daily_secret_applied_wish_${todayKey()}`);
        safeLocalStorage.removeItem(`orange_daily_secret_wish_applied_${todayKey()}`);
        setWishApplied(false);
      }

      const secretPayload = JSON.stringify({
        date: todayKey(),
        data: secretData,
        updatedAt: secretData.updatedAt || Date.now(),
        isReceived: true,
      });
      localStorage.setItem(STORAGE_KEY, secretPayload);
      localStorage.setItem(`orange_daily_secret_${todayKey()}`, secretPayload);
      localStorage.setItem('orange_daily_secret_cache', secretPayload);
      safeLocalStorage.setItem(STORAGE_KEY, secretPayload);
      safeLocalStorage.setItem(`orange_daily_secret_${todayKey()}`, secretPayload);
      safeLocalStorage.setItem('orange_daily_secret_cache', secretPayload);

      // Cross-device sync
      try {
        const today = todayKey();
        void updateSharedState({
          dailySecrets: {
            ...(sharedState?.dailySecrets || {}),
            [today]: {
              ...secretData,
              appliedWish: hasWish ? effectiveWish : undefined,
              updatedAt: secretData.updatedAt || Date.now(),
              timestamp: secretData.updatedAt || Date.now(),
              practice,
              gratitudeChecked,
              extraGratitude,
              script: script || (secretData.scriptingStarter ? `${secretData.scriptingStarter}\n\n` : ''),
            },
          },
          lastOrangeDailySync: Date.now(),
        }, 'ORANGE');
      } catch (_) {}

      recordPrismFeature({
        app: 'orange',
        featureName: '시크릿(The Secret) 확언 키트',
        summary: `확언: "${secretData.affirmation}", 요청(Ask): "${secretData.desire}"${hasWish ? ` (소원: "${effectiveWish}")` : ''}`,
        details: secretData,
      });

      if (secretData.scriptingStarter && !script.trim()) {
        setScript(`${secretData.scriptingStarter}\n\n`);
      }
    };

    // If data already exists or no custom wish, show initial immediately
    if (data || !hasWish) {
      persistSecret(initialData);
      setLoading(false);
    }

    // 🌟 2. AI 심화 직조 (맞춤 소원의 정확한 인과 맥락과 주어 100% 반영)
    try {
      const randomCosmicThemes = [
        '우주의 무한한 풍요와 부의 유입',
        '깊고 단단한 내면의 평온과 절대적 자유',
        '놀라운 기적과 뜻밖의 축복',
        '원하는 모든 목표와 시험의 당당한 성취',
        '세포와 신경의 눈부신 활력과 완전한 치유',
        '가장 아름답고 진실한 사랑과 인연의 연결',
      ];
      const todayTheme = randomCosmicThemes[Math.abs(Date.now() + activeSeed) % randomCosmicThemes.length];

      const systemPrompt = [
        '당신은 론다 번(Rhonda Byrne)의 『시크릿(The Secret)』— 끌어당김의 법칙을 바탕으로 오늘의 시크릿 키트를 만드는 ORANGE 영적 가이드입니다.',
        '핵심 원리: Ask(명확한 요청) → Believe(흔들림 없는 믿음) → Receive(이미 받은 것처럼 느끼고 수용).',
        '생각과 감정의 주파수가 실제 현실을 강력하게 끌어당깁니다.',
        '',
        '★★★ [절대 필수: 맞춤소원 맥락 100% 정밀 반영 & 앞뒤 문맥 일치 규칙] ★★★',
        '1. 사용자가 소원을 입력한 경우, 소원에 담긴 구체적 대상(시험 과목/이름, 회사/직무, 가족/인물 관계, 질병/신체 부위, 금액/매출 등)을 반드시 확언의 핵심 주어로 정확하게 반영하십시오.',
        '2. [주어 및 시점의 완벽한 일치] 소원의 주어가 본인이 아닌 가족/타인(예: "엄마 무릎 수술 잘 끝나게", "우리 아들 대학 합격")인 경우, 억지로 "나는 ~했다"로 시작하여 문맥을 왜곡하지 마십시오. "사랑하는 어머니의 무릎 수술이 가장 안전하고 완벽하게 마무리되어...", "대견한 우리 아들이 원하던 대학에 당당히 합격하여..." 처럼 해당 인물의 성취와 회복을 주어로 온전히 살리고, 그로 인해 가족과 내가 느끼는 벅찬 안도와 기쁨을 뒤이어 자연스럽게 서술하십시오.',
        '3. [인과 관계와 앞뒤 맥락의 절대 일치] 확언의 앞 문장(소망했던 구체적 상황이 이미 완벽히 실현된 상태)과 뒤 문장(그로 인해 누리는 벅찬 감격, 평온, 자부심, 감사)이 원인-결과의 복문으로 물 흐르듯 자연스럽게 이어져야 합니다. (예: 시험 합격 소원인데 엉뚱하게 재물/부자 이야기를 하거나, 건강 소원인데 사업 이야기를 섞는 맥락 불일치 절대 금지).',
        '4. [기계적 어미 절대 금지] 따옴표로 소원 문장을 붙이거나(예: "소원"의 결실을...), "~하게 해주세요", "~으면 좋겠어요" 등의 간청형 어미를 그대로 복사하지 말고, 품격 있는 완료형 문장으로 재구성하십시오.',
        '5. affirmation(확언): 소원의 간절한 바람이 마침내 이루어진 바로 그 순간의 전율과 안도가 생생히 느껴지는 완성형 선언문 1~2문장입니다.',
        '6. reflection: 해당 소망을 품었을 때 찾아오는 특유의 불안과 조급함을 달래고, 우주의 순리를 신뢰하도록 이끄는 깊은 철학적 사색 2~3문장입니다. (affirmation과 절대 중복 금지).',
        '7. action: [Receive · 오늘의 작은 실천] 소원을 이미 이룬 사람으로서 오늘 당장 몸과 행동으로 실행하는 구체적인 작은 일상 실천 1문장입니다. (예: "오늘 하루 가벼운 발걸음으로 산책하며 주변 사람들에게 온화한 미소 건네기", "책상 위를 정돈하며 이미 성공한 사람의 여유 만끽하기" 등. desire나 feelingAnchor와 결코 같은 문장을 쓰지 마십시오).',
        '8. desire: [Ask · 오늘의 소원 선언] 우주를 향해 맑고 간결하게 올리는 1인칭 소원 청원문 1문장입니다. (예: "우주여, 나의 삶에 가장 아름다운 번영과 기회의 문을 활짝 열어주옵소서." action이나 feelingAnchor와 결코 같은 문장을 쓰지 마십시오).',
        '9. visualizationGuide: [68초 시각화 스튜디오용 1분 분량 명상 가이드] 음성 낭독(TTS) 시 실제로 약 1분(60초 전후) 동안 차분하고 깊은 몰입이 유지되도록, 한국어 공백 포함 약 350~450자 분량으로 작성하십시오. (호흡 이완 유도 -> 소원이 이루어진 구체적 순간의 시각/청각/촉각/온기 묘사 -> 안도감과 환희의 감정 절정 -> 심장 중심 주파수 각인 마무리).',
        '10. feelingAnchor: [Feel · 이미 받은 느낌] 소원이 완벽히 이루어진 바로 그 순간 가슴 깊이 차오르는 생생한 감각과 전율의 1줄 감정 닻입니다. (예: "가슴 깊은 곳에서 차오르는 벅찬 안도감과 충만한 기쁨", "심장이 쿵쾅거리며 눈가에 맺히는 감격의 환희". action이나 desire와 결코 같은 문장을 쓰지 마십시오).',
        '11. mirrorPhrase: 거울 속 자신과 눈을 맞추며 가슴을 울리는 진실된 선언 1문장입니다.',
        '12. eveningPrompt: 하루를 평온히 닫고 우주의 은혜에 몸을 맡기는 저녁 감사 1문장입니다.',
        '13. scriptingStarter: 마침내 기적이 일어난 오늘 하루를 감사함으로 기록하는 일기 첫 문장입니다.',
        '14. gratitudeSeeds: 소원 성취의 주파수를 여는 서로 다른 3가지의 구체적 감사 문장입니다.',
        '15. [언어 절대 준수] 모든 문장은 반드시 100% 품격 있는 한국어로만 작성해야 합니다.',
        '16. [고민/불안의 연금술적 성취 승화] 사용자가 고민이나 불안, 결핍(예: "취업이 안 돼서 걱정돼요", "빚 때문에 힘들어요", "시험에 떨어질까봐 무서워요")을 적었더라도, 결코 고민에 머무르거나 부정적 표현을 쓰지 마십시오. 론다 번의 끌어당김의 법칙(The Secret)에 따라, 그 고민이 완벽하게 해결되고 소망이 눈부시게 성취된 상태(예: 최고의 일터에 당당히 합격함, 모든 부채가 청산되고 풍요로워짐, 시험에 고득점으로 합격함)로 100% 승화시켜 기쁨과 감사의 주파수로 작성하십시오.',
        '17. [★★★ Ask(desire) · Receive(action) · Feel(feelingAnchor) 3대 기둥 상호 중복 절대 엄금 ★★★]',
        '   - desire: 우주를 향해 올리는 품격 있는 청원문 1문장 (예: "우주여, ...의 소망이 가장 지혜롭고 아름다운 방식으로 피어나게 하옵소서")',
        '   - action: 이미 소망을 이룬 사람처럼 오늘 당장 몸으로 실행할 수 있는 일상/신체 행동 1문장 (예: "오늘 하루 가벼운 발걸음으로 산책하며 주변에 미소 짓기")',
        '   - feelingAnchor: 소원이 이미 이루어졌을 때 가슴 깊은 곳에서 차오르는 벅찬 기쁨과 안도감의 감정 닻 1문장 (예: "...할 때 가슴 가득 차오르는 벅찬 안도감과 충만한 환희")',
        '   - [경고]: desire, action, feelingAnchor 및 affirmation, reflection은 서로 문장 구조, 어미, 의미가 완전히 달라야 하며, 절대 서로의 문장을 복사하거나 같게 작성하지 마십시오.',
        '',
        hasWish
          ? [
              `[사용자 입력 원문]: "${effectiveWish}"`,
              `[연금술적 성취 승화 소원]: "${transmuteWorryOrWish(effectiveWish)}"`,
              `위 소원(승화된 성취 목표)의 구체적 정황, 인물, 목표를 깊이 분석하여, affirmation부터 gratitudeSeeds까지 9개 항목 전체가 오직 이 소원의 완벽한 성취에 100% 집중되도록 작성하세요. 앞뒤 맥락이 완벽하게 일치해야 합니다.`,
            ].join('\n')
          : `사용자가 별도의 소원을 적지 않았으므로, 오늘의 특별한 영적 테마 [${todayTheme}]를 중심으로 풍요, 평온, 성공, 사랑, 건강을 강력하게 끌어당기는 조화롭고 독창적인 시크릿 키트를 작성하세요.`,
        '',
        `[프로필: ${userProfileStr}]`,
        `[최근 기록/맥락: ${memory}]`,
      ].filter(Boolean).join('\n');

      const transmutedTargetWish = hasWish ? transmuteWorryOrWish(effectiveWish) : '';
      const userPrompt = hasWish
        ? `[사용자 입력 원문: "${effectiveWish}"]\n[연금술적 성취 승화 소원: "${transmutedTargetWish}"]\n[성명/닉네임: ${name}]\n[무작위 시드: ${Date.now()}-${activeSeed}]\n\n사용자가 고민이나 불안을 적었더라도, 결코 걱정이나 결핍의 상태를 반영하지 말고 위 승화 성취 소원("${transmutedTargetWish}")처럼 마침내 완벽히 이루어지고 해결된 눈부신 결실의 상태로 100% 반영하여 감동적인 시크릿 키트를 직조해 주세요.\n\n특히 확언(affirmation)은 핵심 인물과 목표가 눈앞에서 완벽하게 이루어진 기적의 순간을 생생하게 담아내야 합니다. 앞 절의 성취 내용과 뒷 절의 벅찬 감격/평온이 물 흐르듯 자연스럽게 이어지도록 최고의 문장력으로 직조해 주십시오.`
        : `[오늘의 영적 테마: ${todayTheme}]\n[무작위 시드: ${Date.now()}-${activeSeed}]\n${name}님을 위한 오늘만의 독창적이고 가슴 벅찬 시크릿 키트를 주세요. 이전에 자주 나온 진부하거나 똑같은 문구를 완전히 피하고, 마음속 고민을 녹이고 풍요와 평온을 여는 품격 있는 새로운 맞춤 확언과 도구들을 작성해 주세요.`;

      const aiPromise = invokeLLMStructured({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        schema: DailySecretSchema,
      });

      // 맞춤소원 신규 개방 시에는 AI 응답을 최대 3.5초 대기하여 최상의 AI 생성 키트를 우선 노출
      const waitTimeout = !data && hasWish ? 3500 : 15000;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI wait timeout')), waitTimeout)
      );

      let aiResult: DailySecretData | null = null;
      try {
        aiResult = await Promise.race([aiPromise, timeoutPromise]);
      } catch (raceErr) {
        // First wait timeout occurred: open initial data immediately if not opened yet
        if (!data) {
          persistSecret(initialData);
          setLoading(false);
        }
        // Then continue awaiting background AI if still pending
        aiResult = await aiPromise.catch(() => null);
      }

      if (
        aiResult &&
        aiResult.affirmation &&
        !aiResult.affirmation.includes('고요한 파동') &&
        !aiResult.affirmation.includes('심신을 정렬')
      ) {
        const enriched = ensureFullKit(aiResult, effectiveWish, name, activeSeed);
        if (enriched) {
          const enrichedFinal: DailySecretData = {
            ...enriched,
            appliedWish: hasWish ? effectiveWish : undefined,
            updatedAt: Date.now(),
            isReceived: true,
          };
          persistSecret(enrichedFinal);
          try {
            playAiResultNotification();
          } catch (_) {}
        }
      } else if (!data) {
        persistSecret(initialData);
      }
    } catch (_) {
      if (!data) {
        persistSecret(initialData);
      }
    } finally {
      setLoading(false);
      setIsAiEnhancing(false);
    }
  }, [buildPromptContext, data, extraGratitude, gratitudeChecked, practice, redrawSeed, script, sharedState, updateSharedState, wish]);

  const handleSelectWishExample = useCallback((text: string, immediateOpen = false) => {
    setWish(text);
    if (immediateOpen) {
      void receiveSecret({ force: true, targetWish: text });
    }
  }, [receiveSecret]);

  const handleRandomWish = useCallback((immediateOpen = false) => {
    const allLists: string[] = [
      ...smartProfileWishes.map((w) => w.text),
      ...Object.values(TAILORED_WISH_EXAMPLES).flat(),
    ];
    if (allLists.length === 0) return;
    const pick = allLists[Math.floor(Math.random() * allLists.length)];
    setWish(pick);
    if (immediateOpen) {
      void receiveSecret({ force: true, targetWish: pick });
    }
  }, [receiveSecret, smartProfileWishes]);

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const markPracticeItem = useCallback((id: PracticeId) => {
    setPractice((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      setTimeout(() => {
        syncDailyProgress(next, gratitudeChecked, extraGratitude, script);
      }, 0);
      return next;
    });
  }, [gratitudeChecked, extraGratitude, script, syncDailyProgress]);

  const togglePractice = useCallback((id: PracticeId) => {
    setPractice((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      setTimeout(() => {
        syncDailyProgress(next, gratitudeChecked, extraGratitude, script);
      }, 0);
      return next;
    });
  }, [gratitudeChecked, extraGratitude, script, syncDailyProgress]);

  const toggleGratitude = useCallback((index: number) => {
    setGratitudeChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      setTimeout(() => {
        syncDailyProgress(practice, next, extraGratitude, script);
      }, 0);
      return next;
    });
  }, [practice, extraGratitude, script, syncDailyProgress]);

  const addGratitude = useCallback(() => {
    const trimmed = newGratitude.trim();
    if (!trimmed) return;
    setExtraGratitude((prev) => {
      const next = [...prev, trimmed].slice(0, 5);
      setTimeout(() => {
        syncDailyProgress(practice, gratitudeChecked, next, script);
      }, 0);
      return next;
    });
    setNewGratitude('');
  }, [newGratitude, practice, gratitudeChecked, script, syncDailyProgress]);

  return (
    <div className="space-y-6 sm:space-y-10 text-left w-full min-w-0">
      <div className="text-center space-y-3 sm:space-y-4 px-1">
        <span className="text-[9px] sm:text-[10px] text-amber-400 font-extrabold uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono block">
          DAILY
        </span>
        <h3 className="text-2xl sm:text-4xl md:text-5xl font-display text-white tracking-tighter break-words">
          오늘의 시크릿
        </h3>
        <p className="text-[11px] md:text-xs text-white/50 max-w-2xl mx-auto leading-relaxed px-1 sm:px-0">
          론다 번의 『시크릿』— 끌어당김의 법칙을 실천하는 확언, 시각화, 감사, 스크립팅 도구를 한곳에서 만나보세요.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
          {['Ask · 원함', 'Believe · 믿음', 'Receive · 받음'].map((step) => (
            <span
              key={step}
              className="text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-300/90"
            >
              {step}
            </span>
          ))}
        </div>

        </div>

      {!data && (
        <div className="w-full max-w-3xl mx-auto rounded-2xl border border-amber-500/25 bg-gradient-to-b from-amber-500/[0.06] via-amber-500/[0.02] to-transparent p-4 sm:p-6 space-y-4 shadow-xl shadow-amber-950/20">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 block flex items-center gap-1.5 font-mono">
              <Sparkles size={13} className="text-amber-400 animate-pulse" />
              Ask · 오늘 우주에 보낼 맞춤 소원
            </label>
            <span className="text-[10px] text-amber-300/80 font-mono">
              소원을 선택하거나 적고 버튼을 누르면 100% 맞춤 키트가 생성됩니다
            </span>
          </div>

          {/* 🌟 맞춤 소원 예시 카테고리 탭 및 선택 칩 (키트 생성 전 노출) */}
          <div className="space-y-2.5 pt-0.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-amber-300/90 font-sans flex items-center gap-1">
                <Sparkles size={12} className="text-amber-400" />
                원클릭 맞춤 소원 예시
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRandomWish(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer hover:border-amber-400/40 active:scale-95"
                  title="랜덤 소원을 추천받고 즉시 키트를 엽니다"
                >
                  <Shuffle size={11} className="text-amber-400" />
                  <span>랜덤 추천 즉시 열기</span>
                </button>
                {wish.trim() && (
                  <button
                    type="button"
                    onClick={handleResetWish}
                    className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-200 text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                    title="입력 소원 지우기 및 초기화"
                  >
                    <X size={11} />
                    <span>소원 초기화</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              {TAILORED_WISH_CATEGORIES.map((cat) => {
                const isActive = selectedWishCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedWishCategory(cat.id)}
                    className={`shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                        : 'bg-white/5 text-white/50 border border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Examples grid / chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {selectedWishCategory === 'smart' ? (
                smartProfileWishes.map((item, idx) => {
                  const isSelected = wish.trim() === item.text.trim();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectWishExample(item.text, true)}
                      className={`text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 border active:scale-[0.98] ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-100 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.25)] font-bold'
                          : 'bg-black/30 hover:bg-amber-500/10 text-white/80 hover:text-white border-white/10 hover:border-amber-500/30'
                      }`}
                      title="이 소원으로 즉시 시크릿 키트를 엽니다"
                    >
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono shrink-0">
                        {item.tag}
                      </span>
                      <span className="break-keep break-words flex-1 min-w-0 text-left">{item.text}</span>
                      <span className="text-[10px] text-amber-300/80 shrink-0 ml-auto flex items-center gap-1 font-sans font-medium">
                        <Sparkles size={11} className="text-amber-400" />
                        즉시 열기
                      </span>
                    </button>
                  );
                })
              ) : (
                (TAILORED_WISH_EXAMPLES[selectedWishCategory] || []).map((ex, idx) => {
                  const isSelected = wish.trim() === ex.trim();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectWishExample(ex, true)}
                      className={`text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 border active:scale-[0.98] ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-100 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.25)] font-bold'
                          : 'bg-black/30 hover:bg-amber-500/10 text-white/80 hover:text-white border-white/10 hover:border-amber-500/30'
                      }`}
                      title="이 소원으로 즉시 시크릿 키트를 엽니다"
                    >
                      <Sparkles size={11} className={isSelected ? 'text-amber-400 shrink-0' : 'text-amber-400/40 shrink-0'} />
                      <span className="break-keep break-words flex-1 min-w-0 text-left">{ex}</span>
                      <span className="text-[10px] text-amber-300/80 shrink-0 ml-auto flex items-center gap-1 font-sans font-medium">
                        <Sparkles size={11} className="text-amber-400" />
                        즉시 열기
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="소원이나 마음에 걸리는 고민·불안을 자유롭게 적어 보세요. 고민을 적으셔도 론다 번의 끌어당김 법칙에 따라 긍정적인 성취 소원 형태로 자연스럽게 승화되어 맞춤 키트가 완성됩니다. (예: 취업이 안 돼서 불안해요 / 빚 때문에 걱정돼요 / 원하는 시험 합격...)"
              rows={2}
              className="w-full rounded-xl border border-white/15 bg-black/40 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 px-4 py-3 text-sm transition-colors shadow-inner resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="space-y-0.5">
              <p className="text-[11px] text-amber-200/80 font-sans">
                ✨ 소원이나 고민을 적으시면 긍정적인 성취의 주파수로 승화되어 확언, 68초 시각화, 스크립팅, 실천 과제가 100% 맞춤 생성됩니다.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                disabled={loading}
                onClick={() => void receiveSecret({ force: true, targetWish: wish })}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/25 to-orange-500/25 hover:from-amber-500/35 hover:to-orange-500/35 border border-amber-500/40 text-amber-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-950/40 active:scale-95 disabled:opacity-60"
              >
                <Sparkles size={13} className={loading ? 'text-amber-400 animate-spin' : 'text-amber-400'} />
                <span>
                  {loading
                    ? '맞춤 키트 직조 중...'
                    : wish.trim()
                    ? '소원 맞춤 키트 받기'
                    : '오늘의 시크릿 키트 받기'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!data ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mx-auto"
        >
          <button
            type="button"
            disabled={loading}
            onClick={() => void receiveSecret({ force: true, targetWish: wish })}
            className="w-full group relative overflow-hidden rounded-[28px] border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-white/5 to-orange-500/10 p-8 sm:p-10 text-center shadow-2xl shadow-amber-500/10 transition-all hover:border-amber-400/50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:cursor-wait"
          >
            <div className="absolute inset-0 bg-amber-500/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.25)]">
                {loading ? (
                  <Sparkles size={28} className="text-amber-400 animate-spin" />
                ) : (
                  <KeyRound size={28} className="text-amber-400 animate-pulse" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {loading
                    ? wish.trim()
                      ? '소원 맞춤 시크릿 키트 직조 중...'
                      : '오늘의 시크릿 키트 수신 중...'
                    : wish.trim()
                    ? '소원 맞춤 시크릿 키트 받기'
                    : '오늘의 시크릿 키트 받기'}
                </p>
                <p className="text-[10px] sm:text-xs text-white/40 font-sans break-keep">
                  {loading
                    ? '소원의 앞뒤 맥락을 완벽히 일치시킨 기적의 확언을 준비하고 있습니다'
                    : wish.trim()
                    ? `"${wish.trim()}" 맞춤형 확언 + 시각화 + 감사 + 실천`
                    : '확언 + 68초 시각화 + 감사 + 실천 도구'}
                </p>
              </div>
            </div>
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl mx-auto space-y-5"
        >
          <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-amber-500/25 bg-gradient-to-br from-amber-950/40 via-zinc-950/80 to-orange-950/30 p-4 sm:p-8 md:p-10 shadow-2xl">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative z-10 space-y-6 text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400/80">
                  <Sparkles size={12} />
                  <span>Today&apos;s Secret Affirmation</span>
                  <Sparkles size={12} />
                </div>
                {data.appliedWish && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs mt-1 max-w-full">
                    <Sparkles size={11} className="text-amber-400 shrink-0" />
                    <span className="font-medium break-keep break-words text-left">맞춤 소원: &ldquo;{data.appliedWish}&rdquo;</span>
                    <button
                      type="button"
                      onClick={handleResetToNewSecret}
                      className="ml-1 px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white text-[10px] font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1 shrink-0"
                      title="맞춤 소원을 초기화하고 새로운 시크릿 키트를 받습니다"
                    >
                      <X size={10} />
                      <span>소원 초기화</span>
                    </button>
                  </div>
                )}
                {isAiEnhancing && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[11px] mt-1 shadow-lg shadow-amber-950/30 animate-pulse">
                    <Sparkles size={11} className="text-amber-400 animate-spin" />
                    <span>끌어당김 AI가 당신의 소원에 맞춘 깊은 확언과 도구를 정밀 조율 중입니다...</span>
                  </div>
                )}
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-serif text-white/95 leading-relaxed break-keep font-medium">
                &ldquo;{data.affirmation}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                <TTSButton
                  text={data.affirmation}
                  voice="Kore"
                  className="text-amber-300 border-amber-500/20 text-xs py-2 px-4"
                  onPlay={() => markPracticeItem('affirmation')}
                />
                <button
                  type="button"
                  onClick={() => {
                    void copyText(data.affirmation, 'affirmation');
                    markPracticeItem('affirmation');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  {copied === 'affirmation' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied === 'affirmation' ? '복사됨' : '복사'}
                </button>
                <button
                  type="button"
                  onClick={() => void receiveSecret({ force: true, redraw: true })}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/25 hover:from-amber-500/35 hover:to-orange-500/30 text-[10px] font-bold uppercase tracking-wider text-amber-200 hover:text-white transition-all cursor-pointer active:scale-95 shadow-md shadow-amber-950/30 disabled:opacity-50"
                  title="다른 시크릿 확언과 키트를 새로 뽑습니다"
                >
                  <Shuffle size={13} className={loading ? 'animate-spin text-amber-300' : 'text-amber-400'} />
                  <span>{loading ? '새 확언 수신 중...' : '다른 확언 뽑기'}</span>
                </button>
                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-500/20 bg-amber-500/10 text-[10px] font-bold uppercase tracking-wider text-amber-200/90 shadow-sm">
                  <Check size={12} className="text-emerald-400" />
                  <span>오늘의 시크릿 수신 완료</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 루시와 1:1 심층 상담 (Deep Insight) Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-950/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                  <Sparkles size={13} className="animate-pulse" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-amber-200">
                  루시와 1:1 심층 상담 (Deep Insight)
                </span>
              </div>
              <p className="text-[11px] text-white/70 font-sans leading-relaxed">
                오늘 우주에 보낸 맞춤 소원과 시크릿 확언을 바탕으로, 루시와 함께 마음속 의심을 지우고 강력한 끌어당김 확신을 나누세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                void sendDailySecretToLucy(data, wish, openLucyChat, sendUnifiedMessage);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.35)] active:scale-95 cursor-pointer shrink-0"
            >
              <Sparkles size={13} />
              <span>루시와 심층 상담하기</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400/70 block">
                Believe · 믿음으로 새기기
              </span>
              <p className="text-sm text-white/75 leading-relaxed break-keep">{data.reflection}</p>
            </div>
            <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] p-5 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400/70 block">
                Receive · 오늘의 작은 실천
              </span>
              <p className="text-sm text-white/80 leading-relaxed break-keep font-medium">{data.action}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-5 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400/80 block font-mono">
                Ask · 오늘의 소원 선언 (Desire)
              </span>
              {data.appliedWish && (
                <span className="text-[9px] text-amber-300/80 font-mono">
                  우주로 쏘아 올린 요청
                </span>
              )}
            </div>
            <p className="text-sm text-white/90 leading-relaxed break-keep font-medium">
              {data.desire}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400/70 block">
              Feel · 이미 받은 것처럼 느끼기
            </span>
            <p className="text-sm text-white/80 leading-relaxed break-keep italic">
              {data.feelingAnchor}
            </p>
            <button
              type="button"
              onClick={() => togglePractice('feeling')}
              className="text-[10px] text-amber-300/80 hover:text-amber-200 underline-offset-2 hover:underline cursor-pointer"
            >
              {practice.feeling ? '✓ 기분 연습 완료' : '기분 연습했다고 표시'}
            </button>
          </div>

          <VisualizationTimer
            guide={data.visualizationGuide}
            onComplete={() => markPracticeItem('visualization')}
          />

          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <PenLine size={14} className="text-violet-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400/80">
                  스크립팅 노트 · 현재형 미래
                </span>
              </div>

              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setScriptingTab('typing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    scriptingTab === 'typing'
                      ? 'bg-violet-500/25 text-violet-200 border border-violet-500/30 shadow-sm'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <Keyboard size={12} />
                  <span>필사 타자 연습</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScriptingTab('write')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    scriptingTab === 'write'
                      ? 'bg-violet-500/25 text-violet-200 border border-violet-500/30 shadow-sm'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <PenLine size={12} />
                  <span>자유 작성</span>
                </button>
              </div>
            </div>

            {scriptingTab === 'typing' ? (
              <ScriptingTypingPractice
                scriptingStarter={data.scriptingStarter}
                affirmation={data.affirmation}
                desire={data.desire}
                mirrorPhrase={data.mirrorPhrase}
                gratitudeSeeds={data.gratitudeSeeds}
                reflection={data.reflection}
                currentScript={script}
                onCompletePractice={() => markPracticeItem('affirmation')}
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] text-white/45">
                    이미 이루어진 것처럼 현재형으로 적어 보세요. 감정까지 생생하게 쓸수록 좋습니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => void copyText(script || data.scriptingStarter, 'script')}
                    className="text-[9px] text-white/40 hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copied === 'script' ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                    {copied === 'script' ? '복사됨' : '복사'}
                  </button>
                </div>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  rows={5}
                  placeholder={data.scriptingStarter}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/85 placeholder:text-white/25 resize-y focus:outline-none focus:border-violet-500/30 font-serif leading-relaxed"
                />
                <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] font-mono text-white/30">
                    {script.trim().length}자 작성됨
                  </span>
                  <button
                    type="button"
                    onClick={() => setScriptingTab('typing')}
                    className="text-[11px] text-violet-300/80 hover:text-violet-200 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Keyboard size={12} />
                    <span>이 문구로 필사 타자 연습하기 &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.04] p-5 space-y-3">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400/80 block">
              거울 확언 · Mirror Work
            </span>
            <p className="text-base sm:text-lg font-serif text-white/90 leading-relaxed break-keep">
              &ldquo;{data.mirrorPhrase}&rdquo;
            </p>
            <div className="flex flex-wrap gap-2">
              <TTSButton
                text={data.mirrorPhrase}
                voice="Kore"
                className="text-cyan-300 border-cyan-500/20 text-xs py-2 px-4"
                onPlay={() => markPracticeItem('mirror')}
              />
              <button
                type="button"
                onClick={() => {
                  void copyText(data.mirrorPhrase, 'mirror');
                  markPracticeItem('mirror');
                }}
                className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-[10px] text-white/50 hover:text-white cursor-pointer"
              >
                {copied === 'mirror' ? '복사됨' : '거울 확언 복사'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-zinc-950/60 to-purple-950/30 p-5 sm:p-6 space-y-3 shadow-lg shadow-indigo-950/20">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Moon size={15} className="text-indigo-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                  Evening · 저녁 감사 마무리
                </span>
              </div>
              <span className="text-[10px] text-indigo-300/60 font-mono">수면 전 감사 의식</span>
            </div>
            <p className="text-base sm:text-lg font-serif text-white/90 leading-relaxed break-keep">
              &ldquo;{cleanEveningPrompt || '오늘 하루 우주에 전해진 나의 소망이 밤사이 지혜롭게 피어남을 믿으며 깊은 평화 속에 잠듭니다.'}&rdquo;
            </p>
            <p className="text-[11px] text-white/45">
              잠들기 전 눈을 감고 마음속으로 읊조리며 오늘 하루의 모든 긴장과 생각을 평온하게 내려놓으세요.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <TTSButton
                text={cleanEveningPrompt || '오늘 하루 우주에 전해진 나의 소망이 밤사이 지혜롭게 피어남을 믿으며 깊은 평화 속에 잠듭니다.'}
                voice="Kore"
                className="text-indigo-300 border-indigo-500/30 text-xs py-2 px-4 bg-indigo-500/10 hover:bg-indigo-500/20"
              />
              <button
                type="button"
                onClick={() => {
                  void copyText(cleanEveningPrompt || '', 'evening');
                }}
                className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-[10px] text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copied === 'evening' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied === 'evening' ? '복사됨' : '저녁 감사 복사'}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ListChecks size={14} className="text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/80">
                  오늘의 끌어당김 실천 체크리스트
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-300/80">
                {practiceCount}/{PRACTICE_ITEMS.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRACTICE_ITEMS.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-black/20 cursor-pointer hover:bg-white/[0.03]"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(practice[item.id])}
                    onChange={() => togglePractice(item.id)}
                    className="accent-emerald-500"
                  />
                  <span className={`text-xs ${practice[item.id] ? 'text-white/45 line-through' : 'text-white/75'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
            <AnimatePresence>
              {practiceCount === PRACTICE_ITEMS.length && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs text-emerald-300 font-bold"
                >
                  오늘의 시크릿 실천 완료 · 우주와 같은 주파수에 맞춰졌습니다
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 text-center">
            <button
              type="button"
              onClick={handleResetToNewSecret}
              className="px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-lg shadow-amber-950/20"
            >
              <RefreshCw size={13} className="text-amber-400" />
              <span>새로운 소원으로 시크릿 다시 받기 (무제한)</span>
            </button>
            {data.appliedWish && (
              <button
                type="button"
                onClick={handleResetToNewSecret}
                className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <X size={13} />
                <span>맞춤 소원 초기화 (기본 키트로 돌아가기)</span>
              </button>
            )}
          </div>
          <p className="text-[10px] text-white/40 font-mono text-center pt-1">
            언제든지 새로운 소망이나 고민으로 시크릿 키트를 자유롭게 다시 생성할 수 있습니다.
          </p>
        </motion.div>
      )}

      {!data && (
        <div className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Eye, title: '68초 시각화', desc: '이미 이루어진 장면을 느껴 보세요' },
            { icon: Heart, title: '감사 자석', desc: '감사가 더 많은 좋은 일을 끌어당깁니다' },
            { icon: PenLine, title: '스크립팅', desc: '현재형으로 미래를 기록하세요' },
          ].map((tool) => (
            <div
              key={tool.title}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-center space-y-2 opacity-70"
            >
              <tool.icon size={18} className="mx-auto text-amber-400/70" />
              <p className="text-[11px] font-bold text-white/60">{tool.title}</p>
              <p className="text-[10px] text-white/35 leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      )}

      
    </div>
  );
}
