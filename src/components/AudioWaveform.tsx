import { cn } from "@/lib/utils";

interface AudioWaveformProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

const AudioWaveform = ({ isPlaying, barCount = 5, className }: AudioWaveformProps) => {
  return (
    <div className={cn("flex items-center gap-[3px] h-5", className)}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-[3px] rounded-full bg-audio-wave transition-all duration-300",
            isPlaying ? "animate-waveform" : "h-1.5"
          )}
          style={{
            animationDelay: isPlaying ? `${i * 0.12}s` : undefined,
            height: isPlaying ? undefined : "6px",
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
