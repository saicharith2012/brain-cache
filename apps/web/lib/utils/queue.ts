import { Queue } from "bullmq";
import { redisClient } from "@repo/redis/client";
import { IngestionJobPayload } from "@repo/common/config";

const ingestionQueue = new Queue("ingestion-queue", {
  connection: redisClient,
});

export async function addIngestionJob({
  userId,
  contentId,
  filePath,
  fileType,
  createdAt,
  title,
  link,
}: IngestionJobPayload) {
  const ingestionData: IngestionJobPayload = {
    userId,
    contentId,
    filePath,
    fileType,
    createdAt,
    title,
    link,
  };

  await ingestionQueue.add("ingestMemory", ingestionData);
  console.log("Ingestion Job added to queue");
}
