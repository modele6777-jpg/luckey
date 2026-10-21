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
    Object.keys(merged.basic || {}).length > 0 ||
    Object.keys(merged.fate || {}).length > 0 ||
    Object.keys(merged.psych || {}).length > 0 ||
    Object.keys(merged.music || {}).length > 0 ||
    Object.keys(merged.art || {}).length > 0
  );

  if (!isPopulated || !merged) return undefined;

  // 🛡️ 닉네임 불변 원칙: 실명('박주형'), '여행자', '사용자' 또는 공백으로 오염된 경우 무조건 '제제'로 자가 치유
  if (!merged.basic) merged.basic = {};
  const loadedNick = merged.basic.nickname?.trim();
  if (!loadedNick || loadedNick === '여행자' || loadedNick === '사용자' || loadedNick === '박주형') {
    merged.basic.nickname = '제제';
    // 오염된 로컬 9개 볼트 및 세션 키 즉시 자가 치유(Self-Healing) 동기화
    try {
      const cleanedSerialized = JSON.stringify(merged);
      for (const key of PROFILE_VAULT_KEYS) {
        safeLocalStorage.setItem(key, cleanedSerialized);
      }
      safeSessionStorage.setItem('prism_user_profile_session_vault', cleanedSerialized);
    } catch (_) {}
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
