import test from 'node:test';
import assert from 'node:assert/strict';
import { startGeminiLiveVoice } from '../src/lib/geminiLiveSession.ts';
import { isMicCaptureActive } from '../src/lib/audioMixingPolicy.ts';

class FakeAudioContext {
  static processors: Array<{ onaudioprocess: ((event: AudioProcessingEvent) => void) | null; connect: () => void; disconnect: () => void; disconnected: number }> = [];
  currentTime = 0;
  sampleRate = 48_000;
  destination = {};
  resume() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
  createMediaStreamSource(_stream: MediaStream) { return { connect() {}, disconnect() {} }; }
  createScriptProcessor() {
    const node = { onaudioprocess: null as ((event: AudioProcessingEvent) => void) | null, connect() {}, disconnect() { node.disconnected += 1; }, disconnected: 0 };
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
  onopen: (() => void) | null = null;
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

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

function makeStream() {
  const track = { enabled: true, stopped: 0, stop() { this.stopped += 1; } };
  const stream = { getAudioTracks: () => [track], getTracks: () => [track] } as unknown as MediaStream;
  return { stream, track };
}

async function startNoMicSession(getUserMedia: () => Promise<MediaStream>) {
  FakeAudioContext.processors = [];
  FakeWebSocket.sockets = [];
  const restore = [
    replaceGlobal('AudioContext', FakeAudioContext),
    replaceGlobal('WebSocket', FakeWebSocket),
    replaceGlobal('navigator', { mediaDevices: { getUserMedia } }),
    replaceGlobal('fetch', async () => ({ ok: true, json: async () => ({ token: 'test-token', model: 'gemini-3.8-live' }) })),
  ];
  const session = startGeminiLiveVoice({ startMuted: true, micStream: null, onNotice: () => undefined });
  try {
    for (let i = 0; i < 40 && !FakeWebSocket.sockets.length; i += 1) await new Promise(resolve => setTimeout(resolve, 0));
    assert.ok(FakeWebSocket.sockets[0], 'live session should open its WebSocket');
    return { session, restore };
  } catch (error) {
    session.stop();
    for (const undo of restore.reverse()) undo();
    throw error;
  }
}

test('an explicit no-mic startup does not request capture until a user action calls acquireMic', async () => {
  let requests = 0;
  const { session, restore } = await startNoMicSession(async () => { requests += 1; throw new Error('unexpected'); });
  try {
    assert.equal(requests, 0, 'a reconnect without a gesture must not call getUserMedia');
    assert.equal(isMicCaptureActive(), false);
  } finally {
    session.stop();
    for (const undo of restore.reverse()) undo();
  }
});

test('release while getUserMedia is pending stops the late stream and keeps capture inactive', async () => {
  const pending = deferred<MediaStream>();
  const { stream, track } = makeStream();
  let requests = 0;
  const { session, restore } = await startNoMicSession(() => { requests += 1; return pending.promise; });
  try {
    const acquiring = session.acquireMic();
    assert.equal(requests, 1, 'acquireMic starts the browser request immediately');
    session.releaseMic();
    assert.equal(isMicCaptureActive(), false, 'release also invalidates a pending request');
    pending.resolve(stream);
    assert.equal(await acquiring, false);
    assert.equal(track.stopped, 1, 'a stream arriving after release is closed immediately');
    assert.equal(FakeAudioContext.processors.length, 0, 'a stale stream is never attached to an audio processor');
    assert.equal(isMicCaptureActive(), false);
  } finally {
    session.stop();
    for (const undo of restore.reverse()) undo();
  }
});

test('concurrent acquire calls share one request and a released stream can be reopened', async () => {
  const requests: ReturnType<typeof deferred<MediaStream>>[] = [];
  const { session, restore } = await startNoMicSession(() => {
    const next = deferred<MediaStream>();
    requests.push(next);
    return next.promise;
  });
  const firstStream = makeStream();
  const secondStream = makeStream();
  try {
    const firstAcquire = session.acquireMic();
    const duplicateAcquire = session.acquireMic();
    assert.equal(requests.length, 1, 'overlapping callers must not open two microphone streams');
    requests[0].resolve(firstStream.stream);
    assert.equal(await firstAcquire, true);
    assert.equal(await duplicateAcquire, true);
    assert.equal(FakeAudioContext.processors.length, 1);
    assert.equal(isMicCaptureActive(), true);

    session.releaseMic();
    assert.equal(firstStream.track.stopped, 1);
    assert.equal(isMicCaptureActive(), false);
    const reopened = session.acquireMic();
    assert.equal(requests.length, 2);
    requests[1].resolve(secondStream.stream);
    assert.equal(await reopened, true);
    assert.equal(FakeAudioContext.processors.length, 2);
    assert.equal(isMicCaptureActive(), true);
  } finally {
    session.stop();
    assert.equal(secondStream.track.stopped, 1, 'stopping the session closes the currently owned stream');
    for (const undo of restore.reverse()) undo();
  }
});

test('an older pending microphone request cannot replace a newer re-acquisition', async () => {
  const requests: ReturnType<typeof deferred<MediaStream>>[] = [];
  const { session, restore } = await startNoMicSession(() => {
    const next = deferred<MediaStream>();
    requests.push(next);
    return next.promise;
  });
  const oldStream = makeStream();
  const currentStream = makeStream();
  try {
    const older = session.acquireMic();
    session.releaseMic();
    const newer = session.acquireMic();
    assert.equal(requests.length, 2);
    requests[1].resolve(currentStream.stream);
    assert.equal(await newer, true);
    requests[0].resolve(oldStream.stream);
    assert.equal(await older, false);
    assert.equal(oldStream.track.stopped, 1);
    assert.equal(currentStream.track.stopped, 0);
    assert.equal(FakeAudioContext.processors.length, 1, 'only the current stream is attached');
    assert.equal(isMicCaptureActive(), true, 'a stale result cannot clear the current mic policy');
  } finally {
    session.stop();
    assert.equal(currentStream.track.stopped, 1);
    for (const undo of restore.reverse()) undo();
  }
});
