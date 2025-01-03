"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, MapPin, Link2, Twitter, Facebook, BookOpen, ThumbsUp, Award, Clock } from "lucide-react";
import Image from "next/image";

const dummyUser = {
  name: "তানভীর আহমেদ",
  username: "@tanvir",
  avatar: "https://api.dicebear.com/7.x/personas/svg?seed=tanvir",
  coverImage: "https://random.imagecdn.app/1200/400",
  bio: "বাংলা সাহিত্যের একজন উদীয়মান লেখক। রহস্য ও এডভেঞ্চার গল্প লেখায় বিশেষ দক্ষ।",
  location: "ঢাকা, বাংলাদেশ",
  website: "https://tanvir.com",
  joinDate: "জানুয়ারি ২০২৪",
  stats: {
    followers: 1234,
    following: 456,
    stories: 45,
  },
  badges: [
    { name: "প্রতিভাবান লেখক", icon: "🎭" },
    { name: "টপ কন্ট্রিবিউটর", icon: "⭐" },
    { name: "সেরা গল্পকার", icon: "📚" },
  ]
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-shadcn-dark to-shadcn">
      {/* Minimalistic Cover */}
      <div className="relative h-[200px] w-full bg-gradient-to-r from-primary/20 to-shadcn-accent/20">
        <Image
          src={dummyUser.coverImage}
          alt="Cover"
          fill
          className="object-cover opacity-50 mix-blend-overlay"
        />
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative -mt-16">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-32 w-32 ring-4 ring-background">
              <AvatarImage src={dummyUser.avatar} />
              <AvatarFallback>{dummyUser.name[0]}</AvatarFallback>
            </Avatar>

            {/* Profile Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-galada text-2xl font-medium text-primary">
                    {dummyUser.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">{dummyUser.username}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  সম্পাদনা
                </Button>
              </div>

              <p className="text-sm max-w-2xl text-muted-foreground">{dummyUser.bio}</p>

              {/* Simplified Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {dummyUser.location}
                </span>
                <a href={dummyUser.website} className="flex items-center gap-1 hover:text-primary">
                  <Link2 className="w-4 h-4" />
                  Website
                </a>
              </div>

              {/* Minimalist Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-lg font-medium">{dummyUser.stats.stories}</div>
                  <div className="text-xs text-muted-foreground">গল্প</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium">{dummyUser.stats.followers}</div>
                  <div className="text-xs text-muted-foreground">অনুসারী</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium">{dummyUser.stats.following}</div>
                  <div className="text-xs text-muted-foreground">অনুসরণ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Badge List */}
          <div className="mt-6 flex flex-wrap gap-2">
            {dummyUser.badges.map((badge, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 bg-primary/5 px-3 py-1 rounded-full text-sm"
              >
                <span>{badge.icon}</span>
                <span className="text-xs">{badge.name}</span>
              </div>
            ))}
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="stories" className="mt-8">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="stories">গল্পসমূহ</TabsTrigger>
              <TabsTrigger value="drafts">খসড়া</TabsTrigger>
              <TabsTrigger value="saved">সংরক্ষিত</TabsTrigger>
              <TabsTrigger value="about">সম্পর্কে</TabsTrigger>
            </TabsList>
            
            {/* Add TabsContent for each tab */}
            <TabsContent value="stories" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add story cards here */}
              </div>
            </TabsContent>
            
            {/* Add other TabsContent components with appropriate content */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
