/**
 * 고대 그리스 아리스토텔레스(Aristotle) 니코마코스 윤리학 중용(Mesotes) & 최고선 에우다이모니아(Eudaimonia) 덕행 엔진
 *
 * 서기전 4세기 아리스토텔레스의 《니코마코스 윤리학(Nicomachean Ethics)》 원전 기반.
 * 1. 최고선 에우다이모니아(Eudaimonia): 덕(Aretē)에 따르는 영혼의 활발한 활동과 온전한 번영
 * 2. 중용(Mesotes, Golden Mean): 지나침(과도)과 모자람(결핍)의 양극단을 벗어난 지혜로운 균형점
 * 3. 실천적 지혜 프로네시스(Phronesis): 구체적 상황 속에서 마땅한 척도를 가늠하는 이성적 판단력
 * 4. 아레테(Aretē): 반복된 선한 습관이 빚어내는 영혼의 탁월성
 *
 * @version LUCKEY-ARISTOTLE-MESOTES-EUDAIMONIA-v1.1.0
 */

import type { UserProfile } from '../sharedState';

export const ARISTOTLE_MESOTES_VERSION = 'LUCKEY-ARISTOTLE-MESOTES-EUDAIMONIA-v1.1.0';

export type AristotleQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface AristotleVirtueStage {
  stageLevel: number;
  virtueNameGreek: string;
  virtueNameKo: string;
  deficiencyExtreme: string;
  excessExtreme: string;
  goldenMeanEssence: string;
  practicalAction: string;
}

export interface AristotleMesotesResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: AristotleQuestionTopic;
  mesotesPosture: string;
  // 내부 계산 호환 필드 (프롬프트 비노출)
  mesotesGoldenMeanScore: number;
  eudaimoniaFlourishingIndex: number;
  phronesisPracticalWisdom: number;
  telosPurposeOrientation: number;
  areteExcellenceIntegrity: number;
  // 세부 명세
  activeVirtueStage: AristotleVirtueStage;
  primaryMesotesWisdom: {
    themeKo: string;
    greekClassic: string;
    coreEssence: string;
    actionableDirective: string;
  };
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
  eudaimoniaPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type AristotleMesotesReport = AristotleMesotesResult;

