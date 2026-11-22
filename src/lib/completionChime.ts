/**
 * TTS 낭독 완료 효과음: 짧은 메시지 전송 확인음.
 *
 * 별도 MP3 자산을 재생하되, 외부 음악과 오디오 세션을 건드리지 않고
 * 이미 열린 공유 Web Audio 컨텍스트의 haptic 버스에만 연결한다.
 */
const COMPLETION_SOUND_URL = "/audio/tts-message-sent.mp3";
const buffers = new WeakMap<BaseAudioContext, Promise<AudioBuffer>>();

function loadCompletionBuffer(context: AudioContext): Promise<AudioBuffer> {
  const cached = buffers.get(context);
  if (cached) return cached;

  const pending = fetch(COMPLETION_SOUND_URL, { cache: "force-cache" })
    .then(response => {
      if (!response.ok) throw new Error(`Completion sound request failed (${response.status})`);
      return response.arrayBuffer();
    })
    .then(bytes => context.decodeAudioData(bytes));
  buffers.set(context, pending);
  pending.catch(() => {
    if (buffers.get(context) === pending) buffers.delete(context);
  });
  return pending;
}

/** Begin loading during narration so the short cue is ready before speech finishes. */
export function preloadCompletionChime(context: AudioContext): void {
  void loadCompletionBuffer(context).catch(error => {
    console.warn("[TTS] Could not preload the completion sound:", error);
  });
}

/** Play the message-send cue without changing the audio session or interrupting ambient music. */
export function playCompletionChime(context: AudioContext, destination: AudioNode, volume = 1): void {
  void loadCompletionBuffer(context).then(buffer => {
    if (context.state === "closed") return;
    const source = context.createBufferSource();
    const gain = context.createGain();
    const level = Math.max(0, Math.min(1.5, Number.isFinite(volume) ? volume : 1)) * 0.6;
    gain.gain.setValueAtTime(level, context.currentTime);
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(destination);
    source.onended = () => { source.disconnect(); gain.disconnect(); };
    source.start(context.currentTime);
  }).catch(error => {
    console.warn("[AudioHaptics] Could not play the completion sound:", error);
  });
}
