/**
 * =========================================================================
 * LUCKEY 주역(周易) 64괘 384효 본·지·호·착·종 4대 대칭 괘상, 체용 및 경방 8궁 세응 결단 마스터 엔진
 * (I Ching 64 Hexagrams, Four Symmetrical Gua, Ti-Yong & Eight Palaces Master Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. 동양 최고(最古)의 메타-수리 철학인 주역 64괘 384효를
 *    LLM의 자의적 지어내기 없이 100% 결정론적 이진 비트 연산으로 계산한다.
 *
 * 2. 4대 대칭 괘상(四大 對稱 卦象) 완전 분석:
 *    - 본괘(本卦): 현재 처한 시공간적 상황의 본질
 *    - 지괘(之卦 / 변괘): 동효(動爻)의 변화를 거쳐 도달할 최종 귀결
 *    - 호괘(互卦): 2·3·4효와 3·4·5효가 엮어내는 숨은 잠재력과 중간 과정
 *    - 착괘(錯卦): 6효의 음양을 전면 반전시켜 비추는 그림자·반대편 리스크
 *    - 종괘(綜卦): 괘를 180도 뒤집어 상대방의 시선에서 바라본 객관적 국면
 *
 * 3. 체용 생극제화(體用 生克制化):
 *    - 체괘(體卦: 동효가 없는 주체 괘)
 *    - 용괘(用卦: 동효가 있는 환경·상대 괘)
 *    - 팔괘 오행(건태 금, 진손 목, 감 수, 이 화, 간곤 토)의 상생상극 수리 판정.
 *    - 용생체(대길), 체극용(길), 비화(길), 체생용(소흉), 용극체(흉)
 *
 * 4. [신규 고도화] 효위(爻位) 6단계 성장 역학 모델:
 *    - 초효(잠복·내실) -> 2효(두각·발아) -> 3효(도약과 경계) ->
 *      4효(결단과 도약) -> 5효(정점 성취) -> 상효(수렴과 차기 전수)
 *
 * 5. [신규 고도화] 경방(京房) 정통 8궁(八宮) 괘 배속 및 세응(世應) 상호작용:
 *    - 본궁·1~5세·유혼·귀혼 8변 궤적 및 세효(주체)와 응효(상대/목적) 음양 배합 판정
 */

import { hexagram, Yao, calculateIching } from './iching';

export const ICHING_MASTER_ENGINE_VERSION = 'LUCKEY-ICHING-v1.1.0';

export const ICHING_MASTER_METHOD =
  '주역(周易) 64괘 정통 이진 비트 수리 산법: 본괘·지괘·호괘·착괘·종괘 4대 대칭 괘상 도출, 체용(體用) 오행 생극제화, 효위(爻位) 6단계 역학, 경방 8궁 세응(世應) 상응도 및 기운 변환 모멘텀 산출';

export interface TrigramInfo {
  name: string;
  symbol: string;
  element: '목' | '화' | '토' | '금' | '수';
  nature: string;
}

export interface HexagramView {
  number: number;
  name: string;
  upper: string;
  lower: string;
  bits: number[]; // 0: 음, 1: 양 (아래에서 위로)
  meaning: string;
}

export interface TiYongRelation {
  tiGua: string; // 체괘 (주체)
  tiElement: string;
  yongGua: string; // 용괘 (객체)
  yongElement: string;
  relationship: '용생체(用生體 · 대길)' | '체극용(體克用 · 길)' | '비화(比和 · 길)' | '체생용(體生用 · 소흉)' | '용극체(用克體 · 흉)';
  summary: string;
}

export interface YaoStageInfo {
  position: number; // 1~6효 (아래에서 위)
  yaoName: string; // 예: 초구, 육이, 구삼...
  isYang: boolean;
  isMoving: boolean;
  lifeStage: string;
  archetypeRole: string;
  actionGuidance: string;
}

export interface HexagramDynamics {
  momentumScore: number; // 0 ~ 100
  phaseShift: '정체 탈피 대도약형' | '순풍 지속 안정형' | '내실 전환 수성형' | '급격한 환경 변혁형';
  movingEntropy: '정적 안정 (동효 0~1개)' | '역동적 변곡점 (동효 2~3개)' | '전면적 대격변 (동효 4개 이상)';
  strategicWindow: {
    firstHalf: string;
    secondHalf: string;
  };
}

