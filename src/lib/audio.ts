import { acquireScreenWakeLock, releaseScreenWakeLock } from './wakeLock';

let sharedAudioCtx: AudioContext | null = null;
let masterBusInput: GainNode | null = null;
let masterBusLimiter: DynamicsCompressorNode | null = null;
let ambientBusInput: GainNode | null = null;
let activePCMSource: AudioBufferSourceNode | null = null;
let currentPlaybackId = 0;

function ensureMasterChain(ctx: AudioContext) {
  if (masterBusInput && masterBusLimiter && masterBusInput.context === ctx) return;

  masterBusInput = ctx.createGain();
  masterBusLimiter = ctx.createDynamicsCompressor();
  masterBusLimiter.threshold.setValueAtTime(-18, ctx.currentTime);
  masterBusLimiter.knee.setValueAtTime(12, ctx.currentTime);
  masterBusLimiter.ratio.setValueAtTime(2.5, ctx.currentTime);
  masterBusLimiter.attack.setValueAtTime(0.005, ctx.currentTime);
  masterBusLimiter.release.setValueAtTime(0.15, ctx.currentTime);
  masterBusInput.gain.setValueAtTime(1.0, ctx.currentTime);
  masterBusInput.connect(masterBusLimiter);
  masterBusLimiter.connect(ctx.destination);
}

/**
 * Utility to get or create a shared AudioContext singleton.
 * Call this during user interactions to ensure it's in a running state.
 */
export function getSharedAudioContext(): AudioContext {
  if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined' && typeof (window as any).webkitAudioContext === 'undefined') {
    throw new Error('AudioContext is only available in a browser with Web Audio support');
  }

  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    try {
      sharedAudioCtx = new AudioContextClass({ latencyHint: 'playback' });
    } catch {
      // Older Safari versions may not accept constructor options.
      sharedAudioCtx = new AudioContextClass();
    }
    ensureMasterChain(sharedAudioCtx);
  }

  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(err => console.warn("[Audio] Failed to resume shared AudioContext:", err));
  }

  return sharedAudioCtx;
}

/** BgMusicPlayer master gain multiplier (user slider × this value). */
export const AMBIENT_MASTER_GAIN_SCALE = 1.6;

/** HTML5 audio element gain when routed through Web Audio (calibrated & normalized to match procedural ambient loudness). */
export const BGM_HTML_GAIN_SCALE = 0.40;

const AMBIENT_BUS_IDLE_GAIN = 1.0;

let ambientNormalizerCompressor: DynamicsCompressorNode | null = null;
let ambientNormalizerMakeup: GainNode | null = null;
let ambientNormalizerLimiter: DynamicsCompressorNode | null = null;
let ambientAnalyserNode: AnalyserNode | null = null;

function ensureAmbientChain(ctx: AudioContext) {
  ensureMasterChain(ctx);
  if (ambientBusInput && ambientBusInput.context === ctx) return;

  ambientBusInput = ctx.createGain();
  ambientBusInput.gain.setValueAtTime(AMBIENT_BUS_IDLE_GAIN, ctx.currentTime);

  // Analyser node tapped directly into the ambient bus (captures all 30 BGM tracks)
  try {
    ambientAnalyserNode = ctx.createAnalyser();
    ambientAnalyserNode.fftSize = 256;
    ambientAnalyserNode.smoothingTimeConstant = 0.82;
    ambientBusInput.connect(ambientAnalyserNode);
  } catch (err) {
    console.warn("[Audio] Could not create ambientAnalyserNode:", err);
  }

  // Stage 1: Transparent Dynamic Range Leveler / RMS Compressor (EBU R128 ambient leveling)
  ambientNormalizerCompressor = ctx.createDynamicsCompressor();
  ambientNormalizerCompressor.threshold.setValueAtTime(-22, ctx.currentTime);
  ambientNormalizerCompressor.knee.setValueAtTime(14, ctx.currentTime);
  ambientNormalizerCompressor.ratio.setValueAtTime(3.5, ctx.currentTime);
  ambientNormalizerCompressor.attack.setValueAtTime(0.012, ctx.currentTime);
  ambientNormalizerCompressor.release.setValueAtTime(0.25, ctx.currentTime);

  // Stage 2: Transparent Makeup Gain
  ambientNormalizerMakeup = ctx.createGain();
  ambientNormalizerMakeup.gain.setValueAtTime(1.18, ctx.currentTime);

  // Stage 3: Peak Safety Limiter (transparent ceiling preventing audio clipping / sudden bursts)
  ambientNormalizerLimiter = ctx.createDynamicsCompressor();
  ambientNormalizerLimiter.threshold.setValueAtTime(-4, ctx.currentTime);
  ambientNormalizerLimiter.knee.setValueAtTime(4, ctx.currentTime);
  ambientNormalizerLimiter.ratio.setValueAtTime(12, ctx.currentTime);
  ambientNormalizerLimiter.attack.setValueAtTime(0.003, ctx.currentTime);
  ambientNormalizerLimiter.release.setValueAtTime(0.08, ctx.currentTime);

  // Routing: ambientBusInput -> RMS Compressor -> Makeup Gain -> Limiter -> masterBusInput
  ambientBusInput.connect(ambientNormalizerCompressor);
  ambientNormalizerCompressor.connect(ambientNormalizerMakeup);
  ambientNormalizerMakeup.connect(ambientNormalizerLimiter);
  ambientNormalizerLimiter.connect(masterBusInput!);
}

