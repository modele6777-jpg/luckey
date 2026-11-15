/**
 * TTS 완독 완료음: 옅은 2음 '띵-동' (muted two-note ding-dong)
 *
 * 기존에는 완독 직후 짧은 새 지저귐(고역 2~3.5kHz 지저귐)을 울렸으나, 그 소리가
 * 낭독이 끝난 자리에서 지나치게 맑고 쨍하게 튀어 사용자가 옅은 띵동으로 바꿔 달라고 요청했다.
 * 그래서 이 모듈은 낮은 음역의 부드러운 종소리 두 번을 아주 옅게 울린다.
 *
 *  - 음정: 첫 음 C5(523.25Hz) → 두 번째 음 G4(392Hz)로 문안하게 떨어지는 2음 띵동.
 *  - 어택: 20ms의 완만한 raised-cosine 상승으로 '딱' 소리 없이 스며들게 한다.
 *  - 감쇠: 긴 지수 감쇠(long exponential decay)와 120ms 꼬리 페이드로 잔향처럼 사라진다.
 *  - 음색: 기음 + 옅은 2·3배음만 남기고 1.7kHz 2차 저역통과로 맑은 고음 성분을 걷어낸 따뜻한 톤.
 *  - 크기: 정규화 피크 0.16 (기존 새 지저귐 0.3의 절반 남짓) — 낭독 직후에도 놀라지 않는 세기.
 *
 * 외부 음악 공존 원칙(AGENTS.md §2)은 그대로 유지한다: 오디오 세션을 바꾸지 않고
 * 이미 열려 있는 공유 컨텍스트의 haptic 버스(destination)로만 재생하므로 `ambient` 세션이 유지된다.
 */

export const COMPLETION_CHIME_DURATION = 1.0;
export const COMPLETION_CHIME_PEAK = 0.16;

interface ChimeNote {
  start: number;
  duration: number;
  frequency: number;
  amplitude: number;
}

/** 첫 음(띵)은 살짝 높고, 두 번째 음(동)은 낮게 — 두 음이 0.28초 간격으로 겹치며 문안하게 이어진다. */
export const COMPLETION_CHIME_NOTES: ChimeNote[] = [
  { start: 0, duration: 0.74, frequency: 523.25, amplitude: 1 },
  { start: 0.28, duration: 0.72, frequency: 392, amplitude: 0.8 },
];

const ATTACK_SECONDS = 0.02;
const DECAY_TIME_CONSTANT = 0.26;
const TAIL_FADE_SECONDS = 0.12;
const LOWPASS_CUTOFF_HZ = 1700;
const LOWPASS_PASSES = 2;
const FINAL_FADE_SECONDS = 0.03;

function noteEnvelope(noteTime: number, duration: number): number {
  if (noteTime < 0 || noteTime >= duration) return 0;
  const attack = noteTime < ATTACK_SECONDS ? 0.5 - 0.5 * Math.cos((Math.PI * noteTime) / ATTACK_SECONDS) : 1;
  const decay = Math.exp(-noteTime / DECAY_TIME_CONSTANT);
  const tailProgress = Math.min(1, (duration - noteTime) / TAIL_FADE_SECONDS);
  const tail = 0.5 - 0.5 * Math.cos(Math.PI * tailProgress);
  return attack * decay * tail;
}

function noteTone(note: ChimeNote, noteTime: number): number {
  const phase = 2 * Math.PI * note.frequency * noteTime;
  // 따뜻한 종소리: 기음 + 옅은 2배음 + 아주 옅은 3배음
  return Math.sin(phase) + 0.18 * Math.sin(2 * phase + 0.35) + 0.05 * Math.sin(3 * phase + 0.8);
}

/**
 * 띵동 완료음을 결정론적으로 렌더링한다(테스트/버퍼 공용).
 * 순서: 음 합성 → 저역통과(1.7kHz, 2단) → 피크 정규화(COMPLETION_CHIME_PEAK).
 */
export function renderCompletionChime(sampleRate: number): Float32Array {
  if (!Number.isFinite(sampleRate) || sampleRate < 8000) throw new RangeError('Invalid audio sample rate');
  const samples = new Float32Array(Math.ceil(sampleRate * COMPLETION_CHIME_DURATION));

  for (let index = 0; index < samples.length; index++) {
    const time = index / sampleRate;
    let value = 0;
    for (const note of COMPLETION_CHIME_NOTES) {
      const envelope = noteEnvelope(time - note.start, note.duration);
      if (envelope <= 0) continue;
      value += note.amplitude * envelope * noteTone(note, time - note.start);
    }
    samples[index] = value;
  }

  // 부드러운 1차 저역통과를 두 번 — 쨍한 고역을 지워 옅고 둥근 톤으로 만든다.
  const alpha = 1 - Math.exp((-2 * Math.PI * LOWPASS_CUTOFF_HZ) / sampleRate);
  for (let pass = 0; pass < LOWPASS_PASSES; pass++) {
    let filtered = 0;
    for (let index = 0; index < samples.length; index++) {
      filtered += alpha * (samples[index] - filtered);
      samples[index] = filtered;
    }
  }

  // 저역통과 필터의 잔여 기억이 남기지 않도록 마지막 30ms를 raised-cosine으로 정확히 0까지 닫는다.
  const fadeSamples = Math.min(samples.length, Math.ceil(sampleRate * FINAL_FADE_SECONDS));
  for (let index = samples.length - fadeSamples; index < samples.length; index++) {
    const progress = (samples.length - 1 - index) / fadeSamples;
    samples[index] *= 0.5 - 0.5 * Math.cos(Math.PI * progress);
  }
  samples[samples.length - 1] = 0;

  let peak = 0;
  for (let index = 0; index < samples.length; index++) peak = Math.max(peak, Math.abs(samples[index]));
  const normalization = COMPLETION_CHIME_PEAK / Math.max(peak, 0.0001);
  for (let index = 0; index < samples.length; index++) samples[index] *= normalization;
  return samples;
}

const buffers = new WeakMap<BaseAudioContext, AudioBuffer>();

/** 외부 음악을 잠시 멈추거나 ducking·세션 승격 없이, 공유 버스로 띵동 완료음만 한 번 울린다. */
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
