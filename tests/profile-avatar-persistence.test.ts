import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { safeLocalStorage, safeSessionStorage } from '../src/utils/safeStorage';
import { getPermanentAvatar, loadProfileFromAllVaults, saveProfileToAllVaults, setPermanentAvatar, PROFILE_VAULT_KEYS } from '../src/lib/profileVault';
const oldPhoto = 'data:image/jpeg;base64,OLD_PROFILE_PHOTO';
const newPhoto = 'data:image/jpeg;base64,NEW_PROFILE_PHOTO';
beforeEach(() => { safeLocalStorage.clear(); safeSessionStorage.clear(); });
test('new upload survives stale profile backups and later cloud profile saves', () => {
  saveProfileToAllVaults({ basic: { avatarUrl: oldPhoto } });
  setPermanentAvatar(newPhoto);
  assert.equal(loadProfileFromAllVaults()?.basic?.avatarUrl, newPhoto);
  saveProfileToAllVaults({ basic: { avatarUrl: oldPhoto, nickname: '새 닉네임' } });
  assert.equal(getPermanentAvatar(), newPhoto);
  assert.equal(loadProfileFromAllVaults()?.basic?.nickname, '새 닉네임');
  for (const key of PROFILE_VAULT_KEYS) assert.equal(JSON.parse(safeLocalStorage.getItem(key)!).basic.avatarUrl, newPhoto);
});
test('photo survives empty updates and a same-day reload from the saved vaults', () => {
  saveProfileToAllVaults({ basic: { avatarUrl: newPhoto } });
  saveProfileToAllVaults({ basic: { avatarUrl: '' } });
  safeSessionStorage.clear();
  assert.equal(loadProfileFromAllVaults()?.basic?.avatarUrl, newPhoto);
});
test('a past removal flag cannot delete a newly uploaded photo', () => {
  saveProfileToAllVaults({ basic: { avatarUrl: oldPhoto } });
  saveProfileToAllVaults({ basic: { avatarUrl: '' }, __explicitRemoveAvatar: true, __isAvatarAction: true } as any);
  assert.equal(getPermanentAvatar(), '');
  setPermanentAvatar(newPhoto);
  saveProfileToAllVaults({ basic: { avatarUrl: newPhoto }, __explicitRemoveAvatar: true, __isAvatarAction: true } as any);
  const profile = loadProfileFromAllVaults() as any;
  assert.equal(profile.basic.avatarUrl, newPhoto);
  assert.equal(profile.__explicitRemoveAvatar, undefined);
  assert.equal(profile.__isAvatarAction, undefined);
});
