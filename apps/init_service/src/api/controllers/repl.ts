import type { Response } from "express";
import type { CustomRequest } from "@repo/types";
import { model } from "../model/index.js";
import { createQueue } from "../../utils/index.js";

const queue = createQueue(
  process.env.REDIS_NAME || "init_queue",
  process.env.REDIS_HOST || "localhost"
);

const possibleReplNames=["coder","master","guru","ninja","hacker","pro","dev","techie","geek","wizard","rockstar","champion","ace","maverick","virtuoso","specialist","whiz","buff","enthusiast"];

export const Repl = {
  create: async (req: CustomRequest, res: Response) => {
    const { language } = req.body;
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const name1 = possibleReplNames[Math.floor(Math.random() * possibleReplNames.length)];
      const name2 = possibleReplNames[Math.floor(Math.random() * possibleReplNames.length)];
      const replId=`${name1}${name2}${Math.floor(Math.random()*10000000)}`;
      if (!language || !replId) {
        return res
          .status(400)
          .json({ message: "Language and replId can not be empty" });
      }

      const repl = await model.Repl.create(user.id, language, replId);
      if (repl.status === 200) {
        await queue.add(
          replId,
            {       
              language,
            },
          {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: replId,
          }
        );
        return res
          .status(200)
          .json({ message: "Repl created successfully", repl: repl.repl });
      }
      return res.status(500).json({ message: "Failed to create repl" });
    } catch (error) {
      console.log("Error in creating the repl:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  get:async(req:CustomRequest,res:Response)=>{
    try {
      const user=req.user;
      if(!user){
        return res.status(401).json({message:"Unauthorized"});
      }
      const replRes=await model.Repl.getAllRepls(user.id);
      if(replRes.status == 200){
        return res.status(replRes.status).json({repls:replRes.repls});
      }
      return res.status(replRes.status).json({message:replRes.error})
    } catch (error) {
      return res.status(500).json({message:"Internal Server Error"})
    }
  }
};
