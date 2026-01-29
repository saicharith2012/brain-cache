import { Queue } from "bullmq";
import { IngestionJobPayload } from "@repo/common/config";
import { redisHostname, redisPassword, redisPort, redisUsername } from "config";

const ingestionQueue = new Queue("ingestion-queue", {
  connection: {
    username: redisUsername,
    password: redisPassword,
    host: redisHostname,
    port: redisPort,
  },
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
