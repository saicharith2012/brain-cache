import { redisClient } from "@repo/redis/client";
import { Readable } from "stream";
import { Worker } from "bullmq";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  awsAccessKeyId,
  awsRegion,
  awsS3BucketName,
  awsSecretAccessKey,
  googleGenaiApiKey,
  qdrantCollectionName,
} from "./config.js";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { client } from "@repo/qdrantdb/client";
import prisma from "@repo/db/client";

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId!,
    secretAccessKey: awsSecretAccessKey!,
  },
});

const ingestionWorker = new Worker(
  "ingestion-queue",
  async (job) => {
    console.log(
      `Processing job ${job.id} for memory ${JSON.stringify(job.data.contentId)}`
    );

    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: awsS3BucketName,
        Key: job.data.filePath,
      })
    );

    if (!response.Body) {
      throw new Error("no body in s3 response");
    }

    // fetching the pdf as a stream
    const stream = response.Body as Readable;

    const texts = [];

    for await (const text of stream) {
      texts.push(Buffer.isBuffer(text) ? text : Buffer.from(text));
    }

    // parsing the pdf
    const fileBlob = new Blob(texts, { type: "application/pdf" });

    const loader = new WebPDFLoader(fileBlob);
    const docs = await loader.load();

    // chunking
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await textSplitter.createDocuments(
      docs.map((doc) => doc.pageContent)
    );

    console.log(chunks[0]);
    const textsForEmbeddings = chunks.map((chunk) => chunk.pageContent);

    // creating vector embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      apiKey: googleGenaiApiKey,
    });

    const vectors = await embeddings.embedDocuments(textsForEmbeddings);
    console.log(vectors[0]);

    // storing in qdrant vector store
    if (!client.collectionExists(qdrantCollectionName!)) {
      throw new Error(
        `collection ${qdrantCollectionName} does not exists on the vector store`
      );
    }

    console.log("inserting into qdrant db...");

    const points = chunks.map((chunk, index) => ({
      id: `${job.data.contentId}`,
      vector: vectors[index]!,
      payload: {
        type: "document",
        chunkIndex: index,
        chunkText: chunk.pageContent,
      },
    }));

    console.log(points[0])


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
        model: "text-embedding-004",
        chunksCount: chunks.length,
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