export function getMasterAudioBus(): GainNode {
  const ctx = getSharedAudioContext();
  ensureMasterChain(ctx);
  return masterBusInput!;
}

export function getAmbientAudioBus(): GainNode {
  const ctx = getSharedAudioContext();
  ensureAmbientChain(ctx);
  return ambientBusInput!;
}

/**
 * Returns the shared AnalyserNode for background music frequency analysis.
 * Tapped into ambientBusInput so it captures all 30 procedural tracks and HTML audio.
 */
export function getAmbientAnalyserNode(): AnalyserNode | null {
  try {
    if (typeof window === 'undefined') return null;
    const ctx = getSharedAudioContext();
    ensureAmbientChain(ctx);
    if (!ambientAnalyserNode || ambientAnalyserNode.context !== ctx) {
      ambientAnalyserNode = ctx.createAnalyser();
      ambientAnalyserNode.fftSize = 256;
      ambientAnalyserNode.smoothingTimeConstant = 0.82;
      ambientBusInput?.connect(ambientAnalyserNode);
    }
    return ambientAnalyserNode;
  } catch (err) {
    console.warn("[Audio] Failed to get ambient AnalyserNode:", err);
    return null;
  }
}

let isAmbientDucked = false;

/**
 * Smoothly ducks the ambient background music bus to 25% volume during TTS speech
 * and gently restores it to 100% when speech concludes.
 */
export function duckAmbientAudio(duck: boolean, durationSec: number = 0.35): void {
  try {
    if (typeof window === 'undefined') return;
    const ctx = getSharedAudioContext();
    const bus = getAmbientAudioBus();
    const now = ctx.currentTime;

    const targetGain = duck ? 0.25 : 1.0;
    isAmbientDucked = duck;

    bus.gain.cancelScheduledValues(now);
    bus.gain.setValueAtTime(bus.gain.value, now);
    bus.gain.linearRampToValueAtTime(targetGain, now + Math.max(0.1, durationSec));

    window.dispatchEvent(new CustomEvent('prism-audio-duck', { detail: { duck, targetGain } }));
  } catch (err) {
    // Non-critical audio warning
  }
}

export function isAmbientAudioDucked(): boolean {
  return isAmbientDucked;
}

export type NoiseColor = 'white' | 'pink' | 'brown';

export function createSeamlessNoiseBuffer(
  ctx: AudioContext,
  type: NoiseColor,
  seconds: number = 8,
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const bufferSize = Math.floor(sampleRate * seconds);
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  if (type === 'white') {
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.055;
      b6 = white * 0.115926;
    }
  } else {
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.015 * white) / 1.015;
      lastOut = data[i];
      data[i] *= 2.8;
    }
  }

  const fadeSamples = Math.floor(sampleRate * 0.35);
  for (let i = 0; i < fadeSamples; i++) {
    const alpha = i / fadeSamples;
    const fadeCurve = alpha * alpha * (3 - 2 * alpha);
    data[i] = data[i] * fadeCurve + data[bufferSize - fadeSamples + i] * (1 - fadeCurve);
  }

  return buffer;
}

export function createLoopingNoiseSource(
  ctx: AudioContext,
  type: NoiseColor,
  seconds: number = 8,
): AudioBufferSourceNode {
  const source = ctx.createBufferSource();
  source.buffer = createSeamlessNoiseBuffer(ctx, type, seconds);
  source.loop = true;
  return source;
}

export function detectAudioFormat(bytes: Uint8Array): 'mp3' | 'wav' | 'ogg' | 'pcm' {
  if (!bytes || bytes.length < 4) return 'pcm';

  // WAV: 'RIFF' .... 'WAVE'
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    return 'wav';
  }
  // MP3: 'ID3' header
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    return 'mp3';
  }
  // MP3: Frame sync (11 consecutive 1s: 0xFF followed by 0xEx/0xFx)
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) {
    return 'mp3';
  }
  // OGG: 'OggS'
  if (bytes[0] === 0x4f && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) {
    return 'ogg';
  }
  // FLAC: 'fLaC'
  if (bytes[0] === 0x66 && bytes[1] === 0x4c && bytes[2] === 0x61 && bytes[3] === 0x43) {
    return 'wav';
  }

  return 'pcm';
}

/**
 * Physically stops any currently playing raw PCM source.
 */
export function stopRawPCM() {
  currentPlaybackId++;
  if (activePCMSource) {
    try {
      activePCMSource.stop();
    } catch (e) {
      // already stopped or not started
    }
    activePCMSource = null;
  }
}

/**
 * Utility to play raw PCM 16-bit audio data at a specific sample rate.
 */
export async function playRawPCM(base64: string, sampleRate: number = 24000): Promise<void> {
  try {
    // Stop any existing PCM playback first
    stopRawPCM();
    const activePlaybackId = currentPlaybackId;

    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Auto-detect if caller passed encoded MP3/WAV/OGG instead of raw PCM to prevent screeching noise
    const detectedFormat = detectAudioFormat(bytes);
    if (detectedFormat !== 'pcm') {
      return playCompressedAudio(base64);
    }

    // Convert raw PCM 16-bit (little-endian) to float32 safely
    const int16Array = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    // Use shared AudioContext to prevent autoplay restriction issues in async callbacks
    const audioCtx = getSharedAudioContext();
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    
    if (activePlaybackId !== currentPlaybackId) {
      return; // Aborted
    }
    
    const audioBuffer = audioCtx.createBuffer(1, float32Array.length, sampleRate);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    
    activePCMSource = source;
    
    return new Promise((resolve) => {
      let settled = false;
      const onEnded = () => {
        if (settled) return;
        settled = true;
        if (activePCMSource === source) {
          activePCMSource = null;
        }
        resolve();
      };
      source.onended = onEnded;

      // Safety timeout: If browser drops onended event, resolve cleanly after buffer duration
      const durationMs = ((float32Array.length / sampleRate) * 1000) + 250;
      setTimeout(() => {
        if (!settled) {
          onEnded();
        }
      }, durationMs);

      source.start();
    });
  } catch (error) {
    console.error('[AudioPlayer] Failed to play PCM:', error);
    throw error;
  }
}

