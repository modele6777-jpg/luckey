let pinnedToBottom = true;
let holdUntil = 0;

/** The conversation was at the latest messages before a popup changed the viewport. */
export function noteLucyScrollPin(next: boolean) {
  pinnedToBottom = next;
}

export function isLucyScrollPinned() {
  return pinnedToBottom;
}

/** iOS adjusts scrollTop when a popup closes, after the overlay node is already gone. */
export function holdLucyScrollPin(ms = 900) {
  holdUntil = Date.now() + ms;
}

export function lucyScrollPinHeld() {
  return Date.now() < holdUntil;
}
