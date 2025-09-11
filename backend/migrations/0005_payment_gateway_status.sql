CREATE TABLE IF NOT EXISTS "payment_gateway_status" (
  "id" serial PRIMARY KEY,
  "gateway" varchar(32) NOT NULL UNIQUE,
  "status" varchar(16) NOT NULL DEFAULT 'live',
  "updated_at" timestamp DEFAULT now()
);

INSERT INTO "payment_gateway_status" ("gateway", "status") 
VALUES 
  ('paypal', 'live'),
  ('mpesa', 'live')
ON CONFLICT (gateway) DO NOTHING;
