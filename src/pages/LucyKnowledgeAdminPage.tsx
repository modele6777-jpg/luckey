import React from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  collection, doc, getDocs, limit, onSnapshot, orderBy, query, setDoc, updateDoc, where, writeBatch,
} from 'firebase/firestore';
import { AlertTriangle, BookOpen, Check, Clock3, History, Search, Settings2, ShieldCheck, Sparkles } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { FIFTEEN_DIVINATION_TOOLS } from '@/lib/fifteenDivinationTools';
import { compareKnowledgeCards, hasVerifiedFullTextSource, type GovernedKnowledgeCard, type KnowledgeSource } from '@/lib/divination/knowledge/governance';
import type { DivinationToolId } from '@/lib/lucyToolRegistry';

type Candidate = KnowledgeSource;
interface ScheduledCandidate { id: string; engineId: DivinationToolId; source: Candidate }
interface ApiStatus {
  researchEnabled: boolean;
  sourceSearchAvailable: boolean;
  aiDraftAvailable: boolean;
  aiBlockReason?: string | null;
  scheduledResearchAvailable: boolean;
  scheduledResearchEnabled: boolean;
  scheduledBlockReason?: string | null;
  hardDailyCapUsd: number;
  configuredDailyCapUsd: number;
  maxPerRunUsd: number;
}
interface ResearchRun {
  id: string;
  status?: string;
  actualUsd?: number;
  reservedUsd?: number;
  inputTokens?: number;
  outputTokens?: number;
  dateKey?: string;
  createdAt?: string;
}
interface DraftRecord extends GovernedKnowledgeCard {
  createdBy?: string;
  reviewNote?: string;
  reviewedBy?: string;
  approvedAt?: string;
}
const ENGINE_OPTIONS = Object.values(FIFTEEN_DIVINATION_TOOLS).map((engine) => ({ id: engine.id, label: engine.koName }));
const initialSettings = { researchEnabled: false, aiDraftEnabled: false, scheduledResearchEnabled: false, dailyBudgetUsd: 0, maxPerRunUsd: 0 };

