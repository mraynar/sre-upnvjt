CREATE TABLE "documentCategory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "documentItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"categoryId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"fileUrl" varchar(1000) NOT NULL,
	"uploadedById" integer NOT NULL,
	"createdAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "attendanceSession" ADD COLUMN "token" varchar(50);--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "folderId" varchar(255);--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "maxUploadSizeMb" integer;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "allowMultipleFiles" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "submissionType" varchar(50) DEFAULT 'BOTH';--> statement-breakpoint
ALTER TABLE "documentItem" ADD CONSTRAINT "documentItem_categoryId_documentCategory_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."documentCategory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentItem" ADD CONSTRAINT "documentItem_uploadedById_user_id_fk" FOREIGN KEY ("uploadedById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;