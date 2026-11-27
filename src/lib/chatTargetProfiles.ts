import type { ChatTargetProfile } from '../types/chatProfile';
import type { ProfileBasic, UserProfile } from './sharedState';
import { safeLocalStorage } from '../utils/safeStorage';

/**
 * 대화창·오브가 함께 쓰는 '상담 대상 프로필' 목록 (1~4인).
 *
 * 루시 채팅(LucyStandalonePage)과 오브(/voice)가 같은 저장소 키를 쓰므로, 어느 쪽에서
 * 프로필을 고치거나 추가해도 다른 쪽에서 그대로 이어진다.
 * 여기서는 계산만 하고(순수 함수), 저장은 saveChatTargetProfiles가 맡는다.
 */
export const CHAT_PROFILES_STORAGE_KEY = 'lucy_chat_active_profiles_permanent';
export const MAX_CHAT_PROFILES = 4;
/** 본인 프로필의 기본값 (루시 채팅과 같은 값). */
export const DEFAULT_CHAT_BIRTHDATE = '1994-01-24';

export function isSelfChatProfile(profile: ChatTargetProfile | null | undefined): boolean {
  return Boolean(profile && (profile.isMe || profile.relationship === '본인'));
}

/** 저장된 것이 없을 때 쓰는 본인 프로필 (앱 프로필의 사주 정보로 채운다). */
export function defaultSelfChatProfile(basic?: ProfileBasic | null, userDisplayName = '제제'): ChatTargetProfile {
  return {
    id: 'my-profile',
    isMe: true,
    name: userDisplayName,
    nickname: userDisplayName,
    birthdate: basic?.birthdate || DEFAULT_CHAT_BIRTHDATE,
    // 태어난 시간을 모르면 지어내지 않는다 (시주 없이 계산된다).
    birthtime: basic?.birthtime ?? '',
    gender: basic?.gender || 'male',
    birthCity: basic?.birthCity || '서울',
    lunarSolar: basic?.lunarSolar || 'solar',
    relationship: '본인',
  };
}

/** 저장소에서 읽은 값이 반쯤 깨져 있어도 화면이 멈추지 않게 최소한만 확인한다. */
function normalizeStoredProfile(profile: unknown, basic: ProfileBasic | null | undefined, userDisplayName: string): ChatTargetProfile | null {
  if (!profile || typeof profile !== 'object') return null;
  const raw = profile as Partial<ChatTargetProfile>;
  if (!raw.id || typeof raw.id !== 'string' || !raw.birthdate || typeof raw.birthdate !== 'string') return null;
  const self = isSelfChatProfile(raw as ChatTargetProfile);
  return {
    ...raw,
    id: raw.id,
    name: self ? userDisplayName : (raw.name || '이름 없음'),
    nickname: raw.nickname || raw.name || userDisplayName,
    birthdate: raw.birthdate || basic?.birthdate || DEFAULT_CHAT_BIRTHDATE,
    birthtime: raw.birthtime ?? (self ? basic?.birthtime ?? '' : ''),
    gender: raw.gender || 'other',
    birthCity: raw.birthCity || '서울',
    lunarSolar: raw.lunarSolar || 'solar',
    relationship: raw.relationship || (self ? '본인' : '가족'),
    isMe: self,
  };
}

/** 이 기기에 저장된 상담 대상 프로필 (없으면 본인 1인). */
export function loadChatTargetProfiles(input: { basic?: ProfileBasic | null; userDisplayName?: string } = {}): ChatTargetProfile[] {
  const userDisplayName = input.userDisplayName?.trim() || '제제';
  let stored: string | null = null;
  try { stored = safeLocalStorage.getItem(CHAT_PROFILES_STORAGE_KEY); } catch { stored = null; }
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const list = parsed
          .map(item => normalizeStoredProfile(item, input.basic, userDisplayName))
          .filter((item): item is ChatTargetProfile => Boolean(item))
          .slice(0, MAX_CHAT_PROFILES);
        if (list.length) return ensureSingleSelf(list);
      }
    } catch { /* 깨진 값은 버리고 기본 프로필로 시작한다. */ }
  }
  return [defaultSelfChatProfile(input.basic, userDisplayName)];
}

export function saveChatTargetProfiles(profiles: ChatTargetProfile[]): void {
  try { safeLocalStorage.setItem(CHAT_PROFILES_STORAGE_KEY, JSON.stringify(profiles)); } catch { /* 저장 실패는 상담을 막지 않는다. */ }
}

