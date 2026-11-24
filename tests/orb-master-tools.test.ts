import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ORB_CALC_TOOLS, ORB_CALC_TOOL_IDS, ORB_FN_RUN_TOOL, ORB_FN_TAROT, ORB_MAX_CALLS_PER_TURN, buildOrbMasterRules, orbFunctionDeclarations,
} from '../src/lib/orb/orbTools.ts';
import { createOrbToolExecutor } from '../src/lib/orb/orbToolExecutor.ts';
import { runDeterministicEngine } from '../src/lib/divination/deterministicEngine.ts';
import { slimToolDataToBudget } from '../src/lib/divination/promptSlim.ts';
import { FIFTEEN_DIVINATION_TOOLS } from '../src/lib/fifteenDivinationTools.ts';
import { buildOrbLiveInstruction } from '../src/lib/lucyLiveBrief.ts';
import { startGeminiLiveVoice } from '../src/lib/geminiLiveSession.ts';
import { ORB_MASTERS } from '../src/lib/orbMasters.ts';

const profile = { basic: { birthdate: '1990-05-15', birthtime: '14:30', lunarSolar: 'solar', gender: 'female', birthCity: '서울' } } as any;

test('the registry covers the 14 calculated tools of the 15 (tarot is picked by the guest)', () => {
  const fifteen = Object.keys(FIFTEEN_DIVINATION_TOOLS).filter(id => id !== 'tarot').sort();
  assert.deepEqual([...ORB_CALC_TOOL_IDS].sort(), fifteen);
  const report = runDeterministicEngine({ profile, question: '', forceAllTools: true, coreOnly: true });
  for (const id of ORB_CALC_TOOL_IDS) assert.ok((report.tools as any)[id], `${id} exists in the engine report`);
  const [run, tarot] = orbFunctionDeclarations();
  assert.equal(run.name, ORB_FN_RUN_TOOL);
  assert.deepEqual(run.parameters.properties.tool.enum, [...ORB_CALC_TOOL_IDS]);
  assert.equal(tarot.name, ORB_FN_TAROT);
  // 도구 설명은 짧은 메타데이터만 (도구별 긴 해석 문장을 넣지 않는다).
  assert.ok(JSON.stringify(orbFunctionDeclarations()).length < 3000);
  for (const tool of ORB_CALC_TOOLS) assert.ok(tool.about.length <= 60, `${tool.id} about stays short`);
});

test('a called tool returns the same values as the engine, slimmed, with matching knowledge cards', async () => {
  const executor = createOrbToolExecutor({ profile });
  const saju = await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'saju', reason: '이직 시기' } });
  assert.equal(saju.ok, true);
  assert.equal(saju.status, 'calculated');
  const direct = runDeterministicEngine({ profile, question: '이직 시기', forceAllTools: true, focusTools: ['saju'], coreOnly: true });
  assert.deepEqual(saju.data, slimToolDataToBudget(direct.tools.saju.data, 2400));

  const iching = await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'iching' } });
  assert.equal(iching.ok, true);
  assert.ok(String(iching.scope).includes('지금 시각'), 'shared time charts carry their scope');
  assert.ok(Array.isArray(iching.cards) && (iching.cards as string[]).some(card => card.includes('주역 본괘')));
  assert.ok(JSON.stringify(iching).length < 5000, 'a result stays small enough for a voice turn');
});

test('the executor reuses results, limits calls per turn and asks for missing birth data', async () => {
  const executor = createOrbToolExecutor({ profile });
  const first = await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'kyusei' } });
  const again = await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'kyusei' } });
  assert.equal(again.cached, true, 'the same tool is not computed twice');
  assert.deepEqual({ ...again, cached: undefined }, { ...first, cached: undefined });
  for (const tool of ['tojeong', 'sukuyo']) await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool } });
  assert.equal(ORB_MAX_CALLS_PER_TURN, 3);
  const over = await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'taiyi' } });
  assert.equal(over.error, 'turn_limit');
  executor.newTurn();
  const next = await executor.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'taiyi' } });
  assert.equal(next.ok, true);
  assert.equal(executor.history().length, 4);

  const anonymous = createOrbToolExecutor({ profile: null });
  const saju = await anonymous.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'saju' } });
  assert.equal(saju.error, 'needs_birthdate');
  const qimen = await anonymous.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'qimen' } });
  assert.equal(qimen.ok, true, 'time charts work without a birth date');
  const unknown = await anonymous.execute({ name: ORB_FN_RUN_TOOL, args: { tool: 'palmistry' } });
  assert.equal(unknown.error, 'unknown_tool');
});

