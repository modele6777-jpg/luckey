import { useState, type ReactElement, type ReactNode } from 'react';
import type { DivinationToolId } from '@/lib/fifteenDivinationTools';

/**
 * 🧭 점술모드 3단계 · 13대 도구 전용 화면.
 * 엔진이 실제로 계산한 값만 그린다. 값이 없으면 그 부분은 그리지 않는다 (지어내지 않음).
 * 숙요·마하보테·카발라는 계산 기준 재검토 중이라 개인 값 없이 도구의 구조만 보여준다.
 */

type Data = Record<string, any>;
const s = (v: unknown): string => (typeof v === 'string' ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : '');
const arr = <T = any,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

function Panel({ title, children, note }: { title?: string; children: ReactNode; note?: string }) {
  return (
    <section className="mt-2.5 rounded-xl border border-white/10 bg-black/25 p-2.5">
      {title && <p className="mb-1.5 text-[11px] font-bold text-amber-200/90">{title}</p>}
      {children}
      {note && <p className="mt-1.5 text-[10px] text-slate-400 break-keep">{note}</p>}
    </section>
  );
}

function Line({ label, value }: { label: string; value: unknown }) {
  const text = s(value);
  if (!text) return null;
  return (
    <p className="text-[11.5px] leading-relaxed text-slate-100 break-keep">
      <span className="mr-1.5 text-amber-200/85">{label}</span>{text}
    </p>
  );
}

/** 천간·지지 한자 → 한글 읽기 (초보자용 작은 글씨) */
const HANJA_KO: Record<string, string> = {
  甲: '갑', 乙: '을', 丙: '병', 丁: '정', 戊: '무', 己: '기', 庚: '경', 辛: '신', 壬: '임', 癸: '계',
  子: '자', 丑: '축', 寅: '인', 卯: '묘', 辰: '진', 巳: '사', 午: '오', 未: '미', 申: '신', 酉: '유', 戌: '술', 亥: '해',
};
const ko = (hanja: string) => hanja.split('').map(ch => HANJA_KO[ch] || '').join('');

