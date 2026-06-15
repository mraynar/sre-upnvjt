import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

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

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log("Seeding Database...");

    // 1. Check if SUPER_ADMIN role exists
    const [roles] = await connection.query(
      `SELECT id FROM \`Role\` WHERE name = 'SUPER_ADMIN'`,
    );
    let roleId;

    if (roles.length > 0) {
      roleId = roles[0].id;
      console.log("SUPER_ADMIN role already exists.");
    } else {
      console.log("Creating SUPER_ADMIN role...");
      const permissions = JSON.stringify({
        all: ["create", "read", "update", "delete"],
      });
      const [result] = await connection.query(
        `INSERT INTO \`Role\` (name, permissions) VALUES (?, ?)`,
        ["SUPER_ADMIN", permissions],
      );
      roleId = result.insertId;
    }

    // 2. Check if super admin user exists
    const adminEmail = "admin@sreupnjatim.com";
    const [users] = await connection.query(
      `SELECT id FROM \`User\` WHERE email = ?`,
      [adminEmail],
    );

    if (users.length > 0) {
      console.log("Super Admin user already exists.");
    } else {
      // 2. Check if default department exists
      const [departments] = await connection.query(`SELECT id FROM \`Department\` WHERE code = 'PI'`);
      let departmentId;
      if (departments.length > 0) {
        departmentId = departments[0].id;
      } else {
        const [deptResult] = await connection.query(
          `INSERT INTO \`Department\` (name, code) VALUES (?, ?)`,
          ['Pengurus Inti', 'PI']
        );
        departmentId = deptResult.insertId;
      }

      // 3. Check if default division exists
      const [divisions] = await connection.query(`SELECT id FROM \`Division\` WHERE name = 'BPH' AND departmentId = ?`, [departmentId]);
      let divisionId;
      if (divisions.length > 0) {
        divisionId = divisions[0].id;
      } else {
        const [divResult] = await connection.query(
          `INSERT INTO \`Division\` (name, departmentId) VALUES (?, ?)`,
          ['BPH', departmentId]
        );
        divisionId = divResult.insertId;
      }

      console.log("Creating Super Admin user...");
      const hashedPassword = await bcrypt.hash("superadmin123", 10);

      const now = new Date();
      await connection.query(
        `INSERT INTO \`User\` (name, email, password, npm, positionName, roleId, departmentId, divisionId, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ["Super Admin", adminEmail, hashedPassword, "00000000000", "Super Admin", roleId, departmentId, divisionId, true, now, now],
      );
      console.log("Super Admin user created successfully!");
      console.log("-------------------------------------------");
      console.log("Email   : admin@sreupnjatim.com");
      console.log("Password: password123");
      console.log("-------------------------------------------");
    }

    console.log("Seeding complete.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await connection.end();
  }
}

seed();
