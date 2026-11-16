/**
 * 신라 원효대사(元曉大師) 《십문화쟁론(十門和諍論)》 일심이문(一心二門) 화쟁(和諍) & 원융회통 무애 엔진
 *
 * LUCKEY-WONHYO-HWAJAENG-v2.0.0
 *
 * 7세기 통일신라 최고의 대승 성사이자 동아시아 불교 철학의 태두 원효대사(元曉大師, 617~686)의
 * 저술 《십문화쟁론(十門和諍論)》, 《대승기신론소(大乘起信論疏)》, 《금강삼매경론(金剛三昧經論)》에 기반한
 * 질문 맥락 화쟁 관문 매핑·KST 일심이문 시공간 리듬·원융회통 대립물 조화 결정론 엔진.
 */

import type { UserProfile } from '../sharedState';

export const WONHYO_HWAJAENG_VERSION = '2.2.0';

export interface WonhyoSituationalHwajaeng {
  themeKey: 'existence_emptiness' | 'truth_delusion' | 'assertion_refutation' | 'source_return' | 'fearless_freedom';
  themeLabelKo: string;
  classicQuote: string;
  reflectionPrompt: string;
}

export interface WonhyoTemporalOneMindRhythm {
  kstHour: number;
  timeWindowKo: string;
  seasonKo: string;
  jinYeoWeight: number; // 심진여문(고요한 본성) 비중 %
  saengMyeolWeight: number; // 심생멸문(역동적 실천) 비중 %
  rhythmGuidance: string;
}

export interface WonhyoDialecticHarmonization {
  attachmentVsLettingGo: number; // 집착-방하착 균형 (0~100)
  selfVsOtherHarmony: number; // 자타 불이(不二) 포용도 (0~100)
  urgencyVsStillness: number; // 조급-정진 완급도 (0~100)
  muAePracticeDirective: string;
}

export interface WonhyoHwajaengReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  // 원효 화쟁 5대 심성 지표 (0~100)
  oneMindTwoGatesBalance: number;
  hwajaengContradictionResolution: number;
  wonhyoMuAeFreedomScore: number;
  wonYungWheTongHarmonization: number;
  innerJinYeoPurityIndex: number;
  // 핵심 화쟁 관문
  activeHwajaengGate: {
    gateNameKo: string;
    hanja: string;
    coreDharma: string;
    meditativeResolution: string;
  };
  // v2.0.0 질적 성찰 & 시공간 교차 검증
  situationalHwajaeng: WonhyoSituationalHwajaeng;
  temporalOneMindRhythm: WonhyoTemporalOneMindRhythm;
  dialecticHarmonizationMatrix: WonhyoDialecticHarmonization;
  wonhyoMasterDharmaWord: string;
  wonhyoSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const HWAJAENG_GATES = [
  {
    gateNameKo: '유공화쟁문 (有空和諍門)',
    hanja: '有空和諍門',
    coreDharma: '실체에 대한 집착(有)과 허무한 집착(空)을 동시에 털어내는 중도 실상',
    meditativeResolution: '현실의 성과에 들뜨지 않고, 실패에도 낙담하지 않는 진여의 평온을 회복합니다.',
  },
  {
    gateNameKo: '진망화쟁문 (眞妄和諍門)',
    hanja: '眞妄和諍門',
    coreDharma: '참된 본성과 헛된 번뇌가 본래 둘이 아니라는 동체대비의 지혜',
    meditativeResolution: '마음의 불안과 잡념을 억누르려 하지 말고, 파도 아래 고요한 바다를 바라보듯 관조하십시오.',
  },
  {
    gateNameKo: '입파무애문 (立破無碍門)',
    hanja: '立破無碍門',
    coreDharma: '자신의 주장을 고집스럽게 세우지도 않고, 타인의 의견을 섣불리 부수지도 않는 원융',
    meditativeResolution: '상대방과의 대립 속에서 양자 모두를 살리는 제3의 지혜로운 절충점을 발견합니다.',
  },
  {
    gateNameKo: '심원귀일문 (心源歸一門)',
    hanja: '心源歸一門',
    coreDharma: '천 갈래 만 갈래로 흩어진 생각의 물줄기를 하나의 본원 심천으로 회통시킴',
    meditativeResolution: '복잡한 문제의 겉가지만 붙잡지 말고, 문제의 가장 밑바닥에 놓인 단순한 본질로 회귀합니다.',
  },
  {
    gateNameKo: '무애생사문 (無碍生死門)',
    hanja: '無碍生死門',
    coreDharma: '두려움과 집착의 장벽을 부수고 걸림 없이 세상 한가운데로 뛰어드는 자비행',
    meditativeResolution: '실패에 대한 공포를 내려놓고 가벼운 발걸음으로 눈앞의 과업을 기쁘게 수행하십시오.',
  },
];

