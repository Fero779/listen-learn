import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import AudioWaveform from "./AudioWaveform";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  onPlayStateChange?: (playing: boolean) => void;
  onComplete?: () => void;
}

const SUMMARY_TEXT = `The 2026 Winter Olympics have officially begun in Milan, Italy. As of February 9th, 16 events have been completed, producing 48 medals across various disciplines. Norway leads the early medal tally, continuing their dominance in winter sports. Host nation Italy has impressed home crowds with strong performances in short track speed skating. The biathlon and cross-country skiing events have seen fierce Scandinavian competition. Figure skating's team event kicks off this week, while alpine skiing events are scheduled across the stunning slopes of Cortina d'Ampezzo. This is important for exams because the Milan-Cortina 2026 Games are a major international sporting event, and questions may focus on host cities, medal counts, and key participating nations.`;

const ESTIMATED_DURATION = 45; // approximate seconds for the summary

const AudioPlayer = ({ onPlayStateChange, onComplete }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(ESTIMATED_DURATION);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Pick a calm, smooth voice
  const getVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    // Prefer a soft female English voice
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Samantha") ||
          v.name.includes("Google UK English Female") ||
          v.name.includes("Microsoft Zira") ||
          v.name.includes("Karen") ||
          v.name.includes("Moira") ||
          v.name.includes("Fiona"))
    );
    return preferred || voices.find((v) => v.lang.startsWith("en")) || voices[0];
  }, []);

  const updateProgress = useCallback(() => {
    if (!startTimeRef.current) return;
    const elapsed = elapsedBeforePauseRef.current + (Date.now() - startTimeRef.current) / 1000;
    setCurrentTime(elapsed);
    setProgress(Math.min((elapsed / duration) * 100, 100));
    animFrameRef.current = requestAnimationFrame(updateProgress);
  }, [duration]);

  const stopProgressTracking = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
  }, []);

  const handleEnd = useCallback(() => {
    stopProgressTracking();
    setIsPlaying(false);
    setProgress(100);
    setCurrentTime(duration);
    elapsedBeforePauseRef.current = 0;
    startTimeRef.current = 0;
    onPlayStateChange?.(false);
    onComplete?.();
  }, [duration, onPlayStateChange, onComplete, stopProgressTracking]);

  const speak = useCallback(() => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(SUMMARY_TEXT);
    utterance.rate = 0.9; // slightly slower for calm feel
    utterance.pitch = 1.0;
    utterance.volume = 1;

    const voice = getVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = handleEnd;
    utterance.onerror = handleEnd;

    utteranceRef.current = utterance;
    startTimeRef.current = Date.now();
    window.speechSynthesis.speak(utterance);
    animFrameRef.current = requestAnimationFrame(updateProgress);
  }, [getVoice, handleEnd, updateProgress]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      // Pause
      window.speechSynthesis.pause();
      stopProgressTracking();
      elapsedBeforePauseRef.current += (Date.now() - startTimeRef.current) / 1000;
      startTimeRef.current = 0;
      setIsPlaying(false);
      onPlayStateChange?.(false);
    } else {
      // Play or resume
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        startTimeRef.current = Date.now();
        animFrameRef.current = requestAnimationFrame(updateProgress);
      } else {
        // Fresh start
        elapsedBeforePauseRef.current = 0;
        setProgress(0);
        setCurrentTime(0);
        speak();
      }
      setIsPlaying(true);
      onPlayStateChange?.(true);
    }
  }, [isPlaying, onPlayStateChange, speak, stopProgressTracking, updateProgress]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.cancel();
      stopProgressTracking();
    };
  }, [stopProgressTracking]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Progress click doesn't seek with SpeechSynthesis (not supported)
    // Just visual feedback
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
          {formatTime(currentTime)} / {formatTime(duration)}
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
