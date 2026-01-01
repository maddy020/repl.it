"use client";
import { Socket } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import * as monaco from "monaco-editor";
import debounce from "lodash.debounce"
import { useEffect, useRef, useState } from 'react';
export default function EditorComp({ socket, replId, currentFile }: { socket: Socket | null, replId: string, currentFile: string }) {

  type DiffEvent = {
  changes: monaco.editor.IModelContentChange[];
};

  const [editorContent, setEditorContent] = useState<string>("")
  const [currContent,setCurrContent]=useState(editorContent);
  const socketRef=useRef<Socket | null>(null);
  const fileRef=useRef<()=>void | null>(null);
  const savingDiffBuff=useRef<DiffEvent[]>([])
  const currDiffBuff=useRef<DiffEvent[]>([])

  useEffect(() => {
    socketRef.current=socket;
    socket?.emit("getFileContent", { replId, filePath: "src/index.ts" })
    socket?.on("fileContent", (data) => {
      setEditorContent(data.content);
      setCurrContent(data.content);
    })

    socket?.on("fileContentSaved",(data)=>{
      setCurrContent(data.content)
      savingDiffBuff.current=[];
    })
  }, [socket])

  useEffect(()=>{
     fileRef.current=debounce(()=>{
       if(currDiffBuff.current.length === 0 || savingDiffBuff.current.length != 0)return;
       savingDiffBuff.current.push(...currDiffBuff.current);
       currDiffBuff.current=[];
      socket?.emit("updateContent", { content:currContent,diffBuff: savingDiffBuff.current, filePath: currentFile, replId })
     },2000)
  })

  const handleEditorDidMount=(
    editor: monaco.editor.IStandaloneCodeEditor)=>{
    const model = editor.getModel();
    if (!model) return;

    model.onDidChangeContent((event) => {
     currDiffBuff.current.push({
      changes:event.changes
     })
     fileRef.current?.();
    });
  }

  return (
    <>
      <h1>Editor Component</h1>
      <Editor
        onMount={handleEditorDidMount}
        value={editorContent}
        height="50vh"
        language={currentFile.split(".")[1] === "ts" ? "javascript" : "json"}
        defaultLanguage="javascript"
        defaultValue="function main(){console.log('Hello, World!')}"
      />
    </>
  );
}