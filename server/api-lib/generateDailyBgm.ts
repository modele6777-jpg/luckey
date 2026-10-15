export const DAILY_BGM_ALGO_VERSION = 2;

export type DailyBgmRecipe = {
  seed: number;
  rootHz: number;
  padNotes: number[];
  padGain: number;
  noiseGain: number;
  swellPeriod: number;
  shimmerRate: number;
  texture: 'soft' | 'rain' | 'ocean' | 'bells';
};

export type DailyBgmInput = {
  focusPlaylist: string;
  frequency?: string;
  cardName?: string;
  symbol?: string;
  dateKey: string;
  trackKey: string;
};

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseFrequencyHz(frequency?: string): number | null {
  if (!frequency) return null;
  const match = String(frequency).match(/(\d{2,4})\s*hz/i);
  if (!match) return null;
  const hz = Number(match[1]);
  return Number.isFinite(hz) ? hz : null;
}

function detectTexture(focusPlaylist: string): DailyBgmRecipe['texture'] {
  const mood = focusPlaylist.toLowerCase();
  if (mood.includes('rain') || mood.includes('비') || mood.includes('cozy')) return 'rain';
  if (mood.includes('ocean') || mood.includes('wave') || mood.includes('바다') || mood.includes('물')) return 'ocean';
  if (mood.includes('bell') || mood.includes('bowl') || mood.includes('탑') || mood.includes('종')) return 'bells';
  return 'soft';
}

const SOLFEGGIO = [174.61, 285.34, 396.0, 417.3, 528.0, 639.0, 741.0, 852.0, 963.0];
const PENTATONIC = [130.81, 146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63, 392.0, 440.0];

export function buildDailyBgmRecipe(input: DailyBgmInput): DailyBgmRecipe {
  const seedSource = [
    `ambient-v${DAILY_BGM_ALGO_VERSION}`,
    input.trackKey,
    input.dateKey,
    input.focusPlaylist,
    input.frequency || '',
    input.cardName || '',
    input.symbol || '',
  ].join('|');
  const seed = hashString(seedSource);
  const rand = mulberry32(seed);

  const parsedHz = parseFrequencyHz(input.frequency);
  let rootHz = parsedHz ?? SOLFEGGIO[seed % SOLFEGGIO.length];
  if (rootHz > 320) rootHz = rootHz / 2;
  if (rootHz < 90) rootHz = rootHz * 2;

  const rootIndex = Math.floor(rand() * PENTATONIC.length);
  const padNotes = [
    PENTATONIC[rootIndex % PENTATONIC.length],
    PENTATONIC[(rootIndex + 2) % PENTATONIC.length],
    PENTATONIC[(rootIndex + 4) % PENTATONIC.length],
    PENTATONIC[(rootIndex + 6) % PENTATONIC.length],
  ];

  const texture = detectTexture(input.focusPlaylist);
  const moodBoost = input.focusPlaylist.toLowerCase();
  const padGain =
    moodBoost.includes('calm') || moodBoost.includes('명상') || moodBoost.includes('zen') ? 0.16 : 0.13;
  const noiseGain =
    texture === 'rain' ? 0.07 : texture === 'ocean' ? 0.06 : moodBoost.includes('forest') ? 0.04 : 0.025;

  return {
    seed,
    rootHz,
    padNotes,
    padGain,
    noiseGain,
    swellPeriod: 14 + rand() * 16,
    shimmerRate: 0.04 + rand() * 0.06,
    texture,
  };
}

function writeAscii(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}

