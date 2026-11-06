/** Per-answer evidence, separate from the registered engine catalogue. */
export interface CalculationAuditItem {
  toolId: string;
  name: string;
  status: 'calculated' | 'partial' | 'symbolic' | 'not_implemented' | 'skipped' | 'error';
  sentToModel: boolean;
  note?: string;
  method?: string;
}

export const CALCULATION_HONESTY_RULE = `[계산 근거 정직성]
이번 요청에 상태와 데이터가 제공된 계산만 계산했다고 말한다. 전달된 상징적 관점은 사용 도구에 포함할 수 있으나 상징임을 구분한다. 등록된 엔진 개수나 마스터 모드는 실행 증거가 아니다.
해시·상징 점수를 실측값·건강 진단·검증된 예측으로 표현하지 않는다. 상징적 조언은 상징이라고 밝힌다.
계산 실패·입력 부족을 숨기거나 생년월일·출생시간·추첨 결과를 만들어내지 않는다. 근거가 없으면 일반 조언으로 답한다.`;
