import type { Response } from "express";
import type { CustomRequest } from "@repo/types";
import { model } from "../model/index.js";
import { createQueue } from "../../utils/index.js";

const queue = createQueue(
  process.env.REDIS_NAME || "init_queue",
  process.env.REDIS_HOST || "localhost"
);
export const Repl = {
  create: async (req: CustomRequest, res: Response) => {
    const { language, name } = req.body;
    try {
      const user = req.user;
      console.log("user", user, language, name);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!language || !name) {
        return res
          .status(400)
          .json({ message: "Language and name can not be empty" });
      }
      const repl = await model.Repl.create(user.id, language, name);
      if (repl.status === 200) {
        await queue.add(
          name,
          {
            data: {
              language,
            },
          },
          {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: name,
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
};
