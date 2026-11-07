/** Reattach terminal listeners and fetch a fresh server snapshot on resume. */
export function recoveringSubscription<T>(options:{
  watch:(next:(value:T)=>void,error:(error:unknown)=>void)=>()=>void;
  load:()=>Promise<T>; receive:(value:T)=>void; isServer?:(value:T)=>boolean;
  visible?:()=>boolean; events?:Window; document?:Document;
  intervalMs?:number; staleMs?:number; loadTimeoutMs?:number; retryMs?:number;
}){
  let stopped=false,loading=false,lastServer=0,retries=0;
  let unsubscribe:(()=>void)|undefined,retry:ReturnType<typeof setTimeout>|undefined;
  let generation=0,serverUpdates=0;
  const visible=()=>!options.visible||options.visible();
  const receive=(value:T)=>{if(stopped)return;if(!options.isServer||options.isServer(value)){lastServer=Date.now();retries=0;}options.receive(value);};
  const attach=()=>{
    if(stopped||!visible())return;
    if(retry){clearTimeout(retry);retry=undefined;}
    unsubscribe?.();const active=++generation;
    const failed=()=>{
      if(stopped||active!==generation)return;
      if(retry)clearTimeout(retry);
      retry=setTimeout(()=>{attach();void refresh();},Math.min(30000,(options.retryMs??1000)*2**Math.min(retries++,5)));
    };
    try{
      unsubscribe=options.watch(value=>{
        if(active!==generation)return;
        if(!options.isServer||options.isServer(value))serverUpdates++;
        receive(value);
      },failed);
    }catch{failed();}
  };
  const refresh=async()=>{
    if(stopped||loading||!visible())return;
    loading=true;let timer:ReturnType<typeof setTimeout>|undefined;
    const updatesAtStart=serverUpdates;
    try{
      const value=await Promise.race([options.load(),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(Error('Sync read timeout')),options.loadTimeoutMs??6000);})]);
      if(updatesAtStart===serverUpdates)receive(value);
    }catch{ /* Local data stays intact; the next wake or watchdog retries. */ }
    finally{if(timer)clearTimeout(timer);loading=false;}
  };
  const wake=()=>{if(visible()){attach();void refresh();}};
  attach();void refresh();
  const interval=setInterval(()=>{
    if(visible()&&Date.now()-lastServer>=(options.staleMs??30000)){attach();void refresh();}
  },options.intervalMs??15000);
  options.events?.addEventListener('online',wake);
  options.events?.addEventListener('focus',wake);
  options.events?.addEventListener('pageshow',wake);
  options.document?.addEventListener('visibilitychange',wake);
  return ()=>{
    stopped=true;generation++;unsubscribe?.();clearInterval(interval);if(retry)clearTimeout(retry);
    options.events?.removeEventListener('online',wake);options.events?.removeEventListener('focus',wake);options.events?.removeEventListener('pageshow',wake);options.document?.removeEventListener('visibilitychange',wake);
  };
}
