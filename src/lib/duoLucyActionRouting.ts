/** Keep both panes mounted when a Lucy action is triggered from the content pane. */
export function shouldPreserveDuoSplitForLucyAction(
  contentPaneMounted: boolean,
  lucyPaneMounted: boolean,
): boolean {
  return contentPaneMounted && lucyPaneMounted;
}

type LucyActionOptions = { prompt?: string; channel?: string; draftOnly?: boolean };

function inDuoSplit(): boolean {
  if (typeof document === 'undefined') return false;
  return shouldPreserveDuoSplitForLucyAction(
    Boolean(document.getElementById('duo-content-viewport')),
    Boolean(document.getElementById('duo-lucy-viewport')),
  );
}

/** 펼친 화면: 이미 보이는 루시 패널에 바로 전달한다 (화면 전환 없음). */
function injectIntoDuoLucyPane(options: LucyActionOptions): boolean {
  if (!inDuoSplit()) return false;
  if (options.prompt || options.channel) {
    window.dispatchEvent(new CustomEvent('lucy-inject-message', { detail: options }));
  }
  return true;
}

/** 다음에 루시 채팅을 열 때 쓰도록 보관만 한다 (지금 화면은 그대로). */
function stageLucyAction(options: LucyActionOptions) {
  try {
    if (options.channel) sessionStorage.setItem('lucy_pro_pending_channel', options.channel);
    if (options.prompt) {
      sessionStorage.setItem('lucy_injected_input_draft', options.prompt);
      if (!options.draftOnly) sessionStorage.setItem('lucy_injected_auto_send', options.prompt);
    }
  } catch { /* 저장이 막혀 있으면 보관만 건너뛴다. */ }
}

/** A channel action targets the already visible Lucy pane without replacing its source page. */
export function requestLucyAction(options: LucyActionOptions = {}) {
  if (typeof window === 'undefined') return;
  if (injectIntoDuoLucyPane(options)) return;
  stageLucyAction(options);
  window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/chat' } }));
}

/**
 * 채팅에 남길 내용을 보관만 하고 화면은 옮기지 않는다.
 * 오브 상담을 마친 뒤 오브 메인화면에 머무는 동안 쓰이며, 루시 채팅은 사용자가 직접 열 때 보낸다.
 */
export function queueLucyAction(options: LucyActionOptions = {}) {
  if (typeof window === 'undefined') return;
  if (injectIntoDuoLucyPane(options)) return;
  stageLucyAction(options);
}
