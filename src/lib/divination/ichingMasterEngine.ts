/**
 * =========================================================================
 * LUCKEY 주역(周易) 64괘 384효 본·지·호·착·종 4대 대칭 괘상 및 체용 결단 마스터 엔진
 * (I Ching 64 Hexagrams, Four Symmetrical Gua & Ti-Yong Decision Master Engine)
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
 */

import { hexagram, Yao, calculateIching } from './iching';

export const ICHING_MASTER_ENGINE_VERSION = 'LUCKEY-ICHING-v1.0.0';

export const ICHING_MASTER_METHOD =
  '주역(周易) 64괘 정통 이진 비트 수리 산법: 본괘·지괘·호괘·착괘·종괘 4대 대칭 괘상 도출, 체용(體用) 오행 생극제화, 동효(動爻) 심층 해석 및 0~100점 결단 스코어 산출';

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
- 결단 스코어: ${res.decisionScore}점 (${res.decisionGrade})
※ 루시 지침: 주역은 우주의 변화 법칙입니다. 본괘(현재)에서 동효의 움직임을 거쳐 지괘(미래)로 나아가는 흐름과 호괘·착괘·종괘가 주는 다각도 통찰을 자연어 조언에 자연스럽게 녹여내 주세요.`;
}
