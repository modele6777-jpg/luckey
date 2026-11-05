/**
 * 고대 하와이 카후나 3대 자아 & 마나 공명 엔진 (Hawaiian Kahuna Three Selves & Mana Resonance Engine)
 *
 * 고대 하와이 전통 훈(Huna) 철학과 카후나(Kahuna) 지혜 체계의 핵심인
 * 3대 자아(우니히필리·우하네·아우마쿠아)의 삼위일체 정렬과 신성한 생명 에너지 마나(Mana) 순환을 연동합니다.
 */

export const HAWAIIAN_KAHUNA_THREE_SELVES_ENGINE_VERSION = 'LUCKEY-HAWAIIAN-KAHUNA-v1.0.0';

export interface KahunaSelfState {
  selfType: '우니히필리 (Unihipili - 잠재의식/내면아이)' | '우하네 (Uhane - 의식/이성적 자아)' | '아우마쿠아 (Aumakua - 초의식/신성한 고차원 자아)';
  nameHawaiian: string;
  role: string;
  currentVitality: number; // 0 ~ 100
  dominantNeedOrBlock: string;
  harmonyPrescription: string;
}

export interface KahunaManaReport {
  engineVersion: string;
  calculatedAt: string;
  unihipili: KahunaSelfState;
  uhane: KahunaSelfState;
  aumakua: KahunaSelfState;
  manaResonanceScore: number; // 0 ~ 100 (3대 자아 마나 흐름 정렬도)
  currentManaPikoState: '피코 포오 (Piko Poʻo - 정수리 영적 연결)' | '피코 피코 (Piko Piko - 배꼽 현재 육체 중심)' | '피코 마이 (Piko Mai - 조상 및 뿌리 에너지)';
  kalaCleansingRitual: string; // 카라(Kala) 해방 및 무결성 회복
  haBreathingPrescription: string; // 마나 축적 하(Ha) 호흡법
}

