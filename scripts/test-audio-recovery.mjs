import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { build, transform } from 'esbuild';
const bundle = await build({entryPoints:['src/lib/audioRecovery.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {recoverSpeechContext} = await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
let replacements=0;
const running={state:'running',async resume(){}};
assert.equal(await recoverSpeechContext(()=>running,()=>{replacements++;return running},()=>true),running);
assert.equal(replacements,0);
const broken={state:'interrupted',async resume(){}};
assert.equal(await recoverSpeechContext(()=>broken,()=>{replacements++;return running},()=>true),running);
assert.equal(replacements,1);
let current=true;
const cancelled={state:'suspended',async resume(){current=false;}};
assert.equal(await recoverSpeechContext(()=>cancelled,()=>{throw Error('cancel must not rebuild')},()=>current),null);
await assert.rejects(recoverSpeechContext(()=>broken,()=>broken,()=>true),e=>e.code==='TTS_CONTEXT_STALLED');
// A resume promise that never settles is bounded and replaced.
const set=globalThis.setTimeout,clear=globalThis.clearTimeout;
let expire;
globalThis.setTimeout=fn=>{expire=fn;return 1;};globalThis.clearTimeout=()=>{};
try {
 const pending=recoverSpeechContext(()=>({state:'suspended',resume:()=>new Promise(()=>{})}),()=>running,()=>true);
 expire();assert.equal(await pending,running);
} finally {globalThis.setTimeout=set;globalThis.clearTimeout=clear;}
// Real decoder: a hung browser callback gets rejected and late callbacks ignored.
const audio=fs.readFileSync('src/lib/audio.ts','utf8');
const decoder=audio.slice(audio.indexOf('export async function safeDecodeAudioData'),audio.indexOf('/**\n * Utility to play base64 compressed audio'));
const js=await transform(decoder.replace('export async function','async function'),{loader:'ts'});
let timeout,success;
const scope={speechContextNeedsReset:false,setTimeout:fn=>{timeout=fn;return 1},clearTimeout(){}};
vm.createContext(scope);vm.runInContext(js.code,scope);
const pending=scope.safeDecodeAudioData({decodeAudioData(_bytes,ok){success=ok;}},new ArrayBuffer(1));
const rejected=assert.rejects(pending,e=>e.code==='TTS_DECODE_TIMEOUT');timeout();await rejected;
assert.equal(scope.speechContextNeedsReset,true);success({duration:10});
console.log('Recovery: running/interrupted/hung contexts, cancellation, bounded failure and decode timeout passed.');
// The production TTS entrypoint delegates to the same media element whose pause/resume
// and interruption behavior is covered by test-speech-media.mjs.
const entry=audio.slice(audio.indexOf('export async function playTTSAudio'),audio.indexOf('let ttsLifecycleInitialized'));
const entryJS=await transform(entry.replace('export async function','async function'),{loader:'ts'});
let mediaArgs,finishMedia,speechConfigured=0,ambientConfigured=0;
const clock={state:'running'};
const player={window:{},ttsPlaybackId:1,ttsUserExplicitlyPaused:false,speechSessionActive:false,ttsShouldBePlaying:false,
 configureSpeechAudioSession(){speechConfigured++;},configureAmbientAudioSession(){ambientConfigured++;},getSharedAudioContext:()=>clock,
 stopRawPCM(){},stopActiveWebAudioTTSSource(){},releaseScreenWakeLock:async()=>{},base64ToBytes:()=>new Uint8Array([73,68,51,0]),detectAudioFormat:()=> 'mp3',
 playSpeechMedia:(bytes,format,sampleRate,onPlaying,isSequenceChunk)=>{mediaArgs={bytes,format,sampleRate,onPlaying,isSequenceChunk};return new Promise(resolve=>{finishMedia=resolve;})}};
vm.createContext(player);vm.runInContext(entryJS.code,player);
const playback=player.playTTSAudio('test');await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(speechConfigured,1);assert.equal(ambientConfigured,0);assert.equal(mediaArgs.format,'mp3');assert.equal(mediaArgs.sampleRate,24000);
finishMedia();await playback;assert.equal(ambientConfigured,1);assert.equal(player.ttsShouldBePlaying,false);assert.equal(player.speechSessionActive,false);
console.log('TTS entrypoint uses the shared speech-media player and restores ambient audio after completion.');
