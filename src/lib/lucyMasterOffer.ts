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
