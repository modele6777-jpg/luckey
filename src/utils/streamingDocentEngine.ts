import { getSharedAudioContext } from '@/lib/audio';

const chunkAudioCache = new Map<string, Promise<AudioBuffer | null>>();
let activeSourceNode: AudioBufferSourceNode | null = null;
let currentPlaybackGeneration = 0;
let isPlaybackPaused = false;
let currentPausedOffset = 0;
let currentBufferStartTime = 0;
let currentPlayingBuffer: AudioBuffer | null = null;

export function getChunkCacheKey(text: string): string {
  return text.trim();
}

export async function fetchAndDecodeChunkAudio(text: string): Promise<AudioBuffer | null> {
  const clean = text
    .replace(/\[EMOTION:[^\]]+\]/gi, '')
    .replace(/[*_#`]/g, '')
    .trim();

  if (!clean) return null;

  const key = getChunkCacheKey(clean);
  if (chunkAudioCache.has(key)) {
    return chunkAudioCache.get(key)!;
  }

  const promise = (async (): Promise<AudioBuffer | null> => {
    try {
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean, voice: 'Kore', emotion: '차분' }),
      });

      if (!response.ok) return null;
      const data = await response.json();
      if (!data?.audioContent) return null;

      const binary = atob(data.audioContent);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const audioCtx = getSharedAudioContext();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const decoded = await audioCtx.decodeAudioData(bytes.buffer.slice(0));
      return decoded;
    } catch (err) {
      console.warn('[StreamingDocentEngine] Chunk decode error:', err);
      return null;
    }
  })();

  chunkAudioCache.set(key, promise);
  return promise;
}

export function preloadAllChunks(chunks: string[]): void {
  chunks.forEach((chunk) => {
    if (chunk?.trim()) {
      void fetchAndDecodeChunkAudio(chunk);
    }
  });
}

export function stopDocentPlayback(): void {
  currentPlaybackGeneration++;
  isPlaybackPaused = false;
  currentPausedOffset = 0;
  currentPlayingBuffer = null;

  if (activeSourceNode) {
    try {
      activeSourceNode.stop();
      activeSourceNode.disconnect();
    } catch {}
    activeSourceNode = null;
  }
}

export function pauseDocentPlayback(): void {
  isPlaybackPaused = true;
  const audioCtx = getSharedAudioContext();
  if (currentPlayingBuffer && activeSourceNode) {
    const elapsed = audioCtx.currentTime - currentBufferStartTime;
    currentPausedOffset = Math.max(0, Math.min(elapsed, currentPlayingBuffer.duration));
  }
  if (activeSourceNode) {
    try {
      activeSourceNode.stop();
      activeSourceNode.disconnect();
    } catch {}
    activeSourceNode = null;
  }
}

export function isDocentPaused(): boolean {
  return isPlaybackPaused;
}

export function getPausedOffset(): number {
  return currentPausedOffset;
}

export function resetPausedOffset(): void {
  currentPausedOffset = 0;
  isPlaybackPaused = false;
}

export async function playDocentChunkAudio(
  chunk: string,
  startOffset = 0,
): Promise<boolean> {
  const thisGen = currentPlaybackGeneration;
  const audioCtx = getSharedAudioContext();
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  const audioBuffer = await fetchAndDecodeChunkAudio(chunk);
  if (!audioBuffer || thisGen !== currentPlaybackGeneration || isPlaybackPaused) {
    return false;
  }

  if (activeSourceNode) {
    try {
      activeSourceNode.stop();
      activeSourceNode.disconnect();
    } catch {}
    activeSourceNode = null;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  activeSourceNode = source;
  currentPlayingBuffer = audioBuffer;
  currentBufferStartTime = audioCtx.currentTime - startOffset;

  return new Promise<boolean>((resolve) => {
    source.onended = () => {
      if (activeSourceNode === source) {
        activeSourceNode = null;
        currentPlayingBuffer = null;
        currentPausedOffset = 0;
      }
      if (thisGen === currentPlaybackGeneration && !isPlaybackPaused) {
        resolve(true);
      } else {
        resolve(false);
      }
    };
    source.start(0, Math.max(0, startOffset));
  });
}
