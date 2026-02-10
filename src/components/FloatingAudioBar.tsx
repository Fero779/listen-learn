import { Play, Pause } from "lucide-react";
import AudioWaveform from "./AudioWaveform";
import { cn } from "@/lib/utils";

interface FloatingAudioBarProps {
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  onToggle: () => void;
  visible: boolean;
}

const FloatingAudioBar = ({
  isPlaying,
  progress,
  currentTime,
  duration,
  onToggle,
  visible,
}: FloatingAudioBarProps) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-up">
      <div className="max-w-2xl mx-auto px-4 pt-2 pb-1">
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-3">
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
          <AudioWaveform isPlaying={isPlaying} barCount={4} className="h-4" />
          <div className="flex-1 h-1 bg-audio-track rounded-full">
            <div
              className="h-full bg-audio-progress rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FloatingAudioBar;
