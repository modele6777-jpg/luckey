/**
 * 🧭 스마트 원클릭 가이드 + 빅뱅 버튼 홀드 = 오브페이지(/voice) 회귀 검사
 *
 * 사용자 지시(2026-11-27):
 *  - "빅뱅 버튼 홀드시 항상 오브페이지로 가게 해줘"
 *  - "어플이 복잡해서 뭘 해야 될지 어려울때 빅뱅 버튼을 한번 탭하면
 *     가장 추천되는 곳으로 가이드 해주는 스마트 원클릭 가이드 기능을 넣어줘"
 *
 * - 홀드: 어느 화면·모드에서든 /voice. 이미 /voice면 상담을 끊지 않고 그대로 둔다.
 * - 한 번 탭: 지금 이 사람에게 가장 쓸모 있는 한 곳으로 이동 + 스마트 가이드 배너.
 * - 더블 탭(Key)·상하좌우 방향 제스처는 그대로 둔다.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  SMART_GUIDE_STORAGE_KEY,
  SMART_GUIDE_MAX_HISTORY,
  SMART_GUIDE_STOPS,
  cleanGuidePath,
  guideDateKey,
  emptySmartGuideState,
  readSmartGuideState,
  recordSmartGuideVisit,
  recordSmartGuideRecommendation,
  hasSeenTodayTarot,
  resolveSmartBigBangGuide,
  type SmartGuideInput,
  type SmartGuideState,
} from '../src/lib/omniWarp/smartBigBangGuide';
import { isValidPrismPath } from '../src/lib/prismRouteRegistry';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const BIGBANG = read('src/components/omniwarp/BigBangButton.tsx');
const BANNER = read('src/components/guide/SmartGuideBanner.tsx');
const GUIDES = read('src/lib/pageGuides.ts');

const NOW = new Date('2026-11-27T18:44:08+09:00').getTime();
const TODAY = guideDateKey(NOW);

/** localStorage 대신 쓰는 작은 저장소 */
function memoryStorage(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  return {
    map,
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    setItem: (key: string, value: string) => { map.set(key, String(value)); },
    removeItem: (key: string) => { map.delete(key); },
  };
}

function input(overrides: Partial<SmartGuideInput> = {}): SmartGuideInput {
  return {
    cleanPath: '/lucky',
    isMasterMode: false,
    isOrbOpen: false,
    isLucyChat: false,
    profile: { hasBirthday: true, hasBirthTime: true },
    today: { tarotSeen: false, divinationSeen: false },
    state: emptySmartGuideState(NOW),
    now: NOW,
    ...overrides,
  };
}

test('paths and day keys normalize the way the button sees them', () => {
  assert.equal(cleanGuidePath('/chat?mode=ai'), '/chat');
  assert.equal(cleanGuidePath('/lucky#top'), '/lucky');
  assert.equal(cleanGuidePath('/'), '/');
  assert.equal(cleanGuidePath(''), '/');
  assert.equal(cleanGuidePath(undefined), '/');
  assert.equal(cleanGuidePath('/epilogue/'), '/epilogue');
  assert.equal(guideDateKey(NOW), TODAY);
  assert.match(TODAY, /^\d{4}-\d{2}-\d{2}$/);
});

test('every recommended stop is a live path in the prism route registry', () => {
  for (const stop of Object.values(SMART_GUIDE_STOPS)) {
    assert.ok(isValidPrismPath(stop.path), `recommended path ${stop.path} must exist`);
    assert.ok(stop.title && stop.reason && stop.ctaHint, `stop ${stop.action} needs guide copy`);
  }
});

test('a missing birthdate sends the tap to the profile first, from any screen', () => {
  for (const path of ['/', '/chat', '/lucky', '/key', '/voice', '/prologue', '/orange', '/epilogue', '/trinity']) {
    const guide = resolveSmartBigBangGuide(input({ cleanPath: path, profile: { hasBirthday: false, hasBirthTime: false } }));
    assert.equal(guide.path, '/profile', `from ${path}`);
    assert.equal(guide.action, 'profile');
    assert.equal(guide.needsProMode, false);
    assert.match(guide.reason, /생년월일/);
  }
  // 이미 프로필 화면이면 같은 곳을 다시 권하지 않는다.
  const onProfile = resolveSmartBigBangGuide(input({ cleanPath: '/profile', profile: { hasBirthday: false, hasBirthTime: false }, state: { ...emptySmartGuideState(NOW), masterSeenDate: TODAY } }));
  assert.notEqual(onProfile.path, '/profile');
});

