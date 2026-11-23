document.addEventListener('DOMContentLoaded', () => {
  // Use a stationary placeholder plus a compositor-fixed bar after its anchor
  // passes the header. Safari can jitter two independent sticky layers.
  const keyHeader = document.querySelector('.top-nav');
  const keyTabs = document.querySelector('.view-tabs-container');
  if (keyHeader && keyTabs) {
    const headerSpace = document.createElement('div');
    headerSpace.className = 'key-header-space';
    keyHeader.before(headerSpace);
    keyHeader.classList.add('key-header-fixed');
    const anchor = document.createElement('div');
    anchor.className = 'key-tabs-anchor';
    keyTabs.before(anchor);
    anchor.append(keyTabs);
    const marker = document.createElement('span');
    marker.className = 'key-tabs-marker';
    anchor.prepend(marker);
    let pinAt = Infinity;
    const syncPinned = () => keyTabs.classList.toggle('key-tabs-pinned', window.scrollY > pinAt);
    const updateGeometry = () => {
      const height = Math.ceil(keyHeader.getBoundingClientRect().height);
      const rect = anchor.getBoundingClientRect();
      document.documentElement.style.setProperty('--key-header-height', `${height}px`);
      headerSpace.style.height = `${height}px`;
      keyTabs.style.setProperty('--key-tabs-left', `${rect.left}px`);
      keyTabs.style.setProperty('--key-tabs-width', `${rect.width}px`);
      anchor.style.minHeight = `${keyTabs.offsetHeight}px`;
      pinAt = rect.top + window.scrollY - height;
      syncPinned();
    };
    const observer = new ResizeObserver(updateGeometry);
    observer.observe(keyHeader);
    observer.observe(anchor);
    observer.observe(keyTabs);
    // Only a cached number comparison on scroll: no layout reads or CSS offsets.
    window.addEventListener('scroll', syncPinned, { passive: true });
    window.addEventListener('resize', updateGeometry);
    window.addEventListener('pageshow', updateGeometry);
    updateGeometry();
  }

  function naturalVoiceUrl(data) {
    if (!data?.audioContent || !['mp3', 'wav'].includes(data.encoding)) return null;
    return `data:${data.encoding === 'wav' ? 'audio/wav' : 'audio/mpeg'};base64,${data.audioContent}`;
  }

  // =========================================================
  // Shared Module State (전역 스코프 호이스팅 안전 관리)
  // =========================================================
  let isBreathingActive = false;
  let breathingInterval = null;
  let currentWbFilter = 'all';
  let currentWbSearch = '';

  // 1. Service Worker is centrally managed by top-level PRISM app (iframe SW registration disabled to prevent Safari PWA WebKit worker deadlocks)

  // 2. PWA Install Prompt
  let deferredPrompt = null;
  const btnInstallPwa = document.getElementById('btn-install-pwa');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (btnInstallPwa) btnInstallPwa.classList.remove('hidden');
  });

  if (btnInstallPwa) {
    btnInstallPwa.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      deferredPrompt = null;
      btnInstallPwa.classList.add('hidden');
    });
  }

  // 3. Tab Switching Logic (토스/킨포크 스타일 세그먼트 탭)
  const tabPills = document.querySelectorAll('.tab-pill');
  const tabSections = document.querySelectorAll('.tab-view-section');

  function switchTab(targetTabId, shouldScroll = true) {
    if (targetTabId !== 'tab-breathing' && isBreathingActive && typeof stopBreathing === 'function') {
      stopBreathing(false);
    }

    try {
      localStorage.setItem('calm_active_tab', targetTabId);
    } catch (e) {}

    tabPills.forEach(pill => {
      if (pill.dataset.tab === targetTabId) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    tabSections.forEach(section => {
      if (section.id === targetTabId) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    if (targetTabId === 'tab-workbook' && typeof renderWorkbook === 'function') {
      renderWorkbook();
    }

    if (targetTabId === 'tab-exercises' && typeof renderExercisesGrid === 'function') {
      const activeBtn = document.querySelector('.exercises-filter-strip .filter-pill-btn.active');
      renderExercisesGrid(activeBtn ? activeBtn.dataset.chapter : 'all');
    }

    if (shouldScroll) {
      const anchor = document.querySelector('.key-tabs-anchor') || document.querySelector('.view-tabs-container');
      if (anchor) {
        const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--key-header-height')) || 0;
        const top = anchor.getBoundingClientRect().top;
        // 탭 목록이 화면 아래에 있을 때만 내려간다. 이미 보이면 지금 위치를 유지한다.
        // (고정값 400으로 올리면 목록을 옮길 때 화면이 살짝 위로 끌려 올라갔다.)
        if (top >= window.innerHeight - 8) {
          window.scrollTo({ top: Math.max(0, window.scrollY + top - headerHeight), behavior: 'smooth' });
        }
      }
    }
  }
  // 🔍 Key 검색에서 결과를 누르면 해당 화면으로 이동할 수 있게 노출
  window.keySwitchTab = switchTab;


  // ==========================================================================
  // WEB AUDIO ENGINE: Soothing Rain Ambience
  // ==========================================================================
  let calmAudioCtx = null;
  let rainNoiseNode = null;
  let rainGain = null;
  let globalSensoryVol = 0.3;

  function getCalmAudioContext() {
    if (!calmAudioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) calmAudioCtx = new AudioCtxClass();
    }
    if (calmAudioCtx && calmAudioCtx.state === 'suspended') {
      calmAudioCtx.resume();
    }
    return calmAudioCtx;
  }

  function toggleRainNoise(forcePlay) {
    const ctx = getCalmAudioContext();
    if (!ctx) return false;

    if (rainNoiseNode) {
      try {
        rainGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        setTimeout(() => {
          if (rainNoiseNode) {
            rainNoiseNode.stop();
            rainNoiseNode.disconnect();
            rainNoiseNode = null;
          }
        }, 450);
      } catch (e) {}
      if (forcePlay === undefined || forcePlay === false) return false;
    }

    if (forcePlay === undefined || forcePlay === true) {
      try {
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        rainGain = ctx.createGain();
        rainGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        rainGain.gain.linearRampToValueAtTime(globalSensoryVol * 0.65, ctx.currentTime + 1.2);
        whiteNoise.connect(rainGain);
        rainGain.connect(ctx.destination);
        whiteNoise.start();
        rainNoiseNode = whiteNoise;
        return true;
      } catch (e) {
        console.warn('Rain noise synthesis error:', e);
        return false;
      }
    }
    return false;
  }

  // ==========================================================================
  // TAB 2: SOS SENSORY TOOLBOX (연습 3 스트레스 해소 도구 상자 기반)
  // ==========================================================================
  function initSensoryToolbox() {
    const btnSosReset = document.getElementById('btn-sos-quick-reset');
    const bannerSos = document.getElementById('sos-live-banner');
    const timerSos = document.getElementById('sos-live-timer');
    const guideSos = document.getElementById('sos-live-guide');
    const btnSosStop = document.getElementById('btn-sos-stop');

    let sosCountdown = 60;
    let sosInterval = null;

    const sosGuides = [
      '1단계: 어깨와 턱의 힘을 툭 빼고, 발바닥이 단단한 땅을 딛고 있음을 느낍니다.',
      '2단계: 눈에 보이는 안정적인 색깔 3가지를 가만히 마음속으로 짚어봅니다.',
      '3단계: 손바닥을 가슴에 얹고 숨이 오르내리는 따뜻한 온기에 집중합니다.',
      '4단계: 코로 시원한 공기가 들어오고 입으로 따뜻한 숨이 나가는 흐름을 봅니다.',
      '5단계: "지금 이 순간, 나는 안전하다. 내 신경계는 편안해지고 있다"고 속삭입니다.'
    ];

    function stopSosReset() {
      if (sosInterval) {
        clearInterval(sosInterval);
        sosInterval = null;
      }
      if (bannerSos) bannerSos.style.display = 'none';
      if (btnSosReset) {
        btnSosReset.disabled = false;
        btnSosReset.querySelector('.sos-text').textContent = '1분 SOS 즉시 진정';
      }
    }

    if (btnSosReset) {
      btnSosReset.addEventListener('click', () => {
        if (sosInterval) return;
        if (bannerSos) bannerSos.style.display = 'flex';
        btnSosReset.disabled = true;
        btnSosReset.querySelector('.sos-text').textContent = 'SOS 진정 진행 중...';
        sosCountdown = 60;
        if (timerSos) timerSos.textContent = '60s';
        if (guideSos) guideSos.textContent = sosGuides[0];


        sosInterval = setInterval(() => {
          sosCountdown--;
          if (timerSos) timerSos.textContent = `${sosCountdown}s`;

          const guideIdx = Math.min(4, Math.floor((60 - sosCountdown) / 12));
          if (guideSos && sosGuides[guideIdx]) {
            guideSos.textContent = sosGuides[guideIdx];
          }

          if (sosCountdown <= 0) {
            stopSosReset();
            if (guideSos) guideSos.textContent = '1분 긴급 진정이 완료되었습니다. 신경계가 평온의 중심으로 돌아왔습니다 🌱';
          }
        }, 1000);
      });
    }

    if (btnSosStop) btnSosStop.addEventListener('click', stopSosReset);

    // 시각 씬 선택
    const sceneBtns = document.querySelectorAll('.btn-scene-select');
    const scenes = {
      forest: document.getElementById('scene-forest'),
      ocean: document.getElementById('scene-ocean'),
      fire: document.getElementById('scene-fire')
    };

    sceneBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetScene = btn.dataset.scene;
        sceneBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Object.keys(scenes).forEach(k => {
          if (scenes[k]) {
            if (k === targetScene) scenes[k].classList.add('active');
            else scenes[k].classList.remove('active');
          }
        });
      });
    });

    const btnRain = document.getElementById('btn-toggle-rain');
    const lblRain = document.getElementById('label-rain');
    if (btnRain) {
      btnRain.addEventListener('click', () => {
        const isPlaying = toggleRainNoise();
        if (isPlaying) {
          btnRain.classList.add('active');
          if (lblRain) lblRain.textContent = '안개비 백색소음 (ON)';
        } else {
          btnRain.classList.remove('active');
          if (lblRain) lblRain.textContent = '안개비 백색소음 (OFF)';
        }
      });
    }

    // 볼륨 슬라이더
    const volSlider = document.getElementById('sensory-volume');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        globalSensoryVol = parseFloat(e.target.value) / 100;
        const ctx = getCalmAudioContext();
        if (ctx) {
          if (rainGain) rainGain.gain.setValueAtTime(globalSensoryVol * 0.65, ctx.currentTime);
        }
      });
    }

    // 촉각 펄스 인터랙션
    const pulseCircle = document.getElementById('tactile-pulse-circle');
    const pulseText = document.getElementById('tactile-pulse-text');
    let isPulsing = false;
    if (pulseCircle) {
      pulseCircle.addEventListener('click', () => {
        isPulsing = !isPulsing;
        if (isPulsing) {
          pulseCircle.classList.add('pulsing');
          if (pulseText) pulseText.textContent = '가슴에 손을 얹고 온기를 느껴보세요';
          if (navigator.vibrate) {
            try { navigator.vibrate([40, 80, 40]); } catch (e) {}
          }
        } else {
          pulseCircle.classList.remove('pulsing');
          if (pulseText) pulseText.textContent = '터치하여 손바닥 온기 느끼기';
        }
      });
    }

    // 아로마 칩
    const aromaChips = document.querySelectorAll('.aroma-chip-item');
    aromaChips.forEach(chip => {
      chip.addEventListener('click', () => {
        aromaChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // 마인드풀 시핑 타이머
    const btnSip = document.getElementById('btn-start-sip');
    const sipTimerDisplay = document.getElementById('sip-timer-display');
    let sipInterval = null;
    let sipCount = 60;
    if (btnSip) {
      btnSip.addEventListener('click', () => {
        if (sipInterval) {
          clearInterval(sipInterval);
          sipInterval = null;
          btnSip.textContent = '시작 (60초)';
          if (sipTimerDisplay) sipTimerDisplay.textContent = '따뜻한 음료 한 잔을 준비하고 시작하세요.';
          return;
        }

        sipCount = 60;
        btnSip.textContent = '중단';
        if (sipTimerDisplay) sipTimerDisplay.textContent = '음료를 천천히 한 모금 머금고 입안의 온도를 느껴보세요... (60s)';

        sipInterval = setInterval(() => {
          sipCount--;
          if (sipTimerDisplay) {
            if (sipCount > 40) {
              sipTimerDisplay.textContent = `음료의 맛과 향이 혀끝에 머무는 감각에 집중합니다... (${sipCount}s)`;
            } else if (sipCount > 20) {
              sipTimerDisplay.textContent = `목을 타고 가슴 깊이 내려가는 따스함을 느껴보세요... (${sipCount}s)`;
            } else {
              sipTimerDisplay.textContent = `온몸으로 퍼져나가는 편안한 이완을 음미합니다... (${sipCount}s)`;
            }
          }
          if (sipCount <= 0) {
            clearInterval(sipInterval);
            sipInterval = null;
            btnSip.textContent = '다시 시작';
            if (sipTimerDisplay) sipTimerDisplay.textContent = '따뜻한 한 모금이 당신의 몸 전체를 포근하게 안아주었습니다 🌱';
          }
        }, 1000);
      });
    }
  }

  // ==========================================================================
  // TAB 3: NON-DOING ENERGY RECHARGE LOUNGE (연습 1 무목적 쉼 기반)
  // ==========================================================================
  function initEnergyRestLounge() {
    let selectedMinutes = 5;
    let restRemainingSec = 5 * 60;
    let restTotalSec = 5 * 60;
    let restTimerInterval = null;
    let isResting = false;

    const durationBtns = document.querySelectorAll('.btn-duration-pill');
    const btnStart = document.getElementById('btn-rest-start');
    const btnReset = document.getElementById('btn-rest-reset');
    const timeDisplay = document.getElementById('rest-time-display');
    const fillBar = document.getElementById('battery-fill-bar');
    const pctText = document.getElementById('battery-percent-text');
    const statusGuide = document.getElementById('rest-status-guide');

    const restAffirmations = [
      "휴식은 일을 끝낸 뒤에 받는 보상이 아니라, 생명을 지탱하는 기본 연료입니다.",
      "아무것도 생산하지 않는 순간에도 당신의 존재는 이미 완전하고 아름답습니다.",
      "쉼을 죄책감 없이 허락할 때, 당신의 영혼은 다시 맑게 피어납니다.",
      "세상의 빠른 보폭에 맞추려 하지 마세요. 당신만의 고유한 속도가 가장 안전합니다.",
      "내가 멈추어도 세상은 무너지지 않으며, 멈춤 속에서 가장 눈부신 지혜가 샘솟습니다."
    ];

    function formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function updateBatteryUI() {
      if (timeDisplay) timeDisplay.textContent = formatTime(restRemainingSec);
      const progress = Math.min(100, Math.round(((restTotalSec - restRemainingSec) / restTotalSec) * 100));
      const batteryLevel = Math.min(100, Math.max(15, progress));
      if (fillBar) fillBar.style.width = `${batteryLevel}%`;
      if (pctText) pctText.textContent = `${batteryLevel}%`;
    }

    durationBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isResting) return;
        durationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMinutes = parseInt(btn.dataset.minutes, 10) || 5;
        restTotalSec = selectedMinutes * 60;
        restRemainingSec = restTotalSec;
        updateBatteryUI();
      });
    });

    if (btnStart) {
      btnStart.addEventListener('click', () => {
        if (isResting) {
          // Pause
          clearInterval(restTimerInterval);
          restTimerInterval = null;
          isResting = false;
          btnStart.querySelector('#rest-start-text').textContent = '쉼 이어가기';
          if (statusGuide) statusGuide.textContent = '"잠시 멈추었습니다. 편안할 때 언제든 다시 이어가세요."';
          return;
        }

        // Start
        isResting = true;
        btnStart.querySelector('#rest-start-text').textContent = '쉼 일시정지';
        if (statusGuide) statusGuide.textContent = '"지금 당신은 아무것도 증명할 필요가 없습니다. 그저 숨 쉬세요."';

        restTimerInterval = setInterval(() => {
          restRemainingSec--;
          updateBatteryUI();

          if (restRemainingSec <= 0) {
            clearInterval(restTimerInterval);
            restTimerInterval = null;
            isResting = false;
            btnStart.querySelector('#rest-start-text').textContent = '쉼 완료';
            btnStart.disabled = true;
            if (statusGuide) {
              statusGuide.textContent = '🎉 온전한 무목적 쉼이 완료되었습니다! 맑아진 에너지를 만끽하세요.';
            }
          }
        }, 1000);
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (restTimerInterval) clearInterval(restTimerInterval);
        restTimerInterval = null;
        isResting = false;
        restRemainingSec = restTotalSec;
        if (btnStart) {
          btnStart.disabled = false;
          btnStart.querySelector('#rest-start-text').textContent = '무목적 쉼 시작하기';
        }
        if (statusGuide) {
          statusGuide.textContent = '"당신은 아무것도 생산하지 않아도 온전히 사랑받을 가치가 있습니다."';
        }
        updateBatteryUI();
      });
    }

    // 확언 새로고침
    const btnNextAff = document.getElementById('btn-next-aff');
    const affQuote = document.getElementById('rest-aff-quote');
    let affIdx = 0;
    if (btnNextAff && affQuote) {
      btnNextAff.addEventListener('click', () => {
        affIdx = (affIdx + 1) % restAffirmations.length;
        affQuote.textContent = `"${restAffirmations[affIdx]}"`;
      });
    }

    updateBatteryUI();
  }

  // 전역 인라인 및 모듈 간 탭 전환 지원
  window.switchTab = switchTab;

  tabPills.forEach(pill => {
    pill.addEventListener('pointerdown', () => {
      const se = document.scrollingElement || document.documentElement;
      const y = se.scrollTop;
      const until = Date.now() + 700;
      const restore = () => {
        if (Date.now() < until && se.scrollTop !== y) se.scrollTop = y;
      };
      requestAnimationFrame(function loop() {
        restore();
        if (Date.now() < until) requestAnimationFrame(loop);
      });
    });
    pill.addEventListener('click', () => {
      // 탭 목록을 눌러도 보던 화면은 그대로 둔다.
      switchTab(pill.dataset.tab, false);
    });
  });

  const heroBtnExplore = document.getElementById('hero-btn-explore');
  if (heroBtnExplore) {
    heroBtnExplore.addEventListener('click', () => {
      switchTab('tab-exercises');
    });
  }

  const navBrand = document.getElementById('nav-brand');
  if (navBrand) {
    navBrand.addEventListener('click', () => {
      switchTab('tab-exercises');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. (Key 로컬 BGM 및 홈 버튼 제거됨 - PRISM 상위 BgMusicPlayer 및 BigBangButton 사용)


  // 5. Book Companion & Page Sync Elements
  const companionPageInput = document.getElementById('companion-page-input');
  const btnSyncPage = document.getElementById('btn-sync-page');
  const btnRandomPrescription = document.getElementById('btn-random-prescription');
  const heroBtnRandom = document.getElementById('hero-btn-random');
  const syncDrawerCard = document.getElementById('sync-drawer-card');
  const syncChapterBadge = document.getElementById('sync-chapter-badge');
  const syncTitleText = document.getElementById('sync-title-text');
  const syncDescText = document.getElementById('sync-desc-text');
  const btnSyncPractice = document.getElementById('btn-sync-practice');
  const btnSyncAsk = document.getElementById('btn-sync-ask');

  let currentSyncedExIdx = 1;

  function syncPage(pageNum) {
    try {
      const page = parseInt(pageNum, 10) || 18;
      if (typeof window.BOOK_PAGE_INDEX === 'function') {
        const info = window.BOOK_PAGE_INDEX(page);
        if (syncChapterBadge) syncChapterBadge.textContent = info.chapter;
        if (syncTitleText) syncTitleText.textContent = info.title;
        if (syncDescText) syncDescText.textContent = info.desc;
        currentSyncedExIdx = info.exerciseIdx;
      }
    } catch (e) {
      console.warn('[Key] syncPage error:', e);
    }
  }

  if (btnSyncPage) {
    btnSyncPage.addEventListener('click', () => {
      syncPage(companionPageInput.value);
    });
  }

  if (companionPageInput) {
    companionPageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        syncPage(companionPageInput.value);
      }
    });
  }

  function askLucyWithText(text) {
    try {
      sessionStorage.setItem('lucy_injected_auto_send', text);
      sessionStorage.setItem('lucy_injected_input_draft', text);
    } catch (_) {}

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'NAVIGATE_LUCKEY',
        path: '/chat',
        text: text
      }, '*');
    } else {
      window.location.href = '/chat';
    }
  }
  window.askLucyWithText = askLucyWithText;

  if (btnSyncPractice) {
    btnSyncPractice.addEventListener('click', () => {
      window.startPractice(currentSyncedExIdx);
    });
  }

  if (btnSyncAsk) {
    btnSyncAsk.addEventListener('click', () => {
      const exerciseTitle = syncTitleText ? syncTitleText.textContent : '개운 리추얼';
      const text = `루시야, Key 개운 성전의 '${exerciseTitle}'에 대해 질문하고 싶어. 일상에서 운이 막히거나 마음이 답답할 때 이 개운법을 어떻게 실천하면 좋은 기운을 끌어당길 수 있는지 따뜻하게 알려줘.`;
      askLucyWithText(text);
    });
  }

  function launchRandomPractice() {
    if (!window.PRACTICE_EXERCISES || window.PRACTICE_EXERCISES.length === 0) return;

    // 40개 연습 중 무작위 1개 추첨
    const randIdx = Math.floor(Math.random() * window.PRACTICE_EXERCISES.length);
    const chosenEx = window.PRACTICE_EXERCISES[randIdx];

    // 쪽수 입력창과 쪽수 싱크 카드를 해당 연습으로 즉시 갱신
    if (companionPageInput) {
      companionPageInput.value = chosenEx.page;
    }
    syncPage(chosenEx.page);

    // 사운드 피드백 (싱잉볼 1회 단발 차임벨)
    if (window.soundscapeEngine && typeof window.soundscapeEngine.playChime === 'function') {
      window.soundscapeEngine.playChime();
    }

    // 40가지 연습 중 임의로 선정된 연습의 실천 스튜디오 즉시 실행!
    window.startPractice(chosenEx.globalIndex, true);
  }

  window.launchRandomPractice = launchRandomPractice;

  if (btnRandomPrescription) btnRandomPrescription.addEventListener('click', launchRandomPractice);
  if (heroBtnRandom) heroBtnRandom.addEventListener('click', launchRandomPractice);

  // 초기 18페이지 싱크 실행
  syncPage(18);

  let hasAutoLaunchedPractice = false;
  function autoLaunchRandomPrescription() {
    if (hasAutoLaunchedPractice) return;
    hasAutoLaunchedPractice = true;
    if (typeof window.launchRandomPractice === 'function') {
      window.launchRandomPractice();
    }
  }

  // 5-1. 외부(루시 채팅 등)에서 특정 실천 연습 즉시 실행 요청 처리 및 Key 진입 시 자동 랜덤 실천 처방 실행
  function checkAutoLaunchPractice() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const exParam = urlParams.get('ex') || sessionStorage.getItem('key_target_exercise');
      if (exParam) {
        sessionStorage.removeItem('key_target_exercise');
        const exIdx = parseInt(exParam, 10);
        if (exIdx && typeof window.startPractice === 'function') {
          setTimeout(() => {
            window.startPractice(exIdx);
          }, 350);
        }
        return;
      }

      // Key 진입 시 자동으로 오늘의 랜덤 실천 처방 모달 띄우기
      const noAuto = urlParams.get('no_auto');
      if (!noAuto) {
        setTimeout(() => {
          autoLaunchRandomPrescription();
        }, 500);
      }
    } catch (_) {}
  }

  window.addEventListener('message', (e) => {
    if (!e.data) return;
    if (e.data.type === 'AUTO_RANDOM_PRESCRIPTION') {
      setTimeout(() => {
        autoLaunchRandomPrescription();
      }, 150);
      return;
    }

    if (e.data.type === 'START_PRACTICE') {
      const exIdx = parseInt(e.data.exerciseIdx, 10);
      if (exIdx && typeof window.startPractice === 'function') {
        setTimeout(() => {
          window.startPractice(exIdx);
        }, 150);
      }
    }

    if (e.data.type === 'TOSS_TO_EXERCISES') {
      const text = e.data.text || '';
      // 1. 연습실 탭으로 전환
      if (typeof switchTab === 'function') {
        switchTab('tab-exercises');
      } else {
        const exercisesTabBtn = document.querySelector('.nav-tab-btn[data-tab="tab-exercises"]');
        if (exercisesTabBtn) exercisesTabBtn.click();
      }

      // 2. 토스된 텍스트와 가장 알맞은 40가지 연습 매칭 및 자동 시작
      if (text && window.PRACTICE_EXERCISES && window.PRACTICE_EXERCISES.length > 0) {
        let bestEx = window.PRACTICE_EXERCISES[0];
        let maxScore = -1;
        const lower = text.toLowerCase();
        const keywords = lower.match(/[가-힣a-zA-Z0-9]{2,}/g) || [];

        // 감정 및 상태별 테마 보정 가중치 사전
        const themeBoosters = [
          { pattern: /불안|걱정|초조|두려|공황|긴장|안절부절/, tags: ['외재화', '인지적 탈융합', '그라운딩', '신체 자각'] },
          { pattern: /호흡|숨|가슴|답답|맥박|심장/, tags: ['호흡', '이완', '미주신경', '신체 자각'] },
          { pattern: /우울|무기력|슬프|눈물|지침|피곤|공허/, tags: ['행동 활성화', '자기 자비', '가치 탐색', '인지 전환'] },
          { pattern: /화|분노|짜증|억울|격분|폭발/, tags: ['감정 수용', '신체 이완', '탈융합', '호흡'] },
          { pattern: /통증|어깨|목|두통|근육|뻐근|신체/, tags: ['바디스캔', '점진적 근육 이완', '신체 자각', '이완'] },
          { pattern: /자책|후회|죄책감|괴로|미안|자괴감/, tags: ['자기 자비', '내면 대화', '인지적 탈융합', '수용'] },
          { pattern: /잠|수면|불면|밤|악몽|뒤척/, tags: ['수면 위생', '점진적 근육 이완', '호흡', '이완'] },
          { pattern: /관계|사람|가족|친구|상처|갈등|외로/, tags: ['대인관계', '경계 세우기', '자기 자비', '소통'] },
          { pattern: /생각|잡념|과잉|꼬리|되뇌/, tags: ['생각 멈춤', '인지적 탈융합', '주의 전환', '그라운딩'] }
        ];

        window.PRACTICE_EXERCISES.forEach(ex => {
          let score = 0;
          const searchSpace = `${ex.title} ${ex.subtitle || ''} ${ex.tag || ''} ${ex.purpose || ''} ${ex.affirmation || ''} ${ex.clinicalTip || ''}`.toLowerCase();
          
          keywords.forEach(kw => {
            if (searchSpace.includes(kw)) score += Math.max(kw.length * 3, 6);
          });

          themeBoosters.forEach(b => {
            if (b.pattern.test(lower)) {
              if (b.tags.some(t => searchSpace.includes(t.toLowerCase()))) {
                score += 16;
              }
            }
          });

          if (score > maxScore) {
            maxScore = score;
            bestEx = ex;
          }
        });

        if (typeof window.startPractice === 'function') {
          setTimeout(() => {
            window.startPractice(bestEx.globalIndex);
          }, 250);
        }
      }
    }
  });

  // 🌟 Key iframe 내부 텍스트 선택(스크롤)을 상위 PRISM 부모 창으로 전달 (중복 및 공백 스팸 방지)
  let iframeSelTimer = null;
  let lastPostedIframeText = '';
  document.addEventListener('selectionchange', () => {
    if (iframeSelTimer) clearTimeout(iframeSelTimer);
    iframeSelTimer = setTimeout(() => {
      try {
        const sel = window.getSelection();
        const text = sel ? sel.toString().trim() : '';
        const validText = text && text.length >= 2 ? text : '';
        if (validText === lastPostedIframeText) return;
        lastPostedIframeText = validText;
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'PRISM_IFRAME_SELECTION',
            text: validText,
          }, '*');
        }
      } catch (_) {}
    }, 150);
  });

  setTimeout(checkAutoLaunchPractice, 200);

  // 6. Chat Interface
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const btnClearChat = document.getElementById('btn-clear-chat');
  const promptChips = document.querySelectorAll('.chip-btn');

  // Auto-resize textarea
  if (userInput) {
    userInput.addEventListener('input', () => {
      userInput.style.height = 'auto';
      userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
    });

    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  }

  // Prompt chips
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        userInput.value = prompt;
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  if (btnClearChat) {
    btnClearChat.addEventListener('click', () => {
      if (confirm('대화 기록을 지우고 새로 시작하시겠습니까?')) {
        chatMessages.innerHTML = `
          <div class="chat-bubble-row assistant">
            <div class="author-avatar" style="width: 34px; height: 34px; flex-shrink: 0;">
              <img src="/favicon.png?v=3.0" alt="Z" style="width: 20px; height: 20px;">
            </div>
            <div class="bubble-content">
              <p>대화가 초기화되었습니다. 지금 마음에 머무르는 어떤 생각이나 책 속 의문이든 편안하게 들려주세요.</p>
            </div>
          </div>
        `;
      }
    });
  }

  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = userInput.value.trim();
      if (!text) return;

      appendUserBubble(text);
      userInput.value = '';
      userInput.style.height = 'auto';

      const typingRow = appendTypingIndicator();

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });

        const data = await res.json();
        typingRow.remove();

        if (data.grounding && data.healing && data.liberation) {
          append3StageAssistantBubble(data);
        } else if (data.reply) {
          appendAssistantBubble(data.reply, data.recommendedExercises);
        } else {
          appendAssistantBubble('죄송합니다. 일시적인 연결 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        }
      } catch (err) {
        typingRow.remove();
        appendAssistantBubble('네트워크 연결 상태를 확인해 주세요.');
      }
    });
  }

  function appendUserBubble(text) {
    const row = document.createElement('div');
    row.className = 'chat-bubble-row user';
    row.innerHTML = `
      <div class="bubble-content">
        ${escapeHtml(text).replace(/\n/g, '<br>')}
      </div>
    `;
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'chat-bubble-row assistant';
    row.innerHTML = `
      <div class="author-avatar" style="width: 34px; height: 34px; flex-shrink: 0;">
        <img src="/favicon.png?v=3.0" alt="Z" style="width: 20px; height: 20px;">
      </div>
      <div class="bubble-content" style="color: var(--text-muted); font-style: italic;">
        몸의 감각을 살피고 마음의 렌즈를 전환하는 3단계 치유를 구성하고 있습니다...
      </div>
    `;
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return row;
  }

  // 3단계 통합 내면 치유 카드 렌더러 (초기불교 접지 + 기적수업 용서 + 온전함 선언)
  function append3StageAssistantBubble(data) {
    const row = document.createElement('div');
    row.className = 'chat-bubble-row assistant';

    let cardsHtml = `
      <div style="margin-bottom: 8px; font-weight: 600; color: var(--copper-primary); font-size: 0.88rem;">
        🕊️ 3단계 통합 심층 치유 처방 (신체 접지 · 기적수업 용서 · 온전함 선언)
      </div>
      <div class="stage-cards-container">
        <!-- 1단계: 신체 접지 -->
        <div class="stage-card grounding">
          <div class="stage-card-header">
            <span class="stage-badge">🌿 1단계 · 신체 접지 (Grounding)</span>
          </div>
          <div class="stage-card-title">지금 몸의 감각에 닻 내리기</div>
          <div class="stage-card-body">${escapeHtml(data.grounding).replace(/\n/g, '<br>')}</div>
        </div>

        <!-- 2단계: 투사 치유 및 용서 -->
        <div class="stage-card healing">
          <div class="stage-card-header">
            <span class="stage-badge">💧 2단계 · 투사 치유 & 용서 (Healing)</span>
          </div>
          <div class="stage-card-title">두려운 마음의 해석 내려놓기</div>
          <div class="stage-card-body">${formatMarkdown(data.healing)}</div>
        </div>

        <!-- 3단계: 본래의 온전함 선언 -->
        <div class="stage-card liberation">
          <div class="stage-card-header">
            <span class="stage-badge">✨ 3단계 · 본래의 온전함 (Liberation)</span>
          </div>
          <div class="stage-card-title">훼손되지 않는 내면의 빛</div>
          <div class="stage-card-body"><strong>"${escapeHtml(data.liberation)}"</strong></div>
        </div>
      </div>
    `;

    if (data.recommendedExercises && data.recommendedExercises.length > 0) {
      const ex = data.recommendedExercises[0];
      const globalIdx = getGlobalExerciseIndex(ex.chapter, ex.index);
      const launchButton = globalIdx === null ? '' : `<button class="btn-copper" style="padding: 4px 12px; font-size: 0.8rem;" onclick="window.startPractice(${globalIdx})">🎯 직접 실천하기</button>`;
      cardsHtml += `
        <div style="margin-top: 18px; margin-bottom: 6px; font-weight: 700; color: var(--text-title); font-size: 0.92rem;">
          🔑 Key 개운 성전 맞춤 추천 리추얼:
        </div>
        <div class="chat-rec-box">
          <div class="chat-rec-header">
            <span class="chat-rec-tag">${ex.chapter}장 · ${ex.tag || '마음 연습'}</span>
            ${launchButton}
          </div>
          <div class="chat-rec-title">연습 ${globalIdx ?? ex.index}. ${ex.title} (${ex.page}쪽)</div>
          <div class="chat-rec-desc">${ex.subtitle ? `${ex.subtitle} - ` : ''}${ex.description || ex.purpose || ''}</div>
        </div>
      `;
    }

    row.innerHTML = `
      <div class="author-avatar" style="width: 34px; height: 34px; flex-shrink: 0;">
        <img src="/favicon.png?v=3.0" alt="Z" style="width: 20px; height: 20px;">
      </div>
      <div class="bubble-content">
        ${cardsHtml}
      </div>
    `;

    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendAssistantBubble(markdownText, recommendedExercises) {
    const row = document.createElement('div');
    row.className = 'chat-bubble-row assistant';

    let contentHtml = formatMarkdown(markdownText);

    if (recommendedExercises && recommendedExercises.length > 0) {
      const ex = recommendedExercises[0];
      const globalIdx = getGlobalExerciseIndex(ex.chapter, ex.index);
      const launchButton = globalIdx === null ? '' : `<button class="btn-copper" style="padding: 4px 12px; font-size: 0.8rem;" onclick="window.startPractice(${globalIdx})">🎯 직접 실천하기</button>`;
      contentHtml += `
        <div style="margin-top: 18px; margin-bottom: 6px; font-weight: 700; color: var(--text-title); font-size: 0.92rem;">
          🔑 Key 개운 성전 맞춤 추천 리추얼:
        </div>
        <div class="chat-rec-box">
          <div class="chat-rec-header">
            <span class="chat-rec-tag">${ex.chapter}장 · ${ex.tag || '마음 연습'}</span>
            ${launchButton}
          </div>
          <div class="chat-rec-title">연습 ${globalIdx ?? ex.index}. ${ex.title} (${ex.page}쪽)</div>
          <div class="chat-rec-desc">${ex.subtitle ? `${ex.subtitle} - ` : ''}${ex.description || ex.purpose || ''}</div>
        </div>
      `;
    }

    row.innerHTML = `
      <div class="author-avatar" style="width: 34px; height: 34px; flex-shrink: 0;">
        <img src="/favicon.png?v=3.0" alt="Z" style="width: 20px; height: 20px;">
      </div>
      <div class="bubble-content">
        ${contentHtml}
      </div>
    `;

    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getGlobalExerciseIndex(chapter, index) {
    const exercise = window.PRACTICE_EXERCISES?.find(item =>
      Number(item.chapter) === Number(chapter) && Number(item.index) === Number(index)
    );
    return exercise?.globalIndex ?? null;
  }

  // 7. 90 Exercises Studio Grid 렌더링 및 필터링
  const exercisesGrid = document.getElementById('exercises-grid');
  const filterBtns = document.querySelectorAll('.exercises-filter-strip .filter-pill-btn');

  function renderExercisesGrid(filterChapter = 'all') {
    if (!exercisesGrid || !window.PRACTICE_EXERCISES) return;

    exercisesGrid.innerHTML = '';
    const filtered = window.PRACTICE_EXERCISES.filter(ex => {
      if (filterChapter === 'all') return true;
      if (filterChapter === 'book1') return ex.globalIndex <= 40;
      if (filterChapter === 'book2') return ex.globalIndex > 40;
      return ex.chapter.toString() === filterChapter;
    });

    filtered.forEach((ex, idx) => {
      const card = document.createElement('div');
      card.className = 'studio-ex-card';
      const staggerDelay = Math.min(idx * 0.02, 0.45).toFixed(3);
      card.style.animationDelay = `${staggerDelay}s`;
      const chapter = ex.chapter || 1;
      const tag = ex.tag || '마음 연습';
      const page = ex.page || 18;
      const icon = ex.icon || '🎯';
      const title = ex.title || '마음 연습';
      const subtitle = ex.subtitle || '';
      const description = ex.description || ex.purpose || '마음의 평온을 되찾는 실천 연습입니다.';
      const bookBadge = ex.globalIndex <= 40 ? '📖 불안 개운' : '🌿 예민 케어';

      card.innerHTML = `
        <div class="ex-card-top-line">
          <span class="ex-card-tag">${chapter}장 · ${tag} · ${bookBadge}</span>
          <span class="ex-card-page">${page}P</span>
        </div>
        <h3 class="ex-card-title">${icon} 연습 ${ex.globalIndex}. ${title}</h3>
        <div class="ex-card-subtitle">${subtitle}</div>
        <p class="ex-card-description">${description}</p>
        <div class="ex-card-footer-btns">
          <button class="btn-card-launch" onclick="window.startPractice(${ex.globalIndex})">
            <span>🎯 실천하기</span>
          </button>
          <button class="btn-card-chat" onclick="window.askAboutPractice(${ex.globalIndex})" title="루시에게 이 연습 질문하기">
            💬 루시에게 질문
          </button>
        </div>
      `;
      exercisesGrid.appendChild(card);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderExercisesGrid(btn.dataset.chapter);
    });
  });

  renderExercisesGrid('all');

  window.askAboutPractice = function(globalIdx) {
    const ex = window.PRACTICE_EXERCISES.find(e => e.globalIndex === globalIdx);
    if (!ex) return;
    const purposeText = ex.purpose ? `\n• 개운 의도: ${ex.purpose}` : '';
    const clinicalTipText = ex.clinicalTip ? `\n• 개운 비결: ${ex.clinicalTip}` : '';
    const affirmationText = ex.affirmation ? `\n• 소원 확언: "${ex.affirmation}"` : '';

    const text = `루시야, Key ${ex.chapter}장의 '${ex.icon || '🎯'} 연습 ${ex.globalIndex}. ${ex.title}' 실천법에 대해 질문하고 싶어.${purposeText}${clinicalTipText}${affirmationText}\n\n이 실천 연습을 일상에서 어떻게 적용하면 좋을지 핵심 비결과 따뜻한 조언을 해줘.`;

    try {
      sessionStorage.setItem('lucy_injected_auto_send', text);
      sessionStorage.setItem('lucy_injected_input_draft', text);
    } catch (_) {}

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'NAVIGATE_LUCKEY', path: '/chat', text }, '*');
    } else if (window.top) {
      window.top.location.href = '/chat';
    } else {
      window.location.href = '/chat';
    }
  };

  // 8. Balloon Breathing (유기적 5초 풍선 호흡 & 싱잉볼 오디오 알림 시스템)
  const breathingBalloon = document.getElementById('breathing-balloon');
  const balloonStageArea = document.querySelector('.balloon-stage-area');
  const balloonPhase = document.getElementById('balloon-phase');
  const balloonTimer = document.getElementById('balloon-timer');
  const btnBreathingToggle = document.getElementById('btn-breathing-toggle');
  const btnBreathingFinish = document.getElementById('btn-breathing-finish');
  const cycleCountText = document.getElementById('cycle-count');
  const targetCycleDisplay = document.getElementById('target-cycle-display');
  const goalButtons = document.querySelectorAll('.btn-breathing-goal');

  // 오디오 알림 컨트롤
  const btnBreathingAudioToggle = document.getElementById('btn-breathing-audio-toggle');
  const breathingAudioIcon = document.getElementById('breathing-audio-icon');
  const breathingAudioLabel = document.getElementById('breathing-audio-label');
  const audioBellStatus = document.getElementById('audio-bell-status');

  // 📳 진동 햅틱 피드백 컨트롤
  const btnBreathingHapticToggle = document.getElementById('btn-breathing-haptic-toggle');
  const breathingHapticIcon = document.getElementById('breathing-haptic-icon');
  const breathingHapticLabel = document.getElementById('breathing-haptic-label');
  let breathingHapticEnabled = true;

  try {
    const savedHaptic = localStorage.getItem('calm_breathing_haptic_feedback');
    if (savedHaptic !== null) {
      breathingHapticEnabled = savedHaptic === 'true';
    }
  } catch (_) {}

  function updateHapticUI() {
    if (!btnBreathingHapticToggle) return;
    if (breathingHapticEnabled) {
      btnBreathingHapticToggle.classList.add('active');
      if (breathingHapticIcon) breathingHapticIcon.textContent = '📳';
      if (breathingHapticLabel) breathingHapticLabel.textContent = '정점 햅틱: 켜짐';
    } else {
      btnBreathingHapticToggle.classList.remove('active');
      if (breathingHapticIcon) breathingHapticIcon.textContent = '🔇';
      if (breathingHapticLabel) breathingHapticLabel.textContent = '정점 햅틱: 꺼짐';
    }
  }
  updateHapticUI();

  if (btnBreathingHapticToggle) {
    btnBreathingHapticToggle.addEventListener('click', () => {
      breathingHapticEnabled = !breathingHapticEnabled;
      try {
        localStorage.setItem('calm_breathing_haptic_feedback', String(breathingHapticEnabled));
      } catch (_) {}
      updateHapticUI();
      if (breathingHapticEnabled) {
        triggerBalloonHaptic('inhale-peak');
      }
    });
  }

  /**
   * 들이쉬기 및 내쉬기 정점(Peak) 도달 시 진동 햅틱 피드백 발동
   * @param {'inhale-peak' | 'exhale-peak'} phase
   */
  function triggerBalloonHaptic(phase) {
    // 1. 상위 React 앱(CalmApp)으로 postMessage 무조건 즉시 발송
    try {
      if (typeof window !== 'undefined' && window.parent) {
        window.parent.postMessage({
          type: 'BALLOON_BREATHING_HAPTIC',
          phase: phase, // 'inhale-peak' | 'exhale-peak'
        }, '*');
      }
    } catch (_) {}

    if (!breathingHapticEnabled) return;

    // 2. 모바일 기기 직접 하드웨어 진동 (Vibration API)
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        if (phase === 'inhale-peak') {
          // 들숨 정점: 폐가 가득 찼을 때의 상쾌한 이중 펄스 진동
          navigator.vibrate([35, 30, 45]);
        } else if (phase === 'exhale-peak') {
          // 날숨 정점: 숨을 완전히 비워냈을 때의 안정된 삼중 하강 진동
          navigator.vibrate([50, 40, 25]);
        } else {
          navigator.vibrate(40);
        }
      } catch (_) {}
    }

    // 3. 풍선 시각적 펄스 링 연동
    if (breathingBalloon) {
      const pulseClass = phase === 'inhale-peak' ? 'haptic-peak-inhale' : 'haptic-peak-exhale';
      breathingBalloon.classList.remove('haptic-peak-inhale', 'haptic-peak-exhale');
      void breathingBalloon.offsetWidth;
      breathingBalloon.classList.add(pulseClass);
      setTimeout(() => {
        if (breathingBalloon) {
          breathingBalloon.classList.remove(pulseClass);
        }
      }, 550);
    }
  }

  // 완주 축하 카드 & 재시작 버튼
  const celebrationCard = document.getElementById('breathing-celebration-card');
  const celebrationTitle = document.getElementById('celebration-title');
  const celebrationDesc = document.getElementById('celebration-desc');
  const btnBreathingRestart = document.getElementById('btn-breathing-restart');

  let cycleCount = 0;
  let targetCycles = 5;
  let currentPhase = 'inhale'; // inhale, hold, exhale
  let countdown = 5;
  let breathingAudioEnabled = true;

  // 오디오 알림 설정 로드 (localStorage)
  try {
    const savedAudio = localStorage.getItem('calm_breathing_audio_bell');
    if (savedAudio !== null) {
      breathingAudioEnabled = savedAudio === 'true';
    }
  } catch (_) {}

  function updateAudioBellUI() {
    if (!btnBreathingAudioToggle) return;
    if (breathingAudioEnabled) {
      btnBreathingAudioToggle.classList.add('active');
      if (breathingAudioIcon) breathingAudioIcon.textContent = '🔔';
      if (breathingAudioLabel) breathingAudioLabel.textContent = '세션 완료 종소리(싱잉볼) 알림: 켜짐';
      if (audioBellStatus) {
        audioBellStatus.textContent = '싱잉볼 소리 활성';
        audioBellStatus.style.background = 'rgba(90, 114, 93, 0.12)';
        audioBellStatus.style.color = 'var(--forest-accent)';
      }
    } else {
      btnBreathingAudioToggle.classList.remove('active');
      if (breathingAudioIcon) breathingAudioIcon.textContent = '🔕';
      if (breathingAudioLabel) breathingAudioLabel.textContent = '세션 완료 종소리 알림: 꺼짐';
      if (audioBellStatus) {
        audioBellStatus.textContent = '알림 음소거';
        audioBellStatus.style.background = 'rgba(160, 160, 160, 0.15)';
        audioBellStatus.style.color = 'var(--text-muted)';
      }
    }
  }
  updateAudioBellUI();

  if (btnBreathingAudioToggle) {
    btnBreathingAudioToggle.addEventListener('click', () => {
      breathingAudioEnabled = !breathingAudioEnabled;
      try {
        localStorage.setItem('calm_breathing_audio_bell', String(breathingAudioEnabled));
      } catch (_) {}
      updateAudioBellUI();
      // 알림 켤 때 부드러운 짧은 피드백 타종
      if (breathingAudioEnabled && window.soundscapeEngine) {
        if (typeof window.soundscapeEngine.playSingingBowlChime === 'function') {
          window.soundscapeEngine.playSingingBowlChime({ volume: 0.5, duration: 3.5 });
        }
      }
    });
  }

  // 목표 사이클 선택 이벤트
  if (goalButtons) {
    goalButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-cycles') || '5', 10);
        targetCycles = val;
        goalButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (targetCycleDisplay) targetCycleDisplay.textContent = targetCycles;
      });
    });
  }

  if (btnBreathingToggle) {
    btnBreathingToggle.addEventListener('click', () => {
      if (isBreathingActive) {
        pauseBreathing();
      } else {
        startBreathing();
      }
    });
  }

  if (breathingBalloon) {
    breathingBalloon.addEventListener('click', () => {
      if (isBreathingActive) {
        pauseBreathing();
      } else {
        startBreathing();
      }
    });
  }

  if (btnBreathingFinish) {
    btnBreathingFinish.addEventListener('click', () => {
      stopBreathing(true);
    });
  }

  if (btnBreathingRestart) {
    btnBreathingRestart.addEventListener('click', () => {
      if (celebrationCard) celebrationCard.style.display = 'none';
      startBreathing();
    });
  }

  function startBreathing() {
    // 사용자 클릭 시 오디오 엔진 깨우기 (Web Audio API 정책 완벽 대응)
    if (window.soundscapeEngine && typeof window.soundscapeEngine.init === 'function') {
      window.soundscapeEngine.init();
    }

    if (celebrationCard) celebrationCard.style.display = 'none';
    if (breathingBalloon) breathingBalloon.classList.remove('chime-ringing');

    isBreathingActive = true;
    btnBreathingToggle.innerHTML = '<span>호흡 일시정지</span>';
    btnBreathingToggle.classList.add('btn-sage');
    btnBreathingToggle.classList.remove('btn-copper');
    if (btnBreathingFinish) btnBreathingFinish.style.display = 'inline-block';

    currentPhase = 'inhale';
    countdown = 5;
    updateBalloonVisual();

    if (breathingInterval) {
      clearInterval(breathingInterval);
      breathingInterval = null;
    }

    breathingInterval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        if (currentPhase === 'inhale') {
          // 들이쉬기 정점(Inhale Peak) 도달: 5초 팽창 완결 시 부모 프레임 통지 및 진동 햅틱 발동
          try {
            window.parent.postMessage({ type: 'BALLOON_BREATHING_HAPTIC', phase: 'inhale-peak' }, '*');
          } catch (_) {}
          triggerBalloonHaptic('inhale-peak');
          currentPhase = 'hold';
          countdown = 2;
        } else if (currentPhase === 'hold') {
          currentPhase = 'exhale';
          countdown = 5;
        } else {
          // 내쉬기 정점(Exhale Peak) 도달: 5초 배출 완결 시 부모 프레임 통지 및 진동 햅틱 발동
          try {
            window.parent.postMessage({ type: 'BALLOON_BREATHING_HAPTIC', phase: 'exhale-peak' }, '*');
          } catch (_) {}
          triggerBalloonHaptic('exhale-peak');
          currentPhase = 'inhale';
          countdown = 5;
          cycleCount++;
          if (cycleCountText) cycleCountText.textContent = cycleCount;

          // 목표 사이클 달성 시 자동 세션 완료 및 부드러운 싱잉볼 종소리 알림
          if (cycleCount >= targetCycles) {
            stopBreathing(true);
            return;
          }
        }
        updateBalloonVisual();
      } else {
        if (balloonTimer) balloonTimer.textContent = countdown;
      }
    }, 1000);
  }

  function pauseBreathing() {
    isBreathingActive = false;
    if (breathingInterval) {
      clearInterval(breathingInterval);
      breathingInterval = null;
    }
    btnBreathingToggle.innerHTML = '<span>호흡 계속하기</span>';
    btnBreathingToggle.classList.add('btn-copper');
    btnBreathingToggle.classList.remove('btn-sage');
    if (balloonPhase) balloonPhase.textContent = '일시 정지됨 (준비되면 계속하세요)';
    if (breathingBalloon) {
      breathingBalloon.style.transform = '';
      breathingBalloon.classList.remove('phase-inhale', 'phase-hold', 'phase-exhale');
      breathingBalloon.classList.add('phase-idle');
    }
    if (balloonStageArea) {
      balloonStageArea.classList.remove('phase-inhale', 'phase-hold', 'phase-exhale');
      balloonStageArea.classList.add('phase-idle');
    }
  }

  function stopBreathing(isFinished = false) {
    isBreathingActive = false;
    if (breathingInterval) {
      clearInterval(breathingInterval);
      breathingInterval = null;
    }
    btnBreathingToggle.innerHTML = '<span>호흡 시작하기</span>';
    btnBreathingToggle.classList.add('btn-copper');
    btnBreathingToggle.classList.remove('btn-sage');
    if (btnBreathingFinish) btnBreathingFinish.style.display = 'none';
    if (breathingBalloon) {
      breathingBalloon.style.transform = '';
      breathingBalloon.classList.remove('phase-inhale', 'phase-hold', 'phase-exhale');
      breathingBalloon.classList.add('phase-idle');
    }
    if (balloonStageArea) {
      balloonStageArea.classList.remove('phase-inhale', 'phase-hold', 'phase-exhale');
      balloonStageArea.classList.add('phase-idle');
    }

    if (isFinished) {
      const finalCount = cycleCount || targetCycles;
      if (balloonPhase) {
        balloonPhase.innerHTML = `🎉 <span style="color:var(--forest-accent); font-weight:700;">${finalCount}회 완주! 온몸의 긴장이 부드럽게 이완되었습니다.</span>`;
      }
      if (balloonTimer) balloonTimer.textContent = '완료';

      // 싱잉볼 사운드웨이브 펄스 링 시각 효과
      if (breathingBalloon) {
        breathingBalloon.classList.add('chime-ringing');
        setTimeout(() => {
          if (breathingBalloon) breathingBalloon.classList.remove('chime-ringing');
        }, 5000);
      }

      // 오디오 알림 재생: 부드러운 티베트 싱잉볼 종소리
      if (breathingAudioEnabled && window.soundscapeEngine) {
        if (typeof window.soundscapeEngine.playSingingBowlChime === 'function') {
          window.soundscapeEngine.playSingingBowlChime({ volume: 0.75, duration: 7.0 });
        } else if (typeof window.soundscapeEngine.playChime === 'function') {
          window.soundscapeEngine.playChime();
        }
      }

      // 완주 축하 카드 노출
      if (celebrationCard) {
        if (celebrationTitle) celebrationTitle.textContent = `${finalCount}회 풍선 호흡 완주!`;
        if (celebrationDesc) {
          celebrationDesc.innerHTML = breathingAudioEnabled
            ? `부드러운 싱잉볼 종소리와 함께 호흡을 마치고 온몸의 긴장이 풀렸습니다.`
            : `호흡을 깊게 비워내고 몸과 마음에 평온한 중심을 되찾았습니다.`;
        }
        celebrationCard.style.display = 'block';
      }

      // 사이클 초기화
      cycleCount = 0;
      if (cycleCountText) cycleCountText.textContent = '0';
    } else {
      if (balloonPhase) balloonPhase.textContent = '준비';
      if (balloonTimer) balloonTimer.textContent = '5';
      if (celebrationCard) celebrationCard.style.display = 'none';
    }
  }

  function updateBalloonVisual() {
    if (!breathingBalloon) return;
    breathingBalloon.style.transform = '';
    if (currentPhase === 'inhale') {
      balloonPhase.textContent = '들이쉬기 (숨을 가득 채우세요)';
      balloonTimer.textContent = countdown;
      breathingBalloon.className = 'organic-balloon phase-inhale';
      if (balloonStageArea) balloonStageArea.className = 'balloon-stage-area phase-inhale';
    } else if (currentPhase === 'hold') {
      balloonPhase.textContent = '잠시 멈춤 (평온 유지)';
      balloonTimer.textContent = countdown;
      breathingBalloon.className = 'organic-balloon phase-hold';
      if (balloonStageArea) balloonStageArea.className = 'balloon-stage-area phase-hold';
    } else {
      balloonPhase.textContent = '내쉬기 (긴장을 입으로 배출)';
      balloonTimer.textContent = countdown;
      breathingBalloon.className = 'organic-balloon phase-exhale';
      if (balloonStageArea) balloonStageArea.className = 'balloon-stage-area phase-exhale';
    }
  }

  // 9. Interactive Practice Studio Modal
  const modalPractice = document.getElementById('modal-practice');
  const btnCloseStudio = document.getElementById('btn-close-studio');
  const studioIcon = document.getElementById('studio-icon');
  const studioChapter = document.getElementById('studio-chapter');
  const studioTitle = document.getElementById('studio-title');
  const studioBody = document.getElementById('studio-body');
  const studioStepperDots = document.getElementById('studio-stepper-dots');
  const studioPrevStep = document.getElementById('studio-prev-step');
  const studioNextStep = document.getElementById('studio-next-step');

  let activePractice = null;
  let activeStepIdx = 0;
  let practiceAnswers = {};
  let studioTimerInterval = null;
  let activePracticeIsRandom = false;

  window.startPractice = function(globalIdx, isRandom = false) {
    const ex = window.PRACTICE_EXERCISES.find(e => e.globalIndex === globalIdx);
    if (!ex) return;

    activePractice = ex;
    activeStepIdx = 0;
    practiceAnswers = {};
    activePracticeIsRandom = isRandom;

    studioIcon.textContent = ex.icon || '🎯';
    const randomBadge = isRandom ? '🎲 오늘의 개운 비법 · ' : '';
    studioChapter.textContent = `${randomBadge}${ex.chapter || 1}장 · ${ex.tag || '개운 리추얼'} (비전 ${ex.page || 18}P)`;
    studioTitle.textContent = `연습 ${ex.globalIndex ?? 1}. ${ex.title || ''}`;

    renderStepDots();
    renderCurrentStep();

    modalPractice.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  function closePracticeStudio() {
    if (studioTimerInterval) {
      clearInterval(studioTimerInterval);
      studioTimerInterval = null;
    }
    modalPractice.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (btnCloseStudio) btnCloseStudio.addEventListener('click', closePracticeStudio);

  function renderStepDots() {
    if (!studioStepperDots || !activePractice) return;
    studioStepperDots.innerHTML = '';
    activePractice.steps.forEach((step, idx) => {
      const dot = document.createElement('div');
      dot.className = `s-dot ${idx === activeStepIdx ? 'active' : ''} ${idx < activeStepIdx ? 'completed' : ''}`;
      studioStepperDots.appendChild(dot);
    });
  }

  function renderCurrentStep() {
    if (!activePractice) return;
    if (studioTimerInterval) {
      clearInterval(studioTimerInterval);
      studioTimerInterval = null;
    }
    const step = activePractice.steps[activeStepIdx];
    renderStepDots();

    studioPrevStep.style.display = activeStepIdx > 0 ? 'inline-block' : 'none';
    if (activeStepIdx === activePractice.steps.length - 1) {
      studioNextStep.textContent = '개운 완료 및 운기 노트 저장';
    } else {
      studioNextStep.textContent = '다음 단계';
    }

    let stepHtml = '';

    // 첫 번째 단계일 때 상단에 실천 목적 및 개운 마스터 코칭 팁 배너 표시
    if (activeStepIdx === 0) {
      const purpose = activePractice.purpose || activePractice.description || '막힌 기운을 비우고 행운의 물길을 여는 개운 실천입니다.';
      const clinicalTip = activePractice.clinicalTip || '탁한 기운과 걱정은 스쳐 지나가는 파도입니다. 가만히 흘려보내면 맑은 운기가 차오릅니다.';

      if (activePracticeIsRandom) {
        stepHtml += `
          <div class="random-rx-banner">
            <span class="rx-badge-icon">🎲</span>
            <div>
              <div class="rx-badge-title">오늘의 맞춤 개운(開運) 리추얼</div>
              <div class="rx-badge-sub">40가지 개운 비법 중 지금 이 순간 당신의 운기를 틔워줄 리추얼이 선택되었습니다.</div>
            </div>
          </div>
        `;
      }

      stepHtml += `
        <div class="practice-overview-banner">
          <div class="practice-meta-row">
            <span class="practice-meta-pill">⏱ 소요시간: ${activePractice.timeEstimate || '3분'}</span>
            <span class="practice-meta-pill">📖 비전 ${activePractice.page || 18}쪽</span>
            <span class="practice-meta-pill">🏷️ ${activePractice.tag || '개운 리추얼'}</span>
            ${activePractice.preparation && activePractice.preparation !== '없음' ? `<span class="practice-meta-pill prep-pill" style="background: rgba(184, 115, 51, 0.12); color: var(--copper-primary); border-color: rgba(184, 115, 51, 0.3); font-weight: 700;">🎒 준비물: ${escapeHtml(activePractice.preparation)}</span>` : ''}
          </div>
          <div class="practice-purpose-text">
            <strong>🎯 개운 목적:</strong> ${purpose}
          </div>
        </div>

        <div class="clinical-tip-card">
          <div class="clinical-tip-title">💡 Key 개운(開運) 마스터의 원포인트 비결</div>
          <div class="clinical-tip-content">${clinicalTip}</div>
        </div>
      `;
    }

    stepHtml += `
      <div class="studio-step-card">
        <h3 class="step-instruction-heading">${step.title || '실천 단계'}</h3>
        <p class="step-instruction-desc">${step.instruction || ''}</p>
    `;

    // 작성 예시가 있는 경우 예시 박스 출력
    if (step.example) {
      stepHtml += `
        <div class="practice-example-box">
          <div class="practice-example-badge">💡 작성 예시 가이드</div>
          <div class="practice-example-content">${escapeHtml(step.example)}</div>
        </div>
      `;
    }

    // 타입별 인터랙티브 렌더링
    if (step.type === 'text_input') {
      step.fields.forEach(f => {
        const val = practiceAnswers[f.id] || '';
        const isLong = f.type === 'textarea' || (f.label && f.label.length > 35) || (f.placeholder && f.placeholder.length > 40);
        stepHtml += `
          <div class="practice-field-row">
            <label>${escapeHtml(f.label)}</label>
            ${isLong ? `
              <textarea id="input-${f.id}" rows="${f.rows || 3}" placeholder="${escapeHtml(f.placeholder)}">${escapeHtml(val)}</textarea>
            ` : `
              <input type="text" id="input-${f.id}" placeholder="${escapeHtml(f.placeholder)}" value="${escapeHtml(val)}">
            `}
          </div>
        `;
      });
    } else if (step.type === 'textarea') {
      const val = practiceAnswers[step.field.id] || '';
      stepHtml += `
        <div class="practice-field-row">
          <label>${step.field.label}</label>
          <textarea id="input-${step.field.id}" rows="4" placeholder="${step.field.placeholder}">${escapeHtml(val)}</textarea>
        </div>
      `;
    } else if (step.type === 'reframer') {
      const valA = practiceAnswers[step.fieldA.id] || '';
      const valB = practiceAnswers[step.fieldB.id] || '';
      stepHtml += `
        <div class="reframer-grid">
          <div class="reframer-col">
            <label style="color: #c44;">❌ ${step.fieldA.label}</label>
            <textarea id="input-${step.fieldA.id}" rows="3" placeholder="${step.fieldA.placeholder}">${escapeHtml(valA)}</textarea>
          </div>
          <div class="reframer-col">
            <label style="color: var(--sage-accent);">🌿 ${step.fieldB.label}</label>
            <textarea id="input-${step.fieldB.id}" rows="3" placeholder="${step.fieldB.placeholder}">${escapeHtml(valB)}</textarea>
          </div>
        </div>
      `;
    } else if (step.type === 'timer') {
      stepHtml += `
        <div class="studio-timer-box">
          <div class="circle-timer-num" id="s-timer-display">${step.duration}<span>초</span></div>
          <div class="studio-timer-controls" style="display: flex; gap: 8px; justify-content: center; align-items: center; margin-top: 14px;">
            <button id="s-timer-btn" class="btn-copper" style="min-width: 130px;">카운트다운 시작</button>
            <button id="s-timer-reset-btn" class="btn-linen" style="display: none; padding: 10px 16px; border: 1px solid var(--border-linen); border-radius: var(--radius-sm); font-size: 0.88rem; cursor: pointer; color: var(--text-muted);">초기화</button>
          </div>
        </div>
      `;
      if (step.tip) {
        stepHtml += `<p style="text-align: center; font-size: 0.88rem; color: var(--text-muted);">${step.tip}</p>`;
      }
    } else if (step.type === 'checklist') {
      stepHtml += `<div class="practice-checklist" style="display: flex; flex-direction: column; gap: 10px; margin: 14px 0;">`;
      step.options.forEach((opt, idx) => {
        const checked = practiceAnswers[`chk_${idx}`] ? 'checked' : '';
        stepHtml += `
          <label style="display: flex; align-items: flex-start; gap: 12px; font-size: 0.95rem; cursor: pointer; background: #faf6f0; padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-linen);">
            <input type="checkbox" id="chk_${idx}" ${checked} style="width: 18px; height: 18px; margin-top: 3px; accent-color: var(--copper-primary);">
            <span style="color: var(--text-body); line-height: 1.5;">${opt}</span>
          </label>
        `;
      });
      stepHtml += `</div>`;
    }

    // 마지막 단계일 경우 소원 확언 및 실천 후 잔여 탁기(액운) 척도 슬라이더 추가
    if (activeStepIdx === activePractice.steps.length - 1 && activePractice.affirmation) {
      const sudVal = practiceAnswers['sud_score'] || 3;
      stepHtml += `
        <div style="margin-top: 24px; padding: 16px 20px; background: linear-gradient(135deg, #fcf9f2, #f6f0df); border-left: 4px solid var(--gold-accent); border-radius: 0 var(--radius-md) var(--radius-md) 0;">
          <div style="font-size: 0.78rem; font-weight: 800; color: #a46c26; text-transform: uppercase;">🌟 가슴에 새길 오늘의 소원 & 개운 확언</div>
          <p style="font-family: 'Nanum Myeongjo', serif; font-size: 1.05rem; font-weight: 700; color: var(--text-title); margin-top: 4px;">
            "${activePractice.affirmation}"
          </p>
        </div>

        <div class="sud-meter-box">
          <div class="sud-score-display">
            <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-body);">실천 후 남아 있는 답답함·탁기(액운) 정도:</span>
            <span class="sud-score-val" id="sud-val-text">${sudVal} / 10</span>
          </div>
          <input type="range" id="input-sud-meter" min="0" max="10" value="${sudVal}" style="cursor: pointer; accent-color: var(--copper-primary);">
          <div style="display: flex; justify-content: space-between; font-size: 0.76rem; color: var(--text-muted);">
            <span>0점: 맑게 열린 운기</span>
            <span>5점: 보통 상태</span>
            <span>10점: 강한 답답함</span>
          </div>
        </div>
      `;
    }

    stepHtml += `</div>`;
    studioBody.innerHTML = stepHtml;

    // 단계별 인터랙티브 이벤트 바인딩
    if (step.type === 'timer') {
      const timerBtn = document.getElementById('s-timer-btn');
      const timerResetBtn = document.getElementById('s-timer-reset-btn');
      const timerDisplay = document.getElementById('s-timer-display');
      const totalDuration = step.duration;
      let remain = totalDuration;
      let isRunning = false;

      function updateDisplay() {
        if (!timerDisplay) return;
        if (remain <= 0) {
          timerDisplay.innerHTML = `<span style="color:var(--forest-accent); font-weight:800;">완료 ✨</span>`;
        } else {
          timerDisplay.innerHTML = `${remain}<span>초</span>`;
        }
      }

      function stopStudioTimer() {
        if (studioTimerInterval) {
          clearInterval(studioTimerInterval);
          studioTimerInterval = null;
        }
        isRunning = false;
      }

      if (timerBtn) {
        timerBtn.addEventListener('click', () => {
          if (remain <= 0) {
            remain = totalDuration;
            updateDisplay();
          }

          if (isRunning) {
            stopStudioTimer();
            timerBtn.textContent = '계속 진행';
            timerBtn.classList.remove('btn-sage');
            timerBtn.classList.add('btn-copper');
          } else {
            stopStudioTimer();
            isRunning = true;
            timerBtn.textContent = '일시 정지';
            timerBtn.classList.remove('btn-copper');
            timerBtn.classList.add('btn-sage');
            if (timerResetBtn) timerResetBtn.style.display = 'inline-block';

            studioTimerInterval = setInterval(() => {
              remain--;
              updateDisplay();
              if (remain <= 0) {
                stopStudioTimer();
                timerBtn.textContent = '다시 시작';
                timerBtn.classList.remove('btn-sage');
                timerBtn.classList.add('btn-copper');
                if (timerResetBtn) timerResetBtn.style.display = 'none';

                // 단발 싱잉볼 차임 (무한 반복 방지)
                if (window.soundscapeEngine && typeof window.soundscapeEngine.playChime === 'function') {
                  window.soundscapeEngine.playChime();
                }
              }
            }, 1000);
          }
        });
      }

      if (timerResetBtn) {
        timerResetBtn.addEventListener('click', () => {
          stopStudioTimer();
          remain = totalDuration;
          updateDisplay();
          timerBtn.textContent = '카운트다운 시작';
          timerBtn.classList.remove('btn-sage');
          timerBtn.classList.add('btn-copper');
          timerResetBtn.style.display = 'none';
        });
      }
    }

    const sudSlider = document.getElementById('input-sud-meter');
    const sudValText = document.getElementById('sud-val-text');
    if (sudSlider && sudValText) {
      sudSlider.addEventListener('input', () => {
        sudValText.textContent = `${sudSlider.value} / 10`;
        practiceAnswers['sud_score'] = sudSlider.value;
      });
    }
  }

  function saveCurrentStepInputs() {
    if (!activePractice) return;
    const step = activePractice.steps[activeStepIdx];

    if (step.type === 'text_input') {
      step.fields.forEach(f => {
        const inp = document.getElementById(`input-${f.id}`);
        if (inp) practiceAnswers[f.id] = inp.value.trim();
      });
    } else if (step.type === 'textarea') {
      const inp = document.getElementById(`input-${step.field.id}`);
      if (inp) practiceAnswers[step.field.id] = inp.value.trim();
    } else if (step.type === 'reframer') {
      const inpA = document.getElementById(`input-${step.fieldA.id}`);
      const inpB = document.getElementById(`input-${step.fieldB.id}`);
      if (inpA) practiceAnswers[step.fieldA.id] = inpA.value.trim();
      if (inpB) practiceAnswers[step.fieldB.id] = inpB.value.trim();
    } else if (step.type === 'checklist') {
      step.options.forEach((opt, idx) => {
        const inp = document.getElementById(`chk_${idx}`);
        if (inp) practiceAnswers[`chk_${idx}`] = inp.checked;
      });
    }

    const sudSlider = document.getElementById('input-sud-meter');
    if (sudSlider) {
      practiceAnswers['sud_score'] = sudSlider.value;
    }
  }

  if (studioPrevStep) {
    studioPrevStep.addEventListener('click', () => {
      if (studioTimerInterval) {
        clearInterval(studioTimerInterval);
        studioTimerInterval = null;
      }
      saveCurrentStepInputs();
      if (activeStepIdx > 0) {
        activeStepIdx--;
        renderCurrentStep();
      }
    });
  }

  if (studioNextStep) {
    studioNextStep.addEventListener('click', () => {
      if (studioTimerInterval) {
        clearInterval(studioTimerInterval);
        studioTimerInterval = null;
      }
      saveCurrentStepInputs();
      if (activeStepIdx < activePractice.steps.length - 1) {
        activeStepIdx++;
        renderCurrentStep();
      } else {
        // 실천 완료! 워크북에 저장
        savePracticeToJournal();
        closePracticeStudio();
        alert(`'${activePractice.title}' 실천을 성공적으로 마쳤습니다!\n내 워크북 기록장에 정성스럽게 보관되었습니다.`);
      }
    });
  }

  // =========================================================
  // 📓 Systematic Clinical ACT Workbook Engine (나의 실천 워크북)
  // =========================================================
  const workbookContainer = document.getElementById('workbook-entries-container');
  const journalModalContainer = document.getElementById('journal-entries-container');
  const modalJournal = document.getElementById('modal-journal');
  const btnOpenJournal = document.getElementById('btn-open-journal');
  const btnCloseJournal = document.getElementById('btn-close-journal');
  const btnDoneJournal = document.getElementById('btn-done-journal');
  const btnExportJournal = document.getElementById('btn-export-journal');
  const btnClearJournal = document.getElementById('btn-clear-journal');
  const wbBtnExport = document.getElementById('wb-btn-export');
  const wbBtnClear = document.getElementById('wb-btn-clear');
  const wbSearchInput = document.getElementById('wb-search-input');
  const wbFilterPills = document.querySelectorAll('.wb-pill');

  // The parent sync coordinator applies PC/mobile journal updates to this origin.
  window.addEventListener('storage', (event) => {
    if (event.key === 'calm_journal_records') renderWorkbook();
  });

  function savePracticeToJournal() {
    if (!activePractice) return;
    const journal = JSON.parse(localStorage.getItem('calm_journal_records') || '[]');
    const record = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      exerciseIdx: activePractice.globalIndex,
      chapter: activePractice.chapter,
      chapterTitle: activePractice.chapterTitle || '',
      title: activePractice.title,
      subtitle: activePractice.subtitle || '',
      page: activePractice.page || 18,
      icon: activePractice.icon || '🎯',
      tag: activePractice.tag || '마음 연습',
      affirmation: activePractice.affirmation || '',
      clinicalTip: activePractice.clinicalTip || '',
      answers: { ...practiceAnswers },
      sudScore: practiceAnswers['sud_score'] || null
    };
    journal.unshift(record);
    localStorage.setItem('calm_journal_records', JSON.stringify(journal));
    renderWorkbook();
  }

  // 체계적인 질의응답 (Q/A) 서식화 함수
  function formatRecordQA(record) {
    const ex = window.PRACTICE_EXERCISES?.find(e => e.globalIndex === record.exerciseIdx);
    const answers = record.answers || {};
    let html = '';

    if (ex && ex.steps && ex.steps.length > 0) {
      ex.steps.forEach(step => {
        if (step.type === 'text_input' && step.fields) {
          const filledFields = step.fields.filter(f => answers[f.id]);
          if (filledFields.length > 0) {
            filledFields.forEach(f => {
              html += `
                <div class="wb-qa-item">
                  <div class="wb-qa-q">${escapeHtml(f.label)}</div>
                  <div class="wb-qa-a" style="white-space: pre-wrap;">${escapeHtml(answers[f.id])}</div>
                </div>
              `;
            });
          }
        } else if (step.type === 'textarea' && step.field) {
          const val = answers[step.field.id];
          if (val) {
            html += `
              <div class="wb-qa-item">
                <div class="wb-qa-q">${escapeHtml(step.field.label || step.title)}</div>
                <div class="wb-qa-a" style="white-space: pre-wrap;">${escapeHtml(val)}</div>
              </div>
            `;
          }
        } else if (step.type === 'reframer' && step.fieldA && step.fieldB) {
          const valA = answers[step.fieldA.id];
          const valB = answers[step.fieldB.id];
          if (valA || valB) {
            html += `
              <div class="wb-reframer-grid">
                <div class="wb-rf-card neg">
                  <div class="wb-rf-lbl">❌ ${escapeHtml(step.fieldA.label)}</div>
                  <div>${escapeHtml(valA || '(작성 내용 없음)')}</div>
                </div>
                <div class="wb-rf-card pos">
                  <div class="wb-rf-lbl">🌿 ${escapeHtml(step.fieldB.label)}</div>
                  <div>${escapeHtml(valB || '(작성 내용 없음)')}</div>
                </div>
              </div>
            `;
          }
        } else if (step.type === 'checklist' && step.options) {
          const checked = [];
          step.options.forEach((opt, idx) => {
            if (answers[`chk_${idx}`]) checked.push(opt);
          });
          if (checked.length > 0) {
            html += `
              <div class="wb-qa-item">
                <div class="wb-qa-q">실천 체크 완료 항목</div>
                <ul class="wb-checklist-ul">
                  ${checked.map(c => `<li class="wb-checklist-li"><span>✅</span> <span>${escapeHtml(c)}</span></li>`).join('')}
                </ul>
              </div>
            `;
          }
        }
      });
    }

    // 대체 서식화 (처방전 또는 커스텀 입력)
    if (!html) {
      const entries = Object.entries(answers).filter(([k]) => k !== 'sud_score');
      if (entries.length > 0) {
        entries.forEach(([k, v]) => {
          html += `
            <div class="wb-qa-item">
              <div class="wb-qa-q">• ${escapeHtml(k)}</div>
              <div class="wb-qa-a">${escapeHtml(String(v))}</div>
            </div>
          `;
        });
      } else {
        html = `<div class="wb-qa-a" style="color:var(--text-muted); font-style:italic;">모든 단계 및 명상 리추얼 완주 완료</div>`;
      }
    }

    return html;
  }

  function renderWorkbook(filter = currentWbFilter, searchQuery = currentWbSearch) {
    currentWbFilter = filter;
    currentWbSearch = searchQuery;

    const records = JSON.parse(localStorage.getItem('calm_journal_records') || '[]');

    // 통계 계산
    const totalEntries = records.length;
    const uniqueIndices = new Set(records.filter(r => r.exerciseIdx && !String(r.title).includes('처방전')).map(r => r.exerciseIdx));
    const completedCount = uniqueIndices.size;
    const totalExercisesCount = (window.PRACTICE_EXERCISES && window.PRACTICE_EXERCISES.length) || 90;
    const completionRate = Math.min(100, Math.round((completedCount / totalExercisesCount) * 100));

    // 챕터별(1~8장) 완주 개수 계산
    const exercisesMap = {};
    if (window.PRACTICE_EXERCISES && window.PRACTICE_EXERCISES.length > 0) {
      window.PRACTICE_EXERCISES.forEach(ex => {
        exercisesMap[ex.globalIndex] = parseInt(ex.chapter, 10) || 1;
      });
    }

    let ch1Count = 0, ch2Count = 0, ch3Count = 0, ch4Count = 0, ch5Count = 0, ch6Count = 0, ch7Count = 0, ch8Count = 0;
    uniqueIndices.forEach(idx => {
      const ch = exercisesMap[idx];
      if (ch === 1) ch1Count++;
      else if (ch === 2) ch2Count++;
      else if (ch === 3) ch3Count++;
      else if (ch === 4) ch4Count++;
      else if (ch === 5) ch5Count++;
      else if (ch === 6) ch6Count++;
      else if (ch === 7) ch7Count++;
      else if (ch === 8) ch8Count++;
    });

    // 동그란 원형 프로그레스 차트 갱신
    const circleRing = document.getElementById('wb-circular-ring');
    const circlePercent = document.getElementById('wb-circle-rate-percent');
    const circleCount = document.getElementById('wb-circle-rate-count');
    const circleHeading = document.getElementById('wb-circle-main-heading');
    const circleStatus = document.getElementById('wb-circle-status-badge');
    const elCircleCh1 = document.getElementById('wb-circle-ch1');
    const elCircleCh2 = document.getElementById('wb-circle-ch2');
    const elCircleCh3 = document.getElementById('wb-circle-ch3');

    if (circleRing) {
      const circumference = 351.86;
      const offset = circumference - (completionRate / 100) * circumference;
      circleRing.style.strokeDashoffset = offset.toFixed(2);
    }
    if (circlePercent) circlePercent.textContent = `${completionRate}%`;
    if (circleCount) circleCount.textContent = `${completedCount} / ${totalExercisesCount}개`;
    if (circleHeading) {
      circleHeading.textContent = `90가지 개운·마음 실천 중 ${completedCount}개 완주 (${completionRate}%)`;
    }
    if (circleStatus) {
      if (completedCount === 0) {
        circleStatus.textContent = '첫 개운을 시작해보세요 🌱';
        circleStatus.style.background = '#fef3e2';
        circleStatus.style.color = '#b87333';
      } else if (completionRate < 25) {
        circleStatus.textContent = '막힌 운기를 틔우는 중 🌿';
        circleStatus.style.background = '#eef6ee';
        circleStatus.style.color = '#2e7d32';
      } else if (completionRate < 50) {
        circleStatus.textContent = '행운의 물길이 열리고 있습니다 🌊';
        circleStatus.style.background = '#e3f2fd';
        circleStatus.style.color = '#1565c0';
      } else if (completionRate < 75) {
        circleStatus.textContent = '맑은 대운의 파동이 깊어졌습니다 🌟';
        circleStatus.style.background = '#f3e5f5';
        circleStatus.style.color = '#7b1fa2';
      } else if (completionRate < 100) {
        circleStatus.textContent = '개운 마스터가 눈앞에 다가왔습니다! ✨';
        circleStatus.style.background = '#fff8e1';
        circleStatus.style.color = '#f57f17';
      } else {
        circleStatus.textContent = '🏆 90가지 개운·마음 실천 마스터 달성!';
        circleStatus.style.background = 'linear-gradient(135deg, #ffd700, #ffb300)';
        circleStatus.style.color = '#000000';
      }
    }

    const anxietyTotal = 40;
    const hspTotal = 50;
    const anxietyCount = ch1Count + ch2Count + ch3Count;
    const hspCount = ch4Count + ch5Count + ch6Count + ch7Count + ch8Count;

    const elCircleAnxiety = document.getElementById('wb-circle-ch-anxiety');
    const elCircleHsp = document.getElementById('wb-circle-ch-hsp');
    if (elCircleAnxiety) elCircleAnxiety.textContent = `${anxietyCount} / ${anxietyTotal}개 (${Math.round((anxietyCount / anxietyTotal) * 100)}%)`;
    if (elCircleHsp) elCircleHsp.textContent = `${hspCount} / ${hspTotal}개 (${Math.round((hspCount / hspTotal) * 100)}%)`;

    // 필터별 개수 카운팅
    const cntAll = totalEntries;
    const cntCh1 = records.filter(r => String(r.chapter) === '1').length;
    const cntCh2 = records.filter(r => String(r.chapter) === '2').length;
    const cntCh3 = records.filter(r => String(r.chapter) === '3').length;
    const cntCh4 = records.filter(r => String(r.chapter) === '4').length;
    const cntCh5 = records.filter(r => String(r.chapter) === '5').length;
    const cntRx = records.filter(r => String(r.title).includes('처방전') || r.isRx).length;

    const elCntAll = document.getElementById('wb-cnt-all');
    const elCntCh1 = document.getElementById('wb-cnt-ch1');
    const elCntCh2 = document.getElementById('wb-cnt-ch2');
    const elCntCh3 = document.getElementById('wb-cnt-ch3');
    const elCntCh4 = document.getElementById('wb-cnt-ch4');
    const elCntCh5 = document.getElementById('wb-cnt-ch5');
    const elCntRx = document.getElementById('wb-cnt-rx');
    if (elCntAll) elCntAll.textContent = cntAll;
    if (elCntCh1) elCntCh1.textContent = cntCh1;
    if (elCntCh2) elCntCh2.textContent = cntCh2;
    if (elCntCh3) elCntCh3.textContent = cntCh3;
    if (elCntCh4) elCntCh4.textContent = cntCh4;
    if (elCntCh5) elCntCh5.textContent = cntCh5;
    if (elCntRx) elCntRx.textContent = cntRx;

    // SUD 평균 점수 계산
    const sudScores = records
      .map(r => r.sudScore || (r.answers ? r.answers['sud_score'] : null))
      .filter(s => s !== null && s !== undefined && !isNaN(Number(s)))
      .map(Number);

    const elStatRate = document.getElementById('wb-stat-rate');
    const elStatBar = document.getElementById('wb-stat-bar');
    const elStatCount = document.getElementById('wb-stat-count');
    const elStatSud = document.getElementById('wb-stat-sud');
    const elStatSudDesc = document.getElementById('wb-stat-sud-desc');
    const elStatLast = document.getElementById('wb-stat-last');
    const elStatLastCh = document.getElementById('wb-stat-last-chapter');

    if (elStatRate) elStatRate.textContent = `${uniqueIndices.size} / ${totalExercisesCount}개 (${completionRate}%)`;
    if (elStatBar) elStatBar.style.width = `${completionRate}%`;
    if (elStatCount) elStatCount.textContent = `${totalEntries}회`;

    if (sudScores.length > 0) {
      const avgSud = (sudScores.reduce((a, b) => a + b, 0) / sudScores.length).toFixed(1);
      if (elStatSud) elStatSud.textContent = `${avgSud} / 10점`;
      if (elStatSudDesc) {
        if (avgSud <= 3) elStatSudDesc.textContent = '🌟 매우 편안하고 안정된 심리 상태';
        else if (avgSud <= 6) elStatSudDesc.textContent = '🌿 보통 수준의 감정 파도 완화 중';
        else elStatSudDesc.textContent = '🌊 감정이 다소 높은 상태, 호흡 권장';
      }
    } else {
      if (elStatSud) elStatSud.textContent = `- / 10점`;
      if (elStatSudDesc) elStatSudDesc.textContent = '실천 후 SUD 척도를 기록해보세요';
    }

    if (records.length > 0) {
      if (elStatLast) elStatLast.textContent = records[0].title;
      if (elStatLastCh) elStatLastCh.textContent = `${records[0].date} (${records[0].chapter || 1}장)`;
    } else {
      if (elStatLast) elStatLast.textContent = '-';
      if (elStatLastCh) elStatLastCh.textContent = '오늘의 실천을 시작해보세요';
    }

    // 필터링 적용
    let filtered = records;
    if (filter === 'rx') {
      filtered = filtered.filter(r => String(r.title).includes('처방전') || r.isRx);
    } else if (filter === '1' || filter === '2' || filter === '3') {
      filtered = filtered.filter(r => String(r.chapter) === filter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(r => {
        const titleMatch = (r.title || '').toLowerCase().includes(q);
        const dateMatch = (r.date || '').toLowerCase().includes(q);
        const ansMatch = JSON.stringify(r.answers || {}).toLowerCase().includes(q);
        const affMatch = (r.affirmation || '').toLowerCase().includes(q);
        return titleMatch || dateMatch || ansMatch || affMatch;
      });
    }

    // HTML 생성
    let cardsHtml = '';
    if (filtered.length === 0) {
      if (records.length === 0) {
        cardsHtml = `
          <div class="wb-empty-card">
            <div class="wb-empty-icon">📖</div>
            <div class="wb-empty-title">아직 기록된 소원 확언 & 운기 노트가 없습니다</div>
            <p class="wb-empty-desc">
              막힌 운은 작은 실천과 확언을 기록할 때 비로소 트이기 시작합니다.<br>
              90가지 개운·마음 실천 연습이나 3분 액운 정화에서 오늘의 첫 개운을 시작해 보세요.
            </p>
            <div class="wb-empty-btns">
              <button class="btn-copper" onclick="switchTab('tab-exercises')">🎯 90가지 개운·마음 실천 연습 가기</button>
              <button class="btn-sage" onclick="launchRandomPractice()">🎲 오늘의 랜덤 개운법 뽑기</button>
            </div>
          </div>
        `;
      } else {
        cardsHtml = `
          <div class="wb-empty-card">
            <div class="wb-empty-icon">🔍</div>
            <div class="wb-empty-title">일치하는 운기 기록이 없습니다</div>
            <p class="wb-empty-desc">선택하신 필터 조건이나 검색어와 일치하는 기록이 없습니다.</p>
            <div class="wb-empty-btns">
              <button class="btn-copper" onclick="window.resetWorkbookFilter()">전체 기록 보기</button>
            </div>
          </div>
        `;
      }
    } else {
      cardsHtml = filtered.map(r => {
        const isRx = String(r.title).includes('처방전') || String(r.title).includes('개운부적') || r.isRx;
        const typeBadge = isRx ? '🔮 3분 개운부적' : '🎯 90가지 실천 연습';
        const typeClass = isRx ? 'wb-badge-rx' : 'wb-badge-ch';
        const sud = r.sudScore || (r.answers ? r.answers['sud_score'] : null);
        let sudHtml = '';

        if (sud !== null && sud !== undefined && !isNaN(Number(sud))) {
          const sVal = Number(sud);
          let sColor = '#2e7d32';
          let sText = '맑은 운기';
          if (sVal > 3 && sVal <= 6) { sColor = '#d97706'; sText = '탁기 정화 중'; }
          else if (sVal > 6) { sColor = '#dc2626'; sText = '집중 정화 권장'; }

          sudHtml = `
            <div class="wb-sud-banner">
              <div class="wb-sud-row">
                <span class="wb-sud-lbl">🌱 개운 실천 후 잔여 탁기(액운) 지수:</span>
                <span class="wb-sud-num" style="color: ${sColor};">${sVal} / 10점 (${sText})</span>
              </div>
              <div class="wb-sud-track">
                <div class="wb-sud-fill" style="width: ${sVal * 10}%; background: ${sColor};"></div>
              </div>
            </div>
          `;
        }

        const affirmationHtml = r.affirmation ? `
          <div class="wb-affirmation-card">
            <div class="wb-aff-label">🌟 가슴에 새긴 오늘의 소원 & 개운 확언</div>
            <div class="wb-aff-text">"${escapeHtml(r.affirmation)}"</div>
          </div>
        ` : '';

        const qaHtml = formatRecordQA(r);

        return `
          <div class="wb-card">
            <div class="wb-card-topbar">
              <div class="wb-badges-group">
                <span class="wb-badge-pill ${typeClass}">${typeBadge}</span>
                <span class="wb-badge-pill wb-badge-ch">${r.chapter || 1}장 · ${r.page || 22}P</span>
                <span class="wb-badge-date">📅 ${r.date}</span>
              </div>
            </div>

            <div class="wb-card-title-row">
              <div class="wb-card-icon">${r.icon || (isRx ? '🔮' : '🎯')}</div>
              <div>
                <h3 class="wb-card-title">${escapeHtml(r.title)}</h3>
                <div class="wb-card-page">《KEY : 막힌 운을 여는 90가지 개운·마음 실천 성전》 ${r.page || 18}쪽 기록</div>
              </div>
            </div>

            ${affirmationHtml}
            ${sudHtml}

            <div class="wb-qa-box">
              <div class="wb-qa-header-title">📝 나의 개운 실천 및 소원 기록</div>
              ${qaHtml}
            </div>

            <div class="wb-card-footer">
              <button class="wb-btn-action redo" onclick="window.startPractice(${r.exerciseIdx || 1})">
                <span>🎯 다시 실천하기</span>
              </button>
              <button class="wb-btn-action consult" onclick="window.askDrZAboutJournal(${r.id})">
                <span>💬 루시에게 질문하기</span>
              </button>
              <button class="wb-btn-action del" onclick="window.deleteJournalRecord(${r.id})">
                <span>🗑️ 삭제</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (workbookContainer) workbookContainer.innerHTML = cardsHtml;
    if (journalModalContainer) journalModalContainer.innerHTML = cardsHtml;
  }

  window.resetWorkbookFilter = function() {
    currentWbFilter = 'all';
    currentWbSearch = '';
    if (wbSearchInput) wbSearchInput.value = '';
    wbFilterPills.forEach(p => {
      if (p.dataset.wbFilter === 'all') p.classList.add('active');
      else p.classList.remove('active');
    });
    renderWorkbook();
  };

  // 루시에게 워크북 실천 기록으로 질문하기
  window.askDrZAboutJournal = function(recordId) {
    const records = JSON.parse(localStorage.getItem('calm_journal_records') || '[]');
    const r = records.find(item => item.id === recordId);
    if (!r) return;

    let ansSummary = '';
    if (r.answers) {
      ansSummary = Object.entries(r.answers)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }

    const text = `Key 개운 성전에서 '${r.title}' 리추얼을 실천하고 운기 노트에 다음과 같이 기록했어:\n\n[개운 실천 내용: ${ansSummary}]\n\n이 기록을 바탕으로 내 운의 흐름이 어떻게 맑아지고 있는지 루시의 다정한 통찰과 개운 조언을 들려줘.`;
    if (typeof askLucyWithText === 'function') {
      askLucyWithText(text);
    } else {
      try {
        sessionStorage.setItem('lucy_injected_auto_send', text);
        sessionStorage.setItem('lucy_injected_input_draft', text);
      } catch (_) {}
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'NAVIGATE_LUCKEY', path: '/chat', text: text }, '*');
      } else {
        window.location.href = '/chat';
      }
    }
  };

  // 개별 기록 삭제
  window.deleteJournalRecord = function(recordId) {
    if (!confirm('이 실천 기록을 정말 삭제하시겠습니까?')) return;
    let records = JSON.parse(localStorage.getItem('calm_journal_records') || '[]');
    records = records.filter(r => r.id !== recordId);
    localStorage.setItem('calm_journal_records', JSON.stringify(records));
    renderWorkbook();
  };

  // 필터 탭 클릭 이벤트 바인딩
  wbFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      wbFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderWorkbook(pill.dataset.wbFilter, currentWbSearch);
    });
  });

  // 검색 인풋 이벤트 바인딩
  if (wbSearchInput) {
    let searchDebounce = null;
    wbSearchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        renderWorkbook(currentWbFilter, e.target.value);
      }, 150);
    });
  }

  // 텍스트 내보내기 공통 함수
  function exportWorkbookRecords() {
    const records = JSON.parse(localStorage.getItem('calm_journal_records') || '[]');
    if (records.length === 0) {
      alert('내보낼 실천 기록이 없습니다.');
      return;
    }

    let exportText = `# 📓 KEY 《운을 여는 40가지 개운(開運) 리추얼》 나의 소원 확언 & 운기 노트\n`;
    exportText += `> 동서양 7대 운명학 연계 디지털 개운 비전록\n\n`;
    exportText += `- 총 실천 횟수: ${records.length}회\n`;
    exportText += `- 내보낸 일시: ${new Date().toLocaleString('ko-KR')}\n\n`;
    exportText += `---\n\n`;

    records.forEach((r, idx) => {
      exportText += `### [${idx + 1}] ${r.title} (도서 ${r.page || 18}쪽)\n`;
      exportText += `- **기록 일시**: ${r.date}\n`;
      exportText += `- **챕터**: ${r.chapter || 1}장 · ${r.tag || '마음 연습'}\n`;
      if (r.affirmation) exportText += `- **치유 확언**: "${r.affirmation}"\n`;
      if (r.sudScore) exportText += `- **SUD 불편도**: ${r.sudScore} / 10점\n`;
      exportText += `\n**[실천 및 작성 내용]**\n`;
      Object.entries(r.answers || {}).forEach(([k, v]) => {
        if (k !== 'sud_score') {
          exportText += `- **${k}**: ${v}\n`;
        }
      });
      exportText += `\n---\n\n`;
    });

    const blob = new Blob([exportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CALM_마음실천워크북_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  }

  // 전체 삭제 공통 함수
  function clearWorkbookRecords() {
    if (confirm('저장된 모든 실천 워크북 기록을 영구히 삭제하시겠습니까?\n삭제된 기록은 복구할 수 없습니다.')) {
      localStorage.removeItem('calm_journal_records');
      renderWorkbook();
    }
  }

  if (wbBtnExport) wbBtnExport.addEventListener('click', exportWorkbookRecords);
  if (btnExportJournal) btnExportJournal.addEventListener('click', exportWorkbookRecords);
  if (wbBtnClear) wbBtnClear.addEventListener('click', clearWorkbookRecords);
  if (btnClearJournal) btnClearJournal.addEventListener('click', clearWorkbookRecords);

  function openJournalModal() {
    renderWorkbook();
    modalJournal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeJournalModal() {
    modalJournal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (btnOpenJournal) {
    btnOpenJournal.addEventListener('click', () => {
      switchTab('tab-workbook');
    });
  }
  if (btnCloseJournal) btnCloseJournal.addEventListener('click', closeJournalModal);
  if (btnDoneJournal) btnDoneJournal.addEventListener('click', closeJournalModal);

  // =========================================================
  // 💊 3-Minute Emergency Prescription Studio Engine
  // =========================================================
  const modalPrescription = document.getElementById('modal-prescription');
  const btnClosePrescription = document.getElementById('btn-close-prescription');
  const rxTimerDigits = document.getElementById('rx-timer-digits');
  const rxChip1 = document.getElementById('rx-chip-1');
  const rxChip2 = document.getElementById('rx-chip-2');
  const rxChip3 = document.getElementById('rx-chip-3');

  const rxStage1 = document.getElementById('rx-stage-1');
  const rxStage2 = document.getElementById('rx-stage-2');
  const rxStage3 = document.getElementById('rx-stage-3');

  const rxBreathVisual = document.getElementById('rx-breath-visual');
  const rxBreathInstruction = document.getElementById('rx-breath-instruction');
  const rxBreathSec = document.getElementById('rx-breath-sec');

  const rxWorryText = document.getElementById('rx-worry-text');
  const rxWorryInputArea = document.getElementById('rx-worry-input-area');
  const btnDissolveWorry = document.getElementById('btn-dissolve-worry');
  const rxDissolvedResult = document.getElementById('rx-dissolved-result');

  const rxReceiptDate = document.getElementById('rx-receipt-date');
  const rxReceiptWorryLabel = document.getElementById('rx-receipt-worry-label');
  const rxRecBadge = document.getElementById('rx-rec-badge');
  const rxRecTitle = document.getElementById('rx-rec-title');
  const rxRecDesc = document.getElementById('rx-rec-desc');
  const rxRecQuote = document.getElementById('rx-rec-quote');

  const btnRxSaveJournal = document.getElementById('btn-rx-save-journal');
  const btnRxPracticeNow = document.getElementById('btn-rx-practice-now');
  const btnRxPrint = document.getElementById('btn-rx-print');
  const btnRxToggleSound = document.getElementById('btn-rx-toggle-sound');
  const btnRxPrev = document.getElementById('btn-rx-prev');
  const btnRxNext = document.getElementById('btn-rx-next');

  let rxCurrentStage = 1; // 1: 이완, 2: 걱정 털기, 3: 처방전
  let rxTimerInterval = null;
  let rxBreathInterval = null;
  let rxRemainingSeconds = 180;
  let rxPrescribedEx = null;
  let rxUserWorry = '';
  let isRxSoundOn = false;

  const drZQuotes = [
    "괜찮지 않아도 괜찮습니다. 생각은 통제할 수 없지만, 그 생각을 대하는 나의 태도는 선택할 수 있습니다.",
    "감정은 바다의 파도와 같습니다. 맞서 싸우면 휩쓸리지만, 가만히 바라보면 스스로 정점을 찍고 가라앉습니다.",
    "지금 머무르는 불안은 단지 뇌가 나를 보호하려 보낸 과열된 경보일 뿐, 진실이 아닙니다.",
    "호흡에 닻을 내리세요. 세상의 어떤 소란도 당신 내면의 본래 평화를 빼앗을 수 없습니다."
  ];

  window.openPrescriptionStudio = function() {
    if (!modalPrescription) return;

    // 랜덤 추천 연습 1개 배정
    const totalAvailable = (window.PRACTICE_EXERCISES && window.PRACTICE_EXERCISES.length) || 90;
    const randomIdx = Math.floor(Math.random() * totalAvailable) + 1;
    rxPrescribedEx = window.PRACTICE_EXERCISES.find(e => e.globalIndex === randomIdx) || window.PRACTICE_EXERCISES[0];
    rxUserWorry = '';

    // 상태 초기화
    rxRemainingSeconds = 180;
    rxCurrentStage = 1;
    updateRxStageUI(1);

    if (rxWorryText) rxWorryText.value = '';
    if (rxWorryInputArea) rxWorryInputArea.classList.remove('hidden');
    if (rxDissolvedResult) rxDissolvedResult.classList.add('hidden');

    // 모달 표시
    modalPrescription.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // 3분 메인 타이머 가동
    startRxTimer();

    // 1단계 호흡 가이드 가동
    startRxBreathing();
  };

  function closePrescriptionStudio() {
    if (rxTimerInterval) {
      clearInterval(rxTimerInterval);
      rxTimerInterval = null;
    }
    if (rxBreathInterval) {
      clearInterval(rxBreathInterval);
      rxBreathInterval = null;
    }
    if (window.soundscapeEngine && (window.soundscapeEngine.currentSound === 'ocean' || isRxSoundOn)) {
      window.soundscapeEngine.stop();
      isRxSoundOn = false;
      if (btnRxToggleSound) btnRxToggleSound.innerHTML = '<span>🔔 싱잉볼 소리 켜기</span>';
    }
    if (modalPrescription) modalPrescription.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (btnClosePrescription) btnClosePrescription.addEventListener('click', closePrescriptionStudio);

  function startRxTimer() {
    if (rxTimerInterval) {
      clearInterval(rxTimerInterval);
      rxTimerInterval = null;
    }

    updateTimerDisplay();

    rxTimerInterval = setInterval(() => {
      rxRemainingSeconds--;

      if (rxRemainingSeconds <= 0) {
        clearInterval(rxTimerInterval);
        rxTimerInterval = null;
        rxRemainingSeconds = 0;
        updateTimerDisplay();
        setRxStage(3); // 3분 종료 시 처방전 화면으로 이동
        if (window.soundscapeEngine && typeof window.soundscapeEngine.playChime === 'function') {
          window.soundscapeEngine.playChime();
        }
        return;
      }

      updateTimerDisplay();

      // 시간 경과에 따른 자동 스테이지 전환 가이드 (선택적)
      if (rxRemainingSeconds === 135 && rxCurrentStage === 1) {
        setRxStage(2);
      } else if (rxRemainingSeconds === 60 && rxCurrentStage === 2) {
        setRxStage(3);
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const min = Math.floor(rxRemainingSeconds / 60);
    const sec = rxRemainingSeconds % 60;
    if (rxTimerDigits) {
      rxTimerDigits.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }
  }

  function setRxStage(stageNum) {
    rxCurrentStage = stageNum;
    updateRxStageUI(stageNum);

    if (stageNum === 1) {
      startRxBreathing();
    } else {
      if (rxBreathInterval) clearInterval(rxBreathInterval);
    }

    if (stageNum === 3) {
      renderRxReceipt();
    }
  }

  function updateRxStageUI(stageNum) {
    // 칩 업데이트
    [rxChip1, rxChip2, rxChip3].forEach((chip, idx) => {
      if (!chip) return;
      chip.classList.remove('active', 'completed');
      if (idx + 1 === stageNum) chip.classList.add('active');
      else if (idx + 1 < stageNum) chip.classList.add('completed');
    });

    // 뷰 전환
    if (rxStage1) rxStage1.classList.toggle('hidden', stageNum !== 1);
    if (rxStage2) rxStage2.classList.toggle('hidden', stageNum !== 2);
    if (rxStage3) rxStage3.classList.toggle('hidden', stageNum !== 3);

    // 하단 버튼
    if (btnRxPrev) btnRxPrev.classList.toggle('hidden', stageNum === 1);
    if (btnRxNext) {
      if (stageNum === 3) {
        btnRxNext.textContent = '처방 완료 및 닫기';
      } else {
        btnRxNext.textContent = '다음 단계';
      }
    }
  }

  // 1단계 4-6 호흡 엔진
  function startRxBreathing() {
    if (rxBreathInterval) clearInterval(rxBreathInterval);
    let phase = 'inhale'; // inhale: 4s, exhale: 6s
    let secLeft = 4;

    if (rxBreathVisual) {
      rxBreathVisual.className = 'rx-breath-circle inhale';
      rxBreathInstruction.textContent = '들이쉬기 (4초)';
      rxBreathSec.textContent = '4';
    }

    rxBreathInterval = setInterval(() => {
      secLeft--;
      if (secLeft <= 0) {
        if (phase === 'inhale') {
          phase = 'exhale';
          secLeft = 6;
          if (rxBreathVisual) {
            rxBreathVisual.className = 'rx-breath-circle exhale';
            rxBreathInstruction.textContent = '내쉬기 (6초)';
          }
        } else {
          phase = 'inhale';
          secLeft = 4;
          if (rxBreathVisual) {
            rxBreathVisual.className = 'rx-breath-circle inhale';
            rxBreathInstruction.textContent = '들이쉬기 (4초)';
          }
        }
      }
      if (rxBreathSec) rxBreathSec.textContent = secLeft;
    }, 1000);
  }

  // 2단계 걱정 파도 분해
  if (btnDissolveWorry) {
    btnDissolveWorry.addEventListener('click', () => {
      const text = (rxWorryText ? rxWorryText.value.trim() : '');
      rxUserWorry = text || '알 수 없는 불안과 긴장';

      // 파도 분해 사운드 및 전환
      window.soundscapeEngine.play('ocean');

      if (rxWorryInputArea) rxWorryInputArea.classList.add('hidden');
      if (rxDissolvedResult) rxDissolvedResult.classList.remove('hidden');

      setTimeout(() => {
        if (window.soundscapeEngine && window.soundscapeEngine.currentSound === 'ocean') {
          window.soundscapeEngine.stop();
        }
        setRxStage(3);
        if (window.soundscapeEngine && typeof window.soundscapeEngine.playChime === 'function') {
          window.soundscapeEngine.playChime();
        }
      }, 2500);
    });
  }

  // 3단계 처방전 카드 렌더링
  function renderRxReceipt() {
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    if (rxReceiptDate) rxReceiptDate.textContent = today;
    if (rxReceiptWorryLabel) rxReceiptWorryLabel.textContent = rxUserWorry || '현재의 심리적 압박 및 불안 완화';

    if (rxPrescribedEx) {
      if (rxRecBadge) rxRecBadge.textContent = `${rxPrescribedEx.chapter || 1}장 · ${rxPrescribedEx.tag || '마음 연습'} (P.${rxPrescribedEx.page || 18})`;
      if (rxRecTitle) rxRecTitle.textContent = `연습 ${rxPrescribedEx.index || 1}. ${rxPrescribedEx.title || ''}`;
      const subPrefix = rxPrescribedEx.subtitle ? `${rxPrescribedEx.subtitle} - ` : '';
      const exDesc = rxPrescribedEx.description || rxPrescribedEx.purpose || '마음의 평온을 되찾는 실천 연습입니다.';
      if (rxRecDesc) rxRecDesc.textContent = `${subPrefix}${exDesc}`;
    }

    if (rxRecQuote) {
      const randQuote = drZQuotes[Math.floor(Math.random() * drZQuotes.length)];
      rxRecQuote.textContent = randQuote;
    }
  }

  // 처방전 워크북 보관
  if (btnRxSaveJournal) {
    btnRxSaveJournal.addEventListener('click', () => {
      if (!rxPrescribedEx) return;

      const journal = JSON.parse(localStorage.getItem('calm_journal_records') || '[]');
      const record = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        exerciseIdx: rxPrescribedEx.globalIndex,
        chapter: rxPrescribedEx.chapter,
        chapterTitle: '3분 응급 이완 프로토콜',
        title: `[💊 3분 처방전] ${rxPrescribedEx.title}`,
        subtitle: rxPrescribedEx.subtitle || '',
        page: rxPrescribedEx.page || 18,
        icon: '💊',
        tag: '3분 처방',
        affirmation: '불안에 맞서지 않고 바다의 파도처럼 가만히 지나가게 둡니다.',
        isRx: true,
        answers: {
          "흘려보낸 걱정": rxUserWorry || "알 수 없는 불안과 긴장",
          "처방 실천": `연습 ${rxPrescribedEx.index}. ${rxPrescribedEx.title} (${rxPrescribedEx.page}쪽)`,
          "마음 상태": "3분 이완 프로토콜 완료"
        },
        sudScore: null
      };
      journal.unshift(record);
      localStorage.setItem('calm_journal_records', JSON.stringify(journal));
      if (typeof renderWorkbook === 'function') {
        renderWorkbook();
      }

      btnRxSaveJournal.textContent = '✅ 워크북 저장 완료!';
      btnRxSaveJournal.disabled = true;
      setTimeout(() => {
        if (btnRxSaveJournal) {
          btnRxSaveJournal.textContent = '📓 내 워크북에 처방전 보관';
          btnRxSaveJournal.disabled = false;
        }
      }, 2500);
    });
  }

  // 처방된 연습 즉시 실천하기
  if (btnRxPracticeNow) {
    btnRxPracticeNow.addEventListener('click', () => {
      if (!rxPrescribedEx) return;
      closePrescriptionStudio();
      window.startPractice(rxPrescribedEx.globalIndex);
    });
  }

  // 처방전 인쇄 및 출력
  if (btnRxPrint) {
    btnRxPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // 네비게이션 버튼 (이전 / 다음)
  if (btnRxPrev) {
    btnRxPrev.addEventListener('click', () => {
      if (rxCurrentStage > 1) {
        setRxStage(rxCurrentStage - 1);
      }
    });
  }

  if (btnRxNext) {
    btnRxNext.addEventListener('click', () => {
      if (rxCurrentStage < 3) {
        setRxStage(rxCurrentStage + 1);
      } else {
        closePrescriptionStudio();
      }
    });
  }

  if (btnRxToggleSound) {
    btnRxToggleSound.addEventListener('click', () => {
      isRxSoundOn = !isRxSoundOn;
      if (isRxSoundOn) {
        window.soundscapeEngine.play('bowl');
        btnRxToggleSound.innerHTML = '<span>🔔 싱잉볼 소리 끄기</span>';
      } else {
        window.soundscapeEngine.stop();
        btnRxToggleSound.innerHTML = '<span>🔔 싱잉볼 소리 켜기</span>';
      }
    });
  }

  // =========================================================
  // 10. Inner Pause Teachings Section (내면의 쉼표 가르침 섹션)
  // =========================================================
  let currentTeaching = null;
  const oracleIcon = document.getElementById('oracle-icon');
  const oracleTheme = document.getElementById('oracle-theme');
  const oracleHeadline = document.getElementById('oracle-headline');
  const oracleQuote = document.getElementById('oracle-quote');
  const oracleGroundingInst = document.getElementById('oracle-grounding-inst');
  const oracleGroundingPrac = document.getElementById('oracle-grounding-prac');
  const oracleHealingInst = document.getElementById('oracle-healing-inst');
  const oracleHealingPrac = document.getElementById('oracle-healing-prac');
  const oracleLiberationDecl = document.getElementById('oracle-liberation-decl');
  const oracleQuestion = document.getElementById('oracle-question');

  const btnDrawTeaching = document.getElementById('btn-draw-teaching');
  const btnMeditateTeaching = document.getElementById('btn-meditate-teaching');
  const btnAskTeaching = document.getElementById('btn-ask-teaching');

  // 오라클 3단계 개별 및 연속 TTS 음성 가이드 DOM
  const btnPlayAllTeaching = document.getElementById('btn-play-all-teaching');
  const allTeachingIcon = document.getElementById('all-teaching-icon');
  const allTeachingText = document.getElementById('all-teaching-text');
  const stageVoiceButtons = [
    document.getElementById('btn-stage-voice-1'),
    document.getElementById('btn-stage-voice-2'),
    document.getElementById('btn-stage-voice-3'),
  ];
  const stageCards = [
    document.getElementById('stage-card-1'),
    document.getElementById('stage-card-2'),
    document.getElementById('stage-card-3'),
  ];

  let activeOracleAudio = null;
  let activeOracleStage = null;
  let isPlayingAllTeaching = false;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function resetOracleStageButtons() {
    stageVoiceButtons.forEach((btn, idx) => {
      if (!btn) return;
      btn.classList.remove('playing');
      const icon = btn.querySelector('.stage-voice-icon');
      const text = btn.querySelector('.stage-voice-text');
      if (icon) icon.textContent = '🔊';
      if (text) text.textContent = `${idx + 1}단계 음성`;
    });
    stageCards.forEach(card => {
      if (card) card.classList.remove('stage-active-playing');
    });
    if (btnPlayAllTeaching) {
      btnPlayAllTeaching.classList.remove('playing');
      if (allTeachingIcon) allTeachingIcon.textContent = '🔊';
      if (allTeachingText) allTeachingText.textContent = '3단계 연속 듣기';
    }
  }

  function stopOracleTeachingAudio() {
    if (activeOracleAudio) {
      try {
        activeOracleAudio.pause();
        activeOracleAudio.currentTime = 0;
      } catch (e) {}
      activeOracleAudio = null;
    }
    activeOracleStage = null;
    isPlayingAllTeaching = false;
    resetOracleStageButtons();
    restoreSoundscapeVolume();
  }

  function getTeachingScriptForStage(stageNum) {
    if (!currentTeaching) return '';
    if (stageNum === 1) {
      const inst = currentTeaching.grounding?.instruction || '';
      const prac = currentTeaching.grounding?.practice || '';
      return `1단계 신체 접지 가이드입니다. ${inst} ${prac}`;
    }
    if (stageNum === 2) {
      const inst = currentTeaching.healing?.instruction || '';
      const prac = currentTeaching.healing?.practice || '';
      return `2단계 기적수업 용서 가이드입니다. ${inst} ${prac}`;
    }
    if (stageNum === 3) {
      const decl = currentTeaching.liberation?.declaration || '';
      return `3단계 본래의 온전함 선언입니다. ${decl} 당신은 이미 완전하고 안전합니다.`;
    }
    return '';
  }

  function playOracleTeachingStage(stageNum, onEndedCallback) {
    const script = getTeachingScriptForStage(stageNum);
    if (!script) return;

    // 만약 이미 재생 중인 단계와 동일하면 중단
    if (activeOracleStage === stageNum && !isPlayingAllTeaching) {
      stopOracleTeachingAudio();
      return;
    }

    stopOracleTeachingAudio();
    activeOracleStage = stageNum;
    duckSoundscapeVolume(0.12);

    // UI 활성화
    const btn = stageVoiceButtons[stageNum - 1];
    const card = stageCards[stageNum - 1];
    if (btn) {
      btn.classList.add('playing');
      const icon = btn.querySelector('.stage-voice-icon');
      const text = btn.querySelector('.stage-voice-text');
      if (icon) icon.textContent = '⏹️';
      if (text) text.textContent = '음성 중단';
    }
    if (card) {
      card.classList.add('stage-active-playing');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const finishPlayback = (completed = true) => {
      activeOracleAudio = null;
      activeOracleStage = null;
      resetOracleStageButtons();
      restoreSoundscapeVolume();
      if (completed !== false && typeof onEndedCallback === 'function') {
        onEndedCallback();
      }
    };

    const reportNaturalVoiceUnavailable = () => {
      finishPlayback(false);
      stopOracleTeachingAudio();
      if (btn) {
        btn.title = 'AI 자연 음성을 생성하지 못했습니다. 잠시 후 다시 눌러 주세요.';
        const label = btn.querySelector('.stage-voice-text');
        if (label) label.textContent = 'AI 음성 재시도';
      }
    };

    // 1. 서버 고품질 음성 API 요청
    fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: script, voice: ttsVoice })
    })
      .then(res => res.json())
      .then(data => {
        const audioUrl = naturalVoiceUrl(data);
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          activeOracleAudio = audio;
          audio.onended = finishPlayback;
          audio.onerror = () => reportNaturalVoiceUnavailable();
          const p = audio.play();
          if (p !== undefined) {
            p.catch(() => reportNaturalVoiceUnavailable());
          }
        } else {
          reportNaturalVoiceUnavailable();
        }
      })
      .catch(() => {
        reportNaturalVoiceUnavailable();
      });
  }

  function playAllOracleTeachingSequential() {
    if (isPlayingAllTeaching) {
      stopOracleTeachingAudio();
      return;
    }

    stopOracleTeachingAudio();
    stopRitual();
    isPlayingAllTeaching = true;

    if (btnPlayAllTeaching) {
      btnPlayAllTeaching.classList.add('playing');
      if (allTeachingIcon) allTeachingIcon.textContent = '⏹️';
      if (allTeachingText) allTeachingText.textContent = '연속 듣기 중단';
    }

    if (window.soundscapeEngine && typeof window.soundscapeEngine.playChime === 'function') {
      window.soundscapeEngine.playChime();
    }

    const playNext = (stage) => {
      if (!isPlayingAllTeaching || stage > 3) {
        isPlayingAllTeaching = false;
        resetOracleStageButtons();
        return;
      }
      playOracleTeachingStage(stage, () => {
        if (!isPlayingAllTeaching) return;
        if (stage < 3) {
          if (window.soundscapeEngine && typeof window.soundscapeEngine.playChime === 'function') {
            window.soundscapeEngine.playChime();
          }
          setTimeout(() => {
            if (isPlayingAllTeaching) playNext(stage + 1);
          }, 1000);
        } else {
          isPlayingAllTeaching = false;
          resetOracleStageButtons();
        }
      });
    };

    setTimeout(() => {
      playNext(1);
    }, 400);
  }

  // 3단계 카드 개별 음성 버튼 클릭 이벤트 연결
  stageVoiceButtons.forEach((btn, idx) => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopRitual();
        playOracleTeachingStage(idx + 1);
      });
    }
  });

  // 3단계 전체 연속 듣기 버튼
  if (btnPlayAllTeaching) {
    btnPlayAllTeaching.addEventListener('click', () => {
      playAllOracleTeachingSequential();
    });
  }

  // 🔍 Key 검색: 치유 비결 결과를 누르면 그 가르침을 바로 펼친다
  window.keyShowTeaching = function(id) {
    const teaching = (window.INNER_PAUSE_TEACHINGS || []).find(item => item.id === id);
    if (!teaching) return;
    switchTab('tab-teachings', false);
    renderTeaching(teaching);
    const card = document.getElementById('teaching-oracle-card');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  function renderTeaching(teaching) {
    if (!teaching) return;
    currentTeaching = teaching;
    stopOracleTeachingAudio();

    if (oracleIcon) oracleIcon.textContent = teaching.icon || '✨';
    if (oracleTheme) oracleTheme.textContent = teaching.theme || '내면의 쉼표';
    if (oracleHeadline) oracleHeadline.textContent = teaching.headline;
    if (oracleQuote) oracleQuote.textContent = `"${teaching.quote}"`;

    if (oracleGroundingInst) oracleGroundingInst.textContent = teaching.grounding ? teaching.grounding.instruction : '';
    if (oracleGroundingPrac) oracleGroundingPrac.textContent = teaching.grounding ? teaching.grounding.practice : '';

    if (oracleHealingInst) oracleHealingInst.textContent = teaching.healing ? teaching.healing.instruction : '';
    if (oracleHealingPrac) oracleHealingPrac.textContent = teaching.healing ? teaching.healing.practice : '';

    if (oracleLiberationDecl) oracleLiberationDecl.textContent = teaching.liberation ? teaching.liberation.declaration : '';
    if (oracleQuestion) oracleQuestion.textContent = teaching.reflectionQuestion || '';

    const card = document.getElementById('teaching-oracle-card');
    if (card) {
      card.classList.remove('oracle-animate-pop');
      void card.offsetWidth;
      card.classList.add('oracle-animate-pop');
    }
  }

  // 초기 렌더링
  if (typeof window.getRandomTeaching === 'function') {
    renderTeaching(window.getRandomTeaching());
  }

  // 가르침 새로 뽑기 (오늘의 가르침 새로 받기)
  if (btnDrawTeaching) {
    btnDrawTeaching.addEventListener('click', () => {
      if (typeof window.getRandomTeaching !== 'function') return;
      const nextTeaching = window.getRandomTeaching(currentTeaching ? currentTeaching.id : null);
      renderTeaching(nextTeaching);

      if (window.soundscapeEngine && typeof window.soundscapeEngine.playChime === 'function') {
        window.soundscapeEngine.playChime();
      }
    });
  }

  // 이 가르침으로 상담받기
  if (btnAskTeaching) {
    btnAskTeaching.addEventListener('click', () => {
      if (!currentTeaching) return;
      const questionPrompt = `오늘 내면의 쉼표 가르침 [${currentTeaching.theme}]: "${currentTeaching.headline}" 가르침을 읽었습니다. ${currentTeaching.reflectionQuestion}에 대해 제 상황을 나누고, 불안을 내려놓는 지혜를 얻고 싶어요.`;
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'NAVIGATE_LUCKEY', path: '/chat', text: questionPrompt }, '*');
      } else {
        window.location.href = '/chat';
      }
    });
  }

  // 가르침 카드 하단 3분 체화 명상 리추얼 이동 버튼
  if (btnMeditateTeaching) {
    btnMeditateTeaching.addEventListener('click', () => {
      stopOracleTeachingAudio();
      const box = document.getElementById('teaching-meditation-box');
      if (box) {
        box.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          startRitual();
        }, 400);
      }
    });
  }

  const btnStartRitual = document.getElementById('btn-start-ritual');
  const btnStopRitual = document.getElementById('btn-stop-ritual');
  const btnNextStage = document.getElementById('btn-next-stage');
  const tMedPlayer = document.getElementById('t-med-player');
  const tMedSec = document.getElementById('t-med-sec');
  const tMedStageName = document.getElementById('t-med-stage-name');
  const tMedGuide = document.getElementById('t-med-guide');
  const tDot1 = document.getElementById('t-dot-1');
  const tDot2 = document.getElementById('t-dot-2');
  const tDot3 = document.getElementById('t-dot-3');

  // 명상 진행률 프로그레스 바 DOM
  const tMedProgressWrap = document.getElementById('t-med-progress-wrap');
  const tMedProgressBar = document.getElementById('t-med-progress-bar');
  const tMedTimeCurrent = document.getElementById('t-med-time-current');
  const tMedTimeTotal = document.getElementById('t-med-time-total');
  const tMedAutoBadge = document.getElementById('t-med-auto-badge');

  // TTS 컨트롤 및 상태 DOM
  const btnRitualVoiceToggle = document.getElementById('btn-ritual-voice-toggle');
  const voiceToggleIcon = document.getElementById('voice-toggle-icon');
  const voiceToggleText = document.getElementById('voice-toggle-text');
  const ritualVoiceSelect = document.getElementById('ritual-voice-select');
  const tMedVoiceStatus = document.getElementById('t-med-voice-status');
  const voiceStatusText = document.getElementById('voice-status-text');
  const btnReplayVoice = document.getElementById('btn-replay-voice');

  // 3분 체화 명상 리추얼 및 실시간 음성 TTS 가이드 엔진
  let ritualTimer = null;
  let autoAdvanceTimer = null;
  let ritualStage = 1;
  let ritualSecondsLeft = 60;
  let ttsEnabled = true;
  let ttsVoice = 'Aoede';
  let activeTtsAudio = null;
  const clientTtsCache = new Map();

  // 단계별 텍스트 가이드
  const RITUAL_STAGE_INFO = {
    1: {
      name: "1단계: 기운 접지 (Earth Energy)",
      time: 60,
      guide: "가만히 눈을 감고 어깨와 턱의 힘을 툭 뺍니다. 발바닥이 닿은 대지의 생기를 느끼고, 아랫배 단전이 오르내리는 숨의 파도에 집중하세요."
    },
    2: {
      name: "2단계: 액운 정화 (Karma Clearing)",
      time: 60,
      guide: "막힌 운과 불안을 억지로 통제하려던 집착을 조용히 내려놓습니다. 떠오르는 걱정을 '바람에 스쳐 지나가는 구름'으로 바라보며 탁한 기운을 씻어내세요."
    },
    3: {
      name: "3단계: 대운 선언 (Destiny Manifestation)",
      time: 60,
      guide: "심연 속 깊은 바다는 어떤 거센 파도에도 흔들리지 않습니다. '나의 길운은 이미 열려 있으며, 나는 모든 행운을 맞이할 준비가 되었다'고 마음속으로 선언해보세요."
    }
  };

  // 단계별 전문 TTS 음성 스크립트 (차분하고 다정한 개운 명상 나레이션)
  const RITUAL_TTS_SCRIPTS = {
    1: "1단계, 기운 접지입니다. 가만히 눈을 감고 어깨와 턱의 힘을 툭 뺍니다. 발바닥이 닿아 있는 대지의 든든한 생기를 느껴보세요. 아랫배 단전이 부풀어 오르고 가라앉는 숨의 파도에 집중합니다. 코로 4초간 맑은 천기를 깊게 들이쉬고, 입으로 6초간 묵은 탁기를 모두 비워냅니다.",
    2: "2단계, 액운 정화입니다. 막힌 상황을 억지로 통제하려던 두려운 마음을 조용히 내려놓으세요. 떠오르는 걱정과 잡념을 내 운명과 분리하여, 하늘에 스쳐 지나가는 구름처럼 그저 흘려보냅니다. 묵은 액운이 씻겨 나가고 맑은 공간이 열립니다.",
    3: "3단계, 대운 선언입니다. 먹구름 너머의 태양은 단 한 순간도 빛을 잃지 않습니다. 마음속으로 가만히 선언해 보세요. '나의 길은 활짝 열리고 있으며, 내 안의 복록과 행운은 언제나 충만하다.' 당신의 대운은 지금 이 순간 깨어납니다.",
    done: "3분 개운 파동 명상이 모두 완료되었습니다. 맑게 정화된 운기와 행운의 파동을 가슴에 품고, 편안한 호흡과 함께 천천히 눈을 떠보세요."
  };

  function getActiveRitualScript(stageKey) {
    if (stageKey === 'done') return RITUAL_TTS_SCRIPTS.done;
    if (currentTeaching) {
      if (stageKey === 1 && currentTeaching.grounding) {
        return `1단계, 신체 접지입니다. ${currentTeaching.grounding.instruction} ${currentTeaching.grounding.practice} 천천히 코로 깊게 들이마시고, 입으로 부드럽게 모든 긴장을 흘려보냅니다.`;
      }
      if (stageKey === 2 && currentTeaching.healing) {
        return `2단계, 기적수업 용서입니다. ${currentTeaching.healing.instruction} ${currentTeaching.healing.practice} 떠오르는 불안한 감정을 억누르지 않고, 구름을 보듯 관찰하며 용서하세요.`;
      }
      if (stageKey === 3 && currentTeaching.liberation) {
        return `3단계, 본래의 온전함 선언입니다. ${currentTeaching.liberation.declaration} 당신은 지금 이대로 완전하고 안전합니다.`;
      }
    }
    return RITUAL_TTS_SCRIPTS[stageKey] || '';
  }

  // 사운드스케이프 배경음 볼륨 덕킹 (음성 재생 시 배경음 부드럽게 낮춤)
  function duckSoundscapeVolume(targetVol = 0.15) {
    if (window.soundscapeEngine && window.soundscapeEngine.masterGain && window.soundscapeEngine.ctx) {
      try {
        window.soundscapeEngine.masterGain.gain.linearRampToValueAtTime(targetVol, window.soundscapeEngine.ctx.currentTime + 0.3);
      } catch (e) {}
    }
  }

  function restoreSoundscapeVolume(normalVol = 0.4) {
    if (window.soundscapeEngine && window.soundscapeEngine.masterGain && window.soundscapeEngine.ctx) {
      try {
        window.soundscapeEngine.masterGain.gain.linearRampToValueAtTime(normalVol, window.soundscapeEngine.ctx.currentTime + 0.8);
      } catch (e) {}
    }
  }

  // TTS 상태 인디케이터 갱신
  function setVoiceIndicatorStatus(state, customText = '') {
    if (!tMedVoiceStatus) return;

    tMedVoiceStatus.classList.remove('speaking', 'loading');

    if (state === 'speaking') {
      tMedVoiceStatus.classList.add('speaking');
      if (voiceStatusText) voiceStatusText.textContent = customText || '🎙️ 개운 마스터 음성 안내 재생 중...';
    } else if (state === 'loading') {
      tMedVoiceStatus.classList.add('loading');
      if (voiceStatusText) voiceStatusText.textContent = customText || '⏳ 음성 안내 불러오는 중...';
    } else if (state === 'completed') {
      if (voiceStatusText) voiceStatusText.textContent = customText || '✅ 음성 안내 완료 (다음 단계로 자동 전환)';
    } else if (state === 'disabled') {
      if (voiceStatusText) voiceStatusText.textContent = '🔇 음성 안내 꺼짐 (타이머 자동 진행 중)';
    } else {
      if (voiceStatusText) voiceStatusText.textContent = customText || '🎙️ 개운 마스터 음성 안내 준비 완료';
    }
  }

  // 재생 중인 TTS 중지
  function stopActiveTts() {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
    if (activeTtsAudio) {
      try {
        activeTtsAudio.pause();
        activeTtsAudio.currentTime = 0;
      } catch (e) {}
      activeTtsAudio = null;
    }
    setVoiceIndicatorStatus('idle');
    restoreSoundscapeVolume();
  }

  // 진행률 갱신 헬퍼
  function updateMeditationProgress(currentSec, totalSec) {
    if (tMedProgressBar) {
      const pct = totalSec > 0 ? Math.min(100, (currentSec / totalSec) * 100) : 0;
      tMedProgressBar.style.width = `${pct.toFixed(1)}%`;
    }
    if (tMedTimeCurrent) tMedTimeCurrent.textContent = formatTime(currentSec);
    if (tMedTimeTotal) tMedTimeTotal.textContent = formatTime(totalSec);
    if (tMedSec) {
      const remaining = Math.max(0, Math.ceil(totalSec - currentSec));
      tMedSec.textContent = remaining;
    }
  }

  // 음성 재생 완료 후 자동 다음 단계 전환 트리거
  function triggerAutoAdvanceOnPlaybackEnd(stageKey) {
    if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
    if (tMedProgressBar) tMedProgressBar.style.width = '100%';
    if (tMedAutoBadge) {
      tMedAutoBadge.classList.add('transitioning');
    }

    if (stageKey === 'done') {
      setVoiceIndicatorStatus('completed', '🕊️ 모든 명상 리추얼 완주');
      if (tMedAutoBadge) tMedAutoBadge.textContent = '✨ 내면의 깊은 평온이 자리잡았습니다';
      return;
    }

    const nextStageNum = Number(stageKey) + 1;
    if (nextStageNum <= 3) {
      if (tMedAutoBadge) tMedAutoBadge.textContent = `✨ ${stageKey}단계 완료 ➔ ${nextStageNum}단계로 자동 전환 중...`;
      setVoiceIndicatorStatus('completed', `✨ ${stageKey}단계 음성 완료 (다음 단계로 전환합니다)`);
    } else {
      if (tMedAutoBadge) tMedAutoBadge.textContent = '✨ 3단계 완료 ➔ 축복 완료 단계로 자동 전환 중...';
      setVoiceIndicatorStatus('completed', '✨ 3단계 음성 완료 (리추얼 완주 축복)');
    }

    autoAdvanceTimer = setTimeout(() => {
      advanceRitualStage();
    }, 1400);
  }

  // AI speech failure stays visible; never read with an OS/default voice.
  function reportNaturalVoiceUnavailable(_text, _stageKey) {
    stopActiveTts();
    if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
    setVoiceIndicatorStatus('idle', 'AI 자연 음성을 생성하지 못했습니다. 다시 재생해 주세요.');
    restoreSoundscapeVolume();
  }

  // Audio URL(Base64 WAV/MP3) 재생 및 실시간 진행률 연동
  function playAudioUrl(audioUrl, fallbackScript, stageKey) {
    try {
      const audio = new Audio(audioUrl);
      activeTtsAudio = audio;
      setVoiceIndicatorStatus('speaking');

      // 로드 완료 시 전체 재생 시간 반영
      audio.onloadedmetadata = () => {
        const total = audio.duration || 30;
        updateMeditationProgress(0, total);
      };

      // 오디오 실시간 재생 진행률 리스너 (진행률 바 및 잔여 초 동기화)
      audio.ontimeupdate = () => {
        const current = audio.currentTime || 0;
        const total = audio.duration || 1;
        updateMeditationProgress(current, total);
      };

      // 음성 재생이 끝나면 자동으로 다음 단계 넘김 트리거
      audio.onended = () => {
        activeTtsAudio = null;
        const total = audio.duration || 1;
        updateMeditationProgress(total, total);
        restoreSoundscapeVolume();
        triggerAutoAdvanceOnPlaybackEnd(stageKey);
      };

      audio.onerror = () => {
        activeTtsAudio = null;
        reportNaturalVoiceUnavailable(fallbackScript, stageKey);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.warn('Audio 자동 재생 차단 또는 오류:', e);
          reportNaturalVoiceUnavailable(fallbackScript, stageKey);
        });
      }
    } catch (e) {
      reportNaturalVoiceUnavailable(fallbackScript, stageKey);
    }
  }

  // 단계별 TTS 실행 함수
  function speakRitualScript(stageKey) {
    stopActiveTts();

    if (tMedProgressBar) tMedProgressBar.style.width = '0%';
    if (tMedAutoBadge) {
      tMedAutoBadge.classList.remove('transitioning');
      tMedAutoBadge.textContent = '⚡ 음성 진행률에 맞춰 다음 단계 자동 전환';
    }

    if (!ttsEnabled) {
      setVoiceIndicatorStatus('disabled');
      // 음성이 꺼진 경우 기본 45초 타이머로 자동 진행
      let timerSec = 45;
      updateMeditationProgress(0, timerSec);
      if (ritualTimer) clearInterval(ritualTimer);
      ritualTimer = setInterval(() => {
        timerSec--;
        updateMeditationProgress(45 - timerSec, 45);
        if (timerSec <= 0) {
          clearInterval(ritualTimer);
          ritualTimer = null;
          advanceRitualStage();
        }
      }, 1000);
      return;
    }

    const script = getActiveRitualScript(stageKey);
    if (!script) return;

    duckSoundscapeVolume(0.15);

    const cacheKey = `${ttsVoice}:${script}`;
    if (clientTtsCache.has(cacheKey)) {
      playAudioUrl(clientTtsCache.get(cacheKey), script, stageKey);
      return;
    }

    setVoiceIndicatorStatus('loading');

    fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: script, voice: ttsVoice })
    })
      .then(res => res.json())
      .then(data => {
        const audioUrl = naturalVoiceUrl(data);
        if (audioUrl) {
          clientTtsCache.set(cacheKey, audioUrl);
          playAudioUrl(audioUrl, script, stageKey);
        } else {
          reportNaturalVoiceUnavailable(script, stageKey);
        }
      })
      .catch(err => {
        console.warn('AI 자연 음성 요청 실패:', err);
        reportNaturalVoiceUnavailable(script, stageKey);
      });
  }

  function updateRitualUI() {
    const info = RITUAL_STAGE_INFO[ritualStage];
    if (!info) return;

    if (tMedStageName) tMedStageName.textContent = info.name;
    if (tMedGuide) {
      if (currentTeaching) {
        if (ritualStage === 1 && currentTeaching.grounding) {
          tMedGuide.textContent = `${currentTeaching.grounding.instruction} (${currentTeaching.grounding.practice})`;
        } else if (ritualStage === 2 && currentTeaching.healing) {
          tMedGuide.textContent = `${currentTeaching.healing.instruction} (${currentTeaching.healing.practice})`;
        } else if (ritualStage === 3 && currentTeaching.liberation) {
          tMedGuide.textContent = currentTeaching.liberation.declaration;
        } else {
          tMedGuide.textContent = info.guide;
        }
      } else {
        tMedGuide.textContent = info.guide;
      }
    }

    [tDot1, tDot2, tDot3].forEach((dot, idx) => {
      if (!dot) return;
      if (idx + 1 === ritualStage) {
        dot.classList.add('active');
        dot.classList.remove('completed');
      } else if (idx + 1 < ritualStage) {
        dot.classList.add('completed');
        dot.classList.remove('active');
      } else {
        dot.classList.remove('active', 'completed');
      }
    });
  }

  function startRitual() {
    stopOracleTeachingAudio();
    if (ritualTimer) clearInterval(ritualTimer);
    stopActiveTts();

    ritualStage = 1;
    ritualSecondsLeft = 60;

    if (tMedPlayer) tMedPlayer.classList.remove('hidden');
    if (btnStartRitual) btnStartRitual.classList.add('hidden');

    updateRitualUI();

    // 시작 싱잉볼 차임벨 타종 후 음성 시작
    if (window.soundscapeEngine && typeof window.soundscapeEngine.playChime === 'function') {
      window.soundscapeEngine.playChime();
    }

    setTimeout(() => {
      speakRitualScript(1);
    }, 600);

    // Generate speech only when playback is requested, preserving the AI quota.
  }

  function advanceRitualStage() {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
    stopActiveTts();

    if (ritualStage < 3) {
      ritualStage++;
      updateRitualUI();

      if (window.soundscapeEngine && typeof window.soundscapeEngine.playChime === 'function') {
        window.soundscapeEngine.playChime();
      }

      setTimeout(() => {
        speakRitualScript(ritualStage);
      }, 700);
    } else {
      // 명상 리추얼 3단계 모두 완료
      if (ritualTimer) {
        clearInterval(ritualTimer);
        ritualTimer = null;
      }
      if (window.soundscapeEngine && typeof window.soundscapeEngine.playChime === 'function') {
        window.soundscapeEngine.playChime();
      }
      if (tMedGuide) {
        tMedGuide.innerHTML = "✨ <strong>3분 내면의 쉼표 명상 리추얼이 완료되었습니다.</strong><br>내면의 훼손되지 않는 평온을 품고 오늘 하루를 편안하게 살아가세요.";
      }
      if (tMedStageName) tMedStageName.textContent = "명상 리추얼 완주";
      if (tMedSec) tMedSec.textContent = "완료";
      if (tDot1) tDot1.classList.add('completed');
      if (tDot2) tDot2.classList.add('completed');
      if (tDot3) tDot3.classList.add('completed');

      if (tMedProgressBar) tMedProgressBar.style.width = '100%';
      if (tMedAutoBadge) {
        tMedAutoBadge.classList.add('transitioning');
        tMedAutoBadge.textContent = '🕊️ 평온의 리추얼이 가슴속에 닻을 내렸습니다';
      }

      setTimeout(() => {
        speakRitualScript('done');
      }, 700);
    }
  }

  function stopRitual() {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
    if (ritualTimer) {
      clearInterval(ritualTimer);
      ritualTimer = null;
    }
    stopActiveTts();

    if (tMedPlayer) tMedPlayer.classList.add('hidden');
    if (btnStartRitual) btnStartRitual.classList.remove('hidden');

    ritualStage = 1;
    ritualSecondsLeft = 60;
    [tDot1, tDot2, tDot3].forEach(dot => {
      if (dot) dot.classList.remove('active', 'completed');
    });
    if (tMedProgressBar) tMedProgressBar.style.width = '0%';
    if (tMedAutoBadge) {
      tMedAutoBadge.classList.remove('transitioning');
      tMedAutoBadge.textContent = '⚡ 음성 진행률에 맞춰 다음 단계 자동 전환';
    }
  }

  // TTS 토글 버튼 핸들러
  if (btnRitualVoiceToggle) {
    btnRitualVoiceToggle.addEventListener('click', () => {
      ttsEnabled = !ttsEnabled;
      if (ttsEnabled) {
        btnRitualVoiceToggle.classList.add('active');
        if (voiceToggleIcon) voiceToggleIcon.textContent = '🔊';
        if (voiceToggleText) voiceToggleText.textContent = '음성 안내 ON';
        setVoiceIndicatorStatus('idle', '🎙️ 음성 안내 켜짐');
        if (!tMedPlayer.classList.contains('hidden')) {
          speakRitualScript(ritualStage);
        }
      } else {
        btnRitualVoiceToggle.classList.remove('active');
        if (voiceToggleIcon) voiceToggleIcon.textContent = '🔇';
        if (voiceToggleText) voiceToggleText.textContent = '음성 안내 OFF';
        stopActiveTts();
        setVoiceIndicatorStatus('disabled');
        // 음성 끈 상태에서도 45초 타이머로 자동 전환
        speakRitualScript(ritualStage);
      }
    });
  }

  // TTS 보이스 선택 드롭다운 핸들러
  if (ritualVoiceSelect) {
    ritualVoiceSelect.addEventListener('change', (e) => {
      ttsVoice = e.target.value;
      if (ttsEnabled && !tMedPlayer.classList.contains('hidden')) {
        speakRitualScript(ritualStage);
      }
    });
  }

  // 음성 다시 듣기 버튼
  if (btnReplayVoice) {
    btnReplayVoice.addEventListener('click', () => {
      if (!ttsEnabled) {
        ttsEnabled = true;
        if (btnRitualVoiceToggle) btnRitualVoiceToggle.classList.add('active');
        if (voiceToggleIcon) voiceToggleIcon.textContent = '🔊';
        if (voiceToggleText) voiceToggleText.textContent = '음성 안내 ON';
      }
      speakRitualScript(ritualStage);
    });
  }

  // 다음 단계 바로 넘어가기 버튼
  if (btnNextStage) {
    btnNextStage.addEventListener('click', () => {
      advanceRitualStage();
    });
  }

  if (btnStartRitual) btnStartRitual.addEventListener('click', startRitual);
  if (btnStopRitual) btnStopRitual.addEventListener('click', stopRitual);



  function formatMarkdown(text) {
    let html = escapeHtml(text);
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    return `<p>${html}</p>`;
  }

  function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 초기 워크북 피드 및 통계 렌더링
  renderWorkbook();

  // SOS 오감 진정 도구함 및 에너지 쉼 라운지 초기화
  initSensoryToolbox();
  initEnergyRestLounge();

  // 기본 활성 탭: 40가지 실천 연습실(tab-exercises) 안전 활성화 (모든 모듈 로드 완료 후 실행)
  let initialTab = 'tab-exercises';
  try {
    const saved = localStorage.getItem('calm_active_tab');
    if (saved && saved !== 'tab-chat' && saved !== 'tab-book' && saved !== 'tab-qa' && document.getElementById(saved)) {
      initialTab = saved;
    }
  } catch (e) {}
  switchTab(initialTab, false);

  // 🌟 상단 당겨서 새로고침(Pull-to-refresh) 브릿지 연동 (부모 PRISM 앱의 새로고침 인디케이터 및 동기화와 1:1 완벽 일치)
  (function initIframePullToRefresh() {
    let startY = 0;
    let startX = 0;
    let isTracking = false;
    const THRESHOLD = 92;

    function getTopScroll() {
      return Math.max(
        document.scrollingElement ? document.scrollingElement.scrollTop : 0,
        document.documentElement ? document.documentElement.scrollTop : 0,
        document.body ? document.body.scrollTop : 0,
        window.scrollY || window.pageYOffset || 0
      );
    }

    document.addEventListener('touchstart', function(e) {
      if (e.touches.length !== 1) { isTracking = false; return; }
      const target = e.target;
      if (target && target.closest && target.closest('input, textarea, select, [contenteditable="true"], button, a')) {
        isTracking = false;
        return;
      }
      if (getTopScroll() > 1) {
        isTracking = false;
        return;
      }
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isTracking = true;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
      if (!isTracking || e.touches.length !== 1) return;
      const dy = e.touches[0].clientY - startY;
      const dx = Math.abs(e.touches[0].clientX - startX);
      if (dy < 0 || dx > Math.max(18, dy)) {
        isTracking = false;
        try { window.parent.postMessage({ type: 'PRISM_PTR_RESET' }, '*'); } catch(_) {}
        return;
      }
      if (dy < 12) return;
      if (e.cancelable) {
        e.preventDefault();
      }
      const distance = Math.min(124, dy * 0.55);
      try {
        window.parent.postMessage({ type: 'PRISM_PTR_MOVE', distance: distance }, '*');
      } catch(_) {}
    }, { passive: false });

    function handleTouchEnd(e) {
      if (!isTracking) return;
      isTracking = false;
      const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : startY;
      const dy = endY - startY;
      const distance = Math.min(124, dy * 0.55);
      if (distance >= THRESHOLD) {
        try {
          window.parent.postMessage({ type: 'PRISM_PTR_TRIGGER' }, '*');
        } catch(_) {}
      } else {
        try {
          window.parent.postMessage({ type: 'PRISM_PTR_RESET' }, '*');
        } catch(_) {}
      }
    }

    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', function() {
      isTracking = false;
      try { window.parent.postMessage({ type: 'PRISM_PTR_RESET' }, '*'); } catch(_) {}
    }, { passive: true });
  })();

  // 📱 Key 채널 iframe 상단 탭 시 최상단 스크롤 (아이폰 고유 기능 연동)
  (function initIframeScrollToTopOnHeaderTap() {
    let startX = 0, startY = 0, startTime = 0, isDragging = false;

    window.addEventListener('touchstart', function(e) {
      if (!e.touches || e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isDragging = false;
    }, { passive: true, capture: true });

    window.addEventListener('touchmove', function(e) {
      if (isDragging || !e.touches || e.touches.length !== 1) return;
      var dist = Math.hypot(e.touches[0].clientX - startX, e.touches[0].clientY - startY);
      if (dist > 14) isDragging = true;
    }, { passive: true, capture: true });

    function scrollIframeToTopSmooth() {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
      try { document.documentElement.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { document.documentElement.scrollTop = 0; }
      try { document.body.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { document.body.scrollTop = 0; }
      document.querySelectorAll('.portal-container, .main-content, .exercises-grid, .scroll-container').forEach(function(el) {
        if (el.scrollTop > 0) {
          try { el.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { el.scrollTop = 0; }
        }
      });
    }

    window.addEventListener('touchend', function(e) {
      if (isDragging) return;
      var touch = e.changedTouches && e.changedTouches[0];
      if (!touch) return;
      var duration = Date.now() - startTime;
      var dist = Math.hypot(touch.clientX - startX, touch.clientY - startY);
      if (dist > 14 || duration > 400) return;

      var target = (document.elementFromPoint(touch.clientX, touch.clientY) || e.target);
      if (!target) return;
      if (target.closest('button, a, input, select, textarea, [role="button"], label, .chip')) return;

      var isTopEdge = touch.clientY <= 56;
      var isTopNav = Boolean(target.closest('.top-nav, header, nav'));

      if (isTopEdge || isTopNav) {
        scrollIframeToTopSmooth();
      }
    }, { passive: true, capture: true });

    window.addEventListener('click', function(e) {
      var target = document.elementFromPoint(e.clientX, e.clientY) || e.target;
      if (!target || target.closest('button, a, input, select, textarea, [role="button"], label, .chip')) return;

      if (e.clientY <= 52 || Boolean(target.closest('.top-nav, header, nav'))) {
        scrollIframeToTopSmooth();
      }
    }, { passive: true, capture: true });

    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'PRISM_SCROLL_TO_TOP') {
        scrollIframeToTopSmooth();
      }
    });
  })();
});

