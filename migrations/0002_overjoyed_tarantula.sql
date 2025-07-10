CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "end_date" timestamp;--> statement-breakpoint
ALTER TABLE "blog_posts" DROP COLUMN "status";