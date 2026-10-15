/**
 * OmniWarp Engine & Context Synthesizer
 * 1ms Active View Serialization + <100ms SLM Intent Synthesis + Navigation Routing
 * Fully Unified with Prism Toss Pipeline & Registry
 */

import { OmniWarpContext, OmniWarpTarget, WarpPhase, WarpForceMetrics, BigBangCommitEventDetail } from './types';
import { forceToAiTemperature, RADIAL_WARP_APPS } from './forceSensor';
import { omniWarpAudio } from './omniWarpAudio';
import { triggerHaptic } from './omniWarpHaptics';
import { getTossRule, CHANNEL_TOSS_RULES } from '@/lib/prismTossRegistry';
import { sendPrismToss } from '@/lib/prismToss';
import {
  getRankedWormholeApps,
  getLowestRankedWormholeApp,
  getWhiteholeRecommendedApp,
  getBlackholeRecommendedApp,
  getWormholeAppByGauge,
  isDisallowedWarpDestination,
} from './wormholeSpectrum';

export { isDisallowedWarpDestination };
import { getPrismRouteByPathOrId, resolveCanonicalPath } from '@/lib/prismRouteRegistry';
import { peekShuffledWormholeDestination } from './wormholeShuffleEngine';
import {
  extractLatestDialogueContext,
  recordCrossAppDialogue,
  synthesizePersonaHandoffPrompt,
} from '@/lib/prismPersonaSync';

const OMNIWARP_STORAGE_KEY = 'prism_active_omniwarp_payload';

/**
 * 1단계: 인앱 뷰 직렬화 (1ms 내 완료)
 */
export function serializeCurrentView(activePath: string): OmniWarpContext {
  const normPath = (activePath || '/').toLowerCase();
  let title = '프롤로그 허브';
  let summary = '모든 채널의 영감과 여정이 교차하는 중심 허브';
  let primarySubject = '우주적 시선과 오늘의 상태';
  const sessionData: Record<string, any> = {};

  // 1. 최신 대화 맥락(유저 질문 + AI 페르소나 응답) 실시간 캡처 & 동기화
  const lastDialogue = extractLatestDialogueContext(activePath);
  if (lastDialogue) {
    sessionData.lastDialogue = lastDialogue;
    recordCrossAppDialogue(lastDialogue);
    if (lastDialogue.lastUserMessage) {
      summary = `[${lastDialogue.sourcePersonaName}] "${lastDialogue.lastUserMessage.slice(0, 60)}"`;
      primarySubject = `이전 대화 맥락: ${lastDialogue.lastUserMessage.slice(0, 40)}`;
    }
  }

  if (normPath.includes('trinity')) {
    title = '트리니티 오라클';
    summary = '내면아이 무의식과 3장의 타로 카드 상징';
    primarySubject = '운명과 무의식의 상징 탐색';
    try {
      const oracleItem = localStorage.getItem('prism_oracle_last_reading');
      if (oracleItem) sessionData.oracleReading = JSON.parse(oracleItem);
    } catch (_) {}
  } else if (normPath.includes('muse')) {
    title = '뮤즈 예술처방';
    summary = '명화·명시·명곡 3위 일체 예술적 공명';
    primarySubject = '감성과 심미적 카타르시스';
    try {
      const tossData = sessionStorage.getItem('prism_active_toss_payload');
      if (tossData) sessionData.artContext = JSON.parse(tossData);
    } catch (_) {}
  } else if (normPath.includes('orange')) {
    title = '오렌지 성찰 & 별에게 소원빌기';
    summary = '불안과 감정을 성찰하고 밤하늘 별에게 소망을 띄우는 비밀의 숲';
    primarySubject = '내면 성찰과 별에게 소원빌기';
  } else if (normPath.includes('heal')) {
    title = '호오포노포노 & 아우라 치유';
    summary = '미안·용서·감사·사랑 4마디 감정 정화 의식';
    primarySubject = '내면 상처 정화와 에너지 회복';
  } else if (normPath.includes('bluebird')) {
    title = '파랑새의 일상 행복';
    summary = '소소한 감사와 일상의 온기 기록';
    primarySubject = '감사와 평온';
  } else if (normPath.includes('epilogue')) {
    title = '에필로그 밤 서재';
    summary = '오늘의 영감과 감정을 한 편의 수필로 엮는 회고';
    primarySubject = '하루 마감과 영감의 정돈';
  } else if (normPath.includes('chat') || normPath.includes('lucy')) {
    title = '루시 1:1 심층 대화';
    summary = '영혼의 가이드 루시와의 지혜로운 공명';
    primarySubject = '내면의 고민과 깊은 치유 대화';
  } else if (normPath.includes('orb') || normPath.includes('crystal') || normPath.includes('gateway')) {
    title = '크리스탈 오브';
    summary = '마음속 질문을 투영하는 독립 직관 도구';
    primarySubject = '직관과 영적 해답 점술';
    try {
      const orbRaw = localStorage.getItem('prism_orb_latest_scrying');
      if (orbRaw) {
        const orb = JSON.parse(orbRaw);
        sessionData.orbInsight = orb;
        if (orb.keyTheme && orb.directAnswer) {
          summary = `[직관: ${orb.keyTheme}] ${orb.directAnswer.slice(0, 60)}`;
          primarySubject = `직관의 해답 (${orb.keyTheme}): ${orb.directAnswer.slice(0, 40)}`;
        }
      }
    } catch (_) {}
  }

  return {
    activeRoute: activePath,
    activeTitle: title,
    summary,
    primarySubject,
    sessionData,
    capturedAt: Date.now(),
  };
}

