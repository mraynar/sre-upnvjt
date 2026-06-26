import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/db/schema.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Connecting to database...');
  const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');
  
  const client = postgres(process.env.DATABASE_URL, { ssl: isLocal ? false : 'require' });
  const db = drizzle(client, { schema });

  console.log('Seeding super admin...');
  
  // Create department if not exists
  let dept = await db.query.department.findFirst();
  if (!dept) {
    await db.insert(schema.department).values({
      name: 'System Administration',
      code: 'SYS',
    });
    dept = await db.query.department.findFirst();
  }

  // Create role if not exists
  let adminRole = await db.query.role.findFirst({
    where: (roles, { eq }) => eq(roles.name, 'SUPER_ADMIN')
  });

  if (!adminRole) {
    await db.insert(schema.role).values({
      name: 'SUPER_ADMIN',
      permissions: { all: true },
    });
    adminRole = await db.query.role.findFirst({
      where: (roles, { eq }) => eq(roles.name, 'SUPER_ADMIN')
    });
  }

  // Check if super admin user exists
  const existingUser = await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.email, 'admin@sre.co.id')
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(schema.user).values({
      name: 'Super Administrator',
      email: 'admin@sre.co.id',
      password: hashedPassword,
      isActive: true,
      roleId: adminRole.id,
      departmentId: dept.id,
    });
    console.log('Super admin created: admin@sre.co.id / admin123');
  } else {
    console.log('Super admin already exists.');
  }

  console.log('Seeding finished.');
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
