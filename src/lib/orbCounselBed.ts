import { getAmbientAudioBus, getSharedAudioContext, setBgmPlaybackSessionActive, unlockAudioPlayback } from './audio';

export type OrbCounselBed = {
  /** 사용자 탭 안에서 호출해야 아이폰이 소리를 허용한다. 실제로 울리면 true. */
  resume: () => Promise<boolean>;
  setAudible: (on: boolean, ducked?: boolean) => void;
  stop: () => void;
};

export function createOrbCounselBed(): OrbCounselBed | null {
  if (typeof window === 'undefined') return null;

  let ctx: AudioContext | null = null;
  let bed: GainNode | null = null;
  let nodes: AudioScheduledSourceNode[] = [];
  let chimeTimer = 0;
  let firstChime = 0;
  let stopped = false;
  let wantedOn = false;
  let wantedDuck = false;

  const level = (on: boolean, ducked = false) => (on ? (ducked ? 0.35 : 0.72) : 0.0001);

  const applyLevel = () => {
    if (!ctx || !bed || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const current = Number.isFinite(bed.gain.value) ? Math.max(bed.gain.value, 0.0001) : 0.0001;
    bed.gain.cancelScheduledValues(now);
    bed.gain.setValueAtTime(current, now);
    bed.gain.linearRampToValueAtTime(level(wantedOn, wantedDuck), now + (wantedOn ? 0.08 : 0.2));
  };

  const teardownGraph = () => {
    window.clearInterval(chimeTimer);
    window.clearTimeout(firstChime);
    chimeTimer = 0;
    firstChime = 0;
    nodes.forEach(node => { try { node.stop(); } catch { /* already stopped */ } });
    nodes = [];
    try { bed?.disconnect(); } catch { /* already disconnected */ }
    bed = null;
  };

  const startGraph = (audio: AudioContext, bus: GainNode) => {
    teardownGraph();
    const next = audio.createGain();
    next.gain.value = 0.0001;
    next.connect(bus);
    bed = next;

    const filter = audio.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 520;
    const pad = audio.createGain();
    pad.gain.value = 0.42;
    filter.connect(pad).connect(next);

    const tone = (frequency: number, detune = 0, dest: AudioNode = filter) => {
      const osc = audio.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = frequency;
      osc.detune.value = detune;
      osc.connect(dest);
      osc.start();
      nodes.push(osc);
    };
    tone(98, -4);
    tone(146.8, 6);
    tone(196, 2);
    // 폰 스피커가 낮은 드론을 거의 못 내므로, 들리는 대역을 하나 더 얹는다.
    const presence = audio.createGain();
    presence.gain.value = 0.12;
    presence.connect(next);
    tone(392, 0, presence);

    const lfo = audio.createOscillator();
    const lfoGain = audio.createGain();
    lfo.frequency.value = 0.06;
    lfoGain.gain.value = 70;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();
    nodes.push(lfo);

    const noiseBuffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const noise = audio.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const air = audio.createBiquadFilter();
    air.type = 'bandpass';
    air.frequency.value = 640;
    air.Q.value = 0.5;
    const airGain = audio.createGain();
    airGain.gain.value = 0.035;
    noise.connect(air).connect(airGain).connect(next);
    noise.start();
    nodes.push(noise);

    const chime = () => {
      if (!bed || audio.state !== 'running') return;
      const start = audio.currentTime;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'sine';
      osc.frequency.value = [392, 494, 587, 659][Math.floor(Math.random() * 4)];
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.045, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 3.4);
      osc.connect(gain).connect(bed);
      osc.start(start);
      osc.stop(start + 3.6);
    };
    chimeTimer = window.setInterval(chime, 11000);
    firstChime = window.setTimeout(chime, 900);
  };

  return {
    resume: () => {
      if (stopped) return Promise.resolve(false);
      // await 뒤에 발진기를 만들면 아이폰이 그 소리를 버린다. 제스처가 살아있는 턴에서 바로 켠다.
      try { unlockAudioPlayback(); } catch { /* no audio */ }
      let bus: GainNode;
      try {
        ctx = getSharedAudioContext();
        bus = getAmbientAudioBus();
      } catch {
        return Promise.resolve(false);
      }
      wantedOn = true;
      const pending = ctx.resume().catch(() => undefined);
      const arm = () => {
        if (stopped || !ctx || (ctx.state as string) !== 'running') return false;
        if (!bed || bed.context !== ctx) startGraph(ctx, bus);
        applyLevel();
        try { setBgmPlaybackSessionActive(true); } catch { /* mixing policy unavailable */ }
        return true;
      };
      if (arm()) return Promise.resolve(true);
      return new Promise<boolean>((resolve) => {
        let settled = false;
        const finish = (ok: boolean) => {
          if (settled) return;
          settled = true;
          ctx?.removeEventListener('statechange', onState);
          window.clearTimeout(timer);
          resolve(ok);
        };
        const onState = () => { if (arm()) finish(true); };
        ctx.addEventListener('statechange', onState);
        const timer = window.setTimeout(() => finish(arm()), 900);
        void pending.then(() => { if (arm()) finish(true); });
      });
    },
    setAudible: (on, ducked = false) => {
      if (stopped) return;
      wantedOn = on;
      wantedDuck = ducked;
      applyLevel();
    },
    stop: () => {
      if (stopped) return;
      stopped = true;
      wantedOn = false;
      try { setBgmPlaybackSessionActive(false); } catch { /* mixing policy unavailable */ }
      if (ctx && bed && ctx.state === 'running') {
        const now = ctx.currentTime;
        try {
          bed.gain.cancelScheduledValues(now);
          bed.gain.setValueAtTime(Math.max(bed.gain.value, 0.0001), now);
          bed.gain.linearRampToValueAtTime(0.0001, now + 0.25);
        } catch { /* context closed */ }
        window.setTimeout(teardownGraph, 300);
        return;
      }
      teardownGraph();
    },
  };
}
