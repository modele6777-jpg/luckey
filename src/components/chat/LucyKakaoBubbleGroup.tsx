import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Loader2, Volume2, VolumeX } from 'lucide-react';
import { LucyProTypewriter } from '@/components/LucyProTypewriter';
import { splitIntoKakaoBubbles, joinKakaoBubblesForTTS } from '@/lib/lucyChatUtils';
import { cleanSentenceForMatching, isSentenceActive } from '@/components/common/TTSHighlightedText';
import { detectTarotCardsFromText, stripTarotMarkers } from '@/utils/tarotDetector';
import { LucyTarotCardView } from './LucyTarotCardView';

// 이미 순차 노출이 완료된 메시지 ID를 메모리에 기록해 리렌더 시 재애니메이션 방지
const revealedMessageIds = new Set<string>();

export function markMessageBubblesRevealed(msgId: string) {
  if (msgId) revealedMessageIds.add(msgId);
}

interface LucyKakaoBubbleGroupProps {
  msgId: string;
  textContent: string;
  verifiedTarotMarkers?: string;
  revealedTarotCardIds?: string[];
  onRevealTarotCard?: (cardId: string) => void;
  isLatest: boolean;
  isGenerating: boolean;
  isHistorical: boolean;
  isLight: boolean;
  variant?: 'standalone' | 'drawer';
  theme?: 'default' | 'starlight';
  playingMsgId?: string | null;
  ttsInfo?: {
    isSpeaking: boolean;
    isLoading: boolean;
    activeText: string | null;
    activeSentence?: string | null;
  };
  copiedId?: string | null;
  onCopy?: (id: string, text: string) => void;
  onVoicePlay?: (id: string, text: string, voice?: string) => void;
  onBubbleReveal?: () => void;
  renderRecommendationFooter?: () => React.ReactNode;
}