export interface PalGongSeYing {
  palaceName: string; // 건궁, 태궁, 이궁, 진궁, 손궁, 감궁, 간궁, 곤궁
  palaceElement: '금' | '화' | '목' | '수' | '토';
  guaType: '본궁괘(本宮卦)' | '일세괘(一世卦)' | '이세괘(二世卦)' | '삼세괘(三世卦)' | '사세괘(四世卦)' | '오세괘(五世卦)' | '유혼괘(遊魂卦)' | '귀혼괘(歸魂卦)';
  seYao: number; // 세효 위치 (1~6) - 나의 위치/주체
  yingYao: number; // 응효 위치 (1~6) - 상대방/목적/환경
  seYingHarmony: '음양 상응(相應 · 길)' | '음양 부응(不應 · 조율 필요)';
  cooperationAdvice: string;
}

export interface IchingMasterResult {
  engineVersion: string;
  method: string;
  status: 'calculated';
  lines: Yao[];
  movingLines: number[]; // 1~6효 (아래에서 위로)
  primary: HexagramView; // 본괘
  changed: HexagramView; // 지괘 (변괘)
  nuclear: HexagramView; // 호괘 (잠재 과정)
  opposite: HexagramView; // 착괘 (그림자 리스크)
  reversed: HexagramView; // 종괘 (상대방 관점)
  tiYong: TiYongRelation;
  decisionScore: number; // 0 ~ 100
  decisionGrade: '적극 추진 (Strong Go)' | '지혜로운 전진 (Cautious Go)' | '내실 관망 (Hold & Prepare)' | '방향 전환 (Pivot)' | '보류 및 수성 (Strong Stop)';
  yaoStages: YaoStageInfo[];
  dominantStage: YaoStageInfo;
  hexagramDynamics: HexagramDynamics;
  palGongSeYing: PalGongSeYing;
  guidance: {
    situationNow: string; // 본괘 조언
    hiddenDynamic: string; // 호괘 조언
    outcomeFuture: string; // 지괘 조언
    counterpartView: string; // 종괘 조언
    actionProtocol: string; // 종합 실천 방침
  };
}

const TRIGRAM_MAP: Record<string, TrigramInfo> = {
  '건': { name: '건(乾)', symbol: '☰', element: '금', nature: '하늘, 강건함, 결단, 창조' },
  '태': { name: '태(兌)', symbol: '☱', element: '금', nature: '연못, 기쁨, 대화, 수렴' },
  '이': { name: '이(離)', symbol: '☲', element: '화', nature: '불, 밝음, 통찰, 명예' },
  '진': { name: '진(震)', symbol: '☳', element: '목', nature: '우레, 발동, 돌파, 충격' },
  '손': { name: '손(巽)', symbol: '☴', element: '목', nature: '바람, 유연함, 침투, 순응' },
  '감': { name: '감(坎)', symbol: '☵', element: '수', nature: '물, 험난함, 지혜, 침잠' },
  '간': { name: '간(艮)', symbol: '☶', element: '토', nature: '산, 멈춤, 안정, 축적' },
  '곤': { name: '곤(坤)', symbol: '☷', element: '토', nature: '땅, 포용, 유순함, 수용' },
};

function parseTrigram(str: string): TrigramInfo {
  const char = str[0];
  return TRIGRAM_MAP[char] || { name: str, symbol: '☰', element: '토', nature: '조화' };
}

/**
 * 6효 비트 배열로부터 HexagramView 객체 생성
 */
function createHexagramView(bits: number[]): HexagramView {
  const h = hexagram(bits);
  return {
    number: h.number,
    name: h.name,
    upper: h.upper,
    lower: h.lower,
    bits,
    meaning: `${h.name} (${h.upper} 위, ${h.lower} 아래)`,
  };
}

/**
 * 5행 생극 관계 판정 (주체: 체, 객체: 용)
 */
