/**
 * =========================================================================
 * PRISM & LUCY PRO - Unbreakable Profile Vault Engine
 * =========================================================================
 * 10중 다중 백업 및 무손실 병합 알고리즘을 통해, 브라우저 업데이트,
 * PWA 서비스워커 갱신, 캐시 새로고침이 발생하더라도 사용자의 소중한
 * 프로필(이름, 닉네임, 생년월일, 성별, 사주·운명, 심리, 예술 취향 등)이
 * 절대 유실되거나 초기화되지 않도록 영구 보존합니다.
 */

import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';
import { type UserProfile, mergeUserProfiles } from './sharedState';

export const PROFILE_VAULT_KEYS = [
  'prism_user_profile',
  'prism_user_profile_vault',
  'prism_user_profile_backup_v1',
  'prism_user_profile_backup_v2',
  'prism_user_profile_secure',
  'prism_user_profile_cloud_cache',
  'lucy_user_profile_v1',
  'lucy_user_profile_permanent',
  'prism_soul_profile_master',
] as const;

export const DEDICATED_AVATAR_KEY = 'prism_user_avatar_permanent';
export const DEDICATED_AVATAR_BACKUP = 'prism_user_avatar_backup';
export const DEDICATED_AVATAR_SESSION = 'prism_user_avatar_session';

/**
 * 전용 불변 사진 금고 및 다중 볼트에서 유효한 프로필 사진을 탐색하여 반환
 */
export function getPermanentAvatar(): string {
  try {
    // 1. 전용 불변 영구 스토리지 탐색
    const perm = safeLocalStorage.getItem(DEDICATED_AVATAR_KEY);
    if (perm && typeof perm === 'string' && perm.trim().length > 10) {
      return perm.trim();
    }
  } catch (_) {}

  try {
    // 2. 보조 백업 스토리지 탐색
    const backup = safeLocalStorage.getItem(DEDICATED_AVATAR_BACKUP);
    if (backup && typeof backup === 'string' && backup.trim().length > 10) {
      return backup.trim();
    }
  } catch (_) {}

  try {
    // 3. 세션 스토리지 탐색
    const sessionAv = safeSessionStorage.getItem(DEDICATED_AVATAR_SESSION);
    if (sessionAv && typeof sessionAv === 'string' && sessionAv.trim().length > 10) {
      return sessionAv.trim();
    }
  } catch (_) {}

  // 4. 기존 9개 다중 금고 내 저장된 유효 avatarUrl 정밀 탐색
  for (const key of PROFILE_VAULT_KEYS) {
    try {
      const raw = safeLocalStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        const av = parsed?.basic?.avatarUrl;
        if (av && typeof av === 'string' && av.trim().length > 10) {
          // 탐색된 유효 사진을 전용 영구 저장소로 자가 복구 동기화
          try {
            safeLocalStorage.setItem(DEDICATED_AVATAR_KEY, av.trim());
            safeLocalStorage.setItem(DEDICATED_AVATAR_BACKUP, av.trim());
          } catch (_) {}
          return av.trim();
        }
      }
    } catch (_) {}
  }

  return '';
}

/**
 * 프로필 사진을 영구 불변 전용 금고 3곳에 즉시 기록
 */
export function setPermanentAvatar(avatarUrl: string): void {
  if (!avatarUrl || typeof avatarUrl !== 'string' || avatarUrl.trim().length < 10) return;
  const clean = avatarUrl.trim();
  try {
    safeLocalStorage.setItem(DEDICATED_AVATAR_KEY, clean);
    safeLocalStorage.setItem(DEDICATED_AVATAR_BACKUP, clean);
    safeSessionStorage.setItem(DEDICATED_AVATAR_SESSION, clean);
  } catch (_) {}
}

/**
 * 사용자가 '프로필 사진 삭제' 버튼을 명시적으로 눌렀을 때만 금고 비우기
 */
export function clearPermanentAvatar(): void {
  try {
    safeLocalStorage.removeItem(DEDICATED_AVATAR_KEY);
    safeLocalStorage.removeItem(DEDICATED_AVATAR_BACKUP);
    safeSessionStorage.removeItem(DEDICATED_AVATAR_SESSION);
  } catch (_) {}
}

/**
 * 모든 로컬 저장소 키에서 프로필을 탐색하고 무손실 병합하여 최상의 복원본 반환
 */
