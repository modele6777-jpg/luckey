import type { SharedState } from './sharedState';

export async function readServerVaultPullResponse(
  uid: string,
  response: Response,
  etags: Map<string, string>,
): Promise<SharedState | null> {
  const responseETag = response.headers.get('ETag');
  if (response.status === 304) {
    if (responseETag) etags.set(uid, responseETag);
    return null;
  }
  if (!response.ok) return null;

  try {
    const json = await response.json();
    if (responseETag) etags.set(uid, responseETag);
    else etags.delete(uid);
    return json?.success && json?.data ? json.data as SharedState : null;
  } catch {
    return null;
  }
}

export async function readServerVaultPushResponse(
  uid: string,
  response: Response,
  etags: Map<string, string>,
): Promise<boolean> {
  if (!response.ok) return false;
  try {
    const json = await response.json();
    if (typeof json?.etag === 'string' && json.etag) etags.set(uid, json.etag);
    else etags.delete(uid);
  } catch {
    etags.delete(uid);
  }
  return true;
}
