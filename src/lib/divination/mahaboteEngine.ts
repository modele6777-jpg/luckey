/**
 * =========================================================================
 * LUCKEY 정통 미얀마 마하보테(Mahabote) 7궁(七宮) 명반 및 8요일 성좌 엔진
 * (Burmese Mahabote 7-Houses Chart & 8-Day Planetary Astrology Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. AI(LLM)에 의존하지 않는 100% 순수 수리·역법 결정론적 계산 (Deterministic).
 *    동일한 생년월일시 입력에 대해 항상 100% 동일한 7궁 명반과 길흉 분석을 산출한다.
 *
 * 2. 미얀마 소수력(緬曆, Myanmar Era: ME = 서기 연도 - 638) 7분할 수리:
 *    태어난 해의 소수력을 7로 나눈 잉여수(0~6)를 기점으로 7대 하우스 포국:
 *    - 1. 빙가(Binga · 變動/病): 변화, 이동, 순발력, 변덕
 *    - 2. 아타(Ahta · 破/患): 파괴, 시련, 단련, 극복의 성장
 *    - 3. 야자(Yaza · 王/貴): 명예, 지도력, 왕의 위엄, 공적 성취
 *    - 4. 아디파디(Adipadi · 主/權): 권위, 통솔권, 주도적 결정
 *    - 5. 마라나(Marana · 死/絶): 고난, 시험, 영적 성숙, 철학적 심화
 *    - 6. 띠케(Thike · 財/富): 재물 축적, 실속, 번영, 풍요
 *    - 7. 푸티(Puti · 生/榮): 번식, 명성, 밝은 평판, 호감
 *
 * 3. 8요일(Eight Day-Planets) 성좌 배속:
 *    일(태양·가루다), 월(달·호랑이), 화(화성·사자), 수전(수성·엄니코끼리),
 *    수후(라후·엄니없는코끼리), 목(목성·쥐), 금(금성·기니피그), 토(토성·나가용).
 *
 * 4. 본명궁(Root House) 판정:
 *    태어난 요일의 수호 행성이 7궁 중 어디에 입궁했는지 판별:
 *    - 3대 길궁(야자·아디파디·띠케): 대길(大吉), 사회적 성공과 성취
 *    - 평길궁(푸티·빙가): 중길(中吉), 소통과 유연성
 *    - 시험궁(아타·마라나): 고난 극복형 대기만성
 */

import type { UserProfile } from '../sharedState';
import { parseBirthTime } from '../birthDateTime';

export const MAHABOTE_ENGINE_VERSION = 'LUCKEY-MB-v1.0.0';

export const MAHABOTE_METHOD =
  '미얀마 정통 마하보테(Mahabote) 7궁 수리 산법: 소수력(ME=서기-638) 7제 잉여수 기반 7대 하우스(빙가·아타·야자·아디파디·마라나·띠케·푸티) 포국, 8요일 행성·영수(靈獸) 입궁, 본명궁(Root House) 3대 길흉 판정, 당해 연도 나이 다샤(Age Transit) 및 방위·색상 개운 처방 결정론 산출';

export type MahaboteHouseName =
  | '야자(Yaza · 王)'
  | '아디파디(Adipadi · 主)'
  | '띠케(Thike · 財)'
  | '푸티(Puti · 榮)'
  | '빙가(Binga · 動)'
  | '아타(Ahta · 破)'
  | '마라나(Marana · 絶)';

export type MahaboteHouseCategory = '3대 길궁(大吉)' | '평길궁(中吉)' | '시험궁(鍛鍊)';

export interface MahabotePlanetInfo {
  number: number; // 1:일, 2:월, 3:화, 4:수, 5:목, 6:금, 0:토
  koreanName: string;
  planet: string;
  animal: string;
  direction: string;
  element: string;
  color: string;
  gemstone: string;
}

export interface MahaboteHousePlacement {
  houseNumber: number; // 1 ~ 7
  houseName: MahaboteHouseName;
  hanja: string;
  category: MahaboteHouseCategory;
  planet: MahabotePlanetInfo;
  isBirthRootHouse: boolean;
  meaning: string;
}

