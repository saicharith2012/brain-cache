import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function videoIngest(link: string) {
  const loader = YoutubeLoader.createFromUrl(link, {
    language: "en",
    addVideoInfo: true,
  });

  const docs = await loader.load();

  //   console.log(docs)
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await textSplitter.createDocuments(
    docs.map((doc) => doc.pageContent + " - title: " + doc.metadata.title + " by " + doc.metadata.author)
  );

  return chunks;
}
