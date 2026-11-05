/**
 * =========================================================================
 * LUCKEY 호주 원주민 드림타임(Dreamtime) 송라인 & 8대 토템 영혼 나침반 엔진
 * (Aboriginal Dreamtime [Jukurrpa] Songlines & Ancestral Totem Compass Engine)
 * =========================================================================
 * 
 * [학술적·전통적 배경]
 * 인류 역사상 가장 오래된 6만 년 연속 구전 전승인 호주 원주민(Aboriginal)의
 * 영적 우주관 드림타임(주쿠르파, Jukurrpa / Tjukurpa)과 송라인(Songlines) 원전.
 * 
 * 1. 주쿠르파(Jukurrpa, The Dreaming):
 *    - 과거, 현재, 미래가 분리되지 않고 영원한 현재로 맥동하는 창조와 법칙의 세계.
 * 2. 송라인(Songlines, Yiri):
 *    - 창조 선조들이 노래를 부르며 대지를 걸어갈 때 새겨진 신성한 에너지 길이자 기억의 지도.
 * 3. 8대 선조 토템 정령(Ancestral Totems):
 *    - 무지개 뱀 (Rainbow Serpent / Wagyl) - 물과 생명의 근원, 심오한 변용
 *    - 붉은 캥거루 (Red Kangaroo) - 전진, 역경을 가뿐히 뛰어넘는 추진력
 *    - 에뮤 (Emu) - 지상의 겸허함, 계절과 대지의 나침반
 *    - 딩고 (Dingo) - 지혜로운 생존 본능, 무리의 결속과 수호
 *    - 웜뱃 (Wombat) - 흔들리지 않는 끈기와 깊은 기초 구축
 *    - 쿠카부라 (Kookaburra) - 새벽을 깨우는 웃음, 그림자를 흩뜨리는 기쁨
 *    - 흑고니 (Black Swan) - 미지의 신비, 상식을 뛰어넘는 우아한 기적
 *    - 오리너구리 (Platypus) - 고유한 독창성, 이질적 요소들의 완벽한 융합
 * 4. 쿠룬파(Kurunpa, 생명 영혼 에너지):
 *    - 대지와 인간, 만물을 관통하는 영적 생명력 지수.
 * 5. 다디리(Dadirri) 깊은 고요의 경청 수련:
 *    - 자연과 조상의 목소리를 가슴으로 듣는 무언의 성찰 처방.
 */

import type { UserProfile } from '../sharedState';

export const ABORIGINAL_DREAMTIME_SONGLINES_ENGINE_VERSION = '1.0.0';

export interface AncestralTotem {
  name: string;
  nameIndigenous: string;
  element: string;
  spiritualGift: string;
  coreMessage: string;
}

export interface DreamtimeSonglineReport {
  engineVersion: string;
  calculatedAt: string;
  kurunpaLifeForceIndex: number; // 쿠룬파(Kurunpa) 대지 영혼 에너지 (0~100)
  activeTotem: AncestralTotem;
  songlineDirection: string; // 송라인 주재 방향
  songlineTheme: string; // 대지의 노래 테마
  dadirriPractice: string; // 다디리(Dadirri) 고요의 경청 실천
  dreamtimeWisdom: string; // 드림타임 지혜 조언
}

