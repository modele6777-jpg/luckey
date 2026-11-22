import { getGeminiApiKey } from '../geminiKey.ts';

const LIVE_MODEL = 'gemini-3.8-live';

export function lucyLiveInstruction(nickname: string): string {
  const name = nickname.replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 24) || '친구';
  return `당신은 ${name}와 지금 목소리로만 이야기하는 루시야. 글을 읽어 주는 답이 아니라 옆에서 주고받는 대화야.
1~2문장만 말해. 목록, 제목, 기호, 영어 설명은 빼.
풀이하지 말고 들은 말에 반응한 뒤, 질문은 하나까지만 해.
한국어 반말만. 호칭은 ${name}.`;
}

const LIVE_VOICES = ['Aoede', 'Kore', 'Sulafat', 'Puck'] as const;

function providedKey(raw: string | undefined): string {
  const key = (raw || '').trim();
  if (!key) return '';
  if (key.startsWith('sk-') || key.startsWith('xai-') || !/^[A-Za-z0-9_-]{20,200}$/.test(key)) {
    const error = new Error('API 키가 맞지 않습니다.') as Error & { status?: number; code?: string };
    error.status = 400;
    error.code = 'GEMINI_API_KEY_INVALID';
    throw error;
  }
  return key;
}

export async function createGeminiLiveToken(nickname = '', options?: { apiKey?: string; voice?: string }): Promise<{ token: string; model: string; expiresAt: string }> {
  const key = providedKey(options?.apiKey) || getGeminiApiKey();
  const voice = LIVE_VOICES.includes(options?.voice as typeof LIVE_VOICES[number]) ? options!.voice : 'Aoede';
  if (!key) {
    const error = new Error('Gemini 키가 설정되어 있지 않습니다.') as Error & { status?: number; code?: string };
    error.status = 503;
    error.code = 'GEMINI_API_KEY_MISSING';
    throw error;
  }
  const now = Date.now();
  const expireTime = new Date(now + 30 * 60 * 1000).toISOString();
  const newSessionExpireTime = new Date(now + 60 * 1000).toISOString();
  const setup = {
    model: `models/${LIVE_MODEL}`,
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
    },
    systemInstruction: { parts: [{ text: lucyLiveInstruction(nickname) }] },
  };
  const headers = { 'content-type': 'application/json', 'x-goog-api-key': key };
  const url = 'https://generativelanguage.googleapis.com/v1beta/auth_tokens';
  let response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ uses: 1, expireTime, newSessionExpireTime, bidiGenerateContentSetup: setup }),
  });
  if (response.status === 400) {
    const withoutVoice = { ...setup, generationConfig: { responseModalities: ['AUDIO'] } };
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ uses: 1, expireTime, newSessionExpireTime, bidiGenerateContentSetup: withoutVoice }),
    });
  }
  if (response.status === 400) {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ uses: 1, expireTime, newSessionExpireTime }),
    });
  }
  if (!response.ok) {
    const error = new Error('실시간 음성 연결 토큰을 받지 못했습니다.') as Error & { status?: number; code?: string };
    error.status = response.status === 401 || response.status === 403 ? 503 : 502;
    error.code = response.status === 401 || response.status === 403 ? 'GEMINI_API_KEY_INVALID' : 'GEMINI_LIVE_TOKEN_FAILED';
    throw error;
  }
  const data = await response.json() as { name?: string; token?: string };
  const token = String(data.name || data.token || '').trim();
  if (!token) {
    const error = new Error('실시간 음성 토큰이 비어 있습니다.') as Error & { status?: number; code?: string };
    error.status = 502;
    error.code = 'GEMINI_LIVE_TOKEN_FAILED';
    throw error;
  }
  return { token, model: LIVE_MODEL, expiresAt: expireTime };
}
