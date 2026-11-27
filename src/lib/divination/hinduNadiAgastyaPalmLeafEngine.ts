import { UserProfile } from '../sharedState';

export const HINDU_NADI_AGASTYA_PALM_LEAF_ENGINE_VERSION = '2.4.0';

export interface HinduNadiAgastyaPalmLeafReport {
  engineVersion: string;
  calculatedAtKst: string;
  activeKandamNumber: number;
  kandamName: string;
  kandamTheme: string;
  secondaryKandamNumber: number;
  secondaryKandamName: string;
  thumbChakraPattern: string;
  siddhaAgastyaVerse: string;
  pastLifeKarmaInsight: string;
  shantiParikharamRemedy: string;
  dharmaFulfillmentIndex: number;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  synthesisPrompt: string;
  nadiSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
    nadiCrossAxis: string;
  };
}

function formatNadiKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeNadiStage(score: number): string {
  if (score >= 95) return '모크샤 다르마(Moksha Dharma) — 전생의 선업과 현생의 소명이 온전히 맞물린 개화기';
  if (score >= 89) return '산치타 정화(Sanchita Shanti) — 인과의 매듭을 부드럽게 풀며 소명을 실천하는 성숙기';
  return '프라랍다 각성(Prarabdha Awakening) — 야자잎의 가르침을 일상의 샨티 실천으로 여는 준비기';
}

