import { build } from 'esbuild';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const { outputFiles } = await build({
  stdin: { resolveDir: process.cwd(), contents: `
    import { playTTSAudio, getTTSAudioElement, getSharedAudioContext, pauseTTSAudio, resumeTTSAudio, stopTTSPlayback, getTTSPlaybackProgress, initTTSAudioLifecycle, configureAmbientAudioSession } from './src/lib/audio';
    globalThis.runSpeechTests = async () => {
      const fakeSession = { type: 'ambient' };
      Object.defineProperty(navigator, 'audioSession', { configurable: true, value: fakeSession });
      let visibility = 'visible';
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => visibility });
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
      const pcm = new Uint8Array(24000 * 2 * 2);
      const view = new DataView(pcm.buffer);
      for (let i = 0; i < pcm.length / 2; i++) view.setInt16(i * 2, Math.sin(i * 2 * Math.PI * 220 / 24000) * 2000, true);
      let binary = '';
      for (let i = 0; i < pcm.length; i += 16384) binary += String.fromCharCode(...pcm.subarray(i, i + 16384));
      const encoded = btoa(binary);
      initTTSAudioLifecycle(); configureAmbientAudioSession();
      if (fakeSession.type !== 'ambient') throw Error('Idle speech claimed audio focus');
      const audio = getTTSAudioElement();
      let loads = 0;
      const load = audio.load.bind(audio);
      audio.load = () => { loads++; load(); };
      let onPlaying;
      const started = new Promise(resolve => onPlaying = resolve);
      const first = playTTSAudio(encoded, 'pcm', 24000, undefined, true, undefined, () => onPlaying());
      await started;
      if (fakeSession.type !== 'playback') throw Error('Active speech lacks background session');
      const liveContext = getSharedAudioContext();
      await liveContext.suspend();
      visibility = 'hidden'; document.dispatchEvent(new Event('visibilitychange'));
      const before = audio.currentTime;
      await wait(650);
      const progressed = audio.currentTime - before;
      if (audio.paused || progressed < 0.3 || liveContext.state !== 'suspended') throw Error('Speech depends on foreground AudioContext');
      pauseTTSAudio();
      const pausedAt = audio.currentTime;
      if (fakeSession.type !== 'ambient') throw Error('Manual pause kept speech session active');
      visibility = 'visible'; document.dispatchEvent(new Event('visibilitychange'));
      await wait(200);
      if (!audio.paused || Math.abs(audio.currentTime - pausedAt) > 0.02) throw Error('Visibility change overrode manual pause');
      resumeTTSAudio();
      await wait(250);
      if (audio.currentTime < pausedAt + 0.1 || fakeSession.type !== 'playback') throw Error('Resume lost native speech position');
      await first;
      let secondPlaying;
      const secondStarted = new Promise(resolve => secondPlaying = resolve);
      const second = playTTSAudio(encoded, 'pcm', 24000, undefined, true, undefined, () => secondPlaying());
      await secondStarted;
      if (audio !== getTTSAudioElement() || loads !== 0) throw Error('Chunk transition reinitialized native player');
      audio.pause();
      const interruptedAt = audio.currentTime;
      document.dispatchEvent(new Event('visibilitychange'));
      await wait(300);
      if (audio.paused || audio.currentTime < interruptedAt + 0.1) throw Error('System interruption did not recover');
      const beforeStop = getTTSPlaybackProgress();
      stopTTSPlayback(); await second;
      document.dispatchEvent(new Event('visibilitychange'));
      if (!audio.paused || audio.getAttribute('src') || fakeSession.type !== 'ambient') throw Error('Stopped speech restarted or retained audio session');
      await liveContext.close();
      return { nativeSpeechProgressWithHiddenPageAndSuspendedContextSeconds: progressed, manualPausePreserved: true, resumedFromPosition: pausedAt, chunkPlayerReloads: loads - 1, systemInterruptionRecovered: true, stopRemainsStopped: true };
    };
  ` }, bundle: true, format: 'iife', write: false, platform: 'browser', logLevel: 'silent',
});
const profile = await mkdtemp(path.join(tmpdir(), 'luckey-tts-test-'));
const chrome = spawn(process.env.CHROME_PATH || '/usr/bin/chromium', ['--headless=new', '--no-sandbox', '--autoplay-policy=no-user-gesture-required', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    let log = '';
    const timeout = setTimeout(() => reject(Error('Chromium did not start')), 20000);
    chrome.on('error', reject);
    chrome.stderr.on('data', chunk => {
      log += chunk;
      const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timeout); resolve(match[1]); }
    });
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve); socket.addEventListener('error', reject); });
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const response = JSON.parse(event.data);
    const request = pending.get(response.id);
    if (!request) return;
    pending.delete(response.id);
    response.error ? request.reject(Error(JSON.stringify(response.error))) : request.resolve(response.result);
  });
  const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId; pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
  const result = await call('Runtime.evaluate', { expression: outputFiles[0].text + '\nrunSpeechTests()', awaitPromise: true, returnByValue: true, timeout: 120000 }, sessionId);
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || JSON.stringify(result.exceptionDetails));
  console.log(JSON.stringify(result.result.value, null, 2));
} finally {
  socket?.close(); chrome.kill();
  await new Promise(resolve => chrome.once('exit', resolve));
  await rm(profile, { recursive: true, force: true });
}
