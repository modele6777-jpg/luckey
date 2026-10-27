export interface MenuPoint { x: number; y: number }
export interface MenuSize { width: number; height: number }
export interface MenuBounds extends MenuSize { left: number; top: number }
export type MenuEdge = 'left' | 'right';

export function clampMenuPosition(point: MenuPoint, size: MenuSize, bounds: MenuBounds): MenuPoint {
  const gapX = Math.min(12, Math.max(0, (bounds.width - size.width) / 2));
  const gapY = Math.min(12, Math.max(0, (bounds.height - size.height) / 2));
  const left = bounds.left + gapX;
  const top = bounds.top + gapY;
  const right = Math.max(left, bounds.left + bounds.width - size.width - gapX);
  const bottom = Math.max(top, bounds.top + bounds.height - size.height - gapY);
  return {
    x: Math.min(right, Math.max(left, Number.isFinite(point.x) ? point.x : left)),
    y: Math.min(bottom, Math.max(top, Number.isFinite(point.y) ? point.y : bottom)),
  };
}

export function snapMenuPosition(point: MenuPoint, size: MenuSize, bounds: MenuBounds, edge?: MenuEdge): MenuPoint {
  const side = edge ?? (point.x + size.width / 2 < bounds.left + bounds.width / 2 ? 'left' : 'right');
  return clampMenuPosition({ x: side === 'left' ? bounds.left : bounds.left + bounds.width, y: point.y }, size, bounds);
}

export function placeMenuPanel(anchor: MenuPoint, button: MenuSize, panel: MenuSize, bounds: MenuBounds): MenuPoint {
  const above = anchor.y - panel.height - 12;
  const below = anchor.y + button.height + 12;
  if (above >= bounds.top + 12) return clampMenuPosition({ x: anchor.x + button.width / 2 - panel.width / 2, y: above }, panel, bounds);
  if (below + panel.height <= bounds.top + bounds.height - 12) return clampMenuPosition({ x: anchor.x + button.width / 2 - panel.width / 2, y: below }, panel, bounds);
  const right = anchor.x + button.width + 12;
  const left = anchor.x - panel.width - 12;
  const x = right + panel.width <= bounds.left + bounds.width - 12 ? right : left;
  return clampMenuPosition({ x, y: anchor.y + button.height / 2 - panel.height / 2 }, panel, bounds);
}
