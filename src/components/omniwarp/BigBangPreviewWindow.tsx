import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Compass, AlertCircle, Eye, Sun, Moon, Timer, Triangle } from 'lucide-react';
import { WarpPhase, OmniWarpTarget } from '@/lib/omniWarp/types';
import { TossDestination } from '@/lib/prismTossRegistry';
import { getRankedWormholeApps } from '@/lib/omniWarp/wormholeSpectrum';
import { PrismAppIcon } from './PrismAppIcon';

interface BigBangPreviewWindowProps {
  /** 현재 누르는 중인지 여부 */
  isPressing: boolean;
  /** 호버 등으로 미리보기 HUD가 열려 있는지 여부 */
  isOpen: boolean;
  /** 취소 대기 여부 */
  isAborted: boolean;
  /** 현재 활성 위상 */
  activePhase: WarpPhase;
  /** 실시간 가상 압력 (0.0 ~ 1.0) */
  gauge: number;
  /** 누른 시간 (ms) */
  durationMs: number;
  /** AI 창의성 온도 T */
  aiTemp: number;
  /** 타깃 정보 */
  currentTarget: OmniWarpTarget | null;
  /** 다음 도약지 (기본 예측) */
  nextDest: TossDestination;
  /** 무한 반복 타이밍 사이클 값 (0.0 ~ 1.0) */
  idleCycleProgress: number;
}

/**
 * 낚시 게임 & 주사위 굴리기 스타일의 실시간 빅뱅 압력/시간 무한 반복 미리보기 창
 * - 0% ~ 10%: 화이트홀 (루시 채팅)
 * - 20% ~ 80%: 웜홀 7대 차원 룬 스펙트럼 (10% 단위 추천순 배치)
 * - 90% ~ 100%: 블랙홀 (크리스탈 오브)
 */
