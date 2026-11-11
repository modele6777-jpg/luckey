export function shuffleTrackIndices(length: number, random: () => number = Math.random): number[] {
  const indices = Array.from({ length: Math.max(0, Math.floor(length)) }, (_, index) => index);
  for (let index = indices.length - 1; index > 0; index--) {
    const sample = random();
    const swapIndex = Number.isFinite(sample)
      ? Math.max(0, Math.min(index, Math.floor(sample * (index + 1))))
      : 0;
    [indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]];
  }
  return indices;
}

export function buildNextShuffleOrder(
  trackCount: number,
  avoidIndex: number,
  random: () => number = Math.random,
): number[] {
  const nextShuffled = shuffleTrackIndices(trackCount, random);
  if (nextShuffled.length > 1 && nextShuffled[0] === avoidIndex) {
    const swapWith = nextShuffled.findIndex((index, position) => position > 0 && index !== avoidIndex);
    if (swapWith > 0) {
      [nextShuffled[0], nextShuffled[swapWith]] = [nextShuffled[swapWith], nextShuffled[0]];
    }
  }
  return nextShuffled;
}