export interface MahaboteResult {
  status: 'calculated' | 'skipped' | 'error';
  engineVersion: string;
  method: string;
  myanmarEra: number;
  remainder: number;
  birthWeekday: string;
  birthPlanet: MahabotePlanetInfo;
  rootHouse: {
    houseName: MahaboteHouseName;
    category: MahaboteHouseCategory;
    evaluation: string;
  } | null;
  houses: MahaboteHousePlacement[];
  currentAgeTransit: {
    currentAge: number;
    transitHouseName: MahaboteHouseName;
    theme: string;
    actionAdvice: string;
  } | null;
  remedies: {
    luckyDirection: string;
    luckyColors: string[];
    luckyGemstone: string;
    spiritualPractice: string;
  } | null;
  note?: string;
}

// 7대 행성 기본 정보 (미얀마 전통 숫자: 일1, 월2, 화3, 수4, 목5, 금6, 토0)
const PLANETS: Record<number, MahabotePlanetInfo> = {
  1: { number: 1, koreanName: '일요일(태양)', planet: '태양(Sun)', animal: '가루다(Garuda · 신조)', direction: '북동(NE)', element: '화(火)', color: '붉은색, 골드', gemstone: '루비' },
  2: { number: 2, koreanName: '월요일(달)', planet: '달(Moon)', animal: '호랑이(Tiger)', direction: '동(E)', element: '수(水)', color: '흰색, 크림색, 은색', gemstone: '진주, 문스톤' },
  3: { number: 3, koreanName: '화요일(화성)', planet: '화성(Mars)', animal: '사자(Lion)', direction: '남동(SE)', element: '화(火)', color: '분홍색, 밝은 빨강', gemstone: '산호, 루비' },
  4: { number: 4, koreanName: '수요일(수성)', planet: '수성(Mercury)', animal: '상아 있는 코끼리(Tusked Elephant)', direction: '남(S)', element: '목(木)', color: '초록색, 에메랄드', gemstone: '에메랄드' },
  8: { number: 8, koreanName: '수요일 오후(라후)', planet: '라후(Rahu)', animal: '상아 없는 코끼리(Tuskless Elephant)', direction: '북서(NW)', element: '수(水)', color: '짙은 청색, 흑갈색', gemstone: '헤소나이트 가넷' },
  5: { number: 5, koreanName: '목요일(목성)', planet: '목성(Jupiter)', animal: '쥐(Rat)', direction: '서(W)', element: '토(土)', color: '노란색, 오렌지색', gemstone: '옐로우 사파이어, 토파즈' },
  6: { number: 6, koreanName: '금요일(금성)', planet: '금성(Venus)', animal: '기니피그(Guinea Pig / Cow)', direction: '북(N)', element: '금(金)', color: '하늘색, 파스텔블루', gemstone: '다이아몬드, 백수정' },
  0: { number: 0, koreanName: '토요일(토성)', planet: '토성(Saturn)', animal: '나가(Naga · 용)', direction: '남서(SW)', element: '토(土)', color: '검은색, 보라색', gemstone: '블루 사파이어, 자수정' },
};

// 7대 하우스 메타데이터
const HOUSES_META: ReadonlyArray<{
  number: number;
  name: MahaboteHouseName;
  hanja: string;
  category: MahaboteHouseCategory;
  meaning: string;
}> = [
  { number: 1, name: '빙가(Binga · 動)', hanja: '變動', category: '평길궁(中吉)', meaning: '변화와 이동이 잦고 환경 적응력이 뛰어남. 끊임없는 새로움을 추구하는 역동성' },
  { number: 2, name: '아타(Ahta · 破)', hanja: '破患', category: '시험궁(鍛鍊)', meaning: '난관과 장애를 돌파하며 단련되는 자리. 시련을 발판으로 한 강력한 반등력' },
  { number: 3, name: '야자(Yaza · 王)', hanja: '王貴', category: '3대 길궁(大吉)', meaning: '명예, 리더십, 대중의 인정, 조직의 우두머리로 군림하는 당당한 기상' },
  { number: 4, name: '아디파디(Adipadi · 主)', hanja: '主權', category: '3대 길궁(大吉)', meaning: '통솔권, 독립적 결정권, 주도적 영향력. 자수성가형 사업가 및 수장의 기운' },
  { number: 5, name: '마라나(Marana · 絶)', hanja: '死絶', category: '시험궁(鍛鍊)', meaning: '고립과 인내 속에서 영적·철학적 깊이를 성취. 세속적 욕망을 넘어선 통찰' },
  { number: 6, name: '띠케(Thike · 財)', hanja: '財富', category: '3대 길궁(大吉)', meaning: '재물 축적, 실속, 번영, 풍요로운 수확. 노력 대비 결실이 풍성한 금전적 축복' },
  { number: 7, name: '푸티(Puti · 榮)', hanja: '生榮', category: '평길궁(中吉)', meaning: '대인관계의 호감, 밝고 긍정적인 평판, 싹을 틔우고 퍼져나가는 생명력' },
];

