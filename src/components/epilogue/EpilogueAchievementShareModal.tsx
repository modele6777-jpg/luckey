import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  Users,
  Heart,
  Flame,
  Award,
  BookOpen,
  Calendar,
  Send,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import { EpilogueAchievementReportCard } from './EpilogueAchievementReportCard';
import type { EpilogueAchievementStats, EpilogueCommunityPost } from '@/types/epilogueAchievement';
import { fetchCommunityPosts, shareAchievementToCommunity, cheerCommunityPost } from '@/lib/epilogueCommunity';
import { downloadImage } from '@/components/ImageOutputActions';
import { useApp } from '@/contexts/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: EpilogueAchievementStats;
}

export function EpilogueAchievementShareModal({ isOpen, onClose, stats }: Props) {
  const { firebaseUser } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'card' | 'feed'>('card');
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderingError, setRenderingError] = useState<string | null>(null);

  // Sharing states
  const [isSharingToCommunity, setIsSharingToCommunity] = useState<boolean>(false);
  const [sharedSuccess, setSharedSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Community feed
  const [communityPosts, setCommunityPosts] = useState<EpilogueCommunityPost[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(false);
  const [cheeredPostIds, setCheeredPostIds] = useState<Set<string>>(new Set());

  // Render card to image whenever modal opens or stats change
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsRendering(true);
    setRenderingError(null);

    const generateImage = async () => {
      // Small timeout to allow DOM to layout
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (!cardRef.current || !isMounted) return;

      try {
        const dataUrl = await toPng(cardRef.current, {
          quality: 0.96,
          pixelRatio: 2,
          cacheBust: true,
          style: {
            transform: 'none',
          },
        });
        if (isMounted) {
          setRenderedImageUrl(dataUrl);
          setIsRendering(false);
        }
      } catch (err: any) {
        console.error('[EpilogueAchievement] toPng render error:', err);
        if (isMounted) {
          setRenderingError('이미지 렌더링 중 문제가 발생했습니다. 브라우저 인쇄/캡처 또는 텍스트 복사를 이용하실 수 있습니다.');
          setIsRendering(false);
        }
      }
    };

    generateImage();

    return () => {
      isMounted = false;
    };
  }, [isOpen, stats]);

  // Load community feed
  const loadFeed = async () => {
    setIsLoadingFeed(true);
    try {
      const posts = await fetchCommunityPosts();
      setCommunityPosts(posts);
    } catch (e) {
      console.warn('Feed load failed:', e);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'feed') {
      loadFeed();
    }
  }, [isOpen, activeTab]);

  // 1. Share to Community Feed
  const handleShareToCommunity = async () => {
    if (isSharingToCommunity) return;
    setIsSharingToCommunity(true);

    const newPost: EpilogueCommunityPost = {
      id: `comm-post-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: firebaseUser?.uid || 'guest-traveler',
      userName: firebaseUser?.displayName || stats.userName || '빛나는 여행자',
      userPhotoURL: firebaseUser?.photoURL || undefined,
      dateKey: stats.todayDateKey,
      streakDays: stats.streakDays,
      totalDiaries: stats.totalDiaries,
      totalGratitudes: stats.totalGratitudes,
      topMood: stats.topMood,
      topMoodEmoji: stats.topMoodEmoji,
      soulEvolutionLevel: stats.soulEvolutionLevel,
      mindDiarySnippet: stats.todayQuote,
      imageData: renderedImageUrl || undefined,
      cheersCount: 1,
      sharedAt: new Date().toISOString(),
    };

    try {
      await shareAchievementToCommunity(newPost);
      setSharedSuccess(true);
      setTimeout(() => {
        setSharedSuccess(false);
        setActiveTab('feed');
        loadFeed();
      }, 1200);
    } catch (err) {
      console.error('Community share failed:', err);
    } finally {
      setIsSharingToCommunity(false);
    }
  };

  // 2. Download Image File
  const handleDownloadImage = async () => {
    if (!renderedImageUrl) return;
    const filename = `luckey-epilogue-achievement-${stats.todayDateKey}`;
    await downloadImage(renderedImageUrl, filename);
  };

  // 3. Copy Summary / Image
  const handleCopySummary = async () => {
    const textToCopy = `🌌 [LUCKEY • 에필로그 영혼 성취 리포트]\n📅 날짜: ${stats.todayDateKey}\n✨ 등급: ${stats.soulEvolutionLevel}\n🔥 연속 성찰: ${stats.streakDays}일 연속\n📖 누적 성찰 다이어리: ${stats.totalDiaries}편\n💖 감사한 일: ${stats.totalGratitudes}가지\n🧘 대표 무드: ${stats.topMoodEmoji} ${stats.topMood}\n\n"${stats.todayQuote}"\n\n#LucKey #에필로그 #소울다이어리 #마음성찰`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch (_) {
      // fallback
    }
  };

  // 4. Web Share API
  const handleWebShare = async () => {
    if (!navigator.share) {
      handleCopySummary();
      return;
    }

    try {
      if (renderedImageUrl && navigator.canShare) {
        const response = await fetch(renderedImageUrl);
        const blob = await response.blob();
        const file = new File([blob], `epilogue-achievement-${stats.todayDateKey}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'LUCKEY 에필로그 성취 통계 리포트',
            text: `오늘 하루의 성찰과 감사를 담은 영혼 성취 리포트입니다. (연속 ${stats.streakDays}일 성찰)`,
            files: [file],
          });
          return;
        }
      }

      await navigator.share({
        title: 'LUCKEY 에필로그 성취 통계 리포트',
        text: `🌌 [LUCKEY 에필로그 성취 리포트]\n연속 ${stats.streakDays}일 성찰 달성! ✨ ${stats.soulEvolutionLevel}\n"${stats.todayQuote}"`,
        url: window.location.href,
      });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        handleCopySummary();
      }
    }
  };

  // Cheer action
  const handleCheer = async (postId: string) => {
    if (cheeredPostIds.has(postId)) return;
    setCheeredPostIds((prev) => new Set([...prev, postId]));
    const nextCount = await cheerCommunityPost(postId);
    setCommunityPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, cheersCount: nextCount } : p))
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 overflow-y-auto no-scrollbar bg-black/85 backdrop-blur-xl">
        {/* Hidden off-screen render target for html-to-image */}
        <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', pointerEvents: 'none' }}>
          <EpilogueAchievementReportCard stats={stats} innerRef={cardRef} />
        </div>

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-3xl max-h-[92dvh] flex flex-col rounded-[32px] border border-purple-500/30 bg-zinc-950/95 shadow-2xl relative overflow-hidden backdrop-blur-2xl text-white"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.3)]">
                <Award size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest font-mono">
                    ACHIEVEMENT REPORT
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-[10px] text-white/50 font-mono">
                    {stats.todayDateKey}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>에필로그 성취 통계 카드 &amp; 커뮤니티 공유</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="닫기"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-purple-500/30 text-white border border-purple-400/40 shadow-sm'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <Sparkles size={13} className={activeTab === 'card' ? 'text-amber-300' : 'text-white/40'} />
                <span>성취 리포트 카드 (이미지)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('feed')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'feed'
                    ? 'bg-purple-500/30 text-white border border-purple-400/40 shadow-sm'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <Users size={13} className={activeTab === 'feed' ? 'text-purple-300' : 'text-white/40'} />
                <span>커뮤니티 광장 피드</span>
              </button>
            </div>

            {activeTab === 'card' && renderedImageUrl && (
              <span className="text-[10px] text-emerald-400 font-mono font-bold hidden sm:flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <Check size={11} /> PNG 렌더링 완료 (2x HD)
              </span>
            )}
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 no-scrollbar space-y-6">
            {activeTab === 'card' ? (
              <div className="space-y-6">
                {/* 🖼️ Card Preview Display Area */}
                <div className="w-full flex flex-col items-center justify-center p-3 sm:p-5 rounded-[28px] bg-black/50 border border-white/10 relative overflow-hidden">
                  {isRendering ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-3 text-white/60">
                      <RefreshCw size={32} className="animate-spin text-purple-400" />
                      <p className="text-xs font-mono tracking-wider">
                        고화질 성취 리포트 카드를 이미지로 주조하는 중...
                      </p>
                    </div>
                  ) : renderedImageUrl ? (
                    <div className="w-full max-w-[480px] rounded-[24px] overflow-hidden shadow-2xl border border-purple-500/30 group relative">
                      <img
                        src={renderedImageUrl}
                        alt="에필로그 성취 통계 카드"
                        className="w-full h-auto object-cover select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                        <span className="text-xs text-white/90 font-bold bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                          클릭하여 전체 저장 또는 공유
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-[480px]">
                      {renderingError && (
                        <p className="text-xs text-amber-300 mb-3 text-center">{renderingError}</p>
                      )}
                      <EpilogueAchievementReportCard stats={stats} />
                    </div>
                  )}
                </div>

                {/* 🚀 Action Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {/* Action 1: Share to Community */}
                  <button
                    type="button"
                    onClick={handleShareToCommunity}
                    disabled={isSharingToCommunity}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.35)] active:scale-95 transition-all cursor-pointer border border-purple-300/40"
                  >
                    {isSharingToCommunity ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>광장에 발행 중...</span>
                      </>
                    ) : sharedSuccess ? (
                      <>
                        <Check size={14} className="text-emerald-300 animate-bounce" />
                        <span>공유 완료! 피드로 이동</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={14} />
                        <span>커뮤니티 광장 공유</span>
                      </>
                    )}
                  </button>

                  {/* Action 2: Download PNG */}
                  <button
                    type="button"
                    onClick={handleDownloadImage}
                    disabled={!renderedImageUrl}
                    className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer border border-white/10"
                    title="고화질 PNG 이미지 파일로 내 기기에 저장"
                  >
                    <Download size={14} />
                    <span>이미지 기기 저장 (PNG)</span>
                  </button>

                  {/* Action 3: Copy Text / Image */}
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer border border-white/10"
                    title="클립보드에 성취 리포트 요약 텍스트 복사"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-300" />
                        <span>클립보드 복사됨!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>요약 텍스트 복사</span>
                      </>
                    )}
                  </button>

                  {/* Action 4: External Web Share */}
                  <button
                    type="button"
                    onClick={handleWebShare}
                    className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer border border-white/5"
                    title="인스타그램, 카카오톡, X 등 외부 SNS로 공유"
                  >
                    <ExternalLink size={14} />
                    <span>외부 SNS 공유</span>
                  </button>
                </div>

                {/* Info Note */}
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-2.5 text-xs text-purple-200/80 leading-relaxed">
                  <Sparkles size={15} className="text-amber-300 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-white font-semibold">커뮤니티 광장 공유 시:</strong> 당신의 빛나는 여정과 성찰 스니펫이 우주 광장에 게시되어 다른 영혼 여행자들과 따뜻한 응원을 나눌 수 있습니다.
                  </p>
                </div>
              </div>
            ) : (
              /* Tab 2: Community Feed */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-purple-400" />
                    <h4 className="text-sm font-bold text-white">
                      영혼 여행자 커뮤니티 라운지 ({communityPosts.length})
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={loadFeed}
                    disabled={isLoadingFeed}
                    className="text-xs text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw size={12} className={isLoadingFeed ? 'animate-spin' : ''} />
                    <span>새로고침</span>
                  </button>
                </div>

                {isLoadingFeed ? (
                  <div className="py-16 text-center text-white/50 space-y-2">
                    <RefreshCw size={24} className="animate-spin mx-auto text-purple-400" />
                    <p className="text-xs">우주 커뮤니티 광장 피드를 불러오는 중...</p>
                  </div>
                ) : communityPosts.length === 0 ? (
                  <div className="py-16 text-center text-white/50 space-y-3">
                    <Award size={36} className="mx-auto text-white/30" />
                    <p className="text-xs">아직 공유된 성취 카드가 없습니다. 첫 번째 주인공이 되어보세요!</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('card')}
                      className="px-4 py-2 rounded-xl bg-purple-500/30 text-white text-xs font-bold hover:bg-purple-500/40 transition-all cursor-pointer"
                    >
                      + 내 성취 카드 공유하기
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {communityPosts.map((post) => {
                      const isCheered = cheeredPostIds.has(post.id);
                      return (
                        <div
                          key={post.id}
                          className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              {post.userPhotoURL ? (
                                <img
                                  src={post.userPhotoURL}
                                  alt={post.userName}
                                  className="w-9 h-9 rounded-xl object-cover border border-purple-400/40"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center font-bold text-xs text-purple-200">
                                  {post.userName.slice(0, 1)}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-white">{post.userName}</span>
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    {post.topMoodEmoji} {post.topMood}
                                  </span>
                                </div>
                                <span className="text-[10px] text-white/40 font-mono">
                                  {post.dateKey} · {post.soulEvolutionLevel}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono font-bold bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                              <Flame size={13} className="text-amber-400" />
                              <span>{post.streakDays}일 연속</span>
                            </div>
                          </div>

                          {/* Snippet Quote */}
                          {post.mindDiarySnippet && (
                            <p className="text-xs text-white/80 leading-relaxed italic bg-black/30 p-3 rounded-xl border border-white/5">
                              "{post.mindDiarySnippet}"
                            </p>
                          )}

                          {/* Thumbnail if present */}
                          {post.imageData && (
                            <div className="w-full max-h-56 rounded-xl overflow-hidden border border-white/10">
                              <img
                                src={post.imageData}
                                alt="공유된 성취 카드"
                                className="w-full h-full object-contain bg-black/40"
                              />
                            </div>
                          )}

                          {/* Footer Stats & Cheers Action */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-white/50">
                            <div className="flex items-center gap-3 font-mono">
                              <span>📖 {post.totalDiaries}편</span>
                              <span>💖 {post.totalGratitudes}가지</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCheer(post.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isCheered
                                  ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40 shadow-xs'
                                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                              }`}
                            >
                              <Heart
                                size={13}
                                className={isCheered ? 'text-pink-400 fill-pink-400 animate-pulse' : 'text-white/40'}
                              />
                              <span>응원 {post.cheersCount}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
