/**
 * 고대 인도 베단타 5대 코샤(Pancha Kosha) 층위별 정렬 & 아트만 해방 엔진 (Pancha Kosha Realignment Engine)
 *
 * 타이티리야 우파니샤드(Taittiriya Upanishad)에 기록된 인간 존재의 5대 칼집(자루):
 * 1. 안나마야 코샤 (육체/음식체)
 * 2. 프라나마야 코샤 (에너지/호흡체)
 * 3. 마노마야 코샤 (정서/마음체)
 * 4. 비즈냐나마야 코샤 (지성/직관체)
 * 5. 아난다마야 코샤 (영혼/지고의 지복체)
 * 질문 맥락 병목 진단, KST 프라나 시공간 리듬, 상하층 코샤 브리지 매트릭스를 통합합니다.
 */

export const VEDIC_PANCHA_KOSHA_ENGINE_VERSION = 'LUCKEY-PANCHA-KOSHA-v2.5.0';

export interface KoshaLayer {
  layerIndex: number;
  koshaNameKo: string;
  koshaNameSanskrit: string;
  dimension: string;
  alignmentScore: number; // 0 ~ 100
  blockageSymptom: string;
  clearingAction: string;
}

export interface QuestionKoshaResonance {
  focusLayerIndex: number;
  focusKoshaKo: string;
  upanishadMantra: string;
  reflectionQuestion: string;
}

export interface TemporalPranaRhythm {
  kstHour: number;
  doshaWindowKo: string;
  recommendedPranayama: string;
  rhythmGuidance: string;
}

export interface KoshaBridgeMatrix {
  lowerSupportLayerKo: string;
  upperAspirationLayerKo: string;
  bridgeBalanceScore: number;
  integrationPrescription: string;
}

export interface PanchaKoshaReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  layers: KoshaLayer[];
  lowestAlignedLayer: KoshaLayer;
  atmanRealizationIndex: number; // 0 ~ 100
  questionKoshaResonance: QuestionKoshaResonance;
  temporalPranaRhythm: TemporalPranaRhythm;
  koshaBridgeMatrix: KoshaBridgeMatrix;
  blissPrescription: string;
  panchaKoshaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
}

