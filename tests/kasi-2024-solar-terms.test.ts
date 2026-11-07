import assert from 'node:assert/strict';
import test from 'node:test';
import { getYearSolarTerms } from '../src/lib/astronomicalSolarTerms';
import { sajuChartFromInput } from '../server/api-lib/sajuChartApi';
import { processMCPJsonRpc } from '../server/api-lib/mcpHandler';
import { setReadingApiFetchForTests } from '../server/api-lib/readingApiClient';
import { handleSitesApi } from '../server/sites-api';

// Retrieved 2026-11-07.
// Official dates, no clock: 과학기술정보통신부 공고 제2023-0641호, 관보 2023-06-23.
// https://www.kasi.re.kr/kor/publication/post/newsMaterial/29633
// https://www.kasi.re.kr/file/1687408104839_1.hwp
// https://gwanbo.go.kr/ezpdf/customLayout.jsp?contentId=I0000000000000001687328191439000&tocId=I0000000000000001686831567351000&isTocOrder=N
// The gazette PDF lists month and day only.
// Minutes are a substitution from KASI's own calendar file, which that page says is not the official announcement:
// https://astro.kasi.re.kr/kor/life/post/calendarData?year=2024
// https://astro.kasi.re.kr/file/1785891710574_1.txt
// Those minutes have no seconds. The engine is not retuned to them.

const TERMS: { name: string; month: number; day: number; hour: number; minute: number; jie: boolean }[] = [
  { name: '소한', month: 1, day: 6, hour: 5, minute: 49, jie: true },
  { name: '대한', month: 1, day: 20, hour: 23, minute: 7, jie: false },
  { name: '입춘', month: 2, day: 4, hour: 17, minute: 27, jie: true },
  { name: '우수', month: 2, day: 19, hour: 13, minute: 13, jie: false },
  { name: '경칩', month: 3, day: 5, hour: 11, minute: 23, jie: true },
  { name: '춘분', month: 3, day: 20, hour: 12, minute: 6, jie: false },
  { name: '청명', month: 4, day: 4, hour: 16, minute: 2, jie: true },
  { name: '곡우', month: 4, day: 19, hour: 23, minute: 0, jie: false },
  { name: '입하', month: 5, day: 5, hour: 9, minute: 10, jie: true },
  { name: '소만', month: 5, day: 20, hour: 22, minute: 0, jie: false },
  { name: '망종', month: 6, day: 5, hour: 13, minute: 10, jie: true },
  { name: '하지', month: 6, day: 21, hour: 5, minute: 51, jie: false },
  { name: '소서', month: 7, day: 6, hour: 23, minute: 20, jie: true },
  { name: '대서', month: 7, day: 22, hour: 16, minute: 44, jie: false },
  { name: '입추', month: 8, day: 7, hour: 9, minute: 9, jie: true },
  { name: '처서', month: 8, day: 22, hour: 23, minute: 55, jie: false },
  { name: '백로', month: 9, day: 7, hour: 12, minute: 11, jie: true },
  { name: '추분', month: 9, day: 22, hour: 21, minute: 44, jie: false },
  { name: '한로', month: 10, day: 8, hour: 4, minute: 0, jie: true },
  { name: '상강', month: 10, day: 23, hour: 7, minute: 15, jie: false },
  { name: '입동', month: 11, day: 7, hour: 7, minute: 20, jie: true },
  { name: '소설', month: 11, day: 22, hour: 4, minute: 56, jie: false },
  { name: '대설', month: 12, day: 7, hour: 0, minute: 17, jie: true },
  { name: '동지', month: 12, day: 21, hour: 18, minute: 21, jie: false },
];

function wall(date: Date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    time: `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`,
  };
}

function shift(month: number, day: number, hour: number, minute: number, delta: number) {
  return wall(new Date(Date.UTC(2024, month - 1, day, hour, minute + delta)));
}

function chart(clock: { year: number; month: number; day: number; time: string }) {
  const result = sajuChartFromInput({ year: clock.year, month: clock.month, day: clock.day, birthtime: clock.time });
  return { year: result.pillars.year, month: result.pillars.month };
}

test('2024 term dates match the gazette and minutes are classified against the KASI file', () => {
  const terms = getYearSolarTerms(2024);
  assert.equal(terms.length, 24);
  let match = 0;
  let ambiguous = 0;
  let mismatch = 0;
  for (const row of TERMS) {
    const term = terms.find((item) => item.name === row.name);
    assert.ok(term, row.name);
    const date = term.date;
    assert.equal(date.getUTCFullYear(), 2024, row.name);
    assert.equal(date.getUTCMonth() + 1, row.month, row.name);
    assert.equal(date.getUTCDate(), row.day, row.name);
    const published = Date.UTC(2024, row.month - 1, row.day, row.hour, row.minute);
    const deltaMs = date.getTime() - published;
    const sameMinute = date.getUTCHours() === row.hour && date.getUTCMinutes() === row.minute;
    if (sameMinute) match += 1;
    else if (Math.abs(deltaMs) < 60_000) ambiguous += 1;
    else mismatch += 1;
    assert.ok(Math.abs(deltaMs) < 15 * 60_000, row.name);
  }
  assert.equal(match, 0);
  assert.equal(ambiguous, 2);
  assert.equal(mismatch, 22);
});

