/**
 * 프랑스 롤랑 바르트(Roland Barthes) 《신화론》·《밝은 방》·《텍스트의 즐거움》 저자의 죽음·푼크툼(Punctum)·기호학적 탈신화화·능동적 재창조 지혜 엔진
 *
 * 20세기 프랑스 기호학·구조주의 및 현대 문학비평의 거장 롤랑 바르트(1915~1980)의 원전 기반:
 * 1. 푼크툼(Punctum) 영혼 관통 직관 및 감응력 지표 (Punctum Soul-Piercing Affective Intuition Score): 평범하고 상투적인 정보(스투디움)를 뚫고 나와 심장을 찌르듯 번뜩이는 독창적 디테일과 감동을 포착하는 직관력.
 * 2. 현대 신화의 기호학적 탈신화화력 (Semiotic Demythologization Index): 사회가 '자연스럽고 당연한 것'으로 포장해 주입한 통념과 허상을 꿰뚫어 보고 그 이면의 의미를 해체하는 비판적 안목.
 * 3. 저자의 죽음 및 능동적 재창조 독해력 (Death of Author & Scriptible Co-Creation Score): 고정된 권위적 해석에 맹종하지 않고, 자신의 삶과 상황에 맞추어 주체적으로 의미를 재창조하고 개척하는 창의적 주체성.
 * 4. 텍스트의 즐거움 및 유희적 몰입 지수 (Plaisir du Texte & Jouissance Delight Index): 빡빡한 의무감과 메마른 기능주의를 넘어 배움과 일, 삶의 순간 자체에서 깊은 지적·감각적 희열을 향유하는 능력.
 * 5. 다의적 기표(Signifiant) 유연성 및 열린 해석력 (Polyphonic Signifier Fluidity & Open Horizon Score): 단 하나의 완결된 결론으로 문을 닫지 않고, 끊임없이 확장되는 다채로운 가능성의 결을 기쁘게 음미하는 유연성.
 *
 * @version LUCKEY-ROLAND-BARTHES-SEMIOTICS-PUNCTUM-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_ROLAND_BARTHES_SEMIOTICS_PUNCTUM_VERSION = 'LUCKEY-ROLAND-BARTHES-SEMIOTICS-PUNCTUM-v2.1.0';

export interface BarthesTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface BarthesAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchRolandBarthesSemioticsPunctumResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 롤랑 바르트 핵심 지표 (0~100)
  punctumAffectiveIntuitionScore: number;       // 푼크툼 영혼 관통 직관 및 감응력 지표 (Punctum Soul-Piercing Affective Intuition)
  mythologicalDemythologizationIndex: number;  // 현대 신화의 기호학적 탈신화화력 (Semiotic Demythologization Index)
  deathOfAuthorScriptibleReaderScore: number;  // 저자의 죽음 및 능동적 재창조 독해력 (Death of Author & Scriptible Co-Creation)
  plaisirDuTexteSensualDelightIndex: number;   // 텍스트의 즐거움 및 유희적 몰입 지수 (Plaisir du Texte & Jouissance Delight)
  polyphonicSignifierFluidityScore: number;    // 다의적 기표 유연성 및 열린 해석력 (Polyphonic Signifier Fluidity)
  // 세부 분석
  activeBarthesTheme: BarthesTheme;
  focalBarthesAphorism: BarthesAphorism;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  barthesComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const BARTHES_THEMES: BarthesTheme[] = [
  {
    themeKey: 'punctumPiercingGaze',
    themeTitleEn: 'Punctum: Discovering the Unplanned Detail that Pierces the Soul Beyond Ordinary Studium',
    themeTitleKo: '푼크툼(Punctum)의 직관 — 뻔한 상식(스투디움)을 뚫고 가슴을 찌르는 디테일 포착하기',
    pragmaticInsight: '바르트는 사진에서 교양적 관심이나 일반적 정보(스투디움, Studium)와 구분되는, 의도치 않게 화살처럼 날아와 보는 이의 심장을 찌르는 치명적인 디테일을 ‘푼크툼(Punctum)’이라 불렀습니다.',
    practicalCounsel: '남들이 다 보는 평범하고 무난한 정보에만 머물지 마십시오. 당신의 직관과 감성을 예리하게 벼려, 당신의 마음을 강렬하게 흔드는 단 하나의 고유한 디테일을 찾아내십시오. 그 작은 차이가 비범함을 가릅니다.',
  },
  {
    themeKey: 'demythologizingEveryday',
    themeTitleEn: 'Demythologization: Stripping Away Artificial Ideology Masquerading as Nature',
    themeTitleKo: '탈신화화의 안목 — 자연스럽고 당연한 것으로 포장된 상투적 통념과 허상 벗겨내기',
    pragmaticInsight: '바르트의 《신화론》은 역사적·문화적으로 만들어진 인위적 편견이 마치 ‘원래부터 당연한 자연의 법칙’인 것처럼 군림하는 현대의 신화를 예리하게 고발합니다.',
    practicalCounsel: '“원래 다 그래”, “원래 이렇게 해왔어”라는 말을 무비판적으로 수용하지 마십시오. 상투적인 관행과 허상의 이면을 꿰뚫어 보고 본질을 질문하십시오. 의문을 품는 자만이 새로운 규칙을 창조합니다.',
  },
  {
    themeKey: 'deathOfAuthorEmpowerment',
    themeTitleEn: 'Death of the Author: Emancipating the Reader to Recreate Living Meaning Freely',
    themeTitleKo: '저자의 죽음과 능동적 독자 — 권위자의 정답에 얽매이지 않고 내 삶의 의미를 직접 쓰기',
    pragmaticInsight: '바르트는 “저자의 죽음은 독자의 탄생이라는 대가를 치러야 한다”고 선언했습니다. 과거의 권위나 만든 이의 의도에 얽매일 필요 없이, 수용자가 주체적으로 텍스트를 재해석하고 재창조할 때 비로소 진정한 생명력이 태어납니다.',
    practicalCounsel: '누군가 정해준 정답이나 지침에 수동적으로 끌려다니지 마십시오. 당신의 상황과 통찰에 맞게 주체적으로 규칙을 재해석하고 새로운 가치를 덧붙이십시오. 당신의 삶의 진정한 저자는 바로 당신입니다.',
  },
  {
    themeKey: 'plaisirDuTexteJoy',
    themeTitleEn: 'Le Plaisir du Texte: Savoring Deep Sensual Joy and Playful Immersion in Creative Work',
    themeTitleKo: '텍스트의 즐거움 — 메마른 의무감을 넘어 창작과 몰입 자체의 찬란한 희열 누리기',
    pragmaticInsight: '배움과 창작, 일은 단순히 목표를 달성하기 위한 고통스러운 노동이어선 안 됩니다. 바르트는 언어와 사유의 유희 속에서 터져 나오는 지적·감각적 열락(Jouissance)을 찬미했습니다.',
    practicalCounsel: '과도한 성과 압박에 짓눌려 과정을 고역으로 만들지 마십시오. 당신이 다루는 작업과 사유의 결 자체를 즐기십시오. 스스로 즐기며 몰입하는 사람의 결과물에는 그 누구도 흉내 낼 수 없는 매혹적인 향기가 깃듭니다.',
  },
];

export const BARTHES_APHORISMS: BarthesAphorism[] = [
  {
    aphorismKey: 'readerBirth',
    aphorismKo: '저자의 죽음은 독자의 탄생이라는 대가를 치러야 한다. 의미는 원천에 갇혀 있는 것이 아니라 그것을 읽는 자의 손끝에서 완성된다.',
    aphorismFrench: "La naissance du lecteur doit se payer de la mort de l'Auteur.",
    sourceContext: '롤랑 바르트 《저자의 죽음(La mort de l\'auteur)》',
    actionGuidance: '과거의 선례나 권위자의 말에 기죽지 마십시오. 당신의 시선으로 상황을 재해석하고 새로운 가치를 써 내려가십시오.',
  },
  {
    aphorismKey: 'punctumWound',
    aphorismKo: '푼크툼은 나를 찌르고, 상처 내며, 나를 사로잡는 디테일이다. 그것은 의도되지 않았기에 순수하게 빛난다.',
    aphorismFrench: "Le punctum d'une photo, c'est ce hasard qui, en elle, me point (mais aussi me meurtrit, me poigne).",
    sourceContext: '롤랑 바르트 《밝은 방(La Chambre claire)》',
    actionGuidance: '완벽하게 정돈된 기획보다 마음에 번뜩이는 독창적 감응과 직관을 신뢰하십시오. 그것이 대중의 심장을 관통합니다.',
  },
  {
    aphorismKey: 'mythNaturalization',
    aphorismKo: '신화는 역사를 자연으로 탈바꿈시킨다. 만들어진 것을 원래부터 그랬던 것처럼 믿게 만드는 마술에 속지 마라.',
    aphorismFrench: "Le mythe transforme l'histoire en nature.",
    sourceContext: '롤랑 바르트 《신화론(Mythologies)》',
    actionGuidance: '세상이 당연하다고 주입하는 상식과 관성에 의문을 제기하십시오. 그 인위적 틀을 벗겨낼 때 진짜 기회가 보입니다.',
  },
  {
    aphorismKey: 'pleasureOfText',
    aphorismKo: '텍스트의 즐거움이란 독자가 그것을 읽으며 기꺼이 길을 잃고 자신을 기쁘게 내맡길 때 비로소 피어난다.',
    aphorismFrench: "Le texte de plaisir est celui qui contente, remplit, donne de l'euphorie.",
    sourceContext: '롤랑 바르트 《텍스트의 즐거움(Le Plaisir du texte)》',
    actionGuidance: '과정을 의무로만 여기지 말고 유쾌한 유희로 바꾸십시오. 즐기는 자의 유쾌한 에너지가 결국 최고의 결과를 빚어냅니다.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function describeBarthesStage(score: number): string {
  if (score >= 95) return '선명한 푼크툼의 번뜩임으로 살아 숨 쉬는 국면';
  if (score >= 91) return '통념을 가볍게 걷어 내고 새 의미를 엮는 흐름';
  return '조용한 감응의 결을 음미하며 여백을 여는 단계';
}

export function calculateFrenchRolandBarthesSemioticsPunctum(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): FrenchRolandBarthesSemioticsPunctumResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const seedString = `ROLAND-BARTHES-SEMIOTICS-PUNCTUM:${name}:${birthDate}:${birthTime}:${gender}:${kstDate}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const punctumAffectiveIntuitionScore = 89 + ((absHash >> 1) % 10);
  const mythologicalDemythologizationIndex = 88 + ((absHash >> 4) % 11);
  const deathOfAuthorScriptibleReaderScore = 87 + ((absHash >> 7) % 12);
  const plaisirDuTexteSensualDelightIndex = 89 + ((absHash >> 10) % 10);
  const polyphonicSignifierFluidityScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % BARTHES_THEMES.length;
  const aphorismIndex = (absHash >> 8) % BARTHES_APHORISMS.length;

  const activeBarthesTheme = BARTHES_THEMES[themeIndex];
  const focalBarthesAphorism = BARTHES_APHORISMS[aphorismIndex];

  const guidanceTitle = `롤랑 바르트 기호학과 푼크툼의 지혜: ${activeBarthesTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 현대 기호학과 문학비평의 독보적 거장 롤랑 바르트 선생은 《신화론》과 《밝은 방》을 통해 ` +
    `상투적 통념을 해체하는 기호학적 탈신화화, 평범한 정보(Studium)를 뚫고 영혼을 찌르는 매혹적인 디테일인 푼크툼(Punctum), ` +
    `권위자의 고정된 틀을 깨고 독자가 주체적으로 의미를 창조하는 '저자의 죽음', 그리고 창작과 삶 자체를 즐기는 '텍스트의 즐거움'을 역설했습니다. ` +
    `현재 당신이 마주한 상황에서 가장 강력한 영감의 열쇠는 '${activeBarthesTheme.themeTitleKo}'입니다. ` +
    `${activeBarthesTheme.practicalCounsel} 바르트의 명언 "${focalBarthesAphorism.aphorismKo}" (${focalBarthesAphorism.aphorismFrench})을 마음에 품고, ` +
    `${focalBarthesAphorism.actionGuidance}`;

  const dailyPracticeRitual =
    '오늘 익숙한 일상 풍경이나 글귀 속에서 내 마음을 콕 찌르는 작은 디테일(푼크툼) 하나를 붙잡아 한 줄로 기록해 보세요.';
  const reflectiveQuestion = query?.trim()
    ? `‘${query.trim().slice(0, 48)}’에 대해 남들이 정해 둔 당연한 신화 대신, 나만의 독창적인 해석을 붙인다면 어떤 이야기가 될까요?`
    : '지금 내 하루에서 의무라는 딱딱한 껍질을 벗기고 유쾌한 즐거움(Plaisir)으로 바꿀 수 있는 장면은 무엇인가요?';
  const interpretiveBoundary =
    '롤랑 바르트의 기호학·푼크툼 관점은 미래를 단정하거나 수치로 재단하는 도구가 아니라, 상투적 통념을 넘어 자기만의 감응과 의미를 읽는 상징적 렌즈입니다.';

  return {
    engineVersion: FRENCH_ROLAND_BARTHES_SEMIOTICS_PUNCTUM_VERSION,
    calculatedAtKst: now.toISOString(),
    punctumAffectiveIntuitionScore,
    mythologicalDemythologizationIndex,
    deathOfAuthorScriptibleReaderScore,
    plaisirDuTexteSensualDelightIndex,
    polyphonicSignifierFluidityScore,
    activeBarthesTheme,
    focalBarthesAphorism,
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
    barthesComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchRolandBarthesSemioticsPunctumPrompt(
  res: FrenchRolandBarthesSemioticsPunctumResult,
): string {
  return [
    `【롤랑 바르트 《신화론》·《밝은 방》 푼크툼(Punctum)·기호학 지표】`,
    `- 푼크툼 영혼 관통 직관 및 감응력(Punctum): ${describeBarthesStage(res.punctumAffectiveIntuitionScore)}`,
    `- 현대 신화의 기호학적 탈신화화력: ${describeBarthesStage(res.mythologicalDemythologizationIndex)}`,
    `- 저자의 죽음 및 능동적 재창조 독해력: ${describeBarthesStage(res.deathOfAuthorScriptibleReaderScore)}`,
    `- 텍스트의 즐거움 및 유희적 몰입 결: ${describeBarthesStage(res.plaisirDuTexteSensualDelightIndex)}`,
    `- 다의적 기표 유연성 및 열린 해석력: ${describeBarthesStage(res.polyphonicSignifierFluidityScore)}`,
    `- 핵심 바르트 테마: ${res.activeBarthesTheme.themeTitleKo} [${res.activeBarthesTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeBarthesTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeBarthesTheme.practicalCounsel}`,
    `- 바르트 원전 테제: "${res.focalBarthesAphorism.aphorismKo}" (${res.focalBarthesAphorism.aphorismFrench})`,
    `- 원전 출처: [${res.focalBarthesAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalBarthesAphorism.actionGuidance}`,
    `- 일상 실천 의례: ${res.dailyPracticeRitual}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 종합 바르트 권면: ${res.barthesComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
