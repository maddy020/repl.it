import { ListObjectsV2Command,CopyObjectCommand, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./util/client.js";
import fs from "fs";
import dotenv from "dotenv"
import os from "os";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

dotenv.config();

const CopyObject=async(replId:string,language:string,ContinuationToken?:string)=>{
    try {
    const listedObjects=await s3Client.send(new ListObjectsV2Command({
        Bucket:process.env.BUCKET_NAME!,
        Prefix:`base/${language}`,
        ContinuationToken
    }))
     if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

    await Promise.all(
      listedObjects.Contents.map(async (object:any) => {
        if (!object.Key) return;
        const destinationKey = object.Key.replace(
          `base/${language}`,
          `code/${replId}`
        );
        const copyParams = {
          Bucket: process.env.BUCKET_NAME!,
          CopySource: `${process.env.BUCKET_NAME!}/${object.Key}`,
          Key: destinationKey,
        };
         s3Client.send(new CopyObjectCommand(copyParams));
      })
    );

    if (listedObjects.IsTruncated) {
      await CopyObject(
        `base/${language}`,
        `code/${replId}`,
        listedObjects.NextContinuationToken
      );
    }

    } catch (error) {
       console.log("error in copying the s3 directory",error)        
    }

}

const saveContentToS3=async(key:string,filePath:string,content:string)=>{
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: `${key}/${filePath}`,
        Body: content
      }));
      console.log("content saved")
    } catch (error) {
      console.log("error in saving content to s3",error)
    }
}

const mountFolderInRunner=async(replId:string,language:string)=>{
       try {
         const getObject=async()=>{
          try {
            const data=await s3Client.send(new ListObjectsV2Command({
              Bucket: process.env.BUCKET_NAME!,
              Prefix: `base/${language}`
            }));
            const baseDir=path.join(os.homedir() + `/repl.it/apps/runner/src/` + "/workspace/" + replId);
            data.Contents?.map(async (item:any)=>{
              if (!item.Key) return;
              const destinationKey=item.Key.replace(`base/${language}` , "");
              const localFilePath=path.join(baseDir, destinationKey);
              fs.mkdirSync(path.dirname(localFilePath), { recursive: true });
              const object = await s3Client.send(
                new GetObjectCommand({
                  Bucket: process.env.BUCKET_NAME!,
                  Key: item.Key
                })
              );

              if (!object.Body) {
                throw new Error(`Empty body for ${item.Key}`);
              }
              await streamPipeline(
                object.Body as NodeJS.ReadableStream,
                fs.createWriteStream(localFilePath)
              );
            })
          } catch (error) {
            console.log("error in mounting folder in runner",error)
          }
        }
        getObject();
       } catch (error) {
         console.log("Error in mounting the folder in runner")
       }
}

const mountExistingFolderInRunner=async(replId:string)=>{
       try {
         const getObject=async()=>{
          try {
            const data=await s3Client.send(new ListObjectsV2Command({
              Bucket: process.env.BUCKET_NAME!,
              Prefix: `code/${replId}`
            }));
            const baseDir=path.join(os.homedir() + `/repl.it/apps/runner/src/` + "/workspace/" + replId);
            data.Contents?.map(async (item:any)=>{
              if (!item.Key) return;
              const destinationKey=item.Key.replace(`code/${replId}` , "");
              const localFilePath=path.join(baseDir, destinationKey);
              fs.mkdirSync(path.dirname(localFilePath), { recursive: true });
              const object = await s3Client.send(
                new GetObjectCommand({
                  Bucket: process.env.BUCKET_NAME!,
                  Key: item.Key
                })
              );

              if (!object.Body) {
                throw new Error(`Empty body for ${item.Key}`);
              }
              await streamPipeline(
                object.Body as NodeJS.ReadableStream,
                fs.createWriteStream(localFilePath)
              );
            })
          } catch (error) {
            console.log("error in mounting folder in runner",error)
          }
        }
        getObject();
       } catch (error) {
         console.log("Error in mounting the folder in runner")
       }
}


export {CopyObject,saveContentToS3,mountFolderInRunner,mountExistingFolderInRunner}