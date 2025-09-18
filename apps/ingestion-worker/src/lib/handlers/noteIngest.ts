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

  const chunks = textSplitter.createDocuments(docs);
  return chunks;
}
