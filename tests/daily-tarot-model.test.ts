import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleDailyTarotPost, parseOracleJson, requestTarotModelText, type TarotGenerateRequest } from '../server/api-lib/dailyTarotRoute.ts';
import { describeGeminiError, getGeminiApiKey } from '../server/geminiKey.ts';

const card = { name: 'The Star', nameKo: '별', type: 'major', keywords: ['희망', '치유', '영감'], reversed: false };
const modelJson = {
  diagnosis: '모델이 본 오늘의 별 리딩입니다.',
  luckyNumber: '7',
  luckyColor: '은색',
  remedy: '하늘을 올려다보기',
  symbol: '별',
  frequency: '639Hz',
};

function response() {
  const headers: Record<string, string> = {};
  return {
    statusCode: 0,
    body: undefined as Record<string, unknown> | undefined,
    headers,
    setHeader(name: string, value: string) { headers[name] = value; return this; },
    status(code: number) { this.statusCode = code; return this; },
    json(payload: Record<string, unknown>) { this.body = payload; return this; },
  };
}

test('oracle JSON is accepted from a fenced model reply', () => {
  const parsed = parseOracleJson('설명\n```json\n' + JSON.stringify(modelJson) + '\n```');
  assert.equal(parsed?.diagnosis, modelJson.diagnosis);
  assert.equal(parseOracleJson('그냥 문장입니다.'), null);
});

test('a schema failure retries as a plain generateContent and keeps the model text', async () => {
  const calls: TarotGenerateRequest[] = [];
  const text = await requestTarotModelText(async (request) => {
    calls.push(request);
    if (calls.length === 1) throw new Error('Invalid JSON payload responseSchema key=AQ.NOTAREALKEY');
    return { text: '```json\n' + JSON.stringify(modelJson) + '\n```' };
  }, '시스템', '사용자');
  assert.equal(JSON.parse(text).diagnosis, modelJson.diagnosis);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].model, 'gemini-flash-lite-latest');
  assert.ok(calls[0].config?.responseSchema);
  assert.equal(calls[1].config?.responseSchema, undefined);
  assert.equal(typeof calls[1].contents, 'string');
});

test('daily tarot marks model and engine sources and logs the fallback without the key', async () => {
  const warnings: string[] = [];
  const original = console.warn;
  console.warn = (...args: unknown[]) => { warnings.push(args.map(String).join(' ')); };
  try {
    const modeled = response();
    await handleDailyTarotPost({ body: { card, mode: 'oracle' } } as any, modeled as any, {
      apiKey: 'test-only',
      callModel: async () => ({ text: JSON.stringify(modelJson) }),
    });
    assert.equal(modeled.statusCode, 200);
    assert.equal(modeled.body?.source, 'model');
    assert.equal(modeled.body?.diagnosis, modelJson.diagnosis);
    assert.equal(modeled.body?.luckyNumber, '7');
    assert.equal(modeled.headers['x-luckey-oracle-source'], 'model');

    const local = response();
    await handleDailyTarotPost({ body: { card, mode: 'oracle' } } as any, local as any, {
      apiKey: 'test-only',
      callModel: async () => { throw new Error('model unavailable key=AIzaNOTAREALKEY'); },
    });
    assert.equal(local.statusCode, 200);
    assert.equal(local.body?.source, 'engine');
    assert.equal(local.headers['x-luckey-oracle-source'], 'engine');
    assert.match(String(local.body?.diagnosis), /별/);
    const logged = warnings.join('\n');
    assert.match(logged, /model unavailable/);
    assert.equal(logged.includes('AIzaNOTAREALKEY'), false);
    assert.equal(logged.includes('AQ.NOTAREALKEY'), false);
  } finally {
    console.warn = original;
  }
});

test('shared Gemini key helper reads env and describes errors without secrets', () => {
  const previous = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'env-key-value';
  try {
    assert.equal(getGeminiApiKey(), 'env-key-value');
  } finally {
    if (previous === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previous;
  }
  const described = describeGeminiError(new Error('upstream key=AQ.NOTAREALKEY failed'));
  assert.match(described, /Error: upstream key=\[redacted\] failed/);
  assert.equal(described.includes('AQ.NOTAREALKEY'), false);
});
