import redisConnection from "./redis.js";

const CAPACITY = 5;
const REFILL_RATE = 1; // tokens per second

const redisTokenBucket = async (key) => {
  const now = Date.now();

  const bucket = await redisConnection.get(key);

  let tokens = CAPACITY;
  let lastRefillTime = now;

  if (bucket) {
    const parsed = JSON.parse(bucket);

    tokens = parsed.tokens;
    lastRefillTime = parsed.lastRefillTime;
  }

  // Calculate refill
  const elapsedTime = (now - lastRefillTime) / 1000;
  const tokensToAdd = elapsedTime * REFILL_RATE;

  tokens = Math.min(CAPACITY, tokens + tokensToAdd);

  // Check token
  if (tokens < 1) {
    await redisConnection.set(
      key,
      JSON.stringify({
        tokens,
        lastRefillTime: now,
      }),
      "EX",
      60,
    );

    return false;
  }

  // Consume token
  tokens -= 1;

  await redisConnection.set(
    key,
    JSON.stringify({
      tokens,
      lastRefillTime: now,
    }),
    "EX",
    60,
  );

  return true;
};

export default redisTokenBucket;
