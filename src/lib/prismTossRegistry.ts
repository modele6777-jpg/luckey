import { sendPrismToss, type PrismTossPayload } from './prismToss';
import { resolveCanonicalPath } from './prismRouteRegistry';
import { playAudioHaptic } from './audioHaptics';

export interface TossDestination {
  id: string;
  name: string;
  subName: string;
  icon: string;
  path: string;
  description: string;
  themeColor: string;
}

export const TOSS_DESTINATIONS: Record<string, TossDestination> = {
  muse: {
    id: 'muse',
    name: '뮤즈 예술처방',
    subName: '명화·명시·명곡 감상',
    icon: '🎨',
    path: '/muse',
    description: '고민과 상징에 공명하는 세계적 명작 3위 일체 큐레이션',
    themeColor: '#818cf8',
  },
  trinity: {
    id: 'trinity',
    name: '트리니티 오라클',
    subName: '사주·점성술·타로 나침반',
    icon: '🔮',
    path: '/trinity',
    description: '3장의 타로 카드로 무의식의 상징과 운명 메시지 도출',
    themeColor: '#c084fc',
  },
  oracle: {
    id: 'trinity',
    name: '트리니티 오라클',
    subName: '사주·점성술·타로 나침반',
    icon: '🔮',
    path: '/trinity',
    description: '3장의 타로 카드로 무의식의 상징과 운명 메시지 도출',
    themeColor: '#c084fc',
  },
  orange: {
    id: 'orange',
    name: '오렌지 성찰 & 별에게 소원빌기',
    subName: '감정 성찰과 별에게 소원빌기',
    icon: '🍊',
    path: '/orange',
    description: '불안과 감정을 성찰하고 밤하늘 별에게 소망을 띄우는 비밀의 숲',
    themeColor: '#fb923c',
  },
  heal: {
    id: 'heal',
    name: '아우라 신체 웰니스 & 호오포노포노',
    subName: '감정 정화와 생체 에너지',
    icon: '🌊',
    path: '/heal',
    description: '미안합니다·용서하세요·감사합니다·사랑합니다 4마디 정화와 에너지 회복',
    themeColor: '#06b6d4',
  },
  hoponopono: {
    id: 'heal',
    name: '아우라 신체 웰니스 & 호오포노포노',
    subName: '감정 정화와 생체 에너지',
    icon: '🌊',
    path: '/heal',
    description: '미안합니다·용서하세요·감사합니다·사랑합니다 4마디 정화와 에너지 회복',
    themeColor: '#06b6d4',
  },
  epilogue: {
    id: 'epilogue',
    name: '에필로그 하루 마감',
    subName: '영감의 밤 서재 일기',
    icon: '📖',
    path: '/epilogue',
    description: '오늘의 영감과 감정을 한 편의 수필처럼 정리하는 회고',
    themeColor: '#34d399',
  },
  lucy: {
    id: 'lucy',
    name: '루시 심층 대화',
    subName: '방금 맥락 이어서 상담',
    icon: '✨',
    path: '/chat',
    description: '방금 마주한 고민과 상징의 기억을 들고 루시와 1:1 심층 대화',
    themeColor: '#c084fc',
  },
  bluebird: {
    id: 'bluebird',
    name: '파랑새의 성소',
    subName: '영혼의 상처 치유와 행복',
    icon: '🐦',
    path: '/bluebird',
    description: '지친 마음에 일상의 평온과 행복, 따뜻한 감사의 온기를 되찾는 안식처',
    themeColor: '#38bdf8',
  },
  orb: {
    id: 'key',
    name: 'Key',
    subName: '40대 불안 치유 마음약방',
    icon: '🔑',
    path: '/key',
    description: '40가지 신체 접지형 마음 연습과 Dr. Z 도서 지식 처방',
    themeColor: '#0ea5e9',
  },
  calm: {
    id: 'key',
    name: 'Key',
    subName: '40대 불안 치유 마음약방',
    icon: '🔑',
    path: '/key',
    description: '40가지 신체 접지형 마음 연습과 Dr. Z 도서 지식 처방',
    themeColor: '#0ea5e9',
  },
  key: {
    id: 'key',
    name: 'Key',
    subName: '40대 불안 치유 마음약방',
    icon: '🔑',
    path: '/key',
    description: '40가지 신체 접지형 마음 연습과 Dr. Z 도서 지식 처방',
    themeColor: '#0ea5e9',
  },
  profile: {
    id: 'profile',
    name: '영혼 프로필 & 여정',
    subName: '내면 성향과 발자취',
    icon: '👤',
    path: '/profile',
    description: '나의 사주 성향, 여정 데이터와 영혼의 성장 발자취를 기록하는 프로필',
    themeColor: '#a78bfa',
  },
  handbook: {
    id: 'handbook',
    name: '지혜의 핸드북',
    subName: '영혼의 안내서 & 바이블',
    icon: '🧭',
    path: '/handbook',
    description: '삶의 방향과 지혜가 담긴 프리즘 영혼의 핸드북 가이드',
    themeColor: '#f59e0b',
  },
  library: {
    id: 'library',
    name: '영혼의 도서관',
    subName: '프리즘 지식 아카이브',
    icon: '🏛️',
    path: '/library',
    description: '모든 기록과 사유가 축적된 영혼의 도서관 아카이브',
    themeColor: '#6366f1',
  },
  omniwarp: {
    id: 'omniwarp',
    name: '옴니워프 유니버스 포털',
    subName: '시공간 초월 빅뱅 차원 도약',
    icon: '🌀',
    path: '/omniwarp',
    description: '화이트홀과 블랙홀을 교차하며 모든 사이트와 기능을 잇는 웜홀 포털',
    themeColor: '#00f0ff',
  },
  hub: {
    id: 'hub',
    name: '프롤로그 허브',
    subName: '프리즘 우주의 중심',
    icon: '🌌',
    path: '/',
    description: '모든 차원의 영감과 가능성이 수렴하는 우주의 시초 허브',
    themeColor: '#00f0ff',
  },
  prologue: {
    id: 'prologue',
    name: '프롤로그 (수다모드)',
    subName: '가벼운 수다 & 오늘의 두루마리',
    icon: '📖',
    path: '/prologue',
    description: '가벼운 일상 수다와 함께 새로운 시작, 오늘의 두루마리를 읽는 성소',
    themeColor: '#38bdf8',
  },
};

