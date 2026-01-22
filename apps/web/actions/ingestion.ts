"use server";
import { qdrantCollectionName } from "../config";
import { addIngestionJob } from "../lib/utils/queue";
import { client } from "@repo/qdrantdb/client";
import { ActionError } from "../types/global";
import { IngestionJobPayload } from "@repo/common/config";

export async function startIngestion(memoryData: IngestionJobPayload) {
  await addIngestionJob(memoryData);
}

export async function deleteEmbeddings(
  memoryId: string
): Promise<{ message: string } | ActionError> {
  try {
    await client.delete(qdrantCollectionName!, {
      wait: true,
      filter: {
        must: [
          {
            key: "contentId",
            match: {
              value: memoryId,
            },
          },
        ],
      },
    });

    return {
      message: "vector embeddings successfully deleted.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "failed to delete vector embeddings.",
    };
  }
}
