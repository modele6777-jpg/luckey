import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Activity
} from 'lucide-react';
import { SyncEchoDraft } from '../../lib/rebibleSyncEcho';

interface ReBibleSyncEchoBannerProps {
  draft: SyncEchoDraft;
}

export const ReBibleSyncEchoBanner: React.FC<ReBibleSyncEchoBannerProps> = ({
  draft
}) => {
  return (
    <div className="rounded-2xl border border-[#E0D2BA] bg-gradient-to-r from-[#FAF5EB] via-[#F6EFE2] to-[#FAF5EB] p-4 sm:p-5 shadow-xs relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 relative z-10">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs bg-[#4A321F] text-[#FAF5EB]">
              <Sparkles size={14} />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-serif text-sm font-bold tracking-tight text-stone-900">
                실시간 라이브 서재
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EADDC6] text-[#4A321F] border border-[#D5C2A3] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>실시간 자동 조율 중 ({draft.activityCount}건 연동) ✨</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            프리즘 에코시스템(타로·정화·명상·감정연금술·예술·루시 상담)의 모든 여정이 7개의 서재에 항시 실시간으로 자동 기록되며, 매일 밤 자정 12시에 그날의 영구 경전으로 확정·보존됩니다.
          </p>

          {/* Activity chips preview */}
          {draft.activityLogs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {draft.activityLogs.slice(0, 5).map((log, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md border border-[#DCCDB3] bg-[#FCFAF5] text-stone-800 font-medium flex items-center gap-1"
                >
                  <span>{log.icon || '✨'}</span>
                  <span>{log.title}</span>
                </span>
              ))}
              {draft.activityLogs.length > 5 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-[#DCCDB3] bg-[#FCFAF5] text-stone-600">
                  +{draft.activityLogs.length - 5}건
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
