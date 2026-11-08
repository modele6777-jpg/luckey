/**
 * 프랑스/알제리 알베르 카뮈(Albert Camus) 《시지프 신화(Le Mythe de Sisyphe)》 & 《반항하는 인간》 부조리(Absurde)의 자각 & 지치지 않는 반항(Révolte)과 실존적 열정 엔진
 *
 * 프랑스 문학의 불멸의 거장이자 1957년 노벨 문학상 최연소 수상 철학자 알베르 카뮈(Albert Camus, 1913~1960)의 핵심 원전 기반:
 * 1. 부조리의 명석한 자각(Lucidité de l'absurde): 명료한 의미를 갈망하는 인간의 이성과 영원히 침묵하는 세계 사이의 근원적 균열을 회피하지 않고 직시하는 지적 정직성.
 * 2. 지치지 않는 형이상학적 반항(Révolte métaphysique): 헛된 환상이나 자기기만에 도피하지 않고, 매일 자신의 바위를 밀어 올리며 부조리한 운명에 당당히 맞서는 인간적 존엄.
 * 3. 삶의 충만한 열정(Passion de vivre): 미래의 천국이나 보상에 현재를 희생시키지 않고, 지중해의 눈부신 태양처럼 지금 이 순간의 대지와 감각을 가장 뜨겁게 긍정함.
 * 4. 환상을 걷어낸 실존적 자유(Liberté absurde): 절대자의 보증이 사라진 백지 위에서 자신의 선택과 행동을 스스로 온전히 책임지며 누리는 투명한 주체성.
 * 5. 시지프의 행복과 연대(Bonheur de Sisyphe & Solidarité): "산꼭대기를 향한 투쟁 그 자체만으로도 인간의 마음을 가득 채우기에 충분하다"는 긍정과 고통받는 이들과의 따뜻한 연대.
 *
 * @version LUCKEY-ALBERT-CAMUS-ABSURD-REVOLT-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_ALBERT_CAMUS_VERSION = 'LUCKEY-ALBERT-CAMUS-ABSURD-REVOLT-v1.0.0';

export interface CamusTheme {
  themeKey: string;
  themeTitleFrench: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface CamusAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AlbertCamusAbsurdRevoltResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 카뮈 실존·반항 지표 (0~100)
  absurdLucidityAwakeningScore: number;     // 부조리 명석한 자각도 (Lucidité de l'absurde)
  unceasingRevoltDignityScore: number;      // 굴하지 않는 반항과 실존 존엄도 (Révolte métaphysique)
  passionateVitalityIndex: number;          // 순간을 사랑하는 삶의 열정 지수 (Passion de vivre)
  lucidFreedomAutonomyScore: number;        // 환상을 걷어낸 실존적 자유도 (Liberté absurde)
  sisyphusHappinessResilienceScore: number; // 바위를 밀어 올리는 시지프의 행복 회복탄력성 (Bonheur de Sisyphe)
  // 세부 분석
  activeCamusTheme: CamusTheme;
  focalCamusAphorism: CamusAphorism;
  camusComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const CAMUS_THEMES: CamusTheme[] = [
  {
    themeKey: 'absurd_lucidity',
    themeTitleFrench: "La Lucidité de l'absurde (부조리의 자각)",
    themeTitleKo: '헛된 환상을 걷어내고 현실의 침묵과 부조리를 투명하게 직시함',
    existentialInsight: '세상은 우리에게 어떤 보장도 해 주지 않습니다. 하지만 이 차가운 사실을 똑바로 바라볼 때 비로소 거짓된 환각에서 벗어나 참된 주체로 설 수 있습니다.',
    practicalCounsel: '불합리한 일이나 뜻밖의 불운을 마주했을 때 억지로 섭리나 운명의 뜻을 갖다 붙이지 마십시오. 그 부조리를 냉철히 응시하며 당신의 존엄을 지키십시오.',
  },
  {
    themeKey: 'unceasing_revolt',
    themeTitleFrench: 'La Révolte permanente (영구한 반항)',
    themeTitleKo: '굴복하지도, 도피하지도 않고 매 순간 온몸으로 운명에 맞섬',
    existentialInsight: '반항이란 현실을 파괴하는 것이 아니라, 무의미한 세계 속에서 스스로 의미와 가치를 창조하며 인간의 고결함을 증명하는 가장 치열한 삶의 태도입니다.',
    practicalCounsel: '지치고 버거운 상황이라도 자포자기하지 마십시오. 매일 당신의 바위를 다시 밀어 올리는 끈질긴 반항이야말로 삶을 가장 빛나게 만드는 승리입니다.',
  },
  {
    themeKey: 'passion_of_living',
    themeTitleFrench: 'La Passion de vivre (삶의 열정)',
    themeTitleKo: '미래의 약속 대신 지금 눈앞의 살아있는 순간을 뜨겁게 긍정함',
    existentialInsight: '우리가 소유할 수 있는 유일한 영원은 지금 이 순간입니다. 햇살과 바람, 사람의 숨결 속에서 대지의 풍요로움을 온몸으로 만끽하는 것이 진정한 구원입니다.',
    practicalCounsel: '불확실한 내일의 성과를 위해 오늘의 생명력을 소모하지 마십시오. 지금 곁에 있는 사람, 오늘의 한 잔의 차, 대지의 온기를 뜨겁게 사랑하십시오.',
  },
  {
    themeKey: 'absurd_freedom',
    themeTitleFrench: 'La Liberté absurde (실존적 자유)',
    themeTitleKo: '모든 외부의 구속을 털어내고 자신의 행동을 오롯이 책임지는 자유',
    existentialInsight: '영원한 심판이나 교조적 규율이 사라진 자리에서, 우리는 매 순간 백지 위에 자신의 삶을 써 내려가는 온전하고도 무거운 자유를 얻게 됩니다.',
    practicalCounsel: '누군가 정해준 정답에 당신을 맞추지 마십시오. 당신의 선택이 낳을 결과를 기꺼이 감당하겠다는 결의를 품고 당신만의 길을 당당히 걸어가십시오.',
  },
  {
    themeKey: 'sisyphus_happiness',
    themeTitleFrench: 'Le Bonheur de Sisyphe (시지프의 행복과 연대)',
    themeTitleKo: '끝없는 고투 속에서도 자기 운명의 주인이 되는 참된 행복',
    existentialInsight: '시지프가 산꼭대기로 바위를 올리는 그 피땀 흘리는 과정이야말로 이미 운명을 정복한 것입니다. 우리는 고통 속에서도 서로를 안아주는 연대를 이룹니다.',
    practicalCounsel: '반복되는 일상의 수고로움을 무가치하다고 여기지 마십시오. 그 수고를 짊어진 당신의 어깨야말로 세상에서 가장 당당하고 아름다운 모습입니다.',
  },
];

export const CAMUS_APHORISMS: CamusAphorism[] = [
  {
    aphorismKey: 'sisyphe_heureux',
    aphorismKo: '산꼭대기를 향한 투쟁 그 자체만으로도 인간의 마음을 가득 채우기에 충분하다. 우리는 시지프가 행복하다고 상상해야 한다.',
    aphorismFrench: "La lutte elle-même vers les sommets suffit à remplir un cœur d'homme. Il faut imaginer Sisyphe heureux. (Le Mythe de Sisyphe)",
    sourceContext: '《시지프 신화(Le Mythe de Sisyphe)》',
    actionGuidance: '결과가 다시 원점으로 돌아갈지라도, 굴러떨어진 바위를 향해 걸어 내려가는 당신의 눈동자 속에 이미 운명을 넘어선 승리가 깃들어 있습니다.',
  },
  {
    aphorismKey: 'invincible_summer',
    aphorismKo: '겨울의 한복판에서, 나는 마침내 내 안에 결코 굴복하지 않는 불패의 여름이 자리 잡고 있음을 깨달았다.',
    aphorismFrench: "Au milieu de l'hiver, j'apprenais enfin qu'il y avait en moi un été invincible. (Retour à Tipasa)",
    sourceContext: '《티파사로의 귀환(Retour à Tipasa)》',
    actionGuidance: '혹독한 시련이나 외로움 속에서도 기죽지 마십시오. 당신 영혼의 심장부에는 그 어떤 한파도 얼릴 수 없는 눈부신 불꽃이 타오르고 있습니다.',
  },
  {
    aphorismKey: 'revolte_sommes',
    aphorismKo: '나는 반항한다, 그러므로 우리는 존재한다.',
    aphorismFrench: "Je me révolte, donc nous sommes. (L'Homme révolté)",
    sourceContext: '《반항하는 인간(L’Homme révolté)》',
    actionGuidance: '부당함과 무의미에 침묵하지 마십시오. 당신의 용기 있는 목소리와 저항은 고통받는 모든 이들과 이어지는 가장 거룩한 연대의 시작입니다.',
  },
  {
    aphorismKey: 'absurde_confrontation',
    aphorismKo: '부조리는 인간의 명료한 갈망과 세계의 비합리적인 침묵이 정면으로 부딪칠 때 태어난다.',
    aphorismFrench: "L'absurde naît de cette confrontation entre l'appel humain et le silence déraisonnable du monde. (Le Mythe de Sisyphe)",
    sourceContext: '《시지프 신화(Le Mythe de Sisyphe)》',
    actionGuidance: '세상이 왜 내 뜻대로 되지 않는지 원망하지 마십시오. 그 침묵 속에서 나만의 온전한 주체성을 세우는 위대한 기회를 발견하십시오.',
  },
  {
    aphorismKey: 'chance_better',
    aphorismKo: '자유란 더 나아질 기회에 다름 아니다.',
    aphorismFrench: "La liberté n'est rien d'autre qu'une chance d'être meilleur. (Actuelles)",
    sourceContext: '《시사평론(Actuelles)》',
    actionGuidance: '자유를 방종이나 불안으로 낭비하지 마십시오. 더 정직하고 더 따뜻하며 더 용기 있는 사람이 되기 위해 오늘 당신의 자유를 바치십시오.',
  },
];

export function calculateAlbertCamusAbsurdRevolt(
  profile: UserProfile
): AlbertCamusAbsurdRevoltResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `ALBERT-CAMUS-ABSURD-REVOLT:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const absurdLucidityAwakeningScore = 75 + (absHash % 24);
  const unceasingRevoltDignityScore = 73 + ((absHash >> 3) % 26);
  const passionateVitalityIndex = 72 + ((absHash >> 6) % 27);
  const lucidFreedomAutonomyScore = 74 + ((absHash >> 9) % 25);
  const sisyphusHappinessResilienceScore = 71 + ((absHash >> 12) % 28);

  const themeIndex = (absHash >> 4) % CAMUS_THEMES.length;
  const aphorismIndex = (absHash >> 7) % CAMUS_APHORISMS.length;

  const activeCamusTheme = CAMUS_THEMES[themeIndex];
  const focalCamusAphorism = CAMUS_APHORISMS[aphorismIndex];

  const guidanceTitle = `알베르 카뮈 부조리와 반항 지혜: ${activeCamusTheme.themeTitleKo}`;
  const philosophicalCounsel = `알베르 카뮈의 철학은 무의미한 세계 앞에서 절망하거나 비겁한 도피에 빠지지 않고, 당당한 반항과 뜨거운 열정으로 삶을 긍정하도록 촉구합니다. ` +
    `현재 당신이 마주한 실존적 과제는 '${activeCamusTheme.themeTitleKo}'입니다. ` +
    `${activeCamusTheme.practicalCounsel} 아울러 《시지프 신화》의 불멸의 선언 "${focalCamusAphorism.aphorismKo}"(${focalCamusAphorism.aphorismFrench})을 가슴에 품고, ` +
    `${focalCamusAphorism.actionGuidance}`;

  return {
    engineVersion: FRENCH_ALBERT_CAMUS_VERSION,
    calculatedAtKst: new Date().toISOString(),
    absurdLucidityAwakeningScore,
    unceasingRevoltDignityScore,
    passionateVitalityIndex,
    lucidFreedomAutonomyScore,
    sisyphusHappinessResilienceScore,
    activeCamusTheme,
    focalCamusAphorism,
    camusComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAlbertCamusAbsurdRevoltPrompt(res: AlbertCamusAbsurdRevoltResult): string {
  return [
    `【알베르 카뮈 《시지프 신화》 부조리의 자각 & 실존적 반항 지표】`,
    `- 부조리 명석한 자각도(Lucidité): ${res.absurdLucidityAwakeningScore}/100`,
    `- 굴하지 않는 반항과 존엄도(Révolte): ${res.unceasingRevoltDignityScore}/100`,
    `- 순간을 사랑하는 삶의 열정(Passion): ${res.passionateVitalityIndex}/100`,
    `- 환상을 걷어낸 실존적 자유도(Liberté): ${res.lucidFreedomAutonomyScore}/100`,
    `- 시지프의 행복 회복탄력성(Bonheur): ${res.sisyphusHappinessResilienceScore}/100`,
    `- 핵심 실존 테마: ${res.activeCamusTheme.themeTitleKo} [${res.activeCamusTheme.themeTitleFrench}]`,
    `- 철학적 통찰: ${res.activeCamusTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeCamusTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalCamusAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalCamusAphorism.aphorismFrench}" [${res.focalCamusAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalCamusAphorism.actionGuidance}`,
    `- 종합 실존철학 권면: ${res.camusComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
