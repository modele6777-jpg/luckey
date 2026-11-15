/**
 * 🔎 대화 검색은 목록 자체를 바꾸므로, 검색 전에 읽고 있던 위치를 따로 기억해 두었다가
 * 검색을 닫으면 그 자리로 되돌린다. 되돌리는 기준은 "맨 위/아래"가 아니라 최신 메시지로부터의 거리다.
 * (검색 중에 새 메시지가 와서 전체 높이가 달라져도 읽던 줄이 유지된다.)
 */

/** 검색을 열기 직전의 읽던 위치. distanceFromBottom은 최신 메시지(맨 아래)로부터의 거리. */
export type LucySearchScrollAnchor = {
  distanceFromBottom: number;
  pinnedToBottom: boolean;
};

/** 최신 메시지에서 이 정도 안쪽이면 하단(최신 대화)을 보고 있는 것으로 본다 — 채팅 스크롤 핸들러와 같은 기준. */
const BOTTOM_TOLERANCE = 80;

export function captureLucySearchAnchor(scrollTop: number, scrollHeight: number, clientHeight: number): LucySearchScrollAnchor {
  const maxTop = Math.max(0, scrollHeight - clientHeight);
  const top = Math.min(Math.max(0, Number.isFinite(scrollTop) ? scrollTop : 0), maxTop);
  const distanceFromBottom = maxTop - top;
  return {
    distanceFromBottom,
    pinnedToBottom: distanceFromBottom <= BOTTOM_TOLERANCE,
  };
}

/**
 * 검색을 닫은 뒤 되돌릴 scrollTop.
 * 하단을 보던 독자는 최신 메시지로, 위쪽 기록을 읽던 독자는 읽던 줄로 돌아간다.
 */
export function resolveLucySearchRestoreTop(
  anchor: LucySearchScrollAnchor | null,
  scrollHeight: number,
  clientHeight: number,
): number {
  const maxTop = Math.max(0, scrollHeight - clientHeight);
  if (!anchor) return maxTop;
  if (anchor.pinnedToBottom) return maxTop;
  const top = maxTop - Math.max(0, anchor.distanceFromBottom);
  return Math.min(Math.max(0, top), maxTop);
}
