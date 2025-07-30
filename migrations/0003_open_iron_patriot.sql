CREATE TABLE "payment_gateway_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"gateway" text NOT NULL,
	"status" text DEFAULT 'live' NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "payment_gateway_status_gateway_unique" UNIQUE("gateway")
);
