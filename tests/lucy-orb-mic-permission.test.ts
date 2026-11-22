import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');

test('Orb offers a direct microphone permission request from a user tap', () => {
  assert.match(source, /onClick=\{\(\) => void requestMicPermission\(\)\}/);
  assert.match(source, /navigator\.mediaDevices\.getUserMedia/);
  assert.match(source, /stream\.getTracks\(\)\.forEach\(track => track\.stop\(\)\)/);
  assert.match(source, /마이크 권한이 허용됐어요/);
});

test('Orb explains denied microphone permission and can reconnect during the live session', () => {
  assert.match(source, /브라우저 주소창의 사이트 설정에서 마이크를 허용/);
  assert.match(source, /onNotice: \(message\) => \{\s*setNotice\(message\);\s*setMicUnavailable\(true\);\s*\}/);
  assert.match(source, /onClick=\{\(\) => void retryLiveMic\(\)\}/);
  assert.match(source, /begin\(master, Promise\.resolve\(stream\), false\)/);
  assert.match(source, /마이크 다시 연결/);
});

test('Orb shows the microphone error code and checks the app context when Safari permission may already be enabled', () => {
  assert.match(source, /오류 코드: \$\{name\}/);
  assert.match(source, /Safari에서 사이트를 직접 열었는지 확인/);
  assert.match(source, /홈 화면 웹 앱이나 앱 내 브라우저/);
});
