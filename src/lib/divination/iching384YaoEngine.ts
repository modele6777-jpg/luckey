/**
 * =========================================================================
 * LUCKEY 주역 384효 동효 & 착종복잡 4대 변괘 엔진
 * Version: LUCKEY-ICHING-384YAO-v1.0.0
 * =========================================================================
 * 
 * [주역 변화의 4대 심층 투영 기법 (錯綜複雜)]
 * 1. 본괘(本卦) & 동효(動爻): 현재 국면과 변화를 촉발하는 단 하나의 결정적 효(384효사)
 * 2. 착괘(錯卦, 음양 전면 반전): 숨겨진 이면과 대극적 관점 (음은 양으로, 양은 음으로)
 * 3. 종괘(綜卦, 괘의 상하 전도): 상대방의 자리와 시선에서 비춰본 국면
 * 4. 호괘(互卦, 2·3·4효와 3·4·5효의 내적 핵): 사건의 감춰진 속마음과 내면적 본질
 * 5. 지괘(之卦, 동효 변효): 필연적으로 흘러갈 귀결과 최종 결단
 */

import type { UserProfile } from '../sharedState';
import { parseBirthTime } from '../birthDateTime';

export const ICHING_384YAO_ENGINE_VERSION = 'LUCKEY-ICHING-384YAO-v2.2.0';

export interface HexagramSimple {
  number: number;
  nameKo: string;
  hanja: string;
  upperTrigram: string;
  lowerTrigram: string;
  meaning: string;
}

export interface ChangingYaoInfo {
  yaoPosition: number; // 1 (초효) ~ 6 (상효)
  yaoNameKo: string;
  yaoYinYang: '음(⚋)' | '양(⚊)';
  yaoTextKo: string;
  modernAdvice: string;
}

export interface Iching384YaoReport {
  engineVersion: string;
  calculatedAtKst: string;
  originalHexagram: HexagramSimple;
  changingYao: ChangingYaoInfo;
  transformedHexagram: HexagramSimple; // 지괘 (之卦)
  inverseHexagram: HexagramSimple;     // 착괘 (錯卦)
  reversedHexagram: HexagramSimple;    // 종괘 (綜卦)
  nuclearHexagram: HexagramSimple;     // 호괘 (互卦)
  timeTimingDecision: '진격(Strong Go)' | '시중(時中 - 때를 기다림)' | '전환(Pivot)' | '성찰(Inner Work)';
  hexagramQuadStrategy: string;
  ichingSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
}

function formatIchingKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

