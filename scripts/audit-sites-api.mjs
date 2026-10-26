// Stateless audit only. Never call production sync, relay or reset endpoints.
// Runtime configuration (including the API key) is accepted on hidden stdin.
import { pathToFileURL } from 'node:url';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const workerPath = process.argv[2];
const outputPath = process.argv[3];
const liveMedia = process.argv.includes('--live-media');
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

// Only known, stateless native handlers are tested. A native health response is
// required so an older build cannot forward fixtures into an unknown server.
const healthResponse = await worker.fetch(new Request('https://audit.invalid/api/health'), env);
const health = await healthResponse.json().catch(() => null);
const original = 'https://www.dailyartmagazine.com/wp-content/uploads/2025/08/chagall_paris_window-1024x983.jpg';
const cases = [
  { path: '/api/ai', body: { prompt: '한 문장으로 인사해 주세요.' }, check: d => typeof d.text === 'string' && d.text.length > 0 },
  { path: '/api/ai/analyze-entry', body: { content: '오늘 책을 읽어서 기뻤다.', type: 'diary' }, check: d => Array.isArray(d.keywords) && d.keywords.length > 0 && Array.isArray(d.emotions) },
  { path: '/api/ai/daily-bgm', body: { focusPlaylist: '고요한 피아노', dateKey: '2026-10-26', trackKey: 'api-audit' }, check: d => d.encoding === 'wav' && atob(d.audioContent).startsWith('RIFF') && d.durationSec === 48 },
  { path: '/api/ai/recommend-art', body: { currentMood: '평온함', moodId: 'quiet', dateKey: '2026-10-26' }, check: d => d.catalogId && d.whyRecommended && d.challenges?.length === 2 },
  { path: '/api/ai/daily-tarot', body: { card: { name: 'The Star', nameKo: '별', keywords: ['희망', '회복'], type: 'major' } }, check: d => d.diagnosis && d.remedy && d.focusPlaylist },
  { path: '/api/ai/daily-sedona', body: { card: { nameKo: '허용', desc: '감정을 자연스럽게 허용하기', keywords: ['허용', '평온'] }, theme: '일상 감정' }, check: d => d.diagnosis && d.remedy },
  { path: '/api/ai/secret-blessing', body: { content: '오늘 하루를 마치고 잠시 쉬고 싶어요.' }, check: d => typeof d.comfortMantra === 'string' && d.comfortMantra.length > 0 },
  { path: '/api/ai/secret-mood-recommend', body: { content: '함께 도와준 친구에게 고마워요.' }, check: d => d.moodTag === 'gratitude' && d.moodLabel && d.reason },
  { path: '/api/muse/docent', body: { title: '별이 빛나는 밤', creator: '빈센트 반 고흐', messages: [{ role: 'user', content: '작품의 색을 한국어 한 문장으로 설명해 주세요.' }] }, check: d => typeof d.reply === 'string' && d.reply.length > 0 },
  { path: '/api/bluebird/docent', body: { title: '고요한 숲', theme: '차분함', prompt: '초록빛 숲 풍경', messages: [{ role: 'user', content: '한 문장으로 짧게 감상을 말해 주세요.' }] }, check: d => typeof d.reply === 'string' && d.reply.length > 0 },
  { path: '/api/muse/artwork-image', body: { title: '창 너머의 파리', dailyArtImageUrl: original }, check: d => d.url === original && d.displayUrl?.startsWith('/api/muse/artwork-image/proxy') },
  { path: '/api/muse/artwork-image/proxy?url=' + encodeURIComponent(original), binary: true },
  { path: '/api/ai/tts', media: true, body: { text: '안녕하세요. 편안한 하루 보내세요.', voice: 'Kore' }, check: d => d.encoding === 'wav' && atob(d.audioContent).startsWith('RIFF') && d.sampleRate === 24000 },
  { path: '/api/ai/image', media: true, body: { prompt: 'A minimal flat blue flower icon on a white background. No text.', aspectRatio: '1:1' }, check: d => /^data:image\//.test(d.imageUrl) },
];
for (const test of cases) {
  if (health?.runtime !== 'sites' || (test.media && !liveMedia)) {
    results.push({ path: test.path.split('?')[0], status: 'not-probed', reason: health?.runtime !== 'sites' ? 'native-api-not-available' : 'use-live-media-flag' });
    continue;
  }
  const startedAt = Date.now();
  try {
    const response = await worker.fetch(new Request(`https://audit.invalid${test.path}`, {
      method: test.binary ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json' },
      ...(!test.binary ? { body: JSON.stringify(test.body) } : {}), signal: AbortSignal.timeout(65000),
    }), env);
    let valid = false;
    let error;
    if (test.binary && response.ok) {
      const bytes = new Uint8Array(await response.arrayBuffer());
      valid = /^image\//.test(response.headers.get('Content-Type') || '') && bytes.length > 100;
    } else {
      const body = await response.json();
      valid = response.ok && Boolean(test.check?.(body));
      if (!response.ok) error = body.error;
    }
    results.push({ path: test.path.split('?')[0], status: response.status, valid, error, elapsedMs: Date.now() - startedAt, scope: 'built-worker-and-live-provider' });
  } catch { results.push({ path: test.path.split('?')[0], status: 'connection-failed', valid: false }); }
}
const report = { checkedAt: new Date().toISOString(), keyNames: Object.keys(env), results };
if (outputPath) await writeFile(outputPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.stdin.destroy();
