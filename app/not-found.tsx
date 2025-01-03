/* eslint-disable import/no-unresolved */
"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-16 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        ৪০৪
      </span>
      <h2 className="my-2 font-heading text-2xl font-bold">
        কিছু একটা মিসিং
      </h2>
      <p>
        দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          ফিরে যান
        </Button>
        <Button
          onClick={() => router.push("/")}
          variant="ghost"
          size="lg"
        >
          হোমে ফিরে যান
        </Button>
      </div>
    </div>
  );
}