const ARISTOTLE_VIRTUE_STAGES: AristotleVirtueStage[] = [
  {
    stageLevel: 1,
    virtueNameGreek: 'Andreia (용기)',
    virtueNameKo: '두려움에 맞서는 당당한 용기의 중용',
    deficiencyExtreme: '비겁(Deilia): 마땅히 맞서야 할 상황에서 물러섬',
    excessExtreme: '만용(Thrasytes): 무모하게 분별없이 위험에 뛰어듦',
    goldenMeanEssence: '올바른 목적을 위하여 마땅한 때에 고결하게 행동함',
    practicalAction: '두려움을 억누르지 말고 객관적으로 평가하되 신념을 지키기 위해 담대히 전진하십시오.',
  },
  {
    stageLevel: 2,
    virtueNameGreek: 'Sophrosyne (절제)',
    virtueNameKo: '욕망과 쾌락을 이성적으로 다스리는 절제의 중용',
    deficiencyExtreme: '무감각(Anaisthesia): 삶의 자연스러운 기쁨과 활력을 외면함',
    excessExtreme: '방종(Akolasia): 즉각적인 쾌락과 유혹에 영혼을 넘겨줌',
    goldenMeanEssence: '생명의 활력을 잃지 않으면서도 품위와 절도를 지키는 조화',
    practicalAction: '순간의 충동적 보상에 흔들리지 않고 장기적 목표와 영혼의 평정에 기여하는 선택에 머무십시오.',
  },
  {
    stageLevel: 3,
    virtueNameGreek: 'Eleutheriotes (자유와 관용)',
    virtueNameKo: '재화와 자원을 지혜롭게 나누고 베푸는 관용의 중용',
    deficiencyExtreme: '인색(Anelytheria): 지나치게 아끼고 움켜쥐며 나눔을 두려워함',
    excessExtreme: '낭비(Asotia): 목적 없이 자원을 허비하여 자립을 해침',
    goldenMeanEssence: '가치 있는 곳에 적절한 분량으로 기쁘게 베풀어 공동체를 풍요롭게 함',
    practicalAction: '과도한 소유욕을 비우고 함께하는 이들에게 관대한 지원을 아끼지 마십시오.',
  },
  {
    stageLevel: 4,
    virtueNameGreek: 'Praotes (온유와 침착)',
    virtueNameKo: '모욕이나 도발 앞에서 중심을 지키는 온유의 중용',
    deficiencyExtreme: '무기력(Aorgesisa): 부당한 처사에도 정의로운 분노를 표출하지 못함',
    excessExtreme: '격노(Orgylotes): 사소한 자극에도 폭발하여 이성을 잃음',
    goldenMeanEssence: '정의로운 뜻을 품되 내면의 평정과 품격을 단호하게 유지함',
    practicalAction: '감정에 휩쓸려 즉각 맞대응하지 말고 잠시 숨을 고른 뒤 명확하고 차분한 어조로 진실을 밝히십시오.',
  },
  {
    stageLevel: 5,
    virtueNameGreek: 'Dikaiosyne (정의)',
    virtueNameKo: '각자에게 마땅한 몫을 분배하고 균형을 세우는 정의의 완성',
    deficiencyExtreme: '불의를 감내함: 마땅한 권리를 포기하고 억울함을 묵과함',
    excessExtreme: '불의를 저지름: 자신의 이익을 위해 타인의 몫을 침탈함',
    goldenMeanEssence: '비례적 비중과 공평무사한 기준에 따라 조화로운 질서를 확립함',
    practicalAction: '치우치지 않는 객관적 시선으로 상황을 조망하고 상생할 수 있는 공정한 룰을 제시하십시오.',
  },
];

const MESOTES_WISDOMS = [
  {
    themeKo: '중용(Mesotes) - 양극단을 벗어난 지혜의 정점',
    greekClassic: 'He d arete hexis proairetike, en mesoteti ousa te pros hemas',
    coreEssence: '덕은 우리에게 적합한 중용에 위치하는 선택적 품성 상태이며, 실천적 이성에 의해 규정됩니다.',
    actionableDirective: '극단적인 판단이나 조급한 비약을 경계하고 양측의 입장을 아우르는 최선의 중심점을 잡으십시오.',
  },
  {
    themeKo: '에우다이모니아(Eudaimonia) - 온전한 영혼의 꽃피움',
    greekClassic: 'Psyches energeia tis kat areten teleian',
    coreEssence: '진정한 행복은 정체된 상태가 아니라 완벽한 덕에 따라 영혼의 탁월함을 활발히 실천하는 과정입니다.',
    actionableDirective: '수동적인 위안에 안주하지 말고 자신의 재능과 덕성을 실질적인 창조와 기여로 발현하십시오.',
  },
  {
    themeKo: '프로네시스(Phronesis) - 삶을 밝히는 실천적 지혜',
    greekClassic: 'Hexis alethes meta logou praktike peri ta anthropo agatha kai kaka',
    coreEssence: '인간에게 무엇이 좋고 나쁜지에 관하여 참된 이성에 따라 행동하는 탁월한 분별력이 프로네시스입니다.',
    actionableDirective: '단순한 이론적 지식에 머물지 말고 지금 당면한 구체적 현실 속에서 가장 지혜로운 한 걸음을 내딛으십시오.',
  },
  {
    themeKo: '아레테(Aretē) - 지속적인 습관이 만드는 탁월성',
    greekClassic: 'Ouk ara physei oute para physin enginontai hai aretai, alla pephykosi men hemin dexasthai autas',
    coreEssence: '우리가 반복해서 행하는 것이 곧 우리 자신이 됩니다. 탁월함은 일회적 행동이 아니라 습관화된 품성입니다.',
    actionableDirective: '매일 반복하는 작은 일상적 선택들을 정갈하게 갈고닦아 자연스럽게 몸에 밴 품격으로 승화시키십시오.',
  },
];

