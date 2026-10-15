import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bookmark, Sparkle, Eye, Trash2, Award, Zap, Download, Share2, X, ChevronRight, ArrowLeft 
} from 'lucide-react';
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

const ELEMENT_DETAILS = {
  wood: {
    hanja: '木',
    name: '목(木) - 성장과 활력의 숲',
    desc: '굽히지 않는 생명력과 솟구치는 지혜, 추진력과 새로운 시작을 촉발하는 기수',
    color: '#10b981',
    bgClass: 'from-emerald-950/40 to-teal-950/20 border-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.4)'
  },
  fire: {
    hanja: '火',
    name: '화(火) - 열정과 번뜩임의 불꽃',
    desc: '어둠을 밝히는 직관적 지혜, 대중을 끄는 강력한 매혹과 창조적 번뜩임',
    color: '#f97316',
    bgClass: 'from-orange-950/40 to-red-950/20 border-orange-500/30',
    glowColor: 'rgba(249, 115, 22, 0.4)'
  },
  earth: {
    hanja: '土',
    name: '토(土) - 공명과 포용의 대지',
    desc: '모든 만물을 품어 기르는 중용의 안정성, 신뢰감과 굳건한 정신적 방벽',
    color: '#eab308',
    bgClass: 'from-amber-950/40 to-yellow-950/20 border-amber-500/30',
    glowColor: 'rgba(234, 179, 8, 0.4)'
  },
  metal: {
    hanja: '金',
    name: '금(金) - 결단과 결실의 철광',
    desc: '불필요한 미련을 베어내는 서슬 퍼런 강단, 날카로운 완결성과 완벽한 마무리',
    color: '#f4f4f5',
    bgClass: 'from-zinc-900/40 to-stone-900/20 border-zinc-500/30',
    glowColor: 'rgba(244, 244, 245, 0.4)'
  },
  water: {
    hanja: '水',
    name: '수(水) - 지혜와 통찰의 대양',
    desc: '모든 형태에 유연하게 순응하는 지혜, 심해의 끝없는 통찰과 영적 주파수',
    color: '#3b82f6',
    bgClass: 'from-blue-950/40 to-indigo-950/20 border-blue-500/30',
    glowColor: 'rgba(59, 130, 246, 0.4)'
  }
};

