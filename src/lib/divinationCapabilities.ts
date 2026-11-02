import type { DivinationToolId } from './fifteenDivinationTools';

/** Audited implementation boundaries, not claims about predictive validity. */
export const DIVINATION_CAPABILITIES: Record<DivinationToolId, { state: 'available' | 'partial' | 'symbolic' | 'not_implemented'; scope: string; required: string }> = {
  saju: { state: 'available', scope: '한국 표준시·절기 기반 사주. 용신·신강약은 간이 추정이며 해외 시간·진태양시 별도 검증 필요. 삼합 묘지 앵커 삼재(들·눌·날 3개년·복평악 등급화)와 대운수 기반 교운기(교체 전후 1~2년) 감지는 결정론 삼재·교운기 엔진(samjaeGyoUnResult)으로 직접 산출. 천을·문창·학당·문곡·천덕·월덕 6대 길신 매트릭스(공망·충형 길력 보정 포함), 세운·대운 지지 귀인 도래 타이밍, 상대 원국과의 천을귀인 인연 매칭은 결정론 길신 엔진(auspiciousStarsResult)으로 직접 산출. 자평진전 월령 본기·중기·초기 사령 투간 대조 기반 정통 10대 격국 판정(건록·양인 직취 포함), 4길신 순용·4흉신 역용 성격(成格) 검증, 상관견관·군겁쟁재·도식·신약살왕 등 파격(破格)·구응(救應) 검출, 상신(相神) 식별 및 격국별 직업·적성 리포트는 결정론 격국 엔진(geokgukResult)으로 직접 산출.', required: '양/음력·윤달·생년월일, 시주는 생시, 대운 방향은 전통 계산의 성별 기준' },
  astrology: { state: 'available', scope: '천문력 기반 서양 열대황도 행성 위치. 상승궁·MC는 확인된 생시·도시가 있을 때만 제공. 12하우스·트랜짓 미산출.', required: '생년월일·역법, 생시·출생도시·시간대' },
  ziwei: { state: 'available', scope: 'iztro 2.6.3 통행식의 12궁·주성·보성·사화·대한 계산. 중국 음력·윤달 보정·23시 익일 기준을 명시하며 유년·진태양시 미산출.', required: '출생일·현지 출생시간·전통 성별 기준' },
  tarot: { state: 'partial', scope: '실제 뽑거나 입력한 78장 카드와 정·역방향 해석 지원. 제공되지 않은 카드·배열을 뽑았다고 말하지 않음.', required: '선택 카드·방향·스프레드 위치·질문' },
  sukuyo: { state: 'partial', scope: '27숙 월별 기숙표에 한국 음력 생일을 적용한 본명숙과 두 숙의 방향별 관계 계산. 일본 구력과 차이 가능; 윤달은 계산 보류.', required: '생년월일·양음력, 관계 계산은 두 사람 정보' },
  mahabote: { state: 'partial', scope: '양력 환산 출생 요일과 수요일 정오 전후의 8요일 상징만 제공. 마하보테 7궁 명반 미산출.', required: '양력 환산 생년월일, 수요일은 생시' },
  vedic: { state: 'partial', scope: '평균 세차율 기반 항성황도 참고값·나크샤트라·파다·빔쇼타리 주기 계산. 정밀 Lahiri 천문력 아님; 경계 결과 확정 금지.', required: '지원 도시·생일·생시·역법' },
  liuren: { state: 'available', scope: '프로필 계산실·채팅 엔진에서 UTC+8 점시·천문 중기 환장에 따른 천지반·사과삼전 산출. 결과가 대화에 제공된 경우만 해석.', required: '점시·시간대·질문 및 사용자가 생성한 포국' },
  qimen: { state: 'partial', scope: '일반 기문둔갑 차보법·UTC+8 정시 포국을 프로필 계산실과 채팅에서 지원. 분 단위 절기 경계와 홍국기문 별도 수리는 미지원.', required: '점시·시간대·일반 기문 차보법 선택' },
  kabbalah: { state: 'symbolic', scope: '생명나무·세피로트의 철학적 상징 해석. 수리·이름 변환 계산이나 예측 결과로 주장하지 않음.', required: '질문·선택한 상징, 수리 계산에는 원문·변환 규칙' },
  iching: { state: 'available', scope: '프로필 계산실·채팅에서 암호학적 난수 동전법 또는 실제 6효 입력으로 본괘·변효·지괘 산출. 사용자 작괘 없이 임의 생성 금지.', required: '질문과 사용자가 생성·입력한 아래→위 6효' },
  thai_astrology: { state: 'partial', scope: '출생 요일의 행성·전통 색상만 제공. 정밀 호라삿 차트·신체 상태 진단 미산출.', required: '양력 환산 생년월일, 정밀 차트는 생시·위치·역법' },
  tojeong: { state: 'available', scope: '이지함 토정비결 수리 산법(태세수·월건수·일진수 작괘)으로 당해 연도 144괘 코드와 본괘·총론·12개월 괘상을 직접 산출. 1900~2100년 음력 역법 지원이며 사주 간지로 괘문을 대체하지 않음.', required: '양/음력·윤달 생년월일(생시 불요), 대상 연도 기본값은 현재 연도' },
  kyusei: { state: 'available', scope: '입춘 절입 연성 수리 본명성, 절월 월성 월명성, 동지·하지 근접 갑자일 일성 순행 비성으로 연·월·일 3반 9궁 포국과 오황살·암검살·세파살·월파살·본명살·본명적살, 본명성 오행 기준 상생·비화 길방위를 직접 산출. 일성 구성학 윤달(九星置閏) 예외 구간은 미지원이며 방위 이외의 택일(시간 선택)은 별도 산법.', required: '양/음력·윤달 생년월일(입춘 당일은 생시), 대상 기준일 기본값은 현재 시각' },
  taiyi: { state: 'available', scope: '태을신수 정통 16궁 연국 적년 수리 산법(당 개원 12년 기산 5원 6기 360년 대주기, 72국 순환, 태을 8정궁 3년 주기 순행, 문창·시격 성위, 주산·객산 수리, 주객 승부 판정, 삼기 대세 지수 및 오복 길성)을 결정론 엔진(taiyiResult)으로 직접 산출. 시국(時局) 단위 초미시 천문 관측치는 연국 거시 지표와 별도.', required: '양/음력·윤달 생년월일, 대상 연도 기본값은 현재 연도' },
};

export function buildDivinationCapabilityPrompt(ids: readonly DivinationToolId[]): string {
  return '[도구별 구현 범위: available도 입력과 실제 산출 결과가 있어야 계산 완료임]\n' + ids.map(id => `- ${id} [${DIVINATION_CAPABILITIES[id].state}]: ${DIVINATION_CAPABILITIES[id].scope} 필요 입력: ${DIVINATION_CAPABILITIES[id].required}.`).join('\n');
}