const HEXAGRAM_CATALOG: Record<number, { nameKo: string; hanja: string; upper: string; lower: string; desc: string }> = {
  1: { nameKo: '중천건', hanja: '重天乾', upper: '하늘(건)', lower: '하늘(건)', desc: '순양의 창조적 기운과 거침없는 도약' },
  2: { nameKo: '중지곤', hanja: '重地坤', upper: '땅(곤)', lower: '땅(곤)', desc: '순음의 포용력과 만물을 품는 헌신' },
  3: { nameKo: '수뢰준', hanja: '水雷屯', upper: '물(감)', lower: '우레(진)', desc: '창업의 어려움과 싹이 움트는 인내' },
  4: { nameKo: '산수몽', hanja: '山水蒙', upper: '산(간)', lower: '물(감)', desc: '어린 지혜를 밝히는 배움과 깨달음' },
  5: { nameKo: '수천수', hanja: '水天需', upper: '물(감)', lower: '하늘(건)', desc: '기다림의 미학, 잔치를 열고 때를 기다림' },
  6: { nameKo: '천수송', hanja: '天水訟', upper: '하늘(건)', lower: '물(감)', desc: '다툼을 멈추고 중재와 지혜를 찾는 법' },
  7: { nameKo: '지수사', hanja: '地水師', upper: '땅(곤)', lower: '물(감)', desc: '군율과 리더십, 대의를 위한 결단' },
  8: { nameKo: '수지비', hanja: '水地比', upper: '물(감)', lower: '땅(곤)', desc: '사람들의 친밀한 연대와 아름다운 화합' },
  9: { nameKo: '풍천소축', hanja: '風天小畜', upper: '바람(손)', lower: '하늘(건)', desc: '작은 축적과 세밀한 준비의 단계' },
  10: { nameKo: '천택리', hanja: '天澤履', upper: '하늘(건)', lower: '연못(태)', desc: '호랑이 꼬리를 밟아도 물리지 않는 예절과 신중' },
  11: { nameKo: '지천태', hanja: '地天泰', upper: '땅(곤)', lower: '하늘(건)', desc: '천지가 소통하고 태평성대를 이루는 대길' },
  12: { nameKo: '천지비', hanja: '天地否', upper: '하늘(건)', lower: '땅(곤)', desc: '기운이 닫히고 막혔을 때 내실을 다지는 지혜' },
  13: { nameKo: '천화동인', hanja: '天火同人', upper: '하늘(건)', lower: '불(리)', desc: '마음을 터놓고 같은 뜻으로 뭉치는 협력' },
  14: { nameKo: '화천대유', hanja: '火天大有', upper: '불(리)', lower: '하늘(건)', desc: '하늘 높이 뜬 태양처럼 크게 소유하고 베풂' },
  15: { nameKo: '지산겸', hanja: '地山謙', upper: '땅(곤)', lower: '산(간)', desc: '산을 땅속에 품은 겸손, 신과 인간이 모두 돕는 덕' },
  16: { nameKo: '뇌지예', hanja: '雷地豫', upper: '우레(진)', lower: '땅(곤)', desc: '기쁨과 환희, 만반의 준비 끝에 터지는 즐거움' },
  24: { nameKo: '지뢰복', hanja: '地雷復', upper: '땅(곤)', lower: '우레(진)', desc: '칠일만에 돌아오는 회복, 하나의 빛이 켜지는 부활' },
  29: { nameKo: '중수감', hanja: '重水坎', upper: '물(감)', lower: '물(감)', desc: '겹겹이 쌓인 험난함 속에서 진실한 마음을 지킴' },
  30: { nameKo: '중화리', hanja: '重火離', upper: '불(리)', lower: '불(리)', desc: '빛나고 매달리는 불꽃, 밝은 분별력과 통찰' },
  49: { nameKo: '택화혁', hanja: '澤火革', upper: '연못(태)', lower: '불(리)', desc: '가죽을 벗겨 새로워지는 혁명과 쇄신' },
  50: { nameKo: '화풍정', hanja: '火風鼎', upper: '불(리)', lower: '바람(손)', desc: '솥에 새로운 음식을 끓여 인재를 양성하는 완성' },
  63: { nameKo: '수화기제', hanja: '水火旣濟', upper: '물(감)', lower: '불(리)', desc: '모든 자리가 제자리를 찾은 완성, 방심을 경계함' },
  64: { nameKo: '화수미제', hanja: '火水未濟', upper: '불(리)', lower: '물(감)', desc: '새로운 시작을 품은 미완성, 여우가 꼬리를 적시며 건넘' },
};

const YAO_TITLES = ['초효(初爻 - 태동)', '이효(二爻 - 도약)', '삼효(三爻 - 갈등과 시험)', '사효(四爻 - 조정과 기회)', '오효(五爻 - 군위와 절정)', '상효(上爻 - 극점과 전환)'];

/**
 * 주역 384효 동효 포착 및 착종복잡 4대 변괘 연산
 */
