import OpenAI from "openai";


// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// // Initialize a common LanceDB instance
// const uri = "/tmp/lancedb/";
// export const dbPromise = lancedb.connect(uri);

// Helper to generate embeddings using OpenAI
export async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}
