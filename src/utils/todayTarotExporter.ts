/**
 * 🔮 PRISM 타로 결과 공유 & 초고해상도 카드 이미지(PNG) 익스포터
 * 
 * 1. 단일 카드 (오늘의 타로) 및 다중 카드 (과거·현재·미래 3카드, 오라클 힐링/성장 3장 등) 전면 지원
 * 2. 메신저, 인스타그램, 메모장 최적화 마크다운 텍스트 원클릭 클립보드 복사
 * 3. 1080x1620 초고해상도 레티나 캔버스 카드 이미지 생성 및 PNG 다운로드
 * 4. 모바일 Web Share API 연동 (이미지 파일 + 텍스트 네이티브 공유)
 */

export interface TarotCardShareItem {
  id?: string;
  nameKo: string;
  name: string;
  reversed: boolean;
  keywords?: string[];
  imageUrl?: string;
  slotName?: string;
}

export interface TarotShareData {
  title?: string;
  subtitle?: string;
  concern?: string;
  spreadName?: string;
  cards?: TarotCardShareItem[];
  card?: TarotCardShareItem | null;
  dateStr?: string;
  conciseSummaryBullets?: string[];
  diagnosis?: string;
  adviceHeadline?: string;
  adviceText?: string;
  rawBlessing?: string;
  frequency?: string;
  luckyNumber?: string;
  luckyColor?: string;
}

// Backward compatibility alias
export type TodayTarotShareData = TarotShareData;

/**
 * 📋 텍스트 복사용 포맷팅 함수 (메신저/SNS 친화적)
 */
export function formatTodayTarotShareText(data: TarotShareData): string {
  return formatTarotShareText(data);
}

function isDailyTarotQuery(text?: string | null): boolean {
  if (!text) return false;
  return /(?:오늘의?\s*타로|오늘의?\s*운세|오늘의?\s*카드|오늘\s*타로|오늘\s*운세|데일리\s*타로|데일리\s*오라클|일일\s*타로|daily\s*tarot|daily\s*oracle|^오늘$|^daily$)/i.test(text.trim());
}

export function formatTarotShareText(data: TarotShareData): string {
  const cards: TarotCardShareItem[] = (data.cards && data.cards.length > 0)
    ? data.cards
    : (data.card ? [data.card] : []);

  const isDaily = isDailyTarotQuery(data.title) || isDailyTarotQuery(data.concern) || isDailyTarotQuery(data.spreadName);
  const title = data.title || (cards.length > 1 ? '78장 타로 마스터 비전 리딩' : '오늘의 데일리 타로');
  const dateText = data.dateStr || new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const spreadText = (!isDaily && data.spreadName) ? ` · ${data.spreadName}` : '';
  const concernText = (!isDaily && data.concern && !isDailyTarotQuery(data.concern)) ? `\n💬 질문/고민: "${data.concern}"\n` : '';

  // Cards summary text
  let cardsSection = '';
  if (cards.length === 1) {
    const c = cards[0];
    const orientation = c.reversed ? '역방향 (Reversed)' : '정방향 (Upright)';
    const kw = c.keywords && c.keywords.length > 0 ? ` (${c.keywords.map((k) => `#${k}`).join(' ')})` : '';
    cardsSection = `✨ 운명의 카드: ${c.nameKo} (${c.name}) · ${orientation}${kw}\n`;
  } else if (cards.length > 1) {
    cardsSection = `【🃏 선택된 타로 카드 (${cards.length}장)】\n` +
      cards.map((c, i) => {
        const slot = c.slotName ? `[${c.slotName}] ` : `[#${i + 1}] `;
        const orientation = c.reversed ? '역방향' : '정방향';
        const kw = c.keywords && c.keywords.length > 0 ? ` - ${c.keywords.slice(0, 3).join(', ')}` : '';
        return `• ${slot}${c.nameKo} (${c.name}) · ${orientation}${kw}`;
      }).join('\n') + '\n';
  }

  // 3-Line Summary Bullets
  const summaryBullets = data.conciseSummaryBullets && data.conciseSummaryBullets.length > 0
    ? `\n【✨ 오늘의 핵심 비전 요약】\n${data.conciseSummaryBullets.map((b) => `• ${b}`).join('\n')}\n`
    : '';

  // Diagnosis / Reading
  const diag = data.diagnosis
    ? `\n【🏛️ 마스터 비전 리딩】\n${data.diagnosis.slice(0, 500)}${data.diagnosis.length > 500 ? '...' : ''}\n`
    : '';

  // Lucy's Advice
  const adviceSection = (data.adviceHeadline || data.adviceText)
    ? `\n【💡 루시의 특별 조언】\n${data.adviceHeadline ? `• "${data.adviceHeadline}"\n` : ''}${data.adviceText ? `${data.adviceText.slice(0, 300)}...\n` : ''}`
    : '';

  // Energy & Blessing
  const cosmicInfo = [
    data.frequency ? `주파수: ${data.frequency}` : null,
    data.luckyNumber ? `행운수: ${data.luckyNumber}` : null,
    data.luckyColor ? `행운색: ${data.luckyColor}` : null,
  ].filter(Boolean).join(' · ');

  const blessing = data.rawBlessing
    ? `\n【🌟 행운의 파동과 축복】\n${cosmicInfo ? `• ${cosmicInfo}\n` : ''}"${data.rawBlessing}"\n`
    : cosmicInfo ? `\n【🌟 행운의 에너지】\n• ${cosmicInfo}\n` : '';

  return (
    `🔮 [PRISM 타로 리딩] ${dateText}\n` +
    `✦ ${title}${spreadText}\n` +
    concernText +
    cardsSection +
    summaryBullets +
    diag +
    adviceSection +
    blessing +
    `\n───\n✦ PRISM TRINITY ORACLE ✦\n매일 만나는 영혼의 나침반`
  );
}

