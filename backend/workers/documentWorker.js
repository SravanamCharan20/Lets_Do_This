import { Worker } from "bullmq";
import Document from "../models/Document.js";
import { generateEmbedding } from "../utils/generateEmbedding.js";
import redisConnection from "../utils/redis.js";

const documentWorker = new Worker(
  "document-processing",
  async (job) => {
    const { documentId, text } = job.data;
    const embedding = await generateEmbedding(text);

    await Document.findByIdAndUpdate(documentId, {
      embedding,
    });
  },
  {
    connection: redisConnection,
  },
);

documentWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

documentWorker.on("failed", (job, error) => {
  console.log(`Job ${job?.id} failed:`, error.message);
});

export default documentWorker;
