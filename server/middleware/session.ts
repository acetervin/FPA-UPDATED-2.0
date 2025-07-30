import { Request, Response, NextFunction } from 'express';
import { sessionConfig, regenerateSession } from '../config/session';

export const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if session is expired
  if (req.session && req.session.lastActive) {
    const now = new Date();
    const lastActive = new Date(req.session.lastActive);
    const timeDiff = now.getTime() - lastActive.getTime();
    const maxAge = sessionConfig.cookie.maxAge as number;

    if (timeDiff > maxAge) {
      return res.status(401).json({ message: 'Session expired' });
    }
  }

  // Update last active timestamp
  if (req.session) {
    req.session.lastActive = new Date();
  }

  next();
};

export const secureSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session.userId) {
      // Regenerate session on authentication to prevent session fixation
      await regenerateSession(req);
      
      // Set new session data
      req.session.userId = req.session.userId;
      req.session.userRole = req.session.userRole;
      req.session.createdAt = new Date();
      req.session.lastActive = new Date();
    }
    next();
  } catch (error) {
    console.error('Session security error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Activity logging middleware
export const sessionActivityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    if (req.session?.userId) {
      console.log({
        timestamp: new Date(),
        userId: req.session.userId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration,
        ip: req.ip
      });
    }
  });

  next();
};
