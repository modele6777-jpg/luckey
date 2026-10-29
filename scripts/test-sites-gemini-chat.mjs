import assert from 'node:assert/strict';
import { handleSitesGeminiChat } from './sites-gemini-chat.mjs';

const url = 'https://example.chatgpt.site/api/openai/v1/chat/completions';
const messages = [
  { role: 'system', content: '한국어로 답하세요.' },
  { role: 'user', content: '내 이름은 지수야.' },
  { role: 'assistant', content: '안녕 지수!' },
  { role: 'user', content: [{ type: 'text', text: '내 이름은?' }, { type: 'image_url', image_url: { url: 'data:image/png;base64,aGVsbG8=' } }] },
];
const request = body => new Request(url, { method: 'POST', body: JSON.stringify(body) });
let calls = 0;
const mockGoogle = async (target, options) => {
  calls++;
  assert.equal(target, 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');
  assert.equal(options.headers.Authorization, 'Bearer test-secret');
  assert.equal(options.headers.Cookie, undefined);
  const payload = JSON.parse(options.body);
  assert.deepEqual(payload.messages, messages);
  assert.equal(payload.model, 'gemini-3.1-flash-lite');
  assert.equal(payload.presence_penalty, undefined);
  assert.equal(payload.thinking_level, undefined);
  assert.equal(payload.reasoning_effort, 'low');
  return new Response(payload.stream
    ? 'data: {"choices":[{"delta":{"content":"지수"}}]}\n\ndata: [DONE]\n\n'
    : JSON.stringify({ choices: [{ message: { content: '지수' } }] }));
};
for (const stream of [false, true]) {
  const result = await handleSitesGeminiChat(request({ messages, stream, thinking_level: 'low', presence_penalty: 0.3 }), { gemini: 'test-secret' }, mockGoogle);
  assert.equal(result.status, 200);
  assert.equal(result.headers.get('cache-control'), 'no-store');
  if (stream) {
    assert.match(result.headers.get('content-type'), /text\/event-stream/);
    assert.match(await result.text(), /data: \[DONE\]/);
  } else assert.equal((await result.json()).choices[0].message.content, '지수');
}
assert.equal(calls, 2);
assert.equal((await handleSitesGeminiChat(request({ messages }), {})).status, 503);
assert.equal((await handleSitesGeminiChat(request({ messages: [] }), { gemini: 'test-secret' })).status, 400);
assert.equal((await handleSitesGeminiChat(new Request(url, { method: 'POST', body: '{bad' }), { gemini: 'test-secret' })).status, 400);
assert.equal((await handleSitesGeminiChat(new Request(url), { gemini: 'test-secret' })).status, 405);
assert.equal(await handleSitesGeminiChat(new Request('https://example.chatgpt.site/api/ai/tts'), {}), null);
for (const status of [400, 401, 403, 404, 429, 500]) {
  const result = await handleSitesGeminiChat(request({ messages }), { gemini: 'test-secret' }, async () => new Response('test-secret', { status }));
  assert.equal(result.status, status === 500 ? 502 : status);
  assert.ok(!(await result.text()).includes('test-secret'));
}
assert.equal((await handleSitesGeminiChat(request({ messages }), { gemini: 'test-secret' }, async () => { throw new Error('test-secret'); })).status, 502);
console.log('Sites Gemini chat: history, image content, JSON, SSE, validation and provider errors passed.');
for (const stream of [false, true]) {
  const attempted = [];
  const result = await handleSitesGeminiChat(request({ messages, stream, thinking_level: 'low' }), { gemini: 'test-secret' }, async (_, options) => {
    const body = JSON.parse(options.body);
    attempted.push(body.model);
    assert.deepEqual(body.messages, messages);
    if (attempted.length === 1) return new Response('overloaded', { status: 503 });
    assert.equal(body.reasoning_effort, undefined);
    return new Response(stream ? 'data: [DONE]\n\n' : '{"choices":[{"message":{"content":"복구"}}]}');
  });
  assert.equal(result.status, 200);
  assert.deepEqual(attempted, ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite']);
  assert.match(await result.text(), stream ? /DONE/ : /복구/);
}
for (const status of [400, 401, 403, 429]) {
  let attempts = 0;
  await handleSitesGeminiChat(request({ messages }), { gemini: 'test-secret' }, async () => { attempts++; return new Response('', { status }); });
  assert.equal(attempts, 1);
}
console.log('Transient provider failover preserves JSON/SSE; authentication and quota are not retried.');
for (const stream of [false, true]) {
  let calls = 0;
  const result = await handleSitesGeminiChat(request({ messages, stream, max_tokens: 256, temperature: 0.5, thinking_level: 'minimal' }), { 'open ai': 'openai-test-secret' }, async (url, options) => {
    calls++;
    assert.equal(url, 'https://api.openai.com/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer openai-test-secret');
    const body = JSON.parse(options.body);
    assert.equal(body.model, 'gpt-5.4-mini');
    assert.equal(body.max_completion_tokens, 256);
    assert.equal(body.max_tokens, undefined);
    assert.equal(body.temperature, undefined);
    assert.equal(body.reasoning_effort, 'low');
    assert.deepEqual(body.messages, messages);
    return new Response(stream ? 'data: {"choices":[{"delta":{"content":"정상"}}]}\n\ndata: [DONE]\n\n' : '{"choices":[{"message":{"content":"정상"}}]}');
  });
  assert.equal(calls, 1);
  assert.equal(result.status, 200);
  assert.equal(result.headers.get('X-AI-Provider'), 'openai');
  assert.match(await result.text(), stream ? /DONE/ : /정상/);
}
let quotaCalls = 0;
const quotaResult = await handleSitesGeminiChat(request({ messages }), { OPENAI_API_KEY: 'openai-test-secret' }, async () => { quotaCalls++; return Response.json({ error: { code: 'insufficient_quota', message: 'openai-test-secret' } }, { status: 429 }); });
assert.equal(quotaCalls, 1);
const quotaBody = await quotaResult.text();
assert.match(quotaBody, /잔액/);
assert.ok(!quotaBody.includes('openai-test-secret'));
console.log('OpenAI secret alias, endpoint, reasoning payload, JSON/SSE and quota handling passed.');
