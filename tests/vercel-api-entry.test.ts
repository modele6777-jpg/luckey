import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, describe, test } from 'node:test';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import express from 'express';
import app from '../api/index.ts';
import { handleDailyTarotPost } from '../server/api-lib/dailyTarotRoute.ts';
import { guardRoute } from '../server/api-lib/routeGuard.ts';

const execFileAsync = promisify(execFile);
const repo = path.resolve(import.meta.dirname, '..');
const KEY_NAMES = ['GEMINI_API_KEY', 'GOOGLE_GENAI_API_KEY', 'GOOGLE_API_KEY', 'AI_API_KEY', 'API_KEY', 'VITE_GEMINI_API_KEY', 'VITE_AI_API_KEY'];
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
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(4000),
  });
  const text = await response.text();
  let parsed: any = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = { raw: text }; }
  return { status: response.status, body: parsed, text };
}

describe('Vercel API entry', { concurrency: false }, () => {
  let server: Server;
  let base = '';

  after(async () => {
    restoreKeys();
    if (server) await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });

  test('saju, MCP, and daily tarot answer quickly through api/index.ts', async () => {
    withoutProviderKeys();
    ({ server, base } = await listen(app));
    const chart = await post(base, '/api/saju/chart', { year: 1990, month: 5, day: 15, birthtime: '13:30', isLunar: false });
    assert.equal(chart.status, 200);
    assert.equal(typeof chart.body.pillars.year, 'string');
    assert.equal(typeof chart.body.pillars.day, 'string');
    assert.equal(typeof chart.body.timePolicy.summary, 'string');
    assert.equal(chart.body.interpretation.length > 0, true);

    const invalid = await post(base, '/api/saju/chart', {});
    assert.equal(invalid.status, 400);
    assert.equal(typeof invalid.body.code, 'string');
    assert.equal(invalid.body.code.length > 0, true);

    const initialized = await post(base, '/api/mcp', {
      jsonrpc: '2.0', id: 1, method: 'initialize',
      params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'health', version: '0' } },
    });
    assert.equal(initialized.status, 200);
    assert.equal(initialized.body.result.protocolVersion, '2024-11-05');

    const streamable = await post(base, '/api/mcp', {
      jsonrpc: '2.0', id: 1, method: 'initialize',
      params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'health', version: '0' } },
    }, { accept: 'application/json, text/event-stream' });
    assert.equal(streamable.status, 200);
    assert.equal(streamable.body.result.serverInfo.name, 'luckey-readings');

    const discovered = await fetch(`${base}/api/mcp`, { signal: AbortSignal.timeout(4000) });
    assert.equal(discovered.status, 200);
    const discovery = await discovered.json() as { name?: string };
    assert.equal(discovery.name, 'luckey-oracle-mcp');

    const image = await post(base, '/api/ai/image', {});
    assert.equal(image.status, 400);

    let fetches = 0;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (...args: Parameters<typeof fetch>) => {
      const url = String(args[0]);
      if (url.startsWith(base)) return originalFetch(...args);
      fetches += 1;
      throw new Error('live model call');
    }) as typeof fetch;
    try {
      const missingCard = await post(base, '/api/ai/daily-tarot', {});
      assert.equal(missingCard.status, 400);
      const tarot = await post(base, '/api/ai/daily-tarot', { card: { id: 'major_0', name: 'The Fool', nameKo: '광대', type: 'major', keywords: ['시작'] } });
      assert.equal(tarot.status, 200);
      assert.equal(typeof tarot.body.diagnosis, 'string');
      assert.equal(tarot.body.diagnosis.includes('광대'), true);
      assert.equal(fetches, 0);
    } finally {
      globalThis.fetch = originalFetch;
    }

    const chat = await post(base, '/api/openai/v1/chat/completions', { messages: [{ role: 'user', content: '안녕' }] });
    assert.equal(chat.status, 503);
    assert.equal(chat.body.code, 'GEMINI_API_KEY_MISSING');
    assert.equal(chat.text.includes('AIza'), false);
    assert.equal(chat.text.includes('AQ.Ab8'), false);

    const analysis = await post(base, '/api/ai/analyze-entry', { content: '기쁜 하루' });
    assert.equal(analysis.status, 503);
    assert.equal(analysis.body.code, 'GEMINI_API_KEY_MISSING');
  });

  test('a rejected handler returns JSON 500 instead of an open request', async () => {
    const guarded = express();
    guarded.use(express.json());
    guarded.post('/boom', guardRoute(async () => {
      throw Object.assign(new Error('missing module'), { code: 'ERR_MODULE_NOT_FOUND' });
    }));
    const started = await listen(guarded);
    try {
      const failed = await post(started.base, '/boom', {});
      assert.equal(failed.status, 500);
      assert.equal(failed.body.code, 'ERR_MODULE_NOT_FOUND');
      assert.equal(failed.text.includes('missing module'), false);
    } finally {
      await new Promise<void>((resolve, reject) => started.server.close((error) => error ? reject(error) : resolve()));
    }
  });

  test('daily tarot uses the injected model and skips it when the key is empty', async () => {
    const calls: unknown[] = [];
    const req = { body: { card: { nameKo: '별', name: 'The Star', type: 'major', keywords: ['희망'], reversed: false } } };
    const res = {
      statusCode: 0,
      body: undefined as unknown,
      status(code: number) { this.statusCode = code; return this; },
      json(payload: unknown) { this.body = payload; return this; },
    };
    await handleDailyTarotPost(req as any, res as any, {
      apiKey: 'test-only',
      callModel: async (_key, contents) => {
        calls.push(contents);
        return { text: JSON.stringify({ diagnosis: '모델 진단입니다. '.repeat(40), luckyNumber: '7', luckyColor: '푸른색', remedy: '물 한 잔', symbol: '별', frequency: '639Hz' }) };
      },
    });
    assert.equal(res.statusCode, 200);
    assert.equal((res.body as { diagnosis: string }).diagnosis.includes('모델 진단'), true);
    assert.equal(calls.length, 1);
    res.statusCode = 0;
    await handleDailyTarotPost(req as any, res as any, { apiKey: '' });
    assert.equal(res.statusCode, 200);
    assert.equal((res.body as { diagnosis: string }).diagnosis.includes('별'), true);
    assert.equal(calls.length, 1);
  });
});

