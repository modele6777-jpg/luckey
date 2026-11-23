import React, { useMemo } from 'react';
import { searchKnowledgeDictionary } from '@/lib/divination/knowledge/catalog';

/** 📖 해석 사전: 루시가 상담에 쓰는 카드를 사람이 직접 읽고 확인하는 목록. */
export function KnowledgeDictionaryView({ query, isLight }: { query: string; isLight: boolean }) {
  const groups = useMemo(() => searchKnowledgeDictionary(query), [query]);
  const muted = isLight ? 'text-slate-600' : 'text-slate-300';
  const card = isLight ? 'border-amber-200/70 bg-white' : 'border-white/10 bg-white/[0.04]';
  if (!groups.length) {
    return <div className={`rounded-2xl border border-dashed p-8 text-center text-sm ${muted} ${isLight ? 'border-amber-200' : 'border-white/15'}`}>사전에서 찾지 못했어요. 다른 말로 찾아보세요.</div>;
  }
  return (
    <div className="space-y-5" data-testid="knowledge-dictionary">
      <p className={`text-xs leading-relaxed ${muted}`}>
        상담할 때 루시는 이번 계산에서 나온 항목의 카드만 함께 봐요. 카드는 전통적인 뜻을 짧게 정리한 상징적 참고예요.
      </p>
      {groups.map(group => (
        <section key={group.id} aria-label={group.title}>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-black">{group.icon} {group.title}</h3>
            <span className={`text-[10px] ${muted}`}>{group.source} · {group.entries.length}장</span>
          </div>
          <ul className="space-y-2">
            {group.entries.map(entry => (
              <li key={entry.title} className={`rounded-xl border px-3 py-2.5 ${card}`}>
                <p className="text-xs font-bold sm:text-sm">{entry.title}</p>
                {entry.subtitle && <p className={`mt-0.5 text-[11px] ${muted}`}>{entry.subtitle}</p>}
                <p className="mt-1 text-xs leading-relaxed">{entry.core}</p>
                <p className={`mt-1 text-[11px] leading-relaxed ${muted}`}>👍 {entry.use} · ⚠️ {entry.caution}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
