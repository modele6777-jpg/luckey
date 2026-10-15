import { getSharedAudioContext } from '@/lib/audio';
import { normalizeTextForSpeech } from '@/utils/tts';

interface DecodedDocentAudio {
  buffer: AudioBuffer;
}

const bufferCache = new Map<string, Promise<DecodedDocentAudio | null>>();
let activeDocentSource: AudioBufferSourceNode | null = null;
let currentDocentGen = 0;

export function getDocentCacheKey(text: string, voice = 'Kore'): string {
  return `${voice}_${normalizeTextForSpeech(text)}`;
}

export function prefetchDocentBuffer(text: string, voice = 'Kore'): Promise<DecodedDocentAudio | null> {
  const clean = normalizeTextForSpeech(text);
  if (!clean) return Promise.resolve(null);

  const key = getDocentCacheKey(text, voice);
  if (bufferCache.has(key)) {
    return bufferCache.get(key)!;
  }

  const promise = (async (): Promise<DecodedDocentAudio | null> => {
    try {
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean, voice, emotion: '차분' }),
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

      const buffer = await audioCtx.decodeAudioData(bytes.buffer.slice(0));
      return { buffer };
    } catch (e) {
      console.warn('[DocentAudioEngine] Prefetch decode error:', e);
      return null;
    }
  })();

  bufferCache.set(key, promise);
  return promise;
}

export function prefetchAllDocentChunks(chunks: string[], voice = 'Kore'): void {
  chunks.forEach((chunk) => {
    if (chunk?.trim()) {
      void prefetchDocentBuffer(chunk, voice);
    }
  });
}

export function stopDocentAudio(): void {
  currentDocentGen++;
  if (activeDocentSource) {
    try {
      activeDocentSource.stop();
      activeDocentSource.disconnect();
    } catch {
      // ignore
    }
    activeDocentSource = null;
  }
}

export async function playDocentBuffer(text: string, voice = 'Kore'): Promise<void> {
  stopDocentAudio();
  const thisGen = currentDocentGen;
  const clean = normalizeTextForSpeech(text);
  if (!clean) return;

  const prefetchPromise = prefetchDocentBuffer(text, voice);
  const audioData = await prefetchPromise;
  if (!audioData?.buffer || thisGen !== currentDocentGen) {
    return;
  }

  const audioCtx = getSharedAudioContext();
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
  if (thisGen !== currentDocentGen) return;

  const source = audioCtx.createBufferSource();
  source.buffer = audioData.buffer;
  source.connect(audioCtx.destination);
  activeDocentSource = source;

  return new Promise<void>((resolve) => {
    source.onended = () => {
      if (activeDocentSource === source) {
        activeDocentSource = null;
      }
      resolve();
    };
    source.start(0);
  });
}
