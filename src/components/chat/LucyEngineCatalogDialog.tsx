import { useProgressiveLibrary } from '@/hooks/useProgressiveLibrary';
import { defaultLibrarySessionKey, useLibrarySessionState, useLibrarySessionScroll } from '@/hooks/useLibrarySessionState';
import { DialogBackdrop } from '@/components/layout/DialogBackdrop';
import './chat-library-layout.css';
import React, { useMemo } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { WorkspacePortal } from '@/components/layout/DuoWorkspace';
import {
  ENGINE_CATALOG_COUNTS,
  type EngineCatalogCategoryFilter,
  type EngineCatalogThemeFilter,
  getEngineCatalogMeaning,
  getEngineCatalogTheme,
  LUCY_PRO_CATALOG_ENGINES,
  LUCY_PRO_CHANNEL_THEMES,
  selectCatalogEngines,
} from '@/lib/divination/engineCatalog';

interface LucyEngineCatalogDialogProps {
  isOpen: boolean;
  sessionKey?: string;
  onClose: () => void;
  isLight: boolean;
}

type CatalogFilter = EngineCatalogCategoryFilter;
type CatalogThemeFilter = EngineCatalogThemeFilter;

const FILTERS: { id: CatalogFilter; label: string }[] = [
  { id: 'all', label: '전체 목록' },
  { id: 'foundational', label: '기초 도구' },
  { id: 'deep_master', label: '심층 관점' },
];

