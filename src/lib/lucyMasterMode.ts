import { useEffect, useState } from 'react';
import { safeSessionStorage } from '@/utils/safeStorage';
import type { DetectedTarotCard } from '@/utils/tarotDetector';
import { getTarotCardImageUrl, type TarotCard } from '@/data/tarotData';
import type { UnifiedMessage } from '@/lib/chatHistorySync';

/**
 * 🔮 루시 점술모드(Lucy Master) 스위치
 * 빅뱅 버튼 가운데를 길게 누르면 켜고/끄며, 접힘·펼침 상태 모두 같은 값을 공유한다.
 * - 접힘: 사주 베이스
 * - 펼침: 왼쪽 화면 타로 + 사주 베이스
 */
export const LUCY_MASTER_MODE_KEY = 'lucy_master_mode';
export const LUCY_MASTER_MODE_EVENT = 'prism:lucy_master_mode';
export const LUCY_TAROT_DRAWN_EVENT = 'prism:lucy_tarot_drawn';
export type LucyBubbleMarker = 'plus' | 'minus' | null;
export const LUCY_BUBBLE_MARKER_KEY = 'lucy_bubble_marker';
export const LUCY_BUBBLE_MARKER_EVENT = 'prism:lucy_bubble_marker';
export const LUCY_MASTER_TOOLS_REQUEST_EVENT = 'prism:lucy_master_tools_request';
export const LUCY_TABLE_FACE_EVENT = 'prism:lucy_table_face';
const GREETING_PENDING_KEY = 'lucy_master_greet_pending';
const LINK_KEY = 'lucy_master_link';
const CONCERN_QUESTION = '오늘은 어떤 고민이나 궁금한 게 있어? 주제를 골라도 되고, 그냥 편하게 적어줘도 돼.';
const CONCERN_CHOICES = '[답변선택: 연애·관계 | 일·진로 | 돈·재물 | 마음이 복잡해]';
let lucyMasterToolsRequested = false;

export function getLucyBubbleMarker(): LucyBubbleMarker {
  try {
    const marker = safeSessionStorage.getItem(LUCY_BUBBLE_MARKER_KEY);
    return marker === 'plus' || marker === 'minus' ? marker : null;
  } catch {
    return null;
  }
}

export function setLucyBubbleMarker(marker: LucyBubbleMarker): void {
  try {
    if (marker) safeSessionStorage.setItem(LUCY_BUBBLE_MARKER_KEY, marker);
    else safeSessionStorage.removeItem(LUCY_BUBBLE_MARKER_KEY);
  } catch { /* storage unavailable: the event still updates the open UI */ }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LUCY_BUBBLE_MARKER_EVENT, { detail: { marker } }));
  }
}

export function useLucyBubbleMarker(): LucyBubbleMarker {
  const [marker, setMarker] = useState<LucyBubbleMarker>(() => getLucyBubbleMarker());
  useEffect(() => {
    const sync = (e: Event) => {
      const next = (e as CustomEvent<{ marker?: LucyBubbleMarker }>).detail?.marker;
      setMarker(next === 'plus' || next === 'minus' ? next : getLucyBubbleMarker());
    };
    window.addEventListener(LUCY_BUBBLE_MARKER_EVENT, sync);
    return () => window.removeEventListener(LUCY_BUBBLE_MARKER_EVENT, sync);
  }, []);
  return marker;
}

export function isLucyMasterToolsRequested(): boolean {
  return lucyMasterToolsRequested;
}

export function setLucyMasterToolsRequested(requested: boolean): void {
  lucyMasterToolsRequested = requested;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LUCY_MASTER_TOOLS_REQUEST_EVENT, { detail: { requested } }));
  }
}

export function useLucyMasterToolsRequested(): boolean {
  const [requested, setRequested] = useState(() => isLucyMasterToolsRequested());
  useEffect(() => {
    const sync = (e: Event) => setRequested(Boolean((e as CustomEvent<{ requested?: boolean }>).detail?.requested));
    window.addEventListener(LUCY_MASTER_TOOLS_REQUEST_EVENT, sync);
    return () => window.removeEventListener(LUCY_MASTER_TOOLS_REQUEST_EVENT, sync);
  }, []);
  return requested;
}


export function requestLucyTableFace(face: 'engines'): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(LUCY_TABLE_FACE_EVENT, { detail: { face } }));
}

