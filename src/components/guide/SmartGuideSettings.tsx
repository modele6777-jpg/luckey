/**
 * 🧭 스마트 가이드 설정 — 상단 헤더의 물음표(?) 아이콘과 설정 시트.
 *
 * 사용자 지시(2026-11-27):
 *  - "상단 헤더에 물음표 아이콘을 만들어서 그 기능을 활성화 해서 스마트가이드를 켜고 끌수 있게해주고
 *     tts기능을 통해 가이드 도슨트를 만들어서 해당 옵션도 키고 끌수 있게해줘
 *     (스마트 가이드가 꺼져도 이동은 가능하게 해줘)"
 *  - "스마트가이드 기능(상단헤더 물음표 아이콘)을 모든페이지에 나오게 해줘"
 *
 * 물음표 아이콘은 기존 가이드(📖 BookOpen, 페이지별 사용 가이드)와 역할이 다르므로 HelpCircle로 구분한다.
 * 모든 화면의 오른쪽 헤더 액션 줄(루시 · 오브 · Key · 채널 공통 헤더 · 코스믹 룸)에 같은 컴포넌트를 꽂아
 * 어떤 라우트에서도 겹침 없이 보이게 한다.
 */
import { useEffect, useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import { useMainOverlayViewport } from '@/hooks/useMainOverlayViewport';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import {
  DEFAULT_SMART_GUIDE_SETTINGS,
  readSmartGuideSettings,
  useSmartGuideSettings,
  writeSmartGuideSettings,
  type SmartGuideSettings,
} from '@/lib/omniWarp/smartGuideSettings';
import { speakGuideDouser, stopGuideDouser, useGuideDouserActive } from '@/lib/omniWarp/guideDouser';
import type { SmartGuideResult } from '@/lib/omniWarp/smartBigBangGuide';
import { GUIDE_BUTTON_ICON_SIZE, GUIDE_BUTTON_INTERACTION_CLASS, GUIDE_BUTTON_SIZE_CLASS, GUIDE_BUTTON_TONE_TEXT } from './guideButtonLayout';

export type SmartGuideSettingsTone = 'dark' | 'light' | 'key';

const TONE_BUTTON: Record<SmartGuideSettingsTone, string> = {
  dark: 'border-white/20 bg-white/10 text-white/90',
  light: 'border-slate-300/80 bg-white/80 text-slate-700',
  key: 'border-[#e9dccd] bg-[#fffdf9] text-[#c9805c]',
};

const TONE_UNBOXED_BUTTON: Record<SmartGuideSettingsTone, string> = {
  dark: `border-0 bg-transparent shadow-none ${GUIDE_BUTTON_TONE_TEXT.dark}`,
  light: `border-0 bg-transparent shadow-none ${GUIDE_BUTTON_TONE_TEXT.light}`,
  key: `border-0 bg-transparent shadow-none ${GUIDE_BUTTON_TONE_TEXT.key}`,
};

const SAMPLE_GUIDE: SmartGuideResult = {
  path: '/',
  action: 'lucy',
  title: '스마트 가이드',
  reason: '지금 가장 쓸모 있는 한 곳으로 안내해 드려요.',
  ctaHint: '도착한 화면에서 무엇을 하면 되는지 이렇게 읽어 드려요.',
  icon: '🧭',
  needsProMode: false,
  inPlace: false,
};

function SettingsSwitch({ on, label, onToggle, disabled = false }: { on: boolean; label: string; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      data-smart-guide-switch={label}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        disabled ? 'cursor-not-allowed opacity-40' : 'active:scale-95'
      } ${on ? 'bg-cyan-500' : 'bg-slate-300'}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
    </button>
  );
}

