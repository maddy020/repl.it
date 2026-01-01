"use client"
import { Socket } from "socket.io-client"
export default function FileExplorer({socket,replId,distanceFromRoot,fileGraph,currentFile,setCurrentFile}:{socket:Socket | null,replId:string,distanceFromRoot:Record<string,number>,fileGraph:Record<string,{fileName:string,filePath:string}[]>,currentFile:string,setCurrentFile:React.Dispatch<React.SetStateAction<string>>}) {
    const handleClick=(filePath:string)=>{
        if(currentFile === filePath)return;
        setCurrentFile(filePath);
        socket?.emit("getFileContent",{replId,filePath})
    }
    return(
        <>
           <h2>File Explorer</h2>
           <div className="file-list">
               {Object.entries(fileGraph).map(([parent, children],idx) => (
                   <div key={idx}>
                       <strong className="cursor-pointer">{parent}</strong>
                       <ul>
                           {children.map((child,idx) => (
                               <li className="cursor-pointer" onClick={()=>handleClick(child.filePath)} key={idx}>
                                   {child.fileName} (Depth: {distanceFromRoot[child.fileName]})
                               </li>
                           ))}
                       </ul>
                   </div>
               ))}
           </div>
        </>
    )
}