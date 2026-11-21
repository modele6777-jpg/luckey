/**
 * TTS 낭독 완료 효과음: 짧고 또렷한 '착' 스냅.
 *
 * 짧은 결정론적 잡음 트랜지언트에 낮은 중역 공명을 조금 보태어 알림처럼
 * 즉시 알아차릴 수 있지만, 종소리의 두 음이나 새 지저귐처럼 길게 이어지지 않게 한다.
 *
 * 외부 음악 공존 원칙(AGENTS.md §2)을 지킨다: 오디오 세션을 변경하지 않고
 * 이미 열린 공유 컨텍스트의 haptic 버스(destination)에만 재생한다.
 */

export const COMPLETION_CHIME_DURATION = 0.15;
export const COMPLETION_CHIME_PEAK = 0.14;

const ATTACK_SECONDS = 0.002;
const NOISE_DECAY_SECONDS = 0.022;
const BODY_FREQUENCY_HZ = 920;
const BODY_DECAY_SECONDS = 0.032;
const TAIL_FADE_SECONDS = 0.04;
const NOISE_LOWPASS_HZ = 4800;
const NOISE_HIGHPASS_HZ = 420;

/**
 * 짧은 '착' 파형을 결정론적으로 렌더링한다(테스트/버퍼 공용).
 * 필터링한 단발 잡음과 낮은 중역 공명을 섞고, 부드러운 앞·뒤 경계와 피크 제한을 적용한다.
 */
export function renderCompletionChime(sampleRate: number): Float32Array {
  if (!Number.isFinite(sampleRate) || sampleRate < 8000) throw new RangeError('Invalid audio sample rate');
  const samples = new Float32Array(Math.ceil(sampleRate * COMPLETION_CHIME_DURATION));
  const lowpassHz = Math.min(NOISE_LOWPASS_HZ, sampleRate * 0.42);
  const highpassHz = Math.min(NOISE_HIGHPASS_HZ, sampleRate * 0.08);
  const lowpassAlpha = 1 - Math.exp((-2 * Math.PI * lowpassHz) / sampleRate);
  const highpassAlpha = 1 - Math.exp((-2 * Math.PI * highpassHz) / sampleRate);
  const fadeSamples = Math.min(samples.length, Math.ceil(sampleRate * TAIL_FADE_SECONDS));

  let randomState = 0x6d2b79f5;
  let lowpass = 0;
  let lowFrequencyNoise = 0;
  for (let index = 0; index < samples.length; index++) {
    const time = index / sampleRate;
    randomState = (Math.imul(1664525, randomState) + 1013904223) >>> 0;
    const whiteNoise = (randomState / 0x100000000) * 2 - 1;
    lowpass += lowpassAlpha * (whiteNoise - lowpass);
    lowFrequencyNoise += highpassAlpha * (lowpass - lowFrequencyNoise);
    const bandLimitedNoise = lowpass - lowFrequencyNoise;

    const attack = time < ATTACK_SECONDS
      ? 0.5 - 0.5 * Math.cos((Math.PI * time) / ATTACK_SECONDS)
      : 1;
    const noiseDecay = Math.exp(-time / NOISE_DECAY_SECONDS);
    const body = 0.22 * Math.sin(2 * Math.PI * BODY_FREQUENCY_HZ * time)
      * Math.exp(-time / BODY_DECAY_SECONDS);
    const tailProgress = Math.min(1, (samples.length - 1 - index) / fadeSamples);
    const tail = 0.5 - 0.5 * Math.cos(Math.PI * tailProgress);
    samples[index] = (0.82 * bandLimitedNoise * noiseDecay + body) * attack * tail;
  }
  samples[samples.length - 1] = 0;

  let peak = 0;
  for (let index = 0; index < samples.length; index++) peak = Math.max(peak, Math.abs(samples[index]));
  const normalization = COMPLETION_CHIME_PEAK / Math.max(peak, 0.0001);
  for (let index = 0; index < samples.length; index++) samples[index] *= normalization;
  return samples;
}

const buffers = new WeakMap<BaseAudioContext, AudioBuffer>();

/** 외부 음악을 멈추거나 ducking·세션 승격 없이, 공유 버스로 짧은 완료음을 한 번 재생한다. */
export function playCompletionChime(context: AudioContext, destination: AudioNode, volume = 1): void {
  let buffer = buffers.get(context);
  if (!buffer) {
    const samples = renderCompletionChime(context.sampleRate);
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
