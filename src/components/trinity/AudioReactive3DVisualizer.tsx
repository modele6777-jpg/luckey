import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import {
  globalAudioAnalyzer,
  getVisualizerThemeForCategory,
  createGlowParticleTexture,
  VisualizerMode,
  VisualizerColorTheme,
} from '@/lib/audioReactiveVisualizer';
import { Sparkles, Maximize2, Minimize2, Eye, Sliders, Volume2, RotateCcw } from 'lucide-react';

interface AudioReactive3DVisualizerProps {
  isPlaying: boolean;
  trackCategory?: string;
  trackName?: string;
  trackArtist?: string;
  mode?: 'card-bg' | 'stage';
  className?: string;
  onCloseStage?: () => void;
}

export function AudioReactive3DVisualizer({
  isPlaying,
  trackCategory,
  trackName,
  trackArtist,
  mode = 'card-bg',
  className = '',
  onCloseStage,
}: AudioReactive3DVisualizerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // User interactive state for stage mode
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('cosmic-galaxy');
  const [sensitivity, setSensitivity] = useState(1.2);
  const [showControls, setShowControls] = useState(true);
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    bass: 0,
    mid: 0,
    treble: 0,
    energy: 0,
  });

  const theme: VisualizerColorTheme = useMemo(
    () => getVisualizerThemeForCategory(trackCategory),
    [trackCategory]
  );

  // Interaction refs (orbit dragging)
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const rotationOffsetRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const zoomDistanceRef = useRef(mode === 'card-bg' ? 180 : 220);

  // Audio & Animation refs
  const animFrameIdRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const visualizerModeRef = useRef(visualizerMode);
  visualizerModeRef.current = visualizerMode;

  const sensitivityRef = useRef(sensitivity);
  sensitivityRef.current = sensitivity;

  const themeRef = useRef(theme);
  themeRef.current = theme;

  // Initialize Three.js scene
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 200;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.0035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    camera.position.z = zoomDistanceRef.current;

    // 2. Renderer setup
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: mode === 'stage',
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mode === 'stage' ? 2 : 1.5));
    } catch (e) {
      console.warn('[3D Visualizer] WebGL renderer init failed:', e);
      return;
    }

    const particleTexture = createGlowParticleTexture();

    // 3. Particle System Data
    const particleCount = mode === 'card-bg' ? 1400 : 3400;

    // Arrays for Geometry 1: Cosmic Galaxy
    const galaxyPositions = new Float32Array(particleCount * 3);
    const galaxyOriginals = new Float32Array(particleCount * 3);
    const galaxyColors = new Float32Array(particleCount * 3);
    const galaxyAngles = new Float32Array(particleCount);
    const galaxyRadii = new Float32Array(particleCount);
    const galaxySpeeds = new Float32Array(particleCount);
    const galaxySizes = new Float32Array(particleCount);

    // Arrays for Geometry 2: Sacred Crystal Prism & Rings
    const prismPositions = new Float32Array(particleCount * 3);
    const prismOriginals = new Float32Array(particleCount * 3);
    const prismColors = new Float32Array(particleCount * 3);

    // Arrays for Geometry 3: Hyperspace Vortex Tunnel
    const tunnelPositions = new Float32Array(particleCount * 3);
    const tunnelOriginals = new Float32Array(particleCount * 3);
    const tunnelColors = new Float32Array(particleCount * 3);

    const color1 = themeRef.current.threeColors.primary;
    const color2 = themeRef.current.threeColors.secondary;
    const color3 = themeRef.current.threeColors.accent;
    const colorGlow = themeRef.current.threeColors.glow;

    // Populate Galaxy Model
    const arms = 3;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = Math.pow(Math.random(), 1.7) * 110 + 5;
      const spinAngle = radius * 0.08;
      const branchAngle = ((i % arms) * ((2 * Math.PI) / arms));

      const randomX = (Math.random() - 0.5) * (12 + radius * 0.14);
      const randomY = (Math.random() - 0.5) * (10 + radius * 0.12);
      const randomZ = (Math.random() - 0.5) * (14 + radius * 0.16);

      const angle = branchAngle + spinAngle;
      const x = Math.cos(angle) * radius + randomX;
      const y = (Math.random() - 0.5) * (18 + radius * 0.15) + randomY;
      const z = Math.sin(angle) * radius + randomZ;

      galaxyPositions[i3] = x;
      galaxyPositions[i3 + 1] = y;
      galaxyPositions[i3 + 2] = z;

      galaxyOriginals[i3] = x;
      galaxyOriginals[i3 + 1] = y;
      galaxyOriginals[i3 + 2] = z;

      galaxyAngles[i] = angle;
      galaxyRadii[i] = radius;
      galaxySpeeds[i] = (0.2 + Math.random() * 0.8) * (1 / (radius * 0.05 + 1));
      galaxySizes[i] = 1.5 + Math.random() * 2.8;

      // Color distribution based on distance from core
      const mixRatio = Math.min(1, radius / 90);
      const mixedColor = new THREE.Color().copy(color1).lerp(color2, mixRatio);
      if (Math.random() > 0.85) {
        mixedColor.lerp(color3, 0.6);
      }
      galaxyColors[i3] = mixedColor.r;
      galaxyColors[i3 + 1] = mixedColor.g;
      galaxyColors[i3 + 2] = mixedColor.b;
    }

    // Populate Sacred Prism & Frequency Ring Model
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      if (i < particleCount * 0.35) {
        // Central Sacred Dual-Tetrahedron / Merkaba lattice
        const phi = Math.acos(-1 + (2 * i) / (particleCount * 0.35));
        const theta = Math.sqrt(particleCount * 0.35 * Math.PI) * phi;
        const r = 38 * Math.cbrt(Math.random());
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        prismPositions[i3] = x;
        prismPositions[i3 + 1] = y;
        prismPositions[i3 + 2] = z;
        prismColors[i3] = color1.r;
        prismColors[i3 + 1] = color1.g;
        prismColors[i3 + 2] = color1.b;
      } else {
        // Orbiting Concentric Frequency Halo Rings (3 Harmonic Rings)
        const ringIdx = i % 3;
        const ringBaseRadius = 55 + ringIdx * 28;
        const angle = (i / particleCount) * Math.PI * 18;
        const jitter = (Math.random() - 0.5) * 6;
        const tilt = ringIdx * 0.45;

        const x = Math.cos(angle) * (ringBaseRadius + jitter);
        const z = Math.sin(angle) * (ringBaseRadius + jitter);
        const y = Math.sin(angle * 2 + tilt) * 12 + (Math.random() - 0.5) * 4;

        prismPositions[i3] = x;
        prismPositions[i3 + 1] = y;
        prismPositions[i3 + 2] = z;

        const ringCol = ringIdx === 0 ? color1 : ringIdx === 1 ? color2 : color3;
        prismColors[i3] = ringCol.r;
        prismColors[i3 + 1] = ringCol.g;
        prismColors[i3 + 2] = ringCol.b;
      }

      prismOriginals[i3] = prismPositions[i3];
      prismOriginals[i3 + 1] = prismPositions[i3 + 1];
      prismOriginals[i3 + 2] = prismPositions[i3 + 2];
    }

    // Populate Hyperspace Vortex Tunnel Model
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const z = (Math.random() - 0.5) * 280;
      const angle = Math.random() * Math.PI * 2;
      const tunnelRadius = 40 + Math.random() * 55;
      const x = Math.cos(angle) * tunnelRadius;
      const y = Math.sin(angle) * tunnelRadius;

      tunnelPositions[i3] = x;
      tunnelPositions[i3 + 1] = y;
      tunnelPositions[i3 + 2] = z;

      tunnelOriginals[i3] = x;
      tunnelOriginals[i3 + 1] = y;
      tunnelOriginals[i3 + 2] = z;

      const normZ = (z + 140) / 280;
      const col = new THREE.Color().copy(color1).lerp(color2, normZ);
      if (Math.random() > 0.8) col.lerp(colorGlow, 0.5);

      tunnelColors[i3] = col.r;
      tunnelColors[i3 + 1] = col.g;
      tunnelColors[i3 + 2] = col.b;
    }

    // Create Active Buffer Geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions.slice(), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors.slice(), 3));

    const material = new THREE.PointsMaterial({
      size: mode === 'stage' ? 3.8 : 2.8,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      opacity: mode === 'stage' ? 0.95 : 0.72,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Inner Glowing Core Light / Ambient Light
    const coreLight = new THREE.PointLight(color1.getHex(), 2.5, 180);
    scene.add(coreLight);

    // Add Central Wireframe Icosahedron for sacred geometry enhancement
    const wireframeGeom = new THREE.IcosahedronGeometry(22, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: color2,
      wireframe: true,
      transparent: true,
      opacity: mode === 'stage' ? 0.35 : 0.18,
      blending: THREE.AdditiveBlending,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeom, wireframeMat);
    scene.add(wireframeMesh);

    // Dynamic Shockwave Ring
    const shockwaveRingGeom = new THREE.RingGeometry(2, 4, 48);
    const shockwaveRingMat = new THREE.MeshBasicMaterial({
      color: color3,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockwaveRing = new THREE.Mesh(shockwaveRingGeom, shockwaveRingMat);
    shockwaveRing.rotation.x = Math.PI / 2;
    scene.add(shockwaveRing);

    let shockwaveScale = 1;
    let shockwaveOpacity = 0;

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth || 300;
      const newHeight = container.clientHeight || 200;
      if (newWidth === width && newHeight === height) return;

      width = newWidth;
      height = newHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Main Animation Render Loop
    let clock = new THREE.Clock();
    let pulseAngle = 0;
    let metricThrottleCounter = 0;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const currentMode = visualizerModeRef.current;
      const currentSens = sensitivityRef.current;
      const isAudPlaying = isPlayingRef.current;

      // Sample Audio Analyser Frequencies
      const metrics = globalAudioAnalyzer.sample(isAudPlaying);

      // Periodically update React state for UI HUD meters (every 4 frames)
      metricThrottleCounter++;
      if (metricThrottleCounter % 4 === 0 && mode === 'stage') {
        setRealtimeMetrics({
          bass: Math.round(metrics.bass * 100),
          mid: Math.round(metrics.mid * 100),
          treble: Math.round(metrics.treble * 100),
          energy: Math.round(metrics.energy * 100),
        });
      }

      // Smooth camera orbit rotation from mouse/touch dragging
      targetRotationRef.current.x += (rotationOffsetRef.current.x - targetRotationRef.current.x) * 0.08;
      targetRotationRef.current.y += (rotationOffsetRef.current.y - targetRotationRef.current.y) * 0.08;

      // Base auto orbital spin + audio mid frequency acceleration
      const spinSpeed = (0.2 + metrics.mid * 0.6 * currentSens) * delta;
      particleSystem.rotation.y += spinSpeed;
      particleSystem.rotation.x = targetRotationRef.current.y + Math.sin(elapsedTime * 0.3) * 0.1;
      particleSystem.rotation.z = targetRotationRef.current.x * 0.5;

      wireframeMesh.rotation.y -= spinSpeed * 0.8;
      wireframeMesh.rotation.x += spinSpeed * 0.5;

      // Core pulsation & color adaptation
      const currentTheme = themeRef.current;
      coreLight.color.lerp(currentTheme.threeColors.primary, 0.08);
      coreLight.intensity = 1.2 + metrics.bass * 3.5 * currentSens;
      wireframeMat.color.lerp(currentTheme.threeColors.secondary, 0.08);

      // Beat reaction: Shockwave ring expansion
      if (metrics.isBeat) {
        shockwaveScale = 2;
        shockwaveOpacity = Math.min(0.9, 0.3 + metrics.beatIntensity * 0.6);
        shockwaveRing.scale.set(shockwaveScale, shockwaveScale, shockwaveScale);
        shockwaveRingMat.color.copy(currentTheme.threeColors.accent);
      }

      if (shockwaveOpacity > 0.01) {
        shockwaveScale += delta * (60 + metrics.energy * 50);
        shockwaveOpacity *= 0.92;
        shockwaveRing.scale.set(shockwaveScale, shockwaveScale, shockwaveScale);
        shockwaveRingMat.opacity = shockwaveOpacity;
      } else {
        shockwaveRingMat.opacity = 0;
      }

      // Wireframe scale bounce with bass
      const wireframeTargetScale = 1 + metrics.bass * 0.6 * currentSens;
      wireframeMesh.scale.setScalar(
        THREE.MathUtils.lerp(wireframeMesh.scale.x, wireframeTargetScale, 0.15)
      );

      // Vertex Manipulation based on active visualizer mode
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = geometry.attributes.color as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      const colors = colAttr.array as Float32Array;

      pulseAngle += delta * (1.2 + metrics.energy * 2.5);

      if (currentMode === 'cosmic-galaxy') {
        wireframeMesh.visible = mode === 'stage';
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const origX = galaxyOriginals[i3];
          const origY = galaxyOriginals[i3 + 1];
          const origZ = galaxyOriginals[i3 + 2];
          const radius = galaxyRadii[i];

          // Bass push outwards from core
          const bassExpansion = 1 + (metrics.bass * 0.45 * currentSens) / (1 + radius * 0.03);

          // Sine wave vertical harmonic undulation driven by mids
          const waveZ = Math.sin(radius * 0.08 - elapsedTime * 2.5) * (metrics.mid * 14 * currentSens);

          // Treble micro-sparkle jitter
          const trebleJitter = metrics.treble > 0.15 ? (Math.random() - 0.5) * (metrics.treble * 4) : 0;

          positions[i3] = origX * bassExpansion + trebleJitter;
          positions[i3 + 1] = origY + waveZ;
          positions[i3 + 2] = origZ * bassExpansion + trebleJitter;

          // Color modulation with audio energy
          const baseR = galaxyColors[i3];
          const baseG = galaxyColors[i3 + 1];
          const baseB = galaxyColors[i3 + 2];

          const glowBoost = metrics.energy * 0.45 * currentSens;
          colors[i3] = Math.min(1, baseR + glowBoost);
          colors[i3 + 1] = Math.min(1, baseG + glowBoost);
          colors[i3 + 2] = Math.min(1, baseB + glowBoost);
        }
      } else if (currentMode === 'sacred-prism') {
        wireframeMesh.visible = true;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const origX = prismOriginals[i3];
          const origY = prismOriginals[i3 + 1];
          const origZ = prismOriginals[i3 + 2];

          // Central crystal vs outer harmonic frequency rings
          if (i < particleCount * 0.35) {
            // Pulse crystal vertices with bass & mid
            const crystalFactor = 1 + metrics.bass * 0.55 * currentSens;
            positions[i3] = origX * crystalFactor;
            positions[i3 + 1] = origY * crystalFactor;
            positions[i3 + 2] = origZ * crystalFactor;
          } else {
            // Circular frequency oscilloscope wave on rings
            const dist = Math.hypot(origX, origZ);
            const freqIndex = Math.floor((i % 64));
            const freqVal = (metrics.frequencyData[freqIndex] || 0) / 255;
            const ringDisplacement = 1 + freqVal * 0.45 * currentSens;

            positions[i3] = origX * ringDisplacement;
            positions[i3 + 1] = origY + Math.sin(elapsedTime * 4 + dist) * (freqVal * 8);
            positions[i3 + 2] = origZ * ringDisplacement;
          }

          // Shimmer colors
          colors[i3] = prismColors[i3] + metrics.treble * 0.3;
          colors[i3 + 1] = prismColors[i3 + 1] + metrics.treble * 0.3;
          colors[i3 + 2] = prismColors[i3 + 2] + metrics.treble * 0.3;
        }
      } else if (currentMode === 'nebula-vortex') {
        wireframeMesh.visible = false;
        const warpSpeed = (60 + metrics.energy * 180 * currentSens) * delta;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          let z = positions[i3 + 2] + warpSpeed;
          if (z > 140) z = -140; // wrap around infinite tunnel

          const normDist = Math.abs(z) / 140;
          const vortexTwist = z * 0.015 + elapsedTime * 0.5;
          const origX = tunnelOriginals[i3];
          const origY = tunnelOriginals[i3 + 1];
          const baseRadius = Math.hypot(origX, origY);
          const dynamicRadius = baseRadius * (1 + metrics.bass * 0.4 * currentSens);

          positions[i3] = Math.cos(vortexTwist) * dynamicRadius;
          positions[i3 + 1] = Math.sin(vortexTwist) * dynamicRadius;
          positions[i3 + 2] = z;

          // Color trails in tunnel
          colors[i3] = tunnelColors[i3] * (1 - normDist * 0.3) + metrics.energy * 0.3;
          colors[i3 + 1] = tunnelColors[i3 + 1] * (1 - normDist * 0.3) + metrics.energy * 0.3;
          colors[i3 + 2] = tunnelColors[i3 + 2] * (1 - normDist * 0.3) + metrics.energy * 0.3;
        }
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Update camera distance with smooth lerp
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, zoomDistanceRef.current, 0.1);
      camera.lookAt(0, 0, 0);

      renderer?.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      wireframeGeom.dispose();
      wireframeMat.dispose();
      shockwaveRingGeom.dispose();
      shockwaveRingMat.dispose();

      if (renderer) {
        renderer.dispose();
      }
    };
  }, [mode]);

  // Touch and mouse orbital interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    rotationOffsetRef.current.x += dx * 0.006;
    rotationOffsetRef.current.y = Math.max(
      -Math.PI / 2.5,
      Math.min(Math.PI / 2.5, rotationOffsetRef.current.y + dy * 0.006)
    );

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (mode !== 'stage') return;
    zoomDistanceRef.current = Math.max(90, Math.min(350, zoomDistanceRef.current + e.deltaY * 0.15));
  };

  const handleResetCamera = () => {
    rotationOffsetRef.current = { x: 0, y: 0 };
    zoomDistanceRef.current = mode === 'card-bg' ? 180 : 220;
  };

  // Render for Card Background Mode (embedded behind player)
  if (mode === 'card-bg') {
    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 pointer-events-none overflow-hidden rounded-2xl select-none z-0 ${className}`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block opacity-75 transition-opacity duration-700"
        />
        {/* Soft Radial Ambient Vignette for text contrast & legibility */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/85 pointer-events-none" />
      </div>
    );
  }

  // Render for Stage Mode (Fullscreen Immersive 3D Experience)
  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      className={`fixed inset-0 z-[9999] flex flex-col bg-zinc-950 text-white select-none overflow-hidden touch-none cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* 3D WebGL Canvas Stage */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

      {/* Atmospheric Vignette & Cosmic Glow Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-black/30 to-black/90 z-10" />

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-4 py-3 sm:px-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border"
            style={{
              backgroundColor: `${theme.primary}25`,
              borderColor: `${theme.primary}60`,
            }}
          >
            <Sparkles size={16} style={{ color: theme.primary }} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-wide text-white">
                PRISM 3D 오디오 시각화
              </span>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-sm"
                style={{
                  backgroundColor: `${theme.primary}20`,
                  color: theme.primary,
                  borderColor: `${theme.primary}50`,
                }}
              >
                {theme.category}
              </span>
            </div>
            <span className="text-[11px] text-white/60">
              {trackName || '30곡 실시간 주파수 반응형 3D 파티클 엔진'} · {trackArtist || 'PRISM Audio Suite'}
            </span>
          </div>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetCamera}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 hover:text-white transition-all border border-white/10"
            title="3D 시점 중앙 복원"
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            onClick={() => setShowControls((v) => !v)}
            className={`p-2 rounded-xl active:scale-95 transition-all border ${
              showControls
                ? 'bg-amber-400/25 border-amber-400/50 text-amber-200'
                : 'bg-white/10 border-white/10 text-white/70 hover:text-white'
            }`}
            title={showControls ? '컨트롤 HUD 숨기기' : '컨트롤 HUD 보기'}
          >
            <Sliders size={15} />
          </button>
          {onCloseStage && (
            <button
              type="button"
              onClick={onCloseStage}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white transition-all border border-white/20"
              title="시각화 무대 닫기"
            >
              <Minimize2 size={16} />
            </button>
          )}
        </div>
      </header>

      {/* Center Interactive Drag Hint */}
      <div className="relative z-10 mx-auto mt-2 pointer-events-none">
        <span className="text-[10px] text-white/40 tracking-widest font-mono bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
          DRAG TO ORBIT · SCROLL TO ZOOM · 3D PARTICLES REACT TO FREQUENCIES
        </span>
      </div>

      {/* Floating Bottom HUD Controls */}
      {showControls && (
        <footer className="mt-auto relative z-20 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            {(
              [
                { id: 'cosmic-galaxy', label: '성운 나선 은하', desc: 'Cosmic Galaxy' },
                { id: 'sacred-prism', label: '신성 양자 프리즘', desc: 'Sacred Prism' },
                { id: 'nebula-vortex', label: '초차원 보텍스', desc: 'Vortex Tunnel' },
              ] as const
            ).map((item) => {
              const isActive = visualizerMode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setVisualizerMode(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400/25 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Real-time Frequency Spectrum Meters HUD */}
          <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl">
            {/* Bass */}
            <div className="flex flex-col items-center gap-1 min-w-[38px]">
              <span className="text-[9px] font-mono text-white/50 tracking-wider">BASS</span>
              <div className="w-10 h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-75"
                  style={{
                    width: `${realtimeMetrics.bass}%`,
                    backgroundColor: theme.primary,
                  }}
                />
              </div>
              <span className="text-[8px] font-mono text-white/70">{realtimeMetrics.bass}%</span>
            </div>

            {/* Mid */}
            <div className="flex flex-col items-center gap-1 min-w-[38px]">
              <span className="text-[9px] font-mono text-white/50 tracking-wider">MID</span>
              <div className="w-10 h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-75"
                  style={{
                    width: `${realtimeMetrics.mid}%`,
                    backgroundColor: theme.secondary,
                  }}
                />
              </div>
              <span className="text-[8px] font-mono text-white/70">{realtimeMetrics.mid}%</span>
            </div>

            {/* Treble */}
            <div className="flex flex-col items-center gap-1 min-w-[38px]">
              <span className="text-[9px] font-mono text-white/50 tracking-wider">HIGH</span>
              <div className="w-10 h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-75"
                  style={{
                    width: `${realtimeMetrics.treble}%`,
                    backgroundColor: theme.accent,
                  }}
                />
              </div>
              <span className="text-[8px] font-mono text-white/70">{realtimeMetrics.treble}%</span>
            </div>

            {/* Total Energy Pulse Meter */}
            <div className="flex flex-col items-center gap-1 min-w-[42px] border-l border-white/10 pl-2">
              <span className="text-[9px] font-mono text-amber-300 font-bold tracking-wider">ENERGY</span>
              <div className="w-12 h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-75"
                  style={{ width: `${realtimeMetrics.energy}%` }}
                />
              </div>
              <span className="text-[8px] font-mono text-amber-300 font-semibold">{realtimeMetrics.energy}%</span>
            </div>
          </div>

          {/* Sensitivity Slider */}
          <div className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-xs text-white/70">
            <span className="text-[10px] text-white/50 whitespace-nowrap">반응 감도</span>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-20 accent-amber-400 bg-white/20 rounded-lg cursor-pointer"
            />
            <span className="text-[9px] font-mono text-amber-300 w-8 text-right">
              {sensitivity.toFixed(1)}x
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
