import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Clock, MapPin, Heart, Sparkles, Check } from 'lucide-react';
import type { ChatTargetProfile } from '@/types/chatProfile';

interface ChatProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: ChatTargetProfile) => void;
  initialProfile?: ChatTargetProfile | null;
  totalProfilesCount: number;
}

const RELATIONSHIP_TAGS = ['본인', '연인', '썸', '친구', '동업자', '가족', '직장동료'];

export const ChatProfileModal: React.FC<ChatProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProfile,
  totalProfilesCount
}) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('1996-01-01');
  const [lunarSolar, setLunarSolar] = useState<'solar' | 'lunar'>('solar');
  const [birthtime, setBirthtime] = useState('12:00');
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [birthCity, setBirthCity] = useState('서울');
  const [relationship, setRelationship] = useState('연인');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name || '');
      setBirthdate(initialProfile.birthdate || '1996-01-01');
      setLunarSolar(initialProfile.lunarSolar || 'solar');
      setBirthtime(initialProfile.birthtime || '');
      setIsTimeUnknown(!initialProfile.birthtime);
      setGender(initialProfile.gender || 'female');
      setBirthCity(initialProfile.birthCity || '서울');
      setRelationship(initialProfile.relationship || (initialProfile.isMe ? '본인' : '연인'));
    } else {
      // Default for adding a new second/third person
      setName('');
      setBirthdate('1996-05-15');
      setLunarSolar('solar');
      setBirthtime('12:00');
      setIsTimeUnknown(false);
      setGender('female');
      setBirthCity('서울');
      setRelationship(totalProfilesCount === 1 ? '연인' : '친구');
    }
    setErrorMessage(null);
  }, [initialProfile, isOpen, totalProfilesCount]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('이름 또는 호칭을 입력해 주세요.');
      return;
    }
    if (!birthdate) {
      setErrorMessage('생년월일을 선택해 주세요.');
      return;
    }

    const savedProfile: ChatTargetProfile = {
      id: initialProfile?.id || `profile-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      isMe: initialProfile?.isMe || false,
      birthdate,
      lunarSolar,
      birthtime: isTimeUnknown ? undefined : birthtime,
      gender,
      birthCity: birthCity.trim() || '서울',
      relationship
    };

    onSave(savedProfile);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {initialProfile ? '상담 프로필 정보 수정' : '대화창 점괘 프로필 추가'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                정밀한 사주·점성술 천문 계산과 맞춤 점괘에 사용됩니다
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* 1. 이름 / 호칭 */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User size={14} className="text-amber-500" />
              이름 또는 호칭 <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 김영희, 상대방, 동업자, 짝꿍"
              maxLength={20}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
              autoFocus
            />
          </div>

          {/* 2. 관계 태그 */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Heart size={14} className="text-rose-500" />
              관계 구분
            </label>
            <div className="flex flex-wrap gap-1.5">
              {RELATIONSHIP_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setRelationship(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    relationship === tag
                      ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 3. 생년월일 & 양력/음력 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar size={14} className="text-amber-500" />
                생년월일 <span className="text-amber-500">*</span>
              </label>
              {/* 양력 / 음력 선택 */}
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setLunarSolar('solar')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    lunarSolar === 'solar'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  양력
                </button>
                <button
                  type="button"
                  onClick={() => setLunarSolar('lunar')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    lunarSolar === 'lunar'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  음력
                </button>
              </div>
            </div>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
          </div>

          {/* 4. 출생시간 & 모름 체크 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock size={14} className="text-amber-500" />
                태어난 시간
              </label>
              <label className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isTimeUnknown}
                  onChange={(e) => setIsTimeUnknown(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                시간 모름
              </label>
            </div>
            <input
              type="time"
              value={birthtime}
              onChange={(e) => setBirthtime(e.target.value)}
              disabled={isTimeUnknown}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 dark:text-slate-100 outline-none transition-all ${
                isTimeUnknown
                  ? 'bg-slate-100 dark:bg-slate-800/30 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800'
              }`}
            />
          </div>

          {/* 5. 성별 선택 */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              성별 <span className="text-amber-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['female', 'male', 'other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    gender === g
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {g === 'female' ? '여성' : g === 'male' ? '남성' : '기타'}
                </button>
              ))}
            </div>
          </div>

          {/* 6. 출생지 (시/도) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin size={14} className="text-amber-500" />
              태어난 도시 (출생지) <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              value={birthCity}
              onChange={(e) => setBirthCity(e.target.value)}
              placeholder="예: 서울, 부산, 대구, 대전, 뉴욕 등"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check size={16} />
              <span>{initialProfile ? '프로필 저장' : '대화창에 추가'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
