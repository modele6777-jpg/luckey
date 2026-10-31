import { synthesizeWithEdgeTTS } from './edgeTts.ts';
import { stripInternalSpeechDirectives } from '../../src/utils/speechText';

export interface TTSHandlerOptions {
  text: string;
  voice?: string;
  emotion?: string;
  rate?: string;
  pitch?: string;
  speed?: number;
  language?: string;
}
export interface TTSHandlerResult {
  audioContent: string;
  encoding: "mp3" | "pcm" | "wav";
  sampleRate?: number;
  voice?: string;
  provider?: string;
}

/**
 * 🔊 무료·무제한 Edge TTS 전면 교체 (ko-KR-SunHiNeural / ko-KR-InJoonNeural).
 * 유료 OpenAI·Gemini 키나 쿼터와 완전히 무관하게, 모든 TTS 요청
 * (오디오 도슨트, 타로 리딩, 사주 리딩, 명시 낭독, Calm 가이드 등)이
 * 항상 무료 mp3 음성으로 낭독됩니다. 유료 API 폴백은 사용하지 않습니다.
 */
export async function handleTTS(options: TTSHandlerOptions): Promise<TTSHandlerResult> {
  const speech = stripInternalSpeechDirectives(String(options.text || '')).trim();
  try {
    return await synthesizeWithEdgeTTS(speech, options.voice);
  } catch (error) {
    console.error('[tts] Edge TTS synthesis failed:', error);
    throw Object.assign(new Error('음성 생성에 일시적인 오류가 발생했습니다. 잠시 후 다시 눌러 주세요.'), { status: 502 });
  }
}
