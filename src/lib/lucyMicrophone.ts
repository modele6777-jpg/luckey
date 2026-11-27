export const LUCY_MIC_CONSTRAINTS: MediaStreamConstraints = {
  audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
};

/** Call directly from the audio control so the browser can show its permission prompt. */
export async function requestLucyMicrophone(constraints: MediaStreamConstraints = LUCY_MIC_CONSTRAINTS): Promise<MediaStream> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new DOMException('Microphone access is unavailable', 'SecurityError');
  }
  if (typeof document !== 'undefined') {
    type MicrophonePolicy = { allowsFeature(feature: string): boolean };
    const page = document as Document & { permissionsPolicy?: MicrophonePolicy; featurePolicy?: MicrophonePolicy };
    const policy = page.permissionsPolicy ?? page.featurePolicy;
    if (policy && !policy.allowsFeature('microphone')) {
      throw new DOMException('Microphone is blocked by this page', 'SecurityError');
    }
  }
  return navigator.mediaDevices.getUserMedia(constraints);
}

export function lucyMicrophonePermissionMessage(error: unknown): string {
  const name = error && typeof error === 'object' && 'name' in error ? error.name : '';
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return '이 사이트의 마이크 권한이 차단됐어요. 주소창의 사이트 설정에서 마이크를 허용한 뒤 다시 눌러 주세요.';
  }
  if (name === 'SecurityError') {
    return '이 화면에서 마이크를 열 수 없어요. 브라우저에서 사이트를 직접 열고 마이크 버튼을 다시 눌러 주세요.';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return '사용할 수 있는 마이크를 찾지 못했어요.';
  return '마이크를 열지 못했어요. 기기와 브라우저의 마이크 설정을 확인해 주세요.';
}

/** Reuse permission during a voice screen and discard a permission result after stopping. */
export function createLucySpeechMicrophoneGate(setCaptureActive: (active: boolean) => void) {
  let granted = false;
  let active = false;
  let generation = 0;
  return {
    async open() {
      const request = ++generation;
      active = true;
      setCaptureActive(true);
      if (granted) return true;
      try {
        const stream = await requestLucyMicrophone({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        if (request !== generation) return false;
        granted = true;
        return true;
      } catch (error) {
        if (request !== generation) return false;
        active = false;
        setCaptureActive(false);
        throw error;
      }
    },
    cancel() {
      generation += 1;
      if (active) setCaptureActive(false);
      active = false;
    },
    invalidate() {
      granted = false;
    },
  };
}
