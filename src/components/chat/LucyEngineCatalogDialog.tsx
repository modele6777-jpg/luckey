import { useProgressiveLibrary } from '@/hooks/useProgressiveLibrary';
import { defaultLibrarySessionKey, useLibrarySessionState, useLibrarySessionScroll } from '@/hooks/useLibrarySessionState';
import { DialogBackdrop } from '@/components/layout/DialogBackdrop';
// 목록 스타일(chat-library-*)은 같은 번들에 항상 들어가는 PromptLibraryModal이 불러온다.
// (여기서 CSS를 직접 임포트하면 단위 테스트에서 이 모듈을 불러올 수 없다.)
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { useLucyEngineFocusRequest } from '@/hooks/useLucyEngineFocus';
import type { LucyEngineFocusRequest } from '@/lib/lucyTableBus';
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
  /** Kept for callers; the engine box is read-only and no longer suggests prompts. */
  onSelectPrompt?: (text: string, sendImmediately: boolean, toolIds?: string[], title?: string) => void;
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

/** 엔진 목록 본문. 엔진함 창과 점술 도구 창의 "엔진함" 탭이 같이 쓴다. */
function LucyEngineCatalogBody({ isOpen, isLight, sessionKey, deepOnly = false, activeKeys, focus }: {
  isOpen: boolean;
  isLight: boolean;
  sessionKey: string;
  /** 일반 루시 채팅 도구함: 심층 관점(deep_master)만 보여준다. */
  deepOnly?: boolean;
  /** 이번 대화에서 루시가 실제로 골라 쓴 심층 관점 키 — 배지로 구분한다. */
  activeKeys?: readonly string[];
  /** 답변 끝 관점 버튼에서 온 요청: 이 관점 카드로 바로 이동해 강조한다. */
  focus?: LucyEngineFocusRequest | null;
}) {
  const [filter, setFilter] = useLibrarySessionState<CatalogFilter>(`${sessionKey}:filter`, 'all');
  const [themeFilter, setThemeFilter] = useLibrarySessionState<CatalogThemeFilter>(`${sessionKey}:theme`, 'all');
  const [query, setQuery] = useLibrarySessionState<string>(`${sessionKey}:query`, '');
  // 일반 채팅 도구함은 심층 관점만 연다.
  const effectiveFilter: CatalogFilter = deepOnly ? 'deep_master' : filter;
  const activeSet = new Set(activeKeys ?? []);

  const catalog = useMemo(() => selectCatalogEngines({
    category: effectiveFilter,
    theme: themeFilter,
    query,
  }), [effectiveFilter, query, themeFilter]);
  const filteredEngines = catalog.engines;

  const groupedEngines = useMemo(() => LUCY_PRO_CHANNEL_THEMES
    .map(theme => ({
      theme,
      engines: filteredEngines.filter(engine => getEngineCatalogTheme(engine) === theme.id),
    }))
    .filter(group => group.engines.length > 0), [filteredEngines]);

  // 답변 끝 관점 버튼으로 연 경우: 그 관점 카드가 첫 화면부터 DOM에 있어야 스크롤·강조가 된다.
  const groupedOrder = useMemo(
    () => groupedEngines.flatMap(group => group.engines.map(engine => engine.key)),
    [groupedEngines],
  );
  const focusKey = focus?.engineKey ?? '';
  const focusIndex = focusKey ? groupedOrder.indexOf(focusKey) : -1;
  const focusRenderFloor = focusIndex >= 0 ? Math.min(groupedOrder.length, focusIndex + 8) : 0;

  const renderedCount = useProgressiveLibrary(isOpen, filteredEngines.length, `${filter}:${themeFilter}:${query}`, focusRenderFloor);
  const visibleGroups = useMemo(() => {
    let remaining = renderedCount;
    return groupedEngines.map(group => {
      const engines = group.engines.slice(0, remaining);
      remaining = Math.max(0, remaining - engines.length);
      return { ...group, engines, total: group.engines.length };
    }).filter(group => group.engines.length);
  }, [groupedEngines, renderedCount]);
  const scroll = useLibrarySessionScroll(`${sessionKey}:scroll`, isOpen, renderedCount >= filteredEngines.length);
  const listRef = useRef<HTMLDivElement | null>(null);
  const attachListRef = useCallback((node: HTMLDivElement | null) => {
    listRef.current = node;
    scroll.ref(node);
  }, [scroll.ref]);

  // 이전 검색어·필터가 그 관점을 가리고 있으면 먼저 풀어 준다 (요청당 한 번만).
  const appliedFocusRef = useRef('');
  useEffect(() => {
    if (!isOpen || !focusKey) return;
    const token = `${focus?.requestId ?? 0}:${focusKey}`;
    if (appliedFocusRef.current === token) return;
    appliedFocusRef.current = token;
    if (query) setQuery('');
    if (themeFilter !== 'all') setThemeFilter('all');
    if (!deepOnly && filter !== 'all') setFilter('all');
  }, [isOpen, focusKey, focus?.requestId, query, themeFilter, filter, deepOnly, setQuery, setThemeFilter, setFilter]);

  // 요청당 한 번만, 카드가 그려진 뒤 화면 가운데로 부드럽게 이동한다.
  const centeredRef = useRef('');
  useEffect(() => {
    if (!isOpen || !focusKey || focusIndex < 0 || renderedCount <= focusIndex) return;
    const token = `${focus?.requestId ?? 0}:${focusKey}`;
    if (centeredRef.current === token) return;
    centeredRef.current = token;
    const center = () => {
      const root = listRef.current;
      if (!root) return;
      const target = root.querySelector<HTMLElement>(`[data-engine-key="${focusKey}"]`);
      if (!target) return;
      const rootRect = root.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const top = root.scrollTop + (targetRect.top - rootRect.top) - Math.max(12, (rootRect.height - targetRect.height) / 2);
      root.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    };
    const frame = requestAnimationFrame(center);
    const timer = setTimeout(center, 220);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, [isOpen, focusKey, focus?.requestId, focusIndex, renderedCount]);

  const muted = isLight ? 'text-slate-600' : 'text-slate-300';
  const subtleSurface = isLight ? 'bg-amber-50/70 border-amber-200/70' : 'bg-white/[0.045] border-white/10';
  const inactivePill = isLight
    ? 'border border-amber-200 bg-white text-slate-600 hover:bg-amber-50'
    : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10';

  return (
          <div ref={attachListRef} onScroll={scroll.onScroll} data-app-scroll-root="" data-testid="lucy-engine-catalog-list" tabIndex={0}
            aria-label="엔진 목록, 세로로 스크롤할 수 있습니다" className="chat-library-scroll overflow-y-auto" aria-busy={renderedCount < filteredEngines.length}>
            <div className="chat-library-toolbar shrink-0 px-4 py-2.5 sm:px-6">
              <p id="lucy-engine-catalog-intro" className={`text-xs leading-relaxed sm:text-sm ${muted}`}>
                {deepOnly ? (
                  <>
                    <strong className={isLight ? 'text-slate-900' : 'text-white'}>{ENGINE_CATALOG_COUNTS.deep_master}개 심층 관점</strong>의 뜻을 볼 수 있어요. 일반 대화에서는 이 관점들 중 지금 이야기에 맞는 1~2개만 골라 상징 참고로 써요.
                  </>
                ) : (
                  <>
                    <strong className={isLight ? 'text-slate-900' : 'text-white'}>{ENGINE_CATALOG_COUNTS.foundational}개 기초 도구</strong>와{' '}
                    <strong className={isLight ? 'text-slate-900' : 'text-white'}>{ENGINE_CATALOG_COUNTS.deep_master}개 심층 관점</strong>이 등록되어 있어요. 심층 관점은 전통·철학·신화·심리의 참고 렌즈이며, 각각 독립 계산기가 아닙니다.
                  </>
                )}
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

            {/* 엔진함은 목록과 뜻만 보여준다. 엔진은 질문마다 루시가 자동으로 고른다. */}
            <div className="chat-library-toolbar shrink-0 px-4 pt-1 sm:px-6" data-testid="lucy-engine-auto-note">
              <p className={`rounded-xl border px-3 py-2 text-xs font-semibold ${subtleSurface}`}>
                {deepOnly
                  ? '루시가 대화마다 지금 이야기에 맞는 심층 관점만 골라 답해요.'
                  : '루시가 질문마다 알맞은 도구와 관점을 자동으로 골라 답해요.'}
              </p>
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
                {!deepOnly && FILTERS.map(item => {
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
                          const isActive = activeSet.has(engine.key);
                          const isFocused = Boolean(focusKey) && engine.key === focusKey;
                          return (
                            <li
                              key={engine.key}
                              data-testid="lucy-engine-catalog-entry"
                              data-engine-key={engine.key}
                              data-engine-theme={theme.id}
                              data-engine-active={isActive ? 'true' : undefined}
                              data-engine-focus={isFocused ? 'true' : undefined}
                              className={`lucy-engine-catalog-entry rounded-2xl border p-3 sm:p-3.5 ${isFocused
                                ? 'border-amber-400 bg-amber-400/15 ring-2 ring-amber-400'
                                : isActive
                                ? 'border-amber-400/70 bg-amber-400/10'
                                : isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-white/[0.035]'}`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span aria-hidden="true" className="pt-0.5 text-lg">{engine.icon}</span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <h4 className="lucy-engine-catalog-entry-name text-xs font-bold leading-relaxed sm:text-sm">{engine.nameKo}</h4>
                                    {isFocused ? (
                                      <span data-engine-focus-badge className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black text-slate-950">이 답변에서 쓴 관점</span>
                                    ) : isActive && (
                                      <span data-engine-active-badge className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black text-slate-950">이번 대화에서 쓴 관점</span>
                                    )}
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
  );
}

export function LucyEngineCatalogDialog({ isOpen, onClose, isLight, sessionKey = defaultLibrarySessionKey('engine-library') }: LucyEngineCatalogDialogProps) {
  const focus = useLucyEngineFocusRequest(isOpen);
  if (!isOpen) return null;
  const surface = isLight
    ? 'bg-white text-slate-900 border-amber-200/80'
    : 'bg-slate-950 text-slate-100 border-white/10';
  const muted = isLight ? 'text-slate-600' : 'text-slate-300';
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
          // Portaled outside the Lucy shell: keep the global light-theme remaps off a dark catalog.
          data-theme-dark-island={isLight ? undefined : 'true'}
          style={isLight ? undefined : { colorScheme: 'dark' }}
          className={`lucy-engine-catalog-dialog chat-library-dialog flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border shadow-2xl sm:rounded-3xl ${surface}`}
        >
          <header className={`chat-library-heading flex shrink-0 items-center justify-between gap-3 border-b px-4 py-4 sm:px-6 ${isLight ? 'border-amber-100' : 'border-white/10'}`}>
            <div className="flex min-w-0 items-center gap-3">
              <span className="chat-library-heading-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-500">
                <Sparkles size={20} />
              </span>
              <div className="chat-library-heading-copy min-w-0">
                <h2 id="lucy-engine-catalog-title" className="text-base font-black sm:text-lg">Lucy 엔진함</h2>
                <p className={`chat-library-subtitle text-[11px] sm:text-xs ${muted}`}>엔진 이름과 뜻을 볼 수 있어요 · 루시가 질문마다 자동으로 골라요</p>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="엔진 목록 닫기" title="닫기" className={`chat-library-close flex h-11 min-w-[72px] shrink-0 items-center justify-center gap-1.5 rounded-xl border px-2.5 text-xs font-bold transition-colors ${isLight ? 'border-amber-300 bg-amber-50 text-slate-800 hover:bg-amber-100' : 'border-white/20 bg-white/10 text-white hover:bg-white/20'}`}>
              <X size={20} strokeWidth={2.5} />
              <span>닫기</span>
            </button>
          </header>

          <LucyEngineCatalogBody isOpen={isOpen} isLight={isLight} sessionKey={sessionKey} focus={focus} />
        </section>
      </DialogBackdrop>
    </WorkspacePortal>
  );
}

/** 점술 도구 창 / 펼친 화면 왼쪽 테이블의 "📚 엔진함" 탭 내용 (닫기 버튼 없이 탭 안에 들어간다). */
export function LucyEngineCatalogPanel({ sessionKey = defaultLibrarySessionKey('engine-library'), deepOnly = false, activeKeys }: { sessionKey?: string; deepOnly?: boolean; activeKeys?: readonly string[] }) {
  const focus = useLucyEngineFocusRequest(true);
  return (
    <section
      role="region"
      aria-label="Lucy 엔진함"
      data-catalog-theme="dark"
      data-theme-dark-island="true"
      data-lucy-engine-panel
      data-lucy-engine-panel-deep-only={deepOnly ? 'true' : undefined}
      style={{ colorScheme: 'dark' }}
      className="lucy-engine-catalog-dialog lucy-engine-catalog-embedded flex min-h-0 flex-1 flex-col text-slate-100"
    >
      <LucyEngineCatalogBody isOpen isLight={false} sessionKey={sessionKey} deepOnly={deepOnly} activeKeys={activeKeys} focus={focus} />
    </section>
  );
}

/** 💬 일반 루시 채팅 도구함: 엔진함(심층 관점 설명)만 연다. */
export function LucyDeepPerspectivePanel({ sessionKey = defaultLibrarySessionKey('lucy-chat-engine-library'), activeKeys }: { sessionKey?: string; activeKeys?: readonly string[] }) {
  return <LucyEngineCatalogPanel sessionKey={sessionKey} deepOnly activeKeys={activeKeys} />;
}
