import React, { useState } from 'react';
import { X, History, MessageSquarePlus, Clock, Sparkles, BookOpen } from 'lucide-react';
import { ReBibleVerse } from '../../types/rebible';
import { cleanFactText } from '../../lib/rebibleStorage';

interface ReBibleAnnotationModalProps {
  verse: ReBibleVerse | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveAnnotation: (verseId: string, annotationData: { timeHorizon: string; content: string; shiftSummary?: string }) => void;
}

export const ReBibleAnnotationModal: React.FC<ReBibleAnnotationModalProps> = ({
  verse,
  isOpen,
  onClose,
  onSaveAnnotation
}) => {
  const [content, setContent] = useState('');

  if (!isOpen || !verse) return null;

  const originalDate = new Date(verse.recordedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const existingAnnotations = verse.annotations || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('성찰 내용을 입력해 주세요.');
      return;
    }

    onSaveAnnotation(verse.id, {
      timeHorizon: '오늘의 성찰',
      content: content.trim(),
    });

    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl my-auto flex flex-col rounded-3xl border border-[#D8C6A5] bg-[#FAF6EE] text-stone-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8DFC8] bg-[#F4EDE0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#4A321F] text-[#FAF5EB] flex items-center justify-center font-bold shadow-xs">
              <History size={16} />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold tracking-tight text-stone-900 flex items-center gap-2">
                <span>시간의 성찰 주석 (Q&A 3년 다이어리)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EADDC6] text-[#3D2812] border border-[#D8C7A9]">
                  3-Year Living Record
                </span>
              </h2>
              <p className="text-[11px] text-stone-600">
                과거 그날의 나와 지금의 내가 만나는 성찰의 장록
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition hover:bg-[#EAE0CD] text-stone-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
          {/* Q&A 3-Year Comparison Chronicle Frame (과거 기록 회상창) */}
          <div className="rounded-2xl border-2 border-[#D8C29D] bg-gradient-to-b from-[#F7EFE1] to-[#F2E7D3] p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E4D5BC] pb-2">
              <div className="flex items-center gap-1.5 text-[#854D0E] font-serif font-bold text-xs sm:text-sm">
                <BookOpen size={14} className="stroke-[2.5]" />
                <span>[과거 기록 회상] {verse.reference} 《{verse.title}》</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-stone-600 bg-[#E8DCB8] px-2 py-0.5 rounded-md">
                원문 기록일: {originalDate}
              </span>
            </div>

            {/* Fact & Insight Chronicle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-[#FCFAF5]/90 border border-[#DFCDB2]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#63482F] mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D4F]" />
                  <span>그날의 사건 및 여정 (Fact)</span>
                </div>
                <p className="font-sans text-stone-800 line-clamp-4">
                  {cleanFactText(verse.fact)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#EFE3CA] border border-[#D5BE93]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#854D0E] mb-1 flex items-center gap-1">
                  <span>✨</span>
                  <span>루시의 관점 · 지혜의 구절 (Insight)</span>
                  <Sparkles size={11} className="fill-[#854D0E]" />
                </div>
                <p className="font-serif font-semibold text-[#291707] line-clamp-4">
                  "{verse.insight}"
                </p>
              </div>
            </div>

            {/* Existing Multi-Year Layers (1년차, 2년차, 3년차 주석이 이미 있다면 표시) */}
            {existingAnnotations.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#E4D5BC] space-y-1.5">
                <div className="text-[10px] font-bold text-stone-600 flex items-center gap-1">
                  <Clock size={11} className="text-[#854D0E]" />
                  <span>이전에 누적된 시간별 성찰 ({existingAnnotations.length}건)</span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar">
                  {existingAnnotations.map((annot) => (
                    <div key={annot.id} className="p-2.5 rounded-lg bg-[#FCFAF5]/80 border border-[#DFCDB2] text-[11px] text-stone-800 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold">
                        <span className="text-[#854D0E] bg-[#EBE0CD] px-1.5 py-0.2 rounded">
                          {annot.timeHorizon}
                        </span>
                        <span className="font-mono">
                          {new Date(annot.writtenAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <p className="leading-snug">{annot.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content TextArea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span>과거의 나를 마주하며 남기는 오늘의 새로운 성찰</span>
              <span className="text-[10px] text-stone-500 font-normal">시간이 흘러 바라보는 나의 마음</span>
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="과거 그날의 나에게 건네고 싶은 말이나, 시간이 흐른 지금 비로소 깨닫게 된 새로운 의미와 감사를 자유롭게 적어보세요..."
              className="w-full p-3.5 rounded-2xl border border-[#DFCDB2] bg-[#FCFAF5] text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#854D0E] leading-relaxed transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8DFC8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-[#EAE0CD] transition cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#4A321F] text-[#FAF5EB] hover:bg-[#382515] transition shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <MessageSquarePlus size={14} />
              <span>성찰 주석 봉헌</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
