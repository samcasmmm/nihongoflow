DROP TABLE IF EXISTS "swot_reports" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'user' NOT NULL;
