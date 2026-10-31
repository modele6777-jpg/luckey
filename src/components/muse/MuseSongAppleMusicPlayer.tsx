import React, { useMemo, useState } from "react";
import { ChevronRight, Music, RefreshCw, Sparkles, ExternalLink } from "lucide-react";

export interface MuseSongAppleMusicPlayerProps {
  title: string;
  titleOriginal?: string;
  artist: string;
  artistOriginal?: string;
  appleMusicClassicalUrl?: string;
  youtubeVideoId?: string;
}

/**
 * 한국 Apple Music Classical 검색 URL 빌더
 * 국가 코드(/kr/)를 명시하여 해외 스토어(/us/) 리다이렉트로 인한
 * "이 콘텐츠는 사용자의 국가 또는 지역에서는 제공되지 않습니다" 오류를 원천 차단합니다.
 */
export function buildAppleMusicClassicalSearchUrl(title: string, artist?: string): string {
  const term = [artist, title]
    .filter((part) => part && part.trim())
    .join(" ")
    .trim();
  return `https://classical.music.apple.com/kr/search?term=${encodeURIComponent(term)}`;
}

/** YouTube 검색 결과 URL */
export function buildYouTubeSearchUrl(title: string, artist?: string): string {
  const term = [artist, title]
    .filter((part) => part && part.trim())
    .join(" ")
    .trim();
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`;
}

/** 알려진 404/미제공 Apple Music 앨범 ID 블랙리스트 */
const DEAD_APPLE_MUSIC_ALBUMS = new Set([
  "1440843236",
  "1545642456",
]);

/**
 * Converts any Apple Music / Apple Music Classical web link
 * into its embed.music.apple.com iframe URL.
 * 404/지역 제한 ID는 null을 반환하여 회색 빈 박스 노출을 차단합니다.
 */
export function resolveAppleMusicClassicalEmbedUrl(url?: string): string | undefined {
  if (!url) return undefined;
  for (const deadId of DEAD_APPLE_MUSIC_ALBUMS) {
    if (url.includes(deadId)) return undefined;
  }
  try {
    const parsed = new URL(url);
    if (!/(^|\.)music\.apple\.com$/i.test(parsed.hostname)) return undefined;
    if (parsed.pathname.startsWith("/search") || parsed.pathname.includes("/search")) return undefined;
    // /album/ 경로가 온전한지 확인
    if (!parsed.pathname.includes("/album/")) return undefined;
    return `https://embed.music.apple.com${parsed.pathname}${parsed.search}`;
  } catch {
    return undefined;
  }
}

/** 주요 클래식 명곡 유튜브 고화질 공식 연주 영상 매핑 사전 */
export const YOUTUBE_CLASSICAL_MAP: Record<string, string> = {
  "사랑의 인사": "MreT_U00zI8",
  "Salut d'Amour": "MreT_U00zI8",
  "달빛": "WNcsUNKlAKw",
  "Clair de Lune": "WNcsUNKlAKw",
  "엘리제를 위하여": "yAsDLGjMhFI",
  "Für Elise": "yAsDLGjMhFI",
  "캐논": "Ptk_1Dc2iPY",
  "Canon": "Ptk_1Dc2iPY",
  "캐논 변주곡": "Ptk_1Dc2iPY",
  "녹턴": "ZtIW2r1EalM",
  "Nocturne": "ZtIW2r1EalM",
  "G선상의 아리아": "pzlw6fUux4o",
  "Air on the G String": "pzlw6fUux4o",
  "트로이메라이": "6z82wC0U6LU",
  "Träumerei": "6z82wC0U6LU",
  "파반느": "mpgyEl4G2ZA",
  "Pavane": "mpgyEl4G2ZA",
  "피아노 협주곡 2번": "rEGOihjqO9w",
  "짐노페디": "S-Xm7s9e96Y",
  "Gymnopédie": "S-Xm7s9e96Y",
  "달빛 소나타": "4Tr0otuiQuU",
  "보칼리제": "n_hN_g7j_O0",
  "아베 마리아": "WI4nFfWvEtg",
  "Ave Maria": "WI4nFfWvEtg",
  "동물의 사육제": "3qrKj5eyvNg",
  "백조": "3qrKj5eyvNg",
  "신세계로부터": "oLWtCYPfAmg",
  "사계": "GRxofEmo3HA",
  "아다지에토": "VWPACeZKgDM",
  "황제": "qUn6u2wL-uE",
  "클라리넷 협주곡": "YT_63UntRJE",
  "빗방울 전주곡": "6OFHXmiZP38",
  "이별의 곡": "wlsdMpnDBn8",
  "골드베르크": "Ah392lnFHxM",
  "호두까기 인형": "QxHkLSCxu44",
  "아라베스크": "Yh36PaE-Pf0",
  "페르 귄트": "kzZNgL49t3I",
  "아침의 기분": "kzZNgL49t3I",
  "인터메초": "48bQksvgdJ4",
  "시칠리아노": "p1gV_rPvhK4",
  "사랑의 꿈": "KpOtuoHL45Y",
  "목신의 오후": "Ol4bJkOCvH0",
  "교향곡 5번": "_4IRnGS1l48",
  "무반주 첼로 모음곡": "1prwe0WcGY8",
  "Rhapsody in Blue": "IIc7xuiVqVI",
};

