import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ORB_CALC_TOOLS, ORB_CALC_TOOL_IDS, ORB_FN_RUN_TOOL, ORB_FN_TAROT, ORB_MAX_CALLS_PER_TURN, buildOrbMasterRules, orbFunctionDeclarations,
} from '../src/lib/orb/orbTools.ts';
import { createOrbToolExecutor } from '../src/lib/orb/orbToolExecutor.ts';
import { runDeterministicEngine } from '../src/lib/divination/deterministicEngine.ts';
import { slimToolDataToBudget } from '../src/lib/divination/promptSlim.ts';

import { buildOrbLiveInstruction } from '../src/lib/lucyLiveBrief.ts';
import { startGeminiLiveVoice } from '../src/lib/geminiLiveSession.ts';
import { ORB_MASTERS } from '../src/lib/orbMasters.ts';

const profile = { basic: { birthdate: '1990-05-15', birthtime: '14:30', lunarSolar: 'solar', gender: 'female', birthCity: '서울' } } as any;

test('마스터 루시의 계산 도구는 사주 하나뿐 (타로는 손님이 직접 뽑는다)', () => {
  assert.deepEqual([...ORB_CALC_TOOL_IDS], ['saju']);
  assert.equal(ORB_CALC_TOOLS.length, 1);
  assert.equal(ORB_CALC_TOOLS[0].name, '사주명리');
  const report = runDeterministicEngine({ profile, question: '', forceAllTools: true, coreOnly: true });
  assert.ok((report.tools as any).saju, 'saju exists in the engine report');
  const [run, tarot] = orbFunctionDeclarations();
  assert.equal(run.name, ORB_FN_RUN_TOOL);
  assert.deepEqual(run.parameters.properties.tool.enum, ['saju']);
  assert.equal(tarot.name, ORB_FN_TAROT);
  // 도구 설명은 짧은 메타데이터만 (도구별 긴 해석 문장을 넣지 않는다).
  assert.ok(JSON.stringify(orbFunctionDeclarations()).length < 3000);
  for (const tool of ORB_CALC_TOOLS) assert.ok(tool.about.length <= 60, `${tool.id} about stays short`);
});

test('사주 호출은 엔진과 같은 값을 줄여 돌려주고, 다른 점술 도구는 목록에 없다', async () => {
  const executor = createOrbToolExecutor({ profile });
  const saju = await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'saju', reason: '이직 시기' } });
  assert.equal(saju.ok, true);
  assert.equal(saju.status, 'calculated');
  const direct = runDeterministicEngine({ profile, question: '이직 시기', forceAllTools: true, focusTools: ['saju'], coreOnly: true });
  assert.deepEqual(saju.data, slimToolDataToBudget(direct.tools.saju.data, 2400));

  // 점성술·주역·육임 같은 예전 도구는 마스터 루시에게 없다.
  for (const tool of ['astrology', 'iching', 'liuren', 'qimen', 'taiyi', 'kyusei']) {
    const result = await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool } });
    assert.equal(result.error, 'unknown_tool', tool);
  }
});

test('사주는 한 상담에서 한 번만 계산하고, 한 차례 호출 수를 제한하며, 생년월일이 없으면 묻는다', async () => {
  const executor = createOrbToolExecutor({ profile });
  const first = await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'saju' } });
  const again = await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'saju' } });
  assert.equal(again.cached, true, 'the same tool is not computed twice');
  assert.deepEqual({ ...again, cached: undefined }, { ...first, cached: undefined });
  assert.equal(ORB_MAX_CALLS_PER_TURN, 2);
  assert.equal(executor.history().length, 1);

  // 같은 상담에서 다른 프로필로 바뀌면 저장한 계산을 버린다.
  executor.setProfile({ basic: { birthdate: '1996-05-15', birthtime: '12:00', gender: 'female', lunarSolar: 'solar' } } as any, null);
  const recomputed = await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'saju' } });
  assert.equal(recomputed.cached, undefined, 'a new person recalculates');
  executor.setProfile(profile, null);

  const anonymous = createOrbToolExecutor({ profile: null });
  const saju = await anonymous.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'saju' } });
  assert.equal(saju.error, 'needs_birthdate');
  assert.match(String(saju.message), /타로/);
  const unknown = await anonymous.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'palmistry' } });
  assert.equal(unknown.error, 'unknown_tool');
});

test('타로는 손님이 고르는 섞기 화면만 열고 카드를 스스로 뽑지 않는다', async () => {
  let opened = 0;
  const executor = createOrbToolExecutor({ profile, events: { openTarot: () => { opened += 1; return { opened: true }; } } });
  const result = await executor.execute({ name: ORB_FN_TAROT, args: { reason: '관계 고민' } });
  assert.equal(opened, 1);
  assert.equal(result.ok, true);
  assert.equal('cards' in result, false);
  const picked = createOrbToolExecutor({ profile, events: { openTarot: () => ({ opened: false, alreadyPicked: '과거 컵 2 정방향' }) } });
  assert.equal((await picked.execute({ name: ORB_FN_TAROT })).alreadyPicked, '과거 컵 2 정방향');
});

