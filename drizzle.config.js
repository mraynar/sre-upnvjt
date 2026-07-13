import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import fs from 'fs';

// Prioritize .env.local if it exists; otherwise, fall back to .env
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
}

// Validate the existence of the critical connection string before initialization
if (!process.env.DATABASE_URL) {
  throw new Error("Critical Error: DATABASE_URL is not defined in either .env or .env.local files.");
}

export default defineConfig({
  schema: './src/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: false,
});