import { getSharedAudioContext } from '@/lib/audio';
import { normalizeTextForSpeech } from '@/utils/tts';
import { parseTTSAudioResponse } from '@/utils/ttsBinaryResponse';

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
        headers: { 'Content-Type': 'application/json', Accept: 'audio/wav, audio/mpeg' },
        body: JSON.stringify({ text: clean, voice, emotion: '차분', responseFormat: 'binary' }),
      });

      if (!response.ok) return null;
      // 📉 base64 JSON(+33%) 대신 원본 오디오 바이트를 바로 디코드합니다.
      const audio = await parseTTSAudioResponse(response);
      if (!audio?.bytes.length) return null;
      const bytes = audio.bytes;
      const audioCtx = getSharedAudioContext();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      // 디코더는 원본 ArrayBuffer를 소유하므로 복사본을 넘깁니다.
      const copy = new Uint8Array(bytes.length);
      copy.set(bytes);
      const buffer = await audioCtx.decodeAudioData(copy.buffer);
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