test('with a birthdate and no divination today, Lucy Pro is recommended', () => {
  // 다른 채널에서: 루시 점술모드로 이동
  const fromLucky = resolveSmartBigBangGuide(input({ cleanPath: '/lucky' }));
  assert.equal(fromLucky.path, '/');
  assert.equal(fromLucky.action, 'divination');
  assert.equal(fromLucky.needsProMode, true);
  assert.equal(fromLucky.inPlace, false);
  assert.match(fromLucky.reason, /오늘/);

  // 루시와 대화 중이면 화면을 옮기지 않고 그 자리에서 점술모드로
  const inChat = resolveSmartBigBangGuide(input({ cleanPath: '/chat', isLucyChat: true }));
  assert.equal(inChat.action, 'divination');
  assert.equal(inChat.needsProMode, true);
  assert.equal(inChat.inPlace, true);

  // 오늘 이미 봤으면(점술모드 기록) 점술모드를 다시 권하지 않는다.
  const seen = resolveSmartBigBangGuide(input({
    cleanPath: '/lucky',
    state: { ...emptySmartGuideState(NOW), masterSeenDate: TODAY },
  }));
  assert.notEqual(seen.action, 'divination');

  // 오늘의 타로를 뽑았어도 운세는 본 것으로 본다.
  const tarotSeen = resolveSmartBigBangGuide(input({ cleanPath: '/lucky', today: { tarotSeen: true, divinationSeen: false } }));
  assert.notEqual(tarotSeen.action, 'divination');

  // 출생 시간이 없어도 생년월일이 있으면 점술모드 추천은 그대로.
  const noTime = resolveSmartBigBangGuide(input({ cleanPath: '/lucky', profile: { hasBirthday: true, hasBirthTime: false } }));
  assert.equal(noTime.action, 'divination');
});

test('the tap never recommends the screen you are already standing on', () => {
  for (const stop of Object.values(SMART_GUIDE_STOPS)) {
    const guide = resolveSmartBigBangGuide(input({
      cleanPath: stop.path,
      isLucyChat: stop.path === '/',
      state: { ...emptySmartGuideState(NOW), masterSeenDate: TODAY },
    }));
    assert.notEqual(guide.path, stop.path, `standing on ${stop.path}`);
  }
});

test('in Lucy the guide rotates through core features instead of bouncing between two', () => {
  const state: SmartGuideState = { ...emptySmartGuideState(NOW), masterSeenDate: TODAY };
  const walked: string[] = [];
  let current = '/';
  for (let step = 0; step < 6; step += 1) {
    const guide = resolveSmartBigBangGuide(input({
      cleanPath: current,
      isLucyChat: current === '/',
      state,
    }));
    assert.notEqual(guide.path, current, 'never recommends the current screen');
    walked.push(guide.path);
    state.history = [...state.history, { path: guide.path, at: NOW + step }];
    current = guide.path;
  }
  assert.ok(new Set(walked.slice(0, 4)).size === 4, `first four recommendations are distinct: ${walked.join(' → ')}`);
  for (let index = 1; index < walked.length; index += 1) {
    assert.notEqual(walked[index], walked[index - 1], `no immediate repeat at step ${index}: ${walked.join(' → ')}`);
  }
});

test('a recent recommendation is avoided while another core screen is available', () => {
  const base = { ...emptySmartGuideState(NOW), masterSeenDate: TODAY };
  const first = resolveSmartBigBangGuide(input({ cleanPath: '/', isLucyChat: true, state: base }));
  assert.equal(first.path, '/voice');

  const second = resolveSmartBigBangGuide(input({
    cleanPath: '/',
    isLucyChat: true,
    state: { ...base, history: [{ path: '/voice', at: NOW }] },
  }));
  assert.equal(second.path, '/key');

  const third = resolveSmartBigBangGuide(input({
    cleanPath: '/',
    isLucyChat: true,
    state: { ...base, history: [{ path: '/voice', at: NOW }, { path: '/key', at: NOW + 1 }] },
  }));
  assert.equal(third.path, '/lucky');
});

