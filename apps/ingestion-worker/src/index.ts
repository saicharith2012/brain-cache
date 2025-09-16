import { redisClient } from "@repo/redis/client";
import { Worker } from "bullmq";

const ingestionWorker = new Worker(
  "ingestion-queue",
  async (job) => {
    console.log(`Processing job ${job.id} for memory ${job.data.contentId}`);
  },
  { connection: redisClient }
);

ingestionWorker.on("completed", (job) => {
  console.log(`Job ${job.id} has finished.`);
});

ingestionWorker.on("failed", (job, err) => {
  console.log(`job ${job?.id} has failed with error: ${err.message}`);
});

console.log("Ingestion worker has started, listening for jobs...");
