import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLucyPageTurn, requiresBasicAndDeepForTurn } from '../src/lib/lucyTurnMode.ts';

test('일반 채팅(!isMasterMode)은 항상 수다모드 전용이다', () => {
  const turn = resolveLucyPageTurn(false);
  assert.equal(turn.mode, 'casual');
  assert.deepEqual(turn.channels, []);
  assert.equal(turn.isCasual, true);
  assert.equal(turn.isMaster, false);
  assert.equal(turn.requireBasicAndDeep, false);
});

test('점술모드(isMasterMode)는 7대 채널과 기초·심층 엔진을 그대로 유지한다', () => {
  const turn = resolveLucyPageTurn(true);
  assert.equal(turn.mode, 'master');
  assert.deepEqual(turn.channels, ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue']);
  assert.equal(turn.isMaster, true);
  assert.equal(turn.isCasual, false);
  assert.equal(turn.requireBasicAndDeep, true);
});

test('일반 루시 채팅 턴은 AppContext에서도 운명학 엔진을 돌리지 않는다', () => {
  assert.equal(
    requiresBasicAndDeepForTurn({ persona: 'lucy', optionMode: 'casual', channelCount: 0 }),
    false,
  );
  // mode가 실려 오지 않는 일반 루시 채널 없는 호출(퀵 채팅 등)도 수다모드로 본다.
  assert.equal(requiresBasicAndDeepForTurn({ persona: 'lucy', channelCount: 0 }), false);
});

test('점술모드·채널 호출·명시적 엔진 요청은 기존처럼 엔진을 가동한다', () => {
  assert.equal(
    requiresBasicAndDeepForTurn({ persona: 'lucy', optionMode: 'master', channelCount: 7, isMasterCall: true }),
    true,
  );
  // UnifiedChat 등 7대 테마 채널을 실어 보내는 점술 호출
  assert.equal(
    requiresBasicAndDeepForTurn({ persona: 'lucy', channelCount: 1, optionMode: 'trinity' }),
    true,
  );
  // 도구 사용을 명시한 호출(레거시 포함)
  assert.equal(
    requiresBasicAndDeepForTurn({ persona: 'lucy', optionMode: 'casual', requireBasicAndDeep: true }),
    true,
  );
});

test('음성 턴은 수다모드로 유지되고, 루시가 아닌 채널 페르소나는 기존 판정을 지킨다', () => {
  assert.equal(
    requiresBasicAndDeepForTurn({ persona: 'lucy', optionMode: 'casual', voiceTurn: true }),
    false,
  );
  assert.equal(requiresBasicAndDeepForTurn({ persona: 'orange', optionMode: 'orange', channelCount: 1 }), false);
});
