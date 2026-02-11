import { textSplitter } from "../textSplitter.js";
import { fetchTranscript } from "youtube-transcript-plus";

export async function videoIngest(link: string) {
  const transcriptResponse = await fetchTranscript(link);

  let transcript = "";

  transcriptResponse.forEach((item) => (transcript += " " + item.text));

  let transcriptList: string[] = []
  transcriptList.push(transcript)

  const chunks = await textSplitter.createDocuments(
    transcriptList.map((doc) => doc)
  );

  if (!chunks || chunks?.length === 0) {
    throw new Error("no data in memory.");
  }

  // console.log(chunks);

  const textsForEmbeddings = chunks.map((chunk) => chunk.pageContent);

  return textsForEmbeddings;
}
