/**
 * Sacred Audio Synthesizer (Web Audio API)
 * 528Hz / 432Hz Solfeggio Harmonic Drone & Tibetan Singing Bowl Bell Synthesis
 */

class SacredAudioEngine {
  private ctx: AudioContext | null = null;
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private isDroneActive = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * 528Hz / 432Hz 신비로운 솔페지오 앰비언트 드론 토글
   */
  toggleDrone(enable?: boolean): boolean {
    const ctx = this.getContext();
    if (!ctx) return false;

    const targetState = enable !== undefined ? enable : !this.isDroneActive;

    if (targetState && !this.isDroneActive) {
      try {
        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.exponentialRampToValueAtTime(0.08, now + 2.0);
        masterGain.connect(ctx.destination);
        this.droneGain = masterGain;

        // 432Hz (Cosmic Grounding)
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(432, now);
        osc1.connect(masterGain);
        osc1.start(now);
        this.droneOsc1 = osc1;

        // 528Hz (Transformation & Miracles)
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(528, now);
        osc2.connect(masterGain);
        osc2.start(now);
        this.droneOsc2 = osc2;

        this.isDroneActive = true;
        return true;
      } catch {
        return false;
      }
    } else if (!targetState && this.isDroneActive) {
      try {
        const now = ctx.currentTime;
        if (this.droneGain) {
          this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
          setTimeout(() => {
            try {
              this.droneOsc1?.stop();
              this.droneOsc2?.stop();
              this.droneOsc1?.disconnect();
              this.droneOsc2?.disconnect();
            } catch (_) {}
          }, 1300);
        }
        this.isDroneActive = false;
        return false;
      } catch {
        return false;
      }
    }
    return this.isDroneActive;
  }

  isDronePlaying(): boolean {
    return this.isDroneActive;
  }

  stopDrone(): void {
    this.toggleDrone(false);
  }

  /**
   * 크리스탈 싱잉볼 (Tibetan Singing Bowl Bell Strike)
   * 수정구슬 영시 개화 시 맑고 깊게 울려 퍼지는 배음 타종
   */
  playSingingBowl(freq = 528): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // 기본음 + 배음 3개
      const partials = [
        { f: freq, gain: 0.35, decay: 4.5 },
        { f: freq * 2.01, gain: 0.15, decay: 3.2 },
        { f: freq * 3.02, gain: 0.08, decay: 2.2 },
        { f: freq * 4.76, gain: 0.04, decay: 1.5 },
      ];

      partials.forEach((p) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(p.f, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(p.gain, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + p.decay + 0.1);
      });
    } catch (_) {}
  }

  /**
   * 룬 마법진 가속 회전 펄스음 (Runic Warp Chime)
   */
  playRunicPulse(progress = 0.5): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const startFreq = 300 + progress * 400;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (_) {}
  }
}

export const sacredAudio = new SacredAudioEngine();