export async function safeDecodeAudioData(
  audioCtx: AudioContext,
  arrayBuffer: ArrayBuffer
): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const onSuccess = (decoded: AudioBuffer) => {
      if (settled) return;
      settled = true;
      resolve(decoded);
    };
    const onError = (err: any) => {
      if (settled) return;
      settled = true;
      reject(err || new Error('decodeAudioData failed'));
    };

    try {
      const promise = audioCtx.decodeAudioData(arrayBuffer, onSuccess, onError);
      if (promise && typeof promise.then === 'function') {
        promise.then(onSuccess).catch(onError);
      }
    } catch (e) {
      onError(e);
    }
  });
}

/**
 * Utility to play base64 compressed audio (e.g. mp3) using the shared AudioContext.
 * This is 100% immune to browser autoplay restrictions that block HTMLAudioElement
 * when played asynchronously after a fetch request.
 */
export async function playCompressedAudio(base64: string, playbackRate: number = 1.0): Promise<void> {
  try {
    // Stop any existing raw PCM source
    stopRawPCM();
    const activePlaybackId = ++currentPlaybackId;

    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const detectedFormat = detectAudioFormat(bytes);
    if (detectedFormat === 'pcm') {
      return playRawPCM(base64, 24000);
    }

    const audioCtx = getSharedAudioContext();
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    if (activePlaybackId !== currentPlaybackId) {
      return; // Aborted
    }

    // Decode the compressed audio (mp3/aac/etc) ArrayBuffer
    const decodedBuffer = await safeDecodeAudioData(audioCtx, bytes.buffer.slice(0));

    if (activePlaybackId !== currentPlaybackId) {
      return; // Aborted
    }

    const source = audioCtx.createBufferSource();
    source.buffer = decodedBuffer;
    // 🌟 모든 오디오 재생을 1.0 배속 표준 속도로 영구 고정
    try {
      source.playbackRate.value = 1.0;
    } catch (_) {}

    const masterBus = getMasterAudioBus();
    source.connect(masterBus);

    activePCMSource = source;

    return new Promise((resolve) => {
      let settled = false;
      const onEnded = () => {
        if (settled) return;
        settled = true;
        if (activePCMSource === source) {
          activePCMSource = null;
        }
        resolve();
      };
      source.onended = onEnded;

      // Safety timeout: If browser drops onended event, resolve cleanly after buffer duration
      const durationMs = ((decodedBuffer.duration || 1) * 1000) + 250;
      setTimeout(() => {
        if (!settled) {
          onEnded();
        }
      }, durationMs);

      source.start(0);
    });
  } catch (error) {
    console.error('[AudioPlayer] Failed to play compressed audio:', error);
    throw error;
  }
}

// --- TTS HTML5 Audio (continues when screen is locked / app backgrounded) ---

const SILENT_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA=';

let ttsAudioEl: HTMLAudioElement | null = null;
let ttsBlobUrl: string | null = null;
let ttsPlaybackId = 0;
let ttsShouldBePlaying = false;
let ttsKeepAliveEl: HTMLAudioElement | null = null;

function revokeTTSBlobUrl() {
  if (ttsBlobUrl) {
    URL.revokeObjectURL(ttsBlobUrl);
    ttsBlobUrl = null;
  }
}

function writeAscii(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}