function classifyQuestionHwajaeng(
  question: string,
  fallbackIdx: number,
): { gateIndex: number; situational: WonhyoSituationalHwajaeng } {
  const q = question.toLowerCase();

  if (/(돈|재물|성과|성공|실패|손실|투자|사업|승진|결과)/.test(q)) {
    return {
      gateIndex: 0,
      situational: {
        themeKey: 'existence_emptiness',
        themeLabelKo: '유무(有無)와 성패의 집착 초월',
        classicQuote: '《십문화쟁론》 — "있다고 말해도 걸림이 없고, 없다고 말해도 어긋나지 않으니, 이것이 원융한 중도이다."',
        reflectionPrompt: '지금 손에 쥐려 애쓰는 성과나 피하려는 손실 너머에서, 어떤 결과에도 흔들리지 않는 나의 중심은 무엇인가요?',
      },
    };
  }
  if (/(불안|걱정|우울|번뇌|스트레스|마음|감정|외로움|밤|잠)/.test(q)) {
    return {
      gateIndex: 1,
      situational: {
        themeKey: 'truth_delusion',
        themeLabelKo: '번뇌와 본래 마음의 동체 관조',
        classicQuote: '《대승기신론소》 — "파도가 곧 물이요 물이 곧 파도이듯, 생멸의 번뇌가 진여를 떠나 따로 있지 않다."',
        reflectionPrompt: '지금 나를 흔드는 불안한 생각은 바다 그 자체가 아니라 잠시 일렁이는 파도일 뿐이라면, 그 아래 고요한 깊이는 어떻게 느껴지나요?',
      },
    };
  }
  if (/(관계|갈등|다툼|사랑|연애|가족|직장|동료|상사|화해|협상)/.test(q)) {
    return {
      gateIndex: 2,
      situational: {
        themeKey: 'assertion_refutation',
        themeLabelKo: '옳고 그름을 넘어선 입파무애(立破無碍)',
        classicQuote: '《십문화쟁론》 — "열고 닫음이 자재하고(開合自在), 세우고 깨뜨림에 걸림이 없다(立破無碍)."',
        reflectionPrompt: '내 주장을 굽히지 않으려는 고집과 상대를 무조건 꺾으려는 마음을 한 걸음 물려보면, 두 입장이 함께 숨 쉴 공간은 어디에 있나요?',
      },
    };
  }
  if (/(선택|결정|진로|방향|이직|고민|혼란|복잡|본질)/.test(q)) {
    return {
      gateIndex: 3,
      situational: {
        themeKey: 'source_return',
        themeLabelKo: '만 갈래 분별을 하나로 모으는 심원귀일(心源歸一)',
        classicQuote: '《대승기신론별기》 — "모든 물줄기가 결국 한 바다로 돌아가듯, 백 가지 헤아림이 일심의 근원으로 귀일한다."',
        reflectionPrompt: '머릿속에 얽힌 수많은 조건과 계산을 잠시 내려놓았을 때, 내 마음이 가장 처음 품었던 순수한 뜻은 무엇이었나요?',
      },
    };
  }
  if (/(도전|시작|두려움|용기|변화|새로운|도약|시험)/.test(q)) {
    return {
      gateIndex: 4,
      situational: {
        themeKey: 'fearless_freedom',
        themeLabelKo: '걸림 없이 나아가는 일체무애행(一切無碍行)',
        classicQuote: '《화엄경소·무애가》 — "일체에 걸림이 없는 사람(一切無碍人)은 단 하나의 길로 생사를 벗어난다."',
        reflectionPrompt: '만약 실패나 체면에 대한 두려움이 단 1%도 없다면, 오늘 가장 먼저 내딛고 싶은 발걸음은 어디를 향하고 있나요?',
      },
    };
  }

  const defaults: WonhyoSituationalHwajaeng[] = [
    {
      themeKey: 'existence_emptiness',
      themeLabelKo: '유무(有無)와 성패의 집착 초월',
      classicQuote: '《십문화쟁론》 — "있다고 말해도 걸림이 없고, 없다고 말해도 어긋나지 않으니, 이것이 원융한 중도이다."',
      reflectionPrompt: '지금 내 마음속에서 "꼭 이래야만 한다"고 붙잡고 있는 조건 하나를 가볍게 놓아준다면 어떤 여유가 생길까요?',
    },
    {
      themeKey: 'truth_delusion',
      themeLabelKo: '번뇌와 본래 마음의 동체 관조',
      classicQuote: '《대승기신론소》 — "파도가 곧 물이요 물이 곧 파도이듯, 생멸의 번뇌가 진여를 떠나 따로 있지 않다."',
      reflectionPrompt: '오늘 마주친 작은 불편함이나 망설임을 적으로 보지 않고 마음의 결을 비추는 거울로 삼는다면 무엇이 보이나요?',
    },
    {
      themeKey: 'assertion_refutation',
      themeLabelKo: '옳고 그름을 넘어선 입파무애(立破無碍)',
      classicQuote: '《십문화쟁론》 — "열고 닫음이 자재하고(開合自在), 세우고 깨뜨림에 걸림이 없다(立破無碍)."',
      reflectionPrompt: '나와 다른 시선을 가진 이의 말 속에서도 한 조각의 진실이 깃들어 있다고 본다면 대화가 어떻게 달라질까요?',
    },
    {
      themeKey: 'source_return',
      themeLabelKo: '만 갈래 분별을 하나로 모으는 심원귀일(心源歸一)',
      classicQuote: '《대승기신론별기》 — "모든 물줄기가 결국 한 바다로 돌아가듯, 백 가지 헤아림이 일심의 근원으로 귀일한다."',
      reflectionPrompt: '복잡하게 뻗어 나간 생각의 가지들을 줄이고, 오늘 반드시 지켜야 할 단 하나의 핵심 본질로 돌아가 보세요.',
    },
    {
      themeKey: 'fearless_freedom',
      themeLabelKo: '걸림 없이 나아가는 일체무애행(一切無碍行)',
      classicQuote: '《화엄경소·무애가》 — "일체에 걸림이 없는 사람(一切無碍人)은 단 하나의 길로 생사를 벗어난다."',
      reflectionPrompt: '스스로 그어 둔 한계선을 지우고 걸림 없이 행동할 때, 오늘 하루가 얼마나 가벼워질까요?',
    },
  ];

  const idx = fallbackIdx % defaults.length;
  return { gateIndex: idx, situational: defaults[idx] };
}