const TOPIC_GUIDANCE: Record<AristotleQuestionTopic, {
  posture: string;
  practice: string;
  ritual: string;
  reflection: string;
}> = {
  relationship: {
    posture: '우애(Philia)의 품격 속에서 지나친 희생도 냉담함도 피하는 온유한 균형',
    practice: '상대를 위해 내 경계를 무너뜨리지도, 마음을 닫아걸지도 말고 공정하고 따뜻한 비례를 세우십시오.',
    ritual: '상대에게 느낀 서운함이나 고마움을 과장 없이 담백한 한 문장으로 정리해 보기.',
    reflection: '이 관계에서 내가 지나치게 참고 있거나, 반대로 과하게 요구하고 있는 몫은 무엇입니까?',
  },
  decision: {
    posture: '이론이 아닌 지금 이 상황의 마땅한 척도를 가늠하는 프로네시스(실천적 지혜)',
    practice: '전부 아니면 전무(All or Nothing)의 극단적 가정을 내려놓고, 현실에서 지속 가능한 중용의 한 걸음을 고르십시오.',
    ritual: '고민 중인 선택지의 "과도한 극단"과 "지나친 회피"를 적고 그 사이의 현실적 중간 지점 찾기.',
    reflection: '지금 이 결정을 내린 뒤 일주일·한 달 뒤의 내가 반복해서 지킬 수 있는 습관은 무엇입니까?',
  },
  healing: {
    posture: '자기 비하(결핍)와 무리한 몰아붙임(과도) 사이에서 영혼의 리듬을 되찾는 돌봄',
    practice: '아무것도 못 하겠다는 무기력과 완벽히 해내야 한다는 조급함 둘 다 내려놓고, 오늘 감당할 수 있는 적정한 호흡으로 돌아오십시오.',
    ritual: '오늘 하루 지킬 수 있는 아주 작고 기분 좋은 일상 루틴 한 가지만 정성껏 실행하기.',
    reflection: '지금 내 몸과 마음이 가장 필요로 하는 "적절한 분량의 쉼과 움직임"은 무엇입니까?',
  },
  reflection: {
    posture: '거창한 결심이 아니라 매일 반복하는 작은 습관(Hexis)으로 품성을 빚는 태도',
    practice: '지금의 나를 규정하는 것은 한 번의 큰 성취가 아니라 매일 무심코 반복하는 말과 태도임을 기억하십시오.',
    ritual: '하루 중 내가 가장 자주 기울어지는 습관 하나를 골라 과도·결핍 중 어느 쪽인지 관찰하기.',
    reflection: '내가 닮고 싶은 삶의 모습(Telos)을 향해 오늘부터 길들일 작은 습관 하나는 무엇입니까?',
  },
};