export const ORB_SITE_RUNES: Record<string, { symbol: string; name: string; meaning: string }> = {
  lucy: { symbol: 'ᛞ', name: 'Dagaz', meaning: '새벽의 빛과 자각' },
  chat: { symbol: 'ᛞ', name: 'Dagaz', meaning: '새벽의 빛과 자각' },
  orb: { symbol: 'ᛟ', name: 'Othala', meaning: '직관의 성소' },
  crystal: { symbol: 'ᛟ', name: 'Othala', meaning: '직관의 성소' },
  gateway: { symbol: 'ᛟ', name: 'Othala', meaning: '직관의 성소' },
  orange: { symbol: 'ᛋ', name: 'Sowilo', meaning: '태양과 실행' },
  muse: { symbol: 'ᚹ', name: 'Wunjo', meaning: '예술과 기쁨' },
  oracle: { symbol: 'ᛈ', name: 'Pertho', meaning: '운명과 무의식' },
  trinity: { symbol: 'ᛈ', name: 'Pertho', meaning: '운명과 무의식' },
  hoponopono: { symbol: 'ᚷ', name: 'Gebo', meaning: '화해와 정화' },
  lettinggo: { symbol: 'ᛉ', name: 'Algiz', meaning: '보호와 내려놓음' },
  heal: { symbol: 'ᛉ', name: 'Algiz', meaning: '보호와 내려놓음' },
  bluebird: { symbol: 'ᛒ', name: 'Berkana', meaning: '치유와 안식' },
  epilogue: { symbol: 'ᚨ', name: 'Ansuz', meaning: '지혜와 마감' },
  handbook: { symbol: 'ᚱ', name: 'Raidho', meaning: '영혼의 여정과 바이블' },
  rebible: { symbol: 'ᚱ', name: 'Raidho', meaning: '영혼의 여정과 바이블' },
  library: { symbol: 'ᛗ', name: 'Mannaz', meaning: '영혼의 지식 도서관' },
  hub: { symbol: 'ᚠ', name: 'Fehu', meaning: '새로운 시작과 운명의 창조' },
  universe: { symbol: 'ᚠ', name: 'Fehu', meaning: '새로운 시작과 운명의 창조' },
};

export function getOrbRunicSigil(destId: string): { symbol: string; name: string; meaning: string } {
  const route = getPrismRouteByPathOrId(destId);
  if (route) {
    return { symbol: route.runeSymbol, name: route.runeName, meaning: route.runeMeaning };
  }
  const norm = (destId || '').toLowerCase().replace('/', '');
  return ORB_SITE_RUNES[norm] || { symbol: 'ᚲ', name: 'Kenaz', meaning: '프리즘 우주' };
}

export interface QuantumDestination {
  id: string;
  name: string;
  subName: string;
  path: string;
  icon: string;
  runeSymbol: string;
  runeName: string;
  themeColor: string;
  accentGlow: string;
  description: string;
}

/**
 * 🌌 블랙홀 탭 시 무작위 불시착 가능한 프리즘 우주 실존 장소 및 활성 기능 풀 (7대 차원)
 * (삭제되거나 차단된 profile, handbook, library, omniwarp, orb, lucy/chat 등은 엄격 배제)
 */
