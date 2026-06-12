"use server";

import db from "@/lib/prisma";
import { merchandise } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createMerchandise(data) {
  try {
    const { name, price, description, imageUrl, linkUrl, isAvailable } = data;
    
    const [result] = await db.insert(merchandise).values({
      name,
      price,
      description,
      imageUrl,
      linkUrl,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    revalidatePath("/merchandise");
    revalidatePath("/");
    return { success: true, merchandise: { id: result.insertId, name } };
  } catch (error) {
    console.error("Error creating merchandise:", error);
    return { success: false, error: error.message };
  }
}

export async function updateMerchandise(id, data) {
  try {
    const { name, price, description, imageUrl, linkUrl, isAvailable } = data;
    
    await db.update(merchandise).set({
      name,
      price,
      description,
      imageUrl,
      linkUrl,
      isAvailable,
    }).where(eq(merchandise.id, id));

    revalidatePath("/merchandise");
    revalidatePath("/");
    return { success: true, merchandise: { id, name } };
  } catch (error) {
    console.error("Error updating merchandise:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMerchandise(id) {
  try {
    await db.delete(merchandise).where(eq(merchandise.id, id));

    revalidatePath("/merchandise");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting merchandise:", error);
    return { success: false, error: error.message };
  }
}

export async function getPublicMerchandise() {
  try {
    const merch = await db.query.merchandise.findMany({
      where: eq(merchandise.isAvailable, true),
      orderBy: [desc(merchandise.createdAt)]
    });
    // Serialize decimal price to number to avoid Next.js serialization warnings
    const serialized = merch.map(m => ({
      ...m,
      price: m.price ? Number(m.price) : 0
    }));
    return { success: true, data: serialized };
  } catch (error) {
    console.error("Error fetching merchandise:", error);
    return { success: false, error: error.message };
  }
}