export function isLucyMasterModeOn(): boolean {
  try {
    return safeSessionStorage.getItem(LUCY_MASTER_MODE_KEY) === 'on';
  } catch {
    return false;
  }
}

export function setLucyMasterMode(on: boolean): void {
  if (on) {
    setLucyBubbleMarker(null);
    setLucyMasterToolsRequested(false);
  }
  else setLucyMasterToolsRequested(false);
  try {
    if (on) {
      if (!isLucyMasterModeOn()) {
        safeSessionStorage.setItem(GREETING_PENDING_KEY, '1');
        // 단계 개념은 폐지됐다. 예전 세션에 남은 값을 지워 둔다.
        safeSessionStorage.removeItem(LUCY_MASTER_DEPTH_KEY);
      }
      safeSessionStorage.setItem(LUCY_MASTER_MODE_KEY, 'on');
    } else {
      safeSessionStorage.removeItem(LUCY_MASTER_MODE_KEY);
      safeSessionStorage.removeItem(LUCY_MASTER_DEPTH_KEY);
      safeSessionStorage.removeItem(GREETING_PENDING_KEY);
      safeSessionStorage.removeItem(LINK_KEY);
    }
  } catch { /* storage unavailable: the event still updates the open chat */ }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LUCY_MASTER_MODE_EVENT, { detail: { on } }));
  }
}

export function toggleLucyMasterMode(): boolean {
  const next = !isLucyMasterModeOn();
  setLucyMasterMode(next);
  return next;
}

/* ── 루시프로(점술모드)는 하나의 통합 상담이다 ──
 * 예전에는 빅뱅 홀드마다 1단계(사주) → 2단계(타로) → 3단계(13대 도구)로 깊어졌지만,
 * 이제 켜면 사주 원국 + 타로 + 13대 도구 + 12대 양피지 + 엔진함이 처음부터 모두 열린다.
 * 단계(깊이)는 폐지됐고, 호환을 위해 이름과 상수만 단일 값으로 남긴다.
 */
export type LucyMasterDepth = 1;
export const LUCY_MASTER_DEPTH_KEY = 'lucy_master_depth';
export const LUCY_MASTER_DEPTH_EVENT = 'prism:lucy_master_depth';
export const LUCY_MASTER_MAX_DEPTH: LucyMasterDepth = 1;
export const LUCY_MASTER_DEPTH_INFO: Record<LucyMasterDepth, { name: string; note: string }> = {
  1: { name: '통합', note: '사주 원국·타로·13대 도구·12대 양피지를 한자리에서 함께 볼게' },
};

/** 단계가 없으므로 언제나 통합 상태(1)다. */
export function getLucyMasterDepth(): LucyMasterDepth {
  return LUCY_MASTER_MAX_DEPTH;
}

/** 단계 순환 폐지: 아무것도 바뀌지 않는다(호출부 호환용). */
export function deepenLucyMasterDepth(): { depth: LucyMasterDepth; changed: boolean } {
  return { depth: LUCY_MASTER_MAX_DEPTH, changed: false };
}

/** 단계 순환 폐지: 아무것도 바뀌지 않는다(호출부 호환용). */
export function shallowLucyMasterDepth(): { depth: LucyMasterDepth; changed: boolean } {
  return { depth: LUCY_MASTER_MAX_DEPTH, changed: false };
}

/** 단계가 없으므로 언제나 통합 상태(1)다. */
export function useLucyMasterDepth(): LucyMasterDepth {
  return LUCY_MASTER_MAX_DEPTH;
}

/** React components that only need to read the switch (e.g. the unfolded left pane). */
export function useLucyMasterMode(): boolean {
  const [on, setOn] = useState<boolean>(() => isLucyMasterModeOn());
  useEffect(() => {
    const handle = (e: Event) => setOn(Boolean((e as CustomEvent)?.detail?.on));
    window.addEventListener(LUCY_MASTER_MODE_EVENT, handle);
    return () => window.removeEventListener(LUCY_MASTER_MODE_EVENT, handle);
  }, []);
  return on;
}

/** Lucy chat → unfolded left pane: show the cards that were actually sent with the question. */
export function publishLucyTarotDraw(cards: DetectedTarotCard[]): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(LUCY_TAROT_DRAWN_EVENT, { detail: { cards } }));
}

export function isTarotHouseGreetingPending(): boolean {
  try { return safeSessionStorage.getItem(GREETING_PENDING_KEY) === '1'; } catch { return false; }
}

