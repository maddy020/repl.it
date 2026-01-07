"use client"
import { useEffect,useState } from "react";
import CodingTerminal from "../../_components/Terminal/page";
import EditorComp from "../../_components/Editor/page";
import FileExplorer from "../../_components/FileExplorer/page";
import { io, Socket } from "socket.io-client";
import { useParams } from "next/navigation";

export default function Repl() {
  const [socket,setSocket]=useState<Socket | null>(null);
  const [distanceFromRoot,setDistanceFromRoot]=useState<Record<string,number>>({});
  const [fileGraph,setFileGraph]=useState<Record<string,{fileName:string,filePath:string}[]>>({});
  const [currentFile,setCurrentFile]=useState<string>("src/index.ts");
   const { repl } = useParams();
  useEffect(() => {
        const socketConnection = io(`ws://${repl}.replit.bemadhav.xyz`, {
            reconnectionDelayMax: 1000
        });
        setSocket(socketConnection);
    }, [])
  
    useEffect(()=>{
      socket?.emit("replLoaded",{replId:repl});
      socket?.on("fileStructure", (data)=>{
        const {distances,fileGraph}=data;
        setDistanceFromRoot(distances);
        setFileGraph(fileGraph);
      })
    },[socket])
  return (
    <>
      <h1>Repl Page</h1>
      <FileExplorer socket={socket} replId={repl as string} distanceFromRoot={distanceFromRoot} fileGraph={fileGraph} currentFile={currentFile} setCurrentFile={setCurrentFile}/>
      <CodingTerminal socket={socket}/>
      <EditorComp socket={socket} replId={repl as string} currentFile={currentFile} />
    </>
  );
}
