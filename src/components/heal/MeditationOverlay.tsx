import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Leaf, Activity, Sparkles, ArrowLeft, RefreshCw, Wand2 } from 'lucide-react';
import { z } from 'zod';
import { auth, db, collection, addDoc, serverTimestamp } from '@/lib/firebase';
import { useApp } from '@/contexts/AppContext';
import { invokeLLMStructured, buildDeepSynapseContext } from '@/lib/ai';
import { getTodayDateKey } from '@/lib/dailyCache';
import { sendSedonaReleaseToLucy } from '@/lib/oracleDeepInsight';
import { type AuraThemeCard, getAuraCardSedonaRecommendation } from '@/lib/auraCards';
import { TTSButton } from '@/components/TTSButton';
import { playTTS, stopTTS } from '@/utils/tts';

// Web Audio Solfeggio Tone generator
function playSolfeggioTone(freq: number) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Custom soft envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 2.5);
  } catch (e) {
    console.warn("Audio playback context restricted or failed:", e);
  }
}

// Sedona and Letting Go Release Themes
const RELEASE_THEMES = {
  apathy: {
    id: 'apathy',
    name: '무기력 & 체념 (Apathy)',
    desc: '아무것도 할 수 없고 의미 없다는 깊은 좌절과 세포의 긴장을 무한한 의식 속으로 흘려보냅니다.',
    emoji: '🥀',
    bgLight: 'rgba(239, 68, 68, 0.05)',
    accent: 'rgb(248, 113, 113)',
    solfeggio: 396,
    questions: [
      "지금 내면에서 느껴지는 무기력과 '할 수 없다'는 완강한 체념을 있는 그대로 환영하고 허용해볼 수 있나요?",
      "이 힘겨운 무기력을 품에 안아준 뒤, 잠시만 강물에 띄우듯 흘려보낼 수 있나요?",
      "이 무거운 감정을 기꺼이 흘려보내 자유와 평온을 선택하겠습니까?",
      "언제 그렇게 흘려보내겠습니까? (지금!)"
    ]
  },
  grief: {
    id: 'grief',
    name: '슬픔 & 상실감 (Grief)',
    desc: '지나간 일에 대한 깊은 자책, 슬픔, 아릿한 그리움을 포근히 안아 해방합니다.',
    emoji: '💧',
    bgLight: 'rgba(59, 130, 246, 0.05)',
    accent: 'rgb(147, 197, 253)',
    solfeggio: 417,
    questions: [
      "가슴 밑바닥에 오랫동안 서려 있던 상처와 가슴 시린 그리움을 있는 그대로 외면하지 않고 느껴볼 수 있나요?",
      "이 오래된 슬픔을 애정 어린 우주의 숨결 속에 잠시 흘려보낼 수 있나요?",
      "아픔에 자신을 묶어 상처 입히는 비정상적인 집착을 기꺼이 놓아버리겠습니까?",
      "언제 그렇게 하시겠습니까? (지금!)"
    ]
  },
  fear: {
    id: 'fear',
    name: '두려움 & 불안 (Fear)',
    desc: '미래를 자꾸 불안하게 예측하고 방어벽을 세우려는 에고를 자유롭게 놓아줍니다.',
    emoji: '🌪️',
    bgLight: 'rgba(245, 158, 11, 0.05)',
    accent: 'rgb(253, 186, 116)',
    solfeggio: 528,
    questions: [
      "지금 몸 구석구석을 떨게 하고 긴장하게 만드는 이 불안과 두려움이라는 파동을 기꺼이 환영할 수 있나요?",
      "자신을 상하게 만드는 이 위축과 두려움을 아주 편안하게 흘려보낼 수 있나요?",
      "이 느낌을 굳게 붙잡기보다는, 내면의 참나를 전면 믿고 완전히 놓아버리겠습니까?",
      "언제 날아오르듯 놓아버리겠습니까? (지금!)"
    ]
  },
  anger: {
    id: 'anger',
    name: '분노 & 억울함 (Anger)',
    desc: '타인이나 나를 향한 공격적인 저항과 뼈아픈 화를 시원하게 정화합니다.',
    emoji: '⚡',
    bgLight: 'rgba(168, 85, 247, 0.05)',
    accent: 'rgb(216, 180, 254)',
    solfeggio: 639,
    questions: [
      "나를 극도로 흥분하게 하거나 고집스럽게 주장하려는 이 화와 억울한 분노 전압을 있는 그대로 고스란히 비춰볼 수 있나요?",
      "나를 무겁게 가두었던 가시 돋친 원망 and 공격적 전하를 허공 속으로 흘려보낼 수 있나요?",
      "기꺼이 이 고통의 족쇄를 풀고 평안한 정위로 스스로를 데려오시겠습니까?",
      "언제 즉각 놓아버리겠습니까? (지금!)"
    ]
  },
  control: {
    id: 'control',
    name: '통제 욕구 (Wanting Control)',
    desc: '내 뜻대로 상황과 다른 사람을 조종하고 바꾸려 하는 무리한 마음을 항복합니다.',
    emoji: '✊',
    bgLight: 'rgba(16, 185, 129, 0.05)',
    accent: 'rgb(110, 231, 183)',
    solfeggio: 741,
    questions: [
      "내 뜻대로 세상과 사건을 끼워 맞추고 바꾸려는 무의식의 강박적 쥐어짜기를 온전히 느껴볼 수 있나요?",
      "지친 당신의 에고가 매달린 이 숨막히는 통제 열망을 시원하고 가볍게 흘려보낼 수 있나요?",
      "우주의 대 자연 법칙과 흐름을 인정하며, 이 부질없는 긴장의 고비를 기꺼이 놓아버리겠습니까?",
      "언제 그렇게 하시겠습니까? (지금!)"
    ]
  },
  approval: {
    id: 'approval',
    name: '인정 욕구 (Wanting Approval)',
    desc: '사랑 혹은 칭찬을 갈망하며 남의 비위를 맞추고 자아를 검열하는 얽매임을 버립니다.',
    emoji: '🌸',
    bgLight: 'rgba(236, 72, 153, 0.05)',
    accent: 'rgb(247, 180, 205)',
    solfeggio: 852,
    questions: [
      "타인에게 소외당할까 우려하여 미성숙하게 인정과 칭송을 구걸하는 숨길 수 없는 요구를 허용하고 볼 수 있나요?",
      "남의 칭찬 속에서만 확인하려 했던 지친 자가 검열을 평화의 안개 속으로 가볍게 날려보낼 수 있나요?",
      "이미 가장 온전하고 축복받은 나 자신을 수용하며 타인의 평가 안경을 기꺼이 깨뜨려 놓아버리겠습니까?",
      "언제 그렇게 하시겠습니까? (지금!)"
    ]
  },
  security: {
    id: 'security',
    name: '안전 욕구 (Wanting Security)',
    desc: '불미스러운 일을 극단적으로 예방하기 위해 몸을 옹송거리는 생존 본능을 내맡깁니다.',
    emoji: '⚓',
    bgLight: 'rgba(20, 184, 166, 0.05)',
    accent: 'rgb(115, 235, 230)',
    solfeggio: 963,
    questions: [
      "언제 다치거나 잘못될지 모른다는 뼛속 깊은 원초적 두려움과 과보호 본능을 있는 그대로 환영할 수 있나요?",
      "가만히 영원한 영혼인 자신을 비스듬히 느끼며, 이 생존 강박을 전적으로 완화해 흘려보낼 수 있나요?",
      "내일의 온 신성한 은총을 무한 신뢰하며, 오늘 이 마음을 기꺼이 전면 항복하시겠습니까?",
      "언제 그 무거운 완고함을 즉각 놓아버리겠습니까? (지금!)"
    ]
  }
};

