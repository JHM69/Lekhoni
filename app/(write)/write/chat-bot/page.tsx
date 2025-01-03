"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import BreadCrumb from "@/components/breadcrumb";
import {
  Plane,
  Send,
  Image as ImageIcon,
  MapPin,
  Hotel,
  Calendar,
  Users,
  Loader2,
  Mountain,
  Menu,
  Mountain as MountainIcon,
  X,
  PenLine,
  MessageSquare,
  Mic,
  MicOff,
  PenBoxIcon,
  PenToolIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReactMarkdown from "react-markdown";
import { ChatBody } from "@/types/types";
 
const suggestions = [
  {
    text: "গল্পের প্লট সাজেস্ট করুন",
    icon: <PenLine className="w-4 h-4" />,
  },
  {
    text: "রোমান্টিক গল্প লেখার টিপস দিন",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    text: "আমার গল্পের ক্যারেক্টার ডেভেলপ করুন",
    icon: <Users className="w-4 h-4" />,
  },
  {
    text: "একটি থ্রিলার গল্পের আইডিয়া দিন",
    icon: <Mountain className="w-4 h-4" />,
  },
];

export default function Page() {
  const [messages, setMessages] = useState<
    Array<{
      type: "USER" | "AI";
      content: string;
    }>
  >([]);

  const model = "gpt-3.5-turbo";  //also can ne gpt-4o

 

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileQuickActionsOpen, setIsMobileQuickActionsOpen] =
    useState(false);
  const [isRecording, setIsRecording] = useState(false);


  const handleTranslate = async () => {
    const maxCodeLength = 700;

    if (!inputMessage) {
      alert("Please enter your message.");
      return;
    }

    if (inputMessage.length > maxCodeLength) {
      alert(
        `Please enter a message less than ${maxCodeLength} characters. You are currently at ${inputMessage.length} characters.`,
      );
      return;
    }
    
    setMessages([...messages, { type: "USER", content: inputMessage }]);
   
    setLoading(true);

    const controller = new AbortController();
    const body: ChatBody = {
      inputMessage,
      model,
    };

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify(body),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = response.body;
      if (!data) {
        throw new Error("No data received");
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        accumulatedResponse += chunkValue;
       
      }

      setMessages([
        ...messages,
        { type: "USER", content: inputMessage },
        { type: "AI", content: accumulatedResponse },
      ]);
      setInputMessage("");
    } catch (error) {
      console.error("Error in API call:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle image upload logic here
      setIsUploadOpen(false);
    }
  };

  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSend();
  //   }
  // };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Add voice recognition logic here
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        
        {/* Mobile Quick Actions Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileQuickActionsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Quick Actions Modal */}
      {isMobileQuickActionsOpen && (
        <div className="fixed inset-0 flex z-50">
          <div
            className="bg-black bg-opacity-50 w-full h-full"
            onClick={() => setIsMobileQuickActionsOpen(false)}
          ></div>
          <div
            className="bg-white dark:bg-gray-800 w-72 p-4 h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileQuickActionsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setInputMessage(suggestion.text);
                    setIsMobileQuickActionsOpen(false);
                  }}
                >
                  {suggestion.icon}
                  <span className="ml-2">{suggestion.text}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3 p-4">
          <ScrollArea className="h-[calc(100vh-300px)] mb-4 px-4">
            {messages.length === 0 ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex justify-center space-x-2 mb-4">
                    <PenLine className="w-8 h-8 text-blue-500" />
                    <MessageSquare className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    চ্যাট করুন যেকোনো বিষয়ে
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    লেখনী চ্যাট বট আপনার সাথে কনভার্সেশন সংরক্ষণ করে। এর ফলে
                    ভবিষ্যতে আপনার প্রশ্নের উত্তর প্রদান করা সহজ হবে।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="flex items-center justify-start space-x-2 h-auto p-4 text-left"
                      onClick={() => setInputMessage(suggestion.text)}
                    >
                      {suggestion.icon}
                      <span>{suggestion.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === "USER" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.type === "USER"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <Avatar>
                        <div
                          className={`w-full h-full rounded-full flex items-center justify-center ${
                            message.type === "USER"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        >
                          {message.type === "USER" ? (
                            <Users className="w-4 h-4 text-white" />
                          ) : (
                            <PenToolIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === "USER"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className=" w-full  p-4">
            <div className="flex flex-row w-full items-center justify-between space-x-2 rounded-lg border bg-white dark:bg-gray-800 p-2">
              {isUploadOpen && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100 w-2/12 dark:hover:bg-gray-700"
                      onClick={() => setIsUploadOpen(!isUploadOpen)}
                    >
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Upload image</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Input
                placeholder="আপনার প্রশ্ন লিখুন..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                // onKeyPress={handleKeyPress}
                className="md:w-[600px] lg:w-[800px] w-[300px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100 w-2/12 dark:hover:bg-gray-700"
                      onClick={handleVoiceInput}
                    >
                      {isRecording ? (
                        <MicOff className="w-5 h-5 text-red-500" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Voice input</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                onClick={handleTranslate}
                disabled={loading}
                className="bg-blue-500 w-2/12 hover:bg-blue-600 text-white"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Desktop Quick Actions */}
        <Card className="hidden md:block p-4">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setInputMessage(suggestion.text)}
              >
                {suggestion.icon}
                <span className="ml-2">{suggestion.text}</span>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
