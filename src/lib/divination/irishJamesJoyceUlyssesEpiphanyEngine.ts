/**
 * Qualitative literary perspectives drawn from James Joyce's works.
 * Epiphany is located in Stephen Hero; see https://www.joyceproject.com/notes/Wk-bJZUBeQi-aLQfd7Cb.
 * Ulysses episode 4 presents Bloom's household cat, not a lost cat.
 * This engine intentionally emits no personal scores, diagnosis, prediction, or attributed quotation.
 * @version LUCKEY-JOYCE-ULYSSES-EPIPHANY-v2.2.0
 */

export const IRISH_JAMES_JOYCE_ULYSSES_EPIPHANY_VERSION = 'LUCKEY-JOYCE-ULYSSES-EPIPHANY-v2.4.0';

function toKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface JoyceTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  literaryInsight: string;
  practicalCounsel: string;
}

export interface IrishJamesJoyceUlyssesEpiphanyResult {
  engineVersion: string;
  calculatedAtKst: string;
  activeJoyceTheme: JoyceTheme;
  joyceComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  joyceSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  boundaryNotice: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
}

export const JOYCE_THEMES: JoyceTheme[] = [
  {
    themeKey: 'everydayEpiphany',
    themeTitleEn: 'Everyday Epiphany: Noticing Meaning in Ordinary Moments',
    themeTitleKo: '일상의 에피파니 — 평범한 순간을 세심하게 살피기',
    literaryInsight: '《Stephen Hero》에서 스티븐은 일상적인 말과 행동에서 어떤 본질이 드러나는 순간을 에피파니로 설명합니다. 이후 《더블린 사람들》 등에서도 일상의 장면을 통해 인물과 사회를 드러내는 문학적 효과를 살펴볼 수 있습니다.',
    practicalCounsel: '당장 결론을 내리기보다 오늘의 작은 사건과 자신의 반응을 잠시 관찰해 보세요. 그 관찰이 상황을 새롭게 이해하는 데 도움이 될 수 있습니다.',
  },
  {
    themeKey: 'forgeInSoulSmithy',
    themeTitleEn: 'The Artist’s Path: Creative Independence',
    themeTitleKo: '예술가의 길 — 관습을 살피며 창작의 자율성을 찾기',
    literaryInsight: '《젊은 예술가의 초상》은 스티븐 디덜러스가 가족과 종교, 사회적 관습과 씨름하며 예술가로서의 길을 모색하는 과정을 그립니다.',
    practicalCounsel: '주변의 기대를 무조건 따르거나 거부하기보다, 당신에게 중요한 가치를 적고 작고 되돌릴 수 있는 선택부터 시험해 보세요.',
  },
  {
    themeKey: 'bloomCompassion',
    themeTitleEn: 'Leopold Bloom: Everyday Kindness and Consideration',
    themeTitleKo: '레오폴드 블룸 — 일상의 조용한 친절과 배려',
    literaryInsight: '《율리시스》 4화에서 블룸은 집 안의 고양이에게 우유를 주며, 이후에는 스티븐을 돕는 장면도 나옵니다. 이런 장면은 거창하지 않은 배려를 통해 인물을 바라보게 합니다.',
    practicalCounsel: '상대에게 필요한 것이 무엇인지 먼저 물어보고, 가능한 범위에서 구체적인 도움을 건네 보세요. 배려와 함께 자신의 경계도 지키는 것이 중요합니다.',
  },
  {
    themeKey: 'mollyYesAffirmation',
    themeTitleEn: 'Molly Bloom: A Complex View of Life',
    themeTitleKo: '몰리 블룸 — 기억과 욕망을 통해 삶을 바라보기',
    literaryInsight: '《율리시스》의 마지막 장은 몰리 블룸의 긴 내적 독백으로 이루어져 있습니다. 기억과 욕망을 따라가는 형식은 삶에 대한 복합적인 해석을 남깁니다.',
    practicalCounsel: '삶을 한 문장으로 긍정하거나 부정하기보다, 지금 지키고 싶은 것과 바꾸고 싶은 것을 각각 하나씩 적어 보세요.',
  },
];

