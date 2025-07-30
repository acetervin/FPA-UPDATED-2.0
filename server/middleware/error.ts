import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logError } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logError('Error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    userId: req.session?.userId,
    timestamp: new Date()
  });

  // Handle specific error types
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      message: 'Access denied'
    });
  }

  // Handle CSRF errors
  if (err.name === 'CSRFTokenError') {
    return res.status(403).json({
      message: 'Invalid CSRF token'
    });
  }

  // Handle file upload errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: 'File upload error',
      error: err.message
    });
  }

  // Handle database errors
  if (err.name === 'DatabaseError') {
    return res.status(500).json({
      message: 'Database error occurred'
    });
  }

  // Default error response
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
};
