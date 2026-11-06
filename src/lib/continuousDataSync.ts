/** Data synchronization is independent of version checks, UI activity and reloads. */
export function syncDataSignature(value:unknown):string {
  const normalize=(item:any,path:string[]=[]):any=>{
    if(item===null||typeof item!=='object')return item;
    if(Array.isArray(item))return item.map((entry,index)=>normalize(entry,[...path,String(index)]));
    const result:Record<string,unknown>={};
    for(const key of Object.keys(item).sort()){
      if(path.length===0&&['sourceApp','unifiedAppVersion','clientAppVersions'].includes(key))continue;
      if(['updatedAt','clientUpdatedAt','lastAppSyncAt','lastSavedAt','profileUpdatedAt','userGoalsUpdatedAt'].includes(key))continue;
      if(key==='timestamp'&&['dailyArts','trinityDailyLucky'].includes(path[0]))continue;
      result[key]=normalize(item[key],[...path,key]);
    }
    return result;
  };
  return JSON.stringify(normalize(value));
}

export function localSyncChangeToken(storage:Storage,uid:string):string {
  const values:string[]=[];
  for(let index=0;index<storage.length;index++){
    const key=storage.key(index);if(!key)continue;
    if(key.startsWith('firebase:')||/auth|unlock|version|bgm|volume|audio|tts|paired_vault/i.test(key))continue;
    if(key.startsWith('lucy_state_')&&key!==`lucy_state_${uid}`)continue;
    if(key.startsWith('lucy_long_term_memory_v1:')&&key!==`lucy_long_term_memory_v1:${encodeURIComponent(uid)}`)continue;
    if(key.startsWith('lucy_pro_history_v1:'))continue; // Pro has its own authenticated stream.
    values.push(JSON.stringify([key,storage.getItem(key)]));
  }
  return values.sort().join('\n');
}

export function createContinuousDataSync<T>(options:{
  read:()=>T; push:(value:T)=>Promise<void>; signature:(value:T)=>string;
  changeToken?:()=>string; visible?:()=>boolean; retryMs?:number;
}){
  let disposed=false,running=false,dirty=true,acknowledged='',token='';
  let nextRetry=0,retries=0;
  const scan=async(force=false)=>{
    if(disposed||(options.visible&&!options.visible()))return;
    const currentToken=options.changeToken?.();
    if(currentToken!==undefined&&currentToken!==token){token=currentToken;dirty=true;}
    if(!force&&!dirty)return;
    if(running||Date.now()<nextRetry)return;
    let value:T,signature:string;
    try{value=options.read();signature=options.signature(value);}catch{dirty=true;nextRetry=Date.now()+(options.retryMs??1000);return;}
    if(signature===acknowledged){dirty=false;return;}
    running=true;dirty=false;
    try{
      await options.push(value);
      if(disposed)return;
      acknowledged=signature;retries=0;nextRetry=0;
    }catch{
      dirty=true;retries++;
      nextRetry=Date.now()+Math.min(30000,(options.retryMs??1000)*2**Math.min(retries-1,5));
    }finally{running=false;}
  };
  return {
    scan,
    wake(){nextRetry=0;dirty=true;return scan(true);},
    dispose(){disposed=true;},
  };
}

/** Stamp actual changed activity content, never the act of collecting it. */
export function localActivityPatch<T extends Record<string,any>>(current:T,activities:Partial<T>,now=Date.now()):Partial<T> {
  const patch:Record<string,any>={};
  for(const [key,value] of Object.entries(activities)){
    if(syncDataSignature({[key]:value})===syncDataSignature({[key]:current[key]}))continue;
    if(key==='todayOracles'&&value&&typeof value==='object'){
      const dates:Record<string,any>={...(current[key]||{})};
      for(const [date,apps] of Object.entries(value)){
        if(!apps||typeof apps!=='object')continue;
        dates[date]={...(dates[date]||{})};
        for(const [app,oracle] of Object.entries(apps as object)){
          if(syncDataSignature(oracle)!==syncDataSignature(dates[date][app]))dates[date][app]={...(oracle as object),timestamp:now};
        }
      }
      patch[key]=dates;
    }else if(key==='latestDailyOracles'&&value&&typeof value==='object'){
      const apps:Record<string,any>={...(current[key]||{})};
      for(const [app,oracle] of Object.entries(value))if(syncDataSignature(oracle)!==syncDataSignature(apps[app]))apps[app]={...(oracle as object),timestamp:now};
      patch[key]=apps;
    }else if(key==='epilogueHistory'&&Array.isArray(value)){
      const existing=new Map((current[key]||[]).map((entry:any)=>[entry.dateKey||entry.id,entry]));
      patch[key]=value.map(entry=>syncDataSignature(entry)===syncDataSignature(existing.get(entry.dateKey||entry.id))?entry:{...entry,updatedAt:now});
    }else if(['dailyArts','trinityDailyLucky','dailySecrets'].includes(key)&&value&&typeof value==='object'){
      const days:Record<string,any>={...(current[key]||{})};
      for(const [day,entry] of Object.entries(value)){
        const previous=(current[key]||{})[day];
        if(syncDataSignature({[key]:{[day]:entry}})===syncDataSignature({[key]:{[day]:previous}}))continue;
        days[day]={...(entry as object),[key==='dailySecrets'?'updatedAt':'timestamp']:now};
      }
      patch[key]=days;
    }else if(key==='todoMissions')patch[key]={...(value as object),lastSavedAt:new Date(now).toISOString()};
    else patch[key]=value;
    if(key==='userGoals')patch.userGoalsUpdatedAt=now;
  }
  return patch as Partial<T>;
}
