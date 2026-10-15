import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sparkles, Send, Volume2, VolumeX, Star, Moon, Sun,
  RefreshCw, ChevronDown, Zap, Eye, MessageCircle, ImageIcon,
  BarChart2, Copy, Check, X, Shuffle, History, LayoutGrid,
  Brain, Users, ChevronLeft, ChevronRight, Activity, Music, TreeDeciduous, Bird, Home, Settings, ShieldCheck, Database, Stars as LucideStars, User, Layout, Library, Wind, Heart, Feather, Layers, BookOpen, Smile, Radio, Lock, Compass, Trash2, Mail, Award, Trophy
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useApp, getPersistentUserProfile, setPersistentUserProfile } from '@/contexts/AppContext';
import { mergeUserProfiles, type UserProfile } from '@/lib/sharedState';
import { trpc } from '@/lib/trpc';
import { 
  invokeLLM, 
  invokeLLMStream, 
  invokeLLMStructured, 
  PERSONAS,
  poeQuickInsight,
  buildDeepSynapseContext,
  getCrossAppRecentDialogueContext,
} from '@/lib/ai';
import { shuffleCardDeck, quantumSeedShuffle } from '@/lib/cardShuffle';
import { Streamdown } from '@/components/Streamdown';
import { CalendarView } from '@/components/CalendarView';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import NoticeModal from '@/components/NoticeModal';
import { TTSButton } from '@/components/TTSButton';
import { ImageOutputActions } from '@/components/ImageOutputActions';
import { recordPrismFeature, recordDailyOracleResult } from '@/lib/prismOmniSync';

import { HoponoponoBible } from '@/components/bluebird/HoponoponoBible';
import { SecretMessage } from '@/components/bluebird/SecretMessage';
import { BluebirdSynergySection } from '@/components/bluebird/BluebirdSynergySection';
import { openChannelIntro } from '@/components/common/ChannelIntroModal';
import { HoponoponoToolPicker, HoponoponoToolResultCard } from '@/components/bluebird/HoponoponoToolGenerator';
import {
  generateHoponoponoTool,
  persistHoponoponoTool,
  loadLastHoponoponoTool,
  getHoponoponoToolFallback,
  getHoponoponoToolFallbackImageUrl,
  HOPONOPONO_TOOL_CATALOG,
  type HoponoponoToolId,
  type SavedHoponoponoTool,
} from '@/lib/hoponoponoTools';
import {
  getCuratedArtworkForCleansing,
  buildDynamicCleansingImagePrompt,
} from '@/data/hoponoponoArtworks';
import { sendHoponoponoToLucy } from '@/lib/oracleDeepInsight';
import { playTTS, playConversation, stopTTS, useTTSActive } from '@/utils/tts';
import { z } from "zod";
import { useBinauralBeat } from '@/hooks/useBinauralBeat';
import { auth, db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs, limit, handleFirestoreError, OperationType, doc, getDoc, setDoc } from '@/lib/firebase';

import { getTodayDateKey, getDailyLockKey, isTimestampToday } from '@/lib/dailyCache';
import { PRISM_VOICE_RULES } from '@/lib/copyTone';
import { useScrollToTopOnChange } from '@/hooks/useScrollToTopOnChange';
import { resetAppScroll } from '@/utils/scrollToTop';
import {
  SPECIAL_FEATURE_CHROME_HIDDEN_CLASS,
  useSpecialFeatureChromeHidden,
} from '@/components/SpecialFeaturePanel';
import { LucKeyLogoText } from '@/components/LucKeyLogoText';
import { useSwipeableTabs } from '@/hooks/useSwipeableTabs';

const BLUEBIRD_SWIPE_TABS = ['daily', 'secretMessage', 'synergy'] as const;
type BluebirdSwipeTab = typeof BLUEBIRD_SWIPE_TABS[number];

const QuickInsightSchema = z.object({
  diagnosis: z.string(),
  luckyNumber: z.union([z.string(), z.number()]).transform(v => String(v)),
  luckyColor: z.string(),
  remedy: z.string(),
  symbol: z.string(),
  frequency: z.union([z.string(), z.number()]).transform(v => String(v)),
});

const SoulInsightSchema = z.object({
  luckScore: z.number(),
  loveScore: z.number(),
  wealthScore: z.number(),
  healthScore: z.number(),
  guidance: z.string(),
  cosmicAspect: z.string(),
  deepSyncLevel: z.string().optional(),
  luckyColor: z.string().optional(),
  luckyItem: z.string().optional(),
});

const HoponoponoSchema = z.object({
  harmonyScore: z.number(),
  spiritGreeting: z.string(),
  customMantra: z.string(),
  cleansingSymbol: z.string(),
  cleansingWisdom: z.string(),
});

const SKY_BLUE = 'oklch(0.75 0.12 230)';
const BG = 'oklch(0.10 0.02 240)';

type Stage = 'landing' | 'simple' | 'daily' | 'soul' | 'library';

interface ProfileForm {
  name: string;
  nickname: string;
  birthdate: string;
  birthtime: string;
  city: string;
  gender: string;
}

interface Message { 
  id: string; 
  role: 'user' | 'model'; 
  content: string; 
  timestamp: number;
}



function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="w-full min-w-0">
      <div className="flex justify-between gap-2 text-[10px] mb-1.5 px-1 uppercase tracking-widest font-bold text-white/30 font-sans">
        <span className="min-w-0 break-words">{label}</span>
        <span style={{ color }} className="shrink-0">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full rounded-full" style={{ background: color }} />
      </div>
    </div>
  );
}


const JUYEOK_PRESETS = [
  {
    name: "천화동인 & 천뢰무망",
    worry: "이번에 준비하는 사이드 프로젝트 잘 될까요?",
    bonGwa: "천화동인 (天火同人)",
    byeonHyo: "3효 변함",
    jiGwa: "천뢰무망 (天雷無妄)",
    bonLines: [1, 0, 1, 1, 1, 1], // Bottom to Top: 1 = Yang, 0 = Yin
    jiLines: [1, 0, 0, 1, 1, 1],
    desc: "동인(同人)은 사람들과 뜻을 모아 결연하는 괘이고, 무망(無妄)은 거짓과 꾸밈 없이 순리를 따르는 괘입니다."
  },
  {
    name: "지천태 & 지뇌복",
    worry: "올해 건강과 일의 밸런스를 되찾을 수 있을까요?",
    bonGwa: "지천태 (地天泰)",
    byeonHyo: "2효 변함",
    jiGwa: "지뇌복 (지뢰복 / 地雷復)",
    bonLines: [1, 1, 1, 0, 0, 0],
    jiLines: [1, 0, 0, 0, 0, 0],
    desc: "태(泰)는 하늘과 땅이 소통해 화평을 이루는 괘이고, 복(復)은 새로운 봄이 돌아오듯 기운이 회복되는 괘입니다."
  },
  {
    name: "수뢰준 & 수지비",
    worry: "새로운 사람들과의 동업 협조가 잘 성사될까요?",
    bonGwa: "수뢰준 (水雷屯)",
    byeonHyo: "1효 변함",
    jiGwa: "수지비 (水地比)",
    bonLines: [1, 0, 0, 0, 1, 0],
    jiLines: [0, 0, 0, 0, 1, 0],
    desc: "준(屯)은 힘겹게 싹을 틔우며 시작하는 난관의 괘이고, 비(比)는 사람들이 서로 친밀하게 의지하고 돕는 상생의 괘입니다."
  },
  {
    name: "화수미제 & 천수송",
    worry: "이직 혹은 전공 전환을 추진해도 좋을까요?",
    bonGwa: "화수미제 (火水未濟)",
    byeonHyo: "5효 변함",
    jiGwa: "천수송 (天水訟)",
    bonLines: [0, 1, 0, 1, 0, 1],
    jiLines: [0, 1, 0, 1, 1, 1],
    desc: "미제(未濟)는 아직 완성되지 않아 더 나아갈 가능성이 있는 괘이고, 송(訟)은 다툼을 경계하고 멈추어야 함을 알리는 괘입니다."
  },
  {
    name: "중천건 & 천화동인",
    worry: "독립적인 전문성 개발과 독립 연구가 성공할까요?",
    bonGwa: "중천건 (乾爲天)",
    byeonHyo: "2효 변함",
    jiGwa: "천화동인 (天火同人)",
    bonLines: [1, 1, 1, 1, 1, 1],
    jiLines: [1, 0, 1, 1, 1, 1],
    desc: "건(乾)은 하늘의 원초적인 활력과 주도권을 뜻하는 괘이고, 동인(同人)은 주변의 조력자를 만나 큰 뜻을 함께 이루는 괘입니다."
  }
];


const BLUEBIRD_CARDS = [
  { name: "파랑새의 고요 (Deep Peace)", emoji: "🐦", keyphrase: "내면의 고요와 평온", desc: "분주한 마음의 소음을 끄고, 가장 안전하고 아늑한 침묵 속에서 당신만의 평온 주파수를 호흡하십시오." },
  { name: "자애의 시그널 (Self-Compassion)", emoji: "💙", keyphrase: "온전한 자기 수용과 위로", desc: "그동안 타인에게 향해 있던 따스����� 시선을 나에게 돌려보세요. 당신은 존재 자체로 소중하며 가치 있는 영혼입니다." },
  { name: "치유의 기류 (Emotional Flow)", emoji: "🌊", keyphrase: "정서적 찌꺼기 자정", desc: "억눌러둔 무거운 감정이 있다면 그저 흐르게 두십시오. 고여 있던 불안과 자책이 맑고 가벼운 안개로 승화됩니다." },
  { name: "자유로운 비상 (Soul Release)", emoji: "🍃", keyphrase: "집착과 부담에서의 탈출", desc: "어깨를 누르던 정체 모를 의무감과 타인의 시선에서 가볍게 벗어나십시오. 영혼이 가장 맑은 하늘을 향해 날아오릅니다." },
  { name: "위로의 포옹 (Spiritual Sanctuary)", emoji: "🕯️", keyphrase: "우주의 무조건적인 돌봄", desc: "혼자 모든 것을 견딜 필요는 없습니다. 우주의 부드러운 중력이 당신을 받치고 있으며, 평안과 치유의 요람이 당신을 감싸 안습니다." },
  { name: "슬픔의 정제 (Purifying sorrow)", emoji: "☔", keyphrase: "눈물을 통한 영혼의 무해화", desc: "흘려보낸 눈물과 슬픔은 영혼을 투명하게 닦아내기 위한 필연적 빗줄기입니다. 아픔의 기저가 말끔해질 것입니다." },
  { name: "다정한 안부 (Gentle Mail)", emoji: "✉️", keyphrase: "가장 사소한 우주적 격려", desc: "당신을 향한 파랑새의 작은 편지가 밤하늘을 지나 도착했습니다. 당신의 노고가 결코 작지 않음을 우주는 곱씹고 있습니다." },
  { name: "안심의 정박 (Peaceful Anchorage)", emoji: "⏸️", keyphrase: "달리던 속도의 무안한 정지", desc: "지금은 멈출 때입니다. 멈춰도 세상은 무너지지 않고, 오히려 멈추는 용기가 다음 도약의 깊은 저력이 되어 줍니다." },
  { name: "숲속의 귓속말 (Forest Echo)", emoji: "🌲", keyphrase: "피톤치드 정서적 동조", desc: "수천 년을 버텨온 태고의 깊은 숲 한가운데 서서 부드러운 산 미풍이 나뭇잎을 스치는 맑은 소리를 머릿속으로 공명시키십시오." },
  { name: "달빛의 동요 (Moonlight Cradle)", emoji: "🌙", keyphrase: "지친 마음을 덮어주는 이불", desc: "차갑고 날선 도시의 전등 대신, 나긋나긋하고 보드라운 우주 달빛을 마음의 실내등으로 삼고 지친 세포를 녹여 수렴하십시오." },
  { name: "맑은 아침이슬 (Sovereign Dewdrop)", emoji: "💧", keyphrase: "불순물이 없는 깨끗한 평화", desc: "어제의 무겁던 트라우마나 마음의 가시는 완전히 증발했습니다. 깨끗하고 수려하게 정화된 순백의 백지로 아침을 맞이하세요." },
  { name: "미풍의 스침 (Breeze Embrace)", emoji: "🌬️", keyphrase: "과도한 긴장 전위 소멸", desc: "미풍이 부드럽게 당신의 지친 목과 뒷어깨를 매만집니다. 영혼의 뻐근한 정서 파도가 잦아들 것입니다." },
  { name: "영원의 안식처 (Spiritual Safehouse)", emoji: "🤗", keyphrase: "온갖 판단으로부터의 무조건 엄호", desc: "이 방에서는 그 누구도 당신을 시험하거나 평가하지 않습니다. 당신만의 따뜻하고 아늑한 방패가 준비되어 있습니다." },
  { name: "치유의 오르골 (Celestial Musicbox)", emoji: "🎵", keyphrase: "안정을 주는 청각적 평화", desc: "또르르 흘러가는 정갈한 오르골 소리를 상상하며 파랑새의 심장박동 주기가 당신의 긴장된 숨결을 천천히 늦춰 드립니다." },
  { name: "따스한 벽난로 (Cozy Hearth)", emoji: "🔥", keyphrase: "마음의 미온적 복원", desc: "시리고 얼어붙은 무관심의 상처에 다정하고 따뜻한 불꽃의 기운을 보냅니다. 점차 온화하고 녹아내리는 가슴을 목격하세요." },
  { name: "아침녘 수채화 (Watercolor Dawn)", emoji: "🌫️", keyphrase: "부조리를 흐트러트리는 온화함", desc: "굳어져서 나를 고통스럽게 하던 관념들의 거친 윤곽선들이, 온화한 분홍빛 새벽 안개 속으로 부드럽게 용해됩니다." },
  { name: "기억의 우체통 (Memory Keeper)", emoji: "📮", keyphrase: "소중했던 사랑의 온기 재확인", desc: "외로움은 잠시 지나가는 계절풍일 뿐입니다. 내면 깊은 곳에서 여전히 은은하게 빛나는 사랑과 응원의 목소리를 꺼내어보십시오." },
  { name: "고요한 무변성 (Wide Stillness)", emoji: "🌃", keyphrase: "광활한 바다와 우주의 지지", desc: "모든 행성의 영혼이 고요를 소리 높여 부르짖을 때, 우주가 당신에게 무한하고 유연한 대지의 평온을 선사합니다." },
  { name: "슬기로운 포기 (Wise Release)", emoji: "🕊️", keyphrase: "해결하지 않아도 될 자유", desc: "내가 통제할 수 없는 일들에 대한 인위적인 압박을 가볍게 우주 허공에 던져두십시오. 해결하려 몸부림치지 않는 것이 정답입니다." },
  { name: "고요한 별밤 (Quiet Twilight stars)", emoji: "🌌", keyphrase: "성스러운 영원의 치유 기류", desc: "별들이 수천 년 동안 당신의 귀환을 노래해 온 웅장한 도정입니다. 우주의 쉼터에서 당신은 가장 정식으로 대우받고 있습니다." },
  { name: "희망의 새싹 (Bud of New Start)", emoji: "🌱", keyphrase: "작지만 무한한 회복 탄력성", desc: "비록 척박한 마음에 서 있다 하더라도 아주 얇지만 단단한 푸른 싹이 다시 돋아납니다. 생명은 마침내 치유로 도달할 것입니다." },
  { name: "평온의 수렴 (Sacred Equilibrium)", emoji: "🌟", keyphrase: "마음의 영재 평화 성궤", desc: "그 어떤 소음도 당신의 성스러운 영혼 핵을 어지럽히지 못합니다. 완벽하고 공명하는 영원불멸의 이완입니다." }
];

const translateEnglishValue = (val: string) => {
  if (!val) return '';
  const dict: Record<string, string> = {
    'cyan blue': '청청색 (시안 블루)',
    'blue feather': '푸른 깃털',
    'optimal': '최적 지향 (OPTIMAL)',
    'blue': '푸른색',
    'cyan': '시안 청록색',
    'sky blue': '하늘색',
    'crystal': '투명 정수정 원광 (크리스탈)',
    'feather': '푸른 깃털',
    'sapphire': '블루 사파이어',
    'aquamarine': '해람석 (아쿠아마린)',
    'silver': '은빛 보주',
    'water': '심청 정화수',
    'mirror': '성운 거울',
    'indigo': '남색 (인디고 블루)'
  };
  const lower = val.toLowerCase().trim();
  if (dict[lower]) return dict[lower];
  return val;
};

