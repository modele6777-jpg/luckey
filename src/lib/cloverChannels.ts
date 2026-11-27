/**
 * 🍀 네잎클로버 하위 채널 목록(7대 앱)의 접힘 상태 결정.
 *
 * 사용자 지시(2026-11-27): "펼쳤을때도 네잎클로버 접기가능하게 바꿔주되 기본값을 펼친 상태로 해줘"
 * - 접힘 화면의 기존 규칙은 그대로다: 럭키 채널에 있으면 펼치고, 그 밖으로 나가면 접는다.
 * - 펼친 화면도 클로버를 눌러 접고 펼 수 있다. 기본값은 펼침이며,
 *   접힘→펼침으로 넘어온 순간에만 기본값(펼침)을 적용한다.
 * - 이미 펼친 화면에서 사용자가 직접 접어 둔 상태는 경로 이동이나 화면 크기 변화로 다시 열지 않는다.
 */

/** 처음 화면에 들어올 때의 기본값. 펼친 화면과 럭키 채널은 펼침이 기본이다. */
export function initialCloverOpen(unfolded: boolean, pathIsLucky: boolean): boolean {
  return unfolded || pathIsLucky;
}

/**
 * 화면(fold) 상태나 경로가 바뀌었을 때의 접힘 상태.
 * `null`은 "그대로 둔다"는 뜻이다.
 */
export function cloverOpenAfterFoldOrPathChange(params: {
  /** 바뀌기 전 화면이 펼친 화면이었는지 */
  unfoldedBefore: boolean;
  /** 지금 화면이 펼친 화면인지 */
  unfolded: boolean;
  /** 지금 경로가 럭키 채널(클로버 목록을 쓰는 화면)인지 — 접힌 화면 규칙에만 쓴다 */
  pathIsLucky: boolean;
}): boolean | null {
  if (params.unfolded) {
    // 접힘→펼침 진입 순간에만 기본값(펼침)으로 맞춘다.
    // 이미 펼친 화면이면 사용자가 클로버로 접어 둔 상태를 보존한다.
    return params.unfoldedBefore ? null : true;
  }
  // 접힌 화면은 기존 규칙 그대로: 럭키 채널이면 펼치고, 아니면 접는다.
  return params.pathIsLucky;
}

/**
 * 네잎클로버 버튼을 눌렀을 때.
 * 펼쳐져 있으면 접고(이동 없음), 접혀 있으면 펼치면서 럭키 채널로 이동한다.
 */
export function cloverOpenAfterClick(open: boolean): { open: boolean; navigate: boolean } {
  return open ? { open: false, navigate: false } : { open: true, navigate: true };
}

/**
 * `prism:close-lucky-channels` (빅뱅 등에서 럭키를 벗어날 때).
 * 접힌 화면에서만 접는다 — 펼친 화면에서 사용자가 펼쳐 둔 상태를 깨지 않는다.
 */
export function cloverOpenAfterExit(unfolded: boolean): boolean | null {
  return unfolded ? null : false;
}
