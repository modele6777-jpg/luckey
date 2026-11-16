/**
 * =========================================================================
 * LUCKEY 대화 속 인연 자동 감지 & 듀얼 매트릭스 백그라운드 로드 엔진
 * (Contextual Synastry & Dual Matrix Background Loader)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. 대화 속 관계 맥락 실시간 감지 (Contextual Relationship Detection):
 *    - 대화 텍스트에서 연인·썸·배우자·동업자·친구·가족 등 인연 키워드와 감정선을 감지
 *    - 텍스트 내 상대방 이름, 생년월일(199X-XX-XX, 9X년생 등), 별자리 언급 패턴 추출
 * 2. 다자간 상담 프로필(ChatTargetProfile) 백그라운드 자동 바인딩:
 *    - 로컬스토리지(lucy_chat_active_profiles_permanent)에 보존된 프로필 중
 *      본인(isMe)이 아닌 상대방 프로필을 대화 맥락과 즉시 매칭
 * 3. 듀얼 매트릭스 궁합(Dual Matrix Synastry) 백그라운드 0ms 즉각 연산:
 *    - 본인 사주 × 상대방 사주의 결정론적 수리 매트릭스(천간합·일지육합·충·원진살)
 *    - 상호 부족한 오행을 채워주는 '오행 상호 보완도(Complementarity)' 수리 연산
 *    - 밀교 숙요경 27숙 6대 카르마 인연 관계(영친·안괴·우쇠·성위·업태·명)
 *    - 서양 점성술 태양 별자리 4원소(불·흙·공기·물) 시나스트리 조화도
 *    - 0~100점 종합 궁합 점수 및 5대 인연 등급(천생연분~자극성장) 산출
 * 4. 프로필 미등록 시 스마트 가이드:
 *    - 상대방 생년월일 부재 시에도 관계 유형별 역학 팁을 제시하고
 *      생년월일 추가 시 즉시 듀얼 매트릭스가 열리는 온보딩 프롬프트 주입
 */

import type { UserProfile } from '../sharedState';
import type { ChatTargetProfile } from '../../types/chatProfile';
import { safeLocalStorage } from '../../utils/safeStorage';
import {
  calculateDeterministicCompatibility,
  type CompatibilityAnalysisResult,
} from './deterministicCompatibility';

export type DetectedRelationshipCategory =
  | 'romantic_partner'   // 연인, 애인, 여친, 남친, 와이프, 남편, 배우자
  | 'crush_some'          // 썸, 짝사랑, 호감, 소개팅, 미팅
  | 'business_partner'    // 동업자, 파트너, 팀원, 상사, 동료, 대표, 클라이언트
  | 'friendship'          // 친구, 베프, 절친, 동창, 지인
  | 'family'              // 부모님, 엄마, 아빠, 형제, 자매, 자식
  | 'general_interpersonal'; // 일반 대인관계, 갈등, 화해

export interface ContextualRelationshipEntity {
  detectedCategory: DetectedRelationshipCategory;
  categoryKoName: string;
  detectedKeywords: string[];
  mentionedName?: string;
  extractedBirthdate?: string;
  confidence: number; // 0.0 ~ 1.0
}

export interface ContextualSynastryResult {
  engineVersion: string;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  timestamp: number;

  hasRelationshipContext: boolean;
  relationshipEntity: ContextualRelationshipEntity | null;

  // 상대방 프로필 로드 상태
  partnerProfileLoaded: boolean;
  partnerSource: 'registered_profile' | 'text_extracted' | 'placeholder_guide';
  partnerProfileSummary?: {
    name: string;
    relationshipTag: string;
    birthdate?: string;
    birthtime?: string;
    gender?: string;
  };

  // 듀얼 궁합 매트릭스 계산 결과
  compatibilityMatrix?: CompatibilityAnalysisResult | null;

