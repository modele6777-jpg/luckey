/**
 * 고대 이집트 마아트(Ma'at) 진리의 깃털 & 심장 무게 측정 엔진 (Egyptian Ma'at Feather & Heart Weighing Engine)
 *
 * 고대 이집트 사자의 서(Book of the Dead)에 등장하는 진리·조화의 여신 마아트의 깃털(Shu)과
 * 인간의 심장(Ib)을 달아보는 상징적 저울질(Psychostasia)을 현대의 정서적 균형,
 * 양심의 명료함, 마음의 짐 내려놓기에 연결하는 정성적 성찰 엔진입니다.
 */

export const EGYPTIAN_MAAT_FEATHER_ENGINE_VERSION = 'LUCKEY-EGYPTIAN-MAAT-v2.0.0';

export type MaatQuestionTheme = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface MaatTemporalRhythm {
  kstHour: number;
  hallOfMaatWindow: string;
  seasonalBalancePhase: string;
  weighingGuidance: string;
  scaleTempo: '명료판정' | '균형조율' | '정화성찰';
}

export interface MaatSynthesisMatrix {
  virtueTrapLink: string;
  scaleAlignmentState: '수평안정' | '경량명료' | '정화권고';
  nextScaleStep: string;
}

export interface MaatWeighingReport {
  engineVersion: string;
  calculatedAt: string;
  questionTheme: MaatQuestionTheme;
  heartLightnessScore: number; // 하위 호환용 내부 참조치 (0 ~ 100)
  balanceState: '조화로운 수평 균형' | '명료하고 가벼운 심장' | '과잉 부담 해소 필요';
  weighingVerdict: '아루(Aaru) 갈대밭 낙원 통과 (깃털보다 가벼운 심장)' | '토트(Thoth)의 지혜로운 기록 통과 (완벽한 영혼의 수평 저울)' | '정화 의식 권고 (가슴속 묵은 집착의 정화 필요)';
  activeNegativeConfessionVirtue: string; // 42대 무결성 덕목
  ammutShadowTrap: string; // 무거운 마음을 갉아먹는 그림자 함정
  symbolicGuard: {
    anubisRole: string; // 저울을 살피는 관찰자
    thothRole: string;  // 있는 그대로 기록하는 서기관
  };
  featherAlignmentPrescription: string; // 하위 호환용 지침
  temporalMaatRhythm: MaatTemporalRhythm;
  maatSynthesisMatrix: MaatSynthesisMatrix;
  practiceGuidance: string; // getSymbolicPerspective 호환 정성적 조언
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
}

function classifyMaatTheme(question: string): MaatQuestionTheme {
  if (/연애|사랑|관계|사람|친구|가족|배우자|이별|갈등|서운/.test(question)) return 'relationship';
  if (/선택|결정|이직|직장|일|사업|돈|시험|도전|시작|계약/.test(question)) return 'decision';
  if (/힘들|지치|불안|우울|잠|휴식|치유|피곤|후회|죄책/.test(question)) return 'healing';
  return 'reflection';
}

function getKstMaatParts(now: Date): { hour: number; month: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    month: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  return {
    hour: Number(parts.find((p) => p.type === 'hour')?.value || '12') % 24,
    month: Number(parts.find((p) => p.type === 'month')?.value || '1'),
  };
}

function buildMaatTemporalRhythm(now: Date): MaatTemporalRhythm {
  const { hour, month } = getKstMaatParts(now);

  let hallOfMaatWindow = '여명 마아트(Ma\'at) 맑은 양심 창';
  let scaleTempo: MaatTemporalRhythm['scaleTempo'] = '명료판정';
  let weighingGuidance = '감정이 가라앉은 맑은 시간대이므로 객관적인 기준을 세우기 좋습니다.';

  if (hour >= 5 && hour < 10) {
    hallOfMaatWindow = '여명 진리의 깃털 명료 창 (05~10시)';
    scaleTempo = '명료판정';
    weighingGuidance = '오늘의 선택 기준을 정직하고 단순하게 정리하기 가장 좋은 시간입니다.';
  } else if (hour >= 10 && hour < 17) {
    hallOfMaatWindow = '주간 이집트 저울 수평 조율 창 (10~17시)';
    scaleTempo = '균형조율';
    weighingGuidance = '일과 관계에서 공정한 주고받음과 현실적 책임을 균형 있게 다룰 시간입니다.';
  } else if (hour >= 17 && hour < 21) {
    hallOfMaatWindow = '황혼 토트(Thoth) 서기관 회고 창 (17~21시)';
    scaleTempo = '정화성찰';
    weighingGuidance = '하루 동안 쌓인 감정적 무게를 팩트와 구분해 내려놓기 알맞습니다.';
  } else {
    hallOfMaatWindow = '심야 아루(Aaru) 평온 안식 창 (21~05시)';
    scaleTempo = '정화성찰';
    weighingGuidance = '스스로를 심판하는 생각을 멈추고 가벼운 마음으로 휴식에 들 시간입니다.';
  }

  let seasonalBalancePhase = '봄 · 진실의 새싹 정돈절';
  if (month >= 3 && month <= 5) seasonalBalancePhase = '봄 · 새로운 약속과 명료함 개시절';
  else if (month >= 6 && month <= 8) seasonalBalancePhase = '여름 · 열정 속 균형 절제절';
  else if (month >= 9 && month <= 11) seasonalBalancePhase = '가을 · 공평한 수확과 결산절';
  else seasonalBalancePhase = '겨울 · 고요한 내면 성찰절';

  return {
    kstHour: hour,
    hallOfMaatWindow,
    seasonalBalancePhase,
    weighingGuidance,
    scaleTempo,
  };
}

