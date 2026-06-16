import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env' });
}

export default defineConfig({
  schema: './src/db/schema.js',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '4SZ41CSjcmaAJj9.root',
    password: '46Jkzcss9qHdnXas',
    database: 'test',
    ssl: { rejectUnauthorized: true }
  },
  verbose: true,
  strict: true,
});
