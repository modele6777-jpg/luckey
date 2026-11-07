import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { after, before, describe, test } from 'node:test';
import express from 'express';
import { TAROT_DECK } from '../src/data/tarotData';
import { handleMCPDirectPost, handleMCPSseStream, handleStreamableMethodNotAllowed } from '../server/api-lib/mcpHandler';
import { resetMcpModelBudgetForTests } from '../server/api-lib/mcpAuth';
import { setMcpNarrativeGeneratorForTests } from '../server/api-lib/mcpReadings';

const TOKEN = 'luckey-mcp-test-token-0123456789';
const ACCEPT = 'application/json, text/event-stream';

let server: Server;
let base = '';
let modelCalls = 0;
let externalCalls = 0;
let originalFetch: typeof fetch;

function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.get(['/api/mcp', '/api/mcp/sse'], (req, res) => handleMCPSseStream(req, res));
  app.post(['/api/mcp', '/api/mcp/sse'], (req, res) => void handleMCPDirectPost(req, res));
  app.delete('/api/mcp', (req, res) => handleStreamableMethodNotAllowed(req, res));
  server = createServer(app);
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('테스트 서버 주소를 열지 못했습니다.');
      base = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
}

async function rpc(
  method: string,
  params?: Record<string, unknown>,
  options: { token?: string; accept?: string; id?: number } = {},
) {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: options.accept || ACCEPT,
  };
  if (options.token) headers.authorization = `Bearer ${options.token}`;
  const response = await fetch(`${base}/api/mcp`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ jsonrpc: '2.0', id: options.id ?? 1, method, params }),
  });
  const text = await response.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
  return { status: response.status, body, text };
}

function toolPayload(body: any) {
  assert.equal(body.error, undefined);
  assert.equal(body.result?.isError, undefined);
  return JSON.parse(body.result.content[0].text);
}

