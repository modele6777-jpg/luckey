/**
 * 송대 소강절 선생의 매화역수(梅花易數) 심역(心易) 선천 작괘 & 체용생극(體用生克) 5대 동태 진단 엔진 (plumBlossomMeihuaOracleEngine.ts)
 *
 * 북송(北宋) 도학 5자 소옹 소강절(邵雍 康節, 1011~1077) 선생의 『황극경세서』 및 『매화역수』 정통 전승:
 * "만물에 조짐이 없으면 점치지 않고, 뜻이 움직이지 않으면 괘를 세우지 않는다."
 *
 * 선천 8괘 수리 체계:
 * 1 乾(하늘·금) / 2 兌(연못·금) / 3 離(불·화) / 4 震(우레·목) /
 * 5 巽(바람·목) / 6 坎(물·수) / 7 艮(산·토) / 8 坤(땅·토)
 *
 * 본괘(本卦), 호괘(互卦), 변괘(變卦) 3단 시공간 궤적과
 * 체(體, 본체/주체)와 용(用, 변화/작용)의 오행 생극비화(生剋比和) 5대 동태 분석.
 */

import type { UserProfile } from '../sharedState';

export const PLUM_BLOSSOM_MEIHUA_ORACLE_ENGINE_VERSION = '1.0.0';

export type MeihuaTrigram = {
  num: number;
  name: string;
  hanja: string;
  nature: string;
  element: '목(Wood)' | '화(Fire)' | '토(Earth)' | '금(Metal)' | '수(Water)';
  symbol: string;
};

export const MEIHUA_TRIGRAMS: Record<number, MeihuaTrigram> = {
  1: { num: 1, name: '건', hanja: '乾', nature: '하늘(天)', element: '금(Metal)', symbol: '☰' },
  2: { num: 2, name: '태', hanja: '兌', nature: '연못(澤)', element: '금(Metal)', symbol: '☱' },
  3: { num: 3, name: '리', hanja: '離', nature: '불(火)', element: '화(Fire)', symbol: '☲' },
  4: { num: 4, name: '진', hanja: '震', nature: '우레(雷)', element: '목(Wood)', symbol: '☳' },
  5: { num: 5, name: '손', hanja: '巽', nature: '바람(風)', element: '목(Wood)', symbol: '☴' },
  6: { num: 6, name: '감', hanja: '坎', nature: '물(水)', element: '수(Water)', symbol: '☵' },
  7: { num: 7, name: '간', hanja: '艮', nature: '산(山)', element: '토(Earth)', symbol: '☶' },
  8: { num: 8, name: '곤', hanja: '坤', nature: '땅(地)', element: '토(Earth)', symbol: '☷' },
};

export interface MeihuaHexagram {
  upper: MeihuaTrigram;
  lower: MeihuaTrigram;
  fullName: string;
  significance: string;
}

export type TiYongRelation = '용생체(用生體 - 대길)' | '체용비화(體用比和 - 길)' | '체극용(體克用 - 소길)' | '체생용(體生用 - 설기/소손)' | '용극체(用克體 - 흉/경계)';

export interface PlumBlossomMeihuaReport {
  engineVersion: string;
  timestamp: string;
  benGua: MeihuaHexagram; // 본괘 (현재의 상태)
  huGua: MeihuaHexagram; // 호괘 (숨겨진 중간 과정)
  bianGua: MeihuaHexagram; // 변괘 (최종 결과의 향방)
  movingLine: number; // 1 ~ 6 동효
  tiGua: MeihuaTrigram; // 체괘 (주체/내담자)
  yongGua: MeihuaTrigram; // 용괘 (객체/마주한 사안)
  tiYongRelation: TiYongRelation;
  auspiciousScore: number; // 0 ~ 100 길흉 지수
  shaoYongJudgment: string; // 소강절 선생의 단언
  temporalTimingGuidance: string; // 시중(時中) 돌파 타이밍과 행동 처방
}

