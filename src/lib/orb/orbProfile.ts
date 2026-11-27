import type { ChatTargetProfile } from '../../types/chatProfile';
import type { UserProfile } from '../sharedState';
import { calculateDetailedSaju } from '../sajuAnalysis';
import { chatProfileToUserProfile, isSelfChatProfile, resolveChatPrimaryProfile } from '../chatTargetProfiles';
import { formatOrbSajuCompatibility, formatOrbSajuPrecise, orbDayPillar, orbMonthPillar, orbYearPillar } from './orbSajuBrief';

/**
 * 🔮 오브 상담이 읽는 사주 프로필.
 *
 * 고른 상담 대상(본인 또는 궁합 상대)의 만세력·사주를 오브 마스터의 지시문에 넣고,
 * 상담 도중 대상이 바뀌면 진행 중인 음성 세션에 새 사주를 한 차례 알린다.
 */

function displayName(profile: ChatTargetProfile, userDisplayName: string): string {
  if (isSelfChatProfile(profile)) return userDisplayName || profile.name || '제제';
  return profile.name || profile.nickname || '상담 대상';
}

/** 이번 상담의 기준 대상 프로필 (없으면 null). */
export function resolveOrbActiveProfile(profiles: ChatTargetProfile[], activeProfileId?: string): ChatTargetProfile | null {
  if (!profiles?.length) return null;
  return resolveChatPrimaryProfile(profiles, activeProfileId);
}

/** 이번 상담의 기준 대상 이름 (오브 입력창 옆 프로필 칩에 쓴다). */
export function orbProfileLabel(profile: ChatTargetProfile | null | undefined, userDisplayName = '제제'): string {
  if (!profile) return userDisplayName || '제제';
  return displayName(profile, userDisplayName);
}

/**
 * 프로필 목록 + 기준 대상이 바뀌었는지 가르는 열쇠.
 * 이름·생년월일·생시·성별·관계가 하나라도 달라지면 값이 달라진다.
 */
export function orbProfileKey(profiles: ChatTargetProfile[], activeProfileId?: string): string {
  if (!profiles?.length) return 'none';
  return profiles
    .map(profile => [profile.id, profile.name, profile.birthdate, profile.birthtime || '', profile.gender, profile.lunarSolar || 'solar'].join(':'))
    .join('|') + `#${activeProfileId || ''}`;
}

/** 지시문에 넣는 사주 데이터 (한 사람 또는 궁합 두 사람 이상) — 원국·십신·용신·대운·세운·월운·일진·신살·공망·합충형파해. */
export function buildOrbProfileBrief(
  profiles: ChatTargetProfile[],
  activeProfileId: string | undefined,
  userDisplayName = '제제',
  now: Date = new Date(),
): string {
  if (!profiles?.length) return '';
  const primary = resolveChatPrimaryProfile(profiles, activeProfileId) || profiles[0];
  const primaryName = displayName(primary, userDisplayName);
  // 기준 대상을 맨 앞에 둔다: 지시문 길이 제한에 걸려도 이번 상담 대상의 사주는 빠지지 않는다.
  const ordered = [primary, ...profiles.filter(profile => profile.id !== primary.id)];
  const blocks = ordered.map((profile, index) => {
    const isPrimary = profile.id === primary.id;
    const who = isPrimary ? '★ 이번 상담의 기준 대상' : '함께 보는 대상';
    return `${who}\n${formatOrbSajuPrecise(chatProfileToUserProfile(profile, null, userDisplayName), displayName(profile, userDisplayName), now)}`;
  });
  const others = profiles.filter(profile => profile.id !== primary.id);
  // 궁합: 두 사람의 원국을 나란히 비교해 두 사람 사이의 합충·오행 상생을 지시문에 넣는다.
  const compatibility = others.length
    ? formatOrbSajuCompatibility(
      chatProfileToUserProfile(primary, null, userDisplayName),
      chatProfileToUserProfile(others[0], null, userDisplayName),
      primaryName,
      displayName(others[0], userDisplayName),
    )
    : '';
  const header = profiles.length > 1
    ? `[이번 오브 상담의 사주 데이터 — 기준 대상: ${primaryName} / 함께 보는 대상: ${others.map(profile => displayName(profile, userDisplayName)).join(' · ')}]`
    : `[이번 오브 상담의 사주 데이터 — ${primaryName}]`;
  const guide = profiles.length > 1
    ? `[안내] 위 사주는 모두 지금 상담의 대상자입니다. 풀이는 '${primaryName}'님을 기준으로 하고, 궁합·관계·시너지를 물으면 두 사람의 일간·오행 조화와 원국의 합충을 함께 보세요. 각 대상자의 이름을 정확히 구분해 부르고, 위에 없는 생년월일·사주·신살을 지어내지 마세요.`
    : `[안내] 위 사주는 지금 상담 대상자 '${primaryName}'님의 것입니다. 계산된 사주 8자·십신·대운·세운·일진만 근거로 말하고, 위에 없는 사주나 신살을 지어내지 마세요.`;
  return [header, ...blocks, ...(compatibility ? [compatibility] : []), guide].join('\n');
}

