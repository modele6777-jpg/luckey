/**
 * 🧭 스마트 가이드 배너·페이지 가이드 구체화 회귀 검사 (2026-11-28 사용자 지시 5건)
 *
 * 1) "가이드 발동 시 안내팝업을 사이드메뉴를 제외한 본문에만 나오게 해주고 가이드탭을 누를때마다
 *     빅뱅 버튼 안에 물음표 문양이 남게 해줘"
 * 2) "가이드 안내 팝업안에 글자의 시인성 때문에 잘 안보여"
 * 3) "빅뱅 탭으로 가이드 이동시 안내 팝업에 그 페이지의 가이드로 바로 연결할수 있는 버튼을 안내해줘"
 * 4) "가이드 창에 글씨가 삐져나와"
 * 5) "모든 페이지의 가이드 기능은 조금만 더 구채적으로 작성해줘"
 * 6) "빅뱅 버튼 물음표는 가이드 터치 할때만 잠깐 나오개 해줘" (2026-11-28, 영구 저장 제거)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  SMART_GUIDE_BADGE_KEY,
  SMART_GUIDE_BADGE_MS,
  SMART_GUIDE_BADGE_FADE_MS,
  clearSmartGuideBadge,
  startSmartGuideBadgeFlash,
  type SmartGuideBadgePhase,
} from '../src/lib/omniWarp/smartBigBangGuide';
import {
  allPageGuides,
  resolveGuideForLocation,
  resolvePageGuide,
} from '../src/lib/pageGuides';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const BANNER = read('src/components/guide/SmartGuideBanner.tsx');
const PAGE_GUIDE = read('src/components/guide/PageGuide.tsx');
const BIGBANG = read('src/components/omniwarp/BigBangButton.tsx');

/** 가짜 타이머 시계 (실제 setTimeout 없이 흐름을 그대로 돌린다) */
function fakeClock() {
  let now = 0;
  let nextId = 1;
  const timers = new Map<number, { at: number; handler: () => void }>();
  return {
    setTimeoutFn: (handler: () => void, ms: number) => {
      const id = nextId++;
      timers.set(id, { at: now + ms, handler });
      return id;
    },
    clearTimeoutFn: (id: unknown) => {
      timers.delete(id as number);
    },
    pending: () => timers.size,
    advance(ms: number) {
      const target = now + ms;
      for (;;) {
        const due = [...timers.entries()]
          .filter(([, timer]) => timer.at <= target)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        timers.delete(due[0]);
        now = due[1].at;
        due[1].handler();
      }
      now = target;
    },
  };
}

function memoryStorage(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  return {
    map,
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    setItem: (key: string, value: string) => { map.set(key, String(value)); },
    removeItem: (key: string) => { map.delete(key); },
  };
}

