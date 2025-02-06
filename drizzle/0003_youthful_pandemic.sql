CREATE TYPE "public"."events_answer" AS ENUM('YES', 'NO');--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "sot" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "answer" "events_answer";