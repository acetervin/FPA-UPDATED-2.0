CREATE TABLE "payment_gateway_config" (
	"gateway" text PRIMARY KEY NOT NULL,
	"config" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
