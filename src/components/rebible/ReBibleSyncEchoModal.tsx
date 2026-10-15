import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  BookMarked,
  Layers,
  Heart,
  Tag,
  Flame,
  Feather,
  Compass,
  Check
} from 'lucide-react';
import { SacredAtmosphere, ReBibleVerse } from '../../types/rebible';
import { cleanFactText } from '../../lib/rebibleStorage';
import { 
  SyncEchoDraft, 
  SyncEchoTopicDraft, 
  buildTodaySyncEchoDraft, 
  consecrateAllTopicVerses 
} from '../../lib/rebibleSyncEcho';
import { playTTS, stopTTS } from '../../utils/tts';

interface ReBibleSyncEchoModalProps {
  isOpen: boolean;
  onClose: () => void;
  verses: ReBibleVerse[];
  atmosphere: SacredAtmosphere;
  onSaveVerse: (verse: Partial<ReBibleVerse>) => void;
  onOpenVerseInDetail?: (verseId: string) => void;
}

export const ReBibleSyncEchoModal: React.FC<ReBibleSyncEchoModalProps> = ({
  isOpen,
  onClose,
  verses,
  atmosphere,
  onSaveVerse,
  onOpenVerseInDetail
}) => {
  const [draft, setDraft] = useState<SyncEchoDraft>(() => buildTodaySyncEchoDraft(verses));
  const [activeTopicIdx, setActiveTopicIdx] = useState<number>(0);

  // Active topic editable states
  const [bookTitle, setBookTitle] = useState('');
  const [title, setTitle] = useState('');
  const [fact, setFact] = useState('');
  const [insight, setInsight] = useState('');
  const [userReflection, setUserReflection] = useState('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [isPlayingGuidance, setIsPlayingGuidance] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  // Sync state with active topic
  const syncWithTopic = (topics: SyncEchoTopicDraft[], idx: number) => {
    const currentTopic = topics[idx] || topics[0];
    if (currentTopic) {
      setBookTitle(currentTopic.bookTitle);
      setTitle(currentTopic.title);
      setFact(cleanFactText(currentTopic.fact));
      setInsight(currentTopic.insight);
      setUserReflection(currentTopic.reflection || '');
      setEmotions(currentTopic.emotions);
      setTags(currentTopic.tags);
    } else {
      setBookTitle(draft.suggestedBook);
      setTitle(draft.suggestedTitle);
      setFact(cleanFactText(draft.context));
      setInsight(draft.guidance);
      setUserReflection(draft.reflection || '');
      setEmotions(draft.suggestedEmotions);
      setTags(draft.suggestedTags);
    }
  };

  // Re-build draft whenever modal opens or verses update
  useEffect(() => {
    if (isOpen) {
      const freshDraft = buildTodaySyncEchoDraft(verses);
      setDraft(freshDraft);
      setActiveTopicIdx(0);
      syncWithTopic(freshDraft.topicDrafts, 0);
      setIsSavedSuccess(false);
      setIsPlayingGuidance(false);
    }
  }, [isOpen, verses]);

  if (!isOpen) return null;

  const isParchment = atmosphere === 'parchment';
  const hasTopics = draft.topicDrafts && draft.topicDrafts.length > 0;
  const currentTopic = hasTopics ? draft.topicDrafts[activeTopicIdx] || draft.topicDrafts[0] : null;

  const handleSelectTopic = (idx: number) => {
    setActiveTopicIdx(idx);
    syncWithTopic(draft.topicDrafts, idx);
    setIsPlayingGuidance(false);
    stopTTS();
  };

  const handleRefreshDraft = () => {
    const freshDraft = buildTodaySyncEchoDraft(verses);
    setDraft(freshDraft);
    setActiveTopicIdx(0);
    syncWithTopic(freshDraft.topicDrafts, 0);
  };

  const handleToggleGuidanceAudio = async () => {
    if (isPlayingGuidance) {
      stopTTS();
      setIsPlayingGuidance(false);
      return;
    }

    setIsPlayingGuidance(true);
    const script = `${title}. 지혜의 구절. ${insight}. 오늘의 깨달음. ${userReflection}`;
    try {
      await playTTS(script, 'Kore', true);
    } catch (e) {
      console.warn('TTS playback completed or interrupted:', e);
    } finally {
      setIsPlayingGuidance(false);
    }
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const clean = newTagInput.trim().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  // Consecrate only currently selected topic verse
  const handleConsecrateCurrent = () => {
    const combinedInsight = userReflection.trim() 
      ? `${insight.trim()}\n\n[오늘의 나의 각인]\n${userReflection.trim()}`
      : insight.trim();

    const finalBook = bookTitle.trim() || '지혜의 서';
    const reference = `${finalBook} 1:1`;

    const newVersePayload: Partial<ReBibleVerse> = {
      bookTitle: finalBook,
      chapterNumber: 1,
      verseNumber: 1,
      reference,
      title: title.trim() || `${draft.dateDisplay}의 기록`,
      fact: cleanFactText(fact.trim()),
      insight: combinedInsight,
      emotions,
      tags: Array.from(new Set([...tags, 'Sync:Echo', `날짜:${draft.dateKey}`])),
      isSacredFavorite: true,
      recordedAt: new Date().toISOString(),
      annotations: []
    };

    onSaveVerse(newVersePayload);
    setIsSavedSuccess(true);
    setSavedCount(1);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Consecrate ALL detected individual topic verses to their respective Books!
  const handleConsecrateAllTopics = async () => {
    if (!draft.topicDrafts || draft.topicDrafts.length === 0) {
      handleConsecrateCurrent();
      return;
    }

    try {
      const created = await consecrateAllTopicVerses(draft.topicDrafts, draft.dateKey);
      setIsSavedSuccess(true);
      setSavedCount(created.length);
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      console.warn('Batch consecration failed, falling back:', err);
      handleConsecrateCurrent();
    }
  };

  const handleConsultLucy = () => {
    try {
      const topicContext = currentTopic 
        ? `[${currentTopic.bookTitle}] ${title}\n- 사건/수행(Fact): ${fact}\n- 루시의 지혜(Insight): ${insight}${userReflection.trim() ? `\n- 나의 각인: ${userReflection}` : ''}`
        : `[오늘의 전체 여정]\n${fact}\n\n[루시의 지혜]\n${insight}`;

      const prompt = `루시야, 오늘 리바이블 [${bookTitle} - ${title}] 기록에 대해 상담하고 싶어.\n\n📖 [기록된 사건/여정]\n${fact}\n\n✨ [루시의 관점 · 지혜의 구절]\n${insight}${userReflection.trim() ? `\n\n💭 [나의 성찰]\n${userReflection}` : ''}\n\n이 주제의 본질을 되새기고, 앞으로 내 삶에 적용할 수 있는 구체적인 조언과 따뜻한 통찰을 전해줘.`;

      sessionStorage.setItem('lucy_pro_pending_channel', 'master');
      sessionStorage.setItem('lucy_injected_auto_send', prompt);
      sessionStorage.setItem('lucy_injected_input_draft', prompt);

      window.dispatchEvent(new CustomEvent('lucy-inject-message', {
        detail: { prompt, channel: 'master' }
      }));
    } catch (_) {}
    onClose();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/chat' } }));
    }
  };

  const quickReflections = [
    '통제를 내려놓고 우주의 흐름을 신뢰할 때 평온이 깃든다.',
    '불안은 적이 아니라 정화되어야 할 오랜 기억일 뿐이다.',
    '오늘 하루도 나에게 일어난 모든 배움과 인연에 깊이 감사한다.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-3xl flex flex-col max-h-[92vh] rounded-3xl border shadow-2xl overflow-hidden ${
        isParchment 
          ? 'bg-[#FAF6EE] border-amber-900/20 text-stone-900' 
          : 'bg-slate-950 border-amber-500/30 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isParchment ? 'border-amber-900/10 bg-amber-100/50' : 'border-slate-800 bg-slate-900/80'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-bold shadow-md animate-pulse">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-serif text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5">
                  Sync:Echo (주제별 서재 분할 각인)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 border border-amber-500/30">
                  {hasTopics ? `감지된 독립 주제 ${draft.topicDrafts.length}편` : '지혜의 자동 통합'}
                </span>
              </div>
              <p className={`text-[11px] ${isParchment ? 'text-stone-600' : 'text-slate-400'}`}>
                오늘 활동을 한곳에 몰아넣지 않고, 각 주제별 서재(운명·정화·치유·성찰·영감·지혜)로 개별 편찬합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleRefreshDraft}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isParchment ? 'hover:bg-amber-200/60 text-stone-600' : 'hover:bg-white/10 text-slate-400'
              }`}
              title="프리즘 최신 활동 다시 불러오기"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isParchment ? 'hover:bg-amber-200/60 text-stone-600' : 'hover:bg-white/10 text-slate-400'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto no-scrollbar flex-1">
          {/* Status Indicator */}
          {draft.isAlreadyConsecrated && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span className="font-bold">오늘의 프리즘 지혜가 이미 서재에 봉헌되어 있습니다.</span>
              </div>
              {draft.consecratedVerseId && onOpenVerseInDetail && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenVerseInDetail(draft.consecratedVerseId!);
                  }}
                  className="underline hover:text-amber-300 font-semibold text-[11px] cursor-pointer"
                >
                  기록된 구절 보기
                </button>
              )}
            </div>
          )}

          {/* Topic Selector Tabs (16개 또는 개별 주제 탭 리스트) */}
          {hasTopics && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                  <Layers size={14} />
                  <span>주제 선택 (총 {draft.topicDrafts.length}개 주제 분류)</span>
                </div>
                <span className="text-[10px] opacity-70 font-mono">
                  {activeTopicIdx + 1} / {draft.topicDrafts.length}
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {draft.topicDrafts.map((topic, idx) => {
                  const isSelected = activeTopicIdx === idx;
                  return (
                    <button
                      key={topic.id || idx}
                      type="button"
                      onClick={() => handleSelectTopic(idx)}
                      className={`px-3 py-2 rounded-2xl text-xs font-serif font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                        isSelected
                          ? isParchment
                            ? 'bg-[#4A321F] text-[#FAF5EB] border-[#4A321F] shadow-md scale-102 ring-2 ring-amber-400'
                            : 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-102 font-black'
                          : isParchment
                            ? 'bg-[#EDE2CD] text-[#5A432F] border-[#DFCDB2] hover:bg-[#E2D4BC]'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <span>{topic.bookIcon}</span>
                      <span>{topic.bookTitle}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans font-bold ${
                        isSelected 
                          ? isParchment ? 'bg-amber-400 text-stone-900' : 'bg-slate-950 text-amber-400'
                          : 'bg-black/10 text-stone-600'
                      }`}>
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Book Title & Chapter Banner */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs flex-wrap gap-2 ${
            isParchment ? 'bg-amber-100/40 border-amber-800/20' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-500 flex items-center gap-1">
                <BookMarked size={14} />
                <span>배치될 서재:</span>
              </span>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className={`px-3 py-1 rounded-xl text-xs font-serif font-bold border outline-none ${
                  isParchment 
                    ? 'bg-white/90 border-amber-900/20 text-amber-950' 
                    : 'bg-slate-800 border-slate-700 text-amber-300'
                }`}
                placeholder="서 이름 (예: 운명의 서)"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleGuidanceAudio}
                className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                  isPlayingGuidance
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse font-bold'
                    : isParchment 
                      ? 'border-amber-900/20 hover:bg-amber-200/50 text-amber-900' 
                      : 'border-slate-700 hover:bg-slate-800 text-amber-400'
                }`}
              >
                {isPlayingGuidance ? <VolumeX size={13} /> : <Volume2 size={13} />}
                <span>{isPlayingGuidance ? '낭독 중단' : '이 구절 봉독 듣기'}</span>
              </button>
            </div>
          </div>

          {/* Verse Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-serif opacity-80 flex items-center gap-1">
              <span>구절 제목 (Verse Title)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-serif font-bold border outline-none transition ${
                isParchment 
                  ? 'bg-white border-amber-900/20 focus:border-amber-700 text-stone-900' 
                  : 'bg-slate-900 border-slate-800 focus:border-amber-500 text-white'
              }`}
              placeholder="구절 제목을 입력하세요"
            />
          </div>

          {/* 1. Context (해당 주제의 기록된 여정 / Fact) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold flex items-center gap-1 text-amber-500">
                <span>1. 해당 주제의 기록된 여정 (Fact &amp; Activity)</span>
              </label>
              <span className={`text-[10px] ${isParchment ? 'text-stone-500' : 'text-slate-400'}`}>
                {draft.dateDisplay}
              </span>
            </div>
            <textarea
              rows={3}
              value={fact}
              onChange={(e) => setFact(e.target.value)}
              placeholder="이 주제에 해당하는 구체적 수행/사건 내용..."
              className={`w-full p-3.5 rounded-2xl text-xs sm:text-sm font-sans outline-none border transition leading-relaxed ${
                isParchment
                  ? 'bg-white border-amber-900/20 text-stone-900 focus:border-amber-700'
                  : 'bg-slate-900/80 border-slate-800 text-slate-100 focus:border-amber-500'
              }`}
            />
          </div>

          {/* 2. Guidance (해당 주제에 특화된 루시의 지혜 / Insight) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold flex items-center gap-1.5 text-amber-500">
                <Sparkles size={13} />
                <span>2. 루시의 관점 · 지혜의 구절 (Lucy's Insight)</span>
              </label>
            </div>
            <div className={`p-4 rounded-2xl border relative ${
              isParchment
                ? 'bg-amber-100/60 border-amber-800/20'
                : 'bg-amber-950/20 border-amber-500/30'
            }`}>
              <textarea
                rows={4}
                value={insight}
                onChange={(e) => setInsight(e.target.value)}
                placeholder="이 주제에 특화된 루시의 지혜와 통찰 구절..."
                className={`w-full bg-transparent font-serif italic text-xs sm:text-sm outline-none resize-none leading-relaxed ${
                  isParchment ? 'text-amber-950 font-medium' : 'text-amber-100 font-normal'
                }`}
              />
            </div>
          </div>

          {/* 3. Reflection (나의 깨달음 / 각인) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold flex items-center gap-1.5 text-amber-500">
                <Feather size={13} />
                <span>3. 나의 깨달음 각인 (My Reflection)</span>
              </label>
            </div>
            <textarea
              rows={2}
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder="이 주제에 덧붙이고 싶은 나만의 생각이나 다짐..."
              className={`w-full p-3 rounded-2xl text-xs sm:text-sm font-sans outline-none border transition leading-relaxed ${
                isParchment
                  ? 'bg-white border-amber-900/30 text-stone-900 focus:border-amber-700'
                  : 'bg-slate-900/90 border-amber-500/40 text-slate-100 focus:border-amber-400'
              }`}
            />

            {/* Quick reflections */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className={`text-[10px] font-bold ${isParchment ? 'text-stone-500' : 'text-slate-400'}`}>
                추천 문구:
              </span>
              {quickReflections.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUserReflection(q)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition text-left cursor-pointer ${
                    isParchment
                      ? 'bg-amber-100/40 border-amber-900/10 text-stone-700 hover:bg-amber-200/60'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-amber-300'
                  }`}
                >
                  "{q.slice(0, 20)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Tags & Emotions */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold opacity-80 flex items-center gap-1">
              <Tag size={12} className="text-amber-500" />
              <span>태그 &amp; 감정</span>
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {emotions.map((em) => (
                <span
                  key={`em-${em}`}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-600 border border-amber-500/30"
                >
                  💫 {em}
                </span>
              ))}
              {tags.map((tag) => (
                <span
                  key={`tg-${tag}`}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 border ${
                    isParchment 
                      ? 'bg-amber-100/70 text-stone-800 border-amber-900/20' 
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="opacity-60 hover:opacity-100 text-xs ml-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="태그 추가..."
                  className={`px-2 py-0.5 rounded-lg text-[10px] outline-none border ${
                    isParchment ? 'bg-white border-amber-900/20' : 'bg-slate-900 border-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 ${
          isParchment ? 'border-amber-900/10 bg-amber-100/30' : 'border-slate-800 bg-slate-900/60'
        }`}>
          <div className="flex items-center gap-2 flex-wrap justify-end order-1 sm:order-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                isParchment ? 'text-stone-600 hover:bg-amber-200/50' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              닫기
            </button>

            {hasTopics && draft.topicDrafts.length > 1 && (
              <button
                type="button"
                onClick={handleConsecrateAllTopics}
                disabled={isSavedSuccess}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-slate-950 shadow-md hover:brightness-105 active:scale-95 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSavedSuccess ? (
                  <>
                    <Check size={14} />
                    <span>{savedCount}편 서재 분할 봉헌 완료!</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>모든 주제 각 서재별 일괄 봉헌 ({draft.topicDrafts.length}편)</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleConsecrateCurrent}
              disabled={isSavedSuccess}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/40 hover:bg-amber-500/30 shadow-xs active:scale-95 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>현재 주제만 봉헌</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConsultLucy}
            className="order-2 sm:order-1 px-3.5 py-2.5 rounded-2xl text-xs font-bold border border-amber-500/50 bg-amber-500/15 text-amber-950 hover:bg-amber-500/30 transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
            title="이 주제의 여정을 루시에게 전송하여 1:1 상담 시작"
          >
            <Sparkles size={14} className="fill-amber-400 text-amber-700 animate-pulse" />
            <span>이 주제로 루시와 상담하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
