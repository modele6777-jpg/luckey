import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import test from 'node:test';
import express from 'express';
import { calculateDetailedSaju } from '../src/lib/sajuAnalysis';
import { sajuChartFromInput } from '../server/api-lib/sajuChartApi';
import { handleMCPDirectPost, processMCPJsonRpc } from '../server/api-lib/mcpHandler';
import { setReadingApiFetchForTests } from '../server/api-lib/readingApiClient';
import { handleSitesApi } from '../server/sites-api';

const TOKEN = 'luckey-mcp-test-token-0123456789';

function chart(input: { year: number; month: number; day: number; birthtime?: string; isLunar?: boolean; isLeapMonth?: boolean }) {
  const api = sajuChartFromInput(input);
  const app = calculateDetailedSaju({
    basic: {
      birthdate: api.birthdate,
      birthtime: input.birthtime,
      lunarSolar: input.isLunar ? 'lunar' : 'solar',
      isLeapMonth: input.isLeapMonth,
    },
  })!;
  return { api, app };
}

test('reported 2024 and 2023 charts keep surface counts apart from the day master', () => {
  const june3 = chart({ year: 2024, month: 6, day: 3, birthtime: '12:00' });
  assert.equal(june3.api.pillars.year.slice(0, 2), '甲辰');
  assert.equal(june3.api.pillars.month.slice(0, 2), '己巳');
  assert.equal(june3.api.pillars.day.slice(0, 2), '戊戌');
  assert.equal(june3.api.pillars.hour?.slice(0, 2), '戊午');
  assert.equal(june3.api.dayMasterElement, '토');
  assert.deepEqual(june3.api.elementBalance, { 목: 1, 화: 2, 토: 5, 금: 0, 수: 0 });
  assert.equal(june3.api.interpretation, june3.app.elements.summary);
  assert.match(june3.api.interpretation, /戊土/);
  assert.match(june3.api.interpretation, /표면 개수는 목 1 화 2 토 5 금 0 수 0/);
  assert.match(june3.api.interpretation, /금·수/);
  assert.match(june3.api.interpretation, /건강·재물·운명을 정하지 않습니다/);
  assert.match(june3.api.interpretation, /戊午/);
  assert.doesNotMatch(june3.api.interpretation, /보충이 필요|안정적인 구조|골고루/);
  assert.match(june3.app.elements.lacking.remedy, /단정하지 않습니다/);

  const noon = chart({ year: 2024, month: 6, day: 7, birthtime: '12:00' });
  assert.equal(noon.api.pillars.day.slice(0, 2), '壬寅');
  assert.equal(noon.api.dayMasterElement, '수');
  assert.equal((noon.api.elementBalance as { 화: number }).화, 3);
  assert.match(noon.api.interpretation, /일간 오행과 다릅니다/);
  assert.doesNotMatch(noon.api.interpretation, /중심 기운인 화|중심 기운으로/);

  const early = chart({ year: 2024, month: 6, day: 7, birthtime: '01:30' });
  const late = chart({ year: 2024, month: 6, day: 7, birthtime: '21:30' });
  assert.notEqual(early.api.pillars.hour, late.api.pillars.hour);
  assert.notDeepEqual(early.api.elementBalance, late.api.elementBalance);
  assert.notEqual(early.api.interpretation, late.api.interpretation);
  assert.match(early.api.interpretation, /辛丑/);
  assert.match(late.api.interpretation, /辛亥/);
  assert.equal(early.api.dayMasterElement, late.api.dayMasterElement);

  const unknown = chart({ year: 2024, month: 6, day: 1 });
  assert.equal(unknown.api.pillars.hour, null);
  assert.equal(unknown.api.pillars.day.slice(0, 2), '丙申');
  assert.deepEqual(unknown.api.elementBalance, { 목: 1, 화: 2, 토: 2, 금: 1, 수: 0 });
  assert.match(unknown.api.interpretation, /6글자만의 부분 결과/);
  assert.match(unknown.api.interpretation, /안정적이라고 단정하지 않습니다/);
  assert.doesNotMatch(unknown.api.interpretation, /골고루|안정적인 구조/);

  const leap = chart({ year: 2023, month: 2, day: 1, birthtime: '12:00', isLunar: true, isLeapMonth: true });
  assert.equal(leap.api.solarEquivalentDate, '2023-03-22');
  assert.equal(leap.api.pillars.day.slice(0, 2), '己卯');
  assert.equal(leap.api.dayMasterElement, '토');
  assert.equal((leap.api.elementBalance as { 목: number }).목, 4);
  assert.match(leap.api.interpretation, /일간 오행과 다릅니다/);
  assert.doesNotMatch(leap.api.interpretation, /중심 기운인 목/);

  assert.ok(june3.app.pillars.day.tenGodGan);
  assert.ok(june3.app.pillars.day.hiddenStems);
  assert.ok(june3.app.daewunDetail);
  assert.match(june3.app.daeun.current, /대운 미확정/);
  assert.equal('daewunDetail' in june3.api, false);
  assert.equal('tenGods' in june3.api, false);
});

test('legacy and streamable saju tools return the same chart interpretation', async () => {
  process.env.LUCKEY_MCP_TOKEN = TOKEN;
  process.env.LUCKEY_API_ORIGIN = 'http://127.0.0.1:9';
  const input = { year: 2024, month: 6, day: 7, birthtime: '12:00', isLunar: false };
  const api = sajuChartFromInput(input);
  let paid = false;
  const sites = await handleSitesApi(new Request('https://audit.invalid/api/saju/chart', {
    method: 'POST', body: JSON.stringify(input),
  }), { gemini: 'test-private-key' }, (async () => { paid = true; return new Response(''); }) as typeof fetch);
  assert.equal(paid, false);
  assert.equal((await sites!.json()).interpretation, api.interpretation);

  setReadingApiFetchForTests(async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    return new Response(JSON.stringify(sajuChartFromInput(body)), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  const app = express();
  app.use(express.json());
  app.post('/api/mcp', (req, res) => void handleMCPDirectPost(req, res));
  const server: Server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no port');
  try {
    const legacy = await processMCPJsonRpc({
      jsonrpc: '2.0', id: 1, method: 'tools/call',
      params: { name: 'get_saju_fortune', arguments: input },
    }, { authorized: true });
    assert.equal(JSON.parse(legacy.result.content[0].text).interpretation, api.interpretation);

    const response = await fetch(`http://127.0.0.1:${address.port}/api/mcp`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
        authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'read_saju', arguments: input } }),
    });
    const body = await response.json() as { result: { content: { text: string }[] } };
    assert.equal(JSON.parse(body.result.content[0].text).chart.interpretation, api.interpretation);
  } finally {
    setReadingApiFetchForTests(null);
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