export { RELEASE_THEMES };
export const RELEASE_THEME_KEYS = Object.keys(RELEASE_THEMES) as Array<keyof typeof RELEASE_THEMES>;

export type ReleaseType = keyof typeof RELEASE_THEMES;

const RELEASE_THEME_ID_ENUM = RELEASE_THEME_KEYS as [ReleaseType, ...ReleaseType[]];

const ThemeRecommendationSchema = z.object({
  themeId: z.enum(RELEASE_THEME_ID_ENUM),
  reason: z.string().describe('이 테마를 추천하는 이유 2~3문장, 뽑은 힐링카드 이름을 인용하여 쉬운 말로'),
  briefTip: z.string().describe('릴리즈 시작 전 한 줄 팁, 30자 이내'),
});

type ThemeRecommendation = z.infer<typeof ThemeRecommendationSchema>;

function sedonaAiThemeStorageKey(cardId?: string) {
  return `heal_sedona_ai_theme_${getTodayDateKey()}_${cardId || 'default'}`;
}

function loadCachedAiThemeRecommendation(card?: (AuraThemeCard & { isReversed?: boolean }) | null): ThemeRecommendation | null {
  try {
    const raw = localStorage.getItem(sedonaAiThemeStorageKey(card?.id));
    if (raw) {
      const parsed = JSON.parse(raw) as ThemeRecommendation;
      if (RELEASE_THEME_KEYS.includes(parsed.themeId)) return parsed;
    }
  } catch {}

  if (card) {
    return getAuraCardSedonaRecommendation(card);
  }
  return null;
}

