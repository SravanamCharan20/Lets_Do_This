import redisConnection from "./redis.js";

export const getCache = async (key) => {
  const data = await redisConnection.get(key);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
};

export const setCache = async (key, data, expiry = 60) => {
  await redisConnection.set(
    key,
    JSON.stringify(data),
    "EX",
    expiry,
  );
};