function computeTemporalOneMindRhythm(now: Date): WonhyoTemporalOneMindRhythm {
  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const kstHour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonKo =
    month >= 3 && month <= 5
      ? '봄 · 발심과 화해의 생동'
      : month >= 6 && month <= 8
        ? '여름 · 거침없는 무애의 실행'
        : month >= 9 && month <= 11
          ? '가을 · 분별을 거두는 원융의 성찰'
          : '겨울 · 심원으로 침잠하는 진여의 고요';

  if (kstHour >= 4 && kstHour < 9) {
    return {
      kstHour,
      timeWindowKo: '새벽·이른 아침 (심진여문 개방기)',
      seasonKo,
      jinYeoWeight: 70,
      saengMyeolWeight: 30,
      rhythmGuidance: '하루의 소음이 일어나기 전 맑은 심진여문(心眞如門)을 열어, 분별없는 고요한 시선으로 오늘의 뜻을 세울 때입니다.',
    };
  }
  if (kstHour >= 9 && kstHour < 18) {
    return {
      kstHour,
      timeWindowKo: '낮·활동 시간 (심생멸문 회통기)',
      seasonKo,
      jinYeoWeight: 40,
      saengMyeolWeight: 60,
      rhythmGuidance: '세상 한가운데서 부딪히며 화쟁을 실천하는 심생멸문(心生滅門)의 시간입니다. 다름을 배척하지 말고 조율하며 나아가세요.',
    };
  }
  return {
    kstHour,
    timeWindowKo: '저녁·밤 (일심 귀일 성찰기)',
    seasonKo,
    jinYeoWeight: 65,
    saengMyeolWeight: 35,
    rhythmGuidance: '낮 동안 흩어졌던 시비와 긴장을 일심(一心)의 바다로 되돌리는 시간입니다. 잘잘못을 따지기보다 스스로를 너그러이 품으세요.',
  };
}