  // 상대방 정보 미입력 시 스마트 상담 가이드
  conversationalGuidance: {
    recommendedStance: string;
    suggestedInvitation: string;
    keyDynamicNote: string;
  };
  situationalSynastryAudit: {
    focusTheme: string;
    bondNote: string;
    tacticalStep: string;
  };
  temporalSynastryRhythm: {
    kstTimeLabel: string;
    dialogueWindow: string;
    seasonalBondTone: string;
    temporalGuidance: string;
  };
  synastrySynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  reflectiveQuestion: string;
  boundaryNotice: string;
}

function getTemporalSynastryRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const dialogueWindow =
    hour >= 5 && hour < 11
      ? '아침 맑은 대화창 — 선입견 없이 상대의 입장을 담백하게 헤아리기 좋은 시간'
      : hour >= 11 && hour < 17
        ? '정오 조율창 — 실질적인 약속이나 협력의 경계를 분명히 맞추기 좋은 시간'
        : hour >= 17 && hour < 22
          ? '황혼 공감창 — 감정의 온도를 부드럽게 나누고 오해를 풀기 좋은 시간'
          : '심야 성찰창 — 즉각적인 연락보다 내 마음의 기대와 경계를 먼저 정리할 시간';

  const seasonalBondTone =
    month >= 3 && month <= 5
      ? '봄 · 인연 발아절 (새로운 연결이 가볍게 싹트는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 교감 확장절 (솔직한 표현과 활력이 관계를 이끄는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 신뢰 결실절 (약속과 현실적 호흡이 깊어지는 시기)'
          : '겨울 · 내면 정돈절 (서로의 고유한 공간을 존중하며 내실을 다지는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`,
    dialogueWindow,
    seasonalBondTone,
    temporalGuidance: `${dialogueWindow} · ${seasonalBondTone}의 흐름에 맞추어 소통하십시오.`,
  };
}

const RELATION_KEYWORDS: Record<DetectedRelationshipCategory, { koName: string; regex: RegExp; stance: string; dynamic: string }> = {
  romantic_partner: {
    koName: '연인 · 배우자 관계',
    regex: /(여자\s*친구|여친|남자\s*친구|남친|애인|연인|와이프|아내|남편|배우자|결혼|동거|그\s*사람|그녀|그\s*이)/i,
    stance: '두 사람의 정서적 일체감과 가치관 합치도, 일상 속 안정감에 집중',
    dynamic: '천간합(정서적 끌림)과 일지육합(생활의 안식처), 숙요 영친·업태 인연이 핵심 축으로 작용합니다.'
  },
  crush_some: {
    koName: '썸 · 짝사랑 · 호감 관계',
    regex: /(썸|썸녀|썸남|짝사랑|호감|소개팅|미팅|고백|연락|플러팅|데이트|마음이\s*있는|관심\s*있는)/i,
    stance: '초기 호기심과 긴장감, 상대방의 숨은 속마음과 다가서기 좋은 타이밍에 집중',
    dynamic: '도화살과 천을귀인, 점성술 원소 호환성이 초반 케미스트리를 크게 좌우합니다.'
  },
  business_partner: {
    koName: '동업자 · 비즈니스 파트너',
    regex: /(동업|파트너|공동\s*창업|팀원|직장\s*동료|동료|상사|부하|팀장|대표|투자자|클라이언트|거래처|협업)/i,
    stance: '현실적 목표 달성력, 역할 분담의 명확성, 재물운 상생 시너지에 집중',
    dynamic: '숙요 성위(成危) 관계 및 사주 오행 상호 보완도가 비즈니스 시너지의 성패를 가릅니다.'
  },
  friendship: {
    koName: '친구 · 지인 관계',
    regex: /(친구|베프|절친|동창|룸메|친구들|선배|후배|지인)/i,
    stance: '편안한 티키타카와 정서적 지지, 부담 없는 동반자적 유대감에 집중',
    dynamic: '숙요 우쇠(友衰) 및 동일 삼합 오행이 격의 없는 오랜 우정을 만듭니다.'
  },
  family: {
    koName: '가족 · 부모자식 관계',
    regex: /(부모님|엄마|어머니|아빠|아버지|형|누나|오빠|언니|동생|자식|아들|딸|가족)/i,
    stance: '무조건적인 수용과 카르마적 이해, 세대 간 소통 방식의 다름을 조율',
    dynamic: '사주 월주와 연주의 상생 작용 및 뿌리 깊은 전생적 인연 고리가 작용합니다.'
  },
  general_interpersonal: {
    koName: '일반 대인관계',
    regex: /(인간\s*관계|대인\s*관계|사람\s*관계|갈등|오해|싸움|화해|어색|거리감)/i,
    stance: '심리적 경계선 존중과 오해 없는 솔직한 커뮤니케이션에 집중',
    dynamic: '서로의 기질적 결핍 오행을 알아차릴 때 불필요한 감정 소모를 예방할 수 있습니다.'
  }
};

