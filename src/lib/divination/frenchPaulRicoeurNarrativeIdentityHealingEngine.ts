/**
 * 프랑스 폴 리쾨르(Paul Ricoeur) 《시간과 이야기》 & 《자기 자신으로서의 타자》 서사적 정체성 & 해석학적 치유·기억과 용서 지혜 엔진
 *
 * 20세기 프랑스 해석학 및 철학적 인간학의 거장 폴 리쾨르(1913~2005)의 원전 기반:
 * 1. 서사적 정체성 및 삶의 재구성 통합도 (Narrative Identity & Life Emplotment Score): 파편화된 사건들을 하나의 의미 있는 이야기로 엮어내는 서사화(Mise en intrigue) 역량.
 * 2. 자기 자신으로서의 타자 공감 및 윤리적 주체성 지수 (Ipso-Identity & Ethical Alterity Index): '동일성(Même)'에 갇히지 않고 타자의 고통과 존재를 내면으로 품는 윤리적 자기성.
 * 3. 상처받은 기억의 해석학적 치유 및 평정 지표 (Hermeneutic Healing of Wounded Memory Index): 과거의 트라우마와 상처를 억압하지 않고 이야기로 풀어내어 승화시키는 치유력.
 * 4. 은유적 상상력 및 삶의 지평 혁신성 (Metaphorical Innovation & Horizon of Hope Score): 굳어진 현실의 고정관념을 은유의 살아있는 힘으로 깨뜨리고 새로운 가능성을 여는 통찰.
 * 5. 화해와 용서를 향한 성숙한 회복탄력성 (Reconciliation & Generous Forgiveness Resilience): 원한과 복수의 악순환을 끊고 삶의 멍에를 내려놓아 자유를 찾는 영적 회복탄력성.
 *
 * @version LUCKEY-PAUL-RICOEUR-NARRATIVE-IDENTITY-HEALING-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_PAUL_RICOEUR_NARRATIVE_IDENTITY_HEALING_VERSION = 'LUCKEY-PAUL-RICOEUR-NARRATIVE-IDENTITY-HEALING-v2.1.0';

export interface RicoeurTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  hermeneuticInsight: string;
  practicalCounsel: string;
}

export interface RicoeurAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchPaulRicoeurNarrativeIdentityHealingResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 폴 리쾨르 핵심 지표 (0~100)
  narrativeIdentityEmplotmentScore: number;               // 서사적 정체성 및 삶의 재구성 통합도 (Narrative Identity & Emplotment)
  ipsoIdentityEthicalAlterityIndex: number;               // 자기 자신으로서의 타자 공감 지수 (Ipso-Identity & Ethical Alterity)
  hermeneuticHealingMemoryIndex: number;                  // 상처받은 기억의 해석학적 치유 지표 (Healing of Wounded Memory)
  metaphoricalInnovationHopeScore: number;                // 은유적 상상력 및 지평 혁신성 (Metaphorical Innovation & Hope)
  reconciliationForgivenessResilience: number;            // 화해와 용서의 성숙한 회복탄력성 (Reconciliation & Forgiveness Resilience)
  // 세부 분석
  activeRicoeurTheme: RicoeurTheme;
  focalRicoeurAphorism: RicoeurAphorism;
  ricoeurSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  ricoeurComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const RICOEUR_THEMES: RicoeurTheme[] = [
  {
    themeKey: 'emplotment',
    themeTitleEn: 'Emplotment: Wrenching Concord Out of Discordant Life Experiences',
    themeTitleKo: '서사화(Mise en intrigue)의 힘 — 삶의 불협화음과 혼란 속에서 의미의 화음을 건져 올리기',
    hermeneuticInsight: '폴 리쾨르의 서사적 정체성은 인생의 파편적인 사건들을 하나의 플롯(Plot)으로 엮어낼 때 탄생합니다. 고통과 우연, 예기치 않은 단절도 더 큰 이야기의 맥락 속에서 새로운 의미의 전환점이 됩니다.',
    practicalCounsel: '현재 겪는 좌절을 독립된 실패로 단정 짓지 마십시오. 당신이라는 고유한 인생 소설의 위대한 반전을 위한 갈등의 한 장(章)으로 다시 읽어내십시오. 당신은 이야기의 독자이자 다시 쓰는 저자입니다.',
  },
  {
    themeKey: 'oneselfAsAnother',
    themeTitleEn: 'Oneself as Another: Ethical Responsibility Grounded in Compassionate Alterity',
    themeTitleKo: '자기 자신으로서의 타자 — 고립된 자아의 껍질을 깨고 타자의 고통과 숨결에 감응하기',
    hermeneuticInsight: '참된 자아(Soi)는 닫혀 있는 자폐적 자아(Même)가 아닙니다. 나라는 존재는 언제나 타자와의 관계 속에서만 성립하며, 타인의 얼굴과 부름에 응답할 때 비로소 진정한 주체성이 완성됩니다.',
    practicalCounsel: '혼자만의 자존심과 손익 계산에 갇히지 마십시오. 곁에 있는 동료와 소중한 사람들의 불안을 내 아픔처럼 살피고 그들의 손을 잡으십시오. 타인을 위하는 마음이 결국 나 자신을 치유합니다.',
  },
  {
    themeKey: 'livingMetaphor',
    themeTitleEn: 'Living Metaphor: Shattering Rigid Presumptions to Gaze at Open Horizons',
    themeTitleKo: '살아있는 은유의 지평 — 굳어진 현실의 도그마를 깨고 새로운 삶의 가능성 창조하기',
    hermeneuticInsight: '은유(La métaphore vive)는 단순한 수사법이 아니라, 세계를 새롭게 보도록 만드는 존재론적 혁신입니다. 막다른 골목처럼 보이는 현실에서도 은유적 상상력은 전혀 새로운 차원의 길을 발견해 냅니다.',
    practicalCounsel: '"이 길밖에 없다"는 고정관념의 감옥에서 벗어나십시오. 상상력의 렌즈를 넓혀 상황을 전혀 다른 각도에서 비유해 보고, 기존의 관습을 유쾌하게 뛰어넘는 창조적 대안을 시도하십시오.',
  },
  {
    themeKey: 'reconciledMemory',
    themeTitleEn: 'Reconciled Memory: Transcending Past Grievances Through Liberating Forgiveness',
    themeTitleKo: '치유된 기억과 용서 — 과거의 상처와 원한을 풀어놓고 온전한 자유로 나아가기',
    hermeneuticInsight: '용서(Pardon)는 과거를 망각하거나 불의를 정당화하는 것이 아닙니다. 상처받은 기억이 오늘의 숨통을 조이지 않도록 과거의 매듭을 풀어주고, 원한의 굴레에서 벗어나 미래를 선물하는 영적 결단입니다.',
    practicalCounsel: '지나간 배신이나 억울함에 마음의 에너지를 저당 잡히지 마십시오. 상처를 온전히 애도하되, 그것이 당신의 미래를 결정하도록 허락하지 마십시오. 용서는 상대를 위해서가 아니라 당신의 자유를 위한 것입니다.',
  },
];

export const RICOEUR_APHORISMS: RicoeurAphorism[] = [
  {
    aphorismKey: 'narrateConcordFromDiscord',
    aphorismKo: '이야기를 서사화한다는 것은 삶의 온갖 불협화음 속에서 마침내 화음을 건져 올리는 일이다.',
    aphorismFrench: 'Raconter, c\'est faire surgir la concorde de la discordance.',
    sourceContext: '폴 리쾨르 《시간과 이야기(Temps et Récit)》',
    actionGuidance: '예기치 않은 혼란에 흔들리지 마십시오. 모든 갈등은 당신의 삶을 더욱 깊고 풍성하게 엮어주는 서사의 귀한 밑거름입니다.',
  },
  {
    aphorismKey: 'oneselfAsAnotherAphorism',
    aphorismKo: '자기 자신을 진정으로 안다는 것은, 스스로를 타인처럼 대하고 타인을 나 자신처럼 품을 줄 아는 것이다.',
    aphorismFrench: 'Soi-même comme un autre.',
    sourceContext: '폴 리쾨르 《자기 자신으로서의 타자(Soi-même comme un autre)》',
    actionGuidance: '자신에게만 엄격하거나 관대한 이중잣대를 버리십시오. 타인에게 건네는 따스한 친절을 당신의 지친 마음에도 똑같이 베푸십시오.',
  },
  {
    aphorismKey: 'memoryOfHope',
    aphorismKo: '기억은 과거에 대한 고착이 아니다. 그것은 과거의 약속되지 않은 가능성을 구원하여 미래의 희망으로 돌려놓는 일이다.',
    aphorismFrench: 'La mémoire est le gardien de la promesse inachevée du passé pour l\'avenir.',
    sourceContext: '폴 리쾨르 《기억, 역사, 망각(La mémoire, l\'histoire, l\'oubli)》',
    actionGuidance: '지나간 실패에 주눅 들지 마십시오. 그 시절 품었던 순수한 초심과 열정만을 건져 올려 오늘 새로운 희망의 연료로 삼으십시오.',
  },
  {
    aphorismKey: 'forgivenessDifficultMiracle',
    aphorismKo: '용서는 어렵고도 고귀한 기적이다. 그것은 빚을 지우는 것이 아니라, 과거가 더 이상 현재를 파괴하지 못하게 하는 해방이다.',
    aphorismFrench: 'Le pardon est un miracle difficile qui délie le pouvoir d\'agir de la faute passée.',
    sourceContext: '폴 리쾨르 《기억, 역사, 망각(La mémoire, l\'histoire, l\'oubli)》',
    actionGuidance: '마음속의 미움과 응어리를 오늘 조용히 내려놓으십시오. 무거운 원한의 봇짐을 풀 때 비로소 가벼운 발걸음으로 전진할 수 있습니다.',
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

function describeRicoeurStage(score: number): string {
  if (score >= 95) return '깊은 서사적 통합과 화해의 지평이 열리는 국면';
  if (score >= 91) return '차분히 기억을 재구성하며 회복해 가는 단계';
  return '조용히 내면의 매듭을 풀어내는 성찰의 흐름';
}

export function calculateFrenchPaulRicoeurNarrativeIdentityHealing(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): FrenchPaulRicoeurNarrativeIdentityHealingResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `PAUL-RICOEUR-NARRATIVE-IDENTITY:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const narrativeIdentityEmplotmentScore = 89 + ((absHash >> 1) % 10);
  const ipsoIdentityEthicalAlterityIndex = 88 + ((absHash >> 4) % 11);
  const hermeneuticHealingMemoryIndex = 87 + ((absHash >> 7) % 12);
  const metaphoricalInnovationHopeScore = 89 + ((absHash >> 10) % 10);
  const reconciliationForgivenessResilience = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % RICOEUR_THEMES.length;
  const aphorismIndex = (absHash >> 8) % RICOEUR_APHORISMS.length;

  const activeRicoeurTheme = RICOEUR_THEMES[themeIndex];
  const focalRicoeurAphorism = RICOEUR_APHORISMS[aphorismIndex];

  const guidanceTitle = `폴 리쾨르 서사적 정체성과 치유의 지혜: ${activeRicoeurTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 프랑스 철학적 해석학의 대가 폴 리쾨르 선생은 《시간과 이야기》와 《자기 자신으로서의 타자》를 통해 ` +
    `인생의 모순과 파편을 의미 있는 이야기로 엮어내는 서사화(Mise en intrigue), 타자의 아픔을 내 존재로 품어 안는 윤리적 자기성, ` +
    `그리고 상처받은 기억을 용서와 화해로 승화시키는 해석학적 치유의 길을 천명했습니다. ` +
    `지금 당신의 마음에 가장 긴요한 실천적 나침반은 '${activeRicoeurTheme.themeTitleKo}'입니다. ` +
    `${activeRicoeurTheme.practicalCounsel} 리쾨르의 명제 "${focalRicoeurAphorism.aphorismKo}" (${focalRicoeurAphorism.aphorismFrench})를 마음에 새기고, ` +
    `${focalRicoeurAphorism.actionGuidance}`;

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${kst.toISOString().slice(0, 10)} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')} +09:00 KST`;
  const ricoeurSynthesisMatrix = {
    coreInsight: activeRicoeurTheme.themeTitleKo,
    recommendedAction: activeRicoeurTheme.practicalCounsel,
    cautionNotice: '과거의 상처나 한 시점의 좌절을 인생 전체의 고정된 결론으로 단정 짓지 마십시오.',
  };

  return {
    engineVersion: FRENCH_PAUL_RICOEUR_NARRATIVE_IDENTITY_HEALING_VERSION,
    calculatedAtKst: kstTimeLabel,
    narrativeIdentityEmplotmentScore,
    ipsoIdentityEthicalAlterityIndex,
    hermeneuticHealingMemoryIndex,
    metaphoricalInnovationHopeScore,
    reconciliationForgivenessResilience,
    activeRicoeurTheme,
    focalRicoeurAphorism,
    ricoeurSynthesisMatrix,
    ricoeurComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchPaulRicoeurNarrativeIdentityHealingPrompt(
  res: FrenchPaulRicoeurNarrativeIdentityHealingResult,
): string {
  return [
    `【폴 리쾨르 《시간과 이야기·자기 자신으로서의 타자》 서사적 정체성·치유 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 서사적 정체성 및 삶의 재구성 통합도(Narrative Identity & Emplotment): ${describeRicoeurStage(res.narrativeIdentityEmplotmentScore)}`,
    `- 자기 자신으로서의 타자 공감 지수(Ipso-Identity & Ethical Alterity): ${describeRicoeurStage(res.ipsoIdentityEthicalAlterityIndex)}`,
    `- 상처받은 기억의 해석학적 치유 지표(Hermeneutic Healing of Memory): ${describeRicoeurStage(res.hermeneuticHealingMemoryIndex)}`,
    `- 은유적 상상력 및 지평 혁신성(Metaphorical Innovation & Hope): ${describeRicoeurStage(res.metaphoricalInnovationHopeScore)}`,
    `- 화해와 용서의 성숙한 회복탄력성(Reconciliation & Forgiveness Resilience): ${describeRicoeurStage(res.reconciliationForgivenessResilience)}`,
    `- 핵심 리쾨르 테마: ${res.activeRicoeurTheme.themeTitleKo} [${res.activeRicoeurTheme.themeTitleEn}]`,
    `- 해석학적 통찰: ${res.activeRicoeurTheme.hermeneuticInsight}`,
    `- 행동 조언: ${res.activeRicoeurTheme.practicalCounsel}`,
    `- 교차 매트릭스: 핵심(${res.ricoeurSynthesisMatrix.coreInsight}) | 실행(${res.ricoeurSynthesisMatrix.recommendedAction}) | 주의(${res.ricoeurSynthesisMatrix.cautionNotice})`,
    `- 리쾨르 원전 테제: "${res.focalRicoeurAphorism.aphorismKo}" (${res.focalRicoeurAphorism.aphorismFrench})`,
    `- 원전 출처: [${res.focalRicoeurAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalRicoeurAphorism.actionGuidance}`,
    `- 종합 리쾨르 권면: ${res.ricoeurComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: 폴 리쾨르의 서사적 정체성과 화해·용서 해석학 상징을 빌린 정성적 치유 성찰 관점이며, 심리 진단이나 미래 단정이 아닙니다.`,
  ].join('\n');
}