test('from a complex channel the guide points at a core feature first', () => {
  for (const path of ['/lucky', '/prologue', '/orange', '/trinity', '/muse', '/epilogue']) {
    const guide = resolveSmartBigBangGuide(input({ cleanPath: path, state: { ...emptySmartGuideState(NOW), masterSeenDate: TODAY } }));
    assert.equal(guide.path, '/', `from ${path} → Lucy`);
    assert.equal(guide.action, 'lucy');
  }
  // 오브에서 탭하면 루시로 (오브를 다시 권하지 않는다)
  const fromOrb = resolveSmartBigBangGuide(input({ cleanPath: '/voice', isOrbOpen: true, state: { ...emptySmartGuideState(NOW), masterSeenDate: TODAY } }));
  assert.equal(fromOrb.path, '/');
});

test('the visit ledger keeps today only and remembers a short recommendation history', () => {
  const storage = memoryStorage();
  recordSmartGuideVisit(storage, '/key?tab=2', { masterMode: false }, NOW);
  recordSmartGuideVisit(storage, '/voice', { masterMode: false }, NOW + 10);
  recordSmartGuideVisit(storage, '/', { masterMode: true }, NOW + 20);

  const state = readSmartGuideState(storage, NOW + 30);
  assert.equal(state.date, TODAY);
  assert.equal(state.visits['/key'], NOW);
  assert.equal(state.visits['/voice'], NOW + 10);
  assert.equal(state.masterSeenDate, TODAY, 'the pro mode visit is remembered for today');

  // 날짜가 바뀌면 오늘 방문·점술모드 기록은 새로 시작하고, 최근 안내 이력만 남는다.
  recordSmartGuideRecommendation(storage, '/voice', NOW + 40);
  const tomorrow = NOW + 24 * 60 * 60 * 1000;
  const rolled = readSmartGuideState(storage, tomorrow);
  assert.equal(rolled.date, guideDateKey(tomorrow));
  assert.deepEqual(rolled.visits, {});
  assert.notEqual(rolled.masterSeenDate, guideDateKey(tomorrow));
  assert.deepEqual(rolled.history.map(entry => entry.path), ['/voice']);
});

test('the recommendation history stays short and never repeats the same path twice in a row', () => {
  const storage = memoryStorage();
  for (let index = 0; index < 10; index += 1) {
    recordSmartGuideRecommendation(storage, index % 2 === 0 ? '/voice' : '/key', NOW + index);
  }
  const state = readSmartGuideState(storage, NOW + 20);
  assert.ok(state.history.length <= SMART_GUIDE_MAX_HISTORY);
  assert.deepEqual(state.history.map(entry => entry.path), ['/voice', '/key']);
  // 저장 키는 한 개
  assert.ok(storage.map.has(SMART_GUIDE_STORAGE_KEY));
});

test("today's tarot is read from the trinity daily key", () => {
  const storage = memoryStorage();
  assert.equal(hasSeenTodayTarot(storage, NOW), false);
  storage.setItem(`trinity_saved_daily_tarot_${TODAY}`, '{}');
  assert.equal(hasSeenTodayTarot(storage, NOW), true);
});

