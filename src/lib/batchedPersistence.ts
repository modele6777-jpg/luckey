/** Persist streaming UI snapshots at a bounded rate, keeping the newest value. */
export function createBatchedPersistence<T>(write: (value: T) => void, interval = 200) {
  let pending: { value: T } | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const flush = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    if (!pending) return;
    const { value } = pending;
    pending = null;
    write(value);
  };
  return {
    schedule(value: T, immediate = false) {
      pending = { value };
      if (immediate) flush();
      else if (timer === null) timer = setTimeout(flush, interval);
    },
    flush,
  };
}
