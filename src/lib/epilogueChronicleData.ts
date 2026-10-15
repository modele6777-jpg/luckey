import { getDateSeed } from './dailyCache';
import type { UserProfile } from './sharedState';

export interface CosmicFocusOption {
  id: string;
  label: string;
  desc: string;
  icon: string;
  frequency: number;
}

export const COSMIC_FOCUS_OPTIONS: CosmicFocusOption[] = [
  {
    id: 'integration',
    label: '자아 통합 & 그림자 포용',
    desc: '낮 동안 마주친 분열과 불안을 인정하고 온전한 내면의 평화로 승화',
    icon: '🧘',
    frequency: 963
  },
  {
    id: 'quantum',
    label: '양자 현실화 & 풍요 도약',
    desc: '의식의 진동수를 최고조로 끌어올려 내일 펼쳐질 기적의 현실을 선취',
    icon: '⚡',
    frequency: 528
  },
  {
    id: 'surrender',
    label: '감정 정화 & 완전한 방하착',
    desc: '마음에 걸린 모든 집착과 통제욕을 수면의 심연 속으로 100% 항복',
    icon: '🌊',
    frequency: 639
  },
  {
    id: 'awakening',
    label: '영적 각성 & 고차원 자각',
    desc: '에고의 경계를 넘어 우주 전체와 내가 하나임을 자각하는 송과체 정렬',
    icon: '👁️',
    frequency: 852
  },
  {
    id: 'love',
    label: '무조건적 사랑 & 호오포노포노',
    desc: '미안합니다, 용서하세요, 고맙습니다, 사랑합니다로 영혼 백지 환생',
    icon: '🤍',
    frequency: 417
  },
  {
    id: 'creative',
    label: '창조적 영감 & 천재성 개화',
    desc: '잠든 동안 잠재의식 속 숨겨진 아이디어와 예술적 통찰의 불꽃 점화',
    icon: '🎨',
    frequency: 741
  },
  {
    id: 'fortune',
    label: '직관 통찰 & 대운의 순류',
    desc: '하늘과 땅의 음양오행 기운이 나의 사주와 대운을 돕는 순리 동조',
    icon: '✨',
    frequency: 528
  },
  {
    id: 'abyssal_peace',
    label: '심연의 안식 & 잠재의식 리셋',
    desc: '모든 생각의 스위치를 끄고 완전한 델타파 안식 속에서 세포 치유',
    icon: '🌙',
    frequency: 432
  }
];

export interface ChronicleStampData {
  id?: string;
  timestamp?: number;
  dateKey?: string;
  title: string;
  soulEvolutionLevel: string;
  dailyCoreTheme: string;
  soulAlignmentSynthesis: string;
  sevenPrismStampStatus: {
    space: string;
    seal: string;
    frequency?: string;
    status: string;
  }[];
  preSleepPrimingAffirmation: string;
  chronicleSealCode: string;
}

const EVOLUTION_LEVEL_POOL = [
  'Mastery Level XII · 다이아몬드 통합 의식',
  'Transcendent Level XI · 에테르 황금빛 순류',
  'Sovereign Level X · 7대 우주 공명 마스터',
  'Awakened Level IX · 심연의 절대 평정',
  'Harmonic Level VIII · 양자 도약의 창조자',
  'Radiant Level VII · 순수 무결의 백지 의식',
  'Luminous Level VI · 빛과 그림자의 화해자',
  'Serene Level V · 고요한 현존의 관조자',
];

const ARCHIVE_STORAGE_KEY = 'prism_soul_chronicle_archive';