export const QUANTUM_BLACKHOLE_DESTINATIONS: QuantumDestination[] = [
  {
    id: 'orange',
    name: '오렌지 별에게 소원빌기',
    subName: '감정 성찰과 별에게 소원빌기',
    path: '/orange',
    icon: '🍊',
    runeSymbol: 'ᛋ',
    runeName: 'Sowilo',
    themeColor: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.85)',
    description: '비밀의 숲 밤하늘 별에 마음의 소망을 띄우는 감정 성찰',
  },
  {
    id: 'trinity',
    name: '트리니티 오라클',
    subName: '3장 타로 운명 나침반',
    path: '/trinity',
    icon: '🔺',
    runeSymbol: 'ᛈ',
    runeName: 'Pertho',
    themeColor: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.85)',
    description: '3장의 타로 카드와 사주 데이터로 무의식 상징 탐색',
  },
  {
    id: 'heal',
    name: '아우라 치유',
    subName: '호오포노포노 & 생체 에너지',
    path: '/heal',
    icon: '🌊',
    runeSymbol: 'ᛉ',
    runeName: 'Algiz',
    themeColor: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.85)',
    description: '미안·용서·감사·사랑 4마디 감정 정화와 생체 에너지 회복',
  },
  {
    id: 'bluebird',
    name: '파랑새의 성소',
    subName: '영혼의 평온과 감사',
    path: '/bluebird',
    icon: '🐦',
    runeSymbol: 'ᛒ',
    runeName: 'Berkana',
    themeColor: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.85)',
    description: '지친 마음에 일상의 평온과 행복, 따뜻한 감사의 온기 기록',
  },
  {
    id: 'muse',
    name: '뮤즈 예술처방',
    subName: '명화·명시·명곡 삼위일체',
    path: '/muse',
    icon: '🎨',
    runeSymbol: 'ᚹ',
    runeName: 'Wunjo',
    themeColor: '#ec4899',
    accentGlow: 'rgba(236, 72, 153, 0.85)',
    description: '고민과 감정에 공명하는 세계적 예술작품 삼위일체 심미 처방',
  },
  {
    id: 'epilogue',
    name: '에필로그 밤 서재',
    subName: '영감의 밤 서재 일기',
    path: '/epilogue',
    icon: '📖',
    runeSymbol: 'ᚨ',
    runeName: 'Ansuz',
    themeColor: '#34d399',
    accentGlow: 'rgba(52, 211, 153, 0.85)',
    description: '오늘의 영감과 감정을 한 편의 수필처럼 정리하는 회고',
  },
  {
    id: 'hub',
    name: '프롤로그 허브',
    subName: '우주의 시초와 중심',
    path: '/',
    icon: '🌌',
    runeSymbol: 'ᚲ',
    runeName: 'Kenaz',
    themeColor: '#00f0ff',
    accentGlow: 'rgba(0, 240, 255, 0.85)',
    description: '모든 차원의 영감과 가능성이 수렴하는 우주의 시초 허브',
  },
];

export function pickRandomQuantumDestination(
  currentRoute: string,
  seedTime?: number
): QuantumDestination {
  const normCurrent = (currentRoute || '/').toLowerCase().split('?')[0].replace(/\/$/, '') || '/';
  
  // 현재 머물고 있는 장소 및 삭제/차단된 장소를 완벽히 배제
  const candidates = QUANTUM_BLACKHOLE_DESTINATIONS.filter((d) => {
    if (isDisallowedWarpDestination(d.id) || isDisallowedWarpDestination(d.path)) return false;
    const normDest = d.path.toLowerCase().replace(/\/$/, '') || '/';
    return normDest !== normCurrent;
  });

  const validPool = QUANTUM_BLACKHOLE_DESTINATIONS.filter(
    (d) => !isDisallowedWarpDestination(d.id) && !isDisallowedWarpDestination(d.path)
  );

  const pool = candidates.length > 0 ? candidates : validPool;
  const time = seedTime ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const hash = Math.floor(time * 1000) ^ (Math.floor(time) * 1103515245) ^ 0x5bd1e995;
  const idx = Math.abs(hash) % pool.length;
  return pool[idx];
}

export interface ChannelSubmenuDef {
  id: string;
  name: string;
  subName: string;
  path: string;
  icon: string;
  themeColor: string;
  accentGlow: string;
  description: string;
  runeSymbol: string;
  runeName: string;
}

export const CHANNEL_SUBMENUS: Record<
  string,
  {
    whitehole: ChannelSubmenuDef; // 1번째 처음 메뉴
    mirrorhole: ChannelSubmenuDef; // 2번째 메뉴
    blackhole: ChannelSubmenuDef; // 3번째 메뉴
  }
