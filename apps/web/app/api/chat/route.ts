import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import {
  embeddingModel,
  googleGenaiApiKey,
  qdrantCollectionName,
} from "../../../config";
import { TaskType } from "@google/generative-ai";
import { client } from "@repo/qdrantdb/client";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { query, userId } = await req.json();
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: embeddingModel,
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

    // console.log(chunks[0])

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
                - Use the most relevant chunks to answer and mention the source at the start.
                - If multiple sources give different information, present all the info separately with the context they are presented in.
                - Keep the answer in casual language, concise with 8-10 lines at maximum. Speak like a human.
                
                User Question:
                ${query}
                `;

    // console.log(prompt);

    // sending to the LLM and getting response
    const ai = new GoogleGenAI({ apiKey: googleGenaiApiKey });

    // console.log("Streaming the response...");

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt,
          });

          for await (const chunk of responseStream) {
            controller.enqueue(encoder.encode(chunk.text));
          }

          controller.close();
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `\n[${error instanceof Error ? error.message : "ERROR"}]\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return new Response(
      error instanceof Error
        ? error.message
        : "Error while searching the brain",
      { status: 500 }
    );
  }
}
