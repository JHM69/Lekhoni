"use client";
import React from "react";
import { ScrollText, ChevronRight, PenTool, Users, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-shadcn-dark via-shadcn to-shadcn-dark text-shadcn-light">
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="font-galada text-5xl md:text-6xl font-extrabold text-primary leading-tight">
              আপনার গল্প, <br />
              <span className="text-shadcn-accent">আপনার ভাষায়</span>
            </h1>
            <p className="text-xl text-shadcn-muted max-w-2xl mx-auto">
              লেখনীতে আপনার গল্প শেয়ার করুন, অন্যদের গল্প পড়ুন, এবং বাংলা সাহিত্যের
              সমৃদ্ধ কমিউনিটির অংশ হোন।
            </p>
            <div className="flex justify-center gap-4">
              <button
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-shadcn-primary-dark transition-all flex items-center gap-2 shadow-lg transform hover:scale-105"
              onClick={() => router.push('/stories')}
              >
              <ScrollText className="w-5 h-5" />
              গল্প পড়তে শুরু করুন
              <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="py-20 bg-shadcn-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="bg-shadcn-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transform hover:scale-110 transition-transform duration-300">
                <PenTool className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-galada text-xl font-bold text-primary">লিখুন স্বাধীনভাবে</h3>
              <p className="text-shadcn-muted">আপনার গল্প, আপনার স্টাইলে। কোনো বাধা নেই।</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-shadcn-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transform hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-galada text-xl font-bold text-primary">সক্রিয় কমিউনিটি</h3>
              <p className="text-shadcn-muted">পাঠক-লেখকদের সাথে যুক্ত হোন, মতামত শেয়ার করুন।</p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-shadcn-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transform hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-galada text-xl font-bold text-primary">পড়ুন যেকোনো সময়</h3>
              <p className="text-shadcn-muted">হাজারো গল্প আপনার হাতের মুঠোয়।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
