/**
 * =========================================================================
 * LUCKEY 고대 그리스 엘레우시스 신비주의(Eleusinian Mysteries) 영혼 입사의례 & 페르세포네 환원 엔진
 * (Eleusinian Mysteries Initiation & Epoptia Rebirth Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 고대 아테네 엘레우시스(Eleusis)에서 2천 년 동안 거행되었던 서양 고전 최고(最高)의 비교(秘敎).
 * 대지의 어머니 데메테르(Demeter)와 지하세계의 여왕 페르세포네(Persephone/Kore),
 * 그리고 디오니소스-이아코스(Iakkhos)의 신성한 밀의.
 * 
 * 1. 3단계 엘레우시스 입사 등급 (Initiation Grades):
 *    - 무스테스 (Mystes): 아그라이 소신비제(Lesser Mysteries)의 정화와 눈뜸
 *    - 에포프테스 (Epoptes): 텔레스테리온 대신비제(Greater Mysteries)의 궁극적 계시 목도
 *    - 히에로판트 (Hierophant): 성스러운 비의(Hiera)를 드러내는 지혜의 사제
 * 2. 4대 엘레우시스 신비의례 국면 (Mystic Stations):
 *    - 카타르시스 (Catharsis): 일리소스 강물과 바다에서의 정화, 지난 찌꺼기 씻김
 *    - 케르노포리아 (Kernophoria): 첫 수확의 성스러운 곡물 바구니 봉헌, 잠재력 결실
 *    - 카타바시스 (Katabasis): 페르세포네의 하강, 무의식의 심연과 어둠과의 대면
 *    - 아나바시스 & 에포프테이아 (Anabasis & Epoptia): 빛으로의 귀환과 불멸의 영감 각성
 * 3. 키케온(Kykeon) 신성 음료와 에포프테이아 영혼 부활 지수 (0 ~ 100)
 */

import type { UserProfile } from '../sharedState';

export const ELEUSINIAN_MYSTERIES_VERSION = 'LUCKEY-ELEUSINIAN-MYSTERIES-v2.0.0';

export type EleusinianQuestionTheme = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface EleusinianGrade {
  gradeTitle: string;            // 무스테스 / 에포프테스 / 히에로판트
  greekTerm: string;             // Mystes / Epoptes / Hierophant
  spiritualLevel: string;        // 영적 의식 층위
  initiationGuidance: string;    // 입사 지침
}

export interface EleusinianStation {
  stationName: string;           // 카타르시스 / 케르노포리아 / 카타바시스 / 아나바시스
  greekName: string;             // Catharsis / Kernophoria / Katabasis / Anabasis
  mythicArchetype: string;       // 신화적 상징
  innerTransformation: string;   // 내적 변용 작용
  practicalVirtue: string;       // 현실적 미덕
}

export interface EleusinianReport {
  engineVersion: string;
  calculatedAt: string;
  questionTheme: EleusinianQuestionTheme;
  currentGrade: EleusinianGrade;
  activeStation: EleusinianStation;
  epoptiaRebirthScore: number;   // 내부 참조용
  rebirthPosture: string;        // 정성적 에포프테이아 부활 국면
  sacredSymbol: string;          // 보리 이삭(Ear of Grain), 횃불(Torch), 키케온(Kykeon) 등
  oracleMessage: string;         // 신비전 오라클 전언
  temporalEleusinianRhythm: {
    calculatedAtKst: string;
    telesterionWindow: string;
    seasonalCycle: string;
    rhythmGuidance: string;
  };
  eleusinianSynthesisMatrix: {
    gradeStationNexus: string;
    thresholdTension: string;
    initiationDirective: string;
  };
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
}

const INITIATION_GRADES: EleusinianGrade[] = [
  {
    gradeTitle: '무스테스 (Mystes)',
    greekTerm: 'Μύστης (눈을 감고 내면을 응시하는 자)',
    spiritualLevel: '소신비제 정화 및 분별의 감각 세정 단계',
    initiationGuidance: '외부의 소음과 자극에 휘둘리지 말고 조용히 내면의 깊은 침묵으로 침잠하십시오.'
  },
  {
    gradeTitle: '에포프테스 (Epoptes)',
    greekTerm: 'Ἐπόπτης (신성한 진실을 직접 목도한 자)',
    spiritualLevel: '대신비제 텔레스테리온 계시 및 최고 직관 단계',
    initiationGuidance: '두려움의 장막을 걷어내고 당신 내면에 이미 갖추어진 불멸의 지혜를 당당히 바라보십시오.'
  },
  {
    gradeTitle: '히에로판트 (Hierophant)',
    greekTerm: 'Ἱεροφάντης (거룩한 비의를 세상에 밝히는 사제)',
    spiritualLevel: '체득한 지혜로 타인을 어둠에서 빛으로 인도하는 단계',
    initiationGuidance: '당신의 통찰과 경험을 나누어 혼란에 빠진 이들의 길을 비추는 횃불이 되어주십시오.'
  }
];