export function calculateEgyptianMaatFeatherHeart(params: {
  profile?: { basic?: { birthdate?: string } };
  question?: string;
  now?: Date;
}): MaatWeighingReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';
  const questionTheme = classifyMaatTheme(question);

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 11);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 29;
  }
  seed += now.getDate() * 17 + now.getMonth() * 59;

  const heartLightnessScore = 65 + (Math.abs(seed * 7) % 34);

  const virtues = [
    '타인의 마음을 이유 없이 아프게 하지 않는 무해함의 덕',
    '자신의 양심을 속이지 않고 정직하게 노동하는 진실성의 덕',
    '가진 것을 가난한 자와 기꺼이 나누는 관대함의 덕',
    '자연의 순리와 우주적 질서를 거스르지 않는 조화의 덕',
  ];
  const activeNegativeConfessionVirtue = virtues[Math.abs(seed) % virtues.length];

  const ammutTraps = [
    '지나간 후회와 죄책감에 스스로를 가두는 자기 비하',
    '남과 비교하며 마음속으로 품는 은밀한 질투와 결핍감',
    '모든 상황을 혼자 통제하려다 생기는 가슴속 답답한 압박감',
    '솔직하지 못한 감정 억압으로 인한 심장의 에너지 정체',
  ];
  const ammutShadowTrap = ammutTraps[Math.abs(seed >> 2) % ammutTraps.length];

  let weighingVerdict: MaatWeighingReport['weighingVerdict'];
  let balanceState: MaatWeighingReport['balanceState'];
  if (heartLightnessScore >= 85) {
    weighingVerdict = '아루(Aaru) 갈대밭 낙원 통과 (깃털보다 가벼운 심장)';
    balanceState = '명료하고 가벼운 심장';
  } else if (heartLightnessScore >= 70) {
    weighingVerdict = '토트(Thoth)의 지혜로운 기록 통과 (완벽한 영혼의 수평 저울)';
    balanceState = '조화로운 수평 균형';
  } else {
    weighingVerdict = '정화 의식 권고 (가슴속 묵은 집착의 정화 필요)';
    balanceState = '과잉 부담 해소 필요';
  }

  const symbolicGuard = {
    anubisRole: '감정에 치우치지 않고 내 마음의 무게가 어느 한쪽으로 쏠려 있는지 조용히 살피는 균형의 시선',
    thothRole: '스스로를 과장하거나 비하하지 않고 지금 겪고 있는 사실 그대로를 담담하게 기록하는 객관성',
  };

  const guidanceByTheme: Record<MaatQuestionTheme, {
    practiceGuidance: string;
    ritualAction: string;
    reflectionFocus: string;
    counselNote: string;
  }> = {
    relationship: {
      practiceGuidance: '상대에게 서운하거나 억울한 마음이 쌓여 심장이 무거워졌다면, 짐작으로 앙금을 키우기보다 솔직하고 차분한 언어로 사실과 감정을 나누어 보세요.',
      ritualAction: '마음을 무겁게 만드는 오해나 기대 한 가지를 메모에 적은 뒤, 내가 통제할 수 없는 상대의 몫은 조용히 줄을 그어 분리해 보세요.',
      reflectionFocus: '이 관계에서 내가 지켜야 할 진실성과 불필요하게 짊어지고 있는 죄책감은 각각 무엇인가요?',
      counselNote: '관계의 균형은 무조건 참는 데서 오지 않으며, 서로의 마음을 깃털처럼 솔직하게 꺼내 놓을 때 회복됩니다.',
    },
    decision: {
      practiceGuidance: '눈앞의 이익이나 남들의 시선 때문에 양심에 걸리는 선택을 하지 마세요. 마음이 떳떳하고 가벼워지는 방향이 결국 가장 오래 갑니다.',
      ritualAction: '결정을 앞둔 두 가지 길을 떠올렸을 때, 가슴이 답답해지는 쪽과 숨이 트이는 쪽의 신체 감각을 잠깐 멈추고 비교해 보세요.',
      reflectionFocus: '체면이나 욕심을 덜어내고 보았을 때, 내 양심이 자연스럽게 고개를 끄덕이는 선택은 무엇인가요?',
      counselNote: '마아트의 저울은 화려한 계산보다 내면의 정직함과 무해함을 기준으로 삼을 때 가장 선명한 답을 보여 줍니다.',
    },
    healing: {
      practiceGuidance: '지나간 실수나 자책감이 아미트처럼 마음의 평온을 갉아먹고 있다면, 이제 그 짐을 내려놓고 스스로를 너그럽게 용서할 때입니다.',
      ritualAction: '오늘 나를 가장 무겁게 누르던 생각이나 의무감을 종이에 적어 구기거나 지우며 마음의 저울을 비우는 시간을 가져 보세요.',
      reflectionFocus: '지금 내 가슴을 무겁게 만드는 것 중 오늘 당장 내려놓아도 괜찮은 짐은 무엇인가요?',
      counselNote: '심장을 가볍게 만드는 것은 완벽해지는 일이 아니라, 지나간 무게를 현재로 끌고 오지 않는 결단입니다.',
    },
    reflection: {
      practiceGuidance: '하루를 마무리하며 내 말과 행동이 나와 타인에게 어떤 울림을 남겼는지 토트의 서기관처럼 담담하게 돌아보는 여유를 가져 보세요.',
      ritualAction: '잠자리에 들기 전 오늘 지킨 작은 정직함이나 친절 한 가지를 떠올리며 스스로에게 고요한 인정을 건네 보세요.',
      reflectionFocus: '오늘 내 마음의 저울을 가장 편안한 수평으로 이끌어 준 태도는 무엇이었나요?',
      counselNote: '거창한 도덕보다 일상의 작은 진실성과 조화를 꾸준히 가꿀 때 마음은 깃털처럼 가벼운 중심을 유지합니다.',
    },
  };

  const themeContent = guidanceByTheme[questionTheme];
  const boundaryNotice = '이집트 마아트 관점은 고대 상징을 빌린 정성적 자기 성찰 참고용이며, 도덕적 심판이나 개인의 가치 평가·미래 예언이 아닙니다.';
  const temporalMaatRhythm = buildMaatTemporalRhythm(now);
  const scaleAlignmentState: MaatSynthesisMatrix['scaleAlignmentState'] =
    heartLightnessScore >= 85 ? '경량명료' : heartLightnessScore >= 70 ? '수평안정' : '정화권고';
  const maatSynthesisMatrix: MaatSynthesisMatrix = {
    virtueTrapLink: `[${activeNegativeConfessionVirtue}]의 덕목으로 [${ammutShadowTrap}]을 비추어 균형을 잡습니다.`,
    scaleAlignmentState,
    nextScaleStep: themeContent.ritualAction,
  };

  return {
    engineVersion: EGYPTIAN_MAAT_FEATHER_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    questionTheme,
    heartLightnessScore,
    balanceState,
    weighingVerdict,
    activeNegativeConfessionVirtue,
    ammutShadowTrap,
    symbolicGuard,
    featherAlignmentPrescription: themeContent.practiceGuidance,
    temporalMaatRhythm,
    maatSynthesisMatrix,
    practiceGuidance: themeContent.practiceGuidance,
    ritualAction: themeContent.ritualAction,
    reflectionFocus: themeContent.reflectionFocus,
    counselNote: themeContent.counselNote,
    boundaryNotice,
  };
}