test('zhongqi do not move year or month, and only ipchun moves the year', async () => {
  process.env.LUCKEY_MCP_TOKEN = 'luckey-mcp-test-token-0123456789';
  process.env.LUCKEY_API_ORIGIN = 'https://readings.example';
  let paid = false;
  setReadingApiFetchForTests(async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    return new Response(JSON.stringify(sajuChartFromInput(body)), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  const read = async (clock: { year: number; month: number; day: number; time: string }) => {
    const direct = chart(clock);
    const sitesResponse = await handleSitesApi(new Request('https://audit.invalid/api/saju/chart', {
      method: 'POST',
      body: JSON.stringify({ year: clock.year, month: clock.month, day: clock.day, birthtime: clock.time }),
    }), {}, (async () => { paid = true; return new Response(''); }) as typeof fetch);
    assert.equal(sitesResponse?.status, 200);
    const sites = await sitesResponse!.json() as { pillars: { year: string; month: string } };
    const mcp = await processMCPJsonRpc({
      jsonrpc: '2.0', id: 1, method: 'tools/call',
      params: { name: 'get_saju_fortune', arguments: { year: clock.year, month: clock.month, day: clock.day, birthtime: clock.time, isLunar: false } },
    }, { authorized: true });
    assert.ok(!mcp.error, mcp.error?.message);
    const echoed = JSON.parse(mcp.result.content[0].text) as { pillars: { year: string; month: string } };
    assert.equal(sites.pillars.year, direct.year);
    assert.equal(sites.pillars.month, direct.month);
    assert.equal(echoed.pillars.year, direct.year);
    assert.equal(echoed.pillars.month, direct.month);
    return direct;
  };
  try {
    let jieSplit = 0;
    let jieAlready = 0;
    for (const row of TERMS) {
      const before = await read(shift(row.month, row.day, row.hour, row.minute, -1));
      const at = await read(shift(row.month, row.day, row.hour, row.minute, 0));
      const after = await read(shift(row.month, row.day, row.hour, row.minute, 1));
      if (!row.jie) {
        assert.equal(before.year, at.year, row.name);
        assert.equal(at.year, after.year, row.name);
        assert.equal(before.month, at.month, row.name);
        assert.equal(at.month, after.month, row.name);
        continue;
      }
      if (before.month === after.month) {
        jieAlready += 1;
        assert.equal(at.month, before.month, row.name);
      } else {
        // 발표 분과 1분 미만으로 겹치면 그 분의 절 전환은 초를 몰라 단정하지 않는다.
        jieSplit += 1;
      }
      if (row.name !== '입춘') assert.equal(before.year, after.year, row.name);
    }
    assert.equal(jieSplit, 1);
    assert.equal(jieAlready, 11);
    const ipchun = getYearSolarTerms(2024).find((term) => term.name === '입춘');
    assert.ok(ipchun);
    const shown = wall(new Date(Date.UTC(ipchun.date.getUTCFullYear(), ipchun.date.getUTCMonth(), ipchun.date.getUTCDate(), ipchun.date.getUTCHours(), ipchun.date.getUTCMinutes())));
    const crossed = ipchun.date.getTime() === Date.UTC(shown.year, shown.month - 1, shown.day, ipchun.date.getUTCHours(), ipchun.date.getUTCMinutes())
      ? shown
      : wall(new Date(Date.UTC(shown.year, shown.month - 1, shown.day, ipchun.date.getUTCHours(), ipchun.date.getUTCMinutes() + 1)));
    const stillBefore = wall(new Date(Date.UTC(crossed.year, crossed.month - 1, crossed.day, Number(crossed.time.slice(0, 2)), Number(crossed.time.slice(3)) - 1)));
    const early = await read(stillBefore);
    const late = await read(crossed);
    assert.notEqual(early.year, late.year);
    assert.notEqual(early.month, late.month);
    const sohan = await read(shift(1, 6, 5, 49, 1));
    const dongji = await read(shift(12, 21, 18, 21, 0));
    assert.notEqual(sohan.year, dongji.year);
    assert.equal(paid, false);
  } finally {
    setReadingApiFetchForTests(null);
  }
});
