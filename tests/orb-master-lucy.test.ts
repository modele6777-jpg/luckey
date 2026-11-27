/**
 * 🔮 오브 4대 마스터 → 마스터 루시 통합 회귀 검사.
 * 사용자 지시 (2026-11-27): "오브페이지의 4대마스터를 마스터 루시로 통합해줘
 * 오브 기능은 사주와 타로기능 만을 극한으로 끌어올린 기능으로 만들어줘"
 *
 * 기대:
 *  - 마스터는 루시 한 명(id: 'lucy')이고, 구형 id(saju·tarot·astro·heart)는 모두 루시로 매핑된다.
 *  - 오브 메인화면은 4칸 마스터 카드 대신 마스터 루시 단일 화면과 '바로 상담 시작' 버튼을 보여 준다.
 *  - 사주는 원국 8자·일간·오행·십신·용신·대운·세운·월운·일진·신살·공망·합충형파해까지 계산해 지시문에 넣는다.
 *  - 도구는 사주와 타로 둘뿐이고, 타로 카드 세 장은 사주 흐름과 교차해 풀이한다.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  ORB_MASTERS, ORB_MASTER_ID, ORB_LEGACY_MASTER_IDS, normalizeOrbMasterId, orbMasterDisplayName, resolveOrbMaster,
} from '../src/lib/orbMasters.ts';
import {
  formatOrbSajuCompatibility, formatOrbSajuPrecise, orbBranchRelations, orbDayPillar, orbGongmang, orbMonthPillar, orbYearPillar,
} from '../src/lib/orb/orbSajuBrief.ts';
import { buildOrbProfileBrief } from '../src/lib/orb/orbProfile.ts';
import { ORB_CALC_TOOL_IDS, ORB_FN_RUN_TOOL, buildOrbMasterRules, orbFunctionDeclarations } from '../src/lib/orb/orbTools.ts';
import { buildOrbLiveInstruction } from '../src/lib/lucyLiveBrief.ts';
import { ORB_CARD_PICK_GUIDE, orbCardPickMessage, pickOrbCards, shuffleOrbDeck } from '../src/lib/orbConsult.ts';
import { getPageGuide } from '../src/lib/pageGuides.ts';
import { chatProfileToUserProfile } from '../src/lib/chatTargetProfiles.ts';
import type { ChatTargetProfile } from '../src/types/chatProfile.ts';

const component = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/components/lucy/lucy-orb-counsel.css', import.meta.url), 'utf8');

const me: ChatTargetProfile = {
  id: 'my-profile', isMe: true, name: '제제', nickname: '제제', relationship: '본인',
  birthdate: '1994-01-24', birthtime: '07:30', gender: 'male', birthCity: '서울', lunarSolar: 'solar',
};
const partner: ChatTargetProfile = {
  id: 'profile-partner', name: '민지', nickname: '민지', relationship: '연인',
  birthdate: '1996-05-15', birthtime: '12:00', gender: 'female', birthCity: '부산', lunarSolar: 'solar',
};

test('마스터는 루시 한 명이고, 구형 4대 마스터 id는 모두 루시로 매핑된다', () => {
  assert.equal(ORB_MASTERS.length, 1);
  assert.equal(ORB_MASTER_ID, 'lucy');
  assert.equal(ORB_MASTERS[0].id, 'lucy');
  assert.equal(ORB_MASTERS[0].name, '마스터 루시');
  assert.equal(ORB_MASTERS[0].cardPick, true, '마스터 루시는 항상 카드를 뽑는다');
  for (const id of [...ORB_LEGACY_MASTER_IDS, 'lucy', 'lucy-voice', '모르는-id', '', null]) {
    assert.equal(resolveOrbMaster(id).name, '마스터 루시', String(id));
  }
  for (const id of ORB_LEGACY_MASTER_IDS) assert.equal(normalizeOrbMasterId(id), 'lucy');
  assert.equal(normalizeOrbMasterId(undefined), 'lucy');
  assert.equal(orbMasterDisplayName('astro', '점성'), '마스터 루시');
  assert.equal(orbMasterDisplayName('lucy', '마스터 루시'), '마스터 루시');
});

test('오브 메인화면은 4칸 마스터 그리드 대신 마스터 루시 단일 화면과 바로 상담 시작을 보여 준다', () => {
  assert.doesNotMatch(component, /ORB_MASTERS\.map\(/);
  assert.doesNotMatch(component, /className="lucy-orb-masters"/);
  assert.match(component, /className="lucy-orb-master-hero"/);
  assert.match(component, /lucy-orb-master-name/);
  assert.match(component, /className="is-primary"[\s\S]{0,120}바로 상담 시작/);
  assert.match(component, /🃏 카드부터 뽑기/);
  assert.match(component, /const startWithCards = \(\) => \{/);
  // 주사위는 마스터를 고르지 않고 상담을 여는 의식이 되었다.
  assert.doesNotMatch(component, /ORB_MASTERS\[\(next\[0\] \+ next\[1\]\) % ORB_MASTERS\.length\]/);
  assert.match(css, /\.lucy-orb-master-hero \{/);
  assert.doesNotMatch(css, /\.lucy-orb-masters \{/);
});

test('도구는 사주와 타로 둘뿐이고, 추천 질문도 사주·타로 정밀 상담용이다', () => {
  assert.deepEqual([...ORB_CALC_TOOL_IDS], ['saju']);
  const declarations = orbFunctionDeclarations();
  assert.equal(declarations.length, 2);
  assert.equal(declarations[0].name, ORB_FN_RUN_TOOL);
  assert.deepEqual(declarations[0].parameters.properties.tool.enum, ['saju']);
  assert.match(declarations[1].description, /과거·지금·앞으로/);
  assert.equal(ORB_MASTERS[0].prompts.length, 4);
  assert.ok(ORB_MASTERS[0].prompts.some(prompt => /대운/.test(prompt)));
  assert.ok(ORB_MASTERS[0].prompts.some(prompt => /카드/.test(prompt)));
  assert.match(buildOrbMasterRules({ birthdate: true, birthtime: true }), /사주와 타로, 둘뿐/);
  assert.match(buildOrbMasterRules({ birthdate: true, birthtime: true }), /다른 점성술·주역·육임 같은 도구는 쓰지 않습니다/);
});

test('세운·월운·일진 간지를 입춘·절입 기준으로 계산한다', () => {
  assert.equal(orbYearPillar(new Date('2026-11-27T10:00:00Z')).label, '丙午(병오)');
  assert.equal(orbYearPillar(new Date('2026-02-01T10:00:00Z')).label, '乙巳(을사)', '입춘 전은 전해 세운');
  const month = orbMonthPillar(new Date('2026-11-27T10:00:00Z'));
  assert.equal(month.label, '己亥(기해)', '2026년 해월은 기해');
  assert.equal(month.term, '입동');
  const day = orbDayPillar(new Date('2026-11-27T10:00:00Z'));
  assert.match(day.label, /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]\(/);
  // 60갑자 순행: 다음 날은 다음 간지.
  const next = orbDayPillar(new Date('2026-11-28T10:00:00Z'));
  const stems = '甲乙丙丁戊己庚辛壬癸';
  const branches = '子丑寅卯辰巳午未申酉戌亥';
  assert.equal(stems.indexOf(next.gan), (stems.indexOf(day.gan) + 1) % 10);
  assert.equal(branches.indexOf(next.zhi), (branches.indexOf(day.zhi) + 1) % 12);
});

test('공망과 지지 관계(합·충·형·파·해·원진)를 바르게 읽는다', () => {
  assert.deepEqual(orbGongmang('甲', '子'), ['戌', '亥']);
  assert.deepEqual(orbGongmang('甲', '戌'), ['申', '酉']);
  assert.deepEqual(orbGongmang('癸', '未'), ['申', '酉']);
  assert.ok(orbBranchRelations('子', '午').includes('충(沖)'));
  assert.ok(orbBranchRelations('寅', '亥').includes('육합(六合)'));
  assert.ok(orbBranchRelations('巳', '申').includes('육합(六合)'));
  assert.ok(orbBranchRelations('辰', '辰').includes('자형(自刑)'));
  assert.ok(orbBranchRelations('子', '卯').includes('형(刑)'));
  assert.ok(orbBranchRelations('子', '未').includes('해(害)'));
  assert.deepEqual(orbBranchRelations('子', '寅'), []);
});

test('사주 정밀 자료: 원국·십신·용신·대운·세운·월운·일진·신살·공망·합충을 모두 담는다', () => {
  const profile = chatProfileToUserProfile(me, null, '제제');
  const brief = formatOrbSajuPrecise(profile, '제제', new Date('2026-11-27T10:00:00Z'));
  for (const label of ['사주 정밀 자료', '생년월일', '원국', '일간', '오행 분포', '십신 분포', '격국', '용신', '대운', '세운', '월운', '일진', '신살', '공망', '원국 합충형파해', '시기와의 관계']) {
    assert.ok(brief.includes(label), `${label} 항목이 있다`);
  }
  assert.match(brief, /1994-01-24 07:30 남성 양력/);
  // 원국 4주가 모두 한자+한글 표기로 들어간다.
  assert.match(brief, /년주 \S+\(/);
  assert.match(brief, /월주 \S+\(/);
  assert.match(brief, /일주 \S+\(/);
  assert.match(brief, /시주 \S+\(/);
  assert.match(brief, /丙午\(병오\) 세운/);
  assert.match(brief, /己亥\(기해\) 월운/);
  assert.ok(brief.length < 3600, `한 사람 분량은 지시문에 들어갈 만큼 짧다 (${brief.length})`);

  // 생년월일이 없으면 지어내지 않고 안내한다.
  const empty = formatOrbSajuPrecise({ basic: {} } as any, '민지');
  assert.match(empty, /생년월일이 없어 계산하지 못했습니다/);
  assert.match(empty, /지어내지 말고/);
});

test('궁합이면 두 사람 원국의 합충과 오행 상생을 나란히 비교한다', () => {
  const block = formatOrbSajuCompatibility(
    chatProfileToUserProfile(me, null, '제제'),
    chatProfileToUserProfile(partner, null, '제제'),
    '제제', '민지',
  );
  assert.match(block, /\[궁합 — 두 사람 원국 비교\]/);
  assert.match(block, /일간: 제제/);
  assert.match(block, /민지/);
  assert.match(block, /일지:/);
  assert.match(block, /두 원국 지지 관계:/);
  assert.match(block, /오행 우세:/);
  const missing = formatOrbSajuCompatibility(chatProfileToUserProfile(me, null, '제제'), { basic: {} } as any, '제제', '민지');
  assert.match(missing, /생년월일이 모두 있어야/);
});

test('지시문은 고른 대상의 정밀 사주를 담고, 마스터 루시가 사주와 카드를 교차하게 한다', () => {
  const brief = buildOrbProfileBrief([me, partner], 'profile-partner', '제제', new Date('2026-11-27T10:00:00Z'));
  assert.match(brief, /기준 대상: 민지/);
  assert.match(brief, /함께 보는 대상: 제제/);
  assert.match(brief, /세운/);
  assert.match(brief, /공망/);
  assert.match(brief, /\[궁합 — 두 사람 원국 비교\]/);
  const instruction = buildOrbLiveInstruction('제제', ORB_MASTERS[0].focus, ORB_MASTERS[0].greet, '', buildOrbMasterRules({ birthdate: true, birthtime: true }), brief);
  assert.ok(instruction.includes(brief), '정밀 사주가 지시문에 그대로 들어간다');
  assert.match(instruction, /마스터 루시/);
  assert.match(instruction, /카드 세 장은 자리\(과거·지금·앞으로\)대로 읽고/);
  assert.match(instruction, /오행·용신·대운과 교차/);
});

test('카드 선택 알림은 세 장의 방향·원소·수비학을 사주 흐름과 교차해 풀게 한다', () => {
  const cards = pickOrbCards(shuffleOrbDeck(), [1, 2, 3], 'shuffle');
  const message = orbCardPickMessage(cards);
  for (const card of cards) {
    assert.ok(message.includes(card.nameKo));
    assert.ok(message.includes(card.orientationKo));
  }
  assert.match(message, /정·역방향/);
  assert.match(message, /원소·메이저\/마이너·수비학/);
  assert.match(message, /사주 원국의 오행·용신·대운·세운/);
  assert.match(ORB_CARD_PICK_GUIDE, /사주 원국·대운과 교차/);
});

test('페이지 안내에는 4명의 마스터·주역 같은 구식 표현이 없고 마스터 루시를 안내한다', () => {
  const guide = getPageGuide('orb');
  const text = [guide.title, guide.intro, ...guide.steps, ...guide.tips.map(tip => tip.text), ...guide.uses.flatMap(use => [use.when, use.how])].join('\n');
  assert.match(text, /마스터 루시/);
  assert.doesNotMatch(text, /4명의 마스터|네 명의 마스터|사주·타로·점성·마음|15가지 운세 도구/);
  assert.doesNotMatch(text, /주역을 볼 때/);
  assert.match(text, /합충형파해/);
});
