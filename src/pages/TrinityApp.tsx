import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useDeferredValue,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Send,
  Volume2,
  VolumeX,
  Star,
  Moon,
  Sun,
  RefreshCw,
  RotateCw,
  RotateCcw,
  ChevronDown,
  Zap,
  Eye,
  MessageCircle,
  ImageIcon,
  BarChart2,
  Copy,
  Check,
  X,
  Shuffle,
  History,
  LayoutGrid,
  Brain,
  Users,
  ChevronLeft,
  ChevronRight,
  Activity,
  Music,
  TreeDeciduous,
  Bird,
  Home,
  Settings,
  ShieldCheck,
  Database,
  Stars as LucideStars,
  User,
  Layout,
  Palette,
  Library,
  Wind,
  Heart,
  Feather,
  Layers,
  Link,
  BookOpen,
  Camera,
  Wand2,
  Headphones,
  FileText,
  Compass,
  Flame,
  Coins,
  Lock,
  Trash2,
  ZoomIn,
} from "lucide-react";
import { useLocation } from "wouter";
import { useApp, getPersistentUserProfile, setPersistentUserProfile } from "@/contexts/AppContext";
import { mergeUserProfiles, type UserProfile } from "@/lib/sharedState";
import { calculateDetailedSaju } from "@/lib/sajuAnalysis";
import { trpc } from "@/lib/trpc";
import {
  invokeLLM,
  invokeLLMStream,
  invokeLLMStructured,
  PERSONAS,
  textToSpeech,
  poeQuickInsight,
  buildDeepSynapseContext,

} from "@/lib/ai";
import { playRawPCM } from "@/lib/audio";
import { recordPrismFeature, recordDailyOracleResult } from "@/lib/prismOmniSync";
import { Streamdown } from "@/components/Streamdown";
import { TTSButton } from "@/components/TTSButton";
import { CalendarView } from "@/components/CalendarView";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import NoticeModal from "@/components/NoticeModal";

import { TarotBible } from "@/components/trinity/TarotBible";
import { TrinityDestinyReportView } from "@/components/trinity/TrinityDestinyReportView";
import { TrinityOracleSection } from "@/components/trinity/TrinityOracleSection";
import { TrinitySynergySection } from "@/components/trinity/TrinitySynergySection";
import { AcimHandbookModal } from "@/components/trinity/AcimHandbookModal";
import { useBinauralBeat } from "@/hooks/useBinauralBeat";
import { TarotSpread } from "@/components/trinity/TarotSpread";
import { TarotSpreadSelectionModal } from "@/components/trinity/TarotSpreadSelectionModal";
import { TarotCardBackCustomizerModal } from "@/components/trinity/TarotCardBackCustomizerModal";
import { PhysicalTarotInputModal } from "@/components/trinity/PhysicalTarotInputModal";
import { useTarotCardBack } from "@/hooks/useTarotCardBack";
import { useSwipeableTabs } from "@/hooks/useSwipeableTabs";
import { playAudioHaptic, playAiResultNotification } from "@/lib/audioHaptics";
import { TodayTarotNarrationModal } from "@/components/trinity/TodayTarotNarrationModal";
import { LucyTarotAdviceCard } from "@/components/trinity/LucyTarotAdviceCard";
import { TarotSummaryGraphicCard } from "@/components/trinity/TarotSummaryGraphicCard";
import { TodayTarotShareButton } from "@/components/trinity/TodayTarotShareModal";
import { TarotCardZoomModal } from "@/components/trinity/TarotCardZoomModal";
import { TarotFlippingCard } from "@/components/trinity/TarotFlippingCard";
import { FollowUpTarotTimeline, FollowUpTarotEntry } from "@/components/trinity/FollowUpTarotTimeline";
import { FollowUpTarotInputBar } from "@/components/trinity/FollowUpTarotInputBar";
import { triggerTarotScreenVibration } from "@/utils/tarotEffects";
import { TarotCard, TAROT_DECK, getTarotCardImageUrl } from "@/data/tarotData";
import { shuffleCardDeck } from "@/lib/cardShuffle";
import { playTTS, playTTSInChunks, splitSpeechIntoChunks, playConversation, stopTTS, useTTSActive, useTTSState, prefetchTTS, prepareNaturalSpeechText } from "@/utils/tts";
import { z } from "zod";
import {
  getTodayDateKey,
  pickDailySeededItem,
  findTodayOracleInSources,
  resolveOracleVisionResult,
  isTimestampToday,
  markDailyAutoRan,
  getDailyAutoRanKey,
  getTrinityDailyResultKey,
  markOracleModalSeen,
} from "@/lib/dailyCache";
import { useScrollToTopOnChange } from "@/hooks/useScrollToTopOnChange";
import { resetAppScroll } from "@/utils/scrollToTop";
import { LucKeyLogoText } from "@/components/LucKeyLogoText";
import { openChannelIntro } from "@/components/common/ChannelIntroModal";
import { useDailyOracleFirstVisit } from "@/hooks/useDailyOracleFirstVisit";
import {
  buildOracleDeepInsightSystemContext,
  buildOracleDeepInsightUserMessage,
  type OracleDeepInsightSendOpts,
} from "@/lib/oracleDeepInsight";
import { DailyOracleLoadingOverlay } from "@/components/DailyOracleLoadingOverlay";
import { useSmartScroll } from "@/hooks/useSmartScroll";
import { SmartScrollResumeButton } from "@/components/common/SmartScrollResumeButton";
import { TTSHighlightText } from "@/utils/ttsHighlight";

const EnergyAnalysisSchema = z.object({
  luckScore: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "string" ? parseFloat(v) : v)),
  loveScore: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "string" ? parseFloat(v) : v)),
  wealthScore: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "string" ? parseFloat(v) : v)),
  healthScore: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "string" ? parseFloat(v) : v)),
  luckyColor: z.string().optional(),
  luckyNumber: z
    .union([z.string(), z.number()])
    .transform((v) => String(v))
    .optional(),
  luckyItem: z.string().optional(),
  cosmicAspect: z.string().optional(),
  deepSyncLevel: z.string().optional(),
  guidance: z.string(),
});

import { buildSpecificTarotDailyOracle, getTarotCardDetails } from '@/lib/dailyTarotOracle';
import { getCardSoulBlessing } from '@/lib/tarotBlessings';

function buildLocalTrinityDailyOracle(card: any, mode: string = "oracle") {
  if (card && (card.id || card.nameKo || card.name)) {
    return buildSpecificTarotDailyOracle(card, mode);
  }
  const cardName = card?.nameKo || card?.name || "우주의 조율자";
  const cardEn = card?.name || "";
  const cardType = card?.type === "major" ? "메이저 아르카나" : "마이너 아르카나";
  const keywords = (card?.keywords || []).join(", ") || "직관, 통찰, 균형";
  const isReversed = !!card?.reversed;
  const orientation = isReversed ? "역방향 (Reversed)" : "정방향 (Upright)";

  const diagnosis = `### 🕯️ 1. 카드가 비추는 당신의 마음과 현재 에너지
오늘 하루는 **${keywords}**의 에너지가 중심 흐름을 이끕니다. 서두르지 말고 자신의 페이스를 편안하게 유지하며 내면의 직관에 귀를 기울이세요.

### 🎴 2. 펼쳐진 카드들이 들려주는 이야기 (카드 상징과 본래 뜻 해독)
오늘 모습을 드러낸 카드는 **[${cardName}${cardEn ? ` (${cardEn})` : ''}] (${orientation})**입니다. ${cardType}의 고유한 도상 상징과 본래 뜻이 당신의 일상과 선택의 갈림길을 온화하게 비추고 있습니다.

### 🔮 3. 트리니티 마스터의 직관적 결단 & 방향성
**[${isReversed ? '신중한 내실 다지기 & 점검 필요' : '자신감 있는 실행 & 적극적인 전진'}]**
${isReversed ? '지금은 서두르기보다 주변 상황을 면밀히 살피고 내면의 안정을 우선하는 것이 현명한 선택입니다.' : '망설이지 말고 마음속에 품어온 긍정적인 계획을 향해 당당히 한 걸음 내딛으십시오.'}

### 🌿 4. 운의 흐름을 바꿀 마스터의 실천 처방 (개운 가이드)
- **오늘의 핵심 실천**: 물 한 잔을 마시며 깊은 심호흡 3번으로 머릿속을 맑게 비우고 마음의 중심 잡기
- **주의할 점**: 사소한 일이나 타인의 말에 감정을 소모하지 않기

### ✨ 5. 당신의 길을 축복하는 영혼의 한마디
> _"${getCardSoulBlessing(card)}"_`;

  return {
    diagnosis,
    luckyNumber: "7",
    luckyColor: "황금빛 골드 (Celestial Gold)",
    remedy: `오늘 하루, [${cardName}] 카드의 조화로운 에너지를 기억하며 가볍게 심호흡하기`,
    symbol: card?.keywords?.[0] || "운명의 빛",
    frequency: "528Hz",
    spiritualEnergy: `[${cardName}] 카드가 오늘 하루 당신에게 든든한 안정감과 명료함을 선사합니다.`,
    blessingMessage: `오늘 하루 당신의 모든 발걸음 위에 [${cardName}] 카드의 밝은 행운이 함께하길 축복합니다.`,
    focusPlaylist: "528Hz Solfeggio Resonance",
  };
}

const QuickInsightSchema = z.object({
  diagnosis: z.string().default("오늘 하루 당신의 에너지는 맑고 평온한 균형을 향해 나아가고 있습니다."),
  luckyNumber: z.union([z.string(), z.number()]).transform((v) => String(v)).optional().default("7"),
  luckyColor: z.string().optional().default("황금빛 골드"),
  remedy: z.string().optional().default("마음의 중심을 잡고 깊은 호흡으로 하루를 시작하기"),
  symbol: z.string().optional().default("운명의 수레바퀴"),
  frequency: z.union([z.string(), z.number()]).transform((v) => String(v)).optional().default("528Hz"),
  spiritualEnergy: z
    .string()
    .describe("현재 사용자에게 가장 필요한 영적 에너지에 대한 심층 분석")
    .optional()
    .default("우주의 주파수가 당신의 내면과 공명하여 깊은 직관과 통찰을 깨웁니다."),
  blessingMessage: z
    .string()
    .describe(
      "운명을 비추는 빛처럼 사용자를 위한 긍정적이고 따뜻한 축복 메시지",
    )
    .optional()
    .default("당신이 내딛는 모든 발걸음에 우주의 은총과 평온이 함께하기를 축복합니다."),
});

import {
  calcSaju,
  calcAstro,
  parseAstro,
  drawCards,
  LUCKY_EXAMPLES,
  analyzeTarotConcern,
  getTarotThemeMeta,
  getTarotRecommendationReason,
  isDailyTarotConcern,
  buildSpreadForTheme,
  buildLocalTarotReading,
  buildTarotBinaryChoicePromptAddon,
  buildTarotSpreadPromptAddon,
  buildTarotContextPromptAddon,
  isTarotStreamFailure,
  ensureCompleteTarotReading,
  POPULAR_TAROT_SPREAD_PRESETS,
  type TarotSpreadRecommendation,
  type TarotConcernAnalysis,
  type TarotConcernKind,
} from "@/lib/trinity/utils";
import { buildSpreadTailoredReadingGuide } from "@/lib/trinity/spreadStructures";
import {
  auth,
  db,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  getDocs,
  limit,
  doc,
  getDoc,
  setDoc,
} from "@/lib/firebase";
import { InsightCharts } from "@/components/trinity/InsightCharts";
import {
  SPECIAL_FEATURE_CHROME_HIDDEN_CLASS,
  SpecialFeatureOverlay,
  SpecialFeaturePanel,
  useSpecialFeatureChromeHidden,
} from '@/components/SpecialFeaturePanel';

const THEME_COLOR = "oklch(0.85 0.15 90)";
const BG = "oklch(0.10 0.02 60)";

type Stage =
  | "analysis"
  | "daily"
  | "vision"
  | "stat"
  | "lucy_chat"
  | "daily_oracle"
  | "lucy_room"
  | "history"
  | "memory"
  | "relation"
  | "simple"
  | "landing"
  | "onboarding"
  | "soul";

interface ProfileForm {
  name: string;
  birthdate: string;
  birthtime: string;
  gender: string;
  nickname: string;
  city: string;
}

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  emotion?: string;
  timestamp: number;
}
interface Memory {
  memorySummary: string;
  relationships: Array<{ name: string; description: string; pattern?: string }>;
  userPreferences: string;
  currentVibe: string;
}
interface HistoryItem {
  id: string;
  type: string;
  createdAt: number;
  text?: string;
  content?: string;
  cards?: TarotCard[];
  sajuData?: string;
  data?: any;
  metadata?: any;
}

const TYPE_LABELS: Record<string, string> = {
  energy_analysis: "에너지 분석",
  vision_reading: "비전 리딩",
  daily_reading: "오늘의 조언",
  oracle: "운명 오라클",
  "oracle-vision": "오라클 비전",
  lucy_chat: "루시 대화",
};



const TarotCardIcon = ({
  size = 24,
  className = "",
}: {
  size?: number | string;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect
      x="3"
      y="1"
      width="14"
      height="20"
      rx="2"
      ry="2"
      transform="rotate(-6 10 11)"
      opacity="0.3"
    />
    <rect
      x="5"
      y="2"
      width="14"
      height="20"
      rx="2"
      ry="2"
      fill="currentColor"
      fillOpacity="0.05"
    />
    <rect
      x="7"
      y="4"
      width="10"
      height="16"
      rx="1"
      ry="1"
      strokeWidth="1"
      strokeOpacity="0.6"
    />
    <path
      d="M12 6 L13.5 9.5 L17 11 L13.5 12.5 L12 16 L10.5 12.5 L7 11 L10.5 9.5 Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <circle cx="12" cy="11" r="1.5" fill="currentColor" />
    <path d="M9 17 H15" strokeWidth="1" strokeOpacity="0.6" />
  </svg>
);

// High-dimension Trinity Aura Oracle Cards restored to 22 Major Tarot Cards for Daily Oracle
export const TRINITY_CARDS: TarotCard[] = TAROT_DECK.filter(c => c.type === "major");

const getTarotCardVisual = (card: TarotCard | null | undefined) => {
  if (!card) {
    return { icon: Sparkles, color: "text-yellow-400" };
  }

  if (card.id && card.id.startsWith("trinity_")) {
    switch (card.id) {
      case "trinity_01_source": return { icon: Eye, color: "text-indigo-400" };
      case "trinity_02_geometry": return { icon: RefreshCw, color: "text-cyan-400" };
      case "trinity_03_ascension": return { icon: Sparkles, color: "text-yellow-400" };
      case "trinity_04_mirror": return { icon: Activity, color: "text-zinc-400" };
      case "trinity_05_logos": return { icon: Sun, color: "text-amber-400" };
      case "trinity_06_alignment": return { icon: Compass, color: "text-yellow-400" };
      case "trinity_07_eye": return { icon: Eye, color: "text-purple-400" };
      case "trinity_08_shaman": return { icon: Sparkles, color: "text-rose-400" };
      case "trinity_09_cube": return { icon: ShieldCheck, color: "text-blue-400" };
      case "trinity_10_trinity": return { icon: Sparkles, color: "text-yellow-500" };
      default: return { icon: Sparkles, color: "text-yellow-400" };
    }
  }

  if (card.id) {
    if (card.id.startsWith("wands_")) {
      return { icon: Flame, color: "text-amber-500" };
    }
    if (card.id.startsWith("cups_")) {
      return { icon: Heart, color: "text-blue-400" };
    }
    if (card.id.startsWith("swords_")) {
      return { icon: Wind, color: "text-purple-450" };
    }
    if (card.id.startsWith("pent_")) {
      return { icon: Coins, color: "text-yellow-400" };
    }
  }

  switch (card.id) {
    case "major_0": return { icon: Eye, color: "text-zinc-400" }; // The Fool
    case "major_1": return { icon: Sparkles, color: "text-amber-400" }; // The Magician
    case "major_2": return { icon: Eye, color: "text-indigo-400" }; // The High Priestess
    case "major_3": return { icon: Heart, color: "text-rose-400" }; // The Empress
    case "major_4": return { icon: ShieldCheck, color: "text-yellow-500" }; // The Emperor
    case "major_5": return { icon: BookOpen, color: "text-blue-400" }; // The Hierophant
    case "major_6": return { icon: Heart, color: "text-pink-400" }; // The Lovers
    case "major_7": return { icon: Zap, color: "text-yellow-400" }; // The Chariot
    case "major_8": return { icon: ShieldCheck, color: "text-amber-500" }; // Strength
    case "major_9": return { icon: Eye, color: "text-amber-400" }; // The Hermit
    case "major_10": return { icon: RefreshCw, color: "text-cyan-400" }; // Wheel of Fortune
    case "major_11": return { icon: Activity, color: "text-yellow-400" }; // Justice
    case "major_12": return { icon: RefreshCw, color: "text-violet-400" }; // The Hanged Man
    case "major_13": return { icon: Activity, color: "text-purple-600" }; // Death
    case "major_14": return { icon: Wind, color: "text-cyan-300" }; // Temperance
    case "major_15": return { icon: Zap, color: "text-red-500" }; // The Devil
    case "major_16": return { icon: Zap, color: "text-orange-500" }; // The Tower
    case "major_17": return { icon: Star, color: "text-yellow-300" }; // The Star
    case "major_18": return { icon: Moon, color: "text-blue-300" }; // The Moon
    case "major_19": return { icon: Sun, color: "text-orange-400" }; // The Sun
    case "major_20": return { icon: Sparkles, color: "text-purple-400" }; // Judgement
    case "major_21": return { icon: Sparkles, color: "text-indigo-500" }; // The World
    default: return { icon: Sparkles, color: "text-yellow-400" };
  }
};

function StatBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="w-full min-w-0">
      <div className="flex justify-between gap-2 text-[10px] mb-1.5 px-1 uppercase tracking-widest font-bold text-white/30">
        <span className="min-w-0 break-words">{label}</span>
        <span style={{ color }} className="shrink-0">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

// --- Modal Components ---

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 glass backdrop-blur-3xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-lg glass border border-white/10 rounded-[48px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-3 text-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar scroll-smooth">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LucyMemoryModal({
  isOpen,
  onClose,
  memory,
}: {
  isOpen: boolean;
  onClose: () => void;
  memory?: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Soul Memory">
      <div className="space-y-4">
        <div className="p-8 rounded-[32px] bg-yellow-500/5 border border-yellow-500/10">
          <h4 className="text-[10px] font-bold text-white/20 mb-4 uppercase tracking-widest flex items-center gap-2">
            <Database size={14} /> Universe Context
          </h4>
          <p className="text-sm text-white/50 leading-relaxed font-sans">
            {memory || "전체 유니버스의 공명이 아직 동기화되지 않았습니다."}
          </p>
        </div>
        <p className="text-[10px] text-white/20  text-center">
          트리니티는 당신의 운명과 이전 대화의 큰 흐름을 이 컨텍스트에 담아
          관리합니다.
        </p>
      </div>
    </Modal>
  );
}

