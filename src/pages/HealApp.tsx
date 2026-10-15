import { playConversation, stopTTS, useTTSActive } from '@/utils/tts'; import { Volume2, VolumeX } from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Activity, Send, RefreshCw, Star,
  Heart, Plus, Check, X, Watch, Wind, Timer, Leaf, Brain, MessageCircle, Home, Sparkles, Layout, User, BookOpen, Library, Radio, Calendar, ChevronRight, Lock,
  ShieldCheck, Zap, Trash2, Utensils, CheckCircle2,
  ChevronDown, Eye, Link, Stars as LucideStars
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useApp, getPersistentUserProfile, setPersistentUserProfile } from '../contexts/AppContext';
import { mergeUserProfiles, type UserProfile } from '@/lib/sharedState';
import { auth, db, collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, doc, getDoc, setDoc } from '@/lib/firebase';
import { invokeLLMStream, invokeLLMStructured, PERSONAS, poeQuickInsight, buildDeepSynapseContext } from '../lib/ai';
import { APP_CHANNEL_LABELS, cleanLucyChatText, getMessageText } from '../lib/lucyChatUtils';
import { Streamdown } from '@/components/Streamdown';
import NoticeModal from '@/components/NoticeModal';
import { TTSButton } from '@/components/TTSButton';

import { SedonaDailyView } from '@/components/heal/SedonaDailyView';
import { recordPrismFeature, recordDailyOracleResult } from '@/lib/prismOmniSync';
import { OneMinuteMeditationView } from '@/components/heal/OneMinuteMeditationView';
import { AuraSynergySection } from '@/components/heal/AuraSynergySection';
import { useSwipeableTabs } from '@/hooks/useSwipeableTabs';
import { openChannelIntro } from '@/components/common/ChannelIntroModal';
import { useBinauralBeat } from '@/hooks/useBinauralBeat';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { z } from 'zod';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { CalendarView } from '@/components/CalendarView';
import { SedonaBible } from '@/components/heal/SedonaBible';
import { DoctorPrescriptionSlides } from '@/components/heal/DoctorPrescriptionSlides';
import { shuffleCardDeck } from '@/lib/cardShuffle';
import {
  SPECIAL_FEATURE_CHROME_HIDDEN_CLASS,
  useSpecialFeatureChromeHidden,
} from '@/components/SpecialFeaturePanel';
import { DailyElementTrendDashboard } from '@/components/DailyElementTrendDashboard';
import { calcSaju } from '@/lib/trinity/utils';
import { calculateDetailedSaju } from '@/lib/sajuAnalysis';
import {
  getTodayDateKey,
  pickDailySeededItem,
  pickDailySeededCard,
  findTodayOracleInSources,
  resolveOracleVisionResult,
  isTimestampToday,
  markDailyAutoRan,
  getDailyAutoRanKey,
  markOracleModalSeen,
  hasSeenOracleModalToday,
} from '@/lib/dailyCache';
import { AURA_CARDS, type AuraThemeCard } from '@/lib/auraCards';
import { useScrollToTopOnChange } from '@/hooks/useScrollToTopOnChange';
import { resetAppScroll } from '@/utils/scrollToTop';
import { useDailyOracleFirstVisit } from '@/hooks/useDailyOracleFirstVisit';
import {
  buildOracleDeepInsightSystemContext,
  buildOracleDeepInsightUserMessage,
  type OracleDeepInsightSendOpts,
} from '@/lib/oracleDeepInsight';
import { DailyOracleLoadingOverlay } from '@/components/DailyOracleLoadingOverlay';

import { buildSpecificSedonaDailyOracle } from '@/lib/dailyTarotOracle';
import { LucKeyLogoText } from '@/components/LucKeyLogoText';

const THEME_COLOR = 'oklch(0.70 0.15 150)';
const BG = 'oklch(0.08 0.05 150)';

