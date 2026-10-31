/**
 * 🔊 Edge TTS — 무료·무제한 Microsoft Edge 신경망 음성 합성 (Node 런타임 전용)
 * 유료 OpenAI / Gemini TTS 키가 전혀 없어도 한국어 낭독(오디오 도슨트, 타로 리딩,
 * 사주 리딩, 명시 낭독, Calm 가이드 등)이 항상 동작하도록 하는 유일한 음성 엔진입니다.
 *
 * node-edge-tts는 mp3를 파일로 내려쓰므로 OS 임시 디렉터리에 쓴 뒤 메모리로 읽어 base64로 돌려줍니다.
 */
import { tmpdir } from 'node:os';
import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { EdgeTTS } from 'node-edge-tts';

/** 기본/여성 보이스 (Lucy·Aoede·Kore 계열) — 한국어 고품질 */
export const EDGE_TTS_FEMALE = 'ko-KR-SunHiNeural';
/** 남성 보이스 (Charon 계열) — 한국어 고품질 */
export const EDGE_TTS_MALE = 'ko-KR-InJoonNeural';
const EDGE_TTS_OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

/** 앱 persona 보이스 → Edge TTS 신경망 보이스 매핑 */
export function resolveEdgeTtsVoice(voice?: string): { voice: string; lang: string } {
  const requested = String(voice || '').trim();
  // 명시적인 Edge 신경망 보이스 이름(ko-KR-InJoonNeural 등)은 그대로 사용.
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
  provider: 'edge';
}

/** Edge TTS로 mp3 음성을 합성합니다. 실패 시 예외를 던지므로 호출부가 적절히 안내할 수 있습니다. */
export async function synthesizeWithEdgeTTS(speech: string, voice?: string): Promise<EdgeTtsResult> {
  const clean = String(speech || '').trim();
  if (!clean) throw new Error('Edge TTS: 낭독할 문장이 비어 있습니다.');

  const resolved = resolveEdgeTtsVoice(voice);
  const tempPath = join(tmpdir(), `luckey-edge-tts-${randomUUID()}.mp3`);
  try {
    const tts = new EdgeTTS({
      voice: resolved.voice,
      lang: resolved.lang,
      outputFormat: EDGE_TTS_OUTPUT_FORMAT,
      timeout: 30000,
    });
    await tts.ttsPromise(clean, tempPath);
    const bytes = await readFile(tempPath);
    if (!bytes.length) throw new Error('Edge TTS가 빈 오디오를 반환했습니다.');
    return {
      audioContent: bytes.toString('base64'),
      encoding: 'mp3',
      sampleRate: 24000,
      voice: resolved.voice,
      provider: 'edge',
    };
  } finally {
    await rm(tempPath, { force: true }).catch(() => {});
  }
}
