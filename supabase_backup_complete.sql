


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "drizzle";


ALTER SCHEMA "drizzle" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    "id" integer NOT NULL,
    "hash" "text" NOT NULL,
    "created_at" bigint
);


ALTER TABLE "drizzle"."__drizzle_migrations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "drizzle"."__drizzle_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNED BY "drizzle"."__drizzle_migrations"."id";



CREATE TABLE IF NOT EXISTS "public"."announcement" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "imageUrl" character varying(1000),
    "actionLink" character varying(1000),
    "content" "text" NOT NULL,
    "targetAudience" character varying(255),
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" integer NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."announcement" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."announcement_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."announcement_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."announcement_id_seq" OWNED BY "public"."announcement"."id";



CREATE TABLE IF NOT EXISTS "public"."attendance" (
    "id" integer NOT NULL,
    "memberId" integer NOT NULL,
    "status" character varying(50) NOT NULL,
    "notes" "text",
    "createdAt" timestamp without time zone NOT NULL,
    "sessionId" integer NOT NULL
);


ALTER TABLE "public"."attendance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attendanceSession" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "date" timestamp without time zone NOT NULL,
    "startTime" timestamp without time zone,
    "endTime" timestamp without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" integer NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "token" character varying(50)
);


ALTER TABLE "public"."attendanceSession" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."attendanceSession_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."attendanceSession_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."attendanceSession_id_seq" OWNED BY "public"."attendanceSession"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."attendance_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."attendance_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."attendance_id_seq" OWNED BY "public"."attendance"."id";



CREATE TABLE IF NOT EXISTS "public"."content" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "body" "text" NOT NULL,
    "imageUrl" character varying(1000),
    "isPublished" boolean DEFAULT false NOT NULL,
    "updatedById" integer NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."content" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."content_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."content_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."content_id_seq" OWNED BY "public"."content"."id";



CREATE TABLE IF NOT EXISTS "public"."department" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "code" character varying(255) NOT NULL
);


ALTER TABLE "public"."department" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."department_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."department_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."department_id_seq" OWNED BY "public"."department"."id";



CREATE TABLE IF NOT EXISTS "public"."division" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "departmentId" integer NOT NULL
);


ALTER TABLE "public"."division" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."division_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."division_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."division_id_seq" OWNED BY "public"."division"."id";



CREATE TABLE IF NOT EXISTS "public"."documentCategory" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "createdAt" timestamp without time zone
);


ALTER TABLE "public"."documentCategory" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."documentCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."documentCategory_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."documentCategory_id_seq" OWNED BY "public"."documentCategory"."id";



CREATE TABLE IF NOT EXISTS "public"."documentItem" (
    "id" integer NOT NULL,
    "categoryId" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "fileUrl" character varying(1000) NOT NULL,
    "uploadedById" integer NOT NULL,
    "createdAt" timestamp without time zone
);


ALTER TABLE "public"."documentItem" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."documentItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."documentItem_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."documentItem_id_seq" OWNED BY "public"."documentItem"."id";



