import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const paymentGatewayConfig = pgTable('payment_gateway_config', {
  gateway: varchar('gateway', { length: 50 }).primaryKey(),
  config: text('config').notNull(), // JSON string containing gateway-specific configuration
  updatedAt: timestamp('updated_at').defaultNow(),
});
