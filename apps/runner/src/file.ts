import fs from "fs";
import path from "path"

const saveFileContent=(content:string,filePath:string):Promise<void>=>{
   return new Promise((resolve,reject)=>{
      fs.writeFile(filePath,content,"utf-8",(err)=>{
         if(err) reject(err);
         else resolve();
      })
   }) 
} 

const getFileContent=(filePath:string):Promise<string>=>{
       return new Promise((resolve,reject)=>{
           fs.readFile(filePath,"utf-8",(err,data)=>{
            if(data){
                resolve(data);
            }
            else reject(err);
           })
       })
}

const getAllFilesSync = ({ dirPath, files}: { dirPath: string, files: string[] }) => {
    const checkIfPathExists=fs.existsSync(dirPath);
    console.log("check If Path exists",checkIfPathExists)
    if(!checkIfPathExists)return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    console.log("all entries in directory",entries);
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            getAllFilesSync({ dirPath: fullPath, files });
        } else {
            files.push(fullPath);
        }
    }
    

    return ;

}

export {saveFileContent,getFileContent,getAllFilesSync}