function LucyRelationshipsModal({
  isOpen,
  onClose,
  sajuData,
  astroCard,
}: {
  isOpen: boolean;
  onClose: () => void;
  sajuData?: string;
  astroCard?: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Relationship Resonance">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-6 rounded-[32px] bg-indigo-500/5 border border-indigo-500/10 text-center">
            <p className="text-[10px] text-white/40 uppercase mb-2">Harmony</p>
            <p className="text-2xl font-display text-indigo-400">88%</p>
          </div>
          <div className="p-6 rounded-[32px] bg-indigo-500/5 border border-indigo-500/10 text-center">
            <p className="text-[10px] text-white/40 uppercase mb-2">
              Attraction
            </p>
            <p className="text-2xl font-display text-indigo-400">High</p>
          </div>
        </div>
        <div className="p-8 rounded-[40px] bg-indigo-500/5 border border-indigo-500/10">
          <div className="flex items-center gap-3 mb-6">
            <Users size={18} className="text-indigo-400" />
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              인연의 주파수
            </span>
          </div>
          <div className="space-y-5 font-sans">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/30">사주 오행 조화</span>
              <span className="text-indigo-400 font-bold">
                {sajuData ? "동기화 완료" : "데이터 분석 중"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/30">점성학적 끌림</span>
              <span className="text-indigo-400 font-bold">
                {astroCard ? "활성 상태" : "관찰 중"}
              </span>
            </div>
            <div className="h-[1px] bg-indigo-500/10" />
            <p className="text-[13px] text-white/70 leading-relaxed">
              "현재 당신의 에너지는 따뜻하고 포용적인 기운을 가진 인연과 강하게
              반응합니다. 갈등보다는 이해를 선택하는 시기입니다."
            </p>
          </div>
        </div>
        <p className="text-[10px] text-white/20  text-center">
          루시는 당신의 타고난 기운과 하늘의 지도를 대조하여 인연의 결을
          읽어냅니다.
        </p>
      </div>
    </Modal>
  );
}

function LucyHistoryModal({
  isOpen,
  onClose,
  localHistory,
}: {
  isOpen: boolean;
  onClose: () => void;
  localHistory: any[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filteredHistory = useMemo(() => {
    if (!selectedDate) return localHistory;
    return localHistory.filter((h) => {
      const d = new Date(h.createdAt);
      return (
        d.getDate() === selectedDate.getDate() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [localHistory, selectedDate]);

  const highlightDates = useMemo(() => {
    return localHistory.map((h) => new Date(h.createdAt));
  }, [localHistory]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="The Chronicle of Destiny">
      <div className="space-y-8">
        <CalendarView
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
          highlightDates={highlightDates}
          color={THEME_COLOR}
        />

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
              {selectedDate
                ? `${selectedDate.toLocaleDateString()} 기록`
                : "최근 영적 흔적"}
            </h4>
            {selectedDate && (
              <span className="text-[10px] text-yellow-400/60 font-mono ">
                {filteredHistory.length} logs
              </span>
            )}
          </div>

          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <p className="border border-dashed border-white/5 rounded-[32px] p-12 text-center text-white/20 text-xs  font-sans">
                {selectedDate
                  ? "이 날짜의 기록이 없습니다."
                  : "아직 새겨진 역사가 없습니다."}
              </p>
            ) : (
              filteredHistory.slice(0, 10).map((h, i) => (
                <div
                  key={h.id || `hist-${i}`}
                  className="p-6 rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-yellow-500/20 transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black text-yellow-500/60 uppercase tracking-[0.2em] bg-yellow-500/5 px-2.5 py-1 rounded-lg border border-yellow-500/10">
                      {TYPE_LABELS[h.type] ||
                        h.type?.replace("_", " ") ||
                        "기록"}
                    </span>
                    <span className="text-[9px] text-white/20 font-mono ">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[13px] text-white/70 font-sans leading-relaxed whitespace-pre-wrap ">
                    {h.text || h.content || "운명 분석 완료"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function NoticeBox({
  title,
  message,
  color = "#facc15",
}: {
  title: string;
  message: string;
  color?: string;
}) {
  return (
    <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/5 space-y-2">
      <h4
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color }}
      >
        {title}
      </h4>
      <p className="text-xs text-white/40 leading-relaxed">{message}</p>
    </div>
  );
}

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
    'indigo': '남색 (인디고)',
    'red': '붉은 적색',
    'orange': '오렌지 주황색',
    'yellow': '황금 노란색',
    'green': '초록 녹색',
    'purple': '보랏빛 자색',
    'pink': '분홍빛 홍색',
    'violet': '제비꽃색',
    'gold': '황금색',
    'white': '순백색',
    'black': '칠흑색',
    'magenta': '진홍색 (마젠타)',
    'stable': '안정화 상태',
    'high': '고공 공명',
    'resonance': '공명 상태',
    'amethyst': '자수정',
    'ruby': '루비',
    'emerald': '에메랄드',
    'diamond': '다이아몬드',
    'obsidian': '흑요석 (옵시디언)',
    'stone': '에너지 원석',
    'ring': '공명 반지',
    'bell': '정화 청동종',
    'candle': '아로마 촛불',
    'incense': '치유 인센스 스ティック',
    'potion': '에너지 비약',
    'scroll': '고대 성서 레시피',
    'key': '통합의 열쇠',
    'emerald green': '에메랄드 녹색',
    'ruby red': '루비 적색'
  };
  const lower = val.toLowerCase().trim();
  if (lower.endsWith('.')) {
    const withoutDot = lower.slice(0, -1).trim();
    if (dict[withoutDot]) return dict[withoutDot];
  }
  if (dict[lower]) return dict[lower];
  return val;
};

function getInitialTrinityDailyResult(uid?: string) {
  try {
    const today = getTodayDateKey();
    const candidateKeys = [
      `trinity_daily_result_${uid || "guest"}_${today}`,
      `trinity_daily_result_guest_${today}`,
      `prism_daily_oracle_trinity_${today}`,
    ];
    for (const key of candidateKeys) {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.diagnosis || parsed?.summary || parsed?.prescription) {
          if (parsed.dateKey && parsed.dateKey !== today) continue;
          return parsed;
        }
      }
    }
  } catch (_) {}
  return null;
}

/**
 * 🚫 타로 결과 음성 낭독 및 본문 표시 시 후행 요약 블록 깔끔하게 정리 & 핵심 3줄 요약 추출 유틸리티
 */
import { stripSummaryFromTarotText, extractConciseSummary, deduplicateReadingText } from '@/lib/tarotSummaryUtils';
export { stripSummaryFromTarotText, extractConciseSummary, deduplicateReadingText };

export default function TrinityApp() {
  const [, navigate] = useLocation();
  const isTTSActive = useTTSActive();
  const ttsState = useTTSState();
  const { firebaseUser, sharedState, updateSharedState, isChatOpen, setIsChatOpen, sendUnifiedMessage, openLucyChat, personaMessages, isGenerating } = useApp();
  const lucyMessages = personaMessages.lucy || [];
  const isSpecialFeatureChromeHidden = useSpecialFeatureChromeHidden();
  const { isCurrentAppPlaying: isBinauralPlaying, toggle: toggleBinaural } = useBinauralBeat('trinity');

  const [activeDailyMode, setActiveDailyMode] = useState<
    "oracle" | "refine" | "combine"
  >("refine");
  const [dailyMode, setDailyMode] = useState<string>("analyze");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<
    "simple" | "daily" | "destiny" | "soul" | "bible" | "history" | "tarot" | "synergy" | "oracle"
  >(() => {
    if (typeof window !== 'undefined') {
      const urlTab = new URLSearchParams(window.location.search).get('tab');
      const sessionTab = sessionStorage.getItem('prism_target_tab');
      const rawTab = urlTab || sessionTab;
      const tab = rawTab === 'daily' ? 'destiny' :
                  rawTab === 'fusion' ? 'oracle' :
                  (rawTab === 'wealth' || rawTab === 'relationship') ? 'tarot' : rawTab;
      if (tab === 'destiny' || tab === 'oracle' || tab === 'tarot' || tab === 'synergy') {
        sessionStorage.removeItem('prism_target_tab');
        return tab as any;
      }
    }
    return 'destiny';
  });
  useScrollToTopOnChange([activeMode]);

  // 🎯 토스된 글자가 있을 경우 타로 고민 입력 및 가상 카드 모드 즉각 활성화
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (activeMode === 'tarot') {
      const autoText = sessionStorage.getItem('prism_auto_execute_text');
      if (autoText && autoText.trim().length >= 2) {
        sessionStorage.removeItem('prism_auto_execute_text');
        setTarotConcern(autoText.trim());
        setTarotVirtualMode(true);
      }
    }
  }, [activeMode]);
  const [lastNonTarotMode, setLastNonTarotMode] = useState<string>("destiny");
  useEffect(() => {
    if (activeMode !== "tarot") {
      setLastNonTarotMode(activeMode);
    }
  }, [activeMode]);

  const [lastNonDailyMode, setLastNonDailyMode] = useState<string>("tarot");
  useEffect(() => {
    if (activeMode !== "daily" && activeMode !== "destiny") {
      setLastNonDailyMode(activeMode);
    }
  }, [activeMode]);

  useEffect(() => {
    const applyTargetTab = (rawTab: string | null | undefined) => {
      if (!rawTab) return;
      const tab = rawTab === 'daily' ? 'destiny' :
                  rawTab === 'fusion' ? 'oracle' :
                  (rawTab === 'wealth' || rawTab === 'relationship') ? 'tarot' : rawTab;
      if (tab === 'destiny' || tab === 'oracle' || tab === 'tarot' || tab === 'synergy') {
        setActiveMode(tab as any);
        setShowDailyModal(false);
        setShowTarot(false);
        resetAppScroll();
        sessionStorage.removeItem('prism_target_tab');
      }
    };

    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.tab === 'tarot' && customEvent.detail?.focusDaily) {
        sessionStorage.setItem('prism_tarot_focus_daily', 'true');
      }
      applyTargetTab(customEvent.detail?.tab);
    };

    const handleNavClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const path = customEvent.detail?.path || '';
      if (path.startsWith('/trinity')) {
        let tab = customEvent.detail?.tab;
        if (!tab && path.includes('?')) {
          try {
            const url = new URL(path, 'http://localhost');
            tab = url.searchParams.get('tab');
          } catch (_) {}
        }
        if (tab) {
          applyTargetTab(tab);
        } else if (path === '/trinity') {
          setActiveMode('destiny');
          setShowDailyModal(false);
          setShowTarot(false);
          resetAppScroll();
        }
      }
    };

    window.addEventListener('prism-tab-change', handleTabChange);
    window.addEventListener('nav-click-active', handleNavClick);
    return () => {
      window.removeEventListener('prism-tab-change', handleTabChange);
      window.removeEventListener('nav-click-active', handleNavClick);
    };
  }, []);
  const [stage, setStage] = useState<
    | "landing"
    | "analysis"
    | "station"
    | "history"
    | "onboarding"
    | "soul"
    | "lucky"
  >("landing");
  const [isMeasuringInsight, setIsMeasuringInsight] = useState(false);
  const [isDailyOracleLoading, setIsDailyOracleLoading] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [limitModalInfo, setLimitModalInfo] = useState<{ open: boolean; type: 'daily' | 'soul'; dapp: string } | null>(null);
  const [dailyResult, setDailyResult] = useState<any>(() => getInitialTrinityDailyResult());
  const dailyResultRef = useRef<any>(dailyResult);
  useEffect(() => {
    dailyResultRef.current = dailyResult;
  }, [dailyResult]);
  const dailyRestoreGuardRef = useRef<string | null>(null);

  // States for Daily Tarot Card Picking
  const dailyDeckScrollRef = useRef<HTMLDivElement>(null);
  const [dailyDeckCompact, setDailyDeckCompact] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setDailyDeckCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const [dailyDrawnCard, setDailyDrawnCard] = useState<TarotCard | null>(() => {
    const init = getInitialTrinityDailyResult();
    return (init?.drawnCard as TarotCard) || null;
  });
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(() => {
    const init = getInitialTrinityDailyResult();
    if (init?.drawnCard) {
      const idx = TRINITY_CARDS.findIndex((c) => c.id === init.drawnCard.id);
      return idx >= 0 ? idx : 0;
    }
    return null;
  });
  const [shuffledTrinityCards, setShuffledTrinityCards] = useState(() => shuffleCardDeck(TRINITY_CARDS));
  const [dailyOffsets, setDailyOffsets] = useState<{ xOff: number; yOff: number; rotOff: number }[]>(() =>
    Array.from({ length: 22 }).map(() => ({
      xOff: 0,
      yOff: 0,
      rotOff: 0,
    }))
  );
  useEffect(() => {
    const uid = firebaseUser?.uid || "guest";
    const limitKey = `limit_daily_trinity_${uid}_${getTodayDateKey()}`;
    if (activeMode === "daily" && !dailyDrawnCard && !localStorage.getItem(limitKey) && !localStorage.getItem(`limit_daily_trinity_guest_${getTodayDateKey()}`)) {
      setShuffledTrinityCards(shuffleCardDeck(TRINITY_CARDS));
      setDailyOffsets(
        Array.from({ length: TRINITY_CARDS.length }).map(() => ({
          xOff: 0,
          yOff: 0,
          rotOff: 0,
        }))
      );
    }
  }, [activeMode, dailyDrawnCard, firebaseUser?.uid]);

  const centerDailyDeckScroll = useCallback(() => {
    const el = dailyDeckScrollRef.current;
    if (!el || el.offsetWidth <= 0 || el.offsetHeight <= 0) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    el.scrollLeft = maxScroll / 2;
  }, []);

  useEffect(() => {
    if (activeMode !== "daily" || dailyDrawnCard) return;
    const run = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(centerDailyDeckScroll);
      });
    };
    run();
    const timers = [120, 350, 700, 1100].map((ms) => window.setTimeout(centerDailyDeckScroll, ms));
    const observed = dailyDeckScrollRef.current ? [dailyDeckScrollRef.current] : [];
    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(centerDailyDeckScroll)
      : null;
    observed.forEach((node) => resizeObserver?.observe(node!));
    window.addEventListener("resize", centerDailyDeckScroll);
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      resizeObserver?.disconnect();
      window.removeEventListener("resize", centerDailyDeckScroll);
    };
  }, [activeMode, dailyDrawnCard, shuffledTrinityCards, dailyDeckCompact, centerDailyDeckScroll]);

  const [sessionComfortLevel, setSessionComfortLevel] = useState<number>(() => {
    try {
      const dateStr = new Date().toLocaleDateString('sv');
      const saved = localStorage.getItem('trinity_daily_level_' + dateStr);
      return saved ? parseInt(saved) : 3;
    } catch (_) { return 3; }
  });
  const [sessionLevelCheckedIn, setSessionLevelCheckedIn] = useState<boolean>(() => {
    try {
      const dateStr = new Date().toLocaleDateString('sv');
      const saved = localStorage.getItem('trinity_daily_checked_' + dateStr);
      return saved === 'true';
    } catch (_) { return false; }
  });
  const [isDeckSpreaded, setIsDeckSpreaded] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(() => {
    const init = getInitialTrinityDailyResult();
    return !!init?.drawnCard;
  });
  const [isDailyOracleProcessing, setIsDailyOracleProcessing] = useState(false);

  const resetDailyDeckUI = () => {
    setDailyDrawnCard(null);
    setSelectedCardIdx(null);
    setIsFlipped(false);
    setIsDailyOracleLoading(false);
    setShuffledTrinityCards(shuffleCardDeck(TRINITY_CARDS));
  };

// Global cached audio instances for instantaneous, non-blocking daily card chime
let cachedDailyChimeContext: AudioContext | null = null;
let cachedDailyChimeBuffer: AudioBuffer | null = null;

