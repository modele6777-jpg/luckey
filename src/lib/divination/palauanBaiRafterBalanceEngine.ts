import type { UserProfile } from '../sharedState';

export interface PalauanBaiResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '기록·이야기' | '고요·라군' | '분담·기둥' | '기반·돌봄' | '물때·흐름' | '바이 전반';
  palauanMotif: string;
  companionMotif: string;
  baiRafterAxis: string;
  palauanInsight: string;
  baiTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '바이 회당의 이야기 서까래(Storyboards · 대들보와 서까래마다 공동체의 교훈과 전설을 새김)',
    insight: '말로만 흘려보내지 않고 눈에 보이는 기록이나 이야기로 남길 때 경험이 지혜로 굳어짐',
    tone: '팔라우 열대 숲 사이, 정교하게 채색된 목조 바이 회당의 높은 지붕 아래 서늘한 아침',
    action: '오늘 겪은 시행착오나 깨달음 한 줄을 머릿속에만 두지 말고 메모장에 눈에 보이게 새겨 두세요.',
    question: '말로만 흘려보내지 않고 서까래의 이야기처럼 눈에 보이는 기록으로 남겨 두어야 할 내 경험은 무엇인가요?',
  },
  {
    motif: '암초 안쪽의 잔잔한 라군(Inner Lagoon · 바깥 거친 파도를 산호초가 막아 주어 안쪽은 늘 고요함)',
    insight: '외부 세상의 소음이 크더라도 내 마음 한가운데에는 산호초가 지켜 주는 잔잔한 라군을 둘 수 있음',
    tone: '에메랄드빛 바닷물이 산호초 너머의 파도를 잠재우며 유리처럼 반짝이는 오전',
    action: '외부 알림이나 소음을 15분만 끄고, 내 마음 한가운데 잔잔한 라군을 회복하는 고요한 틈을 확보하세요.',
    question: '바깥의 거친 파도 소리에 휩쓸려, 내가 정작 내 안의 잔잔한 라군을 잊고 있었던 건 아닌가요?',
  },
  {
    motif: '네 기둥의 균형 잡힌 합의(Four Corner Pillars · 네 방향의 기둥이 똑같이 무게를 나누어 지붕을 받침)',
    insight: '한 사람이 모든 책임을 지기보다 역할을 고르게 나누고 서로의 무게를 인정할 때 안정됨',
    tone: '네 모서리 기둥 사이로 바닷바람이 막힘없이 드나드는 시원한 한낮',
    action: '오늘 내가 혼자 짊어지고 있던 일 중 하나를 믿을 수 있는 동료나 도구와 나누어 보세요.',
    question: '혼자 지붕을 떠받치려 애쓰기보다 네 방향의 기둥처럼 무게를 고르게 나눌 수 있는 일은 무엇인가요?',
  },
  {
    motif: '타로 밭의 물길 돌보기(Taro Patch Care · 진흙과 맑은 물의 높낮이를 세심히 조절해 뿌리를 키움)',
    insight: '화려한 잎만 바라보기보다 보이지 않는 물밑 환경과 기반을 천천히 돌보는 일이 핵심임',
    tone: '초록빛 타로 잎사귀 위로 맑은 빗방울이 구슬처럼 맺혀 구르는 오후',
    action: '당장 겉으로 드러나는 성과보다 기본 환경(수면, 정리, 기초 자료)을 돌보는 일 하나를 먼저 챙겨 보세요.',
    question: '화려한 잎에만 시선을 두느라 놓치고 있던, 내 기반과 뿌리를 키우는 보이지 않는 물밑 돌봄은 무엇인가요?',
  },
  {
    motif: '산호섬 사이의 조수 읽기(Tide Reading · 밀물과 썰물의 때를 읽고 배를 띄울 순간을 고름)',
    insight: '무조건 힘껏 노를 젓는 것보다 물때가 들어오는 흐름에 맞추어 움직이면 훨씬 멀리 감',
    tone: '해 질 녘 붉은빛이 록 아일랜드의 둥근 섬들 사이 물길에 길게 비치는 저녁',
    action: '억지로 밀어붙여도 진도가 안 나가는 일은 잠시 물때를 기다리고, 지금 흐름이 맞는 일부터 배를 띄워 보세요.',
    question: '힘껏 노만 젓느라 지치기 전에, 지금 밀물이 들어오고 있는 흐름에 맞추어 움직일 일은 무엇인가요?',
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

const PALAU_SHADOWS = [
  '경험을 서까래의 이야기처럼 기록으로 남기는 성실함이 정작 지금 움직여야 할 현장 실행보다 기록 정리만 앞세우는 태도가 되지 않게 하세요.',
  '산호초 안쪽 라군처럼 고요를 지키는 태도가 외부 피드백이나 꼭 확인해야 할 현실 신호까지 차단하는 회피로 흐르지 않게 주의하세요.',
  '네 기둥처럼 무게를 고르게 나누는 합의가 내가 끝까지 책임져야 할 핵심 결정까지 모호하게 미루는 책임 분산이 되어서는 안 됩니다.',
  '타로 밭의 물밑 기반을 돌보는 세심함이 완벽한 준비를 핑계로 첫 수확과 실행 시점을 계속 늦추는 지연이 되지 않도록 살피세요.',
  '밀물과 썰물의 물때를 기다리는 신중함이 이미 들어온 기회 앞에서도 더 완벽한 파도만 기다리며 배를 띄우지 못하는 망설임이 되지 않게 하세요.',
];

function classifyPalauanTopic(q: string): PalauanBaiResult['questionTopic'] {
  if (/기록|이야기|메모|서까래/.test(q)) return '기록·이야기';
  if (/고요|라군|소음|산호초/.test(q)) return '고요·라군';
  if (/기둥|함께|역할|나누/.test(q)) return '분담·기둥';
  if (/기반|뿌리|타로|돌봄/.test(q)) return '기반·돌봄';
  if (/물때|조수|흐름|타이밍/.test(q)) return '물때·흐름';
  return '바이 전반';
}

export function calculatePalauanBaiRafterBalance(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): PalauanBaiResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyPalauanTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const baiRafterAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;

  return {
    engineVersion: 'LUCKEY-PALAU-BAI-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    palauanMotif: picked.motif,
    companionMotif: companion.motif,
    baiRafterAxis,
    palauanInsight: picked.insight,
    baiTone: picked.tone,
    reflectionFocus: `팔라우 바이 회당의 '${picked.motif}'을 중심에 두고 '${companion.motif}'의 결을 곁들여, 네 기둥의 균형을 나누고 산호초 안쪽 라군의 고요를 지켜 보세요.`,
    ritualAction: picked.action,
    shadowWarning: PALAU_SHADOWS[idx],
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '남태평양 팔라우 전통 바이(Bai) 회당·이야기 서까래·라군 지혜 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatPalauanBaiPrompt(res: PalauanBaiResult): string {
  return [
    `[팔라우·바이 공회당 서까래 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 서까래 균형 축: ${res.baiRafterAxis}`,
    `- 팔라우 모티프: ${res.palauanMotif} (${res.baiTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.palauanInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