function pcm16ToWavBlob(bytes: Uint8Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = bytes.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeAscii(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, 'WAVE');
  writeAscii(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeAscii(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  new Uint8Array(buffer, 44).set(bytes);

  return new Blob([buffer], { type: 'audio/wav' });
}

function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function startTTSKeepAlive() {
  if (typeof window === 'undefined') return;
  try {
    if (!ttsKeepAliveEl) {
      ttsKeepAliveEl = new Audio(SILENT_WAV_DATA_URI);
      ttsKeepAliveEl.loop = true;
      ttsKeepAliveEl.volume = 0.001;
      ttsKeepAliveEl.setAttribute('playsinline', 'true');
      ttsKeepAliveEl.setAttribute('webkit-playsinline', 'true');
    }
    configurePlaybackAudioSession();
    if (ttsKeepAliveEl.paused) {
      ttsKeepAliveEl.play().catch(() => {});
    }
  } catch {
    // best-effort iOS background keep-alive
  }
}

function stopTTSKeepAlive() {
  if (!ttsKeepAliveEl) return;
  try {
    ttsKeepAliveEl.pause();
    ttsKeepAliveEl.currentTime = 0;
  } catch {
    // ignore
  }
}

export function configureAmbientAudioSession(): void {
  if (typeof navigator !== 'undefined' && 'audioSession' in navigator) {
    try {
      (navigator as any).audioSession.type = 'ambient';
    } catch (_) {}
  }
}

export function configurePlaybackAudioSession(): void {
  if (typeof navigator !== 'undefined' && 'audioSession' in navigator) {
    try {
      (navigator as any).audioSession.type = 'playback';
    } catch (_) {}
  }
}

export function getTTSAudioElement(): HTMLAudioElement {
  if (typeof window === 'undefined') {
    throw new Error('HTMLAudioElement is only available in the browser');
  }
  if (!ttsAudioEl) {
    ttsAudioEl = new Audio();
    ttsAudioEl.preload = 'auto';
    ttsAudioEl.setAttribute('playsinline', 'true');
    ttsAudioEl.setAttribute('webkit-playsinline', 'true');
    ttsAudioEl.setAttribute('x-webkit-airplay', 'allow');
  }
  configurePlaybackAudioSession();
  return ttsAudioEl;
}

  /**
   * Unlock every playback path from the same user gesture.
   * Mobile Safari and Chrome require both a running Web Audio context and a
   * media element that has successfully started during the gesture.
   */
  export function unlockAudioPlayback(): void {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = getSharedAudioContext();
      const unlockSource = audioCtx.createBufferSource();
      // A measurable 1ms silent buffer is required by iOS Safari to unlock output.
      unlockSource.buffer = audioCtx.createBuffer(1, Math.max(1, Math.ceil(audioCtx.sampleRate * 0.001)), audioCtx.sampleRate);
      unlockSource.connect(masterBusInput ?? audioCtx.destination);
      unlockSource.start(0);
      unlockSource.stop(audioCtx.currentTime + 0.001);
      const resumePromise = audioCtx.resume();
      resumePromise.catch((error) => {
        console.error('[AudioUnlock] AudioContext.resume() rejected:', error);
      });
    } catch (error) {
      console.warn('[AudioUnlock] Web Audio unlock failed:', error);
    }
  }

  /** Call synchronously during a user gesture before async TTS fetch. */
  export function primeTTSAudioElement(): void {
  if (typeof window === 'undefined') return;
  try {
    // Mobile Safari/Chrome only unlocks Web Audio when a source is started
    // synchronously from the user's tap. Resuming alone is not sufficient.
    const audioCtx = getSharedAudioContext();
    const unlockSource = audioCtx.createBufferSource();
    unlockSource.buffer = audioCtx.createBuffer(1, Math.max(1, Math.ceil(audioCtx.sampleRate * 0.001)), audioCtx.sampleRate);
    unlockSource.connect(audioCtx.destination);
    unlockSource.start(0);
    unlockSource.stop(audioCtx.currentTime + 0.001);
    audioCtx.resume().catch((error) => {
      console.error('[AudioUnlock] TTS AudioContext.resume() rejected:', error);
    });

    const audio = getTTSAudioElement();
    if (!audio.src || audio.src === window.location.href) {
      // Keep the same media element playing a silent loop until the async TTS
      // request finishes. Mobile Safari/Chrome may revoke the autoplay grant
      // when the priming element is immediately paused after the tap.
      audio.src = SILENT_WAV_DATA_URI;
      audio.loop = true;
      audio.volume = 0.001;
      audio.play().catch(() => {});
    }
  } catch {
    // ignore priming failures
  }
}

let ttsUserExplicitlyPaused = false;

export function isTTSAudioPlaying(): boolean {
  return ttsShouldBePlaying && !ttsUserExplicitlyPaused && !!ttsAudioEl && !ttsAudioEl.paused && !ttsAudioEl.ended;
}

export function pauseTTSAudio(): void {
  ttsUserExplicitlyPaused = true;
  stopTTSKeepAlive();
  releaseScreenWakeLock().catch(() => {});
  if (ttsAudioEl && !ttsAudioEl.paused) {
    try {
      ttsAudioEl.pause();
    } catch {
      // ignore
    }
  }
  try {
    const ctx = getSharedAudioContext();
    if (ctx.state === 'running') {
      ctx.suspend().catch(() => {});
    }
  } catch {}
}

export function resumeTTSAudio(): void {
  ttsUserExplicitlyPaused = false;
  ttsShouldBePlaying = true;
  try {
    const ctx = getSharedAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  } catch {}

  // Resume HTML5 audio if loaded
  if (ttsAudioEl && ttsAudioEl.paused && !ttsAudioEl.ended && ttsAudioEl.src) {
    startTTSKeepAlive();
    acquireScreenWakeLock().catch(() => {});
    ttsAudioEl.play().catch((err) => console.warn('[Audio] Failed to resume TTS audio:', err));
  }
}

export function stopTTSAudio(): void {
  ttsPlaybackId++;
  ttsShouldBePlaying = false;
  ttsUserExplicitlyPaused = false;
  stopTTSKeepAlive();
  releaseScreenWakeLock().catch(() => {});
  revokeTTSBlobUrl();

  if (ttsAudioEl) {
    try {
      ttsAudioEl.pause();
      ttsAudioEl.currentTime = 0;
      ttsAudioEl.playbackRate = 1.0;
      ttsAudioEl.removeAttribute('src');
      ttsAudioEl.load();
    } catch {
      // ignore
    }
  }
  configureAmbientAudioSession();
}

/** Stops both HTML5 TTS playback and legacy Web Audio TTS sources. */
export function stopTTSPlayback(): void {
  stopTTSAudio();
  stopRawPCM();
  releaseScreenWakeLock().catch(() => {});
}

export type TTSEmotionType =
  | 'joy'        // 기쁨, 축하, 설렘, 활기
  | 'calm'       // 평온, 안식, 이완, 치유
  | 'meditation' // 명상, 60초 호흡, 방하착, 깊은 이완
  | 'emphasis'   // 강조, 결의, 확신, 통찰
  | 'sadness'    // 슬픔, 위로, 애도, 비움
  | 'mystic'     // 신비, 오라클, 우주, 영혼
  | 'vitality'   // 생체활력, 역동, 에너지
  | 'neutral';   // 기본, 중립

export interface TTSEmotionProfile {
  emotion: TTSEmotionType;
  playbackRate: number;      // 0.92 ~ 1.06 (Web Speech / HTMLAudio multiplier)
  rateStr: string;           // Edge TTS rate string (e.g. "-8%", "+5%", "+0%")
  pitchStr: string;          // Edge TTS pitch string (e.g. "-1.8Hz", "+1.5Hz", "+0Hz")
  detune: number;            // Cents (-1200 ~ +1200)
  pitchHzOffset: number;     // Pitch Hz offset
  pitchMultiplier: number;   // Web Speech API utterance.pitch (0.95 ~ 1.06)
  preservesPitch: boolean;   // HTMLAudio preservesPitch
  label: string;
}

export const TTS_EMOTION_PROFILES: Record<TTSEmotionType, TTSEmotionProfile> = {
  joy: {
    emotion: 'joy',
    playbackRate: 1.05,
    rateStr: '+5%',
    pitchStr: '+1.5Hz',
    detune: 60,
    pitchHzOffset: 1.5,
    pitchMultiplier: 1.05,
    preservesPitch: true,
    label: '기쁨과 환희',
  },
  calm: {
    emotion: 'calm',
    playbackRate: 0.95,
    rateStr: '-5%',
    pitchStr: '-1.0Hz',
    detune: -40,
    pitchHzOffset: -1.0,
    pitchMultiplier: 0.97,
    preservesPitch: true,
    label: '평온과 안식',
  },
  meditation: {
    emotion: 'meditation',
    playbackRate: 0.92,
    rateStr: '-8%',
    pitchStr: '-1.8Hz',
    detune: -70,
    pitchHzOffset: -1.8,
    pitchMultiplier: 0.95,
    preservesPitch: true,
    label: '명상과 호흡 치유',
  },
  emphasis: {
    emotion: 'emphasis',
    playbackRate: 0.97,
    rateStr: '-3%',
    pitchStr: '-0.6Hz',
    detune: -25,
    pitchHzOffset: -0.6,
    pitchMultiplier: 0.98,
    preservesPitch: true,
    label: '강조와 확신',
  },
  sadness: {
    emotion: 'sadness',
    playbackRate: 0.94,
    rateStr: '-6%',
    pitchStr: '-1.5Hz',
    detune: -60,
    pitchHzOffset: -1.5,
    pitchMultiplier: 0.96,
    preservesPitch: true,
    label: '슬픔과 위로',
  },
  mystic: {
    emotion: 'mystic',
    playbackRate: 0.95,
    rateStr: '-5%',
    pitchStr: '+0.5Hz',
    detune: 20,
    pitchHzOffset: 0.5,
    pitchMultiplier: 1.02,
    preservesPitch: true,
    label: '신비와 오라클',
  },
  vitality: {
    emotion: 'vitality',
    playbackRate: 1.06,
    rateStr: '+6%',
    pitchStr: '+1.8Hz',
    detune: 70,
    pitchHzOffset: 1.8,
    pitchMultiplier: 1.06,
    preservesPitch: true,
    label: '활력과 생기',
  },
  neutral: {
    emotion: 'neutral',
    playbackRate: 1.00,
    rateStr: '+0%',
    pitchStr: '+0Hz',
    detune: 0,
    pitchHzOffset: 0,
    pitchMultiplier: 1.00,
    preservesPitch: true,
    label: '자연스러운 기본',
  },
};

/**
 * Analyzes text semantics or explicit emotion tags to determine speed (rate) and pitch adjustments.
 * Prioritizes explicit tags [EMOTION:...] or explicitEmotion argument, then runs semantic keyword scoring.
 */
export function analyzeTextEmotion(text: string, explicitEmotion?: string): TTSEmotionProfile {
  let declared = explicitEmotion ? explicitEmotion.trim() : '';
  if (!declared && text && typeof text === 'string') {
    const match = text.match(/\[EMOTION:\s*([^\]]+)\]/i);
    if (match) {
      declared = match[1].trim();
    }
  }

  if (declared) {
    const norm = declared.toLowerCase();
    if (
      norm.includes('meditation') ||
      norm.includes('명상') ||
      norm.includes('호흡') ||
      norm.includes('들숨') ||
      norm.includes('날숨') ||
      norm.includes('방하착') ||
      norm.includes('1분') ||
      norm.includes('이완') ||
      norm.includes('마인드풀') ||
      norm.includes('zen')
    ) {
      return TTS_EMOTION_PROFILES.meditation;
    }
    if (
      norm.includes('joy') ||
      norm.includes('기쁨') ||
      norm.includes('환희') ||
      norm.includes('행복') ||
      norm.includes('축하') ||
      norm.includes('설렘') ||
      norm.includes('happy') ||
      norm.includes('축복') ||
      norm.includes('대박')
    ) {
      return TTS_EMOTION_PROFILES.joy;
    }
    if (
      norm.includes('calm') ||
      norm.includes('평온') ||
      norm.includes('안식') ||
      norm.includes('치유') ||
      norm.includes('위로') ||
      norm.includes('다정') ||
      norm.includes('따뜻') ||
      norm.includes('peace') ||
      norm.includes('relax') ||
      norm.includes('쉼')
    ) {
      return TTS_EMOTION_PROFILES.calm;
    }
    if (
      norm.includes('emphasis') ||
      norm.includes('강조') ||
      norm.includes('확신') ||
      norm.includes('결단') ||
      norm.includes('focus') ||
      norm.includes('insight') ||
      norm.includes('통찰') ||
      norm.includes('중요') ||
      norm.includes('결의')
    ) {
      return TTS_EMOTION_PROFILES.emphasis;
    }
    if (
      norm.includes('sad') ||
      norm.includes('슬픔') ||
      norm.includes('위로') ||
      norm.includes('비움') ||
      norm.includes('애도') ||
      norm.includes('아픔') ||
      norm.includes('눈물') ||
      norm.includes('grief')
    ) {
      return TTS_EMOTION_PROFILES.sadness;
    }
    if (
      norm.includes('mystic') ||
      norm.includes('신비') ||
      norm.includes('오라클') ||
      norm.includes('우주') ||
      norm.includes('oracle') ||
      norm.includes('tarot') ||
      norm.includes('타로') ||
      norm.includes('별자리') ||
      norm.includes('운명')
    ) {
      return TTS_EMOTION_PROFILES.mystic;
    }
    if (
      norm.includes('vitality') ||
      norm.includes('활력') ||
      norm.includes('생기') ||
      norm.includes('에너지') ||
      norm.includes('energy') ||
      norm.includes('역동') ||
      norm.includes('생체')
    ) {
      return TTS_EMOTION_PROFILES.vitality;
    }
    if (norm in TTS_EMOTION_PROFILES) {
      return TTS_EMOTION_PROFILES[norm as TTSEmotionType];
    }
  }

  if (!text || typeof text !== 'string') {
    return TTS_EMOTION_PROFILES.neutral;
  }

  const clean = text.replace(/\[[^\]]*\]/g, ' ').toLowerCase();

  let meditationScore = 0;
  let joyScore = 0;
  let calmScore = 0;
  let emphasisScore = 0;
  let sadnessScore = 0;
  let mysticScore = 0;
  let vitalityScore = 0;

  const meditationKeywords = ['명상', '호흡', '들숨', '날숨', '방하착', '숨결', '숨을', '들이쉬', '내쉬', '단전', '차크라', '정좌', '좌선', '1분 명상', '마인드 리셋'];
  const joyKeywords = ['기쁨', '행복', '환희', '축하', '설렘', '즐거', '반가', '웃음', '신나', '빛나', '희망', '감사', '사랑', '대단', '좋아', '멋진', '축복', '환대', '대박', '화이팅'];
  const calmKeywords = ['평온', '안식', '이완', '고요', '쉼', '휴식', '편안', '잠시', '부드럽', '따뜻', '차분', '비우', '흘러', '정화', '다정', '안아', '안정', '느슨', '온기'];
  const emphasisKeywords = ['중요', '반드시', '기억', '확신', '결단', '핵심', '명심', '결코', '도전', '의지', '성공', '달성', '도약', '강력', '성찰', '통찰', '진실', '분명', '결정', '주의사항', '경고'];
  const sadnessKeywords = ['슬픔', '눈물', '아픔', '상처', '외로', '지친', '힘든', '버거운', '애도', '위로', '고단', '그리움', '상실', '괴로', '아쉽'];
  const mysticKeywords = ['운명', '우주', '오라클', '타로', '별자리', '영혼', '직관', '신비', '차원', '공명', '시공간', '비밀', '흐름', '성좌', '수호', '카르마'];
  const vitalityKeywords = ['활력', '에너지', '생기', '생체', '역동', '운동', '스트레칭', '파워', '깨어나', '시작', '실행', '리듬', '생명', '건강', '기운차'];

  meditationKeywords.forEach(k => { if (clean.includes(k)) meditationScore += 2; });
  joyKeywords.forEach(k => { if (clean.includes(k)) joyScore++; });
  calmKeywords.forEach(k => { if (clean.includes(k)) calmScore++; });
  emphasisKeywords.forEach(k => { if (clean.includes(k)) emphasisScore++; });
  sadnessKeywords.forEach(k => { if (clean.includes(k)) sadnessScore++; });
  mysticKeywords.forEach(k => { if (clean.includes(k)) mysticScore++; });
  vitalityKeywords.forEach(k => { if (clean.includes(k)) vitalityScore++; });

  if (text.includes('!')) {
    joyScore += 0.5;
    vitalityScore += 0.5;
    emphasisScore += 0.5;
  }
  if (text.includes('?') || text.includes('~')) {
    mysticScore += 0.3;
    calmScore += 0.3;
  }
  if (text.includes('...') || text.includes('…')) {
    calmScore += 0.3;
    sadnessScore += 0.3;
  }

  const scores = [
    { type: 'meditation' as TTSEmotionType, score: meditationScore },
    { type: 'joy' as TTSEmotionType, score: joyScore },
    { type: 'calm' as TTSEmotionType, score: calmScore },
    { type: 'emphasis' as TTSEmotionType, score: emphasisScore },
    { type: 'sadness' as TTSEmotionType, score: sadnessScore },
    { type: 'mystic' as TTSEmotionType, score: mysticScore },
    { type: 'vitality' as TTSEmotionType, score: vitalityScore },
  ];

  scores.sort((a, b) => b.score - a.score);

  if (scores[0].score > 0) {
    return TTS_EMOTION_PROFILES[scores[0].type];
  }

  return TTS_EMOTION_PROFILES.neutral;
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
      navigator.userAgent
    ) ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
}

