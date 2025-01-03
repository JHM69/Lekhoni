"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const input = searchParams.get("input") || "";
  const output = searchParams.get("output") || "";
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement your feedback submission logic here
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
    
    setIsSubmitting(false);
    setFeedback("");
    // Add success notification here
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-galada text-primary mb-4">ফিডব্যাক</h1>
          <p className="text-shadcn-muted">আপনার মূল্যবান মতামত জানান</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">ইউজার ইনপুট</label>
            <Textarea
              value={decodeURIComponent(input)}
              readOnly
              className="bg-shadcn-dark/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">মডেল আউটপুট</label>
            <Textarea
              value={decodeURIComponent(output)}
              readOnly
              className="bg-shadcn-dark/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">আপনার ফিডব্যাক</label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="আপনার মতামত এখানে লিখুন..."
              className="min-h-[100px]"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "সাবমিট করা হচ্ছে..." : "ফিডব্যাক সাবমিট করুন"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
