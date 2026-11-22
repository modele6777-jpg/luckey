import { getGeminiApiKey } from '../geminiKey.ts';
import { buildLucyLiveInstruction } from '../../src/lib/lucyLiveBrief.ts';
import { orbVoice } from '../../src/lib/orbMasters.ts';

const LIVE_MODEL = 'gemini-3.8-live';

export function lucyLiveInstruction(nickname: string, chart = '', cards = '', focus = ''): string {
  return buildLucyLiveInstruction(nickname, chart, cards, focus);
}

export async function createGeminiLiveToken(nickname = '', reading?: { chart?: string; cards?: string; voice?: string; focus?: string }): Promise<{ token: string; model: string; expiresAt: string }> {
  const key = getGeminiApiKey();
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
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: orbVoice(reading?.voice || '') } } },
    },
    systemInstruction: { parts: [{ text: lucyLiveInstruction(nickname, reading?.chart || '', reading?.cards || '', reading?.focus || '') }] },
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
