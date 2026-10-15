import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  RotateCw,
  Zap,
  Shield,
  Flame,
} from 'lucide-react';
import { TTSButton } from '@/components/TTSButton';
import { type SajuAnalysisResult } from '@/lib/sajuAnalysis';

interface CelestialTalismanCardProps {
  userName: string;
  todayKey: string;
  saju: SajuAnalysisResult | null;
  luckyData: {
    luckScore?: number;
    luckLevelTitle?: string;
    luckyColor?: string;
    luckyColorHex?: string;
    dailyAmuletBlessing?: string;
    goldenKey?: string;
    miracleCloverMessage?: string;
  };
}

export function CelestialTalismanCard({
  userName,
  todayKey,
  saju,
  luckyData,
}: CelestialTalismanCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEmpowered, setIsEmpowered] = useState(false);
  const [isEmpowering, setIsEmpowering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const dayMaster = saju?.dayMaster?.korean || '갑목';

  // Draw authentic Korean Mulberry Hanji & Cinnabar Talisman on Canvas with High-DPI support
  const drawTalisman = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI Retina scale (2x backing buffer for razor-sharp rendering on mobile & desktop)
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 2, 3) : 2;
    const virtualW = 360;
    const virtualH = 600;

    canvas.width = virtualW * dpr;
    canvas.height = virtualH * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    const cw = virtualW;
    const ch = virtualH;

    // --- 1. Ancient Mulberry Hanji Paper Background (괴황지) ---
    const bgGrad = ctx.createLinearGradient(0, 0, cw, ch);
    bgGrad.addColorStop(0, '#f9dc75');
    bgGrad.addColorStop(0.2, '#f3cb52');
    bgGrad.addColorStop(0.5, '#e5b736');
    bgGrad.addColorStop(0.8, '#cb9520');
    bgGrad.addColorStop(1, '#9a6b12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Vignette burned shadow around borders
    const vigGrad = ctx.createRadialGradient(cw / 2, ch / 2, 80, cw / 2, ch / 2, ch * 0.60);
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(0.7, 'rgba(110, 68, 12, 0.16)');
    vigGrad.addColorStop(1, 'rgba(56, 32, 4, 0.52)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Fine Mulberry silk fibers
    ctx.save();
    for (let i = 0; i < 160; i++) {
      const sx = (Math.sin(i * 733) * 0.5 + 0.5) * cw;
      const sy = (Math.cos(i * 293) * 0.5 + 0.5) * ch;
      const length = 8 + Math.abs(Math.sin(i * 13)) * 20;
      const angle = i * 2.1;
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 252, 235, 0.45)' : 'rgba(140, 90, 20, 0.16)';
      ctx.lineWidth = 0.6 + Math.abs(Math.sin(i)) * 0.7;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(angle) * length, sy + Math.sin(angle) * length);
      ctx.stroke();
    }

    // Bark chip speckles
    for (let j = 0; j < 35; j++) {
      const x = Math.abs(Math.sin(j * 439)) * (cw - 50) + 25;
      const y = Math.abs(Math.cos(j * 115)) * (ch - 50) + 25;
      const r = 0.7 + Math.abs(Math.sin(j)) * 1.3;
      ctx.fillStyle = j % 3 === 0 ? 'rgba(68, 40, 10, 0.30)' : 'rgba(80, 50, 15, 0.16)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // --- 2. Sacred Dual Cinnabar Border (천원지방 2중 주사 테두리) ---
    ctx.save();
    ctx.strokeStyle = '#a61c1c';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, cw - 36, ch - 36);

    ctx.strokeStyle = '#c42323';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(25, 25, cw - 50, ch - 50);

    // Corner Auspicious Ornaments
    const drawCorner = (cx: number, cy: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = '#991818';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.lineTo(0, -10);
      ctx.lineTo(0, 0);
      ctx.lineTo(-10, 0);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(32, 32, 0);
    drawCorner(cw - 32, 32, Math.PI / 2);
    drawCorner(cw - 32, ch - 32, Math.PI);
    drawCorner(32, ch - 32, -Math.PI / 2);
    ctx.restore();

    // --- 3. Cinnabar Brush Stroke Function ---
    const drawCinnabarStroke = (drawFn: () => void, width: number, alpha = 0.95) => {
      ctx.save();
      // Halo diffusion
      ctx.strokeStyle = `rgba(180, 30, 30, ${alpha * 0.25})`;
      ctx.lineWidth = width + 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      drawFn();

      // Deep cinnabar core
      ctx.strokeStyle = `rgba(165, 20, 20, ${alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      drawFn();

      // Sharp inner crimson vein
      ctx.strokeStyle = `rgba(220, 40, 40, ${alpha * 0.9})`;
      ctx.lineWidth = Math.max(1.2, width * 0.4);
      drawFn();
      ctx.restore();
    };

    // --- 4. Top Crown: Celestial Sigil (태을천존 / 천부수호관) ---
    ctx.save();
    ctx.font = 'bold 20px "Noto Serif KR", "Batang", serif';
    ctx.fillStyle = '#9e1818';
    ctx.textAlign = 'center';
    ctx.fillText('勅令', cw / 2, 58); // Imperial Decree
    ctx.font = 'bold 13px "Noto Serif KR", "Batang", serif';
    ctx.fillText('天上大吉 開運守護', cw / 2, 78);

    // Three Cosmic Star Points (삼태성)
    [-24, 0, 24].forEach((ox) => {
      ctx.fillStyle = '#8f1515';
      ctx.beginPath();
      ctx.arc(cw / 2 + ox, 94, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // --- 5. Main Body: Mystical Talismanic Calligraphy (영험한 부적 중심 필획) ---
    // Upper Sigil Arch
    drawCinnabarStroke(() => {
      ctx.beginPath();
      ctx.moveTo(cw / 2 - 70, 118);
      ctx.bezierCurveTo(cw / 2 - 35, 102, cw / 2 + 35, 102, cw / 2 + 70, 118);
      ctx.lineTo(cw / 2, 142);
      ctx.lineTo(cw / 2 - 70, 118);
      ctx.stroke();
    }, 3.5);

    // Center Mystical Character: 萬福雲集 & 百邪退散 융합 상형 부적
    drawCinnabarStroke(() => {
      ctx.beginPath();
      // Center vertical lightning spine
      ctx.moveTo(cw / 2, 142);
      ctx.lineTo(cw / 2, 190);
      ctx.lineTo(cw / 2 - 35, 204);
      ctx.lineTo(cw / 2 + 35, 218);
      ctx.lineTo(cw / 2 - 42, 236);
      ctx.lineTo(cw / 2 + 42, 254);
      ctx.lineTo(cw / 2, 280);
      ctx.lineTo(cw / 2, 355);
      ctx.stroke();
    }, 4.2);

    // Left Wing: Water & Wood Flow (수목생화)
    drawCinnabarStroke(() => {
      ctx.beginPath();
      ctx.moveTo(cw / 2 - 18, 172);
      ctx.bezierCurveTo(cw / 2 - 65, 190, cw / 2 - 75, 255, cw / 2 - 30, 280);
      ctx.bezierCurveTo(cw / 2 - 12, 292, cw / 2 - 22, 320, cw / 2 - 50, 335);
      ctx.stroke();
    }, 3);

    // Right Wing: Gold & Fire Power (금화합덕)
    drawCinnabarStroke(() => {
      ctx.beginPath();
      ctx.moveTo(cw / 2 + 18, 172);
      ctx.bezierCurveTo(cw / 2 + 65, 190, cw / 2 + 75, 255, cw / 2 + 30, 280);
      ctx.bezierCurveTo(cw / 2 + 12, 292, cw / 2 + 22, 320, cw / 2 + 50, 335);
      ctx.stroke();
    }, 3);

    // Four-Leaf Miracle Clover Sigil in Center
    drawCinnabarStroke(() => {
      ctx.beginPath();
      const cx = cw / 2;
      const cy = 295;
      // 4 Petals
      ctx.arc(cx - 8, cy - 8, 6.5, 0, Math.PI * 2);
      ctx.arc(cx + 8, cy - 8, 6.5, 0, Math.PI * 2);
      ctx.arc(cx - 8, cy + 8, 6.5, 0, Math.PI * 2);
      ctx.arc(cx + 8, cy + 8, 6.5, 0, Math.PI * 2);
      ctx.stroke();
    }, 2.2);

    // Bottom Triple Ring Anchor (삼재소멸 3연륜)
    drawCinnabarStroke(() => {
      ctx.beginPath();
      ctx.arc(cw / 2 - 28, 380, 11, 0, Math.PI * 2);
      ctx.arc(cw / 2, 388, 13, 0, Math.PI * 2);
      ctx.arc(cw / 2 + 28, 380, 11, 0, Math.PI * 2);
      ctx.moveTo(cw / 2 - 45, 402);
      ctx.lineTo(cw / 2 + 45, 402);
      ctx.moveTo(cw / 2, 402);
      ctx.lineTo(cw / 2, 430);
      ctx.stroke();
    }, 3.5);

    // --- 6. Personal Inscription: User Name & Today Date (소원자 각인) ---
    ctx.save();
    ctx.font = 'bold 12.5px "Noto Serif KR", "Batang", serif';
    ctx.fillStyle = '#7a1212';
    ctx.textAlign = 'center';
    ctx.fillText(`${userName} 님 保命安寧`, cw / 2, 460);

    ctx.font = '10.5px "Noto Serif KR", "Batang", serif';
    ctx.fillStyle = '#8a2525';
    ctx.fillText(`丙午年 ${todayKey} 天運 守護`, cw / 2, 478);
    ctx.restore();

    // --- 7. Red Vermilion Official Seal Stamps (주사 직인 낙관) ---
    // Bottom-Left Seal: 天符大吉
    ctx.save();
    ctx.strokeStyle = '#a81313';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(38, 508, 36, 36);
    ctx.fillStyle = 'rgba(168, 19, 19, 0.12)';
    ctx.fillRect(38, 508, 36, 36);
    ctx.font = 'bold 11px "Noto Serif KR", "Batang", serif';
    ctx.fillStyle = '#9e1010';
    ctx.textAlign = 'center';
    ctx.fillText('天符', 56, 523);
    ctx.fillText('大吉', 56, 538);

    // Bottom-Right Seal: 三才守護
    ctx.strokeRect(cw - 74, 508, 36, 36);
    ctx.fillStyle = 'rgba(168, 19, 19, 0.12)';
    ctx.fillRect(cw - 74, 508, 36, 36);
    ctx.fillText('三才', cw - 56, 523);
    ctx.fillText('守護', cw - 56, 538);

    // Center Auspicious Lotus Crest
    ctx.font = 'bold 10px "Noto Serif KR", "Batang", serif';
    ctx.fillStyle = '#8a1818';
    ctx.fillText('萬福雲集 百邪退散', cw / 2, 565);
    ctx.restore();

    ctx.restore();
  }, [userName, todayKey]);

  useEffect(() => {
    drawTalisman();
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        drawTalisman();
      });
    }
  }, [drawTalisman]);

  // Handle Empower / 점안
  const handleEmpower = () => {
    if (isEmpowering) return;
    setIsEmpowering(true);
    setIsEmpowered(true);
    setTimeout(() => setIsEmpowering(false), 2500);
  };

  // Handle Download Talisman as Image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    try {
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `TRINITY_천상수호부적_${userName}_${todayKey}.png`;
      link.href = imageUri;
      link.click();
    } catch (err) {
      console.warn('Failed to download amulet image:', err);
    } finally {
      setDownloading(false);
    }
  };

  // Handle Copy Mantra
  const handleCopy = () => {
    navigator.clipboard.writeText(
      `[트리니티 천상 수호 부적]\n👤 소원자: ${userName}\n📅 날짜: ${todayKey}\n✨ 축원: ${luckyData.dailyAmuletBlessing}\n🔑 개운 비법: ${luckyData.goldenKey}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-5 animate-fade-in font-sans">
      {/* 3D Talisman Card Container - Responsive Aspect Ratio */}
      <div className="relative w-full max-w-[340px] sm:max-w-[370px] mx-auto aspect-[9/15.2]" style={{ perspective: '1200px' }}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.65, type: 'spring', stiffness: 90, damping: 15 }}
          className="relative w-full h-full cursor-pointer"
          style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* ================= FRONT: Real Sacred Talisman Canvas ================= */}
          <div
            className="absolute inset-0 rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-yellow-500/50 flex flex-col items-center justify-between p-2.5 sm:p-3.5 bg-zinc-950 group"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(1px)',
              WebkitTransform: 'translateZ(1px)',
            }}
          >
            {/* Luminous Glow when Empowered */}
            {isEmpowered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-yellow-400/20 blur-xl pointer-events-none z-20"
              />
            )}

            {/* Canvas of the Real Amulet */}
            <div className="relative w-full h-full rounded-[22px] sm:rounded-[28px] overflow-hidden shadow-2xl border border-yellow-600/40 bg-black/40 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain select-none pointer-events-none"
              />

              {/* Specular Silk Gold Sheen on Hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Flip Guide Hint */}
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-[10px] text-white/90 font-mono flex items-center gap-1 backdrop-blur-md z-30 shadow-md">
                <RotateCw size={11} className="text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>탭하여 해설 보기</span>
              </div>
            </div>
          </div>

          {/* ================= BACK: Talisman Lore & Chanting Mantra ================= */}
          <div
            className="absolute inset-0 rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] border border-yellow-500/40 p-5 sm:p-7 bg-gradient-to-b from-zinc-900 via-zinc-950 to-amber-950/60 text-left flex flex-col justify-between backdrop-blur-3xl"
            style={{
              transform: 'rotateY(180deg) translateZ(1px)',
              WebkitTransform: 'rotateY(180deg) translateZ(1px)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="space-y-3.5 overflow-y-auto [scrollbar-width:none]">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Shield size={17} className="text-yellow-400" />
                  <span className="text-xs font-bold font-mono text-yellow-300 uppercase tracking-wider">
                    TALISMAN LORE • 부적 해설
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-bold">
                  {luckyData?.luckLevelTitle || 'LV.4 황금빛 도약'}
                </span>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  천상대길 만복운집 수호부 (天上大吉 萬福雲集符)
                </h4>
                <p className="text-[11px] sm:text-xs text-white/65 mt-1 font-sans leading-relaxed break-keep">
                  {userName}님의 사주 본원({dayMaster})에 부족한 기운을 보양하고, 오늘 하루 침입하는 액운과 구설을 차단하는 영험한 주사경면 수호 신패입니다.
                </p>
              </div>

              {/* Sacred Blessing Mantra */}
              <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
                <span className="text-[10px] font-bold text-yellow-400/90 font-mono uppercase tracking-wider block">
                  DAILY MANTRA • 수호 축언문
                </span>
                <p className="text-xs sm:text-sm font-serif italic text-yellow-200/95 leading-relaxed break-keep">
                  {luckyData?.dailyAmuletBlessing || '“당신이 내딛는 모든 발걸음마다 우주의 황금빛 은총과 행운이 동행합니다.”'}
                </p>
              </div>

              {/* How to Carry Today */}
              <div className="p-3 rounded-2xl bg-yellow-950/20 border border-yellow-500/25 text-xs text-white/80 space-y-1">
                <span className="text-yellow-400 font-bold block flex items-center gap-1 text-[11px]">
                  <Flame size={13} /> 오늘 부적 간직 비법
                </span>
                <p className="text-[10px] sm:text-[11px] text-white/70 leading-relaxed break-keep">
                  스마트폰 화면에 저장해 두거나, 마음이 불안할 때 부적을 떠올리며 심호흡 3회를 하시면 수호 결계가 즉시 활성화됩니다.
                </p>
              </div>
            </div>

            <div className="text-center pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono text-white/50">
                탭하여 실물 부적으로 뒤집기 ↻
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="w-full max-w-[340px] sm:max-w-[370px] mx-auto flex flex-wrap items-center justify-center gap-2 pt-0.5">
        {/* Empower Button */}
        <button
          onClick={handleEmpower}
          disabled={isEmpowering}
          className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer ${
            isEmpowered
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50 shadow-[0_0_15px_rgba(234,179,8,0.25)]'
              : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black border border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.4)]'
          }`}
        >
          <Zap size={14} className={isEmpowered ? 'text-yellow-400' : 'text-black fill-current'} />
          <span>{isEmpowered ? '기운 충전 완료 (점안됨)' : '부적 점안하기 (기운 충전)'}</span>
        </button>

        {/* Download Image Button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="p-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
          title="스마트폰 소장용 고화질 부적 이미지 저장"
        >
          <Download size={14} className="text-yellow-400" />
          <span>소장</span>
        </button>

        {/* Copy Mantra */}
        <button
          onClick={handleCopy}
          className="p-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
          title="축언문 복사"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? '복사됨' : '복사'}</span>
        </button>

        {/* TTS Read */}
        <TTSButton
          text={luckyData?.dailyAmuletBlessing || '“당신이 내딛는 모든 발걸음마다 우주의 황금빛 은총과 행운이 동행합니다.”'}
          voice="Kore"
          className="p-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-yellow-300 text-xs font-bold transition-all shadow-md cursor-pointer"
        />
      </div>

      {/* Empowered Toast Notification */}
      <AnimatePresence>
        {isEmpowering && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-yellow-500/25 border border-yellow-400/60 text-yellow-200 text-xs font-bold flex items-center gap-2 shadow-2xl backdrop-blur-2xl"
          >
            <Sparkles size={16} className="text-yellow-300 animate-spin" />
            <span>✨ {userName}님의 부적에 천상의 수호 영험이 점안(點眼)되었습니다!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
