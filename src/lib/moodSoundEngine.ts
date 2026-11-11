/**
 * Background Mood Sound Engine
 * Procedural Web Audio synthesis for background ambient atmospheres:
 * - Rain (빗소리)
 * - White / Pink Noise (화이트 & 핑크 노이즈)
 * - Forest Bird Calls (숲속 새소리 & 바람)
 * - Ocean Waves (해변 파도 소리)
 * - Cozy Fireplace (모닥불 장작 소리)
 *
 * 100% client-side, zero latency, seamless infinite procedural loop.
 */

import { getAmbientAudioBus, getSharedAudioContext } from './audio';

export type MoodSoundId = 'rain' | 'whitenoise' | 'forest' | 'ocean' | 'fireplace' | 'stream' | 'wind' | 'night';

export const NATURE_MOOD_IDS: readonly MoodSoundId[] = ['rain', 'forest', 'ocean', 'fireplace', 'stream', 'wind', 'night'];

export function pickRandomNatureMood(random: () => number = Math.random): MoodSoundId {
  const sample = random();
  const index = Number.isFinite(sample)
    ? Math.max(0, Math.min(NATURE_MOOD_IDS.length - 1, Math.floor(sample * NATURE_MOOD_IDS.length)))
    : 0;
  return NATURE_MOOD_IDS[index];
}

export interface MoodPreset {
  id: MoodSoundId;
  name: string;
  nameEn: string;
  emoji: string;
  description: string;
  color: string;
  accentClass: string;
  badge: string;
}

export const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'rain',
    name: '아늑한 빗소리',
    nameEn: 'Gentle Rain',
    emoji: '🌧️',
    description: '나뭇잎과 창가를 적시는 차분하고 촉촉한 빗줄기 소리',
    color: '#38bdf8',
    accentClass: 'from-sky-500/20 to-cyan-500/20 border-sky-400/40 text-sky-300',
    badge: '차분한 이완',
  },
  {
    id: 'forest',
    name: '숲속 새소리',
    nameEn: 'Forest Birds',
    emoji: '🌲',
    description: '청량한 숲속 솔바람과 기분 좋게 지저귀는 새들의 노래',
    color: '#34d399',
    accentClass: 'from-emerald-500/20 to-teal-500/20 border-emerald-400/40 text-emerald-300',
    badge: '정서 정화',
  },
  {
    id: 'stream',
    name: '숲속 계곡물',
    nameEn: 'Woodland Stream',
    emoji: '💧',
    description: '돌 사이를 맑게 흐르고 잔잔히 튀는 시냇물 소리',
    color: '#2dd4bf',
    accentClass: 'from-teal-500/20 to-cyan-500/20 border-teal-400/40 text-teal-300',
    badge: '맑은 휴식',
  },
  {
    id: 'wind',
    name: '산들바람',
    nameEn: 'Mountain Breeze',
    emoji: '🍃',
    description: '나뭇잎 사이를 천천히 스치는 부드러운 바람',
    color: '#a3e635',
    accentClass: 'from-lime-500/20 to-emerald-500/20 border-lime-400/40 text-lime-300',
    badge: '가벼운 산책',
  },
  {
    id: 'night',
    name: '밤 풀벌레',
    nameEn: 'Night Crickets',
    emoji: '🌙',
    description: '고요한 밤공기 사이로 간간이 들리는 풀벌레 소리',
    color: '#818cf8',
    accentClass: 'from-indigo-500/20 to-violet-500/20 border-indigo-400/40 text-indigo-300',
    badge: '고요한 밤',
  },
  {
    id: 'whitenoise',
    name: '핑크 & 화이트 노이즈',
    nameEn: 'Calm Pink Noise',
    emoji: '📻',
    description: '잡념과 주변 소음을 부드럽게 지워주는 안정적인 백색소음',
    color: '#a78bfa',
    accentClass: 'from-purple-500/20 to-indigo-500/20 border-purple-400/40 text-purple-300',
    badge: '깊은 집중',
  },
  {
    id: 'ocean',
    name: '해변의 파도',
    nameEn: 'Ocean Waves',
    emoji: '🌊',
    description: '끝없이 밀려왔다 부서지는 고요한 밤바다의 파도 소리',
    color: '#06b6d4',
    accentClass: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/40 text-cyan-300',
    badge: '수면 유도',
  },
  {
    id: 'fireplace',
    name: '따스한 모닥불',
    nameEn: 'Warm Fireplace',
    emoji: '🔥',
    description: '타닥타닥 장작이 타오르는 아늑하고 포근한 온기 사운드',
    color: '#f97316',
    accentClass: 'from-orange-500/20 to-red-500/20 border-orange-400/40 text-orange-300',
    badge: '온기 휴식',
  },
];

