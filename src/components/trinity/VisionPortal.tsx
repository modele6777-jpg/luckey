import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, Loader2, X, Zap, Shuffle, Eye, Camera, Activity, Shield, Disc, Binary } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { invokeLLM, PERSONAS } from '@/lib/ai';
import { VISION_DECKS } from '@/lib/trinity/utils';

interface VisionPortalProps {
  onBack: () => void;
  onResult: (res: any) => void;
  deckId: string;
  onDeckChange: (id: string) => void;
  concern: string;
  lucyMemory?: string;
  sajuData?: string;
  astroData?: string;
  examples?: string[];
  userPreferences?: string;
  hasQuotaError?: boolean;
}

// Sub-component for the background atmosphere
const CosmicAtmosphere = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#1a122e]/40 via-transparent to-[#0a0515] opacity-80" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(200,169,110,0.05),transparent_70%)]" />
    
    {/* Soul Particles */}
    {Array.from({ length: 30 }).map((_, i) => (
      <motion.div 
        key={`p-${i}`}
        animate={{ 
          opacity: [0.05, 0.2, 0.05],
          scale: [1, 1.5, 1],
          y: [0, -100, 0],
          x: [0, Math.random() * 50 - 25, 0]
        }}
        transition={{ 
          duration: 10 + Math.random() * 20, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
        style={{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
        }}
      />
    ))}
  </div>
);

// Central Mystic Core
const MysticCore = ({ active }: { active: boolean }) => (
  <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-12 flex items-center justify-center">
    <motion.div 
      animate={{ 
        rotate: 360,
        scale: active ? [0.95, 1.05, 0.95] : 1
      }}
      transition={{ 
        rotate: { duration: 60, repeat: Infinity, ease: "linear" },
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
      className="absolute inset-0 rounded-full border border-white/5 shadow-[0_0_80px_rgba(255,255,255,0.02)]"
    />
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute inset-8 rounded-full border border-[#c8a96e]/10 border-dashed"
    />
    <div className="absolute inset-20 rounded-full bg-gradient-to-br from-[#c8a96e]/20 to-transparent blur-3xl opacity-30" />
    
    <div className="relative z-10 flex flex-col items-center">
      <motion.div
        animate={active ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border border-[#c8a96e]/40 flex items-center justify-center shadow-[0_0_20px_rgba(200,169,110,0.3)]"
      >
        <Eye size={32} className="text-[#c8a96e]" />
      </motion.div>
      <div className="mt-4 flex flex-col items-center">
        <span className="text-[8px] text-[#c8a96e] font-mono tracking-[0.5em] uppercase">Prophetic Core</span>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              className="w-1 h-3 bg-[#c8a96e]/40 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export function VisionPortal({ 
  onBack, onResult, deckId, onDeckChange, concern, 
  lucyMemory, sajuData, astroData, examples, 
  userPreferences, hasQuotaError 
}: VisionPortalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [localConcern, setLocalConcern] = useState(concern || '');
  const [step, setStep] = useState<'CONCERN' | 'SPREAD' | 'DECK_SELECT' | 'SCAN'>('CONCERN');
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [recommendedSpreads, setRecommendedSpreads] = useState<any[]>([]);
  const [activeDeckId, setActiveDeckId] = useState(deckId);

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const deckInfo = useMemo(() => VISION_DECKS.find((d: any) => d.id === activeDeckId), [activeDeckId]);
  const combinedExamples = useMemo(() => {
    const personalized = examples || [];
    const generic = deckInfo?.examples || [];
    return [...personalized, ...generic].slice(0, 10);
  }, [examples, deckInfo]);

  const fetchSpreadRecommendations = async () => {
    setStep('SPREAD');
    setIsRecommending(true);
    try {
      const resText = await invokeLLM({
        messages: [
          { role: 'system', content: PERSONAS.lucyVisionSpread(localConcern) },
          { role: 'user', content: '배열법을 추천해줘' },
        ],
        responseFormat: { type: 'json_object' },
      });
      
      const data = JSON.parse(resText || '{}');
      setRecommendedSpreads(data.spreads || [
        { name: "3카드 배열", cardCount: 3, reason: "상태의 흐름을 파악하기 가장 기초적인 배열입니다.", positions: ["과거/원인", "현재/상태", "미래/결과"], recommendedDeckId: "CAT", deckReason: "고양이의 직관으로 상태의 미묘한 변화를 읽기에 좋습니다." },
      ]);
    } catch (err) {
      console.error("Spread Recommendation Error:", err);
      setRecommendedSpreads([
        { name: "3카드 배열", cardCount: 3, reason: "상태의 흐름을 파악하기 가장 기초적인 배열입니다.", positions: ["과거/원인", "현재/상태", "미래/결과"], recommendedDeckId: "CAT", deckReason: "고양이의 직관으로 상태의 미묘한 변화를 읽기에 좋습니다." },
      ]);
    } finally {
      setIsRecommending(false);
    }
  };

  const selectSpreadAndDeck = (spread: any) => {
    onDeckChange(spread.recommendedDeckId);
    setActiveDeckId(spread.recommendedDeckId);
    setUploadedPreview(null);
    setScanMode('camera');
    setError(null);
    setStep('SCAN');
  };

  const selectDeckManual = (id: string) => {
    onDeckChange(id);
    setActiveDeckId(id);
    setUploadedPreview(null);
    setScanMode('camera');
    setError(null);
    setStep('SCAN');
  };

  useEffect(() => {
    if (step !== 'SCAN' || scanMode !== 'camera') {
      stopCameraStream();
      return;
    }

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('이 브라우저에서는 카메라 기능을 지원하지 않습니다.');
        return;
      }
      try {
        setError(null);
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch {
        setError('카메라 접근 권한이 거부되었거나 사용 중이라 사용할 수 없습니다.');
      }
    };

    startCamera();
    return () => stopCameraStream();
  }, [step, scanMode]);

  const processImage = async (dataUrl: string) => {
    setIsCapturing(true);
    try {
      const systemPrompt = PERSONAS.lucyVisionImage(
          deckInfo?.name || '',
          deckInfo?.desc || '',
          deckInfo?.detail || '',
          deckInfo?.best || '',
          sajuData || '',
          astroData || '',
          lucyMemory || '',
          userPreferences || '',
          localConcern
        );
        
        // Parallel AI calls to reduce overall latency
        
        // Task 1: Identify cards (structural data)
        const extractCardsTask = invokeLLM({
          messages: [
            { role: 'system', content: '당신은 시각 인식 시스템입니다. 이미지에 있는 타로 카드를 식별하고 이름과 방향(정/역)을 정확히 출력하세요.' },
            { 
              role: 'user', 
              content: [
                { type: 'image_url', image_url: { url: dataUrl } },
                { type: 'text', text: '이미지에 있는 타로 카드들을 인식해서 반드시 JSON { "cards": [ { "name": "카드명", "position": "정방향|역방향" } ] } 형식으로 응답해줘.' }
              ]
            }
          ],
          responseFormat: { type: 'json_object' },
        }).catch(err => {
          console.error("Cards extraction error", err);
          return '{"cards":[]}';
        });

        // Task 2: Deep Interpretation (textually intensive logic)
        const interpretationTask = invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: [
                { type: 'image_url', image_url: { url: dataUrl } },
                { type: 'text', text: `이미지의 타로 점괘를 바탕으로, 사용자의 고민("${localConcern || '일반적인 운세'}")에 맞춰서 ${deckInfo?.name}의 관점에서 해설해줘. 결과는 반드시 JSON { "guidance": "내용", "vibe": "분위기" } 형식이어야 합니다.` }
              ]
            }
          ],
          responseFormat: { type: 'json_object' },
        }).catch(err => {
          console.error("Interpretation error", err);
          return '{}'; // Allow one task to fail without crashing the whole process
        });

        const [cardsRes, interpretationRes] = await Promise.all([
          extractCardsTask,
          interpretationTask
        ]);

        const cardsData = JSON.parse(cardsRes || '{}');
        const interpretationData = JSON.parse(interpretationRes || '{}');
        
        const result = {
          cards: cardsData.cards || [],
          guidance: interpretationData.guidance || '',
          vibe: interpretationData.vibe || ''
        };
        
      onResult(result);
    } catch (err: any) {
      console.error(err);
      setError('서비스 이용량이 많아 잠시 후 다시 시도해주세요. 🧪');
    } finally {
      setIsCapturing(false);
    }
  };

  const capture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    await processImage(canvas.toDataURL('image/jpeg', 0.8));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('5MB 이하의 이미지만 업로드할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedPreview(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex-1 w-full min-h-[850px] flex flex-col font-sans overflow-hidden rounded-[64px] bg-[#0c0915] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
    >
      <CosmicAtmosphere />

      {/* Global Header */}
      <div className="absolute top-0 left-0 right-0 h-32 px-12 flex items-center justify-between z-[70]">
        <motion.button 
          whileHover={{ x: -4, backgroundColor: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={step === 'CONCERN' ? onBack : () => setStep('CONCERN')}
          className="flex items-center gap-4 px-6 py-3 rounded-full border border-white/5 text-white/50 hover:text-white transition-all group backdrop-blur-md"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-sans">
            {step === 'CONCERN' ? 'Dismiss' : 'Return'}
          </span>
        </motion.button>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-[9px] text-[#c8a96e]/40 uppercase tracking-[0.4em] mb-1">Reality Anchor</p>
            <p className="text-[11px] font-bold text-white tracking-[0.2em] uppercase">Aion Node: 07</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-[#c8a96e]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Disc size={20} className="text-[#c8a96e] animate-spin-slow" />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'CONCERN' ? (
          <motion.div 
            key="concern" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col p-8 md:p-16 pt-36 overflow-y-auto no-scrollbar scroll-smooth relative z-10"
          >
            <div className="w-full max-w-[1100px] mx-auto">
              <MysticCore active={localConcern.length > 5} />
              
              <div className="text-center mb-16 space-y-4">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-8xl font-display font-light text-white tracking-tighter"
                >
                  <span className="opacity-30">Open your</span> <br />
                  <span className="text-[#c8a96e] serif  font-medium  drop-shadow-[0_0_30px_rgba(200,169,110,0.4)]">Final Archive</span>
                </motion.h2>
                <p className="text-sm md:text-base text-white/20 font-sans max-w-xl mx-auto leading-relaxed">
                  "당신의 문장이 운명의 좌표를 설정합니다. <br />
                  루시가 그 주파수를 읽고 영원의 지도를 그리게 하세요."
                </p>
              </div>

              <div className="relative group/input max-w-4xl mx-auto mb-16">
                <div className="absolute -inset-10 bg-gradient-to-r from-[#c8a96e]/10 via-[#818cf8]/5 to-[#c8a96e]/10 rounded-[100px] blur-[80px] opacity-0 group-focus-within/input:opacity-100 transition duration-1000" />
                <div className="relative glass rounded-[64px] border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 group-focus-within/input:border-[#c8a96e]/30">
                  <textarea 
                    value={localConcern}
                    onChange={e => setLocalConcern(e.target.value)}
                    placeholder="당신이 궁금한 미래, 혹은 지금 가장 무거운 고민에 대해 들려주세요..."
                    className="w-full h-[350px] bg-white/[0.01] p-16 text-white text-xl md:text-5xl outline-none resize-none font-sans font-light leading-tight placeholder:text-white/5 transition-all text-center"
                  />
                  
                  {/* Decorative lines */}
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c8a96e]/30 to-transparent" />
                </div>

                {/* Example suggestion pills */}
                {combinedExamples.length > 0 && (
                  <div 
                    onWheel={(e) => {
                      if (e.currentTarget) {
                        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
                        e.currentTarget.scrollLeft += delta * 1.5;
                      }
                    }}
                    className="mt-4 flex items-center gap-2.5 overflow-x-auto select-none px-2 py-2 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(200,169,110,0.3)_transparent]"
                  >
                    {combinedExamples.map((ex: string, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLocalConcern(ex)}
                        className="flex-none px-4 py-2 rounded-full bg-white/[0.04] border border-[#c8a96e]/20 hover:border-[#c8a96e]/60 text-xs text-[#c8a96e]/80 hover:text-[#c8a96e] hover:bg-[#c8a96e]/10 transition-all font-sans whitespace-nowrap cursor-pointer active:scale-95 shadow-sm"
                      >
                        ✨ {ex}
                      </button>
                    ))}
                  </div>
                )}

                <div className="absolute right-16 bottom-16 flex items-center gap-6">
                  <div className="text-right">
                    <span className="block text-[8px] text-white/20 uppercase tracking-[0.5em] font-mono mb-1">Synchronization</span>
                    <span className="text-xs text-[#c8a96e] font-mono tracking-widest">
                      {Math.floor((localConcern.length / 1000) * 100)}%
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative">
                    <svg className="w-full h-full -rotate-90">
                      <circle 
                        cx="24" cy="24" r="22" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.05)" 
                        strokeWidth="1" 
                      />
                      <motion.circle 
                        cx="24" cy="24" r="22" 
                        fill="none" 
                        stroke="#c8a96e" 
                        strokeWidth="2"
                        strokeDasharray="138"
                        animate={{ strokeDashoffset: 138 - (Math.min(localConcern.length, 1000) / 1000) * 138 }}
                      />
                    </svg>
                    <Binary size={14} className="absolute text-[#c8a96e]/40" />
                  </div>
                </div>
              </div>

              <div className="pb-20" />

              <div className="flex flex-col md:flex-row gap-6 justify-center pb-24">
                <motion.button
                  whileHover={{ scale: 1.05, y: -4, backgroundColor: '#d4b982' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchSpreadRecommendations}
                  disabled={!localConcern.trim()}
                  className={`px-12 py-8 rounded-[40px] text-2xl font-bold flex items-center gap-6 shadow-2xl transition-all ${
                    localConcern.trim() ? 'bg-[#c8a96e] text-black' : 'bg-white/5 text-white/10 opacity-30 cursor-not-allowed'
                  }`}
                >
                  <Sparkles size={28} />
                  <span>Manifest Vision</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -4, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('DECK_SELECT')}
                  disabled={!localConcern.trim()}
                  className={`px-12 py-8 rounded-[40px] text-2xl font-bold flex items-center gap-6 glass border border-white/10 transition-all ${
                    localConcern.trim() ? 'text-white' : 'text-white/10 opacity-30 cursor-not-allowed'
                  }`}
                >
                  <Shuffle size={28} />
                  <span>Manual Forge</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : step === 'SPREAD' ? (
          <motion.div 
            key="spread" 
            initial={{ opacity: 0, scale: 1.05 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col p-10 md:p-20 pt-40 overflow-y-auto no-scrollbar relative z-10"
          >
            <div className="w-full max-w-[1200px] mx-auto">
              {isRecommending ? (
                <div className="py-40 flex flex-col items-center justify-center gap-16">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-72 h-72 rounded-full border border-[#c8a96e]/20 border-dashed"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-8 rounded-full border border-[#c8a96e]/10 border-dotted"
                    />
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                      <div className="relative">
                        <Activity size={48} className="text-[#c8a96e] animate-pulse" />
                        <div className="absolute inset-0 bg-[#c8a96e]/40 blur-2xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="text-3xl font-display text-white  tracking-tighter">Synchronizing Destiny Nodes...</h3>
                    <p className="text-sm text-white/20 font-sans max-w-sm mx-auto leading-relaxed">
                      루시가 수만 개의 미래 시나리오를 연산하고 있습니다. <br />
                      당신에게 가장 선명한 길을 비출 배열법을 찾고 있습니다.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-20">
                  <div className="text-center space-y-6">
                    <span className="text-[10px] text-[#c8a96e] font-bold uppercase tracking-[0.8em]">Recommendation Derived</span>
                    <h3 className="text-4xl md:text-7xl font-display text-white tracking-tight leading-tight">
                      지금 당신과 <span className="text-[#c8a96e] serif  font-medium ">가장 깊게 공명하는</span> <br /> 배열법을 찾았습니다.
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-24">
                    {recommendedSpreads.map((spread, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="group relative p-12 rounded-[64px] glass border border-white/5 hover:border-[#c8a96e]/40 transition-all duration-700 flex flex-col gap-10"
                      >
                        <div className="absolute top-0 right-12 -translate-y-1/2 flex items-center gap-2 px-6 py-3 rounded-full bg-[#c8a96e] text-black text-[10px] font-bold uppercase tracking-widest shadow-2xl">
                          <Binary size={12} />
                          <span>Structure {i + 1}</span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <h4 className="text-4xl font-bold text-white tracking-tighter">{spread.name}</h4>
                            <span className="text-xs text-[#c8a96e] font-sans">{spread.cardCount} Cards Manifested</span>
                          </div>
                          <p className="text-lg text-white/40 leading-relaxed font-sans">"{spread.reason}"</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {spread.positions?.map((pos: string, j: number) => (
                            <div key={j} className="px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                              <span className="w-5 h-5 rounded-md bg-[#c8a96e]/20 text-[#c8a96e] flex items-center justify-center font-mono text-[10px] font-bold">{j+1}</span>
                              <span className="text-xs text-white/70 font-medium">{pos}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-4">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-2xl bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center text-[#c8a96e]">
                               <Shield size={18} />
                             </div>
                             <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Adaptive Tool</span>
                           </div>
                           <div>
                              <div className="text-xl font-bold text-white mb-2">{VISION_DECKS.find((d: any) => d.id === spread.recommendedDeckId)?.name}</div>
                              <p className="text-xs text-white/30 leading-relaxed font-sans">"{spread.deckReason}"</p>
                           </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: '#d4b982' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectSpreadAndDeck(spread)}
                          className="w-full py-8 rounded-[36px] bg-[#c8a96e] text-black font-bold text-xl transition-all shadow-2xl shadow-[#c8a96e]/10"
                        >
                          Step into Vision
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : step === 'DECK_SELECT' ? (
          <motion.div 
            key="deck_select" 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -50 }}
            className="flex-1 flex flex-col p-10 md:p-20 pt-40 overflow-y-auto no-scrollbar relative z-10"
          >
            <div className="w-full max-w-[1300px] mx-auto">
              <div className="text-center mb-24 space-y-6">
                <span className="text-[10px] text-white/20 uppercase tracking-[1em] font-bold">Manual Archive Forge</span>
                <h3 className="text-4xl md:text-7xl font-display text-white tracking-tighter">당신의 <span className="text-[#c8a96e] serif  font-medium ">직관</span>을 믿으세요.</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
                {VISION_DECKS.map((deck) => (
                  <motion.button
                    key={deck.id}
                    whileHover={{ scale: 1.03, y: -12 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectDeckManual(deck.id)}
                    className={`group relative p-12 rounded-[64px] text-left flex flex-col gap-8 transition-all duration-700 ${
                      activeDeckId === deck.id ? 'glass border-[#c8a96e]/50' : 'glass border-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 ${
                        activeDeckId === deck.id ? 'bg-[#c8a96e] text-black shadow-[0_0_30px_rgba(200,169,110,0.4)]' : 'bg-white/5 text-white/20'
                      }`}>
                        <Sparkles size={28} />
                      </div>
                      {activeDeckId === deck.id && (
                        <div className="px-5 py-2 rounded-full border border-[#c8a96e] text-[#c8a96e] text-[10px] font-bold uppercase tracking-widest">Active Link</div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className={`text-3xl font-bold tracking-tighter transition-colors ${activeDeckId === deck.id ? 'text-[#c8a96e]' : 'text-white'}`}>
                        {deck.name}
                      </h4>
                      <p className="text-sm text-white/40 leading-relaxed font-sans line-clamp-3">"{deck.desc}"</p>
                    </div>

                    <div className="mt-4 pt-8 border-t border-white/5 space-y-2">
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Ideal Resonator</span>
                       <div className="text-xs text-[#c8a96e]/80 font-medium">{deck.best}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col pt-32"
          >
            <div className="px-6 md:px-12 pb-6 flex justify-center relative z-20">
              <div className="inline-flex gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => {
                    setScanMode('camera');
                    setUploadedPreview(null);
                    setError(null);
                  }}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                    scanMode === 'camera'
                      ? 'bg-[#c8a96e] text-black'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Camera size={14} />
                  카메라 촬영
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScanMode('upload');
                    stopCameraStream();
                    setError(null);
                  }}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                    scanMode === 'upload'
                      ? 'bg-[#c8a96e] text-black'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Sparkles size={14} />
                  사진 업로드
                </button>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#050308]">
              {error ? (
                <motion.div className="text-center p-16 glass border-red-500/20 rounded-[64px] max-w-sm mx-6">
                  <X size={64} className="mx-auto mb-8 text-red-500/50" />
                  <h4 className="text-2xl font-bold text-white mb-4">Link Severed</h4>
                  <p className="text-sm text-white/40 leading-relaxed font-sans mb-10">{error}</p>
                  <button onClick={() => { setError(null); setStep('CONCERN'); }} className="w-full py-4 rounded-3xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Reconnect</button>
                </motion.div>
              ) : scanMode === 'upload' ? (
                <div className="w-full max-w-lg mx-6 flex flex-col items-center gap-8 py-8">
                  {uploadedPreview ? (
                    <div className="relative w-full rounded-[32px] overflow-hidden border border-[#c8a96e]/30 shadow-[0_0_40px_rgba(200,169,110,0.15)]">
                      <img src={uploadedPreview} alt="업로드된 타로 카드" className="w-full max-h-[420px] object-contain bg-black/40" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-[4/5] max-h-[420px] rounded-[32px] border-2 border-dashed border-[#c8a96e]/30 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#c8a96e]/50 transition-all flex flex-col items-center justify-center gap-4"
                    >
                      <Camera size={48} className="text-[#c8a96e]/60" />
                      <span className="text-sm text-white/60 font-sans">갤러리에서 카드 사진 선택</span>
                      <span className="text-[10px] text-white/30">JPG, PNG · 최대 5MB</span>
                    </button>
                  )}
                  <p className="text-center text-xs text-[#c8a96e]/60 font-sans">
                    "{deckInfo?.name}" 덱으로 해석합니다
                  </p>
                </div>
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-50 mix-blend-screen" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
                  
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-[85%] aspect-[3/4] max-w-[450px]">
                      <motion.div 
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 border-2 border-[#c8a96e]/20 rounded-[48px]"
                      >
                         <div className="absolute -top-1 -left-1 w-20 h-20 border-t-4 border-l-4 border-[#c8a96e] rounded-tl-[48px]" />
                         <div className="absolute -top-1 -right-1 w-20 h-20 border-t-4 border-r-4 border-[#c8a96e] rounded-tr-[48px]" />
                         <div className="absolute -bottom-1 -left-1 w-20 h-20 border-b-4 border-l-4 border-[#c8a96e] rounded-bl-[48px]" />
                         <div className="absolute -bottom-1 -right-1 w-20 h-20 border-b-4 border-r-4 border-[#c8a96e] rounded-br-[48px]" />
                      </motion.div>

                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-[#c8a96e] shadow-[0_0_30px_#c8a96e] z-20 mix-blend-screen"
                      />

                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
                         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
                         <span className="text-[10px] font-bold text-white tracking-[0.5em] uppercase">Visual Artifact Scan</span>
                      </div>

                      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-full space-y-4">
                        <div className="space-y-1">
                          <p className="text-xl text-white font-sans">"{deckInfo?.name}"</p>
                          <p className="text-xs text-[#c8a96e]/60 font-sans lowercase ">Place cards within the sanctum frame.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="px-12 py-16 bg-[#050308] flex flex-col items-center gap-8 border-t border-white/5 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {scanMode === 'camera' ? (
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9, rotate: -5 }}
                  onClick={capture}
                  disabled={isCapturing}
                  className="group relative w-32 h-32 flex items-center justify-center"
                >
                  <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-[#c8a96e]/40 transition-all duration-500" />
                  <div className="absolute inset-2 rounded-full border-4 border-white/80 group-hover:border-[#c8a96e] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(200,169,110,0.3)]" />
                  
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    {isCapturing ? (
                      <Loader2 className="animate-spin text-[#c8a96e]" size={40} />
                    ) : (
                      <>
                        <Camera size={40} className="text-white group-hover:text-[#c8a96e] transition-colors" />
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] group-hover:text-[#c8a96e] transition-colors">Capture</span>
                      </>
                    )}
                  </div>
                </motion.button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCapturing}
                    className="flex-1 w-full py-4 rounded-2xl border border-white/10 bg-white/5 text-white/70 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    {uploadedPreview ? '사진 변경' : '사진 선택'}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => uploadedPreview && processImage(uploadedPreview)}
                    disabled={isCapturing || !uploadedPreview}
                    className={`flex-1 w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      uploadedPreview && !isCapturing
                        ? 'bg-[#c8a96e] text-black hover:bg-[#d4b982]'
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}
                  >
                    {isCapturing ? <Loader2 className="animate-spin" size={18} /> : <Eye size={18} />}
                    {isCapturing ? '분석 중...' : '비전 해석 시작'}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}
