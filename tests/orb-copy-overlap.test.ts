import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ORB_COPY_OVERLAP, resolveOrbCopyBottom, resolveOrbLiveRoom } from '../src/lib/orb/orbCopyBounds.ts';

const component = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/components/lucy/lucy-orb-counsel.css', import.meta.url), 'utf8');

// 2026-11-27 실측값: 라이브 luckey(v1.8.573)를 아이폰 접힌 화면 크기로 열어 재었다.
// 오브 화면 383x678(사용자 스크린샷과 같은 크기)에서 빅뱅 버튼은 위 478px, 입력창은 위 554px 지점.
const FOLDED = { stageHeight: 678, bigbangTop: 478, dockTop: 554, paddingTop: 60 };

test('상담 중 글 영역은 빅뱅 버튼 위에서 잘리지 않고 그 위로 겹쳐 내려간다', () => {
  const clear = FOLDED.stageHeight - FOLDED.bigbangTop + 6;       // 206 — 빅뱅 버튼을 완전히 비켜 간 높이
  const dockClear = FOLDED.stageHeight - FOLDED.dockTop + 6;      // 130 — 입력창 위 여백
  const bottom = resolveOrbCopyBottom({ clear, dockClear });
  assert.equal(bottom, clear - ORB_COPY_OVERLAP, '빅뱅 버튼 위로는 정해진 만큼만 겹친다');
  assert.ok(bottom < clear, '예전(--orb-bok-bottom)처럼 빅뱅 버튼을 완전히 비켜 가지 않는다 = 겹칠 수 있다');
  assert.ok(bottom >= dockClear, '입력창(도크) 위로는 내려가지 않는다');
});

test('겹침은 카드·질문 칩 한 줄을 살릴 만큼이고, 오브 가운데를 덮지는 않는다', () => {
  // 잘리던 높이: 실측에서 글 영역 내용 83px - 보이던 44px = 39px, 칩 한 줄은 37px.
  assert.ok(ORB_COPY_OVERLAP >= 40, '접힌 화면에서 잘리던 만큼(칩 한 줄)은 겹쳐서 보여 준다');
  assert.ok(ORB_COPY_OVERLAP <= 84, '빅뱅 버튼 한 개(84px)보다 크게 겹쳐 오브 가운데를 덮지 않는다');
});

test('좁은 화면에서도 글 영역은 입력창 위에서 멈춘다', () => {
  // 260x760 실측: 빅뱅 위 560, 입력창 위 646.
  const clear = 760 - 560 + 6;   // 206
  const dockClear = 760 - 646 + 6; // 120
  const bottom = resolveOrbCopyBottom({ clear, dockClear });
  assert.equal(bottom, 134);
  assert.ok(bottom >= dockClear);
  // 빅뱅 버튼이 아예 없으면 입력창 위에서 끝난다.
  assert.equal(resolveOrbCopyBottom({ clear: dockClear + 10, dockClear }), dockClear);
  // 값이 없어도 터지지 않는다.
  assert.equal(resolveOrbCopyBottom({ clear: Number.NaN, dockClear: Number.NaN }), 0);
});

test('수정구슬(탁자)은 예전과 같은 방식으로 남은 공간에 맞춘다', () => {
  assert.equal(resolveOrbLiveRoom({ stageHeight: 760, clear: 206, paddingTop: 60, copyHeight: 315 }), 163);
  assert.equal(resolveOrbLiveRoom({ stageHeight: 400, clear: 206, paddingTop: 60, copyHeight: 300 }), 110, '너무 작아지지 않게 110px 바닥');
});

test('컴포넌트는 새 계산을 쓰고, CSS는 상담 중에만 --orb-copy-bottom을 쓴다', () => {
  assert.match(component, /import \{ resolveOrbCopyBottom, resolveOrbLiveRoom \} from '@\/lib\/orb\/orbCopyBounds';/);
  assert.match(component, /stage\.style\.setProperty\('--orb-copy-bottom', `\$\{resolveOrbCopyBottom\(\{ clear, dockClear \}\)\}px`\);/);
  assert.match(component, /resolveOrbLiveRoom\(\{ stageHeight: box\.height, clear, paddingTop: top, copyHeight: copy\.scrollHeight \}\)/);
  // 상담 중 글 영역은 빅뱅 버튼을 완전히 비켜 간 높이가 아니라 겹침을 허용한 높이에서 끝난다.
  assert.match(styles, /\.lucy-orb-stage\.is-live \.lucy-orb-copy \{[^}]*margin-bottom:\s*var\(--orb-copy-bottom, var\(--orb-bok-bottom, 0px\)\)/);
  // 보고서·부적·카드 고르기 창은 예전처럼 빅뱅 버튼을 완전히 비켜 간다.
  assert.match(styles, /\.lucy-bok \{[^}]*bottom:\s*var\(--orb-bok-bottom/);
  assert.match(styles, /padding-bottom:\s*var\(--orb-bok-bottom, 14px\)/);
  assert.match(styles, /\.lucy-cardpick-layer \{[^}]*inset:\s*56px 0 var\(--orb-dock-clear, 0px\)/);
});