/**
 * 캔버스용 한글/영문 텍스트 자동 줄바꿈 헬퍼
 */
function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 4
): number {
  if (!text) return y;
  const words = text.split(' ');
  let line = '';
  let curY = y;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lineCount++;
      if (lineCount >= maxLines) {
        ctx.fillText(line.trim() + '...', x, curY);
        return curY + lineHeight;
      }
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim() && lineCount < maxLines) {
    ctx.fillText(line.trim(), x, curY);
    curY += lineHeight;
  }
  return curY;
}

/**
 * 이미지 사전 로드 헬퍼 (CORS anonymous 지원)
 */
async function loadCardImage(url: string): Promise<HTMLImageElement | null> {
  if (!url) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * 🖼️ 1080 x 1620 초고해상도 카드 캔버스 렌더링 (단일 및 다중 카드 완벽 지원)
 */
export async function generateTodayTarotCardCanvas(data: TarotShareData): Promise<HTMLCanvasElement> {
  return generateTarotCardCanvas(data);
}

export async function generateTarotCardCanvas(data: TarotShareData): Promise<HTMLCanvasElement> {
  const width = 1080;
  const height = 1620;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const cards: TarotCardShareItem[] = (data.cards && data.cards.length > 0)
    ? data.cards
    : (data.card ? [data.card] : []);

  // 1. Cosmic Obsidian & Deep Purple Radial Background
  const bgGrad = ctx.createRadialGradient(width / 2, height * 0.35, 120, width / 2, height / 2, height * 0.75);
  bgGrad.addColorStop(0, '#1c1535');
  bgGrad.addColorStop(0.35, '#120d24');
  bgGrad.addColorStop(0.7, '#0a0815');
  bgGrad.addColorStop(1, '#05040a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Cosmic Nebula Particle & Constellation Dust
  ctx.save();
  for (let i = 0; i < 90; i++) {
    const px = Math.abs(Math.sin(i * 997 + 1)) * (width - 80) + 40;
    const py = Math.abs(Math.cos(i * 541 + 2)) * (height - 80) + 40;
    const radius = 0.6 + Math.abs(Math.sin(i * 13)) * 1.8;
    const alpha = 0.15 + Math.abs(Math.cos(i * 7)) * 0.45;

    ctx.fillStyle = i % 3 === 0
      ? `rgba(250, 204, 21, ${alpha})`
      : i % 2 === 0
      ? `rgba(168, 85, 247, ${alpha * 0.8})`
      : `rgba(255, 255, 255, ${alpha * 0.9})`;

    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Luxurious Sacred Double Gold Border & Corner Ornaments
  ctx.save();
  ctx.strokeStyle = 'rgba(202, 138, 4, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Corner Brackets
  const cSize = 28;
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(48, 48 + cSize);
  ctx.lineTo(48, 48);
  ctx.lineTo(48 + cSize, 48);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - 48 - cSize, 48);
  ctx.lineTo(width - 48, 48);
  ctx.lineTo(width - 48, 48 + cSize);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(48, height - 48 - cSize);
  ctx.lineTo(48, height - 48);
  ctx.lineTo(48 + cSize, height - 48);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - 48 - cSize, height - 48);
  ctx.lineTo(width - 48, height - 48);
  ctx.lineTo(width - 48, height - 48 - cSize);
  ctx.stroke();
  ctx.restore();

  // 4. Header Seal & Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#eab308';
  ctx.font = 'bold 20px "Cinzel", "Times New Roman", Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('✦ PRISM TRINITY ORACLE ✦', width / 2, 95);

  const isDaily = isDailyTarotQuery(data.title) || isDailyTarotQuery(data.concern) || isDailyTarotQuery(data.spreadName);
  const mainTitle = data.title || (cards.length > 1 ? '78장 타로 마스터 비전' : '오늘의 데일리 타로');
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Pretendard", "Noto Sans KR", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(mainTitle, width / 2, 142);

  // Date Badge / Spread Name
  const todayFormatted = data.dateStr || new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const spreadBadgeText = (!isDaily && data.spreadName) ? `${todayFormatted} · ${data.spreadName}` : todayFormatted;

  ctx.fillStyle = 'rgba(250, 204, 21, 0.15)';
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
  ctx.lineWidth = 1.5;
  const dateBadgeW = Math.min(width - 200, Math.max(240, spreadBadgeText.length * 14 + 40));
  const dateBadgeH = 34;
  ctx.beginPath();
  ctx.roundRect((width - dateBadgeW) / 2, 160, dateBadgeW, dateBadgeH, 17);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(spreadBadgeText, width / 2, 183);

  // Question/Concern banner if provided (skip for daily tarot or empty)
  let cardSectionStartY = 215;
  if (!isDaily && data.concern && !isDailyTarotQuery(data.concern)) {
    ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
    ctx.lineWidth = 1;
    const concernBoxW = width - 140;
    const concernBoxH = 40;
    ctx.beginPath();
    ctx.roundRect(70, 204, concernBoxW, concernBoxH, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e9d5ff';
    ctx.font = 'bold 15px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const cleanConcern = data.concern.length > 55 ? `${data.concern.slice(0, 52)}...` : data.concern;
    ctx.fillText(`고민: "${cleanConcern}"`, width / 2, 229);
    cardSectionStartY = 258;
  }

  // Preload all card images
  const loadedImages = await Promise.all(cards.map((c) => (c.imageUrl ? loadCardImage(c.imageUrl) : Promise.resolve(null))));

  // 5. Card Illustration Area (Responsive to 1, 2, or 3 cards)
  if (cards.length <= 1) {
    // SINGLE CARD PRESENTATION
    const c = cards[0];
    const cardW = 240;
    const cardH = 380;
    const cardX = (width - cardW) / 2;
    const cardY = cardSectionStartY;

    // Glow
    const glowGrad = ctx.createRadialGradient(width / 2, cardY + cardH / 2, 60, width / 2, cardY + cardH / 2, 220);
    glowGrad.addColorStop(0, 'rgba(234, 179, 8, 0.28)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(cardX - 100, cardY - 50, cardW + 200, cardH + 100);

    const cardImg = loadedImages[0];
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 18);
    ctx.clip();

    if (cardImg) {
      if (c?.reversed) {
        ctx.translate(cardX + cardW / 2, cardY + cardH / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(cardImg, -cardW / 2, -cardH / 2, cardW, cardH);
        ctx.rotate(-Math.PI);
        ctx.translate(-(cardX + cardW / 2), -(cardY + cardH / 2));
      } else {
        ctx.drawImage(cardImg, cardX, cardY, cardW, cardH);
      }
    } else {
      renderCardFallback(ctx, cardX, cardY, cardW, cardH, c?.nameKo || 'TAROT');
    }
    ctx.restore();

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 18);
    ctx.stroke();

    if (c?.reversed) {
      drawReversedRibbon(ctx, cardX, cardY, cardW, cardH);
    }

    // Card text
    const nameKo = c?.nameKo || '운명의 카드';
    const nameEn = c?.name ? `(${c.name})` : '';
    const isRev = !!c?.reversed;

    ctx.textAlign = 'center';
    ctx.fillStyle = isRev ? '#f87171' : '#facc15';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(isRev ? '◆ REVERSED ENERGY ◆' : '★ UPRIGHT SACRED ALIGNMENT ★', width / 2, cardY + cardH + 34);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Cinzel", -apple-system, BlinkMacSystemFont, "Pretendard", serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(`${nameKo} ${nameEn}`, width / 2, cardY + cardH + 74);

    if (c?.keywords && c.keywords.length > 0) {
      ctx.fillStyle = '#fde047';
      ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
      ctx.letterSpacing = '1px';
      ctx.fillText(c.keywords.slice(0, 4).map((k) => `#${k}`).join('   '), width / 2, cardY + cardH + 104);
    }
  } else {
    // MULTI-CARD PRESENTATION (2 or 3 Cards)
    const cardCount = Math.min(cards.length, 3);
    const cardW = cardCount === 2 ? 220 : 180;
    const cardH = cardCount === 2 ? 340 : 280;
    const cardGap = cardCount === 2 ? 60 : 36;
    const totalW = cardCount * cardW + (cardCount - 1) * cardGap;
    const startX = (width - totalW) / 2;
    const cardY = cardSectionStartY + 15;

    for (let i = 0; i < cardCount; i++) {
      const c = cards[i];
      const curX = startX + i * (cardW + cardGap);
      const cardImg = loadedImages[i];

      // Slot badge on top
      const slotText = c.slotName || (cardCount === 3 ? (['1. 과거', '2. 현재', '3. 미래'][i]) : `#${i + 1} 슬롯`);
      ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(curX + (cardW - 140) / 2, cardY - 26, 140, 22, 11);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(slotText, curX + cardW / 2, cardY - 11);

      // Card image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(curX, cardY, cardW, cardH, 14);
      ctx.clip();

      if (cardImg) {
        if (c.reversed) {
          ctx.translate(curX + cardW / 2, cardY + cardH / 2);
          ctx.rotate(Math.PI);
          ctx.drawImage(cardImg, -cardW / 2, -cardH / 2, cardW, cardH);
          ctx.rotate(-Math.PI);
          ctx.translate(-(curX + cardW / 2), -(cardY + cardH / 2));
        } else {
          ctx.drawImage(cardImg, curX, cardY, cardW, cardH);
        }
      } else {
        renderCardFallback(ctx, curX, cardY, cardW, cardH, c.nameKo);
      }
      ctx.restore();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(curX, cardY, cardW, cardH, 14);
      ctx.stroke();

      if (c.reversed) {
        drawReversedRibbon(ctx, curX, cardY, cardW, cardH);
      }

      // Below card: name & orientation
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
      ctx.fillText(c.nameKo, curX + cardW / 2, cardY + cardH + 26);

      ctx.fillStyle = c.reversed ? '#f87171' : '#facc15';
      ctx.font = '600 12px -apple-system, sans-serif';
      ctx.fillText(c.reversed ? '역방향' : '정방향', curX + cardW / 2, cardY + cardH + 46);
    }
  }

  // 6. Core 3-Line Summary Card or Letter / Diagnosis Box
  const boxX = 70;
  const boxY = cards.length > 1 ? 730 : 775;
  const boxW = width - 140;
  const boxH = cards.length > 1 ? 380 : 355;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 24);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(boxX + 40, boxY);
  ctx.lineTo(boxX + boxW - 40, boxY);
  ctx.stroke();

  const bullets = (data.conciseSummaryBullets && data.conciseSummaryBullets.length > 0)
    ? data.conciseSummaryBullets
    : null;

  if (bullets) {
    // Render Quick Summary 3 Bullets
    ctx.textAlign = 'left';
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 21px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.fillText('✨ 오늘의 핵심 3줄 비전 요약 (Quick Summary)', boxX + 35, boxY + 45);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(boxX + 35, boxY + 62);
    ctx.lineTo(boxX + boxW - 35, boxY + 62);
    ctx.stroke();

    let currentBulletY = boxY + 100;
    bullets.slice(0, 3).forEach((b) => {
      const match = b.match(/^\[([^\]]+)\]\s*(.*)$/);
      const tag = match ? match[1] : null;
      const content = match ? match[2] : b;

      ctx.textAlign = 'left';
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('•', boxX + 35, currentBulletY);

      let textStartX = boxX + 55;
      if (tag) {
        ctx.font = 'bold 15px -apple-system, sans-serif';
        const tagW = ctx.measureText(`[${tag}]`).width;
        ctx.fillStyle = '#fde047';
        ctx.fillText(`[${tag}]`, textStartX, currentBulletY);
        textStartX += tagW + 10;
      }

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '16px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
      currentBulletY = drawWrappedText(ctx, content, textStartX, currentBulletY, boxW - (textStartX - boxX) - 35, 26, 2);
      currentBulletY += 16;
    });
  } else {
    // Render Reading Excerpt / Letter Box
    const readingTitle = data.title || '🏛️ 마스터 심층 비전 리딩';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 21px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.fillText(`✦ ${readingTitle}`, boxX + 35, boxY + 45);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(boxX + 35, boxY + 62);
    ctx.lineTo(boxX + boxW - 35, boxY + 62);
    ctx.stroke();

    const textToDisplay = data.diagnosis || data.adviceText || '우주와 사주 본원의 기운이 조화롭게 만나 깊은 통찰과 성장을 선물합니다.';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    drawWrappedText(ctx, textToDisplay, boxX + 35, boxY + 105, boxW - 70, 28, 8);
  }

  // 7. Lucy's Advice or Planetary Energy Section
  const energyY = cards.length > 1 ? 1145 : 1165;
  const energyBoxH = 175;

  ctx.fillStyle = 'rgba(250, 204, 21, 0.05)';
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(boxX, energyY, boxW, energyBoxH, 20);
  ctx.fill();
  ctx.stroke();

  // Energy Pills
  const pills = [
    data.frequency ? `주파수: ${data.frequency}` : '528Hz 사랑과 치유',
    data.luckyNumber ? `행운수: ${data.luckyNumber}` : '행운수: 7',
    data.luckyColor ? `행운색: ${data.luckyColor}` : '행운색: 황금빛 골드',
  ];

  ctx.textAlign = 'center';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';

  const pillW = 260;
  const pillSpacing = 28;
  const totalPillsW = pills.length * pillW + (pills.length - 1) * pillSpacing;
  let pillStartX = (width - totalPillsW) / 2;

  pills.forEach((pText) => {
    ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(pillStartX, energyY + 22, pillW, 36, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.fillText(pText, pillStartX + pillW / 2, energyY + 45);
    pillStartX += pillW + pillSpacing;
  });

  // Lucy's Advice Headline or Master Blessing
  const quoteText = data.adviceHeadline || data.rawBlessing || '오늘 하루 마주할 모든 순간이 당신의 가장 찬란한 성장을 응원합니다.';
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'italic 17px "Times New Roman", Georgia, serif';
  ctx.textAlign = 'center';
  drawWrappedText(ctx, `"${quoteText}"`, width / 2, energyY + 95, boxW - 80, 26, 2);

  // 8. Footer Emblem & Signature
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ca8a04';
  ctx.font = 'bold 14px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('❖ PRISM ✕ LUCY • DESTINY TAROT FUSION ❖', width / 2, 1470);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('Personalized Cosmic Daily Wisdom & Mindfulness Archive', width / 2, 1495);

  return canvas;
}

function renderCardFallback(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  name: string
) {
  const cardBackGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  cardBackGrad.addColorStop(0, '#2d1b4e');
  cardBackGrad.addColorStop(0.5, '#1e1136');
  cardBackGrad.addColorStop(1, '#0e081c');
  ctx.fillStyle = cardBackGrad;
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 36px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', x + w / 2, y + h / 2 - 10);
  ctx.font = 'bold 15px "Cinzel", serif';
  ctx.fillText(name, x + w / 2, y + h / 2 + 25);
}

function drawReversedRibbon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = 'rgba(185, 28, 28, 0.9)';
  ctx.beginPath();
  ctx.roundRect(x + 12, y + h - 30, w - 24, 22, 6);
  ctx.fill();
  ctx.fillStyle = '#fee2e2';
  ctx.font = 'bold 11px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('역방향 (REVERSED)', x + w / 2, y + h - 15);
}

