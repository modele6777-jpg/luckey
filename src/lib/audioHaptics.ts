/**
 * Audio Haptic Feedback Engine
 * Procedural Web Audio synthesis providing subtle, high-grade tactile acoustic feedback
 * categorized into distinct interaction profiles:
 * - Success: Sharp, decisive tactile pulses & radiant affirmation chimes
 * - Breathing & Meditation: Soft, undulating rhythmic vibrations & bio-harmonic frequencies (432Hz / 528Hz / singing bowl)
 * - Card: Real tactile linen card sliding friction glides, flips & deck flutters
 * - Selection: Crisp mechanical micro-switch ticks
 * - Alert: Muted wooden dull thuds & gentle warning notifications
 *
 * Synchronized with mobile hardware tactile vibration (Vibration API).
 */

import { getSharedAudioContext, getMasterAudioBus } from './audio';

export type HapticCategory =
  | 'success'      // Sharp pulse confirmation & triumphant achievements
  | 'breathing'    // Soft, rhythmic undulating waves for respiratory pacing
  | 'meditation'   // Serene harmonic bells, singing bowls & gentle heartbeat cycles
  | 'card'         // Linen card glide, snap, shuffle, and carousel hover
  | 'selection'    // Modern tactile micro-switch ticks
  | 'alert'        // Muted wooden dull thuds & soft warnings
;

export type AudioHapticType =
  // --- Success category (sharp pulses & luminous affirmation) ---
  | 'success'            // Generic sharp pulse confirmation (e.g. action success, step finished)
  | 'save_success'       // Saved confirmation with radiant double-chime + sharp double pulse
  | 'save_auto'          // Discrete water droplet bell ping for auto-saves
  | 'milestone_success'  // Triumphant multi-stage sharp ripple pulse & golden chord flourish
  | 'ai_result_chime'    // 은은하고 맑은 약한 종소리 (AI 결과물 생성 완료 알림, 대화 제외)

  // --- Breathing category (soft, rhythmic vibration & respiratory bio-harmonics) ---
  | 'breathe_inhale'     // Gentle swelling rhythmic wave [25, 75, 40, 75, 55] + 432Hz breath expansion
  | 'breathe_hold'       // Ultra-soft anchor micro-pulse [12] + serene 528Hz crystal still tone
  | 'breathe_exhale'     // Gentle soothing descending release wave [50, 80, 35, 90, 20] + warm relaxing decay

  // --- Meditation category (soft rhythmic pulsing & sacred singing bowl) ---
  | 'meditation_cycle'   // Soft rhythmic double heartbeat pulse [16, 140, 16] + 136.1Hz Om fundamental
  | 'meditation_bell'    // Resonant Tibetan singing bowl chime [22, 45, 30] + rich 528Hz Solfeggio harmonics

  // --- Card category (tactile linen card friction & snaps) ---
  | 'card_draw'          // Drawing a tarot or oracle card (paper friction sweep + warm body + celestial shimmer)
  | 'card_snap'          // Snapping card into slot or flipping (crisp tactile micro-click)
  | 'card_shuffle'       // Rapid deck flutter / riffle when shuffling or spinning
  | 'card_hover'         // Micro-tick when skimming across card wheels or carousels

  // --- Selection & Tap category ---
  | 'tap_light'          // Modern tactile micro-switch tick (modals, tags, pills)
  | 'tap_impact'         // Punchy impact for energy-infused actions (toss, talisman blessing)

  // --- Alert & Discard category ---
  | 'delete_discard'     // Muted wooden dull tap for removal / clearing
  | 'alert_warning'      // Soft cautionary double-thud [35, 40, 35]
;

export interface AudioHapticOptions {
  volume?: number;         // Relative gain multiplier (0.0 to 1.5, default 1.0)
  skipVibration?: boolean; // If true, only play acoustic audio without device vibration
  skipAudio?: boolean;     // If true, only trigger device vibration without acoustic sound
}