export interface ChannelTossRule {
  primary: TossDestination;
  secondary: TossDestination;
  tertiary: TossDestination;
  whitehole: TossDestination; // ☀️ 좌뇌적·의식적·이성적 추천순위 1위
  blackhole: TossDestination; // 🕳️ 우뇌적·무의식적·감성적 추천순위 1위
}

export const CHANNEL_TOSS_RULES: Record<string, ChannelTossRule> = {
  trinity: {
    primary: TOSS_DESTINATIONS.epilogue, // 좌뇌·이성: 사주/타로 메시지를 서재 일기로 정리
    secondary: TOSS_DESTINATIONS.muse,
    tertiary: TOSS_DESTINATIONS.orange,
    whitehole: TOSS_DESTINATIONS.epilogue, // ☀️ 좌뇌적·의식적·이성적 1위: 밤 서재의 체계적 기록과 회고
    blackhole: TOSS_DESTINATIONS.muse,     // 🕳️ 우뇌적·무의식적·감성적 1위: 명화·명시·명곡 삼위일체 예술 공명
  },
  oracle: {
    primary: TOSS_DESTINATIONS.epilogue,
    secondary: TOSS_DESTINATIONS.muse,
    tertiary: TOSS_DESTINATIONS.orange,
    whitehole: TOSS_DESTINATIONS.epilogue, // ☀️ 좌뇌적·의식적·이성적 1위: 밤 서재 회고
    blackhole: TOSS_DESTINATIONS.muse,     // 🕳️ 우뇌적·무의식적·감성적 1위: 예술처방 공명
  },
  muse: {
    primary: TOSS_DESTINATIONS.epilogue,
    secondary: TOSS_DESTINATIONS.orange,
    tertiary: TOSS_DESTINATIONS.oracle,
    whitehole: TOSS_DESTINATIONS.epilogue, // ☀️ 좌뇌적·의식적·이성적 1위: 예술적 영감을 언어로 정제하여 서재에 기록
    blackhole: TOSS_DESTINATIONS.bluebird, // 🕳️ 우뇌적·무의식적·감성적 1위: 예술이 일깨운 감정에 따스한 평온과 위로
  },
  bluebird: {
    primary: TOSS_DESTINATIONS.epilogue,
    secondary: TOSS_DESTINATIONS.muse,
    tertiary: TOSS_DESTINATIONS.hoponopono,
    whitehole: TOSS_DESTINATIONS.epilogue, // ☀️ 좌뇌적·의식적·이성적 1위: 일상의 평온과 감사를 이성적으로 서재에 기록
    blackhole: TOSS_DESTINATIONS.muse,     // 🕳️ 우뇌적·무의식적·감성적 1위: 따뜻해진 마음에 벅찬 감동을 주는 예술작품
  },
  heal: {
    primary: TOSS_DESTINATIONS.epilogue,
    secondary: TOSS_DESTINATIONS.bluebird,
    tertiary: TOSS_DESTINATIONS.orange,
    whitehole: TOSS_DESTINATIONS.epilogue, // ☀️ 좌뇌적·의식적·이성적 1위: 정화 후 맑아진 이성으로 삶의 균형과 하루 정리
    blackhole: TOSS_DESTINATIONS.bluebird, // 🕳️ 우뇌적·무의식적·감성적 1위: 정화된 마음에 평온과 행복의 온기를 채우는 안식
  },
  orange: {
    primary: TOSS_DESTINATIONS.epilogue,
    secondary: TOSS_DESTINATIONS.hoponopono,
    tertiary: TOSS_DESTINATIONS.oracle,
    whitehole: TOSS_DESTINATIONS.epilogue, // ☀️ 좌뇌적·의식적·이성적 1위: 성찰된 감정을 질서 있게 의식적으로 회고
    blackhole: TOSS_DESTINATIONS.hoponopono, // 🕳️ 우뇌적·무의식적·감성적 1위: 우물에 띄운 묵은 감정을 무의식 몸과 에너지로 정화
  },
  epilogue: {
    primary: TOSS_DESTINATIONS.oracle,
    secondary: TOSS_DESTINATIONS.muse,
    tertiary: TOSS_DESTINATIONS.orange,
    whitehole: TOSS_DESTINATIONS.oracle,   // ☀️ 좌뇌적·의식적·이성적 1위: 하루 정리 후 내일의 운명을 이성적 사주·점성으로 분석
    blackhole: TOSS_DESTINATIONS.muse,     // 🕳️ 우뇌적·무의식적·감성적 1위: 밤 서재의 사유를 심화하는 예술적 공명
  },
  lucy: {
    primary: TOSS_DESTINATIONS.epilogue,
    secondary: TOSS_DESTINATIONS.muse,
    tertiary: TOSS_DESTINATIONS.oracle,
    whitehole: TOSS_DESTINATIONS.epilogue,
    blackhole: TOSS_DESTINATIONS.muse,
  },
  hub: {
    primary: TOSS_DESTINATIONS.oracle,
    secondary: TOSS_DESTINATIONS.muse,
    tertiary: TOSS_DESTINATIONS.epilogue,
    whitehole: TOSS_DESTINATIONS.oracle,   // ☀️ 좌뇌적·의식적·이성적 1위: 사주·점성 데이터 분석과 운명 나침반
    blackhole: TOSS_DESTINATIONS.muse,     // 🕳️ 우뇌적·무의식적·감성적 1위: 삼위일체 명화·명시·명곡 예술적 공명
  },
  orb: {
    primary: TOSS_DESTINATIONS.oracle,
    secondary: TOSS_DESTINATIONS.lucy,
    tertiary: TOSS_DESTINATIONS.epilogue,
    whitehole: TOSS_DESTINATIONS.oracle,   // ☀️ 좌뇌적·의식적·이성적 1위: 오브의 직관 계시를 체계적 사주·타로 구조로 정밀 분석
    blackhole: TOSS_DESTINATIONS.lucy,     // 🕳️ 우뇌적·무의식적·감성적 1위: 오브가 비춘 무의식을 루시와 1:1 감성으로 나누는 대화
  },
};

