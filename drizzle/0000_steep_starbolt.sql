CREATE TABLE "announcement" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"imageUrl" varchar(1000),
	"actionLink" varchar(1000),
	"content" text NOT NULL,
	"targetAudience" varchar(255),
	"isActive" boolean DEFAULT true NOT NULL,
	"createdById" integer NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"memberId" integer NOT NULL,
	"date" timestamp NOT NULL,
	"status" varchar(50) NOT NULL,
	"notes" text,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"imageUrl" varchar(1000),
	"isPublished" boolean DEFAULT false NOT NULL,
	"updatedById" integer NOT NULL,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT "content_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "department" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(255) NOT NULL,
	CONSTRAINT "department_name_unique" UNIQUE("name"),
	CONSTRAINT "department_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "division" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"departmentId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"bannerUrl" varchar(1000),
	"eventDate" timestamp NOT NULL,
	"location" varchar(255),
	"category" varchar(255),
	"registrationType" varchar(255),
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "formSubmission" (
	"id" serial PRIMARY KEY NOT NULL,
	"formTemplateId" integer NOT NULL,
	"memberId" integer NOT NULL,
	"answers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"score" integer,
	"submittedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "formTemplate" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"questions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"createdById" integer NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberProfile" (
	"userId" integer PRIMARY KEY NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "merchandise" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"description" text NOT NULL,
	"imageUrl" varchar(1000),
	"linkUrl" varchar(1000),
	"isAvailable" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"logoUrl" varchar(1000),
	"websiteUrl" varchar(1000),
	"tier" varchar(50),
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"permissions" jsonb NOT NULL,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT "role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "systemSetting" (
	"id" serial PRIMARY KEY NOT NULL,
	"keyName" varchar(255) NOT NULL,
	"valueData" text NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "systemSetting_keyName_unique" UNIQUE("keyName")
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"rewardXp" integer DEFAULT 0 NOT NULL,
	"formTemplateId" integer,
	"deadline" timestamp NOT NULL,
	"createdById" integer NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "taskSubmission" (
	"id" serial PRIMARY KEY NOT NULL,
	"taskId" integer NOT NULL,
	"memberId" integer NOT NULL,
	"fileUrl" varchar(1000),
	"formSubmissionId" integer,
	"status" varchar(50) NOT NULL,
	"feedback" text,
	"reviewedById" integer,
	"submittedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"npm" varchar(255),
	"positionName" varchar(255),
	"isActive" boolean DEFAULT true NOT NULL,
	"roleId" integer NOT NULL,
	"departmentId" integer,
	"divisionId" integer,
	"profilePictureUrl" varchar(500),
	"totalPoints" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_npm_unique" UNIQUE("npm")
);
--> statement-breakpoint
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_memberId_user_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content" ADD CONSTRAINT "content_updatedById_user_id_fk" FOREIGN KEY ("updatedById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "division" ADD CONSTRAINT "division_departmentId_department_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."department"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formSubmission" ADD CONSTRAINT "formSubmission_formTemplateId_formTemplate_id_fk" FOREIGN KEY ("formTemplateId") REFERENCES "public"."formTemplate"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formSubmission" ADD CONSTRAINT "formSubmission_memberId_user_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formTemplate" ADD CONSTRAINT "formTemplate_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberProfile" ADD CONSTRAINT "memberProfile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_formTemplateId_formTemplate_id_fk" FOREIGN KEY ("formTemplateId") REFERENCES "public"."formTemplate"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskSubmission" ADD CONSTRAINT "taskSubmission_taskId_task_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskSubmission" ADD CONSTRAINT "taskSubmission_memberId_user_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskSubmission" ADD CONSTRAINT "taskSubmission_formSubmissionId_formSubmission_id_fk" FOREIGN KEY ("formSubmissionId") REFERENCES "public"."formSubmission"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskSubmission" ADD CONSTRAINT "taskSubmission_reviewedById_user_id_fk" FOREIGN KEY ("reviewedById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_departmentId_department_id_fk" FOREIGN KEY ("departmentId") REFERENCES "public"."department"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_divisionId_division_id_fk" FOREIGN KEY ("divisionId") REFERENCES "public"."division"("id") ON DELETE no action ON UPDATE no action;