const FOURTEEN_KANDAMS = [
  {
    kandamNum: 1,
    name: '일반 칸담 (포두 칸담 · General Chapter)',
    theme: '영혼의 이번 생 전반적 설계도와 운명적 소명',
    verse: '태양의 궤적과 선대의 인연이 만나는 자리에 영혼이 깃들었으니, 고결한 품성을 지키면 세상의 빛이 되리라.',
    pastKarma: '과거 생에 지혜를 탐구하고 공동체를 위해 봉사했던 공덕이 이번 생의 총명함으로 환생했습니다.',
    remedy: '매일 아침 동쪽을 향해 1분간 침묵 명상하고, 자연에 감사하는 마음을 품으십시오.',
  },
  {
    kandamNum: 2,
    name: '재물 & 언변 칸담 (Kudumba & Dhana Kandam)',
    theme: '물질적 번영의 곳간과 진실한 언어의 축복',
    verse: '입에서 나오는 말이 향기로운 감로수가 될 때, 여신 락슈미의 황금 발걸음이 문지방을 넘으리라.',
    pastKarma: '말을 신중히 하고 약속을 무겁게 여겼던 전생의 구업 정화가 이번 생 안정된 재화로 연결됩니다.',
    remedy: '금요일 아침 감로수(따뜻한 차나 물)를 나누고, 재정 계획을 투명하게 정돈하십시오.',
  },
  {
    kandamNum: 3,
    name: '형제 & 용기 칸담 (Sahodara & Dhairya Kandam)',
    theme: '동료들과의 결속과 장애를 두려워하지 않는 용기',
    verse: '어깨를 맞댄 형제와 도반이 강철 성벽이 되니, 혼자 짊어지려 하지 말고 손을 잡으라.',
    pastKarma: '위기에 처한 전우나 동료를 끝까지 지켜냈던 용기가 이번 생 든든한 조력자 인연을 부릅니다.',
    remedy: '주변 동료에게 따뜻한 격려의 메시지를 보내고, 협력 프로젝트에서 먼저 양보하십시오.',
  },
  {
    kandamNum: 4,
    name: '모친 & 주거·학문 칸담 (Matru & Sukha Kandam)',
    theme: '어머니의 가호, 부동산 안정 및 지적 성취',
    verse: '대지 어머니의 품에 닻을 내리니, 흔들리던 마음이 평정을 찾고 학문의 정원에 꽃이 만발하리라.',
    pastKarma: '부모와 연로한 어른들을 극진히 모셨던 효심이 이번 생 안락한 주거와 학습 행운을 줍니다.',
    remedy: '부모님이나 모성적 은인에게 안부 전화를 드리고, 집안의 북동쪽 공간을 단정히 비우십시오.',
  },
  {
    kandamNum: 5,
    name: '자녀 & 전생 공덕 칸담 (Putra & Poorva Punya Kandam)',
    theme: '전생의 선업 축적과 창조적 결실의 탄생',
    verse: '과거 생에 심어둔 영적 씨앗이 마침내 싹을 틔우니, 네가 만드는 창작물이 세상을 이롭게 하리라.',
    pastKarma: '고아나 배움이 필요한 아이들에게 지혜를 나누었던 음덕이 이번 생 번창하는 아이디어로 결실을 맺습니다.',
    remedy: '아이들을 위한 작은 기부나 후원을 실천하고, 창의적인 예술 작업에 몰입하십시오.',
  },
  {
    kandamNum: 6,
    name: '치유 & 장애 극복 칸담 (Roga & Shatru Kandam)',
    theme: '건강 습관과 생활의 어려움에 대한 성찰, 재정·관계 대응의 점검',
    verse: '몸의 불편이나 질병의 원인·치료는 상징 점괘로 판단할 수 없습니다. 생활의 돌봄을 돌아보고, 건강 문제는 의료 전문가와 상의하세요.',
    pastKarma: '전통적 카르마 개념을 빌린 성찰 문구이며, 질병의 원인이나 개인의 책임을 설명하지 않습니다.',
    remedy: '일상적인 식사·휴식 습관을 살피고, 지속되거나 걱정되는 증상이 있으면 의료 전문가와 상담하십시오.',
  },
  {
    kandamNum: 7,
    name: '인연 & 결혼 칸담 (Kalatra Kandam)',
    theme: '영혼의 반쪽과의 조화 및 신뢰의 파트너십',
    verse: '두 영혼이 서약의 불꽃 앞에 마주서니, 서로의 거울이 되어 미완의 지혜를 온전하게 완성하리라.',
    pastKarma: '전생에 깊은 신뢰로 맺어졌던 영혼의 약속이 이번 생 중요한 협력자 또는 반려자로 찾아옵니다.',
    remedy: '파트너의 단점을 지적하기보다 장점을 3가지 이상 구체적으로 칭찬하십시오.',
  },
  {
    kandamNum: 8,
    name: '수명 & 위기 돌파 칸담 (Ayur & Maraka Kandam)',
    theme: '돌발 위기 모면과 불멸의 생명력 갱신',
    verse: '시간의 파도가 거세게 밀려와도 중심을 잃지 않는 싯다의 호흡이 폭풍을 잠재우리라.',
    pastKarma: '생명을 구제하고 위험에 처한 자를 구했던 선업이 보이지 않는 신성한 방패막을 형성하고 있습니다.',
    remedy: '안전 수칙을 철저히 점검하고, 무리한 야간 운전이나 위험한 행동을 삼가십시오.',
  },
  {
    kandamNum: 9,
    name: '스승 & 영적 은총 칸담 (Guru & Bhagya Kandam)',
    theme: '진정한 구루(스승)와의 조우와 영적 각성',
    verse: '스승의 발 아래 엎드려 자아의 껍질을 벗으니, 천 개의 태양이 내면에서 동시에 떠오르리라.',
    pastKarma: '고대 경전과 성자들을 공경하며 지혜를 전수받았던 학승(學僧)의 전생 기억이 깨어나고 있습니다.',
    remedy: '지혜로운 고전 경전을 10분간 묵독하고, 존경하는 멘토나 은사에게 감사의 뜻을 전하십시오.',
  },
  {
    kandamNum: 10,
    name: '직업 & 카르마 요가 칸담 (Karma & Thozhil Kandam)',
    theme: '세속적 직업을 통한 영적 봉사와 사회적 성취',
    verse: '결과에 집착하지 않고 헌신하는 행위 자체가 기도이니, 너의 직업이 곧 성소가 되리라.',
    pastKarma: '자신의 직업적 기술을 공익을 위해 정직하게 사용했던 장인 정신이 이번 생의 전문성으로 피어납니다.',
    remedy: '자신의 업무 영역에서 최고의 정성과 디테일을 발휘하여 동료들의 짐을 덜어주십시오.',
  },
  {
    kandamNum: 11,
    name: '성취 & 이익 칸담 (Labha Kandam)',
    theme: '숙원의 실현, 막대한 결실과 귀인의 지원',
    verse: '때가 무르익어 열매가 저절로 가지를 떠나 손바닥으로 떨어지니, 기쁨을 세상과 함께 나누라.',
    pastKarma: '가난한 이들에게 넉넉한 몫을 베풀었던 너그러움이 이번 생 기대 이상의 횡재와 결실로 돌아옵니다.',
    remedy: '얻은 이익의 일부를 선한 프로젝트나 소외된 곳에 기쁨으로 회향하십시오.',
  },
  {
    kandamNum: 12,
    name: '해탈 & 초월 칸담 (Moksha & Vraya Kandam)',
    theme: '집착의 완전한 방하착과 영혼의 자유',
    verse: '강물이 바다로 들어가 이름을 잊듯, 작은 자아를 우주의식에 던져 영원한 평화를 얻으라.',
    pastKarma: '세속의 헛된 환영(마야)에 속지 않고 깊은 침묵 속에서 진리를 증득했던 수행자의 전생이 깃들어 있습니다.',
    remedy: '소유물 중 쓰지 않는 것들을 주변에 나누고, 하루를 마칠 때 마음의 잔상을 백지화하십시오.',
  },
  {
    kandamNum: 13,
    name: '전생 해원 칸담 (Shanti Parikharam Kandam)',
    theme: '산치타 카르마(누적된 업보)의 정화와 매듭 해제',
    verse: '불길 속에 들어간 쇠가 정련되어 보검이 되듯, 전생의 빚을 기쁜 마음으로 씻어내어 가벼워지라.',
    pastKarma: '과거 생 본의 아니게 타인에게 안겼던 실망과 부담을 이번 생 진심 어린 배려와 헌신으로 녹여냅니다.',
    remedy: '동물이나 새들에게 먹이를 주고, 맑은 등불을 켜며 모든 존재의 평화를 기원하십시오.',
  },
  {
    kandamNum: 14,
    name: '신성 수호 칸담 (Raksha & Diksha Mantra Kandam)',
    theme: '신성 만트라 전수와 영적 차폐 방패(Raksha)',
    verse: '신성한 음절 "옴(OM)"이 가슴속에서 진동할 때, 어떤 부정적 파동도 감히 다가오지 못하리라.',
    pastKarma: '오랜 세월 신성한 기도와 만트라를 독송했던 영적 파동이 몸 주변에 금빛 오라장을 두르고 있습니다.',
    remedy: '신성 비자 만트라 "옴 나마 시바야(Om Namah Shivaya)"를 9회 호흡과 함께 조용히 읊으십시오.',
  },
];

