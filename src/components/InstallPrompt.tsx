import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Triangle, X, Download, Share, PlusSquare, Info, Sparkles } from 'lucide-react';
interface InstallEvent extends Event { prompt(): Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>; }

export default function InstallPrompt() {
  const promptRef = useRef<InstallEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSamsung, setIsSamsung] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    if (standalone) { document.documentElement.classList.add('pwa-installed'); return; }
    const ua = navigator.userAgent;
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    setIsDesktop(!mobile);
    setIsIOS(/iPhone|iPad|iPod/i.test(ua));
    setIsSamsung(/SamsungBrowser/i.test(ua));
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Dismissing the banner must never disable later manual installation.
    if (mobile && sessionStorage.getItem('pwa_prompt_dismissed') !== 'true') timer = setTimeout(() => setShowPrompt(true), 3500);
    const beforeInstall = (event: Event) => {
      event.preventDefault(); promptRef.current = event as InstallEvent;
      // 🌟 PC 데스크톱 환경에서는 하단 입력창(채팅란)을 가리지 않도록 모바일에서만 자동 배너 팝업을 허용
      if (mobile && sessionStorage.getItem('pwa_prompt_dismissed') !== 'true') setShowPrompt(true);
      clearTimeout(timer);
    };
    const installed = () => {
      promptRef.current = null; setShowPrompt(false); setShowGuide(false);
      clearTimeout(timer); document.documentElement.classList.add('pwa-installed');
    };
    window.addEventListener('beforeinstallprompt', beforeInstall);
    window.addEventListener('appinstalled', installed);
    return () => { clearTimeout(timer); window.removeEventListener('beforeinstallprompt', beforeInstall); window.removeEventListener('appinstalled', installed); };
  }, []);
  const handleInstallClick = useCallback(async () => {
    const event = promptRef.current;
    promptRef.current = null;
    if (!event) { setShowGuide(true); return; }
    try {
      await event.prompt();
      const { outcome } = await event.userChoice;
      if (outcome === 'accepted') setShowPrompt(false);
    } catch { setShowGuide(true); }
  }, []);
  useEffect(() => {
    const trigger = () => { void handleInstallClick(); };
    window.addEventListener('trigger-pwa-install', trigger);
    return () => window.removeEventListener('trigger-pwa-install', trigger);
  }, [handleInstallClick]);
  const handleDismiss = () => { sessionStorage.setItem('pwa_prompt_dismissed', 'true'); setShowPrompt(false); };

  if ((!showPrompt && !showGuide) || (isDesktop && !showGuide)) return null;

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isOrbSite =
    pathname.startsWith('/orb') ||
    pathname.startsWith('/gateway') ||
    pathname.startsWith('/crystal') ||
    (typeof document !== 'undefined' && (document.title.includes('오브') || document.title.includes('Orb')));

  const isLucySite =
    !isOrbSite &&
    (pathname.startsWith('/chat') ||
      (typeof document !== 'undefined' && (document.title.includes('Lucy') || document.title.includes('루시'))));

  const appConfig = isOrbSite
    ? {
        title: "Key 앱 설치",
        desc: "홈 화면에 독립 앱으로 추가하여 루시 대화 요약과 직관 행운의 열쇠를 경험해 보세요.",
        guideTitle: "Key 완전한 앱 설치 방법",
        guideSubtitle: "아래 순서에 따라 홈 화면에 독립 앱으로 안전하고 신속하게 설치해 보세요.",
        iconSrc: "/luckey-icon-192.png",
      }
    : isLucySite
    ? {
        title: "LUCY 앱 설치",
        desc: "홈 화면에 앱으로 추가하여 온전한 속도와 몰입을 경험해 보세요.",
        guideTitle: "LUCY 완전한 앱 설치 방법",
        guideSubtitle: "아래 순서에 따라 시스템에 정식으로 호환되는 완전한 앱 형태로 소장 및 설치해 보세요.",
        iconSrc: "/lucy-icon-192.png",
      }
    : {
        title: "LucKey 앱 설치",
        desc: "홈 화면에 앱으로 추가하여 온전한 속도와 7대 우주 페르소나를 경험해 보세요.",
        guideTitle: "LucKey 완전한 앱 설치 방법",
        guideSubtitle: "아래 순서에 따라 시스템에 정식으로 호환되는 완전한 앱 형태로 소장 및 설치해 보세요.",
        iconSrc: "/icon-192.png",
      };

  return (
    <>
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="pwa-install-banner fixed bottom-[88px] left-4 right-4 md:left-[50%] md:right-auto md:w-[480px] md:-translate-x-1/2 z-[999] bg-[#08080c]/90 backdrop-blur-xl border border-white/10 p-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-4 text-white"
          >
            {/* Main prompt body */}
            <div className="flex gap-4 items-center">
              {isOrbSite ? (
                <div className="relative w-12 h-12 rounded-full border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] shrink-0 overflow-hidden bg-[#070510]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 opacity-40 mix-blend-screen rounded-full" />
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }} 
                    className="absolute inset-0 rounded-full border border-dashed border-purple-300/30" 
                  />
                  <div className="absolute inset-[3px] rounded-full border border-white/10 bg-[#070510] flex items-center justify-center">
                    <img src="/luckey-icon-192.png" alt="LucKey" className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  </div>
                </div>
              ) : isLucySite ? (
                <div className="relative w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)] shrink-0 overflow-hidden bg-[#08080c]">
                  <img src="/lucy-icon-192.png" alt="LUCY" className="w-full h-full object-cover" />
                </div>
              ) : (
                /* Current Official LucKey Icon (Emerald 4-Leaf Clover + Golden Celestial Key) */
                <div className="relative w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center shadow-[0_0_22px_rgba(52,211,153,0.18)] shrink-0 overflow-hidden bg-zinc-900/80">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-amber-500/15 to-cyan-500/20 opacity-45 mix-blend-screen rounded-2xl" />
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
                    className="absolute inset-1 rounded-full border border-dashed border-emerald-400/25" 
                  />
                  <svg viewBox="0 0 32 32" fill="none" className="relative z-10 w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 16 C16 11, 12 9, 12 12 C12 15, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                      <path d="M16 16 C21 16, 23 12, 20 12 C17 12, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                      <path d="M16 16 C16 21, 20 23, 20 20 C20 17, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                      <path d="M16 16 C11 16, 9 20, 12 20 C15 20, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                    </g>
                    <g stroke="#fcd34d" strokeWidth="1.6" strokeLinecap="round">
                      <circle cx="16" cy="16" r="2.5" fill="#fde047" stroke="none" />
                      <path d="M16 18.5 L16 25" />
                      <path d="M16 23 L18.5 23" />
                      <path d="M16 25 L18 25" />
                    </g>
                  </svg>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold font-sans tracking-wide">{appConfig.title}</h4>
                <p className="text-[12px] text-white/50 leading-relaxed mt-0.5 font-sans">
                  {appConfig.desc}
                </p>
              </div>

              <button 
                onClick={handleDismiss}
                className="p-1 rounded-full text-white/30 hover:text-white/75 hover:bg-white/5 transition-colors absolute top-3 right-3"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-3 text-xs font-bold text-white/30 hover:text-white/50 transition-colors border border-white/5 rounded-xl text-center"
              >
                다음에 할게요
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 rounded-xl text-center transition-all bg-white text-black hover:bg-white/95 active:scale-95 shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
              >
                <Download size={13} />
                앱 설치하기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guide Modal for iOS or manual install */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuide(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-sm bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 relative z-10 text-white shadow-2xl"
            >
              <button 
                onClick={() => setShowGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center mt-2">
                {isOrbSite ? (
                  <div className="relative w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.35)] mb-4 overflow-hidden bg-[#070510]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 opacity-40 mix-blend-screen rounded-full" />
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 18, repeat: Infinity, ease: "linear" }} 
                      className="absolute inset-0 rounded-full border border-dashed border-purple-300/30" 
                    />
                    <div className="absolute inset-[4px] rounded-full border border-white/10 bg-[#070510] flex items-center justify-center">
                      <img src="/luckey-icon-192.png" alt="LucKey" className="w-9 h-9 object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.9)]" />
                    </div>
                  </div>
                ) : isLucySite ? (
                  <div className="relative w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.25)] mb-4 overflow-hidden bg-[#0a0a0f]">
                    <img src="/lucy-icon-192.png" alt="LUCY" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="relative w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center shadow-[0_0_26px_rgba(52,211,153,0.2)] mb-4 overflow-hidden bg-zinc-900/80">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-amber-500/15 to-cyan-500/20 opacity-45 mix-blend-screen rounded-2xl" />
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
                      className="absolute inset-1.5 rounded-full border border-dashed border-emerald-400/25" 
                    />
                    <svg viewBox="0 0 32 32" fill="none" className="relative z-10 w-9 h-9" xmlns="http://www.w3.org/2000/svg">
                      <g stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 16 C16 11, 12 9, 12 12 C12 15, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                        <path d="M16 16 C21 16, 23 12, 20 12 C17 12, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                        <path d="M16 16 C16 21, 20 23, 20 20 C20 17, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                        <path d="M16 16 C11 16, 9 20, 12 20 C15 20, 16 16, 16 16" fill="#34d399" fillOpacity="0.25" />
                      </g>
                      <g stroke="#fcd34d" strokeWidth="1.6" strokeLinecap="round">
                        <circle cx="16" cy="16" r="2.5" fill="#fde047" stroke="none" />
                        <path d="M16 18.5 L16 25" />
                        <path d="M16 23 L18.5 23" />
                        <path d="M16 25 L18 25" />
                      </g>
                    </svg>
                  </div>
                )}

                <h3 className="font-sans font-bold text-lg tracking-wide mb-1 flex items-center gap-1.5 justify-center">
                  <Sparkles size={16} className="text-amber-400" /> {appConfig.guideTitle}
                </h3>
                <p className="text-white/40 text-[11px] font-sans mb-5 leading-normal">
                  {appConfig.guideSubtitle}
                </p>
                
                {isDesktop ? (
                  <div className="w-full space-y-3 text-left text-xs leading-relaxed text-white/75">
                    <p>PC의 Chrome 또는 Microsoft Edge에서 <strong className="text-white">https://luckey.goldentuna10.chatgpt.site</strong>를 직접 열어 주세요.</p>
                    <p>Chrome은 주소창의 설치 아이콘 또는 메뉴의 ‘전송, 저장, 공유’ → ‘앱으로 페이지 설치’를 선택하세요.</p>
                    <p>Edge는 메뉴 → ‘앱’ → ‘이 사이트를 앱으로 설치’를 선택하세요. 설치 후 별도 앱 창으로 실행됩니다.</p>
                    <p className="text-white/50">ChatGPT 안의 브라우저에서 설치 창이 뜨지 않으면 위 주소를 PC 브라우저에서 여세요. 설치 메뉴는 브라우저 버전에 따라 다를 수 있습니다.</p>
                  </div>
                ) : isIOS ? (
                  <div className="w-full space-y-3.5 text-left font-sans text-xs">
                    <div className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04]">
                      <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold font-mono text-white/80">1</span>
                      </div>
                      <div className="leading-relaxed text-white/70">
                        Safari 브라우저 하단의 <span className="font-bold text-white flex items-center gap-1 inline-flex bg-white/10 px-1.5 py-0.5 rounded text-[10px]"><Share size={11} /> [공유]</span> 버튼을 누릅니다.
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04]">
                      <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold font-mono text-white/80">2</span>
                      </div>
                      <div className="leading-relaxed text-white/70">
                        스크롤해 아래의 <span className="font-bold text-white flex items-center gap-1 inline-flex bg-white/10 px-1.5 py-0.5 rounded text-[10px]"><PlusSquare size={11} /> [홈 화면에 추가]</span> 버튼을 누릅니다.
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-[#ff6b6b]/5 p-3.5 rounded-2xl border border-[#ff6b6b]/15 text-[#ff8b8b]">
                      <span className="text-xs shrink-0">⚠️</span>
                      <div className="leading-normal text-[11px]">
                        <span className="font-bold">중요:</span> iOS는 Safari 브라우저에서만 앱 설치를 지원합니다. 다른 메신저 인앱이나 타사 앱 브라우저 환경인 경우 먼저 <span className="font-bold text-white bg-white/10 px-1 rounded">Safari로 열기</span>를 진행해 주세요.
                      </div>
                    </div>
                  </div>
                ) : isSamsung ? (
                  <div className="w-full space-y-3.5 text-left font-sans text-xs">
                    <div className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04]">
                      <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold font-mono text-white/80">1</span>
                      </div>
                      <div className="leading-relaxed text-white/70">
                        상단 주소창 우측에서 볼 수 있는 <span className="font-bold text-white flex items-center gap-1 inline-flex bg-white/10 px-1.5 py-0.5 rounded text-[10px]"><Download size={11} /> [앱 다운로드 화살표]</span> 아이콘을 누르면 시스템에 완전한 독립 실행형 앱으로 안전하고 신속히 설치됩니다.
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04]">
                      <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold font-mono text-white/80">2</span>
                      </div>
                      <div className="leading-relaxed text-white/70">
                        혹은 우측 하단 메뉴 <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded text-[10px] inline-block">☰</span> 버튼을 누른 뒤 <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded text-[10px] inline-block">현재 페이지 추가 (+)</span> 를 통해 <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded text-[10px] inline-block">앱 설치</span>를 선택해 완료합니다.
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-[#ff6b6b]/5 p-3.5 rounded-2xl border border-[#ff6b6b]/15 text-[#ff8b8b]">
                      <span className="text-xs shrink-0">🚨</span>
                      <div className="leading-normal text-[11px]">
                        <span className="font-bold">삼성인터넷 제한사항:</span> AI Studio의 미리보기 내측 프레임(iframe)에서는 브라우저 보안 규정상 네이티브 앱 설치 프롬프트를 띄울 수 없습니다. <span className="underline font-bold text-white">반드시 우측 상단의 새 창(New Tab) 버튼을 누르고 모바일 브라우저로 접속해</span> 시도해 주세요.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-3.5 text-left font-sans text-xs">
                    <div className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04]">
                      <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold font-mono text-white/80">1</span>
                      </div>
                      <div className="leading-relaxed text-white/70">
                        브라우저 주소창 우측의 <span className="font-bold text-white flex items-center gap-1 inline-flex bg-white/10 px-1.5 py-0.5 rounded text-[10px]"><Download size={11} /> 다운로드 화살표</span> 아이콘이나 주소창 옆 버튼을 눌러 완전한 독립 앱으로 직접 시스템에 설치합니다.
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04]">
                      <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold font-mono text-white/80">2</span>
                      </div>
                      <div className="leading-relaxed text-white/70">
                        혹은 우측 상단 더보기 버튼<span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded text-[10px] inline-block">⋮</span>을 누른 다음 <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded text-[20px] leading-none align-middle inline-block">앱 설치</span> 항목이 나오면 클릭하여 시스템에 정식 추가합니다.
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-[#ff6b6b]/5 p-3.5 rounded-2xl border border-[#ff6b6b]/15 text-[#ff8b8b]">
                      <span className="text-xs shrink-0">🚨</span>
                      <div className="leading-normal text-[11px]">
                        <span className="font-bold">보안 안내:</span> AI Studio iFrame 속 개발 미리보기 환경에서는 기술 보안 규정에 의해 PWA 앱 설치 동작이 불가능합니다. <span className="underline font-bold text-white">우측 상단 [새 탭에서 열기] 버튼을 누르고 직접 해당 브라우저 URL로 직접 모바일 기기에서 진입해</span> 주시기 바랍니다.
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowGuide(false)}
                  className="w-full mt-6 py-3.5 bg-white/5 border border-white/10 text-white/85 text-xs font-bold rounded-2xl hover:bg-white/10 transition-all font-sans"
                >
                  확인했습니다
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
