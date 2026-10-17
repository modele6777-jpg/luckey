import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Trash2, Search, X, ChevronDown, Check, Volume2, VolumeX, Square,
  Download, User, Sparkles, Sun, TreeDeciduous, Activity, Bird, Music, Zap, Flame, Compass,
  Loader2, Copy, RefreshCw, Camera, BookOpen, BookMarked
} from 'lucide-react';
import { useApp, PersonaType, getPersistentUserProfile } from '@/contexts/AppContext';
import { useLocation } from 'wouter';
import { playTTS, playTTSInChunks, playQAndATTS, stopTTS, useTTSActive, subscribeTTS, prefetchTTS, normalizeTextForSpeech } from '@/utils/tts';
import { unlockAudioPlayback, primeTTSAudioElement } from '@/lib/audio';
import { calculateDetailedSaju } from '@/lib/sajuAnalysis';
import { getLocalDateKey } from '@/lib/rebibleStorage';
import ReactMarkdown from 'react-markdown';
import { LucyProTypewriter } from '@/components/LucyProTypewriter';
import { ChatInsightsBoardModal } from '@/components/ChatInsightsBoardModal';
import { LucyAuraLoader } from '@/components/LucyAuraLoader';
import remarkGfm from 'remark-gfm';
import { safeSessionStorage, safeLocalStorage } from '@/utils/safeStorage';
import { cleanUserMessageDisplay } from '@/utils/cleanMessage';
import { detectLucyChannelsFromText, formatChannelsModeTitle } from '@/lib/lucyAutoModeDetector';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { getAndClearPendingSelection } from '@/lib/selectionBridge';
import { LucyResponseRecommendation } from '@/components/LucyResponseRecommendation';
import { PromptLibraryModal } from '@/components/chat/PromptLibraryModal';
import { DynamicGhostInputPlaceholder } from '@/components/chat/DynamicGhostInputPlaceholder';
import { ChatProfileDock } from '@/components/chat/ChatProfileDock';
import { ChatProfileModal } from '@/components/chat/ChatProfileModal';
import { type ChatTargetProfile } from '@/types/chatProfile';
import { buildMultiProfileSystemContext, generateMultiProfilePrompts } from '@/lib/multiProfileContext';
import { HORI_PROMPT_LIBRARY } from '@/data/horiPromptLibrary';
import { type LucyChatMode, LUCY_MODE_CONFIGS } from '@/components/chat/LucyModeSelectorBar';

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

// 🌟 Rich Prompt Pools for Dynamic Random Sampling
const CHANNEL_PROMPT_POOLS: Record<SpecialChannel, string[]> = {
  prologue: [
    '새로운 시작을 앞두고 내 삶의 중심축을 바로잡는 나침반 질문은?',
    '지금 나의 인생 10년 주기에서 어떤 새로운 서막이 열리고 있을까?',
    '낯선 도전을 시작할 때 두려움을 용기와 설렘으로 바꾸는 법',
    '내 안의 가장 순수한 열망과 비전을 명확한 첫걸음으로 구체화해줘.',
    '올해 새롭게 펼쳐질 나의 운명적 기회와 전환점은 무엇일까?'
  ],
  orange: [
    '모든 공격은 사랑을 청하는 외침(Call for Love)이라는 기적수업의 관점으로 갈등 풀기',
    '세상의 최면과 아르콘(집착의 굴레)을 꿰뚫고 자유로워지는 그노시스 통찰은?',
    '12연기(연기법)의 관점에서 내 반복되는 고통의 연결고리를 끊는 법은?',
    '내가 직면한 문제를 1원칙(First Principles)으로 분해해서 분석해 줘.',
    '중요한 결정을 앞두고 고려해야 할 숨겨진 변수와 리스크는?',
    '장기적 성장을 위한 나만의 고유한 전략적 로드맵을 설계해 줘.',
    '직관과 논리가 충돌할 때 최선의 결정을 내리는 사고 프레임워크는?',
    '현재 상황에서 가장 큰 레버리지(지렛대 효과)를 낼 수 있는 1가지 핵심 행동은?',
    '확증 편향과 인지적 맹점을 점검하고 반대 논리를 냉철하게 검토해 줘.',
    '시간과 에너지의 병목 현상을 해결하는 시스템적 접근법은?',
    '불확실성이 높을 때 위험을 최소화하면서 기회를 포착하는 의사결정법은?',
    '복잡한 딜레마를 MECE(상호배제·전체포괄) 관점으로 깔끔하게 정리해줘.',
    '문제의 근본 원인(Root Cause)을 파헤치는 5 Whys 기법을 적용해줘.',
    '단기적 유혹을 이겨내고 장기적 복리 효과를 만드는 전략적 사고법은?',
    '비효율적인 습관과 생각의 낭비를 구조적으로 제거하는 실행 팁'
  ],
  trinity: [
    '특별한 관계(Special Relationship)에서 거룩한 관계(Holy Relationship)로 나아가는 영적 흐름은?',
    '플레로마(빛의 충만함)와 소피아의 회복 여정에서 내 영혼의 단계는?',
    '제행무상과 제법무아의 관점에서 내 운명의 흐름을 어떻게 바라볼까?',
    '나의 사주 본원과 올해 병오년의 에너지적 조화는 어때?',
    '현재 나의 운의 계절에서 지금은 씨앗을 뿌릴 때일까, 수확할 때일까?',
    '나의 천을귀인 기운을 활성화할 수 있는 실천 팁을 알려줘.',
    '오늘 나의 소울 주파수를 상승시키는 타로적 메시지를 들려줘.',
    '타고난 사주 오행 중 부족한 기운을 일상에서 채우는 개운법',
    '앞으로 마주할 운의 터닝포인트와 주의해야 할 에너지 흐름',
    '내 사주원국의 십신 강점을 극대화하여 재물운을 높이는 법',
    '내 직관과 무의식이 가리키는 다음 단계의 영적 방향성',
    '운의 흐름이 정체되었을 때 기운의 물꼬를 트는 방하착 비결',
    '내 사주 대운의 흐름에 맞는 올해의 커리어 및 재물 타이밍은?',
    '오늘 나를 지켜주는 우주적 수호 가이드의 조언을 들려줘.',
    '최근 겪는 반복적인 우연과 동시성(Synchronicity)의 의미는?'
  ],
  bluebird: [
    '기적수업 레슨 34: "나는 이것 대신 평화를 볼 수 있다"를 지금 내 상황에 적용해줘.',
    '누군가에 대한 억울함과 상처를 기적수업의 참된 용서로 치유하는 법',
    '내 안의 꺼지지 않는 신성한 불꽃(Divine Spark)을 깨우는 법은?',
    '도마 복음서의 가르침처럼 내면의 것을 꺼내 구원을 얻는 비결',
    '괴로움(Dukkha)이 밀려올 때 두 번째 화살을 맞지 않는 지혜는?',
    '초기불교 사념처(신수심법)로 지금 내 감정을 알아차리는 법',
    '루시야, 오늘 마음이 조금 지치고 버거운데 따뜻하게 안아줘.',
    '남들과 비교하며 작아지는 내 마음을 편안하게 달래줘.',
    '불안과 걱정이 올라올 때 내 마음을 지켜주는 세도나 4문답 해줘.',
    '오늘 하루 수고한 나 자신에게 건네는 포근한 손편지 써줘.',
    '내 안의 작은 아이(내면아이)에게 건네는 다정한 포옹과 위로',
    '스스로를 자책하고 비난하는 마음을 멈추는 자기자비 연습',
    '과거의 상처로부터 안전하게 나를 지키는 온기 가득한 대화',
    '완벽하지 않아도 온전히 사랑받을 자격이 있다는 확신을 줘.',
    '오늘 밤 편안하게 숙면을 취할 수 있는 마음 토닥임 명상',
    '가슴속 응어리진 감정을 편안하게 흘려보내는 안전한 위로',
    '남의 눈치를 보느라 지쳐버린 나를 위한 따뜻한 응원',
    '오늘 끌어당김의 법칙으로 우주에 전달할 긍정 확언 문장'
  ],
  aura: [
    '지금 바로 몸의 긴장을 풀고 피로를 날리는 3분 호흡법 알려줘.',
    '오늘 나의 신체 에너지와 바이오리듬을 끌어올리는 루틴 추천해줘.',
    '숙면을 취하고 아침을 상쾌하게 깨우는 나이트 케어 가이드줘.',
    '무기력할 때 뇌를 깨우는 간단한 스트레칭과 수분 루틴은?',
    '머리에 몰린 열과 생각을 발끝으로 내리는 1분 그라운딩 기법',
    '신경계를 안정시키고 미주신경을 활성화하는 4-7-8 이완 호흡',
    '에너지가 방전되었을 때 10분 만에 안전하게 재충전하는 법',
    '잠들기 전 5분 동안 온몸의 긴장을 푸는 바디스캔 가이드',
    '스트레스로 소화가 안 되거나 가슴이 답답할 때 누르는 혈자리',
    '집중력을 2배로 높여주는 뽀모도로 브레인 리셋 루틴',
    '오후의 나른함을 날려버리는 활력 충전 스트레칭',
    '내 몸의 코어 에너지와 면역력을 지켜주는 데일리 건강 수칙'
  ],
  muse: [
    '빌립 복음서의 신방(Bridal Chamber)처럼 대립하는 생각을 하나로 융합하는 법',
    '새로운 아이디어가 필요한데, 생각을 뒤흔드는 신선한 질문을 던져줘!',
    '지금 내 감정을 은유적으로 담아낸 아름다운 시 한 편 지어줘.',
    '사람들의 마음을 사로잡는 감각적인 문장과 스토리텔링 아이디어 줘.',
    '창작의 벽에 부딪혔을 때 영감의 물꼬를 트는 무작위 발상법은?',
    '오늘의 소소한 일상을 특별한 예술적 시선으로 바라보는 관점',
    '완벽주의를 내려놓고 편안하게 시작하는 창작 루틴',
    '내 프로젝트에 생명력을 불어넣는 참신한 카피라이팅 아이디어',
    '아이디어가 완전히 고갈됐을 때 뇌를 번뜩이게 하는 질문은?',
    '창작 슬럼프를 기분 좋은 휴식과 새로운 도약의 계기로 바꾸기',
    '상상력을 극대화하는 SCAMPER 기법으로 내 고민을 재해석해줘.',
    '감각적인 비유와 독창적인 문체로 풀어내는 글쓰기 팁',
    '세상에 없던 새로운 시각으로 문제를 재정의하는 발상 전환'
  ],
  epilogue: [
    '오늘 하루 있었던 일들을 차분히 정리하고 마음을 비워내는 회고 질문',
    '마음에 남은 응어리와 미련을 있는 그대로 흘려보내는 세도나 4문답 해줘.',
    '오늘 밤 편안한 쉼과 숙면으로 인도하는 밤의 서재 방하착 가이드',
    '하루 동안 수고한 나 자신에게 건네는 따뜻한 자기 자비와 감사',
    '오늘 겪은 크고 작은 경험 속에서 얻은 영혼의 선물은 무엇일까?'
  ]
};

