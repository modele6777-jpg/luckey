/**
 * 🧧 오브 상담 부적: 상담 내용에 맞는 전통 부적(괴황지 노란 종이 + 경면주사 붉은 먹)을 캔버스에 그린다.
 * 상담에서 사용자가 한 말과 마스터의 주제로 부적 종류를 고르고, 사진(PNG)으로 저장할 수 있다.
 * 부적은 참고용 상징물이며 효험을 보장하지 않는다.
 */

export type TalismanKind = 'wealth' | 'success' | 'love' | 'health' | 'peace' | 'wish';

export interface TalismanSpec {
  kind: TalismanKind;
  nameKo: string;
  /** 가운데 세로로 쓰는 네 글자 */
  title: string;
  /** 양옆 세로 글귀 */
  left: string;
  right: string;
  /** 한국어 풀이 */
  meaning: string;
  /** 인장 글자 (2자) */
  seal: string;
}

const TALISMANS: Record<TalismanKind, TalismanSpec> = {
  wealth: { kind: 'wealth', nameKo: '재물부 (招財符)', title: '招財進寶', left: '財源廣進', right: '福祿滿堂', meaning: '재물이 들어오고 새어 나가지 않기를', seal: '招財' },
  success: { kind: 'success', nameKo: '합격·승진부 (登科符)', title: '官運亨通', left: '金榜題名', right: '步步高昇', meaning: '하는 일이 트이고 바라는 자리에 오르기를', seal: '登科' },
  love: { kind: 'love', nameKo: '화합부 (和合符)', title: '天作之合', left: '兩心相照', right: '百年同樂', meaning: '인연이 따뜻하게 이어지고 마음이 통하기를', seal: '和合' },
  health: { kind: 'health', nameKo: '건강부 (長生符)', title: '身體康寧', left: '百病消散', right: '延年益壽', meaning: '몸이 가볍고 잠자리가 편안하기를', seal: '長生' },
  peace: { kind: 'peace', nameKo: '안심부 (安心符)', title: '心身安寧', left: '萬事亨通', right: '惡氣消滅', meaning: '근심이 걷히고 마음이 고요해지기를', seal: '安心' },
  wish: { kind: 'wish', nameKo: '소원성취부 (如意符)', title: '所願成就', left: '心想事成', right: '吉祥如意', meaning: '마음에 품은 바람이 이루어지기를', seal: '如意' },
};

const KEYWORDS: [TalismanKind, RegExp][] = [
  ['wealth', /돈|재물|재정|월급|연봉|수입|투자|주식|코인|사업|매출|빚|대출|부자|금전|돈벌/],
  ['success', /취업|이직|승진|직장|회사|면접|시험|합격|공부|학업|자격증|진로|커리어|일이|업무|성과/],
  ['love', /사랑|연애|애인|남자친구|여자친구|남친|여친|결혼|배우자|짝|썸|이별|재회|그 사람|관계|가족|부부/],
  ['health', /건강|아프|아파|병원|병|몸이|수술|통증|잠이|불면|피곤|다이어트/],
  ['peace', /불안|걱정|우울|힘들|지쳐|스트레스|마음이|외로|무기력|두려|답답/],
];

/** 사용자가 한 말을 먼저, 그다음 마스터의 주제로 부적 종류를 고른다. */
export function pickTalisman(userText: string, masterTopic = ''): TalismanSpec {
  const score = (text: string) => {
    const counts = new Map<TalismanKind, number>();
    for (const [kind, pattern] of KEYWORDS) {
      const matches = text.match(new RegExp(pattern.source, 'g'));
      if (matches?.length) counts.set(kind, matches.length);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  };
  const kind = score(userText) || score(masterTopic) || 'wish';
  return TALISMANS[kind];
}

function seededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => (state = (state * 16807) % 2147483647) / 2147483647;
}

const SERIF = '"Noto Serif KR","Noto Serif CJK KR","AppleMyungjo","Nanum Myeongjo","Batang","Songti SC","STSong",serif';

