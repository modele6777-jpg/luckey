/**
 * 고대 하와이 카후나 3대 자아 & 마나 공명 엔진 (Hawaiian Kahuna Three Selves & Mana Resonance Engine)
 *
 * 고대 하와이 전통 훈(Huna) 철학과 카후나(Kahuna) 지혜 체계의 핵심인
 * 3대 자아(우니히필리·우하네·아우마쿠아)의 삼위일체 정렬과 신성한 생명 에너지 마나(Mana) 순환을 연동합니다.
 */

export const HAWAIIAN_KAHUNA_THREE_SELVES_ENGINE_VERSION = 'LUCKEY-HAWAIIAN-KAHUNA-v2.1.0';

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
  calculatedAtKst: string;
  unihipili: KahunaSelfState;
  uhane: KahunaSelfState;
  aumakua: KahunaSelfState;
  manaResonanceScore: number; // 0 ~ 100 (3대 자아 마나 흐름 정렬도)
  currentManaPikoState: '피코 포오 (Piko Poʻo - 정수리 영적 연결)' | '피코 피코 (Piko Piko - 배꼽 현재 육체 중심)' | '피코 마이 (Piko Mai - 조상 및 뿌리 에너지)';
  secondaryManaPikoState: '피코 포오 (Piko Poʻo - 정수리 영적 연결)' | '피코 피코 (Piko Piko - 배꼽 현재 육체 중심)' | '피코 마이 (Piko Mai - 조상 및 뿌리 에너지)';
  kalaCleansingRitual: string; // 카라(Kala) 해방 및 무결성 회복
  haBreathingPrescription: string; // 마나 축적 하(Ha) 호흡법
  interpretiveBoundary: string;
  situationalKahunaAudit: {
    questionFocus: string;
    pikoAlignmentNote: string;
    manaBlockageSummary: string;
  };
  temporalKahunaRhythm: {
    calculatedAtKst: string;
    kahunaManaWindow: string;
    seasonalTradewindPhase: string;
    pikoTimingNote: string;
  };
  kahunaSynthesisMatrix: {
    coreMandate: string;
    sacredBoundary: string;
    reflectiveQuestion: string;
  };
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
  const pikoIdx = Math.abs(seed) % pikoStates.length;
  const currentManaPikoState = pikoStates[pikoIdx];
  const secondaryManaPikoState = pikoStates[(pikoIdx + 1 + (Math.abs(seed >> 3) % (pikoStates.length - 1))) % pikoStates.length];

  const kalaCleansingRitual = '카라(Kala) 리추얼: "과거의 모든 죄책감과 매듭을 지금 이 순간 완전히 풉니다(Kala). 나의 우니히필리야, 우리는 안전하며 자유롭다."라고 3회 소리 내어 읊조리세요.';
  const haBreathingPrescription = '하(Ha) 호흡법 처방: 코로 4박자 동안 깊게 마시고, 4박자 멈추며 마나를 단전에 응축한 뒤, "하~" 소리와 함께 입으로 4박자 내쉬는 호흡을 4회 반복하여 생명 에너지를 완충하세요.';

  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(kstMs);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;
  const calculatedAtKst = `${kstDate.getUTCFullYear()}-${String(kstMonth).padStart(2, '0')}-${String(kstDate.getUTCDate()).padStart(2, '0')} ${String(kstHour).padStart(2, '0')}:${String(kstDate.getUTCMinutes()).padStart(2, '0')} +09:00 KST`;

  const qLower = question.toLowerCase();
  const questionFocus = /연애|사랑|관계|결혼|재회|이별/.test(qLower)
    ? '우니히필리 감정 기억 해방과 아우마쿠아 사랑 공명 감사'
    : /일|직장|사업|돈|재물|결정|이직/.test(qLower)
    ? '우하네 의식적 결단과 피코 피코 현실 실행력 감사'
    : /건강|휴식|피로|마음|불안/.test(qLower)
    ? '하(Ha) 호흡 마나 충전과 신체 감각 이완 감사'
    : '삼중 자아(우니히필리·우하네·아우마쿠아) 마나 순환 감사';

  const pikoAlignmentNote = `현재 ${currentManaPikoState} 축이 중심을 잡고 있어, 세 자아 사이의 마나 통로가 이 지점을 통해 조율됩니다.`;
  const manaBlockageSummary = `${unihipili.dominantNeedOrBlock} 및 ${uhane.dominantNeedOrBlock}을 부드럽게 풀어내는 것이 핵심입니다.`;

  const kahunaManaWindow = kstHour >= 5 && kstHour < 11
    ? '아침 마나 축적 창(하 호흡과 우니히필리 다독임으로 하루 에너지를 여는 시간)'
    : kstHour >= 11 && kstHour < 17
    ? '정오 우하네 실행 창(명확한 의도를 세우고 현실 과업을 밀고 나가는 시간)'
    : kstHour >= 17 && kstHour < 22
    ? '황혼 카라(Kala) 매듭 풀기 창(하루의 긴장과 감정을 해방하는 시간)'
    : '심야 아우마쿠아 영적 연결 창(고차원 직관과 꿈의 인도를 받는 시간)';

  const seasonalTradewindPhase = kstMonth >= 3 && kstMonth <= 5
    ? '봄 무역풍 순환기(막힌 기운이 풀리며 새로운 마나가 유입되는 주기)'
    : kstMonth >= 6 && kstMonth <= 8
    ? '여름 태양 마나 절정기(풍부한 생명력을 과용하지 않도록 균형을 잡는 주기)'
    : kstMonth >= 9 && kstMonth <= 11
    ? '가을 대지 그라운딩기(피코 마이 뿌리 에너지를 단단히 다지는 주기)'
    : '겨울 심해 침잠기(외부 소모를 줄이고 아우마쿠아의 고요에 머무는 주기)';

  const pikoTimingNote = `${kahunaManaWindow}과 ${seasonalTradewindPhase}에 맞춰 ${currentManaPikoState}을 의식적으로 호흡하십시오.`;

  const trimmedQuestion = question.trim();
  const interpretiveBoundary = '하와이 카후나 3대 자아 관점은 의학적 진단이나 미래 예단이 아니라, 내면의 감정(우니히필리)·이성(우하네)·직관(아우마쿠아)의 조화를 비추는 성찰 렌즈입니다.';
  const kahunaSynthesisMatrix = {
    coreMandate: `${currentManaPikoState}을 중심축으로 ${questionFocus}을 실행하십시오.`,
    sacredBoundary: '우하네의 과도한 통제로 우니히필리를 억압하지 말고, 먼저 감정을 달랜 뒤 이성적 결정을 내리십시오.',
    reflectiveQuestion: trimmedQuestion
      ? `'${trimmedQuestion}'에서 내 안의 내면 아이(우니히필리)가 지금 가장 듣고 싶어 하는 안심의 한마디는 무엇인가요? (${currentManaPikoState})`
      : `지금 내 안의 내면 아이(우니히필리)가 가장 듣고 싶어 하는 안심의 한마디는 무엇인가요? (${currentManaPikoState})`,
  };

  return {
    engineVersion: HAWAIIAN_KAHUNA_THREE_SELVES_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    unihipili,
    uhane,
    aumakua,
    manaResonanceScore,
    currentManaPikoState,
    secondaryManaPikoState,
    kalaCleansingRitual,
    haBreathingPrescription,
    interpretiveBoundary,
    situationalKahunaAudit: {
      questionFocus,
      pikoAlignmentNote,
      manaBlockageSummary,
    },
    temporalKahunaRhythm: {
      calculatedAtKst,
      kahunaManaWindow,
      seasonalTradewindPhase,
      pikoTimingNote,
    },
    kahunaSynthesisMatrix,
  };
}