function floatTo16BitPCM(float32: Float32Array): Int16Array {
  const out = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

export function renderDailyBgmWav(recipe: DailyBgmRecipe, durationSec = 48, sampleRate = 44100): Buffer {
  const numSamples = Math.floor(sampleRate * durationSec);
  const rand = mulberry32(recipe.seed ^ 0x9e3779b9);
  const left = new Float32Array(numSamples);
  const right = new Float32Array(numSamples);
  let brown = 0;
  let oceanPhase = 0;

  const stereoDetuneL = 1.0012;
  const stereoDetuneR = 0.9988;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const swell = 0.62 + 0.38 * Math.sin((2 * Math.PI * t) / recipe.swellPeriod);

    let padL = 0;
    let padR = 0;
    for (let n = 0; n < recipe.padNotes.length; n++) {
      const note = recipe.padNotes[n];
      const voiceLfo = 0.55 + 0.45 * Math.sin(2 * Math.PI * (recipe.shimmerRate + n * 0.008) * t + n);
      padL += Math.sin(2 * Math.PI * note * stereoDetuneL * t) * voiceLfo;
      padR += Math.sin(2 * Math.PI * note * stereoDetuneR * t) * voiceLfo;
    }
    padL /= recipe.padNotes.length;
    padR /= recipe.padNotes.length;

    const droneL = Math.sin(2 * Math.PI * recipe.rootHz * stereoDetuneL * t) * 0.035;
    const droneR = Math.sin(2 * Math.PI * recipe.rootHz * stereoDetuneR * t) * 0.035;

    const white = rand() * 2 - 1;
    brown = (brown + 0.018 * white) / 1.018;

    let textureL = 0;
    let textureR = 0;
    if (recipe.texture === 'rain') {
      const drip = Math.sin(2 * Math.PI * (4.5 + recipe.shimmerRate * 10) * t + brown * 0.4) * 0.02;
      textureL = brown * 0.75 + drip;
      textureR = brown * 0.72 + drip * 0.9;
    } else if (recipe.texture === 'ocean') {
      oceanPhase += (2 * Math.PI * (0.08 + recipe.shimmerRate * 0.2)) / sampleRate;
      const wave = Math.sin(oceanPhase) * 0.5 + Math.sin(oceanPhase * 0.47 + 1.2) * 0.3;
      textureL = brown * 0.45 + wave * 0.04;
      textureR = brown * 0.42 + wave * 0.038;
    } else {
      textureL = brown * 0.55;
      textureR = brown * 0.52;
    }

    const bellPeriod = recipe.texture === 'bells' ? 7.5 : 9.5;
    const bellHit =
      Math.exp(-((t % bellPeriod) ** 2) * 2.2) *
      Math.sin(2 * Math.PI * recipe.padNotes[0] * 2 * t) *
      (recipe.texture === 'bells' ? 0.07 : 0.035);

    const arpStep = Math.floor(t * (0.22 + recipe.shimmerRate)) % recipe.padNotes.length;
    const arp =
      Math.sin(2 * Math.PI * recipe.padNotes[arpStep] * 1.5 * t) *
      (0.02 + 0.015 * Math.sin(2 * Math.PI * 0.11 * t));

    left[i] =
      swell *
      (recipe.padGain * padL + droneL + recipe.noiseGain * textureL + bellHit + arp);
    right[i] =
      swell *
      (recipe.padGain * padR + droneR + recipe.noiseGain * textureR + bellHit * 0.88 + arp * 0.92);
  }

  const fadeSamples = Math.floor(sampleRate * 2.5);
  for (let i = 0; i < fadeSamples; i++) {
    const fadeIn = i / fadeSamples;
    const fadeOut = (fadeSamples - i) / fadeSamples;
    left[i] *= fadeIn;
    right[i] *= fadeIn;
    const end = numSamples - 1 - i;
    left[end] *= fadeOut;
    right[end] *= fadeOut;
  }

  const interleaved = new Float32Array(numSamples * 2);
  for (let i = 0; i < numSamples; i++) {
    interleaved[i * 2] = Math.max(-0.98, Math.min(0.98, left[i]));
    interleaved[i * 2 + 1] = Math.max(-0.98, Math.min(0.98, right[i]));
  }

  const pcm = floatTo16BitPCM(interleaved);
  const dataSize = pcm.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);

  writeAscii(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, 'WAVE');
  writeAscii(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < pcm.length; i++) {
    view.setInt16(44 + i * 2, pcm[i], true);
  }

  return buffer;
}

export function generateDailyBgmBuffer(input: DailyBgmInput): {
  buffer: Buffer;
  recipe: DailyBgmRecipe;
  durationSec: number;
} {
  const recipe = buildDailyBgmRecipe(input);
  const durationSec = 48;
  const buffer = renderDailyBgmWav(recipe, durationSec);
  return { buffer, recipe, durationSec };
}