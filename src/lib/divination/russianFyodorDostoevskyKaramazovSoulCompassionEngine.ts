/**
 * 러시아 표도르 도스토옙스키(Fyodor Dostoevsky) 《카라마조프 가의 형제들》 & 《죄와 벌》 심연 직시와 영혼의 대자비·고통의 정화와 생명 긍정 지혜 엔진
 *
 * 19세기 러시아 문학 및 실존주의 심리학의 최고봉 표도르 도스토옙스키(1821~1881)의 원전 기반:
 * 1. 영혼의 모순과 심연을 회피 없이 응시하는 실존적 정직성 지수 (Soul Abyss Honest Confrontation Score): 인간 내면의 빛과 어둠, 모순과 불안을 미화하지 않고 정직하게 마주하는 담대한 성찰력.
 * 2. 추상적 관념을 넘어 구체적 행동으로 실천하는 적극적 사랑 지표 (Active Love & Concrete Compassion Index): 말만의 고상한 이상주의를 넘어 지금 내 앞의 이웃을 온 마음으로 섬기는 실천적 사랑의 힘.
 * 3. 고통과 시련을 영혼의 성숙으로 승화시키는 정화 승화도 (Suffering Purification & Transcendent Resilience Score): 시련 앞에서 세상을 원망하거나 타락하지 않고, 아픔을 지극한 겸손과 깊은 연민의 밑거름으로 승화시키는 회복탄력성.
 * 4. 대지에 입 맞추며 존재하는 모든 생명을 경이롭게 긍정하는 생명 환희도 (Kissing the Earth & Vital Life Affirmation Index): 절망과 방황의 어둠을 뚫고 살아 숨 쉬는 대지와 우주적 생명의 거룩함을 눈물로 긍정하는 환희.
 * 5. 만인이 만인에게 책임이 있다는 보편적 연대감과 대자비 지수 (Universal Responsibility & Compassionate Fellowship Score): 고립된 이기심을 깨뜨리고 서로의 상처와 아픔을 함께 짊어지는 보편적 형제애와 자비심.
 *
 * @version LUCKEY-FYODOR-DOSTOEVSKY-KARAMAZOV-SOUL-COMPASSION-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const RUSSIAN_FYODOR_DOSTOEVSKY_KARAMAZOV_SOUL_COMPASSION_VERSION = 'LUCKEY-FYODOR-DOSTOEVSKY-KARAMAZOV-SOUL-COMPASSION-v2.3.0';

export interface DostoevskyTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface DostoevskyAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismRussian: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface RussianFyodorDostoevskyKaramazovSoulCompassionResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 도스토옙스키 핵심 지표 (0~100)
  soulAbyssHonestConfrontationScore: number;       // 영혼의 심연 직시 실존적 정직성 (Soul Abyss Honest Confrontation)
  activeLoveCompassionIndex: number;               // 적극적 사랑 실천 지표 (Active Love & Concrete Compassion)
  sufferingPurificationTranscendenceScore: number;  // 고통의 정화 및 초월 승화도 (Suffering Purification & Transcendence)
  kissingTheEarthLivingVitalityIndex: number;      // 대지 입맞춤 및 생명 긍정 환희도 (Kissing the Earth & Vital Life Affirmation)
  universalBrotherhoodSolidarityScore: number;     // 보편적 연대감 및 대자비 지수 (Universal Responsibility & Compassion)
  // 세부 분석
  activeDostoevskyTheme: DostoevskyTheme;
  focalDostoevskyAphorism: DostoevskyAphorism;
  dostoevskyComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  dostoevskySynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  // v2.1.0 심층 보강: 이중 원전 교차·성찰 질문·해석 경계
  secondaryDostoevskyAphorism?: DostoevskyAphorism;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveDostoevskyQuestion: string;
  reflectiveQuestion?: string;
  interpretiveBoundary: string;
}

function formatDostoevskyKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeDostoevskyStage(score: number): string {
  if (score >= 93) return '알료샤의 대지 입맞춤(Kissing the Earth) — 심연의 고통을 통과해 살아 숨 쉬는 생명과 적극적 사랑으로 부활하는 환희기';
  if (score >= 88) return '조시마 장로의 적극적 사랑(Active Love) — 내 앞의 한 사람을 구체적으로 품고 책임을 나누는 실천기';
  return '백야의 성찰(White Night Vigil) — 가슴속 모순과 빛을 정직히 응시하며 양심의 편에 서는 정화기';
}

export const DOSTOEVSKY_THEMES: DostoevskyTheme[] = [
  {
    themeKey: 'activeLovePractice',
    themeTitleEn: 'Active Love: Practicing Concrete Devotion Over Abstract Sentimentality',
    themeTitleKo: '조시마 장로의 적극적 사랑 — 공허한 말잔치를 넘어 내 앞의 한 사람을 온 마음으로 품기',
    pragmaticInsight: '도스토옙스키가 《카라마조프 가의 형제들》에서 조시마 장로의 입을 빌려 강조한 것은 ‘적극적 사랑(Деятельная любовь)’입니다. 추상적으로 인류 전체를 사랑하는 것은 쉽지만, 당장 곁에 있는 불완전한 사람을 참아내고 돕는 것은 영혼의 뼈를 깎는 인내를 요구합니다.',
    practicalCounsel: '거창한 명분이나 먼 미래의 이상에 도취하지 마십시오. 오늘 당신 곁에서 마주하는 한 사람의 작은 슬픔에 귀 기울이고 구체적인 따뜻한 행동을 건네십시오. 그 작은 실천이 기적의 씨앗입니다.',
  },
  {
    themeKey: 'kissingTheLivingEarth',
    themeTitleEn: 'Kissing the Earth: Weeping Tears of Sacred Joy and Universal Reconciliation',
    themeTitleKo: '알료샤의 대지 입맞춤 — 방황의 밤을 지나 살아 숨 쉬는 대지와 삶의 신비를 눈물로 긍정하기',
    pragmaticInsight: '영적 스승을 잃고 시험에 빠졌던 알료샤는 밤하늘의 무수한 별빛 아래 대지에 엎드려 눈물로 흙에 입을 맞추며 부활합니다. 살아있는 모든 생명과 우주적 신비에 대한 경외심이 영혼의 모든 회의를 단번에 녹여냅니다.',
    practicalCounsel: '지적인 번민과 계산의 쳇바퀴에서 잠시 내려오십시오. 발을 딛고 서 있는 땅의 단단함과 가슴으로 들이마시는 숨결의 기적을 온전히 느끼십시오. 살아있음 그 자체를 긍정할 때 무한한 생명력이 솟아납니다.',
  },
  {
    themeKey: 'purificationThroughTrial',
    themeTitleEn: 'Purification Through Suffering: Transmuting Hardship into Deep Humility and Grace',
    themeTitleKo: '고통을 통한 영혼의 정화 — 시련을 원망하지 않고 내면의 깊이와 겸손을 빚어내는 용기',
    pragmaticInsight: '도스토옙스키 문학의 인물들은 쓰라린 고통을 통과하며 오만과 자기기만의 허물을 벗습니다. 시련은 파멸의 저주가 아니라, 거칠고 교만했던 영혼을 맑고 단단한 보석으로 벼려내는 정화의 도가니입니다.',
    practicalCounsel: '현재 겪는 어려움 앞에서 스스로를 비하하거나 타인을 원망하지 마십시오. 이 고통이 당신의 시야를 넓히고 타인의 아픔을 헤아리는 깊은 지혜를 선물하고 있음을 믿으십시오.',
  },
  {
    themeKey: 'transcendingDualities',
    themeTitleEn: 'Confronting Inner Duality: Choosing the Eternal Light Amidst Inner Strife',
    themeTitleKo: '내면의 심연과 모순 극복 — 가슴속 선악의 격전지에서 빛과 존엄을 단호히 선택하기',
    pragmaticInsight: '“악마와 신이 싸우고 있고, 그 격전지는 바로 인간의 마음이다.” 인간은 천사의 순수함과 짐승의 광기를 동시에 품은 모순적 존재입니다. 중요한 것은 내면의 분열을 외면하지 않고 그 속에서 고결한 빛을 선택하는 결단입니다.',
    practicalCounsel: '마음속에 일어나는 분노나 두려움, 나약함을 부끄러워하거나 숨기지 마십시오. 당신의 결점까지 정직하게 응시하되, 마지막 순간에는 언제나 양심과 자비의 손을 들어주십시오.',
  },
];

export const DOSTOEVSKY_APHORISMS: DostoevskyAphorism[] = [
  {
    aphorismKey: 'loveAllCreation',
    aphorismKo: '창조된 모든 것, 온 우주와 모래 한 알까지 사랑하라. 나뭇잎 하나, 한 줄기 햇살까지 사랑하라.',
    aphorismRussian: 'Любите все создание божие, и целое, и каждую песчинку. Каждый листик, каждый луч божий любите.',
    sourceContext: '표도르 도스토옙스키 《카라마조프 가의 형제들(Братья Карамазовы)》',
    actionGuidance: '존재하는 모든 것의 소중함을 경외의 눈길로 바라보십시오. 일상의 소박한 사물과 풍경 속에 깃든 신비를 온전히 아끼십시오.',
  },
  {
    aphorismKey: 'activeLoveHarsh',
    aphorismKo: '실천하는 적극적 사랑은 꿈속에서 하는 달콤한 사랑에 비하면 가혹하고 두려운 노동이다.',
    aphorismRussian: 'Любовь деятельная — сравнительно с любовью мечтательною — есть дело жестокое и устрашающее.',
    sourceContext: '표도르 도스토옙스키 《카라마조프 가의 형제들(Братья Карамазовы)》',
    actionGuidance: '말과 생각만으로 사랑하기는 쉽습니다. 현실의 번거로움과 불편을 감수하며 실제 손발을 움직여 온기를 전하십시오.',
  },
  {
    aphorismKey: 'darkerTheNightStars',
    aphorismKo: '밤이 어두울수록 하늘의 별은 더욱 빛나고, 슬픔이 깊을수록 진실과 구원은 더욱 가까이 있다.',
    aphorismRussian: 'Чем темнее ночь, тем ярче звезды, чем глубже скорбь, тем ближе Бог!',
    sourceContext: '표도르 도스토옙스키 《죄와 벌(Преступление и наказание)》',
    actionGuidance: '칠흑 같은 곤경에 처해 있다 해서 낙담하지 마십시오. 가장 짙은 어둠 속에서 영혼의 가장 찬란한 빛이 깨어납니다.',
  },
  {
    aphorismKey: 'beautySavesWorld',
    aphorismKo: '참된 아름다움과 영혼의 맑은 순수함이 마침내 세상을 구원할 것이다.',
    aphorismRussian: 'Красота спасет мир.',
    sourceContext: '표도르 도스토옙스키 《백치(Идиот)》',
    actionGuidance: '탁한 세속의 계산과 다툼에 영혼을 물들이지 마십시오. 마음의 순결함과 아름다운 품격을 지켜내는 것이 가장 강력한 승리입니다.',
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

export function calculateRussianFyodorDostoevskyKaramazovSoulCompassion(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): RussianFyodorDostoevskyKaramazovSoulCompassionResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `FYODOR-DOSTOEVSKY-KARAMAZOV-SOUL-COMPASSION:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const soulAbyssHonestConfrontationScore = 89 + ((absHash >> 1) % 10);
  const activeLoveCompassionIndex = 88 + ((absHash >> 4) % 11);
  const sufferingPurificationTranscendenceScore = 87 + ((absHash >> 7) % 12);
  const kissingTheEarthLivingVitalityIndex = 89 + ((absHash >> 10) % 10);
  const universalBrotherhoodSolidarityScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % DOSTOEVSKY_THEMES.length;
  const aphorismIndex = (absHash >> 8) % DOSTOEVSKY_APHORISMS.length;

  const activeDostoevskyTheme = DOSTOEVSKY_THEMES[themeIndex];
  const focalDostoevskyAphorism = DOSTOEVSKY_APHORISMS[aphorismIndex];
  // 같은 저작의 명언만 반복하지 않도록 다른 원전에서 보조 테제를 하나 더 세운다(초점 테제와 항상 다름).
  const secondaryDostoevskyOffset = 1 + ((absHash >> 11) % (DOSTOEVSKY_APHORISMS.length - 1));
  const secondaryDostoevskyAphorism =
    DOSTOEVSKY_APHORISMS[(aphorismIndex + secondaryDostoevskyOffset) % DOSTOEVSKY_APHORISMS.length];

  // 질문에 반응하는 정성 성찰 질문: 지금 붙잡은 테마의 언어로 되묻는다.
  const trimmedDostoevskyQuery = (query ?? '').trim();
  const reflectiveDostoevskyQuestion =
    `지금 내가 '${activeDostoevskyTheme.themeTitleKo}'의 눈으로 본다면, ` +
    `내 안의 모순과 눈앞의 사람이 지닌 상처를 어느 쪽도 미화하지 않고 함께 안을 수 있는 한 걸음은 무엇일까요?` +
    (trimmedDostoevskyQuery ? ` (이 물음은 당신이 건넨 '${trimmedDostoevskyQuery}'에 대한 성찰입니다.)` : '');

  const interpretiveBoundary =
    '도스토옙스키 문학의 심연 직시·적극적 사랑 상징을 빌린 정성적 성찰 관점이며, 영혼 진단이나 사람의 됨됨이 평가, 사건의 성패·미래 단정이 아닙니다.';

  const guidanceTitle = `도스토옙스키 영혼의 심연과 대자비의 지혜: ${activeDostoevskyTheme.themeTitleKo}`;
  const philosophicalCounsel = `러시아 문학과 실존주의 심리학의 거장 표도르 도스토옙스키 선생은 《카라마조프 가의 형제들》과 《죄와 벌》을 통해 ` +
    `영혼의 가장 깊은 심연을 회피 없이 응시하는 실존적 정직성, 몽상적 감상을 넘어선 조시마 장로의 적극적 사랑(Active Love), ` +
    `그리고 고통을 성숙으로 벼려내는 정화와 대지에 입 맞추며 존재하는 모든 생명을 긍정하는 눈물의 지혜를 전했습니다. ` +
    `현재 당신이 마주한 상황에서 가장 심원한 치유의 열쇠는 '${activeDostoevskyTheme.themeTitleKo}'입니다. ` +
    `${activeDostoevskyTheme.practicalCounsel} 도스토옙스키의 테제 "${focalDostoevskyAphorism.aphorismKo}" (${focalDostoevskyAphorism.aphorismRussian})을 마음에 새기고, ` +
    `${focalDostoevskyAphorism.actionGuidance}`;

  const calculatedAtKst = formatDostoevskyKstTimestamp(now);
  const composite = Math.round(
    (soulAbyssHonestConfrontationScore + activeLoveCompassionIndex + sufferingPurificationTranscendenceScore + kissingTheEarthLivingVitalityIndex + universalBrotherhoodSolidarityScore) / 5
  );
  const dostoevskySynthesisMatrix = {
    dominantTension: `${activeDostoevskyTheme.themeTitleKo} ↔ ${focalDostoevskyAphorism.sourceContext}`,
    alignmentState: describeDostoevskyStage(composite),
    integratedAction: `${focalDostoevskyAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: RUSSIAN_FYODOR_DOSTOEVSKY_KARAMAZOV_SOUL_COMPASSION_VERSION,
    calculatedAtKst,
    soulAbyssHonestConfrontationScore,
    activeLoveCompassionIndex,
    sufferingPurificationTranscendenceScore,
    kissingTheEarthLivingVitalityIndex,
    universalBrotherhoodSolidarityScore,
    activeDostoevskyTheme,
    focalDostoevskyAphorism,
    dostoevskyComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    dostoevskySynthesisMatrix,
    secondaryDostoevskyAphorism,
    ritualAction: `[${activeDostoevskyTheme.themeKey}] ${focalDostoevskyAphorism.actionGuidance}`,
    reflectionFocus: `도스토옙스키(${activeDostoevskyTheme.themeTitleKo}) — ${focalDostoevskyAphorism.sourceContext}`,
    reflectiveDostoevskyQuestion,
    reflectiveQuestion: reflectiveDostoevskyQuestion,
    interpretiveBoundary,
  };
}

export function formatRussianFyodorDostoevskyKaramazovSoulCompassionPrompt(
  res: RussianFyodorDostoevskyKaramazovSoulCompassionResult,
): string {
  const composite = Math.round(
    (res.soulAbyssHonestConfrontationScore + res.activeLoveCompassionIndex + res.sufferingPurificationTranscendenceScore + res.kissingTheEarthLivingVitalityIndex + res.universalBrotherhoodSolidarityScore) / 5
  );
  const lines = [
    `【도스토옙스키 《카라마조프 가의 형제들·죄와 벌》 심연 직시·대자비(Active Love) 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진 버전: ${res.engineVersion}`,
    `- 영혼 정화 국면: ${describeDostoevskyStage(composite)}`,
    `- 핵심 도스토옙스키 테마: ${res.activeDostoevskyTheme.themeTitleKo} [${res.activeDostoevskyTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeDostoevskyTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeDostoevskyTheme.practicalCounsel}`,
    `- 도스토옙스키 원전 테제: "${res.focalDostoevskyAphorism.aphorismKo}" (${res.focalDostoevskyAphorism.aphorismRussian})`,
    `- 원전 출처: [${res.focalDostoevskyAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalDostoevskyAphorism.actionGuidance}`,
    `- 종합 도스토옙스키 권면: ${res.dostoevskyComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.dostoevskySynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.dostoevskySynthesisMatrix.dominantTension} | 조율 상태: ${res.dostoevskySynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.dostoevskySynthesisMatrix.integratedAction}`,
    );
  }
  if (res.secondaryDostoevskyAphorism) {
    lines.push(
      `- 보조 원전 테제: "${res.secondaryDostoevskyAphorism.aphorismKo}" (${res.secondaryDostoevskyAphorism.aphorismRussian})`,
      `- 보조 원전 출처: [${res.secondaryDostoevskyAphorism.sourceContext}]`,
      `- 보조 실천 지침: ${res.secondaryDostoevskyAphorism.actionGuidance}`,
    );
  }
  lines.push(
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveDostoevskyQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  );
  return lines.join('\n');
}
