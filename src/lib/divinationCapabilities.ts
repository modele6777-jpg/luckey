import type { DivinationToolId } from './fifteenDivinationTools';

/** Audited implementation boundaries, not claims about predictive validity. */
export const DIVINATION_CAPABILITIES: Record<DivinationToolId, { state: 'available' | 'partial' | 'symbolic' | 'not_implemented'; scope: string; required: string }> = {
  saju: { state: 'available', scope: '한국 표준시·절기 기반 사주. 용신·신강약은 간이 추정이며 해외 시간·진태양시 별도 검증 필요.', required: '양/음력·윤달·생년월일, 시주는 생시, 대운 방향은 전통 계산의 성별 기준' },
  astrology: { state: 'available', scope: '천문력 기반 서양 열대황도 행성 위치. 상승궁·MC는 확인된 생시·도시가 있을 때만 제공. 12하우스·트랜짓 미산출.', required: '생년월일·역법, 생시·출생도시·시간대' },
  ziwei: { state: 'not_implemented', scope: '자미두수 명반·14주성·사화 배치 계산 미구현. 사주로 명궁·궁위·별을 대체하지 않음.', required: '음력 생년월일·윤달·생시·성별 기준 및 검증된 명반' },
  tarot: { state: 'partial', scope: '실제 뽑거나 입력한 78장 카드와 정·역방향 해석 지원. 제공되지 않은 카드·배열을 뽑았다고 말하지 않음.', required: '선택 카드·방향·스프레드 위치·질문' },
  sukuyo: { state: 'not_implemented', scope: '숙요 본명숙·관계 계산 미구현. 월일 나머지 연산이나 서양 달 별자리로 대체하지 않음.', required: '전통 역법·본명숙표와 양쪽의 출생정보' },
  mahabote: { state: 'partial', scope: '양력 환산 출생 요일과 수요일 정오 전후의 8요일 상징만 제공. 마하보테 7궁 명반 미산출.', required: '양력 환산 생년월일, 수요일은 생시' },
  vedic: { state: 'not_implemented', scope: '항성황도·아야남샤·나크샤트라·다샤 미산출. 서양 열대황도 차트를 베딕 차트로 읽지 않음.', required: '출생일시·위치·시간대·아야남샤 및 검증된 차트' },
  liuren: { state: 'not_implemented', scope: '육임 점시 포국·사과삼전 미산출. 초전·중전·말전이나 승패를 임의 지정하지 않음.', required: '점시·월장·위치·질문 및 검증된 포국' },
  qimen: { state: 'not_implemented', scope: '홍국기문·기문둔갑 포국 미산출. 팔문·구궁·길방위를 임의 지정하지 않음.', required: '점시·위치·음양둔·국수·적용 유파 및 검증된 포국' },
  kabbalah: { state: 'symbolic', scope: '생명나무·세피로트의 철학적 상징 해석. 수리·이름 변환 계산이나 예측 결과로 주장하지 않음.', required: '질문·선택한 상징, 수리 계산에는 원문·변환 규칙' },
  iching: { state: 'not_implemented', scope: '자동 작괘 미구현. 본괘·변효·지괘가 제공된 경우만 그 결과를 해석하며 임의의 괘를 생성하지 않음.', required: '질문·실제 얻은 6효(아래에서 위)와 변효 또는 명시한 작괘 규칙' },
  thai_astrology: { state: 'partial', scope: '출생 요일의 행성·전통 색상만 제공. 정밀 호라삿 차트·신체 상태 진단 미산출.', required: '양력 환산 생년월일, 정밀 차트는 생시·위치·역법' },
  tojeong: { state: 'not_implemented', scope: '토정비결 수리·괘문 계산 미구현. 사주 일간으로 연·월별 괘문을 대체하지 않음.', required: '적용 연도·음력 생일·전통 나이·유파별 수리와 괘문표' },
  kyusei: { state: 'partial', scope: '입춘 절입 기준 본명성만 산출. 월명성·방위반·오황살·암검살·길방위 미산출.', required: '양력 환산 생년월일, 입춘 당일은 생시' },
  taiyi: { state: 'not_implemented', scope: '태을신수 국수·16궁·주객 산법 미구현. 시대·개인 길흉을 계산한 것으로 주장하지 않음.', required: '점시·적용 역법·국수 산법·검증된 포국' },
};

export function buildDivinationCapabilityPrompt(ids: readonly DivinationToolId[]): string {
  return '[도구별 구현 범위: available도 입력과 실제 산출 결과가 있어야 계산 완료임]\n' + ids.map(id => `- ${id} [${DIVINATION_CAPABILITIES[id].state}]: ${DIVINATION_CAPABILITIES[id].scope} 필요 입력: ${DIVINATION_CAPABILITIES[id].required}.`).join('\n');
}
