CREATE TYPE "public"."list_theme" AS ENUM('#EF4444', '#3B82F6', '#FBBF24');--> statement-breakpoint
CREATE TYPE "public"."note_theme" AS ENUM('#FEF08A', '#A7F3D0', '#FCD34D', '#FBCFE8');--> statement-breakpoint
CREATE TYPE "public"."todo_state" AS ENUM('draft', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'manager', 'admin');--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"theme_color" "note_theme" DEFAULT '#FEF08A',
	"x" integer DEFAULT 0,
	"y" integer DEFAULT 0,
	"created_on" timestamp DEFAULT now(),
	"updated_on" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"label" text NOT NULL,
	"background_color" text DEFAULT '#D1D5DB',
	"text_color" text DEFAULT '#374151',
	"created_on" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "todo_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"todo_id" uuid NOT NULL,
	"title" text NOT NULL,
	"is_completed" boolean DEFAULT false,
	"order_index" integer DEFAULT 0,
	"created_on" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "todo_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"title" text NOT NULL,
	"theme_color" "list_theme" DEFAULT '#EF4444',
	"order_index" integer DEFAULT 0,
	"created_on" timestamp DEFAULT now(),
	"updated_on" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "todo_tags" (
	"todo_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"list_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"state" "todo_state" DEFAULT 'draft',
	"due_at" timestamp,
	"order_index" integer DEFAULT 0,
	"created_on" timestamp DEFAULT now(),
	"updated_on" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" text,
	"email" text NOT NULL,
	"is_email_verified" boolean DEFAULT false,
	"avatar_url" text,
	"role" "user_role" DEFAULT 'user',
	"created_on" timestamp DEFAULT now(),
	"updated_on" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_items" ADD CONSTRAINT "todo_items_todo_id_todos_id_fk" FOREIGN KEY ("todo_id") REFERENCES "public"."todos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_lists" ADD CONSTRAINT "todo_lists_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_tags" ADD CONSTRAINT "todo_tags_todo_id_todos_id_fk" FOREIGN KEY ("todo_id") REFERENCES "public"."todos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_tags" ADD CONSTRAINT "todo_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_list_id_todo_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."todo_lists"("id") ON DELETE cascade ON UPDATE no action;