/** 설정 시트: 스마트 가이드 · 가이드 도슨트 두 스위치 */
export function SmartGuideSettingsSheet({ onClose }: { onClose: () => void }) {
  const settings = useSmartGuideSettings();
  const douserActive = useGuideDouserActive();
  // 사이드 메뉴(.sites-pinned-sidebar)를 뺀 본문 캔버스 기준으로 가운데에 띄운다.
  const viewport = useMainOverlayViewport('main');
  const paneWidth = Number(viewport.width) || 0;
  const paneHeight = Number(viewport.height) || 0;
  const confined = paneWidth >= 48 && paneHeight >= 48;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggle = (patch: Partial<SmartGuideSettings>) => {
    triggerHaptic('whitehole');
    const next = writeSmartGuideSettings(patch);
    // 도슨트를 끄면 지금 읽던 안내도 바로 멈춘다.
    if (!next.douser || !next.guide) stopGuideDouser();
  };

  return (
    <ScreenPortal>
      <div
        className="fixed z-[70] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
        data-smart-guide-settings-frame={confined ? 'canvas' : 'viewport'}
        style={confined
          ? { left: viewport.left, top: viewport.top, width: viewport.width, height: viewport.height }
          : { left: 0, top: 0, right: 0, bottom: 0 }}
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="smart-guide-settings-title"
          data-smart-guide-settings="true"
          onClick={event => event.stopPropagation()}
          className="w-full max-w-[350px] rounded-3xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl"
          style={{ colorScheme: 'light' }}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700"><HelpCircle size={20} /></span>
            <div className="min-w-0 flex-1">
              <h2 id="smart-guide-settings-title" className="text-base font-black text-slate-900">스마트 가이드</h2>
              <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600 break-keep">빅뱅 버튼 한 번 탭이 추천을 먼저 보여 주고, 이동 버튼으로 안내해요.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="설정 닫기" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"><X size={18} /></button>
          </div>

          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3.5 py-3">
              <span className="text-lg leading-none" aria-hidden="true">🧭</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-bold text-slate-900">스마트 가이드</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-slate-600 break-keep">이동한 뒤에, 그 화면에서 무엇을 하면 되는지 배너로 알려 줘요.</span>
              </span>
              <SettingsSwitch on={settings.guide} label="스마트 가이드" onToggle={() => toggle({ guide: !settings.guide })} />
            </li>
            <li className={`flex items-center gap-3 rounded-2xl bg-slate-50 px-3.5 py-3 ${settings.guide ? '' : 'opacity-60'}`}>
              <span className="text-lg leading-none" aria-hidden="true">🔊</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-bold text-slate-900">가이드 도슨트</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-slate-600 break-keep">추천 이유와 할 일을 루시 목소리로 다정하게 읽어 줘요.</span>
              </span>
              <SettingsSwitch
                on={settings.guide && settings.douser}
                label="가이드 도슨트"
                disabled={!settings.guide}
                onToggle={() => toggle({ douser: !settings.douser })}
              />
            </li>
          </ul>

          {settings.guide && settings.douser && (
            <button
              type="button"
              onClick={() => { triggerHaptic('whitehole'); if (douserActive) stopGuideDouser(); else speakGuideDouser(SAMPLE_GUIDE); }}
              data-smart-guide-douser-preview="true"
              className="mt-2 w-full rounded-full border border-slate-200 py-2 text-[12.5px] font-bold text-slate-700 active:scale-[0.98]"
            >
              {douserActive ? '도슨트 멈추기' : '도슨트 미리 듣기'}
            </button>
          )}

          <p className="mt-3 rounded-2xl bg-cyan-50/70 px-3.5 py-2.5 text-[12px] leading-relaxed text-cyan-900 break-keep" data-smart-guide-note="true">
            빅뱅 버튼을 한 번 탭하면 바로 이동하지 않고 추천을 먼저 보여 줘요. 이동 버튼을 눌러야 그곳으로 가요. 스마트 가이드를 꺼도 추천과 이동 버튼은 그대로예요.
          </p>

          <button type="button" onClick={onClose} className="mt-3 w-full rounded-full border border-slate-200 py-2.5 text-sm font-bold text-slate-700 active:scale-95">확인</button>
        </div>
      </div>
    </ScreenPortal>
  );
}

/** 헤더 물음표 아이콘 — 루시 채팅 헤더와 같은 투명·32px·17px 버튼이 기본이고, 누르면 설정 시트를 연다. */
export function SmartGuideSettingsButton({ tone = 'dark', className = '', unboxed = true }: { tone?: SmartGuideSettingsTone; className?: string; unboxed?: boolean }) {
  const [open, setOpen] = useState(false);
  const settings = useSmartGuideSettings();
  const active = settings.guide;

  return (
    <>
      <button
        type="button"
        data-smart-guide-settings-button="true"
        data-smart-guide-enabled={active ? 'true' : 'false'}
        data-smart-guide-douser={active && settings.douser ? 'true' : 'false'}
        aria-label={active ? '스마트 가이드 켜짐 · 설정 열기' : '스마트 가이드 꺼짐 · 설정 열기'}
        aria-pressed={active}
        title="스마트 가이드 설정"
        onClick={() => { triggerHaptic('whitehole'); setOpen(value => !value); }}
        className={`relative inline-flex ${GUIDE_BUTTON_SIZE_CLASS} shrink-0 items-center justify-center rounded-full ${GUIDE_BUTTON_INTERACTION_CLASS} ${unboxed ? TONE_UNBOXED_BUTTON[tone] : `border backdrop-blur-md ${TONE_BUTTON[tone]}`} ${className}`}
      >
        <HelpCircle size={GUIDE_BUTTON_ICON_SIZE} aria-hidden="true" />
      </button>
      {open && <SmartGuideSettingsSheet onClose={() => setOpen(false)} />}
    </>
  );
}

/** 테스트·문서용 기본값 노출 */
export { DEFAULT_SMART_GUIDE_SETTINGS, readSmartGuideSettings };
