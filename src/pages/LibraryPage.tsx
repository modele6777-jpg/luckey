import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Library as LibraryIcon, Book, History, Search, Filter, 
  Sparkles, Heart, Brain, Wind, ArrowLeft, ChevronRight,
  Clock, Calendar as CalendarIcon, Tag, BarChart2, PieChart,
  Activity
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip as RechartsTooltip, Cell
} from 'recharts';
import { useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import { db, collection, query, orderBy, limit, getDocs, where, doc, updateDoc } from '@/lib/firebase';
import { CalendarView } from '@/components/CalendarView';
import { TTSButton } from '@/components/TTSButton';

interface UnifiedRecord {
  id: string;
  source: 'trinity' | 'muse' | 'orange' | 'bluebird' | 'heal';
  type: string;
  title: string;
  content: string;
  timestamp: Date;
  category: 'daily' | 'soul';
  metadata?: any;
}

const SOURCE_CONFIG = {
  trinity: { color: '#facc15', label: 'TRINITY', icon: Sparkles, feature: 'Daily Oracle' },
  muse: { color: 'oklch(0.65 0.18 250)', label: 'MUSE', icon: Brain, feature: 'Artist Sync' },
  orange: { color: '#f97316', label: 'ORANGE', icon: Heart, feature: 'Idea Station' },
  bluebird: { color: '#3b82f6', label: 'BLUEBIRD', icon: Wind, feature: 'Soul Clinic' },
  heal: { color: 'oklch(0.70 0.15 150)', label: 'AURA', icon: Activity, feature: 'Wellness' }
};

export default function LibraryPage() {
  const [, navigate] = useLocation();
  const { firebaseUser, sharedState } = useApp();
  const [records, setRecords] = useState<UnifiedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'daily' | 'soul'>('all');
  const [analyzingIds, setAnalyzingIds] = useState<Record<string, boolean>>({});
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  const handleAnalyzeRecord = async (record: UnifiedRecord) => {
    if (!firebaseUser) return;
    setAnalyzingIds(prev => ({ ...prev, [record.id]: true }));
    try {
      const response = await fetch('/api/ai/analyze-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: record.title,
          content: record.content,
          type: record.type
        })
      });

      if (!response.ok) throw new Error("분석 요청 실패");
      const { keywords, emotions } = await response.json();

      const collName = `${record.source}_history`;
      const docId = record.id.split('-').slice(1).join('-');
      const docRef = doc(db, collName, firebaseUser.uid, 'entries', docId);

      await updateDoc(docRef, {
        aiKeywords: keywords,
        aiEmotions: emotions
      });

      setRecords(prev => prev.map(r => {
        if (r.id === record.id) {
          return {
            ...r,
            metadata: {
              ...r.metadata,
              aiKeywords: keywords,
              aiEmotions: emotions
            }
          };
        }
        return r;
      }));
    } catch (err) {
      console.error("AI Analysis failed:", err);
    } finally {
      setAnalyzingIds(prev => ({ ...prev, [record.id]: false }));
    }
  };

  const handleBatchAnalyze = async () => {
    if (!firebaseUser) return;
    const unanalyzed = records.filter(r => !r.metadata?.aiKeywords && !r.metadata?.aiEmotions);
    if (unanalyzed.length === 0) {
      alert("분석되지 않은 새로운 기록이 없습니다! 모든 기록의 태그가 최신 상태입니다.");
      return;
    }

    setIsBatchAnalyzing(true);
    setBatchProgress(0);

    for (let j = 0; j < unanalyzed.length; j++) {
      const record = unanalyzed[j];
      try {
        const response = await fetch('/api/ai/analyze-entry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: record.title,
            content: record.content,
            type: record.type
          })
        });

        if (response.ok) {
          const { keywords, emotions } = await response.json();
          const collName = `${record.source}_history`;
          const docId = record.id.split('-').slice(1).join('-');
          const docRef = doc(db, collName, firebaseUser.uid, 'entries', docId);

          await updateDoc(docRef, {
            aiKeywords: keywords,
            aiEmotions: emotions
          });

          setRecords(prev => prev.map(r => {
            if (r.id === record.id) {
              return {
                ...r,
                metadata: {
                  ...r.metadata,
                  aiKeywords: keywords,
                  aiEmotions: emotions
                }
              };
            }
            return r;
          }));
        }
      } catch (err) {
        console.error(`Failed to analyze entry ${record.id}:`, err);
      }
      setBatchProgress(Math.round(((j + 1) / unanalyzed.length) * 100));
    }

    setIsBatchAnalyzing(false);
  };

  useEffect(() => {
    if (!firebaseUser) return;

    const fetchAllRecords = async () => {
      setLoading(true);
      try {
        const results: UnifiedRecord[] = [];
        const sources = [
          { key: 'trinity', coll: 'trinity_history' },
          { key: 'muse', coll: 'muse_history' },
          { key: 'orange', coll: 'orange_history' },
          { key: 'bluebird', coll: 'bluebird_history' },
          { key: 'heal', coll: 'heal_history' }
        ] as const;

        const EXCLUDED_TYPES = ['chat', 'wishing_well', 'picture_diary', 'tarot_reading', 'meditation', 'secret_story', 'role_model'];
        const SOUL_TYPES = ['soul-analysis', 'soul-sync', 'soul-energy', 'energy_analysis', 'SOUL_PROFILE', 'profile-analysis', 'artist soul analysis', 'soul deep prescription analysis'];

        for (const { key, coll } of sources) {
          try {
            const snap = await getDocs(query(
              collection(db, coll, firebaseUser.uid, 'entries'),
              orderBy('createdAt', 'desc'),
              limit(40)
            ));

            snap.forEach(doc => {
              const data = doc.data();
              const rawType = data.type || '';
              
              // Skip any of the special features/chats
              if (EXCLUDED_TYPES.includes(rawType)) {
                return;
              }

              let timestamp = new Date();
              if (data.createdAt) {
                timestamp = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
              } else if (data.timestamp) {
                timestamp = new Date(data.timestamp);
              }

              // Categorize as daily or soul
              let category: 'daily' | 'soul' = 'daily';
              if (
                SOUL_TYPES.includes(rawType) || 
                rawType.toLowerCase().includes('soul') || 
                rawType.toLowerCase().includes('energy') || 
                rawType.toLowerCase().includes('profile') ||
                rawType === 'soul-sync'
              ) {
                category = 'soul';
              }

              results.push({
                id: `${key}-${doc.id}`,
                source: key,
                type: data.type || (key === 'orange' ? 'Journal' : 'Record'),
                title: data.title || data.summary || data.type || (key === 'muse' ? data.question : (key === 'trinity' ? 'Oracle Result' : 'Untitled Memory')),
                content: data.content || data.text || data.response || data.guidance || data.analysis || '',
                timestamp,
                category,
                metadata: data
              });
            });
          } catch (sourceError) {
            console.error(`Error fetching records for source [${key}] from collection [${coll}]:`, sourceError);
          }
        }

        setRecords(results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecords();
  }, [firebaseUser]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesFilter = activeFilter === 'all' || r.category === activeFilter;
      const matchesDate = !selectedDate || (
        r.timestamp.getDate() === selectedDate.getDate() &&
        r.timestamp.getMonth() === selectedDate.getMonth() &&
        r.timestamp.getFullYear() === selectedDate.getFullYear()
      );
      const matchesSearch = !searchQuery || 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesFilter && matchesDate && matchesSearch;
    });
  }, [records, activeFilter, selectedDate, searchQuery]);

  const chartData = useMemo(() => {
    return [
      { subject: 'Wisdom (Trinity)', A: records.filter(r => r.source === 'trinity').length * 10, fullMark: 100 },
      { subject: 'Creativity (Muse)', A: records.filter(r => r.source === 'muse').length * 10, fullMark: 100 },
      { subject: 'Passion (Orange)', A: records.filter(r => r.source === 'orange').length * 10, fullMark: 100 },
      { subject: 'Empathy (Bluebird)', A: records.filter(r => r.source === 'bluebird').length * 10, fullMark: 100 },
    ];
  }, [records]);

  return (
    <div className="min-h-screen bg-[#070708] text-white/90 selection:bg-white/10 p-4 md:p-12 font-soft">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.header 
          initial={{ y: -12, opacity: 0.88 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
        >
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/30 hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Back to Universe</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                <LibraryIcon size={28} className="text-white/60" />
              </div>
              <div>
                <h1 className="text-4xl font-cute tracking-tight text-white/90">The Library of Souls</h1>
                <p className="text-xs text-white/20 uppercase tracking-[0.4em] mt-1 font-sans">Universal Archive of Records & Memories</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {([
              { id: 'all', label: '전체 (All)' },
              { id: 'daily', label: '데일리 분석 (Daily Oracle)' },
              { id: 'soul', label: '소울 분석 (Soul Tuning)' }
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-5 py-2.5 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeFilter === tab.id 
                    ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300 shadow-lg font-extrabold' 
                    : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/8 hover:text-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {firebaseUser && (
              <button
                onClick={handleBatchAnalyze}
                disabled={isBatchAnalyzing}
                className="px-5 py-2.5 rounded-2xl border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles size={11} className={isBatchAnalyzing ? "animate-spin" : "animate-pulse text-pink-400"} />
                {isBatchAnalyzing ? `분석 중 (${batchProgress}%)` : "전체 기록AI 분석"}
              </button>
            )}
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Left: Stats & Charts */}
          <aside className="lg:col-span-4 space-y-8 order-2 lg:order-1">
             <div className="glass p-8 rounded-[48px] border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300 space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Soul Spectrum</h4>
                  <PieChart size={14} className="text-white/20" />
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="rgba(255,255,255,0.05)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                      <Radar
                        name="Usage"
                        dataKey="A"
                        stroke="#facc15"
                        fill="#facc15"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(SOURCE_CONFIG).map(([key, config]) => {
                    const count = records.filter(r => r.source === key).length;
                    return (
                      <div key={key} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg hover:border-yellow-500/30 hover:bg-white/[0.06] transition-all duration-300">
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-tighter mb-1">{config.label}</p>
                        <div className="flex items-end gap-2">
                          <p className="text-2xl font-mono text-white/80 leading-none">{count}</p>
                          <span className="text-[8px] text-white/10 mb-1">records</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>

             <CalendarView 
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
                highlightDates={records.map(r => r.timestamp)}
                color="#facc15"
              />

              <div className="p-8 rounded-[48px] bg-yellow-500/5 border border-yellow-500/10 space-y-4">
                <div className="flex items-center gap-3 text-yellow-500/60">
                  <Sparkles size={16} />
                  <h4 className="text-xs font-bold uppercase tracking-widest font-cute">루시의 속삭임</h4>
                </div>
                <p className="text-sm text-white/50 leading-relaxed font-cute">
                  "당신의 모든 대화와 생각은 소중한 별가루입니다. 이곳에 쌓인 기록들은 당신이 얼마나 아름답게 빛나고 있는지 보여주는 증거예요. 오늘도 당신만의 우주를 사랑해주세요."
                </p>
              </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-yellow-500/50 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="과거의 기억을 검색해보세요..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[32px] py-6 pl-16 pr-8 text-lg placeholder:text-white/10 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all font-cute shadow-2xl"
              />
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="py-32 text-center space-y-6">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-yellow-500 rounded-full animate-spin" />
                  </div>
                  <p className="text-xs text-white/20 uppercase tracking-[0.4em] font-sans">Restoring Universal Archives...</p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="py-32 text-center border border-dashed border-white/5 rounded-[64px] opacity-20 space-y-6">
                  <Book size={64} className="mx-auto" />
                  <p className="text-xl font-cute tracking-widest ">도서관의 이 구석은 아직 비어있네요.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {filteredRecords.map((record, i) => {
                    const Config = SOURCE_CONFIG[record.source];
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (i % 5) * 0.1 }}
                        key={record.id}
                        className="group relative glass p-10 rounded-[56px] border border-white/10 hover:border-white/25 hover:bg-white/[0.07] shadow-2xl transition-all cursor-default overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 text-white/5">
                          <Config.icon size={120} />
                        </div>

                        <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                              style={{ backgroundColor: `${Config.color}20`, color: Config.color }}
                            >
                              <Config.icon size={22} />
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: Config.color }}>
                                    {Config.label}
                                  </span>
                                  <span className="w-1 h-1 rounded-full bg-white/10" />
                                  <span className="text-[9px] text-white/20 font-sans uppercase tracking-widest">{Config.feature}</span>
                               </div>
                              <p className="text-[10px] text-white/30 font-mono mt-1">{record.timestamp.toLocaleString('ko-KR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                            </div>
                          </div>
                          {record.metadata?.score && (
                             <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                               <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Sync {record.metadata.score}%</span>
                             </div>
                          )}
                        </div>

                        <h3 className="text-2xl font-cute mb-4 text-white/90 group-hover:text-white transition-colors leading-tight">
                          {record.title}
                        </h3>
                        <div className="text-sm text-white/50 leading-relaxed font-cute mb-6 max-h-40 overflow-y-auto custom-scrollbar pr-4 whitespace-pre-wrap">
                          {record.content}
                        </div>

                        {/* AI-powered Keywords and Emotions Tags (Polished UX) */}
                        {((record.metadata?.aiKeywords && record.metadata.aiKeywords.length > 0) || (record.metadata?.aiEmotions && record.metadata.aiEmotions.length > 0)) ? (
                          <div className="flex flex-wrap gap-2 mb-8 animate-fade-in">
                            {record.metadata?.aiEmotions?.map((emo: string, idx: number) => (
                              <span 
                                key={idx} 
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-[10px] font-bold text-pink-300 uppercase tracking-widest shadow-inner cursor-default"
                              >
                                <Heart size={10} className="fill-pink-300/80 text-pink-300 border-none animate-pulse" />
                                {emo}
                              </span>
                            ))}
                            {record.metadata?.aiKeywords?.map((kw: string, idx: number) => (
                              <span 
                                key={idx} 
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-medium text-cyan-200 tracking-wide font-sans shadow-inner cursor-default"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-[24px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300">
                            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                              <Sparkles size={12} className="text-pink-400 animate-pulse" />
                              PRISM AI 감정 분석 및 키워드가 할당되지 않았습니다.
                            </span>
                            <button
                              onClick={() => handleAnalyzeRecord(record)}
                              disabled={analyzingIds[record.id]}
                              className="px-4 py-2 rounded-xl border border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/20 hover:border-pink-500/50 text-[10px] font-bold text-pink-300 transition-all uppercase tracking-widest disabled:opacity-50 cursor-pointer text-center"
                            >
                              {analyzingIds[record.id] ? (
                                <span className="flex items-center gap-1.5 justify-center">
                                  <span className="w-2.5 h-2.5 rounded-full border border-t-pink-400 animate-spin" />
                                  분석 중...
                                </span>
                              ) : "AI 감정/태그 즉시 분석"}
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-4 pt-8 border-t border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] text-[9px] font-bold text-white/30 uppercase tracking-widest">
                              <Tag size={12} />
                              {record.type}
                            </div>
                            {record.metadata?.sentiment && (
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                <Heart size={12} />
                                {record.metadata.sentiment}
                              </div>
                            )}
                          </div>
                          <TTSButton text={record.content} voice="Kore" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