// ⌨️ 연습 창 안 입력칸을 누르면, 키보드가 올라온 뒤 그 칸을 창 본문 가운데로 옮긴다 (페이지 전체는 움직이지 않는다).
(function keepFocusedFieldVisible() {
  const isField = (el) => el && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && !/^(range|checkbox|radio|button|submit|reset|color|file|image|hidden)$/i.test(el.type || 'text')));
  const reveal = () => {
    const field = document.activeElement;
    if (!isField(field)) return;
    const body = field.closest('.modal-scrollable-body');
    if (!body) return;
    const b = body.getBoundingClientRect();
    const f = field.getBoundingClientRect();
    if (f.top >= b.top + 4 && f.bottom <= b.bottom - 4) return;
    const target = body.scrollTop + (f.top - b.top) - Math.max(8, (b.height - Math.min(f.height, b.height)) / 2);
    body.scrollTop = Math.max(0, target);
  };
  let timers = [];
  const schedule = () => {
    timers.forEach(clearTimeout);
    timers = [60, 250, 500, 800].map((ms) => setTimeout(reveal, ms));
  };
  document.addEventListener('focusin', (event) => { if (isField(event.target)) schedule(); });
  window.addEventListener('resize', () => { if (isField(document.activeElement)) schedule(); });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', () => { if (isField(document.activeElement)) schedule(); });
})();