export function calculateHawaiianKahunaThreeSelves(params: {
  profile?: any;
  question?: string;
  now?: Date;
}): KahunaManaReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 17);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 23;
  }
  seed += now.getDate() * 19 + now.getMonth() * 43;

  const unihipiliVitality = 55 + (Math.abs(seed * 3) % 43);
  const uhaneVitality = 60 + (Math.abs(seed * 7) % 39);
  const aumakuaVitality = 65 + (Math.abs(seed * 11) % 34);

  const manaResonanceScore = Math.round((unihipiliVitality + uhaneVitality + aumakuaVitality) / 3);

  const unihipiliBlocks = [
    '억눌린 두려움과 인정받지 못한 감정적 피로감',
    '과거의 실수에 대한 자책과 경직된 긴장 상태',
    '사랑받고 싶은 갈망과 무리한 일정으로 인한 소진',
    '새로운 모험에 대한 막연한 불안과 저항감',
  ];
  const unihipiliPrescriptions = [
    '내면 아이에게 따뜻한 위로의 말을 건네고 부드러운 스킨십이나 따뜻한 차를 마시세요.',
    '자신을 다그치는 대신 오늘 해낸 작은 일 세 가지를 인정해 주세요.',
    '몸의 긴장을 푸는 산책이나 좋아하는 음악을 감상하며 감각을 깨워주세요.',
    '두려움을 무시하지 말고 "괜찮아, 내가 지켜줄게"라고 진심으로 말해주세요.',
  ];

  const uhaneBlocks = [
    '과도한 분석과 생각의 과부하로 인한 결단 지연',
    '이분법적 흑백논리와 완벽주의적 통제 욕구',
    '타인의 평가에 휘둘려 주체적 의지가 약화된 상태',
    '직관의 목소리를 논리로 재단하려는 의심',
  ];
  const uhanePrescriptions = [
    '복잡한 생각을 멈추고 직관이 가리키는 가장 명확한 단 하나의 행동을 선택하세요.',
    '완벽한 조건 대신 70%의 확신으로 첫발을 내딛는 용기를 발휘하세요.',
    '타인의 의견과 내 진정한 의도를 종이에 명확히 분리하여 기록하세요.',
    '이성의 칼날을 내려놓고 마음의 소리에 논리적 신뢰를 부여하세요.',
  ];

  const aumakuaBlessings = [
    '조상의 지혜와 무조건적인 사랑이 영적 통로를 통해 유입 중',
    '우주적 영감과 번영의 마나(Mana)가 정수리 차크라로 정렬됨',
    '카르마적 매듭이 풀리며 높은 수준의 동시성 기회가 열림',
    '영혼의 본원적 사명을 향한 거룩한 인도와 보호의 장막 형성',
  ];
  const aumakuaPrescriptions = [
    '아우마쿠아에게 감사와 신뢰를 보내며 최고의 선(The Highest Good)을 위해 맡기세요.',
    '아침 첫 순간 명상이나 기도를 통해 영적 연결 통로를 열어두세요.',
    '우연히 찾아오는 직관과 꿈의 상징을 소홀히 넘기지 말고 포착하세요.',
    '나의 번영이 세상 모두의 이로움으로 이어지도록 마음의 축복을 확장하세요.',
  ];

  const uIndex = Math.abs(seed) % unihipiliBlocks.length;
  const uhIndex = Math.abs(seed >> 2) % uhaneBlocks.length;
  const aIndex = Math.abs(seed >> 4) % aumakuaBlessings.length;

  const unihipili: KahunaSelfState = {
    selfType: '우니히필리 (Unihipili - 잠재의식/내면아이)',
    nameHawaiian: 'Unihipili',
    role: '감정·신체 기억·생명력의 금고이자 마나를 상위 자아로 전달하는 펌프',
    currentVitality: unihipiliVitality,
    dominantNeedOrBlock: unihipiliBlocks[uIndex],
    harmonyPrescription: unihipiliPrescriptions[uIndex],
  };

  const uhane: KahunaSelfState = {
    selfType: '우하네 (Uhane - 의식/이성적 자아)',
    nameHawaiian: 'Uhane',
    role: '자유 의지와 분별력으로 올바른 의도를 세우고 우니히필리를 보살피는 어머니/스승',
    currentVitality: uhaneVitality,
    dominantNeedOrBlock: uhaneBlocks[uhIndex],
    harmonyPrescription: uhanePrescriptions[uhIndex],
  };

  const aumakua: KahunaSelfState = {
    selfType: '아우마쿠아 (Aumakua - 초의식/신성한 고차원 자아)',
    nameHawaiian: 'Aumakua',
    role: '신성과 직통 연결되어 순수한 마나를 기적과 현현의 현실로 직조하는 영적 부모',
    currentVitality: aumakuaVitality,
    dominantNeedOrBlock: aumakuaBlessings[aIndex],
    harmonyPrescription: aumakuaPrescriptions[aIndex],
  };

  const pikoStates: ('피코 포오 (Piko Poʻo - 정수리 영적 연결)' | '피코 피코 (Piko Piko - 배꼽 현재 육체 중심)' | '피코 마이 (Piko Mai - 조상 및 뿌리 에너지)')[] = [
    '피코 포오 (Piko Poʻo - 정수리 영적 연결)',
    '피코 피코 (Piko Piko - 배꼽 현재 육체 중심)',
    '피코 마이 (Piko Mai - 조상 및 뿌리 에너지)',
  ];
  const currentManaPikoState = pikoStates[Math.abs(seed) % pikoStates.length];

  const kalaCleansingRitual = '카라(Kala) 리추얼: "과거의 모든 죄책감과 매듭을 지금 이 순간 완전히 풉니다(Kala). 나의 우니히필리야, 우리는 안전하며 자유롭다."라고 3회 소리 내어 읊조리세요.';
  const haBreathingPrescription = '하(Ha) 호흡법 처방: 코로 4박자 동안 깊게 마시고, 4박자 멈추며 마나를 단전에 응축한 뒤, "하~" 소리와 함께 입으로 4박자 내쉬는 호흡을 4회 반복하여 생명 에너지를 완충하세요.';

  return {
    engineVersion: HAWAIIAN_KAHUNA_THREE_SELVES_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    unihipili,
    uhane,
    aumakua,
    manaResonanceScore,
    currentManaPikoState,
    kalaCleansingRitual,
    haBreathingPrescription,
  };
}

export function formatHawaiianKahunaThreeSelvesPrompt(report: KahunaManaReport): string {
  return `### 🌺 고대 하와이 카후나 3대 자아 & 마나 공명 실측 데이터 (${report.engineVersion})
- **3대 자아 마나 흐름 정렬도**: ${report.manaResonanceScore}점 / 100점
- **현재 집중 마나 중심축 (Piko)**: ${report.currentManaPikoState}
- **우니히필리 (Unihipili - 잠재의식/내면아이)**: 활력 ${report.unihipili.currentVitality}점 | 상태: ${report.unihipili.dominantNeedOrBlock} | 처방: ${report.unihipili.harmonyPrescription}
- **우하네 (Uhane - 의식/이성적 자아)**: 활력 ${report.uhane.currentVitality}점 | 상태: ${report.uhane.dominantNeedOrBlock} | 처방: ${report.uhane.harmonyPrescription}
- **아우마쿠아 (Aumakua - 초의식/신성한 자아)**: 활력 ${report.aumakua.currentVitality}점 | 상태: ${report.aumakua.dominantNeedOrBlock} | 처방: ${report.aumakua.harmonyPrescription}
- **카라(Kala) 해방 리추얼**: ${report.kalaCleansingRitual}
- **마나 충전 하(Ha) 호흡법**: ${report.haBreathingPrescription}`;
}