/**
 * 💾 캔버스를 고해상도 PNG 파일로 자동 다운로드
 */
export async function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename.endsWith('.png') ? filename : `${filename}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve();
    }, 'image/png');
  });
}

/**
 * 🌟 원스톱 타로 이미지 카드 생성 및 다운로드
 */
export async function exportTodayTarotCardImage(data: TarotShareData, customFilename?: string): Promise<string> {
  return exportTarotCardImage(data, customFilename);
}

export async function exportTarotCardImage(data: TarotShareData, customFilename?: string): Promise<string> {
  const canvas = await generateTarotCardCanvas(data);
  const cardName = data.card?.nameKo || (data.cards?.[0]?.nameKo) || 'tarot';
  const cleanCardName = cardName.replace(/\s+/g, '_');
  const dateKey = (data.dateStr || new Date().toISOString().slice(0, 10)).replace(/[^\d]/g, '');
  const filename = customFilename || `prism_tarot_${dateKey}_${cleanCardName}.png`;

  await downloadCanvasAsPng(canvas, filename);
  return canvas.toDataURL('image/png');
}

/**
 * 📱 모바일 네이티브 공유 또는 클립보드 복사 원클릭 핸들러
 */
export async function shareTodayTarot(
  data: TarotShareData,
  canvas?: HTMLCanvasElement
): Promise<'shared' | 'copied' | 'failed'> {
  return shareTarotResult(data, canvas);
}

export async function shareTarotResult(
  data: TarotShareData,
  canvas?: HTMLCanvasElement
): Promise<'shared' | 'copied' | 'failed'> {
  const shareText = formatTarotShareText(data);
  const cardName = data.card?.nameKo || (data.cards?.[0]?.nameKo) || '타로 리딩';

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      if (canvas && typeof navigator.canShare === 'function') {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          const file = new File([blob], `prism_tarot_${cardName}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `[PRISM] ${data.title || '타로 리딩'} - ${cardName}`,
              text: shareText,
              files: [file],
            });
            return 'shared';
          }
        }
      }

      await navigator.share({
        title: `[PRISM] ${data.title || '타로 리딩'} - ${cardName}`,
        text: shareText,
      });
      return 'shared';
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        return 'failed';
      }
      console.warn('Web Share failed, fallback to clipboard', e);
    }
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      return 'copied';
    }
  } catch (err) {
    console.error('Clipboard copy error', err);
  }

  return 'failed';
}
