import { client } from "../index.js";

async function createCollection() {
  try {
    await client.createCollection("braincache_embeddings", {
      vectors: {
        size: 768,
        distance: "Cosine",
      },
    });
  } catch (error) {
    console.log(
      error instanceof Error ? error.message : "failed to create collection"
    );
  }
}

createCollection();
