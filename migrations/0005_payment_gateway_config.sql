CREATE TABLE IF NOT EXISTS "payment_gateway_config" (
  "gateway" varchar(50) PRIMARY KEY,
  "config" text NOT NULL,
  "updated_at" timestamp DEFAULT now()
);

-- Insert default configurations
INSERT INTO "payment_gateway_config" ("gateway", "config") 
VALUES 
  ('paypal', '{"clientId":"","clientSecret":"","mode":"sandbox","merchantId":""}'),
  ('mpesa', '{"consumerKey":"","consumerSecret":"","shortCode":"","passKey":"","callbackUrl":""}')
ON CONFLICT (gateway) DO NOTHING;
