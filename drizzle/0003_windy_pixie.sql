ALTER TABLE "todo_lists" ALTER COLUMN "theme_color" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "todo_lists" ALTER COLUMN "theme_color" SET DEFAULT '#a8d5ba'::text;--> statement-breakpoint
DROP TYPE "public"."list_theme";--> statement-breakpoint
CREATE TYPE "public"."list_theme" AS ENUM('#a8d5ba', '#d4a5a5', '#b8e0d2', '#fbbf24');--> statement-breakpoint
UPDATE "todo_lists" SET "theme_color" = '#a8d5ba' WHERE "theme_color" NOT IN ('#a8d5ba', '#d4a5a5', '#b8e0d2', '#fbbf24');--> statement-breakpoint
ALTER TABLE "todo_lists" ALTER COLUMN "theme_color" SET DEFAULT '#a8d5ba'::"public"."list_theme";--> statement-breakpoint
ALTER TABLE "todo_lists" ALTER COLUMN "theme_color" SET DATA TYPE "public"."list_theme" USING "theme_color"::"public"."list_theme";