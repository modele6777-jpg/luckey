import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BigBangCommitEventDetail } from '@/lib/omniWarp/types';
import { isIPhoneXSClass, isPerfReduced } from '@/lib/perfMode';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  growth?: number;
  isSmoke?: boolean;
}

export function BigBangExpansionOverlay() {
  const [activeCommit, setActiveCommit] = useState<BigBangCommitEventDetail | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleCommit = (e: any) => {
      const detail = e.detail as BigBangCommitEventDetail;
      if (detail) {
        setActiveCommit(detail);

        // Spawn Big Bang particles from crystal orb origin (bottom-center area)
        const canvas = canvasRef.current;
        const originX = window.innerWidth / 2;
        const originY = window.innerHeight - 90;
        const isWhitehole = detail.phase === 'whitehole' || (detail.phase === 'event_horizon' && detail.target?.eventHorizonMode === 'whitehole');
        const isBlackhole = detail.phase === 'blackhole' || (detail.phase === 'event_horizon' && detail.target?.eventHorizonMode === 'blackhole');
        const isWormhole = detail.phase === 'wormhole';

        particlesRef.current = [];
        const countScale = isIPhoneXSClass() ? 0.45 : isPerfReduced() ? 0.6 : 1;
        const count = Math.round((isBlackhole ? 240 : isWormhole ? 220 : isWhitehole ? 170 : 130) * countScale);
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = isWormhole
            ? (Math.random() * 15 + 5)
            : isBlackhole
            ? (Math.random() * 8 + 2)
            : isWhitehole
            ? (Math.random() * 12 + 4)
            : (Math.random() * 8 + 3);

          let particleColor = `hsl(${Math.random() * 40 + 190}, 100%, 80%)`;
          let isSmokeParticle = false;
          let particleGrowth = 0;

          if (isWormhole) {
            // ☀️ 빛비춤 + 🕳️ 어두운 심연 + 🌌 사건의 지평선 3원 동시 융합 파티클
            const pType = Math.random();
            if (pType < 0.35) {
              // ☀️ 빛비춤: 눈부신 순백광, 황금빛 광자
              particleColor = Math.random() < 0.6 ? 'rgba(255, 255, 255, 0.98)' : 'hsl(48, 100%, 82%)';
            } else if (pType < 0.70) {
              // 🕳️ 어두운 심연: 딥 바이올렛, 흑요석 암흑 물질
              particleColor = Math.random() < 0.5 ? 'hsl(275, 100%, 65%)' : 'rgba(12, 6, 26, 0.96)';
            } else {
              // 🌌 사건의 지평선: 시안 광륜, 에메랄드 시공간 굴절광
              particleColor = Math.random() < 0.5 ? 'hsl(192, 100%, 85%)' : 'hsl(155, 100%, 78%)';
            }
          } else if (isWhitehole) {
            // ☀️ 화이트홀 빛비춤: 눈부신 순백광, 황금빛, 시안 광자
            const pType = Math.random();
            if (pType < 0.45) {
              particleColor = `rgba(255, 255, 255, 0.98)`;
            } else if (pType < 0.75) {
              particleColor = `hsl(${Math.random() * 25 + 190}, 100%, 85%)`; // 눈부신 하늘빛/시안
            } else {
              particleColor = `hsl(${Math.random() * 30 + 45}, 100%, 80%)`; // 은은한 성스러운 골드
            }
          } else if (isBlackhole) {
            // 💨 블랙홀 검은 연기: 자욱하게 피어오르고 팽창하는 칠흑 먹구름 연무
            isSmokeParticle = true;
            particleGrowth = Math.random() * 0.85 + 0.45;
            const pType = Math.random();
            if (pType < 0.35) {
              particleColor = 'rgba(5, 5, 8, 0.95)'; // 칠흑 같은 농연(濃煙)
            } else if (pType < 0.65) {
              particleColor = 'rgba(15, 11, 22, 0.92)'; // 짙은 목탄빛 흑연
            } else if (pType < 0.85) {
              particleColor = 'rgba(25, 18, 35, 0.85)'; // 딥 스모키 바이올렛 연무
            } else {
              particleColor = 'rgba(38, 28, 52, 0.75)'; // 자욱하게 번지는 미세 연기 가장자리
            }
          }

          particlesRef.current.push({
            x: originX + (isBlackhole ? (Math.random() - 0.5) * 40 : 0),
            y: originY + (isBlackhole ? (Math.random() - 0.5) * 20 : 0),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: isWhitehole
              ? (Math.random() * 4 + 1.2)
              : isBlackhole
              ? (Math.random() * 22 + 16)
              : isWormhole
              ? (Math.random() * 3.9 + 1.1)
              : (Math.random() * 3.0 + 1.0),
            color: particleColor,
            alpha: 1.0,
            growth: particleGrowth,
            isSmoke: isSmokeParticle,
            decay: isWhitehole
              ? (Math.random() * 0.024 + 0.012)
              : isBlackhole
              ? (Math.random() * 0.014 + 0.008)
              : (Math.random() * 0.022 + 0.014),
          });
        }

        // Clear overlay after transition animation completes
        setTimeout(() => {
          setActiveCommit(null);
        }, 820);
      }
    };

    window.addEventListener('prism:bigbang_commit', handleCommit);
    return () => {
      window.removeEventListener('prism:bigbang_commit', handleCommit);
    };
  }, []);

  // Canvas particle render loop
  useEffect(() => {
    if (!activeCommit) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.isSmoke) {
          p.radius += (p.growth || 0.6);
          p.vx *= 0.965; // 자욱하게 번지는 공기 저항 감속
          p.vy *= 0.965;
        }

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.isSmoke) {
          // 부드러운 볼륨감을 지닌 검은 연기 방사형 그래디언트
          const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.12, p.x, p.y, p.radius);
          grad.addColorStop(0, p.color);
          grad.addColorStop(0.6, p.color);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = p.color;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeCommit]);

  if (!activeCommit) return null;

  const { target, phase } = activeCommit;
  const isWhitehole = phase === 'whitehole' || (phase === 'event_horizon' && target?.eventHorizonMode === 'whitehole');
  const isBlackhole = phase === 'blackhole' || (phase === 'event_horizon' && target?.eventHorizonMode === 'blackhole');
  const isWormhole = phase === 'wormhole';

  return (
    <AnimatePresence>
      <motion.div
        key="bigbang-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
      >
        {/* ☀️ 1. 화이트홀 빛비춤 효과: 화면 전체를 채우는 찬란한 광휘 & 빛의 폭발 */}
        {isWhitehole && (
          <>
            {/* 눈부신 백색광 플래시 & 래디언스 필드 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.95, 0.4, 0], scale: [0.8, 1.3, 1.6, 2.0] }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.98)_0%,rgba(224,242,254,0.85)_30%,rgba(56,189,248,0.5)_60%,transparent_100%)]"
            />
            {/* 회전하는 성스러운 스타라이트 광선 (Starlight Rays) */}
            <div className="absolute inset-[-40%] pointer-events-none bigbang-rays-spin opacity-75 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.85)_0deg,transparent_45deg,rgba(56,189,248,0.7)_90deg,transparent_135deg,rgba(254,240,138,0.8)_180deg,transparent_225deg,rgba(56,189,248,0.7)_270deg,transparent_315deg,rgba(255,255,255,0.85)_360deg)] blur-[1px]" />
          </>
        )}

        {/* 🕳️ 2. 블랙홀 검은 연기 효과: 화면을 자욱하게 뒤덮는 짙은 흑연(黑煙) & 소용돌이 먹구름 */}
        {isBlackhole && (
          <>
            {/* 전체 화면을 자욱하게 암전시키는 짙은 흑연 안개 베일 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.96, 0.98, 0] }}
              transition={{ duration: 0.82, ease: 'easeInOut' }}
              className="absolute inset-0 pointer-events-none bg-black/92 backdrop-blur-[12px]"
            />

            {/* 시계방향으로 굽이치며 화면을 집어삼키는 거대한 검은 연기 구름 1 */}
            <div className="absolute -inset-[35%] pointer-events-none blackhole-smoke-swirl-cw opacity-95 blur-3xl bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,1)_0%,rgba(10,8,16,0.96)_40%,rgba(20,15,30,0.85)_65%,transparent_88%)]" />

            {/* 반시계방향으로 팽창하며 뒤엉키는 짙은 먹구름 연무 2 */}
            <div className="absolute -inset-[40%] pointer-events-none blackhole-smoke-swirl-ccw opacity-92 blur-[48px] bg-[radial-gradient(ellipse_at_45%_55%,rgba(2,1,4,1)_0%,rgba(14,10,22,0.94)_45%,rgba(25,18,36,0.75)_70%,transparent_92%)]" />

            {/* 하단 버튼 위치에서부터 폭발적으로 솟구쳐 피어오르는 자욱한 흑연 기둥 (Dense Black Smoke Plume Column) */}
            <motion.div
              initial={{ scale: 0.25, y: 180, opacity: 0 }}
              animate={{ scale: [0.25, 2.0, 3.6], y: [180, -30, -140], opacity: [0, 1, 0.95, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute w-[640px] h-[640px] rounded-full pointer-events-none blur-[50px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,1)_0%,rgba(8,6,12,0.98)_45%,rgba(22,16,30,0.85)_70%,transparent_96%)]"
            />
          </>
        )}

        {/* 🌀 3. 웜홀: [빛비춤] + [어두운 심연] 동시 전개 및 [사건의 지평선(Event Horizon)] 효과 */}
        {isWormhole && (
          <>
            {/* 🕳️ 1) 심연 효과: 화면 외곽을 집어삼키는 칠흑 같은 암흑 보이드 비네트 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.95, 0.88, 0] }}
              transition={{ duration: 0.72, ease: 'easeInOut' }}
              className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(13,4,24,0.92)_55%,rgba(2,1,5,0.98)_100%)]"
            />
            {/* 외곽에서 중심으로 소용돌이치며 빨려들어가는 암흑 흡입 파동 (Darkness Suction Waves) */}
            <div className="absolute inset-[-20%] pointer-events-none bigbang-suction-wave-1 opacity-80 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(147,51,234,0.45)_52%,rgba(0,0,0,0.95)_88%)]" />
            <div className="absolute inset-[-20%] pointer-events-none bigbang-suction-wave-2 opacity-75 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(79,70,229,0.4)_45%,rgba(0,0,0,0.92)_82%)]" />

            {/* ☀️ 2) 빛비춤 효과: 중심에서 폭발하는 찬란한 눈부신 백색광 플래시 & 래디언스 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0.5, 0], scale: [0.5, 1.3, 1.8, 2.4] }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.98)_0%,rgba(224,242,254,0.9)_25%,rgba(56,189,248,0.55)_50%,transparent_75%)]"
            />
            {/* 회전하는 성스러운 스타라이트 광선 (Starlight Rays) */}
            <div className="absolute inset-[-40%] pointer-events-none bigbang-rays-spin opacity-85 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.95)_0deg,transparent_45deg,rgba(56,189,248,0.8)_90deg,transparent_135deg,rgba(254,240,138,0.9)_180deg,transparent_225deg,rgba(56,189,248,0.8)_270deg,transparent_315deg,rgba(255,255,255,0.95)_360deg)] blur-[1px]" />

            {/* 🌌 3) 사건의 지평선 효과: 빛과 어둠이 충돌하는 상대론적 강착원반 & 시공간 특이점 왜곡 광륜 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: 0 }}
              animate={{ opacity: [0, 1, 0.85, 0], scale: [0.4, 1.25, 1.9, 2.6], rotate: 180 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-[-10%] pointer-events-none rounded-full border-[3px] border-cyan-300 shadow-[0_0_80px_rgba(255,255,255,1),0_0_50px_rgba(56,189,248,0.95),0_0_40px_rgba(168,85,247,0.9),inset_0_0_30px_rgba(255,255,255,0.9)] bg-[conic-gradient(from_0deg,rgba(56,189,248,0.7)_0deg,rgba(255,255,255,0.9)_45deg,rgba(168,85,247,0.8)_90deg,rgba(52,211,153,0.7)_135deg,rgba(254,240,138,0.85)_180deg,rgba(255,255,255,0.9)_225deg,rgba(147,51,234,0.8)_270deg,rgba(56,189,248,0.7)_360deg)] blur-[1.5px]"
            />
            {/* 회전하는 웜홀 시공간 특이점 볼텍스 */}
            <div className="absolute inset-[-25%] pointer-events-none bigbang-wormhole-vortex opacity-80 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(52,211,153,0.4)_50%,rgba(147,51,234,0.45)_70%,transparent_90%)]" />
          </>
        )}

        {/* Space Particle Canvas for Big Bang Burst */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />

        {/* Central Shockwave Expansion Ring (순간적인 파동 링) */}
        <motion.div
          initial={{ scale: 0.15, opacity: 0.98, borderWidth: 12 }}
          animate={{ scale: 24, opacity: 0, borderWidth: 1 }}
          transition={{ duration: 0.54, ease: 'easeOut' }}
          className={`absolute w-24 h-24 rounded-full pointer-events-none border ${
            isWormhole
              ? 'border-white shadow-[0_0_70px_rgba(255,255,255,1),0_0_50px_rgba(56,189,248,0.95),0_0_35px_rgba(168,85,247,0.9),inset_0_0_30px_rgba(0,0,0,0.95)]'
              : isWhitehole
              ? 'border-white shadow-[0_0_50px_rgba(255,255,255,1),0_0_30px_rgba(56,189,248,0.9)]'
              : isBlackhole
              ? 'border-violet-500 shadow-[0_0_50px_rgba(168,85,247,0.9),inset_0_0_30px_rgba(0,0,0,0.95)]'
              : 'border-purple-300 shadow-[0_0_35px_rgba(168,85,247,0.85)]'
          }`}
        />

        {/* 웜홀 발동 시 뒤따라 확장되는 사건의 지평선 암흑 전이 파동 링 */}
        {isWormhole && (
          <motion.div
            initial={{ scale: 0.1, opacity: 0.95, borderWidth: 8 }}
            animate={{ scale: 21, opacity: 0, borderWidth: 1 }}
            transition={{ duration: 0.62, ease: 'easeOut', delay: 0.05 }}
            className="absolute w-24 h-24 rounded-full pointer-events-none border border-violet-400 shadow-[0_0_60px_rgba(168,85,247,1),inset_0_0_30px_rgba(0,0,0,0.95)]"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