test('tarot opens the guest-pick shuffle and never draws cards itself', async () => {
  let opened = 0;
  const executor = createOrbToolExecutor({ profile, events: { openTarot: () => { opened += 1; return { opened: true }; } } });
  const result = await executor.execute({ name: ORB_FN_TAROT, args: { reason: '관계 고민' } });
  assert.equal(opened, 1);
  assert.equal(result.ok, true);
  assert.equal('cards' in result, false);
  const picked = createOrbToolExecutor({ profile, events: { openTarot: () => ({ opened: false, alreadyPicked: '과거 컵 2 정방향' }) } });
  assert.equal((await picked.execute({ name: ORB_FN_TAROT })).alreadyPicked, '과거 컵 2 정방향');
});

test('one master: the instruction carries rules and persona, not a pre-computed chart', () => {
  const rules = buildOrbMasterRules({ birthdate: true, birthtime: false });
  const text = buildOrbLiveInstruction('', ORB_MASTERS[0].focus, ORB_MASTERS[0].greet, '', rules);
  assert.match(text, /run_divination_tool/);
  assert.match(text, /open_tarot_shuffle/);
  assert.match(text, /모든 도구를 다 부르지 마세요/);
  assert.match(text, /지어내지 마세요/);
  assert.match(text, /태어난 시간은 없음/);
  assert.ok(text.length < 3000, 'the shared instruction stays short');
  assert.match(buildOrbMasterRules({ birthdate: false, birthtime: false }), /마이 페이지/);
  // 마스터 4명은 이제 말투(목소리) 선택지: 다른 도구를 막지 않는다.
  for (const master of ORB_MASTERS) assert.doesNotMatch(master.focus, /만 상담해|새지 마|하지 마\./);
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
    assert.match(setup.systemInstruction.parts[0].text, /오브의 마스터/);
    session.sendText('상담 질문이에요.', true);
    assert.deepEqual(input, []);
    await socket.onmessage?.({ data: JSON.stringify({ setupComplete: true }) });
    assert.deepEqual(input, ['text']);
    await socket.onmessage?.({ data: JSON.stringify({ usageMetadata: { totalTokenCount: 15 } }) });
    assert.deepEqual(usage, [{ totalTokenCount: 15 }]);
    await socket.onmessage?.({ data: JSON.stringify({ toolCall: { functionCalls: [{ id: 'c1', name: ORB_FN_RUN_TOOL, args: { tool: 'iching' } }] } }) });
    for (let i = 0; i < 10 && !socket.sent.some(m => m.includes('toolResponse')); i += 1) await new Promise(resolve => setTimeout(resolve, 0));
    assert.deepEqual(calls, [`${ORB_FN_RUN_TOOL}:iching`]);
    const response = JSON.parse(socket.sent.find(m => m.includes('toolResponse'))!).toolResponse.functionResponses[0];
    assert.equal(response.id, 'c1');
    assert.equal(response.response.status, 'calculated');
    assert.deepEqual(busy, [true, false]);
  } finally {
    session.stop();
    for (const undo of restore.reverse()) undo();
  }
});

test('Orb I Ching tool distinguishes and caches the two casting methods', async () => {
  const executor = createOrbToolExecutor({});
  const call = (ichingMethod: string) => executor.execute({
    name: ORB_FN_RUN_TOOL,
    args: { tool: 'iching', ichingMethod },
  });
  const [time, dice] = [await call('time'), await call('dice')];
  assert.equal(time.ok, true);
  assert.match(String(time.scope), /지금 시각/);
  assert.equal(dice.ok, true);
  assert.match(String(dice.casting), /두 주사위/);
  assert.match(String(dice.scope), /이번 질문/);
  assert.ok(Array.isArray(dice.cards) && dice.cards.length > 0);
  assert.deepEqual(await call('dice'), { ...dice, cached: true });
});
