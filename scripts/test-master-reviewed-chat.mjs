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

  await call('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:true}, sessionId);
  await call('Page.addScriptToEvaluateOnNewDocument', {source:`localStorage.setItem('developer_bypass','true');localStorage.setItem('lucy_plus_active','true');localStorage.setItem('lu_unlocked_date',new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date()));`},sessionId);
  const draft='미검증초안 186개 정밀 계산 완료. 무조건 성공해.';
  const corrected='성공을 확정할 자료는 없어. 생년월일을 알려주면 계산 가능한 범위를 확인하고, 지금은 실행 계획부터 함께 정리해 보자.';
  let generations=0,reviews=0,draftVisible=false;
  socket.addEventListener('message', async event=>{
    const e=JSON.parse(event.data);
    if(e.method!=='Fetch.requestPaused')return;
    const {requestId,request}=e.params;
    if(request.method==='OPTIONS'){await call('Fetch.fulfillRequest',{requestId,responseCode:204,responseHeaders:[{name:'Access-Control-Allow-Origin',value:'*'},{name:'Access-Control-Allow-Methods',value:'POST, OPTIONS'},{name:'Access-Control-Allow-Headers',value:'*'}]},sessionId);return;}
    if(!request.url.includes('generateContent')&&!request.url.includes('streamGenerateContent')&&!request.url.includes('/chat/completions')){
      await call('Fetch.failRequest',{requestId,errorReason:'BlockedByClient'},sessionId);return;
    }
    const google=request.url.includes('googleapis.com');
    const body=request.postData||'';
    const review=body.includes('근거 검토자');
    if(review){
      reviews++;
      const state=await call('Runtime.evaluate',{expression:`document.body.innerText.includes(${JSON.stringify(draft)})`,returnByValue:true},sessionId);
      draftVisible ||= Boolean(state.result.value);
      await new Promise(r=>setTimeout(r,700));
    }else generations++;
    const text=review?JSON.stringify({valid:false,issues:['전체 계산 및 성공 보장 과장'],revisedReply:corrected}):draft;
    const stream=request.url.includes('streamGenerateContent')||(!google&&JSON.parse(body).stream);
    const payload=google?{candidates:[{content:{role:'model',parts:[{text}]},finishReason:'STOP'}]}:{model:'gemini-3.6-flash',choices:[stream?{index:0,delta:{content:text},finish_reason:'stop'}:{index:0,message:{role:'assistant',content:text},finish_reason:'stop'}]};
    const response=stream?'data: '+JSON.stringify(payload)+'\n\n'+(google?'':'data: [DONE]\n\n'):JSON.stringify(payload);
    await call('Fetch.fulfillRequest',{requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:stream?'text/event-stream':'application/json'},{name:'Access-Control-Allow-Origin',value:'*'}],body:Buffer.from(response).toString('base64')},sessionId);
  });
  await call('Fetch.enable',{patterns:[{urlPattern:'https://*'},{urlPattern:'http://127.0.0.1:4174/api/*'}]},sessionId);
  await call('Page.navigate',{url:'http://127.0.0.1:4174/chat?mode=plus'},sessionId);
  await new Promise(r=>setTimeout(r,7000));
  await call('Runtime.evaluate',{expression:`document.querySelector('textarea').focus()`},sessionId);
  await call('Input.insertText',{text:'내 프로젝트가 성공할지 알려줘'},sessionId);
  await new Promise(r=>setTimeout(r,200));
  await call('Runtime.evaluate',{expression:`document.querySelector('button[aria-label="메시지 전송"]').click()`},sessionId);
  let final;
  for(let i=0;i<80;i++){
    await new Promise(r=>setTimeout(r,200));
    final=await call('Runtime.evaluate',{expression:`JSON.stringify({corrected:document.body.innerText.includes('성공을 확정할 자료는 없어.')&&document.body.innerText.includes('지금은 실행 계획부터 함께 정리해 보자.'),draft:document.body.innerText.includes(${JSON.stringify(draft)})})`,returnByValue:true},sessionId);
    if(JSON.parse(final.result.value).corrected)break;
  }
  const result=JSON.parse(final.result.value);
  if(!result.corrected||result.draft||draftVisible||!reviews||!generations)throw Error(JSON.stringify({result,reviews,generations,draftVisible}));
  console.log(JSON.stringify({generations,reviews,unreviewedDraftHidden:true,reviewedCorrectionVisible:true}));

} finally {
  preview.kill(); socket?.close(); chrome.kill();
  await new Promise(resolve => chrome.once('exit', resolve));
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