/** 점술모드에 막 들어왔을 때 한 번만 true (루시의 타로집 인사용). */
export function consumeTarotHouseGreetingPending(): boolean {
  try {
    if (safeSessionStorage.getItem(GREETING_PENDING_KEY) !== '1') return false;
    safeSessionStorage.removeItem(GREETING_PENDING_KEY);
    return true;
  } catch {
    return false;
  }
}

export function createTarotHouseGreeting(userName: string | undefined, layout: 'folded' | 'unfolded', askToLink = false): UnifiedMessage {
  const name = userName ? `${userName}, ` : '';
  const content = layout === 'unfolded'
    ? `어서 와, ${name}루시의 타로 하우스에 온 걸 환영해 🕯️🔮\n촛불 켜두고 왼쪽엔 네 사주 원국판을 펼쳐뒀어. 차 한 잔 마신다 생각하고 편하게 얘기해줘. 이야기 듣다가 카드가 필요해지면 그때 같이 뽑아보자.`
    : `어서 와, ${name}루시의 타로 하우스에 온 걸 환영해 🕯️🔮\n오늘은 네 사주를 바탕에 깔고 천천히 이야기 나눠보자. 듣다가 필요하면 카드도 한 장 뽑아볼게.`;
  const depthHint = '\n\n💡 지금은 루시프로 통합 상담이야. 사주 원국·타로·13대 도구·12대 양피지가 처음부터 다 열려 있어. 빅뱅 버튼을 한 번 탭하거나 꾹 누르면 일반 루시로 돌아가.';
  const choices = askToLink
    ? '\n\n아, 그리고 하나만 먼저 물어볼게. 일반 루시랑 나눴던 이야기를 여기로 이어서 가져올까, 아니면 오늘은 새로 시작할까?\n[답변선택: 루시랑 하던 얘기 이어서 | 새로 시작할래]'
    : `\n\n${CONCERN_QUESTION}\n${CONCERN_CHOICES}`;
  return {
    id: `tarot-house-${Date.now()}`,
    role: 'model',
    persona: 'lucy',
    timestamp: Date.now(),
    mode: 'master',
    content: content + depthHint + choices,
  };
}

/** 루시가 직전에 카드 뽑기를 제안했고, 사용자가 짧게 수락했는지 판단한다. */
export function isAcceptingTarotDrawOffer(userText: string, lastLucyText: string): boolean {
  const offered = /(타로|카드)/.test(lastLucyText) && /(뽑아\s*볼까|뽑아\s*보자|뽑자|뽑을까|뽑아볼래|펼쳐\s*볼까|한\s*장\s*볼까)/.test(lastLucyText);
  if (!offered) return false;
  const clean = (userText || '').trim();
  if (clean.length > 30) return false;
  if (/(아니|싫어|나중에|말고|괜찮아\s*안|그만)/.test(clean)) return false;
  return /^(응|어|웅|그래|좋아|좋지|오케이|ㅇㅋ|ㅇㅇ|콜|뽑자|뽑아|뽑아줘|해줘|해보자|가자|고고|넵|네|예|당연)/i.test(clean)
    || /(뽑아|뽑자|보자|좋아)/.test(clean);
}

