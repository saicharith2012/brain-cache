import { getTweet } from "react-tweet/api";
import { textSplitter } from "../textSplitter.js";
export async function tweetIngest(link: string) {
  const postId = link.split("/")[link.split("/").length - 1];

  if (!postId) {
    throw new Error("tweet not found");
  }

  const tweet = await getTweet(postId);

  if (!tweet) {
    throw new Error("tweet not found.");
  }

  const text = `tweet: ${tweet?.text}, username:${tweet.user.name}, screenname:${tweet.user.screen_name}`;
  const docs = [];
  docs.push(text);

  const chunks = await textSplitter.createDocuments(docs);

  if (!chunks || chunks?.length === 0) {
    throw new Error("no data in memory.");
  }

  const textsForEmbeddings = chunks.map((chunk) => chunk.pageContent);

  return textsForEmbeddings;
}