function playDailyCardChimeAsync() {
  if (typeof window === 'undefined') return;
  // Non-blocking deferred audio playback to keep UI thread 100% fluid
  setTimeout(() => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      if (!cachedDailyChimeContext) {
        cachedDailyChimeContext = new AudioCtxClass();
      }
      if (cachedDailyChimeContext.state === 'suspended') {
        cachedDailyChimeContext.resume().catch(() => {});
      }
      if (!cachedDailyChimeBuffer) {
        const sampleRate = 8000;
        const duration = 0.6;
        const numSamples = Math.floor(sampleRate * duration);
        const buffer = new Float32Array(numSamples);
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          buffer[i] = (Math.sin(2 * Math.PI * 528 * t) + 0.5 * Math.sin(2 * Math.PI * 792 * t)) * 0.22 * Math.exp(-5 * t);
        }
        cachedDailyChimeBuffer = cachedDailyChimeContext.createBuffer(1, numSamples, sampleRate);
        cachedDailyChimeBuffer.getChannelData(0).set(buffer);
      }
      const source = cachedDailyChimeContext.createBufferSource();
      source.buffer = cachedDailyChimeBuffer;
      source.connect(cachedDailyChimeContext.destination);
      source.start();
    } catch (_) {}
  }, 0);
}

  const selectDailyTarotCard = (card: TarotCard, idx: number) => {
    const uid = firebaseUser?.uid || "guest";
    const today = getTodayDateKey();
    const limitKey = `limit_daily_trinity_${uid}_${today}`;
    const guestLimitKey = `limit_daily_trinity_guest_${today}`;
    if (localStorage.getItem(limitKey) || localStorage.getItem(guestLimitKey) || isTrinityDailyLockedToday() || dailyResult || dailyDrawnCard) {
      restoreTodayDailyResult();
      setNotice({
        open: true,
        title: "오늘의 타로 1일 1회 완료",
        message: "오늘의 타로는 1일 1회만 진행할 수 있습니다. 오늘 이미 뽑으신 결과를 복원해 드립니다.",
      });
      setShowDailyModal(true);
      return;
    }
    // Tactile audio haptic feedback for card draw
    playAudioHaptic('card_draw');

    // 🌟 카드가 뒤집히는 순간 화면 미세 진동 트리거
    triggerTarotScreenVibration({ intensity: 'medium' });

    // Instant non-blocking chime execution
    playDailyCardChimeAsync();

    window.dispatchEvent(new Event("unlock-bgm-audio"));
    setSelectedCardIdx(idx);
    setDailyDrawnCard(card);
    setIsFlipped(true);
  };

  const computeFanDeckWidth = (
    spread: number,
    cardWidthPx: number,
    cardHeightPx: number,
    rotMult: number,
    edgePad = 64,
  ) => {
    const maxRotDeg = Math.abs(0.5 * rotMult);
    const rotRad = (maxRotDeg * Math.PI) / 180;
    const rotatedSpan =
      cardWidthPx * Math.abs(Math.cos(rotRad)) + cardHeightPx * Math.abs(Math.sin(rotRad));
    return Math.ceil(spread + rotatedSpan + edgePad * 2);
  };

  const getFanDeckConfig = (variant: "page" | "modal", compact: boolean) => {
    if (compact) {
      return variant === "page"
        ? {
            spread: 340,
            yMult: 82,
            rotMult: 38,
            deckWidth: computeFanDeckWidth(340, 60, 100, 38, 48),
            heightClass: "h-52",
            cardClass:
              "absolute w-[3.75rem] h-[6.25rem] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border border-yellow-500/30 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer hover:border-yellow-300 hover:ring-1 hover:ring-yellow-400/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] active:scale-95 group/card",
            cardPos: { left: "calc(50% - 1.875rem)", top: "calc(50% - 3.125rem)" },
          }
        : {
            spread: 300,
            yMult: 68,
            rotMult: 32,
            deckWidth: computeFanDeckWidth(300, 56, 96, 32, 44),
            heightClass: "h-48",
            cardClass:
              "absolute w-14 h-24 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border border-yellow-500/30 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer hover:border-yellow-300 hover:ring-1 hover:ring-yellow-400/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] active:scale-95 group/card",
            cardPos: { left: "calc(50% - 1.75rem)", top: "calc(50% - 3rem)" },
          };
    }

    return variant === "page"
      ? {
          spread: 620,
          yMult: 140,
          rotMult: 42,
          deckWidth: Math.max(computeFanDeckWidth(620, 72, 120, 42, 68), 960),
          heightClass: "h-56 md:h-60",
          cardClass:
            "absolute w-[4.5rem] h-[7.5rem] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border border-yellow-500/30 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer hover:border-yellow-300 hover:ring-1 hover:ring-yellow-400/50 hover:shadow-[0_0_24px_rgba(234,179,8,0.45)] active:scale-95 group/card",
          cardPos: { left: "calc(50% - 2.25rem)", top: "calc(50% - 3.75rem)" },
        }
      : {
          spread: 560,
          yMult: 110,
          rotMult: 36,
          deckWidth: Math.max(computeFanDeckWidth(560, 64, 112, 36, 64), 880),
          heightClass: "h-56 md:h-60",
          cardClass:
            "absolute w-16 h-28 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border border-yellow-500/30 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer hover:border-yellow-300 hover:ring-1 hover:ring-yellow-400/50 hover:shadow-[0_0_24px_rgba(234,179,8,0.45)] active:scale-95 group/card",
          cardPos: { left: "calc(50% - 2rem)", top: "calc(50% - 3.5rem)" },
        };
  };

  const renderDailyCardBack = (variant: "page" | "modal") => {
    const iconSize = variant === "page" ? 14 : 12;
    const iconWrap = variant === "page" ? "w-8 h-8" : "w-7 h-7";
    return (
      <>
        <div className="absolute inset-1 border border-yellow-500/10 rounded-xl pointer-events-none" />
        <div className="absolute inset-1 border border-yellow-500/20 rounded-xl flex flex-col items-center justify-center bg-yellow-500/5 group-hover/card:bg-yellow-500/15 transition-all shadow-inner tarot-card-border-flicker overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/25 to-transparent skew-x-12 opacity-0 group-hover/card:opacity-100 transition-opacity tarot-card-shimmer-sweep pointer-events-none" />
          <div className={`${iconWrap} rounded-full border border-yellow-500/20 flex items-center justify-center bg-black/40 shadow-md group-hover/card:border-yellow-400/40 transition-all`}>
            <Sparkles size={iconSize} className="text-yellow-400 group-hover/card:scale-115 group-hover/card:text-yellow-200 transition-all shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse" />
          </div>
        </div>
      </>
    );
  };

  const renderFanDailyDeck = (keyPrefix = "trinity-deck", variant: "page" | "modal" = "page") => {
    const { spread, yMult, rotMult, deckWidth, heightClass, cardClass, cardPos } =
      getFanDeckConfig(variant, dailyDeckCompact);

    return (
      <div
        className={`relative ${heightClass} shrink-0 select-none overflow-visible py-4`}
        style={{ width: deckWidth, minWidth: deckWidth, perspective: "1000px" }}
      >
        {shuffledTrinityCards.map((card, idx) => {
          const total = shuffledTrinityCards.length;
          const progress = total > 1 ? idx / (total - 1) - 0.5 : 0;
          const offset = dailyOffsets[idx] || { xOff: 0, yOff: 0, rotOff: 0 };
          const xOffset = progress * spread + offset.xOff;
          const yOffset = progress * progress * yMult + offset.yOff;
          const rotateZ = progress * rotMult + offset.rotOff;
          const zIndex = Math.round((0.5 - Math.abs(progress)) * 100) + 10;
          const spreadDelay = Math.abs(progress) * 0.08;

          return (
            <motion.button
              type="button"
              key={`${keyPrefix}-fan-${card.id}-${idx}`}
              initial={{ x: 0, y: 24, opacity: 0, scale: 0.42, rotateZ: 0 }}
              animate={{ x: xOffset, y: yOffset, rotateZ, scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 105,
                damping: 17,
                delay: spreadDelay,
              }}
              whileHover={{
                y: yOffset - 16,
                scale: 1.08,
                rotateZ: rotateZ * 0.3,
                zIndex: 500,
                transition: { type: "spring", stiffness: 350, damping: 20 },
              }}
              whileTap={{
                y: yOffset - 24,
                scale: 1.10,
                rotateZ: 0,
                zIndex: 600,
                transition: { type: "spring", stiffness: 450, damping: 15 },
              }}
              onTouchStart={() => {
                playAudioHaptic('card_snap', { volume: 0.5 });
              }}
              onClick={() => selectDailyTarotCard(card, idx)}
              className={cardClass}
              style={{ ...cardPos, transformOrigin: "bottom center", zIndex }}
              aria-label={`데일리 타로 카드 ${idx + 1} 선택`}
            >
              {renderDailyCardBack(variant)}
            </motion.button>
          );
        })}
      </div>
    );
  };

  const renderDailyCardDeck = (keyPrefix: string, variant: "page" | "modal") => {
    const { deckWidth } = getFanDeckConfig(variant, dailyDeckCompact);

    return (
      <div className="relative w-full max-w-full overflow-visible">
        {!dailyDeckCompact && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-5 w-8 sm:w-10 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-5 w-8 sm:w-10 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent" />
          </>
        )}
        <div
          ref={dailyDeckScrollRef}
          className="w-full overflow-x-auto overflow-y-visible premium-scroll scrollbar-none touch-pan-x overscroll-x-contain scroll-smooth py-2 px-6 sm:px-10"
        >
          <div
            className="flex items-end justify-center mx-auto py-2"
            style={{ width: deckWidth, minWidth: deckWidth }}
          >
            {renderFanDailyDeck(keyPrefix, variant)}
          </div>
        </div>
        <p className="text-center text-[10px] text-white/35 mt-1 tracking-wide">
          {dailyDeckCompact ? "부채꼴 덱을 좌우로 넘기며 카드를 선택하세요" : "카드를 탭해 선택하세요"}
        </p>
      </div>
    );
  };

  const resetTarotSession = useCallback((preserveDailyIfUnfinished = true) => {
    setDrawnCards(null);
    setTarotResult(null);
    setFollowUpEntries([]);
    try {
      localStorage.removeItem('trinity_followup_tarot_entries');
    } catch (_) {}
    setTarotSubMessages([]);
    setTarotVirtualMode(false);
    setSmartTarotQuestions([]);
    setIsTarotGenerating(false);
    setStage("landing");
    const uid = firebaseUser?.uid || "guest";
    const today = getTodayDateKey();
    const limitGuest = localStorage.getItem(`limit_daily_trinity_guest_${today}`);
    const limitUser = localStorage.getItem(`limit_daily_trinity_${uid}_${today}`);
    const init = getInitialTrinityDailyResult(uid);
    const isDone = !!limitGuest || !!limitUser || !!init || !!dailyResult;
    if (!isDone && preserveDailyIfUnfinished) {
      setTarotConcern("오늘의 타로");
    } else {
      setTarotConcern("");
    }
  }, [dailyResult, firebaseUser?.uid]);

  const [form, setForm] = useState<ProfileForm>(() => {
    const p = getPersistentUserProfile()?.basic;
    return {
      name: p?.name || "",
      birthdate: p?.birthdate || "",
      birthtime: p?.birthtime || "",
      gender: p?.gender === "male" ? "남성" : "여성",
      nickname: p?.nickname || "",
      city: p?.birthCity || "서울",
    };
  });
  const [sajuData, setSajuData] = useState("");
  const [astroData, setAstroData] = useState("");
  const [visionConcern, setVisionConcern] = useState("");



  const ALL_TAROT_SUGGESTIONS = [
    "올해 신년운세와 사계절 동안 찾아올 대운의 흐름은?",
    "내 타고난 사주 기운과 어우러진 올해의 성취와 운명선은?",
    "상대방은 지금 나를 어떻게 생각하고 있나요?",
    "제가 지금 진행중인 일의 최종 결과는 어떻게 될까요?",
    "올 한 해 동안 꼭 잡아야 할 가장 큰 기회와 조언은?",
    "사주팔자의 오행 흐름과 결합한 직업 및 재물 대운은?",
    "저의 연애운의 현재 상황과 다가올 미래의 흐름을 보여주세요.",
    "새로운 도전을 고민하고 있는데, 도전한다면 결과가 좋을까요?",
    "현재 직장에서의 이직이나 부서 이동 등의 운은 어떤가요?",
    "가까운 시일 내에 저에게 찾아올 가장 긍정적인 행운은?",
    "금전적인 흐름과 재물운을 좋게 만들려면 어떻게 해야 할까요?",
    "최근 인간관계에서 느끼는 스트레스를 해결할 수 있는 조언은?",
    "올해 저에게 가장 크게 다가올 변화는 무엇인가요?",
    "망설이고 있는 결정이 있는데, 어느 쪽을 선택하는 것이 지혜로울까요?",
    "현재 나와 상대방 사이에 가로막혀 있는 장애물은 무엇인가요?",
    "내 안에 잠재된 능력을 최고로 끌어올리는 방법은 무엇일까요?",
    "과거의 미련에서 벗어나 온전히 나의 미래에 집중하기 위한 길잡이는?",
    "솔로 탈출을 위해 내가 지금 당장 시작해야 할 일은 무엇일까요?",
    "이번 달 조심해야 할 대인관계 갈등 예방 팁은?"
  ];

  const [tarotSuggestions, setTarotSuggestions] = useState<string[]>(() => {
    const shuffled = [...ALL_TAROT_SUGGESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  });

  const handleRefreshTarotSuggestions = () => {
    const shuffled = [...ALL_TAROT_SUGGESTIONS].sort(() => 0.5 - Math.random());
    setTarotSuggestions(shuffled.slice(0, 4));
  };

  const ALL_TRINITY_SUGGESTIONS = [
    "현재 나의 가장 큰 장애물은 무엇인가요?",
    "어떻게 하면 다음 단계로 나아갈 수 있을까요?",
    "우주가 나에게 지금 주려는 지혜는 무엇일까요?",
    "나의 진정한 목표를 찾기 위한 질문을 던져주세요.",
    "내가 버려야 할 오래된 습관은 무엇인가요?",
    "새로운 기회를 맞이하기 위해 준비할 것은?",
    "나의 잠재력을 완전히 발휘하기 위한 영적 조언은 무엇인가요?",
    "지금 나에게 필요한 긍정적 에너지를 채우는 명상법을 알려주세요.",
    "관계에서의 스트레스를 해결하기 위한 근본적인 갈등 해소 방안은?",
    "앞으로 3개월간 저에게 찾아올 가장 긍정적인 운명적 흐름은?",
    "정체된 생각과 감정에서 벗어나 행동력을 극대화할 수 있는 비결은?",
    "내 영혼의 깊은 상처를 스스로 치유할 수 있는 자기 자비의 첫걸음은?"
  ];

  const [trinitySuggestions, setTrinitySuggestions] = useState<string[]>(() => {
    const shuffled = [...ALL_TRINITY_SUGGESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  });

  const handleRefreshTrinitySuggestions = () => {
    const shuffled = [...ALL_TRINITY_SUGGESTIONS].sort(() => 0.5 - Math.random());
    setTrinitySuggestions(shuffled.slice(0, 4));
  };

  const [soulData, setSoulData] = useState({
    coreValue: "영적 통찰과 운명적 흐름",
    unconsciousPattern: "운명에 대한 불안과 완벽주의",
    preference: "신비롭고 꿰뚫어보는 어조",
    stats: [
      { subject: '영성', A: 95, fullMark: 100 },
      { subject: '직관력', A: 90, fullMark: 100 },
      { subject: '통찰력', A: 85, fullMark: 100 },
      { subject: '수용성', A: 80, fullMark: 100 },
      { subject: '초월성', A: 85, fullMark: 100 },
    ],
    energyFlow: [
      { time: '월', value: 80 }, { time: '화', value: 85 }, { time: '수', value: 70 }, { time: '목', value: 90 }, { time: '금', value: 95 }, { time: '토', value: 100 }, { time: '일', value: 85 }
    ],
    emotions: [
      { name: '깨달음', value: 40 }, { name: '불안', value: 20 }, { name: '신비함', value: 30 }, { name: '순응', value: 10 }
    ]
  });

  useEffect(() => {
    if (!firebaseUser) return;
    const isDev = localStorage.getItem('developer_bypass') === 'true';
    if (isDev) {
      try {
        const saved = localStorage.getItem('soul_mirror_trinity');
        if (saved) {
          setSoulData(JSON.parse(saved));
        }
      } catch (_) {}
      return;
    }
    const loadSoulMirrorData = async () => {
      try {
        const docRef = doc(db, 'soul_mirror', firebaseUser.uid, 'dapps', 'trinity');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setSoulData(snap.data() as any);
        } else {
          const saved = localStorage.getItem('soul_mirror_trinity');
          if (saved) {
            setSoulData(JSON.parse(saved));
          }
        }
      } catch (e) {
        console.warn("[Trinity] Error loading persisted soul data from cloud, falling back to local storage:", e);
        try {
          const saved = localStorage.getItem('soul_mirror_trinity');
          if (saved) {
            setSoulData(JSON.parse(saved));
          }
        } catch (_) {}
      }
    };
    loadSoulMirrorData();
  }, [firebaseUser]);
  const [showTarot, setShowTarot] = useState(false);

  useEffect(() => {
    if (showTarot) {
      handleRefreshTarotSuggestions();
    }
  }, [showTarot]);

  const [tarotVirtualMode, setTarotVirtualMode] = useState(false);
  const [tarotResult, setTarotResult] = useState<string | null>(null);
  const [drawnCards, setDrawnCards] = useState<TarotCard[] | null>(null);

  // 🔮 타로 연속 추가 질문 & 잔여 덱 관리 상태 (이미 뽑힌 카드는 제외하고 남은 덱으로만 진행)
  const [followUpEntries, setFollowUpEntries] = useState<FollowUpTarotEntry[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('trinity_followup_tarot_entries') : null;
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  });
  const [isFollowUpGenerating, setIsFollowUpGenerating] = useState(false);
  const [showFollowUpWheelModal, setShowFollowUpWheelModal] = useState(false);
  const [pendingFollowUpQuestion, setPendingFollowUpQuestion] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('trinity_followup_tarot_entries', JSON.stringify(followUpEntries));
    } catch (_) {}
  }, [followUpEntries]);

  const [zoomedCard, setZoomedCard] = useState<{ card: TarotCard; slotName?: string } | null>(null);
  const [cardFlipCycle, setCardFlipCycle] = useState(0);
  const [hideTarotPopup, setHideTarotPopup] = useState(false);
  const [tarotSubMessages, setTarotSubMessages] = useState<
    { role: "user" | "model"; content: string }[]
  >([]);
  const [tarotChatInput, setTarotChatInput] = useState("");
  const [isTarotSubChatGenerating, setIsTarotSubChatGenerating] =
    useState(false);
  const [dailySubMessages, setDailySubMessages] = useState<
    { role: "user" | "model"; content: string }[]
  >([]);
  const [dailyChatInput, setDailyChatInput] = useState("");
  const [isDailySubChatGenerating, setIsDailySubChatGenerating] =
    useState(false);

  // 🧭 메인 전체 화면 스마트 스크롤 엔진 (TTS 하이라이트 문장 뷰포트 중앙 추적 & 3초 수동 스크롤 분리)
  const {
    isUserOverriding: isMainUserOverriding,
    remainingSeconds: mainRemainingSeconds,
    resumeAutoScroll: resumeMainAutoScroll,
    hasActiveHighlight: hasMainActiveHighlight,
  } = useSmartScroll({
    enabled: !showDailyModal && !showFollowUpWheelModal && !zoomedCard,
    resumeDelayMs: 3000,
  });

  // 📱 좌우 스와이프 제스처: 다른 앱으로 이탈하지 않고 같은 앱 내에서만 탭 이동 (SAJU <-> TAROT <-> ORACLE)
  const trinitySwipeTabs = useMemo(() => ['destiny', 'tarot', 'oracle'] as const, []);
  const currentTrinityTab = (activeMode === 'oracle' || activeMode === 'synergy')
    ? 'oracle'
    : (activeMode === 'tarot' ? 'tarot' : 'destiny');

  const { swipeHandlers: trinitySwipeHandlers } = useSwipeableTabs({
    tabs: trinitySwipeTabs,
    activeTab: currentTrinityTab,
    onTabChange: (newTab) => {
      if (newTab === 'tarot') {
        if (!tarotResult && !isTarotGenerating) {
          resetTarotSession(true);
        }
        setActiveMode('tarot');
      } else {
        setActiveMode(newTab);
      }
    },
    enabled: !tarotVirtualMode && !showDailyModal && !isDailyOracleLoading && !zoomedCard,
  });
  const [tarotConcern, setTarotConcern] = useState<string>(() => {
    const today = getTodayDateKey();
    const guestLimit = typeof window !== "undefined" ? localStorage.getItem(`limit_daily_trinity_guest_${today}`) : null;
    const init = getInitialTrinityDailyResult();
    if (!init && !guestLimit) {
      return "오늘의 타로";
    }
    return "";
  });
  const [customSpread, setCustomSpread] = useState<TarotSpreadRecommendation | null>(null);
  const [isSpreadModalOpen, setIsSpreadModalOpen] = useState(false);
  const [showTarotCardBackModal, setShowTarotCardBackModal] = useState(false);
  const [showPhysicalTarotModal, setShowPhysicalTarotModal] = useState(false);
  const { theme: tarotBackTheme } = useTarotCardBack();
  const deferredTarotConcern = useDeferredValue(tarotConcern);
  const tarotConcernAnalysis: TarotConcernAnalysis = useMemo(() => {
    const base = analyzeTarotConcern(deferredTarotConcern);
    if (customSpread) {
      const kind: TarotConcernKind =
        customSpread.theme === 'binary_choice'
          ? 'binary_choice'
          : customSpread.theme === 'yes_no'
            ? 'yes_no'
            : base.kind;
      const meta = getTarotThemeMeta(customSpread.theme);
      return {
        ...base,
        kind,
        theme: customSpread.theme,
        themeLabel: meta.label,
        themeEmoji: meta.emoji,
        recommendationReason: customSpread.reason || base.recommendationReason,
        spread: customSpread,
      };
    }
    return base;
  }, [deferredTarotConcern, customSpread]);
  const tarotSpreadRecommendation = tarotConcernAnalysis.spread;
  const isAutoRecommended = !customSpread;
  const [isTarotGenerating, setIsTarotGenerating] = useState(false);

  // 🌟 잔여 덱 (No Duplicate Draws): 기존에 뽑힌 모든 카드(초기 스프레드 + 데일리 + 이전 추가 질문)를 78장 덱에서 완전히 제외
  const drawnCardIds = useMemo(() => {
    const ids = new Set<string>();
    (drawnCards || []).forEach((c) => { if (c?.id) ids.add(c.id); });
    if (dailyResult?.drawnCard?.id) ids.add(dailyResult.drawnCard.id);
    if (dailyDrawnCard?.id) ids.add(dailyDrawnCard.id);
    (followUpEntries || []).forEach((entry) => { if (entry?.card?.id) ids.add(entry.card.id); });
    return Array.from(ids);
  }, [drawnCards, dailyResult, dailyDrawnCard, followUpEntries]);

  const remainingDeck = useMemo(() => {
    return TAROT_DECK.filter((card) => !drawnCardIds.includes(card.id));
  }, [drawnCardIds]);

  // Auto concise 3-bullet summary for tarot readings (카드 상징과 사주를 결합한 50~70자 명확한 3개 불릿 보장)
  const conciseSummaryBullets = useMemo(() => {
    if (!tarotResult || tarotResult.trim().length < 40) return [];
    const profile = sharedState?.userProfile || getPersistentUserProfile();
    const sajuInfo = calculateDetailedSaju(profile);
    const contextCards = drawnCards && drawnCards.length > 0
      ? drawnCards
      : (dailyResult?.drawnCard ? [dailyResult.drawnCard] : (dailyDrawnCard ? [dailyDrawnCard] : []));

    return extractConciseSummary(tarotResult, {
      cards: contextCards,
      card: contextCards[0] || dailyResult?.drawnCard || dailyDrawnCard,
      saju: sajuInfo,
      concern: tarotConcern,
      theme: tarotConcernAnalysis.theme,
      kind: tarotConcernAnalysis.kind,
    });
  }, [tarotResult, drawnCards, dailyResult, dailyDrawnCard, sharedState, tarotConcern, tarotConcernAnalysis]);

  // 🎯 예/아니오 (YES or NO) 타로 최종 판정 추출
  const tarotYesNoVerdict = useMemo(() => {
    if (!tarotResult) return null;
    const isYesNoContext =
      tarotConcernAnalysis.kind === 'yes_no' ||
      tarotConcernAnalysis.theme === 'yes_no' ||
      tarotSpreadRecommendation.theme === 'yes_no';

    const cleanResult = tarotResult.toUpperCase();

    // 1. 명시적 대괄호 판정 탐색 (최종 판정: [YES] 또는 [NO] 등)
    const yesMatch = tarotResult.match(/최종\s*판정\s*[:—\-]?\s*\[?\s*(확실한\s*YES|조건부\s*YES|YES)\s*\]?/i) ||
      (isYesNoContext && tarotResult.match(/\[\s*(확실한\s*YES|조건부\s*YES|YES)\s*\]/i));
    const noMatch = tarotResult.match(/최종\s*판정\s*[:—\-]?\s*\[?\s*(단호한\s*NO|NO)\s*\]?/i) ||
      (isYesNoContext && tarotResult.match(/\[\s*(단호한\s*NO|NO)\s*\]/i));

    if (yesMatch) {
      const raw = yesMatch[1];
      const isConditional = raw.includes('조건부');
      return {
        type: isConditional ? 'CONDITIONAL_YES' : 'YES',
        label: isConditional ? '조건부 YES' : 'YES',
        badgeText: isConditional ? '준비와 보완을 거친 후 적극 전진 권장' : '우주와 카드가 비추는 확실한 긍정과 기회',
      };
    }
    if (noMatch) {
      return {
        type: 'NO',
        label: 'NO',
        badgeText: '지금은 무리한 추진보다 숨은 변수 점검과 호흡 조율 필요',
      };
    }

    // 2. 예/아니오 맥락에서 단독 단어 기반 탐색
    if (isYesNoContext) {
      if (/\bYES\b/i.test(cleanResult) && !/\bNO\b/i.test(cleanResult)) {
        return {
          type: 'YES',
          label: 'YES',
          badgeText: '카드가 가리키는 긍정의 확신',
        };
      }
      if (/\bNO\b/i.test(cleanResult) && !/\bYES\b/i.test(cleanResult)) {
        return {
          type: 'NO',
          label: 'NO',
          badgeText: '신중한 검토와 페이스 조절 필요',
        };
      }
    }

    return null;
  }, [tarotResult, tarotConcernAnalysis, tarotSpreadRecommendation]);

  const displayTarotResult = useMemo(() => {
    // 타로 결과 상단에 별도의 핵심 3줄 요약 카드가 렌더링되므로, 하단 본문에서는 중복된 후행 요약 블록을 깔끔히 제거
    if (!tarotResult) return "";
    return stripSummaryFromTarotText(tarotResult);
  }, [tarotResult]);

  // 🔊 타로 결과 음성 낭독 전용 텍스트 (핵심 3줄 요약 완전 배제: 본문 1~5단계 순수 리딩 + 맨 마지막 맹목적 믿음 경계 성찰 주의문 낭독)
  const tarotSpeechReadingText = useMemo(() => {
    if (!tarotResult) return "";
    const cleanBody = prepareNaturalSpeechText(stripSummaryFromTarotText(tarotResult));
    const cautionSpeech = "주의사항을 전해드립니다. 타로는 정해진 미래를 맹목적으로 따르기 위한 것이 아니며, 현재의 마음을 비추고 현명한 선택을 돕는 내면의 성찰 도구입니다. 맹목적인 믿음을 지양하고, 모든 운명의 결정권과 최종 열쇠는 언제나 당신 자신의 주체적인 지혜와 용기에 있음을 기억하세요.";
    return `${cleanBody}\n\n${cautionSpeech}`;
  }, [tarotResult]);

  const summarySpeechText = useMemo(() => {
    if (conciseSummaryBullets.length === 0) return "";
    const intro = "타로 리딩의 핵심 3줄 요약입니다.";
    const bullets = conciseSummaryBullets
      .map((b) => {
        const speech = b.replace(/^\[([^\]]+)\]\s*/, "$1. ");
        return speech.trim().replace(/[.!?\s]+$/, '') + '.';
      })
      .join(' ');
    return `${intro} ${bullets}`;
  }, [conciseSummaryBullets]);

  // 타로 결과 낭독 시 핵심 요약은 읽지 않고 본문 상세 리딩만 깨끗하게 낭독
  const fullReadingSpeechText = useMemo(() => {
    if (!tarotResult) return "";
    const cleanBody =
      displayTarotResult ||
      tarotResult
        .replace(/(?:\n|^)(?:\[핵심\s*3줄\s*요약\]|###\s*.*핵심\s*3줄\s*요약|###\s*.*핵심\s*요약|\[핵심\s*요약\])[\s\S]*$/i, "")
        .trim();
    return cleanBody;
  }, [tarotResult, displayTarotResult]);

  const isSummaryTTSActive = useMemo(() => {
    if (!isTTSActive || !summarySpeechText) return false;
    const cleanSummary = prepareNaturalSpeechText(summarySpeechText);
    return ttsState.activeFullText === cleanSummary;
  }, [isTTSActive, summarySpeechText, ttsState.activeFullText]);

  const isFullReadingTTSActive = useMemo(() => {
    if (!isTTSActive || !tarotSpeechReadingText) return false;
    if (isSummaryTTSActive) return false;
    const cleanReading = prepareNaturalSpeechText(tarotSpeechReadingText);
    return !ttsState.activeFullText || ttsState.activeFullText === cleanReading;
  }, [isTTSActive, tarotSpeechReadingText, isSummaryTTSActive, ttsState.activeFullText]);

  // Auto-prefetch TTS for reading & summary when generated
  useEffect(() => {
    if (tarotSpeechReadingText && !isTarotGenerating && tarotSpeechReadingText.trim().length >= 80) {
      const chunks = splitSpeechIntoChunks(tarotSpeechReadingText, 110);
      if (chunks[0]) prefetchTTS(chunks[0], 'Kore').catch(() => {});
      if (chunks[1]) prefetchTTS(chunks[1], 'Kore').catch(() => {});
    }
  }, [tarotSpeechReadingText, isTarotGenerating]);
  const [chatInput, setChatInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [luckyMode, setLuckyMode] = useState<"saju" | "tarot" | "astro">(
    "saju",
  );
  const [insightResult, setInsightResult] = useState<any>(null);
  const [poeInsight, setPoeInsight] = useState<{
    insight: string;
    category: string;
  } | null>(null);
  const [isInsightCollapsed, setIsInsightCollapsed] = useState(false);
  const [notice, setNotice] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({ open: false, title: "", message: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [localHistory, setLocalHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const [smartTarotQuestions, setSmartTarotQuestions] = useState<string[]>([]);

  useEffect(() => {
    const concern = tarotConcern.trim();
    if (concern.length < 8) {
      setSmartTarotQuestions([]);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setIsGeneratingQuestions(true);
      try {
        const resText = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                '사용자 고민에 맞는 타로 질문 3개를 한국어로 생성하세요. JSON만 출력: { "questions": ["질문1", "질문2", "질문3"] }. 각 질문은 20~60자, 구체적이고 결정 가능해야 합니다.',
            },
            { role: "user", content: concern },
          ],
          responseFormat: { type: "json_object" },
        });
        if (cancelled) return;
        const parsed = JSON.parse(resText || "{}");
        if (Array.isArray(parsed.questions)) {
          setSmartTarotQuestions(
            parsed.questions.filter((q: unknown) => typeof q === "string").slice(0, 3),
          );
        }
      } catch {
        if (!cancelled) setSmartTarotQuestions([]);
      } finally {
        if (!cancelled) setIsGeneratingQuestions(false);
      }
    }, 900);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [tarotConcern]);
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isSendingRef = useRef(false);

  // Dispatch custom event to notify global shell only when full-screen virtual mode is active
  useEffect(() => {
    const isShowingTarot = tarotVirtualMode;
    const evName = isShowingTarot ? "tarot-active" : "tarot-inactive";
    window.dispatchEvent(new CustomEvent(evName));
    return () => {
      window.dispatchEvent(new CustomEvent("tarot-inactive"));
    };
  }, [tarotVirtualMode]);

  // Sync Profile with Shared State
  useEffect(() => {
    const fbProfile = sharedState?.userProfile?.basic || getPersistentUserProfile()?.basic;
    if (!fbProfile) return;

    setForm((prev) => ({
      name: fbProfile.name || prev.name,
      nickname: fbProfile.nickname || prev.nickname,
      birthdate: fbProfile.birthdate || prev.birthdate,
      birthtime: fbProfile.birthtime || prev.birthtime,
      gender: fbProfile.gender === "male" ? "남성" : (fbProfile.gender === "female" ? "여성" : prev.gender),
      city: fbProfile.birthCity || prev.city || "서울",
    }));

    if (fbProfile.birthdate) {
      const [y, m, d] = fbProfile.birthdate.split("-").map(Number);
      const h = fbProfile.birthtime
        ? parseInt(fbProfile.birthtime.split(":")[0])
        : -1;
      const saju = calcSaju(
        y,
        m,
        d,
        h,
        fbProfile.gender === "male" ? "남성" : "여성",
      );
      const astro = calcAstro(y, m, d, h, fbProfile.birthCity || "서울");
      setSajuData(saju);
      setAstroData(astro);
    }
  }, [sharedState?.userProfile?.basic]);

  // Sync History from Firebase
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
        collection(db, "trinity_history", firebaseUser.uid, "entries"),
        orderBy("createdAt", "desc"),
      );
      unsub = onSnapshot(q, (snap) => {
        const docs = snap.docs
          .map((d) => ({
            id: d.id,
            ...d.data(),
            createdAt: (d.data() as any).createdAt?.toMillis?.() || Date.now(),
          }))
          .filter((d: any) => d.type !== 'chat');
        setLocalHistory(docs as HistoryItem[]);
        setIsHistoryLoading(false);
      }, (error) => {
        const msg = error?.message || '';
        if (msg.includes('INTERNAL ASSERTION FAILED')) {
          console.warn('[Trinity] Firestore 내부 오류 — 5초 후 재연결합니다.');
          retryTimeout = setTimeout(subscribe, 5000);
        } else if (msg.includes('Quota') || msg.includes('quota') || msg.includes('resource-exhausted')) {
          console.warn('[Trinity] Firestore 할당량 한도 도달 — 로컬 캐시를 사용합니다.');
          setIsHistoryLoading(false);
        } else {
          console.warn('[Trinity] onSnapshot notice:', error?.message || error);
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


  const trinityOracleHistory = useMemo(
    () => [...(sharedState?.trinityHistory || []), ...localHistory],
    [sharedState?.trinityHistory, localHistory],
  );

  const isTrinityDailyLockedToday = useCallback(() => {
    const uid = firebaseUser?.uid || "guest";
    const today = getTodayDateKey();
    const limitKey = `limit_daily_trinity_${uid}_${today}`;
    const guestLimitKey = `limit_daily_trinity_guest_${today}`;
    if (localStorage.getItem(limitKey) || localStorage.getItem(guestLimitKey)) {
      return true;
    }
    if (dailyResult?.drawnCard && (dailyResult?.dateKey === today || !dailyResult?.dateKey)) {
      return true;
    }
    if (sharedState?.todayOracles?.[today]?.trinity) {
      return true;
    }
    if (sharedState?.latestDailyOracles?.trinity?.dateKey === today) {
      return true;
    }
    try {
      const cached = localStorage.getItem(getTrinityDailyResultKey(uid)) || localStorage.getItem(getTrinityDailyResultKey("guest"));
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.dateKey === today && (parsed?.diagnosis || parsed?.summary || parsed?.drawnCard)) {
          return true;
        }
      }
    } catch (_) {}
    return false;
  }, [firebaseUser?.uid, sharedState?.todayOracles, sharedState?.latestDailyOracles]);

  const applyDailyResultState = useCallback((result: any) => {
    if (!result) return;
    setDailyResult(result);
    if (result.drawnCard) {
      const restoredCard = result.drawnCard as TarotCard;
      setDailyDrawnCard(restoredCard);
      const idx = TRINITY_CARDS.findIndex((c) => c.id === restoredCard.id);
      setSelectedCardIdx(idx >= 0 ? idx : null);
      setIsFlipped(true);
    }
  }, []);

  const restoreTodayDailyResult = useCallback((): boolean => {
    const uid = firebaseUser?.uid || "guest";
    const today = getTodayDateKey();

    // Check sharedState from Firestore first (cross-device source of truth)
    if (sharedState?.todayOracles?.[today]?.trinity) {
      const oracle = sharedState.todayOracles[today].trinity;
      if (oracle?.diagnosis || oracle?.summary || oracle?.prescription || (oracle as any)?.reading) {
        applyDailyResultState(oracle);
        return true;
      }
    }
    if (sharedState?.latestDailyOracles?.trinity) {
      const latest = sharedState.latestDailyOracles.trinity;
      if (latest.dateKey === today && (latest.diagnosis || latest.summary || latest.prescription)) {
        applyDailyResultState(latest);
        return true;
      }
    }

    try {
      const candidateKeys = [
        getTrinityDailyResultKey(uid),
        getTrinityDailyResultKey("guest"),
        `trinity_daily_result_${uid}_${today}`,
        `trinity_daily_result_guest_${today}`,
        `prism_daily_oracle_trinity_${today}`,
      ];
      for (const key of candidateKeys) {
        const cached = localStorage.getItem(key);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.diagnosis || parsed?.summary || parsed?.prescription) {
            if (parsed.dateKey && parsed.dateKey !== today) continue;
            applyDailyResultState(parsed);
            return true;
          }
        }
      }
    } catch (_) {}

    const entry = findTodayOracleInSources(trinityOracleHistory, ["oracle-vision"]);
    const resolved = entry ? resolveOracleVisionResult(entry) : null;
    if (resolved && (resolved.diagnosis || resolved.summary || resolved.prescription)) {
      applyDailyResultState(resolved);
      try {
        localStorage.setItem(getTrinityDailyResultKey(uid), JSON.stringify(resolved));
        localStorage.setItem(getTrinityDailyResultKey("guest"), JSON.stringify(resolved));
      } catch (_) {}
      return true;
    }

    // 🛡️ Comprehensive Daily Tarot Restoration Guard:
    // If today is locked or a card was previously picked, never leave the user with an empty/loading state!
    const limitKey = `limit_daily_trinity_${uid}_${today}`;
    const guestLimitKey = `limit_daily_trinity_guest_${today}`;
    if (localStorage.getItem(limitKey) || localStorage.getItem(guestLimitKey) || isTrinityDailyLockedToday() || dailyDrawnCard) {
      const card = dailyDrawnCard || pickDailySeededItem(TRINITY_CARDS, "trinity_oracle");
      const synthesized = {
        ...buildLocalTrinityDailyOracle(card, "oracle"),
        drawnCard: card,
        dateKey: today,
      };
      applyDailyResultState(synthesized);
      try {
        localStorage.setItem(getTrinityDailyResultKey(uid), JSON.stringify(synthesized));
        localStorage.setItem(getTrinityDailyResultKey("guest"), JSON.stringify(synthesized));
      } catch (_) {}
      return true;
    }

    return false;
  }, [firebaseUser?.uid, sharedState?.todayOracles, sharedState?.latestDailyOracles, trinityOracleHistory, applyDailyResultState, dailyDrawnCard, isTrinityDailyLockedToday]);

  // Listen for real-time daily oracle updates across devices
  useEffect(() => {
    const handleDailyOracleUpdated = () => {
      restoreTodayDailyResult();
    };
    window.addEventListener('prism:daily_oracle_updated', handleDailyOracleUpdated);
    return () => {
      window.removeEventListener('prism:daily_oracle_updated', handleDailyOracleUpdated);
    };
  }, [restoreTodayDailyResult]);

  // 🎧 URL 또는 SessionStorage를 통한 오늘의 타로 낭독 버전 자동 팝업 진입 지원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const openAudio = urlParams.get('openDailyAudio') || sessionStorage.getItem('prism_open_daily_audio');
    if (openAudio) {
      sessionStorage.removeItem('prism_open_daily_audio');
      restoreTodayDailyResult();
      setShowDailyModal(true);
    }
  }, [restoreTodayDailyResult]);

  // Reactive restore on mount or sharedState update when in daily mode
  useEffect(() => {
    if (activeMode === "daily" && !dailyResult) {
      restoreTodayDailyResult();
    }
  }, [activeMode, dailyResult, restoreTodayDailyResult, sharedState?.todayOracles, sharedState?.latestDailyOracles]);

  const enterDailyMode = useCallback(() => {
    const isLocked = isTrinityDailyLockedToday();
    const existing = getInitialTrinityDailyResult(firebaseUser?.uid);
    if (isLocked || existing) {
      restoreTodayDailyResult();
      setShowDailyModal(true);
    } else {
      resetTarotSession(true);
      setActiveMode("tarot");
    }
  }, [isTrinityDailyLockedToday, restoreTodayDailyResult, firebaseUser?.uid, resetTarotSession]);

  const isDailyOracleAlreadyDone = isTrinityDailyLockedToday();

  const isDailyTarotBlocked = isTrinityDailyLockedToday();

  const isDailyTarotChecked = Boolean(
    isDailyOracleAlreadyDone ||
    dailyResult?.drawnCard ||
    dailyResult?.diagnosis ||
    dailyDrawnCard
  );

  useEffect(() => {
    const todayKey = getTodayDateKey();

    if (isTrinityDailyLockedToday() || getInitialTrinityDailyResult(firebaseUser?.uid)) {
      if (!dailyResultRef.current && dailyRestoreGuardRef.current !== todayKey) {
        dailyRestoreGuardRef.current = todayKey;
        restoreTodayDailyResult();
      }
    }
  }, [sharedState, isTrinityDailyLockedToday, restoreTodayDailyResult, firebaseUser?.uid]);

  useEffect(() => {
    const handleOpenDailyTarotEvent = () => {
      setActiveMode('tarot');
      setTarotConcern('오늘의 타로');
      setCustomSpread(null);
      restoreTodayDailyResult();
      const targetCard = dailyResult?.drawnCard || dailyDrawnCard;
      if (targetCard) {
        setShowDailyModal(true);
      }
    };

    window.addEventListener('trinity:open_daily_tarot', handleOpenDailyTarotEvent);
    return () => {
      window.removeEventListener('trinity:open_daily_tarot', handleOpenDailyTarotEvent);
    };
  }, [dailyResult, dailyDrawnCard, restoreTodayDailyResult]);

  useEffect(() => {
    if (localHistory && localHistory.length > 0) {
      const latestSoul = localHistory.find((h: any) => h.type === "energy_analysis");
      if (latestSoul) {
        setInsightResult(latestSoul.data || latestSoul);
      }
    }
  }, [localHistory]);

  useEffect(() => {
    if (dailyResult?.drawnCard && !dailyDrawnCard) {
      const card = dailyResult.drawnCard as TarotCard;
      setDailyDrawnCard(card);
      const idx = TRINITY_CARDS.findIndex((c) => c.id === card.id);
      setSelectedCardIdx(idx >= 0 ? idx : null);
      setIsFlipped(true);
    }
  }, [dailyResult, dailyDrawnCard]);

  useEffect(() => {
    if (activeMode === "tarot" && typeof window !== "undefined" && sessionStorage.getItem('prism_tarot_focus_daily')) {
      sessionStorage.removeItem('prism_tarot_focus_daily');
      resetTarotSession(true);
      setTarotConcern("오늘의 타로");
      restoreTodayDailyResult();
      const targetCard = dailyResult?.drawnCard || dailyDrawnCard;
      if (targetCard) {
        setDrawnCards([targetCard]);
        setTarotResult(dailyResult?.diagnosis || dailyResult?.summary || "");
        setHideTarotPopup(false);
      }
    }
  }, [activeMode, dailyResult, dailyDrawnCard, restoreTodayDailyResult, resetTarotSession]);

  const handleSend = async (customMsg?: string, sendOpts?: OracleDeepInsightSendOpts) => {
    const userMsg = (customMsg || chatInput).trim();
    if (!sendOpts?.force && ((!userMsg && !selectedImage) || isSendingRef.current || isGenerating.lucy)) return;
    if (!userMsg && !selectedImage) return;

    isSendingRef.current = true;
    setIsSending(true);
    if (!customMsg) setChatInput("");
    const userImage = selectedImage;
    setSelectedImage(null);
    openLucyChat('trinity');

    poeQuickInsight(userMsg, lucyMessages as any)
      .then((res: any) => {
        if (res && res.insight) {
          setPoeInsight({ insight: res.insight, category: res.category });
          setIsInsightCollapsed(false);
          if (res.themeColor || res.currentVibe) {
            updateSharedState({
              ...(res.themeColor ? { themeColor: res.themeColor } : {}),
              ...(res.currentVibe ? { currentVibe: res.currentVibe } : {})
            }, 'TRINITY');
          }
        }
      })
      .catch(console.error);

    try {
      const profile = sharedState?.userProfile;
      let deepCoreInfo = buildDeepSynapseContext(profile);
      const soulMirrorInfo = `\n[영혼의 거울]\n- 핵심 가치: ${soulData.coreValue}\n- 무의식적 패턴: ${soulData.unconsciousPattern}\n- 취향 및 선호: ${soulData.preference}\n이 데이터를 바탕으로 사용자의 방향성을 교정하여 ���칭에 반영할 것. 또한, 이번 대화를 바탕으로 이 영혼의 거울 데이터(핵심 가치, 패턴, 취향, stats, energyFlow, emotions 등)를 갱신해야 한다면 응답의 가장 마지막에 오직 다음 포맷으로만 업데이트 내용을 출력하세요: [SOUL_UPDATE: {"coreValue":"...","unconsciousPattern":"...","preference":"...","stats":[{"subject":"...","A":85,"fullMark":100}],"energyFlow":[{"time":"...","value":80}],"emotions":[{"name":"...","value":40}]}]`;
      deepCoreInfo += "\n" + soulMirrorInfo;

      const oracleCtx = sendOpts?.oracleContext ? `\n${sendOpts.oracleContext}` : '';
      await sendUnifiedMessage(userMsg || "이 이미지 분석하고 해설해줘!", 'trinity', userImage || undefined, {
        extraSystemContext: `${deepCoreInfo}${oracleCtx}`,
        systemSuffix: undefined,
        onFinish: async (finalResponse, sentText) => {

          const soulMatch = finalResponse.match(/\[SOUL_UPDATE:\s*({[\s\S]*?})\]/);
          if (soulMatch) {
            try {
              const parsed = JSON.parse(soulMatch[1]);
              setSoulData(prev => {
                const updated = { ...prev, ...parsed };
                if (firebaseUser) {
                  const isDev = localStorage.getItem('developer_bypass') === 'true';
                  if (isDev) {
                    localStorage.setItem('soul_mirror_trinity', JSON.stringify(updated));
                  } else {
                    setDoc(doc(db, 'soul_mirror', firebaseUser.uid, 'dapps', 'trinity'), updated)
                      .catch(e => console.error("Error writing updated soul data:", e));
                  }
                }
                return updated;
              });
            } catch (e) {
              console.error("Soul update parse error", e);
            }
          }

          if (firebaseUser && localStorage.getItem('developer_bypass') !== 'true') {
            try {
              const cleanTextForSave = finalResponse
                .replace(/\[EMOTION:\s*[^\]]*\]/gi, "")
                .replace(/\[EMOTION:[\s\S]*?$/, "")
                .replace(/\[SUGGESTIONS:.*?\]/g, "")
                .replace(/\[SOUL_UPDATE:[\s\S]*$/, "")
                .trim();
              await addDoc(collection(db, "trinity_history", firebaseUser.uid, "entries"), {
                type: "chat",
                title: `우주 교감: ${sentText.slice(0, 20)}${sentText.length > 20 ? '...' : ''}`,
                content: `질문: "${sentText}"\n\n조율 메시지:\n${cleanTextForSave}`,
                createdAt: serverTimestamp(),
                metadata: {
                  question: sentText,
                  reply: cleanTextForSave
                }
              });
            } catch (error) {
              console.error("Error saving Trinity chat log:", error);
            }
          }
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

    const handleUnifiedReading = async (
    type: "daily" | "tarot",
    params?: {
      selectedCards?: TarotCard[];
      selectedCard?: TarotCard;
      autoRun?: boolean;
    },
  ) => {
    if (type === "daily") {
      const card = params?.selectedCard;
      const selectedCard = card || dailyDrawnCard;
      if (!selectedCard) {
        if (!params?.autoRun) {
          setNotice({
            open: true,
            title: "카드 선택 필요",
            message: "22장의 메이저 타로 카드 중 오늘의 카드를 먼저 선택해 주세요.",
          });
        }
        return;
      }
      if (dailyResult) {
        if (!params?.autoRun) {
          setShowDailyModal(true);
        }
        return;
      }
      if (isDailyOracleLoading) return;

      setIsDailyOracleLoading(true);

      try {
        let data: any = null;

        // Try fast dedicated server endpoint first
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 35000);

          const profile = sharedState?.userProfile || getPersistentUserProfile();
          const apiRes = await fetch("/api/ai/daily-tarot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              card: selectedCard,
              mode: dailyMode,
              comfortLevel: sessionComfortLevel,
              profile,
            }),
          });
          clearTimeout(timer);

          if (apiRes.ok) {
            const parsed = await apiRes.json();
            if (parsed && (parsed.diagnosis || parsed.summary)) {
              data = parsed;
            }
          }
        } catch (fetchErr) {
          console.warn("[Trinity Daily Tarot] Dedicated API fetch failed/timed out, using local specialized oracle engine:", fetchErr);
        }

        // Fallback to rich card-specific local engine if server response is unavailable
        if (!data || !data.diagnosis) {
          data = buildLocalTrinityDailyOracle(selectedCard, dailyMode);
        }

        if (data?.diagnosis) {
          data.diagnosis = deduplicateReadingText(data.diagnosis);
          data.diagnosis = ensureCompleteTarotReading(data.diagnosis, "오늘의 데일리 타로 리딩", [selectedCard]);
          data.diagnosis = deduplicateReadingText(data.diagnosis);
        }

        const resultWithCard = {
          ...data,
          drawnCard: selectedCard,
          dateKey: getTodayDateKey(),
        };

        setDailyResult(resultWithCard);
        setDailyDrawnCard(selectedCard);
        setIsFlipped(true);
        if (!params?.autoRun) {
          setShowDailyModal(true);
        }
        try {
          const uid = firebaseUser?.uid || "guest";
          const today = getTodayDateKey();
          localStorage.setItem(`limit_daily_trinity_${uid}_${today}`, "true");
          localStorage.setItem(`limit_daily_trinity_guest_${today}`, "true");
          localStorage.setItem(getTrinityDailyResultKey("guest"), JSON.stringify(resultWithCard));
          localStorage.setItem(getTrinityDailyResultKey(uid), JSON.stringify(resultWithCard));
          localStorage.setItem(`trinity_daily_result_guest_${today}`, JSON.stringify(resultWithCard));
          localStorage.setItem(`trinity_daily_result_${uid}_${today}`, JSON.stringify(resultWithCard));
        } catch (_) {}

        recordDailyOracleResult({
          app: 'trinity',
          featureName: '오늘의 데일리 타로',
          cardName: `${selectedCard.nameKo} (${selectedCard.name})`,
          cardKeywords: selectedCard.keywords,
          drawnCard: selectedCard,
          diagnosis: data.diagnosis || data.summary || '',
          remedy: data.remedy || '',
          spiritualEnergy: data.spiritualEnergy || '',
          blessingMessage: data.blessingMessage || '',
          frequency: data.frequency || '528Hz',
          symbol: data.symbol || selectedCard.keywords[0] || '',
          dateKey: getTodayDateKey(),
        });

        // Background non-blocking sync to cloud
        try {
          const todayK = getTodayDateKey();
          updateSharedState({
            lastTrinityDailySync: Date.now(),
            todayOracles: {
              ...(sharedState?.todayOracles || {}),
              [todayK]: {
                ...(sharedState?.todayOracles?.[todayK] || {}),
                trinity: resultWithCard,
              },
            },
            latestDailyOracles: {
              ...(sharedState?.latestDailyOracles || {}),
              trinity: resultWithCard,
            },
          }, "TRINITY");
        } catch (_) {}

        if (firebaseUser && localStorage.getItem("developer_bypass") !== "true") {
          void addDoc(collection(db, "trinity_history", firebaseUser.uid, "entries"), {
            type: "oracle-vision",
            title: `데일리 오라클: ${selectedCard.nameKo}`,
            content: `오라클 비전:\n${data.diagnosis || data.summary || data.prescription}`,
            createdAt: serverTimestamp(),
            data: resultWithCard,
            metadata: {
              card: selectedCard.name,
              comfortLevel: sessionComfortLevel,
            },
          }).catch((err) => console.error("Daily Oracle save error:", err));
        }
      } catch (e: any) {
        console.warn("[Trinity Daily Tarot] Exception caught:", e);
        const fallbackData = buildLocalTrinityDailyOracle(selectedCard, dailyMode);
        const resultWithCard = {
          ...fallbackData,
          drawnCard: selectedCard,
          dateKey: getTodayDateKey(),
        };
        setDailyResult(resultWithCard);
        setDailyDrawnCard(selectedCard);
        setIsFlipped(true);
        if (!params?.autoRun) {
          setShowDailyModal(true);
        }
      } finally {
        setIsDailyOracleLoading(false);
      }
    } else {
      // Detailed Tarot Reading Tab
      if (isTarotGenerating) return;
      const selectedCards = params?.selectedCards;
      if (!tarotConcern.trim()) {
        setNotice({
          open: true,
          title: "주제 입력 필요",
          message: "타로점의 목적이나 질문을 입력해주세요.",
        });
        return;
      }

      // 🌟 Check if this is the 1-card Daily Oracle flow from Tarot special feature
      if (isDailyTarotConcern(tarotConcern)) {
        if (isTrinityDailyLockedToday() || dailyResult?.drawnCard) {
          restoreTodayDailyResult();
          const targetCard = dailyResult?.drawnCard || dailyDrawnCard;
          if (targetCard) {
            setDrawnCards([targetCard]);
            setTarotResult(dailyResult?.diagnosis || dailyResult?.summary || "");
          }
          setNotice({
            open: true,
            title: "오늘의 타로 1일 1회 완료",
            message: "오늘의 타로는 하루 1회만 가능합니다. 오늘 이미 뽑으신 결과를 복원해 드립니다.",
          });
          return;
        }
        if (!selectedCards || selectedCards.length === 0) {
          setTarotVirtualMode(true);
          return;
        }
        // Seamlessly register daily result in the background so today's daily record is saved without jumping modes
        try {
          const uid = firebaseUser?.uid || "guest";
          const today = getTodayDateKey();
          const card = selectedCards[0];
          const localDaily = buildLocalTrinityDailyOracle(card, "oracle");
          const dailyWithCard = {
            ...localDaily,
            drawnCard: card,
            dateKey: today,
          };
          setDailyResult(dailyWithCard);
          setDailyDrawnCard(card);
          setIsFlipped(true);
          localStorage.setItem(`limit_daily_trinity_${uid}_${today}`, "true");
          localStorage.setItem(`limit_daily_trinity_guest_${today}`, "true");
          localStorage.setItem(getTrinityDailyResultKey(uid), JSON.stringify(dailyWithCard));
          localStorage.setItem(getTrinityDailyResultKey("guest"), JSON.stringify(dailyWithCard));
        } catch (_) {}
      }

      if (!selectedCards) {
        setTarotVirtualMode(true);
        return;
      }

      setIsTarotGenerating(true);
      setTarotResult("");

      try {
        const concernAnalysis = tarotConcernAnalysis;
        const binaryChoicePromptAddon = buildTarotBinaryChoicePromptAddon(concernAnalysis);
        const dailyCard = dailyResult?.drawnCard || null;
        const dailyCardContext = dailyCard
          ? {
              ...dailyCard,
              diagnosis: dailyResult?.diagnosis || dailyResult?.summary || '',
              summary: dailyResult?.summary || '',
            }
          : null;
        const profile = sharedState?.userProfile || getPersistentUserProfile();
        const sajuInfo = calculateDetailedSaju(profile);
        const sajuData = sajuInfo?.systemPromptSummary || "";
        const astroData = profile?.basic?.birthdate
          ? `생년월일: ${profile.basic.birthdate} (${profile.basic.lunarSolar === 'lunar' ? '음력' : '양력'})${profile.basic.birthtime ? ` ${profile.basic.birthtime}` : ''}${profile.basic.birthCity ? ` / 출생지: ${profile.basic.birthCity}` : ''}`
          : "";
        const contextPromptAddon = buildTarotContextPromptAddon({
          profile,
          sajuData,
          astroData,
          cards: selectedCards || undefined,
          dailyCard: dailyCardContext,
        });
        const spreadPromptAddon = buildTarotSpreadPromptAddon(
          concernAnalysis.spread,
          selectedCards,
        );
        const decisionHint =
          concernAnalysis.kind === "binary_choice"
            ? " [양자택일 질문입니다. 두 선택지 중 반드시 한쪽만 명확히 골라 주세요.]"
            : concernAnalysis.kind === "yes_no"
              ? " [예/아니오 결정 질문입니다. 반드시 3단계와 요약에 최종 판정 [YES] 또는 [NO]를 명확히 선언해 주세요.]"
              : "";
        const spreadHint = ` [자동 적용 배열법: ${concernAnalysis.spread.name} — ${concernAnalysis.spread.positions.join(", ")}]`;
        const dailyAnchorHint = dailyCard
          ? ` [오늘의 지배 카드(배경 에너지): ${dailyCard.nameKo} (${dailyCard.name})${dailyCard.reversed ? ' (역방향)' : ''}]`
          : "";

        const invokeContent: any[] = [
          {
            type: "text",
            text: `나의 고민: ${tarotConcern}. 카드를 바탕으로 해석해주세요.${decisionHint}${spreadHint}${dailyAnchorHint}`,
          },
        ];

        let systemPrompt = "";
        if (selectedCards) {
          const cardNames = selectedCards
            .map((c, i) => {
              const pos = concernAnalysis.spread.positions[i] || `${i + 1}번`;
              const orient = c.reversed ? " [역방향]" : " [정방향]";
              const d = getTarotCardDetails(c);
              const detailStr = d
                ? ` (원형: ${d.archetype}, 상징: ${d.symbolWord}, 본래 뜻: ${c.reversed ? d.reversedCore : d.uprightCore})`
                : (c.keywords?.length ? ` (키워드: ${c.keywords.slice(0, 3).join(', ')})` : '');
              return `${pos}: ${c.nameKo} (${c.name})${orient}${detailStr}`;
            })
            .join(", ");
          const dailyCardDirective = dailyCard
            ? `\n오늘의 지배 카드 (배경 에너지): ${dailyCard.nameKo} (${dailyCard.name})${dailyCard.reversed ? ' [역방향]' : ''}\n-> 이번 고민 리딩 시 오늘 하루를 이끄는 [${dailyCard.nameKo}]의 파동과 상호작용을 1단계(마음과 현재 에너지)와 4단계(실천 처방)에 필히 융합하여 서술하십시오.`
            : '';

          const tailoredGuide = buildSpreadTailoredReadingGuide(
            concernAnalysis.theme || 'general',
            concernAnalysis.spread,
            {
              optionA: concernAnalysis.optionA,
              optionB: concernAnalysis.optionB,
              concern: tarotConcern,
              sajuSummary: sajuData,
              dayMaster: sajuInfo?.dayMaster?.symbolName || sajuInfo?.dayMaster?.korean,
              yongsin: sajuInfo?.yongsin?.name,
              dominantEl: sajuInfo?.elements?.dominant?.name,
              lackingEl: sajuInfo?.elements?.lacking?.name,
            }
          );

          systemPrompt = `당신은 질문자의 가슴 깊은 고민을 꿰뚫어보고, 따뜻한 공감과 날카로운 직관으로 운명의 길을 밝혀주는 신비롭고 영험한 전문 타로 마스터 '트리니티'입니다.
실제 1:1 타로 상담실에서 촛불을 켜고 내담자의 눈을 마주 보며 카드를 한 장씩 넘겨 리딩해 주듯, 살아 숨 쉬는 생생한 대화형 어조(정중하고 기품 있는 해요체·하십시오체)로 깊은 울림을 선사하십시오.

[상담 개요]
- 내담자 고민: "${tarotConcern}"
- 적용 배열법: ${concernAnalysis.spread.name} (${concernAnalysis.spread.cardCount}장)
- 펼쳐진 카드: [${cardNames}]${dailyCardDirective}

[★ 최우선 필수 대원칙 — 뽑힌 카드의 고유한 상징과 뜻 중심의 심층 리딩]
1. **타로 본연의 도상과 상징 중심 해독**: 카드 이름만 단순 언급하고 지나가는 피상적 리딩은 절대 금지합니다. 뽑힌 모든 카드의 도상학적 상징(그림 속 인물의 표정과 자세, 손에 쥔 도구, 배경 색채, 4대 원소 기운)과 정통 타로의 본질적 의미(정방향/역방향의 깊은 뜻)를 리딩 전체의 가장 확고한 뼈대와 근거로 삼으십시오.
2. **모든 단계에서 카드의 뜻과 의미를 인용하여 전개**: 모든 단계에 걸쳐 "이 카드의 [OO 상징]과 [OO 뜻]이 보여주듯...", "카드 속 [인물/도상]이 전하는 본질적 교훈처럼..."과 같이 각 카드의 상징과 뜻을 직접 거론하며 논리적이고 입체적으로 설명하십시오.
3. **정방향과 역방향의 세밀한 뜻 구별**: 역방향 카드가 있다면, 단순히 부정적으로 치부하지 않고 에너지가 내면으로 향하거나, 억압·지연·정화가 필요한 카드의 고유한 그림자 의미를 정밀하게 짚어주십시오.

[🚫 절대 금지 규칙 — 우주물리학 비유 및 기계적 수치 언급 전면 금지]
- '화이트홀', '블랙홀', '웜홀', '사건의 지평선' 등 공상과학/우주물리학 비유나 비현실적인 용어는 일체 사용하지 마십시오.
- '손끝 물리량', '터치 체류 시간', '떨림 지수', '파동 측정' 등 인위적인 감지 지표나 수치를 결코 언급하지 마십시오.
- 오직 78장 타로 카드의 상징과 원형, 그리고 내담자의 삶과 마음에만 온전히 집중하여 진정성 있게 리딩하십시오.

[🚫 내용 중복 및 반복 서술 엄격 금지]
- 동일한 문장, 동일한 조언, 동일한 표현을 리딩 내에서 절대로 2번 이상 중복하여 서술하지 마십시오.
- 각 단계는 고유한 통찰과 관점을 담아야 하며, 앞서 언급한 카드의 해석이나 키워드를 다른 단계에서 그대로 복사하듯 반복 나열하지 마십시오.

[🔮 타로 마스터 리딩 원칙 — 보고서형 어투 절대 금지]
1. **생생한 상담실 대화체**: 딱딱한 기획서·보고서·수치 나열형은 절대 지양하십시오. 대신 실제 타로 마스터의 생동감 넘치는 호흡으로 이야기하듯 서술하십시오.
2. **깊은 공감과 날카로운 팩트폭행의 조화**: 내담자가 겪고 있는 혼란과 불안을 따뜻하게 안아주되, 카드가 경고하는 현실적 맹점이나 피해야 할 악수는 숨김없이 명쾌하고 솔직하게 짚어주십시오.
3. **스토리텔링 식 카드 융합 해독**: 카드를 개별 사전식으로 분리해 나열하지 말고, 각 위치의 상징들이 서로 인과관계를 맺으며 어떻게 흘러가는지 하나의 흥미진진한 운명의 드라마처럼 유기적으로 엮어내십시오.
4. **명확하고 흔들림 없는 결론**: 애매하게 얼버무리거나 회피하지 않고, 카드의 기운이 가리키는 방향을 마스터의 확신 있는 어조로 단호하게 선언하십시오.

${tailoredGuide.promptTemplate}${binaryChoicePromptAddon}${spreadPromptAddon}${contextPromptAddon}`;
        }

        let finalResponse = "";
        const isOneCardDaily = concernAnalysis.spread.cardCount === 1 || isDailyTarotConcern(tarotConcern);
        const maxOutputTokens = isOneCardDaily ? 3500 : 4096;
        const streamTimeoutMs = isOneCardDaily ? 35000 : 45000;

        try {
          let hasReceivedAnyChunk = false;
          const streamAbortController = new AbortController();
          const firstChunkWatchdog = setTimeout(() => {
            if (!hasReceivedAnyChunk && !finalResponse) {
              console.warn("[Tarot] First chunk watchdog triggered (18s), aborting stream for instant graceful fallback.");
              try { streamAbortController.abort(); } catch (_) {}
            }
          }, 18000);

          try {
            await invokeLLMStream({
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: invokeContent as any },
              ],
              timeoutMs: streamTimeoutMs,
              maxOutputTokens,
              signal: streamAbortController.signal,
              onChunk: (chunk) => {
                hasReceivedAnyChunk = true;
                const isFullReadingHeader = /(?:#{2,4}\s*[^#\r\n\d]*1[\.\s]|(?:\[\s*)?핵심\s*(?:3줄|세줄)?\s*요약)/i;
                if (
                  chunk.startsWith(finalResponse) ||
                  (finalResponse.length > 30 && chunk.length > finalResponse.length && chunk.includes(finalResponse.slice(0, 30)))
                ) {
                  finalResponse = chunk;
                } else if (chunk.length > 20 && finalResponse.endsWith(chunk)) {
                  // Already included
                } else if (
                  chunk.length > 50 &&
                  isFullReadingHeader.test(chunk) &&
                  (isFullReadingHeader.test(finalResponse) || finalResponse.length > 100)
                ) {
                  // Non-stream fallback or restart emitted full reading text; avoid duplication!
                  finalResponse = chunk;
                } else {
                  finalResponse += chunk;
                }
                setTarotResult(deduplicateReadingText(finalResponse));
              },
            });
          } finally {
            clearTimeout(firstChunkWatchdog);
          }
        } catch (streamErr) {
          console.warn("[Tarot] Stream failed or timed out, using local reading fallback:", streamErr);
        }

        finalResponse = deduplicateReadingText(finalResponse);
        finalResponse = ensureCompleteTarotReading(
          finalResponse,
          tarotConcern,
          selectedCards,
        );
        finalResponse = deduplicateReadingText(finalResponse);
        setTarotResult(finalResponse);

        // Synchronize dailyResult so Today's Tarot modal and tabs are 100% in sync
        if (isDailyTarotConcern(tarotConcern) && selectedCards?.[0]) {
          const card = selectedCards[0];
          const today = getTodayDateKey();
          const uid = firebaseUser?.uid || "guest";
          const quickSummary = extractConciseSummary(finalResponse).join(' ') || `${card.nameKo} 카드가 전하는 오늘의 영험한 비전입니다.`;
          const updatedDaily = {
            drawnCard: card,
            diagnosis: finalResponse,
            summary: quickSummary,
            remedy: `오늘 하루, [${card.nameKo}] 카드의 조화로운 에너지를 마음에 품기`,
            dateKey: today,
            symbol: card.keywords?.[0] || '빛',
            frequency: '528Hz',
            spiritualEnergy: `[${card.nameKo}] 카드가 오늘 하루 당신에게 든든한 안정감과 명료함을 선사합니다.`,
            blessingMessage: `오늘 하루 당신의 모든 발걸음 위에 [${card.nameKo}] 카드의 밝은 행운이 함께하길 축복합니다.`,
          };
          setDailyResult((prev: any) => ({ ...prev, ...updatedDaily }));
          try {
            localStorage.setItem(getTrinityDailyResultKey(uid), JSON.stringify(updatedDaily));
            localStorage.setItem(getTrinityDailyResultKey("guest"), JSON.stringify(updatedDaily));
            localStorage.setItem(`trinity_daily_result_${uid}_${today}`, JSON.stringify(updatedDaily));
            localStorage.setItem(`trinity_daily_result_guest_${today}`, JSON.stringify(updatedDaily));
          } catch (_) {}
        }

        if (finalResponse.trim()) {
          recordPrismFeature({
            app: 'trinity',
            featureName: '타로 스프레드 리딩',
            summary: `질문: "${tarotConcern}", 배열법: ${concernAnalysis.spread.name}, 선택 카드: [${selectedCards ? selectedCards.map(c => `${c.nameKo}${c.reversed ? '(역)' : ''}`).join(', ') : '카드'}], 리딩 결과: ${finalResponse.slice(0, 160)}...`,
            details: {
              concern: tarotConcern,
              spread: concernAnalysis.spread.name,
              cards: selectedCards?.map(c => c.nameKo),
              response: finalResponse,
            },
          });
        }

        try {
          playAiResultNotification();
        } catch (_) {}

        if (firebaseUser && finalResponse.trim() && localStorage.getItem('developer_bypass') !== 'true') {
          void addDoc(
            collection(db, "trinity_history", firebaseUser.uid, "entries"),
            {
              type: "tarot_reading",
              title: `타로 리딩: ${tarotConcern}`,
              content: `질문 고민 내용: "${tarotConcern}"\n\n타로 마스터 트리니티 리딩:\n${finalResponse}`,
              createdAt: serverTimestamp(),
              metadata: {
                concern: tarotConcern,
                spread: concernAnalysis.spread.name,
                spreadPositions: concernAnalysis.spread.positions,
                cards: selectedCards
                  ? selectedCards.map((c) => `${c.nameKo}${c.reversed ? "(역)" : ""}`)
                  : [],
                reversed: selectedCards?.map((c) => !!c.reversed),
                touchMetadata: null,
              }
            }
          ).catch((err) => {
            console.error("Tarot save error:", err);
          });
        }

      } catch (e: any) {
        setNotice({
          open: true,
          title: "통찰 실패",
          message: e.message || "타로 리딩 중 오류가 발생했습니다.",
        });
      } finally {
        setIsTarotGenerating(false);
      }
    }
  };

  const handleOracleDeepInsight = useCallback(() => {
    let targetResult = dailyResult;
    if (!targetResult) {
      try {
        const uid = firebaseUser?.uid || "guest";
        const cached = localStorage.getItem(getTrinityDailyResultKey(uid)) || localStorage.getItem("trinity_daily_result_guest");
        if (cached) {
          targetResult = JSON.parse(cached);
        }
      } catch (_) {}
    }
    if (!targetResult && dailyDrawnCard) {
      targetResult = {
        drawnCard: dailyDrawnCard,
        diagnosis: "오늘 하루 운명의 파동과 조율",
        remedy: "내면의 평정심을 지키고 직관을 신뢰하세요.",
        spiritualEnergy: "빛의 파동 동조",
      };
    }
    if (!targetResult) return;

    void handleSend(buildOracleDeepInsightUserMessage("trinity", targetResult), {
      force: true,
      oracleContext: buildOracleDeepInsightSystemContext(targetResult, "trinity"),
    });
  }, [dailyResult, dailyDrawnCard, firebaseUser, handleSend]);

  useDailyOracleFirstVisit({
    appPrefix: "trinity",
    featureKey: "trinity_oracle",
    appLockPrefix: "trinity",
    limitKeyPrefix: "limit_daily_trinity",
    uid: firebaseUser?.uid,
    enabled: !!sharedState,
    lastSync: sharedState?.lastTrinityDailySync,
    dailyResult,
    setDailyResult,
    isLoading: isDailyOracleLoading,
    historySources: trinityOracleHistory,
    oracleTypes: ["oracle-vision"],
    setShowDailyModal,
    onPrepare: () => {
      const uid = firebaseUser?.uid || "guest";
      const limitKey = `limit_daily_trinity_${uid}_${getTodayDateKey()}`;
      if (localStorage.getItem(limitKey) || isTrinityDailyLockedToday()) {
        restoreTodayDailyResult();
        return true;
      }
      return false;
    },
    runOracle: (opts) => {
      if (isTrinityDailyLockedToday()) {
        restoreTodayDailyResult();
        return Promise.resolve();
      }
      const card = pickDailySeededItem(TRINITY_CARDS, "trinity_oracle");
      setDailyDrawnCard(card);
      const idx = TRINITY_CARDS.findIndex((c) => c.id === card.id);
      setSelectedCardIdx(idx >= 0 ? idx : null);
      setIsFlipped(true);
      return handleUnifiedReading("daily", { selectedCard: card, autoRun: true });
    },
  });


  const handleTarotSubChatSubmit = async () => {
    if (!tarotChatInput.trim() || isTarotSubChatGenerating) return;

    const userMessage = tarotChatInput.trim();
    setTarotChatInput("");
    setTarotSubMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
    setIsTarotSubChatGenerating(true);

    try {
      const followUpAnalysis = analyzeTarotConcern(userMessage);
      const baseConcernAnalysis = analyzeTarotConcern(tarotConcern);
      const activeDecisionAnalysis =
        followUpAnalysis.kind !== "open" ? followUpAnalysis : baseConcernAnalysis;
      const followUpDecisionAddon = buildTarotBinaryChoicePromptAddon(activeDecisionAnalysis);
      const profile = sharedState?.userProfile || getPersistentUserProfile();
      const profileContext = profile ? `\n\n${buildDeepSynapseContext(profile)}` : "";

      const messagesForLLM = [
        {
          role: "system",
          content:
            `당신은 이전에 내려진 타로 리딩 결과를 기반으로, 질문자의 추가 질문이나 가려운 곳을 명쾌하고 직접적으로 긁어주는 타로 마스터 '트리니티'입니다.\n\n[답변 규정]\n1. 모호한 혼잣말이나 뜬구름 잡는 위로, 우주적 상징주의 같은 지루하고 추상적인 장설은 완전히 지양하십시오.\n2. 질문자의 질문에 대해서만 다이렉트로 답변하여 신속하고 똑부러지게 핵심 해결책을 짚어 주십시오.\n3. 질문자의 사주 본원 및 프로필 배경지식을 바탕으로 가장 현실적이며 직관적인 조언을 해 주십시오.${followUpDecisionAddon}${profileContext}`,
        },
        {
          role: "user",
          content: `나의 고민: ${tarotConcern}\n타로 리딩 결과: ${tarotResult}`,
        },
      ];

      tarotSubMessages.forEach((msg) => messagesForLLM.push(msg));
      messagesForLLM.push({ role: "user", content: userMessage });

      let currentResponse = "";
      setTarotSubMessages((prev) => [...prev, { role: "model", content: "" }]);

      await invokeLLMStream({
        messages: messagesForLLM as any,
        onChunk: (chunk) => {
          currentResponse += chunk;
          setTarotSubMessages((prev) => {
            const newArray = [...prev];
            newArray[newArray.length - 1] = {
              role: "model",
              content: currentResponse,
            };
            return newArray;
          });
        },
      });
    } catch (err: any) {
      setNotice({
        open: true,
        title: "오류",
        message: err.message || "답변을 가져오는 중 오류가 발생했습니다.",
      });
    } finally {
      setIsTarotSubChatGenerating(false);
    }
  };

  // 🔮 타로 연속 추가 질문 & 잔여 덱 심층 리딩 실행 엔진
  const executeFollowUpReading = async (
    questionText: string,
    chosenCard: TarotCard,
    isReversed: boolean,
  ) => {
    if (isFollowUpGenerating) return;

    const safeCard = chosenCard || TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
    const cardNameKo = safeCard.nameKo || safeCard.name || '타로 카드';
    const cardNameEn = safeCard.name || cardNameKo;
    const cardKeywords = Array.isArray(safeCard.keywords) ? safeCard.keywords.join(', ') : '';

    const newEntryId = `fu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newEntry: FollowUpTarotEntry = {
      id: newEntryId,
      question: questionText,
      card: safeCard,
      reversed: isReversed,
      reading: '',
      isGenerating: true,
      createdAt: Date.now(),
    };
    setFollowUpEntries((prev) => [...prev, newEntry]);
    setIsFollowUpGenerating(true);

    let currentText = '';
    try {
      const profile = sharedState?.userProfile || getPersistentUserProfile();
      const profileContext = profile ? `\n\n${buildDeepSynapseContext(profile)}` : '';

      const previousQAHistory = (followUpEntries || [])
        .filter((e) => e && e.card && e.reading && !e.isGenerating)
        .map(
          (e, idx) =>
            `[추가 질문 #${idx + 1}] "${e.question || '추가 질문'}"\n[뽑힌 카드] ${e.card?.nameKo || e.card?.name || '타로 카드'} (${e.reversed ? '역방향' : '정방향'})\n[해설] ${(e.reading || '').slice(0, 300)}`,
        )
        .join('\n\n');

      const effectiveConcern = tarotConcern || (dailyResult ? '오늘의 데일리 타로' : '타로 리딩');
      const effectiveDrawnCards = (drawnCards && drawnCards.length > 0)
        ? drawnCards
        : (dailyResult?.drawnCard ? [dailyResult.drawnCard] : (dailyDrawnCard ? [dailyDrawnCard] : []));
      const effectiveInitialSummary = tarotResult || dailyResult?.diagnosis || dailyResult?.summary || '';

      const messagesForLLM = [
        {
          role: 'system',
          content: `당신은 78장 타로 마스터 '트리니티'입니다. 질문자가 초기 리딩에 이어 78장 덱 중 이미 뽑힌 카드를 제외하고 남은 덱에서 새 카드를 추가로 뽑아 연속 질문을 던졌습니다.

[답변 규정]
1. 모호한 미사여구나 불필요한 장설, 뜬구름 잡는 우주적 추상주의는 완전히 지양하십시오.
2. 질문자가 던진 구체적인 질문에 대하여, 새로 뽑힌 추가 카드의 상징과 정/역방향 에너지를 직관적으로 관통하여 날카롭고 똑부러지게 답변하십시오.
3. 최초 질문 및 초기 리딩의 맥락을 완벽히 계승하되 중복 설명을 피하고, 이번 질문에 대한 즉각적이고 실천 가능한 현실적 해결책과 행동 지침을 제시하십시오.
4. 한국어로 품격 있고 신뢰감 넘치는 마스터의 어조를 유지하십시오.${profileContext}`,
        },
        {
          role: 'user',
          content: `[최초 고민] "${effectiveConcern}"
[초기 선택 카드] ${effectiveDrawnCards.map((c: any) => `${c?.nameKo || c?.name || '카드'}(${c?.reversed ? '역방향' : '정방향'})`).join(', ')}
[초기 리딩 요약] ${effectiveInitialSummary ? effectiveInitialSummary.slice(0, 500) : ''}
${previousQAHistory ? `\n[이전 추가질문 이력]\n${previousQAHistory}\n` : ''}
[새로 뽑힌 추가 카드] ${cardNameKo} (${cardNameEn}) - ${isReversed ? '역방향' : '정방향'} / 키워드: ${cardKeywords}
[이번 추가 질문] "${questionText}"`,
        },
      ];

      const fullGenerated = await invokeLLMStream({
        messages: messagesForLLM as any,
        onChunk: (chunk) => {
          currentText += chunk;
          setFollowUpEntries((prev) =>
            prev.map((e) => (e.id === newEntryId ? { ...e, reading: currentText } : e)),
          );
        },
      });

      const finalText = fullGenerated || currentText;
      setFollowUpEntries((prev) =>
        prev.map((e) =>
          e.id === newEntryId ? { ...e, reading: finalText, isGenerating: false } : e,
        ),
      );
      playAudioHaptic('card_draw');
    } catch (err: any) {
      console.warn('[executeFollowUpReading] Streaming interrupted, applying robust master interpretation:', err);
      const fallbackReading = `${cardNameKo} (${isReversed ? '역방향' : '정방향'})의 에너지는 현재 상황의 이면에 잠재된 핵심 실마리를 드러내고 있습니다. 기존의 혼란스러운 생각에 매몰되기보다는, 카드가 일깨우는 본연의 지혜와 직관을 신뢰하며 명확하고 주체적인 선택을 내리시길 권합니다.`;
      setFollowUpEntries((prev) =>
        prev.map((e) =>
          e.id === newEntryId
            ? { ...e, reading: currentText.trim() ? currentText : fallbackReading, isGenerating: false }
            : e,
        ),
      );
      playAudioHaptic('card_draw');
    } finally {
      setIsFollowUpGenerating(false);
    }
  };

  const handleDirectFollowUpDraw = (questionText: string) => {
    setPendingFollowUpQuestion(questionText);
    setShowFollowUpWheelModal(true);
  };

  const handleAutoFollowUpDraw = (questionText: string) => {
    if (isFollowUpGenerating) return;
    if (remainingDeck.length === 0) return;
    const randomIndex = Math.floor(Math.random() * remainingDeck.length);
    const chosenCard = remainingDeck[randomIndex];
    const isReversed = Math.random() < 0.35;
    playAudioHaptic('card_draw');
    executeFollowUpReading(questionText, chosenCard, isReversed);
  };

  const handleFollowUpWheelComplete = (selected: any[]) => {
    setShowFollowUpWheelModal(false);
    if (!selected || selected.length === 0) return;
    const card = selected[0];
    const reversed = !!card.reversed;
    const q = pendingFollowUpQuestion || '이 흐름에 대한 추가 통찰과 조언';
    setPendingFollowUpQuestion('');
    executeFollowUpReading(q, card, reversed);
  };

  const handleDailySubChatSubmit = async () => {
    if (!dailyChatInput.trim() || isDailySubChatGenerating) return;

    const userMessage = dailyChatInput.trim();
    setDailyChatInput("");
    setDailySubMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
    setIsDailySubChatGenerating(true);

    try {
      const drawn = dailyResult?.drawnCard || dailyDrawnCard;
      const cardName = drawn
        ? `${drawn.nameKo} (${drawn.name})${drawn.reversed ? " [역방향]" : " [정방향]"}`
        : "오늘의 오라클 카드";
      const diagnosisContent =
        dailyResult?.diagnosis || dailyResult?.summary || "";

      const followUpAnalysis = analyzeTarotConcern(userMessage);
      const followUpDecisionAddon = buildTarotBinaryChoicePromptAddon(followUpAnalysis);
      const profile = sharedState?.userProfile || getPersistentUserProfile();
      const profileContext = profile ? `\n\n${buildDeepSynapseContext(profile)}` : "";

      const messagesForLLM = [
        {
          role: "system",
          content: `당신은 질문자가 뽑은 오늘의 타로 카드 [${cardName}]와 그에 따른 오늘의 인과관계 비전 해독 결과를 기반으로, 질문자의 추가 질문이나 궁금증을 명쾌하고 직접적으로 짚어주는 초정밀 타로 마스터 '트리니티'입니다.\n\n[답변 규정]\n1. 모호한 혼잣말이나 뜬구름 잡는 위로, 추상적인 우주 상징주의 같은 지루한 장설은 완전히 지양하십시오.\n2. 질문자가 뽑은 [${cardName}]의 에너지 및 사주 본원/프로필 배경지식과 연계하여, 질문자의 질문에 대해 다이렉트로 현실적이고 실천 가능한 직관적 조언을 해주십시오.\n3. 말을 돌리지 않고 핵심 해결책을 단도직입적으로 짚어 주십시오.${followUpDecisionAddon}${profileContext}`,
        },
        {
          role: "user",
          content: `오늘 뽑은 카드: ${cardName}\n오늘의 비전 해독 결과: ${diagnosisContent}`,
        },
      ];

      dailySubMessages.forEach((msg) => messagesForLLM.push(msg));
      messagesForLLM.push({ role: "user", content: userMessage });

      let currentResponse = "";
      setDailySubMessages((prev) => [...prev, { role: "model", content: "" }]);

      await invokeLLMStream({
        messages: messagesForLLM as any,
        onChunk: (chunk) => {
          currentResponse += chunk;
          setDailySubMessages((prev) => {
            const newArray = [...prev];
            newArray[newArray.length - 1] = {
              role: "model",
              content: currentResponse,
            };
            return newArray;
          });
        },
      });
    } catch (err: any) {
      setNotice({
        open: true,
        title: "오류",
        message: err.message || "답변을 가져오는 중 오류가 발생했습니다.",
      });
    } finally {
      setIsDailySubChatGenerating(false);
    }
  };

  const handleEnergyAnalysis = async () => {
    setIsMeasuringInsight(true);
    setInsightResult(null);

    const userProfileStr = sharedState?.userProfile
      ? JSON.stringify(sharedState.userProfile)
      : JSON.stringify(form);
    const recentMemory =
      sharedState?.trinityMemory ||
      sharedState?.globalMemory ||
      "최근 기록 없음";
    const dailyContext = dailyResult
      ? `오늘의 Daily 진단: ${dailyResult.diagnosis || dailyResult.summary || dailyResult.prescription}`
      : "오늘의 Daily 진단 데이터 없음";

    try {
      const data = await invokeLLMStructured({
        messages: [
          {
            role: "system",
            content: `당신은 최고 수준의 운명 오라클 마스터 트리니티입니다. 사용자의 프로필, 자아 성향, 생년월일, 태어난 시간 및 오늘의 데일리 상징을 종합하여 실시간 우주적 에너지 흐름과 운명 점수(Luck, Love, Wealth, Health)를 고도화된 마이크로 분석 리포트로 리턴하십시오. [데이터 가이드: 프로필(${userProfileStr}), 최근상태(${recentMemory}), 데일리진단(${dailyContext})]\n각 스코어는 0-100 사이 숫자로 반환할 것.`,
          },
          {
            role: "user",
            content: `이름: ${form.name || sharedState?.userProfile?.basic?.name}, 닉네임: ${form.nickname || sharedState?.userProfile?.basic?.nickname}, 생년월일: ${form.birthdate || sharedState?.userProfile?.basic?.birthdate}, 성별: ${form.gender}. 현재 내 영적 오라클 ���파수와 에너지 레벨, 연애운, 재물운, 소울 상태를 심도 있게 통찰하고 처방을 내려줘.`,
          },
        ],
        schema: EnergyAnalysisSchema as any,
      });

      setInsightResult(data);
      updateSharedState({ lastTrinitySoulSync: Date.now() }, "TRINITY");

      if (firebaseUser && localStorage.getItem("developer_bypass") !== "true") {
        try {
          await addDoc(collection(db, "trinity_history", firebaseUser.uid, "entries"), {
            type: "SOUL_PROFILE",
            ...data,
            createdAt: serverTimestamp(),
            title: "Soul Energy Analysis",
          });
        } catch (err) {
          console.error("Soul analysis save error:", err);
        }
      }
    } catch (err: any) {
      console.error(err);
      setNotice({
        open: true,
        title: "통찰 실패",
        message: err.message || "에너지 심층 처방 분석 중 우주적 연결 오류가 발생했습니다.",
      });
    } finally {
      setIsMeasuringInsight(false);
    }
  };

  const handleSaveProfile = async () => {
    const existingProfile = sharedState?.userProfile || getPersistentUserProfile() || {};
    const profile: UserProfile = mergeUserProfiles(existingProfile, {
      basic: {
        ...(form.name ? { name: form.name } : {}),
        ...(form.nickname ? { nickname: form.nickname } : {}),
        ...(form.birthdate ? { birthdate: form.birthdate } : {}),
        ...(form.birthtime ? { birthtime: form.birthtime } : {}),
        ...(form.gender ? { gender: form.gender === "남성" ? "male" : "female" } : {}),
        ...(form.city ? { birthCity: form.city } : {}),
      },
    });
    try {
      await updateSharedState({ userProfile: profile }, "TRINITY");
      setPersistentUserProfile(profile);
      setIsEditingProfile(false);
      handleEnergyAnalysis();
    } catch (err: any) {
      setNotice({
        open: true,
        title: "저장 실패",
        message: "프로필 저장 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <div className="h-app-full w-full flex flex-col relative overflow-hidden font-sans bg-transparent">

      {/* Top Left Branding */}
      <motion.div
        initial={{ y: -8, opacity: 0.88 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-safe-2 left-2 sm:left-4 md:top-safe-4 md:left-6 pointer-events-auto z-[110] transition-opacity duration-300 ${isSpecialFeatureChromeHidden ? SPECIAL_FEATURE_CHROME_HIDDEN_CLASS : 'opacity-100'}`}
      >
         <div className="flex items-center gap-2.5 sm:gap-3">
            <div 
              className="relative w-11 h-11 rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] group backdrop-blur-md cursor-pointer transition-transform active:scale-95 shrink-0" 
              onClick={() => openChannelIntro('trinity')}
              title="트리니티 오라클 채널 소개 (클릭)"
            >
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} 
                 className="absolute inset-0 rounded-full border border-dashed border-yellow-400/40 group-hover:border-yellow-400 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all" 
               />
               <div className="absolute inset-[3px] rounded-full border border-yellow-400/30 bg-yellow-500/10 group-hover:bg-yellow-500/20 flex items-center justify-center transition-all">
                  <Sparkles size={20} className="relative z-10 text-yellow-400 drop-shadow-[0_0_12px_currentColor] transition-transform group-hover:scale-110 duration-300 animate-pulse" strokeWidth={1.5} />
               </div>
            </div>
            <div className="cursor-pointer flex flex-col justify-center select-none" onClick={() => navigate('/')}>
               <h1><LucKeyLogoText /></h1>
               <p className="text-[8px] md:text-[9px] text-white/40 uppercase tracking-widest font-bold font-sans leading-none mt-0.5">TRINITY • CELESTIAL ORACLE</p>
            </div>
         </div>
      </motion.div>

      {/* Trinity Navigation Menu - Top Navigation */}
      <motion.nav
        initial={{ y: -10, x: '-50%', opacity: 0.88 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`prism-xs-subnav fixed top-safe-nav md:top-safe-nav-md left-1/2 z-[100] flex items-center gap-1 p-1 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl max-w-[95vw] overflow-x-auto no-scrollbar md:max-w-fit md:overflow-visible transition-opacity duration-300 ${isSpecialFeatureChromeHidden ? SPECIAL_FEATURE_CHROME_HIDDEN_CLASS : 'opacity-100'}`}
      >
        {[
          { id: "destiny", icon: Compass, label: "SAJU" },
          { id: "tarot", icon: TarotCardIcon as any, label: "TAROT" },
          { id: "oracle", icon: Sparkles, label: "ORACLE" },
        ].map((item) => {
          const isActive = activeMode === item.id || (item.id === 'oracle' && activeMode === 'synergy');
          return (
            <button
               key={item.id}
              onClick={() => {
                if (item.id === "tarot") {
                  resetTarotSession(true);
                  setActiveMode("tarot");
                  setIsChatOpen(false);
                  return;
                }
                setActiveMode(item.id as any);
              }}
              className={`prism-subnav-btn flex shrink-0 whitespace-nowrap items-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-yellow-600 text-white shadow-lg shadow-yellow-500/20 border border-yellow-500/30"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={16} className={isActive ? "animate-pulse" : ""} />
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isActive
                    ? "opacity-100"
                    : "opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </motion.nav>


      {/* Main Layout Area — 동일 앱 내에서만 탭 스와이프 전환 지원 및 브라우저 외부 이탈 방지 */}
      <main
        data-app-scroll-root
        {...trinitySwipeHandlers}
        className="flex-1 w-full pt-page pb-page md:pt-page-md md:pb-page-md flex flex-col relative z-10 overflow-y-auto no-scrollbar scroll-smooth text-white touch-pan-y overscroll-x-none"
      >
        <div className="max-w-5xl w-full mx-auto px-3 sm:px-6 prism-xs-pad flex-1 flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            {activeMode === "oracle" || activeMode === "synergy" ? (
              <motion.div
                key="trinity-oracle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full pb-8 sm:pb-12"
              >
                <TrinityOracleSection
                  onNavigateToTarot={(focusDaily = true) => {
                    resetTarotSession(true);
                    if (focusDaily) {
                      setTarotConcern("오늘의 타로");
                      restoreTodayDailyResult();
                      const targetCard = dailyResult?.drawnCard || dailyDrawnCard;
                      if (targetCard) {
                        setDrawnCards([targetCard]);
                        setTarotResult(dailyResult?.diagnosis || dailyResult?.summary || "");
                        setHideTarotPopup(false);
                      }
                    }
                    setActiveMode("tarot");
                    setIsChatOpen(false);
                  }}
                />
              </motion.div>
            ) : activeMode === "tarot" ? (
              <motion.div
                key="tarot"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl mx-auto space-y-8 pb-8 sm:pb-12"
              >
                <div className="glass relative w-full p-5 sm:p-8 md:p-10 rounded-[32px] sm:rounded-[40px] bg-white/[0.04] sm:bg-white/[0.06] border border-yellow-400/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col my-4 backdrop-blur-2xl">
                  {/* Subtle starlight gold specular glow */}
                  <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-yellow-500/10 blur-[100px] pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/10 mb-6 shrink-0 bg-white/[0.02] -mx-5 -mt-5 sm:-mx-8 sm:-mt-8 md:-mx-10 md:-mt-10 px-5 pt-5 sm:px-8 sm:pt-8 md:px-10 md:pt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <TarotCardIcon size={20} className="text-yellow-400 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-white tracking-tight">Tarot Reading (78장 타로 오라클)</h2>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-400/30 uppercase tracking-wider">
                            TRINITY 특수기능
                          </span>
                        </div>
                        <p className="text-xs text-white/60 font-sans">
                          천상의 78장 타로 휠 · 심층 AI 오라클 리딩
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowTarotCardBackModal(true)}
                        className="px-3 py-1.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                        title="Quin 스타일 20종 타로 카드 뒷면 덱 커스텀"
                      >
                        <Palette size={13} />
                        <span className="hidden sm:inline">덱 뒷면 ({tarotBackTheme.nameKo})</span>
                        <span className="sm:hidden">덱 뒷면</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full">
                  {tarotVirtualMode && (
                    <TarotSpread
                      maxCards={tarotSpreadRecommendation.cardCount}
                      positions={tarotSpreadRecommendation.positions}
                      spreadName={tarotSpreadRecommendation.name}
                      spreadReason={tarotSpreadRecommendation.reason}
                      concern={tarotConcern}
                      onCancel={() => setTarotVirtualMode(false)}
                      onComplete={(cards) => {
                        setTarotVirtualMode(false);
                        setDrawnCards(cards);
                        setHideTarotPopup(false);
                        handleUnifiedReading("tarot", { selectedCards: cards });
                      }}
                    />
                  )}
                  <div className="relative z-10 w-full scroll-smooth flex flex-col">
                      <div className="space-y-6 flex-1 flex flex-col justify-between w-full">
                        {!drawnCards &&
                        !tarotResult &&
                        !isTarotGenerating ? (
                          <div className="space-y-4 flex-1 flex flex-col justify-between w-full">
                            {/* 🌟 Cosmic Anchor Badge (Today's Ruling Card Background Energy - ONLY if today's reading is completed and not currently doing daily tarot concern) */}
                            {dailyResult?.drawnCard && !isDailyTarotConcern(tarotConcern) && (
                              <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-inner">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 shrink-0 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                                    <Sparkles size={16} className="animate-pulse" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-400">
                                        오늘의 지배 카드 (Cosmic Anchor)
                                      </span>
                                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-200 border border-yellow-400/30">
                                        배경 에너지 활성화
                                      </span>
                                    </div>
                                    <p className="text-xs text-white/90 font-medium break-keep break-words mt-0.5">
                                      ✨ {dailyResult.drawnCard.nameKo} ({dailyResult.drawnCard.name}) {dailyResult.drawnCard.reversed ? "· 역방향" : "· 정방향"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      restoreTodayDailyResult();
                                      const targetCard = dailyResult?.drawnCard || dailyDrawnCard;
                                      if (targetCard) {
                                        setTarotConcern("오늘의 타로");
                                        setDrawnCards([targetCard]);
                                        setTarotResult(dailyResult?.diagnosis || dailyResult?.summary || "");
                                        setHideTarotPopup(false);
                                      } else {
                                        setShowDailyModal(true);
                                      }
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500/25 to-amber-500/20 hover:from-yellow-500/35 hover:to-amber-500/30 border border-yellow-400/40 text-[11px] text-yellow-200 font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                                    title="오늘의 타로 결과 및 음성 낭독 보기"
                                  >
                                    <Sparkles size={12} className="text-yellow-400" />
                                    <span>오늘의 타로 결과 보기</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {!isDailyTarotChecked ? (
                              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-yellow-500/15 via-amber-500/10 to-purple-950/20 border border-yellow-500/40 shadow-xl space-y-4 text-center my-4">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold">
                                  <Sparkles size={14} className="text-yellow-400 animate-pulse" />
                                  <span>오늘의 타로 필수 확인 안내</span>
                                </div>
                                <div className="space-y-2 max-w-lg mx-auto">
                                  <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                                    오늘의 타로를 먼저 확인해 주세요 🌟
                                  </h3>
                                  <p className="text-xs text-white/80 leading-relaxed break-keep">
                                    개인 맞춤 타로 고민과 다양한 배열법 리딩을 진행하시려면 먼저 오늘 하루를 이끄는 천상의 지배 카드(오늘의 타로)를 확인해야 합니다. 오늘의 우주 에너지를 먼저 마주해 보세요!
                                  </p>
                                </div>
                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTarotConcern("오늘의 타로");
                                      setCustomSpread(null);
                                      const targetCard = dailyResult?.drawnCard || dailyDrawnCard;
                                      if (targetCard) {
                                        setShowDailyModal(true);
                                      } else {
                                        handleUnifiedReading("tarot");
                                      }
                                    }}
                                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black font-extrabold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-all cursor-pointer active:scale-95"
                                  >
                                    <Sparkles size={16} />
                                    <span>🌟 오늘의 타로 원카드 지금 확인하기</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="space-y-3 text-left w-full overflow-hidden">
                                  <div className="flex items-center justify-between pl-2">
                                    <label className="text-xs text-white/50 font-bold uppercase tracking-widest block">
                                      Your Concern
                                    </label>
                                <button
                                  type="button"
                                  onClick={() => setIsSpreadModalOpen(true)}
                                  className="text-[11px] text-yellow-300 hover:text-yellow-200 font-bold font-sans flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 transition-all cursor-pointer shadow-sm active:scale-95 group"
                                  title="타로 배열법 직접 선택 모달 열기"
                                >
                                  <Layers size={13} className="text-yellow-400 group-hover:rotate-12 transition-transform" />
                                  <span>배열법 선택</span>
                                  <ChevronRight size={13} className="text-yellow-400/70 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              </div>

                              {/* Popular Spread Preset Pills */}
                              <div className="flex items-center gap-1.5 overflow-x-auto select-none pb-1 scroll-smooth [scrollbar-width:none]">
                                <button
                                  type="button"
                                  onClick={() => setIsSpreadModalOpen(true)}
                                  className="flex-none px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 border-yellow-500/40 text-yellow-300 hover:border-yellow-400 hover:bg-yellow-500/30"
                                  title="전체 타로 배열법 검색 및 직접 선택 모달 열기"
                                >
                                  <Layers size={12} className="text-yellow-400" />
                                  <span>🎴 전체 배열법 선택</span>
                                </button>
                                {POPULAR_TAROT_SPREAD_PRESETS.map((preset) => {
                                  const isSelected = tarotSpreadRecommendation.theme === preset.theme;
                                  return (
                                    <button
                                      key={preset.theme}
                                      type="button"
                                      onClick={() => {
                                        setTarotConcern(preset.defaultPrompt);
                                        setCustomSpread(buildSpreadForTheme(preset.theme, { kind: 'open' }));
                                      }}
                                      className={`flex-none px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm ${
                                        isSelected
                                          ? 'bg-yellow-500/25 border-yellow-400/60 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                                      }`}
                                      title={preset.desc}
                                    >
                                      <span>{preset.name}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="relative">
                                <textarea
                                  value={tarotConcern}
                                  onChange={(e) => {
                                    setTarotConcern(e.target.value);
                                    if (customSpread) {
                                      setCustomSpread(null);
                                    }
                                  }}
                                  placeholder="타로에게 물어보고 싶은 고민을 상세히 적어주세요 (예: 이직할까 말까, 그 사람 속마음, 올해 재물운, 시험 합격 여부 등)..."
                                  className="w-full h-36 bg-black/30 border border-white/10 rounded-2xl p-5 text-white font-sans focus:outline-none focus:border-yellow-500/50 transition-all resize-none placeholder:text-white/20 leading-relaxed text-sm pr-10"
                                />
                                {tarotConcern.trim().length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTarotConcern('');
                                      setCustomSpread(null);
                                    }}
                                    className="absolute right-3.5 top-3.5 p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/50 hover:text-white transition-all text-xs cursor-pointer"
                                    title="고민 내용 지우기"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>

                              {/* Live Real-time AI Spread Recommendation Indicator */}
                              {tarotConcern.trim().length > 0 && (
                                <div className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-yellow-500/5 border border-yellow-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm text-left">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping shrink-0" />
                                    <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-300 font-bold text-[11px] shrink-0 border border-yellow-500/40">
                                      {tarotConcernAnalysis.themeEmoji} {tarotConcernAnalysis.themeLabel}
                                    </span>
                                    <span className="text-white/90 text-xs truncate">
                                      고민 감지 ➔ <strong className="text-yellow-300 font-bold">{tarotSpreadRecommendation.name}</strong> ({tarotSpreadRecommendation.cardCount}장)
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                                    {isAutoRecommended ? (
                                      <span className="text-[10px] font-mono text-yellow-400 bg-yellow-500/15 px-2.5 py-1 rounded-full border border-yellow-500/30 font-bold flex items-center gap-1">
                                        <Sparkles size={11} className="text-yellow-400 animate-pulse" />
                                        AI 맞춤 추천 적용됨
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => setCustomSpread(null)}
                                        className="text-[10px] font-bold text-yellow-300 hover:text-yellow-100 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                                        title="현재 작성한 고민에 맞춘 AI 자동 추천 배열법으로 전환"
                                      >
                                        <RotateCcw size={11} />
                                        <span>AI 맞춤 추천으로 복원</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Clickable Tarot Spread Recommendation / Custom Spread Card */}
                              <div
                                onClick={() => setIsSpreadModalOpen(true)}
                                className="rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-black/40 to-yellow-500/5 hover:border-yellow-400/60 hover:bg-yellow-500/15 p-4 transition-all cursor-pointer group shadow-md active:scale-[0.99] relative overflow-hidden text-left"
                                title="클릭하여 타로 배열법 직접 선택 / 변경하기"
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 font-mono flex items-center gap-1">
                                      <Sparkles size={11} className="text-yellow-400 animate-pulse" />
                                      <span>
                                        {isAutoRecommended
                                          ? `AI 맞춤 추천: ${tarotConcernAnalysis.themeEmoji} ${tarotConcernAnalysis.themeLabel}`
                                          : '직접 선택한 배열법'}
                                      </span>
                                    </span>
                                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-bold font-mono">
                                      {tarotSpreadRecommendation.cardCount}장
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[11px] text-yellow-300/90 group-hover:text-yellow-200 font-bold transition-colors">
                                    <Layers size={13} className="text-yellow-400" />
                                    <span>배열법 선택 / 변경</span>
                                    <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                  </div>
                                </div>
                                <p className="text-sm text-white font-bold group-hover:text-yellow-200 transition-colors flex items-center gap-1.5">
                                  <span>{tarotSpreadRecommendation.name}</span>
                                </p>
                                <p className="text-[11px] text-yellow-200/95 mt-1 leading-relaxed break-keep font-medium">
                                  💡 {tarotConcernAnalysis.recommendationReason}
                                </p>
                                {tarotSpreadRecommendation.reason && tarotSpreadRecommendation.reason !== tarotConcernAnalysis.recommendationReason && (
                                  <p className="text-[10px] text-white/50 mt-0.5 leading-relaxed break-keep">
                                    {tarotSpreadRecommendation.reason}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-1 mt-2.5">
                                  {tarotSpreadRecommendation.positions.map((pos, pIdx) => (
                                    <span
                                      key={pIdx}
                                      className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-black/50 border border-white/10 text-white/70"
                                    >
                                      {pos}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {(smartTarotQuestions.length > 0 || isGeneratingQuestions) && (
                              <div className="space-y-2 mt-2 w-full text-left">
                                <span className="text-[10px] text-yellow-400/90 font-bold uppercase tracking-wider pl-2 flex items-center gap-1">
                                  <Wand2 size={10} /> AI 맞춤 질문
                                  {isGeneratingQuestions && <RefreshCw size={8} className="animate-spin text-yellow-400" />}
                                </span>
                                <div 
                                  onWheel={(e) => {
                                    if (e.currentTarget) {
                                      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
                                      e.currentTarget.scrollLeft += delta * 1.5;
                                    }
                                  }}
                                  className="flex items-center gap-2 overflow-x-auto select-none px-1 pb-2 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(234,179,8,0.3)_transparent]"
                                >
                                  {smartTarotQuestions.map((q, idx) => (
                                    <button
                                      key={`smart-${idx}`}
                                      type="button"
                                      onClick={() => {
                                        setTarotConcern(q);
                                        setCustomSpread(null);
                                      }}
                                      className="flex-none px-4 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-200/90 hover:bg-yellow-500/20 hover:border-yellow-400/40 active:scale-[0.98] transition-all font-sans whitespace-nowrap cursor-pointer shadow-sm"
                                    >
                                      {q}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {!tarotConcern.trim() && (
                              <div className="space-y-2 mt-2 w-full text-left">
                                <div className="flex items-center justify-between pl-2 pr-1">
                                  <span className="text-[10px] text-yellow-500/80 font-bold uppercase tracking-wider flex items-center gap-1 font-sans">
                                    <Sparkles size={10} className="animate-pulse" /> 맞춤 고민 질문 예시
                                  </span>
                                  <button
                                    type="button"
                                    onClick={handleRefreshTarotSuggestions}
                                    className="flex items-center gap-1.5 text-[10px] text-yellow-500/60 hover:text-yellow-400 font-bold transition-all cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full border border-yellow-500/10 hover:border-yellow-500/30 active:scale-95"
                                  >
                                    <RefreshCw size={8} className="animate-pulse" /> 다른 우주 고민 보기
                                  </button>
                                </div>
                                <div 
                                  onWheel={(e) => {
                                    if (e.currentTarget) {
                                      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
                                      e.currentTarget.scrollLeft += delta * 1.5;
                                    }
                                  }}
                                  className="flex items-center gap-2 overflow-x-auto select-none px-1 pb-2 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(234,179,8,0.3)_transparent]"
                                >
                                  {tarotSuggestions.map((q, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        setTarotConcern(q);
                                        setCustomSpread(null);
                                      }}
                                      className="flex-none px-4 py-2.5 rounded-xl bg-white/5 border border-yellow-500/15 text-xs text-yellow-500/90 hover:bg-yellow-500/15 hover:border-yellow-500/30 hover:text-yellow-300 active:scale-[0.98] transition-all font-sans whitespace-nowrap cursor-pointer shadow-sm"
                                    >
                                      {q}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-4 flex flex-col gap-3 w-full">
                              {isDailyTarotConcern(tarotConcern) && isTrinityDailyLockedToday() ? (
                                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      restoreTodayDailyResult();
                                      const targetCard = dailyResult?.drawnCard || dailyDrawnCard;
                                      if (targetCard) {
                                        setTarotConcern("오늘의 타로");
                                        setDrawnCards([targetCard]);
                                        setTarotResult(dailyResult?.diagnosis || dailyResult?.summary || "");
                                        setHideTarotPopup(false);
                                      } else {
                                        setShowDailyModal(true);
                                      }
                                    }}
                                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black font-extrabold tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(234,179,8,0.4)] cursor-pointer text-xs"
                                    title="오늘의 타로 결과 및 음성 낭독 보기"
                                  >
                                    <Sparkles size={16} />
                                    <span>오늘의 타로 결과 보기 (음성 낭독 지원)</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full">
                                  {/* In-App Interactive Wheel Draw */}
                                  <button
                                    type="button"
                                    onClick={() => handleUnifiedReading("tarot")}
                                    disabled={isTarotGenerating || !tarotConcern.trim()}
                                    className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-500 hover:from-yellow-500 hover:to-amber-500 text-white font-bold tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(234,179,8,0.3)] cursor-pointer text-xs uppercase active:scale-[0.98]"
                                  >
                                    {isTarotGenerating ? (
                                      <RefreshCw className="animate-spin" size={18} />
                                    ) : (
                                      <>
                                        <TarotCardIcon size={18} />
                                        <span>
                                          {tarotSpreadRecommendation.cardCount === 1
                                            ? "78장 타로 휠 1장 뽑기"
                                            : `78장 타로 휠 펼치기 (${tarotSpreadRecommendation.cardCount}장 뽑기)`}
                                        </span>
                                      </>
                                    )}
                                  </button>

                                  {/* Quin Style Physical / Manual Input Mode */}
                                  <button
                                    type="button"
                                    onClick={() => setShowPhysicalTarotModal(true)}
                                    disabled={isTarotGenerating}
                                    className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-yellow-500/30 hover:border-yellow-400/60 text-yellow-200 font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-xs active:scale-[0.98]"
                                    title="소장하신 실물 카드로 직접 뽑았거나 원하는 카드를 지정하여 AI 심층 리딩 받기"
                                  >
                                    <BookOpen size={17} className="text-yellow-400" />
                                    <span>실물 카드 직접 입력</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col overflow-hidden relative w-full text-left">
                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 pb-6">
                              {drawnCards && (
                                <motion.div
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                  className="space-y-2.5"
                                >
                                  <div className="flex items-center justify-between gap-2 flex-wrap px-1 text-center">
                                    <p className="text-[10px] text-yellow-500/80 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                      <Sparkles size={11} className="text-yellow-400 animate-pulse" />
                                      <span>{tarotSpreadRecommendation.name} ({drawnCards.length}장 스프레드)</span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-yellow-300/70 font-sans flex items-center gap-1">
                                        <ZoomIn size={11} className="text-yellow-400" />
                                        <span>(카드 클릭 시 3D 확대)</span>
                                      </span>
                                    </div>
                                  </div>

                                  {/* 3D Flipping Cards Spread Container */}
                                  <motion.div
                                    key={`spread-cards-cycle-${cardFlipCycle}`}
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                      hidden: { opacity: 0 },
                                      visible: {
                                        opacity: 1,
                                        transition: {
                                          staggerChildren: 0.1,
                                          delayChildren: 0.05,
                                        },
                                      },
                                    }}
                                    className="flex gap-3.5 flex-wrap justify-center p-3 max-w-full relative"
                                    style={{ perspective: 1200 }}
                                  >
                                    {/* Cosmic Starlight Altar Ambient Shimmer Glow */}
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.07)_0%,transparent_75%)] pointer-events-none tarot-ambient-shimmer-layer -z-10" />
                                    {drawnCards.map((c, i) => {
                                      const positionLabel = tarotSpreadRecommendation.positions[i] || `${i + 1}번`;
                                      const isRev = Boolean(
                                        c.reversed === true ||
                                        c.reversed === ('true' as any) ||
                                        (c as any)?.isReversed === true ||
                                        (c as any)?.isReversed === 'true' ||
                                        (c as any)?.orientation === 'reversed' ||
                                        (c.nameKo && (c.nameKo.includes('(역)') || c.nameKo.includes('(역방향)'))) ||
                                        (c.name && (c.name.includes('(Rev)') || c.name.includes('(Reversed)')))
                                      );
                                      const cardWithRev = { ...c, reversed: isRev };
                                      return (
                                        <TarotFlippingCard
                                          key={`${c.id}-${i}-${cardFlipCycle}`}
                                          card={cardWithRev}
                                          index={i}
                                          slotName={positionLabel}
                                          onClick={() => setZoomedCard({ card: cardWithRev, slotName: positionLabel })}
                                        />
                                      );
                                    })}
                                  </motion.div>
                                </motion.div>
                              )}

                              {(tarotResult || isTarotGenerating) && (
                                <div className="glass p-5 rounded-2xl border border-yellow-500/30 shadow-2xl flex flex-col relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 blur-[60px] pointer-events-none rounded-full" />
                                  <div className="flex justify-between items-center mb-4 shrink-0 relative z-10 w-full font-sans">
                                    <div className="flex items-center gap-2 text-yellow-400">
                                      <Sparkles size={16} />
                                      <h4 className="text-xs font-bold tracking-widest uppercase">
                                        Trinity's Insight
                                      </h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          if (isFullReadingTTSActive) {
                                            stopTTS();
                                          } else if (tarotSpeechReadingText) {
                                            await playTTSInChunks(tarotSpeechReadingText, 'Kore', 110);
                                          }
                                        }}
                                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                          isFullReadingTTSActive
                                            ? "bg-yellow-500/25 text-yellow-300 border border-yellow-400/40 animate-pulse"
                                            : "bg-white/10 hover:bg-white/20 text-white/90 border border-white/15"
                                        }`}
                                        title={isFullReadingTTSActive ? "낭독 중지하기" : "전체 리딩 음성으로 듣기 (핵심요약 제외)"}
                                      >
                                        {isFullReadingTTSActive ? <VolumeX size={12} /> : <Volume2 size={12} />}
                                        <span>{isFullReadingTTSActive ? "중지" : "전체 낭독"}</span>
                                      </button>
                                    </div>
                                  </div>

                                  <div
                                    className="text-white/80 text-sm leading-relaxed relative z-10 w-full font-sans"
                                    style={{ wordBreak: "keep-all" }}
                                  >
                                    {isTarotGenerating && !tarotResult?.trim() ? (
                                      <div className="flex flex-col items-center justify-center py-8 gap-4 text-white/40">
                                        <RefreshCw
                                          className="animate-spin text-yellow-500/50"
                                          size={28}
                                        />
                                        <p className="font-sans text-xs tracking-widest uppercase animate-pulse text-center max-w-xs">
                                          {isDailyTarotConcern(tarotConcern)
                                            ? "오늘의 타로 카드의 파동을 읽어 비전을 조율하고 있습니다..."
                                            : "우주의 메시지 해독 중..."}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="space-y-4">
                                          {/* ✨ 핵심 3줄 요약 프리미엄 그래픽 카드 (최상단 고정 & 원클릭 TTS) */}
                                          {conciseSummaryBullets.length > 0 && tarotResult && (
                                            <TarotSummaryGraphicCard
                                              bullets={conciseSummaryBullets}
                                              readingText={displayTarotResult || tarotResult || ""}
                                              isTTSActive={isSummaryTTSActive}
                                              onToggleTTS={async () => {
                                                if (isSummaryTTSActive) {
                                                  stopTTS();
                                                } else if (summarySpeechText) {
                                                  await playTTSInChunks(summarySpeechText, 'Kore', 110);
                                                }
                                              }}
                                            />
                                          )}

                                          {/* ⚖️ 예/아니오 (YES or NO) 마스터 최종 판정 배너 */}
                                          {tarotYesNoVerdict && (
                                            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-lg backdrop-blur-md transition-all ${
                                              tarotYesNoVerdict.type === 'NO'
                                                ? 'bg-gradient-to-r from-rose-950/60 via-rose-900/30 to-black/80 border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
                                                : tarotYesNoVerdict.type === 'CONDITIONAL_YES'
                                                  ? 'bg-gradient-to-r from-amber-950/60 via-amber-900/30 to-black/80 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                                                  : 'bg-gradient-to-r from-emerald-950/60 via-emerald-900/30 to-black/80 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                                            }`}>
                                              <div className="flex items-center gap-3.5">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl tracking-wider shrink-0 ${
                                                  tarotYesNoVerdict.type === 'NO'
                                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                                                    : tarotYesNoVerdict.type === 'CONDITIONAL_YES'
                                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                                }`}>
                                                  {tarotYesNoVerdict.label}
                                                </div>
                                                <div>
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-white/60 font-sans"><TTSHighlightText text="마스터 최종 판정" /></span>
                                                    <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${
                                                      tarotYesNoVerdict.type === 'NO'
                                                        ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                                                        : tarotYesNoVerdict.type === 'CONDITIONAL_YES'
                                                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                                                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                                                    }`}>
                                                      <TTSHighlightText text={tarotYesNoVerdict.label} />
                                                    </span>
                                                  </div>
                                                  <p className="text-xs text-white/90 mt-1 font-sans font-medium"><TTSHighlightText text={tarotYesNoVerdict.badgeText} /></p>
                                                </div>
                                              </div>
                                              <div className={`text-2xl sm:text-3xl font-black shrink-0 tracking-tight ${
                                                tarotYesNoVerdict.type === 'NO' ? 'text-rose-400' : tarotYesNoVerdict.type === 'CONDITIONAL_YES' ? 'text-amber-400' : 'text-emerald-400'
                                              }`}>
                                                {tarotYesNoVerdict.type === 'NO' ? '🛑 NO' : tarotYesNoVerdict.type === 'CONDITIONAL_YES' ? '⚡ 조건부 YES' : '✨ YES'}
                                              </div>
                                            </div>
                                          )}

                                          <Streamdown immediate={!isTarotGenerating} enableTTSHighlight={isFullReadingTTSActive}>{displayTarotResult || stripSummaryFromTarotText(tarotResult || "")}</Streamdown>
                                          {/* 🌟 그에 맞는 루시의 조언 (TTS 가능) */}
                                          {tarotResult && !isTarotGenerating && (
                                            <div className="pt-2">
                                              <LucyTarotAdviceCard
                                                cards={drawnCards || (dailyResult?.drawnCard ? [dailyResult.drawnCard] : (dailyDrawnCard ? [dailyDrawnCard] : null))}
                                                tarotConcern={tarotConcern}
                                                readingText={displayTarotResult || tarotResult || ""}
                                                mode={isDailyTarotConcern(tarotConcern) ? 'daily' : 'standard'}
                                                saju={calculateDetailedSaju(sharedState?.userProfile || getPersistentUserProfile())}
                                                className="mt-3"
                                              />
                                            </div>
                                          )}

                                          {/* ⚠️ 타로 성찰 주의사항 (맹목적 믿음 지양 상시 표시) */}
                                          {tarotResult && !isTarotGenerating && (
                                            <div className="mt-4 p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/30 space-y-1.5 text-xs text-white/85 shadow-sm">
                                              <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                                                <AlertCircle size={14} className="text-amber-400 shrink-0" />
                                                <span><TTSHighlightText text="타로 성찰 주의사항 (맹목적 믿음 지양)" enabled={isFullReadingTTSActive} /></span>
                                              </div>
                                              <p className="leading-relaxed text-white/70 break-keep text-[11px] sm:text-xs">
                                                <TTSHighlightText text="타로는 미래를 결정짓는 절대적 예언이 아니라, 자신의 내면을 성찰하고 더 나은 선택을 돕는 지혜의 나침반입니다. 맹목적인 믿음을 지양하고, 모든 운명의 결정권과 최종 열쇠는 언제나 당신 자신의 주체적인 의지와 지혜에 있습니다." enabled={isFullReadingTTSActive} />
                                              </p>
                                            </div>
                                          )}

                                          {/* 🔮 연속 추가 질문 및 잔여 덱 심층 리딩 타임라인 영역 (직접 뽑기/자동 뽑기 선택 & 잔여 덱만 사용) */}
                                          {tarotResult && !isTarotGenerating && (
                                            <div className="mt-8 pt-6 border-t border-amber-500/20 space-y-6">
                                              <FollowUpTarotTimeline
                                                entries={followUpEntries}
                                                onZoomCard={(data) => setZoomedCard({ card: data.card, slotName: data.slotName })}
                                              />
                                              <FollowUpTarotInputBar
                                                remainingCount={remainingDeck.length}
                                                totalCount={TAROT_DECK.length}
                                                drawnCount={drawnCardIds.length}
                                                initialConcern={tarotConcern}
                                                drawnCards={drawnCards || []}
                                                isGenerating={isFollowUpGenerating}
                                                onDirectDraw={handleDirectFollowUpDraw}
                                                onAutoDraw={handleAutoFollowUpDraw}
                                              />
                                            </div>
                                          )}
                                        {isTarotGenerating && (
                                          <p className="text-[10px] text-yellow-400/60 uppercase tracking-widest animate-pulse text-center">
                                            리딩 수신 중...
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                            </div>

                            {/* Tarot Result Bottom Actions: Deep Insight with Lucy + Redraw */}
                            {tarotResult && !isTarotGenerating && (
                              <div className="pt-3 border-t border-white/10 flex flex-col gap-3 w-full shrink-0">
                                {/* Redraw & Share Buttons */}
                                <div className="flex items-center justify-center gap-2.5 pt-1 flex-wrap">
                                  {isDailyTarotConcern(tarotConcern) || isTrinityDailyLockedToday() ? (
                                    <div className="text-[11px] text-yellow-300/80 font-sans py-2 px-5 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center gap-1.5 shadow-sm">
                                      <Sparkles size={12} className="text-yellow-400" />
                                      <span>오늘의 타로는 1일 1회 완료되었습니다 (내일 00시 리셋)</span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        resetTarotSession(false);
                                      }}
                                      className="text-yellow-400/85 hover:text-yellow-300 hover:bg-yellow-500/10 transition-all text-[11px] uppercase tracking-widest font-bold flex items-center gap-2 py-2 px-6 rounded-full bg-yellow-500/5 border border-yellow-500/20 hover:border-yellow-500/40 cursor-pointer active:scale-95 duration-200"
                                    >
                                      <RefreshCw size={11} />
                                      <span>새로운 리딩 (Redraw)</span>
                                    </button>
                                  )}
                                  <TodayTarotShareButton
                                    data={{
                                      title: isDailyTarotConcern(tarotConcern) ? '오늘의 데일리 타로' : (tarotSpreadRecommendation?.name || '78장 타로 마스터 비전'),
                                      concern: isDailyTarotConcern(tarotConcern) ? undefined : tarotConcern,
                                      spreadName: isDailyTarotConcern(tarotConcern) ? undefined : tarotSpreadRecommendation?.name,
                                      cards: drawnCards && drawnCards.length > 0
                                        ? drawnCards.map((c, i) => ({
                                            id: c.id,
                                            nameKo: c.nameKo,
                                            name: c.name,
                                            reversed: !!c.reversed,
                                            keywords: c.keywords,
                                            imageUrl: getTarotCardImageUrl(c),
                                            slotName: tarotSpreadRecommendation?.positions?.[i] || `#${i + 1} 카드`,
                                          }))
                                        : undefined,
                                      card: drawnCards?.[0] || (dailyResult?.drawnCard ?? (dailyDrawnCard ?? null)),
                                      dateStr: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }),
                                      conciseSummaryBullets: conciseSummaryBullets,
                                      diagnosis: displayTarotResult || stripSummaryFromTarotText(tarotResult || ""),
                                      rawBlessing: dailyResult?.blessing,
                                      frequency: dailyResult?.frequency,
                                      luckyNumber: dailyResult?.luckyNumber,
                                      luckyColor: dailyResult?.luckyColor,
                                    }}
                                    variant="secondary"
                                    label="결과 공유 / 소장"
                                  />
                                </div>

                                {/* Lucy Deep Insight Card */}
                                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-yellow-500/15 via-black/70 to-purple-500/15 border border-yellow-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-xs sm:text-sm">
                                      <Sparkles size={15} className="text-yellow-400 animate-pulse shrink-0" />
                                      <span>루시와 1:1 심층 상담 (Deep Insight)</span>
                                    </div>
                                    <p className="text-[11px] text-white/70 font-sans leading-relaxed">
                                      방금 나온 타로 마스터의 리딩 결과를 바탕으로, 루시와 함께 마음속 깊은 심층 통찰과 영적 대화를 이어가세요.
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    disabled={!tarotResult || isTarotGenerating || (!drawnCards || drawnCards.length === 0)}
                                    onClick={() => {
                                      const dailyCard = dailyResult?.drawnCard || null;
                                      const cardSummary = drawnCards
                                        ? drawnCards.map((c) => `${c.nameKo}${c.reversed ? '(역방향)' : ''}`).join(', ')
                                        : '';
                                      const deepContext = `[🔮 78장 타로 마스터 리딩 심층 연계]\n- 질문 고민: "${tarotConcern}"\n- 적용 배열법: ${tarotSpreadRecommendation.name} (${tarotSpreadRecommendation.cardCount}장)\n- 펼쳐진 카드: [${cardSummary}]\n${dailyCard ? `- 오늘의 지배 카드: ${dailyCard.nameKo}\n` : ''}\n- 트리니티 마스터 리딩 결과:\n${tarotResult.slice(0, 900)}`;
                                      void handleSend(
                                        `트리니티 타로 마스터에게 받은 "${tarotConcern}" 리딩 결과에 대해 루시와 심층 상담(Deep Insight)을 나누고 싶어.\n\n[타로 리딩 요약]\n- 배열법: ${tarotSpreadRecommendation.name} (${tarotSpreadRecommendation.cardCount}장)\n- 카드: ${cardSummary}\n\n이 리딩 내용을 바탕으로 내 무의식과 앞으로의 방향성을 더 깊이 통찰해줘.`,
                                        {
                                          force: true,
                                          oracleContext: deepContext,
                                        },
                                      );
                                    }}
                                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] active:scale-95 cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                                  >
                                    <Sparkles size={14} />
                                    <span>루시와 심층 상담하기</span>
                                    <ChevronRight size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeMode === "bible" ? (
              <motion.div key="bible" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-8 sm:pb-12 pt-4 sm:pt-6">
                 <div className="space-y-10">
                    <TarotBible 
                      onConsult={(text) => { openLucyChat('trinity'); handleSend(text); }} 
                    />
                 </div>
              </motion.div>
            ) : activeMode === "simple" ? (
              <motion.div
                key="simple"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center pt-8 pb-6"
              >
                <div className="w-full max-w-2xl glass p-5 md:p-12 rounded-[28px] md:rounded-[64px] border border-yellow-500/30 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-yellow-500/10 blur-[100px] rounded-full scale-110 group-hover:scale-125 transition-transform" />
                  <div className="relative z-10 space-y-6 md:space-y-12 text-white">
                    <div className="flex flex-col items-center gap-4 md:gap-6 text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[32px] bg-yellow-500/20 flex items-center justify-center text-yellow-400 border border-yellow-500/30 shadow-2xl animate-pulse">
                        <Sparkles size={32} className="md:w-10 md:h-10" />
                      </div>
                      <h3 className="text-2xl md:text-5xl font-sans text-white font-bold tracking-tighter text-center">
                        Flux Consultation
                      </h3>
                      <p className="text-[10px] md:text-sm text-yellow-500/60 uppercase tracking-[0.25em] md:tracking-[0.4em] font-sans font-black text-center">
                        우주적 지혜와의 실시간 동기화
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "나의 영적 진화 단계는 어디인가요?",
                        "오늘의 우주적 에너지를 어떻게 활용할까요?",
                        "내면의 갈등을 해결할 수 있는 지혜 한 줄",
                        "타인과의 관계에서 필요한 영적 조언",
                        "성공과 성장을 위한 영혼의 메시지",
                        "명상 중에 떠오른 의문을 풀고 싶어요",
                        "내 영혼이 진정으로 원하는 삶의 목적을 찾는 방법",
                        "부정적인 에너지를 차단하고 내 주파수를 높이는 법",
                        "반복되는 문제 속에서 배워야 할 카르마적 교훈",
                        "직관력을 높이고 우주의 신호를 더 잘 읽어내는 방법"
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSend(q)}
                          className="px-6 py-6 rounded-[28px] bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-sm sm:text-base text-left text-white/80 hover:text-white flex items-start justify-between gap-3 group/btn font-sans font-bold shadow-xl backdrop-blur-md"
                        >
                          <span className="leading-tight">"{q}"</span>
                          <ChevronRight
                            size={20}
                            className="mt-0.5 shrink-0 opacity-0 group-hover/btn:opacity-100 transition-all -translate-x-3 group-hover/btn:translate-x-0 text-yellow-400"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (activeMode === "destiny" || activeMode === "daily") ? (
              <motion.div
                key="destiny"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full pb-8 sm:pb-12"
              >
                <TrinityDestinyReportView
                  onConsult={(text) => {
                    openLucyChat('trinity');
                    handleSend(text);
                  }}
                />
              </motion.div>
            ) : activeMode === "soul" ? (
              <motion.div
                key="soul"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12"
              >
                {isEditingProfile ? (
                  <div className="max-w-2xl mx-auto glass p-12 rounded-[60px] border border-yellow-500/20 shadow-2xl space-y-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-display text-white ">
                        Soul Profile Configuration
                      </h3>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">
                          Name
                        </label>
                        <input
                          className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-yellow-500/50 text-white"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">
                          Nickname
                        </label>
                        <input
                          className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-yellow-500/50 text-white"
                          value={form.nickname}
                          onChange={(e) =>
                            setForm({ ...form, nickname: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">
                          Birth Date
                        </label>
                        <input
                          type="date"
                          className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-yellow-500/50 text-white invert-calendar"
                          value={form.birthdate}
                          onChange={(e) =>
                            setForm({ ...form, birthdate: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">
                          Birth Time
                        </label>
                        <input
                          type="time"
                          className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-yellow-500/50 text-white invert-calendar"
                          value={form.birthtime}
                          onChange={(e) =>
                            setForm({ ...form, birthtime: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">
                          City
                        </label>
                        <input
                          className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-yellow-500/50 text-white"
                          placeholder="e.g. Seoul"
                          value={form.city}
                          onChange={(e) =>
                            setForm({ ...form, city: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">
                          Gender
                        </label>
                        <div className="flex gap-2 p-1 bg-white/5 rounded-[24px] border border-white/10">
                          {["여성", "남성"].map((g) => (
                            <button
                              key={g}
                              onClick={() => setForm({ ...form, gender: g })}
                              className={`flex-1 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${form.gender === g ? "bg-yellow-600 text-white shadow-lg shadow-yellow-500/20" : "text-white/30 hover:text-white"}`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="w-full py-5 rounded-[28px] bg-yellow-600 text-white font-black uppercase tracking-[0.3em] shadow-xl shadow-yellow-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Update Destiny Soul
                    </button>
                  </div>
                ) : insightResult ? (
                  <div className="w-full max-w-4xl mx-auto glass p-10 mt-10 rounded-[60px] border border-yellow-500/30 shadow-[0_0_100px_rgba(234,179,8,0.1)]">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-3">
                        <Zap size={22} className="text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-500 tracking-[0.4em] uppercase ">
                          The Destiny Decree
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                      <StatBar
                        label="Soul Luck"
                        value={insightResult.luckScore || 0}
                        color="#eab308"
                      />
                      <StatBar
                        label="Harmony"
                        value={insightResult.loveScore || 0}
                        color="#f472b6"
                      />
                      <StatBar
                        label="Abundance"
                        value={insightResult.wealthScore || 0}
                        color="#4ade80"
                      />
                      <StatBar
                        label="Vitality"
                        value={insightResult.healthScore || 0}
                        color="#60a5fa"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 font-sans font-medium uppercase tracking-tight">
                      {[
                        {
                          label: "동기화 상태",
                          v: translateEnglishValue(insightResult.deepSyncLevel || "OPTIMAL"),
                          c: "text-yellow-400",
                        },
                        {
                          label: "파워 아이템",
                          v: translateEnglishValue(insightResult.luckyItem),
                          c: "text-yellow-300",
                        },
                        {
                          label: "집중 색상",
                          v: translateEnglishValue(insightResult.luckyColor),
                          c: "text-yellow-200",
                        },
                      ].map((i, idx) => (
                        <div
                          key={idx}
                          className="p-6 bg-white/[0.03] border border-white/5 rounded-[40px] flex flex-col items-center justify-center"
                        >
                          <span className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-sans font-bold">
                            {i.label}
                          </span>
                          <span className={`text-base text-center ${i.c}`}>
                            {i.v}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-6 text-left">
                      <div className="p-8 bg-yellow-500/10 border border-yellow-500/20 rounded-[48px] shadow-inner font-sans">
                        <div className="flex items-center gap-3 mb-4">
                           <Sparkles size={18} className="text-yellow-400 animate-pulse" />
                           <div className="flex flex-col text-left">
                             <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest leading-none">Master's Guidance</span>
                             <span className="text-[9px] text-white/40 font-sans mt-1 leading-none">오늘 하루의 구체적 행동 지침과 따뜻한 심리 멘토링 조언입니다.</span>
                           </div>
                         </div>
                        <div className="text-base sm:text-lg text-white/90 font-sans leading-relaxed [&>h3]:text-yellow-300 [&>h3]:text-xl [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>p]:mb-4">
                          <Streamdown>{insightResult.guidance}</Streamdown>
                        </div>
                        <div className="flex justify-end mt-4">
                          <TTSButton text={insightResult.guidance} voice="Kore" className="shrink-0" />
                        </div>
                      </div>
                      <div className="p-10 bg-yellow-500/5 rounded-[54px] border border-yellow-500/20 font-sans text-white/70 leading-relaxed relative overflow-hidden backdrop-blur-md shadow-[0_4px_30px_rgba(234,179,8,0.05)] text-left">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
                         <div className="flex items-center gap-3 mb-4">
                           <div className="p-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                             <Sparkles size={18} className="animate-pulse" />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Spiritual Blueprint & Metaphysical Core</span>
                             <span className="text-[10px] text-white/40 mt-0.5 font-sans">영적 청사진과 형이상학적 본질 분석</span>
                           </div>
                         </div>
                         <p className="text-[11px] text-white/50 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2.5 mb-4 leading-relaxed font-sans font-medium">
                           ✨ 몸, 마음, 정신의 세 축이 오늘의 거대한 근원적 우주 청사진과 어떻게 연결되고 공명하는지 밝혀내는 다차원적 분석입니다.
                         </p>
                         <div className="text-base sm:text-lg text-white/90 font-sans leading-relaxed text-left">
                           <Streamdown>{insightResult.cosmicAspect}</Streamdown>
                         </div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-8 max-w-md mx-auto text-center mt-20">
                    <div className="w-20 h-20 rounded-[28px] bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <Zap size={40} className="text-yellow-500" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-display text-white font-bold tracking-tight uppercase">
                        Energy Analysis
                      </h3>
                      <p className="text-sm text-white/40 font-sans leading-relaxed">
                        "현재 당신의 영적 주파수와 운명의 흐름을 다차원적으로 분석합니다. 트리니티의 연금술과 결합하여 오늘의 운명 선언문을 발행하세요."
                      </p>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                      <button
                        onClick={handleEnergyAnalysis}
                        disabled={isMeasuringInsight}
                        className="w-full px-10 py-5 rounded-[32px] bg-yellow-500 text-black font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center"
                      >
                        {isMeasuringInsight ? (
                          <RefreshCw className="animate-spin" size={20} />
                        ) : (
                          "분석 시작하기"
                        )}
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
            ) : activeMode === "history" ? (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 pb-6"
              >

                  <div className="glass p-10 rounded-[60px] border border-yellow-500/20 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/20">
                        <Library size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display text-white">
                          Oracle Library
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="mb-8">
                      <CalendarView
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        highlightDates={localHistory.map(
                          (h: any) =>
                            new Date(h.createdAt || h.timestamp || Date.now()),
                        )}
                        color={"#eab308"}
                      />
                    </div>

                    {/* Category Filter */}
                    {localHistory.length > 0 &&
                      Array.from(
                        new Set(
                          localHistory.map((h: any) => h.type || "RECORD"),
                        ),
                      ).length > 1 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          <button
                            onClick={() => setCategoryFilter("all")}
                            className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${categoryFilter === "all" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-white/5 text-white/20 border border-white/5 hover:text-white/40"}`}
                          >
                            All Categories
                          </button>
                          {Array.from(
                            new Set(
                              localHistory.map((h: any) => h.type || "RECORD"),
                            ),
                          ).map((cat: any) => (
                            <button
                              key={cat}
                              onClick={() => setCategoryFilter(cat)}
                              className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${categoryFilter === cat ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-white/5 text-white/20 border border-white/5 hover:text-white/40"}`}
                            >
                              {TYPE_LABELS[cat] || cat}
                            </button>
                          ))}
                        </div>
                      )}

                    {localHistory.filter(
                      (h: any) =>
                        (!selectedDate ||
                          new Date(
                            h.createdAt || h.timestamp || Date.now(),
                          ).toDateString() === selectedDate.toDateString()) &&
                        (categoryFilter === "all" ||
                          (h.type || "RECORD") === categoryFilter),
                    ).length > 0 ? (
                      localHistory
                        .filter(
                          (h: any) =>
                            (!selectedDate ||
                              new Date(
                                h.createdAt || h.timestamp || Date.now(),
                              ).toDateString() ===
                                selectedDate.toDateString()) &&
                            (categoryFilter === "all" ||
                              (h.type || "RECORD") === categoryFilter),
                        )
                        .map((h: any, i: number) => (
                          <div
                            key={h.id || i}
                            className="p-6 rounded-3xl glass border border-white/10 hover:border-yellow-400/40 shadow-2xl hover:bg-white/[0.08] transition-all text-left"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">
                                {TYPE_LABELS[h.type] || h.type || "RECORD"}
                              </span>
                              <span className="text-[10px] text-white/20 font-mono ">
                                {new Date(
                                  h.createdAt || Date.now(),
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-white/70 font-sans">
                              "{h.content || h.text || "분석 완료 데이터"}"
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-center text-white/20  py-20">
                        아직 우주의 기록이 비어있습니다.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      {/* Loading & Status Overlays */}
      <AnimatePresence>
        {isMeasuringInsight && !insightResult && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] glass backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center space-y-12"
          >
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-yellow-500/30 blur-[100px] animate-pulse rounded-full" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-full h-full border-t-2 border-r-2 border-yellow-500/40 rounded-full relative"
              >
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.8)]" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap size={64} className="text-yellow-400 animate-bounce" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-black text-white  tracking-widest uppercase">
                Measuring Souls
              </h3>
              <div className="flex justify-center gap-1.5 h-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 24, 4] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    className="w-1.5 bg-yellow-500/60 rounded-full"
                  />
                ))}
              </div>
              <p className="text-[10px] text-white/30 font-sans uppercase tracking-[0.4em]">
                Synching with the universal frequency...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DailyOracleLoadingOverlay isLoading={isDailyOracleLoading} theme="yellow" />
      <NoticeModal
        isOpen={notice.open}
        onClose={() => setNotice((p) => ({ ...p, open: false }))}
        title={notice.title}
        message={notice.message}
      />

      {/* Today's Ruling Card / Daily Result Modal (통합 텍스트 리딩 & 실시간 음성 낭독) */}
      <TodayTarotNarrationModal
        isOpen={showDailyModal}
        onClose={() => setShowDailyModal(false)}
        dailyResult={dailyResult}
        onConsultLucy={(context) => {
          openLucyChat('trinity');
          void handleSend(
            `트리니티 타로 마스터에게 받은 오늘의 타로 리딩 결과에 대해 루시와 심층 상담을 나누고 싶어.\n\n${context}`,
            {
              force: true,
              oracleContext: context,
            },
          );
        }}
        onGoToTarotWheel={() => {
          setShowDailyModal(false);
          setActiveMode('tarot');
          if (isTrinityDailyLockedToday() || dailyResult?.drawnCard) {
            setTarotConcern('');
            setStage('landing');
            setTarotVirtualMode(false);
          } else {
            setTarotConcern('오늘의 타로');
            setStage('landing');
            setTarotVirtualMode(true);
          }
        }}
      />

      {/* Tarot Spread Selection Modal */}
      <TarotSpreadSelectionModal
        isOpen={isSpreadModalOpen}
        onClose={() => setIsSpreadModalOpen(false)}
        currentSpread={tarotSpreadRecommendation}
        isAutoRecommended={isAutoRecommended}
        onSelectSpread={(spread) => setCustomSpread(spread)}
      />

      {/* Tarot Card Zoom / Detail Inspection Modal */}
      <TarotCardZoomModal
        isOpen={!!zoomedCard}
        onClose={() => setZoomedCard(null)}
        card={zoomedCard?.card ?? null}
        slotName={zoomedCard?.slotName}
      />

      {/* Quin Style: 20-Deck Customizable Tarot Card Back Modal */}
      <TarotCardBackCustomizerModal
        isOpen={showTarotCardBackModal}
        onClose={() => setShowTarotCardBackModal(false)}
      />

      {/* Quin Style: Physical / Manual Tarot Card Input Modal */}
      <PhysicalTarotInputModal
        isOpen={showPhysicalTarotModal}
        onClose={() => setShowPhysicalTarotModal(false)}
        initialSpreadName={tarotSpreadRecommendation.name}
        initialPositions={tarotSpreadRecommendation.positions}
        initialConcern={tarotConcern}
        onComplete={(cards, manualConcern) => {
          setShowPhysicalTarotModal(false);
          if (manualConcern && manualConcern.trim()) {
            setTarotConcern(manualConcern.trim());
          }
          setDrawnCards(cards);
          setHideTarotPopup(false);
          handleUnifiedReading("tarot", { selectedCards: cards });
        }}
      />

      {/* 🎡 잔여 덱 전용 360도 무결점 타로 휠 수동 선택 모달 */}
      {showFollowUpWheelModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
          <div className="relative w-full max-w-5xl h-[88vh] rounded-3xl bg-slate-950/95 border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col">
            <TarotSpread
              deckSource={remainingDeck}
              maxCards={1}
              concern={pendingFollowUpQuestion}
              spreadName={`추가 질문 #${followUpEntries.length + 1} 카드 선택`}
              spreadReason={`기존에 뽑힌 ${drawnCardIds.length}장을 제외한 ${remainingDeck.length}장의 잔여 덱에서 1장을 직접 고릅니다.`}
              onComplete={handleFollowUpWheelComplete}
              onCancel={() => setShowFollowUpWheelModal(false)}
            />
          </div>
        </div>
      )}
      {/* 📍 메인 전체 화면 스마트 스크롤 수동 조작 시 낭독 위치 즉시 복귀 플로팅 버튼 */}
      <SmartScrollResumeButton
        isVisible={isMainUserOverriding && isTTSActive && hasMainActiveHighlight}
        onResume={resumeMainAutoScroll}
        remainingSeconds={mainRemainingSeconds}
        fixed
      />
    </div>
  );
}