export function getEmotionProfile(emotion: string | TTSEmotionType): TTSEmotionProfile {
  return analyzeTextEmotion('', emotion);
}

export async function playTTSAudio(
  base64: string,
  encoding: string = 'mp3',
  sampleRate: number = 24000,
  emotionOrText?: string | TTSEmotionProfile,
  isSequenceChunk: boolean = false,
  playbackRateOverride?: number,
): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('TTS playback is only available in the browser');
  }

  // Pre-wake shared WebAudio context on all devices & ensure playback session for background audio continuity
  configurePlaybackAudioSession();
  try {
    const audioCtx = getSharedAudioContext();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (_) {}

  // 1. Immediately stop any currently playing speech to prevent overlap
  stopRawPCM();
  ttsPlaybackId++;
  const activePlaybackId = ttsPlaybackId;
  revokeTTSBlobUrl();

  const profile: TTSEmotionProfile =
    typeof emotionOrText === 'object' && emotionOrText !== null && 'playbackRate' in emotionOrText
      ? emotionOrText
      : analyzeTextEmotion(typeof emotionOrText === 'string' ? emotionOrText : '');

  // Acquire screen wake lock during playback to prevent screen sleep
  acquireScreenWakeLock().catch(() => {});

  const bytes = base64ToBytes(base64);
  const detectedFormat = detectAudioFormat(bytes);
  const isCompressed = detectedFormat !== 'pcm' || encoding === 'mp3';

  ttsShouldBePlaying = true;
  startTTSKeepAlive();

  // Primary playback engine: HTML5 Audio element.
  // HTMLAudioElement is standard-compliant, handles MP3 natively, and supports
  // full background audio playback when screen is locked or tab is switched (iOS & Android).
  let mimeType = 'audio/mpeg';
  if (detectedFormat === 'wav') {
    mimeType = 'audio/wav';
  } else if (detectedFormat === 'ogg') {
    mimeType = 'audio/ogg';
  }

  const blob =
    !isCompressed && encoding === 'pcm'
      ? pcm16ToWavBlob(bytes, sampleRate)
      : new Blob([bytes], { type: mimeType });

  if (activePlaybackId !== ttsPlaybackId) return;

  revokeTTSBlobUrl();
  ttsBlobUrl = URL.createObjectURL(blob);

  const audio = getTTSAudioElement();
  try {
    audio.pause();
    audio.currentTime = 0;
  } catch (_) {}
  audio.loop = false;
  audio.volume = 1;
  audio.src = ttsBlobUrl;
  try {
    audio.currentTime = 0;
  } catch (_) {}

  try {
    const targetRate = 1.0;
    audio.playbackRate = 1.0;
    audio.defaultPlaybackRate = 1.0;
    if ('preservesPitch' in audio) {
      (audio as any).preservesPitch = true;
    }
  } catch (err) {
    console.warn('[Audio] Failed to set playback rate on audio element:', err);
  }

  try {
    await new Promise<void>((resolve, reject) => {
      let isSettled = false;
      const cleanup = () => {
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('pause', onInvoluntaryPause);
      };

      const finish = () => {
        if (isSettled) return;
        isSettled = true;
        cleanup();
        if (activePlaybackId !== ttsPlaybackId) return;
        if (!isSequenceChunk) {
          ttsShouldBePlaying = false;
          stopTTSKeepAlive();
          releaseScreenWakeLock().catch(() => {});
        }
        resolve();
      };

      const onEnded = () => finish();

      const onError = (e?: any) => {
        if (isSettled) return;
        isSettled = true;
        cleanup();
        if (activePlaybackId !== ttsPlaybackId) return;
        reject(e || new Error('[AudioPlayer] HTMLAudioElement playback failed'));
      };

      // 🔔 모바일 알림(카카오톡, 문자, 캘린더 등)이나 백그라운드 오디오 인터럽트로 인한 일시정지 시 자동 복구
      const onInvoluntaryPause = () => {
        if (isSettled || !ttsShouldBePlaying || ttsUserExplicitlyPaused || activePlaybackId !== ttsPlaybackId) return;
        console.log('[AudioPlayer] External notification or system interruption detected. Scheduling auto-resume...');
        // 알림음이 끝난 직후(600ms~1200ms) 현재 위치에서 자동으로 재생 재개
        setTimeout(() => {
          if (!isSettled && ttsShouldBePlaying && !ttsUserExplicitlyPaused && activePlaybackId === ttsPlaybackId && audio.paused && !audio.ended) {
            audio.play().catch((resumeErr) => {
              console.warn('[AudioPlayer] Involuntary pause auto-resume delayed:', resumeErr);
            });
          }
        }, 700);
      };

      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);
      audio.addEventListener('pause', onInvoluntaryPause);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          onError(err);
        });
      }
    });
    return;
  } catch (htmlErr) {
    console.warn('[AudioPlayer] HTMLAudioElement playback issue, falling back to WebAudio:', htmlErr);
    if (activePlaybackId !== ttsPlaybackId) return;

    // Fallback: WebAudio decodeAudioData
    try {
      if (!isCompressed && encoding === 'pcm') {
        await playRawPCM(base64, sampleRate);
      } else {
        await playCompressedAudio(base64, 1.0);
      }
    } finally {
      if (activePlaybackId === ttsPlaybackId && !isSequenceChunk) {
        ttsShouldBePlaying = false;
        stopTTSKeepAlive();
        releaseScreenWakeLock().catch(() => {});
      }
    }
  }
}

