import { Queue } from "bullmq";
import { redisClient } from "@repo/redis/client";
import { ContentType } from "@repo/db/client";

const ingestionQueue = new Queue("ingestion-queue", {
  connection: redisClient,
});

// ingestion job payload structure
export interface IngestionJobPayload {
  userId: string;
  contentId: string;
  filePath?: string;
  fileType: typeof ContentType;
  createdAt: Date;
  title?: string;
  link?: string;
}

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
