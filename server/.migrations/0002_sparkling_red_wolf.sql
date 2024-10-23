ALTER TABLE "goals" ADD COLUMN "created_At" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "goals" DROP COLUMN IF EXISTS "created_at";