import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import { z } from 'zod';
import { doubleCsrf } from 'csrf-csrf';
import crypto from 'crypto';

// Declare session properties
declare module 'express-session' {
  interface SessionData {
    userId: string;
    userRole: string;
    id: string;
    lastActive: Date;
    ipAddress: string;
  }
}

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;

// Encryption utility for sensitive data
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decrypt(text: string): string {
  try {
    const [ivHex, encryptedHex] = text.split(':');
    if (!ivHex || !encryptedHex) {
      throw new Error('Invalid encrypted text format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt data');
  }
}

// CSRF Protection
const csrfUtils = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'your-secret-key',
  cookieName: 'x-csrf-token',
  getCsrfTokenFromRequest: (req: Request) => req.headers['x-csrf-token'] as string,
  getSessionIdentifier: (req: Request) => req.session?.id || '',
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  },
});

export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'GET') {
      const token = csrfUtils.generateCsrfToken(req, res);
      // The cookie is automatically set by generateCsrfToken
      next();
    } else {
      csrfUtils.validateRequest(req);
      next();
    }
  } catch (error) {
    res.status(403).json({ message: 'Invalid CSRF token' });
  }
};

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

// Stricter auth route limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per IP
  message: 'Too many login attempts, please try again later',
  handler: (req: Request, res: Response) => {
    console.error(`Auth rate limit exceeded for IP ${req.ip}`);
    res.status(429).json({
      message: 'Too many login attempts, please try again later',
    });
  },
});

// IP blocking middleware for suspicious activity
const blockedIPs = new Set<string>();
const suspiciousAttempts = new Map<string, number>();

export const ipFilter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress;
  
  if (!ip) {
    console.error('No IP address found in request');
    return res.status(400).json({ message: 'Bad request' });
  }

  if (blockedIPs.has(ip)) {
    console.error(`Blocked IP attempt: ${ip}`);
    return res.status(403).json({ message: 'Access denied' });
  }

  // Track suspicious attempts
  const attempts = suspiciousAttempts.get(ip) || 0;
  if (attempts > 10) { // Block after 10 suspicious attempts
    blockedIPs.add(ip);
    suspiciousAttempts.delete(ip);
    console.error(`IP blocked due to suspicious activity: ${ip}`);
    return res.status(403).json({ message: 'Access denied' });
  }

  // Increment attempts
  suspiciousAttempts.set(ip, attempts + 1);

  next();
};

// CORS configuration
const corsOptions: CorsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://familypeace.org'] 
    : ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  maxAge: 600 // 10 minutes
};

export const corsMiddleware = cors(corsOptions);

// Sanitize error messages
export function sanitizeError(error: any): { message: string; code?: string } {
  // Only include error details in development
  if (process.env.NODE_ENV === 'development') {
    return {
      message: error.message || 'An error occurred',
      code: error.code
    };
  }
  // Generic error message in production
  return {
    message: 'An error occurred',
    code: 'INTERNAL_ERROR'
  };
}

// Helmet configuration with CSP
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.paypal.com", "https://www.sandbox.paypal.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.paypal.com", "https://api.sandbox.paypal.com"],
      frameSrc: ["'self'", "https://www.paypal.com", "https://www.sandbox.paypal.com"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for PayPal SDK
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Required for PayPal popup
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Required for external resources
});

// Helmet security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:', 'wss:'],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
});

// Input validation middleware
export function validateInput<T extends z.ZodType>(schema: T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Add validated data to request object
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Validation failed',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  };
}

// Session activity tracking middleware
export function trackSessionActivity(req: Request, res: Response, next: NextFunction) {
  if (req.session) {
    const currentTime = new Date();
    const lastActive = req.session.lastActive || currentTime;
    const currentIp = req.ip || req.socket.remoteAddress || 'unknown';
    
    // Check for session timeout (30 minutes)
    const timeoutMs = 30 * 60 * 1000; // 30 minutes in milliseconds
    if (currentTime.getTime() - lastActive.getTime() > timeoutMs) {
      req.session.destroy((err) => {
        if (err) console.error('Session destruction error:', err);
      });
      return res.status(440).json({ message: 'Session expired' });
    }
    
    // The IP address check for session hijacking has been removed.
    // In a production environment with load balancers or proxies, the internal IP can change
    // between requests for the same user, causing false positives and invalidating sessions.
    // if (req.session.ipAddress && req.session.ipAddress !== currentIp) {
    //   console.error(`Potential session hijacking detected: IP changed from ${req.session.ipAddress} to ${currentIp}`);
    //   req.session.destroy((err) => {
    //     if (err) console.error('Session destruction error:', err);
    //   });
    //   return res.status(403).json({ message: 'Session invalidated' });
    // }

    
    // Update session
    req.session.lastActive = currentTime;
    req.session.ipAddress = currentIp;
  }
  next();
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  
  // Verify session integrity
  if (!req.session.userRole || !req.session.id) {
    req.session.destroy((err) => {
      if (err) console.error('Session destruction error:', err);
    });
    return res.status(401).json({ message: 'Invalid session' });
  }
  
  next();
}

// Role-based authorization middleware
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.userRole) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!roles.includes(req.session.userRole)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
}

// Error handling middleware
export function errorHandler(err: Error | any, req: Request, res: Response, next: NextFunction) {
  console.error(err?.stack || err);

  if (err?.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  if (err?.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ message: 'Invalid CSRF token' });
    return;
  }

  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err?.message || 'An error occurred'
  });
}
