"use client";
import React, { useEffect, useState } from "react";
import {
 
  User,
 
} from "lucide-react";
import { useRouter } from "next/navigation";
 
import { useSession } from "next-auth/react";

 

const Header = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const handleSignInClick = () => {
    router.push("/signin");
  };

  return (
    <div className="fixed top-0 font-lekonifont left-0 right-0 bg-white/90 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <div className="text-2xl font-bold text-purple-800">লেখনী</div>
        </div>
        <div className="flex items-center gap-6">
          
          {session?.user ? (
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg"
              onClick={() => {
                router.push("/trip");
              }}
            >
              লিখি 
            </button>
          ) : (
            <button
              onClick={handleSignInClick}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg"
            >
              <User className="w-5 h-5" />
              <span>লগ ইন বা সাইন আপ করুন</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Homepage() {
  
 
  
 
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200">
      <Header />
      <div className="pt-32 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* EasyTrip Intro */}
          <div className="text-center mb-12 space-y-6">
            <div className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-normal">
              <span className="font-bold">লেখনী</span> <br />
              <div className="text-xl md:text-2xl font-bold text-gray-700">
                বাংলা লিখি বাংলায় 
              </div>
            </div>

           
          </div>

         
        </div>

     
      </div>
 
    </div>
  );
}
