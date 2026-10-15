import type { SharedState } from "./sharedState";
import { calculateDetailedSaju } from "./sajuAnalysis";

export interface RealtimeBiometrics {
  fatigue: number;
  stress: number;
  focus: number;
  sleepScore: number;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function getKstHour(): number {
  const hourStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    hour: "numeric",
    hour12: false,
  }).format(new Date());
  return Number.parseInt(hourStr, 10);
}

function getHistoryTimestamp(item: unknown): number {
  if (!item || typeof item !== "object") return 0;
  const entry = item as Record<string, unknown>;
  const createdAt = entry.createdAt;
  if (createdAt && typeof createdAt === "object") {
    if ("seconds" in createdAt && typeof (createdAt as { seconds: unknown }).seconds === "number") {
      return Number((createdAt as { seconds: number }).seconds) * 1000;
    }
    if (typeof (createdAt as { toMillis?: () => number }).toMillis === "function") {
      try {
        return (createdAt as { toMillis: () => number }).toMillis();
      } catch (_) {}
    }
    if (typeof (createdAt as { toDate?: () => Date }).toDate === "function") {
      try {
        return (createdAt as { toDate: () => Date }).toDate().getTime();
      } catch (_) {}
    }
  }
  if (typeof entry.timestamp === "number" && !isNaN(entry.timestamp)) return entry.timestamp;
  if (typeof entry.createdAt === "number" && !isNaN(entry.createdAt)) return entry.createdAt;
  if (typeof entry.createdAt === "string") {
    const parsed = Date.parse(entry.createdAt);
    if (!isNaN(parsed)) return parsed;
  }
  if (typeof entry.timestamp === "string") {
    const parsed = Date.parse(entry.timestamp);
    if (!isNaN(parsed)) return parsed;
  }
  if (typeof entry.date === "string") {
    const parsed = Date.parse(entry.date);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
}

function countTodayActivity(state: SharedState | null): number {
  if (!state) return 0;
  const today = new Date().toDateString();
  const histories = [
    state.trinityHistory,
    state.museHistory,
    state.orangeHistory,
    state.bluebirdHistory,
    state.healHistory,
    state.epilogueHistory,
    state.prologueHistory,
  ];

  let count = 0;
  for (const history of histories) {
    if (!Array.isArray(history)) continue;
    for (const item of history) {
      if (!item) continue;
      const ts = getHistoryTimestamp(item);
      if (ts > 0) {
        try {
          if (new Date(ts).toDateString() === today) count += 1;
        } catch (_) {}
      }
    }
  }
  return count;
}

function vibeAdjustment(vibe?: string): { fatigue: number; stress: number; focus: number } {
  if (!vibe || typeof vibe !== "string") return { fatigue: 0, stress: 0, focus: 0 };
  const lower = vibe.toLowerCase();
  let fatigue = 0;
  let stress = 0;
  let focus = 0;

  if (/피로|지침|무기력|쓰러|탈진/.test(lower)) fatigue += 12;
  if (/불안|스트레스|초조|긴장|무거|답답/.test(lower)) stress += 14;
  if (/평온|차분|평화|안정|맑|고요|편안/.test(lower)) stress -= 10;
  if (/몰입|집중|열정|활력|영감|창의/.test(lower)) focus += 12;
  if (/상쾌|가벼|밝/.test(lower)) fatigue -= 6;

  return { fatigue, stress, focus };
}

function profileAdjustment(state: SharedState | null): { fatigue: number; stress: number } {
  const mood = state?.userProfile?.psych?.currentMood || "";
  const symptoms = state?.userProfile?.psych?.currentSymptoms || "";
  const combined = `${mood} ${symptoms}`;
  let fatigue = 0;
  let stress = 0;

  if (/피곤|피로|졸림|탈진/.test(combined)) fatigue += 10;
  if (/불안|스트레스|우울|긴장|두통/.test(combined)) stress += 10;

  return { fatigue, stress };
}

function sajuAdjustment(state: SharedState | null, hour: number): { fatigue: number; stress: number; focus: number } {
  try {
    if (!state?.userProfile?.basic?.birthdate) return { fatigue: 0, stress: 0, focus: 0 };
    const saju = calculateDetailedSaju(state.userProfile);
    if (!saju || !saju.elements?.dominant || !saju.elements?.lacking) return { fatigue: 0, stress: 0, focus: 0 };

    let fatigue = 0;
    let stress = 0;
    let focus = 0;

    const dom = saju.elements.dominant.element;
    const lack = saju.elements.lacking.element;

    // 일간 및 오행 영향
    if (dom === '화') {
      // 화 기운 강함: 오후/저녁 시간대 집중도 상승 및 에너지 소진성 피로
      if (hour >= 13 && hour <= 20) {
        focus += 4;
        stress += 3;
      }
    } else if (dom === '수') {
      // 수 기운 강함: 깊은 집중력과 차분함
      focus += 5;
      stress -= 4;
    } else if (dom === '목') {
      // 목 기운 강함: 아침 활력
      if (hour >= 6 && hour <= 12) focus += 5;
    } else if (dom === '금') {
      // 금 기운 강함: 완벽주의로 인한 저녁 피로
      if (hour >= 18) fatigue += 3;
    } else if (dom === '토') {
      // 토 기운 강함: 안정감
      stress -= 3;
    }

    // 결핍 기운에 따른 미세 보정
    if (lack === '수') fatigue += 3; // 수기 부족시 만성 건조/피로
    if (lack === '목' && (hour >= 6 && hour <= 11)) fatigue += 3; // 목기 부족시 아침 둔감

    return { fatigue, stress, focus };
  } catch (_) {
    return { fatigue: 0, stress: 0, focus: 0 };
  }
}

export function computeRealtimeBiometrics(state: SharedState | null): RealtimeBiometrics {
  try {
    const hour = getKstHour();
    let fatigue = 22;
    let stress = 28;
    let focus = 42;
    let sleepScore = 78;

    if (hour >= 6 && hour < 12) {
      fatigue = 18;
      stress = 22;
      focus = 55;
      sleepScore = 82;
    } else if (hour >= 12 && hour < 18) {
      fatigue = 34;
      stress = 31;
      focus = 47;
      sleepScore = 74;
    } else if (hour >= 18 && hour < 22) {
      fatigue = 46;
      stress = 36;
      focus = 35;
      sleepScore = 68;
    } else {
      fatigue = 54;
      stress = 29;
      focus = 20;
      sleepScore = 61;
    }

    const activityCount = countTodayActivity(state);
    focus = clamp(focus + activityCount * 4);
    stress = clamp(stress - activityCount * 2);
    fatigue = clamp(fatigue + Math.max(0, activityCount - 2));

    const vibe = vibeAdjustment(state?.currentVibe);
    fatigue = clamp(fatigue + vibe.fatigue);
    stress = clamp(stress + vibe.stress);
    focus = clamp(focus + vibe.focus);

    const profile = profileAdjustment(state);
    fatigue = clamp(fatigue + profile.fatigue);
    stress = clamp(stress + profile.stress);

    const sajuAdj = sajuAdjustment(state, hour);
    fatigue = clamp(fatigue + sajuAdj.fatigue);
    stress = clamp(stress + sajuAdj.stress);
    focus = clamp(focus + sajuAdj.focus);

    return { fatigue, stress, focus, sleepScore };
  } catch (err) {
    console.warn("computeRealtimeBiometrics error:", err);
    return { fatigue: 25, stress: 25, focus: 50, sleepScore: 75 };
  }
}