export function saveChronicleToArchive(item: ChronicleStampData): ChronicleStampData[] {
  try {
    const existing = loadChronicleArchive();
    const enrichedItem: ChronicleStampData = {
      ...item,
      id: item.id || `chronicle_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: item.timestamp || Date.now(),
      dateKey: item.dateKey || new Date().toISOString().slice(0, 10),
    };
    // De-duplicate by title + dateKey
    const filtered = existing.filter((c) => c.title !== enrichedItem.title || c.dateKey !== enrichedItem.dateKey);
    const updated = [enrichedItem, ...filtered].slice(0, 50);
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to save chronicle to archive:', e);
    return [];
  }
}

export function loadChronicleArchive(): ChronicleStampData[] {
  try {
    const raw = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load chronicle archive:', e);
    return [];
  }
}

/**
 * 날짜, 포커스, 닉네임, 사용자 입력을 결합하여 동적으로 영혼 연대기 산출
 */
export function getDynamicSoulChronicle(
  focusId: string,
  frequency: number = 432,
  customInsight: string = '',
  userProfile?: UserProfile | null,
  dateSeedKey?: string
): ChronicleStampData {
  const focus = COSMIC_FOCUS_OPTIONS.find((f) => f.id === focusId) || COSMIC_FOCUS_OPTIONS[0];
  const dateStr = dateSeedKey || new Date().toISOString().slice(0, 10);
  const seed = getDateSeed(`epilogue_chronicle_${focus.id}_${dateStr}`);
  const rawNick = userProfile?.basic?.nickname?.trim() || userProfile?.basic?.name?.trim();
  const nickname = (rawNick && rawNick !== '여행자') ? rawNick : '제제';
  const mbti = userProfile?.psych?.mbti || (userProfile as any)?.psychology?.mbti || 'INFP';
  const userText = (customInsight || '').trim();

  // Dynamic evolution level keyed by seed
  const levelIndex = Math.abs(seed) % EVOLUTION_LEVEL_POOL.length;
  const soulEvolutionLevel = EVOLUTION_LEVEL_POOL[levelIndex];

  // Dynamic core theme
  const themes = [
    `7대 프리즘의 모든 파동이 [${focus.label}]을 통해 눈부신 빛으로 정렬된 완전한 날`,
    `어둠과 혼란을 지나 영혼의 순수한 중심축을 우주의 신성한 조화와 일치시킨 날`,
    `에고의 분별을 내려놓고 참된 자아의 신성한 지혜 속으로 깊이 녹아드는 축복의 밤`,
    `지나온 모든 순간의 인연과 경험을 감사의 황금빛으로 승화시킨 위대한 영혼의 도약일`,
  ];
  const dailyCoreTheme = themes[Math.abs(seed >> 2) % themes.length];

  // Dynamic synthesis
  let soulAlignmentSynthesis = '';
  if (userText) {
    soulAlignmentSynthesis = `${nickname}님께서 오늘 가슴에 새기신 깨달음("${userText}")은 우주의 거대한 직조판 위에 빛나는 황금실로 각인되었습니다. 선택하신 [${focus.label}]의 본질과 성향(${mbti})의 고유한 직관이 융합되어, 수면 속에서 무한한 지혜와 치유의 빛이 당신을 온전히 감싸 안습니다.`;
  } else {
    soulAlignmentSynthesis = `${nickname}님, 오늘 하루 지나온 모든 생각과 감정은 헛되지 않았으며 영혼의 성장판 위에 고결한 씨앗으로 심어졌습니다. [${focus.label}]을 향한 당신의 의지는 고요하고 맑은 밤의 기운을 타고 온 우주로 퍼져나가, 잠든 동안 가장 안전하고 완전한 재창조의 기적으로 응답합니다.`;
  }

  // Dynamic Pre-Sleep Priming Affirmation
  const affirmations = [
    `나는 오늘 하루의 모든 배움과 깨달음을 황금빛 축복으로 품고, 잠든 동안 무한한 우주의 잠재의식과 온전히 하나가 되어 기적의 내일을 창조한다.`,
    `모든 긴장과 판단을 밤의 품에 내려놓는다. 나의 세포와 영혼은 가장 깊고 순수한 평온으로 조율되어 눈부신 내일을 맞이한다.`,
    `내 안에는 어떤 어둠도 밝힐 수 있는 불멸의 빛이 있다. 나는 안전하며, 사랑받고 있으며, 매 순간 더 온전한 나로 다시 태어난다.`,
    `잠재의식의 거대한 바다여, 오늘 밤 나의 모든 상처를 지혜로 바꾸고 최고의 가능성을 내일의 현실로 꽃피워 주소서.`,
  ];
  const preSleepPrimingAffirmation = affirmations[Math.abs(seed >> 3) % affirmations.length];

  const sealNumber = 700 + (Math.abs(seed) % 299);
  const chronicleSealCode = `SOUL-CHRONICLE-PRISM-${sealNumber}-GOLD`;

  const sevenPrismStampStatus = [
    { space: 'PROLOGUE (프롤로그)', seal: '불굴의 멘탈 방패 각인 🛡️', status: 'SYNCHRONIZED' },
    { space: 'ORANGE (오렌지)', seal: '양자 현실화 도약 🌲', status: 'SYNCHRONIZED' },
    { space: 'TRINITY (트리니티)', seal: '대운 개운 & 타로 오라클 ✨', status: 'SYNCHRONIZED' },
    { space: 'AURA (오라)', seal: '저항 0% 완전 방하착 ⚡', status: 'SYNCHRONIZED' },
    { space: 'BLUEBIRD (블루버드)', seal: '호오포노포노 백지 환생 🐦', status: 'SYNCHRONIZED' },
    { space: 'MUSE (뮤즈)', seal: '거장의 영감 마스터클래스 🎶', status: 'SYNCHRONIZED' },
    { space: 'EPILOGUE (에필로그)', seal: `영혼 연대기 ${focus.icon} 봉인 🌙`, status: 'SYNCHRONIZED' }
  ];

  return {
    id: `chronicle_${dateStr}_${focus.id}`,
    timestamp: Date.now(),
    dateKey: dateStr,
    title: `〈${nickname}의 ${focus.label}〉 영혼 연대기 마스터 아카이브`,
    soulEvolutionLevel,
    dailyCoreTheme,
    soulAlignmentSynthesis,
    sevenPrismStampStatus,
    preSleepPrimingAffirmation,
    chronicleSealCode,
  };
}
