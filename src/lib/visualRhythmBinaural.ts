import { getAmbientAudioBus, getSharedAudioContext } from './audio';

export interface VisualRhythmBeatConfig {
  beatHz: number;
  carrierHz: number;
  waveLabel: string;
}

export function getVisualRhythmBeatConfig(bpm: number): VisualRhythmBeatConfig {
  if (bpm <= 65) return { beatHz: 4.5, carrierHz: 216, waveLabel: '4.5 Hz' };
  if (bpm <= 95) return { beatHz: 10, carrierHz: 220, waveLabel: '10 Hz' };
  return { beatHz: 15, carrierHz: 240, waveLabel: '15 Hz' };
}

/** Stereo beat oscillator for the Visual Rhythm card; it never creates or closes a separate audio session. */
export class VisualRhythmBinauralPlayer {
  private context: AudioContext | null = null;
  private leftOscillator: OscillatorNode | null = null;
  private rightOscillator: OscillatorNode | null = null;
  private outputGain: GainNode | null = null;

  public start(bpm: number): boolean {
    this.stop();
    let left: OscillatorNode | null = null;
    let right: OscillatorNode | null = null;
    let output: GainNode | null = null;
    try {
      const context = getSharedAudioContext();
      const ambientBus = getAmbientAudioBus();
      if (context.state === 'suspended') {
        void context.resume().catch((error) => console.warn('[VisualRhythm] Audio resume failed:', error));
      }

      const { beatHz, carrierHz } = getVisualRhythmBeatConfig(bpm);
      const now = context.currentTime;
      const merger = context.createChannelMerger(2);
      const leftGain = context.createGain();
      const rightGain = context.createGain();
      left = context.createOscillator();
      right = context.createOscillator();
      output = context.createGain();

      left.type = 'sine';
      left.frequency.setValueAtTime(carrierHz, now);
      right.type = 'sine';
      right.frequency.setValueAtTime(carrierHz + beatHz, now);
      leftGain.gain.setValueAtTime(0.5, now);
      rightGain.gain.setValueAtTime(0.5, now);
      output.gain.setValueAtTime(0.001, now);
      output.gain.exponentialRampToValueAtTime(0.12, now + 0.5);

      left.connect(leftGain);
      leftGain.connect(merger, 0, 0);
      right.connect(rightGain);
      rightGain.connect(merger, 0, 1);
      merger.connect(output);
      output.connect(ambientBus);

      this.context = context;
      this.leftOscillator = left;
      this.rightOscillator = right;
      this.outputGain = output;
      left.start(now);
      right.start(now);
      return true;
    } catch (error) {
      for (const oscillator of [left, right]) {
        try { oscillator?.stop(); } catch {}
        try { oscillator?.disconnect(); } catch {}
      }
      try { output?.disconnect(); } catch {}
      this.context = null;
      this.leftOscillator = null;
      this.rightOscillator = null;
      this.outputGain = null;
      console.warn('[VisualRhythm] Binaural playback failed:', error);
      return false;
    }
  }

  public updateBpm(bpm: number): void {
    if (!this.context || !this.leftOscillator || !this.rightOscillator) return;
    const { beatHz, carrierHz } = getVisualRhythmBeatConfig(bpm);
    const now = this.context.currentTime;
    this.leftOscillator.frequency.cancelScheduledValues(now);
    this.rightOscillator.frequency.cancelScheduledValues(now);
    this.leftOscillator.frequency.setValueAtTime(this.leftOscillator.frequency.value, now);
    this.rightOscillator.frequency.setValueAtTime(this.rightOscillator.frequency.value, now);
    this.leftOscillator.frequency.linearRampToValueAtTime(carrierHz, now + 0.3);
    this.rightOscillator.frequency.linearRampToValueAtTime(carrierHz + beatHz, now + 0.3);
  }

  public stop(fadeSeconds = 0.25): void {
    const context = this.context;
    const left = this.leftOscillator;
    const right = this.rightOscillator;
    const output = this.outputGain;
    this.context = null;
    this.leftOscillator = null;
    this.rightOscillator = null;
    this.outputGain = null;

    if (!left && !right && !output) return;
    const fade = Math.max(0, fadeSeconds);
    if (context && output && fade > 0) {
      try {
        const now = context.currentTime;
        output.gain.cancelScheduledValues(now);
        output.gain.setValueAtTime(Math.max(0.0001, output.gain.value), now);
        output.gain.linearRampToValueAtTime(0.0001, now + fade);
        left?.stop(now + fade + 0.02);
        right?.stop(now + fade + 0.02);
        setTimeout(() => {
          try { left?.disconnect(); } catch {}
          try { right?.disconnect(); } catch {}
          try { output.disconnect(); } catch {}
        }, (fade + 0.05) * 1000);
        return;
      } catch {}
    }

    try { left?.stop(); } catch {}
    try { right?.stop(); } catch {}
    try { left?.disconnect(); } catch {}
    try { right?.disconnect(); } catch {}
    try { output?.disconnect(); } catch {}
  }
}