const GOOD = /대길|길|Go|상생|화합|추진/;
const BAD = /흉|주의|Stop|보류|관리/;
const tone = (text: string) => (BAD.test(text) ? 'text-rose-200 border-rose-300/40 bg-rose-500/10' : GOOD.test(text) ? 'text-emerald-200 border-emerald-300/40 bg-emerald-500/10' : 'text-amber-100 border-amber-200/30 bg-amber-400/10');
function Badge({ children }: { children: string }) {
  if (!children) return null;
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${tone(children)}`}>{children}</span>;
}

/* ───────────── 1. 홍국기문 (기문둔갑 9궁) ───────────── */
const QIMEN_DIR: Record<string, string> = { 巽: '남동', 離: '남', 坤: '남서', 震: '동', 中: '중앙', 兌: '서', 艮: '북동', 坎: '북', 乾: '북서' };
/** 8문: 한글 읽기와 길흉 (생·개·휴 = 길, 경景·두 = 평, 사·경驚·상 = 흉) */
const QIMEN_DOOR: Record<string, { ko: string; luck: 'good' | 'mid' | 'bad' }> = {
  生門: { ko: '생문', luck: 'good' }, 開門: { ko: '개문', luck: 'good' }, 休門: { ko: '휴문', luck: 'good' },
  景門: { ko: '경문(景)', luck: 'mid' }, 杜門: { ko: '두문', luck: 'mid' },
  死門: { ko: '사문', luck: 'bad' }, 驚門: { ko: '경문(驚)', luck: 'bad' }, 傷門: { ko: '상문', luck: 'bad' },
};
const QIMEN_GOD: Record<string, string> = { 值符: '직부', 騰蛇: '등사', 太陰: '태음', 六合: '육합', 白虎: '백호', 玄武: '현무', 九地: '구지', 九天: '구천' };
const QIMEN_STAR: Record<string, string> = { 天蓬: '천봉', 天任: '천임', 天沖: '천충', 天輔: '천보', 天英: '천영', 天芮: '천예', 天柱: '천주', 天心: '천심', 天禽: '천금' };
const DOOR_TONE = { good: 'text-emerald-300', mid: 'text-amber-100', bad: 'text-rose-300' } as const;
function QimenView({ d }: { d: Data }) {
  const c: Data = d.chabopPointChart?.chart;
  const dirs = arr<string>(c?.['方位']);
  if (!c || dirs.length !== 9) return null;
  const fuGong = s(c['值符落宮']);
  const shiGong = s(c['值使落宮']);
  const doors = arr<string>(c['天門']);
  const goodDirs = dirs.filter((_, i) => QIMEN_DOOR[doors[i]]?.luck === 'good').map(dir => QIMEN_DIR[dir]);
  return (
    <>
      <Panel title={`9궁 판 · ${s(c['陰陽']) === '陰' ? '음' : '양'}둔 ${s(c['局數'])}국 · ${s(c['節氣'])}`} note="위쪽이 남쪽이에요. 큰 글자는 천반, 작은 글자는 지반. 금색 테두리는 직부(우두머리 별), 초록 테두리는 직사(우두머리 문)가 떨어진 궁. 문 색: 초록 길 · 노랑 보통 · 분홍 흉. 지금 시각으로 세운 판이에요.">
        <div className="grid grid-cols-3 gap-1">
          {dirs.map((dir, i) => {
            const isFu = dir === fuGong;
            const isShi = dir === shiGong;
            const door = QIMEN_DOOR[doors[i]];
            const god = s(arr(c['八神'])[i]);
            const star = s(arr(c['九星'])[i]);
            return (
              <div
                key={dir}
                data-qimen-palace={dir}
                className={`relative rounded-lg border px-1 py-1.5 text-center ${isFu ? 'border-amber-300/80 bg-amber-400/15' : isShi ? 'border-emerald-300/70 bg-emerald-400/10' : dir === '中' ? 'border-white/10 bg-black/30' : 'border-white/10 bg-white/[0.04]'}`}
              >
                <div className="flex justify-between text-[8.5px] leading-tight text-slate-300/90">
                  <span>{QIMEN_GOD[god] || god}</span>
                  <span>{QIMEN_STAR[star] || star}</span>
                </div>
                <p className="mt-0.5 text-[18px] font-black leading-none text-white">{s(arr(c['天盤'])[i])}<span className="ml-0.5 align-top text-[9.5px] font-normal text-slate-400">{s(arr(c['地盤'])[i])}</span></p>
                <p className="text-[8.5px] text-slate-400">{ko(s(arr(c['天盤'])[i]))}/{ko(s(arr(c['地盤'])[i]))}</p>
                <p className={`mt-1 text-[10.5px] font-bold ${door ? DOOR_TONE[door.luck] : 'text-slate-500'}`}>{door ? door.ko : '—'}</p>
                <p className="text-[8.5px] text-slate-400">{QIMEN_DIR[dir] || dir}</p>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel>
        <Line label="직부" value={c['值符'] ? `${QIMEN_STAR[s(c['值符'])] || s(c['值符'])}(${s(c['值符'])}) → ${QIMEN_DIR[fuGong] || fuGong}` : ''} />
        <Line label="직사" value={c['值使'] ? `${QIMEN_DOOR[s(c['值使'])]?.ko || s(c['值使'])}(${s(c['值使'])}) → ${QIMEN_DIR[shiGong] || shiGong}` : ''} />
        <Line label="길한 문" value={goodDirs.length ? `${goodDirs.join(' · ')} 방향` : ''} />
        <Line label="시주" value={c['時柱'] ? `${s(c['時柱'])}(${ko(s(c['時柱']))})` : ''} />
        <p className="mt-1 text-[10px] text-slate-400 break-keep">{s(d.chabopPointChart?.method)}</p>
      </Panel>
    </>
  );
}

/* ───────────── 2. 자미두수 (12궁 명반) ───────────── */
const ZIWEI_POS: Record<string, [number, number]> = {
  사: [0, 0], 오: [0, 1], 미: [0, 2], 신: [0, 3],
  진: [1, 0], 유: [1, 3], 묘: [2, 0], 술: [2, 3],
  인: [3, 0], 축: [3, 1], 자: [3, 2], 해: [3, 3],
};
function ZiweiView({ d }: { d: Data }) {
  const palaces = arr<Data>(d.palaces);
  if (palaces.length !== 12) return null;
  // 지금 대한(10년 운): 태어난 해로 센 나이(세는나이)가 들어 있는 궁
  const birthYear = Number(s(d.input).slice(0, 4));
  const age = birthYear > 1900 ? new Date().getFullYear() - birthYear + 1 : 0;
  const nowPalace = age ? palaces.find(p => arr<number>(p.decadal).length === 2 && age >= p.decadal[0] && age <= p.decadal[1]) : undefined;
  return (
    <Panel title="12궁 명반" note={`금색은 명궁, 점선은 신궁, 하늘색은 지금 대한(${age ? `${age}세` : ''})이에요. 록·권·과·기는 사화(별의 변화).`}>
      <div className="grid grid-cols-4 grid-rows-4 gap-1" style={{ gridTemplateRows: 'repeat(4, minmax(4.2rem, auto))' }}>
        {palaces.map(p => {
          const pos = ZIWEI_POS[s(p.branch)];
          if (!pos) return null;
          const isLife = s(p.name) === '명궁';
          const stars = arr<Data>(p.major);
          const seen = new Set<string>();
          return (
            <div
              key={s(p.branch)}
              data-ziwei-palace={s(p.name)}
              style={{ gridRow: pos[0] + 1, gridColumn: pos[1] + 1 }}
              className={`rounded-lg p-1 ${isLife ? 'border border-amber-300/80 bg-amber-400/15' : p.body ? 'border border-dashed border-slate-300/60 bg-white/[0.04]' : 'border border-white/10 bg-white/[0.04]'} ${p === nowPalace ? 'ring-2 ring-sky-300/70' : ''}`}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-bold text-amber-100">{s(p.name)}</span>
                <span className="text-[8.5px] text-slate-400">{s(p.stem)}{s(p.branch)}</span>
              </div>
              <div className="mt-0.5 space-y-0.5">
                {stars.filter(star => { const k = s(star.name); if (seen.has(k)) return false; seen.add(k); return true; }).map(star => (
                  <p key={s(star.name)} className="text-[10.5px] font-bold leading-tight text-white">
                    {s(star.name)}
                    {s(star.mutagen) && <span className="ml-0.5 rounded bg-rose-500/70 px-0.5 text-[8px]">{s(star.mutagen)}</span>}
                  </p>
                ))}
                {arr<Data>(p.minor).slice(0, 2).map(star => <p key={s(star.name)} className="text-[8.5px] leading-tight text-slate-300/80">{s(star.name)}</p>)}
              </div>
              {arr<number>(p.decadal).length === 2 && <p className={`mt-0.5 text-[8px] ${p === nowPalace ? 'font-bold text-sky-200' : 'text-slate-500'}`}>{p.decadal[0]}–{p.decadal[1]}세{p === nowPalace ? ' · 지금' : ''}</p>}
            </div>
          );
        })}
        <div style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2' }} className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-black/30 p-2 text-center">
          <p className="text-[13px] font-black text-amber-100">紫微斗數</p>
          <p className="mt-1 text-[10px] text-slate-300">{s(d.lunarDate)}</p>
          <p className="text-[10px] text-slate-300">{s(d.fiveElementsClass)}</p>
          <p className="mt-1 text-[10px] text-amber-100/90">명궁 {s(d.soulPalace)} · 신궁 {s(d.bodyPalace)}</p>
        </div>
      </div>
    </Panel>
  );
}

/* ───────────── 3. 베딕 점성술 (남인도식 차트 + 다샤) ───────────── */
const RASHI = ['메샤', '브리샤바', '미투나', '카르카', '심하', '칸야', '툴라', '브리슈치카', '다누', '마카라', '쿰바', '미나'];
const SOUTH_GRID: Array<[number, number, number]> = [
  [11, 0, 0], [0, 0, 1], [1, 0, 2], [2, 0, 3],
  [10, 1, 0], [3, 1, 3], [9, 2, 0], [4, 2, 3],
  [8, 3, 0], [7, 3, 1], [6, 3, 2], [5, 3, 3],
];
const VEDIC_PLANET: Record<string, string> = { sun: '태양', moon: '달', mercury: '수성', venus: '금성', mars: '화성', jupiter: '목성', saturn: '토성' };
const RASHI_WEST = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', '천칭자리', '전갈자리', '궁수자리', '염소자리', '물병자리', '물고기자리'];
function VedicView({ d }: { d: Data }) {
  const planets: Data = d.planets || {};
  const asc = typeof d.ascendant === 'number' ? Math.floor(((d.ascendant % 360) + 360) % 360 / 30) : -1;
  const bySign: Record<number, string[]> = {};
  for (const [key, lon] of Object.entries(planets)) {
    if (typeof lon !== 'number' || !VEDIC_PLANET[key]) continue;
    const sign = Math.floor(((lon % 360) + 360) % 360 / 30);
    (bySign[sign] ||= []).push(VEDIC_PLANET[key]);
  }
  if (Object.keys(bySign).length === 0) return null;
  const a: Data = d.advanced || {};
  const dashas = arr<Data>(a.mahadashas);
  const current = s(a.currentDasha?.mahadasha?.lord);
  return (
    <>
      <Panel title="라시 차트 (남인도식)" note="칸마다 별자리(라시)는 고정이고, 금색이 라그나(상승궁)예요. 베딕은 실제 별 위치(항성황도) 기준이라 서양 별자리와 한 칸쯤 어긋날 수 있어요.">
        <div className="grid grid-cols-4 gap-1" style={{ gridTemplateRows: 'repeat(4, minmax(3.2rem, auto))' }}>
          {SOUTH_GRID.map(([sign, row, col]) => (
            <div key={sign} style={{ gridRow: row + 1, gridColumn: col + 1 }} className={`rounded-lg p-1 ${sign === asc ? 'border border-amber-300/80 bg-amber-400/15' : 'border border-white/10 bg-white/[0.04]'}`}>
              <p className="text-[8.5px] leading-tight text-slate-300">{RASHI[sign]}{sign === asc ? <b className="text-amber-200"> · 라그나</b> : ''}</p>
              <p className="text-[7.5px] leading-tight text-slate-500">{RASHI_WEST[sign]}</p>
              <p className="mt-0.5 text-[10.5px] font-bold leading-tight text-white">{(bySign[sign] || []).join(' ')}</p>
            </div>
          ))}
          <div style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2' }} className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-black/30 p-2 text-center">
            <p className="text-[12px] font-black text-amber-100">베딕 차트</p>
            {a.nakshatra && <p className="mt-1 text-[10px] text-slate-300">{s(a.nakshatra.name)} {s(a.nakshatra.pada)}파다</p>}
            {a.nakshatra?.meaning && <p className="text-[9.5px] text-slate-400 break-keep">{s(a.nakshatra.meaning)}</p>}
          </div>
        </div>
      </Panel>
      {dashas.length > 0 && (
        <Panel title="빔쇼타리 다샤 (인생의 큰 주기)">
          <div className="flex flex-wrap gap-1">
            {dashas.map(item => (
              <span key={`${s(item.lord)}${s(item.startDate)}`} className={`rounded-md border px-1.5 py-0.5 text-[10px] ${s(item.lord) === current && s(item.startDate) === s(a.currentDasha?.mahadasha?.startDate) ? 'border-amber-300/80 bg-amber-400/20 font-bold text-amber-100' : 'border-white/10 text-slate-300'}`}>
                {s(item.lord)} {s(item.startDate).slice(0, 4)}–{s(item.endDate).slice(0, 4)}
              </span>
            ))}
          </div>
          {a.currentDasha?.antardasha && <p className="mt-1.5 text-[11px] text-slate-200">지금은 <b className="text-amber-100">{current}</b> 대주기 속 <b className="text-amber-100">{s(a.currentDasha.antardasha.lord)}</b> 세부 주기 (~{s(a.currentDasha.antardasha.endDate).slice(0, 7)})</p>}
        </Panel>
      )}
    </>
  );
}

/* ───────────── 4. 주역 (본괘 → 지괘) ───────────── */
function Hexagram({ bits, moving = [] }: { bits: number[]; moving?: number[] }) {
  return (
    <div className="flex w-16 flex-col-reverse gap-1">
      {bits.map((bit, i) => (
        <div key={i} className="relative flex h-2 gap-1.5">
          {bit ? <div className="h-full flex-1 rounded-sm bg-amber-100" /> : <><div className="h-full flex-1 rounded-sm bg-amber-100" /><div className="h-full flex-1 rounded-sm bg-amber-100" /></>}
          {moving.includes(i + 1) && <span className="absolute -right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-rose-400" aria-label="변하는 효" />}
        </div>
      ))}
    </div>
  );
}
function IchingView({ d }: { d: Data }) {
  const primary: Data = d.primary;
  if (!primary || arr(primary.bits).length !== 6) return null;
  const changed: Data = d.changed;
  const g: Data = d.guidance || {};
  return (
    <>
      <Panel title="본괘 → 지괘" note="효는 아래에서부터 1효예요. 붉은 점이 변하는 효(동효)이고, 그 효가 바뀌어 지괘가 돼요.">
        <div className="flex items-center justify-around py-1">
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[9.5px] text-slate-400">본괘 · 지금</p>
            <Hexagram bits={arr<number>(primary.bits)} moving={arr<number>(d.movingLines)} />
            <p className="text-[11.5px] font-bold text-white">{s(primary.number)}. {s(primary.name)}</p>
            <p className="text-[9.5px] text-slate-400">{s(primary.upper)} / {s(primary.lower)}</p>
          </div>
          {changed && arr(changed.bits).length === 6 && (<>
            <span className="text-xl text-amber-200/70">→</span>
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-[9.5px] text-slate-400">지괘 · 앞으로</p>
              <Hexagram bits={arr<number>(changed.bits)} />
              <p className="text-[11.5px] font-bold text-white">{s(changed.number)}. {s(changed.name)}</p>
              <p className="text-[9.5px] text-slate-400">{s(changed.upper)} / {s(changed.lower)}</p>
            </div>
          </>)}
        </div>
      </Panel>
      <Panel>
        <div className="mb-1"><Badge>{s(d.decisionGrade)}</Badge></div>
        <Line label="지금" value={g.situationNow} />
        <Line label="숨은 흐름" value={g.hiddenDynamic} />
        <Line label="결과" value={g.outcomeFuture} />
        <Line label="행동" value={g.actionProtocol} />
        {d.tiYong && !s(g.actionProtocol).includes(s(d.tiYong.summary)) && <Line label="체용" value={`${s(d.tiYong.relationship)} — ${s(d.tiYong.summary)}`} />}
        {d.nuclear && <Line label="호괘" value={`${s(d.nuclear.number)}. ${s(d.nuclear.name)} (속에 숨은 흐름)`} />}
      </Panel>
    </>
  );
}

/* ───────────── 5. 육임 (사과·삼전) ───────────── */
function LiurenView({ d }: { d: Data }) {
  const lessons = arr<Data>(d.fourLessons);
  const three = arr<Data>(d.threeTransmissions);
  if (!lessons.length && !three.length) return null;
  const score = typeof d.decisionScore === 'number' ? Math.max(0, Math.min(100, d.decisionScore)) : null;
  return (
    <>
      <Panel title={`${s(d.patternName)} · ${s(d.dayStemBranch)}(${ko(s(d.dayStemBranch))})일 ${s(d.hourBranch)}(${ko(s(d.hourBranch))})시`} note="육임은 지금 이 시각으로 판을 세워 진행 중인 일의 흐름을 봐요.">
        {score != null && (
          <div className="mb-2">
            <div className="flex items-center justify-between text-[10.5px]"><Badge>{s(d.decisionGrade)}</Badge><span className="text-slate-300">추진 지수 {score}</span></div>
            <div className="mt-1 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-300" style={{ width: `${score}%` }} /></div>
          </div>
        )}
        <p className="text-[11.5px] leading-relaxed text-slate-100 break-keep">{s(d.patternGuidance)}</p>
      </Panel>
      {lessons.length === 4 && (
        <Panel title="사과 (네 가지 형세)">
          <div className="grid grid-cols-4 gap-1 text-center">
            {lessons.map(item => (
              <div key={s(item.name)} className="rounded-lg border border-white/10 bg-white/[0.04] p-1">
                <p className="text-[15px] font-black text-white">{s(item.upper)}<span className="ml-0.5 text-[9px] font-normal text-slate-400">{ko(s(item.upper))}</span></p>
                <p className="text-[11px] text-slate-400">{s(item.lower)}<span className="ml-0.5 text-[8.5px]">{ko(s(item.lower))}</span></p>
                <p className="mt-0.5 text-[8.5px] leading-tight text-slate-300 break-keep">{s(item.name).replace(/^제\d과\s*/, '')}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
      {three.length > 0 && (
        <Panel title="삼전 (일의 흐름)">
          <div className="flex items-stretch gap-1">
            {three.map((item, i) => (
              <div key={i} className="flex flex-1 items-center gap-1">
                <div className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-center">
                  <p className="text-[9px] text-slate-400">{s(item.stage).replace(/\(.*\)/, '')}</p>
                  <p className="text-[15px] font-black text-white">{s(item.branch)}<span className="ml-0.5 text-[9px] font-normal text-slate-400">{ko(s(item.branch))}</span></p>
                  <p className="text-[10px] text-amber-100">{s(item.general)}</p>
                </div>
                {i < three.length - 1 && <span className="text-amber-200/60">→</span>}
              </div>
            ))}
          </div>
          {d.primaryGeneral && <p className="mt-1.5 text-[11px] text-slate-200 break-keep"><b className="text-amber-100">{s(d.primaryGeneral.name)}</b> · {s(d.primaryGeneral.advice)}</p>}
        </Panel>
      )}
    </>
  );
}

/* ───────────── 6. 태을신수 (16궁) ───────────── */
const TAIYI_POS: Record<number, [number, number]> = {
  9: [0, 0], 10: [0, 1], 11: [0, 2], 12: [0, 3], 13: [0, 4],
  14: [1, 4], 15: [2, 4], 16: [3, 4],
  1: [4, 4], 2: [4, 3], 3: [4, 2], 4: [4, 1], 5: [4, 0],
  6: [3, 0], 7: [2, 0], 8: [1, 0],
};
function TaiyiView({ d }: { d: Data }) {
  const palaces = arr<Data>(d.palaces);
  const c: Data = d.calculation || {};
  if (palaces.length !== 16) return null;
  return (
    <>
      <Panel title={`16궁 · ${s(d.targetYear)}년 ${s(c.cycleName)}`} note="위쪽이 남쪽이에요. 금색은 태을이 머무는 궁.">
        <div className="grid grid-cols-5 gap-1" style={{ gridTemplateRows: 'repeat(5, minmax(2.9rem, auto))' }}>
          {palaces.map(p => {
            const pos = TAIYI_POS[p.palaceNumber];
            if (!pos) return null;
            const stars = arr<string>(p.stars);
            const isTaiyi = p.palaceNumber === c.taiyiPalace;
            return (
              <div key={p.palaceNumber} style={{ gridRow: pos[0] + 1, gridColumn: pos[1] + 1 }} className={`rounded-md p-0.5 text-center ${isTaiyi ? 'border border-amber-300/80 bg-amber-400/15' : stars.length ? 'border border-white/20 bg-white/[0.06]' : 'border border-white/10 bg-white/[0.03]'}`}>
                <p className="text-[11px] font-bold text-white">{s(p.name)}</p>
                {stars.slice(0, 2).map(star => <p key={star} className="text-[7.5px] leading-tight text-amber-100/90">{star.replace(/\(.*\)/, '')}</p>)}
              </div>
            );
          })}
          <div style={{ gridRow: '2 / span 3', gridColumn: '2 / span 3' }} className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-black/30 p-2 text-center">
            <p className="text-[12px] font-black text-amber-100">太乙</p>
            <p className="mt-1 text-[10px] text-slate-300">{s(c.juNumber)}국 {s(c.juType)}</p>
            <p className="text-[10px] text-slate-300">주산 {s(c.juSan)} · 객산 {s(c.gaekSan)}</p>
          </div>
        </div>
      </Panel>
      <Panel>
        <div className="mb-1"><Badge>{s(c.outcome)}</Badge></div>
        <Line label="풀이" value={c.outcomeReason} />
        <Line label="오복" value={d.fiveBlessings?.meaning} />
      </Panel>
    </>
  );
}

/* ───────────── 7. 토정비결 (올해 괘 + 열두 달) ───────────── */
function TojeongView({ d }: { d: Data }) {
  const months = arr<Data>(d.monthlyFortunes);
  const [month, setMonth] = useState<number | null>(null);
  if (!d.hexagramName) return null;
  const code = s(d.hexagramCode);
  const picked = months.find(m => m.month === month);
  return (
    <>
      <Panel title={`${s(d.targetYear)}년 (${s(d.targetYearGanZhi)}) 토정비결`}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {code.split('').map((digit, i) => (
              <div key={i} className="flex h-11 w-8 flex-col items-center justify-center rounded-md border border-amber-200/40 bg-amber-400/10">
                <p className="text-[15px] font-black text-amber-50">{digit}</p>
                <p className="text-[7.5px] text-slate-400">{['상괘', '중괘', '하괘'][i]}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[14px] font-black text-white">{s(d.hexagramName)}</p>
            <div className="mt-0.5 flex items-center gap-1.5"><Badge>{s(d.luckGrade)}</Badge><span className="text-[10px] text-slate-400">{s(d.movingLineLabel)}</span></div>
          </div>
        </div>
        <p className="mt-2 text-[11.5px] leading-relaxed text-slate-100 break-keep">{s(d.annualSummary)}</p>
      </Panel>
      {months.length === 12 && (
        <Panel title="열두 달 (음력)" note="달을 누르면 그 달의 풀이가 보여요.">
          <div className="grid grid-cols-6 gap-1">
            {months.map(m => (
              <button key={m.month} type="button" onClick={() => setMonth(month === m.month ? null : m.month)} className={`rounded-md border py-1 text-[11px] font-bold ${month === m.month ? 'border-amber-300/80 bg-amber-400/20 text-amber-50' : 'border-white/10 text-slate-200'}`}>{m.month}월</button>
            ))}
          </div>
          {picked && (
            <div className="mt-2 space-y-1">
              <p className="text-[11.5px] leading-relaxed text-slate-100 break-keep">{s(picked.fortune)}</p>
              <Line label="팁" value={picked.tip} />
            </div>
          )}
        </Panel>
      )}
    </>
  );
}

/* ───────────── 8. 구성학 (9궁 연반 + 방위 점수) ───────────── */
const KYUSEI_GRID = ['남동', '남', '남서', '동', '중앙', '서', '북동', '북', '북서'];
const STAR_NAME = ['', '일백', '이흑', '삼벽', '사록', '오황', '육백', '칠적', '팔백', '구자'];
/** 구성 고유 색 (일백 흰 · 이흑 검 · 삼벽 청록 · 사록 초록 · 오황 노랑 · 육백 흰 · 칠적 빨강 · 팔백 흰 · 구자 보라) */
const STAR_COLOR = ['', '#f8fafc', '#94a3b8', '#5eead4', '#86efac', '#fde047', '#f1f5f9', '#fca5a5', '#e2e8f0', '#d8b4fe'];
function KyuseiView({ d }: { d: Data }) {
  const chart: Data = d.annualChart || {};
  const starByDir: Record<string, number> = Object.fromEntries(arr<Data>(chart.palaces).map(p => [s(p.direction), p.star]));
  starByDir['중앙'] = chart.centerStar;
  const scoreByDir: Record<string, Data> = Object.fromEntries(arr<Data>(d.directionalScores).map(p => [s(p.direction), p]));
  if (!chart.centerStar) return null;
  return (
    <>
      <Panel title={`${s(chart.label) || '연반'} · 중궁 ${s(chart.centerStarName)}`} note="위쪽이 남쪽이에요. 아래 글씨는 지금 시기 그 방위의 길흉 (내 본명성과 연·월반 흉살 기준). ‘나’는 본명성이 있는 자리.">
        <div className="grid grid-cols-3 gap-1">
          {KYUSEI_GRID.map(dir => {
            const star = starByDir[dir];
            const score = scoreByDir[dir];
            const level = s(score?.level);
            return (
              <div key={dir} className={`aspect-[4/3] rounded-lg border p-1 text-center ${dir === '중앙' ? 'border-amber-300/70 bg-amber-400/10' : 'border-white/10 bg-white/[0.04]'}`}>
                <p className="text-[9px] text-slate-400">{dir}</p>
                <p className="text-[17px] font-black leading-tight" style={{ color: STAR_COLOR[star] || '#fff' }}>{star || ''}</p>
                <p className="text-[9px] text-amber-100/90">{star ? STAR_NAME[star] : ''}{star && star === d.honmyosei?.star ? <b className="ml-0.5 rounded bg-amber-400/80 px-0.5 text-[8px] text-slate-950">나</b> : null}</p>
                {level && <p className={`text-[9px] font-bold ${BAD.test(level) ? 'text-rose-300' : GOOD.test(level) ? 'text-emerald-300' : 'text-slate-300'}`}>{level}</p>}
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel>
        <Line label="본명성" value={d.honmyosei?.name} />
        <Line label="월명성" value={d.getmyosei?.name} />
        <Line label="오늘의 일성" value={d.ilmyosei?.name} />
        <Line label="최길 방위" value={d.topFortuneDirection ? `${s(d.topFortuneDirection.direction)} — ${s(d.topFortuneDirection.relation)}` : ''} />
      </Panel>
    </>
  );
}

/* ───────────── 9. 태국 점성술 (요일 수호신 + 마하탁사) ───────────── */
const THAI_PLANET: Record<string, string> = { sun: '태양', moon: '달', mars: '화성', mercury: '수성', jupiter: '목성', venus: '금성', saturn: '토성', rahu: '라후' };
function ThaiView({ d }: { d: Data }) {
  const birth: Data = d.birthDayPlanet;
  if (!birth) return null;
  const seq = arr<Data>(d.mahaThaksa?.sequence);
  const cur: Data = d.mahaThaksa?.current;
  const total = seq.length ? seq[seq.length - 1].endAge : 0;
  return (
    <>
      <Panel title="태어난 요일의 수호신">
        <p className="text-[14px] font-black text-white">{s(birth.thaiName)} <span className="text-[11px] font-normal text-slate-400">{s(birth.translit)}</span></p>
        <p className="text-[11px] text-amber-100">{s(birth.weekday)} · {s(birth.planet)} · {s(birth.cycleYears)}년 주기</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10.5px] text-slate-200">
          {arr<string>(birth.colors).map(color => <span key={color} className="rounded-full border border-white/15 px-2 py-0.5">🎨 {color}</span>)}
          {birth.direction && <span className="rounded-full border border-white/15 px-2 py-0.5">🧭 {s(birth.direction)}</span>}
          {birth.animal && <span className="rounded-full border border-white/15 px-2 py-0.5">{s(birth.animal)}</span>}
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300 break-keep">{s(birth.character)}</p>
      </Panel>
      {seq.length > 0 && total > 0 && (
        <Panel title="마하탁사 (108년 대운)">
          <div className="flex h-6 overflow-hidden rounded-md border border-white/10">
            {seq.map(item => {
              const active = cur && item.planetId === cur.planetId && item.startAge === cur.startAge;
              return (
                <div key={`${item.planetId}${item.startAge}`} style={{ width: `${((item.endAge - item.startAge + 1) / total) * 100}%` }} className={`flex items-center justify-center border-r border-black/30 text-[8.5px] ${active ? 'bg-amber-400/40 font-bold text-amber-50' : 'bg-white/[0.05] text-slate-400'}`} title={`${THAI_PLANET[item.planetId] || item.planetId} ${item.startAge}–${item.endAge}세`}>
                  {THAI_PLANET[item.planetId]?.slice(0, 1)}
                </div>
              );
            })}
          </div>
          {cur && (
            <div className="mt-1.5 space-y-0.5">
              <p className="text-[11px] text-slate-200">지금: <b className="text-amber-100">{THAI_PLANET[cur.planetId] || cur.planetId}</b> 대운 {s(cur.startAge)}–{s(cur.endAge)}세 {cur.attribute && <Badge>{`${s(cur.attribute.korean)} · ${s(cur.attribute.verdictClass)}`}</Badge>}</p>
              <p className="text-[10.5px] leading-relaxed text-slate-300 break-keep">{s(cur.attribute?.meaning)}</p>
            </div>
          )}
        </Panel>
      )}
    </>
  );
}

/* ───────────── 10. 서양 점성술 (출생 차트 휠) ───────────── */
const TEXT_GLYPH = '\uFE0E';
const SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const SIGN_KO = ['양', '황소', '쌍둥이', '게', '사자', '처녀', '천칭', '전갈', '궁수', '염소', '물병', '물고기'];
const ELEMENT_OF_SIGN = ['#fb7185', '#d97706', '#7dd3fc', '#818cf8'];
const WEST_PLANET: Array<[string, string, string]> = [
  ['sun', '☉', '태양'], ['moon', '☽', '달'], ['mercury', '☿', '수성'], ['venus', '♀', '금성'],
  ['mars', '♂', '화성'], ['jupiter', '♃', '목성'], ['saturn', '♄', '토성'],
];
function AstrologyView({ d }: { d: Data }) {
  if (!d.sun?.sign) return null;
  const R = 92;
  const hasAsc = Boolean(d.timeKnown) && typeof d.ascendant?.longitude === 'number';
  // 상승궁(ASC)을 왼쪽(9시)에 두는 전통 배치. 시간이 없으면 양자리 0°를 왼쪽에.
  const base = hasAsc ? d.ascendant.longitude : 0;
  const pt = (lon: number, r: number) => {
    const a = (180 + (lon - base)) * (Math.PI / 180);
    return [100 + r * Math.cos(a), 100 - r * Math.sin(a)];
  };
  const planets = WEST_PLANET.filter(([key]) => typeof d[key]?.longitude === 'number');
  // 가까이 붙은 행성은 반지름을 바꿔 겹치지 않게
  const sorted = [...planets].sort((a, b) => d[a[0]].longitude - d[b[0]].longitude);
  const radius: Record<string, number> = {};
  sorted.forEach(([key], i) => {
    const prev = sorted[i - 1];
    const close = prev && Math.abs(d[key].longitude - d[prev[0]].longitude) < 12;
    radius[key] = close && radius[prev[0]] === R - 34 ? R - 50 : R - 34;
  });
  const el: Data = d.elements || {};
  return (
    <>
      <Panel title="출생 차트 (열대황도)" note={hasAsc ? '왼쪽 ASC가 태어난 순간 동쪽 지평선에 떠오르던 별자리(상승궁)예요.' : '태어난 시간이 없어 행성은 정오 기준 참고값이고, 상승궁은 계산하지 않았어요.'}>
        <svg viewBox="0 0 200 200" className="mx-auto block w-full max-w-[16rem]" role="img" aria-label="출생 차트 휠">
          <circle cx="100" cy="100" r={R} fill="rgba(0,0,0,.25)" stroke="rgba(252,211,77,.5)" />
          <circle cx="100" cy="100" r={R - 20} fill="none" stroke="rgba(255,255,255,.14)" />
          <circle cx="100" cy="100" r="22" fill="none" stroke="rgba(255,255,255,.08)" />
          {SIGNS.map((sym, i) => {
            const [x1, y1] = pt(i * 30, R - 20);
            const [x2, y2] = pt(i * 30, R);
            const [tx, ty] = pt(i * 30 + 15, R - 10);
            return (
              <g key={sym}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,.18)" />
                <text x={tx} y={ty + 3.6} textAnchor="middle" fontSize="10" fill={ELEMENT_OF_SIGN[i % 4]} style={{ fontFamily: 'serif' }}>{sym + TEXT_GLYPH}</text>
              </g>
            );
          })}
          {hasAsc && (() => {
            const [x, y] = pt(base, R);
            const [x2, y2] = pt(base + 180, R);
            return (
              <g>
                <line x1={x} y1={y} x2={x2} y2={y2} stroke="rgba(252,211,77,.55)" strokeDasharray="3 3" />
                <text x={x + 2} y={y - 3} fontSize="7" fill="#fde68a">ASC</text>
              </g>
            );
          })()}
          {planets.map(([key, glyph]) => {
            const [x, y] = pt(d[key].longitude, radius[key]);
            const [lx, ly] = pt(d[key].longitude, R - 20);
            const [px, py] = pt(d[key].longitude, radius[key] + 7);
            return (
              <g key={key}>
                <line x1={px} y1={py} x2={lx} y2={ly} stroke="rgba(255,255,255,.25)" />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="11.5" fill="#fff" style={{ fontFamily: 'serif' }}>{glyph + TEXT_GLYPH}</text>
              </g>
            );
          })}
        </svg>
        <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5">
          {planets.map(([key, glyph, name]) => (
            <p key={key} className="text-[10.5px] text-slate-200"><span className="mr-1 font-serif text-amber-100">{glyph + TEXT_GLYPH}</span>{name} · {SIGN_KO[Math.floor(d[key].longitude / 30) % 12]} {Math.floor(d[key].degree ?? d[key].longitude % 30)}°</p>
          ))}
        </div>
      </Panel>
      <Panel>
        <Line label="☉ 태양" value={`${s(d.sun.sign.name)} — ${s(d.sun.sign.coreTrait)}`} />
        <Line label="☽ 달" value={d.moon?.sign ? `${s(d.moon.sign.name)} — ${s(d.moon.sign.emotionalTendency)}` : ''} />
        {hasAsc && <Line label="ASC" value={d.ascendant?.sign ? `${s(d.ascendant.sign.name)} — ${s(d.ascendant.sign.coreTrait)}` : ''} />}
        {['fire', 'earth', 'air', 'water'].some(k => typeof el[k] === 'number') && (
          <>
            <div className="mt-2 flex h-2 overflow-hidden rounded-full">
              {[['fire', ELEMENT_OF_SIGN[0]], ['earth', ELEMENT_OF_SIGN[1]], ['air', ELEMENT_OF_SIGN[2]], ['water', ELEMENT_OF_SIGN[3]]].map(([k, color]) => <div key={k} style={{ width: `${el[k] || 0}%`, background: color }} />)}
            </div>
            <p className="mt-1 text-[10px] text-slate-400">불 {s(el.fire)}% · 흙 {s(el.earth)}% · 공기 {s(el.air)}% · 물 {s(el.water)}%{el.dominant ? ` — 강한 원소 ${s(el.dominant)}` : ''}</p>
          </>
        )}
      </Panel>
    </>
  );
}

/* ───────────── 11~13. 숙요·마하보테·카발라 (구조만, 개인 값 없음) ───────────── */
/** 27숙 (각부터, 우宿 제외) — 엔진(sukuyoEngine)의 순서와 같다. */
const MANSIONS = ['角', '亢', '氐', '房', '心', '尾', '箕', '斗', '女', '虛', '危', '室', '壁', '奎', '婁', '胃', '昴', '畢', '觜', '參', '井', '鬼', '柳', '星', '張', '翼', '軫'];
/** 삼구(三九) 관계: 나(명)에서 몇 칸 떨어졌는지 → 명·영·쇠·안·위·성·괴·우·친 / 업 / 태 */
const SANKYU = ['명', '영', '쇠', '안', '위', '성', '괴', '우', '친', '업', '영', '쇠', '안', '위', '성', '괴', '우', '친', '태', '영', '쇠', '안', '위', '성', '괴', '우', '친'];
const SANKYU_TONE: Record<string, string> = { 명: '#fcd34d', 업: '#fcd34d', 태: '#fcd34d', 영: '#86efac', 안: '#86efac', 성: '#86efac', 우: '#7dd3fc', 친: '#7dd3fc', 쇠: '#fda4af', 위: '#fda4af', 괴: '#fda4af' };
function SukuyoView({ d }: { d?: Data }) {
  const adv: Data = d?.advanced || {};
  const me: Data = adv.mansion;
  const myIndex = typeof me?.index === 'number' ? me.index : -1;
  if (myIndex < 0) {
    return (
      <Panel title="27숙 (달이 머무는 스물일곱 집)">
        <svg viewBox="0 0 200 200" className="mx-auto block w-full max-w-[13rem]" role="img" aria-label="27숙 원">
          <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(252,211,77,.35)" />
          {MANSIONS.map((m, i) => {
            const a = (i / 27) * Math.PI * 2 - Math.PI / 2;
            return <text key={m} x={100 + 72 * Math.cos(a)} y={100 + 72 * Math.sin(a) + 3.5} textAnchor="middle" fontSize="9.5" fill="rgba(253,230,138,.85)">{m}</text>;
          })}
          <text x="100" y="104" textAnchor="middle" fontSize="13" fill="#fff">宿曜</text>
        </svg>
        <p className="mt-2 text-[11px] text-slate-300 break-keep">생년월일이 있으면 내 본명숙과 27숙과의 관계가 여기에 그려져요. (윤달 출생은 계산을 보류해요)</p>
      </Panel>
    );
  }
  return (
    <>
      <Panel title="27숙 원 · 나와 각 숙의 관계 (삼구)" note="금색 = 명·업·태(나와 깊이 얽힌 숙), 초록 = 영·안·성(돕는 관계), 하늘 = 우·친(편한 관계), 분홍 = 쇠·위·괴(조심할 관계). 맨 위가 내 본명숙.">
        <svg viewBox="0 0 220 220" className="mx-auto block w-full max-w-[15rem]" role="img" aria-label="본명숙과 27숙 관계">
          <circle cx="110" cy="110" r="96" fill="rgba(0,0,0,.25)" stroke="rgba(252,211,77,.4)" />
          {MANSIONS.map((m, i) => {
            const dist = (i - myIndex + 27) % 27;
            const a = (dist / 27) * Math.PI * 2 - Math.PI / 2;
            const x = 110 + 82 * Math.cos(a);
            const y = 110 + 82 * Math.sin(a);
            const rel = SANKYU[dist];
            const mine = dist === 0;
            return (
              <g key={m}>
                <circle cx={x} cy={y} r={mine ? 11 : 8.5} fill={mine ? 'rgba(252,211,77,.35)' : 'rgba(20,12,35,.9)'} stroke={SANKYU_TONE[rel]} strokeWidth={mine ? 1.6 : 0.9} />
                <text x={x} y={y + 3} textAnchor="middle" fontSize={mine ? 10 : 8} fill="#fff">{m}</text>
                <text x={110 + 64 * Math.cos(a)} y={110 + 64 * Math.sin(a) + 2.5} textAnchor="middle" fontSize="6.5" fill={SANKYU_TONE[rel]}>{rel}</text>
              </g>
            );
          })}
          <text x="110" y="104" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#fde68a">{s(me.hanja)}</text>
          <text x="110" y="120" textAnchor="middle" fontSize="8" fill="rgba(226,232,240,.85)">{s(me.fullName)}</text>
          <text x="110" y="132" textAnchor="middle" fontSize="7" fill="rgba(148,163,184,.9)">본명숙</text>
        </svg>
      </Panel>
      <Panel>
        <Line label="본명숙" value={`${s(me.name)}수(${s(me.hanja)}) · ${s(me.group)}`} />
        <Line label="칠요" value={me.luminary ? `${s(me.luminary)} — 수호 기운 ${s(adv.planetaryGuard?.elementAffinity)}` : ''} />
        <Line label="음력 생일" value={d?.lunarMonth ? `${s(d.lunarMonth)}월 ${s(d.lunarDay)}일` : ''} />
        <Line label="삼구 시기" value={adv.sanKyuCycle?.nineMansionPhase} />
        {adv.shukguk?.ko && <p className="mt-1 text-[10px] text-slate-400 break-keep">숙격 {s(adv.shukguk.ko)}({s(adv.shukguk.trait)})은 원전 대조가 끝나지 않아 참고로만 봐주세요.</p>}
      </Panel>
    </>
  );
}
/** 마하보테 7궁: 엔진(mahaboteEngine)의 궁 이름·구분과 같다. 개인 배치는 재검토 중이라 그리지 않는다. */
const MAHABOTE_HOUSES: Array<[string, string, string]> = [
  ['빙가', '動', '평길'], ['아타', '破', '시험'], ['야자', '王', '대길'], ['아디파디', '主', '대길'],
  ['마라나', '絶', '시험'], ['띠케', '財', '대길'], ['푸티', '榮', '평길'],
];
function MahaboteView({ d }: { d?: Data }) {
  const houses = arr<Data>(d?.houses);
  const placed = houses.length === 7;
  return (
    <>
      <Panel title="마하보테 7궁 (미얀마 8요일 점성술)" note={placed ? '금색 테두리가 내가 태어난 요일의 행성이 앉은 본명궁이에요. 야자·아디파디·띠케가 3대 길궁.' : undefined}>
        <div className="grid grid-cols-4 gap-1 text-center">
          {MAHABOTE_HOUSES.map(([house, hanja, kind], i) => {
            const h = placed ? houses[i] : null;
            const root = Boolean(h?.isBirthRootHouse);
            return (
              <div key={house} className={`rounded-lg border p-1.5 ${root ? 'border-amber-300/90 bg-amber-400/20' : kind === '대길' ? 'border-amber-300/35 bg-amber-400/[0.07]' : 'border-white/10 bg-white/[0.04]'}`}>
                <p className="text-[13px] font-black text-white">{hanja}</p>
                <p className="text-[10px] font-bold text-amber-100">{house}</p>
                <p className="text-[8.5px] text-slate-400">{kind}</p>
                {h && <p className={`mt-0.5 text-[9.5px] ${root ? 'font-bold text-amber-50' : 'text-slate-200'}`}>{s(h.planet?.koreanName).replace(/요일/, '')}</p>}
              </div>
            );
          })}
        </div>
        {!placed && <p className="mt-1.5 text-[10px] text-slate-400 break-keep">태어난 요일(수요일은 낮·밤 둘로 나눠 8요일)의 행성이 일곱 집 중 어디에 놓이느냐로 타고난 생명력과 주기를 봐요.</p>}
      </Panel>
      {placed && (
        <Panel>
          <Line label="미얀마력" value={d?.myanmarEra ? `${s(d.myanmarEra)}년` : ''} />
          <Line label="태어난 요일" value={d?.birthPlanet ? `${s(d.birthPlanet.koreanName)} · ${s(d.birthPlanet.animal)} · ${s(d.birthPlanet.direction)}` : ''} />
          <Line label="본명궁" value={d?.rootHouse ? `${s(d.rootHouse.houseName)} — ${s(d.rootHouse.category)}` : ''} />
          {d?.currentAgeTransit && <p className="mt-1 text-[10px] text-slate-400 break-keep">올해 나이 흐름: {s(d.currentAgeTransit.transitHouseName)} (전통 산식 대조 전이라 상징 참고)</p>}
        </Panel>
      )}
    </>
  );
}
/** 10 세피로트를 번호 순서(1 케테르 … 10 말쿠트)로. 보는 쪽 기준 오른쪽이 자비의 기둥(호크마·헤세드·네차흐). */
const SEPHIROT: Array<[string, number, number]> = [
  ['케테르', 100, 14], ['호크마', 148, 42], ['비나', 52, 42], ['헤세드', 148, 88], ['게부라', 52, 88],
  ['티페레트', 100, 112], ['네차흐', 148, 150], ['호드', 52, 150], ['예소드', 100, 170], ['말쿠트', 100, 196],
];
/** 경로 번호(11~32) → 이어지는 두 세피라 (황금여명 통용표, 엔진 PATHS_22 와 같음) */
const PATH_ENDS: Record<number, [number, number]> = {
  11: [0, 1], 12: [0, 2], 13: [0, 5], 14: [1, 2], 15: [1, 5], 16: [1, 3], 17: [2, 5], 18: [2, 4], 19: [3, 4], 20: [3, 5], 21: [3, 6],
  22: [4, 5], 23: [4, 7], 24: [5, 6], 25: [5, 8], 26: [5, 7], 27: [6, 7], 28: [6, 8], 29: [6, 9], 30: [7, 8], 31: [7, 9], 32: [8, 9],
};
function KabbalahView({ d }: { d?: Data }) {
  const n: Data | undefined = d?.numerology;
  const lifeIdx = n && typeof n.lifePathSephirah?.number === 'number' && n.lifePathSephirah.number > 0 ? n.lifePathSephirah.number - 1 : -1;
  const persIdx = n && typeof n.personalitySephirah?.number === 'number' ? n.personalitySephirah.number - 1 : -1;
  const soul = n?.soulPath && PATH_ENDS[n.soulPath.number];
  const daath = n?.lifePathNumber === 22;
  return (
    <>
      <Panel title="생명나무 (10 세피로트 · 22 경로)" note={n ? '금색 = 라이프 패스 세피라, 하늘색 = 생일수 세피라, 분홍 선 = 타로 탄생 카드의 경로.' : undefined}>
        <svg viewBox="0 0 200 212" className="mx-auto block w-full max-w-[12.5rem]" role="img" aria-label="생명나무">
          {Object.entries(PATH_ENDS).map(([num, [a, b]]) => {
            const active = soul && Number(num) === n?.soulPath?.number;
            return <line key={num} x1={SEPHIROT[a][1]} y1={SEPHIROT[a][2]} x2={SEPHIROT[b][1]} y2={SEPHIROT[b][2]} stroke={active ? '#fb7185' : 'rgba(252,211,77,.28)'} strokeWidth={active ? 2.4 : 1} />;
          })}
          {daath && <circle cx="100" cy="66" r="8" fill="rgba(252,211,77,.25)" stroke="#fcd34d" strokeDasharray="2 2" />}
          {SEPHIROT.map(([name, x, y], i) => {
            const life = i === lifeIdx;
            const pers = i === persIdx;
            return (
              <g key={name}>
                <circle cx={x} cy={y} r={life || pers ? 11.5 : 10} fill={life ? 'rgba(252,211,77,.35)' : pers ? 'rgba(125,211,252,.3)' : 'rgba(30,20,50,.95)'} stroke={life ? '#fcd34d' : pers ? '#7dd3fc' : 'rgba(252,211,77,.6)'} strokeWidth={life || pers ? 1.6 : 1} />
                <text x={x} y={y + 2.5} textAnchor="middle" fontSize="5.6" fill="#fde68a">{name}</text>
              </g>
            );
          })}
        </svg>
        {!n && <p className="mt-2 text-[11px] text-slate-300 break-keep">생년월일이 있으면 내 라이프 패스·생일수·탄생 카드 자리가 나무 위에 표시돼요.</p>}
      </Panel>
      {n && (
        <Panel>
          <Line label="라이프 패스" value={`${s(n.lifePathNumber)} → ${daath ? '다트(숨겨진 세피라)' : `${s(n.lifePathSephirah?.name)}(${s(n.lifePathSephirah?.meaning)})`}`} />
          <Line label="생일수" value={`${s(n.personalityNumber)} → ${s(n.personalitySephirah?.name)}(${s(n.personalitySephirah?.meaning)})`} />
          <Line label="탄생 카드" value={n.soulPath ? `${s(n.soulPath.tarotNumber)} ${s(n.soulPath.tarotName)} → ${s(n.soulPath.number)}번 경로 ${s(n.soulPath.hebrewLetter)} ${s(n.soulPath.letterName)}` : ''} />
          <Line label="세계" value={n.dominantWorld ? `${s(n.dominantWorld.name)}(${s(n.dominantWorld.korean)})` : ''} />
          <p className="mt-1 text-[10px] text-slate-400 break-keep">전통 유대 카발라 계산이 아니라, 헤르메틱(황금여명) 대응표에 생년월일 수비학과 타로 탄생 카드를 얹은 현대식 상징 해석이에요.</p>
        </Panel>
      )}
    </>
  );
}

const VIEWS: Partial<Record<DivinationToolId, (props: { d: Data }) => ReactElement | null>> = {
  qimen: QimenView, ziwei: ZiweiView, vedic: VedicView, iching: IchingView, liuren: LiurenView,
  taiyi: TaiyiView, tojeong: TojeongView, kyusei: KyuseiView, thai_astrology: ThaiView, astrology: AstrologyView,
};
const HELD: Partial<Record<DivinationToolId, () => ReactElement>> = {};
/** 계산값이 없어도 구조(원·7궁)는 보여주는 도구 */
const STRUCTURE_FALLBACK: Partial<Record<DivinationToolId, (props: { d?: Data }) => ReactElement>> = { sukuyo: SukuyoView, mahabote: MahaboteView, kabbalah: KabbalahView };

/** 도구 전용 화면. 계산값이 없거나 그릴 수 없으면 null. */
export function ToolDetailView({ id, data }: { id: DivinationToolId; data: unknown }) {
  const Held = HELD[id];
  if (Held) return <Held />;
  const WithFallback = STRUCTURE_FALLBACK[id];
  if (WithFallback) return <WithFallback d={data && typeof data === 'object' ? (data as Data) : undefined} />;
  const View = VIEWS[id];
  if (!View || !data || typeof data !== 'object') return null;
  try {
    return <View d={data as Data} />;
  } catch {
    return null;
  }
}

export const TOOL_VIEW_IDS = [...Object.keys(VIEWS), ...Object.keys(STRUCTURE_FALLBACK), ...Object.keys(HELD)] as DivinationToolId[];
