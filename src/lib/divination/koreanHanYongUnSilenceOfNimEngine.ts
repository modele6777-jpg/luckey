/**
 * Qualitative literary perspectives drawn from Manhae Han Yong-un's works.
 * The poem context was checked against https://www.korea.kr/news/cultureColumnView.do?newsId=148887804.
 * This engine intentionally emits no personal scores, diagnosis, prediction, or attributed quotation.
 * @version LUCKEY-HAN-YONG-UN-SILENCE-OF-NIM-v2.0.0
 */

export const KOREAN_HAN_YONG_UN_SILENCE_OF_NIM_VERSION = 'LUCKEY-HAN-YONG-UN-SILENCE-OF-NIM-v2.4.0';

export interface HanYongUnTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  poeticInsight: string;
  practicalCounsel: string;
}

export interface KoreanHanYongUnSilenceOfNimResult {
  engineVersion: string;
  calculatedAtKst: string;
  activeHanYongUnTheme: HanYongUnTheme;
  hanYongUnComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  hanYongUnSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
}

export const HAN_YONG_UN_THEMES: HanYongUnTheme[] = [
  {
    themeKey: 'silenceOfNimSublimation',
    themeTitleEn: 'Silence of Nim: Grief, Hope, and Love',
    themeTitleKo: '《님의 침묵》 — 이별의 슬픔과 희망을 함께 바라보기',
    poeticInsight: '《님의 침묵》은 이별의 슬픔을 표현하면서도 사랑과 희망의 가능성을 함께 다루는 시집으로 읽힙니다. 이 해석은 작품의 주제에 관한 참고이며 개인의 관계 결과를 예측하지 않습니다.',
    practicalCounsel: '상실이나 이별을 겪고 있다면 감정을 서두르지 말고, 오늘 받을 수 있는 지지와 필요한 시간을 살펴보세요.',
  },
  {
    themeKey: 'simWooJangUnbendingIntegrity',
    themeTitleEn: 'Sim Woo Jang: Integrity and Dignity',
    themeTitleKo: '심우장과 만해의 삶 — 존엄과 양심을 돌아보기',
    poeticInsight: '만해 한용운의 시와 독립운동·불교 개혁 활동은 양심과 공적 책임을 생각하게 하는 역사적 맥락을 제공합니다. 작품 해석과 역사적 사실은 구분해 살펴야 합니다.',
    practicalCounsel: '중요한 선택 앞에서는 자신의 가치와 안전, 책임을 함께 적고 신뢰할 만한 관점을 구해 보세요.',
  },
  {
    themeKey: 'ferryboatAndPassengerCompassion',
    themeTitleEn: 'The Ferryboat and the Passenger: Care with Boundaries',
    themeTitleKo: '《나룻배와 행인》 — 배려와 경계를 함께 지키기',
    poeticInsight: '《나룻배와 행인》은 나룻배와 행인의 관계를 통해 기다림과 헌신을 그립니다. 이를 무조건적인 희생이나 관계에서의 복종을 권하는 뜻으로 단정하지 않습니다.',
    practicalCounsel: '타인을 돕고 싶다면 동의와 안전을 먼저 확인하고, 감당할 수 있는 범위 안에서 도움을 선택하세요.',
  },
  {
    themeKey: 'obedienceOfFreeWill',
    themeTitleEn: 'Obedience: Chosen Commitment and Freedom',
    themeTitleKo: '《복종》 — 스스로 선택한 헌신과 자유를 살피기',
    poeticInsight: '한용운의 시 《복종》은 자유와 헌신의 관계를 역설적으로 탐색합니다. 이 문학적 표현은 현실에서 강요나 통제를 정당화하지 않습니다.',
    practicalCounsel: '헌신은 자발성·상호 동의·안전이 지켜질 때 의미가 있습니다. 압박이나 위험이 있다면 거리를 두고 도움을 구하세요.',
  },
];

