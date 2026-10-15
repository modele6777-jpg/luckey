import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { 
  ReBibleVerse, 
  ReBibleAnnotation 
} from '@/types/rebible';
import { 
  subscribeToReBibleVerses, 
  saveVerseToFirestore, 
  saveLocalVerses,
  loadLocalVerses,
  getLocalDateKey,
  getVerseDateKey
} from '@/lib/rebibleStorage';
import { ReBibleHeader } from '@/components/rebible/ReBibleHeader';
import { ReBibleTimelineView } from '@/components/rebible/ReBibleTimelineView';
import { ReBibleBookshelfView } from '@/components/rebible/ReBibleBookshelfView';
import { ReBibleAnnotationModal } from '@/components/rebible/ReBibleAnnotationModal';
import { ReBibleCalendarModal } from '@/components/rebible/ReBibleCalendarModal';
import { ReBibleSyncEchoBanner } from '@/components/rebible/ReBibleSyncEchoBanner';
import { 
  buildTodaySyncEchoDraft, 
  syncTodayLiveCanonicalVerses,
  SyncEchoDraft 
} from '@/lib/rebibleSyncEcho';
import { exportLibraryAsBookletPDF } from '@/utils/rebibleExporter';
import { rebibleRecitationService } from '@/services/rebibleRecitationService';

