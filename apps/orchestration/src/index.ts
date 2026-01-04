dotenv.config();
import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path"
import { fileURLToPath } from "url";
import { execa } from "execa";
const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chartPath = path.resolve(
  __dirname,
  "../../../helm/repl-service"
);

app.post("/start", async (req: Request, res: Response) => {
    try {
        const { replId, host } = req.body;
        if (!replId) return res.status(404).json({ message: "ReplId not found" });
        await execa("helm", [
            "upgrade",
            "--install",
            replId,
            chartPath,
            "--namespace",
            "default",
            "--set",
            `host=${host}`,
            "--set",
            "image.tag=latest-stable",
        ]);
        return res.status(200).json({ message: "Service started" });
    } catch (error) {
        console.log("Error in starting the service", error);
    }
})

app.post("/stop", async (req: Request, res: Response) => {
    try {
        const { replId } = req.body;
        if (!replId) return res.status(404).json({ message: "ReplId not found" });
        await execa('helm', [
            "uninstall",
            replId,
            "--namespace",
            "default",
        ])
        return res.status(200).json({ message: "Service Stopped Successfully" });
    } catch (error) {
        console.log("Error in stopping the service", error);
    }
})

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`orchestration server is running at ${PORT}`));