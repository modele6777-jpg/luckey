import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateAppMediaSession } from '../src/lib/appMediaSession';
import { initTTSSessionHandlers, setTTSSessionActive, clearTTSSession } from '../src/lib/ttsMediaSession';

test('speech owns lock-screen controls temporarily and restores playing BGM afterward', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const handlers = new Map<MediaSessionAction, (() => void) | null>();
  const media = { playbackState: 'none', metadata: null, setActionHandler: (action: MediaSessionAction, handler: (() => void) | null) => handlers.set(action, handler) };
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { mediaSession: media } });
  let bgmPauses = 0, speechPauses = 0;
  try {
    updateAppMediaSession('bgm', { title: 'BGM', artist: 'Lucy', state: 'playing', actions: { pause: () => bgmPauses++ } });
    handlers.get('pause')!(); assert.equal(bgmPauses, 1);
    initTTSSessionHandlers(() => {}, () => speechPauses++);
    setTTSSessionActive('Reading');
    handlers.get('pause')!(); assert.equal(speechPauses, 1); assert.equal(bgmPauses, 1);
    clearTTSSession();
    assert.equal(media.playbackState, 'playing');
    handlers.get('pause')!(); assert.equal(bgmPauses, 2);
    updateAppMediaSession('bgm', null);
    assert.equal(media.playbackState, 'none');
    assert.equal(handlers.get('pause'), null);
  } finally {
    updateAppMediaSession('bgm', null); clearTTSSession();
    if (descriptor) Object.defineProperty(globalThis, 'navigator', descriptor); else delete (globalThis as any).navigator;
  }
});
