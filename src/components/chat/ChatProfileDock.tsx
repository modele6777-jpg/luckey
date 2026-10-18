import React from 'react';
import { User, Plus, X, Heart, Sparkles, Briefcase } from 'lucide-react';
import type { ChatTargetProfile } from '@/types/chatProfile';
import { useTheme } from '@/contexts/ThemeContext';

interface ChatProfileDockProps {
  profiles: ChatTargetProfile[];
  activeProfileId?: string;
  onSelectProfile?: (profileId: string) => void;
  onAddClick: () => void;
  onEditProfile: (profile: ChatTargetProfile) => void;
  onRemoveProfile: (profileId: string) => void;
  maxProfiles?: number;
}

export const ChatProfileDock: React.FC<ChatProfileDockProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddClick,
  onEditProfile,
  onRemoveProfile,
  maxProfiles = 4,
}) => {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';
  const isMulti = profiles.length >= 2;
  const isMax = profiles.length >= maxProfiles;

  const getRelationshipIcon = (p: ChatTargetProfile) => {
    if (!isMulti || p.isMe || p.relationship === '본인') {
      return <User size={10} className="sm:w-3 sm:h-3 text-amber-500 shrink-0" />;
    }
    if (p.relationship === '연인' || p.relationship === '썸') {
      return <Heart size={10} className="sm:w-3 sm:h-3 text-rose-500 fill-rose-500/20 shrink-0" />;
    }
    if (p.relationship === '동업자' || p.relationship === '직장동료') {
      return <Briefcase size={10} className="sm:w-3 sm:h-3 text-blue-500 shrink-0" />;
    }
    return <User size={10} className="sm:w-3 sm:h-3 text-indigo-500 shrink-0" />;
  };

  return (
    <div className="w-full flex items-center justify-between gap-1 sm:gap-1.5 py-0 sm:py-0.5 px-0.5 sm:px-1 overflow-x-auto no-scrollbar scroll-smooth">
      {/* Left: Mode Badge */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <span
          className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black flex items-center gap-0.5 sm:gap-1 shadow-2xs border ${
            isMulti
              ? isLight
                ? 'bg-gradient-to-r from-rose-500/15 via-purple-500/15 to-amber-500/15 text-rose-800 border-rose-300'
                : 'bg-gradient-to-r from-rose-500/25 via-purple-500/25 to-amber-500/25 text-white border-rose-500/40'
              : isLight
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-amber-950/60 text-white border-amber-500/40'
          }`}
          style={{ color: isLight ? undefined : '#ffffff' }}
        >
          {isMulti ? (
            <>
              <Sparkles size={9} className="sm:w-2.5 sm:h-2.5 text-rose-500 animate-pulse shrink-0" />
              <span>{profiles.length === 2 ? '2인 궁합·연애 모드' : `${profiles.length}인 시너지 모드`}</span>
            </>
          ) : (
            <>
              <User size={9} className="sm:w-2.5 sm:h-2.5 text-amber-500 shrink-0" />
              <span>1인 점괘 모드</span>
            </>
          )}
        </span>
      </div>

      {/* Middle: Active Profile Chips & Add Button */}
      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
        {profiles.map((profile) => {
          const birthSnippet = profile.birthdate ? profile.birthdate.slice(2).replace(/-/g, '.') : '';
          const isSelectedTarget = isMulti ? (activeProfileId === profile.id || (!activeProfileId && profile.isMe)) : true;
          const displayRel = (!isMulti || profile.isMe) ? '본인' : profile.relationship;

          return (
            <div
              key={profile.id}
              className={`group flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold border transition-all shadow-2xs shrink-0 ${
                isSelectedTarget
                  ? isLight
                    ? 'bg-amber-100/90 border-amber-400 text-amber-950 ring-2 ring-amber-400/50 shadow-sm'
                    : 'bg-amber-950/75 border-amber-400 text-white ring-2 ring-amber-400/40 shadow-sm'
                  : isLight
                  ? 'bg-white hover:bg-amber-50/60 border-slate-200 text-slate-700 hover:border-amber-300'
                  : 'bg-slate-900 hover:bg-slate-800 border-white/20 text-white hover:border-amber-400/50'
              }`}
              style={{ color: isLight ? undefined : '#ffffff' }}
            >
              {/* Profile icon & info (Clickable to select as main target or edit) */}
              <button
                type="button"
                onClick={() => {
                  if (isMulti && onSelectProfile && !isSelectedTarget) {
                    onSelectProfile(profile.id);
                  } else {
                    onEditProfile(profile);
                  }
                }}
                className="flex items-center gap-0.5 sm:gap-1 cursor-pointer hover:opacity-85 active:scale-95 transition-transform"
                title={
                  isMulti
                    ? (isSelectedTarget ? `${profile.name} (현재 상담 메인 기준) · 클릭 시 수정` : `${profile.name} 사주 기준으로 상담 전환하기`)
                    : `${profile.name} (본인) 정보 수정`
                }
              >
                {getRelationshipIcon(profile)}
                <span
                  className={`truncate max-w-[65px] sm:max-w-[100px] ${
                    isSelectedTarget
                      ? isLight ? 'font-black text-amber-950' : 'font-black text-white'
                      : isLight ? 'font-bold text-slate-800' : 'font-bold text-white'
                  }`}
                  style={{ color: isLight ? undefined : '#ffffff' }}
                >
                  {profile.name}
                </span>
                {birthSnippet && (
                  <span className={`text-[9px] sm:text-[10px] ${isLight ? 'text-slate-400' : 'text-white/75'}`}>
                    {birthSnippet}
                  </span>
                )}
                {displayRel && (
                  <span className={`text-[8px] sm:text-[9px] px-1 py-0.1 rounded font-normal ${
                    isSelectedTarget 
                      ? isLight ? 'bg-amber-200/80 text-amber-900 font-bold' : 'bg-amber-800/70 text-white font-bold'
                      : isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-white/85'
                  }`}>
                    {displayRel}
                  </span>
                )}
                {isMulti && isSelectedTarget && (
                  <span className="text-[8px] text-amber-500 dark:text-amber-300 font-black" title="현재 상담 사주 기준">
                    ★
                  </span>
                )}
              </button>

              {/* Delete button (Visible ONLY when 2 or more profiles are active) */}
              {isMulti && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveProfile(profile.id);
                  }}
                  className={`p-0.5 rounded-full transition-colors ml-0.5 cursor-pointer ${
                    isLight ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-white/70 hover:text-rose-300 hover:bg-rose-950/50'
                  }`}
                  title={`${profile.name} 프로필을 대화창에서 제거`}
                  aria-label={`${profile.name} 삭제`}
                >
                  <X size={10} className="sm:w-3 sm:h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Profile Trigger Button */}
        {!isMax ? (
          <button
            type="button"
            onClick={onAddClick}
            className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border text-[10px] sm:text-[11px] font-bold transition-all shadow-2xs shrink-0 cursor-pointer active:scale-95 ${
              isLight
                ? 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-900'
                : 'bg-slate-900 hover:bg-slate-800 border-white/20 hover:border-amber-400/50 text-white'
            }`}
            style={{ color: isLight ? '#334155' : '#ffffff' }}
            title="상담/궁합 대상자 프로필 추가 (최대 4인)"
          >
            <Plus size={10} className="sm:w-3 sm:h-3 text-amber-500 shrink-0" />
            <span>프로필 추가</span>
            <span className={`text-[8px] sm:text-[9px] font-semibold ${isLight ? 'text-slate-400' : 'text-white/75'}`}>
              ({profiles.length}/{maxProfiles})
            </span>
          </button>
        ) : (
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium shrink-0 ${
            isLight ? 'bg-slate-100 text-slate-400' : 'bg-slate-800 text-white/70'
          }`}>
            최대 4인 ({profiles.length}/{maxProfiles})
          </span>
        )}
      </div>
    </div>
  );
};
