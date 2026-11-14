/** Per-answer evidence, separate from the registered engine catalogue. */
export interface CalculationAuditItem {
  toolId: string;
  name: string;
  status: 'calculated' | 'partial' | 'symbolic' | 'not_implemented' | 'skipped' | 'error';
  sentToModel: boolean;
  note?: string;
  method?: string;
}

const ACTUALLY_USED_STATUSES = new Set<CalculationAuditItem['status']>(['calculated', 'partial', 'symbolic']);

/** Return only unique results or symbolic references that were actually sent to the model. */
export function getActuallyUsedCalculationAudit(
  audit: readonly CalculationAuditItem[] | null | undefined,
): CalculationAuditItem[] {
  const seen = new Set<string>();
  return (audit ?? []).filter(item => {
    if (!item.sentToModel || !ACTUALLY_USED_STATUSES.has(item.status) || seen.has(item.toolId)) return false;
    seen.add(item.toolId);
    return true;
  });
}

export interface ActuallyUsedCalculationGroup {
  status: 'calculated' | 'partial' | 'symbolic';
  label: string;
  engines: CalculationAuditItem[];
}

const ACTUALLY_USED_CALCULATION_GROUPS: readonly Pick<ActuallyUsedCalculationGroup, 'status' | 'label'>[] = [
  { status: 'calculated', label: '계산 결과' },
  { status: 'partial', label: '부분 계산' },
  { status: 'symbolic', label: '상징 참고' },
];

/** Group only deduplicated calculation evidence that was actually sent to the model. */
export function groupActuallyUsedCalculationAudit(
  audit: readonly CalculationAuditItem[] | null | undefined,
): ActuallyUsedCalculationGroup[] {
  const used = getActuallyUsedCalculationAudit(audit);
  return ACTUALLY_USED_CALCULATION_GROUPS.flatMap(group => {
    const engines = used.filter(item => item.status === group.status);
    return engines.length > 0 ? [{ ...group, engines }] : [];
  });
}

export const CALCULATION_HONESTY_RULE = `[계산 근거 정직성]
이번 요청에 상태와 데이터가 제공된 계산만 계산했다고 말한다. 전달된 상징적 관점은 사용 도구에 포함할 수 있으나 상징임을 구분한다. 등록된 엔진 개수나 마스터 모드는 실행 증거가 아니다.
해시·상징 점수를 실측값·건강 진단·검증된 예측으로 표현하지 않는다. 상징적 조언은 상징이라고 밝힌다.
계산 실패·입력 부족을 숨기거나 생년월일·출생시간·추첨 결과를 만들어내지 않는다. 근거가 없으면 일반 조언으로 답한다.`;
