import React, { useMemo, useState } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";
import { ChevronRight } from "lucide-react";
import {
  buildSongYouTubeSearchQuery,
  buildYouTubeSearchUrl,
  buildYouTubeWatchUrl,
  extractYouTubeVideoId,
} from "@/utils/artSearchQuery";

interface MuseSongYouTubePlayerProps {
  title: string;
  titleOriginal?: string;
  artist: string;
  artistOriginal?: string;
  youtubeVideoId?: string;
}

const linkClassName =
  "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-200/90 hover:text-white transition-colors";

function SongYouTubeLinks({
  searchUrl,
  playUrl,
}: {
  searchUrl: string;
  playUrl?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <a href={searchUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        YouTube에서 검색하기
        <ChevronRight size={12} />
      </a>
      {playUrl ? (
        <a href={playUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          YouTube에서 재생하기
          <ChevronRight size={12} />
        </a>
      ) : null}
    </div>
  );
}

export function MuseSongYouTubePlayer({
  title,
  titleOriginal,
  artist,
  artistOriginal,
  youtubeVideoId,
}: MuseSongYouTubePlayerProps) {
  const videoId = useMemo(() => extractYouTubeVideoId(youtubeVideoId), [youtubeVideoId]);
  const searchQuery = useMemo(
    () => buildSongYouTubeSearchQuery(title, artist, titleOriginal, artistOriginal),
    [title, titleOriginal, artist, artistOriginal],
  );
  const searchUrl = useMemo(() => buildYouTubeSearchUrl(searchQuery), [searchQuery]);
  const playUrl = useMemo(
    () => (videoId ? buildYouTubeWatchUrl(videoId, true) : undefined),
    [videoId],
  );

  const [playbackFailed, setPlaybackFailed] = useState(!videoId);

  const opts: YouTubeProps["opts"] = {
    height: "200",
    width: "100%",
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  if (playbackFailed) {
    return <SongYouTubeLinks searchUrl={searchUrl} playUrl={playUrl} />;
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg aspect-video max-h-[200px]">
        <YouTube
          videoId={videoId}
          opts={opts}
          className="w-full h-full"
          onError={() => setPlaybackFailed(true)}
        />
      </div>
      <SongYouTubeLinks searchUrl={searchUrl} playUrl={playUrl} />
    </div>
  );
}