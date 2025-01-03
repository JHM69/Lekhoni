/* eslint-disable @next/next/no-img-element */
"use client";

import LekhoniEditor from "@/components/BanglishEditor/bEditor"; // Removed duplicate BanglishEditor import
import { Button } from "@/components/ui/button";
import { LanguagesIcon, Share, Copy, Globe2, Lock, Send } from "lucide-react"; // Add this import with other Lucide icons
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
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LekhoniEditor2 from "@/components/BanglishEditor/bEditor2";
import { title } from "process";
import Image from "next/image";
// Removed unused import: import { tr } from "date-fns/locale";

export default function Page() {
  const [editedText, setEditedText] = useState<string>(""); // Initialized as empty string
  const [model, setModel] = useState<any>('openai-gpt-4o');
  const [translatedText, setTranslatedText] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("PUBLIC");
  const [isSharing, setIsSharing] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    summary: '',
    tags: '',
    thumbnail: ''
  });
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onTextChange = (text: string) => {
    setEditedText(text);
  };

  const handleTranslate = async () => {
    if (!editedText) {
      toast({
        title: "Error",
        description: "Please enter some text to translate",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Sending translation request:", editedText);

      const apiUrl = model === 'openai-gpt-4o' ? '/api/ai/banglish' : '/api/ai/custom';

      const { data } = await axios.post(apiUrl, {
        text: editedText,
      });

      console.log("Translation response:", data);

      if (!data.translatedText) {
        throw new Error("No translated text received");
      }
      console.log("Translated Text:", data.translatedText);
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation Failed",
        description: "Failed to translate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!translatedText) {
      toast({
        title: "Error",
        description: "Please enter some text to improve",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Sending improvement request:", translatedText);

      const apiUrl = model === 'openai-gpt-4o' ? '/api/ai/improve_writting' : '/api/ai/improve_writting';

      const { data } = await axios.post(apiUrl, {
        text: translatedText,
      });

      console.log("Improvement response:", data);

      if (!data.improved_text) {
        throw new Error("No improved text received");
      }
      console.log("Translated Text:", data.improved_text);
      setTranslatedText(data.improved_text);
    } catch (error) {
      console.error("Improvement error:", error);
      toast({
        title: "Improvement Failed",
        description: "Failed to improve text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onTranslateTextChange = (text: string) => {
    setTranslatedText(text);
  };

  const fetchMetadata = async () => {
    if (!translatedText) return toast({
      title: "Error",
      description: "Please translate the text first",
      variant: "destructive",
    });

    
    setIsLoadingMeta(true);
    try {
      const { data } = await axios.post("/api/ai/meta", {
        text: translatedText
      });
      
      setMetadata({
        title: data.meta.title,
        summary: data.meta.summary,
        tags: data.meta.tags,
        thumbnail: data.meta.thumbnail
      });
    } catch (error) {
      console.error("Metadata fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to generate metadata",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMeta(false);
    }
  };

  const handleShareClick = async () => {
    setIsShareDialogOpen(true);
    await fetchMetadata();
  };

  const handleFeedbackClick = async () => {
    const feedbackUrl = `/feedback?input=${encodeURIComponent(editedText)}&output=${encodeURIComponent(translatedText || '')}`;
    window.open(feedbackUrl, "_blank");
  };

  const handleShareSubmit = async () => {
    if (!translatedText || !editedText) {
      toast({
        title: "ঝামেলা হয়েছে",
        description: "আপনার গল্প শেয়ার করার জন্য প্রথমে অনুবাদ করুন।",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      console.log("Sending share request:", {
        rawText: editedText,
        translatedText,
        status: shareStatus,
        meta: metadata
      });

      const { data } = await axios.post("/api/story", {
        rawText: editedText,
        translatedText,
        status: shareStatus,
        title: metadata.title,
        summary: metadata.summary,
        tags: metadata.tags,
        thumbnail: metadata.thumbnail
      });
 

      if (data.status === "success") {
        toast({
          title: "শেয়ার সফল হয়েছে",
          description: "আপনার গল্পটি শেয়ার করা হয়েছে",
        });
        router.push(`/stories/view/${data.storyId}`);
      } else {
        throw new Error(data.error || "Failed to share story");
      }
    } catch (error) {
      console.error("Share error:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to share your story",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }
      toast({
        title: "Share Failed",
        description: "Failed to share your story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
      setIsShareDialogOpen(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText || '');
      toast({
        title: "কপি করা হয়েছে",
        description: "টেক্সট ক্লিপবোর্ডে কপি করা হয়েছে",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "কপি করতে ব্যর্থ হয়েছে",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b">
 

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="rounded-xl shadow-lg border min-h-[600px]">
            <LekhoniEditor
              initialContent={editedText}
              model={model}
              onChangeModel={setModel}
              onChangeContent={onTextChange}
              isShareButtonVisible={false}
              onShareButtonClick={handleShareClick}
            />

            
          </div>

          {/* Center Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 lg:block hidden space-y-4">
            <Button
              onClick={handleTranslate}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform transition-transform hover:scale-105 shadow-lg"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "অনুবাদ হচ্ছে..." : "অনুবাদ করুন"}
            </Button>

            <Button
              onClick={handleImprove}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform transition-transform hover:scale-105 shadow-lg"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "উন্নত হচ্ছে..." : "উন্নত করুন"}
            </Button>
            </div>

          {/* Translation Section */}
          <div className="rounded-xl shadow-lg border min-h-[600px]">
            <div className="h-full flex flex-col">
              <div className="flex-grow rounded-lg">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  </div>
                ) : translatedText ? (
                  <div className="w-full max-w-4xl mx-auto p-4 h-full bg-white dark:bg-gray-900 shadow-lg rounded-xl">
                    <div className="flex justify-end mb-4 gap-2">
                      <Button
                        className="flex items-center flex-row bg-gray-700 hover:bg-gray-600"
                        onClick={handleCopyToClipboard}
                      >
                        <Copy size={18} className="text-gray-100" />
                        <span className="ml-2 font-bold text-gray-100">কপি করুন</span>
                      </Button>
                      <Button
                        className="flex items-end flex-row bg-orange-800 dark:bg-orange-700 hover:dark:bg-orange-700"
                        onClick={handleShareClick} // Fixed handler name
                      >
                        <Share size={18} className="text-gray-100" />
                        <span className="ml-2 font-bold text-gray-100">শেয়ার করুন</span>
                      </Button>
                      <Button
                        className="flex items-end flex-row bg-green-800 dark:bg-green-700 hover:dark:bg-green-700"
                        onClick={handleFeedbackClick} // Fixed handler name
                      >
                        <Send size={18} className="text-gray-100" />
                        <span className="ml-2 font-bold text-gray-100">প্রতিক্রিয়া</span>
                      </Button>
                    </div>

                    {/* Display Translated Text */}
                    <div className="flex min-h-[500px] p-4 mt-8 flex-wrap gap-2 mb-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div
                        className="prose dark:prose-dark w-full"
                        dangerouslySetInnerHTML={{ __html: translatedText }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">কোনো অনুবাদ পাওয়া যায়নি।</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Translation Button */}
          {/* <div className="lg:hidden flex justify-center mt-4">

          
            <Button
              onClick={handleTranslate}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              disabled={isLoading}
              size="lg"
            > 

           
              {isLoading ? "অনুবাদ হচ্ছে..." : <> 
               <LanguagesIcon size={24} />
              </>}
            </Button>
          </div> */}
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>আপনার গল্প শেয়ার করুন</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isLoadingMeta ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>শিরোনাম</Label>
                  <Input
                    value={metadata.title}
                    onChange={(e) => setMetadata(prev => ({...prev, title: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>সারসংক্ষেপ</Label>
                  <Textarea
                    value={metadata.summary}
                    onChange={(e) => setMetadata(prev => ({...prev, summary: e.target.value}))}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ট্যাগ সমূহ</Label>
                  <Input
                    value={metadata.tags}
                    onChange={(e) => setMetadata(prev => ({...prev, tags: e.target.value}))}
                    placeholder="কমা দিয়ে ট্যাগ আলাদা করুন"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ছবি</Label>
                  <img src={metadata.thumbnail} alt="Thumbnail" height={200} width={500} />
                </div>
              </>
            )}

            <RadioGroup
              value={shareStatus}
              onValueChange={setShareStatus}
              className="flex gap-4"
            >
              <div className="flex flex-row w-1/2">
                <RadioGroupItem
                  value="PUBLIC"
                  id="public"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="public"
                  className="flex w-full flex-row items-center gap-4 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Globe2 className="h-8 w-8 flex-shrink-0" />
                  <div className="flex flex-col">
                    <p className="font-medium">পাবলিক</p>
                    <p className="text-sm text-muted-foreground">
                      সবাই আপনার গল্প দেখতে পারবে
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex flex-row w-1/2">
                <RadioGroupItem
                  value="PRIVATE"
                  id="private"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="private"
                  className="flex w-full flex-row items-center gap-4 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Lock className="h-8 w-8 flex-shrink-0" />
                  <div className="flex flex-col">
                    <p className="font-medium">প্রাইভেট</p>
                    <p className="text-sm text-muted-foreground">
                      শুধু আপনি দেখতে পারবেন
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="max-h-[300px]    ">
            
               <LekhoniEditor2 key="story" initialContent={translatedText} onChangeContent={onTranslateTextChange} />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsShareDialogOpen(false)}
            >
              বাতিল করুন
            </Button>
            <Button onClick={handleShareSubmit} disabled={isSharing}>
              {isSharing ? "শেয়ার হচ্ছে..." : "শেয়ার করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
