import { Queue } from "bullmq";

export const createQueue = (name: string, redisHost: string) => {
  console.log("redis host", redisHost);
  return new Queue(name, {
    connection: {
      host: redisHost,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
  });
};
