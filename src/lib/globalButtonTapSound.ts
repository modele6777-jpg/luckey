/**
 * 앱 전체 버튼 클릭음 (global button tap sound)
 *
 * Every button in the app answers a press with the same light micro-switch click
 * (`playAudioHaptic('tap_light')`) so the whole UI feels consistent, including
 * buttons that never wired their own feedback (엔진함 `엔진·관점` 버튼, 추천질문
 * 라이브러리 등).
 *
 * Design notes
 * - The listener runs on `document` in the CAPTURE phase, so a control that calls
 *   `stopPropagation()` (DialogTriggerButton, 포털·모달 내부 버튼) still rings.
 * - The sound is queued in a microtask so a control's own richer feedback
 *   (`tap_impact`, `save_success`, 카드 사운드 …) that runs in the same dispatch wins
 *   and the generic click is skipped instead of layering two sounds.
 * - iOS WebKit sometimes drops `click` entirely for controls inside overflow
 *   clipping / backdrop-filter chrome, where the control activates from the gesture
 *   itself (DialogTriggerButton의 pointerup/touchend 경로). Those gestures call
 *   `preventDefault()`, so a prevented, stationary, short gesture is answered here.
 * - Identical tap sounds fired for one interaction are collapsed inside
 *   `playAudioHaptic` (70ms), so no button rings twice.
 * - `data-tap-sound="off"` on a control or any ancestor opts the whole subtree out
 *   (BigBangButton처럼 자체 사운드가 있는 드래그·홀드 버튼, 무음 토글이 켜진 도구 화면).
 * - `data-tap-sound="on"` opts a non-button element in.
 * - 외부 음악(멜론·애플뮤직) 공존: 이 파일은 오디오 세션을 건드리지 않는다.
 *   `playAudioHaptic`은 공유 버스에 짧은 클릭만 얹으므로 ambient 믹싱 정책이 유지되고,
 *   사용자가 오디오 햅틱을 꺼 두면 `playAudioHaptic`이 스스로 조용히 반환한다.
 */

import { getLastHapticTimestamp, playAudioHaptic } from './audioHaptics';

const BUTTON_SELECTOR = [
  'button',
  '[role="button"]',
  'a[role="button"]',
  'input[type="button"]',
  'input[type="submit"]',
  '[data-tap-sound="on"]',
].join(',');

/** A control's own sound fired this close before the click already covers the tap. */
const RECENT_SOUND_MS = 120;
/** px — beyond this the gesture is a scroll or drag, not a tap. */
const TAP_MOVE_SLOP = 14;
/** ms — a deliberate long press has its own meaning and sound. */
const TAP_HOLD_LIMIT_MS = 600;

/** When this module itself rang — so fast repeated taps aren't mistaken for "already sounded". */
let lastGlobalTapAt = 0;

function nowMs(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function ring(): void {
  const before = getLastHapticTimestamp();
  playAudioHaptic('tap_light');
  // 쿨다운으로 접혔거나 오디오 햅틱이 꺼져 있으면 이번 클릭은 울리지 않았다.
  const after = getLastHapticTimestamp();
  if (after > before) lastGlobalTapAt = after;
}

function resolveTapControl(target: EventTarget | null): HTMLElement | null {
  if (typeof Element === 'undefined' || !(target instanceof Element)) return null;
  const control = target.closest<HTMLElement>(BUTTON_SELECTOR);
  if (!control) return null;
  if (control.closest('[data-tap-sound="off"]')) return null;
  if (control.matches(':disabled')) return null;
  if (control.getAttribute('aria-disabled') === 'true') return null;
  if (control.getAttribute('data-disabled') === 'true') return null;
  return control;
}

/** Queue the click for this activation unless a handler in the same dispatch sounds first. */
function queueClickSound(): void {
  if (typeof queueMicrotask !== 'function') {
    ring();
    return;
  }
  const queuedAt = nowMs();
  const last = getLastHapticTimestamp();
  const lastWasOurOwnClick = Math.abs(last - lastGlobalTapAt) < 20;
  // 버튼이 pointerdown 등 이 클릭 전에 자기 소리를 냈다면 그 소리가 이 탭을 이미 덮었다.
  if (!lastWasOurOwnClick && queuedAt - last < RECENT_SOUND_MS) return;
  queueMicrotask(() => {
    // 같은 click 디스패치 안에서 버튼 자신의 사운드(tap_impact·success 등)가 이미 울렸다.
    if (getLastHapticTimestamp() > queuedAt) return;
    ring();
  });
}

type PressStart = { x: number; y: number; at: number; control: HTMLElement | null };

/** `click`이 유실되고 제스처가 컨트롤을 직접 활성화한 경우(기본 동작 차단)의 보루. */
function soundForSwallowedGesture(event: Event, start: PressStart | null, endX: number, endY: number, pointerType: string | undefined): void {
  if (!start?.control) return;
  if (pointerType === 'mouse') return; // 데스크톱은 click이 담당한다
  if (resolveTapControl(event.target) !== start.control) return; // 다른 요소에서 손을 뗌
  if (Math.hypot(endX - start.x, endY - start.y) > TAP_MOVE_SLOP) return;
  if (nowMs() - start.at > TAP_HOLD_LIMIT_MS) return;
  queueMicrotask(() => {
    // 기본 동작이 살아 있으면 뒤따르는 click이 울린다.
    if (!event.defaultPrevented) return;
    queueClickSound();
  });
}

let installed = false;

export function installGlobalButtonTapSound(): void {
  if (installed || typeof window === 'undefined' || typeof document === 'undefined') return;
  installed = true;

  document.addEventListener(
    'click',
    (event: MouseEvent) => {
      if (resolveTapControl(event.target)) queueClickSound();
    },
    true,
  );

  let pointerStart: PressStart | null = null;
  let pointerStartId = -1;
  let touchStart: PressStart | null = null;
  let touchStartId = -1;

  document.addEventListener(
    'pointerdown',
    (event: PointerEvent) => {
      pointerStartId = event.pointerId;
      pointerStart = {
        x: event.clientX,
        y: event.clientY,
        at: nowMs(),
        control: event.button === 0 ? resolveTapControl(event.target) : null,
      };
    },
    true,
  );

  document.addEventListener(
    'pointerup',
    (event: PointerEvent) => {
      const start = pointerStart;
      const matches = start !== null && pointerStartId === event.pointerId;
      pointerStart = null;
      pointerStartId = -1;
      if (!matches) return;
      soundForSwallowedGesture(event, start, event.clientX, event.clientY, event.pointerType);
    },
    true,
  );

  document.addEventListener(
    'pointercancel',
    () => {
      pointerStart = null;
      pointerStartId = -1;
    },
    true,
  );

  // 구형 iOS가 포인터 대신 터치 이벤트로만 활성화하는 경우의 보루.
  document.addEventListener(
    'touchstart',
    (event: TouchEvent) => {
      const point = event.changedTouches[0];
      if (!point) return;
      touchStartId = point.identifier;
      touchStart = {
        x: point.clientX,
        y: point.clientY,
        at: nowMs(),
        control: resolveTapControl(event.target),
      };
    },
    true,
  );

  document.addEventListener(
    'touchend',
    (event: TouchEvent) => {
      const start = touchStart;
      const point = event.changedTouches[0];
      const matches = start !== null && point !== undefined && touchStartId === point.identifier;
      touchStart = null;
      touchStartId = -1;
      if (!matches || !point) return;
      soundForSwallowedGesture(event, start, point.clientX, point.clientY, 'touch');
    },
    true,
  );
}
