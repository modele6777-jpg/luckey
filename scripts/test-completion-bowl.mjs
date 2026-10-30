import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
const bundle=await build({entryPoints:['src/lib/completionBowl.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {renderCompletionBowl,COMPLETION_BOWL_DURATION,COMPLETION_BOWL_PEAK}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const previewIndex=process.argv.indexOf('--preview');
const previewPath=previewIndex>=0?process.argv[previewIndex+1]:null;
if(previewIndex>=0&&!previewPath)throw Error('Provide a WAV output path after --preview');
let previousRms;
for(const rate of [44100,48000]){
 const samples=renderCompletionBowl(rate);
 const rms=(start,end)=>Math.sqrt(samples.slice(Math.round(start*rate),Math.round(end*rate)).reduce((sum,value)=>sum+value*value,0)/Math.round((end-start)*rate));
 const peak=samples.reduce((max,value)=>Math.max(max,Math.abs(value)),0);
 assert.equal(samples.length,Math.ceil(rate*COMPLETION_BOWL_DURATION));assert(Math.abs(peak-COMPLETION_BOWL_PEAK)<.00001);
 assert(peak*1.5<1);assert(rms(0,.4)>.2);assert(rms(2.1,2.3)<.005);assert.equal(samples[0],0);assert(Math.abs(samples.at(-1))<.00001);
 if(previousRms)assert(Math.abs(previousRms-rms(0,.4))<.001);previousRms=rms(0,.4);
 if(previewPath && rate===48000){
  const bytes=Buffer.alloc(44+samples.length*2);bytes.write('RIFF',0);bytes.writeUInt32LE(bytes.length-8,4);bytes.write('WAVEfmt ',8);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(1,22);bytes.writeUInt32LE(rate,24);bytes.writeUInt32LE(rate*2,28);bytes.writeUInt16LE(2,32);bytes.writeUInt16LE(16,34);bytes.write('data',36);bytes.writeUInt32LE(samples.length*2,40);
  // Preview at the app's default effect-volume setting (65%).
  samples.forEach((sample,index)=>bytes.writeInt16LE(Math.round(sample*.65*32767),44+index*2));fs.writeFileSync(previewPath,bytes);
 }
}
console.log('Completion bowl: stable 44.1/48 kHz volume, audible body, bounded peak and click-free fade passed.');