export default function BluebirdApp() {
  const [, navigate] = useLocation();
  const isTTSActive = useTTSActive();
  const { isCurrentAppPlaying: isBinauralPlaying, toggle: toggleBinaural } = useBinauralBeat('bluebird');
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const { firebaseUser, sharedState, updateSharedState, isChatOpen, setIsChatOpen, sendUnifiedMessage, openLucyChat } = useApp();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const [activeMode, setActiveMode] = useState<'simple' | 'daily' | 'secret' | 'soul' | 'bible' | 'history' | 'secretMessage' | 'synergy'>(() => {
    if (typeof window !== 'undefined') {
      const urlTab = new URLSearchParams(window.location.search).get('tab');
      const sessionTab = sessionStorage.getItem('prism_target_tab');
      const tab = urlTab || sessionTab;
      if (tab === 'daily' || tab === 'synergy' || tab === 'secretMessage') {
        sessionStorage.removeItem('prism_target_tab');
        return tab as any;
      }
    }
    return 'daily';
  });
  useScrollToTopOnChange([activeMode]);

  const currentBluebirdTab: BluebirdSwipeTab = (activeMode === 'secretMessage' || activeMode === 'synergy') ? activeMode : 'daily';

  const { swipeHandlers: bluebirdSwipeHandlers } = useSwipeableTabs<BluebirdSwipeTab>({
    tabs: BLUEBIRD_SWIPE_TABS,
    activeTab: currentBluebirdTab,
    onTabChange: (newTab) => {
      setActiveMode(newTab);
      setShowSecretMessageModal(false);
      setStage('landing');
      setShowChat(false);
      resetAppScroll();
    },
    enabled: true,
  });

  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showSecretMessageModal, setShowSecretMessageModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [limitModalInfo, setLimitModalInfo] = useState<{ open: boolean; type: 'daily' | 'soul'; dapp: string } | null>(null);

  const [isBreathingCalibrationActive, setIsBreathingCalibrationActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('inhale');
  const [breathingTimeLeft, setBreathingTimeLeft] = useState(4);
  const [breathingFocusMode, setBreathingFocusMode] = useState<'calm' | 'healing' | 'grounding'>('calm');

  const [sessionCardDrawn, setSessionCardDrawn] = useState<{ name: string; emoji: string; keyphrase: string; desc: string; isReversed?: boolean } | null>(null);
  const [shuffledBluebirdCards, setShuffledBluebirdCards] = useState<any[]>([]);
  const [bluebirdOffsets, setBluebirdOffsets] = useState<{ xOff: number; yOff: number; rotOff: number }[]>([]);
  const [sessionComfortLevel, setSessionComfortLevel] = useState<number>(3);
  const [sessionLevelCheckedIn, setSessionLevelCheckedIn] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const isSpecialFeatureChromeHidden = useSpecialFeatureChromeHidden();

  useEffect(() => {
    const evName = showSecretMessageModal ? "tarot-active" : "tarot-inactive";
    window.dispatchEvent(new CustomEvent(evName));
    return () => {
      window.dispatchEvent(new CustomEvent("tarot-inactive"));
    };
  }, [showSecretMessageModal]);

  const uid = firebaseUser?.uid || 'guest';
  const todayKey = getTodayDateKey();
  const hoponoponoStorageKey = (key: string) => `bluebird_hoponopono_${todayKey}_${uid}_${key}`;

  const [sorryCount, setSorryCount] = useState(() => Number(localStorage.getItem('hoponopono_sorry_count') || 0));
  const [forgiveCount, setForgiveCount] = useState(() => Number(localStorage.getItem('hoponopono_forgive_count') || 0));
  const [thankCount, setThankCount] = useState(() => Number(localStorage.getItem('hoponopono_thank_count') || 0));
  const [loveCount, setLoveCount] = useState(() => Number(localStorage.getItem('hoponopono_love_count') || 0));

  const [selectedHoponoponoToolId, setSelectedHoponoponoToolId] = useState<HoponoponoToolId>('auto');
  const [cleansingSubject, setCleansingSubject] = useState<string>('');
  const [isHoponoponoComplete, setIsHoponoponoComplete] = useState<boolean>(() => {
    return localStorage.getItem(getDailyLockKey('bluebird_hoponopono', uid)) === 'true';
  });
  const [isCleansingLoading, setIsCleansingLoading] = useState(false);
  const [cleansingLoadingMsg, setCleansingLoadingMsg] = useState('우니히피리와 마음을 맞추는 중...');
  const [cleansingProgress, setCleansingProgress] = useState(0);
  const [cleansingResult, setCleansingResult] = useState<any>(() => {
    try {
      const saved = localStorage.getItem(hoponoponoStorageKey('result'));
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [cleansingImage, setCleansingImage] = useState<string>(() => localStorage.getItem(hoponoponoStorageKey('image')) || '');
  const [cleansingImageLoading, setCleansingImageLoading] = useState(false);
  const [cleansingToolResult, setCleansingToolResult] = useState<SavedHoponoponoTool | null>(() => {
    try {
      const saved = localStorage.getItem(hoponoponoStorageKey('tool'));
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [cleansingToolImageLoading, setCleansingToolImageLoading] = useState(false);

  useEffect(() => {
    const today = getTodayDateKey();
    const cloudHoponopono = sharedState?.hoponoponoDaily?.[today];
    if (cloudHoponopono?.result) {
      setCleansingResult(cloudHoponopono.result);
      if (cloudHoponopono.image) setCleansingImage(cloudHoponopono.image);
      if (cloudHoponopono.tool) setCleansingToolResult(cloudHoponopono.tool);
      if (cloudHoponopono.subject) setCleansingSubject(cloudHoponopono.subject);
      if (cloudHoponopono.toolId) setSelectedHoponoponoToolId(cloudHoponopono.toolId);
      setIsHoponoponoComplete(true);
    } else if (cloudHoponopono === null) {
      // Explicitly cleared or reset
      setCleansingResult(null);
      setIsHoponoponoComplete(false);
      setCleansingToolResult(null);
      setCleansingImage('');
      setCleansingSubject('');
    } else {
      const saved = localStorage.getItem(hoponoponoStorageKey('result'));
      if (saved) {
        try {
          setCleansingResult(JSON.parse(saved));
          setIsHoponoponoComplete(true);
          const savedSubject = localStorage.getItem(hoponoponoStorageKey('subject'));
          if (savedSubject) setCleansingSubject(savedSubject);
        } catch (_) {}
      } else {
        setCleansingResult(null);
        setIsHoponoponoComplete(false);
      }
      const savedTool = localStorage.getItem(hoponoponoStorageKey('tool'));
      if (savedTool) {
        try {
          setCleansingToolResult(JSON.parse(savedTool));
        } catch (_) {}
      } else {
        setCleansingToolResult(null);
      }
    }
  }, [sharedState?.hoponoponoDaily, todayKey, uid]);

  // Real-time intra-window & cross-device sync event listener
  useEffect(() => {
    const handleHopoSync = () => {
      const today = todayKey;
      const cloudHoponopono = sharedState?.hoponoponoDaily?.[today];
      if (cloudHoponopono?.result) {
        setCleansingResult(cloudHoponopono.result);
        if (cloudHoponopono.image) setCleansingImage(cloudHoponopono.image);
        if (cloudHoponopono.tool) setCleansingToolResult(cloudHoponopono.tool);
        if (cloudHoponopono.subject) setCleansingSubject(cloudHoponopono.subject);
        if (cloudHoponopono.toolId) setSelectedHoponoponoToolId(cloudHoponopono.toolId);
        setIsHoponoponoComplete(true);
      }
    };
    window.addEventListener('prism:hoponopono_updated', handleHopoSync);
    window.addEventListener('prism:full_state_synced', handleHopoSync);
    return () => {
      window.removeEventListener('prism:hoponopono_updated', handleHopoSync);
      window.removeEventListener('prism:full_state_synced', handleHopoSync);
    };
  }, [sharedState?.hoponoponoDaily, todayKey]);

  // Ensure cleansingToolResult is always available if cleansingResult exists
  useEffect(() => {
    if (cleansingResult && !cleansingToolResult) {
      const toolId = (localStorage.getItem(hoponoponoStorageKey('tool_id')) as HoponoponoToolId) || selectedHoponoponoToolId || 'auto';
      const actualSubject = cleansingSubject || localStorage.getItem(hoponoponoStorageKey('subject')) || '정화와 평화';
      const fallbackRecipe = getHoponoponoToolFallback(toolId === 'auto' ? 'blue_solar_water' : toolId);
      const toolObj: SavedHoponoponoTool = {
        ...fallbackRecipe,
        id: `tool-${Date.now()}`,
        cleansingSubject: actualSubject,
        createdAt: new Date().toISOString(),
        imageUrl: getHoponoponoToolFallbackImageUrl(fallbackRecipe.toolId),
      };
      setCleansingToolResult(toolObj);
      persistHoponoponoTool(toolObj);
      localStorage.setItem(hoponoponoStorageKey('tool'), JSON.stringify(toolObj));
    }
  }, [cleansingResult, cleansingToolResult, selectedHoponoponoToolId, cleansingSubject]);

  const handleResetHoponopono = useCallback(() => {
    setIsHoponoponoComplete(false);
    setCleansingSubject('');
    setCleansingResult(null);
    setCleansingImage('');
    setCleansingToolResult(null);
    setSelectedHoponoponoToolId('auto');

    try {
      localStorage.removeItem(hoponoponoStorageKey('result'));
      localStorage.removeItem(hoponoponoStorageKey('subject'));
      localStorage.removeItem(hoponoponoStorageKey('image'));
      localStorage.removeItem(hoponoponoStorageKey('tool'));
      localStorage.removeItem(hoponoponoStorageKey('tool_id'));
      localStorage.removeItem(getDailyLockKey('bluebird_hoponopono', uid));
      localStorage.removeItem('hoponopono_last_result');
      localStorage.removeItem('hoponopono_last_image');
      localStorage.removeItem('hoponopono_last_subject');

      // Also remove guest keys
      localStorage.removeItem(`bluebird_hoponopono_${todayKey}_${uid}_result`);
      localStorage.removeItem(`bluebird_hoponopono_${todayKey}_guest_result`);
      localStorage.removeItem(`bluebird_hoponopono_${todayKey}_${uid}_subject`);
      localStorage.removeItem(`bluebird_hoponopono_${todayKey}_guest_subject`);
      localStorage.removeItem(`bluebird_hoponopono_${todayKey}_${uid}_tool`);
      localStorage.removeItem(`bluebird_hoponopono_${todayKey}_guest_tool`);
      localStorage.removeItem(`bluebird_hoponopono_${todayKey}_${uid}_tool_id`);
      localStorage.removeItem(`bluebird_hoponopono_${todayKey}_guest_tool_id`);
      localStorage.removeItem(`bluebird_hoponopono_${todayKey}_${uid}_image`);
      localStorage.removeItem(`bluebird_hoponopono_${todayKey}_guest_image`);
      localStorage.removeItem(`limit_daily_bluebird_hoponopono_${uid}_${todayKey}`);
      localStorage.removeItem(`limit_daily_bluebird_hoponopono_guest_${todayKey}`);
    } catch (_) {}

    try {
      const today = getTodayDateKey();
      void updateSharedState({
        hoponoponoDaily: {
          ...(sharedState?.hoponoponoDaily || {}),
          [today]: null,
        },
        lastBluebirdDailySync: Date.now(),
      }, 'BLUEBIRD');
    } catch (_) {}

    try {
      window.dispatchEvent(new CustomEvent('prism:feature_updated'));
    } catch (_) {}
  }, [hoponoponoStorageKey, uid, todayKey, sharedState?.hoponoponoDaily, updateSharedState]);

  useEffect(() => {
    const handleDailyOracleUpdated = () => {
      try {
        const cachedHopo = localStorage.getItem(hoponoponoStorageKey('result'));
        if (cachedHopo) {
          const parsed = JSON.parse(cachedHopo);
          setCleansingResult(parsed);
          setIsHoponoponoComplete(true);
        }
        const cachedImg = localStorage.getItem(hoponoponoStorageKey('image'));
        if (cachedImg) setCleansingImage(cachedImg);
        const cachedTool = localStorage.getItem(hoponoponoStorageKey('tool'));
        if (cachedTool) {
          try {
            setCleansingToolResult(JSON.parse(cachedTool));
          } catch (_) {}
        }
      } catch (_) {}
    };
    window.addEventListener('prism:daily_oracle_updated', handleDailyOracleUpdated);
    window.addEventListener('prism:feature_updated', handleDailyOracleUpdated);
    return () => {
      window.removeEventListener('prism:daily_oracle_updated', handleDailyOracleUpdated);
      window.removeEventListener('prism:feature_updated', handleDailyOracleUpdated);
    };
  }, []);

  useEffect(() => {
    const applyTargetTab = (tab: string | null | undefined) => {
      if (!tab) return;
      if (tab === 'daily' || tab === 'mission' || tab === 'synergy' || tab === 'secretMessage') {
        setActiveMode(tab as any);
        setShowDailyModal(false);
        setShowSecretMessageModal(false);
        setShowChat(false);
        resetAppScroll();
        sessionStorage.removeItem('prism_target_tab');
      }
    };

    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      applyTargetTab(customEvent.detail?.tab);
    };

    const handleNavClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const path = customEvent.detail?.path || '';
      if (path.startsWith('/bluebird')) {
        let tab = customEvent.detail?.tab;
        if (!tab && path.includes('?')) {
          try {
            const url = new URL(path, 'http://localhost');
            tab = url.searchParams.get('tab');
          } catch (_) {}
        }
        if (tab) {
          applyTargetTab(tab);
        } else if (path === '/bluebird') {
          setActiveMode('daily');
          setShowDailyModal(false);
          setShowSecretMessageModal(false);
          setShowChat(false);
          resetAppScroll();
        }
      }
    };

    // 🎯 선택 텍스트 토스 즉시 실행: 빅뱅 드래그 토스 수신 시 탭 전환 + handleSend 즉시 실행
    const handleSelectionExecute = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail?.autoTrigger) return;
      const text = (detail?.text || '').trim();
      const targetMenuId: string = detail?.targetMenuId || '';
      if (!text || text.length < 2) return;
      sessionStorage.removeItem('prism_auto_execute_text');

      // 파랑새 메뉴 id → 탭 매핑
      const tabMap: Record<string, string> = {
        bluebird_sanctuary: 'daily',
        bluebird_gratitude: 'daily',
        bluebird_mission: 'mission',
        bluebird_letter: 'secretMessage',
        bluebird_forest: 'daily',
      };
      const targetTab = tabMap[targetMenuId] || 'daily';
      setActiveMode(targetTab as any);
      setShowDailyModal(false);
      setShowSecretMessageModal(false);
      setShowChat(true);
      resetAppScroll();

      // handleSend 즉시 실행 (handleSendRef 경유)
      setTimeout(() => {
        try {
          window.dispatchEvent(new CustomEvent('prism:bluebird_auto_execute', { detail: { text, autoTrigger: true } }));
        } catch (_) {}
      }, 350);
    };

    // 마운트 시 세션스토리지 잔여 텍스트 처리
    const autoText = sessionStorage.getItem('prism_auto_execute_text');
    const autoTarget = sessionStorage.getItem('prism_auto_execute_target') || '';
    if (autoText && autoText.trim().length >= 2) {
      sessionStorage.removeItem('prism_auto_execute_text');
      const tabMap2: Record<string, string> = {
        bluebird_sanctuary: 'daily',
        bluebird_gratitude: 'daily',
        bluebird_mission: 'mission',
        bluebird_letter: 'secretMessage',
        bluebird_forest: 'daily',
      };
      const targetTab2 = tabMap2[autoTarget] || 'daily';
      setActiveMode(targetTab2 as any);
      setShowChat(true);
      setTimeout(() => {
        try {
          window.dispatchEvent(new CustomEvent('prism:bluebird_auto_execute', { detail: { text: autoText.trim(), autoTrigger: true } }));
        } catch (_) {}
      }, 500);
    }

    window.addEventListener('prism-tab-change', handleTabChange);
    window.addEventListener('nav-click-active', handleNavClick);
    window.addEventListener('prism:selection_execute', handleSelectionExecute);
    return () => {
      window.removeEventListener('prism-tab-change', handleTabChange);
      window.removeEventListener('nav-click-active', handleNavClick);
      window.removeEventListener('prism:selection_execute', handleSelectionExecute);
    };
  }, []);

  const incrementChant = (type: 'sorry' | 'forgive' | 'thank' | 'love') => {
    let textToSpeak = '';
    if (type === 'sorry') {
      const newVal = sorryCount + 1;
      setSorryCount(newVal);
      localStorage.setItem('hoponopono_sorry_count', String(newVal));
      textToSpeak = '미안합니다';
    } else if (type === 'forgive') {
      const newVal = forgiveCount + 1;
      setForgiveCount(newVal);
      localStorage.setItem('hoponopono_forgive_count', String(newVal));
      textToSpeak = '용서해 주세요';
    } else if (type === 'thank') {
      const newVal = thankCount + 1;
      setThankCount(newVal);
      localStorage.setItem('hoponopono_thank_count', String(newVal));
      textToSpeak = '감사합니다';
    } else if (type === 'love') {
      const newVal = loveCount + 1;
      setLoveCount(newVal);
      localStorage.setItem('hoponopono_love_count', String(newVal));
      textToSpeak = '사랑합니다';
    }

    if (textToSpeak) {
      try {
        playTTS(textToSpeak, 'Kore');
      } catch (e) {
        console.warn('TTS playback error for chant:', e);
      }
    }
  };

  
  const generateCleansingImage = (resultData?: any, subjectToUse?: string) => {
    setCleansingImageLoading(true);
    try {
      const art = getCuratedArtworkForCleansing(
        resultData?.cleansingSymbol,
        subjectToUse || cleansingSubject,
        Math.floor(Math.random() * 1000)
      );
      setCleansingImage(art.imageUrl);
      localStorage.setItem('hoponopono_last_image', art.imageUrl);
      localStorage.setItem(hoponoponoStorageKey('image'), art.imageUrl);

      const today = getTodayDateKey();
      const currentHopo = sharedState?.hoponoponoDaily?.[today];
      if (currentHopo) {
        void updateSharedState({
          hoponoponoDaily: {
            ...(sharedState?.hoponoponoDaily || {}),
            [today]: {
              ...currentHopo,
              image: art.imageUrl,
            },
          },
        }, 'BLUEBIRD');
      }
    } catch (e) {
      console.warn("Failed generating cleansing image:", e);
    } finally {
      setCleansingImageLoading(false);
    }
  };

  const handleRefreshCleansingArt = () => {
    generateCleansingImage(cleansingResult);
  };

  const handleHoponoponoCleanse = async () => {
    if (isCleansingLoading) return;
    setIsCleansingLoading(true);
    setCleansingImage('');
    setCleansingToolResult(null);
    setCleansingProgress(0);
    setCleansingLoadingMsg("잠재의식 '우니히피리(Unihipili)' 자아에 노크하는 중...");

    const selectedToolMeta = HOPONOPONO_TOOL_CATALOG.find((t: any) => t.id === selectedHoponoponoToolId);
    const actualSubject = cleansingSubject.trim() || (
      selectedToolMeta && selectedToolMeta.id !== 'auto'
        ? (selectedToolMeta.name + ' - ' + selectedToolMeta.coreEffect)
        : '무의식 속 깊은 불안, 오래된 상처와 미해결된 기억의 완전한 정화'
    );

    const msgs = [
      "잠재의식 '우니히피리(Unihipili)' 자아에 노크하는 중...",
      '집에서 실천할 정화 도구 처방을 조율하는 중...',
      '내면에 쌓인 오래된 기억의 실타래를 씻어내는 중...',
      '네 가지 정화 주문(미안합니다, 용서하세요, 감사합니다, 사랑합니다)을 공명하는 중...',
      '블루솔라워터·씨포트 등 정화 수호 매개체를 정리하는 중...',
      '정화된 마음에 온전한 평온(Zero)을 안착하는 중...',
    ];

    let timer = 0;
    const interval = setInterval(() => {
      timer += 6;
      if (timer >= 95) {
        setCleansingProgress(95);
      } else {
        setCleansingProgress(timer);
        const chunkIdx = Math.min(Math.floor((timer / 100) * msgs.length), msgs.length - 1);
        setCleansingLoadingMsg(msgs[chunkIdx] || msgs[0]);
      }
    }, 120);

    try {
      const userState = buildDeepSynapseContext ? buildDeepSynapseContext(sharedState?.userProfile) : '';

      const prompt = "당신은 초차원 하와이안 정밀 자아정화 마스터 '호오포노포노 치유 가이드'입니다.\n" +
"우리는 사용자의 무의식 속에 남은 아픈 기억, 미해결된 감정, 혹은 고착화된 에너지 파동을 지워 '공(Zero/空/Zero Limits)의 상태'로 되돌리려 합니다.\n" +
"정화 대상 기억/감정: \"" + actualSubject + "\"\n" +
"추가적인 영혼 상태 컨텍스트: " + userState + "\n\n" +
"이 인풋에 입각하여, 이 감정이 마주하고 있는 \"기억의 실타래\"를 씻어내어 평온한 우주와 하와이의 정화 에너지를 불어넣는 세션 결과를 도출해주세요.\n" +
"답변은 반드시 정의된 schema 구조의 JSON이어야 합니다:\n" +
"1. harmonyScore: 정화 후 이르는 마음 평정의 기류 점수 (0 ~ 100 사이의 소수가 있는 실수 또는 정수, 예: 95.5)\n" +
"2. spiritGreeting: 하와이 Huna 철학에 힘입어 사용자의 우니히피리(상처받은 내면 아이)를 정말 가슴 깊이 어루만지고 눈물짓게 만드는 다정한 위로의 한마음 3~4문장\n" +
"3. customMantra: 정화 구절(미안합니다, 용서하세요, 감사합니다, 사랑합니다)을 결합하여 이 사람에게 특화되게 구어체로 만든 고요한 참회와 힐링 주문 (약 4행 정도 어구)\n" +
"4. cleansingSymbol: 정화를 지켜줄 하와이안 숲이나 자연의 고귀하고 맑은 수호 정화 물질/상징물 명칭 (예: '우아헤이아 폭포의 무기물 안개', '하와이안 검은 모래 소금 캡슐' 등)\n" +
"5. cleansingWisdom: 공(Zero)의 상태를 지탱해가면서 일상 속에서 판단이나 원망이 일어날 때 이 주문을 어떻게 기화해낼지 조언하는 2~3문장.";

      const [res, tool]: [any, SavedHoponoponoTool] = await Promise.all([
        invokeLLMStructured({
          messages: [{ role: 'user', content: prompt }],
          schema: HoponoponoSchema,
        }),
        generateHoponoponoTool(selectedHoponoponoToolId, actualSubject, userState),
      ]);

      clearInterval(interval);
      setCleansingProgress(100);
      setIsCleansingLoading(false);

      setCleansingResult(res);
      localStorage.setItem('hoponopono_last_result', JSON.stringify(res));
      localStorage.setItem('hoponopono_last_subject', actualSubject);
      localStorage.setItem(hoponoponoStorageKey('result'), JSON.stringify(res));
      localStorage.setItem(hoponoponoStorageKey('subject'), actualSubject);
      localStorage.setItem(hoponoponoStorageKey('tool_id'), selectedHoponoponoToolId);
      localStorage.setItem(getDailyLockKey('bluebird_hoponopono', uid), 'true');
      setIsHoponoponoComplete(true);

      generateCleansingImage(res, actualSubject);
      setCleansingToolResult(tool);
      persistHoponoponoTool(tool);
      localStorage.setItem(hoponoponoStorageKey('tool'), JSON.stringify(tool));

      // Realtime cross-device synchronization to Firestore & server vault
      try {
        const today = getTodayDateKey();
        void updateSharedState({
          hoponoponoDaily: {
            ...(sharedState?.hoponoponoDaily || {}),
            [today]: {
              result: res,
              tool,
              toolId: selectedHoponoponoToolId,
              subject: actualSubject,
              timestamp: Date.now(),
            },
          },
          lastBluebirdDailySync: Date.now(),
        }, 'BLUEBIRD');
      } catch (_) {}

      recordPrismFeature({
        app: 'bluebird',
        featureName: '블루버드 휴식 오라클 동조',
        summary: "일관성 지수: " + (res.coherence || 95) + "%, 정화 처방: " + (res.spiritGreeting?.substring(0, 30) || ''),
        details: res,
      });

      const fUser = auth.currentUser;
      if (fUser && localStorage.getItem('developer_bypass') !== 'true') {
        try {
          await addDoc(collection(db, 'bluebird_history', fUser.uid, 'entries'), {
            type: 'hoponopono',
            title: "호오포노포노 정화 (평정 지수: " + res.harmonyScore + "%)",
            content: "정화 주제: " + actualSubject + "\n\n정화 전언:\n" + res.spiritGreeting + "\n\n[정화의 수호 주문]\n" + res.customMantra + "\n\n수호 물질: " + res.cleansingSymbol + "\n\n[정화 도구] " + tool.toolName + "\n" + tool.dailyPractice + "\n\n[일상의 지침]\n" + res.cleansingWisdom,
            createdAt: serverTimestamp()
          });
        } catch (dbErr) {
          console.warn('Failed saving hoponopono entry to firestore:', dbErr);
        }
      }
    } catch (err) {
      console.warn('Ho\'oponopono Cleansing failed, fall back safely.', err);
      clearInterval(interval);
      setCleansingProgress(100);
      setIsCleansingLoading(false);

      const fallbackRes = {
        harmonyScore: Math.round(85 + Math.random() * 14),
        spiritGreeting: '기억의 아득한 고리 속에서 지치고 얼룩진 마음을 따뜻한 하와이안 코나 바다가 쓸어안아 줍니다. 당신의 책임도, 그 누구의 탓도 아닙니다. 단지 아직 떠나지 못한 기억들이 흘러가는 순리 중일 뿐입니다. 마음 깊이 있는 아이의 흐느낌을 조용히 다독여주세요.',
        customMantra: '내가 지고 있던 미련의 비를 향해 "미안합니다".\n이유 없는 자책을 씻어내고자 "용서해 주세요".\n여전히 자리를 채워준 참된 나에게 "감사합니다".\n세상 가장 여린 생명의 온기로 당신을 "사랑합니다".',
        cleansingSymbol: '하하카이 마우이 산호석 에센스 (Maui Coral Essence)',
        cleansingWisdom: '판단이 일어서거나 마음에 흙탕물이 튈 때마다 이 네 마디를 마치 지우개처럼 읊조려 보세요. 기억이 맑게 씻겨 나갑니다.',
      };

      setCleansingResult(fallbackRes);
      localStorage.setItem('hoponopono_last_result', JSON.stringify(fallbackRes));
      localStorage.setItem('hoponopono_last_subject', actualSubject);
      localStorage.setItem(hoponoponoStorageKey('result'), JSON.stringify(fallbackRes));
      localStorage.setItem(hoponoponoStorageKey('subject'), actualSubject);
      localStorage.setItem(hoponoponoStorageKey('tool_id'), selectedHoponoponoToolId);
      localStorage.setItem(getDailyLockKey('bluebird_hoponopono', uid), 'true');
      setIsHoponoponoComplete(true);

      generateCleansingImage(fallbackRes, actualSubject);

      const userState = buildDeepSynapseContext ? buildDeepSynapseContext(sharedState?.userProfile) : '';
      const fallbackTool = await generateHoponoponoTool(selectedHoponoponoToolId, actualSubject, userState);
      setCleansingToolResult(fallbackTool);
      persistHoponoponoTool(fallbackTool);
      localStorage.setItem(hoponoponoStorageKey('tool'), JSON.stringify(fallbackTool));
    } finally {
      setIsCleansingLoading(false);
    }
  };

  const renderDailyOracle = () => {
    return (
      <div className="space-y-12 text-left animate-fade-in font-sans animate-fade-in">
        {/* Divine Header Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-mono tracking-widest uppercase animate-pulse">
            <ShieldCheck size={14} />
            <span>HO'OPONOPONO SELF-CLEANSING · {todayKey}</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-display text-white tracking-tighter uppercase font-bold text-center">
            호오포노포노 : 잠재의식 정화소
          </h3>
          <p className="text-xs text-emerald-300/60 font-medium tracking-wider max-w-xl mx-auto leading-relaxed break-keep text-center">
            내면 아이 '우니히피리(Unihipili)'와의 화해를 돕는 하와이 힐러들의 비밀 의식입니다.<br />
            "미안합니다, 용서하세요, 감사합니다, 사랑합니다" 네 마디 진실한 파동으로 잠재의식의 정체된 에너지를 '공(Zero/空)'으로 지워내세요.
          </p>

          

          {isHoponoponoComplete && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-widest">
              <Sparkles size={12} />
              <span>오늘의 데일리 호오포노포노 정화 완료</span>
              <button
                type="button"
                onClick={handleResetHoponopono}
                className="ml-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-200 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                title="정화 초기화 후 새 고민으로 다시 정화하기"
              >
                <RefreshCw size={10} />
                <span>초기화</span>
              </button>
            </div>
          )}
        </div>

        {/* 1. Four Sacred Phrases Chanting Dashboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={14} /> 네 가지 신성한 정화 어구 (클릭하여 정화 반복)
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sorry Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => incrementChant('sorry')}
              className="relative p-6 rounded-3xl bg-[#0d1512]/60 border border-emerald-500/10 text-left overflow-hidden cursor-pointer group hover:border-emerald-500/30 transition-all focus:outline-none"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors" />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-rose-400 font-bold font-mono uppercase tracking-widest">I'm Sorry</span>
                  <p className="text-base sm:text-xl font-bold text-white mt-1">미안합니다</p>
                  <p className="text-[10pt] text-white/40 mt-1 break-keep leading-tight">방치한 내면 무의식을 인정하기</p>
                </div>
                <div className="px-2 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs font-bold">
                  {sorryCount}
                </div>
              </div>
            </motion.button>

            {/* Forgive Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => incrementChant('forgive')}
              className="relative p-6 rounded-3xl bg-[#0d1512]/60 border border-emerald-500/10 text-left overflow-hidden cursor-pointer group hover:border-emerald-500/30 transition-all focus:outline-none"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold font-mono uppercase tracking-widest">Please Forgive Me</span>
                  <p className="text-base sm:text-xl font-bold text-white mt-1">용서해 주세요</p>
                  <p className="text-[10pt] text-white/40 mt-1 break-keep leading-tight">스스로를 가둔 집착 놓아주기</p>
                </div>
                <div className="px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-bold">
                  {forgiveCount}
                </div>
              </div>
            </motion.button>

            {/* Thank Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => incrementChant('thank')}
              className="relative p-6 rounded-3xl bg-[#0d1512]/60 border border-emerald-500/10 text-left overflow-hidden cursor-pointer group hover:border-emerald-500/30 transition-all focus:outline-none"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors" />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-sky-400 font-bold font-mono uppercase tracking-widest">Thank You</span>
                  <p className="text-base sm:text-xl font-bold text-white mt-1">감사합니다</p>
                  <p className="text-[10pt] text-white/40 mt-1 break-keep leading-tight">정화의 기회에 감사하기</p>
                </div>
                <div className="px-2 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono text-xs font-bold">
                  {thankCount}
                </div>
              </div>
            </motion.button>

            {/* Love Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => incrementChant('love')}
              className="relative p-6 rounded-3xl bg-[#0d1512]/60 border border-emerald-500/10 text-left overflow-hidden cursor-pointer group hover:border-emerald-500/30 transition-all focus:outline-none"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono uppercase tracking-widest">I Love You</span>
                  <p className="text-base sm:text-xl font-bold text-white mt-1">사랑합니다</p>
                  <p className="text-[10pt] text-white/40 mt-1 break-keep leading-tight">있는 그대로를 감싸 안기</p>
                </div>
                <div className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                  {loveCount}
                </div>
              </div>
            </motion.button>
          </div>

          {/* Quick full chant helper */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs shrink-0 font-sans">
              💙
            </div>
            <div className="flex-1 text-xs text-white/60 text-left leading-relaxed break-keep font-sans">
              네 구절을 명상하듯 차분히 연달아 소리 내거나 마음속 깊이 외쳐보세요. 복잡하고 무거운 잠재의식의 흔적들이 맑고 맑은 미립자 처럼 정화되기 시작합니다.
            </div>
          </div>
        </div>

        {/* 2. Subconscious Cleansing Memo & AI Ritual Portal */}
        <div className="rounded-[40px] bg-zinc-950/80 border border-emerald-500/10 p-8 md:p-12 space-y-6 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
          
          <div className="space-y-2 text-left">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-sans">
              <Feather size={14} className="animate-spin" style={{ animationDuration: '6s' }} /> 기억 소거 소망 기재
            </span>
            <p className="text-xs text-white/50 break-keep font-sans leading-relaxed">
              내면에 고인 부정적 기억이나 무거워진 감정을 적어 주세요. 정화 개시와 함께 AI 전언 카드와 실제 정화 도구(블루솔라워터, 치포트키 등) 처방이 같이 나옵니다.
            </p>
          </div>

          <HoponoponoToolPicker
            selectedToolId={selectedHoponoponoToolId}
            onSelect={setSelectedHoponoponoToolId}
          />

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={cleansingSubject}
                onChange={(e) => setCleansingSubject(e.target.value)}
                disabled={isHoponoponoComplete || isCleansingLoading}
                placeholder={isHoponoponoComplete ? "오늘의 정화 주제가 접수되어 처방이 완료되었습니다. (초기화 후 새 주제 입력 가능)" : "비워내고 지우고 싶은 생각, 원망, 미련, 불안감을 자유롭게 적어주세요..."}
                className="w-full pl-6 pr-12 py-4.5 rounded-2xl bg-black/60 border border-white/5 focus:border-emerald-500/30 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all font-sans disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {!isHoponoponoComplete && cleansingSubject && !isCleansingLoading && (
                <button
                  type="button"
                  onClick={() => setCleansingSubject('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/50 hover:text-white text-xs transition-all cursor-pointer"
                  title="고민 입력 지우기"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {!isHoponoponoComplete && (
              <div className="flex flex-wrap gap-2 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setCleansingSubject('체중과 몸매, 신체 외모에 대한 부정적인 기억과 자책의 강박');
                    setSelectedHoponoponoToolId('strawberries');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 text-white/70 hover:text-white text-xs cursor-pointer transition-all shrink-0 font-sans"
                >
                  🍓 체중·외모 강박 치유
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCleansingSubject('과거의 깊은 상처, 이별과 상실의 슬픔에 얽힌 아픈 기억');
                    setSelectedHoponoponoToolId('pancakes');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 text-white/70 hover:text-white text-xs cursor-pointer transition-all shrink-0 font-sans"
                >
                  🥞 상실·상처 치유
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCleansingSubject('돈과 물질에 대한 끊임없는 결핍의 두려움과 조급한 집착');
                    setSelectedHoponoponoToolId('hot_chocolate');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 text-white/70 hover:text-white text-xs cursor-pointer transition-all shrink-0 font-sans"
                >
                  ☕ 돈·물질 집착 정화
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCleansingSubject('지나치게 머리로만 따지고 분석하며 모든 것을 통제하려는 생각');
                    setSelectedHoponoponoToolId('bubble_gum');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 text-white/70 hover:text-white text-xs cursor-pointer transition-all shrink-0 font-sans"
                >
                  🫧 머리 복잡한 생각 비우기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCleansingSubject('내 한계에 부딪혀 혼자서 무거운 책임감과 은밀한 무력감을 느끼는 감정');
                    setSelectedHoponoponoToolId('blue_solar_water');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 text-white/70 hover:text-white text-xs cursor-pointer transition-all shrink-0 font-sans"
                >
                  🌱 무력감 치유
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCleansingSubject('타인과의 어긋난 마찰에서 번진 미움과 무의식적인 쓴 소장의 원망');
                    setSelectedHoponoponoToolId('ceeport');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 text-white/70 hover:text-white text-xs cursor-pointer transition-all shrink-0 font-sans"
                >
                  🌊 서러운 관계 청소
                </button>
              </div>
            )}

            {isHoponoponoComplete && cleansingResult ? (
              <div className="space-y-3">
                <div className="w-full py-4 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-between gap-2 font-sans flex-wrap">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />
                    <span>호오포노포노 정화 완료</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetHoponopono}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    <RefreshCw size={12} className="text-emerald-300" />
                    <span>고민 초기화 &amp; 새로운 주제로 정화하기</span>
                  </button>
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleHoponoponoCleanse}
                disabled={isCleansingLoading}
                className="w-full relative py-5.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-sky-500/20 border border-emerald-400/30 hover:border-emerald-400/60 text-white text-base font-extrabold uppercase tracking-widest cursor-pointer hover:from-emerald-500/30 hover:to-sky-500/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none font-sans"
              >
                {isCleansingLoading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin text-emerald-300" />
                    <span>정화 파동 조율 중 ({cleansingProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="text-emerald-300 animate-pulse" />
                    <span>
                      {cleansingSubject.trim()
                        ? '잠재의식 정화 + 정화 도구 처방 받기'
                        : (HOPONOPONO_TOOL_CATALOG.find((t: any) => t.id === selectedHoponoponoToolId)?.name || '선택한 테마') + ' 정화 의식 바로 시작하기'}
                    </span>
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Real-time Progressive Loading Animation */}
          {isCleansingLoading && (
            <div className="p-6 rounded-2xl bg-black/40 border border-emerald-500/15 space-y-4 animate-pulse text-left">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-1.5 font-sans">
                  <RefreshCw size={12} className="animate-spin" /> {cleansingLoadingMsg}
                </span>
                <span className="text-emerald-400/80 font-bold">{cleansingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-sky-400"
                  style={{ width: `${cleansingProgress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
              <p className="text-[10px] text-white/30 text-center uppercase tracking-widest font-mono">
                ALOHA SPIRIT RESONATING LIVE CORE SYSTEM
              </p>
            </div>
          )}
        </div>

        {/* 3. Deep Cleansing Oracle Message Card + Purification Tool */}
        {cleansingResult && (
          <div className="w-full rounded-[40px] bg-[#090e13]/95 border border-emerald-500/20 p-8 md:p-12 space-y-8 relative overflow-hidden backdrop-blur-2xl animate-fade-in">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-sky-500/5 to-transparent pointer-events-none rounded-full blur-3xl" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5 text-left">
              <div className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-sans">
                  <Sparkles size={14} className="text-emerald-300 animate-pulse" /> 정화 처방 수서 & 하와이 훈아 평화 조율
                </span>
                <p className="text-xs text-white/40 font-sans">잠재의식 정화 결과와 실제 정화 도구 처방이 함께 도착했습니다.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetHoponopono}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-xs font-bold text-white/70 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  title="현재 정화 결과를 초기화하고 새로운 고민으로 다시 정화합니다"
                >
                  <RefreshCw size={12} className="text-emerald-400" />
                  <span>정화 초기화</span>
                </button>
                <div className="px-5 py-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center">
                  <span className="text-[9px] text-[#56dec0] font-mono tracking-widest uppercase font-bold">Harmony Coherence</span>
                  <span className="text-3xl font-black text-white font-mono mt-0.5">{cleansingResult.harmonyScore}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left detail grid card: Hawaiian Guardians list */}
              <div className="lg:col-span-1 space-y-4">
                <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-5 text-left">
                  {/* Purificaton Item */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider font-sans">수호 정화 상징 (Symbol)</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping shrink-0" />
                      <span className="text-sm font-black text-white break-keep font-sans">{cleansingResult.cleansingSymbol}</span>
                    </div>
                  </div>
                </div>

                {/* Subconscious Child Guidance Info snippet */}
                <div className="p-5.5 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-transparent border border-emerald-500/10 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2 font-sans">
                    <Smile size={14} />
                    <span>내면 아이란?</span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed break-keep font-sans">
                    오래된 기억과 원치 않는 정체 반응을 거쳐 안착된 상처를 의미하는 '우니히피리'입니다. 네 단어의 부드럽고 다정한 반복 Chanting을 조용히 수행하여 무한한 은혜의 공으로 자유를 되찾으세요.
                  </p>
                </div>

                {/* 정화 그림 (NanoBanana Purifying Canvas) */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-black/60 border border-emerald-500/20 text-left space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider font-sans flex items-center gap-1.5">
                      <Sparkles size={12} className="animate-pulse text-emerald-300" /> 수호 정화 원화 (Purifying Canvas)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRefreshCleansingArt}
                        disabled={cleansingImageLoading}
                        title="다른 정화 원화로 교감하기"
                        className="px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-[10px] text-emerald-300 font-sans font-semibold flex items-center gap-1 cursor-pointer transition-all disabled:opacity-40"
                      >
                        <RefreshCw size={10} className={cleansingImageLoading ? "animate-spin" : ""} />
                        <span>원화 재변환</span>
                      </button>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-[#56dec0] font-mono font-bold">
                        NANOBANANA CANVAS
                      </span>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-[4/3] w-full flex flex-col items-center justify-center group shadow-2xl">
                    {(cleansingImageLoading || !cleansingImage) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/50 text-xs p-6 text-center bg-black/60 z-10 transition-all">
                        <div className="relative w-8 h-8">
                          <div className="w-8 h-8 rounded-full border-2 border-dashed border-emerald-500/40 animate-spin absolute inset-0" />
                          <div className="w-8 h-8 rounded-full border-2 border-t-emerald-400 border-r-transparent animate-spin relative" />
                        </div>
                        <span className="font-mono tracking-widest uppercase animate-pulse text-[9px] text-emerald-300 font-bold">
                          [ PURIFYING ARTWORK DRAWING... ]
                        </span>
                      </div>
                    )}
                    {cleansingImage && (
                      <>
                        <ImageOutputActions src={cleansingImage} alt="NanoBanana 정화 원화" filename="bluebird-cleansing-art" />
                        <img 
                          src={cleansingImage} 
                          alt="NanoBanana 정화 원화"
                          referrerPolicy="no-referrer"
                          onLoad={() => setCleansingImageLoading(false)}
                          onError={() => {
                            setCleansingImageLoading(false);
                            const fallback = getCuratedArtworkForCleansing(
                              cleansingResult?.cleansingSymbol,
                              cleansingSubject,
                              Math.floor(Math.random() * 1000)
                            ).imageUrl;
                            setCleansingImage(fallback);
                            localStorage.setItem('hoponopono_last_image', fallback);
                            localStorage.setItem(hoponoponoStorageKey('image'), fallback);
                          }}
                          className={`w-full h-full object-cover transition-all duration-700 hover:scale-105 ${cleansingImageLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`} 
                        />
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/85 backdrop-blur-md rounded-lg border border-emerald-400/30 flex items-center gap-1.5 shadow-lg z-20">
                          <span className="relative flex h-1 w-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-400"></span>
                          </span>
                          <span className="text-[8px] font-bold tracking-widest text-emerald-300 uppercase font-mono">
                            ALOHA COHERENCE
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-[11px] text-white/50 leading-relaxed break-keep select-none border-t border-white/5 pt-3 font-sans">
                    수호 정화 상징(<span className="text-emerald-400 font-bold font-sans">{cleansingResult.cleansingSymbol}</span>)에 깃든 맑고 순수한 영적 에너지를 시각적으로 교감하며 무의식 깊은 응어리를 맑게 씻어내세요.
                  </p>
                </div>
              </div>

              {/* Right content grids: Spirit Greeting & custom mantra affirmation */}
              <div className="lg:col-span-2 space-y-6">
                {/* Greeting / Soul Message */}
                <div className="p-6 md:p-8 rounded-3xl bg-white/[0.01] border border-white/5 text-left space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest text-[#56dec0] uppercase font-mono block">
                      우니히피리의 안식 전언 (Unihipili Message)
                    </span>
                    {cleansingResult.spiritGreeting && (
                      <TTSButton
                        text={cleansingResult.spiritGreeting}
                        className="text-[#56dec0] border-[#56dec0]/20 text-xs py-1 cursor-pointer hover:bg-[#56dec0]/10"
                      />
                    )}
                  </div>
                  <p className="text-white/85 text-sm sm:text-base leading-relaxed break-keep font-sans">
                    {cleansingResult.spiritGreeting}
                  </p>
                </div>

                {/* Custom customized Healing Prayer */}
                <div className="p-8 rounded-3xl bg-[#09100e]/85 border border-[#56dec0]/15 space-y-5 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#56dec0]/5 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-[10px] font-black tracking-widest text-[#56dec0] uppercase font-mono block">
                    📜 무의식 소거 맞춤 수호 주문 (Aligned Custom Prayer)
                  </span>

                  <div className="py-4 font-serif text-white/95 text-base sm:text-lg italic leading-loose tracking-wide whitespace-pre-line antialiased">
                    {cleansingResult.customMantra}
                  </div>

                  <div className="flex justify-center">
                    <TTSButton
                      text={cleansingResult.customMantra}
                      voice="Kore"
                      className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 theme-btn cursor-pointer"
                    />
                  </div>
                </div>

                {/* Daily wisdom checklist / guide */}
                <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 text-left space-y-2">
                  <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase font-mono block">
                    💫 일상의 백그라운드 지우개 의도 (Zero Limits Action)
                  </span>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed break-keep font-sans leading-relaxed">
                    {cleansingResult.cleansingWisdom}
                  </p>
                </div>
              </div>
            </div>

            {cleansingToolResult && (
              <HoponoponoToolResultCard
                tool={cleansingToolResult}
                imageLoading={cleansingToolImageLoading}
                onImageLoad={() => setCleansingToolImageLoading(false)}
              />
            )}

            {/* Hoponopono -> Lucy Deep Link Integration Card */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-zinc-950/60 border border-emerald-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-5 text-left shadow-lg">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
                  <Sparkles size={14} className="text-emerald-400 animate-pulse" />
                  <span>루시(LUCY) 잠재의식 정화 상담 연동</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  호오포노포노 정화 결과를 루시와 깊이 있게 나누기
                </h4>
                <p className="text-xs text-white/60 leading-relaxed break-keep">
                  정화 주제(<span className="text-emerald-300 font-semibold">{cleansingSubject || '내면의 무거운 기억'}</span>)와 평정 지수({cleansingResult.harmonyScore || 90}%), 수호 주문을 바탕으로 루시와 다정한 1:1 대화를 이어가며 무의식의 상처를 따뜻하게 보듬으세요.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  sendHoponoponoToLucy(
                    {
                      targetIssue: cleansingSubject,
                      harmonyScore: cleansingResult.harmonyScore,
                      cleanedThoughts: cleansingResult.cleanedThoughts,
                      diagnosis: cleansingResult.spiritGreeting,
                      mantra: cleansingResult.customMantra,
                      toolName: cleansingToolResult?.toolName,
                    },
                    openLucyChat,
                    sendUnifiedMessage
                  );
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-300/30 shrink-0"
              >
                <Sparkles size={15} />
                <span>루시에게 정화 상담 연결</span>
              </motion.button>
            </div>
          </div>
        )}
      </div>
    );
  };

    const renderDailyOracleDeprecated = () => {
    return (
      <div className="space-y-12 text-left animate-fade-in font-sans">
        <div className="text-center space-y-4">
           <h3 className="text-5xl font-display text-white tracking-tighter">Serenity Station</h3>
           <p className="text-[10px] text-sky-400 font-bold uppercase tracking-[0.4em] font-sans">내면 평정의 울림과 영혼 밸런스</p>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          {!dailyResult ? (
            <div className="space-y-8">
              {/* Unified Card Deck and Interactive Draw Frame */}
              <div className="w-full rounded-[40px] bg-zinc-950/80 border border-sky-500/20 p-8 md:p-12 text-center space-y-12 relative overflow-hidden backdrop-blur-xl min-h-[480px] flex flex-col justify-between overflow-x-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.05)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="space-y-4">
                  <span className="text-[10px] text-sky-400 font-bold uppercase tracking-[0.3em] font-mono block">일일 정서 주파수 정렬</span>
                  <h4 className="text-2xl sm:text-3xl font-display text-white tracking-widest uppercase">Your Selected Serenity Oracle</h4>
                  <p className="text-xs text-white/40 max-w-md mx-auto leading-relaxed font-sans">
                    오늘 당신의 지적 맑고 청아한 평화 에너지가 활짝 피어나 내면 자아를 조율합니다. 카드를 뒤집고 편안함을 체크해 보세요.
                  </p>
                </div>

                {sessionCardDrawn ? (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 55, damping: 16 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-3xl mx-auto z-10 font-sans"
                  >
                    {/* 3D Flip Card */}
                    <div className="w-44 h-72 cursor-pointer relative shrink-0 animate-fade-in" style={{ perspective: "1000px" }} onClick={() => setIsFlipped(!isFlipped)}>
                      <motion.div
                        className="w-full h-full relative"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border border-sky-500/40 flex items-center justify-center p-3 shadow-2xl group/card" style={{ transform: "rotateY(0deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                          <div className="absolute inset-1.5 border border-sky-500/20 rounded-xl flex flex-col items-center justify-center bg-sky-500/5 group-hover/card:bg-sky-500/10 transition-all shadow-inner">
                            <div className="w-10 h-10 rounded-full border border-sky-500/20 flex items-center justify-center bg-black/40 shadow-md">
                              <Bird size={20} className="text-sky-400 transition-all shadow-[0_0_8px_rgba(56,189,248,0.6)] animate-pulse" />
                            </div>
                            <span className="absolute bottom-3 text-[10px] font-mono text-sky-500/45 tracking-widest uppercase font-sans">ZEPHYR</span>
                          </div>
                        </div>
                        <div 
                          className="absolute inset-0 rounded-2xl border border-amber-500/30 flex flex-col justify-between p-4 shadow-[0_0_30px_rgba(251,191,36,0.15)] bg-cover bg-center overflow-hidden" 
                          style={{ 
                            transform: "rotateY(180deg)", 
                            backfaceVisibility: "hidden", 
                            WebkitBackfaceVisibility: "hidden",
                            backgroundImage: "url('/cards/bluebird_bg.png')"
                          }}
                        >
                          {/* Frosted Glass Overlay */}
                          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1.5px] z-0" />
                          
                          {/* Cosmic Foil Borders & Corner Accents */}
                          <div className="absolute inset-1.5 border border-amber-500/25 rounded-xl pointer-events-none z-10" />
                          <div className="absolute inset-2 border border-amber-500/10 rounded-xl pointer-events-none z-10" />
                          <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-amber-500/40 pointer-events-none z-10" />
                          <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-amber-500/40 pointer-events-none z-10" />
                          <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-amber-500/40 pointer-events-none z-10" />
                          <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-amber-500/40 pointer-events-none z-10" />

                          {/* Upper Roman Numeral & Sparkles */}
                          <div className="flex justify-between items-center text-[9px] font-mono text-amber-400/80 font-sans z-10 tracking-[0.2em]">
                            <span>{(() => {
                              const cardIdx = BLUEBIRD_CARDS.findIndex(c => c.name === sessionCardDrawn.name);
                              const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII"];
                              return numerals[cardIdx] || "I";
                            })()}</span>
                            <Sparkles size={10} className="text-amber-400/80 animate-pulse" />
                          </div>

                          {/* Central Medallion (Talisman) */}
                          <div className="relative w-14 h-14 mx-auto flex items-center justify-center z-10 my-auto animate-pulse">
                            <div className="absolute inset-0 border border-dashed border-amber-500/40 rounded-full animate-[spin_20s_linear_infinite]" />
                            <div className="absolute inset-1 border border-amber-500/20 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
                            <div 
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-amber-600/30 border border-amber-500/60 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.45)] drop-shadow-[0_0_8px_rgba(245,158,11,0.3)] transition-transform duration-500" 
                              style={{ transform: (sessionCardDrawn as any).isReversed ? "rotateZ(180deg)" : "rotateZ(0deg)" }}
                            >
                              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{sessionCardDrawn.emoji}</span>
                            </div>
                          </div>

                          {/* Lower Typography Section */}
                          <div className="text-center space-y-0.5 z-10">
                            <span className="text-[8px] text-amber-400/80 font-serif tracking-[0.15em] uppercase block">
                              {sessionCardDrawn.keyphrase}
                            </span>
                            <h4 className="text-xs font-bold font-sans text-white tracking-widest leading-tight block break-keep break-words max-w-full">
                              {sessionCardDrawn.name}
                            </h4>
                            {(sessionCardDrawn as any).isReversed && (
                              <span className="text-[8px] font-mono text-red-400/90 font-bold block uppercase tracking-widest mt-0.5">
                                Reversed
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Right column: Description */}
                    <div className="flex-1 space-y-4 text-left md:pl-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 animate-fade-in font-sans">
                      <p className="text-xs text-white/50 leading-relaxed min-h-[40px]">
                        {!isFlipped 
                          ? "카드를 탭하여 미래의 정서 비전 코드와 수호의 고요함 비전을 뒤집어 보세요." 
                          : `호흡 동조를 통해 인계된 정서 조율 카드는 [${sessionCardDrawn.name}]입니다.`}
                      </p>

                      {isFlipped && (
                        <div className="space-y-3 bg-white/[0.02] border border-white/5 p-5 rounded-2xl animate-fade-in">
                          <div className="space-y-1">
                            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest font-mono">정서 상징 해석</span>
                            <h5 className="text-sm font-bold text-white leading-snug">{sessionCardDrawn.name}</h5>
                          </div>
                          <div className="text-xs text-white/70 leading-relaxed bg-white/[0.02] border border-white/5 p-3 rounded-xl font-sans">
                            {sessionCardDrawn.desc}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* Custom Zen Breathing Calibration UI */
                  <div className="flex flex-col items-center justify-center py-6 space-y-8 z-10 w-full max-w-md mx-auto">
                    <div className="flex gap-2 p-1 rounded-full bg-white/5 border border-white/10 shrink-0 mb-2">
                      {(['calm', 'grounding', 'healing'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setBreathingFocusMode(mode)}
                          disabled={isBreathingCalibrationActive}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                            breathingFocusMode === mode
                              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                              : 'text-white/40 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {mode === 'calm' ? '평정 유지' : mode === 'grounding' ? '심층 접지' : '치유 파동'}
                        </button>
                      ))}
                    </div>

                    {/* Animated Breathing Circle */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      {/* Outer pulse wave */}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-sky-400/20"
                        animate={{
                          scale: isBreathingCalibrationActive && (breathingPhase === 'inhale' || breathingPhase === 'hold') ? [1, 1.45, 1] : 1,
                          opacity: isBreathingCalibrationActive ? [0.6, 0.1, 0.6] : 0.3,
                        }}
                        transition={{
                          duration: breathingPhase === 'hold' ? 4 : 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Main breathing ring */}
                      <motion.div
                        className="w-36 h-36 rounded-full bg-gradient-to-tr from-sky-600/20 via-cyan-500/10 to-sky-400/30 border-2 border-sky-400/40 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.25)] relative"
                        animate={{
                          scale: isBreathingCalibrationActive 
                            ? (breathingPhase === 'inhale' ? 1.3 : breathingPhase === 'exhale' ? 0.85 : 1.18) 
                            : 1
                        }}
                        transition={{
                          duration: isBreathingCalibrationActive 
                            ? (breathingPhase === 'hold' ? 4 : 3) 
                            : 2,
                          ease: "easeInOut"
                        }}
                      >
                        <Wind size={28} className={`text-sky-400 ${isBreathingCalibrationActive && breathingPhase !== 'hold' ? 'animate-[spin_40s_linear_infinite]' : ''}`} />
                        <span className="text-[10px] text-sky-300 font-bold tracking-widest mt-2 uppercase">
                          {isBreathingCalibrationActive ? breathingPhase : 'READY'}
                        </span>
                      </motion.div>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-base font-bold text-white transition-all">
                        {isBreathingCalibrationActive ? (
                          breathingPhase === 'inhale' ? '천천히 깊게 들이쉬세요 (Inhale)' :
                          breathingPhase === 'hold' ? '숨을 고요히 참으세요 (Hold)' :
                          '천천히 온기를 실어 내쉬세요 (Exhale)'
                        ) : (
                          '선(禪) 호흡 동조 준비 완료'
                        )}
                      </p>
                      <p className="text-xs text-white/50 leading-relaxed break-keep max-w-xs mx-auto">
                        {isBreathingCalibrationActive 
                          ? `실시간 정서 뇌파 및 심실 수렴 주파수 동조 중... (${breathingTimeLeft}초)`
                          : '아래 버튼을 눌러 15초간의 정서 주파수 호흡 동률 조율을 시작하십시오.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (isBreathingCalibrationActive) {
                          setIsBreathingCalibrationActive(false);
                          setBreathingPhase('idle');
                        } else {
                          setBreathingTimeLeft(15);
                          setBreathingPhase('inhale');
                          setIsBreathingCalibrationActive(true);
                        }
                      }}
                      className={`px-8 py-3 rounded-full text-xs font-bold border tracking-widest transition-all ${
                        isBreathingCalibrationActive
                          ? 'border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-950/40 animate-pulse'
                          : 'border-sky-500/40 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                      }`}
                    >
                      {isBreathingCalibrationActive ? '조율 중단' : '호흡 동조 시작'}
                    </button>
                  </div>
                )}
              </div>

              {/* 3-Column Grid Structure Under Card (100% same as Trinity) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-8">
                <div className="lg:col-span-2 space-y-8 opacity-100">
                  {!sessionCardDrawn ? (
                    <div className="p-8 rounded-[40px] text-center border-2 border-dashed border-white/10 bg-white/[0.01] text-white/30 text-xs font-sans">
                      수호 카드를 드로우하고 자가 레벨을 정렬하여 비전을 가동하세요.
                    </div>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.02, translateY: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDailyOracle}
                      disabled={isDailyOracleLoading}
                      className="w-full relative group overflow-hidden rounded-[40px] p-1 glass border border-sky-500/30 shadow-2xl disabled:opacity-50 cursor-pointer block text-left"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="glass rounded-[36px] p-8 md:p-12 text-center space-y-6 relative z-10 border border-white/10 group-hover:border-sky-500/40 shadow-2xl hover:bg-white/[0.08] transition-all font-sans font-bold">
                         <div className="w-20 h-20 mx-auto rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                            {isDailyOracleLoading ? <RefreshCw size={32} className="text-sky-400 animate-spin" /> : <Sparkles size={32} className="text-sky-400" />}
                         </div>
                         <div>
                           <h4 className="text-2xl font-bold text-white mb-2">Check Daily Vision</h4>
                           <p className="text-[11px] text-sky-100/40 uppercase tracking-widest font-bold font-sans">정서 오라클이 자가 청량한 위안과 맑음 테마를 설계합니다</p>
                         </div>
                      </div>
                    </motion.button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="glass p-8 rounded-[40px] border border-sky-500/35 shadow-2xl hover:border-sky-500/50 hover:bg-white/[0.08] transition-all duration-300 space-y-6 text-left font-sans">
                    <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2"><Wind size={16}/> Daily Remedy</h4>
                    <p className="text-sm text-sky-100/70 leading-relaxed font-sans">
                      오늘의 자가 심층 정서 분포 분석과 리듬 보정 전용 처방 요법을 전유 전송합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* dailyResult 가 존재할 때 - 웅장한 인-페이지 리프트 대공개! */
            <div className="w-full rounded-[40px] bg-zinc-950/85 border border-sky-500/20 p-8 md:p-12 space-y-8 relative overflow-hidden backdrop-blur-xl text-left font-sans animate-fade-in">
              <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] text-sky-400/80 font-bold uppercase tracking-[0.3em] font-mono block">
                    Daily Serenity Vision Complete
                  </span>
                  <h4 className="text-3xl font-display text-white tracking-widest uppercase font-sans">Serenity Oracle Registry</h4>
                  <p className="text-sm text-white/50 leading-relaxed max-w-xl font-sans">
                    생체 웰니스와 청정 아우라 천상 균형이 완전하게 연계되었습니다. 전사된 계시와 기조 비전을 확인하십시오.
                  </p>
                </div>

                {sessionCardDrawn && (
                  <div 
                    className="w-36 h-56 rounded-2xl border border-amber-500/30 relative shadow-2xl flex flex-col justify-between p-3 shrink-0 self-center bg-cover bg-center overflow-hidden"
                    style={{ backgroundImage: "url('/cards/bluebird_bg.png')" }}
                  >
                    {/* Frosted Glass Overlay */}
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[1.5px] z-0" />
                    
                    {/* Cosmic Foil Borders & Corner Accents */}
                    <div className="absolute inset-1 border border-amber-500/25 rounded-xl pointer-events-none z-10" />
                    <div className="absolute inset-1.5 border border-amber-500/10 rounded-xl pointer-events-none z-10" />
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-amber-500/40 pointer-events-none z-10" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-amber-500/40 pointer-events-none z-10" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-amber-500/40 pointer-events-none z-10" />
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-amber-500/40 pointer-events-none z-10" />

                    {/* Upper Roman Numeral & Sparkles */}
                    <div className="flex justify-between items-center text-[8px] font-mono text-amber-400/80 font-sans z-10 tracking-[0.2em]">
                      <span>{(() => {
                        const cardIdx = BLUEBIRD_CARDS.findIndex(c => c.name === sessionCardDrawn.name);
                        const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII"];
                        return numerals[cardIdx] || "I";
                      })()}</span>
                      <Sparkles size={8} className="text-amber-400/80 animate-pulse" />
                    </div>

                    {/* Central Medallion (Talisman) */}
                    <div className="relative w-10 h-10 mx-auto flex items-center justify-center z-10 my-auto animate-pulse">
                      <div className="absolute inset-0 border border-dashed border-amber-500/40 rounded-full animate-[spin_20s_linear_infinite]" />
                      <div className="absolute inset-0.5 border border-amber-500/20 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
                      <div 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-amber-600/30 border border-amber-500/60 flex items-center justify-center text-xl shadow-[0_0_12px_rgba(245,158,11,0.4)] drop-shadow-[0_0_6px_rgba(245,158,11,0.3)] transition-transform duration-500" 
                        style={{ transform: (sessionCardDrawn as any).isReversed ? "rotateZ(180deg)" : "rotateZ(0deg)" }}
                      >
                        <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{sessionCardDrawn.emoji}</span>
                      </div>
                    </div>

                    {/* Lower Typography Section */}
                    <div className="text-center space-y-0.5 z-10">
                      <span className="text-[7px] text-amber-400/80 font-serif tracking-[0.1em] uppercase block break-keep break-words max-w-full">
                        {sessionCardDrawn.keyphrase}
                      </span>
                      <h4 className="text-[10px] font-bold font-sans text-white tracking-wider leading-tight block break-keep break-words max-w-full">
                        {sessionCardDrawn.name}
                      </h4>
                      {(sessionCardDrawn as any).isReversed && (
                        <span className="text-[7px] font-mono text-red-400/90 font-bold block uppercase tracking-widest mt-0.5">
                          Reversed
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Detail Grid Body */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-sky-500 font-bold flex items-center gap-1 font-sans">
                      <Sparkles size={14} /> 심층 인과 관계식 비전 해독
                    </span>
                    <TTSButton text={dailyResult.diagnosis} voice="Kore" className="text-sky-400 border-sky-500/20 text-xs py-1.5 scale-90 font-sans" />
                  </div>
                  <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-white/90 text-sm sm:text-base font-sans leading-relaxed space-y-4 outline-none [&>h3]:text-sky-300 [&>h3]:text-lg [&>h3]:font-bold [&>ul]:list-disc [&>ul]:pl-5 [&>p]:mb-3 [&>strong]:text-yellow-200">
                    <Streamdown>{dailyResult.diagnosis}</Streamdown>
                  </div>

                  {dailyResult.guidance && (
                    <div className="p-6 rounded-3xl bg-white/[0.04] border border-sky-500/10 text-left space-y-2 font-sans">
                      <span className="text-[10px] text-sky-500 font-bold uppercase tracking-widest block flex items-center gap-1.5 font-sans">
                        <Sparkles size={12} /> Synergy Serenity Vibration
                      </span>
                      <div className="text-xs text-white/70 leading-relaxed font-sans mt-1">
                        <Streamdown>{dailyResult.guidance}</Streamdown>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6 text-left font-sans">
                  {/* Remedy */}
                  <div className="p-6 rounded-3xl bg-sky-500/5 border border-sky-500/20 space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-sky-400 flex items-center gap-2">
                      <Wind size={14} /> Daily Prescribed Remedy
                    </h5>
                    <p className="text-xs text-sky-100/90 leading-relaxed font-serif">
                      {dailyResult.remedy || '트리니티 비전에 동조하는 마음으로 오늘 평온의 완성을 유도하는 액션을 수행하십시오.'}
                    </p>
                  </div>

                  {/* Blessing */}
                  {dailyResult.blessingMessage && (
                    <div className="p-6 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 text-center space-y-2 animate-fade-in">
                      <span className="text-[9px] text-sky-400 font-bold uppercase tracking-widest block">
                        Aura's High Blessing
                      </span>
                      <p className="text-sm text-sky-100/90 font-serif italic leading-relaxed">
                        {dailyResult.blessingMessage}
                      </p>
                    </div>
                  )}

                  {/* 🌟 루시와 1:1 심층 상담 (Deep Insight) Banner */}
                  <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-sky-950/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.3)]">
                          <Sparkles size={13} className="animate-pulse" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-sky-200">
                          루시와 1:1 심층 상담 (Deep Insight)
                        </span>
                      </div>
                      <p className="text-[11px] text-white/70 font-sans leading-relaxed">
                        오늘의 블루버드 휴식 오라클을 바탕으로, 루시와 함께 마음의 긴장을 내려놓고 깊은 평온과 영적 안식을 누리세요.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        openLucyChat('bluebird');
                        const diag = dailyResult.diagnosis || dailyResult.summary || '오늘의 블루버드 평온 오라클';
                        const deepContext = `[🐦 블루버드 데일리 마음 휴식 오라클 연계]\n- 평온 진단: ${diag}\n- 치유 행동: ${dailyResult.remedy || ''}\n- 축복 메시지: ${dailyResult.blessingMessage || ''}`;
                        void sendUnifiedMessage(
                          `오늘의 블루버드 휴식 오라클("${diag.slice(0, 100)}...")에 대한 딥 인사이트(Deep Insight)를 들려줘.\n\n[오늘의 처방]\n${dailyResult.remedy || diag}\n\n불안과 조급함을 내려놓고 깊은 평온과 영적 안식을 누리는 구체적인 지혜를 들려줘.`,
                          'bluebird',
                          undefined,
                          { force: true, oracleContext: deepContext },
                        );
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(56,189,248,0.35)] active:scale-95 cursor-pointer shrink-0"
                    >
                      <Sparkles size={13} />
                      <span>루시와 심층 상담하기</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (activeMode !== 'daily' || sessionCardDrawn) return;

    const alignDeck = () => {
      const deck = cardContainerRef.current;
      if (deck && deck.scrollWidth > 0) {
        deck.scrollTo({
          left: Math.max(0, (deck.scrollWidth - deck.clientWidth) / 2),
          behavior: 'smooth'
        });
      }
    };

    // Multi-stage triggers to capture exact browser reflow timing
    alignDeck();
    const frame = window.requestAnimationFrame(alignDeck);
    const timer1 = setTimeout(alignDeck, 60);
    const timer2 = setTimeout(alignDeck, 180);
    const timer3 = setTimeout(alignDeck, 350);

    const deck = cardContainerRef.current;
    if (!deck) {
      return () => {
        window.cancelAnimationFrame(frame);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }

    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    let dragDistance = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      isDraggingRef.current = false;
      dragDistance = 0;
      startX = e.pageX - deck.offsetLeft;
      scrollLeft = deck.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
    };

    const onMouseUp = () => {
      isDown = false;
      if (dragDistance > 6) {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 30);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const x = e.pageX - deck.offsetLeft;
      const walk = (x - startX) * 1.6;
      if (Math.abs(walk) > 5) {
        isDraggingRef.current = true;
        dragDistance = Math.abs(walk);
      }
      deck.scrollLeft = scrollLeft - walk;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        deck.scrollBy({
          left: e.deltaY * 0.85,
          behavior: 'smooth'
        });
      }
    };

    deck.addEventListener('mousedown', onMouseDown);
    deck.addEventListener('mouseleave', onMouseLeave);
    deck.addEventListener('mouseup', onMouseUp);
    deck.addEventListener('mousemove', onMouseMove);
    deck.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.cancelAnimationFrame(frame);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      deck.removeEventListener('mousedown', onMouseDown);
      deck.removeEventListener('mouseleave', onMouseLeave);
      deck.removeEventListener('mouseup', onMouseUp);
      deck.removeEventListener('mousemove', onMouseMove);
      deck.removeEventListener('wheel', onWheel);
    };
  }, [activeMode, sessionCardDrawn, shuffledBluebirdCards]);

  const [stage, setStage] = useState<'landing' | 'analysis' | 'station' | 'history' | 'onboarding' | 'soul'>('landing');
  const [isDailyOracleLoading, setIsDailyOracleLoading] = useState(false);
  const [dailyResult, setDailyResult] = useState<any>(null);

  // Ju-Yeok (I Ching) Oracle Live States
  const [juyeokWorry, setJuyeokWorry] = useState("이번에 준비하는 사이드 프로젝트 잘 될까요?");
  const [juyeokPresetIndex, setJuyeokPresetIndex] = useState(0);
  const [juyeokBonGwa, setJuyeokBonGwa] = useState("천화동인 (天火同人)");
  const [juyeokByeonHyo, setJuyeokByeonHyo] = useState("3효 변함");
  const [juyeokJiGwa, setJuyeokJiGwa] = useState("천뢰무망 (天雷無妄)");
  const [juyeokBonLines, setJuyeokBonLines] = useState<number[]>([1, 0, 1, 1, 1, 1]); // Bottom to Top: 1 = Yang, 0 = Yin
  const [juyeokJiLines, setJuyeokJiLines] = useState<number[]>([1, 0, 0, 1, 1, 1]);
  const [juyeokResult, setJuyeokResult] = useState<string>("");
  const [isJuyeokLoading, setIsJuyeokLoading] = useState(false);
  const [dailyModeResult, setDailyModeResult] = useState<string>("");
  const [dailyMode, setDailyMode] = useState<string>('analyze');
  const [isDailyModeLoading, setIsDailyModeLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('chat_history_bluebird');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'greet', role: 'model', content: "반가워! 문학의 문장들과 고유한 음악 주파수로 너의 영혼을 깊고 맑게 위로하는 루시의 블루버드 예술치유 채널이야. 잠시 여기에 무거운 마음의 짐을 다 녹여보자.", timestamp: Date.now() }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('chat_history_bluebird', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);
  const [soulData, setSoulData] = useState({
    coreValue: "내면의 평화와 수용",
    unconsciousPattern: "막연한 불안과 책임감",
    preference: "따뜻하고 위로가 되는 어조",
    stats: [
      { subject: '평온함', A: 85, fullMark: 100 },
      { subject: '수용성', A: 90, fullMark: 100 },
      { subject: '회복력', A: 75, fullMark: 100 },
      { subject: '감수성', A: 85, fullMark: 100 },
      { subject: '안정감', A: 70, fullMark: 100 },
    ],
    energyFlow: [
      { time: '월', value: 50 }, { time: '화', value: 45 }, { time: '수', value: 60 }, { time: '목', value: 65 }, { time: '금', value: 80 }, { time: '토', value: 90 }, { time: '일', value: 85 }
    ],
    emotions: [
      { name: '안정', value: 40 }, { name: '불안', value: 30 }, { name: '그리움', value: 20 }, { name: '우울', value: 10 }
    ]
  });



  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [notice, setNotice] = useState({ open: false, title: '', message: '' });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const ALL_BLUEBIRD_SUGGESTIONS = [
    "마음이 불안할 때 듣기 좋은 말",
    "현재 감정에 맞는 명상법 추천",
    "평화를 찾는 간단한 호흡법",
    "오늘의 날씨와 어울리는 치유 메시지",
    "우울할 때 위안이 되는 위로",
    "지치고 피곤한 마음을 달래는 한마디",
    "자기 긍정감을 높이는 명상 조언",
    "불면증에 도움이 되는 힐링 가이드",
    "불안과 긴장을 이완시키는 이완법",
    "인간관계로 지쳤을 때 위로받기",
    "소소한 행복을 깨우는 영적 격려",
    "나에게 어울리는 수호 정령의 지혜"
  ];

  const [bluebirdSuggestions, setBluebirdSuggestions] = useState<string[]>(() => {
    const shuffled = [...ALL_BLUEBIRD_SUGGESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  });

  const handleRefreshBluebirdSuggestions = () => {
    const shuffled = [...ALL_BLUEBIRD_SUGGESTIONS].sort(() => 0.5 - Math.random());
    setBluebirdSuggestions(shuffled.slice(0, 4));
  };

  const handleSelectJuyeokPreset = (idx: number) => {
    setJuyeokPresetIndex(idx);
    const preset = JUYEOK_PRESETS[idx];
    setJuyeokWorry(preset.worry);
    setJuyeokBonGwa(preset.bonGwa);
    setJuyeokByeonHyo(preset.byeonHyo);
    setJuyeokJiGwa(preset.jiGwa);
    setJuyeokBonLines(preset.bonLines);
    setJuyeokJiLines(preset.jiLines);
    setJuyeokResult("");
  };

  const handleRandomJuyeokCast = () => {
    let nextIdx = Math.floor(Math.random() * JUYEOK_PRESETS.length);
    if (nextIdx === juyeokPresetIndex) {
      nextIdx = (nextIdx + 1) % JUYEOK_PRESETS.length;
    }
    handleSelectJuyeokPreset(nextIdx);
  };

  const handleJuyeokConsult = async () => {
    if (isJuyeokLoading) return;
    setIsJuyeokLoading(true);
    setJuyeokResult("");

    try {
      let fullText = "";
      await invokeLLMStream({
        messages: [
          {
            role: "system",
            content: `당신은 전통 주역(周易)의 지혜를 현대적인 감각과 직관적인 언어로 풀어내는 '현대적인 주역 상담가'입니다. 

[작업 지침]
유저가 뽑은 주역의 본괘, 변효, 지괘, 그리고 유저의 고민을 바탕으로 점괘를 해석해 주세요. 
1. 한자나 어려운 고전 용어는 최소화하고, 누구나 쉽게 이해할 수 있는 친근하고 명확한 문체를 사용하세요.
2. 점괘의 길흉(좋고 나쁨)에만 집착하기보다, 유저가 지금 어떤 마음가짐을 가져야 하는지 구체적인 행동 지침(조언)을 중심으로 서술해 주세요.
3. 답변은 아래 [출력 포맷]을 엄격히 지켜서 작성해 주세요.

[출력 포맷]
### ☯️ 당신의 운명의 괘: [본괘 이름 입력]
*(괘의 핵심 한 줄 요약)*

---

#### 1. 현재 당신이 처한 상황 (본괘 해석)
- [현재 유저의 심리나 주변 환경에 대한 분석]

#### 2. 눈여겨봐야 할 변화의 타이밍 (변효 및 지괘 해석)
- [변효가 의미하는 조심해야 할 점이나 기회 서술]
- *결과적으로 다가올 미래(지괘): [지괘 이름 입력]*

#### 3. 당신을 위한 현대적 조언 (Action Item)
- **도움이 되는 행동:** [구체적인 행동 가이드]
- **주의해야 할 행동:** [조심해야 할 태도나 리스크]`,
          },
          {
            role: "user",
            content: `[입력 데이터]
- 고민: "${juyeokWorry}"
- 본괘: ${juyeokBonGwa}
- 변효: ${juyeokByeonHyo}
- 지괘: ${juyeokJiGwa}`,
          },
        ],
        onChunk: (chunk) => {
          fullText += chunk;
          setJuyeokResult(fullText);
        },
      });
    } catch (err) {
      console.error("[JuyeokConsult] Failed to consult:", err);
      setJuyeokResult("우주적 주파수 통신 중 예기치 못한 차원 변위가 감지되었습니다. 다시 한 번 신탁을 시작해 주세요.");
    } finally {
      setIsJuyeokLoading(false);
    }
  };
  const [localHistory, setLocalHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [insightResult, setInsightResult] = useState<any>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [poeInsight, setPoeInsight] = useState<{ insight: string, category: string } | null>(null);
  const [isInsightCollapsed, setIsInsightCollapsed] = useState(false);
  const [form, setForm] = useState<ProfileForm>(() => {
    const p = getPersistentUserProfile()?.basic;
    return {
      name: p?.name || '',
      nickname: p?.nickname || '',
      birthdate: p?.birthdate || '',
      birthtime: p?.birthtime || '',
      city: p?.birthCity || '',
      gender: p?.gender === 'male' ? '남성' : '여성',
    };
  });

  // Sync Profile with Shared State
  useEffect(() => {
    const fbProfile = sharedState?.userProfile?.basic || getPersistentUserProfile()?.basic;
    if (!fbProfile) return;

    setForm((prev) => ({
      name: fbProfile.name || prev.name,
      nickname: fbProfile.nickname || prev.nickname,
      birthdate: fbProfile.birthdate || prev.birthdate,
      birthtime: fbProfile.birthtime || prev.birthtime,
      gender: fbProfile.gender === 'male' ? '남성' : '여성',
      city: fbProfile.birthCity || prev.city || '',
    }));
  }, [sharedState?.userProfile]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const isSendingRef = useRef(false);

  const handleSaveProfile = async () => {
    if (isInsightLoading) return;

    setIsInsightLoading(true);
    setInsightResult(null);

    const userProfileStr = sharedState?.userProfile ? JSON.stringify(sharedState.userProfile) : JSON.stringify(form);
    const recentMemory = sharedState?.bluebirdMemory || sharedState?.globalMemory || "최근 기록 없음";
    const dailyContext = dailyResult 
      ? `오늘의 Daily 오라클 진단: ${dailyResult.diagnosis} (상징: ${dailyResult.symbol}, 주파수: ${dailyResult.frequency})`
      : "오늘의 Daily 진단 데이터 없음";

    try {
      const data = await invokeLLMStructured({
        messages: [
          { role: 'system', content: `당신은 마음의 주파수를 꿰뚫어보는 영적 데이터 분석가 블루버드입니다. 사용자의 사주와 기운, 프로��, 최근 감정 기록 및 오늘의 Daily 오라클 진단을 종합적으로 분석하여 영혼의 치유와 안식을 주는 소울 리포트를 매우 심층적이고 고도화된 수준으로 작성하세요. [데이터 가이드: 프로필(${userProfileStr}), 최근상태(${recentMemory}), 데일리진단(${dailyContext})]\n준수사항: 'guidance' 필드는 소제목, 리스트, 강조 등 마크다운 양식을 적극 활용하여 최소 4문단 이상의 깊이 있는 통찰과 치유의 방향을 제시할 것. 또한, luckyColor(예: '하늘색', '시안 블루 (청청색)'), luckyItem(예: '푸른 깃털', '오르골'), deepSyncLevel(예: '최적화', '완전한 조화')는 반드시 완전한 한글 구문으로 기입하세요.` },
          { role: 'user', content: `이름: ${form.name || sharedState?.userProfile?.basic?.name}, 닉네임: ${form.nickname || sharedState?.userProfile?.basic?.nickname}, 생년월일: ${form.birthdate || sharedState?.userProfile?.basic?.birthdate}, 생시: ${form.birthtime || sharedState?.userProfile?.basic?.birthtime}, 거주지: ${form.city}, 성별: ${form.gender}. 현재 내 영혼의 에너지 레벨, 치유의 포인트, 그리고 나아가야 할 방향을 초고도화된 리포트로 전해줘.` }
        ],
        schema: SoulInsightSchema
      });
      setInsightResult(data);
      const existingProfile = sharedState?.userProfile || getPersistentUserProfile() || {};
      const updatedProfile = mergeUserProfiles(existingProfile, {
        basic: {
          ...(form.name ? { name: form.name } : {}),
          ...(form.nickname ? { nickname: form.nickname } : {}),
          ...(form.birthdate ? { birthdate: form.birthdate } : {}),
          ...(form.birthtime ? { birthtime: form.birthtime } : {}),
          ...(form.gender ? { gender: form.gender === '남성' ? 'male' : 'female' } : {}),
          ...(form.city ? { birthCity: form.city } : {}),
        }
      });
      await updateSharedState({ userProfile: updatedProfile, lastBluebirdSoulSync: Date.now() }, 'BLUEBIRD');
      setPersistentUserProfile(updatedProfile);
      setIsEditingProfile(false);
      if (firebaseUser) {
        try {
          await addDoc(collection(db, 'bluebird_history', firebaseUser.uid, 'entries'), {
              type: 'soul-analysis', content: `Soul Report: ${data.guidance.slice(0, 50)}...`, createdAt: serverTimestamp(), data 
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `bluebird_history/${firebaseUser.uid}/entries`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setNotice({ open: true, title: "LLM Error (Insight)", message: err?.message || String(err) });
    } finally {
      setIsInsightLoading(false);
    }
  };

  const handleAnalyzeSpirit = () => {
    if (!sharedState?.userProfile?.basic?.nickname) {
       setNotice({ open: true, title: "프로필 필요", message: "먼저 라이브러리에서 소울 프로필을 완성해주세요." });
       setActiveMode('history');
       return;
    }
    handleSaveProfile();
  };

  useEffect(() => {
    if (!firebaseUser) {
      setIsHistoryLoading(false);
      return;
    }
    const isDev = localStorage.getItem('developer_bypass') === 'true';
    if (isDev) {
      setIsHistoryLoading(false);
      return;
    }

    setIsHistoryLoading(true);

    let unsub: (() => void) | null = null;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    const subscribe = () => {
      const q = query(
        collection(db, 'bluebird_history', firebaseUser.uid, 'entries'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      unsub = onSnapshot(q, (snap) => {
        const docs = snap.docs
          .map(d => ({ 
            id: d.id, 
            ...d.data() as any,
            createdAt: (d.data() as any).createdAt?.toMillis?.() || Date.now()
          }))
          .filter((d: any) => d.type !== 'chat');
        setLocalHistory(docs);
        setIsHistoryLoading(false);
      }, (error) => {
        const msg = error?.message || '';
        if (msg.includes('INTERNAL ASSERTION FAILED')) {
          console.warn('[Bluebird] Firestore 내부 오류 — 5초 후 재연결합니다.');
          retryTimeout = setTimeout(subscribe, 5000);
        } else if (msg.includes('Quota') || msg.includes('quota') || msg.includes('resource-exhausted')) {
          console.warn('[Bluebird] Firestore 할당량 한도 도달 — 로컬 캐시를 사용합니다.');
          setIsHistoryLoading(false);
        } else {
          handleFirestoreError(error, OperationType.GET, `bluebird_history/${firebaseUser?.uid}/entries`);
          setIsHistoryLoading(false);
        }
      });
    };

    subscribe();
    return () => {
      unsub?.();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [firebaseUser]);


  useEffect(() => {
    if (!firebaseUser) return;
    const isDev = localStorage.getItem('developer_bypass') === 'true';
    if (isDev) {
      try {
        const saved = localStorage.getItem('soul_mirror_bluebird');
        if (saved) {
          setSoulData(JSON.parse(saved));
        }
      } catch (_) {}
      return;
    }
    const fetchSoulData = async () => {
      try {
        const docRef = doc(db, 'soul_mirror', firebaseUser.uid, 'dapps', 'bluebird');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSoulData(docSnap.data() as any);
        } else {
          const saved = localStorage.getItem('soul_mirror_bluebird');
          if (saved) {
            setSoulData(JSON.parse(saved));
          }
        }
      } catch (err) {
        console.warn("[Bluebird] Error loading soulData from cloud, falling back to local storage:", err);
        try {
          const saved = localStorage.getItem('soul_mirror_bluebird');
          if (saved) {
            setSoulData(JSON.parse(saved));
          }
        } catch (_) {}
      }
    };
    fetchSoulData();
  }, [firebaseUser]);

  useEffect(() => {
    const today = getTodayDateKey();
    if (sharedState?.todayOracles?.[today]?.bluebird) {
      const oracle = sharedState.todayOracles[today].bluebird;
      setDailyResult({ ...(oracle.data || oracle), dateKey: today });
    } else if (sharedState?.latestDailyOracles?.bluebird && (sharedState.latestDailyOracles.bluebird as any).dateKey === today) {
      const latest = sharedState.latestDailyOracles.bluebird;
      setDailyResult({ ...(latest.data || latest), dateKey: today });
    } else if (localHistory && localHistory.length > 0) {
      const todayDaily = localHistory.find((h: any) => h.type === 'oracle-vision' && isTimestampToday(h.createdAt));
      if (todayDaily) {
        setDailyResult({ ...(todayDaily.data || todayDaily), dateKey: today });
      }
    }

    if (localHistory && localHistory.length > 0) {
      const latestSoul = localHistory.find((h: any) => h.type === 'soul-analysis');
      if (latestSoul) {
        setInsightResult(latestSoul.data || latestSoul);
      }
    }
  }, [localHistory, sharedState?.todayOracles, sharedState?.latestDailyOracles]);

  useEffect(() => {
    const handleDailyOracleUpdated = () => {
      const today = getTodayDateKey();
      try {
        const cached = localStorage.getItem(`prism_daily_oracle_bluebird_${today}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (!parsed.dateKey || parsed.dateKey === today) {
            setDailyResult({ ...(parsed.data || parsed), dateKey: today });
          }
        }
      } catch (_) {}
    };
    window.addEventListener('prism:daily_oracle_updated', handleDailyOracleUpdated);
    return () => {
      window.removeEventListener('prism:daily_oracle_updated', handleDailyOracleUpdated);
    };
  }, []);

  const handleSend = async (customMsg?: string) => {
    const userMsg = (customMsg || chatInput).trim();
    if (!userMsg || isSendingRef.current) return;
    
    isSendingRef.current = true;
    setIsSending(true);
    if (!customMsg) setChatInput('');
    
    const userMsgObj: Message = { 
      id: `user-${Date.now()}`,
      role: 'user', 
      content: userMsg,
      timestamp: Date.now()
    };
    const modelMsgId = `model-${Date.now()}`;
    setMessages(prev => [...prev, userMsgObj, { id: modelMsgId, role: 'model', content: '', timestamp: Date.now() }]);

    // Trigger async insight gathering
    poeQuickInsight(userMsg, messages).then((res: any) => {
      if (res && res.insight) {
        setPoeInsight({ insight: res.insight, category: res.category });
        setIsInsightCollapsed(false);
        if (res.themeColor || res.currentVibe) {
          updateSharedState({
            ...(res.themeColor ? { themeColor: res.themeColor } : {}),
            ...(res.currentVibe ? { currentVibe: res.currentVibe } : {})
          }, 'BLUEBIRD');
        }
      }
    }).catch(console.error);

    try {
      const history = [...messages, userMsgObj].slice(-10).map(m => ({ role: m.role, content: m.content }));
      const profile = sharedState?.userProfile || getPersistentUserProfile();
      const deepCoreInfo = buildDeepSynapseContext(profile);
      const soulMirrorInfo = `\n[영혼의 거울]\n- 핵심 가치: ${soulData.coreValue}\n- 무의식적 패턴: ${soulData.unconsciousPattern}\n- 취향 및 선호: ${soulData.preference}\n이 데이터를 바탕으로 사용자의 방향성을 교정하여 코칭에 반영할 것. 또한, 이번 대화를 바탕으로 이 영혼의 거울 데이터(핵심 가치, 패턴, 취향, stats, energyFlow, emotions 등)를 갱신해야 한다면 응답의 가장 마지막에 오직 다음 포맷으로만 업데이트 내용을 출력하세요: [SOUL_UPDATE: {"coreValue":"...","unconsciousPattern":"...","preference":"...","stats":[{"subject":"...","A":85,"fullMark":100}],"energyFlow":[{"time":"...","value":80}],"emotions":[{"name":"...","value":40}]}]`;
      const combinedContext = deepCoreInfo + "\n" + soulMirrorInfo;
      const sectionName = activeMode === 'daily' ? '데일리 치유' : '일반 치유';
      const systemPrompt = PERSONAS.bluebirdChat(sectionName, sharedState?.globalMemory, combinedContext) + getCrossAppRecentDialogueContext();

      let finalResponse = "";
      await invokeLLMStream({
        messages: [{ role: 'system', content: systemPrompt }, ...history],
        onChunk: (chunk) => {
          finalResponse += chunk;
           const displayResponse = finalResponse
            .replace(/\[EMOTION:\s*[^\]]*\]/gi, '')
            .replace(/\[EMOTION:[\s\S]*?$/, '')
            .replace(/\[SOUL_UPDATE:[\s\S]*$/, '')
            .trim();
          setMessages(prev => {
            const next = [...prev];
            if (next.length > 0 && next[next.length - 1].role === 'model') {
              next[next.length - 1] = { ...next[next.length - 1], content: displayResponse };
            }
            return next;
          });
        }
      });
      
      const match = finalResponse.match(/\[SOUL_UPDATE:\s*({[\s\S]*?})\]/);
      if (match) {
        try {
          const parsed = JSON.parse(match[1]);
          setSoulData(prev => {
            const updated = { ...prev, ...parsed };
            if (firebaseUser) {
              const isDev = localStorage.getItem('developer_bypass') === 'true';
              if (isDev) {
                localStorage.setItem('soul_mirror_bluebird', JSON.stringify(updated));
              } else {
                setDoc(doc(db, 'soul_mirror', firebaseUser.uid, 'dapps', 'bluebird'), updated)
                  .catch(e => console.error("Error saving soulData to firestore", e));
              }
            }
            return updated;
          });
        } catch (e) {
          console.error("Soul update parse error", e);
        }
      }
      finalResponse = finalResponse
        .replace(/\[EMOTION:\s*[^\]]*\]/gi, '')
        .replace(/\[EMOTION:[\s\S]*?$/, '')
        .replace(/\[SOUL_UPDATE:[\s\S]*$/, '')
        .trim();

      if (firebaseUser && localStorage.getItem('developer_bypass') !== 'true') {
        try {
          await addDoc(collection(db, "bluebird_history", firebaseUser.uid, "entries"), {
            type: "chat",
            title: `마음 교감: ${userMsg.slice(0, 20)}${userMsg.length > 20 ? '...' : ''}`,
            content: `질���: "${userMsg}"\n\n치유 메시지:\n${finalResponse}`,
            createdAt: serverTimestamp(),
            metadata: {
              question: userMsg,
              reply: finalResponse
            }
          });
        } catch (error) {
          console.error("Error saving Bluebird chat log:", error);
        }
      }
    } catch (err: any) {
      console.error(err);
      setNotice({ open: true, title: "LLM Error (Send)", message: err?.message || String(err) });
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 🎯 toss 즉시 실행 브릿지: handleSend ref로 항상 최신 클로저 유지
  const handleSendRef = useRef(handleSend);
  useEffect(() => { handleSendRef.current = handleSend; });

  useEffect(() => {
    const handleAutoExecute = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail?.autoTrigger) return;
      const text = (detail?.text || '').trim();
      if (!text || text.length < 2) return;
      setShowChat(true);
      setTimeout(() => {
        try { handleSendRef.current(text); } catch (_) {}
      }, 200);
    };
    window.addEventListener('prism:bluebird_auto_execute', handleAutoExecute);
    return () => window.removeEventListener('prism:bluebird_auto_execute', handleAutoExecute);
  }, []);

  const handleDailyOracle = async () => {
    if (isDailyOracleLoading) return;

    setIsDailyOracleLoading(true);
    setDailyResult(null);

    const modePrompt = dailyMode === 'breathe' ? '생명 에너지의 흐름을 조율하고 우주적 주파수와 동조시켜 영혼의 호흡을 깊게 유도하는 차원 높은 명상적 가이드로' :
                       dailyMode === 'reflect' ? '무의식의 심연을 섬세하게 어루만지고, 흩어진 감정의 파편들을 모아 온전한 내면의 평화를 빚어내는 심층적인 성찰과 위로로' :
                       dailyMode === 'oracle' ? '시간과 공간을 초월한 치유의 메시지이자 굳건한 영적 신탁을 내리는 차원 높은 예언자의 형식으로' : 
                       dailyMode === 'care' ? '지친 영혼을 완벽히 감싸안고, 가장 안전한 우주의 요람에서 돌보아주는 성숙하고 무한한 포용력과 따뜻함으로' : '종합적이고 초월적인 영적 조언과 함께';

    const userProfileStr = sharedState?.userProfile ? JSON.stringify(sharedState.userProfile) : "프로필 정보 없음";
    const recentMemory = sharedState?.bluebirdMemory || sharedState?.globalMemory || "최근 기록 없음";

    try {
      
    const isRev = (sessionCardDrawn as any)?.isReversed;
    const cardContext = sessionCardDrawn
      ? `\n[오늘의 치유 오라클 카드]: ${sessionCardDrawn.name} ${sessionCardDrawn.emoji} (${sessionCardDrawn.keyphrase}) - ${isRev ? "역방향(Reversed)" : "정방향(Upright)"} 상태\n- 치유 분석 가이드: 이 카드는 현재 ${isRev ? "역방향으로 발현되어 해당 평온의 에너지가 사용자의 무의식 속에서 억압되어 있거나, 오히려 마음의 가시나 불안으로 과잉되어 나타나는 상태(역설적 조언 및 내면의 숨겨진 그림자 해소 가이드)로 해석해야 합니다." : "정방향으로 발현되어 해당 맑고 청아한 평화 에너지가 활짝 피어나 내면 자아를 온전하게 위로하는 상태로 해석해야 합니다."} 이 카드의 정/역방향 위안 주파수와 치유 상징을 오라클 리딩에 아주 중요한 모티브로 함께 융합하여 해석해줄 것`
      : "";
    const levelContext = `\n[자가 진단 정서/피로 편차 수준]: 현재 레벨 ${sessionComfortLevel}수준 (${sessionComfortLevel === 1 ? '매우 고갈되고 마음의 여유가 부족함' : sessionComfortLevel === 5 ? '가볍고 평온한 맑은 상태' : '보통 또는 미미한 불안상태'})`;

    const data = await invokeLLMStructured({
        messages: [
          { role: 'system', content: `당신은 최고의 마음 챙김 가이드 '블루버드'입니다.
오늘 질문자가 뽑은 치유 카드는 **[${sessionCardDrawn ? `${sessionCardDrawn.name} ${sessionCardDrawn.emoji}` : "치유의 파랑새"}]**입니다.

[반드시 준수할 필수 지침]
1. 오늘 드로우한 치유 카드 **[${sessionCardDrawn?.name || ''}]**(${sessionCardDrawn?.keyphrase || ''})의 상징과 위로의 주파수를 진단의 최우선 중심축으로 삼아 풀이하세요.
2. 'diagnosis' 필드는 마크다운(소제목, 글머리 기호)을 활용하여 3~4문단 이상의 장문으로 [${sessionCardDrawn?.name || ''}] 카드가 전하는 마음 챙김과 내면 평화의 심층 분석 리포트를 작성하세요.
3. 'remedy'에는 이 카드의 지혜를 담은 오늘 하루의 마음 실천 팁 2문장을 전달하세요. [데이터: 프로필(${userProfileStr}), 최근상태(${recentMemory})${cardContext}${levelContext}]` },
          { role: 'user', content: `오늘 내가 뽑은 치유 카드는 [${sessionCardDrawn?.name || ''} ${sessionCardDrawn?.emoji || ''}] (${sessionCardDrawn?.keyphrase || ''})야. 이 카드의 치유 모티브를 중심으로, ${modePrompt} 오늘 나의 마음을 진단하고 가이드해줘.` }
        ],
        schema: QuickInsightSchema
      });
      const todayK = getTodayDateKey();
      const finalData = { ...data, drawnCard: sessionCardDrawn, dateKey: todayK };
      setDailyResult(finalData);
      setShowDailyModal(true);

      recordDailyOracleResult({
        app: 'bluebird',
        featureName: '오늘의 마음챙김 치유 오라클',
        cardName: sessionCardDrawn ? `${sessionCardDrawn.name} ${sessionCardDrawn.emoji || ''}` : '치유의 파랑새 카드',
        cardDesc: sessionCardDrawn?.keyphrase || '',
        drawnCard: sessionCardDrawn,
        diagnosis: String(data.diagnosis || ''),
        remedy: String(data.remedy || ''),
        symbol: String(data.symbol || sessionCardDrawn?.name || ''),
        frequency: String(data.frequency || '432Hz'),
        dateKey: todayK,
      });

      await updateSharedState({
        lastBluebirdDailySync: Date.now(),
        todayOracles: {
          ...(sharedState?.todayOracles || {}),
          [todayK]: {
            ...(sharedState?.todayOracles?.[todayK] || {}),
            bluebird: finalData,
          },
        },
        latestDailyOracles: {
          ...(sharedState?.latestDailyOracles || {}),
          bluebird: finalData,
        },
      }, 'BLUEBIRD');
      if (firebaseUser && localStorage.getItem('developer_bypass') !== 'true') {
        await addDoc(collection(db, 'bluebird_history', firebaseUser.uid, 'entries'), {
            type: 'oracle-vision', content: `Oracle Vision: ${data.diagnosis}`, createdAt: serverTimestamp(), data: finalData 
        });
      }
    } catch (err: any) {
      console.error(err);
      setNotice({ open: true, title: "LLM Error (Oracle)", message: err?.message || String(err) });
    } finally {
      setIsDailyOracleLoading(false);
    }
  };

  const handleDailyModeAction = async (mode: string) => {
    setIsDailyModeLoading(true);
    setDailyModeResult("");
    try {
      const topic = mode === "harmony" ? "내면의 균형과 조화" : "새로운 활력과 에너지";
      let fullText = "";
      await invokeLLMStream({
        messages: [
          {
            role: "system",
            content: `당신은 치유의 메신저 '블루버드'입니다. 사용자의 ${topic}를 분석하여 따뜻하고 위로가 되는 심층 리포트를 작성해주세요. 한국어만 사용하며, 시적이고 치유적인 어조를 유지하세요.`,
          },
          {
            role: "user",
            content: `오늘의 ${topic}에 대한 영적 메시지를 들려줘.`,
          },
        ],
        onChunk: (chunk) => {
          fullText += chunk;
          setDailyModeResult(fullText);
        },
      });
      if (firebaseUser && localStorage.getItem('developer_bypass') !== 'true') {
        await addDoc(
          collection(db, "bluebird_history", firebaseUser.uid, "entries"),
          {
            type: "daily_reading",
            content: fullText,
            createdAt: serverTimestamp(),
            metadata: { mode },
          },
        );
      }
    } catch (err: any) {
      console.error(err);
      setNotice({ open: true, title: "LLM Error (Daily Mode)", message: err?.message || String(err) });
    } finally {
      setIsDailyModeLoading(false);
    }
  };

  return (
    <div className="h-app-full w-full flex flex-col relative overflow-hidden font-sans bg-transparent">
      <motion.div
        initial={{ y: -8, opacity: 0.88 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-safe-2 left-2 sm:left-4 md:top-safe-4 md:left-6 pointer-events-auto z-[110] transition-opacity duration-300 ${isSpecialFeatureChromeHidden ? SPECIAL_FEATURE_CHROME_HIDDEN_CLASS : 'opacity-100'}`}
      >
         <div className="flex items-center gap-2.5 sm:gap-3">
            <div 
              className="relative w-11 h-11 rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] group backdrop-blur-md cursor-pointer transition-transform active:scale-95 shrink-0" 
              onClick={() => openChannelIntro('bluebird')}
              title="파랑새의 성소 채널 소개 (클릭)"
            >
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} 
                 className="absolute inset-0 rounded-full border border-dashed border-sky-400/40 group-hover:border-sky-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all" 
               />
               <div className="absolute inset-[3px] rounded-full border border-sky-400/30 bg-sky-500/10 group-hover:bg-sky-500/20 flex items-center justify-center transition-all">
                 <Bird size={20} className="relative z-10 text-sky-400 drop-shadow-[0_0_12px_currentColor] transition-transform group-hover:scale-110 duration-300 animate-pulse" strokeWidth={1.5} />
               </div>
            </div>
            <div className="cursor-pointer flex flex-col justify-center select-none" onClick={() => navigate('/')}>
               <h1><LucKeyLogoText /></h1>
               <p className="text-[8px] md:text-[9px] text-white/40 uppercase tracking-widest font-bold font-sans leading-none mt-0.5">BLUEBIRD • SOUL SANCTUARY</p>
            </div>
         </div>
      </motion.div>


      <motion.nav
        initial={{ y: -10, x: '-50%', opacity: 0.88 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`prism-xs-subnav fixed top-safe-nav md:top-safe-nav-md left-1/2 z-[100] flex items-center gap-1 p-1 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl max-w-[95vw] overflow-x-auto no-scrollbar md:max-w-fit md:overflow-visible transition-opacity duration-300 ${isSpecialFeatureChromeHidden ? SPECIAL_FEATURE_CHROME_HIDDEN_CLASS : 'opacity-100'}`}
      >
          {[
            { id: 'daily', icon: Layout, label: "Ho'oponopono" },
            { id: 'secretMessage', icon: Mail, label: 'LETTER' },
            { id: 'synergy', icon: Sparkles, label: 'TRANSMUTATION' }
          ].map(item => {
           const isActive = activeMode === item.id;
           return (
             <button
               key={item.id}
               onClick={() => { 
                 setActiveMode(item.id as any);
                 setShowSecretMessageModal(false);
                 setStage('landing');
                 setShowChat(false);
               }}
               className={`prism-subnav-btn flex shrink-0 whitespace-nowrap items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
             >
               <item.icon size={16} className={isActive ? 'animate-pulse' : ''} />
               <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all'}`}>
                 {item.label}
               </span>
             </button>
           );
         })}
      </motion.nav>

      <main data-app-scroll-root {...bluebirdSwipeHandlers} className="flex-1 w-full pt-page pb-page md:pt-page-md md:pb-page-md flex flex-col bg-transparent relative z-10 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="max-w-5xl w-full mx-auto px-3 sm:px-6 prism-xs-pad flex-1 flex flex-col">
           <AnimatePresence mode="wait">
             {activeMode === 'synergy' ? (
               <motion.div key="bluebird-synergy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-8 sm:pb-12">
                 <BluebirdSynergySection />
               </motion.div>
             ) : null}
             {activeMode === 'daily' ? (
               <motion.div key="daily-top" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-8 sm:pb-12">
                 {renderDailyOracle()}
               </motion.div>
             ) : null}
             {activeMode === 'secretMessage' ? (
               <motion.div key="secretMessage-top" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-8 sm:pb-12">
                 <SecretMessage isModal={false} />
               </motion.div>
             ) : null}
              {activeMode === 'history' ? (
                <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-8 sm:pb-12">

                    <div className="glass p-5 md:p-10 rounded-[24px] md:rounded-[60px] border border-sky-500/20 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-10">
                         <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20"><Library size={28} /></div>
                           <div><h3 className="text-2xl font-display text-white">Oracle Library</h3></div>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <div className="mb-8">
                           <CalendarView 
                             selectedDate={selectedDate} 
                             onDateSelect={setSelectedDate} 
                             highlightDates={localHistory.map((h: any) => new Date((h.timestamp || h.createdAt || Date.now())))}
                             color={'#0ea5e9'}
                           />
                         </div>
                         
                         {/* Category Filter */}
                         {localHistory.length > 0 && Array.from(new Set(localHistory.map((h: any) => h.type || 'RECORD'))).length > 1 && (
                           <div className="flex flex-wrap gap-2 mb-6">
                             <button
                               onClick={() => setCategoryFilter('all')}
                               className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${categoryFilter === 'all' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-white/5 text-white/20 border border-white/5 hover:text-white/40'}`}
                             >
                               All Categories
                             </button>
                             {Array.from(new Set(localHistory.map((h: any) => h.type || 'RECORD'))).map((cat: any) => (
                               <button
                                 key={cat}
                                 onClick={() => setCategoryFilter(cat)}
                                 className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${categoryFilter === cat ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-white/5 text-white/20 border border-white/5 hover:text-white/40'}`}
                               >
                                 {cat}
                               </button>
                             ))}
                           </div>
                         )}

                         {localHistory.filter((h: any) => (!selectedDate || new Date((h.timestamp || h.createdAt || Date.now())).toDateString() === selectedDate.toDateString()) && (categoryFilter === 'all' || (h.type || 'RECORD') === categoryFilter)).length > 0 ? (
                           localHistory.filter((h: any) => (!selectedDate || new Date((h.timestamp || h.createdAt || Date.now())).toDateString() === selectedDate.toDateString()) && (categoryFilter === 'all' || (h.type || 'RECORD') === categoryFilter)).map((h: any, i: number) => (
                             <div key={h.id || i} className="p-6 rounded-3xl glass border border-white/10 hover:border-sky-400/40 shadow-2xl hover:bg-white/[0.08] transition-all text-left">
                                <div className="flex justify-between items-center mb-3">
                                   <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">{h.type || "RECORD"}</span>
                                   <span className="text-[10px] text-white/20 font-mono ">{new Date(h.timestamp || h.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-white/70 font-sans">"{h.content || h.text || h.data?.guidance || "분석 완료 데이터"}"</p>
                             </div>
                           ))
                         ) : <p className="text-center text-white/20  py-20">아직 기록된 여정이 없습니다.</p>}
                      </div>
                   </div>
                  
                </motion.div>
              ) : activeMode === 'bible' ? (
                 <motion.div key="bible" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-8 sm:pb-12">
                    <div className="space-y-10">
                       <HoponoponoBible onConsult={handleSend} />
                    </div>
                 </motion.div>
              ) : activeMode === 'soul' ? (
                 <motion.div key="soul" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 pb-8 sm:pb-12">
                    {isEditingProfile ? (
                      <div className="max-w-2xl mx-auto glass p-12 rounded-[60px] border border-sky-500/20 shadow-2xl space-y-10 text-white">
                         <div className="flex items-center justify-between">
                           <h3 className="text-2xl font-display text-white ">Soul Profile Configuration</h3>
                           <button onClick={() => setIsEditingProfile(false)} className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white"><X size={20}/></button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Name</label>
                             <input className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-sky-500/50 text-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Nickname</label>
                             <input className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-sky-500/50 text-white" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Birth Date</label>
                             <input type="date" className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-sky-500/50 text-white invert-calendar" value={form.birthdate} onChange={e => setForm({...form, birthdate: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Birth Time</label>
                              <input type="time" className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-sky-500/50 text-white invert-calendar" value={form.birthtime} onChange={e => setForm({...form, birthtime: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">City</label>
                              <input className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-sky-500/50 text-white" placeholder="e.g. Seoul" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Gender</label>
                              <div className="flex gap-2 p-1 bg-white/5 rounded-[24px] border border-white/10">
                                {['여성', '남성'].map(g => (
                                  <button key={g} onClick={() => setForm({...form, gender: g})} className={`flex-1 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${form.gender === g ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'text-white/30 hover:text-white'}`}>{g}</button>
                                ))}
                              </div>
                           </div>
                         </div>
                         <button onClick={handleSaveProfile} disabled={isInsightLoading} className="w-full py-5 rounded-[28px] bg-sky-600 text-white font-black uppercase tracking-[0.3em] shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                            {isInsightLoading ? 'Calculating Destiny...' : 'Update Destiny Soul'}
                         </button>
                      </div>
                    ) : insightResult ? (
                      <div className="max-w-4xl mx-auto space-y-10 px-6 mt-10">
                         <div className="w-full glass p-5 md:p-10 rounded-[28px] md:rounded-[60px] border border-sky-500/30 shadow-[0_0_100px_rgba(14,165,233,0.1)] text-white">
                             <div className="flex items-center justify-between mb-10 text-left">
                               <div className="flex items-center gap-3">
                                 <Zap size={22} className="text-sky-400" />
                                 <span className="text-sm font-bold text-sky-500 tracking-[0.4em] uppercase ">The Healing Decree</span>
                               </div>
                               {/* Soul action buttons deleted per requirement */}
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                               <StatBar label="Spirit Level" value={insightResult.luckScore} color="#0ea5e9" />
                               <StatBar label="Harmony" value={insightResult.loveScore} color="#f472b6" />
                               <StatBar label="Abundance" value={insightResult.wealthScore} color="#4ade80" />
                               <StatBar label="Vitality" value={insightResult.healthScore} color="#eab308" />
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 font-sans font-medium uppercase tracking-tight">
                               {[
                                  { label: '동기화 상태', v: translateEnglishValue(insightResult.deepSyncLevel || 'OPTIMAL'), c: 'text-sky-400' },
                                  { label: '파워 아이템', v: translateEnglishValue(insightResult.luckyItem || 'Blue Feather'), c: 'text-sky-300' },
                                  { label: '집중 색상', v: translateEnglishValue(insightResult.luckyColor || 'Cyan Blue'), c: 'text-sky-200' }
                               ].map((i, idx) => (
                                 <div key={idx} className="p-6 bg-white/[0.03] border border-white/5 rounded-[40px] flex flex-col items-center justify-center">
                                   <span className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-sans font-bold">{i.label}</span>
                                   <span className={`text-base text-center flex ${i.c}`}>{i.v}</span>
                                 </div>
                               ))}
                             </div>

                             <div className="space-y-6 text-left relative z-10">
                               <div className="p-8 bg-sky-500/10 border border-sky-500/20 rounded-[48px] shadow-inner font-sans">
                                 <div className="flex items-center justify-between mb-4">
                                   <div className="flex items-center gap-3">
                                      <Sparkles size={18} className="text-sky-400 animate-pulse" />
                                      <div className="flex flex-col text-left">
                                        <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest leading-none">Master's Guidance</span>
                                        <span className="text-[9px] text-white/40 font-sans mt-1 leading-none">오늘 하루의 구체적 행동 지침과 따뜻한 심리 멘토링 조언입니다.</span>
                                      </div>
                                    </div>
                                   <TTSButton text={insightResult.guidance} voice="Kore" className="text-sky-400 border-sky-500/20" />
                                 </div>
                                 <div className="text-base sm:text-lg text-white/90 font-sans leading-relaxed [&>h3]:text-sky-300 [&>h3]:text-xl [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>p]:mb-4">
                                   <Streamdown>{insightResult.guidance}</Streamdown>
                                 </div>
                               </div>
                               <div className="p-10 bg-sky-500/5 rounded-[54px] border border-sky-500/20 font-sans text-white/70 leading-relaxed relative overflow-hidden backdrop-blur-md shadow-[0_4px_30px_rgba(14,165,233,0.05)] text-left">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                 <div className="flex items-center gap-3 mb-4">
                                   <div className="p-2 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                                     <Compass size={18} className="animate-pulse" />
                                   </div>
                                   <div className="flex flex-col">
                                     <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Cosmic Alignment & Destiny Sync</span>
                                     <span className="text-[10px] text-white/40 mt-0.5 font-sans">우주적 운명과 영적 주파수 분석</span>
                                   </div>
                                 </div>
                                 <p className="text-[11px] text-white/50 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2.5 mb-4 leading-relaxed font-sans font-medium">
                                   ✨ 태어난 날의 기운과 오늘 우주의 파동이 공명하는 영적인 방향성이며, 마스터의 조언을 깊이 있게 뒷받침해 주는 운명 에너지의 흐름입니다.
                                 </p>
                                 <div className="text-base sm:text-lg text-white/90 font-sans leading-relaxed">
                                   <Streamdown>{insightResult.cosmicAspect}</Streamdown>
                                 </div>
                               </div>
                             </div>
                         </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-8 max-w-md mx-auto text-center mt-20 text-white">
                         <div className="w-20 h-20 rounded-[28px] bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                            <Zap size={40} className="text-sky-500" />
                         </div>
                         <div className="space-y-4">
                            <h3 className="text-3xl font-display text-white font-bold tracking-tight uppercase">Energy Analysis</h3>
                            <p className="text-sm text-white/40 font-sans leading-relaxed">
                               "현재 당신의 영적 주파수와 위로의 흐름을 다차원적으로 분석합니다. 블루버드의 연금술과 결���하여 오늘의 치유 선언문을 발행하세요."
                            </p>
                         </div>
                         <div className="flex flex-col gap-4 w-full">
                            <button onClick={handleAnalyzeSpirit} disabled={isInsightLoading} className="w-full px-10 py-5 rounded-[32px] bg-sky-600 text-white font-black uppercase tracking-[0.3em] shadow-xl shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all font-sans flex justify-center items-center">
                                {isInsightLoading ? <RefreshCw className="animate-spin" size={20} /> : "분석 시작하기"}
                            </button>
                            <button
                              onClick={() => setIsEditingProfile(true)}
                              className="text-[10px] text-white/30 hover:text-white font-bold uppercase tracking-widest transition-all mt-2"
                            >
                              Config Soul Profile
                            </button>
                         </div>
                      </div>
                    )}
                 </motion.div>
              ) : activeMode === 'daily' ? null : false ? (
                  <motion.div key="daily" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-8 sm:pb-12">
                     <div className="text-center space-y-4 pt-4 md:pt-8 animate-fade-in">
                        <h3 className="text-5xl font-sans text-white font-bold tracking-tighter">Divine Station</h3>
                        <p className="text-[10px] text-sky-500 font-bold uppercase tracking-[0.4em] font-sans">평온의 전령과 치유의 배열</p>
                     </div>
                     
                     <div className="w-full max-w-6xl mx-auto space-y-8 text-left">
                        <div className="space-y-12">
                          {false ? (
                            <div className="w-full rounded-[40px] bg-sky-950/20 border border-sky-500/10 p-8 md:p-12 text-center space-y-8 relative overflow-hidden backdrop-blur-md">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.03)_0%,transparent_70%)] pointer-events-none" />
                              
                              <div className="space-y-3">
                                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-[0.2em] font-mono">Healing Card Casting</span>
                                <h4 className="text-2xl font-bold text-white tracking-tight">오늘의 마음 치유 오라클 카드 드로우</h4>
                                <p className="text-xs text-white/50 max-w-lg mx-auto leading-relaxed break-keep">
                                  스스로를 돌보고 안심시키기 위한 평온의 우주 주파수를 한 장의 치유 카드로 응축합니다. 가슴 깊이 호흡하고 마음에 닿는 카드를 터치해 주세요.
                                </p>
                              </div>

                              {/* Mobile: show a readable slice of the 22-card fan and let users swipe through it. */}
                              {isMobile ? (
                                <div className="relative w-full overflow-hidden py-2 my-1">
                                  {/* Left & Right Edge Vignette Fades */}
                                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-zinc-950/90 to-transparent z-20 pointer-events-none" />
                                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zinc-950/90 to-transparent z-20 pointer-events-none" />
                                  
                                  <div ref={cardContainerRef} className="w-full flex items-end overflow-x-auto premium-scroll -space-x-14 py-10 px-[calc(50%-3.5rem)] select-none flex-nowrap scrollbar-none snap-x snap-mandatory font-sans cursor-grab active:cursor-grabbing">
                                    {shuffledBluebirdCards.map((card, idx) => {
                                      const fanOffset = idx - (shuffledBluebirdCards.length - 1) / 2;
                                      const offset = bluebirdOffsets[idx] || { xOff: 0, yOff: 0, rotOff: 0 };
                                      return (
                                        <motion.div
                                          key={`bluebird-dewdrop-mobile-${card.name}`}
                                          initial={{ y: 30, opacity: 0 }}
                                          animate={{ 
                                            y: Math.abs(fanOffset) * 2.2 + (offset.yOff * 0.4), 
                                            opacity: 1, 
                                            rotate: fanOffset * 1.45 + (offset.rotOff * 0.4) 
                                          }}
                                          transition={{ delay: idx * 0.015 }}
                                          onClick={() => {
                                            if (isDraggingRef.current) return;
                                            try {
                                              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                                              const osc = ctx.createOscillator();
                                              const gain = ctx.createGain();
                                              osc.connect(gain);
                                              gain.connect(ctx.destination);
                                              osc.type = 'sine';
                                              osc.frequency.setValueAtTime(260 + idx * 10, ctx.currentTime);
                                              gain.gain.setValueAtTime(0.04, ctx.currentTime);
                                              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                                              osc.start();
                                              osc.stop(ctx.currentTime + 0.6);
                                            } catch(e){}
                                            
                                            setSessionCardDrawn(card);
                                          }}
                                          className="w-28 h-44 shrink-0 snap-center snap-always bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border border-sky-500/30 rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer hover:border-sky-400 hover:-translate-y-4 active:scale-95 group/card relative transition-transform"
                                          style={{ transformOrigin: 'bottom center' }}
                                        >
                                          {/* Beautiful patterned icon on back */}
                                          <div className="absolute inset-1.5 border border-sky-500/20 rounded-xl flex flex-col items-center justify-center bg-sky-500/5 group-hover/card:bg-sky-500/10 transition-all shadow-inner">
                                            <div className="w-10 h-10 rounded-full border border-sky-500/20 flex items-center justify-center bg-black/40 shadow-md">
                                              <Bird size={20} className="text-sky-400 group-hover/card:scale-110 transition-all shadow-[0_0_8px_rgba(56,189,248,0.6)] animate-pulse" />
                                            </div>
                                          </div>
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div className="relative h-48 w-full flex items-center justify-center select-none overflow-visible py-4 my-2" style={{ perspective: "1000px" }}>
                                  {shuffledBluebirdCards.map((card, idx) => {
                                    const total = shuffledBluebirdCards.length;
                                    const progress = (idx / (total - 1)) - 0.5;
                                    const offset = bluebirdOffsets[idx] || { xOff: 0, yOff: 0, rotOff: 0 };
                                    
                                    // Gorgeous, mathematically precise clean fan shape
                                    const xOffset = progress * 680 + offset.xOff;
                                    // Beautiful parabolic curve (arched downwards at the edges)
                                    const yOffset = (progress * progress) * 160 + offset.yOff;
                                    // Elegant rotational angling spreading outwards
                                    const rotateZ = progress * 45 + offset.rotOff;
                                    // Physically correct fan layering: center cards on top
                                    const zIndex = Math.round((0.5 - Math.abs(progress)) * 100);

                                    return (
                                      <motion.div
                                        key={`bluebird-dewdrop-${card.name}`}
                                        initial={{ y: 80, opacity: 0, scale: 0.8 }}
                                        animate={{
                                          x: xOffset,
                                          y: yOffset,
                                          rotateZ: rotateZ,
                                          scale: 1,
                                          opacity: 1
                                        }}
                                        whileHover={{
                                          y: yOffset - 35,
                                          scale: 1.18,
                                          rotateZ: rotateZ * 0.2,
                                          zIndex: 200,
                                          transition: { duration: 0.15 }
                                        }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 80,
                                          damping: 15,
                                          delay: idx * 0.02
                                        }}
                                        onClick={() => {
                                          try {
                                            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                                            const osc = ctx.createOscillator();
                                            const gain = ctx.createGain();
                                            osc.connect(gain);
                                            gain.connect(ctx.destination);
                                            osc.type = 'sine';
                                            osc.frequency.setValueAtTime(260 + idx * 10, ctx.currentTime);
                                            gain.gain.setValueAtTime(0.04, ctx.currentTime);
                                            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                                            osc.start();
                                            osc.stop(ctx.currentTime + 0.6);
                                          } catch(e){}
                                          
                                          setSessionCardDrawn(card);
                                        }}
                                        className="absolute w-18 h-30 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border border-sky-500/30 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] transition-all active:scale-95 group/card"
                                        style={{ left: "calc(50% - 2.25rem)", top: "calc(50% - 3.75rem)", transformOrigin: "bottom center", zIndex: zIndex }}
                                      >
                                        <div className="absolute inset-1 border border-sky-500/10 rounded-xl pointer-events-none" />
                                        <div className="absolute inset-1 border border-sky-500/20 rounded-xl flex flex-col items-center justify-center bg-sky-500/5 group-hover/card:bg-sky-500/10 transition-all shadow-inner">
                                          <div className="w-8 h-8 rounded-full border border-sky-500/20 flex items-center justify-center bg-black/40 shadow-md">
                                            <Bird size={14} className="text-sky-400 group-hover/card:scale-110 transition-all shadow-[0_0_8px_rgba(56,189,248,0.6)] animate-pulse" />
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ) : false ? (
                           <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 max-w-4xl mx-auto py-4">
                              {/* Revealed Card */}
                              <motion.div
                                initial={{ rotateY: 180, scale: 0.9, opacity: 0 }}
                                animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                style={{ transform: (sessionCardDrawn as any)?.isReversed ? "rotateZ(180deg)" : "rotateZ(0deg)" }}
                                className="w-full md:w-56 h-80 rounded-[32px] bg-gradient-to-br from-[#071720] to-[#02090c] border-2 border-sky-500/40 relative flex flex-col items-center justify-between p-6 shadow-[0_0_35px_rgba(14,165,233,0.15)] overflow-hidden shrink-0"
                              >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl" />
                                <div className="text-[10px] font-mono font-bold text-sky-400/60 uppercase tracking-widest text-center w-full">Serene Card</div>
                                
                                <div className="text-5xl my-4 text-sky-400 flex items-center justify-center w-20 h-20 rounded-full bg-sky-500/10 border border-sky-500/25">{sessionCardDrawn.emoji}</div>
                                
                                <div className="text-center space-y-2">
                                  <h4 className="text-sm font-bold text-white relative z-10">
                                    {sessionCardDrawn.name}
                                    {(sessionCardDrawn as any)?.isReversed && (
                                      <span className="text-[10px] text-red-400 font-bold ml-1.5 font-mono">(역방향)</span>
                                    )}
                                  </h4>
                                  <p className="text-[10px] text-sky-300 font-medium tracking-tight bg-sky-950/40 px-3 py-1.5 rounded-full inline-block mt-1">{sessionCardDrawn.keyphrase}</p>
                                </div>
                                
                                <p className="text-[9px] text-white/40 leading-relaxed font-sans mt-2 break-keep text-center">{sessionCardDrawn.desc}</p>
                              </motion.div>

                              {/* Energy level & Comfort check */}
                              <div className="flex-1 rounded-[32px] bg-sky-950/10 border border-sky-500/10 p-6 flex flex-col justify-between space-y-6">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-sky-400 animate-pulse" />
                                    <span className="text-[10px] text-sky-300 font-bold uppercase tracking-widest font-mono">Soul Mind Alignment</span>
                                  </div>
                                  <h4 className="text-lg font-bold text-white">마음 피로 수준 체크인</h4>
                                  <p className="text-[11px] text-white/50 leading-relaxed break-keep">
                                    오늘 당신이 지닌 감정의 피로도와 고요지수를 자가 평가하십시오. 파랑새의 치유 엔진이 이를 짚어 처방할 것입니다.
                                  </p>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((lvl) => (
                                      <button
                                        key={lvl}
                                        disabled={sessionLevelCheckedIn}
                                        onClick={() => {
                                          setSessionComfortLevel(lvl);
                                          try {
                                            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                                            const osc = ctx.createOscillator();
                                            const gain = ctx.createGain();
                                            osc.connect(gain);
                                            gain.connect(ctx.destination);
                                            osc.frequency.setValueAtTime(260 + lvl * 50, ctx.currentTime);
                                            gain.gain.setValueAtTime(0.04, ctx.currentTime);
                                            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                                            osc.start();
                                            osc.stop(ctx.currentTime + 0.3);
                                          } catch(e){}
                                        }}
                                        className={`flex-1 py-3 rounded-2xl border transition-all text-xs font-bold font-mono ${
                                          sessionComfortLevel === lvl
                                            ? 'bg-sky-500 border-sky-400 text-black shadow-lg shadow-sky-500/20'
                                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                                        }`}
                                      >
                                        Lv.${lvl}
                                      </button>
                                    ))}
                                  </div>

                                  {!sessionLevelCheckedIn ? (
                                    <button
                                      onClick={() => {
                                        const dateStr = new Date().toLocaleDateString('sv');
                                        localStorage.setItem(`bluebird_daily_level_${dateStr}`, String(sessionComfortLevel));
                                        localStorage.setItem(`bluebird_daily_checked_${dateStr}`, 'true');
                                        setSessionLevelCheckedIn(true);
                                      }}
                                      className="w-full py-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-300 font-bold text-xs transition-all hover:bg-sky-500/20 shadow-xl"
                                    >
                                      정서 에너지 수준 반영하기
                                    </button>
                                  ) : (
                                    <div className="py-2.5 px-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-[10px] text-sky-400 font-bold font-sans text-center">
                                      ✓ 현재의 정서 전위차가 데일리 평온 주파수 필터링 기저에 기록되었습니다.
                                    </div>
                                  )}
                                </div>
                              </div>
                           </div>
                         ) : null}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                         <div className="lg:col-span-2 space-y-8 opacity-100">
                           {false ? (
                             <div className="p-8 rounded-[40px] text-center border-2 border-dashed border-white/10 bg-white/[0.01] text-white/30 text-xs">
                               위 오라클 힐링 카드를 먼저 드로우하여 정서 주파수를 한 번 정렬한 다음 영적 비전을 확인하세요.
                             </div>
                           ) : (
                             <motion.button 
                               whileHover={{ scale: 1.02, translateY: -4 }}
                               whileTap={{ scale: 0.98 }}
                               onClick={handleDailyOracle}
                               disabled={isDailyOracleLoading}
                               className="w-full relative group overflow-hidden rounded-[40px] p-1 glass border border-sky-500/20 disabled:opacity-50"
                             >
                               <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                               <div className="bg-white/5 backdrop-blur-md rounded-[36px] p-8 md:p-12 text-center space-y-6 relative z-10 border border-white/5 group-hover:border-sky-500/30 transition-colors">
                                  <div className="w-20 h-20 mx-auto rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                     {isDailyOracleLoading ? <RefreshCw size={32} className="text-sky-400 animate-spin" /> : <LucideStars size={32} className="text-sky-400" />}
                                  </div>
                                  <div>
                                    <h4 className="text-2xl font-bold font-sans text-white mb-2">Check Daily Vision</h4>
                                    <p className="text-[11px] text-sky-100/40 uppercase tracking-widest font-bold">블루버드가 당신의 마음 상태를 짚어줍니다</p>
                                  </div>
                               </div>
                             </motion.button>
                           )}


                          <AnimatePresence>
                            {dailyResult && (
                              <motion.div 
                                initial={{ opacity: 0, y: 15 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="w-full bg-[#0c0c12]/90 border border-sky-500/30 p-5 sm:p-8 md:p-10 text-left flex flex-col gap-6 rounded-[28px] sm:rounded-[40px] shadow-2xl relative z-10 font-sans mt-4"
                              >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
                                
                                <div className="flex flex-wrap items-end justify-between gap-6 relative z-10 border-b border-sky-500/10 pb-8">
                                   <div className="space-y-2 text-left">
                                     <div className="flex items-center gap-3 mb-4">
                                       <div className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-[10px] text-sky-300 font-bold uppercase tracking-widest">일일 진단 완료</div>
                                       <span className="text-xs text-sky-100/30 font-mono">{new Date().toLocaleDateString()}</span>
                                     </div>
                                     <h4 className="text-3xl font-bold font-sans text-white leading-tight">Divine Diagnostics</h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <TTSButton text={dailyResult.diagnosis} voice="Kore" className="text-sky-400 border-sky-500/20" />
                                    </div>
                                  </div>

                                <div className="text-stone-200 font-sans text-base sm:text-lg leading-loose text-left z-10 relative [&>p]:mb-4 [&>p]:leading-loose">
                                   <Streamdown>{dailyResult.diagnosis}</Streamdown>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-sky-500/10 text-left">
                                   {Object.entries({
                                     Frequency: dailyResult.frequency,
                                     Symbol: dailyResult.symbol,
                                   }).map(([k, v]) => (
                                     <div key={k} className="p-5 md:p-6 rounded-3xl bg-white/[0.03] border border-sky-500/20 backdrop-blur-md">
                                       <p className="text-[9px] text-sky-400/80 uppercase tracking-widest font-bold mb-2">{k}</p>
                                       <p className="text-sm md:text-base font-bold text-stone-100 font-sans">{String(v)}</p>
                                      </div>
                                    ))}
                                  </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="space-y-6">
                           <div className="glass p-8 rounded-[40px] border border-sky-500/20 space-y-4 text-left">
                             <h4 className="text-sm font-bold text-sky-400 font-sans flex items-center gap-2"><Wind size={16}/> Daily Remedy</h4>
                             <p className="text-sm text-sky-100/70 leading-relaxed font-sans">{dailyResult ? dailyResult.remedy : '블루버드 비전을 통해 오늘 하루 마음을 평온하게 할 최적의 액션을 받아보세요.'}</p>
                           </div>
                        </div>
                     </div>
                   </div>
                 </motion.div>
              ) : activeMode === 'simple' ? (
                 <motion.div key="simple" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center pt-24 pb-40">
                    <div className="w-full max-w-2xl glass p-5 md:p-12 rounded-[28px] md:rounded-[64px] border border-sky-500/30 shadow-2xl relative overflow-hidden group">
                       <div className="absolute inset-0 bg-sky-500/10 blur-[100px] rounded-full scale-110 group-hover:scale-125 transition-transform" />
                       <div className="relative z-10 space-y-6 md:space-y-12 text-white">
                          <div className="flex flex-col items-center gap-4 md:gap-6 text-center">
                             <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[32px] bg-sky-500/20 flex items-center justify-center text-sky-400 border border-sky-500/30 shadow-2xl animate-pulse">
                                <Sparkles size={32} className="md:w-10 md:h-10" />
                             </div>
                             <h3 className="text-2xl md:text-5xl font-sans text-white font-bold tracking-tighter text-center">Flux Consultation</h3>
                             <p className="text-[10px] md:text-sm text-sky-500/60 uppercase tracking-[0.25em] md:tracking-[0.4em] font-sans font-black text-center">지친 영혼의 상처를 보듬는 성소</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {[
                               '오늘 너무 힘들었어요', '아무도 나를 이해 못 해요', '미래가 불안해요',
                               '자존감이 낮아졌어요', '관계가 어려워요', '그냥 우울해요',
                               '오늘 아무것도 하지 못했다는 죄책감이 들어요',
                               '타인의 성공을 볼 때마다 내가 초라해 보여요',
                               '과거의 상처가 자꾸 떠올라 괴로워요',
                               '모든 것을 포기하고 싶을 때 어디서 힘을 얻을까요'
                             ].map(q => (
                               <button 
                                 key={q} 
                                 onClick={() => { handleSend(q); setShowChat(true); }} 
                                 className="px-6 py-6 rounded-[28px] bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-sm sm:text-base text-left text-white/80 hover:text-white flex items-start justify-between gap-3 group/btn font-sans font-bold shadow-xl backdrop-blur-md"
                               >
                                  <span className="leading-tight">"{q}"</span>
                                  <ChevronRight size={20} className="mt-0.5 shrink-0 opacity-0 group-hover/btn:opacity-100 transition-all -translate-x-3 group-hover/btn:translate-x-0 text-sky-400" />
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>


                 </motion.div>
              ) : null}
           </AnimatePresence>
        </div>
      </main>

      {/* Floating Chat Interface */}
      <AnimatePresence>
         {showChat && (
            <>
               {/* Click outside to close */}
               <div 
                  className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-sm cursor-pointer"
                  onClick={() => { setShowChat(false); stopTTS(); }}
               />
               <motion.div 
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="fixed inset-0 md:inset-auto md:bottom-28 md:right-8 md:w-[450px] md:h-[650px] md:max-h-[85vh] z-[150] p-4 flex items-center justify-center md:p-0 pointer-events-none"
               >
                  <div 
                     className="w-full h-full max-h-[80vh] md:max-h-full flex flex-col bg-[#0b0b14]/95 md:bg-[#0c0f1d]/90 md:backdrop-blur-3xl rounded-[32px] md:rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto"
                     onClick={(e) => e.stopPropagation()}
                  >
                  
                  <div className="hidden flex items-center justify-between border-b border-white/10 p-6 shrink-0 bg-sky-900/10 relative z-10">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[28px] bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                           <Bird size={24} />
                        </div>
                        <div className="text-left">
                           <h3 className="text-2xl font-display font-bold  text-white tracking-tight">Bluebird Sync Room</h3>
                           <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-sans">평화로운 대화와 치유의 성소</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            playConversation(messages, 'Kore', 'Kore');
                          }} 
                          title="전체 대화 읽기"
                          className="relative p-4 rounded-full hover:bg-white/5 text-white/20 hover:text-sky-400 transition-all"
                        >
                          <Volume2 size={24}/>
                        </button>
                        <button onClick={() => { setShowChat(false); stopTTS(); }} className="relative p-4 rounded-full hover:bg-white/5 text-white/20 transition-all">
                          <X size={24}/>
                        </button>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 flex flex-col bg-slate-950/20 relative min-h-0 z-10 scroll-smooth premium-scroll">
                     {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20">
                           <Bird size={48} className="text-sky-400 animate-pulse" />
                           <p className="text-lg font-sans text-white">"블루버드가 당신의 이야기에 귀를 기울이고 있습니다..."</p>
                        </div>
                      )}
                     {messages.map((m, i) => (
                         <div key={m.id || i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                            <div className={`max-w-[85%] rounded-[24px] px-6 py-4 ${
                              m.role === 'user' 
                                ? 'bg-sky-600 text-white rounded-br-none shadow-lg shadow-sky-500/20' 
                                : 'bg-white/5 border border-white/10 text-sky-50 rounded-bl-none'
                            }`}>
                              {m.role === 'user' ? (
                                <p className="whitespace-pre-wrap font-sans leading-relaxed text-[15px]">{m.content}</p>
                              ) : (
                                <Streamdown>{m.content}</Streamdown>
                              )}
                            </div>
                            {m.role !== 'user' && (
                               <TTSButton text={m.content} voice="Kore" className="shrink-0 mb-1" />
                            )}
                         </div>
                      ))}
                     <div ref={chatEndRef} className="h-4" />
                  </div>

                  <div className="p-4 border-t border-white/10 shrink-0 bg-white/5 backdrop-blur-md z-50 flex flex-col gap-4 relative">
                                           <AnimatePresence>
                                             {poeInsight && (
                                               <motion.div
                                                 initial={{ opacity: 0, y: 10 }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 exit={{ opacity: 0, y: 10 }}
                                                 className="mx-2 bg-sky-900/40 border border-sky-500/20 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300"
                                               >
                                                 <div 
                                                   onClick={() => setIsInsightCollapsed(!isInsightCollapsed)}
                                                   className="p-4 flex items-center justify-between cursor-pointer hover:bg-sky-500/5 active:bg-sky-500/10 transition-colors select-none"
                                                 >
                                                   <div className="flex items-center gap-3">
                                                     <Sparkles size={16} className="text-sky-400 animate-pulse" />
                                                     <div className="text-[10px] font-bold text-sky-300 uppercase tracking-widest font-mono">
                                                       {poeInsight.category} • 실시간 영적 통찰
                                                     </div>
                                                   </div>
                                                   <div className="flex items-center gap-2">
                                                     <span className="text-[10px] text-sky-300/60 font-sans">
                                                       {isInsightCollapsed ? "펼치기" : "접기"}
                                                     </span>
                                                     <ChevronDown 
                                                       size={14} 
                                                       className={`text-sky-400 transition-transform duration-300 ${isInsightCollapsed ? "" : "rotate-180"}`} 
                                                     />
                                                   </div>
                                                 </div>
                                                 
                                                 {!isInsightCollapsed && (
                                                   <div className="px-4 pb-4 pt-0 text-sm text-white/80 leading-relaxed border-t border-sky-500/10 font-sans">
                                                     {poeInsight.insight}
                                                   </div>
                                                 )}
                                               </motion.div>
                                             )}
                                           </AnimatePresence>
                     <div 
                        onWheel={(e) => {
                          if (e.currentTarget) {
                            const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
                            e.currentTarget.scrollLeft += delta * 1.5;
                          }
                        }}
                        className="flex items-center gap-2 overflow-x-auto select-none px-2 pb-2 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(56,189,248,0.3)_transparent]"
                      >
                        <button
                          type="button"
                          onClick={handleRefreshBluebirdSuggestions}
                          className="flex-none p-2 rounded-full bg-white/5 border border-sky-500/10 text-sky-400/80 hover:text-sky-300 hover:bg-sky-500/15 transition-all shadow-md active:scale-95 cursor-pointer"
                          title="다른 평화 질문 보기"
                        >
                          <RefreshCw size={11} className="animate-pulse" />
                        </button>
                        {bluebirdSuggestions.map((s, i) => (
                          <button key={i} onClick={() => setChatInput(s)} className="flex-none px-4 py-2 rounded-2xl bg-white/5 border border-sky-500/10 text-xs text-sky-400 hover:bg-sky-500/10 transition-all font-sans whitespace-nowrap">
                             {s}
                          </button>
                        ))}
                     </div>
                     <div className="relative group p-2 bg-white/10 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl focus-within:border-sky-500/50 transition-all flex items-center pr-16 pl-3">
                        <button 
                           onClick={() => playConversation(messages, 'Kore', 'Kore')} 
                           title={isTTSActive ? "재생 멈추기" : "전체 대화 듣기"}
                           className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-sky-400 hover:bg-white/5 transition-all shrink-0 mr-1"
                        >
                           {isTTSActive ? <VolumeX size={18} className="text-sky-400 animate-pulse" /> : <Volume2 size={18} className="text-sky-400" />}
                        </button>
                        <input 
                           value={chatInput} 
                           onChange={e => setChatInput(e.target.value)} 
                           onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                           placeholder="마음의 울림을 전하세요..."
                           className="w-full h-14 bg-transparent pl-2 pr-16 text-sm text-white focus:outline-none font-sans placeholder:text-white/20"
                        />
                        <button onClick={() => handleSend()} disabled={isSending} className="absolute right-2 top-2 w-12 h-12 rounded-[24px] bg-sky-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-500/20 disabled:opacity-30">
                           {isSending ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} className="translate-x-0.5 -translate-y-0.5" />}
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          </>
         )}
      </AnimatePresence>

        

      <NoticeModal isOpen={notice.open} onClose={() => setNotice(p => ({ ...p, open: false }))} title={notice.title} message={notice.message} />

      {/* showSoulMirror Modal Removed. Soul Mirror consolidated to Epilogue Library */}

      <AnimatePresence>
        {limitModalInfo && limitModalInfo.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 z-[9999]"
            onClick={() => setLimitModalInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 70, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 70, opacity: 0 }}
              transition={{ type: "spring", stiffness: 75, damping: 18 }}
              className="glass p-8 max-w-md w-full rounded-[40px] border border-yellow-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/4 animate-pulse" />
              <button
                onClick={() => setLimitModalInfo(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X size={18} />
              </button>
              
              <div className="mx-auto w-16 h-16 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <Lock className="text-yellow-400 animate-pulse" size={28} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-sans text-white">Daily Connection Locked</h3>
                <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-[0.2em]">{limitModalInfo.type === 'daily' ? '오늘의 데일리 오라클 완료' : '오늘의 소울 분석 완료'}</p>
              </div>

              <p className="text-sm text-white/60 leading-relaxed font-sans break-keep">
                이 댑의 {limitModalInfo.type === 'daily' ? '데일리 비전' : '소울 분석'} 기능은 하루에 한 번만 실행할 수 있습니다. 이미 오늘의 주파수가 우주와 동조되었습니다. 에필로그에서 이전의 찬란했던 동조 기록들을 살펴보세요.
              </p>

              <button
                onClick={() => {
                  setLimitModalInfo(null);
                  navigate('/epilogue');
                }}
                className="w-full py-4 rounded-[20px] bg-yellow-500/20 text-yellow-400 font-black uppercase tracking-[0.2em] border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:bg-yellow-500/30 active:scale-95 transition-all text-xs"
              >
                Go to Epilogue 🧪
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
