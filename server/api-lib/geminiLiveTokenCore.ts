import { buildLucyLiveInstruction, buildOrbLiveInstruction } from '../../src/lib/lucyLiveBrief.ts';
import { orbFunctionDeclarations } from '../../src/lib/orb/orbTools.ts';
import { orbVoice } from '../../src/lib/orbMasters.ts';
import { parseOrbLivePrices, type OrbLivePrices } from '../../src/lib/orb/orbSessionMetrics.ts';

const LIVE_MODEL = 'gemini-3.8-live';

export function lucyLiveInstruction(nickname: string, chart = '', cards = '', focus = '', greet = '', notes = ''): string {
  return buildLucyLiveInstruction(nickname, chart, cards, focus, greet, notes);
}

export interface GeminiLiveReading {
  chart?: string;
  cards?: string;
  voice?: string;
  focus?: string;
  greet?: string;
  notes?: string;
  orb?: boolean;
  persona?: string;
  rules?: string;
}

export async function issueGeminiLiveToken(
  key: string,
  nickname = '',
  reading?: GeminiLiveReading,
  rawUsagePrices?: string,
  fetchApi = fetch,
): Promise<{ token: string; model: string; expiresAt: string; usagePrices?: OrbLivePrices }> {
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
    systemInstruction: { parts: [{ text: reading?.orb
      ? buildOrbLiveInstruction(nickname, reading.persona || '', reading.greet || '', reading.notes || '', reading.rules || '')
      : lucyLiveInstruction(nickname, reading?.chart || '', reading?.cards || '', reading?.focus || '', reading?.greet || '', reading?.notes || '') }] },
    // 🔮 오브 통합 마스터: 15가지 도구를 함수로 부른다 (토큰에 고정되므로 여기서도 넣는다).
    ...(reading?.orb ? { tools: [{ functionDeclarations: orbFunctionDeclarations() }] } : {}),
  };
  // 한국어로 듣고 말하게 고정하고, 마스터의 말을 자막으로 받는다 (받아쓰기 켜기).
  const koreanSetup = {
    ...setup,
    generationConfig: { ...setup.generationConfig, speechConfig: { ...setup.generationConfig.speechConfig, languageCode: 'ko-KR' } },
    inputAudioTranscription: {},
    outputAudioTranscription: {},
  };
  const headers = { 'content-type': 'application/json', 'x-goog-api-key': key };
  const url = 'https://generativelanguage.googleapis.com/v1beta/auth_tokens';
  const signal = AbortSignal.timeout(10_000);
  let response = await fetchApi(url, {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify({ uses: 1, expireTime, newSessionExpireTime, bidiGenerateContentSetup: koreanSetup }),
  });
  if (response.status === 400) {
    response = await fetchApi(url, {
      method: 'POST',
      headers,
      signal,
      body: JSON.stringify({ uses: 1, expireTime, newSessionExpireTime, bidiGenerateContentSetup: setup }),
    });
  }
  if (response.status === 400) {
    const withoutVoice = { ...setup, generationConfig: { responseModalities: ['AUDIO'] } };
    response = await fetchApi(url, {
      method: 'POST',
      headers,
      signal,
      body: JSON.stringify({ uses: 1, expireTime, newSessionExpireTime, bidiGenerateContentSetup: withoutVoice }),
    });
  }
  if (response.status === 400) {
    response = await fetchApi(url, {
      method: 'POST',
      headers,
      signal,
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
  let usagePrices: OrbLivePrices | null = null;
  if (reading?.orb && rawUsagePrices) {
    try { usagePrices = parseOrbLivePrices(JSON.parse(rawUsagePrices)); }
    catch { /* usage remains measurable without a configured price */ }
  }
  return { token, model: LIVE_MODEL, expiresAt: expireTime, ...(usagePrices ? { usagePrices } : {}) };
}
