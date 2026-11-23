/**
 * 실시간 자막: 들리는 순간에 도착한 말 조각을 한 '쪽'에 이어 붙인다 (TV 자막처럼 앞에서부터 차오른다).
 * 문장이 끝나면 다음 단어부터 새 쪽, 쪽이 두 줄(limit 글자)을 넘으면 넘친 단어부터 새 쪽. 단어는 자르지 않는다.
 *
 * 한 조각 안에서 쪽이 바뀌면("충분합니다. 다만") 앞쪽을 먼저 보여 주고, 뒤쪽은 앞 글자 수만큼 말한 뒤에 보여 준다
 * (afterChars × 한 글자 말하는 시간). 그래야 "충분합니다." 같은 끝말이 건너뛰어지지 않는다.
 */
export interface CaptionStep { page: string; afterChars: number }

/** 한국어로 한 글자를 말하는 데 걸리는 대략의 시간 (초당 7글자 남짓). */
export const CAPTION_CHAR_MS = 130;

export function captionSteps(page: string, fragment: string, limit = 40): { steps: CaptionStep[]; page: string } {
  const steps: CaptionStep[] = [];
  let next = page;
  let consumed = 0;
  let stepStart = 0;
  let changed = false;
  for (const piece of fragment.split(/(\s+)/)) {
    if (!piece) continue;
    if (/^\s+$/.test(piece)) {
      if (next) next = `${next.replace(/\s+$/, '')} `;
      consumed += piece.length;
      continue;
    }
    const ended = /[.!?…。]\s*$/.test(next);
    const attaches = Boolean(next) && !/\s$/.test(next) && !ended;
    const candidate = attaches ? `${next}${piece}` : next.trim() ? `${next.replace(/\s+$/, '')} ${piece}` : piece;
    const breakPage = ended || (candidate.length > limit && !attaches && Boolean(next.trim()));
    if (breakPage) {
      if (changed) steps.push({ page: next.trim(), afterChars: stepStart });
      next = piece;
      stepStart = consumed;
    } else {
      next = candidate;
    }
    changed = true;
    consumed += piece.length;
  }
  // 첫 단계는 조각이 들리는 순간 바로 보여 준다.
  if (changed) steps.push({ page: next.trim(), afterChars: steps.length ? stepStart : 0 });
  return { steps, page: next };
}

export function advanceCaption(page: string, fragment: string, limit = 40): string {
  return captionSteps(page, fragment, limit).page;
}
