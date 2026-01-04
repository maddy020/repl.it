import { Worker, Job } from "bullmq";
import {CopyObject} from "@repo/aws_utils"
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const queueName = process.env.REDIS_QUEUE_NAME || "init_queue";

const handleJob = async (job: Job) => {
  try {
    const { language } = job.data;
    const replId = job.id!;
    await CopyObject(replId, language);
    await axios.post(`${process.env.ORCHESTRATION_SERVICE_URL}/start`, {
      replId,
      host: `${replId}.${process.env.BASE_DOMAIN_NAME}`,
    });
  } catch (error) {
    console.error("Error processing job:", error);
  }
};

const worker = new Worker(queueName, handleJob, {
  connection: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
});

worker.on("completed", (job) => {
  console.log(`Job with id ${job.id} has been completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Error in processing the job ${job?.id}`, err);
});
