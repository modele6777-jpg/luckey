import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Search,
  X,
  Sparkles,
  Feather,
  Check,
  ExternalLink,
  ChevronRight,
  Filter,
  Volume2,
} from "lucide-react";
import {
  KOREAN_FAMOUS_POEMS,
  KOREAN_POEM_THEMES,
  searchKoreanPoems,
  type KoreanPoemItem,
  type KoreanPoemTheme,
} from "@/lib/koreanFamousPoems";
import { buildPoemGoogleAiSearchUrl, buildPoemGoogleArtsAndCultureSearchUrl } from "@/utils/artSearchQuery";
import { TTSButton } from "@/components/TTSButton";
import { TTSHighlightText } from "@/utils/ttsHighlight";

interface KoreanPoemLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPoemTitle?: string;
  onSelectPoem: (poem: KoreanPoemItem) => void;
}

export const KoreanPoemLibraryModal: React.FC<KoreanPoemLibraryModalProps> = ({
  isOpen,
  onClose,
  currentPoemTitle,
  onSelectPoem,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<KoreanPoemTheme | "all">("all");
  const [activePoem, setActivePoem] = useState<KoreanPoemItem | null>(null);

  const filteredPoems = useMemo(() => {
    return searchKoreanPoems(searchQuery, selectedTheme);
  }, [searchQuery, selectedTheme]);

  // Set initial active poem
  React.useEffect(() => {
    if (isOpen) {
      const match = KOREAN_FAMOUS_POEMS.find(
        (p) => currentPoemTitle && p.title.toLowerCase().includes(currentPoemTitle.toLowerCase())
      );
      setActivePoem(match || KOREAN_FAMOUS_POEMS[0]);
    }
  }, [isOpen, currentPoemTitle]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl h-[90vh] max-h-[850px] bg-zinc-950 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 bg-zinc-900/70 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    한국 명시(名詩) 보물 서재
                  </h3>
                  <span className="text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {KOREAN_FAMOUS_POEMS.length}편 수록
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  윤동주, 백석, 김소월, 정지용, 나태주 등 세대를 초월한 한국의 대표 명시를 감상하고 오늘의 시로 지정하세요.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          </div>

          {/* Controls: Search & Theme Tabs */}
          <div className="px-6 py-3 border-b border-white/5 bg-black/40 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="시 제목, 시인명(윤동주, 백석, 김소월 등), 시 구절 검색..."
                  className="w-full pl-10 pr-4 py-2 bg-zinc-900/90 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Theme filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedTheme("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedTheme === "all"
                      ? "bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  전체 ({KOREAN_FAMOUS_POEMS.length})
                </button>
                {KOREAN_POEM_THEMES.map((th) => {
                  const count = KOREAN_FAMOUS_POEMS.filter((p) => p.theme === th.id).length;
                  return (
                    <button
                      key={th.id}
                      onClick={() => setSelectedTheme(th.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        selectedTheme === th.id
                          ? "bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20"
                          : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                      }`}
                    >
                      <span>{th.icon}</span>
                      <span>{th.label}</span>
                      <span className="text-[10px] opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area: 2 Columns */}
          <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
            {/* Left: Poem List */}
            <div className="w-full md:w-5/12 lg:w-4/12 border-r border-white/5 overflow-y-auto p-3 space-y-2 bg-zinc-950/60">
              {filteredPoems.length === 0 ? (
                <div className="text-center py-12 px-4 text-zinc-500 text-sm">
                  검색 결과와 일치하는 시가 없습니다.
                </div>
              ) : (
                filteredPoems.map((poem) => {
                  const isSelected = activePoem?.id === poem.id;
                  const isCurrent = currentPoemTitle && poem.title.toLowerCase().includes(currentPoemTitle.toLowerCase());

                  return (
                    <div
                      key={poem.id}
                      onClick={() => setActivePoem(poem)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all border text-left relative ${
                        isSelected
                          ? "bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/30"
                          : "bg-zinc-900/40 border-white/5 hover:bg-zinc-900/80 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm font-bold ${isSelected ? "text-emerald-200" : "text-zinc-100"}`}>
                          {poem.title}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {isCurrent && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                              현재
                            </span>
                          )}
                          <span className="text-[10px] font-medium text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">
                            {poem.themeLabel}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-emerald-400/80 font-medium mb-1.5 flex items-center gap-1">
                        <Feather size={11} />
                        {poem.poet}
                      </p>

                      <p className="text-xs text-zinc-400 line-clamp-2 italic font-serif opacity-80 leading-relaxed">
                        "{poem.excerpt.replace(/\n/g, " / ")}"
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right: Detailed Poem Viewer */}
            <div className="w-full md:w-7/12 lg:w-8/12 flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-between bg-zinc-900/30">
              {activePoem ? (
                <div className="space-y-6">
                  {/* Top metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          {activePoem.themeLabel}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {activePoem.poemSourceName}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white font-sans">
                        {activePoem.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <TTSButton
                        text={`${activePoem.poet}의 시, ${activePoem.title}.\n\n${activePoem.excerpt}`}
                        voice="Kore"
                        className="px-3 py-2 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-200 text-xs font-bold active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      />
                      <button
                        onClick={() => {
                          onSelectPoem(activePoem);
                          onClose();
                        }}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <Sparkles size={16} />
                        오늘의 명시로 지정하기
                      </button>
                    </div>
                  </div>

                  {/* Poet info */}
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-base">
                    <Feather size={16} />
                    <span>{activePoem.poet}</span>
                  </div>

                  {/* Poem Excerpt Full Card */}
                  <div className="p-6 rounded-3xl bg-zinc-950/80 border-l-4 border-emerald-400 border border-white/5 shadow-xl">
                    <p className="text-base md:text-lg text-zinc-100 font-serif whitespace-pre-line leading-relaxed italic">
                      &ldquo;<TTSHighlightText text={activePoem.excerpt} />&rdquo;
                    </p>
                  </div>

                  {/* Poetic Insight / Why Recommended */}
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                      <Sparkles size={13} />
                      시적 통찰 & 추천 이유
                    </span>
                    <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                      {activePoem.whyRecommended}
                    </p>
                  </div>

                  {/* External Links */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-zinc-500">
                      출처: {activePoem.poemSourceName} · {activePoem.poet}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={buildPoemGoogleAiSearchUrl(
                          activePoem.title,
                          activePoem.poet,
                          activePoem.titleOriginal,
                          activePoem.poetOriginal
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-white transition-colors bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl"
                      >
                        원작 전문 보기
                        <ExternalLink size={12} />
                      </a>
                      <a
                        href={buildPoemGoogleArtsAndCultureSearchUrl(
                          activePoem.title,
                          activePoem.poet,
                          activePoem.titleOriginal,
                          activePoem.poetOriginal
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-white transition-colors bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl"
                      >
                        Google 문화예술 검색
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-zinc-500">
                  좌측 목록에서 감상하실 시를 선택해 주세요.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
