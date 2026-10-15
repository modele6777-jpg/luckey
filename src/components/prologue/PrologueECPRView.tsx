import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HeartPulse,
  Sparkles,
  ShieldAlert,
  Wind,
  Brain,
  Activity,
  Flame,
  Waves,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Check,
  Copy,
  Volume2,
  VolumeX,
  RefreshCw,
  Wand2,
  ChevronRight,
  Eye,
  Hand,
  Ear,
  Smile,
  Compass,
  AlertTriangle,
  Send,
  MessageCircle,
  HelpCircle,
  Layers,
  CircleDot
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { TTSButton } from '@/components/TTSButton';
import { playTTS, stopTTS, prefetchTTS } from '@/utils/tts';
import { invokeECPRPrescriptionLLM, type ECPRPrescriptionResult } from '@/lib/ai';

// 4 Emergency Distress Categories with tailored Lucy SOS voice scripts and EFT affirmations
export interface EmergencyProtocol {
  id: 'panic' | 'anger' | 'grief' | 'burnout';
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  description: string;
  somaticTip: string;
  respirationName: string;
  mantra: string;
  sosVoiceBadge: string;
  sosVoiceText: string;
  eftSetupAffirmation: string;
  eftReminders: string[];
}

export const EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    id: 'panic',
    title: '급성 불안 · 패닉 SOS',
    subtitle: 'Panic & Acute Anxiety',
    icon: Wind,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.35)',
    description: '심장이 빠르게 뛰고 과호흡이나 통제 상실감이 들 때 즉시 진정',
    somaticTip: '찬물을 한 모금 마시거나 손목 안쪽에 차가운 물을 10초간 적셔주세요.',
    respirationName: '4-7-8 응급 진정 호흡',
    mantra: '이 감정의 파도는 정점을 찍고 15분 안에 반드시 가라앉는다. 나는 안전하다.',
    sosVoiceBadge: '패닉 진정 루시 SOS',
    sosVoiceText: '괜찮습니다. 지금 느껴지는 두려움과 심장의 두근거림은 지나가는 파도일 뿐입니다. 저와 함께 천천히 숨을 들이마시고... 길게 내쉬세요. 당신은 지금 완전히 안전합니다. 이 파도는 곧 잔잔해집니다.',
    eftSetupAffirmation: '비록 나는 지금 극심한 불안과 심장 두근거림으로 두렵지만, 이런 나 자신을 온전히 받아들이고 깊이 사랑합니다.',
    eftReminders: [
      '이 가슴을 조여오는 극심한 불안감',
      '심장이 터질 것 같은 두근거림',
      '통제력을 잃을 것 같은 두려움',
      '숨이 가빠지고 답답한 느낌',
      '몸에 굳어있는 모든 긴장',
      '이 감정은 지나가는 신체 반응일 뿐이다',
      '나는 지금 안전하며 서서히 편안해진다',
      '내 호흡과 함께 평온함이 차오른다',
    ],
  },
  {
    id: 'anger',
    title: '치밀어 오르는 분노 · 억울함',
    subtitle: 'Overwhelming Anger',
    icon: Flame,
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.12)',
    border: 'rgba(249, 115, 22, 0.35)',
    description: '피가 거꾸로 솟고 주체할 수 없는 격한 화가 날 때 뇌 쿨다운',
    somaticTip: '양 주먹을 5초간 꽉 쥐었다가 손가락을 쫙 펴며 "하-" 하고 내뱉으세요.',
    respirationName: '생체 쿨링 입술 호흡 (Box Breathing)',
    mantra: '지금 반응하지 않아도 괜찮다. 나의 평온함이 나의 가장 강력한 힘이다.',
    sosVoiceBadge: '분노 쿨다운 루시 SOS',
    sosVoiceText: '지금 치밀어 오르는 화와 억울한 마음, 그대로 다 느껴도 괜찮습니다. 지금 당장 누군가에게 반격하거나 즉각 결정을 내리지 않아도 됩니다. 주먹을 펴고 깊게 한 번만 내뱉어보세요. 당신의 평온함이 가장 강력한 힘입니다.',
    eftSetupAffirmation: '비록 나는 억울함과 주체할 수 없는 분노로 피가 거꾸로 솟지만, 이런 내 감정을 솔직히 인정하고 나를 온전히 수용합니다.',
    eftReminders: [
      '가슴속에서 치밀어 오르는 이 뜨거운 화',
      '도저히 용납되지 않는 억울한 마음',
      '주먹이 쥐어지는 강한 분노',
      '머릿속을 태우는 이 불꽃',
      '하지만 지금 당장 폭발할 필요는 없다',
      '나의 차분함이 나의 가장 거대한 방패다',
      '뜨거운 열기를 숨과 함께 비워낸다',
      '나는 내 마음에 대한 완전한 주권을 가진다',
    ],
  },
  {
    id: 'grief',
    title: '극심한 슬픔 · 자책 · 눈물',
    subtitle: 'Overwhelm & Grief',
    icon: Waves,
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.35)',
    description: '모든 게 무너진 것 같고 자책감과 깊은 슬픔에 잠길 때',
    somaticTip: '양손을 교차해 가슴에 얹고 가볍게 토닥이며 "괜찮아"라고 속삭여주세요.',
    respirationName: '심장 감싸기 온기 호흡',
    mantra: '모든 것을 잘 해낼 필요는 없다. 지금은 그저 숨 쉬는 것만으로 충분하다.',
    sosVoiceBadge: '슬픔 보듬기 루시 SOS',
    sosVoiceText: '많이 힘들고 아프셨죠. 억지로 참지 말고 눈물이 나면 그대로 흘려보내도 괜찮습니다. 당신 탓이 아니에요. 지금 이 순간, 넘어진 자신을 비난하지 말고 따뜻하게 안아주세요. 제가 곁에 있을게요.',
    eftSetupAffirmation: '비록 나는 깊은 슬픔과 무너지는 자책감으로 가슴이 미어지지만, 상처 입은 나 자신을 따뜻하게 보듬고 깊이 사랑합니다.',
    eftReminders: [
      '가슴을 무겁게 짓누르는 깊은 슬픔',
      '나를 갉아먹는 자책과 미안함',
      '눈물이 멈추지 않는 아린 마음',
      '모든 걸 혼자 짊어진 듯한 외로움',
      '울어도 괜찮고 아파해도 괜찮다',
      '넘어진 나를 책망 대신 안아준다',
      '나는 이 아픔을 딛고 다시 피어날 것이다',
      '오늘 하루를 견뎌낸 나를 진심으로 안아준다',
    ],
  },
  {
    id: 'burnout',
    title: '과부하 · 뇌정지 · 번아웃',
    subtitle: 'Cognitive Freeze & Burnout',
    icon: Zap,
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.12)',
    border: 'rgba(234, 179, 8, 0.35)',
    description: '머리가 하얘지고 아무것도 할 수 없는 무기력한 동결 상태',
    somaticTip: '두 발바닥을 바닥에 굳게 밀착하고 발가락을 꼼지락거려 감각을 깨우세요.',
    respirationName: '신체 접지 그라운딩 호흡',
    mantra: '지금 당장 결론을 낼 필요는 없다. 1분만 모든 스위치를 내리고 멈춘다.',
    sosVoiceBadge: '번아웃 리셋 루시 SOS',
    sosVoiceText: '머릿속의 모든 회로가 과열되었을 때는 모든 스위치를 내리고 가만히 멈추는 것이 최고의 해답입니다. 지금 당장 무언가를 해결하려 애쓰지 마세요. 발바닥의 감각에 집중하며 1분만 뇌를 쉬게 해주세요.',
    eftSetupAffirmation: '비록 나는 뇌가 멈추고 에너지가 완전히 고갈되어 아무것도 할 수 없지만, 지금 멈춰 쉴 자격이 있는 나를 온전히 수용하고 사랑합니다.',
    eftReminders: [
      '머릿속이 하얘지는 극심한 인지 과부하',
      '손가락 하나 까딱하기 힘든 무기력함',
      '더 이상 쥐어짤 힘이 없는 고갈 상태',
      '멈추면 안 될 것 같은 불안감',
      '하지만 쉬는 것은 나약함이 아니다',
      '모든 생각의 스위치를 지금 내린다',
      '아무것도 하지 않아도 나는 충분히 소중하다',
      '내 뇌와 신경계가 깊은 휴식에 들어간다',
    ],
  },
];

