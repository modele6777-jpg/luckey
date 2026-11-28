## 사용자 지시
"전체 페이지 가이드 아이콘 크기를 루시채팅에 나오는 크기로 동일시켜줘"

## 원인 (라이브 실측)
같은 가이드(📘)·스마트 가이드(?) 버튼인데 화면마다 크기가 달랐습니다. 특히 루시 채팅과 다른 패널이 한 화면에 나란히 보이는 듀오 화면에서 차이가 그대로 보였습니다.

| 화면 | 버튼 | 아이콘 |
|---|---|---|
| 루시 채팅 헤더 | 32px | **17px** (`.lucy-header-actions svg { width: 17px; height: 17px; }`) |
| 오브 · 채널 공통 헤더 · 코스믹 룸 | 32px | 15px |
| Key 헤더(물음표·가이드·검색) | 40px | 15px / 18px |
| Key 단독(아이프레임) 버튼 | 40px | 18px |

## 수정
- **공통 크기 상수 신설** `src/components/guide/guideButtonLayout.ts` — `GUIDE_BUTTON_SIZE_CLASS = 'h-8 w-8'`, `GUIDE_BUTTON_ICON_SIZE = 17`, `GUIDE_BUTTON_HALF_HEIGHT = 16`.
- `PageGuideButton`·`SmartGuideSettingsButton`이 이 상수만 사용하도록 변경(아이콘 15 → 17px, 버튼 32px 유지).
- **Key 화면**: 물음표·가이드·검색 버튼 `h-10 w-10`(40px) → 32px, 책/돋보기 아이콘 18 → 17px. 40px 기준이던 오버레이 세로 중앙 정렬도 32px 기준(`GUIDE_BUTTON_HALF_HEIGHT`)으로 계산.
- **Key 아이프레임**(`public/calm/style.css`·`key-search.js`): `.key-guide-btn`·`.key-search-btn` 40 → 32px, 아이콘 18 → 17px (검색 오버레이 입력창 아이콘은 그대로 18px).
- **오브 헤더 배경음(스피커)** 아이콘 15 → 17px: 코드 주석대로 "옆의 가이드 버튼과 같은 크기"로 정렬.
- 박스(테두리·배경) 표현은 페이지별 디자인대로 유지했습니다 — Key·오브는 검색·배경음 등 이웃 버튼이 같은 원형 박스라 함께 맞추는 편이 자연스럽습니다.

## 검증
- 신규 `tests/guide-button-size-unified.test.ts` 5건: 상수 값, 두 버튼 컴포넌트의 하드코딩 금지, 5개 사용처의 크기 오버라이드 금지, Key 부모·아이프레임 32px·17px, 오브 스피커 정렬.
- 가이드/배너/설정 관련 기존 테스트 갱신: 33/33 통과.
- `npm run build`·`npm run lint`는 CI에서 확인.

## 버전
v1.8.658