export interface HapticPatternMeta {
  vibration: number | number[];
  category: HapticCategory;
  label: string;
  description: string;
}

export const HAPTIC_PATTERNS: Record<AudioHapticType, HapticPatternMeta> = {
  // Success (Sharp Pulse)
  success: {
    vibration: [14, 8, 25],
    category: 'success',
    label: '성공 샤프 펄스',
    description: '선명하고 또렷한 2단계 샤프 펄스 진동 및 확정 화음',
  },
  save_success: {
    vibration: [16, 10, 28],
    category: 'success',
    label: '저장 완료',
    description: 'A5->E6 영롱한 크리스탈 이중 화음 챠임과 샤프 햅틱 펄스',
  },
  save_auto: {
    vibration: 8,
    category: 'success',
    label: '자동 저장',
    description: 'C6 맑은 물방울 단일 핑과 초미세 틱 진동',
  },
  milestone_success: {
    vibration: [15, 8, 20, 8, 35],
    category: 'success',
    label: '마일스톤 달성',
    description: '3단 캐스케이드 샤프 펄스와 풍성한 축복 아르페지오',
  },
  ai_result_chime: {
    vibration: [10, 25],
    category: 'success',
    label: 'AI 결과 생성 완료 종소리',
    description: '은은하고 맑은 약한 크리스탈 종소리와 미세 햅틱 진동',
  },

  // Breathing (Soft Rhythmic)
  breathe_inhale: {
    vibration: [25, 75, 40, 75, 55],
    category: 'breathing',
    label: '들숨 (Inhale)',
    description: '폐와 가슴의 확장을 모사하는 3단계 부드러운 리드미컬 팽창 진동과 432Hz 숨결 음향',
  },
  breathe_hold: {
    vibration: 12,
    category: 'breathing',
    label: '숨 참음 (Hold)',
    description: '고요한 현존을 돕는 극미세 중심 앵커 진동과 528Hz 하모닉스',
  },
  breathe_exhale: {
    vibration: [50, 80, 35, 90, 20],
    category: 'breathing',
    label: '날숨 (Exhale)',
    description: '긴장을 온전히 내려놓는 3단계 완만 하강 릴리즈 진동과 온화한 감쇠음',
  },

  // Meditation
  meditation_cycle: {
    vibration: [16, 140, 16],
    category: 'meditation',
    label: '명상 리듬 (Heartbeat)',
    description: '심장 박동을 닮은 포근한 이중 펄스 진동과 136.1Hz 옴(Om) 기저음',
  },
  meditation_bell: {
    vibration: [22, 45, 30],
    category: 'meditation',
    label: '싱잉볼 명상종',
    description: '풍부한 여운의 티베트 싱잉볼 공명과 깊은 안정감의 바디 진동',
  },

  // Card
  card_draw: {
    vibration: [14, 18, 12],
    category: 'card',
    label: '카드 드로우',
    description: '린넨 카드를 덱에서 부드럽게 뽑아 올리는 마찰음과 따뜻한 바디톤',
  },
  card_snap: {
    vibration: 12,
    category: 'card',
    label: '카드 스냅',
    description: '카드가 슬롯에 착 감기며 고정되는 경쾌한 마이크로 스냅',
  },
  card_shuffle: {
    vibration: [8, 14, 10, 18, 12],
    category: 'card',
    label: '카드 셔플',
    description: '카드 덱을 리드미컬하게 섞는 4중 연속 플러터 음향',
  },
  card_hover: {
    vibration: 6,
    category: 'card',
    label: '카드 호버',
    description: '디지털 크라운처럼 카드 휠을 스크러빙할 때 울리는 초미세 틱',
  },

  // Selection
  tap_light: {
    vibration: 10,
    category: 'selection',
    label: '라이트 탭',
    description: '현대적인 기계식 마이크로 스위치 클릭감',
  },
  tap_impact: {
    vibration: [25, 20, 25],
    category: 'selection',
    label: '임팩트 탭',
    description: '스마트 토스 및 부적 결속 등 에너지를 불어넣는 묵직한 킥',
  },

  // Alert
  delete_discard: {
    vibration: [25, 30],
    category: 'alert',
    label: '삭제 및 비움',
    description: '부드러운 우든 탭과 정갈한 소멸 텍스처',
  },
  alert_warning: {
    vibration: [35, 40, 35],
    category: 'alert',
    label: '경고 알림',
    description: '주의를 환기시키는 저주파 더블 텀프 진동',
  },
};

