import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requestLucyAction } from '../src/lib/duoLucyActionRouting';

test('Lucy actions preserve unfolded content, but navigate and queue a folded question', () => {
  const descriptors = new Map(['window','document','sessionStorage','CustomEvent'].map(key => [key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  const events: {type:string; detail:unknown}[] = [];
  const stored = new Map<string,string>();
  let unfolded = true;
  try {
    Object.defineProperty(globalThis,'window',{configurable:true,value:{dispatchEvent:(event:any)=>events.push(event)}});
    Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>unfolded ? {} : null}});
    Object.defineProperty(globalThis,'sessionStorage',{configurable:true,value:{setItem:(key:string,value:string)=>stored.set(key,value)}});
    Object.defineProperty(globalThis,'CustomEvent',{configurable:true,value:class { constructor(public type:string, public options:any){} get detail(){return this.options.detail;} }});
    requestLucyAction({prompt:'질문',channel:'master'});
    assert.deepEqual(events.map(event=>event.type),['lucy-inject-message']);
    assert.equal(stored.size,0);
    events.length=0;
    unfolded=false;
    requestLucyAction({prompt:'접힌 화면 질문',channel:'master'});
    assert.equal(stored.get('lucy_injected_auto_send'),'접힌 화면 질문');
    assert.deepEqual(events.map(event=>({type:event.type,detail:event.detail})),[{type:'prism-navigate',detail:{path:'/chat'}}]);
  } finally {
    for (const [key,descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis,key,descriptor);
      else Reflect.deleteProperty(globalThis,key);
    }
  }
});
