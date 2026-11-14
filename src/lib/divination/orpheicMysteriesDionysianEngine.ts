/**
 * 고대 그리스 오르페우스 신비주의 & 므네모시네 기억의 샘 각성 엔진 (Orpheic Mysteries & Mnemosyne Awakening Engine)
 *
 * 고대 그리스 오르페우스교(Orphism)의 황금판(Gold Tablets)에 기록된 망각의 샘(Lethe)과
 * 기억의 샘(Mnemosyne)의 대비, 그리고 아폴론적 조화(명료함)와 디오니소스적 생명력(해방)의
 * 상징적 균형을 통해 현대인의 자기 인식과 정서적 회복을 비추는 정성적 성찰 도구입니다.
 */

export const ORPHEIC_MYSTERIES_ENGINE_VERSION = 'LUCKEY-ORPHEIC-MYSTERIES-v1.1.0';

export type OrphicQuestionTheme = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface OrphicMysteriesReport {
  engineVersion: string;
  calculatedAt: string;
  questionTheme: OrphicQuestionTheme;
  divineLineageDeclaration: string; // 영혼의 근원적 주권 상징 문구
  memoryWellAwakeningScore: number; // 하위 호환용 내부 참조치 (0 ~ 100)
  dionysianEcstasyVitality: number; // 하위 호환용 내부 참조치 (0 ~ 100)
  thresholdState: '므네모시네의 맑은 샘 (명료한 각성)' | '레테와 므네모시네의 경계 (과거와 현재의 조율)' | '레테의 안개 통과 (묵은 피로의 이완 필요)';
  polarityArchetype: {
    nameKo: string;
    apollonianAspect: string;
    dionysianAspect: string;
  };
  goldTabletPassportCode: string; // 황금판 상징 키워드
  soulAwakeningPrescription: string; // 하위 호환용 지침
  practiceGuidance: string; // getSymbolicPerspective 호환 정성적 조언 (숫자·인용 배제)
  ritualAction: string; // 일상 실천 의례
  reflectionFocus: string; // 내면 성찰 질문
  counselNote: string; // 조언 요약
  boundaryNotice: string; // 상징적 해석 경계 안내
}

function classifyOrphicTheme(question: string): OrphicQuestionTheme {
  if (/연애|사랑|관계|사람|친구|가족|배우자|이별|갈등|마음/.test(question)) return 'relationship';
  if (/선택|결정|이직|직장|일|사업|돈|시험|도전|시작|포기/.test(question)) return 'decision';
  if (/힘들|지치|불안|우울|잠|휴식|치유|피곤|스트레스|건강/.test(question)) return 'healing';
  return 'reflection';
}

