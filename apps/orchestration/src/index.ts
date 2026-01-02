dotenv.config();
import express from "express";
import dotenv from "dotenv";
import {execa} from "execa";
const app=express();

const PORT=process.env.PORT || 8081;
app.listen(PORT,()=>console.log(`orchestration server is running at ${PORT}`));