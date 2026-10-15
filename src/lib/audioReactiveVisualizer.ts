import * as THREE from 'three';
import { getAmbientAnalyserNode } from './audio';

export type VisualizerMode = 'cosmic-galaxy' | 'sacred-prism' | 'nebula-vortex';

export interface VisualizerColorTheme {
  category: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  threeColors: {
    primary: THREE.Color;
    secondary: THREE.Color;
    accent: THREE.Color;
    glow: THREE.Color;
  };
}

export const VISUALIZER_THEMES: Record<string, VisualizerColorTheme> = {
  '사주·오행': {
    category: '사주·오행',
    name: '오행 음양오행 에너지 (Wood · Fire · Earth · Metal · Water)',
    primary: '#10b981',
    secondary: '#f59e0b',
    accent: '#ef4444',
    glow: '#06b6d4',
    threeColors: {
      primary: new THREE.Color(0x10b981),
      secondary: new THREE.Color(0xf59e0b),
      accent: new THREE.Color(0xef4444),
      glow: new THREE.Color(0x06b6d4),
    },
  },
  '오라클 타로': {
    category: '오라클 타로',
    name: '아스트랄 스타라이트 (Cosmic Violet & Gold)',
    primary: '#8b5cf6',
    secondary: '#fbbf24',
    accent: '#ec4899',
    glow: '#6366f1',
    threeColors: {
      primary: new THREE.Color(0x8b5cf6),
      secondary: new THREE.Color(0xfbbf24),
      accent: new THREE.Color(0xec4899),
      glow: new THREE.Color(0x6366f1),
    },
  },
  '솔페지오': {
    category: '솔페지오',
    name: '치유의 솔페지오 주파수 (Teal · Quartz · Celestial)',
    primary: '#14b8a6',
    secondary: '#38bdf8',
    accent: '#f472b6',
    glow: '#a78bfa',
    threeColors: {
      primary: new THREE.Color(0x14b8a6),
      secondary: new THREE.Color(0x38bdf8),
      accent: new THREE.Color(0xf472b6),
      glow: new THREE.Color(0xa78bfa),
    },
  },
  '세도나 방하착': {
    category: '세도나 방하착',
    name: '세도나 볼텍스 석양 (Sedona Red Rock & Sunset Amber)',
    primary: '#f97316',
    secondary: '#fbbf24',
    accent: '#e11d48',
    glow: '#d97706',
    threeColors: {
      primary: new THREE.Color(0xf97316),
      secondary: new THREE.Color(0xfbbf24),
      accent: new THREE.Color(0xe11d48),
      glow: new THREE.Color(0xd97706),
    },
  },
  '호오포노포노': {
    category: '호오포노포노',
    name: '태평양 블루버드 평화 (Pacific Cyan & Pearl White)',
    primary: '#0ea5e9',
    secondary: '#38bdf8',
    accent: '#e0f2fe',
    glow: '#60a5fa',
    threeColors: {
      primary: new THREE.Color(0x0ea5e9),
      secondary: new THREE.Color(0x38bdf8),
      accent: new THREE.Color(0xe0f2fe),
      glow: new THREE.Color(0x60a5fa),
    },
  },
  '양자·뮤즈': {
    category: '양자·뮤즈',
    name: '양자 영감 & 프리즘 홀로그램 (Quantum Neon & Magenta)',
    primary: '#06b6d4',
    secondary: '#d946ef',
    accent: '#a855f7',
    glow: '#3b82f6',
    threeColors: {
      primary: new THREE.Color(0x06b6d4),
      secondary: new THREE.Color(0xd946ef),
      accent: new THREE.Color(0xa855f7),
      glow: new THREE.Color(0x3b82f6),
    },
  },
  default: {
    category: 'default',
    name: 'PRISM 하모닉 스펙트럼',
    primary: '#fbbf24',
    secondary: '#a855f7',
    accent: '#06b6d4',
    glow: '#ec4899',
    threeColors: {
      primary: new THREE.Color(0xfbbf24),
      secondary: new THREE.Color(0xa855f7),
      accent: new THREE.Color(0x06b6d4),
      glow: new THREE.Color(0xec4899),
    },
  },
};

export function getVisualizerThemeForCategory(category?: string): VisualizerColorTheme {
  if (!category) return VISUALIZER_THEMES.default;
  return VISUALIZER_THEMES[category] || VISUALIZER_THEMES.default;
}

export interface AudioFrameMetrics {
  bass: number;        // 0.0 ~ 1.0 (sub-bass / kick / drone resonance)
  mid: number;         // 0.0 ~ 1.0 (harmonic melodies / bell resonance)
  treble: number;      // 0.0 ~ 1.0 (sparkle / shakers / wind noise)
  energy: number;      // 0.0 ~ 1.0 (overall weighted energy)
  isBeat: boolean;     // sudden onset beat pulse
  beatIntensity: number; // 0.0 ~ 1.0
  frequencyData: Uint8Array;
  timeDomainData: Uint8Array;
}

