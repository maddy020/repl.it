import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./api/index.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", apiRoutes);
const PORT = process.env.PORT || 8080;
app.listen(PORT || 3000, () =>
  console.log(`Init Service running on port ${PORT}`)
);
