import type { UserProfile } from '../sharedState';

export type YapeseQuestionTopic = 'trust' | 'patience' | 'consensus' | 'pace' | 'general';

function classifyYapeseTopic(q: string): YapeseQuestionTopic {
  if (/신뢰|믿음|증명|약속|성실/.test(q)) return 'trust';
  if (/시간|오래|기다|인내|가라앉/.test(q)) return 'patience';
  if (/합의|대화|갈등|관계|목소리/.test(q)) return 'consensus';
  if (/비교|속도|조급|리듬|토양/.test(q)) return 'pace';
  return 'general';
}

const YAPESE_AXES = [
  '라이 돌화폐 신뢰 축(옮기지 않아도 공동체가 기억하는 축적의 무게)',
  '팔라우 항해길 가치 축(긴 정성과 시간으로 다져 온 기준의 단단함)',
  '페바이 집회소 합의 축(큰 목소리 대신 조용한 수긍을 끌어내는 품)',
  '타로 밭 물길 절제 축(바깥 속도와 비교하지 않고 내 토양의 수분을 지키는 균형)',
  '바다 밑 라이 약속 축(당장 드러나지 않아도 양심 속에 살아 있는 성실함)',
] as const;

const YAPESE_SHADOW_WARNINGS: Record<YapeseQuestionTopic, string> = {
  trust: '조용한 신뢰를 지킨다는 이유로 꼭 필요한 중간 공유나 확인 연락까지 생략하지 않도록 핵심 한 줄은 전하십시오.',
  patience: '시간의 무게를 믿되, 이미 방향이 어긋난 일까지 인내라는 이름으로 방치하지 않도록 점검 기한을 두십시오.',
  consensus: '합의를 찾으려다 내 핵심 기준까지 무르게 양보하지 않도록, 지킬 선 하나는 미리 정해 두십시오.',
  pace: '내 속도를 지키는 것이 나태함으로 흐르지 않게 오늘 마칠 작은 매듭 하나를 분명히 세우십시오.',
  general: '보이지 않는 신뢰는 억지로 과시할 때보다 약속을 조용히 지킬 때 가장 단단하게 자리 잡습니다.',
};

export interface YapeseRaiResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: YapeseQuestionTopic;
  raiTrustAxis: string;
  shadowWarning: string;
  stoneTrust: string;
  companionTrust: string;
  yapeseInsight: string;
  lagoonTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const STONES = [
  {
    stone: '라이 돌화폐(Rai Stone · 옮기지 않아도 공동체가 기억하는 신뢰)',
    insight: '굳이 매번 눈앞에 증명해 보이지 않아도 한 번 쌓인 성실함과 신뢰는 제자리에 남아 있음',
    tone: '미크로네시아 야프 섬의 코코넛 야자수 그늘 아래 고요히 세워진 둥근 석회암 원반',
    action: '오늘 내가 한 약속이나 맡은 일 중 하나를, 누가 보지 않아도 스스로 부끄럽지 않게 깔끔히 매듭지어 보세요.',
    question: '지금 내가 굳이 억지로 증명하려 애쓰고 있을 뿐, 이미 내 성실함으로 충분히 자리 잡고 있는 신뢰는 무엇인가요?',
  },
  {
    stone: '팔라우 항해길(Palau Quarry · 거친 파도를 건너 얻은 가치의 무게)',
    insight: '쉽게 손에 넣은 것보다 긴 시간과 정성을 들여 마련한 기준일수록 마음이 오래 아낌',
    tone: '에메랄드빛 산호초 라군 너머로 시원하게 펼쳐지는 태평양의 잔잔한 물결',
    action: '지금까지 내가 긴 시간을 들여 지켜 온 기준 한 가지를 떠올리고 오늘도 그 기준을 존중해 주세요.',
    question: '쉽게 얻지 않았기에 더 오래 아끼고 지켜 내고 싶은 나만의 가치 기준은 무엇인가요?',
  },
  {
    stone: '페바이 집회소(Pebaey · 큰 목소리보다 조용한 합의가 머무는 지붕)',
    insight: '갈등이 있을 때 이기려 들기보다 모두가 고개를 끄덕일 수 있는 선을 찾는 편이 오래감',
    tone: '높은 초가지붕 아래 바닷바람이 부드럽게 드나드는 열린 나무 마루',
    action: '오늘 의견이 갈리는 대화에서 이기는 말 대신 양쪽이 수긍할 수 있는 접점 한 줄을 먼저 제안해 보세요.',
    question: '큰 목소리로 이기려 들기보다 조용한 합의를 찾을 때 훨씬 오래갈 관계나 일은 무엇인가요?',
  },
  {
    stone: '타로 밭의 물길(Taro Patch · 짠물과 단물의 경계를 지키는 세심함)',
    insight: '남과 비교하며 조급해하기보다 내 삶의 토양에 맞는 적절한 수분과 속도를 지켜야 함',
    tone: '바닷가 안쪽 습지에 정갈하게 가꾸어진 푸른 토란 잎과 맑은 도랑물',
    action: '남의 속도표와 비교하며 조급해진 일정 하나를 오늘 내 생활 리듬에 맞는 속도로 다시 조정해 보세요.',
    question: '바깥의 기준과 비교하지 않고, 지금 내 삶의 토양에 알맞은 수분과 속도를 지켜 주어야 할 영역은 어디인가요?',
  },
  {
    stone: '바다 밑에 가라앉은 돌(Sunken Rai · 보이지 않는 곳에서도 여전히 살아 있는 약속)',
    insight: '당장 남의 눈에 띄지 않는 수고라 해도 내 양심과 관계 안에서는 이미 충분한 가치가 있음',
    tone: '투명한 옥빛 바다 밑 모래바닥 위로 일렁이는 오후의 햇빛 조각들',
    action: '결과가 당장 드러나지 않아 서운했던 내 수고 하나를 오늘 스스로 먼저 인정하고 다독여 주세요.',
    question: '당장 남의 눈에 띄지 않더라도 내 양심과 관계 안에서 여전히 묵직하게 살아 있는 약속은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 16).replace('T', ' ')} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateYapeseRaiStoneTrust(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): YapeseRaiResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyYapeseTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % STONES.length;
  const picked = STONES[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (STONES.length - 1));
  const companion = STONES[(idx + companionOffset) % STONES.length];
  const raiTrustAxis = YAPESE_AXES[idx];
  const shadowWarning = YAPESE_SHADOW_WARNINGS[questionTopic];

  return {
    engineVersion: 'LUCKEY-YAPESE-RAI-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    raiTrustAxis,
    shadowWarning,
    stoneTrust: picked.stone,
    companionTrust: companion.stone,
    yapeseInsight: picked.insight,
    lagoonTone: picked.tone,
    reflectionFocus: `미크로네시아 야프 라이 돌 지혜의 '${picked.stone}'을 중심에 두고 '${companion.stone}'의 결을 곁들여, 당장 남의 눈에 드러나지 않아도 내가 쌓아 온 정직한 신뢰와 묵직한 기준을 믿어 보세요.`,
    ritualAction: picked.action,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '미크로네시아 야프(Yap)의 라이 돌화폐 신뢰·페바이 합의 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatYapeseRaiPrompt(res: YapeseRaiResult): string {
  return [
    `[야프 라이 돌·공동체 신뢰 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 섬의 상징: ${res.stoneTrust} (${res.lagoonTone})`,
    `- 동반 상징: ${res.companionTrust}`,
    `- 신뢰 축: ${res.raiTrustAxis}`,
    `- 중심 통찰: ${res.yapeseInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
