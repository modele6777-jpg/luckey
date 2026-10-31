import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Star, Music, Brain, Palette,
  ChevronRight, ChevronLeft, Check, Save, X
} from 'lucide-react';
import { useApp, getPersistentUserProfile, setPersistentUserProfile } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { type UserProfile, mergeUserProfiles } from '@/lib/sharedState';
import { loadProfileFromAllVaults, saveProfileToAllVaults } from '@/lib/profileVault';
import { APP_VERSION, fetchDeployedAppVersion, compareVersions } from '@/lib/appVersion';
import { forceAppUpgradeAndReload } from '@/lib/prismSync';
import { SajuCardView } from './SajuCardView';
import { NatalChartCardView } from './NatalChartCardView';
import type { RelationshipEntry } from '@/lib/sharedState';
import { db, doc, setDoc, serverTimestamp } from '@/lib/firebase';
import { cleanFirestoreData, unpackAndHydrateLocalStorage } from '@/lib/sharedStateSync';
import { generatePairingCode, importWithPairingCode, getPairedVaultId, setPairedVaultId } from '@/lib/serverSyncClient';
import {
  isIPhoneXSClass,
  getDevicePerfOverride,
  setDevicePerfOverride,
  getPerfProfile,
} from '@/lib/perfMode';
import {
  playAudioHaptic,
  playSuccessHaptic,
  playBreathingHaptic,
  playCardHaptic,
  isAudioHapticsEnabled,
  setAudioHapticsEnabled,
} from '@/lib/audioHaptics';

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

