import type { Response } from "express";

/**
 * 🖼️ 원작 이미지 안전 리다이렉트 — 서버 의존성 없는 standalone 핸들러.
 *
 * 이전 구현은 server/ 모듈을 static import 해서 Vercel 서버리스 런타임 번들에서
 * 모듈을 찾지 못하고 500 FUNCTION_INVOCATION_FAILED로 항상 크래시해
 * "원작 다시 불러오기"가 실패했습니다. 이제 외부 모듈 없이
 * 허용된 미술관/위키미디어 CDN에 302 redirect로 안전하게 연결합니다.
 */

function applyCors(res: Response): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function isAllowedImageProxyUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (/(^|\.)local$/.test(host) || /^localhost$/.test(host) || /^(10|127)\./.test(host)) return false;
    return (
      host.endsWith(".wikimedia.org")
      || host === "upload.wikimedia.org"
      || host.endsWith(".wikipedia.org")
      || host === "image.pollinations.ai"
      || host.endsWith(".gstatic.com")
      || host.endsWith(".googleusercontent.com")
      || host === "www.dailyartmagazine.com"
      || host.endsWith(".dailyartmagazine.com")
      || host === "www.artic.edu"
      || host.endsWith(".artic.edu")
      || host === "images.metmuseum.org"
      || host.endsWith(".metmuseum.org")
    );
  } catch (_) {
    return false;
  }
}

export default async function handler(req: { method?: string; query?: Record<string, unknown> }, res: Response) {
  applyCors(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url = String(req.query.url || "");
  if (!isAllowedImageProxyUrl(url)) {
    return res.status(400).json({ error: "Invalid image URL" });
  }
  // 결정론적 리다이렉트: 같은 원본 주소는 항상 같은 Location이므로 Edge CDN이 재사용합니다.
  // 이 헤더가 없으면 작품 화면을 열 때마다 프록시 함수가 Origin 호출로 집계됩니다.
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400");
  // 브라우저가 원본 CDN에서 바로 이미지를 받아가도록 302 redirect 합니다.
  return res.redirect(302, url);
}
