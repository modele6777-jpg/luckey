# 좌측 상시 고정 사이드바 및 본문 레이아웃 구현 계획

사용자 요청에 따라 사이드바를 **좌측에 상시 고정(Always Visible Left Rail)**으로 배치하고, 사이드바 너비(72px)만큼 본문 여백을 확보하여 모든 기기에서 겹침 없이 화면을 100% 채우도록 수정합니다.

---

## 1. 변경 요약 및 사용자 결정 반영
- **배치 위치**: 우측 자동 숨김 오버레이 $\rightarrow$ **좌측 상시 고정 레일 (left-0, border-r)**
- **표시 동작**: 마우스 호버/스와이프에 의한 3초 자동 숨김 해제 $\rightarrow$ **모바일 및 PC 모든 화면에서 상시 표시**
- **본문 레이아웃**: 사이드바 너비(72px)만큼 본문 여백(`margin-left: 72px`, `width: calc(100% - 72px)`)을 확보하여 콘텐츠 가림 현상 원천 방지
- **도구 설명(툴팁)**: 좌측 화면 밖으로 잘리지 않도록 레일 우측(`left-[calc(100%+14px)]`)으로 뷰포트 방향 전환

---

## 2. 주요 작업 내역

### A. `src/components/navigation/LeftSidebarNav.tsx`
1. **상시 표시 상태 설정**:
   - `isOpen` 상태를 기본 `true`로 설정하고 불필요한 자동 닫힘 타이머(`autoCloseTimerRef`), 우측 터치 스와이프 감지기, 우측 가장자리 호버 감지 구역 제거.
   - 배경 차단 오버레이(`sidebar-backdrop`) 및 우측 플로팅 힌트 핸들 바 제거.
2. **좌측 배치 스타일 적용**:
   - `right-0` $\rightarrow$ `left-0`, `border-l` $\rightarrow$ `border-r`, 그림자 방향을 우측으로 자연스럽게 전환.
   - 오로라 액센트 코어 라인을 레일 우측 경계선에 맞추어 시각적 일체감 부여.
3. **호버 툴팁 위치 보정**:
   - 채널 내비게이션 아이콘, LP BGM 버튼, 프로필 사진의 호버 툴팁 위치를 `right-[calc(100%+14px)]`에서 `left-[calc(100%+14px)]`로 변경하여 우측 본문 방향으로 선명하게 노출.

### B. `src/index.css` & 레이아웃 스타일
1. **사이드바 너비 변수 업데이트**:
   - `:root { --sites-sidebar-width: 72px; }`로 설정.
2. **본문 컨테이너 여백 지정**:
   - `.sites-pinned-main`에 `margin-left: var(--sites-sidebar-width);`, `width: calc(100% - var(--sites-sidebar-width));`를 설정하여 좌측 사이드바와 겹치지 않고 남은 화면 전체를 100% 빈틈없이 채우도록 구성.
3. **하단 보조 내비 및 플로팅 배너 중앙 정렬 계산**:
   - `.sites-pinned-main .prism-xs-subnav` 및 PWA 인스톨 배너의 위치 기준을 본문 영역의 정중앙에 맞춰 정렬.

### C. 빌드 검증 및 버전 관리 규칙 준수 (`RULE[AGENTS_md]`)
1. `package.json` 패치 버전 업데이트 (1.4.484 $\rightarrow$ 1.4.485).
2. `public/version.json` 및 `public/changelog.json`에 좌측 상시 고정 사이드바 적용 내역 기록.
3. `npm run lint` 및 `compile_applet`으로 오류 없음 확인.
4. Git commit & push 수행.

---

## 3. 검증 항목
- PC 및 모바일 뷰포트에서 사이드바가 좌측에 안정적으로 고정되어 있는지 확인.
- 메인 본문 콘텐츠(루시 대화창, 타로 리딩, 일기 등)가 사이드바 밑으로 숨겨지거나 빈 공간 없이 화면을 균형 있게 채우는지 확인.
- 사이드바 내 아이콘 및 버튼 호버 시 툴팁이 화면 안쪽(우측)으로 정상 표시되는지 확인.
- 콘솔 및 런타임 에러 없는지 확인.
