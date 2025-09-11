ALTER TABLE "users" ADD COLUMN "session_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "session_expires" timestamp;