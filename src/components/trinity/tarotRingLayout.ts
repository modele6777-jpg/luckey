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

/** Wheel-card width used by the spread at this column width, matching the Tailwind steps. */
export function fanCardWidth(containerWidth: number): number {
  if (containerWidth < 420) return 64;
  if (containerWidth < 768) return 80;
  return 96;
}

/**
 * Largest radius whose card faces stay inside the column.
 * The ring is centered on the container, so both sides share the same inset.
 */
export function maxFanRadius(containerWidth: number, cardWidth = fanCardWidth(containerWidth), pad = 12): number {
  const width = Math.max(cardWidth + pad * 2 + 8, containerWidth);
  return Math.max(96, width / 2 - cardWidth / 2 - pad);
}

export function portraitFanMetrics(containerWidth: number, containerHeight: number, cardWidth = fanCardWidth(containerWidth)): {
  radius: number;
  yOffset: number;
} {
  const height = Math.max(200, containerHeight);
  const cardHeight = cardWidth < 72 ? 112 : cardWidth < 90 ? 136 : 160;
  // Keep the front card below the position slots, then size the circle so the
  // widest visible chord still lands inside this column.
  const arcTop = Math.round(Math.min(height * 0.5, Math.max(height * 0.34, cardHeight + 36)));
  const drop = Math.max(1, height - arcTop);
  const half = maxFanRadius(containerWidth, cardWidth);
  const radiusForArc = (half * half + drop * drop) / (2 * drop);
  const radius = Math.round(Math.min(half, radiusForArc, 680));
  return { radius, yOffset: Math.max(0, Math.round(arcTop + radius - height / 2)) };
}

/** Shrink a landscape ring when the column is narrower than the preferred circle. */
export function clampFanToWidth(
  radius: number,
  yOffset: number,
  containerWidth: number,
  containerHeight: number,
  cardWidth = fanCardWidth(containerWidth),
  arcTop = LANDSCAPE_ARC_TOP,
): { radius: number; yOffset: number } {
  const limit = maxFanRadius(containerWidth, cardWidth);
  if (radius <= limit) return { radius, yOffset };
  const next = Math.round(limit);
  return { radius: next, yOffset: Math.max(0, Math.round(arcTop + next - containerHeight / 2)) };
}

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

/** Neighbor gaps around the circle, including the wrap from the last card back to the first. */
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
