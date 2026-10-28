import type { UserProfile } from '../sharedState';
import { calculateZiwei, calculateSukuyo, calculateVedic } from './birthCharts';
export function buildAdditionalBirthDigest(profile?: UserProfile): string {
  return ([['자미두수',calculateZiwei],['숙요',calculateSukuyo],['베딕 참고 계산',calculateVedic]] as const).map(([name,calculate])=>{
    try { return `- ${name} 실제 산출: ${JSON.stringify(calculate(profile))}`; }
    catch(error) { return `- ${name} 산출 보류: ${error instanceof Error?error.message:'입력을 확인하세요.'}`; }
  }).join('\n');
}