function classifyQuestionTopic(question?: string): AristotleQuestionTopic {
  const q = (question ?? '').toLowerCase();
  if (/연애|사랑|결혼|이별|사람|관계|친구|가족|동료|상사|갈등|화해|소통|우정/.test(q)) {
    return 'relationship';
  }
  if (/선택|결정|이직|창업|사업|계약|투자|진로|시험|갈림길|해야|말아야|방향/.test(q)) {
    return 'decision';
  }
  if (/지치|힘들|불안|걱정|우울|슬픔|상처|회복|위로|휴식|번아웃|건강|잠/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

function getKstDateString(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function formatKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00');
}

export function calculateAristotleMesotes(
  profile: UserProfile,
  now: Date = new Date(),
  question?: string,
): AristotleMesotesResult {
  const kstDate = getKstDateString(now);
  const questionTopic = classifyQuestionTopic(question);
  const seedString = (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    kstDate +
    (question ?? '') +
    'AristotleMesotesEudaimonia';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const mesotesGoldenMeanScore = 62 + (absHash % 37);
  const eudaimoniaFlourishingIndex = 60 + ((absHash >> 3) % 39);
  const phronesisPracticalWisdom = 58 + ((absHash >> 6) % 41);
  const telosPurposeOrientation = 63 + ((absHash >> 9) % 36);
  const areteExcellenceIntegrity = 57 + ((absHash >> 12) % 42);

  const stageIndex = (absHash >> 5) % ARISTOTLE_VIRTUE_STAGES.length;
  const wisdomIndex = (absHash >> 8) % MESOTES_WISDOMS.length;

  const activeVirtueStage = ARISTOTLE_VIRTUE_STAGES[stageIndex];
  const primaryMesotesWisdom = MESOTES_WISDOMS[wisdomIndex];
  const topicGuide = TOPIC_GUIDANCE[questionTopic];

  const counselTitle = `아리스토텔레스 중용의 미덕: ${activeVirtueStage.virtueNameGreek}`;
  const philosophicalGuidance = `현재 과제는 결핍이나 과도함이라는 양극단의 덫에 빠지지 않고 중용(Mesotes)의 황금 지점을 찾는 것이 핵심입니다. ` +
    `${activeVirtueStage.goldenMeanEssence}의 원칙을 기준으로 삼으십시오. ` +
    `${activeVirtueStage.practicalAction} 프로네시스(실천적 지혜)를 발휘할 때 온전한 에우다이모니아(영혼의 번영)가 활짝 열립니다.`;

  const counselNote = `${activeVirtueStage.virtueNameGreek}의 중용과 '${primaryMesotesWisdom.themeKo}'가 맞닿아, 지금 상황을 '${topicGuide.posture}'로 비추고 있습니다.`;
  const boundaryNotice = '이 관점은 《니코마코스 윤리학》의 중용·품성 철학에 기반한 상징적 성찰 안내이며, 확정적 예언이나 의학적·법률적 판단이 아닙니다.';

  return {
    engineVersion: ARISTOTLE_MESOTES_VERSION,
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    mesotesPosture: topicGuide.posture,
    mesotesGoldenMeanScore,
    eudaimoniaFlourishingIndex,
    phronesisPracticalWisdom,
    telosPurposeOrientation,
    areteExcellenceIntegrity,
    activeVirtueStage,
    primaryMesotesWisdom,
    practiceGuidance: topicGuide.practice,
    ritualAction: topicGuide.ritual,
    reflectionFocus: topicGuide.reflection,
    counselNote,
    boundaryNotice,
    eudaimoniaPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatAristotleMesotesPrompt(res: AristotleMesotesResult): string {
  return [
    `【고대 그리스 아리스토텔레스 니코마코스 윤리학 중용(Mesotes) & 에우다이모니아 지표】`,
    `- 질문 맥락 초점: ${res.questionTopic} | 중용의 태도: ${res.mesotesPosture}`,
    `- 현재 중용 조율 덕목: ${res.activeVirtueStage.virtueNameGreek} (${res.activeVirtueStage.virtueNameKo})`,
    `- 중용의 본질: ${res.activeVirtueStage.goldenMeanEssence} (결핍: ${res.activeVirtueStage.deficiencyExtreme} ↔ 과도: ${res.activeVirtueStage.excessExtreme})`,
    `- 윤리학 핵심 지침: "${res.primaryMesotesWisdom.themeKo}" [${res.primaryMesotesWisdom.greekClassic}]`,
    `- 실천적 조언: ${res.primaryMesotesWisdom.actionableDirective}`,
    `- 맥락별 실행 조언: ${res.practiceGuidance}`,
    `- 오늘의 작은 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectionFocus}`,
    `- 핵심 조언 요약: ${res.counselNote}`,
    `- 해석 경계: ${res.boundaryNotice}`,
    `- 철학적 처방: ${res.eudaimoniaPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
