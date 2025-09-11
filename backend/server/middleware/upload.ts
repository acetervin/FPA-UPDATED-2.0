import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { lookup } from 'mime-types';
import { existsSync, mkdirSync } from 'fs';
import { sanitizeFilename } from '../utils/sanitize';
import winston from 'winston';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/security.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/uploads.log' })
  ]
});

// Allowed file types and their corresponding MIME types
const ALLOWED_FILE_TYPES = new Map([
  ['image', ['image/jpeg', 'image/png', 'image/gif', 'image/webp']],
  ['document', ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']],
  ['video', ['video/mp4', 'video/webm']]
]);

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  video: 50 * 1024 * 1024 // 50MB
};

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const fileExt = path.extname(file.originalname);
    const randomName = randomBytes(16).toString('hex');
    const sanitizedName = sanitizeFilename(path.basename(file.originalname, fileExt));
    cb(null, `${sanitizedName}-${randomName}${fileExt}`);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const fileType = getFileType(file.mimetype);
  
  if (!fileType) {
    cb(new Error('File type not allowed'));
    return;
  }

  // Check file size limit
  const sizeLimit = FILE_SIZE_LIMITS[fileType];
  if (parseInt(req.headers['content-length'] || '0') > sizeLimit) {
    cb(new Error(`File size exceeds limit of ${sizeLimit / (1024 * 1024)}MB`));
    return;
  }

  // Verify mime type
  const allowedMimes = ALLOWED_FILE_TYPES.get(fileType);
  if (!allowedMimes?.includes(file.mimetype)) {
    cb(new Error('Invalid file type'));
    return;
  }

  // Additional security checks
  if (!isValidFile(file)) {
    cb(new Error('Invalid file'));
    return;
  }

  cb(null, true);
};

// Determine file type from mime type
const getFileType = (mimeType: string): keyof typeof FILE_SIZE_LIMITS | null => {
  const types = Array.from(ALLOWED_FILE_TYPES.keys());
  for (const type of types) {
    const mimes = ALLOWED_FILE_TYPES.get(type);
    if (mimes && mimes.includes(mimeType)) {
      return type as keyof typeof FILE_SIZE_LIMITS;
    }
  }
  return null;
};

// Additional file validation
const isValidFile = (file: Express.Multer.File): boolean => {
  // Check for double extensions
  const filename = file.originalname.toLowerCase();
  if (filename.indexOf('.') !== filename.lastIndexOf('.')) {
    return false;
  }

  // Check actual mime type matches claimed type
  const actualMime = lookup(file.originalname);
  if (!actualMime || actualMime !== file.mimetype) {
    return false;
  }

  return true;
};

// Import winston logger
import { logSecurity, logError } from '../utils/logger';

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Math.max(...Object.values(FILE_SIZE_LIMITS)),
    files: 1 // Maximum number of files per request
  }
});

// Error handling middleware for uploads
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    logger.error('Upload error', {
      type: 'UPLOAD_ERROR',
      error: err.code,
      ip: req.ip,
      filename: err.field
    });

    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        error: 'File too large',
        maxSize: Math.max(...Object.values(FILE_SIZE_LIMITS))
      });
      return;
    }

    res.status(400).json({
      error: 'File upload error',
      code: err.code
    });
    return;
  }

  logger.error('Upload error', {
    message: 'Unknown upload error',
    error: err.message,
    ip: req.ip
  });

  res.status(500).json({
    error: 'File upload failed'
  });
};
