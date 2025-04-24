"use client";

import { updateLessonProgress } from "@/services";
import React, { useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";

type VideoPlayerProps = {
  videoSrc: string;
  setIsSaveProgress: React.Dispatch<React.SetStateAction<boolean>>;
  progressId: string | undefined;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  setIsSaveProgress,
  progressId,
}) => {
  const playerRef = useRef<any>(null);
  const [played, setPlayed] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [seekTarget, setSeekTarget] = useState<number | null>(null);

  const handleProgress = (state: any) => {
    const played = state.played * 100;
    setPlayed(played);

    if (played >= 80 && progressId) {
      console.log("Calling API at 80% of the video");
      updateLessonProgress(progressId);
    }
  };

  const handleSeek = (seconds: number) => {
    setSeekTarget(seconds);
  };

  const handleBuffer = () => {
    setIsBuffering(true);
  };

  const handleBufferEnd = () => {
    setIsBuffering(false);
    if (seekTarget !== null && playerRef.current) {
      playerRef.current.seekTo(seekTarget, "seconds");
      setSeekTarget(null);
    }
  };

  return (
    <div className="relative w-full h-full">
      {isBuffering && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white" />
        </div>
      )}
      <ReactPlayer
        ref={playerRef}
        url={videoSrc}
        controls
        onProgress={handleProgress}
        onEnded={() => setIsSaveProgress((prev) => !prev)}
        onSeek={handleSeek}
        onBuffer={handleBuffer}
        onBufferEnd={handleBufferEnd}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default React.memo(VideoPlayer);
