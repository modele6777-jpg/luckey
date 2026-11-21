import { FIFTEEN_DIVINATION_TOOLS, type DivinationToolId } from '@/lib/fifteenDivinationTools';
import type { CalculationAuditItem } from '@/lib/divination/calculationAudit';
import { LUCY_MASTER_DEPTH3_TOOLS } from '@/lib/divination/smartAgentRouter';
import { detectMasterConcernTopic, type MasterConcernTopic } from '@/lib/lucyMasterPrompts';
import type { ToolFact } from '@/lib/lucyMasterToolFacts';

/**
 * 점술모드 3단계 왼쪽 테이블의 "13대 도구" 판.
 * 순서는 랜덤이 아니라 고민에 맞춰 정해지고, 같은 고민이면 늘 같은 순서가 나온다.
 *  1) 고민 주제에 가장 잘 맞는 추천 도구 1개
 *  2) 루시 답변에서 함께 짚은 도구(공통 신호)
 *  3) 고민 주제와 가까운 순서, 같으면 기본 순서
 *  4) 정보가 없어 계산되지 않은 도구는 맨 아래
 */

export type ToolBoardStatus = 'calculated' | 'symbolic' | 'needs_info' | 'pending';

export interface ToolBoardItem {
  id: DivinationToolId;
  name: string;
  hanja: string;
  /** 이 도구가 잘 보는 것, 한 줄 */
  bestFor: string;
  status: ToolBoardStatus;
  /** 정보 부족 이유나 계산 한계 */
  note: string;
  /** 루시 답변에서 이 도구를 짚은 문장 (없으면 빈 값) */
  signal: string;
  /** 루시가 답변에서 함께 짚은 도구 */
  common: boolean;
  /** 엔진이 실제로 계산한 핵심 결과 (최대 4줄) */
  facts: ToolFact[];
}

export interface ToolBoard {
  topic: MasterConcernTopic;
  recommended: ToolBoardItem;
  recommendReason: string;
  others: ToolBoardItem[];
  hasResults: boolean;
}

/** 고민 주제별로 잘 맞는 도구 (앞일수록 더 잘 맞음). 맨 앞이 추천 도구. */
const TOPIC_TOOLS: Record<MasterConcernTopic, DivinationToolId[]> = {
  love: ['ziwei', 'sukuyo', 'astrology', 'liuren', 'vedic', 'kabbalah'],
  career: ['qimen', 'liuren', 'taiyi', 'iching', 'kyusei', 'ziwei'],
  money: ['qimen', 'ziwei', 'tojeong', 'kyusei', 'liuren', 'taiyi'],
  mind: ['vedic', 'astrology', 'kabbalah', 'iching', 'mahabote', 'sukuyo'],
  general: ['iching', 'tojeong', 'taiyi', 'astrology', 'kyusei', 'ziwei'],
};

const RECOMMEND_REASON: Record<MasterConcernTopic, string> = {
  love: '두 사람의 인연과 마음의 자리를 보기에 가장 잘 맞아',
  career: '중요한 결정과 움직일 때를 보기에 가장 잘 맞아',
  money: '재물이 들어오는 길과 타이밍을 보기에 가장 잘 맞아',
  mind: '반복되는 마음의 패턴을 이해하기에 가장 잘 맞아',
  general: '지금 흐름에서 나아갈지 멈출지 보기에 가장 잘 맞아',
};

/** 루시 답변에서 도구를 찾는 이름들. 자격 붙은 점성술이 서양 점성술로 잡히지 않게 서양은 따로 처리한다. */
const TOOL_ALIASES: Record<DivinationToolId, RegExp> = {
  saju: /사주/,
  tarot: /타로/,
  astrology: /서양\s*점성술|별자리|출생\s*차트|행성/,
  ziwei: /자미두수|자미/,
  sukuyo: /숙요/,
  mahabote: /마하보테/,
  vedic: /베딕|인도\s*점성술/,
  liuren: /육임/,
  qimen: /기문/,
  kabbalah: /카발라|생명나무|세피로트/,
  iching: /주역|괘/,
  thai_astrology: /태국\s*점성술|타이\s*점성술/,
  tojeong: /토정/,
  kyusei: /구성학|구성\s*기학|九星/,
  taiyi: /태을/,
};

