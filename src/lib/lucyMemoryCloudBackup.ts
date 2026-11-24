import { Bytes, doc, runTransaction, writeBatch, type Firestore } from 'firebase/firestore';

const PART_BYTES = 512 * 1024;
const MAX_PARTS = 14;
const DOCUMENT = 'lucy_memory_backup_v1';

function manifestRef(db: Firestore, uid: string) {
  return doc(db, 'soul_mirror', uid, 'dapps', DOCUMENT);
}

function partRef(db: Firestore, uid: string, index: number) {
  return doc(db, 'soul_mirror', uid, 'dapps', `${DOCUMENT}_${index}`);
}

async function digest(bytes: Uint8Array) {
  const hash = await crypto.subtle.digest('SHA-256', new Uint8Array(bytes));
  return Array.from(new Uint8Array(hash), value => value.toString(16).padStart(2, '0')).join('');
}

export async function writeLucyCloudBackup(db: Firestore, uid: string, backup: string) {
  const bytes = new TextEncoder().encode(backup);
  const count = Math.ceil(bytes.length / PART_BYTES);
  if (!count || count > MAX_PARTS) throw new Error('계정 백업 한도를 넘었어요. 기억 파일 백업을 이용해 주세요.');

  const hash = await digest(bytes);
  const batch = writeBatch(db);
  for (let index = 0; index < MAX_PARTS; index++) {
    const ref = partRef(db, uid, index);
    if (index < count) {
      batch.set(ref, { hash, data: Bytes.fromUint8Array(bytes.subarray(index * PART_BYTES, (index + 1) * PART_BYTES)) });
    } else {
      batch.delete(ref);
    }
  }
  batch.set(manifestRef(db, uid), { count, hash });
  await batch.commit();
}

export async function readLucyCloudBackup(db: Firestore, uid: string) {
  const backup = await runTransaction(db, async transaction => {
    const manifest = (await transaction.get(manifestRef(db, uid))).data();
    if (!manifest) return null;
    const { count, hash } = manifest;
    if (!Number.isInteger(count) || count < 1 || count > MAX_PARTS || typeof hash !== 'string') throw new Error('계정 백업 정보가 올바르지 않습니다.');

    const snapshots = await Promise.all(Array.from({ length: count }, (_, index) => transaction.get(partRef(db, uid, index))));
    const parts = snapshots.map(snapshot => {
      const part = snapshot.data();
      if (part?.hash !== hash || !(part?.data instanceof Bytes)) throw new Error('계정 백업 일부를 읽지 못했습니다.');
      return part.data.toUint8Array();
    });
    const bytes = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
    let offset = 0;
    for (const part of parts) {
      bytes.set(part, offset);
      offset += part.length;
    }
    return { bytes, hash };
  });
  if (!backup) return null;
  if (await digest(backup.bytes) !== backup.hash) throw new Error('계정 백업 내용이 손상됐어요.');
  return new TextDecoder('utf-8', { fatal: true }).decode(backup.bytes);
}

export async function deleteLucyCloudBackup(db: Firestore, uid: string) {
  const batch = writeBatch(db);
  batch.delete(manifestRef(db, uid));
  for (let index = 0; index < MAX_PARTS; index++) batch.delete(partRef(db, uid, index));
  await batch.commit();
}
