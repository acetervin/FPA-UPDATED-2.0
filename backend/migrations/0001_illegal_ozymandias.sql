CREATE TABLE "recurring_donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"amount" integer NOT NULL,
	"cause_id" integer,
	"frequency" text NOT NULL,
	"next_donation_date" timestamp NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"payment_method" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_donation_date" timestamp,
	"failed_attempts" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "recurring_donation_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "two_factor_secret" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "two_factor_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "recurring_donations" ADD CONSTRAINT "recurring_donations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_donations" ADD CONSTRAINT "recurring_donations_cause_id_causes_id_fk" FOREIGN KEY ("cause_id") REFERENCES "public"."causes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_recurring_donation_id_recurring_donations_id_fk" FOREIGN KEY ("recurring_donation_id") REFERENCES "public"."recurring_donations"("id") ON DELETE no action ON UPDATE no action;