test('the banner lives inside the body pane and never crosses the sidebar', () => {
  // 사이드바를 뺀 본문 캔버스 계측을 그대로 쓴다.
  assert.match(BANNER, /useMainOverlayViewport\('main'\)/);
  assert.match(BANNER, /left: `\$\{viewport\.left\}px`/);
  assert.match(BANNER, /width: `\$\{viewport\.width\}px`/);
  assert.match(BANNER, /data-smart-guide-confined=\{confined \? 'true' : 'false'\}/);
  // 예전처럼 창 전체 폭 기준(92vw)으로 띄우지 않는다.
  assert.doesNotMatch(BANNER, /92vw/);
  assert.doesNotMatch(BANNER, /left-1\/2 z-\[9994\] w-\[min\(/);
  // 본문 폭 안에서만 최대 폭을 잡는다.
  assert.match(BANNER, /width: 'min\(420px, calc\(100% - 20px\)\)'/);
});

test('banner text is isolated from the light-theme text remap and stays high contrast', () => {
  assert.match(BANNER, /data-theme-dark-island="true"/);
  assert.match(BANNER, /colorScheme: 'dark'/);
  // 불투명에 가까운 남색 배경 + 고명도 텍스트 색을 명시한다.
  assert.match(BANNER, /rgba\(8,15,36,0\.97\)/);
  assert.match(BANNER, /const TEXT_TITLE = '#ecfeff'/);
  assert.match(BANNER, /const TEXT_BODY = '#e2e8f0'/);
  assert.match(BANNER, /const TEXT_HINT = '#a5f3fc'/);
  assert.doesNotMatch(BANNER, /bg-slate-950\/88/);
});

test('the banner offers a button that opens the page guide of the screen you landed on', () => {
  assert.match(BANNER, /data-smart-guide-page-guide="true"/);
  assert.match(BANNER, /📘 이 페이지 가이드 보기/);
  // 배너를 닫고 그 화면의 가이드 창을 연다.
  assert.match(BANNER, /onOpenPageGuide/);
  assert.match(BIGBANG, /const openPageGuideFromBanner = useCallback\(\(\) => \{/);
  assert.match(BIGBANG, /resolveGuideForLocation\(/);
  assert.match(BIGBANG, /dismissSmartGuide\(\);\s*setBannerPageGuide\(resolved\)/);
  assert.match(BIGBANG, /\{bannerPageGuide && <PageGuideDialog guide=\{bannerPageGuide\} onClose=\{\(\) => setBannerPageGuide\(null\)\} \/>\}/);
});

test('the banner button resolves the guide of the exact screen, including dApp tabs', () => {
  assert.equal(resolveGuideForLocation('/orange?tab=wishingWell').id, 'orange-wishingWell');
  assert.equal(resolveGuideForLocation('/trinity?tab=tarot').id, 'trinity-tarot');
  assert.equal(resolveGuideForLocation('/profile').id, 'epilogue-profile');
  assert.equal(resolveGuideForLocation('/key').id, 'key');
  assert.equal(resolveGuideForLocation('/voice').id, 'orb');
  assert.equal(resolvePageGuide('/voice').id, 'orb', '오브 화면은 오브 가이드');
  assert.equal(resolveGuideForLocation('/').id, 'lucy');
  assert.equal(resolveGuideForLocation('/', { master: true }).id, 'master');
  // 모르는 주소는 기본 가이드로 안전하게 떨어진다.
  assert.equal(resolveGuideForLocation('/no-such-page').id, 'default');
  assert.equal(resolveGuideForLocation('').id, 'lucy');
});

test('the question mark only flashes when the guide is tapped — it never stays saved', () => {
  // 예전 버전이 localStorage에 영구 저장해 둔 표시는 다시 읽지 않고 한 번 지운다.
  const storage = memoryStorage({ [SMART_GUIDE_BADGE_KEY]: '1' });
  clearSmartGuideBadge(storage);
  assert.equal(storage.map.has(SMART_GUIDE_BADGE_KEY), false);
  // 저장이 막혀 있어도 화면 흐름은 계속된다.
  assert.doesNotThrow(() => clearSmartGuideBadge(null));
  assert.doesNotThrow(() => clearSmartGuideBadge(undefined));

  // 잠깐 떴다가 저절로 사라진다 (사용자 지시: 약 1.2~1.5초 + 부드러운 페이드).
  assert.ok(SMART_GUIDE_BADGE_MS >= 1200 && SMART_GUIDE_BADGE_MS <= 1500, `badge shows ${SMART_GUIDE_BADGE_MS}ms`);
  assert.ok(SMART_GUIDE_BADGE_FADE_MS > 0 && SMART_GUIDE_BADGE_FADE_MS < SMART_GUIDE_BADGE_MS);

  // 가이드 탭으로 스마트 가이드가 실행될 때만 잠깐 표시한다.
  const run = BIGBANG.slice(BIGBANG.indexOf('const runSmartGuide'), BIGBANG.indexOf('const goToNextRecommended'));
  assert.match(run, /flashGuideBadge\(\)/);
  assert.doesNotMatch(run, /markSmartGuideBadge/);
  assert.doesNotMatch(run, /setGuideBadge\(true\)/);
  // 영구 저장은 어디에도 남기지 않는다.
  assert.doesNotMatch(BIGBANG, /readSmartGuideBadge/);
  assert.doesNotMatch(BIGBANG, /markSmartGuideBadge/);
  assert.doesNotMatch(BIGBANG, /setItem\(SMART_GUIDE_BADGE_KEY/);
  // 앱을 열 때 예전에 남은 표시를 지운다.
  assert.match(BIGBANG, /clearSmartGuideBadge\(safeLocalStorage\)/);

  // 타이머로 스스로 사라지고, 연속 탭·언마운트에서는 예약된 타이머를 정리한다.
  assert.match(BIGBANG, /guideBadgeFlashRef\.current = startSmartGuideBadgeFlash\(setGuideBadgePhase\)/);
  assert.match(BIGBANG, /const clearGuideBadge = useCallback\(\(\) => \{\s*guideBadgeFlashRef\.current\?\.cancel\(\)/);
  const beforeGuideState = BIGBANG.slice(0, BIGBANG.indexOf('// 🧭 상하좌우 원뿔 모양'));
  assert.match(beforeGuideState, /guideBadgeFlashRef\.current\?\.cancel\(\)/, 'unmount cancels the badge timer');

  // 중앙 구슬의 물음표: 테스트 가능한 속성 + 페이드 + 설정 OFF면 꺼진다.
  assert.match(BIGBANG, /data-bigbang-guide-badge="question"/);
  assert.match(BIGBANG, /data-bigbang-guide-badge-phase=\{guideBadgePhase\}/);
  assert.match(BIGBANG, /guideBadgePhase !== 'hidden' && guidePresentation\.banner && !isPressing && !isCosmicSuctionActive && activePhase === 'idle'/);
  assert.match(BIGBANG, /guideBadgePhase === 'fading' \? 'opacity-0 scale-75' : 'opacity-100 scale-100'/);
  // 홀드·드래그·워프 조준 중에는 기존 아이콘이 먼저 나온다.
  const center = BIGBANG.slice(BIGBANG.indexOf('centerDirection === \'north\' || centerDirection === \'south\''), BIGBANG.indexOf('</motion.button>'));
  assert.ok(center.indexOf('data-bigbang-center-gesture="hold"') < center.indexOf('data-bigbang-guide-badge="question"'), 'hold icon stays ahead of the badge');
  assert.ok(center.indexOf('data-bigbang-center-gesture="double"') < center.indexOf('data-bigbang-guide-badge="question"'), 'double-tap (key) icon stays ahead of the badge');
});

test('the badge timer shows, fades, then hides itself — and can be restarted or cancelled', () => {
  // 가짜 시계로 실제 타이머 흐름을 그대로 돌린다.
  const clock = fakeClock();
  const seen: SmartGuideBadgePhase[] = [];
  const flash = startSmartGuideBadgeFlash(phase => seen.push(phase), {
    showMs: SMART_GUIDE_BADGE_MS,
    fadeMs: SMART_GUIDE_BADGE_FADE_MS,
    setTimeoutFn: clock.setTimeoutFn,
    clearTimeoutFn: clock.clearTimeoutFn,
  });

  assert.deepEqual(seen, ['shown'], '탭하면 바로 물음표가 뜬다');
  assert.equal(flash.phase, 'shown');

  clock.advance(SMART_GUIDE_BADGE_MS - SMART_GUIDE_BADGE_FADE_MS - 1);
  assert.deepEqual(seen, ['shown'], '보이는 시간 동안 그대로');

  clock.advance(1);
  assert.deepEqual(seen, ['shown', 'fading'], '끝나기 전에 부드럽게 흐려진다');

  clock.advance(SMART_GUIDE_BADGE_FADE_MS);
  assert.deepEqual(seen, ['shown', 'fading', 'hidden'], '저절로 사라진다');
  assert.equal(flash.phase, 'hidden');
  assert.equal(clock.pending(), 0, '남은 타이머가 없다');

  // 다시 탭하면 처음부터 다시 보인다.
  const again: SmartGuideBadgePhase[] = [];
  const restartClock = fakeClock();
  const first = startSmartGuideBadgeFlash(phase => again.push(phase), {
    setTimeoutFn: restartClock.setTimeoutFn,
    clearTimeoutFn: restartClock.clearTimeoutFn,
  });
  restartClock.advance(SMART_GUIDE_BADGE_MS);
  first.cancel();
  const second = startSmartGuideBadgeFlash(phase => again.push(phase), {
    setTimeoutFn: restartClock.setTimeoutFn,
    clearTimeoutFn: restartClock.clearTimeoutFn,
  });
  restartClock.advance(SMART_GUIDE_BADGE_MS);
  assert.deepEqual(again, ['shown', 'fading', 'hidden', 'shown', 'fading', 'hidden']);

  // 취소하면(언마운트·가이드 끄기) 더 이상 상태가 바뀌지 않는다.
  const cancelClock = fakeClock();
  const cancelled: SmartGuideBadgePhase[] = [];
  const handle = startSmartGuideBadgeFlash(phase => cancelled.push(phase), {
    setTimeoutFn: cancelClock.setTimeoutFn,
    clearTimeoutFn: cancelClock.clearTimeoutFn,
  });
  handle.cancel();
  cancelClock.advance(10_000);
  assert.deepEqual(cancelled, ['shown'], '취소 뒤에는 콜백이 오지 않는다');
  assert.equal(second.phase, 'hidden');
});

test('page guide text cannot spill out of its card', () => {
  assert.match(PAGE_GUIDE, /break-keep \[overflow-wrap:anywhere\]/);
  // 안내 문구·단계·팁·추천 활용 모두 같은 처리를 받는다.
  const intro = PAGE_GUIDE.slice(PAGE_GUIDE.indexOf('{guide.intro}') - 160, PAGE_GUIDE.indexOf('{guide.intro}'));
  assert.match(intro, /overflow-wrap:anywhere/);
  for (const marker of ['data-page-guide-steps', 'data-page-guide-tips', 'data-page-guide-uses']) {
    const at = PAGE_GUIDE.indexOf(marker);
    assert.ok(at > 0, `${marker} exists`);
  }
  const stepsBlock = PAGE_GUIDE.slice(PAGE_GUIDE.indexOf('data-page-guide-steps'), PAGE_GUIDE.indexOf('data-page-guide-uses'));
  assert.match(stepsBlock, /min-w-0 flex-1 text-\[13\.5px\] leading-relaxed text-slate-700 break-keep \[overflow-wrap:anywhere\]/);
  const tipsBlock = PAGE_GUIDE.slice(PAGE_GUIDE.indexOf('data-page-guide-tips'));
  assert.match(tipsBlock, /min-w-0 flex-1 text-\[13\.5px\] leading-relaxed text-slate-700 break-keep \[overflow-wrap:anywhere\]/);
});

test('the long 무공백 목록 from the screenshot wraps instead of being cut off', () => {
  const orb = allPageGuides().find(guide => guide.id === 'orb')!;
  const step = orb.steps.find(text => text.includes('합충형파해'))!;
  assert.ok(step, 'orb guide still explains the 8자·십신·용신·대운 목록');
  // CSS가 긴 문자열을 강제로 끊을 수 있어야 화면에서 잘리지 않는다.
  assert.match(PAGE_GUIDE, /\[overflow-wrap:anywhere\]/);
});

test('every page guide got more specific: at least three steps and three tips each', () => {
  const guides = allPageGuides();
  assert.ok(guides.length >= 45, `all page guides are covered (${guides.length})`);
  for (const guide of guides) {
    assert.ok(guide.steps.length >= 3, `${guide.id} has ${guide.steps.length} steps`);
    assert.ok(guide.tips.length >= 3, `${guide.id} has ${guide.tips.length} tips`);
    for (const step of guide.steps) assert.ok(step.trim().length >= 10, `${guide.id} step is too short: ${step}`);
  }
});

test('the guides name the real tabs and buttons of each channel', () => {
  const byId = new Map(allPageGuides().map(guide => [guide.id, guide]));
  const text = (id: string) => {
    const guide = byId.get(id)!;
    return [guide.intro, ...guide.steps, ...guide.tips.map(tip => tip.text)].join('\n');
  };

  // 루시: 입력·전송·누르고 말하기·사진·낭독
  assert.match(text('lucy'), /전송/);
  assert.match(text('lucy'), /누르고 말하기|길게 누르고 말하면/);
  assert.match(text('lucy'), /카메라 버튼/);
  assert.match(text('lucy'), /낭독 바|스피커/);
  assert.doesNotMatch(text('lucy'), /마이크 버튼/, 'voice method was replaced by hold-to-talk');

  // Key: 6개 탭 이름이 모두 나온다
  for (const label of ['90개 도구', '오감 도구함', '에너지 쉼', '풍선호흡', '실천 노트', '치유 비결']) {
    assert.ok(text('key').includes(label), `key guide names ${label}`);
  }

  // 오렌지·트리니티·힐·블루버드·뮤즈·에필로그 탭 이름
  assert.match(text('orange'), /Secret·STAR|Secret/);
  assert.match(text('trinity'), /destiny|SAJU/);
  assert.match(text('heal'), /Letting Go Method/);
  assert.match(text('bluebird'), /LETTER|네 마디/);
  assert.match(text('muse'), /ROLE MODEL/);
  assert.match(text('epilogue'), /CHRONICLE|Diary/);
  // 허브 탭
  assert.match(text('prologue'), /Universe/);
  assert.match(text('prologue'), /eCPR/);
  assert.match(text('prologue'), /ToDo/);
  // 루시프로: 점술 테이블·13개 도구
  assert.match(text('master'), /13개 점술 도구|13개 도구/);
});
