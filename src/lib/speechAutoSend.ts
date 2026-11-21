/**
 * 🎙️ 말이 끝나면 자동으로 보내기 (시리처럼).
 *
 * 브라우저 음성 인식(SpeechRecognition)은 기기마다 결과를 다르게 보낸다.
 * - iOS Safari는 조용할 때도 같은 문장을 계속 다시 보내고, 띄어쓰기·문장부호만 바꿔 보내기도 한다.
 * - continuous 모드에서는 앞에서 확정된 부분이 resultIndex 앞에 남는다.
 * 그래서 "새 결과가 왔다"가 아니라 "들은 글자가 실제로 바뀌었다"를 기준으로,
 * 일정 시간 글자가 그대로면 한 번만 보낸다.
 */

/** 처음 결과부터 모두 이어 붙인 문장과, 아직 확정되지 않은 뒷부분. */
export function collectSpeechTranscript(results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal?: boolean }>): { text: string; interim: string } {
  let finalStr = '';
  let interimStr = '';
  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    const chunk = item?.[0]?.transcript || '';
    if (item?.isFinal) finalStr += chunk;
    else interimStr += chunk;
  }
  return { text: `${finalStr}${interimStr}`.replace(/\s+/g, ' ').trim(), interim: interimStr.trim() };
}

/** 띄어쓰기·문장부호 차이는 같은 말로 본다. */
export function speechKey(text: string): string {
  return text.replace(/[\s.,!?…~·'"“”‘’、。！？]/g, '');
}

export interface EndOfSpeechWatcher {
  /** 새 인식 결과. 글자가 바뀌었으면 true. */
  heard(text: string): boolean;
  /** 지금 들은 말을 바로 보낸다 (인식이 끝났을 때 등). 보냈으면 true. */
  flush(): boolean;
  /** 이미 보냈는지. */
  readonly sent: boolean;
  /** 마지막으로 들은 문장. */
  readonly text: string;
  dispose(): void;
}

export function createEndOfSpeechWatcher(options: {
  /** 글자가 이만큼 그대로면 말이 끝난 것으로 본다. */
  silenceMs?: number;
  minChars?: number;
  /** 지금 보내도 되는지 (듣는 중인지, 누르고 말하기 중이 아닌지 등). */
  canSend?: () => boolean;
  onSend: (text: string) => void;
  now?: () => number;
}): EndOfSpeechWatcher {
  const silenceMs = options.silenceMs ?? 1200;
  const minChars = options.minChars ?? 2;
  const now = options.now ?? (() => Date.now());
  let text = '';
  let key = '';
  let changedAt = 0;
  let sent = false;
  let timer: ReturnType<typeof setInterval> | null = null;

  const stop = () => {
    if (timer !== null) clearInterval(timer);
    timer = null;
  };
  const fire = (): boolean => {
    if (sent || key.length < minChars) return false;
    if (options.canSend && !options.canSend()) return false;
    sent = true;
    stop();
    options.onSend(text);
    return true;
  };
  const tick = () => {
    if (sent) return stop();
    if (key && now() - changedAt >= silenceMs) fire();
  };

  return {
    heard(next: string) {
      if (sent) return false;
      const nextKey = speechKey(next);
      if (!nextKey) return false;
      text = next.trim();
      if (nextKey === key) return false;
      key = nextKey;
      changedAt = now();
      if (timer === null) timer = setInterval(tick, 150);
      return true;
    },
    flush: fire,
    get sent() { return sent; },
    get text() { return text; },
    dispose: stop,
  };
}
