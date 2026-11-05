import { build } from 'esbuild';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const { outputFiles } = await build({
  stdin: { resolveDir: process.cwd(), contents: `
    import { renderProceduralBgm, encodeBgmWav } from './src/lib/proceduralBgmMedia';
    import { FLOW_AUDIO_TRACKS } from './src/lib/proceduralBgmSuite';
    import { setBgmPlaybackSessionActive, configureAmbientAudioSession } from './src/lib/audio';
    globalThis.runBgmTests = async () => {
      const originalInterval = window.setInterval;
      window.setInterval = () => { throw new Error('Rendered music must not use live timers'); };
      const tracks = [];
      let sample;
      for (const track of FLOW_AUDIO_TRACKS) {
        const buffer = await renderProceduralBgm(track.url, 16);
        const samples = buffer.getChannelData(0);
        let power = 0;
        for (const value of samples) { if (!Number.isFinite(value)) throw Error('Invalid sample: ' + track.url); power += value * value; }
        const rms = Math.sqrt(power / samples.length);
        if (rms < 0.000001) throw Error('Silent track: ' + track.url);
        tracks.push({ track: track.url, rms });
        sample = buffer;
      }
      window.setInterval = originalInterval;
      const blob = encodeBgmWav(sample);
      const header = new DataView(await blob.slice(0, 44).arrayBuffer());
      if (header.getUint32(24, true) !== 22050 || header.getUint16(22, true) !== 2) throw Error('WAV format incorrect');
      const audio = new Audio(URL.createObjectURL(blob));
      audio.loop = true;
      await audio.play();
      const liveContext = new AudioContext();
      await liveContext.resume();
      await liveContext.suspend();
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (audio.paused || audio.currentTime < 0.5) throw Error('Native music stopped with suspended live context');
      const progressed = audio.currentTime;
      audio.pause();
      URL.revokeObjectURL(audio.src);
      await liveContext.close();
      const fakeSession = { type: 'ambient' };
      Object.defineProperty(navigator, 'audioSession', { configurable: true, value: fakeSession });
      configureAmbientAudioSession();
      if (fakeSession.type !== 'ambient') throw Error('Idle app took playback audio focus');
      setBgmPlaybackSessionActive(true);
      configureAmbientAudioSession();
      if (fakeSession.type !== 'playback') throw Error('Playing BGM lacks background session');
      setBgmPlaybackSessionActive(false);
      if (fakeSession.type !== 'ambient') throw Error('Pause did not release playback session');
      return { tracks: tracks.length, nativePlaybackWithSuspendedContextSeconds: progressed, sessionTransitions: 'ambient → playback → ambient', minRms: Math.min(...tracks.map(t => t.rms)) };
    };
  ` }, bundle: true, format: 'iife', write: false, platform: 'browser', logLevel: 'silent',
});
const profile = await mkdtemp(path.join(tmpdir(), 'luckey-bgm-test-'));
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
  const result = await call('Runtime.evaluate', { expression: outputFiles[0].text + '\nrunBgmTests()', awaitPromise: true, returnByValue: true, timeout: 120000 }, sessionId);
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || JSON.stringify(result.exceptionDetails));
  console.log(JSON.stringify(result.result.value, null, 2));
} finally {
  socket?.close(); chrome.kill();
  await new Promise(resolve => chrome.once('exit', resolve));
  await rm(profile, { recursive: true, force: true });
}
