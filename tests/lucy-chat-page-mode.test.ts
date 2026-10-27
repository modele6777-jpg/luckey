import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLucyPageChannels, LUCY_MASTER_CHANNELS } from '../src/lib/lucyChatPageMode';
import { detectLucyChannelsFromText } from '../src/lib/lucyAutoModeDetector';

test('Pro always uses all seven channels, including casual or forced single-channel input', () => {
  for (const channels of [[], ['orange'], [...LUCY_MASTER_CHANNELS]] as const) {
    assert.deepEqual(resolveLucyPageChannels(channels, true), [...LUCY_MASTER_CHANNELS]);
  }
});

test('regular chat cannot enter master from persisted or injected full-channel selections', () => {
  assert.deepEqual(resolveLucyPageChannels([...LUCY_MASTER_CHANNELS], false), []);
  assert.deepEqual(resolveLucyPageChannels(['orange', 'trinity', 'orange'], false), ['orange', 'trinity']);
});

test('regular auto detection ignores master requests while retaining the requested specialist', () => {
  const normal = detectLucyChannelsFromText('마스터 모드로 타로를 봐줘', { allowMaster: false });
  assert.equal(normal.isMaster, false);
  assert.deepEqual(normal.channels, ['trinity']);
  assert.equal(detectLucyChannelsFromText('마스터 모드로 타로를 봐줘').isMaster, true);
});