// EFT Acupressure Points Definition
export interface EFTPoint {
  id: string;
  name: string;
  hanja: string;
  location: string;
  actionGuide: string;
  category: 'setup' | 'cycle';
  icon: string;
}

export const EFT_POINTS: EFTPoint[] = [
  {
    id: 'karate_chop',
    name: '손날점',
    hanja: '手刀穴 (수용 확언)',
    location: '손바닥 새끼손가락 아래 바깥쪽 도톰한 부위',
    actionGuide: '반대편 손가락 2~3개로 톡톡 두드리며 기본 수용 확언을 3회 반복합니다.',
    category: 'setup',
    icon: '✋',
  },
  {
    id: 'crown',
    name: '정수리',
    hanja: '百會 (백회혈)',
    location: '머리 맨 꼭대기 정중앙',
    actionGuide: '손끝으로 머리 꼭대기 중심을 가볍고 리드미컬하게 톡톡 두드립니다.',
    category: 'cycle',
    icon: '👑',
  },
  {
    id: 'eyebrow',
    name: '눈썹 머리',
    hanja: '攅竹 (찬죽혈)',
    location: '양 눈썹 안쪽 끝, 코뼈와 만나는 시작점',
    actionGuide: '검지와 중지 끝으로 눈썹 시작 지점을 부드럽게 탭핑합니다.',
    category: 'cycle',
    icon: '👀',
  },
  {
    id: 'side_of_eye',
    name: '눈가',
    hanja: '瞳子髎 (동자료)',
    location: '눈꼬리 바깥쪽 관자놀이 뼈 가장자리',
    actionGuide: '눈가 뼈 부위를 손끝으로 가볍게 두드리며 긴장을 방출합니다.',
    category: 'cycle',
    icon: '✨',
  },
  {
    id: 'under_eye',
    name: '눈 밑',
    hanja: '四白 (사백혈)',
    location: '눈동자 바로 아래 광대뼈 윗부분',
    actionGuide: '눈 밑 뼈 지점을 톡톡 두드리며 위장과 신경의 긴장을 풉니다.',
    category: 'cycle',
    icon: '💧',
  },
  {
    id: 'under_nose',
    name: '인중',
    hanja: '水溝 (인중혈)',
    location: '코밑과 윗입술 사이 오목한 중앙',
    actionGuide: '손가락 끝으로 인중 부위를 톡톡 두드리며 뇌의 각성을 가라앉힙니다.',
    category: 'cycle',
    icon: '👄',
  },
  {
    id: 'chin',
    name: '턱끝',
    hanja: '承漿 (승장혈)',
    location: '아랫입술 아래와 턱끝 사이 움푹 들어간 곳',
    actionGuide: '턱의 오목한 중심을 톡톡 두드리며 억눌린 억울함과 슬픔을 배출합니다.',
    category: 'cycle',
    icon: '🫧',
  },
  {
    id: 'collarbone',
    name: '쇄골',
    hanja: '兪府 (쇄골하점)',
    location: '양쪽 쇄골 안쪽 뼈 바로 아래 약 2cm 지점',
    actionGuide: '주먹을 가볍게 쥐거나 손끝으로 쇄골 아래를 톡톡 두드려 미주신경을 이완합니다.',
    category: 'cycle',
    icon: '🦋',
  },
  {
    id: 'under_arm',
    name: '옆구리',
    hanja: '大包 (대포혈)',
    location: '겨드랑이 정중앙 아래 약 10cm 갈비뼈 부위 (여성 브래지어 라인)',
    actionGuide: '손바닥이나 손끝으로 옆구리 갈비뼈를 톡톡 두드리며 전신 에너지를 정돈합니다.',
    category: 'cycle',
    icon: '⚡',
  },
];

