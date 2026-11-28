import { CONCERN_TOOL_ORDER } from '@/lib/divination/concernToolOrder';
import { FIFTEEN_DIVINATION_TOOLS, type DivinationToolId } from '@/lib/fifteenDivinationTools';
import { detectMasterConcernTopic, type MasterConcernTopic } from '@/lib/lucyMasterPrompts';

/** 한 고민에 동시에 켜 두는 기초 도구 상한. 15대 도구를 모두 켤 수 있다. */
export const LUCY_PRO_BUNDLE_CAP = 15;
/** 같은 고민이 이어질 때 한 번에 새로 덧붙이는 도구 수. */
export const LUCY_PRO_NEW_PER_TURN = 2;

const RESET_RE = /다른\s*(?:얘기|이야기|고민|주제|질문)|새\s*(?:고민|얘기|이야기)|주제\s*(?:를\s*)?바꾸|그건\s*됐|그건\s*그만|다른\s*걸\s*볼/;
const FOLLOW_RE = /^(?:그럼|그러면|그래서|근데|그런데|그리고|또|더|자세히|왜|어떻게|언제|시기|그(?:건|거|사람|애)|이(?:건|거)|방금|아까)/;
const DEEPEN_RE = /더\s*깊게|깊이\s*(?:봐|보고)|자세히\s*(?:봐|보고)|더\s*자세히|깊게\s*봐/;

export interface LucyProBundle {
  concern: string;
  topic: MasterConcernTopic;
  /** 앞쪽이 이번 턴에 새로 켠 도구, 뒤쪽이 이미 켜 둔 도구. */
  toolIds: DivinationToolId[];
}

export interface LucyProConsultationPlan {
  continued: boolean;
  added: DivinationToolId[];
  bundle: LucyProBundle;
}

