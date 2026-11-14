import './chat-library-layout.css';
import React, { useState, useMemo, useCallback } from 'react';
import { WorkspacePortal } from '@/components/layout/DuoWorkspace';
import './prompt-library.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, Sparkles, MessageSquare, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Send, Edit3, Flame, Check, Tag, Compass
} from 'lucide-react';
import {
  HORI_PROMPT_LIBRARY,
  PROMPT_CATEGORIES,
  TOOL_CATEGORIES,
  PROMPTS_PER_PAGE,
  filterPrompts,
  paginatePrompts,
  HoriPromptItem
} from '../../data/horiPromptLibrary';

interface PromptLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (
    promptText: string,
    sendImmediately: boolean,
    toolIds?: string[],
    promptTitle?: string
  ) => void;
}

export const PromptLibraryModal: React.FC<PromptLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: HORI_PROMPT_LIBRARY.length };
    HORI_PROMPT_LIBRARY.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered prompts
  const filteredList = useMemo(() => {
    return filterPrompts(HORI_PROMPT_LIBRARY, selectedCategory, selectedTool, searchQuery);
  }, [selectedCategory, selectedTool, searchQuery]);

  // Reset page when filter changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleToolChange = (tool: string) => {
    setSelectedTool(tool);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  // Paginated slice
  const paginationData = useMemo(() => {
    return paginatePrompts(filteredList, currentPage, PROMPTS_PER_PAGE);
  }, [filteredList, currentPage]);

  const { items: pageItems, totalPages, totalCount } = paginationData;

  const handlePromptAction = useCallback((prompt: HoriPromptItem, sendImmediately: boolean) => {
    onSelectPrompt(prompt.body, sendImmediately, prompt.tool_ids, prompt.title);
    onClose();
  }, [onSelectPrompt, onClose]);

  // Pagination page numbers (window of up to 5 numbers)
  const paginationRange = useMemo(() => {
    const range: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }, [currentPage, totalPages]);

  if (!isOpen) return null;

  return (
    <WorkspacePortal onClose={onClose}><AnimatePresence>
      <div
        id="hori-prompt-library-modal-backdrop"
        className="fixed inset-0 z-[10030] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          id="hori-prompt-library-dialog"
          role="dialog" aria-modal="true" aria-label="추천 질문 라이브러리"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="chat-library-dialog bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full h-full max-h-[860px] min-h-0 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative"
        >
          {/* Header */}
          <div className="chat-library-heading px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-blue-500/5">
            <div className="flex items-center gap-3">
              <div className="chat-library-heading-icon prompt-library-heading-icon w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 dark:from-amber-600 dark:to-yellow-500 text-slate-950 flex items-center justify-center shadow-md">
                <Sparkles size={20} className="text-slate-950" />
              </div>
              <div className="chat-library-heading-copy">
                <div className="chat-library-heading-row">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    추천 질문 라이브러리
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-600/40">
                    13페이지 · 77선
                  </span>
                </div>
                <p className="chat-library-subtitle text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  사주·타로·점성술·자미두수 동서양 지혜를 아우르는 엄선된 질문 리스트
                </p>
              </div>
            </div>

            <button
              id="prompt-library-close-btn"
              type="button"
              onClick={onClose}
              className="chat-library-close p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          </div>

          <div className="chat-library-scroll overflow-y-auto" data-testid="prompt-library-list" data-app-scroll-root="" tabIndex={0} aria-label="추천 질문 목록, 세로로 스크롤할 수 있습니다">
            {/* Search Bar & Filters Section */}
            <div className="chat-library-toolbar p-4 sm:px-7 sm:py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 shrink-0 space-y-3">
              {/* Search Input */}
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  id="prompt-library-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="관심 있는 질문 키워드를 검색해 보세요 (예: 재회, 이직, 궁합, 사주, 타로, 성격)"
                  className="w-full pl-10 pr-9 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('all')}
                  data-active={selectedCategory === 'all'}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>전체</span>
                  <span className="text-[10px] opacity-75 font-semibold">({categoryCounts.all || 77})</span>
                </button>

                {Object.keys(PROMPT_CATEGORIES).map((catKey) => {
                  const cat = PROMPT_CATEGORIES[catKey];
                  const count = categoryCounts[catKey] || 0;
                  const isSelected = selectedCategory === catKey;

                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => handleCategoryChange(catKey)}
                      data-active={isSelected}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                      style={isSelected ? { backgroundColor: cat.color } : {}}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-80 font-semibold">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Themes Quick Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
                <span className="text-slate-400 dark:text-slate-500 font-medium shrink-0 flex items-center gap-1 mr-1">
                  <Compass size={12} />
                  테마:
                </span>
                <button
                  type="button"
                  onClick={() => handleToolChange('all')}
                  className={`px-2 py-0.5 rounded-lg font-semibold shrink-0 transition-colors ${
                    selectedTool === 'all'
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  전체
                </button>
                {Object.keys(TOOL_CATEGORIES).map((tKey) => {
                  const meta = TOOL_CATEGORIES[tKey];
                  if (!meta) return null;
                  const isSelected = selectedTool === tKey;
                  return (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => handleToolChange(isSelected ? 'all' : tKey)}
                      data-active={isSelected}
                      className={`px-2 py-0.5 rounded-lg font-semibold shrink-0 transition-all border ${
                        isSelected
                          ? 'border-transparent text-white'
                          : 'border-slate-200/80 dark:border-slate-700 bg-white/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                      style={isSelected ? { backgroundColor: meta.color } : {}}
                    >
                      {meta.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content List: 6 cards per page */}
            <div className="prompt-library-content p-4 sm:p-7 space-y-3.5 select-text">
              {pageItems.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Search size={24} />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    검색 조건에 맞는 추천 질문이 없습니다.
                  </p>
                  <p className="text-xs text-slate-400">
                    다른 키워드로 검색하거나 카테고리 필터를 변경해 보세요.
                  </p>
                </div>
              ) : (
                <div className="prompt-library-grid">
                  {pageItems.map((prompt) => {
                    const catMeta = PROMPT_CATEGORIES[prompt.category];

                    return (
                      <div
                        key={prompt.id}
                        className="prompt-library-card p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 hover:border-amber-400/80 dark:hover:border-amber-500/80 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
                      >
                        <div
                          className="space-y-2.5 cursor-pointer"
                          onClick={() => handlePromptAction(prompt, false)}
                          title="클릭하여 대화 입력창에 넣고 해당 모드로 전환합니다."
                        >
                          {/* Badges: Category & Tools */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-2xs"
                                style={{ backgroundColor: catMeta?.color || '#FF6575' }}
                              >
                                {prompt.categoryLabel}
                              </span>

                              {prompt.tools.map((t) => {
                                const toolMeta = TOOL_CATEGORIES[t];
                                return (
                                  <span
                                    key={t}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors shadow-2xs"
                                    style={{
                                      color: toolMeta?.color || '#3b82f6',
                                      backgroundColor: toolMeta ? `${toolMeta.color}15` : 'rgba(148, 163, 184, 0.1)',
                                      borderColor: toolMeta ? `${toolMeta.color}35` : 'rgba(148, 163, 184, 0.25)'
                                    }}
                                  >
                                    {toolMeta?.name || t}
                                  </span>
                                );
                              })}
                            </div>

                            <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                              <Flame size={12} className="text-amber-500" />
                              {prompt.questionCount}회 질문
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                            {prompt.title}
                          </h3>

                          {/* Body Preview */}
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 bg-slate-50/80 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                            {prompt.body}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-3 mt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => handlePromptAction(prompt, false)}
                            className="prompt-library-action w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow flex items-center justify-center gap-1.5 active:scale-95"
                            title="대화 입력창에 질문을 입력하고 필요 시 내용을 수정하여 보냅니다."
                          >
                            <Edit3 size={13} />
                            <span>채팅란에 입력하기</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* 13페이지 Pagination Footer */}
          <div className="chat-library-pagination px-5 sm:px-7 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0 flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {currentPage} / {totalPages} 페이지 (총 {totalCount}개 질문)
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="첫 페이지로"
              >
                <ChevronsLeft size={14} />
              </button>

              {/* Prev Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="이전 페이지"
              >
                <ChevronLeft size={14} />
              </button>

              {/* Page Numbers */}
              {paginationRange.map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  data-active={currentPage === pageNum}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="다음 페이지"
              >
                <ChevronRight size={14} />
              </button>

              {/* Last Page */}
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="마지막 페이지로"
              >
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence></WorkspacePortal>
  );
};