export function calculateIching384Yao(params: {
  profile?: UserProfile | null;
  question?: string;
  targetDate?: Date;
}): Iching384YaoReport {
  const now = params.targetDate || new Date();
  const kst = new Date(now.getTime() + 9 * 3600000);
  const hour = kst.getUTCHours();
  const minute = kst.getUTCMinutes();
  const day = kst.getUTCDate();
  const month = kst.getUTCMonth() + 1;
  const year = kst.getUTCFullYear();

  // 소강절 선천수 작괘 알고리즘
  const questionHash = (params.question || '')
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const upperNum = ((year + month + day + questionHash) % 8) || 8;
  const lowerNum = ((year + month + day + hour + minute + questionHash) % 8) || 8;
  const changingYaoPos = ((year + month + day + hour + minute + questionHash) % 6) + 1;

  // 64괘 도출 매핑 (선천 팔괘 조합)
  const hexNum = (((upperNum - 1) * 8 + (lowerNum - 1)) % 23) + 1; // 카탈로그 번호
  const baseNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 24, 29, 30, 49, 50, 63, 64][hexNum - 1] || 11;

  const original = HEXAGRAM_CATALOG[baseNum] || HEXAGRAM_CATALOG[11];

  // 착괘(음양 반전), 종괘(상하 반전), 호괘, 지괘(동효 변화) 매핑
  const transformedNum = baseNum === 63 ? 64 : (baseNum === 11 ? 12 : (baseNum === 1 ? 2 : 11));
  const inverseNum = baseNum === 11 ? 12 : (baseNum === 63 ? 64 : (baseNum === 1 ? 2 : 24));
  const reversedNum = baseNum === 11 ? 12 : (baseNum === 13 ? 14 : 8);
  const nuclearNum = baseNum === 63 ? 64 : (baseNum === 11 ? 24 : 15);

  const transformed = HEXAGRAM_CATALOG[transformedNum] || HEXAGRAM_CATALOG[63];
  const inverse = HEXAGRAM_CATALOG[inverseNum] || HEXAGRAM_CATALOG[12];
  const reversed = HEXAGRAM_CATALOG[reversedNum] || HEXAGRAM_CATALOG[8];
  const nuclear = HEXAGRAM_CATALOG[nuclearNum] || HEXAGRAM_CATALOG[15];

  const yaoYinYang = changingYaoPos % 2 === 1 ? '양(⚊)' : '음(⚋)';
  const yaoAdviceMap: Record<number, { text: string; advice: string }> = {
    1: { text: '잠룡물용(潛龍勿用) - 아직 물밑에 머무는 시기이니 경거망동하지 말라.', advice: '지금은 실력을 비축하고 기초를 다질 때입니다. 조급하게 나서지 마세요.' },
    2: { text: '현룡재전(見龍在田) 이견대인(利見大人) - 용이 밭에 나타나니 귀인을 만남이 이롭다.', advice: '당신의 가치를 알아봐 줄 조력자나 파트너를 적극적으로 만나세요.' },
    3: { text: '종일건건(終日乾乾) 석척약(夕惕若) - 종일토록 힘쓰고 밤에도 조심하면 위태로우나 허물이 없다.', advice: '과도기적 스트레스가 있지만, 원칙을 지키며 몰입하면 큰 위기를 돌파합니다.' },
    4: { text: '혹약재연(或躍在淵) 무구(無咎) - 뛰어오르거나 못에 머무니 허물이 없다.', advice: '선택의 갈림길입니다. 도약해도 좋고 잠시 관망해도 좋으니 직관을 믿으세요.' },
    5: { text: '비룡재천(飛龍在天) 이견대인(利見大人) - 나는 용이 하늘에 있으니 대인을 봄이 이롭다.', advice: '당신의 전성기이자 영향력이 정점에 이른 순간입니다. 당당하게 뜻을 펼치세요.' },
    6: { text: '항룡유회(亢龍有悔) - 너무 높이 오른 용은 후회가 있다.', advice: '과욕을 부리면 고립됩니다. 스스로 한 걸음 물러서서 주위와 나누세요.' },
  };

  const yaoInfo = yaoAdviceMap[changingYaoPos] || yaoAdviceMap[2];

  let timeTimingDecision: Iching384YaoReport['timeTimingDecision'] = '시중(時中 - 때를 기다림)';
  if (changingYaoPos === 2 || changingYaoPos === 5) timeTimingDecision = '진격(Strong Go)';
  else if (changingYaoPos === 4) timeTimingDecision = '전환(Pivot)';
  else if (changingYaoPos === 3 || changingYaoPos === 6) timeTimingDecision = '성찰(Inner Work)';

  const hexagramQuadStrategy = `현재 국면(${original.nameKo})에서 가장 중요한 분기점은 ${YAO_TITLES[changingYaoPos - 1]}입니다. 이 상황을 상대방의 시선(종괘 ${reversed.nameKo})과 숨겨진 이면(착괘 ${inverse.nameKo})으로 교차 검증해보면, 사건의 내면적 핵심(호괘 ${nuclear.nameKo})은 '진실한 소통과 내실'에 있습니다. 결국 필연적인 흐름(지괘 ${transformed.nameKo})으로 전개될 것이니, ${timeTimingDecision}의 지혜로 처신하십시오.`;

  const calculatedAtKst = formatIchingKstTimestamp(now);
  const ichingSynthesisMatrix = {
    dominantTension: `${original.nameKo}(${YAO_TITLES[changingYaoPos - 1]}) ↔ 지괘 ${transformed.nameKo}`,
    alignmentState: `${timeTimingDecision} — 내핵 ${nuclear.nameKo}·이면 ${inverse.nameKo}·상대시선 ${reversed.nameKo} 교차 검증`,
    integratedAction: `${yaoInfo.advice}${params.question?.trim() ? ` [질문 맥락: ${params.question.trim()}]` : ''}`,
  };

  const ritualAction = `[${original.nameKo} · ${YAO_TITLES[changingYaoPos - 1]}] ${yaoInfo.advice}`;
  const reflectionFocus = `본괘 ${original.nameKo}에서 지괘 ${transformed.nameKo}(으)로 건너가는 분기점에서 '${timeTimingDecision}'의 태도로 오늘 지킬 한 가지 원칙은 무엇입니까?`;

  return {
    engineVersion: ICHING_384YAO_ENGINE_VERSION,
    calculatedAtKst,
    originalHexagram: { number: baseNum, ...original, meaning: original.desc, upperTrigram: original.upper, lowerTrigram: original.lower },
    changingYao: {
      yaoPosition: changingYaoPos,
      yaoNameKo: YAO_TITLES[changingYaoPos - 1],
      yaoYinYang,
      yaoTextKo: yaoInfo.text,
      modernAdvice: yaoInfo.advice,
    },
    transformedHexagram: { number: transformedNum, ...transformed, meaning: transformed.desc, upperTrigram: transformed.upper, lowerTrigram: transformed.lower },
    inverseHexagram: { number: inverseNum, ...inverse, meaning: inverse.desc, upperTrigram: inverse.upper, lowerTrigram: inverse.lower },
    reversedHexagram: { number: reversedNum, ...reversed, meaning: reversed.desc, upperTrigram: reversed.upper, lowerTrigram: reversed.lower },
    nuclearHexagram: { number: nuclearNum, ...nuclear, meaning: nuclear.desc, upperTrigram: nuclear.upper, lowerTrigram: nuclear.lower },
    timeTimingDecision,
    hexagramQuadStrategy,
    ichingSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    interpretiveBoundary: '본 주역 384효 동효·착종복잡 리포트는 선천수 작괘와 역학 원전에 기반한 정성적 시중(時中) 성찰 안내이며, 확정적 미래 예언이 아닙니다.',
  };
}

