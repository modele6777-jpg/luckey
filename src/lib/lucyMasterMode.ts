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
const GREETING_PENDING_KEY = 'lucy_master_greet_pending';
const LINK_KEY = 'lucy_master_link';
const CONCERN_QUESTION = '오늘은 어떤 고민이나 궁금한 게 있어? 주제를 골라도 되고, 그냥 편하게 적어줘도 돼.';
const CONCERN_CHOICES = '[답변선택: 연애·관계 | 일·진로 | 돈·재물 | 마음이 복잡해]';

export function isLucyMasterModeOn(): boolean {
  try {
    return safeSessionStorage.getItem(LUCY_MASTER_MODE_KEY) === 'on';
  } catch {
    return false;
  }
}

export function setLucyMasterMode(on: boolean): void {
  try {
    if (on) {
      if (!isLucyMasterModeOn()) safeSessionStorage.setItem(GREETING_PENDING_KEY, '1');
      safeSessionStorage.setItem(LUCY_MASTER_MODE_KEY, 'on');
    } else {
      safeSessionStorage.removeItem(LUCY_MASTER_MODE_KEY);
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
    ? `어서 와, ${name}루시의 타로 하우스에 온 걸 환영해 🕯️🔮\n촛불 켜두고 카드도 테이블에 올려뒀어. 차 한 잔 마신다 생각하고 편하게 얘기해줘. 이야기 듣다가 때가 되면 같이 카드 뽑아보자 — 뽑은 카드는 왼쪽 테이블에 바로 펼쳐줄게.`
    : `어서 와, ${name}루시의 타로 하우스에 온 걸 환영해 🕯️🔮\n오늘은 네 사주를 바탕에 깔고 천천히 이야기 나눠보자. 듣다가 필요하면 카드도 한 장 뽑아볼게.`;
  const choices = askToLink
    ? '\n\n아, 그리고 하나만 먼저 물어볼게. 일반 루시랑 나눴던 이야기를 여기로 이어서 가져올까, 아니면 오늘은 새로 시작할까?\n[답변선택: 루시랑 하던 얘기 이어서 | 새로 시작할래]'
    : `\n\n${CONCERN_QUESTION}\n${CONCERN_CHOICES}`;
  return {
    id: `tarot-house-${Date.now()}`,
    role: 'model',
    persona: 'lucy',
    timestamp: Date.now(),
    mode: 'master',
    content: content + choices,
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
    '- 이 상담의 메인은 사주야. 타로는 화면을 펼쳤을 때 더해지는 보조 상담이야.',
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

/** 점술모드 대화 중 폰을 펼쳤을 때 루시가 건네는 타로 제안. */
export function createTarotOfferOnUnfold(): UnifiedMessage {
  return {
    id: `tarot-house-unfold-${Date.now()}`,
    role: 'model',
    persona: 'lucy',
    timestamp: Date.now(),
    mode: 'master',
    content: '오, 테이블을 펼쳤네 🕯️ 지금까지 사주로 본 흐름에 타로 카드도 한번 더해볼까? 뽑으면 왼쪽 테이블에 바로 펼쳐줄게.\n[답변선택: 응, 한 장 뽑아볼래 | 세 장 뽑아줘 | 사주로만 계속할래]',
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

export interface TarotPickRequest { count: number; concern?: string }

export function tarotPickPositions(count: number): string[] {
  return count >= 3 ? ['과거', '현재', '미래'] : ['지금 나에게 온 메시지'];
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
