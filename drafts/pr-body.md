## 📋 요약
`deterministicEngine.ts`에서 유일하게 `not_implemented`로 남아 있던 **토정비결(土亭秘訣)**을 100% 순수 수리 결정론적 정규 엔진으로 승격시킵니다. (v1.7.13)

## 🔮 신규: `src/lib/divination/tojeongEngine.ts`
- **조선 정통 이지함 작괘 산법 완전 구현**
  - 세는나이 = 대상 연도 − 음력 출생 연도 + 1
  - 태세수(太歲數)·월건수(月建數)·일진수(日辰數) 표준 조견 분해표 적용
  - 오호둔월법(五虎遁月法)으로 당해 연도 음력 생월의 월건 산출
  - 일진(日辰)은 JDN 기반 검증식(2000-01-01=무오일·1900-01-01=갑술일 이중 앵커)으로 산출
  - 당해 연도 음력 생월의 큰달/작은달(30/29) 판정, 윤달 출생은 평달 계산 전통 준수
  - 상괘 = (나이+태세수)%8, 중괘 = (달 날수+월건수)%6, 하괘 = (음력 생일+일진수)%3 (나머지 0은 나눈 수)
  - 상괘 8 × 중괘 6 × 하괘 3 = **144개 고유 괘문 코드**("111"~"863")
- **48본괘 문헌 × 3동효 = 144괘 풀이 탑재**: 괘코드·주역 상응 괘명(64괘 주문왕 대응표)·총론 격(格) 서술·길흉 등급(대길/길/평/주의/흉)·1~12월 월별 괘상과 실천 조언
- `calculateTojeong()` / `formatTojeongPrompt()` / `TojeongResult` 인터페이스 내보내기
- 생년월일 누락 시 `status: 'skipped'`로 투명하게 생략 (사주 간지로 괘문 대체 금지)

## 🔌 연동
- `deterministicEngine.ts`: `tojeongEnvelope`을 `not_implemented` → `calculated`로 승격, `DeterministicEngineReport.tojeongResult` 필드 추가, `formatDeterministicEnginePrompt`에 토정비결 섹션 주입
- `divinationCapabilities.ts`: tojeong `not_implemented` → `available` (1900~2100년 역법 지원 명시)
- 감사 테스트의 미구현 도구 수 2 → 1 갱신

## ✅ 수리 검증
- 공개된 작괘 예시(2026 병오년, 음력 1990-05-20생): 태세수 16·월건수 18(갑오월·작은달 29)·일진수 17(기묘일) → **괘 551 손위풍** 완전 일치
- 64괘 인덱스 표 ↔ 괘명 상·하괘 구성 전수 일치 검증, 144괘 코드 완전성 검증

## 🚀 배포
- `package.json` 1.7.12 → **1.7.13**
