/**
 * 독일 프리드리히 니체(Friedrich Nietzsche) 《차라투스트라는 이렇게 말했다》 초인(Übermensch) & 아모르 파티(Amor Fati) 디오니소스적 운명 긍정 엔진
 *
 * 19세기 독일의 실존철학자 프리드리히 니체(1844~1900)의 대표 주저 《차라투스트라는 이렇게 말했다(Also sprach Zarathustra)》, 《즐거운 학문(Die fröhliche Wissenschaft)》, 《우상의 황혼(Götzen-Dämmerung)》 원전 기반:
 * 1. 아모르 파티(Amor Fati, 운명애): "내 모든 필연성을 사랑하라. 지나간 것이든 앞으로 올 것이든 다른 어떤 것도 원하지 않는 것." 삶의 고난과 역경조차도 영혼의 성장을 위한 소중한 불꽃으로 끌어안는 절대적 긍정.
 * 2. 세 가지 변화(Drei Verwandlungen des Geistes):
 *    - 낙타(Kamel): 무거운 인내와 전통적 의무('너는 해야 한다')를 묵묵히 짊어지는 단계.
 *    - 사자(Löwe): 낡은 우상과 억압을 향해 '나는 원한다'고 외치며 자유를 쟁취하는 파괴적 결단의 단계.
 *    - 아이(Kind): 지나간 일에 매이지 않고 순진무구하게 새로운 가치의 수레바퀴를 스스로 굴리는 신성한 긍정과 창조의 단계.
 * 3. 초인(Übermensch): 기존 도덕의 타성에 안주하는 나약한 '말인(Letzter Mensch)'을 극복하고, 끊임없이 자신을 넘어서며 삶의 새로운 의미를 창조하는 위대한 인간상.
 * 4. 영원회귀(Ewige Wiederkunft): "이 삶이 영원히 수없이 되풀이된다 할지라도 기꺼이 다시 살겠는가?" 지금 이 순간을 영원의 무게로 충만하게 살아내는 궁극의 실존적 척도.
 * 5. 디오니소스적 긍정(Dionysisches Ja-Sagen): 비극과 혼돈 속에서도 솟구치는 생명력을 찬미하며, 상처를 딛고 더 강건해지는 영혼의 회복탄력성.
 *
 * @version LUCKEY-NIETZSCHE-ZARATHUSTRA-AMOR-FATI-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const NIETZSCHE_ZARATHUSTRA_AMOR_FATI_VERSION = 'LUCKEY-NIETZSCHE-ZARATHUSTRA-AMOR-FATI-v1.0.0';

export interface NietzscheTheme {
  themeKey: string;
  themeTitleGerman: string;
  themeTitleKo: string;
  philosophicalInsight: string;
  affirmationCounsel: string;
}

export interface NietzscheAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGerman: string;
  creativeDimension: string;
  actionDirective: string;
}

export interface NietzscheZarathustraAmorFatiResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 초인 지표 (0~100)
  amorFatiRadicalAffirmationScore: number;  // 아모르 파티(Amor Fati) 운명에 대한 절대적 긍정도
  threeMetamorphosesCreativeScore: number;  // 3단계 변신(낙타·사자·아이) 창조적 자유 지수
  uebermenschSelfOvercomingScore: number;   // 초인(Übermensch) 자기 극복 및 창조력
  eternalRecurrenceResolveScore: number;    // 영원회귀(Ewige Wiederkunft) 순간 결단력
  dionysianVitalityDriveScore: number;      // 디오니소스적 생명력과 내적 활력도
  // 세부 체계
  activeNietzscheTheme: NietzscheTheme;
  focalNietzscheAphorism: NietzscheAphorism;
  nietzschePersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type NietzscheZarathustraAmorFatiReport = NietzscheZarathustraAmorFatiResult;

const NIETZSCHE_THEMES: NietzscheTheme[] = [
  {
    themeKey: 'AmorFati',
    themeTitleGerman: 'Amor Fati - Liebe zum Schicksal',
    themeTitleKo: '아모르 파티 (운명을 사랑하라: 필연에 대한 찬미)',
    philosophicalInsight: '자신의 운명을 원망하거나 바꾸려 애태우지 않고, 겪어온 모든 슬픔과 시련까지도 온전히 긍정할 때 인간은 위대해집니다. 지나간 상처는 당신을 단련한 위대한 자양분입니다.',
    affirmationCounsel: '과거의 아쉬움이나 억울함을 이제 축복으로 바꾸십시오. "그것이 삶이었던가? 좋다! 그렇다면 다시 한번!"이라는 기백으로 현재를 환호하십시오.',
  },
  {
    themeKey: 'ThreeMetamorphoses',
    themeTitleGerman: 'Von den drei Verwandlungen: Kamel, Löwe, Kind',
    themeTitleKo: '세 가지 변화 (낙타의 인내, 사자의 자유, 아이의 창조)',
    philosophicalInsight: '정신은 먼저 의무를 견디는 낙타가 되고, 억압에 저항하는 사자가 되며, 마침내 순진무구하게 새로운 놀이를 시작하는 어린아이가 됩니다. 창조는 어린아이 같은 자발성에서 옵니다.',
    affirmationCounsel: '의무감과 분노의 단계를 지나 이제 순수한 창조의 어린아이가 되십시오. 가벼운 마음으로 새로운 시작의 팽이를 힘차게 돌리십시오.',
  },
  {
    themeKey: 'SelfOvercoming',
    themeTitleGerman: 'Der Mensch ist etwas, das überwunden werden soll',
    themeTitleKo: '자기 극복과 초인 (어제의 나를 딛고 일어서기)',
    philosophicalInsight: '인간은 짐승과 초인 사이에 놓인 밧줄입니다. 현실에 안주하지 않고 부단히 자신의 한계와 타성을 부수고 나아가는 자만이 진정한 자기 삶의 창조자가 됩니다.',
    affirmationCounsel: '어제까지의 편안한 습관이나 타인의 박수에 만족하지 마십시오. 당신 안에 잠든 더 높은 가능성을 깨우고 스스로를 극복해 나가십시오.',
  },
  {
    themeKey: 'EternalRecurrence',
    themeTitleGerman: 'Die Ewige Wiederkunft des Gleichen',
    themeTitleKo: '영원회귀 (영원의 무게로 순간을 살아가기)',
    philosophicalInsight: '지금 당신이 내리는 결정과 삶의 태도가 무한히 반복된다 해도 기쁘게 감당할 수 있는가? 이 거대한 물음이야말로 미온적이고 후회스러운 삶을 단칼에 잘라내는 칼날입니다.',
    affirmationCounsel: '대충 시간만 보내는 선택을 멈추십시오. 영원히 되풀이되어도 후회 없을 만큼 진솔하고 강렬하게 지금 이 순간의 일에 몰입하십시오.',
  },
  {
    themeKey: 'DionysianAffirmation',
    themeTitleGerman: 'Dionysisches Ja-Sagen zur Welt',
    themeTitleKo: '디오니소스적 생명력 (혼돈 속에서 춤추는 별을 낳기)',
    philosophicalInsight: '혼돈을 품고 있어야만 춤추는 별을 낳을 수 있습니다. 삶의 고통과 비극은 회피할 대상이 아니라, 영혼을 더욱 깊고 풍요롭게 만드는 역동적 에너지의 원천입니다.',
    affirmationCounsel: '역경 앞에서 기죽지 마십시오. 당신을 쓰러뜨리지 못하는 고난은 당신을 더욱 강하게 만듭니다. 온 힘을 다해 생명의 불꽃을 태우십시오.',
  },
];

const NIETZSCHE_APHORISMS: NietzscheAphorism[] = [
  {
    aphorismKey: 'WhatDoesNotKillMe',
    aphorismKo: '나를 죽이지 못하는 고통은 나를 더욱 강하게 만든다',
    aphorismGerman: 'Was mich nicht umbringt, macht mich stärker',
    creativeDimension: '역경의 승화와 불굴의 회복탄력성',
    actionDirective: '현재 마주한 시련을 영혼의 근육을 키우는 훈련으로 받아들이고 당당히 맞서십시오.',
  },
  {
    aphorismKey: 'DancingStarChaos',
    aphorismKo: '춤추는 별 하나를 낳으려면 내면에 혼돈을 품고 있어야 한다',
    aphorismGerman: 'Man muss noch Chaos in sich haben, um einen tanzenden Stern gebären zu können',
    creativeDimension: '창조적 혼돈과 내적 잠재력',
    actionDirective: '불안정함이나 정리되지 않은 생각들을 두려워 말고, 그 속에서 독창적인 아이디어를 빚어내십시오.',
  },
  {
    aphorismKey: 'KnowWhyEndureHow',
    aphorismKo: '살아야 할 이유가 있는 사람은 어떠한 삶의 방식도 견뎌낼 수 있다',
    aphorismGerman: 'Hat man sein Warum des Lebens, so verträgt man sich fast mit jedem Wie',
    creativeDimension: '삶의 궁극적 목적의식과 끈기',
    actionDirective: '방법론에 얽매이기 전에, 당신이 진정으로 이루고자 하는 근본적인 사명에 집중하십시오.',
  },
  {
    aphorismKey: 'BecomeWhoYouAre',
    aphorismKo: '너 자신이 되어라! 너 자신의 최고의 창조자가 되어라',
    aphorismGerman: 'Werde, der du bist!',
    creativeDimension: '고유한 개성의 완성',
    actionDirective: '남을 흉내 내려 하지 말고, 당신만의 고유한 색채와 열정을 세상에 아낌없이 발현하십시오.',
  },
];

export function calculateNietzscheZarathustraAmorFati(profile: UserProfile): NietzscheZarathustraAmorFatiResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'NietzscheZarathustraAmorFati';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const amorFatiRadicalAffirmationScore = 70 + (absHash % 29);
  const threeMetamorphosesCreativeScore = 69 + ((absHash >> 3) % 30);
  const uebermenschSelfOvercomingScore = 68 + ((absHash >> 6) % 31);
  const eternalRecurrenceResolveScore = 67 + ((absHash >> 9) % 32);
  const dionysianVitalityDriveScore = 71 + ((absHash >> 12) % 28);

  const themeIndex = (absHash >> 4) % NIETZSCHE_THEMES.length;
  const aphorismIndex = (absHash >> 7) % NIETZSCHE_APHORISMS.length;

  const activeNietzscheTheme = NIETZSCHE_THEMES[themeIndex];
  const focalNietzscheAphorism = NIETZSCHE_APHORISMS[aphorismIndex];

  const counselTitle = `니체 초인(Übermensch) 철학: ${activeNietzscheTheme.themeTitleKo}`;
  const philosophicalGuidance = `프리드리히 니체의 철학은 나약한 체념을 부수고 자신의 운명을 환호하며 사랑하는 아모르 파티(Amor Fati)의 불꽃을 피우도록 격려합니다. ` +
    `현재 당신에게 필요한 지혜는 '${activeNietzscheTheme.themeTitleKo}'의 가르침과 직결되어 있습니다. ` +
    `${activeNietzscheTheme.affirmationCounsel} 또한 차라투스트라의 아포리즘인 '${focalNietzscheAphorism.aphorismKo}'(${focalNietzscheAphorism.creativeDimension})을 가슴에 품고, ` +
    `${focalNietzscheAphorism.actionDirective}`;

  return {
    engineVersion: NIETZSCHE_ZARATHUSTRA_AMOR_FATI_VERSION,
    calculatedAtKst: new Date().toISOString(),
    amorFatiRadicalAffirmationScore,
    threeMetamorphosesCreativeScore,
    uebermenschSelfOvercomingScore,
    eternalRecurrenceResolveScore,
    dionysianVitalityDriveScore,
    activeNietzscheTheme,
    focalNietzscheAphorism,
    nietzschePersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatNietzscheZarathustraAmorFatiPrompt(res: NietzscheZarathustraAmorFatiResult): string {
  return [
    `【프리드리히 니체 차라투스트라 초인 & 아모르 파티(Amor Fati) 지표】`,
    `- 아모르 파티(Amor Fati) 운명 절대 긍정도: ${res.amorFatiRadicalAffirmationScore}/100`,
    `- 3단계 변신(낙타·사자·아이) 창조적 자유도: ${res.threeMetamorphosesCreativeScore}/100`,
    `- 초인(Übermensch) 자기 극복 및 창조력: ${res.uebermenschSelfOvercomingScore}/100`,
    `- 영원회귀(Ewige Wiederkunft) 순간 결단력: ${res.eternalRecurrenceResolveScore}/100`,
    `- 디오니소스적 생명력 및 활력 지수: ${res.dionysianVitalityDriveScore}/100`,
    `- 핵심 초인 테마: ${res.activeNietzscheTheme.themeTitleKo} [${res.activeNietzscheTheme.themeTitleGerman}]`,
    `- 철학적 통찰: ${res.activeNietzscheTheme.philosophicalInsight}`,
    `- 긍정적 조언: ${res.activeNietzscheTheme.affirmationCounsel}`,
    `- 핵심 아포리즘: "${res.focalNietzscheAphorism.aphorismKo}"`,
    `- 독일어 원문: "${res.focalNietzscheAphorism.aphorismGerman}" [${res.focalNietzscheAphorism.creativeDimension}]`,
    `- 실천적 행동 지침: ${res.focalNietzscheAphorism.actionDirective}`,
    `- 통합 실존 처방: ${res.nietzschePersonalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