test('마스터 루시 지시문: 사주·타로 교차, 사주를 다시 계산, 생년월일 없으면 안내', () => {
  const rules = buildOrbMasterRules({ birthdate: true, birthtime: false });
  const text = buildOrbLiveInstruction('', ORB_MASTERS[0].focus, ORB_MASTERS[0].greet, '', rules);
  assert.match(text, /마스터 루시/);
  assert.match(text, /run_divination_tool/);
  assert.match(text, /open_tarot_shuffle/);
  assert.match(text, /사주와 타로, 둘뿐/);
  assert.match(text, /교차/);
  assert.match(text, /지어내지 마세요/);
  assert.match(text, /태어난 시간은 없음/);
  assert.ok(text.length < 3000, 'the shared instruction stays short');
  assert.match(buildOrbMasterRules({ birthdate: false, birthtime: false }), /마이 페이지/);
  assert.equal(ORB_MASTERS.length, 1, '마스터는 루시 한 명이다');
  assert.equal(ORB_MASTERS[0].cardPick, true, '마스터 루시는 언제나 카드를 뽑는다');
  // 예전 4대 마스터의 말투 제한(다른 도구를 막는 문장)은 없다.
  assert.doesNotMatch(ORB_MASTERS[0].focus, /만 상담해|새지 마|하지 마\./);
});

test('server token and client setup both declare the Orb tools', () => {
  const token = readFileSync(new URL('../server/api-lib/geminiLiveTokenCore.ts', import.meta.url), 'utf8');
  assert.match(token, /reading\?\.orb \? \{ tools: \[\{ functionDeclarations: orbFunctionDeclarations\(\) \}\] \}/);
  for (const file of ['../server.app.ts', '../api/index.ts']) {
    assert.match(readFileSync(new URL(file, import.meta.url), 'utf8'), /orb, persona, rules/);
  }
});

class FakeAudioContext {
  currentTime = 0; sampleRate = 48_000; destination = {};
  resume() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
  createMediaStreamSource() { return { connect() {}, disconnect() {} }; }
  createScriptProcessor() { return { onaudioprocess: null, connect() {}, disconnect() {} }; }
  createGain() { return { gain: { value: 1 }, connect() {} }; }
}
class FakeWebSocket {
  static OPEN = 1; static sockets: FakeWebSocket[] = [];
  readyState = 0; sent: string[] = [];
  onopen: (() => void) | null = null; onmessage: ((event: { data: string }) => void | Promise<void>) | null = null;
  onerror: (() => void) | null = null; onclose: (() => void) | null = null;
  constructor() { FakeWebSocket.sockets.push(this); }
  send(message: string) { this.sent.push(message); }
  close() { this.readyState = 3; }
}
function replaceGlobal(name: string, value: unknown) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  return () => { if (previous) Object.defineProperty(globalThis, name, previous); else Reflect.deleteProperty(globalThis, name); };
}

test('a live tool call runs the executor and answers with a toolResponse carrying the call id', async () => {
  FakeWebSocket.sockets = [];
  const track = { enabled: true, stop() {} };
  const stream = { getAudioTracks: () => [track], getTracks: () => [track] } as unknown as MediaStream;
  let tokenBody: any = null;
  const restore = [
    replaceGlobal('AudioContext', FakeAudioContext),
    replaceGlobal('WebSocket', FakeWebSocket),
    replaceGlobal('navigator', { mediaDevices: { getUserMedia: async () => stream } }),
    replaceGlobal('fetch', async (_url: string, init: any) => { tokenBody = JSON.parse(init.body); return { ok: true, json: async () => ({ token: 't', model: 'm' }) }; }),
  ];
  const calls: string[] = [];
  const busy: boolean[] = [];
  const usage: unknown[] = [];
  const input: string[] = [];
  const session = startGeminiLiveVoice({
    micStream: Promise.resolve(stream),
    orb: { persona: '차분한 상담가', rules: buildOrbMasterRules({ birthdate: true, birthtime: true }) },
    onToolCall: async (call) => { calls.push(`${call.name}:${call.args?.tool}`); return { ok: true, status: 'calculated' }; },
    onToolBusy: (value) => busy.push(value),
    onUsageMetadata: value => usage.push(value),
    onInputSent: source => input.push(source),
  });
  try {
    for (let i = 0; i < 30 && !FakeWebSocket.sockets.length; i += 1) await new Promise(resolve => setTimeout(resolve, 0));
    const socket = FakeWebSocket.sockets[0];
    assert.equal(tokenBody.orb, true);
    socket.readyState = FakeWebSocket.OPEN;
    socket.onopen?.();
    const setup = JSON.parse(socket.sent[0]).setup;
    assert.equal(setup.tools[0].functionDeclarations[0].name, ORB_FN_RUN_TOOL);
    assert.deepEqual(setup.tools[0].functionDeclarations[0].parameters.properties.tool.enum, ['saju']);
    assert.match(setup.systemInstruction.parts[0].text, /오브의 마스터/);
    session.sendText('상담 질문이에요.', true);
    assert.deepEqual(input, []);
    await socket.onmessage?.({ data: JSON.stringify({ setupComplete: true }) });
    assert.deepEqual(input, ['text']);
    await socket.onmessage?.({ data: JSON.stringify({ usageMetadata: { totalTokenCount: 15 } }) });
    assert.deepEqual(usage, [{ totalTokenCount: 15 }]);
    await socket.onmessage?.({ data: JSON.stringify({ toolCall: { functionCalls: [{ id: 'c1', name: ORB_FN_RUN_TOOL, args: { tool: 'saju' } }] } }) });
    for (let i = 0; i < 10 && !socket.sent.some(m => m.includes('toolResponse')); i += 1) await new Promise(resolve => setTimeout(resolve, 0));
    assert.deepEqual(calls, [`${ORB_FN_RUN_TOOL}:saju`]);
    const response = JSON.parse(socket.sent.find(m => m.includes('toolResponse'))!).toolResponse.functionResponses[0];
    assert.equal(response.id, 'c1');
    assert.equal(response.response.status, 'calculated');
    assert.deepEqual(busy, [true, false]);
  } finally {
    session.stop();
    for (const undo of restore.reverse()) undo();
  }
});
