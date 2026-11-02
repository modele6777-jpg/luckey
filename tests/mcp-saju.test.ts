import assert from 'node:assert/strict';
import test from 'node:test';
import { processMCPJsonRpc } from '../server/api-lib/mcpHandler';

async function fortune(args: Record<string, unknown>) {
  const response = await processMCPJsonRpc({
    jsonrpc: '2.0', id: 1, method: 'tools/call',
    params: { name: 'get_saju_fortune', arguments: args },
  });
  assert.ok(!response.error, response.error?.message);
  return JSON.parse(response.result.content[0].text);
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

test('MCP saju rejects invalid calendar dates', async () => {
  const response = await processMCPJsonRpc({
    jsonrpc: '2.0', id: 2, method: 'tools/call',
    params: { name: 'get_saju_fortune', arguments: { year: 2026, month: 2, day: 30 } },
  });
  assert.ok(response.error);
});


test('MCP daily tarot tool returns a card and reading', async () => {
  const response = await processMCPJsonRpc({
    jsonrpc: '2.0', id: 2, method: 'tools/call',
    params: { name: 'get_daily_tarot', arguments: {} },
  });
  assert.ok(!response.error, response.error?.message);
  assert.ok(response.result?.content?.[0]?.text);
  const payload = JSON.parse(response.result.content[0].text);
  assert.ok(payload.card?.id !== undefined);
  assert.ok(payload.reading);
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
