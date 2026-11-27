/**
 * 상담 중(phase === 'live') 글 영역(.lucy-orb-copy)의 아래 끝을 정한다.
 *
 * '음성 대화 방식' 안내와 🃏 카드 섞기·키워드 칩은 빅뱅 버튼 바로 위에서 잘리면 안 된다.
 * 빅뱅 버튼을 완전히 비켜 가면 접힌 화면처럼 세로가 짧은 곳에서 마지막 줄이 반쯤 잘리므로,
 * 빅뱅 버튼 위로는 ORB_COPY_OVERLAP 만큼 겹쳐 내려가고, 그 아래 입력창(도크) 위로는 내려가지 않는다.
 */
export const ORB_COPY_OVERLAP = 72;

/** 빅뱅 버튼 위로 겹쳐도 되는 최대 높이(px). 버튼 한 개(84px)보다 작게 두어 오브 가운데를 덮지 않는다. */
export function resolveOrbOverlap(): number {
  return ORB_COPY_OVERLAP;
}

/**
 * @param clear     빅뱅 버튼·입력창을 모두 비켜 간 높이 (px) — 화면 아래에서 잰 --orb-bok-bottom
 * @param dockClear 입력창(도크) 위 여백 (px) — --orb-dock-clear
 * @param overlap   빅뱅 버튼 위로 겹쳐도 되는 높이 (기본 ORB_COPY_OVERLAP)
 */
export function resolveOrbCopyBottom(input: { clear: number; dockClear: number; overlap?: number }): number {
  const clear = Number.isFinite(input.clear) ? input.clear : 0;
  const dockClear = Number.isFinite(input.dockClear) ? input.dockClear : 0;
  const overlap = Math.max(0, Number.isFinite(input.overlap as number) ? (input.overlap as number) : ORB_COPY_OVERLAP);
  // 빅뱅 버튼 위로는 overlap 만큼만 겹치고, 입력창 위로는 절대 내려가지 않는다.
  return Math.round(Math.max(dockClear, clear - overlap));
}

/**
 * 수정구슬(탁자)이 쓸 수 있는 세로 공간(px). 글 영역이 다 보이도록 남은 만큼만 준다.
 * @param stageHeight 오브 화면 높이
 * @param clear       빅뱅 버튼·입력창을 비켜 간 높이 (px)
 * @param paddingTop  화면 위 여백
 * @param copyHeight  글 영역 내용 높이
 */
export function resolveOrbLiveRoom(input: { stageHeight: number; clear: number; paddingTop: number; copyHeight: number }): number {
  const room = input.stageHeight - input.clear - input.paddingTop - input.copyHeight - 16;
  return Math.max(110, Math.round(Number.isFinite(room) ? room : 110));
}
