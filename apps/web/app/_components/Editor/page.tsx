"use client";
import { Socket } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import * as monaco from "monaco-editor";
// import debounce from "lodash.debounce"
import { useEffect, useRef, useState } from 'react';

export default function EditorComp({ 
  socket, 
  replId, 
  currentFile 
}: { 
  socket: Socket | null, 
  replId: string, 
  currentFile: string 
}) {
  type DiffEvent = {
    changes: monaco.editor.IModelContentChange[];
  };

  const [editorContent, setEditorContent] = useState<string>("")
  const [currContent, setCurrContent] = useState(editorContent);
  const socketRef = useRef<Socket | null>(null);
  const savingDiffBuff = useRef<DiffEvent[]>([])

  useEffect(() => {
    socketRef.current = socket;
    socket?.emit("getFileContent", { replId, filePath: "src/index.ts" })
    socket?.on("fileContent", (data) => {
      setEditorContent(data.content);
      setCurrContent(data.content);
    })

    socket?.on("fileContentSaved", (data) => {
      setCurrContent(data.content)
    })
  }, [socket])
  return (
    <div className="h-full flex flex-col bg-white">
      <Editor
        value={editorContent}
        onChange={(value)=>{
          console.log("change",value)
          socket?.emit("updateContent",{ 
        content: value, 
        diffBuff: savingDiffBuff.current, 
        filePath: currentFile, 
        replId 
      })
        }}
        height="100%"
        language={currentFile.split(".")[1] === "ts" ? "typescript" : "json"}
        defaultLanguage="typescript"
        defaultValue="function main(){console.log('Hello, World!')}"
        theme="vs"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
