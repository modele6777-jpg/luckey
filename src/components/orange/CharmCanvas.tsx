import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Download, RefreshCw, Trash2, Copy, Share2, 
  Sparkle, Bookmark, Eye, CheckCircle, Flame, Sprout, Shield, Coins, Heart, Sun, Info, Check,
  Zap, Compass, Droplet, Star, ShieldCheck, HelpCircle, Layers, Award, ChevronRight, X
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { sendCharmCanvasToLucy } from '@/lib/oracleDeepInsight';
import {
  PRISM_TALISMAN_CHEST_KEY,
  type SavedTalisman,
  resolveEquippedCharm,
  persistEquippedCharm,
  notifyCharmChanged,
  isCharmFromToday,
  loadTalismanChest,
} from '@/lib/charmStorage';
import { playAudioHaptic } from '@/lib/audioHaptics';

interface CharmCanvasProps {
  onSuggestText?: (text: string) => void;
  onChangeWish?: (text: string) => void;
}

const ELEMENT_DETAILS = {
  wood: {
    hanja: '木',
    name: '목(木) - 성장과 활력의 청룡(靑龍)',
    desc: '하늘로 솟구치며 생동하는 나무의 성질로, 새로운 추진력과 기획력, 그리고 학업과 직업의 운명을 여는 힘',
    color: '#0fc781', 
    bgClass: 'from-emerald-950/40 to-teal-950/20 border-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    keyword: '학업운 및 창조 도약 기류',
    gradient: ['#047857', '#065f46', '#022c22'],
    spiritKeywords: 'ancient evergreen forest spirit, emerald wood node, growing organic branches'
  },
  fire: {
    hanja: '火',
    name: '화(火) - 매혹과 주조의 주작(朱雀)',
    desc: '어둠 속을 찬란히 비추는 신성한 불새의 열정으로, 매혹적인 인기와 직관적 영감, 존재감을 폭발시키는 힘',
    color: '#f97316', 
    bgClass: 'from-orange-950/40 to-red-950/20 border-orange-500/30',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    keyword: '예술 영감 및 인기 매혹 기맥',
    gradient: ['#c2410c', '#9a3412', '#450a0a'],
    spiritKeywords: 'blazing cosmic sunflames, radiant solar crown, orange fire sparks'
  },
  earth: {
    hanja: '土',
    name: '토(土) - 중용과 포용의 신구(神龜)',
    desc: '만물을 품어 기름을 허용하는 어안 대지의 중용으로, 신뢰감과 정신적 평안, 육체의 안락을 도모하는 백해방벽',
    color: '#eab308', 
    bgClass: 'from-amber-950/40 to-yellow-950/20 border-amber-500/30',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    keyword: '무병장수 및 대지 포용 방벽',
    gradient: ['#a16207', '#854d0e', '#422006'],
    spiritKeywords: 'sacred golden clay vessel, grounding crystalline portals, yellow earth plates'
  },
  metal: {
    hanja: '金',
    name: '금(金) - 수확과 결단의 백호(白虎)',
    desc: '불필요한 인연과 미련을 냉정히 정제하는 서슬 퍼런 강단으로, 부의 자석과 날카로운 결실 완성을 돕는 수호',
    color: '#f4f4f5', 
    bgClass: 'from-zinc-900/40 to-stone-900/20 border-zinc-500/30',
    glowColor: 'rgba(244, 244, 245, 0.4)',
    keyword: '사업 형통 및 재물 자석 흡입',
    gradient: ['#52525b', '#3f3f46', '#09090b'],
    spiritKeywords: 'sharp platinum silver swords, mechanical sacred gold compass, metallic lines'
  },
  water: {
    hanja: '水',
    name: '수(水) - 지혜와 유동의 현무(玄武)',
    desc: '심해의 심연 속에서 형태를 바꾸며 만류를 적시는 연수처럼, 지혜로운 통찰력과 대인 관계의 융합을 꾀하는 길상',
    color: '#3b82f6', 
    bgClass: 'from-blue-950/40 to-indigo-950/20 border-blue-500/30',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    keyword: '귀인 상봉 및 혜안 통찰 기류',
    gradient: ['#1d4ed8', '#1e40af', '#172554'],
    spiritKeywords: 'infinite deep indigo ocean, swirling liquid water vortex, cyan fluid waves'
  }
};