class AudioFrequencyAnalyzer {
  private freqArray: Uint8Array;
  private timeArray: Uint8Array;
  private smoothedBass = 0;
  private smoothedMid = 0;
  private smoothedTreble = 0;
  private smoothedEnergy = 0;
  private energyHistory: number[] = [];
  private lastBeatTime = 0;

  constructor() {
    this.freqArray = new Uint8Array(128);
    this.timeArray = new Uint8Array(128);
  }

  public sample(isPlaying: boolean): AudioFrameMetrics {
    const analyser = getAmbientAnalyserNode();

    if (!analyser || !isPlaying) {
      // Graceful decay towards resting ambient motion
      this.smoothedBass = Math.max(0, this.smoothedBass * 0.92);
      this.smoothedMid = Math.max(0, this.smoothedMid * 0.92);
      this.smoothedTreble = Math.max(0, this.smoothedTreble * 0.92);
      this.smoothedEnergy = Math.max(0, this.smoothedEnergy * 0.92);

      return {
        bass: this.smoothedBass,
        mid: this.smoothedMid,
        treble: this.smoothedTreble,
        energy: this.smoothedEnergy,
        isBeat: false,
        beatIntensity: 0,
        frequencyData: this.freqArray,
        timeDomainData: this.timeArray,
      };
    }

    try {
      analyser.getByteFrequencyData(this.freqArray);
      analyser.getByteTimeDomainData(this.timeArray);
    } catch {
      // Fallback
    }

    // 1. Bass analysis (bins 1 to 8: ~20Hz to 350Hz)
    let rawBass = 0;
    const bassBins = Math.min(8, this.freqArray.length);
    for (let i = 1; i <= bassBins; i++) {
      rawBass += this.freqArray[i];
    }
    rawBass = rawBass / (bassBins * 255);

    // 2. Mid analysis (bins 9 to 36: ~350Hz to 2500Hz)
    let rawMid = 0;
    const midBins = Math.min(36, this.freqArray.length);
    for (let i = 9; i <= midBins; i++) {
      rawMid += this.freqArray[i];
    }
    rawMid = rawMid / ((midBins - 8) * 255);

    // 3. Treble analysis (bins 37 to 80: ~2500Hz to 12kHz)
    let rawTreble = 0;
    const trebleBins = Math.min(80, this.freqArray.length);
    for (let i = 37; i <= trebleBins; i++) {
      rawTreble += this.freqArray[i];
    }
    rawTreble = rawTreble / ((trebleBins - 36) * 255);

    // 4. Energy calculation with psychoacoustic weighting (bass has high perceptual impact)
    const rawEnergy = rawBass * 0.55 + rawMid * 0.3 + rawTreble * 0.15;

    // Temporal smoothing for buttery smooth visual transitions
    this.smoothedBass += (rawBass - this.smoothedBass) * 0.25;
    this.smoothedMid += (rawMid - this.smoothedMid) * 0.22;
    this.smoothedTreble += (rawTreble - this.smoothedTreble) * 0.28;
    this.smoothedEnergy += (rawEnergy - this.smoothedEnergy) * 0.24;

    // Transient / Beat detection
    const now = performance.now();
    this.energyHistory.push(rawEnergy);
    if (this.energyHistory.length > 30) this.energyHistory.shift();

    const avgEnergy = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
    const energyVariance = this.energyHistory.reduce((a, b) => a + Math.pow(b - avgEnergy, 2), 0) / this.energyHistory.length;
    const beatThreshold = avgEnergy + Math.max(0.04, Math.sqrt(energyVariance) * 1.3);

    let isBeat = false;
    let beatIntensity = 0;

    if (rawEnergy > beatThreshold && rawEnergy > 0.12 && now - this.lastBeatTime > 220) {
      isBeat = true;
      this.lastBeatTime = now;
      beatIntensity = Math.min(1.0, (rawEnergy - avgEnergy) * 3.5);
    }

    return {
      bass: this.smoothedBass,
      mid: this.smoothedMid,
      treble: this.smoothedTreble,
      energy: this.smoothedEnergy,
      isBeat,
      beatIntensity,
      frequencyData: this.freqArray,
      timeDomainData: this.timeArray,
    };
  }
}

export const globalAudioAnalyzer = new AudioFrequencyAnalyzer();

/**
 * Creates a soft radial glow particle sprite texture for high performance WebGL blending.
 */
export function createGlowParticleTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
    gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
