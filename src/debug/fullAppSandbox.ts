/** Only the separate full-app test entry imports this module. */
export const FULL_APP_TEST_HOST = 'luckey-fullapp-fold-test-nov17.thezeze.chatgpt.site';
export function allowsSandboxRequest(raw: string, method: string, origin: string): boolean {
  const url = new URL(raw, origin);
  return url.origin === origin && ['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())
    && !/^\/(api|trpc|sync)(\/|$)/.test(url.pathname);
}
export function installFullAppSandbox(win: Window): void {
  if (![FULL_APP_TEST_HOST, 'localhost', '127.0.0.1'].includes(win.location.hostname)) {
    throw new Error('Full-app test session is restricted to the isolated test origin.');
  }
  const originalFetch = win.fetch.bind(win);
  win.fetch = (input, init) => {
    const raw = input instanceof Request ? input.url : String(input);
    const method = init?.method || (input instanceof Request ? input.method : 'GET');
    if (!allowsSandboxRequest(raw, method, win.location.origin)) {
      return Promise.resolve(Response.json({ error: '화면 테스트에서는 서버 저장·AI 연결을 사용하지 않습니다.', code: 'LAYOUT_TEST_ONLY' }, { status: 503 }));
    }
    return originalFetch(input, init);
  };
  const xhr = (win as Window & { XMLHttpRequest: typeof XMLHttpRequest }).XMLHttpRequest.prototype;
  const open = xhr.open;
  xhr.open = function(method: string, url: string | URL, ...rest: any[]) {
    if (!allowsSandboxRequest(String(url), method, win.location.origin)) throw new DOMException('Server access is disabled in the isolated layout test.', 'NetworkError');
    return (open as (...args: any[]) => void).apply(this, [method, url, ...rest]);
  } as typeof xhr.open;
  win.localStorage.setItem('developer_bypass', 'true');
  win.sessionStorage.setItem('lu_unlocked', 'true');
  win.document.documentElement.dataset.fullAppTest = 'LUCKEY_ISOLATED_FULL_APP_TEST_v1';
}
