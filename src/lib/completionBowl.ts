/**
 * TTS 낭독 완료 효과음용 티베탄 싱잉볼 한 번.
 *
 * 펠트 말렛으로 살짝 두드린 싱잉볼처럼, 딱 부러지는 어택이나 쇠를 긁는 듯한
 * 고주파 없이 따뜻한 중저음 기본음이 은은한 맥놀이(beating)와 함께 길게 여운을 남긴다.
 * 완성된 버퍼는 한 번 피크 정규화하므로 샘플레이트와 무관하게 완료음 크기가 일정하다.
 */
export const COMPLETION_BOWL_DURATION = 2.8;
export const COMPLETION_BOWL_PEAK = 0.42;
/** 따뜻하고 안정적인 기본음(C4 근처 중저음). */
export const COMPLETION_BOWL_FUNDAMENTAL_HZ = 256;
/** 기본음 옆에 아주 가까이 두는 근접 배음 — 1.4Hz 느린 맥놀이로 숨쉬는 듯한 여운을 만든다. */
export const COMPLETION_BOWL_BEATING_HZ = 1.4;
/** 말렛이 닿는 순간의 완만한 어택(시상수 0.045s) — 틱/클릭감을 없앤다. */
export const COMPLETION_BOWL_ATTACK_TAU = 0.045;
/** 곡 끝에서 부드럽게 사라지는 테일 구간(초). */
export const COMPLETION_BOWL_TAIL = 0.5;

export interface CompletionBowlPartial {
  frequency: number;
  amplitude: number;
  decay: number;
}

/** 3kHz 이상 고주파는 넣지 않는다 — 부드러운 중간 배음만 아주 약하게. */
export function completionBowlPartials(): CompletionBowlPartial[] {
  const fundamental = COMPLETION_BOWL_FUNDAMENTAL_HZ;
  return [
    { frequency: fundamental, amplitude: 1, decay: 0.95 },
    { frequency: fundamental + COMPLETION_BOWL_BEATING_HZ, amplitude: 0.32, decay: 1.05 },
    { frequency: fundamental * 2.72, amplitude: 0.1, decay: 0.62 },
    { frequency: fundamental * 5.1, amplitude: 0.02, decay: 0.42 },
  ];
}

function smoothFade(progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return clamped * clamped * (3 - 2 * clamped);
}

export function renderCompletionBowl(sampleRate: number): Float32Array {
  if (!Number.isFinite(sampleRate) || sampleRate < 8000) throw new RangeError('Invalid audio sample rate');
  const samples = new Float32Array(Math.ceil(sampleRate * COMPLETION_BOWL_DURATION));
  const partials = completionBowlPartials();
  const count = partials.length;

  // 표본마다 sin/exp를 호출하면 폰에서 낭독 시작 탭이 200ms 넘게 멈춘다.
  // 각 배음의 사인은 점화식(s[n+1] = 2cos(w)s[n] - s[n-1])으로, 감쇠·어택은 표본당 곱셈으로 굴린다.
  const twoCosines = new Float64Array(count);
  const current = new Float64Array(count);
  const previous = new Float64Array(count);
  const levels = new Float64Array(count);
  const decayPerSample = new Float64Array(count);
  for (let index = 0; index < count; index++) {
    const omega = (2 * Math.PI * partials[index].frequency) / sampleRate;
    twoCosines[index] = 2 * Math.cos(omega);
    previous[index] = -Math.sin(omega);
    current[index] = 0;
    levels[index] = partials[index].amplitude;
    decayPerSample[index] = Math.exp(-1 / (partials[index].decay * sampleRate));
  }

  const attackDecayPerSample = Math.exp(-1 / (COMPLETION_BOWL_ATTACK_TAU * sampleRate));
  let attackDelay = 1;
  const tailStartIndex = Math.floor((COMPLETION_BOWL_DURATION - COMPLETION_BOWL_TAIL) * sampleRate);
  const tailLengthSamples = Math.max(1, Math.round(COMPLETION_BOWL_TAIL * sampleRate));

  let peak = 0;
  for (let index = 0; index < samples.length; index++) {
    let value = 0;
    for (let partial = 0; partial < count; partial++) {
      value += levels[partial] * current[partial];
      const next = twoCosines[partial] * current[partial] - previous[partial];
      previous[partial] = current[partial];
      current[partial] = next;
      levels[partial] *= decayPerSample[partial];
    }
    const attack = 1 - attackDelay;
    attackDelay *= attackDecayPerSample;
    const tail = index <= tailStartIndex
      ? 1
      : 1 - smoothFade((index - tailStartIndex) / tailLengthSamples);
    value *= attack * tail;
    samples[index] = value;
    if (Math.abs(value) > peak) peak = Math.abs(value);
  }

  const normalization = COMPLETION_BOWL_PEAK / Math.max(peak, 0.0001);
  for (let index = 0; index < samples.length; index++) samples[index] *= normalization;
  return samples;
}

const buffers = new WeakMap<BaseAudioContext, AudioBuffer>();

function getCompletionBowlBuffer(context: BaseAudioContext): AudioBuffer {
  let buffer = buffers.get(context);
  if (!buffer) {
    const samples = renderCompletionBowl(context.sampleRate);
    buffer = context.createBuffer(1, samples.length, context.sampleRate);
    buffer.getChannelData(0).set(samples);
    buffers.set(context, buffer);
  }
  return buffer;
}

/** TTS 낭독이 시작될 때 미리 합성해 두어 낭독이 끝나는 순간 지연 없이 울리게 한다. */
export function preloadCompletionBowl(context: BaseAudioContext): void {
  getCompletionBowlBuffer(context);
}

/** 낭독이 끝난 뒤 싱잉볼을 한 번 울린다 — 외부 음악·오디오 세션은 건드리지 않는다. */
export function playCompletionBowl(context: AudioContext, destination: AudioNode, volume = 1): void {
  if (context.state === 'closed') return;
  const buffer = getCompletionBowlBuffer(context);
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = Math.max(0, Math.min(1.5, Number.isFinite(volume) ? volume : 1));
  source.buffer = buffer;
  source.connect(gain);
  gain.connect(destination);
  source.onended = () => { source.disconnect(); gain.disconnect(); };
  source.start();
}
