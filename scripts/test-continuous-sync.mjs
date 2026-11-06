import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { build } from 'esbuild';
// Actual sync controllers, isolated browser profiles, synthetic transport. No user cloud data.
const pro=process.argv.includes('--pro');
const source=`
import {createContinuousDataSync,syncDataSignature} from './src/lib/continuousDataSync';
import {recoveringSubscription} from './src/lib/recoveringSubscription';
const id=new URL(location.href).searchParams.get('device');
let state=JSON.parse(localStorage.getItem('data')||'{"values":{}}'),serial=0;
const merge=(left,right)=>{const values={...left.values};for(const [key,value]of Object.entries(right.values||{})){const old=values[key];if(!old||value.clock>old.clock||value.clock===old.clock&&value.writer>old.writer)values[key]=value;}return {values};};
const receive=value=>{state=merge(state,value);localStorage.setItem('data',JSON.stringify(state));};
const sync=createContinuousDataSync({read:()=>state,changeToken:()=>localStorage.getItem('data')||'',signature:syncDataSignature,retryMs:30,push:async value=>{const response=await fetch('/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});if(!response.ok)throw Error('offline');}});
const stop=recoveringSubscription({watch:(next,error)=>{const stream=new EventSource('/events');stream.onmessage=event=>next(JSON.parse(event.data));stream.onerror=error;return()=>stream.close();},load:async()=>{const response=await fetch('/state');if(!response.ok)throw Error('offline');return response.json();},receive,events:window,document,intervalMs:200,staleMs:500,loadTimeoutMs:500,retryMs:30});
const timer=setInterval(()=>void sync.scan(),100);
window.harness={set:(key,text)=>{state.values[key]={text,clock:Date.now()*1000+serial++,writer:id};localStorage.setItem('data',JSON.stringify(state));},state:()=>state,wake:()=>{window.dispatchEvent(new Event('online'));void sync.wake();},stop:()=>{clearInterval(timer);stop();sync.dispose();}};
`;
const proSource=`
import React from 'react';import {createRoot} from 'react-dom/client';import {useLucyProConversation} from './src/hooks/useLucyProConversation';
function App(){const chat=useLucyProConversation('shared-test-account','shared-test-account');window.harness={state:()=>({messages:chat.messages,aborted:window.activeSignal?.aborted,generating:chat.generating}),send:text=>chat.runtime.setMessages(previous=>[...previous,{id:crypto.randomUUID(),role:'user',content:text,timestamp:Date.now()}]),answer:text=>chat.runtime.setMessages(previous=>[...previous,{id:crypto.randomUUID(),role:'model',content:text,timestamp:Date.now(),tarotDraw:{source:'app-random',id:'test-draw',drawnAt:Date.now(),markers:'[TAROT:major_19:upright]'}}]),reveal:()=>chat.runtime.setMessages(previous=>previous.map(message=>message.tarotDraw?{...message,tarotDraw:{...message.tarotDraw,revealedCardIds:['major_19']}}:message)),busy:()=>{const controller=new AbortController();window.activeSignal=controller.signal;chat.runtime.abortControllersRef.current.lucy=controller;chat.runtime.isGeneratingRef.current.lucy=true;chat.runtime.activeAssistMsgIdRef.current.lucy='active';chat.runtime.setMessages(previous=>[...previous,{id:'active',role:'model',content:'',timestamp:Date.now()}]);},wake:()=>window.dispatchEvent(new Event('online')),reset:chat.reset,stop:()=>{}};return React.createElement('div',null,chat.messages.map(message=>message.content).join(' / '));}
const root=document.createElement('div');document.documentElement.append(root);createRoot(root).render(React.createElement(App));
`;
const mockFirebase=`
export const auth={currentUser:{uid:'shared-test-account'}},db={};export const doc=()=>({});
const snapshot=value=>({metadata:{hasPendingWrites:false,fromCache:false},data:()=>value,exists:()=>true});
export const setDoc=async(_reference,value)=>{const response=await fetch('/state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});if(!response.ok)throw Error('offline');};
export const getDocFromServer=async()=>snapshot(await(await fetch('/state')).json());
export const onSnapshot=(_reference,_options,next,error)=>{const stream=new EventSource('/events');stream.onmessage=event=>next(snapshot(JSON.parse(event.data)));stream.onerror=error;return()=>stream.close();};
`;
const plugins=pro?[{name:'isolated-firestore',setup(builder){builder.onResolve({filter:/^@\/lib\/(firebase|sharedStateSync)$/},args=>({path:args.path,namespace:'mock'}));builder.onLoad({filter:/.*/,namespace:'mock'},args=>({contents:args.path.endsWith('firebase')?mockFirebase:'export const cleanFirestoreData=value=>JSON.parse(JSON.stringify(value));',loader:'js'}));}}]:[];
const bundled=await build({stdin:{contents:pro?proSource:source,resolveDir:process.cwd(),loader:'ts'},bundle:true,format:'iife',write:false,platform:'browser',plugins});
let state={values:{}},writes=0;const streams=new Set();
const server=createServer(async(req,res)=>{
 if(req.url==='/client.js'){res.writeHead(200,{'Content-Type':'application/javascript'});res.end(bundled.outputFiles[0].text);return;}
 if(req.url==='/events'){res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store','Connection':'keep-alive'});res.write('data: '+JSON.stringify(state)+'\n\n');streams.add(res);req.on('close',()=>streams.delete(res));return;}
 if(req.url==='/state'){
  if(req.method==='POST'){let body='';for await(const chunk of req)body+=chunk;state=JSON.parse(body);writes++;for(const stream of streams)stream.write('data: '+JSON.stringify(state)+'\n\n');}
  res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(state));return;
 }
 res.end('<!doctype html><script src="/client.js"></script>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
const profile=await mkdtemp(tmpdir()+'/luckey-continuous-sync-');
const chrome=spawn('/usr/bin/chromium',['--headless=new','--no-sandbox','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','ignore','pipe']});
let socket;
try{
 const endpoint=await new Promise((resolve,reject)=>{let output='';const timeout=setTimeout(()=>reject(Error('Chrome timeout')),15000);chrome.stderr.on('data',chunk=>{output+=chunk;const match=output.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(match){clearTimeout(timeout);resolve(match[1]);}});});
 socket=new WebSocket(endpoint);await new Promise(resolve=>socket.addEventListener('open',resolve));
 let id=0;const pending=new Map();socket.addEventListener('message',event=>{const item=JSON.parse(event.data),request=pending.get(item.id);if(!request)return;pending.delete(item.id);item.error?request.reject(Error(JSON.stringify(item.error))):request.resolve(item.result);});
 const call=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const next=++id;pending.set(next,{resolve,reject});socket.send(JSON.stringify({id:next,method,params,...(sessionId?{sessionId}:{})}));});
 const evaluate=async(session,expression)=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},session);if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description);return result.result.value;};
 const waitFor=async(session,expression)=>{for(let i=0;i<80;i++){if(await evaluate(session,expression))return;await new Promise(resolve=>setTimeout(resolve,75));}throw Error('Condition failed: '+expression);};
 const open=async(device)=>{const {browserContextId}=await call('Target.createBrowserContext');const {targetId}=await call('Target.createTarget',{url:'about:blank',browserContextId});const {sessionId}=await call('Target.attachToTarget',{targetId,flatten:true});await call('Page.enable',{},sessionId);await call('Network.enable',{},sessionId);if(device==='phone')await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true},sessionId);await call('Page.navigate',{url:`http://127.0.0.1:${port}/?device=${device}`},sessionId);await waitFor(sessionId,'Boolean(window.harness)');return sessionId;};
 const pc=await open('pc'),phone=await open('phone');
 if(pro){
  await evaluate(pc,"harness.send('PC pro question')");await waitFor(phone,"harness.state().messages.some(message=>message.content==='PC pro question')");
  await evaluate(phone,"harness.answer('Reviewed pro answer')");await waitFor(pc,"harness.state().messages.some(message=>message.content==='Reviewed pro answer')");
  await evaluate(phone,'harness.reveal()');await waitFor(pc,"harness.state().messages.some(message=>message.tarotDraw?.revealedCardIds?.includes('major_19'))");
  await evaluate(pc,'harness.busy()');
  await call('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:-1,uploadThroughput:-1},phone);
  await evaluate(phone,"harness.send('Offline pro question')");await evaluate(pc,"harness.send('PC continued pro')");
  await new Promise(resolve=>setTimeout(resolve,250));await call('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1},phone);await evaluate(phone,'harness.wake()');
  await waitFor(pc,"harness.state().messages.some(message=>message.content==='Offline pro question')");await waitFor(phone,"harness.state().messages.some(message=>message.content==='PC continued pro')");
  await new Promise(resolve=>setTimeout(resolve,250));await call('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:-1,uploadThroughput:-1},phone);await evaluate(phone,'harness.reset()');await new Promise(resolve=>setTimeout(resolve,100));await call('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1},phone);await call('Page.reload',{},phone);await waitFor(phone,"Boolean(window.harness)&&performance.getEntriesByType('navigation')[0].type==='reload'");await waitFor(pc,"!harness.state().messages.some(message=>message.role==='user')");await waitFor(pc,'harness.state().aborted===true');
  await new Promise(resolve=>setTimeout(resolve,500));const settled=writes;await new Promise(resolve=>setTimeout(resolve,600));if(writes!==settled)throw Error('Pro write echo loop');
  console.log(JSON.stringify({actualReactProHook:true,syntheticFirestore:true,isolatedBrowserProfiles:2,bidirectional:true,cardRevealSynced:true,offlineEditRecovered:true,remoteResetAbortsGeneration:true,offlineResetSurvivesReload:true,echoLoop:false,manualSyncActions:0,writes}));
 }else{
 await evaluate(pc,"window.busy=true;harness.set('goal','PC goal')");await waitFor(phone,"harness.state().values.goal?.text==='PC goal'");
 await evaluate(phone,"harness.set('diary','first')");await waitFor(pc,"harness.state().values.diary?.text==='first'");
 await evaluate(phone,"harness.set('diary','edited same item')");await waitFor(pc,"harness.state().values.diary?.text==='edited same item'");
 await call('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:-1,uploadThroughput:-1},phone);
 await evaluate(phone,"harness.set('offline','saved while disconnected')");await evaluate(pc,"harness.set('pc','PC continued')");
 await new Promise(resolve=>setTimeout(resolve,250));
 await call('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1},phone);
 await evaluate(phone,'harness.wake()');await waitFor(pc,"harness.state().values.offline?.text==='saved while disconnected'");await waitFor(phone,"harness.state().values.pc?.text==='PC continued'");
 await new Promise(resolve=>setTimeout(resolve,500));const settled=writes;await new Promise(resolve=>setTimeout(resolve,600));if(writes!==settled)throw Error('Write echo loop');
 console.log(JSON.stringify({isolatedBrowserProfiles:2,pcToPhone:true,phoneToPc:true,sameItemEdit:true,offlineEditRecovered:true,activeSessionUnaffected:true,manualSyncActions:0,echoLoop:false,transport:'isolated test server',writes}));
 }
 await evaluate(pc,'harness.stop()');await evaluate(phone,'harness.stop()');
}finally{
 socket?.close();chrome.kill();await new Promise(resolve=>chrome.once('exit',resolve));for(const stream of streams)stream.end();await new Promise(resolve=>server.close(resolve));await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});
}
