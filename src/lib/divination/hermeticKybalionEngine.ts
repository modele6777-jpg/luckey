/**
 * =========================================================================
 * LUCKEY 헤르메스 카이발리온 7대 우주 불변 법칙 엔진 (v2.0.0)
 * (Hermetic Kybalion Seven Cosmic Principles Engine)
 * =========================================================================
 *
 * 고대 헤르메스주의 고전 『The Kybalion (카이발리온)』 7대 대우주 원리를
 * 생년월일·질문 맥락·KST 시공간 진자 리듬에 매핑하여,
 * 백분율 점수 노출 없이 정신 연금술적 통찰을 제공합니다.
 */

import type { UserProfile } from '../sharedState';

export const HERMETIC_KYBALION_VERSION = 'LUCKEY-HERMETIC-KYBALION-v2.2.0';

export type KybalionQuestionFocus = 'career' | 'relationship' | 'anxiety' | 'decision' | 'spiritual';

export interface HermeticPrincipleStatus {
  nameEn: string;
  nameKo: string;
  aphorism: string;
  alignmentScore: number; // 0 ~ 100 내부 계산용 정렬도
  lifeApplication: string;
}

export interface SituationalKybalionAudit {
  focus: KybalionQuestionFocus;
  kybalionMaxim: string;
  mentalAlchemyDiagnosis: string;
  pendulumTrapWarning: string;
  transmutationAction: string;
}

export interface TemporalPendulumRhythm {
  kstHour: number;
  pendulumWindow: string;
  seasonalPolarity: string;
  correspondenceAlignment: string;
  timingAdvice: string;
}

export interface KybalionSynthesisMatrix {
  overallAlignmentLabel: string;
  polarityIntegrationState: string;
  causeEffectOwnership: string;
  synthesizedVerdict: string;
}

export interface HermeticKybalionReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionFocus: KybalionQuestionFocus;
  masterPrinciple: {
    nameKo: string;
    nameEn: string;
    coreInsight: string;
    alchemicalKey: string;
  };
  principleAlignmentScore: number;
  rhythmPhase: '밀물(진전/확장기)' | '썰물(정리/내면화기)' | '전환점(진자 극점)';
  polarityTranscendence: {
    currentDuality: string;
    transcendenceShift: string;
  };
  cosmicPrinciples: HermeticPrincipleStatus[];
  situationalKybalionAudit: SituationalKybalionAudit;
  temporalPendulumRhythm: TemporalPendulumRhythm;
  kybalionSynthesisMatrix: KybalionSynthesisMatrix;
  hermeticWisdomDirective: string;
  interpretiveBoundary: string;
}

function detectKybalionFocus(question: string): KybalionQuestionFocus {
  const q = question.toLowerCase();
  if (/일|직장|사업|돈|재물|성과|시험|승진|이직/.test(q)) return 'career';
  if (/사람|관계|연애|가족|친구|갈등|상처|이별/.test(q)) return 'relationship';
  if (/불안|걱정|두려|초조|스트레스|우울|힘들/.test(q)) return 'anxiety';
  if (/선택|결정|방향|고민|시작|변화/.test(q)) return 'decision';
  return 'spiritual';
}