export const HAPTIC_CATEGORIES: Record<HapticCategory, { label: string; description: string }> = {
  success: {
    label: '성공 & 완료 (Sharp Pulse)',
    description: '선명하고 명확한 샤프 펄스 햅틱과 영롱한 크리스탈 확정 화음',
  },
  breathing: {
    label: '호흡 수련 (Soft Rhythmic)',
    description: '들숨과 날숨의 리듬에 맞춘 포근하고 부드러운 다단계 팽창·이완 진동',
  },
  meditation: {
    label: '명상 & 심신 이완 (Bio-Harmonics)',
    description: '싱잉볼 종소리와 심장 박동 모티브의 잔잔한 주기적 펄스',
  },
  card: {
    label: '카드 인터랙션 (Tactile Card)',
    description: '실물 타로·오라클 카드의 종이 마찰 글라이드와 덱 셔플 질감',
  },
  selection: {
    label: '선택 및 스위치 (Micro Switch)',
    description: '깔끔하고 즉각적인 마이크로 클릭 감각',
  },
  alert: {
    label: '알림 및 삭제 (Acoustic Alert)',
    description: '비움과 경고 상황을 전달하는 온화한 저음 피드백',
  },
};

const STORAGE_KEY_ENABLED = 'prism_audio_haptics_enabled';
const STORAGE_KEY_VOLUME = 'prism_audio_haptics_volume';

let hapticSubBus: GainNode | null = null;
let cachedNoiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedNoiseBuffer && cachedNoiseBuffer.sampleRate === ctx.sampleRate) {
    return cachedNoiseBuffer;
  }
  const sampleRate = ctx.sampleRate;
  const duration = 0.35;
  const bufferSize = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.22;
  }

  cachedNoiseBuffer = buffer;
  return buffer;
}

function getHapticBus(ctx: AudioContext): GainNode {
  if (hapticSubBus && hapticSubBus.context === ctx) {
    return hapticSubBus;
  }
  const masterBus = getMasterAudioBus();
  hapticSubBus = ctx.createGain();
  const savedVol = getAudioHapticsVolume();
  hapticSubBus.gain.setValueAtTime(savedVol, ctx.currentTime);
  hapticSubBus.connect(masterBus);
  return hapticSubBus;
}

export function isAudioHapticsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(STORAGE_KEY_ENABLED);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function setAudioHapticsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ENABLED, enabled ? 'true' : 'false');
    window.dispatchEvent(
      new CustomEvent('prism:audio_haptics_changed', {
        detail: { enabled, volume: getAudioHapticsVolume() },
      })
    );
  } catch (e) {
    console.warn('[AudioHaptics] Failed to persist enabled state:', e);
  }
}

export function getAudioHapticsVolume(): number {
  if (typeof window === 'undefined') return 0.65;
  try {
    const val = localStorage.getItem(STORAGE_KEY_VOLUME);
    if (val === null) return 0.65;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0.65 : Math.max(0, Math.min(1, parsed));
  } catch {
    return 0.65;
  }
}

