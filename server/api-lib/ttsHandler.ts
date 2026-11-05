import { synthesizeWithEdgeTTS } from './edgeTts.ts';

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
 * 내부 제어 지시문(frontend src/ 의존성 없이 서버 자체 완결)을 제거합니다.
 * 이전에는 src/utils/speechText를 import했는데, Vercel 서버리스 런타임 번들에
 * 프론트엔드 경로가 존재하지 않아 `Cannot find module '/var/task/src/utils/speechText'`
 * 로 함수 전체가 크래시했습니다. 그래서 필요한 정규식 처리를 여기에 인라인으로 옮겼습니다.
 */
function stripInternalSpeechDirectives(text: string): string {
  return String(text || '')
    .replace(/<(think|analysis|system|developer|internal|instructions)(?:\s[^>]*)?>[\s\S]*?(?:<\/\1\s*>|$)/gi, ' ')
    .replace(/```(?:system|developer|prompt|instructions|internal|analysis)\s*\n[\s\S]*?(?:```|$)/gi, ' ')
    .replace(/\[(SYSTEM|DEVELOPER|INTERNAL|PROMPT|INSTRUCTIONS|ANALYSIS)\]([\s\S]*?)(?:\[\/\1\]|$)/gi, ' ')
    .replace(/\[(?:SYSTEM|DEVELOPER|INTERNAL|PROMPT|INSTRUCTIONS|ANALYSIS|EMOTION|SUGGESTIONS|TOOL|IMAGE|STAGE|SOUL_UPDATE|CARD_DRAWN|YOUTUBE)\s*:[\s\S]*?(?:\]|$)/gi, ' ')
    .trim();
}

/** Synthesize through the configured backup and expose permanent provider failures. */
export function createTTSHandler(synthesize: typeof synthesizeWithEdgeTTS = synthesizeWithEdgeTTS) {
  let providerUnavailableUntil = 0;
  return async function handleTTS(options: TTSHandlerOptions): Promise<TTSHandlerResult> {
    if (Date.now() < providerUnavailableUntil) throw Object.assign(new Error('서버 음성 연결을 사용할 수 없습니다.'), { status: 503, code: 'TTS_PROVIDER_UNAVAILABLE' });
    const speech = stripInternalSpeechDirectives(String(options.text || '')).trim();
    try {
      return await synthesize(speech, options.voice);
    } catch (error) {
      console.error('[tts] Free TTS synthesis failed:', error);
      const status = Number((error as { status?: number })?.status);
      if ([401, 403, 429].includes(status)) {
        providerUnavailableUntil = Date.now() + 60000;
        throw Object.assign(new Error('서버 음성 제공자가 연결을 거절했습니다.'), { status: 503, code: 'TTS_PROVIDER_UNAVAILABLE' });
      }
      throw Object.assign(new Error('음성 생성에 일시적인 오류가 발생했습니다. 잠시 후 다시 눌러 주세요.'), { status: 502 });
    }
  }
}
export const handleTTS = createTTSHandler();
