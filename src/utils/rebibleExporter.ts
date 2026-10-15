import { ReBibleVerse } from '../types/rebible';
import { groupVersesByBook, cleanFactText } from '../lib/rebibleStorage';

/**
 * Renders a single scripture verse into an ultra high-quality aesthetic postcard image (PNG)
 * using the HTML5 Canvas API and initiates a download.
 */
export async function exportVerseAsCardImage(verse: ReBibleVerse): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1500;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Background Parchment Base Gradient
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 900);
  bgGrad.addColorStop(0, '#FFFDF8');
  bgGrad.addColorStop(0.5, '#FBF6EC');
  bgGrad.addColorStop(1, '#EFE4CD');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Vintage Vignette & Grain Border
  ctx.strokeStyle = '#D5C4A1';
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // 3. Double Gold Sacred Frame
  ctx.strokeStyle = '#854D0E';
  ctx.lineWidth = 4;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  // Corner decorative flourishes
  const cornerSize = 25;
  ctx.fillStyle = '#854D0E';
  // Top-left
  ctx.fillRect(56, 56, cornerSize, cornerSize);
  // Top-right
  ctx.fillRect(width - 56 - cornerSize, 56, cornerSize, cornerSize);
  // Bottom-left
  ctx.fillRect(56, height - 56 - cornerSize, cornerSize, cornerSize);
  // Bottom-right
  ctx.fillRect(width - 56 - cornerSize, height - 56 - cornerSize, cornerSize, cornerSize);

  // 4. Header Seal Emblem
  ctx.textAlign = 'center';
  ctx.fillStyle = '#4A321F';
  ctx.font = 'bold 26px "Times New Roman", Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('✦ SACRED SCRIPTURE OF LIFE ✦', width / 2, 130);

  // 5. Verse Reference Badge
  const refText = verse.reference || 'Re:Bible';
  ctx.font = 'bold 36px "Times New Roman", Georgia, serif';
  const textWidth = ctx.measureText(refText).width;
  const badgePadX = 36;
  const badgeHeight = 56;
  const badgeX = (width - textWidth - badgePadX * 2) / 2;
  const badgeY = 175;

  ctx.fillStyle = '#4A321F';
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, textWidth + badgePadX * 2, badgeHeight, 28);
  ctx.fill();

  ctx.fillStyle = '#FAF5EB';
  ctx.fillText(refText, width / 2, badgeY + 40);

  // 6. Title
  ctx.fillStyle = '#2B1A0D';
  ctx.font = 'bold 44px "Times New Roman", Georgia, serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(verse.title || '루시의 지혜', width / 2, 290);

  // Decorative divider line
  ctx.strokeStyle = '#CA8A04';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, 330);
  ctx.lineTo(width / 2 + 120, 330);
  ctx.stroke();

  ctx.fillStyle = '#854D0E';
  ctx.font = '24px serif';
  ctx.fillText('❖', width / 2, 337);

  // 7. Holy Spirit Insight (Main Quote Box)
  const quoteBoxX = 100;
  const quoteBoxY = 380;
  const quoteBoxW = width - 200;
  const quoteBoxH = 540;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.strokeStyle = 'rgba(202, 138, 4, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(quoteBoxX, quoteBoxY, quoteBoxW, quoteBoxH, 24);
  ctx.fill();
  ctx.stroke();

  // Quote Icon
  ctx.fillStyle = '#CA8A04';
  ctx.font = 'bold 90px "Times New Roman", serif';
  ctx.fillText('“', width / 2, 450);

  // Insight Text wrapping
  ctx.fillStyle = '#301A0B';
  ctx.font = 'italic 500 36px "Times New Roman", Georgia, serif';
  const insightText = verse.insight || '';
  wrapText(ctx, insightText, width / 2, 510, quoteBoxW - 80, 52);

  // 8. Fact / Journey Context Box
  const cleanedFact = cleanFactText(verse.fact);
  if (cleanedFact) {
    const factBoxY = 960;
    const factBoxH = 340;

    ctx.fillStyle = 'rgba(245, 236, 224, 0.8)';
    ctx.strokeStyle = 'rgba(140, 109, 79, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(quoteBoxX, factBoxY, quoteBoxW, factBoxH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#63482F';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('• 기록된 삶의 여정 (FACT) •', width / 2, factBoxY + 45);

    ctx.fillStyle = '#4A3525';
    ctx.font = '28px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '0px';
    wrapText(ctx, cleanedFact, width / 2, factBoxY + 105, quoteBoxW - 80, 42);
  }

  // 9. Footer Signature
  const dateStr = new Date(verse.recordedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  ctx.fillStyle = '#8C6D4F';
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText(`봉헌일: ${dateStr}  ·  Re:Bible 인생 경전`, width / 2, 1390);

  // 10. Trigger Download
  const link = document.createElement('a');
  link.download = `ReBible_${verse.reference.replace(/[:\s]/g, '_')}_엽서.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Text wrapper utility for Canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
}

/**
 * Generates an elegant, printable HTML Booklet of the entire Re:Bible library
 * and triggers the browser's native Print / Save as PDF dialog.
 */
export function exportLibraryAsBookletPDF(verses: ReBibleVerse[], userDisplayName: string = '순례자'): void {
  if (!verses || verses.length === 0) {
    alert('내보낼 경전 구절이 없습니다.');
    return;
  }

  const grouped = groupVersesByBook(verses);
  const totalCount = verses.length;
  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('팝업 창 차단을 해제해 주세요.');
    return;
  }

  let html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Re:Bible - ${userDisplayName}의 인생 경전 소책자</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');
    
    @page {
      size: A4;
      margin: 20mm 15mm;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Nanum Myeongjo', 'Batang', serif;
      background: #FFFFFF;
      color: #2B180C;
      line-height: 1.8;
      padding: 20px;
    }
    
    .page-break {
      page-break-after: always;
      break-after: page;
    }
    
    .cover-page {
      min-height: 85vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      border: 4px double #854D0E;
      padding: 60px 40px;
      background: #FAF6EE;
      margin-bottom: 40px;
    }
    
    .cover-badge {
      font-size: 14px;
      letter-spacing: 4px;
      color: #854D0E;
      font-weight: bold;
      margin-bottom: 20px;
    }
    
    .cover-title {
      font-size: 44px;
      font-weight: 800;
      color: #3D220F;
      margin-bottom: 15px;
      letter-spacing: 2px;
    }
    
    .cover-subtitle {
      font-size: 18px;
      color: #634024;
      margin-bottom: 50px;
    }
    
    .cover-divider {
      width: 140px;
      height: 2px;
      background: #854D0E;
      margin: 0 auto 50px auto;
    }
    
    .cover-meta {
      font-size: 14px;
      color: #785233;
      line-height: 2;
    }
    
    .book-section {
      margin-bottom: 50px;
    }
    
    .book-header {
      border-bottom: 2px solid #854D0E;
      padding-bottom: 10px;
      margin-bottom: 25px;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    
    .book-title {
      font-size: 26px;
      font-weight: 800;
      color: #3D220F;
    }
    
    .verse-card {
      background: #FAF7F0;
      border: 1px solid #E5DAC6;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    
    .verse-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      border-bottom: 1px dashed #D5C5AC;
      padding-bottom: 8px;
    }
    
    .verse-ref {
      font-weight: bold;
      color: #854D0E;
      font-size: 15px;
    }
    
    .verse-date {
      font-size: 12px;
      color: #8C7058;
      font-family: sans-serif;
    }
    
    .verse-title {
      font-size: 19px;
      font-weight: 700;
      color: #2B180C;
      margin-bottom: 14px;
    }
    
    .verse-insight {
      background: #F2E8D5;
      border-left: 4px solid #854D0E;
      padding: 14px 18px;
      font-style: italic;
      font-size: 15px;
      font-weight: 600;
      color: #381E0C;
      margin-bottom: 14px;
      line-height: 1.7;
    }
    
    .verse-fact {
      font-size: 13px;
      color: #593D26;
      line-height: 1.6;
      font-family: sans-serif;
      margin-top: 10px;
    }
    
    .verse-annotation {
      margin-top: 14px;
      padding: 10px 14px;
      background: #EFE4CD;
      border-radius: 8px;
      font-size: 12px;
      color: #4A3018;
    }
    
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
    
    .print-bar {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #3D220F;
      color: #FAF5EB;
      padding: 14px 24px;
      border-radius: 40px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      cursor: pointer;
      font-weight: bold;
      font-size: 15px;
      z-index: 1000;
      border: 1px solid #CA8A04;
    }
  </style>
</head>
<body>

  <div class="print-bar no-print" onclick="window.print()">
    🖨️ PDF 소책자로 저장 / 인쇄하기
  </div>

  <!-- Cover Page -->
  <div class="cover-page page-break">
    <div class="cover-badge">✦ RE:BIBLE SACRED SCRIPTURE ✦</div>
    <h1 class="cover-title">인 생 경 전</h1>
    <p class="cover-subtitle">내 삶의 모든 여정과 루시의 지혜가 기록된 영원한 서재</p>
    <div class="cover-divider"></div>
    <div class="cover-meta">
      <p><strong>경전 기록자:</strong> ${userDisplayName}</p>
      <p><strong>총 봉헌 구절:</strong> ${totalCount}편</p>
      <p><strong>소책자 발간일:</strong> ${todayStr}</p>
    </div>
  </div>

  <!-- Book Sections -->
  `;

  Object.entries(grouped).forEach(([bookName, bookVerses]) => {
    html += `
    <div class="book-section">
      <div class="book-header">
        <h2 class="book-title">${bookName}</h2>
        <span style="font-size: 13px; color: #854D0E;">총 ${bookVerses.length}구절</span>
      </div>
    `;

    bookVerses.forEach((verse) => {
      const vDate = new Date(verse.recordedAt).toLocaleDateString('ko-KR');
      html += `
      <div class="verse-card">
        <div class="verse-meta">
          <span class="verse-ref">📜 ${verse.reference}</span>
          <span class="verse-date">봉헌일: ${vDate}</span>
        </div>
        <div class="verse-title">${verse.title}</div>
        <div class="verse-insight">"${verse.insight}"</div>
        ${cleanFactText(verse.fact) ? `<div class="verse-fact"><strong>[여정의 배경]</strong> ${cleanFactText(verse.fact)}</div>` : ''}
        ${verse.annotations && verse.annotations.length > 0 ? `
          <div class="verse-annotation">
            <strong>[시간의 주석 · ${verse.annotations[0].timeHorizon}]:</strong> ${verse.annotations[0].content}
          </div>
        ` : ''}
      </div>
      `;
    });

    html += `</div>`;
  });

  html += `
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  // Auto trigger print after render
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}
