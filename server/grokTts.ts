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
  const voiceId = (options.voiceId || mapPersonaToGrokVoice()).toLowerCase();
  const language = options.language || resolveGrokLanguage(text);
  const speed = options.speed ?? resolveGrokSpeed(options.emotion);

  const response = await fetch('https://api.x.ai/v1/tts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      voice_id: voiceId,
      language,
      speed,
      output_format: {
        codec: 'mp3',
        sample_rate: 24000,
        bit_rate: 128000,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Grok TTS error ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const payload = await response.json() as { audio?: string };
    if (!payload.audio) throw new Error('Grok TTS returned JSON without audio');
    return Buffer.from(payload.audio, 'base64');
  }

  return Buffer.from(await response.arrayBuffer());
}

export function getXaiApiKey(): string {
  return process.env.XAI_API_KEY || process.env.GROK_API_KEY || '';
}