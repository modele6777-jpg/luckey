import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Timer,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  History,
  BookOpen,
  Send,
  Zap,
  Activity,
  Moon,
  Wind,
  Flame,
  Award,
  ChevronRight,
  ChevronDown,
  Info,
  Wand2,
  SlidersHorizontal,
  Vibrate,
  Smartphone
} from 'lucide-react';
import {
  isHapticsSupported,
  getBreathingHapticSetting,
  setBreathingHapticSetting,
  triggerBreathingHaptic
} from '@/lib/breathingHaptics';
import { playSuccessHaptic } from '@/lib/audioHaptics';
import {
  MEDITATION_THEMES,
  type MeditationTheme,
  type MeditationThemeId,
  type OneMinuteMeditationRecord,
  type OneMinuteMeditationPrescription,
  meditationSound,
  generatePersonalizedMeditationGuide,
  getFallbackPrescription,
  inferThemeFromConcern,
  saveMeditationCompletion,
  loadMeditationHistory,
  getMeditationStats,
  type MeditationStats
} from '@/lib/oneMinuteMeditation';
import { useApp } from '@/contexts/AppContext';
import { TTSButton } from '@/components/TTSButton';
import { playTTS, stopTTS } from '@/utils/tts';

interface OneMinuteMeditationViewProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function OneMinuteMeditationView({ onClose, isModal = false }: OneMinuteMeditationViewProps) {
  const { firebaseUser, sharedState } = useApp();
  const uid = firebaseUser?.uid || 'guest';

  // Navigation tabs (custom prescription default first)
  const [activeTab, setActiveTab] = useState<'custom' | 'session' | 'settings' | 'history'>('custom');

  // Custom AI Prescription State
  const [conditionInput, setConditionInput] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [customPrescription, setCustomPrescription] = useState<OneMinuteMeditationPrescription | null>(null);

  // Selected Theme (Dynamically prescribed by AI or chosen as base theme)
  const [selectedThemeId, setSelectedThemeId] = useState<MeditationThemeId | 'ai_auto'>('ai_auto');
  const activeTheme = useMemo(() => {
    if (selectedThemeId === 'ai_auto') {
      if (customPrescription?.recommendedThemeId) {
        return MEDITATION_THEMES.find(t => t.id === customPrescription.recommendedThemeId) || MEDITATION_THEMES[0];
      }
      return MEDITATION_THEMES[0];
    }
    return MEDITATION_THEMES.find(t => t.id === selectedThemeId) || MEDITATION_THEMES[0];
  }, [selectedThemeId, customPrescription?.recommendedThemeId]);