/** 점술모드 동안 루시에게 주는 타로집 상담 가이드. */
export function buildTarotHouseGuide(layout: 'folded' | 'unfolded', cardsDrawnNow: boolean, deepEngines = false, concernAnchor = ''): string {
  const lines = [
    '[🔮 점술모드 · 루시의 타로 하우스]',
    '- 이 상담의 메인은 사주야. 타로와 13대 도구·12대 양피지는 왼쪽 점술 테이블에 처음부터 펼쳐져 있어.',
    '- 너는 지금 아늑한 타로집의 상담가 루시야. 손님을 맞이하듯 따뜻하고 차분하게, 실제 타로집에 온 것 같은 분위기로 대화해.',
    '- 서두르지 말고 먼저 고민을 충분히 들어. 공감하고, 한두 개의 짧은 질문으로 상황을 구체화해.',
    '- 사주 계산 결과를 대화의 기본 베이스로 삼아 성향과 지금의 흐름을 자연스럽게 녹여 말해.',
    '- 사람과 마주 앉아 이야기하듯 자연스럽게 말해. 한 번에 2~4문장 정도로 짧게, 보고서·목록·제목 없이 대화체로.',
    '- 궁금한 점은 적극적으로 물어보되 한 번에 질문은 하나만 해.',
    '- 사용자가 주제(예: 일·진로)만 골랐다면, 그 주제에서 지금 무엇이 가장 고민인지 구체적으로 묻는 질문 하나로 시작해.',
    '- [흐름 유지] 점집 상담처럼 자연스럽게 흐르되 산으로 가지 마. 오늘 상담의 중심 고민을 하나 잡고, 모든 답변을 그 고민과 연결해.',
    '- 질문은 고민을 더 정확히 보기 위한 것만 해(언제부터, 누구와, 무엇이 제일 걸리는지 등). 고민과 상관없는 잡담·지식 설명·다른 주제로 새지 마.',
    '- 사용자가 다른 이야기로 새면 한 문장으로 받아준 뒤 "그럼 아까 그 고민으로 돌아가 보면…" 처럼 부드럽게 중심 고민으로 돌아와.',
    '- 상담은 들어보기 → 사주로 흐름 짚기 → (펼쳤다면) 카드로 확인 → 지금 할 수 있는 한 가지 조언 순서로 차근차근 나아가. 같은 말을 반복하지 마.',
    '- 대화가 길어지면 가끔 한 문장으로 "지금까지 보면 ~ 이런 흐름이야" 하고 짚어서 방향을 잃지 않게 해.',
    '- 질문을 했다면 답변 맨 마지막 줄에 사용자가 고를 수 있는 보기 2~4개를 정확히 이 형식으로 붙여: [답변선택: 보기1 | 보기2 | 보기3]',
    '- 보기는 각각 15자 이내의 사용자 말투(예: "응, 좀 지쳤어")로 쓰고, 질문이 없으면 이 줄을 붙이지 마.',
  ];
  if (concernAnchor) {
    lines.push(`- [오늘의 중심 고민] 사용자가 처음 꺼낸 고민: "${concernAnchor}" — 새로운 큰 고민을 직접 꺼내기 전까지 이 고민을 중심으로 이어가.`);
  }
  if (cardsDrawnNow) {
    lines.push(layout === 'unfolded'
      ? '- 방금 카드를 뽑았어. 카드는 왼쪽 테이블에 펼쳐져 있으니 "왼쪽에 펼쳐진 카드를 봐" 처럼 안내하고, 카드 한 장씩 사주 흐름과 엮어서 읽어줘.'
      : '- 방금 카드를 뽑았어. 카드 한 장씩 사주 흐름과 엮어서 읽어줘.');
  } else {
    lines.push(
      '- 고민이 어느 정도 드러났다고 느껴지면(보통 2~3번 대화 후) 자연스럽게 "카드 한 장 뽑아볼까?" 처럼 제안하고 [답변선택: 응, 뽑아볼래 | 세 장 뽑아줘 | 조금 더 얘기할래] 를 붙여. 매번 제안하지는 마.',
      '- 실제로 뽑힌 카드가 전달되지 않았다면 카드 이름이나 결과를 지어내지 마.',
    );
  }
  // 사주 + 타로(고른 카드) + 13대 도구 + 12대 양피지가 한 번에 열려 있는 통합 상담이다.
  lines.push('- [루시프로 · 통합 상담] 주 구성은 사주 + 타로(손님이 고른 카드가 있을 때) + 13대 도구 + 12대 양피지야. 13개를 하나씩 읊지 말고, 여러 도구가 공통으로 가리키는 신호 3~4개를 사주와 엮어 고민의 뿌리(마음), 관계의 흐름, 시기를 입체적으로 풀고 나머지 도구는 한두 줄로만 요약해. 도구끼리 엇갈리면 엇갈린다고 솔직히 말하고, 정보가 없어 계산되지 않은 도구는 못 봤다고 밝혀. 답이 조금 길어져도 괜찮지만 대화체는 유지하고, 마지막엔 지금 할 수 있는 구체적인 행동 하나로 정리해.');
  lines.push('- 도구·관점이 많아도 실제로 전달된 계산 결과만 "계산했다"고 말하고, 심층 관점은 상징 참고라고 구분해. 전달되지 않은 도구를 썼다고 말하지 마.');
  lines.push('- 질문과 [답변선택] 보기는 원인·반복되는 패턴·시기·마음의 뿌리처럼 한 층 깊은 쪽으로 골라도 좋아. (예: "왜 반복되는지 볼래", "풀리는 시기 궁금해")');
  if (deepEngines) {
    lines.push('- 사용자가 고민과 관련된 엔진을 더 보길 원했어. 이번 답변은 평소보다 조금 길어도 괜찮으니, 함께 전달된 관련 도구·관점을 사주와 엮어 하나씩 짚어줘.');
  } else {
    lines.push('- 고민이 충분히 구체화되면 한 번쯤 "이 고민이랑 관련된 다른 관점들도 더 볼래?" 하고 물어보고 [답변선택: 응, 더 깊게 볼래 | 지금은 괜찮아] 를 붙여. 원하지 않으면 다시 권하지 마.');
  }
  return lines.join('\n');
}