function cleanText(text: string): string {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function asToolId(id: string): DivinationToolId | null {
  return Object.prototype.hasOwnProperty.call(FIFTEEN_DIVINATION_TOOLS, id) ? id as DivinationToolId : null;
}

function uniqueTools(ids: readonly string[]): DivinationToolId[] {
  const out: DivinationToolId[] = [];
  for (const id of ids) {
    const toolId = asToolId(id);
    if (!toolId || out.includes(toolId)) continue;
    out.push(toolId);
  }
  return out;
}

function namedToolIds(text: string): DivinationToolId[] {
  const lower = cleanText(text).toLowerCase();
  const western = lower.replace(/숙요\s*점성술|베딕\s*점성술|인도\s*점성술|태국\s*점성술|타이\s*점성술|미얀마\s*점성술|요일\s*점성술|vedic\s+astrology|thai\s+astrology/gi, '');
  return Object.values(FIFTEEN_DIVINATION_TOOLS)
    .filter(tool => tool.explicitRegex.test(tool.id === 'astrology' ? western : lower)
      || (tool.id === 'vedic' && /vedic\s+astrology/i.test(lower))
      || (tool.id === 'thai_astrology' && /thai\s+astrology/i.test(lower)))
    .map(tool => tool.id);
}

/** 깊게 보는 턴에 루시가 새 도구를 켤지 고른다. 이름 붙은 도구, 또는 이 고민의 핵심 도구가 아직 없을 때만. */
function toolsLucyAddsWhenDeepening(text: string, topic: MasterConcernTopic, carried: readonly DivinationToolId[]): DivinationToolId[] {
  const primary = CONCERN_TOOL_ORDER[topic].slice(0, LUCY_PRO_NEW_PER_TURN);
  const wanted = [...namedToolIds(text).filter(id => id !== 'saju'), ...primary];
  const added: DivinationToolId[] = [];
  for (const id of wanted) {
    if (added.length >= LUCY_PRO_NEW_PER_TURN) break;
    if (carried.includes(id) || added.includes(id)) continue;
    added.push(id);
  }
  return added;
}

/** 손님이 다른 얘기로 바꾸자고 했는지. */
export function isExplicitConcernReset(text: string): boolean {
  return RESET_RE.test(cleanText(text));
}

/**
 * 직전 상담과 같은 고민이 이어지는지.
 * 주제가 달라지거나, 다른 얘기라고 하면 새로 고른다. 비슷한 분위기만으로는 잇지 않는다.
 */
export function continuesLucyProConcern(previous: LucyProBundle | null, text: string): boolean {
  if (!previous || previous.toolIds.length === 0) return false;
  const clean = cleanText(text);
  if (!clean || isExplicitConcernReset(clean)) return false;
  const nextTopic = detectMasterConcernTopic(clean);
  if (nextTopic !== 'general' && previous.topic !== 'general' && nextTopic !== previous.topic) return false;
  if (nextTopic !== 'general' && previous.topic === 'general' && !FOLLOW_RE.test(clean) && clean.length > 18) return false;
  if (nextTopic !== 'general' && nextTopic === previous.topic) return true;
  if (FOLLOW_RE.test(clean)) return true;
  return clean.length <= 24 && nextTopic === 'general';
}

/** 이번 말과 이미 고른 도구로, 유지할지 비우고 다시 고를지 정한다. */
export function nextLucyProBundle(
  previous: LucyProBundle | null,
  text: string,
  freshToolIds: readonly string[],
): LucyProConsultationPlan {
  const clean = cleanText(text);
  const fresh = uniqueTools(freshToolIds).slice(0, LUCY_PRO_BUNDLE_CAP);
  if (!continuesLucyProConcern(previous, clean)) {
    return {
      continued: false,
      added: fresh,
      bundle: { concern: clean.slice(0, 120), topic: detectMasterConcernTopic(clean), toolIds: fresh },
    };
  }
  const nextTopic = detectMasterConcernTopic(clean);
  const topic = nextTopic !== 'general' ? nextTopic : previous!.topic;
  const carried = previous!.toolIds;
  const room = Math.max(0, LUCY_PRO_BUNDLE_CAP - carried.length);
  // 깊게 보자고 하면 루시가 판단한다. 새 도구가 이 고민에 유리할 때만 켜고, 아니면 켠 도구를 유지한다.
  if (DEEPEN_RE.test(clean)) {
    const added = room > 0 ? toolsLucyAddsWhenDeepening(clean, topic, carried) : [];
    return {
      continued: true,
      added,
      bundle: { concern: previous!.concern, topic, toolIds: [...added, ...carried] },
    };
  }
  const slots = Math.min(LUCY_PRO_NEW_PER_TURN, room);
  const added: DivinationToolId[] = [];
  // 짧은 후속("그럼 시기는?")은 문장만으로 도구를 갈아타지 않는다.
  // 이번 턴에 실제로 타로가 들어왔으면 그건 덧붙이고, 나머지는 이 고민에 맞는 순서대로 15개까지 붙인다.
  const brought = fresh.filter(id => id !== 'saju');
  const rest = (Object.keys(FIFTEEN_DIVINATION_TOOLS) as DivinationToolId[])
    .filter(id => id !== 'saju' && !CONCERN_TOOL_ORDER[topic].includes(id));
  const pool = nextTopic === 'general'
    ? [...brought.filter(id => id === 'tarot'), ...CONCERN_TOOL_ORDER[topic], ...rest]
    : [...brought, ...CONCERN_TOOL_ORDER[topic], ...rest];
  for (const id of pool) {
    if (added.length >= slots) break;
    if (id === 'saju' || carried.includes(id) || added.includes(id)) continue;
    added.push(id);
  }
  for (const id of fresh) {
    if (added.length >= slots) break;
    if (carried.includes(id) || added.includes(id)) continue;
    added.push(id);
  }
  return {
    continued: true,
    added,
    bundle: { concern: previous!.concern, topic, toolIds: [...added, ...carried] },
  };
}

export function lucyProContinuationNote(plan: LucyProConsultationPlan): string {
  if (!plan.continued) return '';
  const name = (id: DivinationToolId) => FIFTEEN_DIVINATION_TOOLS[id]?.koName ?? id;
  const kept = plan.bundle.toolIds.filter(id => !plan.added.includes(id)).map(name);
  const added = plan.added.map(name);
  const addedLine = added.length
    ? `이번엔 ${added.join(', ')}를 더 켜는 쪽이 이 고민을 깊게 보는 데 유리하다.`
    : '새 도구를 더 켜는 것은 이 고민을 깊게 보는 데 유리하지 않다. 이미 켜 둔 도구들이 함께 가리키는 곳을 더 깊게 풀어라.';
  return `[심화 상담] 같은 고민이 이어진다. 이미 켜 둔 도구(${kept.join(', ') || '없음'})는 끄지 말고 이어서 보라. ${addedLine} 상담을 처음부터 다시 열지 마.`;
}

let current: LucyProBundle | null = null;

export function peekLucyProConsultation(): LucyProBundle | null {
  return current;
}

export function resetLucyProConsultation(): void {
  current = null;
}

/** 이번 루시프로 턴의 도구 묶음을 갱신한다. 모드를 끄면 비운다. */
export function advanceLucyProConsultation(text: string, freshToolIds: readonly string[]): LucyProConsultationPlan {
  const plan = nextLucyProBundle(current, text, freshToolIds);
  current = plan.bundle.toolIds.length > 0 ? plan.bundle : null;
  return plan;
}

if (typeof window !== 'undefined') {
  window.addEventListener('prism:lucy_master_mode', () => resetLucyProConsultation());
}
