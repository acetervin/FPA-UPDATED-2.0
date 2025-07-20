import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { z } from 'zod';
import { doubleCsrf } from 'csrf-csrf';

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

// CORS configuration
export const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://familypeace.org'] 
    : ['http://localhost:5173'],
  credentials: true,
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

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
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
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ message: 'Invalid CSRF token' });
    return;
  }

  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
}