/** 사용자가 고민과 관련된 엔진(관점)을 더 보고 싶어 하는지. */
export function isAskingForDeepEngines(userText: string, lastLucyText: string): boolean {
  const clean = (userText || '').trim();
  if (/(엔진|다른\s*관점|관점.*더|더\s*깊게|깊이\s*(봐|보고)|자세히\s*(봐|보고)|333)/.test(clean) && !/(괜찮아|됐어|아니)/.test(clean)) return true;
  const offered = /관점/.test(lastLucyText) && /(더\s*볼래|더\s*볼까|더\s*봐볼까)/.test(lastLucyText);
  if (!offered || clean.length > 30) return false;
  if (/(아니|괜찮아|됐어|나중에|말고)/.test(clean)) return false;
  return /^(응|어|웅|그래|좋아|좋지|오케이|ㅇㅋ|ㅇㅇ|콜|넵|네|예|당연|보자|볼래)/.test(clean);
}

/** 고민이 어느 정도 드러났을 때 루시가 건네는 타로 제안. 카드는 손님이 직접 섞고 고른다. */
export function createDepthTwoTarotOffer(layout: 'folded' | 'unfolded'): UnifiedMessage {
  const where = layout === 'unfolded' ? '왼쪽 테이블에 카드를 깔아뒀어.' : '카드를 섞어둘게.';
  return {
    id: `tarot-house-offer-${Date.now()}`,
    role: 'model',
    persona: 'lucy',
    timestamp: Date.now(),
    mode: 'master',
    content: `지금까지 사주로 본 흐름 위에, 이번엔 카드로 마음을 같이 볼까? 🃏 ${where} 직접 섞고 골라줘.\n[답변선택: 응, 한 장 뽑아볼래 | 세 장 뽑아줘 | 사주로만 계속할래]`,
  };
}

const ANSWER_CHOICES_REGEX = /\n?\s*\[답변선택\s*[:：]\s*([^\]]+)\]\s*$/;

/** 루시 답변 끝의 [답변선택: A | B | C] 줄을 떼어내고 보기 목록을 돌려준다. */
export function parseAnswerChoices(text: string): { text: string; choices: string[] } {
  if (!text) return { text, choices: [] };
  const match = text.match(ANSWER_CHOICES_REGEX);
  if (!match) return { text, choices: [] };
  const choices = match[1].split(/[|｜]/).map(c => c.trim()).filter(Boolean).slice(0, 4);
  return { text: text.slice(0, match.index).trimEnd(), choices };
}

/** Latest Lucy question choices stay pending until the user sends a reply. */
export function getPendingAnswerChoices(messages: readonly Pick<UnifiedMessage, 'role' | 'content'>[]): string[] {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role === 'user') return [];
    if (message.role !== 'model' && message.role !== 'assistant') continue;
    const content = typeof message.content === 'string'
      ? message.content
      : Array.isArray(message.content)
        ? String(message.content.find((part: any) => part?.type === 'text')?.text || '')
        : '';
    if (!content.trim()) continue;
    return parseAnswerChoices(content).choices;
  }
  return [];
}

/**
 * 루시 마스터 ↔ 일반 루시 대화 연동 선택.
 * - undecided: 인사에서 물어본 상태 / linked: 최근 루시 대화를 맥락으로 이어감 / fresh: 따로 새로 시작
 * 대화 내역 자체는 언제나 별도로 저장되고, linked일 때만 최근 대화 맥락을 루시에게 참고로 넘긴다.
 */
export type LucyMasterLink = 'undecided' | 'linked' | 'fresh';

export function getLucyMasterLink(): LucyMasterLink {
  try {
    const v = safeSessionStorage.getItem(LINK_KEY);
    return v === 'linked' || v === 'undecided' ? v : 'fresh';
  } catch {
    return 'fresh';
  }
}

