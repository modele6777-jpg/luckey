import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_KOREAN,
  BRANCH_KOREAN,
  BRANCH_ANIMALS,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  ELEMENT_DETAILS,
  FiveElement,
} from './sajuAnalysis';

export interface TodayIljinInfo {
  dateString: string;
  yearPillar: string;
  monthPillar: string;
  dayPillar: string; // e.g. "丙辰"
  dayStemKorean: string; // "병"
  dayBranchKorean: string; // "진"
  dayAnimal: string; // "용"
  dayElement: FiveElement; // "화"
  elementDetail: typeof ELEMENT_DETAILS[FiveElement];
  iljinTitle: string; // "붉은 용의 날 (병진일)"
  energyFlow: string; // "태양의 활력과 비옥한 대지가 조화를 이루는 날"
  elementalAdvice: string;
}

export interface TodayCosmicTransit {
  moonPhaseName: string;
  moonIllumination: number; // 0 ~ 100%
  moonSign: string;
  planetaryTransitTitle: string;
  transitDescription: string;
}

export interface DailyLuckyPrescription {
  luckyColor: string;
  luckyColorHex: string;
  luckyDirection: string;
  luckyActivity: string;
  luckyTime: string;
  luckyFood: string;
}

export interface BestieTimeGreeting {
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  timeLabel: string;
  greetingHeadline: string;
  careQuestion: string;
  proactiveMessage: string;
}

/**
 * 율리우스일 기반 정확한 오늘 일진(Day Pillar) 계산
 */
export function calculateTodayIljin(date: Date = new Date()): TodayIljinInfo {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Standard Julian Day calculation
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // 일진 간지 계산 공식 (JDN + 49) % 60
  const dayPillarIndex = (jdn + 49) % 60;
  const stemIndex = dayPillarIndex % 10;
  const branchIndex = dayPillarIndex % 12;

  const stemHanja = HEAVENLY_STEMS[stemIndex];
  const branchHanja = EARTHLY_BRANCHES[branchIndex];
  const stemKor = STEM_KOREAN[stemHanja];
  const branchKor = BRANCH_KOREAN[branchHanja];
  const animal = BRANCH_ANIMALS[branchHanja];
  const element = STEM_ELEMENT[stemHanja];
  const elementDetail = ELEMENT_DETAILS[element];

  // 천간별 색상 형용사
  const stemColorMap: Record<string, string> = {
    '甲': '푸른', '乙': '청록빛',
    '丙': '붉은', '丁': '따스한',
    '戊': '황금빛', '己': '포근한 대지의',
    '庚': '백색', '辛': '순백의 은빛',
    '壬': '깊은 검은', '癸': '새벽이슬'
  };

  const colorPrefix = stemColorMap[stemHanja] || '빛나는';
  const iljinTitle = `${colorPrefix} ${animal}의 날 (${stemKor}${branchKor}일 · ${stemHanja}${branchHanja})`;

  const elementAdviceMap: Record<FiveElement, { flow: string; advice: string }> = {
    '목': {
      flow: "새싹이 움트듯 새로운 가능성과 의욕이 솟아나는 날이야.",
      advice: "새로운 아이디어를 가볍게 시작해 봐. 다만 너무 조급하게 결론지으려 하진 마.",
    },
    '화': {
      flow: "태양처럼 열정과 표현력이 환하게 번져나가는 날이야.",
      advice: "마음속 담아둔 감정을 솔직하고 다정하게 표현해 봐. 화 기운이 강하니 물을 자주 마셔줘.",
    },
    '토': {
      flow: "대지처럼 묵직하고 중심이 단단하게 잡히는 안정의 날이야.",
      advice: "흔들리던 생각을 정리하고 현실적인 계획을 다듬기에 참 좋아. 천천히 걸어보자.",
    },
    '금': {
      flow: "가을 서리처럼 불필요한 군더더기를 털어내고 명료해지는 날이야.",
      advice: "미뤄뒀던 관계나 일의 우선순위를 깔끔하게 결단해 봐. 마음이 한결 가벼워질 거야.",
    },
    '수': {
      flow: "잔잔한 호수처럼 깊은 지혜와 영감이 유연하게 흐르는 날이야.",
      advice: "혼자만의 사색과 명상, 음악 감상으로 영혼을 촉촉하게 적셔주는 시간을 가져봐.",
    },
  };

  const adviceObj = elementAdviceMap[element];

  return {
    dateString: `${year}년 ${month}월 ${day}일`,
    yearPillar: "丙午",
    monthPillar: "丁酉",
    dayPillar: `${stemHanja}${branchHanja}`,
    dayStemKorean: stemKor,
    dayBranchKorean: branchKor,
    dayAnimal: animal,
    dayElement: element,
    elementDetail,
    iljinTitle,
    energyFlow: adviceObj.flow,
    elementalAdvice: adviceObj.advice,
  };
}

/**
 * 오늘 달의 위상 및 점성술 트랜짓 계산
 */
