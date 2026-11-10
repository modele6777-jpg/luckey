/**
 * =========================================================================
 * 📜 LUCKEY 사주 만세력 인스타그램 스토리 (9:16) & SNS 바이럴 카드 익스포터
 * (Saju Destiny Blueprint Instagram Story Exporter & Canvas Generator)
 * =========================================================================
 * 
 * 1. 1080 x 1920 초고해상도 레티나 규격 (인스타그램 스토리 9:16 최적화)
 * 2. 사주 4주 8자 만세력 원국표 + 일간 영적 아키타입 + 오행 밸런스 + 조후/용신 처방
 * 3. Web Share API 기반 인스타 스토리/카카오톡/SNS 네이티브 이미지 공유
 * 4. 고화질 PNG 원클릭 다운로드 및 인스타 감성 텍스트 클립보드 복사
 */

import type { SajuAnalysisResult, FiveElement } from '@/lib/sajuAnalysis';

export interface SajuDestinyStoryData {
  name: string;
  birthdate: string;
  birthtime?: string;
  gender: string;
  koreanAge?: number;
  pillars: SajuAnalysisResult['pillars'];
  dayMaster: SajuAnalysisResult['dayMaster'];
  elements: SajuAnalysisResult['elements'];
  yongsin?: { name: string; meaning: string };
  annual2026?: { yearName: string; theme: string; keyOpportunity: string; caution: string };
  prescription?: {
    luckyColor?: string;
    luckyFood?: string;
    luckyDirections?: string;
    breakthroughAction?: string;
  };
  johuSummary?: string;
}

// 오행별 대표 컬러 및 명칭
const ELEMENT_META: Record<FiveElement, { name: string; hanja: string; hex: string; lightHex: string; rgb: string }> = {
  목: { name: '목(木)', hanja: '木', hex: '#10b981', lightHex: '#34d399', rgb: '16, 185, 129' },
  화: { name: '화(火)', hanja: '火', hex: '#f43f5e', lightHex: '#fb7185', rgb: '244, 63, 94' },
  토: { name: '토(土)', hanja: '土', hex: '#f59e0b', lightHex: '#fbbf24', rgb: '245, 158, 11' },
  금: { name: '금(金)', hanja: '金', hex: '#e2e8f0', lightHex: '#f8fafc', rgb: '226, 232, 240' },
  수: { name: '수(水)', hanja: '水', hex: '#38bdf8', lightHex: '#7dd3fc', rgb: '56, 189, 248' },
};

/**
 * 📋 인스타그램 스토리/피드 캡션 및 메신저용 포맷팅 텍스트
 */
export function formatSajuDestinyShareText(data: SajuDestinyStoryData): string {
  const dayPillar = `${data.pillars.day.gan}${data.pillars.day.zhi} (${data.pillars.day.ganKr}${data.pillars.day.zhiKr}일주)`;
  const dominant = data.elements.dominant?.name || '목';
  const lacking = data.elements.lacking?.name || '금';

  const pillarsStr = [
    data.pillars.hour ? `시주: ${data.pillars.hour.gan}${data.pillars.hour.zhi}` : null,
    `일주: ${data.pillars.day.gan}${data.pillars.day.zhi}`,
    `월주: ${data.pillars.month.gan}${data.pillars.month.zhi}`,
    `년주: ${data.pillars.year.gan}${data.pillars.year.zhi}`,
  ].filter(Boolean).join(' | ');

  const luckyColor = data.prescription?.luckyColor || data.elements.lacking?.luckyColor || '화이트';
  const luckyFood = data.prescription?.luckyFood || data.elements.lacking?.luckyFood || '따뜻한 차';
  const action = data.prescription?.breakthroughAction || '내면의 직관에 집중하기';

  return (
    `🍀 [LUCKEY] ${data.name}님의 사주 만세력 운명 설계도\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `✨ 본원(일간): ${data.dayMaster.symbolName} 「${data.dayMaster.archetypeTitle}」\n` +
    `🏛️ 사주원국: ${pillarsStr}\n` +
    `⚡ 본원 일주: ${dayPillar}\n\n` +
    `🌿 오행 밸런스:\n` +
    `• 표면 개수: ${data.elements.strengthLabel || dominant}\n` +
    `• 가장 적은 표면 개수: ${lacking}\n\n` +
    `🔮 2026 운명 돌파 보약 처방:\n` +
    `• 개운 컬러: ${luckyColor}\n` +
    `• 보양 식단: ${luckyFood}\n` +
    `• 개운 행동: ${action}\n\n` +
    `💡 나만의 사주 만세력 & 타로 오라클 확인하기\n` +
    `👉 luckey.app #luckey #사주 #만세력 #운세 #인스타운세`
  );
}