function evaluateTiYong(tiElem: string, yongElem: string): TiYongRelation['relationship'] {
  const generates: Record<string, string> = { '목': '화', '화': '토', '토': '금', '금': '수', '수': '목' };
  const overcomes: Record<string, string> = { '목': '토', '토': '수', '수': '화', '화': '금', '금': '목' };

  if (tiElem === yongElem) return '비화(比和 · 길)';
  if (generates[yongElem] === tiElem) return '용생체(用生體 · 대길)';
  if (overcomes[tiElem] === yongElem) return '체극용(體克用 · 길)';
  if (generates[tiElem] === yongElem) return '체생용(體生用 · 소흉)';
  if (overcomes[yongElem] === tiElem) return '용극체(用克體 · 흉)';
  return '비화(比和 · 길)';
}

// 경방 8궁(八宮) 정의 (하괘 비트, 상괘 비트 순서 [b0,b1,b2, b3,b4,b5])
interface PalaceDef {
  name: string;
  element: '금' | '화' | '목' | '수' | '토';
  pureTrigram: [number, number, number];
}

const EIGHT_PALACES: PalaceDef[] = [
  { name: '건궁(乾宮)', element: '금', pureTrigram: [1, 1, 1] },
  { name: '태궁(兌宮)', element: '금', pureTrigram: [1, 1, 0] },
  { name: '이궁(離宮)', element: '화', pureTrigram: [1, 0, 1] },
  { name: '진궁(震宮)', element: '목', pureTrigram: [1, 0, 0] },
  { name: '손궁(巽宮)', element: '목', pureTrigram: [0, 1, 1] },
  { name: '감궁(坎宮)', element: '수', pureTrigram: [0, 1, 0] },
  { name: '간궁(艮宮)', element: '토', pureTrigram: [0, 0, 1] },
  { name: '곤궁(坤宮)', element: '토', pureTrigram: [0, 0, 0] },
];

/**
 * 정통 경방 8궁 괘설(京房 八宮卦)에 기반하여 64괘의 소속 궁과 세응(世應) 위치를 판별합니다.
 */
function determinePalGongSeYing(bits: number[]): PalGongSeYing {
  for (const pal of EIGHT_PALACES) {
    const [p0, p1, p2] = pal.pureTrigram;
    const variants: Array<{
      type: PalGongSeYing['guaType'];
      bits: number[];
      se: number;
      ying: number;
    }> = [
      { type: '본궁괘(本宮卦)', bits: [p0, p1, p2, p0, p1, p2], se: 6, ying: 3 },
      { type: '일세괘(一世卦)', bits: [1 - p0, p1, p2, p0, p1, p2], se: 1, ying: 4 },
      { type: '이세괘(二世卦)', bits: [1 - p0, 1 - p1, p2, p0, p1, p2], se: 2, ying: 5 },
      { type: '삼세괘(三世卦)', bits: [1 - p0, 1 - p1, 1 - p2, p0, p1, p2], se: 3, ying: 6 },
      { type: '사세괘(四世卦)', bits: [1 - p0, 1 - p1, 1 - p2, 1 - p0, p1, p2], se: 4, ying: 1 },
      { type: '오세괘(五世卦)', bits: [1 - p0, 1 - p1, 1 - p2, 1 - p0, 1 - p1, p2], se: 5, ying: 2 },
      { type: '유혼괘(遊魂卦)', bits: [1 - p0, 1 - p1, 1 - p2, p0, 1 - p1, p2], se: 4, ying: 1 },
      { type: '귀혼괘(歸魂卦)', bits: [p0, p1, p2, p0, 1 - p1, p2], se: 3, ying: 6 },
    ];

    for (const v of variants) {
      if (v.bits.every((b, idx) => b === bits[idx])) {
        const seBit = bits[v.se - 1];
        const yingBit = bits[v.ying - 1];
        const seYingHarmony: PalGongSeYing['seYingHarmony'] =
          seBit !== yingBit ? '음양 상응(相應 · 길)' : '음양 부응(不應 · 조율 필요)';
        const cooperationAdvice =
          seYingHarmony.includes('상응')
            ? `세효(${v.se}효)와 응효(${v.ying}효)가 음양으로 유기적 상응을 이루므로, 상대방이나 협력 파트너와의 소통과 거래가 매우 원활하게 진행됩니다.`
            : `세효(${v.se}효)와 응효(${v.ying}효)의 음양이 동질적이어서 자존심 대립이나 정체가 생길 수 있으니, 먼저 양보하고 조건을 명확히 합의하는 조율이 필요합니다.`;

        return {
          palaceName: pal.name,
          palaceElement: pal.element,
          guaType: v.type,
          seYao: v.se,
          yingYao: v.ying,
          seYingHarmony,
          cooperationAdvice,
        };
      }
    }
  }

  // 기본 폴백 (예외 방지)
  return {
    palaceName: '건궁(乾宮)',
    palaceElement: '금',
    guaType: '본궁괘(本宮卦)',
    seYao: 6,
    yingYao: 3,
    seYingHarmony: '음양 상응(相應 · 길)',
    cooperationAdvice: '세효와 응효가 중정의 기운으로 조화를 이룹니다.',
  };
}