export function LucyKakaoBubbleGroup({
  msgId,
  textContent,
  verifiedTarotMarkers,
  revealedTarotCardIds,
  onRevealTarotCard,
  isLatest,
  isGenerating,
  isHistorical,
  isLight,
  variant = 'standalone',
  theme = 'default',
  playingMsgId,
  ttsInfo,
  copiedId,
  onCopy,
  onVoicePlay,
  onBubbleReveal,
  renderRecommendationFooter,
}: LucyKakaoBubbleGroupProps) {
  const cleanedTextContent = useMemo(() => stripTarotMarkers(textContent), [textContent]);
  const detectedTarotCards = useMemo(() => detectTarotCardsFromText(verifiedTarotMarkers || textContent), [verifiedTarotMarkers, textContent]);
  const bubbles = useMemo(() => splitIntoKakaoBubbles(cleanedTextContent, 4), [cleanedTextContent]);
  const fullJoinedSpeechText = useMemo(() => joinKakaoBubblesForTTS(cleanedTextContent, 4), [cleanedTextContent]);

  // 과거 메시지이거나 이미 노출 완료된 메시지는 즉시 전체 말풍선 표시
  const shouldSkipStagger = isHistorical || !isLatest || revealedMessageIds.has(msgId);

  const [visibleCount, setVisibleCount] = useState<number>(() => {
    if (shouldSkipStagger) {
      if (msgId && !isGenerating) revealedMessageIds.add(msgId);
      return Math.max(1, bubbles.length);
    }
    // 스트리밍 시작 직후 첫 말풍선이 완성되기 전에는 0개에서 시작
    if (isGenerating) {
      const hasParagraphBreak = /\n{2,}/.test(textContent);
      return hasParagraphBreak || textContent.length >= 110 ? 1 : 0;
    }
    return 1;
  });

  const prevVisibleCountRef = useRef(visibleCount);

  useEffect(() => {
    if (shouldSkipStagger) {
      if (!isGenerating && bubbles.length > 0) {
        revealedMessageIds.add(msgId);
      }
      setVisibleCount(bubbles.length);
      return;
    }

    // 1. 스트리밍 진행 중일 때: 첫 번째 단락(\n\n)이 완성되면 첫 번째 말풍선을 먼저 톡! 띄움
    if (isGenerating) {
      const hasParagraphBreak = /\n{2,}/.test(textContent);
      if ((hasParagraphBreak || textContent.length >= 110) && visibleCount < 1 && bubbles.length >= 1) {
        setVisibleCount(1);
      }
      return;
    }

    // 2. 스트리밍이 완료된 직후: 최소 1번째 말풍선은 즉시 노출
    if (visibleCount === 0 && bubbles.length >= 1) {
      setVisibleCount(1);
      return;
    }

    // 3. 2~4번째 말풍선을 짧은 카톡 간격(380ms)으로 순차 전송 연출
    if (visibleCount < bubbles.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => {
          const next = Math.min(bubbles.length, prev + 1);
          if (next >= bubbles.length) {
            revealedMessageIds.add(msgId);
          }
          return next;
        });
      }, 380);
      return () => clearTimeout(timer);
    } else if (bubbles.length > 0) {
      revealedMessageIds.add(msgId);
    }
  }, [bubbles.length, isGenerating, msgId, shouldSkipStagger, textContent, visibleCount]);

  // 새 말풍선이 순차 팝업될 때마다 스크롤 하단 정렬 이벤트 트리거
  useEffect(() => {
    if (visibleCount > prevVisibleCountRef.current) {
      prevVisibleCountRef.current = visibleCount;
      onBubbleReveal?.();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lucy-chat-content-resized'));
      }
    }
  }, [visibleCount, onBubbleReveal]);

  // 현재 TTS가 이 메시지 그룹을 읽고 있을 때 감지 (ID 일치 또는 활성 발화문 포함 검사)
  const isThisMsgPlaying = useMemo(() => {
    const isSpeakingOrLoading = Boolean(ttsInfo?.isSpeaking || ttsInfo?.isLoading);
    if (!isSpeakingOrLoading) return false;
    // playingMsgId가 명시적으로 주어진 경우 해당 ID와 엄격 일치 여부만 신뢰 (다른 메시지로의 오염 방지)
    if (playingMsgId) {
      return String(playingMsgId) === String(msgId);
    }

    // Fallback: playingMsgId가 비어있을 때만 현재 읽는 중인 텍스트가 이 메시지의 내용에 포함되어 있는지 확인
    const activeCandidate = ttsInfo?.activeSentence || ttsInfo?.activeText;
    if (activeCandidate) {
      const cleanMsg = cleanSentenceForMatching(textContent);
      const cleanActive = cleanSentenceForMatching(activeCandidate);
      if (cleanActive && cleanMsg.includes(cleanActive)) {
        return true;
      }
      return isSentenceActive(textContent, activeCandidate);
    }
    return false;
  }, [playingMsgId, msgId, ttsInfo?.isSpeaking, ttsInfo?.isLoading, ttsInfo?.activeSentence, ttsInfo?.activeText, textContent]);

  const activeSpeakingBubbleIdx = useMemo(() => {
    if (!isThisMsgPlaying) return -1;
    if (bubbles.length <= 1) return 0;
    if (ttsInfo?.isLoading) return 0;

    const activeCandidate = ttsInfo?.activeSentence || ttsInfo?.activeText;
    if (!activeCandidate) return 0;

    const cleanActive = cleanSentenceForMatching(activeCandidate);
    if (cleanActive && cleanActive.length >= 2) {
      // 1차: 말풍선 텍스트에 cleanActive가 직접 포함되는지 확인
      for (let i = 0; i < bubbles.length; i++) {
        const cleanBubble = cleanSentenceForMatching(bubbles[i]);
        if (cleanBubble.includes(cleanActive)) {
          return i;
        }
      }

      // 2차: 말풍선 내의 문장 단위 일치 검사
      for (let i = 0; i < bubbles.length; i++) {
        if (isSentenceActive(bubbles[i], activeCandidate)) {
          return i;
        }
      }
    }
    return 0;
  }, [bubbles, isThisMsgPlaying, ttsInfo?.activeSentence, ttsInfo?.activeText, ttsInfo?.isLoading]);

  const isTarotLocked = Boolean(verifiedTarotMarkers) && detectedTarotCards.some(card => !revealedTarotCardIds?.includes(card.id));
  const displayedBubbles = isTarotLocked ? [] : shouldSkipStagger
    ? bubbles
    : bubbles.slice(0, Math.min(visibleCount, bubbles.length));

  const isStaggeringMoreBubbles =
    !shouldSkipStagger && (isGenerating || visibleCount < bubbles.length);

  if (bubbles.length === 0 && detectedTarotCards.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 sm:gap-2.5 w-full min-w-0 max-w-full">
      {/* Show drawn cards before the reading, including while text is streaming. */}
      {detectedTarotCards.length > 0 && (
        <LucyTarotCardView cards={detectedTarotCards} isLight={isLight} verifiedDraw={Boolean(verifiedTarotMarkers)} revealedCardIds={revealedTarotCardIds} onRevealCard={onRevealTarotCard} />
      )}
      {isTarotLocked && <p className={`text-xs px-1 ${isLight ? 'text-slate-600' : 'text-white/70'}`} role="status">카드를 모두 열면 루시의 해설이 나타나요.</p>}
      <AnimatePresence initial={false}>
        {displayedBubbles.map((bubbleText, bIdx) => {
          const isFirstBubble = bIdx === 0;
          const isLastBubble = bIdx === bubbles.length - 1;
          const isBubbleSpeaking = isThisMsgPlaying && (bubbles.length === 1 || activeSpeakingBubbleIdx === bIdx);
          const bubbleCopyId = `${msgId}-b-${bIdx}`;

          const bubbleSurfaceClass =
            variant === 'drawer'
              ? `bg-white/[0.04] border ${
                  isBubbleSpeaking
                    ? 'border-amber-400/70 ring-1 ring-amber-400/40'
                    : 'border-white/10 hover:border-white/20'
                } text-white/95 ${isFirstBubble ? 'rounded-3xl rounded-tl-xs' : 'rounded-3xl rounded-tl-md'} shadow-md`
              : isLight
              ? `lucy-assistant-bubble bg-white backdrop-blur-md border ${
                  isBubbleSpeaking
                    ? 'border-amber-400 ring-2 ring-amber-300/50'
                    : 'border-amber-200/90'
                } text-slate-800 ${
                  isFirstBubble ? 'rounded-2xl sm:rounded-3xl rounded-tl-xs' : 'rounded-2xl sm:rounded-3xl rounded-tl-md'
                } shadow-[0_4px_20px_rgba(140,110,80,0.08)] font-sans`
              : `bg-slate-900/88 backdrop-blur-md border ${
                  isBubbleSpeaking
                    ? 'border-amber-400/80 ring-2 ring-amber-400/35'
                    : 'border-white/15'
                } text-white ${
                  isFirstBubble ? 'rounded-2xl sm:rounded-3xl rounded-tl-xs' : 'rounded-2xl sm:rounded-3xl rounded-tl-md'
                } shadow-[0_6px_28px_rgba(0,0,0,0.45)] font-sans`;

          return (
            <motion.div
              key={`${msgId}-bubble-${bIdx}`}
              initial={shouldSkipStagger ? false : { opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-end gap-1.5 min-w-0 max-w-full group/bubble"
            >
              <div
                data-forward-bubble
                className={`p-3.5 sm:p-4.5 text-sm sm:text-[15px] lg:text-base leading-relaxed select-text min-w-0 max-w-full overflow-x-hidden break-words [overflow-wrap:anywhere] transition-all duration-300 ${isLastBubble && renderRecommendationFooter ? 'flex-1 w-full' : ''} ${bubbleSurfaceClass} ${theme === 'starlight' ? 'lucy-starlight-assistant' : ''}`}
                style={
                  variant === 'standalone' && theme !== 'starlight'
                    ? {
                        backgroundColor: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.92)',
                        color: isLight ? '#1e293b' : '#ffffff',
                      }
                    : undefined
                }
              >
                {/* 다중 말풍선일 때 현재 낭독 중인 말풍선 표시 */}
                {isBubbleSpeaking && bubbles.length > 1 && (
                  <div className="flex items-center gap-1 mb-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-300">
                    <Volume2 size={11} className="animate-pulse shrink-0" />
                    <span>
                      말풍선 {bIdx + 1}/{bubbles.length} 연속 낭독 중
                    </span>
                  </div>
                )}

                <LucyProTypewriter
                  content={bubbleText}
                  isLatest={isLatest && isLastBubble}
                  isGenerating={false}
                  instantReveal={true}
                  enableTTSHighlight={isBubbleSpeaking}
                />

                {/* 전문 모드 추천 채널 & Key 실천 도약 바는 마지막 말풍선 하단에 1회만 깔끔하게 표시 */}
                {isLastBubble && !isStaggeringMoreBubbles && renderRecommendationFooter && (
                  <>{renderRecommendationFooter()}</>
                )}
              </div>

              {/* 다중 말풍선일 때 각 말풍선 우측에 카톡 스타일 순번/개별 복사·이어듣기 미니 버튼 제공 */}
              {bubbles.length > 1 && onVoicePlay && onCopy && (
                <div className="flex flex-col items-start gap-0.5 shrink-0 pb-0.5 opacity-60 group-hover/bubble:opacity-100 transition-opacity">
                  <span
                    className={`text-[9px] font-mono tabular-nums px-1 select-none ${
                      variant === 'drawer' || !isLight ? 'text-white/45' : 'text-slate-400'
                    }`}
                  >
                    {bIdx + 1}/{bubbles.length}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => onCopy(bubbleCopyId, bubbleText)}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        variant === 'drawer' || !isLight
                          ? 'text-white/50 hover:text-white hover:bg-white/10'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title={`이 말풍선(${bIdx + 1}/${bubbles.length})만 복사`}
                    >
                      {copiedId === bubbleCopyId ? (
                        <Check size={11} className="text-emerald-500" />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* 카톡식 연속 말풍선 입력 중 인디케이터 (다음 말풍선이 순차 전송되는 동안 표시) */}
      {isStaggeringMoreBubbles && displayedBubbles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className={`flex items-center gap-2 px-3.5 py-2 border rounded-2xl rounded-tl-xs w-fit shadow-2xs ${
            variant === 'drawer' || !isLight
              ? 'bg-slate-900/90 border-emerald-500/30 text-emerald-200'
              : 'bg-[#fffdf9]/95 border-emerald-200/80 text-emerald-950'
          }`}
        >
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-100" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-200" />
          </div>
          <span className="text-[11px] font-semibold">
            루시가 이어서 카톡을 입력하고 있어... ({displayedBubbles.length}/{Math.max(2, bubbles.length)})
          </span>
        </motion.div>
      )}

      {/* 하단 통합 액션 바: 전체 말풍선 복사 & 전체 말풍선 한 번에 연속 듣기 */}
      {!isTarotLocked && !isStaggeringMoreBubbles && onCopy && onVoicePlay && (
        <div className="flex items-center gap-1.5 mt-0.5 pl-1 flex-wrap">
          <button
            type="button"
            onClick={() => onCopy(msgId, fullJoinedSpeechText)}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium ${
              variant === 'drawer' || !isLight
                ? 'text-white/65 hover:text-white hover:bg-white/10'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title={bubbles.length > 1 ? '전체 말풍선 한 번에 복사' : '복사'}
          >
            {copiedId === msgId ? (
              <>
                <Check size={13} className="text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">복사됨</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                {bubbles.length > 1 && <span>전체 복사</span>}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              onVoicePlay(
                msgId,
                fullJoinedSpeechText,
                'Aoede'
              )
            }
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium ${
              isThisMsgPlaying
                ? 'text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 font-bold'
                : variant === 'drawer' || !isLight
                ? 'text-white/65 hover:text-amber-300 hover:bg-white/10'
                : 'text-slate-500 hover:text-amber-700 hover:bg-slate-100'
            }`}
            title={
              isThisMsgPlaying && ttsInfo?.isLoading
                ? '음성 준비 중...'
                : isThisMsgPlaying && ttsInfo?.isSpeaking
                ? '음성 멈추기'
                : bubbles.length > 1
                ? `${bubbles.length}개 말풍선 한 번에 연속 듣기`
                : '음성으로 듣기'
            }
          >
            {isThisMsgPlaying && ttsInfo?.isLoading ? (
              <>
                <Loader2 size={13} className="animate-spin text-amber-600" />
                <span>준비 중...</span>
              </>
            ) : isThisMsgPlaying && ttsInfo?.isSpeaking ? (
              <>
                <VolumeX size={13} className="animate-pulse" />
                <span>
                  {bubbles.length > 1
                    ? `연속 낭독 중 (${activeSpeakingBubbleIdx + 1}/${bubbles.length})`
                    : '낭독 중지'}
                </span>
              </>
            ) : (
              <>
                <Volume2 size={13} />
                {bubbles.length > 1 && <span>{bubbles.length}개 말풍선 연속 듣기</span>}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
