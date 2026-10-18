import React from 'react';
import { User, Plus, X, Heart, Users, Sparkles, Briefcase } from 'lucide-react';
import type { ChatTargetProfile } from '@/types/chatProfile';

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
  const isMulti = profiles.length >= 2;
  const isMax = profiles.length >= maxProfiles;

  const getRelationshipIcon = (p: ChatTargetProfile) => {
    if (!isMulti || p.isMe || p.relationship === '본인') {
      return <User size={10} className="sm:w-3 sm:h-3 text-amber-600 shrink-0" />;
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
              ? 'bg-gradient-to-r from-rose-500/15 via-purple-500/15 to-amber-500/15 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
          }`}
        >
          {isMulti ? (
            <>
              <Sparkles size={9} className="sm:w-2.5 sm:h-2.5 text-rose-500 animate-pulse shrink-0" />
              <span>{profiles.length === 2 ? '2인 궁합·연애 모드' : `${profiles.length}인 시너지 모드`}</span>
            </>
          ) : (
            <>
              <User size={9} className="sm:w-2.5 sm:h-2.5 text-amber-600 shrink-0" />
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
                  ? 'bg-amber-100/90 dark:bg-amber-950/70 border-amber-400 dark:border-amber-500 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400/50 shadow-sm'
                  : 'bg-white hover:bg-amber-50/60 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-300'
              }`}
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
                <span className={`truncate max-w-[65px] sm:max-w-[100px] ${isSelectedTarget ? 'font-black text-amber-950 dark:text-amber-200' : 'font-bold'}`}>
                  {profile.name}
                </span>
                {birthSnippet && (
                  <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">
                    {birthSnippet}
                  </span>
                )}
                {displayRel && (
                  <span className={`text-[8px] sm:text-[9px] px-1 py-0.1 rounded font-normal ${
                    isSelectedTarget 
                      ? 'bg-amber-200/80 dark:bg-amber-800/60 text-amber-900 dark:text-amber-200 font-bold'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                  }`}>
                    {displayRel}
                  </span>
                )}
                {isMulti && isSelectedTarget && (
                  <span className="text-[8px] text-amber-600 dark:text-amber-300 font-black" title="현재 상담 사주 기준">
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
                  className="p-0.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-0.5 cursor-pointer"
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
            className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/60 border border-slate-200 dark:border-slate-700 hover:border-amber-300 text-slate-700 dark:text-slate-300 hover:text-amber-900 text-[10px] sm:text-[11px] font-bold transition-all shadow-2xs shrink-0 cursor-pointer active:scale-95"
            title="상담/궁합 대상자 프로필 추가 (최대 4인)"
          >
            <Plus size={10} className="sm:w-3 sm:h-3 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>프로필 추가</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 font-semibold">
              ({profiles.length}/{maxProfiles})
            </span>
          </button>
        ) : (
          <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] sm:text-[10px] text-slate-400 font-medium shrink-0">
            최대 4인 ({profiles.length}/{maxProfiles})
          </span>
        )}
      </div>
    </div>
  );
};