> = {
  hub: {
    whitehole: {
      id: 'universe',
      name: '프리즘 유니버스',
      subName: '모든 차원의 시작과 7대 옴니버스 광장',
      path: '/',
      icon: '🌌',
      themeColor: '#00f0ff',
      accentGlow: 'rgba(0, 240, 255, 0.95)',
      description: '프리즘의 7대 우주와 모든 여정이 시작되는 중심 허브 광장입니다.',
      runeSymbol: 'ᚲ',
      runeName: 'Kenaz',
    },
    mirrorhole: {
      id: 'todo',
      name: 'ToDo',
      subName: '데일리 웰니스 & 라이프 실행 과업',
      path: '/todo',
      icon: '📋',
      themeColor: '#6366f1',
      accentGlow: 'rgba(99, 102, 241, 0.95)',
      description: '몸과 마음, 영혼의 성장을 이끄는 오늘의 실천 ToDo와 라이프 퀘스트입니다.',
      runeSymbol: 'ᛟ',
      runeName: 'Othala',
    },
    blackhole: {
      id: 'ecpr',
      name: 'eCPR 영혼 응급소생',
      subName: '감정 위기 구조와 심연의 응급 소생술',
      path: '/ecpr',
      icon: '🕳️',
      themeColor: '#ef4444',
      accentGlow: 'rgba(239, 68, 68, 0.95)',
      description: '극심한 정신적 고통이나 감정적 위기 상태에서 즉각적인 소생 프로토콜을 가동합니다.',
      runeSymbol: 'ᚦ',
      runeName: 'Thurisaz',
    },
  },
  orange: {
    whitehole: {
      id: 'orange-secret',
      name: '비밀의 방 성찰',
      subName: '내면 성찰과 솔직한 감정 고백',
      path: '/orange?tab=secret',
      icon: '🍊',
      themeColor: '#f97316',
      accentGlow: 'rgba(249, 115, 22, 0.95)',
      description: '비밀의 방에서 나만의 감정과 생각을 솔직하게 털어놓고 성찰합니다.',
      runeSymbol: 'ᛋ',
      runeName: 'Sowilo',
    },
    mirrorhole: {
      id: 'orange-synergy',
      name: '시너지 카탈리스트',
      subName: '오렌지 영혼 촉매와 채널 연계',
      path: '/orange?tab=synergy',
      icon: '⚡',
      themeColor: '#fb923c',
      accentGlow: 'rgba(251, 146, 60, 0.95)',
      description: '오렌지 채널의 감정 에너지를 다른 차원들과 결합하는 촉매 작용을 가동합니다.',
      runeSymbol: 'ᚲ',
      runeName: 'Kenaz',
    },
    blackhole: {
      id: 'orange-wishingWell',
      name: '소원의 우물',
      subName: '무의식의 소망을 띄우는 신비한 우물',
      path: '/orange?tab=wishingWell',
      icon: '🪙',
      themeColor: '#ea580c',
      accentGlow: 'rgba(234, 88, 12, 0.95)',
      description: '마음 깊은 곳의 갈망과 소원을 신비로운 우물에 띄워 우주로 전송합니다.',
      runeSymbol: 'ᚷ',
      runeName: 'Gebo',
    },
  },
  trinity: {
    whitehole: {
      id: 'trinity-daily',
      name: 'SAJU',
      subName: '영혼의 설계도 사주 오행 & 만세력 리포트',
      path: '/trinity?tab=destiny',
      icon: '🧭',
      themeColor: '#eab308',
      accentGlow: 'rgba(234, 179, 8, 0.95)',
      description: '생년월일시 기반 사주 4주 8자와 5대 오행 밸런스, 2026 세운을 정밀 분석합니다.',
      runeSymbol: 'ᛈ',
      runeName: 'Pertho',
    },
    mirrorhole: {
      id: 'trinity-oracle',
      name: '트리니티 오라클',
      subName: '운명의 나침반 심층 오라클 리딩',
      path: '/trinity?tab=oracle',
      icon: '🔮',
      themeColor: '#facc15',
      accentGlow: 'rgba(250, 204, 21, 0.95)',
      description: '운명의 기로에서 가장 현명한 길을 비추는 트리니티 오라클의 계시를 마주합니다.',
      runeSymbol: 'ᛞ',
      runeName: 'Dagaz',
    },
    blackhole: {
      id: 'trinity-tarot',
      name: '타로 스프레드',
      subName: '3장 타로 카드 무의식 탐색',
      path: '/trinity?tab=tarot',
      icon: '🎴',
      themeColor: '#ca8a04',
      accentGlow: 'rgba(202, 138, 4, 0.95)',
      description: '과거, 현재, 미래를 아우르는 3장의 타로 카드로 무의식의 심연을 들여다봅니다.',
      runeSymbol: 'ᛟ',
      runeName: 'Othala',
    },
  },
  heal: {
    whitehole: {
      id: 'heal-meditation',
      name: '내려놓음 명상',
      subName: '세도나 릴리즈 & 깊은 내려놓음',
      path: '/heal?tab=meditation',
      icon: '🧘',
      themeColor: '#10b981',
      accentGlow: 'rgba(16, 185, 129, 0.95)',
      description: '마음의 묵은 집착과 긴장을 부드럽게 흘려보내는 세도나 내려놓음 명상입니다.',
      runeSymbol: 'ᛉ',
      runeName: 'Algiz',
    },
    mirrorhole: {
      id: 'heal-synergy',
      name: '생체 에너지 성소',
      subName: '신체 오행 조율 & 생체 에너지 정화',
      path: '/heal?tab=synergy',
      icon: '🌊',
      themeColor: '#06b6d4',
      accentGlow: 'rgba(6, 182, 212, 0.95)',
      description: '오행 밸런스와 생체 리듬을 조율하여 몸과 마음에 활력을 충전합니다.',
      runeSymbol: 'ᛚ',
      runeName: 'Laguz',
    },
    blackhole: {
      id: 'heal-oneMinute',
      name: '1분 감정 정화',
      subName: '즉각적인 호오포노포노 정화 리셋',
      path: '/heal?tab=oneMinute',
      icon: '⏱️',
      themeColor: '#059669',
      accentGlow: 'rgba(5, 150, 105, 0.95)',
      description: '미안합니다, 용서하세요, 감사합니다, 사랑합니다 4마디로 1분 만에 감정을 정화합니다.',
      runeSymbol: 'ᚷ',
      runeName: 'Gebo',
    },
  },
  bluebird: {
    whitehole: {
      id: 'bluebird-daily',
      name: '호오포노포노 정화',
      subName: '영혼의 평온과 감사 리셋',
      path: '/bluebird?tab=daily',
      icon: '🕊️',
      themeColor: '#38bdf8',
      accentGlow: 'rgba(56, 189, 248, 0.95)',
      description: '일상의 상처와 피로를 정화하고 내면의 평온과 감사의 빛을 밝힙니다.',
      runeSymbol: 'ᛒ',
      runeName: 'Berkana',
    },
    mirrorhole: {
      id: 'bluebird-synergy',
      name: '트랜스뮤테이션',
      subName: '파랑새 시너지 변용 매트릭스',
      path: '/bluebird?tab=synergy',
      icon: '💎',
      themeColor: '#0ea5e9',
      accentGlow: 'rgba(14, 165, 233, 0.95)',
      description: '부정적인 에너지를 긍정적인 치유의 힘으로 전환하는 변용의 장입니다.',
      runeSymbol: 'ᛞ',
      runeName: 'Dagaz',
    },
    blackhole: {
      id: 'bluebird-secretMessage',
      name: '비밀 편지',
      subName: '시간을 넘어 전하는 위로의 편지',
      path: '/bluebird?tab=secretMessage',
      icon: '💌',
      themeColor: '#0284c7',
      accentGlow: 'rgba(2, 132, 199, 0.95)',
      description: '지친 나에게 또는 소중한 존재에게 보내는 따뜻한 비밀 편지를 봉인합니다.',
      runeSymbol: 'ᚹ',
      runeName: 'Wunjo',
    },
  },
  muse: {
    whitehole: {
      id: 'muse-artRecommendation',
      name: '예술처방 큐레이션',
      subName: '명화·명시·명곡 삼위일체 처방',
      path: '/muse?tab=artRecommendation',
      icon: '🎨',
      themeColor: '#ec4899',
      accentGlow: 'rgba(236, 72, 153, 0.95)',
      description: '현재 마음에 공명하는 세계적 명화, 명시, 클래식 명곡을 삼위일체로 큐레이션합니다.',
      runeSymbol: 'ᚹ',
      runeName: 'Wunjo',
    },
    mirrorhole: {
      id: 'muse-synergy',
      name: '뮤즈 마스터클래스',
      subName: '창작과 심미적 카타르시스 시너지',
      path: '/muse?tab=synergy',
      icon: '🎭',
      themeColor: '#d946ef',
      accentGlow: 'rgba(217, 70, 239, 0.95)',
      description: '예술적 영감을 일상의 창작 에너지로 승화하는 뮤즈 마스터클래스입니다.',
      runeSymbol: 'ᚲ',
      runeName: 'Kenaz',
    },
    blackhole: {
      id: 'muse-roleModel',
      name: '롤모델 메이트',
      subName: '위대한 예술가와의 영혼 대화',
      path: '/muse?tab=roleModel',
      icon: '👥',
      themeColor: '#a855f7',
      accentGlow: 'rgba(168, 85, 247, 0.95)',
      description: '역사 속 위대한 거장들과 깊은 예술적 통찰과 고민을 나눕니다.',
      runeSymbol: 'ᛗ',
      runeName: 'Mannaz',
    },
  },
  epilogue: {
    whitehole: {
      id: 'epilogue-diary',
      name: '에필로그 서재 일기',
      subName: '오늘 하루의 영감과 사유 회고',
      path: '/epilogue?tab=diary',
      icon: '📖',
      themeColor: '#a855f7',
      accentGlow: 'rgba(168, 85, 247, 0.95)',
      description: '하루 동안 마주한 모든 영감과 사유를 한 편의 수필처럼 정리하는 서재 일기입니다.',
      runeSymbol: 'ᚨ',
      runeName: 'Ansuz',
    },
    mirrorhole: {
      id: 'epilogue-archive',
      name: '영감 아카이브',
      subName: '기록된 사유의 보고',
      path: '/epilogue?tab=diary',
      icon: '📚',
      themeColor: '#10b981',
      accentGlow: 'rgba(16, 185, 129, 0.95)',
      description: '그동안 쌓아온 사유와 영감의 기록을 차분히 되돌아봅니다.',
      runeSymbol: 'ᛗ',
      runeName: 'Mannaz',
    },
    blackhole: {
      id: 'epilogue-synergy',
      name: '시너지 연대기',
      subName: '영혼의 발자취와 종합 분석',
      path: '/epilogue?tab=synergy',
      icon: '📊',
      themeColor: '#8b5cf6',
      accentGlow: 'rgba(139, 92, 246, 0.95)',
      description: '모든 채널에서 축적된 데이터와 영혼의 성장 추이를 종합 분석합니다.',
      runeSymbol: 'ᛃ',
      runeName: 'Jera',
    },
  },
};

