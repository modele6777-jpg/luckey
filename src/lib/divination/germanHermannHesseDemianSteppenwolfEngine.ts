/**
 * Qualitative literary perspectives drawn from Hermann Hesse's works.
 * This engine intentionally emits no personal scores, diagnosis, prediction, or attributed quotation.
 * @version LUCKEY-HESSE-DEMIAN-STEPPENWOLF-v2.0.0
 */

export const GERMAN_HERMANN_HESSE_DEMIAN_STEPPENWOLF_VERSION = 'LUCKEY-HESSE-DEMIAN-STEPPENWOLF-v2.5.0';

export interface HesseTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  spiritualInsight: string;
  practicalCounsel: string;
}

export interface GermanHermannHesseDemianSteppenwolfResult {
  engineVersion: string;
  calculatedAtKst: string;
  activeHesseTheme: HesseTheme;
  hesseComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  hesseSteppenwolfSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export const HESSE_THEMES: HesseTheme[] = [
  {
    themeKey: 'breakTheEggAbraxas',
    themeTitleEn: 'Demian: Change and the Search for Self',
    themeTitleKo: '《데미안》 — 변화와 자기 이해를 향한 탐색',
    spiritualInsight: '《데미안》은 새와 알의 상징을 통해 성장과 세계관의 변화를 그립니다. 이는 문학적 비유이며 누구에게나 같은 방식으로 적용되는 법칙은 아닙니다.',
    practicalCounsel: '큰 결정을 서두르기보다 안전하고 되돌릴 수 있는 작은 시도를 골라, 무엇을 배우는지 살펴보세요.',
  },
  {
    themeKey: 'siddharthaRiverOneness',
    themeTitleEn: 'Siddhartha: Listening to the River',
    themeTitleKo: '《싯다르타》 — 강물의 이미지를 통해 현재와 흐름 살피기',
    spiritualInsight: '《싯다르타》에서 강은 주인공이 듣고 배우는 중요한 문학적 이미지입니다. 강의 흐름을 현재와 변화에 대한 성찰의 비유로 읽을 수 있습니다.',
    practicalCounsel: '통제할 수 없는 결과를 잠시 내려놓고, 오늘 할 수 있는 한 가지 행동과 지금 필요한 휴식을 구분해 보세요.',
  },
  {
    themeKey: 'steppenwolfHumorHealing',
    themeTitleEn: 'Steppenwolf: Self-Understanding and Multiple Sides',
    themeTitleKo: '《황야의 이리》 — 상반된 면을 살피는 자기 이해',
    spiritualInsight: '《황야의 이리》의 마법 극장은 주인공의 내적 갈등과 여러 자아상을 탐색하는 문학적 장치입니다. 이를 임상적 설명이나 진단으로 받아들여서는 안 됩니다.',
    practicalCounsel: '상반된 감정이 함께 있을 수 있음을 인정하고, 각각이 무엇을 지키려는지 적어 보세요. 지속적인 고통이 있다면 신뢰하는 사람이나 전문가에게 도움을 구할 수 있습니다.',
  },
  {
    themeKey: 'pathOntoOneself',
    themeTitleEn: 'Demian: A Path Toward Self-Understanding',
    themeTitleKo: '《데미안》 — 자기 자신을 알아가는 길',
    spiritualInsight: '《데미안》은 주인공이 타인의 기대와 자신의 경험 사이에서 정체성을 탐색하는 성장소설로 읽힙니다.',
    practicalCounsel: '남의 기준과 자신의 기준을 나누어 적고, 지금 선택할 수 있는 작은 한 걸음을 정해 보세요.',
  },
];

function selectHesseTheme(query?: string): HesseTheme {
  const text = (query ?? '').toLocaleLowerCase();
  const matches: Array<[RegExp, string]> = [
    [/변화|성장|틀|두려움|새로|시도/, 'breakTheEggAbraxas'],
    [/강물|강|흐름|현재|조급|통제|휴식/, 'siddharthaRiverOneness'],
    [/갈등|모순|상반|유머|감정|자기 이해/, 'steppenwolfHumorHealing'],
    [/정체성|나 자신|자기 자신|선택|기대|소명/, 'pathOntoOneself'],
  ];
  const match = matches.find(([pattern]) => pattern.test(text));
  return HESSE_THEMES.find(theme => theme.themeKey === match?.[1]) ?? HESSE_THEMES[0];
}

export function calculateGermanHermannHesseDemianSteppenwolf(query?: string, now: Date = new Date()): GermanHermannHesseDemianSteppenwolfResult {
  const activeHesseTheme = selectHesseTheme(query);
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
  const hesseSteppenwolfSynthesisMatrix = {
    dominantTension: `${activeHesseTheme.themeTitleKo} ↔ 현실의 작은 시도`,
    alignmentState: '문학적 성찰을 통한 자기 이해와 조율 국면',
    integratedAction: activeHesseTheme.practicalCounsel,
  };
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `"${trimmedQuery}"라는 고민을 '${activeHesseTheme.themeTitleKo}'의 문학적 시선으로 비춰본다면, 지금 스스로에게 허락해 줄 수 있는 가장 안전하고 솔직한 작은 시도는 무엇인가요?`
    : `'${activeHesseTheme.themeTitleKo}'의 장면처럼 지금 내면의 여러 목소리를 차분히 들을 수 있다면, 오늘 가장 다정하게 다독여 주고 싶은 마음은 무엇인가요?`;

  return {
    engineVersion: GERMAN_HERMANN_HESSE_DEMIAN_STEPPENWOLF_VERSION,
    calculatedAtKst,
    activeHesseTheme,
    hesseComprehensiveGuidance: {
      guidanceTitle: `헤르만 헤세 작품에서 얻는 참고 관점: ${activeHesseTheme.themeTitleKo}`,
      philosophicalCounsel: `${activeHesseTheme.spiritualInsight} ${activeHesseTheme.practicalCounsel} 이 내용은 문학적 참고이며, 심리 평가·진단·치료 또는 미래 예측이 아닙니다.`,
    },
    hesseSteppenwolfSynthesisMatrix,
    ritualAction: activeHesseTheme.practicalCounsel,
    reflectionFocus: activeHesseTheme.spiritualInsight,
    reflectiveQuestion,
    interpretiveBoundary: '이는 문학적 해석을 위한 참고일 뿐, 개인 점수·심리 진단·치료·미래 예측이 아닙니다.',
  };
}

export function formatGermanHermannHesseDemianSteppenwolfPrompt(res: GermanHermannHesseDemianSteppenwolfResult): string {
  const lines = [
    '【헤르만 헤세 작품에서 얻은 문학적 참고】',
    `- 엔진 버전: ${res.engineVersion}`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문과 관련해 살펴볼 주제: ${res.activeHesseTheme.themeTitleKo}`,
    `- 작품 맥락: ${res.activeHesseTheme.spiritualInsight}`,
    `- 조심스럽게 적용할 제안: ${res.activeHesseTheme.practicalCounsel}`,
    '- 해석 경계: 이는 문학적 해석을 위한 참고일 뿐, 개인 점수·심리 진단·치료·미래 예측이 아닙니다.',
  ];
  if (res.hesseSteppenwolfSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.hesseSteppenwolfSynthesisMatrix.dominantTension} | 조율 상태: ${res.hesseSteppenwolfSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.hesseSteppenwolfSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- 성찰 초점: ${res.reflectionFocus}`);
  lines.push(`- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}`);
  return lines.join('\n');
}
