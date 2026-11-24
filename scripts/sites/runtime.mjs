export function createSitesWorker({ assets, firebaseAuthOrigin, sitesSyncApi, sitesNativeApi }) {
 return {
 async fetch(request, env) {
  const url = new URL(request.url);
  // Firebase sign-in on the app's own origin (iOS home-screen apps block the
  // cross-site handler). Forward /__/auth and /__/firebase to Firebase Hosting.
  if (url.pathname.startsWith('/__/auth/') || url.pathname.startsWith('/__/firebase/')) {
   const upstream = new URL(url.pathname + url.search, firebaseAuthOrigin);
   const headers = new Headers(request.headers);
   for (const name of ['host','cookie','oai-sites-authorization','cf-access-jwt-assertion']) headers.delete(name);
   return fetch(upstream, {method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:request.body,redirect:'manual'});
  }
  const synced = await sitesSyncApi.handleSitesSync(request, env);
  if (synced) return synced;
  const chat = await sitesNativeApi.handleSitesGeminiChat(request, env);
  if (chat) return chat;
  const nativeApi = await sitesNativeApi.handleSitesApi(request, env);
  if (nativeApi) return nativeApi;
  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
   if (!env.LUCKEY_API_ORIGIN) return Response.json({error:'AI 서버 연결이 아직 설정되지 않았습니다.'}, {status:503});
   const upstream = new URL(env.LUCKEY_API_ORIGIN);
   if (upstream.protocol !== 'https:' || upstream.origin === url.origin) return Response.json({error:'서버 주소 설정을 확인해주세요.'},{status:503});
   upstream.pathname = url.pathname; upstream.search = url.search;
   const headers = new Headers(request.headers);
   for (const name of ['host','cookie','oai-sites-authorization','cf-access-jwt-assertion']) headers.delete(name);
   return fetch(upstream, {method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:request.body,redirect:'manual'});
  }
  if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  let key = url.pathname;
  if (/^\/(chat|lucy)(\/|$)/.test(key)) key='/chat.html';
  else if (/^\/handbook(\/|$)/.test(key)) key='/handbook.html';
  else if (!assets[key] && !key.split('/').pop().includes('.')) key='/index.html';
  const asset=assets[key];
  if (!asset) return new Response('Not found',{status:404});
  const bytes=Uint8Array.from(atob(asset[1]),c=>c.charCodeAt(0));
  return new Response(request.method==='HEAD'?null:new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')), {headers:{'Content-Type':asset[0],'Cache-Control':key.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache','X-Content-Type-Options':'nosniff'}});
 }
};
}
