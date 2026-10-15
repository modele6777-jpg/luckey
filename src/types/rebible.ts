export type SacredAtmosphere = 'sanctuary' | 'parchment' | 'candlelight';

export type CanonicalReBibleBook = 
  | '지혜의 서' 
  | '성찰의 서' 
  | '운명의 서' 
  | '치유의 서' 
  | '정화의 서' 
  | '영감의 서' 
  | '각성의 서';

export const REBIBLE_CANONICAL_BOOKS: CanonicalReBibleBook[] = [
  '지혜의 서',
  '성찰의 서',
  '운명의 서',
  '치유의 서',
  '정화의 서',
  '영감의 서',
  '각성의 서'
];

export interface ReBibleAnnotation {
  id: string;
  verseId: string;
  writtenAt: string; // ISO date string
  timeHorizon: string; // e.g. "오늘의 시선", "3개월 후의 성찰", "1년 후의 깨달음"
  content: string; // The reinterpretation / new insight
  shiftSummary?: string; // Optional short summary of how understanding shifted
}

export interface ReBibleVerse {
  id: string;
  userId?: string;
  bookTitle: string; // e.g. "운명의 서", "정화의 서", "치유의 서", "성찰의 서", "영감의 서", "지혜의 서", "각성의 서"
  chapterNumber: number;
  verseNumber: number;
  reference: string; // e.g. "운명의 서 1:1"
  title: string; // Narrative Theme Title
  fact: string; // 사건(Fact): 현실의 객관적 상황, 고통, 경험
  insight: string; // 깨달음(Insight): 지혜의 눈으로 치환한 영적 원칙과 통찰
  emotions: string[]; // e.g. ["불안", "수용", "용기", "감사", "자유"]
  tags: string[]; // e.g. ["관계", "커리어", "자아성찰", "영성", "창작"]
  annotations: ReBibleAnnotation[]; // Array of annotations added over time
  isSacredFavorite: boolean;
  isFinalized?: boolean; // true if sealed at midnight 12:00 AM (자정 영구 확정 경전)
  finalizedAt?: string; // ISO date string of midnight finalization
  recordedAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ReBibleBookSummary {
  title: string;
  verseCount: number;
  annotationCount: number;
  lastRecordedAt: string;
}

export interface ReBibleStats {
  totalVerses: number;
  totalAnnotations: number;
  favoriteCount: number;
  topEmotions: { emotion: string; count: number }[];
  topTags: { tag: string; count: number }[];
  transmutationRatio: number; // e.g. 100% of facts converted to insights
}
