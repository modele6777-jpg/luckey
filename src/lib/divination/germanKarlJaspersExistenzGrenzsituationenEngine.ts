/**
 * 독일/스위스 카를 야스퍼스(Karl Jaspers) 《철학(Philosophie)》 한계상황(Grenzsituationen) 직시 & 포괄자 암호·실존적 소통 지혜 엔진
 *
 * 20세기 실존철학과 정신병리학의 거장 카를 야스퍼스(Karl Jaspers, 1883~1969)의 불후의 명저
 * 《철학(Philosophie, 1932)》, 《이성과 실존(Vernunft und Existenz)》, 《철학적 신앙(Der philosophische Glaube)》 원전 기반:
 * 1. 한계상황 직시 및 수용력(Grenzsituationen Acceptance Score): 고통, 투쟁, 죄책, 죽음 등 피할 수 없는 삶의 한계 앞에서도 도피하지 않고 정면으로 마주하는 실존적 용기.
 * 2. 실존적 도약 및 자유 실현도(Existential Leap & Freedom Score): 고착된 체념과 절망을 딛고 참된 주체적 자아(Selbstsein)로 도약하는 결단력.
 * 3. 포괄자 암호 해독 통찰력(Cipher of Transcendence Insight Index): 역사, 자연, 일상의 사물 속에 깃든 초월자(Das Umgreifende)의 암호를 직관하고 삶의 궁극적 의미를 발견하는 혜안.
 * 4. 사랑의 투쟁 실존적 소통력(Loving Struggle Authentic Communication Score): 가면을 벗고 온 인격으로 마주하여 서로의 실존을 일깨우는 진실한 영혼의 소통력.
 * 5. 이성과 실존의 조화 균형도(Reason & Existenz Harmonization Index): 비합리적 광신이나 맹목적 허무에 빠지지 않고, 명철한 이성과 깊은 실존적 깊이를 통합하는 원숙도.
 *
 * @version LUCKEY-KARL-JASPERS-EXISTENZ-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const GERMAN_KARL_JASPERS_VERSION = 'LUCKEY-KARL-JASPERS-EXISTENZ-v2.0.0';

export interface JaspersTheme {
  themeKey: string;
  themeTitleDe: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface JaspersAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismDe: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface GermanKarlJaspersExistenzGrenzsituationenResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 카를 야스퍼스 실존 지표 (0~100)
  grenzsituationenAcceptanceScore: number;       // 한계상황 직시 및 수용력 (Grenzsituationen Acceptance)
  existentialLeapFreedomScore: number;           // 실존적 도약 및 자유 실현도 (Existential Leap & Freedom)
  cipherTranscendenceInsightIndex: number;       // 포괄자 암호 해독 통찰력 (Cipher of Transcendence Insight)
  lovingStruggleCommunicationScore: number;      // 사랑의 투쟁 실존적 소통력 (Loving Struggle Communication)
  reasonExistenzHarmonizationIndex: number;      // 이성과 실존의 조화 균형도 (Reason & Existenz Harmonization)
  // 세부 분석
  activeJaspersTheme: JaspersTheme;
  focalJaspersAphorism: JaspersAphorism;
  jaspersComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  jaspersSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const JASPERS_THEMES: JaspersTheme[] = [
  {
    themeKey: 'grenzsituationen',
    themeTitleDe: 'Grenzsituationen & Das Scheitern',
    themeTitleKo: '한계상황의 직시(Grenzsituationen) — 시련 속에서 눈뜨는 참된 실존',
    existentialInsight: '고통, 질병, 실패, 죽음과 같은 한계상황은 우리 뜻대로 바꿀 수 없습니다. 그러나 이를 회피하지 않고 온몸으로 겪어낼 때, 비로소 세속의 껍데기를 벗고 본래적 실존(Selbstsein)이 깨어납니다.',
    practicalCounsel: '지금 마주한 불가피한 제약이나 시련을 원망하지 마십시오. 한계를 겸허히 인정하고 정면으로 응시할 때, 당신의 영혼은 상처를 넘어 더 깊은 존재의 도약으로 나아갑니다.',
  },
  {
    themeKey: 'lovingStruggleCommunication',
    themeTitleDe: 'Liebender Kampf & Existentielle Kommunikation',
    themeTitleKo: '사랑의 투쟁(Liebender Kampf) — 서로를 일깨우는 진실한 소통',
    existentialInsight: '참된 소통은 사교적 예의나 권력 싸움이 아닙니다. 서로에게 가면을 벗고 온 인격으로 마주하여, 상대방의 참된 자유와 실존을 북돋우기 위해 진실하게 부딪히는 사랑의 투쟁입니다.',
    practicalCounsel: '표면적인 대화나 타협에 안주하지 마십시오. 소중한 사람에게 당신의 진실한 마음과 가치관을 솔직하게 털어놓고, 서로의 성장을 돕는 깊은 영혼의 교명을 나누십시오.',
  },
  {
    themeKey: 'dasUmgreifende',
    themeTitleDe: 'Das Umgreifende & Weltorientierung',
    themeTitleKo: '포괄자의 지평(Das Umgreifende) — 만유를 감싸 안는 궁극적 배경',
    existentialInsight: '우리가 인식하는 세계는 전체의 극히 일부일 뿐입니다. 인식하는 나와 인식되는 대상을 모두 감싸 안는 무한한 지평인 포괄자(Das Umgreifende)를 자각할 때 지적 오만이 사라집니다.',
    practicalCounsel: '당신의 작은 경험과 판단이 세상의 전부인 양 착각하지 마십시오. 끝없이 펼쳐진 신비로운 전체의 흐름 속에 겸손히 머무르며 열린 마음으로 배움을 이어가십시오.',
  },
  {
    themeKey: 'chifferTranszendenz',
    themeTitleDe: 'Chiffren der Transzendenz & Das Scheitern',
    themeTitleKo: '초월자의 암호(Chiffreschrift) — 실패 속에서 읽어내는 거룩한 신호',
    existentialInsight: '자연의 신비, 예술의 감동, 심지어 삶의 참담한 좌절과 파탄(Das Scheitern)조차 초월자가 우리에게 보내는 은밀한 암호입니다. 실패는 존재의 파멸이 아니라 초월을 가리키는 손가락입니다.',
    practicalCounsel: '원하던 계획이 무너졌다고 해서 삶 전체가 실패한 것은 아닙니다. 그 깨어짐의 틈새로 비쳐 드는 더 높은 차원의 부름과 깨달음이 무엇인지 귀를 기울이십시오.',
  },
  {
    themeKey: 'vernunftAndExistenz',
    themeTitleDe: 'Vernunft und Existenz in Wechselwirkung',
    themeTitleKo: '이성과 실존의 상호조명 — 맑은 분별과 깊은 결단의 조화',
    existentialInsight: '실존 없는 이성은 차가운 궤변에 머물고, 이성 없는 실존은 맹목적 광신에 떨어집니다. 밝고 명철한 이성적 사유와 뜨거운 실존적 결단이 상호 교섭할 때 완전한 인간성이 피어납니다.',
    practicalCounsel: '냉철한 데이터와 논리를 세우되 가슴속 깊은 양심과 열정을 잃지 마십시오. 감정과 지성이 조화롭게 손잡을 때 어떤 혼란 속에서도 흔들림 없는 길을 걷게 됩니다.',
  },
];

export const JASPERS_APHORISMS: JaspersAphorism[] = [
  {
    aphorismKey: 'grenzsituationenAwakening',
    aphorismKo: '인간은 한계상황을 피할 수 없다. 오직 그 한계를 정직하게 겪어냄으로써 비로소 참된 실존으로 태어난다.',
    aphorismDe: 'In den Grenzsituationen wird der Mensch erst eigentlich gewahr, was er ist.',
    sourceContext: '《철학(Philosophie)》 제2권 실존개명(Existenzerhellung)',
    actionGuidance: '고통과 한계를 부정하거나 도망치려 하지 마십시오. 그 자리에 멈추어 서서 자신을 응시할 때 새로운 실존의 용기가 솟아납니다.',
  },
  {
    aphorismKey: 'existentialCommunicationAlone',
    aphorismKo: '실존은 고립된 섬이 아니다. 오직 타인과의 깊은 실존적 소통 속에서만 나는 진정한 나 자신이 된다.',
    aphorismDe: 'Ich kann nicht ich selbst sein, ohne in Kommunikation zu treten.',
    sourceContext: '《철학(Philosophie)》 제2권 제3장 소통(Kommunikation)',
    actionGuidance: '혼자만의 벽 속에 갇히지 마십시오. 믿을 수 있는 동료나 벗에게 솔직한 내면을 열어 보이고 함께 성장하는 길을 택하십시오.',
  },
  {
    aphorismKey: 'lovingStruggleTruth',
    aphorismKo: '사랑의 투쟁이란 상대를 무너뜨리는 싸움이 아니라, 서로의 참된 자유를 일깨우기 위해 온 존재로 부딪히는 것이다.',
    aphorismDe: 'Der liebende Kampf ist ein Ringen um die Wahrheit des Selbstseins.',
    sourceContext: '《이성과 실존(Vernunft und Existenz)》',
    actionGuidance: '갈등을 두려워하여 침묵하거나 아첨하지 마십시오. 사랑과 존중의 마음을 바탕으로 진실을 마주할 때 진정한 신뢰가 구축됩니다.',
  },
  {
    aphorismKey: 'cipherInFailure',
    aphorismKo: '실패 속에서 인간은 파멸하는 것이 아니라, 현세의 유한성을 꿰뚫고 영원한 초월을 경험한다.',
    aphorismDe: 'Das Scheitern ist das Letzte; im Scheitern erfährt das Dasein das Transzendente.',
    sourceContext: '《철학(Philosophie)》 제3권 형이상학(Metaphysik)',
    actionGuidance: '좌절의 순간이야말로 가장 거대한 지혜의 문턱입니다. 실패를 통해 불필요한 집착을 털어내고 더 넓은 지평을 바라보십시오.',
  },
  {
    aphorismKey: 'reasonWithoutExistenz',
    aphorismKo: '이성 없는 실존은 맹목적 열광에 빠지고, 실존 없는 이성은 차가운 공허에 머문다.',
    aphorismDe: 'Vernunft ohne Existenz wird zur Leere, Existenz ohne Vernunft zur blinden Leidenschaft.',
    sourceContext: '《이성과 실존》 강연록',
    actionGuidance: '차분하고 객관적인 검증을 놓치지 않으면서도, 당신의 삶을 관통하는 숭고한 사명감을 불태우십시오.',
  },
  {
    aphorismKey: 'philosophicalFaith',
    aphorismKo: '철학적 신앙이란 도그마의 맹종이 아니라, 초월자를 향해 끊임없이 깨어 질문하며 나아가는 영혼의 행진이다.',
    aphorismDe: 'Der philosophische Glaube ist der Glaube des denkenden Menschen.',
    sourceContext: '《철학적 신앙(Der philosophische Glaube)》',
    actionGuidance: '주어진 정답에 맹목적으로 안주하지 마십시오. 매일 새롭게 사유하고 질문하며 당신만의 가치를 진실하게 실천하십시오.',
  },
];

function formatJaspersKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeJaspersStage(score: number): string {
  if (score >= 91) return '실존적 도약기 (한계상황의 문턱에서 초월자의 암호가 선명히 읽히는 흐름)';
  if (score >= 83) return '사랑의 투쟁기 (진실한 실존적 소통과 명철한 이성이 어우러지는 국면)';
  return '고요한 응시기 (제약을 외면하지 않고 내면의 중심을 다지는 흐름)';
}

export function calculateGermanKarlJaspersExistenzGrenzsituationen(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): GermanKarlJaspersExistenzGrenzsituationenResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `KARL-JASPERS-EXISTENZ:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const grenzsituationenAcceptanceScore = 78 + (absHash % 21);
  const existentialLeapFreedomScore = 77 + ((absHash >> 3) % 22);
  const cipherTranscendenceInsightIndex = 80 + ((absHash >> 6) % 19);
  const lovingStruggleCommunicationScore = 76 + ((absHash >> 9) % 23);
  const reasonExistenzHarmonizationIndex = 79 + ((absHash >> 12) % 20);

  const themeIndex = (absHash >> 4) % JASPERS_THEMES.length;
  const aphorismIndex = (absHash >> 7) % JASPERS_APHORISMS.length;

  const activeJaspersTheme = JASPERS_THEMES[themeIndex];
  const focalJaspersAphorism = JASPERS_APHORISMS[aphorismIndex];

  const guidanceTitle = `카를 야스퍼스 실존과 한계상황 지혜: ${activeJaspersTheme.themeTitleKo}`;
  const philosophicalCounsel = `실존철학의 거장 카를 야스퍼스의 《철학》은 피할 수 없는 한계상황(Grenzsituationen)을 직시하고, 타인과의 진실한 실존적 소통(Existentielle Kommunikation)을 통해 참된 자아로 도약하도록 이끕니다. ` +
    `현재 당신의 내면을 밝히는 결정적 실존 원리는 '${activeJaspersTheme.themeTitleKo}'입니다. ` +
    `${activeJaspersTheme.practicalCounsel} 아울러 야스퍼스의 불멸의 통찰 "${focalJaspersAphorism.aphorismKo}"를 가슴에 품고, ` +
    `${focalJaspersAphorism.actionGuidance}`;

  const jaspersSynthesisMatrix = {
    dominantTension: `${activeJaspersTheme.themeTitleKo} ↔ ${focalJaspersAphorism.sourceContext}`,
    alignmentState:
      grenzsituationenAcceptanceScore >= 88 && reasonExistenzHarmonizationIndex >= 88
        ? '한계상황 직시와 이성·실존 조화의 고차원 도약'
        : '피할 수 없는 제약을 뚫고 실존적 소통을 여는 국면',
    integratedAction: `${activeJaspersTheme.practicalCounsel} (${focalJaspersAphorism.actionGuidance})`,
  };

  return {
    engineVersion: GERMAN_KARL_JASPERS_VERSION,
    calculatedAtKst: formatJaspersKstTimestamp(now),
    grenzsituationenAcceptanceScore,
    existentialLeapFreedomScore,
    cipherTranscendenceInsightIndex,
    lovingStruggleCommunicationScore,
    reasonExistenzHarmonizationIndex,
    activeJaspersTheme,
    focalJaspersAphorism,
    jaspersComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    jaspersSynthesisMatrix,
  };
}

export function formatGermanKarlJaspersExistenzGrenzsituationenPrompt(
  res: GermanKarlJaspersExistenzGrenzsituationenResult,
): string {
  const lines = [
    `【카를 야스퍼스 《철학》 한계상황 직시 & 초월자 암호·실존적 소통 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 한계상황 직시 및 수용력(Grenzsituationen Acceptance): ${describeJaspersStage(res.grenzsituationenAcceptanceScore)}`,
    `- 실존적 도약 및 자유 실현도(Existential Leap & Freedom): ${describeJaspersStage(res.existentialLeapFreedomScore)}`,
    `- 포괄자 암호 해독 통찰력(Cipher of Transcendence): ${describeJaspersStage(res.cipherTranscendenceInsightIndex)}`,
    `- 사랑의 투쟁 실존적 소통력(Loving Struggle Communication): ${describeJaspersStage(res.lovingStruggleCommunicationScore)}`,
    `- 이성과 실존의 조화 균형도(Reason & Existenz Harmonization): ${describeJaspersStage(res.reasonExistenzHarmonizationIndex)}`,
    `- 핵심 실존 테마: ${res.activeJaspersTheme.themeTitleKo} [${res.activeJaspersTheme.themeTitleDe}]`,
    `- 실존적 통찰: ${res.activeJaspersTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeJaspersTheme.practicalCounsel}`,
    `- 야스퍼스 원전 명언: "${res.focalJaspersAphorism.aphorismKo}"`,
    `- 독일어 원전: "${res.focalJaspersAphorism.aphorismDe}"`,
    `- 원전 출처: [${res.focalJaspersAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalJaspersAphorism.actionGuidance}`,
    `- 종합 야스퍼스 실존 권면: ${res.jaspersComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.jaspersSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.jaspersSynthesisMatrix.dominantTension} | 조율 상태: ${res.jaspersSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.jaspersSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
