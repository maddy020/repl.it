import { Worker, Job } from "bullmq";

const queueName = process.env.REDIS_QUEUE_NAME || "init_queue";

const handleJob = async (job: Job) => {
  try {
    console.log(`Processing job with id ${job.id} and data:`, job.data);
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
