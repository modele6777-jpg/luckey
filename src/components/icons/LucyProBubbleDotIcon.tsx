import { createLucideIcon } from 'lucide-react';

/**
 * 🔮 루시프로(점술모드) 말풍선 아이콘.
 * 일반 루시의 MessageCircleMinus(−) · MessageCirclePlus(+)와 같은 말풍선 윤곽선(viewBox 0 0 24 24,
 * 같은 bubble path) 안에 점 하나를 박아, "말풍선 + 점"만으로 루시프로 상태를 읽게 한다.
 * lucide 아이콘과 같은 props(size·strokeWidth·className·data-*)를 그대로 받는다.
 */
export const LucyProBubbleDotIcon = createLucideIcon('lucy-pro-bubble-dot', [
  ['path', { d: 'M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719', key: 'bubble' }],
  ['circle', { cx: '12', cy: '12', r: '2', fill: 'currentColor', stroke: 'none', key: 'dot' }],
]);
