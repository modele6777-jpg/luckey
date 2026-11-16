import { UserProfile } from '../sharedState';

export const YORUBA_IFA_ODU_ENGINE_VERSION = '2.1.0';

export interface YorubaIfaOduReport {
  engineVersion: string;
  calculatedAtKst: string;
  oduName: string;
  oduYoruba: string;
  elementalForce: string;
  orishaGuide: string;
  opeleBinaryPattern: string;
  ireBlessingType: string;
  karmicWarning: string;
  eboPrescription: string;
  destinyAlignmentScore: number;
  alignmentStage: string;
  situationalIfaFocus: {
    focusTheme: string;
    orishaCounsel: string;
  };
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  synthesisPrompt: string;
  ifaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function describeIfaAlignmentStage(score: number): string {
  if (score >= 93) return '오리샤 공명 절정기 (내면의 소명과 오두의 흐름이 선명히 맞닿는 국면)';
  if (score >= 86) return '조화로운 순풍기 (인내와 실천이 자연스럽게 축복으로 이어지는 국면)';
  return '고요한 정돈기 (속도를 낮추고 경계와 에보를 먼저 가다듬을 때 열리는 국면)';
}

const SIXTEEN_MEJI_ODUS = [
  {
    name: '에지 오그베',
    yoruba: 'Eji Ogbe (Ògbè Méjì)',
    pattern: 'I I / I I / I I / I I (1111-1111)',
    force: '순수한 백색 빛과 생명의 원초적 팽창력',
    orisha: '올로둠마레(창조주) & 오바탈라(순결과 자비의 빛)',
    blessing: 'Ire Aiku (무병장수와 영적 성취의 축복)',
    warning: '자만심과 교만을 경계하고, 타인의 의견을 온화하게 수용할 때 정상의 자리를 지킬 수 있습니다.',
    ebo: '순백색 의복 착용, 맑은 샘물 공양, 억울한 처지의 사람에게 자애로운 지원 베풀기',
  },
  {
    name: '오예쿠 메지',
    yoruba: 'Oyeku Meji (Ọ̀yẹ̀kú Méjì)',
    pattern: 'II II / II II / II II / II II (0000-0000)',
    force: '신성한 밤의 안식과 조상령(Egungun)의 강력한 차폐막',
    orisha: '예군군(조상신) & 얌마야(심해의 어머니)',
    blessing: 'Ire Aje (위기 극복 후 주어지는 견고한 재물 복덕)',
    warning: '어둠과 침체의 시기일수록 성급한 투자를 멈추고 선대의 가르침과 내면의 지혜를 되새기십시오.',
    ebo: '조상에 대한 감사 묵상, 고요한 공간에서의 정좌, 나이 든 은인에게 감사 표현',
  },
  {
    name: '이워리 메지',
    yoruba: 'Iwori Meji (Ìwòrì Méjì)',
    pattern: 'II II / I I / I I / II II (0110-0110)',
    force: '사물의 심연을 꿰뚫는 제3의 눈과 통찰 직관',
    orisha: '오룬밀라(운명과 지혜의 대스승) & 에슈(통찰의 문지기)',
    blessing: 'Ire Imo (심오한 영적 안목과 진실 분별의 축복)',
    warning: '눈앞의 겉모습이나 감언이설에 속지 말고, 직관이 울리는 미세한 경고음을 신뢰하십시오.',
    ebo: '명상과 일기 쓰기를 통한 자기 성찰, 타인의 비밀을 엄격히 지켜주는 신의',
  },
  {
    name: '오디 메지',
    yoruba: 'Odi Meji (Òdí Méjì)',
    pattern: 'I I / II II / II II / I I (1001-1001)',
    force: '견고한 보호의 성벽과 새로운 생명의 자궁',
    orisha: '예모야(자양의 모성) & 오샤라(신성 성채의 수호신)',
    blessing: 'Ire Omo (새로운 결실, 탄생, 가택 안정의 축복)',
    warning: '외부의 소음과 침범으로부터 자신의 경계선을 명확히 긋고 에너지를 지키십시오.',
    ebo: '주거 및 작업 공간의 소금 정화, 가족과의 따뜻한 식사 나누기',
  },
  {
    name: '이로순 메지',
    yoruba: 'Irosun Meji (Ìrosùn Méjì)',
    pattern: 'I I / I I / II II / II II (1100-1100)',
    force: '선조의 붉은 열정과 영광으로 도약하는 불꽃',
    orisha: '오순(황금빛 사랑과 미) & 샨고(정의와 천둥)',
    blessing: 'Ire Isegun (명예로운 평판과 예술적 영감의 축복)',
    warning: '분노나 충동적인 승부욕으로 일을 그르치지 말고, 냉철한 온도로 열정을 조율하십시오.',
    ebo: '선한 목적을 가진 예술/창작 활동 몰입, 붉은색 과일이나 따뜻한 차 나누기',
  },
  {
    name: '오원린 메지',
    yoruba: 'Owonrin Meji (Ọ̀wọ́nrín Méjì)',
    pattern: 'II II / II II / I I / I I (0011-0011)',
    force: '예기치 못한 돌풍을 순풍으로 뒤바꾸는 대역전의 바람',
    orisha: '오야(변혁과 폭풍의 바람) & 에슈',
    blessing: 'Ire Itesiwaju (역경을 딛고 비약하는 극적인 번영 축복)',
    warning: '변화의 파도에 저항하지 말고 유연하게 몸을 맡기되, 기본 윤리와 중심을 잃지 마십시오.',
    ebo: '오래된 물건 정리와 비우기, 주변인에 대한 불만 대신 감사 목록 작성',
  },
  {
    name: '오바라 메지',
    yoruba: 'Obara Meji (Ọ̀bàrà Méjì)',
    pattern: 'I I / II II / II II / II II (1000-1000)',
    force: '가난의 멍에를 벗겨내고 황금빛 풍요를 부르는 지혜의 언변',
    orisha: '오바탈라 & 샨고(왕권과 위엄)',
    blessing: 'Ire Aje Owo (물질적 결핍 해소와 풍요로운 재화 유입)',
    warning: '말실수나 허세로 타인의 시기를 사지 않도록 진실되고 겸손한 어조를 유지하십시오.',
    ebo: '약속을 철저히 지키기, 어려운 이웃을 위한 기부나 식사 나눔',
  },
  {
    name: '오칸란 메지',
    yoruba: 'Okanran Meji (Ọ̀kànràn Méjì)',
    pattern: 'II II / II II / II II / I I (0001-0001)',
    force: '정의로운 분노를 돌파의 동력으로 바꾸는 천둥의 결단',
    orisha: '샨고(불과 천둥의 왕)',
    blessing: 'Ire Agbara (결단력과 단호한 실행력의 축복)',
    warning: '독선적이거나 호전적인 태도는 불필요한 적을 만드니, 부드러운 단호함(Gentle Firmness)을 취하십시오.',
    ebo: '명확한 결단 내리기, 불필요한 우유부단함 청산, 신체 활력을 돕는 운동',
  },
  {
    name: '오군다 메지',
    yoruba: 'Ogunda Meji (Ògúndá Méjì)',
    pattern: 'I I / I I / I I / II II (1110-1110)',
    force: '모든 막힌 길을 베어 열어젖히는 오군의 신성한 철검',
    orisha: '오군(철과 개척, 승리의 오리샤)',
    blessing: 'Ire Isegun Lona (난관 타개와 경쟁에서의 압도적 승리)',
    warning: '도구와 기술을 다룰 때 사고를 주의하고, 물리적 충돌 대신 지혜로운 전략으로 승부하십시오.',
    ebo: '업무 도구와 컴퓨터 환경 정돈, 끈기 있는 장인 정신으로 당면 과제 매듭짓기',
  },
  {
    name: '오사 메지',
    yoruba: 'Osa Meji (Ọ̀sá Méjì)',
    pattern: 'II II / I I / I I / I I (0111-0111)',
    force: '신비로운 직관과 영혼을 치유하는 어머니들의 신성한 바람',
    orisha: '이야미 오소롱가(영적 모성) & 오야',
    blessing: 'Ire Alafia (내면의 깊은 평화와 영적 보호의 축복)',
    warning: '두려움이나 의심 때문에 도망치지 말고, 자신의 영적 감수성을 긍정하고 존중하십시오.',
    ebo: '자연(숲이나 정원)과의 교감, 여성 조상이나 헌신적인 여성 멘토에 대한 존경 표하기',
  },
  {
    name: '이카 메지',
    yoruba: 'Ika Meji (Ìká Méjì)',
    pattern: 'II II / I I / II II / II II (0100-0100)',
    force: '유혹과 독소를 해독하고 자신을 지켜내는 뱀의 지혜',
    orisha: '오슌마레(무지개와 순환의 뱀 오리샤)',
    blessing: 'Ire Isora (액운 차단과 자기 통제력 완성의 축복)',
    warning: '시기심이나 악의를 품은 인연의 감정적 덫에 휘말리지 않도록 거리를 유지하십시오.',
    ebo: '부정적 언행 차단, 신체 해독(디톡스)과 충분한 수분 섭취, 감사 기도',
  },
  {
    name: '오투루폰 메지',
    yoruba: 'Oturupon Meji (Òtúrúpọ̀n Méjì)',
    pattern: 'II II / II II / I I / II II (0010-0010)',
    force: '어려움을 품어 위대한 생명으로 부화시키는 인내의 대지',
    orisha: '바바루 아예(치유와 질병 극복의 성자)',
    blessing: 'Ire Ilera (신체적 회복과 만성적 피로 치유의 축복)',
    warning: '무리한 과로로 건강을 해치지 말고, 충분한 수면과 휴식을 통해 내적 활력을 복원하십시오.',
    ebo: '충분한 휴식과 스트레칭, 무리한 스케줄 축소, 청결한 위생 유지',
  },
  {
    name: '오투라 메지',
    yoruba: 'Otura Meji (Òtúrá Méjì)',
    pattern: 'I I / II II / I I / I I (1011-1011)',
    force: '갈등을 평화로 녹여내는 온화한 진리와 외교의 빛',
    orisha: '오바탈라 & 오룬밀라',
    blessing: 'Ire Alafia Gbogbo (원만한 대인 관계와 계약 성사의 축복)',
    warning: '사소한 자존심 때문에 중요한 협상을 깨뜨리지 말고, 타협과 경청의 미덕을 발휘하십시오.',
    ebo: '친절하고 정중한 메시지 보내기, 상대방의 입장을 먼저 배려하는 대화',
  },
  {
    name: '이레테 메지',
    yoruba: 'Irete Meji (Ìrẹtẹ̀ Méjì)',
    pattern: 'I I / I I / II II / I I (1101-1101)',
    force: '대지를 딛고 당당히 전진하는 성스러운 발걸음과 위엄',
    orisha: '오룬밀라 & 오군',
    blessing: 'Ire Igbega (사회적 지위 상승과 인정의 축복)',
    warning: '발걸음이 정당하지 않은 길에는 눈길을 주지 말고, 오직 정정당당한 방식으로 승리하십시오.',
    ebo: '신발 정돈, 올바른 보폭으로 산책하기, 공적 업무에서의 투명한 절차 준수',
  },
  {
    name: '오세 메지',
    yoruba: 'Ose Meji (Ọ̀sẹ́ Méjì)',
    pattern: 'I I / II II / I I / II II (1010-1010)',
    force: '풍요로운 감성과 황금빛 매력, 사랑과 기쁨의 감로수',
    orisha: '오슌(사랑, 아름다움, 다산의 여신)',
    blessing: 'Ire Ife (진실한 사랑과 감정적 교감, 예술적 번창의 축복)',
    warning: '사치나 감정의 과잉 기복을 경계하고, 내적인 품격과 단아함을 잃지 마십시오.',
    ebo: '향기로운 캔들이나 꽃 장식, 소중한 사람에게 애정 어린 칭찬 전하기',
  },
  {
    name: '오푼 메지',
    yoruba: 'Ofun Meji (Òfún Méjì)',
    pattern: 'II II / I I / II II / I I (0101-0101)',
    force: '모든 오두를 탄생시킨 창조의 원천이자 지고한 거룩함',
    orisha: '올로둠마레 & 오바탈라(태고의 백색 빛)',
    blessing: 'Ire Iye (영적 깨달음과 총체적 구원의 축복)',
    warning: '금기(Taboo)를 엄수하고 성스러운 약속을 가볍게 여기지 마십시오.',
    ebo: '백색 소금 정화, 새벽 시간 명상, 순수한 마음가짐으로 하루 시작',
  },
];

export function calculateYorubaIfaOdu(options?: {
  profile?: UserProfile;
  targetDate?: Date;
  question?: string;
}): YorubaIfaOduReport {
  const profile = options?.profile;
  const now = options?.targetDate || new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  let birthYear = 1990;
  let birthMonth = 1;
  let birthDay = 1;

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      birthYear = parts[0];
      birthMonth = parts[1];
      birthDay = parts[2];
    }
  }

  let seed = birthYear * 997 + birthMonth * 89 + birthDay * 13;
  const nameStr = profile?.basic?.name || 'OrunmilaSeeker';
  for (let i = 0; i < nameStr.length; i++) {
    seed = (seed * 31 + nameStr.charCodeAt(i)) & 0x7fffffff;
  }
  const qStr = options?.question || 'destiny_ifa';
  for (let i = 0; i < qStr.length; i++) {
    seed = (seed * 19 + qStr.charCodeAt(i)) & 0x7fffffff;
  }

  const oduIndex = (seed + kst.getUTCDay() * 7 + kst.getUTCDate()) % SIXTEEN_MEJI_ODUS.length;
  const odu = SIXTEEN_MEJI_ODUS[oduIndex];

  const destinyAlignmentScore = 80 + ((seed * 11 + kst.getUTCHours() * 3) % 19);
  const alignmentStage = describeIfaAlignmentStage(destinyAlignmentScore);
  const kstIso = `${kst.toISOString().slice(0, 19)}+09:00`;
  const situationalIfaFocus = /관계|연애|사람|가족|갈등/.test(qStr)
    ? {
        focusTheme: '관계 공명과 말의 신의(Iwa Pele)',
        orishaCounsel: '감정이 앞설수록 오두의 온화한 품격으로 상대의 입장을 먼저 헤아리십시오.',
      }
    : /일|사업|직장|돈|재물|결정/.test(qStr)
      ? {
          focusTheme: '소명 결단과 에보(Ebó) 실행',
          orishaCounsel: '막힌 지점을 한 번에 부수기보다 작은 정돈과 약속 이행으로 활로를 여십시오.',
        }
      : {
          focusTheme: '운명 정렬과 내면의 균형',
          orishaCounsel: '오늘의 오두가 비추는 본질적 태도를 일상 한 가지 선택에 곧장 적용해 보십시오.',
        };
  const dailyPracticeRitual = `${odu.ebo} — 오늘 하루 부담 없는 한 가지 정화 행동으로 오두의 흐름을 현실에 고정하십시오.`;
  const reflectiveQuestion = `${odu.name}의 시선으로 볼 때, 지금 내가 억지로 붙잡거나 미루고 있는 선택 한 가지는 무엇인가요?`;
  const interpretiveBoundary = '본 이파(Ifá) 오두 결과는 서아프리카 구전 신탁 상징에 기반한 정성적 성찰 안내이며, 확정적 길흉 예단이 아닙니다.';

  const trimmedQ = (options?.question || '').trim();
  const ifaSynthesisMatrix = {
    dominantTension: `${odu.name} (${odu.orisha}) ↔ ${situationalIfaFocus.focusTheme}`,
    alignmentState: `${alignmentStage} · ${odu.blessing}`,
    integratedAction: `${dailyPracticeRitual}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  const synthesisPrompt = `
[서아프리카 요루바 이파(Ifá) 16 오두 & 오룬밀라 운명의 지혜 정성 리포트]
======================================================================
엔진 버전: ${YORUBA_IFA_ODU_ENGINE_VERSION} | 기준 일시: ${kstIso}
----------------------------------------------------------------------
1. 📿 [신성 오두(Odu Ifá) & 오펠레 신탁 체인]:
   - 주재 오두: **${odu.name}** [${odu.yoruba}]
   - 오펠레 바이너리 비트 패턴: \`${odu.pattern}\`
   - 영적 원형 에너지: **${odu.force}**
   - 수호 오리샤(Orisha): **${odu.orisha}**
2. 🌟 [축복(Ire) & 질문 맥락 초점]:
   - 도래하는 축복: **${odu.blessing}**
   - 질문 맥락 (${situationalIfaFocus.focusTheme}): ${situationalIfaFocus.orishaCounsel}
   - 오룬밀라의 카르마적 경계: "${odu.warning}"
3. 🕊️ [에보(Ebó) 현실 행동 처방 & 공명 단계]:
   - 영혼 소명 정렬 단계: **${alignmentStage}**
   - 오늘의 에보 실천: **${dailyPracticeRitual}**
   - 성찰 질문: ${reflectiveQuestion}
   - 해석 경계: ${interpretiveBoundary}
4. 🧭 [이파 교차 매트릭스]:
   - 핵심 긴장: ${ifaSynthesisMatrix.dominantTension}
   - 조율 상태: ${ifaSynthesisMatrix.alignmentState}
   - 통합 실천: ${ifaSynthesisMatrix.integratedAction}
======================================================================
[AI 해석 절대 지침]: 본 리포트는 유네스코 인류무형문화유산인 서아프리카 정통 이파(Ifá) 16 메지 오두 체계에 입각한 순수 정성적 신탁 데이터입니다. 숫자 점수 없이 오두의 상징과 에보(Ebó) 행동 처방을 상담자의 현실 고민과 따뜻하게 연결하십시오.
`.trim();

  return {
    engineVersion: YORUBA_IFA_ODU_ENGINE_VERSION,
    calculatedAtKst: kstIso,
    oduName: odu.name,
    oduYoruba: odu.yoruba,
    elementalForce: odu.force,
    orishaGuide: odu.orisha,
    opeleBinaryPattern: odu.pattern,
    ireBlessingType: odu.blessing,
    karmicWarning: odu.warning,
    eboPrescription: odu.ebo,
    destinyAlignmentScore,
    alignmentStage,
    situationalIfaFocus,
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
    synthesisPrompt,
    ifaSynthesisMatrix,
  };
}

export function formatYorubaIfaOduPrompt(report: YorubaIfaOduReport): string {
  return report.synthesisPrompt;
}