function selectJoyceTheme(query?: string): JoyceTheme {
  const text = (query ?? '').toLocaleLowerCase();
  const matches: Array<[RegExp, string]> = [
    [/일상|사소|깨달음|관찰|순간/, 'everydayEpiphany'],
    [/창작|예술|독립|자율|개성|작가|관습/, 'forgeInSoulSmithy'],
    [/친절|연민|관계|타인|도움|돌봄|배려/, 'bloomCompassion'],
    [/긍정|희망|수용|기쁨|삶의 의미|살아가/, 'mollyYesAffirmation'],
  ];
  const match = matches.find(([pattern]) => pattern.test(text));
  return JOYCE_THEMES.find(theme => theme.themeKey === match?.[1]) ?? JOYCE_THEMES[0];
}

export function calculateIrishJamesJoyceUlyssesEpiphany(query?: string, nowArg?: Date): IrishJamesJoyceUlyssesEpiphanyResult {
  const now = nowArg ?? new Date();
  const calculatedAtKst = toKstIso(now);
  const activeJoyceTheme = selectJoyceTheme(query);
  const joyceSynthesisMatrix = {
    dominantTension: `${activeJoyceTheme.themeTitleKo} ↔ 일상의 작은 행동`,
    alignmentState: '문학적 에피파니를 통한 일상 관찰과 조율 국면',
    integratedAction: activeJoyceTheme.practicalCounsel,
  };
  const boundaryNotice = '이는 제임스 조이스의 문학 작품을 통한 성찰적 참고일 뿐, 개인 점수·심리 진단·확정적 미래 예측이 아닙니다.';
  const ritualAction = `[${activeJoyceTheme.themeTitleKo}] ${activeJoyceTheme.practicalCounsel}`;
  const reflectionFocus = `오늘 일상에서 '${activeJoyceTheme.themeTitleKo}'의 시선으로 다시 살펴볼 수 있는 작은 장면 하나는 무엇인가요?`;
  const qClean = (query ?? '').trim();
  const reflectiveQuestion = qClean
    ? `지금 "${qClean}" 앞에서 '${activeJoyceTheme.themeTitleKo}'의 시선으로 오늘 잠깐 멈춰 관찰해 볼 작은 장면 하나는 무엇인가요?`
    : reflectionFocus;
  return {
    engineVersion: IRISH_JAMES_JOYCE_ULYSSES_EPIPHANY_VERSION,
    calculatedAtKst,
    activeJoyceTheme,
    joyceComprehensiveGuidance: {
      guidanceTitle: `제임스 조이스 작품에서 얻는 참고 관점: ${activeJoyceTheme.themeTitleKo}`,
      philosophicalCounsel: `${activeJoyceTheme.literaryInsight} ${activeJoyceTheme.practicalCounsel} 이 내용은 문학을 통한 참고이며, 개인의 성격이나 미래를 측정한 결과가 아닙니다.`,
    },
    joyceSynthesisMatrix,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
  };
}

export function formatIrishJamesJoyceUlyssesEpiphanyPrompt(res: IrishJamesJoyceUlyssesEpiphanyResult): string {
  const lines = [
    '【제임스 조이스 작품에서 얻은 문학적 참고】',
    `- 엔진 버전: ${res.engineVersion}`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문과 관련해 살펴볼 주제: ${res.activeJoyceTheme.themeTitleKo}`,
    `- 작품 맥락: ${res.activeJoyceTheme.literaryInsight}`,
    `- 조심스럽게 적용할 제안: ${res.activeJoyceTheme.practicalCounsel}`,
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
    `- 질문 맞춤 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ];
  if (res.joyceSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.joyceSynthesisMatrix.dominantTension} | 조율 상태: ${res.joyceSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.joyceSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
