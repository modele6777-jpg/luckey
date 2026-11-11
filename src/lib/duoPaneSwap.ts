export type DuoPaneSide = 'left' | 'right';

export interface DuoDividerTap {
  timestamp: number;
  clientX: number;
  clientY: number;
  pointerType: string;
}

const DOUBLE_TAP_WINDOW_MS = 380;
const DOUBLE_TAP_MAX_HORIZONTAL_DISTANCE_PX = 48;

export function isDuoDividerDoubleTap(
  previous: DuoDividerTap | null,
  current: DuoDividerTap,
): boolean {
  if (!previous || previous.pointerType !== current.pointerType) return false;

  const elapsed = current.timestamp - previous.timestamp;
  if (elapsed < 0 || elapsed > DOUBLE_TAP_WINDOW_MS) return false;

  // The hit target spans the divider vertically, so taps may be anywhere from top to bottom.
  return Math.abs(current.clientX - previous.clientX) <= DOUBLE_TAP_MAX_HORIZONTAL_DISTANCE_PX;
}

export function mapDuoPaneSide(side: DuoPaneSide, swapped: boolean): DuoPaneSide {
  if (!swapped) return side;
  return side === 'left' ? 'right' : 'left';
}

export function shouldResetDuoPaneSwapOnFold(wasUnfolded: boolean, isNowUnfolded: boolean): boolean {
  return wasUnfolded && !isNowUnfolded;
}
