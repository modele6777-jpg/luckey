/**
 * 🔍 Key 검색: 90가지 실천 도구 · 치유 비결 · 도구함 화면을 한 번에 찾는다.
 * 상단 내비게이션의 돋보기 버튼으로 열고, 결과를 누르면 바로 그 연습/화면으로 이동한다.
 */
(function () {
  'use strict';

  var SCREENS = [
    { tab: 'tab-exercises', icon: '🎯', title: '90가지 마음 연습', desc: '불안·예민함을 다루는 실천 도구 모음', words: '실천 연습 도구 마음' },
    { tab: 'tab-toolbox', icon: '🧰', title: 'SOS 오감 진정 도구함', desc: '1분 안에 오감으로 진정하기', words: 'sos 오감 진정 그라운딩 불안 공황 긴급' },
    { tab: 'tab-energy-rest', icon: '🔋', title: '에너지 무목적 쉼 라운지', desc: '지친 에너지를 채우는 쉼', words: '에너지 쉼 휴식 번아웃 피곤 지침' },
    { tab: 'tab-breathing', icon: '🎈', title: '신경계 진정 풍선호흡', desc: '천천히 숨 고르기', words: '호흡 숨 풍선 진정 긴장 잠 수면' },
    { tab: 'tab-workbook', icon: '📓', title: '나만의 실천 & 성찰 노트', desc: '내가 남긴 기록 보기', words: '노트 기록 일기 성찰 저널 확언' },
    { tab: 'tab-teachings', icon: '✨', title: '개운 & 치유 비결', desc: '마음을 여는 가르침', words: '비결 가르침 치유 개운 명상' }
  ];
  var MAX_EXERCISES = 30;

  function norm(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, '');
  }

  function esc(text) {
    return String(text || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function highlight(text, query) {
    var safe = esc(text);
    var q = String(query || '').trim();
    if (!q) return safe;
    var idx = String(text || '').toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return safe;
    var raw = String(text || '');
    return esc(raw.slice(0, idx)) + '<mark>' + esc(raw.slice(idx, idx + q.length)) + '</mark>' + esc(raw.slice(idx + q.length));
  }

  /** All query words must appear; the title/headline counts more. */
  function score(primary, secondary, terms) {
    var p = norm(primary);
    var all = p + norm(secondary);
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (all.indexOf(t) < 0) return 0;
      total += p.indexOf(t) >= 0 ? 3 : 1;
    }
    return total;
  }

  function search(query) {
    var terms = String(query || '').toLowerCase().split(/\s+/).map(norm).filter(Boolean);
    if (!terms.length) return null;
    var exercises = (window.PRACTICE_EXERCISES || []).map(function (ex) {
      var primary = [ex.title, ex.subtitle, ex.tag, '연습' + ex.globalIndex, ex.globalIndex].join(' ');
      var secondary = [ex.chapterTitle, ex.description, ex.purpose, ex.affirmation, ex.clinicalTip, ex.preparation].join(' ');
      return { ex: ex, s: score(primary, secondary, terms) };
    }).filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s || a.ex.globalIndex - b.ex.globalIndex; });

    var teachings = (window.INNER_PAUSE_TEACHINGS || []).map(function (t) {
      var secondary = [t.quote, t.reflectionQuestion, t.liberation && t.liberation.declaration].join(' ');
      return { t: t, s: score([t.theme, t.headline].join(' '), secondary, terms) };
    }).filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });

    var screens = SCREENS.map(function (sc) {
      return { sc: sc, s: score(sc.title, sc.desc + ' ' + sc.words, terms) };
    }).filter(function (r) { return r.s > 0; });

    return { exercises: exercises, teachings: teachings, screens: screens };
  }

  var overlay, input, results, lastQuery = '';

  function render(query) {
    lastQuery = query;
    var found = search(query);
    if (!found) {
      results.innerHTML = '<div class="key-search-hint">연습 이름, 고민, 감정으로 찾아보세요<div class="key-search-chips">' +
        ['불안', '잠', '관계', '번아웃', '호흡', '확언', '걱정'].map(function (w) {
          return '<button type="button" class="key-search-chip" data-q="' + w + '">' + w + '</button>';
        }).join('') + '</div></div>';
      return;
    }
    var html = '';
    if (found.screens.length) {
      html += '<div class="key-search-group">화면</div>';
      found.screens.forEach(function (r) {
        html += '<button type="button" class="key-search-item" data-tab="' + r.sc.tab + '"><span class="key-search-icon">' + r.sc.icon + '</span><span class="key-search-text"><strong>' + highlight(r.sc.title, query) + '</strong><small>' + esc(r.sc.desc) + '</small></span></button>';
      });
    }
    if (found.exercises.length) {
      html += '<div class="key-search-group">실천 도구 <span>' + found.exercises.length + '</span></div>';
      found.exercises.slice(0, MAX_EXERCISES).forEach(function (r) {
        var ex = r.ex;
        html += '<button type="button" class="key-search-item" data-practice="' + ex.globalIndex + '"><span class="key-search-icon">' + esc(ex.icon || '🎯') + '</span><span class="key-search-text"><strong>연습 ' + ex.globalIndex + '. ' + highlight(ex.title, query) + '</strong><small>' + esc(ex.chapter + '장 · ' + (ex.subtitle || ex.chapterTitle || '')) + '</small></span></button>';
      });
    }
    if (found.teachings.length) {
      html += '<div class="key-search-group">치유 비결 <span>' + found.teachings.length + '</span></div>';
      found.teachings.slice(0, 15).forEach(function (r) {
        var t = r.t;
        html += '<button type="button" class="key-search-item" data-teaching="' + t.id + '"><span class="key-search-icon">' + esc(t.icon || '✨') + '</span><span class="key-search-text"><strong>' + highlight(t.theme, query) + '</strong><small>' + esc(t.headline) + '</small></span></button>';
      });
    }
    results.innerHTML = html || '<div class="key-search-empty">“' + esc(query) + '”에 맞는 결과가 없어요.<br>다른 단어로 찾아보세요.</div>';
    results.scrollTop = 0;
  }

  function open() {
    if (!overlay) build();
    overlay.hidden = false;
    document.documentElement.classList.add('key-search-open');
    render(input.value);
    setTimeout(function () { input.focus(); }, 30);
  }

  function close() {
    if (!overlay) return;
    overlay.hidden = true;
    document.documentElement.classList.remove('key-search-open');
    input.blur();
  }

  function go(item) {
    var tab = item.getAttribute('data-tab');
    var practice = item.getAttribute('data-practice');
    var teaching = item.getAttribute('data-teaching');
    close();
    if (practice && typeof window.startPractice === 'function') {
      window.startPractice(Number(practice));
    } else if (teaching && typeof window.keyShowTeaching === 'function') {
      window.keyShowTeaching(Number(teaching));
    } else if (tab && typeof window.keySwitchTab === 'function') {
      window.keySwitchTab(tab, true);
    }
  }

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'key-search-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Key 검색');
    overlay.innerHTML =
      '<div class="key-search-panel">' +
        '<div class="key-search-bar">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
          '<input type="search" id="key-search-input" placeholder="연습, 고민, 감정으로 검색" autocomplete="off" enterkeyhint="search">' +
          '<button type="button" class="key-search-close" aria-label="검색 닫기">닫기</button>' +
        '</div>' +
        '<div class="key-search-results" id="key-search-results"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    input = overlay.querySelector('#key-search-input');
    results = overlay.querySelector('#key-search-results');
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter') {
        var first = results.querySelector('.key-search-item');
        if (first) go(first);
      }
    });
    overlay.querySelector('.key-search-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { close(); return; }
      var chip = e.target.closest('.key-search-chip');
      if (chip) { input.value = chip.getAttribute('data-q'); render(input.value); input.focus(); return; }
      var item = e.target.closest('.key-search-item');
      if (item) go(item);
    });
  }

  function mountButton() {
    var actions = document.querySelector('.top-nav .nav-actions');
    if (!actions || document.getElementById('key-search-btn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'key-search-btn';
    btn.className = 'key-search-btn';
    btn.setAttribute('aria-label', 'Key 검색');
    btn.title = '검색';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
    btn.addEventListener('click', open);
    // 📘 가이드: 앱(부모 화면)이 Key 사용법을 띄워 준다. 검색 버튼 왼쪽.
    if (window.parent && window.parent !== window && !document.getElementById('key-guide-btn')) {
      var guide = document.createElement('button');
      guide.type = 'button';
      guide.id = 'key-guide-btn';
      guide.className = 'key-guide-btn';
      guide.setAttribute('aria-label', 'Key 가이드 열기');
      guide.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg><span>가이드</span>';
      guide.addEventListener('click', function () {
        var active = document.querySelector('.tab-pill.active');
        window.parent.postMessage({ type: 'LUCKEY_OPEN_GUIDE', guide: 'key', tab: active ? active.getAttribute('data-tab') : '' }, window.location.origin);
      });
      actions.appendChild(guide);
    }
    actions.appendChild(btn);
  }

  window.keySearch = { open: open, close: close, search: search };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountButton);
  else mountButton();
})();
