"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useSession } from "next-auth/react";

const similarStories = [
  {
    id: "2",
    title: "সাগরের ডাক",
    thumbnail: "https://random.imagecdn.app/300/200?ocean",
    author: "রিফাত হোসেন",
    readTime: "৫ মিনিট",
  },
  // ...add more similar stories
];

const trendingStories = [
  {
    id: "3",
    title: "অতলে যাত্রা",
    thumbnail: "https://random.imagecdn.app/300/200?deep",
    likes: 456,
    comments: 89,
  },
  // ...add more trending stories
];

export default function StoryViewPage() {
  const [story, setStory] = useState(null);
  const [author , setAuthor] = useState(null);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const user = useSession().data?.user;
  useEffect(() => {
    if (id) {
      axios.get(`/api/story/single?storyId=${String(id)}`)
        .then(response => {
          if (response.data.status === "success") {
            console.log("Story Fetched from Database", response.data.story);
            setStory(response.data.story[0]);
            setAuthor(response.data.author);
          }
        })
        .catch(error => {
          console.error("Error fetching story data:", error);
        });
    }
  }, [id]);

  if (!story) {
    return <div>Loading...</div>;
  }

  const goToProfile = (userId: string) => {
    router.push(`/profile/view/${userId}`);
  };

  return (
    <ScrollArea className="h-full">
      <div className="min-h-screen bg-gradient-to-b from-shadcn-dark via-shadcn to-shadcn-dark p-4 md:p-6 mt-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Story Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="font-galada text-4xl md:text-5xl font-bold text-primary">
                {story.title}
              </h1>
              
              {/* Author info and metadata */}
              <div className="flex items-center justify-between py-4 border-y border-shadcn-primary/30">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 cursor-pointer" onClick={() => goToProfile(author?.id)}>
                    <AvatarImage src={author?.image} />
                    <AvatarFallback>{author?.name}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-primary">{author?.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-shadcn-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {story.readTime}
                      </span>
                      <span>{format(new Date(story.createdAt), 'PP')}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="hover:text-primary">
                  Follow
                </Button>
              </div>
            </motion.div>

            {/* Featured Image */}
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src={story.thumbnail}
                alt={story.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Story Content */}
            <article className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: story.content }} />
            </article>

            {/* Enhanced Reactions Bar */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between py-6 border-y border-shadcn-primary/30 bg-shadcn-dark/50 rounded-lg px-4"
            >
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 ${isLiked ? 'text-primary' : ''}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{story?.likes}</span>
                </Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>{story?.comments?.length}</span>
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
                {author?.id === user?.id && (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                    onClick={() => router.push(`/stories/edit/${id}`)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-galada text-primary">মন্তব্যসমূহ</h3>
              
              {/* Comment Input */}
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.image} />
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
                {story?.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="h-10 w-10 cursor-pointer" onClick={() => goToProfile(comment.user.id)}>
                      <AvatarImage src={comment.user.image} />
                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-primary">{comment.user.name}</h4>
                        <span className="text-xs text-shadcn-muted">
                          {format(new Date(comment.createdAt), 'PP')}
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
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card className="bg-shadcn-dark/50 border-shadcn-primary/30">
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={author?.image} />
                    <AvatarFallback>{author?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-primary">{author?.name}</h3>
                    <p className="text-shadcn-muted text-sm">{author?.bio}</p>
                  </div>
                  <div className="flex justify-center gap-6 text-sm">
                    <div>
                      <p className="font-semibold text-primary">{author?.followers}</p>
                      <p className="text-shadcn-muted">অনুসারী</p>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{author?.storiesCount}</p>
                      <p className="text-shadcn-muted">গল্প</p>
                    </div>
                  </div>
                  <Button className="w-full">অনুসরণ করুন</Button>
                </div>
              </CardContent>
            </Card>

            {/* Similar Stories */}
            <Card className="bg-shadcn-dark/50 border-shadcn-primary/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-galada text-primary">এরকম আরও গল্প</h3>
                <div className="space-y-4">
                  {similarStories.map((story) => (
                    <motion.div
                      key={story.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex gap-4 cursor-pointer"
                    >
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                        <Image
                          src={story.thumbnail}
                          alt={story.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold hover:text-primary">{story.title}</h4>
                        <p className="text-sm text-shadcn-muted">{story.author}</p>
                        <p className="text-xs text-shadcn-muted">{story.readTime}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Stories */}
            <Card className="bg-shadcn-dark/50 border-shadcn-primary/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-galada text-primary">ট্রেন্ডিং গল্পসমূহ</h3>
                <div className="space-y-4">
                  {trendingStories.map((story) => (
                    <motion.div
                      key={story.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex gap-4 cursor-pointer"
                    >
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                        <Image
                          src={story.thumbnail}
                          alt={story.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold hover:text-primary">{story.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-shadcn-muted">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {story.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" /> {story.comments}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
