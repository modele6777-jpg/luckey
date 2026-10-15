import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Sparkles, Moon } from 'lucide-react';
import { RADIAL_WARP_APPS, RadialWarpApp } from '@/lib/omniWarp/forceSensor';
import { CHANNEL_SUBMENUS } from '@/lib/omniWarp/omniWarpEngine';
import { PrismAppIcon } from './PrismAppIcon';

export interface BigBangHorizonOverlayProps {
  isVisible: boolean;
  radialSectorIndex: number; // 0 ~ 6 (7대 앱) or -1 (중앙 제자리)
  activeHole: 'whitehole' | 'mirrorhole' | 'blackhole';
  dragDistance: number;
  dragAngleDeg: number;
}

export const GLOBAL_HORIZON_SCOPE = {
  name: '전체 7대 앱 우주',
  wh: {
    title: '트리니티 오라클 운명 나침반',
    desc: '좌뇌 · 이성: 사주와 타로로 마주하는 운명과 무의식 계시',
    path: '/trinity',
  },
  mh: {
    title: '프리즘 홈',
    desc: '유리 테마: 모든 여정과 차원의 시초 허브로 귀환',
    path: '/',
  },
  bh: {
    title: '뮤즈 예술처방 심미 공명',
    desc: '우뇌 · 감성: 명화·명시·명곡 삼위일체 예술적 카타르시스',
    path: '/muse',
  },
};

