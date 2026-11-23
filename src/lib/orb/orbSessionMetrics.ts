export type OrbLivePrices = {
  inputText: number;
  inputAudio: number;
  outputText: number;
  outputAudio: number;
};

type TokenSplit = { text: number; audio: number; other: number };

const count = (value: unknown): number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0;

function split(details: unknown, total: number): TokenSplit {
  const result = { text: 0, audio: 0, other: 0 };
  if (Array.isArray(details)) {
    for (const item of details) {
      const modality = String(item?.modality || '').toLowerCase();
      if (modality === 'audio') result.audio += count(item.tokenCount ?? item.token_count);
      if (modality === 'text') result.text += count(item.tokenCount ?? item.token_count);
    }
  }
  result.other = Math.abs(total - result.text - result.audio);
  return result;
}

export function parseOrbLivePrices(raw: unknown): OrbLivePrices | null {
  if (!raw || typeof raw !== 'object') return null;
  const fields = ['inputText', 'inputAudio', 'outputText', 'outputAudio'] as const;
  const values = raw as Record<string, unknown>;
  if (fields.some(field => typeof values[field] !== 'number' || !Number.isFinite(values[field]) || Number(values[field]) < 0)) return null;
  return { inputText: Number(values.inputText), inputAudio: Number(values.inputAudio), outputText: Number(values.outputText), outputAudio: Number(values.outputAudio) };
}

export function createOrbSessionMetrics(now = () => performance.now()) {
  const startedAt = now();
  let endedAt: number | null = null;
  let pending: { at: number; source: 'text' | 'hold' | 'realtime' } | null = null;
  let input = 0;
  let output = 0;
  let total = 0;
  let reports = 0;
  let estimate = 0;
  let unpricedReports = 0;
  let latencySum = 0;
  let lastLatency: number | null = null;
  let responses = 0;
  let model = '';
  let prices: OrbLivePrices | null = null;

  return {
    setConnection(name: string, nextPrices: OrbLivePrices | null) {
      pending = null;
      model = name;
      prices = nextPrices;
    },
    startTurn(source: 'text' | 'hold' | 'realtime') {
      if (source === 'realtime' && pending && pending.source !== 'realtime') return;
      pending = { source, at: now() };
    },
    dropPending() { pending = null; },
    responseAudio(scheduledDelayMs: number) {
      if (!pending) return;
      lastLatency = Math.max(0, now() + scheduledDelayMs - pending.at);
      latencySum += lastLatency;
      responses += 1;
      pending = null;
    },
    recordUsage(raw: unknown) {
      if (!raw || typeof raw !== 'object') return;
      const meta = raw as Record<string, unknown>;
      const inputCount = count(meta.promptTokenCount ?? meta.prompt_token_count);
      const outputCount = count(meta.responseTokenCount ?? meta.response_token_count ?? meta.candidatesTokenCount);
      const totalCount = count(meta.totalTokenCount ?? meta.total_token_count);
      if (!inputCount && !outputCount && !totalCount) return;
      reports += 1;
      input += inputCount;
      output += outputCount;
      total += totalCount || inputCount + outputCount;
      const sent = split(meta.promptTokensDetails ?? meta.prompt_tokens_details, inputCount);
      const received = split(meta.responseTokensDetails ?? meta.response_tokens_details ?? meta.candidatesTokensDetails, outputCount);
      if (!prices || sent.other || received.other || (totalCount && totalCount !== inputCount + outputCount)) {
        unpricedReports += 1;
        return;
      }
      estimate += (sent.text * prices.inputText + sent.audio * prices.inputAudio + received.text * prices.outputText + received.audio * prices.outputAudio) / 1_000_000;
    },
    finish() { endedAt ??= now(); pending = null; },
    snapshot() {
      return {
        durationMs: Math.max(0, (endedAt ?? now()) - startedAt),
        model, input, output, total, reports,
        estimatedUsd: reports && !unpricedReports ? estimate : null,
        lastLatencyMs: lastLatency,
        averageLatencyMs: responses ? latencySum / responses : null,
        responses,
      };
    },
  };
}

export type OrbSessionMetrics = ReturnType<typeof createOrbSessionMetrics>;
