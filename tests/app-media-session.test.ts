import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateAppMediaSession } from '../src/lib/appMediaSession';
import { initTTSSessionHandlers, setTTSSessionActive, clearTTSSession } from '../src/lib/ttsMediaSession';

test('app audio bookkeeping never claims OS media controls or controls external players', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const handlers = new Map<MediaSessionAction, (() => void) | null>();
  const media = {
    playbackState: 'none',
    metadata: null,
    setActionHandler: (action: MediaSessionAction, handler: (() => void) | null) => handlers.set(action, handler),
  };
  let audioType = 'auto';
  const audioSession = {
    get type() { return audioType; },
    set type(value: string) { audioType = value; },
  };
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { mediaSession: media, audioSession },
  });
  let bgmPauses = 0, speechPauses = 0;
  try {
    updateAppMediaSession('bgm', {
      title: 'BGM', artist: 'Lucy', state: 'playing', actions: { pause: () => bgmPauses++ },
    });
    initTTSSessionHandlers(() => {}, () => speechPauses++);
    setTTSSessionActive('Reading');

    assert.equal(audioType, 'ambient');
    assert.equal(media.playbackState, 'none');
    assert.equal(media.metadata, null);
    assert.equal(handlers.size, 0, 'the app must not install lock-screen actions that can control other players');

    clearTTSSession();
    updateAppMediaSession('bgm', null);
    assert.equal(media.playbackState, 'none');
    assert.equal(media.metadata, null);
    assert.equal(handlers.size, 0);
    assert.equal(bgmPauses, 0);
    assert.equal(speechPauses, 0);
  } finally {
    updateAppMediaSession('bgm', null);
    clearTTSSession();
    if (descriptor) Object.defineProperty(globalThis, 'navigator', descriptor);
    else delete (globalThis as any).navigator;
  }
});
