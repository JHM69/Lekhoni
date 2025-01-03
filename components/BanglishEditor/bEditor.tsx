"use client";
import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import Button from "./Button";
import FontSelector from "./FontSelector";
import html2canvas from "html2canvas";

const useHistory = (
  initialState: string,
): [
  string,
  (newState: string) => void,
  () => void,
  () => void,
  boolean,
  boolean,
] => {
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
  ];
};

const BanglishEditor = () => {
  const [content, setContent, undo, redo, canUndo, canRedo] = useHistory("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentFont, setCurrentFont] = useState("Kalpurush");
  const [isExporting, setIsExporting] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    if (!recognition.current && typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser.");
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

        if (event.results[event.results.length - 1].isFinal) {
          if (editorRef.current) {
            const newContent = editorRef.current.innerHTML + transcript + " ";
            editorRef.current.innerHTML = newContent;
            setContent(newContent);
          }
        }
      };

      recognition.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
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
      // Create a temporary container for the content
      const container = document.createElement("div");
      container.style.width = "210mm"; // A4 width
      container.style.padding = "20mm";
      container.style.fontFamily = currentFont;

      // Add title and content
      const title = "Generated Title"; // Replace with actual title generation
      const caption = "AI Generated Caption"; // Replace with actual caption generation

      container.innerHTML = `
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">${title}</div>
        <div style="font-style: italic; margin-bottom: 2em;">${caption}</div>
        ${editorRef.current.innerHTML}
      `;

      document.body.appendChild(container);

      try {
        // Convert to canvas
        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        // Convert to PDF
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("banglish-document.pdf");
      } finally {
        document.body.removeChild(container);
      }
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // useEffect(() => {
  //   console.log(content)
  // }, [content]);
 

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-xl">
      <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 border border-gray-200 rounded-lg">
        <Button onClick={() => formatText("bold")}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
            />
          </svg>
        </Button>
        <Button onClick={() => formatText("italic")}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 4h4M12 4v16M8 20h8"
            />
          </svg>
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <Button onClick={undo} disabled={!canUndo}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        </Button>
        <Button onClick={redo} disabled={!canRedo}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
            />
          </svg>
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <Button
          onClick={toggleRecording}
          active={isRecording}
          className={
            isRecording ? "bg-red-100 border-red-500 text-red-700" : ""
          }
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </Button>

        <FontSelector onChange={setCurrentFont} currentFont={currentFont} />

        <Button onClick={exportToPDF} disabled={isExporting}>
          {isExporting ? (
            "Exporting..."
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          )}
        </Button>
      </div>

      <div
        ref={editorRef}
        className="min-h-[400px] p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        contentEditable
        suppressContentEditableWarning
        style={{ fontFamily: currentFont }}
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
      />
    </div>
  );
};

export default BanglishEditor;
