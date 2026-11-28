/**
 * 🧭 스마트 가이드 설정 (상단 헤더 물음표 아이콘)
 *
 * 사용자 지시(2026-11-27): "상단 헤더에 물음표 아이콘을 만들어서 그 기능을 활성화 해서
 * 스마트가이드를 켜고 끌수 있게해주고 tts기능을 통해 가이드 도슨트를 만들어서 해당 옵션도 키고 끌수 있게해줘
 * (스마트 가이드가 꺼져도 이동은 가능하게 해줘)"
 *
 * - 스마트 가이드 OFF: 한 번 탭의 **추천과 이동 버튼은 그대로** 두고, 도착 배너·도슨트만 멈춘다.
 * - 도슨트 ON: 추천을 띄울 때 그 이유·할 일을 앱 TTS로 다정하게 읽어 준다.
 */
import { useEffect, useState } from 'react';
import { safeLocalStorage } from '@/utils/safeStorage';

export interface SmartGuideSettings {
  /** 도착 후 안내 배너. 이동 전 추천 카드(이동 버튼)는 이 값과 상관없이 한 번 탭에 뜬다. */
  guide: boolean;
  /** 가이드 도슨트 음성 (스마트 가이드가 켜져 있을 때만 들린다) */
  douser: boolean;
}

export type SmartGuideSettingsStorage = Pick<Storage, 'getItem' | 'setItem'>;

export const SMART_GUIDE_SETTINGS_KEY = 'luckey_smart_guide_settings_v1';
export const SMART_GUIDE_SETTINGS_EVENT = 'prism:smart_guide_settings';

/** 처음에는 배너만 켜 두고, 음성 도슨트는 사용자가 직접 켠다 (원치 않는 소리 방지). */
export const DEFAULT_SMART_GUIDE_SETTINGS: SmartGuideSettings = { guide: true, douser: false };

let cached: SmartGuideSettings | null = null;

function normalize(raw: unknown): SmartGuideSettings {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SMART_GUIDE_SETTINGS };
  const value = raw as Partial<SmartGuideSettings>;
  return {
    guide: typeof value.guide === 'boolean' ? value.guide : DEFAULT_SMART_GUIDE_SETTINGS.guide,
    douser: typeof value.douser === 'boolean' ? value.douser : DEFAULT_SMART_GUIDE_SETTINGS.douser,
  };
}

/** 저장된 설정을 읽는다. 저장소가 막혀도 기본값으로 동작한다. */
export function readSmartGuideSettings(storage?: SmartGuideSettingsStorage | null): SmartGuideSettings {
  if (storage === undefined && cached) return cached;
  const target = storage ?? safeLocalStorage;
  if (!target) return { ...DEFAULT_SMART_GUIDE_SETTINGS };
  try {
    const raw = target.getItem(SMART_GUIDE_SETTINGS_KEY);
    const parsed = raw ? normalize(JSON.parse(raw)) : { ...DEFAULT_SMART_GUIDE_SETTINGS };
    if (storage === undefined) cached = parsed;
    return parsed;
  } catch {
    return { ...DEFAULT_SMART_GUIDE_SETTINGS };
  }
}

/** 일부만 바꿔 저장하고, 화면 전체(빅뱅 버튼·헤더 아이콘)에 즉시 알린다. */
export function writeSmartGuideSettings(
  patch: Partial<SmartGuideSettings>,
  storage?: SmartGuideSettingsStorage | null,
): SmartGuideSettings {
  const target = storage ?? safeLocalStorage;
  const next = normalize({ ...readSmartGuideSettings(storage), ...patch });
  cached = next;
  if (target) {
    try {
      target.setItem(SMART_GUIDE_SETTINGS_KEY, JSON.stringify(next));
    } catch {
      /* 저장이 막혀도 이번 화면에서는 적용된다 */
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SMART_GUIDE_SETTINGS_EVENT, { detail: next }));
  }
  return next;
}

export function isSmartGuideEnabled(): boolean {
  return readSmartGuideSettings().guide;
}

export function isGuideDouserEnabled(): boolean {
  const settings = readSmartGuideSettings();
  return settings.guide && settings.douser;
}

/** 설정을 구독하는 훅 (헤더 아이콘·빅뱅 버튼이 같은 값을 본다) */
export function useSmartGuideSettings(): SmartGuideSettings {
  const [settings, setSettings] = useState<SmartGuideSettings>(() => readSmartGuideSettings());
  useEffect(() => {
    const sync = (event: Event) => {
      const detail = (event as CustomEvent<SmartGuideSettings | undefined>).detail;
      setSettings(normalize(detail ?? readSmartGuideSettings()));
    };
    window.addEventListener(SMART_GUIDE_SETTINGS_EVENT, sync);
    // 다른 탭에서 바꾼 경우도 따라간다.
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === SMART_GUIDE_SETTINGS_KEY) setSettings(readSmartGuideSettings());
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(SMART_GUIDE_SETTINGS_EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return settings;
}

/**
 * 도착 안내 배너와 도슨트만 설정을 따른다.
 * 한 번 탭의 추천 카드와 이동 버튼은 설정과 상관없이 항상 보여 준다.
 */
export function resolveSmartGuidePresentation(settings: SmartGuideSettings): { banner: boolean; douser: boolean } {
  return {
    banner: Boolean(settings.guide),
    douser: Boolean(settings.guide) && Boolean(settings.douser),
  };
}
