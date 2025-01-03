"use client";
import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  Heart,
  Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

// Dummy story data
const dummyStory = {
  id: "1",
  title: "নীল জলের গভীরে",
  content: `<p>সমুদ্রের গভীরে লুকিয়ে থাকা এক অজানা রহস্যের গল্প। একদল গবেষক তাদের অভিযানে যা আবিষ্কার করলেন, তা তাদের জীবন চিরদিনের জন্য বদলে দিল...</p>
  <p>গভীর সমুদ্রের নীল জলে ডুব দিয়ে তারা খুঁজে পেল এক প্রাচীন সভ্যতার ধ্বংসাবশেষ। সেখানে ছিল অজানা লিপিতে লেখা কিছু তথ্য, যা বর্তমান বিজ্ঞানের সীমানা ছাড়িয়ে যায়...</p>
  <p>প্রতিদিন নতুন নতুন আবিষ্কার তাদের আরও গভীরে টেনে নিয়ে যেতে থাকে। কিন্তু সেই গভীরে লুকিয়ে আছে এমন কিছু, যা মানবজাতির জন্য হুমকি হয়ে উঠতে পারে...</p>`,
  author: {
    id: "1",
    name: "তানভীর আহমেদ",
    image: "https://api.dicebear.com/7.x/personas/svg?seed=tanvir",
    bio: "বাংলা সাহিত্যের একজন উদীয়মান লেখক। রহস্য ও এডভেঞ্চার গল্প লেখায় বিশেষ দক্ষ।",
    followers: 1234,
    storiesCount: 45,
  },
  thumbnail: "https://random.imagecdn.app/1200/400?ocean,underwater",
  category: "রহস্য",
  readTime: "৮ মিনিট",
  createdAt: new Date("2024-01-15"),
  likes: 234,
  comments: [
    {
      id: "1",
      user: {
        id: "2",
        name: "সাদিয়া আহমেদ",
        image: "https://api.dicebear.com/7.x/personas/svg?seed=sadia",
      },
      content: "দারুণ গল্প! পরের পর্বের জন্য অপেক্ষায় রইলাম।",
      createdAt: new Date("2024-01-16"),
      likes: 12,
    },
    // Add more comments as needed
  ],
};

export default function StoryViewPage() {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();

  const goToProfile = (userId: string) => {
    router.push(`/profile/view/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-shadcn-dark via-shadcn to-shadcn-dark p-4 md:p-6 mt-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Story Header */}
        <div className="space-y-4">
          <h1 className="font-galada text-4xl md:text-5xl font-bold text-primary">
            {dummyStory.title}
          </h1>
          
          {/* Author info and metadata */}
          <div className="flex items-center justify-between py-4 border-y border-shadcn-primary/30">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 cursor-pointer" onClick={() => goToProfile(dummyStory.author.id)}>
                <AvatarImage src={dummyStory.author.image} />
                <AvatarFallback>{dummyStory.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-primary">{dummyStory.author.name}</h3>
                <div className="flex items-center gap-4 text-sm text-shadcn-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {dummyStory.readTime}
                  </span>
                  <span>{format(dummyStory.createdAt, 'PP')}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="hover:text-primary">
              Follow
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src={dummyStory.thumbnail}
            alt={dummyStory.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Story Content */}
        <article className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: dummyStory.content }} />
        </article>

        {/* Reactions Bar */}
        <div className="flex items-center justify-between py-6 border-y border-shadcn-primary/30">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              className={`flex items-center gap-2 ${isLiked ? 'text-primary' : ''}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{dummyStory.likes}</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>{dummyStory.comments.length}</span>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 ${isBookmarked ? 'text-primary' : ''}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              Save
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-galada text-primary">মন্তব্যসমূহ</h3>
          
          {/* Comment Input */}
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="আপনার মন্তব্য লিখুন..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button className="float-right">
                <Send className="w-4 h-4 mr-2" />
                পোস্ট করুন
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4 mt-8">
            {dummyStory.comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-10 w-10 cursor-pointer" onClick={() => goToProfile(comment.user.id)}>
                  <AvatarImage src={comment.user.image} />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-primary">{comment.user.name}</h4>
                    <span className="text-xs text-shadcn-muted">
                      {format(comment.createdAt, 'PP')}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                  <div className="flex items-center gap-2 text-sm text-shadcn-muted">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Stories Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-galada text-primary">সম্পর্কিত গল্পসমূহ</h3>
          {/* Add related stories here */}
        </div>
      </div>
    </div>
  );
}
