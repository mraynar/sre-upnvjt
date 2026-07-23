CREATE TABLE "activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"location" varchar(255),
	"imageUrl" varchar(500),
	"date" timestamp NOT NULL,
	"type" varchar(255) NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