// 오행 생극 판정
function evaluateTiYong(ti: MeihuaTrigram['element'], yong: MeihuaTrigram['element']): { relation: TiYongRelation; score: number } {
  if (ti === yong) {
    return { relation: '체용비화(體用比和 - 길)', score: 85 };
  }
  // 생(生) 관계: 목생화, 화생토, 토생금, 금생수, 수생목
  const generating: Record<string, string> = {
    '목(Wood)': '화(Fire)',
    '화(Fire)': '토(Earth)',
    '토(Earth)': '금(Metal)',
    '금(Metal)': '수(Water)',
    '수(Water)': '목(Wood)',
  };
  // 극(剋) 관계: 목극토, 토극수, 수극화, 화극금, 금극목
  const overcoming: Record<string, string> = {
    '목(Wood)': '토(Earth)',
    '토(Earth)': '수(Water)',
    '수(Water)': '화(Fire)',
    '화(Fire)': '금(Metal)',
    '금(Metal)': '목(Wood)',
  };

  if (generating[yong] === ti) {
    return { relation: '용생체(用生體 - 대길)', score: 95 }; // 외부가 나를 도움
  }
  if (overcoming[ti] === yong) {
    return { relation: '체극용(體克用 - 소길)', score: 70 }; // 내가 제어함
  }
  if (generating[ti] === yong) {
    return { relation: '체생용(體生用 - 설기/소손)', score: 55 }; // 내 기운이 빠짐
  }
  if (overcoming[yong] === ti) {
    return { relation: '용극체(用克體 - 흉/경계)', score: 40 }; // 외부가 나를 핍박함
  }
  return { relation: '체용비화(體用比和 - 길)', score: 75 };
}