let ttsLifecycleInitialized = false;

export function initTTSAudioLifecycle(): void {
  if (ttsLifecycleInitialized || typeof window === 'undefined') return;
  ttsLifecycleInitialized = true;
  configureAmbientAudioSession();

  const handleResume = () => {
    if (document.visibilityState === 'hidden') return;
    try {
      const ctx = getSharedAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().catch((error) => {
          console.error('[AudioLifecycle] AudioContext resume after visibility change rejected:', error);
        });
      }
    } catch (error) {
      console.error('[AudioLifecycle] Failed to restore AudioContext:', error);
    }

    // 알림 팝업 창 또는 앱 복귀 시 중단되었던 TTS 자동 재생 재개
    if (ttsShouldBePlaying && !ttsUserExplicitlyPaused && ttsAudioEl && ttsAudioEl.paused && !ttsAudioEl.ended && ttsAudioEl.src) {
      setTimeout(() => {
        if (ttsShouldBePlaying && !ttsUserExplicitlyPaused && ttsAudioEl && ttsAudioEl.paused && !ttsAudioEl.ended) {
          ttsAudioEl.play().catch((err) => console.warn('[AudioLifecycle] Interrupted TTS auto-resumed on focus:', err));
        }
      }, 350);
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      handleResume();
    }
  });
  window.addEventListener('pageshow', handleResume);
  window.addEventListener('focus', handleResume);
}

