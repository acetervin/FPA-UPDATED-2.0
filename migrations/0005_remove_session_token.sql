-- Migration: Remove session_token and session_expires from users table
ALTER TABLE users DROP COLUMN IF EXISTS session_token;
ALTER TABLE users DROP COLUMN IF EXISTS session_expires;
