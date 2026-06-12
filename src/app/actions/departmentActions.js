"use server";

import db from "@/lib/prisma";
import { department, division } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getDepartments() {
  try {
    const depts = await db.query.department.findMany({
      with: {
        divisions: true,
        users: { columns: { id: true } }
      },
      orderBy: [asc(department.name)]
    });
    
    const formattedDepts = depts.map(d => {
      const { users, ...rest } = d;
      return { ...rest, _count: { users: users.length } };
    });
    
    return { success: true, data: formattedDepts };
  } catch (error) {
    return { success: false, error: "Failed to fetch departments" };
  }
}

export async function createDepartment(data) {
  try {
    const { name, code } = data;
    const [result] = await db.insert(department).values({ name, code });
    revalidatePath("/departments");
    return { success: true, data: { id: result.insertId, name, code } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateDepartment(id, data) {
  try {
    const { name, code } = data;
    await db.update(department).set({ name, code }).where(eq(department.id, id));
    revalidatePath("/departments");
    return { success: true, data: { id, name, code } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteDepartment(id) {
  try {
    await db.delete(department).where(eq(department.id, id));
    revalidatePath("/departments");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createDivision(data) {
  try {
    const { name, departmentId } = data;
    const [result] = await db.insert(division).values({ name, departmentId });
    revalidatePath("/departments");
    return { success: true, data: { id: result.insertId, name, departmentId } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateDivision(id, data) {
  try {
    const { name, departmentId } = data;
    await db.update(division).set({ name, departmentId }).where(eq(division.id, id));
    revalidatePath("/departments");
    return { success: true, data: { id, name, departmentId } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteDivision(id) {
  try {
    await db.delete(division).where(eq(division.id, id));
    revalidatePath("/departments");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
