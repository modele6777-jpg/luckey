import type { DivinationToolId } from './fifteenDivinationTools';

/** Audited implementation boundaries, not claims about predictive validity. */
export const DIVINATION_CAPABILITIES: Record<DivinationToolId, { state: 'available' | 'partial' | 'symbolic' | 'not_implemented'; scope: string; required: string }> = {
  saju: { state: 'available', scope: '한국 표준시·절기 기반 사주. 용신·신강약은 간이 추정이며 해외 시간·진태양시 별도 검증 필요.', required: '양/음력·윤달·생년월일, 시주는 생시, 대운 방향은 전통 계산의 성별 기준' },
  astrology: { state: 'available', scope: '천문력 기반 서양 열대황도 행성 위치. 상승궁·MC는 확인된 생시·도시가 있을 때만 제공. 12하우스·트랜짓 미산출.', required: '생년월일·역법, 생시·출생도시·시간대' },
  ziwei: { state: 'available', scope: 'iztro 2.6.3 통행식의 12궁·주성·보성·사화·대한 계산. 중국 음력·윤달 보정·23시 익일 기준을 명시하며 유년·진태양시 미산출.', required: '출생일·현지 출생시간·전통 성별 기준' },
  tarot: { state: 'partial', scope: '실제 뽑거나 입력한 78장 카드와 정·역방향 해석 지원. 제공되지 않은 카드·배열을 뽑았다고 말하지 않음.', required: '선택 카드·방향·스프레드 위치·질문' },
  sukuyo: { state: 'partial', scope: '27숙 월별 기숙표에 한국 음력 생일을 적용한 본명숙과 두 숙의 방향별 관계 계산. 일본 구력과 차이 가능; 윤달은 계산 보류.', required: '생년월일·양음력, 관계 계산은 두 사람 정보' },
  mahabote: { state: 'partial', scope: '양력 환산 출생 요일과 수요일 정오 전후의 8요일 상징만 제공. 마하보테 7궁 명반 미산출.', required: '양력 환산 생년월일, 수요일은 생시' },
  vedic: { state: 'partial', scope: '평균 세차율 기반 항성황도 참고값·나크샤트라·파다·빔쇼타리 주기 계산. 정밀 Lahiri 천문력 아님; 경계 결과 확정 금지.', required: '지원 도시·생일·생시·역법' },
  liuren: { state: 'available', scope: '트리니티 계산실에서 UTC+8 점시·천문 중기 환장에 따른 천지반·사과삼전 산출. 결과가 대화에 제공된 경우만 해석.', required: '점시·시간대·질문 및 사용자가 생성한 포국' },
  qimen: { state: 'partial', scope: '일반 기문둔갑 차보법·UTC+8 정시 포국을 계산실에서 지원. 분 단위 절기 경계와 홍국기문 별도 수리는 미지원.', required: '점시·시간대·일반 기문 차보법 선택' },
  kabbalah: { state: 'symbolic', scope: '생명나무·세피로트의 철학적 상징 해석. 수리·이름 변환 계산이나 예측 결과로 주장하지 않음.', required: '질문·선택한 상징, 수리 계산에는 원문·변환 규칙' },
  iching: { state: 'available', scope: '계산실에서 암호학적 난수 동전법 또는 실제 6효 입력으로 본괘·변효·지괘 산출. 사용자 작괘 없이 임의 생성 금지.', required: '질문과 사용자가 생성·입력한 아래→위 6효' },
  thai_astrology: { state: 'partial', scope: '출생 요일의 행성·전통 색상만 제공. 정밀 호라삿 차트·신체 상태 진단 미산출.', required: '양력 환산 생년월일, 정밀 차트는 생시·위치·역법' },
  tojeong: { state: 'not_implemented', scope: '토정비결 수리·괘문 계산 미구현. 사주 일간으로 연·월별 괘문을 대체하지 않음.', required: '적용 연도·음력 생일·전통 나이·유파별 수리와 괘문표' },
  kyusei: { state: 'partial', scope: '입춘 절입 기준 본명성만 산출. 월명성·방위반·오황살·암검살·길방위 미산출.', required: '양력 환산 생년월일, 입춘 당일은 생시' },
  taiyi: { state: 'not_implemented', scope: '태을신수 국수·16궁·주객 산법 미구현. 시대·개인 길흉을 계산한 것으로 주장하지 않음.', required: '점시·적용 역법·국수 산법·검증된 포국' },
};

export function buildDivinationCapabilityPrompt(ids: readonly DivinationToolId[]): string {
  return '[도구별 구현 범위: available도 입력과 실제 산출 결과가 있어야 계산 완료임]\n' + ids.map(id => `- ${id} [${DIVINATION_CAPABILITIES[id].state}]: ${DIVINATION_CAPABILITIES[id].scope} 필요 입력: ${DIVINATION_CAPABILITIES[id].required}.`).join('\n');
}
