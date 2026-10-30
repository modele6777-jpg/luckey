import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { transform, build } from 'esbuild';
// Run the actual buffer lifecycle with a controllable audio clock and nodes.
const audio = fs.readFileSync('src/lib/audio.ts', 'utf8');
const launch = audio.slice(audio.indexOf('function launchWebAudioTTSSource'), audio.indexOf('/** Position in the decoded buffer'));
const compiled = await transform(launch, {loader: 'ts'});
const recoveryBundle = await build({entryPoints:['src/lib/audioRecovery.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const { recoverSpeechContext } = await import('data:text/javascript;base64,' + Buffer.from(recoveryBundle.outputFiles[0].text).toString('base64'));
function harness() {
  const timers = [];
  const nodes = [], clock = {currentTime: 0, state: 'running', resume: async () => {}, createBufferSource: () => { const n = {playbackRate: {}, connect() {}, start(_when, offset) {this.offset = offset;}}; nodes.push(n); return n; }};
  const state = {clock, nodes, timers, activeClock: clock, recovered: 0, speechContextNeedsReset: false, ttsContextRecoveryAttempts: 0, recoverSpeechContext, resolved: 0, rejected: 0, ttsActiveBuffer: {duration: 10}, ttsPlaybackId: 1, ttsActiveSource: null, ttsPausedOffsetSec: 0, ttsActiveRate: 1, ttsStartedAtCtxTime: 0, ttsStoppingForPause: false, ttsUserExplicitlyPaused: false, ttsEarlyEndRetries: 0, ttsShouldBePlaying: true, ttsSafetyTimer: null, activeTTSSources: new Set(), getSharedAudioContext: () => state.activeClock, replaceSpeechAudioContext() {state.recovered++; state.activeClock={...clock,currentTime:0};return state.activeClock;}, getTTSVoiceBus: () => ({}), clearTTSSafetyTimer() {}, stopActiveWebAudioTTSSource() {state.ttsActiveSource = null;}, stopAndDisconnectTTSSourceNode() {}, stopTTSKeepAlive() {}, releaseScreenWakeLock: async () => {}, setTimeout: fn => {timers.push(fn);return timers.length;}};
  state.ttsActiveFinishResolver = () => state.resolved++;
  state.ttsActiveReject = () => state.rejected++;
  vm.createContext(state);vm.runInContext(compiled.code, state);
  state.launchWebAudioTTSSource(1);return state;
}
let h = harness(); const stale = h.nodes[0].onended;
h.clock.currentTime = 3; stale();
assert.equal(h.resolved, 0); assert.equal(h.nodes.length, 2); assert.equal(h.nodes[1].offset, 3);
stale(); assert.equal(h.nodes.length, 2); assert.equal(h.ttsActiveBuffer.duration, 10);
h.clock.currentTime = 10; h.nodes[1].onended(); assert.equal(h.resolved, 1); assert.equal(h.rejected, 0);
h = harness(); h.ttsUserExplicitlyPaused = true; h.nodes[0].onended(); assert.equal(h.resolved, 0); assert.equal(h.nodes.length, 1);
h = harness(); for(let i=0;i<3;i++) h.nodes[i].onended(); assert.equal(h.resolved, 0); assert.equal(h.rejected, 1); assert.equal(h.ttsActiveBuffer, null);
console.log('Audio lifecycle: recover remaining audio, ignore stale/paused events, bound repeated interruptions.');
const entry = audio.slice(audio.indexOf('export async function playTTSAudio'), audio.indexOf('let ttsLifecycleInitialized'));
const entryJS = await transform(entry.replace('export async function','async function'), {loader: 'ts'});
const ctx = {state:'suspended', async resume() {this.state='running'; race.ttsPlaybackId++;}};
const race = {window:{}, ttsPlaybackId:1, speechContextNeedsReset:false, ttsShouldBePlaying:false, speechSessionActive:false, recoverSpeechContext, replaceSpeechAudioContext:()=>{throw Error("must not replace cancelled context")}, configureSpeechAudioSession() {}, configureAmbientAudioSession() {}, getSharedAudioContext:()=>ctx, stopRawPCM() {}, stopActiveWebAudioTTSSource() {}, base64ToBytes:()=>new Uint8Array(), detectAudioFormat:()=>'mp3', playSpeechMedia:async()=>{}, releaseScreenWakeLock:async()=>{}, setTimeout, clearTimeout};
vm.createContext(race);vm.runInContext(entryJS.code, race);
await race.playTTSAudio('unused');
assert.equal(race.ttsPlaybackId, 2);
console.log('A stop during asynchronous context resume cancels the pending playback.');
h = harness();
for(let i=0;i<3;i++) h.timers.shift()();
await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(h.recovered,1); assert.equal(h.nodes.length,2); assert.equal(h.resolved,0);
// A second frozen clock fails visibly instead of looping or requiring restart.
for(let i=0;i<3;i++) h.timers.shift()();
assert.equal(h.rejected,1);assert.equal(h.speechContextNeedsReset,true);
console.log('Frozen running audio clock: one automatic context rebuild, then bounded failure.');


// Bundle the actual readers with audio/network stand-ins; exercise long messages,
// request retries, failure propagation, and explicit cancellation without API costs.
const calls = [], events = [], spoken = []; let failures = 0, plays = 0, cancelOnPlay = false;
globalThis.__ttsTest = {calls, audio: async text => {spoken.push(text);plays++; if(cancelOnPlay) tts.stopTTS();}};
globalThis.window = {dispatchEvent: e => {events.push(e); return true;}};
const stubAudio = `export const getSharedAudioContext=()=>({state:'running'}); export const playTTSAudio=async(text)=>globalThis.__ttsTest.audio(text); export const getTTSPlaybackProgress=()=>null; export const isTTSAudioPlaying=()=>false;\n` + ['unlockAudioPlayback','playCompressedAudio','playRawPCM','primeTTSAudioElement','pauseTTSAudio','resumeTTSAudio','stopTTSPlayback','initTTSAudioLifecycle','analyzeTextEmotion','duckAmbientAudio','configureSpeechAudioSession','configureAmbientAudioSession'].map(n=>`export const ${n}=()=>{};`).join('\n');
const bundle = await build({entryPoints:['src/utils/tts.ts'],bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'stubs',setup(b){b.onResolve({filter:/^(react|.*\/(audio|audioHaptics|ttsMediaSession|wakeLock|perfMode))$/},a=>({path:a.path,namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},a=>({contents:a.path.endsWith('/audio')?stubAudio:a.path==='react'?'export const useState=()=>{};export const useEffect=()=>{};':a.path.endsWith('/ttsMediaSession')?['setTTSSessionActive','clearTTSSession','initTTSSessionHandlers','pauseTTSSession','resumeTTSSession'].map(n=>`export const ${n}=()=>{};`).join('\n'):a.path.endsWith('/wakeLock')?'export const acquireScreenWakeLock=async()=>{};export const releaseScreenWakeLock=async()=>{};':a.path.endsWith('/perfMode')?'export const isIOSDevice=()=>false;':'export const playAiResultNotification=()=>{globalThis.__ttsTest.chimes=(globalThis.__ttsTest.chimes||0)+1;};'}));}}]});
const tts = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
globalThis.fetch = async (_url, options) => {const text = JSON.parse(options.body).text;calls.push(text);if(failures-->0)return new Response('{}',{status:503});return Response.json({audioContent:text,encoding:'mp3'});};
const long = '긴 문장을 빠짐없이 끝까지 읽습니다 '.repeat(45).trim();
await tts.playConversation([{role:'assistant',content:long}]);
assert(calls.length>1);assert(calls.every(t=>t.length<=240));assert.equal(spoken.join(' ').replace(/[^가-힣a-zA-Z0-9]/g,''), tts.normalizeTextForSpeech(long).replace(/[^가-힣a-zA-Z0-9]/g,''));
const before = plays;failures=1;await tts.playTTS('일시 연결 실패 재시도 확인 문장입니다', 'Aoede', true);assert.equal(plays,before+1);
failures=2;const count=plays;await tts.playQAndATTS({text:''},{text:'실패를 조용히 넘기지 않습니다. 다음 문장은 읽지 않아야 합니다.'});assert.equal(plays,count);assert(events.some(e=>e.type==='prism:tts-error'));
failures=0;cancelOnPlay=true;const start=plays;await tts.playConversation([{role:'assistant',content:long}]);assert.equal(plays,start+1);
console.log('Readers: complete long text, bounded chunks, transient retry, visible failure, explicit stop.');

const savedFetch = globalThis.fetch;
let rateLimitsLeft = 2;
globalThis.fetch = async (_url, options) => {
  const body = JSON.parse(options.body).text;
  calls.push(body);
  if (rateLimitsLeft-- > 0) {
    return new Response(JSON.stringify({ code: 'MEDIA_RATE_LIMIT', retryAfterSeconds: 0.05 }), {
      status: 429,
      headers: { 'Retry-After': '0.05', 'Content-Type': 'application/json' },
    });
  }
  return Response.json({ audioContent: body, encoding: 'mp3' });
};
events.length = 0;
const beforeRate = plays;
await tts.playTTSInChunks('첫째 문장을 읽습니다. 둘째 문장도 이어서 읽습니다. 셋째 문장까지 멈추지 않습니다.');
assert.equal(plays, beforeRate + 1);
assert(!events.some(event => event.type === 'prism:tts-error'), 'transient 429 is retried inside the reading');
rateLimitsLeft = 1;
events.length = 0;
const singleBefore = plays;
await tts.playTTS('한 문장도 짧은 제한은 기다렸다가 읽습니다', 'Aoede', true);
assert.equal(plays, singleBefore + 1);
assert(!events.some(event => event.type === 'prism:tts-error'), 'a single reading also waits out a short 429');
globalThis.fetch = savedFetch;
console.log('Full reading waits through a short rate limit and finishes without asking the user to retry.');

cancelOnPlay=false;
const realFetch=globalThis.fetch;
globalThis.fetch=()=>new Promise(()=>{});
const hung=tts.playTTS('이 요청은 브라우저에서 영원히 멈춥니다','Aoede',true);
await new Promise(resolve=>setTimeout(resolve,0));
tts.stopTTS();
await hung;
globalThis.fetch=realFetch;
const next=plays;
await tts.playTTS('재시작 없이 다음 음성을 읽습니다','Aoede',true);
assert.equal(plays,next+1);
console.log('Stopped hung fetch releases request queue; next playback works without restart.');

// Pause during generation: a completed response must wait for explicit resume.
let completeRequest;
globalThis.fetch=()=>new Promise(resolve=>{completeRequest=resolve;});
const beforePause=plays;
const loading=tts.playTTS('생성 중 일시정지 검증 문장','Aoede',true);
await new Promise((resolve, reject) => {
  const started = Date.now();
  const tick = () => {
    if (typeof completeRequest === 'function') return resolve();
    if (Date.now() - started > 5000) return reject(new Error('TTS request did not start'));
    setTimeout(tick, 20);
  };
  tick();
});
tts.pauseTTS();
completeRequest(Response.json({audioContent:'paused response',encoding:'mp3'}));
await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(plays,beforePause);assert.equal(tts.getCurrentTTSState().isPaused,true);
tts.resumeTTS();await loading;assert.equal(plays,beforePause+1);
const idle=tts.getCurrentTTSState();tts.resumeTTS();assert.equal(tts.getCurrentTTSState(),idle);
globalThis.fetch=realFetch;
// Retired sequence tokens cannot resurrect after a manual stop.
await tts.playTTS('이전 세션 문장','Aoede',true,undefined,'retired-test',true);
tts.stopTTS();const retiredCount=plays;
await tts.playTTS('늦게 도착한 이전 세션 문장','Aoede',true,undefined,'retired-test',false);
assert.equal(plays,retiredCount);
// Auto narration must not steal an active manual reader, including pause state.
const originalAudio=globalThis.__ttsTest.audio;let finishManual;
globalThis.__ttsTest.audio=async()=>{plays++;await new Promise(resolve=>{finishManual=resolve;});};
const manual=tts.playTTS('수동으로 듣는 문장','Aoede',true);
await new Promise((resolve, reject) => {
  const started = Date.now();
  const tick = () => {
    if (typeof finishManual === 'function') return resolve();
    if (Date.now() - started > 5000) return reject(new Error('manual playback did not start'));
    setTimeout(tick, 20);
  };
  tick();
});
const activeSession=tts.getCurrentTTSState().activeSessionId;
await tts.playTTSInChunks('자동으로 끼어들면 안 되는 문장','Aoede',240,undefined,undefined,{isAutoPlay:true});
assert.equal(tts.getCurrentTTSState().activeSessionId,activeSession);
finishManual();await manual;globalThis.__ttsTest.audio=originalAudio;
// Missing configuration is permanent until configured, not a retryable outage.
let configRequests=0;
globalThis.fetch=async()=>{configRequests++;return Response.json({error:'AI 음성 API 키가 설정되지 않았습니다.',code:'TTS_NOT_CONFIGURED'},{status:503});};
await assert.rejects(tts.playTTS('키 설정 오류를 정확히 안내합니다','Aoede',true),e=>e.code==='TTS_NOT_CONFIGURED');
assert.equal(configRequests,1);assert.equal(tts.getCurrentTTSState().activeSessionId,null);
globalThis.fetch=realFetch;
console.log('Playback state: pause during loading, idle resume, retired sessions, auto/manual ownership and missing-key errors passed.');

// A corrupt cached audio payload is evicted, so a second tap requests fresh data.
const audioBeforeCorrupt=globalThis.__ttsTest.audio;let brokenOnce=true;
globalThis.__ttsTest.audio=async text=>{if(brokenOnce){brokenOnce=false;throw Error('decode failed');}await audioBeforeCorrupt(text);};
const corruptStart=calls.length;
await assert.rejects(tts.playTTS('손상된 오디오 캐시 재시도 문장','Aoede',true));
await tts.playTTS('손상된 오디오 캐시 재시도 문장','Aoede',true);
assert.equal(calls.length,corruptStart+2);globalThis.__ttsTest.audio=audioBeforeCorrupt;
// Bookmarks from a different chunk layout/voice must not skip text.
let segments=0;const normalAudio=globalThis.__ttsTest.audio;
globalThis.__ttsTest.audio=async text=>{await normalAudio(text);if(++segments===2)tts.stopTTS();};
await tts.playTTSInChunks(long,'Aoede',240);
globalThis.__ttsTest.audio=normalAudio;const replayStart=spoken.length;
await tts.playTTSInChunks(long,'Charon',480);
assert.equal(spoken.slice(replayStart).join(' ').replace(/[^가-힣a-zA-Z0-9]/g,''),tts.normalizeTextForSpeech(long).replace(/[^가-힣a-zA-Z0-9]/g,''));
console.log('Cache eviction and chunk/voice-specific resume bookmarks passed.');

// One completion bowl per successful non-chat reading; never on chat, stop or error.
const chimeBefore=globalThis.__ttsTest.chimes||0;
await tts.playTTSInChunks('대화가 아닌 긴 결과를 끝까지 듣습니다. '.repeat(15),'Aoede',240);
assert.equal(globalThis.__ttsTest.chimes,chimeBefore+1);
await tts.playConversation([{role:'assistant',content:'대화에서는 완료 알림을 울리지 않습니다.'}]);
assert.equal(globalThis.__ttsTest.chimes,chimeBefore+1);
await tts.playTTS('대화 말풍선 읽기는 완료 알림을 제외합니다.','Aoede',true,undefined,undefined,false,undefined,undefined,undefined,{skipCompletionChime:true});
assert.equal(globalThis.__ttsTest.chimes,chimeBefore+1);
cancelOnPlay=true;await tts.playTTSInChunks('사용자가 중지하면 완료 알림을 내지 않습니다. '.repeat(15),'Aoede',240);cancelOnPlay=false;
assert.equal(globalThis.__ttsTest.chimes,chimeBefore+1);
globalThis.fetch=async()=>Response.json({error:'API 키 미설정',code:'TTS_NOT_CONFIGURED'},{status:503});
await assert.rejects(tts.playTTSInChunks('실패한 낭독에 완료 알림을 내지 않습니다.','Aoede',240));
assert.equal(globalThis.__ttsTest.chimes,chimeBefore+1);globalThis.fetch=realFetch;
console.log('Completion cue: one per completed reading, excluded from conversation, cancelled and failed playback.');
