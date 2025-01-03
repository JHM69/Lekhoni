"use client"
import { Metadata } from "next";
import Link from "next/link";
import UserAuthForm from "@/components/forms/user-auth-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import GoogleSignInButton from "@/components/google-auth-button";

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 hidden top-4 md:right-8 md:top-8",
        )}
      >
        Login/Sign Up
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
          </svg>
          লেখনী
        </div>
        <div className="absolute inset-0 z-0">
        <DotLottieReact src="land2.json" loop autoplay className="w-full h-full object-cover" />
      </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              বাংলা লিখি বাংলায় 
            </p>
            <footer className="text-sm">কোয়ান্টাম গাইজ</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              লগ ইন করুন 
            </h1>
            <p className="text-sm text-muted-foreground">
              গুগল অ্যাকাউন্ট দিয়ে লগ ইন করুন
            </p>
          </div>
          <UserAuthForm />

          {/* Create an Account */}

          <p className="text-center text-sm text-muted-foreground">
            একাউন্ট নেই?{" "}
            <Link href="/examples/authentication/signup" className="text-accent">
              সাইন আপ করুন
            </Link>
          </p>

          <GoogleSignInButton />
        </div> 
      </div>
    </div>
  );
}
