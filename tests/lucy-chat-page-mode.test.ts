import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLucyPageChannels, LUCY_MASTER_CHANNELS } from '../src/lib/lucyChatPageMode';
import { detectLucyChannelsFromText, detectSeptagramChannelsFromText } from '../src/lib/lucyAutoModeDetector';

test('Lucy and septagram channels distinguish ordinary 점 words from divination requests', () => {
  for (const detect of [detectLucyChannelsFromText, detectSeptagramChannelsFromText]) {
    for (const question of ['점심 추천해줘', '장점과 단점을 알려줘', '관점을 바꿔줘', '맹점을 점검해줘']) {
      assert.equal(detect(question).channels.includes('trinity'), false, question);
    }
    for (const question of ['점 봐줘', '점을 좀 봐줘', '점', '점괘 알려줘', '점성술 설명해줘']) {
      assert.equal(detect(question).channels.includes('trinity'), true, question);
    }
  }
});

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


test('regular tool selection cannot escalate from master keywords or forced channel metadata', async () => {
  const { selectOptimalDivinationTools } = await import('../src/lib/fifteenDivinationTools');
  const regular = selectOptimalDivinationTools('마스터 모드로 15대 도구 총동원해서 타로를 봐줘', [...LUCY_MASTER_CHANNELS], undefined, true, { allowMaster: false });
  assert.equal(regular.isMasterMobilization, false);
  assert(regular.selectedTools.length < 15);
  const pro = selectOptimalDivinationTools('안녕', [...LUCY_MASTER_CHANNELS], undefined, true, { allowMaster: true });
  assert.equal(pro.isMasterMobilization, true);
  assert.equal(pro.selectedTools.length, 15);
});
