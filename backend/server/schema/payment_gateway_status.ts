import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const paymentGatewayStatus = pgTable('payment_gateway_status', {
  id: serial('id').primaryKey(),
  gateway: varchar('gateway', { length: 32 }).notNull().unique(),
  status: varchar('status', { length: 16 }).notNull().default('live'),
  updatedAt: timestamp('updated_at').defaultNow(),
});
