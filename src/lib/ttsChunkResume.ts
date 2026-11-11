export interface TTSChunkProgress {
  fullText: string;
  chunkIndex: number;
  totalChunks: number;
  chunks: string[];
  voice: string;
  updatedAt: number;
}

export interface TTSChunkResumeRequest {
  fullText: string;
  chunks: string[];
  voice?: string;
  now?: number;
  maxAgeMs?: number;
}

export function getResumableTTSChunkIndex(
  progress: TTSChunkProgress | null,
  request: TTSChunkResumeRequest,
): number {
  if (!progress || request.chunks.length === 0) return 0;
  const voice = request.voice === 'Charon' ? 'Charon' : 'Aoede';
  const now = request.now ?? Date.now();
  const maxAgeMs = request.maxAgeMs ?? 15 * 60 * 1000;
  const chunksMatch = progress.chunks.length === request.chunks.length &&
    progress.chunks.every((chunk, index) => chunk === request.chunks[index]);
  if (
    progress.fullText !== request.fullText ||
    progress.voice !== voice ||
    progress.totalChunks !== request.chunks.length ||
    !chunksMatch ||
    progress.chunkIndex <= 0 ||
    progress.chunkIndex >= request.chunks.length ||
    now < progress.updatedAt ||
    now - progress.updatedAt >= maxAgeMs
  ) return 0;
  return progress.chunkIndex;
}