interface MeditationOverlayProps {
  onClose?: () => void;
  isInline?: boolean;
  highlightThemeKey?: ReleaseType;
  onReleaseComplete?: (theme: ReleaseType) => void;
  contextHint?: string;
  card?: (AuraThemeCard & { isReversed?: boolean }) | null;
}

export function MeditationOverlay({
  onClose,
  isInline = false,
  highlightThemeKey,
  onReleaseComplete,
  contextHint,
  card,
}: MeditationOverlayProps) {
  const { firebaseUser, sharedState, openLucyChat, sendUnifiedMessage } = useApp();
  const [theme, setTheme] = useState<ReleaseType>(highlightThemeKey || 'control');
  const [step, setStep] = useState<number>(-1); // -1: Select Theme, 0..3: Releasing Questions, 4: Finished/Healing State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [autoTimer, setAutoTimer] = useState<number>(15); // 15 seconds manual trigger
  const [aiRecommendation, setAiRecommendation] = useState<ThemeRecommendation | null>(
    () => loadCachedAiThemeRecommendation(card),
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const lastCardIdRef = useRef<string | undefined>(card?.id);

  // Sync recommendation if card prop changes
  useEffect(() => {
    if (card?.id !== lastCardIdRef.current) {
      lastCardIdRef.current = card?.id;
      const initial = loadCachedAiThemeRecommendation(card);
      setAiRecommendation(initial);
      if (card) {
        void fetchAiRecommendation(false);
      }
    }
  }, [card]);

  const selectedTheme = RELEASE_THEMES[theme];
  const featuredThemeKey = aiRecommendation?.themeId || highlightThemeKey;

  const buildThemeCatalog = () => RELEASE_THEME_KEYS.map((key) => {
    const item = RELEASE_THEMES[key];
    return `- ${key}: ${item.name} — ${item.desc}`;
  }).join('\n');

  const fetchAiRecommendation = useCallback(async (force = false) => {
    if (isAiLoading) return;
    const cardRec = card ? getAuraCardSedonaRecommendation(card) : null;
    const cacheKey = sedonaAiThemeStorageKey(card?.id);
    if (!force && localStorage.getItem(cacheKey)) {
      const cached = loadCachedAiThemeRecommendation(card);
      if (cached) {
        setAiRecommendation(cached);
        return;
      }
    }

    // Default immediately to the card's dedicated archetype recommendation
    if (cardRec) {
      setAiRecommendation(cardRec);
    }

    setIsAiLoading(true);
    try {
      const userProfileStr = sharedState?.userProfile
        ? JSON.stringify(sharedState.userProfile)
        : '프로필 없음';
      const memory = sharedState?.healMemory || sharedState?.globalMemory || '최근 기록 없음';
      const soulState = buildDeepSynapseContext ? buildDeepSynapseContext() : '';
      const cardContext = card
        ? `\n[오늘 뽑은 릴리즈 힐링카드]\n- 카드명: ${card.nameKo} (${card.name})\n- 핵심 키워드: ${(card.keywords || []).join(', ')}\n- 카드 성향: ${card.desc}${card.isReversed ? ' (역방향)' : ''}\n- 기본 권장 방하착 테마: ${cardRec?.themeId || 'control'}`
        : '';
      const extraContext = contextHint ? `\n[추가 맥락] ${contextHint}` : '';

      const result = await invokeLLMStructured({
        messages: [
          {
            role: 'system',
            content: [
              '당신은 세도나 메서드(Sedona Method) 방하착 명상 가이드 AURA 지요입니다.',
              card
                ? `오늘 사용자가 뽑은 릴리즈 힐링카드는 **[${card.nameKo} (${card.name})]** (키워드: ${(card.keywords || []).join(', ')})입니다.`
                : '',
              cardRec
                ? `이 카드의 핵심 방하착 테마는 **[${cardRec.themeId}]** (${RELEASE_THEMES[cardRec.themeId].name})입니다.`
                : '',
              '사용자가 뽑은 릴리즈 힐링카드의 고유 에너지와 무의식 저항 패턴을 최우선으로 분석하여, 이 카드가 비추는 무의식의 억압을 해소하기 위한 세도나 방하착 테마와 심층 추천 이유를 작성하세요.',
              card
                ? `반드시 추천 이유(reason)에 뽑은 힐링카드([${card.nameKo}])의 이름과 키워드(${(card.keywords || []).join(', ')})를 자연스럽게 직접 인용하여 왜 이 감정/욕구를 흘려보내야 하는지 다정하고 명확하게 설명하세요.`
                : '쉬운 말로, 짧고 따뜻하게 답하세요.',
              `[프로필: ${userProfileStr}]`,
              `[최근 기록: ${memory}]`,
              `[영혼 상태: ${soulState || '없음'}]${cardContext}${extraContext}`,
              '\n[선택 가능한 테마]',
              buildThemeCatalog(),
              '\nthemeId는 위 목록의 id(apathy, grief, fear, anger, control, approval, security) 중 하나만 사용하세요.',
            ].filter(Boolean).join('\n'),
          },
          {
            role: 'user',
            content: card
              ? `오늘 뽑은 릴리즈 힐링카드 [${card.nameKo}] (${(card.keywords || []).join(', ')}) 결과에 100% 맞추어, 지금 내가 가장 먼저 흘려보내야 할 세도나 방하착 테마와 추천 이유를 작성해 주세요.`
              : '지금 내 상태에 맞는 세도나 방하착 테마를 AI로 추천해 주세요.',
          },
        ],
        schema: ThemeRecommendationSchema,
      });

      if (result && RELEASE_THEME_KEYS.includes(result.themeId)) {
        setAiRecommendation(result);
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } else if (cardRec) {
        setAiRecommendation(cardRec);
        localStorage.setItem(cacheKey, JSON.stringify(cardRec));
      }
    } catch (error) {
      console.warn('[MeditationOverlay] AI theme recommendation failed, using card preset', error);
      if (cardRec) {
        setAiRecommendation(cardRec);
      }
    } finally {
      setIsAiLoading(false);
    }
  }, [card, contextHint, isAiLoading, sharedState]);

  useEffect(() => {
    if (!aiRecommendation) {
      void fetchAiRecommendation(false);
    }
  }, [aiRecommendation, fetchAiRecommendation]);

  // Auto progression if play holds
  useEffect(() => {
    if (!isPlaying || step < 0 || step > 3) return;

    const timer = setInterval(() => {
      setAutoTimer(prev => {
        if (prev <= 1) {
          if (step < 3) {
            setStep(s => s + 1);
            playSolfeggioTone(selectedTheme.solfeggio);
            return 15;
          } else {
            setStep(4);
            setIsPlaying(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, step, selectedTheme]);

  // Auto-play TTS on question wizard step change and completion
  useEffect(() => {
    if (step >= 0 && step <= 3) {
      const qText = selectedTheme.questions[step];
      if (qText) {
        void playTTS(qText, 'Kore', false, '명상');
      }
    } else if (step === 4) {
      void playTTS(
        '존재하는 것들을 소유하려 하거나, 상황을 조종하고, 타인의 인정에 얽매이려 하던 그 모든 것은 당신의 본성이 아닙니다. 툭 놓아버림으로써 기나긴 우주적 은총과 참된 자유가 머물기 시작합니다.',
        'Kore',
        false,
        '명상'
      );
    } else {
      stopTTS();
    }

    return () => {
      stopTTS();
    };
  }, [step, selectedTheme]);

  // Handle Firebase persistence when finishing meditations
  useEffect(() => {
    if (step === 4) {
      playSolfeggioTone(selectedTheme.solfeggio + 100);
      onReleaseComplete?.(theme);
      const user = firebaseUser || auth.currentUser;
      if (user) {
        addDoc(collection(db, 'heal_history', user.uid, 'entries'), {
          type: 'meditation',
          title: `방하착 세도나 정화 완료: ${selectedTheme.name}`,
          content: `방하착 타겟: ${selectedTheme.name}\n정화 기법: 세도나 메서드 4단계 릴리즈\n솔페지오 ���파수: ${selectedTheme.solfeggio}Hz 자명\n\n[무의식 성찰 결과]\n"내 뜻대로 통제하고, 사랑받고, 안전해지려는 에고의 집착으로부터 영혼이 비워졌습니다. 마음을 가로막던 전하(Charge)는 흘러가고 순수한 평정 자리만이 장엄하게 드러납니다."`,
          createdAt: serverTimestamp(),
          metadata: {
            pattern: 'Sedona Releasing Flow',
            themeId: selectedTheme.id,
            solfeggioFreq: selectedTheme.solfeggio,
            aiRecommended: aiRecommendation?.themeId === theme,
          }
        }).catch(err => console.error("Firebase Sedona logging failed:", err));
      }
    }
  }, [step, selectedTheme, firebaseUser, theme, onReleaseComplete, aiRecommendation?.themeId]);

  const handleStepNext = () => {
    if (step < 3) {
      const nextStep = step + 1;
      setStep(nextStep);
      setAutoTimer(15);
      playSolfeggioTone(selectedTheme.solfeggio);
    } else {
      setStep(4);
      setIsPlaying(false);
    }
  };

  const handleStartRelease = (selectedThemeId: ReleaseType) => {
    setTheme(selectedThemeId);
    setStep(0);
    setIsPlaying(true);
    setAutoTimer(15);
    playSolfeggioTone(RELEASE_THEMES[selectedThemeId].solfeggio);
  };

  const renderContent = () => (
    <div className={`relative w-full rounded-3xl overflow-hidden flex flex-col text-white font-sans premium-scroll ${isInline ? 'h-[75vh] md:h-[650px]' : 'flex-1 md:min-h-[600px]'}`}>
        {/* Header */}
        <div className="p-6 md:px-8 pb-4 flex justify-between items-center border-b border-white/5 shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            {!isInline && onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg border border-white/10 transition-all text-[11px] font-semibold cursor-pointer active:scale-95 shrink-0"
              >
                <ArrowLeft size={12} />
                <span>돌아가기</span>
              </button>
            )}
            <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
            <div className="flex flex-col text-left">
              <h2 className="text-white font-display font-medium tracking-[0.25em] text-xs uppercase flex items-center gap-2">
                <Leaf size={14} className="animate-pulse text-emerald-400" />
                세도나 방하착 명상 (Sedona Release)
              </h2>
              <p className="text-white/40 text-[9px] mt-0.5 tracking-wider uppercase font-sans">
                데이비드 호킨스 & 레스터 레븐슨의 항복 기법
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative min-h-0 premium-scroll">
          
          {/* Solfeggio Background Energy Ripple */}
          {step >= 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <motion.div
                animate={isPlaying ? {
                  scale: [1, 1.35, 1],
                  opacity: [0.15, 0.45, 0.15]
                } : {
                  scale: 1,
                  opacity: 0.15
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-[70vw] h-[70vw] md:w-[45vw] md:h-[45vw] rounded-full blur-[80px]"
                style={{ backgroundColor: selectedTheme.accent }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === -1 ? (
              // 1. Selector Phase
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full justify-between gap-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-xl md:text-2xl font-light text-slate-100 tracking-wider">어떤 무의식을 흘려보낼까요?</h3>
                  <p className="text-white/40 text-xs font-sans">
                    현재 마음을 짓누르며 편견이나 피로를 일으키는 뿌리 정서 혹은 에고의 결핍 욕구를 릴리즈합니다.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                      <div className="flex items-center gap-1.5">
                        <Wand2 size={12} />
                        <span>AI 추천</span>
                      </div>
                      {card && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium normal-case tracking-normal">
                          {card.nameKo} 카드 연동
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => void fetchAiRecommendation(true)}
                      disabled={isAiLoading}
                      className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      <RefreshCw size={10} className={isAiLoading ? 'animate-spin' : ''} />
                      {isAiLoading ? '분석 중' : '다시 추천'}
                    </button>
                  </div>

                  {isAiLoading && !aiRecommendation ? (
                    <div className="flex items-center justify-center gap-2 py-3 text-[11px] text-emerald-300/80">
                      <RefreshCw size={14} className="animate-spin" />
                      <span>지금 상태에 맞는 방하착 테마를 분석하는 중...</span>
                    </div>
                  ) : aiRecommendation ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{
                            backgroundColor: `${RELEASE_THEMES[aiRecommendation.themeId].accent}20`,
                            border: `1px solid ${RELEASE_THEMES[aiRecommendation.themeId].accent}40`,
                          }}
                        >
                          {RELEASE_THEMES[aiRecommendation.themeId].emoji}
                        </div>
                        <div className="min-w-0 text-left space-y-1">
                          <p className="text-xs font-semibold text-emerald-200">
                            {RELEASE_THEMES[aiRecommendation.themeId].name}
                          </p>
                          <p className="text-[11px] text-white/65 leading-relaxed break-keep">
                            {aiRecommendation.reason}
                          </p>
                          <p className="text-[10px] text-emerald-300/70 font-mono">
                            TIP · {aiRecommendation.briefTip}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartRelease(aiRecommendation.themeId)}
                        className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-100 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        AI 추천 테마로 바로 시작
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-white/45 text-center py-2">
                      AI 추천을 불러오지 못했습니다. 아래에서 직접 선택해 주세요.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto premium-scroll pr-1">
                  {(Object.keys(RELEASE_THEMES) as ReleaseType[]).map(key => {
                    const tVal = RELEASE_THEMES[key];
                    const isFeatured = featuredThemeKey === key;
                    const isAiPick = aiRecommendation?.themeId === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleStartRelease(key)}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all text-left group cursor-pointer ${
                          isFeatured
                            ? 'bg-emerald-500/[0.08] border border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-500/[0.12]'
                            : 'bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                          {tVal.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-xs text-slate-200 tracking-wide">{tVal.name}</span>
                            <span className="text-[9px] font-mono opacity-50 px-1.5 py-0.5 rounded border border-white/10">{tVal.solfeggio}Hz</span>
                            {isAiPick && (
                              <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/25">
                                AI 추천
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-white/40 mt-1 line-clamp-2 leading-relaxed shrink-0">
                            {tVal.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-center">
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    릴리즈 단계에 돌입하면 마음을 차분히 가라앉히는 <span className="text-emerald-300 font-bold font-mono">Solfeggio 신성 주파수</span>가 즉각 공명 자명됩니다.
                  </p>
                </div>
              </motion.div>
            ) : step >= 0 && step <= 3 ? (
              // 2. Question Wizard Phase
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="flex flex-col h-full justify-between items-center text-center gap-8 py-2"
              >
                {/* Meta details */}
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/30 px-2 py-0.5 rounded border border-white/5">
                    {selectedTheme.name} 정화기 • STEP {step + 1} / 4
                  </span>
                  <p className="text-white/20 text-[10px] font-mono tracking-wide">{selectedTheme.solfeggio}Hz 치유음 자진중</p>
                </div>

                {/* Question */}
                <div className="flex flex-col items-center max-w-md py-4">
                  <motion.div
                    animate={{
                      scale: isPlaying ? [1, 1.05, 1] : 1,
                      boxShadow: isPlaying ? ["0 0 15px rgba(255,255,255,0.05)", "0 0 35px rgba(255,255,255,0.15)", "0 0 15px rgba(255,255,255,0.05)"] : "none"
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6"
                    style={{ backgroundColor: selectedTheme.accent + '20', border: `1px solid ${selectedTheme.accent}30` }}
                  >
                    {selectedTheme.emoji}
                  </motion.div>
                  <blockquote className="text-lg md:text-xl font-light text-slate-100 tracking-wide leading-relaxed min-h-[90px] flex items-center justify-center italic text-center">
                    "{selectedTheme.questions[step]}"
                  </blockquote>
                  <div className="flex items-center gap-2 mt-2">
                    <TTSButton text={selectedTheme.questions[step]} voice="Kore" className="text-emerald-300 border-emerald-500/30 text-xs px-3 py-1" />
                  </div>
                  <span className="text-xs mt-2 text-white/30 tracking-tight">수행 지침: 마음으로 고요히 고개를 끄덕이며 입 밖으로 예(네) 또는 지금 이라고 자답하십시오.</span>
                </div>

                {/* Progress controls and Timer */}
                <div className="w-full max-w-md space-y-6">
                  {/* Step Indicators */}
                  <div className="flex justify-center gap-2">
                    {[0,1,2,3].map((idx) => (
                      <div
                        key={idx}
                        className={`w-12 h-1 rounded-full transition-all duration-500 ${idx === step ? 'bg-white shadow-[0_0_8px_currentColor]' : idx < step ? 'bg-white/40' : 'bg-white/10'}`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center px-2">
                    <button
                      onClick={() => setStep(-1)}
                      className="px-4 py-2 border border-white/5 rounded-full bg-white/[0.02] hover:bg-white/[0.06] text-white/60 hover:text-white transition-all text-xs cursor-pointer"
                    >
                      목록으로
                    </button>

                    <div className="flex items-center gap-4">
                      {isPlaying && (
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 font-bold bg-emerald-950/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <Activity size={10} className="animate-bounce" />
                          <span>00:{String(autoTimer).padStart(2, '0')}</span>
                        </div>
                      )}
                      
                      <button
                        onClick={handleStepNext}
                        className="px-6 py-2.5 rounded-full font-bold tracking-wider transition-all scale-100 hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 text-xs select-none cursor-pointer text-black font-semibold"
                        style={{ backgroundColor: selectedTheme.accent }}
                      >
                        {step === 3 ? '완전한 해방과 침묵' : '예, 느낌 수평 (다음)'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              // 3. Complete Phase
              <motion.div
                key="finish"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col h-full justify-between items-center text-center gap-6 py-4"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse mb-2">
                  <Sparkles size={36} />
                </div>

                <div className="max-w-md space-y-3">
                  <h3 className="text-xl md:text-2xl font-light text-slate-100 tracking-normal">그렇게 마음은 가볍게 비워졌습니다.</h3>
                  <div className="text-xs text-white/50 leading-relaxed font-light p-5 bg-white/[0.02] border border-white/5 rounded-2xl italic relative">
                    "존재하는 것들을 소유하려 하거나, 상황을 조종하고, 타인의 인정에 얽매이려 하던 그 모든 것은 당신의 본성이 아닙니다. 툭 놓아버림으로써 기나긴 우주적 은총과 참된 자유가 머물기 시작합니다."
                    <div className="flex justify-center mt-3">
                      <TTSButton
                        text="존재하는 것들을 소유하려 하거나, 상황을 조종하고, 타인의 인정에 얽매이려 하던 그 모든 것은 당신의 본성이 아닙니다. 툭 놓아버림으로써 기나긴 우주적 은총과 참된 자유가 머물기 시작합니다."
                        voice="Kore"
                        className="text-emerald-300 border-emerald-500/30 text-xs px-3 py-1 bg-emerald-950/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-950/10 w-full max-w-sm rounded-xl border border-emerald-500/20 text-center space-y-1">
                  <p className="text-emerald-400 font-bold text-xs">방하착 정화 완료</p>
                  <p className="text-white/40 text-[9px]">감정 리포팅 및 웰니스 처방이 일지가 일일 기록에 영구 보존되었습니다.</p>
                </div>

                {/* Lucy Consultation Button */}
                <div className="w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isInline && onClose) onClose();
                      void sendSedonaReleaseToLucy(selectedTheme, card, openLucyChat, sendUnifiedMessage);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500/25 to-teal-500/25 hover:from-emerald-500/35 hover:to-teal-500/35 border border-emerald-400/40 text-emerald-100 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
                  >
                    <Sparkles size={13} className="text-emerald-400" />
                    <span>이 릴리즈 결과로 루시와 치유 상담하기</span>
                  </button>
                </div>

                <div className="flex gap-4 w-full justify-center max-w-sm">
                  <button
                    onClick={() => setStep(-1)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-medium tracking-wide text-xs active:scale-95 transition-all cursor-pointer"
                  >
                    다른 감정 흘려보내기
                  </button>
                  {(!isInline && onClose) && (
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium tracking-wide text-xs active:scale-95 transition-all text-white cursor-pointer shadow-lg"
                    >
                      하루로 돌아가기
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );

  if (isInline) {
    return (
      <div className="w-full max-w-6xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {renderContent()}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-[#050608] overflow-y-auto w-full h-full flex flex-col font-sans p-6 md:p-12 scrollbar-none select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-5xl mx-auto flex-1 flex flex-col relative bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
}