/**
 * 2단계: 터치 압력/온도 기반 온디바이스 SLM 맥락 합성 (<100ms)
 * - 웜홀 (탭): 시공간 특이점에 빨려 들어가 임의의 장소나 기능으로 양자 도약
 * - 제자리 홀드: 화이트홀(빛비춤) ➔ 블랙홀(어두운 심연) 도약
 * - 사건의 지평선 (드래그): 해당 조준 채널의 1번째 메뉴(화이트홀), 2번째 메뉴(미러홀), 3번째 메뉴(블랙홀) 도약
 */
export function synthesizeWarpTarget(context: OmniWarpContext, metrics: WarpForceMetrics): OmniWarpTarget {
  const T = forceToAiTemperature(metrics.virtualForce);

  // 워프 불가 목적지 필터링
  const sanitizeDest = (dest: any) => {
    if (!dest || isDisallowedWarpDestination(dest.id) || isDisallowedWarpDestination(dest.path)) {
      return {
        id: 'hub',
        name: '프리즘 홈',
        subName: '프리즘 우주의 중심',
        path: '/',
        icon: '🌌',
        description: '모든 차원의 영감과 가능성이 수렴하는 우주의 시초 허브',
        themeColor: '#00f0ff',
      };
    }
    return dest;
  };

  // 🎯 0단계: 7대 앱 방사형 조이스틱 튕기기/조준 = 사건의 지평선 (Event Horizon)
  // 사건의 지평선에서:
  // - 화이트홀: 해당 조준 채널의 1번째 처음 메뉴
  // - 미러홀: 해당 조준 채널의 2번째 메뉴
  // - 블랙홀: 해당 조준 채널의 3번째 메뉴
  if (
    metrics.radialSectorIndex !== undefined &&
    metrics.radialSectorIndex >= 0 &&
    metrics.radialSectorIndex < RADIAL_WARP_APPS.length &&
    !metrics.isAborted
  ) {
    const radialApp = RADIAL_WARP_APPS[metrics.radialSectorIndex];
    const isWhiteholeMode = metrics.eventHorizonMode === 'whitehole' || metrics.phase === 'whitehole';

    const channelSub = CHANNEL_SUBMENUS[radialApp.id] || CHANNEL_SUBMENUS.hub;
    // 미러홀 제거: 탭은 화이트홀(1번 메뉴), 홀드는 블랙홀(심연 메뉴)
    const dest = isWhiteholeMode ? channelSub.whitehole : (channelSub.blackhole || channelSub.mirrorhole);

    const safePath = resolveCanonicalPath(dest.path);
    const modeLabel = isWhiteholeMode ? '화이트홀' : '블랙홀';
    const modeEmoji = isWhiteholeMode ? '☀️' : '🕳️';
    const menuOrder = isWhiteholeMode ? '처음 메뉴' : '심연 메뉴';

    return {
      id: dest.id,
      icon: dest.icon || radialApp.icon,
      phase: 'event_horizon',
      eventHorizonMode: isWhiteholeMode ? 'whitehole' : 'blackhole',
      gauge: Math.max(0.35, metrics.virtualForce),
      aiTemperature: T,
      title: dest.name,
      actionType: `event_horizon_${isWhiteholeMode ? 'whitehole' : 'blackhole'}_${radialApp.id}`,
      destinationPath: safePath,
      previewLabel: `[사건의 지평선 ${modeLabel}] ${modeEmoji} ${radialApp.name} · ${dest.name}`,
      previewDescription: `[${radialApp.name}] 채널의 ${menuOrder}인 [${dest.name} · ${dest.subName}]으로 즉시 도약합니다.`,
      themeColor: dest.themeColor || radialApp.themeColor || '#38bdf8',
      accentGlow: dest.accentGlow || radialApp.accentGlow,
      stageIndex: metrics.radialSectorIndex + 1,
      runeSymbol: dest.runeSymbol,
      runeName: dest.runeName,
    };
  }

  // 1. 제자리 탭 (가볍게 터치): 화이트홀 (빛비춤) ➔ 최상위 이성 채널(트리니티 오라클 등)
  if (metrics.phase === 'whitehole') {
    const whiteholeApp = getWhiteholeRecommendedApp(context.activeRoute);
    const dest = sanitizeDest(whiteholeApp);
    const safePath = resolveCanonicalPath(dest.path);
    return {
      id: dest.id,
      icon: dest.icon || '☀️',
      phase: 'whitehole',
      gauge: metrics.virtualForce,
      aiTemperature: T,
      title: dest.name,
      actionType: `omniwarp_whitehole_${dest.id}`,
      destinationPath: safePath,
      previewLabel: `[화이트홀 빛비춤] ☀️ ${dest.runeSymbol || 'ᛞ'} ${dest.name}`,
      previewDescription: `화이트홀의 찬란한 빛비춤 에너지를 타고 [${dest.name} · ${dest.subName}]으로 즉시 연결됩니다.`,
      themeColor: dest.themeColor || '#fde68a',
      accentGlow: dest.accentGlow || 'rgba(244, 114, 182, 0.95)',
      stageIndex: 1,
      runeSymbol: dest.runeSymbol || 'ᛞ',
      runeName: dest.runeName || 'Light',
    };
  }

  // 2. 웜홀 (Wormhole: 데일리 셔플 순환 - 당일 미방문 기능/페이지 우선 도약)
  if (metrics.phase === 'wormhole') {
    const { dest, stats } = peekShuffledWormholeDestination(context.activeRoute);
    const safePath = resolveCanonicalPath(dest.path);
    return {
      id: dest.id,
      icon: dest.icon,
      phase: 'wormhole',
      gauge: metrics.virtualForce,
      aiTemperature: T,
      title: dest.name,
      actionType: `wormhole_shuffle_${dest.id}`,
      destinationPath: safePath,
      previewLabel: `[웜홀 셔플 도약 · ${stats.visitedCount + 1}/${stats.totalCount}] 🌀 ${dest.runeSymbol} ${dest.name}`,
      previewDescription: stats.isRecycled
        ? `시공간 웜홀을 통과하여 [${dest.name} · ${dest.subName}]으로 도약합니다. (오늘 1바퀴 완주! 신규 셔플)`
        : `시공간 웜홀을 통과하여 [${dest.name} · ${dest.subName}]으로 차원 도약합니다. (오늘 탐험: ${stats.visitedCount + 1}/${stats.totalCount})`,
      themeColor: dest.themeColor || '#10b981',
      accentGlow: dest.accentGlow || 'rgba(16, 185, 129, 0.75)',
      stageIndex: 1,
      runeSymbol: dest.runeSymbol,
      runeName: dest.runeName,
    };
  }

  // 3. 제자리 홀드: 블랙홀 (어두운 심연) ➔ 최상위 감성·무의식 채널(뮤즈 예술처방, 오렌지 소원의 우물 등)
  const blackholeApp = getBlackholeRecommendedApp(context.activeRoute);
  const dest = sanitizeDest(blackholeApp);
  const safePath = resolveCanonicalPath(dest.path);
  return {
    id: dest.id,
    icon: dest.icon || '🕳️',
    phase: 'blackhole',
    gauge: metrics.virtualForce,
    aiTemperature: T,
    title: dest.name,
    actionType: `omniwarp_blackhole_${dest.id}`,
    destinationPath: safePath,
    previewLabel: `[블랙홀 어두운 심연] 🕳️ ${dest.runeSymbol || 'ᛟ'} ${dest.name}`,
    previewDescription: `블랙홀의 어두운 심연 특이점에 이끌려 [${dest.name} · ${dest.subName}]으로 연결됩니다.`,
    themeColor: dest.themeColor || '#a855f7',
    accentGlow: dest.accentGlow || 'rgba(168, 85, 247, 0.95)',
    stageIndex: 2,
    runeSymbol: dest.runeSymbol || 'ᛟ',
    runeName: dest.runeName || 'Deep',
  };
}

