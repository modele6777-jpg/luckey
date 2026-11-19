/**
 * 고대 인도 탄트라 스리 얀트라(Sri Yantra) 9대 나바요니 교차 삼각형 & 바인두(Bindu) 9단계 아바라나 우주 의식 각성 엔진
 *
 * LUCKEY-HINDU-SRI-YANTRA-v1.0.0
 *
 * 힌두 샤크티즘(Shaktism) 및 스리비드야(Sri Vidya) 비전 전통에서 '얀트라의 제왕(Yantra Raja)'으로 숭앙받는
 * 스리 얀트라(Sri Yantra / Sri Chakra)의 9개 교차 인터로킹 삼각형(Nava Yoni)과 43개 소삼각형,
 * 9단계 의식 차크라 회랑(Nava Avarana) 및 바인두(Bindu) 원초적 합일 수리 모델링 엔진.
 *
 * [핵심 수리 구조 및 비전 체계]
 * 1. 9대 나바요니 (Nava Yoni):
 *    - 4개의 위로 향하는 시바(Shiva) 삼각형: 불, 남성적 순수의식(Purusha), 상승하는 영적 불꽃
 *    - 5개의 아래로 향하는 샤크티(Shakti) 삼각형: 물, 여성적 우주 에너지(Prakriti), 하강하여 만물을 품는 은총
 *    - 9개 삼각형의 교차로 형성되는 43개의 소삼각형(우주 창조 장)
 * 2. 9단계 아바라나 (Nava Avarana, 외곽에서 중심 바인두로 수렴하는 9층 회랑):
 *    - 1. 트라이로키아 모하나 (Trailokya Mohana, 3계 매혹): 외곽 3중 정사각형 차파(Bhupura)
 *    - 2. 사르바 아샤 파리푸라카 (Sarva Asha Paripuraka, 모든 희망의 충족): 16연화 꽃잎
 *    - 3. 사르바 삼크쇼바나 (Sarva Samkshobhana, 미망의 진동 교정): 8연화 꽃잎
 *    - 4. 사르바 사우바기야 다야카 (Sarva Saubhagya Dayaka, 번영과 길상): 14삼각형 회랑
 *    - 5. 사르바 아르타 사다카 (Sarva Artha Sadhaka, 과업 성취): 10외삼각형
 *    - 6. 사르바 락샤카라 (Sarva Rakshakara, 완전한 수호): 10내삼각형
 *    - 7. 사르바 로가하라 (Sarva Rogahara, 모든 고통 치유): 8삼각형
 *    - 8. 사르바 시디프라다 (Sarva Siddhiprada, 영적 성취): 1중앙 정삼각형
 *    - 9. 사르바 아난다마야 (Sarva Anandamaya, 최상 지복): 중심점 바인두 (시바-샤크티 합일)
 */

import type { UserProfile } from '../sharedState';

export const SRI_YANTRA_ENGINE_VERSION = '2.3.0';

export interface SriYantraSacredGeometryReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  // 시바-샤크티 극성 밸런스
  shivaAscendingConsciousnessScore: number; // 4 시바 삼각형 상승 순수의식 (0~100)
  shaktiDescendingGraceScore: number; // 5 샤크티 삼각형 하강 창조은총 (0~100)
  navaYoniInterlockingHarmony: number; // 9 나바요니 교차 조화율 (0~100)
  // 바인두 및 아바라나 층위
  binduTranscendentalAwakeningScore: number; // 바인두(Bindu) 중심합일 각성도 (0~100)
  primaryAvaranaChakra: {
    level: number;
    sanskritName: string;
    koreanTitle: string;
    archetypalPower: string;
    blessingAdvice: string;
  };
  secondaryAvaranaChakra: {
    level: number;
    sanskritName: string;
    koreanTitle: string;
    archetypalPower: string;
    blessingAdvice: string;
  };
  interpretiveBoundary: string;
  // 마하비드야 축복 지표
  sarvaArthaManifestationIndex: number; // 물질적·현실적 번영 달성력 (0~100)
  sarvaRogaharaHealingPower: number; // 심신 번뇌 치유력 (0~100)
  sarvaAnandamayaBlissAlignment: number; // 우주적 환희 및 내적 평온도 (0~100)
  sacredGeometryMeditationGuidance: string;
  situationalSriYantraAudit: {
    questionFocus: string;
    polarityBalanceNote: string;
    avaranaEntryStep: string;
  };
  temporalSriYantraRhythm: {
    calculatedAtKst: string;
    brahmaMuhurtaWindow: string;
    seasonalShaktiPhase: string;
    yantraFocusNote: string;
  };
  sriYantraSynthesisMatrix: {
    coreMandate: string;
    sacredBoundary: string;
    reflectiveQuestion: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const SRI_AVARANA_CIRCUITS = [
  {
    level: 1,
    sanskritName: 'Trailokya Mohana',
    koreanTitle: '트라이로키아 모하나 (세상의 미혹을 다스리는 외곽의 성채)',
    archetypalPower: '감각적 혼란과 세상의 소음을 단호히 차단하고 자기 내면의 거룩한 영토를 수호함',
    blessingAdvice: '외부의 잡음과 비교에서 한 걸음 물러나 기초 규율과 일상의 질서를 반듯하게 세우십시오.',
  },
  {
    level: 2,
    sanskritName: 'Sarva Asha Paripuraka',
    koreanTitle: '사르바 아샤 파리푸라카 (16연화의 모든 소원 충족)',
    archetypalPower: '내면에 품은 순수한 열망과 희망이 때맞추어 영양을 공급받고 꽃피어남',
    blessingAdvice: '진정으로 바라는 핵심 목표를 명확히 언어화하십시오. 우주의 풍요가 준비되어 있습니다.',
  },
  {
    level: 3,
    sanskritName: 'Sarva Samkshobhana',
    koreanTitle: '사르바 삼크쇼바나 (8연화의 감정 정화와 동요 안정)',
    archetypalPower: '마음속 억압된 분노와 불안의 진동을 부드럽게 용해하고 감정의 평정을 이룸',
    blessingAdvice: '마음의 동요를 억누르지 말고 조용히 관찰하십시오. 진동이 잦아들며 맑은 호수가 드러납니다.',
  },
  {
    level: 4,
    sanskritName: 'Sarva Saubhagya Dayaka',
    koreanTitle: '사르바 사우바기야 다야카 (14삼각형의 복락과 풍요)',
    archetypalPower: '인연과 재물, 건강의 모든 방면에서 막힘없는 우주적 행운의 조력이 유입됨',
    blessingAdvice: '스스로의 가능성을 제약하지 마십시오. 협력자들과 열린 마음으로 나누면 복이 배가됩니다.',
  },
  {
    level: 5,
    sanskritName: 'Sarva Artha Sadhaka',
    koreanTitle: '사르바 아르타 사다카 (10삼각형의 과업 성취와 결실)',
    archetypalPower: '기획하고 준비해 온 과업이 구체적이고 현실적인 성공의 열매로 결실함',
    blessingAdvice: '미뤄둔 핵심 프로젝트에 집중적인 실행력을 투입하십시오. 결실을 거두기에 가장 좋은 시기입니다.',
  },
  {
    level: 6,
    sanskritName: 'Sarva Rakshakara',
    koreanTitle: '사르바 락샤카라 (10내삼각형의 완전한 수호와 액운 방어)',
    archetypalPower: '보이지 않는 음해와 에너지 뱀파이어, 부정적 기운을 철벽처럼 차단하는 영적 방패',
    blessingAdvice: '부정적인 사람이나 낭비적인 환경에 휘둘리지 마십시오. 당신의 경계는 확고히 보호받고 있습니다.',
  },
  {
    level: 7,
    sanskritName: 'Sarva Rogahara',
    koreanTitle: '사르바 로가하라 (8삼각형의 완전한 치유와 회복)',
    archetypalPower: '육체적 피로와 정신적 트라우마를 근원적으로 소생시키는 샤크티 치유 광선',
    blessingAdvice: '충분한 수면과 자연과의 접촉으로 심신을 재충전하십시오. 오래된 피로가 씻겨 나갑니다.',
  },
  {
    level: 8,
    sanskritName: 'Sarva Siddhiprada',
    koreanTitle: '사르바 시디프라다 (삼모(三母) 정삼각형의 영적 직관과 초월)',
    archetypalPower: '사물의 숨겨진 맥락을 꿰뚫어 보는 투명한 직관력과 창조적 영감의 폭발',
    blessingAdvice: '논리적 분석 너머의 직관적 영감(Aha-moment)을 신뢰하십시오. 그것이 진정한 해답입니다.',
  },
  {
    level: 9,
    sanskritName: 'Sarva Anandamaya',
    koreanTitle: '사르바 아난다마야 (바인두 중심점의 무조건적 지복과 합일)',
    archetypalPower: '주체와 객체의 분리를 초월하여 우주 전체와 온전히 하나가 되는 최고의 영적 환희',
    blessingAdvice: '모든 애씀과 투쟁을 멈추고 현존(Present Moment)의 완전함 속에 편안히 안식하십시오.',
  },
];

export function calculateHinduSriYantraSacredGeometry(
  profile?: UserProfile | null,
  nowArg?: Date,
  questionArg?: string
): SriYantraSacredGeometryReport {
  const now = nowArg || new Date();
  const question = (questionArg || '').trim();
  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const seedStr = `${bdate}_${btime}_${name}_${question || 'sri_yantra_v2'}`;
  const seed = djb2Hash(seedStr);

  const shivaAscendingConsciousnessScore = 65 + (seed % 34);
  const shaktiDescendingGraceScore = 63 + ((seed >> 2) % 36);
  const navaYoniInterlockingHarmony = Math.round(
    100 - Math.abs(shivaAscendingConsciousnessScore - shaktiDescendingGraceScore) * 1.2
  );

  const binduTranscendentalAwakeningScore = 66 + ((seed >> 4) % 33);
  const sarvaArthaManifestationIndex = 62 + ((seed >> 6) % 37);
  const sarvaRogaharaHealingPower = 64 + ((seed >> 8) % 35);
  const sarvaAnandamayaBlissAlignment = Math.round(
    (binduTranscendentalAwakeningScore * 0.4) +
    (sarvaRogaharaHealingPower * 0.3) +
    (navaYoniInterlockingHarmony * 0.3)
  );

  const avaranaIndex = (seed >> 3) % SRI_AVARANA_CIRCUITS.length;
  const secondaryAvaranaIndex = (avaranaIndex + 1 + ((seed >> 5) % (SRI_AVARANA_CIRCUITS.length - 1))) % SRI_AVARANA_CIRCUITS.length;
  const primaryAvaranaChakra = SRI_AVARANA_CIRCUITS[avaranaIndex];
  const secondaryAvaranaChakra = SRI_AVARANA_CIRCUITS[secondaryAvaranaIndex];

  let sacredGeometryMeditationGuidance = '';
  if (navaYoniInterlockingHarmony >= 85) {
    sacredGeometryMeditationGuidance = '시바(의식)와 샤크티(에너지)의 교차 삼각형이 완전한 황금비율을 이루고 있습니다. 안과 밖이 하나로 호응하니 원하는 바를 마음껏 펼치십시오.';
  } else if (shivaAscendingConsciousnessScore > shaktiDescendingGraceScore) {
    sacredGeometryMeditationGuidance = '위로 향하는 시바의 불꽃이 강렬하여 목표 의식과 분석력이 높습니다. 다만 대지처럼 품어주는 샤크티의 수용성과 온기를 함께 길러내십시오.';
  } else {
    sacredGeometryMeditationGuidance = '만물을 품는 샤크티의 감성과 풍요가 넘쳐납니다. 이를 구체적인 현실의 틀로 고정할 시바의 명확한 규율과 구조적 결단을 보강하십시오.';
  }

  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(kstMs);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;
  const calculatedAtKst = `${kstDate.getUTCFullYear()}-${String(kstMonth).padStart(2, '0')}-${String(kstDate.getUTCDate()).padStart(2, '0')} ${String(kstHour).padStart(2, '0')}:${String(kstDate.getUTCMinutes()).padStart(2, '0')} +09:00 (KST)`;

  const qLower = question.toLowerCase();
  const questionFocus = /연애|사랑|관계|결혼|재회|감정/.test(qLower)
    ? '샤크티 하강 은총과 3층 삼크쇼바나 감정 정화 감사'
    : /일|직장|사업|돈|재물|성취|목표/.test(qLower)
    ? '사르바 아르타(과업 성취) 회랑과 시바 구조적 결단 감사'
    : /건강|치유|피로|수면|불안|마음/.test(qLower)
    ? '사르바 로가하라(고통 치유) 회랑과 바인두 고요 합일 감사'
    : '나바요니(9삼각형) 시바-샤크티 교차 조화 감사';

  const polarityBalanceNote = navaYoniInterlockingHarmony >= 85
    ? '시바의 순수의식과 샤크티의 창조은총이 황금비율로 맞물린 합일 국면'
    : shivaAscendingConsciousnessScore > shaktiDescendingGraceScore
    ? '시바 상승 의식이 우세해 분석·결단은 날카로우나 샤크티의 수용성 보완이 필요한 국면'
    : '샤크티 하강 은총이 풍부하나 시바의 명확한 구조와 실행 경계가 필요한 국면';

  const avaranaEntryStep = `제${primaryAvaranaChakra.level}층 ${primaryAvaranaChakra.koreanTitle} 관문 통과 중`;

  const brahmaMuhurtaWindow = kstHour >= 4 && kstHour < 9
    ? '브라흐마 무후르타·아침 바인두 응시 창(외부 소음을 끊고 순수 의식의 중심을 잡기에 최적)'
    : kstHour >= 9 && kstHour < 17
    ? '낮 사르바 아르타 현실 현현 창(얀트라의 구조적 힘을 실무와 행동으로 구현하기에 최적)'
    : kstHour >= 17 && kstHour < 22
    ? '황혼 사르바 로가하라 치유 창(하루의 긴장과 번뇌를 정화하고 감정을 가라앉히기에 최적)'
    : '심야 아난다마야 합일 창(애씀을 멈추고 바인두의 고요 속에 안식하기에 최적)';

  const seasonalShaktiPhase = kstMonth >= 3 && kstMonth <= 5
    ? '춘계 나바라트리 창조 개화기(새로운 열망과 씨앗이 꽃피어나는 주기)'
    : kstMonth >= 6 && kstMonth <= 8
    ? '하계 테자스(Tejas) 광명기(강렬한 실행력으로 과업을 돌파하는 주기)'
    : kstMonth >= 9 && kstMonth <= 11
    ? '추계 스리비드야 수확·성숙기(직관과 현실 결실이 하나로 모이는 주기)'
    : '동계 바인두 심연 응축기(내면 성채를 수호하며 힘을 축적하는 주기)';

  const yantraFocusNote = `${brahmaMuhurtaWindow}과 ${seasonalShaktiPhase}가 교차하므로, ${primaryAvaranaChakra.blessingAdvice}`;

  const interpretiveBoundary = '힌두 탄트라 스리 얀트라 관점은 초자연적 예단이나 심리 진단이 아니라, 이성(시바)과 수용성(샤크티)의 중심 균형을 비추는 기하학 명상 렌즈입니다.';
  const sriYantraSynthesisMatrix = {
    coreMandate: `[제${primaryAvaranaChakra.level}층 ${primaryAvaranaChakra.sanskritName}] 회랑을 중심으로 ${questionFocus}을 수행하십시오.`,
    sacredBoundary: '시바(이성)와 샤크티(감성) 중 한쪽으로 치우친 극단적 판단을 경계하고, 바인두 중심의 고요에서 답을 구하십시오.',
    reflectiveQuestion: question
      ? `'${question}'의 소용돌이 속에서 제${primaryAvaranaChakra.level}층(${primaryAvaranaChakra.sanskritName})과 바인두가 비추는 흔들리지 않는 중심은 어디에 있나요?`
      : `지금 내 삶의 소용돌이 한가운데서 흔들리지 않는 고요한 중심점(바인두)은 어디에 있나요?`,
  };

  const ritualAction = `[제${primaryAvaranaChakra.level}층 ${primaryAvaranaChakra.sanskritName} · 바인두 응시] ${primaryAvaranaChakra.blessingAdvice}`;
  const reflectionFocus = sriYantraSynthesisMatrix.reflectiveQuestion;

  return {
    engineVersion: SRI_YANTRA_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    shivaAscendingConsciousnessScore,
    shaktiDescendingGraceScore,
    navaYoniInterlockingHarmony,
    binduTranscendentalAwakeningScore,
    primaryAvaranaChakra,
    secondaryAvaranaChakra,
    interpretiveBoundary,
    sarvaArthaManifestationIndex,
    sarvaRogaharaHealingPower,
    sarvaAnandamayaBlissAlignment,
    sacredGeometryMeditationGuidance,
    situationalSriYantraAudit: {
      questionFocus,
      polarityBalanceNote,
      avaranaEntryStep,
    },
    temporalSriYantraRhythm: {
      calculatedAtKst,
      brahmaMuhurtaWindow,
      seasonalShaktiPhase,
      yantraFocusNote,
    },
    sriYantraSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatHinduSriYantraSacredGeometryPrompt(report: SriYantraSacredGeometryReport): string {
  return [
    `[힌두 탄트라 스리 얀트라(Sri Yantra) 9대 나바요니 & 바인두 신성기하학 엔진 v${report.engineVersion}]`,
    `- 기준 시각(KST): ${report.temporalSriYantraRhythm.calculatedAtKst}`,
    `- 질문 맥락 & 극성 감사: ${report.situationalSriYantraAudit.questionFocus} | ${report.situationalSriYantraAudit.polarityBalanceNote}`,
    `- 활성화 아바라나(Avarana) 회랑: [제${report.primaryAvaranaChakra.level}층] ${report.primaryAvaranaChakra.koreanTitle} (${report.primaryAvaranaChakra.sanskritName})`,
    `  * 신성 원형 힘: ${report.primaryAvaranaChakra.archetypalPower}`,
    `  * 수행 축복 조언: ${report.primaryAvaranaChakra.blessingAdvice}`,
    `- 보조 교차 회랑: [제${report.secondaryAvaranaChakra.level}층] ${report.secondaryAvaranaChakra.koreanTitle} (${report.secondaryAvaranaChakra.sanskritName}) — ${report.secondaryAvaranaChakra.blessingAdvice}`,
    `- 시공간 리듬: ${report.temporalSriYantraRhythm.brahmaMuhurtaWindow} · ${report.temporalSriYantraRhythm.seasonalShaktiPhase}`,
    `- 신성 기하학 명상 지침: ${report.sacredGeometryMeditationGuidance}`,
    `- 교차 매트릭스: ${report.sriYantraSynthesisMatrix.coreMandate} | 경계: ${report.sriYantraSynthesisMatrix.sacredBoundary} | 성찰 질문: "${report.sriYantraSynthesisMatrix.reflectiveQuestion}"`,
    `- 실천 의례(Ritual Action): ${report.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${report.reflectionFocus}`,
    `- 해석 경계: ${report.interpretiveBoundary}`,
  ].join('\n');
}
