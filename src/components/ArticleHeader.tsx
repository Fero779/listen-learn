import { ArrowLeft, Bookmark, MoreVertical, Volume2 } from "lucide-react";

const ArticleHeader = () => {
  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <button className="p-1.5 -ml-1.5 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-sans text-base font-semibold text-foreground">
          Current Affairs
        </h2>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
            <Bookmark className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;
