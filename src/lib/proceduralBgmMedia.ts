import { AMBIENT_MASTER_GAIN_SCALE, createLoopingNoiseSource } from './audio';
import { FLOW_TRACK_GENERATORS, getTrackNormalizationGain } from './proceduralBgmSuite';

const DURATION_SECONDS = 96;
const SAMPLE_RATE = 22050;
const cache = new Map<string, Promise<string>>();

/** Render the existing composition once; native media playback survives JS timer suspension. */
export function getProceduralBgmMediaUrl(track: string): Promise<string> {
  const existing = cache.get(track);
  if (existing) return existing;
  const promise = renderProceduralBgm(track).then(buffer => {
    const url = URL.createObjectURL(encodeBgmWav(buffer));
    // Bound retained media to two tracks. The active element retains its loaded media.
    while (cache.size > 2) {
      const oldest = cache.keys().next().value!;
      const old = cache.get(oldest)!;
      cache.delete(oldest);
      void old.then(URL.revokeObjectURL, () => {});
    }
    return url;
  }).catch(error => { cache.delete(track); throw error; });
  cache.set(track, promise);
  return promise;
}

export async function renderProceduralBgm(track: string, seconds = DURATION_SECONDS): Promise<AudioBuffer> {
  const generator = FLOW_TRACK_GENERATORS[track];
  if (!generator) throw new Error(`Unknown BGM composition: ${track}`);
  const OfflineContext = globalThis.OfflineAudioContext || (globalThis as any).webkitOfflineAudioContext;
  if (!OfflineContext) throw new Error('Offline audio rendering is unavailable');
  const overlap = Math.min(2, seconds / 4);
  const renderSeconds = seconds + overlap;
  const offline = new OfflineContext(2, Math.ceil(renderSeconds * SAMPLE_RATE), SAMPLE_RATE) as OfflineAudioContext;
  let musicalTime = 0;
  const ctx = new Proxy(offline, {
    get(target, key) {
      if (key === 'currentTime') return musicalTime;
      const value = Reflect.get(target, key, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  }) as unknown as AudioContext;
  const master = offline.createGain();
  const limiter = offline.createDynamicsCompressor();
  limiter.threshold.value = -20;
  limiter.knee.value = 12;
  limiter.ratio.value = 2;
  limiter.attack.value = 0.008;
  limiter.release.value = 0.2;
  master.connect(limiter);
  limiter.connect(offline.destination);
  master.gain.value = AMBIENT_MASTER_GAIN_SCALE * getTrackNormalizationGain(track);

  const events: Array<{ callback: () => void; interval: number; next: number }> = [];
  generator(ctx, master, {
    scheduleInterval: (callback, ms) => {
      if (!(ms > 0)) throw new Error('Invalid BGM interval');
      events.push({ callback, interval: ms / 1000, next: musicalTime + ms / 1000 });
      return events.length;
    },
    createAutoPanner: (speed, depth) => {
      const panner = offline.createStereoPanner();
      const lfo = offline.createOscillator();
      const gain = offline.createGain();
      lfo.frequency.value = speed;
      gain.gain.value = depth;
      lfo.connect(gain).connect(panner.pan);
      panner.connect(master);
      lfo.start(0);
      return panner;
    },
    createDelay: (time, feedback, wet) => {
      const delay = offline.createDelay(2);
      delay.delayTime.value = time;
      const feedbackGain = offline.createGain();
      feedbackGain.gain.value = feedback;
      delay.connect(feedbackGain).connect(delay);
      const wetGain = offline.createGain();
      wetGain.gain.value = wet;
      delay.connect(wetGain).connect(master);
      return delay;
    },
    createNoiseNode: (_context, color) => createLoopingNoiseSource(ctx, color, 10),
    registerDynamicVoice: () => {}, // Voice stop times are scheduled in each composition.
    activeNodesRef: { current: [] }, synthIntervalRef: { current: null }, secondarySynthIntervalRef: { current: null },
  });
  while (events.length) {
    events.sort((a, b) => a.next - b.next);
    const event = events[0];
    if (event.next >= renderSeconds) break;
    musicalTime = event.next;
    event.callback();
    event.next += event.interval;
  }
  const rendered = await offline.startRendering();
  const frames = Math.floor(seconds * SAMPLE_RATE);
  const overlapFrames = Math.floor(overlap * SAMPLE_RATE);
  const loop = offline.createBuffer(2, frames, SAMPLE_RATE);
  // Fold the rendered tail into the beginning, so native looping has no silent gap.
  for (let channel = 0; channel < 2; channel++) {
    const source = rendered.getChannelData(channel);
    const output = loop.getChannelData(channel);
    output.set(source.subarray(0, frames));
    for (let frame = 0; frame < overlapFrames; frame++) {
      const angle = (frame / overlapFrames) * Math.PI / 2;
      output[frame] = source[frames + frame] * Math.cos(angle) + source[frame] * Math.sin(angle);
    }
  }
  return loop;
}

export function encodeBgmWav(buffer: Pick<AudioBuffer, 'numberOfChannels' | 'length' | 'sampleRate' | 'getChannelData'>): Blob {
  const channels = buffer.numberOfChannels;
  const size = buffer.length * channels * 2;
  const bytes = new ArrayBuffer(44 + size);
  const view = new DataView(bytes);
  const write = (offset: number, value: string) => Array.from(value).forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
  write(0, 'RIFF'); view.setUint32(4, 36 + size, true); write(8, 'WAVE'); write(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true); view.setUint32(28, buffer.sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true); view.setUint16(34, 16, true); write(36, 'data'); view.setUint32(40, size, true);
  const data = Array.from({ length: channels }, (_, index) => buffer.getChannelData(index));
  let offset = 44;
  for (let frame = 0; frame < buffer.length; frame++) for (let channel = 0; channel < channels; channel++) {
    const sample = Math.max(-1, Math.min(1, data[channel][frame]));
    view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true); offset += 2;
  }
  return new Blob([bytes], { type: 'audio/wav' });
}

export { primeUserMediaPlayback as primeNativeBgmPlayback } from './nativeMediaPriming';
