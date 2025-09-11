CREATE TABLE payment_gateway_status (
    id SERIAL PRIMARY KEY,
    gateway VARCHAR(32) NOT NULL UNIQUE, -- 'paypal' or 'mpesa'
    status VARCHAR(16) NOT NULL DEFAULT 'live', -- 'live' or 'maintenance'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial values
INSERT INTO payment_gateway_status (gateway, status) VALUES ('paypal', 'live') ON CONFLICT DO NOTHING;
INSERT INTO payment_gateway_status (gateway, status) VALUES ('mpesa', 'live') ON CONFLICT DO NOTHING;
