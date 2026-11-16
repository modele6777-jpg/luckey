/**
 * 이탈리아 르네상스 니콜로 마키아벨리(Niccolò Machiavelli) 《군주론(Il Principe)》 & 《로마사 논고》
 * 비르투(Virtù) 역량 & 포르투나(Fortuna) 극복과 시대적 조화(Riscontro) 실천 엔진
 *
 * 르네상스 현실주의 정치철학과 운명학의 거장 니콜로 마키아벨리(1469~1527)의 불후의 저작 《군주론(Il Principe)》,
 * 《로마사 논고(Discorsi sopra la prima deca di Tito Livio)》 원전 기반:
 * 1. 비르투(Virtù, 탁월한 역량과 과단성): 나약한 운명론에 굴복하지 않고, 스스로 기회를 낚아채며 위기를 돌파하는 인간의 불굴의 기량과 용기.
 * 2. 포르투나(Fortuna, 운명의 격류): 모든 것을 집어삼키는 홍수와 같은 운명의 변덕 앞에서 평소에 제방과 둑을 쌓아 피해를 막고 길을 여는 주체적 대비.
 * 3. 시대와 기질의 조화(Riscontro con i tempi): 시대와 상황의 흐름(Occasione)을 정확히 읽고 자신의 행동 방식을 그에 맞추어 유연하게 변모시키는 전략적 지혜.
 * 4. 여우의 지혜와 사자의 용맹(Volpe e Leone): 간교한 덫을 알아채는 여우의 기민한 직관과 사나운 늑대를 내쫓는 사자의 결단력을 상황에 따라 겸비.
 * 5. 실효적 진리(Verità effettuale della cosa): 공허한 환상이나 탁상공론의 당위론을 버리고, 현실의 실질적인 인과와 역학 관계를 꿰뚫어 보는 냉철한 분별력.
 *
 * @version LUCKEY-MACHIAVELLI-VIRTU-FORTUNA-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const ITALIAN_MACHIAVELLI_VERSION = 'LUCKEY-MACHIAVELLI-VIRTU-FORTUNA-v2.1.0';

export interface MachiavelliTheme {
  themeKey: string;
  themeTitleItalian: string;
  themeTitleKo: string;
  politicalInsight: string;
  strategicCounsel: string;
}

export interface MachiavelliAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismItalian: string;
  textualContext: string;
  practicalAction: string;
}

export interface MachiavelliVirtuFortunaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 르네상스 실천 지표 (0~100)
  virtuDecisiveCompetenceScore: number;     // 비르투(Virtù) 과단성 및 위기 돌파 역량 지수
  fortunaNavigationMasteryScore: number;    // 포르투나(Fortuna) 운명의 격류 통제 및 대비력
  riscontroTemporalAdaptabilityScore: number; // 시대와 상황(Occasione) 조화 적응도
  foxLionPrudentBalanceScore: number;       // 여우의 지혜와 사자의 용맹 조화도
  effectualTruthRealismScore: number;       // 실효적 진리(Verità effettuale) 현실 통찰력
  // 세부 체계
  activeMachiavelliTheme: MachiavelliTheme;
  focalMachiavelliAphorism: MachiavelliAphorism;
  secondaryMachiavelliAphorism: MachiavelliAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  machiavelliPersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  machiavelliSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const MACHIAVELLI_THEMES: MachiavelliTheme[] = [
  {
    themeKey: 'virtu_overcoming_fortuna',
    themeTitleItalian: 'Virtù Dominatrice della Fortuna',
    themeTitleKo: '비르투의 과단성: 운명의 격류를 뚫고 나아가는 역량',
    politicalInsight: '포르투나는 행동의 절반만을 지배할 뿐이며, 나머지 절반은 인간의 비르투와 결단에 맡겨져 있습니다.',
    strategicCounsel: '운명의 탓으로 돌리며 주저앉지 마십시오. 위기일수록 주도권을 쥐고 강력한 의지로 판을 재구성하는 결단력을 발휘하십시오.',
  },
  {
    themeKey: 'argini_e_ripari',
    themeTitleItalian: 'Argini e Ripari nei Tempi Quieti',
    themeTitleKo: '제방과 보의 지혜: 평온할 때 준비하는 위기 방비',
    politicalInsight: '홍수는 제방이 없는 곳을 덮칩니다. 평화롭고 조용할 때 둑을 쌓아두는 자만이 운명의 격류를 길들일 수 있습니다.',
    strategicCounsel: '일이 잘 풀릴 때 방심하지 말고 미리 시스템과 대책을 구축하십시오. 철저한 사전 준비만이 돌발 변수를 통제합니다.',
  },
  {
    themeKey: 'riscontro_con_i_tempi',
    themeTitleItalian: 'Riscontro con i Tempi e le Cose',
    themeTitleKo: '시대와의 조화: 상황의 변화에 발맞추는 유연한 변용',
    politicalInsight: '과거의 성공 방식에 집착하는 자는 파멸합니다. 성공과 실패는 자신의 기질을 시대와 상황의 요구에 얼마나 일치시키느냐에 달렸습니다.',
    strategicCounsel: '고집을 버리고 상황의 물결을 관찰하십시오. 신중해야 할 때와 과감해야 할 때를 냉정히 가려 태세를 민첩하게 전환하십시오.',
  },
  {
    themeKey: 'volpe_e_leone',
    themeTitleItalian: 'Astuzia della Volpe e Forza del Leone',
    themeTitleKo: '여우의 지혜와 사자의 용맹: 양날의 지혜와 담력',
    politicalInsight: '사자는 덫을 피할 수 없고 여우는 늑대를 쫓을 수 없습니다. 지략과 힘을 동시에 갖출 때 비로소 완전무결해집니다.',
    strategicCounsel: '지혜로운 관찰로 숨은 함정을 간파하되, 결단할 때는 사자처럼 흔들림 없이 힘을 쏟아부어 목표를 쟁취하십시오.',
  },
  {
    themeKey: 'verita_effettuale',
    themeTitleItalian: 'Verità Effettuale della Cosa',
    themeTitleKo: '실효적 진리 직시: 헛된 이상주의를 넘은 냉철한 현실성',
    politicalInsight: '마땅히 그래야 한다는 환상에 매달리는 자는 자기 파멸을 부릅니다. 있는 그대로의 현실과 인간 본성을 직시해야 생존합니다.',
    strategicCounsel: '희망 섞인 착각을 걷어내고 실제 사실과 객관적 인과 관계만을 냉정하게 직시하십시오. 현실을 직시할 때 진짜 해답이 나옵니다.',
  },
];

export const MACHIAVELLI_APHORISMS: MachiavelliAphorism[] = [
  {
    aphorismKey: 'fortuna_half_arbiter',
    aphorismKo: '운명은 우리 행동의 절반만을 지배하며, 나머지 절반은 우리 자신의 지배에 맡겨져 있다.',
    aphorismItalian: 'La fortuna è arbitra della metà delle azioni nostre, ma lascia governare l\'altra metà a noi.',
    textualContext: '《군주론》 제25장: 운명과 인간 자유의지의 관계 및 주체적 결단의 필연성',
    practicalAction: '주어진 환경을 탓하지 말고, 당신의 손으로 바꿀 수 있는 절반의 영역에 온 힘과 집중을 쏟으십시오.',
  },
  {
    aphorismKey: 'better_impetuous',
    aphorismKo: '신중한 것보다는 차라리 과감한 편이 낫다. 운명은 결단력 있는 용기 있는 자에게 이끌리기 때문이다.',
    aphorismItalian: 'È meglio essere impetuoso che respettivo; perché la fortuna è donna ed è necessario batterla.',
    textualContext: '《군주론》 제25장: 결정적 기회(Occasione) 앞에서 망설임을 부수고 결단하는 역동성',
    practicalAction: '지나친 분석으로 때를 놓치지 마십시오. 충분히 준비되었다면 주저 없이 과감하게 첫발을 내디디십시오.',
  },
  {
    aphorismKey: 'fox_and_lion',
    aphorismKo: '함정을 알아채기 위해서는 여우가 되어야 하고, 늑대를 물리치기 위해서는 사자가 되어야 한다.',
    aphorismItalian: 'Bisogna essere volpe a conoscere i lacci, e lione a sbigottire i lupi.',
    textualContext: '《군주론》 제18장: 복잡한 현실 문제를 풀어내는 이중 전략적 기량',
    practicalAction: '이면의 위험을 꿰뚫어 보는 섬세한 분별력과 한 번 정한 방향을 밀어붙이는 담대한 용기를 조화시키십시오.',
  },
  {
    aphorismKey: 'effectual_truth',
    aphorismKo: '상상 속의 공화국을 꿈꾸기보다는 사물의 실효적 진리를 좇는 것이 훨씬 유익하다.',
    aphorismItalian: 'Andare dietro alla verità effettuale della cosa, che alla imaginazione di essa.',
    textualContext: '《군주론》 제15장: 공허한 도덕적 당위론을 배격하고 사실과 본질에 천착하는 원칙',
    practicalAction: '주변의 겉치레 말이나 이상론에 휘둘리지 말고, 실제 데이터와 행동 결과로 드러나는 현실만을 토대로 판단하십시오.',
  },
  {
    aphorismKey: 'prepare_during_calm',
    aphorismKo: '바다가 잔잔할 때 폭풍을 생각하지 않는 것은 인간의 치명적인 공통 결함이다.',
    aphorismItalian: 'Comune difetto degli uomini, non fare conto nella bonaccia della tempesta.',
    textualContext: '《군주론》 제24장: 위기 불감증 경계와 지속적 긴장감 및 시스템 방비의 필요성',
    practicalAction: '상황이 순탄할 때일수록 최악의 시나리오를 미리 검토하고, 안전장치와 플랜 B를 조용히 확보하십시오.',
  },
  {
    aphorismKey: 'glory_of_overcoming',
    aphorismKo: '역경이 클수록 비르투는 더욱 눈부시게 빛나며, 극복된 난관은 가장 큰 영예가 된다.',
    aphorismItalian: 'Quanto maggiori sono le difficultà, tanto maggiore è la virtù che si dimostra nello 스uperarle.',
    textualContext: '《로마사 논고》: 시련을 성숙과 탁월함의 시험대로 전환하는 공화주의적 기개',
    practicalAction: '눈앞의 장애물을 피하려 하지 말고 역량을 비약적으로 성장시킬 절호의 기회로 규정하여 정면 돌파하십시오.',
  },
];

function formatMachiavelliKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeMachiavelliStage(score: number): string {
  if (score >= 88) return '비르투(Virtù) 주도기 (운명의 격류를 뚫고 판을 장악하는 과단성)';
  if (score >= 78) return '리스콘트로(Riscontro) 조화기 (시대의 흐름에 맞추어 태세를 유연하게 전환하는 국면)';
  return '제방 구축(Argini e Ripari)기 (실효적 진리를 직시하며 방비와 역량을 다지는 흐름)';
}

export function calculateMachiavelliVirtuFortuna(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): MachiavelliVirtuFortunaResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `MACHIAVELLI-VIRTU:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const virtuDecisiveCompetenceScore = 70 + (absHash % 29);
  const fortunaNavigationMasteryScore = 67 + ((absHash >> 3) % 32);
  const riscontroTemporalAdaptabilityScore = 69 + ((absHash >> 6) % 30);
  const foxLionPrudentBalanceScore = 68 + ((absHash >> 9) % 31);
  const effectualTruthRealismScore = 71 + ((absHash >> 12) % 28);

  const themeIndex = (absHash >> 4) % MACHIAVELLI_THEMES.length;
  const aphorismIndex = (absHash >> 7) % MACHIAVELLI_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 10) % (MACHIAVELLI_APHORISMS.length - 1))) % MACHIAVELLI_APHORISMS.length;

  const activeMachiavelliTheme = MACHIAVELLI_THEMES[themeIndex];
  const focalMachiavelliAphorism = MACHIAVELLI_APHORISMS[aphorismIndex];
  const secondaryMachiavelliAphorism = MACHIAVELLI_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}'에서 운명(Fortuna) 탓으로 돌릴 변명을 걷어 내고 내가 지금 당장 주도권을 쥐고 쌓아야 할 비르투의 제방은 무엇인가요?`
    : `지금 내 상황에서 여우의 기민함으로 먼저 피해야 할 함정과 사자의 결단력으로 밀고 나가야 할 과제는 각각 무엇인가요?`;
  const interpretiveBoundary = '마키아벨리 비르투·포르투나 관점은 미래의 길흉 예단이 아니라, 현실 역학과 주체적 전략 선택을 비추는 르네상스 성찰 렌즈입니다.';

  const counselTitle = `마키아벨리 군주론 비르투 지혜: ${activeMachiavelliTheme.themeTitleKo}`;
  const philosophicalGuidance = `니콜로 마키아벨리의 현실주의 철학은 운명의 수동적 희생자가 되지 않고 주체적 역량(Virtù)으로 삶의 판을 장악하도록 일깨웁니다. ` +
    `현재 당신이 마주한 도전에서 핵심적인 전략은 '${activeMachiavelliTheme.themeTitleKo}'에 있습니다. ` +
    `${activeMachiavelliTheme.strategicCounsel} 아울러 마키아벨리의 명제인 "${focalMachiavelliAphorism.aphorismKo}"(${focalMachiavelliAphorism.aphorismItalian})을 상기하며, ` +
    `${focalMachiavelliAphorism.practicalAction}`;

  const machiavelliSynthesisMatrix = {
    dominantTension: `${activeMachiavelliTheme.themeTitleKo} ↔ ${focalMachiavelliAphorism.textualContext}`,
    alignmentState:
      virtuDecisiveCompetenceScore >= 85 && effectualTruthRealismScore >= 85
        ? '비르투의 결단과 실효적 진리 직시의 전략적 합일'
        : '제방을 쌓으며 시대 변화(Riscontro)에 기민하게 대응하는 국면',
    integratedAction: `${activeMachiavelliTheme.strategicCounsel} (${focalMachiavelliAphorism.practicalAction})`,
  };

  return {
    engineVersion: ITALIAN_MACHIAVELLI_VERSION,
    calculatedAtKst: formatMachiavelliKstTimestamp(now),
    virtuDecisiveCompetenceScore,
    fortunaNavigationMasteryScore,
    riscontroTemporalAdaptabilityScore,
    foxLionPrudentBalanceScore,
    effectualTruthRealismScore,
    activeMachiavelliTheme,
    focalMachiavelliAphorism,
    secondaryMachiavelliAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    machiavelliPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    machiavelliSynthesisMatrix,
  };
}

export function formatMachiavelliVirtuFortunaPrompt(res: MachiavelliVirtuFortunaResult): string {
  const lines = [
    `【니콜로 마키아벨리 《군주론》 비르투 & 포르투나 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 비르투 과단성 지수(Virtù): ${describeMachiavelliStage(res.virtuDecisiveCompetenceScore)}`,
    `- 포르투나 운명 통제력(Fortuna Navigation): ${describeMachiavelliStage(res.fortunaNavigationMasteryScore)}`,
    `- 시대·상황 조화 적응도(Riscontro con i Tempi): ${describeMachiavelliStage(res.riscontroTemporalAdaptabilityScore)}`,
    `- 여우·사자 균형 역량(Volpe e Leone): ${describeMachiavelliStage(res.foxLionPrudentBalanceScore)}`,
    `- 실효적 진리 통찰력(Verità Effettuale): ${describeMachiavelliStage(res.effectualTruthRealismScore)}`,
    `- 핵심 전략 테마: ${res.activeMachiavelliTheme.themeTitleKo} [${res.activeMachiavelliTheme.themeTitleItalian}]`,
    `- 현실주의 정치 통찰: ${res.activeMachiavelliTheme.politicalInsight}`,
    `- 전략적 조언: ${res.activeMachiavelliTheme.strategicCounsel}`,
    `- 핵심 경구: "${res.focalMachiavelliAphorism.aphorismKo}"`,
    `- 보조 교차 경구: "${res.secondaryMachiavelliAphorism.aphorismKo}" [${res.secondaryMachiavelliAphorism.textualContext}]`,
    `- 이탈리아어 원문: "${res.focalMachiavelliAphorism.aphorismItalian}" [${res.focalMachiavelliAphorism.textualContext}]`,
    `- 실천적 행동 지침: ${res.focalMachiavelliAphorism.practicalAction}`,
    `- 통합 전략 권면: ${res.machiavelliPersonalCounsel.philosophicalGuidance}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.machiavelliSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.machiavelliSynthesisMatrix.dominantTension} | 조율 상태: ${res.machiavelliSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.machiavelliSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