export function formatEgyptianMaatFeatherHeartPrompt(report: MaatWeighingReport): string {
  return `### ⚖️ 고대 이집트 마아트(Ma'at) 진리의 깃털 & 심장 무게 측정 실측 데이터 (${report.engineVersion})
- **심장-깃털 균형 상태**: ${report.balanceState} (${report.maatSynthesisMatrix.scaleAlignmentState})
- **오시리스 심판 저울 판정**: [${report.weighingVerdict}]
- **주도적 양심 무결성 덕목**: ${report.activeNegativeConfessionVirtue}
- **경계해야 할 아미트(Ammut) 그림자 함정**: ${report.ammutShadowTrap}
- **아누비스·토트 상징 균형**: ${report.symbolicGuard.anubisRole} / ${report.symbolicGuard.thothRole}
- **KST 시공간 리듬 (${report.temporalMaatRhythm.kstHour}시)**: ${report.temporalMaatRhythm.hallOfMaatWindow} · ${report.temporalMaatRhythm.seasonalBalancePhase} (${report.temporalMaatRhythm.scaleTempo})
  - **시간대 지침**: ${report.temporalMaatRhythm.weighingGuidance}
- **교차 매트릭스**: ${report.maatSynthesisMatrix.virtueTrapLink}
- **실천 조언**: ${report.practiceGuidance}
- **일상 의례**: ${report.ritualAction}
- **성찰 질문**: ${report.reflectionFocus}
- **참고 경계**: ${report.boundaryNotice}`;
}
