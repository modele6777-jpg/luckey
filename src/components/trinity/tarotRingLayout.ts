/**
 * Places the cards still in the deck evenly around a full circle.
 * Deck order is preserved: unpicked cards keep the sequence they already had.
 * Picked indexes stay at their previous slot so a hidden card does not fly across the ring.
 */
export function placeRingCards(ids: readonly string[], pickedIds: ReadonlySet<string>): Float64Array {
  const count = ids.length;
  const angles = new Float64Array(count);
  if (count === 0) return angles;

  const active: number[] = [];
  for (let i = 0; i < count; i++) {
    if (!pickedIds.has(ids[i])) active.push(i);
  }

  const fullStep = (2 * Math.PI) / count;
  if (active.length === 0) {
    for (let i = 0; i < count; i++) angles[i] = i * fullStep;
    return angles;
  }

  if (active.length === count) {
    for (let i = 0; i < count; i++) angles[i] = i * fullStep;
    return angles;
  }

  const evenStep = (2 * Math.PI) / active.length;
  // Anchor on the first remaining card so the ring does not spin when a later card is drawn.
  const anchor = active[0] * fullStep;
  for (let k = 0; k < active.length; k++) {
    angles[active[k]] = anchor + k * evenStep;
  }
  for (let i = 0; i < count; i++) {
    if (pickedIds.has(ids[i])) angles[i] = i * fullStep;
  }
  return angles;
}

/**
 * Landscape fan: the slot strip and spread banner sit above this box.
 * `arcTop` is the card *center*. md wheel cards are 160px tall and the
 * front card lifts 20px, so the center has to sit far enough down that
 * the card face does not cover the spread. The circle center stays below
 * the wheel so the glow does not cover the shuffle buttons.
 */
export const LANDSCAPE_ARC_TOP = 100;

export function landscapeFanMetrics(containerHeight: number, arcTop = LANDSCAPE_ARC_TOP): {
  radius: number;
  yOffset: number;
  arcTop: number;
  hubClearance: number;
  originY: number;
  arcTopY: number;
} {
  const height = Math.max(160, containerHeight);
  const hubClearance = 96;
  const yOffset = Math.round(height / 2 + hubClearance);
  const radius = Math.round(height / 2 + yOffset - arcTop);
  const originY = height / 2 + yOffset;
  return { radius, yOffset, arcTop, hubClearance, originY, arcTopY: originY - radius };
}

/**
 * Portrait (and any tall) fan: card centers sit on a circle whose top clears
 * the spread slots and whose sides reach the control bar. A fixed radius
 * left a black band under the arc whenever the pane was taller than that circle.
 */
export function portraitFanMetrics(width: number, height: number, arcTop: number): {
  radius: number;
  yOffset: number;
  arcTop: number;
  originY: number;
  arcTopY: number;
  bottomY: number;
} {
  const w = Math.max(160, width);
  const h = Math.max(220, height);
  const sideInset = 2;
  // Side cards are tilted, so their bodies hang below the center. This inset
  // keeps that body just above the shuffle bar instead of clipping it or floating.
  const bottomInset = w < 540 ? 40 : w < 768 ? 48 : 56;
  const halfW = Math.max(56, w / 2 - sideInset);
  const bottomY = h - bottomInset;
  const top = Math.min(Math.max(96, arcTop), bottomY - 120);
  const span = bottomY - top;
  const originY = (bottomY + top) / 2 + (halfW * halfW) / (2 * span);
  const radius = originY - top;
  const yOffset = originY - h / 2;
  return {
    radius: Math.round(radius),
    yOffset: Math.round(yOffset),
    arcTop: Math.round(top),
    originY: Math.round(originY),
    arcTopY: Math.round(top),
    bottomY,
  };
}
export function ringNeighborGaps(angles: ArrayLike<number>, activeIndices: readonly number[]): number[] {
  const gaps: number[] = [];
  const m = activeIndices.length;
  if (m === 0) return gaps;
  for (let k = 0; k < m; k++) {
    const a = angles[activeIndices[k]];
    const b = angles[activeIndices[(k + 1) % m]];
    let delta = b - a;
    if (delta <= 0) delta += 2 * Math.PI;
    gaps.push(delta);
  }
  return gaps;
}
