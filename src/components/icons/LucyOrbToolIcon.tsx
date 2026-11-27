import React from 'react';

export interface LucyOrbToolIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

/**
 * 🔮 점술 도구 버튼용 오브(구슬) 아이콘.
 * 사용자 지시 (2026-11-27): "점술 모드 도구함에 오브이모티콘을 사이드 메뉴의 오브 아이콘에
 * 받침대를 뺀 아이콘이 나오게 해줘"
 * - 사이드 메뉴의 `OrbShapeIcon`(Lucide 선 아이콘)과 같은 벡터 문법을 쓰되, 받침대 2줄만 뺀
 *   순수 오브 구체다. 그래서 헤더의 연필(Pencil)·가이드(BookOpen) 아이콘과 굵기·색이 맞는다.
 * - 받침대가 없으니 viewBox 정중앙(cy=12)에 구체를 둬서 버튼 안에서 위아래로 치우치지 않게 한다.
 * - 색은 `currentColor`로 상속해 라이트(흰 헤더)·다크(밤 헤더) 모두 헤더 글자색을 따른다.
 */
export function LucyOrbToolIcon({
  size = 16,
  className = '',
  color = 'currentColor',
  strokeWidth = 2,
  ...svgProps
}: LucyOrbToolIconProps) {
  return (
    <svg
      {...svgProps}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-lucy-orb-tool-icon="true"
      className={`shrink-0 select-none ${className}`}
      style={{ display: 'block', overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 구체 */}
      <circle cx="12" cy="12" r="8" />
      {/* 상단 글래스 하이라이트 아크 */}
      <path d="M8.7 9.3a4.4 4.4 0 0 1 6.6 0" strokeWidth={Math.max(strokeWidth - 0.4, 1.2)} />
      {/* 내부 코어 점 */}
      <circle cx="12" cy="12.2" r="1.2" fill={color} stroke="none" />
    </svg>
  );
}
