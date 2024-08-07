CREATE TABLE IF NOT EXISTS "dokumen-wargas" (
	"id" serial PRIMARY KEY NOT NULL,
	"dokumen_url" varchar(256),
	"status" boolean DEFAULT false NOT NULL,
	"description" varchar(256),
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dokumen-wargas" ADD CONSTRAINT "dokumen-wargas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
