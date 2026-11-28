/**
 * 📘🧭 페이지 가이드(책) · 스마트 가이드(물음표) 아이콘 버튼의 공통 크기·모양·반응.
 *
 * 사용자 지시(2026-11-28):
 *  - "전체 페이지 가이드 아이콘 크기를 루시채팅에 나오는 크기로 동일시켜줘"
 *  - "전체 채널 상단 아이콘을 루시채팅과 동일하게 해줘 효과나 크기 전부"
 *
 * 루시 채팅 헤더가 기준이다: 32px(h-8 w-8) 버튼 안에 17px 아이콘, 테두리·배경 없는 투명 버튼,
 * hover 시 opacity .7 (src/styles/lucy-starlight.css `.lucy-header-actions > button:hover { opacity: .7 }`),
 * 누를 때 scale .95 + 햅틱. 앱의 모든 화면(루시 채팅 · 오브 · Key · 채널 공통 헤더 · 코스믹 룸)이
 * 같은 값을 쓰도록 이 상수만 사용하고, 페이지마다 `className="h-10 w-10"`·`size={18}` 같은
 * 개별 오버라이드나 박스(테두리·배경) 표현을 다시 넣지 않는다 (public/calm 안쪽 버튼 포함).
 */
export const GUIDE_BUTTON_SIZE_CLASS = 'h-8 w-8';
export const GUIDE_BUTTON_ICON_SIZE = 17;
/** 32px 버튼을 헤더 세로 중앙에 놓을 때 쓰는 절반 높이(px) */
export const GUIDE_BUTTON_HALF_HEIGHT = 16;

/** 배경 없이 아이콘만 두는 루시 채팅식 버튼의 테마별 글자색(대비만 배경에 맞춘다). */
export const GUIDE_BUTTON_TONE_TEXT = {
  dark: 'text-white/90',
  light: 'text-slate-700',
  key: 'text-[#c9805c]',
} as const;

/** 루시 채팅 헤더와 같은 반응: 색·투명도 전환, 누르면 살짝 줄고, hover 시 흐려진다. */
export const GUIDE_BUTTON_INTERACTION_CLASS = 'transition-all duration-200 active:scale-95 hover:opacity-70';
