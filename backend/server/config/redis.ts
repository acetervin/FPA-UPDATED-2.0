import { createClient } from 'redis';

// Create Redis client with secure configuration
export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: process.env.NODE_ENV === 'production' ? {
    tls: true,
    rejectUnauthorized: true,
  } : undefined
});

// Error handling
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1); // Only exit on Redis connection failure in production
  }
});

// Connection handling
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('reconnecting', () => {
  console.log('Redis client reconnecting');
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Ensure Redis connection is properly closed on app termination
process.on('SIGINT', () => {
  redisClient.quit();
  process.exit();
});

process.on('SIGTERM', () => {
  redisClient.quit();
  process.exit();
});
