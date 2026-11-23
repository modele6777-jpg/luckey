/**
 * 📖 해석 사전 목록: 엔진함 '해석 사전' 화면에서 사람이 직접 읽고 확인하는 카드 묶음.
 * 루시에게 가는 카드와 같은 데이터를 쓴다 (화면과 프롬프트의 내용이 갈라지지 않는다).
 */
import { ICHING_CARDS } from './ichingCards';
import { SUKUYO_RELATION_CARDS, SUKUYO_TYPE_CARDS } from './sukuyoCards';
import { KYUSEI_STAR_CARDS, LIUREN_GENERAL_CARDS, QIMEN_GATE_CARDS, ZIWEI_MUTAGEN_CARDS, ZIWEI_STAR_CARDS } from './moreCards';

export interface DictionaryEntry { title: string; subtitle?: string; core: string; use: string; caution: string }
export interface DictionaryGroup { id: string; icon: string; title: string; source: string; entries: DictionaryEntry[] }

export const KNOWLEDGE_DICTIONARY: readonly DictionaryGroup[] = [
  {
    id: 'iching', icon: '☯', title: '주역 64괘', source: '『주역』 경문 괘사 (문왕 서열)',
    entries: ICHING_CARDS.map(c => ({ title: `${c.number}. ${c.name} ${c.hanja}`, subtitle: `괘사 「${c.judgment}」`, core: c.core, use: c.use, caution: c.caution })),
  },
  {
    id: 'sukuyo', icon: '🌙', title: '숙요 7숙격 · 6관계', source: '『숙요경』 7종 분류 · 삼구법 관계',
    entries: [
      ...SUKUYO_TYPE_CARDS.map(c => ({ title: `${c.key}숙 ${c.hanja}`, subtitle: `동료 숙: ${c.members}`, core: c.core, use: c.use, caution: c.caution })),
      ...SUKUYO_RELATION_CARDS.map(c => ({ title: `관계 · ${c.key} ${c.hanja}`, core: c.core, use: c.use, caution: c.caution })),
    ],
  },
  {
    id: 'ziwei', icon: '✴', title: '자미두수 14주성 · 사화', source: '자미두수 통용 성정',
    entries: [
      ...ZIWEI_STAR_CARDS.map(c => ({ title: `${c.key} ${c.hanja}`, core: c.core, use: c.use, caution: c.caution })),
      ...ZIWEI_MUTAGEN_CARDS.map(c => ({ title: `사화 · ${c.hanja}`, core: c.core, use: c.use, caution: c.caution })),
    ],
  },
  {
    id: 'kyusei', icon: '⑨', title: '구성학 9성', source: '구성기학 통용 성정',
    entries: KYUSEI_STAR_CARDS.map(c => ({ title: c.hanja, core: c.core, use: c.use, caution: c.caution })),
  },
  {
    id: 'liuren', icon: '⚔', title: '육임 12천장', source: '대육임 통용 천장 성정',
    entries: LIUREN_GENERAL_CARDS.map(c => ({ title: `${c.key} ${c.hanja}`, core: c.core, use: c.use, caution: c.caution })),
  },
  {
    id: 'qimen', icon: '🚪', title: '기문 팔문', source: '기문둔갑 통용 팔문 길흉',
    entries: QIMEN_GATE_CARDS.map(c => ({ title: `${c.hanja} ${c.key}`, core: c.core, use: c.use, caution: c.caution })),
  },
];

export function searchKnowledgeDictionary(query: string): DictionaryGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...KNOWLEDGE_DICTIONARY];
  return KNOWLEDGE_DICTIONARY
    .map(group => ({
      ...group,
      entries: group.title.toLowerCase().includes(q)
        ? group.entries
        : group.entries.filter(e => [e.title, e.subtitle, e.core, e.use, e.caution].some(text => text?.toLowerCase().includes(q))),
    }))
    .filter(group => group.entries.length > 0);
}

export const KNOWLEDGE_DICTIONARY_COUNT = KNOWLEDGE_DICTIONARY.reduce((sum, group) => sum + group.entries.length, 0);
