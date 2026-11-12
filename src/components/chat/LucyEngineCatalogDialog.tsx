import React, { useEffect, useMemo, useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { ALL_DCE_ENGINES, type DceEngineMeta } from '@/lib/divination/deterministicEngine';
import { ENGINE_CATALOG_COUNTS, getEngineCatalogMeaning } from '@/lib/divination/engineCatalog';

interface LucyEngineCatalogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isLight: boolean;
}

type CatalogFilter = 'all' | 'foundational' | 'deep_master';

const FILTERS: { id: CatalogFilter; label: string }[] = [
  { id: 'all', label: '전체 목록' },
  { id: 'foundational', label: '기초 도구' },
  { id: 'deep_master', label: '심층 관점' },
];

function matchesFilter(engine: DceEngineMeta, filter: CatalogFilter) {
  return filter === 'all' || engine.category === filter;
}

export function LucyEngineCatalogDialog({ isOpen, onClose, isLight }: LucyEngineCatalogDialogProps) {
  const [filter, setFilter] = useState<CatalogFilter>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const filteredEngines = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return ALL_DCE_ENGINES.filter(engine => {
      if (!matchesFilter(engine, filter)) return false;
      if (!normalizedQuery) return true;
      return [engine.nameKo, engine.key, engine.summary ?? '', getEngineCatalogMeaning(engine)]
        .some(value => value.toLocaleLowerCase().includes(normalizedQuery));
    });
  }, [filter, query]);

  if (!isOpen) return null;

  const surface = isLight
    ? 'bg-white text-slate-900 border-amber-200/80'
    : 'bg-slate-950 text-slate-100 border-white/10';
  const muted = isLight ? 'text-slate-600' : 'text-slate-300';
  const subtleSurface = isLight ? 'bg-amber-50/70 border-amber-200/70' : 'bg-white/[0.045] border-white/10';

  return (
    <ScreenPortal>
        <div
          className="fixed inset-0 z-[10050] flex items-center justify-center bg-slate-950/75 p-2 backdrop-blur-md sm:p-5"
          onClick={onClose}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="lucy-engine-catalog-title"
            aria-describedby="lucy-engine-catalog-intro"
            onClick={event => event.stopPropagation()}
            style={{ height: 'calc(var(--app-height, 100dvh) - 1rem)', maxHeight: 'calc(var(--app-height, 100dvh) - 1rem)' }}
            className={`flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border shadow-2xl sm:rounded-3xl ${surface}`}
          >
            <header className={`flex shrink-0 items-center justify-between gap-3 border-b px-4 py-4 sm:px-6 ${isLight ? 'border-amber-100' : 'border-white/10'}`}>
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-500">
                  <Sparkles size={20} />
                </span>
                <div className="min-w-0">
                  <h2 id="lucy-engine-catalog-title" className="text-base font-black sm:text-lg">Lucy Pro 엔진·관점 안내</h2>
                  <p className={`text-[11px] sm:text-xs ${muted}`}>등록 목록 {ALL_DCE_ENGINES.length}개 · 질문별 실행 여부와는 별개예요</p>
                </div>
              </div>
              <button type="button" onClick={onClose} aria-label="엔진 목록 닫기" title="닫기" className={`flex h-11 min-w-[72px] shrink-0 items-center justify-center gap-1.5 rounded-xl border px-2.5 text-xs font-bold transition-colors ${isLight ? 'border-amber-300 bg-amber-50 text-slate-800 hover:bg-amber-100' : 'border-white/20 bg-white/10 text-white hover:bg-white/20'}`}>
                <X size={20} strokeWidth={2.5} />
                <span>닫기</span>
              </button>
            </header>

            <div className="shrink-0 border-b border-inherit px-4 py-2.5 sm:px-6">
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
                </div>
              </details>
            </div>

            <div className="shrink-0 space-y-3 px-4 py-3 sm:px-6">
              <div className={`relative flex items-center rounded-2xl border ${isLight ? 'border-amber-200 bg-white' : 'border-white/10 bg-white/[0.04]'}`}>
                <Search size={16} className={`absolute left-3.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="이름이나 주제 검색"
                  aria-label="엔진과 관점 검색"
                  className={`w-full rounded-2xl bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none ${isLight ? 'placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400/30' : 'placeholder:text-slate-500 focus:ring-2 focus:ring-amber-400/20'}`}
                />
              </div>
              <nav aria-label="엔진 목록 분류" className="flex gap-2 overflow-x-auto pb-0.5">
                {FILTERS.map(item => {
                  const count = item.id === 'all' ? ALL_DCE_ENGINES.length : ENGINE_CATALOG_COUNTS[item.id];
                  const selected = filter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilter(item.id)}
                      aria-pressed={selected}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${selected ? 'bg-amber-400 text-slate-950' : isLight ? 'border border-amber-200 bg-white text-slate-600 hover:bg-amber-50' : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10'}`}
                    >
                      {item.label} {count}
                    </button>
                  );
                })}
                <span className={`ml-auto shrink-0 self-center text-[11px] ${muted}`}>{filteredEngines.length}개 표시</span>
              </nav>
            </div>

            <div
              data-app-scroll-root=""
              data-testid="lucy-engine-catalog-list"
              tabIndex={0}
              aria-label="엔진 목록, 세로로 스크롤할 수 있습니다"
              style={{ touchAction: 'pan-y' }}
              className={`min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y px-4 pb-4 sm:px-6 ${isLight ? 'scrollbar-thin' : ''}`}
            >
              {filteredEngines.length ? (
                <ul className="space-y-2">
                  {filteredEngines.map(engine => {
                    const isFoundational = engine.category === 'foundational';
                    return (
                      <li key={engine.key} className={`rounded-2xl border p-3 sm:p-3.5 ${isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-white/[0.035]'}`}>
                        <div className="flex items-start gap-2.5">
                          <span aria-hidden="true" className="pt-0.5 text-lg">{engine.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h3 className="text-xs font-bold leading-relaxed sm:text-sm">{engine.nameKo}</h3>
                              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${isFoundational ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300' : 'bg-violet-500/15 text-violet-700 dark:text-violet-300'}`}>
                                {isFoundational ? '기초 도구' : '심층 참고 관점'}
                              </span>
                            </div>
                            <p className={`mt-1.5 text-[11px] leading-relaxed sm:text-xs ${muted}`}>{getEngineCatalogMeaning(engine)}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className={`rounded-2xl border border-dashed p-8 text-center text-sm ${muted} ${isLight ? 'border-amber-200' : 'border-white/15'}`}>
                  검색 결과가 없어요. 다른 이름이나 주제로 찾아보세요.
                </div>
              )}
            </div>
          </section>
        </div>
    </ScreenPortal>
  );
}
