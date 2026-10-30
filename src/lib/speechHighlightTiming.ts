export interface SpeechProgress {
  elapsed: number;
  duration: number;
  paused: boolean;
}

/** Providers return audio without alignment. Allocate sentence boundaries within
 * its measured duration; never count request latency or paused wall time. */
export function sentenceIndexAtProgress(sentences: string[], progress: SpeechProgress): number {
  if (!sentences.length || !Number.isFinite(progress.elapsed) || !Number.isFinite(progress.duration) || progress.duration <= 0) return -1;
  const weights = sentences.map(sentence => Math.max(1,
    sentence.replace(/\s/g, '').length + (sentence.match(/[,，;；:：]/g)?.length || 0) * 2 + 4,
  ));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const position = Math.max(0, Math.min(1, progress.elapsed / progress.duration)) * total;
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
