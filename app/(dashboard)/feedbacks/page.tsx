"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Initial feedbacks data
const initialFeedbacks = [
  {
    id: 1,
    input: "আমার দেশের নাম বাংলাদেশ",
    output: "My country's name is Bangladesh",
    feedback: "Perfect translation",
    status: "approved",
    submittedAt: "2025-01-04T09:00:00.000Z",
  },
  {
    id: 2,
    input: "আমি প্রতিদিন সকালে জগিং করতে যাই",
    output: "I go jogging every morning",
    feedback: "Natural and accurate translation",
    status: "approved",
    submittedAt: "2025-01-04T09:30:00.000Z",
  },
  {
    id: 3,
    input: "আজ আকাশে মেঘ করেছে",
    output: "The sky is cloudy today",
    feedback: "Could be more literal: 'Clouds have formed in the sky today'",
    status: "pending",
    submittedAt: "2025-01-04T10:00:00.000Z",
  },
  {
    id: 4,
    input: "তিনি একজন প্রসিদ্ধ লেখক",
    output: "He is a famous writer",
    feedback: "Gender-neutral translation would be better: 'They are a famous writer'",
    status: "pending",
    submittedAt: "2025-01-04T10:30:00.000Z",
  },
  {
    id: 5,
    input: "এই বইটি খুব মজার",
    output: "This book is very interesting",
    feedback: "Good translation but 'entertaining' might be more accurate than 'interesting'",
    status: "approved",
    submittedAt: "2025-01-04T11:00:00.000Z",
  },
  {
    id: 6,
    input: "বাগানে অনেক ফুল ফুটেছে",
    output: "Many flowers have bloomed in the garden",
    feedback: "Excellent translation",
    status: "approved",
    submittedAt: "2025-01-04T11:30:00.000Z",
  },
  {
    id: 7,
    input: "আমি পরীক্ষায় ভালো ফলাফল করেছি",
    output: "I got good results in the exam",
    feedback: "Accurate translation",
    status: "approved",
    submittedAt: "2025-01-04T12:00:00.000Z",
  },
  {
    id: 8,
    input: "তার গান শুনে মন ভালো হয়ে গেল",
    output: "Listening to their song made me feel better",
    feedback: "Good translation, captures the sentiment well",
    status: "approved",
    submittedAt: "2025-01-04T12:30:00.000Z",
  },
  {
    id: 9,
    input: "আজ রাতে বৃষ্টি হবে",
    output: "It will rain tonight",
    feedback: "Simple and accurate",
    status: "pending",
    submittedAt: "2025-01-04T13:00:00.000Z",
  },
  {
    id: 10,
    input: "তিনি খুব ভালো রান্না করেন",
    output: "They cook very well",
    feedback: "Good use of gender-neutral pronoun",
    status: "approved",
    submittedAt: "2025-01-04T13:30:00.000Z",
  },
  {
    id: 11,
    input: "গ্রামের মানুষরা খুব সরল",
    output: "Village people are very simple",
    feedback: "Could add 'hearted' to make it 'simple-hearted'",
    status: "pending",
    submittedAt: "2025-01-04T14:00:00.000Z",
  },
  {
    id: 12,
    input: "সূর্য পশ্চিমে অস্ত যায়",
    output: "The sun sets in the west",
    feedback: "Perfect translation",
    status: "approved",
    submittedAt: "2025-01-04T14:30:00.000Z",
  },
  {
    id: 13,
    input: "আমার বাসায় অনেক বই আছে",
    output: "I have many books at home",
    feedback: "Could be 'in my home' for more literal translation",
    status: "pending",
    submittedAt: "2025-01-04T15:00:00.000Z",
  },
  {
    id: 14,
    input: "তার চোখে জল এসে গেল",
    output: "Tears came to their eyes",
    feedback: "Good translation with gender-neutral pronoun",
    status: "approved",
    submittedAt: "2025-01-04T15:30:00.000Z",
  },
  {
    id: 15,
    input: "আকাশে তারা উঠেছে",
    output: "Stars have risen in the sky",
    feedback: "Could also be 'Stars have appeared in the sky'",
    status: "pending",
    submittedAt: "2025-01-04T16:00:00.000Z",
  },
  {
    id: 16,
    input: "পাখিটা উড়ে গেল",
    output: "The bird flew away",
    feedback: "Simple and accurate translation",
    status: "approved",
    submittedAt: "2025-01-04T16:30:00.000Z",
  },
  {
    id: 17,
    input: "সে প্রতিদিন ব্যায়াম করে",
    output: "They exercise every day",
    feedback: "Good use of gender-neutral language",
    status: "approved",
    submittedAt: "2025-01-04T17:00:00.000Z",
  },
  {
    id: 18,
    input: "বাঙালি খাবার খুব সুস্বাদু",
    output: "Bengali food is very delicious",
    feedback: "Accurate translation",
    status: "approved",
    submittedAt: "2025-01-04T17:30:00.000Z",
  },
  {
    id: 19,
    input: "আমি গান গাইতে ভালোবাসি",
    output: "I love to sing",
    feedback: "Simple and correct translation",
    status: "approved",
    submittedAt: "2025-01-04T18:00:00.000Z",
  },
  {
    id: 20,
    input: "আজ আমার জন্মদিন",
    output: "Today is my birthday",
    feedback: "Perfect translation",
    status: "approved",
    submittedAt: "2025-01-04T18:30:00.000Z",
  }
];

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<typeof initialFeedbacks>([]);

  useEffect(() => {
    const stored = localStorage.getItem('feedbacks');
    setFeedbacks(stored ? JSON.parse(stored) : initialFeedbacks);
  }, []);

  const handleApprove = (id: number) => {
    const updated = feedbacks.map(f => 
      f.id === id ? { ...f, status: "approved" } : f
    );
    setFeedbacks(updated);
    localStorage.setItem('feedbacks', JSON.stringify(updated));
  };

  const handleDelete = (id: number) => {
    const updated = feedbacks.filter(f => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem('feedbacks', JSON.stringify(updated));
  };

  return (
    <ScrollArea className="h-full">
    <div className="container py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-galada text-primary mb-4">সমস্ত ফিডব্যাক</h1>
          <p className="text-shadcn-muted">ব্যবহারকারীদের মতামত</p>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ইউজার ইনপুট</TableHead>
                <TableHead>মডেল আউটপুট</TableHead>
                <TableHead className="min-w-[200px]">ফিডব্যাক</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>সময়</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell className="font-medium">{feedback.input}</TableCell>
                  <TableCell>{feedback.output}</TableCell>
                  <TableCell>{feedback.feedback}</TableCell>
                  <TableCell>
                    <Badge
                      variant={feedback.status === "approved" ? "success" : "secondary"}
                    >
                      {feedback.status === "approved" ? "অনুমোদিত" : "পেন্ডিং"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(feedback.submittedAt).toLocaleDateString("bn-BD")}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {feedback.status !== "approved" && (
                      <Button
                        onClick={() => handleApprove(feedback.id)}
                        variant="ghost"
                        size="icon"
                        className="hover:text-green-500"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(feedback.id)}
                      variant="ghost"
                      size="icon"
                      className="hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
    </ScrollArea>
  );
}
