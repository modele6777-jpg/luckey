import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { isLucyTarotDrawRequest, isLucyTarotDrawOpen } from '@/lib/lucyTarotIntegrity';
import { LucyModeTransition } from '@/components/chat/LucyModeTransition';
import { useSyncedChatDraft } from '@/hooks/useSyncedChatDraft';
import { queueChatForward, takeChatForward, forwardedChatPrompt } from '@/lib/lucyChatForward';
import { ChatBubbleForward } from '@/components/chat/ChatBubbleForward';
import { LUCY_PRO_PATH, resolveLucyPageChannels } from '@/lib/lucyChatPageMode';
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Search, X, Check, Volume2, VolumeX, Square,
  Download, User, Plus, Sparkles, Sun, TreeDeciduous, Activity, Bird, Music, Zap, Flame, Compass,
  Loader2, Copy, RefreshCw, Camera, BookOpen, BookMarked, Mic, MicOff, MessageSquare, ChevronDown
} from 'lucide-react';
import { useApp, PersonaType, getPersistentUserProfile, setPersistentUserProfile } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { saveProfileToAllVaults } from '@/lib/profileVault';
import { useLocation } from 'wouter';
import { playTTS, playTTSInChunks, playQAndATTS, stopTTS, useTTSActive, subscribeTTS, prefetchTTS, prefetchTTSChunks, normalizeTextForSpeech } from '@/utils/tts';
import { unlockAudioPlayback, primeTTSAudioElement } from '@/lib/audio';
import { playAudioHaptic } from '@/lib/audioHaptics';
import { calculateDetailedSaju } from '@/lib/sajuAnalysis';
import { getLocalDateKey } from '@/lib/rebibleStorage';
import ReactMarkdown from 'react-markdown';
import { LucyProTypewriter } from '@/components/LucyProTypewriter';
import { ChatInsightsBoardModal } from '@/components/ChatInsightsBoardModal';
import { LucyAuraLoader } from '@/components/LucyAuraLoader';
import remarkGfm from 'remark-gfm';
import { safeSessionStorage, safeLocalStorage } from '@/utils/safeStorage';
import { cleanAssistantMessageDisplay, cleanUserMessageDisplay } from '@/utils/cleanMessage';
import { detectLucyChannelsFromText, formatChannelsModeTitle } from '@/lib/lucyAutoModeDetector';
import { selectOptimalDivinationTools, THEME_PRIMARY_DIVINATION_TOOLS, type SelectedDivinationToolsResult } from '@/lib/fifteenDivinationTools';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { LucyResponseRecommendation } from '@/components/LucyResponseRecommendation';
import { PromptLibraryModal } from '@/components/chat/PromptLibraryModal';
import { DynamicGhostInputPlaceholder } from '@/components/chat/DynamicGhostInputPlaceholder';
import { ChatProfileDock } from '@/components/chat/ChatProfileDock';
import { useSmartScroll } from '@/hooks/useSmartScroll';
import { SmartScrollResumeButton } from '@/components/common/SmartScrollResumeButton';
import { ChatProfileModal } from '@/components/chat/ChatProfileModal';
import { type ChatTargetProfile } from '@/types/chatProfile';
import type { UserProfile } from '@/lib/sharedState';
import { buildMultiProfileSystemContext, generateMultiProfilePrompts } from '@/lib/multiProfileContext';
import { HORI_PROMPT_LIBRARY } from '@/data/horiPromptLibrary';
import { type LucyChatMode, LUCY_MODE_CONFIGS } from '@/components/chat/LucyModeSelectorBar';
import {
  hasEnteredLucyChatToday,
  markLucyChatEnteredToday,
  markFirstLucyVisitCompletedToday,
  hasSpokenDailyGreetingToday,
  markDailyGreetingSpokenToday,
  createDefaultGreeting,
  isGreetingMessage,
  saveUnifiedMessagesSafely,
  loadSavedUnifiedMessages,
  mergeUnifiedMessages,
} from '@/lib/chatHistorySync';
import { processDailyChatArchival } from '@/lib/chatMemoryArchive';
import { drawLucyTarotCards, formatTarotMarker } from '@/utils/tarotDetector';
import { isDualPaneLayout } from '@/lib/perfMode';
import { DuoCosmicAmbientRoom } from '@/components/duo/DuoCosmicAmbientRoom';
import { buildLucyTarotReadingPrompt } from '@/lib/lucyTarotReading';
import { getTodayDateKey } from '@/lib/dailyCache';
import { joinKakaoBubblesForTTS } from '@/lib/lucyChatUtils';
import { LucyKakaoBubbleGroup } from '@/components/chat/LucyKakaoBubbleGroup';
import { LucyCosmicBackground } from '@/components/chat/LucyCosmicBackground';
import { ALL_DCE_ENGINES } from '@/lib/divination/deterministicEngine';
import '@/styles/lucy-starlight.css';

function CalculationAuditToolList({ tools }: { tools: string[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const threshold = 3;
  const isLong = tools.length > threshold;
  const displayedTools = isLong && !isExpanded ? tools.slice(0, threshold) : tools;

  return (
    <span data-used-calculation-tools="true" className="inline-flex max-w-full flex-wrap items-center gap-1 text-[10px] text-amber-700 dark:text-amber-200">
      <button
        type="button"
        onClick={() => isLong && setIsExpanded(prev => !prev)}
        className={`shrink-0 rounded-full border border-amber-400/40 px-2 py-0.5 font-medium transition-colors ${
          isLong ? 'cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-950/50 flex items-center gap-0.5 font-semibold' : 'cursor-default'
        }`}
        title={isLong ? (isExpanded ? '도구 목록 접기' : '도구 전체 목록 펼치기') : undefined}
      >
        <span>사용 도구 {tools.length}개</span>
        {isLong && (
          <ChevronDown size={10} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        )}
      </button>
      {displayedTools.map(name => (
        <span key={name} className="shrink-0 rounded-full border border-amber-400/30 px-2 py-0.5">
          {name}
        </span>
      ))}
      {isLong && !isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="shrink-0 rounded-full border border-dashed border-amber-400/50 px-1.5 py-0.5 text-[9px] text-amber-600 dark:text-amber-300 hover:bg-amber-100/40 cursor-pointer font-medium"
          title="전체 도구 목록 펼치기"
        >
          +{tools.length - threshold}개 더보기
        </button>
      )}
      {isLong && isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="shrink-0 rounded-full border border-dashed border-amber-400/50 px-1.5 py-0.5 text-[9px] text-amber-600 dark:text-amber-300 hover:bg-amber-100/40 cursor-pointer font-medium"
          title="도구 목록 접기"
        >
          접기
        </button>
      )}
    </span>
  );
}

