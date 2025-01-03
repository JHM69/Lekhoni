'use client';
import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { PenToolIcon, Search } from "lucide-react";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Notifications } from "./notification";

export default function Header() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Navigate to the desired URL
      router.push(`/trip/stock/${inputValue}`);
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden   lg:flex flex-row">
          <Link
            href={"/"}
            target="_blank"
          >
            <PenToolIcon className="w-6 h-6" />
          </Link>
         <b> লেখনী </b>
        </div>
        {/* <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

          */}
        <div className="flex flex-row w-1/3 border-[1px] rounded-xl p-2">
      <Search />
      <input 
        type="text" 
        placeholder="Search Place" 
        className="w-full bg-transparent ml-4 border-gray-300 focus:border-gray-500 focus:outline-none" 
        value={inputValue} 
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
    </div>

        <div className="flex items-center gap-2">
          <Notifications />
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