/**
 * 효위 6단계 인생/비즈니스 성장 모델 매핑
 */
const YAO_POSITION_PROFILES = [
  {
    pos: 1,
    lifeStage: '잠룡물용(潛龍勿用) - 잠복·내실 축적기 (기반 구축)',
    archetypeRole: '기반 조성자 / 내면 수련자',
    actionGuidance: '아직 역량을 만천하에 드러낼 때가 아니니, 경솔히 나서지 말고 실력과 자원을 단단히 비축하십시오.',
  },
  {
    pos: 2,
    lifeStage: '견룡재전(見龍在田) - 두각·발아기 (조력자와의 만남)',
    archetypeRole: '성장하는 도약자 / 귀인 유치자',
    actionGuidance: '서서히 성과가 가시화되는 시기입니다. 훌륭한 멘토나 협력자를 찾아 외연을 넓히십시오.',
  },
  {
    pos: 3,
    lifeStage: '종일건건(終日乾乾) - 도약과 경계의 변곡점 (치열한 정진)',
    archetypeRole: '치열한 혁신가 / 위기 관리자',
    actionGuidance: '하괘의 정점이자 상괘로 넘어가는 위험한 고비입니다. 밤낮으로 경계하며 허점을 점검하십시오.',
  },
  {
    pos: 4,
    lifeStage: '혹약재연(或躍在淵) - 결단과 도약의 기로 (기회 포착)',
    archetypeRole: '전략적 모험가 / 과감한 결단자',
    actionGuidance: '도약할 것인가 연못에 머물 것인가를 가르는 중대한 기로입니다. 흐름을 읽고 적기에 과감히 베팅하십시오.',
  },
  {
    pos: 5,
    lifeStage: '비룡재천(飛龍在天) - 정점의 성취와 지도력 (결실 만개)',
    archetypeRole: '위대한 리더 / 결실의 주재자',
    actionGuidance: '용이 하늘을 날아 뜻을 만방에 펼치는 대길의 순간입니다. 리더십을 발휘하고 비전을 실현하십시오.',
  },
  {
    pos: 6,
    lifeStage: '항룡유회(亢龍有悔) - 극성(極盛) 후의 수렴 (겸손과 전수)',
    archetypeRole: '지혜로운 원로 / 질서의 수호자',
    actionGuidance: '지나치게 높이 오르면 후회가 따릅니다. 무리한 확장을 멈추고 겸양의 미덕으로 성과를 지키십시오.',
  },
];

/**
 * 주역 64괘 384효 4대 대칭 괘상 및 체용 결단 마스터 엔진 실행
 */
