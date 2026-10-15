import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  X,
  User,
  Star,
  Music,
  Brain,
  Palette,
  ChevronRight,
  ChevronLeft,
  Check,
  Save,
  Moon,
  Sparkles,
  Zap,
  Globe,
  Compass,
  ShieldCheck,
  Mail,
  RefreshCw,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { useApp, getPersistentUserProfile, setPersistentUserProfile } from '@/contexts/AppContext';
import { useBinauralBeat } from '@/hooks/useBinauralBeat';
import { openChannelIntro } from '@/components/common/ChannelIntroModal';
import { useScrollToTopOnChange } from '@/hooks/useScrollToTopOnChange';
import { useSpecialFeatureChromeHidden, SPECIAL_FEATURE_CHROME_HIDDEN_CLASS } from '@/components/SpecialFeaturePanel';
import { loadProfileFromAllVaults, saveProfileToAllVaults } from '@/lib/profileVault';
import { LucKeyLogoText } from '@/components/LucKeyLogoText';
import { type UserProfile, mergeUserProfiles } from '@/lib/sharedState';
import { cleanFirestoreData } from '@/lib/sharedStateSync';
import { SajuCardView } from '@/components/SajuCardView';
import { db, doc, setDoc, serverTimestamp } from '@/lib/firebase';
import { EpilogueDiaryView } from '@/components/epilogue/EpilogueDiaryView';
import { EpilogueSynergySection } from '@/components/epilogue/EpilogueSynergySection';
import { useNarrowPhone } from '@/hooks/useNarrowPhone';
import { isLegacyMobile } from '@/lib/perfMode';
import { APP_VERSION, fetchDeployedAppVersion, compareVersions } from '@/lib/appVersion';
import { fetchChangelog, getManualSyncChangelogEntries, type ChangelogEntry } from '@/lib/updateNotice';
import { UpdateNoticeModal } from '@/components/UpdateNoticeModal';
import { forceAppUpgradeAndReload } from '@/lib/prismSync';
import { useSwipeableTabs } from '@/hooks/useSwipeableTabs';

const EPILOGUE_SWIPE_TABS = ['diary', 'synergy', 'profile'] as const;
type EpilogueSwipeTab = typeof EPILOGUE_SWIPE_TABS[number];

function GoogleLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

// Zero-overhead: AuroraBackground already provides cosmic stars and nebulas globally
function FloatingParticles(_props: { count?: number }) {
  return null;
}

const SECTIONS = [
  { id: 'basic', label: '기본 정보', icon: User, color: 'oklch(0.75 0.12 50)', desc: '이름 · 생년월일 · 성별' },
  { id: 'fate', label: '운명 관심사', icon: Star, color: 'oklch(0.85 0.15 90)', desc: '사주 · 타로 · 인생 목표' },
  { id: 'music', label: '음악 취향', icon: Music, color: 'oklch(0.65 0.18 290)', desc: '장르 · 악기 · 창의 목표' },
  { id: 'psych', label: '심리 · 결정', icon: Brain, color: 'oklch(0.72 0.18 55)', desc: 'MBTI · AI 상담 스타일' },
  { id: 'art', label: '예술 감성', icon: Palette, color: 'oklch(0.65 0.18 240)', desc: '화풍 · 색감 · 선호 시인' },
  { id: 'card', label: '운명 프리뷰', icon: Sparkles, color: 'oklch(0.80 0.20 320)', desc: '실시간 천문 사주 카드' },
];

const FATE_INTERESTS = ['사주', '타로', '별자리', '꿈해몽', '수비학', '관상', '기적수업', '동양철학'];
const MUSIC_GENRES = ['K-Pop', '팝', '재즈', '클래식', 'R&B', '힙합', '인디', '락', 'EDM', '포크', '발라드', '뉴에이지'];
const INSTRUMENTS = ['피아노', '기타', '드럼', '베이스', '바이올린', '첼로', '플루트', '보컬', '작곡', '프로듀싱'];
const MBTI_LIST = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
const ART_STYLES = ['인상주의', '추상화', '팝아트', '미니멀리즘', '초현실주의', '입체파', '사진', '일러스트', '동양화', '미디어아트'];
const ART_COLORS = ['따뜻한 톤', '차가운 톤', '파스텔', '모노톤', '비비드', '어스 톤', '네온 사이버', '골드 & 퍼플'];

