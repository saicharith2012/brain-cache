import prisma from "@repo/db/client";
import { textSplitter } from "../textSplitter.js";

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

  const chunks = await textSplitter.createDocuments(docs);

  if (!chunks || chunks?.length === 0) {
    throw new Error("no data in memory.");
  }

  const textsForEmbeddings = chunks.map((chunk) => chunk.pageContent);

  return textsForEmbeddings;
}
