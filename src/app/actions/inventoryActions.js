"use server";

import db from "@/lib/prisma";
import { inventory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createInventoryItem(data) {
  try {
    const { name, code, category, quantity, location, condition, isAvailable } = data;
    
    const [result] = await db.insert(inventory).values({
      name,
      code: code || null,
      category: category || "GENERAL",
      quantity: parseInt(quantity) || 1,
      location: location || null,
      condition: condition || "GOOD",
      isAvailable: isAvailable !== false,
    });
    
    revalidatePath("/inventory");
    return { success: true, data: { id: result.insertId, name, quantity } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateInventoryItem(id, data) {
  try {
    const { name, code, category, quantity, location, condition, isAvailable } = data;
    
    await db.update(inventory).set({
      name,
      code: code || null,
      category: category || "GENERAL",
      quantity: parseInt(quantity) || 1,
      location: location || null,
      condition: condition || "GOOD",
      isAvailable: isAvailable !== false,
    }).where(eq(inventory.id, id));
    
    revalidatePath("/inventory");
    return { success: true, data: { id, name, quantity } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteInventoryItem(id) {
  try {
    await db.delete(inventory).where(eq(inventory.id, id));
    revalidatePath("/inventory");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
