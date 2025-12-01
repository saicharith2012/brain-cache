"use server";
import { TaskType } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { googleGenaiApiKey, qdrantCollectionName } from "../config";
import { client } from "@repo/qdrantdb/client";
import { GoogleGenAI } from "@google/genai";

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
    const chunks = await client.search(qdrantCollectionName!, {
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

    const prompt = `
    System:
    You are Braincache, a personal assistant that helps users recall and summarize their stored memories.

    If the context is not relevant or insufficient, respond with something like "I don't find anything based on your saved memories." in your own words.

    Context along with sources (from user's stored memories):
           - {title: ${chunks[0]?.payload?.title}, type: ${chunks[0]?.payload?.type}, content: ${chunks[0]?.payload?.chunkText}}
           - {title: ${chunks[1]?.payload?.title}, type: ${chunks[1]?.payload?.type}, content: ${chunks[1]?.payload?.chunkText}}
           - {title: ${chunks[2]?.payload?.title}, type: ${chunks[2]?.payload?.type}, content: ${chunks[2]?.payload?.chunkText}}


    Each chunk includes text extracted from different sources like notes, documents, tweets, web pages, or YouTube transcriptions.

    Instructions:
    - Use the most relevant chunks to answer.
    - If multiple sources give different information, present all the info separately with the context they are presented in.
    - Keep the answer in casual language and concise. Speak like a human.
    - Add some general context outside of memories if the answer feels incomplete.
    
    User Question:
    ${query}
    `;

    console.log(prompt);

    // sending to the LLM and getting response
    const ai = new GoogleGenAI({ apiKey: googleGenaiApiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.log(
      error instanceof Error
        ? error.message
        : "Error while searching the vector db."
    );
  }
}