export function calculateWonhyoHwajaeng(
  profile: UserProfile | null | undefined,
  question: string = '',
  now: Date = new Date(),
): WonhyoHwajaengReport {
  const birthStr = profile?.basic?.birthdate || '1995-01-01';
  const nameStr = profile?.basic?.name || '내담자';
  const timeStr = profile?.basic?.birthtime || '12:00';
  const dayBucket = now.toISOString().slice(0, 10);

  const seed = djb2Hash(`${birthStr}_${nameStr}_${timeStr}_${dayBucket}_wonhyo_hwajaeng_v2`);
  const qSeed = djb2Hash(question || 'general');

  const oneMindTwoGatesBalance = 63 + (seed % 36);
  const hwajaengContradictionResolution = 65 + ((seed >> 2) % 34);
  const wonhyoMuAeFreedomScore = 60 + ((seed >> 4) % 39);
  const wonYungWheTongHarmonization = 62 + ((seed >> 6) % 37);
  const innerJinYeoPurityIndex = 58 + ((seed >> 8) % 41);

  const { gateIndex, situational } = classifyQuestionHwajaeng(question, seed % HWAJAENG_GATES.length);
  const activeHwajaengGate = HWAJAENG_GATES[gateIndex];
  const temporalOneMindRhythm = computeTemporalOneMindRhythm(now);

  const attachmentVsLettingGo = Math.min(98, Math.max(45, Math.round((oneMindTwoGatesBalance + innerJinYeoPurityIndex) / 2 + ((qSeed % 7) - 3))));
  const selfVsOtherHarmony = Math.min(98, Math.max(48, Math.round((hwajaengContradictionResolution + wonYungWheTongHarmonization) / 2)));
  const urgencyVsStillness = Math.min(98, Math.max(45, Math.round((temporalOneMindRhythm.jinYeoWeight + wonhyoMuAeFreedomScore) / 2)));

  const muAePracticeDirective =
    attachmentVsLettingGo >= selfVsOtherHarmony
      ? '내 마음의 집착은 이미 옅어졌으니, 이제 타인의 낯선 입장까지 한 그릇에 담아내는 입파무애의 포용을 발휘하세요.'
      : '주변과의 조율은 충분하니, 정작 내 안의 불필요한 걱정과 완벽주의를 내려놓는 방하착(放下着)에 집중하세요.';

  let wonhyoMasterDharmaWord = '';
  if (wonhyoMuAeFreedomScore >= 85) {
    wonhyoMasterDharmaWord = '일체무애인(一切無碍人)의 기상이 가슴속에 차오르고 있습니다. 세상의 낡은 격식과 주변의 엇갈리는 시선에 매이지 않고 당신의 참된 길을 당당히 걸어갈 때, 마주치는 모든 난관이 저절로 풀립니다.';
  } else if (hwajaengContradictionResolution >= 80) {
    wonhyoMasterDharmaWord = '화쟁(和諍)의 지혜가 빛을 발하고 있습니다. 양립할 수 없어 보이던 두 가지 난제나 갈등 속에서, 양쪽을 하나로 품어 안는 창조적 회통의 해답이 곧 모습을 드러낼 것입니다.';
  } else {
    wonhyoMasterDharmaWord = '심진여문(心眞如門)의 맑은 거울을 닦으십시오. 현실의 번잡한 생멸 작용에 휘둘리지 말고, 고요히 한 호흡을 머금어 일심(一心)의 근원으로 돌아가면 모든 선택이 선명해집니다.';
  }

  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;
  const trimmedQ = (question || '').trim();
  const wonhyoSynthesisMatrix = {
    dominantTension: `${situational.themeLabelKo} ↔ ${activeHwajaengGate.gateNameKo}`,
    alignmentState: `${temporalOneMindRhythm.timeWindowKo} · ${temporalOneMindRhythm.seasonKo}`,
    integratedAction: `${muAePracticeDirective}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: WONHYO_HWAJAENG_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    oneMindTwoGatesBalance,
    hwajaengContradictionResolution,
    wonhyoMuAeFreedomScore,
    wonYungWheTongHarmonization,
    innerJinYeoPurityIndex,
    activeHwajaengGate,
    situationalHwajaeng: situational,
    temporalOneMindRhythm,
    dialecticHarmonizationMatrix: {
      attachmentVsLettingGo,
      selfVsOtherHarmony,
      urgencyVsStillness,
      muAePracticeDirective,
    },
    wonhyoMasterDharmaWord,
    wonhyoSynthesisMatrix,
  };
}

function describeWonhyoOneMindStage(score: number): string {
  if (score >= 86) return '무애 원융회통기 (대립하는 시비를 넘어 일심의 넓은 바다로 회통하는 국면)';
  if (score >= 74) return '화쟁 조율기 (서로 다른 입장을 배척하지 않고 접점을 찾아가는 국면)';
  return '심진여 귀일기 (분별의 긴장을 잠시 멈추고 고요한 본성을 먼저 돌볼 국면)';
}

export function formatWonhyoHwajaengPrompt(report: WonhyoHwajaengReport): string {
  const avgCore = Math.round((report.oneMindTwoGatesBalance + report.hwajaengContradictionResolution + report.wonhyoMuAeFreedomScore) / 3);
  const jinYeoDominant = report.temporalOneMindRhythm.jinYeoWeight >= report.temporalOneMindRhythm.saengMyeolWeight;
  const matrixLine = report.wonhyoSynthesisMatrix
    ? `\n- **원효 화쟁 교차 매트릭스**: 핵심 긴장(${report.wonhyoSynthesisMatrix.dominantTension}) · 조율 상태(${report.wonhyoSynthesisMatrix.alignmentState}) · 통합 실천(${report.wonhyoSynthesisMatrix.integratedAction})`
    : '';
  return `### 신라 원효대사 《십문화쟁론》 일심이문 & 화쟁 원융회통 엔진 (v${report.engineVersion})
- **연산 시각**: ${report.calculatedAtKst}
- **일심 화쟁 위상**: ${describeWonhyoOneMindStage(avgCore)}
- **주요 화쟁 관문**: ${report.activeHwajaengGate.gateNameKo} (${report.activeHwajaengGate.coreDharma})
  - *회통 명상 처방*: ${report.activeHwajaengGate.meditativeResolution}
- **질문 맥락 화쟁 성찰 (${report.situationalHwajaeng.themeLabelKo})**:
  - 원전 경구: ${report.situationalHwajaeng.classicQuote}
  - 성찰 질문: ${report.situationalHwajaeng.reflectionPrompt}
- **KST 일심이문 시공간 리듬 (${report.temporalOneMindRhythm.timeWindowKo} · ${report.temporalOneMindRhythm.seasonKo})**:
  - 현재 주도 문(門): ${jinYeoDominant ? '심진여문(고요한 본성 성찰 우위)' : '심생멸문(역동적 현실 실천 우위)'}
  - 리듬 조언: ${report.temporalOneMindRhythm.rhythmGuidance}
- **원융회통 무애행 지침**: ${report.dialecticHarmonizationMatrix.muAePracticeDirective}
- **원효 성사 법문 처방**:
  - "${report.wonhyoMasterDharmaWord}"
- **해석 경계**: 본 리포트는 원효대사의 일심이문·화쟁 사상에 기반한 정성적 성찰 안내이며, 절대적 시비 판정이 아닙니다.${matrixLine}`;
}
