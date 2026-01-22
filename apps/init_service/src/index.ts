import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./api/index.js";
import { createQueue, seedDb } from "./utils/index.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api", apiRoutes);
const PORT = process.env.INITSERVICEPORT || 8080;
app.listen(PORT, async () => {
  createQueue(
    process.env.REDIS_QUEUE_NAME || "init_queue",
    // process.env.REDIS_HOST || "localhost"
    process.env.REDIS_HOST || "redis"
  );
  await seedDb();
  console.log(`Init Service running on port ${PORT}`);
});
