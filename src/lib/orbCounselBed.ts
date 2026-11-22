import { getAmbientAudioBus, getSharedAudioContext } from './audio';

export type OrbCounselBed = {
  resume: () => Promise<void>;
  setAudible: (on: boolean, ducked?: boolean) => void;
  stop: () => void;
};

export function createOrbCounselBed(): OrbCounselBed | null {
  if (typeof window === 'undefined') return null;
  let ctx: AudioContext;
  let bus: GainNode;
  try {
    ctx = getSharedAudioContext();
    bus = getAmbientAudioBus();
  } catch {
    return null;
  }

  const bed = ctx.createGain();
  bed.gain.value = 0.0001;
  bed.connect(bus);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 520;
  const pad = ctx.createGain();
  pad.gain.value = 0.16;
  filter.connect(pad).connect(bed);

  const nodes: AudioScheduledSourceNode[] = [];
  const tone = (frequency: number, detune = 0) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    osc.detune.value = detune;
    osc.connect(filter);
    osc.start();
    nodes.push(osc);
  };
  tone(98, -4);
  tone(146.8, 6);
  tone(196, 2);

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.06;
  lfoGain.gain.value = 70;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();
  nodes.push(lfo);

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const air = ctx.createBiquadFilter();
  air.type = 'bandpass';
  air.frequency.value = 640;
  air.Q.value = 0.5;
  const airGain = ctx.createGain();
  airGain.gain.value = 0.035;
  noise.connect(air).connect(airGain).connect(bed);
  noise.start();
  nodes.push(noise);

  const chime = () => {
    const start = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = [392, 494, 587, 659][Math.floor(Math.random() * 4)];
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.045, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 3.4);
    osc.connect(gain).connect(bed);
    osc.start(start);
    osc.stop(start + 3.6);
  };
  const chimeTimer = window.setInterval(chime, 11000);
  window.setTimeout(chime, 2200);

  let stopped = false;
  const level = (on: boolean, ducked = false) => (on ? (ducked ? 0.35 : 0.72) : 0.0001);
  return {
    resume: async () => {
      if (ctx.state === 'suspended') await ctx.resume();
    },
    setAudible: (on, ducked = false) => {
      if (stopped) return;
      const now = ctx.currentTime;
      bed.gain.cancelScheduledValues(now);
      bed.gain.linearRampToValueAtTime(level(on, ducked), now + 0.7);
    },
    stop: () => {
      if (stopped) return;
      stopped = true;
      window.clearInterval(chimeTimer);
      const now = ctx.currentTime;
      bed.gain.cancelScheduledValues(now);
      bed.gain.linearRampToValueAtTime(0.0001, now + 0.6);
      window.setTimeout(() => {
        nodes.forEach(node => { try { node.stop(); } catch { /* already stopped */ } });
        try { bed.disconnect(); } catch { /* already disconnected */ }
      }, 700);
    },
  };
}
