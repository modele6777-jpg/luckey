import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
const profile=await mkdtemp(tmpdir()+'/lucy-audio-focus-');
// Requires npm run build. No external API calls or account data are used.
const preview = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => { preview.kill(); reject(Error('Preview startup timed out')); }, 10000);
  preview.stdout.on('data', chunk => { if (chunk.toString().includes('4174')) { clearTimeout(timer); resolve(); } });
  preview.once('error', reject);
  preview.once('exit', code => { clearTimeout(timer); reject(Error('Preview exited: '+code)); });
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
    const id = ++nextId; pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
  await call('Page.enable', {}, sessionId);
  await call('Network.enable', {}, sessionId);
  await call('Network.setBlockedURLs', { urls: ['https://*'] }, sessionId);
  await call('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:true}, sessionId);
  await call('Page.addScriptToEvaluateOnNewDocument', {source: `localStorage.setItem('developer_bypass','true');localStorage.setItem('lu_unlocked_date',new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date()));`},sessionId);
  await call('Page.navigate',{url:'http://127.0.0.1:4174/chat'},sessionId);
  await new Promise(r=>setTimeout(r,7000));
  await call('Runtime.evaluate',{expression:`window.__audioCalls={resume:0,play:0,playbackSessions:0};const ac=window.AudioContext.prototype;ac.resume=function(){window.__audioCalls.resume++;return Promise.resolve();};HTMLMediaElement.prototype.play=function(){window.__audioCalls.play++;return Promise.resolve();};Object.defineProperty(navigator,'audioSession',{configurable:true,value:{get type(){return 'ambient';},set type(v){if(v==='playback')window.__audioCalls.playbackSessions++;}}});`},sessionId);
  const rect=await call('Runtime.evaluate',{expression:`(()=>{const b=document.getElementById('bigbang-omnibutton');if(!b)throw Error('Missing orb');const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};})()`,returnByValue:true},sessionId);
  await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...rect.result.value},sessionId);
  await new Promise(r=>setTimeout(r,450));
  await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...rect.result.value},sessionId);
  await new Promise(r=>setTimeout(r,600));
  const checked=await call('Runtime.evaluate',{expression:`JSON.stringify({...window.__audioCalls,plus:localStorage.getItem('lucy_plus_active')==='true'})`,returnByValue:true},sessionId);
  const results=JSON.parse(checked.result.value);
  if(!results.plus||results.resume||results.play||results.playbackSessions)throw Error(JSON.stringify(results));
  console.log(JSON.stringify(results));

} finally {
  preview.kill(); socket?.close(); chrome.kill();
  await new Promise(resolve => chrome.once('exit', resolve));
  await rm(profile, { recursive: true, force: true });
}
