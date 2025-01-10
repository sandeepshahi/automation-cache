import { Redis } from "ioredis";
import * as dotenv from "dotenv";

dotenv.config();

const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } = process.env;

const redisInstances: Record<number, Redis> = {};

export const getRedisInstance = (dbIndex: number = 0): Redis => {
  if (redisInstances[dbIndex]) {
    return redisInstances[dbIndex];
  }

  const redis = new Redis({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    db: dbIndex,
    retryStrategy(times) {
      // Retry up to 5 times with an increasing delay
      if (times >= 5) {
        console.error(`Redis connection failed after ${times} attempts.`);
        return null; // Stops further retries
      }
      const delay = Math.min(times * 100, 2000); // Delay caps at 2 seconds
      console.log(`Retrying connection to Redis (attempt ${times})...`);
      return delay;
    },
  });

  redis.on("connect", () => console.log(`Connected to Redis DB: ${dbIndex}`));
  redis.on("error", (err) =>
    console.error(`Redis Error [DB: ${dbIndex}]:`, err)
  );

  redisInstances[dbIndex] = redis;
  return redis;
};
