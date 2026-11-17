/** Native-only origin mapping. Never rewrite third-party URLs or local app assets. */
export function nativeApiUrl(input: string, localOrigin: string, apiOrigin: string): string {
  const url = new URL(input, localOrigin);
  const local = new URL(localOrigin);
  if (url.protocol !== local.protocol || url.host !== local.host || !/^\/(?:api(?:\/|$)|openai\/v1\/)/.test(url.pathname)) return input;
  const remote = new URL(apiOrigin);
  if (remote.protocol !== 'https:' || remote.username || remote.password || remote.pathname !== '/' || remote.search || remote.hash) {
    throw new Error('Native API origin must be an HTTPS origin without a path or credentials.');
  }
  return new URL(url.pathname + url.search + url.hash, remote).href;
}
