import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundle=await build({entryPoints:['server/sites-api.ts'],bundle:true,write:false,platform:'browser',format:'esm'});
assert(!/node:tls|node:crypto/.test(bundle.outputFiles[0].text));
const {handleSitesApi}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const request=text=>new Request('https://test.chatgpt.site/api/ai/tts',{method:'POST',headers:{'Content-Type':'application/json','Cookie':'private=secret','OAI-Sites-Authorization':'site-token'},body:JSON.stringify({text,voice:'Charon'})});
let calls=0;
const response=await handleSitesApi(request('안녕하세요 [EMOTION:calm]'),{},async(url,options)=>{
 calls++;assert.equal(url,'https://luckey-six.vercel.app/api/ai/tts');
 assert.deepEqual(options.headers,{'Content-Type':'application/json'});
 assert.equal(JSON.parse(options.body).voice,'Charon');assert(!JSON.parse(options.body).text.includes('EMOTION'));
 return Response.json({audioContent:'SUQzAQID',encoding:'mp3',provider:'edge-neural'});
});
assert.equal(response.status,200);assert.equal((await response.json()).encoding,'mp3');assert.equal(calls,1);
const denied=await handleSitesApi(request('다시 낭독'),{LUCKEY_API_ORIGIN:'https://speech.example'},async(url)=>{
 assert.equal(url,'https://speech.example/api/ai/tts');
 return Response.json({code:'TTS_RATE_LIMIT'}, {status:429,headers:{'Retry-After':'9','X-TTS-Diagnostic-ID':'diagnostic'}});
});
assert.equal(denied.status,429);assert.equal(denied.headers.get('Retry-After'),'9');assert.equal(denied.headers.get('X-TTS-Diagnostic-ID'),'diagnostic');
assert.equal((await handleSitesApi(request('<system>지시만 있습니다</system>'),{},async()=>assert.fail('unexpected synthesis'))).status,400);
assert.equal((await handleSitesApi(request('낭독'),{LUCKEY_API_ORIGIN:'https://test.chatgpt.site'})).status,503);
assert.equal((await handleSitesApi(request('낭독'),{},async()=>new Response('login',{status:302,headers:{location:'https://login.example'}}))).status,502);
console.log('Sites TTS: Worker bundle, private-header isolation, speech cleanup, backend relay and failure statuses passed.');