test('Vercel-compiled saju and MCP modules load and respond', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'luckey-vercel-'));
  const out = path.join(dir, 'out');
  try {
    await writeFile(path.join(dir, 'tsconfig.json'), JSON.stringify({
      extends: path.join(repo, 'tsconfig.json'),
      compilerOptions: {
        noEmit: false,
        outDir: out,
        rootDir: repo,
        declaration: false,
        sourceMap: false,
        inlineSourceMap: false,
        incremental: false,
        composite: false,
        rewriteRelativeImportExtensions: true,
        skipLibCheck: true,
        types: [],
      },
      files: [
        path.join(repo, 'server/api-lib/sajuChartRoute.ts'),
        path.join(repo, 'server/api-lib/mcpHandler.ts'),
        path.join(repo, 'server/api-lib/dailyTarotRoute.ts'),
      ],
    }));
    await execFileAsync(path.join(repo, 'node_modules/typescript/bin/tsc'), ['-p', path.join(dir, 'tsconfig.json'), '--noCheck', '--pretty', 'false'], { cwd: dir });
    const analysis = await readFile(path.join(out, 'src/lib/sajuAnalysis.js'), 'utf8');
    const input = await readFile(path.join(out, 'src/lib/sajuInput.js'), 'utf8');
    const utils = await readFile(path.join(out, 'src/lib/trinity/utils.js'), 'utf8');
    assert.match(analysis, /from ["']\.\/birthDateTime\.js["']/);
    assert.match(input, /from ["']\.\/lunarCalendar\.js["']/);
    assert.equal(utils.includes('@/'), false);
    await symlink(path.join(repo, 'node_modules'), path.join(out, 'node_modules'));

    const importWithin = (href: string) => Promise.race([
      import(href),
      new Promise((_resolve, reject) => setTimeout(() => reject(new Error(`import hung ${href}`)), 8000)),
    ]);
    const saju = await importWithin(pathToFileURL(path.join(out, 'server/api-lib/sajuChartRoute.js')).href) as { handleSajuChartPost: Function };
    const mcp = await importWithin(pathToFileURL(path.join(out, 'server/api-lib/mcpHandler.js')).href) as {
      handleMCPDirectPost: (req: express.Request, res: express.Response) => Promise<unknown>;
      handleMCPSseStream: (req: express.Request, res: express.Response) => unknown;
    };
    const compiled = express();
    compiled.use(express.json());
    compiled.post('/api/saju/chart', (req, res) => saju.handleSajuChartPost(req, res));
    compiled.get('/api/mcp', (req, res) => mcp.handleMCPSseStream(req, res));
    compiled.post('/api/mcp', (req, res) => void mcp.handleMCPDirectPost(req, res));
    const started = await listen(compiled);
    try {
      const chart = await post(started.base, '/api/saju/chart', { year: 1990, month: 5, day: 15, birthtime: '13:30', isLunar: false });
      assert.equal(chart.status, 200);
      assert.equal(typeof chart.body.pillars.day, 'string');
      const invalid = await post(started.base, '/api/saju/chart', { year: 1990, month: 13, day: 1 });
      assert.equal(invalid.status, 400);
      const initialized = await post(started.base, '/api/mcp', {
        jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'compiled', version: '0' } },
      });
      assert.equal(initialized.status, 200);
      assert.equal(initialized.body.result.serverInfo.name, 'luckey-oracle-mcp');
      const discovered = await fetch(`${started.base}/api/mcp`, { signal: AbortSignal.timeout(4000) });
      assert.equal(discovered.status, 200);
    } finally {
      await new Promise<void>((resolve, reject) => started.server.close((error) => error ? reject(error) : resolve()));
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