// Quick symptom presets for AI Prescription
const SYMPTOM_PRESETS = [
  '심장이 쿵쾅거리고 숨이 가빠서 어지러워요',
  '너무 화가 나고 억울해서 손이 덜덜 떨려요',
  '모든 게 내 탓인 것 같고 눈물이 멈추지 않아요',
  '머리가 멍해지고 아무 생각도 할 수가 없어요',
  '시험/발표/면접 직전 긴장감이 감당 안 돼요',
  '사람들의 시선과 평가가 너무 두렵고 숨고 싶어요',
];

// 5-4-3-2-1 Grounding steps
const GROUNDING_STEPS = [
  { count: 5, icon: Eye, label: '눈에 보이는 것 5가지', desc: '주변을 천천히 둘러보며 색깔이나 사물 5개를 마음속으로 이름을 붙여보세요. (예: 파란 펜, 흰 벽, 시계...)' },
  { count: 4, icon: Hand, label: '만질 수 있는 감각 4가지', desc: '의자 시트의 질감, 입고 있는 옷, 책상 표면, 차가운 컵을 손끝으로 가만히 느껴보세요.' },
  { count: 3, icon: Ear, label: '귀에 들리는 소리 3가지', desc: '에어컨 소리, 시계 초침, 바깥의 바람 소리 등 지금 들려오는 소리 3가지에 집중하세요.' },
  { count: 2, icon: Wind, label: '맡을 수 있는 냄새 2가지', desc: '공기의 온도와 냄새, 혹은 손등이나 옷에서 나는 은은한 향기를 맡아보세요.' },
  { count: 1, icon: Smile, label: '느낄 수 있는 맛 1가지', desc: '입안에 남아있는 물맛이나 혀끝의 침, 입술의 감각을 알아차리세요.' },
];