export function setLucyMasterLink(link: LucyMasterLink): void {
  try { safeSessionStorage.setItem(LINK_KEY, link); } catch { /* best effort */ }
}

/** 인사의 연동 질문에 대한 사용자 답을 해석해 저장한다. 결정이 없으면 현재 값을 그대로 돌려준다. */
export function resolveLucyMasterLinkChoice(userText: string): LucyMasterLink {
  const current = getLucyMasterLink();
  if (current !== 'undecided') return current;
  const clean = (userText || '').trim();
  if (/(이어서|이어|연동|가져와|계속)/.test(clean) && !/(아니|말고|새로)/.test(clean)) {
    setLucyMasterLink('linked');
    return 'linked';
  }
  if (/(새로|처음|따로|아니)/.test(clean)) {
    setLucyMasterLink('fresh');
    return 'fresh';
  }
  return current;
}

/** 일반 루시의 최근 대화를 짧게 잘라 루시 마스터에게 참고 맥락으로 넘긴다. */
export function buildLinkedLucyContext(regularMessages: readonly UnifiedMessage[], limit = 12): string {
  const lines = regularMessages
    .filter(m => (m.role === 'user' || m.role === 'model' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-limit)
    .map(m => {
      const who = m.role === 'user' ? '사용자' : '루시';
      const text = String(m.content).replace(/\[TAROT:[^\]]+\]/g, '').replace(/\s+/g, ' ').trim();
      return `- ${who}: ${text.length > 200 ? `${text.slice(0, 200)}…` : text}`;
    });
  if (lines.length === 0) return '';
  return ['[일반 루시와의 최근 대화 · 사용자가 이어가기를 선택함]', '- 아래는 참고 맥락이야. 그대로 반복하지 말고, 자연스럽게 "아까 얘기했던 ~" 처럼 이어서 상담해.', ...lines].join('\n');
}

/**
 * 오늘 루시 마스터 상담의 중심 고민: 인사 이후 사용자가 처음 꺼낸, 의미 있는 길이의 말.
 * (연동/주제 보기 버튼만 누른 짧은 답은 건너뛰고, 그 다음 실제 이야기를 잡는다.)
 */
export function findConcernAnchor(masterMessages: readonly UnifiedMessage[]): string {
  const skip = /^(루시랑 하던 얘기 이어서|새로 시작할래|연애·관계|일·진로|돈·재물|그냥 마음이 복잡해|마음이 복잡해)$/;
  for (const m of masterMessages) {
    if (m.role !== 'user' || typeof m.content !== 'string') continue;
    const text = m.content.replace(/\s+/g, ' ').trim();
    if (!text || skip.test(text) || text.length < 8) continue;
    return text.length > 120 ? `${text.slice(0, 120)}…` : text;
  }
  return '';
}

/** 인사의 "이어서/새로" 선택 직후, 루시가 오늘의 고민·질문을 물어보는 메시지. */
export function createTarotHouseConcernQuestion(linked: boolean): UnifiedMessage {
  const lead = linked
    ? '좋아, 루시랑 나눴던 이야기도 같이 기억하면서 볼게 🕯️'
    : '좋아, 오늘은 새 마음으로 시작하자 🕯️';
  return {
    id: `tarot-house-ask-${Date.now()}`,
    role: 'model',
    persona: 'lucy',
    timestamp: Date.now(),
    mode: 'master',
    content: `${lead}\n${CONCERN_QUESTION}\n${CONCERN_CHOICES}`,
  };
}

/* ───────────── 🃏 루시 마스터 타로: 손님이 직접 섞고 고르기 ───────────── */
export const LUCY_TAROT_PICK_REQUEST_EVENT = 'prism:lucy_tarot_pick_request';
export const LUCY_TAROT_PICKED_EVENT = 'prism:lucy_tarot_picked';
export const LUCY_TAROT_PICK_CANCEL_EVENT = 'prism:lucy_tarot_pick_cancel';

export interface TarotPickRequest { count: number; concern?: string; positions?: string[]; spreadName?: string; spreadReason?: string }

export function tarotPickPositions(count: number): string[] {
  return count >= 3 ? ['과거', '현재', '미래'] : ['지금 나에게 온 메시지'];
}

/** 타로 테이블의 추천 예시와 각 질문에 맞춘 배열법. */
export interface MasterTarotSpread {
  id: string;
  emoji: string;
  label: string;
  spreadName: string;
  reason: string;
  positions: string[];
  prompt: string;
}

