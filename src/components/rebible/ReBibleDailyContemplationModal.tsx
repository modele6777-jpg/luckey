import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Compass, 
  RefreshCw, 
  BookMarked, 
  MessageSquarePlus, 
  ArrowRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ReBibleVerse, SacredAtmosphere } from '../../types/rebible';
import { cleanFactText } from '../../lib/rebibleStorage';
import { playTTS, stopTTS } from '../../utils/tts';

interface ReBibleDailyContemplationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verses: ReBibleVerse[];
  atmosphere: SacredAtmosphere;
  onOpenAnnotation: (verse: ReBibleVerse) => void;
}

export const ReBibleDailyContemplationModal: React.FC<ReBibleDailyContemplationModalProps> = ({
  isOpen,
  onClose,
  verses,
  atmosphere,
  onOpenAnnotation
}) => {
  const [selectedVerse, setSelectedVerse] = useState<ReBibleVerse | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (isOpen && verses.length > 0) {
      // Pick a random verse
      const randomIndex = Math.floor(Math.random() * verses.length);
      setSelectedVerse(verses[randomIndex]);
    }
  }, [isOpen, verses]);

  if (!isOpen) return null;

  const isParchment = atmosphere === 'parchment';

  const handlePickAnother = () => {
    if (verses.length <= 1) return;
    let nextIndex = Math.floor(Math.random() * verses.length);
    if (selectedVerse && verses[nextIndex].id === selectedVerse.id) {
      nextIndex = (nextIndex + 1) % verses.length;
    }
    setSelectedVerse(verses[nextIndex]);
  };

  const handleToggleRecitation = async () => {
    if (!selectedVerse) return;
    if (isPlayingAudio) {
      stopTTS();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const cleanedFact = cleanFactText(selectedVerse.fact);
    const recitationScript = `${selectedVerse.reference}. ${selectedVerse.title}. 사건. ${cleanedFact}. 지혜의 구절. ${selectedVerse.insight}.`;
    
    try {
      await playTTS(recitationScript, 'Kore', true);
    } catch (e) {
      console.warn('TTS ended:', e);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-xl flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
        isParchment 
          ? 'bg-[#FAF6EE] border-amber-900/20 text-stone-900' 
          : 'bg-slate-950 border-amber-500/30 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isParchment ? 'border-amber-900/10 bg-amber-100/50' : 'border-slate-800 bg-slate-900/70'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold animate-spin-slow">
              <Compass size={18} />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-black tracking-tight">
                오늘의 경전 소환 (Daily Sanctuary)
              </h2>
              <p className={`text-[11px] ${isParchment ? 'text-stone-500' : 'text-slate-400'}`}>
                과거의 나를 오늘의 지혜로 다시 만나는 영적 묵상의 시간
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePickAnother}
              disabled={verses.length <= 1}
              className={`p-1.5 rounded-lg transition ${
                isParchment ? 'hover:bg-amber-200/60 text-stone-600' : 'hover:bg-white/10 text-slate-400'
              }`}
              title="다른 구절 소환"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition ${
                isParchment ? 'hover:bg-amber-200/60 text-stone-600' : 'hover:bg-white/10 text-slate-400'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {selectedVerse ? (
            <div className="space-y-4">
              {/* Verse Reference & Title */}
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-1 rounded-full font-serif text-xs font-bold ${
                  isParchment ? 'bg-amber-900 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {selectedVerse.reference}
                </span>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono ${isParchment ? 'text-stone-500' : 'text-slate-400'}`}>
                    기록일: {new Date(selectedVerse.recordedAt).toLocaleDateString('ko-KR')}
                  </span>
                  <button
                    onClick={handleToggleRecitation}
                    className={`p-1 rounded-lg ${
                      isPlayingAudio ? 'bg-amber-500 text-slate-950' : 'text-amber-500'
                    }`}
                  >
                    {isPlayingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
              </div>

              <h3 className="font-serif text-lg font-bold tracking-tight">
                {selectedVerse.title}
              </h3>

              {/* Fact Card */}
              <div className={`p-3.5 rounded-xl border ${
                isParchment ? 'bg-amber-100/30 border-amber-900/10 text-stone-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-stone-500">
                  그 당시의 사건 (Fact)
                </div>
                <p className="text-xs leading-relaxed font-sans">
                  {cleanFactText(selectedVerse.fact)}
                </p>
              </div>

              {/* Insight Card */}
              <div className={`p-4 rounded-xl border relative ${
                isParchment
                  ? 'bg-amber-100/70 border-amber-800/30'
                  : 'bg-amber-950/20 border-amber-500/30'
              }`}>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5">
                  <Sparkles size={11} />
                  <span>새겨진 지혜의 구절 (Insight)</span>
                </div>
                <p className={`text-sm font-serif font-medium leading-relaxed italic ${
                  isParchment ? '!text-amber-950 font-semibold' : 'text-amber-100'
                }`}>
                  "{selectedVerse.insight}"
                </p>
              </div>

              {/* Contemplation Prompt Box */}
              <div className={`p-4 rounded-2xl border text-xs text-center space-y-2 ${
                isParchment
                  ? 'bg-amber-200/40 border-amber-800/20 text-amber-950'
                  : 'bg-slate-900/90 border-amber-500/20 text-slate-200'
              }`}>
                <p className="font-semibold text-amber-500">
                  🕯️ 오늘의 당신에게 질문을 던집니다
                </p>
                <p className="leading-relaxed opacity-90">
                  "그날 이후 당신의 삶은 어떻게 흘러왔나요? 그 깨달음은 지금도 유효한가요, 아니면 더 깊고 넓은 사랑과 자유의 시선으로 확장되었나요?"
                </p>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAnnotation(selectedVerse);
                  }}
                  className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <MessageSquarePlus size={16} />
                  <span>오늘의 새로운 주석(Annotation) 달기</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!selectedVerse) return;
                    try {
                      const prompt = `루시야, 오늘 소환된 내 인생 경전 [${selectedVerse.reference} ${selectedVerse.title}]에 대해 묵상하며 상담하고 싶어.\n\n📖 [기록된 사건/여정]\n${cleanFactText(selectedVerse.fact)}\n\n✨ [루시의 관점 · 지혜의 구절]\n${selectedVerse.insight}\n\n과거의 이 깨달음이 지금의 나에게 주는 의미와, 앞으로 더 확장해 나갈 지혜에 대해 따뜻한 조언을 해줘.`;
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
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl text-xs font-bold border border-amber-500/50 bg-amber-500/15 text-amber-950 hover:bg-amber-500/30 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Sparkles size={14} className="fill-amber-400 text-amber-700 animate-pulse" />
                  <span>루시와 심층 상담하기</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs opacity-60">
              아직 봉헌된 경전 구절이 없습니다. 먼저 새 구절을 기록해 보세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
