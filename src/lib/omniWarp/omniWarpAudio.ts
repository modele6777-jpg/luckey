/**
 * OmniWarp Audio Synthesizer (Web Audio API)
 * Zero-dependency pure algorithmic cosmic audio generator
 */

class OmniWarpAudioEngine {
  private ctx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * 화이트홀 (White Hole): 맑고 가벼운 고주파 탭 (*톡-*)
   */
  playWhiteHole(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (_) {}
  }

  /**
   * 가벼운 인터랙션 탭/클릭 사운드
   */
  playClick(): void {
    this.playWhiteHole();
  }

  /**
   * 더블탭 (Double Tap): 프리즘 메인 귀환 밝고 경쾌한 2단 상승 크리스탈 차임 (*띠링-*)
   */
  playDoubleTap(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Tone 1: 880Hz
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1100, now + 0.07);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.09);

      // Tone 2: 1320Hz -> 1760Hz
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, now + 0.07);
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.16);
      gain2.gain.setValueAtTime(0.28, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.19);
    } catch (_) {}
  }

  /**
   * 웜홀 (Wormhole): 빛비춤(화이트홀) + 심연(블랙홀) + 사건의 지평선 동시 융합 사운드
   */
  playWormhole(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. 심연 (Blackhole Abyss): 묵직한 저주파 중력파 서브베이스
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(80, now);
      subOsc.frequency.exponentialRampToValueAtTime(36, now + 0.35);
      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.4);

      // 2. 빛비춤 (Whitehole Radiance): 맑고 높은 크리스탈 스타라이트 배음
      const highOsc = ctx.createOscillator();
      const highGain = ctx.createGain();
      highOsc.type = 'sine';
      highOsc.frequency.setValueAtTime(920, now);
      highOsc.frequency.exponentialRampToValueAtTime(1480, now + 0.2);
      highGain.gain.setValueAtTime(0.24, now);
      highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      highOsc.connect(highGain);
      highGain.connect(ctx.destination);
      highOsc.start(now);
      highOsc.stop(now + 0.26);

      // 3. 사건의 지평선 (Event Horizon): 시공간 왜곡 밴드패스 워프 스위프
      const warpOsc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const warpGain = ctx.createGain();
      warpOsc.type = 'triangle';
      warpOsc.frequency.setValueAtTime(220, now);
      warpOsc.frequency.exponentialRampToValueAtTime(780, now + 0.28);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.28);
      filter.Q.value = 3.0;
      warpGain.gain.setValueAtTime(0.28, now);
      warpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      warpOsc.connect(filter);
      filter.connect(warpGain);
      warpGain.connect(ctx.destination);
      warpOsc.start(now);
      warpOsc.stop(now + 0.34);
    } catch (_) {}
  }

  /**
   * 사건의 지평선 (Event Horizon): 주파수가 낮아지며 굵어짐 (*두둑...*)
   */
  playEventHorizon(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.18);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch (_) {}
  }

  /**
   * 블랙홀 (Black Hole): 바닥까지 울리는 저주파 중력파 (*쿠구궁-*)
   */
  playBlackHole(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.45);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 0.45);

      gain.gain.setValueAtTime(0.42, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.52);
    } catch (_) {}
  }

  /**
   * 빅뱅 (Big Bang Commit): 단발성 임팩트 킥 (*쿵!*) + 우주 폭발음
   */
  playBigBang(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Heavy sub-bass kick
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.25);

      subGain.gain.setValueAtTime(0.65, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.58);

      // 2. Cosmic shimmer air burst (noise-like high tone)
      const burstOsc = ctx.createOscillator();
      const burstGain = ctx.createGain();

      burstOsc.type = 'triangle';
      burstOsc.frequency.setValueAtTime(580, now);
      burstOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

      burstGain.gain.setValueAtTime(0.2, now);
      burstGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      burstOsc.connect(burstGain);
      burstGain.connect(ctx.destination);

      burstOsc.start(now);
      burstOsc.stop(now + 0.36);
    } catch (_) {}
  }

  /**
   * 안전 취소 (Safe Abort): 부드러운 디졸브 (*스윽*)
   */
  playAbort(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (_) {}
  }

  playCommit(): void {
    this.playBigBang();
  }
}

export const omniWarpAudio = new OmniWarpAudioEngine();
