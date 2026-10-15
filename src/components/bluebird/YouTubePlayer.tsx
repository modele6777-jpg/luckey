import React from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

interface YouTubePlayerProps {
  videoId: string;
  onReady?: (event: any) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onReady }) => {
  const opts: YouTubeProps['opts'] = {
    height: '200',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
      <YouTube videoId={videoId} opts={opts} onReady={onReady} />
    </div>
  );
};

export default YouTubePlayer;
