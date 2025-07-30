import { Request, Response, NextFunction } from 'express';
import { doubleCsrf } from 'csrf-csrf';
import { randomBytes } from 'crypto';

const SECRET = process.env.CSRF_SECRET || randomBytes(32).toString('hex');

const csrfUtils = doubleCsrf({
  getSecret: () => SECRET,
  cookieName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getCsrfTokenFromRequest: (req: Request) => {
    // Check headers first
    const headerToken = req.headers && req.headers['x-csrf-token'];
    if (headerToken) return headerToken as string;
    
    // Then check body
    const bodyToken = req.body && req.body.csrfToken;
    if (bodyToken) return bodyToken;
    
    // Finally check query params
    return req.query && req.query._csrf as string;
  },
  getSessionIdentifier: (req: Request) => req.sessionID || '',
});

export const csrfProtection = csrfUtils.doubleCsrfProtection;

export const generateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development' || req.method === 'GET') {
    const token = csrfUtils.generateCsrfToken(req, res);
    res.setHeader('X-CSRF-Token', token);
  }
  next();
};

export const validateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  try {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      csrfUtils.validateRequest(req);
    }
    next();
  } catch (error) {
    console.error('CSRF validation failed:', error);
    res.status(403).json({ message: 'Invalid CSRF token' });
  }
};
