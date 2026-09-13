import Redis from 'ioredis';
import { config } from '../config';

let redisClient: Redis | null = null;

if (config.redis.url) {
  try {
    redisClient = new Redis(config.redis.url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      console.log('✓ Connected to Redis successfully');
    });

    redisClient.on('error', (err) => {
      console.warn('[REDIS] Connection error:', err.message);
    });

    redisClient.connect().catch((err) => {
      console.warn('[REDIS] Failed initial connect:', err.message);
    });
  } catch (err) {
    console.warn('[REDIS] Failed to initialize client:', err);
  }
}

export const getRedisClient = (): Redis | null => redisClient;
export { redisClient };