function classifyQuestionKosha(question: string, fallbackLayerIdx: number): QuestionKoshaResonance {
  const q = question.toLowerCase();

  if (/(몸|건강|피로|수면|잠|아프|식사|운동|컨디션|체력)/.test(q)) {
    return {
      focusLayerIndex: 1,
      focusKoshaKo: '안나마야 코샤 (육체/음식체)',
      upanishadMantra: '《타이티리야 우파니샤드》 — "모든 존재는 음식(Anna)에서 태어나 음식으로 자라며 그 안에서 쉰다."',
      reflectionQuestion: '지금 내 몸이 보내는 뻐근함과 피로의 신호를 무시하고, 생각으로만 문제를 밀어붙이고 있지는 않나요?',
    };
  }
  if (/(무기력|활력|숨|호흡|긴장|답답|에너지|지침|번아웃)/.test(q)) {
    return {
      focusLayerIndex: 2,
      focusKoshaKo: '프라나마야 코샤 (생명력/호흡체)',
      upanishadMantra: '《타이티리야 우파니샤드》 — "생명기운(Prana)은 육체 안을 흐르며 모든 감각에 생명의 불꽃을 지핀다."',
      reflectionQuestion: '어깨에 힘을 빼고 복부 깊숙이 숨을 세 번만 채워도, 지금 당장 급해 보였던 긴장이 얼마나 가라앉나요?',
    };
  }
  if (/(감정|불안|사랑|연애|관계|상처|분노|슬픔|걱정|마음)/.test(q)) {
    return {
      focusLayerIndex: 3,
      focusKoshaKo: '마노마야 코샤 (감정/마음체)',
      upanishadMantra: '《마이트리 우파니샤드》 — "마음이 묶이면 속박이요, 마음이 고요해지면 곧 해방이다."',
      reflectionQuestion: '지금 느끼는 감정이 사실 자체인지, 아니면 과거의 기억이 덧씌운 해석인지 한 발 물러서서 바라볼 수 있나요?',
    };
  }
  if (/(결정|선택|진로|일|공부|통찰|지혜|이직|사업|방향)/.test(q)) {
    return {
      focusLayerIndex: 4,
      focusKoshaKo: '비즈냐나마야 코샤 (지성/직관체)',
      upanishadMantra: '《타이티리야 우파니샤드》 — "식별의 지성(Vijnana)은 옳고 그름을 가르고 내면의 신성한 질서를 따른다."',
      reflectionQuestion: '남들의 기준이나 눈앞의 유불리를 걷어냈을 때, 내 안의 고요한 직관(Buddhi)은 이미 어떤 답을 가리키고 있나요?',
    };
  }
  if (/(의미|행복|고독|인생|평화|영혼|감사|본질)/.test(q)) {
    return {
      focusLayerIndex: 5,
      focusKoshaKo: '아난다마야 코샤 (지고의 지복체)',
      upanishadMantra: '《타이티리야 우파니샤드》 — "존재의 가장 깊은 중심은 기쁨(Ananda)이며, 모든 생명체는 그 기쁨에서 호흡한다."',
      reflectionQuestion: '무언가를 더 성취해야만 행복할 것이라는 조건을 잠시 떼어놓으면, 이미 지금 여기에서 누릴 수 있는 평화는 무엇인가요?',
    };
  }

  const defaults: QuestionKoshaResonance[] = [
    {
      focusLayerIndex: 1,
      focusKoshaKo: '안나마야 코샤 (육체/음식체)',
      upanishadMantra: '《타이티리야 우파니샤드》 — "모든 존재는 음식(Anna)에서 태어나 음식으로 자라며 그 안에서 쉰다."',
      reflectionQuestion: '오늘 내 몸이 가장 원하고 있는 소박한 돌봄(물 한 잔, 스트레칭, 일찍 눕기)은 무엇인가요?',
    },
    {
      focusLayerIndex: 2,
      focusKoshaKo: '프라나마야 코샤 (생명력/호흡체)',
      upanishadMantra: '《타이티리야 우파니샤드》 — "생명기운(Prana)은 육체 안을 흐르며 모든 감각에 생명의 불꽃을 지핀다."',
      reflectionQuestion: '얕아진 호흡을 천천히 내쉬면서, 굳어 있던 생기의 흐름을 어디부터 다시 열어 줄 수 있을까요?',
    },
    {
      focusLayerIndex: 3,
      focusKoshaKo: '마노마야 코샤 (감정/마음체)',
      upanishadMantra: '《마이트리 우파니샤드》 — "마음이 묶이면 속박이요, 마음이 고요해지면 곧 해방이다."',
      reflectionQuestion: '마음속에 반복되는 걱정 한 가지를 판단 없이 이름 붙여 바라보면 어떤 감정인가요?',
    },
    {
      focusLayerIndex: 4,
      focusKoshaKo: '비즈냐나마야 코샤 (지성/직관체)',
      upanishadMantra: '《타이티리야 우파니샤드》 — "식별의 지성(Vijnana)은 옳고 그름을 가르고 내면의 신성한 질서를 따른다."',
      reflectionQuestion: '고정관념을 비우고 한 단계 높은 시선에서 오늘의 상황을 조망하면 어떤 길이 보이나요?',
    },
    {
      focusLayerIndex: 5,
      focusKoshaKo: '아난다마야 코샤 (지고의 지복체)',
      upanishadMantra: '《타이티리야 우파니샤드》 — "존재의 가장 깊은 중심은 기쁨(Ananda)이며, 모든 생명체는 그 기쁨에서 호흡한다."',
      reflectionQuestion: '외부 조건과 무관하게 내면 깊은 곳에 자리한 고요한 만족감을 떠올려 보세요.',
    },
  ];

  return defaults[(fallbackLayerIdx - 1 + defaults.length) % defaults.length];
}