export function calculatePlumBlossomMeihuaOracle(options?: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): PlumBlossomMeihuaReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();
  const now = options?.now || new Date();

  let seed = 629173;
  const bdate = profile?.basic?.birthdate || '1990-01-01';
  const btime = profile?.basic?.birthtime || '12:00';
  for (let i = 0; i < bdate.length; i++) seed = (seed * 37 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 23 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 19 + question.charCodeAt(i)) % 1000003;

  const yearNum = now.getFullYear();
  const monthNum = now.getMonth() + 1;
  const dayNum = now.getDate();
  const hourNum = now.getHours();

  // 상괘 (선천수)
  const upperNum = (((seed % 100) + yearNum + monthNum + dayNum) % 8) || 8;
  // 하괘 (후천수)
  const lowerNum = (((Math.floor(seed / 100) % 100) + yearNum + monthNum + dayNum + hourNum) % 8) || 8;
  // 동효 (1~6효)
  const movingLine = (((seed % 60) + yearNum + monthNum + dayNum + hourNum) % 6) || 6;

  const benUpper = MEIHUA_TRIGRAMS[upperNum] || MEIHUA_TRIGRAMS[1];
  const benLower = MEIHUA_TRIGRAMS[lowerNum] || MEIHUA_TRIGRAMS[8];

  // 동효 위치에 따른 체/용 분별: 1~3효 동하면 하괘가 용, 상괘가 체 / 4~6효 동하면 상괘가 용, 하괘가 체
  const isUpperMoving = movingLine >= 4;
  const tiGua = isUpperMoving ? benLower : benUpper;
  const yongGua = isUpperMoving ? benUpper : benLower;

  // 변괘 (동효가 변함)
  const bianUpperNum = isUpperMoving ? ((upperNum + 3) % 8 || 8) : upperNum;
  const bianLowerNum = !isUpperMoving ? ((lowerNum + 3) % 8 || 8) : lowerNum;
  const bianUpper = MEIHUA_TRIGRAMS[bianUpperNum];
  const bianLower = MEIHUA_TRIGRAMS[bianLowerNum];

  // 호괘 (중간 과정)
  const huUpperNum = ((upperNum + lowerNum) % 8) || 8;
  const huLowerNum = ((upperNum * 2 + lowerNum) % 8) || 8;
  const huUpper = MEIHUA_TRIGRAMS[huUpperNum];
  const huLower = MEIHUA_TRIGRAMS[huLowerNum];

  const { relation: tiYongRelation, score: auspiciousScore } = evaluateTiYong(tiGua.element, yongGua.element);

  const benGua: MeihuaHexagram = {
    upper: benUpper,
    lower: benLower,
    fullName: `${benUpper.hanja}${benLower.hanja} (${benUpper.name}${benLower.name})`,
    significance: `${benUpper.nature} 위에 ${benLower.nature}의 기운이 교차함`,
  };

  const huGua: MeihuaHexagram = {
    upper: huUpper,
    lower: huLower,
    fullName: `호괘 ${huUpper.name}${huLower.name}`,
    significance: '내재된 잠재적 인과와 중간 전개 양상',
  };

  const bianGua: MeihuaHexagram = {
    upper: bianUpper,
    lower: bianLower,
    fullName: `변괘 ${bianUpper.name}${bianLower.name}`,
    significance: `${movingLine}효 동효 변화로 맺어질 최종 결실의 터전`,
  };

  let shaoYongJudgment = '';
  if (tiYongRelation.startsWith('용생체')) {
    shaoYongJudgment = `하늘과 사람이 뜻을 모으니(用生體), 구하지 않아도 귀인이 돕고 일이 물 흐르듯 순조롭게 풀릴 대길의 징조입니다.`;
  } else if (tiYongRelation.startsWith('체용비화')) {
    shaoYongJudgment = `벗과 동지가 마음을 합치니(體用比和), 힘을 모아 도모하면 순풍에 돛을 단 듯 번창할 길한 형세입니다.`;
  } else if (tiYongRelation.startsWith('체극용')) {
    shaoYongJudgment = `내가 난관을 능히 통제하니(體克用), 당장의 수고로움은 따르나 굳은 의지로 관철하면 능히 뜻을 이룰 형국입니다.`;
  } else if (tiYongRelation.startsWith('체생용')) {
    shaoYongJudgment = `내 기운을 바깥으로 베푸니(體生用), 일시적인 정체와 지출이 있을 수 있으나 덕을 쌓는 마음으로 호흡을 길게 가져가십시오.`;
  } else {
    shaoYongJudgment = `외부의 기운이 체를 핍박하니(用克體), 무리한 확장을 삼가고 내실을 굳건히 다지며 때를 기다려야 할 수성의 시기입니다.`;
  }

  const temporalTimingGuidance = `현재 본괘는 ${benGua.fullName}이며, ${movingLine}효가 동하여 체(${tiGua.name})와 용(${yongGua.name})의 관계가 [${tiYongRelation}]를 이룹니다. ` +
    `호괘(${huGua.fullName})의 과정을 거쳐 종국에는 변괘(${bianGua.fullName})로 귀결되니, ${shaoYongJudgment}`;

  return {
    engineVersion: PLUM_BLOSSOM_MEIHUA_ORACLE_ENGINE_VERSION,
    timestamp: now.toISOString(),
    benGua,
    huGua,
    bianGua,
    movingLine,
    tiGua,
    yongGua,
    tiYongRelation,
    auspiciousScore,
    shaoYongJudgment,
    temporalTimingGuidance,
  };
}

export function formatPlumBlossomMeihuaOraclePrompt(rep: PlumBlossomMeihuaReport): string {
  return `[송대 소강절 선생 매화역수(梅花易數) 체용생극 선천 작괘 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 본괘(本卦): ${rep.benGua.fullName} [상괘 ${rep.benGua.upper.name}(${rep.benGua.upper.element}) / 하괘 ${rep.benGua.lower.name}(${rep.benGua.lower.element})]
· 동효(動爻): 제 ${rep.movingLine}효 동함 | 체괘: ${rep.tiGua.name}(${rep.tiGua.element}) vs 용괘: ${rep.yongGua.name}(${rep.yongGua.element})
· 체용 생극 판정: ${rep.tiYongRelation} (길흉 점수: ${rep.auspiciousScore}/100)
· 호괘(互卦 - 내재 과정): ${rep.huGua.fullName} | 변괘(變卦 - 종국 결실): ${rep.bianGua.fullName}
· 소강절 선생 심역 단언: ${rep.shaoYongJudgment}
· 시중(時中) 돌파 지침: ${rep.temporalTimingGuidance}`;
}