test('the Big Bang hold always opens the orb page and keeps working when already there', () => {
  const start = BIGBANG.indexOf('const goToOrbPage');
  assert.ok(start >= 0, 'goToOrbPage exists');
  const end = BIGBANG.indexOf('const enterDivinationMode', start);
  assert.ok(end > start, 'goToOrbPage ends before the pro-mode helper');
  const hold = BIGBANG.slice(start, end);
  assert.match(hold, /navigate\('\/voice'\)/);
  assert.match(hold, /prism-navigate', \{ detail: \{ path: '\/voice' \} \}/);
  // 이미 오브페이지면 상담을 끊거나 다시 열지 않는다.
  assert.match(hold, /if \(currentCleanPath === '\/voice' \|\| windowCleanPath === '\/voice'\) return;/, 'already-on-orb guard');

  // 가운데 홀드는 점술모드 토글이 아니라 오브페이지로 간다.
  const holdBranch = BIGBANG.slice(BIGBANG.indexOf('const isHoldGesture'), BIGBANG.indexOf("const isTapGesture"));
  assert.match(holdBranch, /goToOrbPage\(metrics\)/);
  assert.doesNotMatch(holdBranch, /toggleDivinationMode|setLucyMasterMode\(/, 'the hold no longer flips the divination mode');
  // 홀드 안내 미리보기도 오브페이지를 가리킨다.
  assert.match(BIGBANG, /previewLabel: '\[홀드\] 오브페이지로'/);
  assert.match(BIGBANG, /destinationPath: '\/voice'/);
});

test('a single tap runs the smart guide and shows its banner, without touching other gestures', () => {
  // 한 번 탭의 지연 타이머 안에서 스마트 가이드가 실행된다.
  const tapStart = BIGBANG.indexOf('const isTapGesture');
  const tapBlock = BIGBANG.slice(tapStart, tapStart + 2000);
  assert.match(tapBlock, /runSmartGuide\(metrics\)/);
  assert.doesNotMatch(tapBlock, /navigate\('\/voice'\)|setLucyMasterMode\(false\)/, 'the old fixed single-tap moves are gone');

  // 더블 탭(Key)과 방향 제스처는 그대로
  assert.match(BIGBANG, /goToKeyChannel\(metrics\)/);
  assert.match(BIGBANG, /navigateToAdjacentMenuApp\(targetDir === 'north' \? 'previous' : 'next'\)/);
  assert.match(BIGBANG, /goToPreviousDapp\(\)/);
  assert.match(BIGBANG, /goToNextDapp\(\)/);

  // 배너: 화면 위에 뜨고, 탭하면 닫히고, 3.5~4초 뒤 스스로 사라진다.
  assert.match(BIGBANG, /<SmartGuideBanner guide=\{smartGuide\} onClose=\{dismissSmartGuide\} \/>/);
  assert.match(BANNER, /data-testid="bigbang-smart-guide"/);
  assert.match(BANNER, /data-smart-guide-action=\{guide\.action\}/);
  assert.match(BANNER, /🧭 지금 추천: \{guide\.title\}/);
  assert.match(BANNER, /guide\.ctaHint/);
  assert.match(BANNER, /onClick=\{onClose\}/);
  assert.match(BIGBANG, /SMART_GUIDE_TOAST_MS/);
  const toastMs = Number(/SMART_GUIDE_TOAST_MS = (\d+)/.exec(read('src/lib/omniWarp/smartBigBangGuide.ts'))?.[1]);
  assert.ok(toastMs >= 3500 && toastMs <= 4000, `banner lifetime ${toastMs}ms sits between 3.5 and 4 seconds`);
});

test('the button reads the profile, today state and visit ledger before recommending', () => {
  assert.match(BIGBANG, /getPersistentUserProfile\(\)/);
  assert.match(BIGBANG, /hasBirthday: Boolean\(saved\?\.basic\?\.birthdate\?\.trim\(\)\)/);
  assert.match(BIGBANG, /hasSeenTodayTarot\(safeLocalStorage, now\)/);
  assert.match(BIGBANG, /recordSmartGuideVisit\(safeLocalStorage, currentCleanPath, \{ masterMode: masterOn \}/);
  assert.match(BIGBANG, /recordSmartGuideRecommendation\(safeLocalStorage, guide\.path, now\)/);
});

test('the page guides describe the new gestures', () => {
  assert.match(GUIDES, /한 번 탭하면 지금 가장 추천되는 곳으로 안내/);
  assert.match(GUIDES, /꾹 누르면 오브\(음성 상담\)/);
  assert.doesNotMatch(GUIDES, /꾹 누르면 루시프로/, 'no guide still says hold = Lucy Pro');
  assert.doesNotMatch(GUIDES, /한 번 탭하면 루시프로를 나가/, 'no guide still says tap leaves Lucy Pro');
  // 점술모드 켜기·끄기는 왼쪽·오른쪽 누르기로 남아 있다.
  assert.match(GUIDES, /빅뱅 버튼 왼쪽·오른쪽 어느 쪽을 눌러도 루시프로가 켜지고/);
});
