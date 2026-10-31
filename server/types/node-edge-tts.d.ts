/**
 * node-edge-tts의 package.json이 가리키는 타입 파일이 배포본에 포함되어 있지 않아
 * 로컬 선언으로 보완합니다 (무료 Edge TTS 엔진용).
 */
declare module 'node-edge-tts' {
  export interface EdgeTTSOptions {
    voice?: string;
    lang?: string;
    outputFormat?: string;
    saveSubtitles?: boolean;
    proxy?: string;
    rate?: string;
    pitch?: string;
    volume?: string;
    timeout?: number;
  }

  export class EdgeTTS {
    constructor(options?: EdgeTTSOptions);
    ttsPromise(text: string, audioPath: string): Promise<void>;
  }
}