describe('streamable MCP readings', { concurrency: false }, () => {
  before(async () => {
    process.env.LUCKEY_MCP_TOKEN = TOKEN;
    process.env.LUCKEY_MCP_MODEL_HOURLY_LIMIT = '20';
    resetMcpModelBudgetForTests();
    setMcpNarrativeGeneratorForTests(async () => {
      modelCalls += 1;
      return '모델 리딩 확인 문장입니다. 광대 카드의 정방향 시작 의미를 유지하고, 오늘 저녁 전에 카드 이름을 한 줄로 적는 실천을 권합니다. 배열의 판정과 카드 이름은 바꾸지 않습니다.';
    });
    originalFetch = globalThis.fetch;
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      if (!url.startsWith('http://127.0.0.1') && !url.startsWith('http://localhost')) {
        externalCalls += 1;
        throw new Error('paid network must stay mocked');
      }
      return originalFetch(input, init);
    }) as typeof fetch;
    await startServer();
  });

  after(async () => {
    setMcpNarrativeGeneratorForTests(null);
    globalThis.fetch = originalFetch;
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });

  test('initialize and tools/list expose the reading tools', async () => {
    const initialized = await rpc('initialize', {
      protocolVersion: '2025-11-25',
      capabilities: {},
      clientInfo: { name: 'luckey-test', version: '0' },
    });
    assert.equal(initialized.status, 200);
    assert.equal(initialized.body.result.protocolVersion, '2025-11-25');
    assert.equal(initialized.body.result.serverInfo.name, 'luckey-readings');
    assert.ok(initialized.body.result.capabilities.tools);
    assert.ok(initialized.body.result.serverInfo.version);

    const listed = await rpc('tools/list');
    assert.equal(listed.status, 200);
    const names = listed.body.result.tools.map((tool: { name: string }) => tool.name);
    assert.deepEqual(names.sort(), ['list_tarot_spreads', 'read_saju', 'read_tarot']);
    const tarot = listed.body.result.tools.find((tool: { name: string }) => tool.name === 'read_tarot');
    assert.ok(tarot.inputSchema?.properties?.theme?.enum?.includes('celtic_cross'));
    assert.equal(externalCalls, 0);
  });

  test('list_tarot_spreads returns the app spreads', async () => {
    const response = await rpc('tools/call', { name: 'list_tarot_spreads', arguments: {} });
    const payload = toolPayload(response.body);
    const byId = new Map(payload.spreads.map((spread: { id: string; cardCount: number }) => [spread.id, spread.cardCount]));
    assert.equal(byId.get('daily_oracle_single'), 1);
    assert.equal(byId.get('yes_no_gate'), 3);
    assert.equal(byId.get('celtic_cross'), 10);
  });

  test('read_tarot uses the real deck and daily oracle', async () => {
    const response = await rpc('tools/call', {
      name: 'read_tarot',
      arguments: { theme: 'daily', question: '오늘의 타로', cards: [{ id: 'major_0', reversed: false }] },
    });
    const payload = toolPayload(response.body);
    assert.equal(payload.cards[0].id, 'major_0');
    assert.equal(payload.cards[0].nameKo, '광대');
    assert.equal(payload.spread.id, 'daily_oracle_single');
    assert.match(payload.reading, /광대/);
    assert.match(payload.reading, /시작/);
    assert.equal(payload.narrative, 'local');
    assert.ok(payload.dailyOracle?.remedy);
    assert.equal(modelCalls, 0);
  });

  test('read_tarot yes/no follows the app verdict', async () => {
    const response = await rpc('tools/call', {
      name: 'read_tarot',
      arguments: {
        theme: 'yes_no',
        question: '지금 이 제안을 진행해도 될까요?',
        cards: [
          { id: 'major_0', reversed: false },
          { id: 'major_1', reversed: false },
          { id: 'major_19', reversed: false },
        ],
      },
    });
    const payload = toolPayload(response.body);
    assert.equal(payload.spread.cardCount, 3);
    assert.match(payload.reading, /\[YES\]/);
  });

  test('read_tarot draws one card from the live deck when cards are omitted', async () => {
    const response = await rpc('tools/call', { name: 'read_tarot', arguments: { question: '오늘의 타로' } });
    const payload = toolPayload(response.body);
    assert.equal(payload.cards.length, 1);
    assert.ok(TAROT_DECK.some((card) => card.id === payload.cards[0].id));
    assert.match(payload.reading, /./);
  });

  test('invalid tool arguments are rejected', async () => {
    const theme = await rpc('tools/call', { name: 'read_tarot', arguments: { theme: 'poker' } });
    assert.equal(theme.body.result.isError, true);
    assert.match(theme.body.result.content[0].text, /Invalid enum value/);
    const count = await rpc('tools/call', {
      name: 'read_tarot',
      arguments: { theme: 'daily', cards: [{ id: 'major_0' }, { id: 'major_1' }] },
    });
    assert.equal(count.body.result.isError, true);
    const unknown = await rpc('tools/call', {
      name: 'read_tarot',
      arguments: { theme: 'daily', cards: [{ id: 'major_99' }] },
    });
    assert.equal(unknown.body.result.isError, true);
    assert.doesNotMatch(unknown.body.result.content[0].text, /major_99/);
  });

  test('saju and model calls without a valid token are unauthorized', async () => {
    const beforeCalls = modelCalls;
    const missing = await rpc('tools/call', {
      name: 'read_saju',
      arguments: { year: 1994, month: 1, day: 24 },
    });
    assert.equal(missing.status, 401);
    assert.equal(missing.text.includes('1994'), false);
    const wrong = await rpc('tools/call', {
      name: 'read_tarot',
      arguments: { narrative: 'model', theme: 'daily', cards: [{ id: 'major_0' }] },
    }, { token: 'not-the-configured-token-000000' });
    assert.equal(wrong.status, 401);
    assert.equal(modelCalls, beforeCalls);
    assert.equal(externalCalls, 0);
  });

  test('read_saju uses the app calendar for a known solar and lunar date', async () => {
    const solar = await rpc('tools/call', {
      name: 'read_saju',
      arguments: { year: 2000, month: 1, day: 1, birthtime: '12:00' },
    }, { token: TOKEN });
    const chart = toolPayload(solar.body);
    assert.equal(chart.solarEquivalentDate, '2000-01-01');
    assert.equal(chart.pillars.day.slice(0, 2), '戊午');
    assert.ok(chart.pillars.hour);
    assert.match(chart.daeun.current, /미확정/);
    assert.match(chart.shortDigest, /용신/);
    assert.equal(JSON.stringify(chart).includes('제제'), false);

    const leap = await rpc('tools/call', {
      name: 'read_saju',
      arguments: { year: 2023, month: 2, day: 1, isLunar: true, isLeapMonth: true },
    }, { token: TOKEN });
    const lunar = toolPayload(leap.body);
    assert.equal(lunar.solarEquivalentDate, '2023-03-22');
    assert.equal(lunar.isLunar, true);
  });

  test('read_saju rejects an impossible calendar date', async () => {
    const response = await rpc('tools/call', {
      name: 'read_saju',
      arguments: { year: 2026, month: 2, day: 30 },
    }, { token: TOKEN });
    assert.equal(response.body.result.isError, true);
    assert.equal(response.body.result.content[0].text.includes('2026-02-30'), false);
  });

  test('model narrative is mocked and rate limited', async () => {
    resetMcpModelBudgetForTests();
    process.env.LUCKEY_MCP_MODEL_HOURLY_LIMIT = '1';
    const first = await rpc('tools/call', {
      name: 'read_tarot',
      arguments: { narrative: 'model', theme: 'daily', question: '오늘의 타로', cards: [{ id: 'major_0', reversed: false }] },
    }, { token: TOKEN });
    const payload = toolPayload(first.body);
    assert.equal(payload.model.used, true);
    assert.match(payload.reading, /모델 리딩 확인 문장/);
    assert.equal(modelCalls, 1);
    assert.equal(externalCalls, 0);

    const second = await rpc('tools/call', {
      name: 'read_tarot',
      arguments: { narrative: 'model', theme: 'daily', cards: [{ id: 'major_0' }] },
    }, { token: TOKEN });
    assert.equal(second.status, 429);
    assert.equal(modelCalls, 1);
    process.env.LUCKEY_MCP_MODEL_HOURLY_LIMIT = '20';
    resetMcpModelBudgetForTests();
  });

  test('legacy JSON-RPC remains on the same route and streamable GET does not open SSE', async () => {
    const legacy = await rpc('tools/call', {
      name: 'get_saju_fortune',
      arguments: { year: 2000, month: 1, day: 1, birthtime: '12:00' },
    }, { accept: 'application/json' });
    assert.equal(legacy.status, 200);
    assert.equal(JSON.parse(legacy.body.result.content[0].text).pillars.day.slice(0, 2), '戊午');

    const stream = await fetch(`${base}/api/mcp`, { headers: { accept: 'text/event-stream' } });
    assert.equal(stream.status, 405);
    await stream.body?.cancel();

    const removed = await fetch(`${base}/api/mcp`, { method: 'DELETE' });
    assert.equal(removed.status, 405);
    await removed.body?.cancel();
  });
});