export interface MoodAudioState {
  isPlaying: boolean;
  activeMood: MoodSoundId;
  volume: number; // 0.0 ~ 1.0
  isPickerOpen: boolean;
}

const STORAGE_KEY_MOOD = 'prism_mood_sound_id';
const STORAGE_KEY_VOL = 'prism_mood_sound_vol';

class MoodSoundEngine {
  private activeMood: MoodSoundId = 'rain';
  private isPlaying = false;
  private volume = 0.6;
  private isPickerOpen = false;

  private masterGain: GainNode | null = null;
  private activeCleanups: (() => void)[] = [];
  private birdTimer: any = null;
  private playbackGeneration = 0;
  private listeners: Set<(state: MoodAudioState) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedMood = localStorage.getItem(STORAGE_KEY_MOOD) as MoodSoundId;
        if (savedMood && MOOD_PRESETS.some(p => p.id === savedMood)) {
          this.activeMood = savedMood;
        }
        const savedVol = localStorage.getItem(STORAGE_KEY_VOL);
        if (savedVol !== null) {
          const v = parseFloat(savedVol);
          if (!isNaN(v) && v >= 0 && v <= 1) {
            this.volume = v;
          }
        }
      } catch {
        // storage disabled
      }
    }
  }

  public getState(): MoodAudioState {
    return {
      isPlaying: this.isPlaying,
      activeMood: this.activeMood,
      volume: this.volume,
      isPickerOpen: this.isPickerOpen,
    };
  }

  public subscribe(listener: (state: MoodAudioState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(l => l(s));
  }

  public setPickerOpen(open: boolean) {
    this.isPickerOpen = open;
    this.notify();
  }

  public togglePicker() {
    this.isPickerOpen = !this.isPickerOpen;
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem(STORAGE_KEY_VOL, String(this.volume));
    } catch {}
    if (this.masterGain && this.masterGain.context) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.masterGain.context.currentTime, 0.05);
    }
    this.notify();
  }

  public async setMood(moodId: MoodSoundId) {
    this.activeMood = moodId;
    try {
      localStorage.setItem(STORAGE_KEY_MOOD, moodId);
    } catch {}

    if (this.isPlaying) {
      await this.startMood(moodId);
    } else {
      this.notify();
    }
  }

  public async togglePlay(targetMood?: MoodSoundId): Promise<boolean> {
    if (targetMood && targetMood !== this.activeMood) {
      this.activeMood = targetMood;
    }

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.startMood(this.activeMood);
      return true;
    }
  }

  public async startMood(moodId: MoodSoundId): Promise<void> {
    const generation = ++this.playbackGeneration;
    this.stopNodes();
    this.activeMood = moodId;

    try {
      const ctx = getSharedAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      if (generation !== this.playbackGeneration) return;

      // Initialize master gain
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, this.volume), ctx.currentTime + 0.3);
      gainNode.connect(getAmbientAudioBus());
      this.masterGain = gainNode;

      switch (moodId) {
        case 'rain':
          this.buildRainSynth(ctx, gainNode);
          break;
        case 'whitenoise':
          this.buildPinkNoiseSynth(ctx, gainNode);
          break;
        case 'forest':
          this.buildForestSynth(ctx, gainNode);
          break;
        case 'ocean':
          this.buildOceanWavesSynth(ctx, gainNode);
          break;
        case 'fireplace':
          this.buildFireplaceSynth(ctx, gainNode);
          break;
        case 'stream':
          this.buildStreamSynth(ctx, gainNode);
          break;
        case 'wind':
          this.buildMountainWindSynth(ctx, gainNode);
          break;
        case 'night':
          this.buildNightInsectsSynth(ctx, gainNode);
          break;
      }

      this.isPlaying = true;
      this.notify();
    } catch (e) {
      console.warn('[MoodSoundEngine] Start failed:', e);
      this.isPlaying = false;
      this.notify();
    }
  }

  public stop(): void {
    const generation = ++this.playbackGeneration;
    if (!this.isPlaying && this.activeCleanups.length === 0) return;

    if (this.masterGain && this.masterGain.context) {
      const ctx = this.masterGain.context;
      try {
        this.masterGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.15);
      } catch {}
    }

    setTimeout(() => {
      if (generation === this.playbackGeneration) this.stopNodes();
    }, 200);

    this.isPlaying = false;
    this.notify();
  }

  private stopNodes(): void {
    if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }

    this.activeCleanups.forEach(cleanup => {
      try { cleanup(); } catch {}
    });
    this.activeCleanups = [];

    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch {}
      this.masterGain = null;
    }
  }

  // -------------------------------------------------------------
  // 1. 🌧️ Procedural Rain Generator
  // -------------------------------------------------------------
  private buildRainSynth(ctx: AudioContext, out: GainNode) {
    const buffer = this.createNoiseBuffer(ctx, 4);

    // Continuous soft background rainfall
    const rainSrc = ctx.createBufferSource();
    rainSrc.buffer = buffer;
    rainSrc.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(1400, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.45, ctx.currentTime);

    rainSrc.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(out);
    rainSrc.start();

    // Secondary mid-frequency textured rain drops
    const dropSrc = ctx.createBufferSource();
    dropSrc.buffer = buffer;
    dropSrc.loop = true;

    const dropFilter = ctx.createBiquadFilter();
    dropFilter.type = 'bandpass';
    dropFilter.frequency.setValueAtTime(800, ctx.currentTime);
    dropFilter.Q.setValueAtTime(2.5, ctx.currentTime);

    const dropGain = ctx.createGain();
    dropGain.gain.setValueAtTime(0.2, ctx.currentTime);

    dropSrc.connect(dropFilter);
    dropFilter.connect(dropGain);
    dropGain.connect(out);
    dropSrc.start();

    this.activeCleanups.push(() => {
      try { rainSrc.stop(); rainSrc.disconnect(); } catch {}
      try { dropSrc.stop(); dropSrc.disconnect(); } catch {}
    });
  }

  // -------------------------------------------------------------
  // 2. 📻 Smooth Pink & White Noise Generator
  // -------------------------------------------------------------
  private buildPinkNoiseSynth(ctx: AudioContext, out: GainNode) {
    const buffer = this.createPinkNoiseBuffer(ctx, 5);

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buffer;
    noiseSrc.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);

    noiseSrc.connect(filter);
    filter.connect(gain);
    gain.connect(out);
    noiseSrc.start();

    this.activeCleanups.push(() => {
      try { noiseSrc.stop(); noiseSrc.disconnect(); } catch {}
    });
  }

  // -------------------------------------------------------------
  // 3. 🌲 Forest Breeze with Procedural Bird Calls
  // -------------------------------------------------------------
  private buildForestSynth(ctx: AudioContext, out: GainNode) {
    // Gentle rustling wind / leaves
    const windBuffer = this.createPinkNoiseBuffer(ctx, 4);
    const windSrc = ctx.createBufferSource();
    windSrc.buffer = windBuffer;
    windSrc.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(450, ctx.currentTime);

    // Subtle gentle swell in breeze
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // 5s breeze cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(180, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);
    lfo.start();

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.35, ctx.currentTime);

    windSrc.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(out);
    windSrc.start();

    // Procedural bird song routine
    const birdBus = ctx.createGain();
    birdBus.gain.setValueAtTime(0.25, ctx.currentTime);
    birdBus.connect(out);

    let isDisposed = false;
    const scheduleNextBird = () => {
      if (isDisposed) return;
      const delayMs = 1800 + Math.random() * 3200;
      this.birdTimer = setTimeout(() => {
        if (isDisposed) return;
        this.chirpBird(ctx, birdBus);
        scheduleNextBird();
      }, delayMs);
    };

    scheduleNextBird();

    this.activeCleanups.push(() => {
      isDisposed = true;
      try { windSrc.stop(); windSrc.disconnect(); } catch {}
      try { lfo.stop(); lfo.disconnect(); } catch {}
    });
  }

  private chirpBird(ctx: AudioContext, dest: GainNode) {
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = 2600 + Math.random() * 1200;
      osc.type = 'sine';

      // 2 or 3 musical chirps
      const numChirps = Math.random() > 0.4 ? 3 : 2;
      let timeOffset = 0;

      for (let i = 0; i < numChirps; i++) {
        const chirpStart = now + timeOffset;
        const chirpDuration = 0.08 + Math.random() * 0.04;
        const targetFreq = baseFreq + (i % 2 === 0 ? 500 : -200) + Math.random() * 300;

        osc.frequency.setValueAtTime(baseFreq, chirpStart);
        osc.frequency.exponentialRampToValueAtTime(targetFreq, chirpStart + chirpDuration * 0.5);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, chirpStart + chirpDuration);

        gain.gain.setValueAtTime(0.0001, chirpStart);
        gain.gain.linearRampToValueAtTime(0.2, chirpStart + chirpDuration * 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, chirpStart + chirpDuration);

        timeOffset += chirpDuration + 0.05 + Math.random() * 0.06;
      }

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + timeOffset + 0.1);
    } catch {}
  }

  // -------------------------------------------------------------
  // 4. 🌊 Ocean Waves Synth
  // -------------------------------------------------------------
  private buildOceanWavesSynth(ctx: AudioContext, out: GainNode) {
    const buffer = this.createPinkNoiseBuffer(ctx, 6);

    const waveSrc = ctx.createBufferSource();
    waveSrc.buffer = buffer;
    waveSrc.loop = true;

    const waveFilter = ctx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(350, ctx.currentTime);

    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0.1, ctx.currentTime);

    // LFO for wave rolling swell
    const swellLfo = ctx.createOscillator();
    swellLfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8.3 second cycle

    const lfoFilterGain = ctx.createGain();
    lfoFilterGain.gain.setValueAtTime(550, ctx.currentTime);
    swellLfo.connect(lfoFilterGain);
    lfoFilterGain.connect(waveFilter.frequency);

    const lfoVolumeGain = ctx.createGain();
    lfoVolumeGain.gain.setValueAtTime(0.35, ctx.currentTime);
    swellLfo.connect(lfoVolumeGain);
    lfoVolumeGain.connect(waveGain.gain);

    swellLfo.start();
    waveSrc.connect(waveFilter);
    waveFilter.connect(waveGain);
    waveGain.connect(out);
    waveSrc.start();

    this.activeCleanups.push(() => {
      try { waveSrc.stop(); waveSrc.disconnect(); } catch {}
      try { swellLfo.stop(); swellLfo.disconnect(); } catch {}
    });
  }

  // -------------------------------------------------------------
  // 5. 🔥 Cozy Fireplace Crackle
  // -------------------------------------------------------------
  private buildFireplaceSynth(ctx: AudioContext, out: GainNode) {
    // Warm low roar
    const roarBuffer = this.createPinkNoiseBuffer(ctx, 4);
    const roarSrc = ctx.createBufferSource();
    roarSrc.buffer = roarBuffer;
    roarSrc.loop = true;

    const roarFilter = ctx.createBiquadFilter();
    roarFilter.type = 'lowpass';
    roarFilter.frequency.setValueAtTime(260, ctx.currentTime);

    const roarGain = ctx.createGain();
    roarGain.gain.setValueAtTime(0.4, ctx.currentTime);

    roarSrc.connect(roarFilter);
    roarFilter.connect(roarGain);
    roarGain.connect(out);
    roarSrc.start();

    // Occasional wood crackles & sparks
    const crackleBus = ctx.createGain();
    crackleBus.gain.setValueAtTime(0.3, ctx.currentTime);
    crackleBus.connect(out);

    let isDisposed = false;
    const scheduleNextCrackle = () => {
      if (isDisposed) return;
      const delayMs = 60 + Math.random() * 220;
      this.birdTimer = setTimeout(() => {
        if (isDisposed) return;
        this.popCrackle(ctx, crackleBus);
        scheduleNextCrackle();
      }, delayMs);
    };

    scheduleNextCrackle();

    this.activeCleanups.push(() => {
      isDisposed = true;
      try { roarSrc.stop(); roarSrc.disconnect(); } catch {}
    });
  }

  // -------------------------------------------------------------
  // 6. 💧 Babbling Woodland Stream
  // -------------------------------------------------------------
  private buildStreamSynth(ctx: AudioContext, out: GainNode) {
    const flowSrc = ctx.createBufferSource();
    flowSrc.buffer = this.createPinkNoiseBuffer(ctx, 6);
    flowSrc.loop = true;

    const flowFilter = ctx.createBiquadFilter();
    flowFilter.type = 'bandpass';
    flowFilter.frequency.setValueAtTime(900, ctx.currentTime);
    flowFilter.Q.setValueAtTime(0.65, ctx.currentTime);

    const flowGain = ctx.createGain();
    flowGain.gain.setValueAtTime(0.2, ctx.currentTime);

    const flowLfo = ctx.createOscillator();
    flowLfo.frequency.setValueAtTime(0.14, ctx.currentTime);
    const flowLfoGain = ctx.createGain();
    flowLfoGain.gain.setValueAtTime(360, ctx.currentTime);
    flowLfo.connect(flowLfoGain);
    flowLfoGain.connect(flowFilter.frequency);

    flowSrc.connect(flowFilter);
    flowFilter.connect(flowGain);
    flowGain.connect(out);
    flowLfo.start();
    flowSrc.start();

    let isDisposed = false;
    const dropBuffer = this.createNoiseBuffer(ctx, 0.18);
    const scheduleNextDrop = () => {
      if (isDisposed) return;
      this.birdTimer = setTimeout(() => {
        if (isDisposed) return;
        try {
          const now = ctx.currentTime;
          const dropSrc = ctx.createBufferSource();
          dropSrc.buffer = dropBuffer;
          const dropFilter = ctx.createBiquadFilter();
          dropFilter.type = 'bandpass';
          dropFilter.frequency.setValueAtTime(1400 + Math.random() * 1600, now);
          dropFilter.Q.setValueAtTime(1.2, now);
          const dropGain = ctx.createGain();
          dropGain.gain.setValueAtTime(0.0001, now);
          dropGain.gain.linearRampToValueAtTime(0.035, now + 0.015);
          dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
          dropSrc.connect(dropFilter);
          dropFilter.connect(dropGain);
          dropGain.connect(out);
          dropSrc.onended = () => {
            try { dropSrc.disconnect(); } catch {}
            try { dropFilter.disconnect(); } catch {}
            try { dropGain.disconnect(); } catch {}
          };
          dropSrc.start(now);
          dropSrc.stop(now + 0.16);
        } catch {}
        scheduleNextDrop();
      }, 300 + Math.random() * 550);
    };
    scheduleNextDrop();

    this.activeCleanups.push(() => {
      isDisposed = true;
      try { flowSrc.stop(); flowSrc.disconnect(); } catch {}
      try { flowLfo.stop(); flowLfo.disconnect(); } catch {}
      try { flowLfoGain.disconnect(); } catch {}
      try { flowFilter.disconnect(); } catch {}
      try { flowGain.disconnect(); } catch {}
    });
  }

  // -------------------------------------------------------------
  // 7. 🍃 Gentle Mountain Breeze
  // -------------------------------------------------------------
  private buildMountainWindSynth(ctx: AudioContext, out: GainNode) {
    const windSrc = ctx.createBufferSource();
    windSrc.buffer = this.createPinkNoiseBuffer(ctx, 5);
    windSrc.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(520, ctx.currentTime);
    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.2, ctx.currentTime);

    const filterLfo = ctx.createOscillator();
    filterLfo.frequency.setValueAtTime(0.075, ctx.currentTime);
    const filterLfoGain = ctx.createGain();
    filterLfoGain.gain.setValueAtTime(260, ctx.currentTime);
    filterLfo.connect(filterLfoGain);
    filterLfoGain.connect(windFilter.frequency);

    const volumeLfo = ctx.createOscillator();
    volumeLfo.frequency.setValueAtTime(0.11, ctx.currentTime);
    const volumeLfoGain = ctx.createGain();
    volumeLfoGain.gain.setValueAtTime(0.055, ctx.currentTime);
    volumeLfo.connect(volumeLfoGain);
    volumeLfoGain.connect(windGain.gain);

    windSrc.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(out);
    filterLfo.start();
    volumeLfo.start();
    windSrc.start();

    this.activeCleanups.push(() => {
      try { windSrc.stop(); windSrc.disconnect(); } catch {}
      try { filterLfo.stop(); filterLfo.disconnect(); } catch {}
      try { volumeLfo.stop(); volumeLfo.disconnect(); } catch {}
      try { filterLfoGain.disconnect(); } catch {}
      try { volumeLfoGain.disconnect(); } catch {}
      try { windFilter.disconnect(); } catch {}
      try { windGain.disconnect(); } catch {}
    });
  }

  // -------------------------------------------------------------
  // 8. 🌙 Quiet Night Insects
  // -------------------------------------------------------------
  private buildNightInsectsSynth(ctx: AudioContext, out: GainNode) {
    const airSrc = ctx.createBufferSource();
    airSrc.buffer = this.createPinkNoiseBuffer(ctx, 5);
    airSrc.loop = true;
    const airFilter = ctx.createBiquadFilter();
    airFilter.type = 'lowpass';
    airFilter.frequency.setValueAtTime(700, ctx.currentTime);
    const airGain = ctx.createGain();
    airGain.gain.setValueAtTime(0.08, ctx.currentTime);
    airSrc.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(out);
    airSrc.start();

    let isDisposed = false;
    const scheduleNextChirp = () => {
      if (isDisposed) return;
      this.birdTimer = setTimeout(() => {
        if (isDisposed) return;
        this.chirpNightInsects(ctx, out);
        scheduleNextChirp();
      }, 1200 + Math.random() * 2600);
    };
    scheduleNextChirp();

    this.activeCleanups.push(() => {
      isDisposed = true;
      try { airSrc.stop(); airSrc.disconnect(); } catch {}
      try { airFilter.disconnect(); } catch {}
      try { airGain.disconnect(); } catch {}
    });
  }

  private chirpNightInsects(ctx: AudioContext, dest: GainNode) {
    try {
      const now = ctx.currentTime;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(4300 + Math.random() * 900, now);

      const pulses = 3;
      const pulseGap = 0.13 + Math.random() * 0.05;
      for (let pulse = 0; pulse < pulses; pulse++) {
        const start = now + pulse * pulseGap;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.11, start + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.085);
      }

      oscillator.connect(gain);
      gain.connect(dest);
      oscillator.onended = () => {
        try { oscillator.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
      };
      oscillator.start(now);
      oscillator.stop(now + pulses * pulseGap + 0.05);
    } catch {}
  }

  private popCrackle(ctx: AudioContext, dest: GainNode) {
    try {
      const now = ctx.currentTime;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 80);
      }

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600 + Math.random() * 2400, now);
      filter.Q.setValueAtTime(4.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15 + Math.random() * 0.25, now);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(dest);

      src.start(now);
    } catch {}
  }

  // -------------------------------------------------------------
  // Noise Buffer Helpers
  // -------------------------------------------------------------
  private createNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(1, len, rate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buf;
  }

  private createPinkNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(1, len, rate);
    const data = buf.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    // Fade edges for clickless looping
    const fadeLen = Math.floor(rate * 0.2);
    for (let i = 0; i < fadeLen; i++) {
      const alpha = i / fadeLen;
      data[i] = data[i] * alpha + data[len - fadeLen + i] * (1 - alpha);
    }

    return buf;
  }
}

// Global Singleton
export const moodSoundEngine = new MoodSoundEngine();
