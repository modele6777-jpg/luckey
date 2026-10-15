import { getSharedAudioContext, getMasterAudioBus } from './audio';

export interface BinauralPreset {
  appId: string;
  name: string;
  subtitle: string;
  carrierFreq: number; // Hz (Carrier tone)
  beatFreq: number;    // Hz (Binaural brainwave difference)
  waveType: 'Delta' | 'Theta' | 'Alpha' | 'Beta' | 'Gamma';
  accentColor: string;
  description: string;
}

export const BINAURAL_PRESETS: Record<string, BinauralPreset> = {
  bluebird: {
    appId: 'bluebird',
    name: '파랑새 딥 세레니티 (432Hz + 5.5Hz Theta)',
    subtitle: 'Soul Sanctuary Deep Calm',
    carrierFreq: 432,
    beatFreq: 5.5,
    waveType: 'Theta',
    accentColor: '#38bdf8',
    description: '432Hz 자연 치유 주파수와 5.5Hz 딥 세타파로 불안을 잠재우고 내면의 깊은 평온을 선사합니다.',
  },
  heal: {
    appId: 'heal',
    name: '오라 솔페지오 리커버리 (528Hz + 4.5Hz Theta)',
    subtitle: 'Aura Cellular Cleansing',
    carrierFreq: 528,
    beatFreq: 4.5,
    waveType: 'Theta',
    accentColor: '#34d399',
    description: '528Hz 기적과 변형의 솔페지오 주파수와 4.5Hz 세타파로 세포 정화와 심신 재생을 유도합니다.',
  },
  aura: {
    appId: 'aura',
    name: '오라 솔페지오 리커버리 (528Hz + 4.5Hz Theta)',
    subtitle: 'Aura Cellular Cleansing',
    carrierFreq: 528,
    beatFreq: 4.5,
    waveType: 'Theta',
    accentColor: '#34d399',
    description: '528Hz 기적과 변형의 솔페지오 주파수와 4.5Hz 세타파로 세포 정화와 심신 재생을 유도합니다.',
  },
  orange: {
    appId: 'orange',
    name: '오렌지 슈만 공명 알파파 (639Hz + 7.83Hz Schumann)',
    subtitle: 'Idea Sanctuary Manifestation',
    carrierFreq: 639,
    beatFreq: 7.83,
    waveType: 'Alpha',
    accentColor: '#fb923c',
    description: '639Hz 화합과 끌어당김 주파수 및 지구 심장 박동인 7.83Hz 슈만 공명으로 잠재의식을 정렬합니다.',
  },
  trinity: {
    appId: 'trinity',
    name: '트리니티 직관 서드아이 (852Hz + 8.0Hz Alpha)',
    subtitle: 'Cosmic Vision Higher Intuition',
    carrierFreq: 852,
    beatFreq: 8.0,
    waveType: 'Alpha',
    accentColor: '#facc15',
    description: '852Hz 제3의 눈 각성 솔페지오 톤과 8.0Hz 알파파로 초월적 직관과 영적 통찰을 맑게 엽니다.',
  },
  muse: {
    appId: 'muse',
    name: '뮤즈 크리에이티브 플로우 (741Hz + 10.0Hz Alpha)',
    subtitle: 'Creative Canvas Flow State',
    carrierFreq: 741,
    beatFreq: 10.0,
    waveType: 'Alpha',
    accentColor: '#818cf8',
    description: '741Hz 직관적 표현 주파수와 10.0Hz 집중 알파파로 창작의 막힘을 허물고 몰입의 강으로 이끕니다.',
  },
  epilogue: {
    appId: 'epilogue',
    name: '에필로그 유니버스 하모니 (432Hz + 7.0Hz Theta)',
    subtitle: 'Cosmic Integration & Wholeness',
    carrierFreq: 432,
    beatFreq: 7.0,
    waveType: 'Theta',
    accentColor: '#c084fc',
    description: '432Hz 코스믹 화음과 7.0Hz 세타파로 5가지 프리즘 여정을 통합하고 온전한 평형을 이룹니다.',
  },
  hub: {
    appId: 'hub',
    name: '프롤로그 프리즘 하모닉스 (432Hz + 7.83Hz Alpha)',
    subtitle: 'Prism Omniscient Portal',
    carrierFreq: 432,
    beatFreq: 7.83,
    waveType: 'Alpha',
    accentColor: '#ec4899',
    description: '432Hz 우주적 진동과 7.83Hz 슈만 공명으로 맑은 시작과 의식 확장을 돕습니다.',
  },
};

export interface BinauralState {
  isPlaying: boolean;
  activeAppId: string | null;
  activePreset: BinauralPreset | null;
}

let activeAppId: string | null = null;
let masterBinauralGain: GainNode | null = null;
let leftOsc: OscillatorNode | null = null;
let rightOsc: OscillatorNode | null = null;
let subOsc: OscillatorNode | null = null;
let filterNode: BiquadFilterNode | null = null;

const listeners = new Set<(state: BinauralState) => void>();

function notifyListeners() {
  const isPlaying = !!(activeAppId && masterBinauralGain);
  const activePreset = activeAppId ? BINAURAL_PRESETS[activeAppId] || null : null;
  const state: BinauralState = {
    isPlaying,
    activeAppId,
    activePreset,
  };
  listeners.forEach((fn) => fn(state));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('prism-binaural-changed', { detail: state }));
  }
}

export function subscribeBinauralState(listener: (state: BinauralState) => void): () => void {
  listeners.add(listener);
  const isPlaying = !!(activeAppId && masterBinauralGain);
  const activePreset = activeAppId ? BINAURAL_PRESETS[activeAppId] || null : null;
  listener({ isPlaying, activeAppId, activePreset });
  return () => {
    listeners.delete(listener);
  };
}