export const CharmCanvas: React.FC<CharmCanvasProps> = ({ onSuggestText, onChangeWish }) => {
  const { sharedState, openLucyChat, sendUnifiedMessage } = useApp();

  // Saved chest and equipped state
  const [talismanChest, setTalismanChest] = useState<SavedTalisman[]>([]);
  const [equippedCharm, setEquippedCharm] = useState<SavedTalisman | null>(null);
  const [toast, setToast] = useState<string>('');
  const [liveDataUrl, setLiveDataUrl] = useState<string>('');
  const [activeCharm, setActiveCharm] = useState<SavedTalisman | null>(null);

  // States for 1-day-1-time mechanic & forge ritual
  const [hasDrawnToday, setHasDrawnToday] = useState<boolean>(false);
  const [todayCharm, setTodayCharm] = useState<SavedTalisman | null>(null);
  const [isForging, setIsForging] = useState<boolean>(false);
  const [forgeStep, setForgeStep] = useState<number>(0);
  const [forgeMessages, setForgeMessages] = useState<string[]>([
    '천계의 태극 무늬 조율판(사주)을 해독하는 중...',
    '경면주사(Cinnabar Red) 전례묵과 황색 화첩지를 정제하는 중...',
    '부족한 오행 기맥 성질을 우주 대기에서 추출 소싱하는 중...',
    '서원자 성함과 만사여의 개운 수호 서약을 낙서 음각하는 중...'
  ]);

  const [isUpdatingFeedback, setIsUpdatingFeedback] = useState<boolean>(false);
  const compositeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync / Load Chest and check Today status
  useEffect(() => {
    loadChestAndTodayState();
  }, []);

  const loadChestAndTodayState = () => {
    try {
      const chestData = loadTalismanChest();
      setTalismanChest(chestData);

      const { equipped, todayCharm, hasDrawnToday: drawnToday } = resolveEquippedCharm(chestData);
      setEquippedCharm(equipped);
      setHasDrawnToday(drawnToday);
      setTodayCharm(todayCharm);

      if (todayCharm) {
        setActiveCharm(todayCharm);
        setLiveDataUrl(todayCharm.dataUrl);
      } else {
        setActiveCharm(null);
        setLiveDataUrl('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Profile calculations from sa-ju state helper
  const profileDetails = useMemo(() => {
    const rawName = sharedState?.userProfile?.basic?.nickname?.trim() || sharedState?.userProfile?.basic?.name?.trim();
    const bName = (rawName && rawName !== '귀하' && rawName !== '여행자') ? rawName : '제제';
    const birth = sharedState?.userProfile?.basic?.birthdate || '1996-05-15';
    const [y, m, d] = birth.split('-').map(Number);
    const validY = y || 1996;
    const validM = m || 5;
    const validD = d || 15;

    // Shift daily astronomy metrics dynamically
    const daySeed = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 100;
    
    // Five elements weighted distribution based on sa-ju numbers
    const wVal = Math.max(8, (validY + validM + daySeed) % 45);
    const fVal = Math.max(8, (validM * validD + daySeed * 2.3) % 45);
    const eVal = Math.max(8, (validD * validD + daySeed * 3.7) % 45);
    const mVal = Math.max(8, (validY * validD + daySeed * 4.1) % 45);
    const waVal = Math.max(8, (validY * validM + daySeed * 5.9) % 45);
    const total = wVal + fVal + eVal + mVal + waVal;

    const ratios = {
      wood: Math.round((wVal / total) * 100),
      fire: Math.round((fVal / total) * 100),
      earth: Math.round((eVal / total) * 100),
      metal: Math.round((mVal / total) * 100),
      water: Math.round((waVal / total) * 100),
    };

    let weakestKey = 'water' as 'wood' | 'fire' | 'earth' | 'metal' | 'water';
    let minScore = 999;
    for (const [k, v] of Object.entries(ratios)) {
      if (v < minScore) {
        minScore = v;
        weakestKey = k as 'wood' | 'fire' | 'earth' | 'metal' | 'water';
      }
    }

    return { ratios, weakestKey, bName, birth };
  }, [sharedState]);

  // Toast notifier
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Traditional Shamanic Drawing Core (진짜 부적 원리)
  const drawSacredTraditionalAmulet = (
    ctx: CanvasRenderingContext2D,
    cw: number,
    ch: number,
    element: 'wood' | 'fire' | 'earth' | 'metal' | 'water',
    name: string,
    wish: string,
    rarity: string
  ) => {
    const elementInfo = ELEMENT_DETAILS[element];

    // --- 1. Authentic Mulberry Hanji Paper & Aged Texture ---
    // Beautiful warm-gold mustard gradient as the parchment body
    const bgGrad = ctx.createLinearGradient(0, 0, 0, ch);
    bgGrad.addColorStop(0, '#f2ca52'); 
    bgGrad.addColorStop(0.3, '#ebd45b');
    bgGrad.addColorStop(0.7, '#d69e2e');
    bgGrad.addColorStop(1, '#ad751b'); // Toasted, dark ancient parchment edge
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Vignette burned shadow around the outer borders to simulate physical age
    const vigGrad = ctx.createRadialGradient(cw / 2, ch / 2, 120, cw / 2, ch / 2, ch * 0.65);
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(0.65, 'rgba(101, 62, 10, 0.12)');
    vigGrad.addColorStop(1, 'rgba(64, 38, 4, 0.44)'); // Rich roasted corners
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Seeded random texture generator for realistic paper fibers & dark flecks
    const drawMulberryFibers = () => {
      ctx.save();
      // Draw ~160 fine white silk fibers
      for (let i = 0; i < 160; i++) {
        const sx = Math.sin(i * 927) * cw * 0.5 + cw * 0.5;
        const sy = Math.cos(i * 381) * ch * 0.5 + ch * 0.5;
        const length = 12 + Math.abs(Math.sin(i)) * 25;
        const angle = i * 2.3;
        
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 252, 235, 0.45)' : 'rgba(165, 110, 30, 0.15)';
        ctx.lineWidth = 0.5 + Math.abs(Math.sin(i)) * 0.8;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(
          sx + Math.cos(angle) * length * 0.5, sy + Math.sin(angle) * length * 0.5,
          sx + Math.cos(angle + 0.5) * length * 0.8, sy + Math.sin(angle + 0.3) * length * 0.8,
          sx + Math.cos(angle + 1) * length, sy + Math.sin(angle + i) * length
        );
        ctx.stroke();
      }

      // Draw subtle dark age stains/speckles (mulberry bark chips)
      for (let j = 0; j < 45; j++) {
        const x = Math.abs(Math.sin(j * 439) * 0.8) * (cw - 120) + 60;
        const y = Math.abs(Math.cos(j * 115) * 0.9) * (ch - 120) + 60;
        const r = 0.8 + Math.abs(Math.sin(j)) * 1.5;
        ctx.fillStyle = j % 3 === 0 ? 'rgba(78, 48, 12, 0.28)' : 'rgba(92, 60, 20, 0.12)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };
    drawMulberryFibers();

    // --- 2. Cinnabar Vermilion Ink Bleed & Paint Simulator (경면주사 수묵필효과) ---
    // Deeply authentic layered stroke simulator to make all vectors look hand-painted
    const drawCinnabarBrushPath = (pathFn: () => void, baseWidth: number) => {
      // Pass 1: Semi-transparent ink bleed/oil halos diffusing into paper fibers
      ctx.save();
      ctx.strokeStyle = 'rgba(198, 20, 16, 0.22)';
      ctx.lineWidth = baseWidth * 1.6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(198, 20, 16, 0.38)';
      pathFn();
      ctx.stroke();
      ctx.restore();

      // Pass 2: Wet vermilion wash layer
      ctx.save();
      ctx.strokeStyle = '#cd201f';
      ctx.lineWidth = baseWidth * 1.1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 1;
      ctx.shadowColor = 'rgba(90, 8, 8, 0.3)';
      pathFn();
      ctx.stroke();
      ctx.restore();

      // Pass 3: Saturated cinnabar dense core stroke (slight dry brush simulation)
      ctx.save();
      ctx.strokeStyle = '#b01010';
      ctx.lineWidth = baseWidth * 0.72;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      pathFn();
      ctx.stroke();
      ctx.restore();
    };

    // --- 3. Vermilion Calligraphic Borders (경면 이중수호진) ---
    // Outer hand-painted frame
    drawCinnabarBrushPath(() => {
      ctx.beginPath();
      // Draw a slightly imperfect, hand-drawn outer rectangle
      ctx.moveTo(35, 35);
      ctx.lineTo(cw - 35, 37);
      ctx.lineTo(cw - 36, ch - 35);
      ctx.lineTo(34, ch - 36);
      ctx.closePath();
    }, 4.5);

    // Inner protective border line
    drawCinnabarBrushPath(() => {
      ctx.beginPath();
      ctx.moveTo(43, 43);
      ctx.lineTo(cw - 43, 44);
      ctx.lineTo(cw - 44, ch - 43);
      ctx.lineTo(42, ch - 44);
      ctx.closePath();
    }, 1.8);

    // Four protective corners (circular shamanic anchors)
    const corners = [
      { x: 62, y: 62 },
      { x: cw - 62, y: 62 },
      { x: 62, y: ch - 62 },
      { x: cw - 62, y: ch - 62 }
    ];
    corners.forEach((c, idx) => {
      drawCinnabarBrushPath(() => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
      }, 1.5);
    });

    // --- 4. Traditional Taoist/Shamanic Edge Guard Scripts ---
    // Corner ancient Chinese seals (萬事大吉 - Universal Auspicious Safeguards)
    ctx.save();
    ctx.fillStyle = '#b01010';
    ctx.font = 'bold 22px "Batang", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 1.2;
    ctx.shadowColor = 'rgba(176, 16, 16, 0.4)';
    ctx.fillText('萬', 62, 85);
    ctx.fillText('事', cw - 62, 85);
    ctx.fillText('大', 62, ch - 85);
    ctx.fillText('吉', cw - 62, ch - 85);
    ctx.restore();

    // --- 5. Celestial Crown (천경 삼태성 三台星) ---
    // Three celestial star circles representing cosmic alignment
    drawCinnabarBrushPath(() => {
      ctx.beginPath();
      ctx.arc(cw / 2 - 40, 100, 5, 0, Math.PI * 2);
      ctx.arc(cw / 2, 88, 6.5, 0, Math.PI * 2);
      ctx.arc(cw / 2 + 40, 100, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#b01010';
    }, 1);

    // Celestial sweeping cloud waves reflecting cosmic protection
    drawCinnabarBrushPath(() => {
      ctx.beginPath();
      ctx.moveTo(cw / 2 - 95, 128);
      ctx.quadraticCurveTo(cw / 2, 75, cw / 2 + 95, 128);
      
      ctx.moveTo(cw / 2 - 95, 128);
      ctx.quadraticCurveTo(cw / 2 - 50, 148, cw / 2, 128);
      ctx.quadraticCurveTo(cw / 2 + 50, 148, cw / 2 + 95, 128);

      // Deep protective secondary cloud tier
      ctx.moveTo(cw / 2 - 75, 150);
      ctx.quadraticCurveTo(cw / 2, 130, cw / 2 + 75, 150);
    }, 4.2);

    // --- 6. Margin Lightning & Wall Barriers (천뢰 수호 기맥) ---
    // Left side protective waves (뇌전 수호 장막)
    drawCinnabarBrushPath(() => {
      ctx.beginPath();
      ctx.moveTo(85, 180);
      ctx.lineTo(75, 235);
      ctx.bezierCurveTo(98, 260, 62, 290, 85, 320);
      ctx.lineTo(72, 385);
      ctx.bezierCurveTo(95, 410, 68, 445, 80, 480);
      ctx.quadraticCurveTo(68, 540, 78, 610);
      ctx.lineTo(82, 690);
    }, 3.3);

    // Right side protective waves
    drawCinnabarBrushPath(() => {
      ctx.beginPath();
      ctx.moveTo(cw - 85, 180);
      ctx.lineTo(cw - 75, 235);
      ctx.bezierCurveTo(cw - 98, 260, cw - 62, 290, cw - 85, 320);
      ctx.lineTo(cw - 72, 385);
      ctx.bezierCurveTo(cw - 95, 410, cw - 68, 445, cw - 80, 480);
      ctx.quadraticCurveTo(cw - 68, 540, cw - 78, 610);
      ctx.lineTo(cw - 82, 690);
    }, 3.3);

    // --- 7. Breathtaking Esoteric Shamanic Sigil For The Five Elements ---
    // Overriding computer text with massive bespoke hand-painted calligraphic structures
    ctx.save();
    
    if (element === 'wood') {
      // Wood: Tall Sacred World-Tree Sigil with upward sprouting nodes
      drawCinnabarBrushPath(() => {
        ctx.beginPath();
        // Central thick vertical spine
        ctx.moveTo(cw / 2, 210);
        ctx.lineTo(cw / 2, 530);

        // Nested triple-loop wood-node growth spiral
        ctx.moveTo(cw / 2, 290);
        ctx.bezierCurveTo(cw / 2 - 60, 240, cw / 2 - 50, 360, cw / 2, 320);
        ctx.bezierCurveTo(cw / 2 + 60, 270, cw / 2 + 50, 390, cw / 2, 350);

        // Branching leaves and sweeping branches shooting high and right
        ctx.moveTo(cw / 2, 250);
        ctx.bezierCurveTo(cw / 2 - 110, 200, cw / 2 - 90, 410, cw / 2 - 120, 395);
        ctx.moveTo(cw / 2, 250);
        ctx.bezierCurveTo(cw / 2 + 110, 200, cw / 2 + 90, 410, cw / 2 + 120, 395);

        // Swelling roots at base curling up
        ctx.moveTo(cw / 2, 450);
        ctx.quadraticCurveTo(cw / 2 - 100, 440, cw / 2 - 80, 500);
        ctx.quadraticCurveTo(cw / 2 - 50, 520, cw / 2, 480);
        ctx.moveTo(cw / 2, 450);
        ctx.quadraticCurveTo(cw / 2 + 100, 440, cw / 2 + 80, 500);
        ctx.quadraticCurveTo(cw / 2 + 50, 520, cw / 2, 480);
        
        // Twin shooting arrows pointing skyward
        ctx.moveTo(cw / 2 - 50, 260);
        ctx.lineTo(cw / 2, 210);
        ctx.lineTo(cw / 2 + 50, 260);
      }, 7.5);

      // Deep artistic background hanja core (translucent charcoal wash)
      ctx.fillStyle = 'rgba(28, 25, 23, 0.16)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 150px "Batang", serif';
      ctx.fillText(elementInfo.hanja, cw / 2, 350);

    } else if (element === 'fire') {
      // Fire: Blazing Solar Phoenix Wings & Sacred Fire Trident
      drawCinnabarBrushPath(() => {
        ctx.beginPath();
        // Central flame tongue trident rising
        ctx.moveTo(cw / 2, 195);
        ctx.bezierCurveTo(cw / 2 - 25, 290, cw / 2 - 40, 260, cw / 2, 330);
        ctx.bezierCurveTo(cw / 2 + 40, 260, cw / 2 + 25, 290, cw / 2, 195);

        // Left wing curves (mystic loops resembling majestic phoenix wings)
        ctx.moveTo(cw / 2, 310);
        ctx.bezierCurveTo(cw / 2 - 140, 220, cw / 2 - 150, 390, cw / 2 - 40, 380);
        ctx.bezierCurveTo(cw / 2 - 130, 400, cw / 2 - 110, 480, cw / 2, 440);

        // Right wing curves
        ctx.moveTo(cw / 2, 310);
        ctx.bezierCurveTo(cw / 2 + 140, 220, cw / 2 + 150, 390, cw / 2 + 40, 380);
        ctx.bezierCurveTo(cw / 2 + 130, 400, cw / 2 + 110, 480, cw / 2, 440);

        // Triple cascading fire tail flares running down
        ctx.moveTo(cw / 2, 440);
        ctx.quadraticCurveTo(cw / 2 - 45, 500, cw / 2 - 35, 545);
        ctx.moveTo(cw / 2, 440);
        ctx.lineTo(cw / 2, 560);
        ctx.moveTo(cw / 2, 440);
        ctx.quadraticCurveTo(cw / 2 + 45, 500, cw / 2 + 35, 545);
      }, 7);

      // Draw five floating star embers (spirit ignition centers)
      drawCinnabarBrushPath(() => {
        ctx.beginPath();
        ctx.arc(cw / 2 - 100, 290, 5, 0, Math.PI * 2);
        ctx.arc(cw / 2 + 100, 290, 5, 0, Math.PI * 2);
        ctx.arc(cw / 2 - 90, 420, 4, 0, Math.PI * 2);
        ctx.arc(cw / 2 + 90, 420, 4, 0, Math.PI * 2);
        ctx.arc(cw / 2, 510, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#b01010';
        ctx.fill();
      }, 1);

      // Translucent wash logo
      ctx.fillStyle = 'rgba(28, 25, 23, 0.16)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 150px "Batang", serif';
      ctx.fillText(elementInfo.hanja, cw / 2, 350);

    } else if (element === 'earth') {
      // Earth: Concentric Unbreakable Mountain Slabs & Divine Turtle Fortress
      drawCinnabarBrushPath(() => {
        ctx.beginPath();
        // Sturdy square border lock around target center
        ctx.rect(cw / 2 - 80, 230, 160, 160);

        // Outer fortress diamond shield
        ctx.moveTo(cw / 2, 195);
        ctx.lineTo(cw / 2 + 115, 310);
        ctx.lineTo(cw / 2, 425);
        ctx.lineTo(cw / 2 - 115, 310);
        ctx.closePath();
      }, 4);

      drawCinnabarBrushPath(() => {
        ctx.beginPath();
        // Central grounded core element glyph
        ctx.moveTo(cw / 2 - 70, 310);
        ctx.lineTo(cw / 2 + 70, 310); // Center bar

        // Heavy, thick foundation plate curls at the base (지권대평야)
        ctx.moveTo(cw / 2 - 95, 385);
        ctx.bezierCurveTo(cw / 2 - 110, 450, cw / 2 - 10, 430, cw / 2, 400);
        ctx.bezierCurveTo(cw / 2 + 10, 430, cw / 2 + 110, 450, cw / 2 + 95, 385);

        // Center solid vertical axis
        ctx.moveTo(cw / 2, 210);
        ctx.lineTo(cw / 2, 460);

        // Massive stable double loops underneath the foundation
        ctx.moveTo(cw / 2 - 40, 460);
        ctx.quadraticCurveTo(cw / 2 - 80, 520, cw / 2, 530);
        ctx.quadraticCurveTo(cw / 2 + 80, 520, cw / 2 + 40, 460);
      }, 7.5);

      // Translucent background wash
      ctx.fillStyle = 'rgba(28, 25, 23, 0.16)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 150px "Batang", serif';
      ctx.fillText(elementInfo.hanja, cw / 2, 310);

    } else if (element === 'metal') {
      // Metal: Double Piercing Sword Blades & Angular Sacred Decagram
      drawCinnabarBrushPath(() => {
        ctx.beginPath();
        // Top mountain peak caps
        ctx.moveTo(cw / 2 - 90, 240);
        ctx.lineTo(cw / 2, 195);
        ctx.lineTo(cw / 2 + 90, 240);
        
        // Twin geometric sword blades pointing straight down
        ctx.moveTo(cw / 2 - 25, 220);
        ctx.lineTo(cw / 2 - 25, 480);
        ctx.lineTo(cw / 2, 525);
        ctx.lineTo(cw / 2 + 25, 480);
        ctx.lineTo(cw / 2 + 25, 220);

        // Cutting horizontal guard bar
        ctx.moveTo(cw / 2 - 85, 305);
        ctx.lineTo(cw / 2 + 85, 305);
      }, 7.5);

      drawCinnabarBrushPath(() => {
        ctx.beginPath();
        // Left geometric shield chevrons pointing in
        ctx.moveTo(cw / 2 - 110, 260);
        ctx.lineTo(cw / 2 - 80, 310);
        ctx.lineTo(cw / 2 - 110, 360);

        ctx.moveTo(cw / 2 - 120, 380);
        ctx.lineTo(cw / 2 - 90, 430);
        ctx.lineTo(cw / 2 - 120, 480);

        // Right geometric shield chevrons
        ctx.moveTo(cw / 2 + 110, 260);
        ctx.lineTo(cw / 2 + 80, 310);
        ctx.lineTo(cw / 2 + 110, 360);

        ctx.moveTo(cw / 2 + 120, 380);
        ctx.lineTo(cw / 2 + 90, 430);
        ctx.lineTo(cw / 2 + 120, 480);
        
        // High diamond lock at the bottom
        ctx.moveTo(cw / 2 - 35, 525);
        ctx.lineTo(cw / 2, 565);
        ctx.lineTo(cw / 2 + 35, 525);
      }, 3.8);

      // Translucent background wash
      ctx.fillStyle = 'rgba(28, 25, 23, 0.16)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 150px "Batang", serif';
      ctx.fillText(elementInfo.hanja, cw / 2, 350);

    } else if (element === 'water') {
      // Water: Swirling Ocean Waves, Liquid Spirals & Cascading waterfall ribbons
      drawCinnabarBrushPath(() => {
        ctx.beginPath();
        // Massive majestic cosmic Tai Chi double vortex spiral in center
        ctx.arc(cw / 2, 335, 75, 0, Math.PI * 2);
      }, 1.5);

      drawCinnabarBrushPath(() => {
        ctx.beginPath();
        // Inner swirl paths
        for (let i = 0; i < 40; i++) {
          const angle = 0.22 * i;
          const r = 3 + 2.1 * i;
          const x = cw / 2 + r * Math.cos(angle);
          const y = 335 + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Left wavy water ribbon flowing downwards
        ctx.moveTo(cw / 2 - 60, 380);
        ctx.bezierCurveTo(cw / 2 - 120, 420, cw / 2 - 40, 480, cw / 2 - 80, 540);

        // Right wavy water ribbon
        ctx.moveTo(cw / 2 + 60, 380);
        ctx.bezierCurveTo(cw / 2 + 120, 420, cw / 2 + 40, 480, cw / 2 + 80, 540);

        // Center ocean tide crest
        ctx.moveTo(cw / 2 - 120, 230);
        ctx.bezierCurveTo(cw / 2 - 60, 190, cw / 2 + 60, 270, cw / 2 + 120, 230);
      }, 6);

      // Droplet star indicators
      drawCinnabarBrushPath(() => {
        ctx.beginPath();
        ctx.arc(cw / 2 - 75, 430, 4.5, 0, Math.PI * 2);
        ctx.arc(cw / 2 + 75, 430, 4.5, 0, Math.PI * 2);
        ctx.arc(cw / 2 - 90, 500, 4, 0, Math.PI * 2);
        ctx.arc(cw / 2 + 90, 500, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#b01010';
        ctx.fill();
      }, 1);

      // Translucent background wash
      ctx.fillStyle = 'rgba(28, 25, 23, 0.16)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 150px "Batang", serif';
      ctx.fillText(elementInfo.hanja, cw / 2, 335);
    }

    ctx.restore();

    // --- 8. Bottom Protective Lock Loops (가복태평 장수수호매듭) ---
    // Anchoring traditional knot at the bottom base
    drawCinnabarBrushPath(() => {
      ctx.beginPath();
      ctx.moveTo(cw / 2 - 65, ch - 225);
      ctx.bezierCurveTo(cw / 2 - 135, ch - 280, cw / 2 + 135, ch - 280, cw / 2 + 65, ch - 225);
      ctx.bezierCurveTo(cw / 2 - 40, ch - 175, cw / 2 + 40, ch - 175, cw / 2 - 65, ch - 225);
    }, 4.5);

    // Sacred long dispersion tails flowing downwards
    drawCinnabarBrushPath(() => {
      ctx.beginPath();
      ctx.moveTo(cw / 2, ch - 198);
      ctx.lineTo(cw / 2, ch - 120);

      // Left flowing wave tail
      ctx.moveTo(cw / 2, ch - 120);
      ctx.quadraticCurveTo(cw / 2 - 30, ch - 100, cw / 2 - 25, ch - 72);

      // Right flowing wave tail
      ctx.moveTo(cw / 2, ch - 120);
      ctx.quadraticCurveTo(cw / 2 + 30, ch - 100, cw / 2 + 25, ch - 72);

      // Center direct tail
      ctx.moveTo(cw / 2, ch - 120);
      ctx.lineTo(cw / 2, ch - 65);
    }, 3.8);

    // --- 9. Distressed Traditional Red Stone Stamp (전통 목도락 고도낙인) ---
    // Draws an authentic weathered red stamp using miniature eraser-lines for distressed woodcarving look
    const drawDistressedStamp = (sx: number, sy: number) => {
      ctx.save();
      
      // Temporary stamp drawer
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3.8;
      ctx.strokeRect(sx, sy, 55, 55);
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 4, sy + 4, 47, 47);

      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 15px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('萬', sx + 17, sy + 18);
      ctx.fillText('事', sx + 39, sy + 18);
      ctx.fillText('大', sx + 17, sy + 38);
      ctx.fillText('吉', sx + 39, sy + 38);

      // Distress process: Overlay random micro-lines of Hanji background color to simulate ancient worn ink stamp texture
      ctx.strokeStyle = '#ebd45b'; // Matches local parchment color
      ctx.lineWidth = 0.8;
      
      for (let s = 0; s < 18; s++) {
        const dOffset = Math.sin(s * 821) * 20;
        ctx.beginPath();
        // Horizontal distressed cuts
        ctx.moveTo(sx - 5, sy + 4 + (s * 3));
        ctx.lineTo(sx + 60, sy + 4 + (s * 3) + dOffset * 0.15);
        ctx.stroke();
      }

      ctx.restore();
    };
    drawDistressedStamp(cw - 145, ch - 175);

    // --- 10. Protective Metadata Labels in elegant hand-written serif fonts ---
    ctx.save();
    ctx.textAlign = 'center';
    
    // Title Banner
    ctx.fillStyle = 'rgba(28, 25, 23, 0.78)';
    ctx.font = 'bold 14px "Batang", serif';
    ctx.fillText(`[ ${name || '귀하'} 님 오행사주 평생보양 가호천서 ]`, cw / 2, 175);

    // Dynamic Poetic Wish
    ctx.fillStyle = '#7f1d1d'; // Crimson prose
    ctx.font = 'italic bold 21px "Batang", serif';
    const wrappedWish = `“ ${wish} ”`;
    if (wrappedWish.length > 20) {
      const splitIdx = Math.floor(wrappedWish.length / 2);
      ctx.fillText(wrappedWish.substring(0, splitIdx + 1), cw / 2, ch - 290);
      ctx.fillText(wrappedWish.substring(splitIdx + 1), cw / 2, ch - 255);
    } else {
      ctx.fillText(wrappedWish, cw / 2, ch - 275);
    }

    // Custom Saju Grade Authentications & Timestamping at footer
    ctx.fillStyle = 'rgba(28, 25, 23, 0.44)';
    ctx.font = 'bold 11px "Batang", serif';
    const dateFormatted = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
    ctx.fillText(`오행기맥 조율 등급: ${rarity.toUpperCase()} 대괘 • ${dateFormatted} 발행`, cw / 2, ch - 48);
    ctx.restore();
  };

  // Perform Forge Ritual & Trigger Generation
  const handleStartForgeRitual = () => {
    if (isForging || hasDrawnToday) return;

    setIsForging(true);
    setForgeStep(0);

    // Sequence progress messages to represent mysterious calculation ritual
    const interval = setInterval(() => {
      setForgeStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          performDynamicGeneration();
          return 3;
        }
        return prev + 1;
      });
    }, 900);
  };

  // Heavy dynamic generator creating and storing final talisman
  const performDynamicGeneration = () => {
    const canvas = compositeCanvasRef.current;
    if (!canvas) {
      setIsForging(false);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsForging(false);
      return;
    }

    const cw = 600;
    const ch = 900;
    canvas.width = cw;
    canvas.height = ch;

    const keyElement = profileDetails.weakestKey;
    const keyInfo = ELEMENT_DETAILS[keyElement];
    const userName = profileDetails.bName;

    // Automatic poetic wish selection per Saju lacking elements
    let actualWish = '대길만사 형통운 가호';
    if (keyElement === 'wood') {
      actualWish = '목덕욱일 기맥생동 귀인점지';
    } else if (keyElement === 'fire') {
      actualWish = '주작찬란 무궁화화 직관영감';
    } else if (keyElement === 'earth') {
      actualWish = '대지포용 만대태평 신우호위';
    } else if (keyElement === 'metal') {
      actualWish = '백호단단 쾌결귀결 대명재수';
    } else if (keyElement === 'water') {
      actualWish = '현무심연 혜안통찰 만류귀종';
    }

    // Elements active effect description based on grade weight
    const luckDeterminant = Math.random();
    const rarity = luckDeterminant > 0.65 ? 'Legendary' : 'Rare';
    const buffText = rarity === 'Legendary' 
      ? `천명 개운 원력과 공명 동조 (오행 수호 오차율 0.00% / 일일 행운 보정 +150% 부가)`
      : `정량 조율 보양 기맥 활성 (오행 균형 복구율 +120% / 일상 방어막 동작)`;

    // Drawing call
    drawSacredTraditionalAmulet(ctx, cw, ch, keyElement, userName, actualWish, rarity);

    const dataUrl = canvas.toDataURL('image/png');
    setLiveDataUrl(dataUrl);

    // Save Object Creation
    const resultCharm: SavedTalisman = {
      id: `charm_${Date.now()}`,
      name: userName,
      wishText: actualWish,
      element: keyElement,
      styleName: '전통 경면주사 주조원화 (Cinnabar Shamanic Brush)',
      rarity,
      buffText,
      dataUrl,
      timestamp: Date.now()
    };

    setActiveCharm(resultCharm);
    setTodayCharm(resultCharm);

    // Prepend to current list
    const updatedChest = [resultCharm, ...talismanChest];
    setTalismanChest(updatedChest);

    try {
      localStorage.setItem(PRISM_TALISMAN_CHEST_KEY, JSON.stringify(updatedChest));

      persistEquippedCharm(resultCharm);
      setEquippedCharm(resultCharm);
      notifyCharmChanged();
    } catch (e) {
      console.error(e);
    }

    // Settle forge loading
    setTimeout(() => {
      setIsForging(false);
      setHasDrawnToday(true);
      playAudioHaptic('card_draw');
      setTimeout(() => playAudioHaptic('save_success', { volume: 0.9 }), 180);
      triggerToast(`🎨 오늘의 고품격 [${rarity === 'Legendary' ? '레전더리' : '레어'} 천명 부적]이 안전하게 조율 주조되었습니다!`);
    }, 300);
  };

  // Helper labels
  const activeRarityLabel = (rarity: string) => {
    return rarity === 'Legendary' ? '레전더리 괘' : '레어 괘';
  };

  // Equip alignment element buff
  const equipTalismanBuff = () => {
    if (!activeCharm || !isCharmFromToday(activeCharm)) return;
    setEquippedCharm(activeCharm);
    try {
      persistEquippedCharm(activeCharm);
      notifyCharmChanged();
    } catch (e) {
      console.error(e);
    }
    playAudioHaptic('save_success');
    triggerToast(`⚡ ${ELEMENT_DETAILS[activeCharm.element].name} 만사대길 보양 버프가 마취 장착되었습니다!`);
  };

  // Dismantle equipped buff
  const removeEquippedBuff = () => {
    setEquippedCharm(null);
    try {
      persistEquippedCharm(null);
      notifyCharmChanged();
    } catch (e) {
      console.error(e);
    }
    triggerToast('장착된 전통 오행 수호 버프가 해제되었습니다.');
  };

  // Trigger high quality secure download
  const downloadCharmImage = () => {
    if (!activeCharm) return;
    const link = document.createElement('a');
    link.download = `PRISM_SACRED_CHARM_${activeCharm.element}_${activeCharm.rarity}_${Date.now()}.png`;
    link.href = activeCharm.dataUrl;
    link.click();
    playAudioHaptic('save_success');
    triggerToast('스마트폰 락스크리 전용 최고화질 부적 원화가 기기에 안전하게 복사 저장되었습니다.');
  };

  // Share message
  const copySharableCharmLink = () => {
    if (!activeCharm) return;
    const textToCopy = `🔮 [프리즘 오늘의 운명 대길 부적]\n\n👤 서원자: ${activeCharm.name} 님\n🍀 사주처방: "${activeCharm.wishText}"\n⚡ 오행기맥소: ${ELEMENT_DETAILS[activeCharm.element].name.split(' - ')[0]}\n✨ 동조가복: ${activeCharm.buffText}\n\n오늘 나의 부족한 사주 기류를 방어하는 경면주사 부적을 확인하세요!`;
    navigator.clipboard.writeText(textToCopy);
    triggerToast('오늘의 부적 오행 명세가 클립보드에 완진 복사되어 전송 준비되었습니다.');
  };

  return (
    <div className="space-y-6 sm:space-y-10 w-full max-w-5xl mx-auto min-w-0">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-gradient-to-r from-orange-600 to-amber-500 border border-orange-400 text-white font-black text-xs px-6 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle size={15} className="animate-bounce text-emerald-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={compositeCanvasRef} style={{ display: 'none' }} />

      {/* Forging Ceremony Loading Modal */}
      <AnimatePresence>
        {isForging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[500] flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-md w-full text-center space-y-8">
              {/* Spinning Sacred Yin-Yang / Compass Representation */}
              <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-dashed border-orange-500/20 rounded-full animate-spin" style={{ animationDuration: '25s' }} />
                <div className="absolute inset-2 border-2 border-dashed border-orange-500/40 rounded-full animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} />
                
                {/* Traditional Central Circle Icon */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-yellow-500 border border-yellow-400 shadow-[0_0_25px_rgba(239,68,68,0.5)] flex items-center justify-center"
                >
                  <Compass size={28} className="text-white animate-pulse" />
                </motion.div>
              </div>

              <div className="space-y-4">
                <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] font-mono block animate-pulse">
                  Spiritual Aura Synthesis ...
                </span>
                <h4 className="text-2xl font-black text-white tracking-tight">수성 오행 대길 부적 공명 중</h4>
                
                {/* Rolling description statements mimicking deep computational astrology */}
                <div className="h-10 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={forgeStep}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="text-zinc-400 text-xs font-medium leading-relaxed max-w-xs"
                    >
                      {forgeMessages[forgeStep]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress dots bar */}
              <div className="flex justify-center gap-1.5">
                {[0, 1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`h-2 rounded-full transition-all duration-300 ${step <= forgeStep ? 'w-6 bg-orange-500' : 'w-2 bg-zinc-800'}`} 
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Equipped Buff Notification */}
      {equippedCharm && isCharmFromToday(equippedCharm) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 sm:p-5 rounded-[20px] sm:rounded-[28px] border border-orange-500/25 bg-orange-950/15 relative overflow-hidden backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
        >
          <div 
            className="absolute right-0 top-0 w-32 h-32 blur-3xl opacity-20 rounded-full pointer-events-none"
            style={{ backgroundColor: ELEMENT_DETAILS[equippedCharm.element].color }}
          />

          <div className="flex items-center gap-4 min-w-0">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-inner font-serif shrink-0 border"
              style={{ 
                borderColor: `${ELEMENT_DETAILS[equippedCharm.element].color}40`,
                backgroundColor: `${ELEMENT_DETAILS[equippedCharm.element].color}15`,
                textShadow: `0 0 8px ${ELEMENT_DETAILS[equippedCharm.element].color}`
              }}
            >
              {ELEMENT_DETAILS[equippedCharm.element].hanja}
            </div>
            <div className="min-w-0 space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 flex items-center gap-1">
                <Sparkles size={11} className="animate-spin text-yellow-400" style={{ animationDuration: '6s' }} />
                <span>오늘의 가상 보양 동결 활성화 중</span>
              </span>
              <h5 className="text-xs font-black text-white break-words">
                {equippedCharm.name} 님의 처방: <span className="text-orange-200">“{equippedCharm.wishText}” (개운부)</span>
              </h5>
              <p className="text-[10px] text-white/50 leading-relaxed font-sans break-words">
                {equippedCharm.buffText}
              </p>
            </div>
          </div>

          <button
            onClick={removeEquippedBuff}
            className="px-4 py-2 bg-red-950/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-xl text-[10px] font-bold transition-all shrink-0 self-start md:self-auto cursor-pointer"
          >
            장착 버프 해제
          </button>
        </motion.div>
      )}

      {/* Main Split Interface - Static saju review LEFT / Talisman mockup RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 text-left bg-zinc-950/40 border border-white/5 rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 lg:p-8 relative">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-orange-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

        {/* LEFT WORKSHOP CONTROLS: 7 cols */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1.5 animate-fade-in">
              <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] px-2.5 py-1 rounded-md inline-block max-w-full break-words leading-snug">
                사주오행 1일 1회 천괘 연성소 (Sacred Daily Oracle)
              </span>
              <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight break-words">
                {hasDrawnToday ? '오늘의 천명 가호 부적 완료' : '오늘의 천명 가호 부적 주조'}
              </h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                귀하의 운명 주기 사주팔자와 오늘의 우주적 매칭 지수를 정밀 해석하여, **하루 동안 침입하는 해로운 파동을 필터링하고 행운을 보강해 내는 고유의 경면주사 전통 부적**입니다. 선택의 비효율 없이 인체 기류를 보양해 줍니다.
              </p>
            </div>

            <hr className="border-white/5" />

            {/* User credentials analysis display (Saju HUD) */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4 font-sans min-w-0">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 block">
                나의 오행 주파수 감도 (My Sa-ju Elements Balance)
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-zinc-400 text-[11px] block">서원 수양인 성상</span>
                  <p className="text-white font-bold text-sm">
                    {profileDetails.bName} 님 <span className="text-zinc-500 text-xs">({profileDetails.birth} 생)</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-400 text-[11px] block">오늘 가장 취약한 기맥</span>
                  <p className="text-red-400 font-extrabold text-sm flex items-start gap-1.5 min-w-0">
                    <span 
                      className="inline-flex w-5 h-5 rounded-md items-center justify-center font-bold text-xs shrink-0"
                      style={{ 
                        color: ELEMENT_DETAILS[profileDetails.weakestKey].color,
                        backgroundColor: `${ELEMENT_DETAILS[profileDetails.weakestKey].color}15`
                      }}
                    >
                      {ELEMENT_DETAILS[profileDetails.weakestKey].hanja}
                    </span>
                    <span className="break-words min-w-0">{ELEMENT_DETAILS[profileDetails.weakestKey].name.split(' - ')[1]}</span>
                  </p>
                </div>
              </div>

              {/* Graphical bars depicting five elements ratios */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-zinc-500 font-bold block">기류 기맥 함유율 (%)</span>
                <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center text-[8px] sm:text-[10px] font-mono min-w-0">
                  {Object.entries(ELEMENT_DETAILS).map(([k, info]) => {
                    const isWeak = profileDetails.weakestKey === k;
                    const val = profileDetails.ratios[k] || 20;
                    return (
                      <div key={k} className="space-y-1 min-w-0">
                        <div className="h-10 sm:h-14 bg-black/40 rounded-lg relative overflow-hidden flex items-end">
                          <div 
                            className="w-full rounded-b-md transition-all duration-1000"
                            style={{ 
                              height: `${val}%`,
                              backgroundColor: info.color,
                              opacity: isWeak ? 0.9 : 0.4
                            }}
                          />
                          {isWeak && (
                            <span className="absolute top-1 left-1 flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                            </span>
                          )}
                        </div>
                        <span className="font-bold font-serif leading-tight block" style={{ color: isWeak ? '#ef4444' : info.color }}>
                          <span className="block">{info.hanja}</span>
                          <span className="block opacity-80">({val}%)</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Restricting or Call to action button based on check state */}
          <div className="pt-4 sm:pt-6">
            {hasDrawnToday && todayCharm ? (
              <div className="p-5 rounded-2xl bg-orange-950/20 border border-orange-500/20 text-left space-y-3">
                <h5 className="text-orange-400 font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>오늘의 개운 기맥 조율 완료</span>
                </h5>
                <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                  조율인 {profileDetails.bName} 님의 금일 사적 기맥 오차율을 완치 교정하여 **{ELEMENT_DETAILS[todayCharm.element].name.split(' - ')[0]}** 가호의 신패가 이미 영험하게 발행되었습니다. 다음 부적 주조성은 자정에 다시 성사 개방됩니다.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono">
                  발행시간: {new Date(todayCharm.timestamp).toLocaleTimeString('ko-KR')}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleStartForgeRitual}
                  className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xl transition-all hover:scale-[1.01] active:scale-95 cursor-pointer text-center leading-snug"
                >
                  <Sparkles size={16} className="animate-pulse shrink-0" />
                  <span className="sm:hidden">✦ 오늘의 천명 부적 연성 ✦</span>
                  <span className="hidden sm:inline">✦ 사주 처방 오늘의 천명 부적 연성 비법 개시 ✦</span>
                </button>
                <p className="text-[10px] text-zinc-500 text-center font-sans">
                  ※ 1일 1회만 연성 및 소장이 가능합니다. 연성된 부적은 무릉화첩과 장착 버프로 영구 소장됩니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PREVIEW & UTILITY ACTIONS: 5 cols */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start gap-4 sm:gap-6 lg:justify-between bg-black/40 border border-white/5 p-4 sm:p-6 rounded-[20px] sm:rounded-[28px] relative min-h-0 lg:min-h-[500px] w-full min-w-0">
          <div className="absolute inset-0 bg-radial from-transparent to-black pointer-events-none" />

          {/* Title Header of Preview */}
          <div className="w-full text-center space-y-1 relative z-10">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500 block">Sacred Seal Result</span>
            <h5 className="text-[10px] sm:text-xs font-black text-white flex items-center justify-center gap-1 px-1 leading-snug">
              <Sparkles size={11} className={`text-yellow-400 shrink-0 ${isUpdatingFeedback ? 'animate-spin' : ''}`} />
              <span className="break-words">전통 경면주사(鏡面朱砂) 천명부 대결</span>
            </h5>
          </div>

          {/* Smartphone Frame Mimic with real-time updating image */}
          <div className="my-3 sm:my-6 relative z-10 flex flex-col items-center w-full">
            <div className={`relative w-full max-w-[min(220px,72vw)] sm:max-w-[240px] aspect-[2/3] rounded-[20px] sm:rounded-[24px] overflow-hidden border-[3px] sm:border-4 border-zinc-800 shadow-2xl bg-zinc-950 transition-all duration-300 ${isUpdatingFeedback ? 'scale-[0.98] ring-2 ring-orange-500/25' : ''}`}>
              {liveDataUrl ? (
                <img 
                  src={liveDataUrl} 
                   alt="Traditional Korean Talisman Sacred Graphic representation" 
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 p-6 text-center text-xs space-y-3">
                  <Compass size={28} className="text-zinc-600" />
                  <span className="font-serif">오늘의 천명 개운 연성 비법을 개시하여 부적을 주조하십시오</span>
                </div>
              )}
              {/* Soft overlay glossy filter */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>
            <span className="text-[9px] font-serif text-zinc-500 mt-2">전통 무릉 화첩지 천괘 소장 인쇄</span>
          </div>

          {/* Action buttons inside mock controller */}
          <div className="w-full space-y-2 relative z-10 pt-2 border-t border-white/5">
            <div className="flex flex-col gap-2">
              <button
                onClick={equipTalismanBuff}
                disabled={!activeCharm}
                className="w-full py-3 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-orange-950/20 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed text-center leading-snug"
              >
                <Zap size={11} className="animate-pulse shrink-0" />
                <span className="sm:hidden">보양 버프 장착</span>
                <span className="hidden sm:inline">오늘의 가상 보양 버프 장착</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                onClick={downloadCharmImage}
                disabled={!activeCharm}
                className="py-2.5 px-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-[9px] sm:text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed text-center leading-tight"
              >
                <Download size={10} className="shrink-0" />
                <span>이미지 저장</span>
              </button>

              <button
                onClick={copySharableCharmLink}
                disabled={!activeCharm}
                className="py-2.5 px-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-[9px] sm:text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed text-center leading-tight"
              >
                <Share2 size={10} className="text-orange-400 shrink-0" />
                <span>링크 복사</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!activeCharm) return;
                const elemName = ELEMENT_DETAILS[activeCharm.element]?.name || '오행 수호 부적';
                void sendCharmCanvasToLucy(activeCharm, elemName, openLucyChat, sendUnifiedMessage);
              }}
              disabled={!activeCharm}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/25 to-orange-500/25 hover:from-amber-500/35 hover:to-orange-500/35 border border-amber-400/40 text-amber-200 font-bold text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles size={12} className="text-amber-400" />
              <span>부적 연계 루시와 심층 상담하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