const QuickInsightSchema = z.object({
  diagnosis: z.string().default('마음의 긴장을 풀고 평온한 치유의 빛을 채워갑니다.'),
  luckyNumber: z.union([z.string(), z.number()]).transform(v => String(v)).optional().default('7'),
  luckyColor: z.string().optional().default('에메랄드 힐링 그린'),
  remedy: z.string().optional().default('따뜻한 차 한 잔과 함께 5분간 고요히 심호흡하기'),
  symbol: z.string().optional().default('치유의 크리스탈'),
  frequency: z.string().optional().default('528Hz'),
  spiritualEnergy: z.string().optional().default('치유의 오라 에너지가 내면의 긴장을 부드럽게 이완시킵니다.'),
  blessingMessage: z.string().optional().default('오늘 하루 당신의 몸과 마음에 깊은 쉼과 평온이 가득하기를 축복합니다.'),
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

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="w-full min-w-0">
      <div className="flex justify-between gap-2 text-[10px] mb-1.5 px-1 uppercase tracking-widest font-bold text-white/30 font-sans">
        <span className="min-w-0 break-words">{label}</span>
        <span style={{ color }} className="shrink-0">{value}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full rounded-full" style={{ backgroundColor: color }} transition={{ duration: 1, ease: 'easeOut' }} />
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  '어깨와 목이 너무 뭉쳤어',
  '오늘 잠을 조금밖에 못 잤어',
  '스트레칭 좀 알려줘',
  '자세 교정 루틴 5분짜리 해볼까?',
  '하루종일 모니터만 봤더니 피곤해'
];

interface Message { 
  id: string; 
  role: 'user' | 'model'; 
  content: string; 
  timestamp: number;
}

interface TimeSpaceCard {
  stem: string;       // 天干
  branch: string;     // 地支
  stemName: string;   // e.g. "병"
  branchName: string; // e.g. "오"
  name: string;       // e.g. "병오"
  title: string;      // e.g. "태양의 도약"
  element: '목' | '화' | '토' | '금' | '수';
  elementEn: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  color: string;      // styling color
  emoji: string;       // Symbol/Emoji
  desc: string;       // card description
}

const CANDIDATE_DEEP_CARDS: TimeSpaceCard[] = [
  { stem: '丙', branch: '午', stemName: '병(丙)', branchName: '오(午)', name: '丙午', title: '병오 (丙午) "태양의 도약"', element: '화', elementEn: 'Fire', color: '#ef4444', emoji: '🔥', desc: '강렬한 하늘의 양기와 땅의 열정이 정렬하여, 지친 기맥을 일순간에 가동시키는 순환의 열정 비전입니다.' },
  { stem: '甲', branch: '辰', stemName: '갑(甲)', branchName: '진(辰)', name: '甲辰', title: '갑진 (甲辰) "푸른 용의 태동"', element: '목', elementEn: 'Wood', color: '#22c55e', emoji: '🌱', desc: '나무의 굳건한 솟구침과 비옥한 토양이 만나 척추 정렬도와 바디 코어의 활기찬 탄력을 깨웁니다.' },
  { stem: '庚', branch: '子', stemName: '경(庚)', branchName: '자(子)', name: '庚子', title: '경자 (庚子) "새벽빛 은비"', element: '금', elementEn: 'Metal', color: '#94a3b8', emoji: '💎', desc: '정제된 가을 금속의 예리함과 겨울 밤하늘의 맑은 물이 만나 뇌 세포의 피로를 완전히 걷어내고 시야를 투명하게 정화합니다.' },
  { stem: '壬', branch: '寅', stemName: '임(壬)', branchName: '인(寅)', name: '壬寅', title: '임인 (壬寅) "심연의 흑호"', element: '수', elementEn: 'Water', color: '#3b82f6', emoji: '💧', desc: '깊은 지혜의 강물과 역동적인 봄의 나무가 교화되어 온몸의 신경망 전류를 안정시키고 막힘없는 순환을 회복합니다.' },
  { stem: '戊', branch: '戌', stemName: '무(戊)', branchName: '술(戌)', name: '戊戌', title: '무술 (戊戌) "황금빛 관방"', element: '토', elementEn: 'Earth', color: '#eab308', emoji: '🪨', desc: '중후하고 비옥한 산맥의 단단함을 겹쳐, 불안한 맥박을 차분하게 연수하고 대지에 중심을 내려놓는 접지 조율입니다.' },
  { stem: '丁', branch: '卯', stemName: '정(丁)', branchName: '묘(卯)', name: '丁卯', title: '정묘 (丁卯) "은하 등불"', element: '화', elementEn: 'Fire', color: '#f43f5e', emoji: '🕯️', desc: '어둠을 비추는 고요한 등불과 유연한 비단풀이 조우하여 심장 박동을 부드럽게 감싸고 밤시간에 완벽한 휴식을 선사합니다.' },
  { stem: '己', branch: '巳', stemName: '기(己)', branchName: '사(巳)', name: '己巳', title: '기사 (己巳) "연금 활화"', element: '토', elementEn: 'Earth', color: '#f59e0b', emoji: '🌾', desc: '황토의 포근한 위로와 화기의 따뜻함이 결합하여 소화 대사의 맥을 조율하고 피로 물질을 즉각 분해하는 생기 축적 작용을 발동합니다.' },
  { stem: '癸', branch: '亥', stemName: '계(癸)', branchName: '해(亥)', name: '癸亥', title: '계해 (癸亥) "태초의 원수"', element: '수', elementEn: 'Water', color: '#0ea5e9', emoji: '🌊', desc: '이슬비가 모여 가없는 대해를 이룩하듯, 지친 관절 and 눈동자에 맑은 액막의 수분을 충전하여 윤택함을 복구합니다.' },
  { stem: '辛', branch: '酉', stemName: '신(辛)', branchName: '유(酉)', name: '辛酉', title: '신유 (辛酉) "백색 투명성"', element: '금', elementEn: 'Metal', color: '#cbd5e1', emoji: '⚙️', desc: '티끌 하나 없는 백색 보석의 완전한 결정체처럼, 잡음과 나쁜 기류를 일시에 차단하고 흐트러진 척추와 기혈을 가차없이 재정렬합니다.' },
  { stem: '乙', branch: '未', stemName: '을(乙)', branchName: '미(未)', name: '乙未', title: '을미 (乙未) "비옥한 들녘"', element: '목', elementEn: 'Wood', color: '#10b981', emoji: '🍃', desc: '목서 바람을 머금은 싱그러운 덩굴림이 굳어있는 어깨 관절막을 뚫고 지나가 유연하고 가벼운 가동범위를 무제한으로 일궈냅니다.' }
];

function processFateUnion(sajuText: string, card: TimeSpaceCard) {
  const hasSaju = !!sajuText && sajuText.includes('[사주]');
  
  const containsBranch = (char: string) => {
    if (!hasSaju) {
      return ['戌', '寅', '午', '卯'].includes(char);
    }
    return sajuText.includes(char);
  };

  const hasZi = containsBranch('子');
  const hasChou = containsBranch('丑');
  const hasYin = containsBranch('寅');
  const hasMao = containsBranch('卯');
  const hasChen = containsBranch('辰');
  const hasSi = containsBranch('巳');
  const hasWu = containsBranch('午');
  const hasWei = containsBranch('未');
  const hasShen = containsBranch('申');
  const hasYou = containsBranch('酉');
  const hasXu = containsBranch('戌');
  const hasHai = containsBranch('亥');

  let isHap = false;
  let isChung = false;
  let resonanceText = "";
  let hapName = "";
  let chungName = "";

  const cb = card.branch;

  if (cb === '午') {
    if (hasYin && hasXu) { isHap = true; hapName = "인오술(寅午戌) 화국 삼합(三合)"; }
    else if (hasYin || hasXu) { isHap = true; hapName = "인오/오술 반합(半合)"; }
    else if (hasWei) { isHap = true; hapName = "오미(午未) 육합(六合)"; }
    if (hasZi) { isChung = true; chungName = "자오충(子午沖) 수화대충(水火對沖)"; }
  } else if (cb === '辰') {
    if (hasShen && hasZi) { isHap = true; hapName = "신자진(申子辰) 수국 삼합(三合)"; }
    else if (hasShen || hasZi) { isHap = true; hapName = "신진/자진 반합(半合)"; }
    else if (hasYou) { isHap = true; hapName = "진유(辰酉) 금기 육합(六合)"; }
    if (hasXu) { isChung = true; chungName = "진술충(辰戌沖) 토기상충(土氣相沖)"; }
  } else if (cb === '子') {
    if (hasShen && hasChen) { isHap = true; hapName = "신자진(申子辰) 수국 삼합(三合)"; }
    else if (hasShen || hasChen) { isHap = true; hapName = "신자/자진 반합(半合)"; }
    else if (hasChou) { isHap = true; hapName = "자축(子丑) 수기 육합(六合)"; }
    if (hasWu) { isChung = true; chungName = "자오충(子午沖) 수화대충(水火對沖)"; }
  } else if (cb === '寅') {
    if (hasWu && hasXu) { isHap = true; hapName = "인오술(寅午戌) 화국 삼합(三合)"; }
    else if (hasWu || hasXu) { isHap = true; hapName = "인오/인술 반합(半合)"; }
    else if (hasHai) { isHap = true; hapName = "인해(寅亥) 목기 육합(六合)"; }
    if (hasShen) { isChung = true; chungName = "인신충(寅申沖) 금목상충(金木상沖)"; }
  } else if (cb === '戌') {
    if (hasYin && hasWu) { isHap = true; hapName = "인오술(寅午戌) 화국 삼합(三合)"; }
    else if (hasYin || hasWu) { isHap = true; hapName = "인술/오술 반합(半合)"; }
    else if (hasMao) { isHap = true; hapName = "묘술(卯戌) 화기 육합(六合)"; }
    if (hasChen) { isChung = true; chungName = "진술충(辰戌沖) 토기상충(土氣相沖)"; }
  } else if (cb === '卯') {
    if (hasHai && hasWei) { isHap = true; hapName = "해묘미(亥卯未) 목국 삼합(三合)"; }
    else if (hasHai || hasWei) { isHap = true; hapName = "해묘/묘미 반합(半合)"; }
    else if (hasXu) { isHap = true; hapName = "묘술(卯戌) 화기 육합(六合)"; }
    if (hasYou) { isChung = true; chungName = "묘유충(卯酉沖) 금목상충(金木相沖)"; }
  } else if (cb === '巳') {
    if (hasYou && hasChou) { isHap = true; hapName = "사유축(巳酉丑) 금국 삼합(三合)"; }
    else if (hasYou || hasChou) { isHap = true; hapName = "사유/사축 반합(半合)"; }
    else if (hasShen) { isHap = true; hapName = "사신(巳申) 수기 육합(六合)"; }
    if (hasHai) { isChung = true; chungName = "사해충(巳亥沖) 수화상충(水火相沖)"; }
  } else if (cb === '亥') {
    if (hasMao && hasWei) { isHap = true; hapName = "해묘미(亥卯未) 목국 삼합(三合)"; }
    else if (hasMao || hasWei) { isHap = true; hapName = "해묘/해미 반합(半合)"; }
    else if (hasYin) { isHap = true; hapName = "인해(寅亥) 목기 육합(六合)"; }
    if (hasSi) { isChung = true; chungName = "사해충(巳亥沖) 수화상충(水火相沖)"; }
  } else if (cb === '酉') {
    if (hasSi && hasChou) { isHap = true; hapName = "사유축(巳酉丑) 금국 삼합(三合)"; }
    else if (hasSi || hasChou) { isHap = true; hapName = "사유/유축 반합(半合)"; }
    else if (hasChen) { isHap = true; hapName = "진유(辰酉) 금기 육합(六合)"; }
    if (hasMao) { isChung = true; chungName = "묘유충(卯酉沖) 금목상충(金木상沖)"; }
  } else if (cb === '未') {
    if (hasHai && hasMao) { isHap = true; hapName = "해묘미(亥卯未) 목국 삼합(三合)"; }
    else if (hasHai || hasMao) { isHap = true; hapName = "해미/묘미 반합(半合)"; }
    else if (hasWu) { isHap = true; hapName = "오미(午未) 화기 육합(六合)"; }
    if (hasChou) { isChung = true; chungName = "축미충(丑未沖) 토기상충(土氣相沖)"; }
  }

  const elements = { 목: 15, 화: 15, 토: 15, 금: 15, 수: 15 };

  if (card.element === '목') elements.목 += 40;
  else if (card.element === '화') elements.화 += 40;
  else if (card.element === '토') elements.토 += 40;
  else if (card.element === '금') elements.금 += 40;
  else if (card.element === '수') elements.수 += 40;

  if (isHap) {
    resonanceText = `오늘 당신이 고른 시공간 카드 '${card.name}'과 사주팔자의 생기가 강력한 공명을 일으킵니다. [${hapName}]이(가) 형성되어 생체 전류의 안정화와 자율신경계 정화 충동이 극대화됩니다. 기혈 순환 정체도가 완화되고 자가 치유 에너지가 대폭 충전됩니다.`;
    if (card.element === '목') { elements.목 += 20; elements.수 += 10; }
    else if (card.element === '화') { elements.화 += 20; elements.목 += 10; }
    else if (card.element === '토') { elements.토 += 20; elements.화 += 10; }
    else if (card.element === '금') { elements.금 += 20; elements.토 += 10; }
    else if (card.element === '수') { elements.수 += 20; elements.금 += 10; }
  } else if (isChung) {
    resonanceText = `시공간 카드 '${card.name}'과 사주 지지가 상충하는 기압 차이를 유발합니다. [${chungName}] 판정이 나타났습니다. 동양 의학적 충(沖)은 나쁜 독성을 깨부수고 정체를 분출해 해소하는 강력한 명현적 정화 반응입니다. 일시적인 어깨 경직이나 피로 자각이 수반될 수 있으나 심부 체온이 촉진되는 정밀 리프레시 시기입니다.`;
    if (card.element === '화') { elements.화 += 15; elements.수 += 15; }
    else if (card.element === '목') { elements.목 += 15; elements.금 += 15; }
    else if (card.element === '토') { elements.토 += 30; }
    else { elements[card.element] += 15; }
  } else {
    resonanceText = `시공간 카드 '${card.name}'은 당신의 사주와 온화한 생기 상생을 이룩합니다. 자연스러운 원기 복구 시기로써, 평소 피로도가 축적되던 미립 신경 세포막을 부드럽게 이완하고 세포 호흡의 효율을 상향 평준화하는 무난하고 안온한 하루가 보증됩니다.`;
    elements.목 += 5;
    elements.화 += 5;
    elements.토 += 5;
    elements.금 += 5;
    elements.수 += 5;
  }

  const total = elements.목 + elements.화 + elements.토 + elements.금 + elements.수;
  elements.목 = Math.round((elements.목 / total) * 100);
  elements.화 = Math.round((elements.화 / total) * 100);
  elements.토 = Math.round((elements.토 / total) * 100);
  elements.금 = Math.round((elements.금 / total) * 100);
  elements.수 = 100 - (elements.목 + elements.화 + elements.토 + elements.금);

  const sortedPairs = Object.entries(elements).sort((a,b) => a[1] - b[1]);
  const lowestElement = sortedPairs[0][0];

  let dailyQuest = "";
  if (lowestElement === '목') {
    dailyQuest = "목(木)의 솟구치는 기운이 오늘 가장 부족하여 관절과 측면 림프계가 둔화되기 쉽습니다. 오늘 가벼운 숲이나 공원을 10분 이상 산책하고, 겨드랑이 주변 안쪽 림프를 원을 그리며 지그시 15회 이상 문질러 정체 기류를 순환시키십시오.";
  } else if (lowestElement === '화') {
    dailyQuest = "화(火)의 붉은 확장력이 정체되어 심장 경락의 열에너지가 부족할 수 있습니다. 따뜻한 성질의 허브티나 온수를 천천히 세 머금씩 나누어 음용하고, 가벼운 제자리 뜀뛰기나 빠른 심호흡을 통해 가슴 속 억압 전위를 날려버리십시오.";
  } else if (lowestElement === '토') {
    dailyQuest = "토(土)의 비옥한 지탱 능력이 약화되어 무게중심이 무너지고 소화 경맥에 가스가 차기 쉽습니다. 양 발바닥을 바닥에 완전한 수평 안착 형태로 밀착하는 '접지 스트레칭'을 1분간 실시하고, 명치 아래 복부를 둥글게 지압하십시오.";
  } else if (lowestElement === '금') {
    dailyQuest = "금(金)의 응축 수렴 및 폐 대장의 기류가 냉랭해져 호흡의 온전성이 흩어집니다. 날카롭게 서있던 가벼운 스트레스를 정화하기 위해 목 어깨 좌우 쇄골 아랫부분을 손등으로 가볍게 두드려 기류 충격을 배출하십시오 (30회).";
  } else {
    dailyQuest = "수(水)의 신장/수분 대사 정적 이완 기운이 조갈되어 안구 건조 및 요추 피로가 누적되었습니다. 허리를 90도로 가볍게 전굴하여 척추 마디마디를 이완시키고 지극히 맑은 한 컵의 천연 암반 생수를 충진하십시오.";
  }

  return {
    resonanceText,
    isHap,
    isChung,
    elements,
    lowestElement,
    dailyQuest
  };
}

interface DailyOracleSectionProps {
  sharedState: any;
  firebaseUser: any;
  dailyResult: any;
  isDailyOracleLoading: boolean;
  handleDailyOracle: (card: AuraThemeCard) => void;
  setShowChat: (show: boolean) => void;
  setInput: (txt: string) => void;
  handleSend: (txt: string) => void;
}

function DailyOracleSection({
  sharedState,
  firebaseUser,
  dailyResult,
  isDailyOracleLoading,
  handleDailyOracle,
  setShowChat,
  setInput,
  handleSend
}: DailyOracleSectionProps) {
  const [gachaStep, setGachaStep] = useState<number>(1);
  const [selectedTimeSpaceCard, setSelectedTimeSpaceCard] = useState<TimeSpaceCard | null>(null);
  const [forgingProgress, setForgingProgress] = useState<number>(0);
  const [forgingStageText, setForgingStageText] = useState<string>('');
  const [calculatedFateData, setCalculatedFateData] = useState<{
    resonanceText: string;
    isHap: boolean;
    isChung: boolean;
    elements: { 목: number; 화: number; 토: number; 금: number; 수: number };
    lowestElement: string;
    dailyQuest: string;
  } | null>(null);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // 1. Get 5 candidate cards for today
  const cardsToday = useMemo(() => {
    const day = new Date().getDate();
    const list = [...CANDIDATE_DEEP_CARDS];
    const selected: typeof CANDIDATE_DEEP_CARDS = [];
    for (let i = 0; i < 5; i++) {
      const idx = (day + i * 3) % list.length;
      selected.push(list[idx]);
      list.splice(idx, 1);
    }
    return selected;
  }, []);

  // Get calculated Saju string from Profile
  const sajuFullText = useMemo(() => {
    const sajuObj = calculateDetailedSaju(sharedState?.userProfile);
    if (sajuObj) return sajuObj.systemPromptSummary;

    const basic = sharedState?.userProfile?.basic;
    if (basic && basic.birthdate) {
      const parts = basic.birthdate.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0]);
        const m = parseInt(parts[1]);
        const d = parseInt(parts[2]);
        const h = basic.birthtime ? parseInt(basic.birthtime.split(':')[0]) : 12;
        const g = basic.gender === 'female' ? '여성' : '남성';
        try {
          return calcSaju(y, m, d, h, g);
        } catch (e) {
          return '';
        }
      }
    }
    return '';
  }, [sharedState?.userProfile]);

  // Restore state from LocalStorage on mount/update so it's durable and persistent!
  useEffect(() => {
    const today = new Date().toLocaleDateString('sv');
    const savedCardStr = localStorage.getItem(`aura_daily_card_${firebaseUser?.uid || 'guest'}_${today}`);
    const savedFateStr = localStorage.getItem(`aura_daily_fate_${firebaseUser?.uid || 'guest'}_${today}`);
    if (savedCardStr && savedFateStr) {
      try {
        const card = JSON.parse(savedCardStr);
        const fate = JSON.parse(savedFateStr);
        setSelectedTimeSpaceCard(card);
        setCalculatedFateData(fate);
        setGachaStep(4);
      } catch (e) {
        console.warn(e);
      }
    } else if (dailyResult && dailyResult.drawnCard) {
      const cardMatch = CANDIDATE_DEEP_CARDS.find(c => c.name === dailyResult.drawnCard.name);
      if (cardMatch) {
        const fate = processFateUnion(sajuFullText, cardMatch);
        setSelectedTimeSpaceCard(cardMatch);
        setCalculatedFateData(fate);
        setGachaStep(4);
      }
    }
  }, [dailyResult, sajuFullText, firebaseUser]);

  // Oscillator sounds helper
  const playHapticSound = (freq = 220) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.012, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  };

  const handleSelectCard = (card: TimeSpaceCard, idx: number) => {
    setSelectedCardIdx(idx);
    setSelectedTimeSpaceCard(card);
    setGachaStep(2); // Play Rising and Mist Burst Animation
    playAudioHaptic('card_draw');
    
    // Beautiful chime arpeggio
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, delay: number, dur: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + dur);
      };
      playTone(440, 0, 0.4);
      playTone(554, 0.1, 0.5);
      playTone(659, 0.2, 0.6);
      playTone(880, 0.3, 0.7);
    } catch (e) {}

    // Step 2 timer (1.5 seconds) -> Step 3 (forging progress)
    setTimeout(() => {
      setGachaStep(3);
      setForgingProgress(0);
      
      const stages = [
        "선천적 사주 원형 정렬 중...",
        "계사 만세력 대칭 교차 연산 중...",
        "삼합/육합/자율신경 정화 충동 스캔 중...",
        "신체 오행 기류 활력치 전송 맵핑 중..."
      ];
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;
        setForgingProgress(currentProgress);
        
        const stageIdx = Math.min(stages.length - 1, Math.floor((currentProgress / 100) * stages.length));
        setForgingStageText(stages[stageIdx]);
        
        if (currentProgress % 20 === 0) {
          playHapticSound(330);
        }
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          const fateResult = processFateUnion(sajuFullText, card);
          setCalculatedFateData(fateResult);
          
          // Save state to local persistence
          const today = new Date().toLocaleDateString('sv');
          localStorage.setItem(`aura_daily_card_${firebaseUser?.uid || 'guest'}_${today}`, JSON.stringify(card));
          localStorage.setItem(`aura_daily_fate_${firebaseUser?.uid || 'guest'}_${today}`, JSON.stringify(fateResult));
          
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(528, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1056, audioCtx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
          } catch (e) {}
          
          setTimeout(() => {
            setGachaStep(4);
          }, 600);
        }
      }, 80);
    }, 1500);
  };

  const radarData = useMemo(() => {
    if (!calculatedFateData) return [];
    return [
      { subject: '목 (Wood)', value: calculatedFateData.elements.목, fullMark: 100 },
      { subject: '화 (Fire)', value: calculatedFateData.elements.화, fullMark: 100 },
      { subject: '토 (Earth)', value: calculatedFateData.elements.토, fullMark: 100 },
      { subject: '금 (Metal)', value: calculatedFateData.elements.금, fullMark: 100 },
      { subject: '수 (Water)', value: calculatedFateData.elements.수, fullMark: 100 }
    ];
  }, [calculatedFateData]);

  return (
    <div className="space-y-12 text-left">
      <div className="text-center space-y-4 pt-16">
        <h3 className="text-5xl font-display text-white tracking-tighter">Energy Station</h3>
        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.4em] font-sans">사주와 만세력의 교차 연성 시공간 카드 가챠</p>
      </div>

      <div className="w-full max-w-6xl mx-auto pl-1 pr-1">
        {/* STEP 1 & 2 & 3: Selection and Chemistry Board */}
        {gachaStep < 4 && (
          <div className="relative w-full rounded-[40px] bg-zinc-950/80 border border-emerald-500/20 p-8 md:p-12 text-center space-y-12 overflow-hidden min-h-[580px] flex flex-col justify-between backdrop-blur-xl">
            {/* Mystical Fading Aura Mist Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
              <motion.div 
                animate={{ 
                  x: [-100, 100, -100], 
                  y: [-50, 50, -50], 
                  scale: [1, 1.2, 1] 
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full bg-emerald-500/10 blur-[130px]" 
              />
              <motion.div 
                animate={{ 
                  x: [100, -100, 100], 
                  y: [50, -50, 50], 
                  scale: [1.2, 1, 1.2] 
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full bg-teal-500/10 blur-[150px]" 
              />
            </div>

            {gachaStep === 1 && (
              <div className="space-y-8 relative z-10 w-full">
                <div className="space-y-3">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.3em] font-mono block">1단계 : 오늘의 운명 판 펼치기</span>
                  <h4 className="text-3xl font-display text-white tracking-widest uppercase">Select Your Space-Time Card</h4>
                  <p className="text-xs text-white/50 max-w-xl mx-auto leading-relaxed">
                    오늘 날짜의 천간지기가 당신의 사주팔자와 교감하여 5장의 고유 운명 후보 카드를 생성했습니다.<br/>
                    이 카드를 한 장 넘겨 직접 고르세요! 손수 고른 조화가 오늘의 물리 활력 스탯 지표를 결정합니다.
                  </p>
                  
                  {!sajuFullText && (
                    <div className="inline-block mt-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-yellow-500 font-sans tracking-wide">
                      ⚠️ 프로필 생년월일 미설정: 표준 좌표 대행 연산 중 (프로필 정보 기입 시 100% 맞춤형으로 활성화)
                    </div>
                  )}
                </div>

                {/* Fanned Oriental Cards Layout */}
                <div className="relative h-72 w-full flex items-center justify-center select-none overflow-visible py-8" style={{ perspective: "1000px" }}>
                  {cardsToday.map((card, idx) => {
                    const total = 5;
                    const progress = (idx / (total - 1)) - 0.5;
                    
                    // Precise mathematical fan shape
                    const xOffset = progress * 400;
                    const yOffset = (progress * progress) * 90;
                    const rotateZ = progress * 32;

                    return (
                      <motion.div
                        key={`ts-gacha-deck-${card.name}`}
                        initial={{ y: 200, opacity: 0, scale: 0.8 }}
                        animate={{
                          x: xOffset,
                          y: yOffset,
                          rotateZ: rotateZ,
                          scale: 1,
                          opacity: 1
                        }}
                        whileHover={{
                          y: yOffset - 35,
                          scale: 1.15,
                          rotateZ: rotateZ * 0.15,
                          zIndex: 100,
                          boxShadow: "0 0 35px rgba(16, 185, 129, 0.4)",
                          transition: { type: "spring", stiffness: 220, damping: 15 }
                        }}
                        onHoverStart={() => playHapticSound(250 + idx * 80)}
                        onClick={() => handleSelectCard(card, idx)}
                        className="absolute w-24 h-40 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950 border border-emerald-500/35 rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer active:scale-95 group/card transition-[border-color,box-shadow]"
                        style={{ 
                          left: "calc(50% - 3rem)", 
                          top: "calc(50% - 5rem)", 
                          transformOrigin: "bottom center",
                          zIndex: idx + 10
                        }}
                      >
                        <div className="absolute inset-1 border border-emerald-500/10 rounded-xl" />
                        <div className="absolute inset-2 border border-emerald-500/20 rounded-lg flex flex-col justify-between p-2.5 bg-emerald-500/5 group-hover/card:bg-emerald-500/10 transition-colors shadow-inner">
                          {/* Sacred Geometric Pattern */}
                          <div className="absolute inset-1 border border-dashed border-emerald-500/10 rounded-md pointer-events-none" />
                          <div className="text-[7px] text-emerald-500/40 text-left font-mono font-bold leading-none select-none tracking-widest uppercase">
                            AURA
                          </div>
                          <div className="w-10 h-10 rounded-full border border-emerald-500/20 flex items-center justify-center bg-black/50 mx-auto shadow-md relative group-hover/card:scale-110 group-hover/card:border-emerald-400 transition-all duration-300">
                            <Activity size={18} className="text-emerald-500/60 group-hover/card:text-emerald-400 animate-pulse" />
                          </div>
                          <div className="text-[7px] text-emerald-500/40 text-right font-mono font-bold leading-none select-none tracking-widest uppercase">
                            SPACE TIME
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {gachaStep === 2 && selectedTimeSpaceCard && (
              <div className="space-y-8 relative z-10 w-full flex flex-col items-center justify-center py-16">
                {/* Step 2 animation: Card triggers misty prism blast */}
                <motion.div
                  initial={{ scale: 0.5, y: 150, rotateZ: -10, opacity: 0 }}
                  animate={{ scale: [0.8, 1.25, 1.1], y: 0, rotateZ: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="w-32 h-52 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/30 border-2 border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.5)] flex flex-col justify-between p-4 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                  {/* Animated prism colored bars inside card representing the blast */}
                  <motion.div
                    animate={{ scale: [1, 2.5, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset--10 bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-blue-500/20 blur-xl mix-blend-color-dodge z-0"
                  />
                  <div className="flex justify-between items-center z-10 text-[8px] font-mono font-bold text-emerald-400">
                    <span>ALIGNING</span>
                    <Sparkles size={8} className="animate-spin-slow" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-400/40 flex items-center justify-center bg-zinc-950/80 mx-auto z-10 shadow-lg relative">
                    <Activity size={22} className="text-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[8px] font-bold text-emerald-400/80 uppercase tracking-widest z-10 w-full text-center">
                    destiny seed
                  </span>
                </motion.div>

                <div className="space-y-2 max-w-sm">
                  <h5 className="text-lg font-bold text-emerald-400 font-sans tracking-wide">직관의 광문이 열리는 중</h5>
                  <p className="text-xs text-white/50 leading-relaxed break-keep">
                    선택하신 시공간 카드가 중심축에 결합하며 신비로운 안개를 prism의 찬란한 광선으로 걷어내고 기류 오행의 스펙트럼 화합을 설계합니다...
                  </p>
                </div>
              </div>
            )}

            {gachaStep === 3 && selectedTimeSpaceCard && (
              <div className="space-y-8 relative z-10 w-full flex flex-col items-center justify-center py-16">
                {/* Step 3: Forging alchemy progress */}
                <div className="w-40 h-40 relative flex items-center justify-center mb-4">
                  {/* Glowing outer rotating ring */}
                  <div className="absolute inset-0 border-2 border-dashed border-emerald-400/30 rounded-full animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-3 border border-dashed border-teal-500/20 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                  <div className="absolute inset-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full flex flex-col items-center justify-center p-3 border border-white/5 shadow-inner">
                    <span className="text-2xl font-mono font-bold text-emerald-300">{forgingProgress}%</span>
                    <span className="text-[8px] text-white/30 tracking-widest uppercase font-mono mt-0.5">FORGING</span>
                  </div>
                </div>

                <div className="space-y-3 max-w-sm">
                  <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-mono text-emerald-400 uppercase tracking-widest animate-pulse">
                    Alchemical Connection
                  </div>
                  <h5 className="text-sm font-bold text-white tracking-wide min-h-[20px]">
                    {forgingStageText}
                  </h5>
                  <p className="text-xs text-white/40 leading-relaxed font-sans">
                    오늘 가챠의 오행 수화 스탯을 정밀 구성 중입니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Gacha Result Report, Radar Chart & Daily Quest */}
        {gachaStep === 4 && selectedTimeSpaceCard && calculatedFateData && (
          <div className="space-y-8 animate-fade-in w-full text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* 1. Chosen Card Display Column */}
              <div className="lg:col-span-4 space-y-6">
                <div className="absolute overflow-hidden pointer-events-none" />
                
                {/* 3D Premium Card Face */}
                <motion.div
                  initial={{ rotateY: -180, scale: 0.95 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 80, damping: 14 }}
                  style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full max-w-[280px] h-96 mx-auto cursor-pointer relative rounded-3xl border border-amber-500/40 p-5 shadow-[0_0_35px_rgba(245,158,11,0.15)] overflow-hidden flex flex-col justify-between"
                >
                  {/* Metallic glow backdrop */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center z-0 transition-opacity" 
                    style={{ 
                      backgroundImage: "url('/cards/heal_bg.png')",
                      opacity: 0.25
                    }} 
                  />
                  <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
                  
                  {/* Frame Borders and Corners */}
                  <div className="absolute inset-2 border border-amber-500/20 rounded-2xl pointer-events-none z-10" />
                  <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-amber-500/60 pointer-events-none z-10" />
                  <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-amber-500/60 pointer-events-none z-10" />
                  <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-amber-500/60 pointer-events-none z-10" />
                  <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-amber-500/60 pointer-events-none z-10" />

                  {/* Card Head */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-amber-400 z-10 tracking-[0.2em]">
                    <span className="bg-amber-400/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {selectedTimeSpaceCard.stem + selectedTimeSpaceCard.branch}
                    </span>
                    <div className="flex items-center gap-1.5 font-sans font-bold">
                      <span style={{ color: selectedTimeSpaceCard.color }}>{selectedTimeSpaceCard.element}인(印)</span>
                      <Sparkles size={11} className="text-amber-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Big Symbol Center Graphic */}
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center z-10 my-auto animate-[pulse_3s_ease-in-out_infinite]">
                    <div className="absolute inset-0 border border-dashed border-amber-500/30 rounded-full animate-[spin_25s_linear_infinite]" />
                    <div className="absolute inset-2 border border-amber-500/15 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                    <div 
                      className="w-16 h-16 rounded-full bg-zinc-950 border border-amber-500/50 flex flex-col items-center justify-center md:scale-105 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                    >
                      <span className="text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                        {selectedTimeSpaceCard.emoji}
                      </span>
                    </div>
                  </div>

                  {/* Lower Typography Description */}
                  <div className="text-center space-y-1.5 z-10">
                    <span className="text-[10px] font-serif text-amber-400/80 tracking-[0.2em] font-bold uppercase block">
                      {selectedTimeSpaceCard.title}
                    </span>
                    <p className="text-[11px] text-zinc-300 leading-relaxed tracking-tight break-keep px-2">
                      {selectedTimeSpaceCard.desc}
                    </p>
                  </div>
                </motion.div>

                {/* Reset button to clear state and redraw */}
                <button 
                  onClick={() => {
                    const today = new Date().toLocaleDateString('sv');
                    localStorage.removeItem(`aura_daily_card_${firebaseUser?.uid || 'guest'}_${today}`);
                    localStorage.removeItem(`aura_daily_fate_${firebaseUser?.uid || 'guest'}_${today}`);
                    setSelectedTimeSpaceCard(null);
                    setCalculatedFateData(null);
                    setGachaStep(1);
                  }}
                  className="w-full py-2.5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 text-white/40 hover:text-white/80 text-[10px] font-mono tracking-widest text-center transition-all bg-zinc-950/40 uppercase"
                >
                  🔄 RESET & GACHA AGAIN
                </button>
              </div>

              {/* 2. Saju Harmony Analysis & Waldorf Radar Pentagon System Column */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Alchemical Saju Hap/Chung Report */}
                <div className="p-6 rounded-[32px] bg-zinc-950/60 border border-emerald-500/20 backdrop-blur-md flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-[0.3em] font-mono block">
                      3단계 : 시공간의 결합 및 합·충 분석
                    </span>
                    <h4 className="text-xl font-bold text-white tracking-tight leading-snug">
                      사주(四柱) 생기 공명도 판정
                    </h4>
                    <div className="text-sm font-sans text-emerald-100/80 leading-relaxed whitespace-pre-line py-2 border-t border-white/5 mt-2">
                      {calculatedFateData.resonanceText}
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-white/30 font-mono tracking-widest flex flex-col gap-0.5 border-t border-white/5 pt-3">
                    <span>• MAIN BRANCH: {selectedTimeSpaceCard.branch}(지지)</span>
                    <span>• SAJU SYMMETRY: {sajuFullText ? sajuFullText.split('\n')[0] : '미지 좌표계'}</span>
                    <span>• RESONANCE: {calculatedFateData.isHap ? '합(合) 보너스 판정' : calculatedFateData.isChung ? '충(沖) 정화 정밀 판정' : '본질적 상생 공명'}</span>
                  </div>
                </div>

                {/* 🌟 Daily Oracle 오행별 에너지 변화 추이 꺾은선 그래프 대시보드 */}
                <DailyElementTrendDashboard
                  currentElements={calculatedFateData.elements}
                  userProfile={sharedState?.userProfile}
                  cardName={selectedTimeSpaceCard.title}
                  theme="emerald"
                />

                {/* 4. Prominent Daily Quest Box */}
                <div className="p-6 rounded-[32px] bg-gradient-to-tr from-amber-500/10 via-zinc-950 to-amber-500/5 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.06)] space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/40 text-[9px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                      활력 연계 퀘스트 (AURA QUEST)
                    </div>
                    <span className="text-[10px] text-white/50 font-sans">Active Mission Tracker</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white leading-snug">
                      음양 오행 균형 충진 미션
                    </h5>
                    <p className="text-xs text-white/70 leading-relaxed font-sans mt-1.5 break-keep">
                      {calculatedFateData.dailyQuest}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5 pt-1.5">
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white/60 font-sans">
                      🎯 원석 가챠 보강
                    </div>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white/60 font-sans">
                      🔮 주역 천사 가동
                    </div>
                  </div>
                </div>

                {/* 5. Deep generative AI analysis loader & report block */}
                <div className="pt-4 border-t border-white/5 space-y-6">
                  {!dailyResult ? (
                    <motion.button 
                      whileHover={{ scale: 1.02, translateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const proxyCard: AuraThemeCard = {
                          id: `ts_${selectedTimeSpaceCard.name}`,
                          name: selectedTimeSpaceCard.name,
                          nameKo: selectedTimeSpaceCard.title,
                          emoji: selectedTimeSpaceCard.emoji,
                          keywords: [selectedTimeSpaceCard.element + "기(氣)", "만세력", "시공간"],
                          desc: selectedTimeSpaceCard.desc
                        };
                        handleDailyOracle(proxyCard);
                      }}
                      disabled={isDailyOracleLoading}
                      className="w-full relative group overflow-hidden rounded-[30px] p-[1.5px] bg-gradient-to-r from-emerald-500/50 to-teal-500/50 shadow-2xl disabled:opacity-50 cursor-pointer block text-left"
                    >
                      <div className="bg-zinc-950 rounded-[28px] p-6 md:p-8 text-center space-y-4 relative z-10 group-hover:bg-zinc-900 transition-all font-sans">
                        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg group-hover:scale-105 transition-transform duration-500">
                          {isDailyOracleLoading ? <RefreshCw size={24} className="text-emerald-400 animate-spin" /> : <Sparkles size={24} className="text-emerald-400 animate-pulse" />}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">초차원 AI 아우라 가이드라인 생성</h4>
                          <p className="text-[10px] text-emerald-100/45 uppercase tracking-widest font-sans font-bold mt-1">
                            오늘의 만세력 결합과 오행 특질에 맞춰 미세 조율된 AI 원리 처방 해독지를 동기화합니다
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ) : (
                    <div className="p-6 md:p-8 rounded-[35px] bg-zinc-950/30 border border-white/5 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider text-emerald-500 font-bold flex items-center gap-1 font-sans">
                          <Sparkles size={14} /> 심층 인과 관계식 AI 대리독서 해독 완료
                        </span>
                        <TTSButton text={dailyResult.diagnosis} voice="Kore" className="text-emerald-400 border-emerald-500/20 text-xs py-1.5 scale-90 font-sans" />
                      </div>
                      <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 text-white/95 text-sm sm:text-base font-sans leading-relaxed space-y-4 outline-none [&>h3]:text-emerald-300 [&>h3]:text-lg [&>h3]:font-bold [&>ul]:list-disc [&>ul]:pl-5 [&>p]:mb-3 [&>strong]:text-emerald-200">
                        <Streamdown>{dailyResult.diagnosis}</Streamdown>
                      </div>

                      {dailyResult.guidance && (
                        <div className="p-5 rounded-3xl bg-white/[0.02] border border-emerald-500/10 text-left space-y-2 font-sans">
                          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest block flex items-center gap-1.5 font-sans">
                            <Sparkles size={12} /> Synergy Energy Vibration
                          </span>
                          <div className="text-xs text-white/70 leading-relaxed font-sans mt-1">
                            <Streamdown>{dailyResult.guidance}</Streamdown>
                          </div>
                        </div>
                      )}

                      {/* Slide Doctor Prescriptions */}
                      <DoctorPrescriptionSlides 
                        coherence={(() => { 
                          return 75 + (selectedTimeSpaceCard.name.charCodeAt(0) % 20); 
                        })()} 
                        onSelectOption={(txt) => { 
                          setShowChat(true); 
                          try { setInput(txt); } catch(e){}
                          handleSend(txt); 
                        }} 
                      />
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const HEAL_SWIPE_TABS = ['meditation', 'oneMinute', 'synergy'] as const;
type HealSwipeTab = typeof HEAL_SWIPE_TABS[number];

const tabSlideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function HealApp() {
  const [, navigate] = useLocation();
  const isTTSActive = useTTSActive();
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const { firebaseUser, sharedState, updateSharedState, isChatOpen, setIsChatOpen, sendUnifiedMessage, openLucyChat, personaMessages, isGenerating } = useApp();
  const { isCurrentAppPlaying: isBinauralPlaying, toggle: toggleBinaural } = useBinauralBeat('heal');
  const lucyMessages = personaMessages.lucy || [];
  const isSpecialFeatureChromeHidden = useSpecialFeatureChromeHidden();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const [activeMode, setActiveMode] = useState<'simple' | 'soul' | 'bible' | 'history' | 'meditation' | 'oneMinute' | 'mission' | 'synergy'>(() => {
    if (typeof window !== 'undefined') {
      const urlTab = new URLSearchParams(window.location.search).get('tab');
      const sessionTab = sessionStorage.getItem('prism_target_tab');
      const tab = urlTab || sessionTab;
      if (tab === 'meditation' || tab === 'synergy' || tab === 'oneMinute' || tab === 'mission') {
        sessionStorage.removeItem('prism_target_tab');
        return tab as any;
      }
    }
    return 'meditation';
  });
  useScrollToTopOnChange([activeMode]);

  const currentSwipeTab: HealSwipeTab =
    activeMode === 'oneMinute' || activeMode === 'mission'
      ? 'oneMinute'
      : activeMode === 'synergy'
      ? 'synergy'
      : 'meditation';

  const {
    direction,
    changeTabWithDirection,
    swipeHandlers,
  } = useSwipeableTabs<HealSwipeTab>({
    tabs: HEAL_SWIPE_TABS,
    activeTab: currentSwipeTab,
    enabled: true,
    enableHaptics: true,
    onTabChange: (newTab) => {
      setActiveMode(newTab);
      setShowHealingMissionModal(false);
      setIsChatOpen(false);
      resetAppScroll();
    },
  });

  useEffect(() => {
    const applyTargetTab = (tab: string | null | undefined) => {
      if (!tab) return;
      if (tab === 'meditation' || tab === 'synergy' || tab === 'oneMinute' || tab === 'mission') {
        setActiveMode(tab as any);
        setShowDailyModal(false);
        setShowSoulModal(false);
        setIsChatOpen(false);
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
      if (path.startsWith('/heal')) {
        let tab = customEvent.detail?.tab;
        if (!tab && path.includes('?')) {
          try {
            const url = new URL(path, 'http://localhost');
            tab = url.searchParams.get('tab');
          } catch (_) {}
        }
        if (tab) {
          applyTargetTab(tab);
        } else if (path === '/heal') {
          setActiveMode('meditation');
          setShowDailyModal(false);
          setShowSoulModal(false);
          setIsChatOpen(false);
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

      // 힐 메뉴 id → 탭 매핑
      const tabMap: Record<string, string> = {
        heal_wellness: 'oneMinute',
        heal_hoponopono: 'meditation',
        heal_sedona: 'meditation',
        heal_breathing: 'oneMinute',
        heal_chakra: 'oneMinute',
        heal_frequency: 'oneMinute',
      };
      const targetTab = tabMap[targetMenuId] || 'oneMinute';
      setActiveMode(targetTab as any);
      setShowDailyModal(false);
      setShowSoulModal(false);
      setIsChatOpen(true);
      resetAppScroll();

      // handleSend 즉시 실행
      setTimeout(() => {
        try { handleSend(text); } catch (_) {}
      }, 350);
    };

    // 마운트 시 세션스토리지 잔여 텍스트 처리
    const autoText = sessionStorage.getItem('prism_auto_execute_text');
    const autoTarget = sessionStorage.getItem('prism_auto_execute_target') || '';
    if (autoText && autoText.trim().length >= 2) {
      sessionStorage.removeItem('prism_auto_execute_text');
      const tabMap2: Record<string, string> = {
        heal_wellness: 'oneMinute',
        heal_breathing: 'oneMinute',
        heal_chakra: 'oneMinute',
        heal_frequency: 'oneMinute',
        heal_hoponopono: 'meditation',
        heal_sedona: 'meditation',
      };
      const targetTab2 = tabMap2[autoTarget] || 'oneMinute';
      setActiveMode(targetTab2 as any);
      setIsChatOpen(true);
      setTimeout(() => {
        try { handleSend(autoText.trim()); } catch (_) {}
      }, 400);
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

  const ALL_HEAL_SUGGESTIONS = [
    '어깨와 목이 너무 뭉쳤어',
    '오늘 잠을 조금밖에 못 잤어',
    '스트레칭 좀 알려줘',
    '자세 교정 루틴 5분짜리 해볼까?',
    '하루종일 모니터만 봤더니 피곤해',
    '허리가 뻐근하고 기운이 없어',
    '가벼운 유산소 운동 아이디어',
    '눈 피로를 풀어주는 3분 마사지',
    '스트레스 풀리는 웰니스 기법',
    '손목 통증 예방하는 직장인 동작',
    '골반 틀어짐 교정 스트레칭 루틴',
    '두통이 살짝 올 때 좋은 호흡법'
  ];

  const [healSuggestions, setHealSuggestions] = useState<string[]>(() => {
    const shuffled = [...ALL_HEAL_SUGGESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  });

  const handleRefreshHealSuggestions = () => {
    const shuffled = [...ALL_HEAL_SUGGESTIONS].sort(() => 0.5 - Math.random());
    setHealSuggestions(shuffled.slice(0, 4));
  };

  const [notice, setNotice] = useState({ open: false, title: '', message: '' });
  const [poeInsight, setPoeInsight] = useState<{ insight: string, category: string } | null>(null);
  const [isInsightCollapsed, setIsInsightCollapsed] = useState(false);

  const [showHealingMissionModal, setShowHealingMissionModal] = useState(false);

  useEffect(() => {
    const evName = showHealingMissionModal ? "tarot-active" : "tarot-inactive";
    window.dispatchEvent(new CustomEvent(evName));
    return () => {
      window.dispatchEvent(new CustomEvent("tarot-inactive"));
    };
  }, [showHealingMissionModal]);

  const [soulData, setSoulData] = useState({
    coreValue: "안정과 평화",
    unconsciousPattern: "완벽주의적 강박과 피로",
    preference: "차분하고 깊이있는 위로",
    stats: [
      { subject: '감정 수용력', A: 80, fullMark: 100 },
      { subject: '회복 탄력성', A: 65, fullMark: 100 },
      { subject: '자기 자비', A: 45, fullMark: 100 },
      { subject: '스트레스 저항', A: 70, fullMark: 100 },
      { subject: '공감 능력', A: 90, fullMark: 100 },
    ],
    energyFlow: [
      { time: '월', value: 40 }, { time: '화', value: 60 }, { time: '수', value: 55 }, { time: '목', value: 80 }, { time: '금', value: 70 }, { time: '토', value: 90 }, { time: '일', value: 85 }
    ],
    emotions: [
      { name: '평온', value: 45 }, { name: '불안', value: 20 }, { name: '피로', value: 25 }, { name: '기쁨', value: 10 }
    ]
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('soul_mirror_heal');
      if (saved) {
        setSoulData(JSON.parse(saved));
      }
    } catch (_) {}

    if (!firebaseUser) return;
    const isDev = localStorage.getItem('developer_bypass') === 'true';
    if (isDev) return;

    const fetchSoulData = async () => {
      try {
        const docRef = doc(db, 'soul_mirror', firebaseUser.uid, 'dapps', 'heal');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSoulData(docSnap.data() as any);
        }
      } catch (err) {
        console.warn("[Heal] Error loading soulData from cloud, falling back to local storage:", err);
      }
    };
    fetchSoulData();
  }, [firebaseUser]);
  
  const [localHistory, setLocalHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const [dailyMode, setDailyMode] = useState<string>('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [dailyResult, setDailyResult] = useState<any>(null);
  const [isDailyOracleLoading, setIsDailyOracleLoading] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [limitModalInfo, setLimitModalInfo] = useState<{ open: boolean; type: 'daily' | 'soul'; dapp: string } | null>(null);

  // States for Daily Tarot Card Picking
  const [dailyDrawnCard, setDailyDrawnCard] = useState<(AuraThemeCard & { isReversed?: boolean }) | null>(null);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);

  const [shuffledAuraCards, setShuffledAuraCards] = useState(() => shuffleCardDeck(AURA_CARDS));
  const [healOffsets, setHealOffsets] = useState<{ xOff: number; yOff: number; rotOff: number }[]>(() =>
    Array.from({ length: 22 }).map(() => ({
      xOff: 0,
      yOff: 0,
      rotOff: 0,
    }))
  );
  useEffect(() => {
    if ((activeMode as any) === 'daily_removed' && !dailyDrawnCard) {
      setShuffledAuraCards(shuffleCardDeck(AURA_CARDS));
      setHealOffsets(
        Array.from({ length: AURA_CARDS.length }).map(() => ({
          xOff: 0,
          yOff: 0,
          rotOff: 0,
        }))
      );
    }
  }, [activeMode, dailyDrawnCard]);
  useEffect(() => {
    if ((activeMode as any) !== 'daily_removed' || dailyDrawnCard) return;

    const alignScroll = () => {
      const deck = cardContainerRef.current;
      if (deck) {
        deck.scrollTo({
          left: Math.max(0, (deck.scrollWidth - deck.clientWidth) / 2),
          behavior: 'smooth'
        });
      }
    };

    const frame = window.requestAnimationFrame(alignScroll);
    const t1 = setTimeout(alignScroll, 60);
    const t2 = setTimeout(alignScroll, 180);
    const t3 = setTimeout(alignScroll, 350);
    const t4 = setTimeout(alignScroll, 600);

    const deck = cardContainerRef.current;
    if (!deck) {
      return () => {
        window.cancelAnimationFrame(frame);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
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
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);

      deck.removeEventListener('mousedown', onMouseDown);
      deck.removeEventListener('mouseleave', onMouseLeave);
      deck.removeEventListener('mouseup', onMouseUp);
      deck.removeEventListener('mousemove', onMouseMove);
      deck.removeEventListener('wheel', onWheel);
    };
  }, [activeMode, dailyDrawnCard, shuffledAuraCards]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDailyOracleProcessing, setIsDailyOracleProcessing] = useState(false);

  const [sessionComfortLevel, setSessionComfortLevel] = useState<number>(() => {
    const saved = localStorage.getItem(`heal_daily_level_${new Date().toLocaleDateString('sv')}`);
    return saved ? parseInt(saved, 10) : 3;
  });

  const [sessionLevelCheckedIn, setSessionLevelCheckedIn] = useState<boolean>(() => {
    return localStorage.getItem(`heal_daily_checked_${new Date().toLocaleDateString('sv')}`) === 'true';
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [insightResult, setInsightResult] = useState<any>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [showSoulModal, setShowSoulModal] = useState(false);
  const [form, setForm] = useState(() => {
    const p = getPersistentUserProfile()?.basic;
    return {
      name: p?.name || '',
      nickname: p?.nickname || '',
      birthdate: p?.birthdate || '',
      birthtime: p?.birthtime || '',
      gender: p?.gender === 'male' ? '남성' : '여성',
      city: p?.birthCity || '서울',
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
      city: fbProfile.birthCity || prev.city || '서울',
    }));
  }, [sharedState?.userProfile]);

  const isSendingRef = useRef(false);

  useEffect(() => {
    updateSharedState({ sourceApp: 'HEAL' }, 'HEAL');
  }, []);

  const healOracleHistory = useMemo(
    () => [...(sharedState?.healHistory || []), ...localHistory],
    [sharedState?.healHistory, localHistory],
  );

  useEffect(() => {
    if (localHistory && localHistory.length > 0) {
      const latestSoul = localHistory.find(h => h.type === 'SOUL_PROFILE');
      if (latestSoul) {
        setInsightResult(latestSoul);
      }
    }
  }, [localHistory]);

  useEffect(() => {
    if (dailyResult?.drawnCard && !dailyDrawnCard) {
      setDailyDrawnCard(dailyResult.drawnCard);
      const foundIdx = AURA_CARDS.findIndex((c) => c.name === dailyResult.drawnCard.name);
      setSelectedCardIdx(foundIdx >= 0 ? foundIdx : 0);
    }
  }, [dailyResult, dailyDrawnCard]);

  const handleSend = async (customMsg?: string, sendOpts?: OracleDeepInsightSendOpts) => {
    const text = (customMsg || '').trim();
    if (!text) return;
    if (!sendOpts?.force && (isSendingRef.current || isGenerating.lucy)) return;
    
    isSendingRef.current = true;
    openLucyChat('aura');

    poeQuickInsight(text, lucyMessages as any).then((res: any) => {
      if (res && res.insight) {
        setPoeInsight({ insight: res.insight, category: res.category });
        setIsInsightCollapsed(false);
        if (res.themeColor || res.currentVibe) {
          updateSharedState({
            ...(res.themeColor ? { themeColor: res.themeColor } : {}),
            ...(res.currentVibe ? { currentVibe: res.currentVibe } : {})
          }, 'HEAL');
        }
      }
    }).catch(console.error);

    try {
      const profile = sharedState?.userProfile || getPersistentUserProfile();
      const deepCoreInfo = buildDeepSynapseContext(profile);
      const soulMirrorInfo = `\n[영혼의 거울]\n- 핵심 가치: ${soulData.coreValue}\n- 무의식적 패턴: ${soulData.unconsciousPattern}\n- 취향 및 선호: ${soulData.preference}\n이 데이터를 바탕으로 사용자의 방향성을 교정하여 코칭에 반영할 것. 또한, 이번 대화를 바탕으로 이 영혼의 거울 데이터(핵심 가치, 패턴, 취향, stats, energyFlow, emotions 등)를 갱신해야 한다면 응답의 가장 마지막에 오직 다음 포맷으로만 업데이트 내용을 출력하세요: [SOUL_UPDATE: {"coreValue":"...","unconsciousPattern":"...","preference":"...","stats":[{"subject":"...","A":85,"fullMark":100}],"energyFlow":[{"time":"...","value":80}],"emotions":[{"name":"...","value":40}]}]`;
      const combinedContext = deepCoreInfo + "\n" + soulMirrorInfo;

      const oracleCtx = sendOpts?.oracleContext ? `\n${sendOpts.oracleContext}` : '';
      await sendUnifiedMessage(text, 'aura', undefined, {
        extraSystemContext: `${combinedContext}${oracleCtx}`,
        onFinish: async (finalResponse) => {
          const match = finalResponse.match(/\[SOUL_UPDATE:\s*({[\s\S]*?})\]/);
          if (match) {
            try {
              const parsed = JSON.parse(match[1]);
              setSoulData(prev => {
                const updated = { ...prev, ...parsed };
                if (firebaseUser) {
                  const isDev = localStorage.getItem('developer_bypass') === 'true';
                  if (isDev) {
                    localStorage.setItem('soul_mirror_heal', JSON.stringify(updated));
                  } else {
                    setDoc(doc(db, 'soul_mirror', firebaseUser.uid, 'dapps', 'heal'), updated)
                      .catch(e => console.error("Error saving soulData to firestore", e));
                  }
                }
                return updated;
              });
            } catch (e) {
              console.error("Soul update parse error", e);
            }
          }

          const cleaned = cleanLucyChatText(finalResponse);
          if (firebaseUser && localStorage.getItem('developer_bypass') !== 'true') {
            await addDoc(collection(db, 'heal_history', firebaseUser.uid, 'entries'), {
              type: 'chat', text, reply: cleaned, createdAt: serverTimestamp(), content: cleaned
            });
          }

          updateSharedState({ healHistory: lucyMessages.slice(0, 50) }, 'HEAL');
        },
      });
    } catch (err: any) {
      console.error(err);
      setNotice({ open: true, title: "통신 오류", message: err?.message || String(err) });
    } finally {
      isSendingRef.current = false;
    }
  };

  useEffect(() => {
    const handleDailyOracleUpdated = () => {
      const today = getTodayDateKey();
      try {
        const cached = localStorage.getItem(`prism_daily_oracle_heal_${today}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (!parsed.dateKey || parsed.dateKey === today) {
            setDailyResult({ ...(parsed.data || parsed), dateKey: today });
            if (parsed.drawnCard) {
              setDailyDrawnCard(parsed.drawnCard as AuraThemeCard);
            }
          }
        }
      } catch (_) {}
    };
    window.addEventListener('prism:daily_oracle_updated', handleDailyOracleUpdated);
    return () => {
      window.removeEventListener('prism:daily_oracle_updated', handleDailyOracleUpdated);
    };
  }, []);

  const handleDailyOracle = async (
    selectedCard?: AuraThemeCard,
    opts?: { autoRun?: boolean },
  ) => {
    if (dailyResult) {
      if (!hasSeenOracleModalToday('heal')) {
        setShowDailyModal(true);
        markOracleModalSeen('heal');
      }
      return;
    }
    if (isDailyOracleLoading) return;

    setIsDailyOracleLoading(true);

    const modePrompt = dailyMode === 'breathe' ? '세도나 메서드의 핵심 질문들을 거치면서 긴장 상태의 에고를 우주 무한의 차원으로 가볍고 평화롭게 흘려보내는 방하착(Letting Go)에 초점을 맞춰' :
                       dailyMode === 'reflect' ? '마음을 괴롭히는 결핍 욕구(통제욕, 인정욕, 안전욕, 분리욕)를 파헤치고 이를 완전히 수용하여 흘려보내는 데이비드 호킨스 박사식 심층 무의식 투사로' :
                       dailyMode === 'oracle' ? '의식 지도(Scale of Consciousness) 상에서 현재의 감정 주파수를 짚어보고, 용기/수용/사랑/평화의 정위로 고양시키는 정밀한 정제 코칭으로' : 
                       dailyMode === 'care' ? '마음의 완강한 저항(Resistance)과 억압된 감정 에너지를 있는 그대로 항복(Surrender)해 흘려보내는 따뜻하고 우아한 방하착 기도 및 확언으로' : '세도나 메서드의 흘려보내기 4문답과 데이비드 호킨스의 항복 기술을 융합한 최적의 정서 자유 지침화로';

    const userProfileStr = sharedState?.userProfile ? JSON.stringify(sharedState.userProfile) : "프로필 정보 없음";
    const recentMemory = sharedState?.healMemory || sharedState?.globalMemory || "최근 기록 없음";

    const cardContext = (selectedCard || dailyDrawnCard)
      ? `\n[오늘의 에고 정화 카드]: ${(selectedCard || dailyDrawnCard)!.nameKo} (${(selectedCard || dailyDrawnCard)!.name}) - 키워드: ${(selectedCard || dailyDrawnCard)!.keywords.join(', ')} - 무의식 처방 가이드 테마: ${(selectedCard || dailyDrawnCard)!.desc}`
      : "";
    const levelContext = `\n[자가 진단 정서 피로 편차]: 5단계 중 현재 레벨 ${sessionComfortLevel}수준 (${sessionComfortLevel === 1 ? '매우 심각한 피로 및 강박/우울' : sessionComfortLevel === 5 ? '가볍고 쾌적한 상태' : '보통 혹은 미세 피로 순환 상태'})`;

    const activeCard = selectedCard || dailyDrawnCard || AURA_CARDS[0];

    try {
      let data: any = null;

      // Try fast dedicated server endpoint first
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000);

        const apiRes = await fetch('/api/ai/daily-sedona', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            card: activeCard,
            theme: dailyMode,
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
        console.warn('[Heal Daily] Dedicated API fetch failed/timed out, using local specialized oracle engine:', fetchErr);
      }

      // Fallback to rich card-specific local engine if server response is unavailable
      if (!data || !data.diagnosis) {
        data = buildSpecificSedonaDailyOracle(activeCard, undefined, dailyMode);
      }

      const finalData = { ...data, drawnCard: activeCard, dateKey: getTodayDateKey() };
      setDailyResult(finalData);
      setShowDailyModal(true);
      markOracleModalSeen('heal');

      const cardObj = activeCard;
      const todayK = getTodayDateKey();
      recordDailyOracleResult({
        app: 'heal',
        featureName: '아우라 웰니스 일일 오라클',
        cardName: cardObj ? `${cardObj.nameKo} (${cardObj.name})` : '치유 에고 정화 카드',
        cardKeywords: cardObj?.keywords,
        cardDesc: cardObj?.desc,
        drawnCard: activeCard,
        diagnosis: String(data.diagnosis || ''),
        remedy: String(data.remedy || ''),
        frequency: String(data.frequency || '528Hz'),
        dateKey: todayK,
      });

      // Background non-blocking sync
      try {
        void updateSharedState({
          lastHealDailySync: Date.now(),
          todayOracles: {
            ...(sharedState?.todayOracles || {}),
            [todayK]: {
              ...(sharedState?.todayOracles?.[todayK] || {}),
              heal: finalData,
            },
          },
          latestDailyOracles: {
            ...(sharedState?.latestDailyOracles || {}),
            heal: finalData,
          },
        }, 'HEAL');
      } catch (_) {}

      if (firebaseUser && localStorage.getItem('developer_bypass') !== 'true') {
        void addDoc(collection(db, 'heal_history', firebaseUser.uid, 'entries'), {
          type: 'DAILY_ORACLE', ...finalData, createdAt: serverTimestamp(),
        }).catch((dbErr) => console.warn('Firebase heal history logging skipped', dbErr));
      }
    } catch (err: any) {
      console.warn('Heal daily oracle recovering with fallback:', err);
      const fallbackData = { ...buildSpecificSedonaDailyOracle(activeCard, undefined, dailyMode), drawnCard: activeCard, dateKey: getTodayDateKey() };
      setDailyResult(fallbackData);
      setShowDailyModal(true);
      markOracleModalSeen('heal');
    } finally {
      setIsDailyOracleLoading(false);
      setIsDailyOracleProcessing(false);
    }
  };

  const handleOracleDeepInsight = useCallback(() => {
    if (!dailyResult) return;
    markOracleModalSeen('heal');
    setShowDailyModal(false);
    void handleSend(buildOracleDeepInsightUserMessage('heal', dailyResult), {
      force: true,
      oracleContext: buildOracleDeepInsightSystemContext(dailyResult, 'heal'),
    });
  }, [dailyResult, handleSend]);

  // SedonaDailyView handles daily release and energy reports directly inline

  const handleSaveProfile = async () => {
    setIsInsightLoading(true);
    setInsightResult(null);

    const userProfileStr = sharedState?.userProfile ? JSON.stringify(sharedState.userProfile) : JSON.stringify(form);
    const recentMemory = sharedState?.healMemory || sharedState?.globalMemory || "최근 기록 없음";
    const dailyContext = dailyResult 
      ? `오늘의 Daily 진단: ${dailyResult.diagnosis} (상징: ${dailyResult.symbol}, 주파수: ${dailyResult.frequency})`
      : "오늘의 Daily 진단 데이터 없음";

    try {
      const data = await invokeLLMStructured({
        messages: [
          { role: 'system', content: `당신은 전인적 치유와 에너지를 꿰뚫어보는 영적 웰니스 코치 AURA 지요입니다. 사용자의 프로필, 질환 이력, 최근 상태 및 오늘의 Daily 진단을 합쳐 에너지 레벨과 소울의 회복 상태를 파악하는 심층 통찰을 제공하세요. [데이터 가이드: 프로필(${userProfileStr}), 최근상태(${recentMemory}), 데일리진단(${dailyContext})]
각 스코어는 0-100 사이 숫자로 반환할 것.` },
          { role: 'user', content: `이름: ${form.name || sharedState?.userProfile?.basic?.name}, 닉네임: ${form.nickname || sharedState?.userProfile?.basic?.nickname}, 생년월일: ${form.birthdate || sharedState?.userProfile?.basic?.birthdate}, 성별: ${form.gender}. 현재 내 신체의 에너지 레벨, 치유의 포인트, 그리고 회복해야 할 장기적 방향성을 분석해줘.` }
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
      await updateSharedState({ userProfile: updatedProfile, lastHealSoulSync: Date.now() }, 'HEAL');
      setPersistentUserProfile(updatedProfile);
      setIsEditingProfile(false);
      if (firebaseUser && localStorage.getItem('developer_bypass') !== 'true') {
        await addDoc(collection(db, 'heal_history', firebaseUser.uid, 'entries'), {
          type: 'SOUL_PROFILE', ...data, createdAt: serverTimestamp(), title: 'Soul Energy Analysis'
        });
      }
    } catch (err) {
      console.error(err);
      setNotice({ open: true, title: "통신 오류", message: "프로필 분석 중 문제가 발생했습니다." });
    } finally {
      setIsInsightLoading(false);
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
              onClick={() => openChannelIntro('heal')}
              title="아우라 신체 웰니스 채널 소개 (클릭)"
            >
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} 
                 className="absolute inset-0 rounded-full border border-dashed border-emerald-400/40 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all" 
               />
               <div className="absolute inset-[3px] rounded-full border border-emerald-400/30 bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center transition-all">
                 <Activity size={20} className="relative z-10 text-emerald-400 drop-shadow-[0_0_12px_currentColor] transition-transform group-hover:scale-110 duration-300 animate-pulse" strokeWidth={1.5} />
               </div>
            </div>
            <div className="cursor-pointer flex flex-col justify-center select-none" onClick={() => navigate('/')}>
               <h1><LucKeyLogoText /></h1>
               <p className="text-[8px] md:text-[9px] text-white/40 uppercase tracking-widest font-bold font-sans leading-none mt-0.5">AURA • WELLNESS COACH</p>
            </div>
         </div>
      </motion.div>

      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -10, x: '-50%', opacity: 0.88 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`prism-xs-subnav fixed top-safe-nav md:top-safe-nav-md left-1/2 z-[100] flex items-center gap-1 p-1 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl max-w-[95vw] overflow-x-auto no-scrollbar md:max-w-fit md:overflow-visible transition-opacity duration-300 ${isSpecialFeatureChromeHidden ? SPECIAL_FEATURE_CHROME_HIDDEN_CLASS : 'opacity-100'}`}
      >
         {[
           { id: 'meditation' as const, icon: Leaf, label: 'Letting Go Method' },
           { id: 'oneMinute' as const, icon: Timer, label: '1-MIN' },
           { id: 'synergy' as const, icon: Sparkles, label: 'SANCTUARY' },
         ].map(item => {
           const isActive = currentSwipeTab === item.id;
           return (
             <button
               key={item.id}
               onClick={() => { 
                 changeTabWithDirection(item.id);
                 setShowHealingMissionModal(false);
                 setIsChatOpen(false);
               }}
               className={`prism-subnav-btn relative flex shrink-0 whitespace-nowrap items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-2xl transition-all duration-300 group cursor-pointer ${isActive ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
             >
               {isActive && (
                 <motion.div
                   layoutId="heal-active-subnav-pill"
                   className="absolute inset-0 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/25 -z-0"
                   transition={{ type: "spring", stiffness: 380, damping: 32 }}
                 />
               )}
               <span className="relative z-10 flex items-center gap-2 md:gap-3">
                 <item.icon size={16} className={isActive ? 'animate-pulse' : ''} />
                 <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all'}`}>
                   {item.label}
                 </span>
               </span>
             </button>
           );
         })}
      </motion.nav>

      <main
        data-app-scroll-root
        {...swipeHandlers}
        className="flex-1 w-full pt-page pb-page md:pt-page-md md:pb-page-md flex flex-col relative z-10 overflow-y-auto no-scrollbar scroll-smooth text-white touch-pan-y"
      >
        <div className="max-w-5xl w-full mx-auto px-3 sm:px-6 prism-xs-pad flex-1 flex flex-col">
          {/* Mobile Swipe Guidance & Tab Dots Indicator */}
          <div className="md:hidden flex items-center justify-between px-2 pt-1 pb-3 select-none">
            <span className="text-[10px] text-white/35 font-medium tracking-wide flex items-center gap-1">
              <span>↔ 좌우 스와이프로 탭 전환</span>
            </span>
            <div className="flex items-center gap-1.5">
              {HEAL_SWIPE_TABS.map((tabId, idx) => {
                const isSelected = currentSwipeTab === tabId;
                return (
                  <button
                    key={tabId}
                    onClick={() => changeTabWithDirection(tabId)}
                    className="p-1 focus:outline-none cursor-pointer"
                    aria-label={`탭 ${idx + 1} 이동`}
                  >
                    <motion.div
                      animate={{
                        width: isSelected ? 18 : 6,
                        backgroundColor: isSelected ? 'rgba(52, 211, 153, 0.95)' : 'rgba(255, 255, 255, 0.2)',
                      }}
                      transition={{ duration: 0.2 }}
                      className="h-1.5 rounded-full"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            {activeMode === 'synergy' ? (
              <motion.div
                key="aura-synergy"
                custom={direction}
                variants={tabSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8 pb-8 sm:pb-12 flex flex-col items-center w-full"
              >
                <AuraSynergySection />
              </motion.div>
            ) : activeMode === 'meditation' ? (
              <motion.div
                key="meditation"
                custom={direction}
                variants={tabSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8 pb-8 sm:pb-12 flex flex-col items-center w-full"
              >
                 <SedonaDailyView
                   firebaseUser={firebaseUser}
                   onDailyComplete={() => updateSharedState({ lastHealDailySync: Date.now() }, 'HEAL')}
                 />
              </motion.div>
            ) : activeMode === 'oneMinute' || activeMode === 'mission' ? (
              <motion.div
                key="one-minute-top"
                custom={direction}
                variants={tabSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8 pb-8 sm:pb-12 w-full"
              >
                <OneMinuteMeditationView isModal={false} />
              </motion.div>
            ) : activeMode === 'simple' ? (
              <motion.div key="simple" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center pt-24 pb-40">
                 <div className="w-full max-w-2xl glass p-5 md:p-12 rounded-[28px] md:rounded-[64px] border border-emerald-500/30 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full scale-110 group-hover:scale-125 transition-transform" />
                    <div className="relative z-10 space-y-6 md:space-y-12 text-white">
                       <div className="flex flex-col items-center gap-6 text-center">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[32px] bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-2xl animate-pulse">
                             <Sparkles size={32} className="md:w-10 md:h-10" />
                          </div>
                          <h3 className="text-2xl md:text-5xl font-sans text-white font-bold tracking-tighter text-center">Flux Consultation</h3>
                          <p className="text-[10px] md:text-sm text-emerald-500/60 uppercase tracking-[0.25em] md:tracking-[0.4em] font-sans font-black text-center">에너지 흐름을 읽는 빠른 진단</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                             '지금 나의 피로를 즉시 완화할 수 있는 짧은 호흡법은?',
                             '오늘 당장 기분을 전환할 수 있는 가장 쉬운 행동은?',
                             '무기력할 때 억지로 짜내지 않고 에너지를 낼 수 있는 팁',
                             '나의 수면 품질을 확인하고 싶어',
                             '몸이 자꾸 긴장되는데, 바로 풀 수 있는 스트레칭 알려줘',
                             '최근 두통이 잦은데, 체크해볼 수 있는 원인은?',
                             '스트레스로 인한 폭식을 막는 1분 리프레시 방법',
                             '아침에 개운하게 일어날 수 있는 루틴 하나 추천해줘',
                             '하루종일 앉아있어서 허리가 아플 때 좋은 스트레칭',
                             '잠자리에 들기 전 마음을 차분하게 하는 명상법'
                           ].map((q) => (
                             <button 
                               key={q} 
                               onClick={() => { handleSend(q); }}
                               className="px-6 py-6 rounded-[28px] bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-sm sm:text-base text-left text-white/80 hover:text-white flex items-start justify-between gap-3 group/btn font-sans font-bold shadow-xl backdrop-blur-md"
                             >
                                <span className="leading-tight">"{q}"</span>
                                <ChevronRight size={20} className="mt-0.5 shrink-0 opacity-0 group-hover/btn:opacity-100 transition-all -translate-x-3 group-hover/btn:translate-x-0 text-emerald-400" />
                             </button>
                           ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
            ) : activeMode === 'soul' ? (
                  <div className="text-center py-24 text-white/40 font-cute">모달 팝업으로 결과를 확인해주세요.</div>
            ) : (activeMode as any) === 'soul_never' ? (
                 <motion.div key="soul" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                    {isEditingProfile ? (
                      <div className="max-w-2xl mx-auto glass p-12 rounded-[60px] border border-emerald-500/20 shadow-2xl space-y-10 text-white mt-12">
                         <div className="flex items-center justify-between">
                           <h3 className="text-2xl font-display text-white">Soul Profile Configuration</h3>
                           <button onClick={() => setIsEditingProfile(false)} className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white"><X size={20}/></button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Name</label>
                             <input className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Nickname</label>
                             <input className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Birth Date</label>
                             <input type="date" className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white invert-calendar" value={form.birthdate} onChange={e => setForm({...form, birthdate: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Birth Time</label>
                              <input type="time" className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white invert-calendar" value={form.birthtime} onChange={e => setForm({...form, birthtime: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">City</label>
                              <input className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white" placeholder="e.g. Seoul" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Gender</label>
                              <div className="flex gap-2 p-1 bg-white/5 rounded-[24px] border border-white/10">
                                {['여성', '남성'].map(g => (
                                  <button key={g} onClick={() => setForm({...form, gender: g})} className={`flex-1 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${form.gender === g ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-white/30 hover:text-white'}`}>{g}</button>
                                ))}
                              </div>
                           </div>
                         </div>
                         <button onClick={handleSaveProfile} disabled={isInsightLoading} className="w-full py-5 rounded-[28px] bg-emerald-600 text-white font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                            {isInsightLoading ? 'Calculating Destiny...' : 'Update Destiny Soul'}
                         </button>
                      </div>
                    ) : insightResult ? (
                      <div className="max-w-4xl mx-auto space-y-10 px-6 mt-10">
                         <div className="w-full glass p-10 rounded-[60px] border border-emerald-500/30 shadow-[0_0_100px_rgba(16,185,129,0.1)] text-white">
                             <div className="flex items-center justify-between mb-10 text-left">
                               <div className="flex items-center gap-3">
                                 <Activity size={22} className="text-emerald-400" />
                                 <span className="text-sm font-bold text-emerald-500 tracking-[0.4em] uppercase">The Healing Decree</span>
                               </div>
                               <div className="flex items-center gap-2">
                                 {/* User button removed */}
                                 {/* Retry button removed */}
                               </div>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                               <StatBar label="Spirit Level" value={insightResult.luckScore} color="#10b981" />
                               <StatBar label="Harmony" value={insightResult.loveScore} color="#f472b6" />
                               <StatBar label="Abundance" value={insightResult.wealthScore} color="#4ade80" />
                               <StatBar label="Vitality" value={insightResult.healthScore} color="#eab308" />
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 font-sans font-medium uppercase tracking-tight">
                               {[
                                  { label: 'Sync Level', v: insightResult.deepSyncLevel || 'OPTIMAL', c: 'text-emerald-400' },
                                  { label: 'Power Item', v: insightResult.luckyItem || 'Crystal', c: 'text-emerald-300' },
                                  { label: 'Focus Color', v: insightResult.luckyColor || 'Yellow', c: 'text-emerald-200' }
                                ].map((i, idx) => (
                                  <div key={idx} className="p-6 bg-white/[0.03] border border-white/5 rounded-[40px] flex flex-col items-center justify-center">
                                    <span className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-sans font-bold">{i.label}</span>
                                    <span className={`text-base text-center ${i.c}`}>{i.v}</span>
                                  </div>
                                ))}
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-left">
                                <div className="space-y-6 md:col-span-1">
                                  <div className="p-6 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20 font-sans text-white/70 leading-relaxed relative overflow-hidden backdrop-blur-md shadow-[0_4px_30px_rgba(16,185,129,0.05)] text-left">
                                     <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                                     <div className="flex items-center gap-2 mb-2">
                                       <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                         <Activity size={14} className="animate-pulse" />
                                       </div>
                                       <div className="flex flex-col">
                                         <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Aura & Bio-Resonance Analysis</span>
                                         <span className="text-[8px] text-white/40 mt-0.5 font-sans leading-none">아우라 에너지 및 생체 주파수 분석</span>
                                       </div>
                                     </div>
                                     <p className="text-[9px] text-white/50 bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-1.5 mb-2 leading-relaxed font-sans font-medium">
                                       ✨ 오늘의 아우라(Aura) 방어막 두께와 생체 주파수의 균형을 진단하여 에너지 회복을 돕는 파동 분석입니다.
                                     </p>
                                     <p className="text-white/80 font-sans leading-relaxed text-xs">{insightResult.cosmicAspect}</p>
                                  </div>
                                  {insightResult.deepSyncLevel && (
                                    <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-3">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Sync Level</span>
                                      <p className="text-white/80 font-sans leading-relaxed text-sm">{insightResult.deepSyncLevel}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                  <div className="flex flex-col text-left pl-2 mb-6">
                                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 leading-none">Soul Guidance Protocol</h4>
                                     <span className="text-[9px] text-white/40 font-sans mt-1.5 leading-none">오늘 하루의 구체적 행동 지침과 따뜻한 심리 멘토링 조언입니다.</span>
                                   </div>
                                  <div className="prose prose-invert prose-emerald max-w-none text-white/70 font-sans">
                                     <Streamdown>{insightResult.guidance}</Streamdown>
                                  </div>
                                </div>
                             </div>
                         </div>
                      </div>
                    ) : (
                      <div className="max-w-2xl mx-auto glass p-16 rounded-[60px] border border-emerald-500/20 flex flex-col items-center justify-center text-center space-y-8 min-h-[400px]">
                         <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 shadow-inner">
                            <Sparkles size={32} />
                         </div>
                         <div className="space-y-4 max-w-sm">
                           <h3 className="text-2xl font-display text-white">Initialize Soul Profile</h3>
                           <p className="text-sm font-sans text-white/40 leading-relaxed">자신의 힐링 운명을 정확히 진단하기 위한 개인의 소울 정보 입력이 필요합니다.</p>
                         </div>
                         <button onClick={() => setIsEditingProfile(true)} className="px-10 py-4 rounded-[28px] bg-white text-emerald-950 font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">Enter Details</button>
                      </div>
                    )}
                 </motion.div>
            ) : activeMode === 'history' ? (
              <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-8 sm:pb-12">

                  <div className="glass p-10 rounded-[60px] border border-emerald-500/20 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                       <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20"><Library size={28} /></div>
                         <div><h3 className="text-2xl font-display text-white">Wellness Records</h3></div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="mb-8">
                         <CalendarView 
                           selectedDate={selectedDate} 
                           onDateSelect={setSelectedDate} 
                           highlightDates={localHistory.map((h: any) => new Date((h.timestamp || h.createdAt || Date.now())))}
                           color={'#10b981'}
                         />
                       </div>
                       
                       {localHistory.length > 0 && Array.from(new Set(localHistory.map((h: any) => h.type || 'RECORD'))).length > 1 && (
                         <div className="flex flex-wrap gap-2 mb-6">
                           <button
                             onClick={() => setCategoryFilter('all')}
                             className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${categoryFilter === 'all' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/20 border border-white/5 hover:text-white/40'}`}
                           >
                             All Categories
                           </button>
                           {Array.from(new Set(localHistory.map((h: any) => h.type || 'RECORD'))).map((cat: any) => (
                             <button
                               key={cat}
                               onClick={() => setCategoryFilter(cat)}
                               className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${categoryFilter === cat ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/20 border border-white/5 hover:text-white/40'}`}
                             >
                               {cat}
                             </button>
                           ))}
                         </div>
                       )}

                       {localHistory.filter((h: any) => (!selectedDate || new Date((h.timestamp || h.createdAt || Date.now())).toDateString() === selectedDate.toDateString()) && (categoryFilter === 'all' || (h.type || 'RECORD') === categoryFilter)).length > 0 ? (
                         localHistory.filter((h: any) => (!selectedDate || new Date((h.timestamp || h.createdAt || Date.now())).toDateString() === selectedDate.toDateString()) && (categoryFilter === 'all' || (h.type || 'RECORD') === categoryFilter)).map((h: any, i: number) => (
                           <div key={h.id || i} className="p-6 rounded-3xl glass border border-white/10 hover:border-emerald-400/40 shadow-2xl hover:bg-white/[0.08] transition-all text-left">
                              <div className="flex justify-between items-center mb-3">
                                 <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{h.type || "RECORD"}</span>
                                 <span className="text-[10px] text-white/20 font-mono ">{new Date(h.timestamp || h.createdAt || Date.now()).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-white/70 font-sans">"{h.content || h.reply || h.text || "코칭 완료"}"</p>
                           </div>
                         ))
                       ) : <p className="text-center text-white/20  py-20">아직 기록된 여정이 없습니다.</p>}
                    </div>
                  </div>
                
              </motion.div>
            ) : activeMode === 'bible' ? (
              <motion.div key="bible" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-8 sm:pb-12 pt-4 sm:pt-6">
                 <div className="space-y-10">
                    <SedonaBible 
                      onConsult={(text) => { handleSend(text); }} 
                    />
                 </div>
              </motion.div>
            ) : (
              <motion.div key="tools" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 items-center justify-center flex">
                 <div className="text-center">
                   <h2 className="text-2xl font-display text-emerald-300 tracking-wider mb-2">Preparing AURA</h2>
                   <p className="text-white/30 text-sm">{activeMode} 모듈 업데이트가 곧 완료됩니다.</p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>







        

      <DailyOracleLoadingOverlay isLoading={isDailyOracleLoading} theme="emerald" />
      <NoticeModal isOpen={notice.open} title={notice.title} message={notice.message} onClose={() => setNotice({ ...notice, open: false })} />



      <AnimatePresence>
        {showSoulModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/95 sm:bg-black/80 backdrop-blur-md"
            onClick={() => setShowSoulModal(false)}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] bg-[#0c120c] border border-emerald-500/30 p-5 sm:p-8 md:p-12 text-left flex flex-col gap-6 overflow-y-auto rounded-[28px] sm:rounded-[48px] shadow-2xl relative z-10 font-sans"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
              
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <User size={22} className="text-emerald-400" />
                  <span className="text-sm font-mono tracking-widest text-emerald-400 font-bold uppercase">
                    Bio-Spectrum (소울 영혼 성분 분석)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditingProfile && insightResult && (
                    <TTSButton text={insightResult.guidance} voice="Kore" className="text-emerald-400 border-emerald-500/20" />
                  )}
                  <button onClick={() => setShowSoulModal(false)} className="p-2 hover:bg-white/5 rounded-full text-white/30 hover:text-white transition-all shrink-0">
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 space-y-6">
                {isEditingProfile ? (
                  <div className="max-w-2xl mx-auto bg-white/[0.02] border border-white/5 p-8 rounded-[40px] space-y-8 text-white">
                     <h3 className="text-xl font-display text-white">Soul Profile Configuration</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Name</label>
                         <input className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Nickname</label>
                         <input className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Birth Date</label>
                         <input type="date" className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white invert-calendar" value={form.birthdate} onChange={e => setForm({...form, birthdate: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Birth Time</label>
                          <input type="time" className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white invert-calendar" value={form.birthtime} onChange={e => setForm({...form, birthtime: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">City</label>
                          <input className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white" placeholder="e.g. Seoul" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-3 block">Gender</label>
                          <div className="flex gap-2 p-1 bg-white/5 rounded-[24px] border border-white/10">
                            {['여성', '남성'].map(g => (
                              <button key={g} onClick={() => setForm({...form, gender: g})} className={`flex-1 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${form.gender === g ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-white/30 hover:text-white'}`}>{g}</button>
                            ))}
                          </div>
                       </div>
                     </div>
                     <button onClick={() => { handleSaveProfile(); setIsEditingProfile(false); }} disabled={isInsightLoading} className="w-full py-5 rounded-[28px] bg-emerald-600 text-white font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                        {isInsightLoading ? 'Calculating Destiny...' : 'Update Destiny Soul'}
                     </button>
                  </div>
                ) : insightResult ? (
                  <div className="space-y-10 px-2 text-white">
                      <div className="w-full bg-white/[0.01] border border-emerald-500/20 p-8 rounded-[40px] shadow-[0_0_50px_rgba(16,185,129,0.05)] text-left">
                          <div className="flex items-center gap-3 mb-8">
                            <Activity size={22} className="text-emerald-400" />
                            <span className="text-sm font-bold text-emerald-500 tracking-[0.4em] uppercase">The Healing Decree</span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <StatBar label="Spirit Level" value={insightResult.luckScore} color="#10b981" />
                            <StatBar label="Harmony" value={insightResult.loveScore} color="#f472b6" />
                            <StatBar label="Abundance" value={insightResult.wealthScore} color="#4ade80" />
                            <StatBar label="Vitality" value={insightResult.healthScore} color="#eab308" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 font-sans font-medium uppercase tracking-tight">
                            {[
                               { label: 'Sync Level', v: insightResult.deepSyncLevel || 'OPTIMAL', c: 'text-emerald-400' },
                               { label: 'Power Item', v: insightResult.luckyItem || 'Crystal', c: 'text-emerald-300' },
                               { label: 'Focus Color', v: insightResult.luckyColor || 'Yellow', c: 'text-emerald-200' }
                             ].map((i, idx) => (
                               <div key={idx} className="p-6 bg-white/[0.03] border border-white/5 rounded-[30px] flex flex-col items-center justify-center text-center">
                                 <span className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-sans font-bold">{i.label}</span>
                                 <span className={`text-base ${i.c}`}>{i.v}</span>
                               </div>
                             ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start text-left">
                             <div className="space-y-6 md:col-span-1">
                               <div className="p-6 rounded-[24px] bg-emerald-500/5 border border-emerald-500/20 font-sans text-white/70 leading-relaxed relative overflow-hidden backdrop-blur-md shadow-[0_4px_30px_rgba(16,185,129,0.05)] text-left">
                                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                      <Activity size={14} className="animate-pulse" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Aura & Bio-Resonance Analysis</span>
                                      <span className="text-[8px] text-white/40 mt-0.5 font-sans leading-none">아우라 에너지 및 생체 주파수 분석</span>
                                    </div>
                                  </div>
                                  <p className="text-[9px] text-white/50 bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-1.5 mb-2 leading-relaxed font-sans font-medium">
                                    ✨ 오늘의 아우라(Aura) 방어막 두께와 생체 주파수의 균형을 진단하여 에너지 회복을 돕는 파동 분석입니다.
                                  </p>
                                  <p className="text-white/80 font-sans leading-relaxed text-xs">{insightResult.cosmicAspect}</p>
                                </div>
                               {insightResult.deepSyncLevel && (
                                 <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 space-y-3">
                                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Sync Level</span>
                                   <p className="text-white/80 font-sans leading-relaxed text-sm">{insightResult.deepSyncLevel}</p>
                                 </div>
                               )}
                               <button onClick={() => setIsEditingProfile(true)} className="w-full py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all">Profile Edit</button>
                             </div>
                             <div className="md:col-span-2 space-y-4">
                               <div className="flex flex-col text-left pl-2 mb-6">
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 leading-none">Soul Guidance Protocol</h4>
                                  <span className="text-[9px] text-white/40 font-sans mt-1.5 leading-none">오늘 하루의 구체적 행동 지침과 따뜻한 심리 멘토링 조언입니다.</span>
                               </div>
                               <div className="prose prose-invert prose-emerald max-w-none text-white/70 font-sans text-sm leading-relaxed">
                                  <Streamdown>{insightResult.guidance}</Streamdown>
                               </div>
                             </div>
                          </div>
                      </div>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto bg-white/[0.02] border border-white/5 p-16 rounded-[40px] flex flex-col items-center justify-center text-center space-y-8 min-h-[400px]">
                     <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 shadow-inner">
                        <Sparkles size={32} />
                     </div>
                     <div className="space-y-4 max-w-sm">
                       <h3 className="text-2xl font-display text-white">Initialize Soul Profile</h3>
                       <p className="text-sm font-sans text-white/40 leading-relaxed">자신의 힐링 운명을 정확히 진단하기 위한 개인의 소울 정보 입력이 필요합니다.</p>
                     </div>
                     <button onClick={() => setIsEditingProfile(true)} className="px-10 py-4 rounded-[28px] bg-white text-emerald-950 font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">Enter Details</button>
                  </div>
                )}
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-end shrink-0 relative z-20">
                <button onClick={() => setShowSoulModal(false)} className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg">
                  확인
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      <AnimatePresence>
        {limitModalInfo && limitModalInfo.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLimitModalInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 70, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 70, opacity: 0 }}
              transition={{ type: "spring", stiffness: 75, damping: 18 }}
              className="glass p-8 max-w-md w-full rounded-[40px] border border-emerald-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/4 animate-pulse" />
              <button
                onClick={() => setLimitModalInfo(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X size={18} />
              </button>
              
              <div className="mx-auto w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Lock className="text-emerald-400 animate-pulse" size={28} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-sans text-white">Daily Connection Locked</h3>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">{limitModalInfo.type === 'daily' ? '오늘의 데일리 오라클 완료' : '오늘의 소울 분석 완료'}</p>
              </div>

              <p className="text-sm text-white/60 leading-relaxed font-sans break-keep">
                이 댑의 {limitModalInfo.type === 'daily' ? '데일리 비전' : '소울 분석'} 기능은 하루에 한 번만 실행할 수 있습니다. 이미 오늘의 주파수가 우주와 동조되었습니다. 에필로그에서 이전의 찬란했던 동조 기록들을 살펴보세요.
              </p>

              <button
                onClick={() => {
                  setLimitModalInfo(null);
                  navigate('/epilogue');
                }}
                className="w-full py-4 rounded-[20px] bg-emerald-500/20 text-emerald-400 font-black uppercase tracking-[0.2em] border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:bg-emerald-500/30 active:scale-95 transition-all text-xs"
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