function selectHanYongUnTheme(query?: string): HanYongUnTheme {
  const text = (query ?? '').toLocaleLowerCase();
  const matches: Array<[RegExp, string]> = [
    [/이별|상실|그리움|헤어|떠남|희망/, 'silenceOfNimSublimation'],
    [/양심|자주|존엄|압박|타협|독립|책임/, 'simWooJangUnbendingIntegrity'],
    [/자비|돕|헌신|관계|돌봄|배려|나룻배/, 'ferryboatAndPassengerCompassion'],
    [/복종|자유|선택|사랑|동의|강요/, 'obedienceOfFreeWill'],
  ];
  const match = matches.find(([pattern]) => pattern.test(text));
  return HAN_YONG_UN_THEMES.find(theme => theme.themeKey === match?.[1]) ?? HAN_YONG_UN_THEMES[0];
}

export function calculateKoreanHanYongUnSilenceOfNim(query?: string, now: Date = new Date()): KoreanHanYongUnSilenceOfNimResult {
  const activeHanYongUnTheme = selectHanYongUnTheme(query);
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;
  const hanYongUnSynthesisMatrix = {
    dominantTension: `${activeHanYongUnTheme.themeTitleKo} ↔ ${activeHanYongUnTheme.themeTitleEn}`,
    alignmentState: '문학적 참고 관점 — 개인의 감정이나 미래를 단정하지 않고 작품의 주제를 비추는 정성적 성찰',
    integratedAction: `${activeHanYongUnTheme.practicalCounsel}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };
  const ritualAction = `[${activeHanYongUnTheme.themeTitleKo}] ${activeHanYongUnTheme.practicalCounsel}`;
  const reflectionFocus = query?.trim()
    ? `'${query.trim()}' 앞에서 나의 가치와 안전, 책임을 함께 살피며 오늘 스스로 선택할 작은 돌봄은 무엇인가요?`
    : `지금 내 마음의 감정을 서두르지 않고, 오늘 나 자신과 곁의 사람에게 건넬 수 있는 정직한 배려는 무엇인가요?`;
  const reflectiveQuestion = query?.trim()
    ? `지금 "${query.trim()}" 앞에서 《${activeHanYongUnTheme.themeTitleKo}》의 시선으로 나의 가치·안전·배려를 함께 지키기 위해 먼저 선택할 한 가지는 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: KOREAN_HAN_YONG_UN_SILENCE_OF_NIM_VERSION,
    calculatedAtKst,
    activeHanYongUnTheme,
    hanYongUnComprehensiveGuidance: {
      guidanceTitle: `한용운 작품에서 얻는 참고 관점: ${activeHanYongUnTheme.themeTitleKo}`,
      philosophicalCounsel: `${activeHanYongUnTheme.poeticInsight} ${activeHanYongUnTheme.practicalCounsel} 이 내용은 문학적 참고이며, 개인의 감정·관계·미래를 측정하거나 예측한 결과가 아닙니다.`,
    },
    hanYongUnSynthesisMatrix,
    interpretiveBoundary: '이는 문학적 해석을 위한 참고일 뿐, 개인 점수·진단·관계 결과·미래 예측이 아닙니다.',
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
  };
}

export function formatKoreanHanYongUnSilenceOfNimPrompt(res: KoreanHanYongUnSilenceOfNimResult): string {
  const lines = [
    '【한용운 작품에서 얻은 문학적 참고】',
    `- 엔진: ${res.engineVersion}`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문과 관련해 살펴볼 주제: ${res.activeHanYongUnTheme.themeTitleKo}`,
    `- 작품 맥락: ${res.activeHanYongUnTheme.poeticInsight}`,
    `- 조심스럽게 적용할 제안: ${res.activeHanYongUnTheme.practicalCounsel}`,
    '- 해석 경계: 이는 문학적 해석을 위한 참고일 뿐, 개인 점수·진단·관계 결과·미래 예측이 아닙니다.',
  ];
  if (res.hanYongUnSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.hanYongUnSynthesisMatrix.dominantTension} | 조율 상태: ${res.hanYongUnSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.hanYongUnSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
    `- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}`,
  );
  return lines.join('\n');
}