  // Timer & Breathing State
  const TOTAL_DURATION = 60; // 60 seconds
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TOTAL_DURATION);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Haptic Feedback State (Mobile vibration pulses on Inhale & Exhale)
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(() => getBreathingHapticSetting());
  const [hapticTestPhase, setHapticTestPhase] = useState<'idle' | 'inhale' | 'exhale'>('idle');

  // Breathing Phase (Inhale, Hold, Exhale)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(activeTheme.breathingPattern.inhale);

  // Toggle Haptic Feedback
  const handleToggleHaptic = (forceState?: boolean) => {
    const next = typeof forceState === 'boolean' ? forceState : !hapticEnabled;
    setHapticEnabled(next);
    setBreathingHapticSetting(next);
    if (next) {
      triggerBreathingHaptic('test');
    }
  };

  // Test vibration pulse for Inhale or Exhale
  const handleTestHaptic = (phase: 'inhale' | 'exhale') => {
    setHapticTestPhase(phase);
    triggerBreathingHaptic(phase === 'inhale' ? 'test-inhale' : 'test-exhale');
    setTimeout(() => setHapticTestPhase('idle'), 1000);
  };

  // Sync external haptic setting changes
  useEffect(() => {
    const handleHapticSync = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (typeof detail?.enabled === 'boolean') {
        setHapticEnabled(detail.enabled);
      }
    };
    window.addEventListener('breathing-haptic-setting-changed', handleHapticSync);
    return () => {
      window.removeEventListener('breathing-haptic-setting-changed', handleHapticSync);
    };
  }, []);

  // History & Stats State
  const [historyList, setHistoryList] = useState<OneMinuteMeditationRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [stats, setStats] = useState<MeditationStats>(() => getMeditationStats(uid));
  const [copiedAffirmation, setCopiedAffirmation] = useState<boolean>(false);
  const [copiedRecordId, setCopiedRecordId] = useState<string | null>(null);

  // Load history & stats
  const refreshHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const list = await loadMeditationHistory(uid);
      setHistoryList(list);
      setStats(getMeditationStats(uid));
    } catch (e) {
      console.warn('[MeditationView] History load error:', e);
    } finally {
      setLoadingHistory(false);
    }
  }, [uid]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  // Clean up sounds and voice loop when unmounting
  useEffect(() => {
    return () => {
      meditationSound.stopTone();
      stopAffirmationLoop();
    };
  }, []);

  // Timer Tick Loop
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentThemeRef = useRef<MeditationTheme>(activeTheme);
  currentThemeRef.current = activeTheme;

  // Affirmation Continuous Loop Refs & Handlers
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const secondsRemainingRef = useRef(secondsRemaining);
  secondsRemainingRef.current = secondsRemaining;
  const isAffirmationLoopActiveRef = useRef<boolean>(false);
  const [isAffirmationLooping, setIsAffirmationLooping] = useState<boolean>(false);
  const affirmationLoopSessionIdRef = useRef<number>(0);
  const affirmationLoopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopAffirmationLoop = useCallback((immediateStop = true) => {
    affirmationLoopSessionIdRef.current += 1;
    isAffirmationLoopActiveRef.current = false;
    setIsAffirmationLooping(false);
    if (affirmationLoopTimeoutRef.current) {
      clearTimeout(affirmationLoopTimeoutRef.current);
      affirmationLoopTimeoutRef.current = null;
    }
    if (immediateStop) {
      stopTTS();
    }
  }, []);

  const startAffirmationLoop = useCallback(async (affirmation: string) => {
    stopAffirmationLoop(true);
    const sessionId = ++affirmationLoopSessionIdRef.current;
    isAffirmationLoopActiveRef.current = true;
    setIsAffirmationLooping(true);

    const loopCycle = async () => {
      while (
        isAffirmationLoopActiveRef.current &&
        affirmationLoopSessionIdRef.current === sessionId
      ) {
        try {
          await playTTS(affirmation, 'Kore', true, '명상');
        } catch (err) {
          console.warn('[Meditation] Affirmation loop TTS error:', err);
        }

        if (
          !isAffirmationLoopActiveRef.current ||
          affirmationLoopSessionIdRef.current !== sessionId
        ) {
          break;
        }

        // 3.5초 깊은 심호흡과 내면 흡수를 위한 평온한 간격 후 자동 반복 재생 (호흡 리듬에 여유 부여)
        await new Promise<void>((resolve) => {
          affirmationLoopTimeoutRef.current = setTimeout(resolve, 3500);
        });
      }

      if (affirmationLoopSessionIdRef.current === sessionId) {
        isAffirmationLoopActiveRef.current = false;
        setIsAffirmationLooping(false);
      }
    };

    void loopCycle();
  }, [stopAffirmationLoop]);

  const handleToggleContinuousAffirmation = () => {
    const text = customPrescription?.completionAffirmation || activeTheme.affirmation;
    if (isAffirmationLooping) {
      stopAffirmationLoop(true);
    } else {
      if (text) {
        void startAffirmationLoop(text);
      }
    }
  };

  const handleCompleteSession = useCallback(async () => {
    setIsRunning(false);
    isRunningRef.current = false;
    meditationSound.stopTone();
    // 🌟 1분 명상 타이머가 완료되어도 현재 재생 중인 확언 음성이 중간에 뚝 잘리지 않고 끝까지 부드럽게 완독되도록 보장 (반복 루프만 중단하고 진행 중인 음성은 유지)
    stopAffirmationLoop(false);
    if (soundEnabled) {
      meditationSound.playSingingBowlBell();
    }
    playSuccessHaptic('milestone');
    setIsCompleted(true);

    const affirmationToSave = customPrescription?.completionAffirmation || activeTheme.affirmation;
    const guideToSave = customPrescription?.guidedVoiceScript || activeTheme.guideSteps.join(' ');

    await saveMeditationCompletion(
      uid,
      activeTheme.id,
      affirmationToSave,
      conditionInput || undefined,
      guideToSave
    );

    refreshHistory();
  }, [soundEnabled, customPrescription, activeTheme, uid, conditionInput, refreshHistory, stopAffirmationLoop]);

  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });

        // Update breathing phase cycle
        const pattern = currentThemeRef.current.breathingPattern;
        setPhaseSecondsLeft(currentPhaseSec => {
          if (currentPhaseSec <= 1) {
            // Transition to next phase
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              if (hapticEnabled) triggerBreathingHaptic('hold');
              return pattern.hold;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              if (hapticEnabled) triggerBreathingHaptic('exhale');
              return pattern.exhale;
            } else {
              setBreathPhase('inhale');
              if (hapticEnabled) triggerBreathingHaptic('inhale');
              return pattern.inhale;
            }
          }
          return currentPhaseSec - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, secondsRemaining, breathPhase, hapticEnabled, handleCompleteSession]);

  // Start / Pause (with auto Kore voice affirmation continuous playback)
  const handleTogglePlay = (overrideAffirmation?: string) => {
    if (!isRunning) {
      // Starting session
      if (secondsRemaining === 0 || isCompleted) {
        setSecondsRemaining(TOTAL_DURATION);
        setIsCompleted(false);
        setBreathPhase('inhale');
        setPhaseSecondsLeft(activeTheme.breathingPattern.inhale);
      }
      setIsRunning(true);
      isRunningRef.current = true;
      if (soundEnabled) {
        meditationSound.playSingingBowlBell();
        meditationSound.playTone(activeTheme.frequency);
      }
      if (hapticEnabled) {
        triggerBreathingHaptic('inhale');
      }

      // Auto-play voice affirmation continuously with breathing gaps
      const affirmationToSpeak = overrideAffirmation || customPrescription?.completionAffirmation || activeTheme.affirmation;
      if (affirmationToSpeak) {
        void startAffirmationLoop(affirmationToSpeak);
      }
    } else {
      // Pausing
      setIsRunning(false);
      isRunningRef.current = false;
      meditationSound.stopTone();
      stopAffirmationLoop();
    }
  };

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    meditationSound.stopTone();
    stopAffirmationLoop();
    setSecondsRemaining(TOTAL_DURATION);
    secondsRemainingRef.current = TOTAL_DURATION;
    setIsCompleted(false);
    setBreathPhase('inhale');
    setPhaseSecondsLeft(activeTheme.breathingPattern.inhale);
  };

  // Sound toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (!next) {
      meditationSound.stopTone();
    } else if (isRunning) {
      meditationSound.playTone(activeTheme.frequency);
    }
  };

  // Select Theme handler
  const handleSelectTheme = (themeId: MeditationThemeId | 'ai_auto') => {
    if (isRunning) {
      setIsRunning(false);
      isRunningRef.current = false;
      meditationSound.stopTone();
    }
    const wasLooping = isAffirmationLoopActiveRef.current;
    stopAffirmationLoop();
    setSelectedThemeId(themeId);
    setSecondsRemaining(TOTAL_DURATION);
    secondsRemainingRef.current = TOTAL_DURATION;
    setIsCompleted(false);
    if (themeId !== 'ai_auto') {
      const newTheme = MEDITATION_THEMES.find(t => t.id === themeId) || MEDITATION_THEMES[0];
      setBreathPhase('inhale');
      setPhaseSecondsLeft(newTheme.breathingPattern.inhale);
      if (wasLooping) {
        void startAffirmationLoop(newTheme.affirmation);
      }
    }
  };

  const [inputErrorMsg, setInputErrorMsg] = useState<string | null>(null);

  // AI Personalized Prescription Request
  const handleGenerateAiGuide = useCallback(async (themeToUse?: MeditationThemeId | 'ai_auto', overrideCondition?: string) => {
    if (isGeneratingAi) return;

    const rawCondition = overrideCondition !== undefined ? overrideCondition : conditionInput;
    const trimmedCondition = rawCondition.trim();

    if (!trimmedCondition) {
      setInputErrorMsg('고민이나 현재 느끼는 마음 상태를 한 줄 이상 입력해주세요.');
      return;
    }

    setInputErrorMsg(null);
    setIsGeneratingAi(true);
    const targetThemeId = themeToUse !== undefined ? themeToUse : selectedThemeId;
    const isAuto = targetThemeId === 'ai_auto';
    const fallbackTheme = (!isAuto && targetThemeId)
      ? (MEDITATION_THEMES.find(t => t.id === targetThemeId) || MEDITATION_THEMES[0])
      : MEDITATION_THEMES[0];

    // Client-side 7.5s safety timeout guarantee
    const safetyTimeoutPromise = new Promise<OneMinuteMeditationPrescription>((resolve) => {
      setTimeout(() => {
        const fb = getFallbackPrescription(isAuto ? 'stress_relief' : targetThemeId, trimmedCondition);
        resolve(fb);
      }, 7500);
    });

    try {
      const result = await Promise.race([
        generatePersonalizedMeditationGuide(uid, targetThemeId, trimmedCondition),
        safetyTimeoutPromise
      ]);

      if (result && result.recommendedThemeId) {
        if (!isAuto) {
          setSelectedThemeId(targetThemeId);
        }
        const resolvedTheme = MEDITATION_THEMES.find(t => t.id === result.recommendedThemeId) || fallbackTheme;
        setBreathPhase('inhale');
        setPhaseSecondsLeft(resolvedTheme.breathingPattern.inhale);
      }
      setCustomPrescription(result);
    } catch (e) {
      console.warn('[Meditation] Generation fallback:', e);
      const fallback = getFallbackPrescription(isAuto ? 'stress_relief' : targetThemeId, trimmedCondition);
      setCustomPrescription(fallback);
    } finally {
      setIsGeneratingAi(false);
    }
  }, [isGeneratingAi, selectedThemeId, conditionInput, uid]);

  // 🌟 토스된 글자 자동 수신 및 1분 명상 AI 처방 즉시 실행
  useEffect(() => {
    const triggerAutoMeditation = (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < 2) return;
      sessionStorage.removeItem('prism_auto_execute_text');
      setConditionInput(trimmed);
      setActiveTab('custom');
      setTimeout(() => {
        void handleGenerateAiGuide('ai_auto', trimmed);
      }, 150);
    };

    if (typeof window !== 'undefined') {
      const autoText = sessionStorage.getItem('prism_auto_execute_text');
      if (autoText) {
        triggerAutoMeditation(autoText);
      }
    }

    const handleExecute = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail && detail.text && (detail.tab === 'oneMinute' || detail.tab === 'meditation' || detail.targetMenuId?.includes('heal') || detail.targetMenu?.path?.includes('heal'))) {
        triggerAutoMeditation(detail.text);
      }
    };
    window.addEventListener('prism:selection_execute', handleExecute);
    return () => window.removeEventListener('prism:selection_execute', handleExecute);
  }, [handleGenerateAiGuide]);

  // Pre-fill worry from profile if available, without auto-generating prescription
  useEffect(() => {
    const worry = sharedState?.userProfile?.fate?.currentWorry;
    if (worry && !conditionInput) {
      setConditionInput(worry);
    }
  }, [sharedState?.userProfile?.fate?.currentWorry, conditionInput]);

  // Quick Start with Custom Prescription
  const handleStartWithPrescription = (prescription?: OneMinuteMeditationPrescription) => {
    const p = prescription || customPrescription;
    if (p?.recommendedThemeId) {
      setSelectedThemeId(p.recommendedThemeId);
    }
    setActiveTab('session');
    handleReset();
    setTimeout(() => {
      handleTogglePlay(p?.completionAffirmation);
    }, 150);
  };

  // Copy Affirmation
  const handleCopyAffirmation = (text: string, recordId?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      playSuccessHaptic('sharp');
      if (recordId) {
        setCopiedRecordId(recordId);
        setTimeout(() => setCopiedRecordId(null), 2000);
      } else {
        setCopiedAffirmation(true);
        setTimeout(() => setCopiedAffirmation(false), 2000);
      }
    });
  };

  const progressPercent = ((TOTAL_DURATION - secondsRemaining) / TOTAL_DURATION) * 100;

  // Track session progress updates for smooth rotation animation feedback
  const [isUpdating, setIsUpdating] = useState(false);
  const prevProgressRef = useRef(progressPercent);

  useEffect(() => {
    if (isRunning && prevProgressRef.current !== progressPercent) {
      prevProgressRef.current = progressPercent;
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 650);
      return () => clearTimeout(timer);
    }
  }, [progressPercent, isRunning]);

  // Phase text & animation scale
  const getPhaseInfo = () => {
    switch (breathPhase) {
      case 'inhale':
        return {
          title: '들숨 (Inhale)',
          desc: '맑은 생기를 가슴 깊이 채웁니다',
          scale: 1.25,
          color: 'text-emerald-300',
          glow: 'rgba(16, 185, 129, 0.4)',
        };
      case 'hold':
        return {
          title: '머무름 (Hold)',
          desc: '고요한 평온 속에 머뭅니다',
          scale: 1.25,
          color: 'text-cyan-300',
          glow: 'rgba(6, 182, 212, 0.4)',
        };
      case 'exhale':
        return {
          title: '날숨 (Exhale)',
          desc: '모든 긴장과 무게를 비워냅니다',
          scale: 0.85,
          color: 'text-teal-300',
          glow: 'rgba(20, 184, 166, 0.3)',
        };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className={`w-full max-w-4xl mx-auto flex flex-col items-center ${isModal ? 'p-4 md:p-6' : ''}`}>
      {/* Header Banner */}
      <div className="w-full flex flex-col items-center text-center space-y-3 mb-6">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wider">
          <Sparkles size={14} className="animate-spin text-emerald-400" />
          <span>AURA BREATHING STUDIO · 1-MINUTE MINDFULNESS</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          AURA 호흡 스튜디오 <span className="text-emerald-400 text-lg md:text-xl font-medium font-sans">· Breathing Studio</span>
        </h2>
        <p className="text-xs md:text-sm text-white/60 max-w-xl leading-relaxed break-keep">
          하루 60초, 과부하된 뇌파를 알파파로 이완시키고 흩어진 생체 오라 에너지를 즉각 정렬하는 마이크로 호흡 명상 스튜디오입니다.
        </p>

        {/* Top Feature Nav Tabs */}
        <div className="top-nav sticky top-2 z-20 flex items-center justify-between flex-wrap gap-2 p-1.5 bg-zinc-950/70 border border-white/10 rounded-2xl mt-3 backdrop-blur-2xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5),0_2px_8px_-2px_rgba(0,0,0,0.35)]">
          <div className="nav-actions flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'custom'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={14} />
              <span>맞춤 처방</span>
            </button>

            <button
              onClick={() => setActiveTab('session')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'session'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Timer size={14} />
              <span>1분 호흡 세션</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>스튜디오 설정</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                refreshHistory();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <History size={14} />
              <span>기록실 ({stats.totalSessions})</span>
            </button>

            {/* Discreet Circular Progress Indicator for Current Practice Session */}
            <button
              type="button"
              onClick={() => setActiveTab('session')}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-mono ml-0.5 select-none transition-all cursor-pointer group shadow-sm ${
                isUpdating
                  ? 'bg-emerald-500/15 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10'
              }`}
              title={`현재 호흡 연습 세션 진행도: ${Math.round(progressPercent)}% (${secondsRemaining}초 남음)`}
            >
              <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                {/* Rotating SVG Ring Layer */}
                <div
                  className={`absolute inset-0 w-full h-full flex items-center justify-center ${
                    isUpdating
                      ? 'animate-progress-update-pulse'
                      : isRunning
                      ? 'animate-progress-spin-smooth'
                      : 'transition-transform duration-500'
                  }`}
                >
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.12)"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      fill="none"
                      stroke={activeTheme.color}
                      strokeWidth="2.5"
                      strokeDasharray={56.54}
                      strokeDashoffset={56.54 - (56.54 * Math.max(0, Math.min(100, progressPercent))) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        filter: `drop-shadow(0 0 4px ${activeTheme.color}90)`,
                      }}
                    />
                  </svg>
                </div>

                {/* Upright Center Content */}
                <div className="relative z-10 flex items-center justify-center pointer-events-none">
                  {progressPercent >= 100 ? (
                    <Check size={9} className="text-emerald-400 stroke-[3]" />
                  ) : isRunning ? (
                    <span className="text-[7px] font-bold text-emerald-300">
                      {secondsRemaining}
                    </span>
                  ) : (
                    <span className="text-[7px] font-bold text-white/50">
                      {Math.round(progressPercent)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-baseline gap-1 text-[11px] font-mono leading-none">
                <span className="text-[9px] uppercase tracking-wide text-white/40 font-sans hidden sm:inline">
                  연습
                </span>
                <span className={`font-bold transition-colors duration-300 ${isUpdating ? 'text-emerald-300' : 'text-white/90'}`}>
                  {Math.round(progressPercent)}%
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'session' && (
          <motion.div
            key="session-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full flex flex-col items-center space-y-8"
          >
            {/* 1. Dynamic AI Prescribed Theme Bar */}
            <div className="w-full max-w-lg flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-zinc-900/90 to-teal-950/60 border border-emerald-500/30 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl">{activeTheme.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white tracking-wide">{activeTheme.nameKo}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      AI 맞춤 {activeTheme.frequency}Hz
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/70 font-sans mt-0.5 line-clamp-1">
                    {customPrescription?.themeRecommendationReason || activeTheme.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer"
                title="고민 수정 및 맞춤 AI 처방 새로받기"
              >
                <Wand2 size={12} className="text-emerald-400" />
                <span>고민 변경</span>
              </button>
            </div>

            {/* 2. Central 1-Minute Visual Breathing Orb & Timer Ring */}
            <div className="relative flex flex-col items-center justify-center p-6 md:p-10 w-full max-w-lg rounded-[36px] bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black border border-white/10 shadow-2xl backdrop-blur-xl">
              {/* AI Recommendation Reason Banner (if prescribed) */}
              {customPrescription?.themeRecommendationReason && (
                <div className="w-full mb-3 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center gap-1.5 text-[11px] text-emerald-300 text-center font-medium">
                  <Sparkles size={13} className="text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">{customPrescription.themeRecommendationReason}</span>
                </div>
              )}

              {/* Sound & Mode & Haptic Controls Top Bar */}
              <div className="w-full flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Activity size={13} className="animate-pulse" />
                    {activeTheme.freqLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Haptic Feedback Quick Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleHaptic()}
                    title={hapticEnabled ? '들숨·날숨 햅틱 진동 끄기' : '들숨·날숨 햅틱 진동 켜기'}
                    className={`px-2.5 py-1.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                      hapticEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
                    }`}
                  >
                    <Vibrate size={14} className={hapticEnabled && isRunning ? 'animate-pulse text-emerald-400' : ''} />
                    <span className="text-[11px] font-medium hidden sm:inline">햅틱 {hapticEnabled ? 'ON' : 'OFF'}</span>
                  </button>

                  {/* Sound Toggle */}
                  <button
                    type="button"
                    onClick={toggleSound}
                    title={soundEnabled ? '솔페지오 주파수 사운드 끄기' : '사운드 켜기'}
                    className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                      soundEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
                    }`}
                  >
                    {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    <span className="text-[11px] font-medium hidden sm:inline">{soundEnabled ? '사운드 ON' : '사운드 OFF'}</span>
                  </button>

                  {/* Settings tab shortcut */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    title="호흡 스튜디오 환경 설정"
                    className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal size={14} />
                    <span className="text-[11px] hidden sm:inline">설정</span>
                  </button>
                </div>
              </div>

              {/* Pulsing Breathing Orb Area */}
              <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center my-4">
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-white/5"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="url(#emeraldGradient)"
                    strokeWidth="3.5"
                    strokeDasharray={276.46}
                    strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.7)) drop-shadow(0 0 14px rgba(6,182,212,0.4))',
                    }}
                  />
                  <defs>
                    <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Animated Inner Aura Breathing Circle */}
                <motion.div
                  animate={
                    isRunning
                      ? {
                          scale: phaseInfo.scale,
                          boxShadow: `0 0 60px ${phaseInfo.glow}, inset 0 0 40px ${phaseInfo.glow}`,
                        }
                      : {
                          scale: 1,
                          boxShadow: '0 0 30px rgba(16,185,129,0.15)',
                        }
                  }
                  transition={{
                    duration: isRunning ? (breathPhase === 'inhale' ? activeTheme.breathingPattern.inhale : breathPhase === 'hold' ? activeTheme.breathingPattern.hold : activeTheme.breathingPattern.exhale) : 1.5,
                    ease: 'easeInOut',
                  }}
                  className="w-44 h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-tr from-emerald-950/80 via-teal-900/60 to-zinc-900 border border-emerald-400/30 flex flex-col items-center justify-center text-center p-4 backdrop-blur-lg"
                >
                  {!isCompleted ? (
                    <>
                      <div className={`text-xs font-black tracking-widest uppercase mb-1 ${phaseInfo.color}`}>
                        {isRunning ? phaseInfo.title : '준비'}
                      </div>
                      <div className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
                        {secondsRemaining}
                        <span className="text-sm font-sans font-normal text-white/50 ml-1">초</span>
                      </div>
                      {isRunning && (
                        <div className="text-[11px] text-white/60 mt-1 font-medium break-keep px-2">
                          {phaseSecondsLeft}초 남음 · {phaseInfo.desc}
                        </div>
                      )}
                    </>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center justify-center space-y-1"
                    >
                      <CheckCircle2 size={36} className="text-emerald-400 animate-bounce" />
                      <div className="text-sm font-bold text-white">1분 명상 완료!</div>
                      <div className="text-[10px] text-emerald-300">평온한 에너지가 충전되었습니다</div>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Action Buttons: Play / Pause / Reset */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleReset}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all"
                  title="처음부터 다시 시작"
                >
                  <RotateCcw size={18} />
                </button>

                <button
                  onClick={() => handleTogglePlay()}
                  className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                      : isCompleted
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/30 scale-105'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause size={18} />
                      <span>일시 정지</span>
                    </>
                  ) : isCompleted ? (
                    <>
                      <Play size={18} />
                      <span>다시 1분 명상하기</span>
                    </>
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" />
                      <span>1분 명상 시작하기</span>
                    </>
                  )}
                </button>
              </div>

              {/* Active Theme Affirmation & Guide Box */}
              <div className="w-full mt-6 pt-5 border-t border-white/10 flex flex-col items-center text-center space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <span>{activeTheme.emoji}</span>
                  <span>{customPrescription?.meditationTitle || activeTheme.nameKo}</span>
                </div>
                <p className="text-xs md:text-sm text-white/80 italic max-w-md px-2 break-keep">
                  "{customPrescription?.completionAffirmation || activeTheme.affirmation}"
                </p>

                {/* TTS buttons to listen to affirmation or guide */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  {/* Continuous Auto-play Loop Toggle Button */}
                  <button
                    onClick={handleToggleContinuousAffirmation}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      isAffirmationLooping
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:text-white'
                    }`}
                  >
                    {isAffirmationLooping ? (
                      <>
                        <Volume2 size={13} className="text-emerald-400 animate-pulse" />
                        <span>확언 연속 자동 재생 중</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      </>
                    ) : (
                      <>
                        <RotateCcw size={12} className="text-emerald-300" />
                        <span>확언 연속 자동 재생</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70">
                    <TTSButton
                      text={customPrescription?.completionAffirmation || activeTheme.affirmation}
                      voice="Kore"
                      emotion="명상"
                    />
                    <span className="text-[11px] font-sans">1회 듣기</span>
                  </div>
                  <button
                    onClick={() => handleCopyAffirmation(customPrescription?.completionAffirmation || activeTheme.affirmation)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/70 hover:text-white transition-all"
                  >
                    {copiedAffirmation ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedAffirmation ? '복사됨' : '확언 복사'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Real-Time 4-Step Guided Mindfulness Steps */}
            <div className="w-full max-w-lg rounded-3xl bg-white/[0.03] border border-white/5 p-5 space-y-3">
              <h4 className="text-xs font-bold text-white/70 flex items-center gap-2 uppercase tracking-wider">
                <Wind size={14} className="text-emerald-400" />
                <span>60초 호흡 실천 가이드</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeTheme.guideSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-white/80 leading-relaxed font-sans break-keep">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-xl space-y-6"
          >
            <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-emerald-500/30 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <SlidersHorizontal size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">호흡 스튜디오 환경 설정 (Breathing Studio Settings)</h3>
                  <p className="text-xs text-white/60">
                    모바일 햅틱 진동 피드백, 배경 치유음, 확언 보이스 및 호흡 주기를 세밀하게 조정합니다.
                  </p>
                </div>
              </div>

              {/* 1. Haptic Feedback Setting Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-emerald-500/25 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${hapticEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-white/40 border-white/10'}`}>
                      <Vibrate size={20} className={hapticEnabled ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Haptic Feedback</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          hapticEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-white/40'
                        }`}>
                          {hapticEnabled ? '활성화됨 (ON)' : '꺼짐 (OFF)'}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">
                        들숨(Inhale)과 날숨(Exhale) 구간에 부드러운 햅틱 진동 펄스 전달
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={hapticEnabled}
                    onClick={() => handleToggleHaptic()}
                    className={`w-13 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out shrink-0 ${
                      hapticEnabled ? 'bg-emerald-600' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`bg-white w-5 h-5 rounded-full shadow-md ${
                        hapticEnabled ? 'ml-auto' : 'mr-auto'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-white/70 leading-relaxed break-keep bg-black/30 p-3 rounded-xl border border-white/5">
                  🌿 <strong>모바일 전용 체감 안내:</strong> 스마트폰 기기에서 화면을 보지 않고 눈을 감은 상태에서도, 들숨 시 서서히 커지는 상승 펄스와 날숨 시 차분히 가라앉는 이완 펄스를 손끝으로 느끼며 편안하게 호흡에 몰입할 수 있습니다.
                </p>

                {/* Device Status & Test Buttons */}
                <div className="pt-2 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50 flex items-center gap-1.5">
                      <Smartphone size={13} className="text-emerald-400" />
                      디바이스 지원 상태:
                    </span>
                    <span className={`font-semibold ${isHapticsSupported() ? 'text-emerald-300' : 'text-amber-300/80'}`}>
                      {isHapticsSupported() ? '모바일 진동 지원 확인됨 (Vibration API Ready)' : '데스크톱 / 비지원 브라우저 (모바일 기기에서 지원)'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-white/50 shrink-0">진동 감각 테스트:</span>
                    <button
                      type="button"
                      onClick={() => handleTestHaptic('inhale')}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        hapticTestPhase === 'inhale'
                          ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-white/5 hover:bg-emerald-500/20 border-white/10 hover:border-emerald-500/40 text-emerald-300'
                      }`}
                      title="들숨 팽창 3단계 펄스 테스트"
                    >
                      <Wind size={12} className={hapticTestPhase === 'inhale' ? 'animate-bounce text-emerald-300' : 'text-emerald-400'} />
                      <span>{hapticTestPhase === 'inhale' ? '들숨 펄스 진동 중...' : '들숨(Inhale) 펄스 테스트'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTestHaptic('exhale')}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        hapticTestPhase === 'exhale'
                          ? 'bg-teal-500/30 border-teal-400 text-teal-200 shadow-[0_0_10px_rgba(20,184,166,0.3)]'
                          : 'bg-white/5 hover:bg-teal-500/20 border-white/10 hover:border-teal-500/40 text-teal-300'
                      }`}
                      title="날숨 이완 3단계 펄스 테스트"
                    >
                      <Moon size={12} className={hapticTestPhase === 'exhale' ? 'animate-bounce text-teal-300' : 'text-teal-400'} />
                      <span>{hapticTestPhase === 'exhale' ? '날숨 펄스 진동 중...' : '날숨(Exhale) 펄스 테스트'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Audio & Guide Setting Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                  <Volume2 size={14} className="text-emerald-400" />
                  <span>사운드 및 음성 가이드 설정</span>
                </h4>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <span className="text-xs font-semibold text-white block">솔페지오 치유 주파수 사운드</span>
                    <span className="text-[11px] text-white/50">세션 시작 시 432Hz/528Hz 치유 톤 및 싱잉볼 차임 재생</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundEnabled}
                    onClick={toggleSound}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                      soundEnabled ? 'bg-emerald-600' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`bg-white w-4 h-4 rounded-full shadow-md ${
                        soundEnabled ? 'ml-auto' : 'mr-auto'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <span className="text-xs font-semibold text-white block">Kore AI 음성 확언 연속 재생</span>
                    <span className="text-[11px] text-white/50">호흡 간격 사이에 부드러운 한국어 음성으로 치유 확언 낭독</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isAffirmationLooping}
                    onClick={handleToggleContinuousAffirmation}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                      isAffirmationLooping ? 'bg-emerald-600' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`bg-white w-4 h-4 rounded-full shadow-md ${
                        isAffirmationLooping ? 'ml-auto' : 'mr-auto'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 3. Current Breathing Pattern & Themes */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                    <Activity size={14} className="text-emerald-400" />
                    <span>현재 호흡 리듬 패턴</span>
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold">
                    {activeTheme.nameKo}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-300/80 block uppercase font-bold">들숨 (Inhale)</span>
                    <span className="text-lg font-black text-white font-mono">{activeTheme.breathingPattern.inhale}초</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">상승 진동 펄스</span>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <span className="text-[10px] text-cyan-300/80 block uppercase font-bold">멈춤 (Hold)</span>
                    <span className="text-lg font-black text-white font-mono">{activeTheme.breathingPattern.hold}초</span>
                    <span className="text-[10px] text-cyan-400 block mt-0.5">고요한 머무름</span>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                    <span className="text-[10px] text-teal-300/80 block uppercase font-bold">날숨 (Exhale)</span>
                    <span className="text-lg font-black text-white font-mono">{activeTheme.breathingPattern.exhale}초</span>
                    <span className="text-[10px] text-teal-400 block mt-0.5">이완 진동 펄스</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('session')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>이 설정으로 호흡 세션 시작하기</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'custom' && (
          <motion.div
            key="custom-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-xl space-y-6"
          >
            <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-emerald-500/30 shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI 맞춤 1분 명상 처방</h3>
                  <p className="text-xs text-white/60">
                    지금 느껴지는 감정이나 몸의 상태를 적어주시면, 오라 에너지에 최적화된 60초 명상을 즉시 설계합니다.
                  </p>
                </div>
              </div>

              {/* Condition Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/70">지금 나의 상태 / 고민 (입력 시 AI 테마 자동 매칭)</label>
                  {conditionInput.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        const inferred = inferThemeFromConcern(conditionInput.trim());
                        setSelectedThemeId(inferred.themeId);
                      }}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
                    >
                      <Sparkles size={12} />
                      <span>AI 테마 자동 선택</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={conditionInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConditionInput(val);
                      if (inputErrorMsg) setInputErrorMsg(null);
                      if (val.trim()) {
                        const inferred = inferThemeFromConcern(val.trim());
                        setSelectedThemeId(inferred.themeId);
                      }
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateAiGuide()}
                    placeholder="예: 회의 전 긴장돼요, 눈이 피로하고 머리가 무거워요, 자책감이 들어요"
                    className={`w-full px-4 py-3.5 pr-12 rounded-2xl bg-white/5 border text-white text-xs placeholder:text-white/30 focus:outline-none transition-all ${
                      inputErrorMsg ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-white/10 focus:border-emerald-400'
                    }`}
                  />
                  <button
                    onClick={() => handleGenerateAiGuide()}
                    disabled={isGeneratingAi}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-30 transition-all cursor-pointer"
                  >
                    {isGeneratingAi ? <Sparkles size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>

                {inputErrorMsg && (
                  <p className="text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-xl px-3 py-2 font-medium flex items-center gap-1.5 animate-shake">
                    <span>⚠️</span>
                    <span>{inputErrorMsg}</span>
                  </p>
                )}

                {/* Live AI Auto Theme Diagnosis Banner */}
                {conditionInput.trim() && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs animate-fade-in mt-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-emerald-400 shrink-0" />
                      <div className="text-left">
                        <span className="font-bold text-emerald-300">
                          AI 자동 테마: {MEDITATION_THEMES.find(t => t.id === inferThemeFromConcern(conditionInput.trim()).themeId)?.emoji} {MEDITATION_THEMES.find(t => t.id === inferThemeFromConcern(conditionInput.trim()).themeId)?.nameKo}
                        </span>
                        <span className="text-[11px] text-white/60 block mt-0.5 leading-tight">
                          {inferThemeFromConcern(conditionInput.trim()).reason}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedThemeId(inferThemeFromConcern(conditionInput.trim()).themeId)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-[11px] font-bold border border-emerald-500/30 transition-all shrink-0 ml-2"
                    >
                      테마 적용
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  '업무 과부하로 머리가 지끈거려요',
                  '발표나 대화 전 불안과 긴장 완화',
                  '잠들기 전 생각의 스위치 끄기',
                  '나에게 다정한 칭찬과 위로 주기',
                ].map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => setConditionInput(promptText)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-white/60 hover:text-white transition-all"
                  >
                    #{promptText}
                  </button>
                ))}
              </div>

              {/* Prescribe Button */}
              <button
                onClick={() => handleGenerateAiGuide()}
                disabled={isGeneratingAi}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {isGeneratingAi ? (
                  <>
                    <Sparkles size={16} className="animate-spin" />
                    <span>나만을 위한 1분 명상 설계 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>맞춤 1분 명상 처방받기</span>
                  </>
                )}
              </button>

              {/* Tailored Custom Prescription Result Card */}
              {customPrescription && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-zinc-900 to-black border-2 border-emerald-500/40 shadow-2xl space-y-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {MEDITATION_THEMES.find(t => t.id === customPrescription.recommendedThemeId)?.emoji || '✨'}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                          AI 맞춤 처방 결과
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {customPrescription.meditationTitle}
                        </h4>
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      {MEDITATION_THEMES.find(t => t.id === customPrescription.recommendedThemeId)?.frequency || 528}Hz
                    </span>
                  </div>

                  {customPrescription.themeRecommendationReason && (
                    <p className="text-xs text-emerald-200/80 bg-emerald-900/30 border border-emerald-500/20 rounded-xl p-2.5 leading-relaxed">
                      💡 {customPrescription.themeRecommendationReason}
                    </p>
                  )}

                  {/* Highlighted Short Affirmation */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-emerald-400/30 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      맞춤 확언 (Affirmation)
                    </span>
                    <p className="text-sm md:text-base font-bold text-white leading-relaxed break-keep">
                      "{customPrescription.completionAffirmation}"
                    </p>
                  </div>

                  {/* Actions: Start with this affirmation, Copy, TTS */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                    <button
                      onClick={() => handleStartWithPrescription(customPrescription)}
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <Play size={14} fill="currentColor" />
                      <span>이 확언으로 1분 명상 시작하기</span>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 px-2">
                        <TTSButton text={customPrescription.completionAffirmation} voice="Kore" emotion="명상" />
                        <span className="text-[10px] text-white/60">음성 듣기</span>
                      </div>

                      <button
                        onClick={() => handleCopyAffirmation(customPrescription.completionAffirmation)}
                        className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        {copiedAffirmation ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span>{copiedAffirmation ? '복사됨' : '확언 복사'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-2xl space-y-6"
          >
            {/* Stats Summary Card */}
            <div className="grid grid-cols-3 gap-3 p-5 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/5">
                <span className="text-[10px] text-white/50 font-bold uppercase">오늘 완료</span>
                <span className="text-xl md:text-2xl font-black text-emerald-400 mt-1 font-mono">
                  {stats.todayCount}회
                </span>
                <span className="text-[10px] text-white/40">{stats.todayCount * 60}초 완료</span>
              </div>

              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/5">
                <span className="text-[10px] text-white/50 font-bold uppercase">누적 세션</span>
                <span className="text-xl md:text-2xl font-black text-teal-300 mt-1 font-mono">
                  {stats.totalSessions}회
                </span>
                <span className="text-[10px] text-white/40">꾸준한 마음챙김</span>
              </div>

              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/5">
                <span className="text-[10px] text-white/50 font-bold uppercase">총 명상 시간</span>
                <span className="text-xl md:text-2xl font-black text-cyan-300 mt-1 font-mono">
                  {Math.floor(stats.totalSeconds / 60)}분
                </span>
                <span className="text-[10px] text-white/40">누적 이완 시간</span>
              </div>
            </div>

            {/* Archive List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-xs font-bold text-white/80 flex items-center gap-2">
                  <History size={14} className="text-emerald-400" />
                  <span>나의 1분 명상 실천 아카이브</span>
                </h4>
                <span className="text-[11px] text-white/40">총 {historyList.length}건 기록</span>
              </div>

              {loadingHistory ? (
                <div className="p-8 text-center text-xs text-white/40 flex items-center justify-center gap-2">
                  <Sparkles size={14} className="animate-spin text-emerald-400" />
                  <span>명상 기록을 불러오는 중...</span>
                </div>
              ) : historyList.length === 0 ? (
                <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 text-center space-y-2">
                  <Heart size={28} className="mx-auto text-white/20" />
                  <p className="text-xs text-white/50">아직 완료한 1분 명상 기록이 없습니다.</p>
                  <button
                    onClick={() => setActiveTab('session')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all mt-2"
                  >
                    첫 1분 명상 시작하기
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {historyList.map((record) => {
                    const theme = MEDITATION_THEMES.find(t => t.id === record.themeId) || MEDITATION_THEMES[0];
                    return (
                      <div
                        key={record.id}
                        className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{theme.emoji}</span>
                            <span className="text-xs font-bold text-white">{record.themeTitle}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                              60초 완료
                            </span>
                          </div>
                          <span className="text-[10px] text-white/40 font-mono">
                            {new Date(record.completedAt).toLocaleDateString('ko-KR', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {record.userCondition && (
                          <div className="text-[11px] text-emerald-300/80 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            상태: {record.userCondition}
                          </div>
                        )}

                        <p className="text-xs text-white/80 italic pl-1 border-l-2 border-emerald-500/40">
                          "{record.affirmation}"
                        </p>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleCopyAffirmation(record.affirmation, record.id)}
                            className="flex items-center gap-1 text-[10px] text-white/50 hover:text-white transition-all px-2 py-1 rounded bg-white/5"
                          >
                            {copiedRecordId === record.id ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                            <span>{copiedRecordId === record.id ? '복사됨' : '확언 복사'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
