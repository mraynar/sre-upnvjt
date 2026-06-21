import postgres from "postgres";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './src/db/schema.js';

// Load environment variables
dotenv.config({ path: ".env.local" });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: ".env" });
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "Error: DATABASE_URL is not defined in your environment variables.",
    );
    process.exit(1);
  }

  const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');
  const client = postgres(process.env.DATABASE_URL, { ssl: isLocal ? false : 'require' });
  const db = drizzle(client, { schema });

  try {
    console.log("Seeding Database...");

    // 1. Check if SUPER_ADMIN role exists
    let adminRole = await db.query.role.findFirst({
      where: (roles, { eq }) => eq(roles.name, 'SUPER_ADMIN')
    });

    if (!adminRole) {
      console.log("Creating SUPER_ADMIN role...");
      const permissions = {
        all: ["create", "read", "update", "delete"],
      };
      await db.insert(schema.role).values({
        name: 'SUPER_ADMIN',
        permissions: permissions
      });
      adminRole = await db.query.role.findFirst({
        where: (roles, { eq }) => eq(roles.name, 'SUPER_ADMIN')
      });
    } else {
      console.log("SUPER_ADMIN role already exists.");
    }

    // 2. Check if default department exists
    let dept = await db.query.department.findFirst({
      where: (depts, { eq }) => eq(depts.code, 'PI')
    });
    if (!dept) {
      await db.insert(schema.department).values({
        name: 'Pengurus Inti',
        code: 'PI'
      });
      dept = await db.query.department.findFirst({
        where: (depts, { eq }) => eq(depts.code, 'PI')
      });
    }

    // 3. Check if default division exists
    let div = await db.query.division.findFirst({
      where: (divs, { and, eq }) => and(eq(divs.name, 'BPH'), eq(divs.departmentId, dept.id))
    });
    if (!div) {
      await db.insert(schema.division).values({
        name: 'BPH',
        departmentId: dept.id
      });
      div = await db.query.division.findFirst({
        where: (divs, { and, eq }) => and(eq(divs.name, 'BPH'), eq(divs.departmentId, dept.id))
      });
    }

    // 4. Check if super admin user exists
    const adminEmail = "admin@sreupnjatim.com";
    const existingUser = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, adminEmail)
    });

    if (existingUser) {
      console.log("Super Admin user already exists.");
    } else {
      console.log("Creating Super Admin user...");
      const hashedPassword = await bcrypt.hash("superadmin123", 10);
      await db.insert(schema.user).values({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        npm: "00000000000",
        positionName: "Super Admin",
        roleId: adminRole.id,
        departmentId: dept.id,
        divisionId: div.id,
        isActive: true,
      });
      console.log("Super Admin user created successfully!");
      console.log("-------------------------------------------");
      console.log("Email   : admin@sreupnjatim.com");
      console.log("Password: superadmin123");
      console.log("-------------------------------------------");
    }

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seed();
