import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import prisma from "@repo/db/client";

export async function noteIngest(contentId: string) {
  const content = await prisma.noteContent.findUnique({
    where: {
      contentId,
    },
  });

  if (!content) {
    throw new Error("Error while fetching note from db. ");
  }

  let docs = [];
  docs.push(content?.contentData);

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = textSplitter.createDocuments(docs);
  return chunks;
}