function cleanAnswer(text: string): string {
  return (text || '')
    .replace(/\[(?:TAROT|답변선택)[^\]]*\]/g, ' ')
    .replace(/[*_#>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 답변을 문장으로 나눈다. */
function sentences(text: string): string[] {
  return cleanAnswer(text).split(/(?<=[.!?。…])\s+|(?<=[다요어야지네])\.\s*/).map(s => s.trim()).filter(Boolean);
}

/** 루시 답변에서 이 도구를 짚은 첫 문장 (최대 90자). */
export function findToolSignal(id: DivinationToolId, answer: string): string {
  const pattern = TOOL_ALIASES[id];
  for (const sentence of sentences(answer)) {
    const target = id === 'astrology' ? sentence.replace(/(숙요|베딕|인도|태국|타이|미얀마)\s*점성술/g, '') : sentence;
    if (pattern.test(target)) return sentence.length > 90 ? `${sentence.slice(0, 89)}…` : sentence;
  }
  return '';
}

function shortBestFor(id: DivinationToolId): string {
  const first = FIFTEEN_DIVINATION_TOOLS[id].bestFor.split(/,\s*/)[0] || '';
  return first.length > 40 ? `${first.slice(0, 39)}…` : first;
}

function statusOf(item: CalculationAuditItem | undefined): { status: ToolBoardStatus; note: string } {
  if (!item) return { status: 'pending', note: '' };
  const note = item.note || '';
  if (item.status === 'calculated' && item.sentToModel) return { status: 'calculated', note };
  if (item.status === 'symbolic') return { status: 'symbolic', note: '계산 기준을 다시 살펴보는 중이라 상징 참고로만 봐요' };
  if (item.status === 'partial' && item.sentToModel) return { status: 'calculated', note };
  const needsBirth = /생시|출생\s*시간|출생시간|출생도시|성별/.test(note);
  return { status: 'needs_info', note: needsBirth ? '태어난 시간 정보가 있어야 볼 수 있어요' : '이번엔 계산되지 않았어요' };
}

export function buildToolBoard(params: {
  audit: readonly CalculationAuditItem[];
  concern: string;
  answer: string;
  facts?: Partial<Record<string, ToolFact[]>>;
}): ToolBoard {
  const topic = detectMasterConcernTopic(params.concern);
  const auditById = new Map(params.audit.map(item => [item.toolId, item] as const));
  const hasResults = LUCY_MASTER_DEPTH3_TOOLS.some(id => auditById.has(id));
  const topicOrder = TOPIC_TOOLS[topic];

  const items: ToolBoardItem[] = LUCY_MASTER_DEPTH3_TOOLS.map(id => {
    const spec = FIFTEEN_DIVINATION_TOOLS[id];
    const { status, note } = statusOf(auditById.get(id));
    const signal = status === 'needs_info' ? '' : findToolSignal(id, params.answer);
    return { id, name: spec.koName, hanja: spec.hanjaOrEng, bestFor: shortBestFor(id), status, note, signal, common: Boolean(signal), facts: status === 'calculated' ? (params.facts?.[id] ?? []) : [] };
  });

  const baseIndex = (id: DivinationToolId) => LUCY_MASTER_DEPTH3_TOOLS.indexOf(id);
  const topicIndex = (id: DivinationToolId) => {
    const i = topicOrder.indexOf(id);
    return i < 0 ? topicOrder.length : i;
  };

  // 추천: 주제 순서에서 계산된(또는 아직 대기 중인) 첫 도구. 정보가 없어 못 본 도구는 추천하지 않는다.
  const recommendedId = topicOrder.find(id => items.find(item => item.id === id)?.status !== 'needs_info')
    ?? items.find(item => item.status !== 'needs_info')?.id
    ?? topicOrder[0];
  const recommended = items.find(item => item.id === recommendedId)!;

  const rank = (item: ToolBoardItem) => [
    item.status === 'needs_info' ? 1 : 0,
    item.common ? 0 : 1,
    topicIndex(item.id),
    baseIndex(item.id),
  ];
  const others = items
    .filter(item => item.id !== recommendedId)
    .sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return ra[i] - rb[i];
      return 0;
    });

  return { topic, recommended, recommendReason: RECOMMEND_REASON[topic], others, hasResults };
}
