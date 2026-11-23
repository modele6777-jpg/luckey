/**
 * 🔊 키 채널 90가지 연습: "방법 듣기" 낭독.
 * 연습 창 위쪽에 버튼을 두고, 누르면 지금 단계의 방법을 AI 음성(/api/ai/tts)으로 읽어 준다.
 * 켜 둔 동안 다음/이전 단계로 넘어가면 그 단계를 이어서 읽고, 창을 닫으면 멈춘다.
 * 글은 연습 데이터(목적·단계 제목·설명·도움말·확언)로만 만든다.
 */
(function () {
  'use strict';
  var VOICE = 'Aoede';
  var CHUNK = 170;
  var on = false;
  var token = 0;
  var audio = null;
  var current = null; // { practice, stepIndex }
  var cache = new Map();
  var button = null;
  var note = null;

  function clean(text) {
    return String(text || '')
      .replace(/\(([^)]*워크시트[^)]*)\)/g, '')
      .replace(/[\[\]「」『』]/g, '')
      .replace(/[✅⭐️🌟✨🎯📝💡🔥]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function sentence(text) {
    var t = clean(text);
    if (!t) return '';
    return /[.!?。…요다죠]$/.test(t) ? t : t + '.';
  }

  function buildScript(practice, idx) {
    var steps = practice.steps || [];
    var step = steps[idx];
    if (!step) return '';
    var parts = [];
    if (idx === 0) {
      parts.push('연습 ' + practice.globalIndex + ', ' + clean(practice.title) + '. ' + sentence(practice.subtitle));
      parts.push(sentence(practice.purpose));
      if (practice.timeEstimate) parts.push('걸리는 시간은 ' + clean(practice.timeEstimate) + ' 정도예요.');
      if (practice.preparation && practice.preparation !== '없음') parts.push('준비물은 ' + clean(practice.preparation) + '입니다.');
      if (steps.length > 1) parts.push('모두 ' + steps.length + '단계로 진행해요.');
    }
    var stepTitle = sentence(String(step.title || '').replace(/^\s*\d+\s*단계\s*[:.·-]?\s*/, ''));
    parts.push(steps.length > 1 ? (step.stepNum || idx + 1) + '단계. ' + stepTitle : stepTitle);
    parts.push(sentence(step.instruction));
    if (step.type === 'timer' && step.duration) {
      var sec = Number(step.duration);
      parts.push(sec >= 60 && sec % 60 === 0 ? (sec / 60) + '분 동안 해 보세요.' : sec + '초 동안 해 보세요.');
    }
    if (step.tip) parts.push('도움말. ' + sentence(step.tip));
    var fields = step.fields || (step.field ? [step.field] : []).concat(step.fieldA ? [step.fieldA, step.fieldB] : []);
    if (fields.length && fields.length <= 3) {
      parts.push('적을 내용은 ' + fields.map(function (f) { return clean(f.label); }).filter(Boolean).join(', 그리고 ') + '입니다.');
    } else if (fields.length > 3) {
      parts.push('적을 칸이 ' + fields.length + '개 있어요. 칸마다 있는 예시를 참고해서 하나씩 적어 보세요.');
    }
    if (step.type === 'checklist' && step.options && step.options.length) {
      parts.push('해당하는 항목에 표시해 보세요.');
    }
    if (idx === 0 && practice.clinicalTip) parts.push('기억해 두세요. ' + sentence(practice.clinicalTip));
    if (idx === steps.length - 1) {
      if (practice.affirmation) parts.push('마지막으로 마음속으로 말해 보세요. ' + sentence(practice.affirmation));
      parts.push('다 하셨으면 아래 저장 버튼을 눌러 운기 노트에 남겨 두세요.');
    } else {
      parts.push('다 하셨으면 다음 단계로 넘어가세요.');
    }
    return parts.filter(Boolean).join(' ');
  }

  function chunks(text) {
    var out = [];
    var buf = '';
    text.split(/(?<=[.!?。])\s+/).forEach(function (s) {
      if (!s) return;
      if ((buf + ' ' + s).trim().length > CHUNK && buf) { out.push(buf.trim()); buf = s; }
      else buf = (buf + ' ' + s).trim();
    });
    if (buf) out.push(buf.trim());
    return out;
  }

  function audioUrl(data) {
    if (!data || !data.audioContent || ['mp3', 'wav'].indexOf(data.encoding) < 0) return null;
    return 'data:' + (data.encoding === 'wav' ? 'audio/wav' : 'audio/mpeg') + ';base64,' + data.audioContent;
  }
  function synth(text) {
    var key = VOICE + ':' + text;
    if (cache.has(key)) return cache.get(key);
    var p = fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, voice: VOICE })
    }).then(function (res) { return res.json(); }).then(function (data) {
      var url = audioUrl(data);
      if (!url) throw new Error((data && data.error) || 'no audio');
      return url;
    });
    p.catch(function () { cache.delete(key); });
    cache.set(key, p);
    return p;
  }

  function stopAudio() {
    token += 1;
    if (audio) { try { audio.pause(); } catch (e) { /* ignore */ } }
    audio = null;
  }

  function render(state) {
    if (!button) return;
    button.classList.toggle('is-on', on);
    button.classList.toggle('is-loading', state === 'loading');
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
    button.textContent = !on ? '🔊 방법 듣기' : state === 'loading' ? '⏳ 불러오는 중' : state === 'done' ? '🔁 다시 듣기' : '⏹ 그만 듣기';
    if (note) note.textContent = state === 'error' ? '음성을 불러오지 못했어요. 잠시 후 다시 눌러 주세요.' : '';
    if (note) note.hidden = state !== 'error';
  }

  function speak() {
    if (!current) return;
    stopAudio();
    var my = token;
    var parts = chunks(buildScript(current.practice, current.stepIndex));
    if (!parts.length) return;
    render('loading');
    var i = 0;
    var next = function () {
      if (my !== token) return;
      if (i >= parts.length) { render('done'); return; }
      var url = synth(parts[i]);
      if (i + 1 < parts.length) synth(parts[i + 1]); // 다음 조각을 미리 받아 둔다
      url.then(function (src) {
        if (my !== token) return;
        audio = new Audio(src);
        audio.onended = function () { i += 1; next(); };
        audio.onerror = function () { if (my === token) render('error'); };
        render('speaking');
        var played = audio.play();
        if (played && played.catch) played.catch(function () { if (my === token) render('error'); });
      }).catch(function () { if (my === token) render('error'); });
    };
    next();
  }

  function ensureButton() {
    if (button && document.body.contains(button)) return;
    var bar = document.querySelector('#modal-practice .modal-top-bar');
    var close = document.getElementById('btn-close-studio');
    if (!bar || !close) return;
    var wrap = document.createElement('div');
    wrap.className = 'key-voice-wrap';
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'key-voice-btn';
    button.addEventListener('click', function () {
      var label = button.textContent || '';
      if (on && label.indexOf('다시 듣기') < 0) { on = false; stopAudio(); render('idle'); return; }
      on = true;
      speak();
    });
    note = document.createElement('span');
    note.className = 'key-voice-note';
    note.hidden = true;
    wrap.appendChild(button);
    close.before(wrap);
    bar.after(note);
    render('idle');
  }

  document.addEventListener('key:practice-step', function (event) {
    var detail = event.detail || {};
    var changedPractice = !current || current.practice !== detail.practice;
    var changedStep = changedPractice || current.stepIndex !== detail.stepIndex;
    current = { practice: detail.practice, stepIndex: detail.stepIndex };
    ensureButton();
    if (changedPractice) { on = false; stopAudio(); render('idle'); return; }
    if (changedStep && on) speak();
  });
  document.addEventListener('key:practice-close', function () {
    on = false;
    stopAudio();
    current = null;
    render('idle');
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && on) { on = false; stopAudio(); render('idle'); }
  });

  window.keyPracticeVoice = { buildScript: buildScript };
})();
