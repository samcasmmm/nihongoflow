CREATE TABLE "grammar_patterns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_number" integer NOT NULL,
	"pattern_key" text NOT NULL,
	"title" text NOT NULL,
	"japanese_title" text NOT NULL,
	"formula" text NOT NULL,
	"explanation" text NOT NULL,
	"skill_tag" text NOT NULL,
	"examples" jsonb NOT NULL,
	"common_mistakes" text NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "grammar_patterns_pattern_key_unique" UNIQUE("pattern_key")
);
--> statement-breakpoint
CREATE TABLE "vocab_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_number" integer NOT NULL,
	"word" text NOT NULL,
	"reading" text NOT NULL,
	"romaji" text NOT NULL,
	"meaning" text NOT NULL,
	"part_of_speech" text NOT NULL,
	"image_url" text,
	"example_sentence" text NOT NULL,
	"example_reading" text NOT NULL,
	"example_meaning" text NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