/** 상담 중 대상이 바뀌었을 때 진행 중인 음성 세션에 한 차례로 보내는 안내. */
export function buildOrbProfileChangeNote(
  profiles: ChatTargetProfile[],
  activeProfileId: string | undefined,
  userDisplayName = '제제',
  now: Date = new Date(),
): string {
  if (!profiles?.length) return '';
  const primary = resolveChatPrimaryProfile(profiles, activeProfileId) || profiles[0];
  const name = displayName(primary, userDisplayName);
  const others = profiles.filter(profile => profile.id !== primary.id).map(profile => displayName(profile, userDisplayName));
  let chart = '';
  let timing = '';
  try {
    const saju = calculateDetailedSaju(chatProfileToUserProfile(primary, null, userDisplayName));
    if (saju) {
      const pillars = [saju.pillars.year, saju.pillars.month, saju.pillars.day, saju.pillars.hour]
        .map(pillar => (pillar ? pillar.full : '시간미입력'))
        .join(' ');
      chart = `사주 8자: ${pillars} · 일간: ${saju.dayMaster.korean}(${saju.dayMaster.element})`;
    }
    const year = orbYearPillar(now);
    const month = orbMonthPillar(now);
    const day = orbDayPillar(now);
    timing = `오늘 세운 ${year.label}·월운 ${month.label}·일진 ${day.label}`;
  } catch { chart = ''; timing = ''; }
  const gender = primary.gender === 'female' ? '여성' : primary.gender === 'male' ? '남성' : '기타';
  const birth = `${primary.birthdate}${primary.birthtime ? ` ${primary.birthtime}` : ' (태어난 시간 모름)'} ${gender} ${primary.lunarSolar === 'lunar' ? '음력' : '양력'}`;
  const company = others.length ? ` 함께 보는 대상: ${others.join(' · ')}.` : '';
  return `[상담 대상이 바뀌었습니다] 이제부터 '${name}'님의 사주로 풀이해 주세요. ${birth}. ${chart ? `${chart}. ` : ''}${timing ? `${timing}. ` : ''}${company}`
    + ' 이 안내는 소리 내어 읽지 말고, 바뀐 대상만 한 문장으로 짧게 확인한 뒤 이어서 상담하세요.';
}

/** 오브 도구(사주 계산)가 쓰는 대상 프로필 — 기준 대상과(궁합이면) 상대 한 명. */
export function orbToolProfiles(
  profiles: ChatTargetProfile[],
  activeProfileId: string | undefined,
  base: UserProfile | null | undefined,
  userDisplayName = '제제',
): { profile: UserProfile | null; partnerProfile: UserProfile | null } {
  if (!profiles?.length) return { profile: base || null, partnerProfile: null };
  const primary = resolveChatPrimaryProfile(profiles, activeProfileId) || profiles[0];
  const partner = profiles.find(profile => profile.id !== primary.id) || null;
  return {
    profile: chatProfileToUserProfile(primary, base, userDisplayName),
    partnerProfile: partner ? chatProfileToUserProfile(partner, null, userDisplayName) : null,
  };
}