export function setAudioHapticsVolume(volume: number): void {
  if (typeof window === 'undefined') return;
  const clamped = Math.max(0, Math.min(1, volume));
  try {
    localStorage.setItem(STORAGE_KEY_VOLUME, clamped.toFixed(2));
    if (hapticSubBus) {
      const ctx = hapticSubBus.context as AudioContext;
      hapticSubBus.gain.setValueAtTime(clamped, ctx.currentTime);
    }
    window.dispatchEvent(
      new CustomEvent('prism:audio_haptics_changed', {
        detail: { enabled: isAudioHapticsEnabled(), volume: clamped },
      })
    );
  } catch (e) {
    console.warn('[AudioHaptics] Failed to persist volume:', e);
  }
}

export function getHapticCategory(type: AudioHapticType): HapticCategory {
  return HAPTIC_PATTERNS[type]?.category || 'selection';
}

function triggerVibrationForType(type: AudioHapticType): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !('vibrate' in navigator)) {
    return;
  }
  try {
    const pattern = HAPTIC_PATTERNS[type]?.vibration;
    if (pattern !== undefined) {
      navigator.vibrate?.(pattern as any);
    }
  } catch (_) {
    // Ignore restricted vibrations
  }
}

/**
 * Primary API: Synthesizes and plays high-quality audio haptic feedback immediately.
 * Dispatches both synthesized Web Audio and category-matched tactile vibration.
 */
