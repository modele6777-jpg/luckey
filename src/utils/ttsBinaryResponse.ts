/**
 * 📉 TTS 응답 파서 (v1.7.621)
 *
 * `/api/ai/tts`가 `Accept: audio/*` / `responseFormat: "binary"` 요청에는 오디오 바이트를
 * 그대로 돌려줍니다(base64 JSON 대비 Origin 전송량 -25%). 이 모듈은 바이너리와 기존
 * base64 JSON 응답을 모두 같은 형태로 읽어, 재생 엔진이 두 형식을 구분하지 않게 합니다.
 */

export type TTSAudioEncoding = 'wav' | 'mp3' | 'pcm';

export type ParsedTTSAudio = {
  /** 오디오 원본 바이트 (재생·디코드용) */
  bytes: Uint8Array;
  /** 기존 재생 엔진(playTTSAudio)이 받는 base64 문자열 */
  audioContent: string;
  encoding: TTSAudioEncoding;
  sampleRate: number;
};

export function bytesToBase64(bytes: Uint8Array): string {
  if (typeof btoa !== 'function') return '';
  let binary = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function normalizeEncoding(value: string | null | undefined): TTSAudioEncoding | null {
  const clean = String(value || '').trim().toLowerCase();
  if (!clean) return null;
  if (clean.includes('mpeg') || clean.includes('mp3')) return 'mp3';
  if (clean.includes('l16') || clean.includes('pcm')) return 'pcm';
  if (clean.includes('wav') || clean.includes('wave')) return 'wav';
  return null;
}

/** 헤더가 없을 때를 대비한 바이트 시그니처 판별 (RIFF/WAVE, MP3 프레임, ID3). */
export function detectAudioEncoding(bytes: Uint8Array): TTSAudioEncoding {
  if (bytes.length >= 12) {
    const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    const wave = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (riff === 'RIFF' && wave === 'WAVE') return 'wav';
  }
  if (bytes.length >= 3 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return 'mp3';
  if (bytes.length >= 2 && bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return 'mp3';
  return 'wav';
}

function resolveSampleRate(headers: Headers): number {
  const raw = Number(headers.get('X-TTS-Sample-Rate'));
  return Number.isFinite(raw) && raw >= 8000 && raw <= 96000 ? raw : 24000;
}

/**
 * POST /api/ai/tts 응답을 파싱합니다.
 * `Content-Type: audio/*`면 바이너리, 아니면 기존 JSON(`audioContent`)으로 읽습니다.
 */
export async function parseTTSAudioResponse(response: Response): Promise<ParsedTTSAudio | null> {
  const contentType = (response.headers.get('Content-Type') || '').toLowerCase();

  if (contentType.startsWith('audio/')) {
    const buffer = await response.arrayBuffer();
    if (!buffer.byteLength) return null;
    const bytes = new Uint8Array(buffer);
    const encoding = normalizeEncoding(response.headers.get('X-TTS-Encoding'))
      || normalizeEncoding(contentType.split(';')[0])
      || detectAudioEncoding(bytes);
    return {
      bytes,
      audioContent: bytesToBase64(bytes),
      encoding,
      sampleRate: resolveSampleRate(response.headers),
    };
  }

  const data = await response.json().catch(() => null) as
    | { audioContent?: unknown; encoding?: unknown; sampleRate?: unknown }
    | null;
  if (!data || typeof data.audioContent !== 'string' || !data.audioContent) return null;
  const bytes = base64ToBytes(data.audioContent);
  if (!bytes.length) return null;
  // 기존 클라이언트와 동일한 해석: pcm/wav가 아니면 mp3 (서버는 항상 encoding을 실어 보냅니다).
  const encoding = normalizeEncoding(String(data.encoding || '')) || 'mp3';
  const sampleRate = Number(data.sampleRate);
  return {
    bytes,
    audioContent: data.audioContent,
    encoding,
    sampleRate: Number.isFinite(sampleRate) && sampleRate >= 8000 && sampleRate <= 96000 ? sampleRate : 24000,
  };
}