export function BigBangHorizonOverlay({
  isVisible,
  radialSectorIndex,
  activeHole,
  dragDistance,
  dragAngleDeg,
}: BigBangHorizonOverlayProps) {
  if (!isVisible) return null;

  const targetedApp: RadialWarpApp | null =
    radialSectorIndex >= 0 && radialSectorIndex < RADIAL_WARP_APPS.length
      ? RADIAL_WARP_APPS[radialSectorIndex]
      : null;

  const subMenus = targetedApp ? CHANNEL_SUBMENUS[targetedApp.id] : null;

  const whData = subMenus
    ? {
        title: subMenus.whitehole.name,
        desc: subMenus.whitehole.description,
        path: subMenus.whitehole.path,
      }
    : GLOBAL_HORIZON_SCOPE.wh;

  const mhData = subMenus
    ? {
        title: subMenus.mirrorhole.name,
        desc: subMenus.mirrorhole.description,
        path: subMenus.mirrorhole.path,
      }
    : GLOBAL_HORIZON_SCOPE.mh;

  const bhData = subMenus
    ? {
        title: subMenus.blackhole.name,
        desc: subMenus.blackhole.description,
        path: subMenus.blackhole.path,
      }
    : GLOBAL_HORIZON_SCOPE.bh;

  const scopeBadgeText = targetedApp
    ? `조준: [${targetedApp.runeSymbol} ${targetedApp.name} · ${targetedApp.title}]`
    : '전체 7대 앱 차원 지평선';

  return (
    <AnimatePresence>
      <motion.div
        key="bigbang-horizon-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] pointer-events-none select-none flex flex-col items-center justify-center p-4 sm:p-6"
        style={{ background: 'rgba(4, 5, 10, 0.93)' }}
      >
        {/* 🌟 1. 상단 스코프 배지 (Scope Badge) */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 sm:mb-6 text-center z-20"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md transition-all duration-200"
            style={{
              borderColor: targetedApp ? targetedApp.themeColor : 'rgba(56, 189, 248, 0.5)',
              background: targetedApp
                ? 'rgba(15, 23, 42, 0.85)'
                : 'rgba(15, 23, 42, 0.75)',
              boxShadow: targetedApp
                ? `0 0 24px ${targetedApp.accentGlow}`
                : '0 0 20px rgba(56, 189, 248, 0.3)',
            }}
          >
            <span className="text-xs font-mono tracking-widest font-semibold text-cyan-300">
              EVENT HORIZON
            </span>
            <span className="text-xs font-bold text-white">
              {scopeBadgeText}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-1.5">
            {targetedApp
              ? `${targetedApp.description} (손을 떼면 도약)`
              : '원하는 방향으로 드래그하여 7개 앱을 직접 조준하세요'}
          </p>
        </motion.div>

        {/* 🌀 2. 중앙 7대 정규 앱 셉타그램 방사형 조이스틱 & 3대 홀 인터랙션 뷰 */}
        <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] flex items-center justify-center z-10">
          {/* 우주 볼텍스 링 배경 */}
          <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-[spin_40s_linear_infinite] pointer-events-none" />
          <div className="absolute inset-8 rounded-full border border-purple-500/15 animate-[spin_28s_linear_infinite_reverse] pointer-events-none" />

          {/* 🎯 7개 앱 노드 배치 (12시 프롤로그부터 시계 방향 배치) */}
          {RADIAL_WARP_APPS.map((app, idx) => {
            const total = RADIAL_WARP_APPS.length;
            const angleDeg = (idx / total) * 360 - 90; // 12시가 -90° (0°)
            const rad = (angleDeg * Math.PI) / 180;
            const radius = 135; // px
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            const isTargeted = radialSectorIndex === idx;

            return (
              <motion.div
                key={app.id}
                className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
                animate={{
                  scale: isTargeted ? 1.25 : 1.0,
                  zIndex: isTargeted ? 30 : 10,
                }}
              >
                <div
                  className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center transition-all duration-200 border ${
                    isTargeted
                      ? 'border-white ring-4 shadow-[0_0_24px_rgba(255,255,255,0.9)]'
                      : 'border-white/30 hover:border-white/60 bg-slate-900/80 shadow-md'
                  }`}
                  style={{
                    backgroundColor: isTargeted ? app.themeColor : '#0f172a',
                    boxShadow: isTargeted ? `0 0 28px ${app.accentGlow}` : undefined,
                  }}
                >
                  <PrismAppIcon
                    nameOrId={app.id}
                    size={22}
                    color={isTargeted ? '#ffffff' : app.themeColor}
                    className="drop-shadow"
                  />
                  <span
                    className="absolute -top-1.5 -right-1.5 text-[10px] font-serif font-bold text-amber-300 bg-slate-950/90 rounded-full px-1 border border-amber-400/40"
                  >
                    {app.runeSymbol}
                  </span>
                </div>
                <span
                  className={`mt-1 text-[10px] sm:text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors duration-150 ${
                    isTargeted ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]' : 'text-slate-400'
                  }`}
                >
                  {app.name}
                </span>
              </motion.div>
            );
          })}

          {/* 🪞 중앙 코스믹 링 & 3대 홀 순환 게이트웨이 */}
          <div className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center p-2 text-center bg-slate-950/85 border border-white/20 shadow-2xl backdrop-blur-xl">
            {/* 현재 활성 홀 표시 */}
            <div className="flex items-center gap-1 mb-1">
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeHole === 'whitehole'
                    ? 'bg-amber-300 scale-125 shadow-[0_0_8px_#fde047]'
                    : 'bg-slate-600 opacity-40'
                }`}
              />
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeHole === 'mirrorhole'
                    ? 'bg-sky-200 scale-125 shadow-[0_0_8px_#bae6fd]'
                    : 'bg-slate-600 opacity-40'
                }`}
              />
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeHole === 'blackhole'
                    ? 'bg-purple-400 scale-125 shadow-[0_0_8px_#c084fc]'
                    : 'bg-slate-600 opacity-40'
                }`}
              />
            </div>

            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
              {activeHole === 'whitehole'
                ? 'WHITE HOLE'
                : activeHole === 'mirrorhole'
                ? 'MIRROR HOLE'
                : 'BLACK HOLE'}
            </span>

            <span className="text-xs font-bold text-white mt-0.5 break-keep break-words px-1">
              {activeHole === 'whitehole'
                ? whData.title
                : activeHole === 'mirrorhole'
                ? mhData.title
                : bhData.title}
            </span>

            <span className="text-[9px] text-slate-300 break-keep break-words whitespace-normal px-1 mt-0.5 opacity-90 leading-tight">
              {activeHole === 'whitehole'
                ? whData.desc
                : activeHole === 'mirrorhole'
                ? mhData.desc
                : bhData.desc}
            </span>
          </div>
        </div>

        {/* 🪞 3. 하단 3대 포털 선택지 프리뷰 바 (화이트홀 · 미러홀 · 블랙홀) */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-lg mt-4 sm:mt-6 z-20">
          {/* 화이트홀 */}
          <div
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              activeHole === 'whitehole'
                ? 'border-amber-300 bg-amber-950/40 shadow-[0_0_16px_rgba(253,230,138,0.4)] scale-102'
                : 'border-white/10 bg-slate-900/40 opacity-50'
            }`}
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
              <Sun className="w-3.5 h-3.5" />
              <span>화이트홀</span>
            </div>
            <p className="text-[11px] text-white font-semibold mt-1 truncate">
              {whData.title}
            </p>
          </div>

          {/* 미러홀 */}
          <div
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              activeHole === 'mirrorhole'
                ? 'border-sky-200 bg-sky-950/40 shadow-[0_0_16px_rgba(186,230,253,0.4)] scale-102'
                : 'border-white/10 bg-slate-900/40 opacity-50'
            }`}
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-sky-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>미러홀</span>
            </div>
            <p className="text-[11px] text-white font-semibold mt-1 truncate">
              {mhData.title}
            </p>
          </div>

          {/* 블랙홀 */}
          <div
            className={`p-2.5 rounded-xl border transition-all duration-200 ${
              activeHole === 'blackhole'
                ? 'border-purple-400 bg-purple-950/40 shadow-[0_0_16px_rgba(192,132,252,0.4)] scale-102'
                : 'border-white/10 bg-slate-900/40 opacity-50'
            }`}
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-purple-300">
              <Moon className="w-3.5 h-3.5" />
              <span>블랙홀</span>
            </div>
            <p className="text-[11px] text-white font-semibold mt-1 truncate">
              {bhData.title}
            </p>
          </div>
        </div>

        {/* 🧭 4. 조작 가이드 안내 */}
        <div className="mt-3 text-center text-[10px] text-slate-400">
          <span>🎯 손을 떼면 선택된 차원으로 워프</span>
          <span className="mx-2">·</span>
          <span className="text-red-400">원 밖으로 멀리 던지면 안전 취소</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
