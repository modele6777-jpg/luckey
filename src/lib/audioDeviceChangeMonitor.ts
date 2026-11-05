/**
 * 오디오 출력 장치 변경(이어폰 분리/스피커 전환) 실시간 감지 및 TTS 안전 자동 정지 모니터
 *
 * 사용자가 이어폰(에어팟, 블루투스 이어폰/헤드폰, 유선 이어폰 등)을 착용하고 음성을 듣다가
 * 이어폰 연결이 끊기거나 오디오 출력이 스피커로 전환되는 순간을 감지하여,
 * 조용한 도서관이나 대중교통 등 공공장소에서 스피커로 소리가 갑자기 울려 퍼지지 않도록
 * TTS 재생을 즉각 안전하게 자동 정지(Auto-Stop)합니다.
 */

export type AudioDeviceChangeCallback = (reason: 'devicechange' | 'audio_route_changed') => void;

let isMonitoringInitialized = false;
let listeners: AudioDeviceChangeCallback[] = [];
let lastKnownDeviceIds: string[] = [];

/**
 * 오디오 장치 목록 변경 여부 검사
 */
export async function detectAudioDeviceChange(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) {
    return false;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(d => d.kind === 'audiooutput' || d.kind === 'audioinput');
    const currentDeviceIds = audioDevices.map(d => `${d.kind}:${d.deviceId}:${d.label}`).sort();

    if (lastKnownDeviceIds.length > 0) {
      const isChanged = currentDeviceIds.length !== lastKnownDeviceIds.length ||
        currentDeviceIds.some((id, idx) => id !== lastKnownDeviceIds[idx]);
      lastKnownDeviceIds = currentDeviceIds;
      return isChanged;
    }

    lastKnownDeviceIds = currentDeviceIds;
    return false;
  } catch {
    return false;
  }
}

/**
 * 오디오 장치 변경 리스너 등록
 */
export function registerAudioDeviceChangeListener(callback: AudioDeviceChangeCallback): () => void {
  listeners.push(callback);
  initAudioDeviceChangeMonitor();
  return () => {
    listeners = listeners.filter(fn => fn !== callback);
  };
}

/**
 * 등록된 모든 리스너에게 장치 변경 통보
 */
export function notifyAudioDeviceChanged(reason: 'devicechange' | 'audio_route_changed' = 'devicechange'): void {
  listeners.forEach(cb => {
    try {
      cb(reason);
    } catch (err) {
      console.error('[AudioDeviceMonitor] Callback execution error:', err);
    }
  });
}

/**
 * 브라우저 미디어 장치 변경 모니터링 초기화
 */
export function initAudioDeviceChangeMonitor(): void {
  if (isMonitoringInitialized || typeof window === 'undefined') return;
  isMonitoringInitialized = true;

  // 1. 초기 장치 목록 캐시
  if (navigator.mediaDevices?.enumerateDevices) {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const audioDevices = devices.filter(d => d.kind === 'audiooutput' || d.kind === 'audioinput');
      lastKnownDeviceIds = audioDevices.map(d => `${d.kind}:${d.deviceId}:${d.label}`).sort();
    }).catch(() => {});
  }

  // 2. W3C 표준 navigator.mediaDevices.ondevicechange 이벤트 감지
  if (navigator.mediaDevices?.addEventListener) {
    navigator.mediaDevices.addEventListener('devicechange', async () => {
      // 실제 오디오 장치 목록(이어폰 등)이 변경되었을 때만 안전 정지 통보
      const hasRealChange = await detectAudioDeviceChange().catch(() => false);
      if (hasRealChange) {
        console.warn('[AudioDeviceMonitor] Audio output device change confirmed (earphones disconnected/switched).');
        notifyAudioDeviceChanged('devicechange');
      }
    });
  }
}
