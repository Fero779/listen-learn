import { BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostListenNudgeProps {
  visible: boolean;
  onReadDetail: () => void;
  onMoveOn: () => void;
}

const PostListenNudge = ({ visible, onReadDetail, onMoveOn }: PostListenNudgeProps) => {
  if (!visible) return null;

  return (
    <div className="animate-slide-up bg-nudge-bg border border-border rounded-xl p-4 mt-4">
      <p className="text-sm font-semibold text-nudge-foreground mb-3 text-center">
        ✅ Summary complete! What's next?
      </p>
      <div className="flex gap-3">
        <button
          onClick={onReadDetail}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg",
            "bg-card border border-border text-foreground text-sm font-medium",
            "hover:bg-secondary transition-colors"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Read in detail
        </button>
        <button
          onClick={onMoveOn}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg",
            "bg-primary text-primary-foreground text-sm font-medium",
            "hover:opacity-90 transition-opacity"
          )}
        >
          Next article
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PostListenNudge;
