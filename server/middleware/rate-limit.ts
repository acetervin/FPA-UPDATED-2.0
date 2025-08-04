import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';
import { logSecurity } from '../utils/logger.js';


// Base rate limit configuration
const baseConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: 'rate-limit:'
  }),
};

// General API rate limiter
export const apiLimiter = rateLimit({
  ...baseConfig,
  skip: (req) => {
    // Skip localhost requests, useful for internal health checks or when running behind a proxy
    const ip = req.ip;
    return ip === '127.0.0.1' || ip === '::1';
  },
  handler: (req, res) => {

    logSecurity('Rate limit exceeded', {
      type: 'RATE_LIMIT_EXCEEDED',
      ip: req.ip,
      path: req.path,
      headers: req.headers,
    });
    res.status(429).json({
      error: 'Too many requests, please try again later',
      retryAfter: Math.ceil(baseConfig.windowMs / 1000),
    });
  },
});

// Stricter auth routes rate limiter
export const authLimiter = rateLimit({
  ...baseConfig,
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5'),
  skip: (req) => {
    // Skip localhost requests
    const ip = req.ip;
    return ip === '127.0.0.1' || ip === '::1';
  },
  handler: (req, res) => {

    logSecurity('Authentication rate limit exceeded', {
      type: 'AUTH_RATE_LIMIT_EXCEEDED',
      ip: req.ip,
      path: req.path,
      headers: req.headers,
    });
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later',
      retryAfter: Math.ceil(baseConfig.windowMs / 1000),
    });
  },
});

// Specific endpoint rate limiters
export const createEndpointLimiter = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
}) => {
  return rateLimit({
    ...baseConfig,
    ...options,
    handler: (req, res) => {
      logSecurity('Endpoint rate limit exceeded', {
        type: 'ENDPOINT_RATE_LIMIT_EXCEEDED',
        ip: req.ip,
        path: req.path,
        headers: req.headers,
      });
      res.status(429).json({
        error: options.message || 'Too many requests, please try again later',
        retryAfter: Math.ceil((options.windowMs || baseConfig.windowMs) / 1000),
      });
    },
  });
};
