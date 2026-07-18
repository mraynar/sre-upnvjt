import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL);

async function main() {
  try {
    await sql`
      ALTER TABLE "task"
      ADD COLUMN IF NOT EXISTS "formTemplateId" integer,
      ADD COLUMN IF NOT EXISTS "folderId" varchar(255),
      ADD COLUMN IF NOT EXISTS "maxUploadSizeMb" integer,
      ADD COLUMN IF NOT EXISTS "allowMultipleFiles" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "submissionType" varchar(50) DEFAULT 'BOTH';
    `;
    console.log("Successfully altered 'task' table.");
  } catch (err) {
    console.error("Error altering task table:", err);
  } finally {
    await sql.end();
  }
}

main();
