import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
const profile=await mkdtemp(tmpdir()+'/calculation-audit-ui-');
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
  await call('Page.addScriptToEvaluateOnNewDocument', {source: `localStorage.setItem('developer_bypass','true');localStorage.setItem('chat_history_unified_v3',JSON.stringify([{id:'audit-user',role:'user',persona:'lucy',content:'직업운 알려줘',timestamp:Date.now()-500},{id:'audit-ui-test',role:'model',persona:'lucy',content:'계산 근거 표시 검사 답변입니다.',timestamp:Date.now(),calculationAudit:[{toolId:'saju',name:'사주명리',status:'calculated',sentToModel:true},{toolId:'sukuyo',name:'숙요경',status:'symbolic',sentToModel:false,note:'계산 기준 재검토 중'},{toolId:'astrology',name:'서양 점성술',status:'skipped',sentToModel:false,note:'생년월일 미입력'}]}]));localStorage.setItem('lu_unlocked_date',new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date()));`},sessionId);
  await call('Page.navigate',{url:'http://127.0.0.1:4174/chat'},sessionId);
  await new Promise(r=>setTimeout(r,7000));
  const checked=await call('Runtime.evaluate',{expression:`(()=>{const e=[...document.querySelectorAll('details')].find(e=>e.textContent.includes('이번 답변의 계산 근거'));if(!e)throw Error('No audit displayed');e.open=true;const text=e.textContent;if(!text.includes('계산 근거 1개')||!text.includes('상징적 참고')||!text.includes('미계산'))throw Error(text);return {auditVisible:true,successCount:1,symbolicAndMissingVisible:true};})()`,returnByValue:true},sessionId);
  if(checked.exceptionDetails)throw Error(checked.exceptionDetails.exception.description);
  console.log(JSON.stringify(checked.result.value));

} finally {
  preview.kill(); socket?.close(); chrome.kill();
  await new Promise(resolve => chrome.once('exit', resolve));
  await rm(profile, { recursive: true, force: true });
}