/**
 * 3단계: 빅뱅 커밋 (Big Bang Commit) 실행 및 내비게이션 라우팅
 * 원터치 자동 발화(Auto-Trigger) 및 통합 토스 엔진(sendPrismToss)과 100% 동기화
 */
export function executeBigBangCommit(
  target: OmniWarpTarget,
  context: OmniWarpContext,
  metrics: WarpForceMetrics
): void {
  // 워프 불가 목적지 가드 (프로필 및 단독 특수 페이지 차원 도약 원천 차단)
  if (
    isDisallowedWarpDestination(target.id || '') ||
    isDisallowedWarpDestination(target.destinationPath || '')
  ) {
    console.warn(`[OmniWarp Guard] Prohibited warp destination blocked: ${target.id} (${target.destinationPath})`);
    omniWarpAudio.playAbort();
    triggerHaptic('abort');
    return;
  }

  // 1. Audio & Haptic Impact Kick
  omniWarpAudio.playBigBang();
  triggerHaptic('bigbang');

  // 2. 통합 토스 페이로드 전송 (타깃 앱에서 getPendingPrismToss로 즉시 수신 및 자동 발화)
  const sourceApp = context.activeRoute.replace('/', '') || 'hub';
  const targetApp = target.destinationPath.replace('/', '') || 'hub';

  // AI 원터치 자동 발화 및 페르소나 상태 동기화 프롬프트(autoPrompt) 지능형 합성
  const lastDialogue = context.sessionData?.lastDialogue || extractLatestDialogueContext(context.activeRoute);
  let autoPrompt = synthesizePersonaHandoffPrompt(lastDialogue, targetApp);

  const orb = context.sessionData?.orbInsight;
  const oracle = context.sessionData?.oracleReading;
  const art = context.sessionData?.artContext;

  if (orb?.keyTheme && orb?.directAnswer && (targetApp.includes('lucy') || targetApp.includes('chat'))) {
    autoPrompt = `루시야, 방금 크리스탈 오브에서 [${orb.keyTheme}] 직관 해답을 마주했어:\n• 나의 질문: "${orb.query}"\n• 직관의 해답: "${orb.directAnswer}"\n• 실천 가이드: "${orb.actionSolution}"\n\n이 해답의 깊은 의미를 풀이해주고, 오늘 내가 당장 실천에 옮길 수 있는 구체적인 행동 가이드를 들려줘.`;
  } else if (oracle?.cards && oracle.cards.length > 0 && (targetApp.includes('lucy') || targetApp.includes('chat'))) {
    const cardNames = oracle.cards.map((c: any) => c.nameKo || c.name).join(', ');
    autoPrompt = `루시야, 방금 오라클 타로에서 [${cardNames}] 카드를 마주했어. 내 무의식의 상징과 현재 운의 흐름을 풀이해주고, 오늘 내가 취해야 할 마음가짐을 가이드해줘.`;
  } else if (art?.anchorArtworkTitle && (targetApp.includes('lucy') || targetApp.includes('chat'))) {
    autoPrompt = `루시야, 방금 뮤즈에서 명작 "${art.anchorArtworkTitle}"의 예술 처방을 감상했어. 이 예술적 울림과 영감을 바탕으로 내 마음에 힘이 되는 이야기를 들려줘.`;
  }

  sendPrismToss({
    sourceApp,
    targetApp,
    actionType: `omniwarp_${target.phase}`,
    contextMessage: `[옴니워프 ${target.phase === 'whitehole' ? '화이트홀' : target.phase === 'event_horizon' ? '사건의 지평선' : target.phase === 'wormhole' ? '웜홀' : '블랙홀'}] ${context.primarySubject || context.activeTitle}`,
    cards: context.sessionData?.oracleReading?.cards,
    anchorArtworkTitle: context.sessionData?.artContext?.anchorArtworkTitle,
    anchorArtQuote: context.sessionData?.artContext?.anchorArtQuote,
    autoTrigger: true,
    autoPrompt,
    personaDialogue: lastDialogue,
    orbInsight: orb,
    tossedAt: Date.now(),
  });

  // 3. Serialize OmniWarp Specific Payload
  const payload: BigBangCommitEventDetail = {
    phase: target.phase,
    target,
    context,
    metrics,
    timestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(OMNIWARP_STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(OMNIWARP_STORAGE_KEY, JSON.stringify(payload));
  } catch (_) {}

  // 4. Dispatch Big Bang Expansion Screen Event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('prism:bigbang_commit', {
        detail: payload,
      })
    );

    // 5. Smooth Navigation Routing with cosmological timing
    const safePath = resolveCanonicalPath(target.destinationPath);
    let targetTab: string | null = null;
    try {
      const parsedUrl = new URL(safePath, 'http://localhost');
      targetTab = parsedUrl.searchParams.get('tab');
    } catch (_) {}

    if (targetTab) {
      try {
        sessionStorage.setItem('prism_target_tab', targetTab);
      } catch (_) {}
    }

    setTimeout(() => {
      if (targetTab) {
        window.dispatchEvent(
          new CustomEvent('prism-tab-change', {
            detail: { tab: targetTab, path: safePath },
          })
        );
      }
      window.dispatchEvent(
        new CustomEvent('prism-navigate', {
          detail: { path: safePath },
        })
      );
      window.dispatchEvent(
        new CustomEvent('nav-click-active', {
          detail: { path: safePath, tab: targetTab },
        })
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 280);
  }
}