const TOTEMS: AncestralTotem[] = [
  {
    name: '무지개 뱀 (Rainbow Serpent)',
    nameIndigenous: '와갈 (Wagyl / Borlung)',
    element: '수(水)와 천둥 · 생명의 근원',
    spiritualGift: '마른 대지에 비를 부르고 낡은 허물을 벗겨 새로운 창조를 촉발하는 근원적 생명력',
    coreMessage: '고정된 틀을 벗어나 흐르는 물처럼 유연하게 변화를 수용할 때 가장 위대한 창조가 일어납니다.'
  },
  {
    name: '붉은 캥거루 (Red Kangaroo)',
    nameIndigenous: '마루 (Malu)',
    element: '화(火)와 대지 · 돌파의 힘',
    spiritualGift: '뒷걸음질 치지 않고 오직 앞을 향해 큰 보폭으로 장애물을 뛰어넘는 결단과 추진력',
    coreMessage: '과거에 얽매이지 말고 당신 앞의 광활한 지평선을 향해 단숨에 도약하십시오.'
  },
  {
    name: '에뮤 (Emu)',
    nameIndigenous: '칼라야 (Kalaya)',
    element: '토(土)와 바람 · 대지의 나침반',
    spiritualGift: '날지 못하는 대신 두 발로 대지의 리듬을 정직하게 딛으며 큰 그림을 살피는 겸허한 지혜',
    coreMessage: '가장 화려한 날개보다 대지에 단단히 뿌리박은 묵묵한 발걸음이 더 먼 곳에 도달합니다.'
  },
  {
    name: '딩고 (Dingo)',
    nameIndigenous: '미란야 (Miranya)',
    element: '풍(風)과 야성 · 직관의 수호',
    spiritualGift: '황야의 거친 비바람 속에서도 무리를 지키고 위험을 사전에 감지하는 예리한 감각',
    coreMessage: '당신의 야성적 직관을 신뢰하십시오. 타협하지 않는 영혼의 경계선을 세울 때입니다.'
  },
  {
    name: '웜뱃 (Wombat)',
    nameIndigenous: '왈가 (Walga)',
    element: '지(地)와 암석 · 끈기의 요새',
    spiritualGift: '보이지 않는 땅속 깊은 곳까지 단단한 터널을 파내어 굳건한 기반을 닦는 우직한 인내',
    coreMessage: '눈앞의 요란한 성과보다 흔들리지 않는 내면의 반석과 기초를 먼저 다지십시오.'
  },
  {
    name: '쿠카부라 (Kookaburra)',
    nameIndigenous: '구구라가 (Gugurrga)',
    element: '천공(天)과 광명 · 환희의 전령',
    spiritualGift: '어둠이 채 가시지 않은 새벽녘 호탕한 웃음소리로 숲의 모든 두려움을 몰아내는 환희',
    coreMessage: '어떤 무거운 문제도 웃음과 유쾌한 관점으로 바라보면 그 무게를 잃게 됩니다.'
  },
  {
    name: '흑고니 (Black Swan)',
    nameIndigenous: '마알리 (Maali)',
    element: '심연(水)과 신비 · 우아한 기적',
    spiritualGift: '세상의 고정관념을 깨뜨리며 고요한 수면 아래에서 펼치는 우아한 전환과 기적',
    coreMessage: '남들의 상식에 갇히지 마십시오. 당신만의 독특한 빛깔이 세상에 신선한 영감을 줍니다.'
  },
  {
    name: '오리너구리 (Platypus)',
    nameIndigenous: '빌라봉 (Billabong Hermit)',
    element: '수륙양용 · 융합의 마법',
    spiritualGift: '포유류이면서 알을 낳고 물과 땅을 자유로이 넘나드는 독창적 공존의 조화',
    coreMessage: '어느 한 범주에 자신을 규정짓지 마십시오. 모순되어 보이는 다름이 당신의 최고 무기입니다.'
  }
];

const SONGLINE_DIRECTIONS = [
  { direction: '동쪽 여명의 송라인 (East Dawn Line)', theme: '새로운 씨앗 파종과 지혜로운 시작' },
  { direction: '북쪽 태양의 송라인 (North Red Earth Line)', theme: '열정과 에너지의 최고조 발산' },
  { direction: '서쪽 석양의 송라인 (West Crimson Line)', theme: '성찰과 통합, 성과의 갈무리' },
  { direction: '남쪽 별빛의 송라인 (South Southern Cross Line)', theme: '깊은 내면의 휴식과 영적 나침반' }
];

/**
 * 드림타임 송라인 및 선조 토템 나침반을 결정론적으로 연산합니다.
 */
