/**
 * 🧭 스마트 가이드 설정(상단 헤더 물음표) · 🔊 가이드 도슨트(TTS) 회귀 검사
 *
 * 사용자 지시(2026-11-27):
 *  - "상단 헤더에 물음표 아이콘을 만들어서 그 기능을 활성화 해서 스마트가이드를 켜고 끌수 있게해주고
 *     tts기능을 통해 가이드 도슨트를 만들어서 해당 옵션도 키고 끌수 있게해줘
 *     (스마트 가이드가 꺼져도 이동은 가능하게 해줘)"
 *  - "스마트가이드 기능(상단헤더 물음표 아이콘)을 모든페이지에 나오게 해줘"
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  DEFAULT_SMART_GUIDE_SETTINGS,
  SMART_GUIDE_SETTINGS_KEY,
  readSmartGuideSettings,
  writeSmartGuideSettings,
  resolveSmartGuidePresentation,
} from '../src/lib/omniWarp/smartGuideSettings';
import {
  SMART_GUIDE_STOPS,
  buildSmartGuideSpeech,
  resolveSmartBigBangGuide,
  emptySmartGuideState,
  guideDateKey,
} from '../src/lib/omniWarp/smartBigBangGuide';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const BIGBANG = read('src/components/omniwarp/BigBangButton.tsx');
const BANNER = read('src/components/guide/SmartGuideBanner.tsx');
const SETTINGS_UI = read('src/components/guide/SmartGuideSettings.tsx');
const SETTINGS_LIB = read('src/lib/omniWarp/smartGuideSettings.ts');
const DOUSER = read('src/lib/omniWarp/guideDouser.ts');

const NOW = new Date('2026-11-27T18:44:08+09:00').getTime();

function memoryStorage(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  return {
    map,
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    setItem: (key: string, value: string) => { map.set(key, String(value)); },
    removeItem: (key: string) => { map.delete(key); },
  };
}

test('the guide banner is ON and the douser is OFF until the user turns it on', () => {
  assert.deepEqual(DEFAULT_SMART_GUIDE_SETTINGS, { guide: true, douser: false });
  const storage = memoryStorage();
  assert.deepEqual(readSmartGuideSettings(storage), { guide: true, douser: false });
  // 저장값이 없거나 깨져 있어도 기본값으로 동작한다.
  storage.setItem(SMART_GUIDE_SETTINGS_KEY, '{not json');
  assert.deepEqual(readSmartGuideSettings(storage), { guide: true, douser: false });
  assert.deepEqual(readSmartGuideSettings(null), { guide: true, douser: false });
});

test('turning the guide off keeps the douser silent, and both flags persist', () => {
  const storage = memoryStorage();
  let settings = writeSmartGuideSettings({ douser: true }, storage);
  assert.deepEqual(settings, { guide: true, douser: true });
  assert.deepEqual(resolveSmartGuidePresentation(settings), { banner: true, douser: true });

  settings = writeSmartGuideSettings({ guide: false }, storage);
  assert.deepEqual(settings, { guide: false, douser: true }, 'the douser choice itself is remembered');
  assert.deepEqual(resolveSmartGuidePresentation(settings), { banner: false, douser: false }, 'no banner and no speech while the guide is off');
  assert.equal(JSON.parse(storage.getItem(SMART_GUIDE_SETTINGS_KEY)!).guide, false);

  settings = writeSmartGuideSettings({ guide: true }, storage);
  assert.deepEqual(resolveSmartGuidePresentation(settings), { banner: true, douser: true }, 'coming back restores the douser choice');

  settings = writeSmartGuideSettings({ douser: false }, storage);
  assert.deepEqual(settings, { guide: true, douser: false });
  assert.deepEqual(readSmartGuideSettings(storage), { guide: true, douser: false }, 'stored across reloads');
  // 저장 키는 하나만 쓴다.
  assert.deepEqual([...storage.map.keys()], [SMART_GUIDE_SETTINGS_KEY]);
});

test('the recommended destination is the same whether the guide is on or off', () => {
  const state = { ...emptySmartGuideState(NOW), masterSeenDate: guideDateKey(NOW) };
  const base = {
    cleanPath: '/lucky',
    isMasterMode: false,
    isOrbOpen: false,
    isLucyChat: false,
    profile: { hasBirthday: true, hasBirthTime: true },
    today: { tarotSeen: true, divinationSeen: true },
    state,
    now: NOW,
  };
  const on = resolveSmartBigBangGuide({ ...base });
  // 설정값은 추천 계산에 관여하지 않는다 (이동은 언제나 같다).
  const off = resolveSmartBigBangGuide({ ...base });
  assert.deepEqual(on, off);
  // 스마트 가이드를 모두 끈 상태에서도 정상 목적지를 고른다.
  assert.deepEqual(resolveSmartGuidePresentation({ guide: false, douser: false }), { banner: false, douser: false });
  assert.ok(on.path in { '/': 1 } || Object.values(SMART_GUIDE_STOPS).some(stop => stop.path === on.path));
});

test('the button always navigates, and only the banner and the speech follow the settings', () => {
  const start = BIGBANG.indexOf('const runSmartGuide');
  const end = BIGBANG.indexOf('const goToKeyChannel', start) > 0 ? BIGBANG.indexOf('const goToKeyChannel', start) : BIGBANG.length;
  const body = BIGBANG.slice(start, end);
  // 이동은 설정과 무관하게 실행된다.
  assert.match(body, /navigate\(guide\.path\)/);
  assert.match(body, /prism-navigate', \{ detail: \{ path: guide\.path \} \}/);
  // 배너와 도슨트만 설정을 따른다.
  assert.match(body, /if \(guidePresentation\.banner\) showSmartGuide\(guide\);/);
  assert.match(body, /else closeSmartGuide\(\);/);
  assert.match(body, /if \(guidePresentation\.douser\) \{[\s\S]*?speakGuideDouser\(guide\);/);
  // 내비게이션 블록이 배너 조건 안으로 들어가 있지 않다.
  const navIndex = body.indexOf('navigate(guide.path)');
  const bannerIndex = body.indexOf('if (guidePresentation.banner)');
  assert.ok(navIndex > bannerIndex, 'navigation sits after the banner block, not inside it');
  assert.doesNotMatch(body, /if \(guidePresentation\.banner\)\s*\{[^}]*navigate\(guide\.path\)/);
});

test('the douser reads the same reason and hint the banner shows', () => {
  const guide = resolveSmartBigBangGuide({
    cleanPath: '/lucky',
    isMasterMode: false,
    isOrbOpen: false,
    isLucyChat: false,
    profile: { hasBirthday: true, hasBirthTime: true },
    today: { tarotSeen: true, divinationSeen: true },
    state: { ...emptySmartGuideState(NOW), masterSeenDate: guideDateKey(NOW) },
    now: NOW,
  });
  const speech = buildSmartGuideSpeech(guide);
  assert.ok(speech.includes(guide.reason), 'the reason is read aloud');
  assert.ok(speech.includes(guide.ctaHint), 'the hint is read aloud');
  assert.ok(speech.includes(guide.title), 'the destination name is read aloud');
  assert.match(speech, /^.+ 안내할게요\./);

  const inPlace = buildSmartGuideSpeech({ ...guide, inPlace: true, action: 'divination' });
  assert.match(inPlace, /지금 이 화면에서 안내할게요/);
});

test('the douser uses the app TTS pipeline and can be stopped', () => {
  assert.match(DOUSER, /import \{ playTTS, stopTTS, subscribeTTS \} from '@\/utils\/tts';/);
  assert.match(DOUSER, /playTTS\(text, GUIDE_DOUSER_VOICE, false\)/);
  assert.match(DOUSER, /stopTTS\(\)/);
  assert.match(DOUSER, /export function stopGuideDouser/);
  // 배너 닫기·다른 화면 이동·옵션 끄기에서 멈춘다.
  assert.match(BANNER, /stopGuideDouser\(\)/);
  assert.match(BIGBANG, /const dismissSmartGuide = useCallback\(\(\) => \{\s*closeSmartGuide\(\);\s*stopGuideDouser\(\);/);
  assert.match(BIGBANG, /if \(spokenPath && currentCleanPath !== spokenPath\) \{\s*douserPathRef\.current = null;\s*stopGuideDouser\(\);/);
  assert.match(BIGBANG, /if \(!guidePresentation\.douser\) stopGuideDouser\(\);/);
  // 읽는 동안 배너가 사라지지 않고, 중지 버튼이 함께 나온다.
  assert.match(BIGBANG, /if \(isGuideDouserActive\(\)\) \{\s*armSmartGuideAutoHide\(1200\);/);
  assert.match(BANNER, /data-smart-guide-douser-stop="true"/);
  assert.match(BANNER, /도슨트 읽는 중 · 멈추기/);
});

test('the question-mark icon opens a sheet with the two switches', () => {
  // 기존 가이드(BookOpen)와 구분되는 물음표 아이콘
  assert.match(SETTINGS_UI, /HelpCircle/);
  assert.match(SETTINGS_UI, /data-smart-guide-settings-button="true"/);
  assert.match(SETTINGS_UI, /data-smart-guide-enabled=\{active \? 'true' : 'false'\}/);
  assert.match(SETTINGS_UI, /aria-pressed=\{active\}/);
  // 켜짐/꺼짐이 한눈에 보인다 (강조색 + 점)
  assert.match(SETTINGS_UI, /active \? TONE_ACTIVE\[tone\] : TONE_BUTTON\[tone\]/);
  assert.match(SETTINGS_UI, /bg-cyan-400 shadow-\[0_0_6px_rgba\(34,211,238,0\.9\)\]/);
  // 설정 시트: 스마트 가이드 · 가이드 도슨트 스위치
  assert.match(SETTINGS_UI, /role="switch"/);
  assert.match(SETTINGS_UI, /aria-checked=\{on\}/);
  assert.match(SETTINGS_UI, /onToggle=\{\(\) => toggle\(\{ guide: !settings\.guide \}\)\}/);
  assert.match(SETTINGS_UI, /onToggle=\{\(\) => toggle\(\{ douser: !settings\.douser \}\)\}/);
  assert.match(SETTINGS_UI, /writeSmartGuideSettings\(patch\)/);
  assert.match(SETTINGS_UI, /스마트 가이드를 꺼도 빅뱅 버튼 한 번 탭의 추천 이동은 그대로예요/);
  // 도슨트는 가이드가 켜져 있을 때만 의미가 있다.
  assert.match(SETTINGS_UI, /disabled=\{!settings\.guide\}/);
  // 저장·동기화
  assert.match(SETTINGS_LIB, /localStorage|safeLocalStorage/);
  assert.match(SETTINGS_LIB, /SMART_GUIDE_SETTINGS_EVENT/);
  assert.match(SETTINGS_LIB, /addEventListener\('storage'/);
});

test('every page header carries the same question-mark button', () => {
  const headers: Array<[string, string]> = [
    ['src/App.tsx', 'ChannelPage'], // 럭키·7대 앱·프로필·서브페이지 공통 헤더
    ['src/pages/LucyStandalonePage.tsx', 'lucy-header-actions'], // 일반 루시·점술모드
    ['src/components/lucy/LucyOrbCounsel.tsx', 'lucy-orb-header-actions'], // 오브 /voice
    ['src/pages/CalmApp.tsx', 'key-parent-actions'], // Key
    ['src/components/duo/DuoCosmicAmbientRoom.tsx', 'cosmic-room-header'], // 코스믹 룸
  ];
  for (const [path, marker] of headers) {
    const source = read(path);
    assert.match(source, /SmartGuideSettingsButton/, `${path} imports the shared button`);
    assert.ok(source.includes(marker), `${path} header marker ${marker}`);
  }
  // App 공통 헤더는 Lucy·Key·오브를 제외한 모든 라우트에서 뜨고, 그 페이지들은 각자 헤더에 있다.
  const app = read('src/App.tsx');
  assert.match(app, /!isLucyThemeRoute\(path\) && !isKeyChannelPath\(path\) && path !== '\/voice'/);
  assert.match(app, /<SmartGuideSettingsButton tone=\{isLuckyChannel \? 'dark' : resolveChannelThemeFromPath\(path\) === 'light' \? 'light' : 'dark'\} \/>/);
});
