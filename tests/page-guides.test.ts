import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allPageGuides, DAPP_GUIDE_KEYS, KEY_TAB_GUIDE_KEYS, pageGuideSpeech, resolveDappGuide, resolveKeyTabGuide } from '../src/lib/pageGuides';
import { getLuckeyPageKeys } from '../src/lib/omniWarp/oneStopPages';

test('every guide has separate steps and tips', () => {
  for (const guide of allPageGuides()) {
    assert.ok(guide.steps.length >= 1, `${guide.id} steps`);
    assert.ok(guide.tips.length >= 1, `${guide.id} tips`);
  }
});

test('every dApp page has its own guide', () => {
  for (const key of getLuckeyPageKeys()) {
    assert.ok(DAPP_GUIDE_KEYS.includes(key), `missing guide for ${key}`);
    assert.notEqual(resolveDappGuide(key).id, 'default', key);
  }
  assert.equal(KEY_TAB_GUIDE_KEYS.length, 6);
  assert.equal(resolveKeyTabGuide('tab-breathing').id, 'key-breathing');
  assert.equal(resolveKeyTabGuide('').id, 'key');
});

test('listen text follows the visible section', () => {
  const guide = resolveDappGuide('/orange?tab=wishingWell');
  assert.match(pageGuideSpeech(guide, 'guide'), /사용 가이드[\s\S]*1단계/);
  assert.match(pageGuideSpeech(guide, 'tips'), /활용 팁/);
});