export function LucyEngineCatalogDialog({ isOpen, onClose, isLight, sessionKey = defaultLibrarySessionKey('engine-library') }: LucyEngineCatalogDialogProps) {
  const [filter, setFilter] = useLibrarySessionState<CatalogFilter>(`${sessionKey}:filter`, 'all');
  const [themeFilter, setThemeFilter] = useLibrarySessionState<CatalogThemeFilter>(`${sessionKey}:theme`, 'all');
  const [query, setQuery] = useLibrarySessionState<string>(`${sessionKey}:query`, '');

  const catalog = useMemo(() => selectCatalogEngines({
    category: filter,
    theme: themeFilter,
    query,
  }), [filter, query, themeFilter]);
  const filteredEngines = catalog.engines;

  const groupedEngines = useMemo(() => LUCY_PRO_CHANNEL_THEMES
    .map(theme => ({
      theme,
      engines: filteredEngines.filter(engine => getEngineCatalogTheme(engine) === theme.id),
    }))
    .filter(group => group.engines.length > 0), [filteredEngines]);

  const renderedCount = useProgressiveLibrary(isOpen, filteredEngines.length, `${filter}:${themeFilter}:${query}`);
  const visibleGroups = useMemo(() => {
    let remaining = renderedCount;
    return groupedEngines.map(group => {
      const engines = group.engines.slice(0, remaining);
      remaining = Math.max(0, remaining - engines.length);
      return { ...group, engines, total: group.engines.length };
    }).filter(group => group.engines.length);
  }, [groupedEngines, renderedCount]);
  const scroll = useLibrarySessionScroll(`${sessionKey}:scroll`, isOpen, renderedCount >= filteredEngines.length);

  if (!isOpen) return null;

  const surface = isLight
    ? 'bg-white text-slate-900 border-amber-200/80'
    : 'bg-slate-950 text-slate-100 border-white/10';
  const muted = isLight ? 'text-slate-600' : 'text-slate-300';
  const subtleSurface = isLight ? 'bg-amber-50/70 border-amber-200/70' : 'bg-white/[0.045] border-white/10';
  const inactivePill = isLight
    ? 'border border-amber-200 bg-white text-slate-600 hover:bg-amber-50'
    : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10';

  return (
    <WorkspacePortal onClose={onClose}>
      <DialogBackdrop
        className="fixed inset-0 z-[10050] flex items-center justify-center bg-slate-950/75 p-2 backdrop-blur-md sm:p-5"
        onDismiss={onClose}
      >
        <section
          id="lucy-engine-catalog-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lucy-engine-catalog-title"
          aria-describedby="lucy-engine-catalog-intro"
          onClick={event => event.stopPropagation()}
          data-catalog-theme={isLight ? 'light' : 'dark'}
          className={`lucy-engine-catalog-dialog chat-library-dialog flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border shadow-2xl sm:rounded-3xl ${surface}`}
        >
          <header className={`chat-library-heading flex shrink-0 items-center justify-between gap-3 border-b px-4 py-4 sm:px-6 ${isLight ? 'border-amber-100' : 'border-white/10'}`}>
            <div className="flex min-w-0 items-center gap-3">
              <span className="chat-library-heading-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-500">
                <Sparkles size={20} />
              </span>
              <div className="chat-library-heading-copy min-w-0">
                <h2 id="lucy-engine-catalog-title" className="text-base font-black sm:text-lg">Lucy 엔진·관점 안내</h2>
                <p className={`chat-library-subtitle text-[11px] sm:text-xs ${muted}`}>등록 목록 {LUCY_PRO_CATALOG_ENGINES.length}개 · 질문별 실행 여부와는 별개예요</p>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="엔진 목록 닫기" title="닫기" className={`chat-library-close flex h-11 min-w-[72px] shrink-0 items-center justify-center gap-1.5 rounded-xl border px-2.5 text-xs font-bold transition-colors ${isLight ? 'border-amber-300 bg-amber-50 text-slate-800 hover:bg-amber-100' : 'border-white/20 bg-white/10 text-white hover:bg-white/20'}`}>
              <X size={20} strokeWidth={2.5} />
              <span>닫기</span>
            </button>
          </header>

          <div ref={scroll.ref} onScroll={scroll.onScroll} data-app-scroll-root="" data-testid="lucy-engine-catalog-list" tabIndex={0}
            aria-label="엔진 목록, 세로로 스크롤할 수 있습니다" className="chat-library-scroll overflow-y-auto" aria-busy={renderedCount < filteredEngines.length}>
            <div className="chat-library-toolbar shrink-0 px-4 py-2.5 sm:px-6">
              <p id="lucy-engine-catalog-intro" className={`text-xs leading-relaxed sm:text-sm ${muted}`}>
                <strong className={isLight ? 'text-slate-900' : 'text-white'}>{ENGINE_CATALOG_COUNTS.foundational}개 기초 도구</strong>와{' '}
                <strong className={isLight ? 'text-slate-900' : 'text-white'}>{ENGINE_CATALOG_COUNTS.deep_master}개 심층 관점</strong>이 등록되어 있어요. 심층 관점은 전통·철학·신화·심리의 참고 렌즈이며, 각각 독립 계산기가 아닙니다.
              </p>
              <details className={`mt-2 rounded-xl border px-3 py-2 ${subtleSurface}`}>
                <summary className={`cursor-pointer select-none text-[11px] font-semibold sm:text-xs ${muted}`}>관점 뜻과 답변별 상태 안내</summary>
                <div className={`space-y-2 py-2 text-[11px] leading-relaxed sm:text-xs ${muted}`}>
                  <p><strong className={isLight ? 'text-slate-900' : 'text-white'}>기초 도구:</strong> 사주·점성술·주역 등 등록된 계산 범위예요. 실제 결과는 질문·입력·실행 상태에 따라 달라져요.</p>
                  <p><strong className={isLight ? 'text-slate-900' : 'text-white'}>심층 관점:</strong> 전통·철학·신화·심리의 주제를 빌린 참고용 해석 렌즈예요. 전부 실행되거나 수치 계산되는 것은 아니에요.</p>
                  <p>답변별 상태에서 <b>계산 완료</b>는 실제 산출 결과, <b>상징 참고</b>는 정성적 해석, <b>부분 계산·미실행·미지원·오류</b>는 각기 제한·미선택/입력 부족·아직 구현되지 않음·산출 실패를 뜻합니다. 답변 기록에 없는 항목은 사용됐다고 확인할 수 없습니다.</p>
                  <p>새 엔진도 뜻과 주제를 바탕으로 알맞은 채널 테마에 자동 분류돼요.</p>
                </div>
              </details>
            </div>

            <div className="chat-library-toolbar shrink-0 space-y-2 px-4 py-3 sm:px-6">
              <div className={`relative flex items-center rounded-2xl border ${isLight ? 'border-amber-200 bg-white' : 'border-white/10 bg-white/[0.04]'}`}>
                <Search size={16} className={`absolute left-3.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="search"
                  value={query}
                  onChange={event => { scroll.reset(); setQuery(event.target.value); }}
                  placeholder="이름이나 주제 검색"
                  aria-label="엔진과 관점 검색"
                  className={`w-full rounded-2xl bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none ${isLight ? 'placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400/30' : 'placeholder:text-slate-500 focus:ring-2 focus:ring-amber-400/20'}`}
                />
              </div>
              <nav aria-label="엔진 목록 분류" className="chat-library-filters flex flex-wrap gap-2 pb-0.5">
                {FILTERS.map(item => {
                  const count = catalog.counts.categories[item.id];
                  const selected = filter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { scroll.reset(); setFilter(item.id); }}
                      aria-pressed={selected}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${selected ? 'bg-amber-400 text-slate-950' : inactivePill}`}
                    >
                      {item.label} {count}
                    </button>
                  );
                })}
                <span className={`ml-auto shrink-0 self-center text-[11px] ${muted}`}>{filteredEngines.length}개 표시</span>
              </nav>
              <nav aria-label="Lucy 7개 채널 테마" className="chat-library-filters flex flex-wrap gap-2 pb-0.5">
                <button
                  type="button"
                  onClick={() => { scroll.reset(); setThemeFilter('all'); }}
                  aria-pressed={themeFilter === 'all'}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${themeFilter === 'all' ? 'bg-amber-400 text-slate-950' : inactivePill}`}
                >
                  모든 테마 {catalog.counts.themes.all}
                </button>
                {LUCY_PRO_CHANNEL_THEMES.map(theme => {
                  const selected = themeFilter === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => { scroll.reset(); setThemeFilter(theme.id); }}
                      aria-pressed={selected}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${selected ? 'bg-amber-400 text-slate-950' : inactivePill}`}
                    >
                      {theme.label} {catalog.counts.themes[theme.id]}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="px-4 pb-4 sm:px-6">
              {filteredEngines.length > 0 && renderedCount === 0 ? (
                <p role="status" className={`px-4 py-8 text-sm ${muted}`}>엔진 목록을 준비하고 있어요…</p>
              ) : groupedEngines.length ? (
                <div className="space-y-5">
                  {visibleGroups.map(({ theme, engines, total }) => (
                    <section key={theme.id} data-testid={`lucy-engine-theme-${theme.id}`} aria-label={`${theme.label} 테마`}>
                      <header className={`mb-2 rounded-xl border px-3 py-2 ${subtleSurface}`}>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="lucy-engine-catalog-theme-name text-sm font-black">{theme.label}</h3>
                          <span className={`lucy-engine-catalog-theme-count text-[11px] font-bold ${muted}`}>{total}개</span>
                        </div>
                        <p className={`lucy-engine-catalog-theme-description mt-0.5 text-[10px] sm:text-[11px] ${muted}`}>{theme.description}</p>
                      </header>
                      <ul className="space-y-2">
                        {engines.map(engine => {
                          const isFoundational = engine.category === 'foundational';
                          return (
                            <li
                              key={engine.key}
                              data-testid="lucy-engine-catalog-entry"
                              data-engine-key={engine.key}
                              data-engine-theme={theme.id}
                              className={`lucy-engine-catalog-entry rounded-2xl border p-3 sm:p-3.5 ${isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-white/[0.035]'}`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span aria-hidden="true" className="pt-0.5 text-lg">{engine.icon}</span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <h4 className="lucy-engine-catalog-entry-name text-xs font-bold leading-relaxed sm:text-sm">{engine.nameKo}</h4>
                                    <span data-engine-category={engine.category} className={`lucy-engine-catalog-entry-category rounded-full px-2 py-0.5 text-[9px] font-bold ${isFoundational ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300' : 'bg-violet-500/15 text-violet-700 dark:text-violet-300'}`}>
                                      {isFoundational ? '기초 도구' : '심층 참고 관점'}
                                    </span>
                                    <span className="lucy-engine-catalog-entry-theme rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-800 dark:text-amber-300">
                                      테마: {theme.label}
                                    </span>
                                  </div>
                                  <p className={`lucy-engine-catalog-entry-meaning mt-1.5 text-[11px] leading-relaxed sm:text-xs ${muted}`}>
                                    {getEngineCatalogMeaning(engine)}
                                  </p>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))}
                </div>
              ) : (
                <div className={`rounded-2xl border border-dashed p-8 text-center text-sm ${muted} ${isLight ? 'border-amber-200' : 'border-white/15'}`}>
                  검색 결과가 없어요. 다른 이름이나 주제로 찾아보세요.
                </div>
              )}
            </div>
          </div>
        </section>
      </DialogBackdrop>
    </WorkspacePortal>
  );
}