// Helper: Compress uploaded images to prevent UI stutter and huge payload overhead
function compressImageIfNeeded(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const src = loadEvt.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// 🌟 7대 셉타그램 채널 (프롤로그 -> 오렌지 -> 트리니티 -> 아우라 -> 블루버드 -> 뮤즈 -> 에필로그)
export type SpecialChannel = 'prologue' | 'orange' | 'trinity' | 'aura' | 'bluebird' | 'muse' | 'epilogue';
const ALL_CHANNELS: SpecialChannel[] = ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'];

interface ChannelConfig {
  id: SpecialChannel;
  name: string;
  shortName: string;
  tagline: string;
  icon: any;
  persona: PersonaType;
  badgeColor: string;
  activeColor: string;
  dotColor: string;
  onBadgeColor: string;
  prompts: string[];
}

// 🌟 Rich Prompt Pools for Dynamic Random Sampling (모두 자연스럽게 완성된 문장형으로 구성)
const CHANNEL_PROMPT_POOLS: Record<SpecialChannel, string[]> = {
  prologue: [
    '태을신수와 토정비결로 올해 새롭게 펼쳐질 나의 운명적 기회와 서막을 알려줘.',
    '새로운 시작을 앞두고 내 삶의 중심축을 바로잡는 나침반 질문은 무엇일까?',
    '태을신수의 거시적 흐름으로 볼 때 지금 내 인생 주기에서 어떤 서막이 열리고 있을까?',
    '토정비결로 이번 달 나에게 찾아올 반가운 소식과 생활 속 길흉 지침을 짚어줘.',
    '낯선 도전을 시작할 때 두려움을 용기와 설렘으로 바꾸려면 어떻게 해야 할까?',
    '내 안의 가장 순수한 열망과 비전을 명확한 첫걸음으로 구체화해 줘.'
  ],
  orange: [
    '홍국기문(기문둔갑)으로 지금 막힌 상황을 뚫을 최적의 돌파구와 타이밍을 알려줘.',
    '육임의 초전·중전·말전 흐름으로 내가 준비 중인 일의 진행 과정과 결과를 짚어줘.',
    '구성학의 구궁 에너지로 볼 때 올해 나에게 유리한 이동 방향과 공간 개운법은 무엇일까?',
    '기적수업의 관점으로 지금 내가 겪는 인간관계 갈등을 지혜롭게 풀어줘.',
    '내가 직면한 문제를 1원칙(First Principles)과 기문 전략으로 분해해서 명확히 분석해 줘.',
    '중요한 결정을 앞두고 반드시 고려해야 할 숨겨진 변수와 리스크는 무엇일까?',
    '장기적 성장을 위한 나만의 고유한 전략적 로드맵을 설계해 줘.',
    '직관과 논리가 충돌할 때 최선의 결정을 내리는 사고 프레임워크를 알려줘.',
    '현재 상황에서 가장 큰 레버리지 효과를 낼 수 있는 핵심 행동 한 가지는 무엇일까?',
    '내 생각의 확증 편향과 맹점을 점검하고 반대 논리를 냉철하게 검토해 줘.',
    '시간과 에너지의 병목 현상을 해결하는 시스템적 접근법을 알려줘.',
    '불확실성이 높을 때 위험을 최소화하면서 기회를 포착하는 의사결정법은 무엇일까?'
  ],
  trinity: [
    '사주와 자미두수, 점성술을 융합해서 올해 나의 재물운과 커리어 전환점을 분석해 줘.',
    '자미두수 명반의 부처궁과 재백궁 관점에서 내 연애운과 재물 그릇을 쉽게 풀어줘.',
    '나의 사주 본원과 서양 점성술 차트가 말해주는 내 진짜 매력과 강점은 무엇일까?',
    '오늘 나의 소울 주파수를 높여주는 타로와 별자리 메시지를 들려줘.',
    '현재 나의 운의 계절에서 지금은 씨앗을 뿌릴 때일까, 아니면 수확할 때일까?',
    '나의 천을귀인 기운을 일상에서 활성화할 수 있는 실천 팁을 알려줘.',
    '타고난 사주 오행 중 부족한 기운을 일상에서 채우는 개운법을 알려줘.',
    '앞으로 마주할 운의 터닝포인트와 주의해야 할 에너지 흐름을 짚어줘.',
    '내 사주원국의 십신 강점을 극대화하여 재물운을 높이는 방법을 알려줘.',
    '내 직관과 무의식이 가리키는 다음 단계의 영적 방향성은 무엇일까?',
    '내 사주 대운의 흐름에 맞는 올해의 커리어 및 재물 타이밍은 언제일까?',
    '최근 겪는 반복적인 우연과 동시성(Synchronicity)에는 어떤 의미가 있을까?'
  ],
  bluebird: [
    '숙요(27숙)로 나와 내가 신경 쓰이는 사람의 인연 결이 왜 이런지 다정하게 풀어줘.',
    '베딕 점성술 관점에서 내가 반복해서 겪는 마음의 아픔을 치유하는 지혜를 들려줘.',
    '누군가에 대한 억울함과 상처를 참된 용서로 치유하려면 어떻게 해야 할까?',
    '루시야, 오늘 마음이 조금 지치고 버거운데 따뜻하게 위로해 줘.',
    '남들과 비교하며 작아지는 내 마음을 편안하게 달래줄래?',
    '불안과 걱정이 올라올 때 내 마음을 지켜주는 세도나 4문답을 함께 해줘.',
    '오늘 하루 수고한 나 자신에게 건네는 포근한 손편지를 써줘.',
    '내 안의 상처받은 내면아이에게 다정한 포옹과 위로의 말을 건네줘.',
    '스스로를 자책하고 비난하는 마음을 멈추는 자기자비 연습법을 알려줘.',
    '과거의 상처로부터 안전하게 나를 지키는 따뜻한 조언을 들려줘.',
    '가슴속 응어리진 감정을 편안하게 흘려보내는 안전한 위로를 들려줘.',
    '오늘 내 마음을 밝게 채워줄 긍정 확언 문장을 만들어 줘.'
  ],
  aura: [
    '마하보테와 태국점성술로 내 출생 요일 기운에 맞는 오늘의 활력 컬러와 루틴을 알려줘.',
    '태국점성술(호라삿) 관점에서 요즘 지친 내 몸 컨디션을 회복하는 일상 개운법을 추천해 줘.',
    '지금 바로 몸의 긴장을 풀고 피로를 날리는 3분 호흡법을 알려줘.',
    '오늘 나의 신체 에너지와 바이오리듬을 끌어올리는 루틴을 추천해 줘.',
    '깊은 숙면을 취하고 아침을 상쾌하게 깨우는 나이트 케어 가이드를 알려줘.',
    '무기력할 때 뇌를 깨우는 간단한 스트레칭과 수분 섭취 루틴은 무엇일까?',
    '머리에 몰린 열과 복잡한 생각을 발끝으로 내리는 1분 그라운딩 기법을 알려줘.',
    '신경계를 안정시키고 미주신경을 활성화하는 4-7-8 이완 호흡법을 가이드해 줘.',
    '에너지가 방전되었을 때 10분 만에 안전하게 재충전하는 방법을 알려줘.',
    '잠들기 전 5분 동안 온몸의 긴장을 부드럽게 푸는 바디스캔 가이드를 해줘.'
  ],
  muse: [
    '카발라 생명나무와 타로 원형 상징으로 지금 막힌 내 창작 아이디어의 물꼬를 터줘!',
    '카발라의 세피로트 경로처럼 내 머릿속 영감을 현실의 멋진 결과물로 구현하는 법을 알려줘.',
    '서로 대립하는 두 가지 생각을 창의적으로 하나로 융합하는 방법을 알려줘.',
    '새로운 아이디어가 필요한데 내 고정관념을 깨우는 신선한 질문을 던져줘!',
    '지금 내 감정을 은유적으로 담아낸 아름다운 시 한 편을 지어줘.',
    '사람들의 마음을 사로잡는 감각적인 문장과 스토리텔링 아이디어를 추천해 줘.',
    '창작의 벽에 부딪혔을 때 영감의 물꼬를 트는 발상법은 무엇일까?',
    '오늘의 소소한 일상을 특별한 예술적 시선으로 바라보는 관점을 들려줘.',
    '내 프로젝트에 생명력을 불어넣는 참신한 카피라이팅 아이디어를 제안해 줘.',
    '창작 슬럼프를 기분 좋은 휴식과 새로운 도약의 계기로 바꾸는 법을 알려줘.'
  ],
  epilogue: [
    '주역 64괘의 지혜로 오늘 하루 나에게 있었던 일의 의미와 내일의 방향을 갈무리해 줘.',
    '주역과 베딕의 성찰로 지금 내가 나아갈 때인지 잠시 숨을 고를 때인지 짚어줘.',
    '오늘 하루 있었던 일들을 차분히 정리하고 마음을 비워내는 회고 질문을 던져줘.',
    '마음에 남은 응어리와 미련을 있는 그대로 흘려보내는 세도나 4문답을 해줘.',
    '오늘 밤 편안한 쉼과 숙면으로 인도하는 밤의 서재 방하착 가이드를 들려줘.',
    '하루 동안 수고한 나 자신에게 따뜻한 자기자비와 감사의 인사를 건네줘.',
    '오늘 겪은 크고 작은 경험 속에서 내가 얻은 가장 소중한 깨달음은 무엇일까?'
  ]
};

// 👑 7대 채널 풀가동 PRO 마스터 Pool (DCE 운명학 도구 총동원 비교 분석)
const MASTER_PROMPT_POOL = [
  `${ALL_DCE_ENGINES.length}가지 운명학·결정론 엔진을 총동원해서 올해 나의 운세와 핵심 전환점을 7대 테마별로 비교 분석해 줘.`,
  `지금 내가 고민 중인 중요한 선택을 ${ALL_DCE_ENGINES.length}개 엔진 관점으로 비교 분석하고 공통 결론을 내려줘.`,
  `사주·점성술·자미두수·홍국기문·주역 등 ${ALL_DCE_ENGINES.length}대 엔진을 총동원해 내 재물운과 커리어 돌파구를 비교해 줘.`,
  `알아차림과 통찰, 그리고 ${ALL_DCE_ENGINES.length}대 운명학 지혜를 총동원해 지금 내 고민을 입체적으로 비교 분석해 줘.`,
  `내면의 본질과 잠재된 가능성을 7대 테마 ${ALL_DCE_ENGINES.length}개 엔진으로 비교 진단해 줘.`,
  `나의 사주·심리·신체 에너지와 인생 전략을 ${ALL_DCE_ENGINES.length}개 엔진으로 총망라해서 통합 비교해 줘.`,
  `현재 직면한 중대한 전환점을 7대 테마와 ${ALL_DCE_ENGINES.length}대 운명학 관점에서 입체적으로 비교 분석해 줘.`,
  `내 영혼의 최고 잠재력을 끌어올리기 위한 ${ALL_DCE_ENGINES.length}대 도구 비교 분석 마스터 로드맵을 설계해 줘.`,
  `내 운명의 타이밍에 맞춘 비즈니스 & 라이프 마스터플랜을 ${ALL_DCE_ENGINES.length}개 엔진 비교로 설계해 줘.`,
  `우주적 동시성과 1원칙 논리가 만나는 최고의 의사결정 해답을 ${ALL_DCE_ENGINES.length}개 엔진 비교 분석으로 제시해 줘.`
];

// 💬 일상 대화 & 힐링 & 인생 조언을 위한 풍부한 캐주얼 추천 질문 풀 (동적 순환)
const CASUAL_PROMPT_POOL = [
  '루시야, 오늘 하루를 어떻게 보내면 기분이 한결 좋아질까?',
  '요즘 생각이 너무 많은데 머릿속을 정리할 수 있는 좋은 질문을 던져줘.',
  '오늘 나에게 어울리는 행운의 컬러와 마음가짐은 무엇인지 알려줘.',
  '지금 이 순간 내 마음에 가장 필요한 따뜻한 위로는 무엇일까?',
  '오늘 하루를 특별하게 만들어줄 작은 실천 팁 하나만 알려줘.',
  '지친 나를 위해 따뜻한 차 한 잔 마시듯 마음을 포근하게 녹여줘.',
  '답답했던 마음을 시원하게 환기할 수 있는 긍정적인 생각법을 알려줘.',
  '오늘 밤 편안하게 푹 쉴 수 있는 다정한 힐링 한마디 부탁해.',
  '내 안의 불안을 가라앉히고 평온함을 되찾는 짧은 대화를 나누자.',
  '루시, 오늘 나 자신을 더 사랑할 수 있는 칭찬 한마디 해줄래?',
  '새로운 시작을 앞두고 용기를 북돋워 주는 따뜻한 조언을 듣고 싶어.',
  '지금 내 마음의 날씨를 알아차리고 다독여주는 시간을 가져보자.',
  '오늘 하루 소소하지만 확실한 행복을 찾는 비결은 무엇일까?',
  '루시의 눈으로 본 나의 가장 빛나는 장점은 무엇인지 말해줘.',
  '스트레스를 비우고 좋은 에너지를 채우는 오늘의 확언 한 줄을 들려줘!',
  '마음이 복잡할 때 호흡을 차분히 가다듬는 1분 이완법을 알려줘.',
  '인간관계에서 마음의 경계를 건강하게 지키는 방법은 무엇일까?',
  '오늘 나에게 일어날 수 있는 기분 좋은 우연과 행운은 무엇일지 알려줘.',
  '스스로에게 너무 엄격해질 때 나를 다정하게 안아주는 법을 알려줘.',
  '오늘 하루를 감사함으로 마무리하는 저녁 루틴을 추천해 줘.',
  '무기력할 때 작은 활력을 불어넣는 3분 기분 전환 팁을 알려줘.',
  '내 마음속 숨은 열정과 호기심을 깨우는 영감 질문을 던져줘.'
];

// 호리 프롬프트의 짧은 명사형 제목을 자연스럽게 완성된 문장형 질문으로 변환하는 헬퍼
function toCompleteSentencePrompt(title: string, body?: string): string {
  const t = (title || '').trim();
  if (!t) return '';
  // 이미 완성된 문장 종결어미로 끝나는 경우 그대로 사용하되 물음표/마침표 보정
  if (/[.!?]$/.test(t)) return t;
  if (/(할까|일까|볼까|줄래|할래|있을까|없을까|언제|누구|뭐야|어때|어떨까|무엇일까|어디일까)$/.test(t)) {
    return `${t}?`;
  }
  if (/(해줘|해 줘|알려줘|알려 줘|짚어줘|짚어 줘|봐줘|봐 줘|들려줘|들려 줘|써줘|써 줘|지어줘|부탁해|나누자|가져보자|싶어)$/.test(t)) {
    return `${t}.`;
  }
  // 본문(body)의 첫 문장이 적절한 길이(65자 이하)의 완성형 문장이라면 활용
  if (body) {
    const firstSentence = body.split(/(?<=[.!?])\s+/)[0]?.trim();
    if (firstSentence && firstSentence.length >= 14 && firstSentence.length <= 62) {
      return firstSentence;
    }
  }
  // 명사구 형태로 끝나는 제목을 자연스러운 완성형 질문 문장으로 변환
  if (/(방법|비결|가이드|루틴|팁|전략|처방|연습|기법|법)$/.test(t)) {
    return `${t}을 자세히 알려줘.`;
  }
  if (/(분석|진단|점검|설계|해석|풀이)$/.test(t)) {
    return `${t}을 해줘.`;
  }
  if (/(시기|타이밍|언제)$/.test(t)) {
    return `${t}는 언제쯤 찾아올까?`;
  }
  if (/(운세|흐름|전환점|가능성|점수|궁합|속마음|재능|분야|스타일|특징|의미|이유)$/.test(t)) {
    return `${t}은 어떤지 자세히 알려줘.`;
  }
  return `${t}에 대해 자세히 분석해서 알려줘.`;
}

const SPECIAL_CHANNELS: Record<SpecialChannel, ChannelConfig> = {
  // 0. 빨 (빨강) - 프롤로그
  prologue: {
    id: 'prologue',
    name: '프롤로그',
    shortName: '프롤로그',
    tagline: '태을신수·토정비결 기반 새로운 서막 & 비전 설계',
    icon: Compass,
    persona: 'lucy',
    badgeColor: 'bg-red-500 text-white',
    activeColor: 'border-red-500 bg-red-50 text-red-950 ring-2 ring-red-400/50',
    dotColor: 'bg-red-500',
    onBadgeColor: 'bg-red-200/90 text-red-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.prologue
  },
  // 1. 주 (주황) - 오렌지 
  orange: {
    id: 'orange',
    name: '오렌지',
    shortName: '오렌지',
    tagline: '홍국기문·육임·구성학 & 1원칙 전략적 결단',
    icon: TreeDeciduous,
    persona: 'orange',
    badgeColor: 'bg-orange-500 text-white',
    activeColor: 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-400/50',
    dotColor: 'bg-orange-500',
    onBadgeColor: 'bg-orange-200/90 text-orange-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.orange
  },
  // 2. 노 (노랑) - 트리니티 
  trinity: {
    id: 'trinity',
    name: '트리니티',
    shortName: '트리니티',
    tagline: '사주·점성술·자미두수·타로 입체 운명 통찰',
    icon: Sparkles,
    persona: 'trinity',
    badgeColor: 'bg-amber-400 text-amber-950 font-bold',
    activeColor: 'border-amber-400 bg-amber-50 text-amber-950 ring-2 ring-amber-300/50',
    dotColor: 'bg-amber-500',
    onBadgeColor: 'bg-amber-200/90 text-amber-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.trinity
  },
  // 3. 초 (초록) - 아우라 
  aura: {
    id: 'aura',
    name: '아우라',
    shortName: '아우라',
    tagline: '마하보테·태국점성술 생체 리듬 & 신체 웰니스',
    icon: Activity,
    persona: 'aura',
    badgeColor: 'bg-emerald-500 text-white',
    activeColor: 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/50',
    dotColor: 'bg-emerald-500',
    onBadgeColor: 'bg-emerald-200/90 text-emerald-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.aura
  },
  // 4. 파 (파랑) - 블루버드 
  bluebird: {
    id: 'bluebird',
    name: '블루버드',
    shortName: '블루버드',
    tagline: '숙요(27숙)·베딕 인연 치유 & 따뜻한 마음 위로',
    icon: Bird,
    persona: 'bluebird',
    badgeColor: 'bg-blue-500 text-white',
    activeColor: 'border-blue-500 bg-blue-50 text-blue-950 ring-2 ring-blue-400/50',
    dotColor: 'bg-blue-500',
    onBadgeColor: 'bg-blue-200/90 text-blue-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.bluebird
  },
  // 5. 남 (남색) - 뮤즈 
  muse: {
    id: 'muse',
    name: '뮤즈',
    shortName: '뮤즈',
    tagline: '카발라 생명나무·타로 상징 & 창작 영감 발현',
    icon: Music,
    persona: 'muse',
    badgeColor: 'bg-indigo-600 text-white',
    activeColor: 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-400/50',
    dotColor: 'bg-indigo-600',
    onBadgeColor: 'bg-indigo-200/90 text-indigo-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.muse
  },
  // 6. 보 (보라/분홍) - 에필로그
  epilogue: {
    id: 'epilogue',
    name: '에필로그',
    shortName: '에필로그',
    tagline: '주역 64괘·베딕 성찰 기반 하루 마감 & 회고',
    icon: BookOpen,
    persona: 'lucy',
    badgeColor: 'bg-pink-500 text-white',
    activeColor: 'border-pink-500 bg-pink-50 text-pink-950 ring-2 ring-pink-400/50',
    dotColor: 'bg-pink-500',
    onBadgeColor: 'bg-pink-200/90 text-pink-950 font-bold',
    prompts: CHANNEL_PROMPT_POOLS.epilogue
  }
};

function parsePendingChannels(pending: string | null): SpecialChannel[] {
  if (!pending) return [];
  if (pending === 'casual' || pending === 'lucy') {
    return []; // 💬 Casual Chat (수다 모드)
  }
  if (pending === 'master' || pending === 'all') {
    return ALL_CHANNELS; // 👑 7대 채널 올인원 PRO 마스터 모드
  }
  const aliasMap: Record<string, SpecialChannel> = {
    prologue: 'prologue',
    deepthink: 'orange',
    orange: 'orange',
    oracle: 'trinity',
    trinity: 'trinity',
    vitality: 'aura',
    aura: 'aura',
    healing: 'bluebird',
    bluebird: 'bluebird',
    creative: 'muse',
    muse: 'muse',
    epilogue: 'epilogue',
  };
  const resolved = (aliasMap[pending] || pending) as SpecialChannel;
  if (ALL_CHANNELS.includes(resolved)) {
    return [resolved];
  }
  return [];
}

// Helper: Fisher-Yates array shuffling
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 말풍선 메시지의 고유 모드 및 채널들을 정확하게 분석/추출하는 헬퍼 함수
 * - 각 메시지가 실제로 작성/사용되었던 모드(수다 모드, 단일 채널, 융합 시너지, 올인원 마스터)를 온전히 보존
 * - 현재 화면이 일반 루시인지 루시 플러스인지에 관계없이 과거 대화가 임의로 덧씌워지지 않고 원래 모드로 표기됩니다.
 */
export function resolveMessageModeAndChannels(
  msg: any,
  filteredMessages?: any[],
  index?: number,
  _allowMaster?: boolean
): {
  mode: string;
  channels: SpecialChannel[];
  isMaster: boolean;
  isCasual: boolean;
  badgeLabel: string;
  badgeColor: string;
  badgeIcon: string;
} {
  // 메시지 객체별 실제 모드 캐시 (화면 모드 전환 시에도 기존 메시지 모드가 변질되지 않도록 영구 보존)
  if (msg && typeof msg === 'object' && (msg as any)._msgActualModeInfo_v4) {
    return (msg as any)._msgActualModeInfo_v4;
  }

  let rawChannels: string[] = Array.isArray(msg?.channels) ? [...msg.channels] : [];
  let rawMode: string = msg?.mode || msg?.channel || '';

  const msgId = String(msg?.id || '');
  const rawTextContent = typeof msg?.content === 'string' 
    ? msg.content 
    : (Array.isArray(msg?.content) ? (msg.content.find((item: any) => item.type === 'text')?.text || '') : '');
  const cleanText = rawTextContent.trim();

  // 0. 환영 및 일일 인사말 메시지인 경우: 인사말 고유의 모드/내용을 통해 실제 모드 추출
  const isGreet = msgId === 'greet' || msgId === 'greet-main' || msgId.startsWith('greet-') || msgId.includes('greet') || isGreetingMessage(msg);
  if (isGreet) {
    const isMasterGreetingText = 
      cleanText.includes('운명학') || 
      cleanText.includes('마스터 모드') ||
      cleanText.includes('올인원 마스터') || 
      cleanText.includes('루시 프로') ||
      cleanText.includes('결정론') ||
      cleanText.includes('7대 테마');
    if (rawMode === 'master' || isMasterGreetingText) {
      rawChannels = [...ALL_CHANNELS];
      rawMode = 'master';
    } else {
      rawChannels = [];
      rawMode = 'casual';
    }
  }

  // 0-1. 메시지 본문이 명백한 일상 수다 대화인 경우 (수다 권유, 일상 안부 등 운명학 도구 분석이 없는 대화)
  const isExplicitCasualChatText = 
    (cleanText.includes('일상 수다가 필요해') || 
     cleanText.includes('가벼운 일상 수다') || 
     cleanText.includes('수다 떨 준비되어 있어') || 
     cleanText.includes('나랑 가볍게 수다 떨자') ||
     cleanText.includes('도란도란 이야기 나눌 준비가 되어 있으니까')) &&
    !cleanText.includes('15대 운명학') &&
    !cleanText.includes('올인원 마스터') &&
    !cleanText.includes('사주명리');

  if (isExplicitCasualChatText) {
    rawMode = 'casual';
    rawChannels = [];
  }

  // 1. 모델/사용자 메시지에 모드 및 채널이 비어 있는 경우 이전/다음 메시지로부터 상속 확인
  if (rawChannels.length === 0 && !rawMode && filteredMessages && typeof index === 'number') {
    // 1-1. 모델 메시지인 경우 직전 사용자 메시지 확인
    if (index > 0) {
      const prev = filteredMessages[index - 1];
      if (prev && prev.role === 'user') {
        if (Array.isArray(prev.channels) && prev.channels.length > 0) {
          rawChannels = [...prev.channels];
        }
        if (prev.mode) {
          rawMode = prev.mode;
        }
      }
    }
    // 1-2. 사용자 메시지인 경우 직후 모델 메시지 확인
    if (rawChannels.length === 0 && !rawMode && index < filteredMessages.length - 1) {
      const next = filteredMessages[index + 1];
      if (next && next.role !== 'user') {
        if (Array.isArray(next.channels) && next.channels.length > 0) {
          rawChannels = [...next.channels];
        }
        if (next.mode) {
          rawMode = next.mode;
        }
      }
    }
  }

  // 2. 메시지에 14개 이상의 운명학 도구(usedTools)가 사용된 모델 메시지인 경우 마스터 모드
  if (rawChannels.length === 0 && !rawMode && Array.isArray(msg?.usedTools) && msg.usedTools.length >= 14) {
    rawChannels = [...ALL_CHANNELS];
    rawMode = 'master';
  }

  // 3. 여전히 비어 있다면 본문 텍스트의 키워드 및 의도 분석
  if (rawChannels.length === 0 && !rawMode) {
    const detected = detectLucyChannelsFromText(cleanText, { allowMaster: true });
    if (detected.isMaster) {
      rawChannels = [...ALL_CHANNELS];
      rawMode = 'master';
    } else if (detected.channels.length > 0) {
      rawChannels = [...detected.channels];
      rawMode = detected.channels.length === 1 ? detected.channels[0] : 'synergy';
    } else {
      rawChannels = [];
      rawMode = 'casual';
    }
  }

  const filteredChannels = rawChannels.filter((c: any) => ALL_CHANNELS.includes(c)) as SpecialChannel[];
  const isAllChannels = filteredChannels.length === ALL_CHANNELS.length && ALL_CHANNELS.every((c) => filteredChannels.includes(c));

  const isMaster = Boolean(
    rawMode === 'master' ||
    msg?.mode === 'master' ||
    isAllChannels
  );
  const validChannels = isMaster ? [...ALL_CHANNELS] : filteredChannels;
  const isCasual = !isMaster && (rawMode === 'casual' || (validChannels.length === 0 && rawMode !== 'synergy'));

  let badgeLabel = '수다 모드';
  let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white border-slate-200 dark:border-white/20';
  let badgeIcon = '💬';

  if (isMaster) {
    badgeLabel = '올인원 마스터';
    badgeColor = 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 font-bold border-amber-400';
    badgeIcon = '👑';
  } else if (validChannels.length === 1) {
    const ch = validChannels[0];
    const cfg = SPECIAL_CHANNELS[ch];
    badgeLabel = cfg ? cfg.name : ch;
    badgeColor = cfg ? `${cfg.activeColor} dark:bg-slate-800 dark:text-white dark:border-amber-400/50 border font-bold` : 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-white border-amber-200 dark:border-amber-500/40';
    badgeIcon = ch === 'prologue' ? '🌅' : ch === 'trinity' ? '🔮' : ch === 'orange' ? '🍊' : ch === 'aura' ? '🌿' : ch === 'bluebird' ? '🕊️' : ch === 'muse' ? '🎨' : '🌙';
  } else if (validChannels.length >= 2) {
    const names = validChannels.map((c) => SPECIAL_CHANNELS[c]?.shortName || c).join(' + ');
    badgeLabel = `${validChannels.length}중 융합 (${names})`;
    badgeColor = 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-indigo-300 font-bold';
    badgeIcon = '⚡';
  }

  const result: {
    mode: string;
    channels: SpecialChannel[];
    isMaster: boolean;
    isCasual: boolean;
    badgeLabel: string;
    badgeColor: string;
    badgeIcon: string;
  } = {
    mode: isMaster ? 'master' : (isCasual ? 'casual' : (validChannels.length === 1 ? validChannels[0] : 'synergy')),
    channels: isMaster ? [...ALL_CHANNELS] : validChannels,
    isMaster,
    isCasual,
    badgeLabel,
    badgeColor,
    badgeIcon
  };

  if (msg && typeof msg === 'object') {
    try {
      (msg as any)._msgActualModeInfo_v4 = result;
    } catch (_) {}
  }

  return result;
}

// 🎲 현재 프로필 및 모드에 맞춰 차분하게 제공되는 엄선된 추천 질문 6선 생성 순수 함수
function getCuratedPrompts(
  profiles: ChatTargetProfile[], 
  mode: LucyChatMode,
  channels: SpecialChannel[] = []
): string[] {
  if (mode === 'master') return shuffle(MASTER_PROMPT_POOL).slice(0, 6);

  // 0. 다자간(2인 이상) 프로필 활성화 시: 두 사람(구성원)의 이름을 반영한 궁합·연애·시너지 맞춤 질문
  if (profiles.length >= 2) {
    const multiPrompts = generateMultiProfilePrompts(profiles);
    return shuffle(multiPrompts).slice(0, 6);
  }

  // 1. 2개 이상의 채널이 활성화된 융합(Fusion / Synergy) 모드인 경우
  if (channels.length >= 2) {
    const fusionPool: string[] = [];
    channels.forEach((ch) => {
      const pool = CHANNEL_PROMPT_POOLS[ch];
      if (pool) {
        fusionPool.push(...shuffle(pool).slice(0, 3));
      }
    });
    if (fusionPool.length >= 4) {
      return shuffle(Array.from(new Set(fusionPool))).slice(0, 6);
    }
  }

  // 2. 단일 특화 채널 모드 선택 시 (channels[0] 또는 mode가 특정 채널)
  const singleChannel = (channels.length === 1 ? channels[0] : (mode !== 'auto' && mode !== 'casual' ? mode : null)) as SpecialChannel | null;
  if (singleChannel && CHANNEL_PROMPT_POOLS[singleChannel]) {
    const pool = CHANNEL_PROMPT_POOLS[singleChannel];
    return shuffle(pool).slice(0, 6);
  }

  // 3. 7대 채널 올인원 마스터 모드 (레거시 또는 7대 전체 활성)
  if (channels.length === ALL_CHANNELS.length) {
    return shuffle(MASTER_PROMPT_POOL).slice(0, 6);
  }

  // 4. 수다 모드 명시 선택 시 (레거시)
  if (mode === 'casual') {
    return shuffle(CASUAL_PROMPT_POOL).slice(0, 6);
  }

  // 5. AI 스마트 자동 감지 모드 기본 대기 상태 (7대 채널 + 호리 77선 전편에서 균형 있게 선별)
  const diversePool: string[] = [
    ...shuffle(CHANNEL_PROMPT_POOLS.trinity).slice(0, 2),
    ...shuffle(CHANNEL_PROMPT_POOLS.orange).slice(0, 2),
    ...shuffle(CHANNEL_PROMPT_POOLS.aura).slice(0, 2),
    ...shuffle(CHANNEL_PROMPT_POOLS.bluebird).slice(0, 2),
    ...shuffle(CHANNEL_PROMPT_POOLS.muse).slice(0, 2),
    ...shuffle(CHANNEL_PROMPT_POOLS.prologue).slice(0, 1),
    ...shuffle(CHANNEL_PROMPT_POOLS.epilogue).slice(0, 1),
    ...shuffle(HORI_PROMPT_LIBRARY.map((p) => toCompleteSentencePrompt(p.title, p.body))).slice(0, 4),
    ...shuffle(CASUAL_PROMPT_POOL).slice(0, 2),
  ];
  return shuffle(Array.from(new Set(diversePool))).slice(0, 6);
}

const detectPageChannels = (text: string) => detectLucyChannelsFromText(text, { allowMaster: false });

export default function LucyStandalonePage({ pro = false }: { pro?: boolean }) {
  // 🌟 Lucy + 진화 상태 머신: 접힘 시 AI 모드 기본, 듀오 펼침 시 마스터 모드(Lucy +) 기본 자동 진화
  const [isPlusMode, setIsPlusMode] = useState<boolean>(() => {
    if (pro) return true;
    try {
      if (typeof window !== 'undefined') {
        const search = window.location.search || '';
        if (search.includes('mode=plus') || search.includes('mode=pro')) return true;
        // 듀오 펼침 상태(640px 이상 또는 dual-pane) 첫 진입 시 마스터 모드 기본 발동
        const isWide = isDualPaneLayout() || window.innerWidth >= 640;
        if (isWide) return true;
      }
      return safeLocalStorage.getItem('lucy_plus_active') === 'true' || safeSessionStorage.getItem('lucy_plus_active') === 'true';
    } catch {
      return false;
    }
  });

  const previousPlusMode = useRef(isPlusMode);
  const [modeTransition, setModeTransition] = useState<'lucy' | 'plus' | null>(null);
  useEffect(() => {
    if (previousPlusMode.current === isPlusMode) return;
    previousPlusMode.current = isPlusMode;
    setModeTransition(isPlusMode ? 'plus' : 'lucy');
    setModeSwitchToast(null);
    const timer = window.setTimeout(() => setModeTransition(null), 1100);
    return () => window.clearTimeout(timer);
  }, [isPlusMode]);

  const chatScope = (pro || isPlusMode) ? 'lucy' : 'lucy';
  const [, navigate] = useLocation();
  const { resolvedTheme, lucyDayPeriod } = useTheme();
  const isLight = resolvedTheme === 'light';
  const useWhiteTheme = false;

  useEffect(() => {
    const handleEvolve = () => {
      safeLocalStorage.setItem('lucy_plus_active', 'true');
      safeSessionStorage.setItem('lucy_plus_active', 'true');
      setIsPlusMode(true);
      triggerHaptic('whitehole');
      setModeSwitchToast('👑 Lucy + 진화! 7대 채널 올인원 마스터 모드가 가동되었습니다');
      setTimeout(() => setModeSwitchToast(null), 2500);
    };

    const handleRevert = () => {
      safeLocalStorage.removeItem('lucy_plus_active');
      safeSessionStorage.removeItem('lucy_plus_active');
      setIsPlusMode(false);
      triggerHaptic('whitehole');
      setModeSwitchToast('✨ 일반 Lucy 모드로 복귀했습니다');
      setTimeout(() => setModeSwitchToast(null), 2000);
    };

    const handleToggle = () => {
      setIsPlusMode((prev) => {
        const next = !prev;
        if (next) {
          safeLocalStorage.setItem('lucy_plus_active', 'true');
          safeSessionStorage.setItem('lucy_plus_active', 'true');
          triggerHaptic('whitehole');
          setModeSwitchToast('👑 Lucy + 진화! 7대 채널 올인원 마스터 모드가 가동되었습니다');
        } else {
          safeLocalStorage.removeItem('lucy_plus_active');
          safeSessionStorage.removeItem('lucy_plus_active');
          triggerHaptic('whitehole');
          setModeSwitchToast('✨ 일반 Lucy 모드로 복귀했습니다');
        }
        setTimeout(() => setModeSwitchToast(null), 2200);
        return next;
      });
    };

    window.addEventListener('prism:evolve_lucy_plus', handleEvolve);
    window.addEventListener('prism:revert_lucy_ai', handleRevert);
    window.addEventListener('prism:toggle_lucy_plus', handleToggle);

    return () => {
      window.removeEventListener('prism:evolve_lucy_plus', handleEvolve);
      window.removeEventListener('prism:revert_lucy_ai', handleRevert);
      window.removeEventListener('prism:toggle_lucy_plus', handleToggle);
    };
  }, []);

  useEffect(() => {
    if (isPlusMode) {
      document.documentElement.classList.add('lucy-plus-active');
      document.body.classList.add('lucy-plus-active');
    } else {
      document.documentElement.classList.remove('lucy-plus-active');
      document.body.classList.remove('lucy-plus-active');
    }
    return () => {
      document.documentElement.classList.remove('lucy-plus-active');
      document.body.classList.remove('lucy-plus-active');
    };
  }, [isPlusMode]);

  const { 
    firebaseUser, 
    signInWithGoogle, 
    sendUnifiedMessage,
    revealLucyTarotCard,
    personaMessages, 
    setPersonaMessages,
    isGenerating,
    abortGenerating: abortNormalGenerating,
    lucyProMessages,
    isLucyProGenerating,
    abortLucyProGenerating,
    sharedState,
    updateSharedState
  } = useApp();

  // Both modes now send to conversationId 'lucy', so abort the same runtime.
  const abortGenerating = abortNormalGenerating;
  const chatAccount = firebaseUser?.uid || safeSessionStorage.getItem('prism_auth_uid') || 'device';
  const forwardBubble = useCallback((text: string) => {
    const payload = queueChatForward(chatAccount, chatScope, text);
    (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
    navigate(payload.to === 'lucy-pro' ? '/chat?mode=plus' : '/chat');
  }, [chatAccount, chatScope, navigate]);

  const handleAbortGeneration = useCallback(() => {
    try {
      abortGenerating('lucy');
      triggerHaptic('abort');
    } catch (_) {}
  }, [abortGenerating]);

  // 🔒 모드 선택: Lucy + 상태일 때는 7대 채널 마스터 상시 가동, 일반 Lucy일 때는 자동 감지 모드
  const selectedMode = (pro || isPlusMode ? 'master' : 'auto') as LucyChatMode;

  // 🎛️ 현재 AI가 감지·가동 중인 채널 (Lucy +일 때는 ALL_CHANNELS, 일반일 때는 자동/동적)
  const [activeChannels, setActiveChannelsState] = useState<SpecialChannel[]>(() => {
    if (pro || isPlusMode) return resolveLucyPageChannels([], true);
    try {
      safeLocalStorage.removeItem('lucy_selected_mode');
      const pending = safeSessionStorage.getItem('lucy_pro_pending_channel');
      if (pending) {
        safeSessionStorage.removeItem('lucy_pro_pending_channel');
        return resolveLucyPageChannels(parsePendingChannels(pending), false);
      }
    } catch (_) {}
    return [];
  });

  const setActiveChannels = useCallback((channels: SpecialChannel[]) => {
    setActiveChannelsState(resolveLucyPageChannels(channels, pro || isPlusMode));
  }, [pro, isPlusMode]);

  useEffect(() => {
    if (isPlusMode) {
      setActiveChannelsState(ALL_CHANNELS);
      setAutoDetectedTitleState('7대 채널 올인원 마스터');
    } else if (!pro) {
      setActiveChannelsState([]);
      setAutoDetectedTitleState(null);
    }
  }, [isPlusMode, pro]);

  // 채널 변경 시 safeLocalStorage에 영구 동기화
  useEffect(() => {
    try {
      safeLocalStorage.setItem('lucy_active_channels', JSON.stringify(activeChannels));
    } catch (_) {}
  }, [activeChannels]);

  const [input, setInput] = useSyncedChatDraft(chatAccount, chatScope);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isAutoDetect = selectedMode === 'auto';
  const [autoDetectedTitle, setAutoDetectedTitleState] = useState<string | null>(() => {
    if (selectedMode === 'casual') return '💬 수다 모드';
    if (selectedMode === 'master') return '7대 채널 올인원 마스터';
    if (selectedMode !== 'auto') {
      const cfg = SPECIAL_CHANNELS[selectedMode as SpecialChannel];
      return cfg ? cfg.name : selectedMode;
    }
    return null;
  });

  const setAutoDetectedTitle = useCallback((value: React.SetStateAction<string | null>) => {
    setAutoDetectedTitleState(previous => {
      const next = typeof value === 'function' ? value(previous) : value;
      return pro ? '7대 채널 올인원 마스터' : next?.includes('마스터') ? 'AI 자동 상담' : next;
    });
  }, [pro]);

  const currentActiveModeConfig = useMemo(() => {
    if (pro) return { ...LUCY_MODE_CONFIGS[0], label: '마스터', subLabel: '7대 채널 올인원', tagline: '7대 채널 마스터 지능 상시 가동' };
    if (activeChannels.length >= 2) {
      return {
        id: 'auto' as const,
        icon: '⚡',
        label: `${activeChannels.length}중 융합`,
        subLabel: '시너지 모드',
        tagline: `${activeChannels.map((c) => SPECIAL_CHANNELS[c]?.shortName || c).join(' + ')} 융합 시너지 지능 가동 중`,
        activeGradient: 'from-indigo-500 to-purple-600 text-white shadow-indigo-200/50',
        activeBorder: 'border-indigo-400',
        badgeBg: 'bg-indigo-100 text-indigo-950 border-indigo-200',
      };
    }
    return LUCY_MODE_CONFIGS.find((m) => m.id === selectedMode) || LUCY_MODE_CONFIGS[0];
  }, [selectedMode, activeChannels, pro]);

  // 📌 추천 질문 라이브러리 및 칩에서 지정된 모드를 보존하여 실시간 디바운스 임의 덮어쓰기 방지
  const presetModeRef = useRef<{
    text: string;
    channels: SpecialChannel[];
    title: string;
  } | null>(null);

  // Real-time input text analysis for live dynamic mode indicator badge (AI 자동 감지 모드일 때 실시간 인디케이터 배지 표시용)
  useEffect(() => {
    if (!isAutoDetect) return;

    if (!input.trim() || input.trim().length < 2) {
      presetModeRef.current = null;
      setAutoDetectedTitle(null);
      return;
    }

    // 질문 라이브러리/칩에서 선택된 질문 내용과 완전히 일치할 경우 사전 지정된 모드 유지
    if (presetModeRef.current && presetModeRef.current.text === input) {
      setAutoDetectedTitle(presetModeRef.current.title);
      return;
    }

    // 사용자가 직접 내용을 수정/타이핑하기 시작하면 프리셋을 해제하고 실시간 감지 실행
    presetModeRef.current = null;

    const timer = setTimeout(() => {
      const detected = detectPageChannels(input);
      const nextTitle = detected.isMaster || detected.channels.length > 0
        ? detected.modeTitle
        : '가벼운 일상 수다';

      setAutoDetectedTitle((prev) => (prev === nextTitle ? prev : nextTitle));
    }, 300);
    return () => clearTimeout(timer);
  }, [input, isAutoDetect]);

  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [modeSwitchToast, setModeSwitchToast] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState('');
  const manualTtsRunRef = useRef(0);
  const manualTtsActiveRef = useRef(false);
  const [ttsInfo, setTtsInfo] = useState({
    isSpeaking: false,
    isLoading: false,
    activeText: null as string | null,
    activeSentence: null as string | null,
  });
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInputComposingRef = useRef(false);
  const chatFooterRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = chatFooterRef.current;
    if (!el) return;
    const updateFooterHeight = () => {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0) {
        document.documentElement.style.setProperty('--lucy-footer-height', `${Math.round(rect.height)}px`);
      }
    };
    updateFooterHeight();
    const ro = new ResizeObserver(updateFooterHeight);
    ro.observe(el);
    window.addEventListener('resize', updateFooterHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateFooterHeight);
      document.documentElement.style.removeProperty('--lucy-footer-height');
    };
  }, []);

  // 📱 메인 본문 캔버스 실측 너비 기준 iPhone Duo 접힘 / 펼침 (Dual-Pane) 반응형 감지 및 모드 자동 연동
  const [isDuoUnfolded, setIsDuoUnfolded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return isDualPaneLayout() || window.innerWidth >= 640;
  });

  useEffect(() => {
    const handleLayoutChange = () => {
      if (typeof window === 'undefined') return;
      const unfolded = isDualPaneLayout() || window.innerWidth >= 640;
      setIsDuoUnfolded((prev) => {
        if (prev !== unfolded) {
          if (unfolded) {
            // 듀오 펼침 감지: 마스터 모드(Lucy +) 기본 자동 발동
            setIsPlusMode(true);
            safeLocalStorage.setItem('lucy_plus_active', 'true');
            safeSessionStorage.setItem('lucy_plus_active', 'true');
            triggerHaptic('whitehole');
            setModeSwitchToast(`👑 듀오 펼침 감지 · ${ALL_DCE_ENGINES.length}대 마스터 모드 가동`);
            setTimeout(() => setModeSwitchToast(null), 2200);
          } else {
            // 듀오 접힘 감지: 일반 루시 AI 모드 기본 자동 복귀
            setIsPlusMode(false);
            safeLocalStorage.removeItem('lucy_plus_active');
            safeSessionStorage.removeItem('lucy_plus_active');
            triggerHaptic('whitehole');
            setModeSwitchToast('✨ 듀오 접힘 감지 · 루시 AI 모드 복귀');
            setTimeout(() => setModeSwitchToast(null), 2000);
          }
        }
        return unfolded;
      });
    };
    handleLayoutChange();
    window.addEventListener('resize', handleLayoutChange, { passive: true });
    window.addEventListener('orientationchange', handleLayoutChange, { passive: true });
    window.visualViewport?.addEventListener('resize', handleLayoutChange, { passive: true });
    return () => {
      window.removeEventListener('resize', handleLayoutChange);
      window.removeEventListener('orientationchange', handleLayoutChange);
      window.visualViewport?.removeEventListener('resize', handleLayoutChange);
    };
  }, []);

  const currentGhostPromptRef = useRef<string>('');
  const [activeGhostPrompt, setActiveGhostPrompt] = useState<string>('');

  // 🔊 루시 답변 자동 음성 재생 (Auto-TTS 바로재생) 상태 및 설정 (기본값: ON, localStorage 영구 보존)
  const [isAutoTts, setIsAutoTts] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lucy_chat_auto_tts');
      return saved !== 'false';
    } catch {
      return true;
    }
  });
  const isAutoTtsRef = useRef(isAutoTts);
  useEffect(() => {
    isAutoTtsRef.current = isAutoTts;
  }, [isAutoTts]);

  const [autoTtsToast, setAutoTtsToast] = useState<string | null>(null);
  const lastAutoSpokenMsgIdRef = useRef<string | null>(null);
  const hasGreetingSpokenRef = useRef<boolean>(hasSpokenDailyGreetingToday(chatScope));
  const [isGreetingPendingTap, setIsGreetingPendingTap] = useState(false);

  // 🌟 매일 '처음' 루시채팅에 들어갈 때만 인사말을 표시·낭독하기 위한 일일 최초 진입 판별
  const visitDateKeyRef = useRef<string>(getTodayDateKey());
  const isFirstVisitTodayRef = useRef<boolean>((() => {
    const alreadyEntered = hasEnteredLucyChatToday(chatScope);
    if (!alreadyEntered) {
      markLucyChatEnteredToday(chatScope);
      return true;
    }
    return false;
  })());


  const autoTtsToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleAutoTts = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      playAudioHaptic('tap_impact');
      triggerHaptic('whitehole');
    } catch (_) {}

    const currentVal = isAutoTtsRef.current;
    // 이미 켜져 있는 상태에서 한 번 더 누르면 무조건 OFF(false)로 전환하고 진행 중인 음성도 즉시 중지
    const next = currentVal ? false : true;

    isAutoTtsRef.current = next;
    isAutoTtsBusyRef.current = false;
    setIsAutoTts(next);

    try {
      localStorage.setItem('lucy_chat_auto_tts', String(next));
      window.dispatchEvent(new CustomEvent('prism:auto_tts_changed', { detail: next }));
    } catch (_) {}

    if (!next) {
      hasGreetingSpokenRef.current = true;
      setIsGreetingPendingTap(false);
      stopTTS();
      setPlayingMsgId(null);
    }

    if (autoTtsToastTimerRef.current) clearTimeout(autoTtsToastTimerRef.current);
    setAutoTtsToast(
      next
        ? '🔊 자동읽기 ON · 루시 답변을 자동으로 읽어드려요'
        : '🔇 자동읽기 OFF · 음성 자동 재생이 꺼졌습니다'
    );
    autoTtsToastTimerRef.current = setTimeout(() => setAutoTtsToast(null), 2200);
  }, []);

  // 말풍선 모드 등 외부에서 변경된 자동읽기 설정 실시간 동기화
  useEffect(() => {
    const handleAutoTtsSync = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (typeof detail === 'boolean') {
        isAutoTtsRef.current = detail;
        setIsAutoTts(detail);
        if (!detail) {
          isAutoTtsBusyRef.current = false;
          stopTTS();
          setPlayingMsgId(null);
        }
      }
    };
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === 'lucy_chat_auto_tts') {
        const nextVal = e.newValue !== 'false';
        isAutoTtsRef.current = nextVal;
        setIsAutoTts(nextVal);
        if (!nextVal) {
          isAutoTtsBusyRef.current = false;
          stopTTS();
          setPlayingMsgId(null);
        }
      }
    };
    window.addEventListener('prism:auto_tts_changed', handleAutoTtsSync);
    window.addEventListener('storage', handleStorageSync);
    return () => {
      window.removeEventListener('prism:auto_tts_changed', handleAutoTtsSync);
      window.removeEventListener('storage', handleStorageSync);
      if (autoTtsToastTimerRef.current) clearTimeout(autoTtsToastTimerRef.current);
    };
  }, []);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesWrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isTTSActive = useTTSActive();
  const isUserScrolledUpRef = useRef(false);

  // 🎯 TTS 낭독 중인 하이라이트 문장 화면 수직 중앙(50%) 자동 정렬 스마트 스크롤
  const {
    isUserOverriding: isLucyUserOverriding,
    resumeAutoScroll: resumeLucyAutoScroll,
    remainingSeconds: lucyRemainingSeconds,
    hasActiveHighlight: hasLucyActiveHighlight,
  } = useSmartScroll({
    containerRef: messagesContainerRef,
    enabled: Boolean(ttsInfo.isSpeaking),
    centerOffset: 0,
    resumeDelayMs: 3000,
  });

  // Dedicated Lucy entrance aura loader
  const [isLucyReady, setIsLucyReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLucyReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // 🌌 루시 채팅 페이지 스코프 설정 (배경 순백색 고정용)
  useEffect(() => {
    document.documentElement.classList.add('in-lucy-chat');
    document.body.classList.add('in-lucy-chat');
    document.documentElement.style.removeProperty('--lucy-chat-bar-height');
    document.body.style.removeProperty('--lucy-chat-bar-height');

    return () => {
      document.documentElement.style.removeProperty('--lucy-chat-bar-height');
      document.body.style.removeProperty('--lucy-chat-bar-height');
      document.documentElement.classList.remove('in-lucy-chat');
      document.body.classList.remove('in-lucy-chat');
    };
  }, []);


  // Determine User Nickname (🛡️ 실명이나 구글 계정명으로 폴백하지 않고 '제제'로 영구 고정)
  const rawNickname = sharedState?.userProfile?.basic?.nickname?.trim();
  const userDisplayName = (rawNickname && rawNickname !== '여행자' && rawNickname !== '사용자' && rawNickname !== '박주형')
    ? rawNickname
    : '제제';

  // 👥 대화창 내 다자간 프로필 (최대 4인) 상태 관리
  // 🛡️ 영구 보존: 새로고침 또는 재진입 시에도 사용자가 설정한 다자간 프로필 및 본인 사주 정보가 절대 초기화되지 않도록 로컬스토리지에 영구 보존합니다.
  const CHAT_PROFILES_STORAGE_KEY = 'lucy_chat_active_profiles_permanent';

  const [activeProfiles, setActiveProfiles] = useState<ChatTargetProfile[]>(() => {
    const persistentBasic = getPersistentUserProfile()?.basic;
    const sharedBasic = sharedState?.userProfile?.basic;
    const basic = {
      ...sharedBasic,
      ...persistentBasic,
      birthtime: persistentBasic?.birthtime ?? sharedBasic?.birthtime,
      birthdate: persistentBasic?.birthdate || sharedBasic?.birthdate,
      lunarSolar: persistentBasic?.lunarSolar || sharedBasic?.lunarSolar,
      gender: persistentBasic?.gender || sharedBasic?.gender,
      birthCity: persistentBasic?.birthCity || sharedBasic?.birthCity,
    };
    // 🌟 사용자 요청: 루시 채팅에서 실명 대신 닉네임(기본 '제제')으로 호칭 및 표시
    const rawRealName = basic?.name?.trim();
    const myRealName = (rawRealName && rawRealName !== '제제' && rawRealName !== '여행자' && rawRealName !== '사용자')
      ? rawRealName
      : (persistentBasic?.name?.trim() || '박주형');
    const myDisplayName = userDisplayName;

    // 1. 이전에 저장된 다자간 프로필 리스트가 있으면 최우선 복원 (사용자가 수정한 값이 덮어써지지 않도록 영구 보존)
    try {
      const saved = safeLocalStorage.getItem(CHAT_PROFILES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatTargetProfile[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => {
            if (p.isMe || p.relationship === '본인') {
              return {
                ...p,
                name: myDisplayName,
                nickname: myDisplayName,
                birthdate: p.birthdate || basic?.birthdate || '1994-01-24',
                birthtime: p.birthtime !== undefined ? p.birthtime : (basic?.birthtime ?? '12:00'),
                gender: p.gender || basic?.gender || 'male',
                birthCity: p.birthCity || basic?.birthCity || '서울',
                lunarSolar: p.lunarSolar || basic?.lunarSolar || 'solar',
                relationship: '본인',
                isMe: true,
              };
            }
            return p;
          });
        }
      }
    } catch (_) {}

    const myProfile: ChatTargetProfile = {
      id: 'my-profile',
      isMe: true,
      name: myDisplayName,
      nickname: myDisplayName,
      birthdate: basic?.birthdate || '1994-01-24',
      birthtime: basic?.birthtime ?? '12:00',
      gender: basic?.gender || 'male',
      birthCity: basic?.birthCity || '서울',
      lunarSolar: basic?.lunarSolar || 'solar',
      relationship: '본인'
    };

    return [myProfile];
  });

  // 👥 현재 상담 메인 기준 대상 프로필 ID
  const [activeProfileId, setActiveProfileId] = useState<string>('my-profile');

  // 현재 활성 상담 대상 프로필 (다자간 모드 시 선택된 대상, 1인 시 해당 1인)
  const primaryProfile = useMemo(() => {
    if (activeProfiles.length === 1) return activeProfiles[0];
    const found = activeProfiles.find((p) => p.id === activeProfileId);
    return found || activeProfiles[0];
  }, [activeProfiles, activeProfileId]);

  // 🌟 사용자 요청: 루시 채팅에서 실명 대신 닉네임으로 호칭 및 사주 상담
  const counselingUserProfile: UserProfile = useMemo(() => {
    if (!primaryProfile) return sharedState?.userProfile || getPersistentUserProfile();
    const isMe = primaryProfile.isMe || primaryProfile.relationship === '본인';
    return {
      ...sharedState?.userProfile,
      basic: {
        ...sharedState?.userProfile?.basic,
        name: isMe ? userDisplayName : primaryProfile.name,
        nickname: isMe ? userDisplayName : (primaryProfile.nickname || primaryProfile.name),
        birthdate: primaryProfile.birthdate,
        birthtime: primaryProfile.birthtime,
        gender: primaryProfile.gender,
        birthCity: primaryProfile.birthCity,
        lunarSolar: primaryProfile.lunarSolar || 'solar',
      },
    };
  }, [primaryProfile, sharedState?.userProfile, userDisplayName]);

  // Detailed Saju Info for Soul Profile View (상담 대상자 기준으로 자동 동기화)
  const sajuInfo = useMemo(() => calculateDetailedSaju(counselingUserProfile), [counselingUserProfile]);

  const baseLucyMessages = personaMessages?.lucy || [];
  const lucyMessages = (baseLucyMessages.length > 0 || !pro) ? baseLucyMessages : lucyProMessages;
  const isLucyGenerating = isPlusMode ? (Boolean(isGenerating?.lucy) || Boolean(isLucyProGenerating)) : (Boolean(isGenerating?.lucy));

  // 🎙️ 루시 1:1 전용 실시간 음성 대화 모드 (STT 마이크 + TTS 자동 루프)
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(() => {
    if (pro) return false;
    try {
      return sessionStorage.getItem('lucy_chat_voice_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'error'>('idle');
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [speechInterim, setSpeechInterim] = useState<string>('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);

  const isVoiceModeRef = useRef<boolean>(isVoiceMode);
  useEffect(() => {
    isVoiceModeRef.current = isVoiceMode;
    try {
      sessionStorage.setItem(pro ? 'lucy_pro_chat_voice_mode' : 'lucy_chat_voice_mode', String(isVoiceMode));
    } catch (_) {}
  }, [isVoiceMode, pro]);

  const voiceStateRef = useRef<'idle' | 'listening' | 'thinking' | 'speaking' | 'error'>('idle');
  useEffect(() => {
    voiceStateRef.current = voiceState;
  }, [voiceState]);

  const isVoiceMutedRef = useRef<boolean>(isVoiceMuted);
  useEffect(() => {
    isVoiceMutedRef.current = isVoiceMuted;
  }, [isVoiceMuted]);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechTranscriptRef = useRef<string>('');
  const isLucyGeneratingRef = useRef<boolean>(isLucyGenerating);

  // 🎙️ 음성 인식 중지
  const stopRecognition = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    try {
      recognition?.abort();
    } catch (_) {}
  }, []);

  const stopRecognitionRef = useRef(stopRecognition);
  useEffect(() => {
    stopRecognitionRef.current = stopRecognition;
  }, [stopRecognition]);

  // handleSend forward ref
  const handleSendRef = useRef<(textToSend?: string, forcedChannels?: SpecialChannel[]) => Promise<void>>(async () => {});

  // 🎙️ 음성 인식 시작 (STT)
  const startListening = useCallback(() => {
    if (typeof window === 'undefined' || !isVoiceModeRef.current || isVoiceMutedRef.current) return;
    stopRecognition();
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome/Safari를 권장합니다.');
      setVoiceState('error');
      return;
    }

    try {
      unlockAudioPlayback();
      primeTTSAudioElement();

      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const isCurrent = () => recognitionRef.current === recognition && isVoiceModeRef.current && !isVoiceMutedRef.current;

      recognition.onstart = () => {
        if (!isCurrent()) return;
        setVoiceError(null);
        setVoiceState('listening');
        voiceStateRef.current = 'listening';
      };

      recognition.onresult = (event: any) => {
        if (!isCurrent()) return;
        let finalStr = '';
        let interimStr = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += chunk;
          } else {
            interimStr += chunk;
          }
        }

        const combined = (finalStr || interimStr).trim();
        if (combined) {
          speechTranscriptRef.current = combined;
          setSpeechTranscript(combined);
          setSpeechInterim(interimStr);

          // 1.3초 무음 감지 시 발화 마감 및 자동 전송
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (isCurrent() && combined.length >= 2 && voiceStateRef.current === 'listening') {
              void handleSendRef.current(combined);
              setSpeechTranscript('');
              setSpeechInterim('');
            }
          }, 1300);
        }
      };

      recognition.onerror = (e: any) => {
        if (!isCurrent()) return;
        console.warn('[LucyChat] STT error:', e.error || e);
        if (e.error === 'not-allowed') {
          stopRecognition();
          setVoiceError('마이크 권한이 차단되어 있습니다. 브라우저 설정에서 마이크를 허용해 주세요.');
          setVoiceState('error');
        }
      };

      recognition.onend = () => {
        if (!isCurrent()) return;
        if (
          voiceStateRef.current === 'listening' &&
          !isLucyGeneratingRef.current
        ) {
          try {
            recognition.start();
          } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      stopRecognition();
      console.warn('[LucyChat] startListening error:', err);
      setVoiceState('idle');
    }
  }, [stopRecognition]);

  const startListeningRef = useRef(startListening);
  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  // 🎙️ 루시 말 끊기 (인터럽트) 및 듣기 전환
  const handleInterruptLucy = useCallback(() => {
    try {
      playAudioHaptic('tap_impact');
      triggerHaptic('whitehole');
    } catch (_) {}
    stopTTS();
    setVoiceState('listening');
    voiceStateRef.current = 'listening';
    startListening();
  }, [startListening]);

  // 🎙️ 음성 모드 토글
  const handleToggleVoiceMode = useCallback(() => {
    try {
      playAudioHaptic('tap_impact');
      triggerHaptic('whitehole');
    } catch (_) {}

    if (isVoiceModeRef.current) {
      isVoiceModeRef.current = false;
      speechTranscriptRef.current = '';
      stopRecognition();
      stopTTS();
      setIsVoiceMode(false);
      setVoiceState('idle');
      voiceStateRef.current = 'idle';
      setSpeechTranscript('');
      setSpeechInterim('');
      setVoiceError(null);
    } else {
      unlockAudioPlayback();
      primeTTSAudioElement();
      setIsVoiceMode(true);
      isVoiceModeRef.current = true;
      setIsVoiceMuted(false);
      isVoiceMutedRef.current = false;
      setVoiceState('listening');
      voiceStateRef.current = 'listening';
      setSpeechTranscript('');
      setSpeechInterim('');
      setVoiceError(null);
      startListening();
    }
  }, [startListening, stopRecognition]);

  // 빅뱅버튼 홀드 시 별도 말풍선 없이 루시채팅 자체 음성 모드 즉시 토글
  useEffect(() => {
    const handleBigBangVoiceToggle = () => {
      handleToggleVoiceMode();
    };
    window.addEventListener('prism:toggle_lucy_chat_voice', handleBigBangVoiceToggle);
    return () => {
      window.removeEventListener('prism:toggle_lucy_chat_voice', handleBigBangVoiceToggle);
    };
  }, [handleToggleVoiceMode]);

  // AI 응답 생성 상태 변화에 따른 음성 모드 동기화
  useEffect(() => {
    isLucyGeneratingRef.current = isLucyGenerating;
    if (isVoiceModeRef.current) {
      if (isLucyGenerating) {
        setVoiceState('thinking');
        voiceStateRef.current = 'thinking';
        stopRecognition();
      }
    }
  }, [isLucyGenerating, stopRecognition]);

  // 페이지 언마운트 시 음성 인식 및 TTS 정리
  useEffect(() => {
    return () => {
      // Prevent the outgoing chat's TTS listener from restarting its microphone.
      isVoiceModeRef.current = false;
      isAutoTtsRef.current = false;
      voiceStateRef.current = 'idle';
      stopRecognition();
      stopTTS();
    };
  }, [stopRecognition]);

  // 사용자가 대화창에서 프로필을 직접 변경/수정한 경우 플래그 (새로고침 또는 페이지 재진입 전까지 프로필 원복 방지)
  const hasUserCustomizedProfilesRef = useRef<boolean>((() => {
    try {
      return safeLocalStorage.getItem('lucy_user_customized_profiles') === 'true';
    } catch {
      return false;
    }
  })());

  // 루시 채팅 진입 시 일일 초기화 점검 및 대화 기록이 없을 때 기본 루시 인사말 보장
  useEffect(() => {
    const todayKey = getTodayDateKey();
    if (visitDateKeyRef.current !== todayKey) {
      visitDateKeyRef.current = todayKey;
      isFirstVisitTodayRef.current = true;
      hasGreetingSpokenRef.current = false;
      markLucyChatEnteredToday(chatScope);
    }

    if (!pro) setPersonaMessages((prevRecord) => {
      const existing = prevRecord.lucy || [];
      const stored = loadSavedUnifiedMessages();
      const currentList = mergeUnifiedMessages(existing, stored);
      const archival = processDailyChatArchival(currentList, userDisplayName);
      let nextList = archival.messages;

      const hasUserMsg = nextList.some((m) => m.role === 'user' && !!m.content);
      if (!hasUserMsg && nextList.length === 0) {
        nextList = [createDefaultGreeting('lucy', userDisplayName)];
      }

      if (!isFirstVisitTodayRef.current) {
        markFirstLucyVisitCompletedToday(chatScope);
      }

      if (JSON.stringify(existing) !== JSON.stringify(nextList)) {
        saveUnifiedMessagesSafely(nextList);
        return {
          lucy: nextList,
          orange: nextList,
          trinity: nextList,
          aura: nextList,
          bluebird: nextList,
          muse: nextList,
        };
      }
      return prevRecord;
    });

    const handleBeforeUnload = () => {
      markFirstLucyVisitCompletedToday(chatScope);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [setPersonaMessages, userDisplayName, pro, chatScope]);

  // 루시 채팅에서 벗어날 때(언마운트 시) 오늘 첫 방문 완료 처리 (인사말과 다자간 프로필은 영구 보존)
  useEffect(() => {
    return () => {
      markFirstLucyVisitCompletedToday(chatScope);
      // 🛡️ 다자간 프로필 영구 보존: 세션/로컬 삭제 금지
    };
  }, []);

  // 🎲 차분하게 유지되는 맞춤 추천 질문 상태 (새로고침 🔄 클릭, 모드 전환, 프로필 변경 시에만 명시적으로 갱신되며 실시간 임의 변동 방지)
  const [currentPrompts, setCurrentPrompts] = useState<string[]>(() => {
    return getCuratedPrompts(activeProfiles, selectedMode, activeChannels);
  });

  // 🔄 루시 AI 모드 ↔ 마스터 모드 전환 시 하단 추천 질문 예시 1:1 실시간 즉시 동기화
  useEffect(() => {
    setCurrentPrompts(getCuratedPrompts(activeProfiles, selectedMode, activeChannels));
  }, [selectedMode, activeChannels, activeProfiles]);

  // sharedState 변경 시 내 프로필 정보 동기화 (사용자가 대화창에서 프로필을 직접 수정한 경우 덮어쓰지 않고 변경 상태 유지)
  useEffect(() => {
    if (hasUserCustomizedProfilesRef.current) return;
    const persistentBasic = getPersistentUserProfile()?.basic;
    const basic = {
      ...sharedState?.userProfile?.basic,
      ...persistentBasic,
      birthtime: persistentBasic?.birthtime ?? sharedState?.userProfile?.basic?.birthtime,
    };
    if (basic?.name || basic?.nickname || basic?.birthdate) {
      setActiveProfiles((prev) => {
        if (hasUserCustomizedProfilesRef.current) return prev;
        const me = prev.find((p) => p.isMe);
        if (!me) return prev;
        const rawRealName = basic?.name?.trim();
        const realName = (rawRealName && rawRealName !== '제제' && rawRealName !== '여행자' && rawRealName !== '사용자')
          ? rawRealName
          : (persistentBasic?.name?.trim() || me.name || '박주형');
        const newBirthdate = basic?.birthdate || me.birthdate;
        const newBirthtime = basic?.birthtime ?? me.birthtime;
        const newGender = basic?.gender || me.gender;
        const newCity = basic?.birthCity || me.birthCity;
        const newLs = basic?.lunarSolar || me.lunarSolar;
        if (
          me.name === realName &&
          me.birthdate === newBirthdate &&
          me.birthtime === newBirthtime &&
          me.gender === newGender &&
          me.birthCity === newCity &&
          me.lunarSolar === newLs
        ) {
          return prev;
        }
        const next = prev.map((p) =>
          p.isMe
            ? {
                ...p,
                name: realName,
                birthdate: newBirthdate,
                birthtime: newBirthtime,
                gender: newGender,
                birthCity: newCity,
                lunarSolar: newLs,
              }
            : p
        );
        try {
          safeLocalStorage.setItem(CHAT_PROFILES_STORAGE_KEY, JSON.stringify(next));
        } catch (_) {}
        return next;
      });
    }
  }, [sharedState?.userProfile?.basic]);

  // 프로필 모달 상태
  const [isChatProfileModalOpen, setIsChatProfileModalOpen] = useState(false);
  const [editingChatProfile, setEditingChatProfile] = useState<ChatTargetProfile | null>(null);

  const handleOpenAddChatProfile = useCallback(() => {
    setEditingChatProfile(null);
    setIsChatProfileModalOpen(true);
  }, []);

  const handleOpenEditChatProfile = useCallback((profile: ChatTargetProfile) => {
    setEditingChatProfile(profile);
    setIsChatProfileModalOpen(true);
  }, []);

  const handleSaveChatProfile = useCallback((profile: ChatTargetProfile) => {
    hasUserCustomizedProfilesRef.current = true;
    try {
      safeLocalStorage.setItem('lucy_user_customized_profiles', 'true');
    } catch (_) {}
    setActiveProfiles((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === profile.id);
      
      // Check if another profile is already '본인'
      const existingSelfIndex = prev.findIndex(
        (p) => p.id !== profile.id && (p.isMe || p.relationship === '본인')
      );

      let safeProfile = { ...profile };
      // 🛡️ '본인' 중복 방지: 이미 본인이 존재한다면 추가 프로필은 타인 관계로 강제 보정
      if (existingSelfIndex !== -1 && (safeProfile.relationship === '본인' || safeProfile.isMe)) {
        safeProfile.relationship = '연인';
        safeProfile.isMe = false;
      }

      let updated: ChatTargetProfile[];
      if (existsIndex !== -1) {
        updated = [...prev];
        updated[existsIndex] = safeProfile;
      } else {
        if (prev.length >= 4) return prev;
        updated = [...prev, safeProfile];
      }

      // 🌟 1명만 남은 경우 무조건 '본인'으로 자동 확정
      if (updated.length === 1) {
        updated = [
          {
            ...updated[0],
            isMe: true,
            relationship: '본인',
          },
        ];
      } else if (updated.length >= 2) {
        // 2명 이상일 때 '본인'이 2명 이상 중복되지 않도록 보장 (첫 번째 본인만 유지)
        let foundFirstSelf = false;
        updated = updated.map((p) => {
          if (p.isMe || p.relationship === '본인') {
            if (!foundFirstSelf) {
              foundFirstSelf = true;
              return { ...p, isMe: true, relationship: '본인' };
            }
            return { ...p, isMe: false, relationship: '연인' };
          }
          return p;
        });
      }

      // 🛡️ 내 프로필(isMe) 수정 시 글로벌 sharedState 및 영구 볼트의 사주 실명/생년월일 동기화 (닉네임 '제제'는 불변 유지)
      if (safeProfile.isMe) {
        const currentProfile = getPersistentUserProfile();
        const existingNick = (currentProfile?.basic?.nickname && currentProfile.basic.nickname !== '박주형')
          ? currentProfile.basic.nickname
          : '제제';
        const updatedBasic = {
          ...(currentProfile?.basic || {}),
          name: safeProfile.name.trim() || '박주형',
          nickname: existingNick,
          birthdate: safeProfile.birthdate,
          birthtime: safeProfile.birthtime,
          gender: safeProfile.gender,
          birthCity: safeProfile.birthCity,
          lunarSolar: safeProfile.lunarSolar,
        };
        const updatedUserProfile = {
          ...(currentProfile || {}),
          basic: updatedBasic,
        };
        saveProfileToAllVaults(updatedUserProfile);
        setPersistentUserProfile(updatedUserProfile);
        updateSharedState({
          userProfile: {
            ...(sharedState?.userProfile || {}),
            basic: updatedBasic,
          },
        }, 'lucy');
      }

      setCurrentPrompts(getCuratedPrompts(updated, selectedMode, activeChannels));
      try {
        safeLocalStorage.setItem(CHAT_PROFILES_STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  }, [selectedMode, activeChannels]);

  const handleSelectActiveProfile = useCallback((profileId: string) => {
    setActiveProfileId(profileId);
    const target = activeProfiles.find((p) => p.id === profileId);
    if (target) {
      setModeSwitchToast(`🔮 상담 기준 전환 · [${target.name}] 님의 만세력·사주로 분석합니다`);
      setTimeout(() => setModeSwitchToast(null), 2500);
      try {
        triggerHaptic('whitehole');
      } catch (_) {}
    }
  }, [activeProfiles]);

  const handleRemoveChatProfile = useCallback((profileId: string) => {
    hasUserCustomizedProfilesRef.current = true;
    setActiveProfiles((prev) => {
      // 2명 이상일 때만 삭제 가능 (내 프로필 포함)
      if (prev.length <= 1) return prev;
      let remaining = prev.filter((p) => p.id !== profileId);
      // 🌟 사용자 요청: 1명만 남으면 무조건 '본인'으로 자동 확정
      if (remaining.length === 1) {
        remaining = [
          {
            ...remaining[0],
            isMe: true,
            relationship: '본인',
          },
        ];
      }
      // 삭제된 프로필이 현재 활성 상담 대상이었던 경우 첫 번째 프로필로 자동 전환
      if (profileId === activeProfileId && remaining.length > 0) {
        setActiveProfileId(remaining[0].id);
      }
      setCurrentPrompts(getCuratedPrompts(remaining, selectedMode, activeChannels));
      try {
        safeLocalStorage.setItem(CHAT_PROFILES_STORAGE_KEY, JSON.stringify(remaining));
      } catch (_) {}
      return remaining;
    });
  }, [selectedMode, activeChannels, activeProfileId]);

  // Refresh / Reshuffle prompts (새로고침 버튼 클릭 시에만 안정적으로 갱신)
  const refreshPrompts = useCallback(() => {
    setCurrentPrompts(getCuratedPrompts(activeProfiles, selectedMode, activeChannels));
  }, [activeProfiles, selectedMode, activeChannels]);

  // 말풍선 배지 / 추천 카드 클릭 시: AI 모드를 유지한 채 해당 채널 조합(단일·융합·마스터)을 즉시 반영
  const handleActivateMessageMode = (targetChannels: SpecialChannel[], targetIsMaster: boolean, label?: string) => {
    const nextChannels = resolveLucyPageChannels(targetChannels, pro);
    const modeLabel = !pro && (targetIsMaster || label?.includes('마스터')) ? formatChannelsModeTitle(nextChannels) : label || formatChannelsModeTitle(nextChannels);
    setActiveChannels(nextChannels);
    setAutoDetectedTitle(modeLabel);
    setCurrentPrompts(getCuratedPrompts(activeProfiles, 'auto', nextChannels));
    if (label) {
      setModeSwitchToast(`⚡ AI 모드 · [${modeLabel}] 가동`);
      setTimeout(() => setModeSwitchToast(null), 2500);
    }
  };

  // Dynamic Current Mode Info
  const channelCount = activeChannels.length;
  const isCasualChat = channelCount === 0;
  const isFullProMaster = channelCount === ALL_CHANNELS.length;
  const isSingleSpecial = channelCount === 1;
  const isSynergy = channelCount >= 2 && channelCount < ALL_CHANNELS.length;

  const currentModeTitle = useMemo(() => {
    if (isCasualChat) return '가벼운 일상 수다';
    if (isFullProMaster) return '7대 채널 올인원 PRO 마스터 (풀가동)';
    if (isSingleSpecial) {
      const ch = activeChannels[0];
      return (ch && SPECIAL_CHANNELS[ch]?.name) || '특화 채널';
    }
    const names = activeChannels.map((c) => (c && SPECIAL_CHANNELS[c]?.shortName) || c).join(' + ');
    return `${channelCount}중 융합 (${names})`;
  }, [channelCount, activeChannels, isCasualChat, isFullProMaster, isSingleSpecial]);

  const currentModeTagline = useMemo(() => {
    if (isCasualChat) return '루시와 편안하게 나누는 친근하고 따뜻한 일상 대화';
    if (isFullProMaster) return '7대 우주 지능 전원 풀가동 (서막·전략·운명·치유·위로·창의·회고 최고 출력)';
    if (isSingleSpecial) {
      const ch = activeChannels[0];
      return (ch && SPECIAL_CHANNELS[ch]?.tagline) || '특화 지능 통찰';
    }
    const names = activeChannels.map((c) => (c && SPECIAL_CHANNELS[c]?.shortName) || c).join(' + ');
    return `${names} 지능이 결합되어 다각도 입체 시너지 통찰을 제공합니다.`;
  }, [channelCount, activeChannels, isCasualChat, isFullProMaster, isSingleSpecial]);

  // 🌟 호리(hori.chat) 스타일 동적 예시 고민 풀 (모두 자연스럽게 완성된 문장형 질문으로 제공)
  const dynamicGhostPrompts = useMemo(() => {
    // 2인 이상 시 두 사람(다자간) 맞춤 궁합 질문 우선 노출
    if (activeProfiles.length >= 2) {
      return generateMultiProfilePrompts(activeProfiles).map((q) => toCompleteSentencePrompt(q));
    }

    const horiSentences = HORI_PROMPT_LIBRARY.map((p) => toCompleteSentencePrompt(p.title, p.body));
    
    let contextualPrompts: string[] = [];
    if (selectedMode === 'casual') {
      contextualPrompts = CASUAL_PROMPT_POOL;
    } else if (selectedMode === 'master') {
      contextualPrompts = MASTER_PROMPT_POOL;
    } else if (selectedMode !== 'auto') {
      const chPool = CHANNEL_PROMPT_POOLS[selectedMode];
      if (chPool) contextualPrompts = chPool;
    } else {
      // AI 자동 모드 기본 상태: 7대 채널 대표 질문 + 캐주얼 질문 혼합
      contextualPrompts = [
        ...CHANNEL_PROMPT_POOLS.trinity,
        ...CHANNEL_PROMPT_POOLS.orange,
        ...CHANNEL_PROMPT_POOLS.aura,
        ...CHANNEL_PROMPT_POOLS.bluebird,
        ...CHANNEL_PROMPT_POOLS.muse,
        ...CASUAL_PROMPT_POOL
      ];
    }

    const combined = [...contextualPrompts.map((q) => toCompleteSentencePrompt(q)), ...horiSentences];
    return Array.from(new Set(combined.filter((p) => p && p.trim().length > 0)));
  }, [activeProfiles.length, selectedMode]);

  // dynamicGhostPrompts가 준비되거나 모드가 바뀌면 즉시 첫 예시 질문을 activeGhostPrompt의 기본값으로 동기화
  useEffect(() => {
    if (dynamicGhostPrompts.length > 0) {
      currentGhostPromptRef.current = dynamicGhostPrompts[0];
      setActiveGhostPrompt(dynamicGhostPrompts[0]);
    }
  }, [dynamicGhostPrompts]);

  // Filter messages by search query if search is active (대화 기록이 비어있다면 기본 루시 인사말 표시 보장)
  const filteredMessages = useMemo(() => {
    const isMasterGreeting = isPlusMode || pro;
    const rawList = lucyMessages.length > 0
      ? (lucyMessages.length === 1 && isGreetingMessage(lucyMessages[0]) && isMasterGreeting
          ? [createDefaultGreeting('lucy', userDisplayName, true)]
          : lucyMessages)
      : [createDefaultGreeting('lucy', userDisplayName, isMasterGreeting)];
    const baseList = rawList.map((m) => {
      if (isGreetingMessage(m) && typeof m.content === 'string' && (m.mode === 'master' || m.content.includes('마스터 모드') || isMasterGreeting)) {
        return {
          ...m,
          content: m.content
            .replace(/\d+대\s*운명학/g, `${ALL_DCE_ENGINES.length}대 운명학`)
            .replace(/\d+가지\s*(?:운명학\s*도구|결정론\s*엔진|운명학·결정론\s*엔진)/g, `${ALL_DCE_ENGINES.length}가지 운명학·결정론 엔진`),
        };
      }
      return m;
    });
    if (!searchQuery.trim()) return baseList;
    const q = searchQuery.toLowerCase();
    return baseList.filter((m) => {
      const rawText = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
      const txt = m.role === 'user' ? rawText : cleanAssistantMessageDisplay(rawText);
      return txt.toLowerCase().includes(q);
    });
  }, [lucyMessages, searchQuery, userDisplayName, isPlusMode, pro]);

  // Background Auto-Prefetch latest Lucy message for 0ms instant TTS playback
  useEffect(() => {
    if (lucyMessages.length > 0 && !isLucyGenerating) {
      const lastMsg = lucyMessages[lucyMessages.length - 1];
      if (lastMsg && lastMsg.role !== 'user' && typeof lastMsg.content === 'string' && lastMsg.content.length > 1) {
        prefetchTTSChunks(lastMsg.content, 'Aoede');
      }
    }
  }, [lucyMessages, isLucyGenerating]);

  // Keep TTS playing seamlessly across app transitions (global playback persistence)
  useEffect(() => {
    return () => {
      // Do not stop TTS on unmount so audio continues across route switches
    };
  }, []);

  // Subscribe to TTS state changes
  useEffect(() => {
    return subscribeTTS((state) => {
      setTtsInfo({
        isSpeaking: state.isSpeaking,
        isLoading: state.isLoading,
        activeText: state.activeText,
        activeSentence: state.activeSentence || state.currentSentence || null,
      });
      if (!state.isSpeaking && !state.isLoading && !state.isPaused && !state.activeSessionId) {
        setPlayingMsgId(null);
        if (isVoiceModeRef.current && !isVoiceMutedRef.current && !isLucyGeneratingRef.current && !recognitionRef.current) {
          // 루시 음성 종료 시 자동으로 듣기(STT) 상태로 전환하여 연속 대화 연결
          setVoiceState('listening');
          voiceStateRef.current = 'listening';
          startListeningRef.current?.();
        }
      } else if (state.isSpeaking && isVoiceModeRef.current && !isVoiceMutedRef.current) {
        setVoiceState('speaking');
        voiceStateRef.current = 'speaking';
        stopRecognitionRef.current?.();
      }
    });
  }, []);

  // 🔊 자동 음성 재생(Auto-TTS) 동시 중복 호출 및 자기 취소 방지용 단일 러너 뮤텍스
  const isAutoTtsBusyRef = useRef(false);
  const pageMountedAtRef = useRef<number>(Date.now());

  const triggerAutoTts = useCallback(async (textToSpeak: string, msgId?: string) => {
    if (manualTtsActiveRef.current) return;
    if (msgId && !isLucyTarotDrawOpen(lucyMessages.find(message => message.id === msgId)?.tarotDraw)) return;
    if ((!isAutoTtsRef.current && !isVoiceModeRef.current) || !textToSpeak || !textToSpeak.trim()) return;
    if (msgId && lastAutoSpokenMsgIdRef.current === msgId) return;
    if (isAutoTtsBusyRef.current) return;

    const resolvedMsgId = msgId || String(lucyMessages.length - 1);
    setTtsError('');
    lastAutoSpokenMsgIdRef.current = resolvedMsgId;
    setPlayingMsgId(resolvedMsgId);
    isAutoTtsBusyRef.current = true;

    try {
      unlockAudioPlayback();
      primeTTSAudioElement();

      // 분할된 2~4개의 카톡 말풍선을 순서대로 이어 붙여 한 번에 연속 낭독
      const joinedBubblesText = joinKakaoBubblesForTTS(cleanAssistantMessageDisplay(textToSpeak), 4) || textToSpeak;
      const cleanAnswer = normalizeTextForSpeech(joinedBubblesText);
      if (cleanAnswer) {
        await playTTSInChunks(cleanAnswer, 'Aoede', 110, undefined, undefined, {
          skipCompletionChime: true,
          isChatMode: true,
          isAutoPlay: true,
        });
      }
    } catch (ttsErr) {
      console.warn('[Auto-TTS] Voice playback error:', ttsErr);
      setTtsError(ttsErr instanceof Error ? ttsErr.message : 'AI 음성을 재생하지 못했습니다. 다시 눌러 주세요.');
    } finally {
      if (!manualTtsActiveRef.current) setPlayingMsgId(null);
      isAutoTtsBusyRef.current = false;
    }
  }, [lucyMessages]);

  // 🌸 사용자 요청: 루시 및 루시프로 진입 시 인사말 자동 TTS 낭독 비활성화 (수동 스피커 탭 시에만 재생)
  useEffect(() => {
    hasGreetingSpokenRef.current = true;
  }, []);

  // 🔊 자동 음성 재생(Auto-TTS) 안전 백업 감시자: 새 어시스턴트 메시지 도착 시 바로재생 보장
  useEffect(() => {
    if (!isAutoTtsRef.current || isLucyGenerating || lucyMessages.length === 0 || isAutoTtsBusyRef.current) return;
    const lastMsgIndex = lucyMessages.length - 1;
    const lastMsg = lucyMessages[lastMsgIndex];
    if (!lastMsg || lastMsg.role === 'user' || typeof lastMsg.content !== 'string' || !lastMsg.content.trim()) return;

    // 만약 사용자 발화가 아직 없는 환영/인사말 상태라면 자동 낭독하지 않음
    const hasUser = lucyMessages.some((m) => m.role === 'user' && !!m.content);
    if (!hasUser || lastMsg.id?.startsWith('greet') || isGreetingMessage(lastMsg)) return;

    // 방금 전송된 메시지이고 아직 음성 재생되지 않은 경우 바로 자동 재생
    const targetId = String(lastMsg.id || lastMsgIndex);
    if (targetId && lastAutoSpokenMsgIdRef.current !== targetId && !ttsInfo.isSpeaking && !ttsInfo.isLoading) {
      const msgTime = lastMsg.timestamp || 0;
      const isRecent = Date.now() - msgTime < 25000;
      if (isRecent) {
        triggerAutoTts(lastMsg.content, targetId);
      }
    }
  }, [lucyMessages, isLucyGenerating, ttsInfo.isSpeaking, ttsInfo.isLoading, triggerAutoTts]);


  //  Dynamic PWA Manifest & iOS Home-screen Metadata Switcher
  useEffect(() => {
    const prevTitle = document.title;
    document.title = pro ? 'Lucy Pro' : 'Lucy';

    let manifestTag = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
    const prevManifestHref = manifestTag ? manifestTag.getAttribute('href') : null;
    if (manifestTag) {
      manifestTag.setAttribute('href', '/manifest-lucy.webmanifest');
    }

    const appleTouchIcons = document.querySelectorAll('link[rel^="apple-touch-icon"]') as NodeListOf<HTMLLinkElement>;
    const prevAppleIconHrefs: string[] = [];
    appleTouchIcons.forEach((iconTag) => {
      prevAppleIconHrefs.push(iconTag.href);
      iconTag.href = '/apple-touch-icon-lucy.png';
    });

    const favicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]') as NodeListOf<HTMLLinkElement>;
    const prevFaviconHrefs: string[] = [];
    favicons.forEach((favTag) => {
      prevFaviconHrefs.push(favTag.href);
      favTag.href = '/lucy-icon-192.png';
    });

    let appleTitleTag = document.querySelector('meta[name="apple-mobile-web-app-title"]') as HTMLMetaElement | null;
    const prevAppleTitle = appleTitleTag ? appleTitleTag.getAttribute('content') : null;
    if (appleTitleTag) {
      appleTitleTag.setAttribute('content', pro ? 'Lucy Pro' : 'Lucy');
    }

    let statusBarStyleTag = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') as HTMLMetaElement | null;
    const prevStatusBarStyle = statusBarStyleTag ? statusBarStyleTag.getAttribute('content') : null;
    if (statusBarStyleTag) {
      statusBarStyleTag.setAttribute('content', 'black-translucent');
    }

    let themeColorTag = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    const prevThemeColor = themeColorTag ? themeColorTag.getAttribute('content') : null;
    let didCreateThemeTag = false;
    if (!themeColorTag) {
      themeColorTag = document.createElement('meta');
      themeColorTag.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColorTag);
      didCreateThemeTag = true;
    }
    const chatBackground = useWhiteTheme ? '#ffffff' : '#101722';
    themeColorTag.setAttribute('content', chatBackground);
    const previousLucyTheme = document.documentElement.getAttribute('data-lucy-theme');
    document.documentElement.setAttribute('data-lucy-theme', useWhiteTheme ? 'white' : 'starlight');

    // 📱 앱(PWA) 모드에서 상하단 안전영역(노치/홈바)이 어두운 body 배경으로 비쳐 회색으로 보이는 현상 방지
    const prevHtmlBg = document.documentElement.style.background;
    const prevBodyBg = document.body.style.background;
    const prevHtmlBgColor = document.documentElement.style.backgroundColor;
    const prevBodyBgColor = document.body.style.backgroundColor;
    document.documentElement.style.background = chatBackground;
    document.body.style.background = chatBackground;
    document.documentElement.style.backgroundColor = chatBackground;
    document.body.style.backgroundColor = chatBackground;

    return () => {
      document.title = prevTitle;
      if (manifestTag && prevManifestHref) manifestTag.setAttribute('href', prevManifestHref);
      appleTouchIcons.forEach((iconTag, idx) => {
        if (prevAppleIconHrefs[idx]) iconTag.href = prevAppleIconHrefs[idx];
      });
      favicons.forEach((favTag, idx) => {
        if (prevFaviconHrefs[idx]) favTag.href = prevFaviconHrefs[idx];
      });
      if (appleTitleTag && prevAppleTitle) appleTitleTag.setAttribute('content', prevAppleTitle);
      if (statusBarStyleTag && prevStatusBarStyle) statusBarStyleTag.setAttribute('content', prevStatusBarStyle);
      if (themeColorTag) {
        if (didCreateThemeTag) {
          themeColorTag.remove();
        } else if (prevThemeColor) {
          themeColorTag.setAttribute('content', prevThemeColor);
        }
      }
      document.documentElement.style.background = prevHtmlBg;
      document.body.style.background = prevBodyBg;
      document.documentElement.style.backgroundColor = prevHtmlBgColor;
      document.body.style.backgroundColor = prevBodyBgColor;
      if (previousLucyTheme === null) document.documentElement.removeAttribute('data-lucy-theme');
      else document.documentElement.setAttribute('data-lucy-theme', previousLucyTheme);
    };
  }, []);

  useEffect(() => {
    const color = lucyDayPeriod === 'morning' ? '#faf7f0' : lucyDayPeriod === 'day' ? '#e6f3ff' : '#101722';
    document.documentElement.style.setProperty('--lucy-page-background', color);
    const tag = document.querySelector('meta[name="theme-color"]');
    const previous = tag?.getAttribute('content');
    tag?.setAttribute('content', color);
    return () => {
      document.documentElement.style.removeProperty('--lucy-page-background');
      if (previous != null) tag?.setAttribute('content', previous);
    };
  }, [lucyDayPeriod]);

  const isAutoScrollingRef = useRef(false);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smart non-intrusive scroll handling
  const handleScroll = useCallback(() => {
    if (isAutoScrollingRef.current) return;
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    // 바닥에서 80px 이상 떨어져 있으면 사용자가 과거 대화를 읽는 중으로 엄격 보장
    if (distanceFromBottom > 80) {
      isUserScrolledUpRef.current = true;
    } else if (distanceFromBottom <= 35) {
      isUserScrolledUpRef.current = false;
    }
  }, []);

  // 🌟 PC 데스크톱 마우스 휠 및 트랙패드 스크롤 시 자동 스크롤과 충돌 없이 즉각 반응
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < -2) {
        // 위로 휠 스크롤 시 즉시 사용자 수동 조작 모드로 전환하여 하단 끌어당김 방지
        isUserScrolledUpRef.current = true;
      } else if (e.deltaY > 2) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const dist = scrollHeight - (scrollTop + clientHeight);
        if (dist <= 30) {
          isUserScrolledUpRef.current = false;
        }
      }
    };
    container.addEventListener('wheel', onWheel, { passive: true });
    return () => container.removeEventListener('wheel', onWheel);
  }, [isLucyReady]);

  // Keep the callback stable: playback changes must not rerun the mount scroll effect.
  const ttsBlocksAutoScrollRef = useRef(false);
  ttsBlocksAutoScrollRef.current = ttsInfo.isSpeaking || ttsInfo.isLoading;

  const scrollToBottom = useCallback((force = false, smooth = true) => {
    if (!messagesContainerRef.current) return;
    if (!force && (isUserScrolledUpRef.current || ttsBlocksAutoScrollRef.current || manualTtsActiveRef.current)) return;

    isAutoScrollingRef.current = true;
    if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
    autoScrollTimerRef.current = setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 200);

    const container = messagesContainerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  // Continuous height & image layout observer for smooth uncropped scrolling
  useEffect(() => {
    if (!messagesWrapperRef.current || !messagesContainerRef.current) return;

    let rafId: number | null = null;
    let lastHeight = 0;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const newHeight = entry ? entry.contentRect.height : 0;
      if (Math.abs(newHeight - lastHeight) < 8) return;
      lastHeight = newHeight;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!isUserScrolledUpRef.current && !ttsInfo.isSpeaking) {
          scrollToBottom(false, false);
        }
      });
    });

    resizeObserver.observe(messagesWrapperRef.current);

    const handleContentResized = () => {
      if (!isUserScrolledUpRef.current && !ttsInfo.isSpeaking) {
        scrollToBottom(false, false);
      }
    };
    window.addEventListener('lucy-chat-content-resized', handleContentResized);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
      window.removeEventListener('lucy-chat-content-resized', handleContentResized);
    };
  }, [isLucyReady, scrollToBottom, ttsInfo.isSpeaking]);

  useEffect(() => {
    if (!isUserScrolledUpRef.current && !ttsInfo.isSpeaking) {
      scrollToBottom(false, false);
    }
  }, [isLucyReady, lucyMessages, isLucyGenerating, ttsInfo.isSpeaking, scrollToBottom]);

  // The message viewport mounts only after the entrance loader finishes.
  // Align it before paint; playback state must never retrigger this entry scroll.
  useLayoutEffect(() => {
    if (!isLucyReady) return;
    isUserScrolledUpRef.current = false;
    scrollToBottom(true, false);
  }, [isLucyReady, scrollToBottom]);

  // Returning from the background also opens at the latest conversation.
  const wasAppHiddenRef = useRef(false);
  useEffect(() => {
    if (!isLucyReady) return;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        wasAppHiddenRef.current = true;
      } else if (document.visibilityState === 'visible' && wasAppHiddenRef.current) {
        wasAppHiddenRef.current = false;
        // 다른 앱이나 홈 화면에서 돌아왔을 때만 1회 최신 대화로 정렬
        isUserScrolledUpRef.current = false;
        scrollToBottom(true, false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLucyReady, scrollToBottom]);

  // 🚀 최상단 스크롤 이벤트 수신 시 루시 대화창 최상단으로 부드럽게 스크롤
  useEffect(() => {
    const handleScrollToTopEvent = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        isUserScrolledUpRef.current = true; // 사용자가 상단으로 이동했으므로 상태 갱신
      }
    };
    window.addEventListener('prism:scroll_to_top', handleScrollToTopEvent);
    return () => {
      window.removeEventListener('prism:scroll_to_top', handleScrollToTopEvent);
    };
  }, []);

  // 🚀 최하단 스크롤 이벤트 수신 시 루시 대화창 최하단으로 부드럽게 스크롤
  useEffect(() => {
    const handleScrollToBottomEvent = () => {
      isUserScrolledUpRef.current = false;
      scrollToBottom(true, true);
    };
    window.addEventListener('prism:scroll_to_bottom', handleScrollToBottomEvent);
    return () => {
      window.removeEventListener('prism:scroll_to_bottom', handleScrollToBottomEvent);
    };
  }, [scrollToBottom]);


  // Handle image attachment with auto-compression (prevents stuttering & infinite scroll)
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('이미지 크기는 최대 15MB까지 가능합니다.');
      return;
    }

    try {
      const compressed = await compressImageIfNeeded(file);
      if (compressed) {
        setAttachedImage(compressed);
      }
    } catch (err) {
      console.error('[ImageSelect] Failed to process image:', err);
    } finally {
      e.target.value = '';
    }
  };

  // Send message with multi-channel context routing (루시가 답변 준비 중일 때도 추가 연속 입력 허용 및 통합 맥락 반영)
  const handleSend = useCallback(async (textToSend?: string, forcedChannels?: SpecialChannel[]) => {
    const hasExplicitUserInput = Boolean(textToSend || input.trim() || attachedImage);
    // 💡 사용자가 직접 입력한 텍스트가 없고 첨부 이미지가 없는 경우(생성 중이 아닐 때만), 현재 화면에 표시/타이핑 중인 완성형 예시 질문 채택
    const candidateGhost = (!hasExplicitUserInput && !isLucyGenerating)
      ? (currentGhostPromptRef.current || activeGhostPrompt || dynamicGhostPrompts[0] || '')
      : '';
    const rawMsg = textToSend || (input.trim() ? input : candidateGhost);
    if (!rawMsg.trim() && !attachedImage) return;

    const userCleanText = rawMsg.trim();

    // 직전 완성된 루시 답변 이후 연속으로 쌓인 사용자 메시지가 있다면 함께 합쳐서 채널·운명학 도구를 판별
    const priorUnansweredTexts: string[] = [];
    for (let i = lucyMessages.length - 1; i >= 0; i--) {
      const m = lucyMessages[i];
      if (m.role === 'model') {
        const mTxt = typeof m.content === 'string' ? m.content.trim() : '';
        if (mTxt.length > 0) break;
        continue;
      }
      if (m.role === 'user') {
        const uTxt = typeof m.content === 'string'
          ? m.content.trim()
          : Array.isArray(m.content)
          ? (m.content.find((item: any) => item.type === 'text')?.text || '').trim()
          : '';
        if (uTxt) priorUnansweredTexts.unshift(uTxt);
      }
    }
    const combinedContextText =
      priorUnansweredTexts.length > 0
        ? [...priorUnansweredTexts, userCleanText].filter(Boolean).join('\n')
        : userCleanText;

    // 💡 만약 예시 질문(candidateGhost)이 전송된 것이라면 해당 예시 질문의 특성에 맞는 채널 자동 매핑 우선 확인
    let effectiveForcedChannels = forcedChannels;
    if (effectiveForcedChannels === undefined && !input.trim() && candidateGhost && userCleanText === candidateGhost.trim()) {
      const horiItem = HORI_PROMPT_LIBRARY.find((p) => p.title === userCleanText || p.body === userCleanText);
      if (horiItem && horiItem.tool_ids && horiItem.tool_ids.length > 0) {
        effectiveForcedChannels = horiItem.tool_ids.filter((t) => ALL_CHANNELS.includes(t as SpecialChannel)) as SpecialChannel[];
      } else {
        for (const [ch, pool] of Object.entries(CHANNEL_PROMPT_POOLS)) {
          if (pool.includes(userCleanText)) {
            effectiveForcedChannels = [ch as SpecialChannel];
            break;
          }
        }
        if (!effectiveForcedChannels && MASTER_PROMPT_POOL.includes(userCleanText)) {
          effectiveForcedChannels = ALL_CHANNELS;
        }
      }
    }

    let channels = effectiveForcedChannels !== undefined ? effectiveForcedChannels : activeChannels;
    if (isPlusMode || pro) {
      // 👑 Lucy + 마스터 모드 절대 원칙: 7대 채널 올인원 + 15대 운명학 도구 전원 총동원 고정
      channels = ALL_CHANNELS;
      setActiveChannels(ALL_CHANNELS);
      setAutoDetectedTitle('7대 채널 올인원 마스터');
    } else if (effectiveForcedChannels !== undefined) {
      channels = effectiveForcedChannels;
      setActiveChannels(effectiveForcedChannels);
      setAutoDetectedTitle(formatChannelsModeTitle(effectiveForcedChannels));
      presetModeRef.current = {
        text: userCleanText,
        channels: effectiveForcedChannels,
        title: formatChannelsModeTitle(effectiveForcedChannels),
      };
    } else if (isAutoDetect && forcedChannels === undefined && combinedContextText.length > 0) {
      const detected = detectPageChannels(combinedContextText);
      if (detected.isMaster) {
        channels = ALL_CHANNELS;
      } else {
        channels = detected.channels;
      }
      setActiveChannels(channels);
      setAutoDetectedTitle(detected.modeTitle);
    } else if (forcedChannels !== undefined) {
      channels = forcedChannels;
      setActiveChannels(forcedChannels);
      setAutoDetectedTitle(formatChannelsModeTitle(forcedChannels));
    }

    channels = (isPlusMode || pro) ? ALL_CHANNELS : resolveLucyPageChannels(channels, false);
    setActiveChannels(channels);
    setAutoDetectedTitle(formatChannelsModeTitle(channels));
    const channelCount = channels.length;
    const isMaster = isPlusMode || pro || (channelCount === ALL_CHANNELS.length && ALL_CHANNELS.every((c) => channels.includes(c)));
    const isCasual = !isMaster && channelCount === 0;
    const isSingle = !isMaster && channelCount === 1;
    const isSyn = !isMaster && channelCount >= 2;

    let targetPersona: PersonaType = 'lucy';
    let extraSystemContext: string | undefined = undefined;

    // 👥 활성화된 1인~4인 프로필 사주·점성술 데이터 및 다자간 궁합 가이드 주입 (현재 메인 상담 대상자 강조)
    const multiProfileContext = buildMultiProfileSystemContext(activeProfiles, activeProfileId, userDisplayName);
    if (multiProfileContext) {
      extraSystemContext = multiProfileContext;
    }
    const nicknameGuidance = `[사용자 호칭 절대 원칙]\n- 루시채팅에서 사용자를 부를 때는 본명이나 실명('박주형' 등)을 절대 부르지 말고, 반드시 사용자의 닉네임인 '${userDisplayName}'(으)로만 다정하게 불러줘. (예: '${userDisplayName}아', '${userDisplayName}야')`;
    extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${nicknameGuidance}` : nicknameGuidance;

    if (isCasual) {
      targetPersona = 'lucy';
    } else if (isSingle) {
      targetPersona = SPECIAL_CHANNELS[channels[0]].persona;
      const chCfg = THEME_PRIMARY_DIVINATION_TOOLS[channels[0]];
      const singleContext = `[${SPECIAL_CHANNELS[channels[0]].name} 전문 모드 — ${SPECIAL_CHANNELS[channels[0]].tagline}]
- ${chCfg ? `이 테마의 주력 운명학 도구: ${chCfg.fusionPhilosophy}` : `${SPECIAL_CHANNELS[channels[0]].name}의 전문적 통찰을 바탕으로 현실적 대안과 조언을 깊이 있게 설명해 줘.`}`;
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${singleContext}` : singleContext;
    } else if (isMaster) {
      const masterContext = `[루시플러스 통합 상담]
- 질문과 관련하여 실제 계산 데이터가 전달된 도구만 비교하고, 없는 계산을 실행했다고 말하지 마.
- 상징적 조언은 상징이라고 밝히고, 계산 실패·입력 부족은 정직하게 안내해. 엔진 개수로 정확성을 주장하지 마.`;
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${masterContext}` : masterContext;
      targetPersona = 'lucy';
    } else if (isSyn) {
      const channelNames = channels.map((c) => SPECIAL_CHANNELS[c]?.name || c).join(' + ');
      const themeFusions = channels
        .map((c) => THEME_PRIMARY_DIVINATION_TOOLS[c]?.fusionPhilosophy)
        .filter(Boolean)
        .join(' / ');
      const synContext = `[${channelCount}중 융합 시너지 모드: ${channelNames}]
- 융합된 테마별 주력 도구 시너지: ${themeFusions}
- 위 테마들과 질문 의도에 맞춰 가장 적합한 1~3개 핵심 운명학 도구를 교차 융합해 깊이 있고 유용한 시너지 답변을 도출해 줘.`;
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${synContext}` : synContext;
      targetPersona = 'lucy';
    }

    // 🔮 질문 의도와 활성 테마에 맞춰 운명학 도구 지침 주입 (일반/단일/시너지: 1~3개 핵심 선별, 마스터 모드: 15개 전원 총동원 비교 분석)
    const divinationSelection: SelectedDivinationToolsResult = isCasual
      ? { isCasualMessage: true, selectedTools: [], promptInjection: '', selectionReason: '가벼운 일상 인사', firedEngineBadges: [] }
      : selectOptimalDivinationTools(combinedContextText, isMaster ? ALL_CHANNELS : channels, counselingUserProfile, isMaster, { allowMaster: pro || isPlusMode });
    if (!divinationSelection.isCasualMessage && divinationSelection.promptInjection) {
      extraSystemContext = extraSystemContext
        ? `${extraSystemContext}\n\n${divinationSelection.promptInjection}`
        : divinationSelection.promptInjection;
    }

    // 🔮 타로 질문 의도 감지 시 실제 운명의 타로 카드를 즉시 드로우하여 루시 프롬프트에 주입 (이미지 비주얼 연동)
    const isTarotIntent = isLucyTarotDrawRequest(combinedContextText);
    let tarotCardMarkers: string | undefined;
    if (isTarotIntent) {
      const isThreeCards = /3장|세\s*장|쓰리카드|과거\s*현재\s*미래/i.test(combinedContextText);
      const drawnCards = drawLucyTarotCards(isThreeCards ? 3 : 1);
      const cardMarkers = drawnCards.map((c) => formatTarotMarker(c)).join(' ');
      tarotCardMarkers = cardMarkers;
      const tarotInstruction = buildLucyTarotReadingPrompt(drawnCards, userCleanText);
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${tarotInstruction}` : tarotInstruction;
    }
    const usedToolNames =
      !divinationSelection.isCasualMessage && divinationSelection.promptInjection
        ? (divinationSelection.firedEngineBadges || [])
        : [];

    setInput('');
    const imgToSend = attachedImage || undefined;
    setAttachedImage(null);
    stopTTS();

    if (isVoiceModeRef.current) {
      setVoiceState('thinking');
      voiceStateRef.current = 'thinking';
      stopRecognition();
    }

    // 🔊 사용자 액션(전송 클릭 또는 Enter 입력) 시 오디오 컨텍스트를 즉시 해제 및 프라이밍
    // 이를 통해 AI 응답 수신 후 브라우저 오디오 자동 재생 제한 없이 즉시 음성이 나옵니다.
    unlockAudioPlayback();
    primeTTSAudioElement();

    // 🌟 사용자 요청: 프로필이 바뀌면 내 기준이 아니라 그 사람 기준으로 상담 (counselingUserProfile 전달)
    await sendUnifiedMessage(userCleanText, targetPersona, imgToSend, {
      tarotCardMarkers,
      conversationId: 'lucy',
      isLucyPlus: isPlusMode,
      extraSystemContext,
      customUserProfile: counselingUserProfile,
      channels: isMaster ? ALL_CHANNELS : channels,
      mode: isMaster ? 'master' : (isCasual ? 'casual' : (isSingle ? channels[0] : 'synergy')),
      channel: isSingle ? channels[0] : undefined,
      usedTools: usedToolNames,
      calculationAudit: divinationSelection.calculationAudit || [],
      onFinish: async (fullText, _sentText, replyMsgId) => {
        if (!tarotCardMarkers && (isAutoTtsRef.current || isVoiceModeRef.current) && fullText && fullText.trim()) {
          void triggerAutoTts(fullText, replyMsgId);
        }
      }
    });
  }, [input, attachedImage, isLucyGenerating, lucyMessages, activeChannels, isAutoDetect, sendUnifiedMessage, activeProfiles, activeProfileId, counselingUserProfile, triggerAutoTts, activeGhostPrompt, dynamicGhostPrompts, stopRecognition, pro, isPlusMode]);

  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  const handleSelectPromptFromLibrary = useCallback((
    promptText: string, 
    sendImmediately: boolean,
    toolIds?: string[],
    _promptTitle?: string
  ) => {
    // 1. 도구 ID(toolIds)로부터 유효한 7대 채널 목록 추출
    let resolvedChannels: SpecialChannel[] = [];
    if (toolIds && toolIds.length > 0) {
      resolvedChannels = toolIds.filter((t) => ALL_CHANNELS.includes(t as SpecialChannel)) as SpecialChannel[];
    }
    if (resolvedChannels.length === 0) {
      const detected = detectPageChannels(promptText);
      resolvedChannels = detected.isMaster ? ALL_CHANNELS : detected.channels;
    }

    // 2. 일관된 모드 명칭 생성 (단일: '오렌지 (성찰)', 융합: '2중 융합 (오렌지 + 트리니티)')
    const modeTitle = formatChannelsModeTitle(resolvedChannels);

    // 3. 헤더 배지 및 활성 채널 상태 즉시 전환
    setActiveChannels(resolvedChannels);
    setAutoDetectedTitle(modeTitle);

    // 4. 프리셋 레퍼런스에 등록하여 250ms 디바운스 실시간 감지기가 임의로 덮어쓰지 못하도록 보존
    presetModeRef.current = {
      text: promptText,
      channels: resolvedChannels,
      title: modeTitle,
    };

    setInput(promptText);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 60);
  }, []);

  // 🎯 가로 스크롤 추천 질문 칩 클릭 시 해당 질문에 맞는 7대 채널 모드로 전환하고 채팅 입력란에만 입력 (즉시 전송 X)
  const handleSelectRecommendationChip = useCallback((promptText: string) => {
    const focusInputBox = (textToFill: string) => {
      setInput(textToFill);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 60);
    };

    // 1. HORI_PROMPT_LIBRARY 77선 라이브러리 항목 일치 확인
    const horiItem = HORI_PROMPT_LIBRARY.find((p) => p.title === promptText || p.body === promptText);
    if (horiItem && horiItem.tool_ids && horiItem.tool_ids.length > 0) {
      const validChannels = horiItem.tool_ids.filter((t) => ALL_CHANNELS.includes(t as SpecialChannel)) as SpecialChannel[];
      const modeTitle = formatChannelsModeTitle(validChannels);
      setActiveChannels(validChannels);
      setAutoDetectedTitle(modeTitle);
      presetModeRef.current = {
        text: horiItem.body,
        channels: validChannels,
        title: modeTitle,
      };
      focusInputBox(horiItem.body);
      return;
    }

    // 2. 단일 채널 전용 추천 풀 일치 확인
    for (const [ch, pool] of Object.entries(CHANNEL_PROMPT_POOLS)) {
      if (pool.includes(promptText)) {
        const targetChannels: SpecialChannel[] = [ch as SpecialChannel];
        const modeTitle = formatChannelsModeTitle(targetChannels);
        setActiveChannels(targetChannels);
        setAutoDetectedTitle(modeTitle);
        presetModeRef.current = {
          text: promptText,
          channels: targetChannels,
          title: modeTitle,
        };
        focusInputBox(promptText);
        return;
      }
    }

    // 3. 올인원 마스터 추천 풀 일치 확인
    if (MASTER_PROMPT_POOL.includes(promptText)) {
      const targetChannels = ALL_CHANNELS;
      const modeTitle = formatChannelsModeTitle(targetChannels);
      setActiveChannels(targetChannels);
      setAutoDetectedTitle(modeTitle);
      presetModeRef.current = {
        text: promptText,
        channels: targetChannels,
        title: modeTitle,
      };
      focusInputBox(promptText);
      return;
    }

    // 4. 일반/융합 질문 풀 및 텍스트 자동 감지 폴백
    const detected = detectPageChannels(promptText);
    const targetChannels = detected.isMaster ? ALL_CHANNELS : detected.channels;
    const modeTitle = detected.modeTitle || formatChannelsModeTitle(targetChannels);
    setActiveChannels(targetChannels);
    setAutoDetectedTitle(modeTitle);
    presetModeRef.current = {
      text: promptText,
      channels: targetChannels,
      title: modeTitle,
    };
    focusInputBox(promptText);
  }, []);

  // Handle pending channel and draft / auto-send input from other sub-apps (ReBible, Prism, etc.)
  useEffect(() => {
    try {
      const pending = safeSessionStorage.getItem('lucy_pro_pending_channel');
      let targetChannels: SpecialChannel[] | null = null;
      if (pending) {
        safeSessionStorage.removeItem('lucy_pro_pending_channel');
        targetChannels = parsePendingChannels(pending);
        setActiveChannels(targetChannels);
      }

      // 1. Explicit auto-send prompt from other sub-apps (e.g. 40가지 기법 질문, ReBible 묵상 등)
      const autoSendPrompt = sessionStorage.getItem('lucy_injected_auto_send');
      if (autoSendPrompt) {
        sessionStorage.removeItem('lucy_injected_auto_send');
        sessionStorage.removeItem('lucy_injected_input_draft');
        // Determine channels based on pending channel or fallback to Master Mode
        const finalChannels: SpecialChannel[] = targetChannels !== null
          ? targetChannels
          : ALL_CHANNELS;
        setActiveChannels(finalChannels);
        // Automatically start the conversation with reliable retry
        const runSend = (attempt = 0) => {
          if (handleSendRef.current) {
            handleSendRef.current(autoSendPrompt, finalChannels);
          } else if (attempt < 15) {
            setTimeout(() => runSend(attempt + 1), 100);
          }
        };
        setTimeout(() => runSend(0), 150);
        return;
      }

      const injectedDraft = sessionStorage.getItem('lucy_injected_input_draft');
      if (injectedDraft) {
        sessionStorage.removeItem('lucy_injected_input_draft');
        setInput(injectedDraft);
      }
    } catch (_) {}

    const handleDynamicInject = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail?.prompt) {
        const injectedChannels: SpecialChannel[] = detail.channel
          ? parsePendingChannels(detail.channel)
          : (detail.channels || ALL_CHANNELS);
        setActiveChannels(injectedChannels);
        setTimeout(() => {
          if (handleSendRef.current) {
            handleSendRef.current(detail.prompt, injectedChannels);
          }
        }, 150);
      }
    };

    window.addEventListener('lucy-inject-message', handleDynamicInject);
    return () => {
      window.removeEventListener('lucy-inject-message', handleDynamicInject);
    };
  }, []);

  useEffect(() => {
    if (!isLucyReady) return;
    const payload = takeChatForward(chatAccount, chatScope);
    if (payload) void handleSendRef.current(forwardedChatPrompt(payload), pro ? [...ALL_CHANNELS] : undefined);
  }, [chatAccount, chatScope, isLucyReady, pro]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleVoicePlay = async (id: string, text: string, _voice?: string) => {
    if (!isLucyTarotDrawOpen(lucyMessages.find(message => message.id === id)?.tarotDraw)) return;
    isUserScrolledUpRef.current = true; // 수동 음성 재생 클릭 시 하단 끌어당김 절대 차단
    unlockAudioPlayback();
    primeTTSAudioElement();
    const run = ++manualTtsRunRef.current;
    setTtsError('');
    lastAutoSpokenMsgIdRef.current = id;
    const clean = normalizeTextForSpeech(text);
    if (playingMsgId === id && (ttsInfo.isSpeaking || ttsInfo.isLoading)) {
      manualTtsActiveRef.current = false;
      stopTTS();
      setPlayingMsgId(null);
      return;
    }
    manualTtsActiveRef.current = true;
    stopTTS();
    try {
      // Starting a sequence emits an idle reset first. Assign its owner after that reset.
      const playback = playTTSInChunks(clean, _voice === 'Charon' ? 'Charon' : 'Aoede', 220, undefined, undefined, { skipCompletionChime: true, isChatMode: true });
      setPlayingMsgId(id);
      await playback;
    } catch (error) {
      if (manualTtsRunRef.current === run) setTtsError(error instanceof Error ? error.message : 'AI 음성을 재생하지 못했습니다. 다시 눌러 주세요.');
    } finally {
      if (manualTtsRunRef.current === run) {
        manualTtsActiveRef.current = false;
        setPlayingMsgId(null);
      }
    }
  };

  // Export full conversation as Markdown
  const handleExportChat = () => {
    if (lucyMessages.length === 0) {
      alert('내보낼 대화 내역이 없습니다.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('ko-KR');
    let md = '# Lucy 대화 기록\n- **대화 일시**: ' + todayStr + '\n- **사용자**: ' + userDisplayName + '\n\n---\n\n';

    lucyMessages.forEach((msg) => {
      const speaker = msg.role === 'user' ? userDisplayName : 'Lucy';
      const timeStr = new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      const rawTxt = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
      const txt = msg.role === 'user' ? cleanUserMessageDisplay(rawTxt) : cleanAssistantMessageDisplay(rawTxt);
      md += '### [' + speaker + '] (' + timeStr + ')\n' + txt + '\n\n---\n\n';
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '루시AI프로_대화기록_' + getLocalDateKey() + '.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isLucyReady) {
    return (
      <LucyAuraLoader
        fullScreen
        message="루시와 행운의 깊은 교감 조율 중..."
        subMessage="FOUR-LEAF CLOVER · FORTUNE & INTUITION"
      />
    );
  }

  return (
    <div
      className={`lucy-chat-shell ${isPlusMode ? 'is-plus-mode' : ''} lucy-night h-full min-h-0 flex-1 w-full max-w-[100vw] overflow-hidden overflow-x-hidden overscroll-x-none touch-pan-y flex flex-col font-sans select-text relative transition-colors duration-500`}
      style={{
        overflowX: 'hidden',
        maxWidth: '100vw',
        touchAction: 'pan-y',
      }}
    >
      {/* 🌌 Animated Cosmic Background: Night Sky Starlight (Lucy) <-> Clover Aura (Lucy +) */}
      <LucyCosmicBackground isPlusMode={isPlusMode} />
      {modeTransition && <LucyModeTransition target={modeTransition} />}

      {/* Mode Switch & Auto-TTS Toast */}
      <AnimatePresence>
        {(modeSwitchToast || autoTtsToast) && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full text-white shadow-2xl border flex items-center gap-2 font-sans text-xs sm:text-sm backdrop-blur-md font-bold max-w-[92vw] truncate pointer-events-none ${
              isPlusMode
                ? 'bg-emerald-950/90 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                : 'bg-slate-900/95 border-amber-400/40'
            }`}
          >
            <Sparkles size={14} className="text-amber-400 animate-spin shrink-0" />
            <span className="truncate">{autoTtsToast || modeSwitchToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRO Top Header Bar */}
      <header 
        style={{
          paddingTop: 'max(14px, calc(env(safe-area-inset-top, 0px) + 10px))',
          overflowX: 'hidden',
        }}
        className={`lucy-chat-header w-full max-w-full overflow-x-hidden px-3.5 sm:px-8 lg:px-12 pb-3 backdrop-blur-xl border-b shadow-xs flex flex-col gap-2.5 z-40 shrink-0 relative transition-colors duration-500 ${
          isPlusMode
            ? 'bg-slate-950/85 border-amber-500/30 text-white shadow-[0_4px_24px_rgba(245,158,11,0.1)]'
            : 'bg-slate-950/80 border-white/10 text-white'
        }`}
      >
        <div className="flex items-center justify-between gap-2 min-w-0 w-full max-w-full">
          {/* Brand logo stays within the current chat page. */}
          <div className="flex items-center min-w-0 flex-1 overflow-hidden">
            <div
              className="flex items-center gap-2 sm:gap-3 min-w-0 w-full group select-none"
            >
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                  <h1
                    className="text-base sm:text-xl font-black tracking-tight flex items-center gap-1.5 shrink-0 text-white"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isPlusMode;
                        setIsPlusMode(next);
                        if (next) {
                          safeLocalStorage.setItem('lucy_plus_active', 'true');
                          safeSessionStorage.setItem('lucy_plus_active', 'true');
                          triggerHaptic('whitehole');
                          setModeSwitchToast(`👑 Lucy + 진화! ${ALL_DCE_ENGINES.length}대 운명학 올인원 마스터 모드가 가동되었습니다`);
                        } else {
                          safeLocalStorage.removeItem('lucy_plus_active');
                          safeSessionStorage.removeItem('lucy_plus_active');
                          triggerHaptic('whitehole');
                          setModeSwitchToast('✨ 일반 Lucy 모드로 복귀했습니다');
                        }
                        setTimeout(() => setModeSwitchToast(null), 2200);
                      }}
                      title={isPlusMode ? '클릭 시 일반 Lucy 모드로 전환' : `클릭 시 ${ALL_DCE_ENGINES.length}대 도구 올인원 Lucy + 마스터로 진화`}
                      className="cursor-pointer flex items-center gap-1.5"
                    >
                      {isPlusMode ? (
                        <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-300 via-emerald-300 to-yellow-200 bg-clip-text text-transparent font-black tracking-wide drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                          Lucy +
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 font-black text-white">
                          Lucy
                        </span>
                      )}
                    </button>
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isPlusMode;
                      setIsPlusMode(next);
                      if (next) {
                        safeLocalStorage.setItem('lucy_plus_active', 'true');
                        safeSessionStorage.setItem('lucy_plus_active', 'true');
                        triggerHaptic('whitehole');
                        setModeSwitchToast(`👑 Lucy + 진화! ${ALL_DCE_ENGINES.length}대 운명학 올인원 마스터 모드가 가동되었습니다`);
                      } else {
                        safeLocalStorage.removeItem('lucy_plus_active');
                        safeSessionStorage.removeItem('lucy_plus_active');
                        triggerHaptic('whitehole');
                        setModeSwitchToast('✨ 일반 Lucy 모드로 복귀했습니다');
                      }
                      setTimeout(() => setModeSwitchToast(null), 2200);
                    }}
                    className={`lucy-mode-badge ${(isPlusMode || pro) ? 'is-master' : ''} cursor-pointer hover:opacity-85 transition-opacity shrink-0`}
                    title="클릭 시 마스터 모드 토글"
                  >
                    {(isPlusMode || pro) ? '마스터 모드' : 'AI 모드'}
                  </button>
                  {(isPlusMode || pro) && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('whitehole');
                        setModeSwitchToast(`👑 총 ${ALL_DCE_ENGINES.length}대 운명학·결정론 엔진 도구 풀가동 중`);
                        setTimeout(() => setModeSwitchToast(null), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 h-[20px] px-2 rounded-[6px] text-[10px] font-bold tracking-tight bg-amber-500/15 text-amber-300 border border-amber-400/30 whitespace-nowrap shrink-0 hover:bg-amber-500/25 transition-colors cursor-pointer select-none"
                      title={`총 ${ALL_DCE_ENGINES.length}대 운명학·결정론 엔진 도구 가동 중`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      엔진 도구 {ALL_DCE_ENGINES.length}개
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Tools: 검색 · 자동 읽기 · 내보내기 */}
          <div className="lucy-header-actions flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. 검색 (Search Toggle) */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                isSearchOpen
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40'
                  : isLight
                  ? 'bg-amber-50/80 hover:bg-amber-100/80 text-slate-600 border border-amber-900/10'
                  : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
              }`}
              title="대화 내역 검색"
              aria-label="대화 검색"
            >
              <Search size={16} />
            </button>


            {/* 🔊 루시 답변 자동 음성 읽기 (Auto-TTS 바로재생 토글 버튼: 한 번 더 누르면 즉시 끄기) */}
            <button
              type="button"
              data-auto-tts-toggle="true"
              onClick={toggleAutoTts}
              className={`px-2.5 py-1.5 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 flex items-center gap-1 text-[11px] font-bold ${
                isAutoTts
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-100/80 dark:from-emerald-950/80 dark:to-teal-900/70 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40 shadow-2xs'
                  : isLight
                  ? 'bg-amber-50/80 text-slate-500 hover:text-slate-700 border border-amber-900/10'
                  : 'bg-white/10 text-white/85 hover:text-white border border-white/15'
              }`}
              title={isAutoTts ? '자동읽기 ON - 한 번 더 누르면 즉시 꺼집니다' : '자동읽기 OFF - 누르면 켜집니다'}
              aria-pressed={isAutoTts}
              aria-label={isAutoTts ? '자동읽기 켜짐 (눌러서 끄기)' : '자동읽기 꺼짐 (눌러서 켜기)'}
            >
              {isAutoTts ? (
                <>
                  <Volume2 size={15} className="text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0" />
                  <span className="hidden xs:inline">자동읽기 ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={15} className={isLight ? 'text-slate-400 shrink-0' : 'text-white/75 shrink-0'} />
                  <span className="hidden xs:inline">자동읽기 OFF</span>
                </>
              )}
            </button>

            {/*  Export Chat */}
            {lucyMessages.length > 0 && (
              <button
                onClick={handleExportChat}
                className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer hidden xs:flex items-center justify-center border ${
                  isLight
                    ? 'bg-amber-50/80 hover:bg-amber-100/80 text-slate-600 border-amber-900/10'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                }`}
                title="대화 내역 Markdown으로 내보내기"
                aria-label="대화 내보내기"
              >
                <Download size={15} />
              </button>
            )}

            {/* 로그인 버튼 (비로그인 상태일 때만 표시) */}
            {!firebaseUser && (
              <button
                onClick={() => signInWithGoogle()}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-amber-50/90 hover:bg-amber-100 border-amber-900/15 text-slate-700'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
              >
                로그인
              </button>
            )}
          </div>
        </div>

        {/*  Search Input Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 focus-within:border-amber-400 transition-all ${
                isLight ? 'bg-[#fffdf9]/90 border-amber-900/20' : 'bg-slate-900/90 border-white/15'
              }`}>
                <Search size={14} className={isLight ? 'text-slate-400 shrink-0' : 'text-white/70 shrink-0'} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="대화 내용 검색 (키워드 입력)..."
                  className={`flex-1 bg-transparent text-xs sm:text-sm outline-none ${
                    isLight ? 'text-slate-800 placeholder-slate-400' : 'text-white placeholder-white/60'
                  }`}
                  style={{ color: isLight ? '#1e293b' : '#ffffff' }}
                  autoFocus
                />
                {searchQuery && (
                  <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-1.5 py-0.5 rounded">
                    {filteredMessages.length}개 발견
                  </span>
                )}
                <button 
                  onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 📱 메인 본문 너비 기준 듀얼 뷰: 펼침 시 2-Column 마스터 코스믹 룸, 접힘 시 단일 열 뷰 */}
      <div className={`flex-1 min-h-0 flex w-full max-w-full overflow-hidden ${
        isDuoUnfolded ? 'flex-row' : 'flex-col'
      }`}>
        {isDuoUnfolded && (
          <aside className="w-1/2 min-w-[340px] max-w-[50%] h-full shrink-0 flex flex-col overflow-hidden border-r border-white/10 z-10">
            <DuoCosmicAmbientRoom isLight={isLight} />
          </aside>
        )}

        <div className={`h-full flex flex-col min-w-0 overflow-hidden relative ${
          isDuoUnfolded ? 'w-1/2 flex-1' : 'w-full flex-1'
        }`}>
          {/* Chat Messages Stream */}
          <main
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{ overflowX: 'hidden', touchAction: 'pan-y' }}
        className="prism-page-content lucy-chat-main min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-x-none touch-pan-y p-3 sm:p-5 lg:p-6 w-full mx-auto min-w-0 select-text"
      >
        <div ref={messagesWrapperRef} className="space-y-3 sm:space-y-4 pb-3 sm:pb-4 w-full max-w-full min-w-0 overflow-x-hidden">
          {filteredMessages.length === 0 && searchQuery.trim().length > 0 && (
            <div className="text-center py-12 px-4">
              <p className="text-xs sm:text-sm text-slate-500">
                검색 결과가 없습니다.
              </p>
            </div>
          )}

          {filteredMessages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const msgId = String(msg.id || index);
            const rawContent = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
            const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '';
            const hasImage = Array.isArray(msg.content) && msg.content.some((item: any) => item.type === 'image_url');
            const imageUrl = hasImage ? (msg.content as any[]).find((item: any) => item.type === 'image_url')?.image_url?.url : null;
            const rawTextContent = Array.isArray(msg.content) ? (msg.content as any[]).find((item: any) => item.type === 'text')?.text || '' : rawContent;
            const textContent = isUser
              ? cleanUserMessageDisplay(rawTextContent)
              : cleanAssistantMessageDisplay(rawTextContent, true);
            if (!isUser && !textContent.trim() && !imageUrl) {
              return null;
            }
            const msgModeInfo = resolveMessageModeAndChannels(msg, filteredMessages, index);

            // 루시의 인사말인지 여부 정밀 판별
            const isGreeting = (() => {
              if (isUser) return false;
              if (msgId === 'greet' || msgId === 'greet-main' || msgId.startsWith('greet-') || msgId.toLowerCase().includes('greet')) {
                return true;
              }
              const prevUser = filteredMessages.slice(0, index).reverse().find((m: any) => m.role === 'user');
              if (!prevUser) {
                return true;
              }
              const cleanText = textContent.trim();
              if (
                cleanText.includes("통합 AI 마스터 가이드 '루시'야") ||
                cleanText.includes('반가워! 나는 루시야') ||
                cleanText.includes('오늘도 새로운 하루가 시작되었어') ||
                cleanText.includes('지난 대화들의 소중한 이야기들도 내 마음에 다 간직하고 있으니') ||
                cleanText.includes('영혼 여정을 함께하는') ||
                cleanText.includes('수다 떨 준비되어 있어') ||
                cleanText.includes('나랑 가볍게 수다 떨자') ||
                cleanText.includes('언제든 친구처럼 다정하게 수다')
              ) {
                return true;
              }
              const userText = (typeof prevUser.content === 'string'
                ? prevUser.content
                : Array.isArray(prevUser.content)
                ? prevUser.content.find((item: any) => item.type === 'text')?.text || ''
                : '').trim();
              if (!userText) {
                return true;
              }
              const isSimpleGreetingQuery = /^(안녕|안녕하세요|안뇽|하이|hi|hello|좋은\s*아침|좋은\s*하루|반가워|반갑습니다|루시\s*안녕|루시야\s*안녕|안녕\s*루시)[!~.\s]*$/i.test(userText);
              if (isSimpleGreetingQuery && cleanText.length < 160) {
                return true;
              }
              return false;
            })();

            return (
              <motion.div
                key={msgId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col w-full max-w-full min-w-0 overflow-x-hidden ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Speaker label, passive mode badge and timestamp */}
                <div className="flex items-center gap-1.5 mb-1.5 px-1 text-[11px] flex-wrap max-w-full min-w-0">
                  {!isUser ? (
                    <span
                      className={`font-bold flex items-center gap-1 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}
                      style={{ color: isLight ? '#92400e' : '#fcd34d' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                      Lucy
                    </span>
                  ) : (
                    <span
                      className={`font-bold flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-white'}`}
                      style={{ color: isLight ? '#475569' : '#ffffff' }}
                    >
                      <User size={12} className={isLight ? 'text-slate-400' : 'text-white/80'} />
                      {userDisplayName}
                    </span>
                  )}

                  <span data-message-mode-badge="true"
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${msgModeInfo.badgeColor}`}>
                    <span aria-hidden="true">{msgModeInfo.badgeIcon}</span>
                    <span>{msgModeInfo.badgeLabel}</span>
                  </span>

                  {!isUser && !isGreeting && Array.isArray(msg.calculationAudit) && (() => {
                    const tools = [...new Map(msg.calculationAudit
                      .filter(item => ['calculated', 'symbolic'].includes(item.status) && item.sentToModel)
                      .map(item => [item.toolId, item.status === 'symbolic' ? `${item.name} (상징)` : item.name])).values()];
                    if (!tools.length) return null;
                    return <CalculationAuditToolList tools={tools} />;
                  })()}

                  <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-white/70'}`}>{timeStr}</span>
                </div>

                <div className="relative group max-w-[92%] sm:max-w-[85%] lg:max-w-[80%] min-w-0">
                  {/* Attached Image Preview (in User Message or Lucy's Card Deep Insight Reply) */}
                  {(() => {
                    const cardImageToDisplay = isUser ? imageUrl : (imageUrl || null);
                    if (!cardImageToDisplay) return null;
                    return (
                      <div className="mb-2 overflow-hidden rounded-2xl border border-amber-900/15 dark:border-white/15 shadow-sm max-w-xs bg-[#fffdf9] dark:bg-slate-900 min-h-[100px]">
                        <img 
                          src={cardImageToDisplay} 
                          alt="첨부 이미지" 
                          loading="lazy"
                          className="w-full h-auto object-cover max-h-64 rounded-2xl" 
                        />
                      </div>
                    );
                  })()}

                  {/* Message Bubble(s) */}
                  {isUser ? (
                    <>
                      <ChatBubbleForward text={textContent} targetLabel={pro ? '일반 루시' : '루시 프로'} onForward={forwardBubble}>
                      <div
                        data-forward-bubble
                        className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-sm sm:text-[15px] lg:text-base leading-relaxed select-text min-w-0 max-w-full overflow-x-hidden break-words [overflow-wrap:anywhere] transition-colors duration-300 ${
                          isLight
                            ? 'lucy-user-bubble bg-amber-100 border border-amber-300 text-slate-900 rounded-tr-xs font-sans shadow-xs'
                            : 'lucy-starlight-user bg-indigo-600/90 border border-indigo-400/30 text-white rounded-tr-xs font-sans shadow-sm'
                        }`}
                        style={{
                          backgroundColor: useWhiteTheme ? '#f1f5f9' : isLight ? '#fef3c7' : undefined,
                          color: isLight ? '#0f172a' : '#ffffff',
                        }}
                      >
                        <div
                          className={`whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}
                          style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                        >
                          {textContent}
                        </div>
                      </div>

                      {/* User Action buttons: Copy & TTS */}
                      </ChatBubbleForward>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap justify-end pr-1">
                        <button
                          onClick={() => handleCopy(msgId, textContent)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isLight
                              ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              : 'text-white/65 hover:text-white hover:bg-white/10'
                          }`}
                          title="복사"
                        >
                          {copiedId === msgId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => handleVoicePlay(msgId, textContent, 'Charon')}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            playingMsgId === msgId && (ttsInfo.isSpeaking || ttsInfo.isLoading)
                              ? 'text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60'
                              : isLight
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
                              : 'text-white/65 hover:text-amber-300 hover:bg-white/10'
                          }`}
                          title={
                            playingMsgId === msgId && ttsInfo.isLoading
                              ? '음성 준비 중...'
                              : playingMsgId === msgId && ttsInfo.isSpeaking
                              ? '음성 멈추기'
                              : '음성으로 듣기'
                          }
                        >
                          {playingMsgId === msgId && ttsInfo.isLoading ? (
                            <Loader2 size={14} className="animate-spin text-amber-600" />
                          ) : playingMsgId === msgId && ttsInfo.isSpeaking ? (
                            <VolumeX size={14} className="animate-pulse" />
                          ) : (
                            <Volume2 size={14} />
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <LucyKakaoBubbleGroup
                        onForward={forwardBubble}
                      forwardTargetLabel={pro ? '일반 루시' : '루시 프로'}
                      msgId={msgId}
                      verifiedTarotMarkers={msg.tarotDraw?.source === 'app-random' ? msg.tarotDraw.markers : undefined}
                      revealedTarotCardIds={msg.tarotDraw?.revealedCardIds}
                      onRevealTarotCard={cardId => revealLucyTarotCard(msgId, cardId, pro ? 'lucy-pro' : 'lucy')}
                      textContent={textContent}
                      isLatest={index === filteredMessages.length - 1}
                      isGenerating={isLucyGenerating && index === filteredMessages.length - 1}
                      isHistorical={
                        isGreeting ||
                        index < filteredMessages.length - 1 ||
                        Boolean(msg.timestamp && msg.timestamp < pageMountedAtRef.current - 2000)
                      }
                      isLight={isLight}
                      variant="standalone"
                      theme={useWhiteTheme ? 'default' : 'starlight'}
                      playingMsgId={playingMsgId}
                      ttsInfo={ttsInfo}
                      copiedId={copiedId}
                      onCopy={handleCopy}
                      onVoicePlay={handleVoicePlay}
                      renderRecommendationFooter={() => {
                        if (isLucyGenerating && index === filteredMessages.length - 1) return null;
                        if (!textContent || textContent.trim().length <= 10) return null;
                        if (msgModeInfo.isCasual) return null;
                        if (isGreeting) return null;

                        const prevUser = filteredMessages.slice(0, index).reverse().find((m: any) => m.role === 'user');
                        const prevUserQuery = prevUser
                          ? typeof prevUser.content === 'string'
                            ? prevUser.content
                            : Array.isArray(prevUser.content)
                            ? prevUser.content.find((item: any) => item.type === 'text')?.text || ''
                            : ''
                          : '';

                        return (
                          <div className="mt-2.5">
                            <LucyResponseRecommendation
                              userQuery={prevUserQuery}
                              lucyAnswer={textContent}
                              currentChannels={activeChannels}
                              isCasual={msgModeInfo.isCasual}
                              isGreeting={isGreeting}
                              onSwitchChannel={(channels, isMaster, label) => handleActivateMessageMode(channels, isMaster, label)}
                              onNavigate={(path) => navigate(path)}
                            />
                          </div>
                        );
                      }}
                    />
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}

          {isLucyGenerating && (
            <div className={`flex items-center gap-2.5 p-3.5 border rounded-2xl w-fit shadow-xs animate-pulse ${
              isLight
                ? 'bg-[#fffdf9]/95 border-emerald-200/80 text-emerald-950'
                : 'bg-slate-900/90 border-emerald-500/30 text-white'
            }`}>
              <span className="text-base select-none animate-bounce">🍀</span>
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200" />
              </div>
              <span
                className={`text-xs sm:text-sm font-bold ml-1 ${isLight ? 'text-emerald-950' : 'text-white'}`}
                style={{ color: isLight ? '#022c22' : '#ffffff' }}
              >
                Lucy가 답변을 작성하고 있습니다...
              </span>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* ⌨️ Bottom Input Bar: Image Preview + STT Mic + Multi-Modal Vision + Send */}
      <footer 
        ref={chatFooterRef}
        style={{
          paddingBottom: 'max(0.25rem, var(--sab, 0px))',
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.96)' : undefined,
          color: isLight ? '#1e293b' : '#ffffff',
          overflowX: 'hidden',
        }}
        className={`lucy-chat-footer w-full max-w-full overflow-x-hidden px-2 sm:px-4 pt-1 pb-1 sm:pt-1.5 sm:pb-1.5 backdrop-blur-xl border-t shadow-xs shrink-0 z-40 relative transition-colors duration-300 ${
          isLight
            ? 'bg-white/95 border-amber-200/80 text-slate-800 shadow-[0_-2px_12px_rgba(180,140,90,0.06)]'
            : 'bg-slate-950/88 border-white/10 text-white'
        }`}
      >
        <div className="lucy-input-stack w-full min-w-0 max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col gap-0.5 sm:gap-1 overflow-x-hidden">
          {/* Image Attachment Preview */}
          {attachedImage && (
            <div className="flex items-center gap-1.5 bg-amber-50/90 dark:bg-slate-900 p-1 rounded-xl w-fit border border-amber-200 dark:border-white/15">
              <img src={attachedImage} alt="첨부 미리보기" className="w-8 h-8 object-cover rounded-lg" />
              <div className={`text-[11px] font-medium pr-1.5 ${isLight ? 'text-slate-600' : 'text-white'}`}>이미지 비전 준비됨</div>
              <button 
                onClick={() => setAttachedImage(null)}
                className="p-0.5 rounded-full hover:bg-amber-200/60 dark:hover:bg-white/10 text-slate-500 dark:text-white/80 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Live Auto-Detect Indicator Badge */}
          <AnimatePresence>
            {isAutoDetect && autoDetectedTitle && input.trim().length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-1 px-2 py-0.2 bg-violet-50 dark:bg-violet-950/70 border border-violet-200/90 dark:border-violet-500/30 text-violet-900 dark:text-white rounded-full text-[9px] sm:text-[10px] font-semibold w-fit shadow-2xs"
              >
                <Sparkles size={10} className="text-violet-600 dark:text-violet-300 animate-spin" />
                <span>AI 감지:</span>
                <span className="font-bold text-violet-950 dark:text-white underline decoration-violet-300">{autoDetectedTitle}</span>
                <span className="text-[8px] sm:text-[9px] text-violet-600 dark:text-violet-100 bg-violet-100/80 dark:bg-violet-900/60 px-1 py-0.1 rounded-full font-medium">자동 전환</span>
              </motion.div>
            )}
          </AnimatePresence>

          {ttsError && <div role="alert" className="flex items-center justify-between gap-2 rounded-lg border border-amber-400/40 bg-amber-100 px-3 py-2 text-xs text-amber-950">
            <span>{ttsError}</span>
            <button type="button" aria-label="음성 오류 안내 닫기" onClick={() => setTtsError('')}>닫기</button>
          </div>}

          {/* 🔊 실시간 루시 음성 재생 바 (현재 말하는 중일 때 즉시 멈춤 지원) */}
          <AnimatePresence>
            {(ttsInfo.isSpeaking || ttsInfo.isLoading) && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="lucy-voice-status flex items-center justify-between px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-300/80 dark:border-amber-500/40 rounded-lg sm:rounded-xl text-[10px] sm:text-xs text-amber-950 dark:text-white shadow-xs"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {ttsInfo.isLoading ? (
                    <Loader2 size={11} className="animate-spin text-amber-600 dark:text-amber-400 shrink-0" />
                  ) : (
                    <Volume2 size={11} className="text-amber-600 dark:text-amber-400 animate-pulse shrink-0" />
                  )}
                  <span className={`font-bold text-[10px] sm:text-[11px] shrink-0 ${isLight ? 'text-amber-950' : 'text-white'}`}>
                    {ttsInfo.isLoading ? '루시 음성 준비 중...' : '루시 음성 안내 중'}
                  </span>
                  {ttsInfo.activeText && ttsInfo.activeText !== '__CONVERSATION__' && (
                    <span className={`text-[9px] sm:text-[10px] truncate max-w-[170px] sm:max-w-[340px] ${isLight ? 'text-amber-900/70' : 'text-white/85'}`}>
                      "{ttsInfo.activeText.slice(0, 30)}..."
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    stopTTS();
                    setPlayingMsgId(null);
                  }}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-bold text-[9px] cursor-pointer active:scale-95 transition-all shadow-2xs shrink-0 ml-1.5"
                  title="음성 즉시 중지"
                >
                  <Square size={8} className="fill-current" />
                  <span>중지</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🎙️ 루시 1:1 전용 실시간 음성 대화 모드 패널 (Voice Mode Active Panel) */}
          <AnimatePresence>
            {isVoiceMode && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                className={`p-2.5 sm:p-3 rounded-2xl border backdrop-blur-xl transition-all shadow-md my-0.5 ${
                  isLight
                    ? 'bg-gradient-to-r from-amber-50/95 via-yellow-50/90 to-amber-50/95 border-amber-300/80 text-slate-800 shadow-[0_2px_12px_rgba(251,191,36,0.15)]'
                    : 'bg-gradient-to-r from-slate-900/95 via-amber-950/40 to-slate-900/95 border-amber-400/40 text-white shadow-[0_2px_16px_rgba(0,0,0,0.5)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {voiceState === 'listening' ? (
                      <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-300">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/40 animate-pulse shrink-0">
                          <Mic size={13} className="text-cyan-600 dark:text-cyan-300" />
                        </div>
                        <div className="flex items-center gap-0.5 h-3 px-0.5 shrink-0">
                          <span className="w-1 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
                          <span className="w-1 h-3.5 bg-cyan-300 rounded-full animate-pulse" />
                          <span className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        </div>
                        <span className="text-xs font-bold truncate">
                          루시가 듣고 있어요... 편하게 말씀하세요
                        </span>
                      </div>
                    ) : voiceState === 'thinking' ? (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40 shrink-0">
                          <Loader2 size={13} className="animate-spin text-amber-600 dark:text-amber-300" />
                        </div>
                        <span className="text-xs font-bold truncate animate-pulse">
                          루시가 생각을 정리하고 있어요...
                        </span>
                      </div>
                    ) : voiceState === 'speaking' ? (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40 animate-pulse shrink-0">
                          <Volume2 size={13} className="text-amber-600 dark:text-amber-300 animate-pulse" />
                        </div>
                        <span className="text-xs font-bold truncate">
                          루시가 다정하게 답변 중이에요
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-300">
                        <Mic size={14} className="text-slate-400 shrink-0" />
                        <span className="text-xs font-medium truncate">1:1 음성 대화 준비됨</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* 루시 말 끊기 (인터럽트) 버튼 */}
                    {voiceState === 'speaking' && (
                      <button
                        type="button"
                        onClick={handleInterruptLucy}
                        className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] cursor-pointer active:scale-95 transition-all shadow-xs flex items-center gap-1"
                        title="루시 말 끊고 바로 질문하기"
                      >
                        <Square size={8} className="fill-current" />
                        <span>말끊기</span>
                      </button>
                    )}

                    {/* 음소거 토글 */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextMuted = !isVoiceMutedRef.current;
                        setIsVoiceMuted(nextMuted);
                        isVoiceMutedRef.current = nextMuted;
                        if (nextMuted) {
                          stopRecognition();
                          voiceStateRef.current = 'idle';
                          speechTranscriptRef.current = '';
                          setSpeechTranscript('');
                          setSpeechInterim('');
                          setVoiceState('idle');
                        } else {
                          setVoiceState('listening');
                          startListening();
                        }
                      }}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isVoiceMuted
                          ? 'bg-rose-500/20 text-rose-400 border-rose-400/40'
                          : isLight
                          ? 'bg-white/80 hover:bg-amber-100 text-slate-600 border-amber-200'
                          : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/15'
                      }`}
                      title={isVoiceMuted ? '마이크 음소거 해제' : '마이크 임시 음소거'}
                    >
                      {isVoiceMuted ? <MicOff size={12} /> : <Mic size={12} />}
                    </button>

                    {/* 음성 모드 종료 버튼 */}
                    <button
                      type="button"
                      onClick={handleToggleVoiceMode}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 cursor-pointer"
                      title="음성 모드 끄기 (텍스트 모드로 복귀)"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                {/* 실시간 음성 인식 텍스트 표시 영역 */}
                {(speechTranscript || speechInterim) && (
                  <div className="mt-1.5 px-2.5 py-1.5 rounded-xl bg-white/70 dark:bg-white/5 border border-amber-400/30 text-xs flex items-center justify-between gap-2">
                    <span className="truncate text-slate-700 dark:text-amber-100/90 font-medium">
                      "{speechTranscript || speechInterim}"
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const textToSend = (speechTranscript || speechInterim).trim();
                        if (textToSend) {
                          void handleSend(textToSend);
                          setSpeechTranscript('');
                          setSpeechInterim('');
                        }
                      }}
                      className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-[10px] shrink-0 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      지금 전송
                    </button>
                  </div>
                )}

                {/* 마이크 에러 알림 */}
                {voiceError && (
                  <div className="mt-1 px-2 py-1 rounded-lg bg-rose-500/15 border border-rose-400/30 text-[11px] text-rose-300 flex items-center justify-between">
                    <span>{voiceError}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setVoiceError(null);
                        startListening();
                      }}
                      className="text-[10px] font-bold underline ml-2 cursor-pointer"
                    >
                      다시 시도
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 👥 대화창 상담 대상자 프로필 독 바 (2인 이상 궁합/시너지 모드 시 항시 표시) */}
          {activeProfiles.length > 1 && (
            <ChatProfileDock
              profiles={activeProfiles}
              activeProfileId={activeProfileId}
              onSelectProfile={handleSelectActiveProfile}
              onAddClick={handleOpenAddChatProfile}
              onEditProfile={handleOpenEditChatProfile}
              onRemoveProfile={handleRemoveChatProfile}
              maxProfiles={4}
            />
          )}

          {/* 💡 추천 질문 가로 나열 바 & 추천질문 라이브러리 버튼 (+ 1인 모드 시 슬림 프로필 칩 통합) */}
          <div className="lucy-suggestion-toolbar w-full flex items-center gap-1 sm:gap-1.5 py-0 overflow-x-auto no-scrollbar scroll-smooth">
            {/* 1인 점괘 모드일 때: 별도 세로줄을 차지하지 않고 한 줄에 초슬림하게 통합 */}
            {activeProfiles.length <= 1 && (
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (activeProfiles[0]) {
                      handleOpenEditChatProfile(activeProfiles[0]);
                    } else {
                      handleOpenAddChatProfile();
                    }
                  }}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-full border text-[9px] sm:text-[10px] font-bold transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-0.5 shadow-2xs ${
                    isLight
                      ? 'bg-amber-50/90 hover:bg-amber-100 border-amber-300/80 text-amber-900'
                      : 'bg-amber-950/60 hover:bg-amber-900/60 border-amber-500/40 text-white'
                  }`}
                  style={{ color: isLight ? '#78350f' : '#ffffff' }}
                  title="내 사주 프로필 수정"
                >
                  <User size={9} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="truncate max-w-[42px] sm:max-w-[70px]">
                    {activeProfiles[0]?.isMe ? userDisplayName : (activeProfiles[0]?.name || userDisplayName)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddChatProfile}
                  className={`px-1 sm:px-1.5 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-medium transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-0.5 shadow-2xs ${
                    isLight
                      ? 'bg-[#fffdf9] hover:bg-amber-50 border-amber-900/15 hover:border-amber-300 text-slate-600 hover:text-amber-800'
                      : 'bg-slate-900 hover:bg-slate-800 border-white/15 hover:border-amber-400/50 text-white'
                  }`}
                  style={{ color: isLight ? '#475569' : '#ffffff' }}
                  title="궁합/상담 대상자 추가"
                >
                  <Plus size={8} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="hidden xs:inline">궁합</span>
                </button>
              </div>
            )}

            {/* ✨ 추천질문 전체보기 모달 트리거 아이콘 버튼 */}
            <button
              id="lucy-open-prompt-library-btn"
              type="button"
              onClick={() => setIsPromptLibraryOpen(true)}
              className={`p-1 sm:p-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 hover:from-amber-500/25 hover:to-yellow-500/30 border border-amber-400/80 dark:border-amber-500/60 transition-all shrink-0 cursor-pointer active:scale-95 flex items-center justify-center shadow-2xs group ${
                isLight ? 'text-amber-900' : 'text-white'
              }`}
              style={{ color: isLight ? '#78350f' : '#ffffff' }}
              title="사주·타로·점성술·자미두수 추천질문 전체보기"
              aria-label="추천질문 라이브러리 열기"
            >
              <Sparkles size={10} className="sm:w-3 sm:h-3 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            </button>

            {/* 새로고침 셔플 버튼 */}
            <button
              type="button"
              onClick={refreshPrompts}
              className={`p-1 sm:p-1.5 rounded-lg border transition-all shrink-0 cursor-pointer active:scale-90 flex items-center gap-1 shadow-2xs ${
                isLight
                  ? 'text-amber-600 hover:text-amber-800 bg-[#fffdf9] hover:bg-amber-50 border-amber-200/80'
                  : 'text-amber-400 hover:text-amber-300 bg-slate-900 hover:bg-slate-800 border-amber-500/30'
              }`}
              title="새로운 맞춤 추천 질문으로 변경 (랜덤 셔플)"
              aria-label="추천 질문 새로고침"
            >
              <RefreshCw size={9} className={`sm:w-2.5 sm:h-2.5 text-amber-600 dark:text-amber-400 ${isLucyGenerating ? 'animate-spin' : ''}`} />
            </button>

            {/* 가로 스크롤 추천 질문 리스트 */}
            {currentPrompts.length > 0 && (
              <div className="flex-1 min-w-0 flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
                {currentPrompts.map((promptText) => (
                  <button
                    key={promptText}
                    type="button"
                    onClick={() => handleSelectRecommendationChip(promptText)}
                    disabled={isLucyGenerating}
                    className={`shrink-0 px-2 sm:px-2.5 py-0.5 rounded-full border text-[9px] sm:text-[11px] font-medium transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-40 whitespace-nowrap ${
                      isLight
                        ? 'bg-[#fffdf9]/90 hover:bg-amber-50 border-amber-200/80 hover:border-amber-300 text-slate-800 hover:text-amber-950'
                        : 'bg-slate-900/90 hover:bg-slate-800 border-white/20 hover:border-amber-400/50 text-white hover:text-amber-200'
                    }`}
                    style={{ color: isLight ? '#1e293b' : '#ffffff' }}
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 💬 Input Container */}
          <div
            style={{ backgroundColor: isLight ? '#ffffff' : undefined }}
            onClick={(e) => {
              if (e.target !== fileInputRef.current && !(e.target as HTMLElement)?.closest('button')) {
                textareaRef.current?.focus();
              }
            }}
            className={`lucy-starlight-composer cursor-text flex items-center gap-1 sm:gap-2 border focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/20 rounded-xl sm:rounded-2xl px-1.5 sm:px-3 py-0.5 min-h-[30px] sm:min-h-[38px] transition-all shadow-2xs ${
              isLight
                ? 'bg-white border-amber-300/70'
                : 'bg-slate-900/90 border-white/15'
            }`}
          >
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
              accept="image/*" 
              className="hidden" 
            />

            {/* 📷 Image / Camera Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-0.5 sm:p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                isLight
                  ? 'text-slate-400 hover:text-amber-700 hover:bg-amber-50'
                  : 'text-white/75 hover:text-amber-300 hover:bg-white/10'
              }`}
              title="사진/이미지 첨부"
              aria-label="사진 첨부"
            >
              <Camera size={14} className="sm:w-4 sm:h-4" />
            </button>

            {/* 🎙️ Voice Mode / STT Microphone Button */}
            <button
              type="button"
              onClick={handleToggleVoiceMode}
              className={`p-0.5 sm:p-1.5 rounded-md transition-all cursor-pointer shrink-0 ${
                isVoiceMode
                  ? 'text-amber-500 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/80 border border-amber-400 dark:border-amber-500/50 shadow-2xs animate-pulse ring-1 ring-amber-400/50'
                  : isLight
                  ? 'text-slate-400 hover:text-amber-700 hover:bg-amber-50'
                  : 'text-white/75 hover:text-amber-300 hover:bg-white/10'
              }`}
              title={isVoiceMode ? '루시 음성 모드 켜짐 (클릭 시 끄기)' : '루시 1:1 음성 모드 켜기 (마이크 실시간 대화)'}
              aria-label={isVoiceMode ? '음성 모드 켜짐' : '음성 모드 켜기'}
            >
              <Mic size={14} className={`sm:w-4 sm:h-4 ${isVoiceMode ? 'text-amber-500 dark:text-amber-300 animate-pulse' : ''}`} />
            </button>

            {/* Textarea Wrapper for Ghost Typewriter Overlay */}
            <div className="relative flex-1 min-h-[22px] sm:min-h-[28px] flex items-center">
              {/* 옅은색 동적 예시 고민 타이프라이터 플레이스홀더 (호리 스타일) */}
              <DynamicGhostInputPlaceholder
                prompts={dynamicGhostPrompts}
                isVisible={!input && !isLucyGenerating && !isInputFocused}
                pauseDuration={12000}
                typingSpeed={45}
                deletingSpeed={20}
                onCurrentPromptChange={(prompt) => {
                  currentGhostPromptRef.current = prompt;
                  setActiveGhostPrompt(prompt);
                }}
              />

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onCompositionStart={() => { isInputComposingRef.current = true; }}
                onCompositionEnd={() => { isInputComposingRef.current = false; }}
                onFocus={() => {
                  setIsInputFocused(true);
                  setTimeout(() => {
                    if (messagesContainerRef.current) {
                      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                    }
                  }, 80);
                }}
                onKeyDown={(e) => {
                  // Safari may end composition before keydown; keyCode 229 still identifies the IME event.
                  if (isInputComposingRef.current || e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
                  if (e.key === 'Tab' && !input && currentGhostPromptRef.current) {
                    e.preventDefault();
                    setInput(currentGhostPromptRef.current);
                    return;
                  }
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                onBlur={() => {
                  setIsInputFocused(false);
                  if (window.scrollY !== 0) window.scrollTo(0, 0);
                  if (document.documentElement.scrollTop !== 0) document.documentElement.scrollTop = 0;
                  if (document.body.scrollTop !== 0) document.body.scrollTop = 0;
                }}
                placeholder={
                  isLucyGenerating
                    ? '추가로 할 말을 입력하면 이어서 한 번에 답변해 드려요...'
                    : (isInputFocused ? '메시지를 입력하세요 (Shift+Enter 줄바꿈, Enter 전송)...' : '')
                }
                rows={1}
                className={`w-full bg-transparent text-xs sm:text-sm resize-none outline-none leading-tight sm:leading-snug min-h-[22px] sm:min-h-[28px] max-h-[88px] py-0.5 z-10 ${
                  isLight ? 'text-slate-800 placeholder-slate-400' : 'text-white placeholder-white/65'
                }`}
                style={{ color: isLight ? '#1e293b' : '#ffffff' }}
              />
            </div>

            {/* Send or Stop Generation Button: 답변 준비 중이라도 입력창에 글자/이미지가 있으면 즉시 전송 버튼으로 자동 전환 */}
            {isLucyGenerating && !input.trim() && !attachedImage ? (
              <button
                type="button"
                onClick={handleAbortGeneration}
                className="w-6 h-6 sm:w-7 sm:h-7 p-0 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg sm:rounded-xl transition-all shadow-md cursor-pointer shrink-0 active:scale-95 flex items-center justify-center animate-pulse"
                title="답변 생성 중단 (글자를 입력하면 추가 전송 버튼으로 자동 전환됩니다)"
                aria-label="생성 중단"
              >
                <Square size={10} className="sm:w-3 sm:h-3 fill-current text-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() && !attachedImage && (!activeGhostPrompt || isLucyGenerating)}
                className={`lucy-starlight-send w-6 h-6 sm:w-7 sm:h-7 p-0 font-bold rounded-lg sm:rounded-xl transition-all shadow-xs cursor-pointer shrink-0 active:scale-95 flex items-center justify-center ${
                  input.trim() || attachedImage
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-amber-500/20'
                    : activeGhostPrompt && !isLucyGenerating
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-amber-500/20 ring-1 ring-amber-400/40'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 opacity-30 cursor-not-allowed text-slate-950'
                }`}
                title={
                  input.trim() || attachedImage
                    ? (isLucyGenerating ? '추가 메시지 연속 전송 (진행 중인 답변을 멈추고 합쳐서 답변)' : '메시지 전송')
                    : activeGhostPrompt
                    ? `예시 질문 바로 전송: "${activeGhostPrompt}"`
                    : '메시지를 입력하거나 예시를 선택하세요'
                }
                aria-label={
                  input.trim() || attachedImage
                    ? (isLucyGenerating ? '추가 메시지 연속 전송' : '메시지 전송')
                    : activeGhostPrompt
                    ? `예시 질문 바로 전송: ${activeGhostPrompt}`
                    : '메시지 전송'
                }
              >
                <Send size={11} className="sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>
        </div>
      </footer>
        </div>
      </div>

      {/*  제제 님의 소울 프로필 퀵뷰 모달 */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <ScreenPortal><div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`rounded-3xl p-6 w-full max-w-md shadow-2xl border relative space-y-4 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-white/15 text-white'
              }`}
            >
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-white flex items-center justify-center shadow-sm">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{primaryProfile?.name || sharedState?.userProfile?.basic?.name || '박주형'} 님의 소울 프로필</h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/75'}`}>Google 계정 연동 및 사주·에너지 요약</p>
                </div>
              </div>

              <div className={`border rounded-2xl p-4 space-y-2.5 text-xs ${
                isLight ? 'bg-amber-50/60 border-amber-200/80 text-slate-700' : 'bg-slate-800/80 border-white/15 text-white'
              }`}>
                <div className="flex justify-between border-b border-amber-200/60 dark:border-white/10 pb-2">
                  <span className={isLight ? 'text-slate-500 font-medium' : 'text-white/75 font-medium'}>본명 (실명)</span>
                  <span className={`font-bold ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>{primaryProfile?.name || sharedState?.userProfile?.basic?.name || '박주형'}</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 dark:border-white/10 pb-2">
                  <span className={isLight ? 'text-slate-500 font-medium' : 'text-white/75 font-medium'}>소울 닉네임 (호칭)</span>
                  <span className={`font-bold ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>{userDisplayName}</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 dark:border-white/10 pb-2">
                  <span className={isLight ? 'text-slate-500 font-medium' : 'text-white/75 font-medium'}>연동 이메일</span>
                  <span className={`font-medium truncate max-w-[200px] ${isLight ? 'text-slate-800' : 'text-white'}`}>{firebaseUser?.email || '미연동'}</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 dark:border-white/10 pb-2">
                  <span className={isLight ? 'text-slate-500 font-medium' : 'text-white/75 font-medium'}>사주 본원 (일주)</span>
                  <span className={`font-bold ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>{sajuInfo ? sajuInfo.shortDigest : '기본 분석 진행 중'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-500 font-medium' : 'text-white/75 font-medium'}>상담 선호 스타일</span>
                  <span className={`font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>{sharedState?.userProfile?.psych?.counselingStyle || '따뜻하고 직관적인 공감'}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 dark:hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div></ScreenPortal>
        )}
      </AnimatePresence>

      {/* 📍 루시 채팅 스마트 스크롤 낭독 위치 즉시 복귀 플로팅 버튼 */}
      <SmartScrollResumeButton
        isVisible={isLucyUserOverriding && isTTSActive && hasLucyActiveHighlight}
        onResume={resumeLucyAutoScroll}
        remainingSeconds={lucyRemainingSeconds}
        fixed
        className="!bottom-[calc(var(--sidebar-footer-height,var(--lucy-footer-height,140px))+12px)] sm:!bottom-[calc(var(--sidebar-footer-height,var(--lucy-footer-height,140px))+16px)]"
      />

      {/* 🔊 Auto-TTS Feedback Toast */}
      <AnimatePresence>
        {autoTtsToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-950/95 text-emerald-100 text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 border border-emerald-500/30"
          >
            <Volume2 size={15} className="text-emerald-400 animate-pulse shrink-0" />
            <span>{autoTtsToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📖 13페이지 추천 질문 라이브러리 모달 */}
      <PromptLibraryModal
        isOpen={isPromptLibraryOpen}
        onClose={() => setIsPromptLibraryOpen(false)}
        onSelectPrompt={handleSelectPromptFromLibrary}
      />

      {/* 👥 대화창 프로필 추가/수정 모달 */}
      <ChatProfileModal
        isOpen={isChatProfileModalOpen}
        onClose={() => setIsChatProfileModalOpen(false)}
        onSave={handleSaveChatProfile}
        initialProfile={editingChatProfile}
        totalProfilesCount={activeProfiles.length}
        existingProfiles={activeProfiles}
        userRealName={sharedState?.userProfile?.basic?.name || getPersistentUserProfile()?.basic?.name || '박주형'}
      />

      {/* End of content */}

    </div>
  );
}
