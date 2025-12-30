import { redisClient } from "@repo/redis/client";
import { Worker, Job } from "bullmq";
import {
  embeddingModel,
  googleGenaiApiKey,
  qdrantCollectionName,
} from "./config.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { client } from "@repo/qdrantdb/client";
import prisma from "@repo/db/client";
import { v4 as uuid } from "uuid";
import { pdfIngest } from "./lib/handlers/pdfIngest.js";
import { noteIngest } from "./lib/handlers/noteIngest.js";
import { videoIngest } from "./lib/handlers/videoIngest.js";
import { ContentType } from "@repo/db/client";
import { tweetIngest } from "./lib/handlers/tweetIngest.js";
import { linkIngest } from "./lib/handlers/linkIngest.js";

export interface IngestionJobPayload {
  userId: string;
  contentId: string;
  filePath?: string;
  fileType: string;
  createdAt: Date;
  title?: string;
  link?: string;
}

const ingestionWorker = new Worker(
  "ingestion-queue",
  async (job: Job<IngestionJobPayload>) => {
    console.log(
      `Processing job ${job.id} for memory ${JSON.stringify(job.data.contentId)}`
    );

    let textsForEmbeddings;

    if (job.data.fileType === ContentType.document) {
      textsForEmbeddings = await pdfIngest(job.data.filePath!);
    } else if (job.data.fileType === ContentType.note) {
      textsForEmbeddings = await noteIngest(job.data.contentId);
    } else if (job.data.fileType === ContentType.youtube) {
      textsForEmbeddings = await videoIngest(job.data.link!);
    } else if (job.data.fileType === ContentType.tweet) {
      textsForEmbeddings = await tweetIngest(job.data.link!);
    } else if (job.data.fileType === ContentType.link) {
      textsForEmbeddings = await linkIngest(job.data.link!);
    } else {
      throw new Error("Invalid file type.");
    }

    // creating vector embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: embeddingModel,
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      apiKey: googleGenaiApiKey,
    });

    const vectors = await embeddings.embedDocuments(textsForEmbeddings);
    // console.log(vectors[0]);

    // storing in qdrant vector store
    if (!client.collectionExists(qdrantCollectionName!)) {
      throw new Error(
        `collection ${qdrantCollectionName} does not exists on the vector store`
      );
    }

    console.log("inserting into qdrant db...");

    const points = textsForEmbeddings.map((text, index) => ({
      id: uuid(), // qdrant has a restriction on IDs
      vector: vectors[index]!,
      payload: {
        type: job.data.fileType,
        userId: job.data.userId,
        chunkText: text,
        contentId: job.data.contentId,
        title: job.data.title || "",
      },
    }));

    // console.log(points[0]);

    await client.upsert(qdrantCollectionName!, {
      wait: true,
      points,
    });

    console.log("successfully stored the vectors inside qdb");

    // updating the embedding status on database
    await prisma.contentEmbedding.update({
      where: {
        contentId: job.data.contentId,
      },
      data: {
        status: "ready",
        model: embeddingModel,
        chunksCount: textsForEmbeddings.length,
      },
    });

    console.log("successfully updated the ingestion status on db");
  },
  { connection: redisClient }
);

ingestionWorker.on("completed", (job) => {
  console.log(`Job ${job.id} has finished.`);
});

ingestionWorker.on("failed", async (job, err) => {
  console.log(`job ${job?.id} has failed with error: ${err}`);
  // update ingestion status on db upon failure
  await prisma.contentEmbedding.update({
    where: {
      contentId: job?.data.contentId,
    },
    data: {
      status: "failed",
      errorMessage: err.message,
    },
  });
});

console.log("Ingestion worker has started, listening for jobs...");
