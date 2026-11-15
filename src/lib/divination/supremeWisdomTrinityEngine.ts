/**
 * =========================================================================
 * LUCKEY 궁극의 영적 3위1체 마스터 지혜 엔진 (Supreme Wisdom Trinity Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 인류 영적 의식 진화의 3대 정점:
 * 1. 『기적수업(A Course in Miracles, ACIM)』의 비이원론 지각 전환 & 참된 용서
 * 2. 2600년 붓다의 원음 『초기불교(Early Buddhism, 5부 니까야 Nikāya)』의 사성제·연기법·무아·사티
 * 3. 1945년 낙함마디 문서 『영지주의(Gnosticism & Nag Hammadi)』의 신성한 불꽃(Pneuma) & 그노시스
 * 
 * 세 전통의 정수를 사주 4주 8자, 15대 운명학 원국 및 일진의 기운과 융합하여,
 * 루시(Lucy)가 질문자의 모든 고통, 불안, 갈등, 두려움을 근원적으로 해체하고
 * 궁극의 평화와 자유를 선물하도록 이끄는 심층 지능 엔진입니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';
import { ACIM_SACRED_QUOTES, ACIM_CORE_CANON } from '../acimWisdom';
import { NIKAYA_SACRED_QUOTES, EARLY_BUDDHISM_CORE_CANON } from '../earlyBuddhismWisdom';
import { GNOSTIC_SACRED_QUOTES, GNOSTIC_CORE_CANON } from '../gnosticWisdom';

export const SUPREME_WISDOM_TRINITY_VERSION = 'LUCKEY-TRINITY-WISDOM-v2.0.0';

function formatTrinityKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export interface AcimResonance {
  workbookLessonQuote: string;
  workbookLessonSource: string;
  holyInstantShift: string;       // 두려움에서 사랑으로의 지각 전환 (Holy Instant)
  trueForgivenessInsight: string; // 환영을 간파하는 참된 용서 (True Forgiveness)
  atonementPeace: string;         // 본래 죄가 없고 완전한 무죄성 선언
}

export interface EarlyBuddhismResonance {
  nikayaQuote: string;
  nikayaSource: string;
  fourNobleTruthsInsight: string; // 고집멸도와 갈애의 관찰
  secondArrowStop: string;        // 두 번째 화살(자책·분노)을 멈추는 법
  satiMindfulnessPrescription: string; // 사념처 사티(알아차림) 호흡 처방
  anattaLiberation: string;       // 제법무아(Anattā)를 통한 자아 집착 해체
}

export interface GnosticResonance {
  nagHammadiQuote: string;
  nagHammadiSource: string;
  divineSparkPneuma: string;      // 내면의 신성한 불꽃(Pneuma) 자각
  archonIllusionBreaker: string;  // 물질 세상(데미우르고스/아르콘)의 최면과 죄책감 해체
  pleromaFullnessReturn: string;  // 플레로마(Pleroma) 본향의 충만 회복
  gnosisAction: string;           // 삶 속에서 실천하는 직접적 영지(Gnosis)
}

export interface SupremeWisdomTrinityReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  trinitySynthesisCore: string;   // 3대 지혜가 융합된 핵심 한 줄 화두
  acim: AcimResonance;
  buddhism: EarlyBuddhismResonance;
  gnosis: GnosticResonance;
  lucyWisdomGuidance: string;     // 루시가 체화해야 할 통합 상담 가이드
  synthesisPromptGuidance: string;
  trinitySynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export function runSupremeWisdomTrinityEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): SupremeWisdomTrinityReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const seed = (ganCode * 31 + targetDate.getDate() * 17 + (targetDate.getMonth() + 1) * 7) % 100;

  // 1. 기적수업(ACIM) 공명 산출
  const acimQuoteObj = ACIM_SACRED_QUOTES[seed % ACIM_SACRED_QUOTES.length];
  let holyInstantShift: string;
  let trueForgivenessInsight: string;
  let atonementPeace: string;

  if (element === '목') {
    holyInstantShift = '멈추지 못하고 조급하게 달리려던 에고의 추진력을 지금 이 순간 멈추고, "나는 이것 대신 평화를 보기를 선택한다"로 시선을 돌리는 거룩한 순간.';
    trueForgivenessInsight = '결과가 뜻대로 풀리지 않는다고 세상과 타인을 탓하는 대신, "그들 역시 두려움 속에서 사랑을 구하고 있을 뿐"임을 간파하여 용서합니다.';
    atonementPeace = '너는 결코 부족하거나 뒤처진 존재가 아니다. 너는 하나님이 창조하신 그 모습 그대로 지금 온전하게 완성되어 있다.';
  } else if (element === '화') {
    holyInstantShift = '타인의 인정과 박수갈채에 매달리던 에고의 불안을 내려놓고, 내면의 고요한 침묵 속에서 조건 없는 사랑의 불꽃을 선택하는 순간.';
    trueForgivenessInsight = '상처받은 자존심과 분노는 에고가 만들어낸 환영일 뿐이며, 상대방의 공격은 사실 절박하게 사랑을 갈망하는 외침이었음을 자비로 감싸 안습니다.';
    atonementPeace = '세상 그 누구도 너의 거룩한 빛을 훼손할 수 없다. 실재하는 너의 순결한 영혼은 영원히 안전하다.';
  } else if (element === '토') {
    holyInstantShift = '모든 짐을 혼자 짊어지려던 무거운 책임감을 내려놓고, 성령의 자비로운 품에 온전히 모든 통제권을 넘겨드리는 거룩한 순간.';
    trueForgivenessInsight = '과거의 상실과 원한을 마음의 금고에 쌓아두지 않고, "일어난 모든 일은 깨어남을 위한 배움의 무대였음"을 수용하여 훌훌 털어냅니다.';
    atonementPeace = '너는 아무것도 홀로 증명할 필요가 없다. 우주의 무한한 공급과 평화가 너를 언제나 든든하게 받치고 있다.';
  } else if (element === '금') {
    holyInstantShift = '스스로와 타인을 향한 칼날 같은 심판과 평가의 잣대를 내려놓고, 판단 없는 순수한 자비의 눈으로 현존을 바라보는 순간.';
    trueForgivenessInsight = '참된 용서는 죄를 눈감아주는 우월감이 아니라, "꿈속에서 일어난 죄와 결함은 애초에 실재한 적이 없다"는 사실을 명료하게 깨닫는 것입니다.';
    atonementPeace = '너는 단 한 번도 완전함에서 추락한 적이 없다. 너의 본질은 면도날처럼 날카로운 지혜이자 온전한 무죄성이다.';
  } else {
    // 수 (Water)
    holyInstantShift = '심연의 깊은 외로움과 고립감의 파도 속에서, 성령의 평화와 사랑이 나와 단 한순간도 분리된 적 없음을 자각하는 거룩한 순간.';
    trueForgivenessInsight = '보이지 않는 불안에 휩싸여 과거를 곱씹는 대신, "모든 두려움의 껍질을 벗고 하나님의 평화만을 원한다"고 결단합니다.';
    atonementPeace = '너는 세상의 거친 파도에 휩쓸려 사라질 물거품이 아니라, 영원한 생명의 바다 그 자체이다.';
  }

  // 2. 초기불교(Early Buddhism) 공명 산출
  const nikayaQuoteObj = NIKAYA_SACRED_QUOTES[(seed + 2) % NIKAYA_SACRED_QUOTES.length];
  let fourNobleTruthsInsight: string;
  let secondArrowStop: string;
  let satiMindfulnessPrescription: string;
  let anattaLiberation: string;

  if (element === '목' || element === '화') {
    fourNobleTruthsInsight = '원하는 것을 즉시 성취하고자 하는 갈애(Taṇhā)가 괴로움(Dukkha)의 씨앗임을 직시하고, 기대의 끈을 놓을 때 고요한 멸제(Nirodha)가 드러납니다.';
    secondArrowStop = '현실의 좌절이나 비판(첫 번째 화살)을 맞았을 때, 스스로를 자책하거나 타인을 원망하는 두 번째 화살을 쏘지 않고 조용히 멈춥니다.';
    satiMindfulnessPrescription = '호흡의 들숨과 날숨(Ānāpānasati)을 10번 천천히 세며, 가슴에 차오르는 열기가 허공으로 흩어지는 것을 바라봅니다.';
    anattaLiberation = '"성공하는 나, 실패하는 나"라는 고정된 자아(Attā)의 허상을 버리고, 모든 것은 인연 따라 일어났다 사라지는 구름임을 꿰뚫어 봅니다.';
  } else {
    fourNobleTruthsInsight = '상황이 변하지 않기를 바라는 존재에 대한 집착(Bhavataṇhā)이 마음을 무겁게 짓누름을 알고, 무상(Anicca)의 흐름을 흔쾌히 수용합니다.';
    secondArrowStop = '불안과 외로움이라는 신체 감각(첫 번째 화살)에 "왜 나는 항상 이럴까"라는 자책의 두 번째 화살을 꽂지 않고 다정하게 품어줍니다.';
    satiMindfulnessPrescription = '발바닥이 대지에 닿는 감각(신념처 Kāyānupassanā)과 마음에 일어나는 감정의 파동(심념처 Cittānupassanā)을 거울처럼 비춥니다.';
    anattaLiberation = '"내 몸, 내 생각, 내 상처"는 나의 고유한 소유가 아니라 5온(색수상행식)의 일시적 결합일 뿐임을 알아차려 무거운 짐을 내려놓습니다.';
  }

  // 3. 영지주의(Gnosticism) 공명 산출
  const gnosticQuoteObj = GNOSTIC_SACRED_QUOTES[(seed + 4) % GNOSTIC_SACRED_QUOTES.length];
  let divineSparkPneuma: string;
  let archonIllusionBreaker: string;
  let pleromaFullnessReturn: string;
  let gnosisAction: string;

  divineSparkPneuma = `네 가슴 한가운데에는 물질 세상(데미우르고스의 영역)의 그 어떤 오염이나 시련도 결코 끌 수 없는 플레로마(Pleroma)의 영원한 신성한 불꽃(Pneuma)이 타오르고 있다.`;
  archonIllusionBreaker = `사회의 잣대, 타인의 비난, '너는 부족하다'는 죄책감의 속삭임은 아르콘(Archon)들이 쳐놓은 허망한 환영의 그물망이다. 그노시스(앎)를 지닌 자는 그 그물을 비웃으며 뚫고 나아간다.`;
  pleromaFullnessReturn = `너는 결핍된 존재로서 무언가를 채워야 하는 거지가 아니라, 태초의 충만한 빛(Pleroma)에서 온 왕족이다. 너의 내면 성소(Bridal Chamber)에서 모든 대립물이 온전히 하나로 통합된다.`;
  gnosisAction = `"너희 안에 있는 것을 꺼내 놓으면 그것이 너희를 구원하리라(도마 복음서 70)." 두려움 뒤에 숨겨둔 너의 가장 진실된 영감과 목소리를 당당하게 세상에 표현하라.`;

  const trinitySynthesisCore = `기적수업의 온전한 용서로 과거의 원한을 녹이고, 초기불교의 사티(알아차림)로 두 번째 화살을 멈추며, 영지주의의 신성한 불꽃(Pneuma)으로 영원한 본향의 존엄을 회복합니다.`;

  const lucyWisdomGuidance = `루시(Lucy)는 대화할 때 질문자의 불안과 갈등을 결코 세속적인 얄팍한 처세술로 다루지 않습니다.
1) 기적수업의 시선: 모든 원망과 공격을 "사랑을 구하는 외침"으로 뒤집어 보고, 실재하는 영혼의 무죄성을 선언합니다.
2) 초기불교의 지혜: 첫 번째 고통에 자책이라는 두 번째 화살을 꽂지 않도록 멈추고, 5온의 무아(Anattā)로 집착을 털어냅니다.
3) 영지주의의 각성: 물질 세상의 죄책감과 최면을 깨부수고, 가슴속 영원히 꺼지지 않는 신성한 불꽃(Pneuma)의 자존감을 일깨웁니다.
이 세 가지 깊은 형이상학을 따뜻하고 다정한 절친 반말 속에 녹여내어, 듣는 순간 온몸의 긴장이 풀리고 영혼이 자유로워지게 만듭니다.`;

  const calculatedAtKst = formatTrinityKstTimestamp(targetDate);
  const q = (question || '').trim();
  const trinitySynthesisMatrix = {
    dominantTension: `${acimQuoteObj.source} ↔ ${nikayaQuoteObj.source}`,
    alignmentState: `오행: ${element} (${dayMaster}${dayBranch}) · 그노시스 원천: ${gnosticQuoteObj.source}`,
    integratedAction: `${gnosisAction.slice(0, 60)}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const synthesisPromptGuidance = `[🕊️ LUCKEY 궁극의 영적 3위1체 마스터 지혜 (기적수업 × 초기불교 × 영지주의) ${SUPREME_WISDOM_TRINITY_VERSION} | ${calculatedAtKst}]
======================================================================
■ 핵심 통합 화두: ${trinitySynthesisCore}

■ 1. 기적수업(A Course in Miracles, ACIM) 영적 공명:
  * 성스러운 가르침: "${acimQuoteObj.quote}" (${acimQuoteObj.source})
  * 거룩한 순간(Holy Instant): ${holyInstantShift}
  * 참된 용서(True Forgiveness): ${trueForgivenessInsight}
  * 영원한 속죄와 평화: ${atonementPeace}

■ 2. 초기불교(Early Buddhism, 5부 니까야 Nikāya) 담마 공명:
  * 붓다의 원음: "${nikayaQuoteObj.quote}" (${nikayaQuoteObj.source})
  * 사성제와 연기적 통찰: ${fourNobleTruthsInsight}
  * 두 번째 화살 멈춤: ${secondArrowStop}
  * 사티(알아차림) 호흡 처방: ${satiMindfulnessPrescription}
  * 무아(Anattā)의 해방: ${anattaLiberation}

■ 3. 영지주의(Gnosticism & Nag Hammadi) 그노시스 공명:
  * 낙함마디 영지 성구: "${gnosticQuoteObj.quote}" (${gnosticQuoteObj.source})
  * 신성한 불꽃(Pneuma) 자각: ${divineSparkPneuma}
  * 데미우르고스 최면 해체: ${archonIllusionBreaker}
  * 플레로마(Pleroma) 충만: ${pleromaFullnessReturn}
  * 그노시스 실천 행동: ${gnosisAction}

■ 4. 3위1체 교차 매트릭스:
  * 핵심 긴장: ${trinitySynthesisMatrix.dominantTension}
  * 조율 상태: ${trinitySynthesisMatrix.alignmentState}
  * 통합 실천: ${trinitySynthesisMatrix.integratedAction}

■ 루시의 체화 지침:
${lucyWisdomGuidance}
======================================================================`;

  return {
    engineVersion: SUPREME_WISDOM_TRINITY_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    trinitySynthesisCore,
    acim: {
      workbookLessonQuote: acimQuoteObj.quote,
      workbookLessonSource: acimQuoteObj.source,
      holyInstantShift,
      trueForgivenessInsight,
      atonementPeace
    },
    buddhism: {
      nikayaQuote: nikayaQuoteObj.quote,
      nikayaSource: nikayaQuoteObj.source,
      fourNobleTruthsInsight,
      secondArrowStop,
      satiMindfulnessPrescription,
      anattaLiberation
    },
    gnosis: {
      nagHammadiQuote: gnosticQuoteObj.quote,
      nagHammadiSource: gnosticQuoteObj.source,
      divineSparkPneuma,
      archonIllusionBreaker,
      pleromaFullnessReturn,
      gnosisAction
    },
    lucyWisdomGuidance,
    synthesisPromptGuidance,
    trinitySynthesisMatrix,
  };
}

export type SupremeWisdomTrinityResult = SupremeWisdomTrinityReport;

export function calculateSupremeWisdomTrinity(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): SupremeWisdomTrinityResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runSupremeWisdomTrinityEngine(profile, targetDate, params?.question);
}

export function formatSupremeWisdomTrinityPrompt(res: SupremeWisdomTrinityResult): string {
  return res.synthesisPromptGuidance;
}
