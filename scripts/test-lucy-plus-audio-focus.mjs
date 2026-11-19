import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const profile = await mkdtemp(path.join(tmpdir(), 'lucy-audio-focus-'));
// Requires npm run build. No external API calls or account data are used.
const preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => { preview.kill(); reject(Error('Preview startup timed out')); }, 10000);
  preview.stdout.on('data', chunk => { if (chunk.toString().includes('4174')) { clearTimeout(timer); resolve(); } });
  preview.once('error', reject);
  preview.once('exit', code => { clearTimeout(timer); reject(Error('Preview exited: ' + code)); });
});
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
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
  await call('Page.enable', {}, sessionId);
  await call('Network.enable', {}, sessionId);
  await call('Network.setBlockedURLs', { urls: ['https://*'] }, sessionId);
  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }, sessionId);
  await call('Page.addScriptToEvaluateOnNewDocument', { source: `
    localStorage.setItem('developer_bypass', 'true');
    localStorage.setItem('lu_unlocked_date', new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date()));
    window.__audioCalls = { resume: 0, play: 0, playbackSessions: 0 };
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass?.prototype) AudioContextClass.prototype.resume = function() { window.__audioCalls.resume++; return Promise.resolve(); };
    HTMLMediaElement.prototype.play = function() { window.__audioCalls.play++; return Promise.resolve(); };
    Object.defineProperty(navigator, 'audioSession', { configurable: true, value: {
      get type() { return 'ambient'; },
      set type(value) { if (value === 'playback') window.__audioCalls.playbackSessions++; }
    }});
  ` }, sessionId);
  await call('Page.navigate', { url: 'http://127.0.0.1:4174/chat' }, sessionId);
  await new Promise(resolve => setTimeout(resolve, 7000));

  const folded = await call('Runtime.evaluate', { expression: `({
    unfolded: document.documentElement.classList.contains('duo-unfolded-mode'),
    plus: Boolean(document.querySelector('[data-lucy-name-marker="plus"]')),
    contentPane: Boolean(document.getElementById('duo-content-viewport')),
    lucyPane: Boolean(document.getElementById('duo-lucy-viewport'))
  })`, returnByValue: true }, sessionId);
  if (folded.exceptionDetails) throw Error(folded.exceptionDetails.exception.description);
  if (folded.result.value.unfolded || folded.result.value.plus || folded.result.value.contentPane || folded.result.value.lucyPane) {
    throw Error('Expected the 390x844 cover display to start folded: ' + JSON.stringify(folded.result.value));
  }

  // Exclude startup effects; count only actions caused by the actual Duo unfold into Lucy Plus.
  await call('Runtime.evaluate', { expression: `window.__audioCalls = { resume: 0, play: 0, playbackSessions: 0 };` }, sessionId);
  await call('Emulation.setDeviceMetricsOverride', { width: 700, height: 900, deviceScaleFactor: 1, mobile: true }, sessionId);
  await new Promise(resolve => setTimeout(resolve, 1600));
  const checked = await call('Runtime.evaluate', { expression: `(() => {
    const marker = document.querySelector('[data-lucy-name-marker="plus"]');
    return {
      ...window.__audioCalls,
      unfolded: document.documentElement.classList.contains('duo-unfolded-mode'),
      contentPane: Boolean(document.getElementById('duo-content-viewport')),
      lucyPane: Boolean(document.getElementById('duo-lucy-viewport')),
      plus: Boolean(marker && marker.getClientRects().length),
      viewport: { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }
    };
  })()`, returnByValue: true }, sessionId);
  if (checked.exceptionDetails) throw Error(checked.exceptionDetails.exception.description);
  const results = checked.result.value;
  if (!results.unfolded || !results.contentPane || !results.lucyPane || !results.plus || results.resume || results.play || results.playbackSessions) {
    throw Error(JSON.stringify(results));
  }
  console.log(JSON.stringify(results));
} finally {
  preview.kill();
  socket?.close();
  chrome.kill();
  await new Promise(resolve => chrome.once('exit', resolve));
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
