import React from 'react';

export interface OrbShapeIconProps {
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

/**
 * 🔮 OrbShapeIcon (오브 모양 Lucide 스타일 일관 벡터 아이콘)
 * - 다른 Lucide 아이콘(Sun, Sparkles, Triangle, Moon 등)과 완전히 동일한 스트로크 & 벡터 문법
 * - 복잡한 3D 라디얼 그라디언트 렌더링 대신, 순수하고 세련된 크리스탈 오브 구체 벡터
 * - 외부 원형 구체(Circle), 내부 코어 펄스 포인트, 상단 글래스 하이라이트 아크로 구성
 * - color, strokeWidth, className 속성을 투명하게 상속받아 다른 앱 아이콘들과 완벽한 일관성 유지
 */
export function OrbShapeIcon({
  size = 24,
  className = '',
  color = 'currentColor',
  strokeWidth = 2,
}: OrbShapeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. 크리스탈 구체 외곽 메인 바디 원 (Main Sphere Outline) */}
      <circle cx="12" cy="12" r="9" />

      {/* 2. 상단 글래스 렌즈 곡면 반사광 (Curved Specular Highlight Arc) */}
      <path d="M8 8a5.5 5.5 0 0 1 8 0" strokeWidth={Math.max(strokeWidth - 0.5, 1.2)} />

      {/* 3. 구체 중심 싱귤래리티 코어 (Center Core Dot) */}
      <circle cx="12" cy="12" r="1.75" fill={color} stroke="none" />

      {/* 4. 하단 림 반사광 미세 아크 (Bottom Rim Reflection Arc) */}
      <path d="M9.5 16.5a4 4 0 0 0 5 0" strokeWidth={Math.max(strokeWidth - 0.7, 1)} strokeOpacity="0.75" />
    </svg>
  );
}
