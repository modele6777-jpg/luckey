import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');

test('Orb offers a direct microphone permission request from a user tap', () => {
  assert.match(source, /onClick=\{\(\) => void requestMicPermission\(\)\}/);
  assert.match(source, /requestLucyMicrophone\(/);
  assert.match(source, /마이크 권한이 허용됐어요/);
});

test('Orb keeps the permission-granted microphone stream muted and reuses it for the session', () => {
  assert.match(source, /requestLucyMicrophone\(\{ audio: true \}\)/);
  assert.match(source, /stream\.getAudioTracks\(\)\.forEach\(track => \{ track\.enabled = false; \}\)/);
  assert.match(source, /micPrime\.current = Promise\.resolve\(stream\)/);
  assert.match(source, /if \(!micPrime\.current\) micPrime\.current = requestMic\(\)/);
  assert.match(source, /disabled=\{micPermissionBusy \|\| rolling\} onClick=\{\(\) => begin\(ORB_MASTERS\[0\]\)\}/);
  const permissionHandler = source.slice(source.indexOf('const requestMicPermission'), source.indexOf('const begin'));
  assert.doesNotMatch(permissionHandler, /track\.stop\(\)/);
  assert.match(source, /pending\?\.then\(stream => stream\.getTracks\(\)\.forEach\(track => track\.stop\(\)\)/);
});

test('Orb explains denied microphone permission and can reconnect during the live session', () => {
  assert.match(source, /브라우저 주소창의 사이트 설정에서 마이크를 허용/);
  assert.match(source, /onNotice: \(message\) => \{\s*setNotice\(message\);\s*setMicUnavailable\(true\);\s*\}/);
  assert.match(source, /onClick=\{\(\) => void retryLiveMic\(\)\}/);
  assert.match(source, /begin\(master, Promise\.resolve\(stream\), false\)/);
  assert.match(source, /마이크 다시 연결/);
});

test('Orb distinguishes an installed home-screen app microphone state error from a permission denial', () => {
  assert.match(source, /오류 코드: \$\{name\}/);
  assert.match(source, /name === 'InvalidStateError'/);
  assert.match(source, /권한 거부는 아니므로 설정을 다시 확인할 필요는 없습니다/);
  assert.doesNotMatch(source, /Safari에서 사이트를 직접 열었는지 확인/);
});
