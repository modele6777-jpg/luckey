/**
 * 🎵 마이크를 쓰는 동안 앱 배경음(BGM)이 멈췄다면, 마이크가 끝난 뒤 다시 틀어 준다.
 *
 * iOS는 녹음용 오디오 세션으로 바뀌면 재생 중이던 소리를 멈추기도 한다.
 * 다른 앱(멜론·애플뮤직 등)의 음악은 웹에서 다시 틀 수 없지만, 루키 앱 배경음은 직접 다시 재생할 수 있다.
 * BGM 플레이어가 보내는 상태 이벤트만 듣고, 재생 요청도 같은 이벤트(prism:toggle_bgm)로 보낸다.
 */

let bgmPlaying = false;
let listening = false;

function ensureListening() {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  window.addEventListener('prism:bgm_state_change', (event: Event) => {
    const detail = (event as CustomEvent<{ isPlaying?: boolean }>).detail;
    if (detail && typeof detail.isPlaying === 'boolean') bgmPlaying = detail.isPlaying;
  });
}

/** 마이크를 켜기 직전에 부른다: 배경음이 재생 중이었는지 기억한다. */
export function rememberBgmBeforeMic(): boolean {
  if (typeof window === 'undefined') return false;
  ensureListening();
  // 플레이어에게 현재 상태를 다시 알려 달라고 한다 (동기 이벤트라 바로 반영된다).
  window.dispatchEvent(new CustomEvent('prism:request_bgm_state'));
  return bgmPlaying;
}

/** 마이크가 끝난 뒤 부른다: 원래 재생 중이었는데 지금 멈춰 있으면 다시 튼다. */
export function resumeBgmAfterMic(wasPlaying: boolean): void {
  if (!wasPlaying || typeof window === 'undefined') return;
  ensureListening();
  window.dispatchEvent(new CustomEvent('prism:request_bgm_state'));
  if (bgmPlaying) return;
  window.dispatchEvent(new CustomEvent('prism:toggle_bgm'));
}

/** 오디오 세션이 원래대로 돌아올 시간을 두고 한 번 더 확인한다. */
export function resumeBgmAfterMicSoon(wasPlaying: boolean, delayMs = 500): void {
  if (!wasPlaying || typeof window === 'undefined') return;
  window.setTimeout(() => resumeBgmAfterMic(wasPlaying), delayMs);
}