/**
 * 텍스트에서 관계성 맥락과 엔티티를 자동 추출합니다.
 */
export function detectRelationshipContext(text: string): ContextualRelationshipEntity | null {
  if (!text || text.trim().length === 0) return null;
  const clean = text.trim();

  let matchedCategory: DetectedRelationshipCategory | null = null;
  let matchedKeywords: string[] = [];

  for (const [cat, meta] of Object.entries(RELATION_KEYWORDS) as [DetectedRelationshipCategory, typeof RELATION_KEYWORDS[DetectedRelationshipCategory]][]) {
    const match = clean.match(meta.regex);
    if (match) {
      matchedCategory = cat;
      matchedKeywords = [match[0]];
      break;
    }
  }

  if (!matchedCategory) return null;

  // 텍스트 내 생년월일 패턴 추출 시도 (예: 1995-04-12, 95년생, 95년 4월 등)
  let extractedBirthdate: string | undefined;
  const fullDateMatch = clean.match(/(19\d{2}|20\d{2})[-./](0?[1-9]|1[0-2])[-./](0?[1-9]|[12]\d|3[01])/);
  if (fullDateMatch) {
    const y = fullDateMatch[1];
    const m = fullDateMatch[2].padStart(2, '0');
    const d = fullDateMatch[3].padStart(2, '0');
    extractedBirthdate = `${y}-${m}-${d}`;
  }

  // 상대방 이름 추출 시도 (예: "지은이랑", "민수와의", "은우는")
  let mentionedName: string | undefined;
  const nameMatch = clean.match(/([가-힣]{2,4})(?:이?랑|와|과|이?는|이?가|이?의|씨)/);
  if (nameMatch) {
    const candidate = nameMatch[1];
    const excludeWords = ['오늘', '지금', '어제', '내일', '우리', '사람', '친구', '엄마', '아빠', '여친', '남친', '동료', '상사', '동업', '누나', '형', '오빠', '언니'];
    if (!excludeWords.includes(candidate)) {
      mentionedName = candidate;
    }
  }

  return {
    detectedCategory: matchedCategory,
    categoryKoName: RELATION_KEYWORDS[matchedCategory].koName,
    detectedKeywords: matchedKeywords,
    mentionedName,
    extractedBirthdate,
    confidence: matchedCategory === 'romantic_partner' || matchedCategory === 'crush_some' ? 0.95 : 0.88,
  };
}

/**
 * 저장된 다자간 프로필(ChatTargetProfile) 목록을 안전하게 로드합니다.
 */
export function getSavedChatTargetProfiles(): ChatTargetProfile[] {
  try {
    const saved = safeLocalStorage.getItem('lucy_chat_active_profiles_permanent');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed;
  } catch (_) {}
  return [];
}

/**
 * ChatTargetProfile을 UserProfile 포맷으로 정규화 변환합니다.
 */
export function targetProfileToUserProfile(target: ChatTargetProfile): UserProfile {
  return {
    basic: {
      name: target.name || '상대방',
      birthdate: target.birthdate || '1995-05-05',
      birthtime: target.birthtime || '12:00',
      gender: target.gender || 'other',
      birthCity: target.birthCity || '서울',
      lunarSolar: target.lunarSolar || 'solar',
      isLeapMonth: target.isLeapMonth || false,
      nickname: target.name || '상대방',
    },
    fate: {
      fateInterests: ['사주', '숙요', '별자리'],
    },
  };
}

