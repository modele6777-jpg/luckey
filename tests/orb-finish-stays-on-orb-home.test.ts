import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { queueLucyAction, requestLucyAction } from '../src/lib/duoLucyActionRouting.ts';

const hostSource = readFileSync(new URL('../src/components/lucy/OrbCounselHost.tsx', import.meta.url), 'utf8');
const orbSource = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');

type Dispatch = { type: string; detail?: unknown };

function installBrowserStub() {
  const dispatched: Dispatch[] = [];
  const store = new Map<string, string>();
  const globals = globalThis as Record<string, unknown>;
  const previous = {
    window: globals.window,
    sessionStorage: globals.sessionStorage,
    document: globals.document,
  };
  globals.window = { dispatchEvent: (event: Dispatch) => { dispatched.push(event); return true; } };
  globals.sessionStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value); },
    removeItem: (key: string) => { store.delete(key); },
  };
  // 펼친(듀오) 화면이 아니다: 루시 패널이 마운트되어 있지 않다.
  globals.document = { getElementById: () => null };
  return {
    dispatched,
    store,
    restore: () => {
      globals.window = previous.window;
      globals.sessionStorage = previous.sessionStorage;
      globals.document = previous.document;
    },
  };
}

test('오브 상담을 마친 뒤 보고서 요청은 보관만 하고 루시 채팅 화면으로 옮기지 않는다', () => {
  const browser = installBrowserStub();
  try {
    queueLucyAction({ prompt: '🔮 오브에서 아라 마스터와 상담을 마쳤어. 상담 내용을 요약 보고서로 정리해 줘.' });
    // 화면 전환 이벤트가 없다.
    assert.deepEqual(browser.dispatched, []);
    // 루시 채팅을 열면 보낼 수 있도록 초안·자동 전송 요청은 남아 있다.
    assert.match(String(browser.store.get('lucy_injected_auto_send')), /요약 보고서로 정리해 줘/);
    assert.match(String(browser.store.get('lucy_injected_input_draft')), /요약 보고서로 정리해 줘/);
  } finally {
    browser.restore();
  }
});

test('루시 채팅을 열지 않고 보관만 하는 경로는 기존 requestLucyAction 이동 동작을 바꾸지 않는다', () => {
  const browser = installBrowserStub();
  try {
    requestLucyAction({ prompt: '안녕' });
    assert.equal(browser.dispatched.length, 1);
    assert.equal(browser.dispatched[0].type, 'prism-navigate');
    assert.deepEqual(browser.dispatched[0].detail, { path: '/chat' });
  } finally {
    browser.restore();
  }
});

test('오브 상담 종료(닫기·채팅에 남기기)는 루시 채팅이나 처음 화면으로 나가지 않고 오브 메인화면으로 돌아간다', () => {
  // 예전 동작: requestLucyAction('/chat' 이동) + navigate('/'). 둘 다 사라져야 한다.
  assert.doesNotMatch(hostSource, /requestLucyAction/);
  assert.doesNotMatch(hostSource, /navigate\(['"]\/['"]\)/);
  assert.doesNotMatch(hostSource, /path:\s*['"]\/chat['"]/);
  assert.doesNotMatch(hostSource, /path:\s*['"]\/['"]/);
  assert.doesNotMatch(hostSource, /useLocation/);
  // 대신 보고서는 보관만 하고, 어떤 버튼이든 resetKey를 올려 마스터 선택 화면으로 되돌린다.
  assert.match(hostSource, /queueLucyAction\(\{\s*prompt:/);
  assert.match(hostSource, /setPendingLucyContext\(buildOrbReportRequestContext\(summary\)\)/);
  assert.match(hostSource, /onFinish=\{\(summary\)[\s\S]*?setResetKey\(key => key \+ 1\)[\s\S]*?\}\}/);
  // 같은 화면 안에서 새 상담 상태로 깨끗이 다시 시작한다.
  assert.match(hostSource, /key=\{`orb-session-\$\{resetKey\}`\}/);
});

test('보고서 화면의 두 버튼은 모두 onFinish만 부르고 루시 채팅으로 넘어가지 않는다', () => {
  assert.match(orbSource, /const keepReport = \(\)[\s\S]*?onFinishRef\.current\(report \|\| null\)/);
  assert.match(orbSource, /const closeWithoutSaving = \(\)[\s\S]*?onFinishRef\.current\(null\)/);
  // 명시적으로 '점술모드로 이어가기'를 누른 경우에만 채팅으로 이동한다.
  const chatNavigations = [...orbSource.matchAll(/navigate\(\s*['"]\/chat['"]/g)].length;
  assert.equal(chatNavigations, 1);
  assert.match(orbSource, /onEnterDivination=\{\(\) => \{[\s\S]*?navigate\('\/chat'\)/);
});