function buildSituationalKybalionAudit(
  focus: KybalionQuestionFocus,
  masterNameKo: string
): SituationalKybalionAudit {
  switch (focus) {
    case 'career':
      return {
        focus,
        kybalionMaxim: '《카이발리온》 제6원리 — "모든 원인에는 결과가 있고, 우연이란 아직 인식되지 않은 법칙의 이름일 뿐이다."',
        mentalAlchemyDiagnosis: `일과 성취의 국면에서 ${masterNameKo}가 작동하고 있습니다. 외부의 결과만 쫓기보다 내면에서 먼저 원인(Cause)을 설계해야 합니다.`,
        pendulumTrapWarning: '진자의 스윙을 무시한 채 단기 성과에만 집착하면 반작용의 썰물이 크게 돌아옵니다.',
        transmutationAction: '오늘 내가 통제할 수 있는 가장 명확한 원인 행동 하나를 정해 25분간 흔들림 없이 실행하세요.',
      };
    case 'relationship':
      return {
        focus,
        kybalionMaxim: '《카이발리온》 제2원리 — "안에서와 같이 밖에서도, 위에서와 같이 아래에서도 그러하다."',
        mentalAlchemyDiagnosis: `관계의 긴장은 상응과 극성의 원리가 비추는 거울입니다. ${masterNameKo}의 렌즈로 내면의 투사를 먼저 살펴야 합니다.`,
        pendulumTrapWarning: '상대의 극단적 태도에 같은 감정으로 맞서면 진자가 더 크게 요동칩니다.',
        transmutationAction: '상대에게 서운한 감정 대신 내가 원하는 평온의 극(Pole)으로 의식을 한 눈금 옮겨 대화를 여세요.',
      };
    case 'anxiety':
      return {
        focus,
        kybalionMaxim: '《카이발리온》 제4원리 — "모든 것은 양면성을 지니며, 반대되는 두 극단은 본질상 동일한 것의 정도 차이일 뿐이다."',
        mentalAlchemyDiagnosis: `지금의 불안은 용기·평온과 같은 선상의 반대 극단에 있을 뿐입니다. ${masterNameKo}가 극성 전환의 열쇠를 쥐고 있습니다.`,
        pendulumTrapWarning: '불안을 억지로 없애려 싸우면 오히려 그 감정에 에너지를 보태게 됩니다.',
        transmutationAction: '두려움이라는 말 대신 "준비 중"이라는 단어로 내면의 눈금을 이동시키고 3회 깊게 호흡하세요.',
      };
    case 'decision':
      return {
        focus,
        kybalionMaxim: '《카이발리온》 제1원리 — "만유는 마음이며, 우주는 정신적이다."',
        mentalAlchemyDiagnosis: `갈림길의 망설임은 외부 조건보다 내면의 정신적 상(Mental Image)이 아직 하나로 모이지 않았음을 뜻합니다.`,
        pendulumTrapWarning: '확신 없는 상태에서 남의 기준을 빌려 결정하면 리듬이 어긋납니다.',
        transmutationAction: '두 선택지를 놓고 1년 뒤 내 마음이 가장 맑고 떳떳할 쪽을 먼저 종이에 적어 보세요.',
      };
    case 'spiritual':
    default:
      return {
        focus: 'spiritual',
        kybalionMaxim: '《카이발리온》 제5원리 — "모든 것은 들고 나며 진자처럼 왕복한다. 현자는 중립화의 기술로 진자를 초월한다."',
        mentalAlchemyDiagnosis: `내면의 탐구는 ${masterNameKo}를 통해 일상의 크고 작은 파동 너머의 중심을 세우는 과정입니다.`,
        pendulumTrapWarning: '기분의 고저를 곧 내 삶의 가치로 착각하지 마세요.',
        transmutationAction: '하루 3분 조용히 앉아 생각과 감정의 진자가 흔들리는 모습을 한 걸음 물러나 관조하세요.',
      };
  }
}