export function PrologueECPRView() {
  const { sharedState, updateSharedState, openLucyChat } = useApp();
  const rawUser = sharedState?.userProfile?.basic?.nickname?.trim() || sharedState?.userProfile?.basic?.name?.trim();
  const userName = (rawUser && rawUser !== '여행자') ? rawUser : '제제';

  // Selected Emergency Protocol
  const [selectedProtocolId, setSelectedProtocolId] = useState<'panic' | 'anger' | 'grief' | 'burnout'>('panic');
  const activeProtocol = EMERGENCY_PROTOCOLS.find((p) => p.id === selectedProtocolId) || EMERGENCY_PROTOCOLS[0];

  // 4-7-8 Breathing State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCountdown, setBreathCountdown] = useState<number>(4);
  const [breathCycleCount, setBreathCycleCount] = useState<number>(0);
  const [isBreathVoiceEnabled, setIsBreathVoiceEnabled] = useState<boolean>(true);

  // 5-4-3-2-1 Grounding Checklist State
  const [groundingChecked, setGroundingChecked] = useState<boolean[]>([false, false, false, false, false]);

  // AI eCPR Custom Prescription State
  const [symptomInput, setSymptomInput] = useState<string>('');
  const [isPrescribing, setIsPrescribing] = useState<boolean>(false);
  const [prescription, setPrescription] = useState<ECPRPrescriptionResult | null>(() => {
    if (sharedState?.ecprPrescription?.prescription) {
      return sharedState.ecprPrescription.prescription;
    }
    try {
      const raw = localStorage.getItem('prologue_ecpr_latest_prescription');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed?.prescription || parsed || null;
      }
    } catch (_) {}
    return null;
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Reactive cross-device sync for eCPR
  useEffect(() => {
    if (sharedState?.ecprPrescription?.prescription) {
      setPrescription(sharedState.ecprPrescription.prescription);
    }
  }, [sharedState?.ecprPrescription]);

  useEffect(() => {
    const handleEcprUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.prescription) {
        setPrescription(custom.detail.prescription);
      }
    };
    window.addEventListener('prism:ecpr_updated', handleEcprUpdate);
    return () => window.removeEventListener('prism:ecpr_updated', handleEcprUpdate);
  }, []);

  // EFT (Emotional Freedom Techniques) State
  const [isEFTActive, setIsEFTActive] = useState<boolean>(false);
  const [activeEFTIndex, setActiveEFTIndex] = useState<number>(0);
  const [customSetupAffirmation, setCustomSetupAffirmation] = useState<string>('');
  const [isEditingSetup, setIsEditingSetup] = useState<boolean>(false);

  // Update EFT custom affirmation when protocol changes
  useEffect(() => {
    setCustomSetupAffirmation(activeProtocol.eftSetupAffirmation);
  }, [activeProtocol]);

  // Breathing Timer Effect
  useEffect(() => {
    let timer: any;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCountdown((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return 7;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 8;
            } else {
              setBreathPhase('inhale');
              setBreathCycleCount((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase]);

  // 4-7-8 Real-time TTS Voice Coaching Effect
  useEffect(() => {
    if (!isBreathingActive) {
      return;
    }
    if (!isBreathVoiceEnabled) {
      stopTTS();
      return;
    }

    const sessionToken = `b478_${Date.now()}_${breathPhase}_${breathCycleCount}`;
    let phrase = '';

    if (breathPhase === 'inhale') {
      phrase = breathCycleCount === 0
        ? '4-7-8 진정 호흡을 시작합니다. 코로 깊이 숨을 들이마십니다.'
        : '코로 깊이 숨을 들이마십니다.';
      prefetchTTS('숨을 멈추고 고요한 온기를 채웁니다.', 'Kore', '치유').catch(() => {});
    } else if (breathPhase === 'hold') {
      phrase = '숨을 멈추고 고요한 온기를 채웁니다.';
      prefetchTTS('입으로 후 내쉬며 긴장을 완전히 비워냅니다.', 'Kore', '치유').catch(() => {});
    } else if (breathPhase === 'exhale') {
      phrase = '입으로 후 내쉬며 긴장을 완전히 비워냅니다.';
      prefetchTTS('코로 깊이 숨을 들이마십니다.', 'Kore', '치유').catch(() => {});
    }

    if (phrase) {
      playTTS(phrase, 'Kore', false, '치유', sessionToken, false, phrase).catch((err) => {
        console.warn('[4-7-8 Breathing TTS] Playback warning:', err);
      });
    }
  }, [isBreathingActive, breathPhase, breathCycleCount, isBreathVoiceEnabled]);

  // Current active EFT Point
  const currentEFTPoint = EFT_POINTS[activeEFTIndex] || EFT_POINTS[0];
  
  // Current EFT Mantra text (either setup affirmation or reminder phrase)
  const currentEFTMantra =
    currentEFTPoint.id === 'karate_chop'
      ? (customSetupAffirmation || activeProtocol.eftSetupAffirmation)
      : (activeProtocol.eftReminders[activeEFTIndex - 1] || activeProtocol.mantra);

  // EFT Auto Cycle Tapping & Kore Voice Auto-Play Effect (Wait for full speech to finish)
  useEffect(() => {
    if (!isEFTActive) {
      stopTTS();
      return;
    }

    let isCancelled = false;
    let pauseTimer: any = null;
    const sessionToken = `eft_${Date.now()}_${activeEFTIndex}`;

    const executeEFTStep = async () => {
      // 1. Proactively prefetch the next acupressure point's speech audio
      const nextIndex = (activeEFTIndex + 1) % EFT_POINTS.length;
      const nextPoint = EFT_POINTS[nextIndex];
      const nextMantra =
        nextPoint.id === 'karate_chop'
          ? (customSetupAffirmation || activeProtocol.eftSetupAffirmation)
          : (activeProtocol.eftReminders[nextIndex - 1] || activeProtocol.mantra);
      prefetchTTS(nextMantra, 'Kore', '치유').catch(() => {});

      // 2. Play current EFT mantra and AWAIT full completion (zero cutoff guarantee)
      try {
        await playTTS(currentEFTMantra, 'Kore', true, '치유', sessionToken, false, currentEFTMantra);
      } catch (err) {
        console.warn('[EFT TTS] Step playback error:', err);
      }

      if (isCancelled) return;

      // 3. Provide a comfortable 1600ms pause for acupressure tapping rhythm & deep breath
      pauseTimer = setTimeout(() => {
        if (isCancelled) return;
        setActiveEFTIndex((prev) => (prev + 1) % EFT_POINTS.length);
      }, 1600);
    };

    executeEFTStep();

    return () => {
      isCancelled = true;
      if (pauseTimer) clearTimeout(pauseTimer);
      stopTTS();
    };
  }, [isEFTActive, activeEFTIndex, currentEFTMantra]);

  // Clean up any ongoing TTS playback on unmount
  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, []);

  // Generate AI Prescription
  const handleGeneratePrescription = async (customText?: string) => {
    const textToUse = customText || symptomInput;
    if (isPrescribing) return;
    setIsPrescribing(true);
    try {
      const res = await invokeECPRPrescriptionLLM({
        distressType: activeProtocol.title,
        situationOrSymptoms: textToUse.trim() || activeProtocol.description,
        userName,
      });
      setPrescription(res);
      const payload = {
        prescription: res,
        distressType: activeProtocol.title,
        symptoms: textToUse.trim() || activeProtocol.description,
        timestamp: Date.now(),
        dateKey: new Date().toLocaleDateString('sv'),
      };
      try {
        localStorage.setItem('prologue_ecpr_latest_prescription', JSON.stringify(payload));
        void updateSharedState({ ecprPrescription: payload }, 'prologue_ecpr');
      } catch (_) {}
    } catch (err) {
      console.error('[eCPR] Prescription generation failed:', err);
    } finally {
      setIsPrescribing(false);
    }
  };

  const handleCopyText = async (key: string, text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // ignore
    }
  };

  const resetBreathing = () => {
    stopTTS();
    setIsBreathingActive(false);
    setBreathPhase('inhale');
    setBreathCountdown(4);
    setBreathCycleCount(0);
  };

  const toggleGrounding = (idx: number) => {
    const next = [...groundingChecked];
    next[idx] = !next[idx];
    setGroundingChecked(next);
  };

  const resetGrounding = () => {
    setGroundingChecked([false, false, false, false, false]);
  };

  // 1:1 Emergency Chat with Lucy - immediately alert danger state
  const handleStartEmergencyLucyChat = () => {
    stopTTS();
    const protocol = activeProtocol;

    let emergencyPrompt = `🚨 [eCPR 긴급 감정 위기 SOS 접수]
루시야, 지금 내 감정 상태가 너무 힘들고 위험해서 긴급하게 1:1 대화 요청해.

📍 [현재 나의 긴급 위기 상태]
- 위기 유형: ${protocol.title} (${protocol.subtitle})
- 상황 설명: ${protocol.description}`;

    if (symptomInput.trim()) {
      emergencyPrompt += `\n- 구체적 증상 호소: "${symptomInput.trim()}"`;
    }

    if (prescription) {
      emergencyPrompt += `\n\n💊 [발급된 eCPR 응급 처방전]
- 처방명: ${prescription.emergencyTitle}
- 신체 안정 조치: ${prescription.step1Somatic}
- 호흡 조치: ${prescription.step2Respiration}
- 마음 안정 확언: "${prescription.step3Mantra}"`;
    }

    emergencyPrompt += `\n\n지금 심장이 너무 뛰고 감정이 벅차오르는데, 내가 안전하게 숨 쉬고 가라앉힐 수 있도록 나를 따뜻하게 1:1로 다독여주고, 지금 당장 안정을 찾을 수 있는 구급 가이드를 들려줘.`;

    openLucyChat('lucy', {
      autoSendPrompt: emergencyPrompt,
      mode: 'casual',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-home md:pt-home-md space-y-8 pb-20 font-sans">
      {/* 🚨 Emergency SOS Main Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass p-6 sm:p-8 rounded-[36px] border border-red-500/30 shadow-2xl relative overflow-hidden backdrop-blur-2xl space-y-5 group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-rose-600/10 to-amber-600/10 opacity-80 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5 font-mono">
                <HeartPulse size={13} className="text-red-400 animate-pulse" />
                eCPR · EMOTIONAL FIRST-AID
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/70 font-mono">
                감정 긴급 구급약
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              감정 응급 심폐소생술 (eCPR)
            </h2>
            <p className="text-xs sm:text-sm text-red-200/80 leading-relaxed">
              극심한 불안, 치솟는 분노, 눈물과 자책, 번아웃이 닥쳤을 때 30초 안에 신경계를 안정시키는 긴급 구급 키트입니다.
            </p>
          </div>

          {/* Lucy SOS Status Badge */}
          <div className="flex flex-col sm:items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-red-500/15 border border-red-400/30 text-red-200 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[11px] font-sans">{activeProtocol.sosVoiceBadge}</span>
            </div>
            <span className="text-[10px] text-white/40 font-mono">
              선택 감정 맞춤 응급 처방
            </span>
          </div>
        </div>

        {/* Dynamic Lucy Voice Message Bubble with dedicated Audio Player & 1:1 Emergency Chat */}
        <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-black/40 border border-red-500/25 flex flex-col gap-3 shadow-lg">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-400/30 flex items-center justify-center shrink-0 text-sm">
              👩‍⚕️
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-red-300 flex items-center gap-1 font-mono">
                  <span>LUCY EMERGENCY VOICE GUIDANCE</span>
                  <span>·</span>
                  <span className="text-white/60">{activeProtocol.title}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-red-200/80 font-medium hidden sm:inline">루시 SOS 음성 듣기</span>
                  <TTSButton
                    text={activeProtocol.sosVoiceText}
                    voice="Kore"
                    className="text-red-200 hover:text-white bg-red-500/20 hover:bg-red-500/30 border border-red-400/40"
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed italic font-serif">
                "{activeProtocol.sosVoiceText}"
              </p>
            </div>
          </div>

          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[11px] text-red-200/80 font-medium">
              지금 바로 루시와 1:1로 대화하며 안정을 찾고 싶다면:
            </span>
            <button
              type="button"
              onClick={handleStartEmergencyLucyChat}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer border border-red-400/40 hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <MessageCircle size={13} className="animate-pulse" />
              <span>루시와 1:1 긴급 대화 (위험상태 알림)</span>
            </button>
          </div>
        </div>

        {/* 4 Emergency Categories Selector Pills */}
        <div className="pt-3 border-t border-white/10 relative z-10 space-y-2">
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert size={13} className="text-red-400" />
            현재 겪고 있는 긴급 감정 선택 (Emergency Protocol)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EMERGENCY_PROTOCOLS.map((proto) => {
              const active = selectedProtocolId === proto.id;
              const Icon = proto.icon;
              return (
                <button
                  key={proto.id}
                  type="button"
                  onClick={() => {
                    setSelectedProtocolId(proto.id);
                    setPrescription(null);
                  }}
                  className="p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer backdrop-blur-md relative overflow-hidden"
                  style={{
                    background: active ? proto.bg : 'rgba(255, 255, 255, 0.03)',
                    borderColor: active ? proto.border : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: active ? `0 0 20px ${proto.bg}` : 'none',
                    transform: active ? 'scale(1.02)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Icon size={18} style={{ color: proto.color }} />
                    {active && <span className="w-2 h-2 rounded-full animate-ping" style={{ background: proto.color }} />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">{proto.title}</h4>
                    <p className="text-[9px] text-white/50 font-mono mt-0.5 truncate">{proto.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 🫁 Interactive 4-7-8 Emergency Breathing Sphere Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="glass p-6 sm:p-8 rounded-[36px] border border-sky-500/20 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <Wind size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                미주신경 리셋: 4-7-8 응급 진정 호흡기
              </h3>
              <p className="text-xs text-white/50">
                들숨(4초) → 정지(7초) → 날숨(8초)으로 심박수를 떨어뜨리고 부교감신경을 즉각 활성화합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* 4-7-8 Full Guide TTS Button */}
            <div className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-400/25 px-2.5 py-1.5 rounded-2xl">
              <span className="text-[11px] text-sky-200/90 font-medium hidden sm:inline">호흡 가이드 낭독</span>
              <TTSButton
                text="미주신경 리셋 4-7-8 응급 진정 호흡기입니다. 코로 4초간 맑은 공기를 가슴 깊이 들이마시고, 7초간 숨을 멈추어 심장에 고요한 온기를 채운 뒤, 입으로 8초간 후 소리를 내며 온몸의 긴장을 완전히 비워냅니다. 호흡 가이드 시작 버튼을 누르면 실시간 음성 코칭과 함께 편안하게 호흡을 리셋할 수 있습니다."
                voice="Kore"
                className="text-sky-200 hover:text-white bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40"
              />
            </div>

            {/* Voice Coaching Toggle (ON/OFF) */}
            <button
              type="button"
              onClick={() => {
                if (isBreathVoiceEnabled) {
                  stopTTS();
                }
                setIsBreathVoiceEnabled(!isBreathVoiceEnabled);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer border ${
                isBreathVoiceEnabled
                  ? 'bg-sky-500/20 border-sky-400/40 text-sky-300 hover:bg-sky-500/30'
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
              }`}
              title={isBreathVoiceEnabled ? '실시간 음성 코칭 켜짐 (클릭 시 끄기)' : '실시간 음성 코칭 꺼짐 (클릭 시 켜기)'}
            >
              {isBreathVoiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{isBreathVoiceEnabled ? '음성 코칭 ON' : '음성 코칭 OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isBreathingActive) {
                  stopTTS();
                }
                setIsBreathingActive(!isBreathingActive);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95 ${
                isBreathingActive
                  ? 'bg-rose-500/80 hover:bg-rose-600 text-white border border-rose-400/40 shadow-rose-500/20'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white border border-sky-300/30 shadow-sky-500/20'
              }`}
            >
              {isBreathingActive ? <Pause size={14} /> : <Play size={14} />}
              <span>{isBreathingActive ? '호흡 일시정지' : '호흡 가이드 시작'}</span>
            </button>
            {isBreathingActive && (
              <button
                type="button"
                onClick={resetBreathing}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                title="초기화"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Respiration Sphere Visualizer */}
        <div className="flex flex-col items-center justify-center py-6 sm:py-10 space-y-6">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            {/* Outer Pulsing Aura Ring */}
            <motion.div
              animate={{
                scale: isBreathingActive
                  ? breathPhase === 'inhale'
                    ? [1, 1.35]
                    : breathPhase === 'hold'
                    ? 1.35
                    : [1.35, 1]
                  : 1,
                opacity: isBreathingActive ? [0.4, 0.8, 0.4] : 0.2,
              }}
              transition={{
                duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 7 : 8,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/20 via-indigo-500/20 to-purple-500/20 blur-xl pointer-events-none"
            />

            {/* Middle Circle with Border */}
            <motion.div
              animate={{
                scale: isBreathingActive
                  ? breathPhase === 'inhale'
                    ? [1, 1.25]
                    : breathPhase === 'hold'
                    ? 1.25
                    : [1.25, 1]
                  : 1,
                borderColor:
                  breathPhase === 'inhale'
                    ? 'rgba(56, 189, 248, 0.7)'
                    : breathPhase === 'hold'
                    ? 'rgba(234, 179, 8, 0.7)'
                    : 'rgba(168, 85, 247, 0.7)',
              }}
              transition={{
                duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 7 : 8,
                ease: 'easeInOut',
              }}
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-dashed flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl shadow-2xl relative z-10"
            >
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-white/50">
                {isBreathingActive
                  ? breathPhase === 'inhale'
                    ? '들이마시기'
                    : breathPhase === 'hold'
                    ? '숨 멈추기'
                    : '길게 내쉬기'
                  : '대기 중'}
              </span>
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tighter my-1">
                {isBreathingActive ? breathCountdown : '4-7-8'}
              </span>
              <span className="text-[10px] text-sky-300/80 font-mono">
                {isBreathingActive ? `${breathCycleCount + 1}회차 사이클` : '시작 버튼을 누르세요'}
              </span>
            </motion.div>
          </div>

          {/* Real-time Guidance Message */}
          <div className="text-center max-w-md space-y-1">
            <p className="text-sm sm:text-base font-bold text-white flex items-center justify-center gap-2 flex-wrap">
              <span>
                {isBreathingActive
                  ? breathPhase === 'inhale'
                    ? '코로 천천히 맑은 공기를 가슴 깊이 들이마십니다 (4초)'
                    : breathPhase === 'hold'
                    ? '숨을 멈추고 심장에 고요한 온기를 채웁니다 (7초)'
                    : '입으로 "후-" 소리를 내며 긴장을 완전히 비워냅니다 (8초)'
                  : '버튼을 눌러 4-7-8 호흡을 3회 반복하면 뇌의 위기 반응이 즉각 멈춥니다.'}
              </span>
              {isBreathingActive && isBreathVoiceEnabled && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-sky-500/20 text-[10px] text-sky-300 font-mono">
                  <Volume2 size={10} className="animate-pulse" />
                  <span>Kore 음성 코칭</span>
                </span>
              )}
            </p>
            <p className="text-xs text-white/40">
              어깨의 힘을 빼고 턱의 긴장을 풀어주세요.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 🧠 5-4-3-2-1 Somatic Grounding Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="glass p-6 sm:p-8 rounded-[36px] border border-emerald-500/20 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden group"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
              <Brain size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                5-4-3-2-1 감각 접지 그라운딩 (Grounding First-Aid)
              </h3>
              <p className="text-xs text-white/50">
                패닉에 빠진 뇌를 '지금, 여기(Here and Now)'의 5가지 감각으로 강제 전환합니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetGrounding}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-xs font-mono transition-all cursor-pointer"
          >
            체크 초기화
          </button>
        </div>

        <div className="space-y-3">
          {GROUNDING_STEPS.map((step, idx) => {
            const checked = groundingChecked[idx];
            const StepIcon = step.icon;
            return (
              <div
                key={step.count}
                onClick={() => toggleGrounding(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 backdrop-blur-md ${
                  checked
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] text-white/80'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold font-mono border transition-all mt-0.5 ${
                    checked
                      ? 'bg-emerald-500 border-emerald-400 text-black'
                      : 'bg-white/5 border-white/20 text-emerald-300'
                  }`}
                >
                  {checked ? <Check size={14} /> : step.count}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <StepIcon size={14} className={checked ? 'text-emerald-400' : 'text-white/40'} />
                    <h4 className={`text-xs sm:text-sm font-bold ${checked ? 'text-emerald-200 line-through opacity-80' : 'text-white'}`}>
                      {step.label}
                    </h4>
                  </div>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ⚡ EFT 감정자유기법 (Emotional Freedom Techniques) 경혈 태핑 & 수용 확언 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="glass p-6 sm:p-8 rounded-[36px] border border-purple-500/25 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Activity size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  EFT 감정자유기법 (Emotional Freedom Techniques)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 font-mono">
                  경혈 탭핑 &amp; 수용 확언
                </span>
              </div>
              <p className="text-xs text-white/50">
                주요 9대 경혈점을 가볍게 두드리며 수용 확언을 읊어 뇌의 편도체 공포 반응을 즉각 차단합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEFTActive(!isEFTActive)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
                isEFTActive
                  ? 'bg-rose-500/80 hover:bg-rose-600 text-white border border-rose-400/40 shadow-rose-500/20'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border border-purple-400/30 shadow-purple-500/20'
              }`}
            >
              {isEFTActive ? <Pause size={14} /> : <Play size={14} />}
              <span>{isEFTActive ? 'EFT 자동 사이클 일시정지' : '✨ EFT 탭핑 사이클 시작'}</span>
            </button>
            {isEFTActive && (
              <button
                type="button"
                onClick={() => {
                  setIsEFTActive(false);
                  setActiveEFTIndex(0);
                }}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                title="초기화"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* EFT Active Stage Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/40 via-pink-950/20 to-black/60 border border-purple-400/30 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentEFTPoint.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    STEP {activeEFTIndex + 1} / {EFT_POINTS.length}
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {currentEFTPoint.name} <span className="text-xs text-purple-300/80 font-normal">({currentEFTPoint.hanja})</span>
                  </h4>
                </div>
                <p className="text-xs text-white/60 mt-0.5">{currentEFTPoint.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEFTActive ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/25 border border-purple-400/40 text-purple-200 text-[11px] font-medium animate-pulse shadow-sm">
                  <Volume2 size={13} className="text-pink-300" />
                  <span>Kore 음성 가이드 자동 재생 중</span>
                </div>
              ) : (
                <TTSButton
                  text={currentEFTMantra}
                  voice="Kore"
                  className="px-2.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 text-xs transition-all cursor-pointer flex items-center gap-1.5"
                />
              )}

              <button
                type="button"
                onClick={() => handleCopyText('eft-mantra', currentEFTMantra)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                title="확언 문구 복사"
              >
                {copiedKey === 'eft-mantra' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Action Guide & Dynamic Tapping Rhythm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold flex items-center gap-1">
                <CircleDot size={12} className="text-pink-400 animate-ping" />
                태핑 행동 가이드 &amp; 자극법
              </span>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium bg-black/30 p-3.5 rounded-2xl border border-white/10">
                {currentEFTPoint.actionGuide}
              </p>
            </div>

            {/* Spoken Affirmation Quote Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-pink-300 font-bold">
                  {currentEFTPoint.id === 'karate_chop' ? '🔑 기본 수용 확언 (3회 낭독)' : '🗣️ 단축 연상어 (두드리며 외치기)'}
                </span>
                {currentEFTPoint.id === 'karate_chop' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEditingSetup && isEFTActive) {
                        setIsEFTActive(false);
                      }
                      setIsEditingSetup(!isEditingSetup);
                    }}
                    className="text-[10px] text-purple-300 hover:text-white underline cursor-pointer"
                  >
                    {isEditingSetup ? '저장' : '직접 수정'}
                  </button>
                )}
              </div>

              {isEditingSetup && currentEFTPoint.id === 'karate_chop' ? (
                <input
                  type="text"
                  value={customSetupAffirmation}
                  onChange={(e) => setCustomSetupAffirmation(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-black/50 border border-purple-400 text-xs text-white outline-none"
                  placeholder="나만의 기본 수용 확언을 입력하세요..."
                />
              ) : (
                <div className="p-3.5 rounded-2xl bg-purple-500/15 border border-purple-400/40 text-purple-100 font-serif italic text-xs sm:text-sm leading-relaxed">
                  "{currentEFTMantra}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 9 EFT Acupressure Points Quick Selector Grid */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
            <Layers size={13} className="text-purple-400" />
            9대 EFT 경혈점 바로가기 (Click to Select)
          </span>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {EFT_POINTS.map((pt, idx) => {
              const isSelected = activeEFTIndex === idx;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => {
                    setActiveEFTIndex(idx);
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer backdrop-blur-md ${
                    isSelected
                      ? 'bg-purple-600/30 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-[1.05]'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.06] text-white/70'
                  }`}
                >
                  <span className="text-base">{pt.icon}</span>
                  <span className="text-[11px] font-bold text-white truncate w-full">{pt.name}</span>
                  <span className="text-[9px] text-white/40 font-mono">P{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ⚡ AI eCPR Instant Emergency Prescription */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="glass p-6 sm:p-8 rounded-[36px] border border-amber-500/20 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-amber-500/20 border border-amber-400/30 text-amber-300">
              <Wand2 size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                AI eCPR 맞춤 긴급 감정 처방전
              </h3>
              <p className="text-xs text-white/50">
                현재 느끼는 증상이나 상황을 적으면 30초 초응급 액션 플랜과 Kore 음성 가이드를 즉시 생성합니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleGeneratePrescription()}
            disabled={isPrescribing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white border border-amber-300/30 shrink-0"
          >
            {isPrescribing ? (
              <>
                <RefreshCw size={14} className="animate-spin text-amber-200" />
                <span>구급 처방 짓는 중...</span>
              </>
            ) : (
              <>
                <Wand2 size={14} className="text-white" />
                <span>⚡ 긴급 처방전 발급</span>
              </>
            )}
          </button>
        </div>

        {/* Input & Preset Chips */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGeneratePrescription()}
              placeholder="현재 상황이나 증상을 간단히 적어보세요... (예: 너무 긴장돼서 손이 떨려요, 억울해서 숨이 막혀요)"
              className="w-full px-4 py-3.5 rounded-2xl text-xs sm:text-sm text-white/95 placeholder-white/25 outline-none transition-all duration-200 bg-white/[0.03] backdrop-blur-md border border-white/10 focus:border-amber-400/60 focus:bg-white/[0.06]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-white/40 font-mono mr-1">빠른 선택:</span>
            {SYMPTOM_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setSymptomInput(preset);
                  handleGeneratePrescription(preset);
                }}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.03] hover:bg-white/[0.08] text-white/60 hover:text-amber-200 border border-white/5 transition-all cursor-pointer"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Prescribed Result Card */}
        <AnimatePresence>
          {prescription && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-red-950/30 to-black/60 border border-amber-400/30 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1 font-mono">
                    <Sparkles size={11} className="text-amber-300" />
                    {prescription.emergencyTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {/* TTS Kore Voice Player Button */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 text-xs font-bold transition-all shadow-sm">
                    <span className="text-[11px] font-sans">Kore 응급 음성</span>
                    <TTSButton
                      text={prescription.fullVoiceScript}
                      voice="Kore"
                      className="text-amber-200 hover:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Soothing Message */}
              <p className="text-sm sm:text-base text-amber-100 font-medium leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-amber-500/20">
                "{prescription.soothingMessage}"
              </p>

              {/* 3 Step Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300 font-mono">
                    <span>STEP 1</span>
                    <span>· 신체 생체 리셋</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">{prescription.step1Somatic}</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-mono">
                    <span>STEP 2</span>
                    <span>· 호흡 진정</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">{prescription.step2Respiration}</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-mono">
                    <span>STEP 3</span>
                    <span>· 구급 확언</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-semibold">{prescription.step3Mantra}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 💊 Soul Painkiller Mantras (구급 확언 캡슐 카드) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            eCPR 소울 진통제 확언 캡슐
          </h3>
          <span className="text-xs text-white/40 font-mono">즉효성 마음 안정제</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: '통제 상실 불안 시',
              quote: '내가 모든 것을 통제할 필요는 없다. 지금 내가 통제할 수 있는 유일한 것은 나의 다음 호흡이다.',
              color: 'text-sky-300',
              border: 'border-sky-500/20',
            },
            {
              title: '솟구치는 분노 시',
              quote: '지금 즉시 반응하지 않아도 내 힘은 줄어들지 않는다. 나의 침묵과 평온이 가장 거대한 방패다.',
              color: 'text-orange-300',
              border: 'border-orange-500/20',
            },
            {
              title: '자책과 멘탈 붕괴 시',
              quote: '나는 오늘 최선을 다했고, 넘어진 나 자신을 비난 대신 따뜻한 품으로 안아줄 자격이 있다.',
              color: 'text-purple-300',
              border: 'border-purple-500/20',
            },
            {
              title: '번아웃과 무기력 시',
              quote: '지친 것은 내가 나약해서가 아니라 너무 오랫동안 강했기 때문이다. 지금은 멈추어 쉴 시간이다.',
              color: 'text-amber-300',
              border: 'border-amber-500/20',
            },
          ].map((mantra, idx) => (
            <div
              key={idx}
              className={`glass p-5 rounded-3xl border ${mantra.border} space-y-3 backdrop-blur-xl flex flex-col justify-between`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${mantra.color}`}>
                    {mantra.title}
                  </span>
                  <TTSButton
                    text={mantra.quote}
                    voice="Kore"
                    className="text-white/60 hover:text-white"
                  />
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-serif break-keep">
                  "{mantra.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Emergency Help Footer */}
      <div className="glass p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-purple-400" />
          <span>지속적인 깊은 위안이나 대화가 필요하시다면 루시 AI와 상담을 나눠보세요.</span>
        </div>
        <button
          type="button"
          onClick={handleStartEmergencyLucyChat}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-bold transition-all cursor-pointer shrink-0 border border-purple-400/30 shadow-md hover:scale-[1.02] active:scale-95"
        >
          <MessageCircle size={14} className="animate-pulse" />
          <span>루시와 1:1 긴급 대화 (위험상태 알림)</span>
        </button>
      </div>
    </div>
  );
}