/**
 * 대화 텍스트와 본인 프로필을 대조하여
 * 관계 맥락 감지 및 백그라운드 듀얼 매트릭스 궁합을 즉시 로드합니다.
 */
export function calculateContextualSynastry(options: {
  questionText?: string;
  myProfile?: UserProfile;
  currentProfiles?: ChatTargetProfile[];
  targetDate?: Date;
}): ContextualSynastryResult {
  const now = options.targetDate || new Date();
  const nowUtcIso = now.toISOString();
  const nowKstIso = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().replace('Z', '+09:00');

  const question = (options.questionText || '').trim();
  const relEntity = detectRelationshipContext(question);

  // 다자간 상담 프로필 조회 (인자 전달값 최우선, 없으면 스토리지 조회)
  const allProfiles = options.currentProfiles && options.currentProfiles.length > 0
    ? options.currentProfiles
    : getSavedChatTargetProfiles();

  // 본인(me)이 아닌 상대방 프로필 필터링
  const partnerCandidates = allProfiles.filter(p => !p.isMe && p.relationship !== '본인');

  let matchedPartner: ChatTargetProfile | null = null;
  let partnerSource: ContextualSynastryResult['partnerSource'] = 'placeholder_guide';

  if (relEntity?.mentionedName) {
    // 1. 대화에서 언급된 이름과 일치하는 프로필 최우선 탐색
    matchedPartner = partnerCandidates.find(p => p.name === relEntity.mentionedName) || null;
  }

  if (!matchedPartner && relEntity) {
    // 2. 관계 태그와 일치하는 프로필 탐색
    if (relEntity.detectedCategory === 'romantic_partner' || relEntity.detectedCategory === 'crush_some') {
      matchedPartner = partnerCandidates.find(p => p.relationship === '연인' || p.relationship === '썸') || null;
    } else if (relEntity.detectedCategory === 'business_partner') {
      matchedPartner = partnerCandidates.find(p => p.relationship === '동업자' || p.relationship === '동료') || null;
    } else if (relEntity.detectedCategory === 'friendship') {
      matchedPartner = partnerCandidates.find(p => p.relationship === '친구') || null;
    } else if (relEntity.detectedCategory === 'family') {
      matchedPartner = partnerCandidates.find(p => p.relationship === '가족') || null;
    }
  }

  // 3. 일치하는 프로필이 없지만 첫 번째 상대방 프로필이 있는 경우 기본 로드
  if (!matchedPartner && partnerCandidates.length > 0) {
    matchedPartner = partnerCandidates[0];
  }

  // 4. 텍스트에서 생년월일이 직접 추출된 경우 가상 프로필 생성
  if (!matchedPartner && relEntity?.extractedBirthdate) {
    matchedPartner = {
      id: 'extracted-partner-temp',
      name: relEntity.mentionedName || '상대방',
      birthdate: relEntity.extractedBirthdate,
      birthtime: '12:00',
      gender: 'other',
      relationship: relEntity.categoryKoName,
    };
    partnerSource = 'text_extracted';
  } else if (matchedPartner) {
    partnerSource = 'registered_profile';
  }

  // 듀얼 궁합 매트릭스 계산
  let compatibilityMatrix: CompatibilityAnalysisResult | null = null;
  const myProfile = options.myProfile || {
    basic: {
      name: '나',
      birthdate: '1994-01-24',
      birthtime: '12:00',
      gender: 'male',
      birthCity: '서울',
    }
  };

  if (matchedPartner && matchedPartner.birthdate) {
    try {
      const partnerUserProfile = targetProfileToUserProfile(matchedPartner);
      compatibilityMatrix = calculateDeterministicCompatibility(myProfile, partnerUserProfile);
    } catch (_) {}
  }

  // 대화 가이드라인 구성
  const categoryMeta = relEntity ? RELATION_KEYWORDS[relEntity.detectedCategory] : null;
  const conversationalGuidance = {
    recommendedStance: categoryMeta?.stance || '상대방과의 기질 차이를 존중하며 균형 있는 상호 작용 모색',
    keyDynamicNote: categoryMeta?.dynamic || '사주 천간합과 숙요경 27숙 인연 관계가 전반적인 관계의 기류를 주도합니다.',
    suggestedInvitation: matchedPartner
      ? `현재 등록된 [${matchedPartner.name}] 님과의 실측 듀얼 매트릭스 데이터를 바탕으로 답변합니다.`
      : '상대방의 생년월일이나 별자리를 알려주시면 1초 만에 듀얼 매트릭스 궁합을 정밀 연산해 드립니다.',
  };

  const temporalSynastryRhythm = getTemporalSynastryRhythm(now);
  const situationalSynastryAudit = {
    focusTheme: relEntity ? `${relEntity.categoryKoName} · 맥락 조율` : '인연 맥락 대기',
    bondNote: conversationalGuidance.keyDynamicNote,
    tacticalStep: conversationalGuidance.recommendedStance,
  };
  const synastrySynthesisMatrix = {
    coreInsight: compatibilityMatrix ? `${compatibilityMatrix.grade} — ${compatibilityMatrix.title}` : conversationalGuidance.recommendedStance,
    recommendedAction: conversationalGuidance.suggestedInvitation,
    cautionNotice: '상대의 기질 차이를 통제하려 들지 말고 서로의 경계와 속도를 존중하십시오.',
  };

  return {
    engineVersion: 'LUCKEY-CS-DME-v2.1.0',
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: temporalSynastryRhythm.kstTimeLabel,
    timestamp: now.getTime(),

    hasRelationshipContext: Boolean(relEntity || matchedPartner),
    relationshipEntity: relEntity,

    partnerProfileLoaded: Boolean(matchedPartner && compatibilityMatrix),
    partnerSource,
    partnerProfileSummary: matchedPartner ? {
      name: matchedPartner.name,
      relationshipTag: matchedPartner.relationship || '인연',
      birthdate: matchedPartner.birthdate,
      birthtime: matchedPartner.birthtime,
      gender: matchedPartner.gender,
    } : undefined,

    compatibilityMatrix,
    conversationalGuidance,
    situationalSynastryAudit,
    temporalSynastryRhythm,
    synastrySynthesisMatrix,
    reflectiveQuestion: matchedPartner && compatibilityMatrix
      ? `${matchedPartner.name} 님과의 ${compatibilityMatrix.grade}(${compatibilityMatrix.title}) 흐름 속에서 오늘 서로의 경계를 지키며 먼저 건넬 따뜻한 말 한마디는 무엇입니까?`
      : `${relEntity ? `${relEntity.categoryKoName}의 ` : ''}관계 흐름을 조율하기 위해 지금 상대에게 확인하거나 표현하고 싶은 본심은 무엇입니까?`,
    boundaryNotice: '본 결과는 사주·숙요·점성술 원형과 대화 맥락을 결합한 정성적 관계 가이드이며, 상대의 마음을 단정하는 예측이 아닙니다.',
  };
}

