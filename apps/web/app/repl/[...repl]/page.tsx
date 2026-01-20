"use client"
import { useEffect, useState, useRef, useCallback } from "react";
import CodingTerminal from "../../_components/Terminal/page";
import EditorComp from "../../_components/Editor/page";
import FileExplorer from "../../_components/FileExplorer/page";
import { io, Socket } from "socket.io-client";
import { useParams } from "next/navigation";
import { ExternalLinkIcon, GripVertical, Play, Eye, Terminal } from "lucide-react";
import Loader from "@/_components/Loader/page";
import axios from "axios";

export default function Repl() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [distanceFromRoot, setDistanceFromRoot] = useState<Record<string, number>>({});
  const [fileGraph, setFileGraph] = useState<Record<string, { fileName: string, filePath: string }[]>>({});
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<string>("");
  const [isOutputReady, setIsOutputReady] = useState<boolean>(false);
  const [terminalWidth, setTerminalWidth] = useState(800); 
  const isResizing = useRef(false);

  const { repl } = useParams();
  const INSTANCE_URI = `https://output-${repl}.replit.bemadhav.xyz`;

  // --- Check Availability Logic ---
  const checkAvailability = async () => {
    try {
      // Using a timeout in axios to prevent long hangs
      await fetch(INSTANCE_URI, { mode: 'no-cors'});
      setIsOutputReady(true);
      console.log("✅ Output is live.");
    } catch (error) {
      setIsOutputReady(false);
      console.warn("⚠️ No output yet. Make sure your server is running on port 3000.");
    }
  };

  // --- Resizing Logic ---
  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 200 && newWidth < window.innerWidth - 400) {
      setTerminalWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // --- Socket Logic ---
  useEffect(() => {
    const socketConnection = io(`wss://${repl}.replit.bemadhav.xyz`, {
      reconnectionDelayMax: 1000
    });
    setSocket(socketConnection);
    setIsConnecting(true);
    socketConnection.on("connect", () => {
      setIsConnecting(false);
    });
    socketConnection.on("disconnect", () => {
      setIsConnecting(true);
    });
    return () => { socketConnection.disconnect(); };
  }, [repl]);

  useEffect(() => {
    socket?.emit("replLoaded", { replId: repl });
    socket?.on("fileStructure", (data) => {
      const { distances, fileGraph } = data;
      setDistanceFromRoot(distances);
      setFileGraph(fileGraph);
    });
  }, [socket, repl]);

  if (isConnecting) return <Loader />;

  return (
    <div className="h-screen flex flex-col bg-white text-black selection:bg-zinc-200 font-sans">

      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 border-r border-zinc-200 bg-zinc-50 overflow-y-auto">
          <FileExplorer 
            socket={socket} 
            replId={repl as string} 
            distanceFromRoot={distanceFromRoot} 
            fileGraph={fileGraph} 
            currentFile={currentFile} 
            setCurrentFile={setCurrentFile}
          />
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <EditorComp 
            socket={socket} 
            replId={repl as string} 
            currentFile={currentFile} 
          />
        </div>

        {/* Resize Handle */}
        <div 
          onMouseDown={startResizing}
          className="w-1.5 cursor-col-resize bg-zinc-100 hover:bg-zinc-300 border-x border-zinc-200 flex items-center justify-center transition-colors group"
        >
          <GripVertical className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600" />
        </div>

        {/* Right Panel: Terminal & Output */}
        <div 
          style={{ width: `${terminalWidth}px` }} 
          className="border-l border-zinc-200 flex flex-col bg-white overflow-hidden"
        >
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Terminal Section */}
            <div className="flex-1 border-b border-zinc-200 flex flex-col">
              <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-zinc-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Terminal</h3>
              </div>
              <div className="flex-1 overflow-hidden p-2 bg-white">
                <CodingTerminal socket={socket} />
              </div>
            </div>

            {/* Output Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-200 flex justify-between items-center">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Output</h3>
                <ExternalLinkIcon 
                  className="h-4 w-4 text-zinc-400 cursor-pointer hover:text-black transition-colors" 
                  onClick={() => window.open(INSTANCE_URI, "_blank")}
                />
              </div>
              
              <div className="flex-1 overflow-hidden bg-white relative">
                {isOutputReady ? (
                  <iframe src={INSTANCE_URI} className="w-full h-full border-none"/>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-6 h-12 w-12 rounded-2xl border border-zinc-100 bg-zinc-50 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-zinc-300" />
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black mb-2">
                      Output Hidden
                    </h2>
                    <p className="text-[10px] text-zinc-400 max-w-[200px] leading-relaxed mb-8">
                      Verify your deployment is running on port 3000 before viewing.
                    </p>
                    <button 
                      onClick={checkAvailability}
                      className="px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200"
                    >
                      Show Output
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}