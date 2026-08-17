import redisTokenBucket from "../utils/redisTokenBucket.js";

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;

    const key = `rate-limit:${ip}`;

    const allowed = await redisTokenBucket(key);

    if (!allowed) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.log("Rate limiter error:", error);

    return res.status(500).json({
      message: "Rate limiter error",
    });
  }
};

export default rateLimiter;
