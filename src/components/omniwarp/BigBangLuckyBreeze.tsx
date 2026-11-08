import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';

interface BigBangLuckyBreezeProps {
  settling: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

interface CloverLeafConfig {
  id: number;
  startX: number; // percentage 0-100
  startY: number; // percentage 30-105
  size: number; // px 13-30
  duration: number; // sec 2.5-4.8
  delay: number; // sec
  swayAmount: number; // px -80 to +80
  initialRotate: number; // deg
  spinTotal: number; // deg
  color: string;
  glow: string;
  scale: number;
  opacityMax: number;
}

const CLOVER_COLORS = [
  '#34d399', // bright mint emerald
  '#10b981', // classic four-leaf clover green
  '#6ee7b7', // soft jade
  '#a7f3d0', // pastel spring leaf
  '#86efac', // fresh lime green
  '#d9f99d', // sunlit golden clover
];

export function BigBangLuckyBreeze({ settling }: BigBangLuckyBreezeProps) {
  const reduced = useReducedMotion();

  // 화면 전체를 48개의 다양한 깊이(원근감)를 가진 네잎클로버들이 자연스럽게 춤추듯 가득 채우도록 사전 생성
  const clovers = useMemo<CloverLeafConfig[]>(() => {
    return Array.from({ length: 48 }, (_, i) => {
      const isForeground = i % 4 === 0;
      const isBackground = i % 3 === 0;

      const size = isForeground ? 24 + (i % 7) : isBackground ? 12 + (i % 5) : 17 + (i % 6);
      const scale = isForeground ? 1.15 : isBackground ? 0.75 : 0.95;
      const opacityMax = isForeground ? 0.95 : isBackground ? 0.55 : 0.85;

      const startX = (i * 23 + 7) % 100;
      // 화면 하단(빅뱅 버튼 및 지면)에서 사뿐사뿐 솟구쳐 위로 올라가도록 시작 Y 분포 (아래에서 위로)
      const startY = 85 + ((i * 11) % 30); // 85vh ~ 115vh (화면 하단 및 지면 근처)

      const duration = 2.6 + (i % 9) * 0.25;
      const delay = -((i % 16) * 0.22); // 음수 딜레이로 렌더링 즉시 화면 전체에 클로버가 흩날리는 상태 제공

      const swayAmount = (i % 2 === 0 ? 1 : -1) * (45 + (i % 6) * 16);
      const initialRotate = (i * 47) % 360;
      const spinTotal = (i % 2 === 0 ? 1 : -1) * (180 + (i % 5) * 90);

      const color = CLOVER_COLORS[i % CLOVER_COLORS.length];
      const glow = isForeground ? 'drop-shadow(0 0 8px rgba(52,211,153,0.5))' : 'drop-shadow(0 0 4px rgba(110,231,183,0.35))';

      return {
        id: i,
        startX,
        startY,
        size,
        duration,
        delay,
        swayAmount,
        initialRotate,
        spinTotal,
        color,
        glow,
        scale,
        opacityMax,
      };
    });
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      aria-hidden="true"
      data-bigbang-lucky-breeze-fullscreen="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-[10035]"
      style={{
        width: '100vw',
        height: '100dvh',
        opacity: settling ? 0 : 1,
        transition: 'opacity 1.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {clovers.map((c) => {
        return (
          <motion.div
            key={c.id}
            className="absolute will-change-transform"
            style={{
              left: `${c.startX}vw`,
              top: `${c.startY}vh`,
              width: c.size,
              height: c.size,
              color: c.color,
              filter: c.glow,
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: c.scale * 0.7,
              rotate: c.initialRotate,
              rotateY: 0,
            }}
            animate={
              reduced
                ? { opacity: settling ? 0 : c.opacityMax * 0.6 }
                : {
                    // 자연스러운 바람 궤적: 아래에서 위로 S자 곡선으로 소용돌이치며 화면 위(-115vh)로 솟구침
                    x: [0, c.swayAmount * 0.6, -c.swayAmount * 0.4, c.swayAmount * 0.8],
                    y: [0, -350, -700, -1150],
                    opacity: [0, c.opacityMax, c.opacityMax * 0.9, 0],
                    scale: [c.scale * 0.75, c.scale * 1.05, c.scale, c.scale * 0.8],
                    rotate: [c.initialRotate, c.initialRotate + c.spinTotal * 0.5, c.initialRotate + c.spinTotal],
                    // 나뭇잎이 공중에서 바람을 타고 펄럭이는 3D 입체 플립 (Tumble & Flutter)
                    rotateY: [0, 180, 360, 540],
                  }
            }
            transition={{
              duration: c.duration,
              delay: c.delay,
              repeat: settling ? 0 : Infinity,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {/* 정교한 네잎클로버 벡터: 하트형 4개 잎사귀 + 유려한 줄기 곡선 */}
            <svg viewBox="0 0 28 30" width="100%" height="100%" fill="currentColor">
              {/* 4개의 하트 모양 잎사귀 */}
              {[0, 90, 180, 270].map((angle) => (
                <path
                  key={angle}
                  transform={`rotate(${angle} 14 14)`}
                  d="M14 14C11 12 5 9 6 5C7 1 12 2 14 6C16 2 21 1 22 5C23 9 17 12 14 14Z"
                />
              ))}
              {/* 은은한 잎맥 디테일 */}
              {[45, 135, 225, 315].map((angle) => (
                <line
                  key={angle}
                  x1="14"
                  y1="14"
                  x2="14"
                  y2="7"
                  transform={`rotate(${angle} 14 14)`}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                />
              ))}
              {/* 부드러운 줄기 곡선 */}
              <path
                d="M14 14Q18 23 11 28"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>,
    document.body
  );
}
