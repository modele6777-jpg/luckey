import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Activity,
  Heart,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Flame,
  Feather,
  BookOpen,
  History,
  Timer,
  Compass,
  Smile,
  Info,
  Layers,
  Send,
  Brain,
  Play,
  Pause
} from 'lucide-react';
import { auth, db, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from '@/lib/firebase';
import { TTSButton } from '@/components/TTSButton';
import { useApp } from '@/contexts/AppContext';
import { sendLettingGoSessionToLucy } from '@/lib/oracleDeepInsight';
import {
  HAWKINS_EMOTIONAL_SPECTRUM,
  SEDONA_ROOT_DESIRES,
  SOMATIC_ZONES,
  LETTING_GO_CORE_CANON,
  inferHawkinsEmotionFromConcern,
  inferSedonaRootDesireFromConcern,
  type HawkinsEmotionLevel,
  type SedonaRootDesire,
  type SomaticZone,
} from '@/lib/lettingGoWisdom';
import { SEDONA_CORE_CANON } from '@/lib/sedonaWisdom';
import { getTodayDateKey } from '@/lib/dailyCache';
import { getKoreanParticle, attachKoreanParticle, extractCleanConcernNoun } from '@/utils/koreanGrammar';
import { meditationSound } from '@/lib/oneMinuteMeditation';

// Web Audio API Solfeggio Sound Generator
function playSolfeggioTone(freq: number, durationMs = 3000) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm smooth attack and long meditative decay
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000 + 0.1);
  } catch {
    // Audio playback optional in headless / restrictive contexts
  }
}

const PRESET_ISSUES = [
  '직장/상사의 지적이나 평가에 대한 억울함',
  '미래 경제적 불확실성과 진로에 대한 막막함',
  '과거 실수와 바보 같았던 선택에 대한 자책감',
  '타인에게 거절당하거나 미움받을 것 같은 불안',
  '내 맘대로 통제되지 않는 상황에 대한 분노',
  '끝없는 무기력과 번아웃, 삶의 공허함',
  '가족이나 연인에 대한 서운함과 원망',
  '완벽해야 한다는 강박과 인정받지 못한 박탈감',
];

const THOUGHT_PRESETS = [
  '내가 부족해서 모든 걸 다 망칠 것 같아...',
  '그 사람이 어떻게 나한테 그럴 수가 있어?',
  '왜 항상 나한테만 이런 억울한 일이 생길까?',
  '아무리 노력해도 앞으로 상황이 나아지지 않을 거야...',
  '내가 그때 그렇게 바보같이 행동하지 말았어야 했는데...',
];

export interface ReleaseHistoryEntry {
  id: string;
  targetIssue: string;
  emotionName: string;
  consciousnessLevel: number;
  somaticZone: string;
  rootDesireName: string;
  preSuds: number;
  postSuds: number;
  date: string;
  timestamp: number;
  prescription: string;
}

interface SedonaDailyViewProps {
  firebaseUser?: { uid: string } | null;
  onDailyComplete?: () => void;
}

