export const COMPLETION_BIRD_CHIRP_DURATION = 0.66;
export const COMPLETION_BIRD_CHIRP_PEAK = 0.3;

interface BirdChirpNote {
  start: number;
  duration: number;
  startFrequency: number;
  peakFrequency: number;
  endFrequency: number;
  amplitude: number;
}

const NOTES: BirdChirpNote[] = [
  { start: 0.025, duration: 0.105, startFrequency: 2050, peakFrequency: 2820, endFrequency: 2380, amplitude: 1 },
  { start: 0.17, duration: 0.105, startFrequency: 2360, peakFrequency: 3180, endFrequency: 2700, amplitude: 0.82 },
  { start: 0.315, duration: 0.14, startFrequency: 2720, peakFrequency: 3480, endFrequency: 2450, amplitude: 0.74 },
];

function chirpPhase(note: BirdChirpNote, time: number): number {
  const halfDuration = note.duration / 2;
  const firstSlope = (note.peakFrequency - note.startFrequency) / halfDuration;
  if (time <= halfDuration) {
    return 2 * Math.PI * (note.startFrequency * time + 0.5 * firstSlope * time * time);
  }

  const firstHalfCycles = note.startFrequency * halfDuration + 0.5 * firstSlope * halfDuration * halfDuration;
  const secondTime = time - halfDuration;
  const secondSlope = (note.endFrequency - note.peakFrequency) / halfDuration;
  return 2 * Math.PI * (
    firstHalfCycles + note.peakFrequency * secondTime + 0.5 * secondSlope * secondTime * secondTime
  );
}

export function renderCompletionBirdChirp(sampleRate: number): Float32Array {
  if (!Number.isFinite(sampleRate) || sampleRate < 8000) throw new RangeError('Invalid audio sample rate');
  const samples = new Float32Array(Math.ceil(sampleRate * COMPLETION_BIRD_CHIRP_DURATION));
  let peak = 0;

  for (let index = 0; index < samples.length; index++) {
    const time = index / sampleRate;
    let value = 0;
    for (const note of NOTES) {
      const noteTime = time - note.start;
      if (noteTime < 0 || noteTime >= note.duration) continue;
      const progress = noteTime / note.duration;
      const envelope = Math.pow(Math.sin(Math.PI * progress), 1.4);
      const phase = chirpPhase(note, noteTime);
      const naturalOvertones = Math.sin(phase) + 0.12 * Math.sin(phase * 2 + 0.4);
      const softFlutter = 0.92 + 0.08 * Math.sin(2 * Math.PI * 7 * noteTime);
      value += note.amplitude * envelope * softFlutter * naturalOvertones;
    }
    samples[index] = value;
    peak = Math.max(peak, Math.abs(value));
  }

  const normalization = COMPLETION_BIRD_CHIRP_PEAK / Math.max(peak, 0.0001);
  for (let index = 0; index < samples.length; index++) samples[index] *= normalization;
  return samples;
}

const buffers = new WeakMap<BaseAudioContext, AudioBuffer>();

/** Plays a single brief bird chirp without pausing, ducking, or controlling external audio. */
export function playCompletionBirdChirp(context: AudioContext, destination: AudioNode, volume = 1): void {
  let buffer = buffers.get(context);
  if (!buffer) {
    const samples = renderCompletionBirdChirp(context.sampleRate);
    buffer = context.createBuffer(1, samples.length, context.sampleRate);
    buffer.getChannelData(0).set(samples);
    buffers.set(context, buffer);
  }

  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = Math.max(0, Math.min(1.5, Number.isFinite(volume) ? volume : 1));
  source.buffer = buffer;
  source.connect(gain);
  gain.connect(destination);
  source.onended = () => { source.disconnect(); gain.disconnect(); };
  source.start();
}