export function formatHawaiianKahunaThreeSelvesPrompt(report: KahunaManaReport): string {
  return `### 🌺 고대 하와이 카후나 3대 자아 & 마나 공명 실측 데이터 (${report.engineVersion})
- **기준 시각(KST)**: ${report.temporalKahunaRhythm.calculatedAtKst}
- **질문 맥락 & 피코(Piko) 감사**: ${report.situationalKahunaAudit.questionFocus} | ${report.situationalKahunaAudit.pikoAlignmentNote}
- **현재 집중 마나 중심축 (Piko)**: ${report.currentManaPikoState} (보조 조율 축: ${report.secondaryManaPikoState})
- **우니히필리 (Unihipili - 잠재의식/내면아이)**: 상태: ${report.unihipili.dominantNeedOrBlock} | 처방: ${report.unihipili.harmonyPrescription}
- **우하네 (Uhane - 의식/이성적 자아)**: 상태: ${report.uhane.dominantNeedOrBlock} | 처방: ${report.uhane.harmonyPrescription}
- **아우마쿠아 (Aumakua - 초의식/신성한 자아)**: 상태: ${report.aumakua.dominantNeedOrBlock} | 처방: ${report.aumakua.harmonyPrescription}
- **시공간 리듬**: ${report.temporalKahunaRhythm.kahunaManaWindow} · ${report.temporalKahunaRhythm.seasonalTradewindPhase}
- **카라(Kala) 해방 리추얼**: ${report.kalaCleansingRitual}
- **마나 충전 하(Ha) 호흡법**: ${report.haBreathingPrescription}
- **교차 매트릭스**: ${report.kahunaSynthesisMatrix.coreMandate} | 경계: ${report.kahunaSynthesisMatrix.sacredBoundary} | 성찰 질문: "${report.kahunaSynthesisMatrix.reflectiveQuestion}"
- **해석 경계**: ${report.interpretiveBoundary}`;
}
