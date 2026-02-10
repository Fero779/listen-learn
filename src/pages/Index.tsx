import { useState, useRef, useCallback, useEffect } from "react";
import { ThumbsUp, Share2, MessageCircle } from "lucide-react";
import ArticleHeader from "@/components/ArticleHeader";
import AudioPlayer from "@/components/AudioPlayer";
import FloatingAudioBar from "@/components/FloatingAudioBar";
import PostListenNudge from "@/components/PostListenNudge";
import heroImage from "@/assets/article-hero.jpg";

const MOCK_DURATION = 72;

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track if audio player is scrolled out of view
  useEffect(() => {
    if (!hasStarted) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingBar(!entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (playerRef.current) observer.observe(playerRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Simulate audio progress for floating bar sync
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= MOCK_DURATION) {
            setIsPlaying(false);
            setShowNudge(true);
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
  }, [isPlaying]);

  const handlePlayStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
    if (playing) {
      setHasStarted(true);
      setShowNudge(false);
    }
  }, []);

  const handleComplete = useCallback(() => {
    setShowNudge(true);
  }, []);

  const toggleFloatingBar = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Highlighted keywords for the article
  const highlightedWords = ["Milan", "Italy", "48 medals", "16 events", "February 9, 2026"];

  const renderHighlightedText = (text: string) => {
    let result = text;
    highlightedWords.forEach((word) => {
      result = result.replace(
        new RegExp(`(${word})`, "g"),
        `<strong>$1</strong>`
      );
    });
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div className="min-h-screen bg-background">
      <ArticleHeader />

      <FloatingAudioBar
        isPlaying={isPlaying}
        progress={progress}
        currentTime={currentTime}
        duration={MOCK_DURATION}
        onToggle={toggleFloatingBar}
        visible={showFloatingBar && hasStarted}
      />

      <main className="max-w-2xl mx-auto">
        {/* Hero image */}
        <div className="w-full aspect-video overflow-hidden">
          <img
            src={heroImage}
            alt="Winter Olympics 2026 athlete celebrating medal win in Milan"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="px-4 pb-24">
          {/* Date */}
          <p className="text-center text-sm text-muted-foreground mt-5 mb-2">
            10th February, 2026
          </p>

          {/* Dashed separator */}
          <div className="flex justify-center mb-4">
            <div className="w-64 border-t-2 border-dashed border-border" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-serif text-primary text-center leading-tight mb-6">
            Who's Leading the Medal Race at Milan 2026? Live Winter Olympics 2026 Medal Tracker
          </h1>

          {/* Audio Player */}
          <div ref={playerRef} className="mb-6">
            <AudioPlayer
              onPlayStateChange={handlePlayStateChange}
              onComplete={handleComplete}
            />
          </div>

          {/* Post-listen nudge */}
          <PostListenNudge
            visible={showNudge}
            onReadDetail={() => {
              setShowNudge(false);
              window.scrollTo({ top: 600, behavior: "smooth" });
            }}
            onMoveOn={() => {
              setShowNudge(false);
              setProgress(0);
              setCurrentTime(0);
            }}
          />

          {/* Article body */}
          <article className="mt-6 space-y-5 text-base leading-relaxed text-foreground font-sans">
            <p>
              {renderHighlightedText(
                "The 2026 Winter Olympics have officially begun in Milan, Italy, and the competition is already delivering exciting medal moments. As of February 9, 2026, the Games have completed 16 events, producing 48 medals across disciplines."
              )}{" "}
              Early action has seen strong performances from traditional winter sports powerhouses as well as surprise contenders. Fans and analysts are closely watching the daily medal count, which is shaping the narrative of the Games in their opening phase.
            </p>

            <h2 className="text-xl md:text-2xl font-serif text-foreground !mt-8">
              Early Highlights from the Milan Winter Games
            </h2>

            <p>
              The biathlon and cross-country skiing events have seen fierce competition, with Scandinavian nations asserting dominance. Norway's athletes have already secured multiple golds, continuing their legacy as a winter sports powerhouse. Meanwhile, host nation Italy has thrilled home crowds with strong showings in short track speed skating.
            </p>

            <div className="bg-accent rounded-xl p-4 border border-border/60">
              <h3 className="text-sm font-semibold text-accent-foreground mb-2 uppercase tracking-wide">
                📝 Key Points for Exams
              </h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  2026 Winter Olympics are being held in Milan-Cortina, Italy
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  16 events completed with 48 medals awarded by Feb 9
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  Norway leads the early medal tally
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  Italy performing well in short track speed skating
                </li>
              </ul>
            </div>

            <p>
              Figure skating, one of the most-watched disciplines, kicks off its team event this week. Alpine skiing events are scheduled across the stunning slopes of Cortina d'Ampezzo, drawing global attention to Italy's breathtaking Dolomites.
            </p>

            <p>
              The medal tracker remains dynamic, with multiple nations within striking distance of the top spots. As events intensify in the second week, expect dramatic shifts in the overall standings.
            </p>
          </article>

          {/* Bottom bar */}
          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Be the first one to comment
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <div className="flex-1 bg-secondary rounded-full px-4 py-2 text-sm text-muted-foreground">
                  Write a comment...
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