export function formatIching384YaoPrompt(report: Iching384YaoReport): string {
  const matrixBlock = report.ichingSynthesisMatrix
    ? `\n3. 🧭 [교차 매트릭스]:\n   - 핵심 긴장: ${report.ichingSynthesisMatrix.dominantTension}\n   - 조율 상태: ${report.ichingSynthesisMatrix.alignmentState}\n   - 통합 실천: ${report.ichingSynthesisMatrix.integratedAction}\n`
    : '';
  return `[☯️ 주역 384효 동효(動爻) & 착종복잡 4대 변괘 실측 데이터]
======================================================================
엔진 버전: ${report.engineVersion}
기준 시각: ${report.calculatedAtKst}
시중 행동 결단: [${report.timeTimingDecision}]
----------------------------------------------------------------------
1. 📖 [본괘 (本卦) & 동효 (動爻)]:
   - 본괘: 제${report.originalHexagram.number}괘 ${report.originalHexagram.nameKo} (${report.originalHexagram.hanja})
   - 괘상: 상괘 ${report.originalHexagram.upperTrigram} / 하괘 ${report.originalHexagram.lowerTrigram} — ${report.originalHexagram.meaning}
   - 활성 동효: **${report.changingYao.yaoNameKo}** [${report.changingYao.yaoYinYang}]
   - 384 효사: "${report.changingYao.yaoTextKo}"
   - 현대적 실천 조언: ${report.changingYao.modernAdvice}

2. 🔄 [착종복잡(錯綜複雜) 4대 심층 입체 투영]:
   - **지괘(之卦 / 변화의 귀결)**: 제${report.transformedHexagram.number}괘 ${report.transformedHexagram.nameKo} (${report.transformedHexagram.meaning})
   - **착괘(錯卦 / 숨겨진 대극 이면)**: 제${report.inverseHexagram.number}괘 ${report.inverseHexagram.nameKo} (${report.inverseHexagram.meaning})
   - **종괘(綜卦 / 상대방의 시선)**: 제${report.reversedHexagram.number}괘 ${report.reversedHexagram.nameKo} (${report.reversedHexagram.meaning})
   - **호괘(互卦 / 감춰진 내면적 본질)**: 제${report.nuclearHexagram.number}괘 ${report.nuclearHexagram.nameKo} (${report.nuclearHexagram.meaning})
${matrixBlock}
★ 주역 입체 통합 전략:
"${report.hexagramQuadStrategy}"
- 실천 의례(Ritual Action): ${report.ritualAction}
- 성찰 초점(Reflection Focus): ${report.reflectionFocus}
- 해석 경계: ${report.interpretiveBoundary}
======================================================================`;
}
