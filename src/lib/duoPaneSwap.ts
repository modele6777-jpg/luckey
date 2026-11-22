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
  axis: 'x' | 'y' = 'x',
): boolean {
  if (!previous || previous.pointerType !== current.pointerType) return false;

  const elapsed = current.timestamp - previous.timestamp;
  if (elapsed < 0 || elapsed > DOUBLE_TAP_WINDOW_MS) return false;

  // Landscape divider is a vertical strip, so taps may land anywhere along Y.
  // Portrait divider is a horizontal strip, so taps may land anywhere along X.
  const delta = axis === 'y'
    ? Math.abs(current.clientY - previous.clientY)
    : Math.abs(current.clientX - previous.clientX);
  return delta <= DOUBLE_TAP_MAX_HORIZONTAL_DISTANCE_PX;
}

export function mapDuoPaneSide(side: DuoPaneSide, swapped: boolean): DuoPaneSide {
  if (!swapped) return side;
  return side === 'left' ? 'right' : 'left';
}

export function shouldResetDuoPaneSwapOnFold(wasUnfolded: boolean, isNowUnfolded: boolean): boolean {
  return wasUnfolded && !isNowUnfolded;
}
