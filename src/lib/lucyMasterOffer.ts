import { safeSessionStorage } from '@/utils/safeStorage';

/**
 * Regular Lucy reads the conversation and, when the user seems to need real
 * counselling (a worry, a decision, a relationship knot), offers to step into
 * Lucy Master. Local heuristics only; the user always chooses.
 */
const DISMISS_KEY = 'lucy_master_offer_dismissed_at';
const FROM_OFFER_KEY = 'lucy_master_from_offer';
const COOLDOWN_MS = 45 * 60 * 1000;

const STRONG = /(고민|걱정|불안|막막|답답|힘들|괴로|지쳐|우울|외로|무서|두려|혼란|복잡|어떡해|어떻게\s*해야|어쩌지|모르겠어|결정|선택|갈등|헤어|이별|재회|짝사랑|이직|퇴사|진로|시험|합격|빚|대출|돈\s*문제|싸웠|서운|배신|상처)/;
const SOFT = /(그\s*사람|남친|여친|애인|연애|결혼|회사|상사|부모|가족|친구|미래|앞으로|운세|궁금)/;
const CASUAL_ONLY = /^(응|어|웅|네|예|ㅇㅇ|ㅋ+|ㅎ+|고마워|감사|좋아|안녕|하이|굿)[.!?~ ]*$/;

/** 0..n: how strongly the recent user turns ask for counselling. */
export function counsellingNeedScore(recentUserTexts: readonly string[]): number {
  let score = 0;
  for (const raw of recentUserTexts.slice(-3)) {
    const text = (raw || '').trim();
    if (!text || CASUAL_ONLY.test(text)) continue;
    if (STRONG.test(text)) score += 2;
    if (SOFT.test(text)) score += 1;
    if (text.length >= 25) score += 1;
    if (/[?？]|까\s*$|까요|할까|될까/.test(text)) score += 1;
  }
  return score;
}

export function shouldOfferLucyMaster(recentUserTexts: readonly string[], now = Date.now()): boolean {
  try {
    const dismissedAt = Number(safeSessionStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && now - dismissedAt < COOLDOWN_MS) return false;
  } catch { /* storage optional */ }
  return counsellingNeedScore(recentUserTexts) >= 4;
}

export function dismissLucyMasterOffer(now = Date.now()): void {
  try { safeSessionStorage.setItem(DISMISS_KEY, String(now)); } catch { /* storage optional */ }
}

/** Mark that Master was entered from Lucy's offer, so the greeting carries the conversation. */
export function markLucyMasterFromOffer(): void {
  try { safeSessionStorage.setItem(FROM_OFFER_KEY, '1'); } catch { /* storage optional */ }
}

export function consumeLucyMasterFromOffer(): boolean {
  try {
    const on = safeSessionStorage.getItem(FROM_OFFER_KEY) === '1';
    safeSessionStorage.removeItem(FROM_OFFER_KEY);
    return on;
  } catch { return false; }
}

/* ── Leaving Lucy Master: when the consultation sounds finished, offer to go back to regular Lucy. ── */
const RETURN_DISMISS_KEY = 'lucy_master_return_dismissed_at';
const RETURN_COOLDOWN_MS = 20 * 60 * 1000;
const CLOSING = /(고마워|고맙|감사|덕분|알겠어|알았어|이해(됐|했)|정리(됐|가\s*됐|돼)|마음이\s*(편해|가벼워|놓여)|편해졌|가벼워졌|후련|이제\s*(됐|괜찮|충분)|충분해|그만\s*(할래|하자|볼래)|여기까지|끝|잘\s*자|다음에\s*(또|봐)|ㄱㅅ|땡큐|thank)/i;
const STILL_ASKING = /[?？]|까\s*$|할까|될까|어떻게|왜|뭐야|궁금|더\s*(알려|봐|말해)|그럼|그러면/;
const CHOICE_ONLY = /^(루시랑 하던 얘기 이어서|새로 시작할래|연애·관계|일·진로|돈·재물|마음이 복잡해|그냥 마음이 복잡해|사주로만 계속할래|응, 한 장 뽑아볼래|세 장 뽑아줘)$/;

/** True when the latest user turn closes the consultation after real back-and-forth. */
export function isConsultationClosing(masterUserTexts: readonly string[]): boolean {
  const meaningful = masterUserTexts.map(text => (text || '').trim()).filter(text => text && !CHOICE_ONLY.test(text));
  if (meaningful.length < 2) return false;
  const last = meaningful[meaningful.length - 1];
  return CLOSING.test(last) && !STILL_ASKING.test(last);
}

export function shouldOfferReturnToLucy(masterUserTexts: readonly string[], now = Date.now()): boolean {
  try {
    const dismissedAt = Number(safeSessionStorage.getItem(RETURN_DISMISS_KEY) || 0);
    if (dismissedAt && now - dismissedAt < RETURN_COOLDOWN_MS) return false;
  } catch { /* storage optional */ }
  return isConsultationClosing(masterUserTexts);
}

export function dismissReturnToLucyOffer(now = Date.now()): void {
  try { safeSessionStorage.setItem(RETURN_DISMISS_KEY, String(now)); } catch { /* storage optional */ }
}