// 👑 7대 채널 풀가동 PRO 마스터 Pool
const MASTER_PROMPT_POOL = [
  '초기불교의 사티(알아차림) + 영지주의의 그노시스 + 기적수업의 용서를 융합해 내 고민을 풀어줘.',
  '초기불교의 무아(Anattā)와 영지주의의 신성한 불꽃(Pneuma)을 융합해 진단해줘.',
  '초기불교 4성제와 8정도의 지혜를 내 현재 삶과 고민에 적용해 줘.',
  '나의 사주·심리·신체 에너지와 인생 전략을 총망라해서 통합 진단해 줘.',
  '현재 직면한 중대한 전환점을 5대 영역에서 입체적으로 분석해 줘.',
  '내 영혼의 최고 잠재력을 끌어올리기 위한 올인원 마스터 로드맵을 설계해 줘.',
  '오늘 하루 나의 운과 마인드셋을 최고조로 끌어올리는 마스터 가이드는?',
  '내 운명의 타이밍에 맞춘 5개년 비즈니스 & 라이프 마스터플랜',
  '내면의 상처를 치유하고 외적 실행력을 폭발시키는 심신통합 전략',
  '우주적 동시성과 1원칙 논리가 만나는 최고의 의사결정 해답',
  '영혼의 사명과 현실적 성공을 일치시키는 홀리스틱 마스터 코칭'
];

// 💬 일상 대화 & 힐링 & 인생 조언을 위한 풍부한 캐주얼 추천 질문 풀 (동적 순환)
const CASUAL_PROMPT_POOL = [
  '루시야, 오늘 하루 어떻게 보내면 기분이 좋아질까?',
  '요즘 생각이 너무 많은데 머릿속을 정리할 수 있는 좋은 질문을 던져줘.',
  '오늘 나에게 어울리는 행운의 컬러와 마음가짐은 뭐야?',
  '지금 이 순간 내 마음에 가장 필요한 따뜻한 위로는 무엇일까?',
  '오늘 하루를 특별하게 만들어줄 작은 실천 팁 하나 알려줘.',
  '지친 나를 위해 따뜻한 차 한 잔 마시듯 마음을 녹여줘.',
  '답답했던 마음을 시원하게 환기할 수 있는 긍정적인 생각법은?',
  '오늘 밤 편안하게 푹 쉴 수 있는 힐링 한마디 부탁해.',
  '내 안의 불안을 가라앉히고 평온함을 되찾는 짧은 대화 나누자.',
  '루시, 오늘 나 자신을 더 사랑할 수 있는 칭찬 한마디 해줄래?',
  '새로운 시작을 앞두고 용기를 북돋워 주는 조언을 듣고 싶어.',
  '내 마음의 날씨를 알아차리고 다독여주는 시간 가져보자.',
  '오늘 하루 소소하지만 확실한 행복을 찾는 비결은?',
  '루시의 눈으로 본 나의 가장 빛나는 장점은 무엇일까?',
  '스트레스를 비우고 좋은 에너지를 채우는 오늘의 확언 한 줄!',
  '마음이 복잡할 때 호흡을 가다듬는 1분 이완법 알려줘.',
  '인간관계에서 마음의 경계를 건강하게 지키는 법은?',
  '오늘 나에게 일어날 수 있는 기분 좋은 우연과 행운은?',
  '스스로에게 너무 엄격해질 때 나를 안아주는 법',
  '오늘 하루를 감사함으로 마무리하는 루틴 추천해줘.',
  '무기력할 때 작은 활력을 불어넣는 3분 기분 전환 팁',
  '내 마음속 숨은 열정과 호기심을 깨우는 영감 질문'
];

