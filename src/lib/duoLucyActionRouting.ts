/** Keep both panes mounted when a Lucy action is triggered from the content pane. */
export function shouldPreserveDuoSplitForLucyAction(
  contentPaneMounted: boolean,
  lucyPaneMounted: boolean,
): boolean {
  return contentPaneMounted && lucyPaneMounted;
}

/** A channel action targets the already visible Lucy pane without replacing its source page. */
export function requestLucyAction(options: { prompt?: string; channel?: string; draftOnly?: boolean } = {}) {
  if (typeof window === 'undefined') return;
  const split = shouldPreserveDuoSplitForLucyAction(
    Boolean(document.getElementById('duo-content-viewport')),
    Boolean(document.getElementById('duo-lucy-viewport')),
  );
  if (split) {
    if (options.prompt || options.channel) {
      window.dispatchEvent(new CustomEvent('lucy-inject-message', { detail: options }));
    }
    return;
  }
  try {
    if (options.channel) sessionStorage.setItem('lucy_pro_pending_channel', options.channel);
    if (options.prompt) {
      sessionStorage.setItem('lucy_injected_input_draft', options.prompt);
      if (!options.draftOnly) sessionStorage.setItem('lucy_injected_auto_send', options.prompt);
    }
  } catch { /* Navigation remains available when storage is unavailable. */ }
  window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/chat' } }));
}
