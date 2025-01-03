"use client";
import React from "react";
import { User, BookOpen, PenTool, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg z-50 border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
            <div
            className="font-galada text-2xl font-bold text-primary cursor-pointer"
            onClick={() => router.push("/")}
            >
            লেখনী
            </div>
          <nav className="hidden md:flex gap-6">
            <a href="#stories" className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors duration-300">
              <BookOpen className="w-4 h-4" />
              গল্প পড়ুন
            </a>
            <a href="#writers" className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors duration-300">
              <Users className="w-4 h-4" />
              লেখক
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session?.user ? (
            <>
              <button
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-hover transition-all flex items-center gap-2 shadow-md transform hover:scale-105"
                onClick={() => router.push("/write")}
              >
                <PenTool className="w-4 h-4" />
                নতুন গল্প লিখি
              </button>
              <button
                onClick={() => signOut()}
                className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary-hover transition-all flex items-center gap-2 shadow-md transform hover:scale-105"
              >
                সাইন আউট
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/signin")}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-hover transition-all flex items-center gap-2 shadow-md transform hover:scale-105"
            >
              <User className="w-4 h-4" />
              লগ ইন করুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