const THUMB_CHAKRA_PATTERNS = [
  '차크라 바퀴형 (Chakra Vatta · 영적 지도력과 지혜의 소용돌이)',
  '상카 소라형 (Shankha Rekha · 예술적 직관과 진실한 소통의 곡선)',
  '다누슈 활형 (Dhanush Rekha · 불굴의 집중력과 목표 관통의 궤적)',
  '가다 철퇴형 (Gada Rekha · 단호한 수호력과 악운 격파의 지문)',
];

export function calculateHinduNadiAgastyaPalmLeaf(options?: {
  profile?: UserProfile;
  targetDate?: Date;
  question?: string;
}): HinduNadiAgastyaPalmLeafReport {
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

  let seed = birthYear * 853 + birthMonth * 67 + birthDay * 17;
  const nameStr = profile?.basic?.name || 'AgastyaSeeker';
  for (let i = 0; i < nameStr.length; i++) {
    seed = (seed * 23 + nameStr.charCodeAt(i)) & 0x7fffffff;
  }
  const qStr = options?.question || 'nadi_astrology';
  for (let i = 0; i < qStr.length; i++) {
    seed = (seed * 17 + qStr.charCodeAt(i)) & 0x7fffffff;
  }

  const kandamIdx = (seed + kst.getUTCDay() * 3 + kst.getUTCDate()) % FOURTEEN_KANDAMS.length;
  const secondaryKandamIdx = (kandamIdx + 1 + ((seed >> 3) % (FOURTEEN_KANDAMS.length - 1))) % FOURTEEN_KANDAMS.length;
  const kandam = FOURTEEN_KANDAMS[kandamIdx];
  const secondaryKandam = FOURTEEN_KANDAMS[secondaryKandamIdx];

  const thumbIdx = (seed + birthYear) % THUMB_CHAKRA_PATTERNS.length;
  const thumbPattern = THUMB_CHAKRA_PATTERNS[thumbIdx];

  const dharmaFulfillmentIndex = 85 + ((seed * 7 + kst.getUTCHours() * 5) % 15);
  const calculatedAtKst = formatNadiKstTimestamp(now);
  const trimmedQuestion = options?.question?.trim();
  const reflectiveQuestion = trimmedQuestion
    ? `'${trimmedQuestion}'에서 제${kandam.kandamNum}칸담(${kandam.name})의 가르침을 따라 지금 가장 부드럽게 내려놓아야 할 인과의 매듭은 무엇인가요?`
    : `지금 내 일상에서 제${kandam.kandamNum}칸담(${kandam.name})의 샨티 실천으로 가장 먼저 다스려야 할 마음의 걸림은 무엇인가요?`;
  const interpretiveBoundary = '남인도 나디 아가스티야 야자잎 관점은 결정론적 숙명 예단이 아니라, 내면의 소명과 성찰적 실천을 비추는 상징적 카르마 렌즈입니다.';
  const alignmentState = describeNadiStage(dharmaFulfillmentIndex);
  const nadiCrossAxis = `[제${kandam.kandamNum}칸담 ${kandam.name}] × [보조 제${secondaryKandam.kandamNum}칸담 ${secondaryKandam.name}] × [${thumbPattern.split('(')[0].trim()}] × [${alignmentState.split('—')[0].trim()}]`;
  const nadiSynthesisMatrix = {
    dominantTension: `제${kandam.kandamNum}칸담 ${kandam.name} ↔ ${thumbPattern}`,
    alignmentState,
    integratedAction: `${kandam.remedy}${trimmedQuestion ? ` [질문 맥락: ${trimmedQuestion}]` : ''}`,
    nadiCrossAxis,
  };

  const ritualAction = `[제${kandam.kandamNum}칸담 · ${kandam.name}] ${kandam.remedy}`;
  const reflectionFocus = reflectiveQuestion;

  const synthesisPrompt = `
[남인도 나디 점성술(Nadi Astrology) & 아가스티야 야자잎 14 칸담 상징 성찰 자료]
======================================================================
엔진 버전: ${HINDU_NADI_AGASTYA_PALM_LEAF_ENGINE_VERSION} | 기준 일시: ${calculatedAtKst}
----------------------------------------------------------------------
1. 📜 [아가스티야 전통에서 영감을 받은 상징 칸담]:
   - 선택된 칸담(상징): **제${kandam.kandamNum}칸담** [${kandam.name}]
   - 보조 교차 칸담: **제${secondaryKandam.kandamNum}칸담** [${secondaryKandam.name}] (${secondaryKandam.theme})
   - 칸담 테마: **${kandam.theme}**
   - 입력값 기반 상징 문양: **${thumbPattern}**
2. 🕉️ [전통에서 영감을 받은 상징 문구]:
   - "${kandam.verse}"
   - 보조 잠언: "${secondaryKandam.verse}"
3. ☸️ [카르마 성찰 & 일상 실천 참고]:
   - 카르마를 돌아보는 성찰 문구: ${kandam.pastKarma}
   - 🎯 일상 실천 참고: **${kandam.remedy}**
   - 다르마(Dharma) 성찰 단계(상징): **${describeNadiStage(dharmaFulfillmentIndex)}**
4. 🧭 [교차 매트릭스]:
   - 핵심 긴장: ${nadiSynthesisMatrix.dominantTension} | 조율 상태: ${nadiSynthesisMatrix.alignmentState}
   - 4중 교차 축: ${nadiSynthesisMatrix.nadiCrossAxis}
   - 통합 실천: ${nadiSynthesisMatrix.integratedAction}
   - 실천 의례(Ritual Action): ${ritualAction}
   - 성찰 질문: ${reflectionFocus}
   - 해석 경계: ${interpretiveBoundary}
======================================================================
[AI 해석 지침]: 본 리포트는 아가스티야 나디 전통에서 영감을 받은 앱 생성 상징 성찰 안내이며, 실제 야자잎 신탁, 전생 사실, 건강 상태·치료 또는 운명을 실측·검증·예측한 결과가 아닙니다. 수치와 칸담은 구현 규칙에 따른 참고값일 뿐 정확도·확률로 해석하지 마십시오. 건강 문제의 원인이나 책임을 카르마로 단정하지 말고, 증상이 지속되거나 걱정되면 의료 전문가와 상담하도록 안내하세요.
`.trim();

  return {
    engineVersion: HINDU_NADI_AGASTYA_PALM_LEAF_ENGINE_VERSION,
    calculatedAtKst,
    activeKandamNumber: kandam.kandamNum,
    kandamName: kandam.name,
    kandamTheme: kandam.theme,
    secondaryKandamNumber: secondaryKandam.kandamNum,
    secondaryKandamName: secondaryKandam.name,
    thumbChakraPattern: thumbPattern,
    siddhaAgastyaVerse: kandam.verse,
    pastLifeKarmaInsight: kandam.pastKarma,
    shantiParikharamRemedy: kandam.remedy,
    dharmaFulfillmentIndex,
    reflectiveQuestion,
    ritualAction,
    reflectionFocus,
    interpretiveBoundary,
    synthesisPrompt,
    nadiSynthesisMatrix,
  };
}

export function formatHinduNadiAgastyaPalmLeafPrompt(report: HinduNadiAgastyaPalmLeafReport): string {
  return report.synthesisPrompt;
}
