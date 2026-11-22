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
    try {
      if (row.scrollWidth > row.clientWidth + 2) {
        var left = btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2;
        row.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      }
      var rect = row.getBoundingClientRect();
      // 목록 줄이 화면 밖이면 보이도록 (화면 안이면 세로로 움직이지 않는다)
      if (rect.bottom < 0 || rect.top > window.innerHeight) row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } catch (_) { /* old browsers */ }
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
    target.click();
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
