import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. ' +
    'Please add it to your .env.local file.'
  );
}

// `prepare: false` is required when using Supabase's transaction pooler
// (port 6543). The pooler does not support PostgreSQL prepared statements,
// so any query without this flag will throw an AggregateError at render time.
const client = postgres(process.env.DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });

