import React, { useMemo } from 'react';
import {
  getPerfProfile,
  isFoldCoverScreen,
  isGalaxyFoldSeClass,
  isIPhoneXSClass,
  isLegacyMobile,
  isMobileDevice,
  isPerfReduced,
} from '@/lib/perfMode';

/** Deep-space palette for PRISM cosmic theme */
const COSMOS = {
  void: 'oklch(0.035 0.03 275)',
  abyss: 'oklch(0.055 0.04 265)',
  nebulaViolet: 'oklch(0.48 0.22 295)',
  nebulaBlue: 'oklch(0.42 0.19 255)',
  nebulaMagenta: 'oklch(0.52 0.21 330)',
  nebulaCyan: 'oklch(0.50 0.14 215)',
  galacticGold: 'oklch(0.72 0.10 85)',
};

function withAlpha(color: string, alpha: number): string {
  return color.replace(/\)$/, ` / ${alpha})`);
}

function buildStaticStars(count: number, minAlpha = 0.35): string {
  const layers: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = (i * 17 + 11) % 100;
    const y = (i * 23 + 7) % 100;
    const size = i % 4 === 0 ? 2 : i % 2 === 0 ? 1.5 : 1;
    const alpha = minAlpha + (i % 5) * 0.1;
    layers.push(
      `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255,255,255,${alpha}) 50%, transparent 100%)`,
    );
  }
  return layers.join(', ');
}

function meteorFlightAngle(endX: number, endY: number): number {
  if (typeof window === 'undefined') return 22;
  const ratio = window.innerHeight / window.innerWidth;
  return Math.round((Math.atan2(endY * ratio, endX) * 180) / Math.PI);
}

/** Pseudo-random spread (stable per index) across 0..max */
function spreadAt(index: number, salt: number, max: number): number {
  return ((index * 37 + salt * 17) % 1000) / 1000 * max;
}

const METEOR_SEQUENCE_CYCLE_S = 10;

function ShootingStars({ count }: { count: number }) {
  const meteors = useMemo(
    () =>
      Array.from({ length: Math.max(count, 5) }, (_, i) => {
        const effectiveCount = Math.max(count, 5);
        // Distribute starting points across the upper and left zones of the sky
        const startLeft = -5 + (i * 20) % 85 + spreadAt(i, 1, 8);
        const startTop = 2 + (i * 15) % 62 + spreadAt(i, 2, 6);

        // Travel diagonally (top-left to bottom-right)
        const endX = 70 + spreadAt(i, 3, 28);
        const endY = 22 + spreadAt(i, 4, 28) + (i % 3) * 6;

        const stagger = (METEOR_SEQUENCE_CYCLE_S * 0.92) / effectiveCount;
        return {
          id: i,
          startLeft,
          startTop,
          trail: 95 + spreadAt(i, 5, 50),
          angle: meteorFlightAngle(endX, endY),
          endX,
          endY,
          cycle: METEOR_SEQUENCE_CYCLE_S,
          delay: (i * stagger) % METEOR_SEQUENCE_CYCLE_S + spreadAt(i, 6, 1.2),
        };
      }),
    [count],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden>
      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="cosmic-meteor"
          style={{
            left: `${meteor.startLeft}%`,
            top: `${meteor.startTop}%`,
            ['--meteor-angle' as string]: `${meteor.angle}deg`,
            ['--meteor-trail' as string]: `${meteor.trail}px`,
            ['--meteor-end-x' as string]: `${meteor.endX}vw`,
            ['--meteor-end-y' as string]: `${meteor.endY}vh`,
            ['--meteor-cycle' as string]: `${meteor.cycle}s`,
            ['--meteor-delay' as string]: `${meteor.delay}s`,
          }}
        >
          <span className="cosmic-meteor__streak" />
        </div>
      ))}
    </div>
  );
}

