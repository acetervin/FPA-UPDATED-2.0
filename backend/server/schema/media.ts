import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  type: text('type', { enum: ['image', 'document', 'video'] }).notNull(),
  size: integer('size').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
});