export function calculateOrpheicMysteries(params: {
  profile?: { basic?: { birthdate?: string } };
  question?: string;
  now?: Date;
}): OrphicMysteriesReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';
  const questionTheme = classifyOrphicTheme(question);

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 17);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 37;
  }
  seed += now.getDate() * 29 + now.getMonth() * 67;

  const memoryWellAwakeningScore = 70 + (Math.abs(seed * 7) % 29);
  const dionysianEcstasyVitality = 65 + (Math.abs(seed * 13) % 34);

  const thresholdState =
    memoryWellAwakeningScore >= 85
      ? '므네모시네의 맑은 샘 (명료한 각성)'
      : memoryWellAwakeningScore >= 77
        ? '레테와 므네모시네의 경계 (과거와 현재의 조율)'
        : '레테의 안개 통과 (묵은 피로의 이완 필요)';

  const archetypes = [
    {
      nameKo: '오르페우스의 리라 (조율과 경청)',
      apollonianAspect: '어지러운 감정을 정돈하고 본질의 가락을 가려내는 명료함',
      dionysianAspect: '경직된 틀을 녹이고 진심의 울림을 표현하는 생동감',
    },
    {
      nameKo: '므네모시네의 샘 (기억과 주권)',
      apollonianAspect: '외부의 소음에 흔들리지 않고 스스로의 기준을 기억하는 중심',
      dionysianAspect: '억압했던 내면의 기쁨과 호기심을 다시 깨우는 해방감',
    },
    {
      nameKo: '자그레우스의 거울 (변용과 재탄생)',
      apollonianAspect: '흩어진 조각들을 한눈에 비추어 전체 맥락을 파악하는 통찰',
      dionysianAspect: '낡은 허물을 벗고 새로운 국면으로 도약하는 창조적 용기',
    },
    {
      nameKo: '아폴론의 월계수 (빛과 절제)',
      apollonianAspect: '과잉된 욕심을 비우고 지금 필요한 한 걸음만 남기는 절제',
      dionysianAspect: '삶의 순간마다 감사와 환희를 길어 올리는 따뜻한 열정',
    },
  ];
  const polarityArchetype = archetypes[Math.abs(seed) % archetypes.length];

  const divineLineageDeclaration =
    '대지와 별빛 가득한 하늘의 유산을 함께 품은 존재로서, 망각의 관성을 넘어 스스로의 중심을 기억하는 상징적 선언';

  const tabletCodes = [
    'MNEMOSYNE-GOLDEN-PASS-VITA-ETERNAL',
    'ORPHIC-CYPRESS-LAKE-IMMORTAL-LIGHT',
    'DIONYSUS-BACCHIC-SPRING-BOUNDLESS-JOY',
    'APOLLO-LYRE-COSMIC-HARMONY-KEY',
  ];
  const goldTabletPassportCode = tabletCodes[Math.abs(seed) % tabletCodes.length];

  const guidanceByTheme: Record<OrphicQuestionTheme, {
    practiceGuidance: string;
    ritualAction: string;
    reflectionFocus: string;
    counselNote: string;
  }> = {
    relationship: {
      practiceGuidance: '상대의 말이나 반응에 휩쓸려 본래의 마음을 잊지 않도록, 대화를 나누기 전 자신의 진심이 무엇인지 먼저 고요히 떠올려 보세요.',
      ritualAction: '시원한 물 한 잔을 천천히 마시며 상대에게 기대하던 역할과 내가 지키고 싶은 선을 마음속으로 차분히 구분해 보세요.',
      reflectionFocus: '관계 속에서 나 자신을 잃지 않기 위해 지금 가장 기억해야 할 내 모습은 무엇인가요?',
      counselNote: '타인의 시선이라는 망각의 안개를 걷어내고 솔직한 리라의 가락처럼 진정성 있는 소통을 이어갈 때 관계가 건강해집니다.',
    },
    decision: {
      practiceGuidance: '주변의 조급한 기준이나 유행에 맞추기보다, 시간이 지나도 후회하지 않을 나만의 핵심 가치가 어느 쪽에 있는지 살피는 것이 좋습니다.',
      ritualAction: '선택지를 앞에 두고 머릿속 소음을 잠시 멈춘 뒤, 두 선택 중 내 호흡이 더 깊고 편안해지는 방향을 종이에 적어 보세요.',
      reflectionFocus: '두려움이나 체면이 아니라 진정한 생명력이 이끄는 선택은 어느 쪽인가요?',
      counselNote: '아폴론적 명료함으로 조건을 점검하되 최종 결단에서는 디오니소스적 활력이 살아 숨 쉬는 쪽을 신뢰해 보세요.',
    },
    healing: {
      practiceGuidance: '지친 마음을 억지로 다그치기보다, 묵은 피로를 레테의 강물에 흘려보내듯 오늘 하루만큼은 스스로에게 느슨한 여백을 허락하세요.',
      ritualAction: '조명을 낮추고 차가운 물이나 따뜻한 차를 마시며 어깨의 힘을 천천히 풀어 주는 짧은 호흡 시간을 가져 보세요.',
      reflectionFocus: '지금 내 마음이 가장 내려놓고 싶어 하는 무거운 의무감은 무엇인가요?',
      counselNote: '회복은 무언가를 더 채우는 것이 아니라 나를 얽매던 불필요한 긴장을 조용히 놓아줄 때 자연스럽게 찾아옵니다.',
    },
    reflection: {
      practiceGuidance: '일상의 관성에 휩쓸려 흐르는 시간 속에서, 내가 원래 좋아하고 소중히 여기던 감각을 다시 일깨우는 짧은 멈춤이 필요합니다.',
      ritualAction: '산책하거나 음악을 들으며 외부의 평가 없이 온전히 나만의 리듬으로 움직이는 짧은 시간을 확보해 보세요.',
      reflectionFocus: '요즘 내 일상에서 가장 선명하게 살아 있는 기쁨의 순간은 언제였나요?',
      counselNote: '기억의 샘을 길어 올리는 일은 거창한 깨달음이 아니라 오늘 내 안의 작은 생동감을 알아차리는 데서 시작됩니다.',
    },
  };

  const themeContent = guidanceByTheme[questionTheme];
  const boundaryNotice = '오르페우스 신비주의 관점은 고대 그리스 상징 철학을 빌린 정성적 성찰 참고용이며, 개인 점수나 심리 진단·미래 예언이 아닙니다.';

  return {
    engineVersion: ORPHEIC_MYSTERIES_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    questionTheme,
    divineLineageDeclaration,
    memoryWellAwakeningScore,
    dionysianEcstasyVitality,
    thresholdState,
    polarityArchetype,
    goldTabletPassportCode,
    soulAwakeningPrescription: themeContent.practiceGuidance,
    practiceGuidance: themeContent.practiceGuidance,
    ritualAction: themeContent.ritualAction,
    reflectionFocus: themeContent.reflectionFocus,
    counselNote: themeContent.counselNote,
    boundaryNotice,
  };
}

export function formatOrpheicMysteriesPrompt(report: OrphicMysteriesReport): string {
  return `### 🏛️ 고대 그리스 오르페우스 신비주의 & 므네모시네 기억의 샘 실측 데이터 (${report.engineVersion})
- **영혼의 신성한 근원 선언**: "${report.divineLineageDeclaration}"
- **임계 통과 상태**: ${report.thresholdState}
- **상징 원형**: ${report.polarityArchetype.nameKo} (아폴론적 명료함: ${report.polarityArchetype.apollonianAspect} / 디오니소스적 생명력: ${report.polarityArchetype.dionysianAspect})
- **오르페우스 황금판 패스포트 코드**: \`${report.goldTabletPassportCode}\`
- **실천 조언**: ${report.practiceGuidance}
- **일상 의례**: ${report.ritualAction}
- **성찰 질문**: ${report.reflectionFocus}
- **참고 경계**: ${report.boundaryNotice}`;
}