function TagSelector({
  options,
  selected,
  onChange,
  color,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  color: string;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer backdrop-blur-md"
            style={{
              background: active ? `${color}30` : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${active ? `${color}70` : 'rgba(255, 255, 255, 0.08)'}`,
              color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
              boxShadow: active ? `0 0 12px ${color}35` : 'none',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-white/50 tracking-wider font-sans uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-2xl text-sm text-white/95 placeholder-white/20 outline-none transition-all duration-200 bg-white/[0.03] backdrop-blur-md border border-white/10 focus:border-purple-400/60 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(192,132,252,0.15)]"
      />
    </div>
  );
}

export default function EpilogueApp() {
  const narrow = useNarrowPhone();
  const legacy = isLegacyMobile();
  const [location, navigate] = useLocation();
  const isSpecialFeatureChromeHidden = useSpecialFeatureChromeHidden();

  // Mode: 'diary' | 'profile' | 'synergy'
  const [activeMode, setActiveMode] = useState<'diary' | 'profile' | 'synergy'>(() => {
    if (typeof window !== 'undefined') {
      const urlTab = new URLSearchParams(window.location.search).get('tab');
      const sessionTab = sessionStorage.getItem('prism_target_tab');
      const tab = urlTab || sessionTab;
      if (tab === 'diary' || tab === 'profile' || tab === 'synergy') {
        sessionStorage.removeItem('prism_target_tab');
        return tab;
      }
    }
    return location === '/profile' ? 'profile' : (location === '/chronicle' ? 'synergy' : 'diary');
  });

  useEffect(() => {
    if (location === '/profile') {
      setActiveMode('profile');
    } else if (location === '/chronicle') {
      setActiveMode('synergy');
    }
  }, [location]);

  useEffect(() => {
    const applyTargetTab = (tab: string | null | undefined) => {
      if (!tab) return;
      if (tab === 'diary' || tab === 'profile' || tab === 'synergy') {
        setActiveMode(tab);
        sessionStorage.removeItem('prism_target_tab');
      }
    };

    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      applyTargetTab(customEvent.detail?.tab);
    };

    const handleNavClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const path = customEvent.detail?.path || '';
      if (path.startsWith('/epilogue') || path.startsWith('/profile') || path.startsWith('/chronicle')) {
        let tab = customEvent.detail?.tab;
        if (!tab && path.includes('?')) {
          try {
            const url = new URL(path, 'http://localhost');
            tab = url.searchParams.get('tab');
          } catch (_) {}
        }
        if (tab) {
          applyTargetTab(tab);
        } else if (path === '/epilogue') {
          setActiveMode('diary');
        } else if (path === '/profile') {
          setActiveMode('profile');
        } else if (path === '/chronicle') {
          setActiveMode('synergy');
        }
      }
    };

    window.addEventListener('prism-tab-change', handleTabChange);
    window.addEventListener('nav-click-active', handleNavClick);
    return () => {
      window.removeEventListener('prism-tab-change', handleTabChange);
      window.removeEventListener('nav-click-active', handleNavClick);
    };
  }, []);

  useScrollToTopOnChange([activeMode]);

  const {
    sharedState,
    updateSharedState,
    firebaseUser,
    signInWithGoogle,
    logout,
    syncPrismDevices,
    openLucyChat,
    sendUnifiedMessage,
    generateDevicePairingCode,
    importDevicePairingCode,
  } = useApp();
  const [currentSection, setCurrentSection] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { isCurrentAppPlaying: isBinauralPlaying, toggle: toggleBinaural } = useBinauralBeat('epilogue');
  const [syncingDevices, setSyncingDevices] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateEntries, setUpdateEntries] = useState<ChangelogEntry[]>([]);
  const [latestVersion, setLatestVersion] = useState<string>(APP_VERSION);
  const [showPairingPanel, setShowPairingPanel] = useState(false);
  const [pairingGenCode, setPairingGenCode] = useState<string | null>(null);
  const [pairingInputCode, setPairingInputCode] = useState('');
  const [pairingBusy, setPairingBusy] = useState(false);
  const [pairingMsg, setPairingMsg] = useState<string | null>(null);

  const handleSyncDevices = async () => {
    if (syncingDevices) return;
    setSyncingDevices(true);
    setSyncFeedback('클라우드 동기화 및 최신 업그레이드 확인 중...');
    try {
      // 1. 현재 화면의 프로필 변경사항이 있다면 먼저 조용히 로컬/클라우드에 저장
      await handleSave(true).catch(() => {});

      const syncTimeout = new Promise<[null, ChangelogEntry[], null]>((resolve) =>
        setTimeout(() => resolve([null, [], null]), 5500)
      );

      const syncOperation = Promise.all([
        syncPrismDevices(),
        fetchChangelog().catch(() => [] as ChangelogEntry[]),
        fetchDeployedAppVersion().catch(() => null),
      ]);

      const [res, changelog, serverVer] = await Promise.race([syncOperation, syncTimeout]);

      const targetVersion = res?.targetVersion || serverVer || APP_VERSION;
      const entries = getManualSyncChangelogEntries(changelog, targetVersion, 30);
      setUpdateEntries(entries);
      setLatestVersion(targetVersion);

      // Instantly hydrate form state if updated profile received
      const updatedProfile = res?.mergedState?.userProfile || sharedState?.userProfile || loadProfileFromAllVaults() || getPersistentUserProfile();
      if (updatedProfile) {
        if (updatedProfile.basic) setBasic((b) => ({ ...b, ...updatedProfile.basic }));
        if (updatedProfile.fate) setFate((f) => ({ ...f, ...updatedProfile.fate }));
        if (updatedProfile.music) setMusic((m) => ({ ...m, ...updatedProfile.music }));
        if (updatedProfile.psych) setPsych((p) => ({ ...p, ...updatedProfile.psych }));
        if (updatedProfile.art) setArt((a) => ({ ...a, ...updatedProfile.art }));
      }

      // 이벤트 즉시 발행하여 모든 컴포넌트에 알림
      window.dispatchEvent(new CustomEvent('prism:profile_updated'));
      window.dispatchEvent(new CustomEvent('prism:feature_updated'));

      const isNewVer = Boolean(
        res?.needsReload ||
        (serverVer && compareVersions(serverVer, APP_VERSION) > 0) ||
        (res?.targetVersion && compareVersions(res.targetVersion, APP_VERSION) > 0)
      );

      if (isNewVer) {
        setSyncFeedback(`🚀 최신 v${targetVersion} 발견! 즉시 업그레이드 적용 중...`);
        await forceAppUpgradeAndReload();
        return;
      }

      setSyncFeedback(res?.message || `v${targetVersion} PC·모바일 데이터 및 최신 업데이트 즉시 반영 완료!`);
      // 최신 버전 및 업데이트 내역 모달 팝업 표시
      setShowUpdateModal(true);
    } catch {
      setSyncFeedback(`v${APP_VERSION} 동기화 완료`);
      setShowUpdateModal(true);
    } finally {
      setSyncingDevices(false);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  const initialProfile = sharedState?.userProfile || loadProfileFromAllVaults() || getPersistentUserProfile();

  const rawInitName = initialProfile?.basic?.name || '';
  const initName = (rawInitName && rawInitName !== '여행자') ? rawInitName : '';
  const rawInitNick = initialProfile?.basic?.nickname || '';
  const initNick = (rawInitNick && rawInitNick !== '여행자') ? rawInitNick : '';

  const [basic, setBasic] = useState({
    name: initName,
    nickname: initNick,
    birthdate: initialProfile?.basic?.birthdate || '',
    birthtime: initialProfile?.basic?.birthtime || '',
    gender: (initialProfile?.basic?.gender || '') as '' | 'male' | 'female' | 'other',
    birthCity: initialProfile?.basic?.birthCity || '',
    lunarSolar: (initialProfile?.basic?.lunarSolar || 'solar') as 'solar' | 'lunar',
  });
  const [fate, setFate] = useState({
    fateInterests: initialProfile?.fate?.fateInterests || ([] as string[]),
    lifeGoal: initialProfile?.fate?.lifeGoal || '',
    currentWorry: initialProfile?.fate?.currentWorry || '',
  });
  const [music, setMusic] = useState({
    favoriteGenres: initialProfile?.music?.favoriteGenres || ([] as string[]),
    instruments: initialProfile?.music?.instruments || ([] as string[]),
    creativeGoal: initialProfile?.music?.creativeGoal || '',
    favoriteArtists: initialProfile?.music?.favoriteArtists || '',
  });
  const [psych, setPsych] = useState({
    mbti: initialProfile?.psych?.mbti || '',
    counselingStyle: (initialProfile?.psych?.counselingStyle || 'mixed') as 'empathy' | 'advice' | 'mixed',
    currentMood: initialProfile?.psych?.currentMood || '',
    personalityKeywords: initialProfile?.psych?.personalityKeywords || ([] as string[]),
  });
  const [art, setArt] = useState({
    favoriteArtStyle: initialProfile?.art?.favoriteArtStyle || ([] as string[]),
    favoritePoets: initialProfile?.art?.favoritePoets || '',
    favoriteColors: initialProfile?.art?.favoriteColors || ([] as string[]),
    artMedium: initialProfile?.art?.artMedium || ([] as string[]),
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      const profile = sharedState?.userProfile || loadProfileFromAllVaults() || getPersistentUserProfile();
      if (!profile) return;
      if (profile.basic) {
        const cleanBasic = { ...profile.basic };
        setBasic((b) => ({ ...b, ...cleanBasic }));
      }
      if (profile.fate) setFate((f) => ({ ...f, ...profile.fate }));
      if (profile.music) setMusic((m) => ({ ...m, ...profile.music }));
      if (profile.psych) setPsych((p) => ({ ...p, ...profile.psych }));
      if (profile.art) setArt((a) => ({ ...a, ...profile.art }));
    };

    handleProfileUpdate();
    window.addEventListener('prism:profile_updated', handleProfileUpdate);
    window.addEventListener('prism:feature_updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('prism:profile_updated', handleProfileUpdate);
      window.removeEventListener('prism:feature_updated', handleProfileUpdate);
    };
  }, [sharedState?.userProfile]);

  // 실시간 디바운스 자동 저장 (입력 중 1.0초 유휴 시 무소음 자동 동기화)
  const isInitialMount = useRef(true);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = window.setTimeout(() => {
      handleSave(true);
    }, 1000);
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [basic, fate, music, psych, art]);

  // 페이지 이탈 또는 백그라운드 전환 시 즉시 저장 플러시
  useEffect(() => {
    const handleBeforeUnload = () => {
      handleSave(true);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleSave(true);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [basic, fate, music, psych, art]);

  const handleSave = async (silent = false) => {
    if (!silent) setSaving(true);
    try {
      const existingProfile = sharedState?.userProfile || loadProfileFromAllVaults() || getPersistentUserProfile() || {};
      const basicData: any = { ...basic };
      if (!basicData.gender) delete basicData.gender;

      const profile: UserProfile = mergeUserProfiles(existingProfile, {
        basic: basicData,
        fate,
        music,
        psych,
        art,
      }, true);

      // 1. 즉시 로컬 볼트 및 브라우저 스토리지에 저장 (0ms 오프라인 보장)
      saveProfileToAllVaults(profile);
      setPersistentUserProfile(profile);

      // 2. 네트워크 동기화가 UI 저장 상태를 무한히 붙잡지 않도록 세이프티 타임아웃(3.5초) 적용
      const syncTimeout = new Promise<void>((resolve) => {
        window.setTimeout(resolve, 3500);
      });

      const updatePromise = updateSharedState({ userProfile: profile }, 'profile').catch((err) => {
        console.error('[Profile] Sync failed:', err);
      });

      await Promise.race([updatePromise, syncTimeout]);

      // 3. Firestore 사용자 프로필 문서 직렬화 및 안전한 비동기 백업
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
          console.warn('[Profile] Direct cloud backup warning:', cloudErr);
        }
      }

      if (!silent) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('[Profile] Save failed:', err);
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const { swipeHandlers: epilogueSwipeHandlers } = useSwipeableTabs<EpilogueSwipeTab>({
    tabs: EPILOGUE_SWIPE_TABS,
    activeTab: activeMode,
    onTabChange: (newTab) => {
      if (activeMode === 'profile' && newTab !== 'profile') {
        handleSave(true);
      }
      setActiveMode(newTab);
    },
    enabled: true,
  });

  const section = SECTIONS[currentSection];
  const SectionIcon = section.icon;

  const renderSection = () => {
    switch (currentSection) {
      case 0: // 기본 정보
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <InputField
              label="실명 *"
              value={basic.name}
              onChange={(v) => setBasic((b) => ({ ...b, name: v }))}
              placeholder="예: 홍길동"
            />
            <InputField
              label="닉네임 (루시 AI가 부를 호칭)"
              value={basic.nickname}
              onChange={(v) => setBasic((b) => ({ ...b, nickname: v }))}
              placeholder="예: 제제"
            />
            <InputField
              label="생년월일"
              value={basic.birthdate}
              type="date"
              onChange={(v) => setBasic((b) => ({ ...b, birthdate: v }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-white/50 mb-1.5 tracking-wider font-sans uppercase">
                  양력 / 음력
                </label>
                <div className="flex rounded-2xl overflow-hidden border border-white/10 p-0.5 bg-white/[0.02] backdrop-blur-md">
                  {(['solar', 'lunar'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBasic((b) => ({ ...b, lunarSolar: type }))}
                      className="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      style={{
                        background: basic.lunarSolar === type ? 'rgba(192, 132, 252, 0.25)' : 'transparent',
                        color: basic.lunarSolar === type ? '#e9d5ff' : 'rgba(255, 255, 255, 0.4)',
                        border: basic.lunarSolar === type ? '1px solid rgba(192, 132, 252, 0.4)' : '1px solid transparent',
                      }}
                    >
                      {type === 'solar' ? '양력' : '음력'}
                    </button>
                  ))}
                </div>
              </div>
              <InputField
                label="태어난 시간"
                value={basic.birthtime}
                type="time"
                onChange={(v) => setBasic((b) => ({ ...b, birthtime: v }))}
              />
            </div>
            <InputField
              label="출생 도시"
              value={basic.birthCity}
              onChange={(v) => setBasic((b) => ({ ...b, birthCity: v }))}
              placeholder="예: 서울, 부산, 대구..."
            />
            <div>
              <label className="block text-xs font-bold text-white/50 mb-1.5 tracking-wider font-sans uppercase">
                성별
              </label>
              <div className="flex gap-2">
                {[
                  { val: 'female', label: '여성' },
                  { val: 'male', label: '남성' },
                  { val: 'other', label: '기타' },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBasic((b) => ({ ...b, gender: val as any }))}
                    className="flex-1 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
                    style={{
                      background: basic.gender === val ? 'rgba(192, 132, 252, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${basic.gender === val ? 'rgba(192, 132, 252, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: basic.gender === val ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                      boxShadow: basic.gender === val ? '0 0 15px rgba(192, 132, 252, 0.25)' : 'none',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 1: // 운명 관심사
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold text-white/50 mb-2 tracking-wider font-sans uppercase">
                관심 있는 분야 (다중 선택)
              </label>
              <TagSelector
                options={FATE_INTERESTS}
                selected={fate.fateInterests}
                onChange={(v) => setFate((f) => ({ ...f, fateInterests: v }))}
                color="#eab308"
              />
            </div>
            <InputField
              label="인생의 주요 목표 / 방향"
              value={fate.lifeGoal}
              onChange={(v) => setFate((f) => ({ ...f, lifeGoal: v }))}
              placeholder="예: 경제적 자유, 내면의 평화, 창작 활동..."
            />
            <InputField
              label="요즘 가장 큰 고민거리"
              value={fate.currentWorry}
              onChange={(v) => setFate((f) => ({ ...f, currentWorry: v }))}
              placeholder="예: 이직 고민, 인간관계, 건강, 사업 방향..."
            />
          </div>
        );
      case 2: // 음악 취향
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold text-white/50 mb-2 tracking-wider font-sans uppercase">
                좋아하는 음악 장르 (다중 선택)
              </label>
              <TagSelector
                options={MUSIC_GENRES}
                selected={music.favoriteGenres}
                onChange={(v) => setMusic((m) => ({ ...m, favoriteGenres: v }))}
                color="#a855f7"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 mb-2 tracking-wider font-sans uppercase">
                다룰 수 있거나 관심 있는 악기 (다중 선택)
              </label>
              <TagSelector
                options={INSTRUMENTS}
                selected={music.instruments}
                onChange={(v) => setMusic((m) => ({ ...m, instruments: v }))}
                color="#a855f7"
              />
            </div>
            <InputField
              label="좋아하는 아티스트 / 뮤지션"
              value={music.favoriteArtists}
              onChange={(v) => setMusic((m) => ({ ...m, favoriteArtists: v }))}
              placeholder="예: 아이유, 쇼팽, 콜드플레이, 요한 세바스찬 바흐..."
            />
            <InputField
              label="음악 &amp; 창작 관련 목표"
              value={music.creativeGoal}
              onChange={(v) => setMusic((m) => ({ ...m, creativeGoal: v }))}
              placeholder="예: 피아노 한 곡 완곡, 나만의 힐링 플레이리스트 제작..."
            />
          </div>
        );
      case 3: // 심리 · 결정
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold text-white/50 mb-2 tracking-wider font-sans uppercase">
                MBTI 유형
              </label>
              <div className="grid grid-cols-4 gap-2">
                {MBTI_LIST.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPsych((p) => ({ ...p, mbti: type }))}
                    className="py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer backdrop-blur-md"
                    style={{
                      background: psych.mbti === type ? 'rgba(249, 115, 22, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${psych.mbti === type ? 'rgba(249, 115, 22, 0.6)' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: psych.mbti === type ? '#fed7aa' : 'rgba(255, 255, 255, 0.5)',
                      boxShadow: psych.mbti === type ? '0 0 12px rgba(249, 115, 22, 0.25)' : 'none',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 mb-2 tracking-wider font-sans uppercase">
                선호하는 AI 상담 스타일
              </label>
              <div className="flex gap-2">
                {[
                  { val: 'empathy', label: '따뜻한 공감형' },
                  { val: 'advice', label: '명확한 솔루션형' },
                  { val: 'mixed', label: '공감 + 솔루션 혼합' },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPsych((p) => ({ ...p, counselingStyle: val as any }))}
                    className="flex-1 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
                    style={{
                      background: psych.counselingStyle === val ? 'rgba(249, 115, 22, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${psych.counselingStyle === val ? 'rgba(249, 115, 22, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: psych.counselingStyle === val ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                      boxShadow: psych.counselingStyle === val ? '0 0 12px rgba(249, 115, 22, 0.2)' : 'none',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <InputField
              label="현재 전반적인 기분 / 마음 상태"
              value={psych.currentMood}
              onChange={(v) => setPsych((p) => ({ ...p, currentMood: v }))}
              placeholder="예: 평온함, 새로운 도전을 앞둔 설렘, 약간의 피로..."
            />
          </div>
        );
      case 4: // 예술 감성
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-bold text-white/50 mb-2 tracking-wider font-sans uppercase">
                선호하는 화풍 &amp; 미술 스타일 (다중 선택)
              </label>
              <TagSelector
                options={ART_STYLES}
                selected={art.favoriteArtStyle}
                onChange={(v) => setArt((a) => ({ ...a, favoriteArtStyle: v }))}
                color="#38bdf8"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 mb-2 tracking-wider font-sans uppercase">
                선호하는 색감 &amp; 은하 톤 (다중 선택)
              </label>
              <TagSelector
                options={ART_COLORS}
                selected={art.favoriteColors}
                onChange={(v) => setArt((a) => ({ ...a, favoriteColors: v }))}
                color="#38bdf8"
              />
            </div>
            <InputField
              label="좋아하는 시인 / 작가 / 책"
              value={art.favoritePoets}
              onChange={(v) => setArt((a) => ({ ...a, favoritePoets: v }))}
              placeholder="예: 윤동주, 헤르만 헤세, 라이너 마리아 릴케, 어린 왕자..."
            />
          </div>
        );
      case 5: // 운명 카드 프리뷰
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200/90 font-sans leading-relaxed flex items-center gap-2.5">
              <Sparkles size={16} className="text-yellow-400 shrink-0" />
              <span>입력하신 생년월일과 시간을 기반으로 산출된 실시간 천문 사주 카드입니다.</span>
            </div>
            <SajuCardView
              profile={{
                basic: { ...basic, gender: basic.gender || undefined },
                fate,
                music,
                psych,
                art,
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-app-full w-full flex flex-col relative overflow-hidden font-sans bg-transparent">
      {/* Galaxy Milky Way Ambient Particles */}
      {!legacy && <FloatingParticles count={narrow ? 5 : 22} />}

      {/* Galaxy Nebulae Glow Orbs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full bg-pink-600/15 blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none z-0" />


      {/* Header Info Bar (Matching other channels) */}
      <motion.div
        initial={{ y: -8, opacity: 0.88 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="prism-hub-header fixed top-safe-2 left-2 sm:left-4 md:top-safe-4 md:left-6 pointer-events-auto z-[110] transition-opacity duration-300"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            className="relative w-11 h-11 rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] group backdrop-blur-md cursor-pointer transition-transform active:scale-95 shrink-0"
            onClick={() => openChannelIntro('epilogue')}
            title="에필로그 밤 서재 채널 소개 (클릭)"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-emerald-400/40 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all"
            />
            <div className="absolute inset-[3px] rounded-full border border-emerald-400/30 bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center transition-all">
              <Moon
                size={20}
                className="relative z-10 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] transition-transform group-hover:scale-110 duration-300 animate-pulse"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div className="cursor-pointer flex flex-col justify-center select-none" onClick={() => navigate('/')}>
            <h1>
              <LucKeyLogoText />
            </h1>
            <p className="text-[8px] md:text-[9px] text-purple-300/60 uppercase tracking-widest font-bold font-sans leading-none mt-0.5">
              EPILOGUE • SOUL SANCTUARY
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top Right Cloud Sync Status Indicator */}
      <motion.div
        initial={{ y: -8, opacity: 0.88 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-safe-2 right-2 sm:right-4 md:top-safe-4 md:right-6 pointer-events-auto z-[110] flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => {
            if (activeMode !== 'profile') {
              setActiveMode('profile');
              setCurrentSection(0);
            } else {
              handleSyncDevices();
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-sans font-bold backdrop-blur-xl border transition-all cursor-pointer shadow-lg active:scale-95 ${
            firebaseUser
              ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/20'
              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
          }`}
          title={firebaseUser ? `${firebaseUser.displayName || '구글 사용자'} 계정으로 실시간 동기화 중 (클릭 시 즉시 동기화)` : '게스트 모드 (클릭하여 계정 연동 및 설정)'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              firebaseUser
                ? 'bg-emerald-400 animate-pulse ring-2 ring-emerald-400/40'
                : 'bg-amber-400 ring-2 ring-amber-400/40'
            }`}
          />
          <span className="hidden sm:inline">{firebaseUser ? (syncingDevices ? '동기화 중...' : '클라우드 동기화') : '게스트 (동기화 설정)'}</span>
          <span className="sm:hidden">{firebaseUser ? (syncingDevices ? '동기화...' : '동기화됨') : '게스트'}</span>
        </button>
      </motion.div>

      {/* Navigation Subnav Menu (Diary & Synergy & Profile Sections) */}
      <motion.nav
        initial={{ y: -10, x: '-50%', opacity: 0.88 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`prism-xs-subnav fixed top-safe-nav md:top-safe-nav-md left-1/2 z-[100] flex items-center gap-1 p-1 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl max-w-[95vw] overflow-x-auto no-scrollbar md:max-w-fit md:overflow-visible transition-opacity duration-300 ${isSpecialFeatureChromeHidden ? SPECIAL_FEATURE_CHROME_HIDDEN_CLASS : 'opacity-100'}`}
      >
        {[
          { id: 'diary', icon: BookOpen, label: 'Diary' },
          { id: 'synergy', icon: Sparkles, label: 'CHRONICLE' },
          { id: 'profile', icon: User, label: 'Profile' },
        ].map((item) => {
          const isActive = activeMode === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (activeMode === 'profile' && item.id !== 'profile') {
                  handleSave(true);
                }
                setActiveMode(item.id as any);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold font-sans transition-all duration-300 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/40 via-pink-500/30 to-purple-500/40 text-white border border-purple-400/50 shadow-[0_0_15px_rgba(192,132,252,0.3)] scale-[1.02]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-purple-300 animate-pulse' : 'text-white/40'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </motion.nav>

      {/* Main Content Area */}
      <div data-app-scroll-root {...epilogueSwipeHandlers} className="flex-1 w-full overflow-x-hidden overflow-y-auto flex flex-col no-scrollbar z-10 pb-28 sm:pb-32">
        {activeMode === 'synergy' ? (
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-home md:pt-home-md space-y-6">
            <EpilogueSynergySection />
          </div>
        ) : activeMode === 'diary' ? (
          <EpilogueDiaryView />
        ) : (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-home md:pt-home-md space-y-6">
            {/* Step Sub-Pills for Profile */}
            <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-x-auto no-scrollbar max-w-full">
              {SECTIONS.map((item, idx) => {
                const isActive = currentSection === idx;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleSave(true);
                      setCurrentSection(idx);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold font-sans transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-purple-500/30 text-white border border-purple-400/40 shadow-sm'
                        : 'text-white/40 hover:text-white/75 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon size={13} className={isActive ? 'text-purple-300' : 'text-white/40'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Section Form Card */}
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="glass p-6 sm:p-8 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl space-y-6 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(192,132,252,0.2)]"
                    style={{ background: `${section.color}25` }}
                  >
                    <SectionIcon size={20} style={{ color: section.color }} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold font-sans text-white tracking-tight">
                      {section.label}
                    </h2>
                    <p className="text-xs text-white/45 font-sans">{section.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-purple-300/80 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                    {currentSection + 1} / {SECTIONS.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer shadow-lg shadow-purple-500/20 active:scale-95 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white border border-purple-300/30"
                  >
                    {saving ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : saved ? (
                      <Check size={14} className="text-white animate-bounce" />
                    ) : (
                      <Save size={14} />
                    )}
                    <span>{saved ? '저장됨' : '저장'}</span>
                  </button>
                </div>
              </div>

              <div className="relative z-10">{renderSection()}</div>

              {/* Bottom Step Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10 relative z-10">
                <button
                  type="button"
                  disabled={currentSection === 0}
                  onClick={() => {
                    handleSave(true);
                    setCurrentSection((s) => Math.max(0, s - 1));
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white/40 hover:text-white disabled:opacity-20 transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span>이전 단계</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSave(true);
                    if (currentSection < SECTIONS.length - 1) {
                      setCurrentSection((s) => s + 1);
                    } else {
                      handleSave(false);
                    }
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/10 shadow-md"
                >
                  <span>{currentSection < SECTIONS.length - 1 ? '다음 단계' : '완료 & 저장'}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>

            {/* 🌟 현재 로그인된 구글 계정 및 클라우드 동기화 상태 (Google Cloud Account Status Bar) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="glass p-5 sm:p-6 rounded-[32px] border border-purple-500/20 shadow-2xl backdrop-blur-2xl relative overflow-hidden space-y-4 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-indigo-500/5 opacity-50 pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Google Avatar or Icon */}
                  <div className="relative shrink-0">
                    {firebaseUser?.photoURL ? (
                      <img
                        src={firebaseUser.photoURL}
                        alt={firebaseUser.displayName || 'Google User'}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-400/40 shadow-md ring-2 ring-white/10"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center shadow-md">
                        <GoogleLogo className="w-6 h-6" />
                      </div>
                    )}
                    {firebaseUser && (
                      <span
                        className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black ring-1 ring-emerald-300 animate-pulse"
                        title="Google Cloud 실시간 연결됨"
                      />
                    )}
                  </div>

                  {/* Account Details */}
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <GoogleLogo className="w-3.5 h-3.5" />
                        현재 로그인된 구글 계정
                      </span>
                      {firebaseUser ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          로그인됨
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                          게스트 상태
                        </span>
                      )}
                    </div>

                    <div className="text-sm sm:text-base font-bold text-white truncate">
                      {firebaseUser?.displayName || (firebaseUser ? '구글 사용자' : '로그인된 구글 계정 없음')}
                    </div>

                    <div className="text-xs font-mono text-purple-200/80 truncate flex items-center gap-1.5">
                      <Mail size={12} className="text-white/40 shrink-0" />
                      <span className="truncate">{firebaseUser?.email || 'PC와 모바일 실시간 연동을 위해 구글 계정으로 로그인해주세요.'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {firebaseUser ? (
                    <>
                      <button
                        type="button"
                        disabled={syncingDevices}
                        onClick={handleSyncDevices}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5 border border-white/10"
                        title="PC와 모바일 기기간 데이터 즉시 동기화"
                      >
                        {syncingDevices ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>동기화 중...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw size={13} className="text-emerald-400" />
                            <span>기기 즉시 동기화</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => logout && logout()}
                        className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/50 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
                        title="로그아웃"
                      >
                        <LogOut size={15} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => signInWithGoogle()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-lg active:scale-95 flex items-center gap-2 border border-purple-400/30"
                    >
                      <GoogleLogo className="w-4 h-4" />
                      <span>Google 로그인</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Live Sync Status Feedback */}
              {syncFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 font-mono relative z-10"
                >
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>{syncFeedback}</span>
                </motion.div>
              )}

              {/* PC ⇄ 모바일 6자리 초고속 기기 연동 패널 */}
              <div className="pt-2 border-t border-white/10 relative z-10">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowPairingPanel(!showPairingPanel)}
                    className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>⚡ PC ⇄ 모바일 6자리 기기 즉시 연동 (사주/타로/대화/경전)</span>
                    <span className="text-[10px] text-white/40">{showPairingPanel ? '▲ 접기' : '▼ 열기'}</span>
                  </button>
                </div>

                {showPairingPanel && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3.5 rounded-2xl bg-black/40 border border-amber-500/30 flex flex-col gap-3"
                  >
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      구글 로그인 여부와 관계없이, 한쪽 기기에서 생성한 6자리 코드를 다른 기기에 입력하면 모든 대화, 프로필, 사주/타로 기록이 즉시 복사 및 연동됩니다.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* 내 기기 코드 생성 */}
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                        <span className="text-xs font-bold text-white/80">내 기기 데이터 내보내기</span>
                        {pairingGenCode ? (
                          <div className="flex items-center justify-between bg-black/60 px-3 py-2 rounded-lg border border-amber-500/40">
                            <span className="text-lg font-black tracking-widest text-amber-400 font-mono">{pairingGenCode}</span>
                            <span className="text-[10px] text-white/40">10분간 유효</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={pairingBusy}
                            onClick={async () => {
                              setPairingBusy(true);
                              try {
                                const res = await generateDevicePairingCode();
                                if (res?.code) {
                                  setPairingGenCode(res.code);
                                  setPairingMsg('✅ 6자리 코드가 생성되었습니다. 다른 기기에 입력하세요.');
                                }
                              } catch {
                                setPairingMsg('❌ 연동 코드 생성 실패');
                              } finally {
                                setPairingBusy(false);
                              }
                            }}
                            className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer text-center"
                          >
                            {pairingBusy ? '생성 중...' : '연동 핀코드 생성'}
                          </button>
                        )}
                      </div>

                      {/* 다른 기기 코드 입력 */}
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                        <span className="text-xs font-bold text-white/80">다른 기기 데이터 가져오기</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="6자리 숫자"
                            value={pairingInputCode}
                            onChange={(e) => setPairingInputCode(e.target.value.trim())}
                            className="flex-1 px-3 py-1.5 bg-black/60 rounded-lg text-xs font-mono tracking-widest text-center text-white border border-white/15 outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            disabled={pairingBusy || pairingInputCode.length !== 6}
                            onClick={async () => {
                              setPairingBusy(true);
                              setPairingMsg('데이터 동기화 진행 중...');
                              try {
                                const res = await importDevicePairingCode(pairingInputCode);
                                if (res?.success) {
                                  setPairingMsg('🎉 기기 연동 완료! 모든 데이터가 동기화되었습니다.');
                                } else {
                                  setPairingMsg('❌ ' + (res?.message || '연동 실패'));
                                }
                              } catch (err: any) {
                                setPairingMsg('❌ 연동 실패: ' + (err?.message || '오류'));
                              } finally {
                                setPairingBusy(false);
                              }
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold rounded-lg text-xs transition-all cursor-pointer shrink-0"
                          >
                            {pairingBusy ? '...' : '가져오기'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {pairingMsg && (
                      <p className="text-[11px] text-center text-amber-300 font-medium py-1 px-2 rounded bg-amber-500/10 border border-amber-500/20">
                        {pairingMsg}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Cloud User ID & Cloud Link Footer */}
              {firebaseUser && (
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-white/35 font-mono relative z-10">
                  <span className="truncate max-w-xs">UID: {firebaseUser.uid}</span>
                  <span className="text-emerald-400/70 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Google Cloud 실시간 동기화 활성 · v{APP_VERSION}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Update Notice & Changelog Modal */}
      <UpdateNoticeModal
        isOpen={showUpdateModal}
        entries={updateEntries}
        mode="manual"
        onClose={() => setShowUpdateModal(false)}
      />

    </div>
  );
}