/**
 * Authentic Web Audio synthesized celestial shooting star & starlight chime sound ("슈웅~ 팅그랑✨")
 * for Wish Upon a Star (별에게 소원빌기) and starlight healing interactions.
 */
export function playStarWishSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const ctx = getSharedAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // 1. Ascending Celestial Pentatonic Star Chimes (별빛 아르페지오 팅그랑~)
    const starFrequencies = [880, 1108.73, 1318.51, 1661.22, 2217.46, 2637.02];
    starFrequencies.forEach((freq, idx) => {
      const startTime = now + idx * 0.055;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      // Subtle celestial micro-vibrato
      osc.frequency.exponentialRampToValueAtTime(freq * 1.015, startTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.35);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.18 / (1 + idx * 0.15), startTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.55 + idx * 0.08);

      // Delicate high shimmer harmonic
      const overtone = ctx.createOscillator();
      const overGain = ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, startTime);
      overGain.gain.setValueAtTime(0.0001, startTime);
      overGain.gain.linearRampToValueAtTime(0.045, startTime + 0.01);
      overGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      overtone.connect(overGain);
      overGain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.7);
      overtone.start(startTime);
      overtone.stop(startTime + 0.32);
    });

    // 2. Shooting Star Astral Shimmer Sweep (유성 비상 휘파람 "슈웅~")
    const sweepSampleRate = ctx.sampleRate;
    const sweepLength = Math.floor(sweepSampleRate * 0.45);
    const sweepBuffer = ctx.createBuffer(1, sweepLength, sweepSampleRate);
    const sweepData = sweepBuffer.getChannelData(0);
    for (let i = 0; i < sweepLength; i++) {
      const envelope = Math.sin((i / sweepLength) * Math.PI);
      sweepData[i] = (Math.random() * 2 - 1) * envelope;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = sweepBuffer;

    const sweepFilter = ctx.createBiquadFilter();
    sweepFilter.type = 'bandpass';
    sweepFilter.frequency.setValueAtTime(1400, now);
    sweepFilter.frequency.exponentialRampToValueAtTime(5200, now + 0.32);
    sweepFilter.Q.setValueAtTime(5.5, now);

    const sweepGain = ctx.createGain();
    sweepGain.gain.setValueAtTime(0.0001, now);
    sweepGain.gain.linearRampToValueAtTime(0.14, now + 0.12);
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    noiseSource.connect(sweepFilter);
    sweepFilter.connect(sweepGain);
    sweepGain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.46);

    // 3. Warm Cosmic Starlight Pad (은하수 온기 베이스 220Hz / 440Hz)
    const padOsc = ctx.createOscillator();
    const padGain = ctx.createGain();
    padOsc.type = 'sine';
    padOsc.frequency.setValueAtTime(220, now);
    padOsc.frequency.exponentialRampToValueAtTime(440, now + 0.4);

    padGain.gain.setValueAtTime(0.0001, now);
    padGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
    padGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

    padOsc.connect(padGain);
    padGain.connect(ctx.destination);

    padOsc.start(now);
    padOsc.stop(now + 0.8);
  } catch (err) {
    console.warn('[Audio] Failed to play star wish sound:', err);
  }
}

/**
 * Authentic Web Audio synthesized water droplet & splash sound ("퐁당~")
 * for the Wishing Well (소원의 우물) and water-based healing interactions.
 */
export function playWishingWellPlopSound(): void {
  // Delegate to star wish sound for new celestial experience while preserving backward compatibility
  playStarWishSound();
}

// Re-export audio haptic feedback engine
export * from './audioHaptics';
