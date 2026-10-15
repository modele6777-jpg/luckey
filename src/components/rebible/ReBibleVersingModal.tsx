import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Plus, 
  Layers, 
  Tag, 
  Heart, 
  Feather,
  CheckCircle2
} from 'lucide-react';
import { ReBibleVerse, SacredAtmosphere } from '../../types/rebible';
import { buildTodaySyncEchoDraft } from '../../lib/rebibleSyncEcho';

interface ReBibleVersingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (verseData: Partial<ReBibleVerse>) => void;
  editingVerse?: ReBibleVerse | null;
  atmosphere: SacredAtmosphere;
  existingBooks: string[];
}

const DEFAULT_EMOTION_PRESETS = [
  '불안', '상실', '분노', '자책', '수용', '용기', '해방', '감사', '평온', '확장', '사랑', '신뢰'
];

const DEFAULT_TAG_PRESETS = [
  '커리어', '관계', '자아성찰', '영성', '창작', '건강', '방향성', '가족', '풍요'
];

export const ReBibleVersingModal: React.FC<ReBibleVersingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingVerse,
  atmosphere,
  existingBooks
}) => {
  const [bookTitle, setBookTitle] = useState('각성의 서');
  const [customBookInput, setCustomBookInput] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [verseNumber, setVerseNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [fact, setFact] = useState('');
  const [insight, setInsight] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [customEmotion, setCustomEmotion] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  const [step, setStep] = useState<'fact' | 'insight' | 'index'>('fact');

  useEffect(() => {
    if (editingVerse) {
      setBookTitle(editingVerse.bookTitle || '각성의 서');
      setChapterNumber(editingVerse.chapterNumber || 1);
      setVerseNumber(editingVerse.verseNumber || 1);
      setTitle(editingVerse.title || '');
      setFact(editingVerse.fact || '');
      setInsight(editingVerse.insight || '');
      setSelectedEmotions(editingVerse.emotions || []);
      setSelectedTags(editingVerse.tags || []);
      setStep('fact');
    } else {
      setBookTitle(existingBooks[0] || '각성의 서');
      setChapterNumber(1);
      setVerseNumber(1);
      setTitle('');
      setFact('');
      setInsight('');
      setSelectedEmotions([]);
      setSelectedTags([]);
      setStep('fact');
    }
  }, [editingVerse, existingBooks, isOpen]);

  if (!isOpen) return null;

  const isParchment = atmosphere === 'parchment';

  const handleToggleEmotion = (em: string) => {
    if (selectedEmotions.includes(em)) {
      setSelectedEmotions(selectedEmotions.filter((x) => x !== em));
    } else {
      setSelectedEmotions([...selectedEmotions, em]);
    }
  };

  const handleAddCustomEmotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmotion.trim() && !selectedEmotions.includes(customEmotion.trim())) {
      setSelectedEmotions([...selectedEmotions, customEmotion.trim()]);
      setCustomEmotion('');
    }
  };

  const handleToggleTag = (tg: string) => {
    if (selectedTags.includes(tg)) {
      setSelectedTags(selectedTags.filter((x) => x !== tg));
    } else {
      setSelectedTags([...selectedTags, tg]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleFillFromSyncEcho = () => {
    const draft = buildTodaySyncEchoDraft();
    setTitle(draft.suggestedTitle);
    setFact(draft.context);
    setInsight(draft.guidance + (draft.reflection ? `\n\n[오늘의 나의 각인]\n${draft.reflection}` : ''));
    setBookTitle(draft.suggestedBook);
    setSelectedEmotions(draft.suggestedEmotions);
    setSelectedTags(draft.suggestedTags);
  };

  const handleConsecrate = () => {
    if (!fact.trim() || !insight.trim()) {
      alert('사건(Fact)과 깨달음(Insight)을 모두 작성해 주세요.');
      return;
    }

    const finalBook = customBookInput.trim() || bookTitle || '지혜의 서';
    const computedReference = `${finalBook} ${chapterNumber}:${verseNumber}`;
    const finalTitle = title.trim() || `${computedReference} - 삶의 통찰`;

    onSave({
      id: editingVerse?.id,
      bookTitle: finalBook,
      chapterNumber,
      verseNumber,
      reference: computedReference,
      title: finalTitle,
      fact: fact.trim(),
      insight: insight.trim(),
      emotions: selectedEmotions,
      tags: selectedTags,
      isSacredFavorite: editingVerse?.isSacredFavorite ?? false
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
        isParchment 
          ? 'bg-[#FAF6EE] border-amber-900/20 text-stone-900' 
          : 'bg-slate-950 border-amber-500/30 text-slate-100'
      }`}>
        {/* Modal Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isParchment ? 'border-amber-900/10 bg-amber-100/50' : 'border-slate-800 bg-slate-900/70'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-950 flex items-center justify-center font-bold">
              <Feather size={16} />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-black tracking-tight">
                {editingVerse ? '경전 구절 수정' : '새 지혜의 구절 봉헌 (Versing)'}
              </h2>
              <p className={`text-[11px] ${isParchment ? 'text-stone-500' : 'text-slate-400'}`}>
                사건(Fact)을 지혜의 구절(Insight)로 승화시키는 성스러운 기록
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${
              isParchment ? 'hover:bg-amber-200/60 text-stone-600' : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Tabs */}
        <div className={`px-5 py-2 border-b flex items-center gap-2 text-xs font-semibold overflow-x-auto ${
          isParchment ? 'border-amber-900/10 bg-amber-50' : 'border-slate-800/80 bg-slate-950'
        }`}>
          <button
            onClick={() => setStep('fact')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              step === 'fact'
                ? isParchment
                  ? 'bg-amber-800 text-white font-bold'
                  : 'bg-amber-500 text-slate-950 font-bold'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <span>1. 사건 직시 (Fact)</span>
            {fact.trim() && <CheckCircle2 size={12} />}
          </button>

          <button
            onClick={() => setStep('insight')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              step === 'insight'
                ? isParchment
                  ? 'bg-amber-800 text-white font-bold'
                  : 'bg-amber-500 text-slate-950 font-bold'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <span>2. 지혜 승화 (Insight)</span>
            {insight.trim() && <CheckCircle2 size={12} />}
          </button>

          <button
            onClick={() => setStep('index')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              step === 'index'
                ? isParchment
                  ? 'bg-amber-800 text-white font-bold'
                  : 'bg-amber-500 text-slate-950 font-bold'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <span>3. 경전 체계화 (Codex)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Step 1: Fact */}
          {step === 'fact' && (
            <div className="space-y-4 animate-fade-in">
              {/* Sync:Echo Shortcut Banner */}
              {!editingVerse && (
                <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  isParchment ? 'bg-amber-100/50 border-amber-800/20' : 'bg-slate-900/80 border-amber-500/20'
                }`}>
                  <div className="flex items-center gap-2 text-xs">
                    <Sparkles size={14} className="text-amber-400 animate-pulse" />
                    <span className="font-semibold">오늘의 프리즘 활동과 루시의 조언을 바로 가져올까요?</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillFromSyncEcho}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition shrink-0"
                  >
                    Sync:Echo 채우기
                  </button>
                </div>
              )}

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${
                  isParchment ? 'text-stone-700' : 'text-slate-300'
                }`}>
                  구절의 서사 제목 (Theme Title)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 폭풍 속에서 발견한 고요, 거절 뒤에 열린 진짜 길"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border transition font-serif ${
                    isParchment
                      ? 'bg-white border-amber-900/20 text-stone-900 focus:border-amber-700'
                      : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-amber-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 flex items-center justify-between ${
                  isParchment ? 'text-stone-700' : 'text-slate-300'
                }`}>
                  <span>사건 (Fact): 일어난 사실과 고통의 원인</span>
                  <span className="text-[10px] font-normal opacity-70">있는 그대로의 솔직한 고백</span>
                </label>
                <textarea
                  rows={5}
                  value={fact}
                  onChange={(e) => setFact(e.target.value)}
                  placeholder="오늘 당신의 세상에 일어난 사건, 겪었던 상처, 불안, 갈등, 혹은 고통스러웠던 순간을 있는 그대로 객관적으로 적어보세요..."
                  className={`w-full p-3.5 rounded-xl text-sm outline-none border leading-relaxed font-sans transition resize-none ${
                    isParchment
                      ? 'bg-white border-amber-900/20 text-stone-900 focus:border-amber-700'
                      : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-amber-500'
                  }`}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep('insight')}
                  disabled={!fact.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 disabled:opacity-40 transition flex items-center gap-1.5 shadow-md"
                >
                  <span>다음: 지혜의 구절로 승화하기</span>
                  <Sparkles size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Insight */}
          {step === 'insight' && (
            <div className="space-y-4 animate-fade-in">
              <div className={`p-3 rounded-xl text-xs ${
                isParchment ? 'bg-amber-100/60 text-stone-700' : 'bg-slate-900/80 text-slate-300'
              }`}>
                <div className="font-bold mb-0.5 text-amber-500">기록한 사건(Fact):</div>
                <div className="line-clamp-2 italic font-sans">{fact || '사건이 아직 기록되지 않았습니다.'}</div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 flex items-center justify-between ${
                  isParchment ? 'text-stone-700' : 'text-slate-300'
                }`}>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Sparkles size={13} />
                    지혜의 구절 (Insight / Transmutation)
                  </span>
                  <span className="text-[10px] font-normal opacity-70">영혼의 원칙과 깨달음</span>
                </label>
                <textarea
                  rows={5}
                  value={insight}
                  onChange={(e) => setInsight(e.target.value)}
                  placeholder="이 사건은 내 삶에 무엇을 가르쳐주기 위해 찾아왔을까요? 고통을 넘어선 내면의 지혜, 성경이나 경전의 구절처럼 울림 있는 원칙으로 승화시켜 적어보세요..."
                  className={`w-full p-3.5 rounded-xl text-sm outline-none border leading-relaxed font-serif font-medium transition resize-none ${
                    isParchment
                      ? 'bg-amber-50/90 border-amber-800/30 text-amber-950 focus:border-amber-800 focus:bg-white'
                      : 'bg-amber-950/20 border-amber-500/40 text-amber-100 focus:border-amber-400 focus:bg-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('fact')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    isParchment ? 'text-stone-600' : 'text-slate-400'
                  }`}
                >
                  이전: 사건 수정
                </button>
                <button
                  type="button"
                  onClick={() => setStep('index')}
                  disabled={!insight.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 disabled:opacity-40 transition flex items-center gap-1.5 shadow-md"
                >
                  <span>다음: 경전 체계화</span>
                  <Layers size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Codex Indexing */}
          {step === 'index' && (
            <div className="space-y-4 animate-fade-in">
              {/* Book & Chapter / Verse Index */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-bold mb-1.5 ${
                    isParchment ? 'text-stone-700' : 'text-slate-300'
                  }`}>
                    봉헌할 경전 (Book of Re:Bible)
                  </label>
                  <select
                    value={bookTitle}
                    onChange={(e) => {
                      setBookTitle(e.target.value);
                      if (e.target.value !== '__custom__') setCustomBookInput('');
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-serif font-bold outline-none border transition ${
                      isParchment
                        ? 'bg-white border-amber-900/20 text-stone-900'
                        : 'bg-slate-900 border-slate-800 text-slate-100'
                    }`}
                  >
                    <option value="각성의 서">각성의 서 (Awakening)</option>
                    <option value="평온의 서">평온의 서 (Serenity)</option>
                    <option value="성장의 서">성장의 서 (Growth)</option>
                    <option value="인연의 서">인연의 서 (Relationship)</option>
                    <option value="창조의 서">창조의 서 (Creation)</option>
                    <option value="풍요의 서">풍요의 서 (Abundance)</option>
                    {existingBooks
                      .filter((b) => !['각성의 서', '평온의 서', '성장의 서', '인연의 서', '창조의 서', '풍요의 서'].includes(b))
                      .map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    <option value="__custom__">+ 새 경전 직접 입력...</option>
                  </select>

                  {bookTitle === '__custom__' && (
                    <input
                      type="text"
                      value={customBookInput}
                      onChange={(e) => setCustomBookInput(e.target.value)}
                      placeholder="경전 이름 (예: 치유의 서, 자유의 서)"
                      className={`w-full mt-2 px-3 py-2 rounded-xl text-xs outline-none border font-serif ${
                        isParchment
                          ? 'bg-white border-amber-900/20 text-stone-900'
                          : 'bg-slate-900 border-slate-800 text-slate-100'
                      }`}
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={`block text-xs font-bold mb-1.5 ${
                      isParchment ? 'text-stone-700' : 'text-slate-300'
                    }`}>
                      장 (Ch)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={chapterNumber}
                      onChange={(e) => setChapterNumber(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-center outline-none border ${
                        isParchment ? 'bg-white border-amber-900/20' : 'bg-slate-900 border-slate-800'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <label className={`block text-xs font-bold mb-1.5 ${
                      isParchment ? 'text-stone-700' : 'text-slate-300'
                    }`}>
                      절 (V)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={verseNumber}
                      onChange={(e) => setVerseNumber(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-center outline-none border ${
                        isParchment ? 'bg-white border-amber-900/20' : 'bg-slate-900 border-slate-800'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Emotions Keywords */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 flex items-center gap-1.5 ${
                  isParchment ? 'text-stone-700' : 'text-slate-300'
                }`}>
                  <Heart size={12} className="text-rose-400" />
                  <span>감정 키워드 (Emotions)</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {DEFAULT_EMOTION_PRESETS.map((em) => {
                    const isSelected = selectedEmotions.includes(em);
                    return (
                      <button
                        key={em}
                        type="button"
                        onClick={() => handleToggleEmotion(em)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                          isSelected
                            ? isParchment
                              ? 'bg-amber-900 text-white font-bold border-amber-900'
                              : 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                            : isParchment
                            ? 'bg-stone-200/60 border-stone-300 text-stone-700'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        {em}
                      </button>
                    );
                  })}
                </div>
                <form onSubmit={handleAddCustomEmotion} className="flex gap-1.5">
                  <input
                    type="text"
                    value={customEmotion}
                    onChange={(e) => setCustomEmotion(e.target.value)}
                    placeholder="직접 입력 후 Enter (예: 서운함, 전율)"
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs outline-none border ${
                      isParchment ? 'bg-white border-amber-900/20' : 'bg-slate-900 border-slate-800'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  >
                    추가
                  </button>
                </form>
              </div>

              {/* Topic Tags */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 flex items-center gap-1.5 ${
                  isParchment ? 'text-stone-700' : 'text-slate-300'
                }`}>
                  <Tag size={12} className="text-amber-400" />
                  <span>라이프 테마 태그 (Tags)</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {DEFAULT_TAG_PRESETS.map((tg) => {
                    const isSelected = selectedTags.includes(tg);
                    return (
                      <button
                        key={tg}
                        type="button"
                        onClick={() => handleToggleTag(tg)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                          isSelected
                            ? isParchment
                              ? 'bg-amber-800 text-white font-bold border-amber-800'
                              : 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                            : isParchment
                            ? 'bg-stone-200/60 border-stone-300 text-stone-700'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        #{tg}
                      </button>
                    );
                  })}
                </div>
                <form onSubmit={handleAddCustomTag} className="flex gap-1.5">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="태그 직접 입력 후 Enter (예: 마음챙김, 휴식)"
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs outline-none border ${
                      isParchment ? 'bg-white border-amber-900/20' : 'bg-slate-900 border-slate-800'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  >
                    추가
                  </button>
                </form>
              </div>

              {/* Final Consecration Action */}
              <div className="pt-3 border-t flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('insight')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    isParchment ? 'text-stone-600' : 'text-slate-400'
                  }`}
                >
                  이전: 지혜 수정
                </button>

                <button
                  type="button"
                  onClick={handleConsecrate}
                  className="px-6 py-2.5 rounded-2xl text-sm font-black bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-lg hover:shadow-amber-500/30 hover:brightness-105 active:scale-95 transition flex items-center gap-2"
                >
                  <BookOpen size={16} className="stroke-[2.5]" />
                  <span>{editingVerse ? '구절 수정 완료' : '내 인생 경전으로 봉헌하기'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
