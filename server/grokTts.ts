export interface GrokTtsOptions {
  apiKey: string;
  voiceId?: string;
  language?: string;
  speed?: number;
}

function resolveGrokLanguage(text: string): string {
  if (/[가-힣]/.test(text)) return 'ko';
  if (/[ぁ-んァ-ン一-龯]/.test(text)) return 'ja';
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
  return 'auto';
}

function resolveGrokSpeed(emotion?: string): number {
  if (!emotion) return 1.0;
  const emo = emotion.trim().toLowerCase();
  const slowHealingList = ['공감', '위로', '치유', '차분', '평온', '슬픔', '따뜻', 'empathy', 'comfort', 'healing', 'calm', 'peace', 'sadness', 'sad', 'warm'];
  const brightJoyList = ['기쁨', '응원', '설렘', '위트', '밝음', '재미', '신남', 'joy', 'cheer', 'cheering', 'excited', 'witty', 'happy', 'fun', 'bright'];
  const mysteryTarotList = ['신비', '진지', '경고', '몽환', 'mystery', 'serious', 'warning', 'dreamy', 'mystic'];

  if (slowHealingList.some((item) => emo.includes(item))) return 0.92;
  if (brightJoyList.some((item) => emo.includes(item))) return 1.05;
  if (mysteryTarotList.some((item) => emo.includes(item))) return 0.95;
  return 1.0;
}

/** 앱 persona 보이스 → Grok TTS voice_id (Lucy & PRISM 전역 여성 음성 Ara 고정) */
export function mapPersonaToGrokVoice(_voice?: string): string {
  return 'ara';
}

export async function synthesizeGrokTTS(
  text: string,
  options: GrokTtsOptions & { emotion?: string },
): Promise<Buffer> {
  // Compatibility export for old callers; never use the legacy provider key.
  const { synthesizeGeminiSpeech } = await import('./api-lib/geminiMedia.ts');
  const { getGeminiApiKey } = await import('./geminiKey.ts');
  const result = await synthesizeGeminiSpeech(text, options.voiceId, { ...process.env, GEMINI_API_KEY: getGeminiApiKey() });
  return Buffer.from(result.audioContent, 'base64');
}

export function getXaiApiKey(): string {
  return process.env.XAI_API_KEY || process.env.GROK_API_KEY || '';
}