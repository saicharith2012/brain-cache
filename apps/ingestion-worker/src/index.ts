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
  qdrantUrl,
} from "./config.js";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { url } from "inspector";

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

    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    // parsing the pdf
    const fileBlob = new Blob(chunks, { type: "application/pdf" });

    const loader = new WebPDFLoader(fileBlob);
    const docs = await loader.load();

    // chunking
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const texts = await textSplitter.createDocuments(
      docs.map((doc) => doc.pageContent)
    );

    texts.forEach((text, index) => {
      ((text.metadata.chunkIndex = index),
        (text.metadata.sourceType = "document"),
        (text.metadata.contentId = job.data.contentId));
    });

    // console.log(texts[0]);
    const textsForEmbeddings = texts.map((text) => text.pageContent);

    // creating vector embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      apiKey: googleGenaiApiKey,
    });

    const vectors = await embeddings.embedDocuments(textsForEmbeddings);
    // console.log(vectors[0])

    // storing in qdrant vector store
    
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
