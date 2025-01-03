"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe2, Lock } from "lucide-react";
import LekhoniEditor2 from "@/components/BanglishEditor/bEditor2";
 
export default function EditStoryPage() {
  const [story, setStory] = useState(null);
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [status, setStatus] = useState("PUBLIC");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const user = useSession().data?.user;

  useEffect(() => {
    if (id) {
      axios.get(`/api/story/single?storyId=${String(id)}`)
        .then(response => {
          if (response.data.status === "success") {
            const storyData = response.data.story[0];
            setStory(storyData);
            setTitle(storyData.title);
            setRawText(storyData.rawText);
            setTranslatedText(storyData.content);
            setStatus(storyData.status);
            setSummary(storyData.summary);
            setTags(storyData.tags);
            setThumbnail(storyData.thumbnail);
            setIsLoadingMeta(false);
          }
        })
        .catch(error => {
          console.error("Error fetching story data:", error);
        });
    }
  }, [id]);

  const handleUpdate = () => {
    const updatedStory = {
      storyId: id,
      title,
      rawText,
      translatedText,
      status,
      summary,
      tags,
      thumbnail
    };

    axios.post(`/api/story/single`, updatedStory)
      .then(response => {
        if (response.data.status === "success") {
          router.push(`/stories/view/${id}`);
        }
      })
      .catch(error => {
        console.error("Error updating story:", error);
      });
  };

  if (!story) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Story</h1>
      <div className="space-y-4 overflow-y-auto max-h-screen">
        {isLoadingMeta ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label>শিরোনাম</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>সারসংক্ষেপ</Label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>ট্যাগ সমূহ</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="কমা দিয়ে ট্যাগ আলাদা করুন"
              />
            </div>
            <div className="space-y-2">
              <Label>ছবি</Label>
              <img src={thumbnail} alt="Thumbnail" height={200} width={500} />
            </div>
          </>
        )}

        <RadioGroup
          value={status}
          onValueChange={setStatus}
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

        <div className="max-h-[300px]">
          <LekhoniEditor2 key="story" initialContent={translatedText} onChangeContent={setTranslatedText} />
        </div>

        <div className="text-center">
          <Button onClick={handleUpdate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md">
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
