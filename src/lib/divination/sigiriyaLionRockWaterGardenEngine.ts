import type { UserProfile } from '../sharedState';

export interface SigiriyaRockResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '언어·태도' | '기초·수로' | '문턱·전환' | '감성·품격' | '비축·여유' | '시기리야 전반';
  sigiriyaMotif: string;
  companionMotif: string;
  sigiriyaInsight: string;
  rockTone: string;
  hydraulicGardenAxis: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '거울벽의 맑은 광택(Mirror Wall · 거친 바위를 매끈히 다듬어 사람의 마음을 비추는 회랑)',
    insight: '말과 태도를 정갈히 다듬어 두면, 상대방도 자연스럽게 자기 진심을 비추어 보게 됨',
    tone: '열대 숲의 아침 햇살을 받아 석영처럼 은은하게 빛나는 시기리야의 매끈한 회랑 벽',
    axis: '정갈한 거울벽처럼 말과 시선의 결을 다듬는 관계 조율의 축',
    shadow: '상대의 기분과 반응을 살피느라 정작 내 진심과 필요한 경계까지 매끈하게 지워 버리지 않도록 주의하세요.',
    action: '오늘 건네는 말 한 마디에서 날카로운 표현을 다듬어 상대의 마음을 비추는 맑은 거울처럼 전해 보세요.',
    question: '지금 내 말투와 태도를 한 번 더 정갈하게 다듬는다면 상대가 비추어 보게 될 진심은 무엇인가요?',
  },
  {
    motif: '공중 정원의 수압(Hydraulic Water Garden · 보이지 않는 수로를 통해 높은 바위 위까지 물을 끌어올림)',
    insight: '겉으로 드러난 화려함보다 보이지 않는 곳에서 정교하게 이어 둔 기본기가 끝내 높이까지 닿게 함',
    tone: '계단식 연못과 분수들이 정교한 돌 수로를 따라 조용히 숨을 맞추는 정원',
    axis: '보이지 않는 돌 수로와 기본기를 먼저 잇는 토대 설계의 축',
    shadow: '기초와 준비 과정을 다듬는 데만 머무르느라 정작 물을 위로 올려보내는 첫 실행의 타이밍을 늦추지 마세요.',
    action: '오늘 처리할 일 중 가장 번거로운 작업 하나의 기초(메모·정리·사전 확인)를 5분만 정성껏 다져 두세요.',
    question: '지금 내가 더 빨리 오르고만 싶어서 건너뛰려던 기본기나 보이지 않는 수로는 무엇인가요?',
  },
  {
    motif: '사자 바위의 문턱(Lion Gate · 두려움과 결단이 만나는 바위 중턱의 전환점)',
    insight: '높은 곳에 오르기 전 잠시 숨이 가빠지는 구간은 잘못된 길이 아니라 시야가 트이기 직전의 문턱임',
    tone: '거대한 화강암 암벽 중턱에서 숲의 바다를 한눈에 내려다보는 탁 트인 계단',
    axis: '가파른 문턱 앞에서 호흡을 고르며 시야를 여는 전환의 축',
    shadow: '긴장감을 곧 위험 신호로 오해해 서둘러 물러서거나, 반대로 무리한 속도로 호흡을 잃지 않게 살피세요.',
    action: '숨이 가빠 망설여지는 지점 앞에서 발을 빼기 전에 딱 세 호흡만 고르며 아래의 풍경을 바라보세요.',
    question: '지금 내게 두렵고 가파르게 느껴지지만, 실은 시야가 트이기 직전의 문턱일 수도 있는 구간은 어디인가요?',
  },
  {
    motif: '구름 속 프레스코(Cloud Maidens · 바위 틈 그늘 속에서 천 년을 견딘 부드러운 색채)',
    insight: '험한 환경 속에서도 내 안의 다정함과 섬세한 감각을 잃지 않을 때 삶이 메마르지 않음',
    tone: '바위 처마 아래 서늘한 그늘 속에서 선명한 황금빛과 붉은빛을 간직한 벽화',
    axis: '거친 바위 그늘 속에서도 섬세한 색채를 지키는 내면 감수성의 축',
    shadow: '내면의 감성과 위안을 지키는 데만 기대어 바깥의 현실적 정리와 마무리를 뒤로 미루지 않도록 균형을 잡으세요.',
    action: '바쁘고 건조한 하루 틈새에 내가 좋아하는 음악·색감·향기 하나를 3분간 곁에 두어 보세요.',
    question: '험하고 바쁜 일정 속에서도 내 삶이 메마르지 않도록 끝까지 지켜 내고 싶은 부드러운 감각은 무엇인가요?',
  },
  {
    motif: '바위 위 빗물 저수지(Summit Cistern · 정상에 고인 빗물을 아껴 가뭄의 계절을 건넘)',
    insight: '운이 따르고 여유가 있을 때 모아 둔 작은 비축이, 훗날 마른 계절을 지나는 가장 든든한 힘이 됨',
    tone: '열대의 스콜이 지나간 뒤 바위 정상에 맑게 고여 하늘을 비추는 물웅덩이',
    axis: '여유가 있을 때 마른 계절을 대비해 비축하는 순환 저장의 축',
    shadow: '비축과 대비에만 신경 쓰느라 지금 당장 누리고 흘려보내야 할 기쁨과 나눔까지 움켜쥐지 않게 하세요.',
    action: '오늘 남는 에너지나 시간, 혹은 자원의 아주 작은 몫 하나를 다음 주를 위한 저수지로 따로 비축해 두세요.',
    question: '지금 여유가 있을 때 조용히 모아 두면 다가올 마른 계절을 건너는 데 가장 든든해질 비축은 무엇인가요?',
  },
];

function classifySigiriyaTopic(q: string): SigiriyaRockResult['questionTopic'] {
  if (/말|대화|태도|관계|거울/.test(q)) return '언어·태도';
  if (/기초|기본|수로|준비|정리/.test(q)) return '기초·수로';
  if (/문턱|전환|결정|두려|도전/.test(q)) return '문턱·전환';
  if (/감성|예술|지치|위로|색/.test(q)) return '감성·품격';
  if (/여유|돈|시간|비축|저장/.test(q)) return '비축·여유';
  return '시기리야 전반';
}

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

export function calculateSigiriyaLionRockWaterGarden(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SigiriyaRockResult {
  const now = params.now ?? new Date();
  const questionText = (params.question ?? '').trim();
  const questionTopic = classifySigiriyaTopic(questionText);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${questionText}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-SIGIRIYA-ROCK-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    sigiriyaMotif: picked.motif,
    companionMotif: companion.motif,
    sigiriyaInsight: picked.insight,
    rockTone: picked.tone,
    hydraulicGardenAxis: picked.axis,
    reflectionFocus: `시기리야 바위 수로 정원의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 곁들여, 겉의 속도를 재촉하기보다 보이지 않는 기본 수로와 정갈한 태도를 먼저 다듬어 보세요.`,
    ritualAction: picked.action,
    shadowWarning: picked.shadow,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '고대 스리랑카 시기리야의 수로 정원·거울벽 비례 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSigiriyaRockPrompt(res: SigiriyaRockResult): string {
  return [
    `[시기리야 바위 성채·수로 정원 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 시기리야 모티프: ${res.sigiriyaMotif} (${res.rockTone})`,
    `- 수로 정원 축: ${res.hydraulicGardenAxis}`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.sigiriyaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