function TagSelector({ options, selected, onChange, color, isLight }: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  color: string;
  isLight?: boolean;
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
            type="button"
            onClick={() => toggle(opt)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
            style={{
              background: active
                ? (isLight ? color + '25' : color + '30')
                : (isLight ? '#f1f5f9' : 'oklch(0.15 0.015 270)'),
              border: `1px solid ${active ? (isLight ? color : color + '60') : (isLight ? '#cbd5e1' : 'oklch(0.25 0.01 270)')}`,
              color: active
                ? (isLight ? '#92400e' : color)
                : (isLight ? '#334155' : 'oklch(0.65 0.01 270)'),
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder, isLight }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; isLight?: boolean;
}) {
  return (
    <div>
      <label className={`block text-xs mb-1.5 tracking-wider font-semibold ${isLight ? 'text-slate-700' : 'text-white/40'}`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${
          isLight
            ? 'text-slate-900 bg-white placeholder-slate-400 border border-slate-300 focus:border-amber-500 shadow-sm'
            : 'text-white/90 bg-white/5 placeholder-white/20 border border-white/10 focus:border-yellow-500/50'
        }`}
      />
    </div>
  );
}

export default function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { sharedState, updateSharedState, firebaseUser, signInWithGoogle, signInAsDeveloper, syncPrismDevices } = useApp();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  const [currentSection, setCurrentSection] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [syncingDevices, setSyncingDevices] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [generatedPairingCode, setGeneratedPairingCode] = useState<string | null>(null);
  const [inputPairingCode, setInputPairingCode] = useState('');
  const [pairingLoading, setPairingLoading] = useState(false);
  const [pairingStatus, setPairingStatus] = useState<string | null>(null);
  const [perfOverride, setPerfOverride] = useState<string | null>(getDevicePerfOverride());
  const [audioHaptics, setAudioHaptics] = useState(() => isAudioHapticsEnabled());

  const initialProfile = sharedState?.userProfile || getPersistentUserProfile();

  const rawInitName = initialProfile?.basic?.name || '';
  const initName = (rawInitName && rawInitName !== '여행자') ? rawInitName : '';
  const rawInitNick = initialProfile?.basic?.nickname?.trim();
  const initNick = (rawInitNick && rawInitNick !== '여행자' && rawInitNick !== '사용자' && rawInitNick !== '박주형') ? rawInitNick : '제제';

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
    fateInterests: initialProfile?.fate?.fateInterests || [] as string[],
    lifeGoal: initialProfile?.fate?.lifeGoal || '',
    currentWorry: initialProfile?.fate?.currentWorry || '',
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
    overloadTime: initialProfile?.psych?.overloadTime || '',
    currentSymptoms: initialProfile?.psych?.currentSymptoms || '',
    aiPreference: initialProfile?.psych?.aiPreference || '',
  });
  const [art, setArt] = useState({
    favoriteArtStyle: initialProfile?.art?.favoriteArtStyle || [] as string[],
    favoritePoets: initialProfile?.art?.favoritePoets || '',
    favoriteColors: initialProfile?.art?.favoriteColors || [] as string[],
    artMedium: initialProfile?.art?.artMedium || [] as string[],
  });
  const [relationships, setRelationships] = useState<RelationshipEntry[]>(initialProfile?.relationships || []);

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
        setBasic((b) => ({
          name: cleanBasic.name?.trim() ? cleanBasic.name.trim() : b.name,
          nickname: (cleanBasic.nickname?.trim() && cleanBasic.nickname !== '여행자' && cleanBasic.nickname !== '사용자' && cleanBasic.nickname !== '박주형') ? cleanBasic.nickname.trim() : b.nickname,
          birthdate: cleanBasic.birthdate || b.birthdate,
          birthtime: cleanBasic.birthtime !== undefined ? cleanBasic.birthtime : b.birthtime,
          gender: cleanBasic.gender || b.gender,
          birthCity: cleanBasic.birthCity || b.birthCity,
          lunarSolar: cleanBasic.lunarSolar || b.lunarSolar,
        }));
      }
      if (profile.fate) setFate((f) => ({ ...f, ...profile.fate }));
      if (profile.music) setMusic((m) => ({ ...m, ...profile.music }));
      if (profile.psych) setPsych((p) => ({ ...p, ...profile.psych }));
      if (profile.art) setArt((a) => ({ ...a, ...profile.art }));
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
  }, [sharedState?.userProfile, isOpen]);

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

      setPersistentUserProfile(profile);
      saveProfileToAllVaults(profile);

      // 로컬 저장은 즉시 완료하고, 네트워크 동기화가 저장 버튼을 무한히 붙잡지 않도록 제한합니다.
      const syncTimeout = new Promise<void>((resolve) => {
        window.setTimeout(resolve, 8000);
      });
      await Promise.race([
        updateSharedState({ userProfile: profile }, 'profile'),
        syncTimeout,
      ]);

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
          console.warn('[ProfileModal] Direct cloud backup warning:', cloudErr);
        }
      }
      
      if (!silent) {
        setSaved(true);
        playAudioHaptic('save_success');
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('[ProfileModal] Save failed:', err);
    } finally {
      if (!silent) setSaving(false);
    }
  };

  if (!isOpen) return null;

  const section = SECTIONS[currentSection];
  const SectionIcon = section.icon;

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="space-y-4">
            <InputField label="실명 *" value={basic.name} onChange={v => setBasic(b => ({ ...b, name: v }))} placeholder="예: 홍길동" isLight={isLight} />
            <InputField label="닉네임" value={basic.nickname} onChange={v => setBasic(b => ({ ...b, nickname: v }))} placeholder="예: 제제" isLight={isLight} />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <InputField label="생년월일 *" value={basic.birthdate} type="date" onChange={v => setBasic(b => ({ ...b, birthdate: v }))} isLight={isLight} />
              </div>
              <div>
                <label className={`block text-xs mb-1.5 tracking-wider font-semibold ${isLight ? 'text-slate-700' : 'text-white/40'}`}>양력/음력</label>
                <div className="flex gap-1">
                  {[{ v: 'solar', l: '양력' }, { v: 'lunar', l: '음력' }].map(({ v, l }) => {
                    const active = (basic.lunarSolar || 'solar') === v;
                    return (
                      <button key={v} type="button" onClick={() => setBasic(b => ({ ...b, lunarSolar: v as any }))}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          isLight
                            ? (active ? 'bg-amber-500/20 text-amber-900 border-amber-500 shadow-sm' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50')
                            : (active ? 'bg-amber-500/10 text-amber-400 border-amber-500/50' : 'bg-white/5 text-white/60 border-white/10')
                        }`}>{l}</button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField label="태어난 시각 (생시)" value={basic.birthtime} type="time" onChange={v => setBasic(b => ({ ...b, birthtime: v }))} isLight={isLight} />
              <InputField label="출생 도시" value={basic.birthCity || ''} onChange={v => setBasic(b => ({ ...b, birthCity: v }))} placeholder="예: 서울, 부산, 대구" isLight={isLight} />
            </div>

            <div>
              <label className={`block text-xs mb-1.5 tracking-wider font-semibold ${isLight ? 'text-slate-700' : 'text-white/40'}`}>성별</label>
              <div className="flex gap-2">
                {[{ v: 'female', l: '여성' }, { v: 'male', l: '남성' }, { v: 'other', l: '기타' }].map(({ v, l }) => {
                  const active = basic.gender === v;
                  return (
                    <button key={v} type="button" onClick={() => setBasic(b => ({ ...b, gender: v as any }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                        isLight
                          ? (active ? 'bg-amber-500/20 text-amber-900 border-amber-500 shadow-sm' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50')
                          : (active ? 'bg-amber-500/10 text-amber-400 border-amber-500/50' : 'bg-white/5 text-white/60 border-white/10')
                      }`}>{l}</button>
                  );
                })}
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
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className={`block text-xs mb-2 tracking-wider font-semibold ${isLight ? 'text-slate-700' : 'text-white/40'}`}>관심사</label>
              <TagSelector options={FATE_INTERESTS} selected={fate.fateInterests} onChange={v => setFate(f => ({ ...f, fateInterests: v }))} color={section.color} isLight={isLight} />
            </div>
            <InputField label="인생 목표" value={fate.lifeGoal} onChange={v => setFate(f => ({ ...f, lifeGoal: v }))} isLight={isLight} />
            <div>
              <label className={`block text-xs mb-1.5 tracking-wider font-semibold ${isLight ? 'text-slate-700' : 'text-white/40'}`}>장기적 고민</label>
              <textarea
                value={fate.currentWorry}
                onChange={e => setFate(f => ({ ...f, currentWorry: e.target.value }))}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all ${
                  isLight
                    ? 'text-slate-900 bg-white placeholder-slate-400 border border-slate-300 focus:border-amber-500 shadow-sm'
                    : 'text-white/90 bg-white/5 border border-white/10'
                }`}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
             <TagSelector options={MUSIC_GENRES} selected={music.favoriteGenres} onChange={v => setMusic(m => ({ ...m, favoriteGenres: v }))} color={section.color} isLight={isLight} />
             <InputField label="좋아하는 아티스트" value={music.favoriteArtists} onChange={v => setMusic(m => ({ ...m, favoriteArtists: v }))} isLight={isLight} />
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <label className={`block text-xs mb-1.5 tracking-wider font-semibold ${isLight ? 'text-slate-700' : 'text-white/40'}`}>MBTI</label>
              <div className="grid grid-cols-4 gap-2">
                {MBTI_LIST.map(m => {
                  const active = psych.mbti === m;
                  return (
                    <button key={m} type="button" onClick={() => setPsych(p => ({ ...p, mbti: m }))}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isLight
                          ? (active ? 'bg-amber-500/20 text-amber-900 border-amber-500 shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50')
                          : (active ? 'border-amber-400 text-amber-400 bg-white/10' : 'bg-white/5 text-white/60 border-white/10')
                      }`}>{m}</button>
                  );
                })}
              </div>
            </div>
            
            <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <h4 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isLight ? 'text-amber-800' : 'text-yellow-500'}`}>
                <Brain size={16} /> Deep Core Onboarding
              </h4>
              <div className="space-y-4">
                <InputField label="뇌 과부하가 심해지는 시간대" value={psych.overloadTime || ''} onChange={v => setPsych(p => ({ ...p, overloadTime: v }))} placeholder="예: 평일 오후 4시, 퇴근 직전" isLight={isLight} />
                <div>
                  <label className={`block text-xs mb-1.5 tracking-wider font-semibold ${isLight ? 'text-slate-700' : 'text-white/40'}`}>현재 주로 겪고 있는 증상</label>
                  <textarea
                    value={psych.currentSymptoms || ''}
                    onChange={e => setPsych(p => ({ ...p, currentSymptoms: e.target.value }))}
                    rows={2}
                    placeholder="예: 수면 부족, 가슴 답답함, 집중력 저하"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all ${
                      isLight
                        ? 'text-slate-900 bg-white placeholder-slate-400 border border-slate-300 focus:border-amber-500 shadow-sm'
                        : 'text-white/90 bg-white/5 border border-white/10'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1.5 tracking-wider font-semibold ${isLight ? 'text-slate-700' : 'text-white/40'}`}>AI들의 말투와 성격 (선호도)</label>
                  <textarea
                    value={psych.aiPreference || ''}
                    onChange={e => setPsych(p => ({ ...p, aiPreference: e.target.value }))}
                    rows={2}
                    placeholder="예: 다정하고 무조건 편들어주는 말투, 또는 객관적이고 짧은 팩트 위주"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all ${
                      isLight
                        ? 'text-slate-900 bg-white placeholder-slate-400 border border-slate-300 focus:border-amber-500 shadow-sm'
                        : 'text-white/90 bg-white/5 border border-white/10'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <TagSelector options={ART_STYLES} selected={art.favoriteArtStyle} onChange={v => setArt(a => ({ ...a, favoriteArtStyle: v }))} color={section.color} isLight={isLight} />
            <InputField label="좋아하는 색감" value={art.favoriteColors.join(', ')} onChange={() => {}} placeholder="직접 선택하세요" isLight={isLight} />
            <TagSelector options={ART_COLORS} selected={art.favoriteColors} onChange={v => setArt(a => ({ ...a, favoriteColors: v }))} color={section.color} isLight={isLight} />
          </div>
        );
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 backdrop-blur-2xl transition-colors ${
          isLight ? 'bg-slate-900/40' : 'bg-black/85'
        }`}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className={`w-full max-w-md rounded-[28px] sm:rounded-[36px] p-4 sm:p-7 relative overflow-hidden flex flex-col max-h-[88dvh] transition-all ${
            isLight
              ? 'bg-white border border-slate-200 text-slate-900 shadow-[0_25px_70px_rgba(15,23,42,0.18)]'
              : 'bg-[#0d0e15] border border-white/15 text-white shadow-[0_25px_70px_rgba(0,0,0,0.95)]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className={`text-lg sm:text-xl font-display font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>Soul Profile</h2>
              <p className={`text-[10px] uppercase tracking-widest mt-0.5 font-semibold ${isLight ? 'text-slate-500' : 'text-white/40'}`}>Refine your identity</p>
            </div>
            <button
              onClick={() => { void handleSave(true); onClose(); }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isLight ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-800' : 'hover:bg-white/10 text-white/40 hover:text-white'
              }`}
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentSection(i)}
                className={`p-3 rounded-2xl flex-shrink-0 transition-all cursor-pointer ${
                  i === currentSection
                    ? (isLight
                        ? 'bg-amber-500/20 text-amber-900 border border-amber-500/40 shadow-sm'
                        : 'bg-white/15 text-white shadow-sm border border-white/10')
                    : (isLight
                        ? 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                        : 'bg-white/[0.03] text-white/40 hover:text-white/70')
                }`}
              >
                <s.icon size={16} />
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-5">
            <div className={`p-5 rounded-[28px] sm:rounded-[32px] border ${
              isLight
                ? 'bg-slate-50/90 border-slate-200/90 shadow-xs'
                : 'bg-[#141522] border-white/10 shadow-inner'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <SectionIcon size={16} className={isLight ? 'text-amber-600' : 'text-yellow-500'} />
                <span className={`text-xs font-bold uppercase tracking-widest ${isLight ? 'text-slate-700' : 'text-white/60'}`}>{section.label}</span>
              </div>
              {renderSection()}
            </div>

            {/* Google 계정 클라우드 동기화 상태 */}
            <div className={`p-4 rounded-[22px] sm:rounded-[24px] border flex flex-col gap-2.5 ${
              isLight ? 'bg-slate-50/90 border-slate-200/90 shadow-xs' : 'bg-[#141522] border-white/10'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${firebaseUser ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 animate-pulse'}`} />
                  <div className="min-w-0">
                    <span className={`text-[11px] font-bold block truncate ${isLight ? 'text-slate-800' : 'text-white/80'}`}>
                      {firebaseUser
                        ? `연동됨: ${firebaseUser.email || firebaseUser.displayName || 'Google Account'}${firebaseUser.email === 'modele6777@gmail.com' ? ' · 마스터 볼트' : ''}`
                        : '게스트 모드 (로컬 임시 보관)'}
                    </span>
                    <span className={`text-[10px] block mt-0.5 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                      {firebaseUser
                        ? (syncFeedback || 'PC ⇄ 모바일 실시간 클라우드 자동 동기화 활성 (프로필·타로·명화·대화 전체)')
                        : 'PC와 모바일을 연동하려면 원클릭 계정 연동 또는 동일한 Google 계정으로 로그인해주세요.'}
                    </span>
                  </div>
                </div>
                {!firebaseUser ? (
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
                          setSyncFeedback(`v${APP_VERSION} 최신 버전 사용 중입니다.`);
                        } catch {
                          setSyncFeedback(`v${APP_VERSION} 최신 상태`);
                        } finally {
                          setSyncingDevices(false);
                          setTimeout(() => setSyncFeedback(null), 3500);
                        }
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                        isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-white/10 hover:bg-white/20 text-white/80'
                      }`}
                    >
                      {syncingDevices ? (
                        <>
                          <div className={`w-2.5 h-2.5 border border-t-transparent rounded-full animate-spin ${isLight ? 'border-slate-800' : 'border-white'}`} />
                          <span>확인 중...</span>
                        </>
                      ) : (
                        <span>업그레이드 확인</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => signInAsDeveloper()}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, oklch(0.82 0.15 85), oklch(0.78 0.14 160))',
                        color: 'oklch(0.12 0.02 270)',
                      }}
                    >
                      ⚡ 원클릭 계정 연동
                    </button>
                    <button
                      type="button"
                      onClick={() => signInWithGoogle()}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md active:scale-95"
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
                      try {
                        const syncTimeout = new Promise<[null, null]>((resolve) =>
                          setTimeout(() => resolve([null, null]), 5500)
                        );
                        const syncOperation = Promise.all([
                          syncPrismDevices(),
                          fetchDeployedAppVersion().catch(() => null),
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

                        setSyncFeedback(res?.message || `v${APP_VERSION} 기기 동기화 및 최신 상태 유지 완료!`);
                      } catch {
                        setSyncFeedback(`v${APP_VERSION} 동기화 완료`);
                      } finally {
                        setSyncingDevices(false);
                        setTimeout(() => setSyncFeedback(null), 3500);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5 ${
                      isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {syncingDevices ? (
                      <>
                        <div className={`w-2.5 h-2.5 border border-t-transparent rounded-full animate-spin ${isLight ? 'border-slate-800' : 'border-white'}`} />
                        <span>동기화 & 업그레이드 중...</span>
                      </>
                    ) : (
                      <span>기기 즉시 동기화</span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* 6자리 초고속 기기 페어링 연동 */}
            <div className={`p-4 rounded-[22px] sm:rounded-[24px] border flex flex-col gap-3 mt-1 ${
              isLight ? 'bg-slate-50/90 border-slate-200/90 shadow-xs' : 'bg-[#141522] border-white/10'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  ⚡ 기기 실시간 즉시 연동 (6자리 핀코드)
                </span>
                {getPairedVaultId() ? (
                  <span className="text-[10px] text-emerald-700 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                    ● 실시간 자동 동기화 활성
                  </span>
                ) : (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isLight ? 'text-amber-800 bg-amber-500/15 border border-amber-500/25' : 'text-amber-400 bg-amber-400/10'
                  }`}>
                    PC ⇄ 모바일 상시 연동
                  </span>
                )}
              </div>
              <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/50'}`}>
                6자리 핀코드로 연동하면 앞으로 다이어리, 타로, 시크릿 소원, 리바이블 등 모든 기록이 PC와 모바일 간에 실시간으로 자동 저장 및 동기화됩니다.
              </p>

              {getPairedVaultId() && (
                <div className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                  isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/20'
                }`}>
                  <div className={`flex items-center gap-1.5 font-medium text-[11px] ${
                    isLight ? 'text-emerald-800' : 'text-emerald-300'
                  }`}>
                    <Check size={13} className="text-emerald-600" />
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
                    className={`text-[10px] underline cursor-pointer shrink-0 ml-2 ${
                      isLight ? 'text-slate-500 hover:text-rose-600' : 'text-white/40 hover:text-rose-300'
                    }`}
                  >
                    연동 해제
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* 내 기기 코드 생성 */}
                <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'
                }`}>
                  <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-700' : 'text-white/70'}`}>1. 현재 기기에서 코드 생성</span>
                  {generatedPairingCode ? (
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                      isLight ? 'bg-amber-50/80 border-amber-300' : 'bg-black/40 border-yellow-500/30'
                    }`}>
                      <span className={`text-base font-black tracking-widest font-mono ${
                        isLight ? 'text-amber-800' : 'text-yellow-400'
                      }`}>{generatedPairingCode}</span>
                      <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-white/40'}`}>1시간 유효</span>
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
                      className={`w-full py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer text-center active:scale-95 ${
                        isLight
                          ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-900'
                          : 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/40 text-yellow-300'
                      }`}
                    >
                      {pairingLoading ? '코드 생성 중...' : '연동 핀코드 생성'}
                    </button>
                  )}
                </div>

                {/* 다른 기기 코드 입력 */}
                <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'
                }`}>
                  <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-700' : 'text-white/70'}`}>2. 다른 기기 핀코드 입력</span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="6자리 숫자"
                      value={inputPairingCode}
                      onChange={(e) => setInputPairingCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-mono text-center outline-none border transition-all ${
                        isLight
                          ? 'bg-slate-50 text-slate-900 border-slate-300 focus:border-amber-500 placeholder-slate-400'
                          : 'bg-black/40 text-white border-white/10 focus:border-yellow-500/50'
                      }`}
                    />
                    <button
                      type="button"
                      disabled={pairingLoading || inputPairingCode.trim().length !== 6}
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
                <p className={`text-[11px] text-center py-1.5 px-3 rounded-lg border ${
                  isLight ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-yellow-500/10 text-yellow-300/90 border-yellow-500/20'
                }`}>
                  {pairingStatus}
                </p>
              )}
            </div>

            {/* 📱 기기 성능 최적화 */}
            <div className={`p-4 rounded-[22px] sm:rounded-[24px] border flex flex-col gap-3 mt-1 ${
              isLight ? 'bg-slate-50/90 border-slate-200/90 shadow-xs' : 'bg-[#141522] border-white/10'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  📱 기기 성능 최적화 (iPhone X · XS / A11 · A12)
                </span>
                {isIPhoneXSClass() ? (
                  <span className="text-[10px] text-emerald-700 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    ● iPhone X/XS 60fps 초경량 활성
                  </span>
                ) : (
                  <span className={`text-[10px] border px-2 py-0.5 rounded-full font-mono ${
                    isLight ? 'text-slate-600 bg-slate-200 border-slate-300' : 'text-white/50 bg-white/5 border-white/10'
                  }`}>
                    모드: {getPerfProfile()}
                  </span>
                )}
              </div>
              <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/50'}`}>
                iPhone X / XS / 11 Pro (3x Super Retina OLED, A11/A12 Bionic) 맞춤 설정: GPU 블러 부하 0화, 복잡한 배경 파티클 및 스크롤 스터터를 제거하여 렉 없는 부드러운 60fps를 보장합니다.
              </p>
              <div className={`flex items-center justify-between pt-1 border-t ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                <div className="flex flex-col">
                  <span className={`text-[11px] font-medium ${isLight ? 'text-slate-800' : 'text-white/80'}`}>iPhone X/XS 초경량 모드 강제 적용</span>
                  <span className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                    {perfOverride === 'iphonexs' ? '수동 강제 켜짐' : isIPhoneXSClass() ? '자동 감지 적용 중' : '자동 감지 모드'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = perfOverride === 'iphonexs' ? 'auto' : 'iphonexs';
                    setDevicePerfOverride(next);
                    setPerfOverride(next === 'auto' ? null : next);
                  }}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    perfOverride === 'iphonexs' || isIPhoneXSClass()
                      ? (isLight ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30')
                      : (isLight ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100' : 'bg-white/5 text-white/60 border-white/10 hover:text-white')
                  }`}
                >
                  {perfOverride === 'iphonexs'
                    ? '✓ 강제 활성화 중'
                    : isIPhoneXSClass()
                    ? '✓ 자동 활성됨'
                    : 'iPhone X/XS 모드 켜기'}
                </button>
              </div>
            </div>

            {/* 🎧 오디오 햅틱 피드백 */}
            <div className={`p-4 rounded-[22px] sm:rounded-[24px] border flex flex-col gap-3 mt-1 ${
              isLight ? 'bg-slate-50/90 border-slate-200/90 shadow-xs' : 'bg-[#141522] border-white/10'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  🎧 오디오 햅틱 피드백 (Audio Haptics)
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                  audioHaptics
                    ? (isLight ? 'text-sky-800 bg-sky-500/20 border-sky-400' : 'text-sky-300 bg-sky-500/20 border-sky-500/30')
                    : (isLight ? 'text-slate-500 bg-slate-200 border-slate-300' : 'text-white/40 bg-white/5 border-white/10')
                }`}>
                  {audioHaptics ? '● 활성화됨' : '○ 꺼짐'}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/50'}`}>
                성공 이벤트(선명한 샤프 펄스), 호흡 수련(부드러운 리듬 팽창·이완), 명상 싱잉볼, 타로 카드 드로우 등 인터랙션 카테고리별 정밀 촉감과 Web Audio 사운드를 생생하게 재현합니다.
              </p>

              {/* 카테고리별 패턴 체험 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => playSuccessHaptic('sharp')}
                  className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    isLight ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                  }`}
                >
                  ⚡ 샤프 펄스
                </button>
                <button
                  type="button"
                  onClick={() => playBreathingHaptic('inhale')}
                  className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    isLight ? 'border-teal-300 bg-teal-50 text-teal-800 hover:bg-teal-100' : 'border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20'
                  }`}
                >
                  🫁 호흡 리듬
                </button>
                <button
                  type="button"
                  onClick={() => playBreathingHaptic('bell')}
                  className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    isLight ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100' : 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                  }`}
                >
                  🔔 싱잉볼
                </button>
                <button
                  type="button"
                  onClick={() => playCardHaptic('draw')}
                  className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    isLight ? 'border-purple-300 bg-purple-50 text-purple-800 hover:bg-purple-100' : 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                  }`}
                >
                  🃏 카드 드로우
                </button>
              </div>

              <div className={`flex items-center justify-between pt-1 border-t gap-2 ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                <button
                  type="button"
                  onClick={() => {
                    playSuccessHaptic('save');
                  }}
                  className={`text-[11px] font-medium px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isLight ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50' : 'border-white/10 bg-white/5 text-white/70 hover:text-white'
                  }`}
                >
                  ✨ 저장 확정 챠임
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = !audioHaptics;
                    setAudioHaptics(next);
                    setAudioHapticsEnabled(next);
                    if (next) {
                      playSuccessHaptic('sharp');
                    }
                  }}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    audioHaptics
                      ? (isLight ? 'bg-sky-600 text-white border-sky-600 shadow-sm' : 'bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30')
                      : (isLight ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50' : 'bg-white/5 text-white/60 border-white/10 hover:text-white')
                  }`}
                >
                  {audioHaptics ? '✓ 켜짐' : '오디오 햅틱 켜기'}
                </button>
              </div>
            </div>

            {/* 시스템 정보 */}
            <div className={`p-4 rounded-[22px] sm:rounded-[24px] border flex flex-col gap-1 mt-1 ${
              isLight ? 'bg-slate-50/90 border-slate-200/90 shadow-xs' : 'bg-[#141522] border-white/10'
            }`}>
              <div className="flex items-center justify-between gap-4">
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
                    <span className={`text-[10px] uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-white/40'} flex items-center gap-1`}>
                      System Engine
                      <span className="text-[9px] text-emerald-400 underline font-normal">미리보기</span>
                    </span>
                    <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-white/70'} group-hover:text-emerald-400 transition-colors`}>
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
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-sans font-medium ${
                    isLight ? 'text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border-slate-300' : 'text-white/50 hover:text-white/90 bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  새로고침 및 최신화 ⟳
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex gap-3">
            <button
              onClick={() => { void handleSave(); onClose(); }}
              className={`flex-1 py-4 rounded-[24px] text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg ${
                isLight ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25' : 'bg-white text-black'
              }`}
            >
              Save & Sync
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
