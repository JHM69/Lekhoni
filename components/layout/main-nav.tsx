"use client";
import React, { useState } from "react";
import { User, BookOpen, PenTool, Users, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const getDicebearAvatar = (name: string) => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
          <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
            <Search className="absolute left-8 h-4 w-4  " />
            <Input
              type="search"
              placeholder="গল্প খুঁজুন..."
              className="w-[300px] pl-12 rounded-full bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
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
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <Avatar className="w-8 h-8 cursor-pointer">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name ?? "User"} />
                      <AvatarFallback>
                        <img 
                          src={getDicebearAvatar(session.user.name || 'User')} 
                          alt={session.user.name ?? "User"}
                        />
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <DropdownMenuItem onSelect={() => router.push("/profile")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      প্রোফাইল
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => signOut()} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      সাইন আউট
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
