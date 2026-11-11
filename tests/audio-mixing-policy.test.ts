import assert from 'node:assert/strict';
import { test } from 'node:test';
import { updateAppMediaSession } from '../src/lib/appMediaSession.ts';
import { applyAudioMixingPolicy, isAppAudioActive, setAppAudioActive } from '../src/lib/audioMixingPolicy.ts';

test('active app audio always stays in the nonexclusive ambient session', () => {
  const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const fakeNavigator = {
    audioSession: { type: 'playback' },
    mediaSession: { playbackState: 'none', metadata: null, setActionHandler() {} },
  };
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: fakeNavigator });
  try {
    setAppAudioActive(true);
    assert.equal(fakeNavigator.audioSession.type, 'ambient');
    assert.equal(isAppAudioActive(), true);
    fakeNavigator.audioSession.type = 'playback';
    applyAudioMixingPolicy();
    assert.equal(fakeNavigator.audioSession.type, 'ambient');

    updateAppMediaSession('tts', { title: 'Lucy Speech', artist: 'Lucy', state: 'playing' });
    assert.equal(fakeNavigator.mediaSession.playbackState, 'none');
    assert.equal(fakeNavigator.mediaSession.metadata, null);
    updateAppMediaSession('tts', null);
    assert.equal(fakeNavigator.mediaSession.playbackState, 'none');
    assert.equal(fakeNavigator.mediaSession.metadata, null);
  } finally {
    updateAppMediaSession('tts', null);
    updateAppMediaSession('bgm', null);
    setAppAudioActive(false);
    if (previousNavigator) Object.defineProperty(globalThis, 'navigator', previousNavigator);
    else delete (globalThis as { navigator?: Navigator }).navigator;
  }
});
