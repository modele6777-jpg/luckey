/**
 * 🔊 무료 TTS — 제로 의존성(Zero-dependency) 무료 음성 합성 (Node 런타임 전용)
 * 유료 OpenAI / Gemini TTS 키가 전혀 없어도 한국어 낭독(오디오 도슨트, 타로 리딩,
 * 사주 리딩, 명시 낭독, Calm 가이드 등)이 항상 동작하도록 하는 유일한 음성 엔진입니다.
 *
 * 이전 구현은 node-edge-tts(WebSocket · ws 의존성 · 임시 파일 기록)를 썼는데,
 * Vercel 서버리스 번들에서 `Cannot find module './lib/stream'`로 람다가
 * 실행조차 되지 않아 FUNCTION_INVOCATION_FAILED(500)가 발생했습니다.
 *
 * 그래서 외부 패키지·WebSocket·디스크 기록을 전부 제거하고 순수 `node:https`만으로
 * 무료 음성을 합성합니다. 문장·문단 부호 기준으로 150자 이하 청크로 나눈 뒤
 * 각 청크의 mp3를 받아 이어 붙여 하나의 base64 mp3로 돌려줍니다.
 */
import { get as httpsGet } from 'node:https';

/** 기본/여성 보이스 (Lucy·Aoede·Kore 계열) — 한국어 고품질 */
export const EDGE_TTS_FEMALE = 'ko-KR-SunHiNeural';
/** 남성 보이스 (Charon 계열) — 한국어 고품질 */
export const EDGE_TTS_MALE = 'ko-KR-InJoonNeural';

/** 앱 persona 보이스 → 무료 TTS 보이스 매핑 (호출부 호환을 위해 유지) */
export function resolveEdgeTtsVoice(voice?: string): { voice: string; lang: string } {
  const requested = String(voice || '').trim();
  // 명시적인 신경망 보이스 이름(ko-KR-InJoonNeural 등)은 그대로 사용.
  if (/^[a-z]{2,3}-[A-Z]{2,}-\w+Neural$/i.test(requested)) {
    return { voice: requested, lang: requested.split('-').slice(0, 2).join('-') };
  }
  if (/^(Charon|InJoon|male|man|남성|남자)$/i.test(requested) || /InJoonNeural/i.test(requested)) {
    return { voice: EDGE_TTS_MALE, lang: 'ko-KR' };
  }
  return { voice: EDGE_TTS_FEMALE, lang: 'ko-KR' };
}

export interface EdgeTtsResult {
  /** mp3 오디오의 base64 문자열 */
  audioContent: string;
  encoding: 'mp3';
  sampleRate: 24000;
  voice: string;
  provider: 'free-neural';
}

/** 무료 TTS가 한 번의 요청으로 안전하게 읽을 청크 길이 */
const MAX_CHUNK_CHARS = 150;
/** 청크 하나를 받아오기 위한 제한 시간 */
const CHUNK_TIMEOUT_MS = 15000;
/** 청크 하나당 시도 횟수 (네트워크 일시 오류 1회 재시도) */
const CHUNK_ATTEMPTS = 2;
/** 연속 요청 사이 짧은 간격 (무료 제공자 속도 제한 완화) */
const CHUNK_GAP_MS = 250;

/** 문장 · 문단 부호 경계를 존중하면서 MAX_CHUNK_CHARS 이하 청크로 나눕니다. */
function splitSpeechIntoFreeChunks(speech: string): string[] {
  const sentences = speech.match(/[^.!?。！？\n]+(?:[.!?。！？\n]+["'”’]?|\s*$)/g) || [speech];
  const units: string[] = [];
  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;
    if (sentence.length <= MAX_CHUNK_CHARS) {
      units.push(sentence);
      continue;
    }
    // 한 문장이 지나치게 길면 절(쉼표·세미콜론·줄바꿈) 경계로 나눕니다.
    const clauses = sentence.match(/[^,，;；\n]+(?:[,，;；\n]+|\s*$)/g) || [sentence];
    let current = '';
    for (const rawClause of clauses) {
      const clause = rawClause.trim();
      if (!clause) continue;
      if (current && current.length + clause.length + 1 > MAX_CHUNK_CHARS) {
        units.push(current);
        current = clause;
      } else {
        current = current ? `${current} ${clause}` : clause;
      }
      // 절마저 길면 공백 기준으로 잘라냅니다.
      while (current.length > MAX_CHUNK_CHARS) {
        let cut = current.lastIndexOf(' ', MAX_CHUNK_CHARS);
        if (cut < Math.floor(MAX_CHUNK_CHARS / 2)) cut = MAX_CHUNK_CHARS;
        units.push(current.slice(0, cut).trim());
        current = current.slice(cut).trim();
      }
    }
    if (current) units.push(current);
  }
  return units.length > 0 ? units : [speech];
}

/** 무료 TTS 제공자에서 mp3 청크 하나를 내려받습니다. */
function fetchFreeTtsChunk(chunk: string, lang: string, timeoutMs = CHUNK_TIMEOUT_MS): Promise<Buffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
  return new Promise<Buffer>((resolve, reject) => {
    const request = httpsGet(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, response => {
      const status = response.statusCode || 0;
      const parts: Buffer[] = [];
      response.on('data', part => { parts.push(part); });
      response.on('error', reject);
      response.on('end', () => {
        const body = Buffer.concat(parts);
        if (status === 200 && body.length) resolve(body);
        else reject(Object.assign(new Error(`무료 TTS 응답이 실패했습니다 (HTTP ${status}).`), { status }));
      });
    });
    request.setTimeout(timeoutMs, () => {
      request.destroy(Object.assign(new Error('무료 TTS 응답이 지연되어 시간이 초과되었습니다.'), { status: 504 }));
    });
    request.on('error', reject);
  });
}

async function fetchFreeTtsChunkWithRetry(chunk: string, lang: string): Promise<Buffer> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < CHUNK_ATTEMPTS; attempt++) {
    try {
      const body = await fetchFreeTtsChunk(chunk, lang);
      // mp3 프레임은 보통 0xFF 0x** 시그니처로 시작합니다. 빈/깨진 응답은 재시도합니다.
      if (body.length > 2 && body[0] === 0xff) return body;
      lastError = new Error('무료 TTS가 빈 오디오를 반환했습니다.');
      continue;
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 400));
    }
  }
  throw lastError instanceof Error ? lastError : new Error('무료 TTS 합성에 실패했습니다.');
}

/** 무료 TTS로 mp3 음성을 합성합니다. 실패 시 예외를 던지므로 호출부가 적절히 안내할 수 있습니다. */
export async function synthesizeWithEdgeTTS(speech: string, voice?: string): Promise<EdgeTtsResult> {
  const clean = String(speech || '').trim();
  if (!clean) throw new Error('낭독할 문장이 비어 있습니다.');

  const resolved = resolveEdgeTtsVoice(voice);
  const lang = (resolved.lang.split('-')[0] || 'ko').toLowerCase();
  const chunks = splitSpeechIntoFreeChunks(clean);

  const parts: Buffer[] = [];
  for (let index = 0; index < chunks.length; index++) {
    if (index > 0) await new Promise(resolve => setTimeout(resolve, CHUNK_GAP_MS));
    parts.push(await fetchFreeTtsChunkWithRetry(chunks[index], lang));
  }

  const combined = Buffer.concat(parts);
  if (!combined.length) throw new Error('무료 TTS가 빈 오디오를 반환했습니다.');
  return {
    audioContent: combined.toString('base64'),
    encoding: 'mp3',
    sampleRate: 24000,
    voice: resolved.voice,
    provider: 'free-neural',
  };
}