const MYSTIC_STATIONS: EleusinianStation[] = [
  {
    stationName: '카타르시스 (Catharsis - 정화의 파도)',
    greekName: 'Κάθαρσις',
    mythicArchetype: '바다로 달려가 어린 돼지를 씻기는 정화 의식과 묵은 허물의 탈피',
    innerTransformation: '과거의 죄책감과 불필요한 피해의식을 파도에 실어 보내고 맑은 백지 상태로 회귀',
    practicalVirtue: '미련이나 자책을 즉시 멈추고 몸과 마음의 컨디션을 가장 가볍고 산뜻하게 정돈하십시오.'
  },
  {
    stationName: '케르노포리아 (Kernophoria - 첫 수확의 봉헌)',
    greekName: 'Κερνοφορία',
    mythicArchetype: '성스러운 그릇(Kernos)에 담긴 보리와 석류, 올리브 열매의 신성한 봉헌',
    innerTransformation: '그동안 묵묵히 땀 흘려 가꾼 재능과 인내의 씨앗이 현실의 풍요로운 열매로 응결',
    practicalVirtue: '스스로 거둔 작은 성과들을 깎아내리지 말고 소중한 결실로 인정하며 감사하십시오.'
  },
  {
    stationName: '카타바시스 (Katabasis - 심연의 탐험)',
    greekName: 'Κατάβασις',
    mythicArchetype: '페르세포네가 어둠의 하데스로 내려가 그림자 왕국의 진실을 마주함',
    innerTransformation: '피하고 싶었던 두려움과 결핍의 근원을 정면으로 직시하여 거대한 내적 힘으로 승화',
    practicalVirtue: '골치 아픈 문제나 미뤄둔 난제를 회피하지 말고 단호하게 본질을 파헤쳐 해결하십시오.'
  },
  {
    stationName: '아나바시스 & 에포프테이아 (Anabasis - 빛의 부활)',
    greekName: 'Ἀνάβασις & Ἐποπτεία',
    mythicArchetype: '봄의 여신 코레의 찬란한 귀환과 침묵 속에서 높이 들어 올려진 한 줄기 보리 이삭',
    innerTransformation: '어둠의 터널을 완전히 통과하여 이전과는 전혀 다른 차원의 통찰과 부활을 경험',
    practicalVirtue: '새로운 국면의 시작을 확신하고 담대한 비전과 창의적인 영감을 즉각 현실에 펼치십시오.'
  }
];

const SACRED_SYMBOLS = [
  '침묵 속에 들어 올려진 황금빛 보리 이삭 (Reaped Ear of Wheat - 불멸의 생명력)',
  '어둠을 가르는 데메테르의 이중 횃불 (Twin Torches - 의식의 각성과 인도)',
  '박하와 보리로 빚은 키케온 신성 성배 (Chalice of Kykeon - 영혼의 자양분)',
  '영혼의 영원한 회귀를 상징하는 석류 씨앗 (Seeds of Pomegranate - 신성한 계약)'
];

function classifyEleusinianTheme(question?: string): EleusinianQuestionTheme {
  const q = (question || '').toLowerCase();
  if (/관계|연애|사랑|사람|가족|친구|이별|갈등|소통/.test(q)) return 'relationship';
  if (/선택|결정|진로|이직|사업|일|직장|시험|투자|방향/.test(q)) return 'decision';
  if (/지치|힘들|불안|우울|회복|치유|휴식|건강|마음|위로/.test(q)) return 'healing';
  return 'reflection';
}

