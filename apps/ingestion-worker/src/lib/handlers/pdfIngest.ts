import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  awsAccessKeyId,
  awsRegion,
  awsS3BucketName,
  awsSecretAccessKey,
} from "../../config.js";
import { Readable } from "stream";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { textSplitter } from "../textSplitter.js";

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId!,
    secretAccessKey: awsSecretAccessKey!,
  },
});

export async function pdfIngest(Key: string) {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: awsS3BucketName,
      Key,
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
  const chunks = await textSplitter.createDocuments(
    docs.map((doc) => doc.pageContent)
  );

  // console.log(chunks[0]);

  return chunks;
}