CREATE TABLE IF NOT EXISTS "public"."event" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "bannerUrl" character varying(1000),
    "eventDate" timestamp without time zone NOT NULL,
    "location" character varying(255),
    "category" character varying(255),
    "registrationType" character varying(255),
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."event" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."eventRegistration" (
    "id" integer NOT NULL,
    "eventId" integer NOT NULL,
    "fullName" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "teamName" character varying(255),
    "registrationType" character varying(50) NOT NULL,
    "status" character varying(50) DEFAULT 'PENDING'::character varying NOT NULL,
    "submittedAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."eventRegistration" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."eventRegistration_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."eventRegistration_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."eventRegistration_id_seq" OWNED BY "public"."eventRegistration"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."event_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."event_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."event_id_seq" OWNED BY "public"."event"."id";



CREATE TABLE IF NOT EXISTS "public"."literatureCategory" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "imageUrl" character varying(1000),
    "description" "text",
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."literatureCategory" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."literatureCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."literatureCategory_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."literatureCategory_id_seq" OWNED BY "public"."literatureCategory"."id";



CREATE TABLE IF NOT EXISTS "public"."literatureItem" (
    "id" integer NOT NULL,
    "categoryId" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "author" character varying(255),
    "year" integer,
    "driveUrl" character varying(1000) NOT NULL,
    "type" character varying(50),
    "isPublished" boolean DEFAULT false NOT NULL,
    "uploadedById" integer NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."literatureItem" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."literatureItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."literatureItem_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."literatureItem_id_seq" OWNED BY "public"."literatureItem"."id";



CREATE TABLE IF NOT EXISTS "public"."memberApplication" (
    "id" integer NOT NULL,
    "fullName" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "npm" character varying(255) NOT NULL,
    "faculty" character varying(255) NOT NULL,
    "motivation" "text" NOT NULL,
    "status" character varying(50) DEFAULT 'PENDING'::character varying NOT NULL,
    "reviewedById" integer,
    "appliedAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."memberApplication" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."memberApplication_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."memberApplication_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."memberApplication_id_seq" OWNED BY "public"."memberApplication"."id";



CREATE TABLE IF NOT EXISTS "public"."memberProfile" (
    "userId" integer NOT NULL,
    "xp" integer DEFAULT 0 NOT NULL,
    "level" integer DEFAULT 1 NOT NULL
);


ALTER TABLE "public"."memberProfile" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."merchandise" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "description" "text" NOT NULL,
    "imageUrl" character varying(1000),
    "linkUrl" character varying(1000),
    "isAvailable" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."merchandise" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."merchandise_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."merchandise_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."merchandise_id_seq" OWNED BY "public"."merchandise"."id";



CREATE TABLE IF NOT EXISTS "public"."partner" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "logoUrl" character varying(1000),
    "websiteUrl" character varying(1000),
    "tier" character varying(50),
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."partner" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."partner_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."partner_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."partner_id_seq" OWNED BY "public"."partner"."id";



CREATE TABLE IF NOT EXISTS "public"."pptModule" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "coverImageUrl" character varying(1000),
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdById" integer NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL,
    "notes" "text"
);


ALTER TABLE "public"."pptModule" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pptModule_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pptModule_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pptModule_id_seq" OWNED BY "public"."pptModule"."id";



CREATE TABLE IF NOT EXISTS "public"."pptSlide" (
    "id" integer NOT NULL,
    "moduleId" integer NOT NULL,
    "order" integer NOT NULL,
    "title" character varying(255),
    "fileUrl" character varying(1000) NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."pptSlide" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pptSlide_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pptSlide_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pptSlide_id_seq" OWNED BY "public"."pptSlide"."id";



CREATE TABLE IF NOT EXISTS "public"."quiz" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "timeLimitMinutes" integer,
    "passingScore" integer DEFAULT 70,
    "rewardXp" integer DEFAULT 0 NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdById" integer NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."quiz" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quizQuestion" (
    "id" integer NOT NULL,
    "quizId" integer NOT NULL,
    "order" integer NOT NULL,
    "type" character varying(50) NOT NULL,
    "question" "text" NOT NULL,
    "options" "jsonb" DEFAULT '[]'::"jsonb",
    "correctOptionId" character varying(50),
    "points" integer DEFAULT 1 NOT NULL
);


ALTER TABLE "public"."quizQuestion" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."quizQuestion_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."quizQuestion_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."quizQuestion_id_seq" OWNED BY "public"."quizQuestion"."id";



CREATE TABLE IF NOT EXISTS "public"."quizSubmission" (
    "id" integer NOT NULL,
    "quizId" integer NOT NULL,
    "memberId" integer NOT NULL,
    "answers" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "mcqScore" integer,
    "essayScore" integer,
    "totalScore" integer,
    "isPassed" boolean,
    "gradedById" integer,
    "submittedAt" timestamp without time zone NOT NULL,
    "gradedAt" timestamp without time zone
);


ALTER TABLE "public"."quizSubmission" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."quizSubmission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."quizSubmission_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."quizSubmission_id_seq" OWNED BY "public"."quizSubmission"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."quiz_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."quiz_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."quiz_id_seq" OWNED BY "public"."quiz"."id";



CREATE TABLE IF NOT EXISTS "public"."role" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "permissions" "jsonb" NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."role" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."role_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."role_id_seq" OWNED BY "public"."role"."id";



CREATE TABLE IF NOT EXISTS "public"."shortlink" (
    "id" bigint NOT NULL,
    "slug" character varying NOT NULL,
    "originalUrl" "text" NOT NULL,
    "description" character varying,
    "clicks" bigint,
    "createdById" integer,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."shortlink" OWNER TO "postgres";


ALTER TABLE "public"."shortlink" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."shortlink_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."systemSetting" (
    "id" integer NOT NULL,
    "keyName" character varying(255) NOT NULL,
    "valueData" "text" NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."systemSetting" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."systemSetting_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."systemSetting_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."systemSetting_id_seq" OWNED BY "public"."systemSetting"."id";



CREATE TABLE IF NOT EXISTS "public"."task" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "rewardXp" integer DEFAULT 0 NOT NULL,
    "deadline" timestamp without time zone NOT NULL,
    "createdById" integer NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "formTemplateId" integer,
    "folderId" character varying(255),
    "maxUploadSizeMb" integer,
    "allowMultipleFiles" boolean DEFAULT false,
    "submissionType" character varying(50) DEFAULT 'BOTH'::character varying
);


ALTER TABLE "public"."task" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."taskSubmission" (
    "id" integer NOT NULL,
    "taskId" integer NOT NULL,
    "memberId" integer NOT NULL,
    "fileUrl" character varying(1000),
    "status" character varying(50) NOT NULL,
    "feedback" "text",
    "reviewedById" integer,
    "submittedAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."taskSubmission" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."taskSubmission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."taskSubmission_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."taskSubmission_id_seq" OWNED BY "public"."taskSubmission"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."task_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."task_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."task_id_seq" OWNED BY "public"."task"."id";



CREATE TABLE IF NOT EXISTS "public"."testimonial" (
    "id" integer NOT NULL,
    "authorName" character varying(255) NOT NULL,
    "authorPosition" character varying(255) NOT NULL,
    "authorPhotoUrl" character varying(1000),
    "content" "text" NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."testimonial" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."testimonial_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."testimonial_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."testimonial_id_seq" OWNED BY "public"."testimonial"."id";



CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "password" character varying(255) NOT NULL,
    "npm" character varying(255),
    "positionName" character varying(255),
    "isActive" boolean DEFAULT true NOT NULL,
    "roleId" integer NOT NULL,
    "departmentId" integer,
    "divisionId" integer,
    "profilePictureUrl" character varying(500),
    "totalPoints" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."user" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_id_seq" OWNED BY "public"."user"."id";



CREATE TABLE IF NOT EXISTS "public"."xpTransaction" (
    "id" integer NOT NULL,
    "userId" integer NOT NULL,
    "amount" integer NOT NULL,
    "reason" character varying(255) NOT NULL,
    "sourceType" character varying(50),
    "sourceId" integer,
    "grantedById" integer,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE "public"."xpTransaction" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."xpTransaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."xpTransaction_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."xpTransaction_id_seq" OWNED BY "public"."xpTransaction"."id";



ALTER TABLE ONLY "drizzle"."__drizzle_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"drizzle"."__drizzle_migrations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."announcement" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."announcement_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."attendance" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."attendance_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."attendanceSession" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."attendanceSession_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."content" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."content_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."department" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."department_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."division" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."division_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."documentCategory" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."documentCategory_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."documentItem" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."documentItem_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."event" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."event_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."eventRegistration" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."eventRegistration_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."literatureCategory" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."literatureCategory_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."literatureItem" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."literatureItem_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."memberApplication" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."memberApplication_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."merchandise" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."merchandise_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."partner" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."partner_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pptModule" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pptModule_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pptSlide" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pptSlide_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."quiz" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."quiz_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."quizQuestion" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."quizQuestion_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."quizSubmission" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."quizSubmission_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."role" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."role_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."systemSetting" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."systemSetting_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."task" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."task_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."taskSubmission" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."taskSubmission_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."testimonial" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."testimonial_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."xpTransaction" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."xpTransaction_id_seq"'::"regclass");



ALTER TABLE ONLY "drizzle"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."announcement"
    ADD CONSTRAINT "announcement_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendanceSession"
    ADD CONSTRAINT "attendanceSession_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content"
    ADD CONSTRAINT "content_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content"
    ADD CONSTRAINT "content_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."department"
    ADD CONSTRAINT "department_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."department"
    ADD CONSTRAINT "department_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."department"
    ADD CONSTRAINT "department_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."division"
    ADD CONSTRAINT "division_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documentCategory"
    ADD CONSTRAINT "documentCategory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documentItem"
    ADD CONSTRAINT "documentItem_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."eventRegistration"
    ADD CONSTRAINT "eventRegistration_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event"
    ADD CONSTRAINT "event_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."literatureCategory"
    ADD CONSTRAINT "literatureCategory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."literatureItem"
    ADD CONSTRAINT "literatureItem_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."memberApplication"
    ADD CONSTRAINT "memberApplication_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."memberProfile"
    ADD CONSTRAINT "memberProfile_pkey" PRIMARY KEY ("userId");



ALTER TABLE ONLY "public"."merchandise"
    ADD CONSTRAINT "merchandise_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."partner"
    ADD CONSTRAINT "partner_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pptModule"
    ADD CONSTRAINT "pptModule_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pptSlide"
    ADD CONSTRAINT "pptSlide_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quizQuestion"
    ADD CONSTRAINT "quizQuestion_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quizSubmission"
    ADD CONSTRAINT "quizSubmission_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quiz"
    ADD CONSTRAINT "quiz_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role"
    ADD CONSTRAINT "role_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."role"
    ADD CONSTRAINT "role_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shortlink"
    ADD CONSTRAINT "shortlink_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shortlink"
    ADD CONSTRAINT "shortlink_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."systemSetting"
    ADD CONSTRAINT "systemSetting_keyName_key" UNIQUE ("keyName");



ALTER TABLE ONLY "public"."systemSetting"
    ADD CONSTRAINT "systemSetting_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."taskSubmission"
    ADD CONSTRAINT "taskSubmission_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."task"
    ADD CONSTRAINT "task_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."testimonial"
    ADD CONSTRAINT "testimonial_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_npm_key" UNIQUE ("npm");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."xpTransaction"
    ADD CONSTRAINT "xpTransaction_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."announcement"
    ADD CONSTRAINT "announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."attendanceSession"
    ADD CONSTRAINT "attendanceSession_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."attendanceSession"("id");



ALTER TABLE ONLY "public"."content"
    ADD CONSTRAINT "content_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."division"
    ADD CONSTRAINT "division_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."department"("id");



ALTER TABLE ONLY "public"."documentItem"
    ADD CONSTRAINT "documentItem_categoryId_documentCategory_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."documentCategory"("id");



ALTER TABLE ONLY "public"."documentItem"
    ADD CONSTRAINT "documentItem_uploadedById_user_id_fk" FOREIGN KEY ("uploadedById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."eventRegistration"
    ADD CONSTRAINT "eventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id");



ALTER TABLE ONLY "public"."literatureItem"
    ADD CONSTRAINT "literatureItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."literatureCategory"("id");



ALTER TABLE ONLY "public"."literatureItem"
    ADD CONSTRAINT "literatureItem_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."memberApplication"
    ADD CONSTRAINT "memberApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."memberProfile"
    ADD CONSTRAINT "memberProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."pptModule"
    ADD CONSTRAINT "pptModule_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."pptSlide"
    ADD CONSTRAINT "pptSlide_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."pptModule"("id");



ALTER TABLE ONLY "public"."quizQuestion"
    ADD CONSTRAINT "quizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."quiz"("id");



ALTER TABLE ONLY "public"."quizSubmission"
    ADD CONSTRAINT "quizSubmission_gradedById_fkey" FOREIGN KEY ("gradedById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."quizSubmission"
    ADD CONSTRAINT "quizSubmission_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."quizSubmission"
    ADD CONSTRAINT "quizSubmission_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."quiz"("id");



ALTER TABLE ONLY "public"."quiz"
    ADD CONSTRAINT "quiz_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."shortlink"
    ADD CONSTRAINT "shortlink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."taskSubmission"
    ADD CONSTRAINT "taskSubmission_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."taskSubmission"
    ADD CONSTRAINT "taskSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."taskSubmission"
    ADD CONSTRAINT "taskSubmission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."task"("id");



ALTER TABLE ONLY "public"."task"
    ADD CONSTRAINT "task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."department"("id");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "public"."division"("id");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."role"("id");



ALTER TABLE ONLY "public"."xpTransaction"
    ADD CONSTRAINT "xpTransaction_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "public"."user"("id");



ALTER TABLE ONLY "public"."xpTransaction"
    ADD CONSTRAINT "xpTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id");



ALTER TABLE "public"."shortlink" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





































































































































































GRANT ALL ON TABLE "public"."announcement" TO "anon";
GRANT ALL ON TABLE "public"."announcement" TO "authenticated";
GRANT ALL ON TABLE "public"."announcement" TO "service_role";



GRANT ALL ON SEQUENCE "public"."announcement_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."announcement_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."announcement_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."attendance" TO "anon";
GRANT ALL ON TABLE "public"."attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."attendance" TO "service_role";



GRANT ALL ON TABLE "public"."attendanceSession" TO "anon";
GRANT ALL ON TABLE "public"."attendanceSession" TO "authenticated";
GRANT ALL ON TABLE "public"."attendanceSession" TO "service_role";



GRANT ALL ON SEQUENCE "public"."attendanceSession_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."attendanceSession_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."attendanceSession_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."attendance_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."attendance_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."attendance_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."content" TO "anon";
GRANT ALL ON TABLE "public"."content" TO "authenticated";
GRANT ALL ON TABLE "public"."content" TO "service_role";



GRANT ALL ON SEQUENCE "public"."content_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."content_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."content_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."department" TO "anon";
GRANT ALL ON TABLE "public"."department" TO "authenticated";
GRANT ALL ON TABLE "public"."department" TO "service_role";



GRANT ALL ON SEQUENCE "public"."department_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."department_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."department_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."division" TO "anon";
GRANT ALL ON TABLE "public"."division" TO "authenticated";
GRANT ALL ON TABLE "public"."division" TO "service_role";



GRANT ALL ON SEQUENCE "public"."division_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."division_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."division_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."documentCategory" TO "anon";
GRANT ALL ON TABLE "public"."documentCategory" TO "authenticated";
GRANT ALL ON TABLE "public"."documentCategory" TO "service_role";



GRANT ALL ON SEQUENCE "public"."documentCategory_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."documentCategory_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."documentCategory_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."documentItem" TO "anon";
GRANT ALL ON TABLE "public"."documentItem" TO "authenticated";
GRANT ALL ON TABLE "public"."documentItem" TO "service_role";



GRANT ALL ON SEQUENCE "public"."documentItem_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."documentItem_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."documentItem_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."event" TO "anon";
GRANT ALL ON TABLE "public"."event" TO "authenticated";
GRANT ALL ON TABLE "public"."event" TO "service_role";



GRANT ALL ON TABLE "public"."eventRegistration" TO "anon";
GRANT ALL ON TABLE "public"."eventRegistration" TO "authenticated";
GRANT ALL ON TABLE "public"."eventRegistration" TO "service_role";



GRANT ALL ON SEQUENCE "public"."eventRegistration_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."eventRegistration_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."eventRegistration_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."event_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."event_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."event_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."literatureCategory" TO "anon";
GRANT ALL ON TABLE "public"."literatureCategory" TO "authenticated";
GRANT ALL ON TABLE "public"."literatureCategory" TO "service_role";



GRANT ALL ON SEQUENCE "public"."literatureCategory_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."literatureCategory_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."literatureCategory_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."literatureItem" TO "anon";
GRANT ALL ON TABLE "public"."literatureItem" TO "authenticated";
GRANT ALL ON TABLE "public"."literatureItem" TO "service_role";



GRANT ALL ON SEQUENCE "public"."literatureItem_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."literatureItem_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."literatureItem_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."memberApplication" TO "anon";
GRANT ALL ON TABLE "public"."memberApplication" TO "authenticated";
GRANT ALL ON TABLE "public"."memberApplication" TO "service_role";



GRANT ALL ON SEQUENCE "public"."memberApplication_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."memberApplication_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."memberApplication_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."memberProfile" TO "anon";
GRANT ALL ON TABLE "public"."memberProfile" TO "authenticated";
GRANT ALL ON TABLE "public"."memberProfile" TO "service_role";



GRANT ALL ON TABLE "public"."merchandise" TO "anon";
GRANT ALL ON TABLE "public"."merchandise" TO "authenticated";
GRANT ALL ON TABLE "public"."merchandise" TO "service_role";



GRANT ALL ON SEQUENCE "public"."merchandise_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."merchandise_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."merchandise_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."partner" TO "anon";
GRANT ALL ON TABLE "public"."partner" TO "authenticated";
GRANT ALL ON TABLE "public"."partner" TO "service_role";



GRANT ALL ON SEQUENCE "public"."partner_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."partner_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."partner_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pptModule" TO "anon";
GRANT ALL ON TABLE "public"."pptModule" TO "authenticated";
GRANT ALL ON TABLE "public"."pptModule" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pptModule_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pptModule_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pptModule_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pptSlide" TO "anon";
GRANT ALL ON TABLE "public"."pptSlide" TO "authenticated";
GRANT ALL ON TABLE "public"."pptSlide" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pptSlide_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pptSlide_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pptSlide_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."quiz" TO "anon";
GRANT ALL ON TABLE "public"."quiz" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz" TO "service_role";



GRANT ALL ON TABLE "public"."quizQuestion" TO "anon";
GRANT ALL ON TABLE "public"."quizQuestion" TO "authenticated";
GRANT ALL ON TABLE "public"."quizQuestion" TO "service_role";



GRANT ALL ON SEQUENCE "public"."quizQuestion_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quizQuestion_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quizQuestion_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."quizSubmission" TO "anon";
GRANT ALL ON TABLE "public"."quizSubmission" TO "authenticated";
GRANT ALL ON TABLE "public"."quizSubmission" TO "service_role";



GRANT ALL ON SEQUENCE "public"."quizSubmission_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quizSubmission_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quizSubmission_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."quiz_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quiz_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quiz_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."role" TO "anon";
GRANT ALL ON TABLE "public"."role" TO "authenticated";
GRANT ALL ON TABLE "public"."role" TO "service_role";



GRANT ALL ON SEQUENCE "public"."role_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."role_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."role_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."shortlink" TO "anon";
GRANT ALL ON TABLE "public"."shortlink" TO "authenticated";
GRANT ALL ON TABLE "public"."shortlink" TO "service_role";



GRANT ALL ON SEQUENCE "public"."shortlink_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."shortlink_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."shortlink_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."systemSetting" TO "anon";
GRANT ALL ON TABLE "public"."systemSetting" TO "authenticated";
GRANT ALL ON TABLE "public"."systemSetting" TO "service_role";



GRANT ALL ON SEQUENCE "public"."systemSetting_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."systemSetting_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."systemSetting_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."task" TO "anon";
GRANT ALL ON TABLE "public"."task" TO "authenticated";
GRANT ALL ON TABLE "public"."task" TO "service_role";



GRANT ALL ON TABLE "public"."taskSubmission" TO "anon";
GRANT ALL ON TABLE "public"."taskSubmission" TO "authenticated";
GRANT ALL ON TABLE "public"."taskSubmission" TO "service_role";



GRANT ALL ON SEQUENCE "public"."taskSubmission_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."taskSubmission_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."taskSubmission_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."task_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."task_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."task_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."testimonial" TO "anon";
GRANT ALL ON TABLE "public"."testimonial" TO "authenticated";
GRANT ALL ON TABLE "public"."testimonial" TO "service_role";



GRANT ALL ON SEQUENCE "public"."testimonial_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."testimonial_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."testimonial_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."xpTransaction" TO "anon";
GRANT ALL ON TABLE "public"."xpTransaction" TO "authenticated";
GRANT ALL ON TABLE "public"."xpTransaction" TO "service_role";



GRANT ALL ON SEQUENCE "public"."xpTransaction_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."xpTransaction_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."xpTransaction_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