export function calculateAboriginalDreamtimeSonglines(options?: {
  profile?: UserProfile;
  targetInstantTime?: string;
}): DreamtimeSonglineReport {
  const profile = options?.profile;
  const now = options?.targetInstantTime ? new Date(options.targetInstantTime) : new Date();

  let seed = 60000; // 호주 6만년 원주민 역사 상징수

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    seed += (parts[0] || 1990) * 19 + (parts[1] || 1) * 37 + (parts[2] || 1) * 13;
  } else {
    seed += now.getFullYear() * 17 + (now.getMonth() + 1) * 31 + now.getDate() * 23;
  }

  if (profile?.basic?.birthtime) {
    const [h, m] = profile.basic.birthtime.split(':').map(Number);
    seed += (h || 0) * 23 + (m || 0) * 7;
  }

  // 1. 쿠룬파(Kurunpa) 대지 영혼 활력 지수 (55 ~ 98점 범위)
  const kurunpaLifeForceIndex = 55 + (seed % 44);

  // 2. 8대 선조 토템 선정
  const totemIdx = seed % TOTEMS.length;
  const activeTotem = TOTEMS[totemIdx];

  // 3. 송라인 방향 및 테마
  const dirIdx = (seed + 2) % SONGLINE_DIRECTIONS.length;
  const songline = SONGLINE_DIRECTIONS[dirIdx];

  // 4. 다디리(Dadirri) 명상 실천
  const dadirriPractices = [
    '맨발로 흙이나 잔디를 5분간 밟으며 발바닥을 통해 대지와 호흡을 주고받는 접지(Earthing) 명상',
    '말을 멈추고 바람이 나뭇잎을 스치는 소리와 주변의 자연음에 3분간 온전히 귀 기울이기',
    '흐르는 물을 응시하며 내면의 조급함을 강물에 띄워 보내는 마음의 강(Billabong) 비우기',
    '밤하늘의 남십자성과 별자리를 올려다보며 시간의 영원함 속에 내 고민의 크기를 관조하기'
  ];
  const dadirriPractice = dadirriPractices[seed % dadirriPractices.length];

  // 5. 드림타임 지혜 조언
  const dreamtimeWisdom = `선조 정령 [${activeTotem.nameIndigenous}]의 가호 아래, 지금 당신의 발밑에는 [${songline.theme}]을 향한 송라인이 흐르고 있습니다. 쿠룬파 활력(${kurunpaLifeForceIndex}점)을 바탕으로 ${activeTotem.coreMessage}`;

  return {
    engineVersion: ABORIGINAL_DREAMTIME_SONGLINES_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    kurunpaLifeForceIndex,
    activeTotem,
    songlineDirection: songline.direction,
    songlineTheme: songline.theme,
    dadirriPractice,
    dreamtimeWisdom
  };
}

/**
 * 프롬프트 포맷터
 */
export function formatAboriginalDreamtimeSonglinesPrompt(report: DreamtimeSonglineReport): string {
  const t = report.activeTotem;

  return `[🪃 호주 원주민 드림타임(Dreamtime) 송라인 & 8대 토템 영혼 나침반 실측 데이터]
======================================================================
엔진 버전: ${report.engineVersion} | 연산 시각: ${report.calculatedAt}
쿠룬파(Kurunpa) 대지 영혼 활력도: ${report.kurunpaLifeForceIndex} / 100점
======================================================================
1. [주재 선조 토템 정령 (Ancestral Totem)]:
   - 토템명: [${t.name}] (${t.nameIndigenous})
   - 주재 원소: ${t.element}
   - 영적 선물: ${t.spiritualGift}
   - 핵심 전언: "${t.coreMessage}"

2. [송라인(Songline) 대지의 길 & 테마]:
   - 송라인 방향: ${report.songlineDirection}
   - 대지의 노래 테마: ${report.songlineTheme}

3. [다디리(Dadirri) 고요의 경청 & 드림타임 지혜]:
   - 다디리 수련 실천: ${report.dadirriPractice}
   - 드림타임 총평: ${report.dreamtimeWisdom}
======================================================================`;
}