export function playAudioHaptic(type: AudioHapticType, options?: AudioHapticOptions): void {
  if (typeof window === 'undefined') return;

  const enabled = isAudioHapticsEnabled();
  if (!enabled) return;

  // 1. Trigger hardware vibration pattern if not skipped
  if (!options?.skipVibration) {
    triggerVibrationForType(type);
  }

  // 2. Synthesize acoustic feedback if not skipped
  if (options?.skipAudio) return;

  try {
    const ctx = getSharedAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const bus = getHapticBus(ctx);
    const now = ctx.currentTime;
    const volScale = (options?.volume ?? 1.0);

    switch (type) {
      // ==========================================
      // 1. SUCCESS CATEGORY (Sharp Pulses & Chimes)
      // ==========================================
      case 'success': {
        // Sharp, instantaneous tactile pulse sound: fast transient click + pure ascending confirmation tone
        const noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3200, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.15 * volScale, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(bus);

        noise.start(now);
        noise.stop(now + 0.02);

        // Sharp confirmation tone (1046.5Hz C6 -> 1318.5Hz E6)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, now);
        osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.035);

        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.linearRampToValueAtTime(0.18 * volScale, now + 0.006);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

        osc.connect(oscGain);
        oscGain.connect(bus);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }

      case 'save_success': {
        // Radiant affirmation double chime chord (A5 880Hz -> E6 1318.5Hz with overtones)
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(220, now);
        subGain.gain.setValueAtTime(0.0001, now);
        subGain.gain.linearRampToValueAtTime(0.08 * volScale, now + 0.015);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        subOsc.connect(subGain);
        subGain.connect(bus);
        subOsc.start(now);
        subOsc.stop(now + 0.24);

        // Sharp attack spark
        const noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3400, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.10 * volScale, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(bus);
        noise.start(now);
        noise.stop(now + 0.018);

        // Note 1: A5 (880 Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);
        gain1.gain.setValueAtTime(0.0001, now);
        gain1.gain.linearRampToValueAtTime(0.18 * volScale, now + 0.008);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
        osc1.connect(gain1);
        gain1.connect(bus);
        osc1.start(now);
        osc1.stop(now + 0.45);

        // Harmonic overtone 1760 Hz
        const overtone1 = ctx.createOscillator();
        const overGain1 = ctx.createGain();
        overtone1.type = 'sine';
        overtone1.frequency.setValueAtTime(1760, now);
        overGain1.gain.setValueAtTime(0.0001, now);
        overGain1.gain.linearRampToValueAtTime(0.045 * volScale, now + 0.008);
        overGain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        overtone1.connect(overGain1);
        overGain1.connect(bus);
        overtone1.start(now);
        overtone1.stop(now + 0.3);

        // Note 2: E6 (1318.5 Hz) - offset by 75ms
        const t2 = now + 0.075;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.51, t2);
        gain2.gain.setValueAtTime(0.0001, t2);
        gain2.gain.linearRampToValueAtTime(0.22 * volScale, t2 + 0.008);
        gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.55);
        osc2.connect(gain2);
        gain2.connect(bus);
        osc2.start(t2);
        osc2.stop(t2 + 0.58);

        // Harmonic overtone 2637 Hz
        const overtone2 = ctx.createOscillator();
        const overGain2 = ctx.createGain();
        overtone2.type = 'sine';
        overtone2.frequency.setValueAtTime(2637, t2);
        overGain2.gain.setValueAtTime(0.0001, t2);
        overGain2.gain.linearRampToValueAtTime(0.05 * volScale, t2 + 0.008);
        overGain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.38);
        overtone2.connect(overGain2);
        overGain2.connect(bus);
        overtone2.start(t2);
        overtone2.stop(t2 + 0.4);
        break;
      }

      case 'save_auto': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.1);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.045 * volScale, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.connect(gain);
        gain.connect(bus);
        osc.start(now);
        osc.stop(now + 0.13);
        break;
      }

      case 'milestone_success': {
        // Triumphant 3-chord cascade (F#5 -> A5 -> D6)
        const notes = [739.99, 880.0, 1174.66];
        notes.forEach((freq, idx) => {
          const t = now + idx * 0.065;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.linearRampToValueAtTime((0.14 + idx * 0.03) * volScale, t + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

          osc.connect(gain);
          gain.connect(bus);
          osc.start(t);
          osc.stop(t + 0.48);
        });
        break;
      }

      case 'ai_result_chime': {
        // 은은하고 맑은 약한 종소리 (659Hz E5 + 1056Hz C6 + 1318Hz E6 잔향)
        const harmonics = [
          { freq: 659.25, gain: 0.08, decay: 1.05 },
          { freq: 1056.0, gain: 0.045, decay: 0.85 },
          { freq: 1318.5, gain: 0.025, decay: 0.65 },
        ];

        harmonics.forEach(({ freq, gain: baseG, decay }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(baseG * volScale * 0.7, now + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

          osc.connect(gain);
          gain.connect(bus);
          osc.start(now);
          osc.stop(now + decay + 0.05);
        });
        break;
      }

      // ==============================================================
      // 2. BREATHING CATEGORY (Soft Rhythmic Vibrations & Bio-Harmonics)
      // ==============================================================
      case 'breathe_inhale': {
        // Organic breath wave swell (Bandpass pink noise sweeping 360Hz -> 820Hz)
        const noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(360, now);
        filter.frequency.exponentialRampToValueAtTime(820, now + 0.9);
        filter.Q.setValueAtTime(1.8, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.0001, now);
        noiseGain.gain.linearRampToValueAtTime(0.08 * volScale, now + 0.45);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(bus);
        noise.start(now);
        noise.stop(now + 1.0);

        // 432Hz Healing Frequency gentle swelling tone
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now);
        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.linearRampToValueAtTime(0.06 * volScale, now + 0.5);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

        osc.connect(oscGain);
        oscGain.connect(bus);
        osc.start(now);
        osc.stop(now + 1.0);
        break;
      }

      case 'breathe_hold': {
        // Serene 528Hz crystal still tone (Solfeggio Love/Miracle frequency)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.045 * volScale, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        osc.connect(gain);
        gain.connect(bus);
        osc.start(now);
        osc.stop(now + 0.7);
        break;
      }

      case 'breathe_exhale': {
        // Soothing descending release wave (Bandpass pink noise sweeping 820Hz -> 240Hz)
        const noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(820, now);
        filter.frequency.exponentialRampToValueAtTime(240, now + 1.0);
        filter.Q.setValueAtTime(1.6, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.0001, now);
        noiseGain.gain.linearRampToValueAtTime(0.07 * volScale, now + 0.25);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(bus);
        noise.start(now);
        noise.stop(now + 1.2);

        // Relaxing descending tone (432Hz -> 216Hz)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now);
        osc.frequency.exponentialRampToValueAtTime(216, now + 1.0);

        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.linearRampToValueAtTime(0.05 * volScale, now + 0.3);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

        osc.connect(oscGain);
        oscGain.connect(bus);
        osc.start(now);
        osc.stop(now + 1.2);
        break;
      }

      // ===============================================================
      // 3. MEDITATION CATEGORY (Rhythmic Pulse & Tibetan Singing Bowl)
      // ===============================================================
      case 'meditation_cycle': {
        // Soft rhythmic double heartbeat (136.1Hz fundamental)
        const beatOffsets = [0, 0.16];
        beatOffsets.forEach((offset, idx) => {
          const t = now + offset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(136.1, t);
          osc.frequency.exponentialRampToValueAtTime(70, t + 0.08);

          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.linearRampToValueAtTime((0.08 - idx * 0.02) * volScale, t + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

          osc.connect(gain);
          gain.connect(bus);
          osc.start(t);
          osc.stop(t + 0.15);
        });
        break;
      }

      case 'meditation_bell': {
        // Authentic Tibetan singing bowl bell synthesis: 528Hz + 1056Hz + 1440Hz + sub 264Hz
        const harmonics = [
          { freq: 264.0, gain: 0.08, decay: 1.4 },
          { freq: 528.0, gain: 0.16, decay: 1.8 },
          { freq: 1056.0, gain: 0.06, decay: 1.2 },
          { freq: 1440.0, gain: 0.03, decay: 0.9 },
        ];

        harmonics.forEach(({ freq, gain: baseG, decay }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(baseG * volScale, now + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

          osc.connect(gain);
          gain.connect(bus);
          osc.start(now);
          osc.stop(now + decay + 0.05);
        });
        break;
      }

      // ==========================================
      // 4. CARD CATEGORY (Linen Glide, Snap, Riffle)
      // ==========================================
      case 'card_draw': {
        const noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1550, now);
        filter.frequency.exponentialRampToValueAtTime(520, now + 0.08);
        filter.Q.setValueAtTime(3.2, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.0001, now);
        noiseGain.gain.linearRampToValueAtTime(0.14 * volScale, now + 0.008);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(bus);
        noise.start(now);
        noise.stop(now + 0.095);

        const bodyOsc = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        bodyOsc.type = 'sine';
        bodyOsc.frequency.setValueAtTime(190, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(80, now + 0.045);

        bodyGain.gain.setValueAtTime(0.0001, now);
        bodyGain.gain.linearRampToValueAtTime(0.10 * volScale, now + 0.004);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(bus);
        bodyOsc.start(now);
        bodyOsc.stop(now + 0.055);

        const shimmerOsc = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        shimmerOsc.type = 'sine';
        shimmerOsc.frequency.setValueAtTime(2093, now);

        shimmerGain.gain.setValueAtTime(0.0001, now);
        shimmerGain.gain.linearRampToValueAtTime(0.038 * volScale, now + 0.015);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(bus);
        shimmerOsc.start(now);
        shimmerOsc.stop(now + 0.15);
        break;
      }

      case 'card_snap': {
        const noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(2800, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.12 * volScale, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(bus);
        noise.start(now);
        noise.stop(now + 0.02);

        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.018);

        oscGain.gain.setValueAtTime(0.14 * volScale, now);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

        osc.connect(oscGain);
        oscGain.connect(bus);
        osc.start(now);
        osc.stop(now + 0.025);
        break;
      }

      case 'card_shuffle': {
        const times = [0, 0.028, 0.056, 0.088];
        const freqs = [1420, 1680, 1280, 1850];

        times.forEach((offset, idx) => {
          const t = now + offset;
          const noise = ctx.createBufferSource();
          noise.buffer = getNoiseBuffer(ctx);

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(freqs[idx], t);
          filter.frequency.exponentialRampToValueAtTime(450, t + 0.045);
          filter.Q.setValueAtTime(3.5, t);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.linearRampToValueAtTime((0.08 + idx * 0.015) * volScale, t + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(bus);
          noise.start(t);
          noise.stop(t + 0.055);
        });
        break;
      }

      case 'card_hover': {
        const noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1950, now);
        filter.Q.setValueAtTime(4.0, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.028 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(bus);
        noise.start(now);
        noise.stop(now + 0.01);
        break;
      }

      // ==========================================
      // 5. SELECTION & TAP CATEGORY
      // ==========================================
      case 'tap_light': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1150, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.012);

        gain.gain.setValueAtTime(0.06 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

        osc.connect(gain);
        gain.connect(bus);
        osc.start(now);
        osc.stop(now + 0.016);
        break;
      }

      case 'tap_impact': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(290, now);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.06);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.18 * volScale, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

        osc.connect(gain);
        gain.connect(bus);
        osc.start(now);
        osc.stop(now + 0.075);

        const noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.Q.setValueAtTime(2.5, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08 * volScale, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(bus);
        noise.start(now);
        noise.stop(now + 0.05);
        break;
      }

      // ==========================================
      // 6. ALERT & DISCARD CATEGORY
      // ==========================================
      case 'delete_discard': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.06);

        gain.gain.setValueAtTime(0.10 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

        osc.connect(gain);
        gain.connect(bus);
        osc.start(now);
        osc.stop(now + 0.075);
        break;
      }

      case 'alert_warning': {
        // Low cautionary double thud
        const thuds = [0, 0.09];
        thuds.forEach((offset) => {
          const t = now + offset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(160, t);
          osc.frequency.exponentialRampToValueAtTime(60, t + 0.06);

          gain.gain.setValueAtTime(0.11 * volScale, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

          osc.connect(gain);
          gain.connect(bus);
          osc.start(t);
          osc.stop(t + 0.075);
        });
        break;
      }
    }
  } catch (err) {
    console.warn('[AudioHaptics] Synthesis error:', err);
  }
}