export function calculateEleusinianMysteries(
  profile: UserProfile,
  options?: { contextText?: string; question?: string; now?: Date }
): EleusinianReport {
  let birthYear = 1990;
  let birthMonth = 6;
  let birthDay = 15;
  let birthHour = 12;

  const birthDate = profile?.basic?.birthdate;
  const birthTime = profile?.basic?.birthtime;
  const now = options?.now ?? new Date();
  const question = (options?.question || options?.contextText || '').trim();
  const questionTheme = classifyEleusinianTheme(question);

  if (birthDate) {
    const parts = birthDate.split('-').map(Number);
    if (parts.length >= 3 && !isNaN(parts[0])) {
      birthYear = parts[0];
      birthMonth = parts[1];
      birthDay = parts[2];
    }
  }

  if (birthTime) {
    const tParts = birthTime.split(':').map(Number);
    if (tParts.length >= 1 && !isNaN(tParts[0])) {
      birthHour = tParts[0];
    }
  }

  let qSeed = 0;
  for (let i = 0; i < question.length; i++) qSeed = (qSeed * 31 + question.charCodeAt(i)) & 0x7fffffff;

  // 1. 입사 등급 산출
  const gradeIdx = (Math.abs(birthYear + birthMonth * 3 + birthDay * 5 + birthHour * 7 + qSeed) % 3);
  const currentGrade = INITIATION_GRADES[gradeIdx];

  // 2. 신비의례 국면 산출
  const stationIdx = (Math.abs(birthYear * 2 + birthMonth * 7 + birthDay * 11 + birthHour * 13 + now.getUTCDate() + qSeed) % 4);
  const activeStation = MYSTIC_STATIONS[stationIdx];

  // 3. 에포프테이아 영혼 부활 국면 (내부 인덱스 -> 정성적 표현)
  const epoptiaRebirthScore = Math.min(99, Math.max(65, Math.round(
    72 + ((birthYear * 3 + birthMonth * 5 + birthDay * 7) % 27)
  )));
  const rebirthPosture = epoptiaRebirthScore >= 88
    ? '겨울의 침묵을 뚫고 새싹이 솟아오르는 에포프테이아 개화 국면'
    : epoptiaRebirthScore >= 78
      ? '내면의 씨앗을 묵묵히 품고 계절의 전환을 준비하는 성숙 국면'
      : '묵은 찌꺼기를 씻어내며 본래의 빛을 회복해 가는 정화 국면';

  // 4. 신성 상징
  const symbolIdx = (birthDay + birthMonth + birthYear + qSeed) % SACRED_SYMBOLS.length;
  const sacredSymbol = SACRED_SYMBOLS[symbolIdx];

  const ORACLES = [
    '지하세계의 깊은 어둠을 통과해본 자만이 지상의 봄꽃이 얼마나 눈부신지 진정으로 이해하리라.',
    '한 알의 밀알이 땅에 떨어져 죽지 아니하면 한 알 그대로 있고, 죽으면 많은 열매를 맺느니라.',
    '두려움이라는 껍질을 깨고 나올 때, 당신은 이미 이전의 나약한 자아로 되돌아갈 수 없도다.',
    '성스러운 횃불이 어둠을 밝혔으니, 의심을 거두고 당신 영혼이 품은 원초적 빛을 신뢰하라.'
  ];
  const oracleMessage = ORACLES[(birthDay + stationIdx) % ORACLES.length];

  const themeGuidanceMap: Record<EleusinianQuestionTheme, { practice: string; ritual: string; reflection: string }> = {
    relationship: {
      practice: `데메테르와 페르세포네의 순환처럼, 모든 관계에도 겨울의 거리두기와 봄의 재회가 교차함을 인정해 보세요.`,
      ritual: '상대에게 서운했던 감정 하나를 억지로 누르지 말고 노트에 적어 씻어 보내기',
      reflection: '지금 이 관계에서 겨울처럼 얼어붙은 부분을 녹이기 위해 내가 먼저 건넬 수 있는 작은 온기는 무엇인가요?',
    },
    decision: {
      practice: `${activeStation.practicalVirtue} 결단 앞에서는 두려움을 피하기보다 본질이 살아남는 선택을 택하세요.`,
      ritual: '오늘 결정해야 할 문제의 가장 두려운 시나리오와 가장 빛나는 시나리오를 나란히 적어 보기',
      reflection: '내가 지금 망설이는 이유는 실패에 대한 두려움 때문인가요, 아니면 아직 때가 무르익지 않아서인가요?',
    },
    healing: {
      practice: `지하세계의 어둠도 씨앗이 뿌리를 내리는 시간입니다. 지금의 지침을 패배가 아닌 재생의 계절로 받아들이세요.`,
      ritual: '따뜻한 허브차나 물을 천천히 마시며 오늘 나 자신을 가장 괴롭혔던 자책 한 가지를 내려놓기',
      reflection: '고단했던 시간을 통과하며 내 안에 남게 된 가장 단단한 지혜는 무엇인가요?',
    },
    reflection: {
      practice: `${currentGrade.initiationGuidance} ${activeStation.practicalVirtue}`,
      ritual: '하루의 끝에서 2분간 조명을 낮추고 침묵 속에서 오늘의 마음 상태를 가만히 바라보기',
      reflection: '껍질을 깨고 나와야만 비로소 열매를 맺을 수 있는 내 삶의 오랜 습관은 무엇인가요?',
    },
  };
  const themed = themeGuidanceMap[questionTheme];

  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;
  const calculatedAtKst = kstDate.toISOString().replace('T', ' ').slice(0, 16) + ' KST';

  const telesterionWindow = kstHour >= 5 && kstHour < 10
    ? '일리소스 새벽 정화창 (카타르시스와 맑은 입문)'
    : kstHour >= 10 && kstHour < 17
      ? '아테네 아고라 낮 순례창 (현실의 씨앗 봉헌)'
      : kstHour >= 17 && kstHour < 22
        ? '횃불 행렬 황혼창 (텔레스테리온 문턱)'
        : '페르세포네 심야 밀의창 (침묵 속 에포프테이아 관조)';

  const seasonalCycle = kstMonth >= 3 && kstMonth <= 5
    ? '코레의 봄 귀환절 (아나바시스 · 새싹의 개화)'
    : kstMonth >= 6 && kstMonth <= 8
      ? '데메테르의 여름 성숙절 (풍요의 수확과 나눔)'
      : kstMonth >= 9 && kstMonth <= 11
        ? '보에드로미온 대신비절 (성스러운 이삭과 내면 침잠)'
        : '페르세포네의 겨울 하강절 (카타바시스 · 뿌리의 인내)';

  const temporalEleusinianRhythm = {
    calculatedAtKst,
    telesterionWindow,
    seasonalCycle,
    rhythmGuidance: `${telesterionWindow}과 ${seasonalCycle}이 맞물린 지금, 억지로 결과를 당기기보다 계절의 순환에 맞추어 다음 문턱을 준비하세요.`,
  };

  const eleusinianSynthesisMatrix = {
    gradeStationNexus: `${currentGrade.gradeTitle} × ${activeStation.stationName}`,
    thresholdTension: questionTheme === 'decision'
      ? '익숙한 껍질을 유지하려는 관성과 새로운 국면으로 건너가려는 부름 사이의 긴장'
      : '외부의 인정을 구하는 마음과 내면의 침묵 속에서 본질을 확인하려는 마음 사이의 긴장',
    initiationDirective: `${activeStation.practicalVirtue} (${sacredSymbol})`,
  };

  return {
    engineVersion: ELEUSINIAN_MYSTERIES_VERSION,
    calculatedAt: now.toISOString(),
    questionTheme,
    currentGrade,
    activeStation,
    epoptiaRebirthScore,
    rebirthPosture,
    sacredSymbol,
    oracleMessage,
    temporalEleusinianRhythm,
    eleusinianSynthesisMatrix,
    practiceGuidance: themed.practice,
    ritualAction: themed.ritual,
    reflectionFocus: themed.reflection,
    counselNote: `[엘레우시스 입사의례 성찰] ${currentGrade.gradeTitle} · ${activeStation.stationName} — ${themed.practice}`,
    boundaryNotice: '고대 엘레우시스 신비전의 순환·재생 상징을 빌려 온 정성적 성찰 관점이며, 확정적 예언이나 의학적·재정적 처방이 아닙니다.',
  };
}

