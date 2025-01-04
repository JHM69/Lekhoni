import { Clock, ThumbsUp, MessageCircle, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

// Example StoryCard component:
function StoryCard({ story, handleStoryClick }) {
  return (
    <div
      key={story.id}
      className="flex items-start bg-shadcn-dark border border-shadcn-primary rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
      // If you only want navigation on the button, remove onClick here:
      onClick={() => handleStoryClick(story.id)}
    >
      {/* Left: Small Image */}
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
        <img
          src={story.thumbnail}
          alt={story.title}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right: Title, summary, tags, metadata, and button */}
      <div className="flex-1 p-4 space-y-3">
        {/* Title + Tag */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary group-hover:text-shadcn-accent cursor-pointer">
            {story.title}
          </h2>
          <div className="bg-primary px-3 py-1 rounded-full text-xs text-primary-foreground">
            {story.tags}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-shadcn-muted line-clamp-2">
          {story.summary}
        </p>

        {/* Meta info: reading time & date */}
        <div className="flex justify-between items-center text-xs text-shadcn-muted">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.ceil(story.numberOfWords / 200)+6} মিনিট
          </span>
          <span>{format(new Date(story.createdAt), "PP")}</span>
        </div>

        {/* Footer: likes, comments, and button */}
        <div className="flex items-center justify-between pt-4 border-t border-shadcn-primary/30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">{story.liked}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{story.numberOfComments}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hover:text-primary hover:bg-shadcn-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              handleStoryClick(story.id);
            }}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            পড়ুন
          </Button>
        </div>
      </div>
    </div>
  );
}

export default StoryCard;