const SPECIAL_CHANNELS: Record<SpecialChannel, ChannelConfig> = {
  // 0. 빨 (빨강) - 프롤로그
  prologue: {
    id: 'prologue',
    name: '프롤로그',
    shortName: '프롤로그',
    tagline: '새로운 서막, 비전 설계 & 운명의 나침반',
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
    tagline: '1원칙 사고 기반 전략적 심층 분석 & 다이어리 통찰',
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
    tagline: '천문 사주원국 & 타로 주파수 영적 통찰',
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
    tagline: '신체 컨디션, 호흡법 & 바이오리듬 조율',
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
    tagline: '내면아이 보듬기 & 따뜻한 심리 치유와 위로',
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
    tagline: '영감, 카피라이팅, 시 & 창작 아이디어',
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
    tagline: '하루 마감 회고, 밤의 서재 & 마음 방하착',
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
 */
export function resolveMessageModeAndChannels(
  msg: any,
  filteredMessages?: any[],
  index?: number
): {
  mode: string;
  channels: SpecialChannel[];
  isMaster: boolean;
  isCasual: boolean;
  badgeLabel: string;
  badgeColor: string;
  badgeIcon: string;
} {
  if (msg && typeof msg === 'object' && (msg as any)._cachedModeInfo) {
    return (msg as any)._cachedModeInfo;
  }

  let rawChannels: string[] = Array.isArray(msg?.channels) ? msg.channels : [];
  let rawMode: string = msg?.mode || msg?.channel || '';

  // 0. 환영 및 일일 인사말 메시지인 경우 100% 수다 모드로 고정
  const msgId = String(msg?.id || '');
  if (msgId === 'greet' || msgId === 'greet-main' || msgId.startsWith('greet-') || msgId.includes('greet')) {
    rawChannels = [];
    rawMode = 'casual';
  }

  // 1. 모델 메시지에 채널이 비어 있다면 직전 사용자 메시지의 채널 확인
  if (rawChannels.length === 0 && !rawMode && filteredMessages && typeof index === 'number' && index > 0) {
    const prev = filteredMessages[index - 1];
    if (prev && prev.role === 'user') {
      if (Array.isArray(prev.channels) && prev.channels.length > 0) {
        rawChannels = prev.channels;
      }
      if (prev.mode) {
        rawMode = prev.mode;
      }
    }
  }

  // 2. 여전히 비어 있다면 본문 텍스트의 키워드 및 의도 분석
  if (rawChannels.length === 0 && !rawMode) {
    const text = typeof msg?.content === 'string' 
      ? msg.content 
      : (Array.isArray(msg?.content) ? (msg.content[0]?.text || '') : '');
    const detected = detectLucyChannelsFromText(text);
    if (detected.isMaster) {
      rawChannels = ALL_CHANNELS;
      rawMode = 'master';
    } else if (detected.channels.length > 0) {
      rawChannels = detected.channels;
      rawMode = detected.channels.length === 1 ? detected.channels[0] : 'synergy';
    } else {
      rawChannels = [];
      rawMode = 'casual';
    }
  }

  const validChannels: SpecialChannel[] = rawChannels.filter((c: any) =>
    ALL_CHANNELS.includes(c)
  ) as SpecialChannel[];

  const isMaster = rawMode === 'master' || validChannels.length === ALL_CHANNELS.length;
  const isCasual = (rawMode === 'casual' || validChannels.length === 0) && !isMaster;

  let badgeLabel = '수다 모드';
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
  let badgeIcon = '💬';

  if (isMaster) {
    badgeLabel = '올인원 마스터';
    badgeColor = 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 font-bold border-amber-400';
    badgeIcon = '👑';
  } else if (validChannels.length === 1) {
    const ch = validChannels[0];
    const cfg = SPECIAL_CHANNELS[ch];
    badgeLabel = cfg ? cfg.name : ch;
    badgeColor = cfg ? `${cfg.activeColor} border font-bold` : 'bg-amber-100 text-amber-900 border-amber-200';
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
    channels: isMaster ? ALL_CHANNELS : validChannels,
    isMaster,
    isCasual,
    badgeLabel,
    badgeColor,
    badgeIcon
  };

  if (msg && typeof msg === 'object') {
    try {
      (msg as any)._cachedModeInfo = result;
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
  const singleChannel = (channels.length === 1 ? channels[0] : (mode !== 'auto' && mode !== 'casual' && mode !== 'master' ? mode : null)) as SpecialChannel | null;
  if (singleChannel && CHANNEL_PROMPT_POOLS[singleChannel]) {
    const pool = CHANNEL_PROMPT_POOLS[singleChannel];
    return shuffle(pool).slice(0, 6);
  }

  // 3. 7대 채널 올인원 마스터 모드 (레거시 또는 7대 전체 활성)
  if (mode === 'master' || channels.length === ALL_CHANNELS.length) {
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
    ...shuffle(HORI_PROMPT_LIBRARY.map((p) => p.title)).slice(0, 4),
    ...shuffle(CASUAL_PROMPT_POOL).slice(0, 2),
  ];
  return shuffle(Array.from(new Set(diversePool))).slice(0, 6);
}

export default function LucyStandalonePage() {
  const [, navigate] = useLocation();

  const { 
    firebaseUser, 
    signInWithGoogle, 
    sendUnifiedMessage, 
    personaMessages, 
    isGenerating,
    abortGenerating,
    sharedState,
    clearPersonaMessages
  } = useApp();

  const handleAbortGeneration = useCallback(() => {
    try {
      abortGenerating('lucy');
      triggerHaptic('abort');
    } catch (_) {}
  }, [abortGenerating]);

  // 🔒 모드 선택란 제거: 루시는 항상 AI 모드로 동작합니다.
  // 단일 채널 / N중 융합 / 7대 채널 마스터는 매 질문마다 AI가 맥락을 분석해 자동으로 결정합니다.
  const selectedMode = 'auto' as LucyChatMode;

  // 🎛️ 현재 AI가 감지·가동 중인 채널 (기본: [] 일상 대화, 외부 명시 진입 시 pending 채널 1회 반영)
  const [activeChannels, setActiveChannels] = useState<SpecialChannel[]>(() => {
    try {
      // 이전 버전에서 저장된 수동 모드 선택값 정리
      safeLocalStorage.removeItem('lucy_selected_mode');
      const pending = safeSessionStorage.getItem('lucy_pro_pending_channel');
      if (pending) {
        safeSessionStorage.removeItem('lucy_pro_pending_channel');
        return parsePendingChannels(pending);
      }
    } catch (_) {}
    return [];
  });

  // 채널 변경 시 safeLocalStorage에 영구 동기화
  useEffect(() => {
    try {
      safeLocalStorage.setItem('lucy_active_channels', JSON.stringify(activeChannels));
    } catch (_) {}
  }, [activeChannels]);

  const [input, setInput] = useState('');
  const isAutoDetect = selectedMode === 'auto';
  const [autoDetectedTitle, setAutoDetectedTitle] = useState<string | null>(() => {
    if (selectedMode === 'casual') return '💬 수다 모드';
    if (selectedMode === 'master') return '7대 채널 올인원 마스터';
    if (selectedMode !== 'auto') {
      const cfg = SPECIAL_CHANNELS[selectedMode as SpecialChannel];
      return cfg ? cfg.name : selectedMode;
    }
    return null;
  });

  const currentActiveModeConfig = useMemo(() => {
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
  }, [selectedMode, activeChannels]);

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
      const detected = detectLucyChannelsFromText(input);
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
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [resetToast, setResetToast] = useState<string | null>(null);
  const [modeSwitchToast, setModeSwitchToast] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [ttsInfo, setTtsInfo] = useState({ isSpeaking: false, isLoading: false, activeText: null as string | null });
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentGhostPromptRef = useRef<string>('');

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


  const toggleAutoTts = () => {
    setIsAutoTts((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('lucy_chat_auto_tts', String(next));
      } catch (_) {}
      if (!next) {
        stopTTS();
        setPlayingMsgId(null);
      }
      setAutoTtsToast(next ? '🔊 루시 답변 바로 음성 읽기(질문 낭독 생략)가 켜졌습니다.' : '🔇 자동 음성 읽기가 꺼졌습니다.');
      setTimeout(() => setAutoTtsToast(null), 2500);
      return next;
    });
  };
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesWrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isTTSActive = useTTSActive();
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const isUserScrolledUpRef = useRef(false);

  // Dedicated Lucy entrance aura loader
  const [isLucyReady, setIsLucyReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLucyReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);


  // Determine User Nickname
  const rawNickname = sharedState?.userProfile?.basic?.nickname?.trim();
  const rawDisplayName = firebaseUser?.displayName?.trim();
  const rawName = sharedState?.userProfile?.basic?.name?.trim();
  const userDisplayName = (rawNickname && rawNickname !== '여행자' && rawNickname !== '사용자')
    ? rawNickname
    : ((rawName && rawName !== '여행자')
      ? rawName
      : (rawDisplayName || '제제'));

  // Detailed Saju Info for Soul Profile View
  const sajuInfo = useMemo(() => calculateDetailedSaju(sharedState?.userProfile), [sharedState?.userProfile]);

  const lucyMessages = personaMessages?.lucy || [];
  const isLucyGenerating = isGenerating?.lucy || false;

  // 👥 대화창 내 다자간 프로필 (최대 4인) 상태 관리
  // 새로고침 또는 재진입 시에는 항상 '내 프로필' 1인만 나오도록 초기화됩니다.
  const [activeProfiles, setActiveProfiles] = useState<ChatTargetProfile[]>(() => {
    try {
      sessionStorage.removeItem('lucy_chat_extra_profiles');
    } catch (_) {}

    const basic = sharedState?.userProfile?.basic || getPersistentUserProfile()?.basic;
    const myProfile: ChatTargetProfile = {
      id: 'my-profile',
      isMe: true,
      name: basic?.nickname || basic?.name || '나 (본인)',
      birthdate: basic?.birthdate || '1995-01-01',
      birthtime: basic?.birthtime || '12:00',
      gender: basic?.gender || 'male',
      birthCity: basic?.birthCity || '서울',
      lunarSolar: basic?.lunarSolar || 'solar',
      relationship: '본인'
    };

    return [myProfile];
  });

  // 루시 채팅에서 벗어날 때(언마운트 시) 세션 스토리지 정리
  useEffect(() => {
    return () => {
      try {
        sessionStorage.removeItem('lucy_chat_extra_profiles');
      } catch (_) {}
    };
  }, []);

  // 🎲 차분하게 유지되는 맞춤 추천 질문 상태 (새로고침 🔄 클릭, 모드 전환, 프로필 변경 시에만 명시적으로 갱신되며 실시간 임의 변동 방지)
  const [currentPrompts, setCurrentPrompts] = useState<string[]>(() => {
    return getCuratedPrompts(activeProfiles, selectedMode, activeChannels);
  });

  // sharedState 변경 시 내 프로필 정보 동기화 (실제 변경이 있을 때만 activeProfiles 갱신하여 불필요한 리렌더 방지)
  useEffect(() => {
    const basic = sharedState?.userProfile?.basic;
    if (basic?.name || basic?.nickname || basic?.birthdate) {
      setActiveProfiles((prev) => {
        const me = prev.find((p) => p.isMe);
        if (!me) return prev;
        const newName = basic?.nickname || basic?.name || me.name;
        const newBirthdate = basic?.birthdate || me.birthdate;
        const newBirthtime = basic?.birthtime ?? me.birthtime;
        const newGender = basic?.gender || me.gender;
        const newCity = basic?.birthCity || me.birthCity;
        const newLs = basic?.lunarSolar || me.lunarSolar;
        if (
          me.name === newName &&
          me.birthdate === newBirthdate &&
          me.birthtime === newBirthtime &&
          me.gender === newGender &&
          me.birthCity === newCity &&
          me.lunarSolar === newLs
        ) {
          return prev;
        }
        return prev.map((p) =>
          p.isMe
            ? {
                ...p,
                name: newName,
                birthdate: newBirthdate,
                birthtime: newBirthtime,
                gender: newGender,
                birthCity: newCity,
                lunarSolar: newLs,
              }
            : p
        );
      });
    }
  }, [sharedState?.userProfile?.basic]);

  // 👥 프로필이 1명만 남게 되면 자동으로 분류를 '본인'으로 보정
  useEffect(() => {
    if (activeProfiles.length === 1) {
      const only = activeProfiles[0];
      if (only && (only.relationship !== '본인' || !only.isMe)) {
        setActiveProfiles([
          {
            ...only,
            isMe: true,
            relationship: '본인',
          },
        ]);
      }
    }
  }, [activeProfiles]);

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

      // 👥 프로필이 한명만 남거나 존재할 때는 자동으로 분류를 '본인'으로 설정
      if (updated.length === 1) {
        updated[0] = {
          ...updated[0],
          isMe: true,
          relationship: '본인',
        };
      } else {
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

      setCurrentPrompts(getCuratedPrompts(updated, selectedMode, activeChannels));
      return updated;
    });
  }, [selectedMode, activeChannels]);

  const handleRemoveChatProfile = useCallback((profileId: string) => {
    setActiveProfiles((prev) => {
      // 2명 이상일 때만 삭제 가능 (내 프로필 포함)
      if (prev.length <= 1) return prev;
      const remaining = prev.filter((p) => p.id !== profileId);
      // 👥 한명만 남게 되면 자동으로 분류를 '본인'으로 변경
      const updated =
        remaining.length === 1
          ? [
              {
                ...remaining[0],
                isMe: true,
                relationship: '본인',
              },
            ]
          : remaining;
      setCurrentPrompts(getCuratedPrompts(updated, selectedMode, activeChannels));
      return updated;
    });
  }, [selectedMode, activeChannels]);

  // Refresh / Reshuffle prompts (새로고침 버튼 클릭 시에만 안정적으로 갱신)
  const refreshPrompts = useCallback(() => {
    setCurrentPrompts(getCuratedPrompts(activeProfiles, selectedMode, activeChannels));
  }, [activeProfiles, selectedMode, activeChannels]);

  // 말풍선 배지 / 추천 카드 클릭 시: AI 모드를 유지한 채 해당 채널 조합(단일·융합·마스터)을 즉시 반영
  const handleActivateMessageMode = (targetChannels: SpecialChannel[], targetIsMaster: boolean, label?: string) => {
    const nextChannels = targetIsMaster ? [...ALL_CHANNELS] : targetChannels;
    setActiveChannels(nextChannels);
    setAutoDetectedTitle(label || formatChannelsModeTitle(nextChannels));
    setCurrentPrompts(getCuratedPrompts(activeProfiles, 'auto', nextChannels));
    if (label) {
      setModeSwitchToast(`⚡ AI 모드 · [${label}] 가동`);
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

  // 🌟 호리(hori.chat) 스타일 동적 예시 고민 풀 (1인: 77선+채널/캐주얼 풀 / 2인 이상: 맞춤 궁합 질문 풀)
  const dynamicGhostPrompts = useMemo(() => {
    // 2인 이상 시 두 사람(다자간) 맞춤 궁합 질문 우선 노출
    if (activeProfiles.length >= 2) {
      return generateMultiProfilePrompts(activeProfiles);
    }

    const horiTitles = HORI_PROMPT_LIBRARY.map((p) => p.title);
    
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

    const combined = [...contextualPrompts, ...horiTitles];
    return Array.from(new Set(combined.filter((p) => p && p.trim().length > 0)));
  }, [activeProfiles.length, selectedMode]);

  // Filter messages by search query if search is active
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return lucyMessages;
    const q = searchQuery.toLowerCase();
    return lucyMessages.filter((m) => {
      const txt = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
      return txt.toLowerCase().includes(q);
    });
  }, [lucyMessages, searchQuery]);

  // Background Auto-Prefetch latest Lucy message for 0ms instant TTS playback
  useEffect(() => {
    if (lucyMessages.length > 0 && !isLucyGenerating) {
      const lastMsg = lucyMessages[lucyMessages.length - 1];
      if (lastMsg && lastMsg.role !== 'user' && typeof lastMsg.content === 'string' && lastMsg.content.length > 1) {
        prefetchTTS(lastMsg.content, 'Aoede');
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
      setTtsInfo({ isSpeaking: state.isSpeaking, isLoading: state.isLoading, activeText: state.activeText });
      if (!state.isSpeaking && !state.isLoading) {
        setPlayingMsgId(null);
      }
    });
  }, []);

  // 🔊 자동 음성 재생(Auto-TTS) 안전 백업 감시자: 새 어시스턴트 메시지 도착 시 바로재생 보장
  useEffect(() => {
    if (!isAutoTtsRef.current || isLucyGenerating || lucyMessages.length === 0) return;
    const lastMsg = lucyMessages[lucyMessages.length - 1];
    if (!lastMsg || lastMsg.role === 'user' || typeof lastMsg.content !== 'string' || !lastMsg.content.trim()) return;

    // 방금 전송된 메시지이고 아직 음성 재생되지 않은 경우 바로 자동 재생
    if (lastMsg.id && lastAutoSpokenMsgIdRef.current !== lastMsg.id && !ttsInfo.isSpeaking && !ttsInfo.isLoading) {
      const msgTime = lastMsg.timestamp || 0;
      const isRecent = Date.now() - msgTime < 20000;
      if (isRecent) {
        lastAutoSpokenMsgIdRef.current = lastMsg.id;
        const cleanAnswer = normalizeTextForSpeech(lastMsg.content);
        if (cleanAnswer) {
          const prevUserMsg = lucyMessages.slice(0, -1).reverse().find((m) => m.role === 'user');
          const cleanQuestion = prevUserMsg && typeof prevUserMsg.content === 'string'
            ? normalizeTextForSpeech(cleanUserMessageDisplay(prevUserMsg.content))
            : '';

          stopTTS();
          if (lastMsg.id) setPlayingMsgId(lastMsg.id);
          playTTSInChunks(cleanAnswer, 'Aoede', 110, undefined, undefined, { skipCompletionChime: true })
            .catch((err) => {
              console.warn('[Auto-TTS Fallback] Play error:', err);
            })
            .finally(() => {
              setPlayingMsgId(null);
            });
        }
      }
    }
  }, [lucyMessages, isLucyGenerating, ttsInfo.isSpeaking, ttsInfo.isLoading]);


  //  Dynamic PWA Manifest & iOS Home-screen Metadata Switcher
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Lucy';

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
      appleTitleTag.setAttribute('content', 'Lucy');
    }

    let themeColorTag = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    const prevThemeColor = themeColorTag ? themeColorTag.getAttribute('content') : null;
    if (themeColorTag) {
      themeColorTag.setAttribute('content', '#FFFFFF');
    }

    // 📱 앱(PWA) 모드에서 상하단 안전영역(노치/홈바)이 어두운 body 배경으로 비쳐 회색으로 보이는 현상 방지
    const prevHtmlBg = document.documentElement.style.background;
    const prevBodyBg = document.body.style.background;
    document.documentElement.style.background = '#FFFFFF';
    document.body.style.background = '#FFFFFF';

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
      if (themeColorTag && prevThemeColor) themeColorTag.setAttribute('content', prevThemeColor);
      document.documentElement.style.background = prevHtmlBg;
      document.body.style.background = prevBodyBg;
    };
  }, []);

  const isAutoScrollingRef = useRef(false);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smart non-intrusive scroll handling
  const handleScroll = useCallback(() => {
    if (isAutoScrollingRef.current) return;
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    const isUp = distanceFromBottom > 140;
    if (isUserScrolledUpRef.current !== isUp) {
      isUserScrolledUpRef.current = isUp;
      setIsUserScrolledUp(isUp);
    }
  }, []);

  const scrollToBottom = useCallback((force = false, smooth = true) => {
    if (!messagesContainerRef.current) return;
    if (!force && isUserScrolledUpRef.current) return;

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
        if (!isUserScrolledUpRef.current) {
          scrollToBottom(false, false);
        }
      });
    });

    resizeObserver.observe(messagesWrapperRef.current);

    const handleContentResized = () => {
      if (!isUserScrolledUpRef.current) {
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
  }, [scrollToBottom]);

  useEffect(() => {
    if (!isUserScrolledUpRef.current) {
      scrollToBottom(false, false);
    }
  }, [lucyMessages, isLucyGenerating, scrollToBottom]);


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

  // Send message with multi-channel context routing
  const handleSend = useCallback(async (textToSend?: string, forcedChannels?: SpecialChannel[]) => {
    const rawMsg = textToSend || input;
    if ((!rawMsg.trim() && !attachedImage) || isLucyGenerating) return;

    const userCleanText = rawMsg.trim();

    let channels = forcedChannels !== undefined ? forcedChannels : activeChannels;
    if (isAutoDetect && forcedChannels === undefined && userCleanText.length > 0) {
      const detected = detectLucyChannelsFromText(userCleanText);
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

    const channelCount = channels.length;
    const isMaster = channelCount === ALL_CHANNELS.length && ALL_CHANNELS.every((c) => channels.includes(c));
    const isCasual = channelCount === 0;
    const isSingle = channelCount === 1;
    const isSyn = channelCount >= 2 && !isMaster;

    let targetPersona: PersonaType = 'lucy';
    let extraSystemContext: string | undefined = undefined;

    // 👥 활성화된 1인~4인 프로필 사주·점성술 데이터 및 다자간 궁합 가이드 주입
    const multiProfileContext = buildMultiProfileSystemContext(activeProfiles);
    if (multiProfileContext) {
      extraSystemContext = multiProfileContext;
    }

    if (isCasual) {
      targetPersona = 'lucy';
    } else if (isSingle) {
      targetPersona = SPECIAL_CHANNELS[channels[0]].persona;
      const singleContext = `[${SPECIAL_CHANNELS[channels[0]].name} 전문 모드]
- ${SPECIAL_CHANNELS[channels[0]].name}의 전문적 통찰을 바탕으로 현실적 대안과 조언을 깊이 있게 설명해 줘.`;
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${singleContext}` : singleContext;
    } else if (isMaster) {
      const masterContext = `[7대 채널 올인원 PRO 마스터 풀가동]
- 7대 채널(서막 비전, 전략적 성찰, 사주 타로 운명, 신체 웰니스, 마음 치유, 창작 영감, 하루 마감 회고)을 총동원한 올인원 마스터 지능입니다.
- 다각도의 지능 엔진 관점을 융합하여 체계적인 분석과 깊이 있고 따뜻한 실천 조언을 제공해 줘.`;
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${masterContext}` : masterContext;
      targetPersona = 'lucy';
    } else if (isSyn) {
      const channelNames = channels.map((c) => SPECIAL_CHANNELS[c]?.name || c).join(' + ');
      const synContext = `[${channelCount}중 융합 시너지 모드: ${channelNames}]
- 자동 감지된 결합 지능 엔진들의 관점을 다각도로 융합하여 깊이 있고 유용한 시너지 답변을 도출해 줘.`;
      extraSystemContext = extraSystemContext ? `${extraSystemContext}\n\n${synContext}` : synContext;
      targetPersona = 'lucy';
    }

    setInput('');
    const imgToSend = attachedImage || undefined;
    setAttachedImage(null);
    stopTTS();

    // 🔊 사용자 액션(전송 클릭 또는 Enter 입력) 시 오디오 컨텍스트를 즉시 해제 및 프라이밍
    // 이를 통해 AI 응답 수신 후 브라우저 오디오 자동 재생 제한 없이 즉시 음성이 나옵니다.
    unlockAudioPlayback();
    primeTTSAudioElement();

    await sendUnifiedMessage(userCleanText, targetPersona, imgToSend, {
      extraSystemContext,
      channels: channels,
      mode: isMaster ? 'master' : (isCasual ? 'casual' : (isSingle ? channels[0] : 'synergy')),
      channel: isSingle ? channels[0] : undefined,
      onFinish: async (fullText, sentText, replyMsgId) => {
        if (isAutoTtsRef.current && fullText && fullText.trim()) {
          try {
            const cleanAnswer = normalizeTextForSpeech(fullText);
            const rawQuestion = sentText || userCleanText || '';
            const cleanQuestion = normalizeTextForSpeech(cleanUserMessageDisplay(rawQuestion));
            if (cleanAnswer) {
              if (replyMsgId) {
                lastAutoSpokenMsgIdRef.current = replyMsgId;
              }
              stopTTS();
              if (replyMsgId) {
                setPlayingMsgId(replyMsgId);
              }
              await playTTSInChunks(cleanAnswer, 'Aoede', 110, undefined, undefined, { skipCompletionChime: true });
              setPlayingMsgId(null);
            }
          } catch (ttsErr) {
            console.warn('[Auto-TTS] Immediate voice playback error:', ttsErr);
          }
        }
      }
    });
  }, [input, attachedImage, isLucyGenerating, activeChannels, isAutoDetect, sendUnifiedMessage]);

  const handleSendRef = useRef(handleSend);
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
      const detected = detectLucyChannelsFromText(promptText);
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

    if (sendImmediately) {
      if (handleSendRef.current) {
        handleSendRef.current(promptText, resolvedChannels);
      }
    } else {
      setInput(promptText);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 60);
    }
  }, []);

  // 🎯 가로 스크롤 추천 질문 칩 클릭 시 해당 질문에 맞는 7대 채널 모드로 전환 및 전송
  const handleSelectRecommendationChip = useCallback((promptText: string) => {
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
      if (handleSendRef.current) {
        handleSendRef.current(horiItem.body, validChannels);
      }
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
        if (handleSendRef.current) {
          handleSendRef.current(promptText, targetChannels);
        }
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
      if (handleSendRef.current) {
        handleSendRef.current(promptText, targetChannels);
      }
      return;
    }

    // 4. 일반/융합 질문 풀 및 텍스트 자동 감지 폴백
    const detected = detectLucyChannelsFromText(promptText);
    const targetChannels = detected.isMaster ? ALL_CHANNELS : detected.channels;
    const modeTitle = detected.modeTitle || formatChannelsModeTitle(targetChannels);
    setActiveChannels(targetChannels);
    setAutoDetectedTitle(modeTitle);
    if (handleSendRef.current) {
      handleSendRef.current(promptText, targetChannels);
    }
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
        try {
          getAndClearPendingSelection();
        } catch (_) {}
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

      // 2. 🧠 텍스트 드래그(선택) 연동: 앱 어디서든 선택한 내용을 루시 채팅으로 전송한 경우 자동 처리
      const pendingSelection = getAndClearPendingSelection();
      if (pendingSelection && pendingSelection.text) {
        const queryText = `[선택 내용 안내 요청]\n"${pendingSelection.text}"\n\n방금 내가 앱에서 선택한 이 내용에 대해 핵심과 의미, 유용한 조언을 자세히 안내해 줘.`;
        const finalChannels: SpecialChannel[] = ALL_CHANNELS;
        setActiveChannels(finalChannels);
        const runSend = (attempt = 0) => {
          if (handleSendRef.current) {
            handleSendRef.current(queryText, finalChannels);
          } else if (attempt < 15) {
            setTimeout(() => runSend(attempt + 1), 100);
          }
        };
        setTimeout(() => runSend(0), 150);
        return;
      } else {
        const injectedDraft = sessionStorage.getItem('lucy_injected_input_draft');
        if (injectedDraft) {
          sessionStorage.removeItem('lucy_injected_input_draft');
          setInput(injectedDraft);
        }
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

    const handleDynamicSelection = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail?.text && detail?.target === 'lucy') {
        const queryText = `[선택 내용 안내 요청]\n"${detail.text}"\n\n방금 내가 앱에서 선택한 이 내용에 대해 핵심과 의미, 유용한 조언을 자세히 안내해 줘.`;
        const finalChannels: SpecialChannel[] = ALL_CHANNELS;
        setActiveChannels(finalChannels);
        setTimeout(() => {
          if (handleSendRef.current) {
            handleSendRef.current(queryText, finalChannels);
          }
        }, 150);
      }
    };

    window.addEventListener('lucy-inject-message', handleDynamicInject);
    window.addEventListener('prism:selection_saved', handleDynamicSelection);
    return () => {
      window.removeEventListener('lucy-inject-message', handleDynamicInject);
      window.removeEventListener('prism:selection_saved', handleDynamicSelection);
    };
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleVoicePlay = (id: string, text: string, _voice?: string) => {
    const clean = normalizeTextForSpeech(text);
    if (playingMsgId === id && (ttsInfo.isSpeaking || ttsInfo.isLoading)) {
      stopTTS();
      setPlayingMsgId(null);
    } else {
      stopTTS();
      setPlayingMsgId(id);
      playTTSInChunks(clean, 'Aoede', 110, undefined, undefined, { skipCompletionChime: true });
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
      const txt = msg.role === 'user' ? cleanUserMessageDisplay(rawTxt) : rawTxt;
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
    <div className="h-full min-h-0 flex-1 w-full max-w-full overflow-hidden flex flex-col bg-white text-slate-800 font-sans select-text relative">
      {/* Mode Switch Toast */}
      <AnimatePresence>
        {modeSwitchToast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full bg-slate-900/95 text-white shadow-xl border border-amber-400/40 flex items-center gap-2 font-sans text-xs sm:text-sm backdrop-blur-md font-bold"
          >
            <Sparkles size={14} className="text-amber-400 animate-spin" />
            <span>{modeSwitchToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRO Top Header Bar */}
      <header 
        style={{ paddingTop: 'max(14px, calc(env(safe-area-inset-top, 0px) + 10px))' }}
        className="w-full px-3.5 sm:px-8 lg:px-12 pb-3 bg-white border-b border-slate-200/80 shadow-xs flex flex-col gap-2.5 z-40 shrink-0 relative"
      >
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Brand Logo & Left empty space (상단 로고 왼쪽 아이콘 제거 및 빈 공간 유지) */}
          <div className="flex items-center min-w-0 pl-1 sm:pl-3">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 sm:gap-3 min-w-0 cursor-pointer group select-none"
              role="button"
              tabIndex={0}
              title="Lucy 메인 홈"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/'); }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    Lucy
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-indigo-600/10 text-indigo-600 border border-indigo-200/60 flex items-center gap-1">
                    <Sparkles size={10} className="text-indigo-500 animate-spin" />
                    AI 모드
                  </span>
                  {activeChannels.length === ALL_CHANNELS.length ? (
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-300 flex items-center gap-1 shadow-xs">
                      <span>👑</span>
                      <span>7대 채널 올인원 마스터</span>
                    </span>
                  ) : activeChannels.length >= 2 ? (
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white border border-indigo-300 flex items-center gap-1 shadow-xs">
                      <span>⚡</span>
                      <span>{activeChannels.length}중 융합 가동 중</span>
                    </span>
                  ) : autoDetectedTitle ? (
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-900 border border-violet-200/80">
                      {autoDetectedTitle}
                    </span>
                  ) : null}
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                  {autoDetectedTitle
                    ? `${autoDetectedTitle} · 질문 맥락에 맞춰 최적 지능 자동 가동 중`
                    : '질문 맥락에 맞춰 7대 채널·융합·마스터 지능이 자동 전환됩니다'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Action Tools: 1. 검색 -> 2. 자동 읽기 -> 3. 초기화 */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. 검색 (Search Toggle) */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                isSearchOpen ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title="대화 내역 검색"
              aria-label="대화 검색"
            >
              <Search size={16} />
            </button>


            {/* 🔊 루시 답변 자동 음성 읽기 (Auto-TTS 바로재생 토글 버튼) */}
            <button
              type="button"
              onClick={toggleAutoTts}
              className={`p-2 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 flex items-center gap-1.5 ${
                isAutoTts
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-100/80 text-emerald-800 border border-emerald-300 shadow-2xs font-semibold'
                  : 'bg-slate-100/90 text-slate-400 hover:text-slate-600 border border-slate-200/80'
              }`}
              title={isAutoTts ? '루시 답변 바로 음성 읽기 켜짐 (질문 낭독 생략) - 클릭하여 끄기' : '자동 음성 읽기 꺼짐 - 클릭하여 켜기'}
              aria-label={isAutoTts ? '루시 답변 바로 음성 읽기 켜짐' : '자동 음성 읽기 꺼짐'}
            >
              {isAutoTts ? (
                <>
                  <Volume2 size={16} className="text-emerald-600 animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-800 hidden sm:inline">자동 읽기</span>
                </>
              ) : (
                <>
                  <VolumeX size={16} className="text-slate-400" />
                  <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">자동 읽기 OFF</span>
                </>
              )}
            </button>

            {/* 초기화 (Clear / Reset Chat) */}
            {lucyMessages.length > 0 && (
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 hover:border-rose-200 transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="대화 초기화 (새 대화 시작)"
                aria-label="대화 초기화"
              >
                <Trash2 size={16} />
              </button>
            )}

            {/*  Export Chat */}
            {lucyMessages.length > 0 && (
              <button
                onClick={handleExportChat}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-all cursor-pointer hidden xs:flex items-center justify-center"
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
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
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
              <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-300/80 rounded-xl px-3 py-1.5 focus-within:border-amber-400 focus-within:bg-white transition-all">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="대화 내용 검색 (키워드 입력)..."
                  className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    {filteredMessages.length}개 발견
                  </span>
                )}
                <button 
                  onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Chat Messages Stream */}
      <main ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto select-text">
        <div ref={messagesWrapperRef} className="space-y-3 sm:space-y-4 pb-28 sm:pb-32">
          {filteredMessages.length === 0 && (
            <div className="text-center py-12 sm:py-20 px-4 space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-200 to-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm ring-4 ring-amber-100">
                <Sparkles size={36} className="text-amber-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                  <span>안녕, {userDisplayName}!</span>
                  <span>✨</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                  사주·타로·전략·치유·위로·창작·회고부터 일상 수다까지, 마음속 어떤 이야기든 편하게 건네줘.<br />
                  루시 AI가 질문 맥락을 분석하여 7대 전문 지능, 다중 융합, 올인원 마스터를 실시간으로 자동 가동해 줄게! ⚡✨
                </p>
              </div>
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
            const textContent = isUser ? cleanUserMessageDisplay(rawTextContent) : rawTextContent;
            const msgModeInfo = resolveMessageModeAndChannels(msg, filteredMessages, index);

            return (
              <motion.div
                key={msgId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Speaker Label, Mode Badge Pill (Clickable) & Timestamp */}
                <div className="flex items-center gap-1.5 mb-1.5 px-1 text-[11px] flex-wrap">
                  {!isUser ? (
                    <span className="font-bold text-amber-800 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Lucy
                    </span>
                  ) : (
                    <span className="font-bold text-slate-600 flex items-center gap-1">
                      <User size={12} className="text-slate-400" />
                      {userDisplayName}
                    </span>
                  )}

                  {/* Clickable Mode Badge Pill */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivateMessageMode(msgModeInfo.channels, msgModeInfo.isMaster, msgModeInfo.badgeLabel);
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${msgModeInfo.badgeColor}`}
                    title={`클릭 시 [${msgModeInfo.badgeLabel}] 모드로 즉각 전환됩니다.`}
                  >
                    <span>{msgModeInfo.badgeIcon}</span>
                    <span>{msgModeInfo.badgeLabel}</span>
                    <span className="text-[9px] opacity-75 font-normal">모드 ON</span>
                  </button>

                  <span className="text-[10px] text-slate-400">{timeStr}</span>
                </div>

                <div className="relative group max-w-[92%] sm:max-w-[85%] lg:max-w-[80%]">
                  {/* Attached Image Preview (in User Message or Lucy's Card Deep Insight Reply) */}
                  {(() => {
                    const cardImageToDisplay = isUser ? imageUrl : (imageUrl || null);
                    if (!cardImageToDisplay) return null;
                    return (
                      <div className="mb-2 overflow-hidden rounded-2xl border border-slate-200 shadow-sm max-w-xs bg-slate-100 min-h-[100px]">
                        <img 
                          src={cardImageToDisplay} 
                          alt="첨부 이미지" 
                          loading="lazy"
                          className="w-full h-auto object-cover max-h-64 rounded-2xl" 
                        />
                      </div>
                    );
                  })()}

                  {/* Message Bubble */}
                  <div 
                    className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-sm sm:text-[15px] lg:text-base leading-relaxed shadow-xs select-text ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-tr-xs font-sans'
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-sm font-sans transition-all'
                    }`}
                  >
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{textContent}</div>
                    ) : (
                      <>
                        <LucyProTypewriter 
                          content={textContent}
                          isLatest={index === filteredMessages.length - 1}
                          isGenerating={isLucyGenerating && index === filteredMessages.length - 1}
                        />
                        {/* 🔮 LucKey 연계 추천 채널 및 Key 실천 도약 바: 수다모드 및 루시의 인사말에서는 생략, 전문 모드에서만 유지 */}
                        {(() => {
                          if (isLucyGenerating && index === filteredMessages.length - 1) return null;
                          if (!textContent || textContent.trim().length <= 10) return null;
                          if (msgModeInfo.isCasual) return null;

                          // 루시의 인사말인지 여부 정밀 판별
                          const isGreeting = (() => {
                            if (msgId === 'greet' || msgId === 'greet-main' || msgId.startsWith('greet-') || msgId.toLowerCase().includes('greet')) {
                              return true;
                            }
                            // 이전 사용자 메시지가 전혀 없는 경우 (최초 입장 시 출력되는 루시 인사말)
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
                        })()}
                      </>
                    )}
                  </div>

                  {/* Action buttons: Copy & TTS */}
                  <div className={`flex items-center gap-1.5 mt-1.5 flex-wrap ${isUser ? 'justify-end pr-1' : 'pl-1'}`}>
                    <button
                      onClick={() => handleCopy(msgId, textContent)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="복사"
                    >
                      {copiedId === msgId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() => handleVoicePlay(msgId, textContent, 'Aoede')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        playingMsgId === msgId && (ttsInfo.isSpeaking || ttsInfo.isLoading)
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
                      }`}
                      title={
                        playingMsgId === msgId && ttsInfo.isLoading
                          ? "음성 준비 중..."
                          : playingMsgId === msgId && ttsInfo.isSpeaking
                          ? "음성 멈추기"
                          : "음성으로 듣기"
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
                </div>
              </motion.div>
            );
          })}

          {isLucyGenerating && (
            <div className="flex items-center gap-2.5 p-3.5 bg-white/95 border border-emerald-200/80 rounded-2xl w-fit shadow-xs animate-pulse">
              <span className="text-base select-none animate-bounce">🍀</span>
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200" />
              </div>
              <span className="text-xs sm:text-sm text-emerald-950 font-bold ml-1">
                Lucy가 답변을 작성하고 있습니다...
              </span>
            </div>
          )}
          
          <div className="h-10 sm:h-14 w-full shrink-0" />
          <div ref={chatEndRef} />
        </div>
      </main>

      {/*  Floating Jump to Bottom Button when Scrolled Up */}
      <AnimatePresence>
        {isUserScrolledUp && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => {
              isUserScrolledUpRef.current = false;
              setIsUserScrolledUp(false);
              scrollToBottom(true, true);
            }}
            style={{ bottom: 'calc(var(--sab, 0px) + 6.8rem)' }}
            className="fixed right-4 sm:right-10 z-40 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white text-[11px] sm:text-xs font-bold shadow-xl backdrop-blur-xs border border-slate-700/60 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            title="최신 메시지 보기"
          >
            <ChevronDown size={13} className="text-amber-400 animate-bounce" />
            <span>최신 대화</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ⌨️ Bottom Input Bar: Image Preview + STT Mic + Multi-Modal Vision + Send */}
      <footer 
        style={{ paddingBottom: 'max(0.35rem, calc(var(--sab, 0px) + 0.2rem))' }}
        className="w-full px-2.5 sm:px-4 pt-1 pb-1 sm:pt-1.5 sm:pb-2.5 bg-white border-t border-slate-200/80 shadow-xs shrink-0 z-30 relative"
      >
        <div className="max-w-lg sm:max-w-xl mx-auto flex flex-col gap-1 sm:gap-1.5">
          {/* Image Attachment Preview */}
          {attachedImage && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">
              <img src={attachedImage} alt="첨부 미리보기" className="w-8 h-8 object-cover rounded-lg" />
              <div className="text-[11px] text-slate-600 font-medium pr-1.5">이미지 비전 준비됨</div>
              <button 
                onClick={() => setAttachedImage(null)}
                className="p-0.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
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
                className="flex items-center gap-1 px-2 py-0.2 bg-violet-50 border border-violet-200/90 text-violet-900 rounded-full text-[9px] sm:text-[10px] font-semibold w-fit shadow-2xs"
              >
                <Sparkles size={10} className="text-violet-600 animate-spin" />
                <span>AI 감지:</span>
                <span className="font-bold text-violet-950 underline decoration-violet-300">{autoDetectedTitle}</span>
                <span className="text-[8px] sm:text-[9px] text-violet-600 bg-violet-100/80 px-1 py-0.1 rounded-full font-medium">자동 전환</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🔊 실시간 루시 음성 재생 바 (현재 말하는 중일 때 즉시 멈춤 지원) */}
          <AnimatePresence>
            {(ttsInfo.isSpeaking || ttsInfo.isLoading) && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex items-center justify-between px-2.5 py-1 bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-300/80 rounded-lg sm:rounded-xl text-[10px] sm:text-xs text-amber-950 shadow-xs backdrop-blur-xs"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {ttsInfo.isLoading ? (
                    <Loader2 size={11} className="animate-spin text-amber-600 shrink-0" />
                  ) : (
                    <Volume2 size={11} className="text-amber-600 animate-pulse shrink-0" />
                  )}
                  <span className="font-bold text-amber-950 text-[10px] sm:text-[11px] shrink-0">
                    {ttsInfo.isLoading ? '루시 음성 준비 중...' : '루시 음성 안내 중'}
                  </span>
                  {ttsInfo.activeText && ttsInfo.activeText !== '__CONVERSATION__' && (
                    <span className="text-[9px] sm:text-[10px] text-amber-900/70 truncate max-w-[170px] sm:max-w-[340px]">
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

          {/* 👥 대화창 상담 대상자 프로필 독 바 (최대 4인 · 궁합/연애/시너지 모드) */}
          <ChatProfileDock
            profiles={activeProfiles}
            onAddClick={handleOpenAddChatProfile}
            onEditProfile={handleOpenEditChatProfile}
            onRemoveProfile={handleRemoveChatProfile}
            maxProfiles={4}
          />

          {/* 💡 추천 질문 가로 나열 바 & 추천질문 라이브러리 (13P · 77선) 버튼 */}
          <div className="w-full flex items-center gap-1 sm:gap-1.5 py-0">
            {/* ✨ 13페이지 추천질문 전체보기 모달 트리거 버튼 */}
            <button
              id="lucy-open-prompt-library-btn"
              type="button"
              onClick={() => setIsPromptLibraryOpen(true)}
              className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 hover:from-amber-500/25 hover:to-yellow-500/30 border border-amber-400/80 dark:border-amber-500/60 text-amber-900 dark:text-amber-200 text-[10px] sm:text-[11px] font-bold transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-1 shadow-2xs group"
              title="사주·타로·점성술·자미두수 77가지 추천질문 (13페이지 전편)"
              aria-label="추천질문 13페이지 라이브러리 열기"
            >
              <Sparkles size={11} className="sm:w-3 sm:h-3 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>추천질문</span>
              <span className="px-1 py-0.1 rounded-full text-[8px] sm:text-[9px] bg-amber-500 text-slate-950 font-black">
                13P
              </span>
            </button>

            {/* 새로고침 셔플 버튼 */}
            <button
              type="button"
              onClick={refreshPrompts}
              className="p-1 sm:p-1.5 rounded-lg text-amber-600 hover:text-amber-800 bg-amber-50/90 hover:bg-amber-100 border border-amber-200/80 transition-all shrink-0 cursor-pointer active:scale-90 flex items-center gap-1 shadow-2xs"
              title="새로운 맞춤 추천 질문으로 변경 (랜덤 셔플)"
              aria-label="추천 질문 새로고침"
            >
              <RefreshCw size={10} className={`sm:w-2.5 sm:h-2.5 text-amber-600 ${isLucyGenerating ? 'animate-spin' : ''}`} />
            </button>

            {/* 가로 스크롤 추천 질문 리스트 */}
            {currentPrompts.length > 0 && (
              <div className="flex-1 flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
                {currentPrompts.map((promptText) => (
                  <button
                    key={promptText}
                    type="button"
                    onClick={() => handleSelectRecommendationChip(promptText)}
                    disabled={isLucyGenerating}
                    className="shrink-0 px-2 sm:px-2.5 py-0.5 rounded-full bg-slate-50/90 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-[10px] sm:text-[11px] font-medium text-slate-700 hover:text-amber-950 transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-40 whitespace-nowrap"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 border border-slate-200 focus-within:border-amber-400 focus-within:bg-white rounded-xl sm:rounded-2xl px-2 sm:px-3 py-0.5 sm:py-1 min-h-[34px] sm:min-h-[40px] transition-all shadow-inner">
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
              accept="image/*" 
              className="hidden" 
            />

            {/*  Image / Camera Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
              title="사진/이미지 첨부 (멀티모달 비전 분석)"
            >
              <Camera size={15} className="sm:w-4 sm:h-4" />
            </button>

            {/* 🔊 Auto-TTS Quick Toggle Button (입력창 바로 옆 원클릭 토글) */}
            <button
              type="button"
              onClick={toggleAutoTts}
              className={`p-1 sm:p-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                isAutoTts
                  ? 'text-emerald-600 bg-emerald-100/80 border border-emerald-300 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/70'
              }`}
              title={isAutoTts ? '루시 답변 자동 음성 읽기 켜짐 (클릭 시 끄기)' : '자동 음성 읽기 꺼짐 (클릭 시 켜기)'}
              aria-label={isAutoTts ? '음성 자동 연속 읽기 켜짐' : '음성 자동 읽기 꺼짐'}
            >
              {isAutoTts ? <Volume2 size={15} className="sm:w-4 sm:h-4 text-emerald-600 animate-pulse" /> : <VolumeX size={15} className="sm:w-4 sm:h-4" />}
            </button>

            {/* Textarea Wrapper for Ghost Typewriter Overlay */}
            <div className="relative flex-1 min-h-[28px] sm:min-h-[32px] flex items-center">
              {/* 옅은색 동적 예시 고민 타이프라이터 플레이스홀더 (호리 스타일) */}
              <DynamicGhostInputPlaceholder
                prompts={dynamicGhostPrompts}
                isVisible={!input && !isLucyGenerating}
                pauseDuration={12000}
                typingSpeed={45}
                deletingSpeed={20}
                onCurrentPromptChange={(prompt) => {
                  currentGhostPromptRef.current = prompt;
                }}
              />

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
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
                placeholder={
                  isLucyGenerating
                    ? '루시가 답변을 생성하는 중입니다...'
                    : ''
                }
                rows={1}
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-[12px] sm:text-sm resize-none outline-none leading-snug sm:leading-relaxed min-h-[28px] sm:min-h-[32px] max-h-[88px] py-0.5 sm:py-1 z-10"
              />
            </div>

            {/* Send or Stop Generation Button */}
            {isLucyGenerating ? (
              <button
                type="button"
                onClick={handleAbortGeneration}
                className="w-7 h-7 sm:w-8 sm:h-8 p-1 sm:p-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg sm:rounded-xl transition-all shadow-md cursor-pointer shrink-0 active:scale-95 flex items-center justify-center animate-pulse"
                title="답변 생성 중단 (클릭 시 대기를 즉시 멈추고 입력창이 활성화됩니다)"
                aria-label="생성 중단"
              >
                <Square size={12} className="sm:w-3.5 sm:h-3.5 fill-current text-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() && !attachedImage}
                className="w-7 h-7 sm:w-8 sm:h-8 p-1 sm:p-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-30 text-slate-950 font-bold rounded-lg sm:rounded-xl transition-all shadow-sm cursor-pointer shrink-0 active:scale-95 flex items-center justify-center"
                title="메시지 전송"
              >
                <Send size={13} className="sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>
        </div>
      </footer>

      {/*  제제 님의 소울 프로필 퀵뷰 모달 */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 relative space-y-4"
            >
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-white flex items-center justify-center shadow-sm">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{userDisplayName} 님의 소울 프로필</h3>
                  <p className="text-xs text-slate-500">Google 계정 연동 및 사주·에너지 요약</p>
                </div>
              </div>

              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between border-b border-amber-200/60 pb-2">
                  <span className="text-slate-500 font-medium">소울 닉네임</span>
                  <span className="font-bold text-amber-900">{userDisplayName}</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 pb-2">
                  <span className="text-slate-500 font-medium">연동 이메일</span>
                  <span className="font-medium text-slate-800 truncate max-w-[200px]">{firebaseUser?.email || '미연동'}</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 pb-2">
                  <span className="text-slate-500 font-medium">사주 본원 (일주)</span>
                  <span className="font-bold text-amber-900">{sajuInfo ? sajuInfo.shortDigest : '기본 분석 진행 중'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">상담 선호 스타일</span>
                  <span className="font-bold text-emerald-800">{sharedState?.userProfile?.psych?.counselingStyle || '따뜻하고 직관적인 공감'}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ️ 대화 초기화 확인 모달 */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">대화 초기화 & 새 대화 시작</h3>
                  <p className="text-xs text-slate-500">대화창을 비우고 상쾌하게 새로 시작합니다</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  지금까지 나눈 소중한 대화 내역은 루시의 <span className="font-bold text-indigo-600">영구 기억(Soul Memory) 아카이브</span>에 안전하게 요약 보존됩니다.
                </p>
                <p className="text-slate-500">
                  대화창을 깨끗한 새 화면으로 초기화할까요?
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => {
                    abortGenerating('lucy');
                    stopTTS();
                    clearPersonaMessages('lucy');
                    setIsResetConfirmOpen(false);
                    setResetToast('대화가 깨끗하게 초기화되었습니다.');
                    setTimeout(() => setResetToast(null), 3000);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>초기화하기</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/*  Reset Feedback Toast */}
      <AnimatePresence>
        {resetToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white text-xs font-medium shadow-xl backdrop-blur-md flex items-center gap-2 border border-white/10"
          >
            <span>{resetToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
      />

      {/* End of content */}

    </div>
  );
}
