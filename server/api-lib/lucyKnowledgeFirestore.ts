import firebaseConfig from '../../firebase-applet-config.json';

const PROJECT_ID = firebaseConfig.projectId;
const DATABASE_ID = firebaseConfig.firestoreDatabaseId || '(default)';
export const CONTROL_DOCUMENT = 'lucyKnowledgeSettings/control';

export function firestoreDocumentUrl(path: string): string {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(PROJECT_ID)}/databases/${encodeURIComponent(DATABASE_ID)}/documents/${path}`;
}
function fieldValue(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const record = value as Record<string, any>;
  if ('stringValue' in record) return record.stringValue;
  if ('integerValue' in record) return Number(record.integerValue);
  if ('doubleValue' in record) return Number(record.doubleValue);
  if ('booleanValue' in record) return record.booleanValue;
  if ('timestampValue' in record) return record.timestampValue;
  if ('nullValue' in record) return null;
  if ('arrayValue' in record) return (record.arrayValue.values ?? []).map(fieldValue);
  if ('mapValue' in record) return Object.fromEntries(Object.entries(record.mapValue.fields ?? {}).map(([key, item]) => [key, fieldValue(item)]));
  return undefined;
}
export function decodedFields(document: any): Record<string, any> {
  return Object.fromEntries(Object.entries(document?.fields ?? {}).map(([key, value]) => [key, fieldValue(value)]));
}
export function typedValue(value: unknown): unknown {
  if (value === null) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(typedValue) } };
  if (value && typeof value === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, typedValue(item)])) } };
  return { nullValue: null };
}
export async function firestoreGet(path: string, token: string): Promise<Record<string, any> | null> {
  const response = await fetch(firestoreDocumentUrl(path), { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(5000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore read failed (${response.status})`);
  return decodedFields(await response.json());
}
export async function firestorePatch(path: string, token: string, value: Record<string, unknown>, precondition: 'must_not_exist' | string): Promise<boolean> {
  const url = new URL(firestoreDocumentUrl(path));
  if (precondition === 'must_not_exist') url.searchParams.set('currentDocument.exists', 'false');
  else url.searchParams.set('currentDocument.updateTime', precondition);
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, typedValue(item)])) }),
    signal: AbortSignal.timeout(5000),
  });
  return response.ok;
}
