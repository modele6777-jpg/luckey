import { DuoWorkspace } from '@/components/layout/DuoWorkspace';
import { useWideWorkspace } from '@/hooks/useWideWorkspace';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  User, Star, Music, Brain, Palette,
  ChevronRight, ChevronLeft, Check, Save, ArrowLeft, Sparkles,
  Camera, Upload, RotateCcw
} from 'lucide-react';
import { useApp, getPersistentUserProfile, setPersistentUserProfile } from '@/contexts/AppContext';
import { loadProfileFromAllVaults, saveProfileToAllVaults, getPermanentAvatar, setPermanentAvatar, clearPermanentAvatar } from '@/lib/profileVault';
import { type UserProfile, mergeUserProfiles } from '@/lib/sharedState';
import { compressImageToDataUrl } from '@/utils/imageCompress';
import { APP_VERSION, fetchDeployedAppVersion, compareVersions } from '@/lib/appVersion';
import { forceAppUpgradeAndReload } from '@/lib/prismSync';
import { SajuCardView } from '@/components/SajuCardView';
import { NatalChartCardView } from '@/components/NatalChartCardView';
import type { RelationshipEntry } from '@/lib/sharedState';
import { auth, db, doc, getDocFromServer, setDoc, serverTimestamp } from '@/lib/firebase';
import { cleanFirestoreData, unpackAndHydrateLocalStorage } from '@/lib/sharedStateSync';
import { generatePairingCode, importWithPairingCode, getPairedVaultId, setPairedVaultId } from '@/lib/serverSyncClient';

const SECTIONS = [
  { id: 'basic', label: '기본 정보', icon: User, color: 'oklch(0.75 0.12 50)', desc: '이름 · 생년월일 · 성별' },
  { id: 'fate', label: '운명 관심사', icon: Star, color: 'oklch(0.75 0.12 50)', desc: '사주 · 타로 · 별자리 관심사' },
  { id: 'music', label: '음악 취향', icon: Music, color: 'oklch(0.70 0.18 295)', desc: '장르 · 악기 · 창의 목표' },
  { id: 'psych', label: '심리 · 결정', icon: Brain, color: 'oklch(0.72 0.18 55)', desc: 'MBTI · 상담 스타일' },
  { id: 'art', label: '예술 취향', icon: Palette, color: 'oklch(0.65 0.18 240)', desc: '화풍 · 색감 · 선호 매체' },
];

const FATE_INTERESTS = ['사주', '타로', '별자리', '꿈해몽', '수비학', '관상'];
const MUSIC_GENRES = ['K-Pop', '팝', '재즈', '클래식', 'R&B', '힙합', '인디', '락', 'EDM', '포크', '발라드', '트로트'];
const INSTRUMENTS = ['피아노', '기타', '드럼', '베이스', '바이올린', '첼로', '플루트', '보컬', '작곡', '프로듀싱'];
const MBTI_LIST = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
const ART_STYLES = ['인상주의', '추상화', '팝아트', '미니멀리즘', '초현실주의', '입체파', '사진', '일러스트', '동양화', '조각'];
const ART_COLORS = ['따뜻한 톤', '차가운 톤', '파스텔', '모노톤', '비비드', '어스 톤', '네온'];

function TagSelector({ options, selected, onChange, color }: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  color: string;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(s => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: active ? color + '30' : 'oklch(0.15 0.015 270)',
              border: `1px solid ${active ? color + '60' : 'oklch(0.25 0.01 270)'}`,
              color: active ? color : 'oklch(0.55 0.01 270)',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div className="min-w-0 max-w-full">
      <label className="block text-xs text-white/40 mb-1.5 tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="block box-border w-full min-w-0 max-w-full px-4 py-3 rounded-xl text-sm text-white/90 placeholder-white/20 outline-none transition-all"
        style={{
          background: 'oklch(0.14 0.015 270)',
          border: '1px solid oklch(0.22 0.01 270)',
        }}
        onFocus={e => e.target.style.borderColor = 'oklch(0.75 0.12 50 / 0.5)'}
        onBlur={e => e.target.style.borderColor = 'oklch(0.22 0.01 270)'}
      />
    </div>
  );
}