// 7궁 포국 순서 (Burmese Mahabote Chart Layout Pattern)
// 전통 7궁 행렬: 잉여수(Remainder)에 따라 행성들의 배속 하우스가 순환
const HOUSE_PLANET_ORDER = [1, 2, 3, 4, 5, 6, 0]; // 일, 월, 화, 수, 목, 금, 토

export function calculateMahabote(params: {
  profile?: UserProfile | null;
  targetYear?: number;
}): MahaboteResult {
  const birthdateStr = params.profile?.basic?.birthdate?.trim() || '';
  if (!birthdateStr) {
    return {
      status: 'skipped',
      engineVersion: MAHABOTE_ENGINE_VERSION,
      method: MAHABOTE_METHOD,
      myanmarEra: 0,
      remainder: 0,
      birthWeekday: '',
      birthPlanet: PLANETS[1],
      rootHouse: null,
      houses: [],
      currentAgeTransit: null,
      remedies: null,
      note: '사용자 생년월일이 입력되지 않아 마하보테 7궁 명반 계산을 건너뜁니다.',
    };
  }

  const parts = birthdateStr.split('-').map(Number);
  const birthYear = parts[0];
  const birthMonth = parts[1] - 1;
  const birthDay = parts[2];
  const birthDate = new Date(birthYear, birthMonth, birthDay);

  // 1. 미얀마 소수력 (Myanmar Era) 계산
  // 미얀마 역법은 전통적으로 4월 중순 띤잔(Thingyan)을 기점으로 새해가 시작되나,
  // 출생연도 기준 환산 표준: 서기연도 - 638
  const me = birthYear - 638;
  const remainder = ((me % 7) + 7) % 7; // 0 ~ 6

  // 2. 출생 요일 행성 식별 (수요일 오후 라후 분기)
  const dayOfWeek = birthDate.getDay(); // 0(일) ~ 6(토)
  const parsedTime = parseBirthTime(params.profile?.basic?.birthtime);
  let planetKey = dayOfWeek;
  if (dayOfWeek === 3) {
    if (parsedTime && parsedTime.hour >= 12) {
      planetKey = 8; // 라후
    } else {
      planetKey = 4; // 수성
    }
  }
  const birthPlanet = PLANETS[planetKey] || PLANETS[dayOfWeek];

  // 3. 마하보테 7궁 포국 (7 Houses Chart Placement)
  // 잉여수에 따라 각 하우스에 입궁하는 행성 수리가 순환
  // 하우스 1: (remainder + 1) % 7
  // 하우스 2: (remainder + 2) % 7 ...
  const houses: MahaboteHousePlacement[] = HOUSES_META.map((meta, idx) => {
    // 전통 수리: 하우스별 배치 행성
    const planetNumIndex = (remainder + idx) % 7;
    const planetNum = HOUSE_PLANET_ORDER[planetNumIndex];
    const pInfo = PLANETS[planetNum];
    const isRoot = (planetNum === (planetKey === 8 ? 4 : planetKey));

    return {
      houseNumber: meta.number,
      houseName: meta.name,
      hanja: meta.hanja,
      category: meta.category,
      planet: pInfo,
      isBirthRootHouse: isRoot,
      meaning: meta.meaning,
    };
  });

  // 4. 본명궁(Root House) 특정
  const rootPlacement = houses.find((h) => h.isBirthRootHouse) || houses[0];
  let rootEval = '';
  if (rootPlacement.category === '3대 길궁(大吉)') {
    rootEval = `본명 수호행성이 ${rootPlacement.houseName}에 입궁하여 타고난 사회적 복록과 성취의 그릇이 극히 큽니다.`;
  } else if (rootPlacement.category === '평길궁(中吉)') {
    rootEval = `본명 수호행성이 ${rootPlacement.houseName}에 입궁하여 유연한 적응력과 밝은 대인관계로 삶의 지평을 넓힙니다.`;
  } else {
    rootEval = `본명 수호행성이 ${rootPlacement.houseName}에 입궁하여 젊은 날의 역경과 시련을 단련의 기회로 삼아 대기만성하는 형국입니다.`;
  }

  // 5. 당해 연도 나이 다샤 (Burmese Age Transit)
  const targetYear = params.targetYear || new Date().getFullYear();
  const currentAge = Math.max(1, targetYear - birthYear + 1); // 한국 나이
  const transitIndex = (remainder + currentAge - 1) % 7;
  const transitHouse = HOUSES_META[transitIndex];

  let transitAdvice = '';
  if (transitHouse.category === '3대 길궁(大吉)') {
    transitAdvice = `${transitHouse.name}의 기운이 당도한 해이므로 적극적으로 사업을 확장하고 명예와 재물을 도모하십시오.`;
  } else if (transitHouse.category === '평길궁(中吉)') {
    transitAdvice = `${transitHouse.name}의 해이므로 인간관계의 네트워크를 강화하고 새로운 환경으로의 유연한 확장에 주력하십시오.`;
  } else {
    transitAdvice = `${transitHouse.name}의 해이므로 무리한 투자는 피하고 내실을 다지며 기술 습득과 건강 관리에 집중하십시오.`;
  }

  // 6. 개운 처방
  const remedies = {
    luckyDirection: birthPlanet.direction,
    luckyColors: birthPlanet.color.split(',').map((c) => c.trim()),
    luckyGemstone: birthPlanet.gemstone,
    spiritualPractice: `${birthPlanet.direction} 방향을 정돈하고, ${birthPlanet.animal} 상징을 가까이하며 ${birthPlanet.gemstone} 원석을 지니면 행운이 증폭됩니다.`,
  };

  return {
    status: 'calculated',
    engineVersion: MAHABOTE_ENGINE_VERSION,
    method: MAHABOTE_METHOD,
    myanmarEra: me,
    remainder,
    birthWeekday: birthPlanet.koreanName,
    birthPlanet,
    rootHouse: {
      houseName: rootPlacement.houseName,
      category: rootPlacement.category,
      evaluation: rootEval,
    },
    houses,
    currentAgeTransit: {
      currentAge,
      transitHouseName: transitHouse.name,
      theme: transitHouse.meaning,
      actionAdvice: transitAdvice,
    },
    remedies,
  };
}