function Starfield({ density, minSize }: { density: number; minSize: number }) {
  // Only render a lightweight batch of dynamic twinkling stars as DOM elements.
  // Static stars are already rendered with zero DOM overhead in the background CSS gradient.
  const twinkleCount = Math.min(16, Math.max(6, Math.floor(density / 6)));
  const stars = useMemo(
    () =>
      Array.from({ length: twinkleCount }, (_, i) => ({
        id: i,
        left: `${(i * 47 + 19) % 100}%`,
        top: `${(i * 59 + 13) % 100}%`,
        size: Math.max(minSize, i % 3 === 0 ? 2.2 : 1.6),
        opacity: 0.5 + (i % 4) * 0.12,
      })),
    [twinkleCount, minSize],
  );

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white cosmic-star-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            transform: 'translateZ(0)',
          }}
        />
      ))}
    </div>
  );
}

type ConstellationDef = {
  id: string;
  stars: Array<{
    id: string;
    x: number;
    y: number;
    size?: number;
    brightness?: number;
    flare?: boolean;
    color?: string;
  }>;
  lines: Array<[string, string]>;
};

const CONSTELLATIONS: ConstellationDef[] = [
  // 1. 북두칠성 (Ursa Major / Big Dipper) - Left upper sky (compact)
  {
    id: 'ursa_major',
    stars: [
      { id: 'alkaid', x: 85, y: 175, size: 2.0, brightness: 0.9 },
      { id: 'mizar', x: 120, y: 160, size: 1.9, brightness: 0.85 },
      { id: 'alioth', x: 155, y: 185, size: 2.2, brightness: 0.95, flare: true },
      { id: 'megrez', x: 195, y: 215, size: 1.7, brightness: 0.8 },
      { id: 'phecda', x: 190, y: 260, size: 1.9, brightness: 0.85 },
      { id: 'merak', x: 235, y: 255, size: 2.0, brightness: 0.9 },
      { id: 'dubhe', x: 245, y: 205, size: 2.4, brightness: 1.0, flare: true, color: '#fef08a' },
    ],
    lines: [
      ['alkaid', 'mizar'],
      ['mizar', 'alioth'],
      ['alioth', 'megrez'],
      ['megrez', 'dubhe'],
      ['dubhe', 'merak'],
      ['merak', 'phecda'],
      ['phecda', 'megrez'],
    ],
  },

  // 2. 북극성 & 작은곰자리 (Polaris & Ursa Minor) - Top center (compact)
  {
    id: 'ursa_minor',
    stars: [
      { id: 'polaris', x: 460, y: 65, size: 2.8, brightness: 1.0, flare: true, color: '#fef08a' },
      { id: 'yildun', x: 435, y: 85, size: 1.5, brightness: 0.7 },
      { id: 'eps_umi', x: 420, y: 105, size: 1.5, brightness: 0.7 },
      { id: 'zeta_umi', x: 405, y: 125, size: 1.7, brightness: 0.75 },
      { id: 'kochab', x: 375, y: 118, size: 2.3, brightness: 0.9, flare: true, color: '#fed7aa' },
      { id: 'pherkad', x: 380, y: 150, size: 2.0, brightness: 0.85 },
      { id: 'eta_umi', x: 412, y: 142, size: 1.6, brightness: 0.7 },
    ],
    lines: [
      ['polaris', 'yildun'],
      ['yildun', 'eps_umi'],
      ['eps_umi', 'zeta_umi'],
      ['zeta_umi', 'kochab'],
      ['kochab', 'pherkad'],
      ['pherkad', 'eta_umi'],
      ['eta_umi', 'zeta_umi'],
    ],
  },

  // 3. 카시오페이아 (Cassiopeia) - Upper right sky (compact)
  {
    id: 'cassiopeia',
    stars: [
      { id: 'caph', x: 730, y: 125, size: 2.0, brightness: 0.88 },
      { id: 'schedar', x: 770, y: 150, size: 2.3, brightness: 0.95, flare: true, color: '#fed7aa' },
      { id: 'navi', x: 805, y: 115, size: 2.4, brightness: 1.0, flare: true },
      { id: 'ruchbah', x: 845, y: 142, size: 1.9, brightness: 0.85 },
      { id: 'segin', x: 880, y: 110, size: 1.8, brightness: 0.8 },
    ],
    lines: [
      ['caph', 'schedar'],
      ['schedar', 'navi'],
      ['navi', 'ruchbah'],
      ['ruchbah', 'segin'],
    ],
  },

  // 4. 백조자리 (Cygnus / Northern Cross) - Along the Milky Way band (compact)
  {
    id: 'cygnus',
    stars: [
      { id: 'deneb', x: 500, y: 230, size: 2.7, brightness: 1.0, flare: true, color: '#e0f2fe' },
      { id: 'sadr', x: 520, y: 290, size: 2.2, brightness: 0.9 },
      { id: 'albireo', x: 545, y: 370, size: 2.0, brightness: 0.88, color: '#fef08a' },
      { id: 'gienah', x: 450, y: 310, size: 1.9, brightness: 0.85 },
      { id: 'delta_cyg', x: 590, y: 270, size: 1.9, brightness: 0.85 },
    ],
    lines: [
      ['deneb', 'sadr'],
      ['sadr', 'albireo'],
      ['gienah', 'sadr'],
      ['sadr', 'delta_cyg'],
    ],
  },

  // 5. 거문고자리 · 직녀성 (Lyra & Vega) - Left center (compact)
  {
    id: 'lyra',
    stars: [
      { id: 'vega', x: 270, y: 440, size: 2.9, brightness: 1.0, flare: true, color: '#bae6fd' },
      { id: 'eps_lyr', x: 250, y: 465, size: 1.6, brightness: 0.75 },
      { id: 'zeta_lyr', x: 280, y: 485, size: 1.7, brightness: 0.8 },
      { id: 'sheliak', x: 265, y: 525, size: 2.0, brightness: 0.85, color: '#fed7aa' },
      { id: 'sulafat', x: 295, y: 510, size: 1.9, brightness: 0.85 },
    ],
    lines: [
      ['vega', 'eps_lyr'],
      ['eps_lyr', 'zeta_lyr'],
      ['zeta_lyr', 'sheliak'],
      ['sheliak', 'sulafat'],
      ['sulafat', 'zeta_lyr'],
      ['vega', 'zeta_lyr'],
    ],
  },

  // 6. 오리온자리 (Orion) - Lower right sky (compact)
  {
    id: 'orion',
    stars: [
      { id: 'betelgeuse', x: 755, y: 620, size: 2.7, brightness: 1.0, flare: true, color: '#fed7aa' },
      { id: 'bellatrix', x: 845, y: 610, size: 2.3, brightness: 0.9, color: '#bae6fd' },
      { id: 'alnitak', x: 785, y: 680, size: 1.9, brightness: 0.85 },
      { id: 'alnilam', x: 800, y: 672, size: 2.0, brightness: 0.9 },
      { id: 'mintaka', x: 815, y: 665, size: 1.9, brightness: 0.85 },
      { id: 'saiph', x: 770, y: 745, size: 2.0, brightness: 0.85 },
      { id: 'rigel', x: 860, y: 730, size: 2.8, brightness: 1.0, flare: true, color: '#bae6fd' },
    ],
    lines: [
      ['betelgeuse', 'bellatrix'],
      ['bellatrix', 'mintaka'],
      ['mintaka', 'alnilam'],
      ['alnilam', 'alnitak'],
      ['alnitak', 'betelgeuse'],
      ['alnitak', 'saiph'],
      ['saiph', 'rigel'],
      ['rigel', 'mintaka'],
    ],
  },
];

