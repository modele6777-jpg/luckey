/**
 * 안달루시아 수피즘 이븐 아라비 존재의 단일성 및 28대 예언자 심장 영지 엔진 (ibnArabiWahdatAlWujudWisdomEngine.ts)
 *
 * 12~13세기 수피즘의 최고 스승 '알 샤이흐 알 아크바르(Al-Shaykh al-Akbar)' 무히딘 이븐 아라비 원전:
 * 《베젤의 지혜(Fusus al-Hikam)》 및 《메카 계시(Al-Futuhat al-Makkiyya)》 기반:
 *
 * 핵심 영지 체계:
 * 1. 존재의 단일성(Wahdat al-Wujud): 우주 만물은 오직 하나의 신성한 실재(Al-Haqq)가 비추어낸 다양한 거울의 투영이다.
 * 2. 신성한 자기현현(Tajalli): 매 순간 단 하나의 숨결도 중복됨 없이 끊임없이 새롭게 창조되는 빛의 자기표현.
 * 3. 완전한 인간(Al-Insan al-Kamil): 거울의 뒷면에 칠해진 수은처럼, 우주 전체의 신성한 이름들을 자신의 심장 속에 완벽히 반영하는 각성자.
 * 4. 심장의 영적 유연성(Taqallub): 어떠한 고정된 관념에도 갇히지 않고, 모든 존재의 양태 속에서 신성의 아름다움(Jamal)과 위엄(Jalal)을 발견하는 영혼의 순결함.
 */

import type { UserProfile } from '../sharedState';

export const IBN_ARABI_WAHDAT_ENGINE_VERSION = '2.2.0';

export interface PropheticHeartWisdom {
  prophetName: string;
  wisdomTitleKo: string;
  arabicFacet: string;
  spiritualVirtue: '초월적 순수성' | '우주적 자비' | '신비한 생명력' | '빛의 계시' | '영혼의 평정';
  heartMirrorQuality: string;
  contemplativePrescription: string;
  innerAlignmentScore: number; // 0 ~ 100
}

export interface IbnArabiWahdatAlWujudReport {
  engineVersion: string;
  timestamp: string;
  wahdatOnenessPerceptionScore: number; // 내부 참조용 (프롬프트 비노출)
  divineTajalliIllumination: number; // 내부 참조용 (프롬프트 비노출)
  perfectHumanMirrorIndex: number; // 내부 참조용 (프롬프트 비노출)
  heartPurityBarakah: number; // 내부 참조용 (프롬프트 비노출)
  dominantWisdom: PropheticHeartWisdom; // 현재 주재하는 심장의 예언자적 지혜
  situationalWahdatAudit: {
    questionTheme: 'love' | 'decision' | 'peace' | 'gnosis';
    jamalJalalBalance: string;
    heartMirrorClarity: string;
    taqallubGuidance: string;
  };
  temporalWahdatRhythm: {
    calculatedAtKst: string;
    tajalliHourWindow: string;
    seasonalBreath: string;
    rhythmGuidance: string;
  };
  wahdatSynthesisMatrix: {
    prophetVirtueNexus: string;
    mirrorPosture: string;
    contemplativeDirective: string;
  };
  ibnArabiMysticGuidance: string; // 이븐 아라비 영적 잠언
  heartMirrorContemplation: string; // 심장 거울 관조 리추얼
  boundaryNotice: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
}

const PROPHETIC_WISDOMS_BASE: Omit<PropheticHeartWisdom, 'innerAlignmentScore'>[] = [
  {
    prophetName: '아담 (Adam)',
    wisdomTitleKo: '신성한 전체성의 지혜 (Fass Hikmah Ilahiyyah)',
    arabicFacet: 'Al-Insan al-Kamil',
    spiritualVirtue: '초월적 순수성',
    heartMirrorQuality: '우주에 존재하는 모든 신성한 속성과 이름을 심장 안에 온전히 품어내는 무한한 포용력',
    contemplativePrescription: '자신을 세상의 파편으로 보지 말고, 온 우주가 내면의 심장 속에 고요히 담겨 있음을 묵상하십시오.',
  },
  {
    prophetName: '에녹/이드리스 (Idris)',
    wisdomTitleKo: '지고한 영적 고양의 지혜 (Fass Hikmah Quddusiyyah)',
    arabicFacet: 'Al-Uluww',
    spiritualVirtue: '빛의 계시',
    heartMirrorQuality: '물질의 중력을 벗어나 태양의 천계처럼 끝없이 높은 의식의 차원으로 상승하는 거룩한 빛',
    contemplativePrescription: '사소한 감정의 굴레에서 한 걸음 물러나, 높은 하늘의 시선으로 삶의 풍경을 너그럽게 관망하십시오.',
  },
  {
    prophetName: '아브라함 (Ibrahim)',
    wisdomTitleKo: '신성한 환대의 열광적 사랑 (Fass Hikmah Muhayyimiyyah)',
    arabicFacet: 'Al-Khullah (친밀한 벗)',
    spiritualVirtue: '우주적 자비',
    heartMirrorQuality: '영혼의 모든 세포가 신성한 사랑에 스며들어 어떤 존재도 차별 없이 환대하는 무조건적 온기',
    contemplativePrescription: '오늘 만나는 모든 사람과 사물을 신성이 보낸 손님으로 여기며 환한 미소로 영접하십시오.',
  },
  {
    prophetName: '모세 (Musa)',
    wisdomTitleKo: '시나이 산 불타는 떨기나무의 지혜 (Fass Hikmah Uluwiyyah)',
    arabicFacet: 'Kalam Allah (말씀의 현존)',
    spiritualVirtue: '영혼의 평정',
    heartMirrorQuality: '타오르되 재가 되지 않는 떨기나무처럼, 세상의 불길 속에서도 불멸의 고요함을 지키는 단호한 확신',
    contemplativePrescription: '외적인 소음이 거세질 때일수록 내면의 가장 깊은 중심에서 고요히 울리는 신성한 고요에 귀를 기울이십시오.',
  },
  {
    prophetName: '예수 (Isa)',
    wisdomTitleKo: '자비로운 숨결과 부활의 지혜 (Fass Hikmah Nabawiyyah)',
    arabicFacet: 'Nafas ar-Rahman (자비의 숨결)',
    spiritualVirtue: '신비한 생명력',
    heartMirrorQuality: '차가운 흙덩이에도 신선한 숨결을 불어넣어 영적 생명으로 되살려내는 치유와 자비의 기적',
    contemplativePrescription: '들이쉬는 숨마다 우주적 자비를 채우고, 내쉬는 숨마다 모든 피로와 두려움을 평화로 방출하십시오.',
  },
];

