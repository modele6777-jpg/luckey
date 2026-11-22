import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { startGeminiLiveVoice } from '../src/lib/geminiLiveSession.ts';

const component = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');
const liveSession = readFileSync(new URL('../src/lib/geminiLiveSession.ts', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string };
const changelog = JSON.parse(readFileSync(new URL('../public/changelog.json', import.meta.url), 'utf8')) as Array<{ version: string; summary: string; items?: string[] }>;

class FakeAudioContext {
  static processors: Array<{ onaudioprocess: ((event: AudioProcessingEvent) => void) | null; connect: () => void; disconnect: () => void }> = [];
  currentTime = 0;
  sampleRate = 48_000;
  destination = {};

  resume() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
  createMediaStreamSource(_stream: MediaStream) { return { connect() {} }; }
  createScriptProcessor() {
    const node = { onaudioprocess: null as ((event: AudioProcessingEvent) => void) | null, connect() {}, disconnect() {} };
    FakeAudioContext.processors.push(node);
    return node;
  }
  createGain() { return { gain: { value: 1 }, connect() {} }; }
}

class FakeWebSocket {
  static OPEN = 1;
  static sockets: FakeWebSocket[] = [];
  readyState = 0;
  sent: string[] = [];
  onopen: ((event?: unknown) => void) | null = null;
  onmessage: ((event: { data: string }) => void | Promise<void>) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;

  constructor(_url: string) { FakeWebSocket.sockets.push(this); }
  send(message: string) { this.sent.push(message); }
  close() { this.readyState = 3; }
}

function replaceGlobal(name: string, value: unknown) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  return () => {
    if (previous) Object.defineProperty(globalThis, name, previous);
    else Reflect.deleteProperty(globalThis, name);
  };
}

test('Orb defaults to hold-to-talk on the input itself; a short Orb tap still switches to real time', () => {
  assert.match(component, /useState<OrbVoiceMode>\('hold'\)/);
  assert.match(component, /setVoiceMode\('hold'\)/);
  assert.match(component, /startMuted: voiceMode === 'hold'/);
  assert.match(component, /className="lucy-orb-input-wrap"[\s\S]*?onPointerDown=\{\(event\) => startPushToTalk\(event\)\}[\s\S]*?onPointerUp=\{stopPushToTalk\}/);
  assert.doesNotMatch(component, /lucy-orb-dock-ptt/);
  assert.match(component, /className="lucy-orb-input-wave"/);
  assert.match(component, /onAudioLevel: \(level\) => setAudioLevel\(level\)/);
  assert.match(liveSession, /onAudioLevel\?: \(level: number\) => void/);
  assert.match(liveSession, /handlers\.onAudioLevel\?\.\(Math\.max\(0, Math\.min\(1,/);
  assert.match(component, /if \(voiceMode === 'hold'\) chooseVoiceMode\('realtime'\)/);
  assert.match(component, /aria-pressed=\{voiceMode === 'realtime'\}[\s\S]*?aria-pressed=\{voiceMode === 'hold'\}/);
  assert.match(liveSession, /if \(!ready \|\| muted \|\| socket\?\.readyState !== WebSocket\.OPEN\) \{/);
});

test('current app version has public changelog details for the generated version endpoint', () => {
  const entry = changelog.find(item => item.version === packageJson.version);
  assert.ok(entry, `public/changelog.json should contain v${packageJson.version}`);
  assert.ok(entry.summary.trim());
  assert.ok(entry.items?.length, 'release details should be available to the update notice and version endpoint');
});

test('Gemini Live hold-to-talk session does not send audio until unmuted and mutes it again on release', async () => {
  FakeAudioContext.processors = [];
  FakeWebSocket.sockets = [];
  const track = { enabled: true, stop() {} };
  const stream = { getAudioTracks: () => [track], getTracks: () => [track] } as unknown as MediaStream;
  const audioLevels: number[] = [];
  const restore = [
    replaceGlobal('AudioContext', FakeAudioContext),
    replaceGlobal('WebSocket', FakeWebSocket),
    replaceGlobal('navigator', { mediaDevices: { getUserMedia: async () => stream } }),
    replaceGlobal('fetch', async () => ({ ok: true, json: async () => ({ token: 'test-token', model: 'gemini-3.8-live' }) })),
  ];

  const session = startGeminiLiveVoice({ startMuted: true, micStream: Promise.resolve(stream), onAudioLevel: level => audioLevels.push(level) });
  try {
    for (let attempt = 0; attempt < 30 && (!FakeWebSocket.sockets.length || !FakeAudioContext.processors.length); attempt += 1) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    const socket = FakeWebSocket.sockets[0];
    const processor = FakeAudioContext.processors[0];
    assert.ok(socket, 'Live WebSocket should be created');
    assert.ok(processor, 'microphone audio processor should be created');

    socket.readyState = FakeWebSocket.OPEN;
    socket.onopen?.();
    await socket.onmessage?.({ data: JSON.stringify({ setupComplete: true }) });
    assert.equal(track.enabled, false, 'microphone track starts disabled in hold-to-talk mode');

    const event = { inputBuffer: { getChannelData: () => new Float32Array([0, 0.2, -0.2, 0.4]) } } as unknown as AudioProcessingEvent;
    processor.onaudioprocess?.(event);
    assert.equal(socket.sent.length, 1, 'muted microphone sends no audio frame');

    session.setMuted(false);
    assert.equal(track.enabled, true, 'pressing the talk control enables the microphone track');
    processor.onaudioprocess?.(event);
    assert.equal(socket.sent.length, 2, 'audio is sent while held');
    assert.ok(JSON.parse(socket.sent[1]).realtimeInput.audio.data);
    assert.ok((audioLevels.at(-1) || 0) > 0, 'waveform level follows the live microphone signal');

    session.setMuted(true);
    assert.equal(track.enabled, false, 'releasing the talk control disables the microphone track');
    assert.equal(audioLevels.at(-1), 0, 'releasing the talk control clears the waveform');
    processor.onaudioprocess?.(event);
    assert.equal(socket.sent.length, 2, 'audio stops immediately after release');
  } finally {
    session.stop();
    for (const undo of restore.reverse()) undo();
  }
});
