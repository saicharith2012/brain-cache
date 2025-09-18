import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { textSplitter } from "../textSplitter.js";

export async function linkIngest(link: string) {
  const loader = new CheerioWebBaseLoader(link);

  const docs = await loader.load();

  if (!docs || !docs[0]) {
    throw new Error(`Error while fetching text from ${link}`);
  }

  const chunks = await textSplitter.createDocuments([
    `${docs[0].pageContent} from source: ${docs[0].metadata.source}`,
  ]);

  return chunks;
}