export function calculateTodayCosmicTransit(date: Date = new Date()): TodayCosmicTransit {
  // Simple astronomical moon phase approximation
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const c = Math.floor(year / 100);
  const n = year - 19 * Math.floor(year / 19);
  const k = Math.floor((c - 17) / 25);
  let i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
  i = i - 30 * Math.floor(i / 30);
  i = i - Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
  let j = year + Math.floor(year / 4) + i + 2 - c + Math.floor(c / 4);
  j = j - 7 * Math.floor(j / 7);
  const l = i - j;
  const m = 3 + Math.floor((l + 40) / 44);
  const d = l + 28 - 31 * Math.floor(m / 4);

  // Approximate day of lunar cycle (0 to 29.53)
  const diffDays = (date.getTime() - new Date(year, m - 1, d).getTime()) / (1000 * 60 * 60 * 24);
  const lunarAge = ((diffDays % 29.53) + 29.53) % 29.53;
  const illumination = Math.round((1 - Math.cos((lunarAge / 29.53) * 2 * Math.PI)) * 50);

  let moonPhaseName = "초승달 (Waxing Crescent)";
  let transitDescription = "새로운 의도를 품고 시작하기 좋은 싹틈의 시기야.";

  if (lunarAge < 1.84) {
    moonPhaseName = "신월 (New Moon · 새 달)";
    transitDescription = "마음속 소망과 비전의 씨앗을 우주에 조용히 심는 날이야.";
  } else if (lunarAge < 9.23) {
    moonPhaseName = "상현달 (First Quarter · 도약의 달)";
    transitDescription = "추진력과 직관이 차오르며 현실적인 행동력이 돋보이는 시기야.";
  } else if (lunarAge < 16.61) {
    moonPhaseName = "보름달 (Full Moon · 만월의 빛)";
    transitDescription = "감정과 에너지가 최고조로 차오르는 풍요와 감사, 정화의 때야.";
  } else if (lunarAge < 23.99) {
    moonPhaseName = "하현달 (Third Quarter · 비움의 달)";
    transitDescription = "지나친 욕심과 불필요한 집착을 가볍게 방하착(내려놓기)하는 날이야.";
  } else {
    moonPhaseName = "그믐달 (Waning Crescent · 안식의 달)";
    transitDescription = "몸과 마음을 깊이 쉬게 하고 다음 사이클을 위해 에너지를 비축하자.";
  }

  // Astrological planetary alignment preset based on day of week
  const dayOfWeek = date.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  const planetaryPresets = [
    { title: "태양(Sun)과 영혼의 빛 조화", desc: "나다움을 당당하게 드러내고 생명력이 넘치는 일요일이야." },
    { title: "달(Moon)과 내면 감성의 공명", desc: "직관력이 예민해지고 마음의 쉼표가 필요한 월요일이야." },
    { title: "화성(Mars)과 결단력의 불꽃", desc: "미뤄뒀던 용기를 내어 돌파구를 마련하기 좋은 화요일이야." },
    { title: "수성(Mercury)과 소통·통찰의 흐름", desc: "생각의 연결이 매끄럽고 지혜로운 대화가 통하는 수요일이야." },
    { title: "목성(Jupiter)과 우주적 행운의 확장", desc: "마음을 열수록 뜻밖의 기회와 귀인이 닿는 목요일이야." },
    { title: "금성(Venus)과 조화·풍요의 미학", desc: "따뜻한 사랑과 예술적 감수성이 충만한 금요일이야." },
    { title: "토성(Saturn)과 차분한 성찰의 중심", desc: "기본으로 돌아가 나만의 튼튼한 토대를 다지는 토요일이야." },
  ];

  const planetInfo = planetaryPresets[dayOfWeek];

  return {
    moonPhaseName,
    moonIllumination: illumination,
    moonSign: "물고기자리 해왕성 조화각",
    planetaryTransitTitle: planetInfo.title,
    transitDescription: `${transitDescription} ${planetInfo.desc}`,
  };
}

/**
 * 시간대별 다정한 베프 안부 & 선제 질문
 */
