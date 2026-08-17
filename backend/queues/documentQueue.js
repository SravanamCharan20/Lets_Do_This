import redisConnection from "../utils/redis.js";
import { Queue } from "bullmq";

const documentQueue = new Queue("document-processing", {
  connection: redisConnection,
});

export default documentQueue;
