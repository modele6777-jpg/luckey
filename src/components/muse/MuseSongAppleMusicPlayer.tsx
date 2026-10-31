import React, { useMemo } from "react";
import { ChevronRight, Music } from "lucide-react";

interface MuseSongAppleMusicPlayerProps {
  title: string;
  titleOriginal?: string;
  artist: string;
  artistOriginal?: string;
  appleMusicClassicalUrl?: string;
}

/**
 * Builds an Apple Music Classical search link for a piece without a verified
 * album link, so every recommendation stays playable ("infinite" catalog).
 */
export function buildAppleMusicClassicalSearchUrl(title: string, artist?: string): string {
  const term = [artist, title]
    .filter((part) => part && part.trim())
    .join(" ")
    .trim();
  return `https://classical.music.apple.com/search?term=${encodeURIComponent(term)}`;
}

/**
 * Converts any Apple Music / Apple Music Classical web link (e.g.
 * `https://classical.music.apple.com/kr/album/1358340973`) into its
 * `embed.music.apple.com` iframe URL. Search pages cannot be embedded;
 * for those the caller should fall back to the external open button.
 */
export function resolveAppleMusicClassicalEmbedUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (!/(^|\.)music\.apple\.com$/i.test(parsed.hostname)) return undefined;
    if (parsed.pathname.startsWith("/search")) return undefined;
    return `https://embed.music.apple.com${parsed.pathname}${parsed.search}`;
  } catch {
    return undefined;
  }
}

/**
 * Guarantees that any famous song (fallback, catalog, or AI-generated) carries
 * an Apple Music Classical destination: verified album URL when present, an
 * auto-generated Classical search URL otherwise.
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

const linkClassName =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-[10px] font-black uppercase tracking-widest text-rose-200/90 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer";

export function MuseSongAppleMusicPlayer({
  title,
  titleOriginal,
  artist,
  artistOriginal,
  appleMusicClassicalUrl,
}: MuseSongAppleMusicPlayerProps) {
  const openUrl = useMemo(() => {
    const explicit = appleMusicClassicalUrl?.trim();
    return explicit || buildAppleMusicClassicalSearchUrl(title, artistOriginal || artist);
  }, [appleMusicClassicalUrl, title, titleOriginal, artist, artistOriginal]);
  const embedUrl = useMemo(() => resolveAppleMusicClassicalEmbedUrl(openUrl), [openUrl]);

  return (
    <div className="space-y-3">
      {embedUrl ? (
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/40">
          <iframe
            src={embedUrl}
            title={`${artist} - ${title}`}
            allow="autoplay; encrypted-media; fullscreen"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation"
            className="w-full h-[200px] border-0"
            loading="lazy"
          />
        </div>
      ) : null}
      <div>
        <a href={openUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          <Music size={13} />
          Apple Music Classical에서 열기 ↗
          <ChevronRight size={12} />
        </a>
      </div>
    </div>
  );
}