function ConstellationsLayer() {
  return (
    <svg
      className="cosmic-constellations absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Guide Alignment Pointer: Merak + Dubhe -> Polaris */}
      <line
        x1="235"
        y1="255"
        x2="460"
        y2="65"
        stroke="rgba(254, 240, 138, 0.1)"
        strokeWidth="0.6"
        strokeDasharray="2 4"
      />

      {CONSTELLATIONS.map((constellation) => {
        const starMap = new Map(constellation.stars.map((s) => [s.id, s]));

        return (
          <g key={constellation.id} className="constellation-group">
            {/* Constellation Connection Lines */}
            {constellation.lines.map(([idA, idB], lineIdx) => {
              const starA = starMap.get(idA);
              const starB = starMap.get(idB);
              if (!starA || !starB) return null;
              return (
                <line
                  key={`${constellation.id}_line_${lineIdx}`}
                  x1={starA.x}
                  y1={starA.y}
                  x2={starB.x}
                  y2={starB.y}
                  stroke="rgba(255, 255, 255, 0.11)"
                  strokeWidth="0.6"
                  strokeDasharray="1.5 2.5"
                />
              );
            })}

            {/* Constellation Stars */}
            {constellation.stars.map((star) => (
              <g key={star.id} transform={`translate(${star.x}, ${star.y})`}>
                {/* Outer Glow Disc - lightweight dual circle instead of heavy feGaussianBlur */}
                <circle
                  r={(star.size || 2) * 2.2}
                  fill={star.color || '#ffffff'}
                  opacity={0.16 * (star.brightness || 0.9)}
                />
                {/* Core Star Node */}
                <circle
                  r={star.size || 2}
                  fill={star.color || '#ffffff'}
                  opacity={star.brightness || 0.95}
                />
                {/* 4-Point Diffraction Flare on Alpha Stars */}
                {star.flare && (
                  <g className="cosmic-star-flare">
                    <line
                      x1={-((star.size || 2) * 2.2)}
                      y1="0"
                      x2={(star.size || 2) * 2.2}
                      y2="0"
                      stroke={star.color || '#ffffff'}
                      strokeWidth="0.6"
                      opacity="0.8"
                    />
                    <line
                      x1="0"
                      y1={-((star.size || 2) * 2.2)}
                      x2="0"
                      y2={(star.size || 2) * 2.2}
                      stroke={star.color || '#ffffff'}
                      strokeWidth="0.6"
                      opacity="0.8"
                    />
                  </g>
                )}
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

type NebulaOrbProps = {
  positionClass: string;
  orbClass?: string;
  color: string;
  opacity: number;
  blurPx: number;
  animate?: boolean;
  animationDuration?: string;
};

function NebulaOrb({
  positionClass,
  orbClass,
  color,
  opacity,
  animate = true,
  animationDuration,
}: NebulaOrbProps) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${positionClass} ${animate && orbClass ? orbClass : ''}`}
      style={{
        background: `radial-gradient(circle closest-side, ${withAlpha(color, opacity)} 0%, transparent 100%)`,
        animationDuration,
        willChange: animate ? 'transform' : 'auto',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
      }}
    />
  );
}

const AuroraBackgroundComponent: React.FC = () => {
  const profile = getPerfProfile();
  const { void: voidColor, abyss, nebulaViolet, nebulaBlue, nebulaMagenta, nebulaCyan, galacticGold } =
    COSMOS;

  const isXS = isIPhoneXSClass();
  const legacy = isLegacyMobile() || isXS;
  const isMobile = isMobileDevice() || isPerfReduced() || isXS || legacy;
  const foldCover = isGalaxyFoldSeClass() && isFoldCoverScreen();
  const galaxy = profile === 'galaxy';
  const starDensity = isMobile
    ? 20
    : legacy
      ? 36
      : foldCover
        ? 50
        : profile === 'pwa'
          ? 48
          : profile === 'reduced'
            ? 52
            : galaxy
              ? 64
              : 72;
  const minStarSize = legacy ? 2 : 1.5;
  const nebulaBlur = isXS ? 26 : legacy ? 48 : foldCover ? 82 : profile === 'full' || galaxy ? 104 : 72;
  const animateOrbs = !isMobile && (profile === 'full' || (galaxy && !foldCover));
  const staticStarCount = isMobile ? 20 : isXS ? 18 : legacy ? 28 : foldCover ? 32 : 36;
  const shootingStarCount = isXS ? 4 : legacy ? 4 : foldCover ? 5 : profile === 'full' ? 8 : galaxy ? 6 : 5;

  return (
    <div
      className="prism-aura-bg fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ contain: 'strict', contentVisibility: 'auto' }}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: isMobile
            ? [
                buildStaticStars(staticStarCount),
                `radial-gradient(ellipse 90% 50% at 50% 100%, ${withAlpha(nebulaViolet, 0.22)} 0%, transparent 60%)`,
                `radial-gradient(ellipse 70% 45% at 20% 20%, ${withAlpha(nebulaBlue, 0.22)} 0%, transparent 55%)`,
                `radial-gradient(ellipse 65% 45% at 85% 30%, ${withAlpha(nebulaMagenta, 0.18)} 0%, transparent 50%)`,
                `linear-gradient(180deg, ${voidColor} 0%, ${abyss} 45%, oklch(0.03 0.025 280) 100%)`,
              ].join(', ')
            : [
                buildStaticStars(staticStarCount),
                `radial-gradient(ellipse 95% 60% at 50% 108%, ${withAlpha(nebulaViolet, 0.28)} 0%, transparent 62%)`,
                `radial-gradient(ellipse 75% 55% at 6% 20%, ${withAlpha(nebulaBlue, 0.32)} 0%, transparent 58%)`,
                `radial-gradient(ellipse 70% 52% at 94% 32%, ${withAlpha(nebulaMagenta, 0.26)} 0%, transparent 55%)`,
                `radial-gradient(ellipse 58% 45% at 74% 80%, ${withAlpha(nebulaCyan, 0.22)} 0%, transparent 52%)`,
                `radial-gradient(ellipse 42% 34% at 26% 66%, ${withAlpha(galacticGold, 0.14)} 0%, transparent 50%)`,
                `linear-gradient(180deg, ${voidColor} 0%, ${abyss} 38%, oklch(0.042 0.038 290) 72%, oklch(0.03 0.025 280) 100%)`,
              ].join(', '),
        }}
      />

      {/* Galactic band & Nebula Orbs - Hardware-accelerated radial gradients to eliminate GPU offscreen blur rendering passes */}
      {!isMobile && (
        <>
          <div
            className={`absolute left-[-20%] top-[16%] w-[140%] h-[30%] rotate-[-12deg] pointer-events-none ${animateOrbs ? 'aura-orb-2' : ''}`}
            style={{
              opacity: legacy ? 0.2 : 0.16,
              background: `radial-gradient(ellipse 75% 50% at 50% 50%, ${withAlpha(nebulaViolet, 0.6)} 0%, ${withAlpha(nebulaMagenta, 0.4)} 45%, ${withAlpha(nebulaBlue, 0.25)} 75%, transparent 100%)`,
              willChange: animateOrbs ? 'transform' : 'auto',
              transform: 'translateZ(0)',
            }}
          />

          <NebulaOrb
            positionClass="-top-[12%] -left-[8%] w-[92vw] h-[72vw]"
            orbClass="aura-orb-1"
            color={nebulaBlue}
            opacity={legacy ? 0.42 : 0.36}
            blurPx={nebulaBlur}
            animate={animateOrbs}
          />
          <NebulaOrb
            positionClass="top-[5%] -right-[10%] w-[78vw] h-[65vw]"
            orbClass="aura-orb-2"
            color={nebulaViolet}
            opacity={legacy ? 0.38 : 0.32}
            blurPx={nebulaBlur}
            animate={animateOrbs}
          />
          <NebulaOrb
            positionClass="-bottom-[14%] right-[0%] w-[85vw] h-[68vw]"
            orbClass="aura-orb-3"
            color={nebulaMagenta}
            opacity={legacy ? 0.34 : 0.28}
            blurPx={nebulaBlur}
            animate={animateOrbs}
          />
          <NebulaOrb
            positionClass="bottom-[8%] left-[5%] w-[58vw] h-[50vw]"
            orbClass="aura-orb-1"
            color={nebulaCyan}
            opacity={legacy ? 0.28 : 0.22}
            blurPx={Math.round(nebulaBlur * 0.85)}
            animate={animateOrbs}
            animationDuration="22s"
          />
          <NebulaOrb
            positionClass="top-[42%] left-[38%] w-[38vw] h-[32vw]"
            orbClass="aura-orb-3"
            color={galacticGold}
            opacity={legacy ? 0.2 : 0.15}
            blurPx={Math.round(nebulaBlur * 0.7)}
            animate={animateOrbs}
            animationDuration="26s"
          />
        </>
      )}

      {/* Dynamic Starfield, Constellations & Shooting Stars (rendered on all devices) */}
      <Starfield density={starDensity} minSize={minStarSize} />
      <ConstellationsLayer />
      <ShootingStars count={shootingStarCount} />
    </div>
  );
};

export const AuroraBackground = React.memo(AuroraBackgroundComponent);
export default AuroraBackground;