/**
 * 곡 제목과 작곡가로부터 최적의 YouTube Video ID를 찾습니다.
 */
export function resolveYouTubeVideoId(title: string, artist?: string, explicitId?: string): string {
  if (explicitId && explicitId.trim()) return explicitId.trim();
  const cleanedTitle = title.replace(/\s*\([^)]*\)/g, "").trim();
  for (const [key, id] of Object.entries(YOUTUBE_CLASSICAL_MAP)) {
    if (title.includes(key) || cleanedTitle.includes(key)) return id;
  }
  return "";
}

/**
 * Guarantees that any famous song carries an Apple Music Classical destination.
 */
export function ensureAppleMusicClassicalUrl<
  T extends { title: string; artist?: string; artistOriginal?: string; appleMusicClassicalUrl?: string },
>(song: T): T {
  if (song.appleMusicClassicalUrl && song.appleMusicClassicalUrl.trim()) return song;
  return {
    ...song,
    appleMusicClassicalUrl: buildAppleMusicClassicalSearchUrl(
      song.title,
      song.artistOriginal || song.artist,
    ),
  };
}

const YoutubeIcon = ({ size = 14, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const AppleIcon = ({ size = 14, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-.97 1.7-0.85 2.72.99.08 2.01-.51 2.55-1.22z"/>
  </svg>
);

const linkClassName =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-[11px] font-bold tracking-wide text-rose-200/90 hover:text-white hover:bg-white/[0.1] active:scale-95 transition-all cursor-pointer";

export function MuseSongAppleMusicPlayer({
  title,
  titleOriginal,
  artist,
  artistOriginal,
  appleMusicClassicalUrl,
  youtubeVideoId,
}: MuseSongAppleMusicPlayerProps) {
  // Apple Music 목적지 URL (한국 스토어 검색 딥링크 우선)
  const openAppleUrl = useMemo(() => {
    const explicit = appleMusicClassicalUrl?.trim();
    // 만약 알려진 404 앨범 ID가 들어있다면, 사용자가 앱에서 열었을 때 국가/지역 제한 팝업이 뜨지 않도록 즉시 /kr/search로 변환
    if (explicit) {
      for (const deadId of DEAD_APPLE_MUSIC_ALBUMS) {
        if (explicit.includes(deadId)) {
          return buildAppleMusicClassicalSearchUrl(title, artistOriginal || artist);
        }
      }
      return explicit;
    }
    return buildAppleMusicClassicalSearchUrl(title, artistOriginal || artist);
  }, [appleMusicClassicalUrl, title, titleOriginal, artist, artistOriginal]);

  const embedAppleUrl = useMemo(() => resolveAppleMusicClassicalEmbedUrl(openAppleUrl), [openAppleUrl]);

  // YouTube 연동
  const resolvedYtId = useMemo(
    () => resolveYouTubeVideoId(title, artistOriginal || artist, youtubeVideoId),
    [title, artistOriginal, artist, youtubeVideoId]
  );

  const openYoutubeUrl = useMemo(() => {
    if (resolvedYtId) return `https://www.youtube.com/watch?v=${resolvedYtId}`;
    return buildYouTubeSearchUrl(title, artistOriginal || artist);
  }, [resolvedYtId, title, artistOriginal, artist]);

  const embedYoutubeUrl = useMemo(() => {
    if (resolvedYtId) {
      return `https://www.youtube-nocookie.com/embed/${resolvedYtId}?autoplay=0&rel=0&playsinline=1`;
    }
    const query = [artistOriginal || artist, title].filter(Boolean).join(" ");
    return `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(query)}&playsinline=1`;
  }, [resolvedYtId, artistOriginal, artist, title]);

  // 🌟 스마트 기본 모드 결정:
  // Apple Music 임베드가 불가능하거나(404 ID), 회색 먹통 박스가 뜰 위험이 있는 곡은
  // 사용자 요청("애플뮤직에서 재생 안되는 콘텐츠는 유튜브로 나오게 해줘")에 따라 즉시 YouTube를 기본으로 띄웁니다!
  const defaultTab = embedAppleUrl ? "applemusic" : "youtube";
  const [activeTab, setActiveTab] = useState<"applemusic" | "youtube">(defaultTab);

  return (
    <div className="space-y-3.5 pb-2">
      {/* 🎵 플랫폼 상호 전환 탭 바 */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="inline-flex items-center p-1 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("applemusic")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "applemusic"
                ? "bg-gradient-to-r from-rose-500/80 to-pink-600/80 text-white shadow-md shadow-rose-950/50"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <AppleIcon size={13} />
            Apple Music
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("youtube")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "youtube"
                ? "bg-gradient-to-r from-red-600/90 to-rose-600/90 text-white shadow-md shadow-red-950/50"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <YoutubeIcon size={13} className={activeTab === "youtube" ? "text-white" : "text-red-400"} />
            YouTube
          </button>
        </div>

        {/* 상호 자동 백업 안내 뱃지 */}
        <span className="text-[10px] text-white/50 flex items-center gap-1 font-mono">
          <Sparkles size={11} className="text-amber-400/80" />
          상호 자동 폴백 지원
        </span>
      </div>

      {/* 🍎 1. Apple Music 탭 */}
      {activeTab === "applemusic" && (
        <div className="space-y-3">
          {embedAppleUrl ? (
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black/50">
              <iframe
                src={embedAppleUrl}
                title={`${artist} - ${title} (Apple Music)`}
                allow="autoplay; encrypted-media; fullscreen"
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation"
                className="w-full h-[200px] border-0"
                loading="lazy"
              />
            </div>
          ) : (
            /* Apple Music 인플레이스 앨범이 한국 스토어에 없는 경우: 친절한 우회 가이드 & 유튜브 원클릭 추천 */
            <div className="rounded-2xl p-4 border border-rose-500/25 bg-gradient-to-br from-rose-950/30 to-black/60 space-y-3 text-left">
              <div className="flex items-start gap-2.5">
                <Music size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">
                    한국 Apple Music Classical 검색 딥링크 제공
                  </p>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    이 음원은 앨범 직링 대신 공식 앱 검색으로 바로 연결되거나, 아래 YouTube로 화면 안에서 즉시 감상하실 수 있습니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("youtube")}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-200 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <YoutubeIcon size={14} className="text-red-400" />
                YouTube로 즉시 감상하기 (추천)
              </button>
            </div>
          )}

          {/* 하단 액션 버튼들 */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
            <a href={openAppleUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              <AppleIcon size={13} />
              Apple Music Classical에서 열기 ↗
              <ChevronRight size={12} />
            </a>

            <button
              type="button"
              onClick={() => setActiveTab("youtube")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-red-300 hover:text-white hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <YoutubeIcon size={12} className="text-red-400" />
              재생이 안 되나요? YouTube로 전환
            </button>
          </div>
        </div>
      )}

      {/* ▶️ 2. YouTube 탭 */}
      {activeTab === "youtube" && (
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden border border-red-500/25 shadow-xl bg-black/60">
            <iframe
              src={embedYoutubeUrl}
              title={`${artist} - ${title} (YouTube)`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-[220px] border-0"
              loading="lazy"
            />
          </div>

          {/* 하단 액션 버튼들 */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
            <a href={openYoutubeUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              <YoutubeIcon size={14} className="text-red-400" />
              YouTube 앱/웹에서 열기 ↗
              <ChevronRight size={12} />
            </a>

            <button
              type="button"
              onClick={() => setActiveTab("applemusic")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-rose-300 hover:text-white hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <AppleIcon size={12} />
              Apple Music으로 전환
            </button>
          </div>
        </div>
      )}

      {/* 💡 상호 폴백 힌트 메시지 */}
      <p className="text-[10px] text-white/40 leading-relaxed font-sans pt-1 border-t border-white/5">
        💡 특정 플랫폼에서 국가·지역 제한 또는 로딩 정체가 발생하면, 위 탭이나 전환 버튼을 눌러 상호 보완 음원으로 끊김 없이 들으실 수 있습니다.
      </p>
    </div>
  );
}
