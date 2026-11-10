import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { after, describe, test } from 'node:test';
import express from 'express';
import app from '../api/index.ts';
import { handleBluebirdDocent } from '../server/api-lib/bluebirdDocent.ts';
import { handleMuseDocent } from '../api/muse/docent.ts';
import { heuristicDiaryAnalysis, parseAnalysisJson, requestDiaryAnalysis } from '../server/api-lib/analyzeEntry.ts';
import { isAllowedAppOrigin, rateLimit } from '../server/api-lib/publicAccess.ts';
import { MCP_SERVER_VERSION } from '../server/api-lib/mcpVersion.ts';
import { isRevokedGeminiKey } from '../server/geminiKey.ts';
import { SajuInputError, assertSajuClock } from '../src/lib/sajuInput.ts';

const KEY_NAMES = [
  'GEMINI_API_KEY', 'GOOGLE_GENAI_API_KEY', 'GOOGLE_API_KEY', 'AI_API_KEY', 'API_KEY',
  'VITE_GEMINI_API_KEY', 'VITE_AI_API_KEY', 'XAI_API_KEY', 'GROK_API_KEY', 'xAI', 'XAI', 'OPENAI_API_KEY',
];
const savedKeys = Object.fromEntries(KEY_NAMES.map((name) => [name, process.env[name]]));

function withoutProviderKeys() {
  for (const name of KEY_NAMES) delete process.env[name];
}

function restoreKeys() {
  for (const name of KEY_NAMES) {
    if (savedKeys[name] === undefined) delete process.env[name];
    else process.env[name] = savedKeys[name];
  }
}

async function listen(handler: express.Express): Promise<{ server: Server; base: string }> {
  const server = createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no port');
  return { server, base: `http://127.0.0.1:${address.port}` };
}

