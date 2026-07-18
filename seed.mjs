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

  console.log('Seeding member...');

  // Create member role if not exists
  let memberRole = await db.query.role.findFirst({
    where: (roles, { eq }) => eq(roles.name, 'MEMBER')
  });

  if (!memberRole) {
    await db.insert(schema.role).values({
      name: 'MEMBER',
      permissions: {},
    });
    memberRole = await db.query.role.findFirst({
      where: (roles, { eq }) => eq(roles.name, 'MEMBER')
    });
  }

  // Check if member user exists
  const existingMember = await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.email, 'member@sre.co.id')
  });

  if (!existingMember) {
    const hashedMemberPassword = await bcrypt.hash('member123', 10);
    await db.insert(schema.user).values({
      name: 'Default Member',
      email: 'member@sre.co.id',
      password: hashedMemberPassword,
      isActive: true,
      roleId: memberRole.id,
      departmentId: dept.id,
    });
    console.log('Member created: member@sre.co.id / member123');
  } else {
    console.log('Member already exists.');
  }

  // Ensure member profile exists
  const memberUser = await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.email, 'member@sre.co.id')
  });

  if (memberUser) {
    const existingProfile = await db.query.memberProfile.findFirst({
      where: (profiles, { eq }) => eq(profiles.userId, memberUser.id)
    });

    if (!existingProfile) {
      await db.insert(schema.memberProfile).values({
        userId: memberUser.id,
        xp: 0,
        level: 1,
      });
      console.log('Member profile created.');
    } else {
      console.log('Member profile already exists.');
    }
  }

  console.log('Seeding staff...');

  // Create staff role if not exists
  let staffRole = await db.query.role.findFirst({
    where: (roles, { eq }) => eq(roles.name, 'STAFF')
  });

  if (!staffRole) {
    await db.insert(schema.role).values({
      name: 'STAFF',
      permissions: {},
    });
    staffRole = await db.query.role.findFirst({
      where: (roles, { eq }) => eq(roles.name, 'STAFF')
    });
  }

  // Check if staff user exists
  const existingStaff = await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.email, 'staff@sre.co.id')
  });

  if (!existingStaff) {
    const hashedStaffPassword = await bcrypt.hash('password123', 10);
    await db.insert(schema.user).values({
      name: 'Staff Contoh',
      email: 'staff@sre.co.id',
      password: hashedStaffPassword,
      npm: '2023000001',
      positionName: 'Staff Operations',
      isActive: true,
      roleId: staffRole.id,
      departmentId: dept.id,
    });
    console.log('Staff created: staff@sre.co.id / password123');
  } else {
    console.log('Staff already exists.');
  }

  console.log('Seeding finished.');
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
