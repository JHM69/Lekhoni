'use client';

import CustomEditor from "@/components/Editor/editor";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";
import { useState } from "react";
 

export default function Page() {
  const [editedText, setEditedText] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const onTextChange = (text: string) => {
    console.log("Found text: ", text);
    setEditedText(text); 
   
    // setWordCount(text.trim().split(/\s+/).length);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b  ">
      {/* Hero Section */}
      <div className="flex flex-col items-center py-12  border-b">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          লেখনী
        </h1>
        <p className="mt-3 text-xl text-gray-600">বাংলা লিখি বাংলায়</p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="relative">
            <div className="absolute top-0 right-0 flex gap-2 p-4">
              <Button size="sm" variant="ghost">
                <Pencil className="mr-2" /> Draft
              </Button>
              <Button size="sm" variant="ghost">
                <Save className="mr-2" /> Save
              </Button>
            </div>
            <div className=" rounded-xl shadow-sm border p-6 min-h-[600px]">
              <CustomEditor
                className="prose max-w-none"
                id="composer"
                onMessageEdit={onTextChange}
              />
            </div>
            <div className="mt-2 text-sm text-gray-500 text-right">
              {wordCount} words
            </div>
          </div>

          {/* Translation Section */}
          <div className=" rounded-xl shadow-sm border p-6 min-h-[600px]">
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">অনুবাদ</h2>
              <div className="flex-grow  rounded-lg p-4">
                {/* Translation content will go here */}
              </div>
              <Button 
                onClick={() => console.log(editedText)}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                অনুবাদ করুন
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
