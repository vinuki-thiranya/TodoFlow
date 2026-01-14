-- Drop the old enum and recreate with new values
ALTER TYPE "public"."list_theme" RENAME TO "list_theme_old";
CREATE TYPE "public"."list_theme" AS ENUM('#a8d5ba', '#d4a5a5', '#b8e0d2', '#fbbf24');
ALTER TABLE "todo_lists" ALTER COLUMN "theme_color" TYPE "public"."list_theme" USING "theme_color"::"public"."list_theme";
DROP TYPE "public"."list_theme_old";
ALTER TABLE "todo_lists" ALTER COLUMN "theme_color" SET DEFAULT '#a8d5ba'::"public"."list_theme";
