/**
 * 🔊 TTS 낭독 중 문장 중앙 정렬 계산.
 *
 * 낭독이 문장 단위로 넘어갈 때마다 대화창을 "문장이 화면 중앙"에 오도록 옮긴다.
 * 이때 한 문장마다 무조건 재정렬하면, (1) 이미 무난한 위치에 있는 문장을 몇 px 움직이고,
 * (2) 직전 정렬이 끝나기 전에 다음 정렬이 겹치며, (3) 하단 자동 이동과 서로 밀어내면서
 * 화면이 위아래로 출렁인다. 그래서 "정말 보기 불편할 때만" 옮기는 판단을 여기에 모은다.
 *
 * 좌표계는 scroll 컨테이너 기준이다:
 * - targetCenterOffset: 지금 화면에서 대상 문장 중심이 컨테이너 중심에서 얼마나 떨어져 있는지(px, 아래가 +)
 * - targetRelativeTop/Bottom: 대상 문장이 컨테이너 뷰포트 안에서 놓인 위치(px)
 */

export type TtsScrollPlanInput = {
  /** 현재 컨테이너 scrollTop */
  currentTop: number;
  /** 컨테이너가 가질 수 있는 최대 scrollTop */
  maxTop: number;
  /** 대상 문장 중심 - 컨테이너 중심 (px, 아래가 +) */
  targetCenterOffset: number;
  /** 대상 문장 상단이 컨테이너 뷰포트 상단에서 떨어진 거리 */
  targetRelativeTop: number;
  /** 대상 문장 하단이 컨테이너 뷰포트 상단에서 떨어진 거리 */
  targetRelativeBottom: number;
  /** 컨테이너 높이(clientHeight) */
  containerHeight: number;
  /** 직전에 정렬한 scrollTop. 없으면 null */
  lastTargetTop: number | null;
  /** 사용자가 직접 복귀를 누른 경우처럼 무조건 중앙에 맞춰야 할 때 */
  force?: boolean;
};

export type TtsScrollPlan = {
  /** 실제로 스크롤을 옮길지 */
  scroll: boolean;
  /** 옮긴다면 목표 scrollTop */
  top: number;
  /** 부드러운 이동 시간(ms). 0이면 즉시 이동 */
  duration: number;
};

/** 화면 중앙에서 이 정도(px) 안쪽이면 낭독 위치로 충분히 읽기 좋은 자리로 본다. */
export const TTS_SCROLL_DEAD_ZONE_PX = 56;
/** 컨테이너 높이 대비 허용 오차. 작은 화면에서도 문장이 화면 안에 머문다. */
const DEAD_ZONE_RATIO = 0.22;
/** 이보다 작은 차이는 스크롤을 새로 시작할 이유가 없다. */
const NOISE_PX = 2;

export function ttsScrollDeadZone(containerHeight: number): number {
  const height = Number.isFinite(containerHeight) ? Math.max(0, containerHeight) : 0;
  return Math.max(TTS_SCROLL_DEAD_ZONE_PX, height * DEAD_ZONE_RATIO);
}

function clampTop(top: number, maxTop: number): number {
  const limit = Number.isFinite(maxTop) ? Math.max(0, maxTop) : 0;
  if (!Number.isFinite(top)) return 0;
  return Math.min(Math.max(0, Math.round(top)), limit);
}

function scrollDuration(distance: number): number {
  return Math.round(Math.min(460, Math.max(180, Math.abs(distance) * 0.4)));
}

export function planTtsScroll(input: TtsScrollPlanInput): TtsScrollPlan {
  const top = clampTop(input.currentTop + input.targetCenterOffset, input.maxTop);
  const distance = Math.abs(top - input.currentTop);

  if (!input.force) {
    // 1) 이미 읽기 좋은 자리(중앙 근처)에 있으면 움직이지 않는다.
    const deadZone = ttsScrollDeadZone(input.containerHeight);
    if (Math.abs(input.targetCenterOffset) <= deadZone) {
      return { scroll: false, top, duration: 0 };
    }

    // 2) 낭독은 아래로 진행한다. 위로 되돌리는 보정이라면, 문장이 아직 편한 띠 안에 있을 때는 두고 본다.
    const height = Math.max(0, input.containerHeight);
    const comfortableTop = height * 0.05;
    const comfortableBottom = height * 0.78;
    const insideComfortBand =
      input.targetRelativeTop >= comfortableTop && input.targetRelativeBottom <= comfortableBottom;
    if (top < input.currentTop - NOISE_PX && insideComfortBand) {
      return { scroll: false, top, duration: 0 };
    }

    // 3) 같은 자리로 또 가라는 요청(하단에 붙어 더 내려갈 수 없는 경우 등)은 반복하지 않는다.
    if (input.lastTargetTop !== null && Math.abs(top - input.lastTargetTop) <= NOISE_PX * 2) {
      return { scroll: false, top, duration: 0 };
    }
  }

  if (distance <= NOISE_PX) {
    return { scroll: false, top: input.currentTop, duration: 0 };
  }

  return { scroll: true, top, duration: scrollDuration(input.currentTop - top) };
}
