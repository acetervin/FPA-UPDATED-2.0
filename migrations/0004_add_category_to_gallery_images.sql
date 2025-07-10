-- Add category column to gallery_images
ALTER TABLE gallery_images ADD COLUMN category TEXT NOT NULL DEFAULT 'Uncategorized';
