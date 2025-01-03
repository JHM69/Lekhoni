"use client";

import CustomEditor from "@/components/Editor/editor";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast"; // Add this import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import BanglishEditor from "@/components/BanglishEditor/bEditor";

export default function Page() {
  const [editedText, setEditedText] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("PUBLIC");
  const [isSharing, setIsSharing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onTextChange = (text: string) => {
    setEditedText(text);
    const words = text.trim().split(/\s+/);
    setWordCount(words.length > 1 || words[0] !== "" ? words.length : 0);
  };

  const handleTranslate = async () => {
    if (editedText) {
      try {
        setIsLoading(true);
        const response = await fetch("/api/ai/banglish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: editedText }),
        });
        const data = await response.json();
        setTranslatedText(data.translatedText);
      } catch (error) {
        console.error("Translation error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleShareClick = () => {
    setIsShareDialogOpen(true);
  };

  const handleShareSubmit = async () => {
    if (!translatedText || !editedText) return;

    setIsSharing(true);
    try {
      const response = await fetch("/api/ai/banglish/save-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: editedText,
          translatedText,
          status: shareStatus,
        }),
      });

      if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to share your story",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      const data = await response.json();
      if (data.status === "success") {
        toast({
          title: "Success",
          description: "Your story has been shared successfully",
        });
        router.push(`/story/${data.storyId}`);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to share story",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sharing story:", error);
      toast({
        title: "Error",
        description: "Something went wrong while sharing your story",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
      setIsShareDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b">
      {/* Hero Section */}
      <div className="flex flex-col items-center py-12 border-b">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          লেখনী
        </h1>
        <p className="mt-3 text-xl text-gray-600">বাংলা লিখি বাংলায়</p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="rounded-xl shadow-lg border p-6 min-h-[600px]  ">
            {/* <CustomEditor
              className="prose max-w-none"
              id="composer"
              onMessageEdit={onTextChange}
            /> */}
            <BanglishEditor />

            <div className="mt-4 text-right">
              <span className="text-sm text-gray-500">{wordCount} words</span>
            </div>
          </div>

          {/* Center Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 lg:block hidden">
            <Button
              onClick={handleTranslate}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform transition-transform hover:scale-105 shadow-lg"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "অনুবাদ হচ্ছে..." : "অনুবাদ করুন"}
            </Button>
          </div>

          {/* Translation Section */}
          <div className="rounded-xl shadow-lg border p-6 min-h-[600px]  ">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">অনুবাদ</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShareClick}
                  className="text-gray-600 hover:text-gray-900"
                  disabled={!translatedText}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-grow rounded-lg p-4  ">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  </div>
                ) : translatedText ? (
                  <p className="whitespace-pre-wrap">{translatedText}</p>
                ) : (
                  <p className="text-gray-500 text-center">
                    Translation will appear here
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Translation Button */}
          <div className="lg:hidden flex justify-center mt-4">
            <Button
              onClick={handleTranslate}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "অনুবাদ হচ্ছে..." : "অনুবাদ করুন"}
            </Button>
          </div>
        </div>
      </div>

      {/* Add Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Share Your Story</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <RadioGroup
              defaultValue={shareStatus}
              onValueChange={setShareStatus}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PUBLIC" id="public" />
                <Label htmlFor="public">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PRIVATE" id="private" />
                <Label htmlFor="private">Private</Label>
              </div>
            </RadioGroup>

            <div className="max-h-[300px] overflow-y-auto border rounded-md p-4">
              <p className="whitespace-pre-wrap">{translatedText}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsShareDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleShareSubmit} disabled={isSharing}>
              {isSharing ? "Sharing..." : "Share"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
