/**
 * 🌀 빅뱅 버튼 좌·우 탭 → 지금 화면에 보이는 목록을 한 칸씩 이동한다.
 * - 90개 도구 탭: 장(章) 분류 버튼 (전체 → 왜 나는 불안할까 → … → 8장)
 * - 실천 노트 탭: 기록 분류 버튼
 * - 그 밖에 '선택된 버튼'이 있는 버튼 줄이 있으면 그 줄
 * - 없으면 Key 탭(90개 도구 · 오감 도구함 · …)을 한 칸씩 이동
 * 상위 앱(CalmApp)이 { type: 'LUCKEY_KEY_STEP', direction: 'previous' | 'next' } 를 보낸다.
 */
(function () {
  'use strict';

  function isVisible(el) {
    if (!el) return false;
    var rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return false;
    var style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  function buttonsOf(row) {
    return Array.prototype.filter.call(row.querySelectorAll(':scope > button'), function (btn) {
      return !btn.disabled && isVisible(btn);
    });
  }

  function findRow() {
    var section = document.querySelector('.tab-view-section.active') || document;
    var preferred = section.querySelector('.exercises-filter-strip, #wb-filter-pills');
    if (preferred && isVisible(preferred) && buttonsOf(preferred).length > 1) return preferred;
    // 선택된(.active) 버튼이 있는 다른 버튼 줄
    var rows = section.querySelectorAll('div, nav');
    for (var i = 0; i < rows.length; i++) {
      var buttons = buttonsOf(rows[i]);
      if (buttons.length >= 3 && buttons.some(function (b) { return b.classList.contains('active'); })) return rows[i];
    }
    return null;
  }

  function centerInRow(row, btn) {
    // 가로 위치만 즉시 맞춘다. smooth scrollTo는 아이폰에서 페이지를 세로로 살짝 올린다.
    try {
      if (row.scrollWidth > row.clientWidth + 2) {
        var left = btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2;
        row.scrollLeft = Math.max(0, left);
      }
    } catch (_) { /* old browsers */ }
  }

  // 📌 목록을 바꿔도 보던 화면 위치를 그대로 둔다.
  // Key의 버튼들은 누르면 화면을 위로 올리거나(scrollTo) 목록이 짧아지며 화면이 끌려 올라가므로,
  // 페이지 높이를 잠시 유지하고 스크롤 위치를 되돌린다. 사용자가 직접 화면을 만지면 풀린다.
  var holdState = null;
  function releaseHold() {
    if (!holdState) return;
    blockUntil = 0;
    holdState.stopped = true;
    if (holdState.frame) cancelAnimationFrame(holdState.frame);
    holdState.timers.forEach(clearTimeout);
    document.body.style.minHeight = holdState.prevMinHeight;
    document.documentElement.style.overflowAnchor = '';
    document.body.style.overflowAnchor = '';
    holdState = null;
  }
  ['touchstart', 'wheel', 'keydown', 'pointerdown'].forEach(function (name) {
    window.addEventListener(name, releaseHold, { passive: true, capture: true });
  });
  // Key 버튼들이 부르는 화면 이동 명령(scrollTo·scrollIntoView)을 잠시 막는다.
  // 아이폰의 부드러운 스크롤은 시작이 늦고 길어서, 나중에 되돌리는 것만으로는 이길 수 없다.
  var blockUntil = 0;
  (function patchScrollCalls() {
    function guard(original) {
      return function () {
        if (Date.now() < blockUntil) return undefined;
        return original.apply(this, arguments);
      };
    }
    try {
      window.scrollTo = guard(window.scrollTo);
      window.scroll = guard(window.scroll);
      window.scrollBy = guard(window.scrollBy);
      var proto = Element.prototype;
      if (proto.scrollIntoView) proto.scrollIntoView = guard(proto.scrollIntoView);
      var elementScrollTo = proto.scrollTo;
      if (elementScrollTo) {
        proto.scrollTo = function () {
          // 가로 목록 줄은 움직여도 된다. 페이지(세로) 스크롤 요소만 막는다.
          var se = document.scrollingElement || document.documentElement;
          if (Date.now() < blockUntil && (this === se || this === document.body || this === document.documentElement || this.scrollHeight > this.clientHeight + 4)) {
            var arg = arguments[0];
            var onlyHorizontal = arg && typeof arg === 'object' && arg.top === undefined && arg.left !== undefined;
            if (!onlyHorizontal) return undefined;
          }
          return elementScrollTo.apply(this, arguments);
        };
      }
    } catch (_) { /* very old browsers */ }
  })();

  function holdScroll(fn) {
    var se = document.scrollingElement || document.documentElement;
    // 앞선 이동을 아직 붙잡는 중일 때만 그 위치를 이어 쓴다.
    var y = holdState && !holdState.done ? holdState.y : se.scrollTop;
    var prevMinHeight = holdState ? holdState.prevMinHeight : document.body.style.minHeight;
    var pageHeight = Math.max(se.scrollHeight, document.body.scrollHeight);
    if (holdState) { holdState.stopped = true; if (holdState.frame) cancelAnimationFrame(holdState.frame); holdState.timers.forEach(clearTimeout); }
    document.body.style.minHeight = pageHeight + 'px';
    document.documentElement.style.overflowAnchor = 'none';
    document.body.style.overflowAnchor = 'none';
    blockUntil = Date.now() + 1500;
    var state = { y: y, prevMinHeight: prevMinHeight, stopped: false, done: false, frame: 0, timers: [] };
    holdState = state;
    var restore = function () { if (!state.stopped && Math.abs(se.scrollTop - y) > 1) se.scrollTop = y; };
    fn();
    restore();
    var until = Date.now() + 1500;
    var loop = function () { restore(); if (!state.stopped && Date.now() < until) state.frame = requestAnimationFrame(loop); };
    state.frame = requestAnimationFrame(loop);
    [50, 150, 300, 500, 800, 1100, 1400].forEach(function (ms) { state.timers.push(setTimeout(restore, ms)); });
    state.timers.push(setTimeout(function () { state.done = true; }, 1550));
  }

  function step(direction) {
    var row = findRow();
    var buttons = row ? buttonsOf(row) : [];
    if (!row || buttons.length < 2) {
      // 버튼 줄이 없는 화면: Key 탭을 한 칸씩
      buttons = Array.prototype.filter.call(document.querySelectorAll('.tab-pill[data-tab]'), isVisible);
      row = buttons.length ? buttons[0].parentElement : null;
    }
    if (!row || buttons.length < 2) return null;
    var current = buttons.findIndex(function (b) { return b.classList.contains('active') || b.getAttribute('aria-selected') === 'true'; });
    if (current < 0) current = 0;
    var next = (current + (direction === 'previous' ? -1 : 1) + buttons.length) % buttons.length;
    var target = buttons[next];
    holdScroll(function () {
      // .click()은 버튼을 포커스해서 아이폰이 그 버튼이 보이게 화면을 살짝 올린다.
      target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    centerInRow(row, target);
    return (target.textContent || '').replace(/\s+/g, ' ').trim();
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return;
    var data = event.data;
    if (!data || data.type !== 'LUCKEY_KEY_STEP') return;
    var label = step(data.direction === 'previous' ? 'previous' : 'next');
    try { window.parent.postMessage({ type: 'LUCKEY_KEY_STEP_DONE', label: label }, window.location.origin); } catch (_) { /* standalone */ }
  });

  window.keyBigBangStep = step;
})();