export function getTossRule(currentChannel: string, contextHint?: any): ChannelTossRule {
  const norm = (currentChannel || '').toLowerCase();
  
  // 1. 텍스트 및 이전 활동 맥락 추출
  let text = '';
  if (typeof contextHint === 'string') {
    text = contextHint;
  } else if (contextHint && typeof contextHint === 'object') {
    text = contextHint.text || contextHint.content || contextHint.contextMessage || '';
    if (Array.isArray(contextHint.content)) {
      text = contextHint.content.map((c: any) => c.text || '').join(' ');
    }
  }

  // 2. 브라우저 최근 활동 맥락(Session Memory) 조회
  let recentOracleTime = 0;
  let recentEpilogueTime = 0;
  if (typeof window !== 'undefined') {
    try {
      const oracleItem = localStorage.getItem('prism_oracle_last_reading');
      if (oracleItem) recentOracleTime = JSON.parse(oracleItem)?.timestamp || 0;
      const epilogueItem = localStorage.getItem('prism_epilogue_last_saved');
      if (epilogueItem) recentEpilogueTime = JSON.parse(epilogueItem)?.timestamp || 0;
    } catch (_) {}
  }
  const isRecentOracle = Date.now() - recentOracleTime < 30 * 60 * 1000; // 30분 이내
  const isRecentEpilogue = Date.now() - recentEpilogueTime < 30 * 60 * 1000;

  // 3. 키워드 및 감정/의도(Intent) 분석
  const lowerText = text.toLowerCase();

  const isOrangeIntent = /오렌지|소원|우물|성찰|감정 연금술|시크릿|불안|마음 정리|소망/.test(lowerText);
  const isOrbIntuitionIntent = /오브|수정구슬|직관|점술|해답|예언|질문|답변|고민 해결/.test(lowerText);
  const isFateOrChoiceIntent = /운명|선택|진로|사주|타로|앞날|방향|미래|기로|결정|어떻게 해야|사주팔자/.test(lowerText);
  const isDeepEmotionalCare = /상처|눈물|슬픔|우울|괴로움|용서|미안|치유|정화|가슴이 아파|트라우마/.test(lowerText);
  const isHappinessCare = /행복|감사|평온|안식|파랑새|온기|따뜻|위로|휴식/.test(lowerText);
  const isReflectionIntent = /정리|회고|기록|일기|마무리|오늘 하루|생각이 많|밤|서재/.test(lowerText);
  const isArtInspiration = /예술|명화|명시|명곡|음악|시|그림|감성|영감|아름다움|도슨트/.test(lowerText);

  // 4. 맥락 기반 동적 1순위/2순위/3순위 자동 결정
  if (isOrbIntuitionIntent && !norm.includes('orb')) {
    return {
      primary: TOSS_DESTINATIONS.oracle,
      secondary: TOSS_DESTINATIONS.orb,
      tertiary: TOSS_DESTINATIONS.lucy,
      whitehole: TOSS_DESTINATIONS.oracle, // ☀️ 좌뇌·의식·이성: 사주/점성 운명 분석
      blackhole: TOSS_DESTINATIONS.orb,    // 🕳️ 우뇌·무의식·감성: 크리스탈 오브 직관 점술
    };
  }

  if (isOrangeIntent && !norm.includes('orange')) {
    return {
      primary: TOSS_DESTINATIONS.epilogue,
      secondary: TOSS_DESTINATIONS.orange,
      tertiary: TOSS_DESTINATIONS.muse,
      whitehole: TOSS_DESTINATIONS.epilogue, // ☀️ 좌뇌·의식·이성: 감정 성찰 서재 일기
      blackhole: TOSS_DESTINATIONS.orange,   // 🕳️ 우뇌·무의식·감성: 소원의 우물 감정 투영
    };
  }

  if (isFateOrChoiceIntent && !norm.includes('oracle') && !norm.includes('trinity')) {
    return {
      primary: TOSS_DESTINATIONS.oracle,
      secondary: TOSS_DESTINATIONS.muse,
      tertiary: TOSS_DESTINATIONS.lucy,
      whitehole: TOSS_DESTINATIONS.oracle, // ☀️ 좌뇌·의식·이성: 사주·점성 운명 나침반
      blackhole: TOSS_DESTINATIONS.muse,   // 🕳️ 우뇌·무의식·감성: 운명 상징 예술 처방
    };
  }

  if (isHappinessCare && !norm.includes('bluebird')) {
    return {
      primary: TOSS_DESTINATIONS.epilogue,
      secondary: TOSS_DESTINATIONS.bluebird,
      tertiary: TOSS_DESTINATIONS.muse,
      whitehole: TOSS_DESTINATIONS.epilogue, // ☀️ 좌뇌·의식·이성: 일상의 감사와 행복 기록
      blackhole: TOSS_DESTINATIONS.bluebird, // 🕳️ 우뇌·무의식·감성: 파랑새의 영혼 안식과 온기
    };
  }

  if (isDeepEmotionalCare && !norm.includes('heal') && !norm.includes('bluebird')) {
    return {
      primary: TOSS_DESTINATIONS.epilogue,
      secondary: TOSS_DESTINATIONS.hoponopono,
      tertiary: TOSS_DESTINATIONS.lucy,
      whitehole: TOSS_DESTINATIONS.epilogue,   // ☀️ 좌뇌·의식·이성: 맑아진 마음으로 삶의 회고
      blackhole: TOSS_DESTINATIONS.hoponopono, // 🕳️ 우뇌·무의식·감성: 호오포노포노 & 신체 에너지 정화
    };
  }

  if (isReflectionIntent && !norm.includes('epilogue')) {
    return {
      primary: TOSS_DESTINATIONS.epilogue,
      secondary: TOSS_DESTINATIONS.orb,
      tertiary: TOSS_DESTINATIONS.oracle,
      whitehole: TOSS_DESTINATIONS.epilogue, // ☀️ 좌뇌·의식·이성: 밤 서재 회고와 지적 정리
      blackhole: TOSS_DESTINATIONS.orb,      // 🕳️ 우뇌·무의식·감성: 논리를 끈 무의식 직관 비춤
    };
  }

  if (isArtInspiration && !norm.includes('muse')) {
    return {
      primary: TOSS_DESTINATIONS.epilogue,
      secondary: TOSS_DESTINATIONS.muse,
      tertiary: TOSS_DESTINATIONS.oracle,
      whitehole: TOSS_DESTINATIONS.epilogue, // ☀️ 좌뇌·의식·이성: 예술 영감을 언어로 체계화
      blackhole: TOSS_DESTINATIONS.muse,     // 🕳️ 우뇌·무의식·감성: 명화·명시·명곡 감성 공명
    };
  }

  // 5. 최근 활동 이력(Memory) 기반 시너지 연계
  if (isRecentOracle && !norm.includes('muse')) {
    // 방금 오라클 타로를 봤다면 -> 타로 상징을 명화로 확장하는 뮤즈 예술처방 1순위
    return {
      primary: TOSS_DESTINATIONS.epilogue,
      secondary: TOSS_DESTINATIONS.muse,
      tertiary: TOSS_DESTINATIONS.lucy,
      whitehole: TOSS_DESTINATIONS.epilogue, // ☀️ 좌뇌·의식·이성: 운명 리딩 정리
      blackhole: TOSS_DESTINATIONS.muse,     // 🕳️ 우뇌·무의식·감성: 예술적 감성 폭발
    };
  }

  if (isRecentEpilogue && !norm.includes('orange')) {
    // 방금 일기를 썼다면 -> 내일의 루틴이나 예술 처방 연계
    return {
      primary: TOSS_DESTINATIONS.oracle,
      secondary: TOSS_DESTINATIONS.muse,
      tertiary: TOSS_DESTINATIONS.orange,
      whitehole: TOSS_DESTINATIONS.oracle, // ☀️ 좌뇌·의식·이성: 내일의 운명 분석
      blackhole: TOSS_DESTINATIONS.muse,   // 🕳️ 우뇌·무의식·감성: 감성 예술 처방
    };
  }

  // 6. 기본 채널 규칙 매핑
  for (const [key, rule] of Object.entries(CHANNEL_TOSS_RULES)) {
    if (norm.includes(key)) return rule;
  }

  // 7. 정 연결할 게 없을 때: 화이트홀은 에필로그 밤 서재, 블랙홀은 뮤즈 예술처방
  return {
    primary: TOSS_DESTINATIONS.epilogue,
    secondary: TOSS_DESTINATIONS.muse,
    tertiary: TOSS_DESTINATIONS.oracle,
    whitehole: TOSS_DESTINATIONS.epilogue,
    blackhole: TOSS_DESTINATIONS.muse,
  };
}

