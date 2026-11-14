/**
 * 프랑스 장 폴 사르트르(Jean-Paul Sartre) 《존재와 무(L'Être et le Néant)》 & 《실존주의는 휴머니즘이다》 실존적 자유·주체적 기획 & 진정성(Authenticité)과 앙가주망(Engagement) 엔진
 *
 * 20세기 프랑스 실존주의 철학의 기수 장 폴 사르트르(Jean-Paul Sartre, 1905~1980)의 핵심 원전 기반.
 *
 * @version LUCKEY-JEAN-PAUL-SARTRE-EXISTENTIALISM-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_JEAN_PAUL_SARTRE_VERSION = 'LUCKEY-JEAN-PAUL-SARTRE-EXISTENTIALISM-v2.0.0';

export interface SartreTheme {
  themeKey: string;
  themeTitleFrench: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface SartreAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface SartreSituationalAuthenticityAudit {
  themeKo: string;
  sourceCitation: string;
  frenchQuote: string;
  translationKo: string;
  badFaithExcuseTrap: string;
  projectActionStep: string;
}

export interface SartreTemporalProjectRhythm {
  kstWindow: string;
  seasonalTone: string;
  projectFocus: '주체적 기획(Projet)' | '행동 구현(Acte)' | '자기기만 점검(Authenticité)' | '앙가주망 연대(Engagement)';
  authenticityClarityIndex: number;
  rhythmDirective: string;
}

export interface SartreSynthesisMatrix {
  projectAutonomy: number;
  badFaithOvercoming: number;
  engagedAction: number;
  overallSynthesis: number;
}

export interface JeanPaulSartreExistentialismResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 사르트르 실존주의 지표 (0~100)
  existencePrecedesEssenceScore: number;       // 실존의 본질 선행 및 주체적 기획도 (L'existence précède l'essence / Projet)
  condemnedToBeFreeScore: number;             // 자유의 형벌 속 주체적 결단력 (Condamné à être libre)
  badFaithOvercomingAuthenticityScore: number;// 자기기만 극복 및 실존적 진정성 지수 (Dépassement de la mauvaise foi & Authenticité)
  existentialAnguishLucidityScore: number;    // 실존적 불안 직시 및 책임 명석도 (Lucidité de l'angoisse & Responsabilité)
  engagementSolidarityActionIndex: number;    // 세상을 향한 결단과 실천적 연대 앙가주망 지수 (Engagement social et solidaire)
  // 세부 분석
  activeSartreTheme: SartreTheme;
  focalSartreAphorism: SartreAphorism;
  situationalAuthenticityAudit: SartreSituationalAuthenticityAudit;
  temporalProjectRhythm: SartreTemporalProjectRhythm;
  sartreSynthesisMatrix: SartreSynthesisMatrix;
  sartreComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const SARTRE_THEMES: SartreTheme[] = [
  {
    themeKey: 'existence_precedes_essence',
    themeTitleFrench: "L'existence précède l'essence (실존은 본질에 앞선다)",
    themeTitleKo: '정해진 운명을 거부하고 스스로를 조각하는 주체적 기획',
    existentialInsight: '당신은 과거의 꼬리표나 남들이 정해준 기대치로 정의될 수 없습니다. 인간은 오직 자신이 스스로 선택하고 실천한 행위들의 총합으로만 자신을 입증합니다.',
    practicalCounsel: '"나는 원래 이런 사람이다"라는 숙명론적 체념을 당장 던져버리십시오. 당신이 지금 이 순간 결단하고 내딛는 첫 발걸음이 당신의 참된 본질을 새로 규정합니다.',
  },
  {
    themeKey: 'condemned_to_be_free',
    themeTitleFrench: 'Condamné à être libre (인간은 자유롭도록 선고받았다)',
    themeTitleKo: '피할 수 없는 선택 앞에서 전적으로 짊어지는 온전한 책임',
    existentialInsight: '선택하지 않는 것조차 하나의 선택입니다. 어떤 외부 핑계도 당신의 결단을 대신해 주지 않으며, 바로 그 고독한 자유 속에 인간의 위대한 존엄이 깃듭니다.',
    practicalCounsel: '누군가에게 답을 대신 내려달라고 기대지 마십시오. 스스로 기준을 세우고, 결과가 어떠하든 그 무게를 두려움 없이 기꺼이 감당하십시오.',
  },
  {
    themeKey: 'overcoming_bad_faith',
    themeTitleFrench: 'La Mauvaise foi et Authenticité (자기기만 극복과 진정성)',
    themeTitleKo: '사회적 가면과 핑계를 찢고 마주하는 가식 없는 참된 자아',
    existentialInsight: '환경 탓, 남 탓, 시대 탓을 하며 자신의 무기력함을 정당화하는 태도는 영혼을 갉아먹는 자기기만(Mauvaise foi)에 불과합니다. 진정한 자유는 뼈아픈 자기 고백에서 시작됩니다.',
    practicalCounsel: '스스로에게 정직해지십시오. 마지못해 하고 있다고 느끼는 일조차 사실은 당신이 안전을 위해 선택한 것임을 직시할 때, 비로소 참된 변화가 시작됩니다.',
  },
  {
    themeKey: 'lucidity_of_anguish',
    themeTitleFrench: "L'Angoisse créatrice (창조적 불안의 명찰)",
    themeTitleKo: '가능성의 현기증인 실존적 불안을 행동의 엔진으로 승화',
    existentialInsight: '선택의 기로에서 밀려오는 막막함과 불안은 나약함의 증거가 아니라, 당신의 앞에 무수한 가능성의 지평이 열려 있다는 자유의 엄숙한 신호입니다.',
    practicalCounsel: '불안에 압도되어 도망치지 마십시오. 그 현기증을 또렷하게 응시하면서, 당신의 전 생애를 걸 만한 명확한 한 가지 행동으로 불안을 돌파하십시오.',
  },
  {
    themeKey: 'engagement_action',
    themeTitleFrench: "L'Engagement (시대와 세상 속으로의 능동적 참여)",
    themeTitleKo: '고립된 골방을 박차고 나와 타인과 연대하는 실천적 행동',
    existentialInsight: '자신의 자유를 원하는 사람은 필연적으로 타인의 자유 역시 열망하게 됩니다. 침묵과 방관을 멈추고 세상의 부조리에 행동으로 맞설 때 실존은 완성됩니다.',
    practicalCounsel: '생각과 고뇌만으로 머물지 마십시오. 불의에 목소리를 내고, 고통받는 이들에게 손을 내밀며, 당신이 살고 싶은 세상을 오늘 당장의 작은 행동으로 증명하십시오.',
  },
];

export const SARTRE_APHORISMS: SartreAphorism[] = [
  {
    aphorismKey: 'man_is_nothing_else',
    aphorismKo: '인간은 스스로가 만들어가는 것 이외의 아무것도 아니다.',
    aphorismFrench: "L'homme n'est rien d'autre que ce qu'il se fait. (L'existentialisme est un humanisme)",
    sourceContext: '《실존주의는 휴머니즘이다》',
    actionGuidance: '과거의 실패나 환경의 결핍을 곱씹지 마십시오. 당신은 오늘 당신이 행하는 선택으로 다시 태어납니다.',
  },
  {
    aphorismKey: 'freedom_and_responsibility',
    aphorismKo: '우리는 자유롭도록 운명 지어졌다. 일단 세상에 던져진 이상, 인간은 자신이 행하는 모든 것에 대해 책임을 져야 한다.',
    aphorismFrench: 'Nous sommes condamnés à la liberté; jeté dans le monde, l’homme est responsable de tout ce qu’il fait. (L’Être et le Néant)',
    sourceContext: '《존재와 무》',
    actionGuidance: '선택을 유예하며 남의 핑계를 찾지 마십시오. 전적인 주체로서 결정하고 당당하게 앞을 향해 나아가십시오.',
  },
  {
    aphorismKey: 'action_defines_hope',
    aphorismKo: '행동 속에만 희망이 있고, 인간을 살아가게 하는 유일한 것은 오직 실천뿐이다.',
    aphorismFrench: "Il n'y a de réalité que dans l'action; l'homme n'est rien d'autre que la suite de ses actes. (L'existentialisme est un humanisme)",
    sourceContext: '《실존주의는 휴머니즘이다》',
    actionGuidance: '탁상공론과 막연한 낙관을 걷어내십시오. 당신의 신념을 오늘 손과 발로 직접 만질 수 있는 결과물로 구현하십시오.',
  },
  {
    aphorismKey: 'destiny_in_ones_hands',
    aphorismKo: '인간의 운명은 다른 곳이 아니라 바로 자기 자신의 두 손 안에 놓여 있다.',
    aphorismFrench: "Le destin de l'homme est placé en lui-même. (Les Mouches)",
    sourceContext: '희곡 《파리들(Les Mouches)》',
    actionGuidance: '누구도 당신의 미래를 대신 써줄 수 없습니다. 자신의 두 손으로 삶의 고삐를 쥐고 운명을 스스로 지휘하십시오.',
  },
];

function buildSituationalAuthenticityAudit(question?: string): SartreSituationalAuthenticityAudit {
  const q = (question ?? '').trim();
  if (/어쩔 수 없|핑계|남 탓|환경|불가능|원래/.test(q)) {
    return {
      themeKo: '자기기만(Mauvaise foi) 해체와 주체성 회복',
      sourceCitation: '《존재와 무(L’Être et le Néant)》 제1부 2장',
      frenchQuote: "L'homme n'est rien d'autre que ce qu'il se fait.",
      translationKo: '인간은 스스로가 만들어 가는 것 이외의 아무것도 아니다.',
      badFaithExcuseTrap: '"상황이 이래서 어쩔 수 없다"며 내게 남아 있는 선택권마저 부인하는 자기기만.',
      projectActionStep: '지금 상황에서 내가 포기하지 않고 행사할 수 있는 자유로운 선택 1가지를 종이에 분명히 적고 실행하십시오.',
    };
  }
  if (/불안|결정|선택|망설|두렵|고민/.test(q)) {
    return {
      themeKo: '자유의 현기증(Angoisse)과 결단의 기획',
      sourceCitation: '《실존주의는 휴머니즘이다》',
      frenchQuote: "Il n'y a de réalité que dans l'action.",
      translationKo: '현실성은 오직 행동 속에만 존재한다.',
      badFaithExcuseTrap: '남이 정답을 대신 보증해 주기를 기다리며 선택을 무한히 미루는 유예.',
      projectActionStep: '머릿속 시뮬레이션을 멈추고, 오늘 내 이름과 책임으로 감당할 첫 행동 1가지를 시작하십시오.',
    };
  }
  if (/관계|타인|시선|눈치|평가|갈등/.test(q)) {
    return {
      themeKo: '타인의 시선(Le Regard)을 넘어선 상호 자유',
      sourceCitation: '《존재와 무》 제3부 · 〈타자의 시선〉',
      frenchQuote: "En me choisissant, je choisis l'homme.",
      translationKo: '나 자신을 선택함으로써, 나는 인간 전체의 모범을 함께 선택한다.',
      badFaithExcuseTrap: '타인의 시선에 비친 이미지에 나를 맞추어 스스로를 사물처럼 고정해 버리는 태도.',
      projectActionStep: '상대의 눈치에 맞춘 가면을 잠시 내려놓고, 진정성 있는 본심 한 문장을 정중히 건네십시오.',
    };
  }
  return {
    themeKo: '실존의 본질 선행(Projet)과 오늘의 자기 창조',
    sourceCitation: '《파리들》 & 《실존주의는 휴머니즘이다》',
    frenchQuote: "Le destin de l'homme est placé en lui-même.",
    translationKo: '인간의 운명은 바깥이 아니라 바로 자기 자신의 두 손 안에 놓여 있다.',
    badFaithExcuseTrap: '과거의 경력이나 기질이라는 꼬리표 뒤에 숨어 오늘의 변화를 닫아 버리는 관성.',
    projectActionStep: '오늘 내가 되고 싶은 모습에 부합하는 구체적 행동 1가지를 지금 바로 손에 잡히는 형태로 실행하십시오.',
  };
}

function buildTemporalProjectRhythm(now?: Date): SartreTemporalProjectRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 과거의 본질을 넘어 새 기획(Projet)을 세우는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 말과 행동(Acte)으로 현실에 실존을 각인하는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 핑계와 자기기만을 걷어내고 책임을 매듭짓는 계절'
          : '겨울 — 타인의 시선에서 물러나 진정성(Authenticité)을 다지는 계절';

  if (hour >= 5 && hour < 11) {
    return {
      kstWindow: '오전 주체적 기획(Projet) 선언 창',
      seasonalTone,
      projectFocus: '주체적 기획(Projet)',
      authenticityClarityIndex: 91,
      rhythmDirective: '어제의 꼬리표를 떼고 오늘의 나를 새로 기획하기 가장 좋은 오전입니다. 첫 행동을 선언하십시오.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstWindow: '한낮 행동 구현(Acte) 돌파 창',
      seasonalTone,
      projectFocus: '행동 구현(Acte)',
      authenticityClarityIndex: 86,
      rhythmDirective: '생각만으로는 아무것도 바뀌지 않는 낮 시간입니다. 지금 당장 실행 가능한 행동으로 현실을 움직이십시오.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 앙가주망 연대(Engagement) 창',
      seasonalTone,
      projectFocus: '앙가주망 연대(Engagement)',
      authenticityClarityIndex: 83,
      rhythmDirective: '나의 자유가 타인의 자유와 만나는 저녁입니다. 솔직한 대화와 신뢰의 약속으로 연대를 확인하십시오.',
    };
  }
  return {
    kstWindow: '심야 자기기만 점검(Authenticité) 창',
    seasonalTone,
    projectFocus: '자기기만 점검(Authenticité)',
    authenticityClarityIndex: 80,
    rhythmDirective: '스스로에게 정직해지는 심야입니다. 오늘 내가 피한 선택과 핑계가 없었는지 조용히 비추어 보십시오.',
  };
}

export function calculateJeanPaulSartreExistentialism(
  profile: UserProfile,
  question?: string,
  now?: Date,
): JeanPaulSartreExistentialismResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `JEAN-PAUL-SARTRE-EXISTENTIALISM:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const existencePrecedesEssenceScore = 73 + (absHash % 26);
  const condemnedToBeFreeScore = 72 + ((absHash >> 3) % 27);
  const badFaithOvercomingAuthenticityScore = 74 + ((absHash >> 6) % 25);
  const existentialAnguishLucidityScore = 71 + ((absHash >> 9) % 28);
  const engagementSolidarityActionIndex = 70 + ((absHash >> 12) % 29);

  const themeIndex = (absHash >> 4) % SARTRE_THEMES.length;
  const aphorismIndex = (absHash >> 7) % SARTRE_APHORISMS.length;

  const activeSartreTheme = SARTRE_THEMES[themeIndex];
  const focalSartreAphorism = SARTRE_APHORISMS[aphorismIndex];
  const situationalAuthenticityAudit = buildSituationalAuthenticityAudit(question);
  const temporalProjectRhythm = buildTemporalProjectRhythm(now);

  const projectAutonomy = Math.min(99, Math.round((existencePrecedesEssenceScore + condemnedToBeFreeScore) / 2));
  const badFaithOvercoming = Math.min(99, Math.round((badFaithOvercomingAuthenticityScore + temporalProjectRhythm.authenticityClarityIndex) / 2));
  const engagedAction = Math.min(99, Math.round((existentialAnguishLucidityScore + engagementSolidarityActionIndex) / 2));
  const overallSynthesis = Math.round((projectAutonomy + badFaithOvercoming + engagedAction) / 3);

  const sartreSynthesisMatrix: SartreSynthesisMatrix = {
    projectAutonomy,
    badFaithOvercoming,
    engagedAction,
    overallSynthesis,
  };

  const guidanceTitle = `장 폴 사르트르 실존적 자유와 앙가주망: ${activeSartreTheme.themeTitleKo}`;
  const philosophicalCounsel = `사르트르의 실존철학은 주어진 운명이나 핑계 뒤로 숨지 않고, 전적인 자유와 책임을 오롯이 짊어지며 자신의 본질을 창조하도록 격려합니다. ` +
    `현재 당신의 삶을 인도하는 실존적 기획 원리는 '${activeSartreTheme.themeTitleKo}'입니다. ` +
    `${activeSartreTheme.practicalCounsel} 아울러 원전의 결연한 경구 "${focalSartreAphorism.aphorismKo}"(${focalSartreAphorism.aphorismFrench})을 마음에 새기고, ` +
    `${focalSartreAphorism.actionGuidance}`;

  return {
    engineVersion: FRENCH_JEAN_PAUL_SARTRE_VERSION,
    calculatedAtKst: (now ?? new Date()).toISOString(),
    existencePrecedesEssenceScore,
    condemnedToBeFreeScore,
    badFaithOvercomingAuthenticityScore,
    existentialAnguishLucidityScore,
    engagementSolidarityActionIndex,
    activeSartreTheme,
    focalSartreAphorism,
    situationalAuthenticityAudit,
    temporalProjectRhythm,
    sartreSynthesisMatrix,
    sartreComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatJeanPaulSartreExistentialismPrompt(res: JeanPaulSartreExistentialismResult): string {
  return [
    `【장 폴 사르트르 《존재와 무》 실존적 자유 & 앙가주망 지표】`,
    `- 실존 본질선행 주체적 기획도(Projet): ${res.existencePrecedesEssenceScore}/100`,
    `- 자유의 형벌 속 주체적 결단력(Liberté): ${res.condemnedToBeFreeScore}/100`,
    `- 자기기만 극복 실존 진정성(Authenticité): ${res.badFaithOvercomingAuthenticityScore}/100`,
    `- 실존적 불안 직시 책임 명석도(Angoisse): ${res.existentialAnguishLucidityScore}/100`,
    `- 세상을 향한 연대 실천 앙가주망(Engagement): ${res.engagementSolidarityActionIndex}/100`,
    `- 핵심 실존 테마: ${res.activeSartreTheme.themeTitleKo} [${res.activeSartreTheme.themeTitleFrench}]`,
    `- 질문 맥락 진정성 감사 (${res.situationalAuthenticityAudit.themeKo} · ${res.situationalAuthenticityAudit.sourceCitation}): "${res.situationalAuthenticityAudit.translationKo}" [${res.situationalAuthenticityAudit.frenchQuote}]`,
    `- 자기기만 경계: ${res.situationalAuthenticityAudit.badFaithExcuseTrap}`,
    `- 주체적 기획 첫걸음: ${res.situationalAuthenticityAudit.projectActionStep}`,
    `- KST 실존 리듬: ${res.temporalProjectRhythm.kstWindow} (${res.temporalProjectRhythm.projectFocus}, 명료도 ${res.temporalProjectRhythm.authenticityClarityIndex}/100) — ${res.temporalProjectRhythm.rhythmDirective}`,
    `- 사르트르 매트릭스: 주체적 기획 ${res.sartreSynthesisMatrix.projectAutonomy} / 자기기만 극복 ${res.sartreSynthesisMatrix.badFaithOvercoming} / 앙가주망 실천 ${res.sartreSynthesisMatrix.engagedAction} (종합 ${res.sartreSynthesisMatrix.overallSynthesis}/100)`,
    `- 종합 실존철학 권면: ${res.sartreComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