function computeTemporalPranaRhythm(now: Date): TemporalPranaRhythm {
  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const kstHour = kst.getUTCHours();

  if (kstHour >= 4 && kstHour < 10) {
    return {
      kstHour,
      doshaWindowKo: '아침 · 브라흐마 무후르타 ~ 카파 각성기',
      recommendedPranayama: '카팔라바티(맑은 두개골 호흡) 또는 깊은 복식 호흡 3분',
      rhythmGuidance: '육체(안나마야)와 호흡(프라나마야)을 깨워 하루의 탁한 기운을 비우고 직관의 창을 여는 시간입니다.',
    };
  }
  if (kstHour >= 10 && kstHour < 18) {
    return {
      kstHour,
      doshaWindowKo: '낮 · 피타 활동 및 지성 발현기',
      recommendedPranayama: '나디 쇼다나(좌우 교대 비강 호흡) 5회 순환',
      rhythmGuidance: '과열되기 쉬운 감정(마노마야)과 판단(비즈냐나마야)의 균형을 맞추어 명료하게 실행할 때입니다.',
    };
  }
  return {
    kstHour,
    doshaWindowKo: '저녁·밤 · 바타 진정 및 지복체 회귀기',
    recommendedPranayama: '4-7-8 이완 호흡 또는 브라마리(벌 소리 명상 호흡)',
    rhythmGuidance: '낮의 감각 자극을 거두고 가장 깊은 아난다마야 코샤의 평온 속으로 몸과 마음을 내려놓을 시간입니다.',
  };
}

