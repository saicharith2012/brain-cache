import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { textSplitter } from "../textSplitter.js";

export async function videoIngest(link: string) {
  const loader = YoutubeLoader.createFromUrl(link, {
    language: "en",
    addVideoInfo: true,
  });

  const docs = await loader.load();

  //   console.log(d

  const chunks = await textSplitter.createDocuments(
    docs.map((doc) => doc.pageContent + " - title: " + doc.metadata.title + " by " + doc.metadata.author)
  );

  return chunks;
}