export function calculateIbnArabiWahdatAlWujud(
  profile?: UserProfile | null,
  referenceDate = new Date(),
  questionArg?: string,
): IbnArabiWahdatAlWujudReport {
  const question = (questionArg || '').trim();
  const seedString = `${profile?.basic?.birthdate || '1994-01-24'}_${profile?.basic?.birthtime || '12:00'}_${profile?.basic?.name || 'zeZE'}_${question}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash * 37 + seedString.charCodeAt(i)) >>> 0;
  }

  const day = referenceDate.getDate();
  const minute = referenceDate.getMinutes();

  const wisdoms: PropheticHeartWisdom[] = PROPHETIC_WISDOMS_BASE.map((w, idx) => {
    const score = Math.min(100, Math.max(35, 62 + ((hash + idx * 89 + day * 13 + minute * 5) % 36)));
    return {
      ...w,
      innerAlignmentScore: score,
    };
  });

  wisdoms.sort((a, b) => b.innerAlignmentScore - a.innerAlignmentScore);
  const dominantWisdom = wisdoms[0];

  const wahdatOnenessPerceptionScore = 70 + ((hash ^ (day * 17)) % 29);
  const divineTajalliIllumination = 66 + (((hash >> 2) ^ (minute * 11)) % 32);
  const perfectHumanMirrorIndex = 72 + (((hash >> 4) ^ (day * 21)) % 27);
  const heartPurityBarakah = 75 + (((hash >> 6) ^ (minute * 7)) % 24);

  const qLower = question.toLowerCase();
  const questionTheme: 'love' | 'decision' | 'peace' | 'gnosis' =
    /관계|연애|사랑|사람|가족|이별|갈등/.test(qLower)
      ? 'love'
      : /선택|결정|진로|일|직장|사업|방향/.test(qLower)
        ? 'decision'
        : /불안|지치|평화|위로|휴식|마음/.test(qLower)
          ? 'peace'
          : 'gnosis';

  const situationalWahdatAudit = {
    questionTheme,
    jamalJalalBalance: questionTheme === 'love'
      ? '아름다움(Jamal·자비와 환대)의 온기를 앞세워 관계의 경계를 녹이는 흐름'
      : '위엄(Jalal·고요한 중심)과 자비(Jamal)가 심장 거울 안에서 균형을 이루는 흐름',
    heartMirrorClarity: wahdatOnenessPerceptionScore >= 82
      ? '분별의 먼지가 가라앉아 사건 이면의 단일한 의미를 맑게 비추는 명경(明鏡) 국면'
      : '고정관념의 안개를 걷어내고 유연한 시선(Taqallub)을 회복하는 연마 국면',
    taqallubGuidance: dominantWisdom.contemplativePrescription,
  };

  const kstDate = new Date(referenceDate.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;
  const calculatedAtKst = kstDate.toISOString().replace('T', ' ').slice(0, 16) + ' KST';

  const tajalliHourWindow = kstHour >= 4 && kstHour < 9
    ? '사하르 새벽 현현창 (타잘리의 첫 숨결이 심장에 스며드는 시간)'
    : kstHour >= 9 && kstHour < 17
      ? '주흐르 정오 명징창 (만물 속에서 신성한 질서를 발견하는 낮 시간)'
      : kstHour >= 17 && kstHour < 22
        ? '마그립 황혼 환대창 (하루의 수고를 자비로 품어 안는 시간)'
        : '타하주드 심야 관조창 (고요한 어둠 속에서 빛나는 심장 거울)';

  const seasonalBreath = kstMonth >= 3 && kstMonth <= 5
    ? '봄의 나파스 알 라흐만 (만물이 새롭게 피어나는 자비의 숨결)'
    : kstMonth >= 6 && kstMonth <= 8
      ? '여름의 누르(빛) 절정기 (내면의 열정을 자비로 순화)'
      : kstMonth >= 9 && kstMonth <= 11
        ? '가을의 수렴절 (외부의 잎을 비우고 본질만 남기는 계절)'
        : '겨울의 킬와(침잠)절 (내면의 고요한 성소를 지키는 계절)';

  const temporalWahdatRhythm = {
    calculatedAtKst,
    tajalliHourWindow,
    seasonalBreath,
    rhythmGuidance: `${tajalliHourWindow}과 ${seasonalBreath}이 맞닿아 있습니다. 고정된 판단 하나를 내려놓을 때 새로운 의미가 거울에 비칩니다.`,
  };

  const wahdatSynthesisMatrix = {
    prophetVirtueNexus: `${dominantWisdom.prophetName} × ${dominantWisdom.spiritualVirtue}`,
    mirrorPosture: situationalWahdatAudit.heartMirrorClarity,
    contemplativeDirective: dominantWisdom.contemplativePrescription,
  };

  const ibnArabiMysticGuidance = `이븐 아라비의 지혜: "신은 그대의 심장 외에는 다른 처소를 원치 않으신다." 지금 당신의 심장 거울에는 [${dominantWisdom.prophetName}]의 [${dominantWisdom.wisdomTitleKo}]가 가장 맑게 비추어지고 있습니다.`;
  const heartMirrorContemplation = `[심장 거울 관조]: ${dominantWisdom.contemplativePrescription} (${dominantWisdom.heartMirrorQuality})`;
  const ritualAction = `[${dominantWisdom.prophetName} · ${dominantWisdom.spiritualVirtue}] ${dominantWisdom.contemplativePrescription}`;
  const reflectionFocus = `고정된 판단 하나를 내려놓고 '${dominantWisdom.spiritualVirtue}'의 시선으로 오늘 마주한 상황을 비추어 본다면 무엇이 달라집니까?`;

  return {
    engineVersion: IBN_ARABI_WAHDAT_ENGINE_VERSION,
    timestamp: referenceDate.toISOString(),
    wahdatOnenessPerceptionScore,
    divineTajalliIllumination,
    perfectHumanMirrorIndex,
    heartPurityBarakah,
    dominantWisdom,
    situationalWahdatAudit,
    temporalWahdatRhythm,
    wahdatSynthesisMatrix,
    ibnArabiMysticGuidance,
    heartMirrorContemplation,
    ritualAction,
    reflectionFocus,
    boundaryNotice: '안달루시아 수피즘 이븐 아라비의 영지주의 상징을 빌려 온 정성적 성찰 관점이며, 종교적 단정이나 의학적·재정적 처방이 아닙니다.',
    interpretiveBoundary: '안달루시아 수피즘 이븐 아라비의 영지주의 상징을 빌려 온 정성적 성찰 관점이며, 종교적 단정이나 의학적·재정적 처방이 아닙니다.',
  };
}

export function formatIbnArabiWahdatAlWujudPrompt(report: IbnArabiWahdatAlWujudReport): string {
  return `### 🪞 이븐 아라비 존재의 단일성(Wahdat al-Wujud) 심장 영지 실측 데이터 (v${report.engineVersion})
- **주재 예언자 지혜**: ${report.dominantWisdom.prophetName} - ${report.dominantWisdom.wisdomTitleKo} (${report.dominantWisdom.arabicFacet})
- **영적 덕목**: ${report.dominantWisdom.spiritualVirtue}
- **심장 거울 속성**: ${report.dominantWisdom.heartMirrorQuality}
- **질문 맥락 감사**: 테마(${report.situationalWahdatAudit.questionTheme}) · 자비/위엄 균형: ${report.situationalWahdatAudit.jamalJalalBalance}
  - 거울 명징도: ${report.situationalWahdatAudit.heartMirrorClarity}
- **시공간 타잘리 리듬 (${report.temporalWahdatRhythm.calculatedAtKst})**: ${report.temporalWahdatRhythm.tajalliHourWindow} / ${report.temporalWahdatRhythm.seasonalBreath}
  - 리듬 지침: ${report.temporalWahdatRhythm.rhythmGuidance}
- **심장 교차 매트릭스**: ${report.wahdatSynthesisMatrix.prophetVirtueNexus} — ${report.wahdatSynthesisMatrix.contemplativeDirective}
- **이븐 아라비 영적 잠언**: ${report.ibnArabiMysticGuidance}
- **심장 거울 관조 리추얼**: ${report.heartMirrorContemplation}
- **실천 의례(Ritual Action)**: ${report.ritualAction}
- **성찰 초점(Reflection Focus)**: ${report.reflectionFocus}
- **해석 경계**: ${report.boundaryNotice}`;
}

