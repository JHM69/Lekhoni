/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, ThumbsUp, MessageCircle, Clock, User, Globe, Shield, Heart, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns"; 
import { useSearchParams } from 'next/navigation';

export default function StoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || 'all');
  const [isLoading, setIsLoading] = useState(false);
  const storiesPerPage = 9;
  const [stories, setStories] = useState([]);

  const tags = [
    { id: 'all', icon: Globe, label: 'সব' },
    { id: 'my-stories', icon: User, label: 'আমার গল্প সমূহ' },
    { id: 'mystery', icon: Shield, label: 'রহস্য' },
    { id: 'romance', icon: Heart, label: 'রোমান্স' },
    { id: 'adventure', icon: Compass, label: 'এডভেঞ্চার' },
  ];

  // Handle search submit
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (sortBy !== 'latest') params.set('sortBy', sortBy);
      if (selectedTag !== 'all') params.set('tag', selectedTag);
      
      const queryString = params.toString();
      router.push(`/stories${queryString ? `?${queryString}` : ''}`);
    }
  };

  const handleTagSelect = (tagId: string) => {
    setSelectedTag(tagId);
    const params = new URLSearchParams(searchParams);
    if (tagId !== 'all') {
      params.set('tag', tagId);
    } else {
      params.delete('tag');
    }
    router.push(`/stories?${params.toString()}`);
  };

  useEffect(() => {
    // Update search query when URL params change
    const searchFromUrl = searchParams.get('search') || "";
    setSearchQuery(searchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const params = new URLSearchParams({
          query: searchQuery,
          sortBy: sortBy,
          tag: selectedTag,
          limit: storiesPerPage.toString()
        });
        
        const response = await fetch(`/api/story?${params.toString()}`);
        const data = await response.json();
        if (data.status === "success") {
          setStories(data.stories);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    const debounce = setTimeout(fetchStories, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, sortBy, selectedTag]);

  const handleStoryClick = (storyId: string) => {
    router.push(`/stories/view/${storyId}`);
  };

  return (
    <ScrollArea className="h-full">
    <div className="bg-gradient-to-b from-shadcn-dark via-shadcn to-shadcn-dark p-4 md:p-6 mt-8">
      <div className="max-w-7xl mx-auto space-y-4 pb-4">
        {/* Header with improved styling */}
        <div className="text-center space-y-4 py-4">
          <h1 className="font-galada text-4xl md:text-5xl font-bold text-primary">
            গল্পের ভুবনে স্বাগতম
          </h1>
          <p className="text-shadcn-muted max-w-2xl mx-auto">
            বাংলা সাহিত্যের অনন্য সব গল্প এখানে। আপনার পছন্দের গল্প খুঁজুন এবং উপভোগ করুন।
          </p>
        </div>

        {/* Add Search Box */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="গল্প খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-shadcn-dark/50 border border-shadcn-primary focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* Filter Section with new design */}
        <div className="flex flex-row sm:flex-row gap-4 justify-between items-center bg-shadcn-dark/50 p-4 rounded-lg backdrop-blur-sm">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[400px] bg-shadcn-dark/50 border-shadcn-primary">
              <SelectValue placeholder="সাজানোর ক্রম" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">সর্বশেষ</SelectItem>
              <SelectItem value="popular">জনপ্রিয়</SelectItem>
              <SelectItem value="oldest">পুরনো</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            {tags.map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant="outline"
                size="sm"
                className={`${
                  selectedTag === id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-primary hover:bg-primary/10'
                }`}
                onClick={() => handleTagSelect(id)}
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stories Grid with enhanced cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="group bg-shadcn-dark border border-shadcn-primary rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
              onClick={() => handleStoryClick(story.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={story.thumbnail}
                  alt={story.title} 
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-shadcn-dark to-transparent opacity-60" />
                <div className="absolute top-2 right-2 bg-primary px-3 py-1 rounded-full text-xs text-primary-foreground">
                  {story.tags}
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h2 className="font-galada text-xl font-semibold text-primary group-hover:text-shadcn-accent cursor-pointer">
                    {story.title}
                  </h2>
                  <p className="text-sm text-shadcn-muted line-clamp-2">{story.summary}</p>
                </div>

                <div className="flex justify-between items-center text-xs text-shadcn-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.ceil(story.numberOfWords / 200)} মিনিট
                  </span>
                  <span>{format(new Date(story.createdAt), 'PP')}</span>
                </div>

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
          ))}
        </div>

       
      </div>
    </div>
    </ScrollArea>
  );
}