function buildTemporalPendulumRhythm(
  targetDate: Date,
  rhythmPhase: HermeticKybalionReport['rhythmPhase']
): TemporalPendulumRhythm {
  const kstDate = new Date(targetDate.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  let pendulumWindow = '심야 내면화(Mentalism) 시간 (22:00~05:59)';
  let correspondenceAlignment = '외부 소음을 거두고 내면의 정신적 씨앗을 정돈하는 시간';
  let timingAdvice = '성급한 결론을 미루고 내일의 원인을 조용히 구상하세요.';

  if (kstHour >= 6 && kstHour < 12) {
    pendulumWindow = '오전 창조적 원인(Cause) 점화 시간 (06:00~11:59)';
    correspondenceAlignment = '새로운 의도가 현실의 질서로 상응하기 시작하는 상승 리듬';
    timingAdvice = '하루의 가장 중요한 결단과 첫 실행을 이 시간대에 배치하세요.';
  } else if (kstHour >= 12 && kstHour < 18) {
    pendulumWindow = '오후 능동적 실행(Gender-Yang) 시간 (12:00~17:59)';
    correspondenceAlignment = '생각이 구체적 행동과 소통으로 뻗어나가는 확장 리듬';
    timingAdvice = '일과 관계의 현안을 직면하고 주도적으로 조율하기 좋습니다.';
  } else if (kstHour >= 18 && kstHour < 22) {
    pendulumWindow = '저녁 극성 통합(Polarity) 시간 (18:00~21:59)';
    correspondenceAlignment = '낮의 긴장과 밤의 수용성이 균형을 이루는 중립화 리듬';
    timingAdvice = '감정의 찌꺼기를 씻어내고 수용적(음) 휴식으로 전환하세요.';
  }

  let seasonalPolarity = '겨울 응축(수용성 음) — 내면의 힘을 비축하고 뿌리를 단단히 내리는 계절';
  if (kstMonth >= 3 && kstMonth <= 5) {
    seasonalPolarity = '봄 발산(창조적 양) — 새로운 원인을 심고 리듬을 여는 계절';
  } else if (kstMonth >= 6 && kstMonth <= 8) {
    seasonalPolarity = '여름 정점(강한 양) — 열정을 절제하고 과열된 극성을 식히는 계절';
  } else if (kstMonth >= 9 && kstMonth <= 11) {
    seasonalPolarity = '가을 수확(균형 전환) — 원인과 결과의 결실을 거두고 본질을 추리는 계절';
  }

  return {
    kstHour,
    pendulumWindow,
    seasonalPolarity,
    correspondenceAlignment: `${correspondenceAlignment} (${rhythmPhase})`,
    timingAdvice,
  };
}

export function calculateHermeticKybalion(
  profile?: UserProfile | null,
  targetDate: Date = new Date(),
  question: string = ''
): HermeticKybalionReport {
  let birthSum = 7;
  let year = 1995;
  let month = 5;
  let day = 15;

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split(/[-./]/).map(p => parseInt(p, 10)).filter(n => !isNaN(n));
    if (parts.length >= 3) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
      birthSum = (year + month + day) % 9 || 9;
    }
  }

  const targetDay = targetDate.getDate();
  const targetMonth = targetDate.getMonth() + 1;
  const targetYear = targetDate.getFullYear();
  const dailyVibration = (targetYear + targetMonth + targetDay + birthSum) % 7;

  const principles: HermeticPrincipleStatus[] = [
    {
      nameEn: 'Mentalism',
      nameKo: '정신성의 원리',
      aphorism: '우주는 마음이며, 모든 현상은 생각의 투영이다.',
      alignmentScore: 70 + ((birthSum * 3 + targetDay) % 29),
      lifeApplication: '상황을 바꾸려 애쓰기보다 상황을 해석하는 내면의 신념 체계를 먼저 재설계하십시오.',
    },
    {
      nameEn: 'Correspondence',
      nameKo: '상응의 원리',
      aphorism: '위에서와 같이 아래에서도, 안에서와 같이 밖에서도 그러하다.',
      alignmentScore: 65 + ((birthSum * 5 + targetMonth) % 33),
      lifeApplication: '외부 환경의 혼란은 내면 무질서의 거울입니다. 방을 정리하고 호흡을 정돈하면 일도 풀립니다.',
    },
    {
      nameEn: 'Vibration',
      nameKo: '파동의 원리',
      aphorism: '어떤 것도 멈춰 있지 않으며 모든 것은 끊임없이 움직이고 변화한다.',
      alignmentScore: 75 + ((birthSum * 7 + targetYear) % 24),
      lifeApplication: '부정적 감정이 들 때는 억누르기보다 신체 활동과 긍정적인 언어로 마음의 방향을 전환하십시오.',
    },
    {
      nameEn: 'Polarity',
      nameKo: '극성의 원리',
      aphorism: '모든 것은 양면성을 가지며, 반대되는 것은 본질상 동일한 것의 양 극단이다.',
      alignmentScore: 68 + ((birthSum * 2 + targetDay * 2) % 31),
      lifeApplication: '두려움과 용기는 같은 감정의 양 극단입니다. 시선을 돌리듯 마음의 방향을 용기로 옮기십시오.',
    },
    {
      nameEn: 'Rhythm',
      nameKo: '리듬의 원리',
      aphorism: '진자의 왕복 운동은 모든 것에 나타나며, 밀물이 오면 썰물이 뒤따른다.',
      alignmentScore: 72 + ((birthSum * 4 + targetDay * 3) % 27),
      lifeApplication: '슬럼프나 침체기가 올 때 불안해하지 마십시오. 파도가 물러서는 것은 더 큰 도약을 준비하는 자연의 호흡입니다.',
    },
    {
      nameEn: 'Cause and Effect',
      nameKo: '원인과 결과의 원리',
      aphorism: '모든 원인에는 결과가 있고, 우연이란 발견되지 않은 법칙의 이름일 뿐이다.',
      alignmentScore: 80 + ((birthSum * 6 + targetMonth * 4) % 19),
      lifeApplication: '타인의 반응과 세상의 사건에 무력하게 끌려가지 말고, 당신 스스로 원인을 만드는 창조자가 되십시오.',
    },
    {
      nameEn: 'Gender',
      nameKo: '성별의 원리',
      aphorism: '모든 것에는 능동적 남성성(창조/행동)과 수용적 여성성(잉태/직관)이 공존한다.',
      alignmentScore: 66 + ((birthSum * 8 + targetDay * 5) % 32),
      lifeApplication: '목표를 향해 밀어붙이는 결단력(양)과 결과를 믿고 기다리는 수용성(음)의 황금 균형을 맞추십시오.',
    },
  ];

  const master = principles[dailyVibration];
  const rhythmScore = principles[4].alignmentScore;
  let rhythmPhase: '밀물(진전/확장기)' | '썰물(정리/내면화기)' | '전환점(진자 극점)';
  if (rhythmScore >= 85) rhythmPhase = '밀물(진전/확장기)';
  else if (rhythmScore <= 72) rhythmPhase = '썰물(정리/내면화기)';
  else rhythmPhase = '전환점(진자 극점)';

  const principleAlignmentScore = Math.round(principles.reduce((a, b) => a + b.alignmentScore, 0) / 7);

  const dualities = [
    { pair: '결핍감 vs 풍요의식', shift: '이미 가진 것에 집중하여 감사하는 마음으로 전환하십시오.' },
    { pair: '통제욕 vs 방임의 두려움', shift: '할 수 있는 최선에만 집중하고 결과는 우주의 흐름에 맡기십시오.' },
    { pair: '타인의 평가 vs 진정한 자기다움', shift: '외부의 시선에서 벗어나 내면의 고유한 직관에 귀를 기울이십시오.' },
    { pair: '과거의 후회 vs 미래의 불안', shift: '오직 현존(지금 이 순간)에 닻을 내림으로써 양 극단의 환영을 초월하십시오.' },
  ];
  const chosenDuality = dualities[birthSum % dualities.length];

  const questionFocus = detectKybalionFocus(question);
  const situationalKybalionAudit = buildSituationalKybalionAudit(questionFocus, master.nameKo);
  const temporalPendulumRhythm = buildTemporalPendulumRhythm(targetDate, rhythmPhase);

  const kybalionSynthesisMatrix: KybalionSynthesisMatrix = {
    overallAlignmentLabel:
      principleAlignmentScore >= 80
        ? '7대 우주 원리가 고르게 조응하여 정신 연금술 전환이 매끄러운 상태'
        : '특정 극성에 치우치기 쉬우므로 중립화(Neutralization) 관조가 필요한 상태',
    polarityIntegrationState: `[${chosenDuality.pair}]의 양극을 통합하는 과정`,
    causeEffectOwnership: '결과에 흔들리기보다 오늘의 원인 행동을 스스로 선택할 수 있는 주도권 보유',
    synthesizedVerdict: `${master.nameKo}와 ${temporalPendulumRhythm.pendulumWindow}이 맞물려, [${chosenDuality.shift}]를 실천할 때 리듬의 주도권을 회복합니다.`,
  };

  const kst = new Date(targetDate.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;

  return {
    engineVersion: HERMETIC_KYBALION_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    questionFocus,
    masterPrinciple: {
      nameKo: master.nameKo,
      nameEn: master.nameEn,
      coreInsight: master.aphorism,
      alchemicalKey: master.lifeApplication,
    },
    principleAlignmentScore,
    rhythmPhase,
    polarityTranscendence: {
      currentDuality: chosenDuality.pair,
      transcendenceShift: chosenDuality.shift,
    },
    cosmicPrinciples: principles,
    situationalKybalionAudit,
    temporalPendulumRhythm,
    kybalionSynthesisMatrix,
    hermeticWisdomDirective: `현재 당신의 에너지는 '${master.nameKo}'의 법칙 아래 움직이고 있습니다. 리듬은 '${rhythmPhase}' 국면이므로, ${rhythmPhase === '밀물(진전/확장기)' ? '주저하지 말고 의도를 선포하고 적극적으로 실행' : '무리한 확장 대신 내면의 배터리를 충전하고 다음 주기를 준비'}하십시오.`,
    interpretiveBoundary: '본 리포트는 《카이발리온》 7대 우주 원리 상징에 기반한 정성적 성찰 안내이며, 확정적 예언이 아닙니다.',
  };
}

