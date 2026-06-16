import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '@/db/schema';

let poolConnection;

if (process.env.NODE_ENV === 'production') {
  poolConnection = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  if (!global.poolConnection) {
    global.poolConnection = mysql.createPool({
      uri: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  poolConnection = global.poolConnection;
}

export const db = drizzle(poolConnection, { schema, mode: 'planetscale' });
