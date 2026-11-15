export interface SpeechProgress {
  elapsed: number;
  duration: number;
  paused: boolean;
}

/**
 * Audio time a sentence of the reading really takes.
 * Providers return audio without alignment, so sentence boundaries are
 * allocated inside the measured duration by weight. Characters carry the bulk
 * of it, but pauses and spoken-out numbers are real audio time too: a sentence
 * ending a thought pauses longer than one that is cut by a comma, and a number
 * such as 2026 is read as several syllables while it is four glyphs on screen.
 */
export function sentenceWeight(sentence: string): number {
  const text = String(sentence || '').trim();
  if (!text) return 1;

  const spokenCharacters = text.replace(/\s/g, '').length;
  const clauses = (text.match(/[,，;；:：]/g) || []).length;
  const numericRuns: string[] = text.match(/\d+(?:[.,]\d+)*/g) || [];
  const numericSyllables = numericRuns
    .reduce((sum, run) => sum + run.replace(/\D/g, '').length * 1.5, 0);
  const endsThought = /[.!?。！？…]["'”’)\]]*$/.test(text);

  return Math.max(1, spokenCharacters + clauses * 1.5 + numericSyllables + (endsThought ? 4 : 1.5));
}

/** Published a beat before the exact boundary so the drawn underline lands with the voice. */
const HIGHLIGHT_LEAD_SECONDS = 0.12;

export function sentenceIndexAtProgress(sentences: string[], progress: SpeechProgress): number {
  if (!sentences.length || !Number.isFinite(progress.elapsed) || !Number.isFinite(progress.duration) || progress.duration <= 0) return -1;
  const weights = sentences.map(sentenceWeight);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const elapsed = Math.max(0, progress.elapsed + HIGHLIGHT_LEAD_SECONDS);
  const position = Math.max(0, Math.min(1, elapsed / progress.duration)) * total;
  let boundary = 0;
  for (let index = 0; index < weights.length - 1; index++) {
    boundary += weights[index];
    if (position < boundary) return index;
  }
  return weights.length - 1;
}

export function trackSpeechHighlight(
  sentences: string[],
  readProgress: () => SpeechProgress | null,
  isCurrent: () => boolean,
  publish: (sentence: string) => void,
): () => void {
  let lastIndex = -1;
  const timer = setInterval(() => {
    if (!isCurrent()) { clearInterval(timer); return; }
    const progress = readProgress();
    if (!progress || progress.paused) return;
    const index = sentenceIndexAtProgress(sentences, progress);
    if (index >= 0 && index !== lastIndex) {
      lastIndex = index;
      publish(sentences[index]);
    }
  }, 80);
  return () => clearInterval(timer);
}
