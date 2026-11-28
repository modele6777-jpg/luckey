/**
 * 📘🧭 페이지 가이드(책) · 스마트 가이드(물음표) 아이콘 버튼의 공통 크기.
 *
 * 사용자 지시(2026-11-28): "전체 페이지 가이드 아이콘 크기를 루시채팅에 나오는 크기로 동일시켜줘"
 *
 * 루시 채팅 헤더는 32px(h-8 w-8) 버튼 안에 17px 아이콘으로 그려진다
 * (src/styles/lucy-starlight.css 의 `.lucy-header-actions svg { width: 17px; height: 17px; }`).
 * 그래서 앱의 모든 화면(루시 채팅 · 오브 · Key · 채널 공통 헤더 · 코스믹 룸)이 같은 32px·17px을 쓴다.
 *
 * 페이지마다 `className="h-10 w-10"`·`size={18}` 같은 개별 오버라이드를 두지 말고
 * 이 상수만 사용한다 (키 채널 헤더 오버레이 · public/calm 안쪽 버튼 포함).
 */
export const GUIDE_BUTTON_SIZE_CLASS = 'h-8 w-8';
export const GUIDE_BUTTON_ICON_SIZE = 17;
/** 32px 버튼을 헤더 세로 중앙에 놓을 때 쓰는 절반 높이(px) */
export const GUIDE_BUTTON_HALF_HEIGHT = 16;
