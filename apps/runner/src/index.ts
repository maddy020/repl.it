import { createServer } from "http";
import express from "express";
import { initWebSocket } from "./socket.js";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();
const app = express();
app.use(cors({
  origin:"*"
}))
const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);

initWebSocket(httpServer);
httpServer.listen(PORT, () =>
  console.log(`Runner is running at the PORT ${PORT}`)
);