/** '본인'은 목록에 하나만, 1명만 남으면 그 사람이 '본인'이 된다. */
function ensureSingleSelf(profiles: ChatTargetProfile[]): ChatTargetProfile[] {
  if (profiles.length === 1) {
    const only = profiles[0];
    if (isSelfChatProfile(only)) return [{ ...only, isMe: true, relationship: '본인' }];
    return profiles;
  }
  let foundSelf = false;
  return profiles.map(profile => {
    if (!isSelfChatProfile(profile)) return { ...profile, isMe: false };
    if (!foundSelf) {
      foundSelf = true;
      return { ...profile, isMe: true, relationship: '본인' };
    }
    return { ...profile, isMe: false, relationship: '연인' };
  });
}

/** 프로필을 저장한다: 같은 id는 고치고, 새 id는 뒤에 붙인다 (최대 4명). */
export function upsertChatTargetProfile(profiles: ChatTargetProfile[], incoming: ChatTargetProfile): ChatTargetProfile[] {
  const profile: ChatTargetProfile = { ...incoming };
  const existingSelf = profiles.find(item => item.id !== profile.id && isSelfChatProfile(item));
  // 본인이 이미 있으면 새로 넣는 사람은 본인이 될 수 없다.
  if (existingSelf && isSelfChatProfile(profile)) {
    profile.isMe = false;
    profile.relationship = '연인';
  }
  const index = profiles.findIndex(item => item.id === profile.id);
  if (index >= 0) {
    const next = [...profiles];
    next[index] = profile;
    return ensureSingleSelf(next);
  }
  if (profiles.length >= MAX_CHAT_PROFILES) return profiles;
  return ensureSingleSelf([...profiles, profile]);
}

/** 프로필 하나를 뺀다. 마지막 한 명은 뺄 수 없다. */
export function removeChatTargetProfile(profiles: ChatTargetProfile[], profileId: string): ChatTargetProfile[] {
  if (profiles.length <= 1) return profiles;
  const remaining = profiles.filter(profile => profile.id !== profileId);
  if (!remaining.length) return profiles;
  return ensureSingleSelf(remaining);
}

/** 지금 상담의 기준이 되는 프로필 (없으면 첫 사람). */
export function resolveChatPrimaryProfile(profiles: ChatTargetProfile[], activeProfileId?: string): ChatTargetProfile | null {
  if (!profiles?.length) return null;
  if (profiles.length === 1) return profiles[0];
  return profiles.find(profile => profile.id === activeProfileId) || profiles[0];
}

/** 기준 프로필을 상담 엔진이 읽는 UserProfile 모양으로 바꾼다 (사주 계산·도구 공용). */
export function chatProfileToUserProfile(
  profile: ChatTargetProfile | null | undefined,
  base?: UserProfile | null,
  userDisplayName = '제제',
): UserProfile {
  if (!profile) return base || { basic: {} };
  const self = isSelfChatProfile(profile);
  const displayName = self ? userDisplayName : (profile.name || profile.nickname || '상담 대상');
  return {
    ...(base || {}),
    basic: {
      ...(base?.basic || {}),
      name: displayName,
      nickname: displayName,
      birthdate: profile.birthdate,
      birthtime: profile.birthtime,
      gender: profile.gender,
      birthCity: profile.birthCity,
      lunarSolar: profile.lunarSolar || 'solar',
      isLeapMonth: profile.isLeapMonth,
    },
  };
}

/** 앱 프로필(볼트)에만 있는 사주 정보를 비어 있는 칸에만 채운다 (사용자가 고친 값은 그대로). */
export function fillSelfProfileFromBasic(
  profiles: ChatTargetProfile[],
  basic?: ProfileBasic | null,
  userDisplayName = '제제',
): ChatTargetProfile[] {
  if (!profiles?.length) return profiles;
  const self = profiles.find(isSelfChatProfile);
  if (!self) return profiles;
  const next = {
    ...self,
    name: userDisplayName || self.name,
    nickname: userDisplayName || self.nickname,
    birthdate: self.birthdate || basic?.birthdate || '',
    birthtime: self.birthtime || basic?.birthtime || '',
    gender: self.gender || basic?.gender || 'male',
    birthCity: self.birthCity || basic?.birthCity || '서울',
    lunarSolar: self.lunarSolar || basic?.lunarSolar || 'solar',
  };
  const unchanged = next.name === self.name && next.nickname === self.nickname
    && next.birthdate === self.birthdate && next.birthtime === self.birthtime
    && next.gender === self.gender && next.birthCity === self.birthCity && next.lunarSolar === self.lunarSolar;
  if (unchanged) return profiles;
  return profiles.map(profile => (isSelfChatProfile(profile) ? next : profile));
}
