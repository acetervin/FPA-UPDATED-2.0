import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import { randomBytes } from 'crypto';

// Redis client setup
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    tls: true,
    rejectUnauthorized: true,
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect().catch(console.error);

const store = new RedisStore({
  client: redisClient,
  prefix: 'session:',
});

export const sessionConfig = {
  store,
  secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
  name: '_session', // More generic name
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiry on every response
  proxy: process.env.NODE_ENV === 'production', // Trust proxy in production
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
    sameSite: 'strict' as const, // Strict SameSite policy
    maxAge: 30 * 60 * 1000, // 30 minutes
    path: '/',
  },
};

// Session management utilities
export const regenerateSession = (req: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err: Error) => {
      if (err) reject(err);
      resolve();
    });
  });
};

export const destroySession = (req: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err: Error) => {
      if (err) reject(err);
      resolve();
    });
  });
};

// Type definitions for session data
declare module 'express-session' {
  interface SessionData {
    userId: string;
    userRole: string;
    createdAt: Date;
    lastActive: Date;
  }
}
