import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { textSplitter } from "../textSplitter.js";

export async function videoIngest(link: string) {
  const loader = YoutubeLoader.createFromUrl(link, {
    language: "en",
    addVideoInfo: true,
  });

  const docs = await loader.load();

  // console.log(docs)

  const chunks = await textSplitter.createDocuments(
    docs.map(
      (doc) =>
        doc.pageContent +
        " - title: " +
        doc.metadata.title +
        " by " +
        doc.metadata.author
    )
  );

  if (!chunks || chunks?.length === 0) {
    throw new Error("no data in memory.");
  }

  const textsForEmbeddings = chunks.map((chunk) => chunk.pageContent);

  return textsForEmbeddings;
}