/**
 * 프롬프트 주입용 마하보테 결과 포맷터
 */
export function formatMahabotePrompt(result: MahaboteResult): string {
  if (result.status !== 'calculated') {
    return result.note ? `[마하보테: ${result.note}]` : '';
  }

  const bp = result.birthPlanet;
  const rh = result.rootHouse;
  const at = result.currentAgeTransit;
  const rem = result.remedies;

  const housesSummary = result.houses
    .map(
      (h) =>
        `  * ${h.houseName}: ${h.planet.planet}(${h.planet.animal}) 입궁 [${h.category}]${h.isBirthRootHouse ? ' ★본명궁★' : ''}`
    )
    .join('\n');

  return `
[미얀마 마하보테(Mahabote) 7궁 명반 결정론적 산출 리포트 (${MAHABOTE_ENGINE_VERSION})]
- 소수력(緬曆): ${result.myanmarEra}년 (잉여수: ${result.remainder})
- 출생 요일 행성: ${result.birthWeekday} · ${bp.animal} (수호원소: ${bp.element})
- 본명궁(Root House): ${rh?.houseName} [${rh?.category}]
  * 판정: ${rh?.evaluation}
- 7대 하우스 포국도:
${housesSummary}
- 현재 나이(${at?.currentAge}세) 다샤 운세:
  * 도래 궁: ${at?.transitHouseName}
  * 테마: ${at?.theme}
  * 행동 지침: ${at?.actionAdvice}
- 개운 처방:
  * 길방위: ${rem?.luckyDirection} · 행운 색상: ${rem?.luckyColors.join(', ')} · 수호 보석: ${rem?.luckyGemstone}
  * 실천법: ${rem?.spiritualPractice}
- [AI 해석 절대 지침]: 본 데이터는 미얀마 7궁 마하보테 정통 수리로 계산된 불변의 팩트입니다. 본명궁 및 현재 나이 다샤 하우스의 길흉을 왜곡하지 말고 상담에 정확히 반영하십시오.
`.trim();
}