/** Execute smart toss with haptic feedback & auto navigation */
export function executeSmartToss(
  sourceApp: string,
  destination: TossDestination,
  contextData?: Partial<PrismTossPayload> & { text?: string }
): void {
  const normDestId = (destination.id || '').toLowerCase().replace('/', '');
  const normDestPath = (destination.path || '').toLowerCase().replace('/', '');
  // Only block strictly deprecated or inactive destinations
  if (normDestId === 'library' || normDestPath === 'library') {
    console.warn(`[SmartToss Guard] Inactive toss navigation blocked: ${destination.id}`);
    return;
  }

  playAudioHaptic('tap_impact');

  const extractedMsg = contextData?.text || contextData?.contextMessage || `${sourceApp} 세션에서 연계된 토스`;

  sendPrismToss({
    sourceApp,
    targetApp: destination.id,
    actionType: 'smart_toss',
    contextMessage: extractedMsg,
    anchorArtworkTitle: contextData?.anchorArtworkTitle,
    anchorArtQuote: contextData?.anchorArtQuote,
    cards: contextData?.cards,
    tossedAt: Date.now(),
  });

  if (typeof window !== 'undefined') {
    const safePath = resolveCanonicalPath(destination.path);
    if (window.location.pathname.includes('orb')) {
      window.location.href = safePath;
    } else {
      window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: safePath } }));
      window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: safePath } }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
