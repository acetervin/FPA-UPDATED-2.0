import { Router, Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { db } from '../db';
import { media } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Allowed file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4',
      'video/quicktime'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all media files
router.get('/', async (req, res) => {
  try {
    const mediaFiles = await db.select().from(media);
    res.json(mediaFiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media files' });
  }
});

// Upload media file
router.post('/upload', upload.single('file'), async (req: Request & { file?: Express.Multer.File }, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = req.file.mimetype.startsWith('image/')
      ? 'image'
      : req.file.mimetype.startsWith('video/')
      ? 'video'
      : 'document';

    const [mediaFile] = await db
      .insert(media)
      .values({
        title: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        type: fileType,
        size: req.file.size
      })
      .returning();

    res.status(201).json(mediaFile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Delete media file
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [mediaFile] = await db
      .select()
      .from(media)
      .where(eq(media.id, parseInt(id)));

    if (!mediaFile) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), mediaFile.url);
    await fs.unlink(filePath);

    // Delete database record
    await db.delete(media).where(eq(media.id, parseInt(id)));

    res.json({ message: 'Media file deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete media file' });
  }
});

export default router;
