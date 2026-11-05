import test from 'node:test';
import assert from 'node:assert/strict';
import {
  registerAudioDeviceChangeListener,
  notifyAudioDeviceChanged,
  detectAudioDeviceChange,
} from '../src/lib/audioDeviceChangeMonitor';

test('Audio Device Change Monitor: registers listener and receives notifications', () => {
  let receivedReason: string | null = null;
  const unsubscribe = registerAudioDeviceChangeListener((reason) => {
    receivedReason = reason;
  });

  notifyAudioDeviceChanged('devicechange');
  assert.equal(receivedReason, 'devicechange');

  notifyAudioDeviceChanged('audio_route_changed');
  assert.equal(receivedReason, 'audio_route_changed');

  unsubscribe();
  receivedReason = null;
  notifyAudioDeviceChanged('devicechange');
  assert.equal(receivedReason, null, 'Unsubscribed listener should not receive events');
});

test('Audio Device Change Monitor: handles missing navigator.mediaDevices gracefully', async () => {
  const result = await detectAudioDeviceChange();
  assert.equal(typeof result, 'boolean');
});