export function formatEleusinianMysteriesPrompt(report: EleusinianReport): string {
  return `[고대 그리스 엘레우시스 신비주의(Eleusinian Mysteries) 영혼 입사의례 & 페르세포네 환원 엔진 (${report.engineVersion})]
- 질문 맥락: ${report.questionTheme} | 부활 국면: ${report.rebirthPosture}
- 입사 등급: ${report.currentGrade.gradeTitle} (${report.currentGrade.greekTerm})
  * 의식 층위: ${report.currentGrade.spiritualLevel}
  * 입사 지침: ${report.currentGrade.initiationGuidance}
- 신비의례 국면: ${report.activeStation.stationName}
  * 신화적 상징: ${report.activeStation.mythicArchetype}
  * 내적 변용: ${report.activeStation.innerTransformation}
  * 행동 미덕: ${report.activeStation.practicalVirtue}
- 시공간 밀의 리듬 (${report.temporalEleusinianRhythm.calculatedAtKst}): ${report.temporalEleusinianRhythm.telesterionWindow} / ${report.temporalEleusinianRhythm.seasonalCycle}
  * 리듬 지침: ${report.temporalEleusinianRhythm.rhythmGuidance}
- 입사 교차 매트릭스: ${report.eleusinianSynthesisMatrix.gradeStationNexus}
  * 문턱 긴장: ${report.eleusinianSynthesisMatrix.thresholdTension}
  * 입사 결단: ${report.eleusinianSynthesisMatrix.initiationDirective}
- 신성 상징물: ${report.sacredSymbol}
- 맥락별 실천 조언: ${report.practiceGuidance}
- 일상 의례: ${report.ritualAction}
- 성찰 질문: ${report.reflectionFocus}
- 엘레우시스 성소 신탁: "${report.oracleMessage}"
- 해석 경계: ${report.boundaryNotice}`;
}
