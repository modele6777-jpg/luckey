import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { transform, build } from 'esbuild';
// Run the actual buffer lifecycle with a controllable audio clock and nodes.
const audio = fs.readFileSync('src/lib/audio.ts', 'utf8');
const launch = audio.slice(audio.indexOf('function launchWebAudioTTSSource'), audio.indexOf('/** Position in the decoded buffer'));
const compiled = await transform(launch, {loader: 'ts'});
function harness() {
  const nodes = [], clock = {currentTime: 0, state: 'running', resume: async () => {}, createBufferSource: () => { const n = {playbackRate: {}, connect() {}, start(_when, offset) {this.offset = offset;}}; nodes.push(n); return n; }};
  const state = {clock, nodes, resolved: 0, rejected: 0, ttsActiveBuffer: {duration: 10}, ttsPlaybackId: 1, ttsActiveSource: null, ttsPausedOffsetSec: 0, ttsActiveRate: 1, ttsStartedAtCtxTime: 0, ttsStoppingForPause: false, ttsUserExplicitlyPaused: false, ttsEarlyEndRetries: 0, ttsShouldBePlaying: true, ttsSafetyTimer: null, activeTTSSources: new Set(), getSharedAudioContext: () => clock, getTTSVoiceBus: () => ({}), clearTTSSafetyTimer() {}, stopActiveWebAudioTTSSource() {state.ttsActiveSource = null;}, stopAndDisconnectTTSSourceNode() {}, stopTTSKeepAlive() {}, releaseScreenWakeLock: async () => {}, setTimeout: () => 1};
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
const race = {window:{}, ttsPlaybackId:1, configureSpeechAudioSession() {}, getSharedAudioContext:()=>ctx, setTimeout, clearTimeout};
vm.createContext(race);vm.runInContext(entryJS.code, race);
await race.playTTSAudio('unused');
assert.equal(race.ttsPlaybackId, 2);
console.log('A stop during asynchronous context resume cancels the pending playback.');

// Bundle the actual readers with audio/network stand-ins; exercise long messages,
// request retries, failure propagation, and explicit cancellation without API costs.
const calls = [], events = [], spoken = []; let failures = 0, plays = 0, cancelOnPlay = false;
globalThis.__ttsTest = {calls, audio: async text => {spoken.push(text);plays++; if(cancelOnPlay) tts.stopTTS();}};
globalThis.window = {dispatchEvent: e => {events.push(e); return true;}};
const stubAudio = `export const getSharedAudioContext=()=>({state:'running'}); export const playTTSAudio=async(text)=>globalThis.__ttsTest.audio(text); export const getTTSPlaybackProgress=()=>null;\n` + ['unlockAudioPlayback','playCompressedAudio','playRawPCM','primeTTSAudioElement','pauseTTSAudio','resumeTTSAudio','stopTTSPlayback','initTTSAudioLifecycle','analyzeTextEmotion','duckAmbientAudio','configureSpeechAudioSession','configureAmbientAudioSession'].map(n=>`export const ${n}=()=>{};`).join('\n');
const bundle = await build({entryPoints:['src/utils/tts.ts'],bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'stubs',setup(b){b.onResolve({filter:/^(react|.*\/(audio|audioHaptics|ttsMediaSession|wakeLock|perfMode))$/},a=>({path:a.path,namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},a=>({contents:a.path.endsWith('/audio')?stubAudio:a.path==='react'?'export const useState=()=>{};export const useEffect=()=>{};':a.path.endsWith('/ttsMediaSession')?['setTTSSessionActive','clearTTSSession','initTTSSessionHandlers','pauseTTSSession','resumeTTSSession'].map(n=>`export const ${n}=()=>{};`).join('\n'):a.path.endsWith('/wakeLock')?'export const acquireScreenWakeLock=async()=>{};export const releaseScreenWakeLock=async()=>{};':a.path.endsWith('/perfMode')?'export const isIOSDevice=()=>false;':'export const playAiResultNotification=()=>{};'}));}}]});
const tts = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
globalThis.fetch = async (_url, options) => {const text = JSON.parse(options.body).text;calls.push(text);if(failures-->0)return new Response('{}',{status:503});return Response.json({audioContent:text,encoding:'mp3'});};
const long = '긴 문장을 빠짐없이 끝까지 읽습니다 '.repeat(45).trim();
await tts.playConversation([{role:'assistant',content:long}]);
assert(calls.length>1);assert(calls.every(t=>t.length<=240));assert.equal(spoken.join(' ').replace(/[^가-힣a-zA-Z0-9]/g,''), tts.normalizeTextForSpeech(long).replace(/[^가-힣a-zA-Z0-9]/g,''));
const before = plays;failures=1;await tts.playTTS('일시 연결 실패 재시도 확인 문장입니다', 'Aoede', true);assert.equal(plays,before+1);
failures=2;const count=plays;await tts.playQAndATTS({text:''},{text:'실패를 조용히 넘기지 않습니다. 다음 문장은 읽지 않아야 합니다.'});assert.equal(plays,count);assert(events.some(e=>e.type==='prism:tts-error'));
failures=0;cancelOnPlay=true;const start=plays;await tts.playConversation([{role:'assistant',content:long}]);assert.equal(plays,start+1);
console.log('Readers: complete long text, bounded chunks, transient retry, visible failure, explicit stop.');
