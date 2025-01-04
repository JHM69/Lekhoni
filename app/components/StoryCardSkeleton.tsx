import { Card } from "@/components/ui/card";

export function StoryCardSkeleton() {
  return (
    <Card className="bg-shadcn-dark border border-shadcn-primary rounded-lg overflow-hidden">
      <div className="h-48 bg-shadcn-primary/10 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-shadcn-primary/10 rounded animate-pulse" />
          <div className="h-4 w-full bg-shadcn-primary/10 rounded animate-pulse" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-3 w-20 bg-shadcn-primary/10 rounded animate-pulse" />
          <div className="h-3 w-24 bg-shadcn-primary/10 rounded animate-pulse" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-shadcn-primary/30">
          <div className="flex gap-4">
            <div className="h-4 w-16 bg-shadcn-primary/10 rounded animate-pulse" />
            <div className="h-4 w-16 bg-shadcn-primary/10 rounded animate-pulse" />
          </div>
          <div className="h-8 w-20 bg-shadcn-primary/10 rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
}
