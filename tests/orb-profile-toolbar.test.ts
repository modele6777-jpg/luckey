/**
 * 🔮 오브 페이지 입력창 위 사주 프로필·추천질문 창 회귀 검사.
 * 사용자 지시 (2026-11-27): "오브페이지에도 표시된것처럼 사주프로필과 추천질문리스트 창이 나오게 해줘",
 *  + "그리고 해당 사주 프로필을 기반으로 상담해줘".
 * 기대:
 *  - 오브 입력창 위에 [👤 프로필명] [+] [✨] + 추천 질문 마퀴가 한 줄로 놓인다.
 *  - 고른 프로필(본인 또는 궁합 상대)의 사주가 오브 상담 지시문·계산 도구에 그대로 쓰인다.
 *  - 상담 중 대상이 바뀌면 진행 중인 세션에 새 사주를 알린다.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  chatProfileToUserProfile, defaultSelfChatProfile, fillSelfProfileFromBasic, loadChatTargetProfiles,
  removeChatTargetProfile, resolveChatPrimaryProfile, upsertChatTargetProfile,
} from '../src/lib/chatTargetProfiles.ts';
import type { ChatTargetProfile } from '../src/types/chatProfile.ts';
import { buildOrbProfileBrief, buildOrbProfileChangeNote, orbProfileKey, orbProfileLabel, orbToolProfiles } from '../src/lib/orb/orbProfile.ts';
import { buildOrbLiveInstruction } from '../src/lib/lucyLiveBrief.ts';
import { createOrbToolExecutor } from '../src/lib/orb/orbToolExecutor.ts';
import { calculateDetailedSaju } from '../src/lib/sajuAnalysis.ts';

const component = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');
const host = readFileSync(new URL('../src/components/lucy/OrbCounselHost.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/components/lucy/lucy-orb-counsel.css', import.meta.url), 'utf8');
const liveSession = readFileSync(new URL('../src/lib/geminiLiveSession.ts', import.meta.url), 'utf8');
const executorSource = readFileSync(new URL('../src/lib/orb/orbToolExecutor.ts', import.meta.url), 'utf8');

const me: ChatTargetProfile = {
  id: 'my-profile', isMe: true, name: '제제', nickname: '제제', relationship: '본인',
  birthdate: '1994-01-24', birthtime: '07:30', gender: 'male', birthCity: '서울', lunarSolar: 'solar',
};
const partner: ChatTargetProfile = {
  id: 'profile-partner', name: '민지', nickname: '민지', relationship: '연인',
  birthdate: '1996-05-15', birthtime: '12:00', gender: 'female', birthCity: '부산', lunarSolar: 'solar',
};

const dayPillarOf = (profile: ChatTargetProfile): string => {
  const saju = calculateDetailedSaju(chatProfileToUserProfile(profile, null, '제제'));
  assert.ok(saju, '사주가 계산된다');
  return saju!.pillars.day.full;
};

test('상담 대상 프로필은 저장된 것이 없으면 앱 프로필의 사주로 시작한다', () => {
  const profiles = loadChatTargetProfiles({
    basic: { birthdate: '1994-01-24', birthtime: '07:30', gender: 'male', birthCity: '서울', lunarSolar: 'solar' },
    userDisplayName: '제제',
  });
  assert.equal(profiles.length, 1);
  assert.equal(profiles[0].isMe, true);
  assert.equal(profiles[0].birthdate, '1994-01-24');
  assert.equal(profiles[0].birthtime, '07:30');
  assert.equal(profiles[0].name, '제제', '실명이 아니라 닉네임으로 보여 준다');
});

test('프로필을 추가해도 본인은 한 명이고, 기준 대상은 고른 사람이다', () => {
  const withPartner = upsertChatTargetProfile([me], partner);
  assert.equal(withPartner.length, 2);
  assert.equal(withPartner.filter(profile => profile.isMe).length, 1);

  // 이미 본인이 있으면 새로 넣는 사람은 '본인'이 될 수 없다.
  const secondSelf = upsertChatTargetProfile(withPartner, { ...partner, id: 'profile-self2', name: '또 나', isMe: true, relationship: '본인' });
  assert.equal(secondSelf.length, 3);
  assert.equal(secondSelf.filter(profile => profile.isMe).length, 1);
  assert.equal(secondSelf[2].relationship, '연인');

  assert.equal(resolveChatPrimaryProfile(withPartner, 'profile-partner')?.name, '민지');
  assert.equal(resolveChatPrimaryProfile(withPartner, 'my-profile')?.name, '제제');
  assert.equal(resolveChatPrimaryProfile(withPartner, '없는-id')?.name, '제제', '없는 id면 첫 사람으로 돌아간다');
});

test('프로필을 빼도 마지막 한 명은 남고, 남은 한 명이 본인이 된다', () => {
  const withPartner = upsertChatTargetProfile([me], partner);
  const onlyMe = removeChatTargetProfile(withPartner, 'profile-partner');
  assert.equal(onlyMe.length, 1);
  assert.equal(onlyMe[0].id, 'my-profile');
  assert.equal(removeChatTargetProfile(onlyMe, 'my-profile').length, 1, '혼자 남으면 뺄 수 없다');
});

test('고른 프로필의 사주가 상담 도구가 읽는 프로필이 된다', () => {
  const withPartner = upsertChatTargetProfile([me], partner);
  const forPartner = orbToolProfiles(withPartner, 'profile-partner', { basic: { name: '박주형' } }, '제제');
  assert.equal(forPartner.profile?.basic?.birthdate, '1996-05-15');
  assert.equal(forPartner.profile?.basic?.birthtime, '12:00');
  assert.equal(forPartner.profile?.basic?.gender, 'female');
  assert.equal(forPartner.profile?.basic?.lunarSolar, 'solar');
  // 궁합 상대 한 명을 함께 넘긴다 (나).
  assert.equal(forPartner.partnerProfile?.basic?.birthdate, '1994-01-24');

  const forMe = orbToolProfiles(withPartner, 'my-profile', null, '제제');
  assert.equal(forMe.profile?.basic?.birthdate, '1994-01-24');
  assert.equal(forMe.partnerProfile?.basic?.birthdate, '1996-05-15');
  assert.equal(orbProfileLabel(resolveChatPrimaryProfile([partner], 'profile-partner'), '제제'), '민지');
  assert.equal(orbProfileLabel(null, '제제'), '제제');
});

test('지시문에 넣는 사주 요약은 고른 대상의 이름·생년월일·사주 8자를 담는다', () => {
  const withPartner = upsertChatTargetProfile([me], partner);
  const brief = buildOrbProfileBrief(withPartner, 'profile-partner', '제제');
  assert.match(brief, /기준 대상: 민지/);
  assert.match(brief, /함께 보는 대상: 제제/);
  assert.match(brief, /1996-05-15/);
  assert.match(brief, /양력/);
  assert.ok(brief.includes(dayPillarOf(partner)), '궁합 상대의 일주가 들어간다');
  assert.ok(brief.includes(dayPillarOf(me)), '함께 보는 사람의 사주도 들어간다');
  assert.match(brief, /지어내지 마세요/);

  const single = buildOrbProfileBrief([me], 'my-profile', '제제');
  assert.match(single, /1994-01-24/);
  assert.ok(single.includes(dayPillarOf(me)));
  assert.doesNotMatch(single, /함께 보는 대상/);
});

test('상담 중 대상이 바뀌면 새 사주를 한 차례 알린다', () => {
  const withPartner = upsertChatTargetProfile([me], partner);
  const note = buildOrbProfileChangeNote(withPartner, 'profile-partner', '제제');
  assert.match(note, /상담 대상이 바뀌었습니다/);
  assert.match(note, /민지/);
  assert.match(note, /1996-05-15/);
  assert.ok(note.includes(dayPillarOf(partner)));
  assert.match(note, /소리 내어 읽지 말고/);
  assert.ok(note.length < 700, '음성 한 차례로 보낼 만큼 짧다');
});

test('오브 마스터 지시문에 그 사주가 실제로 들어간다', () => {
  const brief = buildOrbProfileBrief([me], 'my-profile', '제제');
  const instruction = buildOrbLiveInstruction('제제', '차분한 마스터', '안녕하세요', '', '도구 규칙', brief);
  assert.ok(instruction.includes(brief), '고른 프로필의 사주가 지시문에 그대로 들어간다');
  assert.ok(instruction.includes(dayPillarOf(me)));
  assert.match(instruction, /이 사주는 지금 선택된 상담 대상자의 것입니다/);
  // 사주가 없으면 그 칸도 없다.
  assert.doesNotMatch(buildOrbLiveInstruction('제제', '', '', '', '도구 규칙'), /상담 대상자의 것입니다/);
  assert.match(liveSession, /buildOrbLiveInstruction\([^)]*handlers\.orb\.profile \|\| ''\)/);
});

test('상담 도중 프로필을 바꾸면 도구는 새 사주로 다시 계산한다', async () => {
  const seen: Array<string | undefined> = [];
  const fakeEngine = {
    runDeterministicEngine: (args: { profile?: { basic?: { birthdate?: string } } | null; focusTools?: string[] }) => {
      const toolId = args.focusTools?.[0] || 'saju';
      const birthdate = args.profile?.basic?.birthdate;
      if (toolId === 'saju') seen.push(birthdate);
      const calculated = toolId !== 'saju' || Boolean(birthdate);
      return {
        tools: {
          [toolId]: calculated
            ? { toolId, status: 'calculated', data: { birthdate: birthdate || null, toolId } }
            : { toolId, status: 'skipped' },
        },
        calculatedAtKst: '2026-11-27 18:00',
      };
    },
  };
  const loader = {
    load: async () => ({
      engine: fakeEngine as never,
      slim: { slimToolDataToBudget: (data: unknown) => data } as never,
      cards: { buildKnowledgeCards: () => [] } as never,
    }),
  };
  const executor = createOrbToolExecutor({ profile: null, loader });
  const before = await executor.execute({ name: 'run_divination_tool', args: { tool: 'saju' } });
  assert.equal(before.error, 'needs_birthdate', '생년월일이 없으면 사주 도구는 계산하지 않는다');

  // 상담 도중 다른 대상의 프로필로 바뀐다.
  executor.setProfile(chatProfileToUserProfile(partner, null, '제제'), null);
  const after = await executor.execute({ name: 'run_divination_tool', args: { tool: 'saju' } });
  assert.equal(after.ok, true, '새 프로필로 바로 계산된다');
  assert.deepEqual(after.data, { birthdate: '1996-05-15', toolId: 'saju' });
  assert.deepEqual(seen, ['1996-05-15'], '새 사람의 생년월일로 계산한다');

  // 같은 프로필을 다시 넣어도 계산해 둔 값을 그대로 쓴다.
  executor.setProfile(chatProfileToUserProfile(partner, null, '제제'), null);
  const reused = await executor.execute({ name: 'run_divination_tool', args: { tool: 'saju' } });
  assert.equal(reused.cached, true);
  const other = await executor.execute({ name: 'run_divination_tool', args: { tool: 'iching' } });
  assert.equal(other.error, 'unknown_tool', '마스터 루시는 사주만 계산한다');
});

test('프로필 열쇠는 대상이 바뀌면 달라진다 (상담 중 갱신 판단용)', () => {
  const withPartner = upsertChatTargetProfile([me], partner);
  assert.notEqual(orbProfileKey(withPartner, 'my-profile'), orbProfileKey(withPartner, 'profile-partner'));
  const moved = upsertChatTargetProfile(withPartner, { ...partner, birthtime: '09:00' });
  assert.notEqual(orbProfileKey(withPartner, 'profile-partner'), orbProfileKey(moved, 'profile-partner'), '생시가 바뀌어도 다시 알린다');
  assert.equal(orbProfileKey([], undefined), 'none');
});

test('앱 프로필의 사주가 비어 있으면 저장된 프로필의 빈 칸만 채운다', () => {
  const bare = defaultSelfChatProfile({}, '제제');
  assert.equal(bare.birthdate, '1994-01-24');
  assert.equal(bare.birthtime, '', '모르는 생시를 지어내지 않는다');
  const filled = fillSelfProfileFromBasic([{ ...bare, birthdate: '' }], { birthdate: '1994-01-24', birthtime: '07:30', gender: 'male' }, '제제');
  assert.equal(filled[0].birthdate, '1994-01-24');
  assert.equal(filled[0].birthtime, '07:30');
  const customized = fillSelfProfileFromBasic([me], { birthdate: '1990-02-02' }, '제제');
  assert.equal(customized[0].birthdate, '1994-01-24', '사용자가 넣은 생년월일은 덮어쓰지 않는다');
});

test('오브 입력창 위에 프로필·추가·추천질문 버튼이 한 줄로 붙는다', () => {
  // 버튼 3개는 마퀴와 같은 줄에 있고, 마퀴가 남은 폭을 쓴다.
  assert.match(component, /<div className="lucy-orb-toolbar">/);
  assert.match(component, /className="lucy-orb-profile-pill"/);
  assert.match(component, /사주 프로필 \$\{profileLabel\} 수정/);
  assert.match(component, /aria-label="궁합·상담 대상자 추가"/);
  assert.match(component, /<LucyLibraryTrigger[\s\S]*?stateKey="orb:library:prompt"[\s\S]*?<\/LucyLibraryTrigger>/);
  assert.match(component, /<OrbQuestionMarquee questions=\{lucyQuestions\} onSelect=\{setDraft\} \/>/);
  assert.match(component, /<LucyLibraryDialogs sessionKey="orb:library" isLight=\{false\} onSelectPrompt=\{handleLibraryPrompt\} \/>/);
  // 상담 중(라이브)에도 도크 구성은 그대로다.
  assert.match(component, /\{!talkPressed && \(\s*<div className="lucy-orb-toolbar">/);
  assert.match(css, /\.lucy-orb-toolbar \{[^}]*display:\s*flex/);
  assert.match(css, /\.lucy-orb-toolbar > \.lucy-orb-lucy-questions \{[^}]*flex:\s*1 1 auto[^}]*min-width:\s*0/);
  assert.match(css, /\.lucy-orb-dock \.lucy-orb-profile-pill \{[^}]*max-width:\s*96px/);
  assert.match(css, /\.lucy-orb-dock \.lucy-orb-profile-pill span \{[^}]*text-overflow:\s*ellipsis/);
  // 2인 이상이면 기준 대상을 바꾸는 칩 줄이 입력창 위에 붙는다.
  assert.match(component, /lucy-orb-profile-chips/);
  assert.match(component, /onSelectProfile\?\.\(item\.id\)/);
  assert.match(css, /\.lucy-orb-profile-chips \{[^}]*overflow-x:\s*auto/);
});

test('오브 페이지가 고른 프로필을 상담 엔진에 넘기고, 바뀌면 세션에 알린다', () => {
  // 페이지: 프로필 상태·저장·선택·추가/수정 창
  assert.match(host, /loadChatTargetProfiles\(\{/);
  assert.match(host, /<ChatProfileModal[\s\S]*?totalProfilesCount=\{profiles\.length\}/);
  assert.match(host, /profiles=\{profiles\}/);
  assert.match(host, /profileContext=\{profileContext\}/);
  assert.match(host, /profileChangeNote=\{profileChangeNote\}/);
  assert.match(host, /profile=\{profile\}/);
  assert.match(host, /partnerProfile=\{partnerProfile\}/);
  assert.match(host, /orbToolProfiles\(profiles, activeProfileId, baseProfile, nickname\)/);
  assert.match(host, /buildOrbProfileBrief\(profiles, activeProfileId, nickname\)/);
  assert.match(host, /saveChatTargetProfiles\(next\)/);

  // 컴포넌트: 세션 지시문·도구·진행 중 갱신
  assert.match(component, /profile: profileContext,/);
  assert.match(component, /createOrbToolExecutor\(\{\s*profile,\s*partnerProfile,/);
  assert.match(component, /executorRef\.current\?\.setProfile\(profile, partnerProfile\)/);
  assert.match(component, /session\.sendText\(profileChangeNote, true\)/);
  assert.match(component, /profileKeyRef\.current = profileKey;/);

  // 도구 실행기: 프로필을 갈아 끼우면 저장해 둔 계산값을 비운다
  assert.match(executorSource, /partnerProfile\?: UserProfile \| null;/);
  assert.match(executorSource, /setProfile\(profile: UserProfile \| null, partnerProfile: UserProfile \| null = null\)/);
  assert.match(executorSource, /if \(changed\) cache\.clear\(\);/);
  assert.match(executorSource, /partnerProfile: currentPartner,/);
});
