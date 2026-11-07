import type { SajuAnalysisResult } from '../sajuAnalysis';
/** Same result type/calculator as the profile's SajuCardView, not a second AI-generated preview. */
export function buildFatePreviewPrompt(result:SajuAnalysisResult|null) {
  if(!result?.hasBirthInfo) return '[프로필 운명 프리뷰] 유효한 출생정보가 없어 미산출. 생일·역법·윤달을 확인하고 빈 원국을 임의 생성하지 마.';
  const {birthdate,birthtime,isLunar,solarEquivalentDate,pillars,dayMaster,elements,geokguk,bodyStrength,specialStructures,webAppParameters,yongsin,yongsinDetails,annual2026,daeun,daewunDetail}=result;
  return `[프로필 운명 프리뷰 실제 자료]\n프로필 화면 SajuCardView와 동일한 calculateDetailedSaju 결과야. 저장된 현재 상담 대상의 출생정보에서 다시 산출했으므로 다른 사람·이전 생일의 프리뷰를 섞지 마.\n${JSON.stringify({birthdate,birthtime,isLunar,solarEquivalentDate,pillars,dayMaster:{hanja:dayMaster.hanja,korean:dayMaster.korean,element:dayMaster.element},elements,geokguk,bodyStrength,specialStructures,webAppParameters,yongsin,yongsinDetails,annual:annual2026,daeun,daewunDetail,timePolicy:result.timePolicy})}\n${result.timePolicy?.summary || '한국 표준시 벽시계·시주 30분 보정·23:30 일주 경계이며 진태양시는 미보정.'} 용신·격국·신강약은 간이 추정, 점수는 앱의 상징 지표이며 수익률·건강 진단·합격 확률이 아니야. 생시가 없으면 시주를 채우지 말고 성별 기준이 없으면 대운 방향을 확정하지 마. 오행 개수가 같으면 하나만 중심 기운으로 말하지 말고 일간 오행을 따로 말해. 사용자가 프리뷰를 물으면 표시된 실제 값부터 설명하고 관련 있는 항목만 상담에 활용해.`;
}
