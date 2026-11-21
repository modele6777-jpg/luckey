import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';
import express from 'express';
import { handleSajuChartPost } from '../server/api-lib/sajuChartRoute.ts';

const repo = path.resolve(import.meta.dirname, '..');

function read(relativePath: string): string {
  return readFileSync(path.join(repo, relativePath), 'utf8');
}

function parseRouteExpression(source: string, index: number): string[] {
  const start = source[index];
  if (start === '[') {
    const end = source.indexOf(']', index);
    const inside = source.slice(index + 1, end);
    const paths: string[] = [];
    for (const match of inside.matchAll(/(['"])((?:\\.|(?!\1).)*)\1/g)) {
      paths.push(match[2].replace(/\\\//g, '/'));
    }
    for (const match of inside.matchAll(/\/((?:\\.|[^/\n])+)\/[gimsuy]*/g)) {
      paths.push(`re:${match[1]}`);
    }
    return paths;
  }
  if (start === '"' || start === "'") {
    let cursor = index + 1;
    let value = '';
    while (cursor < source.length && source[cursor] !== start) {
      if (source[cursor] === '\\') {
        value += source[cursor + 1] ?? '';
        cursor += 2;
        continue;
      }
      value += source[cursor];
      cursor += 1;
    }
    return [value];
  }
  if (start === '/') {
    let cursor = index + 1;
    let value = '';
    while (cursor < source.length && source[cursor] !== '/') {
      value += source[cursor];
      cursor += 1;
    }
    return [`re:${value}`];
  }
  return [];
}

function extractExpressRoutes(source: string): Set<string> {
  const routes = new Set<string>();
  for (const match of source.matchAll(/app\.(get|post|put|patch|delete|all)\(/g)) {
    const declared = match[1].toUpperCase();
    let index = (match.index ?? 0) + match[0].length;
    while (/\s/.test(source[index] ?? '')) index += 1;
    const methods = declared === 'ALL' ? ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'] : [declared];
    if (declared === 'GET') methods.push('HEAD');
    for (const routePath of parseRouteExpression(source, index)) {
      if (!routePath.startsWith('/') && !routePath.startsWith('re:')) continue;
      for (const method of methods) routes.add(`${method} ${routePath}`);
    }
  }
  return routes;
}

function dedicatedFunctionRoutes(): Set<string> {
  const routes = new Set<string>();
  const files: Array<[string, string]> = [
    ['api/ai/tts.ts', '/api/ai/tts'],
    ['api/ai/daily-bgm.ts', '/api/ai/daily-bgm'],
    ['api/muse/docent.ts', '/api/muse/docent'],
    ['api/bluebird/docent.ts', '/api/bluebird/docent'],
    ['api/muse/artwork-image.ts', '/api/muse/artwork-image'],
    ['api/muse/artwork-image/proxy.ts', '/api/muse/artwork-image/proxy'],
    ['api/health.ts', '/api/health'],
  ];
  for (const [file, routePath] of files) {
    const source = read(file);
    const methods = new Set<string>();
    if (/method === ["']GET["']/.test(source)) methods.add('GET');
    if (/method === ["']HEAD["']/.test(source)) methods.add('HEAD');
    if (/method === ["']POST["']/.test(source) || /method !== ["']POST["']/.test(source)) methods.add('POST');
    if (methods.size === 0) methods.add('GET');
    if (methods.has('GET')) methods.add('HEAD');
    for (const method of methods) routes.add(`${method} ${routePath}`);
  }
  return routes;
}

function jsonResponse() {
  let statusCode = 200;
  let payload: unknown = null;
  const res = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(body: unknown) {
      payload = body;
      return res;
    },
  };
  return {
    res: res as unknown as express.Response,
    read: () => ({ status: statusCode, body: payload as { error?: string; code?: string; pillars?: { day?: string } } }),
  };
}

describe('Render server registers every Vercel API route', () => {
  test('server.app.ts covers api/index.ts and the dedicated Vercel functions', () => {
    const vercel = extractExpressRoutes(read('api/index.ts'));
    for (const route of dedicatedFunctionRoutes()) vercel.add(route);
    const render = extractExpressRoutes(read('server.app.ts'));
    const missing = [...vercel].filter((route) => !render.has(route)).sort();
    assert.deepEqual(missing, [], `Render server is missing Vercel API routes:\n${missing.join('\n')}`);
    assert.equal(render.has('POST /api/saju/chart'), true);
    assert.equal(render.has('GET /api/ai/daily-bgm'), true);
    assert.equal(render.has('POST /api/ai/tts'), true);

    const server = read('server.app.ts');
    const saju = server.slice(server.indexOf('app.post("/api/saju/chart"'), server.indexOf('app.post("/api/ai/daily-tarot"'));
    assert.match(saju, /handleSajuChartPost/);
    const bgm = server.slice(server.indexOf('app.get("/api/ai/daily-bgm"'), server.indexOf('app.post("/api/ai/daily-bgm"'));
    assert.match(bgm, /readDailyBgmParams/);
    assert.match(bgm, /replyDailyBgm/);
    const tts = server.slice(server.indexOf('app.post("/api/ai/tts"'), server.indexOf('handleTTS'));
    assert.match(tts, /Empty speech text/);
  });

  test('saju chart route uses the shared calculator: valid 200, empty body 400', () => {
    const valid = jsonResponse();
    handleSajuChartPost({ body: { year: 1990, month: 5, day: 15, birthtime: '13:30', isLunar: false } } as express.Request, valid.res);
    const chart = valid.read();
    assert.equal(chart.status, 200);
    assert.equal(typeof chart.body.pillars?.day, 'string');

    const empty = jsonResponse();
    handleSajuChartPost({ body: {} } as express.Request, empty.res);
    const invalid = empty.read();
    assert.equal(invalid.status, 400);
    assert.equal(typeof invalid.body.code, 'string');
    assert.equal(invalid.body.error?.includes('Cannot POST'), false);
  });
});
