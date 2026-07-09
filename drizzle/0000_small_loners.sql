CREATE TABLE "eventRegistration" (
	"id" serial PRIMARY KEY NOT NULL,
	"eventId" integer NOT NULL,
	"fullName" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"teamName" varchar(255),
	"registrationType" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'PENDING' NOT NULL,
	"submittedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "literatureCategory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"imageUrl" varchar(1000),
	"description" text,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "literatureItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"categoryId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255),
	"year" integer,
	"driveUrl" varchar(1000) NOT NULL,
	"type" varchar(50),
	"isPublished" boolean DEFAULT false NOT NULL,
	"uploadedById" integer NOT NULL,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "memberApplication" (
	"id" serial PRIMARY KEY NOT NULL,
	"fullName" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"npm" varchar(255) NOT NULL,
	"faculty" varchar(255) NOT NULL,
	"motivation" text NOT NULL,
	"status" varchar(50) DEFAULT 'PENDING' NOT NULL,
	"reviewedById" integer,
	"appliedAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pptModule" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"notes" text,
	"coverImageUrl" varchar(1000),
	"isPublished" boolean DEFAULT false NOT NULL,
	"createdById" integer NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "pptSlide" (
	"id" serial PRIMARY KEY NOT NULL,
	"moduleId" integer NOT NULL,
	"order" integer NOT NULL,
	"title" varchar(255),
	"fileUrl" varchar(1000) NOT NULL,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "quiz" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"timeLimitMinutes" integer,
	"passingScore" integer DEFAULT 70,
	"rewardXp" integer DEFAULT 0 NOT NULL,
	"isPublished" boolean DEFAULT false NOT NULL,
	"createdById" integer NOT NULL,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "quizQuestion" (
	"id" serial PRIMARY KEY NOT NULL,
	"quizId" integer NOT NULL,
	"order" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"question" text NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb,
	"correctOptionId" varchar(50),
	"points" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizSubmission" (
	"id" serial PRIMARY KEY NOT NULL,
	"quizId" integer NOT NULL,
	"memberId" integer NOT NULL,
	"answers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"mcqScore" integer,
	"essayScore" integer,
	"totalScore" integer,
	"isPassed" boolean,
	"gradedById" integer,
	"submittedAt" timestamp,
	"gradedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "testimonial" (
	"id" serial PRIMARY KEY NOT NULL,
	"authorName" varchar(255) NOT NULL,
	"authorPosition" varchar(255) NOT NULL,
	"authorPhotoUrl" varchar(1000),
	"content" text NOT NULL,
	"isPublished" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "xpTransaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"amount" integer NOT NULL,
	"reason" varchar(255) NOT NULL,
	"sourceType" varchar(50),
	"sourceId" integer,
	"grantedById" integer,
	"createdAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "taskSubmission" DROP CONSTRAINT "taskSubmission_formSubmissionId_formSubmission_id_fk";
--> statement-breakpoint
ALTER TABLE "eventRegistration" ADD CONSTRAINT "eventRegistration_eventId_event_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "literatureItem" ADD CONSTRAINT "literatureItem_categoryId_literatureCategory_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."literatureCategory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "literatureItem" ADD CONSTRAINT "literatureItem_uploadedById_user_id_fk" FOREIGN KEY ("uploadedById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberApplication" ADD CONSTRAINT "memberApplication_reviewedById_user_id_fk" FOREIGN KEY ("reviewedById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pptModule" ADD CONSTRAINT "pptModule_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pptSlide" ADD CONSTRAINT "pptSlide_moduleId_pptModule_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."pptModule"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizQuestion" ADD CONSTRAINT "quizQuestion_quizId_quiz_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quiz"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizSubmission" ADD CONSTRAINT "quizSubmission_quizId_quiz_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quiz"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizSubmission" ADD CONSTRAINT "quizSubmission_memberId_user_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizSubmission" ADD CONSTRAINT "quizSubmission_gradedById_user_id_fk" FOREIGN KEY ("gradedById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xpTransaction" ADD CONSTRAINT "xpTransaction_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xpTransaction" ADD CONSTRAINT "xpTransaction_grantedById_user_id_fk" FOREIGN KEY ("grantedById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskSubmission" DROP COLUMN "formSubmissionId";