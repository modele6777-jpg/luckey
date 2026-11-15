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
  // 읽을 수 없는 scrollTop은 믿지 않고 최신 대화(하단)로 본다.
  if (!Number.isFinite(scrollTop)) {
    return { distanceFromBottom: 0, pinnedToBottom: true };
  }
  const top = Math.min(Math.max(0, scrollTop), maxTop);
  const distanceFromBottom = maxTop - top;
  return {
    distanceFromBottom,
    pinnedToBottom: distanceFromBottom <= BOTTOM_TOLERANCE,
  };
}

/**
 * 🔎 검색창을 여는 순간의 자리 지킴.
 *
 * iOS WebKit은 폰트가 작은 검색 input에 포커스를 주면 자동 확대·뷰포트 이동을 하면서
 * 안쪽 스크롤 컨테이너(대화 목록)까지 건드린다. 그래서 검색창이 열린 직후 잠깐 동안은
 * "읽던 자리"에서 움직였는지 확인하고, 움직였다면 그 자리로 되돌린다.
 * 사용자가 직접 만진 뒤에는 절대 되돌리지 않는다.
 */
export type LucySearchOpenGuardInput = {
  /** 검색창을 열기 전에 읽고 있던 자리(열린 뒤 레이아웃 기준으로 다시 계산한 값) */
  expectedTop: number;
  /** 지금 컨테이너 scrollTop */
  currentTop: number;
  scrollHeight: number;
  clientHeight: number;
  /** 검색창이 열린 뒤 사용자가 직접 스크롤·터치를 했는지 */
  userTouched: boolean;
};

/** 몇 px까지는 브라우저의 소수점 반올림으로 본다. */
const OPEN_DRIFT_TOLERANCE = 2;

export function resolveLucySearchOpenGuardedTop(input: LucySearchOpenGuardInput): number | null {
  if (input.userTouched) return null;
  if (!Number.isFinite(input.currentTop) || !Number.isFinite(input.expectedTop)) return null;
  if (Math.abs(input.currentTop - input.expectedTop) <= OPEN_DRIFT_TOLERANCE) return null;
  const maxTop = Math.max(0, input.scrollHeight - input.clientHeight);
  const top = Math.min(Math.max(0, input.expectedTop), maxTop);
  if (Math.abs(input.currentTop - top) <= OPEN_DRIFT_TOLERANCE) return null;
  return top;
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