export function loadProfileFromAllVaults(): UserProfile | undefined {
  let merged: UserProfile | undefined = undefined;

  for (const key of PROFILE_VAULT_KEYS) {
    try {
      const raw = safeLocalStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as UserProfile;
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          merged = mergeUserProfiles(merged, parsed);
        }
      }
    } catch (_) {}
  }

  // SessionStorage 금고도 추가 확인
  try {
    const sessionRaw = safeSessionStorage.getItem('prism_user_profile_session_vault');
    if (sessionRaw) {
      const sessionParsed = JSON.parse(sessionRaw) as UserProfile;
      if (sessionParsed && typeof sessionParsed === 'object') {
        merged = mergeUserProfiles(merged, sessionParsed);
      }
    }
  } catch (_) {}

  // 의미 있는 데이터가 최소 1개라도 존재하는지 확인
  const isPopulated = merged && (
    merged.basic?.name ||
    merged.basic?.nickname ||
    merged.basic?.birthdate ||
    merged.basic?.avatarUrl ||
    Object.keys(merged.basic || {}).length > 0 ||
    Object.keys(merged.fate || {}).length > 0 ||
    Object.keys(merged.psych || {}).length > 0 ||
    Object.keys(merged.music || {}).length > 0 ||
    Object.keys(merged.art || {}).length > 0
  );

  const permAvatar = getPermanentAvatar();

  if (!isPopulated || !merged) {
    if (permAvatar) {
      return {
        basic: {
          nickname: '제제',
          avatarUrl: permAvatar,
        },
      };
    }
    return undefined;
  }

  if (!merged.basic) merged.basic = {};

  // 🛡️ 프로필 사진 자가 치유(Self-Healing): 금고에 사진이 비어있으면 영구 전용 금고에서 복원
  if (!merged.basic.avatarUrl || merged.basic.avatarUrl.trim().length === 0) {
    if (permAvatar) {
      merged.basic.avatarUrl = permAvatar;
    }
  } else if (merged.basic.avatarUrl && merged.basic.avatarUrl.trim().length > 10) {
    setPermanentAvatar(merged.basic.avatarUrl);
  }

  // 🛡️ 닉네임 불변 원칙: 실명('박주형'), '여행자', '사용자' 또는 공백으로 오염된 경우 무조건 '제제'로 자가 치유
  const loadedNick = merged.basic.nickname?.trim();
  if (!loadedNick || loadedNick === '여행자' || loadedNick === '사용자' || loadedNick === '박주형') {
    merged.basic.nickname = '제제';
  }

  return merged;
}

/**
 * 프로필을 모든 다중 금고에 무손실 안전하게 저장
 */
export function saveProfileToAllVaults(profile: UserProfile | undefined): void {
  if (!profile || typeof profile !== 'object' || Object.keys(profile).length === 0) return;

  try {
    const existing = loadProfileFromAllVaults();
    // 기존에 있던 비어있지 않은 데이터를 빈 값으로 덮어쓰지 않도록 무손실 병합 (신규 저장 프로필 우선)
    const finalMerged = mergeUserProfiles(existing, profile, true);
    if (!finalMerged || Object.keys(finalMerged).length === 0) return;

    if (!finalMerged.basic) finalMerged.basic = {};
    const inputNick = profile.basic?.nickname?.trim() || finalMerged.basic?.nickname?.trim();
    // 🛡️ 닉네임 영구 고정: '박주형', '여행자', '사용자' 또는 공백은 무조건 '제제'로 저장
    finalMerged.basic.nickname = (inputNick && inputNick !== '여행자' && inputNick !== '사용자' && inputNick !== '박주형') 
      ? inputNick 
      : '제제';

    // 🛡️ 태어난 시간(birthtime) 등 사용자가 직접 수정한 필드는 빈 문자열이나 새 값 모두 100% 반영
    if (profile.basic && typeof profile.basic.birthtime === 'string') {
      finalMerged.basic.birthtime = profile.basic.birthtime;
    }
    if (profile.basic && typeof profile.basic.birthdate === 'string' && profile.basic.birthdate) {
      finalMerged.basic.birthdate = profile.basic.birthdate;
    }
    if (profile.basic && profile.basic.lunarSolar) {
      finalMerged.basic.lunarSolar = profile.basic.lunarSolar;
    }

    // 🛡️ 프로필 사진(avatarUrl) 영구 보존 및 명시적 삭제 구분
    const isExplicitRemoval = (profile as any)?.__explicitRemoveAvatar === true || 
      (profile.basic && profile.basic.avatarUrl === '' && (profile as any)?.__isAvatarAction === true);
    
    if (isExplicitRemoval) {
      finalMerged.basic.avatarUrl = '';
      clearPermanentAvatar();
    } else {
      const incomingAvatar = profile.basic?.avatarUrl?.trim();
      const existingAvatar = existing?.basic?.avatarUrl?.trim();
      const permAvatar = getPermanentAvatar();

      if (incomingAvatar && incomingAvatar.length > 10) {
        finalMerged.basic.avatarUrl = incomingAvatar;
        setPermanentAvatar(incomingAvatar);
      } else if (existingAvatar && existingAvatar.length > 10) {
        finalMerged.basic.avatarUrl = existingAvatar;
        setPermanentAvatar(existingAvatar);
      } else if (permAvatar && permAvatar.length > 10) {
        finalMerged.basic.avatarUrl = permAvatar;
      }
    }

    const nowTs = Date.now();
    finalMerged.completedAt = nowTs;
    (finalMerged as any).updatedAt = nowTs;

    const serialized = JSON.stringify(finalMerged);

    // 1. 모든 LocalStorage 금고에 저장
    for (const key of PROFILE_VAULT_KEYS) {
      try {
        safeLocalStorage.setItem(key, serialized);
      } catch (_) {}
    }
    try {
      safeLocalStorage.setItem('userProfile', serialized);
      safeLocalStorage.setItem('lucy_user_profile', serialized);
    } catch (_) {}

    // 2. SessionStorage 금고에 저장
    try {
      safeSessionStorage.setItem('prism_user_profile_session_vault', serialized);
    } catch (_) {}
  } catch (e) {
    console.warn('[ProfileVault] Save error:', e);
  }
}
