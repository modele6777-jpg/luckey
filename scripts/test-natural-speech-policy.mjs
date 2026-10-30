import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
const bundle=await build({entryPoints:['server/api-lib/ttsHandler.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {handleTTS}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const keys=['OPENAI_API_KEY','open ai','openai','gemini','GEMINI_API_KEY','GOOGLE_GENAI_API_KEY','AI_API_KEY','AI_PROVIDER'];
const previous=new Map(keys.map(key=>[key,process.env[key]]));const realFetch=globalThis.fetch;let calls=0;
try {
 for(const key of keys)delete process.env[key];
 globalThis.fetch=async()=>{calls++;throw Error('No fallback provider may be called');};
 await assert.rejects(handleTTS({text:'자연 음성만 사용합니다'}),e=>e.status===503 && e.code==='TTS_NOT_CONFIGURED');assert.equal(calls,0);
 process.env.OPENAI_API_KEY='fake-test-key';
 globalThis.fetch=async(url,options)=>{calls++;assert(String(url).startsWith('https://api.openai.com/v1/audio/speech'));const body=JSON.parse(options.body);assert.equal(body.voice,'marin');assert.equal(body.model,'gpt-4o-mini-tts');return new Response(new Uint8Array([73,68,51,1]));};
 assert.equal((await handleTTS({text:'여성 자연 음성'})).encoding,'mp3');
 globalThis.fetch=async()=>{calls++;return Response.json({error:{code:'insufficient_quota'}},{status:429});};
 const before=calls;await assert.rejects(handleTTS({text:'실패해도 다른 음성으로 바꾸지 않습니다'}),e=>e.status===429 && e.code==='MEDIA_QUOTA_EXHAUSTED');assert.equal(calls,before+1);
} finally {globalThis.fetch=realFetch;for(const [key,value] of previous)value===undefined?delete process.env[key]:process.env[key]=value;}
for(const file of ['public/calm/app.js','server/api-lib/ttsHandler.ts','server/calmRouter.ts']){
 const source=fs.readFileSync(file,'utf8');assert(!/speechSynthesis\.speak\s*\(|new\s+SpeechSynthesisUtterance|translate_tts|google-tts-api|node-edge-tts|fallback:\s*true/.test(source),file);
}
console.log('Natural speech only: no device/translation fallback on missing keys or quota errors; generative provider path verified.');