export function getBinauralState(): BinauralState {
  const isPlaying = !!(activeAppId && masterBinauralGain);
  const activePreset = activeAppId ? BINAURAL_PRESETS[activeAppId] || null : null;
  return { isPlaying, activeAppId, activePreset };
}

/**
 * Normalizes app ID aliases (e.g. 'aura' -> 'heal')
 */
export function normalizeBinauralAppId(appId: string): string {
  const lower = appId.toLowerCase().trim();
  if (lower === 'aura') return 'heal';
  if (lower === 'home' || lower === 'prologue') return 'hub';
  return lower;
}

/**
 * Stop active binaural beat with smooth fade-out.
 */
export function stopBinauralBeat(fadeSec = 0.6): void {
  if (!masterBinauralGain) {
    activeAppId = null;
    notifyListeners();
    return;
  }

  try {
    const ctx = getSharedAudioContext();
    const now = ctx.currentTime;
    const g = masterBinauralGain;
    const lO = leftOsc;
    const rO = rightOsc;
    const sO = subOsc;

    g.gain.cancelScheduledValues(now);
    g.gain.setValueAtTime(g.gain.value, now);
    g.gain.linearRampToValueAtTime(0.0001, now + fadeSec);

    setTimeout(() => {
      try {
        lO?.stop();
        rO?.stop();
        sO?.stop();
        lO?.disconnect();
        rO?.disconnect();
        sO?.disconnect();
        g.disconnect();
      } catch (_) {}
    }, (fadeSec + 0.1) * 1000);
  } catch (e) {
    console.warn('[Binaural] Error while stopping:', e);
  }

  masterBinauralGain = null;
  leftOsc = null;
  rightOsc = null;
  subOsc = null;
  filterNode = null;
  activeAppId = null;
  notifyListeners();
}

/**
 * Start or switch binaural beat for a specific PRISM app.
 */
export function startBinauralBeat(rawAppId: string, volume = 0.028): BinauralPreset {
  const appId = normalizeBinauralAppId(rawAppId);
  const preset = BINAURAL_PRESETS[appId] || BINAURAL_PRESETS.bluebird;

  // Stop any currently running oscillators first
  if (masterBinauralGain) {
    stopBinauralBeat(0.3);
  }

  try {
    const ctx = getSharedAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Master bus & limiter routing (blends seamlessly with BGM)
    const masterBus = getMasterAudioBus();

    // Master Gain for smooth crossfade
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0.0001, now);
    mainGain.gain.linearRampToValueAtTime(volume, now + 1.2);

    // Warm Low-pass Filter to create a velvety, non-fatiguing ambient texture
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(1800, preset.carrierFreq * 2.8), now);
    filter.Q.setValueAtTime(0.7, now);

    // Stereo Panning for Binaural Effect
    // Left Channel: Base Carrier Tone
    const leftGain = ctx.createGain();
    leftGain.gain.setValueAtTime(0.7, now);
    const lPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (lPanner) {
      lPanner.pan.setValueAtTime(-0.95, now);
    }

    const lOsc = ctx.createOscillator();
    lOsc.type = 'sine';
    lOsc.frequency.setValueAtTime(preset.carrierFreq, now);

    lOsc.connect(leftGain);
    if (lPanner) {
      leftGain.connect(lPanner);
      lPanner.connect(filter);
    } else {
      leftGain.connect(filter);
    }

    // Right Channel: Carrier Tone + Brainwave Delta
    const rightGain = ctx.createGain();
    rightGain.gain.setValueAtTime(0.7, now);
    const rPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (rPanner) {
      rPanner.pan.setValueAtTime(0.95, now);
    }

    const rOsc = ctx.createOscillator();
    rOsc.type = 'sine';
    rOsc.frequency.setValueAtTime(preset.carrierFreq + preset.beatFreq, now);

    rOsc.connect(rightGain);
    if (rPanner) {
      rightGain.connect(rPanner);
      rPanner.connect(filter);
    } else {
      rightGain.connect(filter);
    }

    // Sub-harmonic warm grounding foundation (centered, subtle octave down)
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.25, now);

    const sOsc = ctx.createOscillator();
    sOsc.type = 'sine';
    const subFreq = preset.carrierFreq > 500 ? preset.carrierFreq / 4 : preset.carrierFreq / 2;
    sOsc.frequency.setValueAtTime(subFreq, now);

    sOsc.connect(subGain);
    subGain.connect(filter);

    // Connect filter through main gain and then to master audio bus
    filter.connect(mainGain);
    mainGain.connect(masterBus);

    // Start oscillators
    lOsc.start(now);
    rOsc.start(now);
    sOsc.start(now);

    masterBinauralGain = mainGain;
    leftOsc = lOsc;
    rightOsc = rOsc;
    subOsc = sOsc;
    filterNode = filter;
    activeAppId = appId;

    notifyListeners();
    return preset;
  } catch (err) {
    console.error('[Binaural] Failed to start binaural beat:', err);
    notifyListeners();
    return preset;
  }
}

/**
 * Toggle binaural beat on/off for a specific PRISM app.
 * If currently playing for THIS app, turns it OFF.
 * If stopped or playing for another app, switches to THIS app's binaural beat.
 */
export function toggleBinauralBeat(rawAppId: string): boolean {
  const appId = normalizeBinauralAppId(rawAppId);
  if (activeAppId === appId && masterBinauralGain) {
    stopBinauralBeat();
    return false;
  } else {
    startBinauralBeat(appId);
    return true;
  }
}

export function isBinauralBeatPlaying(rawAppId?: string): boolean {
  if (!masterBinauralGain || !activeAppId) return false;
  if (!rawAppId) return true;
  return activeAppId === normalizeBinauralAppId(rawAppId);
}
