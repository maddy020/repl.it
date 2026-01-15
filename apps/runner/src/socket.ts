import { Server } from "socket.io";
import { TerminalManager } from "./pty.js";
import { getAllFilesSync,getFileContent, saveFileContent } from "./file.js";
import {saveContentToS3} from "./aws.js"

export const initWebSocket = (httpServer: any) => {

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    const fileGraph = new Map<string, Set<{fileName:string,filePath:string}>>();
    const terminalManager = new TerminalManager();

    socket.on("requestTerminal", ({ replId }) => {
      terminalManager.createTerminal(socket.id, replId, (data) => {
        socket.emit("terminal", {
          data: Buffer.from(data, "utf-8"),
        });
      });
    });

    socket.on("terminalData", ({ data }) => {
      terminalManager.write(socket.id, data);
    });

    socket.on("replLoaded", async (data) => {
      try {
        const files: string[] = [];
      getAllFilesSync({
        dirPath: `/workspace`,
        files,
      });
      files.forEach((file) => {
        const relativePath = file.split(`workspace/`)[1];
        if (!relativePath) return;

        const parts = relativePath.split("/");

        // ROOT level file
        if (parts.length === 1) {
          if (!fileGraph.has(data.replId)) {
            fileGraph.set(data.replId, new Set());
          }
          fileGraph.get(data.replId)!.add({fileName:parts[0]!,filePath:relativePath});
          return;
        }

        // Nested paths
        let parent = data.replId;

        for (let i = 0; i < parts.length; i++) {
          const current = parts[i];

          if (!fileGraph.has(parent)) {
            fileGraph.set(parent, new Set());
          }

          fileGraph.get(parent)!.add({fileName:current!,filePath:relativePath});

          parent = current;
        }
      });
      
      // given the file graph and we are here calculating the distance from root node which is replId
      const distances=new Map<string,number>();
      const queue:Array<{node:string,depth:number}>=[{node:data.replId,depth:0}];
      while(queue.length>0){
        const {node,depth}=queue.shift()!;
        distances.set(node,depth);
        const children=fileGraph.get(node);
        if(children){
          for(const child of children){
            queue.push({node:child.fileName,depth:depth+1});
          }
        }
      }
      const fileGraphObj: Record<string, {fileName:string,filePath:string}[]> = {};
      for (const [key, value] of fileGraph.entries()) {
        fileGraphObj[key] = Array.from(value);
      }

      const distancesObj: Record<string, number> = {};
      for (const [key, value] of distances.entries()) {
        distancesObj[key] = value;
      }
      socket.emit("fileStructure", { distances:distancesObj, fileGraph:fileGraphObj });
      } catch (error) {
        console.log("Error in loading the repl",error);
      }
    });
    socket.on("getFileContent",async(data)=>{
      const { replId, filePath } = data;
      const fileContent=await getFileContent(`/workspace/${filePath}`)
      socket.emit("fileContent",{
        replId,
        filePath,
        content: fileContent
      });
    })
    socket.on("updateContent",async(data)=>{
      try {
        const {content,diffBuff,filePath,replId}=data;
        let updatedContent=content;
        updatedContent=applyMonacoDiffs(updatedContent,diffBuff)
        await saveFileContent(updatedContent,`/workspace/${filePath}`);
        await saveContentToS3(`code/${replId}`,filePath,updatedContent)
        socket.emit("fileContentSaved",{content:updatedContent})
       } catch (error) {
        console.log("Error in updating the content",error)  
       }
    })
  });

};


const applyMonacoDiffs=(
  content: string,
  diffEvents: any[]
): string =>{
    let updated = content;

  for (const event of diffEvents) {
    for (const c of event.changes.slice().reverse()) {
      updated =
        updated.slice(0, c.rangeOffset) +
        c.text +
        updated.slice(c.rangeOffset + c.rangeLength);
    }
  }

  return updated;
}
