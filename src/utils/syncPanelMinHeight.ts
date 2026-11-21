export function syncPanelMinHeight(target: HTMLElement | null, reference: HTMLElement | null): () => void {
  if (!target || !reference) return () => {};

  const sync = () => {
    target.style.minHeight = `${Math.ceil(reference.getBoundingClientRect().height)}px`;
  };

  sync();

  if (typeof ResizeObserver === 'undefined') {
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }

  const observer = new ResizeObserver(sync);
  observer.observe(reference);
  return () => observer.disconnect();
}