export default function HandbookStandalonePage() {
  const [, navigate] = useLocation();
  const { firebaseUser, sharedState } = useApp();

  const rawNickname = sharedState?.userProfile?.basic?.nickname?.trim();
  const rawDisplayName = firebaseUser?.displayName?.trim();
  const userDisplayName = (rawNickname && rawNickname !== '여행자' && rawNickname !== '사용자')
    ? rawNickname
    : (rawDisplayName || '순례자');

  // View Mode: timeline vs bookshelf
  const [viewMode, setViewMode] = useState<'timeline' | 'bookshelf'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');

  // 🎯 토스된 검색어 수신 및 즉시 지혜 검색 실행
  useEffect(() => {
    const triggerAutoSearch = (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < 2) return;
      sessionStorage.removeItem('prism_auto_execute_text');
      setSearchQuery(trimmed);
      setViewMode('timeline');
    };

    if (typeof window !== 'undefined') {
      const autoText = sessionStorage.getItem('prism_auto_execute_text');
      if (autoText) {
        triggerAutoSearch(autoText);
      }
    }

    const handleExecute = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail && detail.text && (detail.tab === 'search' || detail.targetMenuId?.includes('handbook') || detail.targetMenu?.path?.includes('/handbook'))) {
        triggerAutoSearch(detail.text);
      }
    };
    window.addEventListener('prism:selection_execute', handleExecute);
    return () => window.removeEventListener('prism:selection_execute', handleExecute);
  }, []);

  // Selected date for day-by-day page view (YYYY-MM-DD)
  const [todayStr, setTodayStr] = useState<string>(() => getLocalDateKey());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => getLocalDateKey());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Verses state synced via Firestore & LocalStorage
  const [verses, setVerses] = useState<ReBibleVerse[]>(() => {
    // 실시간 동기화된 오늘 7개의 서를 기본으로 시작
    const synced = syncTodayLiveCanonicalVerses(loadLocalVerses());
    return synced.verses;
  });

  // Annotation Modal state (시간의 성찰)
  const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);
  const [targetAnnotationVerse, setTargetAnnotationVerse] = useState<ReBibleVerse | null>(null);

  // Sync:Echo Draft State (오늘의 프리즘 활동 & 지혜 실시간 상태)
  const [syncEchoDraft, setSyncEchoDraft] = useState<SyncEchoDraft>(() => buildTodaySyncEchoDraft(verses));

  // Update Page Title, Favicon, and PWA manifest for Re:Bible
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.title = 'Re:Bible - 삶의 서사가 자동으로 기록되는 인생 경전';

    let iconTag = document.querySelector<HTMLLinkElement>("link[rel*='apple-touch-icon']");
    if (!iconTag) {
      iconTag = document.createElement('link');
      iconTag.rel = 'apple-touch-icon';
      document.head.appendChild(iconTag);
    }
    iconTag.href = '/apple-touch-icon-rebible.png';

    let favTag = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (!favTag) {
      favTag = document.createElement('link');
      favTag.rel = 'icon';
      document.head.appendChild(favTag);
    }
    favTag.href = '/rebible-icon-192.png';

    let appleTitleTag = document.querySelector<HTMLMetaElement>("meta[name='apple-mobile-web-app-title']");
    if (!appleTitleTag) {
      appleTitleTag = document.createElement('meta');
      appleTitleTag.name = 'apple-mobile-web-app-title';
      document.head.appendChild(appleTitleTag);
    }
    appleTitleTag.setAttribute('content', 'Re:Bible');

    let manifestTag = document.querySelector<HTMLLinkElement>("link[rel='manifest']");
    if (manifestTag) {
      manifestTag.setAttribute('href', '/manifest-handbook.webmanifest');
    }
  }, []);

  // Real-time Firestore sync
  useEffect(() => {
    const unsub = subscribeToReBibleVerses(firebaseUser?.uid, (fetchedVerses) => {
      if (fetchedVerses && fetchedVerses.length > 0) {
        setVerses(fetchedVerses);
        setSyncEchoDraft(buildTodaySyncEchoDraft(fetchedVerses));
      }
    });
    return () => unsub();
  }, [firebaseUser?.uid]);

  // 실시간 라이브 자동 동기화 엔진:
  // 별도의 편찬 버튼 없이, 활동이 발생하거나 화면에 포커스될 때 항시 실시간으로 7개의 서를 자동 갱신
  // 자정(00:00)이 지나면 어제의 기록은 자동으로 영구 확정 봉인되고 새 날의 7권이 시작됩니다.
  const performLiveSync = useCallback(() => {
    const currentToday = getLocalDateKey();
    setTodayStr((prevToday) => {
      if (prevToday !== currentToday) {
        setSelectedDateStr(currentToday);
      }
      return currentToday;
    });

    setVerses((current) => {
      const res = syncTodayLiveCanonicalVerses(current);
      if (res.hasChanged || res.draft.activityCount !== syncEchoDraft.activityCount) {
        setSyncEchoDraft(res.draft);
      }
      return res.verses;
    });
  }, [syncEchoDraft.activityCount]);

  useEffect(() => {
    // 1. 컴포넌트 마운트 시 즉시 실시간 동기화
    performLiveSync();

    // 2. 윈도우 포커스, 탭 전환, 로컬 스토리지 변경 시 실시간 동기화
    const handleFocus = () => performLiveSync();
    const handleStorage = () => performLiveSync();
    const handleVisibility = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        performLiveSync();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);

    // 3. 3초 주기 실시간 감지 하트비트 (프리즘 타 앱 활동 즉시 반영)
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        performLiveSync();
      }
    }, 3000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(timer);
    };
  }, [performLiveSync]);

  // Search filtered verses
  const filteredVerses = useMemo(() => {
    if (!searchQuery.trim()) return verses;
    const q = searchQuery.toLowerCase().trim();
    return verses.filter((v) => {
      const matchTitle = v.title?.toLowerCase().includes(q);
      const matchRef = v.reference?.toLowerCase().includes(q);
      const matchFact = v.fact?.toLowerCase().includes(q);
      const matchInsight = v.insight?.toLowerCase().includes(q);
      const matchBook = v.bookTitle?.toLowerCase().includes(q);
      const matchEmotions = v.emotions?.some((e) => e.toLowerCase().includes(q));
      const matchTags = v.tags?.some((t) => t.toLowerCase().includes(q));
      const matchAnnotations = v.annotations?.some((a) => a.content?.toLowerCase().includes(q) || a.timeHorizon?.toLowerCase().includes(q));
      return matchTitle || matchRef || matchFact || matchInsight || matchBook || matchEmotions || matchTags || matchAnnotations;
    });
  }, [verses, searchQuery]);

  // Toggle Sacred Favorite Star
  const handleToggleFavorite = useCallback(async (verseId: string) => {
    const updated = verses.map((v) => {
      if (v.id === verseId) {
        const nextFav = !v.isSacredFavorite;
        const modified = { ...v, isSacredFavorite: nextFav, updatedAt: new Date().toISOString() };
        saveVerseToFirestore(modified);
        return modified;
      }
      return v;
    });
    setVerses(updated);
    saveLocalVerses(updated);
  }, [verses]);

  // Save New Annotation (시간의 성찰)
  const handleSaveAnnotation = useCallback(async (verseId: string, annotationData: { timeHorizon: string; content: string; shiftSummary?: string }) => {
    const newAnnot: ReBibleAnnotation = {
      id: `annot-${Date.now()}`,
      verseId,
      writtenAt: new Date().toISOString(),
      timeHorizon: annotationData.timeHorizon,
      content: annotationData.content,
      shiftSummary: annotationData.shiftSummary
    };

    const updated = verses.map((v) => {
      if (v.id === verseId) {
        const existingAnnots = Array.isArray(v.annotations) ? v.annotations : [];
        const modified = {
          ...v,
          annotations: [...existingAnnots, newAnnot],
          updatedAt: new Date().toISOString()
        };
        saveVerseToFirestore(modified);
        return modified;
      }
      return v;
    });

    setVerses(updated);
    saveLocalVerses(updated);
  }, [verses]);

  // Delete Annotation
  const handleDeleteAnnotation = useCallback(async (verseId: string, annotationId: string) => {
    const updated = verses.map((v) => {
      if (v.id === verseId) {
        const modified = {
          ...v,
          annotations: (v.annotations || []).filter((a) => a.id !== annotationId),
          updatedAt: new Date().toISOString()
        };
        saveVerseToFirestore(modified);
        return modified;
      }
      return v;
    });
    setVerses(updated);
    saveLocalVerses(updated);
  }, [verses]);

  // Global Full Scripture Recitation Service binding
  const [isSpeakingAll, setIsSpeakingAll] = useState(() => rebibleRecitationService.getState().isSpeaking);

  useEffect(() => {
    return rebibleRecitationService.subscribe((state) => {
      setIsSpeakingAll(state.isSpeaking);
    });
  }, []);

  const handleToggleSpeakAll = useCallback(() => {
    const targetList = filteredVerses.length > 0 ? filteredVerses : verses;
    rebibleRecitationService.toggleRecitation(targetList);
  }, [filteredVerses, verses]);

  return (
    <div className="h-app-full w-full flex flex-col relative font-sans selection:bg-[#EADDC6] bg-[#FAF6EE] text-stone-900 overflow-hidden">
      {/* Sanctuary Top Header (Fixed Parchment Theme) */}
      <ReBibleHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onBackToPrism={() => navigate('/')}
        onNavigateToLucy={() => navigate('/chat')}
        totalVersesCount={verses.length}
        onOpenCalendar={() => setIsCalendarOpen(true)}
        onExportBookletPDF={() => exportLibraryAsBookletPDF(verses, userDisplayName)}
        isSpeakingAll={isSpeakingAll}
        onToggleSpeakAll={handleToggleSpeakAll}
      />

      {/* Main Content Layout with smooth scrolling */}
      <main data-app-scroll-root className="flex-1 w-full overflow-x-hidden overflow-y-auto no-scrollbar scroll-smooth relative z-10">
        <div className="max-w-5xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-4 space-y-4 pb-2 sm:pb-3">
          {/* Body View: Timeline vs Bookshelf */}
          {viewMode === 'timeline' ? (
            <ReBibleTimelineView
              verses={filteredVerses}
              selectedDateStr={selectedDateStr}
              onSelectDate={(newDate) => setSelectedDateStr(newDate)}
              onOpenCalendar={() => setIsCalendarOpen(true)}
              onToggleFavorite={handleToggleFavorite}
              onAddAnnotation={(verse) => {
                setTargetAnnotationVerse(verse);
                setIsAnnotationOpen(true);
              }}
              onDeleteAnnotation={handleDeleteAnnotation}
            />
          ) : (
            <ReBibleBookshelfView
              verses={filteredVerses}
              onToggleFavorite={handleToggleFavorite}
              onAddAnnotation={(verse) => {
                setTargetAnnotationVerse(verse);
                setIsAnnotationOpen(true);
              }}
              onDeleteAnnotation={handleDeleteAnnotation}
            />
          )}

          {/* Today's Auto-Compiled Footprints Live Banner */}
          <ReBibleSyncEchoBanner
            draft={syncEchoDraft}
          />
        </div>
      </main>

      {/* Calendar Modal (달력으로 일자별 기록 및 성찰 시점 탐색) */}
      <ReBibleCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDateStr={selectedDateStr}
        onSelectDate={(newDate) => setSelectedDateStr(newDate)}
        verses={verses}
      />

      {/* Annotation Modal (시간을 건너온 성찰 주석) */}
      <ReBibleAnnotationModal
        verse={targetAnnotationVerse}
        isOpen={isAnnotationOpen}
        onClose={() => {
          setIsAnnotationOpen(false);
          setTargetAnnotationVerse(null);
        }}
        onSaveAnnotation={handleSaveAnnotation}
      />
    </div>
  );
}
