import assert from 'node:assert/strict';
import test from 'node:test';
import { processMCPJsonRpc } from '../server/api-lib/mcpHandler';
import { sajuChartFromInput } from '../server/api-lib/sajuChartApi';
import { setReadingApiFetchForTests } from '../server/api-lib/readingApiClient';
import { handleSitesApi } from '../server/sites-api';

function fortune(args: Record<string, unknown>) {
  return sajuChartFromInput(args);
}

test('MCP saju uses birth year instead of hardcoded 2026', async () => {
  const earlier = await fortune({ year: 1994, month: 1, day: 24 });
  const later = await fortune({ year: 2026, month: 6, day: 15 });
  assert.notEqual(earlier.pillars.year.slice(0, 2), later.pillars.year.slice(0, 2));
  assert.notEqual(earlier.pillars.year.slice(0, 2), '丙午');
});

test('MCP saju calculates known day pillars and late-night rollover', async () => {
  const noon = await fortune({ year: 2000, month: 1, day: 1, birthtime: '12:00' });
  const late = await fortune({ year: 2000, month: 1, day: 1, birthtime: '23:30' });
  assert.equal(noon.pillars.day.slice(0, 2), '戊午');
  assert.equal(late.pillars.day.slice(0, 2), '己未');
  assert.ok(noon.pillars.hour);
  const unknown = await fortune({ year: 2000, month: 1, day: 1 });
  assert.equal(unknown.pillars.hour, null);
});

test('MCP saju distinguishes lunar leap months', async () => {
  const regular = await fortune({ year: 2023, month: 2, day: 1, isLunar: true });
  const leap = await fortune({ year: 2023, month: 2, day: 1, isLunar: true, isLeapMonth: true });
  assert.equal(leap.solarEquivalentDate, '2023-03-22');
  assert.notEqual(regular.solarEquivalentDate, leap.solarEquivalentDate);
});

test('MCP saju chart route rejects invalid calendar dates', () => {
  assert.throws(() => fortune({ year: 2026, month: 2, day: 30 }));
});

test('legacy saju and daily tarot tools call the reading APIs and do not read the response from MCP math', async () => {
  const calls: { url: string; body: any; authorization?: string }[] = [];
  process.env.LUCKEY_MCP_TOKEN = 'luckey-mcp-test-token-0123456789';
  process.env.LUCKEY_API_ORIGIN = 'https://readings.example/ignored-path';
  setReadingApiFetchForTests(async (url, init) => {
    const headers = new Headers(init?.headers);
    calls.push({ url: String(url), body: JSON.parse(String(init?.body)), authorization: headers.get('authorization') || undefined });
    const path = new URL(String(url)).pathname;
    if (path === '/api/saju/chart') return new Response(JSON.stringify({ pillars: { day: 'FROM-API' } }), { status: 200 });
    return new Response(JSON.stringify({ diagnosis: 'API 진단' }), { status: 400, headers: { 'content-type': 'application/json' } });
  });
  try {
    const denied = await processMCPJsonRpc({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'get_saju_fortune', arguments: { year: 2000, month: 1, day: 1 } } });
    assert.match(denied.error.message, /인증/);
    assert.equal(calls.length, 0);
    const chart = await processMCPJsonRpc({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'get_saju_fortune', arguments: { year: 1994, month: 1, day: 24, birthtime: '12:00', isLunar: false } } }, { authorized: true });
    assert.equal(JSON.parse(chart.result.content[0].text).pillars.day, 'FROM-API');
    assert.equal(calls[0].url, 'https://readings.example/api/saju/chart');
    assert.equal(calls[0].body.year, 1994);
    assert.equal(calls[0].body.birthtime, '12:00');
    assert.equal(calls[0].authorization, undefined);
    const tarot = await processMCPJsonRpc({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'get_daily_tarot', arguments: { cardId: 'major_0', reversed: true, concern: '오늘의 타로' } } }, { authorized: true });
    assert.match(tarot.error.message, /리딩 API 400/);
    assert.equal(calls[1].url, 'https://readings.example/api/ai/daily-tarot');
    assert.equal(calls[1].body.card.id, 'major_0');
    assert.equal(calls[1].body.card.reversed, true);
    assert.equal(calls[1].body.mode, 'oracle');
    assert.equal(calls[1].body.profile.fate.currentWorry, '오늘의 타로');
    assert.equal(calls[1].authorization, undefined);
    const oracle = await processMCPJsonRpc({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'consult_oracle', arguments: { question: '테스트' } } }, { authorized: true });
    assert.equal(oracle.error.code, -32002);
    assert.match(oracle.error.message, /HTTP API는 없습니다/);
    assert.equal(calls.length, 2);
  } finally {
    setReadingApiFetchForTests(null);
  }
});


test('Sites saju chart route uses the app calculation and does not call Gemini', async () => {
  let called = false;
  const response = await handleSitesApi(new Request('https://audit.invalid/api/saju/chart', {
    method: 'POST', body: JSON.stringify({ year: 2000, month: 1, day: 1, birthtime: '12:00' }),
  }), { gemini: 'test-private-key' }, (async () => { called = true; return new Response(''); }) as typeof fetch);
  assert.equal(called, false);
  assert.equal(response?.status, 200);
  const body = await response!.json();
  assert.equal(body.pillars.day.slice(0, 2), '戊午');
});

test('MCP art prescriptions return one of several curated artworks', async () => {
  const titles = new Set<string>();
  for (let i = 0; i < 30; i++) {
    const response = await processMCPJsonRpc({ jsonrpc: '2.0', id: i + 10, method: 'tools/call', params: { name: 'get_art_prescription', arguments: {} } });
    assert.ok(!response.error, response.error?.message);
    const item = JSON.parse(response.result.content[0].text);
    assert.ok(item.artwork?.title);
    assert.ok(item.artwork?.artist);
    assert.ok(item.prescription);
    titles.add(item.artwork.title);
  }
  assert.ok(titles.size > 1, 'art prescription should not always return the same artwork');
});

test('MCP art prescription follows emotion and excludes recent titles', async () => {
  const call = async (arguments_: Record<string, unknown>) => {
    const response = await processMCPJsonRpc({ jsonrpc: '2.0', id: 99, method: 'tools/call', params: { name: 'get_art_prescription', arguments: arguments_ } });
    assert.ok(!response.error, response.error?.message);
    return JSON.parse(response.result.content[0].text);
  };
  const anxious = await call({ emotion: '불안' });
  assert.ok(['수련 (Water Lilies)', '그랑드 자트 섬의 일요일 오후 (A Sunday Afternoon on the Island of La Grande Jatte)'].includes(anxious.artwork.title));
  const love = await call({ emotion: '설렘', excludeTitles: ['키스 (The Kiss)'] });
  assert.equal(love.artwork.title, '그랑드 자트 섬의 일요일 오후 (A Sunday Afternoon on the Island of La Grande Jatte)');
  const curious = await call({ emotion: '호기심' });
  assert.equal(curious.artwork.title, '진주 귀걸이를 한 소녀 (Girl with a Pearl Earring)');
});