/** 붉은 먹 글자: 조금씩 기울고, 번진 듯한 자국을 남긴다. */
function inkChar(ctx: CanvasRenderingContext2D, char: string, x: number, y: number, size: number, rand: () => number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rand() - 0.5) * 0.08);
  ctx.font = `900 ${size}px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(190, 20, 24, 0.45)';
  ctx.shadowBlur = size * 0.06;
  ctx.fillStyle = '#c4161c';
  ctx.fillText(char, 0, 0);
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.35;
  ctx.fillText(char, size * 0.012, size * 0.01);
  ctx.restore();
}

/** 붓으로 그은 선: 굵기가 변하는 점들을 이어 획 느낌을 낸다. */
function brushStroke(ctx: CanvasRenderingContext2D, points: [number, number][], width: number, rand: () => number) {
  ctx.save();
  ctx.fillStyle = '#c4161c';
  ctx.shadowColor = 'rgba(190, 20, 24, 0.35)';
  ctx.shadowBlur = 3;
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const steps = Math.max(2, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 2));
    for (let s = 0; s < steps; s += 1) {
      const t = s / steps;
      const progress = (i + t) / (points.length - 1);
      const w = width * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, progress * 1.15))) * (0.92 + rand() * 0.16);
      ctx.beginPath();
      ctx.arc(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** 부적 한 장을 그린다 (세로 9:16). */
export function drawTalisman(canvas: HTMLCanvasElement, spec: TalismanSpec, dateText: string, seed = Date.now()): void {
  const W = 900;
  const H = 1600;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const rand = seededRandom(Math.floor(seed));

  // 괴황지: 누런 종이, 가장자리가 짙고 섬유 결이 보인다.
  const paper = ctx.createLinearGradient(0, 0, W, H);
  paper.addColorStop(0, '#f6d66a');
  paper.addColorStop(0.5, '#f0c84f');
  paper.addColorStop(1, '#e4b23a');
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 1400; i += 1) {
    ctx.fillStyle = `rgba(${150 + rand() * 60}, ${100 + rand() * 50}, 20, ${0.04 + rand() * 0.06})`;
    ctx.fillRect(rand() * W, rand() * H, 1 + rand() * 2.5, 1 + rand() * 2.5);
  }
  ctx.strokeStyle = 'rgba(170, 120, 30, 0.12)';
  for (let i = 0; i < 60; i += 1) {
    ctx.lineWidth = 0.5 + rand();
    ctx.beginPath();
    const y = rand() * H;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(W * 0.3, y + (rand() - 0.5) * 40, W * 0.7, y + (rand() - 0.5) * 40, W, y + (rand() - 0.5) * 30);
    ctx.stroke();
  }
  const edge = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
  edge.addColorStop(0, 'rgba(0,0,0,0)');
  edge.addColorStop(1, 'rgba(120, 70, 10, 0.35)');
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, W, H);

  // 붉은 이중 테두리와 모서리 문양
  ctx.strokeStyle = '#c4161c';
  ctx.lineWidth = 10;
  ctx.strokeRect(46, 46, W - 92, H - 92);
  ctx.lineWidth = 3;
  ctx.strokeRect(70, 70, W - 140, H - 140);
  for (const [cx, cy] of [[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]]) {
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#c4161c';
    ctx.fill();
  }

  // 머리: 勅令 (칙령)
  ctx.beginPath();
  ctx.ellipse(W / 2, 220, 150, 110, 0, 0, Math.PI * 2);
  ctx.strokeStyle = '#c4161c';
  ctx.lineWidth = 6;
  ctx.stroke();
  inkChar(ctx, '勅', W / 2 - 62, 220, 120, rand);
  inkChar(ctx, '令', W / 2 + 62, 220, 120, rand);
  // 해와 달 (日·月) 둥근 표식
  for (const [char, x] of [['日', 150], ['月', W - 150]] as const) {
    ctx.beginPath();
    ctx.arc(x, 200, 56, 0, Math.PI * 2);
    ctx.strokeStyle = '#c4161c';
    ctx.lineWidth = 5;
    ctx.stroke();
    inkChar(ctx, char, x, 202, 66, rand);
  }
  // 붓을 털 때 튄 먹 방울
  ctx.save();
  ctx.fillStyle = 'rgba(196, 22, 28, 0.55)';
  for (let i = 0; i < 26; i += 1) {
    const x = 110 + rand() * (W - 220);
    const y = 120 + rand() * (H - 260);
    ctx.beginPath();
    ctx.arc(x, y, 1.5 + rand() * 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  // 칙령에서 내려오는 세 줄기 기운
  brushStroke(ctx, [[W / 2, 330], [W / 2 - 20, 360], [W / 2 + 18, 395], [W / 2, 420]], 14, rand);
  brushStroke(ctx, [[W / 2 - 110, 320], [W / 2 - 130, 380], [W / 2 - 105, 420]], 8, rand);
  brushStroke(ctx, [[W / 2 + 110, 320], [W / 2 + 130, 380], [W / 2 + 105, 420]], 8, rand);

  // 가운데 세로 주문 (네 글자)
  const chars = [...spec.title];
  chars.forEach((char, index) => inkChar(ctx, char, W / 2, 510 + index * 160, 160, rand));

  // 양옆 세로 글귀
  [...spec.left].forEach((char, index) => inkChar(ctx, char, 165, 560 + index * 120, 84, rand));
  [...spec.right].forEach((char, index) => inkChar(ctx, char, W - 165, 560 + index * 120, 84, rand));

  // 부적 다리(符脚): 주문 아래로 구불구불 내려가는 붓 획
  const footTop = 510 + (chars.length - 1) * 160 + 100;
  const foot: [number, number][] = [];
  for (let i = 0; i <= 9; i += 1) foot.push([W / 2 + (i % 2 === 0 ? -60 : 60) * (1 - i / 13), footTop + i * 24]);
  foot.push([W / 2 + 10, footTop + 250]);
  foot.push([W / 2 + 64, footTop + 232]);
  brushStroke(ctx, foot, 16, rand);
  // 별 자리 점(북두칠성)
  const stars: [number, number][] = [[120, 1300], [155, 1270], [195, 1275], [228, 1300], [250, 1338], [295, 1348], [330, 1318]];
  stars.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fillStyle = '#c4161c'; ctx.fill(); });
  brushStroke(ctx, stars, 4, rand);

  // 붉은 네모 인장 (흰 글자)
  const sx = W - 250;
  const sy = H - 330;
  ctx.save();
  ctx.translate(sx + 80, sy + 80);
  ctx.rotate(-0.04);
  ctx.fillStyle = '#b8121a';
  ctx.fillRect(-80, -80, 160, 160);
  ctx.strokeStyle = '#f6d66a';
  ctx.lineWidth = 4;
  ctx.strokeRect(-68, -68, 136, 136);
  ctx.fillStyle = '#f9e2a0';
  ctx.font = `900 58px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  [...spec.seal].forEach((char, index) => ctx.fillText(char, 0, index === 0 ? -30 : 32));
  ctx.restore();

  // 아래쪽 이름과 날짜 (먹색)
  ctx.fillStyle = 'rgba(90, 40, 10, 0.85)';
  ctx.font = `700 34px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.fillText(spec.nameKo, W / 2, H - 150);
  ctx.font = `500 26px ${SERIF}`;
  ctx.fillText(`${spec.meaning} · ${dateText}`, W / 2, H - 108);
}

/** 부적 이미지를 사진으로 저장한다: 가능하면 공유 시트(사진에 저장), 아니면 파일 내려받기. */
export async function saveTalismanImage(canvas: HTMLCanvasElement, fileName: string): Promise<'shared' | 'downloaded' | 'failed'> {
  const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return 'failed';
  const file = new File([blob], fileName, { type: 'image/png' });
  try {
    const nav = navigator as Navigator & { canShare?: (data: { files: File[] }) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title: '부적' });
      return 'shared';
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') return 'failed';
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  return 'downloaded';
}
