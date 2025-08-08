import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => {
  console.error('[Redis] Connection Error:', err);
});

redisClient.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

await redisClient.connect();

export default redisClient;