export function SedonaDailyView({ firebaseUser, onDailyComplete }: SedonaDailyViewProps) {
  const { sharedState, updateSharedState, openLucyChat, sendUnifiedMessage } = useApp();
  const todayKey = getTodayDateKey();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'sos' | 'workshop' | 'codex' | 'history'>('sos');
  const [codexFilter, setCodexFilter] = useState<'all' | 'hawkins' | 'sedona' | 'spectrum' | 'desires'>('all');

  // Master Workshop Steps (0: Target & Emotion, 1: Somatic Surrender, 2: Root Desire, 3: 4-Questions & Grip Release, 4: Result)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Form State
  const [targetIssue, setTargetIssue] = useState<string>('');
  const [selectedEmotion, setSelectedEmotion] = useState<HawkinsEmotionLevel>(HAWKINS_EMOTIONAL_SPECTRUM[4]); // Fear default
  const [preSuds, setPreSuds] = useState<number>(8);
  const [postSuds, setPostSuds] = useState<number>(1);
  const [selectedZone, setSelectedZone] = useState<SomaticZone>(SOMATIC_ZONES[0]); // Chest default
  const [selectedDesire, setSelectedDesire] = useState<SedonaRootDesire>(SEDONA_ROOT_DESIRES[0]); // Control default
  const [recognizedEgoGain, setRecognizedEgoGain] = useState<boolean>(true);

  // Thought-Stopping Protocol (Step 1)
  const [thoughtInput, setThoughtInput] = useState<string>('');
  const [isVaporizing, setIsVaporizing] = useState<boolean>(false);
  const [vaporizedThought, setVaporizedThought] = useState<string | null>(null);
  const [isStopFlash, setIsStopFlash] = useState<boolean>(false);
  const [hasPerformedStop, setHasPerformedStop] = useState<boolean>(false);
  const [gapTimer, setGapTimer] = useState<number>(5);
  const [isGapTimerActive, setIsGapTimerActive] = useState<boolean>(false);
  const [hasCompletedGap, setHasCompletedGap] = useState<boolean>(false);
  const [activeThoughtTechnique, setActiveThoughtTechnique] = useState<'vaporizer' | 'stop_switch' | 'gap_silence'>('vaporizer');

  // Interactive Somatic Surrender Timer
  const [surrenderTimer, setSurrenderTimer] = useState<number>(15);
  const [isSurrenderActive, setIsSurrenderActive] = useState<boolean>(false);
  const [hasCompletedSomaticHold, setHasCompletedSomaticHold] = useState<boolean>(false);

  // Interactive Grip Release (Hold to let go)
  const [gripHoldProgress, setGripHoldProgress] = useState<number>(0);
  const [isGripHolding, setIsGripHolding] = useState<boolean>(false);
  const [isReleasedAnimation, setIsReleasedAnimation] = useState<boolean>(false);
  const gripHoldIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Question wizard inside step 3
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  // Result & AI Prescription
  const [prescription, setPrescription] = useState<string>('');
  const [isGeneratingResult, setIsGeneratingResult] = useState<boolean>(false);

  // Local & Firebase History
  const [historyList, setHistoryList] = useState<ReleaseHistoryEntry[]>([]);

  // Load History
  const loadHistory = useCallback(async () => {
    try {
      const local = localStorage.getItem('letting_go_history');
      if (local) {
        setHistoryList(JSON.parse(local));
      }
      if (firebaseUser?.uid) {
        const q = query(
          collection(db, 'heal_history', firebaseUser.uid, 'entries'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const snap = await getDocs(q);
        const list: ReleaseHistoryEntry[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          if (data.type === 'letting_go_master' || data.type === 'meditation') {
            list.push({
              id: doc.id,
              targetIssue: data.metadata?.targetIssue || data.title || '방하착 세션',
              emotionName: data.metadata?.emotion || '감정 정화',
              consciousnessLevel: data.metadata?.level || 100,
              somaticZone: data.metadata?.somaticZone || '가슴',
              rootDesireName: data.metadata?.rootDesire || '통제 욕구',
              preSuds: data.metadata?.preSuds || 8,
              postSuds: data.metadata?.postSuds || 1,
              date: data.metadata?.date || todayKey,
              timestamp: data.createdAt?.toMillis?.() || Date.now(),
              prescription: data.content || '',
            });
          }
        });
        if (list.length > 0) {
          setHistoryList(list);
          localStorage.setItem('letting_go_history', JSON.stringify(list));
        }
      }
    } catch {
      // Graceful fallback
    }
  }, [firebaseUser?.uid, todayKey]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  // Somatic timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isSurrenderActive && surrenderTimer > 0) {
      timer = setInterval(() => {
        setSurrenderTimer((prev) => {
          if (prev <= 1) {
            setIsSurrenderActive(false);
            setHasCompletedSomaticHold(true);
            playSolfeggioTone(528, 4000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSurrenderActive, surrenderTimer]);

  // Gap Silence Timer Effect (The Gap between thoughts)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isGapTimerActive && gapTimer > 0) {
      timer = setInterval(() => {
        setGapTimer((prev) => {
          if (prev <= 1) {
            setIsGapTimerActive(false);
            setHasCompletedGap(true);
            try {
              meditationSound.playSingingBowlBell();
            } catch (_) {
              playSolfeggioTone(528, 3000);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGapTimerActive, gapTimer]);

  const startGapTimer = () => {
    setGapTimer(5);
    setIsGapTimerActive(true);
    setHasCompletedGap(false);
    playSolfeggioTone(432, 1500);
  };

  const handleVaporizeThought = () => {
    if (!thoughtInput.trim()) return;
    setIsVaporizing(true);
    playSolfeggioTone(528, 2500);
    setTimeout(() => {
      setVaporizedThought(thoughtInput.trim());
      setThoughtInput('');
      setIsVaporizing(false);
    }, 700);
  };

  const handleTriggerStopFlash = () => {
    setIsStopFlash(true);
    setHasPerformedStop(true);
    playSolfeggioTone(396, 1800);
    setTimeout(() => {
      setIsStopFlash(false);
    }, 800);
  };

  // Start Somatic Hold
  const startSomaticHold = () => {
    setSurrenderTimer(15);
    setIsSurrenderActive(true);
    setHasCompletedSomaticHold(false);
    playSolfeggioTone(432, 2500);
  };

  // Stop Somatic Hold
  const stopSomaticHold = () => {
    setIsSurrenderActive(false);
  };

  // Ensure somatic hold never autoplays on step transitions
  useEffect(() => {
    setIsSurrenderActive(false);
  }, [currentStep]);

  // Grip Hold Handling (Press & hold to grip pen, wait until mouse release to drop pen)
  const handleGripMouseDown = () => {
    if (isReleasedAnimation) return;
    setIsGripHolding(true);
    setGripHoldProgress(0);

    playSolfeggioTone(396, 1500);

    if (gripHoldIntervalRef.current) clearInterval(gripHoldIntervalRef.current);
    gripHoldIntervalRef.current = setInterval(() => {
      setGripHoldProgress((prev) => {
        if (prev >= 100) {
          // Reached full grip tension! Keep holding and WAIT until user releases mouse!
          return 100;
        }
        return prev + 4;
      });
    }, 40);
  };

  const handleGripMouseUp = () => {
    if (isReleasedAnimation) return;
    if (!isGripHolding) return;
    setIsGripHolding(false);
    if (gripHoldIntervalRef.current) clearInterval(gripHoldIntervalRef.current);

    // The user has released the mouse (opened their hand) -> drop the pen!
    handleGripReleaseTrigger();
  };

  // Global mouseup & touchend listener while holding to ensure release triggers anywhere
  useEffect(() => {
    if (!isGripHolding) return;
    const onWindowRelease = () => {
      handleGripMouseUp();
    };
    window.addEventListener('mouseup', onWindowRelease);
    window.addEventListener('touchend', onWindowRelease);
    return () => {
      window.removeEventListener('mouseup', onWindowRelease);
      window.removeEventListener('touchend', onWindowRelease);
    };
  }, [isGripHolding, isReleasedAnimation]);

  const handleGripReleaseTrigger = () => {
    setIsReleasedAnimation(true);
    playSolfeggioTone(639, 4000);
    setTimeout(() => {
      finishReleaseSession();
    }, 1400);
  };

  // Generate Final Synthesis Prescription (방하착 마음 회복 소견서)
  const finishReleaseSession = async () => {
    setIsGeneratingResult(true);
    setCurrentStep(4);

    const rawIssue = targetIssue.trim() || '마음의 무거운 응어리';
    const cleanIssue = extractCleanConcernNoun(rawIssue, '마음의 응어리');
    const emoShort = selectedEmotion.nameKo.split(' ')[0];
    const desireShort = selectedDesire.nameKo.split(' ')[0];
    const levelNum = selectedEmotion.level;
    const zoneText = selectedZone.name;
    const reliefScore = Math.max(0, preSuds - postSuds);

    const summaryNote = `[방하착 완료] ${cleanIssue} (${emoShort} · Lv.${levelNum}) — ${desireShort} 욕구 및 무의식 집착을 가볍게 흘려보냄 (고통 전압: ${preSuds} → ${postSuds})`;

    setPrescription(summaryNote);
    setIsGeneratingResult(false);

    // Save to history
    const newEntry: ReleaseHistoryEntry = {
      id: `rel_${Date.now()}`,
      targetIssue: cleanIssue,
      emotionName: emoShort,
      consciousnessLevel: levelNum,
      somaticZone: zoneText,
      rootDesireName: `${desireShort} 욕구`,
      preSuds,
      postSuds,
      date: todayKey,
      timestamp: Date.now(),
      prescription: summaryNote,
    };

    const updated = [newEntry, ...historyList.filter((h) => h.id !== newEntry.id)].slice(0, 30);
    setHistoryList(updated);
    localStorage.setItem('letting_go_history', JSON.stringify(updated));

    // Save to Firebase
    if (firebaseUser?.uid) {
      addDoc(collection(db, 'heal_history', firebaseUser.uid, 'entries'), {
        type: 'letting_go_master',
        title: `방하착 마스터 릴리즈: ${cleanIssue}`,
        content: summaryNote,
        createdAt: serverTimestamp(),
        metadata: {
          targetIssue: cleanIssue,
          emotion: emoShort,
          level: levelNum,
          somaticZone: zoneText,
          rootDesire: `${desireShort} 욕구`,
          preSuds,
          postSuds,
          date: todayKey,
        },
      }).catch((err) => console.warn('Firebase letting go save failed:', err));
    }

    try {
      void updateSharedState({ lastHealDailySync: Date.now() }, 'HEAL');
    } catch {
      // Ignored
    }
    onDailyComplete?.();
  };

  const resetWorkshop = () => {
    setCurrentStep(0);
    setTargetIssue('');
    setQuestionIndex(0);
    setIsSurrenderActive(false);
    setHasCompletedSomaticHold(false);
    setGripHoldProgress(0);
    setIsGripHolding(false);
    setIsReleasedAnimation(false);
    setPreSuds(8);
    setPostSuds(1);
    setThoughtInput('');
    setVaporizedThought(null);
    setHasPerformedStop(false);
    setHasCompletedGap(false);
  };

  const startQuickSos = (issue: string) => {
    setTargetIssue(issue);
    if (issue.trim()) {
      const autoEmo = inferHawkinsEmotionFromConcern(issue);
      setSelectedEmotion(autoEmo);
      const autoDesire = inferSedonaRootDesireFromConcern(issue);
      setSelectedDesire(autoDesire);
    }
    setActiveTab('workshop');
    setCurrentStep(0);
  };

  const handleTargetIssueChange = (text: string) => {
    setTargetIssue(text);
    if (text.trim().length >= 2) {
      const autoEmo = inferHawkinsEmotionFromConcern(text);
      setSelectedEmotion(autoEmo);
      const autoDesire = inferSedonaRootDesireFromConcern(text);
      setSelectedDesire(autoDesire);
    }
  };

  return (
    <div className="space-y-8 text-left animate-fade-in font-sans w-full max-w-5xl mx-auto px-2 sm:px-4 text-white">
      {/* Header Banner */}
      <div className="text-center space-y-3 pt-2 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-mono tracking-widest uppercase">
          <ShieldCheck size={14} />
          <span>DAVID HAWKINS &times; LESTER LEVENSON MASTER WORKSHOP</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-white tracking-tight font-bold">
          Letting Go &amp; Sedona Method
        </h2>
        <p className="text-xs sm:text-sm text-emerald-300/80 max-w-2xl mx-auto font-sans leading-relaxed">
          생각의 장작을 끊고 신체 느낌에 온전히 항복하며, 4대 근원 욕구의 집착을 손바닥 펴듯 내려놓는 실전 방하착 도구
        </p>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('sos')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'sos'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <Zap size={14} />
            <span>1분 급성 SOS 방하착</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workshop')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'workshop'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <Sparkles size={14} />
            <span>4단계 마스터 릴리즈 (생각 멈춤 &amp; 방하착)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('codex')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'codex'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <BookOpen size={14} />
            <span>호킨스 &amp; 세도나 지혜 도감</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <History size={14} />
            <span>정화 일지 ({historyList.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 1-MINUTE SOS RAPID RELEASE */}
      {activeTab === 'sos' && (
        <div className="w-full rounded-3xl bg-zinc-950/80 border border-amber-500/25 p-6 sm:p-10 backdrop-blur-2xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
              <Zap size={14} />
              <span>1-MIN SOS RAPID RELEASE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              급성 불안 &middot; 분노 &middot; 멘탈 붕괴 1분 응급 처방
            </h3>
            <p className="text-xs text-white/60">
              회의 직전, 말다툼 직후, 공황이나 패닉이 올 때 즉시 신체 감각을 대면하고 손바닥을 펴는 초고속 릴리즈
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto pt-4">
            {PRESET_ISSUES.map((issue) => (
              <button
                key={issue}
                type="button"
                onClick={() => startQuickSos(issue)}
                className="p-4 rounded-2xl bg-white/[0.02] hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 text-left transition-all group cursor-pointer flex items-center justify-between"
              >
                <span className="text-xs font-medium text-white/80 group-hover:text-amber-200 leading-snug">{issue}</span>
                <ArrowRight size={14} className="text-white/20 group-hover:text-amber-300 shrink-0 ml-2" />
              </button>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-300">1분 호킨스 3대 응급 수칙</span>
            <p className="text-[11px] text-white/70 leading-relaxed font-sans">
              1. <strong>생각 즉시 음소거</strong> ("왜 나한테 이런 일이" 분석 중단)<br />
              2. <strong>가슴과 명치의 조임을 그대로 버티기</strong> (도망치지 않고 15초 직면)<br />
              3. <strong>손바닥을 쫙 펴며 날숨</strong> ("다 가져가라, 허공으로 돌려보낸다")
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: 4-STEP MASTER WORKSHOP */}
      {activeTab === 'workshop' && (
        <div className="w-full rounded-3xl bg-zinc-950/80 border border-emerald-500/25 p-5 sm:p-8 md:p-10 backdrop-blur-2xl space-y-8 shadow-2xl relative overflow-hidden">
          {/* Step Progress Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                STEP {currentStep + 1} / 5
              </span>
              <span className="text-white/40 text-xs hidden sm:inline">&bull;</span>
              <span className="text-xs text-white/70 font-semibold">
                {currentStep === 0 && '1단계: 마음의 타겟팅 & 호킨스 감정 진단'}
                {currentStep === 1 && '2단계: [호킨스] 생각 멈춤 훈련 & 신체 소매틱 항복'}
                {currentStep === 2 && '3단계: [세도나] 4대 근원 욕구 & 2차 이득 해체'}
                {currentStep === 3 && '4단계: [세도나] 4문답 & 인터랙티브 볼펜 놓기'}
                {currentStep === 4 && '5단계: 방하착 완료 & 참나 현존'}
              </span>
            </div>

            {currentStep > 0 && currentStep < 4 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-all cursor-pointer"
              >
                이전 단계
              </button>
            )}
          </div>

          {/* Step 1: Target & Emotion */}
          {currentStep === 0 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Flame size={16} className="text-amber-400" />
                  <span>지금 내 마음에 맺힌 상황이나 고민은 무엇인가요?</span>
                </label>
                <input
                  type="text"
                  value={targetIssue}
                  onChange={(e) => handleTargetIssueChange(e.target.value)}
                  placeholder="예: 회의 시간에 무시당한 것 같아 자꾸 억울하고 잠이 안 온다..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-400 transition-all"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {PRESET_ISSUES.map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => handleTargetIssueChange(issue)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-[11px] text-white/60 hover:text-emerald-300 transition-all text-left cursor-pointer"
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hawkins Consciousness Level Selection */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Compass size={16} className="text-emerald-400" />
                    <span>호킨스 의식 스펙트럼 (고민 맞춤 자동 주파수)</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    현재: {selectedEmotion.nameKo} (Lv.{selectedEmotion.level})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {HAWKINS_EMOTIONAL_SPECTRUM.map((emo) => {
                    const isSelected = selectedEmotion.id === emo.id;
                    return (
                      <button
                        key={emo.id}
                        type="button"
                        onClick={() => setSelectedEmotion(emo)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/15 shadow-md shadow-emerald-500/10'
                            : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-white">{emo.nameKo.split(' ')[0]}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                            {emo.level}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/40 line-clamp-1">{emo.viewOfLife}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pre-SUDS Slider */}
              <div className="space-y-2 pt-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/70 font-semibold">지금 이 감정의 고통 전압 (SUDS 지수: 0 ~ 10)</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">{preSuds} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={preSuds}
                  onChange={(e) => setPreSuds(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-white/30 font-mono">
                  <span>1 (미미함)</span>
                  <span>5 (답답함)</span>
                  <span>10 (숨 막히고 압도됨)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <span>다음: 호킨스 신체 항복(Surrender) 단계로</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {/* Step 2: Hawkins Somatic Surrender & Thought Stopping */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold">
                  <span>🛑 생각 멈춤 (Thought-Stopping) &amp; 신체 소매틱 항복</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-light text-slate-100">
                  머릿속 스토리를 멈추고, <br className="hidden sm:inline" />
                  <span className="text-emerald-300 font-semibold">신체 감각 자체에 완전히 항복하세요</span>
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  "생각은 감정의 불에 기름을 붓는 에고의 장작입니다. 생각을 끊고 몸의 뻐근하고 뜨거운 느낌 자체를 100% 허용하면, 압력밥솥의 증기처럼 스스로 증발합니다."
                </p>
              </div>

              {/* SECTION A: Thought-Stopping Protocol (생각 멈춤 실천 도구함) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/70 border border-emerald-500/30 space-y-5 max-w-2xl mx-auto shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Brain size={18} className="text-emerald-400" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      1단계: 머릿속 생각의 장작 끄기 (생각 멈춤 훈련)
                    </span>
                  </div>
                  {(vaporizedThought || hasPerformedStop || hasCompletedGap) && (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>생각 차단 완료</span>
                    </span>
                  )}
                </div>

                {/* 3 Thought-Stopping Technique Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveThoughtTechnique('vaporizer')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      activeThoughtTechnique === 'vaporizer'
                        ? 'bg-amber-500/20 border border-amber-400/80 text-amber-200 shadow-md'
                        : 'bg-white/5 text-white/50 hover:text-white border border-white/5'
                    }`}
                  >
                    <span>🔥</span>
                    <span className="truncate">생각 소멸기</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveThoughtTechnique('stop_switch')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      activeThoughtTechnique === 'stop_switch'
                        ? 'bg-red-500/20 border border-red-400/80 text-red-200 shadow-md'
                        : 'bg-white/5 text-white/50 hover:text-white border border-white/5'
                    }`}
                  >
                    <span>🛑</span>
                    <span className="truncate">생각 컷 (STOP)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveThoughtTechnique('gap_silence')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      activeThoughtTechnique === 'gap_silence'
                        ? 'bg-indigo-500/20 border border-indigo-400/80 text-indigo-200 shadow-md'
                        : 'bg-white/5 text-white/50 hover:text-white border border-white/5'
                    }`}
                  >
                    <span>⏳</span>
                    <span className="truncate">생각 사이의 침묵</span>
                  </button>
                </div>

                {/* Technique 1: Vaporizer */}
                {activeThoughtTechnique === 'vaporizer' && (
                  <div className="space-y-3">
                    <p className="text-xs text-white/70">
                      지금 머릿속을 맴돌며 감정을 부추기는 생각(과거 원망, 미래 불안, 자책)을 적어보세요.
                    </p>

                    <div className="relative">
                      <input
                        type="text"
                        value={thoughtInput}
                        onChange={(e) => setThoughtInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleVaporizeThought();
                        }}
                        placeholder="예: 내가 부족해서 다 망치면 어쩌지..."
                        className={`w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-amber-400 transition-all ${
                          isVaporizing ? 'opacity-0 scale-95 blur-md transition-all duration-700' : ''
                        }`}
                      />
                    </div>

                    {/* Quick thought chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {THOUGHT_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setThoughtInput(preset)}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 text-[10px] text-white/60 hover:text-amber-200 transition-all text-left cursor-pointer truncate max-w-full"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleVaporizeThought}
                      disabled={!thoughtInput.trim() || isVaporizing}
                      className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        thoughtInput.trim() && !isVaporizing
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-98'
                          : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      <Flame size={14} className={isVaporizing ? 'animate-bounce' : ''} />
                      <span>{isVaporizing ? '생각의 장작을 끄는 중...' : '🔥 이 생각의 장작 끄기 & 허공으로 소멸'}</span>
                    </button>

                    {vaporizedThought && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>"{vaporizedThought}"</strong> 생각이 허공으로 흩어졌습니다.<br />
                          <span className="text-white/60">생각은 뇌가 만들어낸 일시적 전기 신호일 뿐 당신이 아닙니다.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Technique 2: STOP Switch */}
                {activeThoughtTechnique === 'stop_switch' && (
                  <div className="space-y-4 text-center py-2">
                    <p className="text-xs text-white/70 max-w-md mx-auto">
                      생각이 꼬리를 물며 통제되지 않을 때, 뇌의 기본모드신경망(DMN)을 즉시 정지시키는 인지심리학 처방입니다.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleTriggerStopFlash}
                        className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 flex flex-col items-center justify-center transition-all cursor-pointer shadow-2xl ${
                          isStopFlash
                            ? 'bg-red-600 border-white text-white scale-110 shadow-[0_0_40px_rgba(239,68,68,0.8)] animate-pulse'
                            : 'bg-red-950/60 hover:bg-red-900/60 border-red-500/40 text-red-300 hover:border-red-400'
                        }`}
                      >
                        <span className="text-2xl font-black tracking-widest font-mono">STOP!</span>
                        <span className="text-[10px] mt-1 text-white/70">그만! 멈춤</span>
                      </button>

                      <span className="text-[11px] text-white/50">버튼을 눌러 머릿속 생각 라디오를 [MUTE]로 끄세요</span>
                    </div>

                    {hasPerformedStop && (
                      <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-[11px] text-red-200 leading-relaxed max-w-md mx-auto">
                        🛑 <strong>생각 차단 선언 완료:</strong> "스토리 분석을 즉각 멈춥니다. 이 생각은 나의 평온을 깰 자격이 없다."
                      </div>
                    )}
                  </div>
                )}

                {/* Technique 3: The Gap */}
                {activeThoughtTechnique === 'gap_silence' && (
                  <div className="space-y-4 text-center py-2">
                    <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-left space-y-1">
                      <span className="text-xs font-bold text-indigo-300">에크하르트 톨레 &amp; 호킨스의 궁극의 생각 정지 질문:</span>
                      <p className="text-xs text-white/80 italic font-serif leading-relaxed">
                        "지금 눈을 감고 기다려보세요: <strong>'나의 다음 생각은 어디서 떠오를까?'</strong>"
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      {isGapTimerActive ? (
                        <div className="space-y-2">
                          <div className="w-24 h-24 rounded-full border-2 border-indigo-400 bg-indigo-500/20 flex flex-col items-center justify-center animate-pulse">
                            <span className="text-3xl font-mono font-bold text-indigo-200">00:0{gapTimer}</span>
                            <span className="text-[9px] text-indigo-300 tracking-wider uppercase">생각 사이의 침묵</span>
                          </div>
                          <p className="text-[11px] text-white/60">다음 생각이 오는지 가만히 지켜보세요...</p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startGapTimer}
                          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer"
                        >
                          <Timer size={14} />
                          <span>{hasCompletedGap ? '생각 사이의 고요 5초 다시 체험' : '5초 생각 정지(Gap) 침묵 체험하기'}</span>
                        </button>
                      )}
                    </div>

                    {hasCompletedGap && !isGapTimerActive && (
                      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-[11px] text-indigo-200 leading-relaxed max-w-md mx-auto text-left">
                        ✨ <strong>고요의 발견:</strong> 다음 생각을 지켜보려 집중하는 순간, 생각은 멈추고 고요한 '빈 공간(Gap)'이 나타납니다. 당신은 생각이 아니라, 그 침묵을 지켜보는 순수한 관찰자(참나)입니다.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION B: Somatic Surrender (신체 감각 집중 & 항복) */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 text-left">
                  <Heart size={18} className="text-emerald-400" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      2단계: 머리에서 몸으로 주의 이동 &amp; 신체 감각 항복
                    </span>
                    <span className="text-[11px] text-white/50">
                      생각을 끄셨다면, 이제 감정이 머물고 있는 신체 부위에 100% 주의를 기울이세요.
                    </span>
                  </div>
                </div>

                {/* Somatic Zone Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left">
                  {SOMATIC_ZONES.map((zone) => {
                    const isSelected = selectedZone.id === zone.id;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => {
                          setSelectedZone(zone);
                          if (isSurrenderActive) {
                            setIsSurrenderActive(false);
                            setSurrenderTimer(15);
                          }
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/15'
                            : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{zone.emoji}</span>
                          <span className="text-xs font-bold text-white">{zone.name}</span>
                        </div>
                        <p className="text-[10px] text-white/40 leading-tight">{zone.description}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Somatic Hold Ring / Timer */}
                <div className="py-4 flex flex-col items-center justify-center">
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                    <motion.div
                      animate={
                        isSurrenderActive
                          ? { scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }
                          : { scale: 1, opacity: 0.3 }
                      }
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"
                    />
                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 rounded-full border border-emerald-500/40 bg-zinc-950/80 shadow-2xl w-full h-full">
                      <span className="text-3xl">{selectedZone.emoji}</span>
                      <span className="text-2xl font-mono font-bold text-emerald-300 mt-2">
                        00:{String(surrenderTimer).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">
                        {isSurrenderActive ? '신체 느낌과 동행 중...' : hasCompletedSomaticHold ? '항복 완료!' : '타이머 대기'}
                      </span>
                    </div>
                  </div>

                  {/* Real-time thought defense guidance during timer */}
                  {isSurrenderActive && (
                    <>
                      <p className="mt-3 text-xs text-amber-200/90 font-medium animate-pulse text-center max-w-sm">
                        {surrenderTimer > 10 && `🛑 머릿속 생각('왜?')을 끄고, ${selectedZone.name}의 조임·열감에만 주의를 기울이세요.`}
                        {surrenderTimer <= 10 && surrenderTimer > 5 && `🌊 생각이 다시 올라오면: '아, 생각일 뿐이야' 하고 목 아래 몸의 감각으로 돌아옵니다.`}
                        {surrenderTimer <= 5 && `✨ 저항하지 않고 그대로 머물 때, 감정은 압력밥솥의 증기처럼 스스로 증발합니다.`}
                      </p>
                      <button
                        type="button"
                        onClick={stopSomaticHold}
                        className="mt-3 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
                      >
                        <Pause size={13} className="fill-amber-300" />
                        <span>신체 집중 잠시 멈춤</span>
                      </button>
                    </>
                  )}

                  {!isSurrenderActive && (
                    <button
                      type="button"
                      onClick={startSomaticHold}
                      className="mt-4 px-5 py-2.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
                    >
                      {hasCompletedSomaticHold ? (
                        <>
                          <RotateCcw size={14} />
                          <span>{selectedZone.name}에 신체 항복 15초 다시 집중하기</span>
                        </>
                      ) : (
                        <>
                          <Play size={14} className="fill-emerald-300" />
                          <span>{selectedZone.name}에 신체 감각 항복 15초 집중 시작</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full max-w-md mx-auto py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-98 transition-all cursor-pointer"
              >
                <span>다음: 세도나 4대 근원 욕구 해체로</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {/* Step 3: Sedona 4 Root Desires */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-bold">
                    <span>🔍 레스터 레븐슨의 근원 결핍 탐색</span>
                  </div>
                  {targetIssue && (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      고민 맞춤 자동 분석: {selectedDesire.nameKo}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-light text-slate-100">
                  이 고통의 바닥에 숨어있는 <br className="hidden sm:inline" />
                  <span className="text-emerald-300 font-semibold">에고의 4대 결핍 욕망은 무엇인가요?</span>
                </h3>
                <p className="text-xs text-white/50">
                  모든 괴로움은 상황 때문이 아니라, 그 상황을 쥐고 흔들려는 4가지 무의식 욕망 때문에 발생합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SEDONA_ROOT_DESIRES.map((desire) => {
                  const isSelected = selectedDesire.id === desire.id;
                  return (
                    <button
                      key={desire.id}
                      type="button"
                      onClick={() => setSelectedDesire(desire)}
                      className={`p-5 rounded-3xl border text-left transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500/15 shadow-xl shadow-emerald-500/10'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{desire.icon}</span>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{desire.nameKo}</h4>
                          <p className="text-[10px] text-white/40 font-mono">{desire.nameEn}</p>
                        </div>
                      </div>
                      <p className="text-xs text-emerald-200/90 font-medium">{desire.tagline}</p>
                      <div className="pt-2 border-t border-white/5 text-[11px] text-white/60 space-y-1">
                        <p><strong className="text-white/80">증상:</strong> {desire.symptom}</p>
                        <p><strong className="text-amber-300/80">에고의 착각:</strong> {desire.egoGain}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Ego Secondary Gain Insight Box */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                <Info size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-white/70">
                  <span className="font-bold text-amber-300">호킨스 &amp; 세도나의 핵심 통찰: 2차 이득(Secondary Gain)</span>
                  <p className="leading-relaxed">
                    에고는 화내거나 억울해하면서 "내가 옳고 너는 틀렸다"는 은밀한 우월감과 피해자의 쾌락을 누립니다.
                    <strong> '내가 옳음' 대신 '내 영혼의 평화'를 선택할 때 감정의 굴레는 즉시 풀립니다.</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-98 transition-all cursor-pointer"
              >
                <span>다음: 세도나 4문답 &amp; 인터랙티브 볼펜 놓기</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {/* Step 4: 4-Questions & Pen Drop Interactive Gesture */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-center">
              <div className="space-y-2 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                  <span>🪶 세도나 4문답 &amp; 볼펜 떨어뜨리기 실천</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-light text-slate-100">
                  손에 쥔 볼펜을 가볍게 떨어뜨리듯, <br className="hidden sm:inline" />
                  <span className="text-emerald-300 font-semibold">쥐고 있던 에고의 손을 쫙 펴세요</span>
                </h3>
              </div>

              {/* 4 Questions Flow */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 max-w-xl mx-auto text-left space-y-4 shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0">1</span>
                    <p className="text-sm text-slate-200">
                      "지금 느껴지는 {attachKoreanParticle(selectedEmotion.nameKo.split(' ')[0], '과/와')} {selectedDesire.nameKo.split(' ')[0]} 욕구{getKoreanParticle('욕구', '을/를')} 있는 그대로 기꺼이 환영할 수 있나요?"
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0">2</span>
                    <p className="text-sm text-slate-200">"이 꽉 쥔 손을 펴듯, 가볍게 허공 속으로 흘려보낼 수 있을까요?"</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0">3</span>
                    <p className="text-sm text-slate-200">"기꺼이 놓아버리겠습니까?"</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0">4</span>
                    <p className="text-sm font-bold text-emerald-300">"언제 놓아버리겠습니까? &rarr; 바로 지금 (NOW)!"</p>
                  </div>
                </div>
              </div>

              {/* Interactive Hold-to-Release Grip Button */}
              <div className="py-6 flex flex-col items-center justify-center space-y-4">
                <p className="text-xs text-white/60 font-mono tracking-wider">
                  {isGripHolding
                    ? gripHoldProgress >= 100
                      ? '★ 마우스(손가락)를 떼는 순간 볼펜이 바닥으로 툭 떨어집니다 (대기 중)'
                      : '볼펜을 꽉 쥔 손의 긴장감을 느껴보세요...'
                    : '마우스를 꾹 눌러 볼펜을 쥐고 있다가, 손을 떼면서 날숨을 "후~" 내쉬세요'}
                </p>

                <div className="relative">
                  {/* Progress Ring / Glow */}
                  <div
                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center transition-all select-none cursor-pointer relative overflow-hidden shadow-2xl active:scale-95"
                    onMouseDown={handleGripMouseDown}
                    onMouseUp={handleGripMouseUp}
                    onTouchStart={handleGripMouseDown}
                    onTouchEnd={handleGripMouseUp}
                    style={{
                      background: isReleasedAnimation
                        ? 'radial-gradient(circle, rgba(16,185,129,0.8) 0%, rgba(5,150,105,0.2) 70%)'
                        : isGripHolding
                        ? gripHoldProgress >= 100
                          ? 'radial-gradient(circle, rgba(234,179,8,0.5) 0%, rgba(20,20,20,0.85) 70%)'
                          : 'radial-gradient(circle, rgba(234,179,8,0.3) 0%, rgba(0,0,0,0.8) 70%)'
                        : 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.9) 70%)',
                      border: isReleasedAnimation
                        ? '2px solid #10b981'
                        : isGripHolding
                        ? gripHoldProgress >= 100
                          ? '2px solid #facc15'
                          : '2px solid #eab308'
                        : '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    {/* Filling progress layer */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-emerald-500/30 transition-all pointer-events-none"
                      style={{ height: `${gripHoldProgress}%` }}
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
                      <span className={`text-4xl sm:text-5xl transition-transform transform ${isGripHolding && gripHoldProgress >= 100 ? 'scale-110 animate-bounce' : ''}`}>
                        {isReleasedAnimation ? '🕊️' : isGripHolding ? (gripHoldProgress >= 100 ? '🖊️ ➔ 🪶' : '✊') : '🖐️'}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white mt-2">
                        {isReleasedAnimation
                          ? '완전한 해방!'
                          : isGripHolding
                          ? gripHoldProgress >= 100
                            ? '손을 떼어 볼펜을 떨어뜨리세요!'
                            : `볼펜을 쥐고 대기 중 (${gripHoldProgress}%)`
                          : '클릭하여 볼펜 쥐기 (Hold)'}
                      </span>
                      <span className="text-[10px] text-white/50 mt-1 max-w-[170px] leading-tight">
                        {isReleasedAnimation
                          ? '우주의 평화가 깃듭니다 (방하착 완료)'
                          : isGripHolding
                          ? gripHoldProgress >= 100
                            ? '마우스를 떼는 순간 볼펜이 저절로 떨어집니다'
                            : '마우스를 누른 채 대기하세요'
                          : '클릭 후 유지하다가 뗄 때 방하착됩니다'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instant Skip / Manual Release Button */}
                <button
                  type="button"
                  onClick={finishReleaseSession}
                  className="text-xs text-white/40 hover:text-emerald-300 underline transition-all pt-2 cursor-pointer"
                >
                  클릭으로 즉시 방하착 완료하기
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Ascension Report & Result */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  그렇게 마음은 가볍게 비워졌습니다.
                </h3>
                <p className="text-xs text-emerald-300 font-mono tracking-widest uppercase">
                  SURRENDER &amp; SEDONA RELEASE COMPLETE
                </p>
              </div>

              {/* SUDS Before/After Metric */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-3xl bg-white/[0.03] border border-white/5 text-center">
                <div className="p-3 rounded-2xl bg-black/40">
                  <span className="text-[10px] text-white/40 block">정화 대상</span>
                  <span className="text-xs font-bold text-emerald-300 truncate block mt-1">
                    {extractCleanConcernNoun(targetIssue.trim(), '마음의 억압')}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40">
                  <span className="text-[10px] text-white/40 block">해체된 감정 &amp; 욕구</span>
                  <span className="text-xs font-bold text-white block mt-1">
                    {selectedEmotion.nameKo.split(' ')[0]} &bull; {selectedDesire.nameKo.split(' ')[0]} 욕구
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40">
                  <span className="text-[10px] text-white/40 block">고통 전압(SUDS)</span>
                  <span className="text-xs font-bold text-amber-300 block mt-1 font-mono">
                    {preSuds} &rarr; <span className="text-emerald-400">{postSuds}</span>
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40">
                  <span className="text-[10px] text-white/40 block">의식의 도약</span>
                  <span className="text-xs font-bold text-indigo-300 block mt-1 font-mono">
                    Lv.{selectedEmotion.level} &rarr; Lv.500+
                  </span>
                </div>
              </div>

              {/* Peace & Liberation Affirmation Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-teal-950/30 border border-emerald-500/30 text-center space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
                    PEACE &amp; LIBERATION AFFIRMATION
                  </span>
                  <TTSButton
                    text="감정은 지나가는 날씨일 뿐이며, 나는 그 구름 뒤에서 한 번도 빛을 잃지 않은 영원한 푸른 하늘입니다. 쥐고 있던 생각을 내려놓는 순간, 내 안의 무한한 평화와 자유가 가득 차오릅니다."
                    voice="Kore"
                    className="text-emerald-300 border-emerald-500/30 text-xs px-2.5 py-1"
                  />
                </div>
                <p className="text-sm sm:text-base text-white/90 font-serif leading-relaxed italic max-w-xl mx-auto pt-1">
                  "감정은 지나가는 날씨일 뿐이며, 나는 그 구름 뒤에서 한 번도 빛을 잃지 않은 영원한 푸른 하늘입니다. 쥐고 있던 생각을 내려놓는 순간, 내 안의 무한한 평화와 자유가 가득 차오릅니다."
                </p>
              </div>

              {/* Lucy 1:1 Deep Insight Integration Banner */}
              <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-950/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                      <Sparkles size={13} className="animate-pulse" />
                    </div>
                    <span className="text-sm font-bold text-emerald-200">루시와 1:1 심층 치유 상담 (Deep Insight)</span>
                  </div>
                  <p className="text-xs text-white/70 font-sans leading-relaxed">
                    오늘 방하착한 [{selectedEmotion.nameKo.split(' ')[0]}]{getKoreanParticle(selectedEmotion.nameKo.split(' ')[0], '과/와')} [{selectedDesire.nameKo.split(' ')[0]} 욕구] 세션 데이터를 바탕으로, 루시와 함께 일상 속 평온을 온전히 뿌리내리세요.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void sendLettingGoSessionToLucy(
                      {
                        targetIssue: targetIssue.trim() || '무의식 방하착',
                        emotion: selectedEmotion.nameKo,
                        consciousnessLevel: selectedEmotion.level,
                        somaticZone: selectedZone.name,
                        rootDesire: selectedDesire.nameKo,
                        preSuds,
                        postSuds,
                        hawkinsPrescription: prescription,
                      },
                      openLucyChat,
                      sendUnifiedMessage
                    );
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer shrink-0"
                >
                  <Sparkles size={14} />
                  <span>루시와 심층 상담하기</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetWorkshop}
                  className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  다른 감정 흘려보내기 (새 세션)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer shadow-lg"
                >
                  정화 일지 보러가기
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 3: HAWKINS & SEDONA WISDOM CODEX */}
      {activeTab === 'codex' && (
        <div className="w-full rounded-3xl bg-zinc-950/80 border border-indigo-500/25 p-6 sm:p-10 backdrop-blur-2xl space-y-8 shadow-2xl">
          {/* Header with Master Kore Voice Narration */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
              <BookOpen size={14} />
              <span>HAWKINS &times; SEDONA WISDOM CODEX</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              의식의 지도 &amp; 4대 욕구 지혜 나침반
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              정신의학자 데이비드 R. 호킨스 박사의 《놓아버림》과 레스터 레븐슨의 《세도나 메서드》 핵심 정수를 Kore AI 음성 나레이션으로 생생하게 청취하세요.
            </p>

            {/* Master Kore TTS Narration Button */}
            <div className="pt-2 flex justify-center">
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-200 text-xs shadow-lg">
                <Volume2 size={16} className="text-indigo-400 animate-pulse" />
                <span className="font-semibold">도감 총괄 오디오 요약 (Kore Voice)</span>
                <TTSButton
                  text="데이비드 호킨스 박사의 놓아버림과 레스터 레븐슨의 세도나 메서드 통합 지혜 도감입니다. 머릿속의 모든 생각과 판단, 과거 스토리를 멈추고 몸의 신체 느낌에 온전히 머무를 때 감정 에너지는 스스로 방전되어 소멸합니다. 또한 마음의 바닥에 숨어 있는 통제와 인정, 안전과 분리의 4대 결핍 욕구를 자각하고 손바닥을 펴듯 놓아버릴 때, 본래 우리 안에 존재하는 사랑과 평화의 참나가 찬란하게 드러납니다."
                  voice="Kore"
                  className="px-3 py-1 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs cursor-pointer shadow transition-all"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 pt-3">
              {[
                { id: 'all', label: '전체 도감' },
                { id: 'hawkins', label: '1. 호킨스 4대 항복 원리' },
                { id: 'sedona', label: '2. 세도나 4대 공식' },
                { id: 'spectrum', label: '3. 의식 스펙트럼 (Lv.20~600)' },
                { id: 'desires', label: '4. 4대 근원 결핍 욕구' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCodexFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    codexFilter === tab.id
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Hawkins Canon Grid */}
          {(codexFilter === 'all' || codexFilter === 'hawkins') && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-widest font-mono flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span>1. 데이비드 호킨스의 4대 항복(Surrender) 원리</span>
                </h4>
                <span className="text-[11px] text-emerald-400/70 font-mono">David R. Hawkins M.D.</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(LETTING_GO_CORE_CANON).map((key) => {
                  const item = LETTING_GO_CORE_CANON[key];
                  const spokenText = `${item.title}. ${item.summary}. 핵심 원리: ${item.hawkinsCoreMechanism.join(' ')}. 루시의 실전 안내: ${item.lucyExampleLine}`;
                  return (
                    <div key={key} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h5 className="text-xs sm:text-sm font-bold text-white">{item.title}</h5>
                            <span className="text-[9px] font-mono text-emerald-400/70">{item.englishTerm}</span>
                          </div>
                          <TTSButton
                            text={spokenText}
                            voice="Kore"
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs shrink-0 cursor-pointer"
                          />
                        </div>
                        <p className="text-[11px] text-white/70 leading-relaxed font-sans">{item.summary}</p>
                        <div className="space-y-1 text-[10px] text-emerald-200/80 font-sans border-t border-white/5 pt-2">
                          {item.hawkinsCoreMechanism.map((mech, i) => (
                            <p key={i}>{mech}</p>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-[10px] text-emerald-300/90 italic font-sans">
                        "{item.lucyExampleLine}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Sedona Canon Grid */}
          {(codexFilter === 'all' || codexFilter === 'sedona') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Feather size={16} />
                  <span>2. 레스터 레븐슨의 세도나 4대 릴리즈 공식</span>
                </h4>
                <span className="text-[11px] text-indigo-400/70 font-mono">Lester Levenson</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(SEDONA_CORE_CANON).map((key) => {
                  const item = SEDONA_CORE_CANON[key];
                  const spokenText = `${item.title}. ${item.summary}. 핵심 프로세스: ${item.coreProcess.join(' ')}. 실천 안내: ${item.lucyExampleLine}`;
                  return (
                    <div key={key} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h5 className="text-xs sm:text-sm font-bold text-white">{item.title}</h5>
                            <span className="text-[9px] font-mono text-indigo-400/70">{item.englishTerm}</span>
                          </div>
                          <TTSButton
                            text={spokenText}
                            voice="Kore"
                            className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 text-xs shrink-0 cursor-pointer"
                          />
                        </div>
                        <p className="text-[11px] text-white/70 leading-relaxed font-sans">{item.summary}</p>
                        <div className="space-y-1 text-[10px] text-indigo-200/80 font-sans border-t border-white/5 pt-2">
                          {item.coreProcess.map((proc, i) => (
                            <p key={i}>{proc}</p>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-[10px] text-indigo-300/90 font-sans italic">
                        "{item.lucyExampleLine}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Hawkins Emotional Spectrum */}
          {(codexFilter === 'all' || codexFilter === 'spectrum') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <h4 className="text-sm font-bold text-amber-300 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Compass size={16} />
                  <span>3. 호킨스 의식 스펙트럼 8대 감정 주파수 (Scale of Consciousness)</span>
                </h4>
                <span className="text-[11px] text-amber-400/70 font-mono">Lv.20 ~ Lv.600</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {HAWKINS_EMOTIONAL_SPECTRUM.map((emo) => {
                  const spokenText = `${emo.nameKo}, 호킨스 의식 레벨 ${emo.level}점. 삶의 관점은 ${emo.viewOfLife}이며, ${emo.desc}. 몸에서는 주로 ${emo.somaticFocus}에 긴장이 나타납니다. 이 감정을 회피하지 않고 있는 그대로 허용할 때 의식은 용기와 평화로 도약합니다.`;
                  return (
                    <div
                      key={emo.id}
                      className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-amber-500/30 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{emo.nameKo}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-bold">
                            Lv.{emo.level}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50">{emo.viewOfLife}</p>
                        <p className="text-[10px] text-white/70 leading-relaxed font-sans pt-1 border-t border-white/5">
                          {emo.desc}
                        </p>
                        <p className="text-[9px] text-amber-300/80 font-mono">
                          신체 부위: {emo.somaticFocus}
                        </p>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <TTSButton
                          text={spokenText}
                          voice="Kore"
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 text-xs cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: Sedona 4 Root Desires */}
          {(codexFilter === 'all' || codexFilter === 'desires') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
                <h4 className="text-sm font-bold text-teal-300 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Layers size={16} />
                  <span>4. 세도나 4대 근원 결핍 욕구 해체 가이드</span>
                </h4>
                <span className="text-[11px] text-teal-400/70 font-mono">Root Wants</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SEDONA_ROOT_DESIRES.map((desire) => {
                  const spokenText = `${desire.nameKo} 해체 가이드. ${desire.tagline}. 증상: ${desire.symptom}. 에고의 착각: ${desire.egoGain}. 방하착 질문: ${desire.releaseQuestion}`;
                  return (
                    <div
                      key={desire.id}
                      className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-teal-500/30 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{desire.icon}</span>
                            <div>
                              <h5 className="text-xs sm:text-sm font-bold text-white">{desire.nameKo}</h5>
                              <span className="text-[9px] font-mono text-teal-400/70">{desire.nameEn}</span>
                            </div>
                          </div>
                          <TTSButton
                            text={spokenText}
                            voice="Kore"
                            className="px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/30 text-teal-300 text-xs shrink-0 cursor-pointer"
                          />
                        </div>
                        <p className="text-xs text-teal-200/90 font-medium">{desire.tagline}</p>
                        <div className="space-y-1 text-[11px] text-white/70 font-sans border-t border-white/5 pt-2">
                          <p><strong className="text-white/90">일상 증상:</strong> {desire.symptom}</p>
                          <p><strong className="text-amber-300">에고의 2차 이득:</strong> {desire.egoGain}</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-teal-950/20 border border-teal-500/20 text-[10px] text-teal-300/90 font-sans">
                        <span className="font-bold text-teal-200 block mb-0.5">방하착 문답:</span>
                        <p>&bull; {desire.releaseQuestion}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RELEASE JOURNAL & HISTORY */}
      {activeTab === 'history' && (
        <div className="w-full rounded-3xl bg-zinc-950/80 border border-teal-500/25 p-6 sm:p-10 backdrop-blur-2xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold">
              <History size={14} />
              <span>RELEASE JOURNAL &amp; LOGS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              나의 방하착 &amp; 정화 기록 일지
            </h3>
            <p className="text-xs text-white/60">
              마음의 짐을 내려놓고 평정을 회복한 모든 순간이 기록됩니다.
            </p>
          </div>

          {historyList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Sparkles size={32} className="text-white/20 mx-auto" />
              <p className="text-xs text-white/40">아직 완료된 방하착 기록이 없습니다.</p>
              <button
                type="button"
                onClick={() => setActiveTab('workshop')}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold cursor-pointer hover:bg-emerald-500/30 transition-all"
              >
                첫 방하착 세션 시작하기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {historyList.map((entry) => (
                <div
                  key={entry.id}
                  className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-300">{entry.targetIssue}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {entry.emotionName}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/40 font-mono">{entry.date}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 pt-1">
                    <span>신체 부위: <strong className="text-white/80">{entry.somaticZone}</strong></span>
                    <span>해체 욕구: <strong className="text-white/80">{entry.rootDesireName}</strong></span>
                    <span>고통 전압: <strong className="text-amber-400">{entry.preSuds} &rarr; {entry.postSuds}</strong></span>
                  </div>

                  {entry.prescription && (
                    <div className="p-3 rounded-2xl bg-black/40 text-xs text-white/70 line-clamp-3">
                      {entry.prescription.replace(/###/g, '').replace(/\*\*/g, '')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
