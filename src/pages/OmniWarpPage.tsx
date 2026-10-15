import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft, Sparkles, Zap, Compass } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

export default function OmniWarpPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Gaze & Force state refs
  const isGazingRef = useRef(false);
  const gazeStartTimeRef = useRef(0);
  const forceLevelRef = useRef(0);
  const targetForceRef = useRef(0);
  const mouseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // React state for Viewport card & Vision
  const [viewTitle, setViewTitle] = useState("현재 차원: 홈 대시보드");
  const [viewTitleColor, setViewTitleColor] = useState("#ffffff");
  const [viewDesc, setViewDesc] = useState(
    "구슬에 손가락을 대면 다음 기능과 미래의 화면이 구슬 속에 실시간으로 맺힙니다."
  );
  const [cardBorder, setCardBorder] = useState("rgba(255, 255, 255, 0.1)");
  const [cardScale, setCardScale] = useState(1);

  // Vision inside orb state
  const [visionOpacity, setVisionOpacity] = useState(0);
  const [visionScale, setVisionScale] = useState(0.6);
  const [visionIcon, setVisionIcon] = useState("✨");
  const [visionLabel, setVisionLabel] = useState("미래 투영 중");
  const [visionColor, setVisionColor] = useState("#ffffff");
  const [visionShadow, setVisionShadow] = useState("0 0 8px #ffffff");
  const [ballBoxShadow, setBallBoxShadow] = useState(
    "inset 0 0 20px rgba(255, 255, 255, 0.3), inset -5px -5px 15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(110, 130, 255, 0.2)"
  );
  const [telemetry, setTelemetry] = useState("Orb State: SLEEPING");

  const triggerBigBang = useCallback((x: number, y: number, isDeep: boolean) => {
    particlesRef.current = [];
    const count = 130;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isDeep ? Math.random() * 12 + 4 : Math.random() * 7 + 2;
      particlesRef.current.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3.5 + 1,
        color: isDeep
          ? `hsl(${Math.random() * 40 + 300}, 100%, 70%)`
          : `hsl(${Math.random() * 40 + 180}, 100%, 75%)`,
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.015,
      });
    }
  }, []);

  const onStart = useCallback((e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
    isGazingRef.current = true;
    gazeStartTimeRef.current = performance.now();
    targetForceRef.current = 0.2;

    setVisionOpacity(1);
    setVisionScale(0.85);
    setBallBoxShadow(
      "inset 0 0 20px rgba(255, 255, 255, 0.4), inset -5px -5px 15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 240, 255, 0.4)"
    );
  }, []);

  const onMove = useCallback((e: TouchEvent) => {
    if (!isGazingRef.current) return;
    const touch = e.touches ? e.touches[0] : null;
    if (touch && (touch as any).force > 0) {
      targetForceRef.current = (touch as any).force;
    }
  }, []);

  const onEnd = useCallback(() => {
    if (!isGazingRef.current) return;
    isGazingRef.current = false;

    const duration = performance.now() - gazeStartTimeRef.current;
    const rect = ballRef.current?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + rect.height / 2 : window.innerHeight - 80;
    const force = forceLevelRef.current;

    if (duration < 220 && force < 0.3) {
      // 1순위 즉시 실행
      triggerBigBang(originX, originY, false);
      setViewTitle("✨ 1순위: 즉시 요약 실행");
      setViewTitleColor("#00f0ff");
      setViewDesc("수정구슬 속에 보였던 가장 명확한 핵심 액션이 현실 화면으로 펼쳐졌습니다.");
      setCardBorder("rgba(0, 240, 255, 0.5)");
      setCardScale(0.97);
      setTimeout(() => setCardScale(1), 150);
    } else if (force >= 0.3 && force < 0.7) {
      // 화이트홀 수렴 전이
      triggerBigBang(originX, originY, false);
      setViewTitle("🔮 타로 1장 뽑기 전이");
      setViewTitleColor("#a2b4ff");
      setViewDesc("구슬 속 맑은 예지가 화면 전체로 확장되어 오늘의 운명 카드가 펼쳐집니다.");
      setCardBorder("rgba(162, 180, 255, 0.5)");
    } else {
      // 블랙홀 빅뱅 전이
      triggerBigBang(originX, originY, true);
      setViewTitle("💥 다차원 AI 심층 리딩 폭발");
      setViewTitleColor("#ff0099");
      setViewDesc(
        "구슬 속 깊은 우주가 폭발하며 78장의 카드 전체 맥락과 AI 심층 운명 리포트가 생성되었습니다."
      );
      setCardBorder("rgba(255, 0, 153, 0.6)");
    }

    // Reset orb
    setVisionOpacity(0);
    setVisionScale(0.6);
    setBallBoxShadow(
      "inset 0 0 20px rgba(255, 255, 255, 0.3), inset -5px -5px 15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(110, 130, 255, 0.2)"
    );
    setTelemetry("Orb State: MANIFESTED");
    forceLevelRef.current = 0;
    targetForceRef.current = 0;
  }, [triggerBigBang]);

  // Window listeners for global touchmove & mouseup
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => onMove(e);
    const handleTouchEnd = () => onEnd();
    const handleMouseUp = () => {
      if (mouseIntervalRef.current) {
        clearInterval(mouseIntervalRef.current);
        mouseIntervalRef.current = null;
      }
      onEnd();
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("mouseup", handleMouseUp);
      if (mouseIntervalRef.current) clearInterval(mouseIntervalRef.current);
    };
  }, [onMove, onEnd]);

  // Canvas & continuous loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isGazingRef.current) {
        forceLevelRef.current += (targetForceRef.current - forceLevelRef.current) * 0.15;
        const cur = forceLevelRef.current;
        const percent = (cur * 100).toFixed(0);

        if (cur < 0.3) {
          setVisionIcon("⚡");
          setVisionLabel("즉시 탭\n[빠른 실행]");
          setVisionColor("#ffffff");
          setVisionShadow("0 0 8px #ffffff");
          setBallBoxShadow(
            "inset 0 0 20px rgba(255, 255, 255, 0.4), inset -5px -5px 15px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 255, 255, 0.5)"
          );
          setTelemetry(`Orb Vision: CLEAR FOCUS (${percent}%)`);
        } else if (cur >= 0.3 && cur < 0.7) {
          setVisionIcon("🔮");
          setVisionLabel("화이트홀 예지\n[오늘의 카드]");
          setVisionColor("#00f0ff");
          setVisionShadow("0 0 12px #00f0ff");
          setBallBoxShadow(
            "inset 0 0 22px rgba(255, 255, 255, 0.45), inset -5px -5px 15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 240, 255, 0.6)"
          );
          setTelemetry(`Orb Vision: WHITEHOLE PEEK (${percent}%)`);
        } else {
          setVisionIcon("🌌");
          setVisionLabel("블랙홀 빅뱅\n[전체 심층 리포트]");
          setVisionColor("#ff0099");
          setVisionShadow("0 0 16px #ff0099");
          setBallBoxShadow(
            "inset 0 0 25px rgba(255, 255, 255, 0.5), inset -5px -5px 15px rgba(0, 0, 0, 0.8), 0 0 45px rgba(255, 0, 153, 0.8)"
          );
          setTelemetry(`Orb Vision: BIGBANG MATRIX (${percent}%)`);
        }
      }

      // Draw particle system
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    onStart(e);
    if (mouseIntervalRef.current) clearInterval(mouseIntervalRef.current);
    mouseIntervalRef.current = setInterval(() => {
      if (isGazingRef.current) {
        targetForceRef.current = Math.min(1.0, targetForceRef.current + 0.04);
      }
    }, 30);
  };

  return (
    <div
      className="relative w-full h-screen text-white flex flex-col items-center justify-between overflow-hidden select-none touch-none font-sans"
      style={{
        background: "radial-gradient(circle at center, #0f1026 0%, #030308 100%)",
      }}
    >
      {/* Space Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />

      {/* Top Header & HUD */}
      <div className="relative z-20 mt-8 sm:mt-10 text-center flex flex-col items-center px-4">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white/80 transition-all border border-white/10"
          >
            <ArrowLeft size={14} />
            <span>프리즘 홈</span>
          </Link>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Crystal Orb BigBang
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold tracking-[3px] text-[#b5c2ff] uppercase">
          Crystal Orb Gateway
        </h1>
        <p className="text-xs text-[#6d738f] mt-1.5">
          손끝으로 구슬을 지그시 눌러 비치는 미래를 확인하세요
        </p>
      </div>

      {/* Middle Viewport Card */}
      <div className="relative z-20 w-[86%] max-w-[360px]">
        <div
          className="w-full rounded-[24px] p-6 backdrop-blur-xl flex flex-col items-center text-center transition-all duration-300 shadow-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderColor: cardBorder,
            borderWidth: "1px",
            transform: `scale(${cardScale})`,
          }}
        >
          <h2
            className="text-base sm:text-lg font-bold mb-2 transition-colors duration-150"
            style={{ color: viewTitleColor }}
          >
            {viewTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#9ba1ba] leading-relaxed break-keep">{viewDesc}</p>
        </div>
      </div>

      {/* Bottom Crystal Orb Interaction Area */}
      <div className="relative z-20 mb-10 sm:mb-12 flex flex-col items-center w-full px-4">
        {/* Crystal Ball Shell */}
        <div
          ref={ballRef}
          onMouseDown={handleMouseDown}
          onTouchStart={onStart}
          className="relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-100 border border-white/30 active:scale-95"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.7) 100%)",
            boxShadow: ballBoxShadow,
          }}
        >
          {/* Top Specular Curved Glass Glare */}
          <div
            className="absolute top-2.5 left-4.5 w-8 h-4 rounded-full pointer-events-none z-30 -rotate-[25deg]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.6) 0%, transparent 80%)",
            }}
          />

          {/* Peeking Vision inside Orb */}
          <div
            className="absolute w-[76px] h-[76px] rounded-full flex flex-col items-center justify-center text-center p-1.5 pointer-events-none z-20 select-none transition-all duration-150"
            style={{
              opacity: visionOpacity,
              transform: `scale(${visionScale})`,
            }}
          >
            <div className="text-2xl mb-0.5" style={{ textShadow: visionShadow }}>
              {visionIcon}
            </div>
            <div
              className="text-[9px] font-bold tracking-[0.5px] leading-tight whitespace-pre-line"
              style={{
                color: visionColor,
                textShadow: visionShadow,
              }}
            >
              {visionLabel}
            </div>
          </div>
        </div>

        {/* Telemetry Display */}
        <div className="font-mono text-[11px] text-[#585e78] mt-3.5 tracking-wider">
          {telemetry}
        </div>
      </div>
    </div>
  );
}
