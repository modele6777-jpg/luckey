// Stateless audit only. Never call production sync, relay or reset endpoints.
// Runtime configuration (including the API key) is accepted on hidden stdin.
import { pathToFileURL } from 'node:url';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const workerPath = process.argv[2];
const outputPath = process.argv[3];
if (!workerPath) throw new Error('Provide the locally built Sites Worker path.');
const { default: worker } = await import(pathToFileURL(path.resolve(workerPath)).href);

async function readConfiguration() {
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.resume();
  console.log('Ready for hidden runtime configuration on stdin.');
  return new Promise((resolve, reject) => {
    let input = '';
    const onData = data => {
      input += data.toString();
      if (!/[\r\n]/.test(input)) return;
      process.stdin.removeListener('data', onData);
      process.stdin.pause();
      try { const configuration = JSON.parse(input.trim()); input = ''; resolve(configuration); }
      catch { reject(new Error('Invalid runtime configuration.')); }
    };
    process.stdin.on('data', onData);
  });
}

const env = await readConfiguration();
const results = [];
const chatPath = '/api/openai/v1/chat/completions';
for (const test of [
  { name: 'common-text', body: { messages: [{ role: 'user', content: 'Reply only OK.' }], max_tokens: 96 } },
  { name: 'common-stream', body: { messages: [{ role: 'user', content: 'Reply only OK.' }], stream: true, max_tokens: 96 } },
  { name: 'common-json', body: { messages: [{ role: 'user', content: 'Return only the JSON object {"ok":true}.' }], response_format: { type: 'json_object' }, max_tokens: 128 } },
]) {
  try {
    const response = await worker.fetch(new Request(`https://audit.invalid${chatPath}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test.body), signal: AbortSignal.timeout(30000),
    }), env);
    const body = await response.text();
    let valid = false;
    if (test.body.stream) {
      valid = body.includes('[DONE]') && body.split('\n').some(line => {
        try { return Boolean(JSON.parse(line.replace(/^data:\s*/, '')).choices?.[0]?.delta?.content); }
        catch { return false; }
      });
    } else {
      try {
        const content = JSON.parse(body).choices?.[0]?.message?.content;
        valid = test.name === 'common-json' ? JSON.parse(content).ok === true : typeof content === 'string' && content.trim().length > 0;
      } catch {}
    }
    results.push({ name: test.name, path: chatPath, status: response.status, valid: response.ok && valid, scope: 'built-worker-and-live-Google' });
  } catch {
    results.push({ name: test.name, path: chatPath, status: 'connection-failed', valid: false, scope: 'built-worker-and-live-Google' });
  }
}

// With no upstream configured these return before any external request or write.
const specializedRoutes = [
  '/api/ai', '/api/ai/image', '/api/ai/tts', '/api/ai/analyze-entry',
  '/api/ai/daily-bgm', '/api/ai/recommend-art', '/api/ai/daily-tarot',
  '/api/ai/daily-sedona', '/api/ai/secret-blessing', '/api/ai/secret-mood-recommend',
  '/api/muse/docent', '/api/bluebird/docent', '/api/muse/artwork-image',
  '/api/muse/artwork-image/proxy',
];
for (const route of specializedRoutes) {
  if (env.LUCKEY_API_ORIGIN) {
    results.push({ path: route, status: 'not-probed', reason: 'upstream-present-handler-review-required' });
    continue;
  }
  const response = await worker.fetch(new Request(`https://audit.invalid${route}`, {
    method: route.endsWith('/proxy') ? 'GET' : 'POST',
  }), env);
  results.push({ path: route, status: response.status, valid: response.ok, scope: 'local-worker-with-production-configuration', reason: 'LUCKEY_API_ORIGIN-missing' });
}
const report = { checkedAt: new Date().toISOString(), keyNames: Object.keys(env), results };
if (outputPath) await writeFile(outputPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.stdin.destroy();
