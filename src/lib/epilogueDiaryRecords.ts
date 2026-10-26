import type { EpilogueDiaryEntry } from '@/components/epilogue/EpilogueDiaryView';

const text = (value: unknown) => typeof value === 'string' ? value : '';

/** Read old and partially synced records without changing the stored source. */
export function normalizeEpilogueDiaryEntries(value: unknown): EpilogueDiaryEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw, index) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return [];
    const createdAt = typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : 0;
    const date = new Date(createdAt);
    const inferredDate = createdAt > 0 && Number.isFinite(date.getTime())
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';
    const dateKey = text(raw.dateKey) || text(raw.date).slice(0, 10) || inferredDate;
    const gratitudes = Array.isArray(raw.gratitudes)
      ? raw.gratitudes.filter((item: unknown): item is string => typeof item === 'string')
      : typeof raw.gratitudes === 'string' ? [raw.gratitudes] : [];
    return [{
      ...raw,
      id: text(raw.id) || `legacy-diary-${dateKey || index}`,
      dateKey,
      createdAt,
      mood: text(raw.mood) || '평온함',
      moodEmoji: text(raw.moodEmoji) || '😌',
      gratitudes,
      rawNotes: text(raw.rawNotes),
      mindDiary: text(raw.mindDiary) || text(raw.reflection),
      reflection: text(raw.reflection),
      aiFeedback: text(raw.aiFeedback),
      anchor: text(raw.anchor),
    }];
  });
}
