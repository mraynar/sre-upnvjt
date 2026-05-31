"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        department: true,
        division: true
      },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function createUser(data) {
  try {
    const { name, email, password, npm, positionName, isActive, roleId, departmentId, divisionId } = data;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { success: false, error: "Email already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        npm: npm || null,
        positionName: positionName || null,
        isActive: isActive === "true" || isActive === true,
        roleId: parseInt(roleId),
        departmentId: departmentId ? parseInt(departmentId) : null,
        divisionId: divisionId ? parseInt(divisionId) : null,
      }
    });
    revalidatePath("/users");
    return { success: true, data: user };
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

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });
    revalidatePath("/users");
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(id) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