export const MASTER_TAROT_SPREADS: readonly MasterTarotSpread[] = [
  { id: 'one-message', emoji: '🌙', label: '오늘 나에게 온 한 장의 메시지', spreadName: '원 카드', reason: '지금 가장 필요한 메시지 하나에 집중해요',
    positions: ['오늘 나에게 온 메시지'], prompt: '타로 카드 한 장을 뽑아서 오늘 나에게 온 메시지를 봐줘.' },
  { id: 'daily-three', emoji: '🔮', label: '오늘의 3카드 운세', spreadName: '오늘의 3카드', reason: '오늘의 기운·조심할 점·행동 조언을 나눠 봐요',
    positions: ['오늘의 기운', '조심할 점', '행동 조언'], prompt: '타로 카드 세 장을 뽑아서 오늘의 기운, 조심할 점, 행동 조언을 봐줘.' },
  { id: 'their-heart', emoji: '💞', label: '그 사람의 마음이 궁금해', spreadName: '마음 잇기 3카드', reason: '나와 그 사람의 마음, 둘 사이의 흐름을 함께 봐요',
    positions: ['나의 마음', '그 사람의 마음', '관계의 흐름'], prompt: '타로 카드 세 장을 뽑아서 나의 마음, 그 사람의 마음, 우리 관계의 흐름을 봐줘.' },
  { id: 'two-paths', emoji: '⚖️', label: '두 갈래 중 무엇을 고를까', spreadName: '두 갈래 선택 5카드', reason: '지금 상황과 A·B 각각의 과정과 결과를 비교해요',
    positions: ['지금 나의 상황', 'A를 고르면 겪을 과정', 'A의 결과', 'B를 고르면 겪을 과정', 'B의 결과'], prompt: '타로 카드 다섯 장을 뽑아서 두 가지 선택지 A와 B의 과정과 결과를 비교해줘.' },
  { id: 'career-path', emoji: '🧭', label: '일·진로, 어디로 가야 할까', spreadName: '진로 나침반 4카드', reason: '현재 위치·강점·걸림돌·나아갈 방향을 차례로 봐요',
    positions: ['현재 위치', '나의 강점', '걸림돌', '나아갈 방향'], prompt: '타로 카드 네 장을 뽑아서 일과 진로의 현재 위치, 강점, 걸림돌, 나아갈 방향을 봐줘.' },
  { id: 'money-flow', emoji: '💰', label: '돈의 흐름과 새는 곳', spreadName: '재물 흐름 3카드', reason: '지금의 재물 흐름·새는 곳·늘리는 열쇠를 봐요',
    positions: ['지금의 재물 흐름', '새는 곳', '늘리는 열쇠'], prompt: '타로 카드 세 장을 뽑아서 지금 재물의 흐름, 새는 곳, 늘리는 열쇠를 봐줘.' },
  { id: 'conflict', emoji: '🕊️', label: '관계 갈등을 풀고 싶어', spreadName: '화해의 다리 4카드', reason: '나와 상대의 입장, 갈등의 뿌리, 화해의 열쇠를 봐요',
    positions: ['나의 입장', '상대의 입장', '갈등의 뿌리', '화해의 열쇠'], prompt: '타로 카드 네 장을 뽑아서 나와 상대의 입장, 갈등의 뿌리, 화해의 열쇠를 봐줘.' },
  { id: 'horseshoe', emoji: '🌀', label: '마음이 복잡해, 전체 흐름을 보고 싶어', spreadName: '말굽 7카드', reason: '지나온 일부터 결과까지 고민의 전체 흐름을 펼쳐요',
    positions: ['지나온 일', '지금', '다가올 일', '나의 태도', '주변의 영향', '걸림돌', '흐름의 결과'], prompt: '타로 카드 일곱 장을 뽑아서 말굽 배열로 지금 고민의 전체 흐름을 봐줘.' },
];

