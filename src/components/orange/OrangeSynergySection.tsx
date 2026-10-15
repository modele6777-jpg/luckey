import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  Radio,
  CheckCircle,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Compass,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Smile,
  Edit3,
  Headphones
} from 'lucide-react';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { invokeLLM } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import {
  getLocalWishes,
  loadWishesHistory,
  deduplicateWishes,
  WishEntry,
  WISH_CATEGORIES
} from '@/lib/wishingWell';
import { auth } from '@/lib/firebase';
import { playTTS, stopTTS, useTTSActive } from '@/utils/tts';
import { safeLocalStorage } from '@/utils/safeStorage';
import {
  getDynamicVibrationalAffirmation,
  getUserCounselingVibeContext,
  generateAIVibrationalAffirmation,
  UserCounselingVibeContext
} from '@/lib/vibrationalAffirmations';

interface QuantumCatalystData {
  title: string;
  manifestationFrequency: number;
  sensoryScript: string;
  quantumLeapActions: string[];
  vibrationalAnchorAffirmation: string;
}

export function generateNaturalSensoryScript(category: string, wish: string, vibe?: string): string {
  const cleanWish = (wish || '').trim().replace(/['"“”.]/g, '');

  switch (category) {
    case 'wealth':
      return `아침 햇살이 따스하게 쏟아지는 아늑한 공간에서 향긋하고 따뜻한 커피 잔을 손에 쥐고 있다. 잔고를 확인할 때마다 밀려오는 것은 조급함이나 불안이 아닌, '원하는 모든 것을 자유롭게 누릴 수 있다'는 깊고 충만한 안도감이다. 사랑하는 사람들에게 아낌없이 베풀고 나 자신을 온전히 돌볼 수 있는 여유가 온몸의 세포마다 감사함으로 스며든다. "${cleanWish}"의 결실은 이미 나의 자연스러운 일상이며, 나는 매 순간 평온하고 완전한 풍요의 중심에 서 있다.`;

    case 'career':
      return `마침내 바라던 정상에 올라 목표를 완벽히 달성했다는 소식을 듣는 순간, 가슴을 가득 채우는 벅찬 전율과 자긍심에 눈시울이 붉어진다. 나를 진심으로 인정해 주는 사람들의 축하와 따뜻한 박수가 귓가에 울리고, 굳은 악수 속에서 지난 모든 노력이 아름답게 꽃피었음을 실감한다. 내가 가진 전문성과 고유한 빛이 세상에 독보적인 가치를 더하고 있다는 보람찬 확신 속에서, "${cleanWish}"의 영광을 온마음으로 당당하게 누린다.`;

    case 'love':
      return `서로의 눈을 마주하는 것만으로도 세상의 모든 소음이 잦아들고 온전한 평온이 찾아온다. 나를 있는 그대로 깊이 이해하고 무조건적인 사랑으로 안아주는 소중한 사람의 온기가 맞잡은 두 손을 통해 가슴 깊숙이 전해진다. 함께 나누는 다정한 대화와 잔잔한 웃음소리가 공기를 따뜻하게 물들이고, 사랑받고 사랑하고 있다는 흔들림 없는 확신이 영혼을 감싼다. "${cleanWish}"의 기적은 이미 우리 두 사람의 일상 속에 아름답게 정착되었다.`;

    case 'health':
      return `이른 아침 창문을 열고 맑고 신선한 공기를 깊게 들이마실 때, 머리끝부터 발끝까지 맑고 청량한 생명력이 가득 차오른다. 피로와 긴장은 눈 녹듯 사라졌고, 가볍고 탄력 있는 걸음걸이와 맑은 눈빛으로 하루를 기쁨 속에 시작한다. 밤이면 근심 없이 깊고 평화로운 숙면에 빠져들고, 아침이면 넘치는 활력으로 눈을 뜬다. "${cleanWish}"의 건강함 속에서, 나의 몸과 마음은 지금 완벽한 조화와 젊음을 누리고 있다.`;

    case 'creative':
      return `오랜 시간 내면에서 잉태되어 온 독창적인 영감과 비전이 마침내 눈부신 작품으로 눈앞에 생생하게 완성되었다. 손끝을 통해 거침없이 흘러나온 창조적 에너지를 바라보는 순간, 온몸에 소름 돋는 카타르시스와 깊은 감격이 밀려온다. 세상에 나만의 고유한 예술과 이야기를 선보였다는 벅찬 성취감 속에서, "${cleanWish}"의 창조적 결실이 수많은 사람들의 마음에 깊은 울림을 전하고 있다.`;

    case 'freedom':
      return `내가 머물고 싶은 시공간에서, 내가 사랑하는 사람들과 함께 오롯이 내 삶의 주인이 되어 자유롭게 숨 쉬고 있다. 시원하고 투명한 바람이 볼을 스치고, 끝없이 펼쳐진 푸른 하늘을 바라볼 때 어떤 구속도 없는 온전한 해방감이 가슴을 가득 채운다. 시간과 장소의 얽매임 없이 원하는 일을 선택하며 살아가는 매 순간이 눈부신 축복이다. "${cleanWish}"의 라이프스타일은 이미 나의 현실이다.`;

    default:
      return `따뜻한 햇살과 부드러운 바람이 온몸을 감싸며, 마침내 바라던 모든 것이 완벽하게 실현되었다는 깊은 안도감이 가슴을 가득 채운다. 더 이상 바라는 결핍의 상태가 아니라, 이미 결실을 손에 쥐고 평온하게 미소 짓는 내 모습이 온몸의 감각으로 생생하게 느껴진다. "${cleanWish}"을 향한 오랜 소망은 이미 이루어졌고, 나는 그 벅찬 감사를 온 마음으로 누리고 있다.`;
  }
}

const FALLBACK_CATALYST: QuantumCatalystData = {
  title: "눈부신 풍요와 자유의 양자 현실화",
  manifestationFrequency: 528,
  sensoryScript: "따스한 햇살이 비추는 아늑한 공간에서 향긋한 커피 잔을 손에 쥐고 있다. 더 이상 일정이나 돈에 쫓기지 않고, 언제든 원하는 선택을 자유롭게 할 수 있다는 깊고 평온한 안도감이 가슴을 가득 채운다. 이미 모든 소망이 이루어졌음에 온 마음으로 감사하며, 이 벅찬 순간을 세포 하나하나로 온전히 만끽한다.",
  quantumLeapActions: [
    "이미 소원이 완벽히 이루어진 사람의 여유로운 태도와 걸음걸이로 오늘 하루를 살아가기",
    "소망의 실현을 기정사실화하고, 가슴을 뛰게 하는 첫 번째 작은 결정을 24시간 내 행동으로 옮기기",
    "잠들기 전 침대에서 감사한 미소를 지으며 이미 이루어진 현실의 정경을 1분간 생생히 느끼기"
  ],
  vibrationalAnchorAffirmation: "나의 의식 주파수는 지금 이 순간 기적의 장에 완전히 고정되었으며, 현실은 나의 고진동을 따라 즉각 재배열된다."
};

const MANIFESTATION_CATEGORIES = [
  {
    id: 'wealth',
    label: '금전 & 비즈니스',
    subLabel: '재정적 독립 · 무한 풍요',
    icon: '💎',
    vibe: '무한 풍요 & 기적',
    vibeId: 'abundance',
    frequency: 528,
    freqLabel: '528Hz 풍요',
    defaultWish: '월 3,000만원 이상의 자유로운 패시브 인컴과 재정적 독립'
  },
  {
    id: 'career',
    label: '커리어 & 도약',
    subLabel: '합격 · 승진 · 전문성',
    icon: '🚀',
    vibe: '자신감 & 강력한 돌파',
    vibeId: 'confidence',
    frequency: 528,
    freqLabel: '528Hz 돌파',
    defaultWish: '원하던 글로벌 프로젝트 성공 및 꿈의 포지션 안착'
  },
  {
    id: 'love',
    label: '운명적 사랑 & 인연',
    subLabel: '소울메이트 · 온기 회복',
    icon: '💖',
    vibe: '사랑 & 온기 회복',
    vibeId: 'love',
    frequency: 639,
    freqLabel: '639Hz 조화',
    defaultWish: '서로를 깊이 존중하고 영혼을 성장시키는 평생의 인연'
  },
  {
    id: 'health',
    label: '완벽한 생명력 & 활력',
    subLabel: '건강 회복 · 평온과 이완',
    icon: '🌿',
    vibe: '평온 & 불안 정화',
    vibeId: 'peace',
    frequency: 432,
    freqLabel: '432Hz 치유',
    defaultWish: '지치지 않는 에너제틱한 건강과 맑고 깊은 숙면'
  },
  {
    id: 'creative',
    label: '창작 & 영감 폭발',
    subLabel: '독창적 예술 · 직관 발현',
    icon: '🎨',
    vibe: '명료한 통찰 & 직관',
    vibeId: 'clarity',
    frequency: 741,
    freqLabel: '741Hz 영감',
    defaultWish: '세상을 놀라게 할 위대한 예술작품과 창작의 결실'
  },
  {
    id: 'freedom',
    label: '공간/시간 완전한 자유',
    subLabel: '시공간 초월 · 자유로운 삶',
    icon: '🕊️',
    vibe: '해방 & 무한한 자유',
    vibeId: 'freedom',
    frequency: 852,
    freqLabel: '852Hz 초월',
    defaultWish: '언제 어디서든 원하는 일을 하며 사는 자유로운 라이프스타일'
  },
];

function formatWishDate(dateVal: any): string {
  if (!dateVal) return '최근';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '최근';
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}일 전`;
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  } catch {
    return '최근';
  }
}

export function OrangeSynergySection() {
  const { updateSharedState } = useApp();
  const userProfile = getPersistentUserProfile();
  const [selectedCategory, setSelectedCategory] = useState<string>(MANIFESTATION_CATEGORIES[0].id);
  const [targetWish, setTargetWish] = useState<string>(MANIFESTATION_CATEGORIES[0].defaultWish);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // User Counseling Context & Real-time Vibe (Mood)
  const [vibeContext, setVibeContext] = useState<UserCounselingVibeContext>(() => getUserCounselingVibeContext());
  const [selectedVibe, setSelectedVibe] = useState<string>(() => vibeContext.currentVibe);
  const [selectedVibeId, setSelectedVibeId] = useState<string>(() => vibeContext.vibeId);
  const [isCustomVibeEditing, setIsCustomVibeEditing] = useState<boolean>(false);
  const [customVibeInputText, setCustomVibeInputText] = useState<string>('');
  const [isAffirmationGenerating, setIsAffirmationGenerating] = useState<boolean>(false);

  const [catalystData, setCatalystData] = useState<QuantumCatalystData>(() => {
    const initialContext = getUserCounselingVibeContext();
    const { affirmation } = getDynamicVibrationalAffirmation(
      MANIFESTATION_CATEGORIES[0].id,
      MANIFESTATION_CATEGORIES[0].defaultWish,
      528,
      0,
      initialContext
    );
    const initialSensory = generateNaturalSensoryScript(
      MANIFESTATION_CATEGORIES[0].id,
      MANIFESTATION_CATEGORIES[0].defaultWish,
      initialContext.currentVibe
    );
    return {
      ...FALLBACK_CATALYST,
      sensoryScript: initialSensory,
      vibrationalAnchorAffirmation: affirmation
    };
  });

  const [isSynthesized, setIsSynthesized] = useState<boolean>(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedAffirmation, setCopiedAffirmation] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [dialValue, setDialValue] = useState<number>(528);
  const [recentWishingWellWish, setRecentWishingWellWish] = useState<string | null>(null);
  const [wishesHistory, setWishesHistory] = useState<WishEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(false);
  const [affirmationCycleIndex, setAffirmationCycleIndex] = useState<number>(0);
  const [isAffirmationSpeaking, setIsAffirmationSpeaking] = useState<boolean>(false);
  const isTTSActive = useTTSActive();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Refresh counseling & vibe context when component loads
  useEffect(() => {
    const updated = getUserCounselingVibeContext();
    setVibeContext(updated);
    if (!safeLocalStorage.getItem('orange_catalyst_user_vibe')) {
      setSelectedVibe(updated.currentVibe);
      setSelectedVibeId(updated.vibeId);
    }
  }, []);

  // Load wishing well history (both local and cloud)
  const fetchWishesHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const uid = auth.currentUser?.uid || 'guest';
      const remoteList = await loadWishesHistory(uid);
      const guestList = getLocalWishes('guest');
      const nickList = userProfile?.basic?.nickname ? getLocalWishes(userProfile.basic.nickname) : [];
      const userList = uid !== 'guest' ? getLocalWishes(uid) : [];
      const merged = deduplicateWishes([...remoteList, ...userList, ...guestList, ...nickList]);
      setWishesHistory(merged);
      if (merged.length > 0) {
        setRecentWishingWellWish(merged[0].wish);
      }
    } catch (e) {
      console.warn('[OrangeSynergySection] Error loading wishes history:', e);
    } finally {
      setLoadingHistory(false);
    }
  }, [userProfile?.basic?.nickname]);

  useEffect(() => {
    fetchWishesHistory();

    const handleWishCast = () => {
      fetchWishesHistory();
    };
    window.addEventListener('prism:wish_cast', handleWishCast);
    return () => {
      window.removeEventListener('prism:wish_cast', handleWishCast);
    };
  }, [fetchWishesHistory]);

  const toggle528Hz = () => {
    if (isAudioPlaying) {
      try {
        oscRef.current?.stop();
        audioCtxRef.current?.close();
      } catch (e) {}
      audioCtxRef.current = null;
      oscRef.current = null;
      setIsAudioPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(dialValue || 528, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        setIsAudioPlaying(true);
      } catch (e) {
        console.warn('528Hz audio synthesis error:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      try {
        oscRef.current?.stop();
        audioCtxRef.current?.close();
      } catch (e) {}
      stopTTS();
    };
  }, []);

  const handleSpeakCatalyst = () => {
    if (isTTSActive) {
      stopTTS();
    } else {
      const speech = `양자 현실화 오감 스크립트입니다. ${catalystData.sensoryScript} 주파수 고정 진동 확언입니다. ${catalystData.vibrationalAnchorAffirmation}`;
      playTTS(speech, 'Kore', false, '확신');
    }
  };

  const handleSpeakAffirmation = () => {
    if (isTTSActive || isAffirmationSpeaking) {
      stopTTS();
      setIsAffirmationSpeaking(false);
    } else {
      setIsAffirmationSpeaking(true);
      playTTS(catalystData.vibrationalAnchorAffirmation, 'Kore', false, '확신');
      setTimeout(() => setIsAffirmationSpeaking(false), 8000);
    }
  };

  const handleCopyAffirmation = () => {
    navigator.clipboard.writeText(catalystData.vibrationalAnchorAffirmation);
    setCopiedAffirmation(true);
    setTimeout(() => setCopiedAffirmation(false), 2000);
  };

  // 🎲 Dynamic Affirmation Generation & Shuffle attuned to Counseling Topic & Current Vibe
  const cycleNextAffirmation = async (delta: number = 1) => {
    const nextIdx = affirmationCycleIndex + delta;
    setAffirmationCycleIndex(nextIdx);
    setIsAffirmationGenerating(true);

    // 1. Immediately apply fast procedural vibe-attuned synthesis
    const { affirmation } = getDynamicVibrationalAffirmation(
      selectedCategory,
      targetWish,
      dialValue,
      nextIdx,
      {
        counselingTopic: vibeContext.counselingTopic,
        currentVibe: selectedVibe
      }
    );
    setCatalystData(prev => ({
      ...prev,
      vibrationalAnchorAffirmation: affirmation
    }));

    // 2. Asynchronously request AI-generated dynamic affirmation tailored to counseling + vibe
    try {
      const aiAffirmation = await generateAIVibrationalAffirmation({
        category: selectedCategory,
        wish: targetWish,
        frequency: dialValue,
        counselingTopic: vibeContext.counselingTopic,
        currentVibe: selectedVibe,
        cycleOffset: nextIdx
      });

      if (aiAffirmation && aiAffirmation.length >= 15) {
        setCatalystData(prev => ({
          ...prev,
          vibrationalAnchorAffirmation: aiAffirmation
        }));
      }
    } catch (e) {
      console.warn('[OrangeSynergySection] AI affirmation generation error:', e);
    } finally {
      setIsAffirmationGenerating(false);
    }
  };

  // Custom Vibe Submission
  const handleCustomVibeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customVibeInputText.trim()) return;

    const trimmed = customVibeInputText.trim();
    setSelectedVibe(trimmed);
    setSelectedVibeId('custom');
    safeLocalStorage.setItem('orange_catalyst_user_vibe', trimmed);
    setIsCustomVibeEditing(false);
    setCustomVibeInputText('');

    const nextIdx = affirmationCycleIndex + 1;
    setAffirmationCycleIndex(nextIdx);
    const { affirmation } = getDynamicVibrationalAffirmation(
      selectedCategory,
      targetWish,
      dialValue,
      nextIdx,
      {
        counselingTopic: vibeContext.counselingTopic,
        currentVibe: trimmed
      }
    );
    setCatalystData(prev => ({
      ...prev,
      vibrationalAnchorAffirmation: affirmation
    }));
  };

  const handleCategorySelect = (cat: typeof MANIFESTATION_CATEGORIES[0]) => {
    setSelectedCategory(cat.id);
    setTargetWish(cat.defaultWish);
    setSelectedVibe(cat.vibe);
    setSelectedVibeId(cat.vibeId);
    setDialValue(cat.frequency);

    const nextIdx = affirmationCycleIndex + 1;
    setAffirmationCycleIndex(nextIdx);
    const { affirmation } = getDynamicVibrationalAffirmation(
      cat.id,
      cat.defaultWish,
      cat.frequency,
      nextIdx,
      {
        counselingTopic: vibeContext.counselingTopic,
        currentVibe: cat.vibe
      }
    );
    const naturalSensory = generateNaturalSensoryScript(cat.id, cat.defaultWish, cat.vibe);
    setCatalystData(prev => ({
      ...prev,
      sensoryScript: naturalSensory,
      manifestationFrequency: cat.frequency,
      vibrationalAnchorAffirmation: affirmation
    }));
  };

  const handleDialChange = (freq: number) => {
    setDialValue(freq);
    const nextIdx = affirmationCycleIndex + 1;
    setAffirmationCycleIndex(nextIdx);
    const { affirmation } = getDynamicVibrationalAffirmation(
      selectedCategory,
      targetWish,
      freq,
      nextIdx,
      {
        counselingTopic: vibeContext.counselingTopic,
        currentVibe: selectedVibe
      }
    );
    setCatalystData(prev => ({
      ...prev,
      manifestationFrequency: freq,
      vibrationalAnchorAffirmation: affirmation
    }));
  };

  const handleSelectWishFromHistory = (entry: WishEntry) => {
    setTargetWish(entry.wish);
    // Find matching category if any
    const cat = MANIFESTATION_CATEGORIES.find(c => 
      c.id === entry.category ||
      (entry.category === 'inner_peace' && c.id === 'health') ||
      (entry.category === 'self_love' && c.id === 'love') ||
      (entry.category === 'courage' && c.id === 'career') ||
      (entry.category === 'dream' && c.id === 'creative') ||
      (entry.category === 'relationship' && c.id === 'love')
    ) || MANIFESTATION_CATEGORIES[0];

    setSelectedCategory(cat.id);
    setSelectedVibe(cat.vibe);
    setSelectedVibeId(cat.vibeId);
    setDialValue(cat.frequency);

    const nextIdx = affirmationCycleIndex + 1;
    setAffirmationCycleIndex(nextIdx);
    const { affirmation } = getDynamicVibrationalAffirmation(
      cat.id,
      entry.wish,
      cat.frequency,
      nextIdx,
      {
        counselingTopic: vibeContext.counselingTopic,
        currentVibe: cat.vibe
      }
    );
    const naturalSensory = generateNaturalSensoryScript(cat.id, entry.wish, cat.vibe);
    setCatalystData(prev => ({
      ...prev,
      sensoryScript: naturalSensory,
      manifestationFrequency: cat.frequency,
      vibrationalAnchorAffirmation: affirmation
    }));
  };

  const handleAccelerateManifestation = async () => {
    setIsLoading(true);
    const catObj = MANIFESTATION_CATEGORIES.find(c => c.id === selectedCategory);
    const categoryName = catObj ? catObj.label : '목표';

    const systemPrompt = `당신은 세계 최고의 끌어당김(The Secret) 및 오감 시각화(Living in the End) 현실화 마스터입니다.
사용자가 바라는 소망이 '미래에 이루어질 것'이 아니라, '지금 이 순간 물리적 현실에서 100% 완성되어 이미 누리고 있는 상태'를 1인칭 시점의 생생하고 감동적인 오감 현실화 스크립트로 작성합니다.

[오감 현실화 스크립트(sensoryScript) 절대 원칙]
1. 앱 메뉴 언급 금지: "좌측 메뉴", "우측 메뉴", "소원의 우물", "융합 매트릭스" 같은 앱 기능이나 화면 인터페이스 용어를 절대 쓰지 마십시오.
2. 기계적 문구 금지: "528Hz 주파수와 결합하여", "을(를)", "양자 도약 연금술이 작동하여" 같은 어색한 번역투나 인위적 문구를 절대 쓰지 마십시오.
3. 오감(시각·청각·촉각·호흡·온도)과 가슴 벅찬 안도감/환희를 네빌 고다드 식 '이미 이루어진 상태'의 1인칭 현재형("~하고 있다", "~가 전해진다", "~차오른다")으로 문학적이고 자연스럽게 3~4문장으로 서술하십시오.
4. 읽는 것만으로도 온몸에 전율이 돋고 심장이 따뜻해지는 감동적인 문체여야 합니다.`;

    const userPrompt = `[현실화 소망]: "${targetWish}"
[핵심 영역]: ${categoryName}
[사용자 호칭]: "${userProfile?.basic?.nickname || userProfile?.basic?.name || '제제'}"
[현재 진동 무드]: "${selectedVibe}"
[해소할 내면 고민]: "${vibeContext.counselingTopic}"

위 소망이 100% 이루어져 지금 눈앞에서 만끽하고 있는 현실을 가장 감동적이고 자연스러운 1인칭 오감 스크립트로 완성해 주세요.

반드시 아래 JSON 스키마로만 엄격하게 응답하세요:
{
  "title": "감동적인 현실화 테마 명칭 (예: 눈부신 경제적 자유의 아침)",
  "manifestationFrequency": ${dialValue},
  "sensoryScript": "1인칭 현재형으로 이미 소원이 이루어진 순간의 시각·청각·촉각·온도·벅찬 안도감을 묘사한 지극히 자연스럽고 감동적인 오감 스크립트 (3~4문장, 200~320자 내외)",
  "quantumLeapActions": [
    "24시간 내 즉시 실행할 현실화 실천 행동 1",
    "24시간 내 즉시 실행할 마음가짐 전환 2",
    "오늘 밤 잠들기 전 1분 감사 시각화 실천 3"
  ],
  "vibrationalAnchorAffirmation": "소망이 이미 이루어졌음을 선언하는 강력하고 자연스러운 1인칭 현재형 확언 (1문장, 50~80자 내외)"
}`;

    const fallbackAffirmation = getDynamicVibrationalAffirmation(
      selectedCategory,
      targetWish,
      dialValue,
      affirmationCycleIndex + 1,
      {
        counselingTopic: vibeContext.counselingTopic,
        currentVibe: selectedVibe
      }
    ).affirmation;

    const naturalFallbackScript = generateNaturalSensoryScript(selectedCategory, targetWish, selectedVibe);

    const safetyTimeout = new Promise<QuantumCatalystData>((resolve) => {
      setTimeout(() => {
        resolve({
          title: `〈${categoryName}〉 ${dialValue}Hz 현실화 완성`,
          manifestationFrequency: dialValue,
          sensoryScript: naturalFallbackScript,
          quantumLeapActions: [
            `이미 소원이 완전히 실현된 사람의 여유롭고 당당한 태도로 오늘 하루를 살아가기`,
            "소망의 실현을 기정사실화하고, 24시간 내 가슴 뛰는 첫 번째 구체적 행동(연락, 예약, 결단) 즉시 실행하기",
            "오늘 밤 잠들기 전 침대에서 감사의 미소를 지으며 이미 이루어진 평온한 정경을 1분간 오감으로 느끼기"
          ],
          vibrationalAnchorAffirmation: fallbackAffirmation
        });
      }, 6500);
    });

    const runAI = async (): Promise<QuantumCatalystData> => {
      try {
        const raw = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          responseFormat: { type: 'json_object' }
        });
        const parsed = typeof raw === 'string' ? JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim()) : raw;
        if (parsed && parsed.sensoryScript) {
          if (!parsed.vibrationalAnchorAffirmation || parsed.vibrationalAnchorAffirmation.length < 10) {
            parsed.vibrationalAnchorAffirmation = fallbackAffirmation;
          }
          return parsed;
        }
      } catch (e) {
        console.warn('[OrangeSynergy] invokeLLM error:', e);
      }
      throw new Error('Need fallback');
    };

    try {
      const result = await Promise.race([runAI(), safetyTimeout]);
      setCatalystData(result);
      setIsSynthesized(true);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      recordPrismFeature({
        app: 'orange',
        featureName: 'Orange Quantum Catalyst Synergy',
        summary: result.title,
        details: { category: categoryName, wish: targetWish, vibe: selectedVibe }
      });
      updateSharedState({}, 'ORANGE');
    } catch (e) {
      console.warn('Catalyst error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const text = `🌲 [${catalystData.title}]\n\n🎯 목표 소원: ${targetWish}\n🌀 진동 주파수: ${catalystData.manifestationFrequency}Hz\n✨ 조율 Vibe: ${selectedVibe}\n\n✨ 이미 이루어진 오감 현실화 스크립트:\n"${catalystData.sensoryScript}"\n\n🚀 24시간 실천 행동:\n${catalystData.quantumLeapActions.map((a, i) => `${i+1}. ${a}`).join('\n')}\n\n⚡ 주파수 고정 확언:\n"${catalystData.vibrationalAnchorAffirmation}"\n\n- PRISM ORANGE Quantum Manifestation Catalyst`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 text-white font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-orange-500/30 bg-gradient-to-br from-orange-950/50 via-zinc-950/90 to-amber-950/40 shadow-[0_0_50px_rgba(249,115,22,0.15)] backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-widest uppercase bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1.5">
                <Sparkles size={12} className="text-yellow-400 animate-pulse" />
                QUANTUM CATALYST
              </span>
              <span className="text-[10px] text-white/40 font-mono">{dialValue}Hz MIRACLE TONE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Zap className="text-orange-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]" size={28} />
              <span>양자 현실화 가속기 (Quantum Manifestation Catalyst)</span>
            </h2>
            <p className="text-xs sm:text-sm text-orange-100/70 max-w-xl leading-relaxed">
              솔페지오 진동수와 1인칭 오감 확언을 통해, 바라는 소망을 미래가 아닌 <strong>'지금 이 순간 이미 이루어진 현실'</strong>로 가속 동조시키는 양자 가속기입니다.
            </p>
          </div>

          <button
            onClick={toggle528Hz}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-sans flex items-center gap-2 border transition-all cursor-pointer shrink-0 ${
              isAudioPlaying
                ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
            }`}
          >
            {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isAudioPlaying ? `${dialValue}Hz 주파수 재생 중` : `${dialValue}Hz 주파수 켜기`}</span>
          </button>
        </div>
      </div>

      {/* Star Wishing Past History Bar (별에게 빌었던 과거 소망 불러오기) */}
      {wishesHistory.length > 0 && (
        <div className="p-4 sm:p-5 rounded-[24px] bg-gradient-to-r from-amber-950/30 via-zinc-950/40 to-orange-950/30 border border-amber-400/25 space-y-3 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass size={15} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-200 font-sans">
                별에게 빌었던 소망 불러오기 (별의 기억)
              </span>
              <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/15 border border-amber-400/25 px-2 py-0.5 rounded-full">
                별빛 소원 {wishesHistory.length}건
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchWishesHistory()}
                title="기록 새로고침"
                className="p-1 rounded-lg text-white/40 hover:text-amber-300 hover:bg-white/5 transition-all cursor-pointer"
              >
                <RefreshCw size={12} className={loadingHistory ? 'animate-spin text-amber-400' : ''} />
              </button>
              {wishesHistory.length > 2 && (
                <button
                  type="button"
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer font-sans"
                >
                  <span>{isHistoryExpanded ? '접기' : `더보기 (${wishesHistory.length}개)`}</span>
                  {isHistoryExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}
            </div>
          </div>

          <div className={`space-y-1.5 overflow-y-auto pr-1 ${isHistoryExpanded ? 'max-h-56' : 'max-h-36'}`}>
            {(isHistoryExpanded ? wishesHistory : wishesHistory.slice(0, 2)).map((item, idx) => {
              const isSelected = targetWish === item.wish;
              const catMeta = WISH_CATEGORIES.find(c => c.id === item.category);

              return (
                <div
                  key={item.id || idx}
                  onClick={() => handleSelectWishFromHistory(item)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-white/[0.03] hover:bg-amber-500/10 border-white/10 hover:border-amber-400/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                        {catMeta?.emoji || '🪙'} {item.categoryLabel || catMeta?.label || '소원'}
                      </span>
                      {item.crystalKeyword && (
                        <span className="text-[9px] text-yellow-200/80 font-mono bg-yellow-500/10 px-1 rounded border border-yellow-500/20">
                          ✨ {item.crystalKeyword}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-white/40 font-mono shrink-0">
                      {formatWishDate(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white/90 group-hover:text-amber-100 transition-colors break-keep break-words">
                    "{item.wish}"
                  </p>

                  <div className="mt-1 flex items-center justify-between text-[9px]">
                    <span className="text-amber-400/70 group-hover:text-amber-300 font-mono flex items-center gap-1">
                      <Sparkles size={9} />
                      {isSelected ? '현재 가속 목표 선택됨' : '목표로 불러오기'}
                    </span>
                    {isSelected && (
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <CheckCircle size={10} /> 활성
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Target Wish Formulation Card */}
      <div className="glass p-6 sm:p-8 rounded-[32px] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-orange-300 flex items-center gap-2 font-mono uppercase tracking-wider">
            <Radio size={16} className="text-orange-400" />
            <span>현실화 핵심 영역 선택</span>
          </label>
          <span className="text-[10px] text-white/40 font-sans">양자장 동판 각인</span>
        </div>

        {/* Category Chips - Unified Single Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MANIFESTATION_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500/25 border-orange-400/90 text-white shadow-[0_0_20px_rgba(249,115,22,0.35)] scale-[1.02] ring-1 ring-orange-400/50'
                    : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/5 hover:text-white hover:border-orange-400/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl shrink-0">{cat.icon}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold font-sans block break-keep break-words text-white">{cat.label}</span>
                    <span className="text-[10px] text-white/40 block break-keep break-words">{cat.subLabel}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono pt-1.5 border-t border-white/5">
                  <span className={isSelected ? 'text-amber-300 font-bold' : 'text-white/40'}>
                    {cat.freqLabel}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded-full break-keep ${isSelected ? 'bg-orange-500/30 text-orange-200 font-bold' : 'bg-white/5 text-white/40'}`}>
                    {cat.vibe}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Target Wish Input */}
        <div>
          <label className="block text-[11px] text-white/60 mb-2 font-medium">
            현실화할 소망을 구체적으로 확정하세요 (이미 이루어진 것처럼 작성하면 가속화됩니다):
          </label>
          <textarea
            rows={3}
            value={targetWish}
            onChange={(e) => {
              setTargetWish(e.target.value);
              const { affirmation } = getDynamicVibrationalAffirmation(
                selectedCategory,
                e.target.value,
                dialValue,
                affirmationCycleIndex,
                { counselingTopic: vibeContext.counselingTopic, currentVibe: selectedVibe }
              );
              setCatalystData(prev => ({ ...prev, vibrationalAnchorAffirmation: affirmation }));
            }}
            placeholder="예: 2026년 가을까지 온전한 경제적 자유를 이루고 사랑하는 사람들과 함께 세계를 여행한다..."
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400/60 leading-relaxed resize-none font-sans"
          />
          {recentWishingWellWish && targetWish !== recentWishingWellWish && (
            <button
              type="button"
              onClick={() => {
                setTargetWish(recentWishingWellWish);
                const { affirmation } = getDynamicVibrationalAffirmation(
                  selectedCategory,
                  recentWishingWellWish,
                  dialValue,
                  affirmationCycleIndex,
                  { counselingTopic: vibeContext.counselingTopic, currentVibe: selectedVibe }
                );
                setCatalystData(prev => ({ ...prev, vibrationalAnchorAffirmation: affirmation }));
              }}
              className="text-[11px] text-orange-300 hover:text-orange-200 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer mt-2 break-keep"
            >
              <Sparkles size={12} className="text-orange-400 animate-pulse shrink-0" />
              <span className="text-left break-keep break-words">별에게 빌었던 최근 소원 적용: "{recentWishingWellWish}"</span>
            </button>
          )}
        </div>

        {/* 🌟 Real-time Counseling Topic & Vibe Tuning Panel */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-orange-950/30 to-zinc-950/60 border border-orange-400/30 space-y-3 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30">
                <Smile size={14} className="text-amber-400" />
              </span>
              <div>
                <div className="text-[11px] font-bold text-orange-200 font-mono tracking-wide uppercase flex items-center gap-1.5">
                  <span>상담 맥락 & 현재 Vibe(기분) 동적 연동</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                    REALTIME SYNC
                  </span>
                </div>
                <div className="text-[10px] text-white/50 flex items-center gap-1">
                  <span>최근 상담 맥락:</span>
                  <strong className="text-orange-300 font-normal">"{vibeContext.counselingTopic}"</strong>
                  <span className="text-[9px] text-white/40">({vibeContext.sourceDescription})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setIsCustomVibeEditing(!isCustomVibeEditing)}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Edit3 size={10} />
                <span>{isCustomVibeEditing ? '닫기' : '기분 직접 입력'}</span>
              </button>
            </div>
          </div>

          {/* Custom Vibe Input Form (Optional) */}
          {isCustomVibeEditing && (
            <form onSubmit={handleCustomVibeSubmit} className="flex gap-2 pt-1 pb-1">
              <input
                type="text"
                value={customVibeInputText}
                onChange={(e) => setCustomVibeInputText(e.target.value)}
                placeholder="현재 기분/원하는 Vibe를 직접 적어주세요 (예: 답답함을 뚫는 시원한 해방감)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-orange-400/40 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-orange-400 font-sans"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs shrink-0 cursor-pointer"
              >
                적용
              </button>
            </form>
          )}

          {/* Current tuned Vibe indicator */}
          <div className="flex items-center justify-between text-[11px] bg-black/30 p-2.5 rounded-xl border border-white/5">
            <span className="text-white/60">선택된 핵심 영역 공명 Vibe:</span>
            <span className="text-amber-300 font-bold font-mono">"{selectedVibe}"</span>
          </div>
        </div>

        {/* Frequency Tuning Bar */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Zap size={14} className="text-yellow-400" />
              양자 진동수 조율: <strong className="text-orange-400 font-mono">{dialValue}Hz</strong>
            </span>
            <p className="text-[10px] text-white/50">솔페지오 주파수에 맞춰 의식과 세포의 진동을 정렬합니다.</p>
          </div>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {[432, 528, 639, 741, 852].map((freq) => (
              <button
                key={freq}
                onClick={() => handleDialChange(freq)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition-all cursor-pointer ${
                  dialValue === freq
                    ? 'bg-orange-500 text-white shadow-md ring-1 ring-orange-300'
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                {freq}Hz
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAccelerateManifestation}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw size={18} className="animate-spin text-black" />
              <span>시크릿 & 별빛 소원 양자장 가속 중...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} className="text-black" />
              <span>〈양자 현실화 가속기 & 오감 스크립트〉 즉시 가동</span>
            </>
          )}
        </button>
      </div>

      {/* Synthesized Output Display */}
      {isSynthesized && (
        <motion.div
          ref={resultRef}
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-black/95 border border-orange-500/30 p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-7 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-400">
                  QUANTUM MANIFESTATION CERTIFICATE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 font-mono font-bold">
                  {catalystData.manifestationFrequency}Hz
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                  {selectedVibe}
                </span>
              </div>
              <h3 className="text-base sm:text-xl md:text-2xl font-black text-white break-keep break-words">{catalystData.title}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleSpeakCatalyst}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isTTSActive
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 animate-pulse'
                    : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 border border-orange-500/30'
                }`}
              >
                {isTTSActive ? <VolumeX size={14} className="text-amber-300" /> : <Volume2 size={14} className="text-orange-300" />}
                <span>{isTTSActive ? '낭독 중단' : '오감 스크립트 & 주파수 확언 낭독'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? '복사 완료' : '전체 스크립트 복사'}</span>
              </button>
            </div>
          </div>

          {/* ⚡ Vibrational Anchor Affirmation Card - 주파수 고정 진동 확언 (최상단 하이라이트) */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/25 to-yellow-500/20 border-2 border-amber-400/60 relative shadow-2xl space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] sm:text-xs font-mono text-amber-300 uppercase tracking-widest font-black flex items-center gap-1.5">
                <span className="text-amber-400 font-bold text-sm animate-pulse">⚡</span>
                <span>주파수 고정 진동 확언 (Vibrational Anchor Affirmation)</span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-[11px] text-amber-200 font-mono bg-amber-400/30 border border-amber-400/50 px-2.5 py-0.5 rounded-full font-bold shadow-sm shrink-0">
                  {catalystData.manifestationFrequency}Hz 고정
                </span>
                <span className="text-[10px] text-orange-200/90 font-mono bg-orange-500/20 border border-orange-400/30 px-2 py-0.5 rounded-full shrink-0">
                  {selectedVibe}
                </span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/60 border border-amber-400/30 shadow-inner">
              <p className="text-base sm:text-lg md:text-xl font-black text-amber-100 leading-relaxed tracking-tight break-keep break-words font-serif whitespace-normal">
                "{catalystData.vibrationalAnchorAffirmation}"
              </p>
            </div>

            {/* Quick Affirmation Action Controls */}
            <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleSpeakAffirmation}
                  disabled={isTTSActive}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                  title="확언 음성 낭독 듣기"
                >
                  <Volume2 size={13} className={isAffirmationSpeaking ? "animate-bounce text-yellow-300" : ""} />
                  <span>{isAffirmationSpeaking ? '낭독 중...' : '확언 낭독'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyAffirmation}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/15 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  title="확언 텍스트 복사"
                >
                  {copiedAffirmation ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedAffirmation ? '복사 완료' : '확언 복사'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => cycleNextAffirmation(1)}
                  disabled={isAffirmationGenerating}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 text-amber-300 border border-orange-400/40 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  title="다른 진동 확언으로 순환 조율"
                >
                  <RefreshCw size={12} className={isAffirmationGenerating ? "animate-spin text-orange-400" : ""} />
                  <span>{isAffirmationGenerating ? '확언 조율 중...' : '다른 확언 조율'}</span>
                </button>
                <button
                  type="button"
                  onClick={toggle528Hz}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${
                    isAudioPlaying
                      ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/15'
                  }`}
                  title="주파수 톤 청음"
                >
                  <Headphones size={13} />
                  <span>{isAudioPlaying ? `${dialValue}Hz 정지` : `${dialValue}Hz 청음`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sensory Script Card - Prominently Displayed Centerpiece */}
          <div className="p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-900/35 via-zinc-900/60 to-yellow-900/25 border border-orange-400/50 relative shadow-xl space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10.5px] sm:text-[11px] font-mono text-orange-300 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Sparkles size={14} className="text-yellow-400 animate-pulse shrink-0" />
                <span>이미 이루어진 오감 현실화 스크립트 (Living in the End)</span>
              </span>
              <span className="text-[10px] text-amber-300/80 font-mono bg-amber-500/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                오감 몰입 정렬
              </span>
            </div>
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-tight break-keep break-words whitespace-normal">
              "{catalystData.sensoryScript}"
            </p>
          </div>

          {/* 3 Quantum Leap Actions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-orange-300 uppercase font-mono tracking-wider flex items-center gap-2">
              <Zap size={14} /> 24시간 내 즉시 실행할 양자 도약 실천 3가지
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {catalystData.quantumLeapActions.map((act, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md">
                    LEAP #{idx + 1}
                  </span>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">{act}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