export function formatHermeticKybalionPrompt(rep: HermeticKybalionReport): string {
  const principlesStr = rep.cosmicPrinciples
    .map(p => `• [${p.nameKo} (${p.nameEn})] ${p.aphorism}`)
    .join('\n');

  return `[헤르메스 카이발리온 7대 우주 불변 법칙 리포트 (The Kybalion Principles)]
- 엔진 버전: ${rep.engineVersion}
- 연산 시각: ${rep.calculatedAtKst}
- 현재 주도 우주 원리: ${rep.masterPrinciple.nameKo} (${rep.masterPrinciple.nameEn})
  • 핵심 통찰: "${rep.masterPrinciple.coreInsight}"
  • 정신 연금술 키: ${rep.masterPrinciple.alchemicalKey}
- 우주적 리듬 국면: ${rep.rhythmPhase} (${rep.kybalionSynthesisMatrix.overallAlignmentLabel})
- 극성 초월 과제: [${rep.polarityTranscendence.currentDuality}] → ${rep.polarityTranscendence.transcendenceShift}
- 질문 맥락 카이발리온 감사 (${rep.situationalKybalionAudit.focus}):
  • 원전 격언: ${rep.situationalKybalionAudit.kybalionMaxim}
  • 정신 연금 진단: ${rep.situationalKybalionAudit.mentalAlchemyDiagnosis}
  • 진자 함정 주의: ${rep.situationalKybalionAudit.pendulumTrapWarning}
  • 오늘의 전환 행동: ${rep.situationalKybalionAudit.transmutationAction}
- KST 진자 시공간 리듬 (${rep.temporalPendulumRhythm.pendulumWindow}):
  • 상응 상태: ${rep.temporalPendulumRhythm.correspondenceAlignment}
  • 계절 극성: ${rep.temporalPendulumRhythm.seasonalPolarity}
  • 시의성 지침: ${rep.temporalPendulumRhythm.timingAdvice}
- 7대 법칙 원전 목록:
${principlesStr}
- 카이발리온 교차 종합: ${rep.kybalionSynthesisMatrix.synthesizedVerdict}
- 행동 지침: ${rep.hermeticWisdomDirective}
- 해석 경계: 본 리포트는 《카이발리온》 7대 우주 원리 상징에 기반한 정성적 성찰 안내이며, 확정적 예언이 아닙니다.
※ 상담 시 수치 점수를 언급하지 말고, 내담자가 겪는 외적 고민을 '원인과 결과', '극성', '리듬' 등 우주 법칙의 상호작용 관점에서 조망해 주어 스스로 삶의 통제권을 회복하도록 이끌어주세요.`;
}
