"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Rewind, FastForward } from "lucide-react";

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  videoClassName?: string;
}

export default function CustomVideoPlayer({
  src,
  poster,
  autoPlay = false,
  className = "",
  videoClassName = "w-full h-full object-cover",
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showVideoOverlay, setShowVideoOverlay] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleWakeUp = () => {
    setShowVideoOverlay(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Only auto-hide if it is currently playing
    if (videoRef.current && !videoRef.current.paused) {
      timeoutRef.current = setTimeout(() => {
        setShowVideoOverlay(false);
      }, 2500);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => setShowVideoOverlay(true), 0);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowVideoOverlay(false);
      }, 2500);
    } else {
      setTimeout(() => setShowVideoOverlay(true), 0);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying]);

  const handlePlayPause = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
    handleWakeUp();
  };

  const handleSkip = (seconds: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
    handleWakeUp();
  };

  return (
    <div
      className={`relative group ${className}`}
      onClick={handleWakeUp}
      onMouseMove={handleWakeUp}
      onMouseLeave={() => {
        if (isPlaying) setShowVideoOverlay(false);
      }}
    >
      <video
        ref={videoRef}
        className={`relative z-10 ${videoClassName}`}
        src={src}
        autoPlay={autoPlay}
        controls
        poster={poster}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Custom Youtube-like Overlay */}
      <div
        className={`absolute inset-0 bottom-14 z-20 flex items-center justify-between pointer-events-none transition-all duration-300 ${
          showVideoOverlay || !isPlaying ? "opacity-100 bg-transparent" : "opacity-0 bg-transparent"
        }`}
      >
        {/* Rewind Zone */}
        <div
          className="h-full w-1/3 flex items-center justify-center pointer-events-auto cursor-pointer"
          onDoubleClick={(e) => handleSkip(-10, e)}
          onClick={handleWakeUp}
        >
          <button
            onClick={(e) => handleSkip(-10, e)}
            className="p-3 md:p-4 rounded-full text-white/90 hover:text-white hover:bg-white/20 hover:backdrop-blur-sm active:scale-95 hover:scale-110 transition-all focus:outline-none drop-shadow-lg"
          >
            <Rewind size={24} className="md:w-8 md:h-8" />
          </button>
        </div>

        {/* Play/Pause Zone */}
        <div
          className="h-full w-1/3 flex items-center justify-center pointer-events-auto cursor-pointer"
          onClick={handlePlayPause}
        >
          <button className="p-4 md:p-6 rounded-full text-white/90 hover:text-white hover:bg-white/20 hover:backdrop-blur-sm active:scale-95 hover:scale-110 transition-all focus:outline-none drop-shadow-xl">
            {isPlaying ? (
              <Pause size={40} className="md:w-14 md:h-14" />
            ) : (
              <Play size={40} className="md:w-14 md:h-14 ml-1 md:ml-2" />
            )}
          </button>
        </div>

        {/* Forward Zone */}
        <div
          className="h-full w-1/3 flex items-center justify-center pointer-events-auto cursor-pointer"
          onDoubleClick={(e) => handleSkip(10, e)}
          onClick={handleWakeUp}
        >
          <button
            onClick={(e) => handleSkip(10, e)}
            className="p-3 md:p-4 rounded-full text-white/90 hover:text-white hover:bg-white/20 hover:backdrop-blur-sm active:scale-95 hover:scale-110 transition-all focus:outline-none drop-shadow-lg"
          >
            <FastForward size={24} className="md:w-8 md:h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
