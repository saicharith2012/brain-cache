"use server";
import { TaskType } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { googleGenaiApiKey, qdrantCollectionName } from "../config";
import { client } from "@repo/qdrantdb/client";

export async function queryRetrieval({
  query,
  userId,
}: {
  query: string;
  userId: string;
  type?: string;
}) {
  // query embedding
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_QUERY,
      apiKey: googleGenaiApiKey,
    });

    const vector = await embeddings.embedQuery(query);

    // vector search qdrant with filtering based on userId and type maybe
    const response = await client.search(qdrantCollectionName!, {
      vector,
      limit: 3,
      filter: {
        must: [
          {
            key: "userId",
            match: {
              value: userId,
            },
          },
        ],
      },
      with_payload: true,
      with_vector: false,
    });

    return response;
  } catch (error) {
    console.log(
      error instanceof Error
        ? error.message
        : "Error while searching the vector db."
    );
  }
}