export function calculateIchingMaster(linesOrDate?: readonly number[] | Date): IchingMasterResult {
  let lines: Yao[];
  if (Array.isArray(linesOrDate) && linesOrDate.length === 6) {
    lines = [...linesOrDate] as Yao[];
  } else {
    // 날짜/타임스탬프 기반 소강절 선천팔괘수 시간작괘 (결정론적 일관성)
    const target = linesOrDate instanceof Date ? linesOrDate : new Date();
    const y = target.getFullYear();
    const m = target.getMonth() + 1;
    const d = target.getDate();
    const h = target.getHours();
    const min = target.getMinutes();

    const upperNum = (y + m + d) % 8 || 8;
    const lowerNum = (y + m + d + h + min) % 8 || 8;
    const movingIdx = (y + m + d + h + min) % 6 || 6; // 1 ~ 6

    // 선천괘 비트 매핑 (건1=111, 태2=110, 이3=101, 진4=100, 손5=011, 감6=010, 간7=001, 곤8=000)
    const trigramBits: Record<number, [number, number, number]> = {
      1: [1, 1, 1], // 건
      2: [1, 1, 0], // 태
      3: [1, 0, 1], // 이
      4: [1, 0, 0], // 진
      5: [0, 1, 1], // 손
      6: [0, 1, 0], // 감
      7: [0, 0, 1], // 간
      8: [0, 0, 0], // 곤
    };

    const lBits = trigramBits[lowerNum];
    const uBits = trigramBits[upperNum];
    const fullBits = [...lBits, ...uBits];

    lines = fullBits.map((b, idx) => {
      const isMoving = idx + 1 === movingIdx;
      if (b === 1) return isMoving ? 9 : 7;
      return isMoving ? 6 : 8;
    });
  }

  const base = calculateIching(lines);
  const primaryBits = lines.map((n) => n % 2);
  const primary = createHexagramView(primaryBits);

  // 1. 지괘(之卦 / 변괘)
  const changedBits = lines.map((n) => (n === 6 ? 1 : n === 9 ? 0 : n % 2));
  const changed = createHexagramView(changedBits);

  // 2. 호괘(互卦): 2·3·4효를 하괘, 3·4·5효를 상괘 (0-indexed: [1,2,3] + [2,3,4])
  const nuclearBits = [primaryBits[1], primaryBits[2], primaryBits[3], primaryBits[2], primaryBits[3], primaryBits[4]];
  const nuclear = createHexagramView(nuclearBits);

  // 3. 착괘(錯卦): 6효 음양 전면 반전
  const oppositeBits = primaryBits.map((b) => (b === 1 ? 0 : 1));
  const opposite = createHexagramView(oppositeBits);

  // 4. 종괘(綜卦): 상하 180도 회전 (뒤집기)
  const reversedBits = [...primaryBits].reverse();
  const reversed = createHexagramView(reversedBits);

  // 5. 체용(體用) 판정:
  // 동효가 하괘(1~3효)에 있으면 하괘가 용괘, 상괘가 체괘.
  // 동효가 상괘(4~6효)에 있으면 상괘가 용괘, 하괘가 체괘.
  const hasMovingInLower = base.movingLines.some((l) => l <= 3);
  const lowerTri = parseTrigram(primary.lower);
  const upperTri = parseTrigram(primary.upper);

  const tiTri = hasMovingInLower ? upperTri : lowerTri;
  const yongTri = hasMovingInLower ? lowerTri : upperTri;
  const tiYongRel = evaluateTiYong(tiTri.element, yongTri.element);

  let baseScore = 65;
  if (tiYongRel.includes('용생체')) baseScore = 95;
  else if (tiYongRel.includes('체극용')) baseScore = 82;
  else if (tiYongRel.includes('비화')) baseScore = 78;
  else if (tiYongRel.includes('체생용')) baseScore = 52;
  else if (tiYongRel.includes('용극체')) baseScore = 32;

  let decisionGrade: IchingMasterResult['decisionGrade'] = '지혜로운 전진 (Cautious Go)';
  if (baseScore >= 88) decisionGrade = '적극 추진 (Strong Go)';
  else if (baseScore >= 72) decisionGrade = '지혜로운 전진 (Cautious Go)';
  else if (baseScore >= 55) decisionGrade = '내실 관망 (Hold & Prepare)';
  else if (baseScore >= 40) decisionGrade = '방향 전환 (Pivot)';
  else decisionGrade = '보류 및 수성 (Strong Stop)';

  const tiYongSummary =
    tiYongRel.includes('용생체')
      ? '환경과 외부 조력이 나를 적극적으로 돕는 형세로, 뜻한 바를 거침없이 추진할 때입니다.'
      : tiYongRel.includes('체극용')
      ? '내 역량과 주도권으로 외부 난관을 통제할 수 있으니 소신 있게 밀고 나가세요.'
      : tiYongRel.includes('비화')
      ? '상대와 뜻이 일치하고 동질적인 협력이 이루어지므로 팀워크를 발휘하기에 좋습니다.'
      : tiYongRel.includes('체생용')
      ? '내 에너지와 자원이 외부로 소모되기 쉬우니 과도한 약속과 지출을 경계해야 합니다.'
      : '외부의 압박과 시련이 나를 극하는 형세이므로 정면 충돌을 피하고 힘을 비축하세요.';

  // 6. 효위(爻位) 6단계 성장 역학 도출
  const yaoNamePrefixes = ['초', '', '', '', '', '상'];
  const yaoStages: YaoStageInfo[] = primaryBits.map((b, idx) => {
    const pos = idx + 1;
    const isYang = b === 1;
    const isMoving = base.movingLines.includes(pos);
    const profile = YAO_POSITION_PROFILES[idx];

    let yaoName = '';
    if (pos === 1) yaoName = isYang ? '초구(初九)' : '초육(初六)';
    else if (pos === 6) yaoName = isYang ? '상구(上九)' : '상육(上六)';
    else yaoName = isYang ? `구${['이', '삼', '사', '오'][pos - 2]}(九${pos})` : `육${['이', '삼', '사', '오'][pos - 2]}(六${pos})`;

    return {
      position: pos,
      yaoName,
      isYang,
      isMoving,
      lifeStage: profile.lifeStage,
      archetypeRole: profile.archetypeRole,
      actionGuidance: profile.actionGuidance,
    };
  });

  // 주도 효위: 첫 번째 동효가 우선, 동효가 없으면 5효(군위)
  const dominantStage =
    base.movingLines.length > 0
      ? yaoStages.find((s) => s.position === base.movingLines[0]) || yaoStages[4]
      : yaoStages[4];

  // 7. 경방 8궁 세응 판정
  const palGongSeYing = determinePalGongSeYing(primaryBits);

  // 8. 기운 변환 모멘텀 분석
  const movingCount = base.movingLines.length;
  let movingEntropy: HexagramDynamics['movingEntropy'] = '정적 안정 (동효 0~1개)';
  if (movingCount >= 4) movingEntropy = '전면적 대격변 (동효 4개 이상)';
  else if (movingCount >= 2) movingEntropy = '역동적 변곡점 (동효 2~3개)';

  let phaseShift: HexagramDynamics['phaseShift'] = '순풍 지속 안정형';
  if (baseScore >= 80 && movingCount >= 1) phaseShift = '정체 탈피 대도약형';
  else if (baseScore <= 45 && movingCount >= 1) phaseShift = '급격한 환경 변혁형';
  else if (tiYongRel.includes('체생용') || tiYongRel.includes('용극체')) phaseShift = '내실 전환 수성형';

  const momentumScore = Math.min(
    98,
    Math.max(42, Math.round(baseScore * 0.7 + (movingCount * 6) + (palGongSeYing.seYingHarmony.includes('상응') ? 8 : 2)))
  );

  const hexagramDynamics: HexagramDynamics = {
    momentumScore,
    phaseShift,
    movingEntropy,
    strategicWindow: {
      firstHalf:
        movingCount > 0
          ? `${dominantStage.yaoName}의 위치에서 변화의 징후를 감지하고, 본괘(${primary.name})의 기운을 다지며 기본기를 확립하십시오.`
          : `현재 상황(${primary.name})의 안정성을 십분 활용하여 체계적인 계획과 자원 축적에 집중하십시오.`,
      secondHalf:
        movingCount > 0
          ? `동효의 전환을 거쳐 지괘(${changed.name})로 이동하는 타이밍입니다. ${tiYongRel}의 역학을 활용하여 결실을 수확하십시오.`
          : `호괘(${nuclear.name})에 숨겨진 잠재력을 점진적으로 표면화시켜 지속 가능한 확장을 도모하십시오.`,
    },
  };

  return {
    engineVersion: ICHING_MASTER_ENGINE_VERSION,
    method: ICHING_MASTER_METHOD,
    status: 'calculated',
    lines,
    movingLines: base.movingLines,
    primary,
    changed,
    nuclear,
    opposite,
    reversed,
    tiYong: {
      tiGua: tiTri.name,
      tiElement: tiTri.element,
      yongGua: yongTri.name,
      yongElement: yongTri.element,
      relationship: tiYongRel,
      summary: tiYongSummary,
    },
    decisionScore: baseScore,
    decisionGrade,
    yaoStages,
    dominantStage,
    hexagramDynamics,
    palGongSeYing,
    guidance: {
      situationNow: `본괘는 ${primary.name}으로, 현재 상황의 본질적 기운을 나타냅니다.`,
      hiddenDynamic: `호괘는 ${nuclear.name}으로, 내면에 숨은 잠재력과 중간 전개 과정을 암시합니다.`,
      outcomeFuture: `지괘는 ${changed.name}으로, 동효의 변화를 거쳐 도달할 최종 귀결점입니다.`,
      counterpartView: `종괘는 ${reversed.name}으로, 상대방이나 시장의 시선에서 바라본 국면입니다.`,
      actionProtocol: `${tiYongRel} - ${tiYongSummary}`,
    },
  };
}

