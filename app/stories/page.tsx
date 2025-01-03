"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, ThumbsUp, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import Image from "next/image";

// Dummy data with realistic Bengali content
let dummyStories = [
  {
    id: "1",
    title: "নীল জলের গভীরে",
    content: "সমুদ্রের গভীরে লুকিয়ে থাকা এক অজানা রহস্যের গল্প। একদল গবেষক তাদের অভিযানে যা আবিষ্কার করলেন...",
    author: "তানভীর আহমেদ",
    likes: 234,
    comments: 45,
    createdAt: new Date("2024-01-15"),
    thumbnail: "https://random.imagecdn.app/800/600?ocean,underwater",
    readTime: "৮ মিনিট",
    category: "রহস্য"
  },
  {
    id: "2",
    title: "বৃষ্টির শহরে প্রেম",
    content: "ঢাকার ব্যস্ত রাজপথে দুটি মানুষের অপ্রত্যাশিত দেখা। বৃষ্টি ভেজা সন্ধ্যায় শুরু হওয়া এক প্রেমের গল্প...",
    author: "শাহরিন সুলতানা",
    likes: 567,
    comments: 89,
    createdAt: new Date("2024-01-18"),
    thumbnail: "https://random.imagecdn.app/800/600?rain,city",
    readTime: "১২ মিনিট",
    category: "রোমান্স"
  },
  // ...add more similar stories with different images and realistic content
];

// repeat dummysStories to make the list longer
dummyStories = [...dummyStories, ...dummyStories, ...dummyStories, ...dummyStories, ...dummyStories];

export default function StoriesPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 9;

  const handleStoryClick = (storyId: string) => {
    router.push(`/stories/view/${storyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-shadcn-dark via-shadcn to-shadcn-dark p-4 md:p-6 mt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with improved styling */}
        <div className="text-center space-y-4 py-8">
          <h1 className="font-galada text-4xl md:text-5xl font-bold text-primary">
            গল্পের ভুবনে স্বাগতম
          </h1>
          <p className="text-shadcn-muted max-w-2xl mx-auto">
            বাংলা সাহিত্যের অনন্য সব গল্প এখানে। আপনার পছন্দের গল্প খুঁজুন এবং উপভোগ করুন।
          </p>
        </div>

        {/* Filter Section with new design */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-shadcn-dark/50 p-4 rounded-lg backdrop-blur-sm">
          <Select defaultValue="latest">
            <SelectTrigger className="w-[180px] bg-shadcn-dark/50 border-shadcn-primary">
              <SelectValue placeholder="সাজানোর ক্রম" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">সর্বশেষ</SelectItem>
              <SelectItem value="popular">জনপ্রিয়</SelectItem>
              <SelectItem value="oldest">পুরনো</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">সব</Button>
            <Button variant="outline" size="sm">রহস্য</Button>
            <Button variant="outline" size="sm">রোমান্স</Button>
            <Button variant="outline" size="sm">এডভেঞ্চার</Button>
          </div>
        </div>

        {/* Stories Grid with enhanced cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyStories.map((story) => (
            <div
              key={story.id}
              className="group bg-shadcn-dark border border-shadcn-primary rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
              onClick={() => handleStoryClick(story.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={story.thumbnail}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-shadcn-dark to-transparent opacity-60" />
                <div className="absolute top-2 right-2 bg-shadcn-dark/80 px-3 py-1 rounded-full text-xs text-primary">
                  {story.category}
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h2 className="font-galada text-xl font-semibold text-primary group-hover:text-shadcn-accent cursor-pointer">
                    {story.title}
                  </h2>
                  <p className="text-sm text-shadcn-muted line-clamp-2">{story.content}</p>
                </div>

                <div className="flex justify-between items-center text-xs text-shadcn-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {story.readTime}
                  </span>
                  <span>{format(story.createdAt, 'PP')}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-shadcn-primary/30">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{story.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{story.comments}</span>
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
          ))}
        </div>

        {/* ...existing pagination code... */}
      </div>
    </div>
  );
}
