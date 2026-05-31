"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInventoryItem(data) {
  try {
    const { name, code, category, quantity, location, condition, isAvailable } = data;
    
    const item = await prisma.inventory.create({
      data: {
        name,
        code: code || null,
        category: category || "GENERAL",
        quantity: parseInt(quantity) || 1,
        location: location || null,
        condition: condition || "GOOD",
        isAvailable: isAvailable !== false,
      }
    });
    
    revalidatePath("/inventory");
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateInventoryItem(id, data) {
  try {
    const { name, code, category, quantity, location, condition, isAvailable } = data;
    
    const item = await prisma.inventory.update({
      where: { id },
      data: {
        name,
        code: code || null,
        category: category || "GENERAL",
        quantity: parseInt(quantity) || 1,
        location: location || null,
        condition: condition || "GOOD",
        isAvailable: isAvailable !== false,
      }
    });
    
    revalidatePath("/inventory");
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteInventoryItem(id) {
  try {
    await prisma.inventory.delete({ where: { id } });
    revalidatePath("/inventory");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
