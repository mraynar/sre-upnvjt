import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

let client;

if (process.env.NODE_ENV === 'production') {
  client = postgres(process.env.DATABASE_URL, { ssl: 'require' });
} else {
  if (!global.postgresClient) {
    global.postgresClient = postgres(process.env.DATABASE_URL);
  }
  client = global.postgresClient;
}

export const db = drizzle(client, { schema });