export function BigBangPreviewWindow({
  isPressing,
  isOpen,
  isAborted,
  activePhase,
  gauge,
  durationMs,
  aiTemp,
  currentTarget,
  nextDest,
  idleCycleProgress,
}: BigBangPreviewWindowProps) {
  if (!isOpen) return null;

  // 실시간 또는 무한 반복 타이밍 값
  const displayProgress = isPressing ? gauge : idleCycleProgress;
  const elapsedSec = (durationMs / 1000).toFixed(2);

  // 0~33%: 화이트홀(빛), 34~66%: 미러홀(유리), 67~100%: 블랙홀(어둠)
  const isEventHorizon = activePhase === 'event_horizon' || currentTarget?.phase === 'event_horizon';
  const isEventHorizonWhitehole = currentTarget?.eventHorizonMode === 'whitehole' || currentTarget?.actionType?.includes('whitehole');
  const isEventHorizonMirrorhole = currentTarget?.eventHorizonMode === 'mirrorhole' || currentTarget?.actionType?.includes('mirrorhole');
  const isMirrorhole = !isEventHorizon && (activePhase === 'mirrorhole' || (!isPressing && displayProgress >= 0.33 && displayProgress < 0.67));
  const isWhitehole = !isEventHorizon && !isMirrorhole && (activePhase === 'whitehole' || (!isPressing && displayProgress < 0.33));
  const isBlackhole = !isEventHorizon && !isMirrorhole && (activePhase === 'blackhole' || (!isPressing && displayProgress >= 0.67));
  const isWormhole = !isEventHorizon && !isWhitehole && !isMirrorhole && !isBlackhole;

  // 💡 빛과 어둠의 농도
  const lightDensity = isPressing ? Math.max(0.15, 1.0 - gauge * 0.85) : 0.7;
  const darknessDensity = isPressing ? Math.min(1.0, Math.max(0.1, gauge * 1.1)) : 0.2;
  const glowSpread = Math.round(10 + (1 - gauge) * 45);

  // 웜홀 7대 룬 목록 (현재 라우트 기준 추천순 정렬)
  const rankedApps = getRankedWormholeApps(window.location.pathname);

  // 현재 게이지가 가리키는 웜홀 앱 인덱스 (0~6)
  const currentWormholeIndex = isWormhole
    ? Math.min(6, Math.max(0, Math.floor((displayProgress - 0.15) / 0.10)))
    : -1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.92 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 w-[320px] sm:w-[360px] p-3.5 rounded-2xl backdrop-blur-2xl border flex flex-col gap-2.5 pointer-events-none select-none z-[380] transition-all duration-100 ${
        isAborted
          ? 'bg-zinc-950/95 border-red-500/50 text-red-300 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
          : isPressing
          ? isEventHorizon
            ? 'bg-purple-950/95 text-white border-purple-400/50 shadow-[0_0_35px_rgba(168,85,247,0.45)]'
            : isWhitehole
            ? 'bg-slate-950/95 text-white'
            : isMirrorhole
            ? 'bg-sky-950/90 text-white border-sky-300/60 shadow-[0_0_35px_rgba(186,230,253,0.5)] backdrop-blur-3xl'
            : isWormhole
            ? 'bg-purple-950/95 text-white'
            : 'bg-black/98 text-zinc-300'
          : 'bg-zinc-950/90 border-cyan-400/40 text-white shadow-[0_0_35px_rgba(56,189,248,0.35)]'
      }`}
      style={{
        boxShadow: isAborted
          ? undefined
          : isPressing
          ? isEventHorizon
            ? isEventHorizonWhitehole
              ? `0 0 ${glowSpread}px rgba(56,189,248,0.8), 0 0 ${glowSpread * 1.5}px rgba(168,85,247,0.6)`
              : isEventHorizonMirrorhole
              ? `0 0 ${glowSpread}px rgba(224,242,254,0.9), 0 0 ${glowSpread * 1.5}px rgba(56,189,248,0.7)`
              : `0 0 ${glowSpread}px rgba(168,85,247,0.9), 0 0 ${glowSpread * 1.5}px rgba(245,158,11,0.7)`
            : isWhitehole
            ? `0 0 ${glowSpread}px rgba(255,255,255,${lightDensity.toFixed(2)}), 0 0 ${glowSpread * 1.6}px rgba(56,189,248,${lightDensity.toFixed(2)})`
            : isMirrorhole
            ? `0 0 ${glowSpread}px rgba(255,255,255,0.95), 0 0 ${glowSpread * 1.5}px rgba(186,230,253,0.85)`
            : isWormhole
            ? `0 0 ${glowSpread}px rgba(168,85,247,${lightDensity.toFixed(2)}), 0 0 ${glowSpread * 1.4}px rgba(0,240,255,${(lightDensity * 0.7).toFixed(2)})`
            : `0 0 25px #000000, 0 0 50px rgba(0,0,0,${darknessDensity.toFixed(2)})`
          : undefined,
        borderColor: isPressing
          ? isEventHorizon
            ? isEventHorizonWhitehole
              ? 'rgba(56, 189, 248, 0.8)'
              : isEventHorizonMirrorhole
              ? 'rgba(224, 242, 254, 0.9)'
              : 'rgba(168, 85, 247, 0.8)'
            : isWhitehole
            ? `rgba(255, 255, 255, ${lightDensity.toFixed(2)})`
            : isMirrorhole
            ? 'rgba(224, 242, 254, 0.9)'
            : isWormhole
            ? `rgba(192, 132, 252, ${lightDensity.toFixed(2)})`
            : `rgba(245, 158, 11, ${darknessDensity.toFixed(2)})`
          : undefined,
      }}
    >
      {/* 1. 헤더: 실시간 상태 뱃지 + 게이지/시간 수치 */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-xs font-mono">
          {isAborted ? (
            <span className="flex items-center gap-1 text-red-400">
              <AlertCircle size={14} /> 안전 취소 대기
            </span>
          ) : isPressing ? (
            isEventHorizon ? (
              <span className="flex items-center gap-1 text-purple-200 drop-shadow-[0_0_8px_rgba(168,85,247,0.9)]">
                <Compass size={14} className="animate-spin text-purple-300" /> 사건의 지평선 [{isEventHorizonWhitehole ? '빛의 도약' : isEventHorizonMirrorhole ? '유리 도약' : '심연 도약'}]
              </span>
            ) : isWhitehole ? (
              <span className="flex items-center gap-1 text-cyan-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
                <Sun size={14} className="animate-spin text-white" /> 화이트홀 (빛의 방출)
              </span>
            ) : isMirrorhole ? (
              <span className="flex items-center gap-1 text-sky-200 drop-shadow-[0_0_8px_rgba(224,242,254,0.9)]">
                <Sparkles size={14} className="animate-pulse text-sky-200" /> 미러홀 (유리 · LucKey 홈)
              </span>
            ) : isWormhole ? (
              <span className="flex items-center gap-1 text-purple-300">
                <Zap size={14} className="animate-pulse text-purple-400" /> 웜홀 (자유 양자 도약)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
                <Moon size={14} className="animate-spin text-amber-300" /> 블랙홀 (심연 특이점)
              </span>
            )
          ) : (
            <span className="flex items-center gap-1 text-cyan-200">
              <Eye size={14} className="text-cyan-400 animate-pulse" /> 빅뱅 실시간 타이밍 궤도
            </span>
          )}
        </div>

        {/* 수치 데이터 (누른 시간 + 압력 + AI 온도) */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          {isPressing ? (
            <>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 font-bold flex items-center gap-1">
                <Timer size={11} className="text-cyan-300" /> {elapsedSec}s
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 font-bold text-white">
                압력 {(gauge * 100).toFixed(0)}%
              </span>
              <span className="text-amber-300 font-bold">T={aiTemp.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-white/60 text-[9px]">
              시계방향 무한 루프 궤도
            </span>
          )}
        </div>
      </div>

      {/* 2. 다음 도약 기능 영시 (Pre-vision) 카드 */}
      <div className="flex items-center justify-between bg-white/[0.08] px-2.5 py-2 rounded-xl border border-white/10 shadow-inner">
        <div className="flex items-center gap-2 min-w-0">
          {isMirrorhole ? (
            <PrismAppIcon nameOrId="mirrorhole" size={20} className="shrink-0 text-sky-200 drop-shadow-[0_0_8px_rgba(224,242,254,0.9)]" />
          ) : isBlackhole ? (
            <PrismAppIcon nameOrId="blackhole" size={20} className="shrink-0 text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
          ) : isWhitehole ? (
            <PrismAppIcon nameOrId="lucy" size={20} className="shrink-0 text-amber-200 drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]" />
          ) : currentTarget ? (
            <PrismAppIcon nameOrId={rankedApps[currentWormholeIndex]?.id || currentTarget.id || 'hub'} size={20} className="shrink-0 text-purple-300" />
          ) : (
            <PrismAppIcon nameOrId={nextDest.id || 'hub'} size={20} className="shrink-0 text-cyan-300" />
          )}
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-[11px] font-extrabold text-cyan-200 truncate flex items-center gap-1">
              {currentTarget ? currentTarget.previewLabel : isMirrorhole ? '[미러홀 투영] LucKey 홈' : `다음 도약: ${nextDest.name}`}
            </span>
            <span className="text-[8.5px] text-white/80 truncate mt-0.5">
              {currentTarget?.previewDescription || (isMirrorhole ? '투명한 크리스탈 유리 거울 면을 통과하여 프리즘 홈 허브로 즉시 귀환합니다.' : nextDest.description)}
            </span>
          </div>
        </div>
        <span
          className={`text-[8px] px-1.5 py-0.5 rounded-md font-mono font-bold uppercase shrink-0 border ${
            isMirrorhole
              ? 'bg-sky-400/20 text-sky-200 border-sky-400/40'
              : isBlackhole
              ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40'
              : isWhitehole
              ? 'bg-amber-400/20 text-amber-200 border-pink-400/40'
              : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
          }`}
        >
          {isMirrorhole ? 'MIRRORHOLE' : isBlackhole ? 'BLACKHOLE' : isWhitehole ? 'WHITEHOLE' : 'WORMHOLE'}
        </span>
      </div>

      {/* 3. 위상 스펙트럼 인디케이터 바: 화이트홀(빛) -> 미러홀(유리) -> 블랙홀(어둠) */}
      <div className="flex flex-col gap-1.5 pt-0.5">
        <div className="flex items-center justify-between px-1">
          {/* 1단계: 화이트홀 (루시 스파클) */}
          <div
            className={`flex flex-col items-center transition-transform ${
              isWhitehole ? 'scale-125 font-black text-amber-200 drop-shadow-[0_0_6px_rgba(244,114,182,0.8)]' : 'opacity-60 text-white/60'
            }`}
          >
            <Sparkles size={12} className="text-amber-200" />
            <span className="text-[7.5px] font-mono whitespace-nowrap mt-0.5">화이트홀(루시)</span>
          </div>

          {/* 2단계: 미러홀 (유리테마 · 프리즘 홈) */}
          <div
            className={`flex flex-col items-center transition-all ${
              isMirrorhole
                ? 'scale-130 font-black text-sky-200 drop-shadow-[0_0_8px_rgba(224,242,254,1)]'
                : 'opacity-60 text-white/60'
            }`}
          >
            <Triangle size={12} className="text-sky-200" fill="none" />
            <span className="text-[7.5px] font-mono whitespace-nowrap mt-0.5">미러홀(유리)</span>
          </div>

          {/* 3단계: 블랙홀 (크리스탈 오브) */}
          <div
            className={`flex flex-col items-center transition-transform ${
              isBlackhole ? 'scale-125 font-black text-cyan-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]' : 'opacity-60 text-white/60'
            }`}
          >
            <PrismAppIcon nameOrId="blackhole" size={13} className="shrink-0 text-cyan-300" />
            <span className="text-[7.5px] font-mono whitespace-nowrap mt-0.5">블랙홀(Key)</span>
          </div>
        </div>

        {/* 정밀 타이밍 게이지 바늘 트랙 */}
        <div className="w-full h-3 rounded-full bg-zinc-900 border border-white/20 overflow-hidden relative p-0.5">
          {/* 위상 그라데이션 베이스 */}
          <div
            className="w-full h-full rounded-full transition-opacity duration-100"
            style={{
              opacity: 0.5 + lightDensity * 0.5,
              background:
                'linear-gradient(90deg, #ffffff 0%, #38bdf8 25%, #e0f2fe 50%, #c084fc 75%, #000000 100%)',
            }}
          />

          {/* 실시간 타이밍 마커 바늘 */}
          <motion.div
            className="absolute top-0 bottom-0 w-2 -ml-1 rounded-sm shadow-md pointer-events-none transition-all duration-75"
            style={{
              left: `${displayProgress * 100}%`,
              backgroundColor: isAborted
                ? '#ef4444'
                : isBlackhole
                ? '#f59e0b'
                : isWhitehole
                ? '#ffffff'
                : isMirrorhole
                ? '#e0f2fe'
                : '#c084fc',
              boxShadow: isAborted
                ? '0 0 10px #ef4444'
                : isBlackhole
                ? `0 0 ${Math.round(8 + gauge * 16)}px #f59e0b, 0 0 ${Math.round(14 + gauge * 25)}px rgba(0,0,0,${darknessDensity})`
                : isWhitehole
                ? `0 0 ${Math.round(10 + (1 - gauge) * 22)}px rgba(255,255,255,${lightDensity}), 0 0 ${Math.round(18 + (1 - gauge) * 28)}px rgba(56,189,248,${lightDensity})`
                : isMirrorhole
                ? `0 0 14px rgba(255,255,255,1), 0 0 20px rgba(186,230,253,0.9)`
                : `0 0 ${Math.round(8 + (1 - gauge) * 16)}px rgba(168,85,247,${lightDensity})`,
            }}
          />
        </div>
      </div>

      {/* 4. 손맛 가이드 문구 및 액션 안내 */}
      <div className="flex items-center justify-between text-[9px] font-sans pt-0.5">
        <span className="text-white/90 font-medium truncate">
          {isAborted
            ? '손을 떼면 안전하게 원래 화면으로 복귀합니다'
            : isPressing
            ? isWhitehole
              ? '지금 손을 떼면 [루시 1:1 대화]로 직행합니다'
              : isMirrorhole
              ? '지금 손을 떼면 [럭키 프롤로그 메인]으로 즉시 귀환합니다'
              : isBlackhole
              ? '지금 손을 떼면 [Key]로 들어갑니다'
              : currentTarget?.previewLabel || '손을 떼면 선택된 차원으로 도약합니다'
            : '타이밍에 맞춰 손을 떼어 원하는 차원으로 도약하세요'}
        </span>
        <span className="text-white/50 text-[8px] font-mono shrink-0 ml-1">
          {isPressing ? '바깥으로 밀어 취소' : '실시간 전이'}
        </span>
      </div>
    </motion.div>
  );
}