/**
 * Convenient categorized helpers
 */
export function playSuccessHaptic(variant: 'sharp' | 'save' | 'milestone' = 'sharp', options?: AudioHapticOptions): void {
  const map: Record<string, AudioHapticType> = {
    sharp: 'success',
    save: 'save_success',
    milestone: 'milestone_success',
  };
  playAudioHaptic(map[variant] || 'success', options);
}

export function playBreathingHaptic(
  phase: 'inhale' | 'hold' | 'exhale' | 'cycle' | 'bell',
  options?: AudioHapticOptions
): void {
  const map: Record<string, AudioHapticType> = {
    inhale: 'breathe_inhale',
    hold: 'breathe_hold',
    exhale: 'breathe_exhale',
    cycle: 'meditation_cycle',
    bell: 'meditation_bell',
  };
  playAudioHaptic(map[phase] || 'breathe_inhale', options);
}

export function playCardHaptic(
  action: 'draw' | 'snap' | 'shuffle' | 'hover',
  options?: AudioHapticOptions
): void {
  const map: Record<string, AudioHapticType> = {
    draw: 'card_draw',
    snap: 'card_snap',
    shuffle: 'card_shuffle',
    hover: 'card_hover',
  };
  playAudioHaptic(map[action] || 'card_draw', options);
}

/**
 * 🔔 AI 결과물 생성 완료 시 은은하고 맑은 약한 종소리 알림 (대화/채팅 제외)
 */
export function playAiResultNotification(options?: AudioHapticOptions): void {
  try {
    playAudioHaptic('ai_result_chime', { volume: 0.75, ...options });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prism:ai_result_created'));
    }
  } catch (e) {
    console.warn('[AudioHaptics] playAiResultNotification failed:', e);
  }
}