async function authorizedFetch(user: User, path: string, method = 'GET', body?: unknown): Promise<any> {
  const token = await user.getIdToken();
  const response = await fetch(path, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `요청 실패 (${response.status})`);
  return payload;
}
function makeSourceId(source: Candidate, index: number): string {
  return source.doi || source.url || `source-${index + 1}`;
}
function usableSource(candidate: Candidate, verified: boolean, access: KnowledgeSource['access'], school: string): Candidate {
  return { ...candidate, verification: verified ? 'original_text_checked' : 'metadata_checked', access, school: school || undefined };
}
export default function LucyKnowledgeAdminPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [authReady, setAuthReady] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [authMessage, setAuthMessage] = React.useState('');
  const [status, setStatus] = React.useState<ApiStatus | null>(null);
  const [settings, setSettings] = React.useState(initialSettings);
  const [drafts, setDrafts] = React.useState<DraftRecord[]>([]);
  const [published, setPublished] = React.useState<GovernedKnowledgeCard[]>([]);
  const [runs, setRuns] = React.useState<ResearchRun[]>([]);
  const [selectedDraftId, setSelectedDraftId] = React.useState('');
  const [engineId, setEngineId] = React.useState<DivinationToolId>('iching');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [scheduledCandidates, setScheduledCandidates] = React.useState<ScheduledCandidate[]>([]);
  const [candidateIndex, setCandidateIndex] = React.useState<number | null>(null);
  const [evidenceNotes, setEvidenceNotes] = React.useState('');
  const [school, setSchool] = React.useState('');
  const [sourceVerified, setSourceVerified] = React.useState(false);
  const [sourceAccess, setSourceAccess] = React.useState<KnowledgeSource['access']>('metadata_only');
  const [reviewNote, setReviewNote] = React.useState('');
  const [duplicateChecked, setDuplicateChecked] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [notice, setNotice] = React.useState('');
  const [error, setError] = React.useState('');
  const [history, setHistory] = React.useState<GovernedKnowledgeCard[]>([]);

  React.useEffect(() => {
    let disposed = false;
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setIsAdmin(false);
      setAuthMessage('');
      if (!nextUser) {
        setAuthReady(true);
        setAuthMessage('로그인 후 지식 관리자 권한이 있는 계정에서 이용할 수 있습니다.');
        return;
      }
      try {
        const token = await nextUser.getIdTokenResult();
        if (!disposed) {
          const admin = token.claims.knowledgeAdmin === true;
          setIsAdmin(admin);
          if (!admin) setAuthMessage('이 계정에 지식 관리자 권한이 없습니다. 승인된 관리자의 별도 권한 설정이 필요합니다.');
        }
      } catch {
        if (!disposed) setAuthMessage('로그인 권한을 확인하지 못했습니다. 다시 로그인해 주세요.');
      } finally {
        if (!disposed) setAuthReady(true);
      }
    });
    return () => { disposed = true; unsubscribe(); };
  }, []);

  React.useEffect(() => {
    if (!user || !isAdmin) return;
    let alive = true;
    let stopDrafts: (() => void) | undefined;
    let stopPublished: (() => void) | undefined;
    let stopRuns: (() => void) | undefined;
    let stopSettings: (() => void) | undefined;
    let stopScheduled: (() => void) | undefined;
    setError('');
    authorizedFetch(user, '/api/lucy-knowledge/status').then((result) => { if (alive) setStatus(result); }).catch((reason) => { if (alive) setError(String(reason?.message || reason)); });
    stopDrafts = onSnapshot(query(collection(db, 'lucyKnowledgeDrafts'), orderBy('createdAt', 'desc'), limit(100)), (snapshot) => {
      if (alive) setDrafts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as DraftRecord)));
    }, (reason) => { if (alive) setError(`초안 목록을 불러오지 못했습니다: ${reason?.message || reason}`); });
    stopPublished = onSnapshot(query(collection(db, 'lucyKnowledgePublished'), limit(500)), (snapshot) => {
      if (alive) setPublished(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as GovernedKnowledgeCard)));
    }, (reason) => { if (alive) setError(`승인 카드 목록을 불러오지 못했습니다: ${reason?.message || reason}`); });
    stopRuns = onSnapshot(query(collection(db, 'lucyKnowledgeResearchRuns'), orderBy('createdAt', 'desc'), limit(500)), (snapshot) => {
      if (alive) setRuns(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as ResearchRun)));
    }, (reason) => { if (alive) setError(`비용 원장을 불러오지 못했습니다: ${reason?.message || reason}`); });
    stopScheduled = onSnapshot(query(collection(db, 'lucyKnowledgeSourceCandidates'), orderBy('createdAt', 'desc'), limit(30)), (snapshot) => {
      if (alive) setScheduledCandidates(snapshot.docs.map((item) => ({ ...item.data(), id: item.id } as ScheduledCandidate)));
    }, () => { if (alive) setError('정기 수집 자료를 불러오지 못했습니다.'); });
    stopSettings = onSnapshot(doc(db, 'lucyKnowledgeSettings', 'control'), (snapshot) => {
      if (alive && snapshot.exists()) setSettings({ ...initialSettings, ...snapshot.data() } as typeof initialSettings);
    }, (reason) => { if (alive) setError(`관리 설정을 불러오지 못했습니다: ${reason?.message || reason}`); });
    return () => { alive = false; stopDrafts?.(); stopPublished?.(); stopRuns?.(); stopSettings?.(); stopScheduled?.(); };
  }, [user, isAdmin]);

  const selectedDraft = drafts.find((item) => item.id === selectedDraftId) ?? null;
  const comparisons = selectedDraft ? compareKnowledgeCards(selectedDraft, [...published, ...drafts.filter((item) => item.id !== selectedDraft.id)]) : [];
  const dailyRuns = runs.filter((run) => run.dateKey === new Date().toISOString().slice(0, 10));
  const todaySpent = dailyRuns.reduce((sum, run) => sum + (Number(run.actualUsd) || (run.status === 'reserved' || run.status === 'failed_reserved' ? Number(run.reservedUsd) || 0 : 0)), 0);

  const saveSettings = async (patch: Partial<typeof initialSettings>) => {
    if (!user) return;
    setWorking(true); setError(''); setNotice('');
    try {
      const next = { ...settings, ...patch };
      await setDoc(doc(db, 'lucyKnowledgeSettings', 'control'), { ...patch, updatedBy: user.uid, updatedAt: new Date().toISOString() }, { merge: true });
      setSettings(next);
      const refreshedStatus = await authorizedFetch(user, '/api/lucy-knowledge/status');
      setStatus(refreshedStatus);
      setNotice('관리 설정을 저장했습니다. AI 생성에는 서버 비용 한도 설정도 필요합니다.');
    } catch (reason: any) { setError(reason?.message || '설정을 저장하지 못했습니다.'); }
    finally { setWorking(false); }
  };
  const runSearch = async () => {
    if (!user || !searchQuery.trim()) return;
    setWorking(true); setError(''); setNotice(''); setCandidates([]); setCandidateIndex(null);
    try {
      const result = await authorizedFetch(user, '/api/lucy-knowledge/search', 'POST', { engineId, query: searchQuery, rows: 8 });
      setCandidates(Array.isArray(result.candidates) ? result.candidates : []);
      setNotice(`Crossref 서지 메타데이터 ${result.candidates?.length ?? 0}건을 가져왔습니다. 원문을 확인한 것은 아닙니다.`);
    } catch (reason: any) { setError(reason?.message || '출처 검색에 실패했습니다.'); }
    finally { setWorking(false); }
  };
  const selectSource = (index: number) => {
    setCandidateIndex(index);
    setSourceVerified(false);
    setSourceAccess('metadata_only');
    setEvidenceNotes('');
    setSchool('');
  };
  const generateDraft = async () => {
    if (!user || candidateIndex === null) return;
    const original = candidates[candidateIndex];
    const source = usableSource(original, sourceVerified, sourceAccess, school);
    if (!sourceVerified || sourceAccess !== 'full_text') return setError('원문 전문을 직접 대조한 뒤에만 초안을 만들 수 있습니다.');
    setWorking(true); setError(''); setNotice('');
    try {
      const result = await authorizedFetch(user, '/api/lucy-knowledge/draft', 'POST', { engineId, source: [source], evidenceNotes, school });
      const id = crypto.randomUUID();
      const draft = { ...result.draft, id, sourceIds: [makeSourceId(source, 0)], sources: [source], status: 'pending_review', active: false, createdBy: user.uid, generatedBy: 'gemini', generatedAt: new Date().toISOString(), usage: result.usage, runId: result.runId };
      await setDoc(doc(db, 'lucyKnowledgeDrafts', id), draft);
      setSelectedDraftId(id);
      setNotice(`AI 초안을 검토 대기함에 저장했습니다. 예상 사용 비용 $${Number(result.usage?.costUsd || 0).toFixed(6)}. 승인 전 상담에는 반영되지 않습니다.`);
    } catch (reason: any) { setError(reason?.message || '초안을 생성하지 못했습니다.'); }
    finally { setWorking(false); }
  };
  const approveDraft = async () => {
    if (!user || !selectedDraft) return;
    if (!hasVerifiedFullTextSource(selectedDraft.sources)) return setError('승인 전에 초안에 연결된 출처의 원문 전문을 확인해야 합니다.');
    if (comparisons.length > 0 && (!duplicateChecked || reviewNote.trim().length < 20)) return setError('중복·유사·상충 검토 결과와 처리 근거(20자 이상)를 기록해 주세요.');
    if (!reviewNote.trim()) return setError('승인 검토 메모를 입력해 주세요.');
    setWorking(true); setError(''); setNotice('');
    try {
      const versions = await getDocs(query(collection(db, 'lucyKnowledgeVersions'), where('cardId', '==', selectedDraft.id)));
      const nextVersion = versions.docs.reduce((highest, item) => Math.max(highest, Number(item.data().version) || 0), 0) + 1;
      const versionId = `${selectedDraft.id}_v${nextVersion}`;
      const approved = {
        ...selectedDraft, status: 'approved', active: true, version: nextVersion, versionId,
        cardId: selectedDraft.id, approvedAt: new Date().toISOString(), approvedBy: user.uid,
        reviewedBy: user.uid, reviewNote: reviewNote.trim(), restoredFrom: null,
      };
      const batch = writeBatch(db);
      batch.set(doc(db, 'lucyKnowledgeVersions', versionId), approved);
      batch.set(doc(db, 'lucyKnowledgePublished', selectedDraft.id), approved);
      batch.update(doc(db, 'lucyKnowledgeDrafts', selectedDraft.id), { status: 'approved', active: true, version: nextVersion, versionId, approvedAt: approved.approvedAt, approvedBy: user.uid, reviewedBy: user.uid, reviewNote: reviewNote.trim() });
      await batch.commit();
      setNotice(`v${nextVersion}로 승인·공개했습니다. 다음 로그인된 상담부터 세 모드에서 계산 엔진과 일치할 때만 사용합니다.`);
      setReviewNote(''); setDuplicateChecked(false);
    } catch (reason: any) { setError(reason?.message || '승인 내용을 저장하지 못했습니다.'); }
    finally { setWorking(false); }
  };
  const rejectDraft = async () => {
    if (!user || !selectedDraft) return;
    if (reviewNote.trim().length < 20) return setError('반려 이유를 20자 이상 기록해 주세요.');
    setWorking(true); setError(''); setNotice('');
    try {
      await updateDoc(doc(db, 'lucyKnowledgeDrafts', selectedDraft.id), {
        status: 'rejected', active: false, reviewedBy: user.uid,
        reviewedAt: new Date().toISOString(), reviewNote: reviewNote.trim(),
      });
      setNotice('초안을 반려했습니다. 상담에는 반영되지 않으며 검토 기록은 보존됩니다.');
      setReviewNote(''); setDuplicateChecked(false);
    } catch (reason: any) { setError(reason?.message || '초안을 반려하지 못했습니다.'); }
    finally { setWorking(false); }
  };

  const loadHistory = async (card: GovernedKnowledgeCard) => {
    setWorking(true); setError('');
    try {
      const snapshot = await getDocs(query(collection(db, 'lucyKnowledgeVersions'), where('cardId', '==', card.id)));
      setHistory(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as GovernedKnowledgeCard))
        .sort((left, right) => Number(right.version) - Number(left.version)).slice(0, 50));
      setSelectedDraftId(card.id);
    } catch (reason: any) { setError(reason?.message || '버전 이력을 불러오지 못했습니다.'); }
    finally { setWorking(false); }
  };
  const restoreVersion = async (cardId: string, previous: GovernedKnowledgeCard) => {
    if (!user) return;
    setWorking(true); setError(''); setNotice('');
    try {
      const latestQuery = await getDocs(query(collection(db, 'lucyKnowledgeVersions'), where('cardId', '==', cardId)));
      const nextVersion = latestQuery.docs.reduce((highest, item) => Math.max(highest, Number(item.data().version) || 0), 0) + 1;
      const versionId = `${cardId}_v${nextVersion}`;
      const restored = { ...previous, cardId, id: cardId, status: 'approved', active: true, version: nextVersion, versionId, restoredFrom: previous.versionId ?? previous.id, approvedBy: user.uid, approvedAt: new Date().toISOString(), reviewNote: `기존 버전 복원: ${previous.versionId ?? previous.id}` };
      const batch = writeBatch(db);
      batch.set(doc(db, 'lucyKnowledgeVersions', versionId), restored);
      batch.set(doc(db, 'lucyKnowledgePublished', cardId), restored);
      await batch.commit();
      setNotice(`이전 내용으로 복원한 새 버전 v${nextVersion}를 공개했습니다. 과거 버전은 변경하지 않았습니다.`);
    } catch (reason: any) { setError(reason?.message || '버전을 복원하지 못했습니다.'); }
    finally { setWorking(false); }
  };

  if (!authReady) return <div className="mx-auto max-w-3xl p-6 text-sm text-slate-500">권한 확인 중…</div>;
  if (!user || !isAdmin) return (
    <main className="mx-auto max-w-2xl p-5 sm:p-8 text-slate-900 dark:text-slate-100">
      <header className="mb-5 flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-indigo-500" /><h1 className="text-xl font-semibold">Lucy 지식 성장 관리</h1></header>
      <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">{authMessage || '관리자 인증이 필요합니다.'}</p>
      <p className="mt-4 text-xs leading-5 text-slate-500">일반 로그인 권한만으로는 초안·비용 원장·버전을 읽거나 수정할 수 없습니다. 관리자 권한은 인증된 Firebase custom claim으로만 부여됩니다.</p>
    </main>
  );

  return (
    <main className="mx-auto max-w-5xl space-y-5 p-4 pb-16 text-slate-900 dark:text-slate-100 sm:p-7">
      <header className="flex items-start gap-3"><BookOpen className="mt-1 h-6 w-6 text-indigo-500" /><div><h1 className="text-xl font-semibold">Lucy 지식 성장 관리</h1><p className="mt-1 text-sm text-slate-500">초안은 관리자 승인 전까지 Lucy·Lucy Plus·Lucy Pro 상담에 사용되지 않습니다.</p></div></header>
      {error && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">{notice}</p>}
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="text-xs text-slate-500">공개 카드</div><strong className="mt-1 block text-2xl">{published.length}</strong></div>
        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="text-xs text-slate-500">검토 대기</div><strong className="mt-1 block text-2xl">{drafts.filter((draft) => draft.status === 'pending_review').length}</strong></div>
        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="text-xs text-slate-500">오늘의 AI 사용 원장</div><strong className="mt-1 block text-2xl">${todaySpent.toFixed(6)}</strong><div className="mt-1 text-[11px] text-slate-500">상한 ${status?.configuredDailyCapUsd?.toFixed(4) ?? '0.0000'} / 원장 기록은 서버 예약 기준</div></div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><Settings2 className="h-4 w-4" /> 연구·비용 설정</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.researchEnabled} disabled={working} onChange={(event) => void saveSettings({ researchEnabled: event.target.checked })} /> Crossref 메타데이터 연구 허용</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.aiDraftEnabled} disabled={working || !status?.aiDraftAvailable && !status?.aiBlockReason?.includes('관리자 설정')} onChange={(event) => void saveSettings({ aiDraftEnabled: event.target.checked })} /> AI 해석 카드 초안 허용</label>
          <label className="text-sm">일일 예산 (USD)<input type="number" min="0" step="0.01" value={settings.dailyBudgetUsd} className="mt-1 block w-full rounded-lg border bg-transparent px-3 py-2" onChange={(event) => setSettings({ ...settings, dailyBudgetUsd: Number(event.target.value) })} /></label>
          <label className="text-sm">회당 예산 (USD)<input type="number" min="0" step="0.001" value={settings.maxPerRunUsd} className="mt-1 block w-full rounded-lg border bg-transparent px-3 py-2" onChange={(event) => setSettings({ ...settings, maxPerRunUsd: Number(event.target.value) })} /></label>
        </div>
        <button type="button" disabled={working} onClick={() => void saveSettings({ dailyBudgetUsd: settings.dailyBudgetUsd, maxPerRunUsd: settings.maxPerRunUsd })} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">예산 저장</button>
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-900 dark:text-slate-300">서버 안전 상한: 일 ${status?.hardDailyCapUsd?.toFixed(4) ?? '0.0000'} · 회당 ${status?.maxPerRunUsd?.toFixed(4) ?? '0.0000'}. AI 생성은 서버 모델 요금·토큰 상한·API 키와 이 설정이 모두 준비되지 않으면 차단됩니다. 이 화면에서 비용 상한을 넘겨 강제로 켤 수 없습니다.</div>
        <label className="mt-3 flex items-start gap-2 text-xs text-slate-500"><input type="checkbox" checked={settings.scheduledResearchEnabled} disabled={working || (!settings.scheduledResearchEnabled && (!status?.scheduledResearchAvailable || !settings.researchEnabled))} onChange={(event) => void saveSettings({ scheduledResearchEnabled: event.target.checked })} /> 정기 연구 <span>{status?.scheduledBlockReason || '매일 오전 9시(한국 시간)에 공개 문헌 후보를 모읍니다.'}</span></label>
      </section>

      <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <h2 className="mb-2 flex items-center gap-2 font-semibold"><Search className="h-4 w-4" /> 공개 문헌 서지 검색</h2>
        <p className="mb-3 text-xs leading-5 text-slate-500">Crossref의 제목·저자·학술지·DOI 메타데이터만 가져옵니다. 원문 전문을 확인했다는 뜻은 아니며, 초록이나 저작권 본문을 저장하지 않습니다.</p>
        <div className="mb-4 space-y-2">
          <h3 className="text-sm font-medium">정기 수집 검토함</h3>
          {scheduledCandidates.length === 0 && <p className="text-xs text-slate-500">아직 수집된 자료가 없습니다.</p>}
          {scheduledCandidates.map(({ id, engineId: candidateEngine, source }) => (
            <button key={id} type="button" className="block w-full rounded-xl border p-2 text-left text-sm" onClick={() => {
              setEngineId(candidateEngine);
              setCandidates([source]);
              selectSource(0);
            }}>
              <strong>{source.title}</strong>
              <span className="block text-xs text-slate-500">{ENGINE_OPTIONS.find((engine) => engine.id === candidateEngine)?.label} · {source.authors.join(', ') || '저자 메타데이터 없음'}</span>
            </button>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
          <select value={engineId} onChange={(event) => { setEngineId(event.target.value as DivinationToolId); setCandidates([]); setCandidateIndex(null); }} className="rounded-lg border bg-transparent px-3 py-2 text-sm">{ENGINE_OPTIONS.map((engine) => <option key={engine.id} value={engine.id}>{engine.label}</option>)}</select>
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void runSearch(); }} placeholder="전통명, 학파, 연구 주제" className="rounded-lg border bg-transparent px-3 py-2 text-sm" />
          <button type="button" disabled={working || !status?.sourceSearchAvailable} onClick={() => void runSearch()} className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white disabled:opacity-50">검색</button>
        </div>
        {!status?.sourceSearchAvailable && <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{status?.aiBlockReason || '관리자 설정에서 연구를 활성화해야 합니다.'}</p>}
        <div className="mt-3 space-y-2">{candidates.map((candidate, index) => (
          <button key={`${candidate.doi || candidate.url}-${index}`} type="button" onClick={() => selectSource(index)} className={`block w-full rounded-xl border p-3 text-left text-sm ${candidateIndex === index ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-700'}`}>
            <strong>{candidate.title}</strong><span className="mt-1 block text-xs text-slate-500">{candidate.authors.join(', ') || '저자 메타데이터 없음'}{candidate.year ? ` · ${candidate.year}` : ''}{candidate.publication ? ` · ${candidate.publication}` : ''}</span><span className="mt-1 block break-all text-xs text-indigo-600 dark:text-indigo-300">{candidate.doi || candidate.url}</span>
          </button>
        ))}</div>
        {candidateIndex !== null && candidates[candidateIndex] && <div className="mt-4 space-y-3 rounded-xl border border-indigo-200 p-3 dark:border-indigo-900">
          <p className="text-sm font-medium">선택한 자료를 직접 대조한 뒤에만 AI 초안을 만들 수 있습니다.</p>
          {candidates[candidateIndex].url.startsWith('https://') && <a href={candidates[candidateIndex].url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 underline dark:text-indigo-300">자료 페이지 열기</a>}
          <label className="block text-xs">해당 학파 또는 해석 전통<input value={school} onChange={(event) => setSchool(event.target.value)} placeholder="예: 특정 전통·판본·학파" className="mt-1 block w-full rounded-lg border bg-transparent px-3 py-2 text-sm" /></label>
          <label className="block text-xs">확인 가능한 접근 수준<select value={sourceAccess} onChange={(event) => setSourceAccess(event.target.value as KnowledgeSource['access'])} className="mt-1 block w-full rounded-lg border bg-transparent px-3 py-2 text-sm"><option value="full_text">원문 전문 확인</option><option value="abstract_only">초록만 확인</option><option value="metadata_only">서지 메타데이터만 확인</option><option value="unavailable">원문 접근 불가</option></select></label>
          <label className="flex items-start gap-2 text-xs"><input type="checkbox" checked={sourceVerified} onChange={(event) => setSourceVerified(event.target.checked)} /> 원문 전문을 직접 대조했습니다. (초록·메타데이터만 본 경우는 체크하지 마세요.)</label>
          <label className="block text-xs">대조한 근거와 해당 해석의 범위<textarea value={evidenceNotes} onChange={(event) => setEvidenceNotes(event.target.value)} rows={4} maxLength={6000} placeholder="원문에서 확인한 개념을 자신의 말로 요약해 주세요. 긴 저작권 본문을 붙여넣지 마세요." className="mt-1 block w-full rounded-lg border bg-transparent px-3 py-2 text-sm" /></label>
          <button type="button" disabled={working || !status?.aiDraftAvailable} onClick={() => void generateDraft()} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"><Sparkles className="h-4 w-4" /> AI 초안 만들기</button>
          {!status?.aiDraftAvailable && <p className="text-xs text-amber-700 dark:text-amber-300">{status?.aiBlockReason || '서버 비용 한도와 모델 사용료가 준비되어야 합니다.'}</p>}
        </div>}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><Clock3 className="h-4 w-4" /> 관리자 승인 대기함</h2>
          <div className="space-y-2">{drafts.filter((draft) => draft.status === 'pending_review').map((draft) => <button key={draft.id} type="button" onClick={() => { setSelectedDraftId(draft.id); setReviewNote(''); setDuplicateChecked(false); }} className={`w-full rounded-xl border p-3 text-left ${selectedDraftId === draft.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-700'}`}><strong className="block text-sm">{draft.title}</strong><span className="text-xs text-slate-500">{ENGINE_OPTIONS.find((engine) => engine.id === draft.engineId)?.label} · {draft.school || '학파 미표기'} · 출처 {draft.sources?.length || 0}건</span></button>)}{drafts.filter((draft) => draft.status === 'pending_review').length === 0 && <p className="text-sm text-slate-500">검토 대기 중인 초안이 없습니다.</p>}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
          <h2 className="mb-3 font-semibold">초안 검토</h2>
          {selectedDraft && selectedDraft.status === 'pending_review' ? <>
            <div className="space-y-2 text-sm"><h3 className="font-semibold">{selectedDraft.title}</h3><p><b>핵심:</b> {selectedDraft.core}</p><p><b>활용:</b> {selectedDraft.use}</p><p><b>주의:</b> {selectedDraft.caution}</p><p className="text-xs text-slate-500">학파: {selectedDraft.school || '미표기'} · AI 초안 · 승인 전 상담 미반영</p>
              {selectedDraft.sources?.map((source, index) => <p key={`${source.url}-${index}`} className="break-words rounded-lg bg-slate-50 p-2 text-xs dark:bg-slate-900">출처: {source.title} · {source.authors.join(', ')} · {source.year || '연도 미확인'} · {source.verification} · {source.access}<br /><a href={source.url} target="_blank" rel="noreferrer" className="text-indigo-600 underline dark:text-indigo-300">원문/서지 링크</a></p>)}
            </div>
            {comparisons.length > 0 && <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100"><p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" /> 중복·유사·상충 가능성을 확인해 주세요. 자동 비교는 판정이 아닙니다.</p>{comparisons.map((item) => <p key={item.otherId} className="mt-1">{item.kind} · {item.otherId} · {Math.round(item.score * 100)}% · {item.reason}</p>)}<label className="mt-2 flex items-start gap-2"><input type="checkbox" checked={duplicateChecked} onChange={(event) => setDuplicateChecked(event.target.checked)} /> 각각의 차이 또는 중복 처리 결과를 직접 검토했습니다.</label></div>}
            <label className="mt-3 block text-xs">출처·중복·학파 차이 검토 메모<textarea value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} rows={3} className="mt-1 block w-full rounded-lg border bg-transparent px-3 py-2 text-sm" /></label>
            <div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={working || !hasVerifiedFullTextSource(selectedDraft.sources)} onClick={() => void approveDraft()} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"><Check className="h-4 w-4" /> 검토 후 승인·공개</button><button type="button" disabled={working || reviewNote.trim().length < 20} onClick={() => void rejectDraft()} className="rounded-lg border border-rose-300 px-4 py-2 text-sm text-rose-700 disabled:opacity-50 dark:border-rose-900 dark:text-rose-300">반려</button></div>
          </> : <p className="text-sm text-slate-500">왼쪽에서 검토할 초안을 선택하세요. 자동 승인·자동 등록은 하지 않습니다.</p>}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><History className="h-4 w-4" /> 승인 지식과 버전</h2>
        <div className="space-y-2">{published.map((card) => <div key={card.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700"><div><strong className="text-sm">{card.title}</strong><p className="text-xs text-slate-500">{ENGINE_OPTIONS.find((engine) => engine.id === card.engineId)?.label} · v{card.version ?? 1} · {card.school || '학파 미표기'} · {card.active ? '상담 사용 중' : '중지'}</p></div><button type="button" disabled={working} onClick={() => void loadHistory(card)} className="rounded-lg border px-3 py-2 text-xs">버전 기록</button></div>)}{published.length === 0 && <p className="text-sm text-slate-500">아직 공개된 카드가 없습니다.</p>}</div>
        {history.length > 0 && <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><h3 className="text-sm font-semibold">{history[0].title} · 과거 버전</h3>{history.map((version) => <div key={version.versionId || version.id} className="flex items-center justify-between gap-2 text-xs"><span>v{version.version} · {version.approvedAt || '승인일 미기록'}{version.restoredFrom ? ' · 복원본' : ''}</span>{version.active !== false && <button type="button" disabled={working} onClick={() => void restoreVersion(version.cardId || version.id, version)} className="rounded-md border px-2 py-1">이 버전 내용으로 새 버전 복원</button>}</div>)}</div>}
      </section>
      <p className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500 dark:bg-slate-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />점술 해석은 전통·상징 해석이며 과학적 예측의 입증이 아닙니다. 계산 알고리즘은 자동 수정하지 않습니다. AI 결과는 초안일 뿐이고, 출처 확인과 관리자의 승인·버전 저장 이후에만 세 상담 모드의 공통 계산 경로에 제한적으로 연결됩니다.</p>
    </main>
  );
}