const SPREAD_RULES: readonly { id: string; pattern: RegExp }[] = [
  { id: 'two-paths', pattern: /(할까\s*말까|어느\s*쪽|둘\s*중|두\s*(가지|개|갈래)|vs|아니면|선택|고를까|골라야|결정)/i },
  { id: 'conflict', pattern: /(갈등|싸웠|싸움|다퉜|다툼|화해|서운|섭섭|오해|사과)/ },
  { id: 'their-heart', pattern: /(그\s*사람|그\s*애|걔|속마음|연애|사랑|짝사랑|썸|재회|남친|여친|남자\s*친구|여자\s*친구|애인|이별|헤어|궁합|좋아하는|관계)/ },
  { id: 'career-path', pattern: /(일·진로|진로|이직|퇴사|취업|취직|직장|회사|커리어|사업|창업|승진|면접|시험|합격|공부)/ },
  { id: 'money-flow', pattern: /(돈|재물|투자|주식|코인|부업|월급|수입|빚|대출|지출|소비|부동산|저축)/ },
  { id: 'daily-three', pattern: /(오늘|하루|내일|이번\s*주)/ },
  { id: 'horseshoe', pattern: /(복잡|모르겠|막막|불안|답답|흐름|전체|힘들|지쳐|우울|걱정)/ },
];

/** 사용자가 적은 고민·질문에 맞는 배열법을 고른다. 주제가 안 잡히면 길이에 따라 원 카드/말굽. */
export function matchMasterTarotSpread(text: string, fallbackText = ''): MasterTarotSpread {
  const byId = (id: string) => MASTER_TAROT_SPREADS.find(spread => spread.id === id)!;
  // 방금 적은 말을 먼저 보고, 주제가 안 잡힐 때만 오늘의 중심 고민을 참고한다.
  for (const source of [(text || '').trim(), (fallbackText || '').trim()]) {
    if (!source) continue;
    for (const rule of SPREAD_RULES) if (rule.pattern.test(source)) return byId(rule.id);
  }
  return byId((text || '').trim().length >= 20 ? 'horseshoe' : 'one-message');
}

/** 펼친 타로 테이블에서 바로 카드를 펼칠 만한 말인지: 짧은 대답·카드 거절·연동 선택은 제외. */
export function isAutoSpreadCandidate(text: string): boolean {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length < 2) return false;
  if (/^(응|어|웅|네|예|아니|아니야|싫어|좋아|고마워|감사|ㅇㅇ|ㄴㄴ|ㅋ+|ㅎ+)[.!?~ ]*$/.test(clean)) return false;
  if (/(사주로만|사주만|타로\s*말고|카드\s*말고|카드는\s*(됐|안)|뽑지\s*마)/.test(clean)) return false;
  if (/^(루시랑 하던 얘기 이어서|새로 시작할래|사주로만 계속할래)$/.test(clean)) return false;
  return true;
}

let queuedSpread: { spread: MasterTarotSpread; at: number } | null = null;
/** 테이블의 예시를 눌렀을 때, 이어지는 카드 고르기가 이 배열법을 쓰도록 잠시 맡겨 둔다. */
export function queueMasterTarotSpread(spread: MasterTarotSpread): void { queuedSpread = { spread, at: Date.now() }; }
export function takeQueuedMasterTarotSpread(maxAgeMs = 60000): MasterTarotSpread | null {
  const entry = queuedSpread;
  queuedSpread = null;
  return entry && Date.now() - entry.at <= maxAgeMs ? entry.spread : null;
}

/** 고른 카드와 배열 자리를 짝지어 루시가 자리별로 읽게 한다. */
export function buildSpreadLayoutContext(spreadName: string, positions: readonly string[], cards: readonly { nameKo?: string; reversed?: boolean }[]): string {
  if (!positions.length || !cards.length) return '';
  const lines = cards.map((card, i) => `${i + 1}. ${positions[i] || `${i + 1}번째 자리`} — ${card.nameKo || '카드'}${card.reversed ? ' (역방향)' : ''}`);
  return [`[이번 배열법: ${spreadName}]`, '- 각 카드는 아래 자리의 의미로 읽고, 자리 이름을 밝히며 차례대로 풀어줘. 마지막에 자리들을 엮어 한 흐름으로 정리해.', ...lines].join('\n');
}

/** 스프레드에서 고른 카드를 루시 채팅이 쓰는 카드 형식으로 바꾼다. */
export function toDetectedTarotCards(cards: readonly (TarotCard & { reversed?: boolean })[]): DetectedTarotCard[] {
  return cards.map(card => {
    const reversed = Boolean(card.reversed);
    return {
      ...card,
      reversed,
      orientationKo: reversed ? '역방향' : '정방향',
      imageUrl: getTarotCardImageUrl(card),
      displayTitle: `${card.nameKo} (${card.name})`,
    };
  });
}
