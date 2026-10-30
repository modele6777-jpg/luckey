/** A single warm bowl strike, with audible midrange and a short natural tail.
 * Peak-normalized once so completion volume is predictable across sample rates. */
export const COMPLETION_BOWL_DURATION = 2.3;
export const COMPLETION_BOWL_PEAK = 0.65;

export function renderCompletionBowl(sampleRate: number): Float32Array {
  if (!Number.isFinite(sampleRate) || sampleRate < 8000) throw new RangeError('Invalid audio sample rate');
  const samples = new Float32Array(Math.ceil(sampleRate * COMPLETION_BOWL_DURATION));
  const partials = [
    { frequency: 587.33, amplitude: 1, decay: 0.58 },
    { frequency: 589.15, amplitude: 0.18, decay: 0.64 },
    { frequency: 1597.54, amplitude: 0.22, decay: 0.36 },
    { frequency: 3159.84, amplitude: 0.045, decay: 0.19 },
  ];
  let peak = 0;
  for (let index = 0; index < samples.length; index++) {
    const time = index / sampleRate;
    const attack = 1 - Math.exp(-time / 0.004);
    const tail = Math.min(1, Math.max(0, (COMPLETION_BOWL_DURATION - time) / 0.24));
    let value = 0;
    for (const partial of partials) {
      value += partial.amplitude * Math.exp(-time / partial.decay)
        * Math.sin(2 * Math.PI * partial.frequency * time);
    }
    value *= attack * tail * tail;
    samples[index] = value;
    peak = Math.max(peak, Math.abs(value));
  }
  const normalization = COMPLETION_BOWL_PEAK / Math.max(peak, 0.0001);
  for (let index = 0; index < samples.length; index++) samples[index] *= normalization;
  return samples;
}

const buffers = new WeakMap<BaseAudioContext, AudioBuffer>();
export function playCompletionBowl(context: AudioContext, destination: AudioNode, volume = 1): void {
  let buffer = buffers.get(context);
  if (!buffer) {
    const samples = renderCompletionBowl(context.sampleRate);
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
