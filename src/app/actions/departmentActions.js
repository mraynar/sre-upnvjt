"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function getDepartments() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        divisions: true,
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: "asc" }
    });
    return { success: true, data: departments };
  } catch (error) {
    return { success: false, error: "Failed to fetch departments" };
  }
}

export async function createDepartment(data) {
  try {
    const { name, code } = data;
    const dept = await prisma.department.create({
      data: { name, code }
    });
    revalidatePath("/departments");
    return { success: true, data: dept };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateDepartment(id, data) {
  try {
    const { name, code } = data;
    const dept = await prisma.department.update({
      where: { id },
      data: { name, code }
    });
    revalidatePath("/departments");
    return { success: true, data: dept };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteDepartment(id) {
  try {
    await prisma.department.delete({ where: { id } });
    revalidatePath("/departments");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


export async function createDivision(data) {
  try {
    const { name, departmentId } = data;
    const div = await prisma.division.create({
      data: { name, departmentId }
    });
    revalidatePath("/departments");
    return { success: true, data: div };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateDivision(id, data) {
  try {
    const { name, departmentId } = data;
    const div = await prisma.division.update({
      where: { id },
      data: { name, departmentId }
    });
    revalidatePath("/departments");
    return { success: true, data: div };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteDivision(id) {
  try {
    await prisma.division.delete({ where: { id } });
    revalidatePath("/departments");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