/**
 * 프롬프트 주입용 마스터 포맷터
 */
export function formatIchingMasterPrompt(res: IchingMasterResult): string {
  return `[주역(周易) 64괘 4대 대칭 괘상 및 체용 결단 리포트 (엔진: ${res.engineVersion})]
- 본괘(本卦): ${res.primary.name} (${res.primary.upper} 상 / ${res.primary.lower} 하)
- 동효(動爻): ${res.movingLines.length > 0 ? res.movingLines.map((l) => `${l}효`).join(', ') : '동효 없음 (정괘)'}
- 지괘(之卦/변괘): ${res.changed.name} -> 최종 결말과 도달점
- 호괘(互卦/잠재): ${res.nuclear.name} -> 과정 속에 숨은 내면의 잠재 에너지
- 착괘(錯卦/그림자): ${res.opposite.name} -> 상황을 정반대로 뒤집었을 때의 리스크 경고
- 종괘(綜卦/상대관점): ${res.reversed.name} -> 상대방이나 외부 시장의 입장에서 본 국면
- 체용(體用) 생극제화:
  • 체괘(주체): ${res.tiYong.tiGua} (${res.tiYong.tiElement} 기운)
  • 용괘(환경): ${res.tiYong.yongGua} (${res.tiYong.yongElement} 기운)
  • 판정: ${res.tiYong.relationship}
  • 총평: ${res.tiYong.summary}
- 효위(爻位) 6단계 성장 역학:
  • 당면 주도 효위: ${res.dominantStage.yaoName} [${res.dominantStage.lifeStage}]
  • 역할 및 실천 지침: ${res.dominantStage.archetypeRole} -> ${res.dominantStage.actionGuidance}
- 경방 8궁(八宮) 및 세응(世應) 상호작용:
  • 소속 궁위: ${res.palGongSeYing.palaceName} (${res.palGongSeYing.palaceElement}) - ${res.palGongSeYing.guaType}
  • 세효(나): ${res.palGongSeYing.seYao}효 ⇄ 응효(상대/환경): ${res.palGongSeYing.yingYao}효 [${res.palGongSeYing.seYingHarmony}]
  • 상생 협력 조언: ${res.palGongSeYing.cooperationAdvice}
- 기운 변환 모멘텀:
  • 변환 국면: ${res.hexagramDynamics.phaseShift} (모멘텀 ${res.hexagramDynamics.momentumScore}점, 엔트로피: ${res.hexagramDynamics.movingEntropy})
  • 전반기 전략: ${res.hexagramDynamics.strategicWindow.firstHalf}
  • 후반기 전략: ${res.hexagramDynamics.strategicWindow.secondHalf}
- 결단 스코어: ${res.decisionScore}점 (${res.decisionGrade})
※ 루시 지침: 주역은 우주의 변화 법칙입니다. 본괘(현재)에서 동효의 움직임을 거쳐 지괘(미래)로 나아가는 흐름과 호괘·착괘·종괘가 주는 다각도 통찰, 세효와 응효의 상응 역학을 자연어 조언에 자연스럽게 녹여내 주세요.`;
}
