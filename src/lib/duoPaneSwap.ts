export type DuoPaneSide = 'left' | 'right';

export interface DuoDividerTap {
  timestamp: number;
  clientX: number;
  clientY: number;
  pointerType: string;
}

const DOUBLE_TAP_WINDOW_MS = 380;
const DOUBLE_TAP_MAX_DISTANCE_PX = 36;

export function isDuoDividerDoubleTap(
  previous: DuoDividerTap | null,
  current: DuoDividerTap,
): boolean {
  if (!previous || previous.pointerType !== current.pointerType) return false;

  const elapsed = current.timestamp - previous.timestamp;
  if (elapsed < 0 || elapsed > DOUBLE_TAP_WINDOW_MS) return false;

  return Math.hypot(current.clientX - previous.clientX, current.clientY - previous.clientY)
    <= DOUBLE_TAP_MAX_DISTANCE_PX;
}

export function mapDuoPaneSide(side: DuoPaneSide, swapped: boolean): DuoPaneSide {
  if (!swapped) return side;
  return side === 'left' ? 'right' : 'left';
}