export function calculateVedicPanchaKosha(params: {
  profile?: any;
  question?: string;
  now?: Date;
}): PanchaKoshaReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 29);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 47;
  }
  seed += now.getDate() * 41 + now.getMonth() * 79;

  const rawScores = [
    68 + (Math.abs(seed * 3) % 31),
    65 + (Math.abs(seed * 5) % 33),
    62 + (Math.abs(seed * 7) % 35),
    70 + (Math.abs(seed * 11) % 29),
    74 + (Math.abs(seed * 13) % 25),
  ];

  const layers: KoshaLayer[] = [
    {
      layerIndex: 1,
      koshaNameKo: '안나마야 코샤 (육체/음식체)',
      koshaNameSanskrit: 'Annamaya Kosha',
      dimension: '물리적 신체, 근육, 뼈, 수면 및 영양 상태',
      alignmentScore: rawScores[0],
      blockageSymptom: '신체적 피로 누적, 목과 어깨의 뭉침, 불규칙한 식사',
      clearingAction: '따뜻한 온수로 수분을 공급하고 가벼운 스트레칭과 정갈한 식사를 실천하세요.',
    },
    {
      layerIndex: 2,
      koshaNameKo: '프라나마야 코샤 (생명력/호흡체)',
      koshaNameSanskrit: 'Pranamaya Kosha',
      dimension: '호흡의 깊이, 활력(Prana) 순환, 기혈 소통',
      alignmentScore: rawScores[1],
      blockageSymptom: '얕은 가슴 호흡, 가슴 답답함, 오후의 무기력증',
      clearingAction: '복식 호흡과 4초 들이쉬고 4초 내쉬는 박스 호흡으로 프라나를 재충전하세요.',
    },
    {
      layerIndex: 3,
      koshaNameKo: '마노마야 코샤 (감정/마음체)',
      koshaNameSanskrit: 'Manomaya Kosha',
      dimension: '감정 반응, 불안과 두려움, 감각적 욕구',
      alignmentScore: rawScores[2],
      blockageSymptom: '타인의 시선에 대한 과도한 신경, 잡념과 감정 기복',
      clearingAction: '감정을 억누르지 말고 있는 그대로 바라보며 5분간 마음을 비우는 침묵을 가지세요.',
    },
    {
      layerIndex: 4,
      koshaNameKo: '비즈냐나마야 코샤 (지성/직관체)',
      koshaNameSanskrit: 'Vijnanamaya Kosha',
      dimension: '식별력(Buddhi), 에고 초월, 통찰과 지혜',
      alignmentScore: rawScores[3],
      blockageSymptom: '흑백논리적 사고, 과거 경험에 기인한 고정관념',
      clearingAction: '판단을 잠시 멈추고 더 넓은 관점에서 문제의 이면을 통찰하는 직관을 깨우세요.',
    },
    {
      layerIndex: 5,
      koshaNameKo: '아난다마야 코샤 (지고의 지복체)',
      koshaNameSanskrit: 'Anandamaya Kosha',
      dimension: '우주와의 하나 됨, 무조건적 평화와 지복(Ananda)',
      alignmentScore: rawScores[4],
      blockageSymptom: '분리감, 근원적 고독, 삶에 대한 회의감',
      clearingAction: '조건 없는 감사의 마음을 품고 이미 내면에 충만한 신성한 평화를 기억하세요.',
    },
  ];

  let lowestAlignedLayer = layers[0];
  for (const l of layers) {
    if (l.alignmentScore < lowestAlignedLayer.alignmentScore) {
      lowestAlignedLayer = l;
    }
  }

  const questionKoshaResonance = classifyQuestionKosha(question, lowestAlignedLayer.layerIndex);
  const temporalPranaRhythm = computeTemporalPranaRhythm(now);

  const lowIdx = lowestAlignedLayer.layerIndex - 1;
  const lowerSupport = layers[Math.max(0, lowIdx - 1)];
  const upperAspiration = layers[Math.min(layers.length - 1, lowIdx + 1)];
  const bridgeBalanceScore = Math.round((lowerSupport.alignmentScore + upperAspiration.alignmentScore) / 2);

  const koshaBridgeMatrix: KoshaBridgeMatrix = {
    lowerSupportLayerKo: lowerSupport.koshaNameKo,
    upperAspirationLayerKo: upperAspiration.koshaNameKo,
    bridgeBalanceScore,
    integrationPrescription: `[${lowestAlignedLayer.koshaNameKo}]를 회복하기 위해 아래층 [${lowerSupport.koshaNameKo}]로 바닥을 다지고, 위층 [${upperAspiration.koshaNameKo}]의 통찰로 시야를 여세요.`,
  };

  const atmanRealizationIndex = Math.round(layers.reduce((sum, l) => sum + l.alignmentScore, 0) / layers.length);
  const blissPrescription = `현재 5대 코샤 중 [${lowestAlignedLayer.koshaNameKo}]의 정렬이 가장 시급합니다. '${lowestAlignedLayer.clearingAction}'을 즉시 실행하여 거친 외피를 정화하고, 가장 깊은 곳의 참된 자아(Atman)의 환희를 해방하세요.`;

  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;
  const trimmedQ = question.trim();
  const panchaKoshaSynthesisMatrix = {
    dominantTension: `${lowestAlignedLayer.koshaNameKo} ↔ ${questionKoshaResonance.focusKoshaKo}`,
    alignmentState: `${temporalPranaRhythm.doshaWindowKo} · ${koshaBridgeMatrix.lowerSupportLayerKo} → ${koshaBridgeMatrix.upperAspirationLayerKo}`,
    integratedAction: `${lowestAlignedLayer.clearingAction}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  const reflectiveQuestion = trimmedQ
    ? `'${trimmedQ}' 앞에서 지금 가장 돌봄이 필요한 ${lowestAlignedLayer.koshaNameKo} 층위를 위해 오늘 3분만 내어 줄 수 있는 호흡은 무엇인가요?`
    : questionKoshaResonance.reflectionQuestion;
  const ritualAction = `${temporalPranaRhythm.recommendedPranayama}으로 호흡을 고른 뒤, ${lowestAlignedLayer.clearingAction}`;
  const reflectionFocus = `${lowestAlignedLayer.koshaNameKo} 정화와 ${questionKoshaResonance.focusKoshaKo} 사이의 에너지 정렬`;

  return {
    engineVersion: VEDIC_PANCHA_KOSHA_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    layers,
    lowestAlignedLayer,
    atmanRealizationIndex,
    questionKoshaResonance,
    temporalPranaRhythm,
    koshaBridgeMatrix,
    blissPrescription,
    panchaKoshaSynthesisMatrix,
    reflectiveQuestion,
    interpretiveBoundary: '베단타 5대 코샤 정렬 결과는 타이티리야 우파니샤드 철학에 기반한 자기 성찰·호흡 안내이며, 의학적 진단이나 확정적 예단이 아닙니다.',
    ritualAction,
    reflectionFocus,
  };
}

function describeKoshaAlignmentStage(index: number): string {
  if (index >= 84) return '아트만 투명 공명기 (다섯 겹의 칼집이 고르게 열려 내면의 평화가 선명한 국면)';
  if (index >= 72) return '프라나 순환 정돈기 (긴장된 층위를 호흡과 휴식으로 부드럽게 풀어주는 국면)';
  return '기초 칼집 회복기 (몸과 감정의 피로를 먼저 다독여 바닥을 단단히 세울 국면)';
}

export function formatVedicPanchaKoshaPrompt(report: PanchaKoshaReport): string {
  const low = report.lowestAlignedLayer;
  const matrixLine = report.panchaKoshaSynthesisMatrix
    ? `\n- **5대 코샤 교차 매트릭스**: 핵심 긴장(${report.panchaKoshaSynthesisMatrix.dominantTension}) · 조율 상태(${report.panchaKoshaSynthesisMatrix.alignmentState}) · 통합 실천(${report.panchaKoshaSynthesisMatrix.integratedAction})`
    : '';
  return `### 🕉️ 고대 인도 베단타 5대 코샤(Pancha Kosha) 층위별 정렬 정성 리포트 (${report.engineVersion})
- **연산 시각**: ${report.calculatedAtKst}
- **아트만(Atman) 정렬 위상**: ${describeKoshaAlignmentStage(report.atmanRealizationIndex)}
- **가장 보살핌이 필요한 칼집 층위**: 제${low.layerIndex}층 [${low.koshaNameKo}] — 신호: ${low.blockageSymptom}
- **질문 맥락 코샤 공명 (제${report.questionKoshaResonance.focusLayerIndex}층 · ${report.questionKoshaResonance.focusKoshaKo})**:
  - 우파니샤드 경구: ${report.questionKoshaResonance.upanishadMantra}
  - 성찰 질문: ${report.questionKoshaResonance.reflectionQuestion}
- **KST 프라나 시공간 리듬 (${report.temporalPranaRhythm.doshaWindowKo})**:
  - 권장 호흡법: ${report.temporalPranaRhythm.recommendedPranayama}
  - 리듬 조언: ${report.temporalPranaRhythm.rhythmGuidance}
- **상하층 코샤 브리지 통합**: ${report.koshaBridgeMatrix.integrationPrescription}
- **5대 층위별 역할 개요**:
${report.layers.map(l => `  * ${l.koshaNameKo}: ${l.dimension}`).join('\n')}
- **지복 회복 행동 처방**: ${report.blissPrescription}
- **질문 맞춤 성찰 질문**: ${report.reflectiveQuestion}
- **실천 의례**: ${report.ritualAction}
- **성찰 초점**: ${report.reflectionFocus}
- **해석 경계**: 본 리포트는 타이티리야 우파니샤드의 5대 코샤 상징에 기반한 정성적 심신 성찰 안내이며, 의학적 진단이 아닙니다.${matrixLine}`;
}
