const UINT32_RANGE = 2 ** 32;
const PAIR_RANGE = 36;

export function randomIndex(limit: number): number {
  const buffer = new Uint32Array(1);
  const cutoff = UINT32_RANGE - UINT32_RANGE % limit;
  do { globalThis.crypto.getRandomValues(buffer); } while (buffer[0] >= cutoff);
  return buffer[0] % limit;
}

export type OrbDicePair = [number, number];

export function rollOrbDice(): OrbDicePair {
  return [randomIndex(6) + 1, randomIndex(6) + 1];
}

export function dicePairIndex([first, second]: OrbDicePair): number {
  return (first - 1) * 6 + second - 1;
}

/** Read two independent pairs as base-36 digits. Discard the incomplete last block. */
export function drawOrbDiceIndex(limit: number, roll = rollOrbDice): number {
  const range = PAIR_RANGE ** 2;
  const cutoff = range - range % limit;
  let index: number;
  do { index = dicePairIndex(roll()) * PAIR_RANGE + dicePairIndex(roll()); } while (index >= cutoff);
  return index % limit;
}

/** Draw six lines from bottom to top, with 6/7/8/9 weights 1/3/3/1. */
export function drawOrbIchingLines(roll = rollOrbDice): number[] {
  const values = [6, 7, 7, 8, 7, 8, 8, 9];
  return Array.from({ length: 6 }, () => {
    let index: number;
    do { index = dicePairIndex(roll()); } while (index >= 32);
    return values[index % values.length];
  });
}

export function drawOrbTarotPositions(size: number, picked: readonly number[], roll = rollOrbDice, count = 3): number[] {
  const remaining = Array.from({ length: size }, (_, i) => i + 1).filter(position => !picked.includes(position));
  const result = [...picked];
  while (result.length < count && remaining.length) {
    const [position] = remaining.splice(drawOrbDiceIndex(remaining.length, roll), 1);
    result.push(position);
  }
  return result;
}
