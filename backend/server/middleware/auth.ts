import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { users } from '../../shared/schema.js';

interface JWTPayload {
  id: number;
  role: 'admin' | 'volunteer' | 'donor';
  username: string;
  iat?: number;
  exp?: number;
}

// Replace with your actual JWT secret - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    // Optionally, fetch user from DB if you want to attach full user info
    // const user = await db.select().from(users).where(eq(users.id, payload.id));
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
