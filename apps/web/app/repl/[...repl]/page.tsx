"use client"
import { useEffect, useState } from "react";
import CodingTerminal from "../../_components/Terminal/page";
import EditorComp from "../../_components/Editor/page";
import FileExplorer from "../../_components/FileExplorer/page";
import { io, Socket } from "socket.io-client";
import { useParams } from "next/navigation";

export default function Repl() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [distanceFromRoot, setDistanceFromRoot] = useState<Record<string, number>>({});
  const [fileGraph, setFileGraph] = useState<Record<string, { fileName: string, filePath: string }[]>>({});
  const [currentFile, setCurrentFile] = useState<string>("src/index.ts");
  const { repl } = useParams();

  useEffect(() => {
    const socketConnection = io(`wss://${repl}.replit.bemadhav.xyz`, {
      reconnectionDelayMax: 1000
    });
    setSocket(socketConnection);
  }, [])

  useEffect(() => {
    socket?.emit("replLoaded", { replId: repl });
    socket?.on("fileStructure", (data) => {
      const { distances, fileGraph } = data;
      console.log("file structure data", data);
      setDistanceFromRoot(distances);
      setFileGraph(fileGraph);
    })
  }, [socket])

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-black">CollabIQ</h1>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 text-sm">{currentFile}</span>
          </div>
          <button className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-all">
            Save & Run
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer - Left Side */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <FileExplorer 
            socket={socket} 
            replId={repl as string} 
            distanceFromRoot={distanceFromRoot} 
            fileGraph={fileGraph} 
            currentFile={currentFile} 
            setCurrentFile={setCurrentFile}
          />
        </div>

        {/* Editor - Middle */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorComp 
            socket={socket} 
            replId={repl as string} 
            currentFile={currentFile} 
          />
        </div>

        {/* Terminal & Output - Right Side */}
        <div className="w-96 border-l border-gray-200 flex flex-col bg-white">
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Terminal Section */}
            <div className="flex-1 border-b border-gray-200 flex flex-col">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-black">Terminal</h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <CodingTerminal socket={socket} />
              </div>
            </div>

            {/* Output Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-black">Output</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-700 bg-white">
                <div className="text-gray-400">Console output will appear here...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