export default function ProfilePage() {
  const [, navigate] = useLocation();
  const { sharedState, updateSharedState, firebaseUser, signInWithGoogle, syncPrismDevices } = useApp();
  const googleUser = auth.currentUser?.uid === firebaseUser?.uid ? auth.currentUser : null;
  const [currentSection, setCurrentSection] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [syncingDevices, setSyncingDevices] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [generatedPairingCode, setGeneratedPairingCode] = useState<string | null>(null);
  const [inputPairingCode, setInputPairingCode] = useState('');
  const [pairingLoading, setPairingLoading] = useState(false);
  const [pairingStatus, setPairingStatus] = useState<string | null>(null);

  const initialProfile = sharedState?.userProfile || getPersistentUserProfile();
  const permAvatar = getPermanentAvatar();
  const initAvatar = permAvatar || initialProfile?.basic?.avatarUrl || '';

  const rawInitName = initialProfile?.basic?.name || '';
  const initName = (rawInitName && rawInitName !== '여행자') ? rawInitName : '';
  const rawInitNick = initialProfile?.basic?.nickname?.trim();
  const initNick = (rawInitNick && rawInitNick !== '여행자' && rawInitNick !== '사용자' && rawInitNick !== '박주형') ? rawInitNick : '제제';

  // 5개 섹션 상태
  const [basic, setBasic] = useState({
    name: initName,
    nickname: initNick,
    birthdate: initialProfile?.basic?.birthdate || '',
    birthtime: initialProfile?.basic?.birthtime || '',
    gender: (initialProfile?.basic?.gender || '') as '' | 'male' | 'female' | 'other',
    birthCity: initialProfile?.basic?.birthCity || '',
    trueSolarTime: Boolean(initialProfile?.basic?.trueSolarTime),
    lunarSolar: (initialProfile?.basic?.lunarSolar || 'solar') as 'solar' | 'lunar',
    avatarUrl: initAvatar,
  });
  const [fate, setFate] = useState({
    fateInterests: initialProfile?.fate?.fateInterests || [] as string[],
    lifeGoal: initialProfile?.fate?.lifeGoal || '',
    currentWorry: initialProfile?.fate?.currentWorry || '',
    referenceNotes: initialProfile?.fate?.referenceNotes || '',
  });
  const [music, setMusic] = useState({
    favoriteGenres: initialProfile?.music?.favoriteGenres || [] as string[],
    instruments: initialProfile?.music?.instruments || [] as string[],
    creativeGoal: initialProfile?.music?.creativeGoal || '',
    favoriteArtists: initialProfile?.music?.favoriteArtists || '',
  });
  const [psych, setPsych] = useState({
    mbti: initialProfile?.psych?.mbti || '',
    counselingStyle: (initialProfile?.psych?.counselingStyle || 'mixed') as 'empathy' | 'advice' | 'mixed',
    currentMood: initialProfile?.psych?.currentMood || '',
    personalityKeywords: initialProfile?.psych?.personalityKeywords || [] as string[],
  });
  const [art, setArt] = useState({
    favoriteArtStyle: initialProfile?.art?.favoriteArtStyle || [] as string[],
    favoritePoets: initialProfile?.art?.favoritePoets || '',
    favoriteColors: initialProfile?.art?.favoriteColors || [] as string[],
    artMedium: initialProfile?.art?.artMedium || [] as string[],
  });
  const [relationships, setRelationships] = useState<RelationshipEntry[]>(initialProfile?.relationships || []);

  // Firebase 및 클라우드 동기화 이벤트 수신
  useEffect(() => {
    const handleProfileUpdate = (e?: any) => {
      // 입력 중인 사용자 포커스가 있을 경우 외부/디바운스 이벤트에 의한 덮어쓰기 방지
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
      if (isInputFocused) return;

      const detailProfile = (e as CustomEvent)?.detail?.userProfile || (e as CustomEvent)?.detail;
      const profile = detailProfile || sharedState?.userProfile || loadProfileFromAllVaults() || getPersistentUserProfile();
      if (!profile) return;
      if (profile.basic) {
        const cleanBasic = { ...profile.basic };
        setBasic(b => ({
          name: cleanBasic.name?.trim() ? cleanBasic.name.trim() : b.name,
          nickname: (cleanBasic.nickname?.trim() && cleanBasic.nickname !== '여행자' && cleanBasic.nickname !== '사용자' && cleanBasic.nickname !== '박주형') ? cleanBasic.nickname.trim() : b.nickname,
          birthdate: cleanBasic.birthdate || b.birthdate,
          birthtime: cleanBasic.birthtime !== undefined ? cleanBasic.birthtime : b.birthtime,
          gender: cleanBasic.gender || b.gender,
          birthCity: cleanBasic.birthCity || b.birthCity,
          trueSolarTime: cleanBasic.trueSolarTime !== undefined ? Boolean(cleanBasic.trueSolarTime) : b.trueSolarTime,
          lunarSolar: cleanBasic.lunarSolar || b.lunarSolar,
          avatarUrl: getPermanentAvatar() || cleanBasic.avatarUrl || b.avatarUrl || '',
        }));
      }
      if (profile.fate) setFate(f => ({ ...f, ...profile.fate }));
      if (profile.music) setMusic(m => ({ ...m, ...profile.music }));
      if (profile.psych) setPsych(p => ({ ...p, ...profile.psych }));
      if (profile.art) setArt(a => ({ ...a, ...profile.art }));
      if (profile.relationships) setRelationships(profile.relationships);
    };

    handleProfileUpdate();
    window.addEventListener('prism:profile_updated', handleProfileUpdate);
    window.addEventListener('prism:feature_updated', handleProfileUpdate);
    window.addEventListener('prism:realtime_sync', handleProfileUpdate);
    return () => {
      window.removeEventListener('prism:profile_updated', handleProfileUpdate);
      window.removeEventListener('prism:feature_updated', handleProfileUpdate);
      window.removeEventListener('prism:realtime_sync', handleProfileUpdate);
    };
  }, [sharedState?.userProfile]);

  const avatarFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAvatar(true);
      const compressedDataUrl = await compressImageToDataUrl(file, 320, 0.85);
      
      // 🛡️ 영구 전용 금고에 즉시 저장
      setPermanentAvatar(compressedDataUrl);
      setBasic(prev => ({ ...prev, avatarUrl: compressedDataUrl }));

      // Save immediately to ensure instant sidebar and vault sync
      const existingProfile = sharedState?.userProfile || getPersistentUserProfile() || {};
      const updatedProfile = mergeUserProfiles(existingProfile, {
        basic: { ...existingProfile.basic, avatarUrl: compressedDataUrl },
      }, true);
      if (!updatedProfile.basic) updatedProfile.basic = {};
      updatedProfile.basic.avatarUrl = compressedDataUrl;
      setPersistentUserProfile(updatedProfile);
      saveProfileToAllVaults(updatedProfile);
      updateSharedState({ userProfile: updatedProfile }, 'profile').catch(() => {});
      window.dispatchEvent(new CustomEvent('prism:profile_updated', { detail: { userProfile: updatedProfile } }));
    } catch (err) {
      console.error('[ProfilePage] Failed to compress avatar:', err);
      alert('이미지를 처리하는 중 오류가 발생했습니다.');
    } finally {
      setIsUploadingAvatar(false);
      if (avatarFileInputRef.current) avatarFileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    // 🛡️ 명시적 사진 삭제: 전용 금고 비우기 및 프로필 반영
    clearPermanentAvatar();
    setBasic(prev => ({ ...prev, avatarUrl: '' }));
    const existingProfile = sharedState?.userProfile || getPersistentUserProfile() || {};
    const updatedProfile: UserProfile = {
      ...existingProfile,
      basic: {
        ...existingProfile.basic,
        avatarUrl: '',
      },
    };
    (updatedProfile as any).__explicitRemoveAvatar = true;
    (updatedProfile as any).__isAvatarAction = true;
    setPersistentUserProfile(updatedProfile);
    saveProfileToAllVaults(updatedProfile);
    updateSharedState({ userProfile: updatedProfile }, 'profile').catch(() => {});
    window.dispatchEvent(new CustomEvent('prism:profile_updated', { detail: { userProfile: updatedProfile } }));
  };

  const handleSave = async (silent = false) => {
    if (!silent) setSaving(true);
    try {
      const existingProfile = sharedState?.userProfile || getPersistentUserProfile() || {};
      const basicData: any = { ...basic };
      if (!basicData.gender) delete basicData.gender;

      const profile: UserProfile = mergeUserProfiles(existingProfile, {
        basic: basicData,
        fate,
        music,
        psych,
        art,
        relationships,
      }, true);

      if (!profile.basic) profile.basic = {};
      const safeNick = (basic.nickname?.trim() && basic.nickname.trim() !== '여행자' && basic.nickname.trim() !== '사용자' && basic.nickname.trim() !== '박주형')
        ? basic.nickname.trim()
        : '제제';
      profile.basic.nickname = safeNick;
      
      // 🛡️ 프로필 사진 무손실 보존
      const effectiveAvatar = basic.avatarUrl || getPermanentAvatar() || '';
      if (effectiveAvatar) {
        profile.basic.avatarUrl = effectiveAvatar;
        setPermanentAvatar(effectiveAvatar);
      }

      setPersistentUserProfile(profile);
      saveProfileToAllVaults(profile);

      // 로컬 저장은 즉시 완료하고, 네트워크 동기화가 저장 버튼을 무한히 붙잡지 않도록 3.5초 타임아웃 제한
      const syncTimeout = new Promise<void>((resolve) => {
        window.setTimeout(resolve, 3500);
      });

      const updatePromise = updateSharedState({ userProfile: profile }, 'profile').catch(err => {
        console.error('[ProfilePage] Sync failed:', err);
      });

      await Promise.race([updatePromise, syncTimeout]);

      // Direct push to user's Google Firestore document for 100% guarantee
      if (firebaseUser?.uid && firebaseUser.uid !== 'developer-bypass-uid') {
        try {
          const cleanProfile = cleanFirestoreData(profile);
          const userDocRef = doc(db, 'sharedState', firebaseUser.uid);
          const profileDocRef = doc(db, 'userProfiles', firebaseUser.uid);
          const cloudWrites = Promise.all([
            setDoc(userDocRef, { userProfile: cleanProfile, updatedAt: serverTimestamp() }, { merge: true }),
            setDoc(profileDocRef, { ...cleanProfile, updatedAt: serverTimestamp() }, { merge: true }),
          ]);
          await Promise.race([cloudWrites, syncTimeout]);
        } catch (cloudErr) {
          console.warn('[ProfilePage] Direct cloud backup warning:', cloudErr);
        }
      }

      if (!silent) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('[ProfilePage] Save failed:', err);
    } finally {
      if (!silent) setSaving(false);
    }
  };

  // Save edits immediately on this device; debounce the shared-state transport.
  const autoSaveSignature = React.useRef(JSON.stringify({ basic, fate, music, psych, art, relationships }));
  useEffect(() => {
    const fields = { basic, fate, music, psych, art, relationships };
    const signature = JSON.stringify(fields);
    if (signature === autoSaveSignature.current) return;
    autoSaveSignature.current = signature;
    const profile = mergeUserProfiles(getPersistentUserProfile() || sharedState?.userProfile, fields as UserProfile, true);
    saveProfileToAllVaults(profile);
    const timer = window.setTimeout(() => {
      void updateSharedState({ userProfile: profile }, 'profile').catch(() => {});
    }, 500);
    return () => window.clearTimeout(timer);
  }, [basic, fate, music, psych, art, relationships, sharedState?.userProfile, updateSharedState]);

  const section = SECTIONS[currentSection];
  const SectionIcon = section.icon;

  const [workspaceElement, setWorkspaceElement] = useState<HTMLDivElement | null>(null);
  const isWideWorkspace = useWideWorkspace(workspaceElement);
  const renderSection = (sectionIndex = currentSection) => {
    switch (sectionIndex) {
      case 0: // 기본 정보
        return (
          <div className="space-y-4">
            {/* 프로필 사진 (내 사진) 설정 카드 */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
              <div className="relative group shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-neutral-900 border-2 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.15)] flex items-center justify-center">
                  {(basic.avatarUrl || firebaseUser?.photoURL) ? (
                    <img
                      src={basic.avatarUrl || firebaseUser?.photoURL || ''}
                      alt="프로필 사진"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={30} className="text-amber-300/80" />
                  )}
                </div>
                {/* Overlay hover trigger */}
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                  title="사진 변경"
                >
                  <Camera size={16} className="mb-0.5 text-amber-300" />
                  <span className="text-[10px] font-medium">변경</span>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-sm font-semibold text-white/90">프로필 사진</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-mono border border-amber-400/30">
                    사이드바 연동
                  </span>
                </div>
                <p className="text-xs text-white/40 mb-3 leading-relaxed">
                  사이드바와 루시 채팅에서 보여질 내 사진을 등록하세요.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileSelect}
                  />
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Upload size={12} />
                    {isUploadingAvatar ? '압축 중...' : (basic.avatarUrl ? '사진 변경' : '사진 등록')}
                  </button>

                  {basic.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-rose-500/20 text-white/50 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                      title="기본 아이콘으로 복원"
                    >
                      <RotateCcw size={12} />
                      초기화
                    </button>
                  )}
                </div>
              </div>
            </div>

            <InputField label="실명 *" value={basic.name}
              onChange={v => setBasic(b => ({ ...b, name: v }))} placeholder="예: 홍길동" />
            <InputField label="닉네임 (루시가 부를 이름)" value={basic.nickname}
              onChange={v => setBasic(b => ({ ...b, nickname: v }))} placeholder="예: 제제" />
            <InputField label="생년월일" value={basic.birthdate} type="date"
              onChange={v => setBasic(b => ({ ...b, birthdate: v }))} />
            <InputField label="태어난 시각 (모르면 비워두세요)" value={basic.birthtime} type="time"
              onChange={v => setBasic(b => ({ ...b, birthtime: v }))} />
            <div>
              <label className="block text-xs text-white/40 mb-1.5 tracking-wider">성별</label>
              <div className="flex gap-2">
                {[{ v: 'female', l: '여성' }, { v: 'male', l: '남성' }, { v: 'other', l: '기타' }].map(({ v, l }) => (
                  <button key={v} type="button" onClick={() => setBasic(b => ({ ...b, gender: v as any }))}
                    className="flex-1 py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      background: basic.gender === v ? 'oklch(0.75 0.12 50 / 0.2)' : 'oklch(0.14 0.015 270)',
                      border: `1px solid ${basic.gender === v ? 'oklch(0.75 0.12 50 / 0.5)' : 'oklch(0.22 0.01 270)'}`,
                      color: basic.gender === v ? 'oklch(0.75 0.12 50)' : 'oklch(0.55 0.01 270)',
                    }}>{l}</button>
                ))}
              </div>
            </div>
            <InputField label="태어난 도시 (별자리 계산용)" value={basic.birthCity}
              onChange={v => setBasic(b => ({ ...b, birthCity: v }))} placeholder="예: 서울" />
            <div>
              <label className="block text-xs text-white/40 mb-1.5 tracking-wider">사주 시주 시간 기준</label>
              <div className="flex gap-2">
                {[{ v: false, l: '한국 관례 (−30분)' }, { v: true, l: '진태양시 (출생지 경도)' }].map(({ v, l }) => (
                  <button key={String(v)} type="button" onClick={() => setBasic(b => ({ ...b, trueSolarTime: v }))}
                    className="flex-1 py-2.5 rounded-xl text-sm transition-all"
                    aria-pressed={basic.trueSolarTime === v}
                    style={{
                      background: basic.trueSolarTime === v ? 'oklch(0.75 0.12 50 / 0.2)' : 'oklch(0.14 0.015 270)',
                      border: `1px solid ${basic.trueSolarTime === v ? 'oklch(0.75 0.12 50 / 0.5)' : 'oklch(0.22 0.01 270)'}`,
                      color: basic.trueSolarTime === v ? 'oklch(0.75 0.12 50)' : 'oklch(0.55 0.01 270)',
                    }}>{l}</button>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/35">진태양시는 태어난 도시의 경도와 그날의 균시차로 시주를 정해요. 시간 경계 근처에 태어났다면 시주가 달라질 수 있어요.</p>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5 tracking-wider">생년월일 기준</label>
              <div className="flex gap-2">
                {[{ v: 'solar', l: '양력' }, { v: 'lunar', l: '음력' }].map(({ v, l }) => (
                  <button key={v} type="button" onClick={() => setBasic(b => ({ ...b, lunarSolar: v as any }))}
                    className="flex-1 py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      background: basic.lunarSolar === v ? 'oklch(0.75 0.12 50 / 0.2)' : 'oklch(0.14 0.015 270)',
                      border: `1px solid ${basic.lunarSolar === v ? 'oklch(0.75 0.12 50 / 0.5)' : 'oklch(0.22 0.01 270)'}`,
                      color: basic.lunarSolar === v ? 'oklch(0.75 0.12 50)' : 'oklch(0.55 0.01 270)',
                    }}>{l}</button>
                ))}
              </div>
            </div>

            {/* 실시간 사주 본원 에너지 카드 */}
            {basic.birthdate && (
              <div className="pt-2 space-y-4">
                <SajuCardView profile={{ basic: { ...basic, gender: (basic.gender || undefined) as any }, fate, music, psych, art }} />
                <NatalChartCardView 
                  profile={{ basic: { ...basic, gender: (basic.gender || undefined) as any }, fate, music, psych, art, relationships }} 
                  onUpdateRelationships={(newRels) => setRelationships(newRels)}
                />
              </div>
            )}
          </div>
        );

      case 1: // 운명 관심사
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-wider">관심 있는 운명학 분야</label>
              <TagSelector options={FATE_INTERESTS} selected={fate.fateInterests}
                onChange={v => setFate(f => ({ ...f, fateInterests: v }))} color={section.color} />
            </div>
            <div>
              <label htmlFor="profile-chart-reference" className="block text-xs text-white/70 mb-2">명식·해석 참고자료</label>
              <textarea id="profile-chart-reference" value={fate.referenceNotes} maxLength={18000} rows={8}
                onChange={e => setFate(f => ({ ...f, referenceNotes: e.target.value }))}
                placeholder="직접 확인한 사주·자미두수·숙요 자료와 계산 기준을 보관하세요."
                className="w-full rounded-xl border border-white/15 bg-slate-900 p-3 text-sm leading-relaxed text-slate-100" />
              <p className="mt-2 text-xs text-white/60">Lucy가 함께 참고합니다. 자료의 기준일과 실제 오늘 날짜는 구분해서 해석합니다.</p>
            </div>
            <InputField label="인생 목표 (한 줄)" value={fate.lifeGoal}
              onChange={v => setFate(f => ({ ...f, lifeGoal: v }))} placeholder="예: 나의 음악으로 세상을 연결하고 싶어요" />
            <div>
              <label className="block text-xs text-white/40 mb-1.5 tracking-wider">요즘 가장 큰 고민</label>
              <textarea value={fate.currentWorry}
                onChange={e => setFate(f => ({ ...f, currentWorry: e.target.value }))}
                placeholder="루시에게 속시원하게 털어놔보세요..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm text-white/90 placeholder-white/20 outline-none resize-none transition-all"
                style={{ background: 'oklch(0.14 0.015 270)', border: '1px solid oklch(0.22 0.01 270)' }}
                onFocus={e => e.target.style.borderColor = 'oklch(0.75 0.12 50 / 0.5)'}
                onBlur={e => e.target.style.borderColor = 'oklch(0.22 0.01 270)'}
              />
            </div>
          </div>
        );

      case 2: // 음악 취향
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-wider">좋아하는 음악 장르</label>
              <TagSelector options={MUSIC_GENRES} selected={music.favoriteGenres}
                onChange={v => setMusic(m => ({ ...m, favoriteGenres: v }))} color={section.color} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-wider">다루는 악기 / 관심 분야</label>
              <TagSelector options={INSTRUMENTS} selected={music.instruments}
                onChange={v => setMusic(m => ({ ...m, instruments: v }))} color={section.color} />
            </div>
            <InputField label="좋아하는 아티스트" value={music.favoriteArtists}
              onChange={v => setMusic(m => ({ ...m, favoriteArtists: v }))} placeholder="예: 아이유, 콜드플레이, 히사이시 조" />
            <InputField label="음악적 창의 목표" value={music.creativeGoal}
              onChange={v => setMusic(m => ({ ...m, creativeGoal: v }))} placeholder="예: 나만의 감정을 담은 연주곡 완성하기" />
          </div>
        );

      case 3: // 심리 · 결정
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-wider">MBTI</label>
              <div className="grid grid-cols-4 gap-2">
                {MBTI_LIST.map(m => (
                  <button key={m} type="button" onClick={() => setPsych(p => ({ ...p, mbti: m }))}
                    className="py-2 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: psych.mbti === m ? 'oklch(0.72 0.18 55 / 0.25)' : 'oklch(0.14 0.015 270)',
                      border: `1px solid ${psych.mbti === m ? 'oklch(0.72 0.18 55 / 0.6)' : 'oklch(0.22 0.01 270)'}`,
                      color: psych.mbti === m ? 'oklch(0.72 0.18 55)' : 'oklch(0.55 0.01 270)',
                    }}>{m}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-wider">선호하는 상담 스타일</label>
              <div className="flex gap-2">
                {[
                  { v: 'empathy', l: '공감 위주', d: '그저 들어줘요' },
                  { v: 'advice', l: '조언 위주', d: '해결책이 중요해요' },
                  { v: 'mixed', l: '복합형', d: '상황에 따라' },
                ].map(({ v, l, d }) => (
                  <button key={v} type="button" onClick={() => setPsych(p => ({ ...p, counselingStyle: v as any }))}
                    className="flex-1 py-3 rounded-xl text-xs transition-all flex flex-col items-center gap-1"
                    style={{
                      background: psych.counselingStyle === v ? 'oklch(0.72 0.18 55 / 0.2)' : 'oklch(0.14 0.015 270)',
                      border: `1px solid ${psych.counselingStyle === v ? 'oklch(0.72 0.18 55 / 0.5)' : 'oklch(0.22 0.01 270)'}`,
                      color: psych.counselingStyle === v ? 'oklch(0.72 0.18 55)' : 'oklch(0.55 0.01 270)',
                    }}>
                    <span className="font-medium">{l}</span>
                    <span className="text-white/30 text-[10px]">{d}</span>
                  </button>
                ))}
              </div>
            </div>
            <InputField label="요즘 기분 한 줄 묘사" value={psych.currentMood}
              onChange={v => setPsych(p => ({ ...p, currentMood: v }))} placeholder="예: 설레이면서도 조금 불안해요" />
          </div>
        );

      case 4: // 예술 취향
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-wider">좋아하는 화풍 / 아트 스타일</label>
              <TagSelector options={ART_STYLES} selected={art.favoriteArtStyle}
                onChange={v => setArt(a => ({ ...a, favoriteArtStyle: v }))} color={section.color} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-wider">주로 선호하는 색감</label>
              <TagSelector options={ART_COLORS} selected={art.favoriteColors}
                onChange={v => setArt(a => ({ ...a, favoriteColors: v }))} color={section.color} />
            </div>
            <InputField label="좋아하는 시인 / 작가 " value={art.favoritePoets}
              onChange={v => setArt(a => ({ ...a, favoritePoets: v }))} placeholder="예: 윤동주, 김소월, 파블로 네루다" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div data-app-scroll-root="true" className="h-app-full bg-[#fdfaf5] dark:bg-[#080910] text-slate-900 dark:text-white relative overflow-x-hidden overflow-y-auto flex flex-col">
      <div className="prism-page-content flex-1 w-full mx-auto flex flex-col relative text-slate-900 dark:text-white">
      <div className="relative z-10 px-4 pt-[calc(3rem+var(--sat))] pb-12">
        {/* Header */}
        <motion.div data-top-bar="true" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="text-white/30 hover:text-white/60 transition-colors p-1 cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-xl" style={{ color: 'oklch(0.75 0.12 50)' }}>Profile Settings</h1>
            <p className="text-xs text-white/30 mt-0.5">Let the 4 AIs know you better</p>
          </div>
          <div className="ml-auto">
            <button onClick={() => handleSave()} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{ background: 'oklch(0.75 0.12 50 / 0.15)', border: '1px solid oklch(0.75 0.12 50 / 0.4)', color: 'oklch(0.75 0.12 50)' }}>
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                    <Check size={14} /> 저장됨
                  </motion.span>
                ) : saving ? (
                  <motion.span key="saving" className="flex items-center gap-1">
                    <Save size={14} className="animate-spin" /> 저장 중
                  </motion.span>
                ) : (
                  <motion.span key="save" className="flex items-center gap-1">
                    <Save size={14} /> 저장
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>

        {/* App integration info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-3xl p-5 border border-white/10 bg-[#121320] shadow-2xl hover:border-white/20 transition-all duration-300">
          <p className="text-[10px] font-bold text-white/20 mb-4 tracking-[0.3em] uppercase">Core Data Linked Apps</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'TRINITY', color: 'oklch(0.75 0.12 50)', desc: 'Birth data sync' },
              { name: 'MUSE', color: 'oklch(0.70 0.18 295)', desc: 'Creative goals' },
              { name: 'ORANGE', color: 'oklch(0.72 0.18 55)', desc: 'MBTI & Personality' },
              { name: 'BLUEBIRD', color: 'oklch(0.65 0.18 240)', desc: 'Soul aesthetics' },
            ].map(({ name, color, desc }) => (
              <div key={name} className="rounded-2xl p-3" style={{ background: color + '05', border: `1px solid ${color}10` }}>
                <p className="text-[10px] font-bold mb-1 tracking-wider" style={{ color }}>{name}</p>
                <p className="text-[9px] text-white/20 leading-tight uppercase font-mono">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Google 계정 클라우드 동기화 상태 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-3xl p-5 border border-white/10 bg-[#121320] shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col gap-2.5"
        >
          <div className="duo-workspace-actions flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-3 h-3 rounded-full shrink-0 ${googleUser ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-amber-400 animate-pulse'}`} />
              <div className="min-w-0">
                <span className="text-xs font-bold text-white/80 block truncate">
                  {googleUser ? `구글 연동 계정: ${googleUser.email || googleUser.displayName || 'Google Account'}` : firebaseUser ? 'PIN 또는 기기 연동 상태' : '게스트 모드 (로컬 임시 보관)'}
                </span>
                <span className="text-[11px] text-white/40 block mt-0.5">
                  {syncFeedback || (googleUser ? '동기화 버튼으로 루시 대화 서버 연결을 확인할 수 있습니다.' : '루시 대화를 다른 기기와 동기화하려면 같은 Google 계정으로 연동해 주세요.')}
                </span>
              </div>
            </div>
            {!googleUser ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={syncingDevices}
                  onClick={async () => {
                    if (syncingDevices) return;
                    setSyncingDevices(true);
                    setSyncFeedback('최신 버전 및 업그레이드 확인 중...');
                    try {
                      const serverVer = await fetchDeployedAppVersion().catch(() => null);
                      if (serverVer && compareVersions(serverVer, APP_VERSION) > 0) {
                        setSyncFeedback(`🚀 최신 v${serverVer} 발견! 즉시 업그레이드 적용 중...`);
                        await forceAppUpgradeAndReload();
                        return;
                      }
                      setSyncFeedback(`v${APP_VERSION} 최신 버전 사용 중`);
                    } catch {
                      setSyncFeedback(`v${APP_VERSION} 최신 상태`);
                    } finally {
                      setSyncingDevices(false);
                      setTimeout(() => setSyncFeedback(null), 3500);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  {syncingDevices ? (
                    <>
                      <div className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" />
                      <span>확인 중...</span>
                    </>
                  ) : (
                    <span>업그레이드 확인</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md active:scale-95"
                >
                  Google 연동
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={syncingDevices}
                onClick={async () => {
                  if (syncingDevices) return;
                  setSyncingDevices(true);
                  setSyncFeedback('클라우드 동기화 및 최신 업그레이드 확인 중...');
                  let chatFeedback: string | null = null;
                  try {
                    const syncTimeout = new Promise<[null, null]>((resolve) =>
                      setTimeout(() => resolve([null, null]), 5500)
                    );
                    const checkChat = getDocFromServer(doc(db, 'chatThreads', googleUser.uid)).then(
                      snapshot => { chatFeedback = snapshot.exists() ? '루시 대화 서버 읽기 성공' : '루시 대화 서버 연결 성공 · 저장된 대화 없음'; },
                      (error: { code?: string }) => { chatFeedback = `루시 대화 서버 연결 실패 (${error.code || 'unknown'})`; },
                    );
                    const syncOperation = Promise.all([
                      syncPrismDevices(),
                      fetchDeployedAppVersion().catch(() => null),
                      checkChat,
                    ]);
                    const [res, serverVer] = await Promise.race([syncOperation, syncTimeout]);
                    const updatedProfile = res?.mergedState?.userProfile || sharedState?.userProfile || loadProfileFromAllVaults() || getPersistentUserProfile();
                    if (updatedProfile) {
                      if (updatedProfile.basic) setBasic((b) => ({ ...b, ...updatedProfile.basic }));
                      if (updatedProfile.fate) setFate((f) => ({ ...f, ...updatedProfile.fate }));
                      if (updatedProfile.music) setMusic((m) => ({ ...m, ...updatedProfile.music }));
                      if (updatedProfile.psych) setPsych((p) => ({ ...p, ...updatedProfile.psych }));
                      if (updatedProfile.art) setArt((a) => ({ ...a, ...updatedProfile.art }));
                    }

                    const targetVer = res?.targetVersion || serverVer || APP_VERSION;
                    const isNewVer = Boolean(
                      res?.needsReload ||
                      (serverVer && compareVersions(serverVer, APP_VERSION) > 0) ||
                      (res?.targetVersion && compareVersions(res.targetVersion, APP_VERSION) > 0)
                    );

                    if (isNewVer) {
                      setSyncFeedback(`🚀 최신 v${targetVer} 발견! 즉시 업그레이드 적용 중...`);
                      await forceAppUpgradeAndReload();
                      return;
                    }

                    setSyncFeedback(chatFeedback || '동기화 응답 시간이 초과되었습니다.');
                  } catch {
                    setSyncFeedback('동기화 확인 중 오류가 발생했습니다.');
                  } finally {
                    setSyncingDevices(false);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5"
              >
                {syncingDevices ? (
                  <>
                    <div className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" />
                    <span>동기화 & 업그레이드 중...</span>
                  </>
                ) : (
                  <span>기기 즉시 동기화</span>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* 6자리 초고속 기기 페어링 연동 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl p-5 border border-white/10 bg-[#121320] shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col gap-3"
        >
          <div className="duo-workspace-actions flex items-center justify-between flex-wrap gap-1">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              ⚡ 기기 실시간 즉시 연동 (6자리 핀코드)
            </span>
            {getPairedVaultId() ? (
              <span className="text-[10px] text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                ● 실시간 자동 동기화 활성
              </span>
            ) : (
              <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full font-medium">
                PC ⇄ 모바일 상시 연동
              </span>
            )}
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed">
            6자리 핀코드로 연동하면 앞으로 다이어리, 타로, 시크릿 소원, 리바이블 등 모든 기록이 PC와 모바일 간에 실시간으로 자동 저장 및 동기화됩니다.
          </p>

          {getPairedVaultId() && (
            <div className="duo-workspace-actions flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-300 font-medium text-[11px]">
                <Check size={13} className="text-emerald-400" />
                <span>이 기기는 핀코드로 연동되어 실시간 자동 저장이 유지 중입니다.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('핀코드 실시간 연동을 해제하시겠습니까? (로컬 데이터는 보존됩니다)')) {
                    setPairedVaultId(null);
                    setPairingStatus('핀코드 연동이 해제되었습니다.');
                    setTimeout(() => window.location.reload(), 1000);
                  }
                }}
                className="text-[10px] text-white/40 hover:text-rose-300 underline cursor-pointer shrink-0 ml-2"
              >
                연동 해제
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* 내 기기 코드 생성 */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-white/70">1. 현재 기기에서 코드 생성</span>
              {generatedPairingCode ? (
                <div className="duo-workspace-actions flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-yellow-500/30">
                  <span className="text-base font-black tracking-widest text-yellow-400 font-mono">{generatedPairingCode}</span>
                  <span className="text-[10px] text-white/40">1시간 유효</span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={pairingLoading}
                  onClick={async () => {
                    setPairingLoading(true);
                    try {
                      const res = await generatePairingCode(sharedState || {});
                      if (res?.code) {
                        setGeneratedPairingCode(res.code);
                        setPairingStatus('✅ 6자리 코드가 생성되었습니다. 다른 기기에 입력하세요.');
                      } else {
                        setPairingStatus('❌ 연동 코드 생성 실패');
                      }
                    } catch (e: any) {
                      setPairingStatus('❌ 연동 코드 생성 실패');
                    } finally {
                      setPairingLoading(false);
                    }
                  }}
                  className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 rounded-lg text-xs font-bold transition-all cursor-pointer text-center active:scale-95"
                >
                  {pairingLoading ? '코드 생성 중...' : '연동 핀코드 생성'}
                </button>
              )}
            </div>

            {/* 다른 기기 코드 입력 */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-white/70">2. 다른 기기 핀코드 입력</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6자리 코드"
                  value={inputPairingCode}
                  onChange={(e) => setInputPairingCode(e.target.value.trim())}
                  className="flex-1 px-3 py-1.5 bg-black/40 rounded-lg text-xs font-mono text-center text-white border border-white/10 outline-none focus:border-yellow-500/50"
                />
                <button
                  type="button"
                  disabled={pairingLoading || inputPairingCode.length !== 6}
                  onClick={async () => {
                    setPairingLoading(true);
                    setPairingStatus('데이터 가져오는 중...');
                    try {
                      const imported = await importWithPairingCode(inputPairingCode);
                      if (imported) {
                        unpackAndHydrateLocalStorage(firebaseUser?.uid || 'developer-bypass-uid', imported);
                        await updateSharedState(imported, 'pairing');
                        setPairingStatus('🎉 기기 연동 완료! 모든 데이터가 동기화되었으며 실시간 자동 연동이 활성화되었습니다.');
                        setTimeout(() => window.location.reload(), 1200);
                      } else {
                        setPairingStatus('❌ 코드가 올바르지 않거나 만료되었습니다.');
                      }
                    } catch (e: any) {
                      setPairingStatus('❌ 연동 실패: ' + (e?.message || '알 수 없는 오류'));
                    } finally {
                      setPairingLoading(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  연동하기
                </button>
              </div>
            </div>
          </div>

          {pairingStatus && (
            <p className="text-[11px] text-yellow-300/90 text-center bg-yellow-500/10 py-1.5 px-3 rounded-lg border border-yellow-500/20">
              {pairingStatus}
            </p>
          )}
        </motion.div>

        {/* 시스템 정보 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl p-5 border border-white/10 bg-[#121320] shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col gap-1"
        >
          <div className="duo-workspace-actions flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('prism:open_icon_preview'))}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
              title="앱 아이콘 크게 보기"
            >
              <img
                src="/app-icon.png"
                alt="LucKey Prism App Icon"
                className="w-10 h-10 rounded-xl shadow-[0_0_12px_rgba(52,211,153,0.35)] border border-emerald-400/30 object-cover shrink-0 group-hover:scale-105 group-hover:border-emerald-300 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold flex items-center gap-1.5">
                  System Engine
                  <span className="text-[9px] text-emerald-400 font-normal underline">미리보기</span>
                </span>
                <span className="text-xs font-semibold text-white/80 mt-1 group-hover:text-emerald-400 transition-colors">
                  LucKey · Lucy v{APP_VERSION}
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={async () => {
                setSyncFeedback('최신 엔진 및 캐시 새로고침 중...');
                await forceAppUpgradeAndReload();
              }}
              className="text-[10px] text-white/50 hover:text-white/90 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-all cursor-pointer font-sans"
            >
              새로고침 및 최신화 ⟳
            </button>
          </div>
        </motion.div>

        {/* Section tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === currentSection;
            return (
              <button key={s.id} onClick={() => setCurrentSection(i)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 cursor-pointer"
                style={{
                  background: isActive ? s.color + '20' : 'oklch(0.12 0.015 270)',
                  border: `1px solid ${isActive ? s.color + '50' : 'oklch(0.20 0.01 270)'}`,
                  color: isActive ? s.color : 'oklch(0.45 0.01 270)',
                }}>
                <Icon size={12} />
                {s.label}
              </button>
            );
          })}
        </motion.div>

        {/* Section header */}
        <motion.div key={currentSection} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl p-5 mb-5 bg-[#121320] border border-white/10 shadow-lg">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: section.color + '15', border: `1px solid ${section.color}30` }}>
              <SectionIcon size={16} style={{ color: section.color }} />
            </div>
            <div>
              <h2 className="font-medium text-white/90 text-sm">{section.label}</h2>
              <p className="text-xs text-white/35">{section.desc}</p>
            </div>
            <div className="ml-auto text-xs text-white/25">{currentSection + 1} / {SECTIONS.length}</div>
          </div>
        </motion.div>

        {/* Section content */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl p-5 mb-6 bg-[#121320] border border-white/10 shadow-xl">
            <DuoWorkspace ref={setWorkspaceElement} className="duo-profile-workspace">
  {SECTIONS.map((item, index) => (isWideWorkspace || index === currentSection) && (
    <section key={item.id} className={`duo-profile-section ${item.id === 'basic' || item.id === 'card' ? 'duo-workspace-full' : ''} ${index === currentSection ? 'is-active' : ''}`} aria-label={item.label}>
      <h3 className="text-sm font-bold mb-4">{item.label}</h3>{renderSection(index)}
    </section>
  ))}
</DuoWorkspace>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentSection > 0 && (
            <button onClick={() => setCurrentSection(c => c - 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all"
              style={{ background: 'oklch(0.14 0.015 270)', border: '1px solid oklch(0.22 0.01 270)', color: 'oklch(0.55 0.01 270)' }}>
              <ChevronLeft size={16} /> 이전
            </button>
          )}
          {currentSection < SECTIONS.length - 1 ? (
            <button onClick={async () => { 
                handleSave(true); // Silent save
                setCurrentSection(c => c + 1); 
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: section.color + '20', border: `1px solid ${section.color}40`, color: section.color }}>
              다음 <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={async () => { await handleSave(); navigate('/'); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'oklch(0.75 0.12 50 / 0.2)', border: '1px solid oklch(0.75 0.12 50 / 0.5)', color: 'oklch(0.75 0.12 50)' }}>
              <Check size={16} /> Complete and Go Home
            </button>
          )}
        </div>

        </div>
      </div>
    </div>
  );
}
