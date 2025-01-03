"use client";

import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Share } from "lucide-react";

export interface EditorProps {
  initialContent: string;
  model: string;
  onChangeModel: (model: string) => void;
  onChangeContent: (content: string) => void;
  isShareButtonVisible?: boolean;
  onShareButtonClick?: () => void;
  apiKey?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}

export interface FontSelectorProps {
  onChange: (font: string) => void;
  currentFont: string;
}

export interface Suggestion {
  text: string;
  completed: boolean;
}

// Button.tsx
const Button = ({ children, onClick, disabled, active, className = "" }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 
    hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 
    disabled:cursor-not-allowed transition-colors ${active ? 'bg-gray-200 dark:bg-gray-700' : ''} ${className}`}
  >
    {children}
  </button>
);

// FontSelector.tsx
const FontSelector = ({ onChange, currentFont }: FontSelectorProps) => (
  <select
    value={currentFont}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg"
  >
    <option value="Kalpurush">Kalpurush</option>
    <option value="SolaimanLipi">SolaimanLipi</option>
    <option value="AdorshoLipi">AdorshoLipi</option>
  </select>
);

const useHistory = (initialState: string) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);


  const push = (newState: string) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  };

  const undo = () => index > 0 && setIndex(index - 1);
  const redo = () => index < history.length - 1 && setIndex(index + 1);

  return [
    history[index],
    push,
    undo,
    redo,
    index > 0,
    index < history.length - 1,
  ] as const;
};

const LekhoniEditor = ({
  initialContent,
  model = "openai-gpt-4o",
  onChangeModel,
  onChangeContent,
  isShareButtonVisible = false,
  onShareButtonClick, 
}: EditorProps) => {
  const [content, setContent, undo, redo, canUndo, canRedo] = useHistory(initialContent);
  const [isRecording, setIsRecording] = useState(false);
  const [currentFont, setCurrentFont] = useState("Kalpurush");
  const [isExporting, setIsExporting] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    onChangeContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    onChangeContent(content);
  }, [content]);

  const getSuggestion = async (text: string) => {
 
    setIsLoading(true);
    try {
      const suggestionModel =  "gpt-3.5-turbo"; 

      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model: suggestionModel
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        result += decoder.decode(value);
      }

      setSuggestion({
        text: result,
        completed: false
      });
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      
      if (suggestion && !suggestion.completed) {
        if (editorRef.current) {
          editorRef.current.innerHTML += suggestion.text;
          setContent(editorRef.current.innerHTML);
          setSuggestion({ ...suggestion, completed: true });
        }
      } else {
        const text = editorRef.current?.innerHTML || '';
        await getSuggestion(text);
      }
    }
  };

  const initializeSpeechRecognition = () => {
    if (!recognition.current && typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition not supported");
        return false;
      }

      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = "en-XX";

      recognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");

        if (event.results[event.results.length - 1].isFinal && editorRef.current) {
          const newContent = editorRef.current.innerHTML + transcript + " ";
          editorRef.current.innerHTML = newContent;
          setContent(newContent);
        }
      };

      return true;
    }
    return !!recognition.current;
  };

  const toggleRecording = () => {
    if (!isRecording) {
      const initialized = initializeSpeechRecognition();
      if (initialized) {
        recognition.current?.start();
        setIsRecording(true);
      }
    } else {
      recognition.current?.stop();
      setIsRecording(false);
    }
  };

  const formatText = (command: string) => {
    document.execCommand(command, false);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const exportToPDF = async () => {
    if (!editorRef.current || isExporting) return;

    setIsExporting(true);
    try {
      const container = document.createElement("div");
      container.style.width = "210mm";
      container.style.padding = "20mm";
      container.style.fontFamily = currentFont;

      container.innerHTML = `
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">Generated Document</div>
        ${editorRef.current.innerHTML}
      `;

      document.body.appendChild(container);

      try {
        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("document.pdf");
      } finally {
        document.body.removeChild(container);
      }
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full h-full max-w-4xl mx-auto p-4 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
      <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-600 rounded-lg">
        <Button onClick={() => formatText("bold")}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/>
          </svg>
        </Button>

        <Button onClick={() => formatText("italic")}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4M12 4v16M8 20h8"/>
          </svg>
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-2" />

        <Button onClick={undo} disabled={!canUndo}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
          </svg>
        </Button>

        <Button onClick={redo} disabled={!canRedo}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/>
          </svg>
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-2" />

        <Button
          onClick={toggleRecording}
          active={isRecording}
          className={isRecording ? "bg-red-100 dark:bg-red-900" : ""}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
          </svg>
        </Button>

        <FontSelector onChange={setCurrentFont} currentFont={currentFont} />

        <Button onClick={exportToPDF} disabled={isExporting}>
          {isExporting ? "Exporting..." : 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          }
        </Button>

        <select 
          value={model}
          onChange={(e) => onChangeModel(e.target.value)}
          className="px-3 py-2 w-40 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <option value="openai-gpt-4o">openai-gpt-4o</option>
          <option value="লেখনি powered by mBert">লেখনি powered by mBert</option>
        </select>

        {isShareButtonVisible && onShareButtonClick && (
          <Button onClick={onShareButtonClick}>
            <Share size={18} />
            <span className="ml-2 font-bold">Share</span>
          </Button>
        )}
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          className="min-h-[500px] p-4 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 transition-colors bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200"
          contentEditable
          suppressContentEditableWarning
          style={{ fontFamily: currentFont }}
          onInput={(e) => {
            setContent(e.currentTarget.innerHTML);
            setSuggestion(null);
          }}
          onKeyDown={handleKeyDown}
        />
        
        {suggestion && !suggestion.completed && (
          <div 
            className="absolute text-gray-400 pointer-events-none"
            style={{
              top: editorRef.current?.getBoundingClientRect().top,
              left: editorRef.current?.getBoundingClientRect().left,
              padding: '1rem'
            }}
          >
            {editorRef.current?.innerHTML}{suggestion.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default LekhoniEditor;