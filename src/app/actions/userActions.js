"use server";

import db from "@/lib/prisma";
import { user } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsers() {
  try {
    const users = await db.query.user.findMany({
      with: {
        role: true,
        department: true,
        division: true
      },
      orderBy: [desc(user.createdAt)]
    });
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function createUser(data) {
  try {
    const { name, email, password, npm, positionName, isActive, roleId, departmentId, divisionId } = data;
    
    const existingUser = await db.query.user.findFirst({ where: eq(user.email, email) });
    if (existingUser) return { success: false, error: "Email already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.insert(user).values({
      name,
      email,
      password: hashedPassword,
      npm: npm || null,
      positionName: positionName || null,
      isActive: isActive === "true" || isActive === true,
      roleId: parseInt(roleId),
      departmentId: departmentId ? parseInt(departmentId) : null,
      divisionId: divisionId ? parseInt(divisionId) : null,
    });
    revalidatePath("/users");
    return { success: true, data: { id: result.insertId, name, email } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateUser(id, data) {
  try {
    const { name, email, password, npm, positionName, isActive, roleId, departmentId, divisionId } = data;
    
    const updateData = {
      name,
      email,
      npm: npm || null,
      positionName: positionName || null,
      isActive: isActive === "true" || isActive === true,
      roleId: parseInt(roleId),
      departmentId: departmentId ? parseInt(departmentId) : null,
      divisionId: divisionId ? parseInt(divisionId) : null,
    };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await db.update(user).set(updateData).where(eq(user.id, id));
    revalidatePath("/users");
    return { success: true, data: { id, name, email } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(id) {
  try {
    await db.delete(user).where(eq(user.id, id));
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
