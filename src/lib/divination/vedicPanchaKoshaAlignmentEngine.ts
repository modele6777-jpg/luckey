/**
 * 고대 인도 베단타 5대 코샤(Pancha Kosha) 층위별 정렬 & 아트만 해방 엔진 (Pancha Kosha Realignment Engine)
 *
 * 타이티리야 우파니샤드(Taittiriya Upanishad)에 기록된 인간 존재의 5대 칼집(자루):
 * 1. 안나마야 코샤 (육체/음식체)
 * 2. 프라나마야 코샤 (에너지/호흡체)
 * 3. 마노마야 코샤 (정서/마음체)
 * 4. 비즈냐나마야 코샤 (지성/직관체)
 * 5. 아난다마야 코샤 (영혼/지고의 지복체)
 * 5개 층위의 막힘을 진단하고 참된 본성인 아트만(Atman)의 환희를 회복합니다.
 */

export const VEDIC_PANCHA_KOSHA_ENGINE_VERSION = 'LUCKEY-PANCHA-KOSHA-v1.0.0';

export interface KoshaLayer {
  layerIndex: number;
  koshaNameKo: string;
  koshaNameSanskrit: string;
  dimension: string;
  alignmentScore: number; // 0 ~ 100
  blockageSymptom: string;
  clearingAction: string;
}

export interface PanchaKoshaReport {
  engineVersion: string;
  calculatedAt: string;
  layers: KoshaLayer[];
  lowestAlignedLayer: KoshaLayer;
  atmanRealizationIndex: number; // 0 ~ 100
  blissPrescription: string;
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

  const atmanRealizationIndex = Math.round(layers.reduce((sum, l) => sum + l.alignmentScore, 0) / layers.length);
  const blissPrescription = `현재 5대 코샤 중 [${lowestAlignedLayer.koshaNameKo}]의 정렬이 가장 시급합니다. '${lowestAlignedLayer.clearingAction}'을 즉시 실행하여 거친 외피를 정화하고, 가장 깊은 곳의 참된 자아(Atman)의 환희를 해방하세요.`;

  return {
    engineVersion: VEDIC_PANCHA_KOSHA_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    layers,
    lowestAlignedLayer,
    atmanRealizationIndex,
    blissPrescription,
  };
}

export function formatVedicPanchaKoshaPrompt(report: PanchaKoshaReport): string {
  const low = report.lowestAlignedLayer;
  return `### 🕉️ 고대 인도 베단타 5대 코샤(Pancha Kosha) 층위별 정렬 실측 데이터 (${report.engineVersion})
- **아트만(Atman) 지복 실현 지수**: ${report.atmanRealizationIndex}점 / 100점
- **가장 정렬이 시급한 칼집 층위**: 제${low.layerIndex}층 [${low.koshaNameKo}] (${low.alignmentScore}점)
- **발견된 병목 증상**: ${low.blockageSymptom}
- **5대 층위별 정렬 상태**:
${report.layers.map(l => `  * ${l.koshaNameKo}: ${l.alignmentScore}점 - ${l.dimension}`).join('\n')}
- **지복 회복 행동 처방**: ${report.blissPrescription}`;
}