async function post(base: string, route: string, body: unknown, headers: Record<string, string> = {}) {
  const response = await fetch(`${base}${route}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.10', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(4000),
  });
  const text = await response.text();
  let parsed: any = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = { raw: text }; }
  return { status: response.status, body: parsed, headers: response.headers };
}

describe('production audit routes', { concurrency: false }, () => {
  let server: Server;
  let base = '';

  after(async () => {
    restoreKeys();
    if (server) await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });

  test('secret notes, origin guard, and missing saju year', async () => {
    withoutProviderKeys();
    ({ server, base } = await listen(app));

    const emptyBlessing = await post(base, '/api/ai/secret-blessing', { content: '  ' });
    assert.equal(emptyBlessing.status, 400);
    const blessing = await post(base, '/api/ai/secret-blessing', { content: '오늘 회사 야근이 힘들어요', userName: '주형' });
    assert.equal(blessing.status, 200);
    assert.equal(blessing.body.source, 'engine');
    assert.equal(String(blessing.body.comfortMantra).includes('주형'), true);

    const emptyMood = await post(base, '/api/ai/secret-mood-recommend', {});
    assert.equal(emptyMood.status, 400);
    const mood = await post(base, '/api/ai/secret-mood-recommend', { content: '남모르게 눈물이 났어요' });
    assert.equal(mood.status, 200);
    assert.equal(mood.body.source, 'engine');
    assert.equal(mood.body.moodTag, 'tears');

    const foreign = await post(base, '/api/openai/v1/chat/completions', { messages: [{ role: 'user', content: '안녕' }] }, { origin: 'https://evil.example' });
    assert.equal(foreign.status, 403);
    assert.equal(foreign.body.code, 'ORIGIN_NOT_ALLOWED');
    const sameApp = await post(base, '/api/openai/v1/chat/completions', { messages: [{ role: 'user', content: '안녕' }] }, { origin: 'https://luckey-six.vercel.app' });
    assert.equal(sameApp.status, 503);
    assert.equal(sameApp.headers.get('access-control-allow-origin'), 'https://luckey-six.vercel.app');
    const preview = await post(base, '/api/ai/daily-tarot', {}, { origin: 'https://luckey-six-git-preview.vercel.app' });
    assert.equal(preview.status, 400);
    const otherProject = await post(base, '/api/ai/tts', { text: '안녕' }, { origin: 'https://other-app.vercel.app' });
    assert.equal(otherProject.status, 403);

    const huge = await post(base, '/api/openai/v1/chat/completions', { messages: [{ role: 'user', content: '가'.repeat(9000) }] }, { origin: 'http://localhost:5173' });
    assert.equal(huge.status, 413);

    assert.equal(isAllowedAppOrigin(undefined), true);
    assert.equal(isAllowedAppOrigin('http://127.0.0.1:3000'), true);
    assert.equal(isAllowedAppOrigin('https://not-luckey.example'), false);

    assert.throws(
      () => assertSajuClock({ year: undefined, month: 5, day: 15 }),
      (error: unknown) => error instanceof SajuInputError && error.message === '출생 연도를 입력해 주세요.',
    );
  });

  test('chat completions rate limit is per IP', () => {
    const req = { headers: { 'x-forwarded-for': '198.51.100.77' }, ip: '127.0.0.1' } as any;
    const statuses: number[] = [];
    for (let i = 0; i < 21; i += 1) {
      const res = {
        statusCode: 0,
        setHeader() { return this; },
        status(code: number) { this.statusCode = code; return this; },
        json() { statuses.push(this.statusCode); return this; },
      };
      const blocked = rateLimit(req, res as never, 20);
      if (!blocked) statuses.push(0);
    }
    assert.equal(statuses.filter((code) => code === 0).length, 20);
    assert.equal(statuses.at(-1), 429);
  });

  test('diary analysis retries plain JSON and marks the engine fallback', async () => {
    const fenced = parseAnalysisJson('```json\n{"keywords":["휴식"],"emotions":["평온"]}\n```');
    assert.deepEqual(fenced, { keywords: ['휴식'], emotions: ['평온'] });
    const calls: boolean[] = [];
    const analyzed = await requestDiaryAnalysis(async (plain) => {
      calls.push(plain);
      if (!plain) return { text: 'not json' };
      return { text: '{"keywords":["하루"],"emotions":["기쁨"]}' };
    });
    assert.deepEqual(calls, [false, true]);
    assert.equal(analyzed.source, 'model');
    await assert.rejects(requestDiaryAnalysis(async () => { throw new Error('model down'); }));
    const heuristic = heuristicDiaryAnalysis('그냥 적어두기');
    assert.equal(heuristic.source, 'engine');
    assert.equal(heuristic.emotions[0], '미묘한 중립');
  });

  test('docents return a curated script when provider keys are missing', async () => {
    withoutProviderKeys();
    const bluebird = await handleBluebirdDocent({ imageUrl: '', title: '달빛', theme: '휴식', prompt: '고요' });
    assert.equal(bluebird.source, 'engine');
    assert.equal(bluebird.reply.includes('달빛'), true);
    const started = Date.now();
    const muse = await handleMuseDocent({ title: '수련', creator: '모네', description: '물 위의 빛' });
    assert.equal(muse.source, 'engine');
    assert.equal(muse.reply.includes('안녕하십니까'), true);
    assert.equal(Date.now() - started < 3000, true);
  });

  test('MCP version matches package.json and revoked key fingerprints stay hashed', async () => {
    const pkg = JSON.parse(await readFile(path.resolve(import.meta.dirname, '../package.json'), 'utf8')) as { version: string };
    assert.equal(MCP_SERVER_VERSION, pkg.version);
    assert.equal(isRevokedGeminiKey(''), false);
    assert.equal(isRevokedGeminiKey('not-the-revoked-key'), false);
    const repo = path.resolve(import.meta.dirname, '..');
    const hits: string[] = [];
    const walk = async (dir: string) => {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === 'dist') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) await walk(full);
        else if (/\.(?:ts|tsx|js|mjs)$/.test(entry.name) && (await readFile(full, 'utf8')).includes('AQ.Ab8RN6LJzm')) {
          hits.push(path.relative(repo, full));
        }
      }
    };
    for (const root of ['api', 'server', 'src']) await walk(path.join(repo, root));
    const serverApp = await readFile(path.join(repo, 'server.app.ts'), 'utf8');
    if (serverApp.includes('AQ.Ab8RN6LJzm')) hits.push('server.app.ts');
    assert.deepEqual(hits, []);
  });
});
