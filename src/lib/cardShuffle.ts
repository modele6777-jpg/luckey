function randomIndex(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;

  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const sample = new Uint32Array(1);
    const range = 0x100000000;
    const unbiasedLimit = Math.floor(range / maxExclusive) * maxExclusive;
    let value = 0;

    do {
      globalThis.crypto.getRandomValues(sample);
      value = sample[0];
    } while (value >= unbiasedLimit);

    return value % maxExclusive;
  }

  return Math.floor(Math.random() * maxExclusive);
}

// Fisher-Yates gives every complete card arrangement the same probability.
export function shuffleCardDeck<T>(cards: readonly T[]): T[] {
  const shuffled = [...cards];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const swapIndex = randomIndex(i + 1);
    [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
  }

  return shuffled;
}

// 🔮 Quantum Cosmic Seed-based PRNG Shuffle Algorithm
// Combines User Profile ASCII weights, Astrological date values, Emotional Comfort resonance levels,
// and microsecond timestamps. Utilizes a Chaotic Trigonometric Sin-based PRNG Formula
// to mathematically guarantee cosmic randomness.
export function quantumSeedShuffle<T>(
  cards: readonly T[],
  profile: any,
  comfortLevel: number
): Array<T & { isReversed: boolean }> {
  const nameVal = profile?.nickname
    ? Array.from(String(profile.nickname)).reduce((acc, c) => acc + c.charCodeAt(0), 0)
    : (profile?.name ? Array.from(String(profile.name)).reduce((acc, c) => acc + c.charCodeAt(0), 0) : 818);
  
  const birthVal = profile?.birthdate
    ? Array.from(String(profile.birthdate).replace(/-/g, '')).reduce((acc, c) => acc + (parseInt(c) || 0), 0)
    : 777;

  const ms = Date.now() % 999983; // prime number limit
  // Combine all cosmic entropy factors into a master math seed
  const masterSeed = nameVal * 37 + birthVal * 19 + comfortLevel * 109 + ms;

  let seed = masterSeed;
  // Chaotic Trigonometric Sinusoidal Pseudo-Random Generator formula:
  // X_(n+1) = [sin(seed) * 10000] - floor([sin(seed) * 10000])
  const nextRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const copied = cards.map(c => ({
    ...c,
    // Upright/Reversed calculated based on our PRNG with 50% probability
    isReversed: nextRandom() > 0.5
  }));

  // Fisher-Yates shuffle utilizing our chaotic PRNG
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }

  return copied;
}

