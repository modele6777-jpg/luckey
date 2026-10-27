import type { MenuBounds } from './floatingMenuGeometry';

export const OPEN_NAVIGATION_MENU_EVENT = 'prism:open_navigation_menu';

export function openNavigationMenu() {
  window.dispatchEvent(new Event(OPEN_NAVIGATION_MENU_EVENT));
}

export function readMenuBounds(): MenuBounds {
  if (typeof window === 'undefined') return { left: 0, top: 0, width: 382, height: 678 };
  const visual = window.visualViewport;
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
  document.body.appendChild(probe);
  const css = getComputedStyle(probe);
  const top = parseFloat(css.paddingTop) || 0;
  const right = parseFloat(css.paddingRight) || 0;
  const bottom = parseFloat(css.paddingBottom) || 0;
  const left = parseFloat(css.paddingLeft) || 0;
  probe.remove();
  return {
    left: (visual?.offsetLeft ?? 0) + left,
    top: (visual?.offsetTop ?? 0) + top,
    width: Math.max(0, (visual?.width ?? innerWidth) - left - right),
    height: Math.max(0, (visual?.height ?? innerHeight) - top - bottom),
  };
}