export function TalismanAlbum({ onClose }: { onClose?: () => void }) {
  const [talismanChest, setTalismanChest] = useState<SavedTalisman[]>([]);
  const [equippedCharm, setEquippedCharm] = useState<SavedTalisman | null>(null);
  const [selectedTalisman, setSelectedTalisman] = useState<SavedTalisman | null>(null);
  const [albumFilter, setAlbumFilter] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    loadChestData();
  }, []);

  const loadChestData = () => {
    try {
      const chest = loadTalismanChest();
      setTalismanChest(chest);
      const { equipped } = resolveEquippedCharm(chest);
      setEquippedCharm(equipped);
    } catch (e) {
      console.error(e);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const equipTalismanBuff = (charm: SavedTalisman) => {
    if (!isCharmFromToday(charm)) {
      triggerToast('오늘 만든 부적만 장착할 수 있어요.');
      return;
    }
    try {
      persistEquippedCharm(charm);
      setEquippedCharm(charm);
      notifyCharmChanged();
      playAudioHaptic('save_success');
      triggerToast('부적 오행 영성 버프가 성공적으로 장착되었습니다.');
    } catch (err) {
      console.error(err);
    }
  };

  const unequipTalismanBuff = () => {
    try {
      persistEquippedCharm(null);
      setEquippedCharm(null);
      notifyCharmChanged();
      triggerToast('장착된 수호 부적 버프가 해제되었습니다.');
    } catch (err) {
      console.error(err);
    }
  };

  const downloadCharmImage = (charm: SavedTalisman) => {
    const link = document.createElement('a');
    link.download = `PRISM_CHARM_${charm.element}_${charm.rarity}_${Date.now()}.png`;
    link.href = charm.dataUrl;
    link.click();
    playAudioHaptic('save_success');
    triggerToast('스마트폰 락스크린 고화질 원화가 다운로드되었습니다.');
  };

  const copySharableCharmLink = (charm: SavedTalisman) => {
    const textToCopy = `🔮 [프리즘 우주 오행 수호 부적]\n\n👤 서원자: ${charm.name}\n🍀 소망서약: "${charm.wishText}"\n⚡ 오행속성: ${ELEMENT_DETAILS[charm.element].name}\n💎 화각등급: ${charm.rarity} (${charm.styleName})\n✨ 동조능력: ${charm.buffText}\n\n스마트기기 락스크린 부적으로 행운의 보야지를 시작하세요!`;
    navigator.clipboard.writeText(textToCopy);
    triggerToast('부적 오행 영성 링크가 클립보드에 복사되었습니다.');
  };

  const deleteTalismanFromAlbum = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("이 부적을 화첩에서 영구 소멸시키겠습니까?")) return;

    const filtered = talismanChest.filter(t => t.id !== id);
    setTalismanChest(filtered);
    playAudioHaptic('delete_discard');
    try {
      localStorage.setItem(PRISM_TALISMAN_CHEST_KEY, JSON.stringify(filtered));
      if (equippedCharm?.id === id) {
        persistEquippedCharm(null);
        setEquippedCharm(null);
        notifyCharmChanged();
      }
    } catch (err) {
      console.error(err);
    }
    if (selectedTalisman?.id === id) {
      setSelectedTalisman(null);
    }
    triggerToast('부적이 도감 화첩에서 정숙히 소멸되었습니다.');
  };

  const filteredTalismans = talismanChest.filter(
    (t) => albumFilter === 'all' || t.element === albumFilter
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-32 animate-fade-in text-left">
      <div className="text-center space-y-4 mb-4">
        <span className="text-[10px] text-orange-400 font-extrabold uppercase tracking-[0.3em] font-mono block">
          Talisman Collection Cabinet
        </span>
        <h3 className="text-4xl md:text-5xl font-display text-white tracking-tighter">
          나의 오결 오행 부적 비전 첩
        </h3>
        <p className="text-[11px] md:text-xs text-white/50 max-w-2xl mx-auto leading-relaxed">
          우주 기류에서 성공적으로 봉인 해제되어 수장고에 고이 수집 완료된 당신만의 소망 비전 화첩지입니다.
          장착을 통해 오행 버프를 두르거나 스마트폰 락스크린 원화를 소장하십시오.
        </p>
      </div>

      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[350] bg-orange-600 border border-orange-500 text-white font-sans font-bold text-xs px-6 py-3.5 rounded-full shadow-[0_4px_30px_rgba(249,115,22,0.4)] tracking-wide whitespace-nowrap"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main View Grid / Filter Container */}
      <div className="glass p-6 sm:p-10 rounded-[44px] border border-orange-500/10 bg-black/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <h5 className="text-lg font-black text-white flex items-center gap-2">
              <Bookmark size={18} className="text-orange-400 animate-pulse" />
              <span>도감 화첩지</span>
            </h5>
            <p className="text-white/30 text-[10px] md:text-xs">
              현재 보관된 부적 개수: {talismanChest.length}개 {equippedCharm && `• [장착중: ${equippedCharm.name} 신패]`}
            </p>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 shrink-0">
            {['all', 'wood', 'fire', 'earth', 'metal', 'water'].map(el => (
              <button
                key={el}
                onClick={() => setAlbumFilter(el)}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all cursor-pointer ${
                  albumFilter === el 
                    ? 'border-orange-500 bg-orange-500/15 text-orange-400' 
                    : 'border-white/5 bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {el === 'all' ? '전체' : ELEMENT_DETAILS[el as any].hanja}
              </button>
            ))}
          </div>
        </div>

        {filteredTalismans.length === 0 ? (
          <div className="py-24 rounded-[28px] border-2 border-dashed border-white/5 text-center flex flex-col items-center justify-center space-y-3 select-none">
            <Sparkle size={28} className="text-white/15 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs font-black uppercase text-zinc-500 tracking-[0.25em]">수장고에 보관된 부적이 없습니다</span>
            <span className="text-[11px] text-zinc-600 font-sans">데일리 부적 제작 페이지에서 소망을 새겨 나만의 첫 운명 부적을 연성하십시오!</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredTalismans.map((t) => {
              const elInfo = ELEMENT_DETAILS[t.element];
              const isEquipped = equippedCharm?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTalisman(t)}
                  className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-orange-500/40 rounded-3xl cursor-pointer select-none relative group overflow-hidden transition-all flex flex-col text-left"
                >
                  <div className="aspect-[3/4.5] rounded-2xl overflow-hidden border border-white/5 relative bg-zinc-950 mb-2">
                    <img 
                      src={t.dataUrl} 
                      alt={t.wishText} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye size={18} className="text-white drop-shadow-md" />
                    </div>

                    {isEquipped && (
                      <span className="absolute top-2 left-2 bg-orange-600 text-white font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                        <Zap size={8} className="animate-pulse" /> EQUIPPED
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h6 className="text-[11px] font-black text-white break-keep break-words flex items-center justify-between gap-1">
                      <span>{t.name} 신패</span>
                      <button
                        onClick={(e) => deleteTalismanFromAlbum(t.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 bg-red-950/40 border border-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 font-normal transition-opacity"
                        title="소멸"
                      >
                        <Trash2 size={9} />
                      </button>
                    </h6>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full" style={{ backgroundColor: `${elInfo.color}25`, color: elInfo.color }}>
                        {elInfo.hanja} {elInfo.name.split(' - ')[0].split('(')[0]}
                      </span>
                      <span className="text-[7px] text-zinc-500 font-bold uppercase font-mono">{t.rarity}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 italic break-keep break-words pt-0.5">
                      "{t.wishText}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Immersive View Overlay Modal for Talisman Detail */}
      <AnimatePresence>
        {selectedTalisman && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-zinc-950/95 backdrop-blur-3xl overflow-y-auto w-full h-full flex flex-col font-sans p-6 md:p-12 scrollbar-none"
            onClick={() => setSelectedTalisman(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl mx-auto my-auto flex flex-col gap-6 text-left bg-[#08080c] border border-orange-500/15 p-6 md:p-10 rounded-[36px] shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
              
              {/* Modal Header */}
              <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Bookmark size={18} className="text-orange-400" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-orange-500/55 uppercase tracking-[0.3em] block leading-none mb-1 font-mono">Talisman Details</span>
                    <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">{selectedTalisman.name} 신패 상세 명세</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTalisman(null)}
                  className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content Drawer style */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
                {/* Visual Lockscreen Mockup */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 group select-none w-full max-w-[270px] aspect-[3/4.5] shadow-orange-950/20">
                    <img 
                      src={selectedTalisman.dataUrl} 
                      alt="Talisman High-Res" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/15 pointer-events-none" />
                  </div>
                  <span className="text-[9px] text-zinc-500 mt-3 font-mono">✦ PREMIUM HD LOCKSCREEN GRAPHIC ✦</span>
                </div>

                {/* Specs and interactive actions */}
                <div className="md:col-span-7 space-y-6">
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                        <Award size={13} className="text-yellow-400" />
                        <span>수성 영성 양식 명세</span>
                      </span>
                      <span className="text-[9px] bg-rose-500/15 border border-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded-full font-black uppercase">
                        {selectedTalisman.rarity}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-sans text-left">
                      <div className="space-y-0.5">
                        <span className="text-white/30 text-[9px] uppercase font-bold">서원 대상주</span>
                        <p className="font-extrabold text-white">{selectedTalisman.name} 님</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-white/30 text-[9px] uppercase font-bold">오행 보강원</span>
                        <p className="font-extrabold text-orange-400">
                          {ELEMENT_DETAILS[selectedTalisman.element]?.name.split(' - ')[1]}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-white/30 text-[9px] uppercase font-bold">연성 주파 스타일</span>
                        <p className="font-extrabold text-white break-keep break-words">{selectedTalisman.styleName.split(' (')[0]}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-white/30 text-[9px] uppercase font-bold">소망 내용</span>
                        <p className="font-extrabold text-yellow-300 break-keep break-words">“{selectedTalisman.wishText}”</p>
                      </div>
                    </div>

                    <div className="bg-orange-500/5 border border-orange-500/15 p-4 rounded-xl space-y-1 text-left">
                      <span className="text-[9px] font-black text-orange-400 uppercase tracking-wider block">장착 시 영성 증폭율</span>
                      <p className="text-xs text-white font-bold leading-relaxed">
                        {selectedTalisman.buffText}
                      </p>
                    </div>
                  </div>

                  {/* Utilities tools button panel */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {equippedCharm?.id === selectedTalisman.id ? (
                      <button
                        onClick={unequipTalismanBuff}
                        className="flex-1 py-3.5 px-4 rounded-2xl bg-zinc-850 hover:bg-zinc-800 border border-white/10 text-white/80 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <X size={14} />
                        <span>부적 버프 해제하기</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => equipTalismanBuff(selectedTalisman)}
                        className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-950/20 cursor-pointer"
                      >
                        <Zap size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
                        <span>부적 버프 장착하기</span>
                      </button>
                    )}

                    <button
                      onClick={() => downloadCharmImage(selectedTalisman)}
                      className="py-3.5 px-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download size={14} />
                      <span>락스크린 저장</span>
                    </button>

                    <button
                      onClick={() => copySharableCharmLink(selectedTalisman)}
                      className="py-3.5 px-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 size={14} className="text-orange-400" />
                      <span>영성 공유</span>
                    </button>
                  </div>

                  {/* Redundant Delete item */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => deleteTalismanFromAlbum(selectedTalisman.id)}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>이 부적 화첩에서 영구 삭제</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