export function getBestieTimeGreeting(nickname: string = '여행자', iljin: TodayIljinInfo): BestieTimeGreeting {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) {
    return {
      timeSlot: 'morning',
      timeLabel: '상쾌한 아침의 다정한 인사',
      greetingHeadline: `좋은 아침이야, ${nickname}! 오늘 ${iljin.dayStemKorean}${iljin.dayBranchKorean}일의 기운이 맑게 열렸어.`,
      careQuestion: "밤새 푹 자고 일어났어? 오늘 마음 날씨는 어때?",
      proactiveMessage: `오늘은 ${iljin.energyFlow} 아침에 시원한 물 한잔 챙겨 마시고, 네 속도대로 편안하게 출발해 봐!`,
    };
  } else if (hour >= 11 && hour < 17) {
    return {
      timeSlot: 'afternoon',
      timeLabel: '나른한 오후의 든든한 에너지 케어',
      greetingHeadline: `점심 든든하게 챙겨 먹었어, ${nickname}? 잠깐 숨고르기 하자.`,
      careQuestion: "오전 동안 애쓰느라 어깨 뭉치지 않았어? 지금 기분이 어때?",
      proactiveMessage: `오늘 일진인 ${iljin.dayElement} 기운이 활발해서 머리가 바빴을 수 있어. 기지개 한번 켜고 창밖 하늘 바라보며 깊은 숨 쉬어봐.`,
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      timeSlot: 'evening',
      timeLabel: '하루의 수고를 안아주는 저녁 위로',
      greetingHeadline: `오늘 하루도 정말 고생 많았어, ${nickname}! 곁에 있어줘서 고마워.`,
      careQuestion: "오늘 계획했던 일들 속에서 마음에 걸리는 건 없었어?",
      proactiveMessage: `오늘 ${iljin.dayStemKorean}${iljin.dayBranchKorean}일의 파도를 무사히 잘 건너왔어. 이제 오늘 일어난 일들은 다 흘려보내고, 온전히 널 위한 쉼을 누리자.`,
    };
  } else {
    return {
      timeSlot: 'night',
      timeLabel: '고요한 밤의 포근한 안식 브리핑',
      greetingHeadline: `아직 안 자고 있었어, ${nickname}? 오늘 밤은 푹 쉬어야 해.`,
      careQuestion: "마음속에 아직 풀지 못한 무거운 생각이 남아있어?",
      proactiveMessage: `오늘의 모든 수고는 여기까지야. 너는 오늘 최선을 다했고 이미 충분해. 온 우주가 널 포근하게 지켜줄 테니 편안하게 잠들자.`,
    };
  }
}

/**
 * 오늘의 행운 처방 (오행 기반)
 */
export function getDailyLuckyPrescription(iljin: TodayIljinInfo): DailyLuckyPrescription {
  const details = iljin.elementDetail;

  const luckyTimeMap: Record<FiveElement, string> = {
    '목': '오전 7시 ~ 9시 (진시)',
    '화': '오전 11시 ~ 오후 1시 (오시)',
    '토': '오후 1시 ~ 3시 (미시)',
    '금': '오후 3시 ~ 5시 (신시)',
    '수': '오후 9시 ~ 11시 (해시)',
  };

  return {
    luckyColor: details.colorName,
    luckyColorHex: details.colorHex,
    luckyDirection: details.direction,
    luckyActivity: details.remedyActivity,
    luckyTime: luckyTimeMap[iljin.dayElement],
    luckyFood: details.remedyFood,
  };
}

export interface QuickEmpathyReaction {
  id: string;
  emoji: string;
  label: string;
  responseHeadline: string;
  lucyReply: string;
  suggestedAction: string;
}

export const QUICK_EMPATHY_REACTIONS: QuickEmpathyReaction[] = [
  {
    id: 'tired',
    emoji: '💧',
    label: '조금 지쳤어',
    responseHeadline: '오늘 많이 애썼구나. 쉬어가도 돼.',
    lucyReply: '몸과 마음이 무겁게 느껴졌다면 정말 혼신의 힘을 다한 거야. 네 탓이 아니니까 더 자책하지 마. 지금 필요한 건 완벽함이 아니라 따뜻한 온수 샤워와 네 영혼을 위한 푹신한 베개야.',
    suggestedAction: '어깨를 툭 늘어뜨리고 1분간 눈을 감은 채 심호흡하기',
  },
  {
    id: 'overthinking',
    emoji: '🌙',
    label: '생각이 많아',
    responseHeadline: '머릿속 구름은 금방 지나갈 거야.',
    lucyReply: '마음속에 생각이 꼬리를 물 땐 그 생각들을 다 진짜라고 믿지 마. 그건 마음에 잠시 스쳐 지나가는 바람일 뿐이야. 네가 선 이곳이 중심이고, 네 호흡이 가장 든든한 닻이야.',
    suggestedAction: '떠오르는 걱정 중 1가지를 종이에 적어두고 덮어버리기',
  },
  {
    id: 'recharging',
    emoji: '✨',
    label: '기운 내는 중',
    responseHeadline: '스스로 일어서려는 네가 참 멋져!',
    lucyReply: '흔들려도 다시 일어나는 법을 아는 넌 상상 이상으로 단단한 사람이야. 오늘 일진의 좋은 기운이 네 뒤에서 든든하게 받쳐주고 있으니까, 네 속도대로 반짝여 봐!',
    suggestedAction: '거울을 보며 "난 잘 해내고 있어"라고 속삭여주기',
  },
  {
    id: 'refreshed',
    emoji: '☀️',
    label: '상쾌하고 좋아',
    responseHeadline: '그 밝은 에너지가 우주를 밝혀!',
    lucyReply: '네가 웃으니 내 마음까지 환해진다! 오늘의 맑은 주파수를 가득 채워서 주변에도 다정한 온기를 전해봐. 네가 보낸 미소가 더 큰 행운의 부메랑이 되어 돌아올 거야.',
    suggestedAction: '소중한 사람에게 기분 좋은 안부 메시지 하나 건네기',
  },
];