/**
 * 캔버스 한글 텍스트 자동 줄바꿈 헬퍼
 */
function drawCanvasWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 3
): number {
  if (!text) return y;
  const words = text.split(' ');
  let line = '';
  let curY = y;
  let count = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      count++;
      if (count >= maxLines) {
        ctx.fillText(line.trim() + '...', x, curY);
        return curY + lineHeight;
      }
      ctx.fillText(line.trim(), x, curY);
      line = words[i] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim() && count < maxLines) {
    ctx.fillText(line.trim(), x, curY);
    curY += lineHeight;
  }
  return curY;
}

/**
 * 둥근 사각형 그리기 헬퍼
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * 🖼️ 1080 x 1920 (9:16 인스타그램 스토리) 초고해상도 사주 카드 캔버스 렌더링
 */
export async function generateSajuDestinyStoryCanvas(
  data: SajuDestinyStoryData
): Promise<HTMLCanvasElement> {
  const width = 1080;
  const height = 1920;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. 배경: Cosmic Obsidian & Deep Gold / Emerald Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090a0f');
  bgGrad.addColorStop(0.25, '#12141c');
  bgGrad.addColorStop(0.65, '#171410');
  bgGrad.addColorStop(1, '#07080b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 미세 성간 오로라 빛무리 (Nebula Glows)
  ctx.save();
  const auraGrad1 = ctx.createRadialGradient(width * 0.2, 380, 20, width * 0.2, 380, 480);
  auraGrad1.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
  auraGrad1.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = auraGrad1;
  ctx.fillRect(0, 0, width, height);

  const auraGrad2 = ctx.createRadialGradient(width * 0.85, 1300, 30, width * 0.85, 1300, 520);
  auraGrad2.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
  auraGrad2.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = auraGrad2;
  ctx.fillRect(0, 0, width, height);

  // 황금빛 별먼지 (Star Dust)
  for (let i = 0; i < 75; i++) {
    const px = Math.abs(Math.sin(i * 733 + 3)) * (width - 100) + 50;
    const py = Math.abs(Math.cos(i * 419 + 7)) * (height - 120) + 60;
    const r = 0.8 + Math.abs(Math.sin(i * 17)) * 1.6;
    const alpha = 0.15 + Math.abs(Math.cos(i * 11)) * 0.55;
    ctx.fillStyle = i % 3 === 0
      ? `rgba(251, 191, 36, ${alpha})`
      : i % 2 === 0
      ? `rgba(52, 211, 153, ${alpha * 0.8})`
      : `rgba(255, 255, 255, ${alpha * 0.9})`;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 외곽 황금빛 이중 보더 프레임
  ctx.save();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 40, 40, width - 80, height - 80, 44);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 52, 52, width - 104, height - 104, 34);
  ctx.stroke();

  // 네 귀퉁이 장식 문양
  const cornerSize = 28;
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
  ctx.lineWidth = 2.5;
  // 좌상
  ctx.beginPath(); ctx.moveTo(64, 64 + cornerSize); ctx.lineTo(64, 64); ctx.lineTo(64 + cornerSize, 64); ctx.stroke();
  // 우상
  ctx.beginPath(); ctx.moveTo(width - 64 - cornerSize, 64); ctx.lineTo(width - 64, 64); ctx.lineTo(width - 64, 64 + cornerSize); ctx.stroke();
  // 좌하
  ctx.beginPath(); ctx.moveTo(64, height - 64 - cornerSize); ctx.lineTo(64, height - 64); ctx.lineTo(64 + cornerSize, height - 64); ctx.stroke();
  // 우하
  ctx.beginPath(); ctx.moveTo(width - 64 - cornerSize, height - 64); ctx.lineTo(width - 64, height - 64); ctx.lineTo(width - 64, height - 64 - cornerSize); ctx.stroke();
  ctx.restore();

  // 2. 헤더: 브랜드 및 타이틀
  ctx.save();
  ctx.textAlign = 'center';

  // LUCKEY 뱃지
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  drawRoundedRect(ctx, width / 2 - 140, 95, 280, 42, 21);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('🍀 LUCKEY • DESTINY BLUEPRINT', width / 2, 122);

  // 메인 타이틀
  ctx.font = '900 48px "Cinzel", "Nanum Myeongjo", "Batang", serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('사주 만세력 운명 설계도', width / 2, 195);

  // 사용자 명식 서브타이틀
  ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  const birthInfo = `${data.name}님의 원국 · ${data.birthdate} (${data.gender === 'female' ? '여' : '남'})${data.birthtime ? ` ${data.birthtime}` : ''}`;
  ctx.fillText(birthInfo, width / 2, 235);
  ctx.restore();

  // 구분선
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(90, 260);
  ctx.lineTo(width - 90, 260);
  ctx.stroke();

  // 3. 섹션 A: 사주 4주 8자 원국표 (時柱, 日柱, 月柱, 年柱)
  const pillarY = 285;
  const pillarBoxWidth = 215;
  const pillarBoxHeight = 440;
  const gap = 16;
  const startX = (width - (pillarBoxWidth * 4 + gap * 3)) / 2;

  const pillarList = [
    { title: '시주 (時柱)', sub: '말년·자녀', detail: data.pillars.hour, isSelf: false },
    { title: '일주 (日柱)', sub: '본원·자신', detail: data.pillars.day, isSelf: true },
    { title: '월주 (月柱)', sub: '사회·직업', detail: data.pillars.month, isSelf: false },
    { title: '년주 (年柱)', sub: '근본·조상', detail: data.pillars.year, isSelf: false },
  ];

  pillarList.forEach((col, idx) => {
    const colX = startX + idx * (pillarBoxWidth + gap);

    // 컬럼 배경
    ctx.save();
    if (col.isSelf) {
      // 본원 강조 그라디언트
      const selfGrad = ctx.createLinearGradient(colX, pillarY, colX, pillarY + pillarBoxHeight);
      selfGrad.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
      selfGrad.addColorStop(0.5, 'rgba(25, 22, 18, 0.95)');
      selfGrad.addColorStop(1, 'rgba(245, 158, 11, 0.12)');
      ctx.fillStyle = selfGrad;
      drawRoundedRect(ctx, colX, pillarY, pillarBoxWidth, pillarBoxHeight, 26);
      ctx.fill();

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(22, 24, 32, 0.85)';
      drawRoundedRect(ctx, colX, pillarY, pillarBoxWidth, pillarBoxHeight, 22);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.textAlign = 'center';

    // 컬럼 상단 타이틀
    ctx.font = col.isSelf ? 'bold 19px "Nanum Myeongjo", serif' : 'bold 18px "Nanum Myeongjo", serif';
    ctx.fillStyle = col.isSelf ? '#fde68a' : '#cbd5e1';
    ctx.fillText(col.title, colX + pillarBoxWidth / 2, pillarY + 36);

    ctx.font = '13px -apple-system, sans-serif';
    ctx.fillStyle = col.isSelf ? 'rgba(251, 191, 36, 0.8)' : 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(col.sub, colX + pillarBoxWidth / 2, pillarY + 58);

    if (col.detail) {
      // 십신 (천간)
      const tenGodGan = col.detail.tenGodGan?.name ? col.detail.tenGodGan.name.split('(')[0] : '';
      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(tenGodGan, colX + pillarBoxWidth / 2, pillarY + 95);

      // 천간 글자 (대형 한자)
      const ganEl = col.detail.elGan || '목';
      const ganMeta = ELEMENT_META[ganEl] || ELEMENT_META.목;
      ctx.font = '900 64px "Nanum Myeongjo", "Batang", serif';
      ctx.fillStyle = ganMeta.lightHex;
      ctx.fillText(col.detail.gan, colX + pillarBoxWidth / 2, pillarY + 165);

      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`${col.detail.ganKr} (${ganEl})`, colX + pillarBoxWidth / 2, pillarY + 195);

      // 중간 구분선
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(colX + 30, pillarY + 215);
      ctx.lineTo(colX + pillarBoxWidth - 30, pillarY + 215);
      ctx.stroke();

      // 지지 글자 (대형 한자)
      const zhiEl = col.detail.elZhi || '토';
      const zhiMeta = ELEMENT_META[zhiEl] || ELEMENT_META.토;
      ctx.font = '900 64px "Nanum Myeongjo", "Batang", serif';
      ctx.fillStyle = zhiMeta.lightHex;
      ctx.fillText(col.detail.zhi, colX + pillarBoxWidth / 2, pillarY + 290);

      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`${col.detail.zhiKr} (${zhiEl})`, colX + pillarBoxWidth / 2, pillarY + 320);

      // 십신 (지지) & 12운성
      const tenGodZhi = col.detail.tenGodZhi?.name ? col.detail.tenGodZhi.name.split('(')[0] : '';
      ctx.font = '13px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fillText(tenGodZhi, colX + pillarBoxWidth / 2, pillarY + 355);

      ctx.font = 'bold 14px -apple-system, sans-serif';
      ctx.fillStyle = '#fde68a';
      ctx.fillText(col.detail.twelveStage || '건록', colX + pillarBoxWidth / 2, pillarY + 382);
    } else {
      ctx.font = '15px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillText('시간 미지정', colX + pillarBoxWidth / 2, pillarY + 220);
    }
    ctx.restore();
  });

  // 4. 섹션 B: 일간 본원 아키타입 하이라이트 박스
  const archBoxY = 755;
  const archBoxHeight = 195;
  ctx.save();
  const archGrad = ctx.createLinearGradient(70, archBoxY, width - 70, archBoxY);
  archGrad.addColorStop(0, 'rgba(168, 85, 247, 0.18)');
  archGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
  archGrad.addColorStop(1, 'rgba(16, 185, 129, 0.15)');
  ctx.fillStyle = archGrad;
  drawRoundedRect(ctx, 70, archBoxY, width - 140, archBoxHeight, 26);
  ctx.fill();

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 상단 뱃지
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 14px -apple-system, sans-serif';
  ctx.fillText('✨ 타고난 영혼의 본원 아키타입', 105, archBoxY + 38);

  // 아키타입 큰 제목
  ctx.font = 'bold 32px "Nanum Myeongjo", serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`"${data.dayMaster.archetypeTitle}"`, 105, archBoxY + 84);

  // 본질 해설 요약
  ctx.font = '18px -apple-system, "Pretendard", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  drawCanvasWrappedText(ctx, data.dayMaster.personalityEssence, 105, archBoxY + 120, width - 210, 26, 2);

  // 키워드 태그
  const tagStr = (data.dayMaster.coreKeywords || []).map((k) => `#${k}`).join('  ');
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillStyle = '#c084fc';
  ctx.fillText(tagStr, 105, archBoxY + 175);
  ctx.restore();

  // 5. 섹션 C: 오행(五行) 밸런스 프로그레스 & 중심/결핍 기운
  const elemBoxY = 975;
  const elemBoxHeight = 240;
  ctx.save();
  ctx.fillStyle = 'rgba(20, 22, 28, 0.9)';
  drawRoundedRect(ctx, 70, elemBoxY, width - 140, elemBoxHeight, 26);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = 'bold 18px "Nanum Myeongjo", serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('오행(五行) 에너지 밸런스', 105, elemBoxY + 40);

  // 중심/결핍 뱃지
  ctx.textAlign = 'right';
  ctx.font = '14px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText(
    `표면 개수: [${data.elements.strengthLabel || data.elements.dominant?.name}]  |  가장 적음: [${data.elements.lacking?.name}]`,
    width - 105,
    elemBoxY + 40
  );

  // 5개 오행 가로 막대 그래프
  const barStartY = elemBoxY + 75;
  const barHeight = 20;
  const elementsOrder: FiveElement[] = ['목', '화', '토', '금', '수'];

  elementsOrder.forEach((el, idx) => {
    const rowY = barStartY + idx * 30;
    const meta = ELEMENT_META[el];
    const pct = data.elements.percentages[el] || 0;
    const count = data.elements.counts[el] || 0;

    // 라벨
    ctx.textAlign = 'left';
    ctx.font = 'bold 15px "Nanum Myeongjo", serif';
    ctx.fillStyle = meta.lightHex;
    ctx.fillText(`${meta.hanja}(${el})`, 105, rowY + 16);

    // 막대 배경 트랙
    const trackX = 180;
    const trackWidth = width - 360;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    drawRoundedRect(ctx, trackX, rowY, trackWidth, barHeight, 10);
    ctx.fill();

    // 채워진 막대
    const fillWidth = Math.max(12, (trackWidth * pct) / 100);
    ctx.fillStyle = meta.hex;
    drawRoundedRect(ctx, trackX, rowY, fillWidth, barHeight, 10);
    ctx.fill();

    // 퍼센트 수치
    ctx.textAlign = 'right';
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${count}개 (${pct}%)`, width - 105, rowY + 16);
  });
  ctx.restore();

  // 6. 섹션 D: 궁통보감 한난조습(기후) & 2026 세운 전망
  const climateBoxY = 1240;
  const climateBoxHeight = 185;
  ctx.save();
  ctx.fillStyle = 'rgba(20, 22, 28, 0.9)';
  drawRoundedRect(ctx, 70, climateBoxY, width - 140, climateBoxHeight, 26);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 좌측: 기후 및 조후
  ctx.font = 'bold 18px "Nanum Myeongjo", serif';
  ctx.fillStyle = '#fde68a';
  ctx.fillText('🌡️ 궁통보감 기후 & 조후(調候) 진단', 105, climateBoxY + 40);

  const johuText = data.johuSummary || '사주 원국의 한난조습 균형을 맞추는 조후 용신 처방이 핵심입니다.';
  ctx.font = '16px -apple-system, "Pretendard", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  drawCanvasWrappedText(ctx, johuText, 105, climateBoxY + 74, width - 210, 24, 2);

  // 우측/하단: 2026 세운 테마
  if (data.annual2026) {
    ctx.font = 'bold 15px -apple-system, sans-serif';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText(`⚡ 2026 ${data.annual2026.yearName} 세운:`, 105, climateBoxY + 140);

    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(data.annual2026.theme, 280, climateBoxY + 140);
  }
  ctx.restore();

  // 7. 섹션 E: 오늘의 행운 보약 처방전 (Lucky Prescription)
  const rxBoxY = 1450;
  const rxBoxHeight = 295;
  ctx.save();
  const rxGrad = ctx.createLinearGradient(70, rxBoxY, width - 70, rxBoxY + rxBoxHeight);
  rxGrad.addColorStop(0, 'rgba(16, 185, 129, 0.16)');
  rxGrad.addColorStop(1, 'rgba(245, 158, 11, 0.12)');
  ctx.fillStyle = rxGrad;
  drawRoundedRect(ctx, 70, rxBoxY, width - 140, rxBoxHeight, 28);
  ctx.fill();

  ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.font = 'bold 22px "Nanum Myeongjo", serif';
  ctx.fillStyle = '#34d399';
  ctx.fillText('🌿 2026 운명 돌파 보약 처방 (Prescription)', 105, rxBoxY + 46);

  // 4분할 처방 그리드
  const items = [
    { label: '🎨 행운 컬러', value: data.prescription?.luckyColor || '화이트 / 골드' },
    { label: '🍲 보양 식단', value: data.prescription?.luckyFood || '따뜻한 흑미 잡곡밥과 보양탕' },
    { label: '🧭 길한 방위', value: data.prescription?.luckyDirections || '남쪽 / 동북쪽' },
    { label: '✨ 개운 행동', value: data.prescription?.breakthroughAction || '내면의 직관을 믿고 당당하게 전진하기' },
  ];

  items.forEach((item, i) => {
    const ix = i % 2 === 0 ? 105 : width / 2 + 15;
    const iy = rxBoxY + 80 + Math.floor(i / 2) * 98;
    const cardWidth = width / 2 - 120;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    drawRoundedRect(ctx, ix, iy, cardWidth, 80, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText(item.label, ix + 16, iy + 26);

    ctx.font = 'bold 16px -apple-system, "Pretendard", sans-serif';
    ctx.fillStyle = '#ffffff';
    drawCanvasWrappedText(ctx, item.value, ix + 16, iy + 52, cardWidth - 32, 22, 1);
  });
  ctx.restore();

  // 8. 푸터: 워터마크 & QR / 브랜딩
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = 'bold 17px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText('내가 타고난 운명의 설계도 • LUCKEY', width / 2, height - 100);

  ctx.font = '13px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(245, 158, 11, 0.75)';
  ctx.fillText('luckey.app 에서 무료로 만나는 정통 사주 만세력 & 타로 오라클', width / 2, height - 76);
  ctx.restore();

  return canvas;
}

/**
 * 💾 캔버스를 고해상도 PNG 파일로 저장
 */
export async function downloadSajuCanvasAsPng(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob from canvas'));
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
 * 📱 모바일 Web Share API 연동 또는 클립보드 복사
 */
export async function shareSajuDestinyStory(
  data: SajuDestinyStoryData,
  canvas?: HTMLCanvasElement
): Promise<'shared' | 'copied' | 'failed'> {
  const shareText = formatSajuDestinyShareText(data);
  const title = `[LUCKEY] ${data.name}님의 사주 만세력 운명 설계도`;

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      if (canvas && typeof navigator.canShare === 'function') {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          const file = new File([blob], `luckey_saju_${data.name}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title,
              text: shareText,
              files: [file],
            });
            return 'shared';
          }
        }
      }

      await navigator.share({
        title,
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
