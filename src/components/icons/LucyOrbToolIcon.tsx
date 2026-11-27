import { useId } from 'react';

/**
 * 🔮 점술 도구 버튼용 오브(구슬) 아이콘.
 * 사용자 지시: "루시점술 모드에 해당 도구 버튼을 상단 헤더에 오브모양으로 만들어줘" (2026-11-27)
 * - 라이트(흰 헤더)·다크(밤 헤더) 어디에 놓여도 빛나는 구슬로 보이도록 헤더 글자색 대신
 *   자체 금빛·보랏빛 그라디언트를 쓴다.
 * - 아이콘 하나짜리 컴포넌트라 여러 번 렌더돼도 그라디언트 id가 겹치지 않게 useId를 쓴다.
 */
export function LucyOrbToolIcon({ size = 16 }: { size?: number }) {
  const suffix = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const bodyId = `lucy-orb-body-${suffix}`;
  const glowId = `lucy-orb-glow-${suffix}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      data-lucy-orb-tool-icon="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="58%" stopColor="#c084fc" stopOpacity="0" />
          <stop offset="86%" stopColor="#c084fc" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id={bodyId} cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="22%" stopColor="#fde68a" />
          <stop offset="52%" stopColor="#c084fc" />
          <stop offset="82%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#2e1065" />
        </radialGradient>
      </defs>
      {/* 은은한 빛무리 */}
      <circle cx="12" cy="12" r="11.4" fill={`url(#${glowId})`} />
      {/* 구슬 본체 + 금빛 테두리 */}
      <circle cx="12" cy="12" r="9.2" fill={`url(#${bodyId})`} stroke="#fde68a" strokeOpacity="0.6" strokeWidth="0.9" />
      {/* 유리처럼 반사되는 하이라이트 */}
      <ellipse cx="8.7" cy="8.1" rx="3" ry="2" fill="#fffdf6" opacity="0.72" transform="rotate(-28 8.7 8.1)" />
      <ellipse cx="14.8" cy="15.5" rx="2.1" ry="1.2" fill="#f5d0fe" opacity="0.32" transform="rotate(-25 14.8 15.5)" />
      <circle cx="16.3" cy="7.9" r="0.85" fill="#fffbeb" opacity="0.9" />
    </svg>
  );
}
