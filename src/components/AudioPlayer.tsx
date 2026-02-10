import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import AudioWaveform from "./AudioWaveform";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  onPlayStateChange?: (playing: boolean) => void;
  onComplete?: () => void;
}

const MOCK_DURATION = 72; // 72 seconds

const AudioPlayer = ({ onPlayStateChange, onComplete }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      onPlayStateChange?.(next);
      return next;
    });
  }, [onPlayStateChange]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= MOCK_DURATION) {
            setIsPlaying(false);
            onPlayStateChange?.(false);
            onComplete?.();
            if (intervalRef.current) clearInterval(intervalRef.current);
            return MOCK_DURATION;
          }
          setProgress((next / MOCK_DURATION) * 100);
          return next;
        });
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, onPlayStateChange, onComplete]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(pct);
    setCurrentTime((pct / 100) * MOCK_DURATION);
  };

  return (
    <div className="bg-audio-bg rounded-xl p-4 border border-border/60">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 bg-tag-bg px-2 py-0.5 rounded-md">
          <span className="text-[10px] font-semibold tracking-wide uppercase text-tag-foreground">
            AI Summary
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          Revise in 60 seconds
        </span>
      </div>

      {/* Player controls */}
      <div className="flex items-center gap-3">
        {/* Play button */}
        <button
          onClick={togglePlay}
          className={cn(
            "relative flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground",
            "hover:scale-105 active:scale-95 transition-all duration-200 shadow-md",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
        >
          {isPlaying && (
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-pulse-ring" />
          )}
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Waveform + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <AudioWaveform isPlaying={isPlaying} barCount={5} />
            <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div
            className="h-1.5 bg-audio-track rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-audio-progress rounded-full relative transition-all duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Time */}
        <span className="text-xs font-medium text-muted-foreground tabular-nums whitespace-nowrap">
          {formatTime(currentTime)} / {formatTime(MOCK_DURATION)}
        </span>
      </div>

      {/* Microcopy */}
      {!isPlaying && progress === 0 && (
        <p className="text-xs text-muted-foreground mt-3 text-center italic">
          🎧 Listen before you read — quick exam-focused summary
        </p>
      )}
    </div>
  );
};

export default AudioPlayer;