/**
 * 인연 자동 감지 및 듀얼 매트릭스 리포트를
 * LLM 마스터 프롬프트에 주입하기 위해 고밀도 구조화 텍스트로 변환합니다.
 */
export function formatContextualSynastryPrompt(res: ContextualSynastryResult): string {
  if (!res.hasRelationshipContext) return '';

  const ent = res.relationshipEntity;
  const mat = res.compatibilityMatrix;
  const partner = res.partnerProfileSummary;

  let matrixBlock = '';
  if (mat && partner) {
    const complementTone = mat.saju.elementComplement.score >= 80 ? '높은 상호 보완' : mat.saju.elementComplement.score >= 60 ? '안정적 조화' : '각별한 배려 필요';
    matrixBlock = `
[👥 실측 듀얼 매트릭스 궁합 데이터 (Dual Matrix Synastry)]:
======================================================================
상대방 대상: ${partner.name} (${partner.relationshipTag} · ${partner.birthdate || '생년월일 미상'})
인연 등급 및 결: ★ [${mat.grade}] · "${mat.title}"
요약: ${mat.summary}

1. 사주 결합 분석:
   - 본인 일간: ${mat.saju.personA.dayMaster} (${mat.saju.personA.dominantElement}) vs 상대 일간: ${mat.saju.personB.dayMaster} (${mat.saju.personB.dominantElement})
   - 천간 관계: ${mat.saju.stemRelation.name} (${mat.saju.stemRelation.desc})
   - 일지 관계: ${mat.saju.branchRelation.name} (${mat.saju.branchRelation.desc})
   - 오행 상호 보완 기조: ${complementTone} (${mat.saju.elementComplement.summary})
     * 나에게 부족해 상대에게 채우는 기운: [${mat.saju.elementComplement.aNeedsFromB.join(', ') || '없음(자급)'}]
     * 상대에게 부족해 내가 채워주는 기운: [${mat.saju.elementComplement.bNeedsFromA.join(', ') || '없음(자급)'}]

2. 숙요 27숙 카르마 인연:
   - 관계: ★ ${mat.sukuyo.relationName} (${mat.sukuyo.relationType})
   - 본명숙: 본인 [${mat.sukuyo.mansionA}] ⇄ 상대 [${mat.sukuyo.mansionB}]
   - 인연의 성격: ${mat.sukuyo.meaning}

3. 서양 점성술 시나스트리:
   - 태양 별자리: 본인 [${mat.astrology.sunA}](${mat.astrology.elementA} 원소) ⇄ 상대 [${mat.astrology.sunB}](${mat.astrology.elementB} 원소)
   - 원소 조화도: ${mat.astrology.harmonyDesc}
======================================================================`;
  } else {
    matrixBlock = `
[👥 관계 맥락 감지됨 · 상대방 생년월일 미입력 상태]:
======================================================================
관계 분류: ${ent?.categoryKoName || '대인관계'}
감지된 키워드: ${ent?.detectedKeywords.join(', ') || '인연'}
추천 상담 스탠스: ${res.conversationalGuidance.recommendedStance}
핵심 역학 노트: ${res.conversationalGuidance.keyDynamicNote}
안내 가이드: 루시는 질문에 지혜롭게 답하면서, "${res.conversationalGuidance.suggestedInvitation}"라는 점을 부드럽게 곁들여줘.
======================================================================`;
  }

  return `[👥 대화 속 인연 자동 감지 & 듀얼 매트릭스 백그라운드 로드 (Contextual Synastry Engine)]
======================================================================
엔진 버전: ${res.engineVersion} | 기준 일시: ${res.calculatedAtKst}
관계 감지 상태: ${ent ? `[${ent.categoryKoName}] 감지` : '등록된 상대방 프로필 로드'}
상대방 프로필 연동: ${res.partnerProfileLoaded ? `성공 (${partner?.name})` : '미연동(가이드 모드)'}
${matrixBlock}
- 질문 맥락 감사 (${res.situationalSynastryAudit.focusTheme}): ${res.situationalSynastryAudit.tacticalStep}
- KST 시공간 리듬: ${res.temporalSynastryRhythm.dialogueWindow} / ${res.temporalSynastryRhythm.seasonalBondTone}
- 교차 매트릭스: 핵심(${res.synastrySynthesisMatrix.coreInsight}) | 실행(${res.synastrySynthesisMatrix.recommendedAction}) | 주의(${res.synastrySynthesisMatrix.cautionNotice})
- 성찰 질문: ${res.reflectiveQuestion}
- 해석 경계: ${res.boundaryNotice}
======================================================================
[★ 루시 관계 상담 지침]:
- 상대방과의 실측 듀얼 매트릭스가 제공된 경우, 두 사람의 천간합·일지육합, 오행 보완 기조, 숙요 27숙 인연 등급을 유기적으로 녹여내어 입체적이고 다정한 해답을 줘.
- 상대방을 통제하려 하기보다 서로의 기질적 차이를 인정하고 배려하는 지혜로운 관계 성장의 길을 제시해줘.`;
}
